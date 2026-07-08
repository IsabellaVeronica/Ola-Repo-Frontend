const fs = require('fs');
const path = require('path');

const basePath = 'c:\\Users\\aniba\\Downloads\\OLA WEB OFICIAL\\OLA FRONTEND\\src\\pages\\api\\gastos';

const template = `import type { APIRoute } from 'astro';
const externalApiBase = import.meta.env.PUBLIC_EXTERNAL_API_BASE;
const getTokenFromCookie = (cookieHeader: string | null) => cookieHeader?.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
const proxy = async (request: Request, path: string) => {
  if (!externalApiBase) return new Response(JSON.stringify({ message: 'API Base not defined' }), { status: 500 });
  const token = getTokenFromCookie(request.headers.get('cookie'));
  if (!token) return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  try {
    const url = new URL(request.url);
    const body = request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined;
    const response = await fetch(\`\${externalApiBase}\${path}\${url.search}\`, {
      method: request.method,
      headers: { 'Content-Type': 'application/json', Authorization: \`Bearer \${token}\` },
      body
    });
    const text = await response.text();
    return new Response(text, { status: response.status, headers: { 'Content-Type': response.headers.get('Content-Type') || 'application/json' } });
  } catch {
    return new Response(JSON.stringify({ message: 'Error' }), { status: 500 });
  }
};
`;

const files = [
  { path: 'index.ts', content: `export const GET: APIRoute = ({ request }) => proxy(request, '/gastos');\nexport const POST: APIRoute = ({ request }) => proxy(request, '/gastos');` },
  { path: 'kpis.ts', content: `export const GET: APIRoute = ({ request }) => proxy(request, '/gastos/kpis');` },
  { path: '[id]/anular.ts', content: `export const PATCH: APIRoute = ({ request, params }) => proxy(request, \`/gastos/\${params.id}/anular\`);` },
  { path: 'categorias/index.ts', content: `export const GET: APIRoute = ({ request }) => proxy(request, '/gastos/categorias');\nexport const POST: APIRoute = ({ request }) => proxy(request, '/gastos/categorias');` },
  { path: 'categorias/[id].ts', content: `export const PUT: APIRoute = ({ request, params }) => proxy(request, \`/gastos/categorias/\${params.id}\`);\nexport const DELETE: APIRoute = ({ request, params }) => proxy(request, \`/gastos/categorias/\${params.id}\`);` }
];

files.forEach(f => {
  const fullPath = path.join(basePath, f.path);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, template + f.content);
});
console.log('Fixed proxy files.');
