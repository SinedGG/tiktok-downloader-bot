const axios = require("axios");
const fs = require("fs");
const puppeteer = require("puppeteer-extra");
const stealthPlugin = require("puppeteer-extra-plugin-stealth")();

module.exports = async (ctx) => {
  const url = ctx.message.text;

  ["chrome.runtime", "navigator.languages"].forEach((a) =>
    stealthPlugin.enabledEvasions.delete(a)
  );

  puppeteer.use(stealthPlugin);

  const browser = await puppeteer.launch({ headless: true });
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

  await page.goto("https://snaptik.app/");
  await page.waitForSelector('input[name="url"]');
  await page.type('input[name="url"]', url, {
    delay: 100,
  });

  await page.click(".btn-go");

  await page.waitForXPath('//*[@id="download"]/div/div/div[2]/div/a[2]');
  const featureArticle = (
    await page.$x('//*[@id="download"]/div/div/div[2]/div/a[2]')
  )[0];

  const text = await page.evaluate((el) => {
    return el.href;
  }, featureArticle);
  var noWaterMark = text;
  const content = decodeURIComponent(noWaterMark);
  download(ctx, content);
  browser.close();
};

async function download(ctx, url) {
  const writer = fs.createWriteStream(`video.mp4`);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);
  writer.on("finish", () => {
    console.log(`Finished downloading ${ctx.message.text}...`);

    setTimeout(() => {
      bot.telegram
        .sendVideo(
          ctx.chat.id,
          { source: "video.mp4" },
          {
            reply_to_message_id: ctx.message.message_id,
            disable_notification: true,
          }
        )
        .catch((err) => console.log(err));
    }, 1000);
  });
}
