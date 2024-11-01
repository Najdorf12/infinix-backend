import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { Resend } from "resend";

dotenv.config();

const app = express();
const resend = new Resend("re_SjeR9Xmy_HaZJDE7WtitVrVWvhvuWjSgD");

// Middleware de CORS ajustado
const corsOptions = {
  origin: "https://www.serviciotecnicoinfinix.com.ar",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Asegurarse de manejar solicitudes de tipo OPTIONS para preflight
app.options("*", cors(corsOptions));

// Middleware para analizar JSON
app.use(express.json());

// Endpoint para enviar correos
app.post("/send-email", async (req, res) => {
  const { email, wttp, message } = req.body;

  try {
    const response = await resend.emails.send({
      from: "Infinix Service <https://www.serviciotecnicoinfinix.com.ar>", // Cambia a tu dominio autenticado
      to: ["info@serviciotecnicoxiaomi.com.ar"],
      subject: "Nuevo mensaje de contacto",
      html: `
                <h1>Detalles del mensaje:</h1>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>WhatsApp:</strong> ${wttp}</p>
                <p><strong>Mensaje:</strong> ${message}</p>
            `,
    });

    res
      .status(200)
      .json({ message: "Correo enviado con éxito", data: response });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res
      .status(500)
      .json({ message: "Error al enviar el correo", error: error.message });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
