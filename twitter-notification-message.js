// WebSocket URL: wss://51czt4rjh0.execute-api.us-east-1.amazonaws.com/production
// Connection URL: https://51czt4rjh0.execute-api.us-east-1.amazonaws.com/production/@connections

import { CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { ApiGatewayManagementApiClient, PostToConnectionCommand, } from "@aws-sdk/client-apigatewaymanagementapi";
import { ReceiveMessageCommand, SQSClient, DeleteMessageCommand, DeleteMessageBatchCommand } from "@aws-sdk/client-sqs";

  

//////////////////////////////
const connectionId= 'P-Fw7cj5oAMCIoQ=';

const event1={
  requestContext:{
      connectionId:connectionId
  }
}
/////////////////////////////////

const dynamoDbclient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoDbclient);
const domain = '51czt4rjh0.execute-api.us-east-1.amazonaws.com';
const stage = 'production';
const callbackUrl = `https://${domain}/${stage}`;
const client = new ApiGatewayManagementApiClient({ endpoint: callbackUrl });
const sqsClient = new SQSClient({});
const sqsQueueUrl = "https://sqs.us-east-1.amazonaws.com/201814457761/twitter-notification-sqs";

  export const handler = async (event) => {
    let connectionIds;
    console.log(event);
    const messages = await readTwitter_sqs();
    console.log(messages);

    if (!messages) {
      return;
    }
    if (messages.length === 1) {
      console.log(messages[0].Body);
      await sqsClient.send(
        new DeleteMessageCommand({
          QueueUrl: sqsQueueUrl,
          ReceiptHandle: messages[0].ReceiptHandle,
        }),
      );
    }
    else {
      await sqsClient.send(
        new DeleteMessageBatchCommand({
          QueueUrl: sqsQueueUrl,
          Entries: messages.map((message) => ({
            Id: message.MessageId,
            ReceiptHandle: message.ReceiptHandle,
          })),
        }),
      );
    }        

    ///// Getting Connections from Dynamo DB /////////
      connectionIds = await getConnections(); 

      while(messages.length>0){
        let m=messages.pop();
        let messageBody=JSON.parse(m.Body);
        if(messageBody.type === "liked"){
            for (let c of connectionIds.Items){
              if(messageBody.userId === c.userId){
                let requestParams = {
                  ConnectionId: c.connectionId,
                  Data: `Someone Liked your this Tweet: ${messageBody.tweetId}`,
                };
                let postCommand = new PostToConnectionCommand(requestParams);
                try {
                    await client.send(postCommand);           
                } catch (error) {
                console.log(error);
                }
              }
          
          }
        }
        else if(messageBody.type === "followed"){
          for (let c of connectionIds.Items){
            if(messageBody.toFollowOrUnFollowId === c.userId){
              let requestParams = {
                ConnectionId: c.connectionId,
                Data: `User Id:${messageBody.you} Followed you `,
              };
              let postCommand = new PostToConnectionCommand(requestParams);
              try {
                  await client.send(postCommand);           
              } catch (error) {
              console.log(error);
              }
            }
        
        }          
        }

      }  

    return {
        statusCode: 200,
      }; 
  };

  const readTwitter_sqs= async () =>{
    let command= new ReceiveMessageCommand({
      QueueUrl: sqsQueueUrl,
      WaitTimeSeconds: 10,
      MaxNumberOfMessages: 10,
    });
    let {Messages}= await sqsClient.send(command);
    //console.log(Messages);
    return Messages;
  }

const getConnections = async () =>{
    const createdAt=new Date().toISOString();
    const formatedDate=new Date(createdAt);
    const year=formatedDate.getFullYear().toString();
    const date=formatedDate.getDate().toString();
    const connectionDate=`${year}`;

    let command= new QueryCommand({
        TableName:"twitter-notification",
        KeyConditionExpression: "connectionDate=:connectionDate",
        ExpressionAttributeValues:{
            ":connectionDate":connectionDate
        },
        ConsistentRead: true,
    });
    const getConnections= await docClient.send(command);
    return getConnections;


    // let command= new ReceiveMessageCommand({
    //   QueueUrl: connectionSqsUrl,
    //   WaitTimeSeconds: 10,
    //   MaxNumberOfMessages: 10,
    // });
    // let getConnections= await sqsClient.send(command);
    // return getConnections;  

}



handler(event1);