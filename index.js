const http = require('http');
const url = require('url');
const {WebSocketServer} = require('ws');
const uuidv4=require('uuid').v4

const server =http.createServer()

const wsServer=new WebSocketServer({server})
const port =8000
const connections={}
const users={}

server.listen(port,()=>console.log(`Server is listening on port ${port}`))

const broadcast=()=>{
    Object.keys(connections).forEach((uuid)=>{
        const connection=connections[uuid]
        const message=JSON.stringify(users)
        connection.send(message)
        console.log(message)
        
    })
}

const handleMessege=(byte,uuid)=>{
    const message=JSON.parse(byte.toString())
    
    console.log(message)
    users[uuid].state=message
    broadcast()
}


wsServer.on('connection',(connection,request)=>{
    const {username}=url.parse(request.url,true).query
    const uuid=uuidv4()
    console.log(`User ${username} connected`)
    connections[uuid]=connection
    users[uuid]={
        username:username,
        state:{
            message:""
        }
    }
    connection.on('open',()=>console.log('Connection opened'))
    connection.on('message',(byte)=>handleMessege(byte,uuid))
    connection.on('close',()=>{
        delete connections[uuid]
        delete users[uuid]
        broadcast()
    })


})



