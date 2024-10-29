require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const RESEND_API_KEY = "re_gcgSBD6n_NHfcokuaS34gDp7Rc4bm2yKp";

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
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ message: 'Error al enviar el correo', error: error.message });
  }
});

// Inicia el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});