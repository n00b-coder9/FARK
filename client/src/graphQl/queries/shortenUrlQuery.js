
const shortenUrlQuery = ({ longUrl }) => {
  const graphqlQuery = {
    query: `
        mutation{
            shortenUrl(longUrl: "${longUrl}"){
                shortUrl
                longUrl
            }
        }`,
  };
  return graphqlQuery;
};
export default shortenUrlQuery;
