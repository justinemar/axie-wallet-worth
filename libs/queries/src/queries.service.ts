import { HttpException, Injectable } from '@nestjs/common';
import { getBriftList, getExact } from '.'
import { CacheService } from '@redis/cache';
import fetch from 'node-fetch';
import { AxieGene } from "agp-npm/dist/axie-gene"; // Defaults to HexType.Bit256

@Injectable()
export class QueriesService {
    constructor(
      private cacheManager: CacheService
      ) {}

    async refreshAxies(roninAddress: string) : Promise<any> {
        return this.getAxieList(roninAddress, true);
    }

    async getAxieList(roninAddress: string, refresh = false): Promise<any> {
        roninAddress = roninAddress.replace('ronin:', '0x');
        const cached = await this.cacheManager.get(`getAllAxies-${roninAddress}`)
        if(cached && !refresh) {
          console.info("Get axie list from cached");
          return await this.buildAxieCached(cached)
        }

        console.info("Get axie list from graphql");
        const getAllAxies = {
            "operationName": "GetAxieBriefList",
            "variables": {
              "from": 0,
              "size": 100,
              "sort": "IdDesc",
              "auctionType": "All",
              "owner": roninAddress,
              "criteria": {
                "region": null,
                "parts": null,
                "bodyShapes": null,
                "classes": null,
                "stages": null,
                "numMystic": null,
                "pureness": null,
                "title": null,
                "breedable": null,
                "breedCount": null,
                "hp": [],
                "skill": [],
                "speed": [],
                "morale": [],
              },
            },
            "query": getBriftList,
          };

          try {
            const response = await fetch("https://graphql-gateway.axieinfinity.com/graphql", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(getAllAxies)
            })

            const res = await response.json();
            await this.cacheManager.set(`getAllAxies-${roninAddress}`, res);
            return await this.getAxieMarket(res)
          } catch(err) {
            console.log(err)
            throw new HttpException(err?.response?.data, err?.response?.status);
          }


    }

    async buildAxieCached(cache): Promise<any> {
      const response = await Promise.all(
        cache.data.axies.results.map(async (axie) => {
        let cachedAxie = await this.cacheManager.get(`getAxieExact-${axie.id}`);
          console.info("Build get exact axie from cached.")
          return cachedAxie;
      }));

      return await this.calculateTotal(response);
    }

    async getAxieMarket(res): Promise<any> {
      const response = await Promise.all(
        res.data.axies.results.map(async (axie) => {
        console.info("Build get exact axie from query.")
        let data: any = await this.buildQuery(axie)
        return data
      }));

      return await this.calculateTotal(response);
    }

    async buildQuery(axie) {
      return new Promise(async (resolve, reject) => {
        const axieGene = new AxieGene(axie.genes);
        const getAxieExact =  {
          "operationName": "GetAxieBriefList",
          "variables": {
            "auctionType": "Sale",
            "criteria": {
              "bodyShapes": null,
              "breedable": null,
              "breedCount": [
                axie.breedCount
              ],
              "classes": [
                axie.class
              ],
              "hp": [
                axie.stats.hp,
                61
              ],
              "morale": [
                axie.stats.morale,
                61
              ],
              "numJapan": null,
              "numMystic": null,
              "numXmas": null,
              "parts": axie.parts.slice(2).map((part) => part.id),
              "ppAquatic": null,
              "ppBeast": null,
              "ppBird": null,
              "ppBug": null,
              "ppDawn": null,
              "ppDusk": null,
              "ppMech": null,
              "ppPlant": null,
              "ppReptile": null,
              "pureness": null,
              "purity": [
                parseInt(axieGene.getGeneQuality().toFixed()),
                100
              ],
              "region": null,
              "skill": [
                axie.stats.skill,
                61
              ],
              "speed": [
                axie.stats.speed,
                61
              ],
              "stages": null,
              "title": null
            },
            "filterStuckAuctions": false,
            "from": 0,
            "owner": null,
            "size": 1,
            "sort": "PriceAsc"
          },
          "query": getExact
        }

          try {
            const response = await fetch("https://graphql-gateway.axieinfinity.com/graphql", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(getAxieExact)
            })
            let res = await response.json();
            const cachedPrice = await this.cacheManager.get(`priceAction-${axie.id}`);
            const floor_price = parseInt(res?.data?.axies?.results[0]?.auction?.currentPriceUSD);
            const previous_price = parseInt(cachedPrice?.previous_price);
            console.log('cachedPrice', cachedPrice)
            res = { 
              ...res, 
              floor_data: {
                id: axie.id, 
                axie_breedCount: axie.breedCount,
                axie_image: axie.image,
                axie_genes: axie.genes,
                axie_class: axie.class,
                previous_price,
                floor_price
              }
            
            };
            await this.cacheManager.set(`getAxieExact-${axie.id}`, res);
            await this.cacheManager.set(`priceAction-${axie.id}`, { previous_price: floor_price});
            resolve(res);
          } catch(err) {
            console.log(err)
            reject(err)
          }
      })
    }
    
   async calculateTotal(data) {
      let totalWorth = 0;
      let ranking = [];
      const noMatch = [];
      data.map((item) => {
        // hardcored filter
        if(item.floor_data.id == 4917720 || item.floor_data.id == 4917569 || item.floor_data.id == 9171436 || item.floor_data.id == 3670134) return;
        if(!item.floor_data.floor_price) noMatch.push(item.floor_data.id)
        ranking.push({
          ...item.floor_data,
          myaxie_link: `https://marketplace.axieinfinity.com/axie/${item.floor_data.id}`,
          floor_link: `https://marketplace.axieinfinity.com/axie/${item?.data?.axies?.results[0]?.id}`
        });
        totalWorth += parseInt(item.floor_data.floor_price) || 0 
      })
      ranking.sort((a, b) => b.floor_price-a.floor_price);
      return { totalWorth, noMatch, ranking };
    }
}
