import { DynamoDBClient, UpdateItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, UpdateCommand ,DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

////////////////////
const userId="1703268845825";
const tweetId="1703310423195";

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
    console.log("showing result",result);
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
  
  const getItemCommand = new GetItemCommand(getItemParams);
    return await docClient.send(getItemCommand);
}
 await handler(event1);

