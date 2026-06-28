/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { detectChatId, sendTelegramNotification } from '@/lib/telegram'

// Connect: merchant pastes their bot token (after messaging the bot once). We
// auto-detect the chat id, save both, and fire a test message. Pass botToken=null
// to disconnect.
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const { botToken } = await request.json()
    const db = supabase as any

    // Disconnect
    if (!botToken || !botToken.trim()) {
      await db.from('stripe_accounts').update({ telegram_bot_token: null, telegram_chat_id: null }).eq('user_id', user.id)
      return NextResponse.json({ success: true, disconnected: true })
    }

    const token = botToken.trim()

    // Find the chat id from the message the merchant just sent their bot
    let chatId: string | null
    try {
      chatId = await detectChatId(token)
    } catch {
      return NextResponse.json({ error: 'Invalid bot token — double-check you copied it from @BotFather.' }, { status: 400 })
    }
    if (!chatId) {
      return NextResponse.json({ error: 'No chat found. Open your bot in Telegram and send it any message (e.g. "hi"), then click Connect again.' }, { status: 400 })
    }

    const { data: account } = await db.from('stripe_accounts').select('business_name').eq('user_id', user.id).single()

    // Save + send a confirmation message
    await db.from('stripe_accounts').update({ telegram_bot_token: token, telegram_chat_id: chatId }).eq('user_id', user.id)
    await sendTelegramNotification(token, chatId, { type: 'test', businessName: account?.business_name })

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 })
  }
}
