import type { APIRoute } from 'astro';

// This proxy fetches both stock-bajo and top-salidas data, 
// then combines them to compute intelligent replenishment predictions.
export const GET: APIRoute = async ({ request, cookies }) => {
    const externalApiBase = import.meta.env.PUBLIC_EXTERNAL_API_BASE;
    const token = cookies.get('token')?.value;

    if (!token) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const url = new URL(request.url);
    const threshold = url.searchParams.get('threshold') || '10';
    const days = parseInt(url.searchParams.get('days') || '30');

    // Mock mode
    if (!externalApiBase) {
        const mockData = [
            {
                id: 101,
                producto: 'Yara Tous',
                sku: 'YAR-001',
                stock_actual: 2,
                min_stock: 10,
                variante: '100ml',
                total_salidas_periodo: 18,
                periodo_dias: days,
            },
            {
                id: 102,
                producto: 'Asad Lattafa',
                sku: 'ASA-002',
                stock_actual: 5,
                min_stock: 10,
                variante: '100ml',
                total_salidas_periodo: 12,
                periodo_dias: days,
            },
            {
                id: 103,
                producto: 'Khamrah',
                sku: 'KHA-003',
                stock_actual: 0,
                min_stock: 8,
                variante: '50ml',
                total_salidas_periodo: 9,
                periodo_dias: days,
            },
        ];
        return new Response(JSON.stringify({ data: mockData }), { status: 200 });
    }

    try {
        // Fetch both endpoints concurrently
        const [stockRes, salidasRes] = await Promise.all([
            fetch(`${externalApiBase}/reports/alertas/stock-bajo?threshold=${threshold}`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            }),
            fetch(`${externalApiBase}/reports/inventario/top-salidas?days=${days}&limit=100`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            }),
        ]);

        const stockData = await stockRes.json();
        const salidasData = salidasRes.ok ? await salidasRes.json() : { data: [] };

        const stockItems: any[] = Array.isArray(stockData) ? stockData : (stockData.data || []);
        const salidasItems: any[] = Array.isArray(salidasData) ? salidasData : (salidasData.data || []);

        // Build a lookup map: sku or id => total_salidas
        const salidasMap = new Map<string, number>();
        for (const s of salidasItems) {
            const key = String(s.id_variante_producto || s.id || s.sku);
            salidasMap.set(key, Number(s.total_salidas || s.total || 0));
        }

        // Enrich stock items with movement data
        const enriched = stockItems.map((item: any) => {
            const key = String(item.id_variante_producto || item.id || item.sku);
            const totalSalidas = salidasMap.get(key) || 0;
            return {
                ...item,
                producto: item.producto || item.title || 'Producto sin nombre',
                stock_actual: item.stock,
                total_salidas_periodo: totalSalidas,
                periodo_dias: days,
            };
        });

        return new Response(JSON.stringify({ data: enriched }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("Error fetching replenishment data:", error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
};
