import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

////////////////////
const userId="12345";
const description="Test Tweet";

const signupObj={userId,description}

const event1={
    body:JSON.stringify(signupObj)
}
///////////////////////
export const handler = async (event) => {

  const {userId,description}= JSON.parse(event.body);
  const timestamp = new Date().getTime();
  const _id= timestamp.toString();
  let result;
  const createdAt=new Date().toISOString();
  const updatedAt= new Date().toISOString();
    /////////////////// Creat Tweet with userId and description ///////////
    result=await createTweet(_id, userId, description, createdAt, updatedAt);
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

const createTweet= async (_id, userId, description, createdAt, updatedAt) => {
    let command= new PutCommand({
        TableName:"tweets",
        Item:{
          "_id":_id,
          "userId": userId,
          "description": description,
          "likes":[],          
          "createdAt": createdAt,
          "updatedAt": updatedAt
        }
      });
      try {
        return await docClient.send(command);
      } catch (error) {
          console.log(error);
      } 
}

await handler(event1);
