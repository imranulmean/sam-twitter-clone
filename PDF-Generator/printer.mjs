import Printer from 'node-printer';
import fs from 'fs';

console.log(Printer.list());

const printInitial=()=>{
    let data=fs.readFileSync('./hello.txt','utf-8');
    // console.log(data);
    let wordArray=data.split(/[ \r\n]+/);
    console.log(wordArray);
}

const fileWatcher= fs.watch("./hello.txt", (e)=>{
    if(e==="change"){
        console.log("File Changed");
        printInitial();        
    }
})
printInitial();