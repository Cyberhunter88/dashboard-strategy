"use strict";(self.webpackChunkdashboard_strategy=self.webpackChunkdashboard_strategy||[]).push([[8],{4427(e,t,i){function a(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}i.r(t),i.d(t,{Simon42DashboardStrategyEditor:()=>Gt});var o,r,s,n,c,d,l,_,h,u,p,m,g,y,f,v,b,w,k,x,C,$,S,A,O,E,I,L,P,q,W,D,T,K,V,F,j,M,N,z,H,Y,R,B,U={},G={},Z={};function J(){if(o)return Z;function e(e){return null==e}return o=1,Z.isNothing=e,Z.isObject=function(e){return"object"==typeof e&&null!==e},Z.toArray=function(t){return Array.isArray(t)?t:e(t)?[]:[t]},Z.repeat=function(e,t){let i="";for(let a=0;a<t;a+=1)i+=e;return i},Z.isNegativeZero=function(e){return 0===e&&Number.NEGATIVE_INFINITY===1/e},Z.extend=function(e,t){if(t){const i=Object.keys(t);for(let a=0,o=i.length;a<o;a+=1){const o=i[a];e[o]=t[o]}}return e},Z}function Q(){if(s)return r;function e(e,t){let i="";const a=e.reason||"(unknown reason)";return e.mark?(e.mark.name&&(i+='in "'+e.mark.name+'" '),i+="("+(e.mark.line+1)+":"+(e.mark.column+1)+")",!t&&e.mark.snippet&&(i+="\n\n"+e.mark.snippet),a+" "+i):a}function t(t,i){Error.call(this),this.name="YAMLException",this.reason=t,this.mark=i,this.message=e(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=(new Error).stack||""}return s=1,t.prototype=Object.create(Error.prototype),t.prototype.constructor=t,t.prototype.toString=function(t){return this.name+": "+e(this,t)},r=t}function X(){if(l)return d;l=1;const e=Q(),t=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],i=["scalar","sequence","mapping"];return d=function(a,o){if(o=o||{},Object.keys(o).forEach(function(i){if(-1===t.indexOf(i))throw new e('Unknown option "'+i+'" is met in definition of "'+a+'" YAML type.')}),this.options=o,this.tag=a,this.kind=o.kind||null,this.resolve=o.resolve||function(){return!0},this.construct=o.construct||function(e){return e},this.instanceOf=o.instanceOf||null,this.predicate=o.predicate||null,this.represent=o.represent||null,this.representName=o.representName||null,this.defaultStyle=o.defaultStyle||null,this.multi=o.multi||!1,this.styleAliases=function(e){const t={};return null!==e&&Object.keys(e).forEach(function(i){e[i].forEach(function(e){t[String(e)]=i})}),t}(o.styleAliases||null),-1===i.indexOf(this.kind))throw new e('Unknown kind "'+this.kind+'" is specified for "'+a+'" YAML type.')}}function ee(){if(h)return _;h=1;const e=Q(),t=X();function i(e,t){const i=[];return e[t].forEach(function(e){let t=i.length;i.forEach(function(i,a){i.tag===e.tag&&i.kind===e.kind&&i.multi===e.multi&&(t=a)}),i[t]=e}),i}function a(e){return this.extend(e)}return a.prototype.extend=function(o){let r=[],s=[];if(o instanceof t)s.push(o);else if(Array.isArray(o))s=s.concat(o);else{if(!o||!Array.isArray(o.implicit)&&!Array.isArray(o.explicit))throw new e("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");o.implicit&&(r=r.concat(o.implicit)),o.explicit&&(s=s.concat(o.explicit))}r.forEach(function(i){if(!(i instanceof t))throw new e("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(i.loadKind&&"scalar"!==i.loadKind)throw new e("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(i.multi)throw new e("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),s.forEach(function(i){if(!(i instanceof t))throw new e("Specified list of YAML types (or a single Type object) contains a non-Type object.")});const n=Object.create(a.prototype);return n.implicit=(this.implicit||[]).concat(r),n.explicit=(this.explicit||[]).concat(s),n.compiledImplicit=i(n,"implicit"),n.compiledExplicit=i(n,"explicit"),n.compiledTypeMap=function(){const e={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}};function t(t){t.multi?(e.multi[t.kind].push(t),e.multi.fallback.push(t)):e[t.kind][t.tag]=e.fallback[t.tag]=t}for(let e=0,i=arguments.length;e<i;e+=1)arguments[e].forEach(t);return e}(n.compiledImplicit,n.compiledExplicit),n},_=a}function te(){if(p)return u;p=1;const e=X();return u=new e("tag:yaml.org,2002:str",{kind:"scalar",construct:function(e){return null!==e?e:""}})}function ie(){if(g)return m;g=1;const e=X();return m=new e("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(e){return null!==e?e:[]}})}function ae(){if(f)return y;f=1;const e=X();return y=new e("tag:yaml.org,2002:map",{kind:"mapping",construct:function(e){return null!==e?e:{}}})}function oe(){if(b)return v;b=1;const e=ee();return v=new e({explicit:[te(),ie(),ae()]})}function re(){if(k)return w;k=1;const e=X();return w=new e("tag:yaml.org,2002:null",{kind:"scalar",resolve:function(e){if(null===e)return!0;const t=e.length;return 1===t&&"~"===e||4===t&&("null"===e||"Null"===e||"NULL"===e)},construct:function(){return null},predicate:function(e){return null===e},represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"})}function se(){if(C)return x;C=1;const e=X();return x=new e("tag:yaml.org,2002:bool",{kind:"scalar",resolve:function(e){if(null===e)return!1;const t=e.length;return 4===t&&("true"===e||"True"===e||"TRUE"===e)||5===t&&("false"===e||"False"===e||"FALSE"===e)},construct:function(e){return"true"===e||"True"===e||"TRUE"===e},predicate:function(e){return"[object Boolean]"===Object.prototype.toString.call(e)},represent:{lowercase:function(e){return e?"true":"false"},uppercase:function(e){return e?"TRUE":"FALSE"},camelcase:function(e){return e?"True":"False"}},defaultStyle:"lowercase"})}function ne(){if(S)return $;S=1;const e=J(),t=X();function i(e){return e>=48&&e<=57||e>=65&&e<=70||e>=97&&e<=102}function a(e){return e>=48&&e<=55}function o(e){return e>=48&&e<=57}function r(e){let t=e,i=1,a=t[0];if("-"!==a&&"+"!==a||("-"===a&&(i=-1),t=t.slice(1),a=t[0]),"0"===t)return 0;if("0"===a){if("b"===t[1])return i*parseInt(t.slice(2),2);if("x"===t[1])return i*parseInt(t.slice(2),16);if("o"===t[1])return i*parseInt(t.slice(2),8)}return i*parseInt(t,10)}return $=new t("tag:yaml.org,2002:int",{kind:"scalar",resolve:function(e){if(null===e)return!1;const t=e.length;let s=0,n=!1;if(!t)return!1;let c=e[s];if("-"!==c&&"+"!==c||(c=e[++s]),"0"===c){if(s+1===t)return!0;if(c=e[++s],"b"===c){for(s++;s<t;s++){if(c=e[s],"0"!==c&&"1"!==c)return!1;n=!0}return n&&isFinite(r(e))}if("x"===c){for(s++;s<t;s++){if(!i(e.charCodeAt(s)))return!1;n=!0}return n&&isFinite(r(e))}if("o"===c){for(s++;s<t;s++){if(!a(e.charCodeAt(s)))return!1;n=!0}return n&&isFinite(r(e))}}for(;s<t;s++){if(!o(e.charCodeAt(s)))return!1;n=!0}return!!n&&isFinite(r(e))},construct:function(e){return r(e)},predicate:function(t){return"[object Number]"===Object.prototype.toString.call(t)&&t%1==0&&!e.isNegativeZero(t)},represent:{binary:function(e){return e>=0?"0b"+e.toString(2):"-0b"+e.toString(2).slice(1)},octal:function(e){return e>=0?"0o"+e.toString(8):"-0o"+e.toString(8).slice(1)},decimal:function(e){return e.toString(10)},hexadecimal:function(e){return e>=0?"0x"+e.toString(16).toUpperCase():"-0x"+e.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}})}function ce(){if(O)return A;O=1;const e=J(),t=X(),i=new RegExp("^(?:[-+]?(?:[0-9]+)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),a=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),o=/^[-+]?[0-9]+e/;return A=new t("tag:yaml.org,2002:float",{kind:"scalar",resolve:function(e){return null!==e&&!!i.test(e)&&(!!isFinite(parseFloat(e,10))||a.test(e))},construct:function(e){let t=e.toLowerCase();const i="-"===t[0]?-1:1;return"+-".indexOf(t[0])>=0&&(t=t.slice(1)),".inf"===t?1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:".nan"===t?NaN:i*parseFloat(t,10)},predicate:function(t){return"[object Number]"===Object.prototype.toString.call(t)&&(t%1!=0||e.isNegativeZero(t))},represent:function(t,i){if(isNaN(t))switch(i){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===t)switch(i){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===t)switch(i){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(e.isNegativeZero(t))return"-0.0";const a=t.toString(10);return o.test(a)?a.replace("e",".e"):a},defaultStyle:"lowercase"})}function de(){return I?E:(I=1,E=oe().extend({implicit:[re(),se(),ne(),ce()]}))}function le(){return P?L:(P=1,L=de())}function _e(){if(W)return q;W=1;const e=X(),t=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),i=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");return q=new e("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:function(e){return null!==e&&(null!==t.exec(e)||null!==i.exec(e))},construct:function(e){let a=0,o=null,r=t.exec(e);if(null===r&&(r=i.exec(e)),null===r)throw new Error("Date resolve error");const s=+r[1],n=+r[2]-1,c=+r[3];if(!r[4])return new Date(Date.UTC(s,n,c));const d=+r[4],l=+r[5],_=+r[6];if(r[7]){for(a=r[7].slice(0,3);a.length<3;)a+="0";a=+a}r[9]&&(o=6e4*(60*+r[10]+ +(r[11]||0)),"-"===r[9]&&(o=-o));const h=new Date(Date.UTC(s,n,c,d,l,_,a));return o&&h.setTime(h.getTime()-o),h},instanceOf:Date,represent:function(e){return e.toISOString()}})}function he(){if(T)return D;T=1;const e=X();return D=new e("tag:yaml.org,2002:merge",{kind:"scalar",resolve:function(e){return"<<"===e||null===e}})}function ue(){if(V)return K;V=1;const e=X(),t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";return K=new e("tag:yaml.org,2002:binary",{kind:"scalar",resolve:function(e){if(null===e)return!1;let i=0;const a=e.length,o=t;for(let t=0;t<a;t++){const a=o.indexOf(e.charAt(t));if(!(a>64)){if(a<0)return!1;i+=6}}return i%8==0},construct:function(e){const i=e.replace(/[\r\n=]/g,""),a=i.length,o=t;let r=0;const s=[];for(let e=0;e<a;e++)e%4==0&&e&&(s.push(r>>16&255),s.push(r>>8&255),s.push(255&r)),r=r<<6|o.indexOf(i.charAt(e));const n=a%4*6;return 0===n?(s.push(r>>16&255),s.push(r>>8&255),s.push(255&r)):18===n?(s.push(r>>10&255),s.push(r>>2&255)):12===n&&s.push(r>>4&255),new Uint8Array(s)},predicate:function(e){return"[object Uint8Array]"===Object.prototype.toString.call(e)},represent:function(e){let i="",a=0;const o=e.length,r=t;for(let t=0;t<o;t++)t%3==0&&t&&(i+=r[a>>18&63],i+=r[a>>12&63],i+=r[a>>6&63],i+=r[63&a]),a=(a<<8)+e[t];const s=o%3;return 0===s?(i+=r[a>>18&63],i+=r[a>>12&63],i+=r[a>>6&63],i+=r[63&a]):2===s?(i+=r[a>>10&63],i+=r[a>>4&63],i+=r[a<<2&63],i+=r[64]):1===s&&(i+=r[a>>2&63],i+=r[a<<4&63],i+=r[64],i+=r[64]),i}})}function pe(){if(j)return F;j=1;const e=X(),t=Object.prototype.hasOwnProperty,i=Object.prototype.toString;return F=new e("tag:yaml.org,2002:omap",{kind:"sequence",resolve:function(e){if(null===e)return!0;const a={},o=e;for(let e=0,r=o.length;e<r;e+=1){const r=o[e];let s,n=!1;if("[object Object]"!==i.call(r))return!1;for(s in r)if(t.call(r,s)){if(n)return!1;n=!0}if(!n)return!1;if(t.call(a,s))return!1;Object.defineProperty(a,s,{value:!0})}return!0},construct:function(e){return null!==e?e:[]}})}function me(){if(N)return M;N=1;const e=X(),t=Object.prototype.toString;return M=new e("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:function(e){if(null===e)return!0;const i=e,a=new Array(i.length);for(let e=0,o=i.length;e<o;e+=1){const o=i[e];if("[object Object]"!==t.call(o))return!1;const r=Object.keys(o);if(1!==r.length)return!1;a[e]=[r[0],o[r[0]]]}return!0},construct:function(e){if(null===e)return[];const t=e,i=new Array(t.length);for(let e=0,a=t.length;e<a;e+=1){const a=t[e],o=Object.keys(a);i[e]=[o[0],a[o[0]]]}return i}})}function ge(){if(H)return z;H=1;const e=X(),t=Object.prototype.hasOwnProperty;return z=new e("tag:yaml.org,2002:set",{kind:"mapping",resolve:function(e){if(null===e)return!0;const i=e;for(const e in i)if(t.call(i,e)&&null!==i[e])return!1;return!0},construct:function(e){return null!==e?e:{}}})}function ye(){return R?Y:(R=1,Y=le().extend({implicit:[_e(),he()],explicit:[ue(),pe(),me(),ge()]}))}function fe(){if(B)return G;B=1;const e=J(),t=Q(),i=function(){if(c)return n;c=1;const e=J();function t(e,t,i,a,o){let r="",s="";const n=Math.floor(o/2)-1;return a-t>n&&(r=" ... ",t=a-n+r.length),i-a>n&&(s=" ...",i=a+n-s.length),{str:r+e.slice(t,i).replace(/\t/g,"→")+s,pos:a-t+r.length}}function i(t,i){return e.repeat(" ",i-t.length)+t}return n=function(a,o){if(o=Object.create(o||null),!a.buffer)return null;o.maxLength||(o.maxLength=79),"number"!=typeof o.indent&&(o.indent=1),"number"!=typeof o.linesBefore&&(o.linesBefore=3),"number"!=typeof o.linesAfter&&(o.linesAfter=2);const r=/\r?\n|\r|\0/g,s=[0],n=[];let c,d=-1;for(;c=r.exec(a.buffer);)n.push(c.index),s.push(c.index+c[0].length),a.position<=c.index&&d<0&&(d=s.length-2);d<0&&(d=s.length-1);let l="";const _=Math.min(a.line+o.linesAfter,n.length).toString().length,h=o.maxLength-(o.indent+_+3);for(let r=1;r<=o.linesBefore&&!(d-r<0);r++){const c=t(a.buffer,s[d-r],n[d-r],a.position-(s[d]-s[d-r]),h);l=e.repeat(" ",o.indent)+i((a.line-r+1).toString(),_)+" | "+c.str+"\n"+l}const u=t(a.buffer,s[d],n[d],a.position,h);l+=e.repeat(" ",o.indent)+i((a.line+1).toString(),_)+" | "+u.str+"\n",l+=e.repeat("-",o.indent+_+3+u.pos)+"^\n";for(let r=1;r<=o.linesAfter&&!(d+r>=n.length);r++){const c=t(a.buffer,s[d+r],n[d+r],a.position-(s[d]-s[d+r]),h);l+=e.repeat(" ",o.indent)+i((a.line+r+1).toString(),_)+" | "+c.str+"\n"}return l.replace(/\n$/,"")}}(),a=ye(),o=Object.prototype.hasOwnProperty,r=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,s=/[\x85\u2028\u2029]/,d=/[,\[\]{}]/,l=/^(?:!|!!|![0-9A-Za-z-]+!)$/,_=/^(?:!|[^,\[\]{}])(?:%[0-9a-f]{2}|[0-9a-z\-#;/?:@&=+$,_.!~*'()\[\]])*$/i;function h(e){return Object.prototype.toString.call(e)}function u(e){return 10===e||13===e}function p(e){return 9===e||32===e}function m(e){return 9===e||32===e||10===e||13===e}function g(e){return 44===e||91===e||93===e||123===e||125===e}function y(e){if(e>=48&&e<=57)return e-48;const t=32|e;return t>=97&&t<=102?t-97+10:-1}function f(e){return 120===e?2:117===e?4:85===e?8:0}function v(e){return e>=48&&e<=57?e-48:-1}function b(e){switch(e){case 48:return"\0";case 97:return"";case 98:return"\b";case 116:case 9:return"\t";case 110:return"\n";case 118:return"\v";case 102:return"\f";case 114:return"\r";case 101:return"";case 32:return" ";case 34:return'"';case 47:return"/";case 92:return"\\";case 78:return"";case 95:return" ";case 76:return"\u2028";case 80:return"\u2029";default:return""}}function w(e){return e<=65535?String.fromCharCode(e):String.fromCharCode(55296+(e-65536>>10),56320+(e-65536&1023))}function k(e,t,i){"__proto__"===t?Object.defineProperty(e,t,{configurable:!0,enumerable:!0,writable:!0,value:i}):e[t]=i}const x=new Array(256),C=new Array(256);for(let e=0;e<256;e++)x[e]=b(e)?1:0,C[e]=b(e);function $(e,t){this.input=e,this.filename=t.filename||null,this.schema=t.schema||a,this.onWarning=t.onWarning||null,this.legacy=t.legacy||!1,this.json=t.json||!1,this.listener=t.listener||null,this.maxDepth="number"==typeof t.maxDepth?t.maxDepth:100,this.maxTotalMergeKeys="number"==typeof t.maxTotalMergeKeys?t.maxTotalMergeKeys:1e4,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.depth=0,this.totalMergeKeys=0,this.firstTabInLine=-1,this.documents=[],this.anchorMapTransactions=[]}function S(e,a){const o={name:e.filename,buffer:e.input.slice(0,-1),position:e.position,line:e.line,column:e.position-e.lineStart};return o.snippet=i(o),new t(a,o)}function A(e,t){throw S(e,t)}function O(e,t){e.onWarning&&e.onWarning.call(null,S(e,t))}function E(e,t,i){const a=e.anchorMapTransactions;if(0!==a.length){const i=a[a.length-1];o.call(i,t)||(i[t]={existed:o.call(e.anchorMap,t),value:e.anchorMap[t]})}e.anchorMap[t]=i}function I(e){return{position:e.position,line:e.line,lineStart:e.lineStart,lineIndent:e.lineIndent,firstTabInLine:e.firstTabInLine,tag:e.tag,anchor:e.anchor,kind:e.kind,result:e.result}}function L(e,t){e.position=t.position,e.line=t.line,e.lineStart=t.lineStart,e.lineIndent=t.lineIndent,e.firstTabInLine=t.firstTabInLine,e.tag=t.tag,e.anchor=t.anchor,e.kind=t.kind,e.result=t.result}const P={YAML:function(e,t,i){null!==e.version&&A(e,"duplication of %YAML directive"),1!==i.length&&A(e,"YAML directive accepts exactly one argument");const a=/^([0-9]+)\.([0-9]+)$/.exec(i[0]);null===a&&A(e,"ill-formed argument of the YAML directive");const o=parseInt(a[1],10),r=parseInt(a[2],10);1!==o&&A(e,"unacceptable YAML version of the document"),e.version=i[0],e.checkLineBreaks=r<2,1!==r&&2!==r&&O(e,"unsupported YAML version of the document")},TAG:function(e,t,i){let a;2!==i.length&&A(e,"TAG directive accepts exactly two arguments");const r=i[0];a=i[1],l.test(r)||A(e,"ill-formed tag handle (first argument) of the TAG directive"),o.call(e.tagMap,r)&&A(e,'there is a previously declared suffix for "'+r+'" tag handle'),_.test(a)||A(e,"ill-formed tag prefix (second argument) of the TAG directive");try{a=decodeURIComponent(a)}catch(t){A(e,"tag prefix is malformed: "+a)}e.tagMap[r]=a}};function q(e,t,i,a){if(t<i){const o=e.input.slice(t,i);if(a)for(let t=0,i=o.length;t<i;t+=1){const i=o.charCodeAt(t);9===i||i>=32&&i<=1114111||A(e,"expected valid JSON character")}else r.test(o)&&A(e,"the stream contains non-printable characters");e.result+=o}}function W(e){e.totalMergeKeys++,-1!==e.maxTotalMergeKeys&&e.totalMergeKeys>e.maxTotalMergeKeys&&A(e,"merge keys exceeded maxTotalMergeKeys ("+e.maxTotalMergeKeys+")")}function D(t,i,a,r){e.isObject(a)||A(t,"cannot merge mappings; the provided source object is unacceptable"),W(t);const s=Object.keys(a);for(let e=0,n=s.length;e<n;e+=1){const n=s[e];W(t),o.call(i,n)||(k(i,n,a[n]),r[n]=!0)}}function T(e,t,i,a,r,s,n,c,d){if(Array.isArray(r))for(let t=0,i=(r=Array.prototype.slice.call(r)).length;t<i;t+=1)Array.isArray(r[t])&&A(e,"nested arrays are not supported inside keys"),"object"==typeof r&&"[object Object]"===h(r[t])&&(r[t]="[object Object]");if("object"==typeof r&&"[object Object]"===h(r)&&(r="[object Object]"),r=String(r),null===t&&(t={}),"tag:yaml.org,2002:merge"===a)if(Array.isArray(s)){s.length>100&&A(e,"abnormal merge sequence size");for(let a=0,o=s.length;a<o;a+=1)D(e,t,s[a],i)}else D(e,t,s,i);else e.json||o.call(i,r)||!o.call(t,r)||(e.line=n||e.line,e.lineStart=c||e.lineStart,e.position=d||e.position,A(e,"duplicated mapping key")),k(t,r,s),delete i[r];return t}function K(e){const t=e.input.charCodeAt(e.position);10===t?e.position++:13===t?(e.position++,10===e.input.charCodeAt(e.position)&&e.position++):A(e,"a line break is expected"),e.line+=1,e.lineStart=e.position,e.firstTabInLine=-1}function V(e,t,i){let a=0,o=e.input.charCodeAt(e.position);for(;0!==o;){for(;p(o);)9===o&&-1===e.firstTabInLine&&(e.firstTabInLine=e.position),o=e.input.charCodeAt(++e.position);if(t&&35===o)do{o=e.input.charCodeAt(++e.position)}while(10!==o&&13!==o&&0!==o);if(!u(o))break;for(K(e),o=e.input.charCodeAt(e.position),a++,e.lineIndent=0;32===o;)e.lineIndent++,o=e.input.charCodeAt(++e.position)}return-1!==i&&0!==a&&e.lineIndent<i&&O(e,"deficient indentation"),a}function F(e){let t=e.position,i=e.input.charCodeAt(t);return!(45!==i&&46!==i||i!==e.input.charCodeAt(t+1)||i!==e.input.charCodeAt(t+2)||(t+=3,i=e.input.charCodeAt(t),0!==i&&!m(i)))}function j(t,i){1===i?t.result+=" ":i>1&&(t.result+=e.repeat("\n",i-1))}function M(e,t){const i=e.tag,a=e.anchor,o=[];let r=!1;if(-1!==e.firstTabInLine)return!1;null!==e.anchor&&E(e,e.anchor,o);let s=e.input.charCodeAt(e.position);for(;0!==s&&(-1!==e.firstTabInLine&&(e.position=e.firstTabInLine,A(e,"tab characters must not be used in indentation")),45===s)&&m(e.input.charCodeAt(e.position+1));){if(r=!0,e.position++,V(e,!0,-1)&&e.lineIndent<=t){o.push(null),s=e.input.charCodeAt(e.position);continue}const i=e.line;if(Y(e,t,3,!1,!0),o.push(e.result),V(e,!0,-1),s=e.input.charCodeAt(e.position),(e.line===i||e.lineIndent>t)&&0!==s)A(e,"bad indentation of a sequence entry");else if(e.lineIndent<t)break}return!!r&&(e.tag=i,e.anchor=a,e.kind="sequence",e.result=o,!0)}function N(e,t,i){let a,o,r,s;const n=e.tag,c=e.anchor,d={},l=Object.create(null);let _=null,h=null,u=null,g=!1,y=!1;if(-1!==e.firstTabInLine)return!1;null!==e.anchor&&E(e,e.anchor,d);let f=e.input.charCodeAt(e.position);for(;0!==f;){g||-1===e.firstTabInLine||(e.position=e.firstTabInLine,A(e,"tab characters must not be used in indentation"));const v=e.input.charCodeAt(e.position+1),b=e.line;if(63!==f&&58!==f||!m(v)){if(o=e.line,r=e.lineStart,s=e.position,!Y(e,i,2,!1,!0))break;if(e.line===b){for(f=e.input.charCodeAt(e.position);p(f);)f=e.input.charCodeAt(++e.position);if(58===f)f=e.input.charCodeAt(++e.position),m(f)||A(e,"a whitespace character is expected after the key-value separator within a block mapping"),g&&(T(e,d,l,_,h,null,o,r,s),_=h=u=null),y=!0,g=!1,a=!1,_=e.tag,h=e.result;else{if(!y)return e.tag=n,e.anchor=c,!0;A(e,"can not read an implicit mapping pair; a colon is missed")}}else{if(!y)return e.tag=n,e.anchor=c,!0;A(e,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else 63===f?(g&&(T(e,d,l,_,h,null,o,r,s),_=h=u=null),y=!0,g=!0,a=!0):g?(g=!1,a=!0):A(e,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),e.position+=1,f=v;if((e.line===b||e.lineIndent>t)&&(g&&(o=e.line,r=e.lineStart,s=e.position),Y(e,t,4,!0,a)&&(g?h=e.result:u=e.result),g||(T(e,d,l,_,h,u,o,r,s),_=h=u=null),V(e,!0,-1),f=e.input.charCodeAt(e.position)),(e.line===b||e.lineIndent>t)&&0!==f)A(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return g&&T(e,d,l,_,h,null,o,r,s),y&&(e.tag=n,e.anchor=c,e.kind="mapping",e.result=d),y}function z(e){let t,i,a=!1,r=!1,s=e.input.charCodeAt(e.position);if(33!==s)return!1;null!==e.tag&&A(e,"duplication of a tag property"),s=e.input.charCodeAt(++e.position),60===s?(a=!0,s=e.input.charCodeAt(++e.position)):33===s?(r=!0,t="!!",s=e.input.charCodeAt(++e.position)):t="!";let n=e.position;if(a){do{s=e.input.charCodeAt(++e.position)}while(0!==s&&62!==s);e.position<e.length?(i=e.input.slice(n,e.position),s=e.input.charCodeAt(++e.position)):A(e,"unexpected end of the stream within a verbatim tag")}else{for(;0!==s&&!m(s);)33===s&&(r?A(e,"tag suffix cannot contain exclamation marks"):(t=e.input.slice(n-1,e.position+1),l.test(t)||A(e,"named tag handle cannot contain such characters"),r=!0,n=e.position+1)),s=e.input.charCodeAt(++e.position);i=e.input.slice(n,e.position),d.test(i)&&A(e,"tag suffix cannot contain flow indicator characters")}i&&!_.test(i)&&A(e,"tag name cannot contain such characters: "+i);try{i=decodeURIComponent(i)}catch(t){A(e,"tag name is malformed: "+i)}return a?e.tag=i:o.call(e.tagMap,t)?e.tag=e.tagMap[t]+i:"!"===t?e.tag="!"+i:"!!"===t?e.tag="tag:yaml.org,2002:"+i:A(e,'undeclared tag handle "'+t+'"'),!0}function H(e){let t=e.input.charCodeAt(e.position);if(38!==t)return!1;null!==e.anchor&&A(e,"duplication of an anchor property"),t=e.input.charCodeAt(++e.position);const i=e.position;for(;0!==t&&!m(t)&&!g(t);)t=e.input.charCodeAt(++e.position);return e.position===i&&A(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(i,e.position),!0}function Y(t,i,a,r,s){let n,c,d,l,_,h=1,b=!1,k=!1,$=null;t.depth>=t.maxDepth&&A(t,"nesting exceeded maxDepth ("+t.maxDepth+")"),t.depth+=1,null!==t.listener&&t.listener("open",t),t.tag=null,t.anchor=null,t.kind=null,t.result=null;const S=n=c=4===a||3===a;if(r&&V(t,!0,-1)&&(b=!0,t.lineIndent>i?h=1:t.lineIndent===i?h=0:t.lineIndent<i&&(h=-1)),1===h)for(;;){const e=t.input.charCodeAt(t.position),a=I(t);if(b&&(33===e&&null!==t.tag||38===e&&null!==t.anchor))break;if(!z(t)&&!H(t))break;null===$&&($=a),V(t,!0,-1)?(b=!0,c=S,t.lineIndent>i?h=1:t.lineIndent===i?h=0:t.lineIndent<i&&(h=-1)):c=!1}if(c&&(c=b||s),1===h||4===a)if(l=1===a||2===a?i:i+1,_=t.position-t.lineStart,1===h)if(c&&(M(t,_)||N(t,_,l))||function(e,t){let i,a,o,r=!0;const s=e.tag;let n;const c=e.anchor;let d,l,_,h;const u=Object.create(null);let p,g,y,f=e.input.charCodeAt(e.position);if(91===f)d=93,h=!1,n=[];else{if(123!==f)return!1;d=125,h=!0,n={}}for(null!==e.anchor&&E(e,e.anchor,n),f=e.input.charCodeAt(++e.position);0!==f;){if(V(e,!0,t),f=e.input.charCodeAt(e.position),f===d)return e.position++,e.tag=s,e.anchor=c,e.kind=h?"mapping":"sequence",e.result=n,!0;r?44===f&&A(e,"expected the node content, but found ','"):A(e,"missed comma between flow collection entries"),g=p=y=null,l=_=!1,63===f&&m(e.input.charCodeAt(e.position+1))&&(l=_=!0,e.position++,V(e,!0,t)),i=e.line,a=e.lineStart,o=e.position,Y(e,t,1,!1,!0),g=e.tag,p=e.result,V(e,!0,t),f=e.input.charCodeAt(e.position),!_&&e.line!==i||58!==f||(l=!0,f=e.input.charCodeAt(++e.position),V(e,!0,t),Y(e,t,1,!1,!0),y=e.result),h?T(e,n,u,g,p,y,i,a,o):l?n.push(T(e,null,u,g,p,y,i,a,o)):n.push(p),V(e,!0,t),f=e.input.charCodeAt(e.position),44===f?(r=!0,f=e.input.charCodeAt(++e.position)):r=!1}A(e,"unexpected end of the stream within a flow collection")}(t,l))k=!0;else{const i=t.input.charCodeAt(t.position);null!==$&&S&&!c&&124!==i&&62!==i&&function(e,t,i,a){const r=I(e);return function(e){e.anchorMapTransactions.push(Object.create(null))}(e),L(e,t),e.tag=null,e.anchor=null,e.kind=null,e.result=null,N(e,i,a)&&"mapping"===e.kind?(function(e){const t=e.anchorMapTransactions.pop(),i=e.anchorMapTransactions;if(0===i.length)return;const a=i[i.length-1],r=Object.keys(t);for(let e=0,i=r.length;e<i;e+=1){const i=r[e];o.call(a,i)||(a[i]=t[i])}}(e),!0):(function(e){const t=e.anchorMapTransactions.pop(),i=Object.keys(t);for(let a=i.length-1;a>=0;a-=1){const o=t[i[a]];o.existed?e.anchorMap[i[a]]=o.value:delete e.anchorMap[i[a]]}}(e),L(e,r),!1)}(t,$,$.position-$.lineStart,l)||n&&function(t,i){let a,o,r=1,s=!1,n=!1,c=i,d=0,l=!1,_=t.input.charCodeAt(t.position);if(124===_)a=!1;else{if(62!==_)return!1;a=!0}for(t.kind="scalar",t.result="";0!==_;)if(_=t.input.charCodeAt(++t.position),43===_||45===_)1===r?r=43===_?3:2:A(t,"repeat of a chomping mode identifier");else{if(!((o=v(_))>=0))break;0===o?A(t,"bad explicit indentation width of a block scalar; it cannot be less than one"):n?A(t,"repeat of an indentation width identifier"):(c=i+o-1,n=!0)}if(p(_)){do{_=t.input.charCodeAt(++t.position)}while(p(_));if(35===_)do{_=t.input.charCodeAt(++t.position)}while(!u(_)&&0!==_)}for(;0!==_;){for(K(t),t.lineIndent=0,_=t.input.charCodeAt(t.position);(!n||t.lineIndent<c)&&32===_;)t.lineIndent++,_=t.input.charCodeAt(++t.position);if(!n&&t.lineIndent>c&&(c=t.lineIndent),u(_)){d++;continue}if(n||0!==c||A(t,"missing indentation for block scalar"),t.lineIndent<c){3===r?t.result+=e.repeat("\n",s?1+d:d):1===r&&s&&(t.result+="\n");break}a?p(_)?(l=!0,t.result+=e.repeat("\n",s?1+d:d)):l?(l=!1,t.result+=e.repeat("\n",d+1)):0===d?s&&(t.result+=" "):t.result+=e.repeat("\n",d):t.result+=e.repeat("\n",s?1+d:d),s=!0,n=!0,d=0;const i=t.position;for(;!u(_)&&0!==_;)_=t.input.charCodeAt(++t.position);q(t,i,t.position,!1)}return!0}(t,l)||function(e,t){let i,a,o=e.input.charCodeAt(e.position);if(39!==o)return!1;for(e.kind="scalar",e.result="",e.position++,i=a=e.position;0!==(o=e.input.charCodeAt(e.position));)if(39===o){if(q(e,i,e.position,!0),o=e.input.charCodeAt(++e.position),39!==o)return!0;i=e.position,e.position++,a=e.position}else u(o)?(q(e,i,a,!0),j(e,V(e,!1,t)),i=a=e.position):e.position===e.lineStart&&F(e)?A(e,"unexpected end of the document within a single quoted scalar"):(e.position++,p(o)||(a=e.position));A(e,"unexpected end of the stream within a single quoted scalar")}(t,l)||function(e,t){let i,a,o,r=e.input.charCodeAt(e.position);if(34!==r)return!1;for(e.kind="scalar",e.result="",e.position++,i=a=e.position;0!==(r=e.input.charCodeAt(e.position));){if(34===r)return q(e,i,e.position,!0),e.position++,!0;if(92===r){if(q(e,i,e.position,!0),r=e.input.charCodeAt(++e.position),u(r))V(e,!1,t);else if(r<256&&x[r])e.result+=C[r],e.position++;else if((o=f(r))>0){let t=o,i=0;for(;t>0;t--)r=e.input.charCodeAt(++e.position),(o=y(r))>=0?i=(i<<4)+o:A(e,"expected hexadecimal character");e.result+=w(i),e.position++}else A(e,"unknown escape sequence");i=a=e.position}else u(r)?(q(e,i,a,!0),j(e,V(e,!1,t)),i=a=e.position):e.position===e.lineStart&&F(e)?A(e,"unexpected end of the document within a double quoted scalar"):(e.position++,p(r)||(a=e.position))}A(e,"unexpected end of the stream within a double quoted scalar")}(t,l)?k=!0:function(e){let t=e.input.charCodeAt(e.position);if(42!==t)return!1;t=e.input.charCodeAt(++e.position);const i=e.position;for(;0!==t&&!m(t)&&!g(t);)t=e.input.charCodeAt(++e.position);e.position===i&&A(e,"name of an alias node must contain at least one character");const a=e.input.slice(i,e.position);return o.call(e.anchorMap,a)||A(e,'unidentified alias "'+a+'"'),e.result=e.anchorMap[a],V(e,!0,-1),!0}(t)?(k=!0,null===t.tag&&null===t.anchor||A(t,"alias node should not have any properties")):function(e,t,i){let a,o,r,s,n,c;const d=e.kind,l=e.result;let _=e.input.charCodeAt(e.position);if(m(_)||g(_)||35===_||38===_||42===_||33===_||124===_||62===_||39===_||34===_||37===_||64===_||96===_)return!1;if(63===_||45===_){const t=e.input.charCodeAt(e.position+1);if(m(t)||i&&g(t))return!1}for(e.kind="scalar",e.result="",a=o=e.position,r=!1;0!==_;){if(58===_){const t=e.input.charCodeAt(e.position+1);if(m(t)||i&&g(t))break}else if(35===_){if(m(e.input.charCodeAt(e.position-1)))break}else{if(e.position===e.lineStart&&F(e)||i&&g(_))break;if(u(_)){if(s=e.line,n=e.lineStart,c=e.lineIndent,V(e,!1,-1),e.lineIndent>=t){r=!0,_=e.input.charCodeAt(e.position);continue}e.position=o,e.line=s,e.lineStart=n,e.lineIndent=c;break}}r&&(q(e,a,o,!1),j(e,e.line-s),a=o=e.position,r=!1),p(_)||(o=e.position+1),_=e.input.charCodeAt(++e.position)}return q(e,a,o,!1),!!e.result||(e.kind=d,e.result=l,!1)}(t,l,1===a)&&(k=!0,null===t.tag&&(t.tag="?")),null!==t.anchor&&E(t,t.anchor,t.result)}else 0===h&&(k=c&&M(t,_));if(null===t.tag)null!==t.anchor&&E(t,t.anchor,t.result);else if("?"===t.tag){null!==t.result&&"scalar"!==t.kind&&A(t,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+t.kind+'"');for(let e=0,i=t.implicitTypes.length;e<i;e+=1)if(d=t.implicitTypes[e],d.resolve(t.result)){t.result=d.construct(t.result),t.tag=d.tag,null!==t.anchor&&E(t,t.anchor,t.result);break}}else if("!"!==t.tag){if(o.call(t.typeMap[t.kind||"fallback"],t.tag))d=t.typeMap[t.kind||"fallback"][t.tag];else{d=null;const e=t.typeMap.multi[t.kind||"fallback"];for(let i=0,a=e.length;i<a;i+=1)if(t.tag.slice(0,e[i].tag.length)===e[i].tag){d=e[i];break}}d||A(t,"unknown tag !<"+t.tag+">"),null!==t.result&&d.kind!==t.kind&&A(t,"unacceptable node kind for !<"+t.tag+'> tag; it should be "'+d.kind+'", not "'+t.kind+'"'),d.resolve(t.result,t.tag)?(t.result=d.construct(t.result,t.tag),null!==t.anchor&&E(t,t.anchor,t.result)):A(t,"cannot resolve a node with !<"+t.tag+"> explicit tag")}return null!==t.listener&&t.listener("close",t),t.depth-=1,null!==t.tag||null!==t.anchor||k}function R(e){const t=e.position;let i,a=!1;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap=Object.create(null),e.anchorMap=Object.create(null);0!==(i=e.input.charCodeAt(e.position))&&(V(e,!0,-1),i=e.input.charCodeAt(e.position),!(e.lineIndent>0||37!==i));){a=!0,i=e.input.charCodeAt(++e.position);let t=e.position;for(;0!==i&&!m(i);)i=e.input.charCodeAt(++e.position);const r=e.input.slice(t,e.position),s=[];for(r.length<1&&A(e,"directive name must not be less than one character in length");0!==i;){for(;p(i);)i=e.input.charCodeAt(++e.position);if(35===i){do{i=e.input.charCodeAt(++e.position)}while(0!==i&&!u(i));break}if(u(i))break;for(t=e.position;0!==i&&!m(i);)i=e.input.charCodeAt(++e.position);s.push(e.input.slice(t,e.position))}0!==i&&K(e),o.call(P,r)?P[r](e,r,s):O(e,'unknown document directive "'+r+'"')}V(e,!0,-1),0===e.lineIndent&&45===e.input.charCodeAt(e.position)&&45===e.input.charCodeAt(e.position+1)&&45===e.input.charCodeAt(e.position+2)?(e.position+=3,V(e,!0,-1)):a&&A(e,"directives end mark is expected"),Y(e,e.lineIndent-1,4,!1,!0),V(e,!0,-1),e.checkLineBreaks&&s.test(e.input.slice(t,e.position))&&O(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&F(e)?46===e.input.charCodeAt(e.position)&&(e.position+=3,V(e,!0,-1)):e.position<e.length-1&&A(e,"end of the stream or a document separator is expected")}function U(e,t){t=t||{},0!==(e=String(e)).length&&(10!==e.charCodeAt(e.length-1)&&13!==e.charCodeAt(e.length-1)&&(e+="\n"),65279===e.charCodeAt(0)&&(e=e.slice(1)));const i=new $(e,t),a=e.indexOf("\0");for(-1!==a&&(i.position=a,A(i,"null byte is not allowed in input")),i.input+="\0";32===i.input.charCodeAt(i.position);)i.lineIndent+=1,i.position+=1;for(;i.position<i.length-1;)R(i);return i.documents}return G.loadAll=function(e,t,i){null!==t&&"object"==typeof t&&void 0===i&&(i=t,t=null);const a=U(e,i);if("function"!=typeof t)return a;for(let e=0,i=a.length;e<i;e+=1)t(a[e])},G.load=function(e,i){const a=U(e,i);if(0!==a.length){if(1===a.length)return a[0];throw new t("expected a single document in the stream, but found more")}},G}var ve,be,we={};function ke(){if(ve)return we;ve=1;const e=J(),t=Q(),i=ye(),a=Object.prototype.toString,o=Object.prototype.hasOwnProperty,r=65279,s={0:"\\0",7:"\\a",8:"\\b",9:"\\t",10:"\\n",11:"\\v",12:"\\f",13:"\\r",27:"\\e",34:'\\"',92:"\\\\",133:"\\N",160:"\\_",8232:"\\L",8233:"\\P"},n=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],c=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function d(i){let a,o;const r=i.toString(16).toUpperCase();if(i<=255)a="x",o=2;else if(i<=65535)a="u",o=4;else{if(!(i<=4294967295))throw new t("code point within a string may not be greater than 0xFFFFFFFF");a="U",o=8}return"\\"+a+e.repeat("0",o-r.length)+r}function l(t){this.schema=t.schema||i,this.indent=Math.max(1,t.indent||2),this.noArrayIndent=t.noArrayIndent||!1,this.skipInvalid=t.skipInvalid||!1,this.flowLevel=e.isNothing(t.flowLevel)?-1:t.flowLevel,this.styleMap=function(e,t){if(null===t)return{};const i={},a=Object.keys(t);for(let r=0,s=a.length;r<s;r+=1){let s=a[r],n=String(t[s]);"!!"===s.slice(0,2)&&(s="tag:yaml.org,2002:"+s.slice(2));const c=e.compiledTypeMap.fallback[s];c&&o.call(c.styleAliases,n)&&(n=c.styleAliases[n]),i[s]=n}return i}(this.schema,t.styles||null),this.sortKeys=t.sortKeys||!1,this.lineWidth=t.lineWidth||80,this.noRefs=t.noRefs||!1,this.noCompatMode=t.noCompatMode||!1,this.condenseFlow=t.condenseFlow||!1,this.quotingType='"'===t.quotingType?2:1,this.forceQuotes=t.forceQuotes||!1,this.replacer="function"==typeof t.replacer?t.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function _(t,i){const a=e.repeat(" ",i);let o=0,r="";const s=t.length;for(;o<s;){let e;const i=t.indexOf("\n",o);-1===i?(e=t.slice(o),o=s):(e=t.slice(o,i+1),o=i+1),e.length&&"\n"!==e&&(r+=a),r+=e}return r}function h(t,i){return"\n"+e.repeat(" ",t.indent*i)}function u(e){return 32===e||9===e}function p(e){return e>=32&&e<=126||e>=161&&e<=55295&&8232!==e&&8233!==e||e>=57344&&e<=65533&&e!==r||e>=65536&&e<=1114111}function m(e){return p(e)&&e!==r&&13!==e&&10!==e}function g(e,t,i){const a=m(e),o=a&&!u(e);return(i?a:a&&44!==e&&91!==e&&93!==e&&123!==e&&125!==e)&&35!==e&&!(58===t&&!o)||m(t)&&!u(t)&&35===e||58===t&&o}function y(e,t){const i=e.charCodeAt(t);let a;return i>=55296&&i<=56319&&t+1<e.length&&(a=e.charCodeAt(t+1),a>=56320&&a<=57343)?1024*(i-55296)+a-56320+65536:i}function f(e){return/^\n* /.test(e)}function v(e,i,a,o,l){e.dump=function(){if(0===i.length)return 2===e.quotingType?'""':"''";if(!e.noCompatMode&&(-1!==n.indexOf(i)||c.test(i)))return 2===e.quotingType?'"'+i+'"':"'"+i+"'";const h=e.indent*Math.max(1,a),m=-1===e.lineWidth?-1:Math.max(Math.min(e.lineWidth,40),e.lineWidth-h),v=o||e.flowLevel>-1&&a>=e.flowLevel;switch(function(e,t,i,a,o,s,n,c){let d,l=0,_=null,h=!1,m=!1;const v=-1!==a;let b=-1,w=p(k=y(e,0))&&k!==r&&!u(k)&&45!==k&&63!==k&&58!==k&&44!==k&&91!==k&&93!==k&&123!==k&&125!==k&&35!==k&&38!==k&&42!==k&&33!==k&&124!==k&&61!==k&&62!==k&&39!==k&&34!==k&&37!==k&&64!==k&&96!==k&&function(e){return!u(e)&&58!==e}(y(e,e.length-1));var k;if(t||n)for(d=0;d<e.length;l>=65536?d+=2:d++){if(l=y(e,d),!p(l))return 5;w=w&&g(l,_,c),_=l}else{for(d=0;d<e.length;l>=65536?d+=2:d++){if(l=y(e,d),10===l)h=!0,v&&(m=m||d-b-1>a&&" "!==e[b+1],b=d);else if(!p(l))return 5;w=w&&g(l,_,c),_=l}m=m||v&&d-b-1>a&&" "!==e[b+1]}return h||m?i>9&&f(e)?5:n?2===s?5:2:m?4:3:!w||n||o(e)?2===s?5:2:1}(i,v,e.indent,m,function(t){return function(e,t){for(let i=0,a=e.implicitTypes.length;i<a;i+=1)if(e.implicitTypes[i].resolve(t))return!0;return!1}(e,t)},e.quotingType,e.forceQuotes&&!o,l)){case 1:return i;case 2:return"'"+i.replace(/'/g,"''")+"'";case 3:return"|"+b(i,e.indent)+w(_(i,h));case 4:return">"+b(i,e.indent)+w(_(function(e,t){const i=/(\n+)([^\n]*)/g;let a,o,r=function(){let a=e.indexOf("\n");return a=-1!==a?a:e.length,i.lastIndex=a,k(e.slice(0,a),t)}(),s="\n"===e[0]||" "===e[0];for(;o=i.exec(e);){const e=o[1],i=o[2];a=" "===i[0],r+=e+(s||a||""===i?"":"\n")+k(i,t),s=a}return r}(i,m),h));case 5:return'"'+function(e){let t="",i=0;for(let a=0;a<e.length;i>=65536?a+=2:a++){i=y(e,a);const o=s[i];!o&&p(i)?(t+=e[a],i>=65536&&(t+=e[a+1])):t+=o||d(i)}return t}(i)+'"';default:throw new t("impossible error: invalid scalar style")}}()}function b(e,t){const i=f(e)?String(t):"",a="\n"===e[e.length-1];return i+(!a||"\n"!==e[e.length-2]&&"\n"!==e?a?"":"-":"+")+"\n"}function w(e){return"\n"===e[e.length-1]?e.slice(0,-1):e}function k(e,t){if(""===e||" "===e[0])return e;const i=/ [^ ]/g;let a,o,r=0,s=0,n=0,c="";for(;a=i.exec(e);)n=a.index,n-r>t&&(o=s>r?s:n,c+="\n"+e.slice(r,o),r=o+1),s=n;return c+="\n",e.length-r>t&&s>r?c+=e.slice(r,s)+"\n"+e.slice(s+1):c+=e.slice(r),c.slice(1)}function x(e,t,i,a){let o="";const r=e.tag;for(let r=0,s=i.length;r<s;r+=1){let s=i[r];e.replacer&&(s=e.replacer.call(i,String(r),s)),($(e,t+1,s,!0,!0,!1,!0)||void 0===s&&$(e,t+1,null,!0,!0,!1,!0))&&(a&&""===o||(o+=h(e,t)),e.dump&&10===e.dump.charCodeAt(0)?o+="-":o+="- ",o+=e.dump)}e.tag=r,e.dump=o||"[]"}function C(e,i,r){const s=r?e.explicitTypes:e.implicitTypes;for(let n=0,c=s.length;n<c;n+=1){const c=s[n];if((c.instanceOf||c.predicate)&&(!c.instanceOf||"object"==typeof i&&i instanceof c.instanceOf)&&(!c.predicate||c.predicate(i))){if(r?c.multi&&c.representName?e.tag=c.representName(i):e.tag=c.tag:e.tag="?",c.represent){const r=e.styleMap[c.tag]||c.defaultStyle;let s;if("[object Function]"===a.call(c.represent))s=c.represent(i,r);else{if(!o.call(c.represent,r))throw new t("!<"+c.tag+'> tag resolver accepts not "'+r+'" style');s=c.represent[r](i,r)}e.dump=s}return!0}}return!1}function $(e,i,o,r,s,n,c){e.tag=null,e.dump=o,C(e,o,!1)||C(e,o,!0);const d=a.call(e.dump),l=r;r&&(r=e.flowLevel<0||e.flowLevel>i);const _="[object Object]"===d||"[object Array]"===d;let u,p;if(_&&(u=e.duplicates.indexOf(o),p=-1!==u),(null!==e.tag&&"?"!==e.tag||p||2!==e.indent&&i>0)&&(s=!1),p&&e.usedDuplicates[u])e.dump="*ref_"+u;else{if(_&&p&&!e.usedDuplicates[u]&&(e.usedDuplicates[u]=!0),"[object Object]"===d)r&&0!==Object.keys(e.dump).length?(function(e,i,a,o){let r="";const s=e.tag,n=Object.keys(a);if(!0===e.sortKeys)n.sort();else if("function"==typeof e.sortKeys)n.sort(e.sortKeys);else if(e.sortKeys)throw new t("sortKeys must be a boolean or a function");for(let t=0,s=n.length;t<s;t+=1){let s="";o&&""===r||(s+=h(e,i));const c=n[t];let d=a[c];if(e.replacer&&(d=e.replacer.call(a,c,d)),!$(e,i+1,c,!0,!0,!0))continue;const l=null!==e.tag&&"?"!==e.tag||e.dump&&e.dump.length>1024;l&&(e.dump&&10===e.dump.charCodeAt(0)?s+="?":s+="? "),s+=e.dump,l&&(s+=h(e,i)),$(e,i+1,d,!0,l)&&(e.dump&&10===e.dump.charCodeAt(0)?s+=":":s+=": ",s+=e.dump,r+=s)}e.tag=s,e.dump=r||"{}"}(e,i,e.dump,s),p&&(e.dump="&ref_"+u+e.dump)):(function(e,t,i){let a="";const o=e.tag,r=Object.keys(i);for(let o=0,s=r.length;o<s;o+=1){let s="";""!==a&&(s+=", "),e.condenseFlow&&(s+='"');const n=r[o];let c=i[n];e.replacer&&(c=e.replacer.call(i,n,c)),$(e,t,n,!1,!1)&&(e.dump.length>1024&&(s+="? "),s+=e.dump+(e.condenseFlow?'"':"")+":"+(e.condenseFlow?"":" "),$(e,t,c,!1,!1)&&(s+=e.dump,a+=s))}e.tag=o,e.dump="{"+a+"}"}(e,i,e.dump),p&&(e.dump="&ref_"+u+" "+e.dump));else if("[object Array]"===d)r&&0!==e.dump.length?(e.noArrayIndent&&!c&&i>0?x(e,i-1,e.dump,s):x(e,i,e.dump,s),p&&(e.dump="&ref_"+u+e.dump)):(function(e,t,i){let a="";const o=e.tag;for(let o=0,r=i.length;o<r;o+=1){let r=i[o];e.replacer&&(r=e.replacer.call(i,String(o),r)),($(e,t,r,!1,!1)||void 0===r&&$(e,t,null,!1,!1))&&(""!==a&&(a+=","+(e.condenseFlow?"":" ")),a+=e.dump)}e.tag=o,e.dump="["+a+"]"}(e,i,e.dump),p&&(e.dump="&ref_"+u+" "+e.dump));else{if("[object String]"!==d){if("[object Undefined]"===d)return!1;if(e.skipInvalid)return!1;throw new t("unacceptable kind of an object to dump "+d)}"?"!==e.tag&&v(e,e.dump,i,n,l)}if(null!==e.tag&&"?"!==e.tag){let t=encodeURI("!"===e.tag[0]?e.tag.slice(1):e.tag).replace(/!/g,"%21");t="!"===e.tag[0]?"!"+t:"tag:yaml.org,2002:"===t.slice(0,18)?"!!"+t.slice(18):"!<"+t+">",e.dump=t+" "+e.dump}}return!0}function S(e,t){const i=[],a=[];A(e,i,a);const o=a.length;for(let e=0;e<o;e+=1)t.duplicates.push(i[a[e]]);t.usedDuplicates=new Array(o)}function A(e,t,i){if(null!==e&&"object"==typeof e){const a=t.indexOf(e);if(-1!==a)-1===i.indexOf(a)&&i.push(a);else if(t.push(e),Array.isArray(e))for(let a=0,o=e.length;a<o;a+=1)A(e[a],t,i);else{const a=Object.keys(e);for(let o=0,r=a.length;o<r;o+=1)A(e[a[o]],t,i)}}}return we.dump=function(e,t){const i=new l(t=t||{});i.noRefs||S(e,i);let a=e;return i.replacer&&(a=i.replacer.call({"":a},"",a)),$(i,0,a,!0,!0)?i.dump+"\n":""},we}const xe=a(function(){if(be)return U;be=1;const e=fe(),t=ke();function i(e,t){return function(){throw new Error("Function yaml."+e+" is removed in js-yaml 4. Use yaml."+t+" instead, which is now safe by default.")}}return U.Type=X(),U.Schema=ee(),U.FAILSAFE_SCHEMA=oe(),U.JSON_SCHEMA=de(),U.CORE_SCHEMA=le(),U.DEFAULT_SCHEMA=ye(),U.load=e.load,U.loadAll=e.loadAll,U.dump=t.dump,U.YAMLException=Q(),U.types={binary:ue(),float:ce(),map:ae(),null:re(),pairs:me(),set:ge(),timestamp:_e(),bool:se(),int:ne(),merge:he(),omap:pe(),seq:ie(),str:te()},U.safeLoad=i("safeLoad","load"),U.safeLoadAll=i("safeLoadAll","loadAll"),U.safeDump=i("safeDump","dump"),U}()),{Type:Ce,Schema:$e,FAILSAFE_SCHEMA:Se,JSON_SCHEMA:Ae,CORE_SCHEMA:Oe,DEFAULT_SCHEMA:Ee,load:Ie,loadAll:Le,dump:Pe,YAMLException:qe,types:We,safeLoad:De,safeLoadAll:Te,safeDump:Ke}=xe;function Ve(e){return(e instanceof Error?e.message.split("\n")[0]:"Ungültiges YAML")||"Ungültiges YAML"}function Fe(e,t){if(!e.trim())return{parsed_config:void 0};try{const i=xe.load(e);return i&&"object"==typeof i?{parsed_config:i}:{parsed_config:void 0,_yaml_error:t}}catch(e){return{parsed_config:void 0,_yaml_error:Ve(e)}}}var je=i(6684);const Me=[{type:"tile",name:"Kachel",icon:"mdi:square-rounded",template:'type: tile\nentity: ""\n'},{type:"entities",name:"Entitätsliste",icon:"mdi:format-list-bulleted",template:'type: entities\nentities:\n  - entity: ""\n'},{type:"glance",name:"Glance",icon:"mdi:eye",template:'type: glance\nentities:\n  - entity: ""\n'},{type:"button",name:"Button",icon:"mdi:gesture-tap-button",template:'type: button\nentity: ""\ntap_action:\n  action: toggle\n'},{type:"markdown",name:"Text / Markdown",icon:"mdi:language-markdown",template:'type: markdown\ncontent: "**Text**"\n'},{type:"heading",name:"Überschrift",icon:"mdi:format-header-1",template:'type: heading\nheading: "Überschrift"\nheading_style: title\nicon: mdi:home\n'},{type:"weather-forecast",name:"Wettervorhersage",icon:"mdi:weather-partly-cloudy",template:'type: weather-forecast\nentity: ""\nshow_current: true\nshow_forecast: true\nforecast_type: daily\n'},{type:"gauge",name:"Messanzeige",icon:"mdi:gauge",template:'type: gauge\nentity: ""\nmin: 0\nmax: 100\n'},{type:"thermostat",name:"Thermostat",icon:"mdi:thermostat",template:'type: thermostat\nentity: ""\n'},{type:"media-control",name:"Mediensteuerung",icon:"mdi:play-circle",template:'type: media-control\nentity: ""\n'},{type:"history-graph",name:"Verlaufsgraph",icon:"mdi:chart-line",template:'type: history-graph\nentities:\n  - entity: ""\nhours_to_show: 24\n'},{type:"statistics-graph",name:"Statistikgraph",icon:"mdi:chart-bar",template:'type: statistics-graph\nentities:\n  - entity: ""\nstat_types:\n  - mean\nchart_type: line\nperiod: 5minute\n'},{type:"picture",name:"Bild",icon:"mdi:image",template:'type: picture\nimage: ""\n'},{type:"picture-entity",name:"Entity-Bild",icon:"mdi:image-outline",template:'type: picture-entity\nentity: ""\n'},{type:"map",name:"Karte",icon:"mdi:map",template:'type: map\nentities:\n  - entity: ""\n'},{type:"todo-list",name:"Aufgabenliste",icon:"mdi:checkbox-marked-circle",template:'type: todo-list\nentity: ""\n'},{type:"logbook",name:"Logbuch",icon:"mdi:history",template:'type: logbook\nentity: ""\nhours_to_show: 24\n'},{type:"alarm-panel",name:"Alarmanlage",icon:"mdi:shield-home",template:'type: alarm-panel\nentity: ""\n'},{type:"energy-distribution",name:"Energieverteilung",icon:"mdi:lightning-bolt",template:"type: energy-distribution\n"},{type:"grid",name:"Raster",icon:"mdi:grid",template:"type: grid\ncards: []\n"}];var Ne=i(1113),ze=i(3401),He=i(3294);var Ye=i(8627),Re=i(9526);const Be={hide_unavailable_entities:{kind:"boolean",defaultValue:!1,labelKey:"editor.hide_unavailable_entities",values:[!0,!1]},dense_section_placement:{kind:"boolean",defaultValue:!1,labelKey:"editor.dense_section_placement",values:[!0,!1]},show_light_summary:{kind:"boolean",defaultValue:!0,labelKey:"editor.show_light_summary",values:[!0,!1]},show_covers_summary:{kind:"boolean",defaultValue:!0,labelKey:"editor.show_covers_summary",values:[!0,!1]},show_security_summary:{kind:"boolean",defaultValue:!0,labelKey:"editor.show_security_summary",values:[!0,!1]},show_climate_summary:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_climate_summary",values:[!0,!1]},show_battery_summary:{kind:"boolean",defaultValue:!0,labelKey:"editor.show_battery_summary",values:[!0,!1]},show_person_badges:{kind:"boolean",defaultValue:!0,labelKey:"editor.show_person_badges",values:[!0,!1]},show_unavailable_alert_badge:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_unavailable_alert_badge",values:[!0,!1]},show_now_playing_badge:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_now_playing_badge",values:[!0,!1]},show_sun_badge:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_sun_badge",values:[!0,!1]},show_updates_badge:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_updates_badge",values:[!0,!1]},show_clock_card:{kind:"boolean",defaultValue:!0,labelKey:"editor.show_clock_card",values:[!0,!1]},show_search_card:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_search_card",values:[!0,!1]},show_security_view:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_security_view",values:[!0,!1]},group_security_by_areas:{kind:"boolean",defaultValue:!1,labelKey:"editor.group_security_by_areas",values:[!0,!1]},hide_hidden_areas_in_security:{kind:"boolean",defaultValue:!1,labelKey:"editor.hide_hidden_areas_in_security",values:[!0,!1]},show_security_activity:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_security_activity",values:[!0,!1]},show_light_view:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_light_view",values:[!0,!1]},group_lights_by_floors:{kind:"boolean",defaultValue:!1,labelKey:"editor.group_lights_by_floors",values:[!0,!1]},group_lights_by_areas:{kind:"boolean",defaultValue:!1,labelKey:"editor.group_lights_by_areas",values:[!0,!1]},show_covers_view:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_covers_view",values:[!0,!1]},group_covers_by_floors:{kind:"boolean",defaultValue:!1,labelKey:"editor.group_covers_by_floors",values:[!0,!1]},group_covers_by_areas:{kind:"boolean",defaultValue:!1,labelKey:"editor.group_covers_by_areas",values:[!0,!1]},show_climate_view:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_climate_view",values:[!0,!1]},nested_light_groups:{kind:"boolean",defaultValue:!1,labelKey:"editor.nested_light_groups",values:[!0,!1]},show_partially_open_covers:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_partially_open_covers",values:[!0,!1]},hide_mobile_app_batteries:{kind:"boolean",defaultValue:!1,labelKey:"editor.hide_mobile_app_batteries",values:[!0,!1]},hide_battery_notes_entities:{kind:"boolean",defaultValue:!1,labelKey:"editor.hide_battery_notes_entities",values:[!0,!1]},show_battery_view:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_battery_view",values:[!0,!1]},show_area_in_battery_view:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_area_in_battery_view",values:[!0,!1]},group_batteries_by_areas:{kind:"boolean",defaultValue:!1,labelKey:"editor.group_batteries_by_areas",values:[!0,!1]},favorites_show_state:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_state",values:[!0,!1]},favorites_hide_last_changed:{kind:"boolean",defaultValue:!1,labelKey:"editor.hide_last_changed",values:[!0,!1]},group_by_floors:{kind:"boolean",defaultValue:!1,labelKey:"editor.group_by_floors",values:[!0,!1]},show_switches_on_areas:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_switches_on_areas",values:[!0,!1]},show_alerts_on_areas:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_alerts_on_areas",values:[!0,!1]},show_locks_in_rooms:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_locks_in_rooms",values:[!0,!1]},show_automations_in_rooms:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_automations_in_rooms",values:[!0,!1]},show_scripts_in_rooms:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_scripts_in_rooms",values:[!0,!1]},show_vacuums_section_in_rooms:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_vacuums_section_in_rooms",values:[!0,!1]},show_switches_section_in_rooms:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_switches_section_in_rooms",values:[!0,!1]},show_helpers_section_in_rooms:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_helpers_section_in_rooms",values:[!0,!1]},show_sensors_section_in_rooms:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_sensors_section_in_rooms",values:[!0,!1]},show_cover_controls_in_rooms:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_cover_controls_in_rooms",values:[!0,!1]},show_cameras_in_rooms:{kind:"boolean",defaultValue:!0,labelKey:"editor.show_cameras_in_rooms",values:[!0,!1]},camera_live_toggle:{kind:"boolean",defaultValue:!1,labelKey:"editor.camera_live_toggle",values:[!0,!1]},show_energy_in_rooms:{kind:"boolean",defaultValue:!0,labelKey:"editor.show_energy_in_rooms",values:[!0,!1]},show_ups_in_rooms:{kind:"boolean",defaultValue:!0,labelKey:"editor.show_ups_in_rooms",values:[!0,!1]},hide_grouped_climate_members:{kind:"boolean",defaultValue:!0,labelKey:"editor.hide_grouped_climate_members",values:[!0,!1]},show_windows_summary:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_windows_summary",values:[!0,!1]},compact_overview_summaries:{kind:"boolean",defaultValue:!1,labelKey:"editor.compact_overview_summaries",values:[!0,!1]},show_climate_air_quality:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_climate_air_quality",values:[!0,!1]},hide_completed_todos:{kind:"boolean",defaultValue:!1,labelKey:"editor.hide_completed_todos",values:[!0,!1]},show_window_contacts_in_rooms:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_window_contacts_in_rooms",values:[!0,!1]},show_door_contacts_in_rooms:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_door_contacts_in_rooms",values:[!0,!1]},use_default_area_sort:{kind:"boolean",defaultValue:!1,labelKey:"editor.use_default_area_sort",values:[!0,!1]},room_pins_show_state:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_state",values:[!0,!1]},room_pins_hide_last_changed:{kind:"boolean",defaultValue:!1,labelKey:"editor.hide_last_changed",values:[!0,!1]},overview_max_columns:{kind:"select",defaultValue:3,labelKey:"editor.overview_max_columns",values:[1,2,3,4]},overview_area_card_columns:{kind:"select",defaultValue:"full",labelKey:"editor.overview_area_card_columns",values:["full",6,4]},weather_start_weather_mode:{kind:"select",labelKey:"editor.weather_start_weather_mode",values:["full","compact_hourly"]},weather_start_date_card:{kind:"select",defaultValue:"button-card",labelKey:"editor.weather_start_date_card",values:["button-card","markdown"]},battery_critical_threshold:{kind:"number",defaultValue:20,labelKey:"editor.battery_critical_below",min:0,max:100},battery_low_threshold:{kind:"number",defaultValue:50,labelKey:"editor.battery_low_below",min:0,max:100},camera_renderer:{kind:"select",defaultValue:"native",labelKey:"editor.camera_renderer",values:["native","webrtc"]},camera_pause_when_hidden:{kind:"boolean",defaultValue:!1,labelKey:"editor.camera_pause_when_hidden",values:[!0,!1],dependencies:[{option:"camera_renderer",value:"native"},{option:"camera_live_toggle",value:!0}]},show_cctv_view:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_cctv_view",values:[!0,!1],aliases:Ye.G.show_cctv_view},show_maintenance_view:{kind:"boolean",labelKey:"editor.show_maintenance_view",values:[!0,!1],aliases:Ye.G.show_maintenance_view},house_mode_entity:{kind:"entity",labelKey:"editor.house_mode_entity"},alarm_entity:{kind:"entity",labelKey:"editor.alarm_entity"},weather_entity:{kind:"entity",labelKey:"editor.weather_entity"},power_badge_entity:{kind:"entity",labelKey:"editor.power_badge_entity"}};function Ue(e){return Be[e]}function Ge(e,t,i){return"weather_start_weather_mode"===e?(0,Re.EB)(t)?"compact_hourly":"full":Ue(e)?.defaultValue??i}var Ze=i(9787),Je=i(5609),Qe=i(5374),Xe=i(2659),et=i(850),tt=i(245),it=i(9829);const at=/^[a-z_]+\.[a-z0-9_]+$/,ot=new Set(["entity","entity_id","entities","camera_image","room_pin_entities","quick_action_entities","favorites","light_favorites","additional","hidden","temperature_sensor","humidity_sensor"]);class rt{analyze(e){return this._analysis&&e===this._config||(this._config=e,this._analysis=function(e){(0,Je.DB)("diagnostics-analysis");const t=[],i=[],a=[],o=new WeakSet,r=e&&"object"==typeof e?e:{},s=new WeakSet,n=(e,i,a)=>{"string"==typeof e&&at.test(e)?t.push({entityId:e,path:i,purpose:a}):Array.isArray(e)&&!s.has(e)&&(s.add(e),e.forEach((e,t)=>n(e,`${i}[${t}]`,a)),s.delete(e))},c=(e,t)=>{i.push({code:e,severity:"info",path:t})},d=(e,t,i=0)=>{if(!(!e||"object"!=typeof e||i>50||o.has(e))){if(o.add(e),Array.isArray(e))e.forEach((e,a)=>d(e,`${t}[${a}]`,i+1));else{const o=e;if("custom:advanced-camera-card"===o.type){const e=o.live;!0===e?.preload&&Array.isArray(e.auto_pause)&&0===e.auto_pause.length&&c("camera_preload",t)}for(const[e,r]of Object.entries(o)){if(e.startsWith("_")||"parsed_config"===e&&"string"==typeof o.yaml)continue;const s=t?`${t}.${e}`:e;if("navigation_path"===e&&"string"==typeof r&&/^[a-z][a-z0-9_-]*$/.test(r)&&a.push({path:s,target:r}),"yaml"===e&&"string"==typeof r){(0,Je.DB)("diagnostics-yaml");try{d(xe.load(r),s,i+1)}catch{}}else("entity"===Ue(e)?.kind||ot.has(e)||e.endsWith("_entity")||e.endsWith("_entities")||e.endsWith("_entity_id"))&&n(r,s,"hidden"===e?"exclusion":"display"),d(r,s,i+1)}}o.delete(e)}};d(e,""),(Array.isArray(r.weather_start_layout_items)?r.weather_start_layout_items:[]).forEach((e,t)=>{if(!e||e.yaml||e.parsed_config)return;const i=`weather_start_layout_items[${t}]`;"house_mode"!==e.type||r.house_mode_entity||c("house_mode_unconfigured",i),"custom_card"!==e.type||r.custom_cards?.some(t=>t.id===e.custom_card_id)||c("layout_reference",i),"custom_section"!==e.type||r.custom_sections?.some(t=>t.id===e.custom_section_id)||c("layout_reference",i)});for(const[e,t]of Object.entries(r.areas_options??{}))t?.view_override&&c("room_override",`areas_options.${e}.view_override`);return{references:t,hints:i,links:a,config:r}}(e)),this._analysis}inspect(e,t){return function(e,t){const i=[...e.hints];if(e.links.length){const a=(0,Qe.V$)(e.config,t);for(const t of e.links)a.has(t.target)||i.push({code:"navigation_target",severity:"warning",path:t.path})}for(const[a,o]of(e.config.weather_start_layout_items??[]).entries())o.yaml||o.parsed_config||("area"===o.type&&o.area_id&&!t.areas[o.area_id]||"floor"===o.type&&o.floor_id&&!t.floors[o.floor_id])&&i.push({code:"layout_reference",severity:"info",path:`weather_start_layout_items[${a}]`});const a=e=>"exclusion"===e.purpose&&!e.path.includes("groups_options.badges"),o=new Set(e.references.filter(a).map(e=>e.entityId));let r;return[...i,...st(e.config,t,o),...(0,it.O)(e.config,t).map(({path:e,entityId:t})=>({code:"option_label_excluded",severity:"warning",path:e,entityId:t})),...e.references.flatMap(i=>{if(a(i)&&(0,et.uo)(t,i.entityId,(i=>{if(i.startsWith("climate.")&&!1!==e.config.hide_grouped_climate_members)return r??(r=(0,et.BC)(t,o))})(i.entityId)))return[{code:"redundant_exclusion",severity:"info",path:i.path,entityId:i.entityId}];const s=t.entities[i.entityId],n=t.states[i.entityId];let c;return s?.disabled_by?c="disabled":n?"unavailable"===n.state?c="unavailable":"unknown"!==n.state||(0,Xe.bu)(i.entityId)||(c="unknown"):c=s?"no_state":"missing",!c||"exclusion"===i.purpose&&"missing"!==c?[]:[{code:`entity_${c}`,severity:"exclusion"===i.purpose?"info":"missing"===c?"error":"warning",path:i.path,entityId:i.entityId,status:c}]})]}(this.analyze(e),t)}}function st(e,t,i){const a=new Set(e.areas_display?.hidden??[]),o=[];for(const r of Object.values(t.areas??{})){if(a.has(r.area_id))continue;const s=`areas_options.${r.area_id}`;let n;for(const a of["temperature","humidity"]){const c="temperature"===a?r.temperature_entity_id:r.humidity_entity_id;if(!c)continue;const d=(0,Ne.po)(t,c);if(d){n??(n=(0,tt.NS)(r.area_id,t,e));const i=!!(0,Ne.yJ)(r,a,t,n);o.push(i?{code:"area_sensor_replaced",severity:"info",path:s,entityId:c}:{code:`area_sensor_${d}`,severity:"warning",path:s,entityId:c})}else(i.has(c)||(0,et.uo)(t,c))&&o.push({code:"area_sensor_override",severity:"info",path:s,entityId:c})}}return o}function nt(e,t){const i=e.entities[t]?.entity_category;return"config"===i||"diagnostic"===i}var ct=i(6217),dt=i(2654),lt=(i(7773),i(2563)),_t=i(880);const ht=[{labelKey:"editor.section_overview",panels:["overview","summaries","overviewSections","favorites","appearance","details","sectionOrder"]},{labelKey:"editor.section_areas_rooms",panels:["areas","areaOptions","roomPins","views"]},{labelKey:"editor.section_advanced",panels:["advanced","customContent"]}],ut={overview:{key:"overview",icon:"mdi:view-dashboard-outline",labelKey:"editor.section_overview"},summaries:{key:"summaries",icon:"mdi:counter",labelKey:"editor.section_summaries"},favorites:{key:"favorites",icon:"mdi:star-outline",labelKey:"editor.section_favorites"},areas:{key:"areas",icon:"mdi:floor-plan",labelKey:"editor.section_areas_rooms"},appearance:{key:"appearance",icon:"mdi:palette-outline",labelKey:"editor.section_overview_details"},details:{key:"details",icon:"mdi:tune-variant",labelKey:"editor.section_summary_details"},areaOptions:{key:"area-options",icon:"mdi:home-cog-outline",labelKey:"editor.section_areas"},roomPins:{key:"room-pins",icon:"mdi:pin-outline",labelKey:"editor.section_room_pins"},views:{key:"views",icon:"mdi:tab",labelKey:"editor.section_views"},advanced:{key:"advanced-options",icon:"mdi:cog-outline",labelKey:"editor.section_advanced_options"},sectionOrder:{key:"section-order",icon:"mdi:sort",labelKey:"editor.section_order"},overviewSections:{key:"overview-sections",icon:"mdi:view-grid-outline",labelKey:"editor.section_overview_sections"},customContent:{key:"custom-content",icon:"mdi:view-grid-plus-outline",labelKey:"editor.section_custom_content"}};function pt(e){const t=ut[e];return{key:t.key,icon:t.icon,label:(0,ze.kg)(t.labelKey)}}const mt={weather_entity:"overview",overview_max_columns:"overview",overview_area_card_columns:"overview",weather_start_weather_mode:"overview",weather_start_date_card:"overview",show_light_summary:"summaries",show_covers_summary:"summaries",show_security_summary:"summaries",show_climate_summary:"summaries",show_battery_summary:"summaries",show_windows_summary:"summaries",compact_overview_summaries:"summaries",show_person_badges:"appearance",show_unavailable_alert_badge:"appearance",show_now_playing_badge:"appearance",show_sun_badge:"appearance",show_updates_badge:"appearance",show_clock_card:"appearance",show_search_card:"appearance",house_mode_entity:"appearance",alarm_entity:"appearance",power_badge_entity:"appearance",show_security_view:"details",group_security_by_areas:"details",hide_hidden_areas_in_security:"details",show_security_activity:"details",show_light_view:"details",group_lights_by_floors:"details",group_lights_by_areas:"details",nested_light_groups:"details",show_covers_view:"details",group_covers_by_floors:"details",group_covers_by_areas:"details",show_partially_open_covers:"details",show_climate_view:"details",show_climate_air_quality:"details",show_battery_view:"details",show_area_in_battery_view:"details",group_batteries_by_areas:"details",hide_mobile_app_batteries:"details",hide_battery_notes_entities:"details",battery_critical_threshold:"details",battery_low_threshold:"details",hide_unavailable_entities:"advanced",dense_section_placement:"advanced",hide_completed_todos:"advanced",favorites_show_state:"favorites",favorites_hide_last_changed:"favorites",room_pins_show_state:"roomPins",room_pins_hide_last_changed:"roomPins",group_by_floors:"areaOptions",show_switches_on_areas:"areaOptions",show_alerts_on_areas:"areaOptions",show_locks_in_rooms:"areaOptions",show_automations_in_rooms:"areaOptions",show_scripts_in_rooms:"areaOptions",show_vacuums_section_in_rooms:"areaOptions",show_switches_section_in_rooms:"areaOptions",show_helpers_section_in_rooms:"areaOptions",show_sensors_section_in_rooms:"areaOptions",show_cover_controls_in_rooms:"areaOptions",show_cameras_in_rooms:"areaOptions",camera_live_toggle:"areaOptions",camera_pause_when_hidden:"areaOptions",show_energy_in_rooms:"areaOptions",show_ups_in_rooms:"areaOptions",hide_grouped_climate_members:"areaOptions",show_window_contacts_in_rooms:"areaOptions",show_door_contacts_in_rooms:"areaOptions",use_default_area_sort:"areaOptions",show_cctv_view:"views",show_maintenance_view:"views",camera_renderer:null},gt=[{key:"favorite_entities",labelKey:"editor.section_favorites",panel:"favorites"},{key:"light_favorite_entities",labelKey:"editor.section_favorites",panel:"favorites"},{key:"room_pin_entities",labelKey:"editor.section_room_pins",panel:"roomPins"},{key:"areas_display",labelKey:"editor.section_areas_rooms",panel:"areas"},{key:"areas_options",labelKey:"editor.section_areas",panel:"areaOptions"},{key:"custom_views",labelKey:"editor.section_views",panel:"views"},{key:"custom_cards",labelKey:"editor.section_custom_content",panel:"customContent"},{key:"custom_sections",labelKey:"editor.section_custom_content",panel:"customContent"},{key:"custom_badges",labelKey:"editor.section_custom_content",panel:"customContent"},{key:"sections_order",labelKey:"editor.section_order",panel:"sectionOrder"},{key:"weather_start_order",labelKey:"editor.section_order",panel:"sectionOrder"},{key:"weather_start_layout_items",labelKey:"editor.section_order",panel:"sectionOrder"}];function yt(e){return e.normalize("NFD").replace(/\p{M}/gu,"").toLowerCase()}function ft(e){const t=(0,ze.kg)(e);return t===e?"":t}function vt(e,t){const i=function(e,t){const i=e;if(void 0!==i[t])return i[t];for(const e of Ye.G[t]??[])if(void 0!==i[e])return i[e]}(e,t);if(null==i||""===i)return!1;if(Array.isArray(i))return i.length>0;if("object"==typeof i)return Object.keys(i).length>0;const a=Ue(t);if(!a)return!0;if("entity"===a.kind)return!0;const o=Ge(t,e);return void 0===o||i!==o}const bt=[je.AH`
  :host {
    display: block;
  }
  .panel-title {
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .custom-item {
    min-width: 0;
    overflow-wrap: anywhere;
  }
  @media (max-width: 480px) {
    :host .form-row {
      flex-direction: column;
      align-items: stretch;
    }
    :host .form-row > select,
    :host .form-row > input {
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
      flex: none !important;
    }
    :host .form-row > label {
      min-width: 0 !important;
      overflow-wrap: anywhere;
    }
  }
`,je.AH`
    /* -- Base layout --------------------------------------------------- */
    .card-config {
      padding: 16px;
      font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
      font-size: var(--mdc-typography-body1-font-size, 14px);
      color: var(--primary-text-color);
    }
    .panel-navigation {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 20px;
      padding: 12px 16px;
      border: 1px solid var(--divider-color, #e8e8e8);
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--card-background-color, #fff);
    }
    .panel-navigation label {
      font-weight: 500;
    }
    .panel-navigation select {
      min-width: 0;
      max-width: 100%;
      flex: 1 1 220px;
      padding: 7px 9px;
      border: 1px solid var(--divider-color, #e8e8e8);
      border-radius: 8px;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      font: inherit;
    }
    .option-search {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 20px;
      padding: 12px 16px;
      border: 1px solid var(--divider-color, #e8e8e8);
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--card-background-color, #fff);
    }
    .option-search-input {
      width: 100%;
      box-sizing: border-box;
      padding: 8px 10px;
      border: 1px solid var(--divider-color, #e8e8e8);
      border-radius: 8px;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      font: inherit;
    }
    .option-search-results {
      display: flex;
      flex-direction: column;
      gap: 6px;
      max-height: 320px;
      margin: 0;
      padding: 0;
      overflow: auto;
      list-style: none;
    }
    .option-search-result {
      display: flex;
      flex-direction: column;
      gap: 2px;
      width: 100%;
      padding: 8px 10px;
      border: 1px solid var(--divider-color, #e8e8e8);
      border-radius: 8px;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
    }
    .option-search-result:disabled {
      opacity: 0.7;
      cursor: default;
    }
    .option-search-result:hover:not(:disabled),
    .option-search-result:focus-visible {
      border-color: var(--primary-color);
    }
    .option-search-meta {
      color: var(--secondary-text-color);
      font-size: 0.85em;
    }
    .section {
      margin-bottom: 16px;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #e8e8e8);
      border-radius: var(--ha-card-border-radius, 12px);
      padding: 16px;
      transition: box-shadow 0.2s ease;
    }
    .section.panel {
      padding: 0;
      overflow: visible;
    }
    .section.panel.collapsed {
      overflow: hidden;
    }
    .panel-header {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 13px 16px;
      background: none;
      border: none;
      cursor: pointer;
      font: inherit;
      color: var(--primary-text-color);
      text-align: left;
    }
    .panel-header:hover {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .panel-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color);
    }
    .panel-title {
      flex: 1;
      font-size: 15px;
      font-weight: 500;
    }
    .panel-chevron {
      --mdc-icon-size: 22px;
      color: var(--secondary-text-color);
      transition: transform 0.2s ease;
    }
    .panel.collapsed .panel-chevron {
      transform: rotate(-90deg);
    }
    .panel-body {
      padding: 12px 16px 16px;
      border-top: 1px solid var(--divider-color, #e8e8e8);
    }
    .section-title {
      font-size: 15px;
      font-weight: 500;
      margin: 0 0 12px 0;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--divider-color, #e8e8e8);
      color: var(--primary-text-color);
      letter-spacing: 0.01em;
    }

    /* -- Form rows ----------------------------------------------------- */
    .form-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }
    .form-row input[type='checkbox'],
    .form-row input[type='radio'] {
      margin-right: 8px;
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: var(--primary-color);
    }
    .form-row input[type='checkbox']:disabled,
    .form-row input[type='radio']:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
    .form-row label {
      cursor: pointer;
      user-select: none;
      font-size: 14px;
      color: var(--primary-text-color);
    }
    .form-row label.disabled-label {
      cursor: not-allowed;
      opacity: 0.5;
    }
    .form-row .alarm-select {
      flex: 1;
      max-width: 300px;
    }
    .description {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin: 2px 0 12px 26px;
      line-height: 1.4;
    }
    .description strong {
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .option-groups {
      display: grid;
      gap: 12px;
      margin-bottom: 14px;
    }
    .option-group {
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 12px;
      background: var(--secondary-background-color);
    }
    .option-group-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .option-group-title ha-icon {
      --mdc-icon-size: 18px;
      color: var(--secondary-text-color);
    }
    .option-group .description {
      margin-bottom: 10px;
    }
    .option-group .description:last-child {
      margin-bottom: 0;
    }

    /* -- Native <select> — HA-like ------------------------------------- */
    select,
    .form-row select {
      cursor: pointer;
      font-family: inherit;
      font-size: 14px;
      padding: 10px 32px 10px 12px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
      background-color: var(--card-background-color);
      color: var(--primary-text-color);
      appearance: none;
      -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath fill='%236e6e6e' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 10px center;
      background-size: 16px;
      transition: border-color 0.2s ease;
    }
    select:focus,
    .form-row select:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 1px var(--primary-color);
    }
    select:hover,
    .form-row select:hover {
      border-color: var(--primary-color);
    }

    /* -- Native <input type="text/number"> — HA-like ------------------- */
    input[type='text'],
    input[type='number'] {
      font-family: inherit;
      font-size: 14px;
      padding: 10px 12px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      transition: border-color 0.2s ease;
      box-sizing: border-box;
    }
    input[type='text']:focus,
    input[type='number']:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 1px var(--primary-color);
    }
    input[type='text']:hover,
    input[type='number']:hover {
      border-color: var(--primary-color);
    }
    input[type='text']::placeholder {
      color: var(--secondary-text-color);
      opacity: 0.7;
    }

    /* -- Native <textarea> — YAML editors ------------------------------ */
    textarea {
      font-family: 'Roboto Mono', 'SFMono-Regular', 'Consolas', 'Liberation Mono', monospace;
      font-size: 12px;
      line-height: 1.5;
      padding: 12px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      resize: vertical;
      min-height: 80px;
      box-sizing: border-box;
      transition: border-color 0.2s ease;
      tab-size: 2;
    }
    textarea:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 1px var(--primary-color);
    }
    textarea:hover {
      border-color: var(--primary-color);
    }
    textarea::placeholder {
      color: var(--secondary-text-color);
      opacity: 0.7;
      font-family: inherit;
    }

    /* -- Buttons — HA-like --------------------------------------------- */
    button {
      font-family: inherit;
      font-size: 14px;
    }
    .btn-primary {
      padding: 10px 20px;
      border-radius: var(--ha-card-border-radius, 12px);
      border: none;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      cursor: pointer;
      font-weight: 500;
      transition:
        opacity 0.2s ease,
        box-shadow 0.2s ease;
      white-space: nowrap;
    }
    .btn-primary:hover {
      opacity: 0.85;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    }
    .btn-primary:active {
      opacity: 0.75;
    }
    .btn-remove {
      padding: 6px 10px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 14px;
      transition:
        color 0.2s ease,
        border-color 0.2s ease;
      line-height: 1;
    }
    .btn-remove:hover {
      color: var(--error-color, #db4437);
      border-color: var(--error-color, #db4437);
    }
    .icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      padding: 4px;
      border-radius: 4px;
      display: inline-flex;
      align-items: center;
      transition: color 0.15s ease;
    }
    .icon-btn:hover {
      color: var(--primary-text-color);
    }
    .text-btn {
      background: none;
      border: 1px solid var(--divider-color);
      cursor: pointer;
      color: var(--secondary-text-color);
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 13px;
      transition:
        color 0.15s ease,
        border-color 0.15s ease;
    }
    .text-btn:hover {
      color: var(--primary-text-color);
      border-color: var(--primary-color);
    }

    /* -- Area list ----------------------------------------------------- */
    .area-list {
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
      overflow: hidden;
    }
    .area-item {
      border-bottom: 1px solid var(--divider-color);
      background: var(--card-background-color);
    }
    .area-item:last-child {
      border-bottom: none;
    }
    .area-item.dragging {
      opacity: 0.5;
    }
    .area-item.drag-over {
      border-top: 2px solid var(--primary-color);
    }
    .area-header {
      display: flex;
      align-items: center;
      padding: 12px 16px;
    }
    .drag-handle {
      margin-right: 12px;
      color: var(--secondary-text-color);
      cursor: grab;
      user-select: none;
      padding: 4px;
    }
    .drag-handle:active {
      cursor: grabbing;
    }
    .area-checkbox {
      margin-right: 12px;
      accent-color: var(--primary-color);
    }
    .area-name {
      flex: 1;
      font-size: 14px;
      font-weight: 500;
    }
    .area-icon {
      margin-left: 8px;
      margin-right: 12px;
      color: var(--secondary-text-color);
    }
    .nav-pin-button {
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      color: var(--secondary-text-color);
      opacity: 0.4;
      transition:
        opacity 0.15s,
        color 0.15s;
      display: flex;
      align-items: center;
    }
    .nav-pin-button.pinned {
      color: var(--primary-color);
      opacity: 1;
    }
    .nav-pin-button:hover:not(:disabled) {
      opacity: 1;
    }
    .nav-pin-button:disabled {
      opacity: 0.2;
      cursor: not-allowed;
    }
    .expand-button {
      background: none;
      border: none;
      padding: 4px 8px;
      cursor: pointer;
      color: var(--secondary-text-color);
      transition: transform 0.2s;
    }
    .expand-button:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    .expand-button.expanded .expand-icon {
      transform: rotate(90deg);
    }
    .expand-icon {
      display: inline-block;
      transition: transform 0.2s;
    }
    .area-content {
      padding: 0 12px 12px 48px;
      background: var(--secondary-background-color);
    }
    .loading-placeholder {
      padding: 12px;
      text-align: center;
      color: var(--secondary-text-color);
      font-style: italic;
    }

    /* -- Section order list --------------------------------------------- */
    .section-order-list {
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
      overflow: hidden;
    }
    .section-order-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid var(--divider-color);
      background: var(--card-background-color);
      transition: opacity 0.2s;
    }
    .section-order-item:last-child {
      border-bottom: none;
    }
    .section-order-item.dragging {
      opacity: 0.4;
    }
    .section-order-item.drag-over {
      border-top: 2px solid var(--primary-color);
    }
    .section-order-item.disabled {
      opacity: 0.5;
    }
    .section-order-item .drag-handle {
      margin-right: 12px;
      color: var(--secondary-text-color);
      cursor: grab;
      user-select: none;
      padding: 4px;
    }
    .section-order-item .drag-handle:active {
      cursor: grabbing;
    }
    .section-order-item .section-icon {
      margin-right: 10px;
      color: var(--secondary-text-color);
      --mdc-icon-size: 20px;
    }
    .section-order-item .section-label {
      flex: 1;
      font-size: 14px;
      font-weight: 500;
    }
    .stack-move-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 40px;
      min-height: 40px;
      border: 0;
      border-radius: 8px;
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .stack-move-button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: -2px;
    }
    .stack-move-button:disabled {
      opacity: 0.35;
      cursor: default;
    }
    .section-order-item .section-hidden-tag {
      font-size: 12px;
      color: var(--secondary-text-color);
      font-style: italic;
      margin-left: 8px;
    }
    .section-order-compact {
      margin-top: 8px;
      padding: 10px 12px;
      border: 1px dashed var(--divider-color);
      border-radius: 8px;
      background: var(--secondary-background-color);
    }
    .compact-title {
      margin-bottom: 8px;
      font-size: 12px;
      font-weight: 500;
      color: var(--secondary-text-color);
    }
    .compact-chip-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .compact-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 999px;
      background: var(--card-background-color);
      color: var(--secondary-text-color);
      font-size: 12px;
      border: 1px solid var(--divider-color);
    }
    .compact-chip ha-icon {
      --mdc-icon-size: 14px;
    }

    /* -- Entity groups ------------------------------------------------- */
    .entity-groups {
      padding-top: 8px;
    }
    .entity-group {
      margin-bottom: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--card-background-color);
      overflow: hidden;
    }
    .entity-group-header {
      display: flex;
      align-items: center;
      padding: 10px 12px;
      cursor: pointer;
      user-select: none;
      transition: background-color 0.15s ease;
    }
    .entity-group-header:hover {
      background: var(--secondary-background-color);
    }
    .group-checkbox {
      margin-right: 8px;
      width: 16px;
      height: 16px;
      cursor: pointer;
      accent-color: var(--primary-color);
    }
    .group-checkbox[data-indeterminate='true'] {
      opacity: 0.6;
    }
    .entity-group-header ha-icon {
      margin-right: 8px;
      --mdc-icon-size: 18px;
      color: var(--secondary-text-color);
    }
    .group-name {
      flex: 1;
      font-weight: 500;
      font-size: 14px;
    }
    .entity-count {
      color: var(--secondary-text-color);
      font-size: 12px;
      margin-right: 8px;
    }
    .expand-button-small {
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      color: var(--secondary-text-color);
    }
    .expand-button-small.expanded .expand-icon-small {
      transform: rotate(90deg);
    }
    .expand-icon-small {
      display: inline-block;
      font-size: 12px;
      transition: transform 0.2s;
    }

    /* -- Entity list --------------------------------------------------- */
    .entity-list {
      padding: 8px 12px 8px 36px;
      border-top: 1px solid var(--divider-color);
    }
    .entity-item {
      display: flex;
      align-items: center;
      padding: 6px 0;
    }
    .entity-checkbox {
      margin-right: 8px;
      width: 16px;
      height: 16px;
      cursor: pointer;
      accent-color: var(--primary-color);
    }
    .entity-name {
      flex: 1;
      font-size: 14px;
    }
    .entity-id {
      font-size: 11px;
      color: var(--secondary-text-color);
      font-family: 'Roboto Mono', monospace;
      margin-left: 8px;
    }
    .empty-state {
      padding: 24px;
      text-align: center;
      color: var(--secondary-text-color);
      font-style: italic;
    }

    /* -- Badge entity management --------------------------------------- */
    .badge-separator {
      padding: 8px 0 4px;
      font-size: 12px;
      font-weight: 500;
      color: var(--secondary-text-color);
      border-top: 1px dashed var(--divider-color);
      margin-top: 4px;
    }
    .badge-additional-item {
      padding-left: 0;
    }
    .badge-remove-btn {
      background: none;
      border: none;
      padding: 2px 6px;
      cursor: pointer;
      color: var(--error-color, #db4437);
      font-size: 14px;
      margin-left: 8px;
      border-radius: 4px;
      transition: background-color 0.15s ease;
    }
    .badge-remove-btn:hover {
      background: var(--secondary-background-color);
    }
    .badge-add-section {
      display: flex;
      gap: 8px;
      padding: 8px 0 4px;
      align-items: center;
    }
    .badge-entity-picker {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 13px;
    }
    .badge-add-button {
      padding: 8px 16px;
      border: none;
      border-radius: 8px;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
      transition: opacity 0.2s ease;
    }
    .badge-add-button:hover {
      opacity: 0.85;
    }
    .badge-name-checkbox {
      margin-left: auto;
      margin-right: 2px;
      width: 14px;
      height: 14px;
      cursor: pointer;
      accent-color: var(--primary-color);
    }
    .badge-name-label {
      font-size: 11px;
      color: var(--secondary-text-color);
      margin-right: 8px;
      white-space: nowrap;
    }

    /* -- Entity search picker ------------------------------------------ */
    .entity-search-picker {
      position: relative;
      flex: 1;
      min-width: 0;
    }
    .entity-search-input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-family: inherit;
      font-size: 14px;
      box-sizing: border-box;
      transition: border-color 0.2s ease;
    }
    .entity-search-input:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 1px var(--primary-color);
    }
    .entity-search-input::placeholder {
      color: var(--secondary-text-color);
      opacity: 0.7;
    }
    .entity-search-results {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 10;
      margin-top: 4px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--card-background-color);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      overflow: hidden;
      max-height: 320px;
      overflow-y: auto;
    }
    .entity-search-result {
      display: flex;
      flex-direction: column;
      padding: 10px 14px;
      cursor: pointer;
      transition: background-color 0.1s ease;
      border-bottom: 1px solid var(--divider-color);
    }
    .entity-search-result:last-child {
      border-bottom: none;
    }
    .entity-search-result:hover {
      background: var(--secondary-background-color);
    }
    .entity-search-result .entity-search-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .entity-search-result .entity-search-id {
      font-size: 11px;
      color: var(--secondary-text-color);
      font-family: 'Roboto Mono', monospace;
      margin-top: 2px;
    }
    .entity-search-no-results {
      padding: 12px 14px;
      color: var(--secondary-text-color);
      font-style: italic;
      font-size: 13px;
    }

    /* -- Favorites / Room Pins list items ------------------------------ */
    .entity-list-container {
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
      overflow: hidden;
    }
    .entity-list-item {
      display: flex;
      align-items: center;
      padding: 10px 14px;
      border-bottom: 1px solid var(--divider-color);
      background: var(--card-background-color);
      transition: background-color 0.1s ease;
    }
    .entity-list-item:last-child {
      border-bottom: none;
    }
    .entity-list-item:hover {
      background: var(--secondary-background-color);
    }
    .entity-list-item .drag-icon {
      margin-right: 12px;
      color: var(--secondary-text-color);
      font-size: 16px;
      cursor: grab;
      user-select: none;
      padding: 4px;
    }
    .entity-list-item .drag-icon:active {
      cursor: grabbing;
    }
    .entity-list-item.dragging {
      opacity: 0.5;
    }
    .entity-list-item.drag-over {
      border-top: 2px solid var(--primary-color);
    }
    .entity-list-item .item-info {
      flex: 1;
      min-width: 0;
      font-size: 14px;
    }
    .entity-list-item .item-name {
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .entity-list-item .item-entity-id {
      margin-left: 8px;
      font-size: 12px;
      color: var(--secondary-text-color);
      font-family: 'Roboto Mono', monospace;
    }
    .entity-list-item .item-area {
      display: block;
      font-size: 11px;
      color: var(--secondary-text-color);
      margin-top: 2px;
    }

    /* -- Custom view/card/badge items ---------------------------------- */
    .custom-item {
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
      padding: 16px;
      margin-bottom: 12px;
      background: var(--card-background-color);
    }
    .custom-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .custom-item-header strong {
      font-size: 14px;
      font-weight: 500;
    }
    .custom-item-fields {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .area-custom-card-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .custom-card-target {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
    }
    .custom-card-target label {
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .custom-card-target select {
      flex: 1;
      padding: 4px 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 13px;
    }
    .custom-item-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      min-width: 0;
    }
    .custom-item-row > * {
      min-width: 0;
    }
    .weather-start-add-row {
      align-items: stretch;
      margin-top: 10px;
    }
    .weather-start-add-row .btn-primary {
      flex: 0 1 auto;
      padding: 10px 14px;
    }
    .weather-start-add-row select {
      flex: 1 1 180px;
      min-width: 160px;
    }
    .custom-item-validation {
      font-size: 12px;
      min-height: 16px;
    }
    .custom-content-grid {
      display: grid;
      gap: 12px;
    }
    .editor-subsection {
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--secondary-background-color);
      padding: 12px;
    }
    .subsection-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .subsection-title a {
      margin-left: auto;
      color: var(--primary-color);
      text-decoration: none;
      font-size: 16px;
    }

    /* -- Section dividers ---------------------------------------------- */
    .section-divider {
      margin: 28px 0 12px;
      padding: 0;
    }
    .section-divider-title {
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--secondary-text-color);
    }

    /* -- Mobile responsive --------------------------------------------- */
    @media (max-width: 600px) {
      .card-config {
        padding: 12px 8px;
      }
      .section {
        margin-bottom: 16px;
      }
      .section-title {
        font-size: 15px;
        margin-bottom: 8px;
      }
      .form-row {
        flex-wrap: wrap;
        gap: 4px;
      }
      .form-row label {
        font-size: 13px;
      }
      .description {
        margin-left: 26px;
        margin-bottom: 12px;
        font-size: 11px;
      }

      select,
      .form-row select {
        width: 100%;
        min-width: 0;
        font-size: 13px;
        padding: 8px 28px 8px 10px;
      }
      input[type='text'],
      input[type='number'] {
        width: 100%;
        font-size: 13px;
        padding: 8px 10px;
      }
      textarea {
        font-size: 11px;
        padding: 10px;
        min-height: 60px;
      }

      .entity-search-picker {
        width: 100%;
      }
      .entity-search-results {
        max-height: 240px;
      }
      .entity-search-result {
        padding: 8px 10px;
      }

      .area-header {
        padding: 10px 12px;
      }
      .area-content {
        padding: 0 8px 8px 24px;
      }
      .entity-list {
        padding: 6px 8px 6px 16px;
      }

      .custom-item {
        padding: 12px;
      }
      .custom-item-row {
        flex-direction: column;
      }
      .weather-start-add-row .btn-primary,
      .weather-start-add-row select {
        width: 100%;
      }

      .entity-list-item {
        padding: 8px 10px;
      }
      .entity-list-item .item-entity-id {
        display: block;
        margin-left: 0;
        margin-top: 2px;
      }

      .badge-add-section {
        flex-wrap: wrap;
      }

      .btn-primary {
        padding: 8px 16px;
        font-size: 13px;
      }
    }

    /* -- Card Picker Overlay -------------------------------------------- */
    .card-picker-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.55);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .card-picker-dialog {
      background: var(--card-background-color, #fff);
      border-radius: var(--ha-card-border-radius, 12px);
      width: 100%;
      max-width: 560px;
      max-height: 82vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }
    .card-picker-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      border-bottom: 1px solid var(--divider-color);
      flex-shrink: 0;
    }
    .card-picker-header-title {
      flex: 1;
      font-weight: 500;
      font-size: 15px;
      color: var(--primary-text-color);
    }
    .card-picker-icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      padding: 4px;
      border-radius: 4px;
      display: inline-flex;
      align-items: center;
      line-height: 1;
      transition: color 0.15s ease;
    }
    .card-picker-icon-btn:hover {
      color: var(--primary-text-color);
    }
    .card-picker-search-row {
      padding: 10px 16px 6px;
      flex-shrink: 0;
    }
    .card-picker-search-row input {
      width: 100%;
      box-sizing: border-box;
      padding: 8px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      font-size: 13px;
      font-family: inherit;
      outline: none;
    }
    .card-picker-search-row input:focus {
      border-color: var(--primary-color);
    }
    .card-type-grid {
      flex: 1;
      overflow-y: auto;
      padding: 8px 16px 16px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }
    .card-type-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 12px 6px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--secondary-background-color);
      cursor: pointer;
      gap: 6px;
      transition:
        border-color 0.15s ease,
        background 0.15s ease;
      font-family: inherit;
      min-height: 72px;
    }
    .card-type-btn:hover {
      border-color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 8%, var(--card-background-color));
    }
    .card-type-btn ha-icon {
      color: var(--primary-color);
    }
    .card-type-btn span {
      font-size: 11px;
      color: var(--primary-text-color);
      text-align: center;
      line-height: 1.3;
    }
    .card-editor-content {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .card-editor-visual-host {
      display: block;
    }
    .card-editor-yaml-label {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .card-editor-yaml-area {
      width: 100%;
      box-sizing: border-box;
      min-height: 160px;
      padding: 10px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      font-size: 12px;
      font-family: monospace;
      resize: vertical;
      outline: none;
    }
    .card-editor-yaml-area:focus {
      border-color: var(--primary-color);
    }
    .card-picker-footer {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 12px 16px;
      border-top: 1px solid var(--divider-color);
      flex-shrink: 0;
    }
    .btn-secondary {
      padding: 10px 20px;
      border-radius: var(--ha-card-border-radius, 12px);
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      cursor: pointer;
      font-weight: 500;
      font-family: inherit;
      font-size: 14px;
      transition: border-color 0.2s ease;
    }
    .btn-secondary:hover {
      border-color: var(--primary-color);
    }
    .advanced-toggle {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 16px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 15px;
      font-weight: 600;
      text-align: left;
    }
    .advanced-toggle ha-icon:last-child {
      margin-left: auto;
      transition: transform 0.2s ease;
    }
    .advanced-toggle[aria-expanded='true'] ha-icon:last-child {
      transform: rotate(180deg);
    }
    /* -- Option panels (labelled selects, grouped options) ------------- */
    .form-row > .form-label {
      margin-right: 8px;
      min-width: 120px;
    }
    .form-row > .form-control {
      flex: 1;
      min-width: 0;
    }
    .description.description-intro {
      margin-left: 0;
    }
    .form-row .row-icon {
      --mdc-icon-size: 18px;
      margin-right: 6px;
      color: var(--secondary-text-color);
      vertical-align: middle;
    }
    .description + .subsection-title,
    .form-row + .subsection-title,
    ha-textfield + .subsection-title {
      margin-top: 18px;
    }
    .description + .option-group-title,
    .form-row + .option-group-title {
      margin-top: 14px;
    }
    .advanced-content {
      margin-top: 16px;
      padding-left: 12px;
      border-left: 3px solid var(--divider-color);
    }
  `];function wt(e,t,i=!1){const a=Reflect.get(e,t);return i?!1!==a:!0===a}function kt(e,t,i={}){const a=!0===i.defaultOn;return je.qy`
    ${e.checkbox(i.id??t.replace(/_/g,"-"),(0,ze.kg)(i.labelKey??`editor.${t}`),wt(e.config,t,a),i=>e.toggle(t,i,a),!0===i.disabled)}
    ${!1===i.description?"":je.qy`<div class="description">${(0,ze.kg)(`editor.${t}_desc`)}</div>`}
  `}function xt(e,t){return[...new Set(e.split(",").map(e=>e.trim()).filter(t))]}function Ct(e){return je.qy`
    <div class="section">
      <div class="section-title">${(0,ze.kg)("editor.section_custom_content")}</div>
      <div class="description" style="margin-left: 0; margin-bottom: 12px;">
        ${(0,ze.kg)("editor.section_custom_content_desc")}
      </div>
      ${je.qy`
              <div class="empty-state" style="margin-bottom: 12px;">
                ${(0,ze.kg)("editor.custom_content_weather_start_hint")}
              </div>
            `}
      <div class="custom-content-grid">
        ${je.s6}
        ${je.s6} ${function(e,t=!1){const i=e._config.custom_badges||[];return je.qy`
    <div class=${t?"editor-subsection":"section"}>
      <div class=${t?"subsection-title":"section-title"} style="display: flex; align-items: center; gap: 8px;">
        ${(0,ze.kg)("editor.section_custom_badges")}
        <a
          href="https://github.com/Cyberhunter88/dashboard-strategy/blob/main/assets/Custom-Badges-hinzufugen.gif"
          target="_blank"
          rel="noopener"
          style="color: var(--primary-color); text-decoration: none; font-size: 18px;"
          title=${(0,ze.kg)("editor.video_tutorial")}
          >&#x1F3AC;</a
        >
      </div>

      <div id="custom-badges-list">
        ${0===i.length?je.qy`<div class="empty-state">${(0,ze.kg)("editor.no_custom_badges")}</div>`:i.map((t,i)=>function(e,t,i){return je.qy`
    <div class="custom-item" data-index=${i}>
      <div class="custom-item-header">
        <strong>Badge ${i+1}</strong>
        <button class="btn-remove" @click=${()=>e._removeCustomBadge(i)}>&#x2715;</button>
      </div>
      <textarea
        rows="4"
        placeholder="type: entity&#10;entity: sun.sun"
        .value=${t.yaml||""}
        style="width: 100%;"
        @change=${t=>e._updateCustomBadgeYaml(i,t.target.value)}
      ></textarea>
      <div class="custom-item-validation">${a=t,a._yaml_error?je.qy`<span style="color: var(--error-color);">&#x274C; ${a._yaml_error}</span>`:a.yaml?je.qy`<span style="color: var(--success-color, green);">&#x2705; ${(0,ze.kg)("editor.yaml_valid")}</span>`:je.s6}</div>
    </div>
  `;var a}(e,t,i))}
      </div>

      <button class="btn-primary" style="margin-top: 8px;" @click=${()=>e._addCustomBadge()}>
        ${(0,ze.kg)("editor.add_custom_badge")}
      </button>
      <div class="description">${(0,ze.kg)("editor.custom_badges_help")}</div>
    </div>
  `}(e,!0)}
        ${function(e,t=!1){const i=e._config.custom_views||[];return je.qy`
    <div class=${t?"editor-subsection":"section"}>
      <div class=${t?"subsection-title":"section-title"} style="display: flex; align-items: center; gap: 8px;">
        ${(0,ze.kg)("editor.section_custom_views")}
        <a
          href="https://github.com/Cyberhunter88/dashboard-strategy/blob/main/assets/Custom-View-hinzufugen.gif"
          target="_blank"
          rel="noopener"
          style="color: var(--primary-color); text-decoration: none; font-size: 18px;"
          title=${(0,ze.kg)("editor.video_tutorial")}
          >&#x1F3AC;</a
        >
      </div>

      <div id="custom-views-list">
        ${0===i.length?je.qy`<div class="empty-state">${(0,ze.kg)("editor.no_custom_views")}</div>`:i.map((t,i)=>function(e,t,i){const a=void 0!==t.ref_dashboard,o=t._yaml_error?je.qy`<span style="color: var(--error-color);">&#x274C; ${t._yaml_error}</span>`:t.yaml?je.qy`<span style="color: var(--success-color, green);">&#x2705; ${(0,ze.kg)("editor.yaml_valid")}</span>`:je.s6;return je.qy`
    <div class="custom-item" data-index=${i}>
      <div class="custom-item-header">
        <strong>${t.title||(0,ze.kg)("editor.new_view")}</strong>
        <button class="btn-remove" @click=${()=>e._removeCustomView(i)}>&#x2715;</button>
      </div>
      <div class="custom-item-fields">
        <div class="custom-item-row">
          <input
            type="text"
            .value=${t.title||""}
            placeholder=${(0,ze.kg)("editor.title_placeholder")}
            style="flex: 2;"
            @change=${t=>e._updateCustomViewField(i,"title",t.target.value)}
          />
          <input
            type="text"
            .value=${t.path||""}
            placeholder=${(0,ze.kg)("editor.path_placeholder")}
            style="flex: 2;"
            @change=${t=>e._updateCustomViewField(i,"path",t.target.value)}
          />
          <input
            type="text"
            .value=${t.icon||""}
            placeholder="mdi:star"
            style="flex: 1;"
            @change=${t=>e._updateCustomViewField(i,"icon",t.target.value)}
          />
        </div>
        ${function(e,t,i){const a=function(e,t){if(!e._hass)return[];const i=[["home",(0,ze.kg)("views.overview")]],a=(e,t,a)=>{e&&i.push([t,(0,ze.kg)(a)])};a((0,Qe.v4)(e._config,"lights"),"lights","views.lights"),a((0,Qe.v4)(e._config,"covers"),"covers","views.covers"),a((0,Qe.v4)(e._config,"security"),"security","views.security"),a((0,Qe.v4)(e._config,"batteries"),"batteries","views.batteries"),a((0,Qe.v4)(e._config,"climate"),"climate","views.climate"),a(!0===e._config.show_cctv_view,"cctv","views.cctv"),a(!1!==e._config.show_maintenance_view,"maintenance","views.maintenance");const o=new Set(e._config.areas_display?.hidden||[]);for(const t of e._getSortedAreas()){if(o.has(t.area_id))continue;const a=e._config.room_visibility?.[t.area_id];a?.entity&&e._hass.states[a.entity]?.state!==a.state||i.push([t.area_id,t.name])}for(const[a,o]of(e._config.custom_views||[]).entries())a!==t&&(o.parsed_config||o.ref_dashboard&&o.ref_view)&&o.path&&o.title&&i.push([o.path,o.title]);return i}(e,i),o=!!t.after_view&&!a.some(([e])=>e===t.after_view);return je.qy`
    <div class="custom-item-row">
      <select
        style="flex: 1;"
        @change=${t=>e._updateCustomViewAfterView(i,t.target.value)}
      >
        <option value="" ?selected=${!t.after_view}>${(0,ze.kg)("editor.custom_view_position_end")}</option>
        ${o?je.qy`<option value=${t.after_view||""} selected>
                &#x26A0; ${(0,ze.kg)("editor.custom_view_position_after")} ${t.after_view}
              </option>`:je.s6}
        ${a.map(([e,i])=>je.qy`
            <option value=${e} ?selected=${t.after_view===e}>
              ${(0,ze.kg)("editor.custom_view_position_after")} ${i}
            </option>
          `)}
      </select>
    </div>
  `}(e,t,i)}
        ${a?function(e,t,i){if(null===e._refDashboards)return e._loadRefDashboards(),je.qy`<div class="description">${(0,ze.kg)("editor.ref_loading")}</div>`;if(0===e._refDashboards.length)return je.qy`<div class="custom-item-validation" style="color: var(--error-color);">
      ${(0,ze.kg)("editor.ref_no_dashboards")}
    </div>`;const a=e._refDashboards.find(e=>e.url_path===t.ref_dashboard),o=!!t.ref_dashboard&&!a;return je.qy` <div class="custom-item-row">
      <select
        style="flex: 1;"
        @change=${t=>e._refDashboardChanged(i,t.target.value)}
      >
        <option value="" ?selected=${!t.ref_dashboard} disabled>${(0,ze.kg)("editor.ref_select_dashboard")}</option>
        ${o?je.qy`<option value=${t.ref_dashboard||""} selected>${t.ref_dashboard}</option>`:je.s6}
        ${e._refDashboards.map(e=>je.qy` <option value=${e.url_path} ?selected=${e.url_path===t.ref_dashboard}>
              ${e.title}
            </option>`)}
      </select>
      <select
        style="flex: 1;"
        ?disabled=${!a}
        @change=${t=>e._refViewChanged(i,t.target.value)}
      >
        <option value="" ?selected=${!t.ref_view} disabled>${(0,ze.kg)("editor.ref_select_view")}</option>
        ${(a?.views||[]).map(e=>{const i=e.path??String(e.index),a=`${e.title||`${(0,ze.kg)("editor.ref_view_untitled")} ${e.index+1}`}${e.path?` (${e.path})`:""}`;return je.qy`<option value=${i} ?selected=${i===t.ref_view}>${a}</option>`})}
      </select>
    </div>
    <div class="custom-item-validation">
      ${o?je.qy`<span style="color: var(--error-color);">${(0,ze.kg)("editor.ref_dashboard_missing")}</span>`:t.ref_dashboard&&t.ref_view?je.qy`<span style="color: var(--success-color, green);">${(0,ze.kg)("editor.ref_valid")}</span>`:(0,ze.kg)("editor.ref_incomplete")}
    </div>`}(e,t,i):je.qy`<textarea
                  rows="8"
                  placeholder=${(0,ze.kg)("editor.yaml_placeholder")}
                  .value=${t.yaml||""}
                  style="width: 100%;"
                  @change=${t=>e._updateCustomViewYaml(i,t.target.value)}
                ></textarea>
                <div class="custom-item-validation">${o}</div>`}
      </div>
    </div>
  `}(e,t,i))}
      </div>

      <div class="custom-item-row" style="margin-top: 8px;">
        <button class="btn-primary" @click=${e._addCustomView}>
          ${(0,ze.kg)("editor.add_custom_view")} <ha-icon icon="mdi:code-braces"></ha-icon>
        </button>
        <button class="btn-primary" @click=${e._addCustomRefView}>
          ${(0,ze.kg)("editor.add_custom_view_ref")} <ha-icon icon="mdi:link-variant"></ha-icon>
        </button>
      </div>
      <div class="description">${(0,ze.kg)("editor.custom_views_help")}</div>
      <div class="description">${(0,ze.kg)("editor.custom_views_ref_help")}</div>
    </div>
  `}(e.customViewsHost,!0)}
      </div>
    </div>
  `}var $t=i(3534);function St(e,t){return e.config[t]||[]}function At(e,t,i){e.update(e=>{i.length>0?e[t]=i:delete e[t]})}function Ot(e,t,i){e.entityListState.search[t]=i,e.requestUpdate()}function Et(e){return e.target.closest(".entity-list-item")}function It(e,t){const{key:i}=t,a=St(e,i),o=new Map(e.entityOptions().map(e=>[e.entity_id,e])),r=t.withArea?new Map(e.sortedAreas().map(e=>[e.area_id,e.name])):new Map,s=e.entityListState.search[i]??"",n=e.filterEntities(s,!0===t.withArea);return je.qy`
    <div id=${t.listId} style="margin-bottom: 12px;">
      ${0===a.length?je.qy`<div class="empty-state">${t.emptyLabel}</div>`:je.qy`
              <div class="entity-list-container">
                ${a.map(a=>{const s=o.get(a),n=s?.area_id||s?.device_area_id;return je.qy`
                    <div
                      class="entity-list-item"
                      data-entity-id=${a}
                      draggable="true"
                      @dragstart=${t=>function(e,t){const i=Et(t);i?(i.classList.add("dragging"),e.entityListState.draggedId=i.dataset.entityId||null,t.dataTransfer&&(t.dataTransfer.effectAllowed="move",t.dataTransfer.setData("text/plain",e.entityListState.draggedId||""))):t.preventDefault()}(e,t)}
                      @dragend=${t=>function(e,t){Et(t)?.classList.remove("dragging"),e.entityListState.draggedId=null}(e,t)}
                      @dragover=${t=>function(e,t){t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect="move");const i=t.currentTarget;i.dataset.entityId!==e.entityListState.draggedId&&i.classList.add("drag-over")}(e,t)}
                      @dragleave=${e=>e.currentTarget.classList.remove("drag-over")}
                      @drop=${t=>function(e,t,i){i.stopPropagation(),i.preventDefault();const a=i.currentTarget;a.classList.remove("drag-over");const o=e.entityListState.draggedId,r=a.dataset.entityId;if(!o||!r||o===r)return;const s=[...St(e,t)],n=s.indexOf(o),c=s.indexOf(r);-1!==n&&-1!==c&&(s.splice(n,1),s.splice(c,0,o),At(e,t,s))}(e,i,t)}
                    >
                      <span class="drag-icon">&#x2630;</span>
                      <span class="item-info">
                        <span class="item-name">${s?.name||a}</span>
                        <span class="item-entity-id">${a}</span>
                        ${t.withArea?je.qy`<span class="item-area"
                                >&#x1F4CD;
                                ${n?r.get(n)||n:(0,ze.kg)("editor.no_room")}</span
                              >`:je.s6}
                      </span>
                      <button
                        class="btn-remove"
                        aria-label=${(0,ze.kg)("editor.remove_entity")}
                        @click=${()=>function(e,t,i){At(e,t,St(e,t).filter(e=>e!==i))}(e,i,a)}
                      >
                        &#x2715;
                      </button>
                    </div>
                  `})}
              </div>
            `}
    </div>

    <div class="entity-search-picker">
      <input
        type="text"
        class="entity-search-input"
        placeholder=${(0,ze.kg)("editor.select_entity")+"..."}
        aria-label=${(0,ze.kg)("editor.select_entity")}
        .value=${s}
        @input=${t=>Ot(e,i,t.target.value)}
        @blur=${()=>{setTimeout(()=>Ot(e,i,""),200)}}
      />
      ${s.length>=2?je.qy`
              <div class="entity-search-results">
                ${n.length>0?n.map(t=>je.qy`
                          <div
                            class="entity-search-result"
                            @mousedown=${a=>{a.preventDefault(),function(e,t,i){const a=St(e,t);a.includes(i)||At(e,t,[...a,i])}(e,i,t.entity_id),Ot(e,i,"")}}
                          >
                            <span class="entity-search-name">${t.name}</span>
                            <span class="entity-search-id">${t.entity_id}</span>
                          </div>
                        `):je.qy`<div class="entity-search-no-results">${(0,ze.kg)("editor.no_results")}</div>`}
              </div>
            `:je.s6}
    </div>
  `}var Lt=i(6256);const Pt=[{name:"image",selector:{media:{accept:["image/*"],clearable:!0,image_upload:!0,hide_content_type:!0}}}];function qt(e,t){const i={...e._config};("string"==typeof t?""!==t:t)?i.background={...i.background||{},image:t}:delete i.background,e._fireConfigChanged(i)}function Wt(e,t,i){if(!e._config.background?.image)return;const a={...e._config.background};"opacity"===t?"number"==typeof i&&i<100?a.opacity=i:delete a.opacity:"fixed"===i?a.attachment="fixed":delete a.attachment,e._fireConfigChanged({...e._config,background:a})}const Dt=["summaries","favorites","light_favorites","quick_actions","areas","areas_other","weather","energy","plants","agenda","todos","persons","vacuums","maintenance","media","timers","activity","custom_cards","custom_sections"];function Tt(e,t){return e?Object.keys(e.states).filter(t).map(t=>({entity_id:t,name:e.states[t].attributes?.friendly_name||t.split(".")[1].replace(/_/g," ")})).sort((e,t)=>e.name.localeCompare(t.name)):[]}function Kt(e,t,i,a,o){return je.qy`
    <div class="form-row">
      <label for=${e} class="form-label">${t}</label>
      <select
        id=${e}
        class="form-control"
        @change=${e=>o(e.target.value)}
      >
        ${a.map(e=>je.qy`<option value=${e.value} ?selected=${e.value===i}>${e.label}</option>`)}
      </select>
    </div>
  `}function Vt(e,t,i,a,o){return Kt(i,(0,ze.kg)(`editor.${t}`),e.config[t]||"",[{value:"",label:a},...o.map(e=>({value:e.entity_id,label:e.name}))],i=>e.update(e=>{i?e[t]=i:delete e[t]}))}function Ft(e,t,i){return je.qy`
    <ha-textfield
      .value=${(e.config[t]||[]).join(", ")}
      label=${(0,ze.kg)(`editor.${t}`)}
      helper=${(0,ze.kg)(`editor.${t}_desc`)}
      @change=${a=>{const o=xt(a.target.value,e=>e.startsWith(i));e.update(e=>{o.length>0?e[t]=o:delete e[t]})}}
    ></ha-textfield>
  `}function jt(e,t,i){return je.qy`
    <div class="form-row">
      <label for=${i.id} style="min-width: 140px;">${i.label}</label>
      <input
        type="number"
        id=${i.id}
        min=${i.min}
        max=${i.max}
        .value=${String(e.config[t]??i.defaultValue)}
        style="width: 80px;"
        @change=${a=>{const o=parseInt(a.target.value,10);isNaN(o)||o<i.min||o>i.max||e.setOption(t,o,i.defaultValue)}}
      />
      ${i.unit}
    </div>
  `}function Mt(e,t,i,a,o){return je.qy`
    <div class="form-row">
      <input type="radio" id=${e} name=${t} ?checked=${a} @change=${o} />
      <label for=${e}>${i}</label>
    </div>
  `}function Nt(e,t,i){e.update(e=>{void 0===i?delete e[t]:e[t]=i})}i(4535);const zt=new Map([["energy",{icon:"mdi:lightning-bolt",labelKey:"stacks.energy"}],["cameras",{icon:"mdi:cctv",labelKey:"stacks.cameras"}],["lights",{icon:"mdi:lightbulb",labelKey:"stacks.lights"}],["locks",{icon:"mdi:lock",labelKey:"stacks.locks"}],["climate",{icon:"mdi:thermostat",labelKey:"stacks.climate"}],["covers",{icon:"mdi:window-shutter",labelKey:"stacks.covers"}],["covers_window",{icon:"mdi:window-open-variant",labelKey:"stacks.covers_window"}],["media",{icon:"mdi:speaker",labelKey:"stacks.media"}],["scenes",{icon:"mdi:palette",labelKey:"stacks.scenes"}],["switches",{icon:"mdi:toggle-switch",labelKey:"stacks.switches"}],["helpers",{icon:"mdi:tune-variant",labelKey:"stacks.helpers"}],["sensors",{icon:"mdi:motion-sensor",labelKey:"stacks.sensors"}],["misc",{icon:"mdi:light-switch",labelKey:"stacks.misc"}],["room_pins",{icon:"mdi:pin",labelKey:"stacks.room_pins"}]]);function Ht(e,t){const i=new Set,a=t=>(e[t]?.length??0)>0;return a("lights")&&i.add("lights"),a("locks")&&i.add("locks"),(a("climate")||a("fan"))&&i.add("climate"),(a("covers")||a("covers_curtain"))&&i.add("covers"),a("covers_window")&&i.add("covers_window"),a("media_player")&&i.add("media"),(a("scenes")||a("automations")||a("scripts"))&&i.add("scenes"),a("switches")&&!0===t.show_switches_section_in_rooms&&i.add("switches"),a("helpers")&&!0===t.show_helpers_section_in_rooms&&i.add("helpers"),a("binary_sensors")&&!0===t.show_sensors_section_in_rooms&&i.add("sensors"),(a("vacuum")||a("switches")&&!0!==t.show_switches_section_in_rooms||a("humidifier")||a("valve")||a("water_heater"))&&i.add("misc"),a("energy")&&i.add("energy"),!1!==t.show_cameras_in_rooms&&i.add("cameras"),i.add("room_pins"),i}function Yt(e,t,i,a){const o={...e._config.room_visibility||{}},r={entity:o[t]?.entity||"",state:o[t]?.state||"",[i]:a.trim()};r.entity||r.state?o[t]=r:delete o[t];const s={...e._config};Object.keys(o).length>0?s.room_visibility=o:delete s.room_visibility,e._fireConfigChanged(s)}const Rt="dashboard-strategy-editor-expanded-panels";function Bt(e){try{window.localStorage.setItem(Rt,JSON.stringify([...e]))}catch{}}function Ut(e,t,i){const a=e._expandedPanels.has(t.key);return je.qy`
    <div class="section panel${a?"":" collapsed"}" data-panel-key=${t.key}>
      <button
        type="button"
        class="panel-header"
        aria-expanded=${a?"true":"false"}
        @click=${()=>function(e,t){e._expandedPanels.has(t)?e._expandedPanels.delete(t):e._expandedPanels.add(t),Bt(e._expandedPanels),e.requestUpdate()}(e,t.key)}
      >
        <ha-icon class="panel-icon" icon=${t.icon}></ha-icon>
        <span class="panel-title">${t.label}</span>
        <ha-icon class="panel-chevron" icon="mdi:chevron-down"></ha-icon>
      </button>
      ${a?je.qy`<div class="panel-body">${i()}</div>`:je.s6}
    </div>
  `}class Gt extends je.WF{constructor(){super(...arguments),this._hass=null,this._isUpdatingConfig=!1,this._config={},this._expandedAreas=new Set,this._expandedGroups=new Map,this._expandedWeatherBlocks=new Set,this._entityListState={search:{},draggedId:null},this._expandedPanels=function(){try{const e=window.localStorage.getItem(Rt);if(!e)return new Set;const t=JSON.parse(e);if(Array.isArray(t))return new Set(t.filter(e=>"string"==typeof e))}catch{}return new Set}(),this._diagnosticsChecked=!1,this._optionSearch="",this._showChangedOnly=!1,this._diagnostics=new rt,this._openingMeasured=!1,this._areaEntitiesCache=new Map,this._entitySelectOptionsCache=null,this._weatherStartAreaOptionsCache=null,this._weatherStartFloorOptionsCache=null,this._sortedAreasCache=null,this._refDashboards=null,this._refDashboardsLoading=!1,this._draggedElement=null,this._stackDraggedElement=null,this._weatherStartDraggedElement=null,this._cardPickerOpen=!1,this._cardPickerStep="type",this._cardPickerSearch="",this._cardPickerSelectedType="",this._cardPickerYaml="",this._cardPickerHasVisualEditor=!1,this._cardPickerCallback=null,this._cardPickerConfig=null,this._openCardPickerForWeatherStartCard=()=>{this._openCardPicker(e=>{const t=this._createWeatherStartItemId("card"),i=xe.dump(e).trim(),a=[...this._config.custom_cards||[],{id:t,editor_title:"",yaml:i,parsed_config:e}],o=[...this._getWeatherStartLayoutItems(),{id:`custom-card-${t}`,type:"custom_card",custom_card_id:t}],r={...this._config,custom_cards:a,weather_start_layout_items:o};this._config=r,this._fireConfigChanged(r),this._expandedWeatherBlocks=new Set([...this._expandedWeatherBlocks,`custom-card-${t}`])})},this._handleWeatherStartDragStart=e=>{if(!e.target.closest(".drag-handle"))return void e.preventDefault();const t=e.target.closest(".section-order-item");t?(t.classList.add("dragging"),e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t.dataset.wsId||"")),this._weatherStartDraggedElement=t):e.preventDefault()},this._handleWeatherStartDragEnd=e=>{const t=e.target.closest(".section-order-item");t&&t.classList.remove("dragging");const i=this.shadowRoot?.querySelector("#weather-start-order-list");i&&i.querySelectorAll(".section-order-item").forEach(e=>{e.classList.remove("drag-over")}),this._weatherStartDraggedElement=null},this._handleWeatherStartDragOver=e=>{e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move");const t=e.currentTarget;t!==this._weatherStartDraggedElement&&t.classList.add("drag-over")},this._handleWeatherStartDragLeave=e=>{e.currentTarget.classList.remove("drag-over")},this._handleWeatherStartDrop=e=>{e.stopPropagation(),e.preventDefault();const t=e.currentTarget;if(t.classList.remove("drag-over"),!this._weatherStartDraggedElement||this._weatherStartDraggedElement===t)return;const i=this._weatherStartDraggedElement.dataset.wsId,a=t.dataset.wsId;if(!i||!a)return;const o=this._getWeatherStartLayoutItems(),r=o.findIndex(e=>e.id===i),s=o.findIndex(e=>e.id===a);if(-1===r||-1===s)return;const n=[...o];n.splice(r,1),n.splice(s,0,o[r]),this._saveWeatherStartLayoutItems(n)},this._handleStackDragStart=e=>{if(!e.target.closest(".drag-handle"))return void e.preventDefault();const t=e.target.closest(".section-order-item");t?(t.classList.add("dragging"),e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t.dataset.stackKey||"")),this._stackDraggedElement=t):e.preventDefault()},this._handleStackDragEnd=e=>{const t=e.target.closest(".section-order-item");t&&t.classList.remove("dragging"),this.shadowRoot?.querySelectorAll(".section-order-item.drag-over").forEach(e=>e.classList.remove("drag-over")),this._stackDraggedElement=null},this._handleStackDragOver=e=>{e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move");const t=e.currentTarget;t!==this._stackDraggedElement&&t.classList.add("drag-over")},this._handleStackDragLeave=e=>{e.currentTarget.classList.remove("drag-over")},this._handleStackDrop=e=>{e.stopPropagation(),e.preventDefault();const t=e.currentTarget;if(t.classList.remove("drag-over"),!this._stackDraggedElement||this._stackDraggedElement===t)return;const i=this._stackDraggedElement.dataset.stackKey,a=t.dataset.stackKey,o=t.dataset.areaId;if(!i||!a||!o)return;const r=this._getStacksOrder(o),s=r.indexOf(i),n=r.indexOf(a);if(-1===s||-1===n)return;const c=[...r];c.splice(s,1),c.splice(n,0,i),this._updateStacksOrder(o,c)},this._addCustomRefView=()=>{const e=[...this._config.custom_views||[]];e.push({title:"",path:"",icon:"",ref_dashboard:"",ref_view:""});const t={...this._config,custom_views:e};this._config=t,this._fireConfigChanged(t),this._loadRefDashboards()},this._handleDragStart=e=>{if(!e.target.closest(".drag-handle"))return void e.preventDefault();const t=e.target.closest(".area-item");t?(t.classList.add("dragging"),e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t.dataset.areaId||"")),this._draggedElement=t):e.preventDefault()},this._handleDragEnd=e=>{const t=e.target.closest(".area-item");t&&t.classList.remove("dragging");const i=this.shadowRoot.querySelector("#area-list");i&&i.querySelectorAll(".area-item").forEach(e=>{e.classList.remove("drag-over")})},this._handleDragOver=e=>{e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move");const t=e.currentTarget;t!==this._draggedElement&&t.classList.add("drag-over")},this._handleDragLeave=e=>{e.currentTarget.classList.remove("drag-over")},this._handleDrop=e=>{e.stopPropagation(),e.preventDefault();const t=e.currentTarget;if(t.classList.remove("drag-over"),!this._draggedElement||this._draggedElement===t)return;const i=this._draggedElement.dataset.areaId,a=t.dataset.areaId;if(!i||!a)return;const o=this._getAreaOrder(),r=o.indexOf(i),s=o.indexOf(a);if(-1===r||-1===s)return;const n=[...o];n.splice(r,1),n.splice(s,0,i),this._updateAreaOrder(n)},this._openCardPickerForCustomCard=()=>{this._openCardPicker(e=>{const t=xe.dump(e).trim(),i=[...this._config.custom_cards||[]];i.push({editor_title:"",yaml:t,parsed_config:e});const a={...this._config,custom_cards:i};this._config=a,this._fireConfigChanged(a)})},this._handlePickerOverlayClick=e=>{e.target===e.currentTarget&&this._closeCardPicker()},this._weatherLayoutHost=this.createWeatherLayoutHost(),this._optionPanelHost=this.createOptionPanelHost(),this._roomOptionsHost=this.createRoomOptionsHost(),this._customViewsHost=this.createCustomViewsHost(),this._customContentHost=this.createCustomContentHost(),this._cardPickerHost=this.createCardPickerHost()}connectedCallback(){super.connectedCallback(),(0,Je.sX)("editor-open"),this._openingMeasured=!1,this._unsubscribeLanguage=(0,ze.P)(()=>this.requestUpdate())}disconnectedCallback(){this._unsubscribeLanguage?.(),this._unsubscribeLanguage=void 0,super.disconnectedCallback()}set hass(e){const t=this._hass;if(this._hass=e,t&&t.language===e.language&&t.locale===e.locale||(0,ze.rI)(e),!t||t.entities===e.entities&&t.devices===e.devices&&t.language===e.language&&t.locale===e.locale||(this._entitySelectOptionsCache=null),!t||t.areas===e.areas&&t.floors===e.floors||(this._weatherStartAreaOptionsCache=null,this._weatherStartFloorOptionsCache=null,this._sortedAreasCache=null),t&&(0,Ze.Gp)(t,e)){this._areaEntitiesCache.clear();for(const e of this._expandedAreas)this._loadAreaEntities(e)}const i=this.shadowRoot?.querySelector(".card-editor-visual-host");i?.firstElementChild&&(i.firstElementChild.hass=e),((0,Ze.Gp)(t??void 0,e)||this._expandedPanels.has("diagnostics"))&&this.requestUpdate()}setConfig(e){this._isUpdatingConfig||(e=(0,_t.l)(e),this._config.areas_display?.hidden===e.areas_display?.hidden&&this._config.areas_display?.order===e.areas_display?.order&&this._config.areas_display?.nav_items===e.areas_display?.nav_items||this._invalidateWeatherStartOptionsCaches(),this._config=e,this._entitySelectOptionsCache=null)}_invalidateWeatherStartOptionsCaches(){this._weatherStartAreaOptionsCache=null,this._weatherStartFloorOptionsCache=null}_getAllEntitiesForSelect(){if(!this._hass)return[];if(this._entitySelectOptionsCache&&this._entitySelectOptionsCache.config===this._config&&this._entitySelectOptionsCache.entities===this._hass.entities&&this._entitySelectOptionsCache.devices===this._hass.devices&&!function(e,t){if(e===t)return!1;const i=Object.keys(t);return i.length!==Object.keys(e).length||i.some(i=>!e[i]||e[i].attributes.friendly_name!==t[i].attributes.friendly_name)}(this._entitySelectOptionsCache.states,this._hass.states))return this._entitySelectOptionsCache.states=this._hass.states,this._entitySelectOptionsCache.options;const e=this._hass.entities||{},t=Object.values(this._hass.devices||{}),i=new Map(t.map(e=>[e.id,e])),a=new Map;t.forEach(e=>{const t=(0,dt.i)(e,e=>i.get(e));t&&a.set(e.id,t)});const o=this._hass,r=new Set(this._diagnostics.analyze(this._config).references.map(e=>e.entityId)),s=[...new Set([...Object.keys(o.states),...r])].filter(e=>function(e,t,i){return!nt(e,t)||i.has(t)}(o,e,r)).map(t=>{const i=o.states[t],r=e[t];let s=r?.area_id;return!s&&r?.device_id&&(s=a.get(r.device_id)??null),{entity_id:t,name:(i?.attributes?.friendly_name||t.split(".")[1].replace(/_/g," "))+(nt(o,t)?` (${(0,ze.kg)("editor.entity_existing_restricted")})`:""),area_id:s,device_area_id:s}}).sort((e,t)=>e.name.localeCompare(t.name));return this._entitySelectOptionsCache={config:this._config,entities:this._hass.entities,devices:this._hass.devices,states:this._hass.states,options:s},s}_getSortedAreas(){if(!this._hass)return[];if(this._sortedAreasCache?.areas===this._hass.areas)return this._sortedAreasCache.options;const e=Object.values(this._hass.areas).sort((e,t)=>e.name.localeCompare(t.name));return this._sortedAreasCache={areas:this._hass.areas,options:e},e}_getNormalizedAreasDisplay(e=this._config){return this._hass?(0,lt.KA)(Object.values(this._hass.areas),e.areas_display):e.areas_display}_getFilteredEntities(e,t=!1){if(!this._hass||e.length<2)return[];const i=e.toLowerCase(),a=this._getAllEntitiesForSelect().filter(e=>!(t&&!e.area_id&&!e.device_area_id)&&(e.name.toLowerCase().includes(i)||e.entity_id.toLowerCase().includes(i)));return a.sort((e,t)=>{const a=e.name.toLowerCase(),o=t.name.toLowerCase(),r=e.entity_id.toLowerCase(),s=t.entity_id.toLowerCase(),n=a===i||r===i;if(n!==(o===i||s===i))return n?-1:1;const c=a.startsWith(i)||r.startsWith(i)||r.split(".")[1]?.startsWith(i);return c!==(o.startsWith(i)||s.startsWith(i)||s.split(".")[1]?.startsWith(i))?c?-1:1:a.localeCompare(o)}),a.slice(0,21)}render(){if(!this._hass)return je.s6;const e=this._optionPanelHost;return je.qy`
      <div class="card-config">
        ${this._renderPanelNavigation()} ${this._renderOptionSearch()}
        ${Ut(this,{key:"diagnostics",icon:"mdi:clipboard-check-outline",label:(0,ze.kg)("editor.diagnostics_title")},()=>this._renderDiagnostics())}
        ${Ut(this,pt("overview"),()=>function(e){const t=e.config,i=t.overview_area_card_columns??"full",a=(0,Re.EB)(t)?"compact_hourly":"full",o=Ue("overview_max_columns");return je.qy`
    <div class="section">
      <div class="section-title">${(0,ze.kg)("editor.section_overview")}</div>
      ${function(e){const t=e._config.theme||"",i=e._config.background||{},a=i.image,o="number"==typeof i.opacity?i.opacity:100,r=Object.keys(e._hass?.themes.themes||{}).sort((e,t)=>e.localeCompare(t));return je.qy`
    <div class="form-row">
      <label style="margin-right: 8px; min-width: 120px;">${(0,ze.kg)("editor.theme")}</label>
      <select
        style="flex: 1;"
        @change=${t=>function(e,t){const i={...e._config};t?i.theme=t:delete i.theme,e._fireConfigChanged(i)}(e,t.target.value.trim())}
      >
        <option value="" ?selected=${!t}>${(0,ze.kg)("editor.theme_default")}</option>
        ${r.map(e=>je.qy`<option value=${e} ?selected=${e===t}>${e}</option>`)}
      </select>
    </div>
    <div class="form-row" style="display: block;">
      ${customElements.get("ha-form")?je.qy`<ha-form
              .hass=${e._hass}
              .data=${{image:a}}
              .schema=${Pt}
              .computeLabel=${()=>(0,ze.kg)("editor.background_image")}
              @value-changed=${t=>qt(e,t.detail.value.image)}
            ></ha-form>`:je.qy`<label>${(0,ze.kg)("editor.background_image")}</label>
              <input
                type="text"
                .value=${"string"==typeof a?a:""}
                placeholder="/local/background.jpg"
                @change=${t=>qt(e,t.target.value.trim())}
              />`}
      <div class="description">${(0,ze.kg)("editor.background_image_desc")}</div>
    </div>
    ${a?je.qy`<div class="form-row">
              <label style="margin-right: 8px; min-width: 120px;">${(0,ze.kg)("editor.background_opacity")}</label>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                style="flex: 1;"
                .value=${String(o)}
                @change=${t=>Wt(e,"opacity",Number(t.target.value))}
              />
              <span>${o}%</span>
            </div>
            ${e._renderCheckbox("dashboard-background-fixed",(0,ze.kg)("editor.background_fixed"),"fixed"===i.attachment,t=>Wt(e,"attachment",t?"fixed":void 0))}`:je.s6}
  `}(e.editor)}
      ${Vt(e,"weather_entity","basic-weather-entity",(0,ze.kg)("editor.weather_entity_auto"),Tt(e.hass,e=>e.startsWith("weather.")))}
      ${Kt("overview-max-columns",(0,ze.kg)("editor.overview_max_columns"),String(t.overview_max_columns??3),(o?.values??[1,2,3,4]).map(e=>({value:String(e),label:String(e)})),t=>e.setOption("overview_max_columns",Number(t),3))}
      ${Kt("overview-area-card-columns",(0,ze.kg)("editor.overview_area_card_columns"),String(i),[{value:"full",label:(0,ze.kg)("editor.columns_full")},{value:"6",label:"2"},{value:"4",label:"3"}],t=>e.setOption("overview_area_card_columns","full"===t?"full":Number(t),"full"))}
      ${Kt("weather-start-weather-mode",(0,ze.kg)("editor.weather_start_weather_mode"),(0,Re.As)(t),[{value:"full",label:(0,ze.kg)("editor.weather_mode_full")},{value:"compact_hourly",label:(0,ze.kg)("editor.weather_mode_compact_hourly")}],t=>e.setOption("weather_start_weather_mode",t,a))}
      ${Kt("weather-start-date-card",(0,ze.kg)("editor.weather_start_date_card"),t.weather_start_date_card??"button-card",[{value:"button-card",label:"button-card"},{value:"markdown",label:(0,ze.kg)("editor.date_card_markdown")}],t=>e.setOption("weather_start_date_card",t,"button-card"))}
    </div>
  `}(e))}
        ${Ut(this,pt("summaries"),()=>function(e){const t={description:!1};return je.qy`
    <div class="section">
      <div class="section-title">${(0,ze.kg)("editor.section_summaries")}</div>
      ${kt(e,"show_light_summary",{...t,defaultOn:!0,id:"basic-show-light-summary"})}
      ${kt(e,"show_covers_summary",{...t,defaultOn:!0,id:"basic-show-covers-summary"})}
      ${kt(e,"show_security_summary",{...t,defaultOn:!0,id:"basic-show-security-summary"})}
      ${kt(e,"show_climate_summary",{...t,id:"basic-show-climate-summary"})}
      ${kt(e,"show_battery_summary",{...t,defaultOn:!0,id:"basic-show-battery-summary"})}
      ${kt(e,"show_windows_summary")} ${kt(e,"compact_overview_summaries")}
    </div>
  `}(e))}
        ${Ut(this,pt("overviewSections"),()=>function(e){const t=new Set(e.config.hidden_section_headings||[]);return je.qy`
    <div class="section">
      <div class="section-title">${(0,ze.kg)("editor.section_overview_sections")}</div>
      <div class="description description-intro">${(0,ze.kg)("editor.overview_sections_desc")}</div>
      ${Lt.OH.filter(e=>e.toggle).map(t=>{const{flag:i,defaultOn:a}=t.toggle;return je.qy`
          <div class="form-row">
            <input
              type="checkbox"
              id=${i.replace(/_/g,"-")}
              ?checked=${wt(e.config,i,a)}
              @change=${t=>e.toggle(i,t.target.checked,a)}
            />
            <label for=${i.replace(/_/g,"-")}>
              <ha-icon class="row-icon" icon=${t.icon}></ha-icon>${(0,ze.kg)(t.labelKey)}
            </label>
          </div>
        `})}
      <div class="description description-intro">${(0,ze.kg)("editor.overview_sections_hint")}</div>

      ${!0===e.config.show_agenda_section?Ft(e,"agenda_calendar_entities","calendar."):je.s6}
      ${!0===e.config.show_todos_section?Ft(e,"todos_entities","todo."):je.s6}

      <div class="subsection-title">${(0,ze.kg)("editor.hidden_section_headings")}</div>
      <div class="description description-intro">${(0,ze.kg)("editor.hidden_section_headings_desc")}</div>
      ${Dt.map(i=>e.checkbox(`hide-heading-${i.replace(/_/g,"-")}`,(0,ze.kg)(`sections.${i}`),t.has(i),t=>e.update(e=>{const a=new Set(e.hidden_section_headings||[]);t?a.add(i):a.delete(i),a.size>0?e.hidden_section_headings=[...a]:delete e.hidden_section_headings})))}
    </div>
  `}(e))}
        ${Ut(this,pt("favorites"),()=>function(e){const t=e.config.light_favorite_entities||[];return je.qy`
    <div class="section">
      <div class="section-title">${(0,ze.kg)("editor.section_favorites")}</div>
      ${It(e,{key:"favorite_entities",listId:"favorites-list",emptyLabel:(0,ze.kg)("editor.no_favorites")})}
      <div class="description">${(0,ze.kg)("editor.favorites_desc")}</div>
      ${kt(e,"favorites_show_state",{labelKey:"editor.show_state",description:!1})}
      ${kt(e,"favorites_hide_last_changed",{labelKey:"editor.hide_last_changed",description:!1})}

      <div class="subsection-title">${(0,ze.kg)("editor.light_favorites")}</div>
      <ha-textfield
        .value=${t.join(", ")}
        label=${(0,ze.kg)("editor.light_favorites_entities")}
        helper=${(0,ze.kg)("editor.light_favorites_desc")}
        @change=${t=>{const i=xt(t.target.value,e=>e.startsWith("light."));e.update(e=>{i.length>0?e.light_favorite_entities=i:delete e.light_favorite_entities})}}
      ></ha-textfield>

      <div class="subsection-title">${(0,ze.kg)("editor.quick_actions")}</div>
      ${It(e,{key:"quick_action_entities",listId:"quick-actions-list",emptyLabel:(0,ze.kg)("editor.no_quick_actions")})}
      <div class="description">${(0,ze.kg)("editor.quick_actions_desc")}</div>
    </div>
  `}(e))}

        <div class="section-divider">
          <div class="section-divider-title">${(0,ze.kg)("editor.section_areas_rooms")}</div>
        </div>

        ${Ut(this,pt("areas"),()=>this._renderAreasListSection())}
        ${Ut(this,pt("areaOptions"),()=>this._renderAreasSection())}
        ${Ut(this,pt("roomPins"),()=>{return t=e,je.qy`
    <div class="section">
      <div class="section-title">${(0,ze.kg)("editor.section_room_pins")}</div>
      ${It(t,{key:"room_pin_entities",listId:"room-pins-list",emptyLabel:(0,ze.kg)("editor.no_room_pins"),withArea:!0})}
      <div class="description">${(0,$t._)((0,ze.kg)("editor.room_pins_desc"))}</div>
      ${kt(t,"room_pins_show_state",{labelKey:"editor.show_state",description:!1})}
      ${kt(t,"room_pins_hide_last_changed",{labelKey:"editor.hide_last_changed",description:!1})}
    </div>
  `;var t})}
        ${Ut(this,pt("views"),()=>this._renderViewsSection())}

        <div class="section-divider">
          <div class="section-divider-title">${(0,ze.kg)("editor.section_advanced")}</div>
        </div>
        ${Ut(this,pt("appearance"),()=>function(e){const t=e.config,i=!0===t.show_search_card,a="tip"===t.search_card_variant,o=a||void 0!==customElements.get("search-card")&&void 0!==customElements.get("card-tools");return je.qy`
    <div class="section">
      <div class="section-title">${(0,ze.kg)("editor.section_overview_details")}</div>

      <div class="subsection-title">${(0,ze.kg)("editor.header_badges")}</div>
      ${kt(e,"show_person_badges",{defaultOn:!0})}
      ${Kt("person-badge-layout",(0,ze.kg)("editor.person_badge_layout"),t.person_badge_layout||"with_state",["minimal","with_state","with_state_and_time"].map(e=>({value:e,label:(0,ze.kg)(`editor.person_badge_layout_${e}`)})),t=>e.update(e=>{"with_state"===t?delete e.person_badge_layout:e.person_badge_layout=t}))}
      <div class="description">${(0,ze.kg)("editor.person_badge_layout_desc")}</div>
      ${kt(e,"show_unavailable_alert_badge")} ${kt(e,"show_now_playing_badge")}
      ${kt(e,"show_sun_badge")} ${kt(e,"show_updates_badge")}
      ${Vt(e,"power_badge_entity","power-badge-entity",(0,ze.kg)("editor.power_badge_none"),Tt(e.hass,t=>t.startsWith("sensor.")&&"power"===e.hass?.states[t]?.attributes?.device_class&&!e.hass?.entities[t]?.entity_category))}
      <div class="description">${(0,ze.kg)("editor.power_badge_entity_desc")}</div>

      <div class="subsection-title">${(0,ze.kg)("editor.overview_blocks")}</div>
      ${kt(e,"show_clock_card",{defaultOn:!0})}
      ${Vt(e,"alarm_entity","alarm-entity",(0,ze.kg)("editor.alarm_none"),Tt(e.hass,e=>e.startsWith("alarm_control_panel.")))}
      <div class="description">${(0,ze.kg)("editor.alarm_desc")}</div>
      ${Vt(e,"house_mode_entity","house-mode-entity",(0,ze.kg)("editor.house_mode_none"),(r=e.hass,Tt(r,e=>{if(!e.startsWith("input_select.")&&!e.startsWith("select."))return!1;const t=r?.entities[e]?.entity_category;return"config"!==t&&"diagnostic"!==t})))}
      <div class="description">${(0,ze.kg)("editor.house_mode_desc")}</div>

      ${kt(e,"show_search_card",{description:!1,disabled:!o})}
      <div class="description">
        ${o?(0,ze.kg)("editor.show_search_card_desc"):je.qy`<span>&#x26A0;&#xFE0F; ${(0,$t._)((0,ze.kg)("editor.show_search_card_missing"))}</span>`}
      </div>
      ${i?Kt("search-card-variant",(0,ze.kg)("editor.search_card_variant"),a?"tip":"custom",[{value:"custom",label:(0,ze.kg)("editor.search_card_variant_custom")},{value:"tip",label:(0,ze.kg)("editor.search_card_variant_tip")}],t=>e.update(e=>{"tip"===t?e.search_card_variant="tip":delete e.search_card_variant})):je.s6}
    </div>
  `;var r}(e))}
        ${Ut(this,pt("details"),()=>function(e){const t=e.config,i=t.summaries_columns||2,a="critical"===t.unavailable_batteries_bucket?"critical":"good",o=t.security_extra_entities||[],r=(t,i)=>t?je.s6:kt(e,i);return je.qy`
    <div class="section">
      <div class="section-title">${(0,ze.kg)("editor.section_summary_details")}</div>

      ${Mt("summaries-2-columns","summaries-columns",(0,ze.kg)("editor.columns_2"),2===i,()=>Nt(e,"summaries_columns",void 0))}
      ${Mt("summaries-4-columns","summaries-columns",(0,ze.kg)("editor.columns_4"),4===i,()=>Nt(e,"summaries_columns",4))}
      <div class="description">${(0,ze.kg)("editor.columns_desc")}</div>

      <div class="subsection-title">${(0,ze.kg)("editor.security_options")}</div>
      ${r(!1!==t.show_security_summary,"show_security_view")}
      ${kt(e,"group_security_by_areas")} ${kt(e,"hide_hidden_areas_in_security")}
      ${kt(e,"show_security_activity")}
      <div class="form-row">
        <label for="security-activity-position">${(0,ze.kg)("editor.security_activity_position")}</label>
        <select
          id="security-activity-position"
          @change=${t=>Nt(e,"security_activity_position","end"===t.target.value?"end":void 0)}
        >
          <option value="start" ?selected=${"end"!==t.security_activity_position}>
            ${(0,ze.kg)("editor.position_start")}
          </option>
          <option value="end" ?selected=${"end"===t.security_activity_position}>
            ${(0,ze.kg)("editor.position_end")}
          </option>
        </select>
      </div>
      <ha-textfield
        .value=${o.join(", ")}
        label=${(0,ze.kg)("editor.security_extra_entities")}
        @change=${t=>{const i=xt(t.target.value,e=>e.includes("."));Nt(e,"security_extra_entities",i.length>0?i:void 0)}}
      ></ha-textfield>

      <div class="subsection-title">${(0,ze.kg)("editor.lights_options")}</div>
      ${r(!1!==t.show_light_summary,"show_light_view")} ${kt(e,"group_lights_by_floors")}
      ${kt(e,"group_lights_by_areas")} ${kt(e,"nested_light_groups")}
      ${e.checkbox("lights-sort-by-name",(0,ze.kg)("editor.lights_sort_by_name"),"name"===t.lights_sort_by,t=>Nt(e,"lights_sort_by",t?"name":void 0))}
      <div class="description">${(0,ze.kg)("editor.lights_sort_by_name_desc")}</div>

      <div class="subsection-title">${(0,ze.kg)("editor.covers_options")}</div>
      ${r(!1!==t.show_covers_summary,"show_covers_view")}
      ${kt(e,"group_covers_by_floors")} ${kt(e,"group_covers_by_areas")}
      ${kt(e,"show_partially_open_covers")}

      <div class="subsection-title">${(0,ze.kg)("editor.climate_options")}</div>
      ${!0===t.show_climate_summary?je.s6:kt(e,"show_climate_view")}
      ${kt(e,"show_climate_air_quality")}
      ${!0===t.show_climate_air_quality?je.qy`
              ${jt(e,"climate_humidity_threshold",{id:"climate-humidity-threshold",label:(0,ze.kg)("editor.climate_humidity_threshold"),defaultValue:65,min:1,max:100,unit:"%"})}
              ${jt(e,"climate_co2_threshold",{id:"climate-co2-threshold",label:(0,ze.kg)("editor.climate_co2_threshold"),defaultValue:1200,min:400,max:5e3,unit:"ppm"})}
            `:je.s6}

      <div class="subsection-title">${(0,ze.kg)("editor.battery_options")}</div>
      ${kt(e,"hide_mobile_app_batteries")} ${kt(e,"hide_battery_notes_entities")}
      ${!1!==t.show_battery_summary?je.s6:kt(e,"show_battery_view")}
      ${kt(e,"show_area_in_battery_view")} ${kt(e,"group_batteries_by_areas")}

      <div class="option-group-title">${(0,ze.kg)("editor.battery_thresholds")}</div>
      ${jt(e,"battery_critical_threshold",{id:"battery-critical-threshold",label:(0,ze.kg)("editor.battery_critical_below"),defaultValue:Ge("battery_critical_threshold",t),min:1,max:99,unit:"%"})}
      ${jt(e,"battery_low_threshold",{id:"battery-low-threshold",label:(0,ze.kg)("editor.battery_low_below"),defaultValue:Ge("battery_low_threshold",t),min:1,max:99,unit:"%"})}
      <div class="description">${(0,ze.kg)("editor.battery_thresholds_desc")}</div>

      <div class="option-group-title">${(0,ze.kg)("editor.unavailable_batteries_bucket")}</div>
      ${Mt("battery-unavailable-good","battery-unavailable-bucket",(0,ze.kg)("batteries.good"),"good"===a,()=>Nt(e,"unavailable_batteries_bucket",void 0))}
      ${Mt("battery-unavailable-critical","battery-unavailable-bucket",(0,ze.kg)("batteries.critical"),"critical"===a,()=>Nt(e,"unavailable_batteries_bucket","critical"))}
      <div class="description">${(0,ze.kg)("editor.unavailable_batteries_bucket_desc")}</div>
    </div>
  `}(e))}
        ${Ut(this,pt("sectionOrder"),()=>this._renderWeatherStartOrderPanel())}
        ${Ut(this,pt("advanced"),()=>{return t=e,je.qy`
    <div class="section">
      <div class="section-title">${(0,ze.kg)("editor.section_advanced_options")}</div>
      ${kt(t,"hide_unavailable_entities")} ${kt(t,"dense_section_placement")}
      ${kt(t,"hide_completed_todos")}
    </div>
  `;var t})}
        ${Ut(this,pt("customContent"),()=>this._renderCustomContentSection())}
      </div>
      ${this._cardPickerOpen?this._renderCardPickerOverlay():je.s6}
    `}_renderPanelNavigation(){return je.qy`<nav class="panel-navigation" aria-label=${(0,ze.kg)("editor.panel_navigation")}>
      <label for="panel-navigation-select">${(0,ze.kg)("editor.panel_navigation")}</label>
      <select
        id="panel-navigation-select"
        @change=${e=>{const t=e.target,i=t.value;t.value="",i&&this._jumpToPanel(i)}}
      >
        <option value="">${(0,ze.kg)("editor.panel_navigation")}</option>
        ${ht.map(e=>je.qy`<optgroup label=${(0,ze.kg)(e.labelKey)}>
              ${e.panels.map(e=>je.qy`<option value=${e}>${pt(e).label}</option>`)}
            </optgroup>`)}
      </select>
    </nav>`}_renderOptionSearch(){const e=this._optionSearch.trim(),t=""!==e||this._showChangedOnly,i=t?function(e,t,i){const a=yt(t).split(/\s+/).filter(Boolean);if(!a.length&&!i)return[];const o=[];for(const t of function(e){const t=[];for(const[i,a]of Object.entries(Be)){const o=mt[i];t.push({key:i,label:ft(a.labelKey),description:ft(`${a.labelKey}_desc`),panel:o,panelLabel:o?pt(o).label:"",changed:vt(e,i)})}for(const{key:i,labelKey:a,panel:o}of gt)t.push({key:i,label:ft(a),description:"",panel:o,panelLabel:pt(o).label,changed:vt(e,i)});return t}(e)){if(i&&!t.changed)continue;const e=yt(t.label),r=yt(t.key),s=yt(`${t.description} ${t.panelLabel}`);a.every(t=>e.includes(t)||r.includes(t)||s.includes(t))&&o.push({entry:t,score:a.reduce((t,i)=>t+(e.includes(i)?2:r.includes(i)?1:0),0)})}return o.sort((e,t)=>t.score-e.score||e.entry.label.localeCompare(t.entry.label)).map(({entry:e})=>e)}(this._config,e,this._showChangedOnly):[];return je.qy`<section class="option-search" aria-label=${(0,ze.kg)("editor.search_options")}>
      <input
        type="search"
        class="option-search-input"
        .value=${this._optionSearch}
        placeholder=${(0,ze.kg)("editor.search_options_placeholder")}
        aria-label=${(0,ze.kg)("editor.search_options")}
        @input=${e=>{this._optionSearch=e.target.value}}
      />
      ${this._renderCheckbox("option-search-changed",(0,ze.kg)("editor.show_changed_only"),this._showChangedOnly,e=>{this._showChangedOnly=e})}
      <div role="status" aria-live="polite">
        ${t&&!i.length?je.qy`<p class="description">${(0,ze.kg)(e?"editor.no_results":"editor.no_changed_options")}</p>`:je.s6}
      </div>
      ${i.length?je.qy`<ul class="option-search-results">
              ${i.map(e=>je.qy`<li>
                    <button
                      type="button"
                      class="option-search-result"
                      ?disabled=${!e.panel}
                      @click=${()=>{e.panel&&this._jumpToPanel(e.panel)}}
                    >
                      <span>${e.label}</span>
                      <span class="option-search-meta"
                        >${e.panelLabel||(0,ze.kg)("editor.search_yaml_only")} · <code>${e.key}</code></span
                      >
                    </button>
                  </li>`)}
            </ul>`:je.s6}
    </section>`}async _jumpToPanel(e){const t=pt(e);!function(e,t){e._expandedPanels.has(t)||(e._expandedPanels.add(t),Bt(e._expandedPanels),e.requestUpdate())}(this,t.key),await this.updateComplete;const i=this.shadowRoot?.querySelector(`[data-panel-key="${t.key}"] .panel-header`);i?.scrollIntoView({block:"start",behavior:"smooth"}),i?.focus({preventScroll:!0})}async _openDiagnosticLocation(e){const t=pt(e.startsWith("areas_")?"areaOptions":e.startsWith("room_pin")?"roomPins":e.startsWith("weather_start")?"sectionOrder":e.startsWith("custom_")?"customContent":e.includes("favorite")||e.startsWith("quick_action")?"favorites":"overview");this._expandedPanels.add(t.key);const i=e.startsWith("areas_options.")?e.split(".")[1]:void 0;i&&(this._expandedAreas=new Set([...this._expandedAreas,i]),this._areaEntitiesCache.has(i)||this._loadAreaEntities(i)),this.requestUpdate(),await this.updateComplete;const a=[...this.shadowRoot?.querySelectorAll(".panel-header")??[]].find(e=>e.textContent?.includes(t.label)),o=i?[...this.shadowRoot?.querySelectorAll(".area-item")??[]].find(e=>e.dataset.areaId===i):void 0;(o??a)?.scrollIntoView({block:"start",behavior:"smooth"}),i&&e.includes("view_override")&&o?.querySelector("textarea")?.focus()}_renderDiagnostics(){const e=this._diagnosticsChecked&&this._hass?this._diagnostics.inspect(this._config,this._hass):[];return je.qy`
      <p>${(0,ze.kg)("editor.diagnostics_help")}</p>
      <button
        type="button"
        @click=${()=>{this._diagnosticsChecked=!0,this.requestUpdate()}}
      >
        ${(0,ze.kg)("editor.diagnostics_check")}
      </button>
      <div role="status" aria-live="polite">
        ${this._diagnosticsChecked&&!e.length?je.qy`<p>${(0,ze.kg)("editor.diagnostics_ok")}</p>`:je.s6}
      </div>
      ${["error","warning","info"].map(t=>je.qy` ${e.some(e=>e.severity===t)?je.qy`<h3>${(0,ze.kg)("editor.diagnostics_severity_"+t)}</h3>`:je.s6}
          ${e.filter(e=>e.severity===t).map(e=>je.qy`<div class="custom-item" style="overflow-wrap:anywhere">
                  <strong>${(0,ze.kg)("editor.diagnostics_"+(e.status??e.code))}</strong>${e.entityId?je.qy`: ${e.entityId}`:je.s6}
                  <div>${e.path}</div>
                  <button type="button" @click=${()=>{this._openDiagnosticLocation(e.path)}}>
                    ${(0,ze.kg)("editor.diagnostics_open")}
                  </button>
                </div>`)}`)}
    `}_getWeatherStartOrder(){return this._config.weather_start_order||[...ct.l]}_isWeatherStartBlockDisabled(e){switch(e){case"clock":return!1===this._config.show_clock_card;case"weather_current":case"weather_daily":return!1===this._config.show_weather;case"weather_hourly":return!1===this._config.show_weather||"compact_hourly"===(0,Re.As)(this._config);case"weather_details":return 0===(this._config.weather_sensors||[]).length&&0===(this._config.pollen_entities||[]).length;case"favorites":return 0===(this._config.favorite_entities||[]).length;case"light_favorites":return 0===(this._config.light_favorite_entities||[]).length;case"alarm":return!this._config.alarm_entity;case"search":return!0!==this._config.show_search_card;case"overview":return!(this._config.custom_cards||[]).some(e=>"overview"===(e.target_section||"custom_cards"));case"energy":return!1===this._config.show_energy;case"plants":return!0!==this._config.show_plants_section;case"agenda":return!0!==this._config.show_agenda_section;case"todos":return!0!==this._config.show_todos_section;case"persons":return!0!==this._config.show_persons_section;case"vacuums":return!0!==this._config.show_vacuums_section;case"maintenance":return!0!==this._config.show_maintenance_section;case"quick_actions":return 0===(this._config.quick_action_entities||[]).length;case"media":return!0!==this._config.show_media_section;case"timers":return!0!==this._config.show_timers_section;case"activity":return!0!==this._config.show_activity_section;case"custom_cards":return 0===(this._config.custom_cards||[]).length;case"custom_sections":return 0===(this._config.custom_sections||[]).length;case"summaries":return!1===this._config.show_light_summary&&!1===this._config.show_covers_summary&&!1===this._config.show_security_summary&&!1===this._config.show_battery_summary&&!0!==this._config.show_climate_summary&&!0!==this._config.show_windows_summary;default:return!1}}_createWeatherStartItemId(e){return`${e}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}_getWeatherStartAreaOptions(){if(!this._hass)return[];const e=this._getNormalizedAreasDisplay(),t=e?.hidden||[],i=e?.order||[],a=t.join("\0"),o=i.join("\0");if(this._weatherStartAreaOptionsCache&&this._weatherStartAreaOptionsCache.areas===this._hass.areas&&this._weatherStartAreaOptionsCache.hiddenKey===a&&this._weatherStartAreaOptionsCache.orderKey===o)return this._weatherStartAreaOptionsCache.options;const r=new Set(t),s=new Map(i.map((e,t)=>[e,t])),n=Object.values(this._hass.areas||{}).filter(e=>!r.has(e.area_id)).sort((e,t)=>{const i=s.get(e.area_id)??-1,a=s.get(t.area_id)??-1;return(i>=0?i:9999)-(a>=0?a:9999)||e.name.localeCompare(t.name)});return this._weatherStartAreaOptionsCache={areas:this._hass.areas,hiddenKey:a,orderKey:o,options:n},n}_getWeatherStartFloorOptions(){if(!this._hass)return[];const e=this._getWeatherStartAreaOptions();if(this._weatherStartFloorOptionsCache&&this._weatherStartFloorOptionsCache.floors===this._hass.floors&&this._weatherStartFloorOptionsCache.areas===e)return this._weatherStartFloorOptionsCache.options;const t=new Set;let i=!1;for(const a of e)a.floor_id?t.add(a.floor_id):i=!0;const a=Object.values(this._hass.floors||{}).filter(e=>t.has(e.floor_id)).sort((e,t)=>(e.level??9999)-(t.level??9999)||e.name.localeCompare(t.name)).map(e=>({floor_id:e.floor_id,name:e.name,icon:e.icon}));return i&&a.push({floor_id:null,name:(0,ze.kg)("sections.areas_other"),icon:"mdi:home-outline"}),this._weatherStartFloorOptionsCache={floors:this._hass.floors,areas:e,options:a},a}_getCustomCardRef(e,t){return e.id||`legacy-custom-card-${t}`}_getCustomSectionRef(e,t){return e.id||`legacy-custom-section-${t}`}_getCustomCardEditorLabel(e,t){return e?.editor_title||e?.title||t}_getLegacyWeatherStartLayoutItems(){const e=this._getWeatherStartOrder(),t=[];for(const i of e){const e=this._config.weather_start_blocks_config?.[i];if("areas"===i)if(!0===this._config.group_by_floors)for(const e of this._getWeatherStartFloorOptions())t.push({id:`floor-${e.floor_id||"none"}`,type:"floor",floor_id:e.floor_id,title:e.name});else for(const e of this._getWeatherStartAreaOptions())t.push({id:`area-${e.area_id}`,type:"area",area_id:e.area_id});else"custom_cards"===i?(this._config.custom_cards||[]).forEach((e,i)=>{t.push({id:`custom-card-${this._getCustomCardRef(e,i)}`,type:"custom_card",custom_card_id:this._getCustomCardRef(e,i)})}):"custom_sections"===i?(this._config.custom_sections||[]).forEach((e,i)=>{t.push({id:`custom-section-${this._getCustomSectionRef(e,i)}`,type:"custom_section",custom_section_id:this._getCustomSectionRef(e,i)})}):t.push({id:i,type:i,...e?.yaml?{yaml:e.yaml,parsed_config:e.parsed_config,_yaml_error:e._yaml_error}:{}})}return t}_normalizeWeatherStartLayoutItems(e){const t=this._getWeatherStartAreaOptions(),i=new Set(t.map(e=>e.area_id)),a=new Set,o=[],r=(e,t)=>{i.has(e)&&!a.has(e)&&(a.add(e),o.push({...t||{},id:t?.id||`area-${e}`,type:"area",area_id:e}))},s=e=>{const i=t.filter(t=>e.floor_id?t.floor_id===e.floor_id:!t.floor_id);if(0!==i.length){for(const e of i)a.add(e.area_id);o.push({...e})}};for(const i of e)if("area"!==i.type)if("floor"!==i.type)if("areas"!==i.type)o.push({...i});else if(!0===this._config.group_by_floors)for(const e of this._getWeatherStartFloorOptions())s({id:`floor-${e.floor_id||"none"}`,type:"floor",floor_id:e.floor_id,title:e.name});else for(const e of t)r(e.area_id);else s(i);else i.area_id&&r(i.area_id,i);for(const e of t)r(e.area_id);return o}_getWeatherStartLayoutItems(){const e=this._config.weather_start_layout_items?.length?this._config.weather_start_layout_items.map(e=>({...e})):this._getLegacyWeatherStartLayoutItems();return this._normalizeWeatherStartLayoutItems((0,Re.wX)(e,this._config))}_saveWeatherStartLayoutItems(e){return function(e,t){const i=e._normalizeWeatherStartLayoutItems(t),a={...e._config,weather_start_layout_items:i};e._config=a,e._fireConfigChanged(a)}(this._weatherLayoutHost,e)}_toggleWeatherBlockExpanded(e){const t=new Set(this._expandedWeatherBlocks);t.has(e)?t.delete(e):t.add(e),this._expandedWeatherBlocks=t}_parseWeatherStartItemYaml(e){return function(e,t){const i=t.trim();if(!i)return{parsed_config:void 0,_yaml_error:void 0};try{const e=xe.load(i);return Array.isArray(e)||e&&"object"==typeof e?{parsed_config:e}:{parsed_config:void 0,_yaml_error:"YAML must be a card, section, view with sections, or list of cards"}}catch(e){return{parsed_config:void 0,_yaml_error:(e instanceof Error?e.message.split("\n")[0]:"Invalid YAML")||"Invalid YAML"}}}(this._weatherLayoutHost,e)}_updateWeatherStartItemYaml(e,t){return function(e,t,i){const a=e._getWeatherStartLayoutItems().map(a=>{if(a.id!==t)return a;const o={...a,yaml:i},r=e._parseWeatherStartItemYaml(i);return o.parsed_config=r.parsed_config,o._yaml_error=r._yaml_error,i.trim()||(delete o.yaml,delete o.parsed_config,delete o._yaml_error),o});if(a.find(e=>e.id===t&&e._yaml_error))return e._config={...e._config,weather_start_layout_items:a},void e.requestUpdate();e._saveWeatherStartLayoutItems(a)}(this._weatherLayoutHost,e,t)}_resetWeatherStartItemYaml(e){return function(e,t){const i=e._getWeatherStartLayoutItems().map(e=>{if(e.id!==t)return e;const i={...e};return delete i.yaml,delete i.parsed_config,delete i._yaml_error,i});e._saveWeatherStartLayoutItems(i)}(this._weatherLayoutHost,e)}_getWeatherStartCustomCardIndex(e,t=this._config.custom_cards||[]){return"custom_card"!==e.type?-1:t.findIndex((t,i)=>this._getCustomCardRef(t,i)===e.custom_card_id)}_getWeatherStartCustomSectionIndex(e,t=this._config.custom_sections||[]){return"custom_section"!==e.type?-1:t.findIndex((t,i)=>this._getCustomSectionRef(t,i)===e.custom_section_id)}_renderWeatherStartCustomCardEditor(e,t){return function(e,t,i){const a=t._yaml_error?je.qy`<div style="color: var(--error-color); font-size: 12px; margin-top: 4px;">&#x274C; ${t._yaml_error}</div>`:t.yaml?je.qy`<div style="color: var(--success-color, green); font-size: 12px; margin-top: 4px;">
          &#x2705; ${(0,ze.kg)("editor.yaml_valid")}
        </div>`:je.s6;return je.qy`
    <label class="form-row" style="margin: 0 0 8px 0;">
      <span style="min-width: 150px;">${(0,ze.kg)("editor.card_editor_title_label")}</span>
      <input
        type="text"
        style="flex: 1;"
        .value=${t.editor_title||""}
        placeholder=${(0,ze.kg)("editor.card_editor_title_placeholder")}
        @change=${t=>e._updateCustomCardField(i,"editor_title",t.target.value)}
      />
    </label>
    <div class="description" style="margin: 0 0 8px 0;">${(0,ze.kg)("editor.card_editor_title_help")}</div>
    <label class="form-row" style="margin: 0 0 8px 0;">
      <span style="min-width: 150px;">${(0,ze.kg)("editor.card_dashboard_title_label")}</span>
      <input
        type="text"
        style="flex: 1;"
        .value=${t.title||""}
        placeholder=${(0,ze.kg)("editor.card_title_placeholder")}
        @change=${t=>e._updateCustomCardField(i,"title",t.target.value)}
      />
    </label>
    <div class="description" style="margin: 0 0 6px 0;">${(0,ze.kg)("editor.weather_start_card_yaml_desc")}</div>
    <textarea
      rows="8"
      style="width:100%;box-sizing:border-box;font-family:monospace;font-size:12px;resize:vertical;"
      placeholder=${(0,ze.kg)("editor.yaml_placeholder")}
      .value=${t.yaml||""}
      @change=${t=>e._updateCustomCardYaml(i,t.target.value)}
    ></textarea>
    <button class="btn-primary" style="margin-top: 6px;" @click=${()=>e._openCardEditorForCustomCard(i)}>
      ${(0,ze.kg)("editor.edit_card_with_ha_editor")}
    </button>
    ${a}
  `}(this._weatherLayoutHost,e,t)}_renderWeatherStartCustomSectionEditor(e,t){return function(e,t,i){const a=t.cards||[];return je.qy`
    <div class="custom-item-row" style="margin-bottom: 8px;">
      <input
        type="text"
        .value=${t.title||""}
        placeholder=${(0,ze.kg)("editor.custom_section_title_placeholder")}
        style="flex: 2;"
        @change=${t=>e._updateCustomSectionField(i,"title",t.target.value)}
      />
      <input
        type="text"
        .value=${t.icon||""}
        placeholder=${(0,ze.kg)("editor.custom_section_icon_placeholder")}
        style="flex: 1;"
        @change=${t=>e._updateCustomSectionField(i,"icon",t.target.value)}
      />
    </div>
    <div class="description" style="margin: 0 0 8px 0;">${(0,ze.kg)("editor.weather_start_section_cards_desc")}</div>
    ${0===a.length?je.qy`<div class="empty-state">${(0,ze.kg)("editor.no_custom_cards")}</div>`:a.map((t,a)=>{const o=t._yaml_error?je.qy`<span style="color: var(--error-color);">&#x274C; ${t._yaml_error}</span>`:t.yaml?je.qy`<span style="color: var(--success-color, green);"
                    >&#x2705; ${(0,ze.kg)("editor.yaml_valid")}</span
                  >`:je.s6;return je.qy`
              <div class="custom-item" style="margin-bottom: 8px;">
                <div class="custom-item-header">
                  <strong
                    >${e._getCustomCardEditorLabel(t,`${(0,ze.kg)("editor.new_card")} ${a+1}`)}</strong
                  >
                  <button class="btn-remove" @click=${()=>e._removeCardFromSection(i,a)}>
                    &#x2715;
                  </button>
                </div>
                <div class="custom-item-fields">
                  <label>${(0,ze.kg)("editor.card_editor_title_label")}</label>
                  <input
                    type="text"
                    .value=${t.editor_title||""}
                    placeholder=${(0,ze.kg)("editor.card_editor_title_placeholder")}
                    @change=${t=>e._updateSectionCardField(i,a,"editor_title",t.target.value)}
                  />
                  <div class="description" style="margin: 0 0 4px 0;">${(0,ze.kg)("editor.card_editor_title_help")}</div>
                  <label>${(0,ze.kg)("editor.card_dashboard_title_label")}</label>
                  <input
                    type="text"
                    .value=${t.title||""}
                    placeholder=${(0,ze.kg)("editor.card_title_placeholder")}
                    @change=${t=>e._updateSectionCardField(i,a,"title",t.target.value)}
                  />
                  <textarea
                    rows="5"
                    placeholder=${(0,ze.kg)("editor.yaml_placeholder")}
                    .value=${t.yaml||""}
                    style="width: 100%;"
                    @change=${t=>e._updateSectionCardYaml(i,a,t.target.value)}
                  ></textarea>
                  <button
                    class="btn-primary"
                    style="margin-top: 6px;"
                    @click=${()=>e._openCardEditorForSectionCard(i,a)}
                  >
                    ${(0,ze.kg)("editor.edit_card_with_ha_editor")}
                  </button>
                  <div class="custom-item-validation">${o}</div>
                </div>
              </div>
            `})}
    <button class="btn-primary" style="margin-top: 4px;" @click=${()=>e._openCardPickerForSection(i)}>
      ${(0,ze.kg)("editor.add_card_to_section")}
    </button>
  `}(this._weatherLayoutHost,e,t)}_removeWeatherStartItem(e){const t=this._getWeatherStartLayoutItems(),i=t.find(t=>t.id===e),a=t.filter(t=>t.id!==e);if(i){if("custom_card"===i.type){const e=[...this._config.custom_cards||[]],t=this._getWeatherStartCustomCardIndex(i,e);t>=0&&e.splice(t,1);const o={...this._config,weather_start_layout_items:a};return e.length>0?o.custom_cards=e:delete o.custom_cards,this._config=o,void this._fireConfigChanged(o)}if("custom_section"===i.type){const e=[...this._config.custom_sections||[]],t=this._getWeatherStartCustomSectionIndex(i,e);t>=0&&e.splice(t,1);const o={...this._config,weather_start_layout_items:a};return e.length>0?o.custom_sections=e:delete o.custom_sections,this._config=o,void this._fireConfigChanged(o)}this._saveWeatherStartLayoutItems(a)}else this._saveWeatherStartLayoutItems(a)}_addWeatherStartSummaries(){const e=this._getWeatherStartLayoutItems();e.some(e=>"summaries"===e.type)||(e.push({id:this._createWeatherStartItemId("summaries"),type:"summaries",summary_size:"mini"}),this._saveWeatherStartLayoutItems(e),this._expandedWeatherBlocks=new Set([...this._expandedWeatherBlocks,e[e.length-1].id]))}_addWeatherStartArea(e){const t=e.target.value;if(!t)return;const i=this._getWeatherStartLayoutItems();i.push({id:this._createWeatherStartItemId(`area-${t}`),type:"area",area_id:t}),this._saveWeatherStartLayoutItems(i),e.target.value=""}_addWeatherStartFloor(e){const t=e.target.value;if(!t)return;const i="__none__"===t?null:t,a=this._getWeatherStartFloorOptions().find(e=>e.floor_id===i),o=this._getWeatherStartLayoutItems();o.push({id:this._createWeatherStartItemId(`floor-${i||"none"}`),type:"floor",floor_id:i,title:a?.name}),this._saveWeatherStartLayoutItems(o),e.target.value=""}_toggleWeatherStartItemStack(e,t){const i=this._getWeatherStartLayoutItems().map(i=>{if(i.id!==e)return i;const a={...i};return t?a.stack_with_previous=!0:delete a.stack_with_previous,a});this._saveWeatherStartLayoutItems(i)}_weatherStartTitleChanged(e,t){const i=t.trim(),a=this._getWeatherStartLayoutItems().map(t=>{if(t.id!==e)return t;const a={...t};return i?a.title=i:delete a.title,a});this._saveWeatherStartLayoutItems(a)}_weatherStartSummarySizeChanged(e,t){const i=this._getWeatherStartLayoutItems().map(i=>i.id!==e?i:{...i,summary_size:t});this._saveWeatherStartLayoutItems(i)}_addWeatherStartSection(){const e=this._createWeatherStartItemId("section"),t=[...this._config.custom_sections||[],{id:e,title:"",icon:"",cards:[]}],i=[...this._getWeatherStartLayoutItems(),{id:`custom-section-${e}`,type:"custom_section",custom_section_id:e}],a={...this._config,custom_sections:t,weather_start_layout_items:i};this._config=a,this._fireConfigChanged(a),this._expandedWeatherBlocks=new Set([...this._expandedWeatherBlocks,`custom-section-${e}`])}_getWeatherStartItemMeta(e,t,i,a){if("area"===e.type){const i=t.find(t=>t.area_id===e.area_id);return{icon:i?.icon||"mdi:home-outline",label:i?.name||e.area_id||(0,ze.kg)("sections.areas")}}if("floor"===e.type){const t=this._getWeatherStartFloorOptions().find(t=>t.floor_id===(e.floor_id??null));return{icon:t?.icon||"mdi:floor-plan",label:e.title||t?.name||(0,ze.kg)("sections.areas")}}if("custom_card"===e.type){const t=i.find((t,i)=>this._getCustomCardRef(t,i)===e.custom_card_id);return{icon:"mdi:cards",label:this._getCustomCardEditorLabel(t,(0,ze.kg)("editor.new_card"))}}if("custom_section"===e.type){const t=a.find((t,i)=>this._getCustomSectionRef(t,i)===e.custom_section_id);return{icon:t?.icon||"mdi:view-grid-plus-outline",label:t?.title||(0,ze.kg)("editor.section_custom_sections")}}const o=Gt._weatherStartBlockMeta.get(e.type);return{icon:o?.icon||"mdi:view-dashboard-outline",label:o?(0,ze.kg)(o.labelKey):e.type}}_isWeatherStartItemDisabled(e,t,i){return!e.parsed_config&&(!!e._yaml_error||("custom_card"===e.type?!t.some((t,i)=>this._getCustomCardRef(t,i)===e.custom_card_id&&t.parsed_config):"custom_section"===e.type?!i.some((t,i)=>this._getCustomSectionRef(t,i)===e.custom_section_id&&(t.cards||[]).some(e=>e.parsed_config)):"floor"===e.type?!this._getWeatherStartAreaOptions().some(t=>e.floor_id?t.floor_id===e.floor_id:!t.floor_id):"summaries"===e.type?this._isWeatherStartBlockDisabled("summaries"):!!Gt._weatherStartBlockMeta.has(e.type)&&this._isWeatherStartBlockDisabled(e.type)))}_countNestedFixedGrids(e,t=0){if(!e||"object"!=typeof e)return 0;if(Array.isArray(e))return e.reduce((e,i)=>e+this._countNestedFixedGrids(i,t),0);const i=e;return(t>0&&"grid"===i.type&&"number"==typeof i.columns?1:0)+Object.values(i).reduce((e,i)=>e+this._countNestedFixedGrids(i,t+1),0)}_renderWeatherStartOrderPanel(){return function(e){const t=e._getWeatherStartLayoutItems(),i=e._getWeatherStartAreaOptions(),a=e._getWeatherStartFloorOptions(),o=e._config.custom_cards||[],r=e._config.custom_sections||[],s=t.some(e=>"summaries"===e.type),n=new Set(t.filter(e=>"area"===e.type&&e.area_id).map(e=>e.area_id));for(const e of t)if("floor"===e.type)for(const t of i)(e.floor_id?t.floor_id!==e.floor_id:t.floor_id)||n.add(t.area_id);const c=i.filter(e=>!n.has(e.area_id));let d=0;const l=t.some(e=>(d=e.stack_with_previous?d+1:0,d>=2)),_=t.map(t=>{const a=e._getWeatherStartItemMeta(t,i,o,r),s=e._getWeatherStartCustomCardIndex(t,o),n=e._getWeatherStartCustomSectionIndex(t,r);return{item:t,...a,disabled:e._isWeatherStartItemDisabled(t,o,r),expanded:e._expandedWeatherBlocks.has(t.id),customCard:s>=0?o[s]:void 0,customCardIndex:s,customSection:n>=0?r[n]:void 0,customSectionIndex:n,fixedGridCount:e._countNestedFixedGrids(t.parsed_config)}});return h={items:_,areas:i,floors:a,unplacedAreas:c,hasSummariesBlock:s,hasLongStackChain:l,renderCustomCardEditor:(t,i)=>e._renderWeatherStartCustomCardEditor(t,i),renderCustomSectionEditor:(t,i)=>e._renderWeatherStartCustomSectionEditor(t,i),onDragStart:e._handleWeatherStartDragStart,onDragEnd:e._handleWeatherStartDragEnd,onDragOver:e._handleWeatherStartDragOver,onDragLeave:e._handleWeatherStartDragLeave,onDrop:e._handleWeatherStartDrop,onToggleExpanded:t=>e._toggleWeatherBlockExpanded(t),onRemove:t=>e._removeWeatherStartItem(t),onSummarySizeChanged:(t,i)=>e._weatherStartSummarySizeChanged(t,i),onStackChanged:(t,i)=>e._toggleWeatherStartItemStack(t,i),onTitleChanged:(t,i)=>e._weatherStartTitleChanged(t,i),onYamlChanged:(t,i)=>e._updateWeatherStartItemYaml(t,i),onResetYaml:t=>e._resetWeatherStartItemYaml(t),onAddCard:e._openCardPickerForWeatherStartCard,onAddSummaries:()=>e._addWeatherStartSummaries(),onAddSection:()=>e._addWeatherStartSection(),onAddArea:t=>e._addWeatherStartArea(t),onAddFloor:t=>e._addWeatherStartFloor(t)},je.qy`
    <div class="section">
      <div class="section-title">${(0,ze.kg)("editor.weather_start_order")}</div>
      <div class="description" style="margin-left: 0; margin-bottom: 12px;">
        ${(0,ze.kg)("editor.weather_start_order_desc")}
      </div>
      ${h.hasLongStackChain?je.qy`
              <div style="color:var(--warning-color,#f0a000);font-size:12px;margin:0 0 10px 0;">
                ${(0,ze.kg)("editor.weather_start_stack_warning")}
              </div>
            `:je.s6}
      <div class="section-order-list" id="weather-start-order-list">
        ${h.items.map(({item:e,icon:t,label:i,disabled:a,expanded:o,customCard:r,customCardIndex:s,customSection:n,customSectionIndex:c,fixedGridCount:d})=>{const l=!!e.yaml,_="area"!==e.type&&"floor"!==e.type;return je.qy`
              <div>
                <div
                  class="section-order-item ${a?"disabled":""}"
                  data-ws-id=${e.id}
                  draggable="true"
                  @dragstart=${h.onDragStart}
                  @dragend=${h.onDragEnd}
                  @dragover=${h.onDragOver}
                  @dragleave=${h.onDragLeave}
                  @drop=${h.onDrop}
                >
                  <span class="drag-handle" draggable="true">&#x2630;</span>
                  <ha-icon class="section-icon" icon=${t}></ha-icon>
                  <span class="section-label">${i}</span>
                  ${a?je.qy`<span class="section-hidden-tag">(${(0,ze.kg)("editor.section_hidden")})</span>`:je.s6}
                  ${l?je.qy`<span
                          class="section-hidden-tag"
                          style="background:var(--primary-color);color:#fff;margin-left:4px;"
                          >✎</span
                        >`:je.s6}
                  <button
                    class="icon-btn"
                    style="margin-left:auto;"
                    title=${(0,ze.kg)("editor.weather_start_block_expand")}
                    @click=${t=>{t.stopPropagation(),h.onToggleExpanded(e.id)}}
                  >
                    <ha-icon icon=${o?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
                  </button>
                  ${_?je.qy`<button
                          class="icon-btn"
                          title=${(0,ze.kg)("editor.remove")}
                          @click=${t=>{t.stopPropagation(),h.onRemove(e.id)}}
                        >
                          <ha-icon icon="mdi:delete-outline"></ha-icon>
                        </button>`:je.s6}
                </div>
                ${o?je.qy`
                        <div
                          style="padding: 8px 12px 12px 12px; background: var(--secondary-background-color); border-radius: 0 0 8px 8px; margin-bottom: 4px;"
                        >
                          ${r?h.renderCustomCardEditor(r,s):je.s6}
                          ${n?h.renderCustomSectionEditor(n,c):je.s6}
                          ${r||n||"summaries"!==e.type?je.s6:je.qy`
                                  <label class="form-row" style="margin: 0 0 8px 0;">
                                    <span style="min-width: 120px;"
                                      >${(0,ze.kg)("editor.weather_start_summary_size")}</span
                                    >
                                    <select
                                      style="flex:1;"
                                      .value=${e.summary_size||"mini"}
                                      @change=${t=>h.onSummarySizeChanged(e.id,t.target.value)}
                                    >
                                      <option value="mini">
                                        ${(0,ze.kg)("editor.weather_start_summary_size_mini")}
                                      </option>
                                      <option value="normal">
                                        ${(0,ze.kg)("editor.weather_start_summary_size_normal")}
                                      </option>
                                    </select>
                                  </label>
                                `}
                          ${r||n||!(0,He.w)(e.type)?je.s6:je.qy`
                                  <label class="form-row" style="margin: 0 0 8px 0;">
                                    <span style="min-width: 120px;"
                                      >${(0,ze.kg)("editor.weather_start_block_title")}</span
                                    >
                                    <input
                                      type="text"
                                      style="flex:1;"
                                      .value=${e.title||""}
                                      placeholder=${(0,ze.kg)("editor.weather_start_block_title_placeholder")}
                                      @change=${t=>h.onTitleChanged(e.id,t.target.value)}
                                    />
                                  </label>
                                `}
                          ${r||n?je.s6:je.qy`
                                  <label class="form-row" style="margin: 0 0 8px 0;">
                                    <input
                                      type="checkbox"
                                      ?checked=${!0===e.stack_with_previous}
                                      @change=${t=>h.onStackChanged(e.id,t.target.checked)}
                                    />
                                    <span>${(0,ze.kg)("editor.weather_start_stack_with_previous")}</span>
                                  </label>
                                  <div class="description" style="margin: 0 0 6px 0;">
                                    ${(0,ze.kg)("editor.weather_start_block_yaml_desc")}
                                  </div>
                                  <textarea
                                    rows="6"
                                    style="width:100%;box-sizing:border-box;font-family:monospace;font-size:12px;resize:vertical;"
                                    placeholder=${(0,ze.kg)("editor.yaml_placeholder")}
                                    .value=${e.yaml||""}
                                    @change=${t=>h.onYamlChanged(e.id,t.target.value)}
                                  ></textarea>
                                  ${e._yaml_error?je.qy`<div style="color:var(--error-color);font-size:12px;margin-top:4px;">
                                          ${e._yaml_error}
                                        </div>`:je.s6}
                                  ${d>0?je.qy`<div
                                          style="color:var(--warning-color,#f0a000);font-size:12px;margin-top:4px;"
                                        >
                                          ${(0,ze.kg)("editor.weather_start_responsive_warning").replace("{count}",String(d))}
                                        </div>`:je.s6}
                                  ${e.parsed_config?je.qy`<div
                                          style="color:var(--success-color,green);font-size:12px;margin-top:4px;"
                                        >
                                          ${(0,ze.kg)("editor.yaml_valid")}
                                        </div>`:je.s6}
                                  ${l?je.qy`<button
                                          class="text-btn"
                                          style="margin-top:8px;"
                                          @click=${()=>h.onResetYaml(e.id)}
                                        >
                                          ${(0,ze.kg)("editor.weather_start_block_reset")}
                                        </button>`:je.s6}
                                `}
                        </div>
                      `:je.s6}
              </div>
            `})}
      </div>
      <div class="description" style="margin: 12px 0 6px 0;">${(0,ze.kg)("editor.weather_start_add_content_desc")}</div>
      <div class="custom-item-row weather-start-add-row">
        <button class="btn-primary" @click=${h.onAddCard}>${(0,ze.kg)("editor.weather_start_add_card")}</button>
        ${h.hasSummariesBlock?je.s6:je.qy`<button class="btn-primary" @click=${h.onAddSummaries}>
                ${(0,ze.kg)("editor.weather_start_add_summaries")}
              </button>`}
        <button class="btn-primary" @click=${h.onAddSection}>
          ${(0,ze.kg)("editor.weather_start_add_section")}
        </button>
        <select @change=${h.onAddArea}>
          <option value="">${(0,ze.kg)("editor.weather_start_add_area")}</option>
          ${h.unplacedAreas.map(e=>je.qy`<option value=${e.area_id}>${e.name}</option>`)}
        </select>
        <select @change=${h.onAddFloor}>
          <option value="">${(0,ze.kg)("editor.weather_start_add_floor")}</option>
          ${h.floors.map(e=>je.qy`<option value=${e.floor_id||"__none__"}>${e.name}</option>`)}
        </select>
      </div>
    </div>
  `;var h}(this._weatherLayoutHost)}_getStacksOrder(e){return(0,lt.WZ)(this._config.areas_options?.[e]?.stacks_order)}_updateStacksOrder(e,t){const i={...this._config.areas_options?.[e]||{}};t.join("|")===ct.x.join("|")?delete i.stacks_order:i.stacks_order=t;const a={...this._config.areas_options,[e]:i};0===Object.keys(a[e]).length&&delete a[e];const o={...this._config};0===Object.keys(a).length?delete o.areas_options:o.areas_options=a,this._config=o,this._fireConfigChanged(o)}_renderStackOrderPanel(e,t){return function(e){const{areaId:t,order:i,visible:a}=e,o=i.filter(e=>a.has(e)),r=i.filter(e=>!a.has(e));return je.qy`
    <div class="entity-group" data-group="stack_order">
      <div class="entity-group-header">
        <ha-icon icon="mdi:sort"></ha-icon>
        <span class="group-name">${(0,ze.kg)("editor.stack_order")}</span>
      </div>
      <div class="entity-list">
        <div class="description" style="margin-left: 0; margin-bottom: 8px;">
          ${(0,ze.kg)("editor.stack_order_desc")}
        </div>
        <div class="section-order-list" data-area-id=${t}>
          ${o.map((i,a)=>{const r=zt.get(i);return r?je.qy`
              <div
                class="section-order-item"
                data-area-id=${t}
                data-stack-key=${i}
                draggable="true"
                @dragstart=${e.onDragStart}
                @dragend=${e.onDragEnd}
                @dragover=${e.onDragOver}
                @dragleave=${e.onDragLeave}
                @drop=${e.onDrop}
              >
                <span class="drag-handle" draggable="true">&#x2630;</span>
                <ha-icon class="section-icon" icon=${r.icon}></ha-icon>
                <span class="section-label">${(0,ze.kg)(r.labelKey)}</span>
                <button
                  type="button"
                  class="stack-move-button"
                  aria-label=${`${(0,ze.kg)(r.labelKey)}: ${(0,ze.kg)("editor.move_up")}`}
                  title=${(0,ze.kg)("editor.move_up")}
                  ?disabled=${0===a}
                  @click=${()=>e.onMove(i,-1)}
                >
                  <ha-icon icon="mdi:chevron-up"></ha-icon>
                </button>
                <button
                  type="button"
                  class="stack-move-button"
                  aria-label=${`${(0,ze.kg)(r.labelKey)}: ${(0,ze.kg)("editor.move_down")}`}
                  title=${(0,ze.kg)("editor.move_down")}
                  ?disabled=${a===o.length-1}
                  @click=${()=>e.onMove(i,1)}
                >
                  <ha-icon icon="mdi:chevron-down"></ha-icon>
                </button>
              </div>
            `:je.s6})}
        </div>
        ${r.length>0?je.qy`<div class="section-order-compact">
                <div class="compact-title">${(0,ze.kg)("editor.stack_order_inactive")}</div>
                <div class="compact-chip-list">
                  ${r.map(e=>{const t=zt.get(e);return t?je.qy`<span class="compact-chip"
                          ><ha-icon icon=${t.icon}></ha-icon>${(0,ze.kg)(t.labelKey)}</span
                        >`:je.s6})}
                </div>
              </div>`:je.s6}
      </div>
    </div>
  `}({areaId:e,order:this._getStacksOrder(e),visible:Ht(t.groupedEntities,this._config),onMove:(i,a)=>{const o=this._getStacksOrder(e),r=function(e,t,i,a){const o=e.filter(e=>t.has(e)),r=o.indexOf(i),s=o[r+a];if(r<0||!s)return e;const n=[...e],c=n.indexOf(i),d=n.indexOf(s);return[n[c],n[d]]=[n[d],n[c]],n}(o,Ht(t.groupedEntities,this._config),i,a);r!==o&&this._updateStacksOrder(e,r)},onDragStart:this._handleStackDragStart,onDragEnd:this._handleStackDragEnd,onDragOver:this._handleStackDragOver,onDragLeave:this._handleStackDragLeave,onDrop:this._handleStackDrop})}_renderAreasListSection(){const e=this._getSortedAreas(),t=this._getNormalizedAreasDisplay(),i=t?.hidden||[],a=t?.order||[],o=t?.nav_items||[];return je.qy`
      <div class="section">
        <div class="section-title">${(0,ze.kg)("editor.section_area_views")}</div>
        <div class="description" style="margin-left: 0;">${(0,ze.kg)("editor.area_view_override_intro")}</div>
        <div class="description" style="margin-left: 0;">${(0,ze.kg)("editor.area_entity_settings_desc")}</div>
        <div class="area-list" id="area-list">${this._renderAreaItems(e,i,a,o)}</div>
      </div>
    `}_renderAreasSection(){return function(e,t){const i=e.config.area_display_type??"compact";return je.qy`
    <div class="section">
      <div class="section-title">${(0,ze.kg)("editor.section_areas")}</div>

      <div class="option-groups">
        <div class="option-group">
          <div class="option-group-title">
            <ha-icon icon="mdi:view-dashboard-outline"></ha-icon>
            <span>${(0,ze.kg)("editor.area_overview_options")}</span>
          </div>
          ${kt(e,"group_by_floors")}

          <div class="form-row">
            <label for="area-display-type">${(0,ze.kg)("editor.area_display_type")}</label>
            <select
              id="area-display-type"
              .value=${i}
              @change=${e=>t(e.target.value)}
            >
              <option value="compact">${(0,ze.kg)("editor.area_display_type_compact")}</option>
              <option value="picture">${(0,ze.kg)("editor.area_display_type_picture")}</option>
            </select>
          </div>
          <div class="description">${(0,ze.kg)("editor.area_display_type_desc")}</div>

          ${kt(e,"show_switches_on_areas")} ${kt(e,"show_alerts_on_areas")}
        </div>

        <div class="option-group">
          <div class="option-group-title">
            <ha-icon icon="mdi:door-open"></ha-icon>
            <span>${(0,ze.kg)("editor.room_view_options")}</span>
          </div>
          ${kt(e,"show_locks_in_rooms")} ${kt(e,"show_automations_in_rooms")}
          ${kt(e,"show_scripts_in_rooms")} ${kt(e,"show_vacuums_section_in_rooms")}
          ${kt(e,"show_switches_section_in_rooms")} ${kt(e,"show_helpers_section_in_rooms")}
          ${kt(e,"show_sensors_section_in_rooms")} ${kt(e,"show_cover_controls_in_rooms")}
          ${kt(e,"show_cameras_in_rooms",{defaultOn:!0})} ${kt(e,"camera_live_toggle")}
          ${kt(e,"camera_pause_when_hidden")} ${kt(e,"show_energy_in_rooms",{defaultOn:!0})}
          ${kt(e,"show_ups_in_rooms",{defaultOn:!0})}
          ${kt(e,"hide_grouped_climate_members",{defaultOn:!0})}
          ${kt(e,"show_window_contacts_in_rooms")} ${kt(e,"show_door_contacts_in_rooms")}
        </div>

        <div class="option-group">
          <div class="option-group-title">
            <ha-icon icon="mdi:sort-alphabetical-ascending"></ha-icon>
            <span>${(0,ze.kg)("editor.area_management_options")}</span>
          </div>
          ${kt(e,"use_default_area_sort")}
        </div>
      </div>
    </div>
  `}(this._optionPanelHost,e=>this._globalAreaDisplayTypeChanged(e))}_renderViewsSection(){const e=!0===this._config.show_summary_views,t=!0===this._config.show_room_views,i=!0===this._config.show_cctv_view,a=!0===this._config.cctv_show_activity,o=this._config.show_camera_events??a,r=!0===this._config.show_cameras_in_security,s=!1!==this._config.show_maintenance_view,n=!1!==this._config.show_maintenance_activity,c=!1!==this._config.show_video_tips,d=!0===this._config.show_energy_view;return je.qy`${function(e){const t=(t,i,a,o=!1)=>je.qy`
    ${e.checkbox(t,(0,ze.kg)(`editor.${i}`),a,t=>e.change(i,t,o))}
    <div class="description">${(0,ze.kg)(`editor.${i}_desc`)}</div>
  `;return je.qy`<div class="section">
    <div class="section-title">${(0,ze.kg)("editor.section_views")}</div>
    ${t("show-summary-views","show_summary_views",e.showSummaryViews)}
    ${t("show-room-views","show_room_views",e.showRoomViews)}
    ${t("show-energy-view","show_energy_view",e.showEnergyView)}
    ${t("show-cctv-view","show_cctv_view",e.showCctvView)}
    ${t("cctv-show-activity","cctv_show_activity",e.cctvShowActivity)}
    ${t("show-camera-events","show_camera_events",e.showCameraEvents)}
    ${t("show-cameras-in-security","show_cameras_in_security",e.showCamerasInSecurity)}
    ${t("show-maintenance-view","show_maintenance_view",e.showMaintenanceView)}
    ${t("show-maintenance-activity","show_maintenance_activity",e.showMaintenanceActivity,!0)}
    ${t("show-video-tips","show_video_tips",e.showVideoTips,!0)}
  </div>`}({showSummaryViews:e,showRoomViews:t,showCctvView:i,cctvShowActivity:a,showCameraEvents:o,showCamerasInSecurity:r,showMaintenanceView:s,showMaintenanceActivity:n,showVideoTips:c,showEnergyView:d,checkbox:(e,t,i,a)=>this._renderCheckbox(e,t,i,a),change:(e,t,i=!1)=>{"show_camera_events"===e?this._setCctvOptions({show_camera_events:t}):"cctv_show_activity"===e&&void 0===this._config.show_camera_events?this._setCctvOptions({cctv_show_activity:t,show_camera_events:!1}):this._toggleChanged(e,t,i)}})}${l=this,l._hass?je.qy`<div class="section">
    <div class="section-title">${(0,ze.kg)("editor.room_visibility")}</div>
    <div class="description" style="margin-left: 0;">${(0,ze.kg)("editor.room_visibility_desc")}</div>
    ${l._getSortedAreas().map(e=>{const t=l._config.room_visibility?.[e.area_id];return je.qy`<div class="option-group">
        <div class="option-group-title">${e.name}</div>
        <div class="form-row">
          <ha-textfield
            label=${(0,ze.kg)("editor.room_visibility_entity")}
            .value=${t?.entity||""}
            @change=${t=>Yt(l,e.area_id,"entity",t.target.value)}
          ></ha-textfield>
          <ha-textfield
            label=${(0,ze.kg)("editor.room_visibility_state")}
            .value=${t?.state||""}
            @change=${t=>Yt(l,e.area_id,"state",t.target.value)}
          ></ha-textfield>
        </div>
      </div>`})}
  </div>`:je.qy``}${function(e){if(!e._hass)return je.qy``;const t=Object.entries(e._hass.states).filter(([e,t])=>e.startsWith("person.")&&"string"==typeof t.attributes.user_id).map(([e,t])=>({id:t.attributes.user_id,name:String(t.attributes.friendly_name||e)})).sort((e,t)=>e.name.localeCompare(t.name));if(0===t.length)return je.qy``;const i=[["home",(0,ze.kg)("views.overview")],...(0,Qe.v4)(e._config,"lights")?[["lights",(0,ze.kg)("views.lights")]]:[],...(0,Qe.v4)(e._config,"covers")?[["covers",(0,ze.kg)("views.covers")]]:[],...(0,Qe.v4)(e._config,"security")?[["security",(0,ze.kg)("views.security")]]:[],...(0,Qe.v4)(e._config,"batteries")?[["batteries",(0,ze.kg)("views.batteries")]]:[],...(0,Qe.v4)(e._config,"climate")?[["climate",(0,ze.kg)("views.climate")]]:[],...!0===e._config.show_energy_view?[["energy",(0,ze.kg)("views.energy")]]:[],...!0===e._config.show_cctv_view?[["cctv",(0,ze.kg)("views.cctv")]]:[],...!0===e._config.show_maintenance_view?[["maintenance",(0,ze.kg)("views.maintenance")]]:[],...Object.values(e._hass.areas).map(e=>[e.area_id,e.name]),...(e._config.custom_views||[]).filter(e=>(e.parsed_config||e.ref_dashboard&&e.ref_view)&&e.path&&e.title).map(e=>[e.path,e.title])],a=Lt.OH.filter(t=>!(0,Lt.PM)(t.key,e._config)).map(e=>[e.key,(0,ze.kg)(e.labelKey)]);for(const t of e._config.custom_sections||[])t.id&&a.push([t.id,t.title||t.id]);const o=(i,a)=>a.map(([a,o])=>{const r="view"===i?e._config.view_visible_users:e._config.section_visible_users,s=Object.prototype.hasOwnProperty.call(r||{},a)?r?.[a]||[]:t.map(e=>e.id);return je.qy`<div class="option-group">
        <div class="option-group-title">${o}</div>
        ${t.map(o=>e._renderCheckbox(`${i}-${a}-${o.id}`,o.name,s.includes(o.id),r=>function(e,t,i,a,o,r){const s={...("view"===t?e._config.view_visible_users:e._config.section_visible_users)||{}},n=new Set(Object.prototype.hasOwnProperty.call(s,i)?s[i]:o);r?n.add(a):n.delete(a),o.every(e=>n.has(e))&&[...n].every(e=>o.includes(e))?delete s[i]:s[i]=[...n];const c={...e._config};"view"===t?Object.keys(s).length?c.view_visible_users=s:delete c.view_visible_users:Object.keys(s).length?c.section_visible_users=s:delete c.section_visible_users,e._fireConfigChanged(c)}(e,i,a,o.id,t.map(e=>e.id),r)))}
      </div>`});return je.qy`<div class="section">
    <div class="section-title">${(0,ze.kg)("editor.user_visibility")}</div>
    <div class="description" style="margin-left: 0;">${(0,ze.kg)("editor.user_visibility_warning")}</div>
    <div class="description" style="margin-left: 0; color: var(--warning-color, #ffa600);">
      ${(0,ze.kg)("editor.user_visibility_no_person_warning")}
    </div>
    <div class="option-group-title">${(0,ze.kg)("editor.user_visibility_views")}</div>
    ${o("view",i)}
    <div class="option-group-title">${(0,ze.kg)("editor.user_visibility_sections")}</div>
    ${o("section",a)}
  </div>`}(this)}`;var l}_renderCustomContentSection(){return Ct(this._customContentHost)}_renderCheckbox(e,t,i,a,o=!1){return je.qy`
      <div class="form-row">
        <input
          type="checkbox"
          id=${e}
          ?checked=${i}
          ?disabled=${o}
          @change=${e=>a(e.target.checked)}
        />
        <label for=${e} class=${o?"disabled-label":""}>${t}</label>
      </div>
    `}_renderAreaItems(e,t,i,a){return function(e,t,i,a,o){if(0===t.length)return je.qy`<div class="empty-state">${(0,ze.kg)("editor.no_areas")}</div>`;const r=new Map(a.map((e,t)=>[e,t])),s=new Map(t.map((e,t)=>[e.area_id,t]));return[...t].sort((e,t)=>{const i=r.get(e.area_id),a=r.get(t.area_id);return(void 0!==i?i:9999+(s.get(e.area_id)??0))-(void 0!==a?a:9999+(s.get(t.area_id)??0))}).map(t=>{const a=i.includes(t.area_id),r=e._expandedAreas.has(t.area_id),s=e._areaEntitiesCache.get(t.area_id),n=o.includes(t.area_id);return je.qy`
      <div
        class="area-item"
        data-area-id=${t.area_id}
        draggable="true"
        @dragstart=${e._handleDragStart}
        @dragend=${e._handleDragEnd}
        @dragover=${e._handleDragOver}
        @dragleave=${e._handleDragLeave}
        @drop=${e._handleDrop}
      >
        <div class="area-header">
          <span class="drag-handle" draggable="true">&#x2630;</span>
          <input
            type="checkbox"
            class="area-checkbox"
            data-area-id=${t.area_id}
            ?checked=${!a}
            @change=${i=>e._areaVisibilityChanged(t.area_id,i.target.checked)}
          />
          <span class="area-name">${t.name}</span>
          ${e._config.areas_options?.[t.area_id]?.view_override?.yaml?je.qy`<button
                  type="button"
                  title=${(0,ze.kg)("editor.override_active_help")}
                  @click=${()=>{e._openDiagnosticLocation(`areas_options.${t.area_id}.view_override`)}}
                >
                  ${(0,ze.kg)("editor.override_active")}
                </button>`:je.s6}
          ${t.icon?je.qy`<ha-icon class="area-icon" icon=${t.icon}></ha-icon>`:je.s6}
          <button
            class="nav-pin-button ${n?"pinned":""}"
            title="${(0,ze.kg)("editor.area_pin_nav")}"
            ?disabled=${a}
            @click=${i=>{i.stopPropagation(),e._areaNavPinChanged(t.area_id,!n)}}
          >
            <ha-icon icon="${n?"mdi:pin":"mdi:pin-outline"}"></ha-icon>
          </button>
          <button
            class="expand-button ${r?"expanded":""}"
            data-area-id=${t.area_id}
            @click=${i=>e._toggleAreaExpand(i,t.area_id)}
          >
            <span class="expand-icon">&#x25B6;</span>
          </button>
        </div>
        ${r?je.qy`
                <div class="area-content" data-area-id=${t.area_id}>
                  ${e._renderAreaDisplayTypeOverride(t)} ${e._renderAreaViewOverride(t.area_id)}
                  ${s?e._renderAreaEntities(t.area_id,s):je.qy`<div class="loading-placeholder">${(0,ze.kg)("editor.loading_entities")}</div>`}
                </div>
              `:je.s6}
      </div>
    `})}(this._roomOptionsHost,e,t,i,a)}_globalAreaDisplayTypeChanged(e){const t=function(e,t){const i={...e};return"compact"===t?delete i.area_display_type:i.area_display_type=t,i}(this._config,e);this._config=t,this._fireConfigChanged(t)}_renderAreaDisplayTypeOverride(e){return function(e,t){const i=e._config.areas_options?.[t.area_id]?.display_type??"";return je.qy`
    <div class="form-row">
      <label for="area-display-type-${t.area_id}">${(0,ze.kg)("editor.area_display_type_override")}</label>
      <select
        id="area-display-type-${t.area_id}"
        .value=${i}
        @change=${i=>e._areaDisplayTypeOverrideChanged(t.area_id,i.target.value)}
      >
        <option value="">${(0,ze.kg)("editor.area_display_type_inherit")}</option>
        <option value="compact">${(0,ze.kg)("editor.area_display_type_compact")}</option>
        <option value="picture">${(0,ze.kg)("editor.area_display_type_picture")}</option>
      </select>
    </div>
    ${t.picture?je.s6:je.qy`<div class="description">${(0,ze.kg)("editor.area_display_type_no_picture")}</div>`}
  `}(this._roomOptionsHost,e)}_areaDisplayTypeOverrideChanged(e,t){const i=function(e,t,i){const a={...Reflect.get(e.areas_options??{},t)??{}};i?a.display_type=i:delete a.display_type;const o={...e.areas_options};Reflect.set(o,t,a),0===Object.keys(a).length&&Reflect.deleteProperty(o,t);const r={...e};return 0===Object.keys(o).length?delete r.areas_options:r.areas_options=o,r}(this._config,e,t||void 0);this._config=i,this._fireConfigChanged(i)}_renderAreaViewOverride(e){return function(e,t){const i=e._config.areas_options?.[t]?.view_override,a=i?._yaml_error?je.qy`<span style="color: var(--error-color);">&#x274C; ${i._yaml_error}</span>`:i?.parsed_config?je.qy`<span style="color: var(--success-color, green);">&#x2705; ${(0,ze.kg)("editor.yaml_valid")}</span>`:je.s6;return je.qy`
    <div class="custom-item" style="margin-bottom: 0;">
      <div class="custom-item-header">
        <strong>${(0,ze.kg)("editor.area_view_override_title")}</strong>
        ${i?.yaml?je.qy`
                <button
                  class="btn-remove"
                  title=${(0,ze.kg)("editor.area_view_override_remove")}
                  @click=${()=>e._updateAreaViewOverride(t,"")}
                >
                  &#x2715;
                </button>
              `:je.s6}
      </div>
      <div class="description" style="margin: 0 0 10px 0;">${(0,ze.kg)("editor.area_view_override_help")}</div>
      <textarea
        rows="12"
        placeholder="type: sections&#10;sections:&#10;  - type: grid&#10;    cards: []"
        .value=${i?.yaml||""}
        style="width: 100%;"
        @change=${i=>e._updateAreaViewOverride(t,i.target.value)}
      >
      </textarea>
      <div class="custom-item-validation">${a}</div>
    </div>
  `}(this._roomOptionsHost,e)}_updateAreaViewOverride(e,t){return function(e,t,i){const a={...e._config.areas_options?.[t]||{}};if(i.trim()){const e=Fe(i,(0,ze.kg)("editor.area_view_override_object_error")),t=e.parsed_config,o=t&&!Array.isArray(t);a.view_override={yaml:i,parsed_config:o?t:void 0,_yaml_error:o?e._yaml_error:e._yaml_error||(0,ze.kg)("editor.area_view_override_object_error")}}else delete a.view_override;const o={...e._config.areas_options};0===Object.keys(a).length?delete o[t]:o[t]=a;const r={...e._config};0===Object.keys(o).length?delete r.areas_options:r.areas_options=o,e._config=r,e._fireConfigChanged(r)}(this._roomOptionsHost,e,t)}_renderAreaEntities(e,t){return function(e,t,i){const{groupedEntities:a,hiddenEntities:o,badgeCandidates:r,additionalBadges:s,availableEntities:n,defaultShowNames:c,namesVisible:d,namesHidden:l}=i,_=e._hass,h=[{key:"ups",label:(0,ze.kg)("stacks.ups"),icon:"mdi:power-plug-battery"},{key:"lights",label:(0,ze.kg)("editor.domain_lights"),icon:"mdi:lightbulb"},{key:"climate",label:(0,ze.kg)("editor.domain_climate"),icon:"mdi:thermostat"},{key:"covers",label:(0,ze.kg)("editor.domain_covers"),icon:"mdi:window-shutter"},{key:"covers_curtain",label:(0,ze.kg)("editor.domain_covers_curtain"),icon:"mdi:curtains"},{key:"covers_window",label:(0,ze.kg)("editor.domain_covers_window"),icon:"mdi:window-open-variant"},{key:"media_player",label:(0,ze.kg)("editor.domain_media_player"),icon:"mdi:speaker"},{key:"scenes",label:(0,ze.kg)("editor.domain_scenes"),icon:"mdi:palette"},{key:"vacuum",label:(0,ze.kg)("editor.domain_vacuum"),icon:"mdi:robot-vacuum"},{key:"fan",label:(0,ze.kg)("editor.domain_fan"),icon:"mdi:fan"},{key:"switches",label:(0,ze.kg)("editor.domain_switches"),icon:"mdi:light-switch"},{key:"locks",label:(0,ze.kg)("editor.domain_locks"),icon:"mdi:lock"},{key:"energy",label:(0,ze.kg)("stacks.energy"),icon:"mdi:lightning-bolt"},...!0===e._config.show_helpers_section_in_rooms?[{key:"helpers",label:(0,ze.kg)("stacks.helpers"),icon:"mdi:tune-variant"}]:[],...!0===e._config.show_sensors_section_in_rooms?[{key:"binary_sensors",label:(0,ze.kg)("stacks.sensors"),icon:"mdi:motion-sensor"}]:[]],u=h.some(e=>(a[e.key]?.length??0)>0),p=(r?.length??0)>0||(s?.length??0)>0,m=[],g=new Set,y=e=>{if(!e||g.has(e))return;g.add(e);const t=_.states[e],i=t?.attributes.friendly_name||e.split(".")[1]?.replace(/_/g," ")||e;m.push({entity_id:e,name:i})};for(const e of h)for(const t of a[e.key]||[])y(t);for(const e of r||[])y(e);for(const e of s||[])y(e);for(const e of n||[])y(e.entity_id);m.sort((e,t)=>e.name.localeCompare(t.name));const f=e._renderAreaCustomCardsSection(t,m);if(!u&&!p)return je.qy`
      <div class="empty-state">${(0,ze.kg)("editor.no_entities_in_area")}</div>
      ${e._renderStackOrderPanel(t,i)} ${f}
    `;const v=e._expandedGroups.get(t)||new Set;return je.qy`
    <div class="entity-groups">
      ${h.map(i=>{const r=a[i.key];if(!r||0===r.length)return je.s6;const s=o[i.key]||[],n=r.every(e=>s.includes(e)),c=r.some(e=>s.includes(e))&&!n,d=v.has(i.key);return je.qy`
          <div class="entity-group" data-group=${i.key}>
            <div class="entity-group-header" @click=${()=>e._toggleGroupExpand(t,i.key)}>
              <input
                type="checkbox"
                class="group-checkbox"
                data-area-id=${t}
                data-group=${i.key}
                ?checked=${!n}
                .indeterminate=${c}
                @click=${e=>e.stopPropagation()}
                @change=${a=>{a.stopPropagation();const o=a.target.checked;e._groupVisibilityChanged(t,i.key,o,r)}}
              />
              <ha-icon icon=${i.icon}></ha-icon>
              <span class="group-name">${i.label}</span>
              <span class="entity-count">(${r.length})</span>
              <button
                class="expand-button-small ${d?"expanded":""}"
                @click=${a=>{a.stopPropagation(),e._toggleGroupExpand(t,i.key)}}
              >
                <span class="expand-icon-small">&#x25B6;</span>
              </button>
            </div>
            ${d?je.qy`
                    <div class="entity-list" data-area-id=${t} data-group=${i.key}>
                      ${r.map(a=>{const o=_.states[a],r=o?.attributes.friendly_name||a.split(".")[1].replace(/_/g," "),n=s.includes(a);return je.qy`
                          <div class="entity-item">
                            <input
                              type="checkbox"
                              class="entity-checkbox"
                              ?checked=${!n}
                              @change=${o=>e._entityVisibilityChanged(t,i.key,a,o.target.checked)}
                            />
                            <span class="entity-name">${r}</span>
                            <span class="entity-id">${a}</span>
                          </div>
                        `})}
                    </div>
                  `:je.s6}
          </div>
        `})}
      ${p?e._renderBadgeGroup(t,r,s,n,o,c,d,l,v):je.s6}
      ${e._renderStackOrderPanel(t,i)}
    </div>
    ${f}
  `}(this._roomOptionsHost,e,t)}_renderAreaCustomCardItem(e,t,i,a){return function(e,t,i,a,o){const r=i.mode||"yaml",s=i.position||"bottom",n=i._yaml_error?je.qy`<span style="color: var(--error-color);">&#x274C; ${i._yaml_error}</span>`:i.yaml?je.qy`<span style="color: var(--success-color, green);">&#x2705; ${(0,ze.kg)("editor.yaml_valid")}</span>`:je.s6;return je.qy`
    <div class="custom-item" data-index=${a}>
      <div class="custom-item-header">
        <strong>${e._getCustomCardEditorLabel(i,(0,ze.kg)("editor.area_custom_card_new"))}</strong>
        <button class="btn-remove" @click=${()=>e._removeAreaCustomCard(t,a)}>&#x2715;</button>
      </div>
      <div class="custom-item-fields">
        <label>${(0,ze.kg)("editor.card_editor_title_label")}</label>
        <input
          type="text"
          .value=${i.editor_title||""}
          placeholder=${(0,ze.kg)("editor.card_editor_title_placeholder")}
          @change=${i=>e._updateAreaCustomCardField(t,a,"editor_title",i.target.value)}
        />
        <div class="description" style="margin: 0 0 4px 0;">${(0,ze.kg)("editor.card_editor_title_help")}</div>
        <label>${(0,ze.kg)("editor.card_dashboard_title_label")}</label>
        <input
          type="text"
          .value=${i.title||""}
          placeholder=${(0,ze.kg)("editor.card_title_placeholder")}
          @change=${i=>e._updateAreaCustomCardField(t,a,"title",i.target.value)}
        />
        <div class="custom-card-target">
          <label>${(0,ze.kg)("editor.area_custom_card_position")}:</label>
          <select
            @change=${i=>e._updateAreaCustomCardField(t,a,"position",i.target.value)}
          >
            <option value="top" ?selected=${"top"===s}>
              ${(0,ze.kg)("editor.area_custom_card_position_top")}
            </option>
            <option value="bottom" ?selected=${"bottom"===s}>
              ${(0,ze.kg)("editor.area_custom_card_position_bottom")}
            </option>
          </select>
        </div>
        <div class="custom-card-target">
          <label>${(0,ze.kg)("editor.area_custom_card_mode")}:</label>
          <select
            @change=${i=>e._updateAreaCustomCardField(t,a,"mode",i.target.value)}
          >
            <option value="yaml" ?selected=${"yaml"===r}>${(0,ze.kg)("editor.area_custom_card_mode_yaml")}</option>
            <option value="tile" ?selected=${"tile"===r}>${(0,ze.kg)("editor.area_custom_card_mode_tile")}</option>
            <option value="section" ?selected=${"section"===r}>
              ${(0,ze.kg)("editor.area_custom_card_mode_section")}
            </option>
          </select>
        </div>
        ${"tile"===r?je.qy`
                <div class="custom-card-target">
                  <label>${(0,ze.kg)("editor.area_custom_card_entity")}:</label>
                  <select
                    @change=${i=>e._updateAreaCustomCardField(t,a,"entity",i.target.value)}
                  >
                    <option value="">${(0,ze.kg)("editor.area_custom_card_entity_select")}</option>
                    ${o.map(e=>je.qy`
                        <option value=${e.entity_id} ?selected=${i.entity===e.entity_id}>
                          ${e.name} (${e.entity_id})
                        </option>
                      `)}
                  </select>
                </div>
              `:je.qy`
                <textarea
                  rows="6"
                  placeholder=${(0,ze.kg)("editor.yaml_placeholder")}
                  .value=${i.yaml||""}
                  style="width: 100%;"
                  @change=${i=>e._updateAreaCustomCardYaml(t,a,i.target.value)}
                ></textarea>
                <button
                  class="btn-primary"
                  style="margin-top: 6px;"
                  @click=${()=>e._openCardEditorForAreaCustomCard(t,a)}
                >
                  ${(0,ze.kg)("editor.edit_card_with_ha_editor")}
                </button>
                <div class="custom-item-validation">${n}</div>
              `}
      </div>
    </div>
  `}(this._roomOptionsHost,e,t,i,a)}_renderAreaCustomCardsSection(e,t){return function(e,t,i){const a=e._getAreaCustomCards(t);return je.qy`
    <div class="area-custom-cards">
      <div class="area-custom-cards-header">
        <ha-icon icon="mdi:card-plus-outline"></ha-icon>
        <span class="group-name">${(0,ze.kg)("editor.area_custom_cards_title")}</span>
      </div>
      <div class="area-custom-cards-help">${(0,ze.kg)("editor.area_custom_cards_help")}</div>
      ${0===a.length?je.s6:a.map((a,o)=>e._renderAreaCustomCardItem(t,a,o,i))}
      <div class="area-custom-card-actions">
        <button class="btn-primary" @click=${()=>e._addAreaCustomCard(t)}>
          ${(0,ze.kg)("editor.area_custom_card_add_yaml")}
        </button>
        <button class="btn-primary" @click=${()=>e._openCardPickerForAreaCustomCard(t)}>
          ${(0,ze.kg)("editor.area_custom_card_add_picker")}
        </button>
      </div>
    </div>
  `}(this._roomOptionsHost,e,t)}_renderBadgeGroup(e,t,i,a,o,r,s,n,c){return function(e,t,i,a,o,r,s,n,c,d){const l=e._hass,_=i.length+a.length;if(0===_)return je.qy``;const h=r.badges||[],u=i.length>0&&i.every(e=>h.includes(e)),p=i.some(e=>h.includes(e))&&!u,m=new Set(n||[]),g=new Set(c||[]),y=e=>(0,Ne.LN)(e,s.has(e),m,g),f=d.has("badges");return je.qy`
    <div class="entity-group" data-group="badges">
      <div class="entity-group-header" @click=${()=>e._toggleGroupExpand(t,"badges")}>
        <input
          type="checkbox"
          class="group-checkbox"
          data-area-id=${t}
          data-group="badges"
          ?checked=${!u}
          .indeterminate=${p}
          @click=${e=>e.stopPropagation()}
          @change=${a=>{a.stopPropagation();const o=a.target.checked;e._groupVisibilityChanged(t,"badges",o,i)}}
        />
        <ha-icon icon="mdi:checkbox-multiple-blank-circle"></ha-icon>
        <span class="group-name">${(0,ze.kg)("editor.domain_badges")}</span>
        <span class="entity-count">(${_})</span>
        <button
          class="expand-button-small ${f?"expanded":""}"
          @click=${i=>{i.stopPropagation(),e._toggleGroupExpand(t,"badges")}}
        >
          <span class="expand-icon-small">&#x25B6;</span>
        </button>
      </div>
      ${f?je.qy`
              <div class="entity-list" data-area-id=${t} data-group="badges">
                ${i.map(i=>{const a=l.states[i],o=a?.attributes.friendly_name||i.split(".")[1].replace(/_/g," "),r=h.includes(i),s=y(i);return je.qy`
                    <div class="entity-item">
                      <input
                        type="checkbox"
                        class="entity-checkbox"
                        ?checked=${!r}
                        @change=${a=>e._entityVisibilityChanged(t,"badges",i,a.target.checked)}
                      />
                      <span class="entity-name">${o}</span>
                      <input
                        type="checkbox"
                        class="badge-name-checkbox"
                        ?checked=${s}
                        title=${(0,ze.kg)("editor.badges_show_name")}
                        @change=${a=>e._badgeShowNameChanged(t,i,a.target.checked)}
                      />
                      <span class="badge-name-label">${(0,ze.kg)("editor.badges_name_short")}</span>
                      <span class="entity-id">${i}</span>
                    </div>
                  `})}
                ${a.length>0?je.qy`
                        <div class="badge-separator">${(0,ze.kg)("editor.badges_additional")}</div>
                        ${a.map(i=>{const a=l.states[i],o=a?.attributes.friendly_name||i.split(".")[1].replace(/_/g," "),r=y(i);return je.qy`
                            <div class="entity-item badge-additional-item">
                              <span class="entity-name">${o}</span>
                              <input
                                type="checkbox"
                                class="badge-name-checkbox"
                                ?checked=${r}
                                title=${(0,ze.kg)("editor.badges_show_name")}
                                @change=${a=>e._badgeShowNameChanged(t,i,a.target.checked)}
                              />
                              <span class="badge-name-label">${(0,ze.kg)("editor.badges_name_short")}</span>
                              <span class="entity-id">${i}</span>
                              <button
                                class="badge-remove-btn"
                                title=${(0,ze.kg)("editor.badges_remove")}
                                @click=${()=>e._badgeAdditionalChanged(t,i,!1)}
                              >
                                &#x2715;
                              </button>
                            </div>
                          `})}
                      `:je.s6}
                ${o.length>0?je.qy`
                        <div class="badge-add-section">
                          <select class="badge-entity-picker" data-area-id=${t}>
                            <option value="">${(0,ze.kg)("editor.badges_select_entity")}</option>
                            ${o.map(e=>je.qy` <option value=${e.entity_id}>${e.name} (${e.entity_id})</option> `)}
                          </select>
                          <button class="badge-add-button" @click=${i=>e._addBadgeFromPicker(i,t)}>
                            ${(0,ze.kg)("editor.badges_add")}
                          </button>
                        </div>
                      `:je.s6}
              </div>
            `:je.s6}
    </div>
  `}(this._roomOptionsHost,e,t,i,a,o,r,s,n,c)}async _loadAreaEntities(e){if(!this._hass)return;const t=(0,tt.NS)(e,this._hass,this._config),i=(0,tt.vZ)(t,this._hass,(0,tt.H2)(t,this._hass),{includeCameras:!1}),a=Xt(e,this._config),o=ei(e,this._config),r=(0,tt.Rl)(t,this._hass,this._config.battery_critical_threshold),s=Zt(e,this._config),n=(0,tt.OT)(t,this._hass,[...r,...s]),c=Jt(r,this._hass),{namesVisible:d,namesHidden:l}=Qt(e,this._config);this._areaEntitiesCache.set(e,{groupedEntities:i,hiddenEntities:a,entityOrders:o,badgeCandidates:r,additionalBadges:s,availableEntities:n,defaultShowNames:c,namesVisible:d,namesHidden:l}),this.requestUpdate()}_refreshAreaCache(e){if(!this._hass||!this._areaEntitiesCache.has(e))return;const t=this._areaEntitiesCache.get(e).groupedEntities,i=Xt(e,this._config),a=ei(e,this._config),o=(0,tt.NS)(e,this._hass,this._config),r=(0,tt.Rl)(o,this._hass,this._config.battery_critical_threshold),s=Zt(e,this._config),n=(0,tt.OT)(o,this._hass,[...r,...s]),c=Jt(r,this._hass),{namesVisible:d,namesHidden:l}=Qt(e,this._config);this._areaEntitiesCache.set(e,{groupedEntities:t,hiddenEntities:i,entityOrders:a,badgeCandidates:r,additionalBadges:s,availableEntities:n,defaultShowNames:c,namesVisible:d,namesHidden:l})}_toggleChanged(e,t,i){if(!this._hass)return;const a={...this._config,[e]:t};t===Ge(e,this._config,i)&&delete a[e],this._config=a,this._fireConfigChanged(a)}_setCctvOptions(e){if(!this._hass)return;const t={...this._config,...e};this._config=t,this._fireConfigChanged(t)}_simpleOptionChanged(e,t,i){const a={...this._config};t===Ge(e,this._config,i)?delete a[e]:a[e]=t,this._config=a,this._fireConfigChanged(this._config)}_addCustomView(){const e=[...this._config.custom_views||[]];e.push({title:(0,ze.kg)("editor.new_view"),path:`custom-view-${e.length+1}`,icon:"mdi:card-text-outline",yaml:"",parsed_config:void 0});const t={...this._config,custom_views:e};this._config=t,this._fireConfigChanged(t)}async _loadRefDashboards(){if(this._refDashboardsLoading||!this._hass)return;this._refDashboardsLoading=!0;const e=[];try{const t=await this._hass.callWS({type:"lovelace/dashboards/list"}),i=[{url_path:"lovelace",title:(0,ze.kg)("editor.ref_default_dashboard")},...t.filter(e=>e.url_path&&"lovelace"!==e.url_path)];await Promise.all(i.map(async t=>{try{const i=await this._hass.callWS({type:"lovelace/config",url_path:"lovelace"===t.url_path?null:t.url_path});if(i.strategy)return;const a=(i.views||[]).map((e,t)=>({path:"string"==typeof e.path?e.path:void 0,title:"string"==typeof e.title?e.title:void 0,icon:"string"==typeof e.icon?e.icon:void 0,index:t}));a.length&&e.push({...t,views:a})}catch{}}))}catch{}e.sort((e,t)=>e.title.localeCompare(t.title)),this._refDashboards=e,this._refDashboardsLoading=!1,this.requestUpdate()}_refDashboardChanged(e,t){const i=[...this._config.custom_views||[]];if(!i[e])return;i[e]={...i[e],ref_dashboard:t,ref_view:""};const a={...this._config,custom_views:i};this._config=a,this._fireConfigChanged(a)}_refViewChanged(e,t){const i=[...this._config.custom_views||[]],a=i[e];if(!a)return;const o=this._refDashboards?.find(e=>e.url_path===a.ref_dashboard),r=o?.views.find(e=>(e.path??String(e.index))===t),s={...a,ref_view:t};s.title||(s.title=r?.title||(0,ze.kg)("editor.new_view")),s.icon||(s.icon=r?.icon||"mdi:link-variant"),s.path||(s.path=this._uniqueCustomViewPath(r?.path||`custom-view-${e+1}`,e)),i[e]=s;const n={...this._config,custom_views:i};this._config=n,this._fireConfigChanged(n)}_uniqueCustomViewPath(e,t){const i=new Set(["home","lights","covers","security","batteries","climate","maintenance","cctv",...Object.keys(this._hass?.areas||{}),...(this._config.custom_views||[]).filter((e,i)=>i!==t).map(e=>e.path).filter(e=>!!e)]);if(!i.has(e))return e;let a=1,o=`${e}-ref`;for(;i.has(o);)o=`${e}-ref${++a}`;return o}_removeCustomView(e){const t=[...this._config.custom_views||[]];t.splice(e,1);const i={...this._config};0===t.length?delete i.custom_views:i.custom_views=t,this._config=i,this._fireConfigChanged(i)}_updateCustomViewField(e,t,i){const a=[...this._config.custom_views||[]];if(!a[e])return;a[e]={...a[e],[t]:i};const o={...this._config,custom_views:a};this._config=o,this._fireConfigChanged(o)}_updateCustomViewAfterView(e,t){const i=[...this._config.custom_views||[]],a=i[e];if(!a)return;const o={...a};t?o.after_view=t:delete o.after_view,i[e]=o;const r={...this._config,custom_views:i};this._config=r,this._fireConfigChanged(r)}_updateCustomViewYaml(e,t){const i=[...this._config.custom_views||[]];if(!i[e])return;const a={...i[e],yaml:t};delete a._yaml_error;const o=Fe(t,"YAML muss ein Objekt ergeben");a.parsed_config=o.parsed_config,a._yaml_error=o._yaml_error,i[e]=a;const r={...this._config,custom_views:i};this._config=r,this._fireConfigChanged(r)}_customCardsHeadingChanged(e){const t=e.target.value.trim(),i={...this._config};t?i.custom_cards_heading=t:delete i.custom_cards_heading,this._config=i,this._fireConfigChanged(i)}_customCardsIconChanged(e){const t=e.target.value.trim(),i={...this._config};t?i.custom_cards_icon=t:delete i.custom_cards_icon,this._config=i,this._fireConfigChanged(i)}_removeCustomCard(e){const t=[...this._config.custom_cards||[]];t.splice(e,1);const i={...this._config};0===t.length?delete i.custom_cards:i.custom_cards=t,this._config=i,this._fireConfigChanged(i)}_updateCustomCardField(e,t,i){const a=[...this._config.custom_cards||[]];if(!a[e])return;a[e]={...a[e],[t]:i};const o={...this._config,custom_cards:a};this._config=o,this._fireConfigChanged(o)}_updateCustomCardYaml(e,t){const i=[...this._config.custom_cards||[]];if(!i[e])return;const a={...i[e],yaml:t};delete a._yaml_error;const o=Fe(t,"YAML muss ein Objekt oder Array ergeben");a.parsed_config=o.parsed_config,a._yaml_error=o._yaml_error,i[e]=a;const r={...this._config,custom_cards:i};if(a._yaml_error)return this._config=r,void this.requestUpdate();this._config=r,this._fireConfigChanged(r)}_addCustomSection(){const e=[...this._config.custom_sections||[]];e.push({title:"",icon:"",cards:[]});const t={...this._config,custom_sections:e};this._config=t,this._fireConfigChanged(t)}_removeCustomSection(e){const t=[...this._config.custom_sections||[]];t.splice(e,1);const i={...this._config};0===t.length?delete i.custom_sections:i.custom_sections=t,this._config=i,this._fireConfigChanged(i)}_updateCustomSectionField(e,t,i){const a=[...this._config.custom_sections||[]];if(!a[e])return;a[e]={...a[e],[t]:i};const o={...this._config,custom_sections:a};this._config=o,this._fireConfigChanged(o)}_updateCustomSectionYaml(e,t){const i=[...this._config.custom_sections||[]];if(!i[e])return;const a={...i[e],yaml:t},o=Fe(t,(0,ze.kg)("editor.custom_section_yaml_invalid"));a.parsed_config=o.parsed_config,a._yaml_error=o._yaml_error,i[e]=a;const r={...this._config,custom_sections:i};this._config=r,a._yaml_error?this.requestUpdate():this._fireConfigChanged(r)}_removeCardFromSection(e,t){const i=[...this._config.custom_sections||[]];if(!i[e])return;const a={...i[e]},o=[...a.cards||[]];o.splice(t,1),a.cards=o,i[e]=a;const r={...this._config,custom_sections:i};this._config=r,this._fireConfigChanged(r)}_updateSectionCardField(e,t,i,a){const o=[...this._config.custom_sections||[]];if(!o[e])return;const r={...o[e]},s=[...r.cards||[]];if(!s[t])return;s[t]={...s[t],[i]:a},r.cards=s,o[e]=r;const n={...this._config,custom_sections:o};this._config=n,this._fireConfigChanged(n)}_updateSectionCardYaml(e,t,i){const a=[...this._config.custom_sections||[]];if(!a[e])return;const o={...a[e]},r=[...o.cards||[]];if(!r[t])return;const s={...r[t],yaml:i};delete s._yaml_error;const n=Fe(i,"YAML muss ein Objekt oder Array ergeben");s.parsed_config=n.parsed_config,s._yaml_error=n._yaml_error,r[t]=s,o.cards=r,a[e]=o;const c={...this._config,custom_sections:a};if(s._yaml_error)return this._config=c,void this.requestUpdate();this._config=c,this._fireConfigChanged(c)}_getAreaCustomCards(e){return[...this._config.areas_options?.[e]?.custom_cards||[]]}_writeAreaCustomCards(e,t){const i={...this._config.areas_options?.[e]||{}};0===t.length?delete i.custom_cards:i.custom_cards=t;const a={...this._config.areas_options,[e]:i};0===Object.keys(a[e]).length&&delete a[e];const o={...this._config,areas_options:a};o.areas_options&&0===Object.keys(o.areas_options).length&&delete o.areas_options,this._config=o,this._fireConfigChanged(o)}_addAreaCustomCard(e){const t=this._getAreaCustomCards(e);t.push({mode:"yaml",position:"bottom",editor_title:"",yaml:"",parsed_config:void 0}),this._writeAreaCustomCards(e,t)}_removeAreaCustomCard(e,t){const i=this._getAreaCustomCards(e);t<0||t>=i.length||(i.splice(t,1),this._writeAreaCustomCards(e,i))}_updateAreaCustomCardField(e,t,i,a){const o=this._getAreaCustomCards(e);if(!o[t])return;const r={...o[t],[i]:a};"mode"===i&&"tile"!==a&&this._parseAreaCustomCardYamlConfig(r,r.yaml||""),"mode"===i&&"tile"===a&&delete r._yaml_error,o[t]=r,this._writeAreaCustomCards(e,o)}_parseAreaCustomCardYamlConfig(e,t){if(e.yaml=t,delete e._yaml_error,t.trim())try{const i=xe.load(t);if(i&&"object"==typeof i){if("section"===e.mode){if(!(Array.isArray(i)?i:[i]).every(e=>e&&"object"==typeof e&&Array.isArray(e.cards)))return e._yaml_error="Section-YAML muss ein Objekt oder Array mit cards enthalten",void(e.parsed_config=void 0)}e.parsed_config=i}else e._yaml_error="YAML muss ein Objekt oder Array ergeben",e.parsed_config=void 0}catch(t){const i=t instanceof Error?t.message.split("\n")[0]:"Ungültiges YAML";e._yaml_error=i||"Ungültiges YAML",e.parsed_config=void 0}else e.parsed_config=void 0}_updateAreaCustomCardYaml(e,t,i){const a=this._getAreaCustomCards(e);if(!a[t])return;const o={...a[t]};this._parseAreaCustomCardYamlConfig(o,i),a[t]=o,this._writeAreaCustomCards(e,a)}_addCustomBadge(){const e=[...this._config.custom_badges||[]];e.push({yaml:"",parsed_config:void 0});const t={...this._config,custom_badges:e};this._config=t,this._fireConfigChanged(t)}_removeCustomBadge(e){const t=[...this._config.custom_badges||[]];t.splice(e,1);const i={...this._config};0===t.length?delete i.custom_badges:i.custom_badges=t,this._config=i,this._fireConfigChanged(i)}_updateCustomBadgeYaml(e,t){const i=[...this._config.custom_badges||[]];if(!i[e])return;const a={...i[e],yaml:t};delete a._yaml_error;const o=Fe(t,"YAML muss ein Objekt ergeben");a.parsed_config=o.parsed_config,a._yaml_error=o._yaml_error,i[e]=a;const r={...this._config,custom_badges:i};this._config=r,this._fireConfigChanged(r)}_areaVisibilityChanged(e,t){if(!this._hass)return;let i=[...this._config.areas_display?.hidden||[]];t?i=i.filter(t=>t!==e):(i.includes(e)||i.push(e),this._expandedAreas.delete(e),this._expandedGroups.delete(e),this._areaEntitiesCache.delete(e));const a={...this._config,areas_display:{...this._config.areas_display,hidden:i}};0===a.areas_display?.hidden?.length&&delete a.areas_display.hidden,a.areas_display&&0===Object.keys(a.areas_display).length&&delete a.areas_display,this._invalidateWeatherStartOptionsCaches(),this._config=a,this._fireConfigChanged(a)}_areaNavPinChanged(e,t){let i=[...this._config.areas_display?.nav_items||[]];t?i.includes(e)||i.push(e):i=i.filter(t=>t!==e);const a={...this._config,areas_display:{...this._config.areas_display,nav_items:i}};0===a.areas_display?.nav_items?.length&&delete a.areas_display.nav_items,a.areas_display&&0===Object.keys(a.areas_display).length&&delete a.areas_display,this._config=a,this._fireConfigChanged(a)}_toggleAreaExpand(e,t){e.stopPropagation();const i=new Set(this._expandedAreas);if(i.has(t)){i.delete(t);const e=new Map(this._expandedGroups);e.delete(t),this._expandedGroups=e}else i.add(t),this._areaEntitiesCache.has(t)||this._loadAreaEntities(t);this._expandedAreas=i}_toggleGroupExpand(e,t){const i=new Map(this._expandedGroups),a=new Set(i.get(e)||[]);a.has(t)?a.delete(t):a.add(t),a.size>0?i.set(e,a):i.delete(e),this._expandedGroups=i}_groupVisibilityChanged(e,t,i,a){if(!this._hass)return;const o=((this._config.areas_options?.[e]||{}).groups_options||{})[t];let r=[...o?.hidden||[]];r=i?r.filter(e=>!a.includes(e)):[...new Set([...r,...a])],this._updateEntityConfig(e,t,r)}_entityVisibilityChanged(e,t,i,a){if(!this._hass)return;if("badges_additional"===t)return void this._badgeAdditionalChanged(e,i,a);if("badges_show_name"===t)return void this._badgeShowNameChanged(e,i,a);const o=((this._config.areas_options?.[e]||{}).groups_options||{})[t];let r=[...o?.hidden||[]];a?r=r.filter(e=>e!==i):r.includes(i)||r.push(i),this._updateEntityConfig(e,t,r)}_updateEntityConfig(e,t,i){const a=this._config.areas_options?.[e]||{},o=a.groups_options||{},r={...o[t],hidden:i};0===r.hidden.length&&delete r.hidden;const s={...o,[t]:r};0===Object.keys(s[t]).length&&delete s[t];const n={...a,groups_options:s};0===Object.keys(n.groups_options).length&&delete n.groups_options;const c={...this._config.areas_options,[e]:n};0===Object.keys(c[e]).length&&delete c[e];const d={...this._config,areas_options:c};d.areas_options&&0===Object.keys(d.areas_options).length&&delete d.areas_options,this._config=d,this._fireConfigChanged(d),this._refreshAreaCache(e)}_badgeAdditionalChanged(e,t,i){if(!this._config)return;const a=this._config.areas_options?.[e]||{},o=a.groups_options||{},r=o.badges||{};let s=[...r.additional||[]];i?s.includes(t)||s.push(t):s=s.filter(e=>e!==t);const n={...r};s.length>0?n.additional=s:delete n.additional;const c={...o,badges:n};0===Object.keys(c.badges).length&&delete c.badges;const d={...a,groups_options:c};0===Object.keys(d.groups_options).length&&delete d.groups_options;const l={...this._config.areas_options,[e]:d};0===Object.keys(l[e]).length&&delete l[e];const _={...this._config,areas_options:l};_.areas_options&&0===Object.keys(_.areas_options).length&&delete _.areas_options,this._config=_,this._fireConfigChanged(_),this._refreshAreaCache(e)}_badgeShowNameChanged(e,t,i){if(!this._config||!this._hass)return;const a=this._config.areas_options?.[e]||{},o=a.groups_options||{},r=o.badges||{};let s=[...r.names_visible||[]],n=[...r.names_hidden||[]];const c=this._hass.states[t],d=c?.attributes?.device_class;i===(0,Ne.g7)(d)?(s=s.filter(e=>e!==t),n=n.filter(e=>e!==t)):i?(s.includes(t)||s.push(t),n=n.filter(e=>e!==t)):(s=s.filter(e=>e!==t),n.includes(t)||n.push(t));const l={...r};s.length>0?l.names_visible=s:delete l.names_visible,n.length>0?l.names_hidden=n:delete l.names_hidden;const _={...o,badges:l};0===Object.keys(_.badges).length&&delete _.badges;const h={...a,groups_options:_};0===Object.keys(h.groups_options).length&&delete h.groups_options;const u={...this._config.areas_options,[e]:h};0===Object.keys(u[e]).length&&delete u[e];const p={...this._config,areas_options:u};p.areas_options&&0===Object.keys(p.areas_options).length&&delete p.areas_options,this._config=p,this._fireConfigChanged(p),this._refreshAreaCache(e)}_addBadgeFromPicker(e,t){e.stopPropagation();const i=this.shadowRoot.querySelector(`.badge-entity-picker[data-area-id="${t}"]`);if(!i||!i.value)return;const a=i.value;this._badgeAdditionalChanged(t,a,!0),i.value=""}_getAreaOrder(){if(!this._hass)return[];const e=this._getNormalizedAreasDisplay()?.order;return e&&e.length>0?[...e]:Object.keys(this._hass.areas||{})}_updateAreaOrder(e){const t={...this._config,areas_display:{...this._config.areas_display,order:e}};this._invalidateWeatherStartOptionsCaches(),this._config=t,this._fireConfigChanged(t)}_fireConfigChanged(e){this._isUpdatingConfig=!0;const t=function(e){const t={...e};return delete t.overview_layout,delete t.sections_order,t}(e);delete t.inline_editor,t.custom_views&&(t.custom_views=t.custom_views.map(e=>{const t={...e};return delete t._yaml_error,t})),t.custom_cards&&(t.custom_cards=t.custom_cards.map(e=>{const t={...e};return delete t._yaml_error,t})),t.custom_badges&&(t.custom_badges=t.custom_badges.map(e=>{const t={...e};return delete t._yaml_error,t})),t.custom_sections&&(t.custom_sections=t.custom_sections.map(e=>{const t={...e};return delete t._yaml_error,t.cards=(e.cards||[]).map(e=>{const t={...e};return delete t._yaml_error,t}),t})),t.weather_start_layout_items&&(t.weather_start_layout_items=t.weather_start_layout_items.map(e=>{const t={...e};return delete t._yaml_error,t}));const i=this._getNormalizedAreasDisplay(t);i?t.areas_display=i:delete t.areas_display;const a=this._hass?new Set(Object.keys(this._hass.areas||{})):null;if(t.areas_options){const e=function(e){if(!e)return;const t={};for(const[i,a]of Object.entries(e)){const e={...a};delete e.webrtc_cameras,Object.keys(e).length>0&&(t[i]=e)}return Object.keys(t).length>0?t:void 0}(t.areas_options),i={};for(const[t,o]of Object.entries(e||{})){if(a&&!a.has(t))continue;const e={...o};if(o.custom_cards&&(e.custom_cards=o.custom_cards.map(e=>{const t={...e};return delete t._yaml_error,t})),o.view_override){const t={...o.view_override};delete t._yaml_error,e.view_override=t}Object.keys(e).length>0&&(i[t]=e)}Object.keys(i).length>0?t.areas_options=i:delete t.areas_options}this._config=e,function(e,t){e.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}(this,t),setTimeout(()=>{this._isUpdatingConfig=!1},0)}_openCardPickerForSection(e){this._openCardPicker(t=>{const i=xe.dump(t).trim(),a=[...this._config.custom_sections||[]];if(!a[e])return;const o={...a[e]};o.cards=[...o.cards||[],{editor_title:"",yaml:i,parsed_config:t}],a[e]=o;const r={...this._config,custom_sections:a};this._config=r,this._fireConfigChanged(r)})}_openCardPickerForAreaCustomCard(e){this._openCardPicker(t=>{const i=xe.dump(t).trim(),a=this._getAreaCustomCards(e);a.push({mode:"yaml",position:"bottom",editor_title:"",yaml:i,parsed_config:t}),this._writeAreaCustomCards(e,a)})}_openCardEditorForCustomCard(e){const t=this._config.custom_cards?.[e],i=this._getEditableYamlCardConfig(t);i&&this._openCardPicker(t=>{this._updateCustomCardYaml(e,xe.dump(t).trim())},i)}_openCardEditorForSectionCard(e,t){const i=this._config.custom_sections?.[e]?.cards?.[t],a=this._getEditableYamlCardConfig(i);a&&this._openCardPicker(i=>{this._updateSectionCardYaml(e,t,xe.dump(i).trim())},a)}_openCardEditorForAreaCustomCard(e,t){const i=this._getAreaCustomCards(e)[t],a=this._getEditableAreaCardConfig(i);a&&this._openCardPicker(i=>{const a=this._getAreaCustomCards(e);if(!a[t])return;const o={...a[t],mode:"yaml",yaml:xe.dump(i).trim(),parsed_config:i};delete o._yaml_error,a[t]=o,this._writeAreaCustomCards(e,a)},a)}_getEditableAreaCardConfig(e){return function(e,t){return t?"tile"===(t.mode||"yaml")&&t.entity?{type:"tile",entity:t.entity}:e._getEditableYamlCardConfig(t):null}(this._cardPickerHost,e)}_getEditableYamlCardConfig(e){return function(e,t){if(t?.parsed_config&&"object"==typeof t.parsed_config&&!Array.isArray(t.parsed_config))return t.parsed_config;if(!t?.yaml?.trim())return null;try{const e=xe.load(t.yaml);return e&&"object"==typeof e&&!Array.isArray(e)?e:null}catch{return null}}(this._cardPickerHost,e)}_openCardPicker(e,t){return function(e,t,i){e._cardPickerCallback=t,e._cardPickerConfig=i||null,e._cardPickerOpen=!0,e._cardPickerStep=i?"editor":"type",e._cardPickerSearch="",e._cardPickerSelectedType="string"==typeof i?.type?i.type:"",e._cardPickerYaml=i?xe.dump(i).trim():"",e._cardPickerHasVisualEditor=!1}(this._cardPickerHost,e,t)}_closeCardPicker(){return function(e){e._cardPickerOpen=!1,e._cardPickerCallback=null,e._cardPickerConfig=null;const t=e.shadowRoot?.querySelector(".card-editor-visual-host");t?.replaceChildren()}(this._cardPickerHost)}_selectCardType(e){return function(e,t){e._cardPickerSelectedType=t,e._cardPickerStep="editor";const i=Me.find(e=>e.type===t);if(i){e._cardPickerYaml=i.template;try{const t=xe.load(i.template);t&&"object"==typeof t&&!Array.isArray(t)&&(e._cardPickerConfig=t)}catch{}}else e._cardPickerYaml=`type: ${t}\n`,e._cardPickerConfig={type:t};e._cardPickerHasVisualEditor=!1}(this._cardPickerHost,e)}_cardPickerYamlChanged(e){return function(e,t){const i=t.target.value;e._cardPickerYaml=i;try{const t=xe.load(i);t&&"object"==typeof t&&!Array.isArray(t)&&(e._cardPickerConfig=t)}catch{}}(this._cardPickerHost,e)}_confirmCardPicker(){var e;(e=this._cardPickerHost)._cardPickerConfig&&e._cardPickerCallback&&(e._cardPickerCallback(e._cardPickerConfig),e._closeCardPicker())}updated(e){super.updated(e),this._openingMeasured||((0,Je.PZ)("editor-open"),this._openingMeasured=!0),this._cardPickerOpen&&"editor"===this._cardPickerStep&&!this._cardPickerHasVisualEditor&&this._tryMountVisualCardEditor()}_tryMountVisualCardEditor(){return function(e){const t=e.shadowRoot?.querySelector(".card-editor-visual-host");if(t&&!t.firstChild&&customElements.get("hui-card-element-editor"))try{const i=document.createElement("hui-card-element-editor");i.hass=e._hass,i.value=e._cardPickerConfig||{type:e._cardPickerSelectedType},i.addEventListener("config-changed",t=>{const i=t.detail?.config;i&&"object"==typeof i&&(e._cardPickerConfig=i,e._cardPickerYaml=xe.dump(i).trim(),e.requestUpdate("_cardPickerYaml"))}),t.appendChild(i),e._cardPickerHasVisualEditor=!0}catch{}}(this._cardPickerHost)}_renderCardPickerOverlay(){return"type"===(e=this._cardPickerHost)._cardPickerStep?e._renderCardTypePicker():e._renderCardEditor();var e}_renderCardTypePicker(){return function(e){const t=e._cardPickerSearch.toLowerCase(),i=Me.filter(e=>!t||e.type.includes(t)||e.name.toLowerCase().includes(t)),a=(window.customCards||[]).filter(e=>{const i=(e.type||"").toLowerCase(),a=(e.name||"").toLowerCase();return"webrtc-camera"!==i&&"custom:webrtc-camera"!==i&&!a.includes("webrtc")&&(!t||i.includes(t)||a.includes(t))});return je.qy`
    <div class="card-picker-overlay" @click=${e._handlePickerOverlayClick}>
      <div class="card-picker-dialog" @click=${e=>e.stopPropagation()}>
        <div class="card-picker-header">
          <span class="card-picker-header-title">Karte hinzufügen</span>
          <button class="card-picker-icon-btn" @click=${e._closeCardPicker} title="Schließen">
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        <div class="card-picker-search-row">
          <input
            type="text"
            placeholder="Kartentyp suchen…"
            .value=${e._cardPickerSearch}
            @input=${t=>{e._cardPickerSearch=t.target.value,e.requestUpdate()}}
          />
        </div>
        <div class="card-type-grid">
          ${i.map(t=>je.qy`
              <button class="card-type-btn" @click=${()=>e._selectCardType(t.type)}>
                <ha-icon icon=${t.icon}></ha-icon>
                <span>${t.name}</span>
              </button>
            `)}
          ${a.map(t=>je.qy`
              <button class="card-type-btn" @click=${()=>e._selectCardType(t.type)}>
                <ha-icon icon="mdi:puzzle"></ha-icon>
                <span>${t.name||t.type}</span>
              </button>
            `)}
        </div>
      </div>
    </div>
  `}(this._cardPickerHost)}_renderCardEditor(){return function(e){const t=Me.find(t=>t.type===e._cardPickerSelectedType)?.name||e._cardPickerSelectedType;return je.qy`
    <div class="card-picker-overlay" @click=${e._handlePickerOverlayClick}>
      <div class="card-picker-dialog" @click=${e=>e.stopPropagation()}>
        <div class="card-picker-header">
          <button
            class="card-picker-icon-btn"
            @click=${()=>{e._cardPickerStep="type";const t=e.shadowRoot?.querySelector(".card-editor-visual-host");t?.replaceChildren(),e._cardPickerHasVisualEditor=!1}}
            title="Zurück"
          >
            <ha-icon icon="mdi:arrow-left"></ha-icon>
          </button>
          <span class="card-picker-header-title">${t}</span>
          <button class="card-picker-icon-btn" @click=${e._closeCardPicker} title="Schließen">
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        <div class="card-editor-content">
          <div class="card-editor-visual-host"></div>
          ${e._cardPickerHasVisualEditor?je.s6:je.qy`
                  <div class="card-editor-yaml-label">YAML-Konfiguration:</div>
                  <textarea
                    class="card-editor-yaml-area"
                    .value=${e._cardPickerYaml}
                    @input=${e._cardPickerYamlChanged}
                    spellcheck="false"
                  ></textarea>
                `}
        </div>
        <div class="card-picker-footer">
          <button class="btn-secondary" @click=${e._closeCardPicker}>Abbrechen</button>
          <button class="btn-primary" @click=${e._confirmCardPicker}>Speichern</button>
        </div>
      </div>
    </div>
  `}(this._cardPickerHost)}createWeatherLayoutHost(){const e=this;return{_addWeatherStartArea:this._addWeatherStartArea.bind(this),_addWeatherStartFloor:this._addWeatherStartFloor.bind(this),_addWeatherStartSection:this._addWeatherStartSection.bind(this),_addWeatherStartSummaries:this._addWeatherStartSummaries.bind(this),get _config(){return e._config},set _config(t){e._config=t},_countNestedFixedGrids:this._countNestedFixedGrids.bind(this),get _expandedWeatherBlocks(){return e._expandedWeatherBlocks},set _expandedWeatherBlocks(t){e._expandedWeatherBlocks=t},_getCustomCardEditorLabel:this._getCustomCardEditorLabel.bind(this),_getWeatherStartAreaOptions:this._getWeatherStartAreaOptions.bind(this),_getWeatherStartCustomCardIndex:this._getWeatherStartCustomCardIndex.bind(this),_getWeatherStartCustomSectionIndex:this._getWeatherStartCustomSectionIndex.bind(this),_getWeatherStartFloorOptions:this._getWeatherStartFloorOptions.bind(this),_getWeatherStartItemMeta:this._getWeatherStartItemMeta.bind(this),_getWeatherStartLayoutItems:this._getWeatherStartLayoutItems.bind(this),_handleWeatherStartDragEnd:this._handleWeatherStartDragEnd.bind(this),_handleWeatherStartDragLeave:this._handleWeatherStartDragLeave.bind(this),_handleWeatherStartDragOver:this._handleWeatherStartDragOver.bind(this),_handleWeatherStartDragStart:this._handleWeatherStartDragStart.bind(this),_handleWeatherStartDrop:this._handleWeatherStartDrop.bind(this),_isWeatherStartItemDisabled:this._isWeatherStartItemDisabled.bind(this),_openCardEditorForCustomCard:this._openCardEditorForCustomCard.bind(this),_openCardEditorForSectionCard:this._openCardEditorForSectionCard.bind(this),_openCardPickerForSection:this._openCardPickerForSection.bind(this),_openCardPickerForWeatherStartCard:this._openCardPickerForWeatherStartCard.bind(this),_removeCardFromSection:this._removeCardFromSection.bind(this),_removeWeatherStartItem:this._removeWeatherStartItem.bind(this),_renderWeatherStartCustomCardEditor:this._renderWeatherStartCustomCardEditor.bind(this),_renderWeatherStartCustomSectionEditor:this._renderWeatherStartCustomSectionEditor.bind(this),_resetWeatherStartItemYaml:this._resetWeatherStartItemYaml.bind(this),_toggleWeatherBlockExpanded:this._toggleWeatherBlockExpanded.bind(this),_toggleWeatherStartItemStack:this._toggleWeatherStartItemStack.bind(this),_updateCustomCardField:this._updateCustomCardField.bind(this),_updateCustomCardYaml:this._updateCustomCardYaml.bind(this),_updateCustomSectionField:this._updateCustomSectionField.bind(this),_updateSectionCardField:this._updateSectionCardField.bind(this),_updateSectionCardYaml:this._updateSectionCardYaml.bind(this),_updateWeatherStartItemYaml:this._updateWeatherStartItemYaml.bind(this),_weatherStartSummarySizeChanged:this._weatherStartSummarySizeChanged.bind(this),_weatherStartTitleChanged:this._weatherStartTitleChanged.bind(this),_parseWeatherStartItemYaml:this._parseWeatherStartItemYaml.bind(this),requestUpdate:this.requestUpdate.bind(this),_saveWeatherStartLayoutItems:this._saveWeatherStartLayoutItems.bind(this),_normalizeWeatherStartLayoutItems:this._normalizeWeatherStartLayoutItems.bind(this),_fireConfigChanged:this._fireConfigChanged.bind(this)}}createOptionPanelHost(){const e=this;return{get hass(){return e._hass},get config(){return e._config},editor:e,entityListState:this._entityListState,checkbox:this._renderCheckbox.bind(this),toggle:this._toggleChanged.bind(this),setOption:this._simpleOptionChanged.bind(this),update:t=>{const i={...e._config};t(i),e._config=i,e._fireConfigChanged(i)},requestUpdate:this.requestUpdate.bind(this),entityOptions:this._getAllEntitiesForSelect.bind(this),filterEntities:this._getFilteredEntities.bind(this),sortedAreas:this._getSortedAreas.bind(this)}}createRoomOptionsHost(){const e=this;return{_addAreaCustomCard:this._addAreaCustomCard.bind(this),_addBadgeFromPicker:this._addBadgeFromPicker.bind(this),_areaDisplayTypeOverrideChanged:this._areaDisplayTypeOverrideChanged.bind(this),get _areaEntitiesCache(){return e._areaEntitiesCache},set _areaEntitiesCache(t){e._areaEntitiesCache=t},_areaNavPinChanged:this._areaNavPinChanged.bind(this),_areaVisibilityChanged:this._areaVisibilityChanged.bind(this),_badgeAdditionalChanged:this._badgeAdditionalChanged.bind(this),_badgeShowNameChanged:this._badgeShowNameChanged.bind(this),get _config(){return e._config},set _config(t){e._config=t},_entityVisibilityChanged:this._entityVisibilityChanged.bind(this),get _expandedAreas(){return e._expandedAreas},set _expandedAreas(t){e._expandedAreas=t},get _expandedGroups(){return e._expandedGroups},set _expandedGroups(t){e._expandedGroups=t},_getAreaCustomCards:this._getAreaCustomCards.bind(this),_getCustomCardEditorLabel:this._getCustomCardEditorLabel.bind(this),_groupVisibilityChanged:this._groupVisibilityChanged.bind(this),_handleDragEnd:this._handleDragEnd.bind(this),_handleDragLeave:this._handleDragLeave.bind(this),_handleDragOver:this._handleDragOver.bind(this),_handleDragStart:this._handleDragStart.bind(this),_handleDrop:this._handleDrop.bind(this),get _hass(){return e._hass},set _hass(t){e._hass=t},_openCardEditorForAreaCustomCard:this._openCardEditorForAreaCustomCard.bind(this),_openCardPickerForAreaCustomCard:this._openCardPickerForAreaCustomCard.bind(this),_openDiagnosticLocation:this._openDiagnosticLocation.bind(this),_removeAreaCustomCard:this._removeAreaCustomCard.bind(this),_renderAreaCustomCardItem:this._renderAreaCustomCardItem.bind(this),_renderAreaCustomCardsSection:this._renderAreaCustomCardsSection.bind(this),_renderAreaDisplayTypeOverride:this._renderAreaDisplayTypeOverride.bind(this),_renderAreaEntities:this._renderAreaEntities.bind(this),_renderAreaViewOverride:this._renderAreaViewOverride.bind(this),_renderBadgeGroup:this._renderBadgeGroup.bind(this),_renderStackOrderPanel:this._renderStackOrderPanel.bind(this),_toggleAreaExpand:this._toggleAreaExpand.bind(this),_toggleGroupExpand:this._toggleGroupExpand.bind(this),_updateAreaCustomCardField:this._updateAreaCustomCardField.bind(this),_updateAreaCustomCardYaml:this._updateAreaCustomCardYaml.bind(this),_updateAreaViewOverride:this._updateAreaViewOverride.bind(this),_fireConfigChanged:this._fireConfigChanged.bind(this)}}createCustomViewsHost(){const e=this;return{get _config(){return e._config},get _hass(){return e._hass},get _refDashboards(){return e._refDashboards},_getSortedAreas:e._getSortedAreas.bind(e),_addCustomView:e._addCustomView.bind(e),_addCustomRefView:e._addCustomRefView,_loadRefDashboards:e._loadRefDashboards.bind(e),_refDashboardChanged:e._refDashboardChanged.bind(e),_refViewChanged:e._refViewChanged.bind(e),_removeCustomView:e._removeCustomView.bind(e),_updateCustomViewField:e._updateCustomViewField.bind(e),_updateCustomViewAfterView:e._updateCustomViewAfterView.bind(e),_updateCustomViewYaml:e._updateCustomViewYaml.bind(e)}}createCustomContentHost(){const e=this;return{get _config(){return e._config},customViewsHost:this._customViewsHost,_sectionLabelKey:e=>Gt._sectionMeta.get(e).labelKey,_getCustomCardEditorLabel:this._getCustomCardEditorLabel.bind(this),_customCardsHeadingChanged:this._customCardsHeadingChanged.bind(this),_customCardsIconChanged:this._customCardsIconChanged.bind(this),_openCardPickerForCustomCard:()=>e._openCardPickerForCustomCard(),_removeCustomCard:this._removeCustomCard.bind(this),_updateCustomCardField:this._updateCustomCardField.bind(this),_updateCustomCardYaml:this._updateCustomCardYaml.bind(this),_openCardEditorForCustomCard:this._openCardEditorForCustomCard.bind(this),_addCustomSection:this._addCustomSection.bind(this),_removeCustomSection:this._removeCustomSection.bind(this),_updateCustomSectionYaml:this._updateCustomSectionYaml.bind(this),_updateCustomSectionField:this._updateCustomSectionField.bind(this),_removeCardFromSection:this._removeCardFromSection.bind(this),_updateSectionCardField:this._updateSectionCardField.bind(this),_updateSectionCardYaml:this._updateSectionCardYaml.bind(this),_openCardEditorForSectionCard:this._openCardEditorForSectionCard.bind(this),_openCardPickerForSection:this._openCardPickerForSection.bind(this),_addCustomBadge:this._addCustomBadge.bind(this),_removeCustomBadge:this._removeCustomBadge.bind(this),_updateCustomBadgeYaml:this._updateCustomBadgeYaml.bind(this)}}createCardPickerHost(){const e=this;return{get _cardPickerHasVisualEditor(){return e._cardPickerHasVisualEditor},set _cardPickerHasVisualEditor(t){e._cardPickerHasVisualEditor=t},get _cardPickerSearch(){return e._cardPickerSearch},set _cardPickerSearch(t){e._cardPickerSearch=t},get _cardPickerSelectedType(){return e._cardPickerSelectedType},set _cardPickerSelectedType(t){e._cardPickerSelectedType=t},get _cardPickerStep(){return e._cardPickerStep},set _cardPickerStep(t){e._cardPickerStep=t},get _cardPickerYaml(){return e._cardPickerYaml},set _cardPickerYaml(t){e._cardPickerYaml=t},_cardPickerYamlChanged:this._cardPickerYamlChanged.bind(this),_closeCardPicker:this._closeCardPicker.bind(this),_confirmCardPicker:this._confirmCardPicker.bind(this),_handlePickerOverlayClick:this._handlePickerOverlayClick.bind(this),_renderCardEditor:this._renderCardEditor.bind(this),_renderCardTypePicker:this._renderCardTypePicker.bind(this),_selectCardType:this._selectCardType.bind(this),requestUpdate:this.requestUpdate.bind(this),get shadowRoot(){return e.shadowRoot},get _cardPickerCallback(){return e._cardPickerCallback},set _cardPickerCallback(t){e._cardPickerCallback=t},get _cardPickerConfig(){return e._cardPickerConfig},set _cardPickerConfig(t){e._cardPickerConfig=t},get _cardPickerOpen(){return e._cardPickerOpen},set _cardPickerOpen(t){e._cardPickerOpen=t},get _hass(){return e._hass},set _hass(t){e._hass=t},_getEditableYamlCardConfig:this._getEditableYamlCardConfig.bind(this)}}}function Zt(e,t){return t.areas_options?.[e]?.groups_options?.badges?.additional||[]}function Jt(e,t){const i=new Set;for(const a of e){const e=t.states[a];if(!e)continue;const o=e.attributes?.device_class;(0,Ne.g7)(o)&&i.add(a)}return i}function Qt(e,t){const i=t.areas_options?.[e]?.groups_options?.badges;return{namesVisible:i?.names_visible||[],namesHidden:i?.names_hidden||[]}}function Xt(e,t){const i=t.areas_options?.[e];if(!i||!i.groups_options)return{};const a={};for(const[e,t]of Object.entries(i.groups_options))t.hidden&&(a[e]=t.hidden);return a}function ei(e,t){const i=t.areas_options?.[e];if(!i||!i.groups_options)return{};const a={};for(const[e,t]of Object.entries(i.groups_options))t.order&&(a[e]=t.order);return a}Gt.properties={_config:{state:!0},_expandedAreas:{state:!0},_expandedGroups:{state:!0},_expandedWeatherBlocks:{state:!0},_cardPickerOpen:{state:!0},_cardPickerStep:{state:!0},_cardPickerSearch:{state:!0},_optionSearch:{state:!0},_showChangedOnly:{state:!0},_cardPickerSelectedType:{state:!0},_cardPickerYaml:{state:!0},_cardPickerHasVisualEditor:{state:!0}},Gt.styles=bt,Gt._weatherStartBlockMeta=new Map(Object.entries({clock:{icon:"mdi:clock-outline",labelKey:"weather_start_blocks.clock"},date:{icon:"mdi:calendar-today",labelKey:"weather_start_blocks.date"},summaries:{icon:"mdi:view-dashboard-outline",labelKey:"weather_start_blocks.summaries"},favorites:{icon:"mdi:star",labelKey:"weather_start_blocks.favorites"},light_favorites:{icon:"mdi:lightbulb-star-outline",labelKey:"weather_start_blocks.light_favorites"},alarm:{icon:"mdi:shield-home",labelKey:"weather_start_blocks.alarm"},house_mode:{icon:"mdi:home-switch-outline",labelKey:"weather_start_blocks.house_mode"},search:{icon:"mdi:magnify",labelKey:"weather_start_blocks.search"},overview:{icon:"mdi:overscan",labelKey:"weather_start_blocks.overview"},weather_current:{icon:"mdi:weather-partly-cloudy",labelKey:"weather_start_blocks.weather_current"},weather_hourly:{icon:"mdi:clock-time-four-outline",labelKey:"weather_start_blocks.weather_hourly"},weather_daily:{icon:"mdi:calendar-week",labelKey:"weather_start_blocks.weather_daily"},weather_details:{icon:"mdi:gauge",labelKey:"weather_start_blocks.weather_details"},energy:{icon:"mdi:lightning-bolt",labelKey:"weather_start_blocks.energy"},plants:{icon:"mdi:flower",labelKey:"weather_start_blocks.plants"},agenda:{icon:"mdi:calendar",labelKey:"weather_start_blocks.agenda"},todos:{icon:"mdi:check-circle-outline",labelKey:"weather_start_blocks.todos"},persons:{icon:"mdi:account-group",labelKey:"weather_start_blocks.persons"},vacuums:{icon:"mdi:robot-vacuum",labelKey:"weather_start_blocks.vacuums"},maintenance:{icon:"mdi:wrench-clock",labelKey:"weather_start_blocks.maintenance"},quick_actions:{icon:"mdi:gesture-tap-button",labelKey:"weather_start_blocks.quick_actions"},media:{icon:"mdi:play-circle-outline",labelKey:"weather_start_blocks.media"},timers:{icon:"mdi:timer-outline",labelKey:"weather_start_blocks.timers"},activity:{icon:"mdi:history",labelKey:"weather_start_blocks.activity"},areas:{icon:"mdi:floor-plan",labelKey:"weather_start_blocks.areas"},custom_cards:{icon:"mdi:cards",labelKey:"weather_start_blocks.custom_cards"},custom_sections:{icon:"mdi:view-grid-plus-outline",labelKey:"weather_start_blocks.custom_sections"}})),Gt._sectionMeta=new Map([["overview",{icon:"mdi:home-outline",labelKey:"sections.overview"}],["custom_cards",{icon:"mdi:cards",labelKey:"sections.custom_cards"}],["areas",{icon:"mdi:floor-plan",labelKey:"sections.areas"}],["weather",{icon:"mdi:weather-partly-cloudy",labelKey:"sections.weather"}],["energy",{icon:"mdi:lightning-bolt",labelKey:"sections.energy"}]]),customElements.define("dashboard-strategy-editor",Gt)},7773(e,t,i){i.r(t),i.d(t,{editorTranslationsReady:()=>r});const a=JSON.parse('{"editor":{"diagnostics_title":"Dashboard check","diagnostics_check":"Check configuration","diagnostics_help":"Checks structured entity references. Templates and stream names are not checked. Settings are preserved.","diagnostics_ok":"No missing or unavailable entity references found.","diagnostics_missing":"Entity missing","diagnostics_unavailable":"Currently unavailable","diagnostics_open":"Open editor section","entity_existing_restricted":"Existing diagnostic/configuration entry","override_active":"Custom room layout","override_active_help":"Replaces the automatic room view. Click to edit its YAML.","section_order":"Section Order","section_order_desc":"Drag sections to reorder them on the overview page. Empty sections are hidden automatically.","section_hidden":"hidden","stack_order":"Room block order","stack_order_desc":"Drag blocks to set their order in this room view.","stack_not_present":"(not present)","stack_order_inactive":"Not present in this room","energy_link_dashboard":"Link to energy dashboard","target_section":"Show in","section_overview":"Overview","section_overview_details":"Additional overview options","theme":"Theme:","overview_max_columns":"Maximum columns:","overview_area_card_columns":"Area cards per row:","columns_full":"One","weather_start_weather_mode":"Weather display:","weather_mode_full":"Full","weather_mode_compact_hourly":"Compact with 6 hours","weather_start_date_card":"Date card:","date_card_markdown":"Native Markdown card","theme_default":"Home Assistant default","theme_desc":"Select a theme for all automatically generated dashboard views. Custom views with their own YAML theme keep that setting.","background_image":"Background image","background_image_desc":"Pick an image in the media dialog or upload it directly. Alternatively use a path or URL such as /local/background.jpg.","background_opacity":"Opacity","background_fixed":"Fix background while scrolling","weather_entity":"Weather entity:","weather_entity_auto":"Auto-detect","weather_entity_desc":"Manually select a weather entity. If nothing is selected, the first available weather entity is used automatically.","clock_size":"Clock size:","date_size":"Date size:","show_clock_card":"Show clock card","show_clock_card_desc":"Shows the clock card on the overview.","show_person_badges":"Show person badges","show_person_badges_desc":"Shows the automatically generated person badges in the overview header. Disable this if you want to replace them with custom badges.","person_badge_layout":"Person badge layout:","person_badge_layout_desc":"Controls whether person badges only show the name, include the current state, or include state and relative time.","person_badge_layout_minimal":"Name only","person_badge_layout_with_state":"Name and state","person_badge_layout_with_state_and_time":"Name, state, and time","alarm_entity":"Alarm entity:","alarm_none":"None (clock full width)","alarm_desc":"Select an alarm control panel entity. When the clock card is active, the alarm panel is shown next to it. Without the clock card, the alarm panel takes the full width.","house_mode_entity":"House mode helper:","house_mode_none":"None (no house mode)","house_mode_desc":"Select an input_select or select helper. It is shown on the overview as a dropdown below the clock.","show_search_card":"Show search card","show_search_card_desc":"Shows the custom:search-card directly below the clock on the overview.","show_search_card_missing":"Requires <strong>custom:search-card</strong> and <strong>card-tools</strong>. Please install both components to use this feature.","search_card_variant":"Search presentation","search_card_variant_custom":"Interactive custom search card","search_card_variant_tip":"Native search hint","show_unavailable_alert_badge":"Show unavailable alert badge","show_unavailable_alert_badge_desc":"Adds a header badge with the count of visible entities currently unavailable.","show_now_playing_badge":"Show now playing badge","show_now_playing_badge_desc":"Adds a header badge for the first visible media player that is currently playing.","show_sun_badge":"Show sun badge","show_sun_badge_desc":"Adds a sunrise or sunset badge for sun.sun in the overview header.","show_updates_badge":"Show updates badge","show_updates_badge_desc":"Adds a header badge with the count of visible update entities that have pending updates.","section_summaries":"Summaries","panel_navigation":"Jump to settings panel","compact_overview_summaries":"Compact summaries on the standard overview","compact_overview_summaries_desc":"Uses smaller summary cards on the standard overview. Custom layouts and the weather start page stay unchanged.","section_summary_details":"Summary details","columns_2":"2 columns (2x2 grid)","columns_4":"4 columns (1x4 row)","columns_desc":"Choose how summary cards should be displayed. The layout adjusts automatically when cards are hidden.","security_options":"Security view","group_security_by_areas":"Group security by areas","group_security_by_areas_desc":"Uses an area-oriented layout similar to Home Assistant\'s security panel.","show_security_activity":"Show 24-hour security activity","show_security_activity_desc":"Adds a native logbook card when the logbook integration is available.","security_activity_position":"Activity position","position_start":"Start","position_end":"End","security_extra_entities":"Additional entity IDs (comma-separated)","show_light_summary":"Show light summary","show_light_view":"Always provide lights view","show_light_view_desc":"Generates /lights even when the light summary is hidden.","group_lights_by_floors":"Group lights by floors","group_lights_by_floors_desc":"Groups lights in the lights view by floors. Each floor gets its own section with on/off buttons.","group_lights_by_areas":"Group lights by areas","group_lights_by_areas_desc":"Groups lights by area, nested below floors when both options are enabled.","group_covers_by_floors":"Group covers by floors","group_covers_by_floors_desc":"Groups covers in the covers view by floors. Each floor gets its own subsection with a heading. Awnings and windows remain unsplit.","group_covers_by_areas":"Group covers by areas","group_covers_by_areas_desc":"Groups covers by area, nested below floors when both options are enabled.","nested_light_groups":"Show nested light groups","nested_light_groups_desc":"Shows light groups as expandable containers with their member lights underneath. Disabled by default to preserve the existing flat list behavior.","lights_sort_by_name":"Sort lights alphabetically","lights_sort_by_name_desc":"Sorts lights by display name instead of last changed. Applies to the lights view, room views, and nested light groups.","show_covers_summary":"Show cover summary","show_covers_view":"Always provide covers view","show_covers_view_desc":"Generates /covers even when the cover summary is hidden.","show_partially_open_covers":"Show partially open covers separately","show_partially_open_covers_desc":"Shows partially open covers (neither fully open nor closed) in a separate group.","show_security_summary":"Show security summary","show_security_view":"Always provide security view","show_security_view_desc":"Generates /security even when the security summary is hidden.","hide_hidden_areas_in_security":"Also hide hidden areas from security","hide_hidden_areas_in_security_desc":"By default security entities and cameras from overview-hidden areas remain visible. Enable this to filter them.","show_climate_summary":"Show climate summary","show_climate_summary_desc":"Shows the climate summary card on the overview. Counts active thermostats and climate devices.","show_climate_view":"Always provide climate view","show_climate_view_desc":"Generates /climate even when the climate summary is hidden.","show_battery_summary":"Show battery summary","show_battery_view":"Show battery view without summary","show_battery_view_desc":"Creates the /batteries subview even when the battery summary card is hidden on the overview.","hide_mobile_app_batteries":"Hide mobile app batteries","hide_mobile_app_batteries_desc":"Hides batteries from smartphones, tablets, and watches (Mobile App) from the battery overview and summary.","hide_battery_notes_entities":"Hide Battery Notes helpers","hide_battery_notes_entities_desc":"Hides helper entities created by the Battery Notes integration from the battery overview and summary.","show_area_in_battery_view":"Show area in battery tiles","show_area_in_battery_view_desc":"Prefixes battery tile names in the battery view with the assigned area name.","group_batteries_by_areas":"Group batteries by areas","group_batteries_by_areas_desc":"Groups batteries within each status by area and adds a trailing No area group.","battery_thresholds":"Battery thresholds","battery_critical_below":"Critical below","battery_low_below":"Low below","battery_thresholds_desc":"Thresholds for battery status groups (Critical / Low / Good).","unavailable_batteries_bucket":"Bucket unavailable batteries as","unavailable_batteries_bucket_desc":"Controls whether batteries with unavailable or non-numeric states default to the good or critical group.","section_info_cards":"Info Cards","show_weather":"Show weather card","show_weather_desc":"Shows the weather forecast card on the overview when a weather entity is available.","show_weather_forecast_card":"Keep legacy weather forecast enabled","show_weather_forecast_card_desc":"Legacy compatibility switch. If disabled, the weather section defaults to no presentation unless an explicit weather presentation is selected.","weather_presentation":"Weather presentation:","weather_presentation_forecast_daily":"Forecast daily","weather_presentation_forecast_hourly":"Forecast hourly","weather_presentation_forecast_twice_daily":"Forecast twice daily","weather_presentation_tile":"Tile card","weather_presentation_none":"No weather card","section_weather_sensors":"Weather sensors","weather_sensors_desc":"Optional sensor row above the weather card. One line per sensor in the format entity|icon|unit|round.","show_energy":"Show energy dashboard","show_energy_desc":"Shows the energy distribution card on the overview when energy data is available.","show_energy_distribution_card":"Show energy distribution card","power_badge_entity":"Power badge entity:","power_badge_none":"None","power_badge_entity_desc":"Shows the selected entity as an extra header badge, for example current household power usage.","agenda_calendar_entities":"Calendar entities:","agenda_calendar_entities_desc":"Optional comma-separated list of calendar entities for the agenda section. Leave empty to auto-detect visible calendars.","todos_entities":"Todo entities:","todos_entities_desc":"Optional comma-separated list of todo entities for the todos section. Leave empty to auto-detect visible todo lists.","section_favorites":"Favorites","select_entity":"Select entity...","add":"+ Add","favorites_desc":"Select entities to be shown as favorites below the summaries. Entities are displayed as tiles.","light_favorites":"Favorite lights","light_favorites_entities":"Light entity IDs (comma-separated)","light_favorites_desc":"Adds a dedicated quick-access section for selected lights.","room_visibility":"Room visibility by entity state","room_visibility_desc":"Room views and navigation tabs are generated only while the configured entity has the expected state.","room_visibility_entity":"Entity ID","room_visibility_state":"Expected state","show_state":"Show state","hide_last_changed":"Hide last changed","section_areas_rooms":"Areas & Rooms","section_areas":"Areas","area_overview_options":"Area cards on overview","room_view_options":"Room view content","area_management_options":"Area list & sorting","group_by_floors":"Group areas by floors","group_by_floors_desc":"Groups areas on the overview by floors. When enabled, a separate section is created for each floor.","area_display_type":"Area card display","area_display_type_desc":"Sets the default display for all area cards. Picture mode uses the area picture configured in Home Assistant; areas without a picture remain compact.","area_display_type_compact":"Compact","area_display_type_picture":"Area picture","area_display_type_override":"Area card display","area_display_type_inherit":"Use global setting","area_display_type_no_picture":"This area has no picture. Its card remains compact when picture mode is selected.","show_switches_on_areas":"Show switches on area cards","show_switches_on_areas_desc":"Shows switches as controls on the area cards in the overview. Home Assistant hides these by default.","show_alerts_on_areas":"Show alert icons on area cards","show_alerts_on_areas_desc":"Shows alert icons (e.g. motion, moisture, heat) on area cards when a binary sensor in the area is active.","show_locks_in_rooms":"Show locks in room views","show_locks_in_rooms_desc":"Shows locks (e.g. Nuki) in the respective room views. Locks always appear in the security overview regardless.","show_cover_controls_in_rooms":"Show batch buttons on cover headings","show_cover_controls_in_rooms_desc":"Shows open, stop and close buttons for suitable covers and curtains in room views.","show_automations_in_rooms":"Show automations in room views","show_automations_in_rooms_desc":"Shows automations assigned to the area in the respective room views.","show_scripts_in_rooms":"Show scripts in room views","show_scripts_in_rooms_desc":"Shows scripts assigned to the area in the respective room views.","show_vacuums_section_in_rooms":"Dedicated vacuum section in rooms","show_vacuums_section_in_rooms_desc":"Shows vacuums and lawn mowers in their own section instead of Misc.","show_switches_section_in_rooms":"Dedicated switches & outlets section","show_switches_section_in_rooms_desc":"Shows switches and smart outlets in their own room section instead of Misc.","show_helpers_section_in_rooms":"Helpers & controls section","show_helpers_section_in_rooms_desc":"Shows helpers (input_boolean, input_number, input_select, timer, counter …) and user-facing select, number, button, siren and remote entities assigned to the room in their own section.","show_sensors_section_in_rooms":"Detectors & sensors section","show_sensors_section_in_rooms_desc":"Shows motion, presence, leak, smoke, gas and similar binary sensors as tiles with their last change. Room badges stay unchanged.","camera_live_toggle":"Use camera live toggle","camera_live_toggle_desc":"Uses the camera wrapper with a play/stop toggle. Without this option, native Home Assistant camera cards are shown.","show_energy_in_rooms":"Show energy block in room views","show_energy_in_rooms_desc":"Shows the area\'s power, energy, water, and gas sensors as a dedicated block in the respective room view.","show_ups_in_rooms":"Show UPS in room views","show_ups_in_rooms_desc":"Automatically detects UPS devices and shows a block per device with battery level and related sensors in the respective room view. Sensors hidden via the \'no_dboard\' label or entity options are not included.","hide_grouped_climate_members":"Hide controlled thermostats","hide_grouped_climate_members_desc":"Hides physical thermostats that Better Thermostat or a climate group already controls, so the same radiator is not shown twice. The controlling entity stays visible.","show_window_contacts_in_rooms":"Show window contacts in room views","show_window_contacts_in_rooms_desc":"Shows window contacts as badges in the respective room views.","show_door_contacts_in_rooms":"Show door contacts in room views","show_door_contacts_in_rooms_desc":"Shows door contacts as badges in the respective room views.","use_default_area_sort":"Use Home Assistant sorting","use_default_area_sort_desc":"Uses the area sorting from Home Assistant instead of the order configured here.","areas_manage_desc":"Choose which areas should be shown on the dashboard and in what order. Expand areas to manage individual entities.","area_entity_settings_desc":"Expand an area to configure entities, ordering, cameras, and additional cards.","area_pin_nav":"Show in navigation","section_room_pins":"Room Pins","room_pins_desc":"Select entities to be shown first in their assigned rooms. Ideal for entities that are not automatically detected (e.g. weather stations, special sensors). <strong>Only entities with room assignment can be selected.</strong> These pins only appear in their respective room, not on the overview.","section_views":"Views","user_visibility":"User visibility","user_visibility_warning":"Display logic only: hidden views remain reachable by URL. Reload the dashboard after changes.","user_visibility_no_person_warning":"User accounts without a linked person cannot be selected and lose a view as soon as that view has a rule.","user_visibility_views":"Views and entry points","user_visibility_sections":"Overview sections","show_summary_views":"Show summary views","show_summary_views_desc":"Shows the summary views (Lights, Covers, Security, Batteries) in the top navigation.","show_room_views":"Show room views","show_room_views_desc":"Shows individual room views in the top navigation.","show_cctv_view":"Show experimental CCTV view","show_cctv_view_desc":"Creates an optional camera view grouped by area.","cctv_show_activity":"Show CCTV activity history","cctv_show_activity_desc":"Shows motion, occupancy, and doorbell activity for the last twelve hours. LLM Vision timelines can be configured separately below.","show_maintenance_view":"Show maintenance view","show_maintenance_view_desc":"Shows pending updates, unavailable entities, and maintenance tips.","section_advanced":"Advanced","section_area_views":"Areas and custom views","area_view_override_intro":"Manage areas or expand one to paste a complete Lovelace view as YAML.","area_view_override_title":"Custom area view","area_view_override_help":"The YAML replaces the automatically generated view for this area. Title, path, and icon still come from the Home Assistant area.","area_view_override_remove":"Remove custom view","area_view_override_object_error":"YAML must produce a complete view object","section_advanced_options":"Global display options","hidden_section_headings":"Hide section headings","hidden_section_headings_desc":"Hides generated heading cards for selected overview sections while keeping their content visible.","section_visibility":"Conditional section visibility","section_visibility_desc":"Only show a generated overview section when the selected entity matches the configured state.","section_visibility_entity":"Entity","section_visibility_state":"State","hide_unavailable_entities":"Hide unavailable entities","hide_unavailable_entities_desc":"Dynamically hides entity cards and badges whose state is \'unavailable\' or \'unknown\'. As soon as the entity is available again, it reappears without a reload.","dense_section_placement":"Use dense section placement","dense_section_placement_desc":"Enables dense placement in generated sections views so gaps in the grid can be filled automatically.","hide_completed_todos":"Hide completed to-dos","hide_completed_todos_desc":"Hides completed items in automatically generated to-do cards.","section_custom_content":"Custom Content","section_custom_content_desc":"Custom cards, sections, badges, and views are managed here in one place. The start page layout can place these items directly.","custom_content_weather_start_hint":"Cards and sections for the weather start page are edited above in the layout order. This area only keeps content that is not placed there.","section_custom_sections":"Custom Sections","custom_sections_help":"Create complete sections with a custom title, icon, and any cards. Each section appears as a separate section on the overview.","custom_section_yaml_invalid":"The section YAML must contain a valid section or card configuration.","no_custom_sections":"No custom sections created","add_custom_section":"+ Add new section","custom_section_title_placeholder":"Section title (optional)","custom_section_icon_placeholder":"Icon (e.g. mdi:star)","add_card_to_section":"+ Add card","section_custom_cards":"Custom Cards","custom_cards_heading_placeholder":"Custom Cards","custom_cards_desc":"Heading and icon for the custom cards section on the dashboard. Leave empty for defaults.","add_custom_card":"+ Add new card","video_tutorial":"Watch video tutorial","custom_cards_help":"Add custom cards to the overview. Cards appear in a separate section between summaries and areas. Tip: Create the card in a regular dashboard first, copy the YAML code, and paste it here.","section_custom_badges":"Custom Badges","add_custom_badge":"+ Add new badge","custom_badges_help":"Add custom badges to the overview header (next to person chips).","section_custom_views":"Custom Views","add_custom_view":"+ Add new view","custom_views_help":"Create custom views with any cards. Tip: Create the view in a regular dashboard first, copy the YAML code, and paste it here.","custom_view_position_end":"Position: end of tab bar (default)","custom_view_position_after":"Position: after","add_custom_view_ref":"+ Reference view from dashboard","custom_views_ref_help":"Referenced views are loaded live from the source dashboard on every load. Strategy dashboards cannot be referenced.","ref_loading":"Loading dashboards ...","ref_no_dashboards":"No referenceable dashboards found","ref_select_dashboard":"Select dashboard ...","ref_select_view":"Select view ...","ref_view_untitled":"View","ref_default_dashboard":"Default dashboard","ref_dashboard_missing":"The referenced dashboard is missing or no longer referenceable","ref_valid":"Reference valid","ref_incomplete":"Select a dashboard and view","no_favorites":"No favorites added","no_room_pins":"No room pins added","no_results":"No results found","search_options":"Search options","search_options_placeholder":"Search options, e.g. windows or show_ups…","show_changed_only":"Show only options changed from the default","no_changed_options":"No options differ from the defaults.","search_yaml_only":"YAML only","no_room":"No room","no_custom_views":"No custom views created","no_custom_cards":"No custom cards created","no_custom_badges":"No custom badges created","no_areas":"No areas available","no_entities_in_area":"No entities found in this area","loading_entities":"Loading entities...","new_view":"New View","new_card":"New Card","title_placeholder":"Title","path_placeholder":"Path (e.g. my-view)","yaml_placeholder":"Paste YAML code here...","card_title_placeholder":"Dashboard heading (optional)","card_editor_title_label":"Editor name","card_editor_title_placeholder":"Card name (editor only)","card_dashboard_title_label":"Dashboard heading","card_editor_title_help":"This name only helps with finding and sorting the card. It is not shown on the dashboard.","edit_card_with_ha_editor":"Edit card with HA editor","yaml_valid":"YAML valid","area_custom_cards_title":"Custom Cards","area_custom_cards_help":"Custom cards, tiles, and complete sections for this room view. Shown in addition to the automatic sections.","area_custom_card_new":"New card/section","area_custom_card_add":"+ Add card/section","area_custom_card_add_yaml":"+ Add YAML/section","area_custom_card_add_picker":"+ Choose card","area_custom_card_position":"Placement","area_custom_card_position_top":"Top (before auto sections)","area_custom_card_position_bottom":"Bottom (after auto sections)","area_custom_card_mode":"Input mode","area_custom_card_mode_yaml":"YAML (free-form)","area_custom_card_mode_tile":"Tile (guided)","area_custom_card_mode_section":"Section (YAML)","area_custom_card_entity":"Entity","area_custom_card_entity_select":"Select entity...","move_up":"Move up","move_down":"Move down","domain_lights":"Lighting","domain_climate":"Climate","domain_covers":"Blinds & Covers","domain_covers_curtain":"Curtains","domain_covers_window":"Windows, Doors & Gates","domain_media_player":"Media","domain_scenes":"Scenes","domain_vacuum":"Vacuums and lawn mowers","domain_fan":"Fans","domain_switches":"Switches","domain_locks":"Locks","domain_badges":"Room Badges","badges_additional":"Additional Badges","badges_add":"Add","badges_select_entity":"Select entity...","badges_remove":"Remove","badges_show_name":"Show entity name on badge","badges_name_short":"Name","weather_start_order":"Weather Start Layout Order","weather_start_order_desc":"Drag and drop the blocks to set their order on the weather start page. Hidden blocks are preserved.","weather_start_stack_warning":"Several blocks are appended to the same column. Check the resulting height on mobile devices.","weather_start_responsive_warning":"{count} nested grids use fixed columns. Prefer grid_options for responsive layouts.","weather_start_block_expand":"Customize block","weather_start_block_yaml":"Custom YAML (replaces default content)","weather_start_block_yaml_desc":"Enter one or more card configs as YAML. If set, replaces the auto-generated content of this block.","weather_start_card_yaml_desc":"Edit the card YAML, for example entity ID, name, icon, color, or other Lovelace options.","weather_start_section_cards_desc":"Edit the cards in this section. The section itself is placed in the layout order.","weather_start_add_content_desc":"Add content to the weather start page:","weather_start_add_card":"+ Card on start page","weather_start_add_summaries":"+ Summaries","weather_start_add_section":"+ Section on start page","weather_start_add_area":"Add area...","weather_start_add_floor":"Add floor...","weather_start_summary_size":"Size:","weather_start_summary_size_mini":"Small","weather_start_summary_size_normal":"Normal","weather_start_stack_with_previous":"Show below previous block in the same column","weather_start_block_title":"Heading","weather_start_block_title_placeholder":"Default heading","remove":"Remove","weather_start_block_reset":"Reset to default","weather_sensors_icon":"Icon","weather_sensors_unit":"Unit","weather_sensors_round":"Decimals","weather_sensors_add":"+ Add sensor","no_weather_sensors":"No sensors configured. Use the picker below to add one.","show_pollen_card":"Show pollen card (DWD)","show_pollen_card_desc":"Shows the current pollen load (today + tomorrow) below the weather card. Uses the DWD Pollenflug integration from HACS.","heading_label_overview":"Hide \\"Overview\\" heading","heading_label_summaries":"Hide \\"Summaries\\" heading","heading_label_favorites":"Hide \\"Favorites\\" heading","heading_label_custom_cards":"Hide \\"Custom Cards\\" heading","heading_label_areas":"Hide \\"Areas\\" heading","heading_label_areas_other":"Hide \\"Other Areas\\" heading","heading_label_weather":"Hide \\"Weather\\" heading","heading_label_energy":"Hide \\"Energy\\" heading","show_cameras_in_security":"Show cameras in the security view","show_cameras_in_security_desc":"Shows the cameras as compact still-image cards in the security view (like the Home Assistant security panel). When the camera view is enabled, the cameras heading links straight to it.","security_cameras_visibility":"Cameras shown","security_cameras_visibility_desc":"Unchecked cameras disappear from the security and camera views — room views are unaffected.","security_activity_at_end":"Move activity log to the end","security_extra_entities_desc":"Pick any extra entities (smart appliances, custom sensors, etc.) to show as tiles at the bottom of the Security view. Useful for ovens, cooktops, irons — anything you want a glance at before leaving the house.","show_camera_view":"Enable camera view (CCTV) — experimental","show_camera_view_desc":"Under active development, details may still change. Generates a dedicated camera view: live picture, spotlight, PTZ controls and recordings link (Reolink) per camera.","show_camera_events":"Show LLM Vision event timelines","show_camera_events_desc":"Person/animal/vehicle timelines at the end of the camera view (requires LLM Vision + llmvision-card). Note: the card re-fetches its events on every state change — on busy systems this can create noticeable load.","unavailable_batteries_critical":"Show as critical (alerts you to broken sensors)","unavailable_batteries_good":"Show as good (silences offline devices)","section_light_favorites":"Quick lights","show_window_alerts_on_areas":"Show open window/door icons on area cards","show_window_alerts_on_areas_desc":"Shows an alert icon on the area card whenever a window, door, opening, or garage-door contact sensor in that area is open. Independent of the regular alert toggle above.","show_cameras_in_rooms":"Show cameras in room views","show_cameras_in_rooms_desc":"Shows cameras assigned to the area in the respective room views. Disable to keep cameras out of the dashboard without hiding them globally.","start_camera_stream":"Start live stream","stop_camera_stream":"Stop live stream","hide_unavailable_in_rooms":"Hide unavailable entities in room views","hide_unavailable_in_rooms_desc":"Skips entities whose state is `unavailable` (offline integrations, dead batteries, disconnected ESPHome devices) when building room views. Default on — these entities show up elsewhere (Batteries view, the optional Unavailable alert badge) and tend to be noise in a room view. Disable to surface them in the room view too.","custom_sections_desc":"Declare your own overview section blocks — just copy the complete section code (type: grid + cards) from any dashboard and paste it. Heading (heading card) and visibility are controlled directly in the YAML. The section key works in Section Order, as a target section for custom cards and in visibility rules.","new_section":"New section","custom_section_key_placeholder":"key (e.g. my_morning_routine)","custom_section_yaml_placeholder":"type: grid\\ncards:\\n  - type: heading\\n    heading: Good morning\\n  - type: markdown\\n    content: \\"Coffee is ready!\\"","custom_section_key_required":"Key missing — the section will not be rendered","custom_section_key_conflict":"Key collides with a built-in section","custom_section_key_duplicate":"Key is already used by another custom section","area_custom_sections":"Custom sections in this room","area_custom_sections_desc":"Your own section blocks for this room view — paste complete section code (heading card inside the YAML, optional; visibility via visibility), placed above or below the auto-generated sections. Single cards are wrapped into a section automatically.","custom_section_position_top":"Top (before generated sections)","custom_section_position_bottom":"Bottom (after generated sections)","section_view_visibility":"View visibility","view_visibility_desc":"Choose which users can see each view tab. Without a restriction the view is visible to everyone. This is display logic only, not access control.","view_visibility_no_users":"No persons linked to an HA user found — rules can alternatively be set through the view_visible_users YAML key.","view_visibility_warning":"Important: Only the tab in the header and the entry points on the overview (summary tiles, area cards) are hidden. The view stays reachable via its URL — this is not real access control.","view_visibility_no_person_warning":"User accounts without a linked person cannot be selected here. Once a view or section has a visibility rule, those accounts will no longer see it — without a rule they continue to see everything. Fix: assign a person to the user under Settings → People.","view_visibility_reload_hint":"After changing rules, reload the browser page/tab so they take effect everywhere.","view_visibility_views_title":"Views","view_visibility_sections_title":"Overview sections","view_visibility_sections_desc":"Choose per overview section which users can see it (e.g. weather, energy or your custom sections).","room_pins_first":"Show pins at the top of the room (instead of at the end)","domain_cameras":"Cameras","domain_cameras_disabled_hint":"Disabled globally — enable “Show cameras in room views” first.","domain_ups":"UPS","domain_energy":"Energy sensors","domain_group_disabled_hint":"Globally disabled — enable the toggle in the room settings above.","show_maintenance_summary":"Show maintenance summary — experimental","show_maintenance_summary_desc":"Adds a “Maintenance” tile with its own subview (/maintenance): pending updates, unavailable devices, critical batteries and HA repairs (HA 2026.3+, admins only).","maintenance_visible_users":"Visible to","maintenance_visible_users_desc":"Without a selection every user sees the tile and tab. Options come from persons linked to an HA user. Note: display logic only, not access control — the view stays reachable by URL.","maintenance_visible_users_none":"No persons linked to an HA user found — restrict via the maintenance_visible_users YAML key instead.","show_video_tips":"Show expert tips (videos)","show_video_tips_desc":"Shows up to three matching Dashboard Strategy videos (German language) for your installed integrations in the maintenance view. Static list shipped with the bundle — nothing is fetched or transmitted. Each tip can be dismissed permanently per browser.","show_maintenance_activity":"Show activity log","show_maintenance_activity_desc":"Logbook of the last 24 hours in the sidebar — scoped to the entities this view currently reports (pending updates, unavailable devices, critical batteries). Auto-hides without the logbook integration or when nothing is reported.","section_design":"Design","design_desc":"Theme and background image for all views of the dashboard. Custom views that set their own theme/background in YAML keep their setting.","design_theme_label":"Theme","design_theme_default":"Default (profile/device theme)","diagnostics_no_state":"Registered without a state","diagnostics_disabled":"Disabled entity","diagnostics_unknown":"Unknown state","diagnostics_severity_error":"Errors","diagnostics_severity_warning":"Warnings","diagnostics_severity_info":"Notes","diagnostics_house_mode_unconfigured":"House mode block has no selected entity","diagnostics_layout_reference":"Layout references a missing custom block","diagnostics_room_override":"Custom room layout replaces generated room sections. Room options only apply where the custom layout uses them.","diagnostics_camera_preload":"Camera preloading is enabled and automatic pause explicitly disabled. This may increase load; stream usage has not been measured.","camera_pause_when_hidden":"Pause manual live video when hidden","camera_pause_when_hidden_desc":"Optional for native cameras with the live toggle: pauses outside the viewport or in a hidden browser tab and resumes manually started live video on return. Custom WebRTC cards are unchanged.","diagnostics_navigation_target":"Relative navigation target is not generated by this configuration","diagnostics_redundant_exclusion":"Already hidden by Home Assistant data (label, category, hidden, or controlled by a group) – this list entry is not needed","diagnostics_area_sensor_missing":"Room temperature/humidity sensor from the area settings has no state and the room has no other suitable sensor – no room badge is shown","diagnostics_area_sensor_hidden":"Room temperature/humidity sensor from the area settings is hidden or disabled in Home Assistant and the room has no other suitable sensor – no room badge is shown","diagnostics_area_sensor_override":"Room temperature/humidity sensor is hidden on the dashboard (category or hidden list) but still shown as room badge because it is assigned in the area settings","diagnostics_area_sensor_label":"Room temperature/humidity sensor from the area settings has the no_dboard label (on the entity or its device) and the room has no other suitable sensor – no room badge is shown","diagnostics_area_sensor_replaced":"Room temperature/humidity sensor from the area settings is not shown (no_dboard label, hidden, or no state); another visible sensor of the room is used automatically","diagnostics_option_label_excluded":"Entity has the no_dboard label and is not shown on this dashboard","camera_renderer":"Camera renderer","section_overview_sections":"Overview sections","overview_sections_desc":"Choose which automatically generated sections appear on the overview. A section stays hidden while it has no matching entities.","overview_sections_hint":"The position of each section is set under “Section Order”.","header_badges":"Header badges","overview_blocks":"Overview blocks","lights_options":"Lights view","covers_options":"Covers view","climate_options":"Climate view","battery_options":"Battery view","show_windows_summary":"Show open windows summary","show_windows_summary_desc":"Counts open window contacts and motorized windows separately from the security summary, for example for airing and heating. Opens the security view when it is available.","show_climate_air_quality":"Show humidity and CO₂ alerts","show_climate_air_quality_desc":"Adds a section to the climate view that lists humidity and CO₂ sensors while they are above the thresholds. The section hides itself when everything is fine.","climate_humidity_threshold":"Humidity above","climate_co2_threshold":"CO₂ above","show_energy_view":"Show energy view","show_energy_view_desc":"Adds a view with the highest current power consumers and the power, energy, water and gas sensors of each room.","show_media_section":"Show active media players","show_activity_section":"Show recent activity","quick_actions":"Quick actions","no_quick_actions":"No quick actions added","quick_actions_desc":"Scenes, scripts, buttons and automations run with one tap; other entities are toggled. The bar appears on the overview as soon as one entity is added.","remove_entity":"Remove entity"}}');var o=i.t(a,2);const r=(0,i(3401).Rv)(o,{de:()=>i.e(325).then(()=>i.t(8935,19)),hu:()=>i.e(177).then(()=>i.t(1179,19)),pl:()=>i.e(488).then(()=>i.t(8280,19)),ru:()=>i.e(215).then(()=>i.t(2153,19))})}}]);