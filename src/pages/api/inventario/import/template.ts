import type { APIRoute } from 'astro';

const externalApiBase = import.meta.env.PUBLIC_EXTERNAL_API_BASE;

export const GET: APIRoute = async ({ request }) => {
  if (!externalApiBase) {
    return new Response(JSON.stringify({ message: 'API Base not defined' }), { status: 500 });
  }

  const token = request.headers.get('cookie')?.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  if (!token) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const response = await fetch(`${externalApiBase}/inventario/import/template`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
        const text = await response.text();
        return new Response(text, { 
            status: response.status, 
            headers: { 'Content-Type': 'application/json' } 
        });
    }

    const blob = await response.blob();
    return new Response(blob, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': response.headers.get('Content-Disposition') || 'attachment; filename=plantilla_inventario.xlsx'
      }
    });
  } catch (error) {
    console.error('Error proxying inventory/import/template', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
};
