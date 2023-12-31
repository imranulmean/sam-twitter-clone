import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

////////////////////
const userId="1702116038174";
const description="This is my 11th tweet from Test 002 tweet how are you today";

const signupObj={userId,description}

const event1={
    body:JSON.stringify(signupObj)
}
///////////////////////
export const handler = async (event) => {

  let result;
  const createdAt=new Date().toISOString();
//  const updatedAt= new Date().toISOString();
  const formatedDate=new Date(createdAt);
  const year=formatedDate.getFullYear().toString();
  const month=formatedDate.getMonth() + 1;
  const day=formatedDate.getDay(); 
 
    ///////////////////Get All tweets of the recet Year ///////////
    result=await getTweets_RecentYear(year);
    result=await getTweets_tweetsTable(result);
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

const getTweets_RecentYear= async (year) => {
    let command= new QueryCommand({
        TableName:'tweetByDates',
        KeyConditionExpression:'#yr=:year',
        ExpressionAttributeNames:{
            '#yr':'year'                
        },
        ExpressionAttributeValues:{
            ':year':year
        },
        ScanIndexForward: false
     });
        
    try {
        let tweetByDatesRes= await docClient.send(command);
        return tweetByDatesRes;
    } catch (error) {          
            console.log(error);
    }
}

const getTweets_tweetsTable = async (data) =>{
    let tweetArray=[];
    for (let d of data.Items){
        let command= new QueryCommand({
            TableName:'tweets',
            KeyConditionExpression:'#tweetId=:tweetId and userId=:userId',
            ExpressionAttributeNames:{
                '#tweetId':'_id'                
            },
            ExpressionAttributeValues:{
                ':tweetId':d.tweetId,
                ':userId':d.userId
            }
         });
            
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
                    ":userId":d.userId
                }
            });
             let userData=await docClient.send(command);
            let tweetObj=tweetRes.Items[0];
            let userObj=userData.Items[0];
            let obj={tweetObj,userObj}
            tweetArray.push(obj);
           
        } catch (error) {          
                console.log(error);
        } 
    }

   return tweetArray;
}
// await handler(event1);
