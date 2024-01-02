import { CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { ApiGatewayManagementApiClient, PostToConnectionCommand, } from "@aws-sdk/client-apigatewaymanagementapi";

//////////////////////////////
    const connectionId= 'P6zc0daGoAMCJDQ=';
    const queryStringParameters= {
        extraData: '{"following":["1702115625459"],"Date":"2023-12-09T10:00:39.094Z","password":"$2a$10$Ha0XemjmBy3AcxRBWCeWoOh7i9TnFYV6tFD0mqF3/RbQM8p2/bBe6","profilePicture":"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png","_id":"1702116038174","username":"test002","email":"test002@gmail.com","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmlnaW4iOiJodHRwOi8vbG9jYWxob3N0OjUxNzMiLCJpYXQiOjE3MDI0NjE1NTF9.PmhCfPncF-0zC2wmhmLXyUXhs6BuVZ3U0xw38eXwiAk"}'
      };

  const event1={
    requestContext:{
        connectionId:connectionId,
    },
    queryStringParameters:queryStringParameters    
}
/////////////////////////////////

const dynamoDbclient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoDbclient);
const connectionSqsUrl="https://sqs.us-east-1.amazonaws.com/201814457761/twitter-connections-sqs";
const sqsClient = new SQSClient({});
const domain = '51czt4rjh0.execute-api.us-east-1.amazonaws.com';
const stage = 'production';
const callbackUrl = `https://${domain}/${stage}`;
const client = new ApiGatewayManagementApiClient({ endpoint: callbackUrl });

export const handler = async (event) => {
    // console.log(event);
    const eventData=JSON.parse(event.queryStringParameters.extraData);
    let result;
    ///////// Table Already Exists now putting data ///////
    result=await putData_twitterNotification(event.requestContext.connectionId,eventData._id);    
    console.log(result);
  
    return {
        statusCode:200
    };
};

const putData_twitterNotification = async(connectionId,userId) =>{
    const createdAt=new Date().toISOString();
    const formatedDate=new Date(createdAt);
    const year=formatedDate.getFullYear().toString();
    const date=formatedDate.getDate().toString();
    const connectionDate=`${year}`;
    console.log(connectionDate);

    let command= new PutCommand({
        TableName:"twitter-notification",
        Item:{
            connectionDate:connectionDate,
            connectionId:connectionId,
            userId:userId
        }
    });
    try {
        let putDataRes= await docClient.send(command);
        let connectionIds = await getConnections();
        let notificationData={"data":{}, "type": "fetchAgain"};
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
        return putDataRes;
    } catch (error) {
        console.log("Showgin Error When Putting data",error)
    }
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
}

handler(event1);