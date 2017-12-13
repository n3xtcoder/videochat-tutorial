const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const jwt = require('jsonwebtoken');

const apiSecret = process.env.JWT_API_SECRET;
const jwtExpiration = 60 * 60 * 24;

// Define passport authentication using JSON Web Tokens
passport.use(new JwtStrategy({
  secretOrKey: apiSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('authorization'),
}, (jwtPayload, done) => {
  done(null, jwtPayload);
}));

module.exports.passport = passport;

module.exports.isAuthenticated = passport.authenticate('jwt', { session: false });

/**
 * Signs a jwt token for the authenticated user
 * @param{object} user the logged user object
 * @return{string} the signed jwt token
 */
module.exports.isAuthenticated = function signJwt(user) {
  return jwt.sign(user, apiSecret, { expiresIn: jwtExpiration });
};
