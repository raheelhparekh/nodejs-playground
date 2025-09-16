import http from "http";
import fs from "fs";
import { Server } from "socket.io";
import express from "express";

const app=express()
const httpServer = http.createServer(app);

app.use(express.static("./public"));
app.get("/", (req, res) => {
  res.sendFile("client.html", { root: "./public" });
});

const io = new Server(httpServer);

const filePath = "./app.log";

let size = fs.statSync(filePath).size;
console.log(size);

const watch = fs.watch(filePath);
// console.log(watch)

watch.on("change", () => {
  watchFileForChanges();
});

function watchFileForChanges() {
  const stats = fs.statSync(filePath);
  console.log(`file size: ${stats.size}`);

  if (stats.size > size) {
    const stream = fs.createReadStream(filePath, {
      start: size,
      end: stats.size,
      encoding: "utf-8",
    });

    stream.on("data", (chunk) => {
      console.log(chunk);
      io.emit("message", chunk);
    });

    size = stats.size;
    console.log(`new size: ${size}`);
  }
}

io.on("connection", (socket) => {
  console.log("a user connected");
});

httpServer.listen(3000, () => {
  console.log("listening on port 3000");
});
