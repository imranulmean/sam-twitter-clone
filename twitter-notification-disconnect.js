import { CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

//////////////////////////////
    const connectionId= 'P6-uzdnSIAMCFuw=';

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
    const createdAt=new Date().toISOString();
    const formatedDate=new Date(createdAt);
    const year=formatedDate.getFullYear().toString();
    const date=formatedDate.getDate().toString();
    const connectionDate=`${year}`;

    let result;
    let command= new DeleteCommand({
        TableName:"twitter-notification",
        Key:{
            connectionDate:connectionDate,
            connectionId:event.requestContext.connectionId
        }
    });

    try{
        result= await docClient.send(command);
        console.log(result);
    }
    catch (error){
        console.log(error);
    }
    return {
        statusCode:200
    }
};

handler(event1);