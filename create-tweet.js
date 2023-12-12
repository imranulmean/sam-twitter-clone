import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

////////////////////
const userId="1702116038174";
const description="This is my 11th tweet from Test 002 tweet how are you today";

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
  const formatedDate=new Date(createdAt);
  const year=formatedDate.getFullYear().toString();
  const month=formatedDate.getMonth() + 1;
  const day=formatedDate.getDay(); 
  console.log(createdAt);
  console.log(`${day}-${month}-${year}`);
  
    /////////////////// Creat Tweet with userId and description ///////////
    result=await createTweet(_id, userId, description, createdAt, updatedAt);
    putDataIn_tweetByDates(_id, userId, createdAt, year);
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
        let createTweetRes= await docClient.send(command);
        return createTweetRes;
      } catch (error) {
          console.log(error);
      } 
}

const putDataIn_tweetByDates = (tweetId, userId, createdAt, year) =>{
  let command= new PutCommand({
    TableName:"tweetByDates",
    Item:{
      "year":year,
      "tweet_date":createdAt,
      "userId": userId,
      "tweetId": tweetId
    }
  });
  try {
      docClient.send(command);

  } catch (error) {
      console.log(error);
  } 
}

await handler(event1);
