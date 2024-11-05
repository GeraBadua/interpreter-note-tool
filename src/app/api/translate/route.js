import { translateText } from '@/lib/deepl';

export async function POST(req) {
  try {
    const { text, targetLang } = await req.json();
    const translatedText = await translateText(text, targetLang);

    return new Response(JSON.stringify({ translatedText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error al traducir:', error);
    return new Response(JSON.stringify({ message: 'Error al traducir el texto' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
