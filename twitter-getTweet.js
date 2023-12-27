import { DynamoDBClient, UpdateItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, UpdateCommand ,DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

////////////////////
const userId="1703268845825";
const tweetId="1703657535321";

const tweetObj={userId,tweetId}

const event1={
    body:JSON.stringify(tweetObj)
}
///////////////////////

export const handler = async (event) => {
  let result;
  
   const {userId,tweetId}= JSON.parse(event.body);
    /////////////////// Getting Tweets by UserId ///////////
    result= await getTweet(userId, tweetId);
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

const getTweet= async (userId, tweetId) =>{
    console.log(userId, tweetId);

  const getItemParams = {
    TableName: "tweets",
    Key: {
      userId: { S: userId },
      _id: { S: tweetId },
    },
  };
  
  let command = new GetItemCommand(getItemParams);
  let getTweetRes= await  docClient.send(command);
  let getUserRes= await getUser(userId);
  
  let tweetObj=getTweetRes.Item;
  let userObj=getUserRes.Items[0];
  let obj={tweetObj,userObj};
  return obj;
}

const getUser= async (userId) =>{
  let command= new QueryCommand({
    TableName:"twitterNewUsers",
    KeyConditionExpression:"#userId=:userId",
    ExpressionAttributeNames:{
      "#userId":"_id"
    },
    ExpressionAttributeValues:{
      ":userId":userId
    }
  });

  return await docClient.send(command);
}
 await handler(event1);

