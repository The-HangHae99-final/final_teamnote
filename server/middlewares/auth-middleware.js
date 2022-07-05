const jwt = require('jsonwebtoken');
const user = require('../schemas/user');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization == null) {
    res.status(401).send({
      message: '로그인을 먼저 해 주세요.',
    });
    return;
  }

  const [tokenType, tokenValue] = authorization.split(' ');

  if (tokenType !== 'Bearer') {
    res.status(401).send({
      message: '로그인을 먼저 해 주세요.',
    });
    return;
  }

  try {
    const myToken = verifyToken(tokenValue);
    if (myToken == 'jwt expired') {
      // access token 만료
      const userInfo = jwt.decode(tokenValue, 'secret');
      const user_id = userInfo.user_id;
      let refresh_token;
      user.findOne({ where: user_id }).then((u) => {
        refresh_token = u.refresh_token;
        const myRefreshToken = verifyToken(refresh_token);
        if (myRefreshToken == 'jwt expired') {
          res.send({ message: '로그인을 먼저 해 주세요.' });
        } else {
          const myNewToken = jwt.sign({ user_id: u.user_id }, 'secret', {
            expiresIn: '1200s',
          });
          res.send({ message: 'new token', myNewToken });
        }
      });
    } else {
      const { user_id } = jwt.verify(tokenValue, 'secret');
      user.findOne({ user_id }).then((u) => {
        res.locals.user = u;
        next();
      });
    }
  } catch (err) {
    res.send({ message: '로그인을 먼저 해 주세요.' });
  }
};

function verifyToken(token) {
  try {
    return jwt.verify(token, 'secret');
  } catch (error) {
    return error.message;
  }
}
