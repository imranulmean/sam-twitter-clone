import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, GetCommand , DeleteCommand , DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

////////////////////
const userId="1702642786065";
const tweetId="1702652642739";

const jsonObj={userId,tweetId}

const event1={
    body:JSON.stringify(jsonObj)
}
///////////////////////
export const handler = async (event) => {

  const {userId,tweetId}= JSON.parse(event.body);
  let result;
    /////////////////// Creat Tweet with userId and description ///////////
    result=await deleteTweet(userId, tweetId);  
    
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

const deleteTweet= async (userId, tweetId) => {

     let getTweetObj= await getTweetObject(userId, tweetId);
     let formatedDate= new Date(getTweetObj.createdAt);
     let year= formatedDate.getFullYear().toString();
     /// delete tweet from main tweet table //
       let command = new DeleteCommand({
        TableName: "tweets",
        Key: {
            userId: userId,
            _id:tweetId
        },
      });
    
      const deleteTweetRes = await docClient.send(command);
      /// Now Delete Tweet From Tweet By Date Table ////
      const deleteTweetByDateRes= await deleteDataIn_tweetByDates(year, getTweetObj.createdAt);
      return deleteTweetByDateRes;
}

const deleteDataIn_tweetByDates = async (year, createdAt) =>{
    let command = new DeleteCommand({
        TableName: "tweetByDates",
        Key: {
            year: year,
            tweet_date:createdAt
        },
      });
    
      const response = await docClient.send(command);
      return response;
}

const getTweetObject= async (userId, tweetId) =>{

    let command = new GetCommand({
        TableName: "tweets",
        Key: {
            userId: userId,
            _id:tweetId
        },
    });
      let {Item} = await docClient.send(command);
      return Item;    

}

await handler(event1);
