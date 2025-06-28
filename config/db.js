import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Verificar conexión
const connectDB = async () => {
  try {
    const connection = await pool.getConnection()
    console.log('✅ Conectado a la base de datos MySQL')
    connection.release() // Liberar conexión
  } catch (error) {
    console.error(
      '❌ Error conectando a la base de datos:',
      error.message
    )
    process.exit(1) // Detener la ejecución en caso de error
  }
}

export { pool, connectDB }
