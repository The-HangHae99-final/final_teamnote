const dotenv = require('dotenv').config();
// const Acess_ = require('../schemas/access_token');
var express = require('express');
var router = express.Router();
const axios = require('axios');
const { request } = require('express');
var socialUser = require('../schemas/social_user');

// Rediect URI : http://localhost:3000/auth/login/kakao/callback
//로직
const KAKAO_OAUTH_TOKEN_API_URL = 'https://kauth.kakao.com/oauth/token';
const KAKAO_GRANT_TYPE = 'authorization_code';
const client_id = process.env.client_id;
console.log('client_id:', client_id);
const KAKAO_REDIRECT_URL = 'http://localhost:3000/auth/login/kakao/callback';

// router.post(
//   '/auth/login/kakao/callback',

function kakao_callback(req, res, next) {
  try {
    let code = req.body.code;
    try {
      axios
        .post(
          `${KAKAO_OAUTH_TOKEN_API_URL}?grant_type=${KAKAO_GRANT_TYPE}&client_id=${client_id}&redirect_uri=${KAKAO_REDIRECT_URL}&code=${code}`,
          {
            headers: {
              'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
          }
        )
        .then((result) => {
          console.log(result.data['access_token']);
          res.send(result.data['access_token']);
          // 토큰을 활용한 로직을 적어주면된다.
        })
        .catch((e) => {
          console.log(e);
          res.send(e);
        });
    } catch (e) {
      console.log(e);
      res.send(e);
    }
  } catch (err) {
    res.status(400).send('에러가 발생했습니다.');
    console.log('error =' + err);
  }
}
// 프론트에게서 인가코드를 받는다 post_1
// 서버에서 인가코드를 가지고 카톡에게서 토큰을 받는다.
// 토큰을 클라이언트에게 보낸다.
// 클라이언트가 토큰을 바디에 담아서 다시 post 요청을 한다. post_2
// 백엔드에서 토큰을 가지고 다시 카톡에게 정보를 요청한다.
// 정보를 클라이언트에게 보낸다.
// 클라이언트가 받고 데이터를 파싱해서 다시 보낸다.post_3  // 데이터 파싱문제!!
// 백엔드가 받아서 DB에 저장한다.

// router.post('/kakao/member',
function kakao_member(req, res) {
  try {
    var api_url = 'https://kapi.kakao.com/v2/user/me';
    var request = require('request');
    var token = req.body.token;
    console.log(token);
    var header = 'Bearer ' + token; // Bearer 다음에 공백 추가
    console.log('header: ' + header);
    var options = {
      url: api_url,
      headers: { Authorization: header },
    };
    request.get(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
        res.end(body);
        console.log(body);
      } else {
        console.log('error');
        if (response != null) {
          res.status(response.statusCode).end();
          console.log('error = ' + response.statusCode);
        }
      }
    });
  } catch (err) {
    res.status(400).send('에러가 발생했습니다.');
    console.log('error =' + err);
  }
}

// router.post('/kakao/parsing',
async function kakao_parsing(req, res) {
  try {
    const site = 1; //kakao
    const user_info = req.body;
    console.log('user_info = ' + user_info);
    const _user = user_info.user_id;
    console.log('_user: ', _user);
    const email = user_info.user_email;
    console.log('email: ', email);
    const userId = user_info.user_name;
    const double = await socialUser.findOne({ email });
    console.log('double: ', double);

    if (!double) {
      const social = new socialUser({ userId, email, _user, site });
      social.save();
      res.send('저장에 성공하였습니다.');
    } else {
      res.send('이미 있는 유저입니다.');
    }
    // 예외조건넣기. 유저가 디비에 있으면 저장하지않기.
  } catch (err) {
    res.status(400).send('에러가 발생했습니다.');
    console.log('error =' + err);
  }
}

module.exports = {
  kakao_callback,
  kakao_member,
  kakao_parsing,
};
