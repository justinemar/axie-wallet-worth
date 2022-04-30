import { HttpException, Injectable } from '@nestjs/common';
import { getBriftList, getExact } from '.'
import { HttpService } from '@nestjs/axios';
import { catchError, map, Observable } from 'rxjs';
import { CacheService } from '@redis/cache';
import fetch from 'node-fetch';
@Injectable()
export class QueriesService {
    constructor(
      private http: HttpService,
      private cacheManager: CacheService
      ) {}
    async getAxieList(roninAddress: string): Promise<any> {
        const cached = await this.cacheManager.get('getAllAxies')
        if(cached) {
          return await this.getAxieMarket()
        }

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
            const data = await response.json();
            await this.cacheManager.set('getAllAxies', data);
            return await this.getAxieMarket()
          } catch(err) {
            console.log(err)
            throw new HttpException(err?.response?.data, err?.response?.status);
          }


    }

    async getAxieMarket(): Promise<any> {
      const cachedData = await this.cacheManager.get('getAllAxies');
      const response = await Promise.all(
        cachedData.data.axies.results.map(async (axie) => {
        const cachedAxie = await this.cacheManager.get(axie.id);
        if(cachedAxie) {
          return cachedAxie;
        }

        const data: any = await this.buildQuery(axie)
        return data
      }));

      const total = await this.calculateTotal(response);
      return { total }
    }

    async buildQuery(axie) {
      return new Promise(async (resolve, reject) => {
        const getAxieExact =  {
          "operationName": "GetAxieBriefList",
          "variables": {
            "auctionType": "Sale",
            "criteria": {
              "bodyShapes": null,
              "breedable": null,
              "breedCount": [
                axie.breedCount,
                7
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
              "pureness": [
                axie.parts.filter((p) => p.class == axie.class).length
              ],
              "purity": [
                1,
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
            const data = await response.json();
            await this.cacheManager.set(`getAxieExact-${axie.id}`, getAxieExact);
            await this.cacheManager.set(axie.id, data);
            resolve(data);
          } catch(err) {
            console.log(err)
            reject(err)
          }
      })
    }
    
   async calculateTotal(data) {
      let totalWorth = 0;
      data.map((item: any) => {
        totalWorth += parseInt(item?.data?.axies?.results[0]?.auction?.currentPriceUSD) || 0 
      })
      return totalWorth;
    }
}
