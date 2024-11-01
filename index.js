import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';

dotenv.config();

const app = express();
const resend = new Resend("re_SjeR9Xmy_HaZJDE7WtitVrVWvhvuWjSgD");

// Middleware de CORS
app.use(cors({
    origin: "https://www.serviciotecnicoinfinix.com.ar",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

app.use(express.json());

// Endpoint para enviar correos
app.post('/send-email', async (req, res) => {
    const { email, wttp, message } = req.body;

    try {
        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>", 
            to: ["info@serviciotecnicoxiaomi.com.ar"], 
            subject: `Consulta de ${email}.`,
            html: `
                <h1>Detalles del contacto</h1>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>WhatsApp:</strong> ${wttp}</p>
                <p><strong>Mensaje:</strong> ${message}</p>
            `,
        });

        if (error) {
            return res.status(500).json({ error: "Error al enviar el correo" });
        }
        res.status(200).json({ message: "Correo enviado exitosamente", data });
    } catch (err) {
        console.error("Error en el controlador:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Inicia el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
