export { renderers } from '../../../renderers.mjs';

const GET = async ({ request, cookies }) => {
  const externalApiBase = "http://localhost:3001/api";
  const token = cookies.get("token")?.value;
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  const url = new URL(request.url);
  const threshold = url.searchParams.get("threshold") || "10";
  const days = parseInt(url.searchParams.get("days") || "30");
  try {
    const [stockRes, salidasRes] = await Promise.all([
      fetch(`${externalApiBase}/reports/alertas/stock-bajo?threshold=${threshold}`, {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
      }),
      fetch(`${externalApiBase}/reports/inventario/top-salidas?days=${days}&limit=100`, {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
      })
    ]);
    const stockData = await stockRes.json();
    const salidasData = salidasRes.ok ? await salidasRes.json() : { data: [] };
    const stockItems = Array.isArray(stockData) ? stockData : stockData.data || [];
    const salidasItems = Array.isArray(salidasData) ? salidasData : salidasData.data || [];
    const salidasMap = /* @__PURE__ */ new Map();
    for (const s of salidasItems) {
      const key = String(s.id_variante_producto || s.id || s.sku);
      salidasMap.set(key, Number(s.total_salidas || s.total || 0));
    }
    const enriched = stockItems.map((item) => {
      const key = String(item.id_variante_producto || item.id || item.sku);
      const totalSalidas = salidasMap.get(key) || 0;
      return {
        ...item,
        producto: item.producto || item.title || "Producto sin nombre",
        stock_actual: item.stock,
        total_salidas_periodo: totalSalidas,
        periodo_dias: days
      };
    });
    return new Response(JSON.stringify({ data: enriched }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error fetching replenishment data:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
