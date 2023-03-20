import { VercelRequest, VercelResponse } from '@vercel/node'
import { bot } from '../bot'

type IP = {
    result: string
    addr: string
    domains: string
}

type DDNSRequest = {
    ipv4: IP
    ipv6: IP
}

function buildOneIPResult(type: string, data: IP) {
    const options = { timeZone: 'Asia/Shanghai' }
    const currentTime = new Date().toLocaleString('en-US', options)
    return `Current Time: ${currentTime}\n${type}: ${data.result}\nIP: ${data.addr}\nDomains: ${data.domains}\n`
}

export default async (req: VercelRequest, res: VercelResponse) => {
    const chatId = req.query['chatId'] as string
    let ddnsReq = req.body as DDNSRequest
    
    let text = "The current IPv6 address has changed:\n"
    if (ddnsReq.ipv4) {
        text += buildOneIPResult('IPv4', ddnsReq.ipv4)
    }

    if (ddnsReq.ipv6) {
        text += buildOneIPResult('IPv6', ddnsReq.ipv6)
    }

    await bot.api.sendMessage(chatId, text)

    res.json({
        msg: 'works'
    })
}