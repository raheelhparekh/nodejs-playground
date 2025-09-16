import express from "express"
import http from "http"
import {Server} from "socket.io"

const app=express()

const httpServer=http.createServer(app) // express server mounted on http server

const io=new Server()
io.attach(httpServer)


app.use(express.static('./public'))
io.on("connection",(socket)=>{
    console.log("a user connected with ", socket.id)


    socket.on("client message",(msg)=>{
        io.emit("server message",msg)
    })
})

app.get("/",(req,res)=>{
    res.send("Hello World")
})

httpServer.listen(8000,()=>console.log("listening on port 8000"))