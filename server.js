var restify = require('restify');
var builder = require('botbuilder');

var bot = new builder.BotConnectorBot({ appId: process.env.appId, appSecret: process.env.appSecret});
var bot = new builder.BotConnectorBot({ appId: 'YamaBotTest', appSecret: 'e5c5e51680cd4321b3a10eeb9096b64a' });
var dialog   = new builder.CommandDialog();

dialog.matches(['Hi', 'Hello', 'こんにちは'], function (session) {
  session.send('こんにちは');
});
bot.add('/', dialog);

// Intent="what_day"の場合の処理
dialog.on('what_day', function(session, args) {
    console.log('message:');
    console.log(session.message);

    var date = builder.EntityRecognizer.findEntity(args.entities, 'builtin.datetime.date');
    console.log('date:');
    console.log(date);

    if (date != undefined && date.resolution != undefined) {
        var d = new Date(date.resolution.date);
        var day = '日月火水木金土'[d.getDay()];
        session.send('その日は「' + day + '曜日」です。');
    } else {
        session.send('日付を取得できませんでした。');
    }
});

// Intent="None"の場合の処理
dialog.onDefault(function(session, args) {
    console.log('args:');
    console.log(args);

    console.log('message:');
    console.log(session.message);

    session.send("質問を理解できませんでした。もう一度、少し表現を変えて質問してみてください。")
});

var server = restify.createServer();
server.post('/api/messages', bot.listen());
server.listen(process.env.port || 8080, function () {
    console.log('%s listening to %s', server.name, server.url);
});
