const dotenv = require('dotenv'); // 설정파일
dotenv.config();
const express = require('express');
const app = express();
const connect = require('./server/schemas/db');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');
const port = 3000;
const usersRouter = require('./server/routes/users');
const postsRouter = require('./server/routes/posts');
const messageRouter = require('./server/routes/message');
const commentsRouter = require('./server/routes/comments');
const likesRouter = require('./server/routes/likes');
const workSpaceRouter = require('./server/routes/workSpaces');
const passport = require('passport');
const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const cookieParser = require('cookie-parser');
const kakaoRouter = require('./server/routes/kakao');
const dayRouter = require('./server/routes/day');
const naverRouter = require('./server/routes/naver');
const taskRouter = require('./server/routes/task');

global.logger || (global.logger = require('./server/config/logger')); // → 전역에서 사용
const morganMiddleware = require('./server/config/morganMiddleware');
app.use(morganMiddleware); // 콘솔창에 통신결과 나오게 해주는 것

connect();

const moment = require('moment');
const { application } = require('express');
require('moment-timezone');
moment.tz.setDefault('Asia/seoul');
const createdAt = moment().format('HH:mm');
console.log('현재 시각은 ' + createdAt + ' 입니다.');

app.use(morgan('combined'));
app.use(cors());
app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({ secret: 'MySecret', resave: false, saveUninitialized: true })
);

app.use('/api', [usersRouter, postsRouter, messageRouter, commentsRouter, likesRouter, workSpaceRouter]);
app.use('/', [kakaoRouter, dayRouter, naverRouter,taskRouter]);
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.send('실전 파이널 프로젝트 서버');
});

module.exports = server;
