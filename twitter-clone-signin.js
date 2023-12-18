// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import { PutCommand, QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// const client = new DynamoDBClient({});
// const docClient = DynamoDBDocumentClient.from(client);

// ///////////////////////
// const email="test001@gmail.com";
// const password="123";

// const signupObj={email,password}

// const event1={
//     body:JSON.stringify(signupObj)
// }
// //////////////////////
// export const handler = async (event) => {

//   const {email,password}= JSON.parse(event.body);
//   const hashPassword= bcrypt.hashSync(password,10);  
//   const timestamp = new Date().getTime();
//   const _id= timestamp.toString();  
//   let result;
  
//   //////// Checking if the user Exists/////////////////////

//     result= await checkUserExist(email);
//     console.log(result.Items);

//    ////////////// If the User Exist check password ///////////////// 
    
//    if(result.Count==1){ 
//         let origin="http://localhost:5173"; 
//         let tokenObj={origin};
//         let tokenSecret="twitter-clone-token";
//         result = await checkPassword(password, result.Items[0]);
//         result["token"]=jwt.sign(tokenObj,tokenSecret);
//     }
    
//     else{
//         result="User Do Not Existis";
//     }

//     let response = {
//       statusCode: 200,
//       'headers': {
//           'Access-Control-Allow-Headers': 'Content-Type',
//           'Access-Control-Allow-Origin': '*',
//           'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
//       },    
//       body: JSON.stringify(result),
//     };
//   return response;
  
// };

// const checkUserExist= async(email) =>{
//     let command= new QueryCommand({
//         TableName:"twitterExistingUsers",
//         KeyConditionExpression:
//           "email= :email",
//         ExpressionAttributeValues: {
//           ":email": email,
//         },
//          ConsistentRead: true,
//       })
//       try {
//         return await docClient.send(command);
//       } catch (error) {
//           console.log(error);
//       }
// }

// const checkPassword = async (uiPassword, userData )=>{
//     const isCorrect = await bcrypt.compare(uiPassword, userData.password);
//     if (!isCorrect) return "Password Do not Match";
//     return userData;
// }
// await handler(event1);



//////////////////////////// Checking goolge Auth ///////////////
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

///////////////////////
const email="imranulhasan73@gmail.com";
const password="123";
const type="google";
const profilePicture="123.jpg";
const signinObj={email,password,type,profilePicture};

const event1={
    body:JSON.stringify(signinObj)
}
//////////////////////
export const handler = async (event) => {

  const {email,password,type,profilePicture}= JSON.parse(event.body);
  const username=email.split("@");
  const timestamp = new Date().getTime();
  const _id= timestamp.toString();  
  let result;
  let origin="http://localhost:5173"; 
  //////// Checking if the user Exists/////////////////////

    result= await checkUserExist(email);
    console.log(result.Items);
   ////////////// If the User Exist check password ///////////////// 
    
   if(result.Count==1){ 
        
        let tokenObj={origin};
        let tokenSecret="twitter-clone-token";
        
        if(type=== "google"){
            result=result.Items[0];
        }
        else{
            result = await checkPassword(password, result.Items[0]);
        }
        
        result["token"]=jwt.sign(tokenObj,tokenSecret);
    }
    
    else{
        /// If Google User not exist create New google User 
        if(type==="google"){
            const hashPassword= bcrypt.hashSync("2010-2-60-008",10);
            result = await createNewUser(_id, email, username[0],hashPassword,profilePicture);

      /////////////Now put the new user in the existing User Table////////////////////////
            if(result.$metadata.httpStatusCode==200){
                result = await putDataExistingUser(_id, email, username[0],hashPassword);
            } 
            /////////// Now Login The Googgle User ////////
            result= await checkUserExist(email);
            result=result.Items[0];
            let tokenObj={origin};
            let tokenSecret="twitter-clone-token";   
            result["token"]=jwt.sign(tokenObj,tokenSecret);                
        }
        else{
            result="User Do Not Existis";
        }        
        
    }
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

const checkPassword = async (uiPassword, userData )=>{
   
    const isCorrect = await bcrypt.compare(uiPassword, userData.password);
    if (!isCorrect) return "Password Do not Match";
    return userData;
}

const createNewUser = async (_id,email,username,hashPassword,profilePicture) =>{
    let command= new PutCommand({
        TableName:"twitterNewUsers",
        Item:{
          "_id":_id,
          "email": email,
          "username":username,
          "password":hashPassword,
          "followers":[],
          "following":[],
          "profilePicture":profilePicture,
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




