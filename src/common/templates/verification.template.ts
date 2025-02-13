export const verificationTemplate = function (name: string, otp: number) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .header h2 {
      color: #333;
      font-size: 24px;
    }
    .otp {
      font-size: 36px;
      font-weight: bold;
      color: #4CAF50;
      text-align: center;
      margin: 20px 0;
    }
    .message {
      font-size: 16px;
      color: #333;
      line-height: 1.6;
    }
    .footer {
      text-align: center;
      font-size: 14px;
      color: #888;
      margin-top: 30px;
    }
    .button {
      display: inline-block;
      background-color: #4CAF50;
      color: #fff;
      padding: 10px 20px;
      font-size: 16px;
      border-radius: 5px;
      text-decoration: none;
      text-align: center;
    }
    .name{
      text-transform: capitalize
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Verify Your Email</h2>
    </div>
    <p class="message">Hi, <span class="name">${name}</span></p>
    <p class="message">Please use the following OTP to verify your email address and complete your registration:</p>
    
    <div class="otp">
      ${otp}
    </div>
    
    <p class="message">The OTP will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
    
    <p class="message">Thank you,</p>
    <p class="message">anjish.co</p>
    
    <div class="footer">
      <p>&copy; 2025 anjish.co. All Rights Reserved.</p>
    </div>
  </div>
</body>
</html>
`;
};
