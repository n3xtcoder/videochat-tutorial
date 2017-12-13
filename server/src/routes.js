const {
  passport, authenticate, isAuthenticated, userInfo,
} = require('./auth');

const { AccessToken } = require('twilio').jwt;

const { VideoGrant, ChatGrant } = AccessToken;

const {
  TWILIO_ACCOUNT_SID, TWILIO_API_SID, TWILIO_API_SECRET, TWILIO_CHAT_SERVICE_SID,
} = process.env;

/**
 * Generate a Twilio Access Token for the provided identity
 * @param{object} req the http request
 * @param{object} res the http response
 * @return{undefined}
 */
function createToken(req, res) {
  const identity = req.user.username;
  console.log(`creating twillio token for identity "${identity}"`);

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created.
  const token = new AccessToken(TWILIO_ACCOUNT_SID, TWILIO_API_SID, TWILIO_API_SECRET);

  // Assign the generated identity to the token.
  token.identity = identity;

  // Grant the access token Twilio Video capabilities.
  const videoGrant = new VideoGrant();
  token.addGrant(videoGrant);

  // Grant the access token Twilio Chat capabilities.
  if (TWILIO_CHAT_SERVICE_SID) {
    const chatGrant = new ChatGrant({
      serviceSid: TWILIO_CHAT_SERVICE_SID,
      endpointId: `minddoc-videochat:${identity}:browser`,
    });
    token.addGrant(chatGrant);
  }

  // Serialize the token to a JWT string and include it in a JSON response.
  res.status(200).send({
    identity: token.identity,
    token: token.toJwt(),
  });
}

module.exports = function (app) {
  app.use(passport.initialize());
  app.post('/user', authenticate);
  app.get('/info', isAuthenticated, userInfo);
  app.get('/token', isAuthenticated, createToken);
};
