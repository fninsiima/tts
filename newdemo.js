const puppeteer = require('puppeteer');
const fs = require('fs');

const config = require('./config.json');

const word = ['your words oh lord are spirit and truth'];

try {
  (async () => {
    const browser = await puppeteer.launch({
        headless: false,
        // devtools: true,
    });

    await processWords(browser, word);

    await browser.close()
  })()
} catch (err) {
  console.error(err)
}

async function processWords(page, words) {
    const wordsToProcess = Array.isArray(words) ? words : [words];

    for (const word of wordsToProcess) {
        await processWord(page, word);   
    }
}

async function processWord(page, word) {
    const buffer = await downloadTts(page, word);
    fs.writeFileSync(`./aloha.mp3`, buffer);
}

async function downloadTts(browser, word) {
    const page = await browser.newPage();

    return new Promise(async (resolve, reject) => {
        page.on('response', async (response) => {
            if (response.url().indexOf("translate_tts") !== -1) {
                const buffer = await response.buffer();
                page.close();
                resolve(buffer);                                                                                                                                                                                                                                          
            }
          });
    
        //const url = `https://translate.google.com/#${config.from}/${config.to}/${word}`;
        const url = `http://127.0.0.1/dvgs_demo_website/demo2.html?speech-msg=${word}`;

        await page.goto(url);
    
        await page.click('#speak');
    });
}