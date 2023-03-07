require("dotenv").config();
const { Telegraf } = require("telegraf");
const download = require("./download");
global.bot = new Telegraf(process.env.TG_TOKEN);

bot.on("text", (ctx) => {
  const text = ctx.message.text;
  if (!text.includes(`tiktok.com`)) return;
  console.log(`Start downloading ${ctx.message.text}...`);
  download(ctx);
});

bot.launch();
