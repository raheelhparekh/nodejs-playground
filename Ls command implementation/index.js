import http from "http";
import fs, { readFile } from "fs";
import { Server } from "socket.io";
import express from "express";

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.use(express.static("./public"));
app.get("/", (req, res) => {});

const directoryPath = "./watching";
let initialFile = fs.readdirSync(directoryPath);

let watch = fs.watch(directoryPath);

watch.on("change", () => {
  console.log("file changed");
  io.emit("file changed");

  readFileChange();
});

const readFileChange = () => {
  let currentFile = fs.readdirSync(directoryPath);
  console.log(currentFile);
  initialFile = currentFile;
};

io.on("connection", (socket) => {
  console.log("user connected");
});

httpServer.listen(8000, () => {
  console.log("listening on port 8000");
});
