import { CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { ReceiveMessageCommand, SQSClient, DeleteMessageCommand, DeleteMessageBatchCommand } from "@aws-sdk/client-sqs";
import { ApiGatewayManagementApiClient, PostToConnectionCommand, } from "@aws-sdk/client-apigatewaymanagementapi";
//////////////////////////////
    const connectionId= 'P98_uc8KoAMCLig=';

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


export const handler = async (event) => {
    console.log(event);
    const createdAt=new Date().toISOString();
    const formatedDate=new Date(createdAt);
    const year=formatedDate.getFullYear().toString();
    const date=formatedDate.getDate().toString();
    const connectionDate=`${year}`;
    let connectionIds;
    let notificationData;

    let command= new DeleteCommand({
        TableName:"twitter-notification",
        Key:{
            connectionDate:connectionDate,
            connectionId:event.requestContext.connectionId
        }
    });

    try{
       let result= await docClient.send(command);
       connectionIds = await getConnections();
       notificationData={"data":{}, "type": "fetchAgain"};
       for (let c of connectionIds.Items){        
          let requestParams = {
            ConnectionId: c.connectionId,
            Data: JSON.stringify(notificationData),
          };
          let postCommand = new PostToConnectionCommand(requestParams);
          try {
              await client.send(postCommand);           
          } catch (error) {
          console.log(error);
          }
        
      }       
    }
    catch (error){
        console.log(error);
    }
    return {
        statusCode:200
    }
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