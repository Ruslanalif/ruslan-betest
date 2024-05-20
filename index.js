

import dotenv from 'dotenv';
dotenv.config();
console.log("STARTING UP...");
const PORT = process.env.PORT || 5003;

import e from 'express';
import http from 'http';
import mainRoutes from './app/routes/main.routes.js';
import moment from 'moment-timezone';
import cors from 'cors';
import { Server } from 'socket.io';
import _dirname from './app/helper/__dirname.function.js';
import MongoConnection from './app/config/mongo_connection.js';
import cookieParser from 'cookie-parser';

const app = e();
const server = http.createServer(app);

if (process.env.ENVIRONMENT === "localhost") {
  const io = new Server(server);

  io.on("connection", socket => {
    console.log("New client connected");
    socket.emit("refresher", "do");
    socket.on('disconnect', function () {
      console.log("client disconnected");
    });
  });
}

moment.tz.setDefault("Asia/Jakarta");

var corsOptions = {
  origin: "*"
};
app.set('view engine', 'ejs');
app.use(cookieParser());

app.use(cors(corsOptions));

global.file_path = _dirname(import.meta.url) + '/app/assets/files';
global.BASE_URL = function (url) {
  return process.env.WEBVIEW_BASE_URL + url;
};
app.use("/static", e.static(_dirname(import.meta.url) + '/app/assets'));
// app.use("/formupload", e.static(_dirname(import.meta.url) + '/app/public'));
// app.use("/files", e.static(_dirname(import.meta.url) + '/app/assets/files'))

app.use((req, res, next) => {
//   const { cid } = req.query || {}; // const cid = req?.query.?cid;
  // console.log("x-target-cid", req.headers['x-target-cid'] || req.headers);
//   const current_cid = cid || req.headers['x-target-cid'];
//   if (!!current_cid) {
//     req.db_conn = getConnection(current_cid);
//     req.db_conn_raw = getRawConnectionData(current_cid);
//     req.mail_transporter = getMailTransporters(current_cid);
//   }
//   req.target_cid = req.headers['x-target-cid'];
//   req.company_aidi = req.headers["company_id"];
    req.db_conn = MongoConnection;
  next();
})

async function setupApp() {

  console.log("setting up environment ....");
//   const timeot = setTimeout(() => {
//     console.log("can't connect to database, exiting");
//     process.exit(2);
//   }, 5000);
  // await redisClient.connect();
  // console.log('redis connected to server', `${redisConfig.address}:${redisConfig.port}`, "selected db", redisConfig.db);
  // await globalMongoClient.connect();
  // console.log("mongo connected");
  await MongoConnection.open();
  console.log('Connected successfully to mongo server');
//   await RedisConnection.open();
//   await updateConnectionList();
//   clearTimeout(timeot);
  mainRoutes(app);
}

setupApp().then(() => {
  server.listen(process.env.PORT || 25421, () => {
    console.log(`Server is running on port ${process.env.PORT || 25421}.`);
  });
}).catch((err) => console.error(err));
