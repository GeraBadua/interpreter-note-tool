import axios from 'axios';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get('word');
  const deeplApiKey = process.env.DEEPL_API_KEY;

  try {
    // Obtén la definición en inglés
    const dictionaryResponse = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const firstDefinition = dictionaryResponse.data[0]?.meanings[0]?.definitions[0]?.definition || "No definition found";

    // Traduce la definición al español usando la API de DeepL
    const deeplResponse = await axios.post(
      'https://api-free.deepl.com/v2/translate',
      new URLSearchParams({
        auth_key: deeplApiKey,
        text: firstDefinition,
        target_lang: 'ES'
      }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const translatedDefinition = deeplResponse.data.translations[0].text;

    // Retorna ambas definiciones (en inglés y en español)
    return new Response(
      JSON.stringify({ english: firstDefinition, spanish: translatedDefinition }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching or translating definition" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
