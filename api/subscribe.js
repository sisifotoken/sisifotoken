// /api/subscribe.js

export default async function handler(req, res) {
  // Configuración CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://www.sisifotoken.xyz');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { email, name } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Email inválido' });
  }

  // Leer variables de entorno (que sabemos que son correctas)
  const API_KEY = process.env.BREVO_API_KEY;
  const LIST_ID = parseInt(process.env.BREVO_LIST_ID, 10);

  if (!API_KEY || !LIST_ID) {
    console.error('Faltan variables de entorno: BREVO_API_KEY o BREVO_LIST_ID');
    return res.status(500).json({ message: 'Error de configuración del servidor' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY,
      },
      body: JSON.stringify({
        email: email,
        attributes: {
          NOMBRE: name || '',
        },
        listIds: [LIST_ID],
        updateEnabled: true,
      }),
    });

    // **IMPORTANTE: Leer la respuesta como texto antes de parsear**
    const responseText = await response.text();
    let data = {};
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error al parsear JSON. Respuesta recibida:', responseText);
      return res.status(response.status).json({
        message: 'El servidor de Brevo devolvió una respuesta inesperada.',
        rawResponse: responseText, // Esto es para depuración, luego lo quitas
      });
    }

    if (!response.ok) {
      if (response.status === 400 && data.message?.includes('already exists')) {
        return res.status(200).json({
          message: 'Ya estás en la lista. Recibirás nuestras novedades.',
          alreadyExists: true
        });
      }
      
      console.error('Error de Brevo:', data);
      return res.status(response.status).json({
        message: data.message || 'Error al suscribirte. Inténtalo de nuevo.'
      });
    }

    return res.status(200).json({
      message: 'Contacto añadido correctamente. Revisa tu correo para confirmar.',
      success: true
    });

  } catch (error) {
    console.error('Error interno:', error);
    return res.status(500).json({
      message: `Error interno del servidor: ${error.message}`,
    });
  }
}
