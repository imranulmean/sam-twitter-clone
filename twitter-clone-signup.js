import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

////////////////////
const email="testfahad@gmail.com";
const password="123";

const signupObj={email,password}

const event1={
    body:JSON.stringify(signupObj)
}
///////////////////////
export const handler = async (event) => {

  const {email,password}= JSON.parse(event.body);
  const username=email.split("@");
  const hashPassword= bcrypt.hashSync(password,10);  
  const timestamp = new Date().getTime();
  const _id= timestamp.toString();  
  let result;
  
  //////// Checking if the user Exists/////////////////////

    result= await checkUserExist(email);
    console.log(result.Items);

   ////////////// If the User Not Exist Creating New User ///////////////// 
    
   if(result.Count==0){ 
        result = await createNewUser(_id, email, username[0],hashPassword);

      /////////////Now put the new user in the existing User Table////////////////////////
      if(result.$metadata.httpStatusCode==200){
            result = await putDataExistingUser(_id, email, username[0],hashPassword);
      }
     
    }
    
    else{
        result="User Already Existis";
    }
    //console.log(result);
    
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

const checkUserExist= async(email) =>{
    let command= new QueryCommand({
        TableName:"twitterExistingUsers",
        KeyConditionExpression:
          "email= :email",
        ExpressionAttributeValues: {
          ":email": email,
        },
         ConsistentRead: true,
      })
      try {
        return await docClient.send(command);
      } catch (error) {
          console.log(error);
      }
}
const createNewUser = async (_id,email,username,hashPassword) =>{
    let command= new PutCommand({
        TableName:"twitterNewUsers",
        Item:{
          "_id":_id,
          "email": email,
          "username":username,
          "password":hashPassword,
          "Date": new Date().toISOString()
        }
      });
      try {
        return await docClient.send(command);
      } catch (error) {
          console.log(error);
      }     
}

const putDataExistingUser = async (_id,email, username, hashPassword) =>{
    let command= new PutCommand({
        TableName:"twitterExistingUsers",
        Item:{
        "_id":_id,
        "email": email,
        "username":username,
        "password":hashPassword,
        "Date": new Date().toISOString()
        }
    });
    try {
        return await docClient.send(command);
    } catch (error) {
        console.log(error);
    }
}
await handler(event1);
