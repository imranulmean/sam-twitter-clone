import { ApiGatewayManagementApiClient, PostToConnectionCommand, } from "@aws-sdk/client-apigatewaymanagementapi";

//////////////////////////////
  const connectionId= 'P6zc0daGoAMCJDQ=';
  const event1={
        requestContext:{
            connectionId:connectionId,
        },
        body: '{"action":"sendMessage","message":{"chatmessage":"asdasdasd","connectionId":"QgqupdekIAMCIqg="}}'
    }
/////////////////////////////////

const domain = '51czt4rjh0.execute-api.us-east-1.amazonaws.com';
const stage = 'production';
const callbackUrl = `https://${domain}/${stage}`;
const client = new ApiGatewayManagementApiClient({ endpoint: callbackUrl });

export const handler = async (event) => {
     console.log(event);
     let messageBody=JSON.parse(event.body);
     let obj={message:messageBody.message.chatmessage, type:"chat"}   
    let requestParams = {
        ConnectionId: messageBody.message.connectionId,
        Data: JSON.stringify(obj),
      }
    let postCommand= new PostToConnectionCommand(requestParams);

    try {
        await client.send(postCommand);
        return {
            statusCode:200,
            body:"sent successfully"
        }     
    } catch (error) {
        console.log(error);
            const errorResponse = {
                statusCode: 410, // 410 Gone status code
                body: "Thie member is not live now",
            };
            return errorResponse;
    }  

};
// handler(event1);
