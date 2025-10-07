const nodemailer = require('nodemailer');
const config = require('../config/config');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.EMAIL_HOST,
      port: config.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  // Kiểm tra kết nối email
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('Email service is ready to send messages');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }

  // Gửi email quên mật khẩu
  async sendPasswordResetEmail(email, resetToken) {
    try {
      const resetUrl = `${config.CORS_ORIGIN}/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: config.EMAIL_FROM,
        to: email,
        subject: 'Khôi phục mật khẩu - Fashion Store',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Khôi phục mật khẩu</h2>
            <p>Xin chào,</p>
            <p>Bạn đã yêu cầu khôi phục mật khẩu cho tài khoản của mình.</p>
            <p>Vui lòng nhấp vào liên kết bên dưới để đặt lại mật khẩu:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Đặt lại mật khẩu
              </a>
            </div>
            <p>Hoặc copy và paste link này vào trình duyệt:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
            <p><strong>Lưu ý:</strong> Liên kết này sẽ hết hạn sau 1 giờ.</p>
            <p>Nếu bạn không yêu cầu khôi phục mật khẩu, vui lòng bỏ qua email này.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              Email này được gửi tự động từ hệ thống Fashion Store.<br>
              Vui lòng không trả lời email này.
            </p>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error: error.message };
    }
  }

  // Gửi email xác thực tài khoản
  async sendVerificationEmail(email, verificationToken) {
    try {
      const verificationUrl = `${config.CORS_ORIGIN}/verify-email?token=${verificationToken}`;
      
      const mailOptions = {
        from: config.EMAIL_FROM,
        to: email,
        subject: 'Xác thực tài khoản - Fashion Store',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Xác thực tài khoản</h2>
            <p>Xin chào,</p>
            <p>Cảm ơn bạn đã đăng ký tài khoản tại Fashion Store.</p>
            <p>Vui lòng nhấp vào liên kết bên dưới để xác thực tài khoản của bạn:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Xác thực tài khoản
              </a>
            </div>
            <p>Hoặc copy và paste link này vào trình duyệt:</p>
            <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
            <p><strong>Lưu ý:</strong> Liên kết này sẽ hết hạn sau 24 giờ.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              Email này được gửi tự động từ hệ thống Fashion Store.<br>
              Vui lòng không trả lời email này.
            </p>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Verification email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending verification email:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
