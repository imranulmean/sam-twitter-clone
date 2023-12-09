import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

////////////////////
const userId="12345";
const description="Test Tweet";

const signupObj={userId,description}

const event1={
    pathParameters:{
        userid: "1702115625459"
    },
    body:JSON.stringify(signupObj)
}
///////////////////////

export const handler = async (event) => {
  let result;
  const userId=event.pathParameters.userid;
    /////////////////// Getting Tweets by UserId ///////////
    result= await getTweetByUserId(userId);
    console.log(result);
    let response = {
      statusCode: 200,
      'headers': {
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },    
      body: JSON.stringify(result),
    };
  return response;
  
};

const getTweetByUserId = async (userId) =>{
    let command= new QueryCommand({
        TableName:"tweets",
        KeyConditionExpression:
          "userId= :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
         ConsistentRead: true,
      })
      try {
        return await docClient.send(command);
      } catch (error) {
          console.log(error);
      }    
}

await handler(event1);
