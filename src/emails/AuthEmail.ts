import { transport } from "../config/nodemailer";

type EmailType = {
  name: string;
  email: string;
  token: string;
};

export class AuthEmail {
  static sendConfirmationEmail = async (user: EmailType) => {
    await transport.sendMail({
      from: "CashTrackr <admin@carlos-fullstack.com>",
      to: user.email,
      subject: "CashTrackr - Confirm your account",
      text: "CashTrackr - Confirm your account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eaeaea; padding: 20px; border-radius: 8px;">
          <h2 style="text-align: center; color: #f59e0b;">CashTrackr</h2>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>You've just created a new account on <strong>CashTrackr</strong>. You're almost done! Please confirm your account by clicking the button below and entering the code:</p>

          <div style="background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 6px; border: 1px solid #e2e2e2;">
            ${user.token}
          </div>
          <p>This code expires in 10 minutes.</p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e2e2;" />
          <p>Sincerely,</p>
          <p style="font-weight: bold; margin: 0;">The CashTrackr team</p>
        </div>
      `,
    });
  };

  static sendPasswordResetToken = async (user: EmailType) => {
    await transport.sendMail({
      from: "CashTrackr <admin@carlos-fullstack.com>",
      to: user.email,
      subject: "CashTrackr - Reset your password",
      text: "CashTrackr - Reset your password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eaeaea; padding: 20px; border-radius: 8px;">
          <h2 style="text-align: center; color: #f59e0b;">CashTrackr</h2>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>We've received a request to reset your password. Reset it by clicking the button below and entering the code:</p>

          <div style="background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 6px; border: 1px solid #e2e2e2;">
            ${user.token}
          </div>
          <p>This code expires in 10 minutes.</p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e2e2;" />
          <p>Sincerely,</p>
          <p style="font-weight: bold; margin: 0;">The CashTrackr team</p>
        </div>
      `,
    });
  };
}
