var restify = require('restify');
var builder = require('botbuilder');

var bot = new builder.BotConnectorBot({ appId: process.env.appId, appSecret: process.env.appSecret});
var url = 'https://api.projectoxford.ai/luis/v1/application?id=' + process.env.luisId
    + '&subscription-key=' + process.env.luisSubscriptionKey
var dialog = new builder.LuisDialog(url);

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

// Intent="WhenSubmit"の場合の処理
dialog.on('WhenSubmit', function(session, args) {
    console.log('message:');
    console.log(session.message);

    var date = builder.EntityRecognizer.findEntity(args.entities, 'builtin.datetime.date');
    console.log('date:');
    console.log(date);
    
    var item = builder.EntityRecognizer.findEntity(args.entities, 'Item');
    var subject = builder.EntityRecognizer.findEntity(args.entities, 'Subject');

    session.send(item + 'を' + date.resolution.date + 'にするには' + subject + '?');
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