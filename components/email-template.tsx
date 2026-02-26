export function emailTemplate() {
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#111;">      
      <h2 style="margin-bottom:12px;">Hey Master👋</h2>
      <p style="margin:0;line-height:1.5;">
        Your tasks are ready when you are.
      </p>
      <p style="margin:0 0 24px 0;line-height:1.5;color:#444;">
        Start small — progress is just consistent iterations.
      </p>
      <div style="display:inline-block;padding:1.5px;border-radius:10px;background:linear-gradient(90deg,#25F4EE,#FE2C55);">
        <a href="https://acedia-agenda.vercel.app"
           style="display:inline-block;padding:12px 18px;background:#000;color:#fff;text-decoration:none;border-radius:9px;font-weight:500;">
           Open Your Agenda →
        </a>
      </div>
    </div>
  `
}