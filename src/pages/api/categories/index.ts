import type { APIRoute } from 'astro';

export const ALL: APIRoute = async ({ request }) => {
    const externalApiBase = import.meta.env.PUBLIC_EXTERNAL_API_BASE;
    if (!externalApiBase) {
        return new Response(JSON.stringify({ message: 'Server misconfiguration' }), { status: 500 });
    }

    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') 
        ? authHeader.split(' ')[1] 
        : request.headers.get('cookie')?.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

    // GET is public, other methods require token
    if (request.method !== 'GET' && !token) {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    try {
        const url = new URL(request.url);
        const searchParams = url.search;
        const targetUrl = `${externalApiBase}/categories${searchParams}`;
        const body = request.method !== 'GET' ? await request.text() : undefined;

        const response = await fetch(targetUrl, {
            method: request.method,
            headers: {
                "Content-Type": "application/json",
                ...(token && { "Authorization": `Bearer ${token}` })
            },
            body
        });

        if (response.status === 204) return new Response(null, { status: 204 });
        
        const text = await response.text();
        return new Response(text, { status: response.status, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error(`Error proxying categories request:`, error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
};
