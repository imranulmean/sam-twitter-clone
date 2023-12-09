import { DynamoDBClient, UpdateItemCommand  } from "@aws-sdk/client-dynamodb";
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

const updateTweet = async (userId, tweetId) =>{
      // Check if userId is already in the likes array
      const isLiked = false;  // Set this value based on your logic

      // Define the update expression and attribute values based on whether to add or remove the userId
      let updateExpression;
      let expressionAttributeValues;

      if (isLiked) {
        // If already liked, remove userId from likes array
        updateExpression = "REMOVE likes :userId";
        expressionAttributeValues = { ":userId": { SS: [userId] } };
      } else {
        // If not liked, add userId to likes array
        updateExpression = "ADD likes :userId";
        expressionAttributeValues = { ":userId": { SS: [userId] } };
      }

      const updateParams = {
        TableName: "tweets",
        Key: {
          userId: { S: userId },
          _id: { S: tweetId },
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",  // Adjust as needed
      };

      const updateCommand =  new UpdateItemCommand(updateParams);
      try {
        return await docClient.send(updateCommand);
      } catch (error) {
        console.log(error);
      }
    
}

await handler(event1);



    // let command = new UpdateCommand({
    //     TableName: "tweets",
    //     Key: {
    //        userId:userId,
    //       _id: tweetId

    //     },
    //    UpdateExpression: "set likes = list_append(likes, :newLike)",
    //     ExpressionAttributeValues: {
    //         ':newLike': [userId]
    //     },
    //     ReturnValues: "ALL_NEW",
    //   });
    
    //   const response = await docClient.send(command);
    //   console.log(response);
    //   return response;

//////////////////////////Create new array if not exist


  //   let command = new UpdateCommand({
  //     TableName: "tweets",
  //     Key: {
  //         userId: userId,
  //         _id: tweetId
  //     },
  //     UpdateExpression: "SET #likes = list_append(if_not_exists(#likes, :emptyList), :newLike)",
  //     ExpressionAttributeNames: {
  //         "#likes": "likes"
  //     },
  //     ExpressionAttributeValues: {
  //         ":emptyList": [],
  //         ":newLike": [userId]
  //     },
  //     ConditionExpression: "NOT contains(#likes, :userId)",
  //     ReturnValues: "ALL_NEW",
  // });
  
  // const response = await docClient.send(command);
  // console.log(response);
  // return response;