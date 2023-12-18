import { DynamoDBClient, UpdateItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, UpdateCommand ,DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

////////////////////

const toFollowOrUnFollowId="1702115625459"; /// You are going to follow this id
const you="1702116038174"; /// userId2 is the Follower

const likeObj={toFollowOrUnFollowId,you}

const event1={
    body:JSON.stringify(likeObj)
}
///////////////////////

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const sqsClient = new SQSClient({});
const sqsQueueUrl = "https://sqs.us-east-1.amazonaws.com/201814457761/twitter-notification-sqs";

export const handler = async (event) => {
  let result;
  
  const {toFollowOrUnFollowId,you}= JSON.parse(event.body);
    /////////////////// Getting Tweets by UserId ///////////
    result= await followOrUnFollow(toFollowOrUnFollowId, you);
    console.log("showing result/////////// Final",result);
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

const followOrUnFollow = async(toFollowOrUnFollowId, you) => {
    let updateExpressionString;
    let toFollowOrUnFollowUserData;
    let youUserData;
    let removeFollowRes;
    let removeFollowingRes;
    let addFollowRes;
    let addFollowingRes;
    //Getting ToFollow User data////
    toFollowOrUnFollowUserData=await getTwitterUserById(toFollowOrUnFollowId);
    console.log("You are going to Follow:your ID",you);
    console.log("toFollowOrUnFollowUserData:",toFollowOrUnFollowUserData.Items[0].followers);
     const isInFollowerList= toFollowOrUnFollowUserData.Items[0].followers ? toFollowOrUnFollowUserData.Items[0].followers.includes(you) : false;
     console.log("isInFollowerList:",isInFollowerList);

    ////Getting You User data////
    console.log("Following toFollowOrUnFollowId:",toFollowOrUnFollowId);
    youUserData=await getTwitterUserById(you);
    console.log("youUserData:",youUserData.Items[0].following);
    let isInFollowingList = youUserData.Items[0].following ? youUserData.Items[0].following.includes(toFollowOrUnFollowId) : false;
     console.log("isInFollowingList:",isInFollowingList);
     

     if(isInFollowerList && isInFollowingList){
        let followerIndex = toFollowOrUnFollowUserData.Items[0].followers.findIndex(i => i === you);
        updateExpressionString = "REMOVE followers[" + followerIndex + "]";
        removeFollowRes= await removeFollow (updateExpressionString, toFollowOrUnFollowId, you, toFollowOrUnFollowUserData);
        //// Remove Following ////////
        let followingIndex = youUserData.Items[0].following.findIndex(i => i === toFollowOrUnFollowId);
        updateExpressionString = "REMOVE following[" + followingIndex + "]";
        removeFollowingRes = await removeFollowing (updateExpressionString, toFollowOrUnFollowId, you, youUserData);
        let obj={removeFollowRes, removeFollowingRes};
        return obj;
        
     }
     else{
        updateExpressionString='set followers = list_append(if_not_exists(followers, :emptyList), :follower)';
        addFollowRes= await addFollow (updateExpressionString, toFollowOrUnFollowId, you, toFollowOrUnFollowUserData);
        updateExpressionString='set following = list_append(if_not_exists(following, :emptyList), :following)';
        addFollowingRes= await addFollowing (updateExpressionString, toFollowOrUnFollowId, you, youUserData);  
        let obj={addFollowRes, addFollowingRes};      
        return obj;
     }
     //////////////// Checking following List //////////
}

const getTwitterUserById = async (userId) =>{
    let command= new QueryCommand({
        TableName:"twitterNewUsers",
        KeyConditionExpression:
          "#id= :userId",
        ExpressionAttributeNames:{
            '#id':'_id'
        },          
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

const addFollow = async (updateExpressionString, toFollowOrUnFollowId, you, userData) => {
    const command = new UpdateCommand(
        {
            TableName: 'twitterNewUsers', // Replace 'your-table-name' with your DynamoDB table name
            Key: {
              '_id':toFollowOrUnFollowId,
              email:userData.Items[0].email
            },
            UpdateExpression: updateExpressionString,
            ExpressionAttributeValues: {
              ':emptyList': [],
              ':follower': [you] 
            },
            ReturnValues: 'ALL_NEW', // Adjust as needed
          }         
    );
    await insertData_sqs (toFollowOrUnFollowId, you);
    return await docClient.send(command);
}

const addFollowing = async (updateExpressionString, toFollowOrUnFollowId, you, userData) => {
///////////////////Get Data From Existing ////////////////////////////////
  ///////////////////////////////////////
  const command = new UpdateCommand(
      {
          TableName: 'twitterNewUsers', // Replace 'your-table-name' with your DynamoDB table name
          Key: {
            '_id':you,
            email:userData.Items[0].email
          },
          UpdateExpression: updateExpressionString,
          ExpressionAttributeValues: {
            ':emptyList': [],
            ':following': [toFollowOrUnFollowId] 
          },
          ReturnValues: 'ALL_NEW', // Adjust as needed
        }         
  );  
  return await docClient.send(command);
}
const removeFollow = async (updateExpressionString, toFollowOrUnFollowId, you, userData) => {
        
    const command = new UpdateCommand(
        {
            TableName: 'twitterNewUsers', // Replace 'your-table-name' with your DynamoDB table name
            Key: {
              '_id':toFollowOrUnFollowId,
              email:userData.Items[0].email
            },
            UpdateExpression: updateExpressionString,
            ReturnValues: 'ALL_NEW', // Adjust as needed
          }         
    ); 

  return await docClient.send(command);

}

const removeFollowing = async (updateExpressionString, toFollowOrUnFollowId, you, userData) => {
        
  const command = new UpdateCommand(
      {
          TableName: 'twitterNewUsers', // Replace 'your-table-name' with your DynamoDB table name
          Key: {
            '_id':you,
            email:userData.Items[0].email
          },
          UpdateExpression: updateExpressionString,
          ReturnValues: 'ALL_NEW', // Adjust as needed
        }         
  ); 

return await docClient.send(command);

}

const insertData_sqs = async(toFollowOrUnFollowId, you) =>{
  let mesgObj={toFollowOrUnFollowId, you, type:'followed'};
  let command = new SendMessageCommand({
    QueueUrl: sqsQueueUrl,    
    MessageBody:JSON.stringify(mesgObj),
  });

  let response = await sqsClient.send(command);
  console.log(response);
  return response;
}

await handler(event1);

