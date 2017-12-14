const { AccessToken } = require('twilio').jwt;

const { VideoGrant, ChatGrant } = AccessToken;
const {
  TWILIO_ACCOUNT_SID, TWILIO_API_SID, TWILIO_API_SECRET, TWILIO_CHAT_SERVICE_SID,
} = process.env;


/**
 * Generates a signed Twilio access token with video and chat capabilities
 * @param{string} identity the Twilio identity to assing to this token
 * @return{object} token the generated Twilio token with video and optional audio grant
 */
module.exports.createToken = function createToken(identity) {
  const token = new AccessToken(TWILIO_ACCOUNT_SID, TWILIO_API_SID, TWILIO_API_SECRET);

  // Assign the given identity to the token
  token.identity = identity;

  // Grant the access token Twilio Video capabilities
  const videoGrant = new VideoGrant();
  token.addGrant(videoGrant);

  // Grant the access token Twilio Chat capabilities
  if (TWILIO_CHAT_SERVICE_SID) {
    const chatGrant = new ChatGrant({
      serviceSid: TWILIO_CHAT_SERVICE_SID,
      endpointId: `minddoc-videochat:${identity}:browser`,
    });
    token.addGrant(chatGrant);
  }

  return token;
};
