export { renderers } from '../../../../../renderers.mjs';

const GET = async ({ request, params }) => {
  const { id } = params;
  const externalApiBase = "http://localhost:3001/api";
  const token = request.headers.get("cookie")?.split("; ").find((row) => row.startsWith("token="))?.split("=")[1] || request.headers.get("Authorization")?.split(" ")[1];
  try {
    const targetUrl = `${externalApiBase}/inventario/productos/${id}/setup`;
    const response = await fetch(targetUrl, {
      headers: { "Authorization": `Bearer ${token || ""}` }
    });
    const data = await response.text();
    return new Response(data, {
      status: response.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
