import { VercelRequest, VercelResponse } from '@vercel/node'
import { Bot, InlineKeyboard, webhookCallback } from 'grammy'
import dns from 'dns';

function queryDomain4(domain: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    dns.resolve(domain, (err, addresses) => {
      if (err) {
        reject(err);
      } else {
        resolve(addresses);
      }
    });
  });
}

function queryDomain6(domain: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    dns.resolve6(domain, (err, addresses) => {
      if (err) {
        reject(err);
      } else {
        resolve(addresses);
      }
    });
  });
}

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
    try {
    const addresses4 = await queryDomain4(domain);
    const addresses6 = await queryDomain6(domain);
    await ctx.reply(`Domain: ${domain}\nIPv4: ${addresses4}\nIPv6: ${addresses6}\n`)
  } catch (err) {
    await ctx.reply(`Failed to resolve ${domain}, Err: ${err}`)
  }
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
