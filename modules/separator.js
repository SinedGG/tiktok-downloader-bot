const shotrs = require(`./link/shorts`);
const tiktok = require(`./link/tik-tok`);
const insta = require(`./link/insta`);

const wait = require("node:timers/promises").setTimeout;

module.exports = async (ctx) => {
  try {
    const text = ctx.message.text;

    var url;

    if (text.includes(`youtube.com/shorts`)) await shotrs(ctx);

    if (text.includes(`tiktok.com`)) url = await tiktok(text);
    if (text.includes(`instagram.com/reel`)) url = await insta(text);

    if (!url) return;

    await wait(500);

    if (
      ctx.chat.id == process.env.MAIN_CHANNEL ||
      ctx.chat.id == process.env.MEDIA_CHANNEL
    ) {
      var username = ctx.from.username;
      if (!username) username = ctx.from.first_name;
      else username = `@${username}`;
      await bot.telegram.sendVideo(process.env.MEDIA_CHANNEL, url, {
        caption: `Надіслано - ${username} \n${text}`,
        disable_notification: true,
      });
    } else
      await bot.telegram.sendVideo(ctx.chat.id, url, {
        reply_to_message_id: ctx.message.message_id,
        disable_notification: true,
      });
  } catch (error) {
    console.log(error);
  }
};
