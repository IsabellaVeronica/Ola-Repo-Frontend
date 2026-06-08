export { renderers } from '../../../../renderers.mjs';

const GET = async ({ request, cookies }) => {
  const externalApiBase = "http://localhost:3001/api";
  const token = cookies.get("token")?.value;
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const targetUrl = new URL(`${externalApiBase}/reports/inventario/preview`);
  searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });
  try {
    const response = await fetch(targetUrl.toString(), {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error fetching report preview:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
