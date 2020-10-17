
const shortenUrlQuery = ({ longUrl, userId })=>{
  const graphqlQuery={
    query: `
        mutation{
            shortenUrl(longUrl: "${longUrl}" , userId:"${userId}"){
                shortUrl
            }
        }`,
  };
  return graphqlQuery;
};
export default shortenUrlQuery;
