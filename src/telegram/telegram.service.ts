import { Injectable } from '@nestjs/common'
import type { Agent } from 'http'
import { Telegraf, Types } from 'telegraf'
import createHttpsProxyAgent from 'https-proxy-agent'
import { Telegram } from './telegram.interface'
import { getTelegramConfig } from 'src/config/telegram.config'

/** Telegraf задаёт свой https.Agent — системный прокси/TUN для Node часто не подхватываются. */
function createTelegramProxyAgent() {
	const url =
		process.env.TELEGRAM_HTTP_PROXY ||
		process.env.HTTPS_PROXY ||
		process.env.HTTP_PROXY
	if (!url?.trim()) return undefined
	return createHttpsProxyAgent(url.trim())
}

@Injectable()
export class TelegramService {
	bot: Telegraf
	options: Telegram

	constructor() {
		this.options = getTelegramConfig()
		const agent = createTelegramProxyAgent()
		this.bot = new Telegraf(this.options.token, {
			...(agent ? { telegram: { agent: agent as unknown as Agent } } : {}),
		})
	}

	async sendMessage(
		msg: string,
		options?: Types.ExtraReplyMessage,
		chatId: string = this.options.chatId
	) {
		await this.bot.telegram.sendMessage(chatId, msg, {
			parse_mode: 'HTML',
			...options,
		})
	}

	async sendPhoto(
		photo: string,
		msg?: string,
		chatId: string = this.options.chatId
	) {
		await this.bot.telegram.sendPhoto(
			chatId,
			photo,
			msg ? { caption: msg } : {}
		)
	}
}
