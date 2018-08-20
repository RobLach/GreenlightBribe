var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var redis = require('redis');
var app = express();
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var passport = require('passport');
var SteamStrategy = require('passport-steam').Strategy;
var moment = require('moment');

var redisClient = redis.createClient("/home/roblach/.unixsockets/redis.sock");


  redisClient.on("error", function (err) {
        console.log(moment().format("M D YY - HH:mm:SS.SSS ") + "Redis Error " + err);
    });

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new SteamStrategy({
    returnURL: 'http://greenlightbribery.popme1.com/steamReturn',
    realm: 'http://greenlightbribery.popme1.com/',
    apiKey: 'DD0C281LOLDONTFALLFORIT89BD4ACBDC',
    passReqToCallback: true
  },
  function(req, identifier, profile, done) {
  	process.nextTick(function(){
  		profile.identifier = identifier;
		return done(null, profile);
  	});
  }
));

//app.use(favicon());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'notactuallyasecret'}));
app.use(passport.initialize());
app.use(passport.session());

app.enable('trust proxy');




// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


app.get('/', 
	function(req, res){
	res.sendfile(__dirname + '/public/index.html');
});


app.get('/steamlogin',
  	passport.authenticate('steam', { failureRedirect: '/fuck' }),
  	function(req, res) {
  		req.session.justloggedin = false;
    	res.redirect('/'); 
});

app.get('/steamReturn', function(req,res, next) {
	passport.authenticate('steam', function(err, user){
		req.session.steamid = user.identifier;
		req.session.justloggedin = true;
		res.location('/');
		res.json(302, {steamID: req.session.steamid});
	})(req, res, next);
});

app.post('/readyToVote',
 	function(req,res,next){
	var looper = setInterval(function(){
		if(typeof req != 'undefined' && typeof req.session != 'undefined')
		if(typeof req.session.justloggedin != 'undefined' && req.session.justloggedin == true){
			if(req.session.steamid.indexOf("http") > -1){ 
				req.session.justloggedin = false;
				clearInterval(looper);
				return res.send({steamID: req.session.steamid});
			}
		}
	}, 250);
	
});

app.get('/percentKeys', function(req,res,next){
	redisClient.scard("freekeys", function(err, freekeys){
		if(err){return res.send({keysLeft: "1"})}
		else{
			redisClient.hlen("usedkeys", function(err, usedkeys){
				if(err){ return res.ssend({keysLeft: "1"})}
				else{
					var actualPercentLeft =Number(freekeys) / Number(freekeys + Number(usedkeys)) * 100;
					var interpPercentLeft = Math.floor( (actualPercentLeft * actualPercentLeft)/100.0);
					if(interpPercentLeft < 0){ interpPercentLeft = 0; }
					return res.send({keysLeft: Number(interpPercentLeft)});
				}
			});
		}
	});
	
});

app.post('/upvoted', 
	function(req, res, next){
		var replyGiftKey = null;
		//prechecks
		if(req.session.steamid.indexOf("http")> -1)
		{
			var alreadyExists;
			redisClient.hexists("usedkeys", req.session.steamid, function(err,reply){
				alreadyExists = Boolean(reply);
				console.log(moment().format("M D YY - HH:mm:SS.SSS ")  + "Already Exists?: " + alreadyExists);
				if(alreadyExists)
				{
					redisClient.hget("usedkeys", req.session.steamid, function(err,reply){
						replyGiftKey = String(reply);
						console.log(moment().format("M D YY - HH:mm:SS.SSS ")  + "Got key for steamid: "+req.session.steamid+". Key: "+replyGiftKey);
						return res.send({giftkey: replyGiftKey});
					});
				}
				else{
					redisClient.spop("freekeys", function(err, reply){
						replyGiftKey = String(reply);
						console.log(moment().format("M D YY - HH:mm:SS.SSS ")  + "Popped from freekeys: "+replyGiftKey);
						//adding to usedkeys
						redisClient.hset("usedkeys", req.session.steamid, replyGiftKey, function(err){
							console.log(moment().format("M D YY - HH:mm:SS.SSS ")  + "Added to usedkeys: "+ req.session.steamid +" "+ replyGiftKey);
							return res.send({giftkey: replyGiftKey});
						});
					});
				}
			});
		}

		
});

var server = app.listen(80, function(){
	console.log(moment().format("M-D-YY|HH:mm:SS.SSS ")  + "Listening");
});
