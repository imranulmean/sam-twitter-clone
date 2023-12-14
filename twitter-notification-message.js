// WebSocket URL: wss://51czt4rjh0.execute-api.us-east-1.amazonaws.com/production
// Connection URL: https://51czt4rjh0.execute-api.us-east-1.amazonaws.com/production/@connections

import { CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
// import { ApiGatewayManagementApiClient, PostToConnectionCommand, } from "@aws-sdk/client-apigatewaymanagementapi";
  

//////////////////////////////
const connectionId= 'P6zc0daGoAMCJDQ=';

const event1={
  requestContext:{
      connectionId:connectionId
  }
}
/////////////////////////////////

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

  export const handler = async (event) => {
    console.log(event);
    const domain = '51czt4rjh0.execute-api.us-east-1.amazonaws.com';
    const stage = 'production';
    const callbackUrl = `https://${domain}/${stage}`;
    const client = new ApiGatewayManagementApiClient({ endpoint: callbackUrl });
    const connectionIds = await getConnections();
    console.log(connectionIds);
    for (let c of connectionIds.Items){
        let requestParams = {
          ConnectionId: c.connectionId,
          Data: `This is response for ${c.connectionId}`,
        };
        let postCommand = new PostToConnectionCommand(requestParams);
        try {
            await client.send(postCommand);
            return {
              statusCode: 200,
            };            
        } catch (error) {
        console.log(error);
        }        
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