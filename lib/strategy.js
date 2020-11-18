var util = require('util')
var OAuth2Strategy = require('passport-oauth2')

/**
 * First, register a Mendeley API client:
 * https://dev.mendeley.com/myapps.html
 *
 * Options:
 *   - `clientID`      your Mendeley application's client id
 *   - `clientSecret`  your Mendeley  application's client secret
 *   - `callbackURL`   URL to which Mendeley  will redirect the user after granting authorization
 *
 * Example:
 *
 *     passport.use(new Mendeley Strategy({
 *         state: true, // remove this if not using sessions,
 *         clientID: process.env.MENDELEY_CLIENT_ID,
 *         clientSecret: process.env.MENDELEY_CLIENT_SECRET,
 *         callbackURL: 'https://your.host/auth/mendeley/callback',
 *      },
 *         async function (accessToken, refreshToken, params, profile, done) {
 *           // `profile` is empty as Mendeley has no generic profile URL,
 *           // so populate the profile object from the api instead
 *           const { data: profileData } = await axios.get('https://api.mendeley.com/profiles/me', {
 *             headers: {
 *               Authorization: 'Bearer ' + accessToken,
 *               'Content-Type': 'application/json'
 *             }
 *           })
 *
 *           // Example call to mendeley to get your papers.
 *           const { data: papers } = await axios.get('https://api.mendeley.com/documents', {
 *             headers: {
 *               Authorization: 'Bearer ' + accessToken,
 *               'Content-Type': 'application/json'
 *             }
 *           })
 *
 *           profile = { email: profileData.email, papers }
 *           return done(null, profile)
 *         }))
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */
function Strategy (options, verify) {
  options.scope = options.scope || 'all'
  options.authorizationURL = 'https://api.mendeley.com/oauth/authorize'
  options.tokenURL = 'https://api.mendeley.com/oauth/token'

  OAuth2Strategy.call(this, options, verify)
  this.name = 'mendeley'
}

util.inherits(Strategy, OAuth2Strategy)

module.exports = Strategy
