import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ cookies }) => {
    const externalApiBase = import.meta.env.PUBLIC_EXTERNAL_API_BASE;
    const token = cookies.get('token')?.value;

    if (!externalApiBase) {
        return new Response(JSON.stringify({ error: 'Server misconfiguration' }), { status: 500 });
    }

    // For public top sellers, we allow access without token if it's a GET request
    // The backend might still require a token if it's not configured as public, 
    // but we'll try to use a system token or just forward it.
    // However, the cleanest way is often to have a public mirror in the backend. 
    // For now, let's just make the proxy allow it.

    try {
        const response = await fetch(`${externalApiBase}/reports/inventario/top-salidas`, {
            headers: {
                ...(token && { 'Authorization': `Bearer ${token}` }),
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error("Error fetching top salidas:", error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
};
