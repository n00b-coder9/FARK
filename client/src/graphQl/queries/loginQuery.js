const loginQuery=(authData)=>{
    const graphqlQuery = {
        query:`
      query{
        login(email:"${authData.email}", password:"${authData.password}")
        {
          token
          userId
        }
      }`};
    return graphqlQuery;
}
export default loginQuery;