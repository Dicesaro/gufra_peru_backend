import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import nodemailer from 'nodemailer'
import { connectDB } from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import saleRoutes from './routes/saleRoutes.js'
import problemaRoutes from './routes/problemaRoutes.js'
import clienteRoutes from './routes/clienteRoutes.js'

dotenv.config()

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Conectar BD
connectDB()

// Prueba de envío de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// Ruta de prueba para enviar un correo
app.get('/api/test-email', async (req, res) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'tucorreo@ejemplo.com', // Cambia esto a tu correo para la prueba
    subject: 'Prueba de Envío de Correo',
    text: 'Hola, este es un correo de prueba desde el backend.',
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Correo enviado:', info.response)
    res.json({
      success: true,
      message: 'Correo enviado correctamente',
    })
  } catch (error) {
    console.error('❌ Error al enviar el correo:', error)
    res
      .status(500)
      .json({ success: false, message: 'Error al enviar el correo' })
  }
})

// Rutas
app.use('/api/users', userRoutes)
app.use('/api/productos', productRoutes)
app.use('/api/ventas', saleRoutes)
app.use('/api/problemas', problemaRoutes)
app.use('/api/clientes', clienteRoutes)

// Iniciar servidor
const PORT = process.env.PORT || 5000
app.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
)
