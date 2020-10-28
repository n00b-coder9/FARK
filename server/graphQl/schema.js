const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    scalar Date
    type Url{
        _id : String!
        owner : String!
        longUrl : String!
        shortUrl : String!
        expirydate : Date!
        title : String
        description : String
        createdAt : Date!
        updatedAt : Date!
        readaccess : [User]
        writeaccess : [User]
        clicks : [Click!]
    }
    type User{
        _id : String!
        name : String!
        email : String!
        password : String!
        createdAt : Date!
        updatedAt : Date!
    }
    type location{
        city : String
        country : String
    }
    type Click{
        ip : String!
        time : Date!
        location : location!
    }
    type AuthToken{
        token : String!
    }
    type GenericMessage{
        message: String!
    }
    input UserInputData{
        name : String!
        email : String!
        password : String!
    }
    type RootQuery{
        login(email : String! , password : String!) : AuthToken!
        getUrls: urls!
    }
    type shortUrl{
        _id : String!,
        longUrl : String!,
        shortUrl : String!,
        title : String,
        description : String
    }
    type urls{
        urls : [Url!]
    }
    type RootMutation{
        signUp(UserInput : UserInputData) : GenericMessage!
        shortenUrl(longUrl : String!) : shortUrl!
        addDetails(
            title: String , 
            description : String , 
            shortUrl: String! , 
            updatedShortUrl: String!) : GenericMessage! 
    }
    schema {
        query : RootQuery
        mutation : RootMutation
    }`);
