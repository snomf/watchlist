(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(s){if(s.ep)return;s.ep=!0;const o=e(s);fetch(s.href,o)}})();const hh=()=>{};var ra={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ac=function(n){const t=[];let e=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?t[e++]=s:s<2048?(t[e++]=s>>6|192,t[e++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),t[e++]=s>>18|240,t[e++]=s>>12&63|128,t[e++]=s>>6&63|128,t[e++]=s&63|128):(t[e++]=s>>12|224,t[e++]=s>>6&63|128,t[e++]=s&63|128)}return t},dh=function(n){const t=[];let e=0,r=0;for(;e<n.length;){const s=n[e++];if(s<128)t[r++]=String.fromCharCode(s);else if(s>191&&s<224){const o=n[e++];t[r++]=String.fromCharCode((s&31)<<6|o&63)}else if(s>239&&s<365){const o=n[e++],a=n[e++],u=n[e++],h=((s&7)<<18|(o&63)<<12|(a&63)<<6|u&63)-65536;t[r++]=String.fromCharCode(55296+(h>>10)),t[r++]=String.fromCharCode(56320+(h&1023))}else{const o=n[e++],a=n[e++];t[r++]=String.fromCharCode((s&15)<<12|(o&63)<<6|a&63)}}return t.join("")},pi={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,t){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const e=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){const o=n[s],a=s+1<n.length,u=a?n[s+1]:0,h=s+2<n.length,d=h?n[s+2]:0,g=o>>2,v=(o&3)<<4|u>>4;let A=(u&15)<<2|d>>6,C=d&63;h||(C=64,a||(A=64)),r.push(e[g],e[v],e[A],e[C])}return r.join("")},encodeString(n,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(n):this.encodeByteArray(Ac(n),t)},decodeString(n,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(n):dh(this.decodeStringToByteArray(n,t))},decodeStringToByteArray(n,t){this.init_();const e=t?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){const o=e[n.charAt(s++)],u=s<n.length?e[n.charAt(s)]:0;++s;const d=s<n.length?e[n.charAt(s)]:64;++s;const v=s<n.length?e[n.charAt(s)]:64;if(++s,o==null||u==null||d==null||v==null)throw new fh;const A=o<<2|u>>4;if(r.push(A),d!==64){const C=u<<4&240|d>>2;if(r.push(C),v!==64){const V=d<<6&192|v;r.push(V)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class fh extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const ph=function(n){const t=Ac(n);return pi.encodeByteArray(t,!0)},wr=function(n){return ph(n).replace(/\./g,"")},mh=function(n){try{return pi.decodeString(n,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rc(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gh=()=>Rc().__FIREBASE_DEFAULTS__,_h=()=>{if(typeof process>"u"||typeof ra>"u")return;const n=ra.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},yh=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const t=n&&mh(n[1]);return t&&JSON.parse(t)},Ur=()=>{try{return hh()||gh()||_h()||yh()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Eh=n=>Ur()?.emulatorHosts?.[n],Th=n=>{const t=Eh(n);if(!t)return;const e=t.lastIndexOf(":");if(e<=0||e+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);const r=parseInt(t.substring(e+1),10);return t[0]==="["?[t.substring(1,e-1),r]:[t.substring(0,e),r]},Sc=()=>Ur()?.config,R_=n=>Ur()?.[`_${n}`];/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cn{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,e)=>{this.resolve=t,this.reject=e})}wrapCallback(t){return(e,r)=>{e?this.reject(e):this.resolve(r),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(e):t(e,r))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mi(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function vh(n){return(await fetch(n,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ih(n,t){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const e={alg:"none",type:"JWT"},r=t||"demo-project",s=n.iat||0,o=n.sub||n.user_id;if(!o)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a={iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:o,user_id:o,firebase:{sign_in_provider:"custom",identities:{}},...n};return[wr(JSON.stringify(e)),wr(JSON.stringify(a)),""].join(".")}const vn={};function wh(){const n={prod:[],emulator:[]};for(const t of Object.keys(vn))vn[t]?n.emulator.push(t):n.prod.push(t);return n}function Ah(n){let t=document.getElementById(n),e=!1;return t||(t=document.createElement("div"),t.setAttribute("id",n),e=!0),{created:e,element:t}}let sa=!1;function Rh(n,t){if(typeof window>"u"||typeof document>"u"||!mi(window.location.host)||vn[n]===t||vn[n]||sa)return;vn[n]=t;function e(A){return`__firebase__banner__${A}`}const r="__firebase__banner",o=wh().prod.length>0;function a(){const A=document.getElementById(r);A&&A.remove()}function u(A){A.style.display="flex",A.style.background="#7faaf0",A.style.position="fixed",A.style.bottom="5px",A.style.left="5px",A.style.padding=".5em",A.style.borderRadius="5px",A.style.alignItems="center"}function h(A,C){A.setAttribute("width","24"),A.setAttribute("id",C),A.setAttribute("height","24"),A.setAttribute("viewBox","0 0 24 24"),A.setAttribute("fill","none"),A.style.marginLeft="-6px"}function d(){const A=document.createElement("span");return A.style.cursor="pointer",A.style.marginLeft="16px",A.style.fontSize="24px",A.innerHTML=" &times;",A.onclick=()=>{sa=!0,a()},A}function g(A,C){A.setAttribute("id",C),A.innerText="Learn more",A.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",A.setAttribute("target","__blank"),A.style.paddingLeft="5px",A.style.textDecoration="underline"}function v(){const A=Ah(r),C=e("text"),V=document.getElementById(C)||document.createElement("span"),O=e("learnmore"),k=document.getElementById(O)||document.createElement("a"),W=e("preprendIcon"),$=document.getElementById(W)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(A.created){const q=A.element;u(q),g(k,O);const lt=d();h($,W),q.append($,V,k,lt),document.body.appendChild(q)}o?(V.innerText="Preview backend disconnected.",$.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):($.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,V.innerText="Preview backend running in this workspace."),V.setAttribute("id",C)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",v):v()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gi(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function S_(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(gi())}function Sh(){const n=Ur()?.forceEnvironment;if(n==="node")return!0;if(n==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function C_(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function b_(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function P_(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function V_(){const n=gi();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Ch(){return!Sh()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function _i(){try{return typeof indexedDB=="object"}catch{return!1}}function bh(){return new Promise((n,t)=>{try{let e=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),e||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{e=!1},s.onerror=()=>{t(s.error?.message||"")}}catch(e){t(e)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ph="FirebaseError";class Se extends Error{constructor(t,e,r){super(e),this.code=t,this.customData=r,this.name=Ph,Object.setPrototypeOf(this,Se.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,yi.prototype.create)}}class yi{constructor(t,e,r){this.service=t,this.serviceName=e,this.errors=r}create(t,...e){const r=e[0]||{},s=`${this.service}/${t}`,o=this.errors[t],a=o?Vh(o,r):"Error",u=`${this.serviceName}: ${a} (${s}).`;return new Se(s,u,r)}}function Vh(n,t){return n.replace(kh,(e,r)=>{const s=t[r];return s!=null?String(s):`<${r}?>`})}const kh=/\{\$([^}]+)}/g;function k_(n){for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t))return!1;return!0}function Ar(n,t){if(n===t)return!0;const e=Object.keys(n),r=Object.keys(t);for(const s of e){if(!r.includes(s))return!1;const o=n[s],a=t[s];if(ia(o)&&ia(a)){if(!Ar(o,a))return!1}else if(o!==a)return!1}for(const s of r)if(!e.includes(s))return!1;return!0}function ia(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function D_(n){const t=[];for(const[e,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{t.push(encodeURIComponent(e)+"="+encodeURIComponent(s))}):t.push(encodeURIComponent(e)+"="+encodeURIComponent(r));return t.length?"&"+t.join("&"):""}function N_(n,t){const e=new Dh(n,t);return e.subscribe.bind(e)}class Dh{constructor(t,e){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=e,this.task.then(()=>{t(this)}).catch(r=>{this.error(r)})}next(t){this.forEachObserver(e=>{e.next(t)})}error(t){this.forEachObserver(e=>{e.error(t)}),this.close(t)}complete(){this.forEachObserver(t=>{t.complete()}),this.close()}subscribe(t,e,r){let s;if(t===void 0&&e===void 0&&r===void 0)throw new Error("Missing Observer.");Nh(t,["next","error","complete"])?s=t:s={next:t,error:e,complete:r},s.next===void 0&&(s.next=Ps),s.error===void 0&&(s.error=Ps),s.complete===void 0&&(s.complete=Ps);const o=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),o}unsubscribeOne(t){this.observers===void 0||this.observers[t]===void 0||(delete this.observers[t],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(t){if(!this.finalized)for(let e=0;e<this.observers.length;e++)this.sendOne(e,t)}sendOne(t,e){this.task.then(()=>{if(this.observers!==void 0&&this.observers[t]!==void 0)try{e(this.observers[t])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(t){this.finalized||(this.finalized=!0,t!==void 0&&(this.finalError=t),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Nh(n,t){if(typeof n!="object"||n===null)return!1;for(const e of t)if(e in n&&typeof n[e]=="function")return!0;return!1}function Ps(){}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Oh=1e3,Mh=2,xh=14400*1e3,Lh=.5;function Fh(n,t=Oh,e=Mh){const r=t*Math.pow(e,n),s=Math.round(Lh*r*(Math.random()-.5)*2);return Math.min(xh,r+s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ie(n){return n&&n._delegate?n._delegate:n}class ce{constructor(t,e,r){this.name=t,this.instanceFactory=e,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ee="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uh{constructor(t,e){this.name=t,this.container=e,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){const e=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(e)){const r=new Cn;if(this.instancesDeferred.set(e,r),this.isInitialized(e)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:e});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(e).promise}getImmediate(t){const e=this.normalizeInstanceIdentifier(t?.identifier),r=t?.optional??!1;if(this.isInitialized(e)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:e})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if($h(t))try{this.getOrInitializeService({instanceIdentifier:Ee})}catch{}for(const[e,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(e);try{const o=this.getOrInitializeService({instanceIdentifier:s});r.resolve(o)}catch{}}}}clearInstance(t=Ee){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){const t=Array.from(this.instances.values());await Promise.all([...t.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...t.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=Ee){return this.instances.has(t)}getOptions(t=Ee){return this.instancesOptions.get(t)||{}}initialize(t={}){const{options:e={}}=t,r=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:e});for(const[o,a]of this.instancesDeferred.entries()){const u=this.normalizeInstanceIdentifier(o);r===u&&a.resolve(s)}return s}onInit(t,e){const r=this.normalizeInstanceIdentifier(e),s=this.onInitCallbacks.get(r)??new Set;s.add(t),this.onInitCallbacks.set(r,s);const o=this.instances.get(r);return o&&t(o,r),()=>{s.delete(t)}}invokeOnInitCallbacks(t,e){const r=this.onInitCallbacks.get(e);if(r)for(const s of r)try{s(t,e)}catch{}}getOrInitializeService({instanceIdentifier:t,options:e={}}){let r=this.instances.get(t);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Bh(t),options:e}),this.instances.set(t,r),this.instancesOptions.set(t,e),this.invokeOnInitCallbacks(r,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,r)}catch{}return r||null}normalizeInstanceIdentifier(t=Ee){return this.component?this.component.multipleInstances?t:Ee:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Bh(n){return n===Ee?void 0:n}function $h(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jh{constructor(t){this.name=t,this.providers=new Map}addComponent(t){const e=this.getProvider(t.name);if(e.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);e.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);const e=new Uh(t,this);return this.providers.set(t,e),e}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var G;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(G||(G={}));const qh={debug:G.DEBUG,verbose:G.VERBOSE,info:G.INFO,warn:G.WARN,error:G.ERROR,silent:G.SILENT},zh=G.INFO,Gh={[G.DEBUG]:"log",[G.VERBOSE]:"log",[G.INFO]:"info",[G.WARN]:"warn",[G.ERROR]:"error"},Hh=(n,t,...e)=>{if(t<n.logLevel)return;const r=new Date().toISOString(),s=Gh[t];if(s)console[s](`[${r}]  ${n.name}:`,...e);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class Br{constructor(t){this.name=t,this._logLevel=zh,this._logHandler=Hh,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in G))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?qh[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,G.DEBUG,...t),this._logHandler(this,G.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,G.VERBOSE,...t),this._logHandler(this,G.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,G.INFO,...t),this._logHandler(this,G.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,G.WARN,...t),this._logHandler(this,G.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,G.ERROR,...t),this._logHandler(this,G.ERROR,...t)}}const Kh=(n,t)=>t.some(e=>n instanceof e);let oa,aa;function Wh(){return oa||(oa=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Qh(){return aa||(aa=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Cc=new WeakMap,js=new WeakMap,bc=new WeakMap,Vs=new WeakMap,Ei=new WeakMap;function Xh(n){const t=new Promise((e,r)=>{const s=()=>{n.removeEventListener("success",o),n.removeEventListener("error",a)},o=()=>{e(ne(n.result)),s()},a=()=>{r(n.error),s()};n.addEventListener("success",o),n.addEventListener("error",a)});return t.then(e=>{e instanceof IDBCursor&&Cc.set(e,n)}).catch(()=>{}),Ei.set(t,n),t}function Yh(n){if(js.has(n))return;const t=new Promise((e,r)=>{const s=()=>{n.removeEventListener("complete",o),n.removeEventListener("error",a),n.removeEventListener("abort",a)},o=()=>{e(),s()},a=()=>{r(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",o),n.addEventListener("error",a),n.addEventListener("abort",a)});js.set(n,t)}let qs={get(n,t,e){if(n instanceof IDBTransaction){if(t==="done")return js.get(n);if(t==="objectStoreNames")return n.objectStoreNames||bc.get(n);if(t==="store")return e.objectStoreNames[1]?void 0:e.objectStore(e.objectStoreNames[0])}return ne(n[t])},set(n,t,e){return n[t]=e,!0},has(n,t){return n instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in n}};function Jh(n){qs=n(qs)}function Zh(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...e){const r=n.call(ks(this),t,...e);return bc.set(r,t.sort?t.sort():[t]),ne(r)}:Qh().includes(n)?function(...t){return n.apply(ks(this),t),ne(Cc.get(this))}:function(...t){return ne(n.apply(ks(this),t))}}function td(n){return typeof n=="function"?Zh(n):(n instanceof IDBTransaction&&Yh(n),Kh(n,Wh())?new Proxy(n,qs):n)}function ne(n){if(n instanceof IDBRequest)return Xh(n);if(Vs.has(n))return Vs.get(n);const t=td(n);return t!==n&&(Vs.set(n,t),Ei.set(t,n)),t}const ks=n=>Ei.get(n);function ed(n,t,{blocked:e,upgrade:r,blocking:s,terminated:o}={}){const a=indexedDB.open(n,t),u=ne(a);return r&&a.addEventListener("upgradeneeded",h=>{r(ne(a.result),h.oldVersion,h.newVersion,ne(a.transaction),h)}),e&&a.addEventListener("blocked",h=>e(h.oldVersion,h.newVersion,h)),u.then(h=>{o&&h.addEventListener("close",()=>o()),s&&h.addEventListener("versionchange",d=>s(d.oldVersion,d.newVersion,d))}).catch(()=>{}),u}const nd=["get","getKey","getAll","getAllKeys","count"],rd=["put","add","delete","clear"],Ds=new Map;function ca(n,t){if(!(n instanceof IDBDatabase&&!(t in n)&&typeof t=="string"))return;if(Ds.get(t))return Ds.get(t);const e=t.replace(/FromIndex$/,""),r=t!==e,s=rd.includes(e);if(!(e in(r?IDBIndex:IDBObjectStore).prototype)||!(s||nd.includes(e)))return;const o=async function(a,...u){const h=this.transaction(a,s?"readwrite":"readonly");let d=h.store;return r&&(d=d.index(u.shift())),(await Promise.all([d[e](...u),s&&h.done]))[0]};return Ds.set(t,o),o}Jh(n=>({...n,get:(t,e,r)=>ca(t,e)||n.get(t,e,r),has:(t,e)=>!!ca(t,e)||n.has(t,e)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sd{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(e=>{if(id(e)){const r=e.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(e=>e).join(" ")}}function id(n){return n.getComponent()?.type==="VERSION"}const zs="@firebase/app",ua="0.14.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gt=new Br("@firebase/app"),od="@firebase/app-compat",ad="@firebase/analytics-compat",cd="@firebase/analytics",ud="@firebase/app-check-compat",ld="@firebase/app-check",hd="@firebase/auth",dd="@firebase/auth-compat",fd="@firebase/database",pd="@firebase/data-connect",md="@firebase/database-compat",gd="@firebase/functions",_d="@firebase/functions-compat",yd="@firebase/installations",Ed="@firebase/installations-compat",Td="@firebase/messaging",vd="@firebase/messaging-compat",Id="@firebase/performance",wd="@firebase/performance-compat",Ad="@firebase/remote-config",Rd="@firebase/remote-config-compat",Sd="@firebase/storage",Cd="@firebase/storage-compat",bd="@firebase/firestore",Pd="@firebase/ai",Vd="@firebase/firestore-compat",kd="firebase",Dd="12.0.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gs="[DEFAULT]",Nd={[zs]:"fire-core",[od]:"fire-core-compat",[cd]:"fire-analytics",[ad]:"fire-analytics-compat",[ld]:"fire-app-check",[ud]:"fire-app-check-compat",[hd]:"fire-auth",[dd]:"fire-auth-compat",[fd]:"fire-rtdb",[pd]:"fire-data-connect",[md]:"fire-rtdb-compat",[gd]:"fire-fn",[_d]:"fire-fn-compat",[yd]:"fire-iid",[Ed]:"fire-iid-compat",[Td]:"fire-fcm",[vd]:"fire-fcm-compat",[Id]:"fire-perf",[wd]:"fire-perf-compat",[Ad]:"fire-rc",[Rd]:"fire-rc-compat",[Sd]:"fire-gcs",[Cd]:"fire-gcs-compat",[bd]:"fire-fst",[Vd]:"fire-fst-compat",[Pd]:"fire-vertex","fire-js":"fire-js",[kd]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rr=new Map,Od=new Map,Hs=new Map;function la(n,t){try{n.container.addComponent(t)}catch(e){Gt.debug(`Component ${t.name} failed to register with FirebaseApp ${n.name}`,e)}}function we(n){const t=n.name;if(Hs.has(t))return Gt.debug(`There were multiple attempts to register component ${t}.`),!1;Hs.set(t,n);for(const e of Rr.values())la(e,n);for(const e of Od.values())la(e,n);return!0}function $r(n,t){const e=n.container.getProvider("heartbeat").getImmediate({optional:!0});return e&&e.triggerHeartbeat(),n.container.getProvider(t)}function Pc(n){return n==null?!1:n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Md={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},re=new yi("app","Firebase",Md);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xd{constructor(t,e,r){this._isDeleted=!1,this._options={...t},this._config={...e},this._name=e.name,this._automaticDataCollectionEnabled=e.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new ce("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw re.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ld=Dd;function Fd(n,t={}){let e=n;typeof t!="object"&&(t={name:t});const r={name:Gs,automaticDataCollectionEnabled:!0,...t},s=r.name;if(typeof s!="string"||!s)throw re.create("bad-app-name",{appName:String(s)});if(e||(e=Sc()),!e)throw re.create("no-options");const o=Rr.get(s);if(o){if(Ar(e,o.options)&&Ar(r,o.config))return o;throw re.create("duplicate-app",{appName:s})}const a=new jh(s);for(const h of Hs.values())a.addComponent(h);const u=new xd(e,r,a);return Rr.set(s,u),u}function Ti(n=Gs){const t=Rr.get(n);if(!t&&n===Gs&&Sc())return Fd();if(!t)throw re.create("no-app",{appName:n});return t}function qt(n,t,e){let r=Nd[n]??n;e&&(r+=`-${e}`);const s=r.match(/\s|\//),o=t.match(/\s|\//);if(s||o){const a=[`Unable to register library "${r}" with version "${t}":`];s&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&o&&a.push("and"),o&&a.push(`version name "${t}" contains illegal characters (whitespace or "/")`),Gt.warn(a.join(" "));return}we(new ce(`${r}-version`,()=>({library:r,version:t}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ud="firebase-heartbeat-database",Bd=1,bn="firebase-heartbeat-store";let Ns=null;function Vc(){return Ns||(Ns=ed(Ud,Bd,{upgrade:(n,t)=>{switch(t){case 0:try{n.createObjectStore(bn)}catch(e){console.warn(e)}}}}).catch(n=>{throw re.create("idb-open",{originalErrorMessage:n.message})})),Ns}async function $d(n){try{const e=(await Vc()).transaction(bn),r=await e.objectStore(bn).get(kc(n));return await e.done,r}catch(t){if(t instanceof Se)Gt.warn(t.message);else{const e=re.create("idb-get",{originalErrorMessage:t?.message});Gt.warn(e.message)}}}async function ha(n,t){try{const r=(await Vc()).transaction(bn,"readwrite");await r.objectStore(bn).put(t,kc(n)),await r.done}catch(e){if(e instanceof Se)Gt.warn(e.message);else{const r=re.create("idb-set",{originalErrorMessage:e?.message});Gt.warn(r.message)}}}function kc(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jd=1024,qd=30;class zd{constructor(t){this.container=t,this._heartbeatsCache=null;const e=this.container.getProvider("app").getImmediate();this._storage=new Hd(e),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){try{const e=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=da();if(this._heartbeatsCache?.heartbeats==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(s=>s.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:e}),this._heartbeatsCache.heartbeats.length>qd){const s=Kd(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(s,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(t){Gt.warn(t)}}async getHeartbeatsHeader(){try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=da(),{heartbeatsToSend:e,unsentEntries:r}=Gd(this._heartbeatsCache.heartbeats),s=wr(JSON.stringify({version:2,heartbeats:e}));return this._heartbeatsCache.lastSentHeartbeatDate=t,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(t){return Gt.warn(t),""}}}function da(){return new Date().toISOString().substring(0,10)}function Gd(n,t=jd){const e=[];let r=n.slice();for(const s of n){const o=e.find(a=>a.agent===s.agent);if(o){if(o.dates.push(s.date),fa(e)>t){o.dates.pop();break}}else if(e.push({agent:s.agent,dates:[s.date]}),fa(e)>t){e.pop();break}r=r.slice(1)}return{heartbeatsToSend:e,unsentEntries:r}}class Hd{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return _i()?bh().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const e=await $d(this.app);return e?.heartbeats?e:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){if(await this._canUseIndexedDBPromise){const r=await this.read();return ha(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){if(await this._canUseIndexedDBPromise){const r=await this.read();return ha(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...t.heartbeats]})}else return}}function fa(n){return wr(JSON.stringify({version:2,heartbeats:n})).length}function Kd(n){if(n.length===0)return-1;let t=0,e=n[0].date;for(let r=1;r<n.length;r++)n[r].date<e&&(e=n[r].date,t=r);return t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wd(n){we(new ce("platform-logger",t=>new sd(t),"PRIVATE")),we(new ce("heartbeat",t=>new zd(t),"PRIVATE")),qt(zs,ua,n),qt(zs,ua,"esm2020"),qt("fire-js","")}Wd("");var Qd="firebase",Xd="12.0.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */qt(Qd,Xd,"app");var pa=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var se,Dc;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function t(T,p){function _(){}_.prototype=p.prototype,T.D=p.prototype,T.prototype=new _,T.prototype.constructor=T,T.C=function(y,E,w){for(var m=Array(arguments.length-2),Bt=2;Bt<arguments.length;Bt++)m[Bt-2]=arguments[Bt];return p.prototype[E].apply(y,m)}}function e(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}t(r,e),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(T,p,_){_||(_=0);var y=Array(16);if(typeof p=="string")for(var E=0;16>E;++E)y[E]=p.charCodeAt(_++)|p.charCodeAt(_++)<<8|p.charCodeAt(_++)<<16|p.charCodeAt(_++)<<24;else for(E=0;16>E;++E)y[E]=p[_++]|p[_++]<<8|p[_++]<<16|p[_++]<<24;p=T.g[0],_=T.g[1],E=T.g[2];var w=T.g[3],m=p+(w^_&(E^w))+y[0]+3614090360&4294967295;p=_+(m<<7&4294967295|m>>>25),m=w+(E^p&(_^E))+y[1]+3905402710&4294967295,w=p+(m<<12&4294967295|m>>>20),m=E+(_^w&(p^_))+y[2]+606105819&4294967295,E=w+(m<<17&4294967295|m>>>15),m=_+(p^E&(w^p))+y[3]+3250441966&4294967295,_=E+(m<<22&4294967295|m>>>10),m=p+(w^_&(E^w))+y[4]+4118548399&4294967295,p=_+(m<<7&4294967295|m>>>25),m=w+(E^p&(_^E))+y[5]+1200080426&4294967295,w=p+(m<<12&4294967295|m>>>20),m=E+(_^w&(p^_))+y[6]+2821735955&4294967295,E=w+(m<<17&4294967295|m>>>15),m=_+(p^E&(w^p))+y[7]+4249261313&4294967295,_=E+(m<<22&4294967295|m>>>10),m=p+(w^_&(E^w))+y[8]+1770035416&4294967295,p=_+(m<<7&4294967295|m>>>25),m=w+(E^p&(_^E))+y[9]+2336552879&4294967295,w=p+(m<<12&4294967295|m>>>20),m=E+(_^w&(p^_))+y[10]+4294925233&4294967295,E=w+(m<<17&4294967295|m>>>15),m=_+(p^E&(w^p))+y[11]+2304563134&4294967295,_=E+(m<<22&4294967295|m>>>10),m=p+(w^_&(E^w))+y[12]+1804603682&4294967295,p=_+(m<<7&4294967295|m>>>25),m=w+(E^p&(_^E))+y[13]+4254626195&4294967295,w=p+(m<<12&4294967295|m>>>20),m=E+(_^w&(p^_))+y[14]+2792965006&4294967295,E=w+(m<<17&4294967295|m>>>15),m=_+(p^E&(w^p))+y[15]+1236535329&4294967295,_=E+(m<<22&4294967295|m>>>10),m=p+(E^w&(_^E))+y[1]+4129170786&4294967295,p=_+(m<<5&4294967295|m>>>27),m=w+(_^E&(p^_))+y[6]+3225465664&4294967295,w=p+(m<<9&4294967295|m>>>23),m=E+(p^_&(w^p))+y[11]+643717713&4294967295,E=w+(m<<14&4294967295|m>>>18),m=_+(w^p&(E^w))+y[0]+3921069994&4294967295,_=E+(m<<20&4294967295|m>>>12),m=p+(E^w&(_^E))+y[5]+3593408605&4294967295,p=_+(m<<5&4294967295|m>>>27),m=w+(_^E&(p^_))+y[10]+38016083&4294967295,w=p+(m<<9&4294967295|m>>>23),m=E+(p^_&(w^p))+y[15]+3634488961&4294967295,E=w+(m<<14&4294967295|m>>>18),m=_+(w^p&(E^w))+y[4]+3889429448&4294967295,_=E+(m<<20&4294967295|m>>>12),m=p+(E^w&(_^E))+y[9]+568446438&4294967295,p=_+(m<<5&4294967295|m>>>27),m=w+(_^E&(p^_))+y[14]+3275163606&4294967295,w=p+(m<<9&4294967295|m>>>23),m=E+(p^_&(w^p))+y[3]+4107603335&4294967295,E=w+(m<<14&4294967295|m>>>18),m=_+(w^p&(E^w))+y[8]+1163531501&4294967295,_=E+(m<<20&4294967295|m>>>12),m=p+(E^w&(_^E))+y[13]+2850285829&4294967295,p=_+(m<<5&4294967295|m>>>27),m=w+(_^E&(p^_))+y[2]+4243563512&4294967295,w=p+(m<<9&4294967295|m>>>23),m=E+(p^_&(w^p))+y[7]+1735328473&4294967295,E=w+(m<<14&4294967295|m>>>18),m=_+(w^p&(E^w))+y[12]+2368359562&4294967295,_=E+(m<<20&4294967295|m>>>12),m=p+(_^E^w)+y[5]+4294588738&4294967295,p=_+(m<<4&4294967295|m>>>28),m=w+(p^_^E)+y[8]+2272392833&4294967295,w=p+(m<<11&4294967295|m>>>21),m=E+(w^p^_)+y[11]+1839030562&4294967295,E=w+(m<<16&4294967295|m>>>16),m=_+(E^w^p)+y[14]+4259657740&4294967295,_=E+(m<<23&4294967295|m>>>9),m=p+(_^E^w)+y[1]+2763975236&4294967295,p=_+(m<<4&4294967295|m>>>28),m=w+(p^_^E)+y[4]+1272893353&4294967295,w=p+(m<<11&4294967295|m>>>21),m=E+(w^p^_)+y[7]+4139469664&4294967295,E=w+(m<<16&4294967295|m>>>16),m=_+(E^w^p)+y[10]+3200236656&4294967295,_=E+(m<<23&4294967295|m>>>9),m=p+(_^E^w)+y[13]+681279174&4294967295,p=_+(m<<4&4294967295|m>>>28),m=w+(p^_^E)+y[0]+3936430074&4294967295,w=p+(m<<11&4294967295|m>>>21),m=E+(w^p^_)+y[3]+3572445317&4294967295,E=w+(m<<16&4294967295|m>>>16),m=_+(E^w^p)+y[6]+76029189&4294967295,_=E+(m<<23&4294967295|m>>>9),m=p+(_^E^w)+y[9]+3654602809&4294967295,p=_+(m<<4&4294967295|m>>>28),m=w+(p^_^E)+y[12]+3873151461&4294967295,w=p+(m<<11&4294967295|m>>>21),m=E+(w^p^_)+y[15]+530742520&4294967295,E=w+(m<<16&4294967295|m>>>16),m=_+(E^w^p)+y[2]+3299628645&4294967295,_=E+(m<<23&4294967295|m>>>9),m=p+(E^(_|~w))+y[0]+4096336452&4294967295,p=_+(m<<6&4294967295|m>>>26),m=w+(_^(p|~E))+y[7]+1126891415&4294967295,w=p+(m<<10&4294967295|m>>>22),m=E+(p^(w|~_))+y[14]+2878612391&4294967295,E=w+(m<<15&4294967295|m>>>17),m=_+(w^(E|~p))+y[5]+4237533241&4294967295,_=E+(m<<21&4294967295|m>>>11),m=p+(E^(_|~w))+y[12]+1700485571&4294967295,p=_+(m<<6&4294967295|m>>>26),m=w+(_^(p|~E))+y[3]+2399980690&4294967295,w=p+(m<<10&4294967295|m>>>22),m=E+(p^(w|~_))+y[10]+4293915773&4294967295,E=w+(m<<15&4294967295|m>>>17),m=_+(w^(E|~p))+y[1]+2240044497&4294967295,_=E+(m<<21&4294967295|m>>>11),m=p+(E^(_|~w))+y[8]+1873313359&4294967295,p=_+(m<<6&4294967295|m>>>26),m=w+(_^(p|~E))+y[15]+4264355552&4294967295,w=p+(m<<10&4294967295|m>>>22),m=E+(p^(w|~_))+y[6]+2734768916&4294967295,E=w+(m<<15&4294967295|m>>>17),m=_+(w^(E|~p))+y[13]+1309151649&4294967295,_=E+(m<<21&4294967295|m>>>11),m=p+(E^(_|~w))+y[4]+4149444226&4294967295,p=_+(m<<6&4294967295|m>>>26),m=w+(_^(p|~E))+y[11]+3174756917&4294967295,w=p+(m<<10&4294967295|m>>>22),m=E+(p^(w|~_))+y[2]+718787259&4294967295,E=w+(m<<15&4294967295|m>>>17),m=_+(w^(E|~p))+y[9]+3951481745&4294967295,T.g[0]=T.g[0]+p&4294967295,T.g[1]=T.g[1]+(E+(m<<21&4294967295|m>>>11))&4294967295,T.g[2]=T.g[2]+E&4294967295,T.g[3]=T.g[3]+w&4294967295}r.prototype.u=function(T,p){p===void 0&&(p=T.length);for(var _=p-this.blockSize,y=this.B,E=this.h,w=0;w<p;){if(E==0)for(;w<=_;)s(this,T,w),w+=this.blockSize;if(typeof T=="string"){for(;w<p;)if(y[E++]=T.charCodeAt(w++),E==this.blockSize){s(this,y),E=0;break}}else for(;w<p;)if(y[E++]=T[w++],E==this.blockSize){s(this,y),E=0;break}}this.h=E,this.o+=p},r.prototype.v=function(){var T=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);T[0]=128;for(var p=1;p<T.length-8;++p)T[p]=0;var _=8*this.o;for(p=T.length-8;p<T.length;++p)T[p]=_&255,_/=256;for(this.u(T),T=Array(16),p=_=0;4>p;++p)for(var y=0;32>y;y+=8)T[_++]=this.g[p]>>>y&255;return T};function o(T,p){var _=u;return Object.prototype.hasOwnProperty.call(_,T)?_[T]:_[T]=p(T)}function a(T,p){this.h=p;for(var _=[],y=!0,E=T.length-1;0<=E;E--){var w=T[E]|0;y&&w==p||(_[E]=w,y=!1)}this.g=_}var u={};function h(T){return-128<=T&&128>T?o(T,function(p){return new a([p|0],0>p?-1:0)}):new a([T|0],0>T?-1:0)}function d(T){if(isNaN(T)||!isFinite(T))return v;if(0>T)return k(d(-T));for(var p=[],_=1,y=0;T>=_;y++)p[y]=T/_|0,_*=4294967296;return new a(p,0)}function g(T,p){if(T.length==0)throw Error("number format error: empty string");if(p=p||10,2>p||36<p)throw Error("radix out of range: "+p);if(T.charAt(0)=="-")return k(g(T.substring(1),p));if(0<=T.indexOf("-"))throw Error('number format error: interior "-" character');for(var _=d(Math.pow(p,8)),y=v,E=0;E<T.length;E+=8){var w=Math.min(8,T.length-E),m=parseInt(T.substring(E,E+w),p);8>w?(w=d(Math.pow(p,w)),y=y.j(w).add(d(m))):(y=y.j(_),y=y.add(d(m)))}return y}var v=h(0),A=h(1),C=h(16777216);n=a.prototype,n.m=function(){if(O(this))return-k(this).m();for(var T=0,p=1,_=0;_<this.g.length;_++){var y=this.i(_);T+=(0<=y?y:4294967296+y)*p,p*=4294967296}return T},n.toString=function(T){if(T=T||10,2>T||36<T)throw Error("radix out of range: "+T);if(V(this))return"0";if(O(this))return"-"+k(this).toString(T);for(var p=d(Math.pow(T,6)),_=this,y="";;){var E=lt(_,p).g;_=W(_,E.j(p));var w=((0<_.g.length?_.g[0]:_.h)>>>0).toString(T);if(_=E,V(_))return w+y;for(;6>w.length;)w="0"+w;y=w+y}},n.i=function(T){return 0>T?0:T<this.g.length?this.g[T]:this.h};function V(T){if(T.h!=0)return!1;for(var p=0;p<T.g.length;p++)if(T.g[p]!=0)return!1;return!0}function O(T){return T.h==-1}n.l=function(T){return T=W(this,T),O(T)?-1:V(T)?0:1};function k(T){for(var p=T.g.length,_=[],y=0;y<p;y++)_[y]=~T.g[y];return new a(_,~T.h).add(A)}n.abs=function(){return O(this)?k(this):this},n.add=function(T){for(var p=Math.max(this.g.length,T.g.length),_=[],y=0,E=0;E<=p;E++){var w=y+(this.i(E)&65535)+(T.i(E)&65535),m=(w>>>16)+(this.i(E)>>>16)+(T.i(E)>>>16);y=m>>>16,w&=65535,m&=65535,_[E]=m<<16|w}return new a(_,_[_.length-1]&-2147483648?-1:0)};function W(T,p){return T.add(k(p))}n.j=function(T){if(V(this)||V(T))return v;if(O(this))return O(T)?k(this).j(k(T)):k(k(this).j(T));if(O(T))return k(this.j(k(T)));if(0>this.l(C)&&0>T.l(C))return d(this.m()*T.m());for(var p=this.g.length+T.g.length,_=[],y=0;y<2*p;y++)_[y]=0;for(y=0;y<this.g.length;y++)for(var E=0;E<T.g.length;E++){var w=this.i(y)>>>16,m=this.i(y)&65535,Bt=T.i(E)>>>16,Ze=T.i(E)&65535;_[2*y+2*E]+=m*Ze,$(_,2*y+2*E),_[2*y+2*E+1]+=w*Ze,$(_,2*y+2*E+1),_[2*y+2*E+1]+=m*Bt,$(_,2*y+2*E+1),_[2*y+2*E+2]+=w*Bt,$(_,2*y+2*E+2)}for(y=0;y<p;y++)_[y]=_[2*y+1]<<16|_[2*y];for(y=p;y<2*p;y++)_[y]=0;return new a(_,0)};function $(T,p){for(;(T[p]&65535)!=T[p];)T[p+1]+=T[p]>>>16,T[p]&=65535,p++}function q(T,p){this.g=T,this.h=p}function lt(T,p){if(V(p))throw Error("division by zero");if(V(T))return new q(v,v);if(O(T))return p=lt(k(T),p),new q(k(p.g),k(p.h));if(O(p))return p=lt(T,k(p)),new q(k(p.g),p.h);if(30<T.g.length){if(O(T)||O(p))throw Error("slowDivide_ only works with positive integers.");for(var _=A,y=p;0>=y.l(T);)_=Dt(_),y=Dt(y);var E=mt(_,1),w=mt(y,1);for(y=mt(y,2),_=mt(_,2);!V(y);){var m=w.add(y);0>=m.l(T)&&(E=E.add(_),w=m),y=mt(y,1),_=mt(_,1)}return p=W(T,E.j(p)),new q(E,p)}for(E=v;0<=T.l(p);){for(_=Math.max(1,Math.floor(T.m()/p.m())),y=Math.ceil(Math.log(_)/Math.LN2),y=48>=y?1:Math.pow(2,y-48),w=d(_),m=w.j(p);O(m)||0<m.l(T);)_-=y,w=d(_),m=w.j(p);V(w)&&(w=A),E=E.add(w),T=W(T,m)}return new q(E,T)}n.A=function(T){return lt(this,T).h},n.and=function(T){for(var p=Math.max(this.g.length,T.g.length),_=[],y=0;y<p;y++)_[y]=this.i(y)&T.i(y);return new a(_,this.h&T.h)},n.or=function(T){for(var p=Math.max(this.g.length,T.g.length),_=[],y=0;y<p;y++)_[y]=this.i(y)|T.i(y);return new a(_,this.h|T.h)},n.xor=function(T){for(var p=Math.max(this.g.length,T.g.length),_=[],y=0;y<p;y++)_[y]=this.i(y)^T.i(y);return new a(_,this.h^T.h)};function Dt(T){for(var p=T.g.length+1,_=[],y=0;y<p;y++)_[y]=T.i(y)<<1|T.i(y-1)>>>31;return new a(_,T.h)}function mt(T,p){var _=p>>5;p%=32;for(var y=T.g.length-_,E=[],w=0;w<y;w++)E[w]=0<p?T.i(w+_)>>>p|T.i(w+_+1)<<32-p:T.i(w+_);return new a(E,T.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,Dc=r,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=d,a.fromString=g,se=a}).apply(typeof pa<"u"?pa:typeof self<"u"?self:typeof window<"u"?window:{});var ur=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Nc,_n,Oc,gr,Ks,Mc,xc,Lc;(function(){var n,t=typeof Object.defineProperties=="function"?Object.defineProperty:function(i,c,l){return i==Array.prototype||i==Object.prototype||(i[c]=l.value),i};function e(i){i=[typeof globalThis=="object"&&globalThis,i,typeof window=="object"&&window,typeof self=="object"&&self,typeof ur=="object"&&ur];for(var c=0;c<i.length;++c){var l=i[c];if(l&&l.Math==Math)return l}throw Error("Cannot find global object")}var r=e(this);function s(i,c){if(c)t:{var l=r;i=i.split(".");for(var f=0;f<i.length-1;f++){var I=i[f];if(!(I in l))break t;l=l[I]}i=i[i.length-1],f=l[i],c=c(f),c!=f&&c!=null&&t(l,i,{configurable:!0,writable:!0,value:c})}}function o(i,c){i instanceof String&&(i+="");var l=0,f=!1,I={next:function(){if(!f&&l<i.length){var R=l++;return{value:c(R,i[R]),done:!1}}return f=!0,{done:!0,value:void 0}}};return I[Symbol.iterator]=function(){return I},I}s("Array.prototype.values",function(i){return i||function(){return o(this,function(c,l){return l})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},u=this||self;function h(i){var c=typeof i;return c=c!="object"?c:i?Array.isArray(i)?"array":c:"null",c=="array"||c=="object"&&typeof i.length=="number"}function d(i){var c=typeof i;return c=="object"&&i!=null||c=="function"}function g(i,c,l){return i.call.apply(i.bind,arguments)}function v(i,c,l){if(!i)throw Error();if(2<arguments.length){var f=Array.prototype.slice.call(arguments,2);return function(){var I=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(I,f),i.apply(c,I)}}return function(){return i.apply(c,arguments)}}function A(i,c,l){return A=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?g:v,A.apply(null,arguments)}function C(i,c){var l=Array.prototype.slice.call(arguments,1);return function(){var f=l.slice();return f.push.apply(f,arguments),i.apply(this,f)}}function V(i,c){function l(){}l.prototype=c.prototype,i.aa=c.prototype,i.prototype=new l,i.prototype.constructor=i,i.Qb=function(f,I,R){for(var P=Array(arguments.length-2),X=2;X<arguments.length;X++)P[X-2]=arguments[X];return c.prototype[I].apply(f,P)}}function O(i){const c=i.length;if(0<c){const l=Array(c);for(let f=0;f<c;f++)l[f]=i[f];return l}return[]}function k(i,c){for(let l=1;l<arguments.length;l++){const f=arguments[l];if(h(f)){const I=i.length||0,R=f.length||0;i.length=I+R;for(let P=0;P<R;P++)i[I+P]=f[P]}else i.push(f)}}class W{constructor(c,l){this.i=c,this.j=l,this.h=0,this.g=null}get(){let c;return 0<this.h?(this.h--,c=this.g,this.g=c.next,c.next=null):c=this.i(),c}}function $(i){return/^[\s\xa0]*$/.test(i)}function q(){var i=u.navigator;return i&&(i=i.userAgent)?i:""}function lt(i){return lt[" "](i),i}lt[" "]=function(){};var Dt=q().indexOf("Gecko")!=-1&&!(q().toLowerCase().indexOf("webkit")!=-1&&q().indexOf("Edge")==-1)&&!(q().indexOf("Trident")!=-1||q().indexOf("MSIE")!=-1)&&q().indexOf("Edge")==-1;function mt(i,c,l){for(const f in i)c.call(l,i[f],f,i)}function T(i,c){for(const l in i)c.call(void 0,i[l],l,i)}function p(i){const c={};for(const l in i)c[l]=i[l];return c}const _="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function y(i,c){let l,f;for(let I=1;I<arguments.length;I++){f=arguments[I];for(l in f)i[l]=f[l];for(let R=0;R<_.length;R++)l=_[R],Object.prototype.hasOwnProperty.call(f,l)&&(i[l]=f[l])}}function E(i){var c=1;i=i.split(":");const l=[];for(;0<c&&i.length;)l.push(i.shift()),c--;return i.length&&l.push(i.join(":")),l}function w(i){u.setTimeout(()=>{throw i},0)}function m(){var i=is;let c=null;return i.g&&(c=i.g,i.g=i.g.next,i.g||(i.h=null),c.next=null),c}class Bt{constructor(){this.h=this.g=null}add(c,l){const f=Ze.get();f.set(c,l),this.h?this.h.next=f:this.g=f,this.h=f}}var Ze=new W(()=>new Vl,i=>i.reset());class Vl{constructor(){this.next=this.g=this.h=null}set(c,l){this.h=c,this.g=l,this.next=null}reset(){this.next=this.g=this.h=null}}let tn,en=!1,is=new Bt,no=()=>{const i=u.Promise.resolve(void 0);tn=()=>{i.then(kl)}};var kl=()=>{for(var i;i=m();){try{i.h.call(i.g)}catch(l){w(l)}var c=Ze;c.j(i),100>c.h&&(c.h++,i.next=c.g,c.g=i)}en=!1};function Qt(){this.s=this.s,this.C=this.C}Qt.prototype.s=!1,Qt.prototype.ma=function(){this.s||(this.s=!0,this.N())},Qt.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function gt(i,c){this.type=i,this.g=this.target=c,this.defaultPrevented=!1}gt.prototype.h=function(){this.defaultPrevented=!0};var Dl=function(){if(!u.addEventListener||!Object.defineProperty)return!1;var i=!1,c=Object.defineProperty({},"passive",{get:function(){i=!0}});try{const l=()=>{};u.addEventListener("test",l,c),u.removeEventListener("test",l,c)}catch{}return i}();function nn(i,c){if(gt.call(this,i?i.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,i){var l=this.type=i.type,f=i.changedTouches&&i.changedTouches.length?i.changedTouches[0]:null;if(this.target=i.target||i.srcElement,this.g=c,c=i.relatedTarget){if(Dt){t:{try{lt(c.nodeName);var I=!0;break t}catch{}I=!1}I||(c=null)}}else l=="mouseover"?c=i.fromElement:l=="mouseout"&&(c=i.toElement);this.relatedTarget=c,f?(this.clientX=f.clientX!==void 0?f.clientX:f.pageX,this.clientY=f.clientY!==void 0?f.clientY:f.pageY,this.screenX=f.screenX||0,this.screenY=f.screenY||0):(this.clientX=i.clientX!==void 0?i.clientX:i.pageX,this.clientY=i.clientY!==void 0?i.clientY:i.pageY,this.screenX=i.screenX||0,this.screenY=i.screenY||0),this.button=i.button,this.key=i.key||"",this.ctrlKey=i.ctrlKey,this.altKey=i.altKey,this.shiftKey=i.shiftKey,this.metaKey=i.metaKey,this.pointerId=i.pointerId||0,this.pointerType=typeof i.pointerType=="string"?i.pointerType:Nl[i.pointerType]||"",this.state=i.state,this.i=i,i.defaultPrevented&&nn.aa.h.call(this)}}V(nn,gt);var Nl={2:"touch",3:"pen",4:"mouse"};nn.prototype.h=function(){nn.aa.h.call(this);var i=this.i;i.preventDefault?i.preventDefault():i.returnValue=!1};var zn="closure_listenable_"+(1e6*Math.random()|0),Ol=0;function Ml(i,c,l,f,I){this.listener=i,this.proxy=null,this.src=c,this.type=l,this.capture=!!f,this.ha=I,this.key=++Ol,this.da=this.fa=!1}function Gn(i){i.da=!0,i.listener=null,i.proxy=null,i.src=null,i.ha=null}function Hn(i){this.src=i,this.g={},this.h=0}Hn.prototype.add=function(i,c,l,f,I){var R=i.toString();i=this.g[R],i||(i=this.g[R]=[],this.h++);var P=as(i,c,f,I);return-1<P?(c=i[P],l||(c.fa=!1)):(c=new Ml(c,this.src,R,!!f,I),c.fa=l,i.push(c)),c};function os(i,c){var l=c.type;if(l in i.g){var f=i.g[l],I=Array.prototype.indexOf.call(f,c,void 0),R;(R=0<=I)&&Array.prototype.splice.call(f,I,1),R&&(Gn(c),i.g[l].length==0&&(delete i.g[l],i.h--))}}function as(i,c,l,f){for(var I=0;I<i.length;++I){var R=i[I];if(!R.da&&R.listener==c&&R.capture==!!l&&R.ha==f)return I}return-1}var cs="closure_lm_"+(1e6*Math.random()|0),us={};function ro(i,c,l,f,I){if(Array.isArray(c)){for(var R=0;R<c.length;R++)ro(i,c[R],l,f,I);return null}return l=oo(l),i&&i[zn]?i.K(c,l,d(f)?!!f.capture:!1,I):xl(i,c,l,!1,f,I)}function xl(i,c,l,f,I,R){if(!c)throw Error("Invalid event type");var P=d(I)?!!I.capture:!!I,X=hs(i);if(X||(i[cs]=X=new Hn(i)),l=X.add(c,l,f,P,R),l.proxy)return l;if(f=Ll(),l.proxy=f,f.src=i,f.listener=l,i.addEventListener)Dl||(I=P),I===void 0&&(I=!1),i.addEventListener(c.toString(),f,I);else if(i.attachEvent)i.attachEvent(io(c.toString()),f);else if(i.addListener&&i.removeListener)i.addListener(f);else throw Error("addEventListener and attachEvent are unavailable.");return l}function Ll(){function i(l){return c.call(i.src,i.listener,l)}const c=Fl;return i}function so(i,c,l,f,I){if(Array.isArray(c))for(var R=0;R<c.length;R++)so(i,c[R],l,f,I);else f=d(f)?!!f.capture:!!f,l=oo(l),i&&i[zn]?(i=i.i,c=String(c).toString(),c in i.g&&(R=i.g[c],l=as(R,l,f,I),-1<l&&(Gn(R[l]),Array.prototype.splice.call(R,l,1),R.length==0&&(delete i.g[c],i.h--)))):i&&(i=hs(i))&&(c=i.g[c.toString()],i=-1,c&&(i=as(c,l,f,I)),(l=-1<i?c[i]:null)&&ls(l))}function ls(i){if(typeof i!="number"&&i&&!i.da){var c=i.src;if(c&&c[zn])os(c.i,i);else{var l=i.type,f=i.proxy;c.removeEventListener?c.removeEventListener(l,f,i.capture):c.detachEvent?c.detachEvent(io(l),f):c.addListener&&c.removeListener&&c.removeListener(f),(l=hs(c))?(os(l,i),l.h==0&&(l.src=null,c[cs]=null)):Gn(i)}}}function io(i){return i in us?us[i]:us[i]="on"+i}function Fl(i,c){if(i.da)i=!0;else{c=new nn(c,this);var l=i.listener,f=i.ha||i.src;i.fa&&ls(i),i=l.call(f,c)}return i}function hs(i){return i=i[cs],i instanceof Hn?i:null}var ds="__closure_events_fn_"+(1e9*Math.random()>>>0);function oo(i){return typeof i=="function"?i:(i[ds]||(i[ds]=function(c){return i.handleEvent(c)}),i[ds])}function _t(){Qt.call(this),this.i=new Hn(this),this.M=this,this.F=null}V(_t,Qt),_t.prototype[zn]=!0,_t.prototype.removeEventListener=function(i,c,l,f){so(this,i,c,l,f)};function wt(i,c){var l,f=i.F;if(f)for(l=[];f;f=f.F)l.push(f);if(i=i.M,f=c.type||c,typeof c=="string")c=new gt(c,i);else if(c instanceof gt)c.target=c.target||i;else{var I=c;c=new gt(f,i),y(c,I)}if(I=!0,l)for(var R=l.length-1;0<=R;R--){var P=c.g=l[R];I=Kn(P,f,!0,c)&&I}if(P=c.g=i,I=Kn(P,f,!0,c)&&I,I=Kn(P,f,!1,c)&&I,l)for(R=0;R<l.length;R++)P=c.g=l[R],I=Kn(P,f,!1,c)&&I}_t.prototype.N=function(){if(_t.aa.N.call(this),this.i){var i=this.i,c;for(c in i.g){for(var l=i.g[c],f=0;f<l.length;f++)Gn(l[f]);delete i.g[c],i.h--}}this.F=null},_t.prototype.K=function(i,c,l,f){return this.i.add(String(i),c,!1,l,f)},_t.prototype.L=function(i,c,l,f){return this.i.add(String(i),c,!0,l,f)};function Kn(i,c,l,f){if(c=i.i.g[String(c)],!c)return!0;c=c.concat();for(var I=!0,R=0;R<c.length;++R){var P=c[R];if(P&&!P.da&&P.capture==l){var X=P.listener,ht=P.ha||P.src;P.fa&&os(i.i,P),I=X.call(ht,f)!==!1&&I}}return I&&!f.defaultPrevented}function ao(i,c,l){if(typeof i=="function")l&&(i=A(i,l));else if(i&&typeof i.handleEvent=="function")i=A(i.handleEvent,i);else throw Error("Invalid listener argument");return 2147483647<Number(c)?-1:u.setTimeout(i,c||0)}function co(i){i.g=ao(()=>{i.g=null,i.i&&(i.i=!1,co(i))},i.l);const c=i.h;i.h=null,i.m.apply(null,c)}class Ul extends Qt{constructor(c,l){super(),this.m=c,this.l=l,this.h=null,this.i=!1,this.g=null}j(c){this.h=arguments,this.g?this.i=!0:co(this)}N(){super.N(),this.g&&(u.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function rn(i){Qt.call(this),this.h=i,this.g={}}V(rn,Qt);var uo=[];function lo(i){mt(i.g,function(c,l){this.g.hasOwnProperty(l)&&ls(c)},i),i.g={}}rn.prototype.N=function(){rn.aa.N.call(this),lo(this)},rn.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var fs=u.JSON.stringify,Bl=u.JSON.parse,$l=class{stringify(i){return u.JSON.stringify(i,void 0)}parse(i){return u.JSON.parse(i,void 0)}};function ps(){}ps.prototype.h=null;function ho(i){return i.h||(i.h=i.i())}function fo(){}var sn={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function ms(){gt.call(this,"d")}V(ms,gt);function gs(){gt.call(this,"c")}V(gs,gt);var me={},po=null;function Wn(){return po=po||new _t}me.La="serverreachability";function mo(i){gt.call(this,me.La,i)}V(mo,gt);function on(i){const c=Wn();wt(c,new mo(c))}me.STAT_EVENT="statevent";function go(i,c){gt.call(this,me.STAT_EVENT,i),this.stat=c}V(go,gt);function At(i){const c=Wn();wt(c,new go(c,i))}me.Ma="timingevent";function _o(i,c){gt.call(this,me.Ma,i),this.size=c}V(_o,gt);function an(i,c){if(typeof i!="function")throw Error("Fn must not be null and must be a function");return u.setTimeout(function(){i()},c)}function cn(){this.g=!0}cn.prototype.xa=function(){this.g=!1};function jl(i,c,l,f,I,R){i.info(function(){if(i.g)if(R)for(var P="",X=R.split("&"),ht=0;ht<X.length;ht++){var K=X[ht].split("=");if(1<K.length){var yt=K[0];K=K[1];var Et=yt.split("_");P=2<=Et.length&&Et[1]=="type"?P+(yt+"="+K+"&"):P+(yt+"=redacted&")}}else P=null;else P=R;return"XMLHTTP REQ ("+f+") [attempt "+I+"]: "+c+`
`+l+`
`+P})}function ql(i,c,l,f,I,R,P){i.info(function(){return"XMLHTTP RESP ("+f+") [ attempt "+I+"]: "+c+`
`+l+`
`+R+" "+P})}function ke(i,c,l,f){i.info(function(){return"XMLHTTP TEXT ("+c+"): "+Gl(i,l)+(f?" "+f:"")})}function zl(i,c){i.info(function(){return"TIMEOUT: "+c})}cn.prototype.info=function(){};function Gl(i,c){if(!i.g)return c;if(!c)return null;try{var l=JSON.parse(c);if(l){for(i=0;i<l.length;i++)if(Array.isArray(l[i])){var f=l[i];if(!(2>f.length)){var I=f[1];if(Array.isArray(I)&&!(1>I.length)){var R=I[0];if(R!="noop"&&R!="stop"&&R!="close")for(var P=1;P<I.length;P++)I[P]=""}}}}return fs(l)}catch{return c}}var Qn={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},yo={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},_s;function Xn(){}V(Xn,ps),Xn.prototype.g=function(){return new XMLHttpRequest},Xn.prototype.i=function(){return{}},_s=new Xn;function Xt(i,c,l,f){this.j=i,this.i=c,this.l=l,this.R=f||1,this.U=new rn(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Eo}function Eo(){this.i=null,this.g="",this.h=!1}var To={},ys={};function Es(i,c,l){i.L=1,i.v=tr($t(c)),i.m=l,i.P=!0,vo(i,null)}function vo(i,c){i.F=Date.now(),Yn(i),i.A=$t(i.v);var l=i.A,f=i.R;Array.isArray(f)||(f=[String(f)]),Mo(l.i,"t",f),i.C=0,l=i.j.J,i.h=new Eo,i.g=Zo(i.j,l?c:null,!i.m),0<i.O&&(i.M=new Ul(A(i.Y,i,i.g),i.O)),c=i.U,l=i.g,f=i.ca;var I="readystatechange";Array.isArray(I)||(I&&(uo[0]=I.toString()),I=uo);for(var R=0;R<I.length;R++){var P=ro(l,I[R],f||c.handleEvent,!1,c.h||c);if(!P)break;c.g[P.key]=P}c=i.H?p(i.H):{},i.m?(i.u||(i.u="POST"),c["Content-Type"]="application/x-www-form-urlencoded",i.g.ea(i.A,i.u,i.m,c)):(i.u="GET",i.g.ea(i.A,i.u,null,c)),on(),jl(i.i,i.u,i.A,i.l,i.R,i.m)}Xt.prototype.ca=function(i){i=i.target;const c=this.M;c&&jt(i)==3?c.j():this.Y(i)},Xt.prototype.Y=function(i){try{if(i==this.g)t:{const Et=jt(this.g);var c=this.g.Ba();const Oe=this.g.Z();if(!(3>Et)&&(Et!=3||this.g&&(this.h.h||this.g.oa()||jo(this.g)))){this.J||Et!=4||c==7||(c==8||0>=Oe?on(3):on(2)),Ts(this);var l=this.g.Z();this.X=l;e:if(Io(this)){var f=jo(this.g);i="";var I=f.length,R=jt(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){ge(this),un(this);var P="";break e}this.h.i=new u.TextDecoder}for(c=0;c<I;c++)this.h.h=!0,i+=this.h.i.decode(f[c],{stream:!(R&&c==I-1)});f.length=0,this.h.g+=i,this.C=0,P=this.h.g}else P=this.g.oa();if(this.o=l==200,ql(this.i,this.u,this.A,this.l,this.R,Et,l),this.o){if(this.T&&!this.K){e:{if(this.g){var X,ht=this.g;if((X=ht.g?ht.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!$(X)){var K=X;break e}}K=null}if(l=K)ke(this.i,this.l,l,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,vs(this,l);else{this.o=!1,this.s=3,At(12),ge(this),un(this);break t}}if(this.P){l=!0;let Vt;for(;!this.J&&this.C<P.length;)if(Vt=Hl(this,P),Vt==ys){Et==4&&(this.s=4,At(14),l=!1),ke(this.i,this.l,null,"[Incomplete Response]");break}else if(Vt==To){this.s=4,At(15),ke(this.i,this.l,P,"[Invalid Chunk]"),l=!1;break}else ke(this.i,this.l,Vt,null),vs(this,Vt);if(Io(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Et!=4||P.length!=0||this.h.h||(this.s=1,At(16),l=!1),this.o=this.o&&l,!l)ke(this.i,this.l,P,"[Invalid Chunked Response]"),ge(this),un(this);else if(0<P.length&&!this.W){this.W=!0;var yt=this.j;yt.g==this&&yt.ba&&!yt.M&&(yt.j.info("Great, no buffering proxy detected. Bytes received: "+P.length),Cs(yt),yt.M=!0,At(11))}}else ke(this.i,this.l,P,null),vs(this,P);Et==4&&ge(this),this.o&&!this.J&&(Et==4?Qo(this.j,this):(this.o=!1,Yn(this)))}else uh(this.g),l==400&&0<P.indexOf("Unknown SID")?(this.s=3,At(12)):(this.s=0,At(13)),ge(this),un(this)}}}catch{}finally{}};function Io(i){return i.g?i.u=="GET"&&i.L!=2&&i.j.Ca:!1}function Hl(i,c){var l=i.C,f=c.indexOf(`
`,l);return f==-1?ys:(l=Number(c.substring(l,f)),isNaN(l)?To:(f+=1,f+l>c.length?ys:(c=c.slice(f,f+l),i.C=f+l,c)))}Xt.prototype.cancel=function(){this.J=!0,ge(this)};function Yn(i){i.S=Date.now()+i.I,wo(i,i.I)}function wo(i,c){if(i.B!=null)throw Error("WatchDog timer not null");i.B=an(A(i.ba,i),c)}function Ts(i){i.B&&(u.clearTimeout(i.B),i.B=null)}Xt.prototype.ba=function(){this.B=null;const i=Date.now();0<=i-this.S?(zl(this.i,this.A),this.L!=2&&(on(),At(17)),ge(this),this.s=2,un(this)):wo(this,this.S-i)};function un(i){i.j.G==0||i.J||Qo(i.j,i)}function ge(i){Ts(i);var c=i.M;c&&typeof c.ma=="function"&&c.ma(),i.M=null,lo(i.U),i.g&&(c=i.g,i.g=null,c.abort(),c.ma())}function vs(i,c){try{var l=i.j;if(l.G!=0&&(l.g==i||Is(l.h,i))){if(!i.K&&Is(l.h,i)&&l.G==3){try{var f=l.Da.g.parse(c)}catch{f=null}if(Array.isArray(f)&&f.length==3){var I=f;if(I[0]==0){t:if(!l.u){if(l.g)if(l.g.F+3e3<i.F)or(l),sr(l);else break t;Ss(l),At(18)}}else l.za=I[1],0<l.za-l.T&&37500>I[2]&&l.F&&l.v==0&&!l.C&&(l.C=an(A(l.Za,l),6e3));if(1>=So(l.h)&&l.ca){try{l.ca()}catch{}l.ca=void 0}}else ye(l,11)}else if((i.K||l.g==i)&&or(l),!$(c))for(I=l.Da.g.parse(c),c=0;c<I.length;c++){let K=I[c];if(l.T=K[0],K=K[1],l.G==2)if(K[0]=="c"){l.K=K[1],l.ia=K[2];const yt=K[3];yt!=null&&(l.la=yt,l.j.info("VER="+l.la));const Et=K[4];Et!=null&&(l.Aa=Et,l.j.info("SVER="+l.Aa));const Oe=K[5];Oe!=null&&typeof Oe=="number"&&0<Oe&&(f=1.5*Oe,l.L=f,l.j.info("backChannelRequestTimeoutMs_="+f)),f=l;const Vt=i.g;if(Vt){const cr=Vt.g?Vt.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(cr){var R=f.h;R.g||cr.indexOf("spdy")==-1&&cr.indexOf("quic")==-1&&cr.indexOf("h2")==-1||(R.j=R.l,R.g=new Set,R.h&&(ws(R,R.h),R.h=null))}if(f.D){const bs=Vt.g?Vt.g.getResponseHeader("X-HTTP-Session-Id"):null;bs&&(f.ya=bs,Y(f.I,f.D,bs))}}l.G=3,l.l&&l.l.ua(),l.ba&&(l.R=Date.now()-i.F,l.j.info("Handshake RTT: "+l.R+"ms")),f=l;var P=i;if(f.qa=Jo(f,f.J?f.ia:null,f.W),P.K){Co(f.h,P);var X=P,ht=f.L;ht&&(X.I=ht),X.B&&(Ts(X),Yn(X)),f.g=P}else Ko(f);0<l.i.length&&ir(l)}else K[0]!="stop"&&K[0]!="close"||ye(l,7);else l.G==3&&(K[0]=="stop"||K[0]=="close"?K[0]=="stop"?ye(l,7):Rs(l):K[0]!="noop"&&l.l&&l.l.ta(K),l.v=0)}}on(4)}catch{}}var Kl=class{constructor(i,c){this.g=i,this.map=c}};function Ao(i){this.l=i||10,u.PerformanceNavigationTiming?(i=u.performance.getEntriesByType("navigation"),i=0<i.length&&(i[0].nextHopProtocol=="hq"||i[0].nextHopProtocol=="h2")):i=!!(u.chrome&&u.chrome.loadTimes&&u.chrome.loadTimes()&&u.chrome.loadTimes().wasFetchedViaSpdy),this.j=i?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Ro(i){return i.h?!0:i.g?i.g.size>=i.j:!1}function So(i){return i.h?1:i.g?i.g.size:0}function Is(i,c){return i.h?i.h==c:i.g?i.g.has(c):!1}function ws(i,c){i.g?i.g.add(c):i.h=c}function Co(i,c){i.h&&i.h==c?i.h=null:i.g&&i.g.has(c)&&i.g.delete(c)}Ao.prototype.cancel=function(){if(this.i=bo(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const i of this.g.values())i.cancel();this.g.clear()}};function bo(i){if(i.h!=null)return i.i.concat(i.h.D);if(i.g!=null&&i.g.size!==0){let c=i.i;for(const l of i.g.values())c=c.concat(l.D);return c}return O(i.i)}function Wl(i){if(i.V&&typeof i.V=="function")return i.V();if(typeof Map<"u"&&i instanceof Map||typeof Set<"u"&&i instanceof Set)return Array.from(i.values());if(typeof i=="string")return i.split("");if(h(i)){for(var c=[],l=i.length,f=0;f<l;f++)c.push(i[f]);return c}c=[],l=0;for(f in i)c[l++]=i[f];return c}function Ql(i){if(i.na&&typeof i.na=="function")return i.na();if(!i.V||typeof i.V!="function"){if(typeof Map<"u"&&i instanceof Map)return Array.from(i.keys());if(!(typeof Set<"u"&&i instanceof Set)){if(h(i)||typeof i=="string"){var c=[];i=i.length;for(var l=0;l<i;l++)c.push(l);return c}c=[],l=0;for(const f in i)c[l++]=f;return c}}}function Po(i,c){if(i.forEach&&typeof i.forEach=="function")i.forEach(c,void 0);else if(h(i)||typeof i=="string")Array.prototype.forEach.call(i,c,void 0);else for(var l=Ql(i),f=Wl(i),I=f.length,R=0;R<I;R++)c.call(void 0,f[R],l&&l[R],i)}var Vo=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Xl(i,c){if(i){i=i.split("&");for(var l=0;l<i.length;l++){var f=i[l].indexOf("="),I=null;if(0<=f){var R=i[l].substring(0,f);I=i[l].substring(f+1)}else R=i[l];c(R,I?decodeURIComponent(I.replace(/\+/g," ")):"")}}}function _e(i){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,i instanceof _e){this.h=i.h,Jn(this,i.j),this.o=i.o,this.g=i.g,Zn(this,i.s),this.l=i.l;var c=i.i,l=new dn;l.i=c.i,c.g&&(l.g=new Map(c.g),l.h=c.h),ko(this,l),this.m=i.m}else i&&(c=String(i).match(Vo))?(this.h=!1,Jn(this,c[1]||"",!0),this.o=ln(c[2]||""),this.g=ln(c[3]||"",!0),Zn(this,c[4]),this.l=ln(c[5]||"",!0),ko(this,c[6]||"",!0),this.m=ln(c[7]||"")):(this.h=!1,this.i=new dn(null,this.h))}_e.prototype.toString=function(){var i=[],c=this.j;c&&i.push(hn(c,Do,!0),":");var l=this.g;return(l||c=="file")&&(i.push("//"),(c=this.o)&&i.push(hn(c,Do,!0),"@"),i.push(encodeURIComponent(String(l)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),l=this.s,l!=null&&i.push(":",String(l))),(l=this.l)&&(this.g&&l.charAt(0)!="/"&&i.push("/"),i.push(hn(l,l.charAt(0)=="/"?Zl:Jl,!0))),(l=this.i.toString())&&i.push("?",l),(l=this.m)&&i.push("#",hn(l,eh)),i.join("")};function $t(i){return new _e(i)}function Jn(i,c,l){i.j=l?ln(c,!0):c,i.j&&(i.j=i.j.replace(/:$/,""))}function Zn(i,c){if(c){if(c=Number(c),isNaN(c)||0>c)throw Error("Bad port number "+c);i.s=c}else i.s=null}function ko(i,c,l){c instanceof dn?(i.i=c,nh(i.i,i.h)):(l||(c=hn(c,th)),i.i=new dn(c,i.h))}function Y(i,c,l){i.i.set(c,l)}function tr(i){return Y(i,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),i}function ln(i,c){return i?c?decodeURI(i.replace(/%25/g,"%2525")):decodeURIComponent(i):""}function hn(i,c,l){return typeof i=="string"?(i=encodeURI(i).replace(c,Yl),l&&(i=i.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),i):null}function Yl(i){return i=i.charCodeAt(0),"%"+(i>>4&15).toString(16)+(i&15).toString(16)}var Do=/[#\/\?@]/g,Jl=/[#\?:]/g,Zl=/[#\?]/g,th=/[#\?@]/g,eh=/#/g;function dn(i,c){this.h=this.g=null,this.i=i||null,this.j=!!c}function Yt(i){i.g||(i.g=new Map,i.h=0,i.i&&Xl(i.i,function(c,l){i.add(decodeURIComponent(c.replace(/\+/g," ")),l)}))}n=dn.prototype,n.add=function(i,c){Yt(this),this.i=null,i=De(this,i);var l=this.g.get(i);return l||this.g.set(i,l=[]),l.push(c),this.h+=1,this};function No(i,c){Yt(i),c=De(i,c),i.g.has(c)&&(i.i=null,i.h-=i.g.get(c).length,i.g.delete(c))}function Oo(i,c){return Yt(i),c=De(i,c),i.g.has(c)}n.forEach=function(i,c){Yt(this),this.g.forEach(function(l,f){l.forEach(function(I){i.call(c,I,f,this)},this)},this)},n.na=function(){Yt(this);const i=Array.from(this.g.values()),c=Array.from(this.g.keys()),l=[];for(let f=0;f<c.length;f++){const I=i[f];for(let R=0;R<I.length;R++)l.push(c[f])}return l},n.V=function(i){Yt(this);let c=[];if(typeof i=="string")Oo(this,i)&&(c=c.concat(this.g.get(De(this,i))));else{i=Array.from(this.g.values());for(let l=0;l<i.length;l++)c=c.concat(i[l])}return c},n.set=function(i,c){return Yt(this),this.i=null,i=De(this,i),Oo(this,i)&&(this.h-=this.g.get(i).length),this.g.set(i,[c]),this.h+=1,this},n.get=function(i,c){return i?(i=this.V(i),0<i.length?String(i[0]):c):c};function Mo(i,c,l){No(i,c),0<l.length&&(i.i=null,i.g.set(De(i,c),O(l)),i.h+=l.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const i=[],c=Array.from(this.g.keys());for(var l=0;l<c.length;l++){var f=c[l];const R=encodeURIComponent(String(f)),P=this.V(f);for(f=0;f<P.length;f++){var I=R;P[f]!==""&&(I+="="+encodeURIComponent(String(P[f]))),i.push(I)}}return this.i=i.join("&")};function De(i,c){return c=String(c),i.j&&(c=c.toLowerCase()),c}function nh(i,c){c&&!i.j&&(Yt(i),i.i=null,i.g.forEach(function(l,f){var I=f.toLowerCase();f!=I&&(No(this,f),Mo(this,I,l))},i)),i.j=c}function rh(i,c){const l=new cn;if(u.Image){const f=new Image;f.onload=C(Jt,l,"TestLoadImage: loaded",!0,c,f),f.onerror=C(Jt,l,"TestLoadImage: error",!1,c,f),f.onabort=C(Jt,l,"TestLoadImage: abort",!1,c,f),f.ontimeout=C(Jt,l,"TestLoadImage: timeout",!1,c,f),u.setTimeout(function(){f.ontimeout&&f.ontimeout()},1e4),f.src=i}else c(!1)}function sh(i,c){const l=new cn,f=new AbortController,I=setTimeout(()=>{f.abort(),Jt(l,"TestPingServer: timeout",!1,c)},1e4);fetch(i,{signal:f.signal}).then(R=>{clearTimeout(I),R.ok?Jt(l,"TestPingServer: ok",!0,c):Jt(l,"TestPingServer: server error",!1,c)}).catch(()=>{clearTimeout(I),Jt(l,"TestPingServer: error",!1,c)})}function Jt(i,c,l,f,I){try{I&&(I.onload=null,I.onerror=null,I.onabort=null,I.ontimeout=null),f(l)}catch{}}function ih(){this.g=new $l}function oh(i,c,l){const f=l||"";try{Po(i,function(I,R){let P=I;d(I)&&(P=fs(I)),c.push(f+R+"="+encodeURIComponent(P))})}catch(I){throw c.push(f+"type="+encodeURIComponent("_badmap")),I}}function er(i){this.l=i.Ub||null,this.j=i.eb||!1}V(er,ps),er.prototype.g=function(){return new nr(this.l,this.j)},er.prototype.i=function(i){return function(){return i}}({});function nr(i,c){_t.call(this),this.D=i,this.o=c,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}V(nr,_t),n=nr.prototype,n.open=function(i,c){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=i,this.A=c,this.readyState=1,pn(this)},n.send=function(i){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const c={headers:this.u,method:this.B,credentials:this.m,cache:void 0};i&&(c.body=i),(this.D||u).fetch(new Request(this.A,c)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,fn(this)),this.readyState=0},n.Sa=function(i){if(this.g&&(this.l=i,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=i.headers,this.readyState=2,pn(this)),this.g&&(this.readyState=3,pn(this),this.g)))if(this.responseType==="arraybuffer")i.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof u.ReadableStream<"u"&&"body"in i){if(this.j=i.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;xo(this)}else i.text().then(this.Ra.bind(this),this.ga.bind(this))};function xo(i){i.j.read().then(i.Pa.bind(i)).catch(i.ga.bind(i))}n.Pa=function(i){if(this.g){if(this.o&&i.value)this.response.push(i.value);else if(!this.o){var c=i.value?i.value:new Uint8Array(0);(c=this.v.decode(c,{stream:!i.done}))&&(this.response=this.responseText+=c)}i.done?fn(this):pn(this),this.readyState==3&&xo(this)}},n.Ra=function(i){this.g&&(this.response=this.responseText=i,fn(this))},n.Qa=function(i){this.g&&(this.response=i,fn(this))},n.ga=function(){this.g&&fn(this)};function fn(i){i.readyState=4,i.l=null,i.j=null,i.v=null,pn(i)}n.setRequestHeader=function(i,c){this.u.append(i,c)},n.getResponseHeader=function(i){return this.h&&this.h.get(i.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const i=[],c=this.h.entries();for(var l=c.next();!l.done;)l=l.value,i.push(l[0]+": "+l[1]),l=c.next();return i.join(`\r
`)};function pn(i){i.onreadystatechange&&i.onreadystatechange.call(i)}Object.defineProperty(nr.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(i){this.m=i?"include":"same-origin"}});function Lo(i){let c="";return mt(i,function(l,f){c+=f,c+=":",c+=l,c+=`\r
`}),c}function As(i,c,l){t:{for(f in l){var f=!1;break t}f=!0}f||(l=Lo(l),typeof i=="string"?l!=null&&encodeURIComponent(String(l)):Y(i,c,l))}function et(i){_t.call(this),this.headers=new Map,this.o=i||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}V(et,_t);var ah=/^https?$/i,ch=["POST","PUT"];n=et.prototype,n.Ha=function(i){this.J=i},n.ea=function(i,c,l,f){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+i);c=c?c.toUpperCase():"GET",this.D=i,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():_s.g(),this.v=this.o?ho(this.o):ho(_s),this.g.onreadystatechange=A(this.Ea,this);try{this.B=!0,this.g.open(c,String(i),!0),this.B=!1}catch(R){Fo(this,R);return}if(i=l||"",l=new Map(this.headers),f)if(Object.getPrototypeOf(f)===Object.prototype)for(var I in f)l.set(I,f[I]);else if(typeof f.keys=="function"&&typeof f.get=="function")for(const R of f.keys())l.set(R,f.get(R));else throw Error("Unknown input type for opt_headers: "+String(f));f=Array.from(l.keys()).find(R=>R.toLowerCase()=="content-type"),I=u.FormData&&i instanceof u.FormData,!(0<=Array.prototype.indexOf.call(ch,c,void 0))||f||I||l.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[R,P]of l)this.g.setRequestHeader(R,P);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{$o(this),this.u=!0,this.g.send(i),this.u=!1}catch(R){Fo(this,R)}};function Fo(i,c){i.h=!1,i.g&&(i.j=!0,i.g.abort(),i.j=!1),i.l=c,i.m=5,Uo(i),rr(i)}function Uo(i){i.A||(i.A=!0,wt(i,"complete"),wt(i,"error"))}n.abort=function(i){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=i||7,wt(this,"complete"),wt(this,"abort"),rr(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),rr(this,!0)),et.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?Bo(this):this.bb())},n.bb=function(){Bo(this)};function Bo(i){if(i.h&&typeof a<"u"&&(!i.v[1]||jt(i)!=4||i.Z()!=2)){if(i.u&&jt(i)==4)ao(i.Ea,0,i);else if(wt(i,"readystatechange"),jt(i)==4){i.h=!1;try{const P=i.Z();t:switch(P){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var c=!0;break t;default:c=!1}var l;if(!(l=c)){var f;if(f=P===0){var I=String(i.D).match(Vo)[1]||null;!I&&u.self&&u.self.location&&(I=u.self.location.protocol.slice(0,-1)),f=!ah.test(I?I.toLowerCase():"")}l=f}if(l)wt(i,"complete"),wt(i,"success");else{i.m=6;try{var R=2<jt(i)?i.g.statusText:""}catch{R=""}i.l=R+" ["+i.Z()+"]",Uo(i)}}finally{rr(i)}}}}function rr(i,c){if(i.g){$o(i);const l=i.g,f=i.v[0]?()=>{}:null;i.g=null,i.v=null,c||wt(i,"ready");try{l.onreadystatechange=f}catch{}}}function $o(i){i.I&&(u.clearTimeout(i.I),i.I=null)}n.isActive=function(){return!!this.g};function jt(i){return i.g?i.g.readyState:0}n.Z=function(){try{return 2<jt(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(i){if(this.g){var c=this.g.responseText;return i&&c.indexOf(i)==0&&(c=c.substring(i.length)),Bl(c)}};function jo(i){try{if(!i.g)return null;if("response"in i.g)return i.g.response;switch(i.H){case"":case"text":return i.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in i.g)return i.g.mozResponseArrayBuffer}return null}catch{return null}}function uh(i){const c={};i=(i.g&&2<=jt(i)&&i.g.getAllResponseHeaders()||"").split(`\r
`);for(let f=0;f<i.length;f++){if($(i[f]))continue;var l=E(i[f]);const I=l[0];if(l=l[1],typeof l!="string")continue;l=l.trim();const R=c[I]||[];c[I]=R,R.push(l)}T(c,function(f){return f.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function mn(i,c,l){return l&&l.internalChannelParams&&l.internalChannelParams[i]||c}function qo(i){this.Aa=0,this.i=[],this.j=new cn,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=mn("failFast",!1,i),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=mn("baseRetryDelayMs",5e3,i),this.cb=mn("retryDelaySeedMs",1e4,i),this.Wa=mn("forwardChannelMaxRetries",2,i),this.wa=mn("forwardChannelRequestTimeoutMs",2e4,i),this.pa=i&&i.xmlHttpFactory||void 0,this.Xa=i&&i.Tb||void 0,this.Ca=i&&i.useFetchStreams||!1,this.L=void 0,this.J=i&&i.supportsCrossDomainXhr||!1,this.K="",this.h=new Ao(i&&i.concurrentRequestLimit),this.Da=new ih,this.P=i&&i.fastHandshake||!1,this.O=i&&i.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=i&&i.Rb||!1,i&&i.xa&&this.j.xa(),i&&i.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&i&&i.detectBufferingProxy||!1,this.ja=void 0,i&&i.longPollingTimeout&&0<i.longPollingTimeout&&(this.ja=i.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=qo.prototype,n.la=8,n.G=1,n.connect=function(i,c,l,f){At(0),this.W=i,this.H=c||{},l&&f!==void 0&&(this.H.OSID=l,this.H.OAID=f),this.F=this.X,this.I=Jo(this,null,this.W),ir(this)};function Rs(i){if(zo(i),i.G==3){var c=i.U++,l=$t(i.I);if(Y(l,"SID",i.K),Y(l,"RID",c),Y(l,"TYPE","terminate"),gn(i,l),c=new Xt(i,i.j,c),c.L=2,c.v=tr($t(l)),l=!1,u.navigator&&u.navigator.sendBeacon)try{l=u.navigator.sendBeacon(c.v.toString(),"")}catch{}!l&&u.Image&&(new Image().src=c.v,l=!0),l||(c.g=Zo(c.j,null),c.g.ea(c.v)),c.F=Date.now(),Yn(c)}Yo(i)}function sr(i){i.g&&(Cs(i),i.g.cancel(),i.g=null)}function zo(i){sr(i),i.u&&(u.clearTimeout(i.u),i.u=null),or(i),i.h.cancel(),i.s&&(typeof i.s=="number"&&u.clearTimeout(i.s),i.s=null)}function ir(i){if(!Ro(i.h)&&!i.s){i.s=!0;var c=i.Ga;tn||no(),en||(tn(),en=!0),is.add(c,i),i.B=0}}function lh(i,c){return So(i.h)>=i.h.j-(i.s?1:0)?!1:i.s?(i.i=c.D.concat(i.i),!0):i.G==1||i.G==2||i.B>=(i.Va?0:i.Wa)?!1:(i.s=an(A(i.Ga,i,c),Xo(i,i.B)),i.B++,!0)}n.Ga=function(i){if(this.s)if(this.s=null,this.G==1){if(!i){this.U=Math.floor(1e5*Math.random()),i=this.U++;const I=new Xt(this,this.j,i);let R=this.o;if(this.S&&(R?(R=p(R),y(R,this.S)):R=this.S),this.m!==null||this.O||(I.H=R,R=null),this.P)t:{for(var c=0,l=0;l<this.i.length;l++){e:{var f=this.i[l];if("__data__"in f.map&&(f=f.map.__data__,typeof f=="string")){f=f.length;break e}f=void 0}if(f===void 0)break;if(c+=f,4096<c){c=l;break t}if(c===4096||l===this.i.length-1){c=l+1;break t}}c=1e3}else c=1e3;c=Ho(this,I,c),l=$t(this.I),Y(l,"RID",i),Y(l,"CVER",22),this.D&&Y(l,"X-HTTP-Session-Id",this.D),gn(this,l),R&&(this.O?c="headers="+encodeURIComponent(String(Lo(R)))+"&"+c:this.m&&As(l,this.m,R)),ws(this.h,I),this.Ua&&Y(l,"TYPE","init"),this.P?(Y(l,"$req",c),Y(l,"SID","null"),I.T=!0,Es(I,l,null)):Es(I,l,c),this.G=2}}else this.G==3&&(i?Go(this,i):this.i.length==0||Ro(this.h)||Go(this))};function Go(i,c){var l;c?l=c.l:l=i.U++;const f=$t(i.I);Y(f,"SID",i.K),Y(f,"RID",l),Y(f,"AID",i.T),gn(i,f),i.m&&i.o&&As(f,i.m,i.o),l=new Xt(i,i.j,l,i.B+1),i.m===null&&(l.H=i.o),c&&(i.i=c.D.concat(i.i)),c=Ho(i,l,1e3),l.I=Math.round(.5*i.wa)+Math.round(.5*i.wa*Math.random()),ws(i.h,l),Es(l,f,c)}function gn(i,c){i.H&&mt(i.H,function(l,f){Y(c,f,l)}),i.l&&Po({},function(l,f){Y(c,f,l)})}function Ho(i,c,l){l=Math.min(i.i.length,l);var f=i.l?A(i.l.Na,i.l,i):null;t:{var I=i.i;let R=-1;for(;;){const P=["count="+l];R==-1?0<l?(R=I[0].g,P.push("ofs="+R)):R=0:P.push("ofs="+R);let X=!0;for(let ht=0;ht<l;ht++){let K=I[ht].g;const yt=I[ht].map;if(K-=R,0>K)R=Math.max(0,I[ht].g-100),X=!1;else try{oh(yt,P,"req"+K+"_")}catch{f&&f(yt)}}if(X){f=P.join("&");break t}}}return i=i.i.splice(0,l),c.D=i,f}function Ko(i){if(!i.g&&!i.u){i.Y=1;var c=i.Fa;tn||no(),en||(tn(),en=!0),is.add(c,i),i.v=0}}function Ss(i){return i.g||i.u||3<=i.v?!1:(i.Y++,i.u=an(A(i.Fa,i),Xo(i,i.v)),i.v++,!0)}n.Fa=function(){if(this.u=null,Wo(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var i=2*this.R;this.j.info("BP detection timer enabled: "+i),this.A=an(A(this.ab,this),i)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,At(10),sr(this),Wo(this))};function Cs(i){i.A!=null&&(u.clearTimeout(i.A),i.A=null)}function Wo(i){i.g=new Xt(i,i.j,"rpc",i.Y),i.m===null&&(i.g.H=i.o),i.g.O=0;var c=$t(i.qa);Y(c,"RID","rpc"),Y(c,"SID",i.K),Y(c,"AID",i.T),Y(c,"CI",i.F?"0":"1"),!i.F&&i.ja&&Y(c,"TO",i.ja),Y(c,"TYPE","xmlhttp"),gn(i,c),i.m&&i.o&&As(c,i.m,i.o),i.L&&(i.g.I=i.L);var l=i.g;i=i.ia,l.L=1,l.v=tr($t(c)),l.m=null,l.P=!0,vo(l,i)}n.Za=function(){this.C!=null&&(this.C=null,sr(this),Ss(this),At(19))};function or(i){i.C!=null&&(u.clearTimeout(i.C),i.C=null)}function Qo(i,c){var l=null;if(i.g==c){or(i),Cs(i),i.g=null;var f=2}else if(Is(i.h,c))l=c.D,Co(i.h,c),f=1;else return;if(i.G!=0){if(c.o)if(f==1){l=c.m?c.m.length:0,c=Date.now()-c.F;var I=i.B;f=Wn(),wt(f,new _o(f,l)),ir(i)}else Ko(i);else if(I=c.s,I==3||I==0&&0<c.X||!(f==1&&lh(i,c)||f==2&&Ss(i)))switch(l&&0<l.length&&(c=i.h,c.i=c.i.concat(l)),I){case 1:ye(i,5);break;case 4:ye(i,10);break;case 3:ye(i,6);break;default:ye(i,2)}}}function Xo(i,c){let l=i.Ta+Math.floor(Math.random()*i.cb);return i.isActive()||(l*=2),l*c}function ye(i,c){if(i.j.info("Error code "+c),c==2){var l=A(i.fb,i),f=i.Xa;const I=!f;f=new _e(f||"//www.google.com/images/cleardot.gif"),u.location&&u.location.protocol=="http"||Jn(f,"https"),tr(f),I?rh(f.toString(),l):sh(f.toString(),l)}else At(2);i.G=0,i.l&&i.l.sa(c),Yo(i),zo(i)}n.fb=function(i){i?(this.j.info("Successfully pinged google.com"),At(2)):(this.j.info("Failed to ping google.com"),At(1))};function Yo(i){if(i.G=0,i.ka=[],i.l){const c=bo(i.h);(c.length!=0||i.i.length!=0)&&(k(i.ka,c),k(i.ka,i.i),i.h.i.length=0,O(i.i),i.i.length=0),i.l.ra()}}function Jo(i,c,l){var f=l instanceof _e?$t(l):new _e(l);if(f.g!="")c&&(f.g=c+"."+f.g),Zn(f,f.s);else{var I=u.location;f=I.protocol,c=c?c+"."+I.hostname:I.hostname,I=+I.port;var R=new _e(null);f&&Jn(R,f),c&&(R.g=c),I&&Zn(R,I),l&&(R.l=l),f=R}return l=i.D,c=i.ya,l&&c&&Y(f,l,c),Y(f,"VER",i.la),gn(i,f),f}function Zo(i,c,l){if(c&&!i.J)throw Error("Can't create secondary domain capable XhrIo object.");return c=i.Ca&&!i.pa?new et(new er({eb:l})):new et(i.pa),c.Ha(i.J),c}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function ta(){}n=ta.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function ar(){}ar.prototype.g=function(i,c){return new Ct(i,c)};function Ct(i,c){_t.call(this),this.g=new qo(c),this.l=i,this.h=c&&c.messageUrlParams||null,i=c&&c.messageHeaders||null,c&&c.clientProtocolHeaderRequired&&(i?i["X-Client-Protocol"]="webchannel":i={"X-Client-Protocol":"webchannel"}),this.g.o=i,i=c&&c.initMessageHeaders||null,c&&c.messageContentType&&(i?i["X-WebChannel-Content-Type"]=c.messageContentType:i={"X-WebChannel-Content-Type":c.messageContentType}),c&&c.va&&(i?i["X-WebChannel-Client-Profile"]=c.va:i={"X-WebChannel-Client-Profile":c.va}),this.g.S=i,(i=c&&c.Sb)&&!$(i)&&(this.g.m=i),this.v=c&&c.supportsCrossDomainXhr||!1,this.u=c&&c.sendRawJson||!1,(c=c&&c.httpSessionIdParam)&&!$(c)&&(this.g.D=c,i=this.h,i!==null&&c in i&&(i=this.h,c in i&&delete i[c])),this.j=new Ne(this)}V(Ct,_t),Ct.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Ct.prototype.close=function(){Rs(this.g)},Ct.prototype.o=function(i){var c=this.g;if(typeof i=="string"){var l={};l.__data__=i,i=l}else this.u&&(l={},l.__data__=fs(i),i=l);c.i.push(new Kl(c.Ya++,i)),c.G==3&&ir(c)},Ct.prototype.N=function(){this.g.l=null,delete this.j,Rs(this.g),delete this.g,Ct.aa.N.call(this)};function ea(i){ms.call(this),i.__headers__&&(this.headers=i.__headers__,this.statusCode=i.__status__,delete i.__headers__,delete i.__status__);var c=i.__sm__;if(c){t:{for(const l in c){i=l;break t}i=void 0}(this.i=i)&&(i=this.i,c=c!==null&&i in c?c[i]:void 0),this.data=c}else this.data=i}V(ea,ms);function na(){gs.call(this),this.status=1}V(na,gs);function Ne(i){this.g=i}V(Ne,ta),Ne.prototype.ua=function(){wt(this.g,"a")},Ne.prototype.ta=function(i){wt(this.g,new ea(i))},Ne.prototype.sa=function(i){wt(this.g,new na)},Ne.prototype.ra=function(){wt(this.g,"b")},ar.prototype.createWebChannel=ar.prototype.g,Ct.prototype.send=Ct.prototype.o,Ct.prototype.open=Ct.prototype.m,Ct.prototype.close=Ct.prototype.close,Lc=function(){return new ar},xc=function(){return Wn()},Mc=me,Ks={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Qn.NO_ERROR=0,Qn.TIMEOUT=8,Qn.HTTP_ERROR=6,gr=Qn,yo.COMPLETE="complete",Oc=yo,fo.EventType=sn,sn.OPEN="a",sn.CLOSE="b",sn.ERROR="c",sn.MESSAGE="d",_t.prototype.listen=_t.prototype.K,_n=fo,et.prototype.listenOnce=et.prototype.L,et.prototype.getLastError=et.prototype.Ka,et.prototype.getLastErrorCode=et.prototype.Ba,et.prototype.getStatus=et.prototype.Z,et.prototype.getResponseJson=et.prototype.Oa,et.prototype.getResponseText=et.prototype.oa,et.prototype.send=et.prototype.ea,et.prototype.setWithCredentials=et.prototype.Ha,Nc=et}).apply(typeof ur<"u"?ur:typeof self<"u"?self:typeof window<"u"?window:{});const ma="@firebase/firestore",ga="4.9.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vt{constructor(t){this.uid=t}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(t){return t.uid===this.uid}}vt.UNAUTHENTICATED=new vt(null),vt.GOOGLE_CREDENTIALS=new vt("google-credentials-uid"),vt.FIRST_PARTY=new vt("first-party-uid"),vt.MOCK_USER=new vt("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Qe="12.0.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ae=new Br("@firebase/firestore");function Me(){return Ae.logLevel}function D(n,...t){if(Ae.logLevel<=G.DEBUG){const e=t.map(vi);Ae.debug(`Firestore (${Qe}): ${n}`,...e)}}function Ht(n,...t){if(Ae.logLevel<=G.ERROR){const e=t.map(vi);Ae.error(`Firestore (${Qe}): ${n}`,...e)}}function je(n,...t){if(Ae.logLevel<=G.WARN){const e=t.map(vi);Ae.warn(`Firestore (${Qe}): ${n}`,...e)}}function vi(n){if(typeof n=="string")return n;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(e){return JSON.stringify(e)}(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function x(n,t,e){let r="Unexpected state";typeof t=="string"?r=t:e=t,Fc(n,r,e)}function Fc(n,t,e){let r=`FIRESTORE (${Qe}) INTERNAL ASSERTION FAILED: ${t} (ID: ${n.toString(16)})`;if(e!==void 0)try{r+=" CONTEXT: "+JSON.stringify(e)}catch{r+=" CONTEXT: "+e}throw Ht(r),new Error(r)}function Q(n,t,e,r){let s="Unexpected state";typeof e=="string"?s=e:r=e,n||Fc(t,s,r)}function F(n,t){return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const b={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class N extends Se{constructor(t,e){super(t,e),this.code=t,this.message=e,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ie{constructor(){this.promise=new Promise((t,e)=>{this.resolve=t,this.reject=e})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uc{constructor(t,e){this.user=e,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${t}`)}}class Yd{getToken(){return Promise.resolve(null)}invalidateToken(){}start(t,e){t.enqueueRetryable(()=>e(vt.UNAUTHENTICATED))}shutdown(){}}class Jd{constructor(t){this.token=t,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(t,e){this.changeListener=e,t.enqueueRetryable(()=>e(this.token.user))}shutdown(){this.changeListener=null}}class Zd{constructor(t){this.t=t,this.currentUser=vt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(t,e){Q(this.o===void 0,42304);let r=this.i;const s=h=>this.i!==r?(r=this.i,e(h)):Promise.resolve();let o=new ie;this.o=()=>{this.i++,this.currentUser=this.u(),o.resolve(),o=new ie,t.enqueueRetryable(()=>s(this.currentUser))};const a=()=>{const h=o;t.enqueueRetryable(async()=>{await h.promise,await s(this.currentUser)})},u=h=>{D("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=h,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit(h=>u(h)),setTimeout(()=>{if(!this.auth){const h=this.t.getImmediate({optional:!0});h?u(h):(D("FirebaseAuthCredentialsProvider","Auth not yet detected"),o.resolve(),o=new ie)}},0),a()}getToken(){const t=this.i,e=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(e).then(r=>this.i!==t?(D("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(Q(typeof r.accessToken=="string",31837,{l:r}),new Uc(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const t=this.auth&&this.auth.getUid();return Q(t===null||typeof t=="string",2055,{h:t}),new vt(t)}}class tf{constructor(t,e,r){this.P=t,this.T=e,this.I=r,this.type="FirstParty",this.user=vt.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const t=this.R();return t&&this.A.set("Authorization",t),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class ef{constructor(t,e,r){this.P=t,this.T=e,this.I=r}getToken(){return Promise.resolve(new tf(this.P,this.T,this.I))}start(t,e){t.enqueueRetryable(()=>e(vt.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class _a{constructor(t){this.value=t,this.type="AppCheck",this.headers=new Map,t&&t.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class nf{constructor(t,e){this.V=e,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Pc(t)&&t.settings.appCheckToken&&(this.p=t.settings.appCheckToken)}start(t,e){Q(this.o===void 0,3512);const r=o=>{o.error!=null&&D("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${o.error.message}`);const a=o.token!==this.m;return this.m=o.token,D("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?e(o.token):Promise.resolve()};this.o=o=>{t.enqueueRetryable(()=>r(o))};const s=o=>{D("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=o,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(o=>s(o)),setTimeout(()=>{if(!this.appCheck){const o=this.V.getImmediate({optional:!0});o?s(o):D("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new _a(this.p));const t=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(t).then(e=>e?(Q(typeof e.token=="string",44558,{tokenResult:e}),this.m=e.token,new _a(e.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rf(n){const t=typeof self<"u"&&(self.crypto||self.msCrypto),e=new Uint8Array(n);if(t&&typeof t.getRandomValues=="function")t.getRandomValues(e);else for(let r=0;r<n;r++)e[r]=Math.floor(256*Math.random());return e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ii{static newId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",e=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const s=rf(40);for(let o=0;o<s.length;++o)r.length<20&&s[o]<e&&(r+=t.charAt(s[o]%62))}return r}}function U(n,t){return n<t?-1:n>t?1:0}function Ws(n,t){const e=Math.min(n.length,t.length);for(let r=0;r<e;r++){const s=n.charAt(r),o=t.charAt(r);if(s!==o)return Os(s)===Os(o)?U(s,o):Os(s)?1:-1}return U(n.length,t.length)}const sf=55296,of=57343;function Os(n){const t=n.charCodeAt(0);return t>=sf&&t<=of}function qe(n,t,e){return n.length===t.length&&n.every((r,s)=>e(r,t[s]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ya="__name__";class Nt{constructor(t,e,r){e===void 0?e=0:e>t.length&&x(637,{offset:e,range:t.length}),r===void 0?r=t.length-e:r>t.length-e&&x(1746,{length:r,range:t.length-e}),this.segments=t,this.offset=e,this.len=r}get length(){return this.len}isEqual(t){return Nt.comparator(this,t)===0}child(t){const e=this.segments.slice(this.offset,this.limit());return t instanceof Nt?t.forEach(r=>{e.push(r)}):e.push(t),this.construct(e)}limit(){return this.offset+this.length}popFirst(t){return t=t===void 0?1:t,this.construct(this.segments,this.offset+t,this.length-t)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(t){return this.segments[this.offset+t]}isEmpty(){return this.length===0}isPrefixOf(t){if(t.length<this.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}isImmediateParentOf(t){if(this.length+1!==t.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}forEach(t){for(let e=this.offset,r=this.limit();e<r;e++)t(this.segments[e])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(t,e){const r=Math.min(t.length,e.length);for(let s=0;s<r;s++){const o=Nt.compareSegments(t.get(s),e.get(s));if(o!==0)return o}return U(t.length,e.length)}static compareSegments(t,e){const r=Nt.isNumericId(t),s=Nt.isNumericId(e);return r&&!s?-1:!r&&s?1:r&&s?Nt.extractNumericId(t).compare(Nt.extractNumericId(e)):Ws(t,e)}static isNumericId(t){return t.startsWith("__id")&&t.endsWith("__")}static extractNumericId(t){return se.fromString(t.substring(4,t.length-2))}}class Z extends Nt{construct(t,e,r){return new Z(t,e,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...t){const e=[];for(const r of t){if(r.indexOf("//")>=0)throw new N(b.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);e.push(...r.split("/").filter(s=>s.length>0))}return new Z(e)}static emptyPath(){return new Z([])}}const af=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class ft extends Nt{construct(t,e,r){return new ft(t,e,r)}static isValidIdentifier(t){return af.test(t)}canonicalString(){return this.toArray().map(t=>(t=t.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),ft.isValidIdentifier(t)||(t="`"+t+"`"),t)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===ya}static keyField(){return new ft([ya])}static fromServerFormat(t){const e=[];let r="",s=0;const o=()=>{if(r.length===0)throw new N(b.INVALID_ARGUMENT,`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);e.push(r),r=""};let a=!1;for(;s<t.length;){const u=t[s];if(u==="\\"){if(s+1===t.length)throw new N(b.INVALID_ARGUMENT,"Path has trailing escape character: "+t);const h=t[s+1];if(h!=="\\"&&h!=="."&&h!=="`")throw new N(b.INVALID_ARGUMENT,"Path has invalid escape sequence: "+t);r+=h,s+=2}else u==="`"?(a=!a,s++):u!=="."||a?(r+=u,s++):(o(),s++)}if(o(),a)throw new N(b.INVALID_ARGUMENT,"Unterminated ` in path: "+t);return new ft(e)}static emptyPath(){return new ft([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class M{constructor(t){this.path=t}static fromPath(t){return new M(Z.fromString(t))}static fromName(t){return new M(Z.fromString(t).popFirst(5))}static empty(){return new M(Z.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(t){return this.path.length>=2&&this.path.get(this.path.length-2)===t}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(t){return t!==null&&Z.comparator(this.path,t.path)===0}toString(){return this.path.toString()}static comparator(t,e){return Z.comparator(t.path,e.path)}static isDocumentKey(t){return t.length%2==0}static fromSegments(t){return new M(new Z(t.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cf(n,t,e){if(!e)throw new N(b.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${t}.`)}function uf(n,t,e,r){if(t===!0&&r===!0)throw new N(b.INVALID_ARGUMENT,`${n} and ${e} cannot be used together.`)}function Ea(n){if(!M.isDocumentKey(n))throw new N(b.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function Bc(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function wi(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const t=function(r){return r.constructor?r.constructor.name:null}(n);return t?`a custom ${t} object`:"an object"}}return typeof n=="function"?"a function":x(12329,{type:typeof n})}function oe(n,t){if("_delegate"in n&&(n=n._delegate),!(n instanceof t)){if(t.name===n.constructor.name)throw new N(b.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const e=wi(n);throw new N(b.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${e}`)}}return n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function st(n,t){const e={typeString:n};return t&&(e.value=t),e}function Un(n,t){if(!Bc(n))throw new N(b.INVALID_ARGUMENT,"JSON must be an object");let e;for(const r in t)if(t[r]){const s=t[r].typeString,o="value"in t[r]?{value:t[r].value}:void 0;if(!(r in n)){e=`JSON missing required field: '${r}'`;break}const a=n[r];if(s&&typeof a!==s){e=`JSON field '${r}' must be a ${s}.`;break}if(o!==void 0&&a!==o.value){e=`Expected '${r}' field to equal '${o.value}'`;break}}if(e)throw new N(b.INVALID_ARGUMENT,e);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ta=-62135596800,va=1e6;class J{static now(){return J.fromMillis(Date.now())}static fromDate(t){return J.fromMillis(t.getTime())}static fromMillis(t){const e=Math.floor(t/1e3),r=Math.floor((t-1e3*e)*va);return new J(e,r)}constructor(t,e){if(this.seconds=t,this.nanoseconds=e,e<0)throw new N(b.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(e>=1e9)throw new N(b.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(t<Ta)throw new N(b.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t);if(t>=253402300800)throw new N(b.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/va}_compareTo(t){return this.seconds===t.seconds?U(this.nanoseconds,t.nanoseconds):U(this.seconds,t.seconds)}isEqual(t){return t.seconds===this.seconds&&t.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:J._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(t){if(Un(t,J._jsonSchema))return new J(t.seconds,t.nanoseconds)}valueOf(){const t=this.seconds-Ta;return String(t).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}J._jsonSchemaVersion="firestore/timestamp/1.0",J._jsonSchema={type:st("string",J._jsonSchemaVersion),seconds:st("number"),nanoseconds:st("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L{static fromTimestamp(t){return new L(t)}static min(){return new L(new J(0,0))}static max(){return new L(new J(253402300799,999999999))}constructor(t){this.timestamp=t}compareTo(t){return this.timestamp._compareTo(t.timestamp)}isEqual(t){return this.timestamp.isEqual(t.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pn=-1;function lf(n,t){const e=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=L.fromTimestamp(r===1e9?new J(e+1,0):new J(e,r));return new ue(s,M.empty(),t)}function hf(n){return new ue(n.readTime,n.key,Pn)}class ue{constructor(t,e,r){this.readTime=t,this.documentKey=e,this.largestBatchId=r}static min(){return new ue(L.min(),M.empty(),Pn)}static max(){return new ue(L.max(),M.empty(),Pn)}}function df(n,t){let e=n.readTime.compareTo(t.readTime);return e!==0?e:(e=M.comparator(n.documentKey,t.documentKey),e!==0?e:U(n.largestBatchId,t.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ff="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class pf{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(t){this.onCommittedListeners.push(t)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(t=>t())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Xe(n){if(n.code!==b.FAILED_PRECONDITION||n.message!==ff)throw n;D("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class S{constructor(t){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,t(e=>{this.isDone=!0,this.result=e,this.nextCallback&&this.nextCallback(e)},e=>{this.isDone=!0,this.error=e,this.catchCallback&&this.catchCallback(e)})}catch(t){return this.next(void 0,t)}next(t,e){return this.callbackAttached&&x(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(e,this.error):this.wrapSuccess(t,this.result):new S((r,s)=>{this.nextCallback=o=>{this.wrapSuccess(t,o).next(r,s)},this.catchCallback=o=>{this.wrapFailure(e,o).next(r,s)}})}toPromise(){return new Promise((t,e)=>{this.next(t,e)})}wrapUserFunction(t){try{const e=t();return e instanceof S?e:S.resolve(e)}catch(e){return S.reject(e)}}wrapSuccess(t,e){return t?this.wrapUserFunction(()=>t(e)):S.resolve(e)}wrapFailure(t,e){return t?this.wrapUserFunction(()=>t(e)):S.reject(e)}static resolve(t){return new S((e,r)=>{e(t)})}static reject(t){return new S((e,r)=>{r(t)})}static waitFor(t){return new S((e,r)=>{let s=0,o=0,a=!1;t.forEach(u=>{++s,u.next(()=>{++o,a&&o===s&&e()},h=>r(h))}),a=!0,o===s&&e()})}static or(t){let e=S.resolve(!1);for(const r of t)e=e.next(s=>s?S.resolve(s):r());return e}static forEach(t,e){const r=[];return t.forEach((s,o)=>{r.push(e.call(this,s,o))}),this.waitFor(r)}static mapArray(t,e){return new S((r,s)=>{const o=t.length,a=new Array(o);let u=0;for(let h=0;h<o;h++){const d=h;e(t[d]).next(g=>{a[d]=g,++u,u===o&&r(a)},g=>s(g))}})}static doWhile(t,e){return new S((r,s)=>{const o=()=>{t()===!0?e().next(()=>{o()},s):r()};o()})}}function mf(n){const t=n.match(/Android ([\d.]+)/i),e=t?t[1].split(".").slice(0,2).join("."):"-1";return Number(e)}function Ye(n){return n.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jr{constructor(t,e){this.previousValue=t,e&&(e.sequenceNumberHandler=r=>this.ae(r),this.ue=r=>e.writeSequenceNumber(r))}ae(t){return this.previousValue=Math.max(t,this.previousValue),this.previousValue}next(){const t=++this.previousValue;return this.ue&&this.ue(t),t}}jr.ce=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ai=-1;function qr(n){return n==null}function Sr(n){return n===0&&1/n==-1/0}function gf(n){return typeof n=="number"&&Number.isInteger(n)&&!Sr(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $c="";function _f(n){let t="";for(let e=0;e<n.length;e++)t.length>0&&(t=Ia(t)),t=yf(n.get(e),t);return Ia(t)}function yf(n,t){let e=t;const r=n.length;for(let s=0;s<r;s++){const o=n.charAt(s);switch(o){case"\0":e+="";break;case $c:e+="";break;default:e+=o}}return e}function Ia(n){return n+$c+""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wa(n){let t=0;for(const e in n)Object.prototype.hasOwnProperty.call(n,e)&&t++;return t}function Ce(n,t){for(const e in n)Object.prototype.hasOwnProperty.call(n,e)&&t(e,n[e])}function jc(n){for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tt{constructor(t,e){this.comparator=t,this.root=e||dt.EMPTY}insert(t,e){return new tt(this.comparator,this.root.insert(t,e,this.comparator).copy(null,null,dt.BLACK,null,null))}remove(t){return new tt(this.comparator,this.root.remove(t,this.comparator).copy(null,null,dt.BLACK,null,null))}get(t){let e=this.root;for(;!e.isEmpty();){const r=this.comparator(t,e.key);if(r===0)return e.value;r<0?e=e.left:r>0&&(e=e.right)}return null}indexOf(t){let e=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(t,r.key);if(s===0)return e+r.left.size;s<0?r=r.left:(e+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(t){return this.root.inorderTraversal(t)}forEach(t){this.inorderTraversal((e,r)=>(t(e,r),!1))}toString(){const t=[];return this.inorderTraversal((e,r)=>(t.push(`${e}:${r}`),!1)),`{${t.join(", ")}}`}reverseTraversal(t){return this.root.reverseTraversal(t)}getIterator(){return new lr(this.root,null,this.comparator,!1)}getIteratorFrom(t){return new lr(this.root,t,this.comparator,!1)}getReverseIterator(){return new lr(this.root,null,this.comparator,!0)}getReverseIteratorFrom(t){return new lr(this.root,t,this.comparator,!0)}}class lr{constructor(t,e,r,s){this.isReverse=s,this.nodeStack=[];let o=1;for(;!t.isEmpty();)if(o=e?r(t.key,e):1,e&&s&&(o*=-1),o<0)t=this.isReverse?t.left:t.right;else{if(o===0){this.nodeStack.push(t);break}this.nodeStack.push(t),t=this.isReverse?t.right:t.left}}getNext(){let t=this.nodeStack.pop();const e={key:t.key,value:t.value};if(this.isReverse)for(t=t.left;!t.isEmpty();)this.nodeStack.push(t),t=t.right;else for(t=t.right;!t.isEmpty();)this.nodeStack.push(t),t=t.left;return e}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const t=this.nodeStack[this.nodeStack.length-1];return{key:t.key,value:t.value}}}class dt{constructor(t,e,r,s,o){this.key=t,this.value=e,this.color=r??dt.RED,this.left=s??dt.EMPTY,this.right=o??dt.EMPTY,this.size=this.left.size+1+this.right.size}copy(t,e,r,s,o){return new dt(t??this.key,e??this.value,r??this.color,s??this.left,o??this.right)}isEmpty(){return!1}inorderTraversal(t){return this.left.inorderTraversal(t)||t(this.key,this.value)||this.right.inorderTraversal(t)}reverseTraversal(t){return this.right.reverseTraversal(t)||t(this.key,this.value)||this.left.reverseTraversal(t)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(t,e,r){let s=this;const o=r(t,s.key);return s=o<0?s.copy(null,null,null,s.left.insert(t,e,r),null):o===0?s.copy(null,e,null,null,null):s.copy(null,null,null,null,s.right.insert(t,e,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return dt.EMPTY;let t=this;return t.left.isRed()||t.left.left.isRed()||(t=t.moveRedLeft()),t=t.copy(null,null,null,t.left.removeMin(),null),t.fixUp()}remove(t,e){let r,s=this;if(e(t,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(t,e),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),e(t,s.key)===0){if(s.right.isEmpty())return dt.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(t,e))}return s.fixUp()}isRed(){return this.color}fixUp(){let t=this;return t.right.isRed()&&!t.left.isRed()&&(t=t.rotateLeft()),t.left.isRed()&&t.left.left.isRed()&&(t=t.rotateRight()),t.left.isRed()&&t.right.isRed()&&(t=t.colorFlip()),t}moveRedLeft(){let t=this.colorFlip();return t.right.left.isRed()&&(t=t.copy(null,null,null,null,t.right.rotateRight()),t=t.rotateLeft(),t=t.colorFlip()),t}moveRedRight(){let t=this.colorFlip();return t.left.left.isRed()&&(t=t.rotateRight(),t=t.colorFlip()),t}rotateLeft(){const t=this.copy(null,null,dt.RED,null,this.right.left);return this.right.copy(null,null,this.color,t,null)}rotateRight(){const t=this.copy(null,null,dt.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,t)}colorFlip(){const t=this.left.copy(null,null,!this.left.color,null,null),e=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,t,e)}checkMaxDepth(){const t=this.check();return Math.pow(2,t)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw x(43730,{key:this.key,value:this.value});if(this.right.isRed())throw x(14113,{key:this.key,value:this.value});const t=this.left.check();if(t!==this.right.check())throw x(27949);return t+(this.isRed()?0:1)}}dt.EMPTY=null,dt.RED=!0,dt.BLACK=!1;dt.EMPTY=new class{constructor(){this.size=0}get key(){throw x(57766)}get value(){throw x(16141)}get color(){throw x(16727)}get left(){throw x(29726)}get right(){throw x(36894)}copy(t,e,r,s,o){return this}insert(t,e,r){return new dt(t,e)}remove(t,e){return this}isEmpty(){return!0}inorderTraversal(t){return!1}reverseTraversal(t){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class at{constructor(t){this.comparator=t,this.data=new tt(this.comparator)}has(t){return this.data.get(t)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(t){return this.data.indexOf(t)}forEach(t){this.data.inorderTraversal((e,r)=>(t(e),!1))}forEachInRange(t,e){const r=this.data.getIteratorFrom(t[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,t[1])>=0)return;e(s.key)}}forEachWhile(t,e){let r;for(r=e!==void 0?this.data.getIteratorFrom(e):this.data.getIterator();r.hasNext();)if(!t(r.getNext().key))return}firstAfterOrEqual(t){const e=this.data.getIteratorFrom(t);return e.hasNext()?e.getNext().key:null}getIterator(){return new Aa(this.data.getIterator())}getIteratorFrom(t){return new Aa(this.data.getIteratorFrom(t))}add(t){return this.copy(this.data.remove(t).insert(t,!0))}delete(t){return this.has(t)?this.copy(this.data.remove(t)):this}isEmpty(){return this.data.isEmpty()}unionWith(t){let e=this;return e.size<t.size&&(e=t,t=this),t.forEach(r=>{e=e.add(r)}),e}isEqual(t){if(!(t instanceof at)||this.size!==t.size)return!1;const e=this.data.getIterator(),r=t.data.getIterator();for(;e.hasNext();){const s=e.getNext().key,o=r.getNext().key;if(this.comparator(s,o)!==0)return!1}return!0}toArray(){const t=[];return this.forEach(e=>{t.push(e)}),t}toString(){const t=[];return this.forEach(e=>t.push(e)),"SortedSet("+t.toString()+")"}copy(t){const e=new at(this.comparator);return e.data=t,e}}class Aa{constructor(t){this.iter=t}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kt{constructor(t){this.fields=t,t.sort(ft.comparator)}static empty(){return new kt([])}unionWith(t){let e=new at(ft.comparator);for(const r of this.fields)e=e.add(r);for(const r of t)e=e.add(r);return new kt(e.toArray())}covers(t){for(const e of this.fields)if(e.isPrefixOf(t))return!0;return!1}isEqual(t){return qe(this.fields,t.fields,(e,r)=>e.isEqual(r))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qc extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pt{constructor(t){this.binaryString=t}static fromBase64String(t){const e=function(s){try{return atob(s)}catch(o){throw typeof DOMException<"u"&&o instanceof DOMException?new qc("Invalid base64 string: "+o):o}}(t);return new pt(e)}static fromUint8Array(t){const e=function(s){let o="";for(let a=0;a<s.length;++a)o+=String.fromCharCode(s[a]);return o}(t);return new pt(e)}[Symbol.iterator](){let t=0;return{next:()=>t<this.binaryString.length?{value:this.binaryString.charCodeAt(t++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(e){return btoa(e)}(this.binaryString)}toUint8Array(){return function(e){const r=new Uint8Array(e.length);for(let s=0;s<e.length;s++)r[s]=e.charCodeAt(s);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(t){return U(this.binaryString,t.binaryString)}isEqual(t){return this.binaryString===t.binaryString}}pt.EMPTY_BYTE_STRING=new pt("");const Ef=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function le(n){if(Q(!!n,39018),typeof n=="string"){let t=0;const e=Ef.exec(n);if(Q(!!e,46558,{timestamp:n}),e[1]){let s=e[1];s=(s+"000000000").substr(0,9),t=Number(s)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:t}}return{seconds:nt(n.seconds),nanos:nt(n.nanos)}}function nt(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function he(n){return typeof n=="string"?pt.fromBase64String(n):pt.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zc="server_timestamp",Gc="__type__",Hc="__previous_value__",Kc="__local_write_time__";function Ri(n){return(n?.mapValue?.fields||{})[Gc]?.stringValue===zc}function zr(n){const t=n.mapValue.fields[Hc];return Ri(t)?zr(t):t}function Vn(n){const t=le(n.mapValue.fields[Kc].timestampValue);return new J(t.seconds,t.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tf{constructor(t,e,r,s,o,a,u,h,d,g){this.databaseId=t,this.appId=e,this.persistenceKey=r,this.host=s,this.ssl=o,this.forceLongPolling=a,this.autoDetectLongPolling=u,this.longPollingOptions=h,this.useFetchStreams=d,this.isUsingEmulator=g}}const Cr="(default)";class kn{constructor(t,e){this.projectId=t,this.database=e||Cr}static empty(){return new kn("","")}get isDefaultDatabase(){return this.database===Cr}isEqual(t){return t instanceof kn&&t.projectId===this.projectId&&t.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wc="__type__",vf="__max__",hr={mapValue:{}},Qc="__vector__",br="value";function de(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Ri(n)?4:wf(n)?9007199254740991:If(n)?10:11:x(28295,{value:n})}function Ft(n,t){if(n===t)return!0;const e=de(n);if(e!==de(t))return!1;switch(e){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===t.booleanValue;case 4:return Vn(n).isEqual(Vn(t));case 3:return function(s,o){if(typeof s.timestampValue=="string"&&typeof o.timestampValue=="string"&&s.timestampValue.length===o.timestampValue.length)return s.timestampValue===o.timestampValue;const a=le(s.timestampValue),u=le(o.timestampValue);return a.seconds===u.seconds&&a.nanos===u.nanos}(n,t);case 5:return n.stringValue===t.stringValue;case 6:return function(s,o){return he(s.bytesValue).isEqual(he(o.bytesValue))}(n,t);case 7:return n.referenceValue===t.referenceValue;case 8:return function(s,o){return nt(s.geoPointValue.latitude)===nt(o.geoPointValue.latitude)&&nt(s.geoPointValue.longitude)===nt(o.geoPointValue.longitude)}(n,t);case 2:return function(s,o){if("integerValue"in s&&"integerValue"in o)return nt(s.integerValue)===nt(o.integerValue);if("doubleValue"in s&&"doubleValue"in o){const a=nt(s.doubleValue),u=nt(o.doubleValue);return a===u?Sr(a)===Sr(u):isNaN(a)&&isNaN(u)}return!1}(n,t);case 9:return qe(n.arrayValue.values||[],t.arrayValue.values||[],Ft);case 10:case 11:return function(s,o){const a=s.mapValue.fields||{},u=o.mapValue.fields||{};if(wa(a)!==wa(u))return!1;for(const h in a)if(a.hasOwnProperty(h)&&(u[h]===void 0||!Ft(a[h],u[h])))return!1;return!0}(n,t);default:return x(52216,{left:n})}}function Dn(n,t){return(n.values||[]).find(e=>Ft(e,t))!==void 0}function ze(n,t){if(n===t)return 0;const e=de(n),r=de(t);if(e!==r)return U(e,r);switch(e){case 0:case 9007199254740991:return 0;case 1:return U(n.booleanValue,t.booleanValue);case 2:return function(o,a){const u=nt(o.integerValue||o.doubleValue),h=nt(a.integerValue||a.doubleValue);return u<h?-1:u>h?1:u===h?0:isNaN(u)?isNaN(h)?0:-1:1}(n,t);case 3:return Ra(n.timestampValue,t.timestampValue);case 4:return Ra(Vn(n),Vn(t));case 5:return Ws(n.stringValue,t.stringValue);case 6:return function(o,a){const u=he(o),h=he(a);return u.compareTo(h)}(n.bytesValue,t.bytesValue);case 7:return function(o,a){const u=o.split("/"),h=a.split("/");for(let d=0;d<u.length&&d<h.length;d++){const g=U(u[d],h[d]);if(g!==0)return g}return U(u.length,h.length)}(n.referenceValue,t.referenceValue);case 8:return function(o,a){const u=U(nt(o.latitude),nt(a.latitude));return u!==0?u:U(nt(o.longitude),nt(a.longitude))}(n.geoPointValue,t.geoPointValue);case 9:return Sa(n.arrayValue,t.arrayValue);case 10:return function(o,a){const u=o.fields||{},h=a.fields||{},d=u[br]?.arrayValue,g=h[br]?.arrayValue,v=U(d?.values?.length||0,g?.values?.length||0);return v!==0?v:Sa(d,g)}(n.mapValue,t.mapValue);case 11:return function(o,a){if(o===hr.mapValue&&a===hr.mapValue)return 0;if(o===hr.mapValue)return 1;if(a===hr.mapValue)return-1;const u=o.fields||{},h=Object.keys(u),d=a.fields||{},g=Object.keys(d);h.sort(),g.sort();for(let v=0;v<h.length&&v<g.length;++v){const A=Ws(h[v],g[v]);if(A!==0)return A;const C=ze(u[h[v]],d[g[v]]);if(C!==0)return C}return U(h.length,g.length)}(n.mapValue,t.mapValue);default:throw x(23264,{he:e})}}function Ra(n,t){if(typeof n=="string"&&typeof t=="string"&&n.length===t.length)return U(n,t);const e=le(n),r=le(t),s=U(e.seconds,r.seconds);return s!==0?s:U(e.nanos,r.nanos)}function Sa(n,t){const e=n.values||[],r=t.values||[];for(let s=0;s<e.length&&s<r.length;++s){const o=ze(e[s],r[s]);if(o)return o}return U(e.length,r.length)}function Ge(n){return Qs(n)}function Qs(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(e){const r=le(e);return`time(${r.seconds},${r.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(e){return he(e).toBase64()}(n.bytesValue):"referenceValue"in n?function(e){return M.fromName(e).toString()}(n.referenceValue):"geoPointValue"in n?function(e){return`geo(${e.latitude},${e.longitude})`}(n.geoPointValue):"arrayValue"in n?function(e){let r="[",s=!0;for(const o of e.values||[])s?s=!1:r+=",",r+=Qs(o);return r+"]"}(n.arrayValue):"mapValue"in n?function(e){const r=Object.keys(e.fields||{}).sort();let s="{",o=!0;for(const a of r)o?o=!1:s+=",",s+=`${a}:${Qs(e.fields[a])}`;return s+"}"}(n.mapValue):x(61005,{value:n})}function _r(n){switch(de(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const t=zr(n);return t?16+_r(t):16;case 5:return 2*n.stringValue.length;case 6:return he(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return function(r){return(r.values||[]).reduce((s,o)=>s+_r(o),0)}(n.arrayValue);case 10:case 11:return function(r){let s=0;return Ce(r.fields,(o,a)=>{s+=o.length+_r(a)}),s}(n.mapValue);default:throw x(13486,{value:n})}}function Xs(n){return!!n&&"integerValue"in n}function Si(n){return!!n&&"arrayValue"in n}function Ca(n){return!!n&&"nullValue"in n}function ba(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function yr(n){return!!n&&"mapValue"in n}function If(n){return(n?.mapValue?.fields||{})[Wc]?.stringValue===Qc}function In(n){if(n.geoPointValue)return{geoPointValue:{...n.geoPointValue}};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:{...n.timestampValue}};if(n.mapValue){const t={mapValue:{fields:{}}};return Ce(n.mapValue.fields,(e,r)=>t.mapValue.fields[e]=In(r)),t}if(n.arrayValue){const t={arrayValue:{values:[]}};for(let e=0;e<(n.arrayValue.values||[]).length;++e)t.arrayValue.values[e]=In(n.arrayValue.values[e]);return t}return{...n}}function wf(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===vf}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bt{constructor(t){this.value=t}static empty(){return new bt({mapValue:{}})}field(t){if(t.isEmpty())return this.value;{let e=this.value;for(let r=0;r<t.length-1;++r)if(e=(e.mapValue.fields||{})[t.get(r)],!yr(e))return null;return e=(e.mapValue.fields||{})[t.lastSegment()],e||null}}set(t,e){this.getFieldsMap(t.popLast())[t.lastSegment()]=In(e)}setAll(t){let e=ft.emptyPath(),r={},s=[];t.forEach((a,u)=>{if(!e.isImmediateParentOf(u)){const h=this.getFieldsMap(e);this.applyChanges(h,r,s),r={},s=[],e=u.popLast()}a?r[u.lastSegment()]=In(a):s.push(u.lastSegment())});const o=this.getFieldsMap(e);this.applyChanges(o,r,s)}delete(t){const e=this.field(t.popLast());yr(e)&&e.mapValue.fields&&delete e.mapValue.fields[t.lastSegment()]}isEqual(t){return Ft(this.value,t.value)}getFieldsMap(t){let e=this.value;e.mapValue.fields||(e.mapValue={fields:{}});for(let r=0;r<t.length;++r){let s=e.mapValue.fields[t.get(r)];yr(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},e.mapValue.fields[t.get(r)]=s),e=s}return e.mapValue.fields}applyChanges(t,e,r){Ce(e,(s,o)=>t[s]=o);for(const s of r)delete t[s]}clone(){return new bt(In(this.value))}}function Xc(n){const t=[];return Ce(n.fields,(e,r)=>{const s=new ft([e]);if(yr(r)){const o=Xc(r.mapValue).fields;if(o.length===0)t.push(s);else for(const a of o)t.push(s.child(a))}else t.push(s)}),new kt(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class It{constructor(t,e,r,s,o,a,u){this.key=t,this.documentType=e,this.version=r,this.readTime=s,this.createTime=o,this.data=a,this.documentState=u}static newInvalidDocument(t){return new It(t,0,L.min(),L.min(),L.min(),bt.empty(),0)}static newFoundDocument(t,e,r,s){return new It(t,1,e,L.min(),r,s,0)}static newNoDocument(t,e){return new It(t,2,e,L.min(),L.min(),bt.empty(),0)}static newUnknownDocument(t,e){return new It(t,3,e,L.min(),L.min(),bt.empty(),2)}convertToFoundDocument(t,e){return!this.createTime.isEqual(L.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=t),this.version=t,this.documentType=1,this.data=e,this.documentState=0,this}convertToNoDocument(t){return this.version=t,this.documentType=2,this.data=bt.empty(),this.documentState=0,this}convertToUnknownDocument(t){return this.version=t,this.documentType=3,this.data=bt.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=L.min(),this}setReadTime(t){return this.readTime=t,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(t){return t instanceof It&&this.key.isEqual(t.key)&&this.version.isEqual(t.version)&&this.documentType===t.documentType&&this.documentState===t.documentState&&this.data.isEqual(t.data)}mutableCopy(){return new It(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pr{constructor(t,e){this.position=t,this.inclusive=e}}function Pa(n,t,e){let r=0;for(let s=0;s<n.position.length;s++){const o=t[s],a=n.position[s];if(o.field.isKeyField()?r=M.comparator(M.fromName(a.referenceValue),e.key):r=ze(a,e.data.field(o.field)),o.dir==="desc"&&(r*=-1),r!==0)break}return r}function Va(n,t){if(n===null)return t===null;if(t===null||n.inclusive!==t.inclusive||n.position.length!==t.position.length)return!1;for(let e=0;e<n.position.length;e++)if(!Ft(n.position[e],t.position[e]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vr{constructor(t,e="asc"){this.field=t,this.dir=e}}function Af(n,t){return n.dir===t.dir&&n.field.isEqual(t.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yc{}class it extends Yc{constructor(t,e,r){super(),this.field=t,this.op=e,this.value=r}static create(t,e,r){return t.isKeyField()?e==="in"||e==="not-in"?this.createKeyFieldInFilter(t,e,r):new Sf(t,e,r):e==="array-contains"?new Pf(t,r):e==="in"?new Vf(t,r):e==="not-in"?new kf(t,r):e==="array-contains-any"?new Df(t,r):new it(t,e,r)}static createKeyFieldInFilter(t,e,r){return e==="in"?new Cf(t,r):new bf(t,r)}matches(t){const e=t.data.field(this.field);return this.op==="!="?e!==null&&e.nullValue===void 0&&this.matchesComparison(ze(e,this.value)):e!==null&&de(this.value)===de(e)&&this.matchesComparison(ze(e,this.value))}matchesComparison(t){switch(this.op){case"<":return t<0;case"<=":return t<=0;case"==":return t===0;case"!=":return t!==0;case">":return t>0;case">=":return t>=0;default:return x(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Ut extends Yc{constructor(t,e){super(),this.filters=t,this.op=e,this.Pe=null}static create(t,e){return new Ut(t,e)}matches(t){return Jc(this)?this.filters.find(e=>!e.matches(t))===void 0:this.filters.find(e=>e.matches(t))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce((t,e)=>t.concat(e.getFlattenedFilters()),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function Jc(n){return n.op==="and"}function Zc(n){return Rf(n)&&Jc(n)}function Rf(n){for(const t of n.filters)if(t instanceof Ut)return!1;return!0}function Ys(n){if(n instanceof it)return n.field.canonicalString()+n.op.toString()+Ge(n.value);if(Zc(n))return n.filters.map(t=>Ys(t)).join(",");{const t=n.filters.map(e=>Ys(e)).join(",");return`${n.op}(${t})`}}function tu(n,t){return n instanceof it?function(r,s){return s instanceof it&&r.op===s.op&&r.field.isEqual(s.field)&&Ft(r.value,s.value)}(n,t):n instanceof Ut?function(r,s){return s instanceof Ut&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce((o,a,u)=>o&&tu(a,s.filters[u]),!0):!1}(n,t):void x(19439)}function eu(n){return n instanceof it?function(e){return`${e.field.canonicalString()} ${e.op} ${Ge(e.value)}`}(n):n instanceof Ut?function(e){return e.op.toString()+" {"+e.getFilters().map(eu).join(" ,")+"}"}(n):"Filter"}class Sf extends it{constructor(t,e,r){super(t,e,r),this.key=M.fromName(r.referenceValue)}matches(t){const e=M.comparator(t.key,this.key);return this.matchesComparison(e)}}class Cf extends it{constructor(t,e){super(t,"in",e),this.keys=nu("in",e)}matches(t){return this.keys.some(e=>e.isEqual(t.key))}}class bf extends it{constructor(t,e){super(t,"not-in",e),this.keys=nu("not-in",e)}matches(t){return!this.keys.some(e=>e.isEqual(t.key))}}function nu(n,t){return(t.arrayValue?.values||[]).map(e=>M.fromName(e.referenceValue))}class Pf extends it{constructor(t,e){super(t,"array-contains",e)}matches(t){const e=t.data.field(this.field);return Si(e)&&Dn(e.arrayValue,this.value)}}class Vf extends it{constructor(t,e){super(t,"in",e)}matches(t){const e=t.data.field(this.field);return e!==null&&Dn(this.value.arrayValue,e)}}class kf extends it{constructor(t,e){super(t,"not-in",e)}matches(t){if(Dn(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const e=t.data.field(this.field);return e!==null&&e.nullValue===void 0&&!Dn(this.value.arrayValue,e)}}class Df extends it{constructor(t,e){super(t,"array-contains-any",e)}matches(t){const e=t.data.field(this.field);return!(!Si(e)||!e.arrayValue.values)&&e.arrayValue.values.some(r=>Dn(this.value.arrayValue,r))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nf{constructor(t,e=null,r=[],s=[],o=null,a=null,u=null){this.path=t,this.collectionGroup=e,this.orderBy=r,this.filters=s,this.limit=o,this.startAt=a,this.endAt=u,this.Te=null}}function ka(n,t=null,e=[],r=[],s=null,o=null,a=null){return new Nf(n,t,e,r,s,o,a)}function Ci(n){const t=F(n);if(t.Te===null){let e=t.path.canonicalString();t.collectionGroup!==null&&(e+="|cg:"+t.collectionGroup),e+="|f:",e+=t.filters.map(r=>Ys(r)).join(","),e+="|ob:",e+=t.orderBy.map(r=>function(o){return o.field.canonicalString()+o.dir}(r)).join(","),qr(t.limit)||(e+="|l:",e+=t.limit),t.startAt&&(e+="|lb:",e+=t.startAt.inclusive?"b:":"a:",e+=t.startAt.position.map(r=>Ge(r)).join(",")),t.endAt&&(e+="|ub:",e+=t.endAt.inclusive?"a:":"b:",e+=t.endAt.position.map(r=>Ge(r)).join(",")),t.Te=e}return t.Te}function bi(n,t){if(n.limit!==t.limit||n.orderBy.length!==t.orderBy.length)return!1;for(let e=0;e<n.orderBy.length;e++)if(!Af(n.orderBy[e],t.orderBy[e]))return!1;if(n.filters.length!==t.filters.length)return!1;for(let e=0;e<n.filters.length;e++)if(!tu(n.filters[e],t.filters[e]))return!1;return n.collectionGroup===t.collectionGroup&&!!n.path.isEqual(t.path)&&!!Va(n.startAt,t.startAt)&&Va(n.endAt,t.endAt)}function Js(n){return M.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gr{constructor(t,e=null,r=[],s=[],o=null,a="F",u=null,h=null){this.path=t,this.collectionGroup=e,this.explicitOrderBy=r,this.filters=s,this.limit=o,this.limitType=a,this.startAt=u,this.endAt=h,this.Ie=null,this.Ee=null,this.de=null,this.startAt,this.endAt}}function Of(n,t,e,r,s,o,a,u){return new Gr(n,t,e,r,s,o,a,u)}function Hr(n){return new Gr(n)}function Da(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function Mf(n){return n.collectionGroup!==null}function wn(n){const t=F(n);if(t.Ie===null){t.Ie=[];const e=new Set;for(const o of t.explicitOrderBy)t.Ie.push(o),e.add(o.field.canonicalString());const r=t.explicitOrderBy.length>0?t.explicitOrderBy[t.explicitOrderBy.length-1].dir:"asc";(function(a){let u=new at(ft.comparator);return a.filters.forEach(h=>{h.getFlattenedFilters().forEach(d=>{d.isInequality()&&(u=u.add(d.field))})}),u})(t).forEach(o=>{e.has(o.canonicalString())||o.isKeyField()||t.Ie.push(new Vr(o,r))}),e.has(ft.keyField().canonicalString())||t.Ie.push(new Vr(ft.keyField(),r))}return t.Ie}function Ot(n){const t=F(n);return t.Ee||(t.Ee=xf(t,wn(n))),t.Ee}function xf(n,t){if(n.limitType==="F")return ka(n.path,n.collectionGroup,t,n.filters,n.limit,n.startAt,n.endAt);{t=t.map(s=>{const o=s.dir==="desc"?"asc":"desc";return new Vr(s.field,o)});const e=n.endAt?new Pr(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new Pr(n.startAt.position,n.startAt.inclusive):null;return ka(n.path,n.collectionGroup,t,n.filters,n.limit,e,r)}}function Zs(n,t,e){return new Gr(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),t,e,n.startAt,n.endAt)}function Kr(n,t){return bi(Ot(n),Ot(t))&&n.limitType===t.limitType}function ru(n){return`${Ci(Ot(n))}|lt:${n.limitType}`}function xe(n){return`Query(target=${function(e){let r=e.path.canonicalString();return e.collectionGroup!==null&&(r+=" collectionGroup="+e.collectionGroup),e.filters.length>0&&(r+=`, filters: [${e.filters.map(s=>eu(s)).join(", ")}]`),qr(e.limit)||(r+=", limit: "+e.limit),e.orderBy.length>0&&(r+=`, orderBy: [${e.orderBy.map(s=>function(a){return`${a.field.canonicalString()} (${a.dir})`}(s)).join(", ")}]`),e.startAt&&(r+=", startAt: ",r+=e.startAt.inclusive?"b:":"a:",r+=e.startAt.position.map(s=>Ge(s)).join(",")),e.endAt&&(r+=", endAt: ",r+=e.endAt.inclusive?"a:":"b:",r+=e.endAt.position.map(s=>Ge(s)).join(",")),`Target(${r})`}(Ot(n))}; limitType=${n.limitType})`}function Wr(n,t){return t.isFoundDocument()&&function(r,s){const o=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(o):M.isDocumentKey(r.path)?r.path.isEqual(o):r.path.isImmediateParentOf(o)}(n,t)&&function(r,s){for(const o of wn(r))if(!o.field.isKeyField()&&s.data.field(o.field)===null)return!1;return!0}(n,t)&&function(r,s){for(const o of r.filters)if(!o.matches(s))return!1;return!0}(n,t)&&function(r,s){return!(r.startAt&&!function(a,u,h){const d=Pa(a,u,h);return a.inclusive?d<=0:d<0}(r.startAt,wn(r),s)||r.endAt&&!function(a,u,h){const d=Pa(a,u,h);return a.inclusive?d>=0:d>0}(r.endAt,wn(r),s))}(n,t)}function Lf(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function su(n){return(t,e)=>{let r=!1;for(const s of wn(n)){const o=Ff(s,t,e);if(o!==0)return o;r=r||s.field.isKeyField()}return 0}}function Ff(n,t,e){const r=n.field.isKeyField()?M.comparator(t.key,e.key):function(o,a,u){const h=a.data.field(o),d=u.data.field(o);return h!==null&&d!==null?ze(h,d):x(42886)}(n.field,t,e);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return x(19790,{direction:n.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class be{constructor(t,e){this.mapKeyFn=t,this.equalsFn=e,this.inner={},this.innerSize=0}get(t){const e=this.mapKeyFn(t),r=this.inner[e];if(r!==void 0){for(const[s,o]of r)if(this.equalsFn(s,t))return o}}has(t){return this.get(t)!==void 0}set(t,e){const r=this.mapKeyFn(t),s=this.inner[r];if(s===void 0)return this.inner[r]=[[t,e]],void this.innerSize++;for(let o=0;o<s.length;o++)if(this.equalsFn(s[o][0],t))return void(s[o]=[t,e]);s.push([t,e]),this.innerSize++}delete(t){const e=this.mapKeyFn(t),r=this.inner[e];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],t))return r.length===1?delete this.inner[e]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(t){Ce(this.inner,(e,r)=>{for(const[s,o]of r)t(s,o)})}isEmpty(){return jc(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Uf=new tt(M.comparator);function Kt(){return Uf}const iu=new tt(M.comparator);function yn(...n){let t=iu;for(const e of n)t=t.insert(e.key,e);return t}function ou(n){let t=iu;return n.forEach((e,r)=>t=t.insert(e,r.overlayedDocument)),t}function Te(){return An()}function au(){return An()}function An(){return new be(n=>n.toString(),(n,t)=>n.isEqual(t))}const Bf=new tt(M.comparator),$f=new at(M.comparator);function B(...n){let t=$f;for(const e of n)t=t.add(e);return t}const jf=new at(U);function qf(){return jf}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pi(n,t){if(n.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Sr(t)?"-0":t}}function cu(n){return{integerValue:""+n}}function zf(n,t){return gf(t)?cu(t):Pi(n,t)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qr{constructor(){this._=void 0}}function Gf(n,t,e){return n instanceof kr?function(s,o){const a={fields:{[Gc]:{stringValue:zc},[Kc]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return o&&Ri(o)&&(o=zr(o)),o&&(a.fields[Hc]=o),{mapValue:a}}(e,t):n instanceof Nn?lu(n,t):n instanceof On?hu(n,t):function(s,o){const a=uu(s,o),u=Na(a)+Na(s.Ae);return Xs(a)&&Xs(s.Ae)?cu(u):Pi(s.serializer,u)}(n,t)}function Hf(n,t,e){return n instanceof Nn?lu(n,t):n instanceof On?hu(n,t):e}function uu(n,t){return n instanceof Dr?function(r){return Xs(r)||function(o){return!!o&&"doubleValue"in o}(r)}(t)?t:{integerValue:0}:null}class kr extends Qr{}class Nn extends Qr{constructor(t){super(),this.elements=t}}function lu(n,t){const e=du(t);for(const r of n.elements)e.some(s=>Ft(s,r))||e.push(r);return{arrayValue:{values:e}}}class On extends Qr{constructor(t){super(),this.elements=t}}function hu(n,t){let e=du(t);for(const r of n.elements)e=e.filter(s=>!Ft(s,r));return{arrayValue:{values:e}}}class Dr extends Qr{constructor(t,e){super(),this.serializer=t,this.Ae=e}}function Na(n){return nt(n.integerValue||n.doubleValue)}function du(n){return Si(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function Kf(n,t){return n.field.isEqual(t.field)&&function(r,s){return r instanceof Nn&&s instanceof Nn||r instanceof On&&s instanceof On?qe(r.elements,s.elements,Ft):r instanceof Dr&&s instanceof Dr?Ft(r.Ae,s.Ae):r instanceof kr&&s instanceof kr}(n.transform,t.transform)}class Wf{constructor(t,e){this.version=t,this.transformResults=e}}class zt{constructor(t,e){this.updateTime=t,this.exists=e}static none(){return new zt}static exists(t){return new zt(void 0,t)}static updateTime(t){return new zt(t)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(t){return this.exists===t.exists&&(this.updateTime?!!t.updateTime&&this.updateTime.isEqual(t.updateTime):!t.updateTime)}}function Er(n,t){return n.updateTime!==void 0?t.isFoundDocument()&&t.version.isEqual(n.updateTime):n.exists===void 0||n.exists===t.isFoundDocument()}class Xr{}function fu(n,t){if(!n.hasLocalMutations||t&&t.fields.length===0)return null;if(t===null)return n.isNoDocument()?new mu(n.key,zt.none()):new Bn(n.key,n.data,zt.none());{const e=n.data,r=bt.empty();let s=new at(ft.comparator);for(let o of t.fields)if(!s.has(o)){let a=e.field(o);a===null&&o.length>1&&(o=o.popLast(),a=e.field(o)),a===null?r.delete(o):r.set(o,a),s=s.add(o)}return new Pe(n.key,r,new kt(s.toArray()),zt.none())}}function Qf(n,t,e){n instanceof Bn?function(s,o,a){const u=s.value.clone(),h=Ma(s.fieldTransforms,o,a.transformResults);u.setAll(h),o.convertToFoundDocument(a.version,u).setHasCommittedMutations()}(n,t,e):n instanceof Pe?function(s,o,a){if(!Er(s.precondition,o))return void o.convertToUnknownDocument(a.version);const u=Ma(s.fieldTransforms,o,a.transformResults),h=o.data;h.setAll(pu(s)),h.setAll(u),o.convertToFoundDocument(a.version,h).setHasCommittedMutations()}(n,t,e):function(s,o,a){o.convertToNoDocument(a.version).setHasCommittedMutations()}(0,t,e)}function Rn(n,t,e,r){return n instanceof Bn?function(o,a,u,h){if(!Er(o.precondition,a))return u;const d=o.value.clone(),g=xa(o.fieldTransforms,h,a);return d.setAll(g),a.convertToFoundDocument(a.version,d).setHasLocalMutations(),null}(n,t,e,r):n instanceof Pe?function(o,a,u,h){if(!Er(o.precondition,a))return u;const d=xa(o.fieldTransforms,h,a),g=a.data;return g.setAll(pu(o)),g.setAll(d),a.convertToFoundDocument(a.version,g).setHasLocalMutations(),u===null?null:u.unionWith(o.fieldMask.fields).unionWith(o.fieldTransforms.map(v=>v.field))}(n,t,e,r):function(o,a,u){return Er(o.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):u}(n,t,e)}function Xf(n,t){let e=null;for(const r of n.fieldTransforms){const s=t.data.field(r.field),o=uu(r.transform,s||null);o!=null&&(e===null&&(e=bt.empty()),e.set(r.field,o))}return e||null}function Oa(n,t){return n.type===t.type&&!!n.key.isEqual(t.key)&&!!n.precondition.isEqual(t.precondition)&&!!function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&qe(r,s,(o,a)=>Kf(o,a))}(n.fieldTransforms,t.fieldTransforms)&&(n.type===0?n.value.isEqual(t.value):n.type!==1||n.data.isEqual(t.data)&&n.fieldMask.isEqual(t.fieldMask))}class Bn extends Xr{constructor(t,e,r,s=[]){super(),this.key=t,this.value=e,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class Pe extends Xr{constructor(t,e,r,s,o=[]){super(),this.key=t,this.data=e,this.fieldMask=r,this.precondition=s,this.fieldTransforms=o,this.type=1}getFieldMask(){return this.fieldMask}}function pu(n){const t=new Map;return n.fieldMask.fields.forEach(e=>{if(!e.isEmpty()){const r=n.data.field(e);t.set(e,r)}}),t}function Ma(n,t,e){const r=new Map;Q(n.length===e.length,32656,{Re:e.length,Ve:n.length});for(let s=0;s<e.length;s++){const o=n[s],a=o.transform,u=t.data.field(o.field);r.set(o.field,Hf(a,u,e[s]))}return r}function xa(n,t,e){const r=new Map;for(const s of n){const o=s.transform,a=e.data.field(s.field);r.set(s.field,Gf(o,a,t))}return r}class mu extends Xr{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Yf extends Xr{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jf{constructor(t,e,r,s){this.batchId=t,this.localWriteTime=e,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(t,e){const r=e.mutationResults;for(let s=0;s<this.mutations.length;s++){const o=this.mutations[s];o.key.isEqual(t.key)&&Qf(o,t,r[s])}}applyToLocalView(t,e){for(const r of this.baseMutations)r.key.isEqual(t.key)&&(e=Rn(r,t,e,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(t.key)&&(e=Rn(r,t,e,this.localWriteTime));return e}applyToLocalDocumentSet(t,e){const r=au();return this.mutations.forEach(s=>{const o=t.get(s.key),a=o.overlayedDocument;let u=this.applyToLocalView(a,o.mutatedFields);u=e.has(s.key)?null:u;const h=fu(a,u);h!==null&&r.set(s.key,h),a.isValidDocument()||a.convertToNoDocument(L.min())}),r}keys(){return this.mutations.reduce((t,e)=>t.add(e.key),B())}isEqual(t){return this.batchId===t.batchId&&qe(this.mutations,t.mutations,(e,r)=>Oa(e,r))&&qe(this.baseMutations,t.baseMutations,(e,r)=>Oa(e,r))}}class Vi{constructor(t,e,r,s){this.batch=t,this.commitVersion=e,this.mutationResults=r,this.docVersions=s}static from(t,e,r){Q(t.mutations.length===r.length,58842,{me:t.mutations.length,fe:r.length});let s=function(){return Bf}();const o=t.mutations;for(let a=0;a<o.length;a++)s=s.insert(o[a].key,r[a].version);return new Vi(t,e,r,s)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zf{constructor(t,e){this.largestBatchId=t,this.mutation=e}getKey(){return this.mutation.key}isEqual(t){return t!==null&&this.mutation===t.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tp{constructor(t,e){this.count=t,this.unchangedNames=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var rt,z;function ep(n){switch(n){case b.OK:return x(64938);case b.CANCELLED:case b.UNKNOWN:case b.DEADLINE_EXCEEDED:case b.RESOURCE_EXHAUSTED:case b.INTERNAL:case b.UNAVAILABLE:case b.UNAUTHENTICATED:return!1;case b.INVALID_ARGUMENT:case b.NOT_FOUND:case b.ALREADY_EXISTS:case b.PERMISSION_DENIED:case b.FAILED_PRECONDITION:case b.ABORTED:case b.OUT_OF_RANGE:case b.UNIMPLEMENTED:case b.DATA_LOSS:return!0;default:return x(15467,{code:n})}}function gu(n){if(n===void 0)return Ht("GRPC error has no .code"),b.UNKNOWN;switch(n){case rt.OK:return b.OK;case rt.CANCELLED:return b.CANCELLED;case rt.UNKNOWN:return b.UNKNOWN;case rt.DEADLINE_EXCEEDED:return b.DEADLINE_EXCEEDED;case rt.RESOURCE_EXHAUSTED:return b.RESOURCE_EXHAUSTED;case rt.INTERNAL:return b.INTERNAL;case rt.UNAVAILABLE:return b.UNAVAILABLE;case rt.UNAUTHENTICATED:return b.UNAUTHENTICATED;case rt.INVALID_ARGUMENT:return b.INVALID_ARGUMENT;case rt.NOT_FOUND:return b.NOT_FOUND;case rt.ALREADY_EXISTS:return b.ALREADY_EXISTS;case rt.PERMISSION_DENIED:return b.PERMISSION_DENIED;case rt.FAILED_PRECONDITION:return b.FAILED_PRECONDITION;case rt.ABORTED:return b.ABORTED;case rt.OUT_OF_RANGE:return b.OUT_OF_RANGE;case rt.UNIMPLEMENTED:return b.UNIMPLEMENTED;case rt.DATA_LOSS:return b.DATA_LOSS;default:return x(39323,{code:n})}}(z=rt||(rt={}))[z.OK=0]="OK",z[z.CANCELLED=1]="CANCELLED",z[z.UNKNOWN=2]="UNKNOWN",z[z.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",z[z.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",z[z.NOT_FOUND=5]="NOT_FOUND",z[z.ALREADY_EXISTS=6]="ALREADY_EXISTS",z[z.PERMISSION_DENIED=7]="PERMISSION_DENIED",z[z.UNAUTHENTICATED=16]="UNAUTHENTICATED",z[z.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",z[z.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",z[z.ABORTED=10]="ABORTED",z[z.OUT_OF_RANGE=11]="OUT_OF_RANGE",z[z.UNIMPLEMENTED=12]="UNIMPLEMENTED",z[z.INTERNAL=13]="INTERNAL",z[z.UNAVAILABLE=14]="UNAVAILABLE",z[z.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function np(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rp=new se([4294967295,4294967295],0);function La(n){const t=np().encode(n),e=new Dc;return e.update(t),new Uint8Array(e.digest())}function Fa(n){const t=new DataView(n.buffer),e=t.getUint32(0,!0),r=t.getUint32(4,!0),s=t.getUint32(8,!0),o=t.getUint32(12,!0);return[new se([e,r],0),new se([s,o],0)]}class ki{constructor(t,e,r){if(this.bitmap=t,this.padding=e,this.hashCount=r,e<0||e>=8)throw new En(`Invalid padding: ${e}`);if(r<0)throw new En(`Invalid hash count: ${r}`);if(t.length>0&&this.hashCount===0)throw new En(`Invalid hash count: ${r}`);if(t.length===0&&e!==0)throw new En(`Invalid padding when bitmap length is 0: ${e}`);this.ge=8*t.length-e,this.pe=se.fromNumber(this.ge)}ye(t,e,r){let s=t.add(e.multiply(se.fromNumber(r)));return s.compare(rp)===1&&(s=new se([s.getBits(0),s.getBits(1)],0)),s.modulo(this.pe).toNumber()}we(t){return!!(this.bitmap[Math.floor(t/8)]&1<<t%8)}mightContain(t){if(this.ge===0)return!1;const e=La(t),[r,s]=Fa(e);for(let o=0;o<this.hashCount;o++){const a=this.ye(r,s,o);if(!this.we(a))return!1}return!0}static create(t,e,r){const s=t%8==0?0:8-t%8,o=new Uint8Array(Math.ceil(t/8)),a=new ki(o,s,e);return r.forEach(u=>a.insert(u)),a}insert(t){if(this.ge===0)return;const e=La(t),[r,s]=Fa(e);for(let o=0;o<this.hashCount;o++){const a=this.ye(r,s,o);this.Se(a)}}Se(t){const e=Math.floor(t/8),r=t%8;this.bitmap[e]|=1<<r}}class En extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yr{constructor(t,e,r,s,o){this.snapshotVersion=t,this.targetChanges=e,this.targetMismatches=r,this.documentUpdates=s,this.resolvedLimboDocuments=o}static createSynthesizedRemoteEventForCurrentChange(t,e,r){const s=new Map;return s.set(t,$n.createSynthesizedTargetChangeForCurrentChange(t,e,r)),new Yr(L.min(),s,new tt(U),Kt(),B())}}class $n{constructor(t,e,r,s,o){this.resumeToken=t,this.current=e,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=o}static createSynthesizedTargetChangeForCurrentChange(t,e,r){return new $n(r,e,B(),B(),B())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tr{constructor(t,e,r,s){this.be=t,this.removedTargetIds=e,this.key=r,this.De=s}}class _u{constructor(t,e){this.targetId=t,this.Ce=e}}class yu{constructor(t,e,r=pt.EMPTY_BYTE_STRING,s=null){this.state=t,this.targetIds=e,this.resumeToken=r,this.cause=s}}class Ua{constructor(){this.ve=0,this.Fe=Ba(),this.Me=pt.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(t){t.approximateByteSize()>0&&(this.Oe=!0,this.Me=t)}ke(){let t=B(),e=B(),r=B();return this.Fe.forEach((s,o)=>{switch(o){case 0:t=t.add(s);break;case 2:e=e.add(s);break;case 1:r=r.add(s);break;default:x(38017,{changeType:o})}}),new $n(this.Me,this.xe,t,e,r)}qe(){this.Oe=!1,this.Fe=Ba()}Qe(t,e){this.Oe=!0,this.Fe=this.Fe.insert(t,e)}$e(t){this.Oe=!0,this.Fe=this.Fe.remove(t)}Ue(){this.ve+=1}Ke(){this.ve-=1,Q(this.ve>=0,3241,{ve:this.ve})}We(){this.Oe=!0,this.xe=!0}}class sp{constructor(t){this.Ge=t,this.ze=new Map,this.je=Kt(),this.Je=dr(),this.He=dr(),this.Ye=new tt(U)}Ze(t){for(const e of t.be)t.De&&t.De.isFoundDocument()?this.Xe(e,t.De):this.et(e,t.key,t.De);for(const e of t.removedTargetIds)this.et(e,t.key,t.De)}tt(t){this.forEachTarget(t,e=>{const r=this.nt(e);switch(t.state){case 0:this.rt(e)&&r.Le(t.resumeToken);break;case 1:r.Ke(),r.Ne||r.qe(),r.Le(t.resumeToken);break;case 2:r.Ke(),r.Ne||this.removeTarget(e);break;case 3:this.rt(e)&&(r.We(),r.Le(t.resumeToken));break;case 4:this.rt(e)&&(this.it(e),r.Le(t.resumeToken));break;default:x(56790,{state:t.state})}})}forEachTarget(t,e){t.targetIds.length>0?t.targetIds.forEach(e):this.ze.forEach((r,s)=>{this.rt(s)&&e(s)})}st(t){const e=t.targetId,r=t.Ce.count,s=this.ot(e);if(s){const o=s.target;if(Js(o))if(r===0){const a=new M(o.path);this.et(e,a,It.newNoDocument(a,L.min()))}else Q(r===1,20013,{expectedCount:r});else{const a=this._t(e);if(a!==r){const u=this.ut(t),h=u?this.ct(u,t,a):1;if(h!==0){this.it(e);const d=h===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ye=this.Ye.insert(e,d)}}}}}ut(t){const e=t.Ce.unchangedNames;if(!e||!e.bits)return null;const{bits:{bitmap:r="",padding:s=0},hashCount:o=0}=e;let a,u;try{a=he(r).toUint8Array()}catch(h){if(h instanceof qc)return je("Decoding the base64 bloom filter in existence filter failed ("+h.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw h}try{u=new ki(a,s,o)}catch(h){return je(h instanceof En?"BloomFilter error: ":"Applying bloom filter failed: ",h),null}return u.ge===0?null:u}ct(t,e,r){return e.Ce.count===r-this.Pt(t,e.targetId)?0:2}Pt(t,e){const r=this.Ge.getRemoteKeysForTarget(e);let s=0;return r.forEach(o=>{const a=this.Ge.ht(),u=`projects/${a.projectId}/databases/${a.database}/documents/${o.path.canonicalString()}`;t.mightContain(u)||(this.et(e,o,null),s++)}),s}Tt(t){const e=new Map;this.ze.forEach((o,a)=>{const u=this.ot(a);if(u){if(o.current&&Js(u.target)){const h=new M(u.target.path);this.It(h).has(a)||this.Et(a,h)||this.et(a,h,It.newNoDocument(h,t))}o.Be&&(e.set(a,o.ke()),o.qe())}});let r=B();this.He.forEach((o,a)=>{let u=!0;a.forEachWhile(h=>{const d=this.ot(h);return!d||d.purpose==="TargetPurposeLimboResolution"||(u=!1,!1)}),u&&(r=r.add(o))}),this.je.forEach((o,a)=>a.setReadTime(t));const s=new Yr(t,e,this.Ye,this.je,r);return this.je=Kt(),this.Je=dr(),this.He=dr(),this.Ye=new tt(U),s}Xe(t,e){if(!this.rt(t))return;const r=this.Et(t,e.key)?2:0;this.nt(t).Qe(e.key,r),this.je=this.je.insert(e.key,e),this.Je=this.Je.insert(e.key,this.It(e.key).add(t)),this.He=this.He.insert(e.key,this.dt(e.key).add(t))}et(t,e,r){if(!this.rt(t))return;const s=this.nt(t);this.Et(t,e)?s.Qe(e,1):s.$e(e),this.He=this.He.insert(e,this.dt(e).delete(t)),this.He=this.He.insert(e,this.dt(e).add(t)),r&&(this.je=this.je.insert(e,r))}removeTarget(t){this.ze.delete(t)}_t(t){const e=this.nt(t).ke();return this.Ge.getRemoteKeysForTarget(t).size+e.addedDocuments.size-e.removedDocuments.size}Ue(t){this.nt(t).Ue()}nt(t){let e=this.ze.get(t);return e||(e=new Ua,this.ze.set(t,e)),e}dt(t){let e=this.He.get(t);return e||(e=new at(U),this.He=this.He.insert(t,e)),e}It(t){let e=this.Je.get(t);return e||(e=new at(U),this.Je=this.Je.insert(t,e)),e}rt(t){const e=this.ot(t)!==null;return e||D("WatchChangeAggregator","Detected inactive target",t),e}ot(t){const e=this.ze.get(t);return e&&e.Ne?null:this.Ge.At(t)}it(t){this.ze.set(t,new Ua),this.Ge.getRemoteKeysForTarget(t).forEach(e=>{this.et(t,e,null)})}Et(t,e){return this.Ge.getRemoteKeysForTarget(t).has(e)}}function dr(){return new tt(M.comparator)}function Ba(){return new tt(M.comparator)}const ip={asc:"ASCENDING",desc:"DESCENDING"},op={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},ap={and:"AND",or:"OR"};class cp{constructor(t,e){this.databaseId=t,this.useProto3Json=e}}function ti(n,t){return n.useProto3Json||qr(t)?t:{value:t}}function Nr(n,t){return n.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function Eu(n,t){return n.useProto3Json?t.toBase64():t.toUint8Array()}function up(n,t){return Nr(n,t.toTimestamp())}function Mt(n){return Q(!!n,49232),L.fromTimestamp(function(e){const r=le(e);return new J(r.seconds,r.nanos)}(n))}function Di(n,t){return ei(n,t).canonicalString()}function ei(n,t){const e=function(s){return new Z(["projects",s.projectId,"databases",s.database])}(n).child("documents");return t===void 0?e:e.child(t)}function Tu(n){const t=Z.fromString(n);return Q(Ru(t),10190,{key:t.toString()}),t}function ni(n,t){return Di(n.databaseId,t.path)}function Ms(n,t){const e=Tu(t);if(e.get(1)!==n.databaseId.projectId)throw new N(b.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+e.get(1)+" vs "+n.databaseId.projectId);if(e.get(3)!==n.databaseId.database)throw new N(b.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+e.get(3)+" vs "+n.databaseId.database);return new M(Iu(e))}function vu(n,t){return Di(n.databaseId,t)}function lp(n){const t=Tu(n);return t.length===4?Z.emptyPath():Iu(t)}function ri(n){return new Z(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Iu(n){return Q(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function $a(n,t,e){return{name:ni(n,t),fields:e.value.mapValue.fields}}function hp(n,t){let e;if("targetChange"in t){t.targetChange;const r=function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:x(39313,{state:d})}(t.targetChange.targetChangeType||"NO_CHANGE"),s=t.targetChange.targetIds||[],o=function(d,g){return d.useProto3Json?(Q(g===void 0||typeof g=="string",58123),pt.fromBase64String(g||"")):(Q(g===void 0||g instanceof Buffer||g instanceof Uint8Array,16193),pt.fromUint8Array(g||new Uint8Array))}(n,t.targetChange.resumeToken),a=t.targetChange.cause,u=a&&function(d){const g=d.code===void 0?b.UNKNOWN:gu(d.code);return new N(g,d.message||"")}(a);e=new yu(r,s,o,u||null)}else if("documentChange"in t){t.documentChange;const r=t.documentChange;r.document,r.document.name,r.document.updateTime;const s=Ms(n,r.document.name),o=Mt(r.document.updateTime),a=r.document.createTime?Mt(r.document.createTime):L.min(),u=new bt({mapValue:{fields:r.document.fields}}),h=It.newFoundDocument(s,o,a,u),d=r.targetIds||[],g=r.removedTargetIds||[];e=new Tr(d,g,h.key,h)}else if("documentDelete"in t){t.documentDelete;const r=t.documentDelete;r.document;const s=Ms(n,r.document),o=r.readTime?Mt(r.readTime):L.min(),a=It.newNoDocument(s,o),u=r.removedTargetIds||[];e=new Tr([],u,a.key,a)}else if("documentRemove"in t){t.documentRemove;const r=t.documentRemove;r.document;const s=Ms(n,r.document),o=r.removedTargetIds||[];e=new Tr([],o,s,null)}else{if(!("filter"in t))return x(11601,{Rt:t});{t.filter;const r=t.filter;r.targetId;const{count:s=0,unchangedNames:o}=r,a=new tp(s,o),u=r.targetId;e=new _u(u,a)}}return e}function dp(n,t){let e;if(t instanceof Bn)e={update:$a(n,t.key,t.value)};else if(t instanceof mu)e={delete:ni(n,t.key)};else if(t instanceof Pe)e={update:$a(n,t.key,t.data),updateMask:vp(t.fieldMask)};else{if(!(t instanceof Yf))return x(16599,{Vt:t.type});e={verify:ni(n,t.key)}}return t.fieldTransforms.length>0&&(e.updateTransforms=t.fieldTransforms.map(r=>function(o,a){const u=a.transform;if(u instanceof kr)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(u instanceof Nn)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:u.elements}};if(u instanceof On)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:u.elements}};if(u instanceof Dr)return{fieldPath:a.field.canonicalString(),increment:u.Ae};throw x(20930,{transform:a.transform})}(0,r))),t.precondition.isNone||(e.currentDocument=function(s,o){return o.updateTime!==void 0?{updateTime:up(s,o.updateTime)}:o.exists!==void 0?{exists:o.exists}:x(27497)}(n,t.precondition)),e}function fp(n,t){return n&&n.length>0?(Q(t!==void 0,14353),n.map(e=>function(s,o){let a=s.updateTime?Mt(s.updateTime):Mt(o);return a.isEqual(L.min())&&(a=Mt(o)),new Wf(a,s.transformResults||[])}(e,t))):[]}function pp(n,t){return{documents:[vu(n,t.path)]}}function mp(n,t){const e={structuredQuery:{}},r=t.path;let s;t.collectionGroup!==null?(s=r,e.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(s=r.popLast(),e.structuredQuery.from=[{collectionId:r.lastSegment()}]),e.parent=vu(n,s);const o=function(d){if(d.length!==0)return Au(Ut.create(d,"and"))}(t.filters);o&&(e.structuredQuery.where=o);const a=function(d){if(d.length!==0)return d.map(g=>function(A){return{field:Le(A.field),direction:yp(A.dir)}}(g))}(t.orderBy);a&&(e.structuredQuery.orderBy=a);const u=ti(n,t.limit);return u!==null&&(e.structuredQuery.limit=u),t.startAt&&(e.structuredQuery.startAt=function(d){return{before:d.inclusive,values:d.position}}(t.startAt)),t.endAt&&(e.structuredQuery.endAt=function(d){return{before:!d.inclusive,values:d.position}}(t.endAt)),{ft:e,parent:s}}function gp(n){let t=lp(n.parent);const e=n.structuredQuery,r=e.from?e.from.length:0;let s=null;if(r>0){Q(r===1,65062);const g=e.from[0];g.allDescendants?s=g.collectionId:t=t.child(g.collectionId)}let o=[];e.where&&(o=function(v){const A=wu(v);return A instanceof Ut&&Zc(A)?A.getFilters():[A]}(e.where));let a=[];e.orderBy&&(a=function(v){return v.map(A=>function(V){return new Vr(Fe(V.field),function(k){switch(k){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(V.direction))}(A))}(e.orderBy));let u=null;e.limit&&(u=function(v){let A;return A=typeof v=="object"?v.value:v,qr(A)?null:A}(e.limit));let h=null;e.startAt&&(h=function(v){const A=!!v.before,C=v.values||[];return new Pr(C,A)}(e.startAt));let d=null;return e.endAt&&(d=function(v){const A=!v.before,C=v.values||[];return new Pr(C,A)}(e.endAt)),Of(t,s,a,o,u,"F",h,d)}function _p(n,t){const e=function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return x(28987,{purpose:s})}}(t.purpose);return e==null?null:{"goog-listen-tags":e}}function wu(n){return n.unaryFilter!==void 0?function(e){switch(e.unaryFilter.op){case"IS_NAN":const r=Fe(e.unaryFilter.field);return it.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=Fe(e.unaryFilter.field);return it.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const o=Fe(e.unaryFilter.field);return it.create(o,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=Fe(e.unaryFilter.field);return it.create(a,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return x(61313);default:return x(60726)}}(n):n.fieldFilter!==void 0?function(e){return it.create(Fe(e.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return x(58110);default:return x(50506)}}(e.fieldFilter.op),e.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(e){return Ut.create(e.compositeFilter.filters.map(r=>wu(r)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return x(1026)}}(e.compositeFilter.op))}(n):x(30097,{filter:n})}function yp(n){return ip[n]}function Ep(n){return op[n]}function Tp(n){return ap[n]}function Le(n){return{fieldPath:n.canonicalString()}}function Fe(n){return ft.fromServerFormat(n.fieldPath)}function Au(n){return n instanceof it?function(e){if(e.op==="=="){if(ba(e.value))return{unaryFilter:{field:Le(e.field),op:"IS_NAN"}};if(Ca(e.value))return{unaryFilter:{field:Le(e.field),op:"IS_NULL"}}}else if(e.op==="!="){if(ba(e.value))return{unaryFilter:{field:Le(e.field),op:"IS_NOT_NAN"}};if(Ca(e.value))return{unaryFilter:{field:Le(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Le(e.field),op:Ep(e.op),value:e.value}}}(n):n instanceof Ut?function(e){const r=e.getFilters().map(s=>Au(s));return r.length===1?r[0]:{compositeFilter:{op:Tp(e.op),filters:r}}}(n):x(54877,{filter:n})}function vp(n){const t=[];return n.fields.forEach(e=>t.push(e.canonicalString())),{fieldPaths:t}}function Ru(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class te{constructor(t,e,r,s,o=L.min(),a=L.min(),u=pt.EMPTY_BYTE_STRING,h=null){this.target=t,this.targetId=e,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=o,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=u,this.expectedCount=h}withSequenceNumber(t){return new te(this.target,this.targetId,this.purpose,t,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(t,e){return new te(this.target,this.targetId,this.purpose,this.sequenceNumber,e,this.lastLimboFreeSnapshotVersion,t,null)}withExpectedCount(t){return new te(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,t)}withLastLimboFreeSnapshotVersion(t){return new te(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,t,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ip{constructor(t){this.yt=t}}function wp(n){const t=gp({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Zs(t,t.limit,"L"):t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ap{constructor(){this.Cn=new Rp}addToCollectionParentIndex(t,e){return this.Cn.add(e),S.resolve()}getCollectionParents(t,e){return S.resolve(this.Cn.getEntries(e))}addFieldIndex(t,e){return S.resolve()}deleteFieldIndex(t,e){return S.resolve()}deleteAllFieldIndexes(t){return S.resolve()}createTargetIndexes(t,e){return S.resolve()}getDocumentsMatchingTarget(t,e){return S.resolve(null)}getIndexType(t,e){return S.resolve(0)}getFieldIndexes(t,e){return S.resolve([])}getNextCollectionGroupToUpdate(t){return S.resolve(null)}getMinOffset(t,e){return S.resolve(ue.min())}getMinOffsetFromCollectionGroup(t,e){return S.resolve(ue.min())}updateCollectionGroup(t,e,r){return S.resolve()}updateIndexEntries(t,e){return S.resolve()}}class Rp{constructor(){this.index={}}add(t){const e=t.lastSegment(),r=t.popLast(),s=this.index[e]||new at(Z.comparator),o=!s.has(r);return this.index[e]=s.add(r),o}has(t){const e=t.lastSegment(),r=t.popLast(),s=this.index[e];return s&&s.has(r)}getEntries(t){return(this.index[t]||new at(Z.comparator)).toArray()}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ja={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Su=41943040;class Rt{static withCacheSize(t){return new Rt(t,Rt.DEFAULT_COLLECTION_PERCENTILE,Rt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(t,e,r){this.cacheSizeCollectionThreshold=t,this.percentileToCollect=e,this.maximumSequenceNumbersToCollect=r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Rt.DEFAULT_COLLECTION_PERCENTILE=10,Rt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Rt.DEFAULT=new Rt(Su,Rt.DEFAULT_COLLECTION_PERCENTILE,Rt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Rt.DISABLED=new Rt(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class He{constructor(t){this.ar=t}next(){return this.ar+=2,this.ar}static ur(){return new He(0)}static cr(){return new He(-1)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qa="LruGarbageCollector",Sp=1048576;function za([n,t],[e,r]){const s=U(n,e);return s===0?U(t,r):s}class Cp{constructor(t){this.Ir=t,this.buffer=new at(za),this.Er=0}dr(){return++this.Er}Ar(t){const e=[t,this.dr()];if(this.buffer.size<this.Ir)this.buffer=this.buffer.add(e);else{const r=this.buffer.last();za(e,r)<0&&(this.buffer=this.buffer.delete(r).add(e))}}get maxValue(){return this.buffer.last()[0]}}class bp{constructor(t,e,r){this.garbageCollector=t,this.asyncQueue=e,this.localStore=r,this.Rr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Vr(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return this.Rr!==null}Vr(t){D(qa,`Garbage collection scheduled in ${t}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",t,async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(e){Ye(e)?D(qa,"Ignoring IndexedDB error during garbage collection: ",e):await Xe(e)}await this.Vr(3e5)})}}class Pp{constructor(t,e){this.mr=t,this.params=e}calculateTargetCount(t,e){return this.mr.gr(t).next(r=>Math.floor(e/100*r))}nthSequenceNumber(t,e){if(e===0)return S.resolve(jr.ce);const r=new Cp(e);return this.mr.forEachTarget(t,s=>r.Ar(s.sequenceNumber)).next(()=>this.mr.pr(t,s=>r.Ar(s))).next(()=>r.maxValue)}removeTargets(t,e,r){return this.mr.removeTargets(t,e,r)}removeOrphanedDocuments(t,e){return this.mr.removeOrphanedDocuments(t,e)}collect(t,e){return this.params.cacheSizeCollectionThreshold===-1?(D("LruGarbageCollector","Garbage collection skipped; disabled"),S.resolve(ja)):this.getCacheSize(t).next(r=>r<this.params.cacheSizeCollectionThreshold?(D("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),ja):this.yr(t,e))}getCacheSize(t){return this.mr.getCacheSize(t)}yr(t,e){let r,s,o,a,u,h,d;const g=Date.now();return this.calculateTargetCount(t,this.params.percentileToCollect).next(v=>(v>this.params.maximumSequenceNumbersToCollect?(D("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${v}`),s=this.params.maximumSequenceNumbersToCollect):s=v,a=Date.now(),this.nthSequenceNumber(t,s))).next(v=>(r=v,u=Date.now(),this.removeTargets(t,r,e))).next(v=>(o=v,h=Date.now(),this.removeOrphanedDocuments(t,r))).next(v=>(d=Date.now(),Me()<=G.DEBUG&&D("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${a-g}ms
	Determined least recently used ${s} in `+(u-a)+`ms
	Removed ${o} targets in `+(h-u)+`ms
	Removed ${v} documents in `+(d-h)+`ms
Total Duration: ${d-g}ms`),S.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:o,documentsRemoved:v})))}}function Vp(n,t){return new Pp(n,t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kp{constructor(){this.changes=new be(t=>t.toString(),(t,e)=>t.isEqual(e)),this.changesApplied=!1}addEntry(t){this.assertNotApplied(),this.changes.set(t.key,t)}removeEntry(t,e){this.assertNotApplied(),this.changes.set(t,It.newInvalidDocument(t).setReadTime(e))}getEntry(t,e){this.assertNotApplied();const r=this.changes.get(e);return r!==void 0?S.resolve(r):this.getFromCache(t,e)}getEntries(t,e){return this.getAllFromCache(t,e)}apply(t){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(t)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dp{constructor(t,e){this.overlayedDocument=t,this.mutatedFields=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Np{constructor(t,e,r,s){this.remoteDocumentCache=t,this.mutationQueue=e,this.documentOverlayCache=r,this.indexManager=s}getDocument(t,e){let r=null;return this.documentOverlayCache.getOverlay(t,e).next(s=>(r=s,this.remoteDocumentCache.getEntry(t,e))).next(s=>(r!==null&&Rn(r.mutation,s,kt.empty(),J.now()),s))}getDocuments(t,e){return this.remoteDocumentCache.getEntries(t,e).next(r=>this.getLocalViewOfDocuments(t,r,B()).next(()=>r))}getLocalViewOfDocuments(t,e,r=B()){const s=Te();return this.populateOverlays(t,s,e).next(()=>this.computeViews(t,e,s,r).next(o=>{let a=yn();return o.forEach((u,h)=>{a=a.insert(u,h.overlayedDocument)}),a}))}getOverlayedDocuments(t,e){const r=Te();return this.populateOverlays(t,r,e).next(()=>this.computeViews(t,e,r,B()))}populateOverlays(t,e,r){const s=[];return r.forEach(o=>{e.has(o)||s.push(o)}),this.documentOverlayCache.getOverlays(t,s).next(o=>{o.forEach((a,u)=>{e.set(a,u)})})}computeViews(t,e,r,s){let o=Kt();const a=An(),u=function(){return An()}();return e.forEach((h,d)=>{const g=r.get(d.key);s.has(d.key)&&(g===void 0||g.mutation instanceof Pe)?o=o.insert(d.key,d):g!==void 0?(a.set(d.key,g.mutation.getFieldMask()),Rn(g.mutation,d,g.mutation.getFieldMask(),J.now())):a.set(d.key,kt.empty())}),this.recalculateAndSaveOverlays(t,o).next(h=>(h.forEach((d,g)=>a.set(d,g)),e.forEach((d,g)=>u.set(d,new Dp(g,a.get(d)??null))),u))}recalculateAndSaveOverlays(t,e){const r=An();let s=new tt((a,u)=>a-u),o=B();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(t,e).next(a=>{for(const u of a)u.keys().forEach(h=>{const d=e.get(h);if(d===null)return;let g=r.get(h)||kt.empty();g=u.applyToLocalView(d,g),r.set(h,g);const v=(s.get(u.batchId)||B()).add(h);s=s.insert(u.batchId,v)})}).next(()=>{const a=[],u=s.getReverseIterator();for(;u.hasNext();){const h=u.getNext(),d=h.key,g=h.value,v=au();g.forEach(A=>{if(!o.has(A)){const C=fu(e.get(A),r.get(A));C!==null&&v.set(A,C),o=o.add(A)}}),a.push(this.documentOverlayCache.saveOverlays(t,d,v))}return S.waitFor(a)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(t,e){return this.remoteDocumentCache.getEntries(t,e).next(r=>this.recalculateAndSaveOverlays(t,r))}getDocumentsMatchingQuery(t,e,r,s){return function(a){return M.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0}(e)?this.getDocumentsMatchingDocumentQuery(t,e.path):Mf(e)?this.getDocumentsMatchingCollectionGroupQuery(t,e,r,s):this.getDocumentsMatchingCollectionQuery(t,e,r,s)}getNextDocuments(t,e,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(t,e,r,s).next(o=>{const a=s-o.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(t,e,r.largestBatchId,s-o.size):S.resolve(Te());let u=Pn,h=o;return a.next(d=>S.forEach(d,(g,v)=>(u<v.largestBatchId&&(u=v.largestBatchId),o.get(g)?S.resolve():this.remoteDocumentCache.getEntry(t,g).next(A=>{h=h.insert(g,A)}))).next(()=>this.populateOverlays(t,d,o)).next(()=>this.computeViews(t,h,d,B())).next(g=>({batchId:u,changes:ou(g)})))})}getDocumentsMatchingDocumentQuery(t,e){return this.getDocument(t,new M(e)).next(r=>{let s=yn();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s})}getDocumentsMatchingCollectionGroupQuery(t,e,r,s){const o=e.collectionGroup;let a=yn();return this.indexManager.getCollectionParents(t,o).next(u=>S.forEach(u,h=>{const d=function(v,A){return new Gr(A,null,v.explicitOrderBy.slice(),v.filters.slice(),v.limit,v.limitType,v.startAt,v.endAt)}(e,h.child(o));return this.getDocumentsMatchingCollectionQuery(t,d,r,s).next(g=>{g.forEach((v,A)=>{a=a.insert(v,A)})})}).next(()=>a))}getDocumentsMatchingCollectionQuery(t,e,r,s){let o;return this.documentOverlayCache.getOverlaysForCollection(t,e.path,r.largestBatchId).next(a=>(o=a,this.remoteDocumentCache.getDocumentsMatchingQuery(t,e,r,o,s))).next(a=>{o.forEach((h,d)=>{const g=d.getKey();a.get(g)===null&&(a=a.insert(g,It.newInvalidDocument(g)))});let u=yn();return a.forEach((h,d)=>{const g=o.get(h);g!==void 0&&Rn(g.mutation,d,kt.empty(),J.now()),Wr(e,d)&&(u=u.insert(h,d))}),u})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Op{constructor(t){this.serializer=t,this.Lr=new Map,this.kr=new Map}getBundleMetadata(t,e){return S.resolve(this.Lr.get(e))}saveBundleMetadata(t,e){return this.Lr.set(e.id,function(s){return{id:s.id,version:s.version,createTime:Mt(s.createTime)}}(e)),S.resolve()}getNamedQuery(t,e){return S.resolve(this.kr.get(e))}saveNamedQuery(t,e){return this.kr.set(e.name,function(s){return{name:s.name,query:wp(s.bundledQuery),readTime:Mt(s.readTime)}}(e)),S.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mp{constructor(){this.overlays=new tt(M.comparator),this.qr=new Map}getOverlay(t,e){return S.resolve(this.overlays.get(e))}getOverlays(t,e){const r=Te();return S.forEach(e,s=>this.getOverlay(t,s).next(o=>{o!==null&&r.set(s,o)})).next(()=>r)}saveOverlays(t,e,r){return r.forEach((s,o)=>{this.St(t,e,o)}),S.resolve()}removeOverlaysForBatchId(t,e,r){const s=this.qr.get(r);return s!==void 0&&(s.forEach(o=>this.overlays=this.overlays.remove(o)),this.qr.delete(r)),S.resolve()}getOverlaysForCollection(t,e,r){const s=Te(),o=e.length+1,a=new M(e.child("")),u=this.overlays.getIteratorFrom(a);for(;u.hasNext();){const h=u.getNext().value,d=h.getKey();if(!e.isPrefixOf(d.path))break;d.path.length===o&&h.largestBatchId>r&&s.set(h.getKey(),h)}return S.resolve(s)}getOverlaysForCollectionGroup(t,e,r,s){let o=new tt((d,g)=>d-g);const a=this.overlays.getIterator();for(;a.hasNext();){const d=a.getNext().value;if(d.getKey().getCollectionGroup()===e&&d.largestBatchId>r){let g=o.get(d.largestBatchId);g===null&&(g=Te(),o=o.insert(d.largestBatchId,g)),g.set(d.getKey(),d)}}const u=Te(),h=o.getIterator();for(;h.hasNext()&&(h.getNext().value.forEach((d,g)=>u.set(d,g)),!(u.size()>=s)););return S.resolve(u)}St(t,e,r){const s=this.overlays.get(r.key);if(s!==null){const a=this.qr.get(s.largestBatchId).delete(r.key);this.qr.set(s.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new Zf(e,r));let o=this.qr.get(e);o===void 0&&(o=B(),this.qr.set(e,o)),this.qr.set(e,o.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xp{constructor(){this.sessionToken=pt.EMPTY_BYTE_STRING}getSessionToken(t){return S.resolve(this.sessionToken)}setSessionToken(t,e){return this.sessionToken=e,S.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ni{constructor(){this.Qr=new at(ut.$r),this.Ur=new at(ut.Kr)}isEmpty(){return this.Qr.isEmpty()}addReference(t,e){const r=new ut(t,e);this.Qr=this.Qr.add(r),this.Ur=this.Ur.add(r)}Wr(t,e){t.forEach(r=>this.addReference(r,e))}removeReference(t,e){this.Gr(new ut(t,e))}zr(t,e){t.forEach(r=>this.removeReference(r,e))}jr(t){const e=new M(new Z([])),r=new ut(e,t),s=new ut(e,t+1),o=[];return this.Ur.forEachInRange([r,s],a=>{this.Gr(a),o.push(a.key)}),o}Jr(){this.Qr.forEach(t=>this.Gr(t))}Gr(t){this.Qr=this.Qr.delete(t),this.Ur=this.Ur.delete(t)}Hr(t){const e=new M(new Z([])),r=new ut(e,t),s=new ut(e,t+1);let o=B();return this.Ur.forEachInRange([r,s],a=>{o=o.add(a.key)}),o}containsKey(t){const e=new ut(t,0),r=this.Qr.firstAfterOrEqual(e);return r!==null&&t.isEqual(r.key)}}class ut{constructor(t,e){this.key=t,this.Yr=e}static $r(t,e){return M.comparator(t.key,e.key)||U(t.Yr,e.Yr)}static Kr(t,e){return U(t.Yr,e.Yr)||M.comparator(t.key,e.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lp{constructor(t,e){this.indexManager=t,this.referenceDelegate=e,this.mutationQueue=[],this.tr=1,this.Zr=new at(ut.$r)}checkEmpty(t){return S.resolve(this.mutationQueue.length===0)}addMutationBatch(t,e,r,s){const o=this.tr;this.tr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new Jf(o,e,r,s);this.mutationQueue.push(a);for(const u of s)this.Zr=this.Zr.add(new ut(u.key,o)),this.indexManager.addToCollectionParentIndex(t,u.key.path.popLast());return S.resolve(a)}lookupMutationBatch(t,e){return S.resolve(this.Xr(e))}getNextMutationBatchAfterBatchId(t,e){const r=e+1,s=this.ei(r),o=s<0?0:s;return S.resolve(this.mutationQueue.length>o?this.mutationQueue[o]:null)}getHighestUnacknowledgedBatchId(){return S.resolve(this.mutationQueue.length===0?Ai:this.tr-1)}getAllMutationBatches(t){return S.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(t,e){const r=new ut(e,0),s=new ut(e,Number.POSITIVE_INFINITY),o=[];return this.Zr.forEachInRange([r,s],a=>{const u=this.Xr(a.Yr);o.push(u)}),S.resolve(o)}getAllMutationBatchesAffectingDocumentKeys(t,e){let r=new at(U);return e.forEach(s=>{const o=new ut(s,0),a=new ut(s,Number.POSITIVE_INFINITY);this.Zr.forEachInRange([o,a],u=>{r=r.add(u.Yr)})}),S.resolve(this.ti(r))}getAllMutationBatchesAffectingQuery(t,e){const r=e.path,s=r.length+1;let o=r;M.isDocumentKey(o)||(o=o.child(""));const a=new ut(new M(o),0);let u=new at(U);return this.Zr.forEachWhile(h=>{const d=h.key.path;return!!r.isPrefixOf(d)&&(d.length===s&&(u=u.add(h.Yr)),!0)},a),S.resolve(this.ti(u))}ti(t){const e=[];return t.forEach(r=>{const s=this.Xr(r);s!==null&&e.push(s)}),e}removeMutationBatch(t,e){Q(this.ni(e.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.Zr;return S.forEach(e.mutations,s=>{const o=new ut(s.key,e.batchId);return r=r.delete(o),this.referenceDelegate.markPotentiallyOrphaned(t,s.key)}).next(()=>{this.Zr=r})}ir(t){}containsKey(t,e){const r=new ut(e,0),s=this.Zr.firstAfterOrEqual(r);return S.resolve(e.isEqual(s&&s.key))}performConsistencyCheck(t){return this.mutationQueue.length,S.resolve()}ni(t,e){return this.ei(t)}ei(t){return this.mutationQueue.length===0?0:t-this.mutationQueue[0].batchId}Xr(t){const e=this.ei(t);return e<0||e>=this.mutationQueue.length?null:this.mutationQueue[e]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fp{constructor(t){this.ri=t,this.docs=function(){return new tt(M.comparator)}(),this.size=0}setIndexManager(t){this.indexManager=t}addEntry(t,e){const r=e.key,s=this.docs.get(r),o=s?s.size:0,a=this.ri(e);return this.docs=this.docs.insert(r,{document:e.mutableCopy(),size:a}),this.size+=a-o,this.indexManager.addToCollectionParentIndex(t,r.path.popLast())}removeEntry(t){const e=this.docs.get(t);e&&(this.docs=this.docs.remove(t),this.size-=e.size)}getEntry(t,e){const r=this.docs.get(e);return S.resolve(r?r.document.mutableCopy():It.newInvalidDocument(e))}getEntries(t,e){let r=Kt();return e.forEach(s=>{const o=this.docs.get(s);r=r.insert(s,o?o.document.mutableCopy():It.newInvalidDocument(s))}),S.resolve(r)}getDocumentsMatchingQuery(t,e,r,s){let o=Kt();const a=e.path,u=new M(a.child("__id-9223372036854775808__")),h=this.docs.getIteratorFrom(u);for(;h.hasNext();){const{key:d,value:{document:g}}=h.getNext();if(!a.isPrefixOf(d.path))break;d.path.length>a.length+1||df(hf(g),r)<=0||(s.has(g.key)||Wr(e,g))&&(o=o.insert(g.key,g.mutableCopy()))}return S.resolve(o)}getAllFromCollectionGroup(t,e,r,s){x(9500)}ii(t,e){return S.forEach(this.docs,r=>e(r))}newChangeBuffer(t){return new Up(this)}getSize(t){return S.resolve(this.size)}}class Up extends kp{constructor(t){super(),this.Nr=t}applyChanges(t){const e=[];return this.changes.forEach((r,s)=>{s.isValidDocument()?e.push(this.Nr.addEntry(t,s)):this.Nr.removeEntry(r)}),S.waitFor(e)}getFromCache(t,e){return this.Nr.getEntry(t,e)}getAllFromCache(t,e){return this.Nr.getEntries(t,e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bp{constructor(t){this.persistence=t,this.si=new be(e=>Ci(e),bi),this.lastRemoteSnapshotVersion=L.min(),this.highestTargetId=0,this.oi=0,this._i=new Ni,this.targetCount=0,this.ai=He.ur()}forEachTarget(t,e){return this.si.forEach((r,s)=>e(s)),S.resolve()}getLastRemoteSnapshotVersion(t){return S.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(t){return S.resolve(this.oi)}allocateTargetId(t){return this.highestTargetId=this.ai.next(),S.resolve(this.highestTargetId)}setTargetsMetadata(t,e,r){return r&&(this.lastRemoteSnapshotVersion=r),e>this.oi&&(this.oi=e),S.resolve()}Pr(t){this.si.set(t.target,t);const e=t.targetId;e>this.highestTargetId&&(this.ai=new He(e),this.highestTargetId=e),t.sequenceNumber>this.oi&&(this.oi=t.sequenceNumber)}addTargetData(t,e){return this.Pr(e),this.targetCount+=1,S.resolve()}updateTargetData(t,e){return this.Pr(e),S.resolve()}removeTargetData(t,e){return this.si.delete(e.target),this._i.jr(e.targetId),this.targetCount-=1,S.resolve()}removeTargets(t,e,r){let s=0;const o=[];return this.si.forEach((a,u)=>{u.sequenceNumber<=e&&r.get(u.targetId)===null&&(this.si.delete(a),o.push(this.removeMatchingKeysForTargetId(t,u.targetId)),s++)}),S.waitFor(o).next(()=>s)}getTargetCount(t){return S.resolve(this.targetCount)}getTargetData(t,e){const r=this.si.get(e)||null;return S.resolve(r)}addMatchingKeys(t,e,r){return this._i.Wr(e,r),S.resolve()}removeMatchingKeys(t,e,r){this._i.zr(e,r);const s=this.persistence.referenceDelegate,o=[];return s&&e.forEach(a=>{o.push(s.markPotentiallyOrphaned(t,a))}),S.waitFor(o)}removeMatchingKeysForTargetId(t,e){return this._i.jr(e),S.resolve()}getMatchingKeysForTargetId(t,e){const r=this._i.Hr(e);return S.resolve(r)}containsKey(t,e){return S.resolve(this._i.containsKey(e))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cu{constructor(t,e){this.ui={},this.overlays={},this.ci=new jr(0),this.li=!1,this.li=!0,this.hi=new xp,this.referenceDelegate=t(this),this.Pi=new Bp(this),this.indexManager=new Ap,this.remoteDocumentCache=function(s){return new Fp(s)}(r=>this.referenceDelegate.Ti(r)),this.serializer=new Ip(e),this.Ii=new Op(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.li=!1,Promise.resolve()}get started(){return this.li}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(t){return this.indexManager}getDocumentOverlayCache(t){let e=this.overlays[t.toKey()];return e||(e=new Mp,this.overlays[t.toKey()]=e),e}getMutationQueue(t,e){let r=this.ui[t.toKey()];return r||(r=new Lp(e,this.referenceDelegate),this.ui[t.toKey()]=r),r}getGlobalsCache(){return this.hi}getTargetCache(){return this.Pi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ii}runTransaction(t,e,r){D("MemoryPersistence","Starting transaction:",t);const s=new $p(this.ci.next());return this.referenceDelegate.Ei(),r(s).next(o=>this.referenceDelegate.di(s).next(()=>o)).toPromise().then(o=>(s.raiseOnCommittedEvent(),o))}Ai(t,e){return S.or(Object.values(this.ui).map(r=>()=>r.containsKey(t,e)))}}class $p extends pf{constructor(t){super(),this.currentSequenceNumber=t}}class Oi{constructor(t){this.persistence=t,this.Ri=new Ni,this.Vi=null}static mi(t){return new Oi(t)}get fi(){if(this.Vi)return this.Vi;throw x(60996)}addReference(t,e,r){return this.Ri.addReference(r,e),this.fi.delete(r.toString()),S.resolve()}removeReference(t,e,r){return this.Ri.removeReference(r,e),this.fi.add(r.toString()),S.resolve()}markPotentiallyOrphaned(t,e){return this.fi.add(e.toString()),S.resolve()}removeTarget(t,e){this.Ri.jr(e.targetId).forEach(s=>this.fi.add(s.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(t,e.targetId).next(s=>{s.forEach(o=>this.fi.add(o.toString()))}).next(()=>r.removeTargetData(t,e))}Ei(){this.Vi=new Set}di(t){const e=this.persistence.getRemoteDocumentCache().newChangeBuffer();return S.forEach(this.fi,r=>{const s=M.fromPath(r);return this.gi(t,s).next(o=>{o||e.removeEntry(s,L.min())})}).next(()=>(this.Vi=null,e.apply(t)))}updateLimboDocument(t,e){return this.gi(t,e).next(r=>{r?this.fi.delete(e.toString()):this.fi.add(e.toString())})}Ti(t){return 0}gi(t,e){return S.or([()=>S.resolve(this.Ri.containsKey(e)),()=>this.persistence.getTargetCache().containsKey(t,e),()=>this.persistence.Ai(t,e)])}}class Or{constructor(t,e){this.persistence=t,this.pi=new be(r=>_f(r.path),(r,s)=>r.isEqual(s)),this.garbageCollector=Vp(this,e)}static mi(t,e){return new Or(t,e)}Ei(){}di(t){return S.resolve()}forEachTarget(t,e){return this.persistence.getTargetCache().forEachTarget(t,e)}gr(t){const e=this.wr(t);return this.persistence.getTargetCache().getTargetCount(t).next(r=>e.next(s=>r+s))}wr(t){let e=0;return this.pr(t,r=>{e++}).next(()=>e)}pr(t,e){return S.forEach(this.pi,(r,s)=>this.br(t,r,s).next(o=>o?S.resolve():e(s)))}removeTargets(t,e,r){return this.persistence.getTargetCache().removeTargets(t,e,r)}removeOrphanedDocuments(t,e){let r=0;const s=this.persistence.getRemoteDocumentCache(),o=s.newChangeBuffer();return s.ii(t,a=>this.br(t,a,e).next(u=>{u||(r++,o.removeEntry(a,L.min()))})).next(()=>o.apply(t)).next(()=>r)}markPotentiallyOrphaned(t,e){return this.pi.set(e,t.currentSequenceNumber),S.resolve()}removeTarget(t,e){const r=e.withSequenceNumber(t.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(t,r)}addReference(t,e,r){return this.pi.set(r,t.currentSequenceNumber),S.resolve()}removeReference(t,e,r){return this.pi.set(r,t.currentSequenceNumber),S.resolve()}updateLimboDocument(t,e){return this.pi.set(e,t.currentSequenceNumber),S.resolve()}Ti(t){let e=t.key.toString().length;return t.isFoundDocument()&&(e+=_r(t.data.value)),e}br(t,e,r){return S.or([()=>this.persistence.Ai(t,e),()=>this.persistence.getTargetCache().containsKey(t,e),()=>{const s=this.pi.get(e);return S.resolve(s!==void 0&&s>r)}])}getCacheSize(t){return this.persistence.getRemoteDocumentCache().getSize(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mi{constructor(t,e,r,s){this.targetId=t,this.fromCache=e,this.Es=r,this.ds=s}static As(t,e){let r=B(),s=B();for(const o of e.docChanges)switch(o.type){case 0:r=r.add(o.doc.key);break;case 1:s=s.add(o.doc.key)}return new Mi(t,e.fromCache,r,s)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jp{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(t){this._documentReadCount+=t}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qp{constructor(){this.Rs=!1,this.Vs=!1,this.fs=100,this.gs=function(){return Ch()?8:mf(gi())>0?6:4}()}initialize(t,e){this.ps=t,this.indexManager=e,this.Rs=!0}getDocumentsMatchingQuery(t,e,r,s){const o={result:null};return this.ys(t,e).next(a=>{o.result=a}).next(()=>{if(!o.result)return this.ws(t,e,s,r).next(a=>{o.result=a})}).next(()=>{if(o.result)return;const a=new jp;return this.Ss(t,e,a).next(u=>{if(o.result=u,this.Vs)return this.bs(t,e,a,u.size)})}).next(()=>o.result)}bs(t,e,r,s){return r.documentReadCount<this.fs?(Me()<=G.DEBUG&&D("QueryEngine","SDK will not create cache indexes for query:",xe(e),"since it only creates cache indexes for collection contains","more than or equal to",this.fs,"documents"),S.resolve()):(Me()<=G.DEBUG&&D("QueryEngine","Query:",xe(e),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.gs*s?(Me()<=G.DEBUG&&D("QueryEngine","The SDK decides to create cache indexes for query:",xe(e),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(t,Ot(e))):S.resolve())}ys(t,e){if(Da(e))return S.resolve(null);let r=Ot(e);return this.indexManager.getIndexType(t,r).next(s=>s===0?null:(e.limit!==null&&s===1&&(e=Zs(e,null,"F"),r=Ot(e)),this.indexManager.getDocumentsMatchingTarget(t,r).next(o=>{const a=B(...o);return this.ps.getDocuments(t,a).next(u=>this.indexManager.getMinOffset(t,r).next(h=>{const d=this.Ds(e,u);return this.Cs(e,d,a,h.readTime)?this.ys(t,Zs(e,null,"F")):this.vs(t,d,e,h)}))})))}ws(t,e,r,s){return Da(e)||s.isEqual(L.min())?S.resolve(null):this.ps.getDocuments(t,r).next(o=>{const a=this.Ds(e,o);return this.Cs(e,a,r,s)?S.resolve(null):(Me()<=G.DEBUG&&D("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),xe(e)),this.vs(t,a,e,lf(s,Pn)).next(u=>u))})}Ds(t,e){let r=new at(su(t));return e.forEach((s,o)=>{Wr(t,o)&&(r=r.add(o))}),r}Cs(t,e,r,s){if(t.limit===null)return!1;if(r.size!==e.size)return!0;const o=t.limitType==="F"?e.last():e.first();return!!o&&(o.hasPendingWrites||o.version.compareTo(s)>0)}Ss(t,e,r){return Me()<=G.DEBUG&&D("QueryEngine","Using full collection scan to execute query:",xe(e)),this.ps.getDocumentsMatchingQuery(t,e,ue.min(),r)}vs(t,e,r,s){return this.ps.getDocumentsMatchingQuery(t,r,s).next(o=>(e.forEach(a=>{o=o.insert(a.key,a)}),o))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xi="LocalStore",zp=3e8;class Gp{constructor(t,e,r,s){this.persistence=t,this.Fs=e,this.serializer=s,this.Ms=new tt(U),this.xs=new be(o=>Ci(o),bi),this.Os=new Map,this.Ns=t.getRemoteDocumentCache(),this.Pi=t.getTargetCache(),this.Ii=t.getBundleCache(),this.Bs(r)}Bs(t){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(t),this.indexManager=this.persistence.getIndexManager(t),this.mutationQueue=this.persistence.getMutationQueue(t,this.indexManager),this.localDocuments=new Np(this.Ns,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Ns.setIndexManager(this.indexManager),this.Fs.initialize(this.localDocuments,this.indexManager)}collectGarbage(t){return this.persistence.runTransaction("Collect garbage","readwrite-primary",e=>t.collect(e,this.Ms))}}function Hp(n,t,e,r){return new Gp(n,t,e,r)}async function bu(n,t){const e=F(n);return await e.persistence.runTransaction("Handle user change","readonly",r=>{let s;return e.mutationQueue.getAllMutationBatches(r).next(o=>(s=o,e.Bs(t),e.mutationQueue.getAllMutationBatches(r))).next(o=>{const a=[],u=[];let h=B();for(const d of s){a.push(d.batchId);for(const g of d.mutations)h=h.add(g.key)}for(const d of o){u.push(d.batchId);for(const g of d.mutations)h=h.add(g.key)}return e.localDocuments.getDocuments(r,h).next(d=>({Ls:d,removedBatchIds:a,addedBatchIds:u}))})})}function Kp(n,t){const e=F(n);return e.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const s=t.batch.keys(),o=e.Ns.newChangeBuffer({trackRemovals:!0});return function(u,h,d,g){const v=d.batch,A=v.keys();let C=S.resolve();return A.forEach(V=>{C=C.next(()=>g.getEntry(h,V)).next(O=>{const k=d.docVersions.get(V);Q(k!==null,48541),O.version.compareTo(k)<0&&(v.applyToRemoteDocument(O,d),O.isValidDocument()&&(O.setReadTime(d.commitVersion),g.addEntry(O)))})}),C.next(()=>u.mutationQueue.removeMutationBatch(h,v))}(e,r,t,o).next(()=>o.apply(r)).next(()=>e.mutationQueue.performConsistencyCheck(r)).next(()=>e.documentOverlayCache.removeOverlaysForBatchId(r,s,t.batch.batchId)).next(()=>e.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(u){let h=B();for(let d=0;d<u.mutationResults.length;++d)u.mutationResults[d].transformResults.length>0&&(h=h.add(u.batch.mutations[d].key));return h}(t))).next(()=>e.localDocuments.getDocuments(r,s))})}function Pu(n){const t=F(n);return t.persistence.runTransaction("Get last remote snapshot version","readonly",e=>t.Pi.getLastRemoteSnapshotVersion(e))}function Wp(n,t){const e=F(n),r=t.snapshotVersion;let s=e.Ms;return e.persistence.runTransaction("Apply remote event","readwrite-primary",o=>{const a=e.Ns.newChangeBuffer({trackRemovals:!0});s=e.Ms;const u=[];t.targetChanges.forEach((g,v)=>{const A=s.get(v);if(!A)return;u.push(e.Pi.removeMatchingKeys(o,g.removedDocuments,v).next(()=>e.Pi.addMatchingKeys(o,g.addedDocuments,v)));let C=A.withSequenceNumber(o.currentSequenceNumber);t.targetMismatches.get(v)!==null?C=C.withResumeToken(pt.EMPTY_BYTE_STRING,L.min()).withLastLimboFreeSnapshotVersion(L.min()):g.resumeToken.approximateByteSize()>0&&(C=C.withResumeToken(g.resumeToken,r)),s=s.insert(v,C),function(O,k,W){return O.resumeToken.approximateByteSize()===0||k.snapshotVersion.toMicroseconds()-O.snapshotVersion.toMicroseconds()>=zp?!0:W.addedDocuments.size+W.modifiedDocuments.size+W.removedDocuments.size>0}(A,C,g)&&u.push(e.Pi.updateTargetData(o,C))});let h=Kt(),d=B();if(t.documentUpdates.forEach(g=>{t.resolvedLimboDocuments.has(g)&&u.push(e.persistence.referenceDelegate.updateLimboDocument(o,g))}),u.push(Qp(o,a,t.documentUpdates).next(g=>{h=g.ks,d=g.qs})),!r.isEqual(L.min())){const g=e.Pi.getLastRemoteSnapshotVersion(o).next(v=>e.Pi.setTargetsMetadata(o,o.currentSequenceNumber,r));u.push(g)}return S.waitFor(u).next(()=>a.apply(o)).next(()=>e.localDocuments.getLocalViewOfDocuments(o,h,d)).next(()=>h)}).then(o=>(e.Ms=s,o))}function Qp(n,t,e){let r=B(),s=B();return e.forEach(o=>r=r.add(o)),t.getEntries(n,r).next(o=>{let a=Kt();return e.forEach((u,h)=>{const d=o.get(u);h.isFoundDocument()!==d.isFoundDocument()&&(s=s.add(u)),h.isNoDocument()&&h.version.isEqual(L.min())?(t.removeEntry(u,h.readTime),a=a.insert(u,h)):!d.isValidDocument()||h.version.compareTo(d.version)>0||h.version.compareTo(d.version)===0&&d.hasPendingWrites?(t.addEntry(h),a=a.insert(u,h)):D(xi,"Ignoring outdated watch update for ",u,". Current version:",d.version," Watch version:",h.version)}),{ks:a,qs:s}})}function Xp(n,t){const e=F(n);return e.persistence.runTransaction("Get next mutation batch","readonly",r=>(t===void 0&&(t=Ai),e.mutationQueue.getNextMutationBatchAfterBatchId(r,t)))}function Yp(n,t){const e=F(n);return e.persistence.runTransaction("Allocate target","readwrite",r=>{let s;return e.Pi.getTargetData(r,t).next(o=>o?(s=o,S.resolve(s)):e.Pi.allocateTargetId(r).next(a=>(s=new te(t,a,"TargetPurposeListen",r.currentSequenceNumber),e.Pi.addTargetData(r,s).next(()=>s))))}).then(r=>{const s=e.Ms.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(e.Ms=e.Ms.insert(r.targetId,r),e.xs.set(t,r.targetId)),r})}async function si(n,t,e){const r=F(n),s=r.Ms.get(t),o=e?"readwrite":"readwrite-primary";try{e||await r.persistence.runTransaction("Release target",o,a=>r.persistence.referenceDelegate.removeTarget(a,s))}catch(a){if(!Ye(a))throw a;D(xi,`Failed to update sequence numbers for target ${t}: ${a}`)}r.Ms=r.Ms.remove(t),r.xs.delete(s.target)}function Ga(n,t,e){const r=F(n);let s=L.min(),o=B();return r.persistence.runTransaction("Execute query","readwrite",a=>function(h,d,g){const v=F(h),A=v.xs.get(g);return A!==void 0?S.resolve(v.Ms.get(A)):v.Pi.getTargetData(d,g)}(r,a,Ot(t)).next(u=>{if(u)return s=u.lastLimboFreeSnapshotVersion,r.Pi.getMatchingKeysForTargetId(a,u.targetId).next(h=>{o=h})}).next(()=>r.Fs.getDocumentsMatchingQuery(a,t,e?s:L.min(),e?o:B())).next(u=>(Jp(r,Lf(t),u),{documents:u,Qs:o})))}function Jp(n,t,e){let r=n.Os.get(t)||L.min();e.forEach((s,o)=>{o.readTime.compareTo(r)>0&&(r=o.readTime)}),n.Os.set(t,r)}class Ha{constructor(){this.activeTargetIds=qf()}zs(t){this.activeTargetIds=this.activeTargetIds.add(t)}js(t){this.activeTargetIds=this.activeTargetIds.delete(t)}Gs(){const t={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(t)}}class Zp{constructor(){this.Mo=new Ha,this.xo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(t){}updateMutationState(t,e,r){}addLocalQueryTarget(t,e=!0){return e&&this.Mo.zs(t),this.xo[t]||"not-current"}updateQueryState(t,e,r){this.xo[t]=e}removeLocalQueryTarget(t){this.Mo.js(t)}isLocalQueryTarget(t){return this.Mo.activeTargetIds.has(t)}clearQueryState(t){delete this.xo[t]}getAllActiveQueryTargets(){return this.Mo.activeTargetIds}isActiveQueryTarget(t){return this.Mo.activeTargetIds.has(t)}start(){return this.Mo=new Ha,Promise.resolve()}handleUserChange(t,e,r){}setOnlineState(t){}shutdown(){}writeSequenceNumber(t){}notifyBundleLoaded(t){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tm{Oo(t){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ka="ConnectivityMonitor";class Wa{constructor(){this.No=()=>this.Bo(),this.Lo=()=>this.ko(),this.qo=[],this.Qo()}Oo(t){this.qo.push(t)}shutdown(){window.removeEventListener("online",this.No),window.removeEventListener("offline",this.Lo)}Qo(){window.addEventListener("online",this.No),window.addEventListener("offline",this.Lo)}Bo(){D(Ka,"Network connectivity changed: AVAILABLE");for(const t of this.qo)t(0)}ko(){D(Ka,"Network connectivity changed: UNAVAILABLE");for(const t of this.qo)t(1)}static v(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let fr=null;function ii(){return fr===null?fr=function(){return 268435456+Math.round(2147483648*Math.random())}():fr++,"0x"+fr.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xs="RestConnection",em={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class nm{get $o(){return!1}constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const e=t.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Uo=e+"://"+t.host,this.Ko=`projects/${r}/databases/${s}`,this.Wo=this.databaseId.database===Cr?`project_id=${r}`:`project_id=${r}&database_id=${s}`}Go(t,e,r,s,o){const a=ii(),u=this.zo(t,e.toUriEncodedString());D(xs,`Sending RPC '${t}' ${a}:`,u,r);const h={"google-cloud-resource-prefix":this.Ko,"x-goog-request-params":this.Wo};this.jo(h,s,o);const{host:d}=new URL(u),g=mi(d);return this.Jo(t,u,h,r,g).then(v=>(D(xs,`Received RPC '${t}' ${a}: `,v),v),v=>{throw je(xs,`RPC '${t}' ${a} failed with error: `,v,"url: ",u,"request:",r),v})}Ho(t,e,r,s,o,a){return this.Go(t,e,r,s,o)}jo(t,e,r){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Qe}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),e&&e.headers.forEach((s,o)=>t[o]=s),r&&r.headers.forEach((s,o)=>t[o]=s)}zo(t,e){const r=em[t];return`${this.Uo}/v1/${e}:${r}`}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rm{constructor(t){this.Yo=t.Yo,this.Zo=t.Zo}Xo(t){this.e_=t}t_(t){this.n_=t}r_(t){this.i_=t}onMessage(t){this.s_=t}close(){this.Zo()}send(t){this.Yo(t)}o_(){this.e_()}__(){this.n_()}a_(t){this.i_(t)}u_(t){this.s_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tt="WebChannelConnection";class sm extends nm{constructor(t){super(t),this.c_=[],this.forceLongPolling=t.forceLongPolling,this.autoDetectLongPolling=t.autoDetectLongPolling,this.useFetchStreams=t.useFetchStreams,this.longPollingOptions=t.longPollingOptions}Jo(t,e,r,s,o){const a=ii();return new Promise((u,h)=>{const d=new Nc;d.setWithCredentials(!0),d.listenOnce(Oc.COMPLETE,()=>{try{switch(d.getLastErrorCode()){case gr.NO_ERROR:const v=d.getResponseJson();D(Tt,`XHR for RPC '${t}' ${a} received:`,JSON.stringify(v)),u(v);break;case gr.TIMEOUT:D(Tt,`RPC '${t}' ${a} timed out`),h(new N(b.DEADLINE_EXCEEDED,"Request time out"));break;case gr.HTTP_ERROR:const A=d.getStatus();if(D(Tt,`RPC '${t}' ${a} failed with status:`,A,"response text:",d.getResponseText()),A>0){let C=d.getResponseJson();Array.isArray(C)&&(C=C[0]);const V=C?.error;if(V&&V.status&&V.message){const O=function(W){const $=W.toLowerCase().replace(/_/g,"-");return Object.values(b).indexOf($)>=0?$:b.UNKNOWN}(V.status);h(new N(O,V.message))}else h(new N(b.UNKNOWN,"Server responded with status "+d.getStatus()))}else h(new N(b.UNAVAILABLE,"Connection failed."));break;default:x(9055,{l_:t,streamId:a,h_:d.getLastErrorCode(),P_:d.getLastError()})}}finally{D(Tt,`RPC '${t}' ${a} completed.`)}});const g=JSON.stringify(s);D(Tt,`RPC '${t}' ${a} sending request:`,s),d.send(e,"POST",g,r,15)})}T_(t,e,r){const s=ii(),o=[this.Uo,"/","google.firestore.v1.Firestore","/",t,"/channel"],a=Lc(),u=xc(),h={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(h.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(h.useFetchStreams=!0),this.jo(h.initMessageHeaders,e,r),h.encodeInitMessageHeaders=!0;const g=o.join("");D(Tt,`Creating RPC '${t}' stream ${s}: ${g}`,h);const v=a.createWebChannel(g,h);this.I_(v);let A=!1,C=!1;const V=new rm({Yo:k=>{C?D(Tt,`Not sending because RPC '${t}' stream ${s} is closed:`,k):(A||(D(Tt,`Opening RPC '${t}' stream ${s} transport.`),v.open(),A=!0),D(Tt,`RPC '${t}' stream ${s} sending:`,k),v.send(k))},Zo:()=>v.close()}),O=(k,W,$)=>{k.listen(W,q=>{try{$(q)}catch(lt){setTimeout(()=>{throw lt},0)}})};return O(v,_n.EventType.OPEN,()=>{C||(D(Tt,`RPC '${t}' stream ${s} transport opened.`),V.o_())}),O(v,_n.EventType.CLOSE,()=>{C||(C=!0,D(Tt,`RPC '${t}' stream ${s} transport closed`),V.a_(),this.E_(v))}),O(v,_n.EventType.ERROR,k=>{C||(C=!0,je(Tt,`RPC '${t}' stream ${s} transport errored. Name:`,k.name,"Message:",k.message),V.a_(new N(b.UNAVAILABLE,"The operation could not be completed")))}),O(v,_n.EventType.MESSAGE,k=>{if(!C){const W=k.data[0];Q(!!W,16349);const $=W,q=$?.error||$[0]?.error;if(q){D(Tt,`RPC '${t}' stream ${s} received error:`,q);const lt=q.status;let Dt=function(p){const _=rt[p];if(_!==void 0)return gu(_)}(lt),mt=q.message;Dt===void 0&&(Dt=b.INTERNAL,mt="Unknown error status: "+lt+" with message "+q.message),C=!0,V.a_(new N(Dt,mt)),v.close()}else D(Tt,`RPC '${t}' stream ${s} received:`,W),V.u_(W)}}),O(u,Mc.STAT_EVENT,k=>{k.stat===Ks.PROXY?D(Tt,`RPC '${t}' stream ${s} detected buffering proxy`):k.stat===Ks.NOPROXY&&D(Tt,`RPC '${t}' stream ${s} detected no buffering proxy`)}),setTimeout(()=>{V.__()},0),V}terminate(){this.c_.forEach(t=>t.close()),this.c_=[]}I_(t){this.c_.push(t)}E_(t){this.c_=this.c_.filter(e=>e===t)}}function Ls(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jr(n){return new cp(n,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vu{constructor(t,e,r=1e3,s=1.5,o=6e4){this.Mi=t,this.timerId=e,this.d_=r,this.A_=s,this.R_=o,this.V_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.V_=0}g_(){this.V_=this.R_}p_(t){this.cancel();const e=Math.floor(this.V_+this.y_()),r=Math.max(0,Date.now()-this.f_),s=Math.max(0,e-r);s>0&&D("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.V_} ms, delay with jitter: ${e} ms, last attempt: ${r} ms ago)`),this.m_=this.Mi.enqueueAfterDelay(this.timerId,s,()=>(this.f_=Date.now(),t())),this.V_*=this.A_,this.V_<this.d_&&(this.V_=this.d_),this.V_>this.R_&&(this.V_=this.R_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.V_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qa="PersistentStream";class ku{constructor(t,e,r,s,o,a,u,h){this.Mi=t,this.S_=r,this.b_=s,this.connection=o,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=u,this.listener=h,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new Vu(t,e)}x_(){return this.state===1||this.state===5||this.O_()}O_(){return this.state===2||this.state===3}start(){this.F_=0,this.state!==4?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&this.C_===null&&(this.C_=this.Mi.enqueueAfterDelay(this.S_,6e4,()=>this.k_()))}q_(t){this.Q_(),this.stream.send(t)}async k_(){if(this.O_())return this.close(0)}Q_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(t,e){this.Q_(),this.U_(),this.M_.cancel(),this.D_++,t!==4?this.M_.reset():e&&e.code===b.RESOURCE_EXHAUSTED?(Ht(e.toString()),Ht("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):e&&e.code===b.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.K_(),this.stream.close(),this.stream=null),this.state=t,await this.listener.r_(e)}K_(){}auth(){this.state=1;const t=this.W_(this.D_),e=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,s])=>{this.D_===e&&this.G_(r,s)},r=>{t(()=>{const s=new N(b.UNKNOWN,"Fetching auth token failed: "+r.message);return this.z_(s)})})}G_(t,e){const r=this.W_(this.D_);this.stream=this.j_(t,e),this.stream.Xo(()=>{r(()=>this.listener.Xo())}),this.stream.t_(()=>{r(()=>(this.state=2,this.v_=this.Mi.enqueueAfterDelay(this.b_,1e4,()=>(this.O_()&&(this.state=3),Promise.resolve())),this.listener.t_()))}),this.stream.r_(s=>{r(()=>this.z_(s))}),this.stream.onMessage(s=>{r(()=>++this.F_==1?this.J_(s):this.onNext(s))})}N_(){this.state=5,this.M_.p_(async()=>{this.state=0,this.start()})}z_(t){return D(Qa,`close with error: ${t}`),this.stream=null,this.close(4,t)}W_(t){return e=>{this.Mi.enqueueAndForget(()=>this.D_===t?e():(D(Qa,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class im extends ku{constructor(t,e,r,s,o,a){super(t,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",e,r,s,a),this.serializer=o}j_(t,e){return this.connection.T_("Listen",t,e)}J_(t){return this.onNext(t)}onNext(t){this.M_.reset();const e=hp(this.serializer,t),r=function(o){if(!("targetChange"in o))return L.min();const a=o.targetChange;return a.targetIds&&a.targetIds.length?L.min():a.readTime?Mt(a.readTime):L.min()}(t);return this.listener.H_(e,r)}Y_(t){const e={};e.database=ri(this.serializer),e.addTarget=function(o,a){let u;const h=a.target;if(u=Js(h)?{documents:pp(o,h)}:{query:mp(o,h).ft},u.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){u.resumeToken=Eu(o,a.resumeToken);const d=ti(o,a.expectedCount);d!==null&&(u.expectedCount=d)}else if(a.snapshotVersion.compareTo(L.min())>0){u.readTime=Nr(o,a.snapshotVersion.toTimestamp());const d=ti(o,a.expectedCount);d!==null&&(u.expectedCount=d)}return u}(this.serializer,t);const r=_p(this.serializer,t);r&&(e.labels=r),this.q_(e)}Z_(t){const e={};e.database=ri(this.serializer),e.removeTarget=t,this.q_(e)}}class om extends ku{constructor(t,e,r,s,o,a){super(t,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",e,r,s,a),this.serializer=o}get X_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}K_(){this.X_&&this.ea([])}j_(t,e){return this.connection.T_("Write",t,e)}J_(t){return Q(!!t.streamToken,31322),this.lastStreamToken=t.streamToken,Q(!t.writeResults||t.writeResults.length===0,55816),this.listener.ta()}onNext(t){Q(!!t.streamToken,12678),this.lastStreamToken=t.streamToken,this.M_.reset();const e=fp(t.writeResults,t.commitTime),r=Mt(t.commitTime);return this.listener.na(r,e)}ra(){const t={};t.database=ri(this.serializer),this.q_(t)}ea(t){const e={streamToken:this.lastStreamToken,writes:t.map(r=>dp(this.serializer,r))};this.q_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class am{}class cm extends am{constructor(t,e,r,s){super(),this.authCredentials=t,this.appCheckCredentials=e,this.connection=r,this.serializer=s,this.ia=!1}sa(){if(this.ia)throw new N(b.FAILED_PRECONDITION,"The client has already been terminated.")}Go(t,e,r,s){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,a])=>this.connection.Go(t,ei(e,r),s,o,a)).catch(o=>{throw o.name==="FirebaseError"?(o.code===b.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new N(b.UNKNOWN,o.toString())})}Ho(t,e,r,s,o){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([a,u])=>this.connection.Ho(t,ei(e,r),s,a,u,o)).catch(a=>{throw a.name==="FirebaseError"?(a.code===b.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new N(b.UNKNOWN,a.toString())})}terminate(){this.ia=!0,this.connection.terminate()}}class um{constructor(t,e){this.asyncQueue=t,this.onlineStateHandler=e,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){this.oa===0&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve())))}ha(t){this.state==="Online"?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${t.toString()}`),this.ca("Offline")))}set(t){this.Pa(),this.oa=0,t==="Online"&&(this.aa=!1),this.ca(t)}ca(t){t!==this.state&&(this.state=t,this.onlineStateHandler(t))}la(t){const e=`Could not reach Cloud Firestore backend. ${t}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(Ht(e),this.aa=!1):D("OnlineStateTracker",e)}Pa(){this._a!==null&&(this._a.cancel(),this._a=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Re="RemoteStore";class lm{constructor(t,e,r,s,o){this.localStore=t,this.datastore=e,this.asyncQueue=r,this.remoteSyncer={},this.Ta=[],this.Ia=new Map,this.Ea=new Set,this.da=[],this.Aa=o,this.Aa.Oo(a=>{r.enqueueAndForget(async()=>{Ve(this)&&(D(Re,"Restarting streams for network reachability change."),await async function(h){const d=F(h);d.Ea.add(4),await jn(d),d.Ra.set("Unknown"),d.Ea.delete(4),await Zr(d)}(this))})}),this.Ra=new um(r,s)}}async function Zr(n){if(Ve(n))for(const t of n.da)await t(!0)}async function jn(n){for(const t of n.da)await t(!1)}function Du(n,t){const e=F(n);e.Ia.has(t.targetId)||(e.Ia.set(t.targetId,t),Bi(e)?Ui(e):Je(e).O_()&&Fi(e,t))}function Li(n,t){const e=F(n),r=Je(e);e.Ia.delete(t),r.O_()&&Nu(e,t),e.Ia.size===0&&(r.O_()?r.L_():Ve(e)&&e.Ra.set("Unknown"))}function Fi(n,t){if(n.Va.Ue(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(L.min())>0){const e=n.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;t=t.withExpectedCount(e)}Je(n).Y_(t)}function Nu(n,t){n.Va.Ue(t),Je(n).Z_(t)}function Ui(n){n.Va=new sp({getRemoteKeysForTarget:t=>n.remoteSyncer.getRemoteKeysForTarget(t),At:t=>n.Ia.get(t)||null,ht:()=>n.datastore.serializer.databaseId}),Je(n).start(),n.Ra.ua()}function Bi(n){return Ve(n)&&!Je(n).x_()&&n.Ia.size>0}function Ve(n){return F(n).Ea.size===0}function Ou(n){n.Va=void 0}async function hm(n){n.Ra.set("Online")}async function dm(n){n.Ia.forEach((t,e)=>{Fi(n,t)})}async function fm(n,t){Ou(n),Bi(n)?(n.Ra.ha(t),Ui(n)):n.Ra.set("Unknown")}async function pm(n,t,e){if(n.Ra.set("Online"),t instanceof yu&&t.state===2&&t.cause)try{await async function(s,o){const a=o.cause;for(const u of o.targetIds)s.Ia.has(u)&&(await s.remoteSyncer.rejectListen(u,a),s.Ia.delete(u),s.Va.removeTarget(u))}(n,t)}catch(r){D(Re,"Failed to remove targets %s: %s ",t.targetIds.join(","),r),await Mr(n,r)}else if(t instanceof Tr?n.Va.Ze(t):t instanceof _u?n.Va.st(t):n.Va.tt(t),!e.isEqual(L.min()))try{const r=await Pu(n.localStore);e.compareTo(r)>=0&&await function(o,a){const u=o.Va.Tt(a);return u.targetChanges.forEach((h,d)=>{if(h.resumeToken.approximateByteSize()>0){const g=o.Ia.get(d);g&&o.Ia.set(d,g.withResumeToken(h.resumeToken,a))}}),u.targetMismatches.forEach((h,d)=>{const g=o.Ia.get(h);if(!g)return;o.Ia.set(h,g.withResumeToken(pt.EMPTY_BYTE_STRING,g.snapshotVersion)),Nu(o,h);const v=new te(g.target,h,d,g.sequenceNumber);Fi(o,v)}),o.remoteSyncer.applyRemoteEvent(u)}(n,e)}catch(r){D(Re,"Failed to raise snapshot:",r),await Mr(n,r)}}async function Mr(n,t,e){if(!Ye(t))throw t;n.Ea.add(1),await jn(n),n.Ra.set("Offline"),e||(e=()=>Pu(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{D(Re,"Retrying IndexedDB access"),await e(),n.Ea.delete(1),await Zr(n)})}function Mu(n,t){return t().catch(e=>Mr(n,e,t))}async function ts(n){const t=F(n),e=fe(t);let r=t.Ta.length>0?t.Ta[t.Ta.length-1].batchId:Ai;for(;mm(t);)try{const s=await Xp(t.localStore,r);if(s===null){t.Ta.length===0&&e.L_();break}r=s.batchId,gm(t,s)}catch(s){await Mr(t,s)}xu(t)&&Lu(t)}function mm(n){return Ve(n)&&n.Ta.length<10}function gm(n,t){n.Ta.push(t);const e=fe(n);e.O_()&&e.X_&&e.ea(t.mutations)}function xu(n){return Ve(n)&&!fe(n).x_()&&n.Ta.length>0}function Lu(n){fe(n).start()}async function _m(n){fe(n).ra()}async function ym(n){const t=fe(n);for(const e of n.Ta)t.ea(e.mutations)}async function Em(n,t,e){const r=n.Ta.shift(),s=Vi.from(r,t,e);await Mu(n,()=>n.remoteSyncer.applySuccessfulWrite(s)),await ts(n)}async function Tm(n,t){t&&fe(n).X_&&await async function(r,s){if(function(a){return ep(a)&&a!==b.ABORTED}(s.code)){const o=r.Ta.shift();fe(r).B_(),await Mu(r,()=>r.remoteSyncer.rejectFailedWrite(o.batchId,s)),await ts(r)}}(n,t),xu(n)&&Lu(n)}async function Xa(n,t){const e=F(n);e.asyncQueue.verifyOperationInProgress(),D(Re,"RemoteStore received new credentials");const r=Ve(e);e.Ea.add(3),await jn(e),r&&e.Ra.set("Unknown"),await e.remoteSyncer.handleCredentialChange(t),e.Ea.delete(3),await Zr(e)}async function vm(n,t){const e=F(n);t?(e.Ea.delete(2),await Zr(e)):t||(e.Ea.add(2),await jn(e),e.Ra.set("Unknown"))}function Je(n){return n.ma||(n.ma=function(e,r,s){const o=F(e);return o.sa(),new im(r,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,s)}(n.datastore,n.asyncQueue,{Xo:hm.bind(null,n),t_:dm.bind(null,n),r_:fm.bind(null,n),H_:pm.bind(null,n)}),n.da.push(async t=>{t?(n.ma.B_(),Bi(n)?Ui(n):n.Ra.set("Unknown")):(await n.ma.stop(),Ou(n))})),n.ma}function fe(n){return n.fa||(n.fa=function(e,r,s){const o=F(e);return o.sa(),new om(r,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,s)}(n.datastore,n.asyncQueue,{Xo:()=>Promise.resolve(),t_:_m.bind(null,n),r_:Tm.bind(null,n),ta:ym.bind(null,n),na:Em.bind(null,n)}),n.da.push(async t=>{t?(n.fa.B_(),await ts(n)):(await n.fa.stop(),n.Ta.length>0&&(D(Re,`Stopping write stream with ${n.Ta.length} pending writes`),n.Ta=[]))})),n.fa}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $i{constructor(t,e,r,s,o){this.asyncQueue=t,this.timerId=e,this.targetTimeMs=r,this.op=s,this.removalCallback=o,this.deferred=new ie,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(a=>{})}get promise(){return this.deferred.promise}static createAndSchedule(t,e,r,s,o){const a=Date.now()+r,u=new $i(t,e,a,s,o);return u.start(r),u}start(t){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),t)}skipDelay(){return this.handleDelayElapsed()}cancel(t){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new N(b.CANCELLED,"Operation cancelled"+(t?": "+t:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(t=>this.deferred.resolve(t))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function ji(n,t){if(Ht("AsyncQueue",`${t}: ${n}`),Ye(n))return new N(b.UNAVAILABLE,`${t}: ${n}`);throw n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Be{static emptySet(t){return new Be(t.comparator)}constructor(t){this.comparator=t?(e,r)=>t(e,r)||M.comparator(e.key,r.key):(e,r)=>M.comparator(e.key,r.key),this.keyedMap=yn(),this.sortedSet=new tt(this.comparator)}has(t){return this.keyedMap.get(t)!=null}get(t){return this.keyedMap.get(t)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(t){const e=this.keyedMap.get(t);return e?this.sortedSet.indexOf(e):-1}get size(){return this.sortedSet.size}forEach(t){this.sortedSet.inorderTraversal((e,r)=>(t(e),!1))}add(t){const e=this.delete(t.key);return e.copy(e.keyedMap.insert(t.key,t),e.sortedSet.insert(t,null))}delete(t){const e=this.get(t);return e?this.copy(this.keyedMap.remove(t),this.sortedSet.remove(e)):this}isEqual(t){if(!(t instanceof Be)||this.size!==t.size)return!1;const e=this.sortedSet.getIterator(),r=t.sortedSet.getIterator();for(;e.hasNext();){const s=e.getNext().key,o=r.getNext().key;if(!s.isEqual(o))return!1}return!0}toString(){const t=[];return this.forEach(e=>{t.push(e.toString())}),t.length===0?"DocumentSet ()":`DocumentSet (
  `+t.join(`
`)+`
)`}copy(t,e){const r=new Be;return r.comparator=this.comparator,r.keyedMap=t,r.sortedSet=e,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ya{constructor(){this.ga=new tt(M.comparator)}track(t){const e=t.doc.key,r=this.ga.get(e);r?t.type!==0&&r.type===3?this.ga=this.ga.insert(e,t):t.type===3&&r.type!==1?this.ga=this.ga.insert(e,{type:r.type,doc:t.doc}):t.type===2&&r.type===2?this.ga=this.ga.insert(e,{type:2,doc:t.doc}):t.type===2&&r.type===0?this.ga=this.ga.insert(e,{type:0,doc:t.doc}):t.type===1&&r.type===0?this.ga=this.ga.remove(e):t.type===1&&r.type===2?this.ga=this.ga.insert(e,{type:1,doc:r.doc}):t.type===0&&r.type===1?this.ga=this.ga.insert(e,{type:2,doc:t.doc}):x(63341,{Rt:t,pa:r}):this.ga=this.ga.insert(e,t)}ya(){const t=[];return this.ga.inorderTraversal((e,r)=>{t.push(r)}),t}}class Ke{constructor(t,e,r,s,o,a,u,h,d){this.query=t,this.docs=e,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=o,this.fromCache=a,this.syncStateChanged=u,this.excludesMetadataChanges=h,this.hasCachedResults=d}static fromInitialDocuments(t,e,r,s,o){const a=[];return e.forEach(u=>{a.push({type:0,doc:u})}),new Ke(t,e,Be.emptySet(e),a,r,s,!0,!1,o)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(t){if(!(this.fromCache===t.fromCache&&this.hasCachedResults===t.hasCachedResults&&this.syncStateChanged===t.syncStateChanged&&this.mutatedKeys.isEqual(t.mutatedKeys)&&Kr(this.query,t.query)&&this.docs.isEqual(t.docs)&&this.oldDocs.isEqual(t.oldDocs)))return!1;const e=this.docChanges,r=t.docChanges;if(e.length!==r.length)return!1;for(let s=0;s<e.length;s++)if(e[s].type!==r[s].type||!e[s].doc.isEqual(r[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Im{constructor(){this.wa=void 0,this.Sa=[]}ba(){return this.Sa.some(t=>t.Da())}}class wm{constructor(){this.queries=Ja(),this.onlineState="Unknown",this.Ca=new Set}terminate(){(function(e,r){const s=F(e),o=s.queries;s.queries=Ja(),o.forEach((a,u)=>{for(const h of u.Sa)h.onError(r)})})(this,new N(b.ABORTED,"Firestore shutting down"))}}function Ja(){return new be(n=>ru(n),Kr)}async function Fu(n,t){const e=F(n);let r=3;const s=t.query;let o=e.queries.get(s);o?!o.ba()&&t.Da()&&(r=2):(o=new Im,r=t.Da()?0:1);try{switch(r){case 0:o.wa=await e.onListen(s,!0);break;case 1:o.wa=await e.onListen(s,!1);break;case 2:await e.onFirstRemoteStoreListen(s)}}catch(a){const u=ji(a,`Initialization of query '${xe(t.query)}' failed`);return void t.onError(u)}e.queries.set(s,o),o.Sa.push(t),t.va(e.onlineState),o.wa&&t.Fa(o.wa)&&qi(e)}async function Uu(n,t){const e=F(n),r=t.query;let s=3;const o=e.queries.get(r);if(o){const a=o.Sa.indexOf(t);a>=0&&(o.Sa.splice(a,1),o.Sa.length===0?s=t.Da()?0:1:!o.ba()&&t.Da()&&(s=2))}switch(s){case 0:return e.queries.delete(r),e.onUnlisten(r,!0);case 1:return e.queries.delete(r),e.onUnlisten(r,!1);case 2:return e.onLastRemoteStoreUnlisten(r);default:return}}function Am(n,t){const e=F(n);let r=!1;for(const s of t){const o=s.query,a=e.queries.get(o);if(a){for(const u of a.Sa)u.Fa(s)&&(r=!0);a.wa=s}}r&&qi(e)}function Rm(n,t,e){const r=F(n),s=r.queries.get(t);if(s)for(const o of s.Sa)o.onError(e);r.queries.delete(t)}function qi(n){n.Ca.forEach(t=>{t.next()})}var oi,Za;(Za=oi||(oi={})).Ma="default",Za.Cache="cache";class Bu{constructor(t,e,r){this.query=t,this.xa=e,this.Oa=!1,this.Na=null,this.onlineState="Unknown",this.options=r||{}}Fa(t){if(!this.options.includeMetadataChanges){const r=[];for(const s of t.docChanges)s.type!==3&&r.push(s);t=new Ke(t.query,t.docs,t.oldDocs,r,t.mutatedKeys,t.fromCache,t.syncStateChanged,!0,t.hasCachedResults)}let e=!1;return this.Oa?this.Ba(t)&&(this.xa.next(t),e=!0):this.La(t,this.onlineState)&&(this.ka(t),e=!0),this.Na=t,e}onError(t){this.xa.error(t)}va(t){this.onlineState=t;let e=!1;return this.Na&&!this.Oa&&this.La(this.Na,t)&&(this.ka(this.Na),e=!0),e}La(t,e){if(!t.fromCache||!this.Da())return!0;const r=e!=="Offline";return(!this.options.qa||!r)&&(!t.docs.isEmpty()||t.hasCachedResults||e==="Offline")}Ba(t){if(t.docChanges.length>0)return!0;const e=this.Na&&this.Na.hasPendingWrites!==t.hasPendingWrites;return!(!t.syncStateChanged&&!e)&&this.options.includeMetadataChanges===!0}ka(t){t=Ke.fromInitialDocuments(t.query,t.docs,t.mutatedKeys,t.fromCache,t.hasCachedResults),this.Oa=!0,this.xa.next(t)}Da(){return this.options.source!==oi.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $u{constructor(t){this.key=t}}class ju{constructor(t){this.key=t}}class Sm{constructor(t,e){this.query=t,this.Ya=e,this.Za=null,this.hasCachedResults=!1,this.current=!1,this.Xa=B(),this.mutatedKeys=B(),this.eu=su(t),this.tu=new Be(this.eu)}get nu(){return this.Ya}ru(t,e){const r=e?e.iu:new Ya,s=e?e.tu:this.tu;let o=e?e.mutatedKeys:this.mutatedKeys,a=s,u=!1;const h=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,d=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(t.inorderTraversal((g,v)=>{const A=s.get(g),C=Wr(this.query,v)?v:null,V=!!A&&this.mutatedKeys.has(A.key),O=!!C&&(C.hasLocalMutations||this.mutatedKeys.has(C.key)&&C.hasCommittedMutations);let k=!1;A&&C?A.data.isEqual(C.data)?V!==O&&(r.track({type:3,doc:C}),k=!0):this.su(A,C)||(r.track({type:2,doc:C}),k=!0,(h&&this.eu(C,h)>0||d&&this.eu(C,d)<0)&&(u=!0)):!A&&C?(r.track({type:0,doc:C}),k=!0):A&&!C&&(r.track({type:1,doc:A}),k=!0,(h||d)&&(u=!0)),k&&(C?(a=a.add(C),o=O?o.add(g):o.delete(g)):(a=a.delete(g),o=o.delete(g)))}),this.query.limit!==null)for(;a.size>this.query.limit;){const g=this.query.limitType==="F"?a.last():a.first();a=a.delete(g.key),o=o.delete(g.key),r.track({type:1,doc:g})}return{tu:a,iu:r,Cs:u,mutatedKeys:o}}su(t,e){return t.hasLocalMutations&&e.hasCommittedMutations&&!e.hasLocalMutations}applyChanges(t,e,r,s){const o=this.tu;this.tu=t.tu,this.mutatedKeys=t.mutatedKeys;const a=t.iu.ya();a.sort((g,v)=>function(C,V){const O=k=>{switch(k){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return x(20277,{Rt:k})}};return O(C)-O(V)}(g.type,v.type)||this.eu(g.doc,v.doc)),this.ou(r),s=s??!1;const u=e&&!s?this._u():[],h=this.Xa.size===0&&this.current&&!s?1:0,d=h!==this.Za;return this.Za=h,a.length!==0||d?{snapshot:new Ke(this.query,t.tu,o,a,t.mutatedKeys,h===0,d,!1,!!r&&r.resumeToken.approximateByteSize()>0),au:u}:{au:u}}va(t){return this.current&&t==="Offline"?(this.current=!1,this.applyChanges({tu:this.tu,iu:new Ya,mutatedKeys:this.mutatedKeys,Cs:!1},!1)):{au:[]}}uu(t){return!this.Ya.has(t)&&!!this.tu.has(t)&&!this.tu.get(t).hasLocalMutations}ou(t){t&&(t.addedDocuments.forEach(e=>this.Ya=this.Ya.add(e)),t.modifiedDocuments.forEach(e=>{}),t.removedDocuments.forEach(e=>this.Ya=this.Ya.delete(e)),this.current=t.current)}_u(){if(!this.current)return[];const t=this.Xa;this.Xa=B(),this.tu.forEach(r=>{this.uu(r.key)&&(this.Xa=this.Xa.add(r.key))});const e=[];return t.forEach(r=>{this.Xa.has(r)||e.push(new ju(r))}),this.Xa.forEach(r=>{t.has(r)||e.push(new $u(r))}),e}cu(t){this.Ya=t.Qs,this.Xa=B();const e=this.ru(t.documents);return this.applyChanges(e,!0)}lu(){return Ke.fromInitialDocuments(this.query,this.tu,this.mutatedKeys,this.Za===0,this.hasCachedResults)}}const zi="SyncEngine";class Cm{constructor(t,e,r){this.query=t,this.targetId=e,this.view=r}}class bm{constructor(t){this.key=t,this.hu=!1}}class Pm{constructor(t,e,r,s,o,a){this.localStore=t,this.remoteStore=e,this.eventManager=r,this.sharedClientState=s,this.currentUser=o,this.maxConcurrentLimboResolutions=a,this.Pu={},this.Tu=new be(u=>ru(u),Kr),this.Iu=new Map,this.Eu=new Set,this.du=new tt(M.comparator),this.Au=new Map,this.Ru=new Ni,this.Vu={},this.mu=new Map,this.fu=He.cr(),this.onlineState="Unknown",this.gu=void 0}get isPrimaryClient(){return this.gu===!0}}async function Vm(n,t,e=!0){const r=Wu(n);let s;const o=r.Tu.get(t);return o?(r.sharedClientState.addLocalQueryTarget(o.targetId),s=o.view.lu()):s=await qu(r,t,e,!0),s}async function km(n,t){const e=Wu(n);await qu(e,t,!0,!1)}async function qu(n,t,e,r){const s=await Yp(n.localStore,Ot(t)),o=s.targetId,a=n.sharedClientState.addLocalQueryTarget(o,e);let u;return r&&(u=await Dm(n,t,o,a==="current",s.resumeToken)),n.isPrimaryClient&&e&&Du(n.remoteStore,s),u}async function Dm(n,t,e,r,s){n.pu=(v,A,C)=>async function(O,k,W,$){let q=k.view.ru(W);q.Cs&&(q=await Ga(O.localStore,k.query,!1).then(({documents:T})=>k.view.ru(T,q)));const lt=$&&$.targetChanges.get(k.targetId),Dt=$&&$.targetMismatches.get(k.targetId)!=null,mt=k.view.applyChanges(q,O.isPrimaryClient,lt,Dt);return ec(O,k.targetId,mt.au),mt.snapshot}(n,v,A,C);const o=await Ga(n.localStore,t,!0),a=new Sm(t,o.Qs),u=a.ru(o.documents),h=$n.createSynthesizedTargetChangeForCurrentChange(e,r&&n.onlineState!=="Offline",s),d=a.applyChanges(u,n.isPrimaryClient,h);ec(n,e,d.au);const g=new Cm(t,e,a);return n.Tu.set(t,g),n.Iu.has(e)?n.Iu.get(e).push(t):n.Iu.set(e,[t]),d.snapshot}async function Nm(n,t,e){const r=F(n),s=r.Tu.get(t),o=r.Iu.get(s.targetId);if(o.length>1)return r.Iu.set(s.targetId,o.filter(a=>!Kr(a,t))),void r.Tu.delete(t);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await si(r.localStore,s.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(s.targetId),e&&Li(r.remoteStore,s.targetId),ai(r,s.targetId)}).catch(Xe)):(ai(r,s.targetId),await si(r.localStore,s.targetId,!0))}async function Om(n,t){const e=F(n),r=e.Tu.get(t),s=e.Iu.get(r.targetId);e.isPrimaryClient&&s.length===1&&(e.sharedClientState.removeLocalQueryTarget(r.targetId),Li(e.remoteStore,r.targetId))}async function Mm(n,t,e){const r=jm(n);try{const s=await function(a,u){const h=F(a),d=J.now(),g=u.reduce((C,V)=>C.add(V.key),B());let v,A;return h.persistence.runTransaction("Locally write mutations","readwrite",C=>{let V=Kt(),O=B();return h.Ns.getEntries(C,g).next(k=>{V=k,V.forEach((W,$)=>{$.isValidDocument()||(O=O.add(W))})}).next(()=>h.localDocuments.getOverlayedDocuments(C,V)).next(k=>{v=k;const W=[];for(const $ of u){const q=Xf($,v.get($.key).overlayedDocument);q!=null&&W.push(new Pe($.key,q,Xc(q.value.mapValue),zt.exists(!0)))}return h.mutationQueue.addMutationBatch(C,d,W,u)}).next(k=>{A=k;const W=k.applyToLocalDocumentSet(v,O);return h.documentOverlayCache.saveOverlays(C,k.batchId,W)})}).then(()=>({batchId:A.batchId,changes:ou(v)}))}(r.localStore,t);r.sharedClientState.addPendingMutation(s.batchId),function(a,u,h){let d=a.Vu[a.currentUser.toKey()];d||(d=new tt(U)),d=d.insert(u,h),a.Vu[a.currentUser.toKey()]=d}(r,s.batchId,e),await qn(r,s.changes),await ts(r.remoteStore)}catch(s){const o=ji(s,"Failed to persist write");e.reject(o)}}async function zu(n,t){const e=F(n);try{const r=await Wp(e.localStore,t);t.targetChanges.forEach((s,o)=>{const a=e.Au.get(o);a&&(Q(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?a.hu=!0:s.modifiedDocuments.size>0?Q(a.hu,14607):s.removedDocuments.size>0&&(Q(a.hu,42227),a.hu=!1))}),await qn(e,r,t)}catch(r){await Xe(r)}}function tc(n,t,e){const r=F(n);if(r.isPrimaryClient&&e===0||!r.isPrimaryClient&&e===1){const s=[];r.Tu.forEach((o,a)=>{const u=a.view.va(t);u.snapshot&&s.push(u.snapshot)}),function(a,u){const h=F(a);h.onlineState=u;let d=!1;h.queries.forEach((g,v)=>{for(const A of v.Sa)A.va(u)&&(d=!0)}),d&&qi(h)}(r.eventManager,t),s.length&&r.Pu.H_(s),r.onlineState=t,r.isPrimaryClient&&r.sharedClientState.setOnlineState(t)}}async function xm(n,t,e){const r=F(n);r.sharedClientState.updateQueryState(t,"rejected",e);const s=r.Au.get(t),o=s&&s.key;if(o){let a=new tt(M.comparator);a=a.insert(o,It.newNoDocument(o,L.min()));const u=B().add(o),h=new Yr(L.min(),new Map,new tt(U),a,u);await zu(r,h),r.du=r.du.remove(o),r.Au.delete(t),Gi(r)}else await si(r.localStore,t,!1).then(()=>ai(r,t,e)).catch(Xe)}async function Lm(n,t){const e=F(n),r=t.batch.batchId;try{const s=await Kp(e.localStore,t);Hu(e,r,null),Gu(e,r),e.sharedClientState.updateMutationState(r,"acknowledged"),await qn(e,s)}catch(s){await Xe(s)}}async function Fm(n,t,e){const r=F(n);try{const s=await function(a,u){const h=F(a);return h.persistence.runTransaction("Reject batch","readwrite-primary",d=>{let g;return h.mutationQueue.lookupMutationBatch(d,u).next(v=>(Q(v!==null,37113),g=v.keys(),h.mutationQueue.removeMutationBatch(d,v))).next(()=>h.mutationQueue.performConsistencyCheck(d)).next(()=>h.documentOverlayCache.removeOverlaysForBatchId(d,g,u)).next(()=>h.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,g)).next(()=>h.localDocuments.getDocuments(d,g))})}(r.localStore,t);Hu(r,t,e),Gu(r,t),r.sharedClientState.updateMutationState(t,"rejected",e),await qn(r,s)}catch(s){await Xe(s)}}function Gu(n,t){(n.mu.get(t)||[]).forEach(e=>{e.resolve()}),n.mu.delete(t)}function Hu(n,t,e){const r=F(n);let s=r.Vu[r.currentUser.toKey()];if(s){const o=s.get(t);o&&(e?o.reject(e):o.resolve(),s=s.remove(t)),r.Vu[r.currentUser.toKey()]=s}}function ai(n,t,e=null){n.sharedClientState.removeLocalQueryTarget(t);for(const r of n.Iu.get(t))n.Tu.delete(r),e&&n.Pu.yu(r,e);n.Iu.delete(t),n.isPrimaryClient&&n.Ru.jr(t).forEach(r=>{n.Ru.containsKey(r)||Ku(n,r)})}function Ku(n,t){n.Eu.delete(t.path.canonicalString());const e=n.du.get(t);e!==null&&(Li(n.remoteStore,e),n.du=n.du.remove(t),n.Au.delete(e),Gi(n))}function ec(n,t,e){for(const r of e)r instanceof $u?(n.Ru.addReference(r.key,t),Um(n,r)):r instanceof ju?(D(zi,"Document no longer in limbo: "+r.key),n.Ru.removeReference(r.key,t),n.Ru.containsKey(r.key)||Ku(n,r.key)):x(19791,{wu:r})}function Um(n,t){const e=t.key,r=e.path.canonicalString();n.du.get(e)||n.Eu.has(r)||(D(zi,"New document in limbo: "+e),n.Eu.add(r),Gi(n))}function Gi(n){for(;n.Eu.size>0&&n.du.size<n.maxConcurrentLimboResolutions;){const t=n.Eu.values().next().value;n.Eu.delete(t);const e=new M(Z.fromString(t)),r=n.fu.next();n.Au.set(r,new bm(e)),n.du=n.du.insert(e,r),Du(n.remoteStore,new te(Ot(Hr(e.path)),r,"TargetPurposeLimboResolution",jr.ce))}}async function qn(n,t,e){const r=F(n),s=[],o=[],a=[];r.Tu.isEmpty()||(r.Tu.forEach((u,h)=>{a.push(r.pu(h,t,e).then(d=>{if((d||e)&&r.isPrimaryClient){const g=d?!d.fromCache:e?.targetChanges.get(h.targetId)?.current;r.sharedClientState.updateQueryState(h.targetId,g?"current":"not-current")}if(d){s.push(d);const g=Mi.As(h.targetId,d);o.push(g)}}))}),await Promise.all(a),r.Pu.H_(s),await async function(h,d){const g=F(h);try{await g.persistence.runTransaction("notifyLocalViewChanges","readwrite",v=>S.forEach(d,A=>S.forEach(A.Es,C=>g.persistence.referenceDelegate.addReference(v,A.targetId,C)).next(()=>S.forEach(A.ds,C=>g.persistence.referenceDelegate.removeReference(v,A.targetId,C)))))}catch(v){if(!Ye(v))throw v;D(xi,"Failed to update sequence numbers: "+v)}for(const v of d){const A=v.targetId;if(!v.fromCache){const C=g.Ms.get(A),V=C.snapshotVersion,O=C.withLastLimboFreeSnapshotVersion(V);g.Ms=g.Ms.insert(A,O)}}}(r.localStore,o))}async function Bm(n,t){const e=F(n);if(!e.currentUser.isEqual(t)){D(zi,"User change. New user:",t.toKey());const r=await bu(e.localStore,t);e.currentUser=t,function(o,a){o.mu.forEach(u=>{u.forEach(h=>{h.reject(new N(b.CANCELLED,a))})}),o.mu.clear()}(e,"'waitForPendingWrites' promise is rejected due to a user change."),e.sharedClientState.handleUserChange(t,r.removedBatchIds,r.addedBatchIds),await qn(e,r.Ls)}}function $m(n,t){const e=F(n),r=e.Au.get(t);if(r&&r.hu)return B().add(r.key);{let s=B();const o=e.Iu.get(t);if(!o)return s;for(const a of o){const u=e.Tu.get(a);s=s.unionWith(u.view.nu)}return s}}function Wu(n){const t=F(n);return t.remoteStore.remoteSyncer.applyRemoteEvent=zu.bind(null,t),t.remoteStore.remoteSyncer.getRemoteKeysForTarget=$m.bind(null,t),t.remoteStore.remoteSyncer.rejectListen=xm.bind(null,t),t.Pu.H_=Am.bind(null,t.eventManager),t.Pu.yu=Rm.bind(null,t.eventManager),t}function jm(n){const t=F(n);return t.remoteStore.remoteSyncer.applySuccessfulWrite=Lm.bind(null,t),t.remoteStore.remoteSyncer.rejectFailedWrite=Fm.bind(null,t),t}class xr{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(t){this.serializer=Jr(t.databaseInfo.databaseId),this.sharedClientState=this.Du(t),this.persistence=this.Cu(t),await this.persistence.start(),this.localStore=this.vu(t),this.gcScheduler=this.Fu(t,this.localStore),this.indexBackfillerScheduler=this.Mu(t,this.localStore)}Fu(t,e){return null}Mu(t,e){return null}vu(t){return Hp(this.persistence,new qp,t.initialUser,this.serializer)}Cu(t){return new Cu(Oi.mi,this.serializer)}Du(t){return new Zp}async terminate(){this.gcScheduler?.stop(),this.indexBackfillerScheduler?.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}xr.provider={build:()=>new xr};class qm extends xr{constructor(t){super(),this.cacheSizeBytes=t}Fu(t,e){Q(this.persistence.referenceDelegate instanceof Or,46915);const r=this.persistence.referenceDelegate.garbageCollector;return new bp(r,t.asyncQueue,e)}Cu(t){const e=this.cacheSizeBytes!==void 0?Rt.withCacheSize(this.cacheSizeBytes):Rt.DEFAULT;return new Cu(r=>Or.mi(r,e),this.serializer)}}class ci{async initialize(t,e){this.localStore||(this.localStore=t.localStore,this.sharedClientState=t.sharedClientState,this.datastore=this.createDatastore(e),this.remoteStore=this.createRemoteStore(e),this.eventManager=this.createEventManager(e),this.syncEngine=this.createSyncEngine(e,!t.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>tc(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=Bm.bind(null,this.syncEngine),await vm(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(t){return function(){return new wm}()}createDatastore(t){const e=Jr(t.databaseInfo.databaseId),r=function(o){return new sm(o)}(t.databaseInfo);return function(o,a,u,h){return new cm(o,a,u,h)}(t.authCredentials,t.appCheckCredentials,r,e)}createRemoteStore(t){return function(r,s,o,a,u){return new lm(r,s,o,a,u)}(this.localStore,this.datastore,t.asyncQueue,e=>tc(this.syncEngine,e,0),function(){return Wa.v()?new Wa:new tm}())}createSyncEngine(t,e){return function(s,o,a,u,h,d,g){const v=new Pm(s,o,a,u,h,d);return g&&(v.gu=!0),v}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,t.initialUser,t.maxConcurrentLimboResolutions,e)}async terminate(){await async function(e){const r=F(e);D(Re,"RemoteStore shutting down."),r.Ea.add(5),await jn(r),r.Aa.shutdown(),r.Ra.set("Unknown")}(this.remoteStore),this.datastore?.terminate(),this.eventManager?.terminate()}}ci.provider={build:()=>new ci};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qu{constructor(t){this.observer=t,this.muted=!1}next(t){this.muted||this.observer.next&&this.Ou(this.observer.next,t)}error(t){this.muted||(this.observer.error?this.Ou(this.observer.error,t):Ht("Uncaught Error in snapshot listener:",t.toString()))}Nu(){this.muted=!0}Ou(t,e){setTimeout(()=>{this.muted||t(e)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pe="FirestoreClient";class zm{constructor(t,e,r,s,o){this.authCredentials=t,this.appCheckCredentials=e,this.asyncQueue=r,this.databaseInfo=s,this.user=vt.UNAUTHENTICATED,this.clientId=Ii.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=o,this.authCredentials.start(r,async a=>{D(pe,"Received user=",a.uid),await this.authCredentialListener(a),this.user=a}),this.appCheckCredentials.start(r,a=>(D(pe,"Received new app check token=",a),this.appCheckCredentialListener(a,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(t){this.authCredentialListener=t}setAppCheckTokenChangeListener(t){this.appCheckCredentialListener=t}terminate(){this.asyncQueue.enterRestrictedMode();const t=new ie;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),t.resolve()}catch(e){const r=ji(e,"Failed to shutdown persistence");t.reject(r)}}),t.promise}}async function Fs(n,t){n.asyncQueue.verifyOperationInProgress(),D(pe,"Initializing OfflineComponentProvider");const e=n.configuration;await t.initialize(e);let r=e.initialUser;n.setCredentialChangeListener(async s=>{r.isEqual(s)||(await bu(t.localStore,s),r=s)}),t.persistence.setDatabaseDeletedListener(()=>n.terminate()),n._offlineComponents=t}async function nc(n,t){n.asyncQueue.verifyOperationInProgress();const e=await Gm(n);D(pe,"Initializing OnlineComponentProvider"),await t.initialize(e,n.configuration),n.setCredentialChangeListener(r=>Xa(t.remoteStore,r)),n.setAppCheckTokenChangeListener((r,s)=>Xa(t.remoteStore,s)),n._onlineComponents=t}async function Gm(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){D(pe,"Using user provided OfflineComponentProvider");try{await Fs(n,n._uninitializedComponentsProvider._offline)}catch(t){const e=t;if(!function(s){return s.name==="FirebaseError"?s.code===b.FAILED_PRECONDITION||s.code===b.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11}(e))throw e;je("Error using user provided cache. Falling back to memory cache: "+e),await Fs(n,new xr)}}else D(pe,"Using default OfflineComponentProvider"),await Fs(n,new qm(void 0));return n._offlineComponents}async function Xu(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(D(pe,"Using user provided OnlineComponentProvider"),await nc(n,n._uninitializedComponentsProvider._online)):(D(pe,"Using default OnlineComponentProvider"),await nc(n,new ci))),n._onlineComponents}function Hm(n){return Xu(n).then(t=>t.syncEngine)}async function ui(n){const t=await Xu(n),e=t.eventManager;return e.onListen=Vm.bind(null,t.syncEngine),e.onUnlisten=Nm.bind(null,t.syncEngine),e.onFirstRemoteStoreListen=km.bind(null,t.syncEngine),e.onLastRemoteStoreUnlisten=Om.bind(null,t.syncEngine),e}function Km(n,t,e={}){const r=new ie;return n.asyncQueue.enqueueAndForget(async()=>function(o,a,u,h,d){const g=new Qu({next:A=>{g.Nu(),a.enqueueAndForget(()=>Uu(o,v));const C=A.docs.has(u);!C&&A.fromCache?d.reject(new N(b.UNAVAILABLE,"Failed to get document because the client is offline.")):C&&A.fromCache&&h&&h.source==="server"?d.reject(new N(b.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):d.resolve(A)},error:A=>d.reject(A)}),v=new Bu(Hr(u.path),g,{includeMetadataChanges:!0,qa:!0});return Fu(o,v)}(await ui(n),n.asyncQueue,t,e,r)),r.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yu(n){const t={};return n.timeoutSeconds!==void 0&&(t.timeoutSeconds=n.timeoutSeconds),t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rc=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ju="firestore.googleapis.com",sc=!0;class ic{constructor(t){if(t.host===void 0){if(t.ssl!==void 0)throw new N(b.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Ju,this.ssl=sc}else this.host=t.host,this.ssl=t.ssl??sc;if(this.isUsingEmulator=t.emulatorOptions!==void 0,this.credentials=t.credentials,this.ignoreUndefinedProperties=!!t.ignoreUndefinedProperties,this.localCache=t.localCache,t.cacheSizeBytes===void 0)this.cacheSizeBytes=Su;else{if(t.cacheSizeBytes!==-1&&t.cacheSizeBytes<Sp)throw new N(b.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=t.cacheSizeBytes}uf("experimentalForceLongPolling",t.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",t.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!t.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:t.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!t.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Yu(t.experimentalLongPollingOptions??{}),function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new N(b.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new N(b.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new N(b.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!t.useFetchStreams}isEqual(t){return this.host===t.host&&this.ssl===t.ssl&&this.credentials===t.credentials&&this.cacheSizeBytes===t.cacheSizeBytes&&this.experimentalForceLongPolling===t.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===t.experimentalAutoDetectLongPolling&&function(r,s){return r.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,t.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===t.ignoreUndefinedProperties&&this.useFetchStreams===t.useFetchStreams}}class Hi{constructor(t,e,r,s){this._authCredentials=t,this._appCheckCredentials=e,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new ic({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new N(b.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(t){if(this._settingsFrozen)throw new N(b.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new ic(t),this._emulatorOptions=t.emulatorOptions||{},t.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new Yd;switch(r.type){case"firstParty":return new ef(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new N(b.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(t.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){const r=rc.get(e);r&&(D("ComponentProvider","Removing Datastore"),rc.delete(e),r.terminate())}(this),Promise.resolve()}}function Wm(n,t,e,r={}){n=oe(n,Hi);const s=mi(t),o=n._getSettings(),a={...o,emulatorOptions:n._getEmulatorOptions()},u=`${t}:${e}`;s&&(vh(`https://${u}`),Rh("Firestore",!0)),o.host!==Ju&&o.host!==u&&je("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const h={...o,host:u,ssl:s,emulatorOptions:r};if(!Ar(h,a)&&(n._setSettings(h),r.mockUserToken)){let d,g;if(typeof r.mockUserToken=="string")d=r.mockUserToken,g=vt.MOCK_USER;else{d=Ih(r.mockUserToken,n._app?.options.projectId);const v=r.mockUserToken.sub||r.mockUserToken.user_id;if(!v)throw new N(b.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");g=new vt(v)}n._authCredentials=new Jd(new Uc(d,g))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class es{constructor(t,e,r){this.converter=e,this._query=r,this.type="query",this.firestore=t}withConverter(t){return new es(this.firestore,t,this._query)}}class ot{constructor(t,e,r){this.converter=e,this._key=r,this.type="document",this.firestore=t}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Mn(this.firestore,this.converter,this._key.path.popLast())}withConverter(t){return new ot(this.firestore,t,this._key)}toJSON(){return{type:ot._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(t,e,r){if(Un(e,ot._jsonSchema))return new ot(t,r||null,new M(Z.fromString(e.referencePath)))}}ot._jsonSchemaVersion="firestore/documentReference/1.0",ot._jsonSchema={type:st("string",ot._jsonSchemaVersion),referencePath:st("string")};class Mn extends es{constructor(t,e,r){super(t,e,Hr(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const t=this._path.popLast();return t.isEmpty()?null:new ot(this.firestore,null,new M(t))}withConverter(t){return new Mn(this.firestore,t,this._path)}}function M_(n,t,...e){if(n=Ie(n),arguments.length===1&&(t=Ii.newId()),cf("doc","path",t),n instanceof Hi){const r=Z.fromString(t,...e);return Ea(r),new ot(n,null,new M(r))}{if(!(n instanceof ot||n instanceof Mn))throw new N(b.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(Z.fromString(t,...e));return Ea(r),new ot(n.firestore,n instanceof Mn?n.converter:null,new M(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oc="AsyncQueue";class ac{constructor(t=Promise.resolve()){this.Xu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new Vu(this,"async_queue_retry"),this._c=()=>{const r=Ls();r&&D(oc,"Visibility state changed to "+r.visibilityState),this.M_.w_()},this.ac=t;const e=Ls();e&&typeof e.addEventListener=="function"&&e.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(t){this.enqueue(t)}enqueueAndForgetEvenWhileRestricted(t){this.uc(),this.cc(t)}enterRestrictedMode(t){if(!this.ec){this.ec=!0,this.sc=t||!1;const e=Ls();e&&typeof e.removeEventListener=="function"&&e.removeEventListener("visibilitychange",this._c)}}enqueue(t){if(this.uc(),this.ec)return new Promise(()=>{});const e=new ie;return this.cc(()=>this.ec&&this.sc?Promise.resolve():(t().then(e.resolve,e.reject),e.promise)).then(()=>e.promise)}enqueueRetryable(t){this.enqueueAndForget(()=>(this.Xu.push(t),this.lc()))}async lc(){if(this.Xu.length!==0){try{await this.Xu[0](),this.Xu.shift(),this.M_.reset()}catch(t){if(!Ye(t))throw t;D(oc,"Operation failed with retryable error: "+t)}this.Xu.length>0&&this.M_.p_(()=>this.lc())}}cc(t){const e=this.ac.then(()=>(this.rc=!0,t().catch(r=>{throw this.nc=r,this.rc=!1,Ht("INTERNAL UNHANDLED ERROR: ",cc(r)),r}).then(r=>(this.rc=!1,r))));return this.ac=e,e}enqueueAfterDelay(t,e,r){this.uc(),this.oc.indexOf(t)>-1&&(e=0);const s=$i.createAndSchedule(this,t,e,r,o=>this.hc(o));return this.tc.push(s),s}uc(){this.nc&&x(47125,{Pc:cc(this.nc)})}verifyOperationInProgress(){}async Tc(){let t;do t=this.ac,await t;while(t!==this.ac)}Ic(t){for(const e of this.tc)if(e.timerId===t)return!0;return!1}Ec(t){return this.Tc().then(()=>{this.tc.sort((e,r)=>e.targetTimeMs-r.targetTimeMs);for(const e of this.tc)if(e.skipDelay(),t!=="all"&&e.timerId===t)break;return this.Tc()})}dc(t){this.oc.push(t)}hc(t){const e=this.tc.indexOf(t);this.tc.splice(e,1)}}function cc(n){let t=n.message||"";return n.stack&&(t=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function uc(n){return function(e,r){if(typeof e!="object"||e===null)return!1;const s=e;for(const o of r)if(o in s&&typeof s[o]=="function")return!0;return!1}(n,["next","error","complete"])}class xn extends Hi{constructor(t,e,r,s){super(t,e,r,s),this.type="firestore",this._queue=new ac,this._persistenceKey=s?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const t=this._firestoreClient.terminate();this._queue=new ac(t),this._firestoreClient=void 0,await t}}}function x_(n,t){const e=typeof n=="object"?n:Ti(),r=typeof n=="string"?n:Cr,s=$r(e,"firestore").getImmediate({identifier:r});if(!s._initialized){const o=Th("firestore");o&&Wm(s,...o)}return s}function Ki(n){if(n._terminated)throw new N(b.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||Qm(n),n._firestoreClient}function Qm(n){const t=n._freezeSettings(),e=function(s,o,a,u){return new Tf(s,o,a,u.host,u.ssl,u.experimentalForceLongPolling,u.experimentalAutoDetectLongPolling,Yu(u.experimentalLongPollingOptions),u.useFetchStreams,u.isUsingEmulator)}(n._databaseId,n._app?.options.appId||"",n._persistenceKey,t);n._componentsProvider||t.localCache?._offlineComponentProvider&&t.localCache?._onlineComponentProvider&&(n._componentsProvider={_offline:t.localCache._offlineComponentProvider,_online:t.localCache._onlineComponentProvider}),n._firestoreClient=new zm(n._authCredentials,n._appCheckCredentials,n._queue,e,n._componentsProvider&&function(s){const o=s?._online.build();return{_offline:s?._offline.build(o),_online:o}}(n._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pt{constructor(t){this._byteString=t}static fromBase64String(t){try{return new Pt(pt.fromBase64String(t))}catch(e){throw new N(b.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+e)}}static fromUint8Array(t){return new Pt(pt.fromUint8Array(t))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(t){return this._byteString.isEqual(t._byteString)}toJSON(){return{type:Pt._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(t){if(Un(t,Pt._jsonSchema))return Pt.fromBase64String(t.bytes)}}Pt._jsonSchemaVersion="firestore/bytes/1.0",Pt._jsonSchema={type:st("string",Pt._jsonSchemaVersion),bytes:st("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wi{constructor(...t){for(let e=0;e<t.length;++e)if(t[e].length===0)throw new N(b.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new ft(t)}isEqual(t){return this._internalPath.isEqual(t._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zu{constructor(t){this._methodName=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xt{constructor(t,e){if(!isFinite(t)||t<-90||t>90)throw new N(b.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+t);if(!isFinite(e)||e<-180||e>180)throw new N(b.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+e);this._lat=t,this._long=e}get latitude(){return this._lat}get longitude(){return this._long}isEqual(t){return this._lat===t._lat&&this._long===t._long}_compareTo(t){return U(this._lat,t._lat)||U(this._long,t._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:xt._jsonSchemaVersion}}static fromJSON(t){if(Un(t,xt._jsonSchema))return new xt(t.latitude,t.longitude)}}xt._jsonSchemaVersion="firestore/geoPoint/1.0",xt._jsonSchema={type:st("string",xt._jsonSchemaVersion),latitude:st("number"),longitude:st("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lt{constructor(t){this._values=(t||[]).map(e=>e)}toArray(){return this._values.map(t=>t)}isEqual(t){return function(r,s){if(r.length!==s.length)return!1;for(let o=0;o<r.length;++o)if(r[o]!==s[o])return!1;return!0}(this._values,t._values)}toJSON(){return{type:Lt._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(t){if(Un(t,Lt._jsonSchema)){if(Array.isArray(t.vectorValues)&&t.vectorValues.every(e=>typeof e=="number"))return new Lt(t.vectorValues);throw new N(b.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Lt._jsonSchemaVersion="firestore/vectorValue/1.0",Lt._jsonSchema={type:st("string",Lt._jsonSchemaVersion),vectorValues:st("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xm=/^__.*__$/;class Ym{constructor(t,e,r){this.data=t,this.fieldMask=e,this.fieldTransforms=r}toMutation(t,e){return this.fieldMask!==null?new Pe(t,this.data,this.fieldMask,e,this.fieldTransforms):new Bn(t,this.data,e,this.fieldTransforms)}}function tl(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw x(40011,{Ac:n})}}class Qi{constructor(t,e,r,s,o,a){this.settings=t,this.databaseId=e,this.serializer=r,this.ignoreUndefinedProperties=s,o===void 0&&this.Rc(),this.fieldTransforms=o||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Ac(){return this.settings.Ac}Vc(t){return new Qi({...this.settings,...t},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}mc(t){const e=this.path?.child(t),r=this.Vc({path:e,fc:!1});return r.gc(t),r}yc(t){const e=this.path?.child(t),r=this.Vc({path:e,fc:!1});return r.Rc(),r}wc(t){return this.Vc({path:void 0,fc:!0})}Sc(t){return Lr(t,this.settings.methodName,this.settings.bc||!1,this.path,this.settings.Dc)}contains(t){return this.fieldMask.find(e=>t.isPrefixOf(e))!==void 0||this.fieldTransforms.find(e=>t.isPrefixOf(e.field))!==void 0}Rc(){if(this.path)for(let t=0;t<this.path.length;t++)this.gc(this.path.get(t))}gc(t){if(t.length===0)throw this.Sc("Document fields must not be empty");if(tl(this.Ac)&&Xm.test(t))throw this.Sc('Document fields cannot begin and end with "__"')}}class Jm{constructor(t,e,r){this.databaseId=t,this.ignoreUndefinedProperties=e,this.serializer=r||Jr(t)}Cc(t,e,r,s=!1){return new Qi({Ac:t,methodName:e,Dc:r,path:ft.emptyPath(),fc:!1,bc:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Zm(n){const t=n._freezeSettings(),e=Jr(n._databaseId);return new Jm(n._databaseId,!!t.ignoreUndefinedProperties,e)}function tg(n,t,e,r,s,o={}){const a=n.Cc(o.merge||o.mergeFields?2:0,t,e,s);sl("Data must be an object, but it was:",a,r);const u=nl(r,a);let h,d;if(o.merge)h=new kt(a.fieldMask),d=a.fieldTransforms;else if(o.mergeFields){const g=[];for(const v of o.mergeFields){const A=eg(t,v,e);if(!a.contains(A))throw new N(b.INVALID_ARGUMENT,`Field '${A}' is specified in your field mask but missing from your input data.`);rg(g,A)||g.push(A)}h=new kt(g),d=a.fieldTransforms.filter(v=>h.covers(v.field))}else h=null,d=a.fieldTransforms;return new Ym(new bt(u),h,d)}function el(n,t){if(rl(n=Ie(n)))return sl("Unsupported field value:",t,n),nl(n,t);if(n instanceof Zu)return function(r,s){if(!tl(s.Ac))throw s.Sc(`${r._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Sc(`${r._methodName}() is not currently supported inside arrays`);const o=r._toFieldTransform(s);o&&s.fieldTransforms.push(o)}(n,t),null;if(n===void 0&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),n instanceof Array){if(t.settings.fc&&t.Ac!==4)throw t.Sc("Nested arrays are not supported");return function(r,s){const o=[];let a=0;for(const u of r){let h=el(u,s.wc(a));h==null&&(h={nullValue:"NULL_VALUE"}),o.push(h),a++}return{arrayValue:{values:o}}}(n,t)}return function(r,s){if((r=Ie(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return zf(s.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const o=J.fromDate(r);return{timestampValue:Nr(s.serializer,o)}}if(r instanceof J){const o=new J(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:Nr(s.serializer,o)}}if(r instanceof xt)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Pt)return{bytesValue:Eu(s.serializer,r._byteString)};if(r instanceof ot){const o=s.databaseId,a=r.firestore._databaseId;if(!a.isEqual(o))throw s.Sc(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${o.projectId}/${o.database}`);return{referenceValue:Di(r.firestore._databaseId||s.databaseId,r._key.path)}}if(r instanceof Lt)return function(a,u){return{mapValue:{fields:{[Wc]:{stringValue:Qc},[br]:{arrayValue:{values:a.toArray().map(d=>{if(typeof d!="number")throw u.Sc("VectorValues must only contain numeric values.");return Pi(u.serializer,d)})}}}}}}(r,s);throw s.Sc(`Unsupported field value: ${wi(r)}`)}(n,t)}function nl(n,t){const e={};return jc(n)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):Ce(n,(r,s)=>{const o=el(s,t.mc(r));o!=null&&(e[r]=o)}),{mapValue:{fields:e}}}function rl(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof J||n instanceof xt||n instanceof Pt||n instanceof ot||n instanceof Zu||n instanceof Lt)}function sl(n,t,e){if(!rl(e)||!Bc(e)){const r=wi(e);throw r==="an object"?t.Sc(n+" a custom object"):t.Sc(n+" "+r)}}function eg(n,t,e){if((t=Ie(t))instanceof Wi)return t._internalPath;if(typeof t=="string")return il(n,t);throw Lr("Field path arguments must be of type string or ",n,!1,void 0,e)}const ng=new RegExp("[~\\*/\\[\\]]");function il(n,t,e){if(t.search(ng)>=0)throw Lr(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,e);try{return new Wi(...t.split("."))._internalPath}catch{throw Lr(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,e)}}function Lr(n,t,e,r,s){const o=r&&!r.isEmpty(),a=s!==void 0;let u=`Function ${t}() called with invalid data`;e&&(u+=" (via `toFirestore()`)"),u+=". ";let h="";return(o||a)&&(h+=" (found",o&&(h+=` in field ${r}`),a&&(h+=` in document ${s}`),h+=")"),new N(b.INVALID_ARGUMENT,u+n+h)}function rg(n,t){return n.some(e=>e.isEqual(t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ol{constructor(t,e,r,s,o){this._firestore=t,this._userDataWriter=e,this._key=r,this._document=s,this._converter=o}get id(){return this._key.path.lastSegment()}get ref(){return new ot(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const t=new sg(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(t)}return this._userDataWriter.convertValue(this._document.data.value)}}get(t){if(this._document){const e=this._document.data.field(al("DocumentSnapshot.get",t));if(e!==null)return this._userDataWriter.convertValue(e)}}}class sg extends ol{data(){return super.data()}}function al(n,t){return typeof t=="string"?il(n,t):t instanceof Wi?t._internalPath:t._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ig(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new N(b.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class og{convertValue(t,e="none"){switch(de(t)){case 0:return null;case 1:return t.booleanValue;case 2:return nt(t.integerValue||t.doubleValue);case 3:return this.convertTimestamp(t.timestampValue);case 4:return this.convertServerTimestamp(t,e);case 5:return t.stringValue;case 6:return this.convertBytes(he(t.bytesValue));case 7:return this.convertReference(t.referenceValue);case 8:return this.convertGeoPoint(t.geoPointValue);case 9:return this.convertArray(t.arrayValue,e);case 11:return this.convertObject(t.mapValue,e);case 10:return this.convertVectorValue(t.mapValue);default:throw x(62114,{value:t})}}convertObject(t,e){return this.convertObjectMap(t.fields,e)}convertObjectMap(t,e="none"){const r={};return Ce(t,(s,o)=>{r[s]=this.convertValue(o,e)}),r}convertVectorValue(t){const e=t.fields?.[br].arrayValue?.values?.map(r=>nt(r.doubleValue));return new Lt(e)}convertGeoPoint(t){return new xt(nt(t.latitude),nt(t.longitude))}convertArray(t,e){return(t.values||[]).map(r=>this.convertValue(r,e))}convertServerTimestamp(t,e){switch(e){case"previous":const r=zr(t);return r==null?null:this.convertValue(r,e);case"estimate":return this.convertTimestamp(Vn(t));default:return null}}convertTimestamp(t){const e=le(t);return new J(e.seconds,e.nanos)}convertDocumentKey(t,e){const r=Z.fromString(t);Q(Ru(r),9688,{name:t});const s=new kn(r.get(1),r.get(3)),o=new M(r.popFirst(5));return s.isEqual(e)||Ht(`Document ${o} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${e.projectId}/${e.database}) instead.`),o}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ag(n,t,e){let r;return r=n?e&&(e.merge||e.mergeFields)?n.toFirestore(t,e):n.toFirestore(t):t,r}class Tn{constructor(t,e){this.hasPendingWrites=t,this.fromCache=e}isEqual(t){return this.hasPendingWrites===t.hasPendingWrites&&this.fromCache===t.fromCache}}class ve extends ol{constructor(t,e,r,s,o,a){super(t,e,r,s,a),this._firestore=t,this._firestoreImpl=t,this.metadata=o}exists(){return super.exists()}data(t={}){if(this._document){if(this._converter){const e=new vr(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(e,t)}return this._userDataWriter.convertValue(this._document.data.value,t.serverTimestamps)}}get(t,e={}){if(this._document){const r=this._document.data.field(al("DocumentSnapshot.get",t));if(r!==null)return this._userDataWriter.convertValue(r,e.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new N(b.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const t=this._document,e={};return e.type=ve._jsonSchemaVersion,e.bundle="",e.bundleSource="DocumentSnapshot",e.bundleName=this._key.toString(),!t||!t.isValidDocument()||!t.isFoundDocument()?e:(this._userDataWriter.convertObjectMap(t.data.value.mapValue.fields,"previous"),e.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),e)}}ve._jsonSchemaVersion="firestore/documentSnapshot/1.0",ve._jsonSchema={type:st("string",ve._jsonSchemaVersion),bundleSource:st("string","DocumentSnapshot"),bundleName:st("string"),bundle:st("string")};class vr extends ve{data(t={}){return super.data(t)}}class $e{constructor(t,e,r,s){this._firestore=t,this._userDataWriter=e,this._snapshot=s,this.metadata=new Tn(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const t=[];return this.forEach(e=>t.push(e)),t}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(t,e){this._snapshot.docs.forEach(r=>{t.call(e,new vr(this._firestore,this._userDataWriter,r.key,r,new Tn(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(t={}){const e=!!t.includeMetadataChanges;if(e&&this._snapshot.excludesMetadataChanges)throw new N(b.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===e||(this._cachedChanges=function(s,o){if(s._snapshot.oldDocs.isEmpty()){let a=0;return s._snapshot.docChanges.map(u=>{const h=new vr(s._firestore,s._userDataWriter,u.doc.key,u.doc,new Tn(s._snapshot.mutatedKeys.has(u.doc.key),s._snapshot.fromCache),s.query.converter);return u.doc,{type:"added",doc:h,oldIndex:-1,newIndex:a++}})}{let a=s._snapshot.oldDocs;return s._snapshot.docChanges.filter(u=>o||u.type!==3).map(u=>{const h=new vr(s._firestore,s._userDataWriter,u.doc.key,u.doc,new Tn(s._snapshot.mutatedKeys.has(u.doc.key),s._snapshot.fromCache),s.query.converter);let d=-1,g=-1;return u.type!==0&&(d=a.indexOf(u.doc.key),a=a.delete(u.doc.key)),u.type!==1&&(a=a.add(u.doc),g=a.indexOf(u.doc.key)),{type:cg(u.type),doc:h,oldIndex:d,newIndex:g}})}}(this,e),this._cachedChangesIncludeMetadataChanges=e),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new N(b.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const t={};t.type=$e._jsonSchemaVersion,t.bundleSource="QuerySnapshot",t.bundleName=Ii.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const e=[],r=[],s=[];return this.docs.forEach(o=>{o._document!==null&&(e.push(o._document),r.push(this._userDataWriter.convertObjectMap(o._document.data.value.mapValue.fields,"previous")),s.push(o.ref.path))}),t.bundle=(this._firestore,this.query._query,t.bundleName,"NOT SUPPORTED"),t}}function cg(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return x(61501,{type:n})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function L_(n){n=oe(n,ot);const t=oe(n.firestore,xn);return Km(Ki(t),n._key).then(e=>ul(t,n,e))}$e._jsonSchemaVersion="firestore/querySnapshot/1.0",$e._jsonSchema={type:st("string",$e._jsonSchemaVersion),bundleSource:st("string","QuerySnapshot"),bundleName:st("string"),bundle:st("string")};class cl extends og{constructor(t){super(),this.firestore=t}convertBytes(t){return new Pt(t)}convertReference(t){const e=this.convertDocumentKey(t,this.firestore._databaseId);return new ot(this.firestore,null,e)}}function F_(n,t,e){n=oe(n,ot);const r=oe(n.firestore,xn),s=ag(n.converter,t,e);return ug(r,[tg(Zm(r),"setDoc",n._key,s,n.converter!==null,e).toMutation(n._key,zt.none())])}function U_(n,...t){n=Ie(n);let e={includeMetadataChanges:!1,source:"default"},r=0;typeof t[r]!="object"||uc(t[r])||(e=t[r++]);const s={includeMetadataChanges:e.includeMetadataChanges,source:e.source};if(uc(t[r])){const h=t[r];t[r]=h.next?.bind(h),t[r+1]=h.error?.bind(h),t[r+2]=h.complete?.bind(h)}let o,a,u;if(n instanceof ot)a=oe(n.firestore,xn),u=Hr(n._key.path),o={next:h=>{t[r]&&t[r](ul(a,n,h))},error:t[r+1],complete:t[r+2]};else{const h=oe(n,es);a=oe(h.firestore,xn),u=h._query;const d=new cl(a);o={next:g=>{t[r]&&t[r](new $e(a,d,h,g))},error:t[r+1],complete:t[r+2]},ig(n._query)}return function(d,g,v,A){const C=new Qu(A),V=new Bu(g,C,v);return d.asyncQueue.enqueueAndForget(async()=>Fu(await ui(d),V)),()=>{C.Nu(),d.asyncQueue.enqueueAndForget(async()=>Uu(await ui(d),V))}}(Ki(a),u,s,o)}function ug(n,t){return function(r,s){const o=new ie;return r.asyncQueue.enqueueAndForget(async()=>Mm(await Hm(r),s,o)),o.promise}(Ki(n),t)}function ul(n,t,e){const r=e.docs.get(t._key),s=new cl(n);return new ve(n,s,t._key,r,new Tn(e.hasPendingWrites,e.fromCache),t.converter)}(function(t,e=!0){(function(s){Qe=s})(Ld),we(new ce("firestore",(r,{instanceIdentifier:s,options:o})=>{const a=r.getProvider("app").getImmediate(),u=new xn(new Zd(r.getProvider("auth-internal")),new nf(a,r.getProvider("app-check-internal")),function(d,g){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new N(b.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new kn(d.options.projectId,g)}(a,s),a);return o={useFetchStreams:e,...o},u._setSettings(o),u},"PUBLIC").setMultipleInstances(!0)),qt(ma,ga,t),qt(ma,ga,"esm2020")})();var lc="@firebase/ai",li="2.0.0";/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const We="AI",hc="us-central1",lg="https://firebasevertexai.googleapis.com",hg="v1beta",dc=li,dg="gl-js",fg=180*1e3;/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fc=["user","model","function","system"],ll={HARM_SEVERITY_UNSUPPORTED:"HARM_SEVERITY_UNSUPPORTED"},pc={SAFETY:"SAFETY",RECITATION:"RECITATION"};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const H={ERROR:"error",REQUEST_ERROR:"request-error",RESPONSE_ERROR:"response-error",FETCH_ERROR:"fetch-error",INVALID_CONTENT:"invalid-content",API_NOT_ENABLED:"api-not-enabled",INVALID_SCHEMA:"invalid-schema",NO_API_KEY:"no-api-key",NO_APP_ID:"no-app-id",NO_MODEL:"no-model",NO_PROJECT_ID:"no-project-id",PARSE_FAILED:"parse-failed",UNSUPPORTED:"unsupported"};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wt={VERTEX_AI:"VERTEX_AI",GOOGLE_AI:"GOOGLE_AI"};/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hl{constructor(t){this.backendType=t}}class ns extends hl{constructor(){super(Wt.GOOGLE_AI)}}class rs extends hl{constructor(t=hc){super(Wt.VERTEX_AI),t?this.location=t:this.location=hc}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pg{constructor(t,e,r,s){this.app=t,this.backend=e;const o=s?.getImmediate({optional:!0}),a=r?.getImmediate({optional:!0});this.auth=a||null,this.appCheck=o||null,e instanceof rs?this.location=e.location:this.location=""}_delete(){return Promise.resolve()}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class j extends Se{constructor(t,e,r){const s=We,o=`${s}/${t}`,a=`${s}: ${e} (${o})`;super(t,a),this.code=t,this.customErrorData=r,Error.captureStackTrace&&Error.captureStackTrace(this,j),Object.setPrototypeOf(this,j.prototype),this.toString=()=>a}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mg(n){if(n instanceof ns)return`${We}/googleai`;if(n instanceof rs)return`${We}/vertexai/${n.location}`;throw new j(H.ERROR,`Invalid backend: ${JSON.stringify(n.backendType)}`)}function gg(n){const t=n.split("/");if(t[0]!==We)throw new j(H.ERROR,`Invalid instance identifier, unknown prefix '${t[0]}'`);switch(t[1]){case"vertexai":const r=t[2];if(!r)throw new j(H.ERROR,`Invalid instance identifier, unknown location '${n}'`);return new rs(r);case"googleai":return new ns;default:throw new j(H.ERROR,`Invalid instance identifier string: '${n}'`)}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sn{constructor(t,e){if(t.app?.options?.apiKey)if(t.app?.options?.projectId)if(t.app?.options?.appId){if(this._apiSettings={apiKey:t.app.options.apiKey,project:t.app.options.projectId,appId:t.app.options.appId,automaticDataCollectionEnabled:t.app.automaticDataCollectionEnabled,location:t.location,backend:t.backend},Pc(t.app)&&t.app.settings.appCheckToken){const r=t.app.settings.appCheckToken;this._apiSettings.getAppCheckToken=()=>Promise.resolve({token:r})}else t.appCheck&&(this._apiSettings.getAppCheckToken=()=>t.appCheck.getToken());t.auth&&(this._apiSettings.getAuthToken=()=>t.auth.getToken()),this.model=Sn.normalizeModelName(e,this._apiSettings.backend.backendType)}else throw new j(H.NO_APP_ID,'The "appId" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid app ID.');else throw new j(H.NO_PROJECT_ID,'The "projectId" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid project ID.');else throw new j(H.NO_API_KEY,'The "apiKey" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid API key.')}static normalizeModelName(t,e){return e===Wt.GOOGLE_AI?Sn.normalizeGoogleAIModelName(t):Sn.normalizeVertexAIModelName(t)}static normalizeGoogleAIModelName(t){return`models/${t}`}static normalizeVertexAIModelName(t){let e;return t.includes("/")?t.startsWith("models/")?e=`publishers/google/${t}`:e=t:e=`publishers/google/models/${t}`,e}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ae=new Br("@firebase/vertexai");/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ln;(function(n){n.GENERATE_CONTENT="generateContent",n.STREAM_GENERATE_CONTENT="streamGenerateContent",n.COUNT_TOKENS="countTokens",n.PREDICT="predict"})(Ln||(Ln={}));class dl{constructor(t,e,r,s,o){this.model=t,this.task=e,this.apiSettings=r,this.stream=s,this.requestOptions=o}toString(){const t=new URL(this.baseUrl);return t.pathname=`/${this.apiVersion}/${this.modelPath}:${this.task}`,t.search=this.queryParams.toString(),t.toString()}get baseUrl(){return this.requestOptions?.baseUrl||lg}get apiVersion(){return hg}get modelPath(){if(this.apiSettings.backend instanceof ns)return`projects/${this.apiSettings.project}/${this.model}`;if(this.apiSettings.backend instanceof rs)return`projects/${this.apiSettings.project}/locations/${this.apiSettings.backend.location}/${this.model}`;throw new j(H.ERROR,`Invalid backend: ${JSON.stringify(this.apiSettings.backend)}`)}get queryParams(){const t=new URLSearchParams;return this.stream&&t.set("alt","sse"),t}}function _g(){const n=[];return n.push(`${dg}/${dc}`),n.push(`fire/${dc}`),n.join(" ")}async function yg(n){const t=new Headers;if(t.append("Content-Type","application/json"),t.append("x-goog-api-client",_g()),t.append("x-goog-api-key",n.apiSettings.apiKey),n.apiSettings.automaticDataCollectionEnabled&&t.append("X-Firebase-Appid",n.apiSettings.appId),n.apiSettings.getAppCheckToken){const e=await n.apiSettings.getAppCheckToken();e&&(t.append("X-Firebase-AppCheck",e.token),e.error&&ae.warn(`Unable to obtain a valid App Check token: ${e.error.message}`))}if(n.apiSettings.getAuthToken){const e=await n.apiSettings.getAuthToken();e&&t.append("Authorization",`Firebase ${e.accessToken}`)}return t}async function Eg(n,t,e,r,s,o){const a=new dl(n,t,e,r,o);return{url:a.toString(),fetchOptions:{method:"POST",headers:await yg(a),body:s}}}async function Xi(n,t,e,r,s,o){const a=new dl(n,t,e,r,o);let u,h;try{const d=await Eg(n,t,e,r,s,o),g=o?.timeout!=null&&o.timeout>=0?o.timeout:fg,v=new AbortController;if(h=setTimeout(()=>v.abort(),g),d.fetchOptions.signal=v.signal,u=await fetch(d.url,d.fetchOptions),!u.ok){let A="",C;try{const V=await u.json();A=V.error.message,V.error.details&&(A+=` ${JSON.stringify(V.error.details)}`,C=V.error.details)}catch{}throw u.status===403&&C&&C.some(V=>V.reason==="SERVICE_DISABLED")&&C.some(V=>V.links?.[0]?.description.includes("Google developers console API activation"))?new j(H.API_NOT_ENABLED,`The Firebase AI SDK requires the Firebase AI API ('firebasevertexai.googleapis.com') to be enabled in your Firebase project. Enable this API by visiting the Firebase Console at https://console.firebase.google.com/project/${a.apiSettings.project}/genai/ and clicking "Get started". If you enabled this API recently, wait a few minutes for the action to propagate to our systems and then retry.`,{status:u.status,statusText:u.statusText,errorDetails:C}):new j(H.FETCH_ERROR,`Error fetching from ${a}: [${u.status} ${u.statusText}] ${A}`,{status:u.status,statusText:u.statusText,errorDetails:C})}}catch(d){let g=d;throw d.code!==H.FETCH_ERROR&&d.code!==H.API_NOT_ENABLED&&d instanceof Error&&(g=new j(H.ERROR,`Error fetching from ${a.toString()}: ${d.message}`),g.stack=d.stack),g}finally{h&&clearTimeout(h)}return u}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fr(n){return n.candidates&&!n.candidates[0].hasOwnProperty("index")&&(n.candidates[0].index=0),Tg(n)}function Tg(n){return n.text=()=>{if(n.candidates&&n.candidates.length>0){if(n.candidates.length>1&&ae.warn(`This response had ${n.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),Ir(n.candidates[0]))throw new j(H.RESPONSE_ERROR,`Response error: ${Zt(n)}. Response body stored in error.response`,{response:n});return vg(n)}else if(n.promptFeedback)throw new j(H.RESPONSE_ERROR,`Text not available. ${Zt(n)}`,{response:n});return""},n.inlineDataParts=()=>{if(n.candidates&&n.candidates.length>0){if(n.candidates.length>1&&ae.warn(`This response had ${n.candidates.length} candidates. Returning data from the first candidate only. Access response.candidates directly to use the other candidates.`),Ir(n.candidates[0]))throw new j(H.RESPONSE_ERROR,`Response error: ${Zt(n)}. Response body stored in error.response`,{response:n});return wg(n)}else if(n.promptFeedback)throw new j(H.RESPONSE_ERROR,`Data not available. ${Zt(n)}`,{response:n})},n.functionCalls=()=>{if(n.candidates&&n.candidates.length>0){if(n.candidates.length>1&&ae.warn(`This response had ${n.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),Ir(n.candidates[0]))throw new j(H.RESPONSE_ERROR,`Response error: ${Zt(n)}. Response body stored in error.response`,{response:n});return Ig(n)}else if(n.promptFeedback)throw new j(H.RESPONSE_ERROR,`Function call not available. ${Zt(n)}`,{response:n})},n}function vg(n){const t=[];if(n.candidates?.[0].content?.parts)for(const e of n.candidates?.[0].content?.parts)e.text&&t.push(e.text);return t.length>0?t.join(""):""}function Ig(n){const t=[];if(n.candidates?.[0].content?.parts)for(const e of n.candidates?.[0].content?.parts)e.functionCall&&t.push(e.functionCall);if(t.length>0)return t}function wg(n){const t=[];if(n.candidates?.[0].content?.parts)for(const e of n.candidates?.[0].content?.parts)e.inlineData&&t.push(e);if(t.length>0)return t}const Ag=[pc.RECITATION,pc.SAFETY];function Ir(n){return!!n.finishReason&&Ag.some(t=>t===n.finishReason)}function Zt(n){let t="";if((!n.candidates||n.candidates.length===0)&&n.promptFeedback)t+="Response was blocked",n.promptFeedback?.blockReason&&(t+=` due to ${n.promptFeedback.blockReason}`),n.promptFeedback?.blockReasonMessage&&(t+=`: ${n.promptFeedback.blockReasonMessage}`);else if(n.candidates?.[0]){const e=n.candidates[0];Ir(e)&&(t+=`Candidate was blocked due to ${e.finishReason}`,e.finishMessage&&(t+=`: ${e.finishMessage}`))}return t}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fl(n){if(n.safetySettings?.forEach(t=>{if(t.method)throw new j(H.UNSUPPORTED,"SafetySetting.method is not supported in the the Gemini Developer API. Please remove this property.")}),n.generationConfig?.topK){const t=Math.round(n.generationConfig.topK);t!==n.generationConfig.topK&&(ae.warn("topK in GenerationConfig has been rounded to the nearest integer to match the format for requests to the Gemini Developer API."),n.generationConfig.topK=t)}return n}function Yi(n){return{candidates:n.candidates?Sg(n.candidates):void 0,prompt:n.promptFeedback?Cg(n.promptFeedback):void 0,usageMetadata:n.usageMetadata}}function Rg(n,t){return{generateContentRequest:{model:t,...n}}}function Sg(n){const t=[];let e;return t&&n.forEach(r=>{let s;if(r.citationMetadata&&(s={citations:r.citationMetadata.citationSources}),r.safetyRatings&&(e=r.safetyRatings.map(a=>({...a,severity:a.severity??ll.HARM_SEVERITY_UNSUPPORTED,probabilityScore:a.probabilityScore??0,severityScore:a.severityScore??0}))),r.content?.parts.some(a=>a?.videoMetadata))throw new j(H.UNSUPPORTED,"Part.videoMetadata is not supported in the Gemini Developer API. Please remove this property.");const o={index:r.index,content:r.content,finishReason:r.finishReason,finishMessage:r.finishMessage,safetyRatings:e,citationMetadata:s,groundingMetadata:r.groundingMetadata};t.push(o)}),t}function Cg(n){const t=[];return n.safetyRatings.forEach(r=>{t.push({category:r.category,probability:r.probability,severity:r.severity??ll.HARM_SEVERITY_UNSUPPORTED,probabilityScore:r.probabilityScore??0,severityScore:r.severityScore??0,blocked:r.blocked})}),{blockReason:n.blockReason,safetyRatings:t,blockReasonMessage:n.blockReasonMessage}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mc=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;function bg(n,t){const e=n.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0})),r=kg(e),[s,o]=r.tee();return{stream:Vg(s,t),response:Pg(o,t)}}async function Pg(n,t){const e=[],r=n.getReader();for(;;){const{done:s,value:o}=await r.read();if(s){let a=Dg(e);return t.backend.backendType===Wt.GOOGLE_AI&&(a=Yi(a)),Fr(a)}e.push(o)}}async function*Vg(n,t){const e=n.getReader();for(;;){const{value:r,done:s}=await e.read();if(s)break;let o;t.backend.backendType===Wt.GOOGLE_AI?o=Fr(Yi(r)):o=Fr(r),yield o}}function kg(n){const t=n.getReader();return new ReadableStream({start(r){let s="";return o();function o(){return t.read().then(({value:a,done:u})=>{if(u){if(s.trim()){r.error(new j(H.PARSE_FAILED,"Failed to parse stream"));return}r.close();return}s+=a;let h=s.match(mc),d;for(;h;){try{d=JSON.parse(h[1])}catch{r.error(new j(H.PARSE_FAILED,`Error parsing JSON response: "${h[1]}`));return}r.enqueue(d),s=s.substring(h[0].length),h=s.match(mc)}return o()})}}})}function Dg(n){const e={promptFeedback:n[n.length-1]?.promptFeedback};for(const r of n)if(r.candidates)for(const s of r.candidates){const o=s.index||0;if(e.candidates||(e.candidates=[]),e.candidates[o]||(e.candidates[o]={index:s.index}),e.candidates[o].citationMetadata=s.citationMetadata,e.candidates[o].finishReason=s.finishReason,e.candidates[o].finishMessage=s.finishMessage,e.candidates[o].safetyRatings=s.safetyRatings,e.candidates[o].groundingMetadata=s.groundingMetadata,s.content&&s.content.parts){e.candidates[o].content||(e.candidates[o].content={role:s.content.role||"user",parts:[]});const a={};for(const u of s.content.parts){if(u.text!==void 0){if(u.text==="")continue;a.text=u.text}if(u.functionCall&&(a.functionCall=u.functionCall),Object.keys(a).length===0)throw new j(H.INVALID_CONTENT,"Part should have at least one property, but there are none. This is likely caused by a malformed response from the backend.");e.candidates[o].content.parts.push(a)}}}return e}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function pl(n,t,e,r){n.backend.backendType===Wt.GOOGLE_AI&&(e=fl(e));const s=await Xi(t,Ln.STREAM_GENERATE_CONTENT,n,!0,JSON.stringify(e),r);return bg(s,n)}async function ml(n,t,e,r){n.backend.backendType===Wt.GOOGLE_AI&&(e=fl(e));const s=await Xi(t,Ln.GENERATE_CONTENT,n,!1,JSON.stringify(e),r),o=await Ng(s,n);return{response:Fr(o)}}async function Ng(n,t){const e=await n.json();return t.backend.backendType===Wt.GOOGLE_AI?Yi(e):e}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gl(n){if(n!=null){if(typeof n=="string")return{role:"system",parts:[{text:n}]};if(n.text)return{role:"system",parts:[n]};if(n.parts)return n.role?n:{role:"system",parts:n.parts}}}function hi(n){let t=[];if(typeof n=="string")t=[{text:n}];else for(const e of n)typeof e=="string"?t.push({text:e}):t.push(e);return Og(t)}function Og(n){const t={role:"user",parts:[]},e={role:"function",parts:[]};let r=!1,s=!1;for(const o of n)"functionResponse"in o?(e.parts.push(o),s=!0):(t.parts.push(o),r=!0);if(r&&s)throw new j(H.INVALID_CONTENT,"Within a single message, FunctionResponse cannot be mixed with other type of Part in the request for sending chat message.");if(!r&&!s)throw new j(H.INVALID_CONTENT,"No Content is provided for sending chat message.");return r?t:e}function Us(n){let t;return n.contents?t=n:t={contents:[hi(n)]},n.systemInstruction&&(t.systemInstruction=gl(n.systemInstruction)),t}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gc=["text","inlineData","functionCall","functionResponse"],Mg={user:["text","inlineData"],function:["functionResponse"],model:["text","functionCall"],system:["text"]},_c={user:["model"],function:["model"],model:["user","function"],system:[]};function xg(n){let t=null;for(const e of n){const{role:r,parts:s}=e;if(!t&&r!=="user")throw new j(H.INVALID_CONTENT,`First Content should be with role 'user', got ${r}`);if(!fc.includes(r))throw new j(H.INVALID_CONTENT,`Each item should include role field. Got ${r} but valid roles are: ${JSON.stringify(fc)}`);if(!Array.isArray(s))throw new j(H.INVALID_CONTENT,"Content should have 'parts' but property with an array of Parts");if(s.length===0)throw new j(H.INVALID_CONTENT,"Each Content should have at least one part");const o={text:0,inlineData:0,functionCall:0,functionResponse:0};for(const u of s)for(const h of gc)h in u&&(o[h]+=1);const a=Mg[r];for(const u of gc)if(!a.includes(u)&&o[u]>0)throw new j(H.INVALID_CONTENT,`Content with role '${r}' can't contain '${u}' part`);if(t&&!_c[r].includes(t.role))throw new j(H.INVALID_CONTENT,`Content with role '${r}' can't follow '${t.role}'. Valid previous roles: ${JSON.stringify(_c)}`);t=e}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yc="SILENT_ERROR";class Lg{constructor(t,e,r,s){this.model=e,this.params=r,this.requestOptions=s,this._history=[],this._sendPromise=Promise.resolve(),this._apiSettings=t,r?.history&&(xg(r.history),this._history=r.history)}async getHistory(){return await this._sendPromise,this._history}async sendMessage(t){await this._sendPromise;const e=hi(t),r={safetySettings:this.params?.safetySettings,generationConfig:this.params?.generationConfig,tools:this.params?.tools,toolConfig:this.params?.toolConfig,systemInstruction:this.params?.systemInstruction,contents:[...this._history,e]};let s={};return this._sendPromise=this._sendPromise.then(()=>ml(this._apiSettings,this.model,r,this.requestOptions)).then(o=>{if(o.response.candidates&&o.response.candidates.length>0){this._history.push(e);const a={parts:o.response.candidates?.[0].content.parts||[],role:o.response.candidates?.[0].content.role||"model"};this._history.push(a)}else{const a=Zt(o.response);a&&ae.warn(`sendMessage() was unsuccessful. ${a}. Inspect response object for details.`)}s=o}),await this._sendPromise,s}async sendMessageStream(t){await this._sendPromise;const e=hi(t),r={safetySettings:this.params?.safetySettings,generationConfig:this.params?.generationConfig,tools:this.params?.tools,toolConfig:this.params?.toolConfig,systemInstruction:this.params?.systemInstruction,contents:[...this._history,e]},s=pl(this._apiSettings,this.model,r,this.requestOptions);return this._sendPromise=this._sendPromise.then(()=>s).catch(o=>{throw new Error(yc)}).then(o=>o.response).then(o=>{if(o.candidates&&o.candidates.length>0){this._history.push(e);const a={...o.candidates[0].content};a.role||(a.role="model"),this._history.push(a)}else{const a=Zt(o);a&&ae.warn(`sendMessageStream() was unsuccessful. ${a}. Inspect response object for details.`)}}).catch(o=>{o.message!==yc&&ae.error(o)}),s}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Fg(n,t,e,r){let s="";if(n.backend.backendType===Wt.GOOGLE_AI){const a=Rg(e,t);s=JSON.stringify(a)}else s=JSON.stringify(e);return(await Xi(t,Ln.COUNT_TOKENS,n,!1,s,r)).json()}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ug extends Sn{constructor(t,e,r){super(t,e.model),this.generationConfig=e.generationConfig||{},this.safetySettings=e.safetySettings||[],this.tools=e.tools,this.toolConfig=e.toolConfig,this.systemInstruction=gl(e.systemInstruction),this.requestOptions=r||{}}async generateContent(t){const e=Us(t);return ml(this._apiSettings,this.model,{generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,...e},this.requestOptions)}async generateContentStream(t){const e=Us(t);return pl(this._apiSettings,this.model,{generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,...e},this.requestOptions)}startChat(t){return new Lg(this._apiSettings,this.model,{tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,generationConfig:this.generationConfig,safetySettings:this.safetySettings,...t},this.requestOptions)}async countTokens(t){const e=Us(t);return Fg(this._apiSettings,this.model,e)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function B_(n=Ti(),t={backend:new ns}){n=Ie(n);const e=$r(n,We),r=mg(t.backend);return e.getImmediate({identifier:r})}function $_(n,t,e){if(!t.model)throw new j(H.NO_MODEL,"Must provide a model name. Example: getGenerativeModel({ model: 'my-model-name' })");return new Ug(n,t,e)}function Bg(){we(new ce(We,(n,{instanceIdentifier:t})=>{if(!t)throw new j(H.ERROR,"AIService instance identifier is undefined.");const e=gg(t),r=n.getProvider("app").getImmediate(),s=n.getProvider("auth-internal"),o=n.getProvider("app-check-internal");return new pg(r,e,s,o)},"PUBLIC").setMultipleInstances(!0)),qt(lc,li),qt(lc,li,"esm2020")}Bg();/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const di=new Map,_l={activated:!1,tokenObservers:[]},$g={initialized:!1,enabled:!1};function ct(n){return di.get(n)||{..._l}}function jg(n,t){return di.set(n,t),di.get(n)}function ss(){return $g}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yl="https://content-firebaseappcheck.googleapis.com/v1",qg="exchangeRecaptchaV3Token",zg="exchangeDebugToken",Ec={RETRIAL_MIN_WAIT:30*1e3,RETRIAL_MAX_WAIT:960*1e3},Gg=1440*60*1e3;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hg{constructor(t,e,r,s,o){if(this.operation=t,this.retryPolicy=e,this.getWaitDuration=r,this.lowerBound=s,this.upperBound=o,this.pending=null,this.nextErrorWaitInterval=s,s>o)throw new Error("Proactive refresh lower bound greater than upper bound!")}start(){this.nextErrorWaitInterval=this.lowerBound,this.process(!0).catch(()=>{})}stop(){this.pending&&(this.pending.reject("cancelled"),this.pending=null)}isRunning(){return!!this.pending}async process(t){this.stop();try{this.pending=new Cn,this.pending.promise.catch(e=>{}),await Kg(this.getNextRun(t)),this.pending.resolve(),await this.pending.promise,this.pending=new Cn,this.pending.promise.catch(e=>{}),await this.operation(),this.pending.resolve(),await this.pending.promise,this.process(!0).catch(()=>{})}catch(e){this.retryPolicy(e)?this.process(!1).catch(()=>{}):this.stop()}}getNextRun(t){if(t)return this.nextErrorWaitInterval=this.lowerBound,this.getWaitDuration();{const e=this.nextErrorWaitInterval;return this.nextErrorWaitInterval*=2,this.nextErrorWaitInterval>this.upperBound&&(this.nextErrorWaitInterval=this.upperBound),e}}}function Kg(n){return new Promise(t=>{setTimeout(t,n)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wg={"already-initialized":"You have already called initializeAppCheck() for FirebaseApp {$appName} with different options. To avoid this error, call initializeAppCheck() with the same options as when it was originally called. This will return the already initialized instance.","use-before-activation":"App Check is being used before initializeAppCheck() is called for FirebaseApp {$appName}. Call initializeAppCheck() before instantiating other Firebase services.","fetch-network-error":"Fetch failed to connect to a network. Check Internet connection. Original error: {$originalErrorMessage}.","fetch-parse-error":"Fetch client could not parse response. Original error: {$originalErrorMessage}.","fetch-status-error":"Fetch server returned an HTTP error status. HTTP status: {$httpStatus}.","storage-open":"Error thrown when opening storage. Original error: {$originalErrorMessage}.","storage-get":"Error thrown when reading from storage. Original error: {$originalErrorMessage}.","storage-set":"Error thrown when writing to storage. Original error: {$originalErrorMessage}.","recaptcha-error":"ReCAPTCHA error.","initial-throttle":"{$httpStatus} error. Attempts allowed again after {$time}",throttled:"Requests throttled due to previous {$httpStatus} error. Attempts allowed again after {$time}"},St=new yi("appCheck","AppCheck",Wg);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tc(n=!1){return n?self.grecaptcha?.enterprise:self.grecaptcha}function Ji(n){if(!ct(n).activated)throw St.create("use-before-activation",{appName:n.name})}function El(n){const t=Math.round(n/1e3),e=Math.floor(t/(3600*24)),r=Math.floor((t-e*3600*24)/3600),s=Math.floor((t-e*3600*24-r*3600)/60),o=t-e*3600*24-r*3600-s*60;let a="";return e&&(a+=pr(e)+"d:"),r&&(a+=pr(r)+"h:"),a+=pr(s)+"m:"+pr(o)+"s",a}function pr(n){return n===0?"00":n>=10?n.toString():"0"+n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Zi({url:n,body:t},e){const r={"Content-Type":"application/json"},s=e.getImmediate({optional:!0});if(s){const v=await s.getHeartbeatsHeader();v&&(r["X-Firebase-Client"]=v)}const o={method:"POST",body:JSON.stringify(t),headers:r};let a;try{a=await fetch(n,o)}catch(v){throw St.create("fetch-network-error",{originalErrorMessage:v?.message})}if(a.status!==200)throw St.create("fetch-status-error",{httpStatus:a.status});let u;try{u=await a.json()}catch(v){throw St.create("fetch-parse-error",{originalErrorMessage:v?.message})}const h=u.ttl.match(/^([\d.]+)(s)$/);if(!h||!h[2]||isNaN(Number(h[1])))throw St.create("fetch-parse-error",{originalErrorMessage:`ttl field (timeToLive) is not in standard Protobuf Duration format: ${u.ttl}`});const d=Number(h[1])*1e3,g=Date.now();return{token:u.token,expireTimeMillis:g+d,issuedAtTimeMillis:g}}function Qg(n,t){const{projectId:e,appId:r,apiKey:s}=n.options;return{url:`${yl}/projects/${e}/apps/${r}:${qg}?key=${s}`,body:{recaptcha_v3_token:t}}}function Tl(n,t){const{projectId:e,appId:r,apiKey:s}=n.options;return{url:`${yl}/projects/${e}/apps/${r}:${zg}?key=${s}`,body:{debug_token:t}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xg="firebase-app-check-database",Yg=1,Fn="firebase-app-check-store",vl="debug-token";let mr=null;function Il(){return mr||(mr=new Promise((n,t)=>{try{const e=indexedDB.open(Xg,Yg);e.onsuccess=r=>{n(r.target.result)},e.onerror=r=>{t(St.create("storage-open",{originalErrorMessage:r.target.error?.message}))},e.onupgradeneeded=r=>{const s=r.target.result;switch(r.oldVersion){case 0:s.createObjectStore(Fn,{keyPath:"compositeKey"})}}}catch(e){t(St.create("storage-open",{originalErrorMessage:e?.message}))}}),mr)}function Jg(n){return Al(Rl(n))}function Zg(n,t){return wl(Rl(n),t)}function t_(n){return wl(vl,n)}function e_(){return Al(vl)}async function wl(n,t){const r=(await Il()).transaction(Fn,"readwrite"),o=r.objectStore(Fn).put({compositeKey:n,value:t});return new Promise((a,u)=>{o.onsuccess=h=>{a()},r.onerror=h=>{u(St.create("storage-set",{originalErrorMessage:h.target.error?.message}))}})}async function Al(n){const e=(await Il()).transaction(Fn,"readonly"),s=e.objectStore(Fn).get(n);return new Promise((o,a)=>{s.onsuccess=u=>{const h=u.target.result;o(h?h.value:void 0)},e.onerror=u=>{a(St.create("storage-get",{originalErrorMessage:u.target.error?.message}))}})}function Rl(n){return`${n.options.appId}-${n.name}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ee=new Br("@firebase/app-check");/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function n_(n){if(_i()){let t;try{t=await Jg(n)}catch(e){ee.warn(`Failed to read token from IndexedDB. Error: ${e}`)}return t}}function Bs(n,t){return _i()?Zg(n,t).catch(e=>{ee.warn(`Failed to write token to IndexedDB. Error: ${e}`)}):Promise.resolve()}async function r_(){let n;try{n=await e_()}catch{}if(n)return n;{const t=crypto.randomUUID();return t_(t).catch(e=>ee.warn(`Failed to persist debug token to IndexedDB. Error: ${e}`)),t}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function to(){return ss().enabled}async function eo(){const n=ss();if(n.enabled&&n.token)return n.token.promise;throw Error(`
            Can't get debug token in production mode.
        `)}function s_(){const n=Rc(),t=ss();if(t.initialized=!0,typeof n.FIREBASE_APPCHECK_DEBUG_TOKEN!="string"&&n.FIREBASE_APPCHECK_DEBUG_TOKEN!==!0)return;t.enabled=!0;const e=new Cn;t.token=e,typeof n.FIREBASE_APPCHECK_DEBUG_TOKEN=="string"?e.resolve(n.FIREBASE_APPCHECK_DEBUG_TOKEN):e.resolve(r_())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const i_={error:"UNKNOWN_ERROR"};function o_(n){return pi.encodeString(JSON.stringify(n),!1)}async function fi(n,t=!1,e=!1){const r=n.app;Ji(r);const s=ct(r);let o=s.token,a;if(o&&!Ue(o)&&(s.token=void 0,o=void 0),!o){const d=await s.cachedTokenPromise;d&&(Ue(d)?o=d:await Bs(r,void 0))}if(!t&&o&&Ue(o))return{token:o.token};let u=!1;if(to())try{s.exchangeTokenPromise||(s.exchangeTokenPromise=Zi(Tl(r,await eo()),n.heartbeatServiceProvider).finally(()=>{s.exchangeTokenPromise=void 0}),u=!0);const d=await s.exchangeTokenPromise;return await Bs(r,d),s.token=d,{token:d.token}}catch(d){return d.code==="appCheck/throttled"||d.code==="appCheck/initial-throttle"?ee.warn(d.message):e&&ee.error(d),$s(d)}try{s.exchangeTokenPromise||(s.exchangeTokenPromise=s.provider.getToken().finally(()=>{s.exchangeTokenPromise=void 0}),u=!0),o=await ct(r).exchangeTokenPromise}catch(d){d.code==="appCheck/throttled"||d.code==="appCheck/initial-throttle"?ee.warn(d.message):e&&ee.error(d),a=d}let h;return o?a?Ue(o)?h={token:o.token,internalError:a}:h=$s(a):(h={token:o.token},s.token=o,await Bs(r,o)):h=$s(a),u&&bl(r,h),h}async function a_(n){const t=n.app;Ji(t);const{provider:e}=ct(t);if(to()){const r=await eo(),{token:s}=await Zi(Tl(t,r),n.heartbeatServiceProvider);return{token:s}}else{const{token:r}=await e.getToken();return{token:r}}}function Sl(n,t,e,r){const{app:s}=n,o=ct(s),a={next:e,error:r,type:t};if(o.tokenObservers=[...o.tokenObservers,a],o.token&&Ue(o.token)){const u=o.token;Promise.resolve().then(()=>{e({token:u.token}),vc(n)}).catch(()=>{})}o.cachedTokenPromise.then(()=>vc(n))}function Cl(n,t){const e=ct(n),r=e.tokenObservers.filter(s=>s.next!==t);r.length===0&&e.tokenRefresher&&e.tokenRefresher.isRunning()&&e.tokenRefresher.stop(),e.tokenObservers=r}function vc(n){const{app:t}=n,e=ct(t);let r=e.tokenRefresher;r||(r=c_(n),e.tokenRefresher=r),!r.isRunning()&&e.isTokenAutoRefreshEnabled&&r.start()}function c_(n){const{app:t}=n;return new Hg(async()=>{const e=ct(t);let r;if(e.token?r=await fi(n,!0):r=await fi(n),r.error)throw r.error;if(r.internalError)throw r.internalError},()=>!0,()=>{const e=ct(t);if(e.token){let r=e.token.issuedAtTimeMillis+(e.token.expireTimeMillis-e.token.issuedAtTimeMillis)*.5+3e5;const s=e.token.expireTimeMillis-300*1e3;return r=Math.min(r,s),Math.max(0,r-Date.now())}else return 0},Ec.RETRIAL_MIN_WAIT,Ec.RETRIAL_MAX_WAIT)}function bl(n,t){const e=ct(n).tokenObservers;for(const r of e)try{r.type==="EXTERNAL"&&t.error!=null?r.error(t.error):r.next(t)}catch{}}function Ue(n){return n.expireTimeMillis-Date.now()>0}function $s(n){return{token:o_(i_),error:n}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class u_{constructor(t,e){this.app=t,this.heartbeatServiceProvider=e}_delete(){const{tokenObservers:t}=ct(this.app);for(const e of t)Cl(this.app,e.next);return Promise.resolve()}}function l_(n,t){return new u_(n,t)}function h_(n){return{getToken:t=>fi(n,t),getLimitedUseToken:()=>a_(n),addTokenListener:t=>Sl(n,"INTERNAL",t),removeTokenListener:t=>Cl(n.app,t)}}const d_="@firebase/app-check",f_="0.11.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const p_="https://www.google.com/recaptcha/api.js";function m_(n,t){const e=new Cn,r=ct(n);r.reCAPTCHAState={initialized:e};const s=g_(n),o=Tc(!1);return o?Ic(n,t,o,s,e):E_(()=>{const a=Tc(!1);if(!a)throw new Error("no recaptcha");Ic(n,t,a,s,e)}),e.promise}function Ic(n,t,e,r,s){e.ready(()=>{y_(n,t,e,r),s.resolve(e)})}function g_(n){const t=`fire_app_check_${n.name}`,e=document.createElement("div");return e.id=t,e.style.display="none",document.body.appendChild(e),t}async function __(n){Ji(n);const e=await ct(n).reCAPTCHAState.initialized.promise;return new Promise((r,s)=>{const o=ct(n).reCAPTCHAState;e.ready(()=>{r(e.execute(o.widgetId,{action:"fire_app_check"}))})})}function y_(n,t,e,r){const s=e.render(r,{sitekey:t,size:"invisible",callback:()=>{ct(n).reCAPTCHAState.succeeded=!0},"error-callback":()=>{ct(n).reCAPTCHAState.succeeded=!1}}),o=ct(n);o.reCAPTCHAState={...o.reCAPTCHAState,widgetId:s}}function E_(n){const t=document.createElement("script");t.src=p_,t.onload=n,document.head.appendChild(t)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pl{constructor(t){this._siteKey=t,this._throttleData=null}async getToken(){v_(this._throttleData);const t=await __(this._app).catch(r=>{throw St.create("recaptcha-error")});if(!ct(this._app).reCAPTCHAState?.succeeded)throw St.create("recaptcha-error");let e;try{e=await Zi(Qg(this._app,t),this._heartbeatServiceProvider)}catch(r){throw r.code?.includes("fetch-status-error")?(this._throttleData=T_(Number(r.customData?.httpStatus),this._throttleData),St.create("initial-throttle",{time:El(this._throttleData.allowRequestsAfter-Date.now()),httpStatus:this._throttleData.httpStatus})):r}return this._throttleData=null,e}initialize(t){this._app=t,this._heartbeatServiceProvider=$r(t,"heartbeat"),m_(t,this._siteKey).catch(()=>{})}isEqual(t){return t instanceof Pl?this._siteKey===t._siteKey:!1}}function T_(n,t){if(n===404||n===403)return{backoffCount:1,allowRequestsAfter:Date.now()+Gg,httpStatus:n};{const e=t?t.backoffCount:0,r=Fh(e,1e3,2);return{backoffCount:e+1,allowRequestsAfter:Date.now()+r,httpStatus:n}}}function v_(n){if(n&&Date.now()-n.allowRequestsAfter<=0)throw St.create("throttled",{time:El(n.allowRequestsAfter-Date.now()),httpStatus:n.httpStatus})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function j_(n=Ti(),t){n=Ie(n);const e=$r(n,"app-check");if(ss().initialized||s_(),to()&&eo().then(s=>console.log(`App Check debug token: ${s}. You will need to add it to your app's App Check settings in the Firebase console for it to work.`)),e.isInitialized()){const s=e.getImmediate(),o=e.getOptions();if(o.isTokenAutoRefreshEnabled===t.isTokenAutoRefreshEnabled&&o.provider.isEqual(t.provider))return s;throw St.create("already-initialized",{appName:n.name})}const r=e.initialize({options:t});return I_(n,t.provider,t.isTokenAutoRefreshEnabled),ct(n).isTokenAutoRefreshEnabled&&Sl(r,"INTERNAL",()=>{}),r}function I_(n,t,e=!1){const r=jg(n,{..._l});r.activated=!0,r.provider=t,r.cachedTokenPromise=n_(n).then(s=>(s&&Ue(s)&&(r.token=s,bl(n,{token:s.token})),s)),r.isTokenAutoRefreshEnabled=e&&n.automaticDataCollectionEnabled,!n.automaticDataCollectionEnabled&&e&&ee.warn("`isTokenAutoRefreshEnabled` is true but `automaticDataCollectionEnabled` was set to false during `initializeApp()`. This blocks automatic token refresh."),r.provider.initialize(n)}const w_="app-check",wc="app-check-internal";function A_(){we(new ce(w_,n=>{const t=n.getProvider("app").getImmediate(),e=n.getProvider("heartbeat");return l_(t,e)},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((n,t,e)=>{n.getProvider(wc).initialize()})),we(new ce(wc,n=>{const t=n.getProvider("app-check").getImmediate();return h_(t)},"PUBLIC").setInstantiationMode("EXPLICIT")),qt(d_,f_)}A_();export{B_ as A,$_ as B,ce as C,M_ as D,yi as E,Se as F,F_ as G,L_ as H,x_ as I,U_ as J,Br as L,Pl as R,Ld as S,we as _,P_ as a,b_ as b,Pc as c,Ie as d,gi as e,N_ as f,R_ as g,G as h,S_ as i,mh as j,mi as k,Ti as l,$r as m,Eh as n,Ar as o,vh as p,D_ as q,qt as r,V_ as s,k_ as t,Rh as u,C_ as v,Th as w,Ih as x,Fd as y,j_ as z};
