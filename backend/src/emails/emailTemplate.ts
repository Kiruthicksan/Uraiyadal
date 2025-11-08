export function getWelcomeEmailTemplate(userName: string): string {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Welcome to Uraiyadal</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #0f172a;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .email-container {
          max-width: 600px;
          margin: 30px auto;
          background-color: #1e293b;
          border-radius: 12px;
          overflow: hidden;
          color: #f1f5f9;
        }
        .header {
          background: linear-gradient(90deg, #9333ea, #3b82f6);
          text-align: center;
          padding: 24px 16px;
        }
        .header h1 {
          margin: 0;
          color: white;
          font-size: 24px;
          letter-spacing: 1px;
        }
        .content {
          padding: 24px 32px;
        }
        .content h2 {
          color: #38bdf8;
          font-size: 22px;
        }
        .content p {
          line-height: 1.6;
          color: #cbd5e1;
        }
        .btn {
          display: inline-block;
          background-color: #38bdf8;
          color: #0f172a;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-weight: 600;
          margin-top: 16px;
        }
        .btn:hover {
          background-color: #0ea5e9;
        }
        .footer {
          text-align: center;
          padding: 16px;
          font-size: 13px;
          color: #94a3b8;
        }
        @media (max-width: 600px) {
          .content {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Welcome to Uraiyadal 💬</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName}!</h2>
          <p>
            We’re thrilled to have you join <strong>Uraiyadal</strong> — where conversations come alive!
            Connect, share, and explore ideas in real-time with people who love to talk as much as you do.
          </p>
          <p>
            Click below to dive into your first conversation:
          </p>
        
          <p style="margin-top: 20px;">
            Need help? Just reply to this email — we’re listening 👂
          </p>
        </div>
        <div class="footer">
          © 2025 Uraiyadal. All rights reserved.<br />
      
        </div>
      </div>
    </body>
  </html>
  `;
}
