import { CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client= new DynamoDBClient({});
const docClient=  DynamoDBDocumentClient.from(client);

//////////////////////////////
const connectionId= 'P-Fw7cj5oAMCIoQ=';

const event1={
    Records: [
        {}
      ]    
  };

/////////////////////////////////

export const handler = async (event) =>{
    let connections= await getConnections();
    let result=await getUsers(connections.Items);
    console.log(result);
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
}

const getConnections= async() =>{
    let formatedDate= new Date();
    let year=formatedDate.getFullYear().toString();
    let command= new QueryCommand({
        TableName:"twitter-notification",
        KeyConditionExpression:"connectionDate=:connectionDate",
        ExpressionAttributeValues:{
            ":connectionDate":year
        },
        ConsistentRead: true,
    });
    let result= await docClient.send(command);
    return result;
}

const getUsers = async(userIds) =>{
    let users=[];
    for(let u of userIds){       
        let command= new QueryCommand({
            TableName:"twitterNewUsers",
            KeyConditionExpression:"#userId=:userId",
            ExpressionAttributeValues:{
                ":userId":u.userId
            },
            ExpressionAttributeNames:{
                "#userId":"_id"
            }
        });

        let {Items}= await docClient.send(command);
        Items[0]["connectionId"]=u.connectionId;
        users.push(Items[0]);
    }
    return users;
}
handler(event1);