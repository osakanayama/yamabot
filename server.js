var builder = require('botbuilder');
var restify = require('restify');

//var bot = new builder.TextBot();
var bot = new builder.BotConnectorBot();
var bot = new builder.BotConnectorBot({
  appId: 'YamaBotTest', appSecret: 'e5c5e51680cd4321b3a10eeb9096b64a' });
  
var command = new builder.CommandDialog();

bot.add('/', function (session) {
    if (!session.userData.name) {
      session.beginDialog('/getname');
    } else {
      session.beginDialog('/top_choice');
    }
});

bot.add('/getname', [
  function(session) {
    builder.Prompts.text(session, "こんにちは！お名前をお伺いしてもよろしいでしょうか？");
  },
  function(session, results) {
    session.userData.name = results.response;
    session.send(session.userData.name + "様、ご来店ありがとうございます！");
    session.endDialog();
    session.beginDialog('/top_choice');
  }
]);

bot.add('/top_choice', [
  function(session) {
    builder.Prompts.choice(session,
      "何かお探しでしょうか？", "アイテム|納品までの流れ|こだわりポイント|その他"
    );
  },
  function(session, results) {
    session.endDialog();
    if (results.response.entity == "アイテム") {
    	session.beginDialog('/item_choice');
    	
    } else if (results.response.entity == "納品までの流れ") {
    	//session.beginDialog('/item_choice');
    	
    } else if (results.response.entity == "こだわりポイント") {
    	//session.beginDialog('/item_choice');
    	
    } else if (results.response.entity == "その他") {
    	//質疑応答
    	
    }
  }
]);

bot.add('/item_choice', [
  function(session) {
    builder.Prompts.choice(session,
      "何かお探しでしょうか？", "招待状|席次表|ウェルカムボード|結婚報告はがき|演出ムービー|アルバム"
    );
  },
  function(session, results) {
    session.send("you like " + results.response.entity);
    session.endDialog();
  }
]);

//bot.listenStdin();

var server = restify.createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.listen(process.env.port || 3978, function () {
  console.log('%s listening to %s', server.name, server.url); 
});
