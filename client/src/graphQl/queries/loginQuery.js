const loginQuery=(authData)=>{
  const graphqlQuery = {
    query: `
      query{
        login(email:"${authData.email}", password:"${authData.password}")
        {
          token
        }
      }` };
  return graphqlQuery;
};
export default loginQuery;
