const { passport, isAuthenticated } = require('./auth');
const jwt = require('jsonwebtoken');
const users = require('./users');

const apiSecret = process.env.JWT_API_SECRET;

/**
 * Uses JWT authentication
 * @param{object} req the http request
 * @param{object} res the http response
 * @return{undefined}
 */
function authenticate(req, res) {
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
}

/**
 * Provides extra user information
 * @param{object} req the http request
 * @param{object} res the http response
 * @return{object} the user object as json
 */
function userInfo(req, res) {
  const expiresIn = new Date(req.user.exp * 1000);
  return res.status(200).send({
    id: req.user.id,
    username: req.user.username,
    displayName: req.user.displayName,
    role: req.user.role,
    expiresIn: expiresIn.toISOString(),
  });
}

const { AccessToken } = require('twilio').jwt;

const { VideoGrant, ChatGrant } = AccessToken;
const {
  TWILIO_ACCOUNT_SID, TWILIO_API_SID, TWILIO_API_SECRET, TWILIO_CHAT_SERVICE_SID,
} = process.env;

/**
 * Generate a Twilio Access Token for the provided identity
 * @param{object} req the http request
 * @param{object} res the http response
 * @return{undefined} the identity and jwt token as json
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
  return res.status(200).send({
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
