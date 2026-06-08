import{b as y,r as p}from"./index.DWKhlr8t.js";var _={exports:{}},c={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var R;function C(){if(R)return c;R=1;var r=y(),e=Symbol.for("react.element"),o=Symbol.for("react.fragment"),s=Object.prototype.hasOwnProperty,u=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,a={key:!0,ref:!0,__self:!0,__source:!0};function l(i,t,f){var n,m={},d=null,x=null;f!==void 0&&(d=""+f),t.key!==void 0&&(d=""+t.key),t.ref!==void 0&&(x=t.ref);for(n in t)s.call(t,n)&&!a.hasOwnProperty(n)&&(m[n]=t[n]);if(i&&i.defaultProps)for(n in t=i.defaultProps,t)m[n]===void 0&&(m[n]=t[n]);return{$$typeof:e,type:i,key:d,ref:x,props:m,_owner:u.current}}return c.Fragment=o,c.jsx=l,c.jsxs=l,c}var w;function E(){return w||(w=1,_.exports=C()),_.exports}var L=E();/**
 * @license lucide-react v0.561.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=r=>r.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),k=r=>r.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,o,s)=>s?s.toUpperCase():o.toLowerCase()),h=r=>{const e=k(r);return e.charAt(0).toUpperCase()+e.slice(1)},v=(...r)=>r.filter((e,o,s)=>!!e&&e.trim()!==""&&s.indexOf(e)===o).join(" ").trim(),g=r=>{for(const e in r)if(e.startsWith("aria-")||e==="role"||e==="title")return!0};/**
 * @license lucide-react v0.561.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var O={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.561.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=p.forwardRef(({color:r="currentColor",size:e=24,strokeWidth:o=2,absoluteStrokeWidth:s,className:u="",children:a,iconNode:l,...i},t)=>p.createElement("svg",{ref:t,...O,width:e,height:e,stroke:r,strokeWidth:s?Number(o)*24/Number(e):o,className:v("lucide",u),...!a&&!g(i)&&{"aria-hidden":"true"},...i},[...l.map(([f,n])=>p.createElement(f,n)),...Array.isArray(a)?a:[a]]));/**
 * @license lucide-react v0.561.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q=(r,e)=>{const o=p.forwardRef(({className:s,...u},a)=>p.createElement(j,{ref:a,iconNode:e,className:v(`lucide-${b(h(r))}`,`lucide-${r}`,s),...u}));return o.displayName=h(r),o};export{q as c,L as j};
