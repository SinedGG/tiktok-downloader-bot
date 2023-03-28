const shotrs = require(`./link/shorts`);
const tiktok = require(`./link/tik-tok`);
const insta = require(`./link/insta`);

const wait = require("node:timers/promises").setTimeout;

module.exports = async (ctx) => {
  try {
    const text = ctx.message.text;

    var url;

    if (text.includes(`youtube.com/shorts`)) return await shotrs(ctx);

    if (text.includes(`tiktok.com`)) url = await tiktok(text);
    if (text.includes(`instagram.com/reel`)) url = await insta(text);

    await wait(500);

    await bot.telegram.sendVideo(ctx.chat.id, url, {
      reply_to_message_id: ctx.message.message_id,
      disable_notification: true,
    });
  } catch (error) {
    console.log(error);
  }
};
