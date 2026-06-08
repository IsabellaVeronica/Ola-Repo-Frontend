export { renderers } from '../../../renderers.mjs';

const externalApiBase = "http://localhost:3001/api";
const POST = async ({ request }) => {
  const token = request.headers.get("cookie")?.split("; ").find((row) => row.startsWith("token="))?.split("=")[1];
  if (!token) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }
  try {
    const contentType = request.headers.get("content-type");
    const body = request.body;
    const headers = {
      Authorization: `Bearer ${token}`
    };
    if (contentType) headers["Content-Type"] = contentType;
    const response = await fetch(`${externalApiBase}/settings/store-icon`, {
      method: "POST",
      headers,
      body,
      // Needed by Node fetch when forwarding multipart body streams.
      // @ts-ignore
      duplex: "half"
    });
    const text = await response.text();
    return new Response(text, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("Content-Type") || "application/json" }
    });
  } catch (error) {
    console.error("Error proxying settings/store-icon", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
