import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, UpdateCommand ,DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

////////////////////
const userId="1702115625459";
const tweetId="1702125247245";

const likeObj={userId,tweetId}

const event1={
    body:JSON.stringify(likeObj)
}
///////////////////////

export const handler = async (event) => {
  let result;
  const {userId,tweetId}= JSON.parse(event.body);
  console.log(userId);
    /////////////////// Getting Tweets by UserId ///////////
    result= await updateTweet(userId, tweetId);
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

const updateTweet = async (userId, tweetId) =>{
    let command = new UpdateCommand({
        TableName: "tweets",
        Key: {
           userId:userId,
          _id: tweetId

        },
       UpdateExpression: "set likes = list_append(likes, :newLike)",
        ExpressionAttributeValues: {
            ':newLike': [userId]
        },
        ReturnValues: "ALL_NEW",
      });
    
      const response = await docClient.send(command);
      console.log(response);
      return response;
}

await handler(event1);
