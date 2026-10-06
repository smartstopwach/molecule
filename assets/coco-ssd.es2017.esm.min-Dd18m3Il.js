import{o as Da,p as oh,q as ih}from"./three-BwGYb5W1.js";import{l as uh,L as lh,s as Ks}from"./index-pt7j8xhR.js";function ch(t,e){for(var n=0;n<e.length;n++){const s=e[n];if(typeof s!="string"&&!Array.isArray(s)){for(const r in s)if(r!=="default"&&!(r in t)){const a=Object.getOwnPropertyDescriptor(s,r);a&&Object.defineProperty(t,r,a.get?a:{enumerable:!0,get:()=>s[r]})}}}return Object.freeze(Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}))}var ds={exports:{}};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ph=1e-7,hh=1e-4;class mh{constructor(e,n){this.backend=e,this.dataMover=n,this.data=new WeakMap,this.dataIdsCount=0}get(e){return this.data.has(e)||this.dataMover.moveData(this.backend,e),this.data.get(e)}set(e,n){this.dataIdsCount++,this.data.set(e,n)}has(e){return this.data.has(e)}delete(e){return this.dataIdsCount--,this.data.delete(e)}numDataIds(){return this.dataIdsCount}}class Fa{refCount(e){return he("refCount")}incRef(e){return he("incRef")}timerAvailable(){return!0}time(e){return he("time")}read(e){return he("read")}readSync(e){return he("readSync")}readToGPU(e,n){return he("readToGPU")}numDataIds(){return he("numDataIds")}disposeData(e,n){return he("disposeData")}write(e,n,s){return he("write")}move(e,n,s,r,a){return he("move")}createTensorFromGPUData(e,n,s){return he("createTensorFromGPUData")}memory(){return he("memory")}floatPrecision(){return he("floatPrecision")}epsilon(){return this.floatPrecision()===32?ph:hh}dispose(){return he("dispose")}}function he(t){throw new Error(`'${t}' not yet implemented or not found in the registry. This kernel may not be supported by the tfjs backend you have chosen`)}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ca(t){let e=t.length,n=0;for(;e>0;)n=Math.random()*e|0,e--,xn(t,e,n)}function fh(t,e){if(t.length!==e.length)throw new Error(`Array sizes must match to be shuffled together First array length was ${t.length}Second array length was ${e.length}`);let n=t.length,s=0;for(;n>0;)s=Math.random()*n|0,n--,xn(t,n,s),xn(e,n,s)}function Xt(t,e,n){return Math.max(t,Math.min(e,n))}function dh(t){return t%2===0?t:t+1}function xn(t,e,n){const s=t[e];t[e]=t[n],t[n]=s}function gh(t){let e=0;for(let n=0;n<t.length;n++)e+=t[n];return e}function yh(t,e){const n=Math.random();return e*n+(1-n)*t}function bh(t,e){let n=0;for(let s=0;s<t.length;s++){const r=Number(t[s])-Number(e[s]);n+=r*r}return n}function d(t,e){if(!t)throw new Error(typeof e=="string"?e:e())}function le(t,e,n=""){d(_e(t,e),()=>n+` Shapes ${t} and ${e} must match`)}function St(t){d(t!=null,()=>"The input to the tensor constructor must be a non-null value.")}function j(t){if(t.length===0)return 1;let e=t[0];for(let n=1;n<t.length;n++)e*=t[n];return e}function wh(t){return t.length===0}function Ra(t,e){if(t===e)return!0;if(t==null||e==null||t.length!==e.length)return!1;for(let n=0;n<t.length;n++)if(t[n]!==null&&e[n]!==null&&t[n]!==e[n])return!1;return!0}function _e(t,e){if(t===e)return!0;if(t==null||e==null||t.length!==e.length)return!1;for(let n=0;n<t.length;n++)if(t[n]!==e[n])return!1;return!0}function Ot(t){return t%1===0}function Nh(t){if(Math.tanh!=null)return Math.tanh(t);if(t===1/0)return 1;if(t===-1/0)return-1;{const e=Math.exp(2*t);return(e-1)/(e+1)}}function Sh(t){const e=Math.ceil(Math.sqrt(t));return[e,Math.ceil(t/e)]}function Th(t){const e=new Uint32Array(t);for(let n=0;n<t;++n)e[n]=n;return Ca(e),e}function Kt(t,e){return e<=t.length?t:t+" ".repeat(e-t.length)}function $h(t,e=r=>0,n,s){return new Promise((r,a)=>{let o=0;const i=()=>{if(t()){r();return}o++;const u=e(o);if(n!=null&&o>=n){a();return}s!=null?s(i,u):setTimeout(i,u)};i()})}function Eh(t,e){let n=1,s=-1;for(let a=0;a<t.length;++a)if(t[a]>=0)n*=t[a];else if(t[a]===-1){if(s!==-1)throw Error(`Shapes can only have 1 implicit size. Found -1 at dim ${s} and dim ${a}`);s=a}else if(t[a]<0)throw Error(`Shapes can not be < 0. Found ${t[a]} at dim ${a}`);if(s===-1){if(e>0&&e!==n)throw Error(`Size(${e}) must match the product of shape ${t}`);return t}if(n===0)throw Error(`Cannot infer the missing size in [${t}] when there are 0 elements`);if(e%n!==0)throw Error(`The implicit shape can't be a fractional number. Got ${e} / ${n}`);const r=t.slice();return r[s]=e/n,r}function cn(t,e){const n=e.length;return t=t==null?e.map((s,r)=>r):[].concat(t),d(t.every(s=>s>=-n&&s<n),()=>`All values in axis param must be in range [-${n}, ${n}) but got axis ${t}`),d(t.every(s=>Ot(s)),()=>`All values in axis param must be integers but got axis ${t}`),t.map(s=>s<0?n+s:s)}function Pa(t,e){const n=[],s=[],r=e!=null&&Array.isArray(e)&&e.length===0,a=e==null||r?null:cn(e,t).sort();let o=0;for(let i=0;i<t.length;++i){if(a!=null){if(a[o]===i&&t[i]!==1)throw new Error(`Can't squeeze axis ${i} since its dim '${t[i]}' is not 1`);(a[o]==null||a[o]>i)&&t[i]===1&&(n.push(t[i]),s.push(i)),a[o]<=i&&o++}t[i]!==1&&(n.push(t[i]),s.push(i))}return{newShape:n,keptDims:s}}function Ba(t,e){return Hs(t,e)}function Hs(t,e){let n=null;if(t==null||t==="float32")n=new Float32Array(e);else if(t==="int32")n=new Int32Array(e);else if(t==="bool")n=new Uint8Array(e);else if(t==="string")n=new Array(e);else throw new Error(`Unknown data type ${t}`);return n}function La(t,e){for(let n=0;n<t.length;n++){const s=t[n];if(isNaN(s)||!isFinite(s))throw Error(`A tensor of type ${e} being uploaded contains ${s}.`)}}function za(t){return t==="bool"||t==="complex64"||t==="float32"||t==="int32"||t==="string"}function kh(t,e){return!(e==="complex64"||e==="float32"&&t!=="complex64"||e==="int32"&&t!=="float32"&&t!=="complex64"||e==="bool"&&t==="bool")}function On(t){if(t==="float32"||t==="int32")return 4;if(t==="complex64")return 8;if(t==="bool")return 1;throw new Error(`Unknown dtype ${t}`)}function Va(t){if(t==null)return 0;let e=0;return t.forEach(n=>e+=n.length),e}function qe(t){return typeof t=="string"||t instanceof String}function ja(t){return typeof t=="boolean"}function Ma(t){return typeof t=="number"}function pn(t){return Array.isArray(t)?pn(t[0]):t instanceof Float32Array?"float32":t instanceof Int32Array||t instanceof Uint8Array||t instanceof Uint8ClampedArray?"int32":Ma(t)?"float32":qe(t)?"string":ja(t)?"bool":"float32"}function Je(t){return!!(t&&t.constructor&&t.call&&t.apply)}function Dn(t,e){for(let n=e;n<t;++n)if(t%n===0)return n;return t}function zt(t){const e=t.length;if(e<2)return[];const n=new Array(e-1);n[e-2]=t[e-1];for(let s=e-3;s>=0;--s)n[s]=n[s+1]*t[s+1];return n}function Wa(t,e,n,s=!1){const r=new Array;if(e.length===1){const a=e[0]*(s?2:1);for(let o=0;o<a;o++)r[o]=n[t+o]}else{const a=e[0],o=e.slice(1),i=o.reduce((u,l)=>u*l)*(s?2:1);for(let u=0;u<a;u++)r[u]=Wa(t+u*i,o,n,s)}return r}function pt(t,e,n=!1){if(t.length===0)return e[0];const s=t.reduce((r,a)=>r*a)*(n?2:1);if(s===0)return[];if(s!==e.length)throw new Error(`[${t}] does not match the input size ${e.length}${n?" for a complex tensor":""}.`);return Wa(0,t,e,n)}function _h(t,e){if(Array.isArray(t))return t;if(e==="float32")return t instanceof Float32Array?t:new Float32Array(t);if(e==="int32")return t instanceof Int32Array?t:new Int32Array(t);if(e==="bool"||e==="string")return Uint8Array.from(new Int32Array(t));throw new Error(`Unknown dtype ${e}`)}function Xs(t,e){const n=Un(t,e);for(let s=0;s<n.length;s++)n[s]=1;return n}function Un(t,e){if(e==null||e==="float32"||e==="complex64")return new Float32Array(t);if(e==="int32")return new Int32Array(t);if(e==="bool")return new Uint8Array(t);throw new Error(`Unknown data type ${e}`)}function vh(t,e){const n=t.reduce((s,r)=>s*r,1);if(e==null||e==="float32")return pt(t,new Float32Array(n));if(e==="int32")return pt(t,new Int32Array(n));if(e==="bool")return pt(t,new Uint8Array(n));throw new Error(`Unknown data type ${e}`)}function ye(t){t.forEach(e=>{d(Number.isInteger(e)&&e>=0,()=>`Tensor must have a shape comprised of positive integers but got shape [${t}].`)})}function Ih(t,e,n){if(e===0)return 0;if(e===1)return t[0];let s=t[t.length-1];for(let r=0;r<t.length-1;++r)s+=n[r]*t[r];return s}function Ah(t,e,n){if(e===0)return[];if(e===1)return[t];const s=new Array(e);for(let r=0;r<s.length-1;++r)s[r]=Math.floor(t/n[r]),t-=s[r]*n[r];return s[s.length-1]=t,s}function Ye(t){return t&&t.then&&typeof t.then=="function"}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ia="tfjsflags";class Ua{constructor(e){this.global=e,this.flags={},this.flagRegistry={},this.urlFlags={},this.getQueryParams=xh,this.populateURLFlags()}setPlatform(e,n){this.platform!=null&&(O().getBool("IS_TEST")||O().getBool("PROD")||console.warn(`Platform ${this.platformName} has already been set. Overwriting the platform with ${e}.`)),this.platformName=e,this.platform=n}registerFlag(e,n,s){if(this.flagRegistry[e]={evaluationFn:n,setHook:s},this.urlFlags[e]!=null){const r=this.urlFlags[e];O().getBool("IS_TEST")||O().getBool("PROD")||console.warn(`Setting feature override from URL ${e}: ${r}.`),this.set(e,r)}}async getAsync(e){return e in this.flags?this.flags[e]:(this.flags[e]=await this.evaluateFlag(e),this.flags[e])}get(e){if(e in this.flags)return this.flags[e];const n=this.evaluateFlag(e);if(Ye(n))throw new Error(`Flag ${e} cannot be synchronously evaluated. Please use getAsync() instead.`);return this.flags[e]=n,this.flags[e]}getNumber(e){return this.get(e)}getBool(e){return this.get(e)}getString(e){return this.get(e)}getFlags(){return this.flags}get features(){return this.flags}set(e,n){if(this.flagRegistry[e]==null)throw new Error(`Cannot set flag ${e} as it has not been registered.`);this.flags[e]=n,this.flagRegistry[e].setHook!=null&&this.flagRegistry[e].setHook(n)}evaluateFlag(e){if(this.flagRegistry[e]==null)throw new Error(`Cannot evaluate flag '${e}': no evaluation function found.`);return this.flagRegistry[e].evaluationFn()}setFlags(e){this.flags=Object.assign({},e)}reset(){this.flags={},this.urlFlags={},this.populateURLFlags()}populateURLFlags(){if(typeof this.global>"u"||typeof this.global.location>"u"||typeof this.global.location.search>"u")return;const e=this.getQueryParams(this.global.location.search);ia in e&&e[ia].split(",").forEach(s=>{const[r,a]=s.split(":");this.urlFlags[r]=Dh(r,a)})}}function xh(t){const e={};return t.replace(/[?&]([^=?&]+)(?:=([^&]*))?/g,(n,...s)=>(Oh(e,s[0],s[1]),s.join("="))),e}function Oh(t,e,n){t[decodeURIComponent(e)]=decodeURIComponent(n||"")}function Dh(t,e){const n=e.toLowerCase();return n==="true"||n==="false"?n==="true":`${+n}`===n?+n:e}function O(){return Js}let Js=null;function Fh(t){Js=t}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */let us;function Ga(){if(us==null){let t;if(typeof window<"u")t=window;else if(typeof global<"u")t=global;else if(typeof process<"u")t=process;else if(typeof self<"u")t=self;else throw new Error("Could not find a global object");us=t}return us}function Ch(){const t=Ga();return t._tfGlobals==null&&(t._tfGlobals=new Map),t._tfGlobals}function Ys(t,e){const n=Ch();if(n.has(t))return n.get(t);{const s=e();return n.set(t,s),n.get(t)}}const qa="Abs",Ka="Acos",Ha="Acosh",Zs="Add",Xa="AddN",Ja="All",Ya="Any",Za="ArgMax",Qa="ArgMin",eo="Asin",to="Asinh",no="Atan",so="Atanh",ro="Atan2",ao="AvgPool",Rh="AvgPoolGrad",oo="AvgPool3D",Ph="AvgPool3DGrad",io="BatchMatMul",uo="BatchToSpaceND",lo="Bincount",co="BitwiseAnd",Bh="BroadcastTo",po="BroadcastArgs",Qs="Cast",ho="Ceil",mo="ClipByValue",fo="Complex",go="ComplexAbs",yo="Concat",bo="Conv2D",wo="Conv2DBackpropFilter",No="Conv2DBackpropInput",So="Conv3D",Lh="Conv3DBackpropFilterV2",To="Conv3DBackpropInputV2",$o="Cos",Eo="Cosh",ko="Cumprod",_o="Cumsum",vo="CropAndResize",Io="DenseBincount",Ao="DepthToSpace",xo="DepthwiseConv2dNative",Oo="DepthwiseConv2dNativeBackpropFilter",Do="DepthwiseConv2dNativeBackpropInput",Fo="Diag",Co="Dilation2D",zh="Dilation2DBackpropInput",Vh="Dilation2DBackpropFilter",er="Draw",Ro="RealDiv",Po="Einsum",Bo="Elu",jh="EluGrad",Lo="Erf",zo="Equal",Vo="Exp",jo="ExpandDims",Mo="Expm1",Wo="FFT",Uo="Fill",Go="FlipLeftRight",qo="Floor",Ko="FloorDiv",Ho="FusedBatchNorm",Xo="GatherV2",Jo="GatherNd",Yo="Greater",Zo="GreaterEqual",tr="Identity",Qo="IFFT",ei="Imag",ti="IsFinite",ni="IsInf",si="IsNan",ri="LeakyRelu",ai="Less",oi="LessEqual",ii="LinSpace",ui="Log",li="Log1p",ci="LogicalAnd",pi="LogicalNot",hi="LogicalOr",Mh="LogicalXor",Wh="LogSoftmax",Uh="LowerBound",mi="LRN",Gh="LRNGrad",qh="MatrixBandPart",fi="Max",di="Maximum",gi="MaxPool",Kh="MaxPoolGrad",yi="MaxPool3D",Hh="MaxPool3DGrad",bi="MaxPoolWithArgmax",wi="Mean",Ni="Min",Si="Minimum",Ti="MirrorPad",$i="Mod",Ei="Multinomial",ki="Multiply",_i="Neg",vi="NotEqual",Ii="NonMaxSuppressionV3",Ai="NonMaxSuppressionV4",xi="NonMaxSuppressionV5",Oi="OnesLike",Di="OneHot",Fi="Pack",Ci="PadV2",Xh="Pool",Ri="Pow",Pi="Prelu",Bi="Prod",Li="RaggedGather",zi="RaggedRange",Vi="RaggedTensorToTensor",ji="Range",Mi="Real",Wi="Reciprocal",Ui="Relu",Gi="Reshape",qi="ResizeNearestNeighbor",Jh="ResizeNearestNeighborGrad",Ki="ResizeBilinear",Yh="ResizeBilinearGrad",Hi="Relu6",Xi="Reverse",Ji="Round",Yi="Rsqrt",Zi="ScatterNd",Qi="TensorScatterUpdate",eu="SearchSorted",tu="Select",nu="Selu",su="Slice",ru="Sin",au="Sinh",ou="Sign",iu="Sigmoid",uu="Softplus",lu="Sqrt",cu="Sum",pu="SpaceToBatchND",hu="SplitV",mu="Softmax",fu="SparseFillEmptyRows",du="SparseReshape",gu="SparseSegmentMean",yu="SparseSegmentSum",bu="SparseToDense",wu="SquaredDifference",Zh="Square",Nu="StaticRegexReplace",Su="StridedSlice",Tu="StringNGrams",$u="StringSplit",Eu="StringToHashBucketFast",ku="Sub",_u="Tan",vu="Tanh",nr="Tile",Iu="TopK",Au="Transform",_n="Transpose",xu="Unique",Ou="Unpack",Du="UnsortedSegmentSum",Qh="UpperBound",Fu="ZerosLike",Cu="Step",gs="FromPixels",Ru="RotateWithOffset",ys="_FusedMatMul",bs="FusedConv2D",ws="FusedDepthwiseConv2D";/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ue(...t){O().getBool("IS_TEST")||O().getBool("PROD")||console.warn(...t)}function em(...t){O().getBool("IS_TEST")||O().getBool("PROD")||console.log(...t)}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Dt=Ys("kernelRegistry",()=>new Map),Jt=Ys("gradRegistry",()=>new Map);function Yt(t,e){const n=sr(t,e);return Dt.get(n)}function Ns(t){return Jt.get(t)}function Fn(t){const e=Dt.entries(),n=[];for(;;){const{done:s,value:r}=e.next();if(s)break;const[a,o]=r,[i]=a.split("_");i===t&&n.push(o)}return n}function Pu(t){const{kernelName:e,backendName:n}=t,s=sr(e,n);Dt.has(s)&&Ue(`The kernel '${e}' for backend '${n}' is already registered`),Dt.set(s,t)}function tm(t){const{kernelName:e}=t;Jt.has(e)&&O().getBool("DEBUG")&&Ue(`Overriding the gradient for '${e}'`),Jt.set(e,t)}function nm(t,e){const n=sr(t,e);if(!Dt.has(n))throw new Error(`The kernel '${t}' for backend '${e}' is not registered`);Dt.delete(n)}function sm(t){if(!Jt.has(t))throw new Error(`The gradient '${t}' for backend is not registered`);Jt.delete(t)}function rm(t,e){Fn(t).forEach(s=>{const r=Object.assign({},s,{backendName:e});Pu(r)})}function sr(t,e){return`${e}_${t}`}/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Bu(t){return t instanceof Float32Array||t instanceof Int32Array||t instanceof Uint8Array||t instanceof Uint8ClampedArray}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const it=uh||lh;function hn(t){return it.fromString(t,!0,16)}const Lu=hn("c3a5c85c97cb3127"),ot=hn("b492b66fbe98f273"),oe=hn("9ae16a3b2f90404f");function Ss(t){return t.xor(t.shru(47))}function zu(t,e,n){const s=t.slice(e,e+n);return it.fromBytes(Array.from(s),!0,!0)}function W(t,e){return zu(t,e,8)}function ua(t,e){return zu(t,e,4)}function Z(t,e){return e===0?t:t.shru(e).or(t.shl(64-e))}function Xe(t,e,n=hn("9ddfea08eb382d69")){let s=t.xor(e).mul(n);s=s.xor(s.shru(47));let r=e.xor(s).mul(n);return r=r.xor(r.shru(47)),r=r.mul(n),r}function am(t,e,n,s,r,a){r=r.add(t),a=Z(a.add(r).add(s),21);const o=r;return r=r.add(e),r=r.add(n),a=a.add(Z(r,44)),[r.add(s),a.add(o)]}function $n(t,e,n,s){return am(W(t,e),W(t,e+8),W(t,e+16),W(t,e+24),n,s)}function om(t,e=t.length){if(e>=8){const n=oe.add(e*2),s=W(t,0).add(oe),r=W(t,e-8),a=Z(r,37).mul(n).add(s),o=Z(s,25).add(r).mul(n);return Xe(a,o,n)}if(e>=4){const n=oe.add(e*2),s=ua(t,0);return Xe(s.shl(3).add(e),ua(t,e-4),n)}if(e>0){const n=t[0],s=t[e>>1],r=t[e-1],a=n+(s<<8),o=e+(r<<2);return Ss(oe.mul(a).xor(Lu.mul(o))).mul(oe)}return oe}function im(t,e=t.length){const n=oe.add(e*2),s=W(t,0).mul(ot),r=W(t,8),a=W(t,e-8).mul(n),o=W(t,e-16).mul(oe);return Xe(Z(s.add(r),43).add(Z(a,30)).add(o),s.add(Z(r.add(oe),18)).add(a),n)}function um(t,e=t.length){const n=oe.add(e*2),s=W(t,0).mul(oe),r=W(t,8),a=W(t,e-8).mul(n),o=W(t,e-16).mul(oe),i=Z(s.add(r),43).add(Z(a,30)).add(o),u=Xe(i,s.add(Z(r.add(oe),18)).add(a),n),l=W(t,16).mul(n),h=W(t,24),p=i.add(W(t,e-32)).mul(n),m=u.add(W(t,e-24)).mul(n);return Xe(Z(l.add(h),43).add(Z(p,30)).add(m),l.add(Z(h.add(s),18)).add(p),n)}function lm(t,e=t.length){const n=it.fromNumber(81,!0);if(e<=32)return e<=16?om(t,e):im(t,e);if(e<=64)return um(t,e);let s=n,r=n.mul(ot).add(113),a=Ss(r.mul(oe).add(113)).mul(oe),o=[it.UZERO,it.UZERO],i=[it.UZERO,it.UZERO];s=s.mul(oe).add(W(t,0));let u=0;const l=(e-1>>6)*64,h=l+(e-1&63)-63;do s=Z(s.add(r).add(o[0]).add(W(t,u+8)),37).mul(ot),r=Z(r.add(o[1]).add(W(t,u+48)),42).mul(ot),s=s.xor(i[1]),r=r.add(o[0]).add(W(t,u+40)),a=Z(a.add(i[0]),33).mul(ot),o=$n(t,u,o[1].mul(ot),s.add(i[0])),i=$n(t,u+32,a.add(i[1]),r.add(W(t,u+16))),[a,s]=[s,a],u+=64;while(u!==l);const p=ot.add(a.and(255).shl(1));return u=h,i[0]=i[0].add(e-1&63),o[0]=o[0].add(i[0]),i[0]=i[0].add(o[0]),s=Z(s.add(r).add(o[0]).add(W(t,u+8)),37).mul(p),r=Z(r.add(o[1]).add(W(t,u+48)),42).mul(p),s=s.xor(i[1].mul(9)),r=r.add(o[0].mul(9).add(W(t,u+40))),a=Z(a.add(i[0]),33).mul(p),o=$n(t,u,o[1].mul(p),s.add(i[0])),i=$n(t,u+32,a.add(i[1]),r.add(W(t,u+16))),[a,s]=[s,a],Xe(Xe(o[0],i[0],p).add(Ss(r).mul(Lu)).add(a),Xe(o[1],i[1],p).add(s),p)}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function cm(t,e){return e==="string"?mn(t):Gn([t],e)}function pm(t,e){return t instanceof Float32Array&&e==="float32"||t instanceof Int32Array&&e==="int32"||t instanceof Uint8Array&&e==="bool"}function Gn(t,e){if(e==="string")throw new Error("Cannot convert a string[] to a TypedArray");if(Array.isArray(t)&&(t=Ze(t)),O().getBool("DEBUG")&&La(t,e),pm(t,e))return t;if(e==null||e==="float32"||e==="complex64")return new Float32Array(t);if(e==="int32")return new Int32Array(t);if(e==="bool"){const n=new Uint8Array(t.length);for(let s=0;s<n.length;++s)Math.round(t[s])!==0&&(n[s]=1);return n}else throw new Error(`Unknown data type ${e}`)}function Zt(){return O().platform.now()}function hm(t,e){return O().platform.fetch(t,e)}function mn(t,e="utf-8"){return e=e||"utf-8",O().platform.encode(t,e)}function Cn(t,e="utf-8"){return e=e||"utf-8",O().platform.decode(t,e)}function Q(t){return O().platform.isTypedArray!=null?O().platform.isTypedArray(t):Bu(t)}function Ze(t,e=[],n=!1){if(e==null&&(e=[]),typeof t=="boolean"||typeof t=="number"||typeof t=="string"||Ye(t)||t==null||Q(t)&&n)e.push(t);else if(Array.isArray(t)||Q(t))for(let s=0;s<t.length;++s)Ze(t[s],e,n);else{let s=-1;for(const r of Object.keys(t))/^([1-9]+[0-9]*|0)$/.test(r)&&(s=Math.max(s,Number(r)));for(let r=0;r<=s;r++)Ze(t[r],e,n)}return e}const mm=Object.freeze(Object.defineProperty({__proto__:null,arraysEqual:_e,arraysEqualWithNull:Ra,assert:d,assertNonNegativeIntegerDimensions:ye,assertNonNull:St,assertShapesMatch:le,bytesFromStringArray:Va,bytesPerElement:On,checkConversionForErrors:La,clamp:Xt,computeStrides:zt,convertBackendValuesAndArrayBuffer:_h,createScalarValue:cm,createShuffledIndices:Th,decodeString:Cn,distSquared:bh,encodeString:mn,fetch:hm,fingerPrint64:lm,flatten:Ze,getArrayFromDType:Hs,getTypedArrayFromDType:Ba,hasEncodingLoss:kh,hexToLong:hn,indexToLoc:Ah,inferDtype:pn,inferFromImplicitShape:Eh,isBoolean:ja,isFunction:Je,isInt:Ot,isNumber:Ma,isPromise:Ye,isScalarShape:wh,isString:qe,isTypedArray:Q,isValidDtype:za,locToIndex:Ih,makeOnesTypedArray:Xs,makeZerosNestedTypedArray:vh,makeZerosTypedArray:Un,nearestDivisor:Dn,nearestLargerEven:dh,now:Zt,parseAxisParam:cn,randUniform:yh,repeatedTry:$h,rightPad:Kt,shuffle:Ca,shuffleCombo:fh,sizeFromShape:j,sizeToSquarishShape:Sh,squeezeShape:Pa,sum:gh,swap:xn,tanh:Nh,toNestedArray:pt,toTypedArray:Gn},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class fm{constructor(e,n){this.backendTimer=e,this.logger=n,n==null&&(this.logger=new gm)}profileKernel(e,n,s){let r;const a=()=>{r=s()};let o;const i=Zt();if(this.backendTimer.timerAvailable())o=this.backendTimer.time(a);else{a();for(const l of r)l.dataSync();o=Promise.resolve({kernelMs:Zt()-i})}if(O().getBool("CHECK_COMPUTATION_FOR_ERRORS"))for(let l=0;l<r.length;l++){const h=r[l];h.data().then(p=>{dm(p,h.dtype,e)})}return{kernelName:e,outputs:r,inputs:n,timeMs:o.then(l=>l.kernelMs),extraInfo:o.then(l=>l.getExtraProfileInfo!=null?l.getExtraProfileInfo():"")}}logKernelProfile(e){const{kernelName:n,outputs:s,timeMs:r,inputs:a,extraInfo:o}=e;s.forEach(i=>{Promise.all([i.data(),r,o]).then(u=>{this.logger.logKernelProfile(n,i,u[0],u[1],a,u[2])})})}}function dm(t,e,n){if(e!=="float32")return!1;for(let s=0;s<t.length;s++){const r=t[s];if(isNaN(r)||!isFinite(r))return console.warn(`Found ${r} in the result of '${n}'`),!0}return!1}class gm{logKernelProfile(e,n,s,r,a,o){const i=typeof r=="number"?Kt(`${r}ms`,9):r.error,u=Kt(e,25),l=n.rank,h=n.size,p=Kt(n.shape.toString(),14);let m="";for(const g in a){const N=a[g];if(N!=null){const S=N.shape||n.shape,w=S.length;m+=`${g}: ${w}D ${w>0?S:""} `}}console.log(`%c${u}	%c${i}	%c${l}D ${p}	%c${h}	%c${m}	%c${o}`,"font-weight:bold","color:red","color:blue","color: orange","color: green","color: steelblue")}}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ym(t,e,n){const s={},r={};for(let u=0;u<e.length;u++)s[e[u].id]=!0;for(let u=0;u<t.length;u++){const l=t[u],h=l.inputs;for(const p in h){const m=h[p];let g=!1;for(let N=0;N<e.length;N++)if(s[m.id]){l.outputs.forEach(S=>s[S.id]=!0),g=!0,r[l.id]=!0;break}if(g)break}}const a={};a[n.id]=!0;const o={};for(let u=t.length-1;u>=0;u--){const l=t[u],h=l.inputs;for(let p=0;p<l.outputs.length;p++)if(a[l.outputs[p].id]){for(const m in h)a[h[m].id]=!0,o[l.id]=!0;break}}const i=[];for(let u=0;u<t.length;u++){const l=t[u];if(r[l.id]&&o[l.id]){const h={};for(const m in l.inputs){const g=l.inputs[m];s[g.id]&&(h[m]=g)}const p=Object.assign({},l);p.inputs=h,p.outputs=l.outputs,i.push(p)}}return i}function bm(t,e,n,s){for(let r=e.length-1;r>=0;r--){const a=e[r],o=[];if(a.outputs.forEach(u=>{const l=t[u.id];l!=null?o.push(l):o.push(null)}),a.gradient==null)throw new Error(`Cannot compute gradient: gradient function not found for ${a.kernelName}.`);const i=a.gradient(o);for(const u in a.inputs){if(!(u in i))throw new Error(`Cannot backprop through input ${u}. Available gradients found: ${Object.keys(i)}.`);const l=n(()=>i[u]());if(l.dtype!=="float32")throw new Error(`Error in gradient for op ${a.kernelName}. The gradient of input ${u} must have 'float32' dtype, but has '${l.dtype}'`);const h=a.inputs[u];if(!_e(l.shape,h.shape))throw new Error(`Error in gradient for op ${a.kernelName}. The gradient of input '${u}' has shape '${l.shape}', which does not match the shape of the input '${h.shape}'`);if(t[h.id]==null)t[h.id]=l;else{const p=t[h.id];t[h.id]=s(p,l),p.dispose()}}}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const la=20,Wt=3,ls=7;function wm(t,e,n,s){const r=zt(e),a=Nm(t,e,n,r),o=e.length,i=vn(t,e,n,r,a),u=["Tensor"];return s&&(u.push(`  dtype: ${n}`),u.push(`  rank: ${o}`),u.push(`  shape: [${e}]`),u.push("  values:")),u.push(i.map(l=>"    "+l).join(`
`)),u.join(`
`)}function Nm(t,e,n,s){const r=j(e),a=s[s.length-1],o=new Array(a).fill(0),i=e.length,u=n==="complex64"?qt(t):t;if(i>1)for(let l=0;l<r/a;l++){const h=l*a;for(let p=0;p<a;p++)o[p]=Math.max(o[p],Gt(u[h+p],0,n).length)}return o}function Gt(t,e,n){let s;return Array.isArray(t)?s=`${parseFloat(t[0].toFixed(ls))} + ${parseFloat(t[1].toFixed(ls))}j`:qe(t)?s=`'${t}'`:n==="bool"?s=Vu(t):s=parseFloat(t.toFixed(ls)).toString(),Kt(s,e)}function Vu(t){return t===0?"false":"true"}function vn(t,e,n,s,r,a=!0){const o=n==="complex64"?2:1,i=e[0],u=e.length;if(u===0){if(n==="complex64"){const S=qt(t);return[Gt(S[0],0,n)]}return n==="bool"?[Vu(t[0])]:[t[0].toString()]}if(u===1){if(i>la){const w=Wt*o;let T=Array.from(t.slice(0,w)),v=Array.from(t.slice((i-Wt)*o,i*o));return n==="complex64"&&(T=qt(T),v=qt(v)),["["+T.map((E,k)=>Gt(E,r[k],n)).join(", ")+", ..., "+v.map((E,k)=>Gt(E,r[i-Wt+k],n)).join(", ")+"]"]}return["["+(n==="complex64"?qt(t):Array.from(t)).map((w,T)=>Gt(w,r[T],n)).join(", ")+"]"]}const l=e.slice(1),h=s.slice(1),p=s[0]*o,m=[];if(i>la){for(let S=0;S<Wt;S++){const w=S*p,T=w+p;m.push(...vn(t.slice(w,T),l,n,h,r,!1))}m.push("...");for(let S=i-Wt;S<i;S++){const w=S*p,T=w+p;m.push(...vn(t.slice(w,T),l,n,h,r,S===i-1))}}else for(let S=0;S<i;S++){const w=S*p,T=w+p;m.push(...vn(t.slice(w,T),l,n,h,r,S===i-1))}const g=u===2?",":"";m[0]="["+(i>0?m[0]+g:"");for(let S=1;S<m.length-1;S++)m[S]=" "+m[S]+g;let N=`,
`;for(let S=2;S<u;S++)N+=`
`;return m[m.length-1]=" "+m[m.length-1]+"]"+(a?"":N),m}function qt(t){const e=[];for(let n=0;n<t.length;n+=2)e.push([t[n],t[n+1]]);return e}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Rn{constructor(e,n,s){if(this.dtype=n,this.shape=e.slice(),this.size=j(e),s!=null){const r=s.length;d(r===this.size,()=>`Length of values '${r}' does not match the size inferred by the shape '${this.size}'.`)}if(n==="complex64")throw new Error("complex64 dtype TensorBuffers are not supported. Please create a TensorBuffer for the real and imaginary parts separately and call tf.complex(real, imag).");this.values=s||Hs(n,this.size),this.strides=zt(e)}set(e,...n){n.length===0&&(n=[0]),d(n.length===this.rank,()=>`The number of provided coordinates (${n.length}) must match the rank (${this.rank})`);const s=this.locToIndex(n);this.values[s]=e}get(...e){e.length===0&&(e=[0]);let n=0;for(const r of e){if(r<0||r>=this.shape[n]){const a=`Requested out of range element at ${e}.   Buffer shape=${this.shape}`;throw new Error(a)}n++}let s=e[e.length-1];for(let r=0;r<e.length-1;++r)s+=this.strides[r]*e[r];return this.values[s]}locToIndex(e){if(this.rank===0)return 0;if(this.rank===1)return e[0];let n=e[e.length-1];for(let s=0;s<e.length-1;++s)n+=this.strides[s]*e[s];return n}indexToLoc(e){if(this.rank===0)return[];if(this.rank===1)return[e];const n=new Array(this.shape.length);for(let s=0;s<n.length-1;++s)n[s]=Math.floor(e/this.strides[s]),e-=n[s]*this.strides[s];return n[n.length-1]=e,n}get rank(){return this.shape.length}toTensor(){return Te().makeTensor(this.values,this.shape,this.dtype)}}let Te=null,kt=null;function Sm(t){Te=t}function Tm(t){kt=t}class X{constructor(e,n,s,r){this.kept=!1,this.isDisposedInternal=!1,this.shape=e.slice(),this.dtype=n||"float32",this.size=j(e),this.strides=zt(e),this.dataId=s,this.id=r,this.rankType=this.rank<5?this.rank.toString():"higher"}get rank(){return this.shape.length}async buffer(){const e=await this.data();return kt.buffer(this.shape,this.dtype,e)}bufferSync(){return kt.buffer(this.shape,this.dtype,this.dataSync())}async array(){const e=await this.data();return pt(this.shape,e,this.dtype==="complex64")}arraySync(){return pt(this.shape,this.dataSync(),this.dtype==="complex64")}async data(){this.throwIfDisposed();const e=Te().read(this.dataId);if(this.dtype==="string"){const n=await e;try{return n.map(s=>Cn(s))}catch{throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}}return e}dataToGPU(e){return this.throwIfDisposed(),Te().readToGPU(this.dataId,e)}dataSync(){this.throwIfDisposed();const e=Te().readSync(this.dataId);if(this.dtype==="string")try{return e.map(n=>Cn(n))}catch{throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}return e}async bytes(){this.throwIfDisposed();const e=await Te().read(this.dataId);return this.dtype==="string"?e:new Uint8Array(e.buffer)}dispose(){this.isDisposed||(this.kerasMask&&this.kerasMask.dispose(),Te().disposeTensor(this),this.isDisposedInternal=!0)}get isDisposed(){return this.isDisposedInternal}throwIfDisposed(){if(this.isDisposed)throw new Error("Tensor is disposed.")}print(e=!1){return kt.print(this,e)}clone(){return this.throwIfDisposed(),kt.clone(this)}toString(e=!1){const n=this.dataSync();return wm(n,this.shape,this.dtype,e)}cast(e){return this.throwIfDisposed(),kt.cast(this,e)}variable(e=!0,n,s){return this.throwIfDisposed(),Te().makeVariable(this,e,n,s)}}Object.defineProperty(X,Symbol.hasInstance,{value:t=>!!t&&t.data!=null&&t.dataSync!=null&&t.throwIfDisposed!=null});function ju(){return Ys("Tensor",()=>X)}ju();class Qt extends X{constructor(e,n,s,r){super(e.shape,e.dtype,e.dataId,r),this.trainable=n,this.name=s}assign(e){if(e.dtype!==this.dtype)throw new Error(`dtype of the new value (${e.dtype}) and previous value (${this.dtype}) must match`);if(!_e(e.shape,this.shape))throw new Error(`shape of the new value (${e.shape}) and previous value (${this.shape}) must match`);Te().disposeTensor(this),this.dataId=e.dataId,Te().incRef(this,null)}dispose(){Te().disposeVariable(this),this.isDisposedInternal=!0}}Object.defineProperty(Qt,Symbol.hasInstance,{value:t=>t instanceof X&&t.assign!=null&&t.assign instanceof Function});/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var Ts;(function(t){t.R0="R0",t.R1="R1",t.R2="R2",t.R3="R3",t.R4="R4",t.R5="R5",t.R6="R6"})(Ts||(Ts={}));var $s;(function(t){t.float32="float32",t.int32="int32",t.bool="int32",t.complex64="complex64"})($s||($s={}));var Es;(function(t){t.float32="float32",t.int32="int32",t.bool="bool",t.complex64="complex64"})(Es||(Es={}));var ks;(function(t){t.float32="float32",t.int32="float32",t.bool="float32",t.complex64="complex64"})(ks||(ks={}));var _s;(function(t){t.float32="complex64",t.int32="complex64",t.bool="complex64",t.complex64="complex64"})(_s||(_s={}));const $m={float32:ks,int32:$s,bool:Es,complex64:_s};function qn(t,e){if(t==="string"||e==="string"){if(t==="string"&&e==="string")return"string";throw new Error(`Can not upcast ${t} with ${e}`)}return $m[t][e]}function Em(t){return qn(t,"int32")}function Mu(t){return t!=null&&typeof t=="object"&&"texture"in t&&t.texture instanceof WebGLTexture}function Wu(t){return typeof GPUBuffer<"u"&&t!=null&&typeof t=="object"&&"buffer"in t&&t.buffer instanceof GPUBuffer}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function H(t,e){if(t.dtype===e.dtype)return[t,e];const n=qn(t.dtype,e.dtype);return[t.cast(n),e.cast(n)]}function Uu(t,e){d(t.dtype===e.dtype,()=>`The dtypes of the first(${t.dtype}) and second(${e.dtype}) input must match`)}function km(t,e){return e.some(n=>n.id===t.id)}function rr(t){const e=[];return Gu(t,e,new Set),e}function Gu(t,e,n){if(t==null)return;if(t instanceof X){e.push(t);return}if(!_m(t))return;const s=t;for(const r in s){const a=s[r];n.has(a)||(n.add(a),Gu(a,e,n))}}function _m(t){return Array.isArray(t)||typeof t=="object"}const vm=Object.freeze(Object.defineProperty({__proto__:null,assertTypesMatch:Uu,getTensorsInContainer:rr,isTensorInList:km,makeTypesMatch:H},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function cs(t){return t.kernelName!=null}class ca{constructor(){this.registeredVariables={},this.nextTapeNodeId=0,this.numBytes=0,this.numTensors=0,this.numStringTensors=0,this.numDataBuffers=0,this.gradientDepth=0,this.kernelDepth=0,this.scopeStack=[],this.numDataMovesStack=[],this.nextScopeId=0,this.tensorInfo=new WeakMap,this.profiling=!1,this.activeProfile={newBytes:0,newTensors:0,peakBytes:0,kernels:[],result:null,get kernelNames(){return Array.from(new Set(this.kernels.map(e=>e.name)))}}}dispose(){for(const e in this.registeredVariables)this.registeredVariables[e].dispose()}}class Ft{constructor(e){this.ENV=e,this.registry={},this.registryFactory={},this.pendingBackendInitId=0,this.state=new ca}async ready(){if(this.pendingBackendInit!=null)return this.pendingBackendInit.then(()=>{});if(this.backendInstance!=null)return;const e=this.getSortedBackends();for(let n=0;n<e.length;n++){const s=e[n];if(await this.initializeBackend(s).success){await this.setBackend(s);return}}throw new Error("Could not initialize any backends, all backend initializations failed.")}get backend(){if(this.pendingBackendInit!=null)throw new Error(`Backend '${this.backendName}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);if(this.backendInstance==null){const{name:e,asyncInit:n}=this.initializeBackendsAndReturnBest();if(n)throw new Error(`The highest priority backend '${e}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);this.setBackend(e)}return this.backendInstance}backendNames(){return Object.keys(this.registryFactory)}findBackend(e){if(!(e in this.registry))if(e in this.registryFactory){const{asyncInit:n}=this.initializeBackend(e);if(n)return null}else return null;return this.registry[e]}findBackendFactory(e){return e in this.registryFactory?this.registryFactory[e].factory:null}registerBackend(e,n,s=1){return e in this.registryFactory?(Ue(`${e} backend was already registered. Reusing existing backend factory.`),!1):(this.registryFactory[e]={factory:n,priority:s},!0)}async setBackend(e){if(this.registryFactory[e]==null)throw new Error(`Backend name '${e}' not found in registry`);if(this.backendName=e,this.registry[e]==null){this.backendInstance=null;const{success:n,asyncInit:s}=this.initializeBackend(e);if(!(s?await n:n))return!1}return this.backendInstance=this.registry[e],this.setupRegisteredKernels(),this.profiler=new fm(this.backendInstance),!0}setupRegisteredKernels(){Fn(this.backendName).forEach(n=>{n.setupFunc!=null&&n.setupFunc(this.backendInstance)})}disposeRegisteredKernels(e){Fn(e).forEach(s=>{s.disposeFunc!=null&&s.disposeFunc(this.registry[e])})}initializeBackend(e){const n=this.registryFactory[e];if(n==null)throw new Error(`Cannot initialize backend ${e}, no registration found.`);try{const s=n.factory();if(s&&!(s instanceof Fa)&&typeof s.then=="function"){const r=++this.pendingBackendInitId,a=s.then(o=>r<this.pendingBackendInitId?!1:(this.registry[e]=o,this.pendingBackendInit=null,!0)).catch(o=>(r<this.pendingBackendInitId||(this.pendingBackendInit=null,Ue(`Initialization of backend ${e} failed`),Ue(o.stack||o.message)),!1));return this.pendingBackendInit=a,{success:a,asyncInit:!0}}else return this.registry[e]=s,{success:!0,asyncInit:!1}}catch(s){return Ue(`Initialization of backend ${e} failed`),Ue(s.stack||s.message),{success:!1,asyncInit:!1}}}removeBackend(e){if(!(e in this.registryFactory))throw new Error(`${e} backend not found in registry`);this.backendName===e&&this.pendingBackendInit!=null&&this.pendingBackendInitId++,e in this.registry&&(this.disposeRegisteredKernels(e),this.registry[e].dispose(),delete this.registry[e]),delete this.registryFactory[e],this.backendName===e&&(this.pendingBackendInit=null,this.backendName=null,this.backendInstance=null)}getSortedBackends(){if(Object.keys(this.registryFactory).length===0)throw new Error("No backend found in registry.");return Object.keys(this.registryFactory).sort((e,n)=>this.registryFactory[n].priority-this.registryFactory[e].priority)}initializeBackendsAndReturnBest(){const e=this.getSortedBackends();for(let n=0;n<e.length;n++){const s=e[n],{success:r,asyncInit:a}=this.initializeBackend(s);if(a||r)return{name:s,asyncInit:a}}throw new Error("Could not initialize any backends, all backend initializations failed.")}moveData(e,n){const s=this.state.tensorInfo.get(n),r=s.backend,a=this.readSync(n),o=r.refCount(n);r.disposeData(n,!0),s.backend=e,e.move(n,a,s.shape,s.dtype,o),this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack[this.state.numDataMovesStack.length-1]++}tidy(e,n){let s=null;if(n==null){if(typeof e!="function")throw new Error("Please provide a function to tidy()");n=e}else{if(typeof e!="string"&&!(e instanceof String))throw new Error("When calling with two arguments, the first argument to tidy() must be a string");if(typeof n!="function")throw new Error("When calling with two arguments, the 2nd argument to tidy() must be a function");s=e}let r;return this.scopedRun(()=>this.startScope(s),()=>this.endScope(r),()=>(r=n(),r instanceof Promise&&console.error("Cannot return a Promise inside of tidy."),r))}scopedRun(e,n,s){e();try{const r=s();return n(),r}catch(r){throw n(),r}}nextTensorId(){return Ft.nextTensorId++}nextVariableId(){return Ft.nextVariableId++}clone(e){const n=b.runKernel(tr,{x:e}),s={x:e},r=o=>({x:()=>{const i="float32",u={x:o},l={dtype:i};return b.runKernel(Qs,u,l)}}),a=[];return this.addTapeNode(this.state.activeScope.name,s,[n],r,a,{}),n}runKernel(e,n,s){if(this.backendName==null&&this.backend,!(Yt(e,this.backendName)!=null))throw new Error(`Kernel '${e}' not registered for backend '${this.backendName}'`);return this.runKernelFunc({kernelName:e,inputs:n,attrs:s})}shouldCheckForMemLeaks(){return this.ENV.getBool("IS_TEST")}checkKernelForMemLeak(e,n,s){const r=this.backend.numDataIds();let a=0;s.forEach(u=>{a+=u.dtype==="complex64"?3:1});const o=this.state.numDataMovesStack[this.state.numDataMovesStack.length-1],i=r-n-a-o;if(i>0)throw new Error(`Backend '${this.backendName}' has an internal memory leak (${i} data ids) after running '${e}'`)}runKernelFunc(e){let n,s=[];const r=this.isTapeOn(),a=this.state.numBytes,o=this.state.numTensors;this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack.push(0);let i;this.backendName==null&&this.backend;let u;const l=cs(e)?e.kernelName:this.state.activeScope!=null?this.state.activeScope.name:"";if(cs(e)){const{kernelName:N,inputs:S,attrs:w}=e;this.backendName==null&&this.backend;const T=Yt(N,this.backendName);d(T!=null,()=>`Cannot find registered kernel '${N}' for backend '${this.backendName}'`),i=()=>{const v=this.backend.numDataIds();u=T.kernelFunc({inputs:S,attrs:w,backend:this.backend});const E=Array.isArray(u)?u:[u];this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(N,v,E);const k=E.map(A=>A.rank!=null?A:this.makeTensorFromTensorInfo(A));if(r){const A=this.getTensorsForGradient(N,S,k);s=this.saveTensorsForBackwardMode(A)}return k}}else{const{forwardFunc:N}=e,S=w=>{r&&(s=w.map(T=>this.keep(this.clone(T))))};i=()=>{const w=this.backend.numDataIds();u=this.tidy(()=>N(this.backend,S));const T=Array.isArray(u)?u:[u];return this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(l,w,T),T}}const{inputs:h,attrs:p}=e,m=cs(e)?null:e.backwardsFunc;let g;return this.scopedRun(()=>this.state.kernelDepth++,()=>this.state.kernelDepth--,()=>{!this.ENV.getBool("DEBUG")&&!this.state.profiling?n=i():(g=this.profiler.profileKernel(l,h,()=>i()),this.ENV.getBool("DEBUG")&&this.profiler.logKernelProfile(g),n=g.outputs)}),r&&this.addTapeNode(l,h,n,m,s,p),this.state.profiling&&this.state.activeProfile.kernels.push({name:l,bytesAdded:this.state.numBytes-a,totalBytesSnapshot:this.state.numBytes,tensorsAdded:this.state.numTensors-o,totalTensorsSnapshot:this.state.numTensors,inputShapes:Object.keys(h).map(N=>h[N]!=null?h[N].shape:null),outputShapes:n.map(N=>N.shape),kernelTimeMs:g.timeMs,extraInfo:g.extraInfo}),Array.isArray(u)?n:n[0]}saveTensorsForBackwardMode(e){return e.map(s=>this.keep(this.clone(s)))}getTensorsForGradient(e,n,s){const r=Ns(e);if(r!=null){const a=r.inputsToSave||[],o=r.outputsToSave||[];let i;r.saveAllInputs?(d(Array.isArray(n),()=>"saveAllInputs is true, expected inputs to be an array."),i=Object.keys(n).map(l=>n[l])):i=a.map(l=>n[l]);const u=s.filter((l,h)=>o[h]);return i.concat(u)}return[]}makeTensor(e,n,s,r){if(e==null)throw new Error("Values passed to engine.makeTensor() are null");s=s||"float32",r=r||this.backend;let a=e;s==="string"&&qe(e[0])&&(a=e.map(u=>mn(u)));const o=r.write(a,n,s),i=new X(n,s,o,this.nextTensorId());if(this.trackTensor(i,r),s==="string"){const u=this.state.tensorInfo.get(o),l=Va(a);this.state.numBytes+=l-u.bytes,u.bytes=l}return i}makeTensorFromDataId(e,n,s,r){s=s||"float32";const a={dataId:e,shape:n,dtype:s};return this.makeTensorFromTensorInfo(a,r)}makeTensorFromTensorInfo(e,n){const{dataId:s,shape:r,dtype:a}=e,o=new X(r,a,s,this.nextTensorId());return this.trackTensor(o,n),o}makeVariable(e,n=!0,s,r){s=s||this.nextVariableId().toString(),r!=null&&r!==e.dtype&&(e=e.cast(r));const a=new Qt(e,n,s,this.nextTensorId());if(this.state.registeredVariables[a.name]!=null)throw new Error(`Variable with name ${a.name} was already registered`);return this.state.registeredVariables[a.name]=a,this.incRef(a,this.backend),a}trackTensor(e,n){this.state.numTensors++,e.dtype==="string"&&this.state.numStringTensors++;let s=0;e.dtype!=="complex64"&&e.dtype!=="string"&&(s=e.size*On(e.dtype)),this.state.numBytes+=s,this.state.tensorInfo.has(e.dataId)||(this.state.numDataBuffers++,this.state.tensorInfo.set(e.dataId,{backend:n||this.backend,dtype:e.dtype,shape:e.shape,bytes:s})),e instanceof Qt||this.track(e)}incRef(e,n){this.trackTensor(e,n),this.backend.incRef(e.dataId)}removeDataId(e,n){this.state.tensorInfo.has(e)&&this.state.tensorInfo.get(e).backend===n&&(this.state.tensorInfo.delete(e),this.state.numDataBuffers--)}disposeTensor(e){if(!this.state.tensorInfo.has(e.dataId))return;const n=this.state.tensorInfo.get(e.dataId);if(this.state.numTensors--,e.dtype==="string"&&(this.state.numStringTensors--,this.state.numBytes-=n.bytes),e.dtype!=="complex64"&&e.dtype!=="string"){const s=e.size*On(e.dtype);this.state.numBytes-=s}n.backend.disposeData(e.dataId)&&this.removeDataId(e.dataId,n.backend)}disposeVariables(){for(const e in this.state.registeredVariables){const n=this.state.registeredVariables[e];this.disposeVariable(n)}}disposeVariable(e){this.disposeTensor(e),this.state.registeredVariables[e.name]!=null&&delete this.state.registeredVariables[e.name]}memory(){const e=this.backend.memory();return e.numTensors=this.state.numTensors,e.numDataBuffers=this.state.numDataBuffers,e.numBytes=this.state.numBytes,this.state.numStringTensors>0&&(e.unreliable=!0,e.reasons==null&&(e.reasons=[]),e.reasons.push("Memory usage by string tensors is approximate (2 bytes per character)")),e}async profile(e){this.state.profiling=!0;const n=this.state.numBytes,s=this.state.numTensors;this.state.activeProfile.kernels=[],this.state.activeProfile.result=await e(),this.state.profiling=!1,this.state.activeProfile.peakBytes=Math.max(...this.state.activeProfile.kernels.map(r=>r.totalBytesSnapshot)),this.state.activeProfile.newBytes=this.state.numBytes-n,this.state.activeProfile.newTensors=this.state.numTensors-s;for(const r of this.state.activeProfile.kernels)r.kernelTimeMs=await r.kernelTimeMs,r.extraInfo=await r.extraInfo;return this.state.activeProfile}isTapeOn(){return this.state.gradientDepth>0&&this.state.kernelDepth===0}addTapeNode(e,n,s,r,a,o){const i={id:this.state.nextTapeNodeId++,kernelName:e,inputs:n,outputs:s,saved:a},u=Ns(e);u!=null&&(r=u.gradFunc),r!=null&&(i.gradient=l=>(l=l.map((h,p)=>{if(h==null){const m=s[p],g=Un(m.size,m.dtype);return this.makeTensor(g,m.shape,m.dtype)}return h}),r(l.length>1?l:l[0],a,o))),this.state.activeTape.push(i)}keep(e){return e.kept=!0,e}startTape(){this.state.gradientDepth===0&&(this.state.activeTape=[]),this.state.gradientDepth++}endTape(){this.state.gradientDepth--}startScope(e){const n={track:[],name:"unnamed scope",id:this.state.nextScopeId++};e&&(n.name=e),this.state.scopeStack.push(n),this.state.activeScope=n}endScope(e){const n=rr(e),s=new Set(n.map(a=>a.id));for(let a=0;a<this.state.activeScope.track.length;a++){const o=this.state.activeScope.track[a];!o.kept&&!s.has(o.id)&&o.dispose()}const r=this.state.scopeStack.pop();this.state.activeScope=this.state.scopeStack.length===0?null:this.state.scopeStack[this.state.scopeStack.length-1],n.forEach(a=>{!a.kept&&a.scopeId===r.id&&this.track(a)})}gradients(e,n,s,r=!1){if(d(n.length>0,()=>"gradients() received an empty list of xs."),s!=null&&s.dtype!=="float32")throw new Error(`dy must have 'float32' dtype, but has '${s.dtype}'`);const a=this.scopedRun(()=>this.startTape(),()=>this.endTape(),()=>this.tidy("forward",e));d(a instanceof X,()=>"The result y returned by f() must be a tensor.");const o=ym(this.state.activeTape,n,a);if(!r&&o.length===0&&n.length>0)throw new Error("Cannot compute gradient of y=f(x) with respect to x. Make sure that the f you passed encloses all operations that lead from x to y.");return this.tidy("backward",()=>{const i={};i[a.id]=s??Im(a.shape),bm(i,o,l=>this.tidy(l),Am);const u=n.map(l=>i[l.id]);return this.state.gradientDepth===0&&(this.state.activeTape.forEach(l=>{for(const h of l.saved)h.dispose()}),this.state.activeTape=null),{value:a,grads:u}})}customGrad(e){return d(Je(e),()=>"The f passed in customGrad(f) must be a function."),(...n)=>{d(n.every(i=>i instanceof X),()=>"The args passed in customGrad(f)(x1, x2,...) must all be tensors");let s;const r={};n.forEach((i,u)=>{r[u]=i});const a=(i,u)=>(s=e(...n,u),d(s.value instanceof X,()=>"The function f passed in customGrad(f) must return an object where `obj.value` is a tensor"),d(Je(s.gradFunc),()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function."),s.value),o=(i,u)=>{const l=s.gradFunc(i,u),h=Array.isArray(l)?l:[l];d(h.length===n.length,()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns the same number of tensors as inputs passed to f(...)."),d(h.every(m=>m instanceof X),()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns a list of only tensors.");const p={};return h.forEach((m,g)=>{p[g]=()=>m}),p};return this.runKernelFunc({forwardFunc:a,backwardsFunc:o,inputs:r})}}readSync(e){return this.state.tensorInfo.get(e).backend.readSync(e)}read(e){return this.state.tensorInfo.get(e).backend.read(e)}readToGPU(e,n){return this.state.tensorInfo.get(e).backend.readToGPU(e,n)}async time(e){const n=Zt(),s=await this.backend.time(e);return s.wallMs=Zt()-n,s}track(e){return this.state.activeScope!=null&&(e.scopeId=this.state.activeScope.id,this.state.activeScope.track.push(e)),e}get registeredVariables(){return this.state.registeredVariables}reset(){this.pendingBackendInitId++,this.state.dispose(),this.ENV.reset(),this.state=new ca;for(const e in this.registry)this.disposeRegisteredKernels(e),this.registry[e].dispose(),delete this.registry[e];this.backendName=null,this.backendInstance=null,this.pendingBackendInit=null}}Ft.nextTensorId=0;Ft.nextVariableId=0;function Im(t){const e=Xs(j(t),"float32");return b.makeTensor(e,t,"float32")}function qu(){const t=Ga();if(t._tfengine==null){const e=new Ua(t);t._tfengine=new Ft(e)}return Fh(t._tfengine.ENV),Sm(()=>t._tfengine),t._tfengine}const b=qu();function Am(t,e){const n={a:t,b:e};return b.runKernel(Zs,n)}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function xm(){return typeof navigator<"u"&&navigator!=null}let vs;function Om(t){vs=t}function Dm(t){if(vs!==void 0)return vs;if(t||xm()){if(t||(t=navigator),t.product==="ReactNative")return!0;const e=t.userAgent||t.vendor||(typeof window<"u"?window.opera:"");if(!e){const n=t;return n.userAgentData&&n.userAgentData.mobile}return/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(e)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(e.substr(0,4))}return!1}function Ku(){return typeof window<"u"&&window.document!=null||typeof WorkerGlobalScope<"u"}const Fm=Object.freeze(Object.defineProperty({__proto__:null,isBrowser:Ku,isMobile:Dm,mockIsMobile:Om},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ce=O();ce.registerFlag("DEBUG",()=>!1,t=>{t&&console.warn("Debugging mode is ON. The output of every math call will be downloaded to CPU and checked for NaNs. This significantly impacts performance.")});ce.registerFlag("IS_BROWSER",()=>Ku());ce.registerFlag("IS_NODE",()=>typeof process<"u"&&typeof process.versions<"u"&&typeof process.versions.node<"u");ce.registerFlag("IS_CHROME",()=>typeof navigator<"u"&&navigator!=null&&navigator.userAgent!=null&&/Chrome/.test(navigator.userAgent)&&/Google Inc/.test(navigator.vendor));ce.registerFlag("IS_SAFARI",()=>typeof navigator<"u"&&navigator!=null&&navigator.userAgent!=null&&/Safari/.test(navigator.userAgent)&&/Apple/.test(navigator.vendor));ce.registerFlag("PROD",()=>!1);ce.registerFlag("TENSORLIKE_CHECK_SHAPE_CONSISTENCY",()=>ce.getBool("DEBUG"));ce.registerFlag("DEPRECATION_WARNINGS_ENABLED",()=>!0);ce.registerFlag("IS_TEST",()=>!1);ce.registerFlag("CHECK_COMPUTATION_FOR_ERRORS",()=>ce.getBool("DEBUG"));ce.registerFlag("WRAP_TO_IMAGEBITMAP",()=>!1);ce.registerFlag("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU",()=>!1);ce.registerFlag("USE_SETTIMEOUTCUSTOM",()=>!1);/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ae(t,e){let n=t;if(Q(t))return e==="string"?[]:[t.length];if(Mu(t)){const r=t.channels||"RGBA";return[t.height,t.width*r.length]}else if(Wu(t))return[t.buffer.size/(e==null?4:On(e))];if(!Array.isArray(t))return[];const s=[];for(;Array.isArray(n)||Q(n)&&e!=="string";)s.push(n.length),n=n[0];return Array.isArray(t)&&O().getBool("TENSORLIKE_CHECK_SHAPE_CONSISTENCY")&&Hu(t,s,[]),s}function Hu(t,e,n){if(n=n||[],!Array.isArray(t)&&!Q(t)){d(e.length===0,()=>`Element arr[${n.join("][")}] is a primitive, but should be an array/TypedArray of ${e[0]} elements`);return}d(e.length>0,()=>`Element arr[${n.join("][")}] should be a primitive, but is an array of ${t.length} elements`),d(t.length===e[0],()=>`Element arr[${n.join("][")}] should have ${e[0]} elements, but has ${t.length} elements`);const s=e.slice(1);for(let r=0;r<t.length;++r)Hu(t[r],s,n.concat(r))}function pa(t,e,n,s){if(t!=="string_or_numeric"){if(t==null)throw new Error("Expected dtype cannot be null.");if(t!=="numeric"&&t!==e||t==="numeric"&&e==="string")throw new Error(`Argument '${n}' passed to '${s}' must be ${t} tensor, but got ${e} tensor`)}}function f(t,e,n,s="numeric"){if(t instanceof ju())return pa(s,t.dtype,e,n),t;let r=pn(t);if(r!=="string"&&["bool","int32","float32"].indexOf(s)>=0&&(r=s),pa(s,r,e,n),t==null||!Q(t)&&!Array.isArray(t)&&typeof t!="number"&&typeof t!="boolean"&&typeof t!="string"){const u=t==null?"null":t.constructor.name;throw new Error(`Argument '${e}' passed to '${n}' must be a Tensor or TensorLike, but got '${u}'`)}const a=Ae(t,r);!Q(t)&&!Array.isArray(t)&&(t=[t]);const i=r!=="string"?Gn(t,r):Ze(t,[],!0);return b.makeTensor(i,a,r)}function en(t,e,n,s="numeric"){if(!Array.isArray(t))throw new Error(`Argument ${e} passed to ${n} must be a \`Tensor[]\` or \`TensorLike[]\``);return t.map((a,o)=>f(a,`${e}[${o}]`,n,s))}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ar="__op";function y(t){const e=Object.keys(t);if(e.length!==1)throw new Error(`Please provide an object with a single key (operation name) mapping to a function. Got an object with ${e.length} keys.`);let n=e[0];const s=t[n];n.endsWith("_")&&(n=n.substring(0,n.length-1)),n=n+ar;const r=(...a)=>{b.startScope(n);try{const o=s(...a);return Ye(o)&&console.error("Cannot return a Promise inside of tidy."),b.endScope(o),o}catch(o){throw b.endScope(null),o}};return Object.defineProperty(r,"name",{value:n,configurable:!0}),r}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Cm(t,e){const n=f(t,"real","complex"),s=f(e,"imag","complex");le(n.shape,s.shape,`real and imag shapes, ${n.shape} and ${s.shape}, must match in call to tf.complex().`);const r={real:n,imag:s};return b.runKernel(fo,r)}const je=y({complex_:Cm});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function nt(t,e,n,s){if(s==null)s=pn(t);else if(s==="complex64")throw new Error("Cannot construct a complex64 tensor directly. Please use tf.complex(real, imag).");if(Wu(t)||Mu(t)){if(s!=="float32"&&s!=="int32")throw new Error(`Creating tensor from GPU data only supports 'float32'|'int32' dtype, while the dtype is ${s}.`);return b.backend.createTensorFromGPUData(t,e||n,s)}if(!Q(t)&&!Array.isArray(t)&&typeof t!="number"&&typeof t!="boolean"&&typeof t!="string")throw new Error("values passed to tensor(values) must be a number/boolean/string or an array of numbers/booleans/strings, or a TypedArray");if(e!=null){ye(e);const r=j(e),a=j(n);d(r===a,()=>`Based on the provided shape, [${e}], the tensor should have ${r} values but has ${a}`);for(let o=0;o<n.length;++o){const i=n[o],u=o===n.length-1?i!==j(e.slice(o)):!0;d(n[o]===e[o]||!u,()=>`Error creating a new Tensor. Inferred shape (${n}) does not match the provided shape (${e}). `)}}return!Q(t)&&!Array.isArray(t)&&(t=[t]),e=e||n,t=s!=="string"?Gn(t,s):Ze(t,[],!0),b.makeTensor(t,e,s)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ee(t,e,n){const s=Ae(t,n);return nt(t,e,s,n)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ft={float32:4,float16:2,int32:4,uint16:2,uint8:1,bool:1,complex64:8};class ve{static join(e){return new ve(e).slice()}constructor(e){if(this.shards=[],this.previousShardIndex=0,e==null||(e instanceof Array||(e=[e]),e=e.map(s=>Q(s)?s.buffer:s),e.length===0))return;this.bufferUniformSize=e[0].byteLength;let n=0;for(let s=0;s<e.length;s++){const r=e[s];s!==e.length-1&&r.byteLength!==this.bufferUniformSize&&(this.bufferUniformSize=void 0);const a=n+r.byteLength;this.shards.push({buffer:r,start:n,end:a}),n=a}this.shards.length===0&&(this.byteLength=0),this.byteLength=this.shards[this.shards.length-1].end}slice(e=0,n=this.byteLength){if(this.shards.length===0)return new ArrayBuffer(0);if(e=isNaN(Number(e))?0:e,n=isNaN(Number(n))?0:n,e=Math.max(0,e),n=Math.min(this.byteLength,n),n<=e)return new ArrayBuffer(0);const s=this.findShardForByte(e);if(s===-1)throw new Error(`Could not find start shard for byte ${e}`);const r=n-e,a=new ArrayBuffer(r),o=new Uint8Array(a);let i=0;for(let u=s;u<this.shards.length;u++){const l=this.shards[u],p=e+i-l.start,m=i,N=Math.min(n,l.end)-l.start,S=new Uint8Array(l.buffer,p,N-p);if(o.set(S,m),i+=S.length,n<l.end)break}return a}findShardForByte(e){if(this.shards.length===0||e<0||e>=this.byteLength)return-1;if(this.bufferUniformSize!=null)return this.previousShardIndex=Math.floor(e/this.bufferUniformSize),this.previousShardIndex;function n(r){return e<r.start?-1:e>=r.end?1:0}if(n(this.shards[this.previousShardIndex])===0)return this.previousShardIndex;const s=Rm(this.shards,n);return s===-1?-1:(this.previousShardIndex=s,this.previousShardIndex)}}function Rm(t,e){let n=0,s=t.length;for(;n<=s;){const r=Math.floor((s-n)/2)+n,a=e(t[r]);if(a===0)return r;a<0?s=r:n=r+1}return-1}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Pm(){O().set("PROD",!0)}function Bm(){O().set("DEBUG",!0)}function Lm(){O().set("DEPRECATION_WARNINGS_ENABLED",!1),console.warn("TensorFlow.js deprecation warnings have been disabled.")}function zm(t){O().getBool("DEPRECATION_WARNINGS_ENABLED")&&console.warn(t+" You can disable deprecation warnings with tf.disableDeprecationWarnings().")}function Vm(){b.disposeVariables()}function jm(){return b}function Mm(){return b.memory()}function Wm(t){return b.profile(t)}function V(t,e){return b.tidy(t,e)}function ue(t){rr(t).forEach(n=>n.dispose())}function $e(t){return b.keep(t)}function Um(t){return b.time(t)}function Gm(t){return b.setBackend(t)}function qm(){return b.ready()}function Xu(){return b.backendName}function Km(t){b.removeBackend(t)}function Hm(t){return b.findBackend(t)}function Xm(t){return b.findBackendFactory(t)}function Jm(t,e,n=1){return b.registerBackend(t,e,n)}function Ju(){return b.backend}function Ym(t,e){O().setPlatform(t,e)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Qe=4;async function Zm(t,e){const n=[],s=[],r=Array.isArray(t)?t.map(o=>o.name):Object.keys(t);for(let o=0;o<r.length;++o){const i=r[o],u=Array.isArray(t)?t[o].tensor:t[i];if(u.dtype!=="float32"&&u.dtype!=="int32"&&u.dtype!=="bool"&&u.dtype!=="string"&&u.dtype!=="complex64")throw new Error(`Unsupported dtype in weight '${i}': ${u.dtype}`);const l={name:i,shape:u.shape,dtype:u.dtype};if(u.dtype==="string"){const h=new Promise(async p=>{const m=await u.bytes(),g=m.reduce((w,T)=>w+T.length,0)+Qe*m.length,N=new Uint8Array(g);let S=0;for(let w=0;w<m.length;w++){const T=m[w],v=new Uint8Array(new Uint32Array([T.length]).buffer);N.set(v,S),S+=Qe,N.set(T,S),S+=T.length}p(N)});s.push(h)}else s.push(u.data());e!=null&&(l.group=e),n.push(l)}const a=await Promise.all(s);return{data:tf(a),specs:n}}function Yu(t,e){const n=new ve(t),s={};let r=0;for(const a of e){const o=Qm(a,(i,u)=>n.slice(r+i,r+u));s[a.name]=Zu(a,n.slice(r,r+o)),r+=o}return s}function Qm(t,e){const n=j(t.shape);let s;if("quantization"in t){const r=t.quantization;s=ft[r.dtype]}else if(t.dtype==="string"){let r=0;for(let a=0;a<n;a++)r+=Qe+new Uint32Array(e(r,r+Qe))[0];return r}else s=ft[t.dtype];return n*s}async function ef(t,e){const n=j(t.shape);let s;if("quantization"in t){const r=t.quantization;s=ft[r.dtype]}else if(t.dtype==="string"){let r=0;for(let a=0;a<n;a++)r+=Qe+new Uint32Array(await e(r,r+Qe))[0];return r}else s=ft[t.dtype];return n*s}function Zu(t,e){const n=t.name,s=t.dtype,r=t.shape,a=j(r);let o,i=0;if("quantization"in t){const u=t.quantization;if(u.dtype==="uint8"||u.dtype==="uint16"){if(!("min"in u&&"scale"in u))throw new Error(`Weight ${t.name} with quantization ${u.dtype} doesn't have corresponding metadata min and scale.`)}else if(u.dtype==="float16"){if(s!=="float32")throw new Error(`Weight ${t.name} is quantized with ${u.dtype} which only supports weights of type float32 not ${s}.`)}else throw new Error(`Weight ${t.name} has unknown quantization dtype ${u.dtype}. Supported quantization dtypes are: 'uint8', 'uint16', and 'float16'.`);const l=ft[u.dtype],h=u.dtype==="uint8"?new Uint8Array(e):new Uint16Array(e);if(s==="float32")if(u.dtype==="uint8"||u.dtype==="uint16"){o=new Float32Array(h.length);for(let p=0;p<h.length;p++){const m=h[p];o[p]=m*u.scale+u.min}}else if(u.dtype==="float16")o=lf()(h);else throw new Error(`Unsupported quantization type ${u.dtype} for weight type float32.`);else if(s==="int32"){if(u.dtype!=="uint8"&&u.dtype!=="uint16")throw new Error(`Unsupported quantization type ${u.dtype} for weight type int32.`);o=new Int32Array(h.length);for(let p=0;p<h.length;p++){const m=h[p];o[p]=Math.round(m*u.scale+u.min)}}else throw new Error(`Unsupported dtype in weight '${n}': ${s}`);i+=a*l}else if(s==="string"){const u=j(t.shape);o=[];for(let l=0;l<u;l++){const h=new Uint32Array(e.slice(i,i+Qe))[0];i+=Qe;const p=new Uint8Array(e.slice(i,i+h));o.push(p),i+=h}}else{const u=ft[s];if(s==="float32")o=new Float32Array(e);else if(s==="int32")o=new Int32Array(e);else if(s==="bool")o=new Uint8Array(e);else if(s==="complex64"){o=new Float32Array(e);const l=new Float32Array(o.length/2),h=new Float32Array(o.length/2);for(let N=0;N<l.length;N++)l[N]=o[N*2],h[N]=o[N*2+1];const p=Ee(l,r,"float32"),m=Ee(h,r,"float32"),g=je(p,m);return p.dispose(),m.dispose(),g}else throw new Error(`Unsupported dtype in weight '${n}': ${s}`);i+=a*u}return Ee(o,r,s)}async function ha(t,e,n){let s=new Uint8Array(e);for(;s.byteLength<n;){const{done:r,value:a}=await t.read();if(r&&a==null){const i=n-s.byteLength;throw new Error(`Reader is done but ${i} bytes are still expected`)}const o=new Uint8Array(s.length+a.byteLength);o.set(s,0),o.set(new Uint8Array(a),s.length),s=o}return s.buffer}async function Qu(t,e){const n={},s=t.getReader();let r=new ArrayBuffer(0);for(const a of e){const o=await ef(a,async(l,h)=>(r=await ha(s,r,h),r.slice(l,h)));r=await ha(s,r,o);const i=r.slice(0,o);r=r.slice(o);const u=Zu(a,i);if(n[a.name]=u,Xu()==="webgpu"){const l=Ju();"uploadToGPU"in l&&j(u.shape)>=O().get("WEBGPU_CPU_HANDOFF_SIZE_THRESHOLD")&&l.uploadToGPU(u.dataId)}}return n}function tf(t){if(t===null)throw new Error(`Invalid input value: ${JSON.stringify(t)}`);let e=0;const n=[];t.forEach(a=>{if(e+=a.byteLength,n.push(a.byteLength===a.buffer.byteLength?a:new a.constructor(a)),!(a instanceof Float32Array||a instanceof Int32Array||a instanceof Uint8Array))throw new Error(`Unsupported TypedArray subtype: ${a.constructor.name}`)});const s=new Uint8Array(e);let r=0;return n.forEach(a=>{s.set(new Uint8Array(a.buffer),r),r+=a.byteLength}),s.buffer}const or=typeof Buffer<"u"&&(typeof Blob>"u"||typeof atob>"u"||typeof btoa>"u");function ma(t){return or?Buffer.byteLength(t,"utf8"):new Blob([t]).size}function nf(t){if(or)return Buffer.from(t).toString("base64");const e=new Uint8Array(t);let n="";for(let s=0,r=e.length;s<r;s++)n+=String.fromCharCode(e[s]);return btoa(n)}function sf(t){if(or){const s=Buffer.from(t,"base64");return s.buffer.slice(s.byteOffset,s.byteOffset+s.byteLength)}const e=atob(t),n=new Uint8Array(e.length);for(let s=0;s<e.length;++s)n.set([e.charCodeAt(s)],s);return n.buffer}function rf(t){return ve.join(t)}function fa(t){const e="/";for(t=t.trim();t.endsWith(e);)t=t.slice(0,t.length-1);const n=t.split(e);return n[n.length-1]}function el(t,e){const n={modelTopology:t.modelTopology,format:t.format,generatedBy:t.generatedBy,convertedBy:t.convertedBy,weightsManifest:e};return t.signature!=null&&(n.signature=t.signature),t.userDefinedMetadata!=null&&(n.userDefinedMetadata=t.userDefinedMetadata),t.modelInitializer!=null&&(n.modelInitializer=t.modelInitializer),t.initializerSignature!=null&&(n.initializerSignature=t.initializerSignature),t.trainingConfig!=null&&(n.trainingConfig=t.trainingConfig),n}function ir(t,e,n){const s={modelTopology:t.modelTopology,format:t.format,generatedBy:t.generatedBy,convertedBy:t.convertedBy};if(t.trainingConfig!=null&&(s.trainingConfig=t.trainingConfig),t.weightsManifest!=null){if(!e)throw new Error("modelJSON has weightsManifest but weightSpecs is null");if(!n)throw new Error("modelJSON has weightsManifest but weightData is null");s.weightSpecs=e,s.weightData=n}return t.signature!=null&&(s.signature=t.signature),t.userDefinedMetadata!=null&&(s.userDefinedMetadata=t.userDefinedMetadata),t.modelInitializer!=null&&(s.modelInitializer=t.modelInitializer),t.initializerSignature!=null&&(s.initializerSignature=t.initializerSignature),s}async function ur(t,e){let n,s;return t.weightsManifest!=null&&([n,s]=await e(t.weightsManifest)),ir(t,n,s)}function fn(t){if(t.modelTopology instanceof ArrayBuffer)throw new Error("Expected JSON model topology, received ArrayBuffer.");return{dateSaved:new Date,modelTopologyType:"JSON",modelTopologyBytes:t.modelTopology==null?0:ma(JSON.stringify(t.modelTopology)),weightSpecsBytes:t.weightSpecs==null?0:ma(JSON.stringify(t.weightSpecs)),weightDataBytes:t.weightData==null?0:new ve(t.weightData).byteLength}}function Pn(t){const e=[];for(const n of t)e.push(...n.weights);return e}function af(){const t=n=>{let s=n<<13,r=0;for(;!(s&8388608);)r-=8388608,s<<=1;return s&=-8388609,r+=947912704,s|r},e=new Uint32Array(2048);e[0]=0;for(let n=1;n<1024;n++)e[n]=t(n);for(let n=1024;n<2048;n++)e[n]=939524096+(n-1024<<13);return e}function of(){const t=new Uint32Array(64);t[0]=0,t[31]=1199570944,t[32]=2147483648,t[63]=3347054592;for(let e=1;e<31;e++)t[e]=e<<23;for(let e=33;e<63;e++)t[e]=2147483648+(e-32<<23);return t}function uf(){const t=new Uint32Array(64);for(let e=0;e<64;e++)t[e]=1024;return t[0]=t[32]=0,t}function lf(){const t=af(),e=of(),n=uf();return s=>{const r=new ArrayBuffer(4*s.length),a=new Uint32Array(r);for(let o=0;o<s.length;o++){const i=s[o],u=t[n[i>>10]+(i&1023)]+e[i>>10];a[o]=u}return new Float32Array(r)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class K{constructor(){this.saveRouters=[],this.loadRouters=[]}static getInstance(){return K.instance==null&&(K.instance=new K),K.instance}static registerSaveRouter(e){K.getInstance().saveRouters.push(e)}static registerLoadRouter(e){K.getInstance().loadRouters.push(e)}static getSaveHandlers(e){return K.getHandlers(e,"save")}static getLoadHandlers(e,n){return K.getHandlers(e,"load",n)}static getHandlers(e,n,s){const r=[];return(n==="load"?K.getInstance().loadRouters:K.getInstance().saveRouters).forEach(o=>{const i=o(e,s);i!==null&&r.push(i)}),r}}const cf=t=>K.registerSaveRouter(t),pf=t=>K.registerLoadRouter(t),hf=t=>K.getSaveHandlers(t),mf=(t,e)=>K.getLoadHandlers(t,e);/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Is="tensorflowjs",As=1,ct="models_store",Ke="model_info_store";function tl(){if(!O().getBool("IS_BROWSER"))throw new Error("Failed to obtain IndexedDB factory because the current environmentis not a web browser.");const t=typeof window>"u"?self:window,e=t.indexedDB||t.mozIndexedDB||t.webkitIndexedDB||t.msIndexedDB||t.shimIndexedDB;if(e==null)throw new Error("The current browser does not appear to support IndexedDB.");return e}function xs(t){const e=t.result;e.createObjectStore(ct,{keyPath:"modelPath"}),e.createObjectStore(Ke,{keyPath:"modelPath"})}class dt{constructor(e){if(this.indexedDB=tl(),e==null||!e)throw new Error("For IndexedDB, modelPath must not be null, undefined or empty.");this.modelPath=e}async save(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");return this.databaseAction(this.modelPath,e)}async load(){return this.databaseAction(this.modelPath)}databaseAction(e,n){return new Promise((s,r)=>{const a=this.indexedDB.open(Is,As);a.onupgradeneeded=()=>xs(a),a.onsuccess=()=>{const o=a.result;if(n==null){const i=o.transaction(ct,"readonly"),l=i.objectStore(ct).get(this.modelPath);l.onsuccess=()=>{if(l.result==null)return o.close(),r(new Error(`Cannot find model with path '${this.modelPath}' in IndexedDB.`));s(l.result.modelArtifacts)},l.onerror=h=>(o.close(),r(l.error)),i.oncomplete=()=>o.close()}else{n.weightData=ve.join(n.weightData);const i=fn(n),u=o.transaction(Ke,"readwrite");let l=u.objectStore(Ke),h;try{h=l.put({modelPath:this.modelPath,modelArtifactsInfo:i})}catch(m){return r(m)}let p;h.onsuccess=()=>{p=o.transaction(ct,"readwrite");const m=p.objectStore(ct);let g;try{g=m.put({modelPath:this.modelPath,modelArtifacts:n,modelArtifactsInfo:i})}catch(N){return r(N)}g.onsuccess=()=>s({modelArtifactsInfo:i}),g.onerror=N=>{l=u.objectStore(Ke);const S=l.delete(this.modelPath);S.onsuccess=()=>(o.close(),r(g.error)),S.onerror=w=>(o.close(),r(g.error))}},h.onerror=m=>(o.close(),r(h.error)),u.oncomplete=()=>{p==null?o.close():p.oncomplete=()=>o.close()}}},a.onerror=o=>r(a.error)})}}dt.URL_SCHEME="indexeddb://";const nl=t=>O().getBool("IS_BROWSER")&&!Array.isArray(t)&&t.startsWith(dt.URL_SCHEME)?ff(t.slice(dt.URL_SCHEME.length)):null;K.registerSaveRouter(nl);K.registerLoadRouter(nl);function ff(t){return new dt(t)}function df(t){return t.startsWith(dt.URL_SCHEME)?t.slice(dt.URL_SCHEME.length):t}class gf{constructor(){this.indexedDB=tl()}async listModels(){return new Promise((e,n)=>{const s=this.indexedDB.open(Is,As);s.onupgradeneeded=()=>xs(s),s.onsuccess=()=>{const r=s.result,a=r.transaction(Ke,"readonly"),i=a.objectStore(Ke).getAll();i.onsuccess=()=>{const u={};for(const l of i.result)u[l.modelPath]=l.modelArtifactsInfo;e(u)},i.onerror=u=>(r.close(),n(i.error)),a.oncomplete=()=>r.close()},s.onerror=r=>n(s.error)})}async removeModel(e){return e=df(e),new Promise((n,s)=>{const r=this.indexedDB.open(Is,As);r.onupgradeneeded=()=>xs(r),r.onsuccess=()=>{const a=r.result,o=a.transaction(Ke,"readwrite"),i=o.objectStore(Ke),u=i.get(e);let l;u.onsuccess=()=>{if(u.result==null)return a.close(),s(new Error(`Cannot find model with path '${e}' in IndexedDB.`));{const h=i.delete(e),p=()=>{l=a.transaction(ct,"readwrite");const g=l.objectStore(ct).delete(e);g.onsuccess=()=>n(u.result.modelArtifactsInfo),g.onerror=N=>s(u.error)};h.onsuccess=p,h.onerror=m=>(p(),a.close(),s(u.error))}},u.onerror=h=>(a.close(),s(u.error)),o.oncomplete=()=>{l==null?a.close():l.oncomplete=()=>a.close()}},r.onerror=a=>s(r.error)})}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Le="/",_t="tensorflowjs_models",sl="info",yf="model_topology",bf="weight_specs",wf="weight_data",Nf="model_metadata";function rl(t){return{info:[_t,t,sl].join(Le),topology:[_t,t,yf].join(Le),weightSpecs:[_t,t,bf].join(Le),weightData:[_t,t,wf].join(Le),modelMetadata:[_t,t,Nf].join(Le)}}function al(t){for(const e of Object.values(t))window.localStorage.removeItem(e)}function Sf(t){const e=t.split(Le);if(e.length<3)throw new Error(`Invalid key format: ${t}`);return e.slice(1,e.length-1).join(Le)}function Tf(t){return t.startsWith(gt.URL_SCHEME)?t.slice(gt.URL_SCHEME.length):t}class gt{constructor(e){if(!O().getBool("IS_BROWSER")||typeof window>"u"||typeof window.localStorage>"u")throw new Error("The current environment does not support local storage.");if(this.LS=window.localStorage,e==null||!e)throw new Error("For local storage, modelPath must not be null, undefined or empty.");this.modelPath=e,this.keys=rl(this.modelPath)}async save(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");{const n=JSON.stringify(e.modelTopology),s=JSON.stringify(e.weightSpecs),r=fn(e),a=ve.join(e.weightData);try{this.LS.setItem(this.keys.info,JSON.stringify(r)),this.LS.setItem(this.keys.topology,n),this.LS.setItem(this.keys.weightSpecs,s),this.LS.setItem(this.keys.weightData,nf(a));const o={format:e.format,generatedBy:e.generatedBy,convertedBy:e.convertedBy,signature:e.signature!=null?e.signature:void 0,userDefinedMetadata:e.userDefinedMetadata!=null?e.userDefinedMetadata:void 0,modelInitializer:e.modelInitializer!=null?e.modelInitializer:void 0,initializerSignature:e.initializerSignature!=null?e.initializerSignature:void 0,trainingConfig:e.trainingConfig!=null?e.trainingConfig:void 0};return this.LS.setItem(this.keys.modelMetadata,JSON.stringify(o)),{modelArtifactsInfo:r}}catch{throw al(this.keys),new Error(`Failed to save model '${this.modelPath}' to local storage: size quota being exceeded is a possible cause of this failure: modelTopologyBytes=${r.modelTopologyBytes}, weightSpecsBytes=${r.weightSpecsBytes}, weightDataBytes=${r.weightDataBytes}.`)}}}async load(){const e=JSON.parse(this.LS.getItem(this.keys.info));if(e==null)throw new Error(`In local storage, there is no model with name '${this.modelPath}'`);if(e.modelTopologyType!=="JSON")throw new Error("BrowserLocalStorage does not support loading non-JSON model topology yet.");const n={},s=JSON.parse(this.LS.getItem(this.keys.topology));if(s==null)throw new Error(`In local storage, the topology of model '${this.modelPath}' is missing.`);n.modelTopology=s;const r=JSON.parse(this.LS.getItem(this.keys.weightSpecs));if(r==null)throw new Error(`In local storage, the weight specs of model '${this.modelPath}' are missing.`);n.weightSpecs=r;const a=this.LS.getItem(this.keys.modelMetadata);if(a!=null){const i=JSON.parse(a);n.format=i.format,n.generatedBy=i.generatedBy,n.convertedBy=i.convertedBy,i.signature!=null&&(n.signature=i.signature),i.userDefinedMetadata!=null&&(n.userDefinedMetadata=i.userDefinedMetadata),i.modelInitializer!=null&&(n.modelInitializer=i.modelInitializer),i.initializerSignature!=null&&(n.initializerSignature=i.initializerSignature),i.trainingConfig!=null&&(n.trainingConfig=i.trainingConfig)}const o=this.LS.getItem(this.keys.weightData);if(o==null)throw new Error(`In local storage, the binary weight values of model '${this.modelPath}' are missing.`);return n.weightData=sf(o),n}}gt.URL_SCHEME="localstorage://";const ol=t=>O().getBool("IS_BROWSER")&&!Array.isArray(t)&&t.startsWith(gt.URL_SCHEME)?$f(t.slice(gt.URL_SCHEME.length)):null;K.registerSaveRouter(ol);K.registerLoadRouter(ol);function $f(t){return new gt(t)}class Ef{constructor(){d(O().getBool("IS_BROWSER"),()=>"Current environment is not a web browser"),d(typeof window>"u"||typeof window.localStorage<"u",()=>"Current browser does not appear to support localStorage"),this.LS=window.localStorage}async listModels(){const e={},n=_t+Le,s=Le+sl;for(let r=0;r<this.LS.length;++r){const a=this.LS.key(r);if(a.startsWith(n)&&a.endsWith(s)){const o=Sf(a);e[o]=JSON.parse(this.LS.getItem(a))}}return e}async removeModel(e){e=Tf(e);const n=rl(e);if(this.LS.getItem(n.info)==null)throw new Error(`Cannot find model at path '${e}'`);const s=JSON.parse(this.LS.getItem(n.info));return al(n),s}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const vt="://";class ae{constructor(){this.managers={}}static getInstance(){return ae.instance==null&&(ae.instance=new ae),ae.instance}static registerManager(e,n){d(e!=null,()=>"scheme must not be undefined or null."),e.endsWith(vt)&&(e=e.slice(0,e.indexOf(vt))),d(e.length>0,()=>"scheme must not be an empty string.");const s=ae.getInstance();d(s.managers[e]==null,()=>`A model store manager is already registered for scheme '${e}'.`),s.managers[e]=n}static getManager(e){const n=ae.getInstance().managers[e];if(n==null)throw new Error(`Cannot find model manager for scheme '${e}'`);return n}static getSchemes(){return Object.keys(ae.getInstance().managers)}}function In(t){if(t.indexOf(vt)===-1)throw new Error(`The url string provided does not contain a scheme. Supported schemes are: ${ae.getSchemes().join(",")}`);return{scheme:t.split(vt)[0],path:t.split(vt)[1]}}async function il(t,e,n=!1){d(t!==e,()=>`Old path and new path are the same: '${t}'`);const s=K.getLoadHandlers(t);d(s.length>0,()=>`Copying failed because no load handler is found for source URL ${t}.`),d(s.length<2,()=>`Copying failed because more than one (${s.length}) load handlers for source URL ${t}.`);const r=s[0],a=K.getSaveHandlers(e);d(a.length>0,()=>`Copying failed because no save handler is found for destination URL ${e}.`),d(a.length<2,()=>`Copying failed because more than one (${s.length}) save handlers for destination URL ${e}.`);const o=a[0],i=In(t).scheme,u=In(t).path,l=i===In(t).scheme,h=await r.load();n&&l&&await ae.getManager(i).removeModel(u);const p=await o.save(h);return n&&!l&&await ae.getManager(i).removeModel(u),p.modelArtifactsInfo}async function kf(){const t=ae.getSchemes(),e={};for(const n of t){const s=await ae.getManager(n).listModels();for(const r in s){const a=n+vt+r;e[a]=s[r]}}return e}async function _f(t){const e=In(t);return ae.getManager(e.scheme).removeModel(e.path)}async function vf(t,e){return il(t,e,!1)}async function If(t,e){return il(t,e,!0)}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Af{constructor(){this.messageName="setTimeoutCustom",this.functionRefs=[],this.handledMessageCount=0,this.hasEventListener=!1}fetch(e,n){return fetch(e,n)}now(){return performance.now()}encode(e,n){if(n!=="utf-8"&&n!=="utf8")throw new Error(`Browser's encoder only supports utf-8, but got ${n}`);return this.textEncoder==null&&(this.textEncoder=new TextEncoder),this.textEncoder.encode(e)}decode(e,n){return new TextDecoder(n).decode(e)}setTimeoutCustom(e,n){if(typeof window>"u"||!O().getBool("USE_SETTIMEOUTCUSTOM")){setTimeout(e,n);return}this.functionRefs.push(e),setTimeout(()=>{window.postMessage({name:this.messageName,index:this.functionRefs.length-1},"*")},n),this.hasEventListener||(this.hasEventListener=!0,window.addEventListener("message",s=>{if(s.source===window&&s.data.name===this.messageName){s.stopPropagation();const r=this.functionRefs[s.data.index];r(),this.handledMessageCount++,this.handledMessageCount===this.functionRefs.length&&(this.functionRefs=[],this.handledMessageCount=0)}},!0))}isTypedArray(e){return Bu(e)}}if(O().get("IS_BROWSER")){O().setPlatform("browser",new Af);try{ae.registerManager(gt.URL_SCHEME,new Ef)}catch{}try{ae.registerManager(dt.URL_SCHEME,new gf)}catch{}}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const xf={importFetch:()=>require("node-fetch")};let ps;class Of{constructor(){this.util=require("util"),this.textEncoder=new this.util.TextEncoder}fetch(e,n){return O().global.fetch!=null?O().global.fetch(e,n):(ps==null&&(ps=xf.importFetch()),ps(e,n))}now(){const e=process.hrtime();return e[0]*1e3+e[1]/1e6}encode(e,n){if(n!=="utf-8"&&n!=="utf8")throw new Error(`Node built-in encoder only supports utf-8, but got ${n}`);return this.textEncoder.encode(e)}decode(e,n){return e.length===0?"":new this.util.TextDecoder(n).decode(e)}isTypedArray(e){return this.util.types.isFloat32Array(e)||this.util.types.isInt32Array(e)||this.util.types.isUint8Array(e)||this.util.types.isUint8ClampedArray(e)}}O().get("IS_NODE")&&!O().get("IS_BROWSER")&&O().setPlatform("node",new Of);/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function xe(t,e="float32",n){return e=e||"float32",ye(t),new Rn(t,e,n)}/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Df(t,e){const n=f(t,"x","cast");if(!za(e))throw new Error(`Failed to cast to unknown dtype ${e}`);if(e==="string"&&n.dtype!=="string"||e!=="string"&&n.dtype==="string")throw new Error("Only strings can be casted to strings");const s={x:n},r={dtype:e};return b.runKernel(Qs,s,r)}const q=y({cast_:Df});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ff(t){const n={x:f(t,"x","clone","string_or_numeric")};return b.runKernel(tr,n)}const ze=y({clone_:Ff});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function lr(t,e=!1){console.log(t.toString(e))}/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */qu();const Cf={buffer:xe,cast:q,clone:ze,print:lr};Tm(Cf);/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Rf(t,e){let n=f(t,"a","add"),s=f(e,"b","add");[n,s]=H(n,s);const r={a:n,b:s};return b.runKernel(Zs,r)}const x=y({add_:Rf});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Pf(t,e){let n=f(t,"a","floorDiv"),s=f(e,"b","floorDiv");[n,s]=H(n,s);const r={a:n,b:s};return b.runKernel(Ko,r)}const cr=y({floorDiv_:Pf});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Bf(t,e){let n=f(t,"a","div"),s=f(e,"b","div");if([n,s]=H(n,s),n.dtype==="int32"&&s.dtype==="int32")return cr(n,s);const r={a:n,b:s},a={};return b.runKernel(Ro,r,a)}const G=y({div_:Bf});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Lf(t,e){let n=f(t,"a","mul"),s=f(e,"b","mul");[n,s]=H(n,s);const r={a:n,b:s};return b.runKernel(ki,r)}const _=y({mul_:Lf});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function zf(t){const e=f(t,"x","abs");if(e.dtype==="complex64"){const n={x:e};return b.runKernel(go,n)}else{const n={x:e};return b.runKernel(qa,n)}}const de=y({abs_:zf});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Vf(t){const n={x:f(t,"x","acos")};return b.runKernel(Ka,n)}const ul=y({acos_:Vf});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function jf(t){const n={x:f(t,"x","acosh")};return b.runKernel(Ha,n)}const ll=y({acosh_:jf});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Mf(t){d(Array.isArray(t),()=>"The argument passed to tf.addN() must be a list of tensors"),d(t.length>=1,()=>`Must pass at least one tensor to tf.addN(), but got ${t.length}`);const e=t.map((r,a)=>f(r,`tensors${a}`,"addN")),n=e[0];e.forEach(r=>{if(r.dtype!==n.dtype)throw new Error("All tensors passed to tf.addN() must have the same dtype")}),e.forEach(r=>{if(!_e(r.shape,n.shape))throw new Error("All tensors passed to tf.addN() must have the same shape")});const s=e;return b.runKernel(Xa,s)}const cl=y({addN_:Mf});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Wf(t,e=null,n=!1){const r={x:f(t,"x","all","bool")},a={axis:e,keepDims:n};return b.runKernel(Ja,r,a)}const pl=y({all_:Wf});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Uf(t,e=null,n=!1){const r={x:f(t,"x","any","bool")},a={axis:e,keepDims:n};return b.runKernel(Ya,r,a)}const hl=y({any_:Uf});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Gf(t,e=0){const s={x:f(t,"x","argMax")},r={axis:e};return b.runKernel(Za,s,r)}const ml=y({argMax_:Gf});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function qf(t,e=0){const s={x:f(t,"x","argMin")},r={axis:e};return b.runKernel(Qa,s,r)}const fl=y({argMin_:qf});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Kf(t){const n={x:f(t,"x","asin")};return b.runKernel(eo,n)}const dl=y({asin_:Kf});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Hf(t){const n={x:f(t,"x","asinh")};return b.runKernel(to,n)}const gl=y({asinh_:Hf});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Xf(t){const n={x:f(t,"x","atan")};return b.runKernel(no,n)}const yl=y({atan_:Xf});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Jf(t,e){let n=f(t,"a","atan2"),s=f(e,"b","atan2");[n,s]=H(n,s);const r={a:n,b:s};return b.runKernel(ro,r)}const bl=y({atan2_:Jf});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Yf(t){const n={x:f(t,"x","atanh")};return b.runKernel(so,n)}const wl=y({atanh_:Yf});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Zf(t,e,n,s,r="NHWC",a){const o=t[3],i=[...e,o],u=Tl(r);return dn(t,i,n,a,s,null,null,u)}function Nl(t,e,n,s,r,a,o="channelsLast"){const[i,u]=tn(e);let l;if(o==="channelsLast")l=[i,u,t[3],t[3]];else if(o==="channelsFirst")l=[i,u,t[1],t[1]];else throw new Error(`Unknown dataFormat ${o}`);return dn(t,l,n,s,r,a,!1,o)}function Qf(t,e,n,s,r,a,o="NDHWC"){const[i,u,l]=Os(e);let h,p;if(o==="NDHWC")p="channelsLast",h=[i,u,l,t[4],t[4]];else if(o==="NCDHW")p="channelsFirst",h=[i,u,l,t[1],t[1]];else throw new Error(`Unknown dataFormat ${o}`);return Sl(t,h,n,s,r,!1,p,a)}function dn(t,e,n,s,r,a,o=!1,i="channelsLast"){let[u,l,h,p]=[-1,-1,-1,-1];if(i==="channelsLast")[u,l,h,p]=t;else if(i==="channelsFirst")[u,p,l,h]=t;else throw new Error(`Unknown dataFormat ${i}`);const[m,g,,N]=e,[S,w]=tn(n),[T,v]=tn(s),E=It(m,T),k=It(g,v),{padInfo:A,outHeight:I,outWidth:C}=nd(r,l,h,S,w,E,k,a,i),P=o?N*p:N;let D;return i==="channelsFirst"?D=[u,P,I,C]:i==="channelsLast"&&(D=[u,I,C,P]),{batchSize:u,dataFormat:i,inHeight:l,inWidth:h,inChannels:p,outHeight:I,outWidth:C,outChannels:P,padInfo:A,strideHeight:S,strideWidth:w,filterHeight:m,filterWidth:g,effectiveFilterHeight:E,effectiveFilterWidth:k,dilationHeight:T,dilationWidth:v,inShape:t,outShape:D,filterShape:e}}function Sl(t,e,n,s,r,a=!1,o="channelsLast",i){let[u,l,h,p,m]=[-1,-1,-1,-1,-1];if(o==="channelsLast")[u,l,h,p,m]=t;else if(o==="channelsFirst")[u,m,l,h,p]=t;else throw new Error(`Unknown dataFormat ${o}`);const[g,N,S,,w]=e,[T,v,E]=Os(n),[k,A,I]=Os(s),C=It(g,k),P=It(N,A),D=It(S,I),{padInfo:L,outDepth:B,outHeight:Y,outWidth:ne}=sd(r,l,h,p,T,v,E,C,P,D,i),re=a?w*m:w;let pe;return o==="channelsFirst"?pe=[u,re,B,Y,ne]:o==="channelsLast"&&(pe=[u,B,Y,ne,re]),{batchSize:u,dataFormat:o,inDepth:l,inHeight:h,inWidth:p,inChannels:m,outDepth:B,outHeight:Y,outWidth:ne,outChannels:re,padInfo:L,strideDepth:T,strideHeight:v,strideWidth:E,filterDepth:g,filterHeight:N,filterWidth:S,effectiveFilterDepth:C,effectiveFilterHeight:P,effectiveFilterWidth:D,dilationDepth:k,dilationHeight:A,dilationWidth:I,inShape:t,outShape:pe,filterShape:e}}function ed(t,e,n,s,r){s==null&&(s=pr(t,e,n));const a=t[0],o=t[1],i=nn((a-e+2*s)/n+1,r),u=nn((o-e+2*s)/n+1,r);return[i,u]}function td(t,e,n,s,r,a){r==null&&(r=pr(t,e[0],s[0]));const o=[0,0,0,n];for(let i=0;i<3;i++)t[i]+2*r>=e[i]&&(o[i]=nn((t[i]-e[i]+2*r)/s[i]+1,a));return o}function pr(t,e,n,s=1){const r=It(e,s);return Math.floor((t[0]*(n-1)-n+r)/2)}function tn(t){return typeof t=="number"?[t,t,t]:t.length===2?[t[0],t[1],1]:t}function Os(t){return typeof t=="number"?[t,t,t]:t}function It(t,e){return e<=1?t:t+(t-1)*(e-1)}function nd(t,e,n,s,r,a,o,i,u){let l,h,p;if(typeof t=="number"){l={top:t,bottom:t,left:t,right:t,type:t===0?"VALID":"NUMBER"};const g=ed([e,n],a,s,t,i);h=g[0],p=g[1]}else if(t==="same"){h=Math.ceil(e/s),p=Math.ceil(n/r);const m=Math.max(0,(h-1)*s+a-e),g=Math.max(0,(p-1)*r+o-n),N=Math.floor(m/2),S=m-N,w=Math.floor(g/2),T=g-w;l={top:N,bottom:S,left:w,right:T,type:"SAME"}}else if(t==="valid")l={top:0,bottom:0,left:0,right:0,type:"VALID"},h=Math.ceil((e-a+1)/s),p=Math.ceil((n-o+1)/r);else if(typeof t=="object"){const m=u==="channelsLast"?t[1][0]:t[2][0],g=u==="channelsLast"?t[1][1]:t[2][1],N=u==="channelsLast"?t[2][0]:t[3][0],S=u==="channelsLast"?t[2][1]:t[3][1];l={top:m,bottom:g,left:N,right:S,type:m===0&&g===0&&N===0&&S===0?"VALID":"EXPLICIT"},h=nn((e-a+m+g)/s+1,i),p=nn((n-o+N+S)/r+1,i)}else throw Error(`Unknown padding parameter: ${t}`);return{padInfo:l,outHeight:h,outWidth:p}}function sd(t,e,n,s,r,a,o,i,u,l,h){let p,m,g,N;if(t==="valid"&&(t=0),typeof t=="number"){p={top:t,bottom:t,left:t,right:t,front:t,back:t,type:t===0?"VALID":"NUMBER"};const w=td([e,n,s,1],[i,u,l],1,[r,a,o],t,h);m=w[0],g=w[1],N=w[2]}else if(t==="same"){m=Math.ceil(e/r),g=Math.ceil(n/a),N=Math.ceil(s/o);const S=(m-1)*r+i-e,w=(g-1)*a+u-n,T=(N-1)*o+l-s,v=Math.floor(S/2),E=S-v,k=Math.floor(w/2),A=w-k,I=Math.floor(T/2),C=T-I;p={top:k,bottom:A,left:I,right:C,front:v,back:E,type:"SAME"}}else throw Error(`Unknown padding parameter: ${t}`);return{padInfo:p,outDepth:m,outHeight:g,outWidth:N}}function nn(t,e){if(!e)return Math.trunc(t);switch(e){case"round":return Math.round(t);case"ceil":return Math.ceil(t);case"floor":return Math.floor(t);default:throw new Error(`Unknown roundingMode ${e}`)}}function sn(t){const[e,n,s]=tn(t);return e===1&&n===1&&s===1}function Me(t,e){return sn(t)||sn(e)}function yt(t){return tn(t).every(e=>e>0)}function Tl(t){if(t==="NHWC")return"channelsLast";if(t==="NCHW")return"channelsFirst";throw new Error(`Unknown dataFormat ${t}`)}function Se(t,e,n){if(n!=null){if(typeof e=="string")throw Error(`Error in ${t}: pad must be an integer when using dimRoundingMode ${n} but got pad ${e}.`);if(typeof e=="number")d(Ot(e),()=>`Error in ${t}: pad must be an integer when using dimRoundingMode ${n} but got pad ${e}.`);else if(typeof e=="object")e.forEach(s=>{s.forEach(r=>{d(Ot(r),()=>`Error in ${t}: pad must be an integer when using dimRoundingMode ${n} but got pad ${r}.`)})});else throw Error(`Error in ${t}: Unknown padding parameter: ${e}`)}}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function rd(t,e){const s={x:f(t,"x","reshape","string_or_numeric")},r={shape:e};return b.runKernel(Gi,s,r)}const $=y({reshape_:rd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ad(t,e,n,s,r){const a=f(t,"x","avgPool","float32"),o=1;d(Me(n,o),()=>`Error in avgPool: Either strides or dilations must be 1. Got strides ${n} and dilations '${o}'`);let i=a,u=!1;a.rank===3&&(u=!0,i=$(a,[1,a.shape[0],a.shape[1],a.shape[2]])),d(i.rank===4,()=>`Error in avgPool: x must be rank 4 but got rank ${i.rank}.`),Se("avgPool",s,r);const l={x:i},h={filterSize:e,strides:n,pad:s,dimRoundingMode:r};let p=b.runKernel(ao,l,h);return p=q(p,a.dtype),u?$(p,[p.shape[1],p.shape[2],p.shape[3]]):p}const hr=y({avgPool_:ad});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function od(t,e,n,s,r,a="NDHWC"){const o=f(t,"x","avgPool3d","float32");let i=o,u=!1;o.rank===4&&(u=!0,i=$(o,[1,o.shape[0],o.shape[1],o.shape[2],o.shape[3]])),d(i.rank===5,()=>`Error in avgPool3d: x must be rank 5 but got rank ${i.rank}.`),d(a==="NDHWC",()=>`Error in avgPool3d: Only NDHWC is currently supported, but got dataFormat of ${a}`),d(typeof n=="number"&&n>0||Array.isArray(n)&&n[0]>0&&n[1]>0&&n[2]>0,()=>`Error in avgPool3d: Stride must be > 0, but got '${n}'`),Se("avgPool3d",s,r);const l={x:i},h={filterSize:e,strides:n,pad:s,dimRoundingMode:r,dataFormat:a};let p=b.runKernel(oo,l,h);return p=q(p,i.dtype),u?$(p,[p.shape[1],p.shape[2],p.shape[3],p.shape[4]]):p}const $l=y({avgPool3d_:od});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function id(t,e=0){d(t.length>=1,()=>"Pass at least one tensor to concat");const n=en(t,"tensors","concat","string_or_numeric");if(n[0].dtype==="complex64"&&n.forEach(a=>{if(a.dtype!=="complex64")throw new Error(`Cannot concatenate complex64 tensors with a tensor
          with dtype ${a.dtype}. `)}),n.length===1)return ze(n[0]);const s=n,r={axis:e};return b.runKernel(yo,s,r)}const se=y({concat_:id});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ud(t,e,n=!1,s=!1){let r=f(t,"a","matMul"),a=f(e,"b","matMul");[r,a]=H(r,a);const o={a:r,b:a},i={transposeA:n,transposeB:s};return b.runKernel(io,o,i)}const z=y({matMul_:ud});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ld(t){const n={x:f(t,"x","sigmoid","float32")};return b.runKernel(iu,n)}const ht=y({sigmoid_:ld});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function cd(t,e,n){const s=f(t,"x","slice","string_or_numeric");if(s.rank===0)throw new Error("Slicing scalar is not possible");const r={x:s},a={begin:e,size:n};return b.runKernel(su,r,a)}const M=y({slice_:cd});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function pd(t){const n={x:f(t,"x","tanh","float32")};return b.runKernel(vu,n)}const Bn=y({tanh_:pd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function hd(t,e,n,s,r,a){const o=f(t,"forgetBias","basicLSTMCell"),i=f(e,"lstmKernel","basicLSTMCell"),u=f(n,"lstmBias","basicLSTMCell"),l=f(s,"data","basicLSTMCell"),h=f(r,"c","basicLSTMCell"),p=f(a,"h","basicLSTMCell"),m=se([l,p],1),g=z(m,i),N=x(g,u),S=N.shape[0],w=N.shape[1]/4,T=[S,w],v=M(N,[0,0],T),E=M(N,[0,w],T),k=M(N,[0,w*2],T),A=M(N,[0,w*3],T),I=x(_(ht(v),Bn(E)),_(h,ht(x(o,k)))),C=_(Bn(I),ht(A));return[I,C]}const El=y({basicLSTMCell_:hd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function md(t,e,n){const s=f(t,"x","batchToSpaceND"),r=e.reduce((i,u)=>i*u);d(s.rank>=1+e.length,()=>`input rank is ${s.rank} but should be > than blockShape.length ${e.length}`),d(n.length===e.length,()=>`crops.length is ${n.length} but should be equal to blockShape.length  ${e.length}`),d(s.shape[0]%r===0,()=>`input tensor batch is ${s.shape[0]} but is not divisible by the product of the elements of blockShape ${e.join(" * ")} === ${r}`);const a={x:s},o={blockShape:e,crops:n};return b.runKernel(uo,a,o)}const mr=y({batchToSpaceND_:md});function fd(t){let e;return t.rank===0||t.rank===1?e=$(t,[1,1,1,t.size]):t.rank===2?e=$(t,[1,1,t.shape[0],t.shape[1]]):t.rank===3?e=$(t,[1,t.shape[0],t.shape[1],t.shape[2]]):e=t,e}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function dd(t,e,n,s,r,a){a==null&&(a=.001);const o=f(t,"x","batchNorm"),i=f(e,"mean","batchNorm"),u=f(n,"variance","batchNorm");let l;r!=null&&(l=f(r,"scale","batchNorm"));let h;s!=null&&(h=f(s,"offset","batchNorm")),d(i.rank===u.rank,()=>"Batch normalization gradient requires mean and variance to have equal ranks."),d(h==null||i.rank===h.rank,()=>"Batch normalization gradient requires mean and offset to have equal ranks."),d(l==null||i.rank===l.rank,()=>"Batch normalization gradient requires mean and scale to have equal ranks.");const m={x:fd(o),scale:l,offset:h,mean:i,variance:u},g={varianceEpsilon:a},N=b.runKernel(Ho,m,g);return $(N,o.shape)}const gn=y({batchNorm_:dd});function gd(t,e,n,s,r,a){const o=f(t,"x","batchNorm"),i=f(e,"mean","batchNorm"),u=f(n,"variance","batchNorm");let l;r!=null&&(l=f(r,"scale","batchNorm"));let h;return s!=null&&(h=f(s,"offset","batchNorm")),d(o.rank===2,()=>`Error in batchNorm2D: x must be rank 2 but got rank ${o.rank}.`),d(i.rank===2||i.rank===1,()=>`Error in batchNorm2D: mean must be rank 2 or rank 1 but got rank ${i.rank}.`),d(u.rank===2||u.rank===1,()=>`Error in batchNorm2D: variance must be rank 2 or rank 1 but got rank ${u.rank}.`),l!=null&&d(l.rank===2||l.rank===1,()=>`Error in batchNorm2D: scale must be rank 2 or rank 1 but got rank ${l.rank}.`),h!=null&&d(h.rank===2||h.rank===1,()=>`Error in batchNorm2D: offset must be rank 2 or rank 1 but got rank ${h.rank}.`),gn(o,i,u,h,l,a)}const kl=y({batchNorm2d_:gd});function yd(t,e,n,s,r,a){const o=f(t,"x","batchNorm"),i=f(e,"mean","batchNorm"),u=f(n,"variance","batchNorm");let l;r!=null&&(l=f(r,"scale","batchNorm"));let h;return s!=null&&(h=f(s,"offset","batchNorm")),d(o.rank===3,()=>`Error in batchNorm3D: x must be rank 3 but got rank ${o.rank}.`),d(i.rank===3||i.rank===1,()=>`Error in batchNorm3D: mean must be rank 3 or rank 1 but got rank ${i.rank}.`),d(u.rank===3||u.rank===1,()=>`Error in batchNorm3D: variance must be rank 3 or rank 1 but got rank ${u.rank}.`),l!=null&&d(l.rank===3||l.rank===1,()=>`Error in batchNorm3D: scale must be rank 3 or rank 1 but got rank ${l.rank}.`),h!=null&&d(h.rank===3||h.rank===1,()=>`Error in batchNorm3D: offset must be rank 3 or rank 1 but got rank ${h.rank}.`),gn(o,i,u,h,l,a)}const _l=y({batchNorm3d_:yd});function bd(t,e,n,s,r,a){const o=f(t,"x","batchNorm"),i=f(e,"mean","batchNorm"),u=f(n,"variance","batchNorm");let l;r!=null&&(l=f(r,"scale","batchNorm"));let h;return s!=null&&(h=f(s,"offset","batchNorm")),d(o.rank===4,()=>`Error in batchNorm4D: x must be rank 4 but got rank ${o.rank}.`),d(i.rank===4||i.rank===1,()=>`Error in batchNorm4D: mean must be rank 4 or rank 1 but got rank ${i.rank}.`),d(u.rank===4||u.rank===1,()=>`Error in batchNorm4D: variance must be rank 4 or rank 1 but got rank ${u.rank}.`),l!=null&&d(l.rank===4||l.rank===1,()=>`Error in batchNorm4D: scale must be rank 4 or rank 1 but got rank ${l.rank}.`),h!=null&&d(h.rank===4||h.rank===1,()=>`Error in batchNorm4D: offset must be rank 4 or rank 1 but got rank ${h.rank}.`),gn(o,i,u,h,l,a)}const vl=y({batchNorm4d_:bd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function wd(t,e,n){const s=f(t,"x","bincount"),r=f(e,"weights","bincount");d(s.dtype==="int32",()=>`Error in bincount: input dtype must be int32, but got ${s.dtype}`),d(n>=0,()=>`size must be non-negative, but got ${n}.`),d(r.size===s.size||r.size===0,()=>`Error in bincount: weights must have the same size as input or0-length, but got input shape: ${s.shape}, weights shape: ${r.shape}.`);const a={x:s,weights:r},o={size:n};return b.runKernel(lo,a,o)}const fr=y({bincount_:wd});/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Nd(t,e){const n=f(t,"x","bitwiseAnd"),s=f(e,"y","bitwiseAnd");if(!_e(n.shape,s.shape))throw new Error(`BitwiseAnd: Tensors must have the same shape. x: ${n.shape}, y: ${s.shape}`);if(n.dtype!=="int32"||s.dtype!=="int32")throw new Error(`BitwiseAnd: Only supports 'int32' values in tensor, found type of x: ${n.dtype} and type of y: ${s.dtype}`);const r={a:n,b:s};return b.runKernel(co,r)}const Il=y({bitwiseAnd_:Nd});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Sd(t,e){const n=f(t,"s0","broadcastArgs","int32"),s=f(e,"s1","broadcastArgs","int32");if(n.rank!==1)throw new Error(`broadcastArgs(): first input must be a vector (rank=1). Has rank ${n.rank}`);if(s.rank!==1)throw new Error(`broadcastArgs(): second input must be a vector (rank=1). Has rank ${s.rank}`);const r={s0:n,s1:s};return b.runKernel(po,r)}const Al=y({broadcastArgs_:Sd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Td(t,e){let n=f(t,"broadcastTo","x");const s=n.shape;if(ye(e),e.length<n.rank)throw new Error(`broadcastTo(): shape.length=${e.length} < input.rank=${n.rank}.`);if(e.length>n.rank){const l=n.shape.slice();for(;l.length<e.length;)l.unshift(1);n=$(n,l)}const r=n.shape,a=Array.from(e);for(let l=e.length-1;l>=0;l--)if(r[l]===e[l])a[l]=1;else if(n.shape[l]!==1)throw new Error(`broadcastTo(): [${s}] cannot be broadcast to [${e}].`);if(a.map((l,h)=>l>1?h:-1).filter(l=>l>=0).length===0)return ze(n);const i={x:n},u={reps:a};return b.runKernel(nr,i,u)}const Ht=y({broadcastTo_:Td});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function $d(t){const n={x:f(t,"x","ceil","float32")};return b.runKernel(ho,n)}const xl=y({ceil_:$d});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Vt(t,e,n){ye(t),n=n||pn(e);const s={shape:t,value:e,dtype:n};return b.runKernel(Uo,{},s)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ed(t,e,n){const s=f(t,"x","clipByValue");if(d(e<=n,()=>`Error in clip: min (${e}) must be less than or equal to max (${n}).`),e===n)return Vt(s.shape,e,s.dtype);const r={x:s},a={clipValueMin:e,clipValueMax:n};return b.runKernel(mo,r,a)}const Ol=y({clipByValue_:Ed});function kd(t){return se(t,0)}const Dl=y({concat1d_:kd});function _d(t,e){return se(t,e)}const Fl=y({concat2d_:_d});function vd(t,e){return se(t,e)}const Cl=y({concat3d_:vd});function Id(t,e){return se(t,e)}const Rl=y({concat4d_:Id});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ad(t,e,n,s,r="NHWC",a=[1,1],o){const i=f(t,"x","conv2d","float32"),u=f(e,"filter","conv2d","float32");let l=i,h=!1;i.rank===3&&(h=!0,l=$(i,[1,i.shape[0],i.shape[1],i.shape[2]])),d(l.rank===4,()=>`Error in conv2d: input must be rank 4, but got rank ${l.rank}.`),d(u.rank===4,()=>`Error in conv2d: filter must be rank 4, but got rank ${u.rank}.`),Se("conv2d",s,o);const p=r==="NHWC"?l.shape[3]:l.shape[1];d(p===u.shape[2],()=>`Error in conv2d: depth of input (${p}) must match input depth for filter ${u.shape[2]}.`),d(Me(n,a),()=>`Error in conv2D: Either strides or dilations must be 1. Got strides ${n} and dilations '${a}'`),d(yt(a),()=>"Error in conv2D: Dilated rates should be larger than 0."),d(yt(n),()=>"Error in conv2D: Strides should be larger than 0.");const m={x:l,filter:u},g={strides:n,pad:s,dataFormat:r,dilations:a,dimRoundingMode:o},N=b.runKernel(bo,m,g);return h?$(N,[N.shape[1],N.shape[2],N.shape[3]]):N}const yn=y({conv2d_:Ad});function xd(t,e,n,s,r="NWC",a=1,o){const i=f(t,"x","conv1d"),u=f(e,"filter","conv1d");let l=i,h=!1;i.rank===2&&(h=!0,l=$(i,[1,i.shape[0],i.shape[1]])),d(l.rank===3,()=>`Error in conv1d: input must be rank 3, but got rank ${l.rank}.`),d(u.rank===3,()=>`Error in conv1d: filter must be rank 3, but got rank ${u.rank}.`),Se("conv1d",s,o),d(l.shape[2]===u.shape[1],()=>`Error in conv1d: depth of input (${l.shape[2]}) must match input depth for filter ${u.shape[1]}.`),d(Me(n,a),()=>`Error in conv1D: Either stride or dilation must be 1. Got stride ${n} and dilation '${a}'`),d(yt(a),()=>"Error in conv1D: Dilated rates should be larger than 0."),d(yt(n),()=>"Error in conv1D: Stride should be larger than 0."),d(r==="NWC",()=>`Error in conv1d: got dataFormat of ${r} but only NWC is currently supported.`);const p=$(u,[1,u.shape[0],u.shape[1],u.shape[2]]),m=$(l,[l.shape[0],1,l.shape[1],l.shape[2]]),w=yn(m,p,[1,n],s,"NHWC",[1,a],o);return h?$(w,[w.shape[2],w.shape[3]]):$(w,[w.shape[0],w.shape[2],w.shape[3]])}const Pl=y({conv1d_:xd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Od(t,e,n,s,r,a="NHWC",o){d(t.length===e.rank,()=>`Length of inShape (${t.length}) and rank of dy (${e.rank}) must match`);let i=t,u=e,l=!1;e.rank===3&&(l=!0,u=$(e,[1,e.shape[0],e.shape[1],e.shape[2]]),i=[1,t[0],t[1],t[2]]),d(i.length===4,()=>`Error in conv2dDerInput: inShape must be length 4, but got length ${i.length}.`),d(u.rank===4,()=>`Error in conv2dDerInput: dy must be rank 4, but got rank ${u.rank}`),d(n.rank===4,()=>`Error in conv2dDerInput: filter must be rank 4, but got rank ${n.rank}`);const h=a==="NHWC"?i[3]:i[1],p=a==="NHWC"?u.shape[3]:u.shape[1];d(h===n.shape[2],()=>`Error in conv2dDerInput: depth of input (${h}) must match input depth for filter ${n.shape[2]}.`),d(p===n.shape[3],()=>`Error in conv2dDerInput: depth of output (${p}) must match output depth for filter ${n.shape[3]}.`),Se("conv2dDerInput",r,o);const m={dy:u,filter:n},g={strides:s,pad:r,dataFormat:a,dimRoundingMode:o,inputShape:i},N=b.runKernel(No,m,g);return l?$(N,[N.shape[1],N.shape[2],N.shape[3]]):N}const Bl=y({conv2DBackpropInput_:Od});function Dd(t,e,n,s,r,a){const o=f(t,"x","conv2dTranspose"),i=f(e,"filter","conv2dTranspose");return Bl(n,o,i,s,r,"NHWC",a)}const Ll=y({conv2dTranspose_:Dd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Fd(t,e,n,s,r="NDHWC",a=[1,1,1]){const o=f(t,"x","conv3d"),i=f(e,"filter","conv3d");let u=o,l=!1;o.rank===4&&(l=!0,u=$(o,[1,o.shape[0],o.shape[1],o.shape[2],o.shape[3]])),d(u.rank===5,()=>`Error in conv3d: input must be rank 5, but got rank ${u.rank}.`),d(i.rank===5,()=>`Error in conv3d: filter must be rank 5, but got rank ${i.rank}.`),d(u.shape[4]===i.shape[3],()=>`Error in conv3d: depth of input (${u.shape[4]}) must match input depth for filter ${i.shape[3]}.`),d(Me(n,a),()=>`Error in conv3D: Either strides or dilations must be 1. Got strides ${n} and dilations '${a}'`),d(r==="NDHWC",()=>`Error in conv3d: got dataFormat of ${r} but only NDHWC is currently supported.`),d(yt(a),()=>"Error in conv3D: Dilated rates should be larger than 0."),d(yt(n),()=>"Error in conv3D: Strides should be larger than 0.");const h={x:u,filter:i},p={strides:n,pad:s,dataFormat:r,dilations:a},m=b.runKernel(So,h,p);return l?$(m,[m.shape[1],m.shape[2],m.shape[3],m.shape[4]]):m}const zl=y({conv3d_:Fd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Cd(t,e,n,s,r){d(t.length===e.rank,()=>`Length of inShape (${t.length}) and rank of dy (${e.rank}) must match`);let a=t,o=e,i=!1;e.rank===4&&(i=!0,o=$(e,[1,e.shape[0],e.shape[1],e.shape[2],e.shape[3]]),a=[1,t[0],t[1],t[2],t[3]]);const u=a[4],l=o.shape[4];d(a.length===5,()=>`Error in conv3dDerInput: inShape must be length 5, but got length ${a.length}.`),d(o.rank===5,()=>`Error in conv3dDerInput: dy must be rank 5, but got rank ${o.rank}`),d(n.rank===5,()=>`Error in conv3dDerInput: filter must be rank 5, but got rank ${n.rank}`),d(u===n.shape[3],()=>`Error in conv3dDerInput: depth of input (${u}) must match input depth for filter ${n.shape[3]}.`),d(l===n.shape[4],()=>`Error in conv3dDerInput: depth of output (${l}) must match output depth for filter ${n.shape[4]}.`);const h={dy:o,filter:n},p={pad:r,strides:s,inputShape:a},m=b.runKernel(To,h,p);return i?$(m,[m.shape[1],m.shape[2],m.shape[3],m.shape[4]]):m}const Rd=y({conv3DBackpropInput_:Cd});function Pd(t,e,n,s,r){const a=f(t,"x","conv3dTranspose"),o=f(e,"filter","conv3dTranspose");return Rd(n,a,o,s,r)}const Vl=y({conv3dTranspose_:Pd});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Bd(t){const n={x:f(t,"x","cos","float32")};return b.runKernel($o,n)}const jl=y({cos_:Bd});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ld(t){const n={x:f(t,"x","cosh","float32")};return b.runKernel(Eo,n)}const Ml=y({cosh_:Ld});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function zd(t,e=0,n=!1,s=!1){const a={x:f(t,"x","cumprod")},o={axis:e,exclusive:n,reverse:s};return b.runKernel(ko,a,o)}const Wl=y({cumprod_:zd});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Vd(t,e=0,n=!1,s=!1){const a={x:f(t,"x","cumsum")},o={axis:e,exclusive:n,reverse:s};return b.runKernel(_o,a,o)}const Ul=y({cumsum_:Vd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function jd(t,e,n,s=!1){const r=f(t,"x","denseBincount"),a=f(e,"weights","denseBincount");d(r.dtype==="int32",()=>`Error in denseBincount: input dtype must be int32, but got ${r.dtype}`),d(r.rank<=2,()=>`Error in denseBincount: input must be at most rank 2, but got rank ${r.rank}.`),d(n>=0,()=>`size must be non-negative, but got ${n}.`),d(a.size===r.size||a.size===0,()=>`Error in denseBincount: weights must have the same shape as x or 0-length, but got x shape: ${r.shape}, weights shape: ${a.shape}.`);const o={x:r,weights:a},i={size:n,binaryOutput:s};return b.runKernel(Io,o,i)}const Gl=y({denseBincount_:jd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Md(t,e,n="NHWC"){const s=f(t,"x","depthToSpace","float32"),r=n==="NHWC"?s.shape[1]:s.shape[2],a=n==="NHWC"?s.shape[2]:s.shape[3],o=n==="NHWC"?s.shape[3]:s.shape[1];d(e>1,()=>`blockSize should be > 1 for depthToSpace, but was: ${e}`),d(r*e>=0,()=>`Negative dimension size caused by overflow when multiplying
    ${r} and ${e}  for depthToSpace with input shape
    ${s.shape}`),d(a*e>=0,()=>`Negative dimension size caused by overflow when multiplying
    ${a} and ${e} for depthToSpace with input shape
        ${s.shape}`),d(o%(e*e)===0,()=>`Dimension size must be evenly divisible by ${e*e} but is ${o} for depthToSpace with input shape ${s.shape}`);const i={x:s},u={blockSize:e,dataFormat:n};return b.runKernel(Ao,i,u)}const ql=y({depthToSpace_:Md});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Wd(t,e,n,s,r="NHWC",a=[1,1],o){const i=f(t,"x","depthwiseConv2d","float32"),u=f(e,"filter","depthwiseConv2d","float32");let l=i,h=!1;i.rank===3&&(h=!0,l=$(i,[1,i.shape[0],i.shape[1],i.shape[2]])),d(l.rank===4,()=>`Error in depthwiseConv2d: input must be rank 4, but got rank ${l.rank}.`),d(u.rank===4,()=>`Error in depthwiseConv2d: filter must be rank 4, but got rank ${u.rank}.`);const p=r==="NHWC"?l.shape[3]:l.shape[1];d(p===u.shape[2],()=>`Error in depthwiseConv2d: number of input channels (${p}) must match the inChannels dimension in filter ${u.shape[2]}.`),Se("depthwiseConv2d",s,o);const m={x:l,filter:u},g={strides:n,pad:s,dataFormat:r,dilations:a,dimRoundingMode:o},N=b.runKernel(xo,m,g);return h?$(N,[N.shape[1],N.shape[2],N.shape[3]]):N}const Kn=y({depthwiseConv2d_:Wd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ud(t){const n={x:f(t,"x","diag")};return b.runKernel(Fo,n)}const Kl=y({diag_:Ud});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Gd(t,e,n,s,r=[1,1],a="NHWC"){const o=f(t,"x","dilation2d"),i=f(e,"filter","dilation2d");d(o.rank===3||o.rank===4,()=>`Error in dilation2d: input must be rank 3 or 4, but got rank ${o.rank}.`),d(i.rank===3,()=>`Error in dilation2d: filter must be rank 3, but got rank ${i.rank}.`),d(a==="NHWC",()=>`Error in dilation2d: Only NHWC is currently supported, but got dataFormat of ${a}`);let u=o,l=!1;o.rank===3&&(u=$(o,[1,o.shape[0],o.shape[1],o.shape[2]]),l=!0),d(u.shape[3]===i.shape[2],()=>`Error in dilation2d:  input and filter must have the same depth: ${u.shape[3]} vs ${i.shape[2]}`);const h={x:u,filter:i},p={strides:n,pad:s,dilations:r},m=b.runKernel(Co,h,p);return l?$(m,[m.shape[1],m.shape[2],m.shape[3]]):m}const Hl=y({dilation2d_:Gd});/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Xl(t,e){const n=t.length,s=[];for(let r=0;r<n;r++){const a=n-1-r,o=t[a]||1;(e[e.length-1-r]||1)>1&&o===1&&s.unshift(a)}return s}function dr(t,e){const n=[];for(let s=0;s<e.length;s++){const r=t[t.length-s-1],a=e.length-s-1,o=e[a];(r==null||r===1&&o>1)&&n.unshift(a)}return n}function J(t,e){const n=Math.max(t.length,e.length),s=new Array(n);for(let r=0;r<n;r++){let a=t[t.length-r-1];a==null&&(a=1);let o=e[e.length-r-1];if(o==null&&(o=1),a===1)s[n-r-1]=o;else if(o===1)s[n-r-1]=a;else if(a!==o){const i=`Operands could not be broadcast together with shapes ${t} and ${e}.`;throw Error(i)}else s[n-r-1]=a}return s}const qd=Object.freeze(Object.defineProperty({__proto__:null,assertAndGetBroadcastShape:J,getBroadcastDims:Xl,getReductionAxes:dr},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Kd(t,e){let n=f(t,"a","equal","string_or_numeric"),s=f(e,"b","equal","string_or_numeric");[n,s]=H(n,s),J(n.shape,s.shape);const r={a:n,b:s};return b.runKernel(zo,r)}const gr=y({equal_:Kd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Hd(t,e,n){const s=f(e,"a","where"),r=f(n,"b","where"),a=f(t,"condition","where","bool"),o=J(J(a.shape,s.shape),r.shape),i=Ht(a,o),u=Ht(s,o),l=Ht(r,o),h={condition:i,t:u,e:l};return b.runKernel(tu,h)}const Ve=y({where_:Hd});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Xd(t){const n={x:f(t,"x","zerosLike")};return b.runKernel(Fu,n)}const ge=y({zerosLike_:Xd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Jd(t,e){let n=f(t,"a","div"),s=f(e,"b","div");[n,s]=H(n,s);const r=G(n,s),a=ge(r),o=gr(s,a);return Ve(o,a,r)}const Jl=y({divNoNan_:Jd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Yd(t,e){const n=f(t,"t1","dot"),s=f(e,"t2","dot");d((n.rank===1||n.rank===2)&&(s.rank===1||s.rank===2),()=>`Error in dot: inputs must all be rank 1 or 2, but got ranks ${n.rank} and ${s.rank}.`);const r=n.rank===1?n.size:n.shape[1],a=s.rank===1?s.size:s.shape[0];if(d(r===a,()=>`Error in dot: inner dimensions of inputs must match, but got ${r} and ${a}.`),n.rank===1&&s.rank===1){const o=$(n,[1,-1]),i=$(s,[-1,1]),u=z(o,i);return $(u,[])}else if(n.rank===1&&s.rank===2){const o=$(n,[1,-1]),i=$(s,[s.shape[0],s.shape[1]]),u=z(o,i);return $(u,[u.size])}else if(n.rank===2&&s.rank===1){const o=$(s,[-1,1]),i=z(n,o);return $(i,[i.size])}else{const o=$(s,[s.shape[0],s.shape[1]]);return z(n,o)}}const Yl=y({dot_:Yd});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Zd(t,...e){const n=e.map((r,a)=>f(r,`tensors${a}`,"einsum")),s={equation:t};return b.runKernel(Po,n,s)}const ut=y({einsum_:Zd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Qd(t){const n={x:f(t,"x","elu","float32")};return b.runKernel(Bo,n)}const yr=y({elu_:Qd});/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function eg(t,e){const n=f(t,"x","ensureShape","string_or_numeric");if(!Ra(n.shape,e))throw new Error(`EnsureShape: Shape of tensor ${n.shape} is not compatible with expected shape ${e}`);return t}const Zl=y({ensureShape_:eg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function tg(t){let e=f(t,"x","erf");d(e.dtype==="int32"||e.dtype==="float32",()=>"Input dtype must be `int32` or `float32`."),e.dtype==="int32"&&(e=q(e,"float32"));const n={x:e};return b.runKernel(Lo,n)}const Ql=y({erf_:tg});/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function br(t,e){for(let n=0;n<t.length;++n)if(t[t.length-n-1]!==e-1-n)return!1;return!0}function ec(t,e,n){const s=t.length+e.length,r=[];let a=0,o=0;for(let i=0;i<s;i++)n.indexOf(i)===-1?r.push(t[a++]):r.push(e[o++]);return r}function ng(t,e){const n=[],s=t.length;for(let a=0;a<s;a++)e.indexOf(a)===-1&&n.push(t[a]);const r=e.map(a=>t[a]);return[n,r]}function bn(t,e){const n=e.map(s=>1);return ec(t,n,e)}function sg(t,e,n){d(br(e,n),()=>`${t} supports only inner-most axes for now. Got axes ${e} and rank-${n} input.`)}function rg(t,e){if(br(t,e))return null;const n=[];for(let s=0;s<e;++s)t.indexOf(s)===-1&&n.push(s);return t.forEach(s=>n.push(s)),n}function ag(t){return t.map((e,n)=>[n,e]).sort((e,n)=>e[1]-n[1]).map(e=>e[0])}function og(t,e){const n=[];for(let s=e-t;s<e;++s)n.push(s);return n}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ig(t,e=null,n=!1){const r={x:f(t,"x","max")},a={reductionIndices:e,keepDims:n};return b.runKernel(fi,r,a)}const mt=y({max_:ig});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ug(t,e=null,n=!1){const r={x:f(t,"x","min")},a={axis:e,keepDims:n};return b.runKernel(Ni,r,a)}const Ln=y({min_:ug});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function lg(t,e){let n=f(t,"base","pow"),s=f(e,"exp","pow");[n,s]=H(n,s);const r={a:n,b:s};return b.runKernel(Ri,r)}const Ct=y({pow_:lg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function R(t,e){if((Q(t)&&e!=="string"||Array.isArray(t))&&e!=="complex64")throw new Error("Error creating a new Scalar: value must be a primitive (number|boolean|string)");if(e==="string"&&Q(t)&&!(t instanceof Uint8Array))throw new Error("When making a scalar from encoded string, the value must be `Uint8Array`.");return nt(t,[],[],e)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function cg(t){const n={x:f(t,"x","sqrt","float32")};return b.runKernel(lu,n)}const Oe=y({sqrt_:cg});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function pg(t){const e=f(t,"x","square"),n={};return b.runKernel("Square",{x:e},n)}const Ne=y({square_:pg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function hg(t,e=null,n=!1){let s=f(t,"x","sum");s.dtype==="bool"&&(s=q(s,"int32"));const r={x:s},a={axis:e,keepDims:n};return b.runKernel(cu,r,a)}const U=y({sum_:hg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function mg(t,e="euclidean",n=null,s=!1){t=f(t,"x","norm");const r=tc(t,e,n);let a=r.shape;if(s){const o=cn(n,t.shape);a=bn(r.shape,o)}return $(r,a)}function tc(t,e,n=null){if(t.rank===0)return de(t);if(t.rank!==1&&n===null)return tc($(t,[-1]),e,n);if(t.rank===1||typeof n=="number"||Array.isArray(n)&&n.length===1){if(e===1)return U(de(t),n);if(e===1/0)return mt(de(t),n);if(e===-1/0)return Ln(de(t),n);if(e==="euclidean"||e===2)return Oe(U(Ct(de(t),R(2,"int32")),n));throw new Error(`Error in norm: invalid ord value: ${e}`)}if(Array.isArray(n)&&n.length===2){if(e===1)return mt(U(de(t),n[0]),n[1]-1);if(e===1/0)return mt(U(de(t),n[1]),n[0]);if(e===-1/0)return Ln(U(de(t),n[1]),n[0]);if(e==="fro"||e==="euclidean")return Oe(U(Ne(t),n));throw new Error(`Error in norm: invalid ord value: ${e}`)}throw new Error(`Error in norm: invalid axis: ${n}`)}const wn=y({norm_:mg});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function fg(t,e=null,n=!1){return wn(t,"euclidean",e,n)}const nc=y({euclideanNorm_:fg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function dg(t){const n={x:f(t,"x","exp")};return b.runKernel(Vo,n)}const et=y({exp_:dg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function gg(t,e=0){const n=f(t,"x","expandDims","string_or_numeric");d(e<=n.rank,()=>"Axis must be <= rank of the tensor");const s={input:n},r={dim:e};return b.runKernel(jo,s,r)}const Re=y({expandDims_:gg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function yg(t){const n={x:f(t,"x","expm1")};return b.runKernel(Mo,n)}const sc=y({expm1_:yg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function bg(t,e){const n=f(t,"x","tile","string_or_numeric");d(n.rank===e.length,()=>`Error in transpose: rank of input ${n.rank} must match length of reps ${e}.`);const s={x:n},r={reps:e};return b.runKernel(nr,s,r)}const At=y({tile_:bg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function wg(t,e,n,s="float32"){e==null&&(e=t);const r=xe([t,e],s),a=t<=e?t:e;for(let i=0;i<a;++i)r.set(1,i,i);const o=$(r.toTensor(),[t,e]);if(n==null)return o;if(n.length===1)return At(Re(o,0),[n[0],1,1]);if(n.length===2)return At(Re(Re(o,0),0),[n[0],n[1],1,1]);if(n.length===3)return At(Re(Re(Re(o,0),0),0),[n[0],n[1],n[2],1,1]);throw new Error(`eye() currently supports only 1D and 2D batchShapes, but received ${n.length}D.`)}const wr=y({eye_:wg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ng(t){const n={x:f(t,"x","floor","float32")};return b.runKernel(qo,n)}const Nr=y({floor_:Ng});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Sg(t,e,n=0,s=0){const r=f(t,"x","gather"),a=f(e,"indices","gather","int32"),o={x:r,indices:a},i={axis:n,batchDims:s};return b.runKernel(Xo,o,i)}const Sr=y({gather_:Sg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Tg(t,e){let n=f(t,"a","greater","string_or_numeric"),s=f(e,"b","greater","string_or_numeric");[n,s]=H(n,s),J(n.shape,s.shape);const r={a:n,b:s};return b.runKernel(Yo,r)}const Nn=y({greater_:Tg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function $g(t,e){let n=f(t,"a","greaterEqual","string_or_numeric"),s=f(e,"b","greaterEqual","string_or_numeric");[n,s]=H(n,s),J(n.shape,s.shape);const r={a:n,b:s};return b.runKernel(Zo,r)}const Tr=y({greaterEqual_:$g});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Eg(t){const n={input:f(t,"input","imag")};return b.runKernel(ei,n)}const Sn=y({imag_:Eg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function kg(t){const n={x:f(t,"x","isFinite")};return b.runKernel(ti,n)}const rc=y({isFinite_:kg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function _g(t){const n={x:f(t,"x","isInf")};return b.runKernel(ni,n)}const ac=y({isInf_:_g});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function vg(t){const n={x:f(t,"x","isNaN")};return b.runKernel(si,n)}const oc=y({isNaN_:vg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ig(t,e=.2){const s={x:f(t,"x","leakyRelu")},r={alpha:e};return b.runKernel(ri,s,r)}const $r=y({leakyRelu_:Ig});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ag(t,e){let n=f(t,"a","less","string_or_numeric"),s=f(e,"b","less","string_or_numeric");[n,s]=H(n,s),J(n.shape,s.shape);const r={a:n,b:s};return b.runKernel(ai,r)}const zn=y({less_:Ag});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function xg(t,e){let n=f(t,"a","lessEqual","string_or_numeric"),s=f(e,"b","lessEqual","string_or_numeric");[n,s]=H(n,s),J(n.shape,s.shape);const r={a:n,b:s};return b.runKernel(oi,r)}const Hn=y({lessEqual_:xg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ic(t,e,n){if(n<=0)throw new Error("The number of values should be positive.");const s={start:t,stop:e,num:n};return b.runKernel(ii,{},s)}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Og(t,e=5,n=1,s=1,r=.5){const a=f(t,"x","localResponseNormalization");d(a.rank===4||a.rank===3,()=>`Error in localResponseNormalization: x must be rank 3 or 4 but got
               rank ${a.rank}.`),d(Ot(e),()=>`Error in localResponseNormalization: depthRadius must be an integer but got depthRadius ${e}.`);let o=a,i=!1;a.rank===3&&(i=!0,o=$(a,[1,a.shape[0],a.shape[1],a.shape[2]]));const u={x:o},l={depthRadius:e,bias:n,alpha:s,beta:r},h=b.runKernel(mi,u,l);return i?$(h,[h.shape[1],h.shape[2],h.shape[3]]):h}const uc=y({localResponseNormalization_:Og});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Dg(t){const n={x:f(t,"x","log","float32")};return b.runKernel(ui,n)}const Rt=y({log_:Dg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Fg(t){const n={x:f(t,"x","log1p")};return b.runKernel(li,n)}const Er=y({log1p_:Fg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Cg(t){return d(Je(t),()=>"The f passed in grad(f) must be a function"),(e,n)=>{const s=f(e,"x","tf.grad","string_or_numeric"),r=n!=null?f(n,"dy","tf.grad"):null;return b.tidy(()=>{const{value:a,grads:o}=b.gradients(()=>t(s),[s],r);return r!=null&&le(a.shape,r.shape,"The shape of dy passed in grad(f)(x, dy) must match the shape returned by f(x)"),Xn(o),o[0]})}}function Rg(t){return d(Je(t),()=>"The f passed in grads(f) must be a function"),(e,n)=>{d(Array.isArray(e),()=>"The args passed in grads(f)(args) must be an array of `Tensor`s or `TensorLike`s");const s=en(e,"args","tf.grads","string_or_numeric"),r=n!=null?f(n,"dy","tf.grads"):null;return b.tidy(()=>{const{value:a,grads:o}=b.gradients(()=>t(...s),s,r);return r!=null&&le(a.shape,r.shape,"The shape of dy passed in grads(f)([x1,...], dy) must match the shape returned by f([x1,...])"),Xn(o),o})}}function Pg(t){return d(Je(t),()=>"The f passed in valueAndGrad(f) must be a function"),(e,n)=>{d(e instanceof X,()=>"The x passed in valueAndGrad(f)(x) must be a tensor"),d(n==null||n instanceof X,()=>"The dy passed in valueAndGrad(f)(x, dy) must be a tensor");const{grads:s,value:r}=b.gradients(()=>t(e),[e],n);return Xn(s),{grad:s[0],value:r}}}function Bg(t){return d(Je(t),()=>"The f passed in valueAndGrads(f) must be a function"),(e,n)=>{d(Array.isArray(e)&&e.every(r=>r instanceof X),()=>"The args passed in valueAndGrads(f)(args) must be array of tensors"),d(n==null||n instanceof X,()=>"The dy passed in valueAndGrads(f)(args, dy) must be a tensor");const s=b.gradients(()=>t(...e),e,n);return n!=null&&le(s.value.shape,n.shape,"The shape of dy passed in valueAndGrads(f)([x1,...], dy) must match the shape returned by f([x1,...])"),Xn(s.grads),s}}function lc(t,e){d(Je(t),()=>"The f passed in variableGrads(f) must be a function"),d(e==null||Array.isArray(e)&&e.every(l=>l instanceof Qt),()=>"The varList passed in variableGrads(f, varList) must be an array of variables");const n=e!=null;if(!n){e=[];for(const l in b.registeredVariables)e.push(b.registeredVariables[l])}const s=n?e.filter(l=>!l.trainable):null,r=e.length;e=e.filter(l=>l.trainable),d(e.length>0,()=>`variableGrads() expects at least one of the input variables to be trainable, but none of the ${r} variables is trainable.`);const a=!0,{value:o,grads:i}=b.gradients(t,e,null,a);d(i.some(l=>l!=null),()=>"Cannot find a connection between any variable and the result of the loss function y=f(x). Please make sure the operations that use variables are inside the function f passed to minimize()."),d(o.rank===0,()=>`The f passed in variableGrads(f) must return a scalar, but it returned a rank-${o.rank} tensor`);const u={};return e.forEach((l,h)=>{i[h]!=null&&(u[l.name]=i[h])}),s?.forEach(l=>u[l.name]=null),{value:o,grads:u}}function De(t){return b.customGrad(t)}function Xn(t){if(t.filter(n=>n==null).length>0)throw new Error(`Cannot compute gradient of y=f(x) with respect to x. Make sure that
    the f you passed encloses all operations that lead from x to y.`)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Lg(t){const n={x:f(t,"x","neg")};return b.runKernel(_i,n)}const ke=y({neg_:Lg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function zg(t){const n={x:f(t,"x","softplus")};return b.runKernel(uu,n)}const kr=y({softplus_:zg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Vg(t){const e=f(t,"x","logSigmoid");return De(s=>({value:ke(kr(ke(s))),gradFunc:o=>_(o,ht(ke(s)))}))(e)}const cc=y({logSigmoid_:Vg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function jg(t,e){let n=f(t,"a","sub"),s=f(e,"b","sub");[n,s]=H(n,s);const r={a:n,b:s};return b.runKernel(ku,r)}const F=y({sub_:jg});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Mg(t,e=-1){const n=f(t,"logits","logSoftmax");if(e===-1&&(e=n.rank-1),e!==n.rank-1)throw Error(`Log Softmax along a non-last dimension is not yet supported. Logits was rank ${n.rank} and axis was ${e}`);return De((r,a)=>{const i=mt(r,e,!0),u=F(r,i),l=F(q(u,"float32"),Rt(U(et(u),e,!0)));return a([l]),{value:l,gradFunc:(p,m)=>{const[g]=m,N=!0,S=et(g);return F(p,_(U(p,e,N),S))}}})(n)}const pc=y({logSoftmax_:Mg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Wg(t,e=null,n=!1){const s=f(t,"x","logSumExp"),r=cn(e,s.shape),a=mt(s,r,!0),o=F(s,a),i=et(o),u=U(i,r),l=Rt(u),h=x($(a,l.shape),l);if(n){const p=bn(h.shape,r);return $(h,p)}return h}const _r=y({logSumExp_:Wg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ug(t,e){const n=f(t,"a","logicalAnd","bool"),s=f(e,"b","logicalAnd","bool");J(n.shape,s.shape);const r={a:n,b:s};return b.runKernel(ci,r)}const rn=y({logicalAnd_:Ug});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Gg(t){const n={x:f(t,"x","logicalNot","bool")};return b.runKernel(pi,n)}const vr=y({logicalNot_:Gg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function qg(t,e){const n=f(t,"a","logicalOr","bool"),s=f(e,"b","logicalOr","bool");J(n.shape,s.shape);const r={a:n,b:s};return b.runKernel(hi,r)}const Ir=y({logicalOr_:qg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Kg(t,e){const n=f(t,"a","logicalXor","bool"),s=f(e,"b","logicalXor","bool");return J(n.shape,s.shape),rn(Ir(t,e),vr(rn(t,e)))}const hc=y({logicalXor_:Kg});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const En=2147483648;function Hg(t,e,n="left"){const s=f(t,"sortedSequence","searchSorted"),r=f(e,"values","searchSorted"),a=s.shape[s.shape.length-1],o=r.shape[r.shape.length-1],i=$(s,[-1,a]),u=$(r,[-1,o]);if(i.rank<2)throw new Error("Sorted input argument must be at least 2-dimensional");if(i.shape[0]!==u.shape[0])throw new Error("Leading dimension of 'sortedSequence' and 'values' must match.");if(j(u.shape)>=En)throw new Error(`values tensor size must less than ${En}`);if(i.shape[1]>=En)throw new Error(`trailing dim_size must less than ${En} for int32 output type, was ${i.shape[1]}`);const l={sortedSequence:i,values:u},h={side:n};return b.runKernel(eu,l,h)}const Jn=y({searchSorted_:Hg});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function mc(t,e){return Jn(t,e,"left")}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Xg(t,e,n,s,r){const a=f(t,"x","maxPool"),o=1;let i=a,u=!1;a.rank===3&&(u=!0,i=$(a,[1,a.shape[0],a.shape[1],a.shape[2]])),d(i.rank===4,()=>`Error in maxPool: input must be rank 4 but got rank ${i.rank}.`),d(Me(n,o),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${n} and dilations '${o}'`),Se("maxPool",s,r);const l={x:i},h={filterSize:e,strides:n,pad:s,dimRoundingMode:r},p=b.runKernel(gi,l,h);return u?$(p,[p.shape[1],p.shape[2],p.shape[3]]):p}const Ar=y({maxPool_:Xg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Jg(t,e=[1,1,1],n,s,r,a="NDHWC"){const o=f(t,"x","maxPool3d");let i=o,u=!1;o.rank===4&&(u=!0,i=$(o,[1,o.shape[0],o.shape[1],o.shape[2],o.shape[3]])),d(i.rank===5,()=>`Error in maxPool3d: x must be rank 5 but got rank ${i.rank}.`),d(a==="NDHWC",()=>`Error in maxPool3d: Only NDHWC is currently supported, but got dataFormat of ${a}`),Se("maxPool3d",s,r);const l={x:i},h={filterSize:e,strides:n,pad:s,dimRoundingMode:r,dataFormat:a},p=b.runKernel(yi,l,h);return u?$(p,[p.shape[1],p.shape[2],p.shape[3],p.shape[4]]):p}const fc=y({maxPool3d_:Jg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Yg(t,e,n,s,r=!1){const o={x:f(t,"x","maxPoolWithArgmax")},i={filterSize:e,strides:n,pad:s,includeBatchInIndex:r},u=b.runKernel(bi,o,i);return{result:u[0],indexes:u[1]}}const dc=y({maxPoolWithArgmax_:Yg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Zg(t,e){let n=f(t,"a","maximum"),s=f(e,"b","maximum");[n,s]=H(n,s),n.dtype==="bool"&&(n=q(n,"int32"),s=q(s,"int32")),J(n.shape,s.shape);const r={a:n,b:s};return b.runKernel(di,r)}const xr=y({maximum_:Zg});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Qg(t,e=null,n=!1){const r={x:f(t,"x","mean")},a={axis:e,keepDims:n};return b.runKernel(wi,r,a)}const an=y({mean_:Qg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function bt(t,e="float32"){if(ye(t),e==="complex64"){const s=bt(t,"float32"),r=bt(t,"float32");return je(s,r)}const n=Un(j(t),e);return b.makeTensor(n,t,e)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function He(t,e="float32"){if(ye(t),e==="complex64"){const s=He(t,"float32"),r=bt(t,"float32");return je(s,r)}const n=Xs(j(t),e);return b.makeTensor(n,t,e)}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function gc(t,e,{indexing:n="xy"}={}){if(n!=="xy"&&n!=="ij")throw new TypeError(`${n} is not a valid third argument to meshgrid`);if(t===void 0)return[];let s=f(t,"x","meshgrid",t instanceof X?t.dtype:"float32");if(e===void 0)return[s];let r=f(e,"y","meshgrid",e instanceof X?e.dtype:"float32");const a=j(s.shape),o=j(r.shape);return n==="xy"?(s=$(s,[1,-1]),r=$(r,[-1,1]),[z(He([o,1],s.dtype),s),z(r,He([1,a],r.dtype))]):(s=$(s,[-1,1]),r=$(r,[1,-1]),[z(s,He([1,o],s.dtype)),z(He([a,1],r.dtype),r)])}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ey(t,e){let n=f(t,"a","minimum"),s=f(e,"b","minimum");[n,s]=H(n,s),n.dtype==="bool"&&(n=q(n,"int32"),s=q(s,"int32")),J(n.shape,s.shape);const r={a:n,b:s};return b.runKernel(Si,r)}const on=y({minimum_:ey});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ty(t,e,n){d(n==="reflect"||n==="symmetric",()=>`Invalid mode. Mode must be either reflect or symmetric. Got ${n}.`);const s=f(t,"x","mirrorPad");if(s.rank===0)throw new Error("mirrorPad(scalar) is not defined. Pass non-scalar to mirrorPad");d(e.length===s.rank,()=>`Padding doesn't match input. Must be ${s.rank}. Got ${e.length}.`);const r=n==="reflect"?1:0;for(let i=0;i<s.rank;i++)d(e[i].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),d(e[i][0]>=0&&e[i][0]<=s.shape[i]-r&&e[i][1]>=0&&e[i][1]<=s.shape[i]-r,()=>`Padding in dimension ${i} cannot be greater than or equal to ${s.shape[i]-r} or less than 0 for input of shape ${s.shape}`);const a={paddings:e,mode:n},o={x:s};return b.runKernel(Ti,o,a)}const yc=y({mirrorPad_:ty});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ny(t,e){let n=f(t,"a","mod"),s=f(e,"b","mod");[n,s]=H(n,s);const r={a:n,b:s};return b.runKernel($i,r)}const bc=y({mod_:ny});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function sy(t,e=null,n=!1){t=f(t,"x","moments");const s=cn(e,t.shape),r=an(t,s,n);let a=r.shape;n||(a=bn(r.shape,s));const o=Ne(F(q(t,"float32"),$(r,a))),i=an(o,s,n);return{mean:r,variance:i}}const wc=y({moments_:sy});function ry(t,e,n,s){const r=f(e,"data","multiRNNCell"),a=en(n,"c","multiRNNCell"),o=en(s,"h","multiRNNCell");let i=r;const u=[];for(let p=0;p<t.length;p++){const m=t[p](i,a[p],o[p]);u.push(m[0]),u.push(m[1]),i=m[1]}const l=[],h=[];for(let p=0;p<u.length;p+=2)l.push(u[p]),h.push(u[p+1]);return[l,h]}const Nc=y({multiRNNCell_:ry});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ay(t,e,n,s=!1){const r=f(t,"logits","multinomial"),a=r.size,o=r.rank;if(a<2)throw new Error(`Error in multinomial: you need at least 2 outcomes, but got ${a}.`);if(o>2)throw new Error(`Rank of probabilities must be 1 or 2, but is ${o}`);n=n||Math.random();const u={logits:o===1?$(r,[1,-1]):r},l={numSamples:e,seed:n,normalized:s},h=b.runKernel(Ei,u,l);return o===1?$(h,[h.size]):h}const Sc=y({multinomial_:ay});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function oy(t,e){let n=f(t,"a","notEqual","string_or_numeric"),s=f(e,"b","notEqual","string_or_numeric");[n,s]=H(n,s),J(n.shape,s.shape);const r={a:n,b:s};return b.runKernel(vi,r)}const Or=y({notEqual_:oy});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function iy(t,e,n=1,s=0,r="int32"){if(e<2)throw new Error(`Error in oneHot: depth must be >=2, but it is ${e}`);const o={indices:f(t,"indices","oneHot","int32")},i={dtype:r,depth:e,onValue:n,offValue:s};return b.runKernel(Di,o,i)}const Vn=y({oneHot_:iy});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function uy(t){const n={x:f(t,"x","onesLike")};return b.runKernel(Oi,n)}const Tc=y({onesLike_:uy});function ly(t,e){const n=f(t,"v1","outerProduct"),s=f(e,"v2","outerProduct");d(n.rank===1&&s.rank===1,()=>`Error in outerProduct: inputs must be rank 1, but got ranks ${n.rank} and ${s.rank}.`);const r=$(n,[-1,1]),a=$(s,[1,-1]);return z(r,a)}const $c=y({outerProduct_:ly});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function cy(t,e,n=0){const s=f(t,"x","pad");if(s.rank===0)throw new Error("pad(scalar) is not defined. Pass non-scalar to pad");const r={paddings:e,constantValue:n},a={x:s};return b.runKernel(Ci,a,r)}const jt=y({pad_:cy});function py(t,e,n=0){return d(e.length===2,()=>"Invalid number of paddings. Must be length of 2."),jt(t,[e],n)}const Ec=y({pad1d_:py});function hy(t,e,n=0){return d(e.length===2&&e[0].length===2&&e[1].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),jt(t,e,n)}const kc=y({pad2d_:hy});function my(t,e,n=0){return d(e.length===3&&e[0].length===2&&e[1].length===2&&e[2].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),jt(t,e,n)}const _c=y({pad3d_:my});function fy(t,e,n=0){return d(e.length===4&&e[0].length===2&&e[1].length===2&&e[2].length===2&&e[3].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),jt(t,e,n)}const vc=y({pad4d_:fy});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function dy(t,e,n){const s=f(t,"x","spaceToBatchND");d(s.rank>=1+e.length,()=>`input rank ${s.rank} should be > than [blockShape] ${e.length}`),d(n.length===e.length,()=>`paddings.shape[0] ${n.length} must be equal to [blockShape] ${e.length}`),d(s.shape.reduce((o,i,u)=>u>0&&u<=e.length?o&&(i+n[u-1][0]+n[u-1][1])%e[u-1]===0:o,!0),()=>`input spatial dimensions ${s.shape.slice(1)} with paddings ${n.toString()} must be divisible by blockShapes ${e.toString()}`);const r={x:s},a={blockShape:e,paddings:n};return b.runKernel(pu,r,a)}const Dr=y({spaceToBatchND_:dy});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function gy(t,e,n,s,r,a,o){r==null&&(r=[1,1]),a==null&&(a=1),s===0&&(s="valid");const i=f(t,"x","maxPool");let u=i,l=!1;i.rank===3&&(l=!0,u=$(i,[1,i.shape[0],i.shape[1],i.shape[2]])),d(Me(a,r),()=>`Error in pool: Either strides or dilations must be 1. Got strides ${a} and dilations '${r}'`);const h=Nl(u.shape,e,a,r,s),p=[h.dilationHeight,h.dilationWidth];let m;s==="same"?m=by([h.filterHeight,h.filterWidth],p):m=[[0,0],[0,0]];const g=p[0]===1&&p[1]===1,[N,S]=yy([h.inHeight,h.inWidth],p,m),w=g?s:"valid",T=g?u:Dr(u,p,N),E=(n==="avg"?()=>hr(T,e,a,w,o):()=>Ar(T,e,a,w,o))(),k=g?E:mr(E,p,S);return l?$(k,[k.shape[1],k.shape[2],k.shape[3]]):k}function yy(t,e,n){const s=n.map(h=>h[0]),r=n.map(h=>h[1]),a=t.concat(s,r),o=e.map((h,p)=>(h-a[p]%h)%h),i=r.map((h,p)=>h+o[p]),u=e.map((h,p)=>[s[p],i[p]]),l=e.map((h,p)=>[0,o[p]]);return[u,l]}function by(t,e){const s=t.map((o,i)=>o+(o-1)*(e[i]-1)).map(o=>o-1),r=s.map(o=>Math.floor(o/2)),a=s.map((o,i)=>o-r[i]);return s.map((o,i)=>[r[i],a[i]])}const Ic=y({pool_:gy});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function wy(t,e){const n=f(t,"x","prelu"),s=f(e,"alpha","prelu"),r={x:n,alpha:s};return b.runKernel(Pi,r)}const Fr=y({prelu_:wy});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ny(t,e=null,n=!1){let s=f(t,"x","prod");s.dtype==="bool"&&(s=q(s,"int32"));const r={x:s},a={axis:e,keepDims:n};return b.runKernel(Bi,r,a)}const Ac=y({prod_:Ny});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Sy(t,e,n,s){const r=t.map((h,p)=>f(h,`tensors${p}`,"raggedGather","int32")),a=f(e,"paramsDenseValues","raggedGather"),o=f(n,"indices","raggedGather","int32"),i={paramsNestedSplits:r,paramsDenseValues:a,indices:o},u={outputRaggedRank:s},l=b.runKernel(Li,i,u);return{outputNestedSplits:l.slice(0,l.length-1),outputDenseValues:l[l.length-1]}}const xc=y({raggedGather_:Sy});/**
 * @license
 * Copyright 2022 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ty(t,e,n){const s=f(t,"starts","raggedRange"),r=f(e,"limits","raggedRange",s.dtype),a=f(n,"deltas","raggedRange",s.dtype),o={starts:s,limits:r,deltas:a},i=b.runKernel(zi,o);return{rtNestedSplits:i[0],rtDenseValues:i[1]}}const Oc=y({raggedRange_:Ty});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function $y(t,e,n,s,r){const a=f(t,"shape","raggedTensorToTensor","int32"),o=f(e,"values","raggedTensorToTensor"),i=f(n,"defaultValue","raggedTensorToTensor",o.dtype),u=s.map((p,m)=>f(p,`tensors${m}`,"raggedTensorToTensor","int32")),l={shape:a,values:o,defaultValue:i,rowPartitionTensors:u},h={rowPartitionTypes:r};return b.runKernel(Vi,l,h)}const Dc=y({raggedTensorToTensor_:$y});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ey(t,e,n){ye(t);const s=j(t);let r=null;if(n==null||n==="float32")r=new Float32Array(s);else if(n==="int32")r=new Int32Array(s);else if(n==="bool")r=new Uint8Array(s);else throw new Error(`Unknown data type ${n}`);for(let a=0;a<s;a++)r[a]=e();return b.makeTensor(r,t,n)}const Fc=y({rand_:Ey});/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ky=.001,Cc=.1;function _y(t,e,n){return n==null&&(n=Cr()),Ds(t,e,(s,r)=>Rr(s,r,n))}function Cr(){return b.backend.floatPrecision()===32?ky:Cc}function Ds(t,e,n){let s=!0;if((Q(t)||Q(e))&&(s=!1),Q(t)&&Q(e)&&(s=!0),s){const o=t.constructor.name,i=e.constructor.name;if(o!==i)throw new Error(`Arrays are of different type. Actual: ${o}. Expected: ${i}`)}if(Array.isArray(t)&&Array.isArray(e)){const o=Ae(t),i=Ae(e);if(!_e(o,i))throw new Error(`Arrays have different shapes. Actual: [${o}]. Expected: [${i}]`)}const r=Q(t)?t:Ze(t),a=Q(e)?e:Ze(e);if(r.length!==a.length)throw new Error(`Arrays have different lengths actual: ${r.length} vs expected: ${a.length}.
Actual:   ${r}.
Expected: ${a}.`);for(let o=0;o<a.length;++o){const i=r[o],u=a[o];if(!n(i,u))throw new Error(`Arrays differ: actual[${o}] = ${i}, expected[${o}] = ${u}.
Actual:   ${r}.
Expected: ${a}.`)}typeof expect<"u"&&expect().nothing()}function vy(t,e){t().then(()=>e.fail(),()=>e()),typeof expect<"u"&&expect().nothing()}function Iy(t,e){const n=typeof e=="string"||typeof e=="number"||typeof e=="boolean"?[e]:e;return qe(t)||qe(t[0])||qe(e)||qe(e[0])?Ds(t,n,(s,r)=>s==r):Ds(t,e,(s,r)=>Rr(s,r,0))}function Ay(t,e,n){if(n==null&&(n=Cr()),!Rr(t,e,n))throw new Error(`Numbers differ: actual === ${t}, expected === ${e}`);typeof expect<"u"&&expect().nothing()}function Rr(t,e,n){return!isFinite(t)&&!isFinite(e)?!0:!(isNaN(t)||isNaN(e)||Math.abs(t-e)>n)}function xy(t,e,n){for(let s=0;s<t.length;s++)if(t[s]<e||t[s]>n)throw new Error(`Value out of range:${t[s]} low: ${e}, high: ${n}`)}function Oy(t,e){const n=new Float32Array(t),s=new Float32Array(e);if(n.length!==s.length)throw new Error(`Expected ArrayBuffer to be of length ${s.length}, but it was ${n.length}`);for(let r=0;r<s.length;r++)if(n[r]!==s[r])throw new Error(`Expected ArrayBuffer value at ${r} to be ${s[r]} but got ${n[r]} instead`)}function Rc(t){for(let e=0;e<t.length;e++){const n=t[e];Array.isArray(n)?Rc(n):t[e]=mn(n)}return t}function Dy(t){const e=document.createElement("video");return"playsInline"in e&&(e.playsInline=!0),e.muted=!0,e.loop=!0,e.style.position="fixed",e.style.left="0px",e.style.top="0px",e.preload="auto",e.appendChild(t),new Promise(n=>{e.addEventListener("loadeddata",s=>n(e)),e.load()})}async function Fy(t){await t.play(),"requestVideoFrameCallback"in t&&await new Promise(e=>{t.requestVideoFrameCallback(e)})}const Cy=Object.freeze(Object.defineProperty({__proto__:null,TEST_EPSILON_FLOAT16:Cc,createVideoElement:Dy,encodeStrings:Rc,expectArrayBuffersEqual:Oy,expectArraysClose:_y,expectArraysEqual:Iy,expectNumbersClose:Ay,expectPromiseToFail:vy,expectValuesInRange:xy,play:Fy,testEpsilon:Cr},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Pr{constructor(e,n,s,r,a){this.mean=e,this.stdDev=n,this.dtype=s,this.nextVal=NaN,this.truncated=r,this.truncated&&(this.upper=this.mean+this.stdDev*2,this.lower=this.mean-this.stdDev*2);const o=a||Math.random();this.random=Ks.alea(o.toString())}nextValue(){if(!isNaN(this.nextVal)){const r=this.nextVal;return this.nextVal=NaN,r}let e,n,s=!1;for(;!s;){let r,a,o;do r=2*this.random()-1,a=2*this.random()-1,o=r*r+a*a;while(o>=1||o===0);const i=Math.sqrt(-2*Math.log(o)/o);e=this.mean+this.stdDev*r*i,n=this.mean+this.stdDev*a*i,(!this.truncated||this.isValidTruncated(e))&&(s=!0)}return(!this.truncated||this.isValidTruncated(n))&&(this.nextVal=this.convertValue(n)),this.convertValue(e)}convertValue(e){return this.dtype==null||this.dtype==="float32"?e:Math.round(e)}isValidTruncated(e){return e<=this.upper&&e>=this.lower}}class Ry{constructor(e,n,s,r){this.alpha=e,this.beta=1/n,this.dtype=s;const a=r||Math.random();this.randu=Ks.alea(a.toString()),this.randn=new Pr(0,1,s,!1,this.randu()),e<1?this.d=e+2/3:this.d=e-1/3,this.c=1/Math.sqrt(9*this.d)}nextValue(){let e,n,s,r,a,o;for(;;){do r=this.randn.nextValue(),o=1+this.c*r;while(o<=0);if(o*=o*o,e=r*r,n=1-.331*e*e,s=.5*e+this.d*(1-o+Math.log(o)),a=this.randu(),a<n||Math.log(a)<s)break}return o=1/this.beta*this.d*o,this.alpha<1&&(o*=Math.pow(this.randu(),1/this.alpha)),this.convertValue(o)}convertValue(e){return this.dtype==="float32"?e:Math.round(e)}}class Py{constructor(e=0,n=1,s,r){if(this.canReturnFloat=()=>this.dtype==null||this.dtype==="float32",this.min=e,this.range=n-e,this.dtype=s,r==null&&(r=Math.random()),typeof r=="number"&&(r=r.toString()),!this.canReturnFloat()&&this.range<=1)throw new Error(`The difference between ${e} - ${n} <= 1 and dtype is not float`);this.random=Ks.alea(r)}convertValue(e){return this.canReturnFloat()?e:Math.round(e)}nextValue(){return this.convertValue(this.min+this.range*this.random())}}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function By(t,e,n=1,s="float32",r){if(ye(t),n==null&&(n=1),s==null&&(s="float32"),s!=="float32"&&s!=="int32")throw new Error(`Unsupported data type ${s}`);const a=new Ry(e,n,s,r),o=xe(t,s);for(let i=0;i<o.values.length;i++)o.values[i]=a.nextValue();return o.toTensor()}const Pc=y({randomGamma_:By});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ly(t,e=0,n=1,s,r){if(ye(t),s!=null&&s==="bool")throw new Error(`Unsupported data type ${s}`);const a=new Pr(e,n,s,!1,r),o=xe(t,s);for(let i=0;i<o.values.length;i++)o.values[i]=a.nextValue();return o.toTensor()}const Br=y({randomNormal_:Ly});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function zy(t,e,n){if(e!=null&&e==="bool")throw new Error(`Unsupported data type ${e}`);return Br(t,0,1,e,n)}const Bc=y({randomStandardNormal_:zy});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Vy(t,e=0,n=1,s="float32",r){ye(t);const a=xe(t,s),o=new Py(e,n,null,r);for(let i=0;i<a.values.length;i++)a.values[i]=o.nextValue();return a.toTensor()}const Yn=y({randomUniform_:Vy});/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function jy(t,e,n,s){return Yn(t,e,n,"int32",s)}const Lc=y({randomUniformInt_:jy});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Pt(t,e,n=1,s="float32"){if(n===0)throw new Error("Cannot have a step of zero");const r={start:t,stop:e,step:n,dtype:s};return b.runKernel(ji,{},r)}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function My(t){const n={input:f(t,"input","real")};return b.runKernel(Mi,n)}const Bt=y({real_:My});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Wy(t){const n={x:f(t,"x","reciprocal")};return b.runKernel(Wi,n)}const zc=y({reciprocal_:Wy});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Uy(t){const n={x:f(t,"x","relu")};return b.runKernel(Ui,n)}const Tn=y({relu_:Uy});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Gy(t){const n={x:f(t,"x","relu6")};return b.runKernel(Hi,n)}const Lr=y({relu6_:Gy});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function qy(t,e){const s={x:f(t,"x","reverse")},r={dims:e};return b.runKernel(Xi,s,r)}const tt=y({reverse_:qy});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ky(t){const e=f(t,"x","reverse");return d(e.rank===1,()=>`Error in reverse1D: x must be rank 1 but got rank ${e.rank}.`),tt(e,0)}const Vc=y({reverse1d_:Ky});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Hy(t,e){const n=f(t,"x","reverse");return d(n.rank===2,()=>`Error in reverse2D: x must be rank 2 but got rank ${n.rank}.`),tt(n,e)}const jc=y({reverse2d_:Hy});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Xy(t,e){const n=f(t,"x","reverse");return d(n.rank===3,()=>`Error in reverse3D: x must be rank 3 but got rank ${n.rank}.`),tt(n,e)}const Mc=y({reverse3d_:Xy});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Jy(t,e){const n=f(t,"x","reverse");return d(n.rank===4,()=>`Error in reverse4D: x must be rank 4 but got rank ${n.rank}.`),tt(n,e)}const Wc=y({reverse4d_:Jy});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Yy(t){const n={x:f(t,"x","round")};return b.runKernel(Ji,n)}const zr=y({round_:Yy});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Zy(t){const n={x:f(t,"x","rsqrt","float32")};return b.runKernel(Yi,n)}const Uc=y({rsqrt_:Zy});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Qy(t){const n={x:f(t,"x","selu")};return b.runKernel(nu,n)}const Gc=y({selu_:Qy});function eb(t,e,n,s,r,a=[1,1],o="NHWC"){const i=f(t,"x","separableConv2d"),u=f(e,"depthwiseFilter","separableConv2d"),l=f(n,"pointwiseFilter","separableConv2d");let h=i,p=!1;if(i.rank===3&&(p=!0,h=$(i,[1,i.shape[0],i.shape[1],i.shape[2]])),o==="NCHW")throw new Error("separableConv2d currently does not support dataFormat NCHW; only NHWC is supported");d(h.rank===4,()=>`Error in separableConv2d: input must be rank 4, but got rank ${h.rank}.`),d(u.rank===4,()=>`Error in separableConv2d: depthwise filter must be rank 4, but got rank ${u.rank}.`),d(l.rank===4,()=>`Error in separableConv2d: pointwise filter must be rank 4, but got rank ${u.rank}.`),d(l.shape[0]===1,()=>`Error in separableConv2d: the first dimension of pointwise filter  must be 1, but got ${l.shape[0]}.`),d(l.shape[1]===1,()=>`Error in separableConv2d: the second dimension of pointwise filter must be 1, but got ${l.shape[1]}.`);const m=u.shape[2],g=u.shape[3];d(l.shape[2]===m*g,()=>`Error in separableConv2d: the third dimension of pointwise filter must be ${m*g}, but got ${l.shape[2]}.`);const N=Kn(h,u,s,r,o,a),w=yn(N,l,1,"valid",o);return p?$(w,[w.shape[1],w.shape[2],w.shape[3]]):w}const qc=y({separableConv2d_:eb});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function tb(t,e){const n=f(t,"x","setdiff1d"),s=f(e,"y","setdiff1d");d(n.dtype===s.dtype,()=>`x and y should have the same dtype, but got x (${n.dtype}) and y (${s.dtype}).`),d(n.rank===1,()=>`x should be 1D tensor, but got x (${n.shape}).`),d(s.rank===1,()=>`y should be 1D tensor, but got y (${s.shape}).`);const r=await n.data(),a=await s.data(),o=new Set(a);let i=0;for(let h=0;h<r.length;h++)o.has(r[h])||i++;const u=new Rn([i],n.dtype),l=new Rn([i],"int32");for(let h=0,p=0;h<r.length;h++)o.has(r[h])||(u.values[p]=r[h],l.values[p]=h,p++);return[u.toTensor(),l.toTensor()]}const Kc=tb;/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function nb(t){const n={x:f(t,"x","sign")};return b.runKernel(ou,n)}const Hc=y({sign_:nb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function sb(t){const n={x:f(t,"x","sin","float32")};return b.runKernel(ru,n)}const Xc=y({sin_:sb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function rb(t){const n={x:f(t,"x","sinh")};return b.runKernel(au,n)}const Jc=y({sinh_:rb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ab(t,e,n){const s=f(t,"x","slice1d");return d(s.rank===1,()=>`slice1d expects a rank-1 tensor, but got a rank-${s.rank} tensor`),M(s,[e],[n])}const Yc=y({slice1d_:ab});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ob(t,e,n){const s=f(t,"x","slice2d");return d(s.rank===2,()=>`slice2d expects a rank-2 tensor, but got a rank-${s.rank} tensor`),M(s,e,n)}const Zc=y({slice2d_:ob});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ib(t,e,n){const s=f(t,"x","slice3d");return d(s.rank===3,()=>`slice3d expects a rank-3 tensor, but got a rank-${s.rank} tensor`),M(s,e,n)}const Qc=y({slice3d_:ib});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ub(t,e,n){const s=f(t,"x","slice4d");return d(s.rank===4,()=>`slice4d expects a rank-4 tensor, but got a rank-${s.rank} tensor`),M(s,e,n)}const ep=y({slice4d_:ub});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function lb(t,e=-1){const n=f(t,"logits","softmax","float32");if(e===-1&&(e=n.rank-1),e!==n.rank-1)throw Error(`Softmax along a non-last dimension is not yet supported. Logits was rank ${n.rank} and dim was ${e}`);const s={logits:n},r={dim:e};return b.runKernel(mu,s,r)}const tp=y({softmax_:lb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function cb(t){d(t.dtype==="complex64",()=>`The dtype for tf.spectral.fft() must be complex64 but got ${t.dtype}.`);const e={input:t};return b.runKernel(Wo,e)}const Zn=y({fft_:cb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function pb(t){d(t.dtype==="complex64",()=>`The dtype for tf.spectral.ifft() must be complex64 but got ${t.dtype}.`);const e={input:t};return b.runKernel(Qo,e)}const un=y({ifft_:pb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function hb(t){const e=t.shape[t.shape.length-1],n=t.size/e;let s;if(e<=2){const r=$(t,[n,e]);s=un(r)}else{const r=[n,2*(e-1)],a=$(Bt(t),[n,e]),o=$(Sn(t),[n,e]),i=tt(M(a,[0,1],[n,e-2]),1),u=_(tt(M(o,[0,1],[n,e-2]),1),R(-1)),l=se([a,i],1),h=se([o,u],1),p=$(je(l,h),[r[0],r[1]]);s=un(p)}if(s=Bt(s),t.rank===3&&t.shape[0]!==0){const r=s,a=t.shape[0];s=$(s,[a,s.shape[0]/a,s.shape[1]]),r.dispose()}return s}const Vr=y({irfft_:hb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function mb(t,e,n=0){const r={x:f(t,"x","split")},a={numOrSizeSplits:e,axis:n};return b.runKernel(hu,r,a)}const Lt=y({split_:mb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function fb(t,e){d(t.dtype==="float32",()=>`The dtype for rfft() must be real value but got ${t.dtype}`);let n=t.shape[t.shape.length-1];const s=t.size/n;let r;if(e!=null&&e<n){const N=t.shape.map(w=>0),S=t.shape.map(w=>w);S[t.shape.length-1]=e,r=M(t,N,S),n=e}else if(e!=null&&e>n){const N=t.shape.map(S=>S);N[t.shape.length-1]=e-n,r=se([t,bt(N)],t.shape.length-1),n=e}else r=t;const a=ge(r),o=$(je(r,a),[s,n]),i=Zn(o),u=Math.floor(n/2)+1,l=Bt(i),h=Sn(i),p=Lt(l,[u,n-u],l.shape.length-1),m=Lt(h,[u,n-u],h.shape.length-1),g=r.shape.slice();return g[r.shape.length-1]=u,$(je(p[0],m[0]),g)}const Qn=y({rfft_:fb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function db(t,e){let n=f(t,"a","squaredDifference"),s=f(e,"b","squaredDifference");[n,s]=H(n,s),J(n.shape,s.shape);const r={a:n,b:s},a={};return b.runKernel(wu,r,a)}const jr=y({squaredDifference_:db});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function gb(t,e){const n=f(t,"x","squeeze","string_or_numeric");return $(n,Pa(n.shape,e).newShape)}const es=y({squeeze_:gb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function yb(t,e=0){const n=en(t,"tensors","stack","string_or_numeric");d(n.length>=1,()=>"Pass at least one tensor to tf.stack"),n.length>0&&d(e<=n[0].rank,()=>"Axis must be <= rank of the tensor");const s=n,r={axis:e};return b.runKernel(Fi,s,r)}const Fe=y({stack_:yb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function bb(t,e=0){const s={x:f(t,"x","step")},r={alpha:e};return b.runKernel(Cu,s,r)}const Mr=y({step_:bb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function wb(t,e,n,s,r=0,a=0,o=0,i=0,u=0){const h={x:f(t,"x","stridedSlice","string_or_numeric")},p={begin:e,end:n,strides:s,beginMask:r,endMask:a,ellipsisMask:o,newAxisMask:i,shrinkAxisMask:u};return b.runKernel(Su,h,p)}const np=y({stridedSlice_:wb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Nb(t){const n={x:f(t,"x","tan","float32")};return b.runKernel(_u,n)}const sp=y({tan_:Nb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function be(t,e){St(t);const n=Ae(t,e);if(n.length!==1)throw new Error("tensor1d() requires values to be a flat/TypedArray");return nt(t,null,n,e)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function xt(t,e,n){if(St(t),e!=null&&e.length!==2)throw new Error("tensor2d() requires shape to have two numbers");const s=Ae(t,n);if(s.length!==2&&s.length!==1)throw new Error("tensor2d() requires values to be number[][] or flat/TypedArray");if(s.length===1&&e==null)throw new Error("tensor2d() requires shape to be provided when `values` are a flat/TypedArray");return nt(t,e,s,n)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Wr(t,e,n){if(St(t),e!=null&&e.length!==3)throw new Error("tensor3d() requires shape to have three numbers");const s=Ae(t,n);if(s.length!==3&&s.length!==1)throw new Error("tensor3d() requires values to be number[][][] or flat/TypedArray");if(s.length===1&&e==null)throw new Error("tensor3d() requires shape to be provided when `values` are a flat array");return nt(t,e,s,n)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function rp(t,e,n){if(St(t),e!=null&&e.length!==4)throw new Error("tensor4d() requires shape to have four numbers");const s=Ae(t,n);if(s.length!==4&&s.length!==1)throw new Error("tensor4d() requires values to be number[][][][] or flat/TypedArray");if(s.length===1&&e==null)throw new Error("tensor4d() requires shape to be provided when `values` are a flat array");return nt(t,e,s,n)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ap(t,e,n){if(St(t),e!=null&&e.length!==5)throw new Error("tensor5d() requires shape to have five numbers");const s=Ae(t,n);if(s.length!==5&&s.length!==1)throw new Error("tensor5d() requires values to be number[][][][][] or flat/TypedArray");if(s.length===1&&e==null)throw new Error("tensor5d() requires shape to be provided when `values` are a flat array");return nt(t,e,s,n)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function op(t,e,n){if(St(t),e!=null&&e.length!==6)throw new Error("tensor6d() requires shape to have six numbers");const s=Ae(t,n);if(s.length!==6&&s.length!==1)throw new Error("tensor6d() requires values to be number[][][][][][] or flat/TypedArray");if(s.length===1&&e==null)throw new Error("tensor6d() requires shape to be provided when `values` are a flat array");return e=e||s,nt(t,e,s,n)}function Ur(t,e,n){const s=e.rank>1?e.shape[e.rank-1]:1,r=e.rank>1?e.rank-1:1,a=`Must have updates.shape = indices.shape[:batchDim] + shape[sliceDim:], got updates.shape: ${n.shape}, indices.shape: ${e.shape}, shape: ${t}, sliceDim: ${s}, and batchDim: ${r}.`;if(n.rank<r)throw new Error(a+` update.rank < ${r}. `);if(t.length<s+(n.rank-r))throw new Error(a+` Output shape length < ${s+(n.rank-r)}`);if(n.rank!==r+t.length-s)throw new Error(a+` update.rank != ${r+t.length-s}`);for(let o=0;o<r;++o)if(n.shape[o]!==e.shape[o])throw new Error(a+` updates.shape[${o}] (${n.shape[o]}) != indices.shape[${o}] (${e.shape[o]}).`);for(let o=0;o<n.rank-r;++o)if(n.shape[o+r]!==t[o+s])throw new Error(a+` updates.shape[${o+r}] (${n.shape[o+r]}) != shape[${o+r}] (${t[o+r]})`)}function ts(t,e,n){if(e.rank<1)throw new Error(`tf.scatterND() expects the indices to be rank 1 or higher, but the rank was ${e.rank}.`);if(t.rank<1)throw new Error(`tf.scatterND() expects the updates to be rank 1 or higher, but the rank was ${t.rank}.`);if(e.dtype!=="int32")throw new Error(`The dtype of 'indices' should be int32, but got dtype: ${e.dtype}`);if(n.length<1)throw new Error(`Output rank must be greater or equal to 1, but got shape: ${n}`);if(n.length===0){if(e.size===0)throw new Error(`Indices specified for empty output. indices shape: ${e.shape}`);if(t.size===0)throw new Error(`Updates specified for empty output. updates shape: ${t.shape}`)}Ur(n,e,t)}function ip(t,e,n){const s=e.shape.length,r=s>1?e.shape[s-1]:1,a=n.length;let o=1;for(let p=r;p<a;++p)o*=n[p];const i=r<1?1:r,u=j(e.shape)/i,l=[...zt(n.slice(0,r)),1],h=j(n);return{sliceRank:r,numUpdates:u,sliceSize:o,strides:l,outputSize:h}}const Sb=Object.freeze(Object.defineProperty({__proto__:null,calculateShapes:ip,validateInput:ts,validateUpdateShape:Ur},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Tb(t,e,n){const s=f(t,"tensor","tensorScatterupdate"),r=f(e,"indices","tensorScatterupdate","int32"),a=f(n,"updates","tensorScatterupdate");if(ts(a,r,s.shape),s.dtype!==a.dtype)throw new Error(`tensor and updates must have the same dtype, instead they are ${s.dtype} and ${a.dtype}.`);const o={tensor:s,indices:r,updates:a},i={};return b.runKernel(Qi,o,i)}const up=y({tensorScatterUpdate_:Tb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function $b(t,e=1,n=!0){const s=f(t,"x","topk");if(s.rank===0)throw new Error("topk() expects the input to be of rank 1 or higher");const r=s.shape[s.shape.length-1];if(e<0)throw new Error(`'k' passed to topk() must be >= 0 but got ${e}`);if(e>r)throw new Error(`'k' passed to topk() must be <= the last dimension (${r}) but got ${e}`);const a={x:s},o={k:e,sorted:n},[i,u]=b.runKernel(Iu,a,o);return{values:i,indices:u}}const lp=y({topk_:$b});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Eb(t,e=0,n=1,s,r){if(ye(t),s!=null&&s==="bool")throw new Error("Unsupported data type $ { dtype }");const a=new Pr(e,n,s,!0,r),o=xe(t,s);for(let i=0;i<o.values.length;i++)o.values[i]=a.nextValue();return o.toTensor()}const cp=y({truncatedNormal_:Eb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function kb(t,e=0){const n=f(t,"x","unique","string_or_numeric");d(n.rank>0,()=>"The input tensor must be at least 1D");const s={x:n},r={axis:e},[a,o]=b.runKernel(xu,s,r);return{values:a,indices:o}}const pp=y({unique_:kb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function _b(t,e,n){const s=f(t,"x","unsortedSegmentSum"),r=f(e,"segmentIds","unsortedSegmentSum","int32");d(Ot(n),()=>"numSegments must be of dtype int");const a={x:s,segmentIds:r},o={numSegments:n};return b.runKernel(Du,a,o)}const hp=y({unsortedSegmentSum_:_b});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function vb(t,e=0){const n=f(t,"x","unstack","string_or_numeric");d(e>=-n.shape.length&&e<n.shape.length,()=>`Axis = ${e} is not in [-${n.shape.length}, ${n.shape.length})`);const s={value:n},r={axis:e};return b.runKernel(Ou,s,r)}const st=y({unstack_:vb});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function mp(t,e){return Jn(t,e,"right")}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function fp(t,e=!0,n,s){return b.makeVariable(t,e,n,s)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function dp(t,e){const n=[];for(let a=0;a<e.length;a++)e[a]&&n.push(a);const s=xe(t,"int32"),r=xe([n.length,t.length],"int32");for(let a=0;a<n.length;a++){const o=s.indexToLoc(n[a]),i=a*t.length;r.values.set(o,i)}return r.toTensor()}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function Ib(t){const e=f(t,"condition","whereAsync","bool"),n=await e.data(),s=dp(e.shape,n);return t!==e&&e.dispose(),s}const Gr=Ib;/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function Ab(t,e,n){const s=f(t,"tensor","boolMask"),r=f(e,"mask","boolMask","bool"),a=n??0,o=r.rank,i=s.shape;d(o>0,()=>"mask cannot be scalar"),le(i.slice(a,a+o),r.shape,"mask's shape must match the first K dimensions of tensor's shape,");let u=1;for(let S=a;S<a+o;S++)u*=i[S];const l=i.slice(0,a).concat([u],i.slice(a+o)),h=$(s,l),p=$(r,[-1]),m=await Gr(p),g=es(m,[1]),N=Sr(h,g,a);return t!==s&&s.dispose(),e!==r&&r.dispose(),g.dispose(),h.dispose(),p.dispose(),m.dispose(),N}const gp=Ab;/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function xb(t,e,n){const s=f(t,"x","transpose");if(e==null&&(e=s.shape.map((o,i)=>i).reverse()),d(s.rank===e.length,()=>`Error in transpose: rank of input ${s.rank} must match length of perm ${e}.`),e.forEach(o=>{d(o>=0&&o<s.rank,()=>`All entries in 'perm' must be between 0 and ${s.rank-1} but got ${e}`)}),s.rank<=1)return s.clone();const r={x:s},a={perm:e};return s.dtype==="complex64"?V(()=>{let o=Bt(s),i=Sn(s);return o=b.runKernel(_n,{x:o},a),i=b.runKernel(_n,{x:i},a),n&&(i=ke(i)),je(o,i)}):b.runKernel(_n,r,a)}const ln=y({transpose_:xb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ob(t,e,n,s,r=!0){const a=f(t,"v","movingAverage"),o=f(e,"x","movingAverage"),i=f(n,"decay","movingAverage");Uu(a,o),d(_e(a.shape,o.shape),()=>"Shape mismatch in v and x");const u=R(1),l=F(u,i);let h=_(F(o,a),l);if(r){d(s!=null,()=>"When using zeroDebias: true, step is required.");const p=f(s,"step","movingAverage");h=G(h,F(u,Ct(i,p)))}return x(a,h)}const yp=y({movingAverage_:Ob});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Db(t,e,n){ye(n);const s=f(t,"indices","scatterND","int32"),r=f(e,"updates","scatterND");ts(r,s,n);const a={indices:s,updates:r},o={shape:n};return b.runKernel(Zi,a,o)}const bp=y({scatterND_:Db});function Fb(t,e,n,s){if(t.dtype!=="int32")throw new Error(`tf.sparseToDense() expects the indices to be int32 type, but the dtype was ${t.dtype}.`);if(t.rank>2)throw new Error(`sparseIndices should be a scalar, vector, or matrix, but got shape ${t.shape}.`);const r=t.rank>0?t.shape[0]:1,a=t.rank>1?t.shape[1]:1;if(n.length!==a)throw new Error(`outputShape has incorrect number of elements:, ${n.length}, should be: ${a}.`);const o=e.size;if(!(e.rank===0||e.rank===1&&o===r))throw new Error(`sparseValues has incorrect shape ${e.shape}, should be [] or [${r}]`);if(e.dtype!==s.dtype)throw new Error("sparseValues.dtype must match defaultValues.dtype")}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Cb(t,e,n,s=0){ye(n);const r=f(t,"sparseIndices","sparseToDense","int32"),a=f(e,"sparseValues","sparseToDense","string_or_numeric"),o=f(s,"defaultValue","sparseToDense",a.dtype);Fb(r,a,n,o);const i={sparseIndices:r,sparseValues:a,defaultValue:o},u={outputShape:n};return b.runKernel(bu,i,u)}const wp=y({sparseToDense_:Cb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Rb(t,e){const n=f(e,"indices","gatherND","int32"),r={params:f(t,"x","gatherND","string_or_numeric"),indices:n};return b.runKernel(Jo,r)}const Np=y({gatherND_:Rb});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Pb(t,e){if(e==null)return t.shape.slice();if(_e(t.shape,e))return e;if(t.shape.length===e.length){const n=[];for(let s=0;s<t.shape.length;s++)e[s]==null&&t.shape[s]!=null?n.push(t.shape[s]):n.push(e[s]);return n}return e}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Bb(t,e,n,s){const r=f(t,"x","dropout");if(d(r.dtype==="float32",()=>`x has to be a floating point tensor since it's going to be scaled, but got a ${r.dtype} tensor instead.`),d(e>=0&&e<1,()=>`rate must be a float in the range [0, 1), but got ${e}.`),e===0)return t instanceof X?r.clone():r;const a=Pb(r,n),o=1-e,i=G(Nr(x(Yn(a,0,1,"float32",s),o)),o);return _(r,i)}const Sp=y({dropout_:Bb});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function qr(t){return Math.floor(Math.pow(2,Math.ceil(Math.log(t)/Math.log(2))))}function ns(t,e,n){const s=1-t%2,r=new Float32Array(t);for(let a=0;a<t;++a){const o=2*Math.PI*a/(t+s-1);r[a]=e-n*Math.cos(o)}return be(r,"float32")}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function Lb(t,e,n=1){const s=f(t,"predictions","inTopK"),r=f(e,"targets","inTopK");d(s.rank>1,()=>`inTopK() expects the predictions to be of rank 2 or higher, but got ${s.rank}`),d(s.rank-1===r.rank,()=>`predictions rank should be 1 larger than targets rank, but got predictions rank ${s.rank} and targets rank ${r.rank}`),le(s.shape.slice(0,s.shape.length-1),r.shape,"predictions's shape should be align with the targets' shape, except the last dimension.");const a=s.shape[s.shape.length-1];d(n>0&&n<=a,()=>`'k' passed to inTopK() must be > 0 && <= the predictions last dimension (${a}), but got ${n}`);const o=await s.data(),i=await r.data(),[u,l]=[o.length/a,a],h=Ba("bool",u);for(let p=0;p<u;p++){const m=p*l,g=o.subarray(m,m+l),N=[];for(let S=0;S<g.length;S++)N.push({value:g[S],index:S});N.sort((S,w)=>w.value-S.value),h[p]=0;for(let S=0;S<n;S++)if(N[S].index===i[p]){h[p]=1;break}}return t!==s&&s.dispose(),e!==r&&r.dispose(),Ee(h,r.shape,"bool")}const Tp=Lb;/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function zb(t,e,n,s,r,a="NHWC",o){let i=t;t.rank===3&&(i=$(t,[1,t.shape[0],t.shape[1],t.shape[2]]));let u=e;u.rank===3&&(u=$(e,[1,e.shape[0],e.shape[1],e.shape[2]])),d(i.rank===4,()=>`Error in conv2dDerFilter: input must be rank 4, but got shape ${i.shape}.`),d(u.rank===4,()=>`Error in conv2dDerFilter: dy must be rank 4, but got shape ${u.shape}.`),d(n.length===4,()=>`Error in conv2dDerFilter: filterShape must be length 4, but got ${n}.`);const l=a==="NHWC"?i.shape[3]:i.shape[1],h=a==="NHWC"?u.shape[3]:u.shape[1];d(l===n[2],()=>`Error in conv2dDerFilter: depth of input ${l}) must match input depth in filter (${n[2]}.`),d(h===n[3],()=>`Error in conv2dDerFilter: depth of dy (${h}) must match output depth for filter (${n[3]}).`),Se("conv2dDerFilter",r,o);const p={x:i,dy:u},m={strides:s,pad:r,dataFormat:a,dimRoundingMode:o,filterShape:n};return b.runKernel(wo,p,m)}const Vb=y({conv2DBackpropFilter_:zb});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ss(t,e,n){if(n==null||n==="linear")return t;if(n==="relu")return _(t,Mr(e));throw new Error(`Cannot compute gradient for fused activation ${n}.`)}function rs(t,e){let n=e;const s=dr(t.shape,e.shape);return s.length>0&&(n=U(n,s)),$(n,t.shape)}function as(t,e,n,s){if(e==="linear")return t;if(e==="relu")return Tn(t);if(e==="elu")return yr(t);if(e==="relu6")return Lr(t);if(e==="prelu")return Fr(t,n);if(e==="leakyrelu")return $r(t,s);if(e==="sigmoid")return ht(t);throw new Error(`Unknown fused activation ${e}.`)}const os=(t,e)=>!(t>0)||e==="linear";/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function jb({x:t,filter:e,strides:n,pad:s,dataFormat:r="NHWC",dilations:a=[1,1],dimRoundingMode:o,bias:i,activation:u="linear",preluActivationWeights:l,leakyreluAlpha:h}){if(u=u||"linear",os(b.state.gradientDepth,u)===!1){d(r==="NHWC",()=>`Error in fused conv2d: got dataFormat of ${r} but only NHWC is currently supported for the case of gradient depth is 0 and the activation is not linear.`);let I=yn(t,e,n,s,r,a,o);return i!=null&&(I=x(I,i)),as(I,u,l,h)}const p=f(t,"x","conv2d","float32"),m=f(e,"filter","conv2d","float32");let g=p,N=!1;p.rank===3&&(N=!0,g=$(p,[1,p.shape[0],p.shape[1],p.shape[2]])),d(g.rank===4,()=>`Error in fused conv2d: input must be rank 4, but got rank ${g.rank}.`),d(m.rank===4,()=>`Error in fused conv2d: filter must be rank 4, but got rank ${m.rank}.`),Se("fused conv2d",s,o);const S=r==="NHWC"?g.shape[3]:g.shape[1];d(m.shape[2]===S,()=>`Error in conv2d: depth of input (${S}) must match input depth for filter ${m.shape[2]}.`),d(Me(n,a),()=>`Error in conv2D: Either strides or dilations must be 1. Got strides ${n} and dilations '${a}'`);const w=dn(g.shape,m.shape,n,a,s,o);let T;i!=null&&(T=f(i,"bias","fused conv2d"),[T]=H(T,p),r==="NHWC"?J(w.outShape,T.shape):(d(T.shape.length<=1,()=>`Error in fused conv2d: only supports scalar or 1-D Tensor bias for NCHW format but got the bias of rank-${T.shape.length}.`),d(T.shape.length===0||T.shape[0]===w.outChannels||T.shape[0]===1,()=>`Error in fused conv2d: bias shape (${T.shape}) is not compatible with the number of output channels (${w.outChannels})`)));let v;if(l!=null){const I=l.shape;if(d(I.length<=1||I.length===3,()=>`Error in fused conv2d: only supports scalar, 1-D Tensor or 3-D Tensor PReLU activation weights but got a tensor of rank-${I.length}.`),I.length===1)d(I[0]===1||I[0]===w.outChannels,()=>`Error in fused conv2d: PReLU activation weights (${I}) is not compatible with the number of output channels (${w.outChannels}).`);else if(I.length===3)try{J(I,w.outShape)}catch{const P=`Error in fused conv2d: PReLU activation weights (${I}) is not compatible with the output shape of the conv2d (${w.outShape}).`;throw Error(P)}v=f(l,"prelu weights","fused conv2d")}const E=(I,C)=>{d(r==="NHWC",()=>`Error in gradient of fused conv2D: got dataFormat of ${r} but only NHWC is currently supported.`);const[P,D,L,B]=C,Y=ss(I,L,u);d(sn(a),()=>`Error in gradient of fused conv2D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '${a}'`);const ne=Bl(D.shape,Y,P,n,s),re=Vb(D,Y,P.shape,n,s),pe=[ne,re];if(B!=null){const Tt=rs(B,Y);pe.push(Tt)}return pe},k={x:g,filter:m,bias:T,preluActivationWeights:v},A={strides:n,pad:s,dataFormat:r,dilations:a,dimRoundingMode:o,activation:u,leakyreluAlpha:h};return i==null?De((C,P,D)=>{let L=b.runKernel(bs,k,A);return D([P,C,L]),N&&(L=$(L,[L.shape[1],L.shape[2],L.shape[3]])),{value:L,gradFunc:E}})(g,m):De((C,P,D,L)=>{let B=b.runKernel(bs,k,A);return L([P,C,B,D]),N&&(B=$(B,[B.shape[1],B.shape[2],B.shape[3]])),{value:B,gradFunc:E}})(g,m,T)}const Mb=y({fusedConv2d_:jb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Wb(t,e,n,s,r,a=[1,1],o){let i=t;t.rank===3&&(i=$(t,[1,t.shape[0],t.shape[1],t.shape[2]]));let u=e;u.rank===3&&(u=$(e,[1,e.shape[0],e.shape[1],e.shape[2]]));const l={x:i,dy:u},h={strides:s,pad:r,dimRoundingMode:o,dilations:a,filterShape:n};return b.runKernel(Oo,l,h)}const Ub=y({depthwiseConv2dNativeBackpropFilter_:Wb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Gb(t,e,n,s,r,a=[1,1],o){let i=e,u=!1;e.rank===3&&(u=!0,i=$(e,[1,e.shape[0],e.shape[1],e.shape[2]]));const l={dy:i,filter:n},h={strides:s,pad:r,dimRoundingMode:o,dilations:a,inputShape:t},p=b.runKernel(Do,l,h);return u?$(p,[p.shape[1],p.shape[2],p.shape[3]]):p}const qb=y({depthwiseConv2dNativeBackpropInput_:Gb});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Kb({x:t,filter:e,strides:n,pad:s,dataFormat:r="NHWC",dilations:a=[1,1],dimRoundingMode:o,bias:i,activation:u="linear",preluActivationWeights:l,leakyreluAlpha:h}){if(os(b.state.gradientDepth,u)===!1){let A=Kn(t,e,n,s,r,a,o);return i!=null&&(A=x(A,i)),as(A,u,l,h)}const p=f(t,"x","depthwiseConv2d","float32"),m=f(e,"filter","depthwiseConv2d","float32");let g=p,N=!1;p.rank===3&&(N=!0,g=$(p,[1,p.shape[0],p.shape[1],p.shape[2]])),d(g.rank===4,()=>`Error in fused depthwiseConv2d: input must be rank 4, but got rank ${g.rank}.`),d(m.rank===4,()=>`Error in fused depthwiseConv2d: filter must be rank 4, but got rank ${m.rank}.`),d(g.shape[3]===m.shape[2],()=>`Error in fused depthwiseConv2d: number of input channels (${g.shape[3]}) must match the inChannels dimension in filter ${m.shape[2]}.`),a==null&&(a=[1,1]),d(Me(n,a),()=>`Error in fused depthwiseConv2d: Either strides or dilations must be 1. Got strides ${n} and dilations '${a}'`),Se("fused depthwiseConv2d",s,o);const S=dn(g.shape,m.shape,n,a,s,o,!0);let w;i!=null&&(w=f(i,"bias","fused conv2d"),[w]=H(w,p),J(S.outShape,w.shape));let T;l!=null&&(T=f(l,"prelu weights","fused depthwiseConv2d"));const v=(A,I)=>{d(sn(a),()=>`Error in gradient of fused depthwiseConv2d: dilation rates greater than 1 are not yet supported. Got dilations '${a}'`);const[C,P,D,L]=I,B=ss(A,D,u),Y=qb(P.shape,B,C,n,s,a,o),ne=Ub(P,B,C.shape,n,s,a,o);if(L!=null){const re=rs(w,B);return[Y,ne,re]}return[Y,ne]},E={x:g,filter:m,bias:w,preluActivationWeights:T},k={strides:n,pad:s,dataFormat:r,dilations:a,dimRoundingMode:o,activation:u,leakyreluAlpha:h};return i==null?De((I,C,P)=>{let D=b.runKernel(ws,E,k);return P([C,I,D]),N&&(D=$(D,[D.shape[1],D.shape[2],D.shape[3]])),{value:D,gradFunc:v}})(g,m):De((I,C,P,D)=>{let L=b.runKernel(ws,E,k);return D([C,I,L,P]),N&&(L=$(L,[L.shape[1],L.shape[2],L.shape[3]])),{value:L,gradFunc:v}})(g,m,w)}const Hb=y({fusedDepthwiseConv2d_:Kb});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Xb({a:t,b:e,transposeA:n=!1,transposeB:s=!1,bias:r,activation:a="linear",preluActivationWeights:o,leakyreluAlpha:i=.2}){if(os(b.state.gradientDepth,a)===!1){let B=z(t,e,n,s);return r!=null&&(B=x(B,r)),as(B,a,o,i)}let u=f(t,"a","fused matMul"),l=f(e,"b","fused matMul");[u,l]=H(u,l);const h=n?u.shape[u.rank-2]:u.shape[u.rank-1],p=s?l.shape[l.rank-1]:l.shape[l.rank-2],m=n?u.shape[u.rank-1]:u.shape[u.rank-2],g=s?l.shape[l.rank-2]:l.shape[l.rank-1],N=u.shape.slice(0,-2),S=l.shape.slice(0,-2),w=j(N),T=j(S);d(h===p,()=>`Error in fused matMul: inner shapes (${h}) and (${p}) of Tensors with shapes ${u.shape} and ${l.shape} and transposeA=${n} and transposeB=${s} must match.`);const E=J(u.shape.slice(0,-2),l.shape.slice(0,-2)).concat([m,g]),k=n?$(u,[w,h,m]):$(u,[w,m,h]),A=s?$(l,[T,g,p]):$(l,[T,p,g]);let I;r!=null&&(I=f(r,"bias","fused matMul"),[I]=H(I,u),J(E,I.shape));let C;o!=null&&(C=f(o,"prelu weights","fused matMul"));const P=(B,Y)=>{const[ne,re,pe,Tt]=Y,Ce=ss($(B,pe.shape),pe,a);let $t,Et;if(!n&&!s?($t=z(Ce,re,!1,!0),Et=z(ne,Ce,!0,!1)):!n&&s?($t=z(Ce,re,!1,!1),Et=z(Ce,ne,!0,!1)):n&&!s?($t=z(re,Ce,!1,!0),Et=z(ne,Ce,!1,!1)):($t=z(re,Ce,!0,!0),Et=z(Ce,ne,!0,!0)),r!=null){const ah=rs(Tt,Ce);return[$t,Et,ah]}else return[$t,Et]},D={a:k,b:A,bias:I,preluActivationWeights:C},L={transposeA:n,transposeB:s,activation:a,leakyreluAlpha:i};return r==null?De((Y,ne,re)=>{const pe=b.runKernel(ys,D,L);return re([Y,ne,pe]),{value:$(pe,E),gradFunc:P}})(k,A):De((Y,ne,re,pe)=>{const Tt=b.runKernel(ys,D,L);return pe([Y,ne,Tt,re]),{value:$(Tt,E),gradFunc:P}})(k,A,I)}const Jb=y({fusedMatMul_:Xb});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const $p=Object.freeze(Object.defineProperty({__proto__:null,conv2d:Mb,depthwiseConv2d:Hb,matMul:Jb},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Yb(t){return ns(t,.54,.46)}const Zb=y({hammingWindow_:Yb});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Qb(t){return ns(t,.5,.5)}const Ep=y({hannWindow_:Qb});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ew(t,e,n,s=!1,r=0){let a=0;const o=[];for(;a+e<=t.size;)o.push(M(t,a,e)),a+=n;if(s)for(;a<t.size;){const i=a+e-t.size,u=se([M(t,a,e-i),Vt([i],r)]);o.push(u),a+=n}return o.length===0?xt([],[0,e]):$(se(o),[o.length,e])}const kp=y({frame_:ew});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function tw(t,e,n,s,r=Ep){s==null&&(s=qr(e));const a=kp(t,e,n),o=_(a,r(e));return Qn(o,s)}const nw=y({stft_:tw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function sw(t,e,n,s,r="bilinear",a=0){const o=f(t,"image","cropAndResize"),i=f(e,"boxes","cropAndResize","float32"),u=f(n,"boxInd","cropAndResize","int32"),l=i.shape[0];d(o.rank===4,()=>`Error in cropAndResize: image must be rank 4,but got rank ${o.rank}.`),d(i.rank===2&&i.shape[1]===4,()=>`Error in cropAndResize: boxes must be have size [${l},4] but had shape ${i.shape}.`),d(u.rank===1&&u.shape[0]===l,()=>`Error in cropAndResize: boxInd must be have size [${l}] but had shape ${i.shape}.`),d(s.length===2,()=>`Error in cropAndResize: cropSize must be of length 2, but got length ${s.length}.`),d(s[0]>=1&&s[1]>=1,()=>`cropSize must be atleast [1,1], but was ${s}`),d(r==="bilinear"||r==="nearest",()=>`method must be bilinear or nearest, but was ${r}`);const h={image:o,boxes:i,boxInd:u},p={method:r,extrapolationValue:a,cropSize:s};return b.runKernel(vo,h,p)}const rw=y({cropAndResize_:sw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function aw(t){const e=f(t,"image","flipLeftRight","float32");d(e.rank===4,()=>`Error in flipLeftRight: image must be rank 4,but got rank ${e.rank}.`);const n={image:e};return b.runKernel(Go,n,{})}const ow=y({flipLeftRight_:aw});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function iw(t){const e=f(t,"image","grayscaleToRGB"),n=e.rank-1,s=e.shape[n];d(e.rank>=2,()=>`Error in grayscaleToRGB: images must be at least rank 2, but got rank ${e.rank}.`),d(s===1,()=>`Error in grayscaleToRGB: last dimension of a grayscale image should be size 1, but got size ${s}.`);const r=new Array(e.rank);return r.fill(1,0,n),r[n]=3,At(e,r)}const uw=y({grayscaleToRGB_:iw});/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function lw(t){const e=f(t,"image","RGBToGrayscale"),n=e.rank-1,s=e.shape[n];d(e.rank>=2,()=>`Error in RGBToGrayscale: images must be at least rank 2, but got rank ${e.rank}.`),d(s===3,()=>`Error in RGBToGrayscale: last dimension of an RGB image should be size 3, but got size ${s}.`);const r=e.dtype,a=q(e,"float32"),o=be([.2989,.587,.114]);let i;switch(e.rank){case 2:i=ut("ij,j->i",a,o);break;case 3:i=ut("ijk,k->ij",a,o);break;case 4:i=ut("ijkl,l->ijk",a,o);break;case 5:i=ut("ijklm,m->ijkl",a,o);break;case 6:i=ut("ijklmn,n->ijklm",a,o);break;default:throw new Error("Not a valid tensor rank.")}return i=Re(i,-1),q(i,r)}const cw=y({rgbToGrayscale_:lw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function pw(t,e,n=0,s=.5){const r=f(t,"image","rotateWithOffset","float32");d(r.rank===4,()=>`Error in rotateWithOffset: image must be rank 4,but got rank ${r.rank}.`);const a={image:r},o={radians:e,fillValue:n,center:s};return b.runKernel(Ru,a,o)}const hw=y({rotateWithOffset_:pw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Mt(t,e,n,s,r,a){s==null&&(s=.5),r==null&&(r=Number.NEGATIVE_INFINITY),a==null&&(a=0);const o=t.shape[0];return n=Math.min(n,o),d(0<=s&&s<=1,()=>`iouThreshold must be in [0, 1], but was '${s}'`),d(t.rank===2,()=>`boxes must be a 2D tensor, but was of rank '${t.rank}'`),d(t.shape[1]===4,()=>`boxes must have 4 columns, but 2nd dimension was ${t.shape[1]}`),d(e.rank===1,()=>"scores must be a 1D tensor"),d(e.shape[0]===o,()=>`scores has incompatible shape with boxes. Expected ${o}, but was ${e.shape[0]}`),d(0<=a&&a<=1,()=>`softNmsSigma must be in [0, 1], but was '${a}'`),{maxOutputSize:n,iouThreshold:s,scoreThreshold:r,softNmsSigma:a}}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function mw(t,e,n,s=.5,r=Number.NEGATIVE_INFINITY){const a=f(t,"boxes","nonMaxSuppression","float32"),o=f(e,"scores","nonMaxSuppression","float32"),i=Mt(a,o,n,s,r);n=i.maxOutputSize,s=i.iouThreshold,r=i.scoreThreshold;const u={maxOutputSize:n,iouThreshold:s,scoreThreshold:r};return b.runKernel(Ii,{boxes:a,scores:o},u)}const fw=y({nonMaxSuppression_:mw});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function dw(t,e,n){const s=gw(t,e,n),r=s<0?-(s+1):s;t.splice(r,0,e)}function gw(t,e,n){return bw(t,e,n||yw)}function yw(t,e){return t>e?1:t<e?-1:0}function bw(t,e,n){let s=0,r=t.length,a=0,o=!1;for(;s<r;){a=s+(r-s>>>1);const i=n(e,t[a]);i>0?s=a+1:(r=a,o=!i)}return o?s:-s-1}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function _p(t,e,n,s,r){return Kr(t,e,n,s,r,0)}function vp(t,e,n,s,r,a){return Kr(t,e,n,s,r,0,!1,a,!0)}function Ip(t,e,n,s,r,a){return Kr(t,e,n,s,r,a,!0)}function Kr(t,e,n,s,r,a,o=!1,i=!1,u=!1){const l=[];for(let w=0;w<e.length;w++)e[w]>r&&l.push({score:e[w],boxIndex:w,suppressBeginIndex:0});l.sort(da);const h=a>0?-.5/a:0,p=[],m=[];for(;p.length<n&&l.length>0;){const w=l.pop(),{score:T,boxIndex:v,suppressBeginIndex:E}=w;if(T<r)break;let k=!1;for(let A=p.length-1;A>=E;--A){const I=ww(t,v,p[A]);if(I>=s){k=!0;break}if(w.score=w.score*Nw(s,h,I),w.score<=r)break}w.suppressBeginIndex=p.length,k||(w.score===T?(p.push(v),m.push(w.score)):w.score>r&&dw(l,w,da))}const g=p.length,N=n-g;i&&N>0&&(p.push(...new Array(N).fill(0)),m.push(...new Array(N).fill(0)));const S={selectedIndices:p};return o&&(S.selectedScores=m),u&&(S.validOutputs=g),S}function ww(t,e,n){const s=t.subarray(e*4,e*4+4),r=t.subarray(n*4,n*4+4),a=Math.min(s[0],s[2]),o=Math.min(s[1],s[3]),i=Math.max(s[0],s[2]),u=Math.max(s[1],s[3]),l=Math.min(r[0],r[2]),h=Math.min(r[1],r[3]),p=Math.max(r[0],r[2]),m=Math.max(r[1],r[3]),g=(i-a)*(u-o),N=(p-l)*(m-h);if(g<=0||N<=0)return 0;const S=Math.max(a,l),w=Math.max(o,h),T=Math.min(i,p),v=Math.min(u,m),E=Math.max(T-S,0)*Math.max(v-w,0);return E/(g+N-E)}function Nw(t,e,n){const s=Math.exp(e*n*n);return n<=t?s:0}function da(t,e){return t.score-e.score||t.score===e.score&&e.boxIndex-t.boxIndex}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function Sw(t,e,n,s=.5,r=Number.NEGATIVE_INFINITY){const a=f(t,"boxes","nonMaxSuppressionAsync"),o=f(e,"scores","nonMaxSuppressionAsync"),i=Mt(a,o,n,s,r);n=i.maxOutputSize,s=i.iouThreshold,r=i.scoreThreshold;const u=await Promise.all([a.data(),o.data()]),l=u[0],h=u[1],{selectedIndices:p}=_p(l,h,n,s,r);return a!==t&&a.dispose(),o!==e&&o.dispose(),be(p,"int32")}const Tw=Sw;/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function $w(t,e,n,s=.5,r=Number.NEGATIVE_INFINITY,a=0){const o=f(t,"boxes","nonMaxSuppression"),i=f(e,"scores","nonMaxSuppression"),u=Mt(o,i,n,s,r,a);n=u.maxOutputSize,s=u.iouThreshold,r=u.scoreThreshold,a=u.softNmsSigma;const l={boxes:o,scores:i},h={maxOutputSize:n,iouThreshold:s,scoreThreshold:r,softNmsSigma:a},p=b.runKernel(xi,l,h);return{selectedIndices:p[0],selectedScores:p[1]}}const Ew=y({nonMaxSuppressionWithScore_:$w});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function kw(t,e,n,s=.5,r=Number.NEGATIVE_INFINITY,a=0){const o=f(t,"boxes","nonMaxSuppressionAsync"),i=f(e,"scores","nonMaxSuppressionAsync"),u=Mt(o,i,n,s,r,a);n=u.maxOutputSize,s=u.iouThreshold,r=u.scoreThreshold,a=u.softNmsSigma;const l=await Promise.all([o.data(),i.data()]),h=l[0],p=l[1],{selectedIndices:m,selectedScores:g}=Ip(h,p,n,s,r,a);return o!==t&&o.dispose(),i!==e&&i.dispose(),{selectedIndices:be(m,"int32"),selectedScores:be(g)}}const _w=kw;/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function vw(t,e,n,s=.5,r=Number.NEGATIVE_INFINITY,a=!1){const o=f(t,"boxes","nonMaxSuppression"),i=f(e,"scores","nonMaxSuppression"),u=Mt(o,i,n,s,r,null),l=u.maxOutputSize,h=u.iouThreshold,p=u.scoreThreshold,m={boxes:o,scores:i},g={maxOutputSize:l,iouThreshold:h,scoreThreshold:p,padToMaxOutputSize:a},N=b.runKernel(Ai,m,g);return{selectedIndices:N[0],validOutputs:N[1]}}const Iw=y({nonMaxSuppressionPadded_:vw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function Aw(t,e,n,s=.5,r=Number.NEGATIVE_INFINITY,a=!1){const o=f(t,"boxes","nonMaxSuppressionAsync"),i=f(e,"scores","nonMaxSuppressionAsync"),u=Mt(o,i,n,s,r,null),l=u.maxOutputSize,h=u.iouThreshold,p=u.scoreThreshold,[m,g]=await Promise.all([o.data(),i.data()]),{selectedIndices:N,validOutputs:S}=vp(m,g,l,h,p,a);return o!==t&&o.dispose(),i!==e&&i.dispose(),{selectedIndices:be(N,"int32"),validOutputs:R(S,"int32")}}const xw=Aw;/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ow(t,e,n=!1,s=!1){const r=f(t,"images","resizeBilinear");d(r.rank===3||r.rank===4,()=>`Error in resizeBilinear: x must be rank 3 or 4, but got rank ${r.rank}.`),d(e.length===2,()=>`Error in resizeBilinear: new shape must 2D, but got shape ${e}.`),d(s===!1||n===!1,()=>"Error in resizeBilinear: If halfPixelCenters is true, alignCorners must be false.");let a=r,o=!1;r.rank===3&&(o=!0,a=$(r,[1,r.shape[0],r.shape[1],r.shape[2]]));const i={images:a},u={alignCorners:n,halfPixelCenters:s,size:e},l=b.runKernel(Ki,i,u);return o?$(l,[l.shape[1],l.shape[2],l.shape[3]]):l}const Dw=y({resizeBilinear_:Ow});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Fw(t,e,n=!1,s=!1){const r=f(t,"images","resizeNearestNeighbor");d(r.rank===3||r.rank===4,()=>`Error in resizeNearestNeighbor: x must be rank 3 or 4, but got rank ${r.rank}.`),d(e.length===2,()=>`Error in resizeNearestNeighbor: new shape must 2D, but got shape ${e}.`),d(r.dtype==="float32"||r.dtype==="int32",()=>"`images` must have `int32` or `float32` as dtype"),d(s===!1||n===!1,()=>"Error in resizeNearestNeighbor: If halfPixelCenters is true, alignCorners must be false.");let a=r,o=!1;r.rank===3&&(o=!0,a=$(r,[1,r.shape[0],r.shape[1],r.shape[2]]));const i={images:a},u={alignCorners:n,halfPixelCenters:s,size:e},l=b.runKernel(qi,i,u);return o?$(l,[l.shape[1],l.shape[2],l.shape[3]]):l}const Cw=y({resizeNearestNeighbor_:Fw});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Rw(t,e="binary",n=!1,s=.5){const r=f(t,"image","threshold"),a=.2989,o=.587,i=.114,u=r.shape[0]*r.shape[1];let l=_(be([s]),255),h,p,m,g;if(d(r.rank===3,()=>`Error in threshold: image must be rank 3,but got rank ${r.rank}.`),d(r.shape[2]===3||r.shape[2]===1,()=>`Error in threshold: image color channel must be equal to 3 or 1but got ${r.shape[2]}.`),d(r.dtype==="int32"||r.dtype==="float32",()=>`Error in dtype: image dtype must be int32 or float32,but got dtype ${r.dtype}.`),d(e==="otsu"||e==="binary",()=>`Method must be binary or otsu, but was ${e}`),r.shape[2]===3){[h,p,m]=Lt(r,[1,1,1],-1);const w=_(h,a),T=_(p,o),v=_(m,i);g=x(x(w,T),v)}else g=t;if(e==="otsu"){const w=fr(q(zr(g),"int32"),Ee([]),256);l=Pw(w,u)}const N=n?Hn(g,l):Nn(g,l);return q(_(N,255),"int32")}function Pw(t,e){let n=be([-1]),s=be([0]),r=be([0]),a,o,i,u,l,h;for(let p=0;p<t.size-1;p++){a=M(t,0,p+1),o=M(t,p+1),l=G(U(a),e),h=G(U(o),e);const m=U(_(a,Pt(0,a.size)));i=G(m,U(a));const g=Vt(o.shape,a.size),N=x(Pt(0,o.size),g),S=_(o,N);u=G(U(S),U(o));const w=F(i,u),T=F(i,u),v=_(l,h);r=_(_(v,w),T);const E=Nn(r,s);s=Ve(E,r,s),n=Ve(E,be([p]),n)}return n}const Bw=y({threshold_:Rw});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Lw(t,e,n="nearest",s="constant",r=0,a){const o=f(t,"image","transform","float32"),i=f(e,"transforms","transform","float32");d(o.rank===4,()=>`Error in transform: image must be rank 4,but got rank ${o.rank}.`),d(i.rank===2&&(i.shape[0]===o.shape[0]||i.shape[0]===1)&&i.shape[1]===8,()=>"Error in transform: Input transform should be batch x 8 or 1 x 8"),d(a==null||a.length===2,()=>`Error in transform: outputShape must be [height, width] or null, but got ${a}.`);const u={image:o,transforms:i},l={interpolation:n,fillMode:s,fillValue:r,outputShape:a};return b.runKernel(Au,u,l)}const zw=y({transform_:Lw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Vw(t,e,n){const s=f(t,"a","bandPart");d(s.rank>=2,()=>`bandPart(): Rank must be at least 2, got ${s.rank}.`);const r=s.shape,[a,o]=s.shape.slice(-2);let i,u;typeof e=="number"?(d(e%1===0,()=>`bandPart(): numLower must be an integer, got ${e}.`),d(e<=a,()=>`bandPart(): numLower (${e}) must not be greater than the number of rows (${a}).`),i=f(e<0?a:e,"numLower","bandPart")):(d(e.dtype==="int32",()=>"bandPart(): numLower's dtype must be an int32."),i=Ve(zn(e,0),a,on(e,a))),typeof n=="number"?(d(n%1===0,()=>`bandPart(): numUpper must be an integer, got ${n}.`),d(n<=o,()=>`bandPart(): numUpper (${n}) must not be greater than the number of columns (${o}).`),u=f(n<0?o:n,"numUpper","bandPart")):(d(n.dtype==="int32",()=>"bandPart(): numUpper's dtype must be an int32."),u=Ve(zn(n,0),o,on(n,o)));const l=$(Pt(0,a,1,"int32"),[-1,1]),h=Pt(0,o,1,"int32"),p=F(l,h),m=rn(Hn(p,i),Tr(p,ke(u))),g=bt([a,o],s.dtype);return $(Fe(st($(s,[-1,a,o])).map(N=>Ve(m,N,g))),r)}const jw=y({bandPart_:Vw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Mw(t){let e;if(Array.isArray(t)){e=!1,d(t!=null&&t.length>0,()=>"Gram-Schmidt process: input must not be null, undefined, or empty");const r=t[0].shape[0];for(let a=1;a<t.length;++a)d(t[a].shape[0]===r,()=>`Gram-Schmidt: Non-unique lengths found in the input vectors: (${t[a].shape[0]} vs. ${r})`)}else e=!0,t=Lt(t,t.shape[0],0).map(r=>es(r,[0]));d(t.length<=t[0].shape[0],()=>`Gram-Schmidt: Number of vectors (${t.length}) exceeds number of dimensions (${t[0].shape[0]}).`);const n=[],s=t;for(let r=0;r<t.length;++r)n.push(b.tidy(()=>{let a=s[r];if(r>0)for(let o=0;o<r;++o){const i=_(U(_(n[o],a)),n[o]);a=F(a,i)}return G(a,wn(a,"euclidean"))}));return e?Fe(n,0):n}const Ww=y({gramSchmidt_:Mw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Uw(t,e=!1){if(d(t.rank>=2,()=>`qr() requires input tensor to have a rank >= 2, but got rank ${t.rank}`),t.rank===2)return ga(t,e);{const n=t.shape.slice(0,t.shape.length-2).reduce((u,l)=>u*l),s=st($(t,[n,t.shape[t.shape.length-2],t.shape[t.shape.length-1]]),0),r=[],a=[];s.forEach(u=>{const[l,h]=ga(u,e);r.push(l),a.push(h)});const o=$(Fe(r,0),t.shape),i=$(Fe(a,0),t.shape);return[o,i]}}function ga(t,e=!1){return b.tidy(()=>{d(t.shape.length===2,()=>`qr2d() requires a 2D Tensor, but got a ${t.shape.length}D Tensor.`);const n=t.shape[0],s=t.shape[1];let r=wr(n),a=ze(t);const o=xt([[1]],[1,1]);let i=ze(o);const u=n>=s?s:n;for(let l=0;l<u;++l){const h=a,p=i,m=r;[i,a,r]=b.tidy(()=>{const g=M(a,[l,l],[n-l,1]),N=wn(g),S=M(a,[l,l],[1,1]),w=Ve(Nn(S,0),xt([[-1]]),xt([[1]])),T=F(S,_(w,N)),v=G(g,T);v.shape[0]===1?i=ze(o):i=se([o,M(v,[1,0],[v.shape[0]-1,v.shape[1]])],0);const E=ke(G(z(w,T),N)),k=M(a,[l,0],[n-l,s]),A=_(E,i),I=ln(i);if(l===0)a=F(k,z(A,z(I,k)));else{const D=F(k,z(A,z(I,k)));a=se([M(a,[0,0],[l,s]),D],0)}const C=ln(A),P=M(r,[0,l],[n,r.shape[1]-l]);if(l===0)r=F(P,z(z(P,i),C));else{const D=F(P,z(z(P,i),C));r=se([M(r,[0,0],[n,l]),D],1)}return[i,a,r]}),ue([h,p,m])}return!e&&n>s&&(r=M(r,[0,0],[n,s]),a=M(a,[0,0],[s,s])),[r,a]})}const Gw=y({qr_:Uw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var ie;(function(t){t[t.NONE=0]="NONE",t[t.MEAN=1]="MEAN",t[t.SUM=2]="SUM",t[t.SUM_BY_NONZERO_WEIGHTS=3]="SUM_BY_NONZERO_WEIGHTS"})(ie||(ie={}));function qw(t,e,n=ie.SUM_BY_NONZERO_WEIGHTS){const s=f(t,"losses","computeWeightedLoss");let r=null;e!=null&&(r=f(e,"weights","computeWeightedLoss"));const a=r==null?s:_(s,r);if(n===ie.NONE)return a;if(n===ie.SUM)return U(a);if(n===ie.MEAN){if(r==null)return an(a);{const o=s.size/r.size,i=G(U(a),U(r));return o>1?G(i,R(o)):i}}if(n===ie.SUM_BY_NONZERO_WEIGHTS){if(r==null)return G(U(a),R(s.size));{const o=_(r,He(s.shape)),i=q(U(Or(o,R(0))),"float32");return G(U(a),i)}}throw Error(`Unknown reduction: ${n}`)}const We=y({computeWeightedLoss_:qw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Kw(t,e,n,s=ie.SUM_BY_NONZERO_WEIGHTS){const r=f(t,"labels","absoluteDifference"),a=f(e,"predictions","absoluteDifference");let o=null;n!=null&&(o=f(n,"weights","absoluteDifference")),le(r.shape,a.shape,"Error in absoluteDifference: ");const i=de(F(r,a));return We(i,o,s)}const Hw=y({absoluteDifference_:Kw});function Xw(t,e,n,s,r=ie.SUM_BY_NONZERO_WEIGHTS){const a=f(t,"labels","cosineDistance"),o=f(e,"predictions","cosineDistance");let i=null;s!=null&&(i=f(s,"weights","cosineDistance")),le(a.shape,o.shape,"Error in cosineDistance: ");const u=R(1),l=F(u,U(_(a,o),n,!0));return We(l,i,r)}const Jw=y({cosineDistance_:Xw});function Yw(t,e,n,s=ie.SUM_BY_NONZERO_WEIGHTS){let r=f(t,"labels","hingeLoss");const a=f(e,"predictions","hingeLoss");let o=null;n!=null&&(o=f(n,"weights","hingeLoss")),le(r.shape,a.shape,"Error in hingeLoss: ");const i=R(1);r=F(_(R(2),r),i);const u=Tn(F(i,_(r,a)));return We(u,o,s)}const Zw=y({hingeLoss_:Yw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Qw(t,e,n,s=1,r=ie.SUM_BY_NONZERO_WEIGHTS){const a=f(t,"labels","huberLoss"),o=f(e,"predictions","huberLoss");let i=null;n!=null&&(i=f(n,"weights","huberLoss")),le(a.shape,o.shape,"Error in huberLoss: ");const u=R(s),l=de(F(o,a)),h=on(l,u),p=F(l,h),m=x(_(R(.5),Ne(h)),_(u,p));return We(m,i,r)}const e0=y({huberLoss_:Qw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function t0(t,e,n,s=1e-7,r=ie.SUM_BY_NONZERO_WEIGHTS){const a=f(t,"labels","logLoss"),o=f(e,"predictions","logLoss");let i=null;n!=null&&(i=f(n,"weights","logLoss")),le(a.shape,o.shape,"Error in logLoss: ");const u=R(1),l=R(s),h=ke(_(a,Rt(x(o,l)))),p=_(F(u,a),Rt(x(F(u,o),l))),m=F(h,p);return We(m,i,r)}const n0=y({logLoss_:t0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function s0(t,e,n,s=ie.SUM_BY_NONZERO_WEIGHTS){const r=f(t,"labels","meanSquaredError"),a=f(e,"predictions","meanSquaredError");let o=null;n!=null&&(o=f(n,"weights","meanSquaredError")),le(r.shape,a.shape,"Error in meanSquaredError: ");const i=jr(r,a);return We(i,o,s)}const r0=y({meanSquaredError_:s0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function a0(t,e){const n=f(t,"labels","sigmoidCrossEntropyWithLogits"),s=f(e,"logits","sigmoidCrossEntropyWithLogits");le(n.shape,s.shape,"Error in sigmoidCrossEntropyWithLogits: ");const r=Tn(s),a=_(s,n),o=Er(et(ke(de(s))));return x(F(r,a),o)}function o0(t,e,n,s=0,r=ie.SUM_BY_NONZERO_WEIGHTS){let a=f(t,"multiClassLabels","sigmoidCrossEntropy");const o=f(e,"logits","sigmoidCrossEntropy");let i=null;if(n!=null&&(i=f(n,"weights","sigmoidCrossEntropy")),le(a.shape,o.shape,"Error in sigmoidCrossEntropy: "),s>0){const l=R(s),h=R(1),p=R(.5);a=x(_(a,F(h,l)),_(p,l))}const u=a0(a,o);return We(u,i,r)}const i0=y({sigmoidCrossEntropy_:o0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function u0(t,e,n=-1){if(n===-1&&(n=e.rank-1),n!==e.rank-1)throw Error(`Softmax cross entropy along a non-last dimension is not yet supported. Labels / logits was rank ${e.rank} and dim was ${n}`);return De((r,a,o)=>{const u=_r(a,[n],!0),l=F(q(a,"float32"),u);o([r,l]);const h=ke(_(l,r));return{value:U(h,[n]),gradFunc:(g,N)=>{const[S,w]=N,T=bn(g.shape,[n]);return[_($(g,T),F(q(S,"float32"),et(w))),_($(g,T),F(et(w),q(S,"float32")))]}}})(t,e)}function l0(t,e,n,s=0,r=ie.SUM_BY_NONZERO_WEIGHTS){let a=f(t,"onehotLabels","softmaxCrossEntropy");const o=f(e,"logits","softmaxCrossEntropy");let i=null;if(n!=null&&(i=f(n,"weights","softmaxCrossEntropy")),le(a.shape,o.shape,"Error in softmaxCrossEntropy: "),s>0){const l=R(s),h=R(1),p=R(a.shape[1]);a=x(_(a,F(h,l)),G(l,p))}const u=u0(a,o);return We(u,i,r)}const c0=y({softmaxCrossEntropy_:l0});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function p0(t,e,n,s){const r=f(t,"indices","sparseFillEmptyRows","int32"),a=f(e,"values","sparseFillEmptyRows"),o=f(n,"denseShape","sparseFillEmptyRows","int32"),i=f(s,"defaultValue","sparseFillEmptyRows",a.dtype);if(r.rank!==2)throw new Error(`Indices should be Tensor2D but received shape
        ${r.shape}`);if(a.rank!==1)throw new Error(`Values should be Tensor1D but received shape ${a.shape}`);if(o.rank!==1)throw new Error(`Dense shape should be Tensor1D but received shape ${o.shape}`);if(i.rank!==0)throw new Error(`Default value should be a scalar but received shape ${i.shape}`);const u={indices:r,values:a,denseShape:o,defaultValue:i},l=b.runKernel(fu,u);return{outputIndices:l[0],outputValues:l[1],emptyRowIndicator:l[2],reverseIndexMap:l[3]}}const h0=y({sparseFillEmptyRows_:p0});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function m0(t,e,n){const s=f(t,"inputIndices","sparseReshape","int32"),r=f(e,"inputShape","sparseReshape","int32"),a=f(n,"newShape","sparseReshape","int32");if(s.rank!==2)throw new Error(`Input indices should be Tensor2D but received shape
        ${s.shape}`);if(r.rank!==1)throw new Error(`Input shape should be Tensor1D but received shape ${r.shape}`);if(a.rank!==1)throw new Error(`New shape should be Tensor1D but received shape ${a.shape}`);const o={inputIndices:s,inputShape:r,newShape:a},i=b.runKernel(du,o);return{outputIndices:i[0],outputShape:i[1]}}const f0=y({sparseReshape_:m0});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function d0(t,e,n){const s=f(t,"data","sparseSegmentMean"),r=f(e,"indices","sparseSegmentMean","int32"),a=f(n,"segmentIds","sparseSegmentMean","int32");if(s.rank<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(r.rank!==1)throw new Error(`Indices should be Tensor1D but received shape
          ${r.shape}`);if(a.rank!==1)throw new Error(`Segment ids should be Tensor1D but received shape
          ${a.shape}`);const o={data:s,indices:r,segmentIds:a};return b.runKernel(gu,o)}const g0=y({sparseSegmentMean_:d0});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function y0(t,e,n){const s=f(t,"data","sparseSegmentSum"),r=f(e,"indices","sparseSegmentSum","int32"),a=f(n,"segmentIds","sparseSegmentSum","int32");if(s.rank<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(r.rank!==1)throw new Error(`Indices should be Tensor1D but received shape
         ${r.shape}`);if(a.rank!==1)throw new Error(`Segment ids should be Tensor1D but received shape
         ${a.shape}`);const o={data:s,indices:r,segmentIds:a};return b.runKernel(yu,o)}const b0=y({sparseSegmentSum_:y0});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function w0(t,e,n,s,r,a,o,i){const u=f(t,"data","stringNGrams","string");if(u.dtype!=="string")throw new Error("Data must be of datatype string");if(u.shape.length!==1)throw new Error(`Data must be a vector, saw: ${u.shape}`);const l=f(e,"dataSplits","stringNGrams");if(l.dtype!=="int32")throw new Error("Data splits must be of datatype int32");const h={separator:n,nGramWidths:s,leftPad:r,rightPad:a,padWidth:o,preserveShortSequences:i},p={data:u,dataSplits:l},m=b.runKernel(Tu,p,h);return{nGrams:m[0],nGramsSplits:m[1]}}const N0=y({stringNGrams_:w0});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function S0(t,e,n=!0){const s=f(t,"input","stringSplit","string"),r=f(e,"delimiter","stringSplit","string");if(s.rank!==1)throw new Error(`Input should be Tensor1D but received shape ${s.shape}`);if(r.rank!==0)throw new Error(`Delimiter should be a scalar but received shape ${r.shape}`);const a={skipEmpty:n},o={input:s,delimiter:r},i=b.runKernel($u,o,a);return{indices:i[0],values:i[1],shape:i[2]}}const T0=y({stringSplit_:S0});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function $0(t,e){const n=f(t,"input","stringToHashBucketFast","string"),s={numBuckets:e};if(e<=0)throw new Error("Number of buckets must be at least 1");const r={input:n};return b.runKernel(Eu,r,s)}const E0=y({stringToHashBucketFast_:$0});/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function k0(t,e,n,s=!0){const r=f(t,"input","staticRegexReplace","string"),a={pattern:e,rewrite:n,replaceGlobal:s};return b.runKernel(Nu,{x:r},a)}const _0=y({staticRegexReplace_:k0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ap={fft:Zn,ifft:un,rfft:Qn,irfft:Vr},xp={hammingWindow:Zb,hannWindow:Ep,frame:kp,stft:nw},Op={flipLeftRight:ow,grayscaleToRGB:uw,resizeNearestNeighbor:Cw,resizeBilinear:Dw,rgbToGrayscale:cw,rotateWithOffset:hw,cropAndResize:rw,nonMaxSuppression:fw,nonMaxSuppressionAsync:Tw,nonMaxSuppressionWithScore:Ew,nonMaxSuppressionWithScoreAsync:_w,nonMaxSuppressionPadded:Iw,nonMaxSuppressionPaddedAsync:xw,threshold:Bw,transform:zw},Dp={bandPart:jw,gramSchmidt:Ww,qr:Gw},Fp={absoluteDifference:Hw,computeWeightedLoss:We,cosineDistance:Jw,hingeLoss:Zw,huberLoss:e0,logLoss:n0,meanSquaredError:r0,sigmoidCrossEntropy:i0,softmaxCrossEntropy:c0},Cp={sparseFillEmptyRows:h0,sparseReshape:f0,sparseSegmentMean:g0,sparseSegmentSum:b0},Rp={stringNGrams:N0,stringSplit:T0,stringToHashBucketFast:E0,staticRegexReplace:_0};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const v0=new Map,Fs=new Map;class Pp{getClassName(){return this.constructor.className}static fromConfig(e,n){return new e(n)}}class Ge{constructor(){this.classNameMap={}}static getMap(){return Ge.instance==null&&(Ge.instance=new Ge),Ge.instance}static register(e){Ge.getMap().classNameMap[e.className]=[e,e.fromConfig]}}function Bp(t,e,n){d(t.className!=null,()=>"Class being registered does not have the static className property defined."),d(typeof t.className=="string",()=>"className is required to be a string, but got type "+typeof t.className),d(t.className.length>0,()=>"Class being registered has an empty-string as its className, which is disallowed."),typeof e>"u"&&(e="Custom"),typeof n>"u"&&(n=t.className);const s=n,r=e+">"+s;return Ge.register(t),v0.set(r,t),Fs.set(t,r),t}function I0(t){return Fs.has(t)?Fs.get(t):t.className}const A0=Object.freeze(Object.defineProperty({__proto__:null,Serializable:Pp,SerializationMap:Ge,getRegisteredName:I0,registerClass:Bp},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class rt extends Pp{minimize(e,n=!1,s){const{value:r,grads:a}=this.computeGradients(e,s);if(s!=null){const o=s.map(i=>({name:i.name,tensor:a[i.name]}));this.applyGradients(o)}else this.applyGradients(a);return ue(a),n?r:(r.dispose(),null)}get iterations(){return this.iterations_==null&&(this.iterations_=0),this.iterations_}incrementIterations(){this.iterations_=this.iterations+1}computeGradients(e,n){return lc(e,n)}dispose(){this.iterations_!=null&&ue(this.iterations_)}async saveIterations(){return this.iterations_==null&&(this.iterations_=0),{name:"iter",tensor:R(this.iterations_,"int32")}}async getWeights(){throw new Error("getWeights() is not implemented for this optimizer yet.")}async setWeights(e){throw new Error(`setWeights() is not implemented for this optimizer class ${this.getClassName()}`)}async extractIterations(e){return this.iterations_=(await e[0].tensor.data())[0],e.slice(1)}}Object.defineProperty(rt,Symbol.hasInstance,{value:t=>t.minimize!=null&&t.computeGradients!=null&&t.applyGradients!=null});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Hr extends rt{static get className(){return"Adadelta"}constructor(e,n,s=null){super(),this.learningRate=e,this.rho=n,this.epsilon=s,this.accumulatedGrads=[],this.accumulatedUpdates=[],s==null&&(this.epsilon=b.backend.epsilon())}applyGradients(e){(Array.isArray(e)?e.map(s=>s.name):Object.keys(e)).forEach((s,r)=>{const a=b.registeredVariables[s],o=!1;this.accumulatedGrads[r]==null&&(this.accumulatedGrads[r]={originalName:`${s}/accum_grad`,variable:V(()=>ge(a).variable(o))}),this.accumulatedUpdates[r]==null&&(this.accumulatedUpdates[r]={originalName:`${s}/accum_var`,variable:V(()=>ge(a).variable(o))});const i=Array.isArray(e)?e[r].tensor:e[s];if(i==null)return;const u=this.accumulatedGrads[r].variable,l=this.accumulatedUpdates[r].variable;V(()=>{const h=x(_(u,this.rho),_(Ne(i),1-this.rho)),p=_(G(Oe(x(l,this.epsilon)),Oe(x(u,this.epsilon))),i),m=x(_(l,this.rho),_(Ne(p),1-this.rho));u.assign(h),l.assign(m);const g=x(_(p,-this.learningRate),a);a.assign(g)})}),this.incrementIterations()}dispose(){this.accumulatedUpdates!=null&&(ue(this.accumulatedGrads.map(e=>e.variable)),ue(this.accumulatedUpdates.map(e=>e.variable)))}async getWeights(){const e=[...this.accumulatedGrads,...this.accumulatedUpdates];return[await this.saveIterations()].concat(e.map(n=>({name:n.originalName,tensor:n.variable})))}async setWeights(e){e=await this.extractIterations(e);const n=e.length/2,s=!1;this.accumulatedGrads=e.slice(0,n).map(r=>({originalName:r.name,variable:r.tensor.variable(s)})),this.accumulatedUpdates=e.slice(n,n*2).map(r=>({originalName:r.name,variable:r.tensor.variable(s)}))}getConfig(){return{learningRate:this.learningRate,rho:this.rho,epsilon:this.epsilon}}static fromConfig(e,n){return new e(n.learningRate,n.rho,n.epsilon)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Xr extends rt{static get className(){return"Adagrad"}constructor(e,n=.1){super(),this.learningRate=e,this.initialAccumulatorValue=n,this.accumulatedGrads=[]}applyGradients(e){(Array.isArray(e)?e.map(s=>s.name):Object.keys(e)).forEach((s,r)=>{const a=b.registeredVariables[s];this.accumulatedGrads[r]==null&&(this.accumulatedGrads[r]={originalName:`${s}/accumulator`,variable:V(()=>Vt(a.shape,this.initialAccumulatorValue).variable(!1))});const o=Array.isArray(e)?e[r].tensor:e[s];if(o==null)return;const i=this.accumulatedGrads[r].variable;V(()=>{const u=x(i,Ne(o));i.assign(u);const l=x(_(G(o,Oe(x(u,b.backend.epsilon()))),-this.learningRate),a);a.assign(l)})}),this.incrementIterations()}dispose(){this.accumulatedGrads!=null&&ue(this.accumulatedGrads.map(e=>e.variable))}async getWeights(){return[await this.saveIterations()].concat(this.accumulatedGrads.map(e=>({name:e.originalName,tensor:e.variable})))}async setWeights(e){e=await this.extractIterations(e);const n=!1;this.accumulatedGrads=e.map(s=>({originalName:s.name,variable:s.tensor.variable(n)}))}getConfig(){return{learningRate:this.learningRate,initialAccumulatorValue:this.initialAccumulatorValue}}static fromConfig(e,n){return new e(n.learningRate,n.initialAccumulatorValue)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Jr extends rt{static get className(){return"Adam"}constructor(e,n,s,r=null){super(),this.learningRate=e,this.beta1=n,this.beta2=s,this.epsilon=r,this.accumulatedFirstMoment=[],this.accumulatedSecondMoment=[],V(()=>{this.accBeta1=R(n).variable(),this.accBeta2=R(s).variable()}),r==null&&(this.epsilon=b.backend.epsilon())}applyGradients(e){const n=Array.isArray(e)?e.map(s=>s.name):Object.keys(e);V(()=>{const s=F(1,this.accBeta1),r=F(1,this.accBeta2);n.forEach((a,o)=>{const i=b.registeredVariables[a],u=!1;this.accumulatedFirstMoment[o]==null&&(this.accumulatedFirstMoment[o]={originalName:`${a}/m`,variable:V(()=>ge(i).variable(u))}),this.accumulatedSecondMoment[o]==null&&(this.accumulatedSecondMoment[o]={originalName:`${a}/v`,variable:V(()=>ge(i).variable(u))});const l=Array.isArray(e)?e[o].tensor:e[a];if(l==null)return;const h=this.accumulatedFirstMoment[o].variable,p=this.accumulatedSecondMoment[o].variable,m=x(_(h,this.beta1),_(l,1-this.beta1)),g=x(_(p,this.beta2),_(Ne(l),1-this.beta2)),N=G(m,s),S=G(g,r);h.assign(m),p.assign(g);const w=x(_(G(N,x(Oe(S),this.epsilon)),-this.learningRate),i);i.assign(w)}),this.accBeta1.assign(_(this.accBeta1,this.beta1)),this.accBeta2.assign(_(this.accBeta2,this.beta2))}),this.incrementIterations()}dispose(){this.accBeta1.dispose(),this.accBeta2.dispose(),this.accumulatedFirstMoment!=null&&ue(this.accumulatedFirstMoment.map(e=>e.variable)),this.accumulatedSecondMoment!=null&&ue(this.accumulatedSecondMoment.map(e=>e.variable))}async getWeights(){const e=[...this.accumulatedFirstMoment,...this.accumulatedSecondMoment];return[await this.saveIterations()].concat(e.map(n=>({name:n.originalName,tensor:n.variable})))}async setWeights(e){e=await this.extractIterations(e),V(()=>{this.accBeta1.assign(Ct(this.beta1,this.iterations_+1)),this.accBeta2.assign(Ct(this.beta2,this.iterations_+1))});const n=e.length/2,s=!1;this.accumulatedFirstMoment=e.slice(0,n).map(r=>({originalName:r.name,variable:r.tensor.variable(s)})),this.accumulatedSecondMoment=e.slice(n,n*2).map(r=>({originalName:r.name,variable:r.tensor.variable(s)}))}getConfig(){return{learningRate:this.learningRate,beta1:this.beta1,beta2:this.beta2,epsilon:this.epsilon}}static fromConfig(e,n){return new e(n.learningRate,n.beta1,n.beta2,n.epsilon)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Yr extends rt{static get className(){return"Adamax"}constructor(e,n,s,r=null,a=0){super(),this.learningRate=e,this.beta1=n,this.beta2=s,this.epsilon=r,this.decay=a,this.accumulatedFirstMoment=[],this.accumulatedWeightedInfNorm=[],V(()=>{this.iteration=R(0).variable(),this.accBeta1=R(n).variable()}),r==null&&(this.epsilon=b.backend.epsilon())}applyGradients(e){const n=Array.isArray(e)?e.map(s=>s.name):Object.keys(e);V(()=>{const s=F(1,this.accBeta1),r=G(-this.learningRate,x(_(this.iteration,this.decay),1));n.forEach((a,o)=>{const i=b.registeredVariables[a],u=!1;this.accumulatedFirstMoment[o]==null&&(this.accumulatedFirstMoment[o]={originalName:`${a}/m`,variable:ge(i).variable(u)}),this.accumulatedWeightedInfNorm[o]==null&&(this.accumulatedWeightedInfNorm[o]={originalName:`${a}/v`,variable:ge(i).variable(u)});const l=Array.isArray(e)?e[o].tensor:e[a];if(l==null)return;const h=this.accumulatedFirstMoment[o].variable,p=this.accumulatedWeightedInfNorm[o].variable,m=x(_(h,this.beta1),_(l,1-this.beta1)),g=_(p,this.beta2),N=de(l),S=xr(g,N);h.assign(m),p.assign(S);const w=x(_(G(r,s),G(m,x(S,this.epsilon))),i);i.assign(w)}),this.iteration.assign(x(this.iteration,1)),this.accBeta1.assign(_(this.accBeta1,this.beta1))}),this.incrementIterations()}dispose(){this.accBeta1.dispose(),this.iteration.dispose(),this.accumulatedFirstMoment!=null&&ue(this.accumulatedFirstMoment.map(e=>e.variable)),this.accumulatedWeightedInfNorm!=null&&ue(this.accumulatedWeightedInfNorm.map(e=>e.variable))}async getWeights(){throw new Error("getWeights() is not implemented for Adamax yet.")}async setWeights(e){throw new Error("setWeights() is not implemented for Adamax yet.")}getConfig(){return{learningRate:this.learningRate,beta1:this.beta1,beta2:this.beta2,epsilon:this.epsilon,decay:this.decay}}static fromConfig(e,n){return new e(n.learningRate,n.beta1,n.beta2,n.epsilon,n.decay)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class is extends rt{static get className(){return"SGD"}constructor(e){super(),this.learningRate=e,this.setLearningRate(e)}applyGradients(e){(Array.isArray(e)?e.map(s=>s.name):Object.keys(e)).forEach((s,r)=>{const a=Array.isArray(e)?e[r].tensor:e[s];if(a==null)return;const o=b.registeredVariables[s];V(()=>{const i=x(_(this.c,a),o);o.assign(i)})}),this.incrementIterations()}setLearningRate(e){this.learningRate=e,this.c!=null&&this.c.dispose(),this.c=$e(R(-e))}dispose(){this.c.dispose()}async getWeights(){return[await this.saveIterations()]}async setWeights(e){if(e=await this.extractIterations(e),e.length!==0)throw new Error("SGD optimizer does not have settable weights.")}getConfig(){return{learningRate:this.learningRate}}static fromConfig(e,n){return new e(n.learningRate)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Zr extends is{static get className(){return"Momentum"}constructor(e,n,s=!1){super(e),this.learningRate=e,this.momentum=n,this.useNesterov=s,this.accumulations=[],this.m=R(this.momentum)}applyGradients(e){(Array.isArray(e)?e.map(s=>s.name):Object.keys(e)).forEach((s,r)=>{const a=b.registeredVariables[s];this.accumulations[r]==null&&(this.accumulations[r]={originalName:`${s}/momentum`,variable:V(()=>ge(a).variable(!1))});const o=this.accumulations[r].variable,i=Array.isArray(e)?e[r].tensor:e[s];i!=null&&V(()=>{let u;const l=x(_(this.m,o),i);this.useNesterov?u=x(_(this.c,x(i,_(l,this.m))),a):u=x(_(this.c,l),a),o.assign(l),a.assign(u)})}),this.incrementIterations()}dispose(){this.m.dispose(),this.accumulations!=null&&ue(this.accumulations.map(e=>e.variable))}setMomentum(e){this.momentum=e}async getWeights(){return[await this.saveIterations()].concat(this.accumulations.map(e=>({name:e.originalName,tensor:e.variable})))}async setWeights(e){e=await this.extractIterations(e);const n=!1;this.accumulations=e.map(s=>({originalName:s.name,variable:s.tensor.variable(n)}))}getConfig(){return{learningRate:this.learningRate,momentum:this.momentum,useNesterov:this.useNesterov}}static fromConfig(e,n){return new e(n.learningRate,n.momentum,n.useNesterov)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Qr extends rt{static get className(){return"RMSProp"}constructor(e,n=.9,s=0,r=null,a=!1){if(super(),this.learningRate=e,this.decay=n,this.momentum=s,this.epsilon=r,this.accumulatedMeanSquares=[],this.accumulatedMoments=[],this.accumulatedMeanGrads=[],this.centered=a,r==null&&(this.epsilon=b.backend.epsilon()),e==null)throw new Error("learningRate for RMSPropOptimizer must be defined.")}applyGradients(e){(Array.isArray(e)?e.map(s=>s.name):Object.keys(e)).forEach((s,r)=>{const a=b.registeredVariables[s],o=!1;this.accumulatedMeanSquares[r]==null&&(this.accumulatedMeanSquares[r]={originalName:`${s}/rms`,variable:V(()=>ge(a).variable(o))}),this.accumulatedMoments[r]==null&&(this.accumulatedMoments[r]={originalName:`${s}/momentum`,variable:V(()=>ge(a).variable(o))}),this.accumulatedMeanGrads[r]==null&&this.centered&&(this.accumulatedMeanGrads[r]={originalName:`${s}/mg`,variable:V(()=>ge(a).variable(o))});const i=Array.isArray(e)?e[r].tensor:e[s];if(i==null)return;const u=this.accumulatedMeanSquares[r].variable,l=this.accumulatedMoments[r].variable;V(()=>{const h=x(_(u,this.decay),_(Ne(i),1-this.decay));if(this.centered){const p=this.accumulatedMeanGrads[r].variable,m=x(_(p,this.decay),_(i,1-this.decay)),g=G(_(i,this.learningRate),Oe(F(h,x(Ne(m),this.epsilon)))),N=x(_(l,this.momentum),g);u.assign(h),p.assign(m),l.assign(N);const S=F(a,N);a.assign(S)}else{const p=x(_(u,this.decay),_(Ne(i),1-this.decay)),m=x(_(l,this.momentum),G(_(i,this.learningRate),Oe(x(p,this.epsilon))));u.assign(p),l.assign(m);const g=F(a,m);a.assign(g)}})}),this.incrementIterations()}dispose(){this.accumulatedMeanSquares!=null&&ue(this.accumulatedMeanSquares.map(e=>e.variable)),this.accumulatedMeanGrads!=null&&this.centered&&ue(this.accumulatedMeanGrads.map(e=>e.variable)),this.accumulatedMoments!=null&&ue(this.accumulatedMoments.map(e=>e.variable))}async getWeights(){const e=[...this.accumulatedMeanSquares,...this.accumulatedMoments];return this.centered&&e.push(...this.accumulatedMeanGrads),[await this.saveIterations()].concat(e.map(n=>({name:n.originalName,tensor:n.variable})))}async setWeights(e){e=await this.extractIterations(e);const n=this.centered?e.length/3:e.length/2,s=!1;this.accumulatedMeanSquares=e.slice(0,n).map(r=>({originalName:r.name,variable:r.tensor.variable(s)})),this.accumulatedMoments=e.slice(n,n*2).map(r=>({originalName:r.name,variable:r.tensor.variable(s)})),this.centered&&(this.accumulatedMeanGrads=e.slice(n*2,n*3).map(r=>({originalName:r.name,variable:r.tensor.variable(s)})))}getConfig(){return{learningRate:this.learningRate,decay:this.decay,momentum:this.momentum,epsilon:this.epsilon,centered:this.centered}}static fromConfig(e,n){return new e(n.learningRate,n.decay,n.momentum,n.epsilon,n.centered)}}/**
 * @license
 * Copyright 2022 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const x0=[Hr,Xr,Jr,Yr,Zr,Qr,is];function O0(){for(const t of x0)Bp(t)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const D0="model",F0=".json",C0=".weights.bin";function ya(t){return new Promise(e=>setTimeout(e)).then(t)}class wt{constructor(e){if(!O().getBool("IS_BROWSER"))throw new Error("browserDownloads() cannot proceed because the current environment is not a browser.");e.startsWith(wt.URL_SCHEME)&&(e=e.slice(wt.URL_SCHEME.length)),(e==null||e.length===0)&&(e=D0),this.modelJsonFileName=e+F0,this.weightDataFileName=e+C0}async save(e){if(typeof document>"u")throw new Error("Browser downloads are not supported in this environment since `document` is not present");const n=ve.join(e.weightData),s=window.URL.createObjectURL(new Blob([n],{type:"application/octet-stream"}));if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserDownloads.save() does not support saving model topology in binary formats yet.");{const r=[{paths:["./"+this.weightDataFileName],weights:e.weightSpecs}],a=el(e,r),o=window.URL.createObjectURL(new Blob([JSON.stringify(a)],{type:"application/json"})),i=this.modelJsonAnchor==null?document.createElement("a"):this.modelJsonAnchor;if(i.download=this.modelJsonFileName,i.href=o,await ya(()=>i.dispatchEvent(new MouseEvent("click"))),e.weightData!=null){const u=this.weightDataAnchor==null?document.createElement("a"):this.weightDataAnchor;u.download=this.weightDataFileName,u.href=s,await ya(()=>u.dispatchEvent(new MouseEvent("click")))}return{modelArtifactsInfo:fn(e)}}}}wt.URL_SCHEME="downloads://";class R0{constructor(e){if(e==null||e.length<1)throw new Error(`When calling browserFiles, at least 1 file is required, but received ${e}`);this.jsonFile=e[0],this.weightsFiles=e.slice(1)}async load(){return new Promise((e,n)=>{const s=new FileReader;s.onload=r=>{const a=JSON.parse(r.target.result),o=a.modelTopology;if(o==null){n(new Error(`modelTopology field is missing from file ${this.jsonFile.name}`));return}if(a.weightsManifest==null){n(new Error(`weightManifest field is missing from file ${this.jsonFile.name}`));return}if(this.weightsFiles.length===0){e({modelTopology:o});return}const u=ur(a,l=>this.loadWeights(l));e(u)},s.onerror=r=>n(`Failed to read model topology and weights manifest JSON from file '${this.jsonFile.name}'. BrowserFiles supports loading Keras-style tf.Model artifacts only.`),s.readAsText(this.jsonFile)})}loadWeights(e){const n=[],s=[];for(const o of e)n.push(...o.weights),s.push(...o.paths);const r=this.checkManifestAndWeightFiles(e),a=s.map(o=>this.loadWeightsFile(o,r[o]));return Promise.all(a).then(o=>[n,o])}loadWeightsFile(e,n){return new Promise((s,r)=>{const a=new FileReader;a.onload=o=>{const i=o.target.result;s(i)},a.onerror=o=>r(`Failed to weights data from file of path '${e}'.`),a.readAsArrayBuffer(n)})}checkManifestAndWeightFiles(e){const n=[],s=this.weightsFiles.map(a=>fa(a.name)),r={};for(const a of e)a.paths.forEach(o=>{const i=fa(o);if(n.indexOf(i)!==-1)throw new Error(`Duplicate file basename found in weights manifest: '${i}'`);if(n.push(i),s.indexOf(i)===-1)throw new Error(`Weight file with basename '${i}' is not provided.`);r[o]=this.weightsFiles[s.indexOf(i)]});if(n.length!==this.weightsFiles.length)throw new Error(`Mismatch in the number of files in weights manifest (${n.length}) and the number of weight files provided (${this.weightsFiles.length}).`);return r}}const P0=t=>O().getBool("IS_BROWSER")&&!Array.isArray(t)&&t.startsWith(wt.URL_SCHEME)?B0(t.slice(wt.URL_SCHEME.length)):null;K.registerSaveRouter(P0);function B0(t="model"){return new wt(t)}function L0(t){return new R0(t)}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ba(t,e,n,s){o(t),n=n??0,s=s??1,i(n,s);let r=0;const a=u=>(u.then(l=>{const h=n+ ++r/t.length*(s-n);return e(h),l}),u);function o(u){d(u!=null&&Array.isArray(u)&&u.length>0,()=>"promises must be a none empty array")}function i(u,l){d(u>=0&&u<=1,()=>`Progress fraction must be in range [0, 1], but got startFraction ${u}`),d(l>=0&&l<=1,()=>`Progress fraction must be in range [0, 1], but got endFraction ${l}`),d(l>=u,()=>`startFraction must be no more than endFraction, but got startFraction ${u} and endFraction ${l}`)}return Promise.all(t.map(a))}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function Lp(t,e){e==null&&(e={});const n=e.fetchFunc==null?O().platform.fetch:e.fetchFunc,s=t.map(p=>n(p,e.requestInit,{isBinary:!0})),i=(e.onProgress==null?await Promise.all(s):await ba(s,e.onProgress,0,.5)).map(p=>p.arrayBuffer());return e.onProgress==null?await Promise.all(i):await ba(i,e.onProgress,.5,1)}function z0(t,e){var n;const s=e.fetchFunc==null?O().platform.fetch:e.fetchFunc;let r=0,a;return(n=e.onProgress)===null||n===void 0||n.call(e,0),new ReadableStream({pull:async o=>{for(var i;r<t.length;){a||(a=(await s(t[r],e.requestInit,{isBinary:!0})).body.getReader());const{done:u,value:l}=await a.read();if(u){r++,a=void 0,(i=e.onProgress)===null||i===void 0||i.call(e,r/t.length);continue}o.enqueue(l);return}o.close()}})}async function V0(t,e="",n,s){return zp(o=>Lp(o,{requestInit:s}))(t,e,n)}function zp(t){return async(e,n="",s)=>{const r=e.map(()=>!1),a={},o=s!=null?s.map(()=>!1):[],i=[];if(e.forEach((g,N)=>{let S=0;g.weights.forEach(w=>{const T="quantization"in w?w.quantization.dtype:w.dtype,v=ft[T]*j(w.shape),E=()=>{r[N]=!0,a[N]==null&&(a[N]=[]),a[N].push({manifestEntry:w,groupOffset:S,sizeBytes:v})};s!=null?s.forEach((k,A)=>{k===w.name&&(E(),o[A]=!0)}):E(),i.push(w.name),S+=v})}),!o.every(g=>g)){const g=s.filter((N,S)=>!o[S]);throw new Error(`Could not find weights in manifest with names: ${g.join(", ")}. 
Manifest JSON has weights with names: ${i.join(", ")}.`)}const u=r.reduce((g,N,S)=>(N&&g.push(S),g),[]),l=[];u.forEach(g=>{e[g].paths.forEach(N=>{const S=n+(n.endsWith("/")?"":"/")+N;l.push(S)})});const h=await t(l),p={};let m=0;return u.forEach(g=>{const N=e[g].paths.length,S=new ve(h.slice(m,m+N));a[g].forEach(T=>{const v=S.slice(T.groupOffset,T.groupOffset+T.sizeBytes),E=Yu(v,[T.manifestEntry]);for(const k in E)p[k]=E[k]}),m+=N}),p}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const j0="application/octet-stream",M0="application/json";class ea{constructor(e,n){if(this.DEFAULT_METHOD="POST",n==null&&(n={}),this.weightPathPrefix=n.weightPathPrefix,this.weightUrlConverter=n.weightUrlConverter,n.fetchFunc!=null?(d(typeof n.fetchFunc=="function",()=>"Must pass a function that matches the signature of `fetch` (see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)"),this.fetch=n.fetchFunc):this.fetch=O().platform.fetch,d(e!=null&&e.length>0,()=>"URL path for http must not be null, undefined or empty."),Array.isArray(e)&&d(e.length===2,()=>`URL paths for http must have a length of 2, (actual length is ${e.length}).`),this.path=e,n.requestInit!=null&&n.requestInit.body!=null)throw new Error("requestInit is expected to have no pre-existing body, but has one.");this.requestInit=n.requestInit||{},this.loadOptions=n}async save(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserHTTPRequest.save() does not support saving model topology in binary formats yet.");const n=Object.assign({method:this.DEFAULT_METHOD},this.requestInit);n.body=new FormData;const s=[{paths:["./model.weights.bin"],weights:e.weightSpecs}],r=el(e,s);if(n.body.append("model.json",new Blob([JSON.stringify(r)],{type:M0}),"model.json"),e.weightData!=null){const o=ve.join(e.weightData);n.body.append("model.weights.bin",new Blob([o],{type:j0}),"model.weights.bin")}const a=await this.fetch(this.path,n);if(a.ok)return{modelArtifactsInfo:fn(e),responses:[a]};throw new Error(`BrowserHTTPRequest.save() failed due to HTTP response status ${a.status}.`)}async loadModelJSON(){const e=await this.fetch(this.path,this.requestInit);if(!e.ok)throw new Error(`Request to ${this.path} failed with status code ${e.status}. Please verify this URL points to the model JSON of the model to load.`);let n;try{n=await e.json()}catch{let o=`Failed to parse model JSON of response from ${this.path}.`;throw this.path.endsWith(".pb")?o+=" Your path contains a .pb file extension. Support for .pb models have been removed in TensorFlow.js 1.0 in favor of .json models. You can re-convert your Python TensorFlow model using the TensorFlow.js 1.0 conversion scripts or you can convert your.pb models with the 'pb2json'NPM script in the tensorflow/tfjs-converter repository.":o+=" Please make sure the server is serving valid JSON for this request.",new Error(o)}const s=n.modelTopology,r=n.weightsManifest;if(s==null&&r==null)throw new Error(`The JSON from HTTP path ${this.path} contains neither model topology or manifest for weights.`);return n}async load(){if(this.loadOptions.streamWeights)return this.loadStream();const e=await this.loadModelJSON();return ur(e,n=>this.loadWeights(n))}async loadStream(){const e=await this.loadModelJSON(),n=await this.getWeightUrls(e.weightsManifest),s=Pn(e.weightsManifest),r=()=>z0(n,this.loadOptions);return Object.assign(Object.assign({},e),{weightSpecs:s,getWeightStream:r})}async getWeightUrls(e){const n=Array.isArray(this.path)?this.path[1]:this.path,[s,r]=W0(n),a=this.weightPathPrefix||s,o=[],i=[];for(const u of e)for(const l of u.paths)this.weightUrlConverter!=null?i.push(this.weightUrlConverter(l)):o.push(a+l+r);return this.weightUrlConverter&&o.push(...await Promise.all(i)),o}async loadWeights(e){const n=await this.getWeightUrls(e),s=Pn(e),r=await Lp(n,this.loadOptions);return[s,r]}}ea.URL_SCHEME_REGEX=/^https?:\/\//;function W0(t){const e=t.lastIndexOf("/"),n=t.lastIndexOf("?"),s=t.substring(0,e),r=n>e?t.substring(n):"";return[s+"/",r]}function Cs(t){return t.match(ea.URL_SCHEME_REGEX)!=null}const Vp=(t,e)=>{if(typeof fetch>"u"&&(e==null||e.fetchFunc==null))return null;{let n=!0;if(Array.isArray(t)?n=t.every(s=>Cs(s)):n=Cs(t),n)return ta(t,e)}return null};K.registerSaveRouter(Vp);K.registerLoadRouter(Vp);function ta(t,e){return new ea(t,e)}function U0(t,e){return ta(t,e)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class hs{constructor(e){this.modelArtifacts=e}load(){return this.modelArtifacts}}class jp{constructor(e){this.saveHandler=e}save(e){return this.saveHandler(e)}}class G0{constructor(e){e.load&&(this.load=()=>Promise.resolve(e.load())),e.save&&(this.save=n=>Promise.resolve(e.save(n)))}}function q0(t,e,n,s){const r=arguments;return new G0(jn(...r))}function jn(t,e,n,s){return arguments.length===1?t.modelTopology!=null||t.weightSpecs!=null?new hs(t):(console.warn("Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release."),new hs({modelTopology:t})):(console.warn("Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release."),new hs({modelTopology:t,weightSpecs:e,weightData:n,trainingConfig:s}))}function K0(t){return new jp(t)}function H0(t){return new jp(t)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const na=Object.freeze(Object.defineProperty({__proto__:null,CompositeArrayBuffer:ve,browserFiles:L0,browserHTTPRequest:U0,concatenateArrayBuffers:rf,copyModel:vf,decodeWeights:Yu,decodeWeightsStream:Qu,encodeWeights:Zm,fromMemory:q0,fromMemorySync:jn,getLoadHandlers:mf,getModelArtifactsForJSON:ur,getModelArtifactsForJSONSync:ir,getModelArtifactsInfoForJSON:fn,getSaveHandlers:hf,getWeightSpecs:Pn,http:ta,isHTTPScheme:Cs,listModels:kf,loadWeights:V0,moveModel:If,registerLoadRouter:pf,registerSaveRouter:cf,removeModel:_f,weightsLoaderFactory:zp,withSaveHandler:K0,withSaveHandlerSync:H0},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function X0(t,e,n){const s=f(t,"labels","confusionMatrix"),r=f(e,"predictions","confusionMatrix");d(n==null||n>0&&Number.isInteger(n),()=>`If provided, numClasses must be a positive integer, but got ${n}`),d(s.rank===1,()=>`Expected the rank of labels to be 1, but got ${s.rank}`),d(r.rank===1,()=>`Expected the rank of predictions to be 1, but got ${r.rank}`),d(s.shape[0]===r.shape[0],()=>`Mismatch in the number of examples: ${s.shape[0]} vs. ${r.shape[0]}. Labels and predictions should have the same number of elements.`),d(n>0&&Number.isInteger(n),()=>`numClasses is required to be a positive integer, but got ${n}`);const a=Vn(q(s,"int32"),n),o=Vn(q(r,"int32"),n),i=ln(a),u=z(i,o);return q(u,"int32")}const J0=y({confusionMatrix_:X0});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Y0=Object.freeze(Object.defineProperty({__proto__:null,confusionMatrix:J0},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */let at,wa=!1;function Mp(t,e=3){if(e>4)throw new Error("Cannot construct Tensor with more than 4 channels from pixels.");if(t==null)throw new Error("pixels passed to tf.browser.fromPixels() can not be null");let n=!1,s=!1,r=!1,a=!1,o=!1,i=!1;if(t.data instanceof Uint8Array)n=!0;else if(typeof ImageData<"u"&&t instanceof ImageData)s=!0;else if(typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement)r=!0;else if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement)a=!0;else if(t.getContext!=null)o=!0;else if(typeof ImageBitmap<"u"&&t instanceof ImageBitmap)i=!0;else throw new Error(`pixels passed to tf.browser.fromPixels() must be either an HTMLVideoElement, HTMLImageElement, HTMLCanvasElement, ImageData in browser, or OffscreenCanvas, ImageData in webworker or {data: Uint32Array, width: number, height: number}, but was ${t.constructor.name}`);if(Yt(gs,b.backendName)!=null){const N={pixels:t},S={numChannels:e};return b.runKernel(gs,N,S)}const[l,h]=r?[t.videoWidth,t.videoHeight]:[t.width,t.height];let p;if(o)p=t.getContext("2d").getImageData(0,0,l,h).data;else if(s||n)p=t.data;else if(a||r||i){if(at==null)if(typeof document>"u")if(typeof OffscreenCanvas<"u"&&typeof OffscreenCanvasRenderingContext2D<"u")at=new OffscreenCanvas(1,1).getContext("2d");else throw new Error("Cannot parse input in current context. Reason: OffscreenCanvas Context2D rendering is not supported.");else at=document.createElement("canvas").getContext("2d",{willReadFrequently:!0});at.canvas.width=l,at.canvas.height=h,at.drawImage(t,0,0,l,h),p=at.getImageData(0,0,l,h).data}let m;if(e===4)m=new Int32Array(p);else{const N=l*h;m=new Int32Array(N*e);for(let S=0;S<N;S++)for(let w=0;w<e;++w)m[S*e+w]=p[S*4+w]}return Wr(m,[h,l,e],"int32")}function Z0(t){return t!=null&&t.data instanceof Uint8Array}function Q0(){return typeof window<"u"&&typeof ImageBitmap<"u"&&window.hasOwnProperty("createImageBitmap")}function eN(t){return t!=null&&t.width!==0&&t.height!==0}function tN(t){return Q0()&&!(t instanceof ImageBitmap)&&eN(t)&&!Z0(t)}async function nN(t,e=3){let n=null;if(O().getBool("WRAP_TO_IMAGEBITMAP")&&tN(t)){let s;try{s=await createImageBitmap(t,{premultiplyAlpha:"none"})}catch{s=null}s!=null&&s.width===t.width&&s.height===t.height?n=s:n=t}else n=t;return Mp(n,e)}function Wp(t){if(t.rank!==2&&t.rank!==3)throw new Error(`toPixels only supports rank 2 or 3 tensors, got rank ${t.rank}.`);const e=t.rank===2?1:t.shape[2];if(e>4||e===2)throw new Error(`toPixels only supports depth of size 1, 3 or 4 but got ${e}`);if(t.dtype!=="float32"&&t.dtype!=="int32")throw new Error(`Unsupported type for toPixels: ${t.dtype}. Please use float32 or int32 tensors.`)}function sN(t){const e=t?.alpha||1;if(e>1||e<0)throw new Error(`Alpha value ${e} is suppoed to be in range [0 - 1].`)}async function rN(t,e){let n=f(t,"img","toPixels");if(!(t instanceof X)){const l=n;n=q(l,"int32"),l.dispose()}Wp(n);const[s,r]=n.shape.slice(0,2),a=n.rank===2?1:n.shape[2],o=await n.data(),i=n.dtype==="float32"?255:1,u=new Uint8ClampedArray(r*s*4);for(let l=0;l<s*r;++l){const h=[0,0,0,255];for(let m=0;m<a;m++){const g=o[l*a+m];if(n.dtype==="float32"){if(g<0||g>1)throw new Error(`Tensor values for a float32 Tensor must be in the range [0 - 1] but encountered ${g}.`)}else if(n.dtype==="int32"&&(g<0||g>255))throw new Error(`Tensor values for a int32 Tensor must be in the range [0 - 255] but encountered ${g}.`);a===1?(h[0]=g*i,h[1]=g*i,h[2]=g*i):h[m]=g*i}const p=l*4;u[p+0]=Math.round(h[0]),u[p+1]=Math.round(h[1]),u[p+2]=Math.round(h[2]),u[p+3]=Math.round(h[3])}if(e!=null){wa||Yt(er,b.backendName)!=null&&(console.warn("tf.browser.toPixels is not efficient to draw tensor on canvas. Please try tf.browser.draw instead."),wa=!0),e.width=r,e.height=s;const l=e.getContext("2d"),h=new ImageData(u,r,s);l.putImageData(h,0,0)}return n!==t&&n.dispose(),u}function aN(t,e,n){let s=f(t,"img","draw");if(!(t instanceof X)){const o=s;s=q(o,"int32"),o.dispose()}Wp(s),sN(n?.imageOptions);const r={image:s},a={canvas:e,options:n};b.runKernel(er,r,a)}const oN=y({fromPixels_:Mp}),iN=Object.freeze(Object.defineProperty({__proto__:null,draw:aN,fromPixels:oN,fromPixelsAsync:nN,toPixels:rN},Symbol.toStringTag,{value:"Module"}));function Up(t,e){const n=t.shape.length,s=e.shape.length;if(n<1)throw new Error(`tf.gatherND() expects the input to be rank 1 or higher, but the rank was ${n}.`);if(s<1)throw new Error(`tf.gatherND() expects the indices to be rank 1 or higher, but the rank was ${s}.`);if(e.dtype!=="int32")throw new Error(`tf.gatherND() expects the indices to be int32 type, but the dtype was ${e.dtype}.`);if(e.shape[s-1]>n)throw new Error(`index innermost dimension length must be <= tensor rank; saw: ${e.shape[s-1]} vs. ${n}`);if(j(t.shape)===0)throw new Error(`Requested more than 0 entries, but input is empty. Input shape: ${t.shape}.`);const r=e.shape,a=r[r.length-1];let o=1;for(let p=0;p<r.length-1;++p)o*=r[p];const i=t.shape,u=r.slice();u.pop();let l=1;for(let p=a;p<n;++p)l*=i[p],u.push(i[p]);const h=[...zt(t.shape).map(p=>p/l),1].slice(0,a);return[u,o,l,h]}const uN=Object.freeze(Object.defineProperty({__proto__:null,prepareAndValidate:Up},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Rs=-2,lN=-1;function cN(t,e,n){const s=t.shape.length;d(s===e.length,()=>`Error in slice${s}D: Length of begin ${e} must match the rank of the array (${s}).`),d(s===n.length,()=>`Error in slice${s}D: Length of size ${n} must match the rank of the array (${s}).`);for(let r=0;r<s;++r)d(e[r]+n[r]<=t.shape[r],()=>`Error in slice${s}D: begin[${r}] + size[${r}] (${e[r]+n[r]}) would overflow input.shape[${r}] (${t.shape[r]})`)}function pN(t){const e=[];let n=0;for(;t>0;)t&1&&e.push(n),t/=2,n++;return e}function hN(t,e,n){const s=[];for(let r=0;r<t.length;r++)s[r]=Math.ceil((e[r]-t[r])/n[r]);return s}function Gp(t,e,n,s){const r=[...t];for(let a=r.length;a<s.length;a++)r.push(1);for(let a=0;a<n;a++)a===0?r[e]=1:(r.splice(e,0,1),r.pop());return r}function qp(t,e,n){return n<=t?n:n-(e-1)}function Kp(t,e){const n=[];for(let s=0;s<t;s++)n.push(e+s);return n}function mN(t,e,n,s,r,a,o,i,u){const l=t.length;let h=new Array(l),p=new Array(l),m=new Array(l);if(e.length&&n>0){const g=e[0],N=n+1;h=Hp(o,g,N,s,t),p=Xp(i,g,N,r,t),m=Gp(a,g,N,t)}else for(let g=0;g<l;g++)h[g]=Yp(o,s,a,t,g,u),p[g]=Zp(i,r,a,t,g,u),m[g]=Jp(a,g,u);return{begin:h,end:p,strides:m}}function Hp(t,e,n,s,r){const a=[...r],o=Kp(n,e);for(let i=0;i<a.length;i++)if(o.indexOf(i)>-1)a[i]=0;else{const u=qp(e,n,i);let l=s[u];t&1<<u&&(l=0),a[i]=l}return a}function Xp(t,e,n,s,r){const a=[...r],o=Kp(n,e);for(let i=0;i<a.length;i++)if(o.indexOf(i)>-1)a[i]=Number.MAX_SAFE_INTEGER;else{const u=qp(e,n,i);let l=s[u];t&1<<u&&(l=Number.MAX_SAFE_INTEGER),a[i]=l}for(let i=0;i<a.length;i++){const u=r[i];a[i]<0&&(a[i]+=u),a[i]=Xt(0,a[i],r[i])}return a}function Jp(t,e,n){let s=t[e];return(n&1<<e||s==null)&&(s=1),s}function Yp(t,e,n,s,r,a){let o=e[r];const i=n[r]||1;(t&1<<r||a&1<<r||o==null)&&(i>0?o=Number.MIN_SAFE_INTEGER:o=Number.MAX_SAFE_INTEGER);const u=s[r];return o<0&&(o+=u),o=Xt(0,o,u-1),o}function Zp(t,e,n,s,r,a){let o=e[r];const i=n[r]||1;(t&1<<r||a&1<<r||o==null)&&(i>0?o=Number.MAX_SAFE_INTEGER:o=Number.MIN_SAFE_INTEGER);const u=s[r];return o<0&&(o+=u),i>0?o=Xt(0,o,u):o=Xt(-1,o,u-1),o}function fN(t,e,n){let s=n.length;for(let r=0;r<n.length;r++)if(n[r]>1){s=r;break}for(let r=s+1;r<n.length;r++)if(e[r]>0||n[r]!==t[r])return!1;return!0}function dN(t,e){let n=t.length>0?t[t.length-1]:1;for(let s=0;s<t.length-1;s++)n+=t[s]*e[s];return n}function gN(t,e,n){let s;const r=t.shape.length;typeof e=="number"?s=[e,...new Array(r-1).fill(0)]:e.length<r?s=e.concat(new Array(r-e.length).fill(0)):s=e.slice(),s.forEach(o=>{d(o!==-1,()=>"slice() does not support negative begin indexing.")});let a;return n==null?a=new Array(r).fill(-1):typeof n=="number"?a=[n,...new Array(r-1).fill(-1)]:n.length<r?a=n.concat(new Array(r-n.length).fill(-1)):a=n,a=a.map((o,i)=>o>=0?o:(d(o===-1,()=>`Negative size values should be exactly -1 but got ${o} for the slice() size at index ${i}.`),t.shape[i]-s[i])),[s,a]}function yN(t,e,n,s,r,a,o,i,u){let l;if(s==null?(l=new Array(e.length),l.fill(1)):l=s,o!=null&&o&o-1)throw new Error("Multiple ellipses in slice is not allowed.");let h=!1;const p={dims:l.length,numAddAxisAfterEllipsis:0,begin:e.slice(),end:n.slice(),strides:l.slice(),beginMask:r,endMask:a,ellipsisMask:o,newAxisMask:i,shrinkAxisMask:u};for(let E=0;E<p.dims;E++)h&&1<<E&i&&p.numAddAxisAfterEllipsis++,1<<E&o&&(h=!0);h||(p.ellipsisMask|=1<<p.dims,p.dims++);const m={dims:t.length,beginMask:0,endMask:0,beginValid:!1,endValid:!1};bN(p,m);let g=!0,N=!0,S=!0;const w=[],T=[];for(let E=0;E<t.length;++E){if(m.strides[E]===0)throw Error(`strides[${E}] must be non-zero`);const k=!!(m.shrinkAxisMask&1<<E),A=t[E];if(A===-1){w.push(k?1:-1);continue}const I=[m.beginMask&1<<E,m.endMask&1<<E],C=[m.strides[E]>0?0:-1,m.strides[E]>0?A:A-1];if(k&&m.strides[E]<=0)throw Error("only stride 1 allowed on non-range indexing.");S=S&&m.strides[E]===1;const P=!!(m.beginMask&1<<E&&m.endMask&1<<E);if(m.beginValid&&m.endValid){if(k){const Y=m.begin[E]<0?A+m.begin[E]:m.begin[E];if(m.begin[E]=Y,m.end[E]=m.begin[E]+1,Y<0||Y>=A)throw Error(`slice index ${m.begin[E]} of dimension ${E} out of bounds.`)}else m.begin[E]=Na(m.begin[E],0,m.strides[E],A,I,C),m.end[E]=Na(m.end[E],1,m.strides[E],A,I,C);const B=m.strides[E]===1&&m.begin[E]===0&&m.end[E]===A;g=g&&B,N=N&&(E===0&&m.strides[E]===1||B)}else g=g&&m.strides[E]===1&&P,N=N&&(E===0&&m.strides[E]===1||P);let D,L=!1;if(m.beginValid&&m.endValid?(D=m.end[E]-m.begin[E],L=!0):k?(D=1,L=!0):P&&A>=0&&(m.strides[E]<0?D=-A:D=A,L=!0),L){let B;D===0||D<0!=m.strides[E]<0?B=0:B=Math.trunc(D/m.strides[E])+(D%m.strides[E]!==0?1:0),w.push(B)}else w.push(-1)}for(let E=0;E<m.finalShapeGatherIndices.length;++E){const k=m.finalShapeGatherIndices[E];k>=0?T.push(w[k]):k===Rs&&T.push(1)}return{finalShapeSparse:T.filter((E,k)=>m.finalShapeGatherIndices[k]!==Rs),finalShape:T,isIdentity:g,sliceDim0:N,isSimpleSlice:S,begin:m.begin,end:m.end,strides:m.strides}}function bN(t,e){e.beginMask=0,e.endMask=0,e.shrinkAxisMask=0;let n=0;e.beginValid=t.begin!=null,e.endValid=t.end!=null,e.begin=new Array(e.dims),e.end=new Array(e.dims),e.strides=new Array(e.dims),e.finalShapeGatherIndices=[],e.finalShapeGatherIndicesSparse=[],e.inputShapeGatherIndicesSparse=new Array(e.dims);for(let s=0;s<t.dims;s++)if(1<<s&t.ellipsisMask){const r=Math.min(e.dims-(t.dims-s)+1+t.numAddAxisAfterEllipsis,e.dims);for(;n<r;n++)e.begin[n]=0,e.end[n]=0,e.strides[n]=1,e.beginMask|=1<<n,e.endMask|=1<<n,e.finalShapeGatherIndices.push(n),e.finalShapeGatherIndicesSparse.push(-1),e.inputShapeGatherIndicesSparse[n]=s}else if(1<<s&t.newAxisMask)e.finalShapeGatherIndices.push(Rs),e.finalShapeGatherIndicesSparse.push(-1);else{if(n===e.begin.length)throw Error(`Index out of range using input dim ${n}; input has only ${e.dims} dims, ${e.begin.length}.`);t.begin!=null&&(e.begin[n]=t.begin[s]),t.end!=null&&(e.end[n]=t.end[s]),e.strides[n]=t.strides[s],t.beginMask&1<<s&&(e.beginMask|=1<<n),t.endMask&1<<s&&(e.endMask|=1<<n),t.shrinkAxisMask&1<<s?(e.finalShapeGatherIndices.push(lN),e.finalShapeGatherIndicesSparse.push(-1),e.shrinkAxisMask|=1<<n):(e.finalShapeGatherIndices.push(n),e.finalShapeGatherIndicesSparse.push(s)),e.inputShapeGatherIndicesSparse[n]=s,n++}}function Na(t,e,n,s,r,a){if(r[e])return n>0?a[e]:a[e+1&1];{const o=t<0?s+t:t;return o<a[0]?a[0]:o>a[1]?a[1]:o}}const Qp=Object.freeze(Object.defineProperty({__proto__:null,assertParamsValid:cN,computeFlatOffset:dN,computeOutShape:hN,getNormalizedAxes:mN,isSliceContinous:fN,maskToAxes:pN,parseSliceParams:gN,sliceInfo:yN,startForAxis:Yp,startIndicesWithElidedDims:Hp,stopForAxis:Zp,stopIndicesWithElidedDims:Xp,stridesForAxis:Jp,stridesWithElidedDims:Gp},Symbol.toStringTag,{value:"Module"}));/** @license See the LICENSE file. */const wN="4.22.0";/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class eh{static sgd(e){return new is(e)}static momentum(e,n,s=!1){return new Zr(e,n,s)}static rmsprop(e,n=.9,s=0,r=null,a=!1){return new Qr(e,n,s,r,a)}static adam(e=.001,n=.9,s=.999,r=null){return new Jr(e,n,s,r)}static adadelta(e=.001,n=.95,s=null){return new Hr(e,n,s)}static adamax(e=.002,n=.9,s=.999,r=null,a=0){return new Yr(e,n,s,r,a)}static adagrad(e,n=.1){return new Xr(e,n)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const NN=eh;/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const SN=typeof requestAnimationFrame<"u"?requestAnimationFrame:typeof setImmediate<"u"?setImmediate:t=>t();function TN(){return new Promise(t=>SN(()=>t()))}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function $N(t,e){const n=t[0].length;t.forEach((r,a)=>{d(r.length===n,()=>`Error in concat${n}D: rank of tensors[${a}] must be the same as the rank of the rest (${n})`)}),d(e>=0&&e<n,()=>`Error in concat${n}D: axis must be between 0 and ${n-1}.`);const s=t[0];t.forEach((r,a)=>{for(let o=0;o<n;o++)d(o===e||r[o]===s[o],()=>`Error in concat${n}D: Shape of tensors[${a}] (${r}) does not match the shape of the rest (${s}) along the non-concatenated axis ${a}.`)})}function EN(t,e){const n=t[0].slice();for(let s=1;s<t.length;s++)n[e]+=t[s][e];return n}/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var Ie;(function(t){t[t.FIRST_DIM_SIZE=0]="FIRST_DIM_SIZE",t[t.VALUE_ROWIDS=1]="VALUE_ROWIDS",t[t.ROW_LENGTHS=2]="ROW_LENGTHS",t[t.ROW_SPLITS=3]="ROW_SPLITS",t[t.ROW_LIMITS=4]="ROW_LIMITS",t[t.ROW_STARTS=5]="ROW_STARTS"})(Ie||(Ie={}));function kN(t,e,n){let s=new Array;if(n==null&&e==null)return s;if(e==null)for(;s.length<t+n.length;)s.push(-1);else s=e.slice();if(n==null)return s;if(t+n.length!==s.length)throw new Error(`rt input.shape and shape=${e} are incompatible: rt input.rank = ${t+n.length}, but shape.rank = ${s.length}`);for(let r=1;r<n.length;++r){const a=n[r],o=s[s.length-n.length+r],i=s[o];if(a>=0)if(i>=0){if(i!==a)throw new Error(`rt input.shape and shape=${e} are incompatible: rt input.shape[${r+t}] = ${a} but shape[${r+t}] = ${i}`)}else s[o]=a}return s}function _N(t){const e={FIRST_DIM_SIZE:Ie.FIRST_DIM_SIZE,VALUE_ROWIDS:Ie.VALUE_ROWIDS,ROW_LENGTHS:Ie.ROW_LENGTHS,ROW_SPLITS:Ie.ROW_SPLITS,ROW_LIMITS:Ie.ROW_LIMITS,ROW_STARTS:Ie.ROW_STARTS},n=[];for(const s of t)if(s in e)n.push(e[s]);else break;return n}function vN(t){return t.length===0?0:t[0]===Ie.FIRST_DIM_SIZE?t.length-1:t.length}function IN(t,e){if(t==null||e==null)return;const n=t.length,s=e.length;if(n>=s)throw new Error(`defaultValue.shape=${t} and ragged tensor flatValues.shape=${e}, are incompatible: defaultValue.rank = ${n} must be less than ragged tensor input flatValues.rank = ${s})`);for(let r=0;r<Math.min(n,s-1);++r){const a=t[r],o=e[r+1];if(a>=0&&o>=0&&a!==1&&a!==o)throw new Error(`defaultValue.shape=${t}, and ragged tensor input flatValues.shape=${e} are incompatible: defaultValue.shape[${r-t.length}] = ${a} but ragged tensor input.flatValues.shape[${r-t.length}] = ${o}`)}}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const sa=30;function AN(t){return t<=sa?t:Dn(t,Math.floor(Math.sqrt(t)))}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function xN(t,e,n){const s=n*(typeof t=="number"?t:t[0]),r=e*(typeof t=="number"?t:t[1]);return[s,r]}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ON(t,e,n,s=!0){let r=[];if(s)r=r.concat(e.slice(0)),r.push(t[0]/n),r=r.concat(t.slice(1));else{r=r.concat(t[0]);const a=e.length;for(let o=0;o<a;++o)r=r.concat([t[o+1]/e[o],e[o]]);r=r.concat(t.slice(a+1))}return r}function DN(t,e,n=!0){const s=[];if(n){s.push(e);for(let r=e+1;r<t;++r)r<=2*e?(s.push(r),s.push(r-(e+1))):s.push(r)}else{const r=[],a=[];for(let o=1;o<t;++o)o>=e*2+1||o%2===1?a.push(o):r.push(o);s.push(...r),s.push(0),s.push(...a)}return s}function FN(t,e,n,s=!0){const r=[];s?r.push(t[0]/n):r.push(t[0]*n);for(let a=1;a<t.length;++a)a<=e.length?s?r.push(e[a-1]*t[a]):r.push(t[a]/e[a-1]):r.push(t[a]);return r}function CN(t,e){const n=[0];for(let s=0;s<e;++s)n.push(t[s][0]);return n}function RN(t,e,n){const s=t.slice(0,1);for(let r=0;r<n;++r)s.push(t[r+1]-e[r][0]-e[r][1]);return s}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const PN=1.7580993408473768,BN=1.0507009873554805;/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const LN=.3275911,zN=.254829592,VN=-.284496736,jN=1.421413741,MN=-1.453152027,WN=1.061405429;/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function UN(t,e){if(t.length!==e.length)throw new Error(`Cannot merge real and imag arrays of different lengths. real:${t.length}, imag: ${e.length}.`);const n=new Float32Array(t.length*2);for(let s=0;s<n.length;s+=2)n[s]=t[s/2],n[s+1]=e[s/2];return n}function GN(t){const e=new Float32Array(t.length/2),n=new Float32Array(t.length/2);for(let s=0;s<t.length;s+=2)e[s/2]=t[s],n[s/2]=t[s+1];return{real:e,imag:n}}function qN(t){const e=Math.ceil(t.length/4),n=new Float32Array(e),s=new Float32Array(e);for(let r=0;r<t.length;r+=4)n[Math.floor(r/4)]=t[r],s[Math.floor(r/4)]=t[r+1];return{real:n,imag:s}}function KN(t){const e=Math.floor(t.length/4),n=new Float32Array(e),s=new Float32Array(e);for(let r=2;r<t.length;r+=4)n[Math.floor(r/4)]=t[r],s[Math.floor(r/4)]=t[r+1];return{real:n,imag:s}}function HN(t,e){const n=t[e*2],s=t[e*2+1];return{real:n,imag:s}}function XN(t,e,n,s){t[s*2]=e,t[s*2+1]=n}function JN(t,e){const n=new Float32Array(t/2),s=new Float32Array(t/2);for(let r=0;r<Math.ceil(t/2);r++){const a=(e?2:-2)*Math.PI*(r/t);n[r]=Math.cos(a),s[r]=Math.sin(a)}return{real:n,imag:s}}function YN(t,e,n){const s=(n?2:-2)*Math.PI*(t/e),r=Math.cos(s),a=Math.sin(s);return{real:r,imag:a}}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ms="->",ZN=/->/g,Sa=",",Ta="...";function QN(t,e){t=t.replace(/\s/g,"");const n=(t.length-t.replace(ZN,"").length)/ms.length;if(n<1)throw new Error("Equations without an arrow are not supported.");if(n>1)throw new Error(`Equation must contain exactly one arrow ("${ms}").`);const[s,r]=t.split(ms);d(s.indexOf(Ta)===-1,()=>`The ellipsis notation ("${Ta}") is not supported yet.`);const a=s.split(Sa),o=a.length;if(e!==o)throw new Error(`Expected ${o} input tensors, received ${e}`);if(o>2)throw new Error("Support for more than 2 input tensors is not implemented yet.");const i=[];for(let m=0;m<r.length;++m){const g=r[m];if(!a.some(N=>N.indexOf(g)!==-1))throw new Error(`Output subscripts contain the label ${g} not present in the input subscripts.`);i.indexOf(g)===-1&&i.push(g)}for(let m=0;m<s.length;++m){const g=s[m];i.indexOf(g)===-1&&g!==Sa&&i.push(g)}const u=new Array(a.length);for(let m=0;m<o;++m){if(new Set(a[m].split("")).size!==a[m].length)throw new Error(`Found duplicate axes in input component ${a[m]}. Support for duplicate axes in input is not implemented yet.`);u[m]=[];for(let g=0;g<a[m].length;++g)u[m].push(i.indexOf(a[m][g]))}const l=i.length,h=r.length,p=[];for(let m=h;m<l;++m)p.push(m);return{allDims:i,summedDims:p,idDims:u}}function e1(t,e){let n=new Array(t);n.fill(-1);for(let r=0;r<e.length;++r)n[e[r]]=r;const s=[];for(let r=0;r<t;++r)n[r]===-1&&s.push(r);return n=n.filter(r=>r!==-1),{permutationIndices:n,expandDims:s}}function t1(t,e,n){const s=new Array(t);for(let r=0;r<n.length;++r){const a=n[r].shape;for(let o=0;o<e[r].length;++o)s[e[r][o]]===void 0?s[e[r][o]]=a[o]:d(s[e[r][o]]===a[o],()=>`Expected dimension ${s[e[r][o]]} at axis ${o} of input shaped ${JSON.stringify(a)}, but got dimension ${a[o]}`)}}function n1(t,e){const n=t,s=[];let r=0;t.length===0&&n.push(-1),r=t.length+1;for(let o=0;o<r;++o)s.push([]);const a=[];for(let o=0;o<n.length;++o){const i=n[o],u=r1(e,i);for(const l of u)a.indexOf(l)===-1&&(s[o].push(l),a.push(l))}return{path:n,steps:s}}function s1(t){return t.every((e,n)=>e===n)}function r1(t,e){const n=[];for(let s=0;s<t.length;++s)(t[s].length===0||t[s].indexOf(e)!==-1||e===-1)&&n.push(s);return n}function a1(t,e,n=0){let s=[];if(typeof e=="number")d(t.shape[n]%e===0,()=>"Number of splits must evenly divide the axis."),s=new Array(e).fill(t.shape[n]/e);else{const r=e.reduce((o,i)=>(i===-1&&(o+=1),o),0);d(r<=1,()=>"There should be only one negative value in split array.");const a=e.indexOf(-1);if(a!==-1){const o=e.reduce((i,u)=>u>0?i+u:i);e[a]=t.shape[n]-o}d(t.shape[n]===e.reduce((o,i)=>o+i),()=>"The sum of sizes must match the size of the axis dimension."),s=e}return s}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function o1(t){return`Received SparseTensor with denseShape[0] = 0 but
  indices.shape[0] = ${t}`}function i1(t,e){return`indices(${t}, 0) is invalid: ${e} < 0`}function u1(t,e,n){return`indices(${t}, 0) is invalid: ${e} >= ${n}`}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function l1(t,e){return`only one output dimension may be -1, not both ${t} and ${e}`}function c1(t,e){return`size ${t} must be non-negative, not ${e}`}function p1(){return"reshape cannot infer the missing input size for an empty tensor unless all specified input sizes are non-zero"}function h1(t,e){const n=j(t),s=j(e);return`Input to reshape is a SparseTensor with ${n}
  dense values, but the requested shape requires a multiple of ${s}. inputShape=${t} outputShape= ${e}`}function m1(t,e){const n=j(t),s=j(e);return`Input to reshape is a tensor with ${n} dense values, but the requested shape has ${s}. inputShape=${t} outputShape=${e}`}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function f1(){return"segment ids must be >= 0"}function d1(){return"segment ids are not increasing"}function g1(t,e){return`Segment id ${t} out of range [0, ${e}), possibly because segmentIds input is not sorted.`}function y1(t,e,n){return`Bad: indices[${t}] == ${e} out of range [0, ${n})`}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function b1(t,e){let n=!1,s;for(t<=sa?(s=t,n=!0):s=Dn(t,Math.floor(Math.sqrt(t)));!n;)s>e||s===t?n=!0:s=Dn(t,s+1);return s}function w1(t,e,n){const s=[],r=t.length;for(let a=0;a<r;a++)a!==e?s.push(t[a]):s.push(n);return s}function N1(t,e,n,s){const r=e.shape.length,a=t.shape.length;if(s!==0&&(s<-r||s>r))throw new Error(`Expect batchDims in the range of [-${r}, ${r}], but got ${s}`);if(s<0&&(s+=r),s>a)throw new Error(`batchDims (${s}) must be less than rank(x) (
    ${a}).`);if(n<s)throw new Error(`batchDims (${s}) must be less than or equal to axis (${n}).`);for(let p=0;p<s;++p)if(t.shape[p]!==e.shape[p])throw new Error(`x.shape[${p}]: ${t.shape[p]} should be equal to indices.shape[${p}]: ${e.shape[p]}.`);const o=t.shape[n],i=[];let u=1,l=1,h=1;for(let p=0;p<s;++p)i.push(t.shape[p]),u*=t.shape[p];for(let p=s;p<n;p++)i.push(t.shape[p]),l*=t.shape[p];for(let p=s;p<r;p++)i.push(e.shape[p]);for(let p=n+1;p<a;p++)i.push(t.shape[p]),h*=t.shape[p];return{batchSize:u,sliceSize:h,outerSize:l,dimSize:o,outputShape:i}}const S1=Object.freeze(Object.defineProperty({__proto__:null,collectGatherOpShapeInfo:N1,computeOutShape:w1,segOpComputeOptimalWindowSize:b1},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function T1(t){try{return t.map(e=>Cn(e))}catch(e){throw new Error(`Failed to decode encoded string bytes into utf-8, error: ${e}`)}}function $1(t){return t.map(e=>mn(e))}const E1=Object.freeze(Object.defineProperty({__proto__:null,ERF_A1:zN,ERF_A2:VN,ERF_A3:jN,ERF_A4:MN,ERF_A5:WN,ERF_P:LN,PARALLELIZE_THRESHOLD:sa,get RowPartitionType(){return Ie},SELU_SCALE:BN,SELU_SCALEALPHA:PN,applyActivation:as,assertAndGetBroadcastShape:J,assertAxesAreInnerMostDims:sg,assertParamsConsistent:$N,assignToTypedArray:XN,axesAreInnerMostDims:br,calculateShapes:ip,checkEinsumDimSizes:t1,checkPadOnDimRoundingMode:Se,combineLocations:ec,combineRaggedTensorToTensorShapes:kN,complexWithEvenIndex:qN,complexWithOddIndex:KN,computeConv2DInfo:dn,computeConv3DInfo:Sl,computeDefaultPad:pr,computeDilation2DInfo:Zf,computeOptimalWindowSize:AN,computeOutAndReduceShapes:ng,computeOutShape:EN,computePool2DInfo:Nl,computePool3DInfo:Qf,convertConv2DDataFormat:Tl,decodeEinsumEquation:QN,eitherStridesOrDilationsAreOne:Me,expandShapeToKeepDim:bn,exponent:YN,exponents:JN,fromStringArrayToUint8:$1,fromUint8ToStringArray:T1,getAxesPermutation:rg,getBroadcastDims:Xl,getComplexWithIndex:HN,getEinsumComputePath:n1,getEinsumPermutation:e1,getFusedBiasGradient:rs,getFusedDyActivation:ss,getImageCenter:xN,getInnerMostAxes:og,getPermuted:DN,getRaggedRank:vN,getReductionAxes:dr,getReshaped:ON,getReshapedPermuted:FN,getRowPartitionTypesHelper:_N,getSliceBeginCoords:CN,getSliceSize:RN,getSparseFillEmptyRowsIndicesDenseShapeMismatch:o1,getSparseFillEmptyRowsNegativeIndexErrorMessage:i1,getSparseFillEmptyRowsOutOfRangeIndexErrorMessage:u1,getSparseReshapeEmptyTensorZeroOutputDimErrorMessage:p1,getSparseReshapeInputOutputMismatchErrorMessage:m1,getSparseReshapeInputOutputMultipleErrorMessage:h1,getSparseReshapeMultipleNegativeOneOutputDimErrorMessage:l1,getSparseReshapeNegativeOutputDimErrorMessage:c1,getSparseSegmentReductionIndicesOutOfRangeErrorMessage:y1,getSparseSegmentReductionNegativeSegmentIdsErrorMessage:f1,getSparseSegmentReductionNonIncreasingSegmentIdsErrorMessage:d1,getSparseSegmentReductionSegmentIdOutOfRangeErrorMessage:g1,getUndoAxesPermutation:ag,isIdentityPermutation:s1,log:em,mergeRealAndImagArrays:UN,prepareAndValidate:Up,prepareSplitSize:a1,segment_util:S1,shouldFuse:os,slice_util:Qp,splitRealAndImagArrays:GN,stridesOrDilationsArePositive:yt,tupleValuesAreOne:sn,upcastType:qn,validateDefaultValueShape:IN,validateInput:ts,validateUpdateShape:Ur,warn:Ue},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const k1=Object.freeze(Object.defineProperty({__proto__:null,nonMaxSuppressionV3Impl:_p,nonMaxSuppressionV4Impl:vp,nonMaxSuppressionV5Impl:Ip,whereImpl:dp},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */O0();const _1=Object.freeze(Object.defineProperty({__proto__:null,Abs:qa,Acos:Ka,Acosh:Ha,AdadeltaOptimizer:Hr,AdagradOptimizer:Xr,AdamOptimizer:Jr,AdamaxOptimizer:Yr,Add:Zs,AddN:Xa,All:Ja,Any:Ya,ArgMax:Za,ArgMin:Qa,Asin:eo,Asinh:to,Atan:no,Atan2:ro,Atanh:so,AvgPool:ao,AvgPool3D:oo,AvgPool3DGrad:Ph,AvgPoolGrad:Rh,BatchMatMul:io,BatchToSpaceND:uo,Bincount:lo,BitwiseAnd:co,BroadcastArgs:po,BroadcastTo:Bh,Cast:Qs,Ceil:ho,ClipByValue:mo,Complex:fo,ComplexAbs:go,Concat:yo,Conv2D:bo,Conv2DBackpropFilter:wo,Conv2DBackpropInput:No,Conv3D:So,Conv3DBackpropFilterV2:Lh,Conv3DBackpropInputV2:To,Cos:$o,Cosh:Eo,CropAndResize:vo,Cumprod:ko,Cumsum:_o,DataStorage:mh,DenseBincount:Io,DepthToSpace:Ao,DepthwiseConv2dNative:xo,DepthwiseConv2dNativeBackpropFilter:Oo,DepthwiseConv2dNativeBackpropInput:Do,Diag:Fo,Dilation2D:Co,Dilation2DBackpropFilter:Vh,Dilation2DBackpropInput:zh,Draw:er,get ENV(){return Js},Einsum:Po,Elu:Bo,EluGrad:jh,Environment:Ua,Equal:zo,Erf:Lo,Exp:Vo,ExpandDims:jo,Expm1:Mo,FFT:Wo,Fill:Uo,FlipLeftRight:Go,Floor:qo,FloorDiv:Ko,FromPixels:gs,FusedBatchNorm:Ho,FusedConv2D:bs,FusedDepthwiseConv2D:ws,GatherNd:Jo,GatherV2:Xo,Greater:Yo,GreaterEqual:Zo,IFFT:Qo,Identity:tr,Imag:ei,IsFinite:ti,IsInf:ni,IsNan:si,KernelBackend:Fa,LRN:mi,LRNGrad:Gh,LeakyRelu:ri,Less:ai,LessEqual:oi,LinSpace:ii,Log:ui,Log1p:li,LogSoftmax:Wh,LogicalAnd:ci,LogicalNot:pi,LogicalOr:hi,LogicalXor:Mh,LowerBound:Uh,MatrixBandPart:qh,Max:fi,MaxPool:gi,MaxPool3D:yi,MaxPool3DGrad:Hh,MaxPoolGrad:Kh,MaxPoolWithArgmax:bi,Maximum:di,Mean:wi,Min:Ni,Minimum:Si,MirrorPad:Ti,Mod:$i,MomentumOptimizer:Zr,Multinomial:Ei,Multiply:ki,Neg:_i,NonMaxSuppressionV3:Ii,NonMaxSuppressionV4:Ai,NonMaxSuppressionV5:xi,NotEqual:vi,OP_SCOPE_SUFFIX:ar,OneHot:Di,OnesLike:Oi,Optimizer:rt,OptimizerConstructors:eh,Pack:Fi,PadV2:Ci,Pool:Xh,Pow:Ri,Prelu:Pi,Prod:Bi,RMSPropOptimizer:Qr,RaggedGather:Li,RaggedRange:zi,RaggedTensorToTensor:Vi,Range:ji,get Rank(){return Ts},Real:Mi,RealDiv:Ro,Reciprocal:Wi,get Reduction(){return ie},Relu:Ui,Relu6:Hi,Reshape:Gi,ResizeBilinear:Ki,ResizeBilinearGrad:Yh,ResizeNearestNeighbor:qi,ResizeNearestNeighborGrad:Jh,Reverse:Xi,RotateWithOffset:Ru,Round:Ji,Rsqrt:Yi,SGDOptimizer:is,ScatterNd:Zi,SearchSorted:eu,Select:tu,Selu:nu,Sigmoid:iu,Sign:ou,Sin:ru,Sinh:au,Slice:su,Softmax:mu,Softplus:uu,SpaceToBatchND:pu,SparseFillEmptyRows:fu,SparseReshape:du,SparseSegmentMean:gu,SparseSegmentSum:yu,SparseToDense:bu,SplitV:hu,Sqrt:lu,Square:Zh,SquaredDifference:wu,StaticRegexReplace:Nu,Step:Cu,StridedSlice:Su,StringNGrams:Tu,StringSplit:$u,StringToHashBucketFast:Eu,Sub:ku,Sum:cu,Tan:_u,Tanh:vu,Tensor:X,TensorBuffer:Rn,TensorScatterUpdate:Qi,Tile:nr,TopK:Iu,Transform:Au,Transpose:_n,Unique:xu,Unpack:Ou,UnsortedSegmentSum:Du,UpperBound:Qh,Variable:Qt,ZerosLike:Fu,_FusedMatMul:ys,abs:de,acos:ul,acosh:ll,add:x,addN:cl,all:pl,any:hl,argMax:ml,argMin:fl,asin:dl,asinh:gl,atan:yl,atan2:bl,atanh:wl,avgPool:hr,avgPool3d:$l,backend:Ju,backend_util:E1,basicLSTMCell:El,batchNorm:gn,batchNorm2d:kl,batchNorm3d:_l,batchNorm4d:vl,batchToSpaceND:mr,bincount:fr,bitwiseAnd:Il,booleanMaskAsync:gp,broadcastArgs:Al,broadcastTo:Ht,broadcast_util:qd,browser:iN,buffer:xe,cast:q,ceil:xl,clipByValue:Ol,clone:ze,complex:je,concat:se,concat1d:Dl,concat2d:Fl,concat3d:Cl,concat4d:Rl,conv1d:Pl,conv2d:yn,conv2dTranspose:Ll,conv3d:zl,conv3dTranspose:Vl,copyRegisteredKernels:rm,cos:jl,cosh:Ml,cosineWindow:ns,cumprod:Wl,cumsum:Ul,customGrad:De,denseBincount:Gl,deprecationWarn:zm,depthToSpace:ql,depthwiseConv2d:Kn,device_util:Fm,diag:Kl,dilation2d:Hl,disableDeprecationWarnings:Lm,dispose:ue,disposeVariables:Vm,div:G,divNoNan:Jl,dot:Yl,dropout:Sp,einsum:ut,elu:yr,enableDebugMode:Bm,enableProdMode:Pm,enclosingPowerOfTwo:qr,engine:jm,ensureShape:Zl,env:O,equal:gr,erf:Ql,euclideanNorm:nc,exp:et,expandDims:Re,expm1:sc,eye:wr,fft:Zn,fill:Vt,findBackend:Hm,findBackendFactory:Xm,floor:Nr,floorDiv:cr,fused:$p,gather:Sr,gatherND:Np,gather_util:uN,getBackend:Xu,getGradient:Ns,getKernel:Yt,getKernelsForBackend:Fn,grad:Cg,grads:Rg,greater:Nn,greaterEqual:Tr,ifft:un,imag:Sn,image:Op,inTopKAsync:Tp,io:na,irfft:Vr,isFinite:rc,isInf:ac,isNaN:oc,keep:$e,kernel_impls:k1,leakyRelu:$r,less:zn,lessEqual:Hn,linalg:Dp,linspace:ic,localResponseNormalization:uc,log:Rt,log1p:Er,logSigmoid:cc,logSoftmax:pc,logSumExp:_r,logicalAnd:rn,logicalNot:vr,logicalOr:Ir,logicalXor:hc,losses:Fp,lowerBound:mc,matMul:z,math:Y0,max:mt,maxPool:Ar,maxPool3d:fc,maxPoolWithArgmax:dc,maximum:xr,mean:an,memory:Mm,meshgrid:gc,min:Ln,minimum:on,mirrorPad:yc,mod:bc,moments:wc,movingAverage:yp,mul:_,multiRNNCell:Nc,multinomial:Sc,neg:ke,nextFrame:TN,norm:wn,notEqual:Or,oneHot:Vn,ones:He,onesLike:Tc,op:y,outerProduct:$c,pad:jt,pad1d:Ec,pad2d:kc,pad3d:_c,pad4d:vc,pool:Ic,pow:Ct,prelu:Fr,print:lr,prod:Ac,profile:Wm,raggedGather:xc,raggedRange:Oc,raggedTensorToTensor:Dc,rand:Fc,randomGamma:Pc,randomNormal:Br,randomStandardNormal:Bc,randomUniform:Yn,randomUniformInt:Lc,range:Pt,ready:qm,real:Bt,reciprocal:zc,registerBackend:Jm,registerGradient:tm,registerKernel:Pu,relu:Tn,relu6:Lr,removeBackend:Km,reshape:$,reverse:tt,reverse1d:Vc,reverse2d:jc,reverse3d:Mc,reverse4d:Wc,rfft:Qn,round:zr,rsqrt:Uc,scalar:R,scatterND:bp,scatter_util:Sb,searchSorted:Jn,selu:Gc,separableConv2d:qc,serialization:A0,setBackend:Gm,setPlatform:Ym,setdiff1dAsync:Kc,sigmoid:ht,sign:Hc,signal:xp,sin:Xc,sinh:Jc,slice:M,slice1d:Yc,slice2d:Zc,slice3d:Qc,slice4d:ep,slice_util:Qp,softmax:tp,softplus:kr,spaceToBatchND:Dr,sparse:Cp,sparseToDense:wp,spectral:Ap,split:Lt,sqrt:Oe,square:Ne,squaredDifference:jr,squeeze:es,stack:Fe,step:Mr,stridedSlice:np,string:Rp,sub:F,sum:U,sumOutType:Em,tan:sp,tanh:Bn,tensor:Ee,tensor1d:be,tensor2d:xt,tensor3d:Wr,tensor4d:rp,tensor5d:ap,tensor6d:op,tensorScatterUpdate:up,tensor_util:vm,test_util:Cy,tidy:V,tile:At,time:Um,topk:lp,train:NN,transpose:ln,truncatedNormal:cp,unique:pp,unregisterGradient:sm,unregisterKernel:nm,unsortedSegmentSum:hp,unstack:st,upcastType:qn,upperBound:mp,util:mm,valueAndGrad:Pg,valueAndGrads:Bg,variable:fp,variableGrads:lc,version_core:wN,where:Ve,whereAsync:Gr,zeros:bt,zerosLike:ge},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const v1=O();v1.registerFlag("KEEP_INTERMEDIATE_TENSORS",()=>!1,t=>{t&&console.warn("Keep intermediate tensors is ON. This will print the values of all intermediate tensors during model inference. Not all models support this mode. For details, check e2e/benchmarks/ model_config.js. This significantly impacts performance.")});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * =============================================================================
 */var me;(function(t){t[t.DT_INVALID=0]="DT_INVALID",t[t.DT_FLOAT=1]="DT_FLOAT",t[t.DT_DOUBLE=2]="DT_DOUBLE",t[t.DT_INT32=3]="DT_INT32",t[t.DT_UINT8=4]="DT_UINT8",t[t.DT_INT16=5]="DT_INT16",t[t.DT_INT8=6]="DT_INT8",t[t.DT_STRING=7]="DT_STRING",t[t.DT_COMPLEX64=8]="DT_COMPLEX64",t[t.DT_INT64=9]="DT_INT64",t[t.DT_BOOL=10]="DT_BOOL",t[t.DT_QINT8=11]="DT_QINT8",t[t.DT_QUINT8=12]="DT_QUINT8",t[t.DT_QINT32=13]="DT_QINT32",t[t.DT_BFLOAT16=14]="DT_BFLOAT16",t[t.DT_QINT16=15]="DT_QINT16",t[t.DT_QUINT16=16]="DT_QUINT16",t[t.DT_UINT16=17]="DT_UINT16",t[t.DT_COMPLEX128=18]="DT_COMPLEX128",t[t.DT_HALF=19]="DT_HALF",t[t.DT_RESOURCE=20]="DT_RESOURCE",t[t.DT_VARIANT=21]="DT_VARIANT",t[t.DT_UINT32=22]="DT_UINT32",t[t.DT_UINT64=23]="DT_UINT64",t[t.DT_FLOAT_REF=101]="DT_FLOAT_REF",t[t.DT_DOUBLE_REF=102]="DT_DOUBLE_REF",t[t.DT_INT32_REF=103]="DT_INT32_REF",t[t.DT_UINT8_REF=104]="DT_UINT8_REF",t[t.DT_INT16_REF=105]="DT_INT16_REF",t[t.DT_INT8_REF=106]="DT_INT8_REF",t[t.DT_STRING_REF=107]="DT_STRING_REF",t[t.DT_COMPLEX64_REF=108]="DT_COMPLEX64_REF",t[t.DT_INT64_REF=109]="DT_INT64_REF",t[t.DT_BOOL_REF=110]="DT_BOOL_REF",t[t.DT_QINT8_REF=111]="DT_QINT8_REF",t[t.DT_QUINT8_REF=112]="DT_QUINT8_REF",t[t.DT_QINT32_REF=113]="DT_QINT32_REF",t[t.DT_BFLOAT16_REF=114]="DT_BFLOAT16_REF",t[t.DT_QINT16_REF=115]="DT_QINT16_REF",t[t.DT_QUINT16_REF=116]="DT_QUINT16_REF",t[t.DT_UINT16_REF=117]="DT_UINT16_REF",t[t.DT_COMPLEX128_REF=118]="DT_COMPLEX128_REF",t[t.DT_HALF_REF=119]="DT_HALF_REF",t[t.DT_RESOURCE_REF=120]="DT_RESOURCE_REF",t[t.DT_VARIANT_REF=121]="DT_VARIANT_REF",t[t.DT_UINT32_REF=122]="DT_UINT32_REF",t[t.DT_UINT64_REF=123]="DT_UINT64_REF"})(me||(me={}));var $a;(function(t){(function(e){e[e.LEGACY=0]="LEGACY",e[e.V1=1]="V1",e[e.V2=2]="V2"})(t.CheckpointFormatVersion||(t.CheckpointFormatVersion={}))})($a||($a={}));/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ra={};function I1(t,e){const n={tfOpName:t,category:"custom",inputs:[],attrs:[],customExecutor:e};ra[t]=n}function th(t){return ra[t]}function A1(t){delete ra[t]}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function c(t,e,n,s,r){const a=e.inputParams[t];if(a&&a.inputIndexStart!==void 0){const i=a.inputIndexStart,u=a.inputIndexEnd===0?void 0:a.inputIndexEnd===void 0?i+1:a.inputIndexEnd,l=i<0?e.inputNames.length+i:i;if(a.type==="tensor")return ee(e.inputNames[l],n,s,r);if(a.type==="tensors"){const m=e.inputs.slice(i,u);return e.inputNames.slice(i,u).filter((N,S)=>{var w;return((w=m[S])===null||w===void 0?void 0:w.op)!=="NoOp"}).map(N=>ee(N,n,s,r))}const h=ee(e.inputNames[l],n,s,r),p=h.dataSync();return a.type==="number"?p[0]:pt(h.shape,p)}const o=e.attrParams[t];return o&&o.value}function ee(t,e,n,s){const[r,a]=fe(t,n);if(s!=null){const i=s.getHashTableHandleByName(r);if(i!=null)return i}const o=n.currentContextIds.find(i=>!!e[Mn(r,i)]);return o!==void 0?e[Mn(r,o)][a]:void 0}function Ea(t,e,n){return e[Mn(t,n.currentContextId)]}function Pe(t,e){const[n,s,r]=fe(t,e);return[Mn(n,e&&e.currentContextId),s,r]}function Mn(t,e){return e?`${t}-${e}`:t}function fe(t,e){if(t==="")return["",0,void 0];const n=e!=null&&e.parseNodeNameCache!=null;if(n){const a=e.parseNodeNameCache.get(t);if(a!=null)return a}const s=t.split(":");let r;if(s.length===1)r=[t,0,void 0];else{const a=s[0],o=s.length===3?s[1]:void 0,i=Number(s[s.length-1]);r=[a,i,o]}return n&&e.parseNodeNameCache.set(t,r),r}function An(t,e,n){let s=c("pad",t,e,n);if(s==="explicit"){s=c("explicitPaddings",t,e,n);const r=[[0,0],[0,0],[0,0],[0,0]];for(let a=0;a<4;a++)r[a][0]=s[a*2],r[a][1]=s[a*2+1];return r}return s}function Be(t){return t.kept?t:ze(t)}/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const x1=[{tfOpName:"Add",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"AddV2",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"AddN",category:"arithmetic",inputs:[{start:0,end:0,name:"tensors",type:"tensors"}]},{tfOpName:"BiasAdd",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0}]},{tfOpName:"Sub",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"RealDiv",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Div",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"DivNoNan",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"FloorDiv",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Mul",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Maximum",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Minimum",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Pow",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"SquaredDifference",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Mod",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"FloorMod",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]}],O1=Object.freeze(Object.defineProperty({__proto__:null,json:x1},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const D1=[{tfOpName:"Abs",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Acos",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Asin",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Atan",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Atan2",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"y",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Ceil",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"ClipByValue",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"clipValueMin",type:"number"},{start:2,name:"clipValueMax",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Complex",category:"basic_math",inputs:[{start:0,name:"real",type:"tensor"},{start:1,name:"imag",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"ComplexAbs",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Cos",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Cosh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Elu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Exp",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Floor",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Log",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Imag",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"Tout",name:"outputType",type:"dtype",notSupported:!0}]},{tfOpName:"Neg",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Real",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"Tout",name:"outputType",type:"dtype",notSupported:!0}]},{tfOpName:"Prelu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"alpha",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Relu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Relu6",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Selu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sigmoid",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sin",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sinh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sqrt",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Rsqrt",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Square",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Tan",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Tanh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sign",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Round",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Expm1",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Log1p",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Reciprocal",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Softplus",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Asinh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Acosh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Atanh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Erf",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LeakyRelu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"alpha",name:"alpha",type:"number",defaultValue:.2},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"IsNan",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"IsFinite",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"IsInf",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]}],F1=Object.freeze(Object.defineProperty({__proto__:null,json:D1},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const C1=[{tfOpName:"EmptyTensorList",category:"control",inputs:[{start:0,name:"elementShape",type:"shape"},{start:1,name:"maxNumElements",type:"number"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"LoopCond",category:"control",inputs:[{start:0,name:"pred",type:"tensor"}]},{tfOpName:"Switch",category:"control",inputs:[{start:0,name:"data",type:"tensor"},{start:1,name:"pred",type:"tensor"}]},{tfOpName:"Merge",category:"control",inputs:[{start:0,end:0,name:"tensors",type:"tensors"}]},{tfOpName:"Enter",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"frame_name",name:"frameName",type:"string"},{tfName:"is_constant",name:"isConstant",type:"bool"}]},{tfOpName:"Exit",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"NextIteration",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"TensorArrayV3",category:"control",inputs:[{start:0,name:"size",type:"number"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"element_shape",name:"elementShape",type:"shape"},{tfName:"dynamic_size",name:"dynamicSize",type:"bool"},{tfName:"clear_after_read",name:"clearAfterRead",type:"bool"},{tfName:"identical_element_shapes",name:"identicalElementShapes",type:"bool"},{tfName:"tensor_array_name",name:"name",type:"string"}]},{tfOpName:"TensorArrayWriteV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"index",type:"number"},{start:2,name:"tensor",type:"tensor"},{start:3,name:"flowIn",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"TensorArrayReadV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"index",type:"number"},{start:2,name:"flowIn",type:"number"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"TensorArrayGatherV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"flowIn",type:"number"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"element_shape",name:"elementShape",type:"shape"}]},{tfOpName:"TensorArrayScatterV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"tensor",type:"tensor"},{start:3,name:"flowIn",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"TensorArrayConcatV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"flowIn",type:"number"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"element_shape_except0",name:"elementShapeExcept0",type:"shape",notSupported:!0}]},{tfOpName:"TensorArraySplitV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"tensor",type:"tensor"},{start:2,name:"lengths",type:"number[]"},{start:3,name:"flowIn",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"TensorArraySizeV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"flowIn",type:"number"}]},{tfOpName:"TensorArrayCloseV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"}]},{tfOpName:"StatelessIf",category:"control",inputs:[{start:0,name:"cond",type:"tensor"},{start:1,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"then_branch",name:"thenBranch",type:"func"},{tfName:"else_branch",name:"elseBranch",type:"func"}]},{tfOpName:"If",category:"control",inputs:[{start:0,name:"cond",type:"tensor"},{start:1,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"then_branch",name:"thenBranch",type:"func"},{tfName:"else_branch",name:"elseBranch",type:"func"}]},{tfOpName:"StatelessWhile",category:"control",inputs:[{start:0,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"cond",name:"cond",type:"func"},{tfName:"body",name:"body",type:"func"}]},{tfOpName:"While",category:"control",inputs:[{start:0,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"cond",name:"cond",type:"func"},{tfName:"body",name:"body",type:"func"}]},{tfOpName:"TensorListScatter",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListScatterV2",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"elementShape",type:"shape"},{start:3,name:"numElements",type:"number"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListGather",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListGetItem",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"index",type:"number"},{start:2,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListSetItem",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"index",type:"number"},{start:2,name:"tensor",type:"tensor"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListReserve",category:"control",inputs:[{start:0,name:"elementShape",type:"shape"},{start:1,name:"numElements",type:"number"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListFromTensor",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListStack",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"},{tfName:"num_elements",name:"numElements",type:"dtype"}]},{tfOpName:"TensorListSplit",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"elementShape",type:"shape"},{start:2,name:"lengths",type:"number[]"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListConcat",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"}],attrs:[{tfName:"element_shape",name:"elementShape",type:"shape"},{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListConcatV2",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"}],attrs:[{tfName:"element_shape",name:"elementShape",type:"shape"},{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListPopBack",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListPushBack",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"tensor",type:"tensor"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListLength",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"}]},{tfOpName:"TensorListResize",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"size",type:"number"}]}],R1=Object.freeze(Object.defineProperty({__proto__:null,json:C1},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const P1=[{tfOpName:"AvgPool",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"MaxPool",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[],notSupported:!0},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"MaxPoolWithArgmax",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"include_batch_in_index",name:"includeBatchInIndex",type:"bool"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"AvgPool3D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"MaxPool3D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Conv1D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"stride",name:"stride",type:"number"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NWC"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"dilation",name:"dilation",type:"number",defaultValue:1}]},{tfOpName:"Conv2D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"useCudnnOnGpu",name:"useCudnnOnGpu",type:"bool"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"dilations",name:"dilations",type:"number[]"}]},{tfOpName:"_FusedConv2D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"},{start:2,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"num_args",name:"numArgs",type:"number"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"use_cudnn_on_gpu",name:"useCudnnOnGpu",type:"bool",defaultValue:!0},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"dilations",name:"dilations",type:"number[]",defaultValue:[1,1,1,1]},{tfName:"fused_ops",name:"fusedOps",type:"string[]",defaultValue:[]},{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:1e-4},{tfName:"leakyrelu_alpha",name:"leakyreluAlpha",type:"number",defaultValue:.2}]},{tfOpName:"Conv2DBackpropInput",category:"convolution",inputs:[{start:2,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"},{start:0,name:"outputShape",type:"number[]"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"dilations",name:"dilations",type:"number[]",notSupported:!0}]},{tfOpName:"DepthwiseConv2d",category:"convolution",inputs:[{start:0,name:"input",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"dilations",name:"dilations",type:"number[]"}]},{tfOpName:"DepthwiseConv2dNative",category:"convolution",inputs:[{start:0,name:"input",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"dilations",name:"dilations",type:"number[]"}]},{tfOpName:"FusedDepthwiseConv2dNative",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"},{start:2,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"num_args",name:"numArgs",type:"number"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"dilations",name:"dilations",type:"number[]",defaultValue:[1,1,1,1]},{tfName:"fused_ops",name:"fusedOps",type:"string[]",defaultValue:[]},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]}]},{tfOpName:"Conv3D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"dilations",name:"dilations",type:"number[]"}]},{tfOpName:"Dilation2D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"rates",name:"dilations",type:"number[]"},{tfName:"padding",name:"pad",type:"string"}]}],B1=Object.freeze(Object.defineProperty({__proto__:null,json:P1},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const L1=[{tfOpName:"Fill",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"},{start:1,name:"value",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"LinSpace",category:"creation",inputs:[{start:0,name:"start",type:"number"},{start:1,name:"stop",type:"number"},{start:2,name:"num",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"OneHot",category:"creation",inputs:[{start:0,name:"indices",type:"tensor"},{start:1,name:"depth",type:"number"},{start:2,name:"onValue",type:"number",defaultValue:1},{start:3,name:"offValue",type:"number",defaultValue:0}],attrs:[{tfName:"axis",name:"axis",type:"number",notSupported:!0},{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"Ones",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"OnesLike",category:"creation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype"}]},{tfOpName:"RandomStandardNormal",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"seed",name:"seed",type:"number",defaultValue:0},{tfName:"seed2",name:"seed2",type:"number",defaultValue:0,notSupported:!0},{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"T",name:"T",type:"number",notSupported:!0}]},{tfOpName:"RandomUniform",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"minval",name:"minval",type:"number",defaultValue:0},{tfName:"maxval",name:"maxval",type:"number",defaultValue:1},{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"seed",name:"seed",type:"number",defaultValue:0},{tfName:"seed2",name:"seed2",type:"number",defaultValue:0,notSupported:!0},{tfName:"T",name:"T",type:"number",notSupported:!0}]},{tfOpName:"RandomUniformInt",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"minval",name:"minval",type:"number"},{tfName:"maxval",name:"maxval",type:"number"},{tfName:"seed",name:"seed",type:"number",defaultValue:0},{tfName:"seed2",name:"seed2",type:"number",defaultValue:0,notSupported:!0}]},{tfOpName:"Range",category:"creation",inputs:[{start:0,name:"start",type:"number"},{start:1,name:"stop",type:"number"},{start:2,name:"step",type:"number",defaultValue:0}],attrs:[{tfName:"Tidx",name:"dtype",type:"dtype"}]},{tfOpName:"TruncatedNormal",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"means",name:"mean",type:"number",defaultValue:0},{tfName:"stddev",name:"stdDev",type:"number",defaultValue:1},{tfName:"seed",name:"seed",type:"number"},{tfName:"seed2",name:"seed2",type:"number",defaultValue:0,notSupported:!0},{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"T",name:"T",type:"number",notSupported:!0}]},{tfOpName:"Zeros",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"ZerosLike",category:"creation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"Multinomial",category:"creation",inputs:[{start:0,name:"logits",type:"tensor"},{start:1,name:"numSamples",type:"number"}],attrs:[{tfName:"seed",name:"seed",type:"number"},{tfName:"seed2",name:"seed2",type:"number"},{tfName:"T",name:"dtype",type:"dtype"},{tfName:"output_dtype",name:"output_dtype",type:"dtype"}]}],z1=Object.freeze(Object.defineProperty({__proto__:null,json:L1},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const V1=[{tfOpName:"NonMaxSuppressionV2",category:"dynamic",inputs:[{start:0,name:"boxes",type:"tensor"},{start:1,name:"scores",type:"tensor"},{start:2,name:"maxOutputSize",type:"number"},{start:3,name:"iouThreshold",type:"number"}]},{tfOpName:"NonMaxSuppressionV3",category:"dynamic",inputs:[{start:0,name:"boxes",type:"tensor"},{start:1,name:"scores",type:"tensor"},{start:2,name:"maxOutputSize",type:"number"},{start:3,name:"iouThreshold",type:"number"},{start:4,name:"scoreThreshold",type:"number"}]},{tfOpName:"NonMaxSuppressionV4",category:"dynamic",inputs:[{start:0,name:"boxes",type:"tensor"},{start:1,name:"scores",type:"tensor"},{start:2,name:"maxOutputSize",type:"number"},{start:3,name:"iouThreshold",type:"number"},{start:4,name:"scoreThreshold",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"T_threshold",name:"threshold",type:"dtype",notSupported:!0},{tfName:"pad_to_max_output_size",name:"padToMaxOutputSize",type:"bool"}]},{tfOpName:"NonMaxSuppressionV5",category:"dynamic",inputs:[{start:0,name:"boxes",type:"tensor"},{start:1,name:"scores",type:"tensor"},{start:2,name:"maxOutputSize",type:"number"},{start:3,name:"iouThreshold",type:"number"},{start:4,name:"scoreThreshold",type:"number"},{start:5,name:"softNmsSigma",type:"number"}]},{tfOpName:"Where",category:"dynamic",inputs:[{start:0,name:"condition",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"ListDiff",category:"dynamic",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"y",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]}],j1=Object.freeze(Object.defineProperty({__proto__:null,json:V1},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const M1=[{tfOpName:"LowerBound",category:"evaluation",inputs:[{start:0,name:"sortedSequence",type:"tensor"},{start:1,name:"values",type:"tensor"}]},{tfOpName:"TopKV2",category:"evaluation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"k",type:"number"}],attrs:[{tfName:"sorted",name:"sorted",type:"bool"}]},{tfOpName:"UpperBound",category:"evaluation",inputs:[{start:0,name:"sortedSequence",type:"tensor"},{start:1,name:"values",type:"tensor"}]},{tfOpName:"Unique",category:"evaluation",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"UniqueV2",category:"evaluation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}]}],W1=Object.freeze(Object.defineProperty({__proto__:null,json:M1},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const U1=[{tfOpName:"PlaceholderWithDefault",category:"graph",inputs:[{start:0,name:"default",type:"tensor"}],attrs:[{tfName:"shape",name:"shape",type:"shape"},{tfName:"dtype",name:"dtype",type:"dtype"}]},{tfOpName:"Placeholder",category:"graph",attrs:[{tfName:"shape",name:"shape",type:"shape"},{tfName:"dtype",name:"dtype",type:"dtype"}]},{tfOpName:"Const",category:"graph"},{tfOpName:"Identity",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"IdentityN",category:"graph",inputs:[{start:0,end:0,name:"x",type:"tensors"}]},{tfOpName:"Snapshot",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"Rank",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"Size",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"Shape",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"ShapeN",category:"graph",inputs:[{start:0,end:0,name:"x",type:"tensors"}]},{tfOpName:"Print",category:"graph",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"data",type:"tensors"}],attrs:[{tfName:"message",name:"message",type:"string"},{tfName:"first_n",name:"firstN",type:"number",notSupported:!0},{tfName:"summarize",name:"summarize",type:"number",defaultValue:3}]},{tfOpName:"NoOp",category:"graph",inputs:[]},{tfOpName:"StopGradient",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"FakeQuantWithMinMaxVars",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"min",name:"min",type:"number"},{tfName:"max",name:"max",type:"number"}]}],G1=Object.freeze(Object.defineProperty({__proto__:null,json:U1},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const q1=[{tfOpName:"HashTable",category:"hash_table",inputs:[],attrs:[{tfName:"shared_name",name:"sharedName",type:"string"},{tfName:"use_node_name_sharing",name:"useNodeNameSharing",type:"bool"},{tfName:"key_dtype",name:"keyDType",type:"dtype"},{tfName:"value_dtype",name:"valueDType",type:"dtype"}]},{tfOpName:"HashTableV2",category:"hash_table",inputs:[],attrs:[{tfName:"shared_name",name:"sharedName",type:"string"},{tfName:"use_node_name_sharing",name:"useNodeNameSharing",type:"bool"},{tfName:"key_dtype",name:"keyDType",type:"dtype"},{tfName:"value_dtype",name:"valueDType",type:"dtype"}]},{tfOpName:"LookupTableImport",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"values",type:"tensor"}],attrs:[{tfName:"Tin",name:"tIn",type:"dtype",notSupported:!0},{tfName:"Tout",name:"tOut",type:"dtype",notSupported:!0}]},{tfOpName:"LookupTableImportV2",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"values",type:"tensor"}],attrs:[{tfName:"Tin",name:"tIn",type:"dtype",notSupported:!0},{tfName:"Tout",name:"tOut",type:"dtype",notSupported:!0}]},{tfOpName:"LookupTableFind",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"defaultValue",type:"tensor"}],attrs:[{tfName:"Tin",name:"tIn",type:"dtype",notSupported:!0},{tfName:"Tout",name:"tOut",type:"dtype",notSupported:!0}]},{tfOpName:"LookupTableFindV2",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"defaultValue",type:"tensor"}],attrs:[{tfName:"Tin",name:"tIn",type:"dtype",notSupported:!0},{tfName:"Tout",name:"tOut",type:"dtype",notSupported:!0}]},{tfOpName:"LookupTableSize",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"}]},{tfOpName:"LookupTableSizeV2",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"}]},{tfOpName:"InitializeTable",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"values",type:"tensor"}]},{tfOpName:"InitializeTableV2",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"values",type:"tensor"}]}],K1=Object.freeze(Object.defineProperty({__proto__:null,json:q1},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const H1=[{tfOpName:"ResizeBilinear",category:"image",inputs:[{start:0,name:"images",type:"tensor"},{start:1,name:"size",type:"number[]"}],attrs:[{tfName:"align_corners",name:"alignCorners",type:"bool"},{tfName:"half_pixel_centers",name:"halfPixelCenters",type:"bool"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"ResizeNearestNeighbor",category:"image",inputs:[{start:0,name:"images",type:"tensor"},{start:1,name:"size",type:"number[]"}],attrs:[{tfName:"align_corners",name:"alignCorners",type:"bool"},{tfName:"half_pixel_centers",name:"halfPixelCenters",type:"bool"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"CropAndResize",category:"image",inputs:[{start:0,name:"image",type:"tensor"},{start:1,name:"boxes",type:"tensor"},{start:2,name:"boxInd",type:"tensor"},{start:3,name:"cropSize",type:"number[]"}],attrs:[{tfName:"method",name:"method",type:"string"},{tfName:"extrapolation_value",name:"extrapolationValue",type:"number"}]},{tfOpName:"ImageProjectiveTransformV3",category:"image",inputs:[{start:0,name:"images",type:"tensor"},{start:1,name:"transforms",type:"tensor"},{start:2,name:"outputShape",type:"number[]"},{start:3,name:"fillValue",type:"number"}],attrs:[{tfName:"interpolation",name:"interpolation",type:"string"},{tfName:"fill_mode",name:"fillMode",type:"string"}]}],X1=Object.freeze(Object.defineProperty({__proto__:null,json:H1},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const J1=[{tfOpName:"Equal",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"NotEqual",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Greater",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"GreaterEqual",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Less",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LessEqual",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LogicalAnd",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LogicalNot",category:"logical",inputs:[{start:0,name:"a",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LogicalOr",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Select",category:"logical",inputs:[{start:0,name:"condition",type:"tensor"},{start:1,name:"a",type:"tensor"},{start:2,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"SelectV2",category:"logical",inputs:[{start:0,name:"condition",type:"tensor"},{start:1,name:"a",type:"tensor"},{start:2,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"BitwiseAnd",category:"logical",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"y",type:"tensor"}]}],Y1=Object.freeze(Object.defineProperty({__proto__:null,json:J1},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Z1=[{tfOpName:"_FusedMatMul",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"},{start:2,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"num_args",name:"numArgs",type:"number"},{tfName:"fused_ops",name:"fusedOps",type:"string[]",defaultValue:[]},{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:1e-4},{tfName:"transpose_a",name:"transposeA",type:"bool",defaultValue:!1},{tfName:"transpose_b",name:"transposeB",type:"bool",defaultValue:!1},{tfName:"leakyrelu_alpha",name:"leakyreluAlpha",type:"number",defaultValue:.2},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"MatMul",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"transpose_a",name:"transposeA",type:"bool",defaultValue:!1},{tfName:"transpose_b",name:"transposeB",type:"bool",defaultValue:!1},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"BatchMatMul",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"adj_x",name:"transposeA",type:"bool",defaultValue:!1},{tfName:"adj_y",name:"transposeB",type:"bool",defaultValue:!1},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"BatchMatMulV2",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"adj_x",name:"transposeA",type:"bool",defaultValue:!1},{tfName:"adj_y",name:"transposeB",type:"bool",defaultValue:!1},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Transpose",category:"matrices",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"perm",type:"number[]"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Einsum",category:"matrices",inputs:[{start:0,end:0,name:"tensors",type:"tensors"}],attrs:[{tfName:"equation",name:"equation",type:"string"},{tfName:"N",name:"n",type:"number",defaultValue:2},{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"MatrixBandPart",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"numLower",type:"tensor"},{start:1,name:"numUpper",type:"tensor"}]}],Q1=Object.freeze(Object.defineProperty({__proto__:null,json:Z1},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const eS=[{tfOpName:"EuclideanNorm",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool",defaultValue:!1}]},{tfOpName:"FusedBatchNorm",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"scale",type:"tensor"},{start:2,name:"offset",type:"tensor"},{start:3,name:"mean",type:"tensor"},{start:4,name:"variance",type:"tensor"}],attrs:[{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:.001},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0}]},{tfOpName:"FusedBatchNormV2",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"scale",type:"tensor"},{start:2,name:"offset",type:"tensor"},{start:3,name:"mean",type:"tensor"},{start:4,name:"variance",type:"tensor"}],attrs:[{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:.001},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0}]},{tfOpName:"FusedBatchNormV3",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"scale",type:"tensor"},{start:2,name:"offset",type:"tensor"},{start:3,name:"mean",type:"tensor"},{start:4,name:"variance",type:"tensor"}],attrs:[{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:.001},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0}]},{tfOpName:"LRN",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"depth_radius",name:"radius",type:"number",defaultValue:5},{tfName:"bias",name:"bias",type:"number",defaultValue:1},{tfName:"alpha",name:"alpha",type:"number",defaultValue:1},{tfName:"beta",name:"beta",type:"number",defaultValue:.5}]},{tfOpName:"Softmax",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"LogSoftmax",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"}]}],tS=Object.freeze(Object.defineProperty({__proto__:null,json:eS},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const nS=[{tfOpName:"Bincount",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"size",type:"number"},{start:2,name:"weights",type:"tensor"}]},{tfOpName:"DenseBincount",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"size",type:"number"},{start:2,name:"weights",type:"tensor"}],attrs:[{tfName:"binary_output",name:"binaryOutput",type:"bool"}]},{tfOpName:"Max",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Mean",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Min",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Sum",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"All",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Any",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"ArgMax",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}]},{tfOpName:"ArgMin",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}]},{tfOpName:"Prod",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Cumprod",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}],attrs:[{tfName:"exclusive",name:"exclusive",type:"bool"},{tfName:"reverse",name:"reverse",type:"bool"}]},{tfOpName:"Cumsum",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}],attrs:[{tfName:"exclusive",name:"exclusive",type:"bool"},{tfName:"reverse",name:"reverse",type:"bool"}]}],sS=Object.freeze(Object.defineProperty({__proto__:null,json:nS},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const rS=[{tfOpName:"ConcatV2",category:"slice_join",inputs:[{start:0,end:-1,name:"tensors",type:"tensors"},{start:-1,name:"axis",type:"number"}],attrs:[{tfName:"N",name:"n",type:"number",defaultValue:2}]},{tfOpName:"Concat",category:"slice_join",inputs:[{start:1,end:0,name:"tensors",type:"tensors"},{start:0,name:"axis",type:"number"}],attrs:[{tfName:"N",name:"n",type:"number",defaultValue:2}]},{tfOpName:"GatherV2",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"indices",type:"tensor"},{start:2,name:"axis",type:"number",defaultValue:0}],attrs:[{tfName:"batch_dims",name:"batchDims",type:"number",defaultValue:0}]},{tfOpName:"Gather",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"indices",type:"tensor"}],attrs:[{tfName:"validate_indices",name:"validateIndices",type:"bool",notSupported:!0}]},{tfOpName:"Reverse",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"dims",type:"bool[]"}]},{tfOpName:"ReverseV2",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}]},{tfOpName:"Slice",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"begin",type:"number[]"},{start:2,name:"size",type:"number[]"}]},{tfOpName:"StridedSlice",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"begin",type:"number[]"},{start:2,name:"end",type:"number[]"},{start:3,name:"strides",type:"number[]"}],attrs:[{tfName:"begin_mask",name:"beginMask",type:"number",defaultValue:0},{tfName:"end_mask",name:"endMask",type:"number",defaultValue:0},{tfName:"new_axis_mask",name:"newAxisMask",type:"number",defaultValue:0},{tfName:"ellipsis_mask",name:"ellipsisMask",type:"number",defaultValue:0},{tfName:"shrink_axis_mask",name:"shrinkAxisMask",type:"number",defaultValue:0}]},{tfOpName:"Pack",category:"slice_join",inputs:[{start:0,end:0,name:"tensors",type:"tensors"}],attrs:[{tfName:"axis",name:"axis",type:"number",defaultValue:0}]},{tfOpName:"Unpack",category:"slice_join",inputs:[{start:0,name:"tensor",type:"tensor"}],attrs:[{tfName:"axis",name:"axis",type:"number",defaultValue:0},{tfName:"num",name:"num",type:"number",defaultValue:0,notSupported:!0}]},{tfOpName:"Tile",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"reps",type:"number[]"}]},{tfOpName:"Split",category:"slice_join",inputs:[{start:0,name:"axis",type:"number",defaultValue:0},{start:1,name:"x",type:"tensor"}],attrs:[{tfName:"num_split",name:"numOrSizeSplits",type:"number",defaultValue:1}]},{tfOpName:"SplitV",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"numOrSizeSplits",type:"number[]"},{start:2,name:"axis",type:"number",defaultValue:0}]},{tfOpName:"ScatterNd",category:"slice_join",inputs:[{start:0,name:"indices",type:"tensor"},{start:1,name:"values",type:"tensor"},{start:2,name:"shape",type:"number[]"}]},{tfOpName:"GatherNd",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"indices",type:"tensor"}]},{tfOpName:"SparseToDense",category:"slice_join",inputs:[{start:0,name:"sparseIndices",type:"tensor"},{start:1,name:"outputShape",type:"number[]"},{start:2,name:"sparseValues",type:"tensor"},{start:3,name:"defaultValue",type:"tensor"}],attrs:[{tfName:"validate_indices",name:"validateIndices",type:"bool",defaultValue:!1,notSupported:!0}]},{tfOpName:"TensorScatterUpdate",category:"slice_join",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"indices",type:"tensor"},{start:2,name:"values",type:"tensor"}]}],aS=Object.freeze(Object.defineProperty({__proto__:null,json:rS},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const oS=[{tfOpName:"SparseFillEmptyRows",category:"sparse",inputs:[{start:0,name:"indices",type:"tensor"},{start:1,name:"values",type:"tensor"},{start:2,name:"denseShape",type:"tensor"},{start:3,name:"defaultValue",type:"tensor"}]},{tfOpName:"SparseReshape",category:"sparse",inputs:[{start:0,name:"inputIndices",type:"tensor"},{start:1,name:"inputShape",type:"tensor"},{start:2,name:"newShape",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"SparseSegmentMean",category:"sparse",inputs:[{start:0,name:"data",type:"tensor"},{start:1,name:"indices",type:"tensor"},{start:2,name:"segmentIds",type:"tensor"}]},{tfOpName:"SparseSegmentSum",category:"sparse",inputs:[{start:0,name:"data",type:"tensor"},{start:1,name:"indices",type:"tensor"},{start:2,name:"segmentIds",type:"tensor"}]}],iS=Object.freeze(Object.defineProperty({__proto__:null,json:oS},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const uS=[{tfOpName:"FFT",category:"spectral",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"IFFT",category:"spectral",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"RFFT",category:"spectral",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"fft_length",type:"number",notSupported:!0}]},{tfOpName:"IRFFT",category:"spectral",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"fft_length",type:"number",notSupported:!0}]}],lS=Object.freeze(Object.defineProperty({__proto__:null,json:uS},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const cS=[{tfOpName:"StaticRegexReplace",category:"string",inputs:[{start:0,name:"input",type:"tensor"}],attrs:[{tfName:"pattern",name:"pattern",type:"string"},{tfName:"rewrite",name:"rewrite",type:"string"},{tfName:"replace_global",name:"replaceGlobal",type:"bool"}]},{tfOpName:"StringNGrams",category:"string",inputs:[{start:0,name:"data",type:"tensor"},{start:1,name:"dataSplits",type:"tensor"}],attrs:[{tfName:"separator",name:"separator",type:"string"},{tfName:"ngram_widths",name:"nGramWidths",type:"number[]"},{tfName:"left_pad",name:"leftPad",type:"string"},{tfName:"right_pad",name:"rightPad",type:"string"},{tfName:"pad_width",name:"padWidth",type:"number"},{tfName:"preserve_short_sequences",name:"preserveShortSequences",type:"bool"}],outputs:["ngrams","ngrams_splits"]},{tfOpName:"StringSplit",category:"string",inputs:[{start:0,name:"input",type:"tensor"},{start:1,name:"delimiter",type:"tensor"}],attrs:[{tfName:"skip_empty",name:"skipEmpty",type:"bool"}],outputs:["indices","values","shape"]},{tfOpName:"StringToHashBucketFast",category:"string",inputs:[{start:0,name:"input",type:"tensor"}],attrs:[{tfName:"num_buckets",name:"numBuckets",type:"number"}]}],pS=Object.freeze(Object.defineProperty({__proto__:null,json:cS},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const hS=[{tfOpName:"Cast",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"SrcT",name:"sdtype",type:"dtype",notSupported:!0},{tfName:"DstT",name:"dtype",type:"dtype"}]},{tfOpName:"ExpandDims",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}]},{tfOpName:"MirrorPad",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"padding",type:"number[]"}],attrs:[{tfName:"mode",name:"mode",type:"string"}]},{tfOpName:"Pad",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"padding",type:"number[]"}],attrs:[{tfName:"constant_value",name:"constantValue",type:"number",defaultValue:0}]},{tfOpName:"PadV2",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"padding",type:"number[]"},{start:2,name:"constantValue",type:"number",defaultValue:0}]},{tfOpName:"Reshape",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"shape",type:"number[]"}]},{tfOpName:"EnsureShape",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"shape",type:"number[]"}]},{tfOpName:"Squeeze",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"axis",tfDeprecatedName:"squeeze_dims",name:"axis",type:"number[]"}]},{tfOpName:"SpaceToBatchND",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"blockShape",type:"number[]"},{start:2,name:"paddings",type:"number[]"}]},{tfOpName:"BatchToSpaceND",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"blockShape",type:"number[]"},{start:2,name:"crops",type:"number[]"}]},{tfOpName:"DepthToSpace",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"block_size",name:"blockSize",type:"number"},{tfName:"data_format",name:"dataFormat",type:"string"}]},{tfOpName:"BroadcastTo",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"shape",type:"number[]"}],attrs:[]},{tfOpName:"BroadcastArgs",category:"transformation",inputs:[{start:0,name:"s0",type:"tensor"},{start:1,name:"s1",type:"tensor"}],attrs:[]}],mS=Object.freeze(Object.defineProperty({__proto__:null,json:hS},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class ka{static get Instance(){return this._instance||(this._instance=new this)}constructor(){const e=[O1,F1,R1,B1,z1,j1,W1,G1,K1,X1,Y1,Q1,tS,sS,aS,iS,lS,pS,mS],n=[].concat(...e.map(s=>s.json));this.opMappers=n.reduce((s,r)=>(s[r.tfOpName]=r,s),{})}transformGraph(e,n={}){const s=e.node,r=[],a=[],o=[],i=s.reduce((S,w)=>(S[w.name]=this.mapNode(w),w.op.startsWith("Placeholder")?r.push(S[w.name]):w.op==="Const"?a.push(S[w.name]):(w.input==null||w.input.length===0)&&o.push(S[w.name]),S),{});let u=[];const l=[];let h={},p={};n!=null&&(h=this.mapSignatureEntries(n.inputs),p=this.mapSignatureEntries(n.outputs));const m=Object.keys(i);m.forEach(S=>{const w=i[S];w.inputNames.forEach((T,v)=>{const[E,,k]=Pe(T),A=i[E];if(A.outputs!=null){const I=A.outputs.indexOf(k);if(I!==-1){const C=`${E}:${I}`;w.inputNames[v]=C}}w.inputs.push(A),A.children.push(w)})}),Object.keys(p).length===0?m.forEach(S=>{const w=i[S];w.children.length===0&&l.push(w)}):Object.keys(p).forEach(S=>{const[w]=Pe(S),T=i[w];T!=null&&(T.signatureKey=p[S],l.push(T))}),Object.keys(h).length>0?Object.keys(h).forEach(S=>{const[w]=Pe(S),T=i[w];T&&(T.signatureKey=h[S],u.push(T))}):u=r;let g={};e.library!=null&&e.library.function!=null&&(g=e.library.function.reduce((S,w)=>(S[w.signature.name]=this.mapFunction(w),S),{}));const N={nodes:i,inputs:u,outputs:l,weights:a,placeholders:r,signature:n,functions:g};return o.length>0&&(N.initNodes=o),N}mapSignatureEntries(e){return Object.keys(e||{}).reduce((n,s)=>(n[e[s].name]=s,n),{})}mapNode(e){const n=th(e.op)||this.opMappers[e.op]||{};e.attr==null&&(e.attr={});const s={name:e.name,op:e.op,category:n.category,inputNames:(e.input||[]).map(r=>r.startsWith("^")?r.slice(1):r),inputs:[],children:[],inputParams:{},attrParams:{},rawAttrs:e.attr,outputs:n.outputs};return n.inputs!=null&&(s.inputParams=n.inputs.reduce((r,a)=>(r[a.name]={type:a.type,inputIndexStart:a.start,inputIndexEnd:a.end},r),{})),n.attrs!=null&&(s.attrParams=n.attrs.reduce((r,a)=>{const o=a.type;let i;switch(a.type){case"string":i=Ps(e.attr,a.tfName,a.defaultValue),i===void 0&&a.tfDeprecatedName&&(i=Ps(e.attr,a.tfDeprecatedName,a.defaultValue));break;case"string[]":i=Ws(e.attr,a.tfName,a.defaultValue),i===void 0&&a.tfDeprecatedName&&(i=Ws(e.attr,a.tfDeprecatedName,a.defaultValue));break;case"number":i=Ls(e.attr,a.tfName,a.defaultValue||0),i===void 0&&a.tfDeprecatedName&&(i=Ls(e.attr,a.tfDeprecatedName,a.defaultValue));break;case"number[]":i=Ms(e.attr,a.tfName,a.defaultValue),i===void 0&&a.tfDeprecatedName&&(i=Ms(e.attr,a.tfDeprecatedName,a.defaultValue));break;case"bool":i=Bs(e.attr,a.tfName,a.defaultValue),i===void 0&&a.tfDeprecatedName&&(i=Bs(e.attr,a.tfDeprecatedName,a.defaultValue));break;case"bool[]":i=Gs(e.attr,a.tfName,a.defaultValue),i===void 0&&a.tfDeprecatedName&&(i=Gs(e.attr,a.tfDeprecatedName,a.defaultValue));break;case"shape":i=js(e.attr,a.tfName,a.defaultValue),i===void 0&&a.tfDeprecatedName&&(i=js(e.attr,a.tfDeprecatedName,a.defaultValue));break;case"shape[]":i=Us(e.attr,a.tfName,a.defaultValue),i===void 0&&a.tfDeprecatedName&&(i=Us(e.attr,a.tfDeprecatedName,a.defaultValue));break;case"dtype":i=zs(e.attr,a.tfName,a.defaultValue),i===void 0&&a.tfDeprecatedName&&(i=zs(e.attr,a.tfDeprecatedName,a.defaultValue));break;case"dtype[]":i=Vs(e.attr,a.tfName,a.defaultValue),i===void 0&&a.tfDeprecatedName&&(i=Vs(e.attr,a.tfDeprecatedName,a.defaultValue));break;case"func":i=_a(e.attr,a.tfName,a.defaultValue),i===void 0&&a.tfDeprecatedName&&(i=_a(e.attr,a.tfDeprecatedName,a.defaultValue));break;case"tensor":case"tensors":break;default:throw new Error(`Unsupported param type: ${a.type} for op: ${e.op}`)}return r[a.name]={value:i,type:o},r},{})),s}mapFunction(e){const n=e.nodeDef,s=[],r=[];let a={};n!=null&&(a=n.reduce((p,m)=>(p[m.name]=this.mapNode(m),m.op==="Const"&&r.push(p[m.name]),p),{}));const o=[],i=[];e.signature.inputArg.forEach(p=>{const[m]=Pe(p.name),g={name:m,op:"Placeholder",inputs:[],inputNames:[],category:"graph",inputParams:{},attrParams:{dtype:{value:aa(p.type),type:"dtype"}},children:[]};g.signatureKey=p.name,o.push(g),a[m]=g}),Object.keys(a).forEach(p=>{const m=a[p];m.inputNames.forEach((g,N)=>{const[S,,w]=Pe(g),T=a[S];if(T.outputs!=null){const v=T.outputs.indexOf(w);if(v!==-1){const E=`${S}:${v}`;m.inputNames[N]=E}}m.inputs.push(T),T.children.push(m)})});const l=e.ret;e.signature.outputArg.forEach(p=>{const[m,g]=Pe(l[p.name]),N=a[m];N!=null&&(N.defaultOutput=g,i.push(N))});const h=this.mapArgsToSignature(e);return{nodes:a,inputs:o,outputs:i,weights:r,placeholders:s,signature:h}}mapArgsToSignature(e){return{methodName:e.signature.name,inputs:e.signature.inputArg.reduce((n,s)=>(n[s.name]=this.mapArgToTensorInfo(s),n),{}),outputs:e.signature.outputArg.reduce((n,s)=>(n[s.name]=this.mapArgToTensorInfo(s,e.ret),n),{})}}mapArgToTensorInfo(e,n){let s=e.name;return n!=null&&(s=n[s]),{name:s,dtype:e.type}}}function fS(t){const e=O().global;if(typeof e.atob<"u")return e.atob(t);if(typeof Buffer<"u")return new Buffer(t,"base64").toString();throw new Error("Unable to decode base64 in this environment. Missing built-in atob() or Buffer()")}function nh(t,e){const n=Array.isArray(t)?String.fromCharCode.apply(null,t):fS(t);return e?n:n.toLowerCase()}function Ps(t,e,n,s=!1){const r=t[e];return r!=null?nh(r.s,s):n}function Bs(t,e,n){const s=t[e];return s?s.b:n}function Ls(t,e,n){const s=t[e]||{},r=s.i!=null?s.i:s.f!=null?s.f:n;return typeof r=="number"?r:parseInt(r,10)}function aa(t){switch(typeof t=="string"&&(t=me[t]),t){case me.DT_FLOAT:case me.DT_HALF:return"float32";case me.DT_INT32:case me.DT_INT64:case me.DT_INT8:case me.DT_UINT8:return"int32";case me.DT_BOOL:return"bool";case me.DT_DOUBLE:return"float32";case me.DT_STRING:return"string";case me.DT_COMPLEX64:case me.DT_COMPLEX128:return"complex64";default:return null}}function _a(t,e,n){const s=t[e];return s&&s.func?s.func.name:n}function zs(t,e,n){const s=t[e];return s&&s.type?aa(s.type):n}function Vs(t,e,n){const s=t[e];return s&&s.list&&s.list.type?s.list.type.map(r=>aa(r)):n}function sh(t){if(!t.unknownRank)return t.dim!=null?t.dim.map(e=>typeof e.size=="number"?e.size:parseInt(e.size,10)):[]}function js(t,e,n){const s=t[e];return s&&s.shape?sh(s.shape):n}function Ms(t,e,n){const s=t[e];return s?((s.list.f&&s.list.f.length?s.list.f:s.list.i)||[]).map(r=>typeof r=="number"?r:parseInt(r,10)):n}function Ws(t,e,n,s=!1){const r=t[e];return r&&r.list&&r.list.s?r.list.s.map(a=>nh(a,s)):n}function Us(t,e,n){const s=t[e];return s&&s.list&&s.list.shape?s.list.shape.map(r=>sh(r)):n}function Gs(t,e,n){const s=t[e];return s&&s.list&&s.list.b?s.list.b:n}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class dS{constructor(e,n,s){this.node=e,this.tensorMap=n,this.context=s,this.inputs=[],this.attrs={},this.inputs=e.inputNames.map(r=>this.getInput(r)),e.rawAttrs!=null&&(this.attrs=Object.keys(e.rawAttrs).reduce((r,a)=>(r[a]=this.getAttr(a),r),{}))}getInput(e){return ee(e,this.tensorMap,this.context)}getAttr(e,n){const s=this.node.rawAttrs[e];if(s.tensor!=null)return ee(e,this.tensorMap,this.context);if(s.i!=null||s.f!=null)return Ls(this.node.rawAttrs,e,n);if(s.s!=null)return Ps(this.node.rawAttrs,e,n);if(s.b!=null)return Bs(this.node.rawAttrs,e,n);if(s.shape!=null)return js(this.node.rawAttrs,e,n);if(s.type!=null)return zs(this.node.rawAttrs,e,n);if(s.list!=null){if(s.list.i!=null||s.list.f!=null)return Ms(this.node.rawAttrs,e,n);if(s.list.s!=null)return Ws(this.node.rawAttrs,e,n);if(s.list.shape!=null)return Us(this.node.rawAttrs,e,n);if(s.list.b!=null)return Gs(this.node.rawAttrs,e,n);if(s.list.type!=null)return Vs(this.node.rawAttrs,e,n)}return n}}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const te=Object.freeze(Object.defineProperty({__proto__:null,OP_SCOPE_SUFFIX:ar,abs:de,acos:ul,acosh:ll,add:x,addN:cl,all:pl,any:hl,argMax:ml,argMin:fl,asin:dl,asinh:gl,atan:yl,atan2:bl,atanh:wl,avgPool:hr,avgPool3d:$l,basicLSTMCell:El,batchNorm:gn,batchNorm2d:kl,batchNorm3d:_l,batchNorm4d:vl,batchToSpaceND:mr,bincount:fr,bitwiseAnd:Il,booleanMaskAsync:gp,broadcastArgs:Al,broadcastTo:Ht,buffer:xe,cast:q,ceil:xl,clipByValue:Ol,clone:ze,complex:je,concat:se,concat1d:Dl,concat2d:Fl,concat3d:Cl,concat4d:Rl,conv1d:Pl,conv2d:yn,conv2dTranspose:Ll,conv3d:zl,conv3dTranspose:Vl,cos:jl,cosh:Ml,cosineWindow:ns,cumprod:Wl,cumsum:Ul,denseBincount:Gl,depthToSpace:ql,depthwiseConv2d:Kn,diag:Kl,dilation2d:Hl,div:G,divNoNan:Jl,dot:Yl,dropout:Sp,einsum:ut,elu:yr,enclosingPowerOfTwo:qr,ensureShape:Zl,equal:gr,erf:Ql,euclideanNorm:nc,exp:et,expandDims:Re,expm1:sc,eye:wr,fft:Zn,fill:Vt,floor:Nr,floorDiv:cr,fused:$p,gather:Sr,gatherND:Np,greater:Nn,greaterEqual:Tr,ifft:un,imag:Sn,image:Op,inTopKAsync:Tp,irfft:Vr,isFinite:rc,isInf:ac,isNaN:oc,leakyRelu:$r,less:zn,lessEqual:Hn,linalg:Dp,linspace:ic,localResponseNormalization:uc,log:Rt,log1p:Er,logSigmoid:cc,logSoftmax:pc,logSumExp:_r,logicalAnd:rn,logicalNot:vr,logicalOr:Ir,logicalXor:hc,losses:Fp,lowerBound:mc,matMul:z,max:mt,maxPool:Ar,maxPool3d:fc,maxPoolWithArgmax:dc,maximum:xr,mean:an,meshgrid:gc,min:Ln,minimum:on,mirrorPad:yc,mod:bc,moments:wc,movingAverage:yp,mul:_,multiRNNCell:Nc,multinomial:Sc,neg:ke,norm:wn,notEqual:Or,oneHot:Vn,ones:He,onesLike:Tc,op:y,outerProduct:$c,pad:jt,pad1d:Ec,pad2d:kc,pad3d:_c,pad4d:vc,pool:Ic,pow:Ct,prelu:Fr,print:lr,prod:Ac,raggedGather:xc,raggedRange:Oc,raggedTensorToTensor:Dc,rand:Fc,randomGamma:Pc,randomNormal:Br,randomStandardNormal:Bc,randomUniform:Yn,randomUniformInt:Lc,range:Pt,real:Bt,reciprocal:zc,relu:Tn,relu6:Lr,reshape:$,reverse:tt,reverse1d:Vc,reverse2d:jc,reverse3d:Mc,reverse4d:Wc,rfft:Qn,round:zr,rsqrt:Uc,scalar:R,scatterND:bp,searchSorted:Jn,selu:Gc,separableConv2d:qc,setdiff1dAsync:Kc,sigmoid:ht,sign:Hc,signal:xp,sin:Xc,sinh:Jc,slice:M,slice1d:Yc,slice2d:Zc,slice3d:Qc,slice4d:ep,softmax:tp,softplus:kr,spaceToBatchND:Dr,sparse:Cp,sparseToDense:wp,spectral:Ap,split:Lt,sqrt:Oe,square:Ne,squaredDifference:jr,squeeze:es,stack:Fe,step:Mr,stridedSlice:np,string:Rp,sub:F,sum:U,tan:sp,tanh:Bn,tensor:Ee,tensor1d:be,tensor2d:xt,tensor3d:Wr,tensor4d:rp,tensor5d:ap,tensor6d:op,tensorScatterUpdate:up,tile:At,topk:lp,transpose:ln,truncatedNormal:cp,unique:pp,unsortedSegmentSum:hp,unstack:st,upperBound:mp,variable:fp,where:Ve,whereAsync:Gr,zeros:bt,zerosLike:ge},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const gS=(t,e,n,s=te)=>{switch(t.op){case"BiasAdd":case"AddV2":case"Add":return[s.add(c("a",t,e,n),c("b",t,e,n))];case"AddN":return[s.addN(c("tensors",t,e,n))];case"FloorMod":case"Mod":return[s.mod(c("a",t,e,n),c("b",t,e,n))];case"Mul":return[s.mul(c("a",t,e,n),c("b",t,e,n))];case"RealDiv":case"Div":return[s.div(c("a",t,e,n),c("b",t,e,n))];case"DivNoNan":return[s.divNoNan(c("a",t,e,n),c("b",t,e,n))];case"FloorDiv":return[s.floorDiv(c("a",t,e,n),c("b",t,e,n))];case"Sub":return[s.sub(c("a",t,e,n),c("b",t,e,n))];case"Minimum":return[s.minimum(c("a",t,e,n),c("b",t,e,n))];case"Maximum":return[s.maximum(c("a",t,e,n),c("b",t,e,n))];case"Pow":return[s.pow(c("a",t,e,n),c("b",t,e,n))];case"SquaredDifference":return[s.squaredDifference(c("a",t,e,n),c("b",t,e,n))];default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const yS=(t,e,n,s=te)=>{switch(t.op){case"Abs":case"ComplexAbs":return[s.abs(c("x",t,e,n))];case"Acos":return[s.acos(c("x",t,e,n))];case"Acosh":return[s.acosh(c("x",t,e,n))];case"Asin":return[s.asin(c("x",t,e,n))];case"Asinh":return[s.asinh(c("x",t,e,n))];case"Atan":return[s.atan(c("x",t,e,n))];case"Atan2":return[s.atan2(c("x",t,e,n),c("y",t,e,n))];case"Atanh":return[s.atanh(c("x",t,e,n))];case"Ceil":return[s.ceil(c("x",t,e,n))];case"Complex":return[s.complex(c("real",t,e,n),c("imag",t,e,n))];case"Cos":return[s.cos(c("x",t,e,n))];case"Cosh":return[s.cosh(c("x",t,e,n))];case"Elu":return[s.elu(c("x",t,e,n))];case"Erf":return[s.erf(c("x",t,e,n))];case"Exp":return[s.exp(c("x",t,e,n))];case"Expm1":return[s.expm1(c("x",t,e,n))];case"Floor":return[s.floor(c("x",t,e,n))];case"Log":return[s.log(c("x",t,e,n))];case"Log1p":return[s.log1p(c("x",t,e,n))];case"Imag":return[s.imag(c("x",t,e,n))];case"Neg":return[s.neg(c("x",t,e,n))];case"Reciprocal":return[s.reciprocal(c("x",t,e,n))];case"Real":return[s.real(c("x",t,e,n))];case"Relu":return[s.relu(c("x",t,e,n))];case"Round":return[s.round(c("x",t,e,n))];case"Selu":return[s.selu(c("x",t,e,n))];case"Sigmoid":return[s.sigmoid(c("x",t,e,n))];case"Sin":return[s.sin(c("x",t,e,n))];case"Sign":return[s.sign(c("x",t,e,n))];case"Sinh":return[s.sinh(c("x",t,e,n))];case"Softplus":return[s.softplus(c("x",t,e,n))];case"Sqrt":return[s.sqrt(c("x",t,e,n))];case"Square":return[s.square(c("x",t,e,n))];case"Tanh":return[s.tanh(c("x",t,e,n))];case"Tan":return[s.tan(c("x",t,e,n))];case"ClipByValue":return[s.clipByValue(c("x",t,e,n),c("clipValueMin",t,e,n),c("clipValueMax",t,e,n))];case"Relu6":return[s.relu6(c("x",t,e,n))];case"Rsqrt":return[s.rsqrt(ee(t.inputNames[0],e,n))];case"LeakyRelu":return[s.leakyRelu(c("x",t,e,n),c("alpha",t,e,n))];case"Prelu":return[s.prelu(c("x",t,e,n),c("alpha",t,e,n))];case"IsNan":return[s.isNaN(ee(t.inputNames[0],e,n))];case"IsInf":return[s.isInf(ee(t.inputNames[0],e,n))];case"IsFinite":return[s.isFinite(ee(t.inputNames[0],e,n))];default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function we(t,e,n=""){if(!(typeof t=="number"||typeof e=="number")){d(t.length===e.length,()=>n+` Shapes ${t} and ${e} must match`);for(let s=0;s<t.length;s++){const r=t[s],a=e[s];d(r<0||a<0||r===a,()=>n+` Shapes ${t} and ${e} must match`)}}}function va(t){return!(typeof t=="number"||t.some(e=>e<0))}function Ut(t,e,n){let s=qs(t,n);const r=!va(s);if(r&&e.length===0)throw new Error(`Tried to calculate elements of an empty list with non-fully-defined elementShape: ${s}`);if(r&&e.forEach(a=>{s=qs(a.shape,s)}),!va(s))throw new Error(`Non-fully-defined elementShape: ${s}`);return s}function qs(t,e){if(typeof t=="number")return e;if(typeof e=="number")return t;if(t.length!==e.length)throw new Error(`Incompatible ranks during merge: ${t} vs. ${e}`);const n=[];for(let s=0;s<t.length;++s){const r=t[s],a=e[s];if(r>=0&&a>=0&&r!==a)throw new Error(`Incompatible shape during merge: ${t} vs. ${e}`);n[s]=r>=0?r:a}return n}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class bS{constructor(e,n,s,r,a,o,i){this.name=e,this.dtype=n,this.maxSize=s,this.elementShape=r,this.identicalElementShapes=a,this.dynamicSize=o,this.clearAfterRead=i,this.tensors=[],this.closed_=!1,this.idTensor=R(0),$e(this.idTensor)}get id(){return this.idTensor.id}get closed(){return this.closed_}clearAndClose(e){this.tensors.forEach(n=>{(e==null||!e.has(n.tensor.id))&&n.tensor.dispose()}),this.tensors=[],this.closed_=!0,this.idTensor.dispose()}size(){return this.tensors.length}read(e){if(this.closed_)throw new Error(`TensorArray ${this.name} has already been closed.`);if(e<0||e>=this.size())throw new Error(`Tried to read from index ${e}, but array size is: ${this.size()}`);const n=this.tensors[e];if(n.cleared)throw new Error(`TensorArray ${this.name}: Could not read index ${e} twice because it was cleared after a previous read (perhaps try setting clear_after_read = false?).`);return this.clearAfterRead&&(n.cleared=!0),n.read=!0,n.tensor}readMany(e){return e.map(n=>this.read(n))}write(e,n){if(this.closed_)throw new Error(`TensorArray ${this.name} has already been closed.`);if(e<0||!this.dynamicSize&&e>=this.maxSize)throw new Error(`Tried to write to index ${e}, but array is not resizeable and size is: ${this.maxSize}`);const s=this.tensors[e]||{};if(n.dtype!==this.dtype)throw new Error(`TensorArray ${this.name}: Could not write to TensorArray index ${e},
          because the value dtype is ${n.dtype}, but TensorArray dtype is ${this.dtype}.`);if(this.size()===0&&(this.elementShape==null||this.elementShape.length===0)&&(this.elementShape=n.shape),we(this.elementShape,n.shape,`TensorArray ${this.name}: Could not write to TensorArray index ${e}.`),s.read)throw new Error(`TensorArray ${this.name}: Could not write to TensorArray index ${e}, because it has already been read.`);if(s.written)throw new Error(`TensorArray ${this.name}: Could not write to TensorArray index ${e}, because it has already been written.`);s.tensor=n,$e(n),s.written=!0,this.tensors[e]=s}writeMany(e,n){if(e.length!==n.length)throw new Error(`TensorArray ${this.name}: could not write multiple tensors,because the index size: ${e.length} is not the same as tensors size: ${n.length}.`);e.forEach((s,r)=>this.write(s,n[r]))}gather(e,n){if(n&&n!==this.dtype)throw new Error(`TensorArray dtype is ${this.dtype} but gather requested dtype ${n}`);if(e)e=e.slice(0,this.size());else{e=[];for(let r=0;r<this.size();r++)e.push(r)}if(e.length===0)return Ee([],[0].concat(this.elementShape));const s=this.readMany(e);return we(this.elementShape,s[0].shape,"TensorArray shape mismatch: "),Fe(s,0)}concat(e){if(e&&e!==this.dtype)throw new Error(`TensorArray dtype is ${this.dtype} but concat requested dtype ${e}`);if(this.size()===0)return Ee([],[0].concat(this.elementShape));const n=[];for(let r=0;r<this.size();r++)n.push(r);const s=this.readMany(n);return we(this.elementShape,s[0].shape,`TensorArray shape mismatch: tensor array shape (${this.elementShape}) vs first tensor shape (${s[0].shape})`),se(s,0)}scatter(e,n){if(n.dtype!==this.dtype)throw new Error(`TensorArray dtype is ${this.dtype} but tensor has dtype ${n.dtype}`);if(e.length!==n.shape[0])throw new Error(`Expected len(indices) == tensor.shape[0], but saw: ${e.length} vs. ${n.shape[0]}`);const s=Math.max(...e);if(!this.dynamicSize&&s>=this.maxSize)throw new Error(`Max index must be < array size (${s}  vs. ${this.maxSize})`);this.writeMany(e,st(n,0))}split(e,n){if(n.dtype!==this.dtype)throw new Error(`TensorArray dtype is ${this.dtype} but tensor has dtype ${n.dtype}`);let s=0;const r=e.map(u=>(s+=u,s));if(s!==n.shape[0])throw new Error(`Expected sum of lengths to be equal to
          tensor.shape[0], but sum of lengths is
        ${s}, and tensor's shape is: ${n.shape}`);if(!this.dynamicSize&&e.length!==this.maxSize)throw new Error(`TensorArray's size is not equal to the size of lengths (${this.maxSize} vs. ${e.length}), and the TensorArray is not marked as dynamically resizeable`);const a=s===0?0:n.size/s,o=[];V(()=>{n=$(n,[1,s,a]);for(let u=0;u<e.length;++u){const h=[0,u===0?0:r[u-1],0],p=[1,e[u],a];o[u]=$(M(n,h,p),this.elementShape)}return o});const i=[];for(let u=0;u<e.length;u++)i[u]=u;this.writeMany(i,o)}}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Nt{get id(){return this.idTensor.id}constructor(e,n,s,r=-1){this.tensors=e,this.elementShape=n,this.elementDtype=s,e?.forEach(a=>{if(s!==a.dtype)throw new Error(`Invalid data types; op elements ${s}, but list elements ${a.dtype}`);we(n,a.shape,"TensorList shape mismatch: "),$e(a)}),this.idTensor=R(0),this.maxNumElements=r,$e(this.idTensor)}copy(){return new Nt([...this.tensors],this.elementShape,this.elementDtype)}clearAndClose(e){this.tensors.forEach(n=>{(e==null||!e.has(n.id))&&n.dispose()}),this.tensors.length=0,this.idTensor.dispose()}size(){return this.tensors.length}stack(e,n,s=-1){if(n!==this.elementDtype)throw new Error(`Invalid data types; op elements ${n}, but list elements ${this.elementDtype}`);if(s!==-1&&this.tensors.length!==s)throw new Error(`Operation expected a list with ${s} elements but got a list with ${this.tensors.length} elements.`);we(e,this.elementShape,"TensorList shape mismatch: ");const r=Ut(this.elementShape,this.tensors,e);return V(()=>{const a=this.tensors.map(o=>$(o,r));return Fe(a,0)})}popBack(e,n){if(n!==this.elementDtype)throw new Error(`Invalid data types; op elements ${n}, but list elements ${this.elementDtype}`);if(this.size()===0)throw new Error("Trying to pop from an empty list.");const s=Ut(this.elementShape,this.tensors,e),r=this.tensors.pop();return r.kept=!1,we(r.shape,e,"TensorList shape mismatch: "),$(r,s)}pushBack(e){if(e.dtype!==this.elementDtype)throw new Error(`Invalid data types; op elements ${e.dtype}, but list elements ${this.elementDtype}`);if(we(e.shape,this.elementShape,"TensorList shape mismatch: "),this.maxNumElements===this.size())throw new Error("Trying to push element into a full list.");$e(e),this.tensors.push(e)}resize(e){if(e<0)throw new Error(`TensorListResize expects size to be non-negative. Got: ${e}`);if(this.maxNumElements!==-1&&e>this.maxNumElements)throw new Error(`TensorListResize input size ${e} is greater maxNumElement ${this.maxNumElements}.`);const n=new Nt([],this.elementShape,this.elementDtype,this.maxNumElements);n.tensors.length=e;for(let s=0;s<Math.min(this.tensors.length,e);++s)n.tensors[s]=this.tensors[s];return n}getItem(e,n,s){if(s!==this.elementDtype)throw new Error(`Invalid data types; op elements ${s}, but list elements ${this.elementDtype}`);if(e<0||e>this.tensors.length)throw new Error(`Trying to access element ${e} in a list with ${this.tensors.length} elements.`);if(this.tensors[e]==null)throw new Error(`element at index ${e} is null.`);we(this.tensors[e].shape,n,"TensorList shape mismatch: ");const r=Ut(this.elementShape,this.tensors,n);return $(this.tensors[e],r)}setItem(e,n){if(n.dtype!==this.elementDtype)throw new Error(`Invalid data types; op elements ${n.dtype}, but list elements ${this.elementDtype}`);if(e<0||this.maxNumElements!==-1&&e>=this.maxNumElements)throw new Error(`Trying to set element ${e} in a list with max ${this.maxNumElements} elements.`);we(this.elementShape,n.shape,"TensorList shape mismatch: "),$e(n),this.tensors[e]!=null&&(this.tensors[e].kept=!1),this.tensors[e]=n}gather(e,n,s){if(n!==this.elementDtype)throw new Error(`Invalid data types; op elements ${n}, but list elements ${this.elementDtype}`);we(this.elementShape,s,"TensorList shape mismatch: "),e=e.slice(0,this.size());const r=Ut(this.elementShape,this.tensors,s);return e.length===0?Ee([],[0].concat(r)):V(()=>{const a=e.map(o=>$(this.tensors[o],r));return Fe(a,0)})}concat(e,n){if(e&&e!==this.elementDtype)throw new Error(`TensorList dtype is ${this.elementDtype} but concat requested dtype ${e}`);we(this.elementShape,n,"TensorList shape mismatch: ");const s=Ut(this.elementShape,this.tensors,n);return this.size()===0?Ee([],[0].concat(s)):V(()=>{const r=this.tensors.map(a=>$(a,s));return se(r,0)})}}function wS(t,e,n){const s=t.dtype;if(t.shape.length<1)throw new Error(`Tensor must be at least a vector, but saw shape: ${t.shape}`);if(t.dtype!==n)throw new Error(`Invalid data types; op elements ${t.dtype}, but list elements ${n}`);const r=t.shape.slice(1);we(r,e,"TensorList shape mismatch: ");const a=st(t);return new Nt(a,e,s)}function NS(t,e,n,s){return new Nt([],t,e,s)}function SS(t,e,n,s){if(e.length!==t.shape[0])throw new Error(`Expected len(indices) == tensor.shape[0], but saw: ${e.length} vs. ${t.shape[0]}`);const r=Math.max(...e);if(s!=null&&s!==-1&&r>=s)throw new Error(`Max index must be < array size (${r}  vs. ${s})`);const a=new Nt([],n,t.dtype,s),o=st(t,0);return e.forEach((i,u)=>{a.setItem(i,o[u])}),a}function TS(t,e,n){let s=0;const r=e.map(h=>(s+=h,s));if(s!==t.shape[0])throw new Error(`Expected sum of lengths to be equal to
          tensor.shape[0], but sum of lengths is
        ${s}, and tensor's shape is: ${t.shape}`);const a=t.shape.slice(1),o=qs(a,n),i=s===0?0:t.size/s,u=V(()=>{const h=[];t=$(t,[1,s,i]);for(let p=0;p<e.length;++p){const g=[0,p===0?0:r[p-1],0],N=[1,e[p],i];h[p]=$(M(t,g,N),o)}return t.dispose(),h}),l=new Nt([],n,t.dtype,e.length);for(let h=0;h<u.length;h++)l.setItem(h,u[h]);return l}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const $S=async(t,e,n)=>{switch(t.op){case"If":case"StatelessIf":{const s=c("thenBranch",t,e,n),r=c("elseBranch",t,e,n),a=c("cond",t,e,n),o=c("args",t,e,n);return(await a.data())[0]?n.functionMap[s].executeFunctionAsync(o,n.tensorArrayMap,n.tensorListMap):n.functionMap[r].executeFunctionAsync(o,n.tensorArrayMap,n.tensorListMap)}case"While":case"StatelessWhile":{const s=c("body",t,e,n),r=c("cond",t,e,n),a=c("args",t,e,n),o=await n.functionMap[r].executeFunctionAsync(a,n.tensorArrayMap,n.tensorListMap),i=a.map(h=>h.id);let u=await o[0].data();o.forEach(h=>{!h.kept&&i.indexOf(h.id)===-1&&h.dispose()});let l=a;for(;u[0];){const h=l;l=await n.functionMap[s].executeFunctionAsync(l,n.tensorArrayMap,n.tensorListMap);const p=l.map(g=>g.id);h.forEach(g=>{!g.kept&&i.indexOf(g.id)===-1&&p.indexOf(g.id)===-1&&g.dispose()});const m=await n.functionMap[r].executeFunctionAsync(l,n.tensorArrayMap,n.tensorListMap);u=await m[0].data(),m.forEach(g=>{!g.kept&&i.indexOf(g.id)===-1&&p.indexOf(g.id)===-1&&g.dispose()})}return l}case"LoopCond":{const s=c("pred",t,e,n);return[Be(s)]}case"Switch":{const s=c("pred",t,e,n);let r=c("data",t,e,n);return r.kept||(r=Be(r)),(await s.data())[0]?[void 0,r]:[r,void 0]}case"Merge":{const s=t.inputNames.find(r=>ee(r,e,n)!==void 0);if(s){const r=ee(s,e,n);return[Be(r)]}return}case"Enter":{const s=c("frameName",t,e,n),r=c("tensor",t,e,n);return n.enterFrame(s),[Be(r)]}case"Exit":{const s=c("tensor",t,e,n);return n.exitFrame(),[Be(s)]}case"NextIteration":{const s=c("tensor",t,e,n);return n.nextIteration(),[Be(s)]}case"TensorArrayV3":{const s=c("size",t,e,n),r=c("dtype",t,e,n),a=c("elementShape",t,e,n),o=c("dynamicSize",t,e,n),i=c("clearAfterRead",t,e,n),u=c("identicalElementShapes",t,e,n),l=c("name",t,e,n),h=new bS(l,r,s,a,u,o,i);return n.addTensorArray(h),[h.idTensor,R(1)]}case"TensorArrayWriteV3":{const s=c("tensorArrayId",t,e,n),r=c("index",t,e,n),a=c("tensor",t,e,n),o=n.getTensorArray(s.id);return o.write(r,a),[o.idTensor]}case"TensorArrayReadV3":{const s=c("tensorArrayId",t,e,n),r=c("index",t,e,n);return[n.getTensorArray(s.id).read(r)]}case"TensorArrayGatherV3":{const s=c("tensorArrayId",t,e,n),r=c("indices",t,e,n),a=c("dtype",t,e,n);return[n.getTensorArray(s.id).gather(r,a)]}case"TensorArrayScatterV3":{const s=c("tensorArrayId",t,e,n),r=c("indices",t,e,n),a=c("tensor",t,e,n),o=n.getTensorArray(s.id);return o.scatter(r,a),[o.idTensor]}case"TensorArrayConcatV3":{const s=c("tensorArrayId",t,e,n),r=n.getTensorArray(s.id),a=c("dtype",t,e,n);return[r.concat(a)]}case"TensorArraySplitV3":{const s=c("tensorArrayId",t,e,n),r=c("tensor",t,e,n),a=c("lengths",t,e,n),o=n.getTensorArray(s.id);return o.split(a,r),[o.idTensor]}case"TensorArraySizeV3":{const s=c("tensorArrayId",t,e,n),r=n.getTensorArray(s.id);return[R(r.size(),"int32")]}case"TensorArrayCloseV3":{const s=c("tensorArrayId",t,e,n),r=n.getTensorArray(s.id);return r.clearAndClose(),[r.idTensor]}case"TensorListSetItem":{const s=c("tensorListId",t,e,n),r=c("index",t,e,n),a=c("tensor",t,e,n),o=n.getTensorList(s.id);return o.setItem(r,a),[o.idTensor]}case"TensorListGetItem":{const s=c("tensorListId",t,e,n),r=c("index",t,e,n),a=c("elementShape",t,e,n),o=c("elementDType",t,e,n);return[n.getTensorList(s.id).getItem(r,a,o)]}case"TensorListScatterV2":case"TensorListScatter":{const s=c("indices",t,e,n),r=c("tensor",t,e,n),a=c("elementShape",t,e,n),o=c("numElements",t,e,n),i=SS(r,s,a,o);return n.addTensorList(i),[i.idTensor]}case"TensorListReserve":case"EmptyTensorList":{const s=c("elementShape",t,e,n),r=c("elementDType",t,e,n);let a;t.op==="TensorListReserve"?a="numElements":a="maxNumElements";const o=c(a,t,e,n),i=t.op==="TensorListReserve"?-1:o,u=NS(s,r,o,i);return n.addTensorList(u),[u.idTensor]}case"TensorListGather":{const s=c("tensorListId",t,e,n),r=c("indices",t,e,n),a=c("elementShape",t,e,n),o=c("elementDType",t,e,n);return[n.getTensorList(s.id).gather(r,o,a)]}case"TensorListStack":{const s=c("tensorListId",t,e,n),r=c("elementShape",t,e,n),a=c("elementDType",t,e,n),o=c("numElements",t,e,n);return[n.getTensorList(s.id).stack(r,a,o)]}case"TensorListFromTensor":{const s=c("tensor",t,e,n),r=c("elementShape",t,e,n),a=c("elementDType",t,e,n),o=wS(s,r,a);return n.addTensorList(o),[o.idTensor]}case"TensorListConcat":case"TensorListConcatV2":{const s=c("tensorListId",t,e,n),r=n.getTensorList(s.id),a=c("dtype",t,e,n),o=c("elementShape",t,e,n);return[r.concat(a,o)]}case"TensorListPushBack":{const s=c("tensorListId",t,e,n),r=c("tensor",t,e,n),a=n.getTensorList(s.id);return a.pushBack(r),[a.idTensor]}case"TensorListPopBack":{const s=c("tensorListId",t,e,n),r=c("elementShape",t,e,n),a=c("elementDType",t,e,n);return[n.getTensorList(s.id).popBack(r,a)]}case"TensorListSplit":{const s=c("tensor",t,e,n),r=c("elementShape",t,e,n),a=c("lengths",t,e,n),o=TS(s,a,r);return n.addTensorList(o),[o.idTensor]}case"TensorListLength":{const s=c("tensorListId",t,e,n),r=n.getTensorList(s.id);return[R(r.size(),"int32")]}case"TensorListResize":{const s=c("tensorListId",t,e,n),r=c("size",t,e,n),o=n.getTensorList(s.id).resize(r);return n.addTensorList(o),[o.idTensor]}default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ia(t,e,n){const[s,r]=c("fusedOps",t,e,n),a=s==="biasadd",o=!a,i=r==="prelu",u=s==="fusedbatchnorm",l=c("numArgs",t,e,n);if(a){if(i&&l!==2)throw new Error("FusedConv2d and DepthwiseConv2d with BiasAdd and Prelu must have two extra arguments: bias and alpha.");if(!i&&a&&l!==1)throw new Error("FusedConv2d and DepthwiseConv2d with BiasAdd must have one extra argument: bias.")}if(u)throw new Error("FusedConv2d and DepthwiseConv2d with FusedBatchNorm is not supported");const h=c("strides",t,e,n),p=An(t,e,n),m=c("dataFormat",t,e,n).toUpperCase(),g=c("dilations",t,e,n);let[N,S]=c("args",t,e,n);o&&(S=N,N=void 0);const w=c("leakyreluAlpha",t,e,n);return{stride:h,pad:p,dataFormat:m,dilations:g,biasArg:N,preluArg:S,activationFunc:r,leakyreluAlpha:w}}const ES=(t,e,n,s=te)=>{switch(t.op){case"Conv1D":{const r=c("stride",t,e,n),a=c("pad",t,e,n),o=c("dataFormat",t,e,n).toUpperCase(),i=c("dilation",t,e,n);return[s.conv1d(c("x",t,e,n),c("filter",t,e,n),r,a,o,i)]}case"Conv2D":{const r=c("strides",t,e,n),a=An(t,e,n),o=c("dataFormat",t,e,n).toUpperCase(),i=c("dilations",t,e,n);return[s.conv2d(c("x",t,e,n),c("filter",t,e,n),[r[1],r[2]],a,o,[i[1],i[2]])]}case"_FusedConv2D":{const{stride:r,pad:a,dataFormat:o,dilations:i,biasArg:u,preluArg:l,activationFunc:h,leakyreluAlpha:p}=Ia(t,e,n);return[s.fused.conv2d({x:c("x",t,e,n),filter:c("filter",t,e,n),strides:[r[1],r[2]],pad:a,dataFormat:o,dilations:[i[1],i[2]],bias:u,activation:h,preluActivationWeights:l,leakyreluAlpha:p})]}case"FusedDepthwiseConv2dNative":{const{stride:r,pad:a,dataFormat:o,dilations:i,biasArg:u,preluArg:l,activationFunc:h,leakyreluAlpha:p}=Ia(t,e,n);return[s.fused.depthwiseConv2d({x:c("x",t,e,n),filter:c("filter",t,e,n),strides:[r[1],r[2]],pad:a,dataFormat:o,dilations:[i[1],i[2]],bias:u,activation:h,preluActivationWeights:l,leakyreluAlpha:p})]}case"Conv2DBackpropInput":case"Conv2dTranspose":{const r=c("outputShape",t,e,n),a=c("strides",t,e,n),o=An(t,e,n);return[s.conv2dTranspose(c("x",t,e,n),c("filter",t,e,n),r,[a[1],a[2]],o)]}case"DepthwiseConv2dNative":case"DepthwiseConv2d":{const r=c("strides",t,e,n),a=An(t,e,n),o=c("dilations",t,e,n),i=c("dataFormat",t,e,n).toUpperCase();return[s.depthwiseConv2d(c("input",t,e,n),c("filter",t,e,n),[r[1],r[2]],a,i,[o[1],o[2]])]}case"Conv3D":{const r=c("strides",t,e,n),a=c("pad",t,e,n),o=c("dataFormat",t,e,n).toUpperCase(),i=c("dilations",t,e,n);return[s.conv3d(c("x",t,e,n),c("filter",t,e,n),[r[1],r[2],r[3]],a,o,[i[1],i[2],i[3]])]}case"AvgPool":{const r=c("strides",t,e,n),a=c("pad",t,e,n),o=c("kernelSize",t,e,n);return[s.avgPool(c("x",t,e,n),[o[1],o[2]],[r[1],r[2]],a)]}case"MaxPool":{const r=c("strides",t,e,n),a=c("pad",t,e,n),o=c("kernelSize",t,e,n);return[s.maxPool(c("x",t,e,n),[o[1],o[2]],[r[1],r[2]],a)]}case"MaxPoolWithArgmax":{const r=c("strides",t,e,n),a=c("pad",t,e,n),o=c("kernelSize",t,e,n),i=c("includeBatchInIndex",t,e,n),{result:u,indexes:l}=s.maxPoolWithArgmax(c("x",t,e,n),[o[1],o[2]],[r[1],r[2]],a,i);return[u,l]}case"AvgPool3D":{const r=c("strides",t,e,n),a=c("pad",t,e,n),o=c("kernelSize",t,e,n);return[s.avgPool3d(c("x",t,e,n),[o[1],o[2],o[3]],[r[1],r[2],r[3]],a)]}case"MaxPool3D":{const r=c("strides",t,e,n),a=c("pad",t,e,n),o=c("kernelSize",t,e,n);return[s.maxPool3d(c("x",t,e,n),[o[1],o[2],o[3]],[r[1],r[2],r[3]],a)]}case"Dilation2D":{const r=c("strides",t,e,n),a=c("pad",t,e,n),o=c("dilations",t,e,n),i=r[1],u=r[2],l=o[1],h=o[2];return[s.dilation2d(c("x",t,e,n),c("filter",t,e,n),[i,u],a,[l,h],"NHWC")]}default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const kS=(t,e,n,s=te)=>{switch(t.op){case"Fill":{const r=c("shape",t,e,n),a=c("dtype",t,e,n),o=c("value",t,e,n);return[s.fill(r,o,a)]}case"LinSpace":{const r=c("start",t,e,n),a=c("stop",t,e,n),o=c("num",t,e,n);return[s.linspace(r,a,o)]}case"Multinomial":{const r=c("logits",t,e,n),a=c("numSamples",t,e,n),o=c("seed",t,e,n);return[s.multinomial(r,a,o)]}case"OneHot":{const r=c("indices",t,e,n),a=c("depth",t,e,n),o=c("onValue",t,e,n),i=c("offValue",t,e,n),u=c("dtype",t,e,n);return[s.oneHot(r,a,o,i,u)]}case"Ones":return[s.ones(c("shape",t,e,n),c("dtype",t,e,n))];case"OnesLike":return[s.onesLike(c("x",t,e,n))];case"RandomStandardNormal":return[s.randomStandardNormal(c("shape",t,e,n),c("dtype",t,e,n),c("seed",t,e,n))];case"RandomUniform":return[s.randomUniform(c("shape",t,e,n),c("minval",t,e,n),c("maxval",t,e,n),c("dtype",t,e,n))];case"RandomUniformInt":return[s.randomUniformInt(c("shape",t,e,n),c("minval",t,e,n),c("maxval",t,e,n),c("seed",t,e,n))];case"Range":{const r=c("start",t,e,n),a=c("stop",t,e,n),o=c("step",t,e,n);return[s.range(r,a,o,c("dtype",t,e,n))]}case"TruncatedNormal":{const r=c("shape",t,e,n),a=c("mean",t,e,n),o=c("stdDev",t,e,n),i=c("seed",t,e,n);return[s.truncatedNormal(r,a,o,c("dtype",t,e,n),i)]}case"Zeros":return[s.zeros(c("shape",t,e,n),c("dtype",t,e,n))];case"ZerosLike":return[s.zerosLike(c("x",t,e,n))];default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function fs(t,e,n){const s=c("boxes",t,e,n),r=c("scores",t,e,n),a=c("maxOutputSize",t,e,n),o=c("iouThreshold",t,e,n),i=c("scoreThreshold",t,e,n),u=c("softNmsSigma",t,e,n);return{boxes:s,scores:r,maxOutputSize:a,iouThreshold:o,scoreThreshold:i,softNmsSigma:u}}const _S=async(t,e,n,s,r=te)=>{switch(t.op){case"NonMaxSuppressionV5":{const{boxes:a,scores:o,maxOutputSize:i,iouThreshold:u,scoreThreshold:l,softNmsSigma:h}=fs(t,e,n),p=await r.image.nonMaxSuppressionWithScoreAsync(a,o,i,u,l,h);return[p.selectedIndices,p.selectedScores]}case"NonMaxSuppressionV4":{const{boxes:a,scores:o,maxOutputSize:i,iouThreshold:u,scoreThreshold:l}=fs(t,e,n),h=c("padToMaxOutputSize",t,e,n),p=await r.image.nonMaxSuppressionPaddedAsync(a,o,i,u,l,h);return[p.selectedIndices,p.validOutputs]}case"NonMaxSuppressionV3":case"NonMaxSuppressionV2":{const{boxes:a,scores:o,maxOutputSize:i,iouThreshold:u,scoreThreshold:l}=fs(t,e,n);return[await r.image.nonMaxSuppressionAsync(a,o,i,u,l)]}case"Where":{const a=r.cast(c("condition",t,e,n),"bool"),o=[await r.whereAsync(a)];return a.dispose(),o}case"ListDiff":return r.setdiff1dAsync(c("x",t,e,n),c("y",t,e,n));default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const vS=(t,e,n,s=te)=>{switch(t.op){case"LowerBound":{const r=c("sortedSequence",t,e,n),a=c("values",t,e,n);return[s.lowerBound(r,a)]}case"TopKV2":{const r=c("x",t,e,n),a=c("k",t,e,n),o=c("sorted",t,e,n),i=s.topk(r,a,o);return[i.values,i.indices]}case"UpperBound":{const r=c("sortedSequence",t,e,n),a=c("values",t,e,n);return[s.upperBound(r,a)]}case"Unique":{const r=c("x",t,e,n),a=s.unique(r);return[a.values,a.indices]}case"UniqueV2":{const r=c("x",t,e,n),a=c("axis",t,e,n),o=s.unique(r,a);return[o.values,o.indices]}default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const IS=(t,e,n,s=te)=>{switch(t.op){case"Const":return e[t.name];case"PlaceholderWithDefault":const r=c("default",t,e,n);return[ee(t.name,e,n)||r];case"Placeholder":return[ee(t.name,e,n)];case"Identity":case"StopGradient":case"FakeQuantWithMinMaxVars":{const h=c("x",t,e,n);return[Be(h)]}case"IdentityN":return c("x",t,e,n).map(h=>Be(h));case"Snapshot":const a=c("x",t,e,n);return[Be(a)];case"Shape":return[s.tensor1d(c("x",t,e,n).shape,"int32")];case"ShapeN":return c("x",t,e,n).map(h=>s.tensor1d(h.shape));case"Size":return[s.scalar(c("x",t,e,n).size,"int32")];case"Rank":return[s.scalar(c("x",t,e,n).rank,"int32")];case"NoOp":return[s.scalar(1)];case"Print":const o=c("x",t,e,n),i=c("data",t,e,n),u=c("message",t,e,n),l=c("summarize",t,e,n);console.warn("The graph has a tf.print() operation,usually used for debugging, which slows down performance."),console.log(u);for(let h=0;h<i.length;h++)console.log(Array.prototype.slice.call(i[h].dataSync()).slice(0,l));return[o];default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class AS{get id(){return this.handle.id}constructor(e,n){this.keyDType=e,this.valueDType=n,this.handle=R(0),this.tensorMap=new Map,$e(this.handle)}clearAndClose(){this.tensorMap.forEach(e=>e.dispose()),this.tensorMap.clear(),this.handle.dispose()}size(){return this.tensorMap.size}tensorSize(){return R(this.size(),"int32")}async import(e,n){this.checkKeyAndValueTensor(e,n);const s=await e.data();return this.tensorMap.forEach(r=>r.dispose()),this.tensorMap.clear(),V(()=>{const r=st(n),a=s.length,o=r.length;d(a===o,()=>`The number of elements doesn't match, keys has ${a} elements, the values has ${o} elements.`);for(let i=0;i<a;i++){const u=s[i],l=r[i];$e(l),this.tensorMap.set(u,l)}return this.handle})}async find(e,n){this.checkKeyAndValueTensor(e,n);const s=await e.data();return V(()=>{const r=[];for(let a=0;a<s.length;a++){const o=s[a],i=this.findWithDefault(o,n);r.push(i)}return Fe(r)})}findWithDefault(e,n){const s=this.tensorMap.get(e);return s??n}checkKeyAndValueTensor(e,n){if(e.dtype!==this.keyDType)throw new Error(`Expect key dtype ${this.keyDType}, but got ${e.dtype}`);if(n.dtype!==this.valueDType)throw new Error(`Expect value dtype ${this.valueDType}, but got ${n.dtype}`)}}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const xS=async(t,e,n,s)=>{switch(t.op){case"HashTable":case"HashTableV2":{const r=s.getHashTableHandleByName(t.name);if(r!=null)return[r];{const a=c("keyDType",t,e,n),o=c("valueDType",t,e,n),i=new AS(a,o);return s.addHashTable(t.name,i),[i.handle]}}case"InitializeTable":case"InitializeTableV2":case"LookupTableImport":case"LookupTableImportV2":{const r=c("tableHandle",t,e,n,s),a=c("keys",t,e,n),o=c("values",t,e,n);return[await s.getHashTableById(r.id).import(a,o)]}case"LookupTableFind":case"LookupTableFindV2":{const r=c("tableHandle",t,e,n,s),a=c("keys",t,e,n),o=c("defaultValue",t,e,n);return[await s.getHashTableById(r.id).find(a,o)]}case"LookupTableSize":case"LookupTableSizeV2":{const r=c("tableHandle",t,e,n,s);return[s.getHashTableById(r.id).tensorSize()]}default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const OS=(t,e,n,s=te)=>{switch(t.op){case"ResizeBilinear":{const r=c("images",t,e,n),a=c("size",t,e,n),o=c("alignCorners",t,e,n),i=c("halfPixelCenters",t,e,n);return[s.image.resizeBilinear(r,[a[0],a[1]],o,i)]}case"ResizeNearestNeighbor":{const r=c("images",t,e,n),a=c("size",t,e,n),o=c("alignCorners",t,e,n),i=c("halfPixelCenters",t,e,n);return[s.image.resizeNearestNeighbor(r,[a[0],a[1]],o,i)]}case"CropAndResize":{const r=c("image",t,e,n),a=c("boxes",t,e,n),o=c("boxInd",t,e,n),i=c("cropSize",t,e,n),u=c("method",t,e,n),l=c("extrapolationValue",t,e,n);return[s.image.cropAndResize(r,a,o,i,u,l)]}case"ImageProjectiveTransformV3":{const r=c("images",t,e,n),a=c("transforms",t,e,n),o=c("outputShape",t,e,n),i=c("fillValue",t,e,n),u=c("interpolation",t,e,n),l=c("fillMode",t,e,n);return[s.image.transform(r,a,u.toLowerCase(),l.toLowerCase(),i,o)]}default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const DS=(t,e,n,s=te)=>{switch(t.op){case"Equal":return[s.equal(c("a",t,e,n),c("b",t,e,n))];case"NotEqual":return[s.notEqual(c("a",t,e,n),c("b",t,e,n))];case"Greater":return[s.greater(c("a",t,e,n),c("b",t,e,n))];case"GreaterEqual":return[s.greaterEqual(c("a",t,e,n),c("b",t,e,n))];case"Less":return[s.less(c("a",t,e,n),c("b",t,e,n))];case"LessEqual":return[s.lessEqual(c("a",t,e,n),c("b",t,e,n))];case"LogicalAnd":return[s.logicalAnd(c("a",t,e,n),c("b",t,e,n))];case"LogicalNot":return[s.logicalNot(c("a",t,e,n))];case"LogicalOr":return[s.logicalOr(c("a",t,e,n),c("b",t,e,n))];case"Select":case"SelectV2":return[s.where(c("condition",t,e,n),c("a",t,e,n),c("b",t,e,n))];case"BitwiseAnd":return[s.bitwiseAnd(c("a",t,e,n),c("b",t,e,n))];default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const FS=(t,e,n,s=te)=>{switch(t.op){case"BatchMatMul":case"BatchMatMulV2":case"MatMul":return[s.matMul(c("a",t,e,n),c("b",t,e,n),c("transposeA",t,e,n),c("transposeB",t,e,n))];case"Einsum":return[s.einsum(c("equation",t,e,n),...c("tensors",t,e,n))];case"Transpose":return[s.transpose(c("x",t,e,n),c("perm",t,e,n))];case"_FusedMatMul":const[r,a]=c("fusedOps",t,e,n),o=r==="biasadd",i=a==="prelu",u=c("numArgs",t,e,n),l=c("leakyreluAlpha",t,e,n);if(o){if(i&&u!==2)throw new Error("Fused MatMul with BiasAdd and Prelu must have two extra arguments: bias and alpha.");if(!i&&u!==1)throw new Error("Fused MatMul with BiasAdd must have one extra argument: bias.")}const[h,p]=c("args",t,e,n);return[s.fused.matMul({a:c("a",t,e,n),b:c("b",t,e,n),transposeA:c("transposeA",t,e,n),transposeB:c("transposeB",t,e,n),bias:h,activation:a,preluActivationWeights:p,leakyreluAlpha:l})];case"MatrixBandPart":return[s.linalg.bandPart(c("a",t,e,n),c("numLower",t,e,n),c("numUpper",t,e,n))];default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const CS=(t,e,n,s=te)=>{switch(t.op){case"EuclideanNorm":return[s.euclideanNorm(c("x",t,e,n),c("axis",t,e,n),c("keepDims",t,e,n))];case"FusedBatchNorm":case"FusedBatchNormV2":return[s.batchNorm(c("x",t,e,n),c("mean",t,e,n),c("variance",t,e,n),c("offset",t,e,n),c("scale",t,e,n),c("epsilon",t,e,n))];case"FusedBatchNormV3":return[s.batchNorm(c("x",t,e,n),c("mean",t,e,n),c("variance",t,e,n),c("offset",t,e,n),c("scale",t,e,n),c("epsilon",t,e,n))];case"LRN":return[s.localResponseNormalization(c("x",t,e,n),c("radius",t,e,n),c("bias",t,e,n),c("alpha",t,e,n),c("beta",t,e,n))];case"Softmax":return[s.softmax(c("x",t,e,n))];case"LogSoftmax":return[s.logSoftmax(c("x",t,e,n))];default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const RS=(t,e,n,s=te)=>{switch(t.op){case"RaggedGather":{const{outputNestedSplits:r,outputDenseValues:a}=s.raggedGather(c("paramsNestedSplits",t,e,n),c("paramsDenseValues",t,e,n),c("indices",t,e,n),c("outputRaggedRank",t,e,n));return r.concat(a)}case"RaggedRange":{const{rtNestedSplits:r,rtDenseValues:a}=s.raggedRange(c("starts",t,e,n),c("limits",t,e,n),c("splits",t,e,n));return[r,a]}case"RaggedTensorToTensor":return[s.raggedTensorToTensor(c("shape",t,e,n),c("values",t,e,n),c("defaultValue",t,e,n),c("rowPartitionTensors",t,e,n),c("rowPartitionTypes",t,e,n))];default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const PS=(t,e,n,s=te)=>{switch(t.op){case"Max":{const i=c("axis",t,e,n),u=c("keepDims",t,e,n);return[s.max(c("x",t,e,n),i,u)]}case"Mean":{const i=c("axis",t,e,n),u=c("keepDims",t,e,n);return[s.mean(c("x",t,e,n),i,u)]}case"Min":{const i=c("axis",t,e,n),u=c("keepDims",t,e,n);return[s.min(c("x",t,e,n),i,u)]}case"Sum":{const i=c("axis",t,e,n),u=c("keepDims",t,e,n);return[s.sum(c("x",t,e,n),i,u)]}case"All":{const i=c("axis",t,e,n),u=c("keepDims",t,e,n);return[s.all(c("x",t,e,n),i,u)]}case"Any":{const i=c("axis",t,e,n),u=c("keepDims",t,e,n);return[s.any(c("x",t,e,n),i,u)]}case"ArgMax":{const i=c("axis",t,e,n);return[s.argMax(c("x",t,e,n),i)]}case"ArgMin":{const i=c("axis",t,e,n);return[s.argMin(c("x",t,e,n),i)]}case"Prod":{const i=c("axis",t,e,n),u=c("keepDims",t,e,n);return[s.prod(c("x",t,e,n),i,u)]}case"Cumprod":{const i=c("axis",t,e,n),u=c("exclusive",t,e,n),l=c("reverse",t,e,n);return[s.cumprod(c("x",t,e,n),i,u,l)]}case"Cumsum":{const i=c("axis",t,e,n),u=c("exclusive",t,e,n),l=c("reverse",t,e,n);return[s.cumsum(c("x",t,e,n),i,u,l)]}case"Bincount":const r=c("x",t,e,n),a=c("weights",t,e,n),o=c("size",t,e,n);return[s.bincount(r,a,o)];case"DenseBincount":{const i=c("x",t,e,n),u=c("weights",t,e,n),l=c("size",t,e,n),h=c("binaryOutput",t,e,n);return[s.denseBincount(i,u,l,h)]}default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const BS=(t,e,n,s=te)=>{switch(t.op){case"ConcatV2":case"Concat":{const r=c("n",t,e,n),a=c("axis",t,e,n);let o=c("tensors",t,e,n);return o=o.slice(0,r),[s.concat(o,a)]}case"Gather":{const r=c("x",t,e,n),a=c("indices",t,e,n);return[s.gather(r,s.cast(a,"int32"),0)]}case"GatherV2":{const r=c("axis",t,e,n),a=c("batchDims",t,e,n),o=c("x",t,e,n),i=c("indices",t,e,n);return[s.gather(o,s.cast(i,"int32"),r,a)]}case"Reverse":{const r=c("dims",t,e,n),a=[];for(let i=0;i<r.length;i++)r[i]&&a.push(i);const o=c("x",t,e,n);return[s.reverse(o,a)]}case"ReverseV2":{const r=c("axis",t,e,n),a=c("x",t,e,n);return[s.reverse(a,r)]}case"Slice":{const r=c("begin",t,e,n),a=c("size",t,e,n);return[s.slice(c("x",t,e,n),r,a)]}case"StridedSlice":{const r=c("begin",t,e,n),a=c("end",t,e,n),o=c("strides",t,e,n),i=c("beginMask",t,e,n),u=c("endMask",t,e,n),l=c("ellipsisMask",t,e,n),h=c("newAxisMask",t,e,n),p=c("shrinkAxisMask",t,e,n),m=c("x",t,e,n);return[s.stridedSlice(m,r,a,o,i,u,l,h,p)]}case"Pack":return V(()=>{const r=c("axis",t,e,n),a=c("tensors",t,e,n),o=a[0].shape,i=s.squeeze(a[0]).shape,u=a.map(l=>{const h=_e(l.shape,o);if(!h&&!_e(s.squeeze(l).shape,i))throw new Error("the input tensors shape does not match");return h?l:s.reshape(l,o)});return[s.stack(u,r)]});case"Unpack":{const r=c("axis",t,e,n),a=c("tensor",t,e,n);return s.unstack(a,r)}case"Tile":{const r=c("reps",t,e,n);return[s.tile(c("x",t,e,n),r)]}case"Split":case"SplitV":{const r=c("axis",t,e,n),a=c("numOrSizeSplits",t,e,n),o=c("x",t,e,n);return s.split(o,a,r)}case"ScatterNd":{const r=c("indices",t,e,n),a=c("values",t,e,n),o=c("shape",t,e,n);return[s.scatterND(r,a,o)]}case"GatherNd":{const r=c("x",t,e,n),a=c("indices",t,e,n);return[s.gatherND(r,a)]}case"SparseToDense":{const r=c("sparseIndices",t,e,n),a=c("outputShape",t,e,n),o=c("sparseValues",t,e,n),i=c("defaultValue",t,e,n);return[s.sparseToDense(r,o,a,o.dtype===i.dtype?i:s.cast(i,o.dtype))]}case"TensorScatterUpdate":{const r=c("indices",t,e,n),a=c("values",t,e,n),o=c("tensor",t,e,n);return[s.tensorScatterUpdate(o,r,a)]}default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const LS=(t,e,n,s=te)=>{switch(t.op){case"SparseFillEmptyRows":{const{outputIndices:r,outputValues:a,emptyRowIndicator:o,reverseIndexMap:i}=s.sparse.sparseFillEmptyRows(c("indices",t,e,n),c("values",t,e,n),c("denseShape",t,e,n),c("defaultValue",t,e,n));return[r,a,o,i]}case"SparseReshape":{const{outputIndices:r,outputShape:a}=s.sparse.sparseReshape(c("inputIndices",t,e,n),c("inputShape",t,e,n),c("newShape",t,e,n));return[r,a]}case"SparseSegmentMean":return[s.sparse.sparseSegmentMean(c("data",t,e,n),c("indices",t,e,n),c("segmentIds",t,e,n))];case"SparseSegmentSum":return[s.sparse.sparseSegmentSum(c("data",t,e,n),c("indices",t,e,n),c("segmentIds",t,e,n))];default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const zS=(t,e,n,s=te)=>{switch(t.op){case"FFT":return[s.fft(c("x",t,e,n))];case"IFFT":return[s.ifft(c("x",t,e,n))];case"RFFT":return[s.rfft(c("x",t,e,n))];case"IRFFT":return[s.irfft(c("x",t,e,n))];default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const VS=(t,e,n,s=te)=>{switch(t.op){case"StaticRegexReplace":return[s.string.staticRegexReplace(c("input",t,e,n),c("pattern",t,e,n),c("rewrite",t,e,n),c("replaceGlobal",t,e,n))];case"StringNGrams":{const{nGrams:r,nGramsSplits:a}=s.string.stringNGrams(c("data",t,e,n),c("dataSplits",t,e,n),c("separator",t,e,n),c("nGramWidths",t,e,n),c("leftPad",t,e,n),c("rightPad",t,e,n),c("padWidth",t,e,n),c("preserveShortSequences",t,e,n));return[r,a]}case"StringSplit":{const{indices:r,values:a,shape:o}=s.string.stringSplit(c("input",t,e,n),c("delimiter",t,e,n),c("skipEmpty",t,e,n));return[r,a,o]}case"StringToHashBucketFast":return[s.string.stringToHashBucketFast(c("input",t,e,n),c("numBuckets",t,e,n))];default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const jS=(t,e,n,s=te)=>{switch(t.op){case"Cast":return[s.cast(c("x",t,e,n),c("dtype",t,e,n))];case"ExpandDims":{const r=c("axis",t,e,n);return[s.expandDims(c("x",t,e,n),r)]}case"Squeeze":{const r=c("axis",t,e,n);return[s.squeeze(c("x",t,e,n),r)]}case"Reshape":return[s.reshape(c("x",t,e,n),c("shape",t,e,n))];case"EnsureShape":return[s.ensureShape(c("x",t,e,n),c("shape",t,e,n))];case"MirrorPad":return[s.mirrorPad(c("x",t,e,n),c("padding",t,e,n),c("mode",t,e,n))];case"PadV2":case"Pad":return[s.pad(c("x",t,e,n),c("padding",t,e,n),c("constantValue",t,e,n))];case"SpaceToBatchND":{const r=c("blockShape",t,e,n),a=c("paddings",t,e,n);return[s.spaceToBatchND(c("x",t,e,n),r,a)]}case"BatchToSpaceND":{const r=c("blockShape",t,e,n),a=c("crops",t,e,n);return[s.batchToSpaceND(c("x",t,e,n),r,a)]}case"DepthToSpace":{const r=c("blockSize",t,e,n),a=c("dataFormat",t,e,n).toUpperCase();return[s.depthToSpace(c("x",t,e,n),r,a)]}case"BroadcastTo":return[s.broadcastTo(c("x",t,e,n),c("shape",t,e,n))];case"BroadcastArgs":return[s.broadcastArgs(c("s0",t,e,n),c("s1",t,e,n))];default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Aa(t,e,n,s,r=V){const a=((o,i,u)=>{switch(o.category){case"arithmetic":return r(()=>gS(o,i,u));case"basic_math":return r(()=>yS(o,i,u));case"control":return $S(o,i,u);case"convolution":return r(()=>ES(o,i,u));case"creation":return r(()=>kS(o,i,u));case"dynamic":return _S(o,i,u);case"evaluation":return r(()=>vS(o,i,u));case"image":return r(()=>OS(o,i,u));case"graph":return r(()=>IS(o,i,u));case"logical":return r(()=>DS(o,i,u));case"matrices":return r(()=>FS(o,i,u));case"normalization":return r(()=>CS(o,i,u));case"ragged":return r(()=>RS(o,i,u));case"reduction":return r(()=>PS(o,i,u));case"slice_join":return r(()=>BS(o,i,u));case"sparse":return r(()=>LS(o,i,u));case"spectral":return r(()=>zS(o,i,u));case"string":return r(()=>VS(o,i,u));case"transformation":return r(()=>jS(o,i,u));case"hash_table":return xS(o,i,u,s);case"custom":const l=th(o.op);if(l&&l.customExecutor)return l.customExecutor(new dS(o,i,u));throw TypeError(`Custom op ${o.op} is not registered.`);default:throw TypeError(`Unknown op '${o.op}'. File an issue at https://github.com/tensorflow/tfjs/issues so we can add it, or register a custom execution with tf.registerOp()`)}})(t,e,n);return Ye(a)?a.then(o=>[].concat(o)):[].concat(a)}class xa{constructor(e={},n={},s={},r={},a){this.weightMap=e,this.tensorArrayMap=n,this.tensorListMap=s,this.functionMap=r,this.parseNodeNameCache=a,this.rootContext={id:0,frameName:"",iterationId:0},this.contexts=[this.rootContext],this.lastId=0,this.generateCurrentContextIds()}newFrame(e,n){return{id:e,frameName:n,iterationId:0}}set currentContext(e){this.contexts!==e&&(this.contexts=e,this.generateCurrentContextIds())}get currentContext(){return this.contexts}get currentContextId(){return this._currentContextIds[0]}get currentContextIds(){return this._currentContextIds}generateCurrentContextIds(){const e=[];for(let n=0;n<this.contexts.length-1;n++){const s=this.contexts.slice(0,this.contexts.length-n);e.push(this.contextIdforContexts(s))}e.push(""),this._currentContextIds=e}contextIdforContexts(e){return e?e.map(n=>n.id===0&&n.iterationId===0?"":`${n.frameName}-${n.iterationId}`).join("/"):""}enterFrame(e){this.contexts&&(this.lastId++,this.contexts=this.contexts.slice(),this.contexts.push(this.newFrame(this.lastId,e)),this._currentContextIds.unshift(this.contextIdforContexts(this.contexts)))}exitFrame(){if(this.contexts&&this.contexts.length>1)this.contexts=this.contexts.slice(),this.contexts.splice(-1),this.currentContextIds.shift();else throw new Error("Cannot exit frame, the context is empty")}nextIteration(){if(this.contexts&&this.contexts.length>0){this.contexts=this.contexts.slice(),this.lastId++;const e=Object.assign({},this.contexts[this.contexts.length-1]);e.iterationId+=1,e.id=this.lastId,this.contexts.splice(-1,1,e),this._currentContextIds.splice(0,1,this.contextIdforContexts(this.contexts))}else throw new Error("Cannot increase frame iteration, the context is empty")}getWeight(e){return this.weightMap[e]}addTensorArray(e){this.tensorArrayMap[e.id]=e}getTensorArray(e){return this.tensorArrayMap[e]}addTensorList(e){this.tensorListMap[e.id]=e}getTensorList(e){return this.tensorListMap[e]}dispose(e){for(const n in this.tensorArrayMap)this.tensorArrayMap[n].clearAndClose(e);for(const n in this.tensorListMap)this.tensorListMap[n].clearAndClose(e)}}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Oa(t,e,n,s){const r=new Set,a=[];let o=null,i=null;const u=new Set,l=new Set(Object.keys(t).map(m=>fe(m)[0]));s=s||[];const h=new Set(s.map(m=>fe(m.name)[0])),p=[...e];for(;p.length>0;){const m=p.pop();if((lt(m)||XS(m)||JS(m))&&o==null&&(o=m,i=o.children.map(g=>g.name).filter(g=>r.has(g))),r.add(m.name),n[m.name]==null&&!l.has(m.name)&&!h.has(m.name)){if(m.inputs.length===0){a.push(m.name);continue}m.inputs.forEach(g=>{u.has(g.name)||(u.add(g.name),p.push(g))})}}return{inputs:t,outputs:e,usedNodes:r,missingInputs:a,dynamicNode:o,syncInputs:i}}function MS(t,e){const{usedNodes:n,inputs:s}=e,r=Object.keys(s).map(w=>fe(w)[0]).map(w=>t.nodes[w]),a=t.initNodes||[],o=w=>n.has(typeof w=="string"?w:w.name);function i(w){return[...new Map(w.map(T=>[T.name,T])).values()]}const u=i([...r,...t.weights,...a]).filter(o),l=i([...u,...Object.values(t.nodes)]).filter(o),h=new Map(l.map(w=>[w.name,w])),p={};for(const w of l){p[w.name]=p[w.name]||0;for(const T of w.children)o(T)||(p[T.name]=Number.POSITIVE_INFINITY),p[T.name]=(p[T.name]||0)+1}const m=Object.entries(p).filter(([,w])=>w===0).map(([w])=>w),g=[...m];for(;m.length>0;){const w=m.pop(),T=h.get(w);for(const v of T.children.filter(o))--p[v.name]===0&&(g.push(v.name),m.push(v.name))}const N=g.map(w=>h.get(w)),S=WS(N,u);return US(S,u),S}function WS(t,e){const n=new Map(t.map(o=>[o.name,o])),s=e.map(o=>o.name),r=new Set(s);for(;s.length>0;){const o=s.pop(),i=n.get(o);for(const u of i.children)!n.has(u.name)||r.has(u.name)||(r.add(u.name),s.push(u.name))}return t.filter(o=>r.has(o.name))}class kn extends Error{constructor(e){super(`NodesExecutionOrderError: ${e}`)}}function US(t,e){const n=new Map(t.map((i,u)=>[i.name,u])),s=new Set(e.map(i=>i.name)),r=i=>s.has(typeof i=="string"?i:i.name),a=new Set(t.map(i=>i.name)),o=i=>a.has(typeof i=="string"?i:i.name);for(const i of t){for(const u of i.children.filter(o)){if(!n.has(u.name))throw new kn(`Child ${u.name} of node ${i.name} is unreachable.`);if(n.get(i.name)>n.get(u.name))throw new kn(`Node ${i.name} is scheduled to run after its child ${u.name}.`)}if(!r(i))for(const u of i.inputs){if(!n.has(u.name))throw new kn(`Input ${u.name} of node ${i.name} is unreachable.`);if(n.get(u.name)>n.get(i.name))throw new kn(`Node ${i.name} is scheduled to run before its input ${u.name}.`)}}}function GS(t){const e=new Map(t.map((i,u)=>[i.name,u])),n=Number.MAX_SAFE_INTEGER,s=t.map((i,u)=>lt(i)?n:u),r=i=>{const u=s[e.get(i.name)];return u??-1},a=t.map((i,u)=>i.children.map(r).reduce((l,h)=>Math.max(l,h),s[u])),o=new Map;for(let i=0;i<t.length;++i){const u=a[i];if(u===n)continue;const l=t[i],h=t[u];o.has(h.name)||o.set(h.name,[]),o.get(h.name).push(l)}return o}const qS=new Set(["Switch","Merge","Enter","Exit","NextIteration","StatelessIf","StatelessWhile","if","While"]),KS=new Set(["NonMaxSuppressionV2","NonMaxSuppressionV3","NonMaxSuppressionV5","Where"]),HS=new Set(["HashTable","HashTableV2","LookupTableImport","LookupTableImportV2","LookupTableFind","LookupTableFindV2","LookupTableSize","LookupTableSizeV2"]);function lt(t){return qS.has(t.op)}function XS(t){return KS.has(t.op)}function JS(t){return HS.has(t.op)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Wn{get weightIds(){return this.parent?this.parent.weightIds:this._weightIds}get functionExecutorMap(){return this.parent?this.parent.functionExecutorMap:this._functionExecutorMap}get weightMap(){return this.parent?this.parent.weightMap:this._weightMap}set weightMap(e){const n=Object.keys(e).map(s=>e[s].map(r=>r.id));this._weightIds=[].concat(...n),this._weightMap=e}set resourceManager(e){this._resourceManager=e}get inputs(){return this._inputs.map(e=>({name:e.name,shape:e.attrParams.shape?e.attrParams.shape.value:void 0,dtype:e.attrParams.dtype?e.attrParams.dtype.value:void 0}))}get outputs(){return this._outputs.map(e=>({name:e.name,shape:e.attrParams.shape?e.attrParams.shape.value:void 0,dtype:e.attrParams.dtype?e.attrParams.dtype.value:void 0}))}get inputNodes(){return this._inputs.map(e=>e.signatureKey||e.name)}get outputNodes(){return this._outputs.map(e=>{const n=e.signatureKey||e.name;return e.defaultOutput?`${n}:${e.defaultOutput}`:n})}get functions(){return Object.keys(this._functions).reduce((e,n)=>(e[n]=this._functions[n].signature,e),{})}constructor(e,n){this.graph=e,this.parent=n,this.compiledMap=new Map,this.parseNodeNameCache=new Map,this._weightMap={},this.SEPARATOR=",",this._functions={},this._functionExecutorMap={},this.keepIntermediateTensors=!1,this._outputs=e.outputs,this._inputs=e.inputs,this._initNodes=e.initNodes,this._signature=e.signature,this._functions=e.functions,e.functions!=null&&Object.keys(e.functions).forEach(s=>{this._functionExecutorMap[s]=new Wn(e.functions[s],this)})}getCompilationKey(e,n){const s=e.map(a=>a.name).sort(),r=n.map(a=>a.name).sort();return s.join(this.SEPARATOR)+"--"+r.join(this.SEPARATOR)}compile(e,n){const s=Oa(e,n,this.weightMap,this._initNodes),{missingInputs:r,dynamicNode:a,syncInputs:o}=s;if(a!=null)throw new Error(`This execution contains the node '${a.name}', which has the dynamic op '${a.op}'. Please use model.executeAsync() instead. Alternatively, to avoid the dynamic ops, specify the inputs [${o}]`);if(r.length>0){const l=n.map(p=>p.name),h=Object.keys(e);throw new Error(`Cannot compute the outputs [${l}] from the provided inputs [${h}]. Missing the following inputs: [${r}]`)}const i=MS(this.graph,s),u=GS(i);return{orderedNodes:i,nodeLiveUntilMap:u}}cloneAndKeepTensor(e){if(e==null)return null;const n=e.clone();return $e(n),n}cloneTensorList(e){return e?e.map(s=>this.cloneAndKeepTensor(s)):null}cloneTensorMap(e){return Object.fromEntries(Object.entries(e).map(([n,s])=>[n,this.cloneTensorList(s)]))}execute(e,n){this.disposeIntermediateTensors(),e=this.mapInputs(e);const s=Object.keys(e).sort();this.checkInputs(e),this.checkInputShapeAndType(e),n=this.mapOutputs(n),this.checkOutputs(n);const r=s.map(m=>this.graph.nodes[fe(m)[0]]),a=n.map(m=>fe(m)[0]),o=new Set(a);let i=a.map(m=>this.graph.nodes[m]);i.length===0&&(i=this._outputs);const u=this.getCompilationKey(r,i);let l=this.compiledMap.get(u);l==null&&(l=this.compile(e,i),this.compiledMap.set(u,l));try{this.keepIntermediateTensors=O().getBool("KEEP_INTERMEDIATE_TENSORS")}catch(m){this.keepIntermediateTensors=!1,console.warn(m.message)}const h={},p={};return V(()=>{const m=new xa(this.weightMap,h,p,this.functionExecutorMap,this.parseNodeNameCache),g=Object.assign({},this.weightMap);this.keepIntermediateTensors&&(this.clonedTensorsMap=this.cloneTensorMap(this.weightMap)),Object.keys(e).forEach(T=>{const[v,E]=fe(T,m),k=[];k[E]=e[T],g[v]=k,this.keepIntermediateTensors&&(this.clonedTensorsMap[v]=this.cloneTensorList(k))});const N=this.getFrozenTensorIds(g),{orderedNodes:S,nodeLiveUntilMap:w}=l;for(const T of S){if(g[T.name])continue;const v=Aa(T,g,m,this._resourceManager);if(Ye(v))throw new Error(`The execution of the op '${T.op}' returned a promise. Please use model.executeAsync() instead.`);g[T.name]=v,this.keepIntermediateTensors&&(this.clonedTensorsMap[T.name]=this.cloneTensorList(v)),this.checkTensorForDisposalWithNodeLiveUntilInfo(T,g,m,N,o,w.get(T.name))}return this.parent==null&&m.dispose(N),n.map(T=>ee(T,g,m))})}getFrozenTensorIds(e){const n=[].concat.apply([],Object.keys(e).map(s=>e[s]).map(s=>s.map(r=>r.id)));return new Set(n)}checkTensorForDisposal(e,n,s,r,a,o,i){if(!(lt(n)||o.has(e))){for(const u of s[e])u!=null&&(i[u.id]=(i[u.id]||0)+n.children.length);for(const u of n.inputs){if(lt(u))continue;const l=Ea(u.name,s,r);if(l!=null)for(const h of l){if(!h||h.kept||a.has(h.id))continue;const p=i[h.id];p===1?(h.dispose(),delete i[h.id]):p!=null&&i[h.id]--}}}}checkTensorForDisposalWithNodeLiveUntilInfo(e,n,s,r,a,o){function i(u){return lt(u)||a.has(u.name)}if(!(lt(e)||o==null))for(const u of o){if(i(u))continue;const l=Ea(u.name,n,s);for(const h of l)!h||h.kept||r.has(h.id)||h.dispose()}}async executeAsync(e,n){return this._executeAsync(e,n)}disposeIntermediateTensors(){this.clonedTensorsMap&&(Object.values(this.clonedTensorsMap).forEach(e=>{for(const n of e)n&&!n.isDisposed&&n.dispose()}),this.clonedTensorsMap=null)}getIntermediateTensors(){return this.clonedTensorsMap}async _executeAsync(e,n,s=!1,r={},a={}){this.disposeIntermediateTensors(),s||(e=this.mapInputs(e),this.checkInputs(e),this.checkInputShapeAndType(e),n=this.mapOutputs(n),this.checkOutputs(n));try{this.keepIntermediateTensors=O().getBool("KEEP_INTERMEDIATE_TENSORS")}catch(m){this.keepIntermediateTensors=!1,console.warn(m.message)}const o=new xa(this.weightMap,r,a,this.functionExecutorMap,this.parseNodeNameCache);this.keepIntermediateTensors&&(this.clonedTensorsMap=this.cloneTensorMap(this.weightMap));const i=await this.executeWithControlFlow(e,o,n,s),u=n.map(m=>ee(m,i,o)),l=u.map(m=>m.id),h=Object.keys(e).map(m=>e[m].id),p=new Set([...l,...h,...this.weightIds]);return Object.values(i).forEach(m=>{m.forEach(g=>{g&&!g.isDisposed&&!p.has(g.id)&&g.dispose()})}),this.parent==null&&o.dispose(p),u}async executeFunctionAsync(e,n,s){const r=e.reduce((a,o,i)=>(a[this.inputs[i].name]=o,a),{});return this._executeAsync(r,this.outputNodes,!0,n,s)}async executeWithControlFlow(e,n,s,r){const a=Object.keys(e),o=a.map(k=>this.graph.nodes[fe(k)[0]]),i=s.map(k=>fe(k)[0]),u=new Set(i);let l=i.map(k=>this.graph.nodes[k]);l.length===0&&(l=this._outputs);const{usedNodes:h,missingInputs:p,dynamicNode:m,syncInputs:g}=Oa(e,l,this.weightMap,this._initNodes),N=[...o,...this.graph.weights,...this._initNodes||[]].map(k=>({node:k,contexts:n.currentContext})),S=Object.assign({},this.weightMap);Object.keys(e).forEach(k=>{const[A,I]=fe(k),C=[];C[I]=e[k],S[A]=C});const w={},T=this.getFrozenTensorIds(S),v={};for(;N.length>0;){const k=this.processStack(o,N,n,S,v,T,u,w,h);await Promise.all(k)}m==null&&!r&&console.warn("This model execution did not contain any nodes with control flow or dynamic output shapes. You can use model.execute() instead.");const E=l.filter(k=>!lt(k)&&!ee(k.name,S,n)).map(k=>k.name);if(E.length>0){let k="";throw m!=null&&(k=`Alternatively, to avoid the dynamic ops, use model.execute() and specify the inputs [${g}]`),new Error(`Cannot compute the outputs [${E}] from the provided inputs [${a}]. Consider providing the following inputs: [${p}]. ${k}`)}return S}processStack(e,n,s,r,a,o,i,u,l){const h=[];for(;n.length>0;){const p=n.pop();s.currentContext=p.contexts;let m="";if(p.node.op==="Enter"&&c("isConstant",p.node,r,s)&&([m]=Pe(p.node.name,s)),r[p.node.name]==null){const g=Aa(p.node,r,s,this._resourceManager);m||([m]=Pe(p.node.name,s));const N=s.currentContext;Ye(g)?h.push(g.then(S=>(r[m]=S,this.keepIntermediateTensors&&(this.clonedTensorsMap[m]=this.cloneTensorList(S)),s.currentContext=N,this.checkTensorForDisposal(m,p.node,r,s,o,i,u),this.processChildNodes(p.node,n,s,r,a,l),S))):(r[m]=g,this.keepIntermediateTensors&&(this.clonedTensorsMap[m]=this.cloneTensorList(g)),this.checkTensorForDisposal(m,p.node,r,s,o,i,u),this.processChildNodes(p.node,n,s,r,a,l))}else this.processChildNodes(p.node,n,s,r,a,l)}return h}processChildNodes(e,n,s,r,a,o){e.children.forEach(i=>{const[u]=Pe(i.name,s);a[u]||!o.has(i.name)||(i.op==="Merge"?i.inputNames.some(l=>!!ee(l,r,s))&&(a[u]=!0,n.push({contexts:s.currentContext,node:i})):i.inputNames.every(l=>!!ee(l,r,s))&&(a[u]=!0,n.push({contexts:s.currentContext,node:i})))})}dispose(){Object.keys(this.weightMap).forEach(e=>this.weightMap[e].forEach(n=>n.dispose()))}checkInputShapeAndType(e){Object.keys(e).forEach(n=>{const s=e[n],[r]=fe(n),a=this.graph.nodes[r];if(a.attrParams.shape&&a.attrParams.shape.value){const o=a.attrParams.shape.value,i=o.length===s.shape.length&&s.shape.every((u,l)=>o[l]===-1||o[l]===u);d(i,()=>`The shape of dict['${a.name}'] provided in model.execute(dict) must be [${o}], but was [${s.shape}]`)}a.attrParams.dtype&&a.attrParams.dtype.value&&d(s.dtype===a.attrParams.dtype.value,()=>`The dtype of dict['${a.name}'] provided in model.execute(dict) must be ${a.attrParams.dtype.value}, but was ${s.dtype}`)})}mapInputs(e){var n,s;const r={};for(const a in e){const o=(s=(n=this._signature)===null||n===void 0?void 0:n.inputs)===null||s===void 0?void 0:s[a];o!=null?r[o.name]=e[a]:r[a]=e[a]}return r}checkInputs(e){const n=Object.keys(e).filter(s=>{const[r]=fe(s);return this.graph.nodes[r]==null});if(n.length>0)throw new Error(`The dict provided in model.execute(dict) has keys: [${n}] that are not part of graph`)}mapOutputs(e){return e.map(n=>{var s,r;const a=(r=(s=this._signature)===null||s===void 0?void 0:s.outputs)===null||r===void 0?void 0:r[n];return a!=null?a.name:n},{})}checkOutputs(e){e.forEach(n=>{const[s]=fe(n);if(!this.graph.nodes[s])throw new Error(`The output '${n}' is not found in the graph`)})}}class YS{constructor(e={},n={}){this.hashTableNameToHandle=e,this.hashTableMap=n}addHashTable(e,n){this.hashTableNameToHandle[e]=n.handle,this.hashTableMap[n.id]=n}getHashTableHandleByName(e){return this.hashTableNameToHandle[e]}getHashTableById(e){return this.hashTableMap[e]}dispose(){for(const e in this.hashTableMap)this.hashTableMap[e].clearAndClose(),delete this.hashTableMap[e];for(const e in this.hashTableNameToHandle)this.hashTableNameToHandle[e].dispose(),delete this.hashTableNameToHandle[e]}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ZS="?tfjs-format=file",QS="model.json";class oa{get modelVersion(){return this.version}get inputNodes(){return this.executor.inputNodes}get outputNodes(){return this.executor.outputNodes}get inputs(){return this.executor.inputs}get outputs(){return this.executor.outputs}get weights(){return this.executor.weightMap}get metadata(){return this.artifacts.userDefinedMetadata}get modelSignature(){return this.signature}get modelStructuredOutputKeys(){return this.structuredOutputKeys}constructor(e,n={},s=na){this.modelUrl=e,this.loadOptions=n,this.version="n/a",this.io=s,n==null&&(this.loadOptions={}),this.resourceManager=new YS}findIOHandler(){const e=this.modelUrl;if(e.load!=null)this.handler=e;else if(this.loadOptions.requestInit!=null)this.handler=this.io.browserHTTPRequest(e,this.loadOptions);else{const n=this.io.getLoadHandlers(e,this.loadOptions);if(n.length===0)n.push(this.io.browserHTTPRequest(e,this.loadOptions));else if(n.length>1)throw new Error(`Found more than one (${n.length}) load handlers for URL '${[e]}'`);this.handler=n[0]}}load(){if(this.findIOHandler(),this.handler.load==null)throw new Error("Cannot proceed with model loading because the IOHandler provided does not have the `load` method implemented.");const e=this.handler.load();return Ye(e)?e.then(n=>n.getWeightStream==null?this.loadSync(n):this.loadStreaming(n)):this.loadSync(e)}loadSync(e){const n=this.io.decodeWeights(e.weightData,e.weightSpecs);return this.loadWithWeightMap(e,n)}async loadStreaming(e){if(e.getWeightStream==null)throw new Error("Model artifacts missing streamWeights function");const n=await Qu(e.getWeightStream(),e.weightSpecs);return this.loadWithWeightMap(e,n)}loadWithWeightMap(e,n){this.artifacts=e;const s=this.artifacts.modelTopology;let r=this.artifacts.signature;if(this.artifacts.userDefinedMetadata!=null){const a=this.artifacts.userDefinedMetadata;a.signature!=null&&(r=a.signature),a.structuredOutputKeys!=null&&(this.structuredOutputKeys=a.structuredOutputKeys)}if(this.signature=r,this.version=`${s.versions.producer}.${s.versions.minConsumer}`,this.executor=new Wn(ka.Instance.transformGraph(s,this.signature)),this.executor.weightMap=this.convertTensorMapToTensorsMap(n),this.executor.resourceManager=this.resourceManager,e.modelInitializer!=null&&e.modelInitializer.node!=null){const a=ka.Instance.transformGraph(e.modelInitializer);this.initializer=new Wn(a),this.initializer.weightMap=this.executor.weightMap,this.initializer.resourceManager=this.resourceManager,this.initializerSignature=e.initializerSignature}return!0}async save(e,n){if(typeof e=="string"){const s=this.io.getSaveHandlers(e);if(s.length===0)throw new Error(`Cannot find any save handlers for URL '${e}'`);if(s.length>1)throw new Error(`Found more than one (${s.length}) save handlers for URL '${e}'`);e=s[0]}if(e.save==null)throw new Error("GraphModel.save() cannot proceed because the IOHandler provided does not have the `save` attribute defined.");return e.save(this.artifacts)}addStructuredOutputNames(e){if(this.structuredOutputKeys){const n=e instanceof X?[e]:e,s={};return n.forEach((r,a)=>s[this.structuredOutputKeys[a]]=r),s}return e}predict(e,n){const s=this.execute(e,this.outputNodes);return this.addStructuredOutputNames(s)}async predictAsync(e,n){const s=await this.executeAsync(e,this.outputNodes);return this.addStructuredOutputNames(s)}normalizeInputs(e){var n;if(!(e instanceof X)&&!Array.isArray(e)){const a=(n=this.signature)===null||n===void 0?void 0:n.inputs;if(a!=null)for(const o in a){const i=a[o];i.resourceId!=null&&(e[o]=this.resourceIdToCapturedInput[i.resourceId])}return e}e=Array.isArray(e)?e:[e];const s=Object.keys(this.resourceIdToCapturedInput).length;if(e.length+s!==this.inputNodes.length)throw new Error(`Input tensor count mismatch, the graph model has ${this.inputNodes.length-s} non-resource placeholders, while there are ${e.length} input tensors provided.`);let r=0;return this.inputNodes.reduce((a,o)=>{var i,u,l;const h=(l=(u=(i=this.signature)===null||i===void 0?void 0:i.inputs)===null||u===void 0?void 0:u[o])===null||l===void 0?void 0:l.resourceId;return h!=null?a[o]=this.resourceIdToCapturedInput[h]:a[o]=e[r++],a},{})}normalizeOutputs(e){return e=e||this.outputNodes,Array.isArray(e)?e:[e]}executeInitializerGraph(){return this.initializer==null?[]:this.initializerSignature==null?this.initializer.execute({},[]):this.initializer.execute({},Object.keys(this.initializerSignature.outputs))}async executeInitializerGraphAsync(){return this.initializer==null?[]:this.initializerSignature==null?this.initializer.executeAsync({},[]):this.initializer.executeAsync({},Object.keys(this.initializerSignature.outputs))}setResourceIdToCapturedInput(e){if(this.resourceIdToCapturedInput={},this.initializerSignature){const n=this.initializerSignature.outputs,s=Object.keys(n);for(let r=0;r<s.length;r++){const a=s[r],o=n[a];this.resourceIdToCapturedInput[o.resourceId]=e[r]}}}execute(e,n){this.resourceIdToCapturedInput==null&&this.setResourceIdToCapturedInput(this.executeInitializerGraph()),e=this.normalizeInputs(e),n=this.normalizeOutputs(n);const s=this.executor.execute(e,n);return s.length>1?s:s[0]}async executeAsync(e,n){this.resourceIdToCapturedInput==null&&this.setResourceIdToCapturedInput(await this.executeInitializerGraphAsync()),e=this.normalizeInputs(e),n=this.normalizeOutputs(n);const s=await this.executor.executeAsync(e,n);return s.length>1?s:s[0]}getIntermediateTensors(){return this.executor.getIntermediateTensors()}disposeIntermediateTensors(){this.executor.disposeIntermediateTensors()}convertTensorMapToTensorsMap(e){return Object.keys(e).reduce((n,s)=>(n[s]=[e[s]],n),{})}dispose(){this.executor.dispose(),this.initializer&&(this.initializer.dispose(),this.resourceIdToCapturedInput&&ue(this.resourceIdToCapturedInput)),this.resourceManager.dispose()}}async function eT(t,e={},n=na){if(t==null)throw new Error("modelUrl in loadGraphModel() cannot be null. Please provide a url or an IOHandler that loads the model");e==null&&(e={}),e.fromTFHub&&typeof t=="string"&&(t=nT(t));const s=new oa(t,e,n);return await s.load(),s}function tT(t){if(t==null)throw new Error("modelUrl in loadGraphModelSync() cannot be null. Please provide model artifacts or an IOHandler that loads the model");let e;if(t instanceof Array){const[s,r]=t;if(!s)throw new Error("modelJSON must be the first element of the array");if(!r||!(r instanceof ArrayBuffer))throw new Error("An ArrayBuffer of weights must be the second element of the array");if(!("modelTopology"in s))throw new Error("Model JSON is missing 'modelTopology'");if(!("weightsManifest"in s))throw new Error("Model JSON is missing 'weightsManifest'");const a=Pn(s.weightsManifest),o=ir(s,a,r);e=jn(o)}else if("load"in t)e=t;else if("modelTopology"in t&&"weightSpecs"in t&&"weightData"in t)e=jn(t);else throw new Error("Unknown model format");const n=new oa(e);return n.load(),n}function nT(t){return t.endsWith("/")||(t=t+"/"),`${t}${QS}${ZS}`}/** @license See the LICENSE file. */const sT="4.22.0";/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const rT=Object.freeze(Object.defineProperty({__proto__:null,GraphModel:oa,deregisterOp:A1,loadGraphModel:eT,loadGraphModelSync:tT,registerOp:I1,version_converter:sT},Symbol.toStringTag,{value:"Module"})),aT=Da(rT),oT=Da(_1);/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */(function(t,e){(function(n,s){s(e,aT,oT)})(ih,function(n,s,r){const a={1:{name:"/m/01g317",id:1,displayName:"person"},2:{name:"/m/0199g",id:2,displayName:"bicycle"},3:{name:"/m/0k4j",id:3,displayName:"car"},4:{name:"/m/04_sv",id:4,displayName:"motorcycle"},5:{name:"/m/05czz6l",id:5,displayName:"airplane"},6:{name:"/m/01bjv",id:6,displayName:"bus"},7:{name:"/m/07jdr",id:7,displayName:"train"},8:{name:"/m/07r04",id:8,displayName:"truck"},9:{name:"/m/019jd",id:9,displayName:"boat"},10:{name:"/m/015qff",id:10,displayName:"traffic light"},11:{name:"/m/01pns0",id:11,displayName:"fire hydrant"},13:{name:"/m/02pv19",id:13,displayName:"stop sign"},14:{name:"/m/015qbp",id:14,displayName:"parking meter"},15:{name:"/m/0cvnqh",id:15,displayName:"bench"},16:{name:"/m/015p6",id:16,displayName:"bird"},17:{name:"/m/01yrx",id:17,displayName:"cat"},18:{name:"/m/0bt9lr",id:18,displayName:"dog"},19:{name:"/m/03k3r",id:19,displayName:"horse"},20:{name:"/m/07bgp",id:20,displayName:"sheep"},21:{name:"/m/01xq0k1",id:21,displayName:"cow"},22:{name:"/m/0bwd_0j",id:22,displayName:"elephant"},23:{name:"/m/01dws",id:23,displayName:"bear"},24:{name:"/m/0898b",id:24,displayName:"zebra"},25:{name:"/m/03bk1",id:25,displayName:"giraffe"},27:{name:"/m/01940j",id:27,displayName:"backpack"},28:{name:"/m/0hnnb",id:28,displayName:"umbrella"},31:{name:"/m/080hkjn",id:31,displayName:"handbag"},32:{name:"/m/01rkbr",id:32,displayName:"tie"},33:{name:"/m/01s55n",id:33,displayName:"suitcase"},34:{name:"/m/02wmf",id:34,displayName:"frisbee"},35:{name:"/m/071p9",id:35,displayName:"skis"},36:{name:"/m/06__v",id:36,displayName:"snowboard"},37:{name:"/m/018xm",id:37,displayName:"sports ball"},38:{name:"/m/02zt3",id:38,displayName:"kite"},39:{name:"/m/03g8mr",id:39,displayName:"baseball bat"},40:{name:"/m/03grzl",id:40,displayName:"baseball glove"},41:{name:"/m/06_fw",id:41,displayName:"skateboard"},42:{name:"/m/019w40",id:42,displayName:"surfboard"},43:{name:"/m/0dv9c",id:43,displayName:"tennis racket"},44:{name:"/m/04dr76w",id:44,displayName:"bottle"},46:{name:"/m/09tvcd",id:46,displayName:"wine glass"},47:{name:"/m/08gqpm",id:47,displayName:"cup"},48:{name:"/m/0dt3t",id:48,displayName:"fork"},49:{name:"/m/04ctx",id:49,displayName:"knife"},50:{name:"/m/0cmx8",id:50,displayName:"spoon"},51:{name:"/m/04kkgm",id:51,displayName:"bowl"},52:{name:"/m/09qck",id:52,displayName:"banana"},53:{name:"/m/014j1m",id:53,displayName:"apple"},54:{name:"/m/0l515",id:54,displayName:"sandwich"},55:{name:"/m/0cyhj_",id:55,displayName:"orange"},56:{name:"/m/0hkxq",id:56,displayName:"broccoli"},57:{name:"/m/0fj52s",id:57,displayName:"carrot"},58:{name:"/m/01b9xk",id:58,displayName:"hot dog"},59:{name:"/m/0663v",id:59,displayName:"pizza"},60:{name:"/m/0jy4k",id:60,displayName:"donut"},61:{name:"/m/0fszt",id:61,displayName:"cake"},62:{name:"/m/01mzpv",id:62,displayName:"chair"},63:{name:"/m/02crq1",id:63,displayName:"couch"},64:{name:"/m/03fp41",id:64,displayName:"potted plant"},65:{name:"/m/03ssj5",id:65,displayName:"bed"},67:{name:"/m/04bcr3",id:67,displayName:"dining table"},70:{name:"/m/09g1w",id:70,displayName:"toilet"},72:{name:"/m/07c52",id:72,displayName:"tv"},73:{name:"/m/01c648",id:73,displayName:"laptop"},74:{name:"/m/020lf",id:74,displayName:"mouse"},75:{name:"/m/0qjjc",id:75,displayName:"remote"},76:{name:"/m/01m2v",id:76,displayName:"keyboard"},77:{name:"/m/050k8",id:77,displayName:"cell phone"},78:{name:"/m/0fx9l",id:78,displayName:"microwave"},79:{name:"/m/029bxz",id:79,displayName:"oven"},80:{name:"/m/01k6s3",id:80,displayName:"toaster"},81:{name:"/m/0130jx",id:81,displayName:"sink"},82:{name:"/m/040b_t",id:82,displayName:"refrigerator"},84:{name:"/m/0bt_c3",id:84,displayName:"book"},85:{name:"/m/01x3z",id:85,displayName:"clock"},86:{name:"/m/02s195",id:86,displayName:"vase"},87:{name:"/m/01lsmm",id:87,displayName:"scissors"},88:{name:"/m/0kmg4",id:88,displayName:"teddy bear"},89:{name:"/m/03wvsk",id:89,displayName:"hair drier"},90:{name:"/m/012xff",id:90,displayName:"toothbrush"}};class o{constructor(u,l){this.modelPath=l||`https://storage.googleapis.com/tfjs-models/savedmodel/${this.getPrefix(u)}/model.json`}getPrefix(u){return u==="lite_mobilenet_v2"?`ssd${u}`:`ssd_${u}`}async load(){this.model=await s.loadGraphModel(this.modelPath);const u=r.zeros([1,300,300,3],"int32"),l=await this.model.executeAsync(u);await Promise.all(l.map(h=>h.data())),l.map(h=>h.dispose()),u.dispose()}async infer(u,l,h){const p=r.tidy(()=>(u instanceof r.Tensor||(u=r.browser.fromPixels(u)),r.expandDims(u))),m=p.shape[1],g=p.shape[2],N=await this.model.executeAsync(p),S=N[0].dataSync(),w=N[1].dataSync();p.dispose(),r.dispose(N);const[T,v]=this.calculateMaxScores(S,N[0].shape[1],N[0].shape[2]),E=r.getBackend();r.getBackend()==="webgl"&&r.setBackend("cpu");const k=r.tidy(()=>{const I=r.tensor2d(w,[N[1].shape[1],N[1].shape[3]]);return r.image.nonMaxSuppression(I,T,l,h,h)}),A=k.dataSync();return k.dispose(),E!==r.getBackend()&&r.setBackend(E),this.buildDetectedObjects(g,m,w,T,A,v)}buildDetectedObjects(u,l,h,p,m,g){const N=m.length,S=[];for(let w=0;w<N;w++){const T=[];for(let I=0;I<4;I++)T[I]=h[4*m[w]+I];const v=T[0]*l,E=T[1]*u,k=T[2]*l,A=T[3]*u;T[0]=E,T[1]=v,T[2]=A-E,T[3]=k-v,S.push({bbox:T,class:a[g[m[w]]+1].displayName,score:p[m[w]]})}return S}calculateMaxScores(u,l,h){const p=[],m=[];for(let g=0;g<l;g++){let N=Number.MIN_VALUE,S=-1;for(let w=0;w<h;w++)u[g*h+w]>N&&(N=u[g*h+w],S=w);p[g]=N,m[g]=S}return[p,m]}async detect(u,l=20,h=.5){return this.infer(u,l,h)}dispose(){this.model!=null&&this.model.dispose()}}n.ObjectDetection=o,n.load=async function(i={}){if(r==null)throw new Error("Cannot find TensorFlow.js. If you are using a <script> tag, please also include @tensorflow/tfjs on the page before using this model.");const u=i.base||"lite_mobilenet_v2",l=i.modelUrl;if(["mobilenet_v1","mobilenet_v2","lite_mobilenet_v2"].indexOf(u)===-1)throw new Error(`ObjectDetection constructed with invalid base model ${u}. Valid names are 'mobilenet_v1', 'mobilenet_v2' and 'lite_mobilenet_v2'.`);const h=new o(u,l);return await h.load(),h},n.version="2.2.3",Object.defineProperty(n,"__esModule",{value:!0})})})(ds,ds.exports);var rh=ds.exports;const iT=oh(rh),cT=ch({__proto__:null,default:iT},[rh]);export{cT as c};
