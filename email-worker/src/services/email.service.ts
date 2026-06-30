import * as nodemailer from "nodemailer";
import { appConfig } from "@/appConfig.js";

const transporter = nodemailer.createTransport({
  host: appConfig.smtp.host,
  port: appConfig.smtp.port,
  secure: appConfig.smtp.secure,
  auth: {
    user: appConfig.smtp.user,
    pass: appConfig.smtp.pass,
  },
});

function verificationTemplate(title: string, code: number): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>${title}</h2>
      <p>Ваш код подтверждения:</p>
      <p style="font-size: 32px; font-weight: bold; letter-spacing: 4px;">${code}</p>
      <p>Код действителен 15 минут. Если вы не запрашивали его — просто проигнорируйте это письмо.</p>
    </div>
  `;
}

export async function sendAccountSubmissionEmail(
  receiver: string,
  code: number,
): Promise<void> {
  await transporter.sendMail({
    from: appConfig.smtp.from,
    to: receiver,
    subject: "Подтверждение регистрации",
    text: `Ваш код подтверждения регистрации: ${code}. Код действителен 15 минут.`,
    html: verificationTemplate("Подтверждение регистрации", code),
  });
}

export async function sendPasswordRecoveryEmail(
  receiver: string,
  code: number,
): Promise<void> {
  await transporter.sendMail({
    from: appConfig.smtp.from,
    to: receiver,
    subject: "Восстановление пароля",
    text: `Ваш код для восстановления пароля: ${code}. Код действителен 15 минут.`,
    html: verificationTemplate("Восстановление пароля", code),
  });
}
