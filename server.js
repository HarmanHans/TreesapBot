require('dotenv').config();
const tmi = require('tmi.js');
const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

const client = new tmi.Client({
	channels: [ 'lavenderfx' ],
    identity: {
		username: process.env.USERNAME,
		password: process.env.TOKEN
	},
});

const commands = {
    
    bf : {
        res: () => 'Archer'
    }
}

client.connect();

client.on('message', (channel, tags, message, self) => {
    if (self) return;

    const [raw, command, argument] = message.match(regexpCommand);
    const {res} = commands[command] || {};
    if (typeof res === 'function') {
        client.say(channel, res());
    } else if (typeof res === 'string') {
        client.say(channel, res);
    }
    
	if (message.toLowerCase().includes('what')) {
        client.say(channel, "WHAT");
    }
});