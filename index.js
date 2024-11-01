import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';

dotenv.config();

const app = express();
const resend = new Resend("re_SjeR9Xmy_HaZJDE7WtitVrVWvhvuWjSgD");

// Middleware de CORS ajustado manualmente
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://www.serviciotecnicoinfinix.com.ar");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }
    next();
});

app.use(express.json());

// Endpoint para enviar correos
app.post('/send-email', async (req, res) => {
    const { email, wttp, message } = req.body;

    try {
        const response = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>', // Cambia a tu dominio autenticado Acme <onboarding@resend.dev>
            to: ['info@serviciotecnicoxiaomi.com.ar'],
            subject: 'Nuevo mensaje de contacto',
            html: `
                <h1>Detalles del mensaje:</h1>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>WhatsApp:</strong> ${wttp}</p>
                <p><strong>Mensaje:</strong> ${message}</p>
            `,
        });

        res.status(200).json({ message: 'Correo enviado con éxito', data: response });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ message: 'Error al enviar el correo', error: error.message });
    }
});

// Inicia el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
