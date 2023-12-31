import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";


const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

////////////////////
const tweetId="1703806189762";

const event1={
        pathParameters:{
            tweetId:tweetId
        }
}
///////////////////////
export const handler = async (event) => {

     const tweetId= event.pathParameters.tweetId;
     let result;
  
    result=await getComments(tweetId);
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

const getComments= async (tweetId) => {
    let command= new QueryCommand({
        TableName:"comments",
        KeyConditionExpression:"tweetId=:tweetId",
        ExpressionAttributeValues:{
            ":tweetId":tweetId
        }
      });
      try {
        let getCommentsRes= await docClient.send(command);

        /// Now get the user info who commented on the post ////
        let getUserRes= await getUser(getCommentsRes.Items);
        return getUserRes;

      } catch (error) {
          console.log(error);
      } 
}

const getUser= async(data) =>{
    // console.log(data);
    const arr=[];  
    if(data){
        for(let d of data){
            let command= new QueryCommand({
                TableName:"twitterNewUsers",
                KeyConditionExpression:
                  "#id= :userId",
                ExpressionAttributeNames:{
                    '#id':'_id'
                },          
                ExpressionAttributeValues: {
                  ":userId": d.userId,
                },
                 ConsistentRead: true,
              })
              try {
                let userObj=await docClient.send(command);
                d["userObj"]=userObj.Items[0];
                arr.push(d);
              } catch (error) {
                  console.log(error);
              }             
        }
    }
    return arr;
}

