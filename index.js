
import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import cors from 'cors';

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Para poder recibir datos en formato JSON

// Obtiene la clave API de Resend desde las variables de entorno
const RESEND_API_KEY = process.env.RESEND_API_KEY; // Asegúrate de definir esto en tu archivo .env

// Endpoint para enviar correos
app.post('/send-email', async (req, res) => {
    const { email, wttp, message } = req.body;

    try {
        const response = await axios.post(
            'https://api.resend.com/emails',
            {
                from: 'Acme <onboarding@resend.dev>',
                to: ['agustin.morro@gmail.com'],
                subject: 'Nuevo mensaje de contacto',
                html: `
                    <h1>Detalles del mensaje:</h1>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>WhatsApp:</strong> ${wttp}</p>
                    <p><strong>Mensaje:</strong> ${message}</p>
                `,
            },
            {
                headers: {
                    Authorization: `Bearer ${RESEND_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.status(200).json({ message: 'Correo enviado con éxito', data: response.data });
    } catch (error) {
        console.error('Error al enviar el correo:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error al enviar el correo', error: error.message });
    }
});

// Inicia el servidor
const PORT = process.env.PORT || 3001; // Usa el puerto definido en el entorno o 3001 por defecto
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
