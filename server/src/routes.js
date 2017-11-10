const { passport, authenticate, isAuthenticated } = require('./auth');

const { AccessToken } = require('twilio').jwt;

const { VideoGrant } = AccessToken;

const { TWILIO_ACCOUNT_SID, TWILIO_API_SID, TWILIO_API_SECRET } = process.env;

/**
 * Generate a Twilio Access Token for the provided identity
 * @param{object} req the http request
 * @param{object} res the http response
 * @return{undefined}
 */
function createToken(req, res) {
  console.log(`creating twillio token... for user ${req.user.username}"`);

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created.
  const token = new AccessToken(TWILIO_ACCOUNT_SID, TWILIO_API_SID, TWILIO_API_SECRET);

  // Assign the generated identity to the token.
  token.identity = req.user.username;

  // Grant the access token Twilio Video capabilities.
  const grant = new VideoGrant();
  token.addGrant(grant);

  // Serialize the token to a JWT string and include it in a JSON response.
  res.status(200).send({
    identity: token.identity,
    token: token.toJwt(),
  });
}

module.exports = function (app) {
  app.use(passport.initialize());
  app.post('/user', authenticate);
  app.get('/token', isAuthenticated, createToken);
};
