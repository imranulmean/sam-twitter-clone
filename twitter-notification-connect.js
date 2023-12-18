import { CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

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

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const connectionSqsUrl="https://sqs.us-east-1.amazonaws.com/201814457761/twitter-connections-sqs";
const sqsClient = new SQSClient({});

export const handler = async (event) => {
    // console.log(event);
    const eventData=JSON.parse(event.queryStringParameters.extraData);
     console.log(eventData);
    let result;
  const command = new CreateTableCommand({
    TableName: "twitter-notification",
    AttributeDefinitions: [
      {
        AttributeName: "connectionDate",
        AttributeType: "S",
      },
      {
        AttributeName: "connectionId",
        AttributeType: "S",
      },      
    ],
    KeySchema: [
      {
        AttributeName: "connectionDate",
        KeyType: "HASH",
      },
      {
        AttributeName: "connectionId",
        KeyType: "RANGE",
      }      
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  });

  try {

    //// Creating table and putting data////////
    const response = await client.send(command);
    console.log(response);
   // result=await putData_twitterNotification(event.requestContext.connectionId);

  } catch (error) {

    ///////// Table Already Exists now putting data ///////
    result=await putData_twitterNotification(event.requestContext.connectionId,eventData._id);    
    console.log(result);
  }
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
        return putDataRes;
    } catch (error) {
        console.log("Showgin Error When Putting data",error)
    }
}

handler(event1);