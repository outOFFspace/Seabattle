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
        expect(element.all(by.css('table td')).count()).toBe(400);
        expect(element.all(by.cssContainingText('table td', 'U')).count()).toBe(26);
    });

    it('should click to the finish', function () {
        var cells = element.all(by.css('table td:not(.act):not(.ai_act):not(.fired):not(.ai_fired)'));
        cells.count().then(function(count) {
            if (!count) {
                expect(element(by.id('endgame')).isDisplayed()).toBe(true);
            }
        });
    });

    it('should click on cell', function () {
        var cells = element.all(by.css('table td:not(.act):not(.ai_act):not(.fired):not(.ai_fired)'));
        cells.count().then(function(numberOfItems) {
            return Math.floor(Math.random() * numberOfItems) + 1;
        }).then(function(randomCell) {
            cells.get(randomCell).click();
            expect(cells.get(randomCell).getText()).toBe('');
            expect(element(by.id('loader')).isDisplayed()).toBeTruthy();
            var until = protractor.ExpectedConditions;
            browser.wait(until.presenceOf(element(by.css('table td.ai_act'))), 1600, 'Element taking too long to appear in the DOM');
            browser.pause();
        });
    });
});