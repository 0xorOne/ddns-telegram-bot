import { VercelRequest, VercelResponse } from '@vercel/node'
import { Bot, InlineKeyboard, webhookCallback } from 'grammy'
import dns from 'dns';

dns.lookup('example.com', (err, address) => {
  console.log(address);
});


const { BOT_TOKEN, BOT_URL } = process.env

export const bot = new Bot(BOT_TOKEN)

bot.command('start', async (ctx) => {
    await ctx.reply('Welcome to use DDNS Bot.')
})

bot.command('ddns', async (ctx) => {
    const domain = ctx.message.text.split(' ')[1];
    if (!domain) {
    await ctx.reply('Please provide a domain name')
    return
  }
  dns.lookup(domain, async (err, address) => {
    if (err) {
      console.error(err);
      await ctx.reply(`Failed to resolve ${domain}`)
      return
    }
    await ctx.reply(`The IP address of ${domain} is ${address}`)
  })
})

bot.command('gethook', async (ctx) => {
    const chanId = ctx.message.chat.id
    const hookUrl = `${BOT_URL}/api/hook/${chanId}`
    const links = new InlineKeyboard()
        .url('Usage', 'https://github.com/wukibaka/ddns-telegram-bot/blob/main/README.md')
    await ctx.reply(`Your webhook URL is:\n ${hookUrl}`, {
        reply_markup: links
    })
})

export default async (req: VercelRequest, res: VercelResponse) => {
    webhookCallback(bot, 'http')(req, res)
}
