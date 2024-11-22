// src/app/api/datamuse/route.js

export async function GET(req) {
  const word = req.nextUrl.searchParams.get('word'); // Usar searchParams

  // Verificar si se proporciona la palabra
  if (!word) {
    return new Response(JSON.stringify({ message: "Word query parameter is required" }), {
      status: 400,
    });
  }

  // URL de la API de Datamuse con la palabra proporcionada
  const url = `https://api.datamuse.com/words?ml=${word}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Devolver las palabras relacionadas
    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Error fetching data from Datamuse API', error }),
      { status: 500 }
    );
  }
}
