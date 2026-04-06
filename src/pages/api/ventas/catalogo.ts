import type { APIRoute } from 'astro';

const externalApiBase = import.meta.env.PUBLIC_EXTERNAL_API_BASE;

const getTokenFromCookie = (cookieHeader: string | null) =>
  cookieHeader?.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

export const GET: APIRoute = async ({ request }) => {
  if (!externalApiBase) {
    return new Response(JSON.stringify({ message: 'API Base not defined' }), { status: 500 });
  }

  const token = getTokenFromCookie(request.headers.get('cookie'));
  if (!token) return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });

  try {
    const url = new URL(request.url);
    const search = url.search || '';
    const response = await fetch(`${externalApiBase}/ventas/catalogo${search}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const text = await response.text();
    return new Response(text, {
      status: response.status,
      headers: { 'Content-Type': response.headers.get('Content-Type') || 'application/json' }
    });
  } catch {
    return new Response(JSON.stringify({ message: 'Error' }), { status: 500 });
  }
};
