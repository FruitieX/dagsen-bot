var fs = require('fs');
var token = fs.readFileSync(process.env.HOME + '/.dagsen-bot-token');
var request = require('request');
var Telegram = require('telegram-bot');
var tg = new Telegram();

tg.on('message', function(msg) {
  if (!msg.text) return;

  if (msg.text === '/mat' || msg.text === '/dagsen') {
    request('http://api.teknolog.fi/taffa/sv/today', function(err, res, body) {
      console.log(body);
      tg.sendMessage({
        text: body,
        reply_to_message_id: msg.message_id,
        chat_id: msg.chat.id
      });
    });
  }
});

tg.start();
