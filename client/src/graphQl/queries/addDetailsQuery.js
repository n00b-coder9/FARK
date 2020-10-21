
const addDetailsQuery = ({ title, description, shortUrl }) => {
  const graphqlQuery = {
    query: `mutation{
  addDetails(title:"${title}" , description : "${description}" , shortUrl : "${shortUrl}")
  {
    message
  }
}
        `,
  };
  return graphqlQuery;
};
module.exports = addDetailsQuery;
