import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

////////////////////
const userId="12345";
const description="Test Tweet";

const signupObj={userId,description}

const event1={
    pathParameters:{
        userid: "1703268845825"
    },
    body:JSON.stringify(signupObj)
}
///////////////////////

export const handler = async (event) => {
  let result;
  const userId=event.pathParameters.userid;
    /////////////////// Getting Tweets by UserId ///////////
    result= await getTweetByUserId(userId);
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

const getTweetByUserId = async (userId) =>{
  let tweetArray=[];
    let command= new QueryCommand({
        TableName:"tweets",
        KeyConditionExpression:
          "userId= :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
         ConsistentRead: true,
         ScanIndexForward: false
      })
      try {
        let tweetRes= await docClient.send(command);
        // Get User Information from user table ///
        command = new QueryCommand({
          TableName: "twitterNewUsers",
          KeyConditionExpression:"#userId= :userId",
          ExpressionAttributeNames:{
              "#userId": "_id"
          },
          ExpressionAttributeValues:{
              ":userId":userId
          }
      });
        let userData=await docClient.send(command);
        let tweetObj=tweetRes.Items;
        let userObj=userData.Items[0];
        let obj={tweetObj,userObj};
        tweetArray.push(obj);
        return tweetArray;                
      } catch (error) {
          console.log(error);
      }    
}

//  await handler(event1);
