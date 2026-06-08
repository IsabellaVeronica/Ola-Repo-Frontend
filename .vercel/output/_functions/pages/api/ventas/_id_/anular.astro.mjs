export { renderers } from '../../../../renderers.mjs';

const externalApiBase = "http://localhost:3001/api";
const getTokenFromCookie = (cookieHeader) => cookieHeader?.split("; ").find((row) => row.startsWith("token="))?.split("=")[1];
const PATCH = async ({ request, params }) => {
  const token = getTokenFromCookie(request.headers.get("cookie"));
  if (!token) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  try {
    const id = params.id;
    const body = await request.text();
    const response = await fetch(`${externalApiBase}/ventas/${id}/anular`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body
    });
    const text = await response.text();
    return new Response(text, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("Content-Type") || "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({ message: "Error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  PATCH
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
