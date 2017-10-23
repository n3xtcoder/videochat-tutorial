const {passport, authenticate, isAuthenticated} = require('./auth')

const {TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_API_SECRET} = process.env

function createToken( req, res ) {

    console.log("creating twillio token... for user " + req.user.username)

    // TODO talk to twillio

    res.status(200).send({ token: "test" })
}

module.exports = function ( app ) {

    app.use(passport.initialize())

    app.post('/user', authenticate)

    app.get('/token', isAuthenticated, createToken)

}