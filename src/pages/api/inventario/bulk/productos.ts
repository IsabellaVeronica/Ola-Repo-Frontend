import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const externalApiBase = import.meta.env.PUBLIC_EXTERNAL_API_BASE;
  const token = request.headers.get('cookie')?.split('; ').find(row => row.startsWith('token='))?.split('=')[1] 
               || request.headers.get('Authorization')?.split(' ')[1];

  if (!externalApiBase) {
    return new Response(JSON.stringify({ message: 'Server misconfiguration' }), { status: 500 });
  }

  try {
    const targetUrl = `${externalApiBase}/inventario/bulk/productos`;
    const body = await request.text();

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`
      },
      body
    });

    const data = await response.text();
    return new Response(data, {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(`Error proxying bulk create request`, error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
};
