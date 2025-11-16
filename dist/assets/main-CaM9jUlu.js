import{L as Zn,g as sn,i as es,a as ts,_ as it,C as rt,r as Le,b as ns,S as oe,E as ft,c as R,d as Q,e as S,f as ss,h as rn,F as We,j as is,q as pe,k as He,l as an,m as gt,n as rs,o as at,p as on,u as cn,s as as,t as os,v as cs,w as ls,x as ds,y as us,z as hs,A as ms,B as ps,D as j,G as ce,H as ln,I as fs,J as vt,R as gs}from"./index.esm-t1Vi5QVN.js";document.addEventListener("DOMContentLoaded",()=>{const n={startDate:"2025-08-25",endDate:"2025-09-26"},e=document.getElementById("banner"),t=document.getElementById("close-banner-btn"),s=new Date().toISOString().split("T")[0];s>=n.startDate&&s<=n.endDate&&e.classList.remove("hidden"),t.addEventListener("click",()=>{e.style.display="none"})});class vs{constructor(e){this.onSelect=e,this.gradients=["avatar-gradient-1","avatar-gradient-2","avatar-gradient-3","avatar-gradient-4","avatar-gradient-5","avatar-gradient-6"],this.selectedUser=null,this.init()}init(){const e=document.createElement("div");e.id="avatar-picker-modal",e.className="fixed inset-0 z-50 hidden items-center justify-center modal-hidden p-4",e.innerHTML=`
            <div class="modal-backdrop fixed inset-0"></div>
            <div class="bg-bg-secondary rounded-lg shadow-xl z-50 w-full max-w-md mx-auto overflow-hidden modal-content relative">
                <button id="avatar-picker-close-btn" class="absolute top-4 right-4 text-text-primary hover:text-accent-primary transition">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <div class="p-6">
                    <h2 class="text-2xl font-bold mb-4">Choose Avatar</h2>
                    <div class="mb-4">
                        <h3 class="text-lg font-semibold mb-2">Select User</h3>
                        <div class="flex gap-4">
                            <button id="avatar-user1-btn" class="user-btn flex-1 p-4 rounded-lg border-2 border-border-primary">Juainny</button>
                            <button id="avatar-user2-btn" class="user-btn flex-1 p-4 rounded-lg border-2 border-border-primary">Erick</button>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold mb-2">Select Gradient</h3>
                        <div id="gradient-picker" class="grid grid-cols-3 gap-4">
                            ${this.gradients.map(t=>`<div data-gradient="${t}" class="gradient-option h-24 rounded-lg cursor-pointer ${t}"></div>`).join("")}
                        </div>
                    </div>
                </div>
            </div>
        `,document.body.appendChild(e),this.modal=e,this.gradientPicker=this.modal.querySelector("#gradient-picker"),this.modal.querySelector(".modal-backdrop").addEventListener("click",()=>this.close()),this.modal.querySelector("#avatar-picker-close-btn").addEventListener("click",()=>this.close()),this.modal.querySelector(".modal-content").addEventListener("click",t=>t.stopPropagation()),this.modal.querySelector("#avatar-user1-btn").addEventListener("click",()=>this.selectUser("user1")),this.modal.querySelector("#avatar-user2-btn").addEventListener("click",()=>this.selectUser("user2")),this.gradientPicker.addEventListener("click",t=>{const s=t.target.closest(".gradient-option");if(s&&this.selectedUser){const i=s.dataset.gradient;this.onSelect(this.selectedUser,i),this.close()}})}selectUser(e){this.selectedUser=e;const t=this.modal.querySelector("#avatar-user1-btn"),s=this.modal.querySelector("#avatar-user2-btn");e==="user1"?(t.classList.add("border-accent-primary"),s.classList.remove("border-accent-primary")):(s.classList.add("border-accent-primary"),t.classList.remove("border-accent-primary")),this.gradientPicker.classList.remove("opacity-50","pointer-events-none")}open(){this.modal.classList.remove("hidden"),setTimeout(()=>this.modal.classList.remove("modal-hidden"),10),this.gradientPicker.classList.add("opacity-50","pointer-events-none"),this.selectedUser=null,this.modal.querySelector("#avatar-user1-btn").classList.remove("border-accent-primary"),this.modal.querySelector("#avatar-user2-btn").classList.remove("border-accent-primary")}close(){this.modal.classList.add("modal-hidden"),setTimeout(()=>this.modal.classList.add("hidden"),300)}}function dn(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const ys=dn,un=new ft("auth","Firebase",dn());/**
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
 */const Re=new Zn("@firebase/auth");function Is(n,...e){Re.logLevel<=rn.WARN&&Re.warn(`Auth (${oe}): ${n}`,...e)}function Ee(n,...e){Re.logLevel<=rn.ERROR&&Re.error(`Auth (${oe}): ${n}`,...e)}/**
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
 */function W(n,...e){throw yt(n,...e)}function P(n,...e){return yt(n,...e)}function hn(n,e,t){const s={...ys(),[e]:t};return new ft("auth","Firebase",s).create(e,{appName:n.name})}function X(n){return hn(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function yt(n,...e){if(typeof n!="string"){const t=e[0],s=[...e.slice(1)];return s[0]&&(s[0].appName=n.name),n._errorFactory.create(t,...s)}return un.create(n,...e)}function f(n,e,...t){if(!n)throw yt(e,...t)}function F(n){const e="INTERNAL ASSERTION FAILED: "+n;throw Ee(e),new Error(e)}function H(n,e){n||F(e)}/**
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
 */function ot(){return typeof self<"u"&&self.location?.href||""}function bs(){return Rt()==="http:"||Rt()==="https:"}function Rt(){return typeof self<"u"&&self.location?.protocol||null}/**
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
 */function _s(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(bs()||ns()||"connection"in navigator)?navigator.onLine:!0}function ws(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
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
 */class fe{constructor(e,t){this.shortDelay=e,this.longDelay=t,H(t>e,"Short delay should be less than long delay!"),this.isMobile=es()||ts()}get(){return _s()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function It(n,e){H(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
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
 */class mn{static initialize(e,t,s){this.fetchImpl=e,t&&(this.headersImpl=t),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;F("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;F("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;F("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const Es={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */const Ts=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],ks=new fe(3e4,6e4);function je(n,e){return n.tenantId&&!e.tenantId?{...e,tenantId:n.tenantId}:e}async function le(n,e,t,s,i={}){return pn(n,i,async()=>{let r={},a={};s&&(e==="GET"?a=s:r={body:JSON.stringify(s)});const o=pe({key:n.config.apiKey,...a}).slice(1),c=await n._getAdditionalHeaders();c["Content-Type"]="application/json",n.languageCode&&(c["X-Firebase-Locale"]=n.languageCode);const l={method:e,headers:c,...r};return cs()||(l.referrerPolicy="no-referrer"),n.emulatorConfig&&He(n.emulatorConfig.host)&&(l.credentials="include"),mn.fetch()(await gn(n,n.config.apiHost,t,o),l)})}async function pn(n,e,t){n._canInitEmulator=!1;const s={...Es,...e};try{const i=new Ss(n),r=await Promise.race([t(),i.promise]);i.clearNetworkTimeout();const a=await r.json();if("needConfirmation"in a)throw _e(n,"account-exists-with-different-credential",a);if(r.ok&&!("errorMessage"in a))return a;{const o=r.ok?a.errorMessage:a.error.message,[c,l]=o.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw _e(n,"credential-already-in-use",a);if(c==="EMAIL_EXISTS")throw _e(n,"email-already-in-use",a);if(c==="USER_DISABLED")throw _e(n,"user-disabled",a);const d=s[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(l)throw hn(n,d,l);W(n,d)}}catch(i){if(i instanceof We)throw i;W(n,"network-request-failed",{message:String(i)})}}async function fn(n,e,t,s,i={}){const r=await le(n,e,t,s,i);return"mfaPendingCredential"in r&&W(n,"multi-factor-auth-required",{_serverResponse:r}),r}async function gn(n,e,t,s){const i=`${e}${t}?${s}`,r=n,a=r.config.emulator?It(n.config,i):`${n.config.apiScheme}://${i}`;return Ts.includes(t)&&(await r._persistenceManagerAvailable,r._getPersistenceType()==="COOKIE")?r._getPersistence()._getFinalTarget(a).toString():a}class Ss{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,s)=>{this.timer=setTimeout(()=>s(P(this.auth,"network-request-failed")),ks.get())})}}function _e(n,e,t){const s={appName:n.name};t.email&&(s.email=t.email),t.phoneNumber&&(s.phoneNumber=t.phoneNumber);const i=P(n,e,s);return i.customData._tokenResponse=t,i}/**
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
 */async function As(n,e){return le(n,"POST","/v1/accounts:delete",e)}async function Ce(n,e){return le(n,"POST","/v1/accounts:lookup",e)}/**
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
 */function de(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Ls(n,e=!1){const t=Q(n),s=await t.getIdToken(e),i=bt(s);f(i&&i.exp&&i.auth_time&&i.iat,t.auth,"internal-error");const r=typeof i.firebase=="object"?i.firebase:void 0,a=r?.sign_in_provider;return{claims:i,token:s,authTime:de(Ye(i.auth_time)),issuedAtTime:de(Ye(i.iat)),expirationTime:de(Ye(i.exp)),signInProvider:a||null,signInSecondFactor:r?.sign_in_second_factor||null}}function Ye(n){return Number(n)*1e3}function bt(n){const[e,t,s]=n.split(".");if(e===void 0||t===void 0||s===void 0)return Ee("JWT malformed, contained fewer than 3 sections"),null;try{const i=is(t);return i?JSON.parse(i):(Ee("Failed to decode base64 JWT payload"),null)}catch(i){return Ee("Caught error parsing JWT payload as JSON",i?.toString()),null}}function Ct(n){const e=bt(n);return f(e,"internal-error"),f(typeof e.exp<"u","internal-error"),f(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
 */async function me(n,e,t=!1){if(t)return e;try{return await e}catch(s){throw s instanceof We&&Rs(s)&&n.auth.currentUser===n&&await n.auth.signOut(),s}}function Rs({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
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
 */class Cs{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const s=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,s)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){e?.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
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
 */class ct{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=de(this.lastLoginAt),this.creationTime=de(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function xe(n){const e=n.auth,t=await n.getIdToken(),s=await me(n,Ce(e,{idToken:t}));f(s?.users.length,e,"internal-error");const i=s.users[0];n._notifyReloadListener(i);const r=i.providerUserInfo?.length?vn(i.providerUserInfo):[],a=Ps(n.providerData,r),o=n.isAnonymous,c=!(n.email&&i.passwordHash)&&!a?.length,l=o?c:!1,d={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:a,metadata:new ct(i.createdAt,i.lastLoginAt),isAnonymous:l};Object.assign(n,d)}async function xs(n){const e=Q(n);await xe(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Ps(n,e){return[...n.filter(s=>!e.some(i=>i.providerId===s.providerId)),...e]}function vn(n){return n.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
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
 */async function Ms(n,e){const t=await pn(n,{},async()=>{const s=pe({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:r}=n.config,a=await gn(n,i,"/v1/token",`key=${r}`),o=await n._getAdditionalHeaders();o["Content-Type"]="application/x-www-form-urlencoded";const c={method:"POST",headers:o,body:s};return n.emulatorConfig&&He(n.emulatorConfig.host)&&(c.credentials="include"),mn.fetch()(a,c)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function Ns(n,e){return le(n,"POST","/v2/accounts:revokeToken",je(n,e))}/**
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
 */class ie{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){f(e.idToken,"internal-error"),f(typeof e.idToken<"u","internal-error"),f(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Ct(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){f(e.length!==0,"internal-error");const t=Ct(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(f(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:s,refreshToken:i,expiresIn:r}=await Ms(e,t);this.updateTokensAndExpiration(s,i,Number(r))}updateTokensAndExpiration(e,t,s){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(e,t){const{refreshToken:s,accessToken:i,expirationTime:r}=t,a=new ie;return s&&(f(typeof s=="string","internal-error",{appName:e}),a.refreshToken=s),i&&(f(typeof i=="string","internal-error",{appName:e}),a.accessToken=i),r&&(f(typeof r=="number","internal-error",{appName:e}),a.expirationTime=r),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new ie,this.toJSON())}_performRefresh(){return F("not implemented")}}/**
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
 */function V(n,e){f(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class C{constructor({uid:e,auth:t,stsTokenManager:s,...i}){this.providerId="firebase",this.proactiveRefresh=new Cs(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new ct(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const t=await me(this,this.stsTokenManager.getToken(this.auth,e));return f(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Ls(this,e)}reload(){return xs(this)}_assign(e){this!==e&&(f(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new C({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){f(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let s=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),s=!0),t&&await xe(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(R(this.auth.app))return Promise.reject(X(this.auth));const e=await this.getIdToken();return await me(this,As(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const s=t.displayName??void 0,i=t.email??void 0,r=t.phoneNumber??void 0,a=t.photoURL??void 0,o=t.tenantId??void 0,c=t._redirectEventId??void 0,l=t.createdAt??void 0,d=t.lastLoginAt??void 0,{uid:y,emailVerified:g,isAnonymous:_,providerData:u,stsTokenManager:h}=t;f(y&&h,e,"internal-error");const I=ie.fromJSON(this.name,h);f(typeof y=="string",e,"internal-error"),V(s,e.name),V(i,e.name),f(typeof g=="boolean",e,"internal-error"),f(typeof _=="boolean",e,"internal-error"),V(r,e.name),V(a,e.name),V(o,e.name),V(c,e.name),V(l,e.name),V(d,e.name);const E=new C({uid:y,auth:e,email:i,emailVerified:g,displayName:s,isAnonymous:_,photoURL:a,phoneNumber:r,tenantId:o,stsTokenManager:I,createdAt:l,lastLoginAt:d});return u&&Array.isArray(u)&&(E.providerData=u.map(L=>({...L}))),c&&(E._redirectEventId=c),E}static async _fromIdTokenResponse(e,t,s=!1){const i=new ie;i.updateFromServerResponse(t);const r=new C({uid:t.localId,auth:e,stsTokenManager:i,isAnonymous:s});return await xe(r),r}static async _fromGetAccountInfoResponse(e,t,s){const i=t.users[0];f(i.localId!==void 0,"internal-error");const r=i.providerUserInfo!==void 0?vn(i.providerUserInfo):[],a=!(i.email&&i.passwordHash)&&!r?.length,o=new ie;o.updateFromIdToken(s);const c=new C({uid:i.localId,auth:e,stsTokenManager:o,isAnonymous:a}),l={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:r,metadata:new ct(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!r?.length};return Object.assign(c,l),c}}/**
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
 */const xt=new Map;function $(n){H(n instanceof Function,"Expected a class definition");let e=xt.get(n);return e?(H(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,xt.set(n,e),e)}/**
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
 */class yn{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}yn.type="NONE";const Pt=yn;/**
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
 */function Te(n,e,t){return`firebase:${n}:${e}:${t}`}class re{constructor(e,t,s){this.persistence=e,this.auth=t,this.userKey=s;const{config:i,name:r}=this.auth;this.fullUserKey=Te(this.userKey,i.apiKey,r),this.fullPersistenceKey=Te("persistence",i.apiKey,r),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await Ce(this.auth,{idToken:e}).catch(()=>{});return t?C._fromGetAccountInfoResponse(this.auth,t,e):null}return C._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,s="authUser"){if(!t.length)return new re($(Pt),e,s);const i=(await Promise.all(t.map(async l=>{if(await l._isAvailable())return l}))).filter(l=>l);let r=i[0]||$(Pt);const a=Te(s,e.config.apiKey,e.name);let o=null;for(const l of t)try{const d=await l._get(a);if(d){let y;if(typeof d=="string"){const g=await Ce(e,{idToken:d}).catch(()=>{});if(!g)break;y=await C._fromGetAccountInfoResponse(e,g,d)}else y=C._fromJSON(e,d);l!==r&&(o=y),r=l;break}}catch{}const c=i.filter(l=>l._shouldAllowMigration);return!r._shouldAllowMigration||!c.length?new re(r,e,s):(r=c[0],o&&await r._set(a,o.toJSON()),await Promise.all(t.map(async l=>{if(l!==r)try{await l._remove(a)}catch{}})),new re(r,e,s))}}/**
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
 */function Mt(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(wn(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(In(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Tn(e))return"Blackberry";if(kn(e))return"Webos";if(bn(e))return"Safari";if((e.includes("chrome/")||_n(e))&&!e.includes("edge/"))return"Chrome";if(En(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=n.match(t);if(s?.length===2)return s[1]}return"Other"}function In(n=S()){return/firefox\//i.test(n)}function bn(n=S()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function _n(n=S()){return/crios\//i.test(n)}function wn(n=S()){return/iemobile/i.test(n)}function En(n=S()){return/android/i.test(n)}function Tn(n=S()){return/blackberry/i.test(n)}function kn(n=S()){return/webos/i.test(n)}function _t(n=S()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function Us(n=S()){return _t(n)&&!!window.navigator?.standalone}function Os(){return as()&&document.documentMode===10}function Sn(n=S()){return _t(n)||En(n)||kn(n)||Tn(n)||/windows phone/i.test(n)||wn(n)}/**
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
 */function An(n,e=[]){let t;switch(n){case"Browser":t=Mt(S());break;case"Worker":t=`${Mt(S())}-${n}`;break;default:t=n}const s=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${oe}/${s}`}/**
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
 */class Ds{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const s=r=>new Promise((a,o)=>{try{const c=e(r);a(c)}catch(c){o(c)}});s.onAbort=t,this.queue.push(s);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const s of this.queue)await s(e),s.onAbort&&t.push(s.onAbort)}catch(s){t.reverse();for(const i of t)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:s?.message})}}}/**
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
 */async function Bs(n,e={}){return le(n,"GET","/v2/passwordPolicy",je(n,e))}/**
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
 */const Fs=6;class $s{constructor(e){const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??Fs,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=e.allowedNonAlphanumericCharacters?.join("")??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const s=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;s&&(t.meetsMinPasswordLength=e.length>=s),i&&(t.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let s;for(let i=0;i<e.length;i++)s=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(t,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(e,t,s,i,r){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=r))}}/**
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
 */class Ws{constructor(e,t,s,i){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=s,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Nt(this),this.idTokenSubscription=new Nt(this),this.beforeStateQueue=new Ds(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=un,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(r=>this._resolvePersistenceManagerAvailable=r)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=$(t)),this._initializationPromise=this.queue(async()=>{if(!this._deleted&&(this.persistenceManager=await re.create(this,e),this._resolvePersistenceManagerAvailable?.(),!this._deleted)){if(this._popupRedirectResolver?._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=this.currentUser?.uid||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Ce(this,{idToken:e}),s=await C._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(s)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){if(R(this.app)){const r=this.app.settings.authIdToken;return r?new Promise(a=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(r).then(a,a))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let s=t,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const r=this.redirectUser?._redirectEventId,a=s?._redirectEventId,o=await this.tryRedirectSignIn(e);(!r||r===a)&&o?.user&&(s=o.user,i=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(s)}catch(r){s=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(r))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return f(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await xe(e)}catch(t){if(t?.code!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=ws()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(R(this.app))return Promise.reject(X(this));const t=e?Q(e):null;return t&&f(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&f(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return R(this.app)?Promise.reject(X(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return R(this.app)?Promise.reject(X(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence($(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Bs(this),t=new $s(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new ft("auth","Firebase",e())}onAuthStateChanged(e,t,s){return this.registerStateListener(this.authStateSubscription,e,t,s)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,s){return this.registerStateListener(this.idTokenSubscription,e,t,s)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const s=this.onAuthStateChanged(()=>{s(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(s.tenantId=this.tenantId),await Ns(this,s)}}toJSON(){return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:this._currentUser?.toJSON()}}async _setRedirectUser(e,t){const s=await this.getOrInitRedirectPersistenceManager(t);return e===null?s.removeCurrentUser():s.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&$(e)||this._popupRedirectResolver;f(t,this,"argument-error"),this.redirectPersistenceManager=await re.create(this,[$(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){return this._isInitialized&&await this.queue(async()=>{}),this._currentUser?._redirectEventId===e?this._currentUser:this.redirectUser?._redirectEventId===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=this.currentUser?.uid??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,s,i){if(this._deleted)return()=>{};const r=typeof t=="function"?t:t.next.bind(t);let a=!1;const o=this._isInitialized?Promise.resolve():this._initializationPromise;if(f(o,this,"internal-error"),o.then(()=>{a||r(this.currentUser)}),typeof t=="function"){const c=e.addObserver(t,s,i);return()=>{a=!0,c()}}else{const c=e.addObserver(t);return()=>{a=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return f(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=An(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await this.heartbeatServiceProvider.getImmediate({optional:!0})?.getHeartbeatsHeader();t&&(e["X-Firebase-Client"]=t);const s=await this._getAppCheckToken();return s&&(e["X-Firebase-AppCheck"]=s),e}async _getAppCheckToken(){if(R(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await this.appCheckServiceProvider.getImmediate({optional:!0})?.getToken();return e?.error&&Is(`Error while retrieving App Check token: ${e.error}`),e?.token}}function Ve(n){return Q(n)}class Nt{constructor(e){this.auth=e,this.observer=null,this.addObserver=ss(t=>this.observer=t)}get next(){return f(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let wt={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Hs(n){wt=n}function js(n){return wt.loadJS(n)}function Vs(){return wt.gapiScript}function qs(n){return`__${n}${Math.floor(Math.random()*1e6)}`}/**
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
 */function Gs(n,e){const t=gt(n,"auth");if(t.isInitialized()){const i=t.getImmediate(),r=t.getOptions();if(at(r,e??{}))return i;W(i,"already-initialized")}return t.initialize({options:e})}function zs(n,e){const t=e?.persistence||[],s=(Array.isArray(t)?t:[t]).map($);e?.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(s,e?.popupRedirectResolver)}function Ks(n,e,t){const s=Ve(n);f(/^https?:\/\//.test(e),s,"invalid-emulator-scheme");const i=!1,r=Ln(e),{host:a,port:o}=Js(e),c=o===null?"":`:${o}`,l={url:`${r}//${a}${c}/`},d=Object.freeze({host:a,port:o,protocol:r.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!s._canInitEmulator){f(s.config.emulator&&s.emulatorConfig,s,"emulator-config-failed"),f(at(l,s.config.emulator)&&at(d,s.emulatorConfig),s,"emulator-config-failed");return}s.config.emulator=l,s.emulatorConfig=d,s.settings.appVerificationDisabledForTesting=!0,He(a)?(on(`${r}//${a}${c}`),cn("Auth",!0)):Xs()}function Ln(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function Js(n){const e=Ln(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const s=t[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(s);if(i){const r=i[1];return{host:r,port:Ut(s.substr(r.length+1))}}else{const[r,a]=s.split(":");return{host:r,port:Ut(a)}}}function Ut(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function Xs(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
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
 */class Rn{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return F("not implemented")}_getIdTokenResponse(e){return F("not implemented")}_linkToIdToken(e,t){return F("not implemented")}_getReauthenticationResolver(e){return F("not implemented")}}/**
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
 */async function ae(n,e){return fn(n,"POST","/v1/accounts:signInWithIdp",je(n,e))}/**
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
 */const Ys="http://localhost";class ee extends Rn{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new ee(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):W("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:s,signInMethod:i,...r}=t;if(!s||!i)return null;const a=new ee(s,i);return a.idToken=r.idToken||void 0,a.accessToken=r.accessToken||void 0,a.secret=r.secret,a.nonce=r.nonce,a.pendingToken=r.pendingToken||null,a}_getIdTokenResponse(e){const t=this.buildRequest();return ae(e,t)}_linkToIdToken(e,t){const s=this.buildRequest();return s.idToken=t,ae(e,s)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,ae(e,t)}buildRequest(){const e={requestUri:Ys,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=pe(t)}return e}}/**
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
 */class Cn{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class ge extends Cn{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
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
 */class q extends ge{constructor(){super("facebook.com")}static credential(e){return ee._fromParams({providerId:q.PROVIDER_ID,signInMethod:q.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return q.credentialFromTaggedObject(e)}static credentialFromError(e){return q.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return q.credential(e.oauthAccessToken)}catch{return null}}}q.FACEBOOK_SIGN_IN_METHOD="facebook.com";q.PROVIDER_ID="facebook.com";/**
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
 */class G extends ge{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return ee._fromParams({providerId:G.PROVIDER_ID,signInMethod:G.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return G.credentialFromTaggedObject(e)}static credentialFromError(e){return G.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:s}=e;if(!t&&!s)return null;try{return G.credential(t,s)}catch{return null}}}G.GOOGLE_SIGN_IN_METHOD="google.com";G.PROVIDER_ID="google.com";/**
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
 */class z extends ge{constructor(){super("github.com")}static credential(e){return ee._fromParams({providerId:z.PROVIDER_ID,signInMethod:z.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return z.credentialFromTaggedObject(e)}static credentialFromError(e){return z.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return z.credential(e.oauthAccessToken)}catch{return null}}}z.GITHUB_SIGN_IN_METHOD="github.com";z.PROVIDER_ID="github.com";/**
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
 */class K extends ge{constructor(){super("twitter.com")}static credential(e,t){return ee._fromParams({providerId:K.PROVIDER_ID,signInMethod:K.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return K.credentialFromTaggedObject(e)}static credentialFromError(e){return K.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:s}=e;if(!t||!s)return null;try{return K.credential(t,s)}catch{return null}}}K.TWITTER_SIGN_IN_METHOD="twitter.com";K.PROVIDER_ID="twitter.com";/**
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
 */async function Qs(n,e){return fn(n,"POST","/v1/accounts:signUp",je(n,e))}/**
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
 */class Y{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,s,i=!1){const r=await C._fromIdTokenResponse(e,s,i),a=Ot(s);return new Y({user:r,providerId:a,_tokenResponse:s,operationType:t})}static async _forOperation(e,t,s){await e._updateTokensIfNecessary(s,!0);const i=Ot(s);return new Y({user:e,providerId:i,_tokenResponse:s,operationType:t})}}function Ot(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
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
 */async function Zs(n){if(R(n.app))return Promise.reject(X(n));const e=Ve(n);if(await e._initializationPromise,e.currentUser?.isAnonymous)return new Y({user:e.currentUser,providerId:null,operationType:"signIn"});const t=await Qs(e,{returnSecureToken:!0}),s=await Y._fromIdTokenResponse(e,"signIn",t,!0);return await e._updateCurrentUser(s.user),s}/**
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
 */class Pe extends We{constructor(e,t,s,i){super(t.code,t.message),this.operationType=s,this.user=i,Object.setPrototypeOf(this,Pe.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(e,t,s,i){return new Pe(e,t,s,i)}}function xn(n,e,t,s){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(r=>{throw r.code==="auth/multi-factor-auth-required"?Pe._fromErrorAndOperation(n,r,e,s):r})}async function ei(n,e,t=!1){const s=await me(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return Y._forOperation(n,"link",s)}/**
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
 */async function ti(n,e,t=!1){const{auth:s}=n;if(R(s.app))return Promise.reject(X(s));const i="reauthenticate";try{const r=await me(n,xn(s,i,e,n),t);f(r.idToken,s,"internal-error");const a=bt(r.idToken);f(a,s,"internal-error");const{sub:o}=a;return f(n.uid===o,s,"user-mismatch"),Y._forOperation(n,i,r)}catch(r){throw r?.code==="auth/user-not-found"&&W(s,"user-mismatch"),r}}/**
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
 */async function ni(n,e,t=!1){if(R(n.app))return Promise.reject(X(n));const s="signIn",i=await xn(n,s,e),r=await Y._fromIdTokenResponse(n,s,i);return t||await n._updateCurrentUser(r.user),r}function si(n,e,t,s){return Q(n).onIdTokenChanged(e,t,s)}function ii(n,e,t){return Q(n).beforeAuthStateChanged(e,t)}function ri(n,e,t,s){return Q(n).onAuthStateChanged(e,t,s)}const Me="__sak";/**
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
 */class Pn{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Me,"1"),this.storage.removeItem(Me),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */const ai=1e3,oi=10;class Mn extends Pn{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Sn(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const s=this.storage.getItem(t),i=this.localCache[t];s!==i&&e(t,i,s)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((a,o,c)=>{this.notifyListeners(a,c)});return}const s=e.key;t?this.detachListener():this.stopPolling();const i=()=>{const a=this.storage.getItem(s);!t&&this.localCache[s]===a||this.notifyListeners(s,a)},r=this.storage.getItem(s);Os()&&r!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,oi):i()}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const i of Array.from(s))i(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:s}),!0)})},ai)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Mn.type="LOCAL";const ci=Mn;/**
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
 */class Nn extends Pn{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Nn.type="SESSION";const Un=Nn;/**
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
 */function li(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
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
 */class qe{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(i=>i.isListeningto(e));if(t)return t;const s=new qe(e);return this.receivers.push(s),s}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:s,eventType:i,data:r}=t.data,a=this.handlersMap[i];if(!a?.size)return;t.ports[0].postMessage({status:"ack",eventId:s,eventType:i});const o=Array.from(a).map(async l=>l(t.origin,r)),c=await li(o);t.ports[0].postMessage({status:"done",eventId:s,eventType:i,response:c})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}qe.receivers=[];/**
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
 */function Et(n="",e=10){let t="";for(let s=0;s<e;s++)t+=Math.floor(Math.random()*10);return n+t}/**
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
 */class di{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,s=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let r,a;return new Promise((o,c)=>{const l=Et("",20);i.port1.start();const d=setTimeout(()=>{c(new Error("unsupported_event"))},s);a={messageChannel:i,onMessage(y){const g=y;if(g.data.eventId===l)switch(g.data.status){case"ack":clearTimeout(d),r=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(r),o(g.data.response);break;default:clearTimeout(d),clearTimeout(r),c(new Error("invalid_response"));break}}},this.handlers.add(a),i.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:l,data:t},[i.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
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
 */function M(){return window}function ui(n){M().location.href=n}/**
 * @license
 * Copyright 2020 Google LLC.
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
 */function On(){return typeof M().WorkerGlobalScope<"u"&&typeof M().importScripts=="function"}async function hi(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function mi(){return navigator?.serviceWorker?.controller||null}function pi(){return On()?self:null}/**
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
 */const Dn="firebaseLocalStorageDb",fi=1,Ne="firebaseLocalStorage",Bn="fbase_key";class ve{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Ge(n,e){return n.transaction([Ne],e?"readwrite":"readonly").objectStore(Ne)}function gi(){const n=indexedDB.deleteDatabase(Dn);return new ve(n).toPromise()}function lt(){const n=indexedDB.open(Dn,fi);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const s=n.result;try{s.createObjectStore(Ne,{keyPath:Bn})}catch(i){t(i)}}),n.addEventListener("success",async()=>{const s=n.result;s.objectStoreNames.contains(Ne)?e(s):(s.close(),await gi(),e(await lt()))})})}async function Dt(n,e,t){const s=Ge(n,!0).put({[Bn]:e,value:t});return new ve(s).toPromise()}async function vi(n,e){const t=Ge(n,!1).get(e),s=await new ve(t).toPromise();return s===void 0?null:s.value}function Bt(n,e){const t=Ge(n,!0).delete(e);return new ve(t).toPromise()}const yi=800,Ii=3;class Fn{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await lt(),this.db)}async _withRetries(e){let t=0;for(;;)try{const s=await this._openDb();return await e(s)}catch(s){if(t++>Ii)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return On()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=qe._getInstance(pi()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){if(this.activeServiceWorker=await hi(),!this.activeServiceWorker)return;this.sender=new di(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&e[0]?.fulfilled&&e[0]?.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||mi()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await lt();return await Dt(e,Me,"1"),await Bt(e,Me),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(s=>Dt(s,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(s=>vi(s,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Bt(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const r=Ge(i,!1).getAll();return new ve(r).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],s=new Set;if(e.length!==0)for(const{fbase_key:i,value:r}of e)s.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(r)&&(this.notifyListeners(i,r),t.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!s.has(i)&&(this.notifyListeners(i,null),t.push(i));return t}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const i of Array.from(s))i(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),yi)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Fn.type="LOCAL";const bi=Fn;new fe(3e4,6e4);/**
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
 */function _i(n,e){return e?$(e):(f(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
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
 */class Tt extends Rn{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return ae(e,this._buildIdpRequest())}_linkToIdToken(e,t){return ae(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return ae(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function wi(n){return ni(n.auth,new Tt(n),n.bypassAuthState)}function Ei(n){const{auth:e,user:t}=n;return f(t,e,"internal-error"),ti(t,new Tt(n),n.bypassAuthState)}async function Ti(n){const{auth:e,user:t}=n;return f(t,e,"internal-error"),ei(t,new Tt(n),n.bypassAuthState)}/**
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
 */class $n{constructor(e,t,s,i,r=!1){this.auth=e,this.resolver=s,this.user=i,this.bypassAuthState=r,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:s,postBody:i,tenantId:r,error:a,type:o}=e;if(a){this.reject(a);return}const c={auth:this.auth,requestUri:t,sessionId:s,tenantId:r||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(o)(c))}catch(l){this.reject(l)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return wi;case"linkViaPopup":case"linkViaRedirect":return Ti;case"reauthViaPopup":case"reauthViaRedirect":return Ei;default:W(this.auth,"internal-error")}}resolve(e){H(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){H(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const ki=new fe(2e3,1e4);class ne extends $n{constructor(e,t,s,i,r){super(e,t,i,r),this.provider=s,this.authWindow=null,this.pollId=null,ne.currentPopupAction&&ne.currentPopupAction.cancel(),ne.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return f(e,this.auth,"internal-error"),e}async onExecution(){H(this.filter.length===1,"Popup operations only handle one event");const e=Et();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(P(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){return this.authWindow?.associatedEvent||null}cancel(){this.reject(P(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,ne.currentPopupAction=null}pollUserCancellation(){const e=()=>{if(this.authWindow?.window?.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(P(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,ki.get())};e()}}ne.currentPopupAction=null;/**
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
 */const Si="pendingRedirect",ke=new Map;class Ai extends $n{constructor(e,t,s=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,s),this.eventId=null}async execute(){let e=ke.get(this.auth._key());if(!e){try{const s=await Li(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(s)}catch(t){e=()=>Promise.reject(t)}ke.set(this.auth._key(),e)}return this.bypassAuthState||ke.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Li(n,e){const t=xi(e),s=Ci(n);if(!await s._isAvailable())return!1;const i=await s._get(t)==="true";return await s._remove(t),i}function Ri(n,e){ke.set(n._key(),e)}function Ci(n){return $(n._redirectPersistence)}function xi(n){return Te(Si,n.config.apiKey,n.name)}async function Pi(n,e,t=!1){if(R(n.app))return Promise.reject(X(n));const s=Ve(n),i=_i(s,e),a=await new Ai(s,i,t).execute();return a&&!t&&(delete a.user._redirectEventId,await s._persistUserIfCurrent(a.user),await s._setRedirectUser(null,e)),a}/**
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
 */const Mi=600*1e3;class Ni{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(e,s)&&(t=!0,this.sendToConsumer(e,s),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Ui(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){if(e.error&&!Wn(e)){const s=e.error.code?.split("auth/")[1]||"internal-error";t.onError(P(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const s=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&s}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Mi&&this.cachedEventUids.clear(),this.cachedEventUids.has(Ft(e))}saveEventToCache(e){this.cachedEventUids.add(Ft(e)),this.lastProcessedEventTime=Date.now()}}function Ft(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function Wn({type:n,error:e}){return n==="unknown"&&e?.code==="auth/no-auth-event"}function Ui(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Wn(n);default:return!1}}/**
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
 */async function Oi(n,e={}){return le(n,"GET","/v1/projects",e)}/**
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
 */const Di=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Bi=/^https?/;async function Fi(n){if(n.config.emulator)return;const{authorizedDomains:e}=await Oi(n);for(const t of e)try{if($i(t))return}catch{}W(n,"unauthorized-domain")}function $i(n){const e=ot(),{protocol:t,hostname:s}=new URL(e);if(n.startsWith("chrome-extension://")){const a=new URL(n);return a.hostname===""&&s===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&a.hostname===s}if(!Bi.test(t))return!1;if(Di.test(n))return s===n;const i=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(s)}/**
 * @license
 * Copyright 2020 Google LLC.
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
 */const Wi=new fe(3e4,6e4);function $t(){const n=M().___jsl;if(n?.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function Hi(n){return new Promise((e,t)=>{function s(){$t(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{$t(),t(P(n,"network-request-failed"))},timeout:Wi.get()})}if(M().gapi?.iframes?.Iframe)e(gapi.iframes.getContext());else if(M().gapi?.load)s();else{const i=qs("iframefcb");return M()[i]=()=>{gapi.load?s():t(P(n,"network-request-failed"))},js(`${Vs()}?onload=${i}`).catch(r=>t(r))}}).catch(e=>{throw Se=null,e})}let Se=null;function ji(n){return Se=Se||Hi(n),Se}/**
 * @license
 * Copyright 2020 Google LLC.
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
 */const Vi=new fe(5e3,15e3),qi="__/auth/iframe",Gi="emulator/auth/iframe",zi={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Ki=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Ji(n){const e=n.config;f(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?It(e,Gi):`https://${n.config.authDomain}/${qi}`,s={apiKey:e.apiKey,appName:n.name,v:oe},i=Ki.get(n.config.apiHost);i&&(s.eid=i);const r=n._getFrameworks();return r.length&&(s.fw=r.join(",")),`${t}?${pe(s).slice(1)}`}async function Xi(n){const e=await ji(n),t=M().gapi;return f(t,n,"internal-error"),e.open({where:document.body,url:Ji(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:zi,dontclear:!0},s=>new Promise(async(i,r)=>{await s.restyle({setHideOnLeave:!1});const a=P(n,"network-request-failed"),o=M().setTimeout(()=>{r(a)},Vi.get());function c(){M().clearTimeout(o),i(s)}s.ping(c).then(c,()=>{r(a)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
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
 */const Yi={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Qi=500,Zi=600,er="_blank",tr="http://localhost";class Wt{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function nr(n,e,t,s=Qi,i=Zi){const r=Math.max((window.screen.availHeight-i)/2,0).toString(),a=Math.max((window.screen.availWidth-s)/2,0).toString();let o="";const c={...Yi,width:s.toString(),height:i.toString(),top:r,left:a},l=S().toLowerCase();t&&(o=_n(l)?er:t),In(l)&&(e=e||tr,c.scrollbars="yes");const d=Object.entries(c).reduce((g,[_,u])=>`${g}${_}=${u},`,"");if(Us(l)&&o!=="_self")return sr(e||"",o),new Wt(null);const y=window.open(e||"",o,d);f(y,n,"popup-blocked");try{y.focus()}catch{}return new Wt(y)}function sr(n,e){const t=document.createElement("a");t.href=n,t.target=e;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(s)}/**
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
 */const ir="__/auth/handler",rr="emulator/auth/handler",ar=encodeURIComponent("fac");async function Ht(n,e,t,s,i,r){f(n.config.authDomain,n,"auth-domain-config-required"),f(n.config.apiKey,n,"invalid-api-key");const a={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:s,v:oe,eventId:i};if(e instanceof Cn){e.setDefaultLanguage(n.languageCode),a.providerId=e.providerId||"",os(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[d,y]of Object.entries({}))a[d]=y}if(e instanceof ge){const d=e.getScopes().filter(y=>y!=="");d.length>0&&(a.scopes=d.join(","))}n.tenantId&&(a.tid=n.tenantId);const o=a;for(const d of Object.keys(o))o[d]===void 0&&delete o[d];const c=await n._getAppCheckToken(),l=c?`#${ar}=${encodeURIComponent(c)}`:"";return`${or(n)}?${pe(o).slice(1)}${l}`}function or({config:n}){return n.emulator?It(n,rr):`https://${n.authDomain}/${ir}`}/**
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
 */const Qe="webStorageSupport";class cr{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Un,this._completeRedirectFn=Pi,this._overrideRedirectResult=Ri}async _openPopup(e,t,s,i){H(this.eventManagers[e._key()]?.manager,"_initialize() not called before _openPopup()");const r=await Ht(e,t,s,ot(),i);return nr(e,r,Et())}async _openRedirect(e,t,s,i){await this._originValidation(e);const r=await Ht(e,t,s,ot(),i);return ui(r),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:i,promise:r}=this.eventManagers[t];return i?Promise.resolve(i):(H(r,"If manager is not set, promise should be"),r)}const s=this.initAndGetManager(e);return this.eventManagers[t]={promise:s},s.catch(()=>{delete this.eventManagers[t]}),s}async initAndGetManager(e){const t=await Xi(e),s=new Ni(e);return t.register("authEvent",i=>(f(i?.authEvent,e,"invalid-auth-event"),{status:s.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:s},this.iframes[e._key()]=t,s}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Qe,{type:Qe},i=>{const r=i?.[0]?.[Qe];r!==void 0&&t(!!r),W(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Fi(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Sn()||bn()||_t()}}const lr=cr;var jt="@firebase/auth",Vt="1.11.0";/**
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
 */class dr{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){return this.assertAuthConfigured(),this.auth.currentUser?.uid||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(s=>{e(s?.stsTokenManager.accessToken||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){f(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function ur(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function hr(n){it(new rt("auth",(e,{options:t})=>{const s=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),r=e.getProvider("app-check-internal"),{apiKey:a,authDomain:o}=s.options;f(a&&!a.includes(":"),"invalid-api-key",{appName:s.name});const c={apiKey:a,authDomain:o,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:An(n)},l=new Ws(s,i,r,c);return zs(l,t),l},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,s)=>{e.getProvider("auth-internal").initialize()})),it(new rt("auth-internal",e=>{const t=Ve(e.getProvider("auth").getImmediate());return(s=>new dr(s))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Le(jt,Vt,ur(n)),Le(jt,Vt,"esm2020")}/**
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
 */const mr=300,pr=sn("authIdTokenMaxAge")||mr;let qt=null;const fr=n=>async e=>{const t=e&&await e.getIdTokenResult(),s=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(s&&s>pr)return;const i=t?.token;qt!==i&&(qt=i,await fetch(n,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function gr(n=an()){const e=gt(n,"auth");if(e.isInitialized())return e.getImmediate();const t=Gs(n,{popupRedirectResolver:lr,persistence:[bi,ci,Un]}),s=sn("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const r=new URL(s,location.origin);if(location.origin===r.origin){const a=fr(r.toString());ii(t,a,()=>a(t.currentUser)),si(t,o=>a(o))}}const i=rs("auth");return i&&Ks(t,`http://${i}`),t}function vr(){return document.getElementsByTagName("head")?.[0]??document}Hs({loadJS(n){return new Promise((e,t)=>{const s=document.createElement("script");s.setAttribute("src",n),s.onload=e,s.onerror=i=>{const r=P("internal-error");r.customData=i,t(r)},s.type="text/javascript",s.charset="UTF-8",vr().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});hr("Browser");/**
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
 */const Hn="firebasestorage.googleapis.com",yr="storageBucket",Ir=120*1e3,br=600*1e3;/**
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
 */class U extends We{constructor(e,t,s=0){super(Ze(e),`Firebase Storage: ${t} (${Ze(e)})`),this.status_=s,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,U.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return Ze(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var N;(function(n){n.UNKNOWN="unknown",n.OBJECT_NOT_FOUND="object-not-found",n.BUCKET_NOT_FOUND="bucket-not-found",n.PROJECT_NOT_FOUND="project-not-found",n.QUOTA_EXCEEDED="quota-exceeded",n.UNAUTHENTICATED="unauthenticated",n.UNAUTHORIZED="unauthorized",n.UNAUTHORIZED_APP="unauthorized-app",n.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",n.INVALID_CHECKSUM="invalid-checksum",n.CANCELED="canceled",n.INVALID_EVENT_NAME="invalid-event-name",n.INVALID_URL="invalid-url",n.INVALID_DEFAULT_BUCKET="invalid-default-bucket",n.NO_DEFAULT_BUCKET="no-default-bucket",n.CANNOT_SLICE_BLOB="cannot-slice-blob",n.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",n.NO_DOWNLOAD_URL="no-download-url",n.INVALID_ARGUMENT="invalid-argument",n.INVALID_ARGUMENT_COUNT="invalid-argument-count",n.APP_DELETED="app-deleted",n.INVALID_ROOT_OPERATION="invalid-root-operation",n.INVALID_FORMAT="invalid-format",n.INTERNAL_ERROR="internal-error",n.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(N||(N={}));function Ze(n){return"storage/"+n}function _r(){const n="An unknown error occurred, please check the error payload for server response.";return new U(N.UNKNOWN,n)}function wr(){return new U(N.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function Er(){return new U(N.CANCELED,"User canceled the upload/download.")}function Tr(n){return new U(N.INVALID_URL,"Invalid URL '"+n+"'.")}function kr(n){return new U(N.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+n+"'.")}function Gt(n){return new U(N.INVALID_ARGUMENT,n)}function jn(){return new U(N.APP_DELETED,"The Firebase app was deleted.")}function Sr(n){return new U(N.INVALID_ROOT_OPERATION,"The operation '"+n+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}/**
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
 */class x{constructor(e,t){this.bucket=e,this.path_=t}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let s;try{s=x.makeFromUrl(e,t)}catch{return new x(e,"")}if(s.path==="")return s;throw kr(e)}static makeFromUrl(e,t){let s=null;const i="([A-Za-z0-9.\\-_]+)";function r(k){k.path.charAt(k.path.length-1)==="/"&&(k.path_=k.path_.slice(0,-1))}const a="(/(.*))?$",o=new RegExp("^gs://"+i+a,"i"),c={bucket:1,path:3};function l(k){k.path_=decodeURIComponent(k.path)}const d="v[A-Za-z0-9_]+",y=t.replace(/[.]/g,"\\."),g="(/([^?#]*).*)?$",_=new RegExp(`^https?://${y}/${d}/b/${i}/o${g}`,"i"),u={bucket:1,path:3},h=t===Hn?"(?:storage.googleapis.com|storage.cloud.google.com)":t,I="([^?#]*)",E=new RegExp(`^https?://${h}/${i}/${I}`,"i"),w=[{regex:o,indices:c,postModify:r},{regex:_,indices:u,postModify:l},{regex:E,indices:{bucket:1,path:2},postModify:l}];for(let k=0;k<w.length;k++){const be=w[k],Je=be.regex.exec(e);if(Je){const Qn=Je[be.indices.bucket];let Xe=Je[be.indices.path];Xe||(Xe=""),s=new x(Qn,Xe),be.postModify(s);break}}if(s==null)throw Tr(e);return s}}class Ar{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
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
 */function Lr(n,e,t){let s=1,i=null,r=null,a=!1,o=0;function c(){return o===2}let l=!1;function d(...I){l||(l=!0,e.apply(null,I))}function y(I){i=setTimeout(()=>{i=null,n(_,c())},I)}function g(){r&&clearTimeout(r)}function _(I,...E){if(l){g();return}if(I){g(),d.call(null,I,...E);return}if(c()||a){g(),d.call(null,I,...E);return}s<64&&(s*=2);let w;o===1?(o=2,w=0):w=(s+Math.random())*1e3,y(w)}let u=!1;function h(I){u||(u=!0,g(),!l&&(i!==null?(I||(o=2),clearTimeout(i),y(0)):I||(o=1)))}return y(0),r=setTimeout(()=>{a=!0,h(!0)},t),h}function Rr(n){n(!1)}/**
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
 */function Cr(n){return n!==void 0}function zt(n,e,t,s){if(s<e)throw Gt(`Invalid value for '${n}'. Expected ${e} or greater.`);if(s>t)throw Gt(`Invalid value for '${n}'. Expected ${t} or less.`)}function xr(n){const e=encodeURIComponent;let t="?";for(const s in n)if(n.hasOwnProperty(s)){const i=e(s)+"="+e(n[s]);t=t+i+"&"}return t=t.slice(0,-1),t}var Ue;(function(n){n[n.NO_ERROR=0]="NO_ERROR",n[n.NETWORK_ERROR=1]="NETWORK_ERROR",n[n.ABORT=2]="ABORT"})(Ue||(Ue={}));/**
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
 */function Pr(n,e){const t=n>=500&&n<600,i=[408,429].indexOf(n)!==-1,r=e.indexOf(n)!==-1;return t||i||r}/**
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
 */class Mr{constructor(e,t,s,i,r,a,o,c,l,d,y,g=!0,_=!1){this.url_=e,this.method_=t,this.headers_=s,this.body_=i,this.successCodes_=r,this.additionalRetryCodes_=a,this.callback_=o,this.errorCallback_=c,this.timeout_=l,this.progressCallback_=d,this.connectionFactory_=y,this.retry=g,this.isUsingEmulator=_,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((u,h)=>{this.resolve_=u,this.reject_=h,this.start_()})}start_(){const e=(s,i)=>{if(i){s(!1,new we(!1,null,!0));return}const r=this.connectionFactory_();this.pendingConnection_=r;const a=o=>{const c=o.loaded,l=o.lengthComputable?o.total:-1;this.progressCallback_!==null&&this.progressCallback_(c,l)};this.progressCallback_!==null&&r.addUploadProgressListener(a),r.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&r.removeUploadProgressListener(a),this.pendingConnection_=null;const o=r.getErrorCode()===Ue.NO_ERROR,c=r.getStatus();if(!o||Pr(c,this.additionalRetryCodes_)&&this.retry){const d=r.getErrorCode()===Ue.ABORT;s(!1,new we(!1,null,d));return}const l=this.successCodes_.indexOf(c)!==-1;s(!0,new we(l,r))})},t=(s,i)=>{const r=this.resolve_,a=this.reject_,o=i.connection;if(i.wasSuccessCode)try{const c=this.callback_(o,o.getResponse());Cr(c)?r(c):r()}catch(c){a(c)}else if(o!==null){const c=_r();c.serverResponse=o.getErrorText(),this.errorCallback_?a(this.errorCallback_(o,c)):a(c)}else if(i.canceled){const c=this.appDelete_?jn():Er();a(c)}else{const c=wr();a(c)}};this.canceled_?t(!1,new we(!1,null,!0)):this.backoffId_=Lr(e,t,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&Rr(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class we{constructor(e,t,s){this.wasSuccessCode=e,this.connection=t,this.canceled=!!s}}function Nr(n,e){e!==null&&e.length>0&&(n.Authorization="Firebase "+e)}function Ur(n,e){n["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function Or(n,e){e&&(n["X-Firebase-GMPID"]=e)}function Dr(n,e){e!==null&&(n["X-Firebase-AppCheck"]=e)}function Br(n,e,t,s,i,r,a=!0,o=!1){const c=xr(n.urlParams),l=n.url+c,d=Object.assign({},n.headers);return Or(d,e),Nr(d,t),Ur(d,r),Dr(d,s),new Mr(l,n.method,d,n.body,n.successCodes,n.additionalRetryCodes,n.handler,n.errorHandler,n.timeout,n.progressCallback,i,a,o)}/**
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
 */function Fr(n){if(n.length===0)return null;const e=n.lastIndexOf("/");return e===-1?"":n.slice(0,e)}function $r(n){const e=n.lastIndexOf("/",n.length-2);return e===-1?n:n.slice(e+1)}/**
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
 */class Oe{constructor(e,t){this._service=e,t instanceof x?this._location=t:this._location=x.makeFromUrl(t,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new Oe(e,t)}get root(){const e=new x(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return $r(this._location.path)}get storage(){return this._service}get parent(){const e=Fr(this._location.path);if(e===null)return null;const t=new x(this._location.bucket,e);return new Oe(this._service,t)}_throwIfRoot(e){if(this._location.path==="")throw Sr(e)}}function Kt(n,e){const t=e?.[yr];return t==null?null:x.makeFromBucketSpec(t,n)}function Wr(n,e,t,s={}){n.host=`${e}:${t}`;const i=He(e);i&&(on(`https://${n.host}/b`),cn("Storage",!0)),n._isUsingEmulator=!0,n._protocol=i?"https":"http";const{mockUserToken:r}=s;r&&(n._overrideAuthToken=typeof r=="string"?r:ds(r,n.app.options.projectId))}class Hr{constructor(e,t,s,i,r,a=!1){this.app=e,this._authProvider=t,this._appCheckProvider=s,this._url=i,this._firebaseVersion=r,this._isUsingEmulator=a,this._bucket=null,this._host=Hn,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=Ir,this._maxUploadRetryTime=br,this._requests=new Set,i!=null?this._bucket=x.makeFromBucketSpec(i,this._host):this._bucket=Kt(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=x.makeFromBucketSpec(this._url,e):this._bucket=Kt(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){zt("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){zt("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const t=await e.getToken();if(t!==null)return t.accessToken}return null}async _getAppCheckToken(){if(R(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new Oe(this,e)}_makeRequest(e,t,s,i,r=!0){if(this._deleted)return new Ar(jn());{const a=Br(e,this._appId,s,i,t,this._firebaseVersion,r,this._isUsingEmulator);return this._requests.add(a),a.getPromise().then(()=>this._requests.delete(a),()=>this._requests.delete(a)),a}}async makeRequestWithTokens(e,t){const[s,i]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,s,i).getPromise()}}const Jt="@firebase/storage",Xt="0.14.0";/**
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
 */const Vn="storage";function jr(n=an(),e){n=Q(n);const s=gt(n,Vn).getImmediate({identifier:e}),i=ls("storage");return i&&Vr(s,...i),s}function Vr(n,e,t,s={}){Wr(n,e,t,s)}function qr(n,{instanceIdentifier:e}){const t=n.getProvider("app").getImmediate(),s=n.getProvider("auth-internal"),i=n.getProvider("app-check-internal");return new Hr(t,s,i,e,oe)}function Gr(){it(new rt(Vn,qr,"PUBLIC").setMultipleInstances(!0)),Le(Jt,Xt,""),Le(Jt,Xt,"esm2020")}Gr();function B(n,e,t,s={}){if(!n)return;const{type:i="initial",value:r="",size:a="normal",extraClasses:o=[]}=s,c=e==="user1"?t.avatars?.user1:t.avatars?.user2,l=e==="user1"?"J":"E",y=[...a==="small"?["w-6","h-6","text-sm"]:["w-10","h-10","text-xl"],"rounded-full","flex","items-center","justify-center","font-bold","text-white"];switch(n.className=[...y,...o].join(" "),n.innerHTML="",c&&n.classList.add(c),i){case"icon":n.innerHTML=`<i class="${r}"></i>`;break;case"image":n.innerHTML=`<img src="${r}" class="w-full h-full object-cover rounded-full" />`;break;case"initial":default:n.textContent=l;break}}class zr{constructor(e,t,s){this.moods=e,this.onDone=t,this.userSettings=s,this.selectedMood=null,this.selectedUser=null,this.modal=null,this.createModal()}createModal(){const e=document.getElementById("mood-modal-container");e.innerHTML=`
      <div class="mood-modal-overlay">
        <div class="mood-modal bg-bg-secondary text-text-primary">
          <button id="close-mood-modal-btn" class="absolute top-4 right-4 text-text-primary hover:text-accent-primary transition bg-white/10 backdrop-blur-sm rounded-full p-2 z-10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <h2 class="text-2xl font-bold mb-6 text-center">How did this movie make you react?</h2>
          <div class="flex justify-center mb-6 gap-4">
            <button class="user-select-btn bg-bg-tertiary flex items-center gap-2" data-user="user1">
                <div class="w-8 h-8 rounded-full user1-avatar-preview"></div>
                <span>Juainny</span>
            </button>
            <button class="user-select-btn bg-bg-tertiary flex items-center gap-2" data-user="user2">
                <div class="w-8 h-8 rounded-full user2-avatar-preview"></div>
                <span>Erick</span>
            </button>
          </div>
          <div class="mood-grid">
            ${this.moods.map(t=>`
              <div class="mood-option" data-mood="${t.name}" role="button" aria-label="${t.name}">
                <img src="/moods/${t.image}" alt="${t.name}">
                <span class="mood-label">${t.name}</span>
              </div>
            `).join("")}
          </div>
          <div class="mt-8 text-center">
            <button id="mood-done-btn" class="bg-accent-primary hover:bg-accent-secondary text-text-on-accent font-bold py-2 px-8 rounded-lg transition" disabled>Done</button>
          </div>
        </div>
      </div>
    `,this.modal=e.querySelector(".mood-modal-overlay"),this.attachEventListeners(),this.applyAvatars()}applyAvatars(){if(this.userSettings&&this.userSettings.avatars){const e=this.modal.querySelector(".user1-avatar-preview"),t=this.modal.querySelector(".user2-avatar-preview");B(e,"user1",this.userSettings),B(t,"user2",this.userSettings)}}attachEventListeners(){this.modal.addEventListener("click",i=>{(i.target.classList.contains("mood-modal-overlay")||i.target.closest("#close-mood-modal-btn"))&&this.close()}),this.modal.querySelectorAll(".user-select-btn").forEach(i=>{i.addEventListener("click",()=>this.selectUser(i.dataset.user))}),this.modal.querySelectorAll(".mood-option").forEach(i=>{i.addEventListener("click",()=>this.selectMood(i.dataset.mood))}),this.modal.querySelector("#mood-done-btn").addEventListener("click",()=>{this.selectedMood&&this.selectedUser&&(this.onDone(this.selectedUser,this.selectedMood),this.close())})}selectUser(e){this.selectedUser=e,this.modal.querySelectorAll(".user-select-btn").forEach(i=>{i.classList.remove("selected","user1-highlight","user2-highlight"),i.dataset.user===e&&(i.classList.add("selected"),e==="user1"?i.classList.add("user1-highlight"):i.classList.add("user2-highlight"))}),this.modal.querySelectorAll(".mood-option img").forEach(i=>{i.style.filter="grayscale(0%)"}),this.checkDoneButtonState()}selectMood(e){this.selectedMood=this.moods.find(s=>s.name===e),this.modal.querySelectorAll(".mood-option").forEach(s=>{s.classList.toggle("selected",s.dataset.mood===e)}),this.checkDoneButtonState()}checkDoneButtonState(){this.modal.querySelector("#mood-done-btn").disabled=!this.selectedMood||!this.selectedUser}open(e={}){this.selectedMood=null,this.selectedUser=null,this.modal.querySelectorAll(".mood-option").forEach(i=>{i.classList.remove("selected","user1-glow","user2-glow");const r=i.dataset.mood;e.user1&&e.user1.name===r&&i.classList.add("user1-glow"),e.user2&&e.user2.name===r&&i.classList.add("user2-glow"),i.querySelector("img").style.filter="grayscale(100%)"}),this.modal.querySelectorAll(".user-select-btn").forEach(i=>{i.classList.remove("selected","user1-highlight","user2-highlight")}),this.modal.querySelector("#mood-done-btn").disabled=!0,this.modal.classList.add("visible")}close(){this.modal.classList.remove("visible")}}const ye="':7:}lb1m/8F17;1%A&65",kt="25e3d089cc8e37a56bf6a1984daf3c5c",Kr={apiKey:"AIzaSyB7ijoC19A2krXR4kchbLEK_OZy_I53hsY",authDomain:"marvelmarathon.firebaseapp.com",projectId:"marvelmarathon",storageBucket:"marvelmarathon.appspot.com",messagingSenderId:"436493932151",appId:"1:436493932151:web:3db786130c2e7ba0159872"},ue=us(Kr);hs(ue,{provider:new gs("6LebxYsrAAAAAF0FNbAiFp-uA7kjHZJT3i3hr6co"),isTokenAutoRefreshEnabled:!0});const Jr=new URLSearchParams(window.location.search),ze=Jr.get("id")||"marvel-marathon-default",Xr=ms(ue),St=ps(Xr,{model:"gemini-2.5-flash-lite"});let et,O,Yr,Z,m={items:[]},p={quotaConservation:!0,aiDisabled:!1,wallpaper:null,nextUpWallpaperEnabled:!1,nextUpWallpaperType:"all",nextUpWallpaperIncludeNonMCU:!0,nextUpWallpaperIncludeTV:!0,theme:"dark",avatars:{user1:null,user2:null},aiHeading:null,aiHeadingTimestamp:null},tt,dt=!1,Ae=null,qn="grid",T="movie",J=!1,b=null,se=null,nt=null,Yt=null,Ke=[];const Qt=["The first Marvel comic was published in 1939, called “Marvel Comics #1.”","Stan Lee’s real name is Stanley Martin Lieber.","Spider-Man once teamed up with the cast of Saturday Night Live in a comic.","The X-Men’s original uniforms were all yellow and blue.","Black Panther debuted in Fantastic Four #52 in 1966.","The character Squirrel Girl has defeated Thanos and Doctor Doom in the comics.","Deadpool’s first appearance was in “The New Mutants” #98 (1991).","Magneto is the father of Quicksilver and Scarlet Witch in the comics.","The Hulk was originally grey, not green.","Wolverine’s first appearance was in “The Incredible Hulk” #180 (1974).","The character Howard the Duck has run for President in the comics.","She-Hulk was a member of both the Avengers and the Fantastic Four.","The villain MODOK stands for “Mental Organism Designed Only for Killing.”","The Punisher first appeared in “The Amazing Spider-Man” #129 (1974).","The character Moon Knight has multiple personalities.","The superhero team Alpha Flight is Canada’s official superhero group.","The original Captain Marvel was a Kree alien named Mar-Vell.","The character Beta Ray Bill once wielded Thor’s hammer.","The villain Kang the Conqueror is a descendant of Reed Richards.","The superhero Dazzler was created as a cross-promotion with a record company.","The X-Men’s mansion is located in Westchester County, New York.","The character Namor the Sub-Mariner is one of Marvel’s oldest heroes.","Doctor Doom is the ruler of the fictional country Latveria.","The character Jubilee was introduced in the late 1980s as a mall-loving teen.","The villain Taskmaster can copy any fighting style he sees.","The superhero team Runaways consists of teens who discover their parents are supervillains.","The character Cloak and Dagger gained their powers from experimental drugs.","The villain Mephisto is Marvel’s version of the devil.","The superhero Ms. Marvel was originally Carol Danvers before becoming Captain Marvel.","The character Spider-Ham is a pig version of Spider-Man from an alternate universe.","The superhero team Excalibur is based in the UK and features Captain Britain.","The villain Arcade runs a deadly amusement park called Murderworld.","The character Shatterstar is from the Mojoverse, a dimension obsessed with TV ratings.","The superhero Sentry has the power of “a million exploding suns.”","The villain The Beyonder once turned the Marvel Universe upside down in “Secret Wars.”","The superhero Northstar was one of the first openly gay Marvel characters.","The character Silver Surfer was originally a herald for Galactus.","The villain The Mandarin uses ten powerful rings, each with a different ability.","The superhero team The New Warriors debuted in 1989.","The character Spider-Woman was created to secure the copyright for the name.","The villain Absorbing Man can take on the properties of anything he touches.","The superhero team Power Pack consists of four siblings with superpowers.","The character Man-Thing burns those who feel fear.","The villain Mister Sinister is obsessed with mutant genetics.","The superhero team The Great Lakes Avengers is a parody group based in Wisconsin.","The character Adam Warlock was created to be the perfect human.","The villain The High Evolutionary experiments on animals to create new species.","The superhero Nova is a member of the intergalactic Nova Corps.","The character Elsa Bloodstone is a monster hunter.","The villain Fin Fang Foom is a giant dragon who wears purple shorts."];async function Qr(){try{const n=document.getElementById("loading-fact");if(n){const e=()=>{const t=Math.floor(Math.random()*Qt.length);n.textContent=Qt[t]};e(),Ae=setInterval(e,3e3)}et=gr(ue),O=fs(ue),Yr=jr(ue),ri(et,e=>{e?(Z=e.uid,setTimeout(()=>{oa(),Zr(),fa(),Gn(),Lt()},2e3)):Zs(et).catch(t=>{console.error("Anonymous sign-in failed:",t),document.getElementById("loading-spinner").innerText="Authentication Error."})})}catch(n){console.error("Firebase initialization failed:",n),document.getElementById("loading-spinner").innerHTML="Error connecting to services. Please refresh."}}async function Zr(){const n=j(O,"settings","main");vt(n,e=>{e.exists()?p=e.data():ce(n,p),Gn()})}async function D(n){const e=j(O,"settings","main");p={...p,...n};const t={...n,authKey:ye};await ce(e,t,{merge:!0})}function ea(n){D({theme:n})}function ta(n){const e=document.body,t=Array.from(e.classList).filter(s=>s.startsWith("theme-"));e.classList.remove(...t),e.classList.add(`theme-${n||"dark"}`)}function Gn(){if(ta(p.theme),p.avatars){const s=document.getElementById("user1-avatar-preview"),i=document.getElementById("user2-avatar-preview"),r=document.getElementById("juainny-avatar"),a=document.getElementById("erick-avatar"),o=document.getElementById("user1-avatar-nav"),c=document.getElementById("user2-avatar-nav");s&&i&&r&&a&&(B(s,"user1",p,{extraClasses:["mt-2"]}),B(i,"user2",p,{extraClasses:["mt-2"]}),B(r,"user1",p,{extraClasses:["mr-3"]}),B(a,"user2",p,{extraClasses:["mr-3"]}),B(o,"user1",p,{}),B(c,"user2",p,{}))}const n=document.getElementById("quota-conservation-toggle"),e=document.getElementById("ai-disabled-toggle");if(n.checked=p.quotaConservation,e.checked=p.aiDisabled,n.dispatchEvent(new Event("change")),e.dispatchEvent(new Event("change")),document.querySelectorAll(".ai-feature").forEach(s=>{s.style.display=p.aiDisabled?"none":""}),m.items&&m.items.length>0){let s=m.items;T==="movie"?s=s.filter(i=>i.type==="movie"):T==="tv"&&(s=s.filter(i=>["tv","one-shot"].includes(i.type))),T!=="tv"&&!J&&(s=s.filter(i=>!i.not_mcu)),ut(s)}ut(m.items),p.wallpaper?(document.body.style.backgroundImage=`url(${p.wallpaper})`,document.body.style.backgroundSize="cover",document.body.style.backgroundPosition="center",document.body.style.backgroundAttachment="fixed",document.getElementById("wallpaper-overlay").style.display="block"):(document.body.style.backgroundImage="",document.getElementById("wallpaper-overlay").style.display="none"),ra(),he()}async function na(n,e,t){const i=`You are a Jarvis a movie "Next Up" generator for a web app for Juainny and Erick. Looking at the movies that have been watched: ${t.map(r=>r.title).join(", ")}.
Generate a 2-3 sentence teaser for the next movie that also incorporates what happened in the last MCU movie: '${n}'. The movie's description is: '${e}'.
Your tone should be a throwback to the movies already watched, but also a look into what's next. Do not refer to anyone by name. Sound a bit robotic. Use markdown for emphasis, like **bold** for movie titles.`;try{return(await St.generateContent(i)).response.text().replace(/"/g,"")}catch(r){return console.error("AI hype generation failed:",r),"This next one's a mystery... hope you're ready!"}}async function sa(n,e=!1){const t=`${T}_${J?"non_mcu":"mcu"}`;if(!e&&p.quotaConservation&&typeof n.nextUpHype=="object"&&n.nextUpHype&&n.nextUpHype[t])return n.nextUpHype[t];const s=m.items.filter(r=>r.watched),i=await na(n.title,n.overview,s);if(p.quotaConservation){const r=m.items.findIndex(a=>a.id===n.id);r>-1&&((typeof m.items[r].nextUpHype!="object"||m.items[r].nextUpHype===null)&&(m.items[r].nextUpHype={}),m.items[r].nextUpHype[t]=i,A())}return i}async function ia(){const n='You are Jarvis. Your task is to generate a single, fun, welcoming sentence for a Marvel movie marathon website. The sentence must be less than 10 words. Do not use any markdown or formatting characters like * or #. For example: "Your Marvel journey awaits."';try{let s=(await St.generateContent(n)).response.text();return s=s.split(`
`)[0],s=s.replace(/[\*#]/g,""),s=s.replace(/"/g,""),s.trim()}catch(e){return console.error("AI heading generation failed:",e),"Welcome, Marvel Fan!"}}async function ra(){const n=document.getElementById("ai-heading");if(!n)return;const e=Date.now(),t=p.aiHeadingTimestamp||0,s=10*1e3;if(e-t>s){const i=await ia();n.textContent=i,D({aiHeading:i,aiHeadingTimestamp:e})}else n.textContent=p.aiHeading||"Welcome, Marvel Fan!"}async function aa(n,e,t,s){let i=`You are Jarvis a summarizer. Based on the following ratings (out of 10) and notes for the movie "${n}", create a short, smart summary of what the Watchers thought. Juainny gave it a ${e.user1} and said: "${t.user1}". Erick, gave it a ${e.user2} and said: "${t.user2}".`;s&&(s.user1&&(i+=` Juainny felt ${s.user1.name}.`),s.user2&&(i+=` Erick felt ${s.user2.name}.`)),i+=" Summarize, and use their names. Give both users equal summary amounts. Sound a bit robotic. Use markdown for emphasis, like **bold** for names.";try{return(await St.generateContent(i)).response.text().replace(/"/g,"")}catch(r){return console.error("AI summary generation failed:",r),"Looks like the notes are still processing..."}}const Zt={1:["Iron Man","The Incredible Hulk","Iron Man 2","Thor","Captain America: The First Avenger","The Avengers"],2:["Iron Man 3","Thor: The Dark World","Captain America: The Winter Soldier","Guardians of the Galaxy","Avengers: Age of Ultron","Ant-Man"],3:["Captain America: Civil War","Doctor Strange","Guardians of the Galaxy Vol. 2","Spider-Man: Homecoming","Thor: Ragnarok","Black Panther","Avengers: Infinity War","Ant-Man and the Wasp","Captain Marvel","Avengers: Endgame","Spider-Man: Far From Home"],4:["WandaVision","The Falcon and the Winter Soldier","Loki Season 1","Black Widow","What If…?","Shang-Chi and the Legend of the Ten Rings","Eternals","Hawkeye","Spider-Man: No Way Home","Moon Knight","Doctor Strange in the Multiverse of Madness","Ms. Marvel","Thor: Love and Thunder","I Am Groot","She-Hulk: Attorney at Law","Werewolf by Night","Black Panther: Wakanda Forever","The Guardians of the Galaxy Holiday Special"],5:["Ant-Man and the Wasp: Quantumania","Guardians of the Galaxy Vol. 3","Secret Invasion","Loki Season 2","The Marvels","What If…? Season 2","Echo","Deadpool & Wolverine","Agatha All Along","What If…? Season 3","Captain America: Brave New World","Daredevil: Born Again","Thunderbolts","Ironheart"],6:["The Fantastic Four: First Steps","Avengers: Doomsday","Avengers: Secret Wars"]},De=[{title:"Captain America: The First Avenger",type:"movie",tmdbId:1771,imdbId:"tt0458339",phase:1,not_mcu:!1},{title:"Agent Carter (One-Shot)",type:"one-shot",tmdbId:211387,imdbId:"tt3067038",phase:1,not_mcu:!1},{title:"Agent Carter (S1 & S2)",type:"tv",tmdbId:61550,imdbId:"tt3475734",phase:1,not_mcu:!1},{title:"Captain Marvel",type:"movie",tmdbId:299537,imdbId:"tt4154664",phase:1,not_mcu:!1},{title:"X-Men",type:"movie",tmdbId:36657,imdbId:"tt0120903",imdbScore:7.3,phase:0,not_mcu:!0},{title:"Iron Man",type:"movie",tmdbId:1726,imdbId:"tt0371746",phase:1,not_mcu:!1},{title:"Iron Man 2",type:"movie",tmdbId:10138,imdbId:"tt1228705",phase:1,not_mcu:!1},{title:"The Incredible Hulk",type:"movie",tmdbId:1724,imdbId:"tt0800080",phase:1,not_mcu:!1},{title:"X2: X-Men United",type:"movie",tmdbId:36658,imdbId:"tt0290334",imdbScore:7.4,phase:0,not_mcu:!0},{title:"The Consultant (One-Shot)",type:"one-shot",tmdbId:76122,imdbId:"tt2011118",phase:1,not_mcu:!1},{title:"A Funny Thing Happened on the Way to Thor's Hammer",type:"one-shot",tmdbId:76535,imdbId:"tt2011109",phase:1,not_mcu:!1},{title:"Thor",type:"movie",tmdbId:10195,imdbId:"tt0800369",phase:1,not_mcu:!1},{title:"Fantastic Four",type:"movie",tmdbId:9738,imdbId:"tt0120667",imdbScore:5.7,phase:0,not_mcu:!0},{title:"X-Men: The Last Stand",type:"movie",tmdbId:36668,imdbId:"tt0376994",imdbScore:6.7,phase:0,not_mcu:!0},{title:"Fantastic Four: Rise of the Silver Surfer",type:"movie",tmdbId:1979,imdbId:"tt0486576",imdbScore:5.6,phase:0,not_mcu:!0},{title:"The Avengers",type:"movie",tmdbId:24428,imdbId:"tt0848228",phase:1,not_mcu:!1},{title:"X-Men Origins: Wolverine",type:"movie",tmdbId:2080,imdbId:"tt0458525",imdbScore:6.5,phase:0,not_mcu:!0},{title:"X-Men: First Class",type:"movie",tmdbId:49538,imdbId:"tt1270797",imdbScore:7.7,phase:0,not_mcu:!0},{title:"Item 47 (One-Shot)",type:"one-shot",tmdbId:119569,imdbId:"tt2247732",phase:2,not_mcu:!1},{title:"The Wolverine",type:"movie",tmdbId:76170,imdbId:"tt1430132",imdbScore:6.2,phase:0,not_mcu:!0},{title:"Agents of S.H.I.E.L.D. (S1, E1-7)",type:"tv",tmdbId:1403,imdbId:"tt2364582",phase:2,not_mcu:!1},{title:"Thor: The Dark World",type:"movie",tmdbId:76338,imdbId:"tt1981115",phase:2,not_mcu:!1},{title:"Agents of S.H.I.E.L.D. (S1, E8-16)",type:"tv",tmdbId:1403,imdbId:"tt2364582",phase:2,not_mcu:!1},{title:"Iron Man 3",type:"movie",tmdbId:68721,imdbId:"tt1300854",phase:2,not_mcu:!1},{title:"All Hail the King (One-Shot)",type:"one-shot",tmdbId:253980,imdbId:"tt3438640",phase:2,not_mcu:!1},{title:"Captain America: The Winter Soldier",type:"movie",tmdbId:100402,imdbId:"tt1843866",phase:2,not_mcu:!1},{title:"Agents of S.H.I.E.L.D. (S1, E17-22)",type:"tv",tmdbId:1403,imdbId:"tt2364582",phase:2,not_mcu:!1},{title:"X-Men: Days of Future Past",type:"movie",tmdbId:127585,imdbId:"tt1877832",imdbScore:7.9,phase:0,not_mcu:!0},{title:"Guardians of the Galaxy",type:"movie",tmdbId:118340,imdbId:"tt2015381",phase:2,not_mcu:!1},{title:"Guardians of the Galaxy Vol. 2",type:"movie",tmdbId:283995,imdbId:"tt3896198",phase:2,not_mcu:!1},{title:"I Am Groot (S1 & S2)",type:"tv",tmdbId:232125,imdbId:"tt13623148",phase:2,not_mcu:!1},{title:"Fantastic Four",type:"movie",tmdbId:166424,imdbId:"tt1502712",imdbScore:4.3,phase:0,not_mcu:!0},{title:"Daredevil (S1)",type:"tv",tmdbId:61889,imdbId:"tt3322312",phase:2,not_mcu:!1},{title:"Agents of S.H.I.E.L.D. (S2, E1-10)",type:"tv",tmdbId:1403,imdbId:"tt2364582",phase:2,not_mcu:!1},{title:"Jessica Jones (S1)",type:"tv",tmdbId:38472,imdbId:"tt2357547",phase:2,not_mcu:!1},{title:"Agents of S.H.I.E.L.D. (S2, E11-19)",type:"tv",tmdbId:1403,imdbId:"tt2364582",phase:2,not_mcu:!1},{title:"Avengers: Age of Ultron",type:"movie",tmdbId:99861,imdbId:"tt2395427",phase:2,not_mcu:!1},{title:"Agents of S.H.I.E.L.D. (S2, E20-22)",type:"tv",tmdbId:1403,imdbId:"tt2364582",phase:2,not_mcu:!1},{title:"Ant-Man",type:"movie",tmdbId:102899,imdbId:"tt0478970",phase:2,not_mcu:!1},{title:"Deadpool",type:"movie",tmdbId:293660,imdbId:"tt1431045",imdbScore:8,phase:0,not_mcu:!0},{title:"Daredevil (S2)",type:"tv",tmdbId:61889,imdbId:"tt3322312",phase:2,not_mcu:!1},{title:"X-Men: Apocalypse",type:"movie",tmdbId:246655,imdbId:"tt3385516",imdbScore:6.9,phase:0,not_mcu:!0},{title:"Luke Cage (S1)",type:"tv",tmdbId:62126,imdbId:"tt3322314",phase:2,not_mcu:!1},{title:"Agents of S.H.I.E.L.D. (S3, E1-19)",type:"tv",tmdbId:1403,imdbId:"tt2364582",phase:3,not_mcu:!1},{title:"Iron Fist (S1)",type:"tv",tmdbId:62127,imdbId:"tt3322310",phase:3,not_mcu:!1},{title:"Captain America: Civil War",type:"movie",tmdbId:271110,imdbId:"tt3498820",phase:3,not_mcu:!1},{title:"Team Thor (One-Shot)",type:"one-shot",tmdbId:413279,imdbId:"tt6016776",phase:3,not_mcu:!1},{title:"Team Thor: Part 2 (One-Shot)",type:"one-shot",tmdbId:441829,imdbId:"tt6598232",phase:3,not_mcu:!1},{title:"Black Widow",type:"movie",tmdbId:497698,imdbId:"tt3480822",phase:3,not_mcu:!1},{title:"Agents of S.H.I.E.L.D. (S3, E20-22)",type:"tv",tmdbId:1403,imdbId:"tt2364582",phase:3,not_mcu:!1},{title:"The Defenders (S1)",type:"tv",tmdbId:62285,imdbId:"tt4230076",phase:3,not_mcu:!1},{title:"Logan",type:"movie",tmdbId:263115,imdbId:"tt3315342",imdbScore:8.1,phase:0,not_mcu:!0},{title:"Agents of S.H.I.E.L.D. (S4, E1-6)",type:"tv",tmdbId:1403,imdbId:"tt2364582",phase:3,not_mcu:!1},{title:"Doctor Strange",type:"movie",tmdbId:284052,imdbId:"tt1211837",phase:3,not_mcu:!1},{title:"Black Panther",type:"movie",tmdbId:284054,imdbId:"tt1825683",phase:3,not_mcu:!1},{title:"Agents of S.H.I.E.L.D. (S4, E7-8)",type:"tv",tmdbId:1403,imdbId:"tt2364582",phase:3,not_mcu:!1},{title:"Agents of S.H.I.E.L.D.: Slingshot",type:"tv",tmdbId:69088,imdbId:"tt6246992",phase:3,not_mcu:!1},{title:"Agents of S.H.I.E.L.D. (S4, E9-22)",type:"tv",tmdbId:1403,imdbId:"tt2364582",phase:3,not_mcu:!1},{title:"Spider-Man: Homecoming",type:"movie",tmdbId:315635,imdbId:"tt2250912",phase:3,not_mcu:!1},{title:"Thor: Ragnarok",type:"movie",tmdbId:284053,imdbId:"tt3501632",phase:3,not_mcu:!1},{title:"Team Darryl (One-Shot)",type:"one-shot",tmdbId:505945,imdbId:"tt7940558",phase:3,not_mcu:!1},{title:"Inhumans (S1)",type:"tv",tmdbId:68716,imdbId:"tt4154858",phase:3,not_mcu:!1},{title:"The Punisher (S1)",type:"tv",tmdbId:67178,imdbId:"tt5675620",phase:3,not_mcu:!1},{title:"Runaways (S1)",type:"tv",tmdbId:67466,imdbId:"tt1236246",phase:3,not_mcu:!1},{title:"Agents of S.H.I.E.L.D. (S5, E1-10)",type:"tv",tmdbId:1403,imdbId:"tt2364582",phase:3,not_mcu:!1},{title:"Jessica Jones (S2)",type:"tv",tmdbId:38472,imdbId:"tt2357547",phase:3,not_mcu:!1},{title:"Deadpool 2",type:"movie",tmdbId:383498,imdbId:"tt5463162",imdbScore:7.7,phase:0,not_mcu:!0},{title:"Agents of S.H.I.E.L.D. (S5, E11-18)",type:"tv",tmdbId:1403,imdbId:"tt2364582",phase:3,not_mcu:!1},{title:"Cloak & Dagger (S1 & S2)",type:"tv",tmdbId:66190,imdbId:"tt5614844",phase:3,not_mcu:!1},{title:"Luke Cage (S2)",type:"tv",tmdbId:62126,imdbId:"tt3322314",phase:3,not_mcu:!1},{title:"Iron Fist (S2)",type:"tv",tmdbId:62127,imdbId:"tt3322310",phase:3,not_mcu:!1},{title:"Daredevil (S3)",type:"tv",tmdbId:61889,imdbId:"tt3322312",phase:3,not_mcu:!1},{title:"Runaways (S2)",type:"tv",tmdbId:67466,imdbId:"tt1236246",phase:3,not_mcu:!1},{title:"The Punisher (S2)",type:"tv",tmdbId:67178,imdbId:"tt5675620",phase:3,not_mcu:!1},{title:"Jessica Jones (S3)",type:"tv",tmdbId:38472,imdbId:"tt2357547",phase:3,not_mcu:!1},{title:"X-Men: Dark Phoenix",type:"movie",tmdbId:320288,imdbId:"tt6565702",imdbScore:5.7,phase:0,not_mcu:!0},{title:"Ant-Man and the Wasp",type:"movie",tmdbId:363088,imdbId:"tt5095030",phase:3,not_mcu:!1},{title:"Avengers: Infinity War",type:"movie",tmdbId:299536,imdbId:"tt4154756",phase:3,not_mcu:!1},{title:"Agents of S.H.I.E.L.D. (S5 - S7)",type:"tv",tmdbId:1403,imdbId:"tt2364582",phase:4,not_mcu:!1},{title:"Runaways (S3)",type:"tv",tmdbId:67466,imdbId:"tt1236246",phase:4,not_mcu:!1},{title:"Avengers: Endgame",type:"movie",tmdbId:299534,imdbId:"tt4154796",phase:4,not_mcu:!1},{title:"Spider-Man: Far From Home",type:"movie",tmdbId:429617,imdbId:"tt6320628",phase:4,not_mcu:!1},{title:"The New Mutants",type:"movie",tmdbId:340102,imdbId:"tt4682266",imdbScore:5.3,phase:0,not_mcu:!0},{title:"WandaVision",type:"tv",tmdbId:85271,imdbId:"tt9140560",phase:4,not_mcu:!1},{title:"The Falcon and the Winter Soldier",type:"tv",tmdbId:88396,imdbId:"tt9208876",phase:4,not_mcu:!1},{title:"Loki (S1)",type:"tv",tmdbId:84958,imdbId:"tt9140554",phase:4,not_mcu:!1},{title:"What If...? (S1)",type:"tv",tmdbId:91363,imdbId:"tt10168312",phase:4,not_mcu:!1},{title:"Shang-Chi and the Legend of the Ten Rings",type:"movie",tmdbId:566525,imdbId:"tt9376612",phase:4,not_mcu:!1},{title:"Eternals",type:"movie",tmdbId:524434,imdbId:"tt9032400",phase:4,not_mcu:!1},{title:"Hawkeye",type:"tv",tmdbId:88329,imdbId:"tt10160804",phase:4,not_mcu:!1},{title:"Spider-Man: No Way Home",type:"movie",tmdbId:634649,imdbId:"tt10872600",phase:4,not_mcu:!1},{title:"Moon Knight",type:"tv",tmdbId:92749,imdbId:"tt10234724",phase:4,not_mcu:!1},{title:"Doctor Strange in the Multiverse of Madness",type:"movie",tmdbId:453395,imdbId:"tt9419884",phase:4,not_mcu:!1},{title:"Ms. Marvel",type:"tv",tmdbId:92782,imdbId:"tt10857164",phase:4,not_mcu:!1},{title:"Thor: Love and Thunder",type:"movie",tmdbId:616037,imdbId:"tt10648342",phase:4,not_mcu:!1},{title:"She-Hulk: Attorney at Law",type:"tv",tmdbId:92783,imdbId:"tt10857160",phase:4,not_mcu:!1},{title:"Werewolf by Night",type:"movie",tmdbId:894205,imdbId:"tt15318878",phase:4,not_mcu:!1},{title:"Black Panther: Wakanda Forever",type:"movie",tmdbId:505642,imdbId:"tt9114286",phase:4,not_mcu:!1},{title:"The Guardians of the Galaxy Holiday Special",type:"movie",tmdbId:774752,imdbId:"tt13623136",phase:4,not_mcu:!1},{title:"Ant-Man and the Wasp: Quantumania",type:"movie",tmdbId:640146,imdbId:"tt10954600",phase:5,not_mcu:!1},{title:"Guardians of the Galaxy Vol. 3",type:"movie",tmdbId:447365,imdbId:"tt6791350",phase:5,not_mcu:!1},{title:"Secret Invasion",type:"tv",tmdbId:114472,imdbId:"tt13157618",phase:5,not_mcu:!1},{title:"Loki (S2)",type:"tv",tmdbId:84958,imdbId:"tt9140554",phase:5,not_mcu:!1},{title:"The Marvels",type:"movie",tmdbId:609681,imdbId:"tt10676048",phase:5,not_mcu:!1},{title:"What If…? Season 2",type:"tv",tmdbId:91363,imdbId:"tt10168312",phase:5,not_mcu:!1},{title:"Echo",type:"tv",tmdbId:122226,imdbId:"tt13966962",phase:5,not_mcu:!1},{title:"Deadpool & Wolverine",type:"movie",tmdbId:533535,imdbId:"tt6263850",imdbScore:7.7,phase:0,not_mcu:!0},{title:"Agatha All Along",type:"tv",tmdbId:138501,imdbId:"tt14552042",phase:5,not_mcu:!1},{title:"Ironheart",type:"tv",tmdbId:114471,imdbId:"tt13622776",phase:5,not_mcu:!1},{title:"Daredevil: Born Again",type:"tv",tmdbId:202555,imdbId:"tt20934948",phase:5,not_mcu:!1},{title:"What If…? Season 3",type:"tv",tmdbId:91363,imdbId:"tt10168312",phase:5,not_mcu:!1},{title:"Captain America: Brave New World",type:"movie",tmdbId:822119,imdbId:"tt14510208",phase:5,not_mcu:!1},{title:"Thunderbolts",type:"movie",tmdbId:986056,imdbId:"tt20969586",phase:5,not_mcu:!1},{title:"The Fantastic Four: First Steps",type:"movie",tmdbId:617126,imdbId:"tt10676052",phase:6,not_mcu:!1},{title:"Spider-Man: Brand New Day",type:"movie",tmdbId:969681,imdbId:"tt22084616",phase:6,not_mcu:!1},{title:"Avengers: Doomsday",type:"movie",tmdbId:1003596,imdbId:"tt21357150",phase:6,not_mcu:!1},{title:"Avengers: Secret Wars",type:"movie",tmdbId:1003598,imdbId:"tt21361444",phase:6,not_mcu:!1}];async function oa(){tt&&tt();const n=j(O,"marathon-data",ze);tt=vt(n,e=>{e.exists()&&e.data().items&&e.data().items.length>=De.length?(m=e.data(),he(),Ae&&(clearInterval(Ae),Ae=null),document.getElementById("loading-spinner").style.display="none"):dt||zn(n)},e=>{console.error("Error listening to marathon state:",e),document.getElementById("loading-spinner").innerText="Error fetching data."})}async function zn(n){dt=!0,document.getElementById("loading-spinner").style.display="flex",console.log("INITIALIZING MARATHON! Force Refresh: "+shouldRefreshCache);const e=await Promise.all(De.map(s=>Kn(s,shouldRefreshCache))),t={items:De.map((s,i)=>{const a=e[i]||{};let o=0;return a.runtime?o=a.runtime:Array.isArray(a.episode_run_time)&&a.episode_run_time.length>0?o=a.episode_run_time[0]:s.type==="one-shot"?o=10:o=45,{id:i,tmdbId:s.tmdbId||null,imdbId:s.imdbId||null,title:s.title,type:s.type,not_mcu:s.not_mcu||!1,phase:s.phase||null,poster_path:a.poster_path||null,backdrop_path:a.backdrop_path||null,release_date:a.release_date||a.first_air_date||"N/A",runtime:o,vote_average:a.vote_average||0,overview:a.overview||"No overview available.",watched:!1,rejected:!1,ratings:{user1:null,user2:null},notes:{user1:"",user2:""},jarvisSummary:null,nextUpHype:null,favoritedBy:[]}})};try{const s={...t,authKey:ye};await ce(n,s),console.log("Successfully initialized new marathon data."),shouldRefreshCache&&(window.location.href=window.location.pathname)}catch(s){console.error("Firebase setDoc failed:",s),document.getElementById("loading-spinner").innerHTML=`Failed to save initial data. <br>Error: ${s.message}. <br>Please check console for details.`}dt=!1}async function Kn(n,e=!1){if(!n.tmdbId)return{title:n.title,runtime:10};const t=j(O,"tmdb-cache",`${n.tmdbId}`);if(!e)try{const i=await ln(t);if(i.exists())return i.data()}catch(i){console.error("Cache read failed:",i)}const s=await ca(n.tmdbId,n.type);if(s)try{const i={...s,authKey:ye};await ce(t,i)}catch(i){console.error("Cache write failed:",i)}return s}async function ca(n,e){const s=`https://api.themoviedb.org/3/${e==="movie"||e==="one-shot"?"movie":"tv"}/${n}?api_key=${kt}`;try{const i=await fetch(s);return i.ok?await i.json():null}catch{return null}}async function la(n,e){const s=`https://api.themoviedb.org/3/${e==="movie"||e==="one-shot"?"movie":"tv"}/${n}/images?api_key=${kt}`;try{const i=await fetch(s);return i.ok?await i.json():null}catch{return null}}async function da(n){const e=`https://api.themoviedb.org/3/movie/${n}/release_dates?api_key=${kt}`;try{const t=await fetch(e);return t.ok?await t.json():null}catch{return null}}async function A(){if(!Z)return;const n=j(O,"marathon-data",ze),e={...m,authKey:ye};await ce(n,e,{merge:!0})}function he(){if(!m||!m.items)return;let n=m.items;T==="movie"?n=n.filter(t=>t.type==="movie"):T==="tv"&&(n=n.filter(t=>["tv","one-shot"].includes(t.type))),T!=="tv"&&!J&&(n=n.filter(t=>!t.not_mcu));const e=n;qn==="grid"?(ua(e),document.getElementById("movie-grid").classList.remove("hidden"),document.getElementById("movie-list").classList.add("hidden")):(ha(e),document.getElementById("movie-grid").classList.add("hidden"),document.getElementById("movie-list").classList.remove("hidden")),At(),p.nextUpWallpaperEnabled&&Ie()}function ua(n){const e=document.getElementById("movie-grid");e.innerHTML=n.map(t=>{const s=t.poster_path?`https://image.tmdb.org/t/p/w500${t.poster_path}`:`https://placehold.co/500x750/1f2937/ef4444?text=${encodeURIComponent(t.title)}`;let i="";t.watched?i="watched":t.rejected&&(i="rejected");let r="";t.watched?r="fa-check-circle text-green-500":t.rejected&&(r="fa-times-circle text-red-500");let a="";t.favoritedBy?t.favoritedBy.includes("user1")&&t.favoritedBy.includes("user2")?a="super-favorite-glow glossy-overlay":t.favoritedBy.length>0&&(a="favorite-glow"):a="";let o="";if(t.moods){const c=t.moods.user1,l=t.moods.user2;c&&(o+=`<div class="mood-emoji-container" data-user="Juainny" data-mood="${c.name}" data-movie="${t.title}"><img src="/moods/${c.image}" alt="${c.name}" class="w-8 h-8"></div>`),l&&(o+=`<div class="mood-emoji-container" data-user="Erick" data-mood="${l.name}" data-movie="${t.title}"><img src="/moods/${l.image}" alt="${l.name}" class="w-8 h-8"></div>`)}return`
                    <div data-item-id="${t.id}" class="movie-card relative rounded-lg overflow-hidden cursor-pointer shadow-lg transition-transform duration-200 ${i} ${a}" onclick="openModal(${t.id})">
                        <div class="emoji-banner absolute top-0 left-0 w-full h-12 bg-transparent z-10 flex justify-between items-center px-2">${o}</div>
                        <img src="${s}" alt="${t.title}" class="w-full h-full object-cover" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/500x750/1f2937/ef4444?text=No+Poster';">
                        <div class="absolute inset-0 bg-black bg-opacity-50" style="opacity: ${t.watched||t.rejected?.7:0}; transition: opacity 0.3s;"></div>
                        <div class="status-overlay absolute inset-0 flex justify-center items-center">
                            <i class="fas ${r} fa-4x"></i>
                        </div>
                        ${t.poster_path?"":`
                         <div class="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                            <h3 class="font-bold text-sm text-white text-shadow-lg">${t.title}</h3>
                        </div>`}
                    </div>`}).join("")}function ha(n){const e=document.getElementById("movie-list");e.innerHTML=n.map(t=>{const s=t.ratings&&Object.values(t.ratings).filter(o=>o!==null).reduce((o,c)=>o+c,0)/Object.values(t.ratings).filter(o=>o!==null).length||0;let i="";for(let o=1;o<=10;o++)s>=o?i+='<i class="fa-solid fa-star"></i>':s===o-.5?i+='<i class="fa-solid fa-star-half-alt"></i>':i+='<i class="fa-regular fa-star"></i>';let r="opacity-100";t.watched&&(r="opacity-50"),t.rejected&&(r="opacity-50 rejected-list-item");let a="";return t.favoritedBy?t.favoritedBy.includes("user1")&&t.favoritedBy.includes("user2")?a="super-favorite-glow glossy-overlay":t.favoritedBy.length>0&&(a="favorite-glow"):a="",`
                <div data-item-id="${t.id}" class="bg-gray-800 rounded-lg p-3 flex items-center gap-4 transition-opacity ${r} ${a}">
                    <div class="flex-shrink-0 w-10 text-center">
                        <input type="checkbox" ${t.watched?"checked":""} ${t.rejected?"disabled":""} class="w-6 h-6 rounded bg-gray-700 border-gray-600 text-red-600 focus:ring-red-500 cursor-pointer" onchange="toggleWatchedStatus(${t.id}, this.checked)">
                    </div>
                    <div class="flex-grow">
                        <p class="font-bold">${t.rejected?`<s>${t.title}</s>`:t.title}</p>
                        <p class="text-sm text-gray-400">${t.type.replace("-"," ").replace(/\b\w/g,o=>o.toUpperCase())}</p>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="star-container text-lg" title="Average Rating: ${s.toFixed(1)}">${i}</div>
                        <button class="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm font-semibold" onclick="openModal(${t.id})">Details</button>
                    </div>
                </div>`}).join("")}function At(){if(!m.items||m.items.length===0)return;const n=m.items.filter(r=>T==="all"?!0:T==="tv"?["tv","one-shot"].includes(r.type):r.type===T),e=n.filter(r=>r.watched),t=n.reduce((r,a)=>r+(a.runtime||0),0),s=e.reduce((r,a)=>r+(a.runtime||0),0),i=n.length>0?Math.round(e.length/n.length*100):0;document.getElementById("hours-watched").textContent=Be(s),document.getElementById("hours-left").textContent=Be(t-s),document.getElementById("movies-watched").textContent=`${e.length} / ${n.length}`,document.getElementById("progress-bar").style.width=`${i}%`,document.getElementById("progress-percent").textContent=`${i}%`,ut(n),ma(n),p.nextUpWallpaperEnabled&&Ie()}function ut(n){let e=n.filter(r=>!r.watched&&!r.rejected);T==="movie"?e=e.filter(r=>r.type==="movie"):T==="tv"&&(e=e.filter(r=>["tv","one-shot"].includes(r.type))),J||(e=e.filter(r=>!r.not_mcu));const t=e[0],s=document.getElementById("next-up-teaser"),i=document.getElementById("next-up-hype");if(t){if(se=t.id,nt===se)return;nt=se;const r=t.poster_path?`https://image.tmdb.org/t/p/w500${t.poster_path}`:`https://placehold.co/500x750/1f2937/ef4444?text=${encodeURIComponent(t.title)}`;if(document.getElementById("next-up-poster").src=r,document.getElementById("next-up-title").textContent=t.title,document.getElementById("next-up-runtime").textContent=Be(t.runtime||0),p.aiDisabled){i.textContent=t.overview,document.getElementById("next-up-refresh-btn").style.display="none",document.querySelector('#next-up-teaser img[alt="Jarvis"]').style.display="none",s.classList.remove("hidden");return}else document.querySelector('#next-up-teaser img[alt="Jarvis"]').style.display="inline-block";const a=async(l=!1)=>{i.innerHTML="Jarvis is thinking...";const d=await sa(t,l);i.innerHTML=mt(d)};a();const o=document.getElementById("next-up-refresh-btn");let c=!1;o.onclick=l=>{if(l.stopPropagation(),c){i.textContent="Jarvis is cooling down...";return}a(!0),p.quotaConservation||(c=!0,setTimeout(()=>{c=!1},2e3))},o.style.display="inline-block",s.classList.remove("hidden")}else se=null,nt=null,s.classList.add("hidden")}function ma(n){const e=document.getElementById("extended-stats"),t={};for(const s in Zt){const i=Zt[s],r=n.filter(c=>i.includes(c.title)),a=r.filter(c=>c.watched),o=r.length>0?Math.round(a.length/r.length*100):0;r.length>0&&(t[s]={percentage:o,watched:a.length,total:r.length})}e.innerHTML=Object.entries(t).map(([s,i])=>`
                <div class="mb-4">
                    <div class="flex justify-between items-center mb-1">
                        <span class="font-semibold text-text-primary">Phase ${s}</span>
                        <span class="text-sm text-text-muted">${i.watched} / ${i.total}</span>
                    </div>
                    <div class="w-full bg-bg-tertiary rounded-full h-2.5">
                        <div class="bg-accent-primary h-2.5 rounded-full" style="width: ${i.percentage}%"></div>
                    </div>
                </div>
            `).join("")}function Be(n){if(isNaN(n)||n<0)return"0h 0m";const e=Math.floor(n/60),t=n%60;return`${e}h ${t}m`}const v={modal:document.getElementById("movie-modal"),backdrop:document.getElementById("modal-backdrop-image"),logoContainer:document.getElementById("modal-logo-container"),title:document.getElementById("modal-title"),releaseYear:document.getElementById("modal-release-year"),contentRating:document.getElementById("modal-content-rating"),runtime:document.getElementById("modal-runtime"),overview:document.getElementById("modal-overview"),imdbLink:document.getElementById("modal-imdb-link"),score:document.getElementById("modal-score"),toggleWatchedBtn:document.getElementById("toggle-watched-btn"),toggleRejectedBtn:document.getElementById("toggle-rejected-btn"),juainnyRating:document.getElementById("juainny-rating"),erickRating:document.getElementById("erick-rating"),removeRatingBtn:document.getElementById("remove-rating-btn"),notesSection:document.getElementById("notes-section"),juainnyNotes:document.getElementById("juainny-notes"),erickNotes:document.getElementById("erick-notes"),jarvisSection:document.getElementById("jarvis-summary-section"),jarvisSummaryText:document.getElementById("jarvis-summary-text"),addMoodBtn:document.getElementById("add-mood-btn"),moodDisplay:document.getElementById("modal-mood-display"),favoriteBtn:document.getElementById("favorite-btn")};function pa(){return window.innerWidth-document.documentElement.clientWidth}window.closeModal=()=>{document.body.style.paddingRight="",document.body.classList.remove("body-no-scroll"),v.modal.classList.add("modal-hidden"),b=null};window.openModal=async n=>{b=n;const e=m.items.find(d=>d.id===n);if(!e)return;const[t,s]=await Promise.all([la(e.tmdbId,e.type),e.type==="movie"?da(e.tmdbId):Promise.resolve(null)]),r=t?.logos?.find(d=>d.iso_639_1==="en")||t?.logos?.[0],o=s?.results?.find(d=>d.iso_3166_1==="US")?.release_dates[0]?.certification||"N/A",c=e.backdrop_path?`https://image.tmdb.org/t/p/w1280${e.backdrop_path}`:"https://placehold.co/1280x720/111827/ef4444?text=Image+Not+Found";((d,y)=>{const g=new Image;g.src=d,g.onload=()=>y(g),g.onerror=()=>y(null)})(c,d=>{requestAnimationFrame(()=>{if(v.backdrop.src=d?c:"https://placehold.co/1280x720/111827/ef4444?text=Image+Not+Found",v.title.textContent=e.title,r){const _=`https://image.tmdb.org/t/p/original${r.file_path}`;v.logoContainer.innerHTML=`<img src="${_}" alt="${e.title} Logo" class="max-h-24" style="filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.9));">`,v.title.classList.add("hidden")}else v.logoContainer.innerHTML="",v.title.classList.remove("hidden");v.releaseYear.textContent=(e.release_date||"N/A").split("-")[0],v.runtime.textContent=Be(e.runtime||0),v.contentRating.textContent=o,document.getElementById("title-tooltip").setAttribute("title",e.title),v.overview.textContent=e.overview||"No overview available.",v.imdbLink.href=`https://www.imdb.com/title/${e.imdbId}/`,v.score.textContent=e.vote_average?`${e.vote_average.toFixed(1)} / 10`:"N/A",v.toggleWatchedBtn.textContent=e.watched?"Unwatch":"Mark as Watched",v.toggleWatchedBtn.className=`w-full text-text-primary font-bold py-3 px-4 rounded-lg transition ${e.watched?"bg-yellow-600 hover:bg-yellow-700":"bg-success hover:opacity-80"}`,v.toggleRejectedBtn.innerHTML=e.rejected?"Undo Reject":'<i class="fas fa-times"></i>',v.toggleRejectedBtn.className=`w-[30%] text-text-primary font-bold py-3 px-4 rounded-lg transition ${e.rejected?"bg-bg-tertiary hover:opacity-80":"bg-danger hover:opacity-80"}`,e.ratings||(e.ratings={user1:null,user2:null}),ht("juainny-rating",e.ratings.user1),ht("erick-rating",e.ratings.user2),document.getElementById("juainny-rating-input").value=e.ratings.user1,document.getElementById("erick-rating-input").value=e.ratings.user2,v.removeRatingBtn.classList.toggle("hidden",!e.ratings.user1&&!e.ratings.user2),document.getElementById("remove-mood-btn").classList.toggle("hidden",!e.moods||!e.moods.user1&&!e.moods.user2),e.watched?(v.notesSection.classList.remove("hidden"),v.juainnyNotes.value=e.notes?.user1||"",v.erickNotes.value=e.notes?.user2||"",p.aiDisabled?v.jarvisSection.classList.add("hidden"):(v.jarvisSection.classList.remove("hidden"),en(e),document.getElementById("jarvis-summary-refresh-btn").onclick=()=>{en(e,!0)})):(v.notesSection.classList.add("hidden"),v.jarvisSection.classList.add("hidden")),ga(e),Ta(e);const g=pa();document.body.style.paddingRight=`${g}px`,document.body.classList.add("body-no-scroll"),v.modal.classList.remove("hidden"),v.modal.classList.remove("modal-hidden")})})};async function en(n,e=!1){const t=document.getElementById("jarvis-summary-text");if(!t)return;if(!e&&n.jarvisSummary){t.innerHTML=mt(n.jarvisSummary);return}t.innerHTML="<i>Jarvis is thinking...</i>";const s=await aa(n.title,n.ratings,n.notes,n.moods),i=m.items.findIndex(r=>r.id===n.id);i>-1&&(m.items[i].jarvisSummary=s,A()),t.innerHTML=mt(s)}window.closeModal=()=>{document.body.classList.remove("body-no-scroll"),v.modal.classList.add("modal-hidden"),b=null};function Jn(n){const e=document.querySelector(`.movie-card[data-item-id="${n.id}"]`);if(e){const t=n.watched?"watched":n.rejected?"rejected":"";e.className=`movie-card relative rounded-lg overflow-hidden cursor-pointer shadow-lg transition-transform duration-200 ${t}`;const s=e.querySelector(".bg-black");s.style.opacity=n.watched||n.rejected?.7:0;const i=e.querySelector(".status-overlay i");i.className=`fas ${n.watched?"fa-check-circle text-green-500":"fa-times-circle text-red-500"} fa-4x`}}window.toggleWatchedStatus=(n,e,t=!1)=>{const s=m.items.findIndex(i=>i.id===n);if(s>-1){const i=m.items[s];i.watched=typeof e=="boolean"?e:!i.watched,i.watched?(i.rejected=!1,i.watched_timestamp=new Date().toISOString()):i.watched_timestamp=null,Jn(i),At(),document.getElementById("save-banner").classList.remove("hidden"),t?openModal(n):b===n&&closeModal()}};window.toggleRejectedStatus=n=>{const e=m.items.findIndex(t=>t.id===n);if(e>-1){const t=m.items[e];t.rejected=!t.rejected,t.rejected&&(t.watched=!1),Jn(t),At(),A(),b===n&&closeModal()}};function ht(n,e){const t=document.getElementById(n);if(!t){console.error(`[updateRatingStars] Container with id "${n}" not found.`);return}t.innerHTML="";const s=document.createElement("div");s.className="star-container";for(let i=1;i<=10;i++){const r=document.createElement("i");r.dataset.value=i,e>=i?r.className="fa-solid fa-star star filled":e===i-.5?r.className="fa-solid fa-star-half-alt star half-filled":r.className="fa-regular fa-star star",window.innerWidth<768&&r.classList.add("text-sm"),s.appendChild(r)}t.appendChild(s)}function te(n,e){if(b===null)return;const t=m.items.findIndex(s=>s.id===b);if(t>-1){const s=m.items[t];s.ratings||(s.ratings={user1:null,user2:null});const i=e;s.ratings[n]=i,s.jarvisSummary=null,i!==null&&(s.watched=!0);const r=n==="user1"?"juainny-rating":"erick-rating",a=n==="user1"?"juainny-rating-input":"erick-rating-input";ht(r,e),document.getElementById(a).value=e,document.getElementById("remove-rating-btn").classList.toggle("hidden",!s.ratings.user1&&!s.ratings.user2),A()}}function tn(n){n&&n.style.display!=="none"&&(n.style.height="auto",n.style.height=n.scrollHeight+"px")}document.addEventListener("DOMContentLoaded",()=>{v.modal.addEventListener("transitionend",()=>{v.modal.classList.contains("modal-hidden")&&v.modal.classList.add("hidden")}),document.getElementById("close-modal-btn").addEventListener("click",closeModal),document.getElementById("movie-modal").addEventListener("click",u=>{u.target.id==="movie-modal"&&closeModal()}),document.getElementById("toggle-watched-btn").addEventListener("click",()=>toggleWatchedStatus(b,!m.items.find(u=>u.id===b).watched,!0)),document.getElementById("toggle-rejected-btn").addEventListener("click",()=>toggleRejectedStatus(b)),document.getElementById("juainny-rating").addEventListener("click",u=>{const h=u.target.closest(".star");if(h){const I=h.getBoundingClientRect(),E=u.clientX-I.left,L=parseInt(h.dataset.value),w=E<I.width/2?L-.5:L;te("user1",w)}}),document.getElementById("erick-rating").addEventListener("click",u=>{const h=u.target.closest(".star");if(h){const I=h.getBoundingClientRect(),E=u.clientX-I.left,L=parseInt(h.dataset.value),w=E<I.width/2?L-.5:L;te("user2",w)}}),document.getElementById("juainny-rating-input").addEventListener("change",u=>{te("user1",parseFloat(u.target.value))}),document.getElementById("erick-rating-input").addEventListener("change",u=>{te("user2",parseFloat(u.target.value))}),document.getElementById("remove-rating-btn").addEventListener("click",()=>{te("user1",null),te("user2",null)}),document.getElementById("remove-mood-btn").addEventListener("click",()=>{if(b!==null){const u=m.items.findIndex(h=>h.id===b);u>-1&&(m.items[u].moods={},A(),openModal(b))}}),document.getElementById("filter-controls").addEventListener("click",u=>{const h=u.target.closest(".filter-btn");if(h){document.querySelector(".filter-btn.btn-active").classList.remove("btn-active"),h.classList.add("btn-active"),T=h.dataset.filter;const I=document.getElementById("non-mcu-filter-btn");I.style.display=T==="tv"?"none":"block",he()}});const n=document.getElementById("non-mcu-filter-btn");n.classList.toggle("btn-active",J),n.addEventListener("click",u=>{J=!J,u.currentTarget.classList.toggle("btn-active",J),he()}),document.getElementById("view-controls").addEventListener("click",u=>{if(u.target.closest(".view-btn")){const h=u.target.closest(".view-btn");document.querySelector(".view-btn.btn-active").classList.remove("btn-active"),h.classList.add("btn-active"),qn=h.dataset.view,he()}}),document.getElementById("random-movie-btn").addEventListener("click",()=>{const u=m.items.filter(h=>!h.watched);if(u.length>0){const h=document.getElementById("random-movie-btn");h.disabled=!0;let I=0;const E=10,L=setInterval(()=>{const w=u[Math.floor(Math.random()*u.length)];if(document.getElementById("next-up-poster").src=w.poster_path?`https://image.tmdb.org/t/p/w500${w.poster_path}`:`https://placehold.co/500x750/1f2937/ef4444?text=${encodeURIComponent(w.title)}`,document.getElementById("next-up-title").textContent=w.title,I++,I>=E){clearInterval(L);const k=u[Math.floor(Math.random()*u.length)];openModal(k.id),h.disabled=!1}},100)}}),document.getElementById("extend-stats-btn").addEventListener("click",u=>{const h=document.getElementById("extended-stats"),I=u.currentTarget.querySelector("i");h.classList.toggle("hidden"),I.classList.toggle("rotate-180")}),document.getElementById("next-up-teaser").addEventListener("click",()=>{se!==null&&openModal(se)});const e=document.getElementById("juainny-notes"),t=document.getElementById("erick-notes");e.addEventListener("input",()=>tn(e)),t.addEventListener("input",()=>tn(t)),e.addEventListener("change",u=>{if(b===null)return;const h=m.items.findIndex(I=>I.id===b);h>-1&&(m.items[h].notes||(m.items[h].notes={user1:"",user2:""}),m.items[h].notes.user1=u.target.value,m.items[h].jarvisSummary=null,A())}),t.addEventListener("change",u=>{if(b===null)return;const h=m.items.findIndex(I=>I.id===b);h>-1&&(m.items[h].notes||(m.items[h].notes={user1:"",user2:""}),m.items[h].notes.user2=u.target.value,m.items[h].jarvisSummary=null,A())});const s=document.getElementById("user-menu-btn"),i=document.getElementById("user-menu"),r=document.getElementById("notification-btn"),a=document.getElementById("notification-modal"),o=document.getElementById("close-notification-modal-btn");s.addEventListener("click",()=>{i.classList.toggle("hidden")}),r.addEventListener("click",()=>{a.classList.remove("hidden"),a.classList.add("flex")}),window.closeNotificationModal=()=>{a.classList.add("hidden"),a.classList.remove("flex")},o.addEventListener("click",closeNotificationModal),document.getElementById("settings-btn").addEventListener("click",()=>{va(),i.classList.add("hidden")}),document.getElementById("close-settings-modal-btn").addEventListener("click",closeSettingsModal),document.getElementById("theme-picker").addEventListener("click",u=>{const h=u.target.closest(".theme-btn");if(h){const I=h.dataset.theme;ea(I)}});const c=new vs((u,h)=>{p.avatars||(p.avatars={}),p.avatars[u]=h,D({avatars:p.avatars})});window.avatarPicker=c,document.getElementById("avatar-picker-user1-btn").addEventListener("click",()=>{c.open()}),document.getElementById("avatar-picker-user2-btn").addEventListener("click",()=>{c.open()}),document.getElementById("movie-banner-select").addEventListener("change",ya),document.getElementById("remove-wallpaper-btn").addEventListener("click",Ia),document.getElementById("next-up-wallpaper-toggle").addEventListener("change",ba),document.getElementById("next-up-wallpaper-type").addEventListener("change",_a),document.getElementById("next-up-wallpaper-non-mcu").addEventListener("change",wa),document.getElementById("soft-refresh-btn").addEventListener("click",Lt),document.getElementById("emergency-refresh-btn").addEventListener("click",Yn),document.getElementById("favorite-btn").addEventListener("click",()=>{document.getElementById("user-selection-menu").classList.toggle("hidden")}),document.getElementById("user1-btn").addEventListener("click",()=>{nn("user1"),document.getElementById("user-selection-menu").classList.add("hidden")}),document.getElementById("user2-btn").addEventListener("click",()=>{nn("user2"),document.getElementById("user-selection-menu").classList.add("hidden")}),document.getElementById("remove-all-btn").addEventListener("click",()=>{const u=m.items.find(h=>h.id===b);u&&u.favoritedBy&&(u.favoritedBy=[]),A(),openModal(b),document.getElementById("user-selection-menu").classList.add("hidden")}),document.getElementById("mark-all-as-read-btn").addEventListener("click",()=>{Ke.forEach(u=>{u.unreadBy.includes(Z)||u.unreadBy.push(Z)}),Xn()}),document.getElementById("device-name-input").addEventListener("change",u=>{localStorage.setItem("deviceName",u.target.value),st()}),document.getElementById("reset-device-name-btn").addEventListener("click",()=>{localStorage.removeItem("deviceName"),st()}),document.getElementById("notification-filter-bar").addEventListener("click",u=>{const h=u.target.closest(".notification-filter-btn");h&&(document.querySelector(".notification-filter-btn.btn-active").classList.remove("btn-active"),h.classList.add("btn-active"),pt(h.dataset.filter))}),Qr(),Ea(),ka(),pt(),st();const g=document.getElementById("info-tooltip-icon"),_=document.getElementById("info-tooltip");g.addEventListener("mouseenter",()=>{_.classList.remove("hidden");const u=g.getBoundingClientRect();_.style.left=`${u.left}px`,_.style.top=`${u.bottom+5}px`}),g.addEventListener("mouseleave",()=>{_.classList.add("hidden")})});function mt(n){return n?n.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>"):""}async function fa(){const n=j(O,"notifications","main");vt(n,e=>{e.exists()&&(Ke=e.data().notifications,pt())})}async function Xn(){const n=j(O,"notifications","main");await ce(n,{notifications:Ke,authKey:ye},{merge:!0})}function pt(n="all"){const e=document.getElementById("notification-list"),t=document.getElementById("notification-count"),s=document.getElementById("unread-count");e.innerHTML="";let i=0;Ke.filter(a=>n==="all"?!0:a.type.startsWith(n)).forEach(a=>{const o=!a.unreadBy.includes(Z);o&&i++;const c=document.createElement("div");c.className=`notification-card ${o?"unread":""}`,c.dataset.id=a.id,c.innerHTML=`
            <div class="flex items-center">
                <div class="dot ${a.type}"></div>
                <h3 class="font-bold">${a.title}</h3>
                <button class="ml-auto text-xs text-accent-primary hover:underline mark-as-read-btn">${o?"Mark as read":"Mark as unread"}</button>
                <i class="fas fa-chevron-right arrow ml-4"></i>
            </div>
            <div class="summary">
                <p class="text-sm">${a.summary}</p>
            </div>
            <div class="description">
                <p class="text-sm">${a.description}</p>
            </div>
            <p class="text-xs text-text-muted mt-2">${a.date}</p>
        `,e.appendChild(c),c.addEventListener("click",l=>{if(l.target.classList.contains("mark-as-read-btn")){l.stopPropagation();const d=a.unreadBy.indexOf(Z);d>-1?a.unreadBy.splice(d,1):a.unreadBy.push(Z),Xn()}else c.classList.toggle("expanded")})}),i>0?(t.textContent=i,t.style.display="inline-flex",s.textContent=`${i} unread notifications`):(t.style.display="none",s.textContent="No unread notifications")}function st(){const n=localStorage.getItem("deviceName"),e=document.getElementById("device-name"),t=document.getElementById("device-name-input");n?(e.textContent=n,t.value=n):(e.textContent="User",t.value="")}function ga(n){n.favoritedBy||(n.favoritedBy=[]),n.favoritedBy.includes("user1")&&n.favoritedBy.includes("user2")?(v.favoriteBtn.classList.add("favorited"),v.favoriteBtn.querySelector("span").textContent="Favorited by Both"):n.favoritedBy.includes("user1")?(v.favoriteBtn.classList.add("favorited"),v.favoriteBtn.querySelector("span").textContent="Favorited by Juainny"):n.favoritedBy.includes("user2")?(v.favoriteBtn.classList.add("favorited"),v.favoriteBtn.querySelector("span").textContent="Favorited by Erick"):(v.favoriteBtn.classList.remove("favorited"),v.favoriteBtn.querySelector("span").textContent="Favorite")}function nn(n){if(b===null)return;const e=m.items.findIndex(t=>t.id===b);if(e>-1){const t=m.items[e];t.favoritedBy||(t.favoritedBy=[]);const s=t.favoritedBy.indexOf(n);if(s>-1)t.favoritedBy.splice(s,1);else{const i=m.items.find(r=>r.favoritedBy&&r.favoritedBy.includes(n));if(i){const r=i.favoritedBy.indexOf(n);i.favoritedBy.splice(r,1)}t.favoritedBy.push(n)}A(),openModal(b)}}document.getElementById("save-changes-banner-btn").addEventListener("click",()=>{A(),document.getElementById("save-banner").classList.add("hidden")});document.getElementById("discard-changes-banner-btn").addEventListener("click",()=>{Lt(),document.getElementById("save-banner").classList.add("hidden")});const Fe=document.getElementById("quota-conservation-toggle"),$e=document.getElementById("ai-disabled-toggle");Fe.addEventListener("change",()=>{Fe.checked&&($e.checked=!1)});$e.addEventListener("change",()=>{$e.checked&&(Fe.checked=!1)});document.getElementById("save-settings-btn").addEventListener("click",()=>{const n=document.getElementById("next-up-wallpaper-toggle"),e=document.getElementById("next-up-wallpaper-type"),t=document.getElementById("next-up-wallpaper-non-mcu"),s=document.getElementById("next-up-wallpaper-tv"),i={quotaConservation:Fe.checked,aiDisabled:$e.checked,nextUpWallpaperEnabled:n.checked,nextUpWallpaperType:e.value,nextUpWallpaperIncludeNonMCU:t.checked,nextUpWallpaperIncludeTV:s.checked};D(i),closeSettingsModal()});function va(){const n=document.getElementById("settings-modal"),e=document.getElementById("movie-banner-select"),t=document.getElementById("next-up-wallpaper-toggle"),s=document.getElementById("next-up-wallpaper-type"),i=document.getElementById("next-up-wallpaper-non-mcu"),r=document.getElementById("next-up-wallpaper-tv");t.checked=p.nextUpWallpaperEnabled||!1,s.value=p.nextUpWallpaperType||"all",i.checked=p.nextUpWallpaperIncludeNonMCU===void 0?!0:p.nextUpWallpaperIncludeNonMCU,r.checked=p.nextUpWallpaperIncludeTV===void 0?!0:p.nextUpWallpaperIncludeTV,e.innerHTML='<option value="">-- Select a Movie --</option>',m.items.forEach(a=>{const o=document.createElement("option");o.value=a.id,o.textContent=a.title,e.appendChild(o)}),n.classList.remove("hidden"),n.classList.add("flex"),setTimeout(()=>n.classList.remove("modal-hidden"),10)}window.closeSettingsModal=()=>{const n=document.getElementById("settings-modal");n.classList.add("modal-hidden"),setTimeout(()=>{n.classList.add("hidden"),n.classList.remove("flex")},300)};function ya(n){const e=n.target.value;if(!e)return;const t=m.items.find(s=>s.id==e);if(t&&t.backdrop_path){const s=`https://image.tmdb.org/t/p/original${t.backdrop_path}`;D({wallpaper:s,nextUpWallpaperEnabled:!1}),document.getElementById("next-up-wallpaper-toggle").checked=!1}}function Ia(){D({wallpaper:null}),document.body.style.backgroundImage="",document.getElementById("wallpaper-overlay").style.display="none",closeSettingsModal()}function ba(n){D({nextUpWallpaperEnabled:n.target.checked}),n.target.checked&&Ie()}function _a(n){D({nextUpWallpaperType:n.target.value}),p.nextUpWallpaperEnabled&&Ie()}function wa(n){D({nextUpWallpaperIncludeNonMCU:n.target.checked}),p.nextUpWallpaperEnabled&&Ie()}function Ie(){if(!p.nextUpWallpaperEnabled)return;const n=p.nextUpWallpaperType||"all",e=p.nextUpWallpaperIncludeNonMCU===void 0?!0:p.nextUpWallpaperIncludeNonMCU,t=p.nextUpWallpaperIncludeTV===void 0?!0:p.nextUpWallpaperIncludeTV;let s=m.items;e||(s=s.filter(r=>!r.not_mcu)),t||(s=s.filter(r=>r.type!=="tv")),n==="movie"?s=s.filter(r=>r.type==="movie"):n==="tv"&&(s=s.filter(r=>["tv","one-shot"].includes(r.type)));const i=s.find(r=>!r.watched&&!r.rejected);if(i&&i.backdrop_path){const r=`https://image.tmdb.org/t/p/original${i.backdrop_path}`;p.wallpaper!==r&&D({wallpaper:r})}}async function Lt(){console.log("Starting soft refresh..."),document.getElementById("loading-spinner").style.display="flex";const n=j(O,"marathon-data",ze),e=await ln(n);if(!e.exists()){console.warn("No existing data found. Performing emergency refresh instead."),await Yn();return}const t=e.data().items||[],s=new Map(t.map(l=>[l.title,l])),i=De,r=i.filter(l=>!s.has(l.title));console.log(`Found ${t.length} existing items.`),console.log(`New chronology has ${i.length} items.`),console.log(`${r.length} new items to fetch from API.`);const a=await Promise.all(r.map(l=>Kn(l,!0))),o=new Map(r.map((l,d)=>[l.title,a[d]])),c=i.map((l,d)=>{const y=s.get(l.title);if(y)return{...y,id:d,type:l.type,tmdbId:l.tmdbId,imdbId:l.imdbId,not_mcu:l.not_mcu,phase:l.phase};{const g=o.get(l.title)||{};let _=0;return g.runtime?_=g.runtime:Array.isArray(g.episode_run_time)&&g.episode_run_time.length>0?_=g.episode_run_time[0]:l.type==="one-shot"?_=10:_=45,{id:d,tmdbId:l.tmdbId||null,imdbId:l.imdbId||null,title:l.title||"Unknown Title",type:l.type||"movie",not_mcu:l.not_mcu||!1,phase:l.phase||null,poster_path:g.poster_path||null,backdrop_path:g.backdrop_path||null,release_date:g.release_date||g.first_air_date||"N/A",runtime:_||0,vote_average:g.vote_average||0,overview:g.overview||"No overview available.",watched:!1,rejected:!1,ratings:{user1:null,user2:null},notes:{user1:"",user2:""},jarvisSummary:null,nextUpHype:null}}});console.log(`Final list has ${c.length} items. Saving to Firestore.`),c.forEach((l,d)=>{for(const y in l)l[y]===void 0&&console.error(`Item at index ${d} (${l.title}) has an undefined value for key: ${y}`)}),m.items=c,await A(),document.getElementById("loading-spinner").style.display="none",console.log("Soft refresh complete. Firestore updated, UI will now sync.")}async function Yn(){confirm("Are you sure you want to perform an Emergency Refresh? This will reset ALL watched progress and ratings for this marathon. This action cannot be undone.")&&(console.log("Performing emergency refresh. ALL USER DATA WILL BE RESET."),await zn(j(O,"marathon-data",ze)))}function Ea(){const n=[{name:"Satisfied",image:"satisfied.png"},{name:"Thinking",image:"thinking.png"},{name:"Afraid",image:"afraid.png"},{name:"Neutral",image:"neutral.png"},{name:"Happy",image:"happy.png"},{name:"Disgusted",image:"disgusted.png"},{name:"Angry",image:"angry.png"},{name:"Surprised",image:"surprised.png"},{name:"Crying",image:"crying.png"},{name:"Bored",image:"bored.png"},{name:"Celebratory",image:"celebratory.png"},{name:"Melted",image:"melted.png"},{name:"Amazed",image:"amazed.png"},{name:"Sad",image:"sad.png"},{name:"Sexy",image:"sexy.png"},{name:"Not a Fan",image:"not-a-fan.png"},{name:"Crazy",image:"crazy.png"},{name:"labubu",image:"24klabubu.png"}];Yt=new zr(n,(e,t)=>{if(b!==null){const s=m.items.findIndex(i=>i.id===b);if(s>-1){const i=m.items[s];i.moods||(i.moods={}),i.moods[e]=t;const r=i.title;console.log(`${e} reacted ${t.name} to ${r}!`),A(),openModal(b)}}},p),document.getElementById("add-mood-btn").addEventListener("click",()=>{const e=m.items.find(t=>t.id===b);e&&Yt.open(e.moods)})}function Ta(n){const e=document.getElementById("modal-mood-display");if(e.innerHTML="",n.moods){const t=n.moods.user1,s=n.moods.user2;t&&(e.innerHTML+=`<div class="mood-emoji-container" data-user="Juainny" data-mood="${t.name}" data-movie="${n.title}"><img src="/moods/${t.image}" alt="${t.name}" class="w-10 h-10"></div>`),s&&(e.innerHTML+=`<div class="mood-emoji-container" data-user="Erick" data-mood="${s.name}" data-movie="${n.title}"><img src="/moods/${s.image}" alt="${s.name}" class="w-10 h-10"></div>`)}}function ka(){const n=document.getElementById("tooltip");document.body.addEventListener("click",e=>{e.target.closest(".emoji-banner")&&e.stopPropagation();const t=e.target.closest(".mood-emoji-container");if(t){const s=t.dataset.user,i=t.dataset.mood,r=document.createElement("div");B(r,s==="Juainny"?"user1":"user2",p,{size:"small",extraClasses:["mr-2"]}),n.innerHTML=`<div class="flex items-center">${r.outerHTML}<span>${s} reacted with ${i}</span></div>`,n.classList.remove("hidden");const o=t.getBoundingClientRect();n.style.left=`${o.left+window.scrollX}px`,n.style.top=`${o.bottom+window.scrollY+5}px`}else n.classList.add("hidden")},!0)}
