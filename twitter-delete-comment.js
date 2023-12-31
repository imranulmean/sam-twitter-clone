import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, GetCommand , DeleteCommand , DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

////////////////////
const tweetId="1703806189762";
const createdAt="2023-12-29T18:06:50.922Z";
const jsonObj={tweetId,createdAt};

const event1={
    body:JSON.stringify(jsonObj)
}
///////////////////////
export const handler = async (event) => {

  const {tweetId,createdAt}= JSON.parse(event.body);
  let result;
    /////////////////// Creat Tweet with userId and description ///////////
    result=await deleteComment(tweetId, createdAt);  
    
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

const deleteComment= async (tweetId, createdAt) => {

       let command = new DeleteCommand({
        TableName: "comments",
        Key: {
            tweetId: tweetId,
            createdAt:createdAt
        },
      });
    
      const deleteComment = await docClient.send(command);
      console.log(deleteComment);
      return deleteComment;
}

await handler(event1);
