const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Url{
        _id : ID!
        ownerid : ID!
        longUrl : String!
        shortUrl : String!
        expirydate : String!
        createdAt : String!
        readwriteaccess : Access!
        clicks : [Click!]
    }
    type User{
        _id : ID!
        name : String!
        email : String!
        password : String!
        createdAt : String!
        updatedAt : String!
        urls : [Url!]
    }

    type Click{
        email : String!
        clickedAt : String!
        location : String!
    }
    type Access{
        email : String!
        permissions : [String!]!
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
    type PostData{
        urls : [Url!]!
        totalurls : Int!
    }
    type RootQuery{
        login(email : String! , password : String!) : AuthToken!
        urls : PostData!
    }
    type shortUrl{
        _id : ID!,
        longUrl : String!,
        shortUrl : String!,
        title : String,
        description : String
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
