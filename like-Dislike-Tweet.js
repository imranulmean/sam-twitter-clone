import { DynamoDBClient, UpdateItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, UpdateCommand ,DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const sqsClient = new SQSClient({});
const sqsQueueUrl = "https://sqs.us-east-1.amazonaws.com/201814457761/twitter-notification-sqs";

////////////////////
const userId="1702115625459";
const tweetId="1702404297665";
const userId2="1702116038174";

const likeObj={userId,tweetId,userId2}

const event1={
    body:JSON.stringify(likeObj)
}
///////////////////////

export const handler = async (event) => {
  let result;
  
   const {userId,tweetId,userId2}= JSON.parse(event.body);
    /////////////////// Getting Tweets by UserId ///////////
    result= await likeOrDislike(userId, tweetId, userId2);
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

const likeOrDislike = async(userId, tweetId, userId2) => {  
 
  const getItemParams = {
    TableName: "tweets",
    Key: {
      userId: { S: userId },
      _id: { S: tweetId },
    },
  };
  
  const getItemCommand = new GetItemCommand(getItemParams);
  const { Item } = await docClient.send(getItemCommand);
  //console.log(Item.likes.L);
  
  const isLiked = Item.likes.L.some((like) => like.S === userId2);
  let updateExpressionString;

  if(isLiked){
    let indexOfAuthor = Item.likes.L.findIndex(i => i.S === userId2);
    updateExpressionString = "REMOVE likes[" + indexOfAuthor + "]";
    return await removeLike(updateExpressionString, userId, userId2, tweetId);
  }
  else{
    console.log("now it is liking/////////////////");
    updateExpressionString= "set likes = list_append(likes, :newLike)";   
    let addLikeRes= await addLike(updateExpressionString, userId, userId2, tweetId);
    /// Now inserting Data into SQS to send Live Notifications
    await insertData_sqs(userId,tweetId);
    return addLikeRes;
  }
}

const addLike = async (updateExpressionString, userId, userId2, tweetId) => {
  let command = new UpdateCommand({
    TableName: "tweets",
    Key: {
       userId:userId,
      _id: tweetId

    },
   UpdateExpression: updateExpressionString,
    ExpressionAttributeValues: {
        ':newLike': [userId2]
    },
    ReturnValues: "ALL_NEW",
  });

  return await docClient.send(command);

}
const removeLike = async (updateExpressionString, userId, userId2, tweetId) => {
  let command = new UpdateCommand({
    TableName: "tweets",
    Key: {
       userId:userId,
      _id: tweetId

    },
   UpdateExpression: updateExpressionString,
    ReturnValues: "ALL_NEW",
  });

  return await docClient.send(command);

}

const insertData_sqs = async(userId, tweetId) =>{

  let mesgObj={userId, tweetId, type:'liked'};
  let command = new SendMessageCommand({
    QueueUrl: sqsQueueUrl,    
    MessageBody:JSON.stringify(mesgObj),
  });

  let response = await sqsClient.send(command);
  console.log(response);
  return response;
}


await handler(event1);

