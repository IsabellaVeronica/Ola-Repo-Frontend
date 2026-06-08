export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  const externalApiBase = "http://localhost:3001/api";
  const token = request.headers.get("cookie")?.split("; ").find((row) => row.startsWith("token="))?.split("=")[1] || request.headers.get("Authorization")?.split(" ")[1];
  try {
    const url = new URL(request.url);
    const idProducto = url.searchParams.get("id_producto");
    if (!idProducto) {
      return new Response(JSON.stringify({ message: "id_producto is required" }), { status: 400 });
    }
    const targetUrl = `${externalApiBase}/productos/images?id_producto=${idProducto}`;
    const body = await request.formData();
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token || ""}`
      },
      body
    });
    const data = await response.text();
    return new Response(data, {
      status: response.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error proxying images", error);
    return new Response(JSON.stringify({ message: "Error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
