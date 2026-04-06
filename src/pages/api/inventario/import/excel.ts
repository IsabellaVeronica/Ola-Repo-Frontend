import type { APIRoute } from 'astro';

const externalApiBase = import.meta.env.PUBLIC_EXTERNAL_API_BASE;

export const POST: APIRoute = async ({ request }) => {
  if (!externalApiBase) {
    return new Response(JSON.stringify({ message: 'API Base not defined' }), { status: 500 });
  }

  const token = request.headers.get('cookie')?.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  if (!token) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const contentType = request.headers.get('content-type');
    const body = request.body;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`
    };
    if (contentType) headers['Content-Type'] = contentType;

    const response = await fetch(`${externalApiBase}/inventario/import/excel`, {
      method: 'POST',
      headers,
      body,
      // Needed by Node fetch when forwarding multipart body streams.
      // @ts-ignore
      duplex: 'half'
    });

    const data = await response.text();
    return new Response(data, {
      status: response.status,
      headers: { 'Content-Type': response.headers.get('Content-Type') || 'application/json' }
    });
  } catch (error) {
    console.error('Error proxying inventory/import/excel', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
};
