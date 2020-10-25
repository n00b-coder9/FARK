
const addDetailsQuery = ({ title, description, shortUrl, updatedShortUrl }) => {
  const graphqlQuery = {
    query: `mutation{
  addDetails(
    title:"${title}" , 
    description : "${description}" , 
    shortUrl : "${shortUrl}" , 
    updatedShortUrl : "${updatedShortUrl}")
  {
    message
  }
}
        `,
  };
  return graphqlQuery;
};
module.exports = addDetailsQuery;
