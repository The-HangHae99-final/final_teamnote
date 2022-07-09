const jwt = require('jsonwebtoken');
const  user  = require('../schemas/user');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization == null) {
    console.log('authorization: ', authorization);
    res.status(401).send({
      errorMessage: '로그인이 필요합니다.----------null------------',
    });
    return;
  }

  const [tokenType, tokenValue] = authorization.split(' ');
  console.log('tokenValue: ', tokenValue);
  console.log('tokenType: ', tokenType);

  if (tokenType !== 'Bearer') {
    console.log('tokenType: ', tokenType);
    res.status(401).send({
      errorMessage:
        error.message + '로그인이 필요합니다.---------Bearer----------',
    });
    return;
  }

  try {
    const myToken = verifyToken(tokenValue);
    console.log('myToken: ', myToken);
    if (myToken == 'jwt expired') {
      // access token 만료
      const userInfo = jwt.decode(tokenValue, 'secret');
      console.log('1111111userInfo1111111: ', userInfo);
      const userId = userInfo.userId;
      let refresh_token;
      user.findOne({ where: userId }).then((u) => {
        refresh_token = u.refresh_token;
        const myRefreshToken = verifyToken(refresh_token);
        if (myRefreshToken == 'jwt expired') {
          console.log('222222222myRefreshToken222222222: ', myRefreshToken);
          res.send({
            errorMessage:
              error.message + '로그인이 필요합니다.---------expired----------',
          });
        } else {
          const myNewToken = jwt.sign({ userId: u.userId }, 'secret', {
            expiresIn: '1200s',
          });
          console.log('3333333333myNewToken3333333333: ', myNewToken);
          res.send({ message: 'new token', myNewToken });
        }
      });
    } else {
      const  { userId }  = jwt.verify(tokenValue, 'secret');
      console.log('userId: ', userId);
      console.log('44444444444userId444444444444: ', userId);
      user.findOne({ userId }).then((u) => {
        res.locals.user = u;
        next();
      });
    }
  } catch (err) {
    console.log('에러받아라-------------------------' + err);
    res.send({
      errorMessage: err + ' : 로그인이 필요합니다. -----------그외-----------',
    });
  }
};

function verifyToken(token) {
  try {
    return jwt.verify(token, 'secret');
  } catch (error) {
    return error.message;
  }
}
