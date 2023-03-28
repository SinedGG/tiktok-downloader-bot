const ytdl = require("ytdl-core");

module.exports = (ctx) => {
  const url = ctx.message.text;

  const stream = ytdl(url, {
    filter: (format) => format.hasAudio === true && format.height === 720,
  });

  bot.telegram
    .sendVideo(
      ctx.chat.id,
      { source: stream },
      {
        disable_notification: true,
        reply_to_message_id: ctx.message.message_id,
      }
    )
    .catch((err) => console.log(err));

  stream.on("error", (err) => {
    console.log(err);
  });
};
