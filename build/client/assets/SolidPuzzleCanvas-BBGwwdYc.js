import{a as p,p as A}from"./chunk-6KYCQHYJ-CEP6jyJa.js";import{v as at,I as bt,F as Ye,a as We,b as ve,W as St,B as je,S as ct,V as C,c as lt,U as $e,d as Ze,e as ee,M as Et,f as xe,L as Lt,g as _t,h as te,u as ut,C as se,_ as Qe,i as Mt,j as ft,P as At,R as Ot,k as dt,l as He,m as zt,n as Ct,O as Ue,A as Ut,o as Pt,p as Bt,q as Je,r as Tt,s as jt}from"./puzzleConfig-BO0eCQIS.js";import{L as Re,S as ce,P as X,a as Dt,b as Ve}from"./About-DIfI_wgx.js";import{w as Rt}from"./webgl-DOemlGna.js";import"./index-BNqrtbQi.js";import"./index-5sjK1fgx.js";import"./GlowCard-Bt4BD6Dt.js";import"./use-reduced-motion-nioYIeMK.js";import"./index-DC4hA5SV.js";import"./proxy-DNU-zM_x.js";import"./SEO-RCfE156f.js";import"./JsonLd-DB5aMa-r.js";import"./index-By9qz07q.js";import"./x-fLlOYUv4.js";const pt=at>=125?"uv1":"uv2",Ke=new je,Pe=new C;class Fe extends bt{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const t=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],e=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],r=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(r),this.setAttribute("position",new Ye(t,3)),this.setAttribute("uv",new Ye(e,2))}applyMatrix4(t){const e=this.attributes.instanceStart,r=this.attributes.instanceEnd;return e!==void 0&&(e.applyMatrix4(t),r.applyMatrix4(t),e.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));const r=new We(e,6,1);return this.setAttribute("instanceStart",new ve(r,3,0)),this.setAttribute("instanceEnd",new ve(r,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(t,e=3){let r;t instanceof Float32Array?r=t:Array.isArray(t)&&(r=new Float32Array(t));const o=new We(r,e*2,1);return this.setAttribute("instanceColorStart",new ve(o,e,0)),this.setAttribute("instanceColorEnd",new ve(o,e,e)),this}fromWireframeGeometry(t){return this.setPositions(t.attributes.position.array),this}fromEdgesGeometry(t){return this.setPositions(t.attributes.position.array),this}fromMesh(t){return this.fromWireframeGeometry(new St(t.geometry)),this}fromLineSegments(t){const e=t.geometry;return this.setPositions(e.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new je);const t=this.attributes.instanceStart,e=this.attributes.instanceEnd;t!==void 0&&e!==void 0&&(this.boundingBox.setFromBufferAttribute(t),Ke.setFromBufferAttribute(e),this.boundingBox.union(Ke))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ct),this.boundingBox===null&&this.computeBoundingBox();const t=this.attributes.instanceStart,e=this.attributes.instanceEnd;if(t!==void 0&&e!==void 0){const r=this.boundingSphere.center;this.boundingBox.getCenter(r);let o=0;for(let n=0,g=t.count;n<g;n++)Pe.fromBufferAttribute(t,n),o=Math.max(o,r.distanceToSquared(Pe)),Pe.fromBufferAttribute(e,n),o=Math.max(o,r.distanceToSquared(Pe));this.boundingSphere.radius=Math.sqrt(o),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(t){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(t)}}class ht extends Fe{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(t){const e=t.length-3,r=new Float32Array(2*e);for(let o=0;o<e;o+=3)r[2*o]=t[o],r[2*o+1]=t[o+1],r[2*o+2]=t[o+2],r[2*o+3]=t[o+3],r[2*o+4]=t[o+4],r[2*o+5]=t[o+5];return super.setPositions(r),this}setColors(t,e=3){const r=t.length-e,o=new Float32Array(2*r);if(e===3)for(let n=0;n<r;n+=e)o[2*n]=t[n],o[2*n+1]=t[n+1],o[2*n+2]=t[n+2],o[2*n+3]=t[n+3],o[2*n+4]=t[n+4],o[2*n+5]=t[n+5];else for(let n=0;n<r;n+=e)o[2*n]=t[n],o[2*n+1]=t[n+1],o[2*n+2]=t[n+2],o[2*n+3]=t[n+3],o[2*n+4]=t[n+4],o[2*n+5]=t[n+5],o[2*n+6]=t[n+6],o[2*n+7]=t[n+7];return super.setColors(o,e),this}fromLine(t){const e=t.geometry;return this.setPositions(e.attributes.position.array),this}}class ke extends lt{constructor(t){super({type:"LineMaterial",uniforms:$e.clone($e.merge([Ze.common,Ze.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new ee(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${at>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){e===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),e===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(t)}}const Ie=new xe,et=new C,tt=new C,j=new xe,D=new xe,Z=new xe,Ne=new C,Ge=new _t,R=new Lt,nt=new C,Be=new je,Te=new ct,Q=new xe;let K,he;function ot(u,t,e){return Q.set(0,0,-t,1).applyMatrix4(u.projectionMatrix),Q.multiplyScalar(1/Q.w),Q.x=he/e.width,Q.y=he/e.height,Q.applyMatrix4(u.projectionMatrixInverse),Q.multiplyScalar(1/Q.w),Math.abs(Math.max(Q.x,Q.y))}function It(u,t){const e=u.matrixWorld,r=u.geometry,o=r.attributes.instanceStart,n=r.attributes.instanceEnd,g=Math.min(r.instanceCount,o.count);for(let h=0,m=g;h<m;h++){R.start.fromBufferAttribute(o,h),R.end.fromBufferAttribute(n,h),R.applyMatrix4(e);const S=new C,y=new C;K.distanceSqToSegment(R.start,R.end,y,S),y.distanceTo(S)<he*.5&&t.push({point:y,pointOnLine:S,distance:K.origin.distanceTo(y),object:u,face:null,faceIndex:h,uv:null,[pt]:null})}}function Nt(u,t,e){const r=t.projectionMatrix,n=u.material.resolution,g=u.matrixWorld,h=u.geometry,m=h.attributes.instanceStart,S=h.attributes.instanceEnd,y=Math.min(h.instanceCount,m.count),l=-t.near;K.at(1,Z),Z.w=1,Z.applyMatrix4(t.matrixWorldInverse),Z.applyMatrix4(r),Z.multiplyScalar(1/Z.w),Z.x*=n.x/2,Z.y*=n.y/2,Z.z=0,Ne.copy(Z),Ge.multiplyMatrices(t.matrixWorldInverse,g);for(let f=0,E=y;f<E;f++){if(j.fromBufferAttribute(m,f),D.fromBufferAttribute(S,f),j.w=1,D.w=1,j.applyMatrix4(Ge),D.applyMatrix4(Ge),j.z>l&&D.z>l)continue;if(j.z>l){const x=j.z-D.z,b=(j.z-l)/x;j.lerp(D,b)}else if(D.z>l){const x=D.z-j.z,b=(D.z-l)/x;D.lerp(j,b)}j.applyMatrix4(r),D.applyMatrix4(r),j.multiplyScalar(1/j.w),D.multiplyScalar(1/D.w),j.x*=n.x/2,j.y*=n.y/2,D.x*=n.x/2,D.y*=n.y/2,R.start.copy(j),R.start.z=0,R.end.copy(D),R.end.z=0;const O=R.closestPointToPointParameter(Ne,!0);R.at(O,nt);const z=te.lerp(j.z,D.z,O),P=z>=-1&&z<=1,F=Ne.distanceTo(nt)<he*.5;if(P&&F){R.start.fromBufferAttribute(m,f),R.end.fromBufferAttribute(S,f),R.start.applyMatrix4(g),R.end.applyMatrix4(g);const x=new C,b=new C;K.distanceSqToSegment(R.start,R.end,b,x),e.push({point:b,pointOnLine:x,distance:K.origin.distanceTo(b),object:u,face:null,faceIndex:f,uv:null,[pt]:null})}}}class mt extends Et{constructor(t=new Fe,e=new ke({color:Math.random()*16777215})){super(t,e),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const t=this.geometry,e=t.attributes.instanceStart,r=t.attributes.instanceEnd,o=new Float32Array(2*e.count);for(let g=0,h=0,m=e.count;g<m;g++,h+=2)et.fromBufferAttribute(e,g),tt.fromBufferAttribute(r,g),o[h]=h===0?0:o[h-1],o[h+1]=o[h]+et.distanceTo(tt);const n=new We(o,2,1);return t.setAttribute("instanceDistanceStart",new ve(n,1,0)),t.setAttribute("instanceDistanceEnd",new ve(n,1,1)),this}raycast(t,e){const r=this.material.worldUnits,o=t.camera;o===null&&!r&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const n=t.params.Line2!==void 0&&t.params.Line2.threshold||0;K=t.ray;const g=this.matrixWorld,h=this.geometry,m=this.material;he=m.linewidth+n,h.boundingSphere===null&&h.computeBoundingSphere(),Te.copy(h.boundingSphere).applyMatrix4(g);let S;if(r)S=he*.5;else{const l=Math.max(o.near,Te.distanceToPoint(K.origin));S=ot(o,l,m.resolution)}if(Te.radius+=S,K.intersectsSphere(Te)===!1)return;h.boundingBox===null&&h.computeBoundingBox(),Be.copy(h.boundingBox).applyMatrix4(g);let y;if(r)y=he*.5;else{const l=Math.max(o.near,Be.distanceToPoint(K.origin));y=ot(o,l,m.resolution)}Be.expandByScalar(y),K.intersectsBox(Be)!==!1&&(r?It(this,e):Nt(this,o,e))}onBeforeRender(t){const e=this.material.uniforms;e&&e.resolution&&(t.getViewport(Ie),this.material.uniforms.resolution.value.set(Ie.z,Ie.w))}}class Gt extends mt{constructor(t=new ht,e=new ke({color:Math.random()*16777215})){super(t,e),this.isLine2=!0,this.type="Line2"}}const Wt=p.forwardRef(function({points:t,color:e=16777215,vertexColors:r,linewidth:o,lineWidth:n,segments:g,dashed:h,...m},S){var y,l;const f=ut(P=>P.size),E=p.useMemo(()=>g?new mt:new Gt,[g]),[L]=p.useState(()=>new ke),O=(r==null||(y=r[0])==null?void 0:y.length)===4?4:3,z=p.useMemo(()=>{const P=g?new Fe:new ht,F=t.map(x=>{const b=Array.isArray(x);return x instanceof C||x instanceof xe?[x.x,x.y,x.z]:x instanceof ee?[x.x,x.y,0]:b&&x.length===3?[x[0],x[1],x[2]]:b&&x.length===2?[x[0],x[1],0]:x});if(P.setPositions(F.flat()),r){e=16777215;const x=r.map(b=>b instanceof se?b.toArray():b);P.setColors(x.flat(),O)}return P},[t,g,r,O]);return p.useLayoutEffect(()=>{E.computeLineDistances()},[t,E]),p.useLayoutEffect(()=>{h?L.defines.USE_DASH="":delete L.defines.USE_DASH,L.needsUpdate=!0},[h,L]),p.useEffect(()=>()=>{z.dispose(),L.dispose()},[z]),p.createElement("primitive",Qe({object:E,ref:S},m),p.createElement("primitive",{object:z,attach:"geometry"}),p.createElement("primitive",Qe({object:L,attach:"material",color:e,vertexColors:!!r,resolution:[f.width,f.height],linewidth:(l=o??n)!==null&&l!==void 0?l:1,dashed:h,transparent:O===4},m)))}),it=95.3,Ht=7;function Vt(u,t){const e=u.attributes.position,r=u.index,o=r?r.count/3:e.count/3,n=[new C,new C,new C],g=new C,h=new C,m=new C,S=(d,v)=>{const fe=r?r.getX(d):d;return v.fromBufferAttribute(e,fe).applyQuaternion(t)};let y=1/0,l=-1/0,f=1/0,E=-1/0;for(let d=0;d<e.count;d++)n[0].fromBufferAttribute(e,d).applyQuaternion(t),y=Math.min(y,n[0].x),l=Math.max(l,n[0].x),f=Math.min(f,n[0].y),E=Math.max(E,n[0].y);const L=Math.max(1,Math.round((l-y)/it)),O=Math.max(1,Math.round((E-f)/it)),z=(l-y)/L,P=(E-f)/O,F=Array.from({length:L},()=>new Array(O).fill(!1));for(let d=0;d<o;d++){S(d*3,n[0]),S(d*3+1,n[1]),S(d*3+2,n[2]),g.subVectors(n[1],n[0]),h.subVectors(n[2],n[0]),m.crossVectors(g,h);const v=m.length();if(v===0||Math.abs(m.z)/v<.9)continue;const fe=(n[0].x+n[1].x+n[2].x)/3,Ee=(n[0].y+n[1].y+n[2].y)/3,ae=te.clamp(Math.floor((fe-y)/z),0,L-1),ge=te.clamp(Math.floor((Ee-f)/P),0,O-1);F[ae][ge]=!0}const x=(d,v)=>d>=0&&v>=0&&d<L&&v<O&&F[d][v],b=new Map,me=(d,v)=>`${d},${v}`,re=(d,v)=>b.set(me(...d),v);for(let d=0;d<L;d++)for(let v=0;v<O;v++)F[d][v]&&(x(d,v-1)||re([d,v],[d+1,v]),x(d+1,v)||re([d+1,v],[d+1,v+1]),x(d,v+1)||re([d+1,v+1],[d,v+1]),x(d-1,v)||re([d,v+1],[d,v]));const N=[...b.keys()][0].split(",").map(Number),W=[];let ne=N,we=null;do{const d=b.get(me(...ne)),v=`${d[0]-ne[0]},${d[1]-ne[1]}`;v!==we&&W.push(ne),we=v,ne=d}while(me(...ne)!==me(...N));const le=W[0],be=W[W.length-1],Se=W[1];(le[0]-be[0])*(Se[1]-le[1])===(le[1]-be[1])*(Se[0]-le[0])&&W.shift();const oe=W.map(([d,v])=>new ee(y+d*z,f+v*P)),ie=new Mt,Y=oe.length,k=new ee,ue=new ee;return oe.forEach((d,v)=>{const fe=oe[(v+Y-1)%Y],Ee=oe[(v+1)%Y];k.subVectors(fe,d),ue.subVectors(Ee,d);const ae=Math.min(Ht,k.length()/2,ue.length()/2);k.setLength(ae),ue.setLength(ae);const ge=d.x+k.x,ze=d.y+k.y;v===0?ie.moveTo(ge,ze):ie.lineTo(ge,ze),ie.quadraticCurveTo(d.x,d.y,d.x+ue.x,d.y+ue.y)}),ie.closePath(),{shape:ie,outline:ie.getPoints(6),bounds:{minX:y,maxX:l,minY:f,maxY:E},half:[(l-y)/2,(E-f)/2],cells:F.flat().filter(Boolean).length}}const Ft=new se("#c4b5fd"),kt=new se("#f5d0fe"),gt=new se("#a855f7"),qt=new se("#e879f9"),Xt=40,Yt=70,$t=1.15,Zt=95,Qt=.35,st=te.smoothstep,J=te.damp,yt=u=>1+2.9*Math.pow(u-1,3)+1.9*Math.pow(u-1,2);function rt(u){let t=u>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function Jt(){const{scene:u}=He(Ve),t=p.useMemo(()=>{const e=Dt.map(m=>{const S=zt.sanitizeNodeName(m.meshName),y=u.getObjectByName(S);if(!y)throw new Error(`SOLID puzzle model is missing "${m.meshName}"`);const l=Vt(y.geometry,y.quaternion),f=[...l.outline,l.outline[0]].map(E=>new C(E.x,E.y,0));return{...m,geometry:y.geometry,target:y.position.clone(),quaternion:y.quaternion.clone(),baseColor:y.material.color.clone(),roughness:y.material.roughness,silhouette:l,outline:f,fillGeometry:new Ct(l.shape,6)}});let r=1/0,o=-1/0,n=1/0,g=-1/0;e.forEach(m=>{r=Math.min(r,m.target.x+m.silhouette.bounds.minX),o=Math.max(o,m.target.x+m.silhouette.bounds.maxX),n=Math.min(n,m.target.y+m.silhouette.bounds.minY),g=Math.max(g,m.target.y+m.silhouette.bounds.maxY)});const h={cx:(r+o)/2,cy:(n+g)/2,w:o-r,h:g-n,z:e[0].target.z};return{list:e,wall:h}},[u]);return p.useEffect(()=>()=>t.list.forEach(e=>e.fillGeometry.dispose()),[t]),t}const Kt=p.memo(function({part:t,outlineRefs:e}){const r=p.useRef(null),o=p.useRef(null),n=p.useMemo(()=>new Bt({color:gt,transparent:!0,opacity:.07,depthWrite:!1}),[]);p.useEffect(()=>{const S=e.current;return S[t.id]={group:r.current,fill:n,line:o.current},()=>{delete S[t.id],n.dispose()}},[t.id,n,e]);const{x:g,y:h,z:m}=t.target;return A.jsxs("group",{ref:r,position:[g,h,m-Xt],children:[A.jsx("mesh",{geometry:t.fillGeometry,material:n}),A.jsx(Wt,{ref:o,points:t.outline,color:"#c4b5fd",lineWidth:2,dashed:!0,dashSize:11,gapSize:8,transparent:!0,opacity:.5,depthWrite:!1})]})}),en=`
  varying vec2 vLocal;
  void main() {
    vLocal = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,tn=`
  uniform vec2 uHalf;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uWidth;
  varying vec2 vLocal;
  void main() {
    vec2 q = abs(vLocal) - uHalf;
    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
    float x = max(d, 0.0) / uWidth;
    float a = 0.65 * exp(-x * x) + 0.35 * exp(-x * x / 9.0);
    float k = a * uOpacity;
    gl_FragColor = vec4(uColor * k, k); // premultiplied: the canvas is transparent
  }
`;function nn({wall:u,glowRef:t}){const e=p.useMemo(()=>new lt({vertexShader:en,fragmentShader:tn,uniforms:{uHalf:{value:new ee(u.w/2-8,u.h/2-8)},uColor:{value:new se("#e879f9")},uOpacity:{value:0},uWidth:{value:52}},transparent:!0,depthWrite:!1,blending:Pt,blendEquation:Ut,blendSrc:Ue,blendDst:Ue,blendSrcAlpha:Ue,blendDstAlpha:Ue}),[u]);return p.useEffect(()=>()=>e.dispose(),[e]),A.jsx("mesh",{ref:t,material:e,position:[u.cx,u.cy,u.z-Yt],visible:!1,children:A.jsx("planeGeometry",{args:[u.w+700,u.h+700]})})}function on(){const{scene:u}=He(Ve),t=p.useMemo(()=>{const e=u.getObjectByName("Logo_Cube").clone(!0);e.position.set(0,0,0),e.updateMatrixWorld(!0);const r=e.getObjectByName("Cube"),o=r.geometry.clone();o.computeBoundingBox();const{min:n,max:g}=o.boundingBox,h=o.attributes.position,m=new Float32Array(h.count*3),S=new se(Je.top),y=new se(Je.bottom),l=new se;for(let L=0;L<h.count;L++)l.lerpColors(y,S,(h.getY(L)-n.y)/(g.y-n.y)),m.set([l.r,l.g,l.b],L*3);o.setAttribute("color",new Tt(m,3));const f=new ft({vertexColors:!0,roughness:.5});r.geometry=o,r.material=f;const E=new je().setFromObject(e).getCenter(new C);return e.position.copy(E).multiplyScalar(-1),{root:e,geometry:o,material:f}},[u]);return p.useEffect(()=>()=>{t.geometry.dispose(),t.material.dispose()},[t]),t}function sn({slot:u,open:t,reducedMotion:e,onSelect:r}){const o=on(),n=p.useRef(null),g=p.useRef(null),h=p.useRef(0),m=p.useRef(.6);return dt((S,y)=>{const l=n.current;if(!l)return;const f=Math.min(y,.05),E=t?1:0;h.current=e?E:te.clamp(h.current+Math.sign(E-h.current)*(f/Qt),0,1);const L=h.current;if(l.visible=L>.001,!l.visible)return;const O=t?yt(L):L*L;l.scale.setScalar(Math.max(.001,O)*$t),e||(m.current+=f*.9),g.current.rotation.set(.35,m.current,0);const z=e?0:Math.sin(S.clock.elapsedTime*1.6)*3;l.position.set(u.x,u.y+z,u.z+Zt*L),(!e||L>0&&L<1)&&S.invalidate()}),A.jsx("group",{ref:n,visible:!1,onClick:S=>{S.stopPropagation(),r==null||r()},children:A.jsx("group",{ref:g,children:A.jsx("primitive",{object:o.root})})})}function rn({layout:u,seed:t,activeId:e,reducedMotion:r,onPlace:o,onSelect:n,onReady:g,onDragChange:h,onStageChange:m,placedIds:S,commandsRef:y}){const{list:l,wall:f}=Jt(),{camera:E,gl:L,size:O,invalidate:z}=ut(),P=p.useRef({});P.current={onPlace:o,onSelect:n,onDragChange:h,activeId:e,reducedMotion:r};const F=S.join(","),{homes:x,box:b}=p.useMemo(()=>{const s=rt(t),a=X.jitter[u],c={};if(u==="wide"){const M=Re.wide,q=M.arrangements[Math.floor(s()*M.arrangements.length)];l.forEach($=>{const[Ae,Ce]=q[$.id];c[$.id]=new C(f.cx+Ae+(s()*2-1)*a,f.cy+Ce+(s()*2-1)*a,f.z)});const V=M.box;return{homes:c,box:{cx:f.cx+V.ox,cy:f.cy+V.oy,w:V.w,h:V.h}}}const _=Re.tall.tray,w=l.map(M=>M.id);for(let M=w.length-1;M>0;M--){const q=Math.floor(s()*(M+1));[w[M],w[q]]=[w[q],w[M]]}const B=Object.fromEntries(w.map(M=>[M,[(s()*2-1)*a,(s()*2-1)*a]])),G=new Set(F?F.split(","):[]),I=Object.fromEntries(l.map(M=>[M.id,M])),T=[];let H=null;w.filter(M=>!G.has(M)).forEach(M=>{const[q,V]=I[M].silhouette.half,$=q*2;(!H||H.w+_.gap+$>_.width)&&(H={items:[],w:-30,h:0},T.push(H)),H.items.push({id:M,w:$}),H.w+=_.gap+$,H.h=Math.max(H.h,V*2)});const Le=f.cy+f.h/2,ye=f.cy-f.h/2;let U=ye-_.wallGap;T.forEach(M=>{let q=f.cx-M.w/2;M.items.forEach(V=>{const[$,Ae]=B[V.id];c[V.id]=new C(q+V.w/2+$,U-M.h/2+Ae,f.z),q+=V.w+_.gap}),U-=M.h+_.rowGap}),l.forEach(M=>{c[M.id]||(c[M.id]=M.target.clone())});const i=Le+_.topPad,_e=T.length?U+_.rowGap-_.bottomPad:ye-_.topPad,Me=i-_e;return{homes:c,box:{cx:f.cx,cy:i-Me/2,w:Re.tall.box.w,h:Me,top:i}}},[l,f,u,t,F]);p.useEffect(()=>{u==="tall"?(E.zoom=O.width/b.w,E.position.y=b.top-O.height/2/E.zoom):(E.zoom=Math.min(O.width/b.w,O.height/b.h),E.position.y=b.cy),E.position.x=b.cx,E.position.z=ce.cameraZ,E.updateProjectionMatrix(),z()},[E,O,b,u,z]),p.useEffect(()=>{m==null||m(u==="tall"?b.h:null)},[m,u,b.h]);const me=p.useMemo(()=>{const s=rt(t^2654435769);return Object.fromEntries(l.map(a=>[a.id,s()*Math.PI*2]))},[l,t]),re=p.useRef(null);re.current===null&&(re.current=Object.fromEntries(l.map(s=>[s.id,{phase:S.includes(s.id)?"placed":"floating",pos:S.includes(s.id)?s.target.clone():x[s.id].clone(),home:x[s.id].clone(),dragTarget:new ee,grab:new ee,from:new ee,snapT:0,floatAmt:1,lift:0,flash:0,glow:0,near:0,outlineVis:1,hover:!1,placedAt:0}])));const N=re.current,W=p.useRef({}),ne=p.useRef({}),we=p.useRef(null),le=p.useRef(null),be=p.useRef(S.length),Se=p.useRef(0),De=p.useRef(null);p.useEffect(()=>{const s=De.current!==u||P.current.reducedMotion;De.current=u,l.forEach(a=>{const c=N[a.id],_=c.home.distanceTo(x[a.id])>.5;c.home.copy(x[a.id]),!(c.phase!=="floating"&&c.phase!=="returning")&&(s?c.pos.copy(c.home):_&&(c.phase="returning"))}),z()},[x,u,l,N,z]);const oe=p.useMemo(()=>Object.fromEntries(l.map(s=>[s.id,new ft({color:s.baseColor,roughness:s.roughness,metalness:0})])),[l]);p.useEffect(()=>()=>Object.values(oe).forEach(s=>s.dispose()),[oe]),p.useEffect(()=>{g==null||g()},[g]),p.useEffect(()=>()=>{L.domElement.style.cursor=""},[L]);const ie=p.useMemo(()=>new At(new C(0,0,1),-f.z),[f]),Y=p.useMemo(()=>new C,[]),k=s=>{L.domElement.style.cursor=s},ue=s=>s.silhouette.half,d=(s,a,c)=>{const[_,w]=ue(s),B=X.edgeMargin;return[te.clamp(a,b.cx-b.w/2+_+B,b.cx+b.w/2-_-B),te.clamp(c,b.cy-b.h/2+w+B,b.cy+b.h/2-w-B)]},v=s=>{var _,w;const a=N[s.id];if(a.phase==="placed"||a.phase==="snapping")return;const c=W.current[s.id];a.from.set(c.position.x,c.position.y),a.pos.set(a.from.x,a.from.y,f.z),a.floatAmt=0,a.near=1,a.flash=1,a.placedAt=performance.now(),be.current+=1,P.current.reducedMotion?(a.pos.copy(s.target),a.phase="placed"):(a.phase="snapping",a.snapT=0),k(""),(w=(_=P.current).onPlace)==null||w.call(_,s.id),z()};p.useEffect(()=>{if(y)return y.current={place:s=>{const a=l.find(c=>c.id===s);a&&v(a)}},()=>{y.current=null}},[y,l]);const fe=(s,a)=>{var w,B,G,I;const c=N[a.id];if(c.phase!=="floating"&&c.phase!=="returning"||s.pointerType==="mouse"&&s.button!==0||(s.stopPropagation(),!s.ray.intersectPlane(ie,Y)))return;(B=(w=s.target).setPointerCapture)==null||B.call(w,s.pointerId);const _=W.current[a.id];c.pos.set(_.position.x,_.position.y,f.z),c.floatAmt=0,c.grab.set(Y.x-c.pos.x,Y.y-c.pos.y),c.dragTarget.set(c.pos.x,c.pos.y),c.phase="dragging",k("grabbing"),(I=(G=P.current).onDragChange)==null||I.call(G,!0),z()},Ee=(s,a)=>{const c=N[a.id];if(c.phase!=="dragging"||!s.ray.intersectPlane(ie,Y))return;const[_,w]=d(a,Y.x-c.grab.x,Y.y-c.grab.y);c.dragTarget.set(_,w),z()},ae=(s,a)=>{var w,B,G,I;const c=N[a.id];if(c.phase!=="dragging")return;(B=(w=s.target).releasePointerCapture)==null||B.call(w,s.pointerId),(I=(G=P.current).onDragChange)==null||I.call(G,!1),Math.hypot(c.dragTarget.x-a.target.x,c.dragTarget.y-a.target.y)<=X.snapRadius?v(a):(c.phase="returning",P.current.reducedMotion&&c.pos.copy(c.home),k(c.hover?"grab":""),z())},ge=(s,a)=>{var _,w;const c=N[a.id];c.phase!=="placed"&&c.phase!=="snapping"||(s.stopPropagation(),!(performance.now()-c.placedAt<450)&&((w=(_=P.current).onSelect)==null||w.call(_,a.id)))},ze=s=>{const a=N[s.id];a.hover=!0,a.phase==="placed"||a.phase==="snapping"?k("pointer"):a.phase!=="dragging"&&k("grab"),z()},vt=s=>{const a=N[s.id];a.hover=!1,a.phase!=="dragging"&&k(""),z()};return p.useEffect(()=>{const s=L.domElement,a=new Ot,c=new ee,_=w=>{if(w.touches.length!==1)return;const B=w.touches[0],G=s.getBoundingClientRect();c.set((B.clientX-G.left)/G.width*2-1,-((B.clientY-G.top)/G.height)*2+1),a.setFromCamera(c,E);const I=l.filter(T=>["floating","returning","dragging"].includes(N[T.id].phase)).map(T=>W.current[T.id]).filter(Boolean);a.intersectObjects(I,!0).length>0&&w.cancelable&&w.preventDefault()};return s.addEventListener("touchstart",_,{passive:!1}),()=>s.removeEventListener("touchstart",_)},[L,E,l,N]),dt((s,a)=>{const c=Math.min(a,.05),_=s.clock.elapsedTime,{reducedMotion:w,activeId:B}=P.current,G=l.length,I=be.current===G;let T=!1;I&&(Se.current+=c);const H=Se.current;l.forEach(U=>{const i=N[U.id],_e=W.current[U.id];if(!_e)return;switch(i.phase){case"floating":i.floatAmt=J(i.floatAmt,w?0:1,3,c);break;case"dragging":i.floatAmt=0,i.pos.x=J(i.pos.x,i.dragTarget.x,30,c),i.pos.y=J(i.pos.y,i.dragTarget.y,30,c),T=!0;break;case"returning":i.floatAmt=J(i.floatAmt,w?0:1,3,c),i.pos.x=J(i.pos.x,i.home.x,7,c),i.pos.y=J(i.pos.y,i.home.y,7,c),Math.hypot(i.pos.x-i.home.x,i.pos.y-i.home.y)<.5&&(i.pos.copy(i.home),i.phase="floating"),T=!0;break;case"snapping":{i.snapT=Math.min(1,i.snapT+c/X.snapSeconds);const pe=yt(i.snapT);i.pos.x=te.lerp(i.from.x,U.target.x,pe),i.pos.y=te.lerp(i.from.y,U.target.y,pe),i.snapT>=1&&(i.pos.copy(U.target),i.phase="placed"),T=!0;break}}const Me=X.floatAmplitude*i.floatAmt,M=me[U.id],q=Math.sin(_*X.floatSpeed*.7+M*1.7)*Me*.4,V=Math.sin(_*X.floatSpeed+M)*Me;i.lift=J(i.lift,i.phase==="dragging"?1:0,14,c);const $=i.lift*X.liftZ;_e.position.set(i.pos.x+q,i.pos.y+V,f.z+$);const Ae=i.phase==="snapping"?.07*Math.sin(Math.PI*i.snapT):0;_e.scale.setScalar(1+i.lift*(X.dragScale-1)+Ae);const Ce=i.phase==="placed"||i.phase==="snapping",qe=(B===U.id?.16:0)+(i.hover&&Ce?.1:0);i.glow=J(i.glow,qe,10,c),i.flash=Math.max(0,i.flash-c/.7);let Xe=0;if(I&&!w){const pe=(U.target.x-(f.cx-f.w/2))/f.w*.7;Xe=Math.max(0,1-Math.abs(H-pe-.35)/.35)*.55}const xt=i.glow+i.flash*.75+Xe;oe[U.id].emissive.copy(U.baseColor).multiplyScalar(xt);const de=ne.current[U.id];if(de&&de.line){let pe=0;if(i.phase==="dragging"){const wt=Math.hypot(i.dragTarget.x-U.target.x,i.dragTarget.y-U.target.y);pe=1-st(wt,X.snapRadius,X.highlightRadius)}i.near=J(i.near,pe,12,c),i.outlineVis=J(i.outlineVis,Ce?0:1,8,c);const Oe=i.outlineVis;de.fill.opacity=(.07+i.near*.26)*Oe,de.fill.color.lerpColors(gt,qt,i.near),de.line.material.opacity=(.5+i.near*.5)*Oe,de.line.material.color.lerpColors(Ft,kt,i.near),de.group.visible=Oe>.01,Oe>.01&&Oe<.99&&(T=!0),i.near>.01&&i.near<.99&&(T=!0)}(i.lift>.002||i.flash>0||Math.abs(i.glow-qe)>.002)&&(T=!0),i.floatAmt>.001&&!w&&(T=!0)});const Le=we.current;if(Le){const i=1+(I&&!w?Math.sin(Math.PI*Math.min(1,H/1.2))*.018:0);Le.scale.set(i,i,1),Le.position.set(f.cx*(1-i),f.cy*(1-i),0)}const ye=le.current;if(ye){const U=I?w?1:st(H,0,1.2):0,i=I&&!w?.1*Math.sin(_*1.4):0;ye.visible=U>.001,ye.material.uniforms.uOpacity.value=U*(.5+i),I&&(!w||H<.1)&&(T=!0)}T&&s.invalidate()}),A.jsxs(A.Fragment,{children:[A.jsx("hemisphereLight",{args:[ce.hemisphere.color,ce.hemisphere.color,ce.hemisphere.intensity]}),A.jsx("directionalLight",{color:ce.directional.color,intensity:ce.directional.intensity,position:ce.directional.position}),A.jsxs("group",{ref:we,children:[A.jsx(nn,{wall:f,glowRef:le}),A.jsx(sn,{slot:l.find(s=>s.id==="logo").target,open:e==="logo",reducedMotion:r,onSelect:()=>n==null?void 0:n("logo")}),l.map(s=>A.jsx(Kt,{part:s,outlineRefs:ne},s.id)),l.map(s=>A.jsxs("group",{ref:a=>{W.current[s.id]=a},position:x[s.id],onPointerDown:a=>fe(a,s),onPointerMove:a=>Ee(a,s),onPointerUp:a=>ae(a,s),onPointerCancel:a=>ae(a,s),onLostPointerCapture:a=>ae(a,s),onClick:a=>ge(a,s),onPointerOver:()=>ze(s),onPointerOut:()=>vt(s),children:[A.jsx("group",{quaternion:s.quaternion,children:A.jsx("mesh",{geometry:s.geometry,material:oe[s.id]})}),A.jsx("mesh",{geometry:s.fillGeometry,visible:!1})]},s.id))]})]})}He.preload(Ve);function bn({active:u,reducedMotion:t,layout:e,attempt:r,seed:o,activeId:n,onPlace:g,onSelect:h,onReady:m,onDragChange:S,onStageChange:y,placedIds:l,commandsRef:f,onContextLost:E}){const L=u?t?"demand":"always":"never";return A.jsx(jt,{orthographic:!0,camera:{position:[0,0,ce.cameraZ],zoom:1,near:-1e5,far:1e5},frameloop:L,dpr:[1,1.75],flat:!0,gl:{antialias:!0,alpha:!0},style:{touchAction:"pan-y"},onCreated:({gl:O})=>{E&&Rt(O.domElement,E)},children:A.jsx(p.Suspense,{fallback:null,children:A.jsx(rn,{layout:e,seed:o,activeId:n,reducedMotion:t,onPlace:g,onSelect:h,onReady:m,onDragChange:S,onStageChange:y,placedIds:l,commandsRef:f},r)})})}export{bn as default};
