import { NextResponse } from "next/server"
import { Resend } from "resend"
import { emailTemplate } from "@/components/email-template"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  try {
    await resend.emails.send({
      from: "Acedia Agenda <hello@jerus.dev>",
      to: "a.m.jerus@gmail.com",
      subject: "Your Agenda is waiting 👀",
      html: emailTemplate(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Nudge email failed:", error)
    return NextResponse.json({ success: false })
  }
}