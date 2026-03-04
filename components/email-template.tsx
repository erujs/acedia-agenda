export function emailTemplate() {
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">      
      <h2 style="margin-bottom:12px;">Hey Master 👋</h2>
      <p style="margin:0;line-height:1.5;">
        Your tasks are ready when you are.
      </p>
      <p style="margin:0 0 24px 0;line-height:1.5;color:#444;">
        Start small — progress is just consistent iterations.
      </p>
      <div style="display:inline-block;padding:2px;background:linear-gradient(135deg, #3B82F6, #2DD4BF);border-radius:8px;">
        <a href="https://acedia-agenda.vercel.app"
           style="display:block;padding:12px 18px;background:#000;color:#fff;text-decoration:none;font-weight:500;border-radius:6px;">
           Open Your Agenda →
        </a>
      </div>
    </div>
  `
}