var fs = require('fs');
var token = require(process.env.HOME + '/.dagsen-bot-token.js');

var request = require('request');
var Telegram = require('telegram-bot');
var tg = new Telegram(token);

tg.on('message', function(msg) {
  if (!msg.text) return;

  if (msg.text === '/mat' || msg.text === '/dagsen') {
    request('http://api.teknolog.fi/taffa/sv/today', function(err, res, body) {
      console.log(body);
      tg.sendMessage({
        text: body,
        chat_id: msg.chat.id
      });
    });
  }
});

tg.start();
