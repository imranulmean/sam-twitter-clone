import express from 'express';
import cors from 'cors';
import WebSocket,{ WebSocketServer }  from 'ws';
import http from 'http';

const app= express();
const server= http.createServer(app);
const wss = new WebSocketServer({ server });
const clients= new Map();

app.use(cors());
app.use(express.json());

app.get("/getConnectedClients", async(req,res)=>{
    res.json([...clients.keys()]);
});

wss.on('connection',(ws,req)=>{
    // console.log("new Client added:",req.url);
    let connectedUser;
    const queryString = req.url.split('?')[1]; // Extract the query string
    const queryParams = new URLSearchParams(queryString);
    queryParams.forEach((value, key) => {
        // console.log(`${key}: ${value}`);
        let connectedUser=JSON.parse(value);
        clients.set(connectedUser.email,ws);
      });      
    ws.on('message', (message)=>{
        try {
            let messageObj=JSON.parse(message);
            let client=clients.get(messageObj.clientId);
            client.send(JSON.stringify(messageObj));

        } catch (error) {
            console.log(error);
        }
    })
    // ws.send(`Socket is hello back`);

    
});

server.listen(5000,()=>{
    console.log("Server Started at 3000");
});