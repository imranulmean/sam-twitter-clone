import { CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
const client = new DynamoDBClient({});

export const handler= async ()=>{
    
    // await twitterNewUsers();
    // await twitterExistingUsers();
    // await tweets();
    // await tweetByDates();
    // await twitterNotification();
    await commentsTable();
}

const commentsTable= async () =>{
  let command= new CreateTableCommand({
    TableName:"comments",
    AttributeDefinitions:[
      {
        AttributeName:"tweetId",
        AttributeType:"S"
      },
      {
        AttributeName:"createdAt",
        AttributeType:"S"
      },
    ],
    KeySchema:[
      {
        AttributeName:"tweetId",
        KeyType:"HASH"
      },
      {
        AttributeName:"createdAt",
        KeyType:"RANGE"
      }
    ],
    ProvisionedThroughput:{
      ReadCapacityUnits:1,
      WriteCapacityUnits:1
    }
  });

  try {
    let res=await client.send(command);
    console.log(res);
  } catch (error) {
    console.log(error);
  }
}

const twitterNotification = async () =>{
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
      let response= await client.send(command);
      console.log(response);
  } catch (error) {
    
  }
}

const twitterNewUsers = async () =>{
    const command = new CreateTableCommand({
        TableName: "twitterNewUsers",
        AttributeDefinitions: [
          {
            AttributeName: "_id",
            AttributeType: "S",
          },
          {
            AttributeName: "email",
            AttributeType: "S",
          },      
        ],
        KeySchema: [
          {
            AttributeName: "_id",
            KeyType: "HASH",
          },
          {
            AttributeName: "email",
            KeyType: "RANGE",
          }      
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      });
      try {
          let response= await client.send(command);
          console.log(response);
      } catch (error) {
          console.log(error)
      }
}

const twitterExistingUsers = async () =>{
    const command = new CreateTableCommand({
        TableName: "twitterExistingUsers",
        AttributeDefinitions: [
          {
            AttributeName: "email",
            AttributeType: "S",
          },
          {
            AttributeName: "_id",
            AttributeType: "S",
          },      
        ],
        KeySchema: [
          {
            AttributeName: "email",
            KeyType: "HASH",
          },
          {
            AttributeName: "_id",
            KeyType: "RANGE",
          }      
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      });
      try {
        let response= await client.send(command);
        console.log(response);
    } catch (error) {
        console.log(error)
    }
}

const tweets = async () =>{
    const command = new CreateTableCommand({
        TableName: "tweets",
        AttributeDefinitions: [
          {
            AttributeName: "_id",
            AttributeType: "S",
          },
          {
            AttributeName: "userId",
            AttributeType: "S",
          },      
        ],
        KeySchema: [
          {
            AttributeName: "userId",
            KeyType: "HASH",
          },
          {
            AttributeName: "_id",
            KeyType: "RANGE",
          }      
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      });  
      try {
        let response= await client.send(command);
        console.log(response);
    } catch (error) {
        console.log(error)
    }
}

const tweetByDates = async () =>{
    const command = new CreateTableCommand({
        TableName: "tweetByDates",
        AttributeDefinitions: [
          {
            AttributeName: "year",
            AttributeType: "S",
          },
          {
            AttributeName: "tweet_date",
            AttributeType: "S",
          },      
        ],
        KeySchema: [
          {
            AttributeName: "year",
            KeyType: "HASH",
          },
          {
            AttributeName: "tweet_date",
            KeyType: "RANGE",
          }      
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      });   
      try {
        let response= await client.send(command);
        console.log(response);
    } catch (error) {
        console.log(error)
    }
}

await handler();