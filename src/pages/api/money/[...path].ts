import type { APIRoute } from 'astro';

const EXTERNAL_API = import.meta.env.PUBLIC_EXTERNAL_API_BASE;

async function proxy(request: Request, path: string) {
    if (!EXTERNAL_API) {
        return new Response(JSON.stringify({ error: 'Server misconfiguration' }), { status: 500 });
    }

    const token = request.headers.get('cookie')?.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    if (!token) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const url = new URL(request.url);
    const targetUrl = new URL(`${EXTERNAL_API}${path}${url.search}`);

    const options: RequestInit = {
        method: request.method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
        options.body = await request.text();
    }

    try {
        const response = await fetch(targetUrl.toString(), options);
        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}

export const ALL: APIRoute = ({ request, params }) => {
    console.log(`[Money Proxy] ${request.method} ${params.path}`);
    return proxy(request, `/money/${params.path}`);
};
