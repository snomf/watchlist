import"./modulepreload-polyfill-B5Qt9EMX.js";import{s as v,_ as wr,a as Gt}from"./supabase-client-BH5LktKS.js";function Yt(e,t=0,n){const r=document.getElementById(e);if(!r)return;r.innerHTML=`
        <div class="star-rating-widget flex items-center gap-2">
            <div class="stars-wrapper flex">
                ${[...Array(10)].map((m,h)=>`
                    <div class="star-container" data-value="${h+1}">
                        <div class="star-half left" data-value="${h+.5}"></div>
                        <div class="star-half right" data-value="${h+1}"></div>
                        <i class="star-icon fas fa-star text-gray-500"></i>
                    </div>
                `).join("")}
            </div>
            <input type="number" step="0.5" min="0" max="10" class="rating-input-manual w-16 bg-bg-primary border-border-primary rounded-md text-center">
            <input type="hidden" class="rating-input-hidden" name="rating-${e}">
        </div>
    `;const o=r.querySelector(".stars-wrapper"),a=r.querySelector(".rating-input-manual"),s=r.querySelector(".rating-input-hidden"),i=Array.from(r.querySelectorAll(".star-container"));let l=parseFloat(t)||0;const c=m=>{const h=Math.round(m*2)/2;i.forEach(f=>{const d=parseFloat(f.dataset.value),p=f.querySelector(".star-icon");p.classList.remove("fas","fa-star","fa-star-half-alt","far","fa-star"),h>=d?(p.className="star-icon fas fa-star",p.style.color="var(--star-color, #fbbf24)"):h>=d-.5?(p.className="star-icon fas fa-star-half-alt",p.style.color="var(--star-color, #fbbf24)"):(p.className="star-icon far fa-star text-gray-500",p.style.color="")}),a.value=m.toFixed(1),s.value=m},u=m=>{l=m,c(l),n&&n(l)};i.forEach(m=>{[".left",".right"].forEach(h=>{const f=m.querySelector(h),d=parseFloat(f.dataset.value);f.addEventListener("mouseenter",()=>c(d)),f.addEventListener("click",()=>u(d))})}),o.addEventListener("mouseleave",()=>c(l)),a.addEventListener("change",()=>{let m=parseFloat(a.value);isNaN(m)&&(m=0),m=Math.max(0,Math.min(10,m)),u(m)}),u(l)}const _r="modulepreload",Er=function(e){return"/"+e},Kt={},kr=function(t,n,r){let o=Promise.resolve();if(n&&n.length>0){let l=function(c){return Promise.all(c.map(u=>Promise.resolve(u).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};document.getElementsByTagName("link");const s=document.querySelector("meta[property=csp-nonce]"),i=s?.nonce||s?.getAttribute("nonce");o=l(n.map(c=>{if(c=Er(c),c in Kt)return;Kt[c]=!0;const u=c.endsWith(".css"),m=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${m}`))return;const h=document.createElement("link");if(h.rel=u?"stylesheet":_r,u||(h.as="script"),h.crossOrigin="",h.href=c,i&&h.setAttribute("nonce",i),document.head.appendChild(h),u)return new Promise((f,d)=>{h.addEventListener("load",f),h.addEventListener("error",()=>d(new Error(`Unable to preload CSS for ${c}`)))})}))}function a(s){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=s,window.dispatchEvent(i),!i.defaultPrevented)throw s}return o.then(s=>{for(const i of s||[])i.status==="rejected"&&a(i.reason);return t().catch(a)})};let tt=null;function ze(){const e=document.getElementById("allen-easter-egg");if(!e)return;if(tt&&clearTimeout(tt),document.documentElement.getAttribute("data-theme")!=="smiling-friends"){e.classList.add("hidden"),e.style.transform="scale(1)";return}const n=37e3,o=Math.floor(Math.random()*(9e4-n+1))+n;tt=setTimeout(()=>{e.classList.remove("hidden"),e.style.transform="scale(1)"},o),e.onclick=()=>{e.style.transform="scale(0)",setTimeout(()=>{e.classList.add("hidden"),ze()},500)}}let qe=[];async function Ir(){const e=document.getElementById("settings-modal");if(!e){console.error("Settings modal element not found!");return}try{await populateWallpaperSelector(),await De()}catch(n){console.error("Error preparing settings modal:",n)}document.body.style.overflow="hidden",e.classList.remove("hidden"),e.classList.remove("modal-hidden"),e.classList.add("flex");const t=document.querySelectorAll(".theme-btn");t.forEach(n=>{n.addEventListener("click",()=>{if(t.forEach(r=>r.classList.remove("border-accent-primary")),n.classList.add("border-accent-primary"),n.dataset.theme==="smiling-friends"){const r=document.getElementById("movie-banner-select"),o="https://images6.alphacoders.com/134/1346437.png";let a=Array.from(r.options).find(s=>s.value===o);a||(a=document.createElement("option"),a.value=o,a.textContent="Smiling Friends (Theme Default)",r.appendChild(a)),r.value=o}})})}function $n(){const e=document.getElementById("settings-modal");e&&(e.classList.add("hidden"),e.classList.add("modal-hidden"),e.classList.remove("flex"),document.body.style.overflow="")}function xr(){const e=document.getElementById("wallpaper-btn"),t=document.getElementById("wallpaper-modal"),n=document.getElementById("close-wallpaper-modal"),r=document.getElementById("wallpaper-search");!e||!t||(e.addEventListener("click",async()=>{t.classList.remove("hidden"),await Lr()}),n.addEventListener("click",()=>{t.classList.add("hidden")}),t.addEventListener("click",o=>{o.target===t&&t.classList.add("hidden")}),r.addEventListener("input",o=>{Tr(o.target.value)}))}async function Lr(){if(qe.length===0){const{data:e,error:t}=await v.from("media").select("title, backdrop_path");if(t){console.error("Error fetching media for wallpapers:",t);return}qe=e.filter(n=>n.backdrop_path)}Dn(qe)}function Dn(e){const t=document.getElementById("wallpaper-grid");t&&(t.innerHTML="",e.forEach(n=>{const r=document.createElement("div");r.className="cursor-pointer rounded-lg overflow-hidden transition hover:scale-105",r.style.border="2px solid var(--color-border-primary)";const o=`https://image.tmdb.org/t/p/original${n.backdrop_path}`;r.innerHTML=`
            <img src="${o}" class="w-full h-24 object-cover">
            <div class="p-2" style="background-color: var(--color-bg-tertiary);">
                <p class="text-sm font-semibold truncate" style="color: var(--color-text-primary);">${n.title}</p>
            </div>
        `,r.addEventListener("click",async()=>{Lt=o,await Ve(),document.getElementById("wallpaper-modal").classList.add("hidden")}),t.appendChild(r)}))}function Tr(e){const t=qe.filter(n=>n.title.toLowerCase().includes(e.toLowerCase()));Dn(t)}let Lt=null;async function Ve(){const e=document.querySelector(".theme-btn.border-accent-primary"),t=e?e.dataset.theme:"night",n=Lt||null,r=document.getElementById("device-name-input"),o=r?r.value.trim():"";o&&localStorage.setItem("device_name",o);const a=document.getElementById("device-name");a&&(a.textContent=o||"User");const{error:s}=await v.from("settings").update({theme:t,wallpaper_url:n}).eq("id",1);s?console.error("Error saving settings:",s):(await De(),$n())}async function De(){const{data:e,error:t}=await v.from("settings").select("theme, wallpaper_url, hide_search_results_without_images, juainny_avatar, erick_avatar").eq("id",1).single();if(t||!e){console.error("Error loading settings:",t),document.documentElement.setAttribute("data-theme","night");return}const{theme:n,wallpaper_url:r,hide_search_results_without_images:o,juainny_avatar:a,erick_avatar:s}=e;document.documentElement.setAttribute("data-theme",n||"night"),a&&(ue.juainny=a),s&&(ue.erick=s);const i=(_,k)=>{const I=document.getElementById(k);I&&(I.innerHTML=U(_,"w-full h-full"))};i("juainny","user1-avatar-preview"),i("erick","user2-avatar-preview"),document.querySelectorAll(".theme-btn").forEach(_=>{_.dataset.theme===(n||"night")?_.classList.add("border-accent-primary"):_.classList.remove("border-accent-primary")}),document.getElementById("hide-search-images-toggle").checked=o;const c=document.getElementById("wallpaper-overlay");r?(document.body.style.backgroundImage=`url('${r}')`,document.body.style.backgroundSize="cover",document.body.style.backgroundPosition="center",document.body.style.backgroundRepeat="no-repeat",document.body.style.backgroundAttachment="fixed",c&&(n==="smiling-friends"?c.style.display="none":c.style.display="block")):(document.body.style.backgroundImage="none",document.body.style.backgroundSize="",document.body.style.backgroundPosition="",document.body.style.backgroundRepeat="",document.body.style.backgroundAttachment="",c&&(c.style.display="none")),typeof ze=="function"&&ze();const u=document.getElementById("movie-banner-select");u&&(u.value=r||"");const m=localStorage.getItem("device_name"),h=document.getElementById("device-name-input"),f=document.getElementById("device-name");h&&(h.value=m||""),f&&(f.textContent=m||"User");const d=document.getElementById("user1-avatar-nav"),p=document.getElementById("user2-avatar-nav");d&&(d.innerHTML=U("juainny","w-full h-full")),p&&(p.innerHTML=U("erick","w-full h-full"))}function Sr(){const e=document.getElementById("settings-btn"),t=document.getElementById("close-settings-modal-btn"),n=document.getElementById("save-settings-btn"),r=document.getElementById("remove-wallpaper-btn");e?e.addEventListener("click",f=>{Ir()}):console.error("Settings button NOT found in DOM during initialization."),t&&t.addEventListener("click",$n),n&&n.addEventListener("click",Ve);const o=document.getElementById("soft-refresh-btn"),a=document.getElementById("emergency-refresh-btn");o&&o.addEventListener("click",()=>{const f=new URL(window.location.href);f.searchParams.set("refresh","true"),window.location.href=f.toString()}),a&&a.addEventListener("click",()=>{const f=new URL(window.location.href);f.searchParams.set("hardrefresh","true"),window.location.href=f.toString()}),document.querySelectorAll(".theme-btn").forEach(f=>{f.addEventListener("click",()=>{const d=f.dataset.theme;document.documentElement.setAttribute("data-theme",d),document.querySelectorAll(".theme-btn").forEach(p=>p.classList.remove("border-accent-primary")),f.classList.add("border-accent-primary"),Ve()})}),xr(),r&&r.addEventListener("click",async()=>{Lt=null,await Ve()});const s=document.getElementById("avatar-picker-user1-btn"),i=document.getElementById("avatar-picker-user2-btn");s&&s.addEventListener("click",()=>Jt("juainny")),i&&i.addEventListener("click",()=>Jt("erick"));const l=document.getElementById("close-avatar-modal-btn"),c=document.getElementById("close-avatar-modal-backdrop"),u=document.getElementById("save-avatar-btn");l&&l.addEventListener("click",lt),c&&c.addEventListener("click",lt),u&&u.addEventListener("click",$r),document.querySelectorAll(".avatar-user-btn").forEach(f=>{f.addEventListener("click",()=>{R.user=f.dataset.user,ue[R.user]?.imageUrl?R.mode=ue[R.user].type||"gradient":R.mode="gradient",Be()})}),document.querySelectorAll(".avatar-mode-btn").forEach(f=>{f.addEventListener("click",()=>{R.mode=f.dataset.mode,Be()})});const m=document.getElementById("avatar-file-input");m&&m.addEventListener("change",async f=>{const d=f.target.files[0];if(d){document.getElementById("avatar-file-name").textContent=d.name,document.getElementById("avatar-file-name").classList.remove("hidden");const p=await Rr(d);p&&(R.imageUrl=p,dt())}});const h=document.getElementById("avatar-url-input");h&&h.addEventListener("input",f=>{const d=f.target.value.trim();d&&(m&&(m.value=""),document.getElementById("avatar-file-name").textContent="",document.getElementById("avatar-file-name").classList.add("hidden"),R.imageUrl=d,dt())})}const Br=["#ef4444","#f97316","#f59e0b","#84cc16","#10b981","#06b6d4","#3b82f6","#6366f1","#8b5cf6","#d946ef","#f43f5e","#1f2937"],Ar=["cat.png","headphones.png","sofa.png","spider.png","ticket.png"];let R={user:"juainny",mode:"gradient",color1:"#3b82f6",color2:"#8b5cf6",icon:"cat.png",imageUrl:null},ue={};async function Jt(e){const t=document.getElementById("avatar-modal");if(!t)return;await De();const n=ue[e];n?R={...n,user:e,mode:n.type||"gradient"}:R={user:e,mode:"gradient",color1:e==="juainny"?"#8b5cf6":"#3b82f6",color2:e==="juainny"?"#d946ef":"#06b6d4",icon:"cat.png",imageUrl:null},Cr(),Mr(),Be();const r=document.getElementById("avatar-file-input");r&&(r.value=""),document.getElementById("avatar-file-name").textContent="",document.getElementById("avatar-file-name").classList.add("hidden"),t.classList.remove("hidden"),t.classList.remove("modal-hidden"),t.classList.add("flex")}function lt(){const e=document.getElementById("avatar-modal");e&&(e.classList.add("hidden"),e.classList.add("modal-hidden"),e.classList.remove("flex"))}function Be(){document.querySelectorAll(".avatar-user-btn").forEach(n=>{n.dataset.user===R.user?n.classList.add("border-accent-primary","bg-bg-tertiary"):n.classList.remove("border-accent-primary","bg-bg-tertiary")}),document.querySelectorAll(".avatar-mode-btn").forEach(n=>{n.dataset.mode===R.mode?(n.classList.add("bg-bg-secondary","text-text-primary","shadow-sm"),n.classList.remove("text-text-muted","hover:text-text-primary")):(n.classList.remove("bg-bg-secondary","text-text-primary","shadow-sm"),n.classList.add("text-text-muted","hover:text-text-primary"))});const e=document.getElementById("avatar-gradient-controls"),t=document.getElementById("avatar-image-controls");R.mode==="gradient"?(e.classList.remove("hidden"),t.classList.add("hidden")):(e.classList.add("hidden"),t.classList.remove("hidden")),document.querySelectorAll(".color-option").forEach(n=>{const r=n.dataset.type,o=n.dataset.color;R[r]===o?n.classList.add("ring-2","ring-white"):n.classList.remove("ring-2","ring-white")}),document.querySelectorAll(".icon-option").forEach(n=>{n.dataset.icon===R.icon?n.classList.add("border-accent-primary","bg-bg-tertiary"):n.classList.remove("border-accent-primary","bg-bg-tertiary")}),dt()}function Cr(){const e=(t,n)=>{const r=document.getElementById(t);r&&(r.innerHTML="",Br.forEach(o=>{const a=document.createElement("button");a.className="color-option w-8 h-8 rounded-full cursor-pointer transition transform hover:scale-110",a.style.backgroundColor=o,a.dataset.color=o,a.dataset.type=n,a.addEventListener("click",()=>{R[n]=o,Be()}),r.appendChild(a)}))};e("color-picker-1","color1"),e("color-picker-2","color2")}function Mr(){const e=document.getElementById("icon-picker");e&&(e.innerHTML="",Ar.forEach(t=>{const n=document.createElement("button");n.className="icon-option p-2 rounded-lg border-2 border-transparent hover:bg-bg-tertiary transition flex items-center justify-center",n.dataset.icon=t,n.innerHTML=`<img src="avatars/${t}" class="w-8 h-8 object-contain">`,n.addEventListener("click",()=>{R.icon=t,Be()}),e.appendChild(n)}))}function dt(){const e=document.getElementById("avatar-preview-display");if(!e)return;const{color1:t,color2:n,icon:r,user:o,mode:a,imageUrl:s}=R;a==="image"&&s?(e.style.background="none",e.innerHTML=`<img src="${s}" class="w-full h-full object-cover">`):(e.style.background=`linear-gradient(135deg, ${t}, ${n})`,r?e.innerHTML=`<img src="avatars/${r}" class="w-16 h-16 object-contain drop-shadow-md">`:e.innerHTML=`<span class="text-4xl font-bold text-white drop-shadow-md">${o[0].toUpperCase()}</span>`)}async function Rr(e){const t=`${Date.now()}-${e.name}`,{data:n,error:r}=await v.storage.from("images").upload(`avatars/${t}`,e);if(r)return console.error("Error uploading image:",r),alert("Failed to upload image. Please try again."),null;const{data:o}=v.storage.from("images").getPublicUrl(`avatars/${t}`);return o.publicUrl}async function $r(){const{user:e,mode:t,color1:n,color2:r,icon:o,imageUrl:a}=R,s={type:t,color1:n,color2:r,icon:o,imageUrl:a};ue[e]=s;const i={};i[`${e}_avatar`]=s;const{error:l}=await v.from("settings").update(i).eq("id",1);if(l)console.error("Error saving avatar:",l),alert("Failed to save avatar. Please try again.");else{await De();const{refreshAllReactionAvatars:c}=await kr(async()=>{const{refreshAllReactionAvatars:u}=await Promise.resolve().then(()=>li);return{refreshAllReactionAvatars:u}},void 0);c(),lt()}}function U(e,t="w-8 h-8"){const n=ue[e];if(!n)return`<div class="${t} rounded-full ${e==="juainny"?"bg-purple-500":"bg-blue-500"} flex items-center justify-center text-white font-bold border border-white/20 overflow-hidden">${e[0].toUpperCase()}</div>`;const{type:r,color1:o,color2:a,icon:s,imageUrl:i}=n;return r==="image"&&i?`
            <div class="${t} rounded-full border border-white/20 relative overflow-hidden">
                <img src="${i}" class="w-full h-full object-cover">
            </div>
        `:`
        <div class="${t} rounded-full flex items-center justify-center border border-white/20 relative overflow-hidden" 
             style="background: linear-gradient(135deg, ${o}, ${a});">
            <img src="avatars/${s}" class="w-[60%] h-[60%] object-contain drop-shadow-sm">
        </div>
    `}var Xt={};/**
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
 */const Nn=function(e){const t=[];let n=0;for(let r=0;r<e.length;r++){let o=e.charCodeAt(r);o<128?t[n++]=o:o<2048?(t[n++]=o>>6|192,t[n++]=o&63|128):(o&64512)===55296&&r+1<e.length&&(e.charCodeAt(r+1)&64512)===56320?(o=65536+((o&1023)<<10)+(e.charCodeAt(++r)&1023),t[n++]=o>>18|240,t[n++]=o>>12&63|128,t[n++]=o>>6&63|128,t[n++]=o&63|128):(t[n++]=o>>12|224,t[n++]=o>>6&63|128,t[n++]=o&63|128)}return t},Dr=function(e){const t=[];let n=0,r=0;for(;n<e.length;){const o=e[n++];if(o<128)t[r++]=String.fromCharCode(o);else if(o>191&&o<224){const a=e[n++];t[r++]=String.fromCharCode((o&31)<<6|a&63)}else if(o>239&&o<365){const a=e[n++],s=e[n++],i=e[n++],l=((o&7)<<18|(a&63)<<12|(s&63)<<6|i&63)-65536;t[r++]=String.fromCharCode(55296+(l>>10)),t[r++]=String.fromCharCode(56320+(l&1023))}else{const a=e[n++],s=e[n++];t[r++]=String.fromCharCode((o&15)<<12|(a&63)<<6|s&63)}}return t.join("")},Tt={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let o=0;o<e.length;o+=3){const a=e[o],s=o+1<e.length,i=s?e[o+1]:0,l=o+2<e.length,c=l?e[o+2]:0,u=a>>2,m=(a&3)<<4|i>>4;let h=(i&15)<<2|c>>6,f=c&63;l||(f=64,s||(h=64)),r.push(n[u],n[m],n[h],n[f])}return r.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(Nn(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):Dr(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();const n=t?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let o=0;o<e.length;){const a=n[e.charAt(o++)],i=o<e.length?n[e.charAt(o)]:0;++o;const c=o<e.length?n[e.charAt(o)]:64;++o;const m=o<e.length?n[e.charAt(o)]:64;if(++o,a==null||i==null||c==null||m==null)throw new Nr;const h=a<<2|i>>4;if(r.push(h),c!==64){const f=i<<4&240|c>>2;if(r.push(f),m!==64){const d=c<<6&192|m;r.push(d)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};class Nr extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Or=function(e){const t=Nn(e);return Tt.encodeByteArray(t,!0)},On=function(e){return Or(e).replace(/\./g,"")},Pr=function(e){try{return Tt.decodeString(e,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};/**
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
 */function Pn(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const jr=()=>Pn().__FIREBASE_DEFAULTS__,Hr=()=>{if(typeof process>"u"||typeof Xt>"u")return;const e=Xt.__FIREBASE_DEFAULTS__;if(e)return JSON.parse(e)},Fr=()=>{if(typeof document>"u")return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const t=e&&Pr(e[1]);return t&&JSON.parse(t)},Wr=()=>{try{return jr()||Hr()||Fr()}catch(e){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);return}},jn=()=>{var e;return(e=Wr())===null||e===void 0?void 0:e.config};/**
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
 */class Ae{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,n)=>{this.resolve=t,this.reject=n})}wrapCallback(t){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(n):t(n,r))}}}function St(){try{return typeof indexedDB=="object"}catch{return!1}}function Ur(){return new Promise((e,t)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",o=self.indexedDB.open(r);o.onsuccess=()=>{o.result.close(),n||self.indexedDB.deleteDatabase(r),e(!0)},o.onupgradeneeded=()=>{n=!1},o.onerror=()=>{var a;t(((a=o.error)===null||a===void 0?void 0:a.message)||"")}}catch(n){t(n)}})}/**
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
 */const qr="FirebaseError";class Ie extends Error{constructor(t,n,r){super(n),this.code=t,this.customData=r,this.name=qr,Object.setPrototypeOf(this,Ie.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Bt.prototype.create)}}class Bt{constructor(t,n,r){this.service=t,this.serviceName=n,this.errors=r}create(t,...n){const r=n[0]||{},o=`${this.service}/${t}`,a=this.errors[t],s=a?Vr(a,r):"Error",i=`${this.serviceName}: ${s} (${o}).`;return new Ie(o,i,r)}}function Vr(e,t){return e.replace(zr,(n,r)=>{const o=t[r];return o!=null?String(o):`<${r}?>`})}const zr=/\{\$([^}]+)}/g;function ut(e,t){if(e===t)return!0;const n=Object.keys(e),r=Object.keys(t);for(const o of n){if(!r.includes(o))return!1;const a=e[o],s=t[o];if(Zt(a)&&Zt(s)){if(!ut(a,s))return!1}else if(a!==s)return!1}for(const o of r)if(!n.includes(o))return!1;return!0}function Zt(e){return e!==null&&typeof e=="object"}/**
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
 */const Gr=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,e=>{const t=Math.random()*16|0;return(e==="x"?t:t&3|8).toString(16)})};/**
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
 */const Yr=1e3,Kr=2,Jr=14400*1e3,Xr=.5;function Zr(e,t=Yr,n=Kr){const r=t*Math.pow(n,e),o=Math.round(Xr*r*(Math.random()-.5)*2);return Math.min(Jr,r+o)}/**
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
 */function Hn(e){return e&&e._delegate?e._delegate:e}class me{constructor(t,n,r){this.name=t,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}/**
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
 */const ie="[DEFAULT]";/**
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
 */class Qr{constructor(t,n){this.name=t,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){const n=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(n)){const r=new Ae;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const o=this.getOrInitializeService({instanceIdentifier:n});o&&r.resolve(o)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(t){var n;const r=this.normalizeInstanceIdentifier(t?.identifier),o=(n=t?.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(a){if(o)return null;throw a}else{if(o)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if(to(t))try{this.getOrInitializeService({instanceIdentifier:ie})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(n);try{const a=this.getOrInitializeService({instanceIdentifier:o});r.resolve(a)}catch{}}}}clearInstance(t=ie){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){const t=Array.from(this.instances.values());await Promise.all([...t.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...t.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=ie){return this.instances.has(t)}getOptions(t=ie){return this.instancesOptions.get(t)||{}}initialize(t={}){const{options:n={}}=t,r=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const o=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[a,s]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(a);r===i&&s.resolve(o)}return o}onInit(t,n){var r;const o=this.normalizeInstanceIdentifier(n),a=(r=this.onInitCallbacks.get(o))!==null&&r!==void 0?r:new Set;a.add(t),this.onInitCallbacks.set(o,a);const s=this.instances.get(o);return s&&t(s,o),()=>{a.delete(t)}}invokeOnInitCallbacks(t,n){const r=this.onInitCallbacks.get(n);if(r)for(const o of r)try{o(t,n)}catch{}}getOrInitializeService({instanceIdentifier:t,options:n={}}){let r=this.instances.get(t);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:eo(t),options:n}),this.instances.set(t,r),this.instancesOptions.set(t,n),this.invokeOnInitCallbacks(r,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,r)}catch{}return r||null}normalizeInstanceIdentifier(t=ie){return this.component?this.component.multipleInstances?t:ie:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function eo(e){return e===ie?void 0:e}function to(e){return e.instantiationMode==="EAGER"}/**
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
 */class no{constructor(t){this.name=t,this.providers=new Map}addComponent(t){const n=this.getProvider(t.name);if(n.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);n.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);const n=new Qr(t,this);return this.providers.set(t,n),n}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var T;(function(e){e[e.DEBUG=0]="DEBUG",e[e.VERBOSE=1]="VERBOSE",e[e.INFO=2]="INFO",e[e.WARN=3]="WARN",e[e.ERROR=4]="ERROR",e[e.SILENT=5]="SILENT"})(T||(T={}));const ro={debug:T.DEBUG,verbose:T.VERBOSE,info:T.INFO,warn:T.WARN,error:T.ERROR,silent:T.SILENT},oo=T.INFO,ao={[T.DEBUG]:"log",[T.VERBOSE]:"log",[T.INFO]:"info",[T.WARN]:"warn",[T.ERROR]:"error"},so=(e,t,...n)=>{if(t<e.logLevel)return;const r=new Date().toISOString(),o=ao[t];if(o)console[o](`[${r}]  ${e.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class At{constructor(t){this.name=t,this._logLevel=oo,this._logHandler=so,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in T))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?ro[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,T.DEBUG,...t),this._logHandler(this,T.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,T.VERBOSE,...t),this._logHandler(this,T.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,T.INFO,...t),this._logHandler(this,T.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,T.WARN,...t),this._logHandler(this,T.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,T.ERROR,...t),this._logHandler(this,T.ERROR,...t)}}const io=(e,t)=>t.some(n=>e instanceof n);let Qt,en;function co(){return Qt||(Qt=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function lo(){return en||(en=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Fn=new WeakMap,mt=new WeakMap,Wn=new WeakMap,nt=new WeakMap,Ct=new WeakMap;function uo(e){const t=new Promise((n,r)=>{const o=()=>{e.removeEventListener("success",a),e.removeEventListener("error",s)},a=()=>{n(re(e.result)),o()},s=()=>{r(e.error),o()};e.addEventListener("success",a),e.addEventListener("error",s)});return t.then(n=>{n instanceof IDBCursor&&Fn.set(n,e)}).catch(()=>{}),Ct.set(t,e),t}function mo(e){if(mt.has(e))return;const t=new Promise((n,r)=>{const o=()=>{e.removeEventListener("complete",a),e.removeEventListener("error",s),e.removeEventListener("abort",s)},a=()=>{n(),o()},s=()=>{r(e.error||new DOMException("AbortError","AbortError")),o()};e.addEventListener("complete",a),e.addEventListener("error",s),e.addEventListener("abort",s)});mt.set(e,t)}let ft={get(e,t,n){if(e instanceof IDBTransaction){if(t==="done")return mt.get(e);if(t==="objectStoreNames")return e.objectStoreNames||Wn.get(e);if(t==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return re(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function fo(e){ft=e(ft)}function ho(e){return e===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...n){const r=e.call(rt(this),t,...n);return Wn.set(r,t.sort?t.sort():[t]),re(r)}:lo().includes(e)?function(...t){return e.apply(rt(this),t),re(Fn.get(this))}:function(...t){return re(e.apply(rt(this),t))}}function po(e){return typeof e=="function"?ho(e):(e instanceof IDBTransaction&&mo(e),io(e,co())?new Proxy(e,ft):e)}function re(e){if(e instanceof IDBRequest)return uo(e);if(nt.has(e))return nt.get(e);const t=po(e);return t!==e&&(nt.set(e,t),Ct.set(t,e)),t}const rt=e=>Ct.get(e);function go(e,t,{blocked:n,upgrade:r,blocking:o,terminated:a}={}){const s=indexedDB.open(e,t),i=re(s);return r&&s.addEventListener("upgradeneeded",l=>{r(re(s.result),l.oldVersion,l.newVersion,re(s.transaction),l)}),n&&s.addEventListener("blocked",l=>n(l.oldVersion,l.newVersion,l)),i.then(l=>{a&&l.addEventListener("close",()=>a()),o&&l.addEventListener("versionchange",c=>o(c.oldVersion,c.newVersion,c))}).catch(()=>{}),i}const vo=["get","getKey","getAll","getAllKeys","count"],yo=["put","add","delete","clear"],ot=new Map;function tn(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(ot.get(t))return ot.get(t);const n=t.replace(/FromIndex$/,""),r=t!==n,o=yo.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(o||vo.includes(n)))return;const a=async function(s,...i){const l=this.transaction(s,o?"readwrite":"readonly");let c=l.store;return r&&(c=c.index(i.shift())),(await Promise.all([c[n](...i),o&&l.done]))[0]};return ot.set(t,a),a}fo(e=>({...e,get:(t,n,r)=>tn(t,n)||e.get(t,n,r),has:(t,n)=>!!tn(t,n)||e.has(t,n)}));/**
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
 */class bo{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(wo(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function wo(e){const t=e.getComponent();return t?.type==="VERSION"}const ht="@firebase/app",nn="0.10.16";/**
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
 */const Q=new At("@firebase/app"),_o="@firebase/app-compat",Eo="@firebase/analytics-compat",ko="@firebase/analytics",Io="@firebase/app-check-compat",xo="@firebase/app-check",Lo="@firebase/auth",To="@firebase/auth-compat",So="@firebase/database",Bo="@firebase/data-connect",Ao="@firebase/database-compat",Co="@firebase/functions",Mo="@firebase/functions-compat",Ro="@firebase/installations",$o="@firebase/installations-compat",Do="@firebase/messaging",No="@firebase/messaging-compat",Oo="@firebase/performance",Po="@firebase/performance-compat",jo="@firebase/remote-config",Ho="@firebase/remote-config-compat",Fo="@firebase/storage",Wo="@firebase/storage-compat",Uo="@firebase/firestore",qo="@firebase/vertexai",Vo="@firebase/firestore-compat",zo="firebase";/**
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
 */const pt="[DEFAULT]",Go={[ht]:"fire-core",[_o]:"fire-core-compat",[ko]:"fire-analytics",[Eo]:"fire-analytics-compat",[xo]:"fire-app-check",[Io]:"fire-app-check-compat",[Lo]:"fire-auth",[To]:"fire-auth-compat",[So]:"fire-rtdb",[Bo]:"fire-data-connect",[Ao]:"fire-rtdb-compat",[Co]:"fire-fn",[Mo]:"fire-fn-compat",[Ro]:"fire-iid",[$o]:"fire-iid-compat",[Do]:"fire-fcm",[No]:"fire-fcm-compat",[Oo]:"fire-perf",[Po]:"fire-perf-compat",[jo]:"fire-rc",[Ho]:"fire-rc-compat",[Fo]:"fire-gcs",[Wo]:"fire-gcs-compat",[Uo]:"fire-fst",[Vo]:"fire-fst-compat",[qo]:"fire-vertex","fire-js":"fire-js",[zo]:"fire-js-all"};/**
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
 */const Ge=new Map,Yo=new Map,gt=new Map;function rn(e,t){try{e.container.addComponent(t)}catch(n){Q.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function ke(e){const t=e.name;if(gt.has(t))return Q.debug(`There were multiple attempts to register component ${t}.`),!1;gt.set(t,e);for(const n of Ge.values())rn(n,e);for(const n of Yo.values())rn(n,e);return!0}function Mt(e,t){const n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}/**
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
 */const Ko={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},oe=new Bt("app","Firebase",Ko);/**
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
 */class Jo{constructor(t,n,r){this._isDeleted=!1,this._options=Object.assign({},t),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new me("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw oe.create("app-deleted",{appName:this._name})}}function Un(e,t={}){let n=e;typeof t!="object"&&(t={name:t});const r=Object.assign({name:pt,automaticDataCollectionEnabled:!1},t),o=r.name;if(typeof o!="string"||!o)throw oe.create("bad-app-name",{appName:String(o)});if(n||(n=jn()),!n)throw oe.create("no-options");const a=Ge.get(o);if(a){if(ut(n,a.options)&&ut(r,a.config))return a;throw oe.create("duplicate-app",{appName:o})}const s=new no(o);for(const l of gt.values())s.addComponent(l);const i=new Jo(n,r,s);return Ge.set(o,i),i}function qn(e=pt){const t=Ge.get(e);if(!t&&e===pt&&jn())return Un();if(!t)throw oe.create("no-app",{appName:e});return t}function de(e,t,n){var r;let o=(r=Go[e])!==null&&r!==void 0?r:e;n&&(o+=`-${n}`);const a=o.match(/\s|\//),s=t.match(/\s|\//);if(a||s){const i=[`Unable to register library "${o}" with version "${t}":`];a&&i.push(`library name "${o}" contains illegal characters (whitespace or "/")`),a&&s&&i.push("and"),s&&i.push(`version name "${t}" contains illegal characters (whitespace or "/")`),Q.warn(i.join(" "));return}ke(new me(`${o}-version`,()=>({library:o,version:t}),"VERSION"))}/**
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
 */const Xo="firebase-heartbeat-database",Zo=1,Ce="firebase-heartbeat-store";let at=null;function Vn(){return at||(at=go(Xo,Zo,{upgrade:(e,t)=>{switch(t){case 0:try{e.createObjectStore(Ce)}catch(n){console.warn(n)}}}}).catch(e=>{throw oe.create("idb-open",{originalErrorMessage:e.message})})),at}async function Qo(e){try{const n=(await Vn()).transaction(Ce),r=await n.objectStore(Ce).get(zn(e));return await n.done,r}catch(t){if(t instanceof Ie)Q.warn(t.message);else{const n=oe.create("idb-get",{originalErrorMessage:t?.message});Q.warn(n.message)}}}async function on(e,t){try{const r=(await Vn()).transaction(Ce,"readwrite");await r.objectStore(Ce).put(t,zn(e)),await r.done}catch(n){if(n instanceof Ie)Q.warn(n.message);else{const r=oe.create("idb-set",{originalErrorMessage:n?.message});Q.warn(r.message)}}}function zn(e){return`${e.name}!${e.options.appId}`}/**
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
 */const ea=1024,ta=720*60*60*1e3;class na{constructor(t){this.container=t,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new oa(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var t,n;try{const o=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),a=an();return((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===a||this._heartbeatsCache.heartbeats.some(s=>s.date===a)?void 0:(this._heartbeatsCache.heartbeats.push({date:a,agent:o}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(s=>{const i=new Date(s.date).valueOf();return Date.now()-i<=ta}),this._storage.overwrite(this._heartbeatsCache))}catch(r){Q.warn(r)}}async getHeartbeatsHeader(){var t;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=an(),{heartbeatsToSend:r,unsentEntries:o}=ra(this._heartbeatsCache.heartbeats),a=On(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,o.length>0?(this._heartbeatsCache.heartbeats=o,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),a}catch(n){return Q.warn(n),""}}}function an(){return new Date().toISOString().substring(0,10)}function ra(e,t=ea){const n=[];let r=e.slice();for(const o of e){const a=n.find(s=>s.agent===o.agent);if(a){if(a.dates.push(o.date),sn(n)>t){a.dates.pop();break}}else if(n.push({agent:o.agent,dates:[o.date]}),sn(n)>t){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class oa{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return St()?Ur().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Qo(this.app);return n?.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){var n;if(await this._canUseIndexedDBPromise){const o=await this.read();return on(this.app,{lastSentHeartbeatDate:(n=t.lastSentHeartbeatDate)!==null&&n!==void 0?n:o.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){var n;if(await this._canUseIndexedDBPromise){const o=await this.read();return on(this.app,{lastSentHeartbeatDate:(n=t.lastSentHeartbeatDate)!==null&&n!==void 0?n:o.lastSentHeartbeatDate,heartbeats:[...o.heartbeats,...t.heartbeats]})}else return}}function sn(e){return On(JSON.stringify({version:2,heartbeats:e})).length}/**
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
 */function aa(e){ke(new me("platform-logger",t=>new bo(t),"PRIVATE")),ke(new me("heartbeat",t=>new na(t),"PRIVATE")),de(ht,nn,e),de(ht,nn,"esm2017"),de("fire-js","")}aa("");var sa="firebase",ia="11.0.2";/**
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
 */de(sa,ia,"app");/**
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
 */const vt=new Map,Gn={activated:!1,tokenObservers:[]},ca={initialized:!1,enabled:!1};function $(e){return vt.get(e)||Object.assign({},Gn)}function la(e,t){return vt.set(e,t),vt.get(e)}function Xe(){return ca}/**
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
 */const Yn="https://content-firebaseappcheck.googleapis.com/v1",da="exchangeRecaptchaV3Token",ua="exchangeDebugToken",cn={RETRIAL_MIN_WAIT:30*1e3,RETRIAL_MAX_WAIT:960*1e3},ma=1440*60*1e3;/**
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
 */class fa{constructor(t,n,r,o,a){if(this.operation=t,this.retryPolicy=n,this.getWaitDuration=r,this.lowerBound=o,this.upperBound=a,this.pending=null,this.nextErrorWaitInterval=o,o>a)throw new Error("Proactive refresh lower bound greater than upper bound!")}start(){this.nextErrorWaitInterval=this.lowerBound,this.process(!0).catch(()=>{})}stop(){this.pending&&(this.pending.reject("cancelled"),this.pending=null)}isRunning(){return!!this.pending}async process(t){this.stop();try{this.pending=new Ae,this.pending.promise.catch(n=>{}),await ha(this.getNextRun(t)),this.pending.resolve(),await this.pending.promise,this.pending=new Ae,this.pending.promise.catch(n=>{}),await this.operation(),this.pending.resolve(),await this.pending.promise,this.process(!0).catch(()=>{})}catch(n){this.retryPolicy(n)?this.process(!1).catch(()=>{}):this.stop()}}getNextRun(t){if(t)return this.nextErrorWaitInterval=this.lowerBound,this.getWaitDuration();{const n=this.nextErrorWaitInterval;return this.nextErrorWaitInterval*=2,this.nextErrorWaitInterval>this.upperBound&&(this.nextErrorWaitInterval=this.upperBound),n}}}function ha(e){return new Promise(t=>{setTimeout(t,e)})}/**
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
 */const pa={"already-initialized":"You have already called initializeAppCheck() for FirebaseApp {$appName} with different options. To avoid this error, call initializeAppCheck() with the same options as when it was originally called. This will return the already initialized instance.","use-before-activation":"App Check is being used before initializeAppCheck() is called for FirebaseApp {$appName}. Call initializeAppCheck() before instantiating other Firebase services.","fetch-network-error":"Fetch failed to connect to a network. Check Internet connection. Original error: {$originalErrorMessage}.","fetch-parse-error":"Fetch client could not parse response. Original error: {$originalErrorMessage}.","fetch-status-error":"Fetch server returned an HTTP error status. HTTP status: {$httpStatus}.","storage-open":"Error thrown when opening storage. Original error: {$originalErrorMessage}.","storage-get":"Error thrown when reading from storage. Original error: {$originalErrorMessage}.","storage-set":"Error thrown when writing to storage. Original error: {$originalErrorMessage}.","recaptcha-error":"ReCAPTCHA error.",throttled:"Requests throttled due to {$httpStatus} error. Attempts allowed again after {$time}"},j=new Bt("appCheck","AppCheck",pa);/**
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
 */function ln(e=!1){var t;return e?(t=self.grecaptcha)===null||t===void 0?void 0:t.enterprise:self.grecaptcha}function Rt(e){if(!$(e).activated)throw j.create("use-before-activation",{appName:e.name})}function Kn(e){const t=Math.round(e/1e3),n=Math.floor(t/(3600*24)),r=Math.floor((t-n*3600*24)/3600),o=Math.floor((t-n*3600*24-r*3600)/60),a=t-n*3600*24-r*3600-o*60;let s="";return n&&(s+=Fe(n)+"d:"),r&&(s+=Fe(r)+"h:"),s+=Fe(o)+"m:"+Fe(a)+"s",s}function Fe(e){return e===0?"00":e>=10?e.toString():"0"+e}/**
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
 */async function $t({url:e,body:t},n){const r={"Content-Type":"application/json"},o=n.getImmediate({optional:!0});if(o){const m=await o.getHeartbeatsHeader();m&&(r["X-Firebase-Client"]=m)}const a={method:"POST",body:JSON.stringify(t),headers:r};let s;try{s=await fetch(e,a)}catch(m){throw j.create("fetch-network-error",{originalErrorMessage:m?.message})}if(s.status!==200)throw j.create("fetch-status-error",{httpStatus:s.status});let i;try{i=await s.json()}catch(m){throw j.create("fetch-parse-error",{originalErrorMessage:m?.message})}const l=i.ttl.match(/^([\d.]+)(s)$/);if(!l||!l[2]||isNaN(Number(l[1])))throw j.create("fetch-parse-error",{originalErrorMessage:`ttl field (timeToLive) is not in standard Protobuf Duration format: ${i.ttl}`});const c=Number(l[1])*1e3,u=Date.now();return{token:i.token,expireTimeMillis:u+c,issuedAtTimeMillis:u}}function ga(e,t){const{projectId:n,appId:r,apiKey:o}=e.options;return{url:`${Yn}/projects/${n}/apps/${r}:${da}?key=${o}`,body:{recaptcha_v3_token:t}}}function Jn(e,t){const{projectId:n,appId:r,apiKey:o}=e.options;return{url:`${Yn}/projects/${n}/apps/${r}:${ua}?key=${o}`,body:{debug_token:t}}}/**
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
 */const va="firebase-app-check-database",ya=1,Me="firebase-app-check-store",Xn="debug-token";let We=null;function Zn(){return We||(We=new Promise((e,t)=>{try{const n=indexedDB.open(va,ya);n.onsuccess=r=>{e(r.target.result)},n.onerror=r=>{var o;t(j.create("storage-open",{originalErrorMessage:(o=r.target.error)===null||o===void 0?void 0:o.message}))},n.onupgradeneeded=r=>{const o=r.target.result;switch(r.oldVersion){case 0:o.createObjectStore(Me,{keyPath:"compositeKey"})}}}catch(n){t(j.create("storage-open",{originalErrorMessage:n?.message}))}}),We)}function ba(e){return er(tr(e))}function wa(e,t){return Qn(tr(e),t)}function _a(e){return Qn(Xn,e)}function Ea(){return er(Xn)}async function Qn(e,t){const r=(await Zn()).transaction(Me,"readwrite"),a=r.objectStore(Me).put({compositeKey:e,value:t});return new Promise((s,i)=>{a.onsuccess=l=>{s()},r.onerror=l=>{var c;i(j.create("storage-set",{originalErrorMessage:(c=l.target.error)===null||c===void 0?void 0:c.message}))}})}async function er(e){const n=(await Zn()).transaction(Me,"readonly"),o=n.objectStore(Me).get(e);return new Promise((a,s)=>{o.onsuccess=i=>{const l=i.target.result;a(l?l.value:void 0)},n.onerror=i=>{var l;s(j.create("storage-get",{originalErrorMessage:(l=i.target.error)===null||l===void 0?void 0:l.message}))}})}function tr(e){return`${e.options.appId}-${e.name}`}/**
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
 */const Re=new At("@firebase/app-check");/**
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
 */async function ka(e){if(St()){let t;try{t=await ba(e)}catch(n){Re.warn(`Failed to read token from IndexedDB. Error: ${n}`)}return t}}function st(e,t){return St()?wa(e,t).catch(n=>{Re.warn(`Failed to write token to IndexedDB. Error: ${n}`)}):Promise.resolve()}async function Ia(){let e;try{e=await Ea()}catch{}if(e)return e;{const t=Gr();return _a(t).catch(n=>Re.warn(`Failed to persist debug token to IndexedDB. Error: ${n}`)),t}}/**
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
 */function Dt(){return Xe().enabled}async function Nt(){const e=Xe();if(e.enabled&&e.token)return e.token.promise;throw Error(`
            Can't get debug token in production mode.
        `)}function xa(){const e=Pn(),t=Xe();if(t.initialized=!0,typeof e.FIREBASE_APPCHECK_DEBUG_TOKEN!="string"&&e.FIREBASE_APPCHECK_DEBUG_TOKEN!==!0)return;t.enabled=!0;const n=new Ae;t.token=n,typeof e.FIREBASE_APPCHECK_DEBUG_TOKEN=="string"?n.resolve(e.FIREBASE_APPCHECK_DEBUG_TOKEN):n.resolve(Ia())}/**
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
 */const La={error:"UNKNOWN_ERROR"};function Ta(e){return Tt.encodeString(JSON.stringify(e),!1)}async function yt(e,t=!1){const n=e.app;Rt(n);const r=$(n);let o=r.token,a;if(o&&!ge(o)&&(r.token=void 0,o=void 0),!o){const l=await r.cachedTokenPromise;l&&(ge(l)?o=l:await st(n,void 0))}if(!t&&o&&ge(o))return{token:o.token};let s=!1;if(Dt()){r.exchangeTokenPromise||(r.exchangeTokenPromise=$t(Jn(n,await Nt()),e.heartbeatServiceProvider).finally(()=>{r.exchangeTokenPromise=void 0}),s=!0);const l=await r.exchangeTokenPromise;return await st(n,l),r.token=l,{token:l.token}}try{r.exchangeTokenPromise||(r.exchangeTokenPromise=r.provider.getToken().finally(()=>{r.exchangeTokenPromise=void 0}),s=!0),o=await $(n).exchangeTokenPromise}catch(l){l.code==="appCheck/throttled"?Re.warn(l.message):Re.error(l),a=l}let i;return o?a?ge(o)?i={token:o.token,internalError:a}:i=un(a):(i={token:o.token},r.token=o,await st(n,o)):i=un(a),s&&or(n,i),i}async function Sa(e){const t=e.app;Rt(t);const{provider:n}=$(t);if(Dt()){const r=await Nt(),{token:o}=await $t(Jn(t,r),e.heartbeatServiceProvider);return{token:o}}else{const{token:r}=await n.getToken();return{token:r}}}function nr(e,t,n,r){const{app:o}=e,a=$(o),s={next:n,error:r,type:t};if(a.tokenObservers=[...a.tokenObservers,s],a.token&&ge(a.token)){const i=a.token;Promise.resolve().then(()=>{n({token:i.token}),dn(e)}).catch(()=>{})}a.cachedTokenPromise.then(()=>dn(e))}function rr(e,t){const n=$(e),r=n.tokenObservers.filter(o=>o.next!==t);r.length===0&&n.tokenRefresher&&n.tokenRefresher.isRunning()&&n.tokenRefresher.stop(),n.tokenObservers=r}function dn(e){const{app:t}=e,n=$(t);let r=n.tokenRefresher;r||(r=Ba(e),n.tokenRefresher=r),!r.isRunning()&&n.isTokenAutoRefreshEnabled&&r.start()}function Ba(e){const{app:t}=e;return new fa(async()=>{const n=$(t);let r;if(n.token?r=await yt(e,!0):r=await yt(e),r.error)throw r.error;if(r.internalError)throw r.internalError},()=>!0,()=>{const n=$(t);if(n.token){let r=n.token.issuedAtTimeMillis+(n.token.expireTimeMillis-n.token.issuedAtTimeMillis)*.5+3e5;const o=n.token.expireTimeMillis-300*1e3;return r=Math.min(r,o),Math.max(0,r-Date.now())}else return 0},cn.RETRIAL_MIN_WAIT,cn.RETRIAL_MAX_WAIT)}function or(e,t){const n=$(e).tokenObservers;for(const r of n)try{r.type==="EXTERNAL"&&t.error!=null?r.error(t.error):r.next(t)}catch{}}function ge(e){return e.expireTimeMillis-Date.now()>0}function un(e){return{token:Ta(La),error:e}}/**
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
 */class Aa{constructor(t,n){this.app=t,this.heartbeatServiceProvider=n}_delete(){const{tokenObservers:t}=$(this.app);for(const n of t)rr(this.app,n.next);return Promise.resolve()}}function Ca(e,t){return new Aa(e,t)}function Ma(e){return{getToken:t=>yt(e,t),getLimitedUseToken:()=>Sa(e),addTokenListener:t=>nr(e,"INTERNAL",t),removeTokenListener:t=>rr(e.app,t)}}const Ra="@firebase/app-check",$a="0.8.10";/**
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
 */const Da="https://www.google.com/recaptcha/api.js";function Na(e,t){const n=new Ae,r=$(e);r.reCAPTCHAState={initialized:n};const o=Oa(e),a=ln(!1);return a?mn(e,t,a,o,n):Ha(()=>{const s=ln(!1);if(!s)throw new Error("no recaptcha");mn(e,t,s,o,n)}),n.promise}function mn(e,t,n,r,o){n.ready(()=>{ja(e,t,n,r),o.resolve(n)})}function Oa(e){const t=`fire_app_check_${e.name}`,n=document.createElement("div");return n.id=t,n.style.display="none",document.body.appendChild(n),t}async function Pa(e){Rt(e);const n=await $(e).reCAPTCHAState.initialized.promise;return new Promise((r,o)=>{const a=$(e).reCAPTCHAState;n.ready(()=>{r(n.execute(a.widgetId,{action:"fire_app_check"}))})})}function ja(e,t,n,r){const o=n.render(r,{sitekey:t,size:"invisible",callback:()=>{$(e).reCAPTCHAState.succeeded=!0},"error-callback":()=>{$(e).reCAPTCHAState.succeeded=!1}}),a=$(e);a.reCAPTCHAState=Object.assign(Object.assign({},a.reCAPTCHAState),{widgetId:o})}function Ha(e){const t=document.createElement("script");t.src=Da,t.onload=e,document.head.appendChild(t)}/**
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
 */class Ot{constructor(t){this._siteKey=t,this._throttleData=null}async getToken(){var t,n,r;Wa(this._throttleData);const o=await Pa(this._app).catch(s=>{throw j.create("recaptcha-error")});if(!(!((t=$(this._app).reCAPTCHAState)===null||t===void 0)&&t.succeeded))throw j.create("recaptcha-error");let a;try{a=await $t(ga(this._app,o),this._heartbeatServiceProvider)}catch(s){throw!((n=s.code)===null||n===void 0)&&n.includes("fetch-status-error")?(this._throttleData=Fa(Number((r=s.customData)===null||r===void 0?void 0:r.httpStatus),this._throttleData),j.create("throttled",{time:Kn(this._throttleData.allowRequestsAfter-Date.now()),httpStatus:this._throttleData.httpStatus})):s}return this._throttleData=null,a}initialize(t){this._app=t,this._heartbeatServiceProvider=Mt(t,"heartbeat"),Na(t,this._siteKey).catch(()=>{})}isEqual(t){return t instanceof Ot?this._siteKey===t._siteKey:!1}}function Fa(e,t){if(e===404||e===403)return{backoffCount:1,allowRequestsAfter:Date.now()+ma,httpStatus:e};{const n=t?t.backoffCount:0,r=Zr(n,1e3,2);return{backoffCount:n+1,allowRequestsAfter:Date.now()+r,httpStatus:e}}}function Wa(e){if(e&&Date.now()-e.allowRequestsAfter<=0)throw j.create("throttled",{time:Kn(e.allowRequestsAfter-Date.now()),httpStatus:e.httpStatus})}/**
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
 */function Ua(e=qn(),t){e=Hn(e);const n=Mt(e,"app-check");if(Xe().initialized||xa(),Dt()&&Nt().then(o=>console.log(`App Check debug token: ${o}. You will need to add it to your app's App Check settings in the Firebase console for it to work.`)),n.isInitialized()){const o=n.getImmediate(),a=n.getOptions();if(a.isTokenAutoRefreshEnabled===t.isTokenAutoRefreshEnabled&&a.provider.isEqual(t.provider))return o;throw j.create("already-initialized",{appName:e.name})}const r=n.initialize({options:t});return qa(e,t.provider,t.isTokenAutoRefreshEnabled),$(e).isTokenAutoRefreshEnabled&&nr(r,"INTERNAL",()=>{}),r}function qa(e,t,n){const r=la(e,Object.assign({},Gn));r.activated=!0,r.provider=t,r.cachedTokenPromise=ka(e).then(o=>(o&&ge(o)&&(r.token=o,or(e,{token:o.token})),o)),r.isTokenAutoRefreshEnabled=n===void 0?e.automaticDataCollectionEnabled:n,r.provider.initialize(e)}const Va="app-check",fn="app-check-internal";function za(){ke(new me(Va,e=>{const t=e.getProvider("app").getImmediate(),n=e.getProvider("heartbeat");return Ca(t,n)},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,n)=>{e.getProvider(fn).initialize()})),ke(new me(fn,e=>{const t=e.getProvider("app-check").getImmediate();return Ma(t)},"PUBLIC").setInstantiationMode("EXPLICIT")),de(Ra,$a)}za();var hn="@firebase/vertexai",bt="1.0.1";/**
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
 */const Pt="vertexAI",ar="us-central1",Ga="https://firebasevertexai.googleapis.com",Ya="v1beta",pn=bt,Ka="gl-js";/**
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
 */class Ja{constructor(t,n,r,o){var a;this.app=t,this.options=o;const s=r?.getImmediate({optional:!0}),i=n?.getImmediate({optional:!0});this.auth=i||null,this.appCheck=s||null,this.location=((a=this.options)===null||a===void 0?void 0:a.location)||ar}_delete(){return Promise.resolve()}}/**
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
 */class B extends Ie{constructor(t,n,r){const o=Pt,a="VertexAI",s=`${o}/${t}`,i=`${a}: ${n} (${s})`;super(t,i),this.code=t,this.customErrorData=r,Error.captureStackTrace&&Error.captureStackTrace(this,B),Object.setPrototypeOf(this,B.prototype),this.toString=()=>i}}/**
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
 */const be=new At("@firebase/vertexai");/**
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
 */var $e;(function(e){e.GENERATE_CONTENT="generateContent",e.STREAM_GENERATE_CONTENT="streamGenerateContent",e.COUNT_TOKENS="countTokens"})($e||($e={}));class sr{constructor(t,n,r,o,a){this.model=t,this.task=n,this.apiSettings=r,this.stream=o,this.requestOptions=a}toString(){var t;const n=Ya;let o=`${((t=this.requestOptions)===null||t===void 0?void 0:t.baseUrl)||Ga}/${n}`;return o+=`/projects/${this.apiSettings.project}`,o+=`/locations/${this.apiSettings.location}`,o+=`/${this.model}`,o+=`:${this.task}`,this.stream&&(o+="?alt=sse"),o}get fullModelString(){let t=`projects/${this.apiSettings.project}`;return t+=`/locations/${this.apiSettings.location}`,t+=`/${this.model}`,t}}function Xa(){const e=[];return e.push(`${Ka}/${pn}`),e.push(`fire/${pn}`),e.join(" ")}async function Za(e){const t=new Headers;if(t.append("Content-Type","application/json"),t.append("x-goog-api-client",Xa()),t.append("x-goog-api-key",e.apiSettings.apiKey),e.apiSettings.getAppCheckToken){const n=await e.apiSettings.getAppCheckToken();n&&(t.append("X-Firebase-AppCheck",n.token),n.error&&be.warn(`Unable to obtain a valid App Check token: ${n.error.message}`))}if(e.apiSettings.getAuthToken){const n=await e.apiSettings.getAuthToken();n&&t.append("Authorization",`Firebase ${n.accessToken}`)}return t}async function Qa(e,t,n,r,o,a){const s=new sr(e,t,n,r,a);return{url:s.toString(),fetchOptions:Object.assign(Object.assign({},es(a)),{method:"POST",headers:await Za(s),body:o})}}async function jt(e,t,n,r,o,a){const s=new sr(e,t,n,r,a);let i;try{const l=await Qa(e,t,n,r,o,a);if(i=await fetch(l.url,l.fetchOptions),!i.ok){let c="",u;try{const m=await i.json();c=m.error.message,m.error.details&&(c+=` ${JSON.stringify(m.error.details)}`,u=m.error.details)}catch{}throw i.status===403&&u.some(m=>m.reason==="SERVICE_DISABLED")&&u.some(m=>{var h,f;return(f=(h=m.links)===null||h===void 0?void 0:h[0])===null||f===void 0?void 0:f.description.includes("Google developers console API activation")})?new B("api-not-enabled",`The Vertex AI in Firebase SDK requires the Vertex AI in Firebase API ('firebasevertexai.googleapis.com') to be enabled in your Firebase project. Enable this API by visiting the Firebase Console at https://console.firebase.google.com/project/${s.apiSettings.project}/genai/ and clicking "Get started". If you enabled this API recently, wait a few minutes for the action to propagate to our systems and then retry.`,{status:i.status,statusText:i.statusText,errorDetails:u}):new B("fetch-error",`Error fetching from ${s}: [${i.status} ${i.statusText}] ${c}`,{status:i.status,statusText:i.statusText,errorDetails:u})}}catch(l){let c=l;throw l.code!=="fetch-error"&&l.code!=="api-not-enabled"&&l instanceof Error&&(c=new B("error",`Error fetching from ${s.toString()}: ${l.message}`),c.stack=l.stack),c}return i}function es(e){const t={};let n=18e4;e?.timeout&&e?.timeout>=0&&(n=e.timeout);const r=new AbortController,o=r.signal;return setTimeout(()=>r.abort(),n),t.signal=o,t}/**
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
 */const gn=["user","model","function","system"];var vn;(function(e){e.HARM_CATEGORY_HATE_SPEECH="HARM_CATEGORY_HATE_SPEECH",e.HARM_CATEGORY_SEXUALLY_EXPLICIT="HARM_CATEGORY_SEXUALLY_EXPLICIT",e.HARM_CATEGORY_HARASSMENT="HARM_CATEGORY_HARASSMENT",e.HARM_CATEGORY_DANGEROUS_CONTENT="HARM_CATEGORY_DANGEROUS_CONTENT"})(vn||(vn={}));var yn;(function(e){e.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",e.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",e.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",e.BLOCK_NONE="BLOCK_NONE"})(yn||(yn={}));var bn;(function(e){e.SEVERITY="SEVERITY",e.PROBABILITY="PROBABILITY"})(bn||(bn={}));var wn;(function(e){e.NEGLIGIBLE="NEGLIGIBLE",e.LOW="LOW",e.MEDIUM="MEDIUM",e.HIGH="HIGH"})(wn||(wn={}));var _n;(function(e){e.HARM_SEVERITY_NEGLIGIBLE="HARM_SEVERITY_NEGLIGIBLE",e.HARM_SEVERITY_LOW="HARM_SEVERITY_LOW",e.HARM_SEVERITY_MEDIUM="HARM_SEVERITY_MEDIUM",e.HARM_SEVERITY_HIGH="HARM_SEVERITY_HIGH"})(_n||(_n={}));var En;(function(e){e.SAFETY="SAFETY",e.OTHER="OTHER"})(En||(En={}));var Ye;(function(e){e.STOP="STOP",e.MAX_TOKENS="MAX_TOKENS",e.SAFETY="SAFETY",e.RECITATION="RECITATION",e.OTHER="OTHER"})(Ye||(Ye={}));var kn;(function(e){e.AUTO="AUTO",e.ANY="ANY",e.NONE="NONE"})(kn||(kn={}));/**
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
 */var In;(function(e){e.STRING="string",e.NUMBER="number",e.INTEGER="integer",e.BOOLEAN="boolean",e.ARRAY="array",e.OBJECT="object"})(In||(In={}));/**
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
 */function Ht(e){return e.candidates&&!e.candidates[0].hasOwnProperty("index")&&(e.candidates[0].index=0),ts(e)}function ts(e){return e.text=()=>{if(e.candidates&&e.candidates.length>0){if(e.candidates.length>1&&be.warn(`This response had ${e.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),wt(e.candidates[0]))throw new B("response-error",`Response error: ${ve(e)}. Response body stored in error.response`,{response:e});return ns(e)}else if(e.promptFeedback)throw new B("response-error",`Text not available. ${ve(e)}`,{response:e});return""},e.functionCalls=()=>{if(e.candidates&&e.candidates.length>0){if(e.candidates.length>1&&be.warn(`This response had ${e.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),wt(e.candidates[0]))throw new B("response-error",`Response error: ${ve(e)}. Response body stored in error.response`,{response:e});return rs(e)}else if(e.promptFeedback)throw new B("response-error",`Function call not available. ${ve(e)}`,{response:e})},e}function ns(e){var t,n,r,o;const a=[];if(!((n=(t=e.candidates)===null||t===void 0?void 0:t[0].content)===null||n===void 0)&&n.parts)for(const s of(o=(r=e.candidates)===null||r===void 0?void 0:r[0].content)===null||o===void 0?void 0:o.parts)s.text&&a.push(s.text);return a.length>0?a.join(""):""}function rs(e){var t,n,r,o;const a=[];if(!((n=(t=e.candidates)===null||t===void 0?void 0:t[0].content)===null||n===void 0)&&n.parts)for(const s of(o=(r=e.candidates)===null||r===void 0?void 0:r[0].content)===null||o===void 0?void 0:o.parts)s.functionCall&&a.push(s.functionCall);if(a.length>0)return a}const os=[Ye.RECITATION,Ye.SAFETY];function wt(e){return!!e.finishReason&&os.includes(e.finishReason)}function ve(e){var t,n,r;let o="";if((!e.candidates||e.candidates.length===0)&&e.promptFeedback)o+="Response was blocked",!((t=e.promptFeedback)===null||t===void 0)&&t.blockReason&&(o+=` due to ${e.promptFeedback.blockReason}`),!((n=e.promptFeedback)===null||n===void 0)&&n.blockReasonMessage&&(o+=`: ${e.promptFeedback.blockReasonMessage}`);else if(!((r=e.candidates)===null||r===void 0)&&r[0]){const a=e.candidates[0];wt(a)&&(o+=`Candidate was blocked due to ${a.finishReason}`,a.finishMessage&&(o+=`: ${a.finishMessage}`))}return o}/**
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
 */const xn=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;function as(e){const t=e.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0})),n=cs(t),[r,o]=n.tee();return{stream:is(r),response:ss(o)}}async function ss(e){const t=[],n=e.getReader();for(;;){const{done:r,value:o}=await n.read();if(r)return Ht(ls(t));t.push(o)}}function is(e){return wr(this,arguments,function*(){const n=e.getReader();for(;;){const{value:r,done:o}=yield Gt(n.read());if(o)break;const a=Ht(r);yield yield Gt(a)}})}function cs(e){const t=e.getReader();return new ReadableStream({start(r){let o="";return a();function a(){return t.read().then(({value:s,done:i})=>{if(i){if(o.trim()){r.error(new B("parse-failed","Failed to parse stream"));return}r.close();return}o+=s;let l=o.match(xn),c;for(;l;){try{c=JSON.parse(l[1])}catch{r.error(new B("parse-failed",`Error parsing JSON response: "${l[1]}`));return}r.enqueue(c),o=o.substring(l[0].length),l=o.match(xn)}return a()})}}})}function ls(e){const t=e[e.length-1],n={promptFeedback:t?.promptFeedback};for(const r of e)if(r.candidates)for(const o of r.candidates){const a=o.index||0;if(n.candidates||(n.candidates=[]),n.candidates[a]||(n.candidates[a]={index:o.index}),n.candidates[a].citationMetadata=o.citationMetadata,n.candidates[a].finishReason=o.finishReason,n.candidates[a].finishMessage=o.finishMessage,n.candidates[a].safetyRatings=o.safetyRatings,o.content&&o.content.parts){n.candidates[a].content||(n.candidates[a].content={role:o.content.role||"user",parts:[]});const s={};for(const i of o.content.parts)i.text&&(s.text=i.text),i.functionCall&&(s.functionCall=i.functionCall),Object.keys(s).length===0&&(s.text=""),n.candidates[a].content.parts.push(s)}}return n}/**
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
 */async function ir(e,t,n,r){const o=await jt(t,$e.STREAM_GENERATE_CONTENT,e,!0,JSON.stringify(n),r);return as(o)}async function cr(e,t,n,r){const a=await(await jt(t,$e.GENERATE_CONTENT,e,!1,JSON.stringify(n),r)).json();return{response:Ht(a)}}/**
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
 */function lr(e){if(e!=null){if(typeof e=="string")return{role:"system",parts:[{text:e}]};if(e.text)return{role:"system",parts:[e]};if(e.parts)return e.role?e:{role:"system",parts:e.parts}}}function _t(e){let t=[];if(typeof e=="string")t=[{text:e}];else for(const n of e)typeof n=="string"?t.push({text:n}):t.push(n);return ds(t)}function ds(e){const t={role:"user",parts:[]},n={role:"function",parts:[]};let r=!1,o=!1;for(const a of e)"functionResponse"in a?(n.parts.push(a),o=!0):(t.parts.push(a),r=!0);if(r&&o)throw new B("invalid-content","Within a single message, FunctionResponse cannot be mixed with other type of Part in the request for sending chat message.");if(!r&&!o)throw new B("invalid-content","No Content is provided for sending chat message.");return r?t:n}function it(e){let t;return e.contents?t=e:t={contents:[_t(e)]},e.systemInstruction&&(t.systemInstruction=lr(e.systemInstruction)),t}/**
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
 */const Ln=["text","inlineData","functionCall","functionResponse"],us={user:["text","inlineData"],function:["functionResponse"],model:["text","functionCall"],system:["text"]},Tn={user:["model"],function:["model"],model:["user","function"],system:[]};function ms(e){let t=null;for(const n of e){const{role:r,parts:o}=n;if(!t&&r!=="user")throw new B("invalid-content",`First Content should be with role 'user', got ${r}`);if(!gn.includes(r))throw new B("invalid-content",`Each item should include role field. Got ${r} but valid roles are: ${JSON.stringify(gn)}`);if(!Array.isArray(o))throw new B("invalid-content","Content should have 'parts' but property with an array of Parts");if(o.length===0)throw new B("invalid-content","Each Content should have at least one part");const a={text:0,inlineData:0,functionCall:0,functionResponse:0};for(const i of o)for(const l of Ln)l in i&&(a[l]+=1);const s=us[r];for(const i of Ln)if(!s.includes(i)&&a[i]>0)throw new B("invalid-content",`Content with role '${r}' can't contain '${i}' part`);if(t&&!Tn[r].includes(t.role))throw new B("invalid-content",`Content with role '${r} can't follow '${t.role}'. Valid previous roles: ${JSON.stringify(Tn)}`);t=n}}/**
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
 */const Sn="SILENT_ERROR";class fs{constructor(t,n,r,o){this.model=n,this.params=r,this.requestOptions=o,this._history=[],this._sendPromise=Promise.resolve(),this._apiSettings=t,r?.history&&(ms(r.history),this._history=r.history)}async getHistory(){return await this._sendPromise,this._history}async sendMessage(t){var n,r,o,a,s;await this._sendPromise;const i=_t(t),l={safetySettings:(n=this.params)===null||n===void 0?void 0:n.safetySettings,generationConfig:(r=this.params)===null||r===void 0?void 0:r.generationConfig,tools:(o=this.params)===null||o===void 0?void 0:o.tools,toolConfig:(a=this.params)===null||a===void 0?void 0:a.toolConfig,systemInstruction:(s=this.params)===null||s===void 0?void 0:s.systemInstruction,contents:[...this._history,i]};let c={};return this._sendPromise=this._sendPromise.then(()=>cr(this._apiSettings,this.model,l,this.requestOptions)).then(u=>{var m,h;if(u.response.candidates&&u.response.candidates.length>0){this._history.push(i);const f={parts:((m=u.response.candidates)===null||m===void 0?void 0:m[0].content.parts)||[],role:((h=u.response.candidates)===null||h===void 0?void 0:h[0].content.role)||"model"};this._history.push(f)}else{const f=ve(u.response);f&&be.warn(`sendMessage() was unsuccessful. ${f}. Inspect response object for details.`)}c=u}),await this._sendPromise,c}async sendMessageStream(t){var n,r,o,a,s;await this._sendPromise;const i=_t(t),l={safetySettings:(n=this.params)===null||n===void 0?void 0:n.safetySettings,generationConfig:(r=this.params)===null||r===void 0?void 0:r.generationConfig,tools:(o=this.params)===null||o===void 0?void 0:o.tools,toolConfig:(a=this.params)===null||a===void 0?void 0:a.toolConfig,systemInstruction:(s=this.params)===null||s===void 0?void 0:s.systemInstruction,contents:[...this._history,i]},c=ir(this._apiSettings,this.model,l,this.requestOptions);return this._sendPromise=this._sendPromise.then(()=>c).catch(u=>{throw new Error(Sn)}).then(u=>u.response).then(u=>{if(u.candidates&&u.candidates.length>0){this._history.push(i);const m=Object.assign({},u.candidates[0].content);m.role||(m.role="model"),this._history.push(m)}else{const m=ve(u);m&&be.warn(`sendMessageStream() was unsuccessful. ${m}. Inspect response object for details.`)}}).catch(u=>{u.message!==Sn&&be.error(u)}),c}}/**
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
 */async function hs(e,t,n,r){return(await jt(t,$e.COUNT_TOKENS,e,!1,JSON.stringify(n),r)).json()}/**
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
 */class ps{constructor(t,n,r){var o,a,s,i;if(!((a=(o=t.app)===null||o===void 0?void 0:o.options)===null||a===void 0)&&a.apiKey)if(!((i=(s=t.app)===null||s===void 0?void 0:s.options)===null||i===void 0)&&i.projectId)this._apiSettings={apiKey:t.app.options.apiKey,project:t.app.options.projectId,location:t.location},t.appCheck&&(this._apiSettings.getAppCheckToken=()=>t.appCheck.getToken()),t.auth&&(this._apiSettings.getAuthToken=()=>t.auth.getToken());else throw new B("no-project-id",'The "projectId" field is empty in the local Firebase config. Firebase VertexAI requires this field to contain a valid project ID.');else throw new B("no-api-key",'The "apiKey" field is empty in the local Firebase config. Firebase VertexAI requires this field to contain a valid API key.');n.model.includes("/")?n.model.startsWith("models/")?this.model=`publishers/google/${n.model}`:this.model=n.model:this.model=`publishers/google/models/${n.model}`,this.generationConfig=n.generationConfig||{},this.safetySettings=n.safetySettings||[],this.tools=n.tools,this.toolConfig=n.toolConfig,this.systemInstruction=lr(n.systemInstruction),this.requestOptions=r||{}}async generateContent(t){const n=it(t);return cr(this._apiSettings,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction},n),this.requestOptions)}async generateContentStream(t){const n=it(t);return ir(this._apiSettings,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction},n),this.requestOptions)}startChat(t){return new fs(this._apiSettings,this.model,Object.assign({tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction},t),this.requestOptions)}async countTokens(t){const n=it(t);return hs(this._apiSettings,this.model,n)}}/**
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
 */function gs(e=qn(),t){return e=Hn(e),Mt(e,Pt).getImmediate({identifier:ar})}function vs(e,t,n){if(!t.model)throw new B("no-model","Must provide a model name. Example: getGenerativeModel({ model: 'my-model-name' })");return new ps(e,t,n)}function ys(){ke(new me(Pt,(e,{instanceIdentifier:t})=>{const n=e.getProvider("app").getImmediate(),r=e.getProvider("auth-internal"),o=e.getProvider("app-check-internal");return new Ja(n,r,o,{location:t})},"PUBLIC").setMultipleInstances(!0)),de(hn,bt),de(hn,bt,"esm2017")}ys();const bs={apiKey:"AIzaSyB7ijoC19A2krXR4kchbLEK_OZy_I53hsY",authDomain:"marvelmarathon.firebaseapp.com",projectId:"marvelmarathon",storageBucket:"marvelmarathon.firebasestorage.app",messagingSenderId:"436493932151",appId:"1:436493932151:web:9e2907b98d3132bf159872"},dr=Un(bs);typeof window<"u"&&Ua(dr,{provider:new Ot("6LdRTRQsAAAAAK07rxxw0rG2s7iBlrx_zLaLs4u5"),isTokenAutoRefreshEnabled:!0});const ws=gs(dr),ur=vs(ws,{model:"gemini-2.5-flash"}),_s="25e3d089cc8e37a56bf6a1984daf3c5c";async function Es(){console.log("Performing a hard reset. Deleting all media data...");const{error:e}=await v.from("media").delete().neq("id",0);if(e){console.error("CRITICAL: Failed to delete data. Check your RLS policies.",e);return}console.log("All existing media has been deleted.");const t=await Is();if(t.length){console.log(`Starting to seed ${t.length} items from watchednotes.json...`);for(const n of t){const r=await ks(n.title);if(r){const{error:o}=await v.from("media").insert({title:n.title,type:n.type,tmdb_id:r,source:"fetched"});o&&console.error(`Error inserting '${n.title}':`,o)}}console.log("Database hard reset and seeding complete.")}}async function ks(e){const t=`https://api.themoviedb.org/3/search/multi?api_key=${_s}&query=${encodeURIComponent(e)}`;try{const r=await(await fetch(t)).json();if(r.results&&r.results.length>0){const o=r.results.find(a=>a.media_type==="movie"||a.media_type==="tv");if(o)return o.id}return console.warn(`TMDB ID not found for: ${e}`),null}catch(n){return console.error(`Error fetching TMDB ID for ${e}:`,n),null}}async function Is(){try{const e=await fetch("/watchednotes.json");if(!e.ok)throw new Error("Failed to fetch watchednotes.json");return await e.json()}catch(e){return console.error("Error fetching local media data:",e),[]}}async function xs(){const{data:e,error:t}=await v.from("flairs").select("*").order("name");return t?(console.error("Error fetching flairs:",t),[]):e}async function Ls(e){const{data:t,error:n}=await v.from("media_flairs").select(`
            flair_id,
            flairs (
                id,
                name,
                color,
                icon,
                description
            )
        `).eq("media_id",e);return n?(console.error("Error fetching media flairs:",n),[]):t.map(r=>r.flairs)}async function Ts(e){const{data:t,error:n}=await v.from("flairs").insert([e]).select().single();return n?(console.error("Error creating flair:",n),null):t}async function Ss(e,t){const n=await Ls(e);if(n.length>=2)return{success:!1,message:"Max 2 flairs per media item."};if(n.find(o=>o.id===t))return{success:!1,message:"Flair already assigned."};const{error:r}=await v.from("media_flairs").insert([{media_id:e,flair_id:t}]);return r?(console.error("Error assigning flair:",r),{success:!1,message:"Failed to assign flair."}):{success:!0,message:"Flair assigned."}}async function Bs(e,t){const{error:n}=await v.from("media_flairs").delete().eq("media_id",e).eq("flair_id",t);return n?(console.error("Error removing flair:",n),!1):!0}function te(e,t="text-xs px-2 py-0.5"){let n="";return e.icon&&(e.icon.startsWith("fa")?n=`<i class="${e.icon}"></i>`:n=`<span>${e.icon}</span>`),`
        <span class="inline-flex items-center gap-1 rounded-full font-semibold shadow-sm ${t} transform transition-transform hover:scale-105 cursor-default border border-white/20" 
              style="background-color: ${e.color}; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">
            ${n}
            <span>${e.name}</span>
        </span>
    `}async function As(e,t,n){const r=`
    You are Willow, a friendly and helpful AI assistant for a movie/show watchlist.
    
    Task: Generate a brief, engaging summary of the users' opinions on the following media item.
    
    Media Title: ${e.title||e.name}
    Overview: ${e.overview}
    
    User 1 (Juainny):
    - Rating: ${t.user1||"N/A"}/5
    - Notes: ${n.user1||"No notes"}
    
    User 2 (Erick):
    - Rating: ${t.user2||"N/A"}/5
    - Notes: ${n.user2||"No notes"}
    
    Instructions:
    - Synthesize the ratings and notes into a cohesive paragraph.
    - If notes are missing, focus on the ratings or the media overview.
    - Keep it under 100 words.
    - Be friendly and use the persona of "Willow".
    - If both users liked it, mention that. If they disagreed, highlight the contrast playfully.
    `;try{return(await(await ur.generateContent(r)).response).text()}catch(o){return console.error("Error generating summary:",o),"Willow is having trouble thinking right now. check back later!"}}async function Cs(e,t){const n=t.map(o=>({title:o.title||o.name,type:o.type,watched:o.watched,want_to_watch:o.want_to_watch,currently_watching:o.currently_watching,ratings:{juainny:o.user1_rating,erick:o.user2_rating},notes:{juainny:o.user1_notes,erick:o.user2_notes}})),r=`
    You are Willow, the AI assistant for Juainny and Erick's watchlist.
    
    Context: You have access to their entire watchlist database.
    Database Summary: ${JSON.stringify(n)}
    
    User Question: ${e}
    
    Instructions:
    - Answer the question based on the provided database.
    - You can recommend things to watch from their "want_to_watch" list.
    - You can summarize what they have watched.
    - Be friendly, helpful, and concise.
    - If the answer isn't in the database, use your general knowledge but mention that it's not in their list.
    `;try{return(await(await ur.generateContent(r)).response).text()}catch(o){return console.error("Error chatting with Willow:",o),"I'm feeling a bit overwhelmed with all this data. Ask me again in a moment!"}}const ae="25e3d089cc8e37a56bf6a1984daf3c5c";async function Ms(e){console.log("Starting TMDB data synchronization...");const t=10;let n=[],r=0,o=0;for(let a=0;a<e.length;a+=t){const i=e.slice(a,a+t).map(async c=>{if(!c.tmdb_id||!c.type)return c;const h=`https://api.themoviedb.org/3/${c.type==="movie"?"movie":"tv"}/${c.tmdb_id}?api_key=${ae}&append_to_response=release_dates,content_ratings,external_ids`;try{const f=await fetch(h);if(!f.ok)return console.error(`Error fetching TMDB data for ${c.title} (ID: ${c.tmdb_id}): ${f.status}`),o++,c;const d=await f.json(),p=d.title||d.name,_={};c.poster_path!==d.poster_path&&(_.poster_path=d.poster_path),c.title!==p&&(_.title=p);const k=d.release_date||d.first_air_date||"",I=k?parseInt(k.split("-")[0]):null;I&&(!c.release_year||c.release_year!==I)&&(_.release_year=I);let E=d.runtime||(d.episode_run_time&&d.episode_run_time.length>0?d.episode_run_time[0]:0);const y=c.type==="tv"||c.type==="series";y&&!E&&(d.last_episode_to_air&&d.last_episode_to_air.runtime?E=d.last_episode_to_air.runtime:d.next_episode_to_air&&d.next_episode_to_air.runtime&&(E=d.next_episode_to_air.runtime)),E&&(c.runtime===0||!c.runtime||c.runtime!==E)&&(_.runtime=E);let b="N/A";if(c.type==="movie"&&d.release_dates){const A=d.release_dates.results.find(D=>D.iso_3166_1==="US");if(A){const D=A.release_dates.find(z=>z.certification!=="");D&&(b=D.certification)}}else if(y&&d.content_ratings&&d.content_ratings.results){const A=d.content_ratings.results.find(D=>D.iso_3166_1==="US");A?b=A.rating:d.content_ratings.results.length>0&&(b=d.content_ratings.results[0].rating)}b!=="N/A"&&(!c.content_rating||c.content_rating==="N/A"||c.content_rating!==b)&&(_.content_rating=b);const x=d.external_ids?.imdb_id;if(x&&(!c.imdb_id||c.imdb_id!==x)&&(_.imdb_id=x),Object.keys(_).length>0){const{error:A}=await v.from("media").update(_).eq("id",c.id);return A?(console.error(`Error updating Supabase for ${c.title}:`,A),o++,c):(console.log(`✓ Updated ${c.title}:`,Object.keys(_).join(", ")),r++,{...c,..._})}return c}catch(f){return console.error(`Error during TMDB sync for ${c.title}:`,f),o++,c}}),l=await Promise.all(i);n=n.concat(l)}return console.log(`TMDB sync complete. Updated: ${r}/${e.length}. Errors: ${o}`),n}let L=[],we=[],N=[],K="all",Et="grid",Ke="default",ce=[],M=new Map;async function Rs(e){if(!e||e.trim()==="")return[];const t=`https://api.themoviedb.org/3/search/multi?api_key=${ae}&query=${encodeURIComponent(e)}`;try{let o=(await(await fetch(t)).json()).results.filter(s=>s.media_type==="movie"||s.media_type==="tv");const{data:a}=await v.from("settings").select("hide_search_results_without_images").single();return a?.hide_search_results_without_images&&(o=o.filter(s=>s.poster_path)),a?.hide_search_results_without_images&&(o=o.filter(s=>s.poster_path)),console.log("TMDB Search Results:",o.length),o}catch(n){return console.error("Error searching TMDB:",n),[]}}function H(){console.log("Rendering content. Current Filter:",K,"Media Count:",we.length);const e=document.getElementById("movie-grid"),t=document.getElementById("movie-list");if(K==="all"?N=we:N=we.filter(n=>{const r=n.type||n.media_type;return K==="movie"?r==="movie":K==="tv"?r==="tv"||r==="series":K==="watched"?n.watched===!0:K==="rejected"?n.rejected===!0:!1}),zs(),Et==="grid"){if(e.innerHTML="",t.innerHTML="",e.style.display="grid",t.style.display="none",N.length===0){e.innerHTML='<p class="text-text-muted col-span-full text-center">No results found.</p>';return}for(const n of N){const r=n.poster_path?`https://image.tmdb.org/t/p/w500${n.poster_path}`:"https://placehold.co/500x750?text=No+Image",o=n.title||n.name,a=n.type||n.media_type,s=n.tmdb_id||n.id;$s(e,o,a,s,r,n.watched)}}else{if(e.innerHTML="",t.innerHTML="",e.style.display="none",t.style.display="block",N.length===0){t.innerHTML='<p class="text-text-muted text-center">No results found.</p>';return}const n=document.createElement("div");n.className="bg-bg-secondary p-4 md:p-6 rounded-lg shadow-lg",N.forEach(r=>{const o=r.title||r.name,a=r.type||r.media_type,s=r.tmdb_id||r.id,i=document.createElement("div");i.className="flex items-center py-1",i.innerHTML=`
                <span class="text-text-muted mr-2">-</span>
                <a href="#" class="text-text-primary hover:text-accent-primary underline transition-colors" data-tmdb-id="${s}" data-type="${a}">${o}</a>
            `,i.querySelector("a").addEventListener("click",l=>{l.preventDefault(),Ze(s,a)}),n.appendChild(i)}),t.appendChild(n)}}function $s(e,t,n,r,o,a){const s=document.createElement("div");s.className="movie-card relative rounded-lg shadow-lg overflow-hidden cursor-pointer group",a&&s.classList.add("watched"),s.dataset.tmdbId=r,s.dataset.type=n;const i=L.find(c=>c.tmdb_id==r)?.favorited_by||[];i.length>1?s.classList.add("super-favorite-glow"):i.length>0&&s.classList.add("favorite-glow"),s.innerHTML=`
        <img src="${o}" alt="${t}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105">
        
        <!-- Reactions Overlay -->
        <div class="absolute top-2 left-2 flex flex-col gap-1 z-10">
            ${L.find(c=>c.tmdb_id==r)?.juainny_reaction?`
                <div class="relative w-8 h-8 group/reaction cursor-pointer reaction-item" data-user="Juainny" data-reaction="${L.find(c=>c.tmdb_id==r).juainny_reaction}">
                    <img src="moods/${L.find(c=>c.tmdb_id==r).juainny_reaction}" class="w-full h-full object-contain drop-shadow-md">
                    <div class="absolute -bottom-1 -right-1 w-4 h-4">
                        ${U("juainny","w-full h-full")}
                    </div>
                </div>
            `:""}
            ${L.find(c=>c.tmdb_id==r)?.erick_reaction?`
                <div class="relative w-8 h-8 group/reaction cursor-pointer reaction-item" data-user="Erick" data-reaction="${L.find(c=>c.tmdb_id==r).erick_reaction}">
                    <img src="moods/${L.find(c=>c.tmdb_id==r).erick_reaction}" class="w-full h-full object-contain drop-shadow-md">
                    <div class="absolute -bottom-1 -right-1 w-4 h-4">
                        ${U("erick","w-full h-full")}
                    </div>
                </div>
            `:""}
        </div>

        <div class="absolute bottom-2 left-2 flex flex-col gap-1 z-10 items-start pointer-events-none">
            <!-- Flairs Container -->
             ${(M.get(L.find(c=>c.tmdb_id==r)?.id)||[]).map(c=>te(c,"text-[10px] px-1.5 py-0.5 shadow-md")).join("")}
        </div>
        <div class="absolute bottom-0 left-0 right-0 p-4">
            <!-- Title removed as per user request -->
        </div>
        <button class="bookmark-icon absolute bottom-2 right-2 text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
            <i class="fas fa-bookmark"></i>
        </button>
    `,s.querySelectorAll(".reaction-item").forEach(c=>{c.addEventListener("mouseenter",u=>{et(u.currentTarget)}),c.addEventListener("mouseleave",()=>{Ne()}),c.addEventListener("click",u=>{Wt(u.currentTarget,u)})});const l=s.querySelector(".bookmark-icon");l.addEventListener("click",async c=>{c.stopPropagation();const u=o.includes("image.tmdb.org")?o.replace("https://image.tmdb.org/t/p/w500",""):null,m=await _e(r,n,t,u);if(!m)return;M.has(m.id)||M.set(m.id,[]);const h=!m.want_to_watch,f={want_to_watch:h};h&&(f.currently_watching=!1);const{error:d}=await v.from("media").update(f).eq("id",item.id);d?console.error("Error updating bookmark from grid:",d):l.classList.toggle("text-accent-primary",h)}),s.addEventListener("click",c=>{console.log("Movie card clicked:",t),Ze(r,n)}),e.appendChild(s)}async function Te(){const{data:e,error:t}=await v.from("media").select("*").eq("currently_watching",!0);if(t)return console.error("Error fetching currently watching media:",t),[];if(!e||e.length===0)return[];const n=e.map(s=>s.id),{data:r,error:o}=await v.from("activity_log").select("media_id, created_at").in("media_id",n).order("created_at",{ascending:!1});if(o)return console.error("Error fetching activity logs for sorting:",o),e;const a={};return r.forEach(s=>{a[s.media_id]||(a[s.media_id]=new Date(s.created_at).getTime())}),e.sort((s,i)=>{const l=a[s.id]||0;return(a[i.id]||0)-l})}async function Se(){const{data:e,error:t}=await v.from("media").select("*").eq("want_to_watch",!0).order("created_at",{ascending:!1});return t?(console.error("Error fetching want to watch media:",t),[]):e}function J(e,t){const n=document.getElementById(e);if(!n)return;if(n.className="relative group/carousel w-full overflow-hidden",n.innerHTML="",t.length===0){n.innerHTML='<p class="text-text-muted text-center w-full">Nothing here yet!</p>';return}const r=document.createElement("div");r.className="flex gap-4 scroll-smooth pb-4 px-1 scrollbar-hide snap-x snap-mandatory",r.style.cssText="overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; max-width: 100%; width: 100%;";const o=document.createElement("style");o.textContent=`
        #${e} .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
    `,n.appendChild(o);const a=document.createElement("div");a.className="absolute left-0 top-0 bottom-0 z-20 flex items-center px-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity";const s=document.createElement("button");s.type="button",s.className="bg-black/50 hover:bg-black/80 text-white p-2 rounded-full cursor-pointer transition-colors",s.innerHTML='<i class="fas fa-chevron-left"></i>',s.addEventListener("click",c=>{c.preventDefault(),c.stopPropagation();const u=r.clientWidth*.8;r.scrollTo({left:r.scrollLeft-u,behavior:"smooth"})}),a.appendChild(s);const i=document.createElement("div");i.className="absolute right-0 top-0 bottom-0 z-20 flex items-center px-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity";const l=document.createElement("button");l.type="button",l.className="bg-black/50 hover:bg-black/80 text-white p-2 rounded-full cursor-pointer transition-colors",l.innerHTML='<i class="fas fa-chevron-right"></i>',l.addEventListener("click",c=>{c.preventDefault(),c.stopPropagation();const u=r.clientWidth*.8;r.scrollTo({left:r.scrollLeft+u,behavior:"smooth"})}),i.appendChild(l),n.appendChild(a),n.appendChild(r),n.appendChild(i),t.forEach(c=>{const u=c.poster_path?`https://image.tmdb.org/t/p/w500${c.poster_path}`:"https://placehold.co/500x750?text=No+Image",m=c.title||c.name,h=c.type||c.media_type,f=c.tmdb_id||c.id,d=document.createElement("div");d.className="flex-shrink-0 w-32 sm:w-36 md:w-44 lg:w-48 movie-card relative rounded-lg shadow-lg overflow-hidden cursor-pointer group snap-start",d.style.cssText="flex-shrink: 0;",d.dataset.tmdbId=f,d.dataset.type=h;let p=c.favorited_by||[];if(typeof p=="string")try{p=JSON.parse(p)}catch{p=[]}const _=p.includes("user1"),k=p.includes("user2");_&&k?d.classList.add("rainbow-glow"):(_||k)&&d.classList.add("favorite-glow"),d.innerHTML=`
            <img src="${u}" alt="${m}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105">
            <!-- Removed gradient overlay as per request -->
            
            <!-- Reactions Overlay -->
            <div class="absolute top-2 left-2 flex flex-col gap-1 z-10">
                ${c.juainny_reaction?`
                    <div class="relative w-8 h-8 group/reaction cursor-pointer reaction-item" data-user="Juainny" data-reaction="${c.juainny_reaction}">
                        <img src="moods/${c.juainny_reaction}" class="w-full h-full object-contain drop-shadow-md">
                        <div class="absolute -bottom-1 -right-1 w-4 h-4">
                            ${U("juainny","w-full h-full")}
                        </div>
                    </div>
                `:""}
                ${c.erick_reaction?`
                    <div class="relative w-8 h-8 group/reaction cursor-pointer reaction-item" data-user="Erick" data-reaction="${c.erick_reaction}">
                        <img src="moods/${c.erick_reaction}" class="w-full h-full object-contain drop-shadow-md">
                        <div class="absolute -bottom-1 -right-1 w-4 h-4">
                            ${U("erick","w-full h-full")}
                        </div>
                    </div>
                `:""}
            </div>

            <div class="absolute bottom-0 left-0 right-0 p-2">
                 <!-- Title removed -->
            </div>
            
            <div class="absolute bottom-2 left-2 flex flex-col gap-1 z-10 items-start pointer-events-none">
                <!-- Flairs Container -->
                 ${(M.get(c.id)||[]).map(I=>te(I,"text-[10px] px-1.5 py-0.5 shadow-md")).join("")}
            </div>
        `,d.querySelectorAll(".reaction-item").forEach(I=>{I.addEventListener("mouseenter",E=>{et(E.currentTarget)}),I.addEventListener("mouseleave",()=>{Ne()}),I.addEventListener("click",E=>{Wt(E.currentTarget,E)})}),d.addEventListener("click",()=>Ze(f,h)),r.appendChild(d)})}let g=null;async function Ze(e,t){const n=document.getElementById("movie-modal");if(!n)return;let r;document.body.style.overflow="hidden";const o=document.querySelector("footer");o&&o.classList.add("hidden");const a=document.getElementById("tv-progress-section"),s=document.getElementById("tv-warning-section"),i=p=>p?p.watched||p.currently_watching||p.want_to_watch:!1,l=L.find(p=>p.tmdb_id==e),c=i(l);if(console.log("OpenModal - TMDB ID:",e,"Tracked Item:",l,"Is Tracked:",c),t==="tv"||t==="series"){if(a.classList.remove("hidden"),!s){const p=document.createElement("div");p.id="tv-warning-section",p.className="hidden text-center py-8 px-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20 my-4",p.innerHTML=`
                <i class="fas fa-lock text-yellow-500 text-3xl mb-3"></i>
                <p class="text-text-primary font-semibold">Episode Guide Locked</p>
                <p class="text-text-muted text-sm mt-2">You can't see the episode carousel until you add this as "Watched", "Watching", or "Want to Watch".</p>
             `,a.parentNode.insertBefore(p,a.nextSibling)}if(c){a.classList.remove("hidden");const p=document.getElementById("tv-warning-section");p&&p.classList.add("hidden");const I=`https://api.themoviedb.org/3/${t==="movie"?"movie":"tv"}/${e}?api_key=${ae}&append_to_response=credits,images,videos,release_dates,external_ids`,y=await(await fetch(I)).json();await fr(e,y.seasons)}else{a.classList.add("hidden");const p=document.getElementById("tv-warning-section");p&&p.classList.remove("hidden")}}else{a.classList.add("hidden");const p=document.getElementById("tv-warning-section");p&&p.classList.add("hidden")}n.dataset.tmdbId=e;const u=L.find(p=>p.tmdb_id==e)||(g&&g.tmdb_id==e?g:null);if(u){document.getElementById("modal-overview").textContent=u.overview||"Loading...",document.getElementById("modal-title").textContent=u.title||u.name||"Loading...";const p=u.release_date||u.first_air_date||"";document.getElementById("modal-release-year").textContent=p.substring(0,4),n.classList.remove("hidden"),n.classList.remove("modal-hidden"),n.classList.add("flex")}const f=`https://api.themoviedb.org/3/${t==="movie"?"movie":"tv"}/${e}?api_key=${ae}&append_to_response=credits,images,videos,release_dates,external_ids,content_ratings`;let d;try{const p=await fetch(f);if(!p.ok)throw new Error("Failed to fetch modal data.");d=await p.json(),document.getElementById("modal-overview").textContent=d.overview;const _=document.getElementById("modal-title");_.innerHTML="";const k=d.images?.logos?.find(w=>w.iso_639_1==="en"&&!w.file_path.endsWith(".svg"))||d.images?.logos?.[0];if(k){const w=`https://image.tmdb.org/t/p/w500${k.file_path}`;_.innerHTML=`<img src="${w}" alt="${d.title||d.name} Logo" class="max-h-20 object-contain" style="max-width: 14.4rem;">`}else _.textContent=d.title||d.name;const I=d.release_date||d.first_air_date||"",E=u?.release_year||I.substring(0,4);document.getElementById("modal-release-year").textContent=E;let y=u?.runtime||d.runtime||(d.episode_run_time&&d.episode_run_time.length>0?d.episode_run_time[0]:0);t==="tv"&&!y&&(d.last_episode_to_air&&d.last_episode_to_air.runtime?y=d.last_episode_to_air.runtime:d.next_episode_to_air&&d.next_episode_to_air.runtime&&(y=d.next_episode_to_air.runtime)),document.getElementById("modal-runtime").textContent=Os(y),Ps(y);let b=u?.content_rating||"N/A";if(b==="N/A"){if(t==="movie"&&d.release_dates){const w=d.release_dates.results.find(S=>S.iso_3166_1==="US");if(w){const S=w.release_dates.find(C=>C.certification!=="");S&&(b=S.certification)}}else if(t==="tv"&&d.content_ratings&&d.content_ratings.results){const w=d.content_ratings.results.find(S=>S.iso_3166_1==="US");w?b=w.rating:d.content_ratings.results.length>0&&(b=d.content_ratings.results[0].rating)}}document.getElementById("modal-content-rating").textContent=b;const x=document.getElementById("title-tooltip");if(x){const w=u?.title||u?.name||d.title||d.name;x.setAttribute("title",w)}const A=d.external_ids.imdb_id,D=d.vote_average?d.vote_average.toFixed(1):"N/A";document.getElementById("modal-score").textContent=D;const z=document.getElementById("modal-imdb-link");if(A?(z.href=`https://www.imdb.com/title/${A}`,z.style.display="flex"):z.style.display="none",c&&l&&l.id){const w={},S=document.getElementById("willow-summary-section"),C=document.getElementById("willow-summary-text"),G=document.getElementById("regenerate-summary-btn");S.classList.remove("hidden");const F=async()=>{C.innerHTML='<i class="fas fa-spinner fa-spin"></i> Willow is thinking...';const V=document.querySelector("#juainny-rating-container .stars")?.dataset.rating||l.user1_rating,W=document.getElementById("juainny-notes").innerText,Y=document.querySelector("#erick-rating-container .stars")?.dataset.rating||l.user2_rating,se=document.getElementById("erick-notes").innerText,br=await As(l,{user1:V,user2:Y},{user1:W,user2:se});C.textContent=br};C.textContent.trim().includes("Willow is analyzing")&&F(),G.onclick=F}else document.getElementById("willow-summary-section").classList.add("hidden");if(c&&l&&l.id){const w={};!l.release_year&&E&&(w.release_year=parseInt(E)),!l.runtime&&y&&(w.runtime=y),(!l.content_rating||l.content_rating==="N/A")&&b!=="N/A"&&(w.content_rating=b),!l.imdb_id&&A&&(w.imdb_id=A),Object.keys(w).length>0&&v.from("media").update(w).eq("tmdb_id",e).then(({error:S})=>{S&&console.error("Error auto-saving metadata:",S)})}const fe=d.backdrop_path?`https://image.tmdb.org/t/p/w780${d.backdrop_path}`:"https://placehold.co/800x400?text=No+Image";document.getElementById("modal-backdrop-image").src=fe;const{data:q,error:he}=await v.from("media").select("*").eq("tmdb_id",e).maybeSingle();he&&he.code!=="PGRST116"&&console.error("Error fetching media item for ratings:",he),g=q||{tmdb_id:e,type:t,title:d.title||d.name,poster_path:d.poster_path,favorited_by:[],watched:!1,juainny_rating:null,erick_rating:null,juainny_notes:null,erick_notes:null},await Yt("juainny-rating-container",g?.juainny_rating||0,kt),await Yt("erick-rating-container",g?.erick_rating||0,kt);const Oe=(w,S)=>{const C=document.getElementById(S);if(C){const G=U(w,"w-10 h-10 mr-3"),F=document.createElement("div");F.innerHTML=G;const V=F.firstElementChild;V.id=S,C.replaceWith(V)}};Oe("juainny","juainny-avatar"),Oe("erick","erick-avatar"),It(g),Le(g);const Ut=(w,S)=>{const C=document.getElementById(S);if(!C)return;const G=C.previousElementSibling;G&&G.classList.contains("notes-toolbar")&&G.remove();const F=document.createElement("div");F.className="flex gap-2 mb-2 notes-toolbar",F.innerHTML=`
                <button type="button" data-format="bold" class="p-2 hover:bg-gray-700 rounded text-white" style="font-weight: bold;">B</button>
                <button type="button" data-format="italic" class="p-2 hover:bg-gray-700 rounded text-white" style="font-style: italic;">I</button>
                <button type="button" data-format="underline" class="p-2 hover:bg-gray-700 rounded text-white" style="text-decoration: underline;">U</button>
            `,C.parentNode.insertBefore(F,C),F.querySelectorAll("button").forEach(W=>{W.addEventListener("click",Y=>{Y.preventDefault();const se=W.dataset.format;se==="bold"&&document.execCommand("bold",!1,null),se==="italic"&&document.execCommand("italic",!1,null),se==="underline"&&document.execCommand("underline",!1,null),C.focus()})});const V=g?.[`${w}_notes`]||"";C.innerHTML=V};if(Ut("juainny","juainny-notes"),Ut("erick","erick-notes"),document.getElementById("notes-section").classList.remove("hidden"),q&&d.backdrop_path&&q.backdrop_path!==d.backdrop_path){const{error:w}=await v.from("media").update({backdrop_path:d.backdrop_path}).eq("tmdb_id",e);w&&console.error("Error updating backdrop path:",w)}Qe();const qt=document.getElementById("add-mood-btn");qt&&(qt.onclick=w=>{w.preventDefault(),oi(e)});const Vt=document.getElementById("modal-flairs-container");if(Vt){const w=q&&M.get(q.id)||[];Vt.innerHTML=w.map(S=>te(S,"text-xs px-2 py-1")).join("")}r=document.getElementById("manage-flairs-btn"),r&&(c?(r.classList.remove("hidden"),r.onclick=async w=>{w.preventDefault();const S=await _e(e,t,d.title||d.name,d.poster_path);S&&Ds(S.id)}):r.classList.add("hidden"));const vr="45991eb5-21e1-40ee-8bde-5beee11a7dff",yr=(q&&M.get(q.id)||[]).some(w=>w.id===vr||w.name==="MCU"),ee=document.getElementById("marvel-marathon-display"),Pe=document.getElementById("normal-modal-content"),je=document.getElementById("mood-controls");yr?(ee&&ee.classList.remove("hidden"),ee&&ee.classList.add("flex"),Pe&&Pe.classList.add("hidden"),je&&je.classList.add("hidden")):(ee&&ee.classList.add("hidden"),ee&&ee.classList.remove("flex"),Pe&&Pe.classList.remove("hidden"),je&&je.classList.remove("hidden")),n.classList.remove("hidden"),n.classList.remove("modal-hidden"),n.classList.add("flex");const He=document.getElementById("movie-modal-scrollable-content");if(He&&r){const w=()=>{He.scrollTop>20?(r.style.opacity="0",r.style.pointerEvents="none"):(r.style.opacity="1",r.style.pointerEvents="auto")};He.removeEventListener("scroll",w),He.addEventListener("scroll",w)}const zt=document.getElementById("modal-stats-pill");if(zt){let w=0,S=null;zt.onclick=async()=>{if(w++,w===1)S=setTimeout(()=>{w=0},500);else if(w===3){clearTimeout(S),w=0;let C=d.runtime||(d.episode_run_time&&d.episode_run_time.length>0?d.episode_run_time[0]:0);t==="tv"&&!C&&(d.last_episode_to_air&&d.last_episode_to_air.runtime?C=d.last_episode_to_air.runtime:d.next_episode_to_air&&d.next_episode_to_air.runtime&&(C=d.next_episode_to_air.runtime));const G=d.release_date||d.first_air_date||"",F=G?parseInt(G.split("-")[0]):null;let V="N/A";if(t==="movie"&&d.release_dates){const W=d.release_dates.results.find(Y=>Y.iso_3166_1==="US");if(W){const Y=W.release_dates.find(se=>se.certification!=="");Y&&(V=Y.certification)}}else if(t==="tv"&&d.content_ratings&&d.content_ratings.results){const W=d.content_ratings.results.find(Y=>Y.iso_3166_1==="US");W?V=W.rating:d.content_ratings.results.length>0&&(V=d.content_ratings.results[0].rating)}if(confirm(`Update database with:
Year: ${F}
Runtime: ${C}m
Rating: ${V}`)){const{error:W}=await v.from("media").update({release_year:F,runtime:C,content_rating:V}).eq("tmdb_id",e);W?(alert("Failed to update stats."),console.error(W)):alert("Updated database with runtime, year date, and rating.")}}}}}catch(p){console.error("Error opening movie modal:",p)}}async function Ds(e){const t=document.getElementById("flair-modal"),n=document.getElementById("close-flair-modal-btn"),r=document.getElementById("current-flairs-list"),o=document.getElementById("available-flairs-list"),a=document.getElementById("toggle-create-flair-btn"),s=document.getElementById("create-flair-form"),i=document.getElementById("save-new-flair-btn");if(!t)return;s.classList.add("hidden");const l=document.getElementById("delete-flair-btn"),c=document.getElementById("cancel-edit-flair-btn"),u=document.getElementById("flair-form-title"),m=document.getElementById("edit-flair-id"),h=document.getElementById("new-flair-name"),f=document.getElementById("new-flair-color"),d=document.getElementById("new-flair-icon"),p=()=>{s.classList.add("hidden"),m.value="",h.value="",f.value="#ef4444",d.value="",u.textContent="NEW FLAIR",i.textContent="Create Flair",l.classList.add("hidden"),c.classList.add("hidden")},_=()=>{r.innerHTML="";const k=M.get(e)||[];k.forEach(I=>{const E=document.createElement("div");E.className="relative group cursor-pointer",E.innerHTML=te(I,"text-sm px-3 py-1");const y=document.createElement("div");y.className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs",y.innerHTML='<i class="fas fa-times"></i>',y.onclick=async b=>{b.stopPropagation(),await Bs(e,I.id);const x=M.get(e).filter(D=>D.id!==I.id);M.set(e,x),_(),H();const A=document.getElementById("modal-flairs-container");A&&(A.innerHTML=x.map(D=>te(D,"text-xs px-2 py-1")).join(""))},E.appendChild(y),r.appendChild(E)}),o.innerHTML="",ce.forEach(I=>{if(k.find(x=>x.id===I.id))return;const E=document.createElement("div");E.className="flex items-center gap-2 group";const y=document.createElement("div");y.className="cursor-pointer hover:opacity-80",y.innerHTML=te(I,"text-sm px-3 py-1"),y.onclick=async()=>{if(k.length>=2){alert("Max 2 flairs per item!");return}const x=await Ss(e,I.id);if(x.success){M.has(e)||M.set(e,[]),M.get(e).push(I),_(),H();const A=document.getElementById("modal-flairs-container");if(A){const D=M.get(e);A.innerHTML=D.map(z=>te(z,"text-xs px-2 py-1")).join("")}}else alert(x.message)};const b=document.createElement("button");b.className="text-xs text-text-muted hover:text-accent-primary opacity-0 group-hover:opacity-100 transition-opacity",b.innerHTML='<i class="fas fa-pencil-alt"></i>',b.onclick=x=>{x.stopPropagation(),m.value=I.id,h.value=I.name,f.value=I.color,d.value=I.icon||"",u.textContent="EDIT FLAIR",i.textContent="Update Flair",l.classList.remove("hidden"),c.classList.remove("hidden"),s.classList.remove("hidden")},E.appendChild(y),E.appendChild(b),o.appendChild(E)})};_(),n.onclick=()=>{t.classList.add("hidden"),t.classList.add("modal-hidden"),p()},t.onclick=k=>{k.target===t&&(t.classList.add("hidden"),t.classList.add("modal-hidden"),p())},a.onclick=()=>{!s.classList.contains("hidden")&&!m.value?s.classList.add("hidden"):(p(),s.classList.remove("hidden"))},c.onclick=()=>{p()},l.onclick=async()=>{const k=m.value;if(k&&confirm("Are you sure you want to delete this flair? This will remove it from all media items."))if(await deleteFlair(k)){ce=ce.filter(E=>E.id!==k);for(let[E,y]of M)M.set(E,y.filter(b=>b.id!==k));p(),_(),H()}else alert("Failed to delete flair.")},i.onclick=async()=>{const k=h.value.trim(),I=f.value,E=d.value.trim(),y=m.value;if(!k){alert("Name is required");return}if(y){const b=await updateFlair(y,{name:k,color:I,icon:E});if(b){const x=ce.findIndex(fe=>fe.id===y);x!==-1&&(ce[x]=b);for(let[fe,q]of M){const he=q.findIndex(Oe=>Oe.id===y);he!==-1&&(q[he]=b)}p(),_(),H();const[A,D]=await Promise.all([Te(),Se()]);J("currently-watching-carousel",A),J("want-to-watch-carousel",D);const z=document.getElementById("modal-flairs-container");if(z){const fe=M.get(e)||[];z.innerHTML=fe.map(q=>te(q,"text-xs px-2 py-1")).join("")}}else alert("Failed to update flair.")}else{const b=await Ts({name:k,color:I,icon:E});b?(ce.push(b),p(),_()):alert("Failed to create flair.")}},t.classList.remove("hidden"),t.classList.remove("modal-hidden"),t.classList.add("flex")}function Ns(){const e=document.getElementById("close-modal-btn"),t=document.getElementById("movie-modal"),n=()=>{t.classList.add("hidden"),t.classList.add("modal-hidden"),t.classList.remove("flex"),document.body.style.overflow="";const r=document.querySelector("footer");r&&r.classList.remove("hidden");const o=document.getElementById("iron-man-walker");o&&(o.classList.remove("walk"),o.classList.add("hidden"))};e&&(e.onclick=n),t&&(t.onclick=r=>{r.target===t&&n()})}function Os(e){if(!e||e===0)return"N/A";const t=Math.floor(e/60),n=e%60;let r="";return t>0&&(r+=`${t}h `),n>0&&(r+=`${n}m`),r.trim()}function Ps(e){const t=document.getElementById("start-time-hour"),n=document.getElementById("start-time-minute"),r=document.getElementById("end-time"),o=document.getElementById("end-time-calculator");if(!e||e===0){o.classList.add("hidden");return}o.classList.remove("hidden");let a=new Date,s=a.getHours(),i=a.getMinutes();const l=()=>{const c=new Date;c.setHours(s,i,0,0),c.setMinutes(c.getMinutes()+e);const u=c.getHours().toString().padStart(2,"0"),m=c.getMinutes().toString().padStart(2,"0");r.textContent=`${u}:${m}`,t.textContent=s.toString().padStart(2,"0"),n.textContent=i.toString().padStart(2,"0")};t.onclick=()=>{s=(s+1)%24,l()},n.onclick=()=>{i=(i+1)%60,l()},l()}let O=[],xe=[],P=1,ne=!1,mr=null,X=null;async function fr(e,t){const n=document.getElementById("tv-progress-container");n.innerHTML='<div class="text-center">Loading progress...</div>',xe=t.filter(r=>r.season_number>0&&r.episode_count>0),mr=e;try{const{data:r,error:o}=await v.from("media").select("id").eq("tmdb_id",e).single();if(o){console.log("Media not in DB. Executing Plan 2: Fetch and Save.");try{const i=await fetch(`https://api.themoviedb.org/3/tv/${e}?api_key=${ae}&append_to_response=content_ratings`);if(!i.ok)throw new Error("Failed to fetch TV details from TMDB");const l=await i.json(),c=l.first_air_date?parseInt(l.first_air_date.split("-")[0]):null;let u="N/A";if(l.content_ratings&&l.content_ratings.results){const f=l.content_ratings.results.find(d=>d.iso_3166_1==="US");f?u=f.rating:l.content_ratings.results.length>0&&(u=l.content_ratings.results[0].rating)}const{data:m,error:h}=await v.from("media").insert({tmdb_id:e,type:"series",title:l.name,poster_path:l.poster_path,backdrop_path:l.backdrop_path,release_year:c,source:"fetched",runtime:l.episode_run_time?.[0]||0,content_rating:u}).select("id").single();if(h)throw h;X=m.id,console.log("Plan 2 Successful: Media saved to DB with ID:",X)}catch(i){console.error("Plan 2 Failed:",i),n.innerHTML=`
                    <div class="text-center py-8 px-4">
                        <i class="fas fa-exclamation-circle text-danger text-3xl mb-3"></i>
                        <p class="text-text-muted">Failed to sync TV show data.</p>
                        <p class="text-text-muted text-sm mt-2">Please try adding it to your watchlist manually first.</p>
                    </div>
                `;return}}else X=r.id;const[a,s]=await Promise.all([v.from("episode_progress").select("*").eq("media_id",X).eq("viewer","user1"),v.from("episode_progress").select("*").eq("media_id",X).eq("viewer","user2")]);if(a.error)throw a.error;if(s.error)throw s.error;if(O=[...a.data||[],...s.data||[]],n.innerHTML=`
            <div class="flex justify-between items-center sticky top-0 z-40 bg-bg-tertiary/95 backdrop-blur-md py-3 px-4 border-b border-white/5 mb-4 rounded-t-lg">
                <div class="relative group">
                    <select id="season-select" class="appearance-none bg-black/20 hover:bg-black/40 text-text-primary py-2 pl-4 pr-10 rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-accent-primary cursor-pointer transition-all border border-white/10">
                        ${xe.map(i=>`<option value="${i.season_number}">Season ${i.season_number}</option>`).join("")}
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-muted group-hover:text-text-primary transition-colors">
                        <i class="fas fa-chevron-down text-xs"></i>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                     <button id="mark-season-watched-btn" class="text-xs py-2 px-4 rounded-full bg-accent-secondary/20 text-accent-secondary hover:bg-accent-secondary hover:text-white border border-accent-secondary/50 transition font-semibold flex items-center gap-2">
                        <i class="fas fa-check"></i> Season Watched
                    </button>
                    <button id="edit-episodes-btn" class="text-text-muted hover:text-text-primary transition p-2 rounded-full hover:bg-white/10" title="Edit Watched Status">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                </div>
            </div>

            <div id="episodes-carousel-wrapper" class="relative pb-4" style="overflow: hidden;">
                <!-- Episodes carousel will be loaded here -->
                <div class="text-center py-8"><div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-primary mx-auto"></div></div>
            </div>
        `,document.getElementById("season-select").addEventListener("change",i=>{P=parseInt(i.target.value),Je(P)}),document.getElementById("mark-season-watched-btn").addEventListener("click",()=>js()),document.getElementById("edit-episodes-btn").addEventListener("click",Fs),xe.length>0){let i=xe[0].season_number;const{data:l}=await v.from("activity_log").select("details").eq("media_id",X).eq("action_type","watched_episode").order("created_at",{ascending:!1}).limit(1).maybeSingle();if(l&&l.details&&l.details.season){const u=l.details.season;xe.some(m=>m.season_number===u)&&(i=u)}P=i;const c=document.getElementById("season-select");c&&(c.value=P),await Je(P)}else n.innerHTML='<div class="text-center">No seasons found.</div>'}catch(r){console.error("Error rendering TV progress:",r),n.innerHTML='<div class="text-center text-danger">Failed to load progress.</div>'}}async function Je(e){const t=document.getElementById("episodes-carousel-wrapper");if(t){t.innerHTML='<div class="text-center py-8"><div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-primary mx-auto"></div></div>';try{const n=await fetch(`https://api.themoviedb.org/3/tv/${mr}/season/${e}?api_key=${ae}`);if(!n.ok)throw new Error("Failed to fetch season details");const r=await n.json();if(!r||!r.episodes){t.innerHTML='<div class="text-center">No episodes found.</div>';return}t.innerHTML=`
            <div class="episodes-carousel-container relative px-2 sm:px-12" style="position: relative;">
                <button class="episodes-nav-btn episodes-nav-left absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-2 sm:p-3 rounded-full transition-all shadow-lg hidden sm:block" style="position: absolute;">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <div id="episodes-carousel" class="flex overflow-x-auto gap-3 sm:gap-4 pb-4 px-1 sm:px-2 scroll-smooth snap-x snap-mandatory" style="touch-action: pan-x; overscroll-behavior-x: contain; overscroll-behavior-y: none;">
                    <!-- Episodes will be inserted here -->
                </div>
                <button class="episodes-nav-btn episodes-nav-right absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-2 sm:p-3 rounded-full transition-all shadow-lg hidden sm:block" style="position: absolute;">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;const o=document.getElementById("episodes-carousel");o.addEventListener("wheel",i=>{if(Math.abs(i.deltaY)>Math.abs(i.deltaX)){const c=i.deltaY;o.scrollLeft+=c,i.preventDefault(),i.stopPropagation()}else i.stopPropagation()},{passive:!1}),r.episodes.forEach(i=>{const l=O.some(d=>d.season_number===e&&d.episode_number===i.episode_number&&d.viewer==="user1"&&d.watched),c=O.some(d=>d.season_number===e&&d.episode_number===i.episode_number&&d.viewer==="user2"&&d.watched),u=l&&c,m=i.still_path?`https://image.tmdb.org/t/p/w500${i.still_path}`:"https://placehold.co/500x281?text=No+Image",h=document.createElement("div");h.className=`episode-card flex-shrink-0 w-[calc(100vw-4rem)] sm:w-72 md:w-80 relative rounded-lg overflow-hidden shadow-md bg-bg-primary cursor-pointer snap-start ${u&&ne?"shake":""}`,h.style.maxWidth="400px",h.dataset.episodeNumber=i.episode_number,h.dataset.seasonNumber=e,h.innerHTML=`
                <div class="relative aspect-video">
                    <img src="${m}" alt="${i.name}" class="w-full h-full object-cover transition-opacity duration-300 ${u?"opacity-50":"opacity-100"}">
                    <div class="absolute top-0 left-0 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded-br-lg z-20">
                        E${i.episode_number}
                    </div>
                    ${u?`
                        <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                            <i class="fas fa-check text-success text-4xl drop-shadow-lg"></i>
                        </div>
                    `:""}
                    <button class="unwatch-btn absolute top-2 right-2 bg-danger text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-700 transition z-30 ${u&&ne?"":"hidden"}">
                        <i class="fas fa-times text-xs"></i>
                    </button>
                </div>
                <div class="p-3">
                    <h4 class="font-semibold text-sm truncate" title="${i.name}">${i.name}</h4>
                    <p class="text-xs text-text-muted line-clamp-2 mt-1">${i.overview||"No description available."}</p>
                </div>
            `,h.addEventListener("click",d=>{d.target.closest(".unwatch-btn")||ne||u||Bn(e,i.episode_number,!0)}),h.querySelector(".unwatch-btn").addEventListener("click",d=>{d.stopPropagation(),Bn(e,i.episode_number,!1)}),o.appendChild(h)});const a=t.querySelector(".episodes-nav-left"),s=t.querySelector(".episodes-nav-right");a.addEventListener("click",()=>{o.scrollBy({left:-o.clientWidth,behavior:"smooth"})}),s.addEventListener("click",()=>{o.scrollBy({left:o.clientWidth,behavior:"smooth"})}),hr(r.episodes.length)}catch(n){console.error("Error rendering season episodes:",n),t.innerHTML='<div class="text-center text-danger">Failed to load episodes.</div>'}}}async function Bn(e,t,n){["user1","user2"].forEach(a=>{const s=O.findIndex(i=>i.season_number===e&&i.episode_number===t&&i.viewer===a);s>=0?O[s].watched=n:O.push({media_id:X,season_number:e,episode_number:t,watched:n,viewer:a})}),Ws(e,t,n),hr(document.querySelectorAll(".episode-card").length);const r=["user1","user2"].map(a=>({media_id:X,viewer:a,season_number:e,episode_number:t,watched:n})),{error:o}=await v.from("episode_progress").upsert(r,{onConflict:"media_id,viewer,season_number,episode_number"});o?(console.error("Error updating episode progress:",o),Je(P)):n&&await Z("watched_episode","both",g,{season:e,episode:t})}async function js(){const e=document.querySelectorAll(".episode-card");if(e.length===0)return;const n=!Array.from(e).every(a=>{const s=parseInt(a.dataset.episodeNumber),i=O.some(c=>c.season_number===P&&c.episode_number===s&&c.viewer==="user1"&&c.watched),l=O.some(c=>c.season_number===P&&c.episode_number===s&&c.viewer==="user2"&&c.watched);return i&&l}),r=[];e.forEach(a=>{const s=parseInt(a.dataset.episodeNumber);["user1","user2"].forEach(i=>{const l=O.findIndex(c=>c.season_number===P&&c.episode_number===s&&c.viewer===i);l>=0?O[l].watched=n:O.push({media_id:X,season_number:P,episode_number:s,watched:n,viewer:i}),r.push({media_id:X,viewer:i,season_number:P,episode_number:s,watched:n})})}),Je(P);const{error:o}=await v.from("episode_progress").upsert(r,{onConflict:"media_id,viewer,season_number,episode_number"});o&&console.error("Error updating season progress:",o)}async function Hs(e){try{const{data:t,error:n}=await v.from("media").select("id").eq("tmdb_id",e).single();if(n)throw console.error("Error fetching media for markAllEpisodesWatched:",n),new Error("Could not find media in database");const r=t.id,o=await fetch(`https://api.themoviedb.org/3/tv/${e}?api_key=${ae}`);if(!o.ok)throw new Error("Failed to fetch TV series details");const a=await o.json(),s=[];for(const i of a.seasons)if(i.season_number>0&&i.episode_count>0){const l=await fetch(`https://api.themoviedb.org/3/tv/${e}/season/${i.season_number}?api_key=${ae}`);if(!l.ok)throw new Error(`Failed to fetch season ${i.season_number} details`);(await l.json()).episodes.forEach(u=>{["user1","user2"].forEach(m=>{s.push({media_id:r,viewer:m,season_number:i.season_number,episode_number:u.episode_number,watched:!0})})})}if(s.length>0){const{error:i}=await v.from("episode_progress").upsert(s,{onConflict:"media_id,viewer,season_number,episode_number"});i?console.error("Error marking all episodes watched:",i):(console.log("All episodes marked as watched successfully."),await fr(e,a.seasons))}}catch(t){console.error("Error in markAllEpisodesWatched:",t)}}function Fs(){ne=!ne;const e=document.getElementById("edit-episodes-btn");ne?e.classList.add("text-accent-primary","animate-pulse"):e.classList.remove("text-accent-primary","animate-pulse"),document.querySelectorAll(".episode-card").forEach(n=>{const r=parseInt(n.dataset.episodeNumber),o=parseInt(n.dataset.seasonNumber),a=O.some(c=>c.season_number===o&&c.episode_number===r&&c.viewer==="user1"&&c.watched),s=O.some(c=>c.season_number===o&&c.episode_number===r&&c.viewer==="user2"&&c.watched),i=a&&s,l=n.querySelector(".unwatch-btn");i&&ne?(n.classList.add("shake"),l.classList.remove("hidden")):(n.classList.remove("shake"),l.classList.add("hidden"))})}function Ws(e,t,n){const r=document.querySelector(`.episode-card[data-season-number="${e}"][data-episode-number="${t}"]`);if(!r)return;const o=r.querySelector("img"),a=r.querySelector(".fa-check")?.parentElement,s=r.querySelector(".unwatch-btn");if(n){if(o.classList.remove("opacity-100"),o.classList.add("opacity-50"),!a){const i=document.createElement("div");i.className="absolute inset-0 flex items-center justify-center pointer-events-none",i.innerHTML='<i class="fas fa-check text-success text-4xl drop-shadow-lg"></i>',r.querySelector(".aspect-video").appendChild(i)}ne&&(r.classList.add("shake"),s.classList.remove("hidden"))}else o.classList.remove("opacity-50"),o.classList.add("opacity-100"),a&&a.remove(),r.classList.remove("shake"),s.classList.add("hidden")}function hr(e){const t=document.getElementById("mark-season-watched-btn");if(!t)return;[...new Set(O.filter(o=>o.season_number===P&&o.watched).map(o=>o.episode_number))].filter(o=>{const a=O.some(i=>i.season_number===P&&i.episode_number===o&&i.viewer==="user1"&&i.watched),s=O.some(i=>i.season_number===P&&i.episode_number===o&&i.viewer==="user2"&&i.watched);return a&&s}).length===e&&e>0?(t.textContent="Season Watched",t.classList.remove("bg-accent-secondary"),t.classList.add("bg-success")):(t.textContent="Mark Season Watched",t.classList.remove("bg-success"),t.classList.add("bg-accent-secondary","text-white"),t.classList.remove("text-accent-secondary"))}function pr(e,t){let n;return function(...r){const o=this;clearTimeout(n),n=setTimeout(()=>e.apply(o,r),t)}}const kt=pr(Us,500);async function Us(){const t=document.getElementById("movie-modal").dataset.tmdbId;if(!t){console.error("saveRatingsAndNotes: tmdbId not found on modal");return}const n=document.querySelector("#juainny-rating-container .rating-input-hidden").value,r=document.querySelector("#erick-rating-container .rating-input-hidden").value,o={juainny_rating:parseFloat(n)||null,juainny_notes:document.getElementById("juainny-notes").innerHTML||null,erick_rating:parseFloat(r)||null,erick_notes:document.getElementById("erick-notes").innerHTML||null};if(!t){console.error("saveRatingsAndNotes: tmdbId is missing!");return}const{data:a,error:s}=await v.from("media").select("tmdb_id").eq("tmdb_id",t).single();if(s&&s.code!=="PGRST116"){console.error("Error checking for existing media:",s);return}let i;if(a)i=await v.from("media").update(o).eq("tmdb_id",t).select().single();else{console.log("Ratings and notes not saved: item not in database. Add to watchlist first.");return}const{data:l,error:c}=i;c?console.error("Error saving ratings and notes:",c):(g&&(o.juainny_rating!==g.juainny_rating&&o.juainny_rating!==null&&await Z("rate","juainny",l,{rating:o.juainny_rating}),o.juainny_notes!==g.juainny_notes&&o.juainny_notes!==""&&await Z("note_added","juainny",l),o.erick_rating!==g.erick_rating&&o.erick_rating!==null&&await Z("rate","erick",l,{rating:o.erick_rating}),o.erick_notes!==g.erick_notes&&o.erick_notes!==""&&await Z("note_added","erick",l)),g=l)}function qs(){["juainny-notes","erick-notes"].forEach(t=>{const n=document.getElementById(t);n&&n.addEventListener("input",kt)})}function Vs(){const e=document.getElementById("random-movie-btn");e&&e.addEventListener("click",()=>{if(N.length===0){console.log("No movies to choose from!");return}const t=N[Math.floor(Math.random()*N.length)],n=t.tmdb_id||t.id,r=t.type||t.media_type;Ze(n,r)})}function zs(){switch(Ke){case"popularity":N.sort((n,r)=>r.popularity-n.popularity);break;case"alphabetical":N.sort((n,r)=>(n.title||n.name).localeCompare(r.title||r.name));break;case"release_date":N.sort((n,r)=>{const o=new Date(n.release_date||n.first_air_date);return new Date(r.release_date||r.first_air_date)-o});break;case"length":N.sort((n,r)=>(r.runtime||r.episode_run_time?.[0]||0)-(n.runtime||n.episode_run_time?.[0]||0));break;case"default":default:const e=N.filter(n=>n.source==="fetched").sort((n,r)=>n.id-r.id);N=[...N.filter(n=>n.source!=="fetched").sort((n,r)=>{const o=new Date(n.release_date||n.first_air_date);return new Date(r.release_date||r.first_air_date)-o}),...e];break}}function Gs(){document.getElementById("sort-select").addEventListener("change",t=>{Ke=t.target.value,H()})}function Ys(){const e=document.getElementById("filter-controls");e.addEventListener("click",t=>{if(t.target.matches(".filter-btn")){const n=t.target.dataset.filter;if(n===K)return;K=n,e.querySelectorAll(".filter-btn").forEach(r=>{r.classList.remove("btn-active")}),t.target.classList.add("btn-active"),H()}})}function It(e){const t=document.querySelector(".movie-modal-content"),n=document.querySelector(`.movie-card[data-tmdb-id="${e.tmdb_id}"]`),r=e.favorited_by||[],o=r.includes("user1"),a=r.includes("user2");[t,n].forEach(s=>{s&&(s.classList.remove("favorite-glow","rainbow-glow"),o&&a?s.classList.add("rainbow-glow"):(o||a)&&s.classList.add("favorite-glow"))})}async function Z(e,t,n,r={}){try{if(!n||!n.id){console.warn("Cannot log activity: Missing media ID");return}const{error:o}=await v.from("activity_log").insert({media_id:n.id,tmdb_id:n.tmdb_id,action_type:e,user_id:t,details:r});o?console.error("Error logging activity:",o):console.log(`Activity logged: ${e} by ${t}`)}catch(o){console.error("Unexpected error logging activity:",o)}}function Ks(){const e=document.getElementById("favorite-btn"),t=document.getElementById("user-selection-menu");e.addEventListener("click",()=>{t.classList.toggle("hidden")}),t.addEventListener("click",async n=>{if(n.target.matches("button")){const r=n.target.id.replace("-btn",""),o=g.tmdb_id,a=g.type||g.media_type,s=g.title||g.name,i=g.poster_path,l=await _e(o,a,s,i);if(!l){console.error("Failed to ensure media item exists"),t.classList.add("hidden");return}if(r==="remove-all"){const{error:c}=await v.from("media").update({favorited_by:[]}).eq("tmdb_id",o);c?console.error("Error removing all favorites:",c):(g.favorited_by=[],It(g))}else{const c=r,u=c==="user1"?"juainny":"erick",{data:m,error:h}=await v.from("media").select("id, tmdb_id, title, poster_path, favorited_by").contains("favorited_by",[c]);if(h){console.error("Error checking favorite count:",h),t.classList.add("hidden");return}if(m&&m.length>=3&&!m.some(k=>k.tmdb_id===o)){const k=await Js(m);if(!k){t.classList.add("hidden");return}const I=m.find(E=>E.tmdb_id===k);if(I){const E=(I.favorited_by||[]).filter(b=>b!==c);await v.from("media").update({favorited_by:E}).eq("tmdb_id",k);const y=L.findIndex(b=>b.tmdb_id==k);y>-1&&(L[y].favorited_by=E)}}let f=l.favorited_by||[];if(typeof f=="string")try{f=JSON.parse(f)}catch{f=[]}f.includes(c)?f=f.filter(_=>_!==c):f.push(c);const{data:d,error:p}=await v.from("media").update({favorited_by:f}).eq("tmdb_id",o).select().single();if(p)console.error("Error updating favorites:",p);else{g=d,It(g);const _=L.findIndex(k=>k.tmdb_id===o);_>-1&&(L[_]=d),f.includes(c)&&await Z("favorite",u,d)}}H(),t.classList.add("hidden")}})}async function Js(e,t){return new Promise(n=>{const r=document.getElementById("favorite-removal-modal"),o=document.getElementById("favorite-removal-list"),a=document.getElementById("cancel-favorite-removal-btn");o.innerHTML="",e.forEach(i=>{const l=document.createElement("div");l.className="flex items-center gap-3 p-3 rounded-lg border border-border-primary hover:bg-bg-tertiary cursor-pointer transition";const c=i.poster_path?`https://image.tmdb.org/t/p/w92${i.poster_path}`:"https://placehold.co/92x138?text=No+Image";l.innerHTML=`
                <img src="${c}" class="w-12 h-18 object-cover rounded" alt="${i.title}">
                <span class="flex-grow text-text-primary font-semibold">${i.title}</span>
                <button class="remove-favorite-btn text-danger hover:text-red-400 px-3 py-1 border border-danger rounded transition" data-tmdb-id="${i.tmdb_id}">
                    <i class="fas fa-times"></i> Remove
                </button>
            `,l.querySelector(".remove-favorite-btn").addEventListener("click",()=>{r.classList.add("hidden"),r.classList.remove("flex"),n(i.tmdb_id)}),o.appendChild(l)});const s=()=>{r.classList.add("hidden"),r.classList.remove("flex"),n(null)};a.removeEventListener("click",s),a.addEventListener("click",s),r.classList.remove("hidden"),r.classList.add("flex")})}function Le(e){const t=document.getElementById("toggle-watched-btn"),n=document.getElementById("currently-watching-btn"),r=document.getElementById("remove-currently-watching-btn"),o=document.getElementById("bookmark-btn");n.classList.add("hidden"),r.classList.add("hidden"),t.classList.remove("hidden"),e.watched?(t.textContent="Mark as Unwatched",t.classList.replace("bg-success","bg-gray-600")):e.currently_watching?(t.textContent="Mark as Watched",t.classList.replace("bg-gray-600","bg-success"),r.classList.remove("hidden")):(t.textContent="Mark as Watched",t.classList.replace("bg-gray-600","bg-success"),n.classList.remove("hidden")),e.want_to_watch?o.classList.add("text-accent-primary"):o.classList.remove("text-accent-primary")}async function _e(e,t,n,r=null){let o=t;o==="tv"&&(o="series");let{data:a,error:s}=await v.from("media").select("*").eq("tmdb_id",e).single();if(s&&s.code!=="PGRST116")return console.error("Error checking for media item:",s),null;if(a){if(r&&!a.poster_path){const{data:c,error:u}=await v.from("media").update({poster_path:r}).eq("tmdb_id",e).select().single();return u?(console.error("Error updating poster path:",u),a):c}return a}const{data:i,error:l}=await v.from("media").insert({tmdb_id:e,type:o,title:n,poster_path:r,source:"added"}).select().single();return l?(console.error("Error creating new media item:",l),null):i}function Xs(){const e=document.getElementById("toggle-watched-btn"),t=document.getElementById("toggle-rejected-btn"),n=document.getElementById("currently-watching-btn"),r=document.getElementById("remove-currently-watching-btn"),o=document.getElementById("bookmark-btn"),a=async s=>{const{tmdb_id:i,type:l,title:c,poster_path:u}=g;if(!await _e(i,l,c,u))return;if((l==="tv"||l==="series")&&!g.watched&&!s){const _=await si("Mark Series Watched?","How would you like to mark this series?");if(_==="cancel")return;_==="all-episodes"&&await Hs(i)}const h=s?!1:!g.watched;let f={watched:h};s&&(f.currently_watching=!1,f.source=null),h&&(f.currently_watching=!1,f.want_to_watch=!1);const{data:d,error:p}=await v.from("media").update(f).eq("tmdb_id",i).select().single();if(p)console.error("Error updating watched status:",p);else{g=d,Le(g);const _=L.findIndex(k=>k.tmdb_id===i);_>-1?L[_]=d:L.push(d),h&&!s&&await Z("watched","both",d),H()}};r.addEventListener("click",async()=>{const{tmdb_id:s}=g,{data:i,error:l}=await v.from("media").update({currently_watching:!1}).eq("tmdb_id",s).select().single();l?console.error("Error removing from currently watching:",l):(g=i,Le(g))}),n.addEventListener("click",async()=>{const{tmdb_id:s,type:i,title:l,poster_path:c}=g;if(!await _e(s,i,l,c))return;const m={currently_watching:!0,want_to_watch:!1,watched:!1},{data:h,error:f}=await v.from("media").update(m).eq("tmdb_id",s).select().single();f?console.error("Error setting currently watching:",f):(g=h,Le(g),await Z("currently_watching","both",h))}),o.addEventListener("click",async()=>{const{tmdb_id:s,type:i,title:l,poster_path:c}=g;if(!await _e(s,i,l,c))return;const m=!g.want_to_watch;let h={want_to_watch:m};m&&(h.currently_watching=!1);const{data:f,error:d}=await v.from("media").update(h).eq("tmdb_id",s).select().single();d?console.error("Error updating bookmark:",d):(g=f,Le(g),m&&await Z("want_to_watch","both",f))}),e.addEventListener("click",()=>a(!1)),t.addEventListener("click",()=>a(!0))}function Zs(){const e=document.getElementById("tooltip");document.addEventListener("mouseover",t=>{if(t.target.matches("[title]")){const n=t.target.getAttribute("title");t.target.setAttribute("data-original-title",n),t.target.removeAttribute("title"),e.textContent=n,e.classList.remove("hidden");const r=t.target.getBoundingClientRect();e.style.left=`${r.left+r.width/2-e.offsetWidth/2}px`,e.style.top=`${r.top-e.offsetHeight-5}px`}}),document.addEventListener("mouseout",t=>{t.target.matches("[data-original-title]")&&(t.target.setAttribute("title",t.target.getAttribute("data-original-title")),t.target.removeAttribute("data-original-title"),e.classList.add("hidden"))})}function Qs(){const e=document.getElementById("view-controls");e.addEventListener("click",t=>{const n=t.target.closest(".view-btn");if(n){const r=n.dataset.view;if(r===Et)return;Et=r,e.querySelectorAll(".view-btn").forEach(o=>{o.classList.remove("btn-active")}),n.classList.add("btn-active"),H()}})}async function ei(){try{console.log("App Initializing... v2.1"),ce=await xs();const{data:e,error:t}=await v.from("media_flairs").select("media_id, flairs(*)");!t&&e&&e.forEach(y=>{M.has(y.media_id)||M.set(y.media_id,[]),M.get(y.media_id).push(y.flairs)});const n=await Te();J("currently-watching-carousel",n);const r=await Se();J("want-to-watch-carousel",r),v.channel("media-carousels").on("postgres_changes",{event:"*",schema:"public",table:"media"},async y=>{const[b,x]=await Promise.all([Te(),Se()]);J("currently-watching-carousel",b),J("want-to-watch-carousel",x)}).subscribe(),v.channel("media").on("postgres_changes",{event:"*",schema:"public",table:"media"},async y=>{const[b,x]=await Promise.all([Te(),Se()]);J("currently-watching-carousel",b),J("want-to-watch-carousel",x)}).subscribe(),new URLSearchParams(window.location.search).get("hardrefresh")==="true"&&(await Es(),window.history.replaceState({},document.title,window.location.pathname));const s=document.getElementById("loading-spinner");s&&(s.style.display="flex");const{data:i,error:l}=await v.from("media").select("*");if(l){console.error("Error fetching all media:",l);return}L=await Ms(i),we=L.filter(y=>y.watched),H(),s&&(s.style.display="none");const c=document.getElementById("search-bar");c.setAttribute("autocomplete","off"),c.setAttribute("data-lpignore","true"),c.setAttribute("data-form-type","other"),c.setAttribute("spellcheck","false");const u=document.getElementById("sort-select"),m=document.getElementById("home-btn"),h=document.getElementById("logo-container"),f=document.getElementById("currently-watching-section"),d=document.getElementById("want-to-watch-section"),p=()=>{c.value="",we=L,K="watched",u.value="default",Ke="default",u.disabled=!1,m.classList.add("hidden"),f.classList.remove("hidden"),d.classList.remove("hidden");const y=document.getElementById("watched-items-header");y&&y.classList.remove("hidden"),H(),xt()},k=pr(async y=>{console.log("Search input event:",y.target.value);try{const b=y.target.value.trim();if(b==="")p();else{m.classList.remove("hidden"),f.classList.add("hidden"),d.classList.add("hidden");const x=document.getElementById("watched-items-header");x&&x.classList.add("hidden"),console.log("Executing search for:",b),we=await Rs(b),Ke="popularity",K="all",u.disabled=!0,H()}}catch(b){console.error("Error in search handler:",b)}},300);c.addEventListener("input",k),m.addEventListener("click",p),h.addEventListener("click",p),Ns(),qs(),Ys(),Qs(),Vs(),Zs(),Ks(),Xs(),Gs(),Sr(),await De(),ti(),ni(),xt();const I=document.getElementById("notification-btn");I&&I.addEventListener("click",()=>{alert("Notifications Coming Soon!")});const E=document.getElementById("avatar-toggle");E&&E.addEventListener("change",y=>{document.body.classList.toggle("show-avatars",y.target.checked)}),ze(),document.addEventListener("click",y=>{const b=document.getElementById("reaction-tooltip");b&&!b.classList.contains("hidden")&&(y.target.closest(".reaction-item")||Ne())})}catch(e){console.error("Error during app initialization:",e)}}function ti(){const e=document.getElementById("user-menu-btn"),t=document.getElementById("user-menu");e&&t&&e.addEventListener("click",()=>{t.classList.toggle("hidden")})}function ni(){const e={"currently-watching":document.getElementById("edit-currently-watching-btn"),"want-to-watch":document.getElementById("edit-want-to-watch-btn")},t={"currently-watching":document.getElementById("currently-watching-carousel"),"want-to-watch":document.getElementById("want-to-watch-carousel")};let n={"currently-watching":!1,"want-to-watch":!1};const r=o=>{n[o]=!n[o];const a=t[o],s=e[o];n[o]?(s.classList.add("text-accent-primary"),a.querySelectorAll(".movie-card").forEach(i=>{i.classList.add("shake");const l=document.createElement("button");l.className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center text-4xl",l.innerHTML='<i class="fas fa-times"></i>',l.onclick=async()=>{const c=i.dataset.tmdbId,u=o==="currently-watching"?{currently_watching:!1}:{want_to_watch:!1},{error:m}=await v.from("media").update(u).eq("tmdb_id",c);m?console.error(`Error removing from ${o}:`,m):i.remove()},i.appendChild(l)})):(s.classList.remove("text-accent-primary"),a.querySelectorAll(".movie-card").forEach(i=>{i.classList.remove("shake"),i.querySelector("button")?.remove()}))};e["currently-watching"].addEventListener("click",()=>r("currently-watching")),e["want-to-watch"].addEventListener("click",()=>r("want-to-watch"))}document.addEventListener("DOMContentLoaded",ei);const ri=["24klabubu.png","afraid.png","amazed.png","angry.png","bored.png","celebratory.png","crazy.png","crying.png","disgusted.png","happy.png","melted.png","neutral.png","not-a-fan.png","sad.png","satisfied.png","sexy.png","surprised.png","thinking.png","tea.png","lol.png"],gr={"tea.png":"Das Tea","lol.png":"Laughter","24klabubu.png":"24k Labubu","not-a-fan.png":"Not A Fan"};function oi(e){const t=document.getElementById("mood-modal-container");if(!t){console.error("mood-modal-container not found!");return}t.style.cssText=`
        position: fixed;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
    `,le=null,ye=null,t.innerHTML=`
        <div class="mood-modal" style="background-color: #1a1a1a; color: white; border-radius: 1rem; width: 95%; max-width: 40rem; max-height: 80vh; overflow-y: auto; position: relative; border: 1px solid #404040; display: flex; flex-direction: column; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
            <button id="close-mood-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: rgba(255,255,255,0.1); border-radius: 50%; padding: 0.5rem; cursor: pointer; color: white;">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div style="padding: 1.5rem;">
                <h2 class="text-2xl font-bold mb-6 text-center">How did this movie make you react?</h2>
                
                <div class="flex justify-center mb-8 gap-4">
                    <button class="user-select-btn" data-user="juainny">
                        <div class="user-avatar-preview user1-avatar-preview">J</div>
                        <span class="font-semibold">Juainny</span>
                    </button>
                    <button class="user-select-btn" data-user="erick">
                        <div class="user-avatar-preview user2-avatar-preview">E</div>
                        <span class="font-semibold">Erick</span>
                    </button>
                </div>

                <div id="mood-grid-container" class="mood-grid grayscale transition-all duration-300" style="opacity: 0.5; pointer-events: none;">
                    ${ri.map(o=>{const a=gr[o]||o.replace(".png","").replace(/-/g," ").replace(/_/g," ");return`
                        <div class="mood-option" data-mood="${o}" role="button" aria-label="${a}">
                            <img src="moods/${o}" alt="${a}">
                            <span class="mood-label">${a}</span>
                        </div>
                    `}).join("")}
                </div>

                <div class="mt-8 text-center">
                    <button id="mood-done-btn" class="bg-accent-primary hover:bg-accent-secondary text-text-on-accent font-bold py-2 px-8 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed" disabled>Done</button>
                </div>
            </div>
        </div >
        `,document.getElementById("close-mood-modal-btn").addEventListener("click",closeReactionSelector),t.addEventListener("click",o=>{o.target===t&&closeReactionSelector()});const n=t.querySelectorAll(".user-select-btn");n.forEach(o=>{o.addEventListener("click",()=>{n.forEach(s=>s.classList.remove("selected")),o.classList.add("selected"),le=o.dataset.user;const a=document.getElementById("mood-grid-container");a.classList.remove("grayscale"),a.style.opacity="1",a.style.pointerEvents="auto",An()})});const r=t.querySelectorAll(".mood-option");r.forEach(o=>{o.addEventListener("click",()=>{le&&(r.forEach(a=>a.classList.remove("selected")),o.classList.add("selected"),ye=o.dataset.mood,An())})}),document.getElementById("mood-done-btn").addEventListener("click",()=>{le&&ye&&(ai(e,le,ye),closeReactionSelector())})}let le=null,ye=null;function An(){const e=document.getElementById("mood-done-btn");le&&ye?e.disabled=!1:e.disabled=!0}window.closeReactionSelector=function(){const e=document.getElementById("mood-modal-container");e&&(e.innerHTML="",e.style.cssText=""),le=null,ye=null};async function ai(e,t,n){const r={};if((t==="user1"||t==="juainny")&&(r.juainny_reaction=n),(t==="user2"||t==="erick")&&(r.erick_reaction=n),g&&g.tmdb_id==e)g.title||g.name,g.poster_path,g.type||g.title;else{const i=L.find(l=>l.tmdb_id==e);i&&(i.title||i.name,i.poster_path,i.type)}g&&g.tmdb_id==e&&(t==="user1"&&(g.juainny_reaction=n),t==="user2"&&(g.erick_reaction=n),Qe());const o=L.findIndex(i=>i.tmdb_id==e);if(o>-1){L[o]={...L[o],...r},H();const i=await Te();J("currently-watching-carousel",i);const l=await Se();J("want-to-watch-carousel",l)}const{data:a,error:s}=await v.from("media").update(r).eq("tmdb_id",e).select().single();s?(console.error("Error saving reaction:",s),alert("Failed to save reaction. Please try again.")):(console.log("Reaction saved successfully to DB for TMDB ID:",e),a&&n&&await Z("reaction",t==="user1"||t==="juainny"?"juainny":"erick",a,{reaction:n}))}function Qe(){const e=document.getElementById("modal-mood-display"),t=document.getElementById("remove-mood-btn");if(!e)return;e.innerHTML="";let n=!1;g?.juainny_reaction&&(n=!0,e.innerHTML+=`
        <div class="relative group" title="Juainny's Reaction">
            <img src="moods/${g.juainny_reaction}" class="w-10 h-10 object-contain drop-shadow-md">
                <div class="absolute -bottom-1 -right-1 w-4 h-4">
                    ${U("juainny","w-full h-full")}
                </div>
            </div>
    `),g?.erick_reaction&&(n=!0,e.innerHTML+=`
        <div class="relative group" title="Erick's Reaction">
            <img src="moods/${g.erick_reaction}" class="w-10 h-10 object-contain drop-shadow-md">
                <div class="absolute -bottom-1 -right-1 w-4 h-4">
                    ${U("erick","w-full h-full")}
                </div>
            </div>
    `),n?(t.classList.remove("hidden"),t.onclick=async()=>{if(confirm("Remove all reactions for this item?")){const r={juainny_reaction:null,erick_reaction:null};g.juainny_reaction=null,g.erick_reaction=null,Qe(),await v.from("media").update(r).eq("tmdb_id",g.tmdb_id),H()}}):t.classList.add("hidden")}function xt(){document.querySelectorAll(".movie-card").forEach(e=>{const t=e.dataset.tmdbId,n=L.find(r=>r.tmdb_id==t);if(n){const r=e.querySelector(".absolute.top-2.left-2");if(r){let o="";n.juainny_reaction&&(o+=`
                        <div class="relative w-8 h-8 group/reaction cursor-pointer reaction-item" data-user="Juainny" data-reaction="${n.juainny_reaction}">
                            <img src="moods/${n.juainny_reaction}" class="w-full h-full object-contain drop-shadow-md">
                            <div class="absolute -bottom-1 -right-1 w-4 h-4">
                                ${U("juainny","w-full h-full")}
                            </div>
                        </div>
                    `),n.erick_reaction&&(o+=`
                        <div class="relative w-8 h-8 group/reaction cursor-pointer reaction-item" data-user="Erick" data-reaction="${n.erick_reaction}">
                            <img src="moods/${n.erick_reaction}" class="w-full h-full object-contain drop-shadow-md">
                            <div class="absolute -bottom-1 -right-1 w-4 h-4">
                                ${U("erick","w-full h-full")}
                            </div>
                        </div>
                    `),r.innerHTML=o,r.querySelectorAll(".reaction-item").forEach(a=>{a.addEventListener("mouseenter",s=>{et(s.currentTarget)}),a.addEventListener("mouseleave",()=>{Ne()}),a.addEventListener("click",s=>{Wt(s.currentTarget,s)})})}}}),g&&Qe()}let Ft=null;function et(e){const t=document.getElementById("reaction-tooltip"),n=document.getElementById("tooltip-avatar"),r=document.getElementById("tooltip-text");if(!t||!n||!r)return;const o=e.dataset.user,a=e.dataset.reaction;let s=gr[a];s||(s=a.replace(".png","").replace(/_/g," ").replace(/-/g," ").split(" ").map(u=>u.charAt(0).toUpperCase()+u.slice(1)).join(" ")),n.innerHTML=U(o.toLowerCase(),"w-6 h-6"),r.textContent=`${o} reacted with ${s}`;const i=e.getBoundingClientRect(),l=window.pageYOffset||document.documentElement.scrollTop,c=window.pageXOffset||document.documentElement.scrollLeft;t.style.position="absolute",t.style.left=`${i.left+c+i.width/2}px`,t.style.top=`${i.bottom+l+8}px`,t.style.transform="translateX(-50%)",t.classList.remove("hidden"),Ft=e}function Ne(){const e=document.getElementById("reaction-tooltip");e&&(e.classList.add("hidden"),Ft=null)}function Wt(e,t){t.stopPropagation(),Ft===e?Ne():et(e)}function si(e,t){return new Promise(n=>{const r=document.getElementById("confirmation-modal"),o=document.getElementById("confirmation-title"),a=document.getElementById("confirmation-message"),s=document.getElementById("confirm-series-only-btn"),i=document.getElementById("confirm-all-episodes-btn"),l=document.getElementById("cancel-confirmation-btn");o.textContent=e,a.textContent=t,i&&i.classList.remove("hidden"),r.classList.remove("hidden"),r.classList.add("flex");const c=()=>{r.classList.add("hidden"),r.classList.remove("flex"),s.onclick=null,i&&(i.onclick=null),l.onclick=null};s.onclick=()=>{c(),n("series-only")},i&&(i.onclick=()=>{c(),n("all-episodes")}),l.onclick=()=>{c(),n("cancel")}})}const Cn=document.getElementById("willow-fab"),ct=document.getElementById("willow-chat-modal"),Ue=document.getElementById("willow-chat-container"),Mn=document.getElementById("willow-chat-form"),pe=document.getElementById("willow-chat-input"),Ee=document.getElementById("willow-chat-messages");window.toggleWillowChat=function(){ct.classList.contains("hidden")?(ct.classList.remove("hidden"),setTimeout(()=>{Ue.classList.remove("translate-y-full"),Ue.classList.add("translate-y-0")},10),pe.focus()):(Ue.classList.remove("translate-y-0"),Ue.classList.add("translate-y-full"),setTimeout(()=>{ct.classList.add("hidden")},300))};Cn&&Cn.addEventListener("click",window.toggleWillowChat);Mn&&Mn.addEventListener("submit",async e=>{e.preventDefault();const t=pe.value.trim();if(!t)return;Rn(t,"user"),pe.value="",pe.disabled=!0;const n=ii(),r=await Cs(t,L);ci(n),Rn(r,"ai"),pe.disabled=!1,pe.focus()});function Rn(e,t){const n=document.createElement("div");n.className=`flex items-start gap-2 ${t==="user"?"flex-row-reverse":""}`;const r=t==="ai"?'<div class="w-8 h-8 rounded-full bg-teal-600 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold overflow-hidden"><img src="/willow-logo.png" class="w-full h-full object-cover"></div>':'<div class="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"><i class="fas fa-user"></i></div>',o=t==="ai"?"bg-bg-tertiary text-text-primary rounded-tl-none":"bg-teal-600 text-white rounded-tr-none";return n.innerHTML=`
        ${r}
        <div class="${o} p-3 rounded-2xl text-sm shadow-sm max-w-[85%]">
            ${e}
        </div>
    `,Ee.appendChild(n),Ee.scrollTop=Ee.scrollHeight,n.id="msg-"+Date.now()}function ii(){const e=document.createElement("div");return e.id="typing-"+Date.now(),e.className="flex items-start gap-2",e.innerHTML=`
        <div class="w-8 h-8 rounded-full bg-teal-600 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold overflow-hidden"><img src="/willow-logo.png" class="w-full h-full object-cover"></div>
        <div class="bg-bg-tertiary p-3 rounded-2xl rounded-tl-none text-text-primary text-sm shadow-sm">
            <div class="flex space-x-1">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
            </div>
        </div>
    `,Ee.appendChild(e),Ee.scrollTop=Ee.scrollHeight,e.id}function ci(e){const t=document.getElementById(e);t&&t.remove()}const li=Object.freeze(Object.defineProperty({__proto__:null,refreshAllReactionAvatars:xt},Symbol.toStringTag,{value:"Module"}));
