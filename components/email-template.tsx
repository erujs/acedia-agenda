export function emailTemplate() {
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#111;">
      
      <h2 style="margin-bottom:8px;">Hey 👋</h2>
      
      <p style="margin:0 0 16px 0;line-height:1.5;">
        Your tasks are waiting for you today.
      </p>
      
      <p style="margin:0 0 20px 0;line-height:1.5;color:#444;">
        You don't need hours. Just <strong>10 focused minutes</strong> can create momentum.
      </p>

      <a href="https://acedia-agenda.vercel.app"
         style="display:inline-block;padding:12px 18px;background:#000;color:#fff;text-decoration:none;border-radius:8px;font-weight:500;">
         Open Your Agenda →
      </a>

      <p style="margin:28px 0 0 0;font-size:14px;color:#666;">
        Small steps. Every day.
      </p>

    </div>
  `
}