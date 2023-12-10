import { DynamoDBClient, UpdateItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, UpdateCommand ,DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

////////////////////

const mainUserId="1702115625459"; /// You are going to follow this id
const userId2="1702116038174"; /// userId2 is the Follower

const likeObj={mainUserId,userId2}

const event1={
    body:JSON.stringify(likeObj)
}
///////////////////////

export const handler = async (event) => {
  let result;
  
  const {mainUserId,userId2}= JSON.parse(event.body);
    /////////////////// Getting Tweets by UserId ///////////
    result= await followOrUnFollow(mainUserId, userId2);
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

const followOrUnFollow = async(mainUserId, userId2) => {
    let updateExpressionString;
    const userData=await getTwitterUserById(mainUserId);
    console.log(userData.Items[0].followers);

     const isInFollowerList=userData.Items[0].followers.includes(userId2);
     console.log("isInFollowerList:",isInFollowerList);
     if(isInFollowerList){
        let followerIndex = userData.Items[0].followers.findIndex(i => i === userId2);
        console.log("followerIndex:",followerIndex);
        updateExpressionString = "REMOVE followers[" + followerIndex + "]";
        return await removeFollow (updateExpressionString, mainUserId, userId2, userData)
     }
     else{
        updateExpressionString='set followers = list_append(if_not_exists(followers, :emptyList), :follower)';
        return await addFollow (updateExpressionString, mainUserId, userId2, userData)
     }

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

const addFollow = async (updateExpressionString, mainUserId, userId2, userData) => {
    console.log("addig follow2----------", mainUserId);
///////////////////Get Data From Existing ////////////////////////////////
    ///////////////////////////////////////
    const command = new UpdateCommand(
        {
            TableName: 'twitterNewUsers', // Replace 'your-table-name' with your DynamoDB table name
            Key: {
              '_id':mainUserId,
              email:userData.Items[0].email
            },
            UpdateExpression: updateExpressionString,
            ExpressionAttributeValues: {
              ':emptyList': [],
              ':follower': [userId2] 
            },
            ReturnValues: 'ALL_NEW', // Adjust as needed
          }         
    );  
    return await docClient.send(command);
}
const removeFollow = async (updateExpressionString, mainUserId, userId2, userData) => {
        
    const command = new UpdateCommand(
        {
            TableName: 'twitterNewUsers', // Replace 'your-table-name' with your DynamoDB table name
            Key: {
              '_id':mainUserId,
              email:userData.Items[0].email
            },
            UpdateExpression: updateExpressionString,
            ReturnValues: 'ALL_NEW', // Adjust as needed
          }         
    ); 

  return await docClient.send(command);

}

await handler(event1);

