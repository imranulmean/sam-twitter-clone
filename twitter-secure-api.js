import jwt from "jsonwebtoken";

////////////////////
const event1={
    authorizationToken:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmlnaW4iOiJodHRwOi8vbG9jYWxob3N0OjUxNzMiLCJpYXQiOjE3MDIzNjM3OTd9.rqgZ2Nki82yhQLM5ZJkHLL54eP5XbMv0qz-QE_GCDEs",
    methodArn:"123456"
}
///////////////////////

export const handler = async (event) => {
    const origin="http://localhost:5173";
    let tokenSecret="twitter-clone-token";
    let response, policy, principalId, context;
    const token=event.authorizationToken;
    const decodedToken=jwt.verify(token,tokenSecret);
  if(decodedToken.origin === origin){
      policy=genPolicy('allow', event.methodArn);
      principalId="*";
    } else {
      
      return response="Unauthorized Acces";
    }
    
       response={
        principalId,
        policyDocument:policy,
        context
      }
      return response;    
  
};

const genPolicy = (effect, resource) =>{
    const policy={};
    policy.Version="2012-10-17";
    policy.Statement=[];
    const stmt={};
    stmt.Action="execute-api:Invoke";
    stmt.Effect=effect;
    // stmt.Resource=["arn:aws:execute-api:us-east-1:201814457761:0ko7jyglbb/*/POST/mern-state-auth-signip",
    //               "arn:aws:execute-api:us-east-1:201814457761:0ko7jyglbb/*/POST/mern-state-auth-signip/*"
    //               ];
  
    stmt.Resource=resource;
    policy.Statement.push(stmt);
    return policy;    
}
     
// await handler(event1);

