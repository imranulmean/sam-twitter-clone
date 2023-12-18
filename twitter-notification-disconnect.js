import { CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { ReceiveMessageCommand, SQSClient, DeleteMessageCommand, DeleteMessageBatchCommand } from "@aws-sdk/client-sqs";
//////////////////////////////
    const connectionId= 'P98_uc8KoAMCLig=';

  const event1={
    requestContext:{
        connectionId:connectionId
    }
}
/////////////////////////////////

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const connectionSqsUrl="https://sqs.us-east-1.amazonaws.com/201814457761/twitter-connections-sqs";
const sqsClient = new SQSClient({});

export const handler = async (event) => {
    console.log(event);
    const createdAt=new Date().toISOString();
    const formatedDate=new Date(createdAt);
    const year=formatedDate.getFullYear().toString();
    const date=formatedDate.getDate().toString();
    const connectionDate=`${year}`;

    // let {Messages}= await readTwitterConnections_sqs();
    // console.log(Messages);
    // if(Messages)
    // for( let m of Messages){
    //     let messageBody=JSON.parse(m.Body);
    //     if(messageBody.connectionId === event.requestContext.connectionId){
    //         await sqsClient.send(new DeleteMessageCommand ({
    //             QueueUrl: connectionSqsUrl,
    //             ReceiptHandle: m.ReceiptHandle,                
    //         }));
    //     }
    // }

    let command= new DeleteCommand({
        TableName:"twitter-notification",
        Key:{
            connectionDate:connectionDate,
            connectionId:event.requestContext.connectionId
        }
    });

    try{
       let result= await docClient.send(command);
        console.log(result);
    }
    catch (error){
        console.log(error);
    }
    return {
        statusCode:200
    }
};

const readTwitterConnections_sqs= async () =>{
    let command= new ReceiveMessageCommand({
      QueueUrl: connectionSqsUrl,
      WaitTimeSeconds: 10,
      MaxNumberOfMessages: 10,
      
    });
    let readSqsRes= await sqsClient.send(command);
    return readSqsRes;
  }
handler(event1);