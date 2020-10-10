const signupQuery=(UserInputData)=>{
    const graphqlQuery = {
        query:`
      mutation{
        signUp(UserInput:{
          email:"${UserInputData.email}",
          name:"${UserInputData.name}",
          password:"${UserInputData.password}"
        })
        {
        _id
        name
        email
        createdAt
        updatedAt
        password
        }
      }
      `};
      return graphqlQuery;
}
export default signupQuery;