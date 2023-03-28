const puppeteer = require("puppeteer-extra");
const stealthPlugin = require("puppeteer-extra-plugin-stealth")();

module.exports = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      stealthPlugin.enabledEvasions.delete("chrome.runtime");
      stealthPlugin.enabledEvasions.delete("navigator.languages");
      puppeteer.use(stealthPlugin);

      const browser = await puppeteer.launch({
        executablePath: "/usr/bin/chromium-browser",
        headless: true,
      });
      const page = await browser.newPage();

      await page.evaluateOnNewDocument(() => {
        delete navigator.__proto__.webdriver;
      });
      await page.setRequestInterception(true);

      page.on("request", (request) => {
        if (["image", "stylesheet", "font"].includes(request.resourceType())) {
          request.abort();
        } else {
          request.continue();
        }
      });

      await page.goto("https://snapinsta.app/");
      await page.waitForSelector('input[name="url"]');
      await page.type('input[name="url"]', url, {
        delay: 100,
      });

      await page.click(".btn-get");
      await page.waitForXPath('//*[@id="download"]/div/div/div/div[2]/div/a');
      const featureArticle = (
        await page.$x('//*[@id="download"]/div/div/div/div[2]/div/a')
      )[0];

      const text = await page.evaluate((el) => {
        return el.href;
      }, featureArticle);
      var noWaterMark = text;
      browser.close();
      const content = decodeURIComponent(noWaterMark);
      resolve(content);
    } catch (error) {
      reject(error);
    }
  });
};
