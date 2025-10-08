export const msgTemplate = (emailName, emailUser, recipient, subject, text, html) => {
  return `From: ${emailName} <${emailUser}>
To: ${recipient}
Subject: ${subject}
MIME-Version: 1.0
Content-Type: multipart/alternative; boundary="boundary123"

--boundary123
Content-Type: text/plain; charset=utf-8

${text}

--boundary123
Content-Type: text/html; charset=utf-8

${html}

--boundary123--`;
}

export const verifyUserMsgTemplate = {
  subject: (name) => `Verify your account, ${name}`,
  html: (name, verifyUrl) => 
`<h2>Hello, ${name}!</h2>
<p>You’ve registered at User Manager.</p>
<p>To verify your account, click the link below:</p>
<p><a href="${verifyUrl}">${verifyUrl}</a></p>
<p>If you didn’t register — please ignore this message.</p>`,
  text: (name, verifyUrl) => `Hello, ${name}! Please verify your email: ${verifyUrl}`,
}

export const resetPasswordMsgTemplate = {
  subject: () => 'Reset Your Password',
  html: (name, resetPasswordUrl) => 
`<p>Hello ${name},</p>
<p>You requested to reset your password.</p>
<p>Click the link below to set a new password:</p>
<p><a href="${resetPasswordUrl}">${resetPasswordUrl}</a></p>
<p>If you didn’t request this, ignore this email.</p>
<p>Thanks,<br>Your App Team</p>`,
  text: (name, resetPasswordUrl) => 
`Hello ${name},
You requested to reset your password.
Click the link below to set a new password:
${resetPasswordUrl}
If you didn’t request this, ignore this email.
Thanks, Your App Team`,
}