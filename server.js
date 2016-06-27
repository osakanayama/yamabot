var restify = require('restify');
var builder = require('botbuilder');

var bot = new builder.BotConnectorBot({ appId: process.env.appId, appSecret: process.env.appSecret});
var bot = new builder.BotConnectorBot({ appId: 'YamaBotTest', appSecret: 'e5c5e51680cd4321b3a10eeb9096b64a' });
var dialog   = new builder.CommandDialog();

dialog.matches(['Hi', 'Hello', 'こんにちは'], function (session) {
  session.send('こんにちは');
});
bot.add('/', dialog);

var server = restify.createServer();
server.post('/api/messages', bot.listen());
server.listen(process.env.port || 8080, function () {
    console.log('%s listening to %s', server.name, server.url);
});
