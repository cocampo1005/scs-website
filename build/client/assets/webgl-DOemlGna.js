var g=Object.defineProperty;var y=(t,r,e)=>r in t?g(t,r,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[r]=e;var f=(t,r,e)=>y(t,typeof r!="symbol"?r+"":r,e);import{c as b}from"./GlowCard-Bt4BD6Dt.js";import{p as o,a as w}from"./chunk-6KYCQHYJ-CEP6jyJa.js";/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2",key:"1ah6g2"}],["rect",{x:"14",y:"2",width:"8",height:"8",rx:"1",key:"88lufb"}]],_=b("blocks",k);/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]],P=b("sparkles",E),j="modulepreload",C=function(t){return"/"+t},h={},$=function(r,e,c){let d=Promise.resolve();if(e&&e.length>0){let i=function(s){return Promise.all(s.map(l=>Promise.resolve(l).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),m=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));d=i(e.map(s=>{if(s=C(s),s in h)return;h[s]=!0;const l=s.endsWith(".css"),u=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${s}"]${u}`))return;const n=document.createElement("link");if(n.rel=l?"stylesheet":j,l||(n.as="script"),n.crossOrigin="",n.href=s,m&&n.setAttribute("nonce",m),document.head.appendChild(n),l)return new Promise((v,x)=>{n.addEventListener("load",v),n.addEventListener("error",()=>x(new Error(`Unable to preload CSS for ${s}`)))})}))}function p(i){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=i,window.dispatchEvent(a),!a.defaultPrevented)throw i}return d.then(i=>{for(const a of i||[])a.status==="rejected"&&p(a.reason);return r().catch(p)})};function B({ready:t=!1,size:r=80,label:e="Loading 3D Scene..."}){return o.jsxs("div",{className:`absolute inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${t?"opacity-0 pointer-events-none":"opacity-100"}`,role:"status","aria-busy":!t,"aria-live":"polite",children:[o.jsxs("div",{className:"cube-loader",style:{"--s":`${r}px`,"--from":"hsl(292, 91%, 53%)","--to":"hsl(271, 81%, 56%)","--glow":"rgba(217,70,239,0.8)"},children:[o.jsx("div",{className:"cube-top"}),o.jsxs("div",{className:"cube-wrapper",children:[o.jsx("span",{style:{"--i":0},className:"cube-span"}),o.jsx("span",{style:{"--i":1},className:"cube-span"}),o.jsx("span",{style:{"--i":2},className:"cube-span"}),o.jsx("span",{style:{"--i":3},className:"cube-span"})]})]}),o.jsx("span",{className:"mt-20 text-sm md:text-base text-gray-300",children:e}),o.jsx("style",{children:`
        .cube-loader {
          position: relative;
          width: var(--s);
          height: var(--s);
          transform-style: preserve-3d;
          transform: rotateX(-30deg);
          animation: cube-rotate 3s linear infinite;
        }

        @keyframes cube-rotate {
          0% { transform: rotateX(-30deg) rotateY(0deg); }
          100% { transform: rotateX(-30deg) rotateY(360deg); }
        }

        .cube-wrapper {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
        }

        .cube-span {
          position: absolute;
          inset: 0;
          transform: rotateY(calc(90deg * var(--i))) translateZ(calc(var(--s) / 2));
          background: linear-gradient(
            to bottom,
            color-mix(in oklab, var(--from), white 10%) 0%,
            var(--from) 25%,
            var(--to) 100%
          );
          border: 1px solid rgba(255,255,255,0.06);
        }

        .cube-top {
          position: absolute;
          width: var(--s);
          height: var(--s);
          background: linear-gradient(
            to bottom,
            color-mix(in oklab, var(--from), white 10%) 0%,
            var(--from) 25%,
            var(--to) 100%
          );
          transform: rotateX(90deg) translateZ(calc(var(--s) / 2));
          transform-style: preserve-3d;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .cube-top::before {
          content: "";
          position: absolute;
          width: var(--s);
          height: var(--s);
          transform: translateZ(calc(var(--s) * -1.2));
          filter: blur(12px);
          background: transparent;
          box-shadow:
            0 0 12px rgba(50,50,50,0.5),
            0 0 22px var(--glow),
            0 0 36px rgba(50,50,50,0.4),
            0 0 44px var(--glow);
        }

        @media (prefers-reduced-motion: reduce) {
          .cube-loader { animation: none; }
        }
      `})]})}class D extends w.Component{constructor(){super(...arguments);f(this,"state",{failed:!1})}static getDerivedStateFromError(){return{failed:!0}}componentDidCatch(e){var c,d;(d=(c=this.props).onError)==null||d.call(c,e)}render(){return this.state.failed?this.props.fallback:this.props.children}}function X(){var t;if(typeof document>"u")return!1;try{const r=document.createElement("canvas"),e=r.getContext("webgl2")||r.getContext("webgl");return(t=e==null?void 0:e.getExtension("WEBGL_lose_context"))==null||t.loseContext(),!!e}catch{return!1}}function q(t,r){const e=c=>{c.preventDefault(),r()};return t.addEventListener("webglcontextlost",e),()=>t.removeEventListener("webglcontextlost",e)}export{_ as B,B as C,P as S,$ as _,D as a,X as h,q as w};
