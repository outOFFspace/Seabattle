/**
 * Created by howard on 4/8/17.
 */
describe('Seabattle App', function () {
    //beforeEach(function () {
    //    browser.get('http://localhost:9999/');
    //});

    it('should start game and count player ships', function () {
        browser.get('http://localhost:9999/');
        var startBtn = element(by.id('startBtn'));
        startBtn.click();
        expect(element.all(by.cssContainingText('table td', 'U')).count()).toBe(26);
    });

    it('should click on cell', function () {
        element.all(by.css('table td:not(.act):not(.ai_act):not(.fired):not(.ai_fired)')).first().click();
        var until = protractor.ExpectedConditions;
        browser.wait(until.presenceOf(element(by.css('table td.ai_act'))), 2000, 'Element taking too long to appear in the DOM');
    });
});