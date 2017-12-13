// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

// automatically uses dev Server port from /config.index.js
// default: http://localhost:8080
// see nightwatch.conf.js
const getUrl = (browser, path) => `${browser.globals.devServerURL}${path}`;

const login = {
  doctor: {
    username: 'doctor',
    password: 'password',
  },
  patient: {
    username: 'patient',
    password: 'password',
  },
  incorrect: {
    username: 'UserDoesNotExist',
    password: 'whatever',
  },
};

module.exports = {
  'Logs in as doctor and gets redirected to Home': function test(browser) {
    browser
      .url(getUrl(browser, '/login'))
      .waitForElementVisible('.app', 1000)
      .assert.containsText('h2', 'Login')
      .setValue('input[type=text]', login.doctor.username)
      .setValue('input[type=password]', login.doctor.password)
      .click('button[type=submit]')
      .waitForElementNotPresent('button[type=submit]', 1000)
      .assert.urlEquals(getUrl(browser, '/'))
      .end();
  },
  'Logs in as patient and gets redirected to Home': function test(browser) {
    browser
      .url(getUrl(browser, '/login'))
      .waitForElementVisible('.app', 1000)
      .assert.containsText('h2', 'Login')
      .setValue('input[type=text]', login.patient.username)
      .setValue('input[type=password]', login.patient.password)
      .click('button[type=submit]')
      .waitForElementNotPresent('button[type=submit]', 1000)
      .assert.urlEquals(getUrl(browser, '/'))
      .end();
  },
  'Displays 404 error message for username that does not exist': function test(browser) {
    browser
      .url(getUrl(browser, '/login'))
      .waitForElementVisible('.app', 1000)
      .assert.containsText('h2', 'Login')
      .setValue('input[type=text]', login.incorrect.username)
      .setValue('input[type=password]', login.incorrect.password)
      .click('button[type=submit]')
      .waitForElementVisible('.alert', 5000)
      .assert.containsText('.alert', 'User Not Found (404)')
      .assert.urlEquals(getUrl(browser, '/login'))
      .end();
  },
  'Displays 401 error message for incorrect password': function test(browser) {
    browser
      .url(getUrl(browser, '/login'))
      .waitForElementVisible('.app', 1000)
      .assert.containsText('h2', 'Login')
      .setValue('input[type=text]', login.doctor.username)
      .setValue('input[type=password]', login.incorrect.password)
      .click('button[type=submit]')
      .waitForElementVisible('.alert', 5000)
      .assert.containsText('.alert', 'Authentication Failed (401)')
      .assert.urlEquals(getUrl(browser, '/login'))
      .end();
  },
};
