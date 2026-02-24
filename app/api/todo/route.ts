import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  try {
    await resend.emails.send({
      from: "Agenda <onboarding@resend.dev>",
      to: "a.m.jerus@gmail.com",
      subject: "Your Agenda is waiting 👀",
      html: `
        <h2>Hey 👋</h2>
        <p>Your tasks are waiting for you today.</p>
        <p>Even 10 focused minutes makes a difference.</p>
        <br/>
        <a href="https://acedia-agenda.vercel.app" 
           style="display:inline-block;padding:10px 16px;background:black;color:white;text-decoration:none;border-radius:6px;">
           Open Agenda
        </a>
        <br/><br/>
        <p>Small steps. Every day.</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Nudge email failed:", error)
    return NextResponse.json({ success: false })
  }
}