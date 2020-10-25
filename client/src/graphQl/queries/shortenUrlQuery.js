
const shortenUrlQuery = ({ longUrl }) => {
  const graphqlQuery = {
    query: `
        mutation{
            shortenUrl(longUrl: "${longUrl}"){
                shortUrl
                longUrl
                title
                description
            }
        }`,
  };
  return graphqlQuery;
};
export default shortenUrlQuery;
