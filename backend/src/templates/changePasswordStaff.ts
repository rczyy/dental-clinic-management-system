import { HOST_URL } from "../constants";

export const changePasswordStaff = (name: string, token: string) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
      <style>
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
  
        * {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
            sans-serif;
          margin: 0;
        }
  
        html,
        body {
          height: 100%;
        }
  
        body {
          line-height: 1;
          -webkit-font-smoothing: antialiased;
        }
  
        img,
        picture,
        video,
        canvas,
        svg {
          display: block;
          max-width: 100%;
        }
  
        input,
        button,
        textarea,
        select {
          font: inherit;
        }
  
        p,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          overflow-wrap: break-word;
        }
  
        .template {
          background: #f1f5f9;
          padding: 4rem 1rem;
        }
  
        .template-main {
          max-width: 42rem;
          margin: auto;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
        }
  
        .template-body {
          background: white;
          padding: 2.5rem 3.5rem;
          border-radius: 0.5rem 0.5rem 0 0;
        }
  
        .template-body h1 {
          font-size: 1.875rem;
          font-weight: 700;
          line-height: 2.25rem;
          letter-spacing: -0.025em;
          margin: 0 0 2.5rem 0;
          text-align: center;
        }
  
        .template-body h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 1.625rem 0;
        }
  
        .template-body p {
          font-size: 1rem;
          color: #52525b;
          margin: 0 0 1.25rem 0;
        }
  
        .template-body div {
          display: flex;
        }
  
        .template-body a {
          background: rgb(45, 156, 219);
          color: white;
          margin: 1.5rem auto 0 auto;
          padding: 0.75rem 2rem;
          border: none;
          border-radius: 0.5rem;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 600;
          transition-property: background-color;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }
  
        .template-body a:hover {
          background: rgb(45, 156, 219, 0.9);
        }
  
        .template-footer {
          background: #f8fafc;
          padding: 2.5rem 3.5rem;
          border-radius: 0 0 0.5rem 0.5rem;
          text-align: center;
          font-size: 0.825rem;
        }
  
        .template-footer p {
          color: #a1a1aa;
        }
  
        .template-footer .do-not-reply-p {
          margin: 0 0 1.25rem 0;
        }
      </style>
    </head>
    <body>
      <div class="template">
        <div class="template-main">
          <div class="template-body">
            <h1>AT Dental Home</h1>
            <h3>We're so excited!</h3>
            <p>Hi ${name},</p>
            <p>
              We are all excited to welcome you to our team!
            </p>
            <p>
              To continue, please change the password of your account in our website by clicking the button
              below.
            </p>
            <div>
              <a href="${HOST_URL}/reset-password?token=${token}">Change Password</a>
            </div>
          </div>
          <div class="template-footer">
            <p class="do-not-reply-p">
              This is a system-generated email. Please do not reply.
            </p>
            <p>© Copyright AT Dental Home. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </body>
  </html>  
  `;
};
