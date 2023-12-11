import jwt from "jsonwebtoken";

////////////////////

const name="john doe"; /// You are going to follow this id
const origin="http://localhost:5173"; /// userId2 is the Follower

const tokenObj={name,origin}

const event1={
    authorizationToken:tokenObj
}
///////////////////////

export const handler = async (event) => {

    const token=event.authorizationToken;
    console.log(token);
    // const token= jwt.sign(tokenObj,"twitter-clone");
    // console.log("encoded Token", token);
    // const decoded=jwt.verify(token,"twitter-clone");
    // console.log("Decoded Token:",decoded);

    let response, policy, principalId, context;
  
    const token=event.authorizationToken;
    if(token === "arn"){
      policy=genPolicy('allow', event.methodArn);
      principalId="*";
    } else if( token === "narn"){
  
      policy=genPolicy('deny', event.methodArn);
      principalId="*";
    }else {
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
    stmt.Resource=["arn:aws:execute-api:us-east-1:201814457761:0ko7jyglbb/*/POST/mern-state-auth-signip",
                  "arn:aws:execute-api:us-east-1:201814457761:0ko7jyglbb/*/POST/mern-state-auth-signip/*"
                  ];
  
    //stmt.Resource=resource;
    policy.Statement.push(stmt);
    return policy;    
}
     
await handler(event1);

