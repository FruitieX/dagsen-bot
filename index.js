var fs = require('fs');
var token = require(process.env.HOME + '/.dagsen-bot-token.js');

var request = require('request');
var Telegram = require('telegram-bot');
var tg = new Telegram(token);

tg.on('message', function(msg) {
  if (!msg.text) return;

  if (!msg.text.indexOf('/mat')) {
    console.log('retreiving menu...');

    request('http://api.teknolog.fi/taffa/sv/today', function(err, res, body) {
      tg.sendMessage({
        text: body,
        chat_id: msg.chat.id
      });
    });
  } else if (!msg.text.indexOf('/ute')) {
    console.log('retreiving weather...');
    request('http://outside.aalto.fi/data.txt', function(err, res, body) {
      try {
        outside = JSON.parse(body);

        message = 'Temperatur: ' + Number(outside['gent-outside-t']).toFixed(1).replace('.', ',') + ' \xB0C\n';
        message += 'Luftfuktighet: ' + Number(outside['gent-outside-h']).toFixed(0).replace('.', ',') + ' RH%\n';
        message += 'Lufttryck: ' + Number(outside['gent-outside-b']).toFixed(0).replace('.', ',') + ' hPa\n';
        message += 'Illuminans: '  + Number(outside['gent-outside-l']).toFixed(0).replace('.', ',') + ' lx\n';
      } catch(err) {
        message = "Vädersensorn är tyvärr offline för tillfället."
      }

      tg.sendMessage({
        text: message,
        chat_id: msg.chat.id
      });
    });
  } else if(!msg.text.indexOf('/inne')) {
    console.log('retrieving inside weather...');
    request('http://inne.jiihon.com/inne', function(err, res, body) {
      try {
        inside = JSON.parse(body);

        message = 'Temperatur: ' + Number(inside['temperature']).toFixed(1).replace('.',',') + ' \xB0C\n';
        message += 'Luftfuktighet: '  + Number(inside['humidity']).toFixed(0).replace('.', ',') + ' RH%\n';
        message += 'Ljust: '
        if(inside['lights-on']==0) {
          message += 'nej'; }
        else {
          message += 'ja' }
      } catch(err) {
        message = "Klimatsensorn är tyvärr offline för tillfället."
      }

      tg.sendMessage({
        text: message,
        chat_id: msg.chat.id
      });
    })
  } else if (!msg.text.indexOf('/fredag')) {
    tg.sendMessage({
      text: new Date().getDay() === 5 ? 'IT\'S FRIDAY!' : 'Nope.',
      chat_id: msg.chat.id
    });
  } else if (!msg.text.indexOf('/onsdag') || !msg.text.indexOf('/tulttan')) {
    tg.sendMessage({
      text: new Date().getDay() === 3 ? 'Ja, det är onsdag.' : 'Nope.',
      chat_id: msg.chat.id
    });
  } else if (!msg.text.indexOf('/music')) {
    try {
      fs.readFile(process.env.HOME + '/.dagsen-bot-music.json', function(err, songs) {
        if (err) {
          console.log(err);
          return;
        }

        songs = JSON.parse(songs);
        var r = Math.floor(Math.random() * songs.length); // choose a random item from the URL list

        tg.sendMessage({
          text: songs[r],
          chat_id: msg.chat.id
        });
      });
    } catch(e) {
      console.log('no music list found! add one to ~/.dagsen-bot-music.json');
    }
  } else if (!msg.text.indexOf('/addmusic')) {
    fs.readFile(process.env.HOME + '/.dagsen-bot-music.json', function(err, songs) {
      if (err) {
        console.log(err);
        return;
      }

      songs = JSON.parse(songs);

      var url = msg.text.split(' ');
      url.shift();
      url = url.join(' ');

      if (url.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/)) {
        songs.push(url);

        fs.writeFile(process.env.HOME + '/.dagsen-bot-music.json', JSON.stringify(songs), function(err) {
          if (err) {
            console.log(err);
            return;
          }

          tg.sendMessage({
            text: 'Song added!',
            chat_id: msg.chat.id
          });
        });
      }
    });
  } else if (!msg.text.indexOf('/trivia')) {
    tg.sendMessage({
      text: 'Spela trivia nu: https://telegram.me/joinchat/AXjh-gBgic0Dnbj_-uzMxg',
      chat_id: msg.chat.id
    });
  } else if (!msg.text.indexOf('/bompa')) {
    tg.sendAudio({
      audio: 'BQADBAADNgAD-uF4AZWtSWQU4TIFAg',
      chat_id: msg.chat.id
    });
  } else if (!msg.text.indexOf('/wappen')) {
    var today = new Date();
    var wappen = new Date(today.getMonth()>=4 ? today.getFullYear()+1 : today.getFullYear(),3,30); // Months start from 0, so April==3, May==4.
    var daysLeft = Math.round((wappen-today)/(1000*60*60*24));
    tg.sendMessage({
      text: 'Det är ' + daysLeft + ' dagar kvar till wappen (om den ordnas)!',
      chat_id: msg.chat.id
    });
  } else if (!msg.text.indexOf('/ylonz')) {
    tg.sendMessage({
      text: 'Snart är det YLONZ!',
      chat_id: msg.chat.id
    });
  }
});

tg.start();
