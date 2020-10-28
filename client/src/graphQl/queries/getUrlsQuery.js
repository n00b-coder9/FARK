
const getUrlsQuery = () => {
  const graphqlQuery = {
    query: `query{
  getUrls{
    urls{
      owner
      _id
      title
      longUrl
      shortUrl
      createdAt
      updatedAt
      clicks{
        ip
        time
        location{
          city
          country
        }
      }
    }
  }
}` };
  return graphqlQuery;
};
export default getUrlsQuery;
