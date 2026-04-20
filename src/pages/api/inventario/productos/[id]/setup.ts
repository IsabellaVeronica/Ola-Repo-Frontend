import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, params }) => {
  const { id } = params;
  const externalApiBase = import.meta.env.PUBLIC_EXTERNAL_API_BASE;
  const token = request.headers.get('cookie')?.split('; ').find(row => row.startsWith('token='))?.split('=')[1]
               || request.headers.get('Authorization')?.split(' ')[1];

  try {
    const targetUrl = `${externalApiBase}/inventario/productos/${id}/setup`;
    const response = await fetch(targetUrl, {
      headers: { 'Authorization': `Bearer ${token || ''}` }
    });

    const data = await response.text();
    return new Response(data, {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error' }), { status: 500 });
  }
};
