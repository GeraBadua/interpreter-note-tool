// lib/deepl.js
import axios from 'axios';

const API_URL = 'https://api-free.deepl.com/v2/translate';  // O 'https://api.deepl.com/v2/translate' para cuentas Pro
const API_KEY = process.env.DEEPL_API_KEY; // Asegúrate de almacenar tu clave API de forma segura

export const translateText = async (text, targetLang) => {
  try {
    const response = await axios.post(API_URL, null, {
      params: {
        auth_key: API_KEY,
        text: text,
        target_lang: targetLang
      }
    });

    return response.data.translations[0].text;
  } catch (error) {
    console.error('Error al traducir:', error);
    throw error;
  }
};
