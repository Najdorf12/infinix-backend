require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Configurar CORS solo para el dominio del frontend en producción
app.use(cors({
  origin: 'https://infinixservice.vercel.app'
}));

app.use(express.json());

const RESEND_API_KEY = process.env.RESEND_API_KEY;

// Endpoint para enviar correos
app.post('/send-email', async (req, res) => {
  const { email, wttp, message } = req.body;

  try {
    const response = await axios.post(
      'https://api.resend.com/emails',
      {
        from: 'Infinix Service <info@serviciotecnicoinfinix.com.ar>',
        to: ['info@serviciotecnicoinfinix.com.ar'],
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
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
