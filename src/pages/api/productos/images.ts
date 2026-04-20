import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const externalApiBase = import.meta.env.PUBLIC_EXTERNAL_API_BASE;
  const token = request.headers.get('cookie')?.split('; ').find(row => row.startsWith('token='))?.split('=')[1]
               || request.headers.get('Authorization')?.split(' ')[1];

  try {
    const url = new URL(request.url);
    const idProducto = url.searchParams.get('id_producto');
    
    if (!idProducto) {
      return new Response(JSON.stringify({ message: 'id_producto is required' }), { status: 400 });
    }

    const targetUrl = `${externalApiBase}/productos/images?id_producto=${idProducto}`;
    const body = await request.formData(); // Images are in FormData

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
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
    console.error('Error proxying images', error);
    return new Response(JSON.stringify({ message: 'Error' }), { status: 500 });
  }
};
