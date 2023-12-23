import jwt from "jsonwebtoken";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

////////////////////
const event1={
    authorizationToken:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Impob25ueXNrMDA3QGdtYWlsLmNvbSIsImlhdCI6MTcwMzI4OTAzNn0.mtu5kIIdy2A7E4z1BgO_y4kot4ItavDMUzaJ2E6Gwu0",
    methodArn:"123456"
}
///////////////////////

export const handler = async (event) => {
    let tokenSecret="twitter-clone-token";
    let response, policy, principalId, context;
    const token=event.authorizationToken;
    const decodedToken=jwt.verify(token,tokenSecret);
    console.log(decodedToken);
    let result;
    result= await checkUserExist(decodedToken.email);
    console.log(result);
  // if(decodedToken.origin === origin)
    if(result.Count==1){
      policy=genPolicy('allow', event.methodArn);
      principalId="*";
      response={
        principalId,
        policyDocument:policy,
        context
      }
      return response;
        
    } 
    else {
      return "Unauthorized Acces";
    }
};

const genPolicy = (effect, resource) =>{
    const policy={};
    policy.Version="2012-10-17";
    policy.Statement=[];
    const stmt={};
    stmt.Action="execute-api:Invoke";
    stmt.Effect=effect;
    // stmt.Resource=["arn:aws:execute-api:us-east-1:201814457761:0ko7jyglbb/*/POST/mern-state-auth-signip",
    //               "arn:aws:execute-api:us-east-1:201814457761:0ko7jyglbb/*/POST/mern-state-auth-signip/*"
    //               ];
  
    stmt.Resource=resource;
    policy.Statement.push(stmt);
    return policy;    
}

const checkUserExist= async(email) =>{
  let command= new QueryCommand({
      TableName:"twitterExistingUsers",
      KeyConditionExpression:
        "email= :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
       ConsistentRead: true,
    })
    try {
      return await docClient.send(command);
    } catch (error) {
        console.log(error);
    }
}

// await handler(event1);

