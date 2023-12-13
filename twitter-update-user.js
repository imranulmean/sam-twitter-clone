import { DynamoDBClient, UpdateItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, UpdateCommand ,DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

////////////////////

const userId="1702116038174"; /// You are going to follow this id
const email="test002@gmail.com"; /// userId2 is the Follower
const profilePic="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
const updateUserObj={userId,email,profilePic}


const event1={
    body:JSON.stringify(updateUserObj)
}
///////////////////////

export const handler = async (event) => {
  let result;
  
  const {userId, email, profilePic}= JSON.parse(event.body);
    /////////////////// Getting Tweets by UserId ///////////
    result= await updateUser(userId, email, profilePic);
    console.log("showing result/////////// Final",result);
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
  
};

const updateUser = async (userId, email, profilePic) =>{
    let command= new UpdateCommand({
        TableName:'twitterNewUsers',
        Key:{
            "_id":userId,
            "email":email
        },
        UpdateExpression:"set profilePicture=:profilePic",
        ExpressionAttributeValues:{
            ":profilePic":profilePic
        },
        ReturnValues: 'ALL_NEW',
    });
    const updateUserRes= await docClient.send(command);
    console.log(updateUserRes);
    // return updateUserRes;
}

await handler(event1);

