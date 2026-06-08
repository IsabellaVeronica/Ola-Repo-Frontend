/* empty css                                    */
import { e as createComponent, f as createAstro, p as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_D_CbgPK6.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/utils_DY3iklJy.mjs';
import { $ as $$Header, a as $$Sidebar } from '../../chunks/Header_CSh91x7o.mjs';
import { A as AuthGuard } from '../../chunks/AuthGuard_By6cWR9G.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$Ventas = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Ventas;
  const token = Astro2.cookies.get("token")?.value;
  if (!token) {
    return Astro2.redirect("/login");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Ventas | Panel de Control" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col min-h-screen bg-background"> ${renderComponent($$result2, "Header", $$Header, {})} <div class="flex flex-1"> ${renderComponent($$result2, "Sidebar", $$Sidebar, {})} <main class="flex-1 min-w-0 p-4 md:p-8 overflow-x-hidden"> ${renderComponent($$result2, "AuthGuard", AuthGuard, { "client:load": true, "allowedRoles": ["admin", "manager", "vendedor"], "panelName": "Ventas", "client:component-hydration": "load", "client:component-path": "C:/Users/aniba/Downloads/OLA WEB OFICIAL/OLA FRONTEND/src/components/Dashboard/AuthGuard", "client:component-export": "AuthGuard" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "VentasManager", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/aniba/Downloads/OLA WEB OFICIAL/OLA FRONTEND/src/components/Dashboard/Sales/VentasManager", "client:component-export": "VentasManager" })} ` })} </main> </div> </div> ` })}`;
}, "C:/Users/aniba/Downloads/OLA WEB OFICIAL/OLA FRONTEND/src/pages/dashboard/ventas.astro", void 0);

const $$file = "C:/Users/aniba/Downloads/OLA WEB OFICIAL/OLA FRONTEND/src/pages/dashboard/ventas.astro";
const $$url = "/dashboard/ventas";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Ventas,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
