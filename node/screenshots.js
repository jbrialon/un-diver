const puppeteer = require('puppeteer');
const sleep = require('await-sleep');
const fs = require('fs-extra');
const path = require('path');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 8'];

const URL = 'http://localhost:8091/un-diver/';
const LANGS = ['cn', 'en', 'fr', 'jp', 'ru', 'us'];
const DIR = 'public/images/screenshots/';
const DEVICES = [
    {
        id: 'desktop',
        options: { viewport: { width: 1920, height: 1080 }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.92 Safari/537.36' }
    },
    {
        id: 'mobile',
        options: iPhone
    }
];

(async () => {
    console.log('\x1b[45m%s\x1b[0m', 'Screenshot task in progress');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // Ensures that a directory is empty. Deletes directory contents if the directory is not empty. If the directory does not exist, it is created. The directory itself is not deleted.
    fs.emptyDirSync(path.resolve(DIR));
    // Wait 10s to wait the dev server to be launch (TODO enhance)
    await sleep(10000);
    for (const device of DEVICES) {
        await page.emulate(device.options);
        for (const lang of LANGS) {
            const fileFolder = path.resolve(DIR, lang, device.id);
            fs.emptyDirSync(fileFolder);
            await page.goto(URL + lang);
            // Remove black background to allow PNG transparency
            await page.evaluate(() => {
                let $body = document.body;
                $body.style.background = 'transparent';
            });
            // Get all data-screenshot elements to save them as PNG
            const $elts = await page.$$('[data-screenshot]');
            let i = 0;
            for (const $elt of $elts) {
                const name = await page.evaluate(node => node.getAttribute('data-screenshot'), $elt);
                console.info('\x1b[34m%s\x1b[0m', `Saving: ${fileFolder}/${name}.png`);
                await $elt.screenshot({path: `${fileFolder}/${name}.png`, omitBackground: true});
                i++;
            }
        }
    }
    await browser.close();
    console.info('\x1b[45m%s\x1b[0m', 'Screenshots task success, you can exit it');
})()