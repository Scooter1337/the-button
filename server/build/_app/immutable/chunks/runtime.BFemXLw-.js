var tn=Array.isArray,nn=Array.from,rn=Object.isFrozen,en=Object.defineProperty,un=Object.getOwnPropertyDescriptor,Rt=Object.getOwnPropertyDescriptors,ln=Object.prototype,sn=Array.prototype,Nt=Object.getPrototypeOf;function on(t){return typeof t=="function"}const fn=()=>{};function an(t){return t()}function ut(t){for(var n=0;n<t.length;n++)t[n]()}const T=2,lt=4,C=8,st=16,w=32,W=64,g=128,M=256,d=512,k=1024,D=2048,F=4096,b=8192,jt=16384,ot=32768,_n=65536,It=1<<18,X=Symbol("$state"),cn=Symbol("");function ft(t){return t===this.v}function Lt(t,n){return t!=t?n==n:t!==n||t!==null&&typeof t=="object"||typeof t=="function"}function it(t){return!Lt(t,this.v)}function Mt(t){throw new Error("effect_in_teardown")}function Pt(){throw new Error("effect_in_unowned_derived")}function Yt(t){throw new Error("effect_orphan")}function Bt(){throw new Error("effect_update_depth_exceeded")}function vn(){throw new Error("hydration_failed")}function pn(t){throw new Error("props_invalid_value")}function Ht(){throw new Error("state_unsafe_mutation")}function at(t){return{f:0,v:t,reactions:null,equals:ft,version:0}}function hn(t){var r;const n=at(t);return n.equals=it,a!==null&&a.l!==null&&((r=a.l).s??(r.s=[])).push(n),n}function _t(t,n){return f!==null&&V()&&f.f&T&&Ht(),t.equals(n)||(t.v=n,t.version=St(),ct(t,k),V()&&i!==null&&i.f&d&&!(i.f&w)&&(c!==null&&c.includes(t)?(h(i,k),z(i)):y===null?Wt([t]):y.push(t))),n}function ct(t,n){var r=t.reactions;if(r!==null){var e=V();for(var u of r){var l=u.f;l&k||!e&&u===i||(h(u,n),l&(d|g)&&(l&T?ct(u,D):z(u)))}}}function vt(t){i===null&&f===null&&Yt(),f!==null&&f.f&g&&Pt(),J&&Mt()}function Z(t,n){var r=n.last;r===null?n.last=n.first=t:(r.next=t,t.prev=r,n.last=t)}function R(t,n,r,e=!0){var u=(t&W)!==0,l=i,s={ctx:a,deps:null,nodes:null,f:t|k,first:null,fn:n,last:null,next:null,parent:u?null:l,prev:null,teardown:null,transitions:null,version:0};if(r){var o=A;try{tt(!0),I(s),s.f|=jt}catch(_){throw H(s),_}finally{tt(o)}}else n!==null&&z(s);var p=r&&s.deps===null&&s.first===null&&s.nodes===null&&s.teardown===null;return!p&&!u&&e&&(l!==null&&Z(s,l),f!==null&&f.f&T&&Z(s,f)),s}function dn(t){const n=R(C,null,!1);return h(n,d),n.teardown=t,n}function wn(t){vt();var n=i!==null&&(i.f&C)!==0&&a!==null&&!a.m;if(n){var r=a;(r.e??(r.e=[])).push(t)}else{var e=pt(t);return e}}function En(t){return vt(),B(t)}function yn(t){const n=R(W,t,!0);return()=>{H(n)}}function pt(t){return R(lt,t,!1)}function kn(t,n){var r=a,e={effect:null,ran:!1};r.l.r1.push(e),e.effect=B(()=>{t(),!e.ran&&(e.ran=!0,_t(r.l.r2,!0),Xt(n))})}function mn(){var t=a;B(()=>{if(bt(t.l.r2)){for(var n of t.l.r1){var r=n.effect;N(r)&&I(r),n.ran=!1}t.l.r2.v=!1}})}function B(t){return R(C,t,!0)}function Tn(t){return B(t)}function gn(t,n=0){return R(C|st|n,t,!0)}function qn(t,n=!0){return R(C|w,t,!0,n)}function ht(t){var n=t.teardown;if(n!==null){const r=J,e=f;nt(!0),rt(null);try{n.call(null)}finally{nt(r),rt(e)}}}function H(t,n=!0){var r=!1;if((n||t.f&It)&&t.nodes!==null){for(var e=t.nodes.start,u=t.nodes.end;e!==null;){var l=e===u?null:e.nextSibling;e.remove(),e=l}r=!0}if(Q(t,n&&!r),U(t,0),h(t,b),t.transitions)for(const o of t.transitions)o.stop();ht(t);var s=t.parent;s!==null&&t.f&w&&s.first!==null&&dt(t),t.next=t.prev=t.teardown=t.ctx=t.deps=t.parent=t.fn=t.nodes=null}function dt(t){var n=t.parent,r=t.prev,e=t.next;r!==null&&(r.next=e),e!==null&&(e.prev=r),n!==null&&(n.first===t&&(n.first=e),n.last===t&&(n.last=r))}function Sn(t,n){var r=[];wt(t,r,!0),Ut(r,()=>{H(t),n&&n()})}function Ut(t,n){var r=t.length;if(r>0){var e=()=>--r||n();for(var u of t)u.out(e)}else n()}function wt(t,n,r){if(!(t.f&F)){if(t.f^=F,t.transitions!==null)for(const s of t.transitions)(s.is_global||r)&&n.push(s);for(var e=t.first;e!==null;){var u=e.next,l=(e.f&ot)!==0||(e.f&w)!==0;wt(e,n,l?r:!1),e=u}}}function xn(t){Et(t,!0)}function Et(t,n){if(t.f&F){t.f^=F,N(t)&&I(t);for(var r=t.first;r!==null;){var e=r.next,u=(r.f&ot)!==0||(r.f&w)!==0;Et(r,u?n:!1),r=e}if(t.transitions!==null)for(const l of t.transitions)(l.is_global||n)&&l.in()}}const zt=typeof requestIdleCallback>"u"?t=>setTimeout(t,1):requestIdleCallback;let P=!1,Y=!1,K=[],G=[];function yt(){P=!1;const t=K.slice();K=[],ut(t)}function kt(){Y=!1;const t=G.slice();G=[],ut(t)}function An(t){P||(P=!0,queueMicrotask(yt)),K.push(t)}function On(t){Y||(Y=!0,zt(kt)),G.push(t)}function Kt(){P&&yt(),Y&&kt()}function Gt(t){let n=T|k;i===null&&(n|=g);const r={deps:null,deriveds:null,equals:ft,f:n,first:null,fn:t,last:null,reactions:null,v:null,version:0};if(f!==null&&f.f&T){var e=f;e.deriveds===null?e.deriveds=[r]:e.deriveds.push(r)}return r}function Fn(t){const n=Gt(t);return n.equals=it,n}function mt(t){Q(t);var n=t.deriveds;if(n!==null){t.deriveds=null;for(var r=0;r<n.length;r+=1)Vt(n[r])}}function Tt(t){var n;mt(t),n=xt(t);var r=(x||t.f&g)&&t.deps!==null?D:d;h(t,r),t.equals(n)||(t.v=n,t.version=St())}function Vt(t){mt(t),U(t,0),h(t,b),t.first=t.last=t.deps=t.reactions=t.fn=null}const gt=0,$t=1;let L=gt,j=!1,A=!1,J=!1;function tt(t){A=t}function nt(t){J=t}let m=[],O=0,f=null;function rt(t){f=t}let i=null,c=null,v=0,y=null;function Wt(t){y=t}let qt=0,x=!1,a=null;function St(){return qt++}function V(){return a!==null&&a.l===null}function N(t){var s,o;var n=t.f;if(n&k)return!0;if(n&D){var r=t.deps,e=(n&g)!==0;if(r!==null){var u;if(n&M){for(u=0;u<r.length;u++)((s=r[u]).reactions??(s.reactions=new Set)).add(t);t.f^=M}for(u=0;u<r.length;u++){var l=r[u];if(N(l)&&Tt(l),l.version>t.version)return!0;e&&!x&&!((o=l==null?void 0:l.reactions)!=null&&o.has(t))&&(l.reactions??(l.reactions=new Set)).add(t)}}e||h(t,d)}return!1}function Jt(t,n,r){throw t}function xt(t){var E;var n=c,r=v,e=y,u=f,l=x;c=null,v=0,y=null,f=t.f&(w|W)?null:t,x=!A&&(t.f&g)!==0;try{var s=(0,t.fn)(),o=t.deps;if(c!==null){var p,_;if(o!==null){var q=v===0?c:o.slice(0,v).concat(c),S=q.length>16?new Set(q):null;for(_=v;_<o.length;_++)p=o[_],(S!==null?!S.has(p):!q.includes(p))&&At(t,p)}if(o!==null&&v>0)for(o.length=v+c.length,_=0;_<c.length;_++)o[v+_]=c[_];else t.deps=o=c;if(!x)for(_=v;_<o.length;_++)((E=o[_]).reactions??(E.reactions=new Set)).add(t)}else o!==null&&v<o.length&&(U(t,v),o.length=v);return s}finally{c=n,v=r,y=e,f=u,x=l}}function At(t,n){let r=n.reactions;r!==null&&(r.delete(t),r.size===0&&(r=n.reactions=null)),r===null&&n.f&T&&(h(n,D),n.f&(g|M)||(n.f^=M),U(n,0))}function U(t,n){var r=t.deps;if(r!==null)for(var e=n===0?null:r.slice(0,n),u=new Set,l=n;l<r.length;l++){var s=r[l];u.has(s)||(u.add(s),(e===null||!e.includes(s))&&At(t,s))}}function Q(t,n=!1){var r=t.first;for(t.first=t.last=null;r!==null;){var e=r.next;H(r,n),r=e}}function I(t){var n=t.f;if(!(n&b)){h(t,d);var r=t.ctx,e=i,u=a;i=t,a=r;try{n&st||Q(t),ht(t);var l=xt(t);t.teardown=typeof l=="function"?l:null,t.version=qt}catch(s){Jt(s)}finally{i=e,a=u}}}function Ot(){O>1e3&&(O=0,Bt()),O++}function Ft(t){var n=t.length;if(n!==0){Ot();var r=A;A=!0;try{for(var e=0;e<n;e++){var u=t[e];if(u.first===null&&!(u.f&w))et([u]);else{var l=[];Ct(u,l),et(l)}}}finally{A=r}}}function et(t){var n=t.length;if(n!==0)for(var r=0;r<n;r++){var e=t[r];!(e.f&(b|F))&&N(e)&&(I(e),e.deps===null&&e.first===null&&e.nodes===null&&(e.teardown===null?dt(e):e.fn=null))}}function Qt(){if(j=!1,O>1001)return;const t=m;m=[],Ft(t),j||(O=0)}function z(t){L===gt&&(j||(j=!0,queueMicrotask(Qt)));for(var n=t;n.parent!==null;){n=n.parent;var r=n.f;if(r&w){if(!(r&d))return;h(n,D)}}m.push(n)}function Ct(t,n){var r=t.first,e=[];t:for(;r!==null;){var u=r.f,l=(u&(b|F))===0,s=u&w,o=(u&d)!==0,p=r.first;if(l&&(!s||!o)){if(s&&h(r,d),u&C){if(!s&&N(r)&&(I(r),p=r.first),p!==null){r=p;continue}}else if(u&lt)if(s||o){if(p!==null){r=p;continue}}else e.push(r)}var _=r.next;if(_===null){let E=r.parent;for(;E!==null;){if(t===E)break t;var q=E.next;if(q!==null){r=q;continue t}E=E.parent}}r=_}for(var S=0;S<e.length;S++)p=e[S],n.push(p),Ct(p,n)}function Dt(t){var n=L,r=m;try{Ot();const u=[];L=$t,m=u,j=!1,Ft(r);var e=t==null?void 0:t();return Kt(),(m.length>0||u.length>0)&&Dt(),O=0,e}finally{L=n,m=r}}async function Cn(){await Promise.resolve(),Dt()}function bt(t){var n=t.f;if(n&b)return t.v;if(f!==null){var r=f.deps;c===null&&r!==null&&r[v]===t?v++:(r===null||v===0||r[v-1]!==t)&&(c===null?c=[t]:c[c.length-1]!==t&&c.push(t)),y!==null&&i!==null&&i.f&d&&!(i.f&w)&&y.includes(t)&&(h(i,k),z(i))}if(n&T){var e=t;N(e)&&Tt(e)}return t.v}function Xt(t){const n=f;try{return f=null,t()}finally{f=n}}const Zt=~(k|D|d);function h(t,n){t.f=t.f&Zt|n}function Dn(t,n=1){var r=+bt(t);return _t(t,r+n),r}function bn(t,n=!1,r){a={p:a,c:null,e:null,m:!1,s:t,x:null,l:null},n||(a.l={s:null,u:null,r1:[],r2:at(!1)})}function Rn(t){const n=a;if(n!==null){const e=n.e;if(e!==null){n.e=null;for(var r=0;r<e.length;r++)pt(e[r])}a=n.p,n.m=!0}return{}}function Nn(t){if(!(typeof t!="object"||!t||t instanceof EventTarget)){if(X in t)$(t);else if(!Array.isArray(t))for(let n in t){const r=t[n];typeof r=="object"&&r&&X in r&&$(r)}}}function $(t,n=new Set){if(typeof t=="object"&&t!==null&&!(t instanceof EventTarget)&&!n.has(t)){n.add(t),t instanceof Date&&t.getTime();for(let e in t)try{$(t[e],n)}catch{}const r=Nt(t);if(r!==Object.prototype&&r!==Array.prototype&&r!==Map.prototype&&r!==Set.prototype&&r!==Date.prototype){const e=Rt(r);for(let u in e){const l=e[u].get;if(l)try{l.call(t)}catch{}}}}}export{yn as $,Nt as A,gn as B,xn as C,qn as D,Sn as E,ot as F,pt as G,B as H,An as I,pn as J,it as K,_n as L,Dn as M,on as N,Gt as O,Fn as P,F as Q,wt as R,X as S,Ut as T,H as U,On as V,cn as W,Rt as X,It as Y,vn as Z,nn as _,Rn as a,kn as a0,mn as a1,wn as b,a as c,Xt as d,an as e,Nn as f,bt as g,dn as h,Lt as i,Dt as j,en as k,Cn as l,hn as m,fn as n,at as o,bn as p,rn as q,ut as r,_t as s,Tn as t,En as u,ln as v,sn as w,tn as x,un as y,i as z};
