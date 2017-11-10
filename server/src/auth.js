const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const jwt = require('jsonwebtoken');
const users = require('./users');

const apiSecret = process.env.JWT_API_SECRET;

passport.use(new JwtStrategy({
  secretOrKey: apiSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('authorization'),
}, (jwtPayload, done) => {
  done(null, jwtPayload);
}));

module.exports.passport = passport;

module.exports.isAuthenticated = passport.authenticate('jwt', { session: false });

module.exports.authenticate = function authenticate(req, res) {
  const { username, password } = req.body;

  users.findByUsername(username, (err, user) => {
    // handle errors
    if (err) {
      console.error(err);
      return res.status(400).send({
        message: 'bad request',
      });
    }

    // not found
    if (!user) {
      return res.status(404).send({
        message: 'user not found',
      });
    }

    // check password
    if (!(user.password === password)) {
      return res.status(401).send({
        message: 'authentication failed',
      });
    }

    // create signed JWT
    return res.status(200).send({
      jwt: jwt.sign(user, apiSecret, { expiresIn: 60 * 60 * 24 }),
    });
  });
};
