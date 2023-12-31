import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const sqsClient = new SQSClient({});
const sqsQueueUrl = "https://sqs.us-east-1.amazonaws.com/201814457761/twitter-notification-sqs";

////////////////////
const userId="1703268845825";
const comment="This is my first Comment";
const tweetId="1703806189762";
const commentPic="";

const submitCommentObj={tweetId, comment, userId, commentPic};

const event1={
    body:JSON.stringify(submitCommentObj)
}
///////////////////////
export const handler = async (event) => {

  const {tweetId, comment, userId, commentPic}= JSON.parse(event.body);
  let result;
  const createdAt=new Date().toISOString();
  const formatedDate=new Date(createdAt);
  const year=formatedDate.getFullYear().toString();
  const month=formatedDate.getMonth() + 1;
  const date=formatedDate.getDate().toString();
  
    result=await submitComment(tweetId, comment, userId, commentPic,createdAt);    
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

const submitComment= async (tweetId, comment, userId, commentPic,createdAt) => {
    let command= new PutCommand({
        TableName:"comments",
        Item:{
          "tweetId":tweetId,
          "userId": userId,
          "comment": comment,
          "commentPic": commentPic,
          "likes":[],     
          "createdAt": createdAt,
        }
      });
      try {
        let submitCommentRes= await docClient.send(command);
        let obj={tweetId, comment, userId, commentPic,createdAt};
        // await insertData_sqs(userId, _id);
        console.log(submitCommentRes);
        return obj;
      } catch (error) {
          console.log(error);
      } 
}


const insertData_sqs = async(userId, tweetId) =>{

  let mesgObj={userId, tweetId, type:'createTweet'};
  let command = new SendMessageCommand({
    QueueUrl: sqsQueueUrl,    
    MessageBody:JSON.stringify(mesgObj),
  });

  let response = await sqsClient.send(command);
  return response;
}
await handler(event1);
