const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const apiSecret = process.env.JWT_API_SECRET;

passport.use(new JwtStrategy({
  secretOrKey: apiSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('authorization'),
}, (jwtPayload, done) => {
  done(null, jwtPayload);
}));

module.exports.passport = passport;

module.exports.isAuthenticated = passport.authenticate('jwt', { session: false });
