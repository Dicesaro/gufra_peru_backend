import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export const sendRecoveryEmail = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Recuperación de contraseña',
    text: `Tu código de recuperación es: ${code}`,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`✅ Correo enviado a ${email}`)
  } catch (error) {
    console.error('❌ Error enviando correo:', error)
    throw new Error('No se pudo enviar el email')
  }
}
