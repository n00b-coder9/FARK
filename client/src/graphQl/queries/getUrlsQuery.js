
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
          state
        }
      }
    }
  }
}` };
  return graphqlQuery;
};
export default getUrlsQuery;
