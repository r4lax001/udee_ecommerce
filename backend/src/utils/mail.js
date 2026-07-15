import nodemailer from 'nodemailer';

/**
 * Sends OTP verification code to user email.
 * Falls back to console printing if SMTP is not configured.
 * @param {string} email - Destination email address
 * @param {string} otpCode - 6-digit OTP code
 * @returns {Promise<boolean>}
 */
export async function sendOTPEmail(email, otpCode) {
  // Beautiful dev printout
  console.log('\n==================================================');
  console.log(`✉️  [EMAIL DEV FALLBACK]`);
  console.log(`👉  To:      ${email}`);
  console.log(`👉  OTP:     ${otpCode}`);
  console.log(`👉  Expires: in 10 minutes`);
  console.log('==================================================\n');

  const isSmtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

  if (!isSmtpConfigured) {
    // If SMTP is not configured, console logging is sufficient for development mode
    return true;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"UDEE Furniture" <${process.env.SMTP_FROM || 'noreply@udee-furniture.com'}>`,
    to: email,
    subject: `รหัสยืนยันตัวตน (OTP) สำหรับบัญชี UDEE ของคุณคือ ${otpCode}`,
    html: `
      <div style="font-family: 'Prompt', 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #E8E1DF; border-radius: 16px; background-color: #FAF6F1; color: #1D1B1A;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; background-color: #3D2B1F; color: white; font-weight: bold; font-size: 28px; padding: 15px 25px; border-radius: 12px; margin-bottom: 10px; font-style: italic;">
            Udee
          </div>
          <p style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #A0724A; margin: 0;">Quiet Luxury for Home</p>
        </div>
        
        <h2 style="font-size: 22px; font-weight: 600; text-align: center; color: #3D2B1F; margin-bottom: 24px;">
          ยืนยันที่อยู่อีเมลของคุณ
        </h2>
        
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          สวัสดีครับ,<br/><br/>
          ขอบคุณที่สมัครสมาชิกกับ UDEE Furniture เพื่อเริ่มต้นใช้งานบัญชีของคุณ กรุณากรอกรหัสผ่านสำหรับใช้ครั้งเดียว (OTP) ด้านล่างนี้ที่หน้ายืนยันตัวตน:
        </p>
        
        <div style="text-align: center; margin: 35px 0;">
          <div style="display: inline-block; background-color: white; border: 2px solid #A0724A; font-size: 36px; font-weight: 700; letter-spacing: 8px; padding: 15px 40px; border-radius: 12px; color: #3D2B1F; box-shadow: 0 4px 10px rgba(61,43,31,0.05);">
            ${otpCode}
          </div>
          <p style="font-size: 12px; color: #81756E; margin-top: 12px;">รหัสนี้จะมีอายุใช้งาน 10 นาที</p>
        </div>
        
        <p style="font-size: 14px; line-height: 1.6; color: #81756E; margin-bottom: 24px;">
          * หากคุณไม่ได้สมัครสมาชิกในระบบของ UDEE Furniture หรือไม่ได้เป็นผู้ส่งคำขอนี้ กรุณาละเลยอีเมลฉบับนี้
        </p>
        
        <hr style="border: 0; border-top: 1px solid #E8E1DF; margin: 30px 0;" />
        
        <div style="text-align: center; font-size: 12px; color: #81756E;">
          © 2026 UDEE Furniture. Crafted for the quiet luxury of home.
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ [EMAIL SENT SUCCESS] Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ [EMAIL SEND ERROR]:', error);
    return false;
  }
}
