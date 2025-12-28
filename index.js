const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { DisTube } = require('distube');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ]
});

// Initialize DisTube
const distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnEmpty: true,
  leaveOnFinish: false,
});

const prefix = "!"; // You can change this

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Play Command
  if (command === "play") {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply("Join a voice channel first!");
    distube.play(voiceChannel, args.join(" "), { message, textChannel: message.channel });
  }

  // Stop Command
  if (command === "stop") {
    distube.stop(message);
    message.reply("Stopped the music.");
  }

  // Skip Command
  if (command === "skip") {
    distube.skip(message);
    message.reply("Skipped!");
  }

  // Volume Command
  if (command === "volume") {
    const vol = parseInt(args[0]);
    if (isNaN(vol)) return message.reply("Enter a number between 1-100");
    distube.setVolume(message, vol);
    message.reply(`Volume set to ${vol}%`);
  }

  // Loop Command
  if (command === "loop") {
    const mode = distube.setRepeatMode(message);
    message.reply(`Set repeat mode to: **${mode === 0 ? 'Off' : mode === 1 ? 'Track' : 'Queue'}**`);
  }

  // Leave Command
  if (command === "leave") {
    distube.voices.get(message)?.leave();
    message.reply("Bye bye!");
  }
});

client.login(process.env.TOKEN); // We will set this in Render
