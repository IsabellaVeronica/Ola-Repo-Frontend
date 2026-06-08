/* empty css                                 */
import { e as createComponent, p as renderComponent, aj as renderScript, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_D_CbgPK6.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/utils_DY3iklJy.mjs';
import { B as Button } from '../chunks/button_D3TXvS4A.mjs';
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from '../chunks/card_BjP27i0i.mjs';
import { I as Input } from '../chunks/input_VyVQ34R2.mjs';
import { L as Label } from '../chunks/label_BcFE407i.mjs';
export { renderers } from '../renderers.mjs';

const $$Register = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Registrarse" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="flex items-center justify-center min-h-screen bg-background text-foreground"> ${renderComponent($$result2, "Card", Card, { "className": "w-full max-w-md mx-4" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, {}, { "default": async ($$result4) => renderTemplate` ${renderComponent($$result4, "CardTitle", CardTitle, { "className": "text-2xl font-bold text-center" }, { "default": async ($$result5) => renderTemplate`Registrarse` })} ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": async ($$result4) => renderTemplate` <form id="register-form" class="space-y-4"> <div class="space-y-2"> ${renderComponent($$result4, "Label", Label, { "htmlFor": "nombre" }, { "default": async ($$result5) => renderTemplate`Nombre Completos` })} ${renderComponent($$result4, "Input", Input, { "id": "nombre", "type": "text", "placeholder": "Juan P\xE9rez", "required": true })} </div> <div class="space-y-2"> ${renderComponent($$result4, "Label", Label, { "htmlFor": "email" }, { "default": async ($$result5) => renderTemplate`Email` })} ${renderComponent($$result4, "Input", Input, { "id": "email", "type": "email", "placeholder": "m@example.com", "required": true })} </div> <div class="space-y-2"> ${renderComponent($$result4, "Label", Label, { "htmlFor": "password" }, { "default": async ($$result5) => renderTemplate`Contraseña` })} ${renderComponent($$result4, "Input", Input, { "id": "password", "type": "password", "required": true })} </div> ${renderComponent($$result4, "Button", Button, { "type": "submit", "className": "w-full" }, { "default": async ($$result5) => renderTemplate`Registrarse` })} </form> <div id="message" class="text-center mt-4 text-sm font-medium"></div> <div class="mt-4 text-center text-sm">
¿Ya tienes cuenta?
<a href="/login" class="underline">Iniciar Sesión</a> </div> ` })} ` })} </main> ` })} ${renderScript($$result, "C:/Users/aniba/Downloads/OLA WEB OFICIAL/OLA FRONTEND/src/pages/register.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/aniba/Downloads/OLA WEB OFICIAL/OLA FRONTEND/src/pages/register.astro", void 0);

const $$file = "C:/Users/aniba/Downloads/OLA WEB OFICIAL/OLA FRONTEND/src/pages/register.astro";
const $$url = "/register";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Register,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
