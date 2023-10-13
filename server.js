const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const { ExpressPeerServer } = require('peer');

//Env file & DB connect
dotenv.config();
require('./database/DBconnect');

const app = express();
const auth = require('./routes/auth');
const user = require('./routes/user');
const message = require('./routes/message');
const community = require('./routes/community');
const { socketConnection } = require('./utils/socket');

app.set('trust proxy', 1);
app.use(
  cors({
    // origin: ["http://localhost:3000", "https://nesconnect.xyz","https://www.nesconnect.tech","https://nesconnect.tech"],
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Origin',
      'X-Requested-With',
      'Authorization',
      'Set-Cookie',
    ],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use('/api/auth', auth);
app.use('/api/community', community);
app.use('/api/user', user);
app.use('/api/message', message);

//-------------------Deployment-------------------
// const __dirname1 = path.resolve();
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1,'/client/build')));
//   app.get('*',(req,res)=>{
//     res.sendFile(path.resolve(__dirname1,"client","build","index.html"))
//   })
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running successfully");
//   });
// }
//-------------------Deployment-------------------

//Port
const PORT = process.env.PORT || 3333;

const server = app.listen(PORT, console.log('Server is listen to port:', PORT));
const peer = app.listen(9000);

const peerServer = ExpressPeerServer(peer, {
  path: '/',
});

app.use('/stream', peerServer);

socketConnection(server);
