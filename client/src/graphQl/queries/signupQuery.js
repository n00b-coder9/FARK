const signupQuery=(UserInputData)=>{
  const graphqlQuery = {
    query: `
      mutation{
        signUp(UserInput:{
          email:"${UserInputData.email}",
          name:"${UserInputData.name}",
          password:"${UserInputData.password}"
        })
        {
          message
        }
      }
      ` };
  return graphqlQuery;
};
export default signupQuery;
