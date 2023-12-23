// WebSocket URL: wss://51czt4rjh0.execute-api.us-east-1.amazonaws.com/production
// Connection URL: https://51czt4rjh0.execute-api.us-east-1.amazonaws.com/production/@connections

import { CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { ApiGatewayManagementApiClient, PostToConnectionCommand, } from "@aws-sdk/client-apigatewaymanagementapi";
import { ReceiveMessageCommand, SQSClient, DeleteMessageCommand, DeleteMessageBatchCommand } from "@aws-sdk/client-sqs";

  

//////////////////////////////
const connectionId= 'P-Fw7cj5oAMCIoQ=';

const event1={
    Records: [
        {
          messageId: '7eb78125-e09c-4fef-bc4b-1432a1388661',
          receiptHandle: 'AQEBkk/4KSKQE4bqHs8gt/KHx3MYApljajci0FfGC/GIhmbNo7fWkmtCnG+qC72boQQsw58tg3ytIt6p1LGEnOJfWXSigs+IAuOORNHYiY36t9mviYVp8G1bgbyyfBtziaq8HG1RD9Tu3Q6JYeU1HhcBoAJv48rGUR6D0+0ueHCk00gfZR1QJCBaz9YYrgHK3ju2LCdMiX6+/DeFtrnliJxRvNPkHcjksf1MPCZ74fAqS9QhmuQLShBYALEz8P1p31pJITbUOwiz87eWsva1I0QlS9lDkqQTgFZ2EGJiKydOhE7blLV6RsoNlJ/J8OyVBU9KaOUuTtzT45WURiTKJ7RMZT6LtL1lA7Vgg9LH0ENLsb27EyBN+gFYAgtAaVlDIjXGrnB8yt1LdROD9O4U6aHxtA==',
          body: '{"userId":"1702115625459","tweetId":"1702125247245","type":"liked"}',
          attributes: [Object],
          messageAttributes: {},
          md5OfBody: '3a79661fef2b2e901774b706ae1059f7',
          eventSource: 'aws:sqs',
          eventSourceARN: 'arn:aws:sqs:us-east-1:201814457761:twitter-notification-sqs',
          awsRegion: 'us-east-1'
        }
      ]    
  };

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
    const messages = event.Records;

    if (!messages) {
      return;
    }
       
    ///// Getting Connections from Dynamo DB /////////
      connectionIds = await getConnections(); 

      while(messages.length>0){
        let m=messages.pop();       
        let messageBody=JSON.parse(m.body);
        if(messageBody.type === "liked"){

            for (let c of connectionIds.Items){
              if(messageBody.userId === c.userId){
                let requestParams = {
                  ConnectionId: c.connectionId,
                  Data: messageBody.tweetId,
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
}



handler(event1);