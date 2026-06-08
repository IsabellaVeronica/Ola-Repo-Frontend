import { e as createComponent, f as createAstro, m as maybeRenderHead, h as addAttribute, aj as renderScript, r as renderTemplate } from './astro/server_D_CbgPK6.mjs';
import 'piccolore';
import 'clsx';

const $$Astro = createAstro();
const $$Sidebar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Sidebar;
  const { pathname } = Astro2.url;
  const isActive = (path) => {
    return pathname === path || pathname === path + "/";
  };
  return renderTemplate`${maybeRenderHead()}<div id="sidebar-overlay" class="fixed inset-0 bg-black/50 z-40 hidden lg:hidden"></div> <aside id="dashboard-sidebar" class="fixed inset-y-0 left-0 w-64 p-4 bg-card/95 backdrop-blur-md border-r border-border z-50 transform -translate-x-full transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-0 lg:bg-card/80"> <div class="flex items-center justify-between mb-6 lg:hidden"> <span class="font-bold text-lg">Menú</span> <button id="close-sidebar" class="p-2 hover:bg-secondary rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg> </button> </div> <nav> <ul class="space-y-1"> <li> <a href="/dashboard"${addAttribute(`flex items-center gap-2 px-4 py-2.5 rounded-md transition-colors ${isActive("/dashboard") ? "bg-primary text-primary-foreground font-bold shadow-sm" : "text-foreground hover:bg-secondary/50"}`, "class")}>
Principal
</a> </li> <li> <a href="/dashboard/users"${addAttribute(`flex items-center gap-2 px-4 py-2.5 rounded-md transition-colors ${isActive("/dashboard/users") ? "bg-primary text-primary-foreground font-bold shadow-sm" : "text-foreground hover:bg-secondary/50"}`, "class")}>
Usuarios
</a> </li> <li> <a href="/dashboard/products"${addAttribute(`flex items-center gap-2 px-4 py-2.5 rounded-md transition-colors ${isActive("/dashboard/products") ? "bg-primary text-primary-foreground font-bold shadow-sm" : "text-foreground hover:bg-secondary/50"}`, "class")}>
Inventario
</a> </li> <li> <a href="/dashboard/orders"${addAttribute(`flex items-center gap-2 px-4 py-2.5 rounded-md transition-colors ${isActive("/dashboard/orders") ? "bg-primary text-primary-foreground font-bold shadow-sm" : "text-foreground hover:bg-secondary/50"}`, "class")}>
Pedidos
</a> </li> <li> <a href="/dashboard/ventas"${addAttribute(`flex items-center gap-2 px-4 py-2.5 rounded-md transition-colors ${isActive("/dashboard/ventas") ? "bg-primary text-primary-foreground font-bold shadow-sm" : "text-foreground hover:bg-secondary/50"}`, "class")}>
Ventas
</a> </li> <li> <a href="/dashboard/dinero"${addAttribute(`flex items-center gap-2 px-4 py-2.5 rounded-md transition-colors ${isActive("/dashboard/dinero") ? "bg-primary text-primary-foreground font-bold shadow-sm" : "text-foreground hover:bg-secondary/50"}`, "class")}>
Dinero
</a> </li> <li> <a href="/dashboard/audit"${addAttribute(`flex items-center gap-2 px-4 py-2.5 rounded-md transition-colors ${isActive("/dashboard/audit") ? "bg-primary text-primary-foreground font-bold shadow-sm" : "text-foreground hover:bg-secondary/50"}`, "class")}>
Auditoría
</a> </li> <li> <a href="/dashboard/settings"${addAttribute(`flex items-center gap-2 px-4 py-2.5 rounded-md transition-colors ${isActive("/dashboard/settings") ? "bg-primary text-primary-foreground font-bold shadow-sm" : "text-foreground hover:bg-secondary/50"}`, "class")}>
Configuración
</a> </li> </ul> </nav> </aside> ${renderScript($$result, "C:/Users/aniba/Downloads/OLA WEB OFICIAL/OLA FRONTEND/src/components/Dashboard/Sidebar.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/aniba/Downloads/OLA WEB OFICIAL/OLA FRONTEND/src/components/Dashboard/Sidebar.astro", void 0);

const $$Header = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<header class="flex items-center justify-between p-3 sm:p-4 bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40 gap-2"> <div class="flex items-center gap-2 sm:gap-4 min-w-0 flex-1"> <button id="mobile-menu-toggle" class="lg:hidden p-2 hover:bg-secondary rounded-md shrink-0" aria-label="Abrir menú"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu"><line x1="3" x2="21" y1="6" y2="6"></line><line x1="3" x2="21" y1="12" y2="12"></line><line x1="3" x2="21" y1="18" y2="18"></line></svg> </button> <h1 class="text-sm xs:text-base sm:text-xl font-bold text-foreground truncate uppercase tracking-tighter sm:tracking-normal"> <span class="xs:hidden">Admin</span> <span class="hidden xs:inline">Panel Administrativo</span> </h1> </div> <button id="logout-button" class="px-2 py-1.5 sm:px-4 sm:py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 text-[10px] xs:text-xs sm:text-sm whitespace-nowrap shrink-0 font-bold">
SALIR
</button> </header> ${renderScript($$result, "C:/Users/aniba/Downloads/OLA WEB OFICIAL/OLA FRONTEND/src/components/Dashboard/Header.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/aniba/Downloads/OLA WEB OFICIAL/OLA FRONTEND/src/components/Dashboard/Header.astro", void 0);

export { $$Header as $, $$Sidebar as a };
