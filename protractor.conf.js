/**
 * Created by howard on 4/8/17.
 */
// conf.js
exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['test/e2e/*.js'],
    allScriptsTimeout: 11000,
    capabilities: {
        'browserName': 'chrome'
    }
};