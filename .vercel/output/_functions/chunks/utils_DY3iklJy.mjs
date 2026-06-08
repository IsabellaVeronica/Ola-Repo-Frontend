import { e as createComponent, f as createAstro, r as renderTemplate, ah as renderSlot, ai as renderHead, h as addAttribute } from './astro/server_D_CbgPK6.mjs';
import 'piccolore';
import { clsx } from 'clsx';
/* empty css                         */
import { twMerge } from 'tailwind-merge';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="es" data-astro-cid-sckkx6r4> <head><meta charset="UTF-8"><meta name="description" content="Astro description"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"', "><title>", `</title><!-- Theme Initialization --><script>
			const theme = (() => {
				if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
					return localStorage.getItem('theme');
				}
				if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
					return 'dark';
				}
				return 'light';
			})();
		
			if (theme === 'dark') {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		<\/script><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap" rel="stylesheet">`, "</head> <body data-astro-cid-sckkx6r4> ", " </body></html>"])), addAttribute(Astro2.generator, "content"), title, renderHead(), renderSlot($$result, $$slots["default"]));
}, "C:/Users/aniba/Downloads/OLA WEB OFICIAL/OLA FRONTEND/src/layouts/Layout.astro", void 0);

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export { $$Layout as $, cn as c };
