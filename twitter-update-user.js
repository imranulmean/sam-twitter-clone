import { DynamoDBClient, UpdateItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, UpdateCommand ,DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

////////////////////

const userId="1703289792581"; /// You are going to follow this id
const email="jhonnysk007@gmail.com"; 
// const profilePic="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
const profilePic="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ489dlrjRhzoW4whK964CeiA_TZF4RH6vKpeXfrDYTgFyOtKAAxp2KGjmYfYKMHvLFG3Q&usqp=CAU"
const type="coverPhoto"
const updateUserObj={userId,email,profilePic,type}


const event1={
    body:JSON.stringify(updateUserObj)
}
///////////////////////

export const handler = async (event) => {
  let result;
  
  const {userId, email, profilePic,type}= JSON.parse(event.body);

    result= await updateUser(userId, email, profilePic, type);
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

const updateUser = async (userId, email, profilePic, type) =>{
  let updateExpression;
  console.log(type);
  
  if(type=== "profilePic"){
    updateExpression="set profilePicture=:profilePic";
  }
  if(type=== "coverPhoto"){
    updateExpression="set coverPhoto=:profilePic";
  }
    let command= new UpdateCommand({
        TableName:'twitterNewUsers',
        Key:{
            "_id":userId,
            "email":email
        },
        UpdateExpression:updateExpression,
        ExpressionAttributeValues:{
            ":profilePic":profilePic
        },
        ReturnValues: 'ALL_NEW',
    });
    const updateUserRes= await docClient.send(command);   
    return updateUserRes;
}

await handler(event1);

