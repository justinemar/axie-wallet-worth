export * from './queries.module';
export * from './queries.service';


export const getBriftList =
  "query GetAxieBriefList(        $auctionType: AuctionType,        $criteria: AxieSearchCriteria,        $from: Int,        $sort: SortBy,        $size: Int,        $owner: String      ) {        axies(        auctionType: $auctionType,        criteria: $criteria,        from: $from,        sort: $sort,        size: $size,        owner: $owner      ) {            total            results         {      ...AxieBrief      __typename    }        __typename        }      }                   fragment AxieStats on AxieStats {        hp        speed        skill        morale        __typename      }                  fragment AxieBrief on Axie {          id          name          stage          class         birthDate         breedCount         stats {          ...AxieStats          __typename       }       potentialPoints {            beast            aquatic            plant            bug            bird            reptile            mech            dawn            dusk            __typename                }          image          genes          battleInfo {    banned    __typename  }          parts {              id              name              class              type              specialGenes              __typename          }          __typename        }      ";

export const getExact = 
  "query GetAxieBriefList($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String, $filterStuckAuctions: Boolean) {  axies(    auctionType: $auctionType    criteria: $criteria    from: $from    sort: $sort    size: $size    owner: $owner    filterStuckAuctions: $filterStuckAuctions  ) {    total    results {      ...AxieBrief      __typename    }    __typename  }}fragment AxieBrief on Axie {  id  name  stage  class  breedCount  image  title  battleInfo {    banned    __typename  }  auction {    currentPrice    currentPriceUSD    __typename  }  parts {    id    name    class    type    specialGenes    __typename  }  __typename}"