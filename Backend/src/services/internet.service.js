import {tavily as Tavily} from "@tavily/core";

const tavily= Tavily({
    apikey: process.env.TAVILY_API_KEY
})
export const searchInternet= async ({query})=>{
  const result=  await tavily.search(
        query,{
        searchDepth:"basic",
        maxResults: 5
    })
    return JSON.stringify(result);
}
