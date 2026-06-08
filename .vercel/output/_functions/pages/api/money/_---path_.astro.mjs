export { renderers } from '../../../renderers.mjs';

const EXTERNAL_API = "http://localhost:3001/api";
async function proxy(request, path) {
  const token = request.headers.get("cookie")?.split("; ").find((row) => row.startsWith("token="))?.split("=")[1];
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  const url = new URL(request.url);
  const targetUrl = new URL(`${EXTERNAL_API}${path}${url.search}`);
  const options = {
    method: request.method,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  };
  if (["POST", "PUT", "PATCH"].includes(request.method)) {
    options.body = await request.text();
  }
  try {
    const response = await fetch(targetUrl.toString(), options);
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
const ALL = ({ request, params }) => {
  console.log(`[Money Proxy] ${request.method} ${params.path}`);
  return proxy(request, `/money/${params.path}`);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    ALL
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
