import{a as n,p as i}from"./chunk-6KYCQHYJ-CEP6jyJa.js";/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),f=t=>t.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,a,r)=>r?r.toUpperCase():a.toLowerCase()),d=t=>{const e=f(t);return e.charAt(0).toUpperCase()+e.slice(1)},u=(...t)=>t.filter((e,a,r)=>!!e&&e.trim()!==""&&r.indexOf(e)===a).join(" ").trim(),h=t=>{for(const e in t)if(e.startsWith("aria-")||e==="role"||e==="title")return!0};/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var b={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=n.forwardRef(({color:t="currentColor",size:e=24,strokeWidth:a=2,absoluteStrokeWidth:r,className:s="",children:o,iconNode:c,...l},p)=>n.createElement("svg",{ref:p,...b,width:e,height:e,stroke:t,strokeWidth:r?Number(a)*24/Number(e):a,className:u("lucide",s),...!o&&!h(l)&&{"aria-hidden":"true"},...l},[...c.map(([m,g])=>n.createElement(m,g)),...Array.isArray(o)?o:[o]]));/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=(t,e)=>{const a=n.forwardRef(({className:r,...s},o)=>n.createElement(y,{ref:o,iconNode:e,className:u(`lucide-${x(d(t))}`,`lucide-${t}`,r),...s}));return a.displayName=d(t),a};function C({children:t,className:e="",...a}){return i.jsxs("div",{className:`group relative bg-white/5 md:bg-white/5 bg-gradient-to-br from-accent-purple/10 to-accent-fuchsia/10 backdrop-blur-sm rounded-2xl border border-accent-fuchsia-dark/30 md:border-accent-purple-dark/30 hover:border-accent-fuchsia-dark/50 transition-all duration-300 overflow-hidden shadow-lg shadow-fuchsia-500/10 md:shadow-none ${e}`,onMouseMove:r=>{const s=r.currentTarget.getBoundingClientRect(),o=r.clientX-s.left,c=r.clientY-s.top;r.currentTarget.style.setProperty("--mouse-x",`${o}px`),r.currentTarget.style.setProperty("--mouse-y",`${c}px`)},style:{"--mouse-x":"0px","--mouse-y":"0px"},...a,children:[i.jsx("div",{className:"pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",style:{background:"radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(217, 70, 239, 0.15), transparent 40%)"}}),i.jsx("div",{className:"pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",style:{background:"radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(217, 70, 239, 0.4), transparent 40%)",mask:"linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",maskComposite:"exclude",padding:"1px"}}),i.jsx("div",{className:"relative z-10",children:t})]})}export{C as G,w as c};
