const puppeteer = require('puppeteer');
const sleep = require('await-sleep');

const URL = 'http://localhost:8091/un-diver/';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await sleep(10000);
    await page.goto(URL);
    await page.evaluate(() => {
        let $body = document.body;
        $body.style.background = 'transparent';
    });
    const $elts = await page.$$('.js-screenshot');
    let i = 0;
    for (const $elt of $elts) {
        await $elt.screenshot({path: `public/images/screenshots/example-${i}.png`, omitBackground: true});
        i++;
    }
    await browser.close();
})()