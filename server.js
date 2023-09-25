require('dotenv').config();
const tmi = require('tmi.js');
const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);
const modregCommand = new RegExp(/^%([a-zA-Z0-9]+)(?:\W+)?(.*)/);
const json = require('./jokes.json');

const client = new tmi.Client({
	channels: [ 'lavenderfx'],
    identity: {
		username: process.env.USERNAME,
		password: process.env.TOKEN
	},
});

var gartic = "There is no game at the moment.";
var discord = "No link at the moment.";
var whiffs = 10;
var loveArray = ['',''];

const commands = {
    bf: {
        res: () => 'Archer'
    },
    clip: {
        res: () => 'https://www.twitch.tv/lavenderfx/clip/SingleDoubtfulTrout4Head'
    },
    gartic: {
        res: () => `${gartic}`
    },
    discord: {
        res: () => `${discord}`
    },
    joke: {
        res: function() {
            return findJoke();
        }
    },
    dance: {
        res: () => 'peepoPls'
    },
    whiff: {
        res: function() {
            return incrementWhiffs();
        }
    }
}

const repeats = ["^", ":)", 'Clap', 'D:', 'hi']

function findJoke() {
    return json[Math.floor(Math.random() * json.length)];
}

function incrementWhiffs() {
    whiffs++;
    return ("Lav has whiffed " + String(whiffs) + " times.");
}

function loveAmount() {
    loveArray[0] = String(Math.floor((Math.random() * 100)));
    if (loveArray[0] <= 25) {
        loveArray[1] = '😭';
    } else if (loveArray[0] <= 50) {
        loveArray[1] = '😔';
    } else if (loveArray[0] <= 75) {
        loveArray[1] = '😉';
    } else {
        loveArray[1] = '😊';
    }
}

client.connect();

client.on('message', (channel, tags, message, self) => {
    if (self) return;
    const badges = tags.badges || {};
    const isBroadcaster = badges.broadcaster;
    const isMod = badges.moderator;
    const isModUp = isBroadcaster || isMod;

    if (message.charAt(0) == '!') {
        const [raw, command, argument] = message.match(regexpCommand);
        const {res} = commands[command] || {};
        if (command == 'love') {
            loveAmount();
            client.say(channel, tags.username + " loves Lav for " + loveArray[0] + "%! " + loveArray[1]);
            } else {
                if (typeof res === 'function') {
                client.say(channel, res(channel));
            } else if (typeof res === 'string') {
                client.say(channel, res);
            }
        }
    }

    if (repeats.includes(message)) {
        client.say(channel, message);
    }

	if (message.toLowerCase().includes('what')) {
        client.say(channel, "WHAT");
    }

    if (message.toLowerCase().includes('cringe')) {
        client.say(channel, '😳');
    }

    if (isModUp && message.charAt(0) == "%") {
        const [raw, command, argument] = message.match(modregCommand);
        const {res} = commands[command] || {};
        if (command == 'gartic') {
            gartic = argument;
        }
        if (command == 'discord') {
            discord = argument;
        }
    }
});