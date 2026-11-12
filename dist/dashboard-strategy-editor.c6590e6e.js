"use strict";(self.webpackChunkdashboard_strategy=self.webpackChunkdashboard_strategy||[]).push([[8],{3602(e,t,i){function a(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}i.r(t),i.d(t,{Simon42DashboardStrategyEditor:()=>Kt});var r,o,s,n,c,d,l,_,u,h,p,g,m,f,y,v,b,k,w,x,C,$,S,A,O,E,I,q,P,W,L,D,F,V,K,j,T,M,z,N,Y,H,B,R,U={},G={},Z={};function J(){if(r)return Z;function e(e){return null==e}return r=1,Z.isNothing=e,Z.isObject=function(e){return"object"==typeof e&&null!==e},Z.toArray=function(t){return Array.isArray(t)?t:e(t)?[]:[t]},Z.repeat=function(e,t){let i="";for(let a=0;a<t;a+=1)i+=e;return i},Z.isNegativeZero=function(e){return 0===e&&Number.NEGATIVE_INFINITY===1/e},Z.extend=function(e,t){if(t){const i=Object.keys(t);for(let a=0,r=i.length;a<r;a+=1){const r=i[a];e[r]=t[r]}}return e},Z}function Q(){if(s)return o;function e(e,t){let i="";const a=e.reason||"(unknown reason)";return e.mark?(e.mark.name&&(i+='in "'+e.mark.name+'" '),i+="("+(e.mark.line+1)+":"+(e.mark.column+1)+")",!t&&e.mark.snippet&&(i+="\n\n"+e.mark.snippet),a+" "+i):a}function t(t,i){Error.call(this),this.name="YAMLException",this.reason=t,this.mark=i,this.message=e(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=(new Error).stack||""}return s=1,t.prototype=Object.create(Error.prototype),t.prototype.constructor=t,t.prototype.toString=function(t){return this.name+": "+e(this,t)},o=t}function X(){if(l)return d;l=1;const e=Q(),t=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],i=["scalar","sequence","mapping"];return d=function(a,r){if(r=r||{},Object.keys(r).forEach(function(i){if(-1===t.indexOf(i))throw new e('Unknown option "'+i+'" is met in definition of "'+a+'" YAML type.')}),this.options=r,this.tag=a,this.kind=r.kind||null,this.resolve=r.resolve||function(){return!0},this.construct=r.construct||function(e){return e},this.instanceOf=r.instanceOf||null,this.predicate=r.predicate||null,this.represent=r.represent||null,this.representName=r.representName||null,this.defaultStyle=r.defaultStyle||null,this.multi=r.multi||!1,this.styleAliases=function(e){const t={};return null!==e&&Object.keys(e).forEach(function(i){e[i].forEach(function(e){t[String(e)]=i})}),t}(r.styleAliases||null),-1===i.indexOf(this.kind))throw new e('Unknown kind "'+this.kind+'" is specified for "'+a+'" YAML type.')}}function ee(){if(u)return _;u=1;const e=Q(),t=X();function i(e,t){const i=[];return e[t].forEach(function(e){let t=i.length;i.forEach(function(i,a){i.tag===e.tag&&i.kind===e.kind&&i.multi===e.multi&&(t=a)}),i[t]=e}),i}function a(e){return this.extend(e)}return a.prototype.extend=function(r){let o=[],s=[];if(r instanceof t)s.push(r);else if(Array.isArray(r))s=s.concat(r);else{if(!r||!Array.isArray(r.implicit)&&!Array.isArray(r.explicit))throw new e("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");r.implicit&&(o=o.concat(r.implicit)),r.explicit&&(s=s.concat(r.explicit))}o.forEach(function(i){if(!(i instanceof t))throw new e("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(i.loadKind&&"scalar"!==i.loadKind)throw new e("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(i.multi)throw new e("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),s.forEach(function(i){if(!(i instanceof t))throw new e("Specified list of YAML types (or a single Type object) contains a non-Type object.")});const n=Object.create(a.prototype);return n.implicit=(this.implicit||[]).concat(o),n.explicit=(this.explicit||[]).concat(s),n.compiledImplicit=i(n,"implicit"),n.compiledExplicit=i(n,"explicit"),n.compiledTypeMap=function(){const e={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}};function t(t){t.multi?(e.multi[t.kind].push(t),e.multi.fallback.push(t)):e[t.kind][t.tag]=e.fallback[t.tag]=t}for(let e=0,i=arguments.length;e<i;e+=1)arguments[e].forEach(t);return e}(n.compiledImplicit,n.compiledExplicit),n},_=a}function te(){if(p)return h;p=1;const e=X();return h=new e("tag:yaml.org,2002:str",{kind:"scalar",construct:function(e){return null!==e?e:""}})}function ie(){if(m)return g;m=1;const e=X();return g=new e("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(e){return null!==e?e:[]}})}function ae(){if(y)return f;y=1;const e=X();return f=new e("tag:yaml.org,2002:map",{kind:"mapping",construct:function(e){return null!==e?e:{}}})}function re(){if(b)return v;b=1;const e=ee();return v=new e({explicit:[te(),ie(),ae()]})}function oe(){if(w)return k;w=1;const e=X();return k=new e("tag:yaml.org,2002:null",{kind:"scalar",resolve:function(e){if(null===e)return!0;const t=e.length;return 1===t&&"~"===e||4===t&&("null"===e||"Null"===e||"NULL"===e)},construct:function(){return null},predicate:function(e){return null===e},represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"})}function se(){if(C)return x;C=1;const e=X();return x=new e("tag:yaml.org,2002:bool",{kind:"scalar",resolve:function(e){if(null===e)return!1;const t=e.length;return 4===t&&("true"===e||"True"===e||"TRUE"===e)||5===t&&("false"===e||"False"===e||"FALSE"===e)},construct:function(e){return"true"===e||"True"===e||"TRUE"===e},predicate:function(e){return"[object Boolean]"===Object.prototype.toString.call(e)},represent:{lowercase:function(e){return e?"true":"false"},uppercase:function(e){return e?"TRUE":"FALSE"},camelcase:function(e){return e?"True":"False"}},defaultStyle:"lowercase"})}function ne(){if(S)return $;S=1;const e=J(),t=X();function i(e){return e>=48&&e<=57||e>=65&&e<=70||e>=97&&e<=102}function a(e){return e>=48&&e<=55}function r(e){return e>=48&&e<=57}function o(e){let t=e,i=1,a=t[0];if("-"!==a&&"+"!==a||("-"===a&&(i=-1),t=t.slice(1),a=t[0]),"0"===t)return 0;if("0"===a){if("b"===t[1])return i*parseInt(t.slice(2),2);if("x"===t[1])return i*parseInt(t.slice(2),16);if("o"===t[1])return i*parseInt(t.slice(2),8)}return i*parseInt(t,10)}return $=new t("tag:yaml.org,2002:int",{kind:"scalar",resolve:function(e){if(null===e)return!1;const t=e.length;let s=0,n=!1;if(!t)return!1;let c=e[s];if("-"!==c&&"+"!==c||(c=e[++s]),"0"===c){if(s+1===t)return!0;if(c=e[++s],"b"===c){for(s++;s<t;s++){if(c=e[s],"0"!==c&&"1"!==c)return!1;n=!0}return n&&isFinite(o(e))}if("x"===c){for(s++;s<t;s++){if(!i(e.charCodeAt(s)))return!1;n=!0}return n&&isFinite(o(e))}if("o"===c){for(s++;s<t;s++){if(!a(e.charCodeAt(s)))return!1;n=!0}return n&&isFinite(o(e))}}for(;s<t;s++){if(!r(e.charCodeAt(s)))return!1;n=!0}return!!n&&isFinite(o(e))},construct:function(e){return o(e)},predicate:function(t){return"[object Number]"===Object.prototype.toString.call(t)&&t%1==0&&!e.isNegativeZero(t)},represent:{binary:function(e){return e>=0?"0b"+e.toString(2):"-0b"+e.toString(2).slice(1)},octal:function(e){return e>=0?"0o"+e.toString(8):"-0o"+e.toString(8).slice(1)},decimal:function(e){return e.toString(10)},hexadecimal:function(e){return e>=0?"0x"+e.toString(16).toUpperCase():"-0x"+e.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}})}function ce(){if(O)return A;O=1;const e=J(),t=X(),i=new RegExp("^(?:[-+]?(?:[0-9]+)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),a=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),r=/^[-+]?[0-9]+e/;return A=new t("tag:yaml.org,2002:float",{kind:"scalar",resolve:function(e){return null!==e&&!!i.test(e)&&(!!isFinite(parseFloat(e,10))||a.test(e))},construct:function(e){let t=e.toLowerCase();const i="-"===t[0]?-1:1;return"+-".indexOf(t[0])>=0&&(t=t.slice(1)),".inf"===t?1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:".nan"===t?NaN:i*parseFloat(t,10)},predicate:function(t){return"[object Number]"===Object.prototype.toString.call(t)&&(t%1!=0||e.isNegativeZero(t))},represent:function(t,i){if(isNaN(t))switch(i){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===t)switch(i){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===t)switch(i){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(e.isNegativeZero(t))return"-0.0";const a=t.toString(10);return r.test(a)?a.replace("e",".e"):a},defaultStyle:"lowercase"})}function de(){return I?E:(I=1,E=re().extend({implicit:[oe(),se(),ne(),ce()]}))}function le(){return P?q:(P=1,q=de())}function _e(){if(L)return W;L=1;const e=X(),t=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),i=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");return W=new e("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:function(e){return null!==e&&(null!==t.exec(e)||null!==i.exec(e))},construct:function(e){let a=0,r=null,o=t.exec(e);if(null===o&&(o=i.exec(e)),null===o)throw new Error("Date resolve error");const s=+o[1],n=+o[2]-1,c=+o[3];if(!o[4])return new Date(Date.UTC(s,n,c));const d=+o[4],l=+o[5],_=+o[6];if(o[7]){for(a=o[7].slice(0,3);a.length<3;)a+="0";a=+a}o[9]&&(r=6e4*(60*+o[10]+ +(o[11]||0)),"-"===o[9]&&(r=-r));const u=new Date(Date.UTC(s,n,c,d,l,_,a));return r&&u.setTime(u.getTime()-r),u},instanceOf:Date,represent:function(e){return e.toISOString()}})}function ue(){if(F)return D;F=1;const e=X();return D=new e("tag:yaml.org,2002:merge",{kind:"scalar",resolve:function(e){return"<<"===e||null===e}})}function he(){if(K)return V;K=1;const e=X(),t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";return V=new e("tag:yaml.org,2002:binary",{kind:"scalar",resolve:function(e){if(null===e)return!1;let i=0;const a=e.length,r=t;for(let t=0;t<a;t++){const a=r.indexOf(e.charAt(t));if(!(a>64)){if(a<0)return!1;i+=6}}return i%8==0},construct:function(e){const i=e.replace(/[\r\n=]/g,""),a=i.length,r=t;let o=0;const s=[];for(let e=0;e<a;e++)e%4==0&&e&&(s.push(o>>16&255),s.push(o>>8&255),s.push(255&o)),o=o<<6|r.indexOf(i.charAt(e));const n=a%4*6;return 0===n?(s.push(o>>16&255),s.push(o>>8&255),s.push(255&o)):18===n?(s.push(o>>10&255),s.push(o>>2&255)):12===n&&s.push(o>>4&255),new Uint8Array(s)},predicate:function(e){return"[object Uint8Array]"===Object.prototype.toString.call(e)},represent:function(e){let i="",a=0;const r=e.length,o=t;for(let t=0;t<r;t++)t%3==0&&t&&(i+=o[a>>18&63],i+=o[a>>12&63],i+=o[a>>6&63],i+=o[63&a]),a=(a<<8)+e[t];const s=r%3;return 0===s?(i+=o[a>>18&63],i+=o[a>>12&63],i+=o[a>>6&63],i+=o[63&a]):2===s?(i+=o[a>>10&63],i+=o[a>>4&63],i+=o[a<<2&63],i+=o[64]):1===s&&(i+=o[a>>2&63],i+=o[a<<4&63],i+=o[64],i+=o[64]),i}})}function pe(){if(T)return j;T=1;const e=X(),t=Object.prototype.hasOwnProperty,i=Object.prototype.toString;return j=new e("tag:yaml.org,2002:omap",{kind:"sequence",resolve:function(e){if(null===e)return!0;const a={},r=e;for(let e=0,o=r.length;e<o;e+=1){const o=r[e];let s,n=!1;if("[object Object]"!==i.call(o))return!1;for(s in o)if(t.call(o,s)){if(n)return!1;n=!0}if(!n)return!1;if(t.call(a,s))return!1;Object.defineProperty(a,s,{value:!0})}return!0},construct:function(e){return null!==e?e:[]}})}function ge(){if(z)return M;z=1;const e=X(),t=Object.prototype.toString;return M=new e("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:function(e){if(null===e)return!0;const i=e,a=new Array(i.length);for(let e=0,r=i.length;e<r;e+=1){const r=i[e];if("[object Object]"!==t.call(r))return!1;const o=Object.keys(r);if(1!==o.length)return!1;a[e]=[o[0],r[o[0]]]}return!0},construct:function(e){if(null===e)return[];const t=e,i=new Array(t.length);for(let e=0,a=t.length;e<a;e+=1){const a=t[e],r=Object.keys(a);i[e]=[r[0],a[r[0]]]}return i}})}function me(){if(Y)return N;Y=1;const e=X(),t=Object.prototype.hasOwnProperty;return N=new e("tag:yaml.org,2002:set",{kind:"mapping",resolve:function(e){if(null===e)return!0;const i=e;for(const e in i)if(t.call(i,e)&&null!==i[e])return!1;return!0},construct:function(e){return null!==e?e:{}}})}function fe(){return B?H:(B=1,H=le().extend({implicit:[_e(),ue()],explicit:[he(),pe(),ge(),me()]}))}function ye(){if(R)return G;R=1;const e=J(),t=Q(),i=function(){if(c)return n;c=1;const e=J();function t(e,t,i,a,r){let o="",s="";const n=Math.floor(r/2)-1;return a-t>n&&(o=" ... ",t=a-n+o.length),i-a>n&&(s=" ...",i=a+n-s.length),{str:o+e.slice(t,i).replace(/\t/g,"→")+s,pos:a-t+o.length}}function i(t,i){return e.repeat(" ",i-t.length)+t}return n=function(a,r){if(r=Object.create(r||null),!a.buffer)return null;r.maxLength||(r.maxLength=79),"number"!=typeof r.indent&&(r.indent=1),"number"!=typeof r.linesBefore&&(r.linesBefore=3),"number"!=typeof r.linesAfter&&(r.linesAfter=2);const o=/\r?\n|\r|\0/g,s=[0],n=[];let c,d=-1;for(;c=o.exec(a.buffer);)n.push(c.index),s.push(c.index+c[0].length),a.position<=c.index&&d<0&&(d=s.length-2);d<0&&(d=s.length-1);let l="";const _=Math.min(a.line+r.linesAfter,n.length).toString().length,u=r.maxLength-(r.indent+_+3);for(let o=1;o<=r.linesBefore&&!(d-o<0);o++){const c=t(a.buffer,s[d-o],n[d-o],a.position-(s[d]-s[d-o]),u);l=e.repeat(" ",r.indent)+i((a.line-o+1).toString(),_)+" | "+c.str+"\n"+l}const h=t(a.buffer,s[d],n[d],a.position,u);l+=e.repeat(" ",r.indent)+i((a.line+1).toString(),_)+" | "+h.str+"\n",l+=e.repeat("-",r.indent+_+3+h.pos)+"^\n";for(let o=1;o<=r.linesAfter&&!(d+o>=n.length);o++){const c=t(a.buffer,s[d+o],n[d+o],a.position-(s[d]-s[d+o]),u);l+=e.repeat(" ",r.indent)+i((a.line+o+1).toString(),_)+" | "+c.str+"\n"}return l.replace(/\n$/,"")}}(),a=fe(),r=Object.prototype.hasOwnProperty,o=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,s=/[\x85\u2028\u2029]/,d=/[,\[\]{}]/,l=/^(?:!|!!|![0-9A-Za-z-]+!)$/,_=/^(?:!|[^,\[\]{}])(?:%[0-9a-f]{2}|[0-9a-z\-#;/?:@&=+$,_.!~*'()\[\]])*$/i;function u(e){return Object.prototype.toString.call(e)}function h(e){return 10===e||13===e}function p(e){return 9===e||32===e}function g(e){return 9===e||32===e||10===e||13===e}function m(e){return 44===e||91===e||93===e||123===e||125===e}function f(e){if(e>=48&&e<=57)return e-48;const t=32|e;return t>=97&&t<=102?t-97+10:-1}function y(e){return 120===e?2:117===e?4:85===e?8:0}function v(e){return e>=48&&e<=57?e-48:-1}function b(e){switch(e){case 48:return"\0";case 97:return"";case 98:return"\b";case 116:case 9:return"\t";case 110:return"\n";case 118:return"\v";case 102:return"\f";case 114:return"\r";case 101:return"";case 32:return" ";case 34:return'"';case 47:return"/";case 92:return"\\";case 78:return"";case 95:return" ";case 76:return"\u2028";case 80:return"\u2029";default:return""}}function k(e){return e<=65535?String.fromCharCode(e):String.fromCharCode(55296+(e-65536>>10),56320+(e-65536&1023))}function w(e,t,i){"__proto__"===t?Object.defineProperty(e,t,{configurable:!0,enumerable:!0,writable:!0,value:i}):e[t]=i}const x=new Array(256),C=new Array(256);for(let e=0;e<256;e++)x[e]=b(e)?1:0,C[e]=b(e);function $(e,t){this.input=e,this.filename=t.filename||null,this.schema=t.schema||a,this.onWarning=t.onWarning||null,this.legacy=t.legacy||!1,this.json=t.json||!1,this.listener=t.listener||null,this.maxDepth="number"==typeof t.maxDepth?t.maxDepth:100,this.maxTotalMergeKeys="number"==typeof t.maxTotalMergeKeys?t.maxTotalMergeKeys:1e4,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.depth=0,this.totalMergeKeys=0,this.firstTabInLine=-1,this.documents=[],this.anchorMapTransactions=[]}function S(e,a){const r={name:e.filename,buffer:e.input.slice(0,-1),position:e.position,line:e.line,column:e.position-e.lineStart};return r.snippet=i(r),new t(a,r)}function A(e,t){throw S(e,t)}function O(e,t){e.onWarning&&e.onWarning.call(null,S(e,t))}function E(e,t,i){const a=e.anchorMapTransactions;if(0!==a.length){const i=a[a.length-1];r.call(i,t)||(i[t]={existed:r.call(e.anchorMap,t),value:e.anchorMap[t]})}e.anchorMap[t]=i}function I(e){return{position:e.position,line:e.line,lineStart:e.lineStart,lineIndent:e.lineIndent,firstTabInLine:e.firstTabInLine,tag:e.tag,anchor:e.anchor,kind:e.kind,result:e.result}}function q(e,t){e.position=t.position,e.line=t.line,e.lineStart=t.lineStart,e.lineIndent=t.lineIndent,e.firstTabInLine=t.firstTabInLine,e.tag=t.tag,e.anchor=t.anchor,e.kind=t.kind,e.result=t.result}const P={YAML:function(e,t,i){null!==e.version&&A(e,"duplication of %YAML directive"),1!==i.length&&A(e,"YAML directive accepts exactly one argument");const a=/^([0-9]+)\.([0-9]+)$/.exec(i[0]);null===a&&A(e,"ill-formed argument of the YAML directive");const r=parseInt(a[1],10),o=parseInt(a[2],10);1!==r&&A(e,"unacceptable YAML version of the document"),e.version=i[0],e.checkLineBreaks=o<2,1!==o&&2!==o&&O(e,"unsupported YAML version of the document")},TAG:function(e,t,i){let a;2!==i.length&&A(e,"TAG directive accepts exactly two arguments");const o=i[0];a=i[1],l.test(o)||A(e,"ill-formed tag handle (first argument) of the TAG directive"),r.call(e.tagMap,o)&&A(e,'there is a previously declared suffix for "'+o+'" tag handle'),_.test(a)||A(e,"ill-formed tag prefix (second argument) of the TAG directive");try{a=decodeURIComponent(a)}catch(t){A(e,"tag prefix is malformed: "+a)}e.tagMap[o]=a}};function W(e,t,i,a){if(t<i){const r=e.input.slice(t,i);if(a)for(let t=0,i=r.length;t<i;t+=1){const i=r.charCodeAt(t);9===i||i>=32&&i<=1114111||A(e,"expected valid JSON character")}else o.test(r)&&A(e,"the stream contains non-printable characters");e.result+=r}}function L(e){e.totalMergeKeys++,-1!==e.maxTotalMergeKeys&&e.totalMergeKeys>e.maxTotalMergeKeys&&A(e,"merge keys exceeded maxTotalMergeKeys ("+e.maxTotalMergeKeys+")")}function D(t,i,a,o){e.isObject(a)||A(t,"cannot merge mappings; the provided source object is unacceptable"),L(t);const s=Object.keys(a);for(let e=0,n=s.length;e<n;e+=1){const n=s[e];L(t),r.call(i,n)||(w(i,n,a[n]),o[n]=!0)}}function F(e,t,i,a,o,s,n,c,d){if(Array.isArray(o))for(let t=0,i=(o=Array.prototype.slice.call(o)).length;t<i;t+=1)Array.isArray(o[t])&&A(e,"nested arrays are not supported inside keys"),"object"==typeof o&&"[object Object]"===u(o[t])&&(o[t]="[object Object]");if("object"==typeof o&&"[object Object]"===u(o)&&(o="[object Object]"),o=String(o),null===t&&(t={}),"tag:yaml.org,2002:merge"===a)if(Array.isArray(s)){s.length>100&&A(e,"abnormal merge sequence size");for(let a=0,r=s.length;a<r;a+=1)D(e,t,s[a],i)}else D(e,t,s,i);else e.json||r.call(i,o)||!r.call(t,o)||(e.line=n||e.line,e.lineStart=c||e.lineStart,e.position=d||e.position,A(e,"duplicated mapping key")),w(t,o,s),delete i[o];return t}function V(e){const t=e.input.charCodeAt(e.position);10===t?e.position++:13===t?(e.position++,10===e.input.charCodeAt(e.position)&&e.position++):A(e,"a line break is expected"),e.line+=1,e.lineStart=e.position,e.firstTabInLine=-1}function K(e,t,i){let a=0,r=e.input.charCodeAt(e.position);for(;0!==r;){for(;p(r);)9===r&&-1===e.firstTabInLine&&(e.firstTabInLine=e.position),r=e.input.charCodeAt(++e.position);if(t&&35===r)do{r=e.input.charCodeAt(++e.position)}while(10!==r&&13!==r&&0!==r);if(!h(r))break;for(V(e),r=e.input.charCodeAt(e.position),a++,e.lineIndent=0;32===r;)e.lineIndent++,r=e.input.charCodeAt(++e.position)}return-1!==i&&0!==a&&e.lineIndent<i&&O(e,"deficient indentation"),a}function j(e){let t=e.position,i=e.input.charCodeAt(t);return!(45!==i&&46!==i||i!==e.input.charCodeAt(t+1)||i!==e.input.charCodeAt(t+2)||(t+=3,i=e.input.charCodeAt(t),0!==i&&!g(i)))}function T(t,i){1===i?t.result+=" ":i>1&&(t.result+=e.repeat("\n",i-1))}function M(e,t){const i=e.tag,a=e.anchor,r=[];let o=!1;if(-1!==e.firstTabInLine)return!1;null!==e.anchor&&E(e,e.anchor,r);let s=e.input.charCodeAt(e.position);for(;0!==s&&(-1!==e.firstTabInLine&&(e.position=e.firstTabInLine,A(e,"tab characters must not be used in indentation")),45===s)&&g(e.input.charCodeAt(e.position+1));){if(o=!0,e.position++,K(e,!0,-1)&&e.lineIndent<=t){r.push(null),s=e.input.charCodeAt(e.position);continue}const i=e.line;if(H(e,t,3,!1,!0),r.push(e.result),K(e,!0,-1),s=e.input.charCodeAt(e.position),(e.line===i||e.lineIndent>t)&&0!==s)A(e,"bad indentation of a sequence entry");else if(e.lineIndent<t)break}return!!o&&(e.tag=i,e.anchor=a,e.kind="sequence",e.result=r,!0)}function z(e,t,i){let a,r,o,s;const n=e.tag,c=e.anchor,d={},l=Object.create(null);let _=null,u=null,h=null,m=!1,f=!1;if(-1!==e.firstTabInLine)return!1;null!==e.anchor&&E(e,e.anchor,d);let y=e.input.charCodeAt(e.position);for(;0!==y;){m||-1===e.firstTabInLine||(e.position=e.firstTabInLine,A(e,"tab characters must not be used in indentation"));const v=e.input.charCodeAt(e.position+1),b=e.line;if(63!==y&&58!==y||!g(v)){if(r=e.line,o=e.lineStart,s=e.position,!H(e,i,2,!1,!0))break;if(e.line===b){for(y=e.input.charCodeAt(e.position);p(y);)y=e.input.charCodeAt(++e.position);if(58===y)y=e.input.charCodeAt(++e.position),g(y)||A(e,"a whitespace character is expected after the key-value separator within a block mapping"),m&&(F(e,d,l,_,u,null,r,o,s),_=u=h=null),f=!0,m=!1,a=!1,_=e.tag,u=e.result;else{if(!f)return e.tag=n,e.anchor=c,!0;A(e,"can not read an implicit mapping pair; a colon is missed")}}else{if(!f)return e.tag=n,e.anchor=c,!0;A(e,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else 63===y?(m&&(F(e,d,l,_,u,null,r,o,s),_=u=h=null),f=!0,m=!0,a=!0):m?(m=!1,a=!0):A(e,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),e.position+=1,y=v;if((e.line===b||e.lineIndent>t)&&(m&&(r=e.line,o=e.lineStart,s=e.position),H(e,t,4,!0,a)&&(m?u=e.result:h=e.result),m||(F(e,d,l,_,u,h,r,o,s),_=u=h=null),K(e,!0,-1),y=e.input.charCodeAt(e.position)),(e.line===b||e.lineIndent>t)&&0!==y)A(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return m&&F(e,d,l,_,u,null,r,o,s),f&&(e.tag=n,e.anchor=c,e.kind="mapping",e.result=d),f}function N(e){let t,i,a=!1,o=!1,s=e.input.charCodeAt(e.position);if(33!==s)return!1;null!==e.tag&&A(e,"duplication of a tag property"),s=e.input.charCodeAt(++e.position),60===s?(a=!0,s=e.input.charCodeAt(++e.position)):33===s?(o=!0,t="!!",s=e.input.charCodeAt(++e.position)):t="!";let n=e.position;if(a){do{s=e.input.charCodeAt(++e.position)}while(0!==s&&62!==s);e.position<e.length?(i=e.input.slice(n,e.position),s=e.input.charCodeAt(++e.position)):A(e,"unexpected end of the stream within a verbatim tag")}else{for(;0!==s&&!g(s);)33===s&&(o?A(e,"tag suffix cannot contain exclamation marks"):(t=e.input.slice(n-1,e.position+1),l.test(t)||A(e,"named tag handle cannot contain such characters"),o=!0,n=e.position+1)),s=e.input.charCodeAt(++e.position);i=e.input.slice(n,e.position),d.test(i)&&A(e,"tag suffix cannot contain flow indicator characters")}i&&!_.test(i)&&A(e,"tag name cannot contain such characters: "+i);try{i=decodeURIComponent(i)}catch(t){A(e,"tag name is malformed: "+i)}return a?e.tag=i:r.call(e.tagMap,t)?e.tag=e.tagMap[t]+i:"!"===t?e.tag="!"+i:"!!"===t?e.tag="tag:yaml.org,2002:"+i:A(e,'undeclared tag handle "'+t+'"'),!0}function Y(e){let t=e.input.charCodeAt(e.position);if(38!==t)return!1;null!==e.anchor&&A(e,"duplication of an anchor property"),t=e.input.charCodeAt(++e.position);const i=e.position;for(;0!==t&&!g(t)&&!m(t);)t=e.input.charCodeAt(++e.position);return e.position===i&&A(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(i,e.position),!0}function H(t,i,a,o,s){let n,c,d,l,_,u=1,b=!1,w=!1,$=null;t.depth>=t.maxDepth&&A(t,"nesting exceeded maxDepth ("+t.maxDepth+")"),t.depth+=1,null!==t.listener&&t.listener("open",t),t.tag=null,t.anchor=null,t.kind=null,t.result=null;const S=n=c=4===a||3===a;if(o&&K(t,!0,-1)&&(b=!0,t.lineIndent>i?u=1:t.lineIndent===i?u=0:t.lineIndent<i&&(u=-1)),1===u)for(;;){const e=t.input.charCodeAt(t.position),a=I(t);if(b&&(33===e&&null!==t.tag||38===e&&null!==t.anchor))break;if(!N(t)&&!Y(t))break;null===$&&($=a),K(t,!0,-1)?(b=!0,c=S,t.lineIndent>i?u=1:t.lineIndent===i?u=0:t.lineIndent<i&&(u=-1)):c=!1}if(c&&(c=b||s),1===u||4===a)if(l=1===a||2===a?i:i+1,_=t.position-t.lineStart,1===u)if(c&&(M(t,_)||z(t,_,l))||function(e,t){let i,a,r,o=!0;const s=e.tag;let n;const c=e.anchor;let d,l,_,u;const h=Object.create(null);let p,m,f,y=e.input.charCodeAt(e.position);if(91===y)d=93,u=!1,n=[];else{if(123!==y)return!1;d=125,u=!0,n={}}for(null!==e.anchor&&E(e,e.anchor,n),y=e.input.charCodeAt(++e.position);0!==y;){if(K(e,!0,t),y=e.input.charCodeAt(e.position),y===d)return e.position++,e.tag=s,e.anchor=c,e.kind=u?"mapping":"sequence",e.result=n,!0;o?44===y&&A(e,"expected the node content, but found ','"):A(e,"missed comma between flow collection entries"),m=p=f=null,l=_=!1,63===y&&g(e.input.charCodeAt(e.position+1))&&(l=_=!0,e.position++,K(e,!0,t)),i=e.line,a=e.lineStart,r=e.position,H(e,t,1,!1,!0),m=e.tag,p=e.result,K(e,!0,t),y=e.input.charCodeAt(e.position),!_&&e.line!==i||58!==y||(l=!0,y=e.input.charCodeAt(++e.position),K(e,!0,t),H(e,t,1,!1,!0),f=e.result),u?F(e,n,h,m,p,f,i,a,r):l?n.push(F(e,null,h,m,p,f,i,a,r)):n.push(p),K(e,!0,t),y=e.input.charCodeAt(e.position),44===y?(o=!0,y=e.input.charCodeAt(++e.position)):o=!1}A(e,"unexpected end of the stream within a flow collection")}(t,l))w=!0;else{const i=t.input.charCodeAt(t.position);null!==$&&S&&!c&&124!==i&&62!==i&&function(e,t,i,a){const o=I(e);return function(e){e.anchorMapTransactions.push(Object.create(null))}(e),q(e,t),e.tag=null,e.anchor=null,e.kind=null,e.result=null,z(e,i,a)&&"mapping"===e.kind?(function(e){const t=e.anchorMapTransactions.pop(),i=e.anchorMapTransactions;if(0===i.length)return;const a=i[i.length-1],o=Object.keys(t);for(let e=0,i=o.length;e<i;e+=1){const i=o[e];r.call(a,i)||(a[i]=t[i])}}(e),!0):(function(e){const t=e.anchorMapTransactions.pop(),i=Object.keys(t);for(let a=i.length-1;a>=0;a-=1){const r=t[i[a]];r.existed?e.anchorMap[i[a]]=r.value:delete e.anchorMap[i[a]]}}(e),q(e,o),!1)}(t,$,$.position-$.lineStart,l)||n&&function(t,i){let a,r,o=1,s=!1,n=!1,c=i,d=0,l=!1,_=t.input.charCodeAt(t.position);if(124===_)a=!1;else{if(62!==_)return!1;a=!0}for(t.kind="scalar",t.result="";0!==_;)if(_=t.input.charCodeAt(++t.position),43===_||45===_)1===o?o=43===_?3:2:A(t,"repeat of a chomping mode identifier");else{if(!((r=v(_))>=0))break;0===r?A(t,"bad explicit indentation width of a block scalar; it cannot be less than one"):n?A(t,"repeat of an indentation width identifier"):(c=i+r-1,n=!0)}if(p(_)){do{_=t.input.charCodeAt(++t.position)}while(p(_));if(35===_)do{_=t.input.charCodeAt(++t.position)}while(!h(_)&&0!==_)}for(;0!==_;){for(V(t),t.lineIndent=0,_=t.input.charCodeAt(t.position);(!n||t.lineIndent<c)&&32===_;)t.lineIndent++,_=t.input.charCodeAt(++t.position);if(!n&&t.lineIndent>c&&(c=t.lineIndent),h(_)){d++;continue}if(n||0!==c||A(t,"missing indentation for block scalar"),t.lineIndent<c){3===o?t.result+=e.repeat("\n",s?1+d:d):1===o&&s&&(t.result+="\n");break}a?p(_)?(l=!0,t.result+=e.repeat("\n",s?1+d:d)):l?(l=!1,t.result+=e.repeat("\n",d+1)):0===d?s&&(t.result+=" "):t.result+=e.repeat("\n",d):t.result+=e.repeat("\n",s?1+d:d),s=!0,n=!0,d=0;const i=t.position;for(;!h(_)&&0!==_;)_=t.input.charCodeAt(++t.position);W(t,i,t.position,!1)}return!0}(t,l)||function(e,t){let i,a,r=e.input.charCodeAt(e.position);if(39!==r)return!1;for(e.kind="scalar",e.result="",e.position++,i=a=e.position;0!==(r=e.input.charCodeAt(e.position));)if(39===r){if(W(e,i,e.position,!0),r=e.input.charCodeAt(++e.position),39!==r)return!0;i=e.position,e.position++,a=e.position}else h(r)?(W(e,i,a,!0),T(e,K(e,!1,t)),i=a=e.position):e.position===e.lineStart&&j(e)?A(e,"unexpected end of the document within a single quoted scalar"):(e.position++,p(r)||(a=e.position));A(e,"unexpected end of the stream within a single quoted scalar")}(t,l)||function(e,t){let i,a,r,o=e.input.charCodeAt(e.position);if(34!==o)return!1;for(e.kind="scalar",e.result="",e.position++,i=a=e.position;0!==(o=e.input.charCodeAt(e.position));){if(34===o)return W(e,i,e.position,!0),e.position++,!0;if(92===o){if(W(e,i,e.position,!0),o=e.input.charCodeAt(++e.position),h(o))K(e,!1,t);else if(o<256&&x[o])e.result+=C[o],e.position++;else if((r=y(o))>0){let t=r,i=0;for(;t>0;t--)o=e.input.charCodeAt(++e.position),(r=f(o))>=0?i=(i<<4)+r:A(e,"expected hexadecimal character");e.result+=k(i),e.position++}else A(e,"unknown escape sequence");i=a=e.position}else h(o)?(W(e,i,a,!0),T(e,K(e,!1,t)),i=a=e.position):e.position===e.lineStart&&j(e)?A(e,"unexpected end of the document within a double quoted scalar"):(e.position++,p(o)||(a=e.position))}A(e,"unexpected end of the stream within a double quoted scalar")}(t,l)?w=!0:function(e){let t=e.input.charCodeAt(e.position);if(42!==t)return!1;t=e.input.charCodeAt(++e.position);const i=e.position;for(;0!==t&&!g(t)&&!m(t);)t=e.input.charCodeAt(++e.position);e.position===i&&A(e,"name of an alias node must contain at least one character");const a=e.input.slice(i,e.position);return r.call(e.anchorMap,a)||A(e,'unidentified alias "'+a+'"'),e.result=e.anchorMap[a],K(e,!0,-1),!0}(t)?(w=!0,null===t.tag&&null===t.anchor||A(t,"alias node should not have any properties")):function(e,t,i){let a,r,o,s,n,c;const d=e.kind,l=e.result;let _=e.input.charCodeAt(e.position);if(g(_)||m(_)||35===_||38===_||42===_||33===_||124===_||62===_||39===_||34===_||37===_||64===_||96===_)return!1;if(63===_||45===_){const t=e.input.charCodeAt(e.position+1);if(g(t)||i&&m(t))return!1}for(e.kind="scalar",e.result="",a=r=e.position,o=!1;0!==_;){if(58===_){const t=e.input.charCodeAt(e.position+1);if(g(t)||i&&m(t))break}else if(35===_){if(g(e.input.charCodeAt(e.position-1)))break}else{if(e.position===e.lineStart&&j(e)||i&&m(_))break;if(h(_)){if(s=e.line,n=e.lineStart,c=e.lineIndent,K(e,!1,-1),e.lineIndent>=t){o=!0,_=e.input.charCodeAt(e.position);continue}e.position=r,e.line=s,e.lineStart=n,e.lineIndent=c;break}}o&&(W(e,a,r,!1),T(e,e.line-s),a=r=e.position,o=!1),p(_)||(r=e.position+1),_=e.input.charCodeAt(++e.position)}return W(e,a,r,!1),!!e.result||(e.kind=d,e.result=l,!1)}(t,l,1===a)&&(w=!0,null===t.tag&&(t.tag="?")),null!==t.anchor&&E(t,t.anchor,t.result)}else 0===u&&(w=c&&M(t,_));if(null===t.tag)null!==t.anchor&&E(t,t.anchor,t.result);else if("?"===t.tag){null!==t.result&&"scalar"!==t.kind&&A(t,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+t.kind+'"');for(let e=0,i=t.implicitTypes.length;e<i;e+=1)if(d=t.implicitTypes[e],d.resolve(t.result)){t.result=d.construct(t.result),t.tag=d.tag,null!==t.anchor&&E(t,t.anchor,t.result);break}}else if("!"!==t.tag){if(r.call(t.typeMap[t.kind||"fallback"],t.tag))d=t.typeMap[t.kind||"fallback"][t.tag];else{d=null;const e=t.typeMap.multi[t.kind||"fallback"];for(let i=0,a=e.length;i<a;i+=1)if(t.tag.slice(0,e[i].tag.length)===e[i].tag){d=e[i];break}}d||A(t,"unknown tag !<"+t.tag+">"),null!==t.result&&d.kind!==t.kind&&A(t,"unacceptable node kind for !<"+t.tag+'> tag; it should be "'+d.kind+'", not "'+t.kind+'"'),d.resolve(t.result,t.tag)?(t.result=d.construct(t.result,t.tag),null!==t.anchor&&E(t,t.anchor,t.result)):A(t,"cannot resolve a node with !<"+t.tag+"> explicit tag")}return null!==t.listener&&t.listener("close",t),t.depth-=1,null!==t.tag||null!==t.anchor||w}function B(e){const t=e.position;let i,a=!1;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap=Object.create(null),e.anchorMap=Object.create(null);0!==(i=e.input.charCodeAt(e.position))&&(K(e,!0,-1),i=e.input.charCodeAt(e.position),!(e.lineIndent>0||37!==i));){a=!0,i=e.input.charCodeAt(++e.position);let t=e.position;for(;0!==i&&!g(i);)i=e.input.charCodeAt(++e.position);const o=e.input.slice(t,e.position),s=[];for(o.length<1&&A(e,"directive name must not be less than one character in length");0!==i;){for(;p(i);)i=e.input.charCodeAt(++e.position);if(35===i){do{i=e.input.charCodeAt(++e.position)}while(0!==i&&!h(i));break}if(h(i))break;for(t=e.position;0!==i&&!g(i);)i=e.input.charCodeAt(++e.position);s.push(e.input.slice(t,e.position))}0!==i&&V(e),r.call(P,o)?P[o](e,o,s):O(e,'unknown document directive "'+o+'"')}K(e,!0,-1),0===e.lineIndent&&45===e.input.charCodeAt(e.position)&&45===e.input.charCodeAt(e.position+1)&&45===e.input.charCodeAt(e.position+2)?(e.position+=3,K(e,!0,-1)):a&&A(e,"directives end mark is expected"),H(e,e.lineIndent-1,4,!1,!0),K(e,!0,-1),e.checkLineBreaks&&s.test(e.input.slice(t,e.position))&&O(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&j(e)?46===e.input.charCodeAt(e.position)&&(e.position+=3,K(e,!0,-1)):e.position<e.length-1&&A(e,"end of the stream or a document separator is expected")}function U(e,t){t=t||{},0!==(e=String(e)).length&&(10!==e.charCodeAt(e.length-1)&&13!==e.charCodeAt(e.length-1)&&(e+="\n"),65279===e.charCodeAt(0)&&(e=e.slice(1)));const i=new $(e,t),a=e.indexOf("\0");for(-1!==a&&(i.position=a,A(i,"null byte is not allowed in input")),i.input+="\0";32===i.input.charCodeAt(i.position);)i.lineIndent+=1,i.position+=1;for(;i.position<i.length-1;)B(i);return i.documents}return G.loadAll=function(e,t,i){null!==t&&"object"==typeof t&&void 0===i&&(i=t,t=null);const a=U(e,i);if("function"!=typeof t)return a;for(let e=0,i=a.length;e<i;e+=1)t(a[e])},G.load=function(e,i){const a=U(e,i);if(0!==a.length){if(1===a.length)return a[0];throw new t("expected a single document in the stream, but found more")}},G}var ve,be,ke={};function we(){if(ve)return ke;ve=1;const e=J(),t=Q(),i=fe(),a=Object.prototype.toString,r=Object.prototype.hasOwnProperty,o=65279,s={0:"\\0",7:"\\a",8:"\\b",9:"\\t",10:"\\n",11:"\\v",12:"\\f",13:"\\r",27:"\\e",34:'\\"',92:"\\\\",133:"\\N",160:"\\_",8232:"\\L",8233:"\\P"},n=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],c=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function d(i){let a,r;const o=i.toString(16).toUpperCase();if(i<=255)a="x",r=2;else if(i<=65535)a="u",r=4;else{if(!(i<=4294967295))throw new t("code point within a string may not be greater than 0xFFFFFFFF");a="U",r=8}return"\\"+a+e.repeat("0",r-o.length)+o}function l(t){this.schema=t.schema||i,this.indent=Math.max(1,t.indent||2),this.noArrayIndent=t.noArrayIndent||!1,this.skipInvalid=t.skipInvalid||!1,this.flowLevel=e.isNothing(t.flowLevel)?-1:t.flowLevel,this.styleMap=function(e,t){if(null===t)return{};const i={},a=Object.keys(t);for(let o=0,s=a.length;o<s;o+=1){let s=a[o],n=String(t[s]);"!!"===s.slice(0,2)&&(s="tag:yaml.org,2002:"+s.slice(2));const c=e.compiledTypeMap.fallback[s];c&&r.call(c.styleAliases,n)&&(n=c.styleAliases[n]),i[s]=n}return i}(this.schema,t.styles||null),this.sortKeys=t.sortKeys||!1,this.lineWidth=t.lineWidth||80,this.noRefs=t.noRefs||!1,this.noCompatMode=t.noCompatMode||!1,this.condenseFlow=t.condenseFlow||!1,this.quotingType='"'===t.quotingType?2:1,this.forceQuotes=t.forceQuotes||!1,this.replacer="function"==typeof t.replacer?t.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function _(t,i){const a=e.repeat(" ",i);let r=0,o="";const s=t.length;for(;r<s;){let e;const i=t.indexOf("\n",r);-1===i?(e=t.slice(r),r=s):(e=t.slice(r,i+1),r=i+1),e.length&&"\n"!==e&&(o+=a),o+=e}return o}function u(t,i){return"\n"+e.repeat(" ",t.indent*i)}function h(e){return 32===e||9===e}function p(e){return e>=32&&e<=126||e>=161&&e<=55295&&8232!==e&&8233!==e||e>=57344&&e<=65533&&e!==o||e>=65536&&e<=1114111}function g(e){return p(e)&&e!==o&&13!==e&&10!==e}function m(e,t,i){const a=g(e),r=a&&!h(e);return(i?a:a&&44!==e&&91!==e&&93!==e&&123!==e&&125!==e)&&35!==e&&!(58===t&&!r)||g(t)&&!h(t)&&35===e||58===t&&r}function f(e,t){const i=e.charCodeAt(t);let a;return i>=55296&&i<=56319&&t+1<e.length&&(a=e.charCodeAt(t+1),a>=56320&&a<=57343)?1024*(i-55296)+a-56320+65536:i}function y(e){return/^\n* /.test(e)}function v(e,i,a,r,l){e.dump=function(){if(0===i.length)return 2===e.quotingType?'""':"''";if(!e.noCompatMode&&(-1!==n.indexOf(i)||c.test(i)))return 2===e.quotingType?'"'+i+'"':"'"+i+"'";const u=e.indent*Math.max(1,a),g=-1===e.lineWidth?-1:Math.max(Math.min(e.lineWidth,40),e.lineWidth-u),v=r||e.flowLevel>-1&&a>=e.flowLevel;switch(function(e,t,i,a,r,s,n,c){let d,l=0,_=null,u=!1,g=!1;const v=-1!==a;let b=-1,k=p(w=f(e,0))&&w!==o&&!h(w)&&45!==w&&63!==w&&58!==w&&44!==w&&91!==w&&93!==w&&123!==w&&125!==w&&35!==w&&38!==w&&42!==w&&33!==w&&124!==w&&61!==w&&62!==w&&39!==w&&34!==w&&37!==w&&64!==w&&96!==w&&function(e){return!h(e)&&58!==e}(f(e,e.length-1));var w;if(t||n)for(d=0;d<e.length;l>=65536?d+=2:d++){if(l=f(e,d),!p(l))return 5;k=k&&m(l,_,c),_=l}else{for(d=0;d<e.length;l>=65536?d+=2:d++){if(l=f(e,d),10===l)u=!0,v&&(g=g||d-b-1>a&&" "!==e[b+1],b=d);else if(!p(l))return 5;k=k&&m(l,_,c),_=l}g=g||v&&d-b-1>a&&" "!==e[b+1]}return u||g?i>9&&y(e)?5:n?2===s?5:2:g?4:3:!k||n||r(e)?2===s?5:2:1}(i,v,e.indent,g,function(t){return function(e,t){for(let i=0,a=e.implicitTypes.length;i<a;i+=1)if(e.implicitTypes[i].resolve(t))return!0;return!1}(e,t)},e.quotingType,e.forceQuotes&&!r,l)){case 1:return i;case 2:return"'"+i.replace(/'/g,"''")+"'";case 3:return"|"+b(i,e.indent)+k(_(i,u));case 4:return">"+b(i,e.indent)+k(_(function(e,t){const i=/(\n+)([^\n]*)/g;let a,r,o=function(){let a=e.indexOf("\n");return a=-1!==a?a:e.length,i.lastIndex=a,w(e.slice(0,a),t)}(),s="\n"===e[0]||" "===e[0];for(;r=i.exec(e);){const e=r[1],i=r[2];a=" "===i[0],o+=e+(s||a||""===i?"":"\n")+w(i,t),s=a}return o}(i,g),u));case 5:return'"'+function(e){let t="",i=0;for(let a=0;a<e.length;i>=65536?a+=2:a++){i=f(e,a);const r=s[i];!r&&p(i)?(t+=e[a],i>=65536&&(t+=e[a+1])):t+=r||d(i)}return t}(i)+'"';default:throw new t("impossible error: invalid scalar style")}}()}function b(e,t){const i=y(e)?String(t):"",a="\n"===e[e.length-1];return i+(!a||"\n"!==e[e.length-2]&&"\n"!==e?a?"":"-":"+")+"\n"}function k(e){return"\n"===e[e.length-1]?e.slice(0,-1):e}function w(e,t){if(""===e||" "===e[0])return e;const i=/ [^ ]/g;let a,r,o=0,s=0,n=0,c="";for(;a=i.exec(e);)n=a.index,n-o>t&&(r=s>o?s:n,c+="\n"+e.slice(o,r),o=r+1),s=n;return c+="\n",e.length-o>t&&s>o?c+=e.slice(o,s)+"\n"+e.slice(s+1):c+=e.slice(o),c.slice(1)}function x(e,t,i,a){let r="";const o=e.tag;for(let o=0,s=i.length;o<s;o+=1){let s=i[o];e.replacer&&(s=e.replacer.call(i,String(o),s)),($(e,t+1,s,!0,!0,!1,!0)||void 0===s&&$(e,t+1,null,!0,!0,!1,!0))&&(a&&""===r||(r+=u(e,t)),e.dump&&10===e.dump.charCodeAt(0)?r+="-":r+="- ",r+=e.dump)}e.tag=o,e.dump=r||"[]"}function C(e,i,o){const s=o?e.explicitTypes:e.implicitTypes;for(let n=0,c=s.length;n<c;n+=1){const c=s[n];if((c.instanceOf||c.predicate)&&(!c.instanceOf||"object"==typeof i&&i instanceof c.instanceOf)&&(!c.predicate||c.predicate(i))){if(o?c.multi&&c.representName?e.tag=c.representName(i):e.tag=c.tag:e.tag="?",c.represent){const o=e.styleMap[c.tag]||c.defaultStyle;let s;if("[object Function]"===a.call(c.represent))s=c.represent(i,o);else{if(!r.call(c.represent,o))throw new t("!<"+c.tag+'> tag resolver accepts not "'+o+'" style');s=c.represent[o](i,o)}e.dump=s}return!0}}return!1}function $(e,i,r,o,s,n,c){e.tag=null,e.dump=r,C(e,r,!1)||C(e,r,!0);const d=a.call(e.dump),l=o;o&&(o=e.flowLevel<0||e.flowLevel>i);const _="[object Object]"===d||"[object Array]"===d;let h,p;if(_&&(h=e.duplicates.indexOf(r),p=-1!==h),(null!==e.tag&&"?"!==e.tag||p||2!==e.indent&&i>0)&&(s=!1),p&&e.usedDuplicates[h])e.dump="*ref_"+h;else{if(_&&p&&!e.usedDuplicates[h]&&(e.usedDuplicates[h]=!0),"[object Object]"===d)o&&0!==Object.keys(e.dump).length?(function(e,i,a,r){let o="";const s=e.tag,n=Object.keys(a);if(!0===e.sortKeys)n.sort();else if("function"==typeof e.sortKeys)n.sort(e.sortKeys);else if(e.sortKeys)throw new t("sortKeys must be a boolean or a function");for(let t=0,s=n.length;t<s;t+=1){let s="";r&&""===o||(s+=u(e,i));const c=n[t];let d=a[c];if(e.replacer&&(d=e.replacer.call(a,c,d)),!$(e,i+1,c,!0,!0,!0))continue;const l=null!==e.tag&&"?"!==e.tag||e.dump&&e.dump.length>1024;l&&(e.dump&&10===e.dump.charCodeAt(0)?s+="?":s+="? "),s+=e.dump,l&&(s+=u(e,i)),$(e,i+1,d,!0,l)&&(e.dump&&10===e.dump.charCodeAt(0)?s+=":":s+=": ",s+=e.dump,o+=s)}e.tag=s,e.dump=o||"{}"}(e,i,e.dump,s),p&&(e.dump="&ref_"+h+e.dump)):(function(e,t,i){let a="";const r=e.tag,o=Object.keys(i);for(let r=0,s=o.length;r<s;r+=1){let s="";""!==a&&(s+=", "),e.condenseFlow&&(s+='"');const n=o[r];let c=i[n];e.replacer&&(c=e.replacer.call(i,n,c)),$(e,t,n,!1,!1)&&(e.dump.length>1024&&(s+="? "),s+=e.dump+(e.condenseFlow?'"':"")+":"+(e.condenseFlow?"":" "),$(e,t,c,!1,!1)&&(s+=e.dump,a+=s))}e.tag=r,e.dump="{"+a+"}"}(e,i,e.dump),p&&(e.dump="&ref_"+h+" "+e.dump));else if("[object Array]"===d)o&&0!==e.dump.length?(e.noArrayIndent&&!c&&i>0?x(e,i-1,e.dump,s):x(e,i,e.dump,s),p&&(e.dump="&ref_"+h+e.dump)):(function(e,t,i){let a="";const r=e.tag;for(let r=0,o=i.length;r<o;r+=1){let o=i[r];e.replacer&&(o=e.replacer.call(i,String(r),o)),($(e,t,o,!1,!1)||void 0===o&&$(e,t,null,!1,!1))&&(""!==a&&(a+=","+(e.condenseFlow?"":" ")),a+=e.dump)}e.tag=r,e.dump="["+a+"]"}(e,i,e.dump),p&&(e.dump="&ref_"+h+" "+e.dump));else{if("[object String]"!==d){if("[object Undefined]"===d)return!1;if(e.skipInvalid)return!1;throw new t("unacceptable kind of an object to dump "+d)}"?"!==e.tag&&v(e,e.dump,i,n,l)}if(null!==e.tag&&"?"!==e.tag){let t=encodeURI("!"===e.tag[0]?e.tag.slice(1):e.tag).replace(/!/g,"%21");t="!"===e.tag[0]?"!"+t:"tag:yaml.org,2002:"===t.slice(0,18)?"!!"+t.slice(18):"!<"+t+">",e.dump=t+" "+e.dump}}return!0}function S(e,t){const i=[],a=[];A(e,i,a);const r=a.length;for(let e=0;e<r;e+=1)t.duplicates.push(i[a[e]]);t.usedDuplicates=new Array(r)}function A(e,t,i){if(null!==e&&"object"==typeof e){const a=t.indexOf(e);if(-1!==a)-1===i.indexOf(a)&&i.push(a);else if(t.push(e),Array.isArray(e))for(let a=0,r=e.length;a<r;a+=1)A(e[a],t,i);else{const a=Object.keys(e);for(let r=0,o=a.length;r<o;r+=1)A(e[a[r]],t,i)}}}return ke.dump=function(e,t){const i=new l(t=t||{});i.noRefs||S(e,i);let a=e;return i.replacer&&(a=i.replacer.call({"":a},"",a)),$(i,0,a,!0,!0)?i.dump+"\n":""},ke}const xe=a(function(){if(be)return U;be=1;const e=ye(),t=we();function i(e,t){return function(){throw new Error("Function yaml."+e+" is removed in js-yaml 4. Use yaml."+t+" instead, which is now safe by default.")}}return U.Type=X(),U.Schema=ee(),U.FAILSAFE_SCHEMA=re(),U.JSON_SCHEMA=de(),U.CORE_SCHEMA=le(),U.DEFAULT_SCHEMA=fe(),U.load=e.load,U.loadAll=e.loadAll,U.dump=t.dump,U.YAMLException=Q(),U.types={binary:he(),float:ce(),map:ae(),null:oe(),pairs:ge(),set:me(),timestamp:_e(),bool:se(),int:ne(),merge:ue(),omap:pe(),seq:ie(),str:te()},U.safeLoad=i("safeLoad","load"),U.safeLoadAll=i("safeLoadAll","loadAll"),U.safeDump=i("safeDump","dump"),U}()),{Type:Ce,Schema:$e,FAILSAFE_SCHEMA:Se,JSON_SCHEMA:Ae,CORE_SCHEMA:Oe,DEFAULT_SCHEMA:Ee,load:Ie,loadAll:qe,dump:Pe,YAMLException:We,types:Le,safeLoad:De,safeLoadAll:Fe,safeDump:Ve}=xe;function Ke(e){return(e instanceof Error?e.message.split("\n")[0]:"Ungültiges YAML")||"Ungültiges YAML"}function je(e,t){if(!e.trim())return{parsed_config:void 0};try{const i=xe.load(e);return i&&"object"==typeof i?{parsed_config:i}:{parsed_config:void 0,_yaml_error:t}}catch(e){return{parsed_config:void 0,_yaml_error:Ke(e)}}}var Te=i(6684);const Me=[{type:"tile",name:"Kachel",icon:"mdi:square-rounded",template:'type: tile\nentity: ""\n'},{type:"entities",name:"Entitätsliste",icon:"mdi:format-list-bulleted",template:'type: entities\nentities:\n  - entity: ""\n'},{type:"glance",name:"Glance",icon:"mdi:eye",template:'type: glance\nentities:\n  - entity: ""\n'},{type:"button",name:"Button",icon:"mdi:gesture-tap-button",template:'type: button\nentity: ""\ntap_action:\n  action: toggle\n'},{type:"markdown",name:"Text / Markdown",icon:"mdi:language-markdown",template:'type: markdown\ncontent: "**Text**"\n'},{type:"heading",name:"Überschrift",icon:"mdi:format-header-1",template:'type: heading\nheading: "Überschrift"\nheading_style: title\nicon: mdi:home\n'},{type:"weather-forecast",name:"Wettervorhersage",icon:"mdi:weather-partly-cloudy",template:'type: weather-forecast\nentity: ""\nshow_current: true\nshow_forecast: true\nforecast_type: daily\n'},{type:"gauge",name:"Messanzeige",icon:"mdi:gauge",template:'type: gauge\nentity: ""\nmin: 0\nmax: 100\n'},{type:"thermostat",name:"Thermostat",icon:"mdi:thermostat",template:'type: thermostat\nentity: ""\n'},{type:"media-control",name:"Mediensteuerung",icon:"mdi:play-circle",template:'type: media-control\nentity: ""\n'},{type:"history-graph",name:"Verlaufsgraph",icon:"mdi:chart-line",template:'type: history-graph\nentities:\n  - entity: ""\nhours_to_show: 24\n'},{type:"statistics-graph",name:"Statistikgraph",icon:"mdi:chart-bar",template:'type: statistics-graph\nentities:\n  - entity: ""\nstat_types:\n  - mean\nchart_type: line\nperiod: 5minute\n'},{type:"picture",name:"Bild",icon:"mdi:image",template:'type: picture\nimage: ""\n'},{type:"picture-entity",name:"Entity-Bild",icon:"mdi:image-outline",template:'type: picture-entity\nentity: ""\n'},{type:"map",name:"Karte",icon:"mdi:map",template:'type: map\nentities:\n  - entity: ""\n'},{type:"todo-list",name:"Aufgabenliste",icon:"mdi:checkbox-marked-circle",template:'type: todo-list\nentity: ""\n'},{type:"logbook",name:"Logbuch",icon:"mdi:history",template:'type: logbook\nentity: ""\nhours_to_show: 24\n'},{type:"alarm-panel",name:"Alarmanlage",icon:"mdi:shield-home",template:'type: alarm-panel\nentity: ""\n'},{type:"energy-distribution",name:"Energieverteilung",icon:"mdi:lightning-bolt",template:"type: energy-distribution\n"},{type:"grid",name:"Raster",icon:"mdi:grid",template:"type: grid\ncards: []\n"}];var ze=i(1113),Ne=i(3401),Ye=i(5374);var He=i(8627),Be=i(9526);const Re={hide_unavailable_entities:{kind:"boolean",defaultValue:!1,labelKey:"editor.hide_unavailable_entities",values:[!0,!1]},dense_section_placement:{kind:"boolean",defaultValue:!1,labelKey:"editor.dense_section_placement",values:[!0,!1]},show_light_summary:{kind:"boolean",defaultValue:!0,labelKey:"editor.show_light_summary",values:[!0,!1]},show_covers_summary:{kind:"boolean",defaultValue:!0,labelKey:"editor.show_covers_summary",values:[!0,!1]},show_security_summary:{kind:"boolean",defaultValue:!0,labelKey:"editor.show_security_summary",values:[!0,!1]},show_climate_summary:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_climate_summary",values:[!0,!1]},show_battery_summary:{kind:"boolean",defaultValue:!0,labelKey:"editor.show_battery_summary",values:[!0,!1]},show_person_badges:{kind:"boolean",defaultValue:!0,labelKey:"editor.show_person_badges",values:[!0,!1]},show_unavailable_alert_badge:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_unavailable_alert_badge",values:[!0,!1]},show_now_playing_badge:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_now_playing_badge",values:[!0,!1]},show_sun_badge:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_sun_badge",values:[!0,!1]},show_updates_badge:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_updates_badge",values:[!0,!1]},show_clock_card:{kind:"boolean",defaultValue:!0,labelKey:"editor.show_clock_card",values:[!0,!1]},show_search_card:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_search_card",values:[!0,!1]},show_security_view:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_security_view",values:[!0,!1]},group_security_by_areas:{kind:"boolean",defaultValue:!1,labelKey:"editor.group_security_by_areas",values:[!0,!1]},hide_hidden_areas_in_security:{kind:"boolean",defaultValue:!1,labelKey:"editor.hide_hidden_areas_in_security",values:[!0,!1]},show_security_activity:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_security_activity",values:[!0,!1]},show_light_view:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_light_view",values:[!0,!1]},group_lights_by_floors:{kind:"boolean",defaultValue:!1,labelKey:"editor.group_lights_by_floors",values:[!0,!1]},group_lights_by_areas:{kind:"boolean",defaultValue:!1,labelKey:"editor.group_lights_by_areas",values:[!0,!1]},show_covers_view:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_covers_view",values:[!0,!1]},group_covers_by_floors:{kind:"boolean",defaultValue:!1,labelKey:"editor.group_covers_by_floors",values:[!0,!1]},group_covers_by_areas:{kind:"boolean",defaultValue:!1,labelKey:"editor.group_covers_by_areas",values:[!0,!1]},show_climate_view:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_climate_view",values:[!0,!1]},nested_light_groups:{kind:"boolean",defaultValue:!1,labelKey:"editor.nested_light_groups",values:[!0,!1]},show_partially_open_covers:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_partially_open_covers",values:[!0,!1]},hide_mobile_app_batteries:{kind:"boolean",defaultValue:!1,labelKey:"editor.hide_mobile_app_batteries",values:[!0,!1]},hide_battery_notes_entities:{kind:"boolean",defaultValue:!1,labelKey:"editor.hide_battery_notes_entities",values:[!0,!1]},show_battery_view:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_battery_view",values:[!0,!1]},show_area_in_battery_view:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_area_in_battery_view",values:[!0,!1]},group_batteries_by_areas:{kind:"boolean",defaultValue:!1,labelKey:"editor.group_batteries_by_areas",values:[!0,!1]},favorites_show_state:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_state",values:[!0,!1]},favorites_hide_last_changed:{kind:"boolean",defaultValue:!1,labelKey:"editor.hide_last_changed",values:[!0,!1]},group_by_floors:{kind:"boolean",defaultValue:!1,labelKey:"editor.group_by_floors",values:[!0,!1]},show_switches_on_areas:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_switches_on_areas",values:[!0,!1]},show_alerts_on_areas:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_alerts_on_areas",values:[!0,!1]},show_locks_in_rooms:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_locks_in_rooms",values:[!0,!1]},show_automations_in_rooms:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_automations_in_rooms",values:[!0,!1]},show_scripts_in_rooms:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_scripts_in_rooms",values:[!0,!1]},show_vacuums_section_in_rooms:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_vacuums_section_in_rooms",values:[!0,!1]},show_switches_section_in_rooms:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_switches_section_in_rooms",values:[!0,!1]},show_cover_controls_in_rooms:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_cover_controls_in_rooms",values:[!0,!1]},show_cameras_in_rooms:{kind:"boolean",defaultValue:!0,labelKey:"editor.show_cameras_in_rooms",values:[!0,!1]},camera_live_toggle:{kind:"boolean",defaultValue:!1,labelKey:"editor.camera_live_toggle",values:[!0,!1]},show_energy_in_rooms:{kind:"boolean",defaultValue:!0,labelKey:"editor.show_energy_in_rooms",values:[!0,!1]},show_ups_in_rooms:{kind:"boolean",defaultValue:!0,labelKey:"editor.show_ups_in_rooms",values:[!0,!1]},hide_grouped_climate_members:{kind:"boolean",defaultValue:!0,labelKey:"editor.hide_grouped_climate_members",values:[!0,!1]},show_window_contacts_in_rooms:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_window_contacts_in_rooms",values:[!0,!1]},show_door_contacts_in_rooms:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_door_contacts_in_rooms",values:[!0,!1]},use_default_area_sort:{kind:"boolean",defaultValue:!1,labelKey:"editor.use_default_area_sort",values:[!0,!1]},room_pins_show_state:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_state",values:[!0,!1]},room_pins_hide_last_changed:{kind:"boolean",defaultValue:!1,labelKey:"editor.hide_last_changed",values:[!0,!1]},overview_max_columns:{kind:"select",defaultValue:3,labelKey:"editor.overview_max_columns",values:[1,2,3,4]},overview_area_card_columns:{kind:"select",defaultValue:"full",labelKey:"editor.overview_area_card_columns",values:["full",6,4]},weather_start_weather_mode:{kind:"select",labelKey:"editor.weather_start_weather_mode",values:["full","compact_hourly"]},weather_start_date_card:{kind:"select",defaultValue:"button-card",labelKey:"editor.weather_start_date_card",values:["button-card","markdown"]},battery_critical_threshold:{kind:"number",defaultValue:20,labelKey:"editor.battery_critical_below",min:0,max:100},battery_low_threshold:{kind:"number",defaultValue:50,labelKey:"editor.battery_low_below",min:0,max:100},camera_renderer:{kind:"select",defaultValue:"native",labelKey:"editor.camera_renderer",values:["native","webrtc"]},camera_pause_when_hidden:{kind:"boolean",defaultValue:!1,labelKey:"editor.camera_pause_when_hidden",values:[!0,!1],dependencies:[{option:"camera_renderer",value:"native"},{option:"camera_live_toggle",value:!0}]},show_cctv_view:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_cctv_view",values:[!0,!1],aliases:He.G.show_cctv_view},show_maintenance_view:{kind:"boolean",labelKey:"editor.show_maintenance_view",values:[!0,!1],aliases:He.G.show_maintenance_view},house_mode_entity:{kind:"entity",labelKey:"editor.house_mode_entity"},alarm_entity:{kind:"entity",labelKey:"editor.alarm_entity"},weather_entity:{kind:"entity",labelKey:"editor.weather_entity"},power_badge_entity:{kind:"entity",labelKey:"editor.power_badge_entity"}};function Ue(e){return Re[e]}function Ge(e,t,i){return"weather_start_weather_mode"===e?(0,Be.EB)(t)?"compact_hourly":"full":Ue(e)?.defaultValue??i}var Ze=i(9787),Je=i(5609);const Qe=/^[a-z_]+\.[a-z0-9_]+$/,Xe=new Set(["entity","entity_id","entities","camera_image","room_pin_entities","quick_action_entities","favorites","light_favorites","additional","hidden","temperature_sensor","humidity_sensor"]);class et{analyze(e){return this._analysis&&e===this._config||(this._config=e,this._analysis=function(e){(0,Je.DB)("diagnostics-analysis");const t=[],i=[],a=[],r=new WeakSet,o=e&&"object"==typeof e?e:{},s=new WeakSet,n=(e,i,a)=>{"string"==typeof e&&Qe.test(e)?t.push({entityId:e,path:i,purpose:a}):Array.isArray(e)&&!s.has(e)&&(s.add(e),e.forEach((e,t)=>n(e,`${i}[${t}]`,a)),s.delete(e))},c=(e,t)=>{i.push({code:e,severity:"info",path:t})},d=(e,t,i=0)=>{if(!(!e||"object"!=typeof e||i>50||r.has(e))){if(r.add(e),Array.isArray(e))e.forEach((e,a)=>d(e,`${t}[${a}]`,i+1));else{const r=e;if("custom:advanced-camera-card"===r.type){const e=r.live;!0===e?.preload&&Array.isArray(e.auto_pause)&&0===e.auto_pause.length&&c("camera_preload",t)}for(const[e,o]of Object.entries(r)){if(e.startsWith("_")||"parsed_config"===e&&"string"==typeof r.yaml)continue;const s=t?`${t}.${e}`:e;if("navigation_path"===e&&"string"==typeof o&&/^[a-z][a-z0-9_-]*$/.test(o)&&a.push({path:s,target:o}),"yaml"===e&&"string"==typeof o){(0,Je.DB)("diagnostics-yaml");try{d(xe.load(o),s,i+1)}catch{}}else("entity"===Ue(e)?.kind||Xe.has(e)||e.endsWith("_entity")||e.endsWith("_entities")||e.endsWith("_entity_id"))&&n(o,s,"hidden"===e?"exclusion":"display"),d(o,s,i+1)}}r.delete(e)}};d(e,""),(Array.isArray(o.weather_start_layout_items)?o.weather_start_layout_items:[]).forEach((e,t)=>{if(!e||e.yaml||e.parsed_config)return;const i=`weather_start_layout_items[${t}]`;"house_mode"!==e.type||o.house_mode_entity||c("house_mode_unconfigured",i),"custom_card"!==e.type||o.custom_cards?.some(t=>t.id===e.custom_card_id)||c("layout_reference",i),"custom_section"!==e.type||o.custom_sections?.some(t=>t.id===e.custom_section_id)||c("layout_reference",i)});for(const[e,t]of Object.entries(o.areas_options??{}))t?.view_override&&c("room_override",`areas_options.${e}.view_override`);return{references:t,hints:i,links:a,config:o}}(e)),this._analysis}inspect(e,t){return function(e,t){const i=[...e.hints];if(e.links.length){const a=(0,Ye.V$)(e.config,t);for(const t of e.links)a.has(t.target)||i.push({code:"navigation_target",severity:"warning",path:t.path})}for(const[a,r]of(e.config.weather_start_layout_items??[]).entries())r.yaml||r.parsed_config||("area"===r.type&&r.area_id&&!t.areas[r.area_id]||"floor"===r.type&&r.floor_id&&!t.floors[r.floor_id])&&i.push({code:"layout_reference",severity:"info",path:`weather_start_layout_items[${a}]`});return[...i,...e.references.flatMap(e=>{const i=t.entities[e.entityId],a=t.states[e.entityId];let r;return i?.disabled_by?r="disabled":a?"unavailable"===a.state?r="unavailable":"unknown"!==a.state||/^(button|input_button|event|scene)\./.test(e.entityId)||(r="unknown"):r=i?"no_state":"missing",!r||"exclusion"===e.purpose&&"missing"!==r?[]:[{code:`entity_${r}`,severity:"exclusion"===e.purpose?"info":"missing"===r?"error":"warning",path:e.path,entityId:e.entityId,status:r}]})]}(this.analyze(e),t)}}function tt(e,t){const i=e.entities[t]?.entity_category;return"config"===i||"diagnostic"===i}var it=i(6217),at=i(245),rt=i(2654),ot=i(2563),st=i(880);const nt=[{labelKey:"editor.section_overview",panels:["overview","summaries","overviewSections","favorites","appearance","details","sectionOrder"]},{labelKey:"editor.section_areas_rooms",panels:["areas","areaOptions","roomPins","views"]},{labelKey:"editor.section_advanced",panels:["advanced","customContent"]}],ct={overview:{key:"overview",icon:"mdi:view-dashboard-outline",labelKey:"editor.section_overview"},summaries:{key:"summaries",icon:"mdi:counter",labelKey:"editor.section_summaries"},favorites:{key:"favorites",icon:"mdi:star-outline",labelKey:"editor.section_favorites"},areas:{key:"areas",icon:"mdi:floor-plan",labelKey:"editor.section_areas_rooms"},appearance:{key:"appearance",icon:"mdi:palette-outline",labelKey:"editor.section_overview_details"},details:{key:"details",icon:"mdi:tune-variant",labelKey:"editor.section_summary_details"},areaOptions:{key:"area-options",icon:"mdi:home-cog-outline",labelKey:"editor.section_areas"},roomPins:{key:"room-pins",icon:"mdi:pin-outline",labelKey:"editor.section_room_pins"},views:{key:"views",icon:"mdi:tab",labelKey:"editor.section_views"},advanced:{key:"advanced-options",icon:"mdi:cog-outline",labelKey:"editor.section_advanced_options"},sectionOrder:{key:"section-order",icon:"mdi:sort",labelKey:"editor.section_order"},overviewSections:{key:"overview-sections",icon:"mdi:view-grid-outline",labelKey:"editor.section_overview_sections"},customContent:{key:"custom-content",icon:"mdi:view-grid-plus-outline",labelKey:"editor.section_custom_content"}};function dt(e){const t=ct[e];return{key:t.key,icon:t.icon,label:(0,Ne.kg)(t.labelKey)}}const lt=[Te.AH`
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
`,Te.AH`
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
  `];var _t=i(3534);function ut(e,t,i=!1){const a=Reflect.get(e,t);return i?!1!==a:!0===a}function ht(e,t,i={}){const a=!0===i.defaultOn;return Te.qy`
    ${e.checkbox(i.id??t.replace(/_/g,"-"),(0,Ne.kg)(i.labelKey??`editor.${t}`),ut(e.config,t,a),i=>e.toggle(t,i,a),!0===i.disabled)}
    ${!1===i.description?"":Te.qy`<div class="description">${(0,Ne.kg)(`editor.${t}_desc`)}</div>`}
  `}function pt(e,t){return[...new Set(e.split(",").map(e=>e.trim()).filter(t))]}function gt(e,t){return e.config[t]||[]}function mt(e,t,i){e.update(e=>{i.length>0?e[t]=i:delete e[t]})}function ft(e,t,i){e.entityListState.search[t]=i,e.requestUpdate()}function yt(e){return e.target.closest(".entity-list-item")}function vt(e,t){const{key:i}=t,a=gt(e,i),r=new Map(e.entityOptions().map(e=>[e.entity_id,e])),o=t.withArea?new Map(e.sortedAreas().map(e=>[e.area_id,e.name])):new Map,s=e.entityListState.search[i]??"",n=e.filterEntities(s,!0===t.withArea);return Te.qy`
    <div id=${t.listId} style="margin-bottom: 12px;">
      ${0===a.length?Te.qy`<div class="empty-state">${t.emptyLabel}</div>`:Te.qy`
            <div class="entity-list-container">
              ${a.map(a=>{const s=r.get(a),n=s?.area_id||s?.device_area_id;return Te.qy`
                  <div
                    class="entity-list-item"
                    data-entity-id=${a}
                    draggable="true"
                    @dragstart=${t=>function(e,t){const i=yt(t);i?(i.classList.add("dragging"),e.entityListState.draggedId=i.dataset.entityId||null,t.dataTransfer&&(t.dataTransfer.effectAllowed="move",t.dataTransfer.setData("text/plain",e.entityListState.draggedId||""))):t.preventDefault()}(e,t)}
                    @dragend=${t=>function(e,t){yt(t)?.classList.remove("dragging"),e.entityListState.draggedId=null}(e,t)}
                    @dragover=${t=>function(e,t){t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect="move");const i=t.currentTarget;i.dataset.entityId!==e.entityListState.draggedId&&i.classList.add("drag-over")}(e,t)}
                    @dragleave=${e=>e.currentTarget.classList.remove("drag-over")}
                    @drop=${t=>function(e,t,i){i.stopPropagation(),i.preventDefault();const a=i.currentTarget;a.classList.remove("drag-over");const r=e.entityListState.draggedId,o=a.dataset.entityId;if(!r||!o||r===o)return;const s=[...gt(e,t)],n=s.indexOf(r),c=s.indexOf(o);-1!==n&&-1!==c&&(s.splice(n,1),s.splice(c,0,r),mt(e,t,s))}(e,i,t)}
                  >
                    <span class="drag-icon">&#x2630;</span>
                    <span class="item-info">
                      <span class="item-name">${s?.name||a}</span>
                      <span class="item-entity-id">${a}</span>
                      ${t.withArea?Te.qy`<span class="item-area"
                            >&#x1F4CD; ${n?o.get(n)||n:(0,Ne.kg)("editor.no_room")}</span
                          >`:Te.s6}
                    </span>
                    <button
                      class="btn-remove"
                      aria-label=${(0,Ne.kg)("editor.remove_entity")}
                      @click=${()=>function(e,t,i){mt(e,t,gt(e,t).filter(e=>e!==i))}(e,i,a)}
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
        placeholder=${(0,Ne.kg)("editor.select_entity")+"..."}
        aria-label=${(0,Ne.kg)("editor.select_entity")}
        .value=${s}
        @input=${t=>ft(e,i,t.target.value)}
        @blur=${()=>{setTimeout(()=>ft(e,i,""),200)}}
      />
      ${s.length>=2?Te.qy`
            <div class="entity-search-results">
              ${n.length>0?n.map(t=>Te.qy`
                      <div
                        class="entity-search-result"
                        @mousedown=${a=>{a.preventDefault(),function(e,t,i){const a=gt(e,t);a.includes(i)||mt(e,t,[...a,i])}(e,i,t.entity_id),ft(e,i,"")}}
                      >
                        <span class="entity-search-name">${t.name}</span>
                        <span class="entity-search-id">${t.entity_id}</span>
                      </div>
                    `):Te.qy`<div class="entity-search-no-results">${(0,Ne.kg)("editor.no_results")}</div>`}
            </div>
          `:Te.s6}
    </div>
  `}var bt=i(6256);const kt=[{name:"image",selector:{media:{accept:["image/*"],clearable:!0,image_upload:!0,hide_content_type:!0}}}];function wt(e,t){const i={...e._config};("string"==typeof t?""!==t:t)?i.background={...i.background||{},image:t}:delete i.background,e._fireConfigChanged(i)}function xt(e,t,i){if(!e._config.background?.image)return;const a={...e._config.background};"opacity"===t?"number"==typeof i&&i<100?a.opacity=i:delete a.opacity:"fixed"===i?a.attachment="fixed":delete a.attachment,e._fireConfigChanged({...e._config,background:a})}const Ct=["summaries","favorites","light_favorites","quick_actions","areas","areas_other","weather","energy","plants","agenda","todos","persons","vacuums","maintenance","media","activity","custom_cards","custom_sections"];function $t(e,t){return e?Object.keys(e.states).filter(t).map(t=>({entity_id:t,name:e.states[t].attributes?.friendly_name||t.split(".")[1].replace(/_/g," ")})).sort((e,t)=>e.name.localeCompare(t.name)):[]}function St(e,t,i,a,r){return Te.qy`
    <div class="form-row">
      <label for=${e} class="form-label">${t}</label>
      <select
        id=${e}
        class="form-control"
        @change=${e=>r(e.target.value)}
      >
        ${a.map(e=>Te.qy`<option value=${e.value} ?selected=${e.value===i}>${e.label}</option>`)}
      </select>
    </div>
  `}function At(e,t,i,a,r){return St(i,(0,Ne.kg)(`editor.${t}`),e.config[t]||"",[{value:"",label:a},...r.map(e=>({value:e.entity_id,label:e.name}))],i=>e.update(e=>{i?e[t]=i:delete e[t]}))}function Ot(e,t,i){return Te.qy`
    <ha-textfield
      .value=${(e.config[t]||[]).join(", ")}
      label=${(0,Ne.kg)(`editor.${t}`)}
      helper=${(0,Ne.kg)(`editor.${t}_desc`)}
      @change=${a=>{const r=pt(a.target.value,e=>e.startsWith(i));e.update(e=>{r.length>0?e[t]=r:delete e[t]})}}
    ></ha-textfield>
  `}function Et(e,t,i){return Te.qy`
    <div class="form-row">
      <label for=${i.id} style="min-width: 140px;">${i.label}</label>
      <input
        type="number"
        id=${i.id}
        min=${i.min}
        max=${i.max}
        .value=${String(e.config[t]??i.defaultValue)}
        style="width: 80px;"
        @change=${a=>{const r=parseInt(a.target.value,10);isNaN(r)||r<i.min||r>i.max||e.setOption(t,r,i.defaultValue)}}
      />
      ${i.unit}
    </div>
  `}function It(e,t,i,a,r){return Te.qy`
    <div class="form-row">
      <input type="radio" id=${e} name=${t} ?checked=${a} @change=${r} />
      <label for=${e}>${i}</label>
    </div>
  `}function qt(e,t,i){e.update(e=>{void 0===i?delete e[t]:e[t]=i})}i(4535);const Pt=new Map([["energy",{icon:"mdi:lightning-bolt",labelKey:"stacks.energy"}],["cameras",{icon:"mdi:cctv",labelKey:"stacks.cameras"}],["lights",{icon:"mdi:lightbulb",labelKey:"stacks.lights"}],["locks",{icon:"mdi:lock",labelKey:"stacks.locks"}],["climate",{icon:"mdi:thermostat",labelKey:"stacks.climate"}],["covers",{icon:"mdi:window-shutter",labelKey:"stacks.covers"}],["covers_window",{icon:"mdi:window-open-variant",labelKey:"stacks.covers_window"}],["media",{icon:"mdi:speaker",labelKey:"stacks.media"}],["scenes",{icon:"mdi:palette",labelKey:"stacks.scenes"}],["switches",{icon:"mdi:toggle-switch",labelKey:"stacks.switches"}],["misc",{icon:"mdi:light-switch",labelKey:"stacks.misc"}],["room_pins",{icon:"mdi:pin",labelKey:"stacks.room_pins"}]]);function Wt(e,t){const i=new Set,a=t=>(e[t]?.length??0)>0;return a("lights")&&i.add("lights"),a("locks")&&i.add("locks"),(a("climate")||a("fan"))&&i.add("climate"),(a("covers")||a("covers_curtain"))&&i.add("covers"),a("covers_window")&&i.add("covers_window"),a("media_player")&&i.add("media"),(a("scenes")||a("automations")||a("scripts"))&&i.add("scenes"),a("switches")&&!0===t.show_switches_section_in_rooms&&i.add("switches"),(a("vacuum")||a("switches")&&!0!==t.show_switches_section_in_rooms)&&i.add("misc"),a("energy")&&i.add("energy"),!1!==t.show_cameras_in_rooms&&i.add("cameras"),i.add("room_pins"),i}function Lt(e,t,i,a){const r={...e._config.room_visibility||{}},o={entity:r[t]?.entity||"",state:r[t]?.state||"",[i]:a.trim()};o.entity||o.state?r[t]=o:delete r[t];const s={...e._config};Object.keys(r).length>0?s.room_visibility=r:delete s.room_visibility,e._fireConfigChanged(s)}const Dt="dashboard-strategy-editor-expanded-panels";function Ft(e){try{window.localStorage.setItem(Dt,JSON.stringify([...e]))}catch{}}function Vt(e,t,i){const a=e._expandedPanels.has(t.key);return Te.qy`
    <div class="section panel${a?"":" collapsed"}" data-panel-key=${t.key}>
      <button
        type="button"
        class="panel-header"
        aria-expanded=${a?"true":"false"}
        @click=${()=>function(e,t){e._expandedPanels.has(t)?e._expandedPanels.delete(t):e._expandedPanels.add(t),Ft(e._expandedPanels),e.requestUpdate()}(e,t.key)}
      >
        <ha-icon class="panel-icon" icon=${t.icon}></ha-icon>
        <span class="panel-title">${t.label}</span>
        <ha-icon class="panel-chevron" icon="mdi:chevron-down"></ha-icon>
      </button>
      ${a?Te.qy`<div class="panel-body">${i()}</div>`:Te.s6}
    </div>
  `}class Kt extends Te.WF{constructor(){super(...arguments),this._hass=null,this._isUpdatingConfig=!1,this._config={},this._expandedAreas=new Set,this._expandedGroups=new Map,this._expandedWeatherBlocks=new Set,this._entityListState={search:{},draggedId:null},this._expandedPanels=function(){try{const e=window.localStorage.getItem(Dt);if(!e)return new Set;const t=JSON.parse(e);if(Array.isArray(t))return new Set(t.filter(e=>"string"==typeof e))}catch{}return new Set}(),this._diagnosticsChecked=!1,this._diagnostics=new et,this._openingMeasured=!1,this._areaEntitiesCache=new Map,this._entitySelectOptionsCache=null,this._weatherStartAreaOptionsCache=null,this._weatherStartFloorOptionsCache=null,this._sortedAreasCache=null,this._refDashboards=null,this._refDashboardsLoading=!1,this._draggedElement=null,this._stackDraggedElement=null,this._weatherStartDraggedElement=null,this._cardPickerOpen=!1,this._cardPickerStep="type",this._cardPickerSearch="",this._cardPickerSelectedType="",this._cardPickerYaml="",this._cardPickerHasVisualEditor=!1,this._cardPickerCallback=null,this._cardPickerConfig=null,this._openCardPickerForWeatherStartCard=()=>{this._openCardPicker(e=>{const t=this._createWeatherStartItemId("card"),i=xe.dump(e).trim(),a=[...this._config.custom_cards||[],{id:t,editor_title:"",yaml:i,parsed_config:e}],r=[...this._getWeatherStartLayoutItems(),{id:`custom-card-${t}`,type:"custom_card",custom_card_id:t}],o={...this._config,custom_cards:a,weather_start_layout_items:r};this._config=o,this._fireConfigChanged(o),this._expandedWeatherBlocks=new Set([...this._expandedWeatherBlocks,`custom-card-${t}`])})},this._handleWeatherStartDragStart=e=>{if(!e.target.closest(".drag-handle"))return void e.preventDefault();const t=e.target.closest(".section-order-item");t?(t.classList.add("dragging"),e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t.dataset.wsId||"")),this._weatherStartDraggedElement=t):e.preventDefault()},this._handleWeatherStartDragEnd=e=>{const t=e.target.closest(".section-order-item");t&&t.classList.remove("dragging");const i=this.shadowRoot?.querySelector("#weather-start-order-list");i&&i.querySelectorAll(".section-order-item").forEach(e=>{e.classList.remove("drag-over")}),this._weatherStartDraggedElement=null},this._handleWeatherStartDragOver=e=>{e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move");const t=e.currentTarget;t!==this._weatherStartDraggedElement&&t.classList.add("drag-over")},this._handleWeatherStartDragLeave=e=>{e.currentTarget.classList.remove("drag-over")},this._handleWeatherStartDrop=e=>{e.stopPropagation(),e.preventDefault();const t=e.currentTarget;if(t.classList.remove("drag-over"),!this._weatherStartDraggedElement||this._weatherStartDraggedElement===t)return;const i=this._weatherStartDraggedElement.dataset.wsId,a=t.dataset.wsId;if(!i||!a)return;const r=this._getWeatherStartLayoutItems(),o=r.findIndex(e=>e.id===i),s=r.findIndex(e=>e.id===a);if(-1===o||-1===s)return;const n=[...r];n.splice(o,1),n.splice(s,0,r[o]),this._saveWeatherStartLayoutItems(n)},this._handleStackDragStart=e=>{if(!e.target.closest(".drag-handle"))return void e.preventDefault();const t=e.target.closest(".section-order-item");t?(t.classList.add("dragging"),e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t.dataset.stackKey||"")),this._stackDraggedElement=t):e.preventDefault()},this._handleStackDragEnd=e=>{const t=e.target.closest(".section-order-item");t&&t.classList.remove("dragging"),this.shadowRoot?.querySelectorAll(".section-order-item.drag-over").forEach(e=>e.classList.remove("drag-over")),this._stackDraggedElement=null},this._handleStackDragOver=e=>{e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move");const t=e.currentTarget;t!==this._stackDraggedElement&&t.classList.add("drag-over")},this._handleStackDragLeave=e=>{e.currentTarget.classList.remove("drag-over")},this._handleStackDrop=e=>{e.stopPropagation(),e.preventDefault();const t=e.currentTarget;if(t.classList.remove("drag-over"),!this._stackDraggedElement||this._stackDraggedElement===t)return;const i=this._stackDraggedElement.dataset.stackKey,a=t.dataset.stackKey,r=t.dataset.areaId;if(!i||!a||!r)return;const o=this._getStacksOrder(r),s=o.indexOf(i),n=o.indexOf(a);if(-1===s||-1===n)return;const c=[...o];c.splice(s,1),c.splice(n,0,i),this._updateStacksOrder(r,c)},this._addCustomRefView=()=>{const e=[...this._config.custom_views||[]];e.push({title:"",path:"",icon:"",ref_dashboard:"",ref_view:""});const t={...this._config,custom_views:e};this._config=t,this._fireConfigChanged(t),this._loadRefDashboards()},this._handleDragStart=e=>{if(!e.target.closest(".drag-handle"))return void e.preventDefault();const t=e.target.closest(".area-item");t?(t.classList.add("dragging"),e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t.dataset.areaId||"")),this._draggedElement=t):e.preventDefault()},this._handleDragEnd=e=>{const t=e.target.closest(".area-item");t&&t.classList.remove("dragging");const i=this.shadowRoot.querySelector("#area-list");i&&i.querySelectorAll(".area-item").forEach(e=>{e.classList.remove("drag-over")})},this._handleDragOver=e=>{e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move");const t=e.currentTarget;t!==this._draggedElement&&t.classList.add("drag-over")},this._handleDragLeave=e=>{e.currentTarget.classList.remove("drag-over")},this._handleDrop=e=>{e.stopPropagation(),e.preventDefault();const t=e.currentTarget;if(t.classList.remove("drag-over"),!this._draggedElement||this._draggedElement===t)return;const i=this._draggedElement.dataset.areaId,a=t.dataset.areaId;if(!i||!a)return;const r=this._getAreaOrder(),o=r.indexOf(i),s=r.indexOf(a);if(-1===o||-1===s)return;const n=[...r];n.splice(o,1),n.splice(s,0,i),this._updateAreaOrder(n)},this._openCardPickerForCustomCard=()=>{this._openCardPicker(e=>{const t=xe.dump(e).trim(),i=[...this._config.custom_cards||[]];i.push({editor_title:"",yaml:t,parsed_config:e});const a={...this._config,custom_cards:i};this._config=a,this._fireConfigChanged(a)})},this._handlePickerOverlayClick=e=>{e.target===e.currentTarget&&this._closeCardPicker()},this._weatherLayoutHost=this.createWeatherLayoutHost(),this._optionPanelHost=this.createOptionPanelHost(),this._roomOptionsHost=this.createRoomOptionsHost(),this._customViewsHost=this.createCustomViewsHost(),this._cardPickerHost=this.createCardPickerHost()}connectedCallback(){super.connectedCallback(),(0,Je.sX)("editor-open"),this._openingMeasured=!1,this._unsubscribeLanguage=(0,Ne.P)(()=>this.requestUpdate())}disconnectedCallback(){this._unsubscribeLanguage?.(),this._unsubscribeLanguage=void 0,super.disconnectedCallback()}set hass(e){const t=this._hass;if(this._hass=e,t&&t.language===e.language&&t.locale===e.locale||(0,Ne.rI)(e),!t||t.entities===e.entities&&t.devices===e.devices&&t.language===e.language&&t.locale===e.locale||(this._entitySelectOptionsCache=null),!t||t.areas===e.areas&&t.floors===e.floors||(this._weatherStartAreaOptionsCache=null,this._weatherStartFloorOptionsCache=null,this._sortedAreasCache=null),t&&(0,Ze.Gp)(t,e)){this._areaEntitiesCache.clear();for(const e of this._expandedAreas)this._loadAreaEntities(e)}const i=this.shadowRoot?.querySelector(".card-editor-visual-host");i?.firstElementChild&&(i.firstElementChild.hass=e),((0,Ze.Gp)(t??void 0,e)||this._expandedPanels.has("diagnostics"))&&this.requestUpdate()}setConfig(e){this._isUpdatingConfig||(e=(0,st.l)(e),this._config.areas_display?.hidden===e.areas_display?.hidden&&this._config.areas_display?.order===e.areas_display?.order&&this._config.areas_display?.nav_items===e.areas_display?.nav_items||this._invalidateWeatherStartOptionsCaches(),this._config=e,this._entitySelectOptionsCache=null)}_invalidateWeatherStartOptionsCaches(){this._weatherStartAreaOptionsCache=null,this._weatherStartFloorOptionsCache=null}_getAllEntitiesForSelect(){if(!this._hass)return[];if(this._entitySelectOptionsCache&&this._entitySelectOptionsCache.config===this._config&&this._entitySelectOptionsCache.entities===this._hass.entities&&this._entitySelectOptionsCache.devices===this._hass.devices&&!function(e,t){if(e===t)return!1;const i=Object.keys(t);return i.length!==Object.keys(e).length||i.some(i=>!e[i]||e[i].attributes.friendly_name!==t[i].attributes.friendly_name)}(this._entitySelectOptionsCache.states,this._hass.states))return this._entitySelectOptionsCache.states=this._hass.states,this._entitySelectOptionsCache.options;const e=this._hass.entities||{},t=Object.values(this._hass.devices||{}),i=new Map(t.map(e=>[e.id,e])),a=new Map;t.forEach(e=>{const t=(0,rt.i)(e,e=>i.get(e));t&&a.set(e.id,t)});const r=this._hass,o=new Set(this._diagnostics.analyze(this._config).references.map(e=>e.entityId)),s=[...new Set([...Object.keys(r.states),...o])].filter(e=>function(e,t,i){return!tt(e,t)||i.has(t)}(r,e,o)).map(t=>{const i=r.states[t],o=e[t];let s=o?.area_id;return!s&&o?.device_id&&(s=a.get(o.device_id)??null),{entity_id:t,name:(i?.attributes?.friendly_name||t.split(".")[1].replace(/_/g," "))+(tt(r,t)?` (${(0,Ne.kg)("editor.entity_existing_restricted")})`:""),area_id:s,device_area_id:s}}).sort((e,t)=>e.name.localeCompare(t.name));return this._entitySelectOptionsCache={config:this._config,entities:this._hass.entities,devices:this._hass.devices,states:this._hass.states,options:s},s}_getSortedAreas(){if(!this._hass)return[];if(this._sortedAreasCache?.areas===this._hass.areas)return this._sortedAreasCache.options;const e=Object.values(this._hass.areas).sort((e,t)=>e.name.localeCompare(t.name));return this._sortedAreasCache={areas:this._hass.areas,options:e},e}_getNormalizedAreasDisplay(e=this._config){return this._hass?(0,ot.KA)(Object.values(this._hass.areas),e.areas_display):e.areas_display}_getFilteredEntities(e,t=!1){if(!this._hass||e.length<2)return[];const i=e.toLowerCase(),a=this._getAllEntitiesForSelect().filter(e=>!(t&&!e.area_id&&!e.device_area_id)&&(e.name.toLowerCase().includes(i)||e.entity_id.toLowerCase().includes(i)));return a.sort((e,t)=>{const a=e.name.toLowerCase(),r=t.name.toLowerCase(),o=e.entity_id.toLowerCase(),s=t.entity_id.toLowerCase(),n=a===i||o===i;if(n!==(r===i||s===i))return n?-1:1;const c=a.startsWith(i)||o.startsWith(i)||o.split(".")[1]?.startsWith(i);return c!==(r.startsWith(i)||s.startsWith(i)||s.split(".")[1]?.startsWith(i))?c?-1:1:a.localeCompare(r)}),a.slice(0,21)}render(){if(!this._hass)return Te.s6;const e=this._optionPanelHost;return Te.qy`
      <div class="card-config">
        ${this._renderPanelNavigation()}
        ${Vt(this,{key:"diagnostics",icon:"mdi:clipboard-check-outline",label:(0,Ne.kg)("editor.diagnostics_title")},()=>this._renderDiagnostics())}
        ${Vt(this,dt("overview"),()=>function(e){const t=e.config,i=t.overview_area_card_columns??"full",a=(0,Be.EB)(t)?"compact_hourly":"full",r=Ue("overview_max_columns");return Te.qy`
    <div class="section">
      <div class="section-title">${(0,Ne.kg)("editor.section_overview")}</div>
      ${function(e){const t=e._config.theme||"",i=e._config.background||{},a=i.image,r="number"==typeof i.opacity?i.opacity:100,o=Object.keys(e._hass?.themes.themes||{}).sort((e,t)=>e.localeCompare(t));return Te.qy`
    <div class="form-row">
      <label style="margin-right: 8px; min-width: 120px;">${(0,Ne.kg)("editor.theme")}</label>
      <select
        style="flex: 1;"
        @change=${t=>function(e,t){const i={...e._config};t?i.theme=t:delete i.theme,e._fireConfigChanged(i)}(e,t.target.value.trim())}
      >
        <option value="" ?selected=${!t}>${(0,Ne.kg)("editor.theme_default")}</option>
        ${o.map(e=>Te.qy`<option value=${e} ?selected=${e===t}>${e}</option>`)}
      </select>
    </div>
    <div class="form-row" style="display: block;">
      ${customElements.get("ha-form")?Te.qy`<ha-form
            .hass=${e._hass}
            .data=${{image:a}}
            .schema=${kt}
            .computeLabel=${()=>(0,Ne.kg)("editor.background_image")}
            @value-changed=${t=>wt(e,t.detail.value.image)}
          ></ha-form>`:Te.qy`<label>${(0,Ne.kg)("editor.background_image")}</label>
            <input
              type="text"
              .value=${"string"==typeof a?a:""}
              placeholder="/local/background.jpg"
              @change=${t=>wt(e,t.target.value.trim())}
            />`}
      <div class="description">${(0,Ne.kg)("editor.background_image_desc")}</div>
    </div>
    ${a?Te.qy`<div class="form-row">
            <label style="margin-right: 8px; min-width: 120px;">${(0,Ne.kg)("editor.background_opacity")}</label>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              style="flex: 1;"
              .value=${String(r)}
              @change=${t=>xt(e,"opacity",Number(t.target.value))}
            />
            <span>${r}%</span>
          </div>
          ${e._renderCheckbox("dashboard-background-fixed",(0,Ne.kg)("editor.background_fixed"),"fixed"===i.attachment,t=>xt(e,"attachment",t?"fixed":void 0))}`:Te.s6}
  `}(e.editor)}
      ${At(e,"weather_entity","basic-weather-entity",(0,Ne.kg)("editor.weather_entity_auto"),$t(e.hass,e=>e.startsWith("weather.")))}
      ${St("overview-max-columns",(0,Ne.kg)("editor.overview_max_columns"),String(t.overview_max_columns??3),(r?.values??[1,2,3,4]).map(e=>({value:String(e),label:String(e)})),t=>e.setOption("overview_max_columns",Number(t),3))}
      ${St("overview-area-card-columns",(0,Ne.kg)("editor.overview_area_card_columns"),String(i),[{value:"full",label:(0,Ne.kg)("editor.columns_full")},{value:"6",label:"2"},{value:"4",label:"3"}],t=>e.setOption("overview_area_card_columns","full"===t?"full":Number(t),"full"))}
      ${St("weather-start-weather-mode",(0,Ne.kg)("editor.weather_start_weather_mode"),(0,Be.As)(t),[{value:"full",label:(0,Ne.kg)("editor.weather_mode_full")},{value:"compact_hourly",label:(0,Ne.kg)("editor.weather_mode_compact_hourly")}],t=>e.setOption("weather_start_weather_mode",t,a))}
      ${St("weather-start-date-card",(0,Ne.kg)("editor.weather_start_date_card"),t.weather_start_date_card??"button-card",[{value:"button-card",label:"button-card"},{value:"markdown",label:(0,Ne.kg)("editor.date_card_markdown")}],t=>e.setOption("weather_start_date_card",t,"button-card"))}
    </div>
  `}(e))}
        ${Vt(this,dt("summaries"),()=>function(e){const t={description:!1};return Te.qy`
    <div class="section">
      <div class="section-title">${(0,Ne.kg)("editor.section_summaries")}</div>
      ${ht(e,"show_light_summary",{...t,defaultOn:!0,id:"basic-show-light-summary"})}
      ${ht(e,"show_covers_summary",{...t,defaultOn:!0,id:"basic-show-covers-summary"})}
      ${ht(e,"show_security_summary",{...t,defaultOn:!0,id:"basic-show-security-summary"})}
      ${ht(e,"show_climate_summary",{...t,id:"basic-show-climate-summary"})}
      ${ht(e,"show_battery_summary",{...t,defaultOn:!0,id:"basic-show-battery-summary"})}
      ${ht(e,"show_windows_summary")} ${ht(e,"compact_overview_summaries")}
    </div>
  `}(e))}
        ${Vt(this,dt("overviewSections"),()=>function(e){const t=new Set(e.config.hidden_section_headings||[]);return Te.qy`
    <div class="section">
      <div class="section-title">${(0,Ne.kg)("editor.section_overview_sections")}</div>
      <div class="description description-intro">${(0,Ne.kg)("editor.overview_sections_desc")}</div>
      ${bt.OH.filter(e=>e.toggle).map(t=>{const{flag:i,defaultOn:a}=t.toggle;return Te.qy`
          <div class="form-row">
            <input
              type="checkbox"
              id=${i.replace(/_/g,"-")}
              ?checked=${ut(e.config,i,a)}
              @change=${t=>e.toggle(i,t.target.checked,a)}
            />
            <label for=${i.replace(/_/g,"-")}>
              <ha-icon class="row-icon" icon=${t.icon}></ha-icon>${(0,Ne.kg)(t.labelKey)}
            </label>
          </div>
        `})}
      <div class="description description-intro">${(0,Ne.kg)("editor.overview_sections_hint")}</div>

      ${!0===e.config.show_agenda_section?Ot(e,"agenda_calendar_entities","calendar."):Te.s6}
      ${!0===e.config.show_todos_section?Ot(e,"todos_entities","todo."):Te.s6}

      <div class="subsection-title">${(0,Ne.kg)("editor.hidden_section_headings")}</div>
      <div class="description description-intro">${(0,Ne.kg)("editor.hidden_section_headings_desc")}</div>
      ${Ct.map(i=>e.checkbox(`hide-heading-${i.replace(/_/g,"-")}`,(0,Ne.kg)(`sections.${i}`),t.has(i),t=>e.update(e=>{const a=new Set(e.hidden_section_headings||[]);t?a.add(i):a.delete(i),a.size>0?e.hidden_section_headings=[...a]:delete e.hidden_section_headings})))}
    </div>
  `}(e))}
        ${Vt(this,dt("favorites"),()=>function(e){const t=e.config.light_favorite_entities||[];return Te.qy`
    <div class="section">
      <div class="section-title">${(0,Ne.kg)("editor.section_favorites")}</div>
      ${vt(e,{key:"favorite_entities",listId:"favorites-list",emptyLabel:(0,Ne.kg)("editor.no_favorites")})}
      <div class="description">${(0,Ne.kg)("editor.favorites_desc")}</div>
      ${ht(e,"favorites_show_state",{labelKey:"editor.show_state",description:!1})}
      ${ht(e,"favorites_hide_last_changed",{labelKey:"editor.hide_last_changed",description:!1})}

      <div class="subsection-title">${(0,Ne.kg)("editor.light_favorites")}</div>
      <ha-textfield
        .value=${t.join(", ")}
        label=${(0,Ne.kg)("editor.light_favorites_entities")}
        helper=${(0,Ne.kg)("editor.light_favorites_desc")}
        @change=${t=>{const i=pt(t.target.value,e=>e.startsWith("light."));e.update(e=>{i.length>0?e.light_favorite_entities=i:delete e.light_favorite_entities})}}
      ></ha-textfield>

      <div class="subsection-title">${(0,Ne.kg)("editor.quick_actions")}</div>
      ${vt(e,{key:"quick_action_entities",listId:"quick-actions-list",emptyLabel:(0,Ne.kg)("editor.no_quick_actions")})}
      <div class="description">${(0,Ne.kg)("editor.quick_actions_desc")}</div>
    </div>
  `}(e))}

        <div class="section-divider">
          <div class="section-divider-title">${(0,Ne.kg)("editor.section_areas_rooms")}</div>
        </div>

        ${Vt(this,dt("areas"),()=>this._renderAreasListSection())}
        ${Vt(this,dt("areaOptions"),()=>this._renderAreasSection())}
        ${Vt(this,dt("roomPins"),()=>{return t=e,Te.qy`
    <div class="section">
      <div class="section-title">${(0,Ne.kg)("editor.section_room_pins")}</div>
      ${vt(t,{key:"room_pin_entities",listId:"room-pins-list",emptyLabel:(0,Ne.kg)("editor.no_room_pins"),withArea:!0})}
      <div class="description">${(0,_t._)((0,Ne.kg)("editor.room_pins_desc"))}</div>
      ${ht(t,"room_pins_show_state",{labelKey:"editor.show_state",description:!1})}
      ${ht(t,"room_pins_hide_last_changed",{labelKey:"editor.hide_last_changed",description:!1})}
    </div>
  `;var t})}
        ${Vt(this,dt("views"),()=>this._renderViewsSection())}

        <div class="section-divider">
          <div class="section-divider-title">${(0,Ne.kg)("editor.section_advanced")}</div>
        </div>
        ${Vt(this,dt("appearance"),()=>function(e){const t=e.config,i=!0===t.show_search_card,a="tip"===t.search_card_variant,r=a||void 0!==customElements.get("search-card")&&void 0!==customElements.get("card-tools");return Te.qy`
    <div class="section">
      <div class="section-title">${(0,Ne.kg)("editor.section_overview_details")}</div>

      <div class="subsection-title">${(0,Ne.kg)("editor.header_badges")}</div>
      ${ht(e,"show_person_badges",{defaultOn:!0})}
      ${St("person-badge-layout",(0,Ne.kg)("editor.person_badge_layout"),t.person_badge_layout||"with_state",["minimal","with_state","with_state_and_time"].map(e=>({value:e,label:(0,Ne.kg)(`editor.person_badge_layout_${e}`)})),t=>e.update(e=>{"with_state"===t?delete e.person_badge_layout:e.person_badge_layout=t}))}
      <div class="description">${(0,Ne.kg)("editor.person_badge_layout_desc")}</div>
      ${ht(e,"show_unavailable_alert_badge")} ${ht(e,"show_now_playing_badge")}
      ${ht(e,"show_sun_badge")} ${ht(e,"show_updates_badge")}
      ${At(e,"power_badge_entity","power-badge-entity",(0,Ne.kg)("editor.power_badge_none"),$t(e.hass,t=>t.startsWith("sensor.")&&"power"===e.hass?.states[t]?.attributes?.device_class&&!e.hass?.entities[t]?.entity_category))}
      <div class="description">${(0,Ne.kg)("editor.power_badge_entity_desc")}</div>

      <div class="subsection-title">${(0,Ne.kg)("editor.overview_blocks")}</div>
      ${ht(e,"show_clock_card",{defaultOn:!0})}
      ${At(e,"alarm_entity","alarm-entity",(0,Ne.kg)("editor.alarm_none"),$t(e.hass,e=>e.startsWith("alarm_control_panel.")))}
      <div class="description">${(0,Ne.kg)("editor.alarm_desc")}</div>
      ${At(e,"house_mode_entity","house-mode-entity",(0,Ne.kg)("editor.house_mode_none"),(o=e.hass,$t(o,e=>{if(!e.startsWith("input_select.")&&!e.startsWith("select."))return!1;const t=o?.entities[e]?.entity_category;return"config"!==t&&"diagnostic"!==t})))}
      <div class="description">${(0,Ne.kg)("editor.house_mode_desc")}</div>

      ${ht(e,"show_search_card",{description:!1,disabled:!r})}
      <div class="description">
        ${r?(0,Ne.kg)("editor.show_search_card_desc"):Te.qy`<span>&#x26A0;&#xFE0F; ${(0,_t._)((0,Ne.kg)("editor.show_search_card_missing"))}</span>`}
      </div>
      ${i?St("search-card-variant",(0,Ne.kg)("editor.search_card_variant"),a?"tip":"custom",[{value:"custom",label:(0,Ne.kg)("editor.search_card_variant_custom")},{value:"tip",label:(0,Ne.kg)("editor.search_card_variant_tip")}],t=>e.update(e=>{"tip"===t?e.search_card_variant="tip":delete e.search_card_variant})):Te.s6}
    </div>
  `;var o}(e))}
        ${Vt(this,dt("details"),()=>function(e){const t=e.config,i=t.summaries_columns||2,a="critical"===t.unavailable_batteries_bucket?"critical":"good",r=t.security_extra_entities||[],o=(t,i)=>t?Te.s6:ht(e,i);return Te.qy`
    <div class="section">
      <div class="section-title">${(0,Ne.kg)("editor.section_summary_details")}</div>

      ${It("summaries-2-columns","summaries-columns",(0,Ne.kg)("editor.columns_2"),2===i,()=>qt(e,"summaries_columns",void 0))}
      ${It("summaries-4-columns","summaries-columns",(0,Ne.kg)("editor.columns_4"),4===i,()=>qt(e,"summaries_columns",4))}
      <div class="description">${(0,Ne.kg)("editor.columns_desc")}</div>

      <div class="subsection-title">${(0,Ne.kg)("editor.security_options")}</div>
      ${o(!1!==t.show_security_summary,"show_security_view")}
      ${ht(e,"group_security_by_areas")} ${ht(e,"hide_hidden_areas_in_security")}
      ${ht(e,"show_security_activity")}
      <div class="form-row">
        <label for="security-activity-position">${(0,Ne.kg)("editor.security_activity_position")}</label>
        <select
          id="security-activity-position"
          @change=${t=>qt(e,"security_activity_position","end"===t.target.value?"end":void 0)}
        >
          <option value="start" ?selected=${"end"!==t.security_activity_position}>
            ${(0,Ne.kg)("editor.position_start")}
          </option>
          <option value="end" ?selected=${"end"===t.security_activity_position}>
            ${(0,Ne.kg)("editor.position_end")}
          </option>
        </select>
      </div>
      <ha-textfield
        .value=${r.join(", ")}
        label=${(0,Ne.kg)("editor.security_extra_entities")}
        @change=${t=>{const i=pt(t.target.value,e=>e.includes("."));qt(e,"security_extra_entities",i.length>0?i:void 0)}}
      ></ha-textfield>

      <div class="subsection-title">${(0,Ne.kg)("editor.lights_options")}</div>
      ${o(!1!==t.show_light_summary,"show_light_view")} ${ht(e,"group_lights_by_floors")}
      ${ht(e,"group_lights_by_areas")} ${ht(e,"nested_light_groups")}
      ${e.checkbox("lights-sort-by-name",(0,Ne.kg)("editor.lights_sort_by_name"),"name"===t.lights_sort_by,t=>qt(e,"lights_sort_by",t?"name":void 0))}
      <div class="description">${(0,Ne.kg)("editor.lights_sort_by_name_desc")}</div>

      <div class="subsection-title">${(0,Ne.kg)("editor.covers_options")}</div>
      ${o(!1!==t.show_covers_summary,"show_covers_view")}
      ${ht(e,"group_covers_by_floors")} ${ht(e,"group_covers_by_areas")}
      ${ht(e,"show_partially_open_covers")}

      <div class="subsection-title">${(0,Ne.kg)("editor.climate_options")}</div>
      ${!0===t.show_climate_summary?Te.s6:ht(e,"show_climate_view")}
      ${ht(e,"show_climate_air_quality")}
      ${!0===t.show_climate_air_quality?Te.qy`
            ${Et(e,"climate_humidity_threshold",{id:"climate-humidity-threshold",label:(0,Ne.kg)("editor.climate_humidity_threshold"),defaultValue:65,min:1,max:100,unit:"%"})}
            ${Et(e,"climate_co2_threshold",{id:"climate-co2-threshold",label:(0,Ne.kg)("editor.climate_co2_threshold"),defaultValue:1200,min:400,max:5e3,unit:"ppm"})}
          `:Te.s6}

      <div class="subsection-title">${(0,Ne.kg)("editor.battery_options")}</div>
      ${ht(e,"hide_mobile_app_batteries")} ${ht(e,"hide_battery_notes_entities")}
      ${!1!==t.show_battery_summary?Te.s6:ht(e,"show_battery_view")}
      ${ht(e,"show_area_in_battery_view")} ${ht(e,"group_batteries_by_areas")}

      <div class="option-group-title">${(0,Ne.kg)("editor.battery_thresholds")}</div>
      ${Et(e,"battery_critical_threshold",{id:"battery-critical-threshold",label:(0,Ne.kg)("editor.battery_critical_below"),defaultValue:Ge("battery_critical_threshold",t),min:1,max:99,unit:"%"})}
      ${Et(e,"battery_low_threshold",{id:"battery-low-threshold",label:(0,Ne.kg)("editor.battery_low_below"),defaultValue:Ge("battery_low_threshold",t),min:1,max:99,unit:"%"})}
      <div class="description">${(0,Ne.kg)("editor.battery_thresholds_desc")}</div>

      <div class="option-group-title">${(0,Ne.kg)("editor.unavailable_batteries_bucket")}</div>
      ${It("battery-unavailable-good","battery-unavailable-bucket",(0,Ne.kg)("batteries.good"),"good"===a,()=>qt(e,"unavailable_batteries_bucket",void 0))}
      ${It("battery-unavailable-critical","battery-unavailable-bucket",(0,Ne.kg)("batteries.critical"),"critical"===a,()=>qt(e,"unavailable_batteries_bucket","critical"))}
      <div class="description">${(0,Ne.kg)("editor.unavailable_batteries_bucket_desc")}</div>
    </div>
  `}(e))}
        ${Vt(this,dt("sectionOrder"),()=>this._renderWeatherStartOrderPanel())}
        ${Vt(this,dt("advanced"),()=>{return t=e,Te.qy`
    <div class="section">
      <div class="section-title">${(0,Ne.kg)("editor.section_advanced_options")}</div>
      ${ht(t,"hide_unavailable_entities")} ${ht(t,"dense_section_placement")}
      ${ht(t,"hide_completed_todos")}
    </div>
  `;var t})}
        ${Vt(this,dt("customContent"),()=>this._renderCustomContentSection())}
      </div>
      ${this._cardPickerOpen?this._renderCardPickerOverlay():Te.s6}
    `}_renderPanelNavigation(){return Te.qy`<nav class="panel-navigation" aria-label=${(0,Ne.kg)("editor.panel_navigation")}>
      <label for="panel-navigation-select">${(0,Ne.kg)("editor.panel_navigation")}</label>
      <select
        id="panel-navigation-select"
        @change=${e=>{const t=e.target,i=t.value;t.value="",i&&this._jumpToPanel(i)}}
      >
        <option value="">${(0,Ne.kg)("editor.panel_navigation")}</option>
        ${nt.map(e=>Te.qy`<optgroup label=${(0,Ne.kg)(e.labelKey)}>
              ${e.panels.map(e=>Te.qy`<option value=${e}>${dt(e).label}</option>`)}
            </optgroup>`)}
      </select>
    </nav>`}async _jumpToPanel(e){const t=dt(e);!function(e,t){e._expandedPanels.has(t)||(e._expandedPanels.add(t),Ft(e._expandedPanels),e.requestUpdate())}(this,t.key),await this.updateComplete;const i=this.shadowRoot?.querySelector(`[data-panel-key="${t.key}"] .panel-header`);i?.scrollIntoView({block:"start",behavior:"smooth"}),i?.focus({preventScroll:!0})}async _openDiagnosticLocation(e){const t=dt(e.startsWith("areas_")?"areaOptions":e.startsWith("room_pin")?"roomPins":e.startsWith("weather_start")?"sectionOrder":e.startsWith("custom_")?"customContent":e.includes("favorite")||e.startsWith("quick_action")?"favorites":"overview");this._expandedPanels.add(t.key);const i=e.startsWith("areas_options.")?e.split(".")[1]:void 0;i&&(this._expandedAreas=new Set([...this._expandedAreas,i]),this._areaEntitiesCache.has(i)||this._loadAreaEntities(i)),this.requestUpdate(),await this.updateComplete;const a=[...this.shadowRoot?.querySelectorAll(".panel-header")??[]].find(e=>e.textContent?.includes(t.label)),r=i?[...this.shadowRoot?.querySelectorAll(".area-item")??[]].find(e=>e.dataset.areaId===i):void 0;(r??a)?.scrollIntoView({block:"start",behavior:"smooth"}),i&&e.includes("view_override")&&r?.querySelector("textarea")?.focus()}_renderDiagnostics(){const e=this._diagnosticsChecked&&this._hass?this._diagnostics.inspect(this._config,this._hass):[];return Te.qy`
      <p>${(0,Ne.kg)("editor.diagnostics_help")}</p>
      <button
        type="button"
        @click=${()=>{this._diagnosticsChecked=!0,this.requestUpdate()}}
      >
        ${(0,Ne.kg)("editor.diagnostics_check")}
      </button>
      <div role="status" aria-live="polite">
        ${this._diagnosticsChecked&&!e.length?Te.qy`<p>${(0,Ne.kg)("editor.diagnostics_ok")}</p>`:Te.s6}
      </div>
      ${["error","warning","info"].map(t=>Te.qy` ${e.some(e=>e.severity===t)?Te.qy`<h3>${(0,Ne.kg)("editor.diagnostics_severity_"+t)}</h3>`:Te.s6}
          ${e.filter(e=>e.severity===t).map(e=>Te.qy`<div class="custom-item" style="overflow-wrap:anywhere">
                  <strong>${(0,Ne.kg)("editor.diagnostics_"+(e.status??e.code))}</strong>${e.entityId?Te.qy`: ${e.entityId}`:Te.s6}
                  <div>${e.path}</div>
                  <button type="button" @click=${()=>{this._openDiagnosticLocation(e.path)}}>
                    ${(0,Ne.kg)("editor.diagnostics_open")}
                  </button>
                </div>`)}`)}
    `}_getWeatherStartOrder(){return this._config.weather_start_order||[...it.l]}_isWeatherStartBlockDisabled(e){switch(e){case"clock":return!1===this._config.show_clock_card;case"weather_current":case"weather_daily":return!1===this._config.show_weather;case"weather_hourly":return!1===this._config.show_weather||"compact_hourly"===(0,Be.As)(this._config);case"weather_details":return 0===(this._config.weather_sensors||[]).length&&0===(this._config.pollen_entities||[]).length;case"favorites":return 0===(this._config.favorite_entities||[]).length;case"light_favorites":return 0===(this._config.light_favorite_entities||[]).length;case"alarm":return!this._config.alarm_entity;case"search":return!0!==this._config.show_search_card;case"overview":return!(this._config.custom_cards||[]).some(e=>"overview"===(e.target_section||"custom_cards"));case"energy":return!1===this._config.show_energy;case"plants":return!0!==this._config.show_plants_section;case"agenda":return!0!==this._config.show_agenda_section;case"todos":return!0!==this._config.show_todos_section;case"persons":return!0!==this._config.show_persons_section;case"vacuums":return!0!==this._config.show_vacuums_section;case"maintenance":return!0!==this._config.show_maintenance_section;case"quick_actions":return 0===(this._config.quick_action_entities||[]).length;case"media":return!0!==this._config.show_media_section;case"activity":return!0!==this._config.show_activity_section;case"custom_cards":return 0===(this._config.custom_cards||[]).length;case"custom_sections":return 0===(this._config.custom_sections||[]).length;case"summaries":return!1===this._config.show_light_summary&&!1===this._config.show_covers_summary&&!1===this._config.show_security_summary&&!1===this._config.show_battery_summary&&!0!==this._config.show_climate_summary&&!0!==this._config.show_windows_summary;default:return!1}}_createWeatherStartItemId(e){return`${e}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}_getWeatherStartAreaOptions(){if(!this._hass)return[];const e=this._getNormalizedAreasDisplay(),t=e?.hidden||[],i=e?.order||[],a=t.join("\0"),r=i.join("\0");if(this._weatherStartAreaOptionsCache&&this._weatherStartAreaOptionsCache.areas===this._hass.areas&&this._weatherStartAreaOptionsCache.hiddenKey===a&&this._weatherStartAreaOptionsCache.orderKey===r)return this._weatherStartAreaOptionsCache.options;const o=new Set(t),s=new Map(i.map((e,t)=>[e,t])),n=Object.values(this._hass.areas||{}).filter(e=>!o.has(e.area_id)).sort((e,t)=>{const i=s.get(e.area_id)??-1,a=s.get(t.area_id)??-1;return(i>=0?i:9999)-(a>=0?a:9999)||e.name.localeCompare(t.name)});return this._weatherStartAreaOptionsCache={areas:this._hass.areas,hiddenKey:a,orderKey:r,options:n},n}_getWeatherStartFloorOptions(){if(!this._hass)return[];const e=this._getWeatherStartAreaOptions();if(this._weatherStartFloorOptionsCache&&this._weatherStartFloorOptionsCache.floors===this._hass.floors&&this._weatherStartFloorOptionsCache.areas===e)return this._weatherStartFloorOptionsCache.options;const t=new Set;let i=!1;for(const a of e)a.floor_id?t.add(a.floor_id):i=!0;const a=Object.values(this._hass.floors||{}).filter(e=>t.has(e.floor_id)).sort((e,t)=>(e.level??9999)-(t.level??9999)||e.name.localeCompare(t.name)).map(e=>({floor_id:e.floor_id,name:e.name,icon:e.icon}));return i&&a.push({floor_id:null,name:(0,Ne.kg)("sections.areas_other"),icon:"mdi:home-outline"}),this._weatherStartFloorOptionsCache={floors:this._hass.floors,areas:e,options:a},a}_getCustomCardRef(e,t){return e.id||`legacy-custom-card-${t}`}_getCustomSectionRef(e,t){return e.id||`legacy-custom-section-${t}`}_getCustomCardEditorLabel(e,t){return e?.editor_title||e?.title||t}_getLegacyWeatherStartLayoutItems(){const e=this._getWeatherStartOrder(),t=[];for(const i of e){const e=this._config.weather_start_blocks_config?.[i];if("areas"===i)if(!0===this._config.group_by_floors)for(const e of this._getWeatherStartFloorOptions())t.push({id:`floor-${e.floor_id||"none"}`,type:"floor",floor_id:e.floor_id,title:e.name});else for(const e of this._getWeatherStartAreaOptions())t.push({id:`area-${e.area_id}`,type:"area",area_id:e.area_id});else"custom_cards"===i?(this._config.custom_cards||[]).forEach((e,i)=>{t.push({id:`custom-card-${this._getCustomCardRef(e,i)}`,type:"custom_card",custom_card_id:this._getCustomCardRef(e,i)})}):"custom_sections"===i?(this._config.custom_sections||[]).forEach((e,i)=>{t.push({id:`custom-section-${this._getCustomSectionRef(e,i)}`,type:"custom_section",custom_section_id:this._getCustomSectionRef(e,i)})}):t.push({id:i,type:i,...e?.yaml?{yaml:e.yaml,parsed_config:e.parsed_config,_yaml_error:e._yaml_error}:{}})}return t}_normalizeWeatherStartLayoutItems(e){const t=this._getWeatherStartAreaOptions(),i=new Set(t.map(e=>e.area_id)),a=new Set,r=[],o=(e,t)=>{i.has(e)&&!a.has(e)&&(a.add(e),r.push({...t||{},id:t?.id||`area-${e}`,type:"area",area_id:e}))},s=e=>{const i=t.filter(t=>e.floor_id?t.floor_id===e.floor_id:!t.floor_id);if(0!==i.length){for(const e of i)a.add(e.area_id);r.push({...e})}};for(const i of e)if("area"!==i.type)if("floor"!==i.type)if("areas"!==i.type)r.push({...i});else if(!0===this._config.group_by_floors)for(const e of this._getWeatherStartFloorOptions())s({id:`floor-${e.floor_id||"none"}`,type:"floor",floor_id:e.floor_id,title:e.name});else for(const e of t)o(e.area_id);else s(i);else i.area_id&&o(i.area_id,i);for(const e of t)o(e.area_id);return r}_getWeatherStartLayoutItems(){const e=this._config.weather_start_layout_items?.length?this._config.weather_start_layout_items.map(e=>({...e})):this._getLegacyWeatherStartLayoutItems();return this._normalizeWeatherStartLayoutItems((0,Be.wX)(e,this._config))}_saveWeatherStartLayoutItems(e){return function(e,t){const i=e._normalizeWeatherStartLayoutItems(t),a={...e._config,weather_start_layout_items:i};e._config=a,e._fireConfigChanged(a)}(this._weatherLayoutHost,e)}_toggleWeatherBlockExpanded(e){const t=new Set(this._expandedWeatherBlocks);t.has(e)?t.delete(e):t.add(e),this._expandedWeatherBlocks=t}_parseWeatherStartItemYaml(e){return function(e,t){const i=t.trim();if(!i)return{parsed_config:void 0,_yaml_error:void 0};try{const e=xe.load(i);return Array.isArray(e)||e&&"object"==typeof e?{parsed_config:e}:{parsed_config:void 0,_yaml_error:"YAML must be a card, section, view with sections, or list of cards"}}catch(e){return{parsed_config:void 0,_yaml_error:(e instanceof Error?e.message.split("\n")[0]:"Invalid YAML")||"Invalid YAML"}}}(this._weatherLayoutHost,e)}_updateWeatherStartItemYaml(e,t){return function(e,t,i){const a=e._getWeatherStartLayoutItems().map(a=>{if(a.id!==t)return a;const r={...a,yaml:i},o=e._parseWeatherStartItemYaml(i);return r.parsed_config=o.parsed_config,r._yaml_error=o._yaml_error,i.trim()||(delete r.yaml,delete r.parsed_config,delete r._yaml_error),r});if(a.find(e=>e.id===t&&e._yaml_error))return e._config={...e._config,weather_start_layout_items:a},void e.requestUpdate();e._saveWeatherStartLayoutItems(a)}(this._weatherLayoutHost,e,t)}_resetWeatherStartItemYaml(e){return function(e,t){const i=e._getWeatherStartLayoutItems().map(e=>{if(e.id!==t)return e;const i={...e};return delete i.yaml,delete i.parsed_config,delete i._yaml_error,i});e._saveWeatherStartLayoutItems(i)}(this._weatherLayoutHost,e)}_getWeatherStartCustomCardIndex(e,t=this._config.custom_cards||[]){return"custom_card"!==e.type?-1:t.findIndex((t,i)=>this._getCustomCardRef(t,i)===e.custom_card_id)}_getWeatherStartCustomSectionIndex(e,t=this._config.custom_sections||[]){return"custom_section"!==e.type?-1:t.findIndex((t,i)=>this._getCustomSectionRef(t,i)===e.custom_section_id)}_renderWeatherStartCustomCardEditor(e,t){return function(e,t,i){const a=t._yaml_error?Te.qy`<div style="color: var(--error-color); font-size: 12px; margin-top: 4px;">&#x274C; ${t._yaml_error}</div>`:t.yaml?Te.qy`<div style="color: var(--success-color, green); font-size: 12px; margin-top: 4px;">
          &#x2705; ${(0,Ne.kg)("editor.yaml_valid")}
        </div>`:Te.s6;return Te.qy`
    <label class="form-row" style="margin: 0 0 8px 0;">
      <span style="min-width: 150px;">${(0,Ne.kg)("editor.card_editor_title_label")}</span>
      <input
        type="text"
        style="flex: 1;"
        .value=${t.editor_title||""}
        placeholder=${(0,Ne.kg)("editor.card_editor_title_placeholder")}
        @change=${t=>e._updateCustomCardField(i,"editor_title",t.target.value)}
      />
    </label>
    <div class="description" style="margin: 0 0 8px 0;">${(0,Ne.kg)("editor.card_editor_title_help")}</div>
    <label class="form-row" style="margin: 0 0 8px 0;">
      <span style="min-width: 150px;">${(0,Ne.kg)("editor.card_dashboard_title_label")}</span>
      <input
        type="text"
        style="flex: 1;"
        .value=${t.title||""}
        placeholder=${(0,Ne.kg)("editor.card_title_placeholder")}
        @change=${t=>e._updateCustomCardField(i,"title",t.target.value)}
      />
    </label>
    <div class="description" style="margin: 0 0 6px 0;">${(0,Ne.kg)("editor.weather_start_card_yaml_desc")}</div>
    <textarea
      rows="8"
      style="width:100%;box-sizing:border-box;font-family:monospace;font-size:12px;resize:vertical;"
      placeholder=${(0,Ne.kg)("editor.yaml_placeholder")}
      .value=${t.yaml||""}
      @change=${t=>e._updateCustomCardYaml(i,t.target.value)}
    ></textarea>
    <button class="btn-primary" style="margin-top: 6px;" @click=${()=>e._openCardEditorForCustomCard(i)}>
      ${(0,Ne.kg)("editor.edit_card_with_ha_editor")}
    </button>
    ${a}
  `}(this._weatherLayoutHost,e,t)}_renderWeatherStartCustomSectionEditor(e,t){return function(e,t,i){const a=t.cards||[];return Te.qy`
    <div class="custom-item-row" style="margin-bottom: 8px;">
      <input
        type="text"
        .value=${t.title||""}
        placeholder=${(0,Ne.kg)("editor.custom_section_title_placeholder")}
        style="flex: 2;"
        @change=${t=>e._updateCustomSectionField(i,"title",t.target.value)}
      />
      <input
        type="text"
        .value=${t.icon||""}
        placeholder=${(0,Ne.kg)("editor.custom_section_icon_placeholder")}
        style="flex: 1;"
        @change=${t=>e._updateCustomSectionField(i,"icon",t.target.value)}
      />
    </div>
    <div class="description" style="margin: 0 0 8px 0;">${(0,Ne.kg)("editor.weather_start_section_cards_desc")}</div>
    ${0===a.length?Te.qy`<div class="empty-state">${(0,Ne.kg)("editor.no_custom_cards")}</div>`:a.map((t,a)=>{const r=t._yaml_error?Te.qy`<span style="color: var(--error-color);">&#x274C; ${t._yaml_error}</span>`:t.yaml?Te.qy`<span style="color: var(--success-color, green);">&#x2705; ${(0,Ne.kg)("editor.yaml_valid")}</span>`:Te.s6;return Te.qy`
            <div class="custom-item" style="margin-bottom: 8px;">
              <div class="custom-item-header">
                <strong
                  >${e._getCustomCardEditorLabel(t,`${(0,Ne.kg)("editor.new_card")} ${a+1}`)}</strong
                >
                <button class="btn-remove" @click=${()=>e._removeCardFromSection(i,a)}>
                  &#x2715;
                </button>
              </div>
              <div class="custom-item-fields">
                <label>${(0,Ne.kg)("editor.card_editor_title_label")}</label>
                <input
                  type="text"
                  .value=${t.editor_title||""}
                  placeholder=${(0,Ne.kg)("editor.card_editor_title_placeholder")}
                  @change=${t=>e._updateSectionCardField(i,a,"editor_title",t.target.value)}
                />
                <div class="description" style="margin: 0 0 4px 0;">${(0,Ne.kg)("editor.card_editor_title_help")}</div>
                <label>${(0,Ne.kg)("editor.card_dashboard_title_label")}</label>
                <input
                  type="text"
                  .value=${t.title||""}
                  placeholder=${(0,Ne.kg)("editor.card_title_placeholder")}
                  @change=${t=>e._updateSectionCardField(i,a,"title",t.target.value)}
                />
                <textarea
                  rows="5"
                  placeholder=${(0,Ne.kg)("editor.yaml_placeholder")}
                  .value=${t.yaml||""}
                  style="width: 100%;"
                  @change=${t=>e._updateSectionCardYaml(i,a,t.target.value)}
                ></textarea>
                <button
                  class="btn-primary"
                  style="margin-top: 6px;"
                  @click=${()=>e._openCardEditorForSectionCard(i,a)}
                >
                  ${(0,Ne.kg)("editor.edit_card_with_ha_editor")}
                </button>
                <div class="custom-item-validation">${r}</div>
              </div>
            </div>
          `})}
    <button class="btn-primary" style="margin-top: 4px;" @click=${()=>e._openCardPickerForSection(i)}>
      ${(0,Ne.kg)("editor.add_card_to_section")}
    </button>
  `}(this._weatherLayoutHost,e,t)}_removeWeatherStartItem(e){const t=this._getWeatherStartLayoutItems(),i=t.find(t=>t.id===e),a=t.filter(t=>t.id!==e);if(i){if("custom_card"===i.type){const e=[...this._config.custom_cards||[]],t=this._getWeatherStartCustomCardIndex(i,e);t>=0&&e.splice(t,1);const r={...this._config,weather_start_layout_items:a};return e.length>0?r.custom_cards=e:delete r.custom_cards,this._config=r,void this._fireConfigChanged(r)}if("custom_section"===i.type){const e=[...this._config.custom_sections||[]],t=this._getWeatherStartCustomSectionIndex(i,e);t>=0&&e.splice(t,1);const r={...this._config,weather_start_layout_items:a};return e.length>0?r.custom_sections=e:delete r.custom_sections,this._config=r,void this._fireConfigChanged(r)}this._saveWeatherStartLayoutItems(a)}else this._saveWeatherStartLayoutItems(a)}_addWeatherStartSummaries(){const e=this._getWeatherStartLayoutItems();e.some(e=>"summaries"===e.type)||(e.push({id:this._createWeatherStartItemId("summaries"),type:"summaries",summary_size:"mini"}),this._saveWeatherStartLayoutItems(e),this._expandedWeatherBlocks=new Set([...this._expandedWeatherBlocks,e[e.length-1].id]))}_addWeatherStartArea(e){const t=e.target.value;if(!t)return;const i=this._getWeatherStartLayoutItems();i.push({id:this._createWeatherStartItemId(`area-${t}`),type:"area",area_id:t}),this._saveWeatherStartLayoutItems(i),e.target.value=""}_addWeatherStartFloor(e){const t=e.target.value;if(!t)return;const i="__none__"===t?null:t,a=this._getWeatherStartFloorOptions().find(e=>e.floor_id===i),r=this._getWeatherStartLayoutItems();r.push({id:this._createWeatherStartItemId(`floor-${i||"none"}`),type:"floor",floor_id:i,title:a?.name}),this._saveWeatherStartLayoutItems(r),e.target.value=""}_toggleWeatherStartItemStack(e,t){const i=this._getWeatherStartLayoutItems().map(i=>{if(i.id!==e)return i;const a={...i};return t?a.stack_with_previous=!0:delete a.stack_with_previous,a});this._saveWeatherStartLayoutItems(i)}_weatherStartSummarySizeChanged(e,t){const i=this._getWeatherStartLayoutItems().map(i=>i.id!==e?i:{...i,summary_size:t});this._saveWeatherStartLayoutItems(i)}_addWeatherStartSection(){const e=this._createWeatherStartItemId("section"),t=[...this._config.custom_sections||[],{id:e,title:"",icon:"",cards:[]}],i=[...this._getWeatherStartLayoutItems(),{id:`custom-section-${e}`,type:"custom_section",custom_section_id:e}],a={...this._config,custom_sections:t,weather_start_layout_items:i};this._config=a,this._fireConfigChanged(a),this._expandedWeatherBlocks=new Set([...this._expandedWeatherBlocks,`custom-section-${e}`])}_getWeatherStartItemMeta(e,t,i,a){if("area"===e.type){const i=t.find(t=>t.area_id===e.area_id);return{icon:i?.icon||"mdi:home-outline",label:i?.name||e.area_id||(0,Ne.kg)("sections.areas")}}if("floor"===e.type){const t=this._getWeatherStartFloorOptions().find(t=>t.floor_id===(e.floor_id??null));return{icon:t?.icon||"mdi:floor-plan",label:e.title||t?.name||(0,Ne.kg)("sections.areas")}}if("custom_card"===e.type){const t=i.find((t,i)=>this._getCustomCardRef(t,i)===e.custom_card_id);return{icon:"mdi:cards",label:this._getCustomCardEditorLabel(t,(0,Ne.kg)("editor.new_card"))}}if("custom_section"===e.type){const t=a.find((t,i)=>this._getCustomSectionRef(t,i)===e.custom_section_id);return{icon:t?.icon||"mdi:view-grid-plus-outline",label:t?.title||(0,Ne.kg)("editor.section_custom_sections")}}const r=Kt._weatherStartBlockMeta.get(e.type);return{icon:r?.icon||"mdi:view-dashboard-outline",label:r?(0,Ne.kg)(r.labelKey):e.type}}_isWeatherStartItemDisabled(e,t,i){return!e.parsed_config&&(!!e._yaml_error||("custom_card"===e.type?!t.some((t,i)=>this._getCustomCardRef(t,i)===e.custom_card_id&&t.parsed_config):"custom_section"===e.type?!i.some((t,i)=>this._getCustomSectionRef(t,i)===e.custom_section_id&&(t.cards||[]).some(e=>e.parsed_config)):"floor"===e.type?!this._getWeatherStartAreaOptions().some(t=>e.floor_id?t.floor_id===e.floor_id:!t.floor_id):"summaries"===e.type?this._isWeatherStartBlockDisabled("summaries"):!!Kt._weatherStartBlockMeta.has(e.type)&&this._isWeatherStartBlockDisabled(e.type)))}_countNestedFixedGrids(e,t=0){if(!e||"object"!=typeof e)return 0;if(Array.isArray(e))return e.reduce((e,i)=>e+this._countNestedFixedGrids(i,t),0);const i=e;return(t>0&&"grid"===i.type&&"number"==typeof i.columns?1:0)+Object.values(i).reduce((e,i)=>e+this._countNestedFixedGrids(i,t+1),0)}_renderWeatherStartOrderPanel(){return function(e){const t=e._getWeatherStartLayoutItems(),i=e._getWeatherStartAreaOptions(),a=e._getWeatherStartFloorOptions(),r=e._config.custom_cards||[],o=e._config.custom_sections||[],s=t.some(e=>"summaries"===e.type),n=new Set(t.filter(e=>"area"===e.type&&e.area_id).map(e=>e.area_id));for(const e of t)if("floor"===e.type)for(const t of i)(e.floor_id?t.floor_id!==e.floor_id:t.floor_id)||n.add(t.area_id);const c=i.filter(e=>!n.has(e.area_id));let d=0;const l=t.some(e=>(d=e.stack_with_previous?d+1:0,d>=2)),_=t.map(t=>{const a=e._getWeatherStartItemMeta(t,i,r,o),s=e._getWeatherStartCustomCardIndex(t,r),n=e._getWeatherStartCustomSectionIndex(t,o);return{item:t,...a,disabled:e._isWeatherStartItemDisabled(t,r,o),expanded:e._expandedWeatherBlocks.has(t.id),customCard:s>=0?r[s]:void 0,customCardIndex:s,customSection:n>=0?o[n]:void 0,customSectionIndex:n,fixedGridCount:e._countNestedFixedGrids(t.parsed_config)}});return u={items:_,areas:i,floors:a,unplacedAreas:c,hasSummariesBlock:s,hasLongStackChain:l,renderCustomCardEditor:(t,i)=>e._renderWeatherStartCustomCardEditor(t,i),renderCustomSectionEditor:(t,i)=>e._renderWeatherStartCustomSectionEditor(t,i),onDragStart:e._handleWeatherStartDragStart,onDragEnd:e._handleWeatherStartDragEnd,onDragOver:e._handleWeatherStartDragOver,onDragLeave:e._handleWeatherStartDragLeave,onDrop:e._handleWeatherStartDrop,onToggleExpanded:t=>e._toggleWeatherBlockExpanded(t),onRemove:t=>e._removeWeatherStartItem(t),onSummarySizeChanged:(t,i)=>e._weatherStartSummarySizeChanged(t,i),onStackChanged:(t,i)=>e._toggleWeatherStartItemStack(t,i),onYamlChanged:(t,i)=>e._updateWeatherStartItemYaml(t,i),onResetYaml:t=>e._resetWeatherStartItemYaml(t),onAddCard:e._openCardPickerForWeatherStartCard,onAddSummaries:()=>e._addWeatherStartSummaries(),onAddSection:()=>e._addWeatherStartSection(),onAddArea:t=>e._addWeatherStartArea(t),onAddFloor:t=>e._addWeatherStartFloor(t)},Te.qy`
    <div class="section">
      <div class="section-title">${(0,Ne.kg)("editor.weather_start_order")}</div>
      <div class="description" style="margin-left: 0; margin-bottom: 12px;">
        ${(0,Ne.kg)("editor.weather_start_order_desc")}
      </div>
      ${u.hasLongStackChain?Te.qy`
            <div style="color:var(--warning-color,#f0a000);font-size:12px;margin:0 0 10px 0;">
              ${(0,Ne.kg)("editor.weather_start_stack_warning")}
            </div>
          `:Te.s6}
      <div class="section-order-list" id="weather-start-order-list">
        ${u.items.map(({item:e,icon:t,label:i,disabled:a,expanded:r,customCard:o,customCardIndex:s,customSection:n,customSectionIndex:c,fixedGridCount:d})=>{const l=!!e.yaml,_="area"!==e.type&&"floor"!==e.type;return Te.qy`
              <div>
                <div
                  class="section-order-item ${a?"disabled":""}"
                  data-ws-id=${e.id}
                  draggable="true"
                  @dragstart=${u.onDragStart}
                  @dragend=${u.onDragEnd}
                  @dragover=${u.onDragOver}
                  @dragleave=${u.onDragLeave}
                  @drop=${u.onDrop}
                >
                  <span class="drag-handle" draggable="true">&#x2630;</span>
                  <ha-icon class="section-icon" icon=${t}></ha-icon>
                  <span class="section-label">${i}</span>
                  ${a?Te.qy`<span class="section-hidden-tag">(${(0,Ne.kg)("editor.section_hidden")})</span>`:Te.s6}
                  ${l?Te.qy`<span
                        class="section-hidden-tag"
                        style="background:var(--primary-color);color:#fff;margin-left:4px;"
                        >✎</span
                      >`:Te.s6}
                  <button
                    class="icon-btn"
                    style="margin-left:auto;"
                    title=${(0,Ne.kg)("editor.weather_start_block_expand")}
                    @click=${t=>{t.stopPropagation(),u.onToggleExpanded(e.id)}}
                  >
                    <ha-icon icon=${r?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
                  </button>
                  ${_?Te.qy`<button
                        class="icon-btn"
                        title=${(0,Ne.kg)("editor.remove")}
                        @click=${t=>{t.stopPropagation(),u.onRemove(e.id)}}
                      >
                        <ha-icon icon="mdi:delete-outline"></ha-icon>
                      </button>`:Te.s6}
                </div>
                ${r?Te.qy`
                      <div
                        style="padding: 8px 12px 12px 12px; background: var(--secondary-background-color); border-radius: 0 0 8px 8px; margin-bottom: 4px;"
                      >
                        ${o?u.renderCustomCardEditor(o,s):Te.s6}
                        ${n?u.renderCustomSectionEditor(n,c):Te.s6}
                        ${o||n||"summaries"!==e.type?Te.s6:Te.qy`
                              <label class="form-row" style="margin: 0 0 8px 0;">
                                <span style="min-width: 120px;">${(0,Ne.kg)("editor.weather_start_summary_size")}</span>
                                <select
                                  style="flex:1;"
                                  .value=${e.summary_size||"mini"}
                                  @change=${t=>u.onSummarySizeChanged(e.id,t.target.value)}
                                >
                                  <option value="mini">${(0,Ne.kg)("editor.weather_start_summary_size_mini")}</option>
                                  <option value="normal">
                                    ${(0,Ne.kg)("editor.weather_start_summary_size_normal")}
                                  </option>
                                </select>
                              </label>
                            `}
                        ${o||n?Te.s6:Te.qy`
                              <label class="form-row" style="margin: 0 0 8px 0;">
                                <input
                                  type="checkbox"
                                  ?checked=${!0===e.stack_with_previous}
                                  @change=${t=>u.onStackChanged(e.id,t.target.checked)}
                                />
                                <span>${(0,Ne.kg)("editor.weather_start_stack_with_previous")}</span>
                              </label>
                              <div class="description" style="margin: 0 0 6px 0;">
                                ${(0,Ne.kg)("editor.weather_start_block_yaml_desc")}
                              </div>
                              <textarea
                                rows="6"
                                style="width:100%;box-sizing:border-box;font-family:monospace;font-size:12px;resize:vertical;"
                                placeholder=${(0,Ne.kg)("editor.yaml_placeholder")}
                                .value=${e.yaml||""}
                                @change=${t=>u.onYamlChanged(e.id,t.target.value)}
                              ></textarea>
                              ${e._yaml_error?Te.qy`<div style="color:var(--error-color);font-size:12px;margin-top:4px;">
                                    ${e._yaml_error}
                                  </div>`:Te.s6}
                              ${d>0?Te.qy`<div style="color:var(--warning-color,#f0a000);font-size:12px;margin-top:4px;">
                                    ${(0,Ne.kg)("editor.weather_start_responsive_warning").replace("{count}",String(d))}
                                  </div>`:Te.s6}
                              ${e.parsed_config?Te.qy`<div style="color:var(--success-color,green);font-size:12px;margin-top:4px;">
                                    ${(0,Ne.kg)("editor.yaml_valid")}
                                  </div>`:Te.s6}
                              ${l?Te.qy`<button
                                    class="text-btn"
                                    style="margin-top:8px;"
                                    @click=${()=>u.onResetYaml(e.id)}
                                  >
                                    ${(0,Ne.kg)("editor.weather_start_block_reset")}
                                  </button>`:Te.s6}
                            `}
                      </div>
                    `:Te.s6}
              </div>
            `})}
      </div>
      <div class="description" style="margin: 12px 0 6px 0;">${(0,Ne.kg)("editor.weather_start_add_content_desc")}</div>
      <div class="custom-item-row weather-start-add-row">
        <button class="btn-primary" @click=${u.onAddCard}>${(0,Ne.kg)("editor.weather_start_add_card")}</button>
        ${u.hasSummariesBlock?Te.s6:Te.qy`<button class="btn-primary" @click=${u.onAddSummaries}>
              ${(0,Ne.kg)("editor.weather_start_add_summaries")}
            </button>`}
        <button class="btn-primary" @click=${u.onAddSection}>
          ${(0,Ne.kg)("editor.weather_start_add_section")}
        </button>
        <select @change=${u.onAddArea}>
          <option value="">${(0,Ne.kg)("editor.weather_start_add_area")}</option>
          ${u.unplacedAreas.map(e=>Te.qy`<option value=${e.area_id}>${e.name}</option>`)}
        </select>
        <select @change=${u.onAddFloor}>
          <option value="">${(0,Ne.kg)("editor.weather_start_add_floor")}</option>
          ${u.floors.map(e=>Te.qy`<option value=${e.floor_id||"__none__"}>${e.name}</option>`)}
        </select>
      </div>
    </div>
  `;var u}(this._weatherLayoutHost)}_getStacksOrder(e){return(0,ot.WZ)(this._config.areas_options?.[e]?.stacks_order)}_updateStacksOrder(e,t){const i={...this._config.areas_options?.[e]||{}};t.join("|")===it.x.join("|")?delete i.stacks_order:i.stacks_order=t;const a={...this._config.areas_options,[e]:i};0===Object.keys(a[e]).length&&delete a[e];const r={...this._config};0===Object.keys(a).length?delete r.areas_options:r.areas_options=a,this._config=r,this._fireConfigChanged(r)}_renderStackOrderPanel(e,t){return function(e){const{areaId:t,order:i,visible:a}=e,r=i.filter(e=>a.has(e)),o=i.filter(e=>!a.has(e));return Te.qy`
    <div class="entity-group" data-group="stack_order">
      <div class="entity-group-header">
        <ha-icon icon="mdi:sort"></ha-icon>
        <span class="group-name">${(0,Ne.kg)("editor.stack_order")}</span>
      </div>
      <div class="entity-list">
        <div class="description" style="margin-left: 0; margin-bottom: 8px;">
          ${(0,Ne.kg)("editor.stack_order_desc")}
        </div>
        <div class="section-order-list" data-area-id=${t}>
          ${r.map((i,a)=>{const o=Pt.get(i);return o?Te.qy`
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
                <ha-icon class="section-icon" icon=${o.icon}></ha-icon>
                <span class="section-label">${(0,Ne.kg)(o.labelKey)}</span>
                <button
                  type="button"
                  class="stack-move-button"
                  aria-label=${`${(0,Ne.kg)(o.labelKey)}: ${(0,Ne.kg)("editor.move_up")}`}
                  title=${(0,Ne.kg)("editor.move_up")}
                  ?disabled=${0===a}
                  @click=${()=>e.onMove(i,-1)}
                >
                  <ha-icon icon="mdi:chevron-up"></ha-icon>
                </button>
                <button
                  type="button"
                  class="stack-move-button"
                  aria-label=${`${(0,Ne.kg)(o.labelKey)}: ${(0,Ne.kg)("editor.move_down")}`}
                  title=${(0,Ne.kg)("editor.move_down")}
                  ?disabled=${a===r.length-1}
                  @click=${()=>e.onMove(i,1)}
                >
                  <ha-icon icon="mdi:chevron-down"></ha-icon>
                </button>
              </div>
            `:Te.s6})}
        </div>
        ${o.length>0?Te.qy`<div class="section-order-compact">
              <div class="compact-title">${(0,Ne.kg)("editor.stack_order_inactive")}</div>
              <div class="compact-chip-list">
                ${o.map(e=>{const t=Pt.get(e);return t?Te.qy`<span class="compact-chip"
                        ><ha-icon icon=${t.icon}></ha-icon>${(0,Ne.kg)(t.labelKey)}</span
                      >`:Te.s6})}
              </div>
            </div>`:Te.s6}
      </div>
    </div>
  `}({areaId:e,order:this._getStacksOrder(e),visible:Wt(t.groupedEntities,this._config),onMove:(i,a)=>{const r=this._getStacksOrder(e),o=function(e,t,i,a){const r=e.filter(e=>t.has(e)),o=r.indexOf(i),s=r[o+a];if(o<0||!s)return e;const n=[...e],c=n.indexOf(i),d=n.indexOf(s);return[n[c],n[d]]=[n[d],n[c]],n}(r,Wt(t.groupedEntities,this._config),i,a);o!==r&&this._updateStacksOrder(e,o)},onDragStart:this._handleStackDragStart,onDragEnd:this._handleStackDragEnd,onDragOver:this._handleStackDragOver,onDragLeave:this._handleStackDragLeave,onDrop:this._handleStackDrop})}_renderAreasListSection(){const e=this._getSortedAreas(),t=this._getNormalizedAreasDisplay(),i=t?.hidden||[],a=t?.order||[],r=t?.nav_items||[];return Te.qy`
      <div class="section">
        <div class="section-title">${(0,Ne.kg)("editor.section_area_views")}</div>
        <div class="description" style="margin-left: 0;">${(0,Ne.kg)("editor.area_view_override_intro")}</div>
        <div class="description" style="margin-left: 0;">${(0,Ne.kg)("editor.area_entity_settings_desc")}</div>
        <div class="area-list" id="area-list">${this._renderAreaItems(e,i,a,r)}</div>
      </div>
    `}_renderAreasSection(){const e=!0===this._config.group_by_floors,t=this._config.area_display_type??"compact",i=!0===this._config.show_switches_on_areas,a=!0===this._config.show_alerts_on_areas,r=!0===this._config.show_locks_in_rooms,o=!0===this._config.show_automations_in_rooms,s=!0===this._config.show_scripts_in_rooms,n=!0===this._config.show_vacuums_section_in_rooms,c=!0===this._config.show_switches_section_in_rooms,d=!0===this._config.camera_live_toggle,l=!1!==this._config.show_cameras_in_rooms,_=!0===this._config.show_cover_controls_in_rooms,u=!1!==this._config.show_energy_in_rooms,h=!1!==this._config.show_ups_in_rooms,p=!1!==this._config.hide_grouped_climate_members,g=!0===this._config.show_window_contacts_in_rooms,m=!0===this._config.show_door_contacts_in_rooms,f=!0===this._config.use_default_area_sort;return Te.qy`
      <div class="section">
        <div class="section-title">${(0,Ne.kg)("editor.section_areas")}</div>

        <div class="option-groups">
          <div class="option-group">
            <div class="option-group-title">
              <ha-icon icon="mdi:view-dashboard-outline"></ha-icon>
              <span>${(0,Ne.kg)("editor.area_overview_options")}</span>
            </div>
            ${this._renderCheckbox("group-by-floors",(0,Ne.kg)("editor.group_by_floors"),e,e=>this._toggleChanged("group_by_floors",e,!1))}
            <div class="description">${(0,Ne.kg)("editor.group_by_floors_desc")}</div>

            <div class="form-row">
              <label for="area-display-type">${(0,Ne.kg)("editor.area_display_type")}</label>
              <select
                id="area-display-type"
                .value=${t}
                @change=${e=>this._globalAreaDisplayTypeChanged(e.target.value)}
              >
                <option value="compact">${(0,Ne.kg)("editor.area_display_type_compact")}</option>
                <option value="picture">${(0,Ne.kg)("editor.area_display_type_picture")}</option>
              </select>
            </div>
            <div class="description">${(0,Ne.kg)("editor.area_display_type_desc")}</div>

            ${this._renderCheckbox("show-switches-on-areas",(0,Ne.kg)("editor.show_switches_on_areas"),i,e=>this._toggleChanged("show_switches_on_areas",e,!1))}
            <div class="description">${(0,Ne.kg)("editor.show_switches_on_areas_desc")}</div>

            ${this._renderCheckbox("show-alerts-on-areas",(0,Ne.kg)("editor.show_alerts_on_areas"),a,e=>this._toggleChanged("show_alerts_on_areas",e,!1))}
            <div class="description">${(0,Ne.kg)("editor.show_alerts_on_areas_desc")}</div>
          </div>

          <div class="option-group">
            <div class="option-group-title">
              <ha-icon icon="mdi:door-open"></ha-icon>
              <span>${(0,Ne.kg)("editor.room_view_options")}</span>
            </div>
            ${this._renderCheckbox("show-locks-in-rooms",(0,Ne.kg)("editor.show_locks_in_rooms"),r,e=>this._toggleChanged("show_locks_in_rooms",e,!1))}
            <div class="description">${(0,Ne.kg)("editor.show_locks_in_rooms_desc")}</div>

            ${this._renderCheckbox("show-automations-in-rooms",(0,Ne.kg)("editor.show_automations_in_rooms"),o,e=>this._toggleChanged("show_automations_in_rooms",e,!1))}
            <div class="description">${(0,Ne.kg)("editor.show_automations_in_rooms_desc")}</div>

            ${this._renderCheckbox("show-scripts-in-rooms",(0,Ne.kg)("editor.show_scripts_in_rooms"),s,e=>this._toggleChanged("show_scripts_in_rooms",e,!1))}
            <div class="description">${(0,Ne.kg)("editor.show_scripts_in_rooms_desc")}</div>

            ${this._renderCheckbox("show-vacuums-section-in-rooms",(0,Ne.kg)("editor.show_vacuums_section_in_rooms"),n,e=>this._toggleChanged("show_vacuums_section_in_rooms",e,!1))}
            <div class="description">${(0,Ne.kg)("editor.show_vacuums_section_in_rooms_desc")}</div>

            ${this._renderCheckbox("show-switches-section-in-rooms",(0,Ne.kg)("editor.show_switches_section_in_rooms"),c,e=>this._toggleChanged("show_switches_section_in_rooms",e,!1))}
            <div class="description">${(0,Ne.kg)("editor.show_switches_section_in_rooms_desc")}</div>

            ${this._renderCheckbox("show-cover-controls-in-rooms",(0,Ne.kg)("editor.show_cover_controls_in_rooms"),_,e=>this._toggleChanged("show_cover_controls_in_rooms",e,!1))}
            <div class="description">${(0,Ne.kg)("editor.show_cover_controls_in_rooms_desc")}</div>

            ${this._renderCheckbox("show-cameras-in-rooms",(0,Ne.kg)("editor.show_cameras_in_rooms"),l,e=>this._toggleChanged("show_cameras_in_rooms",e,!0))}
            <div class="description">${(0,Ne.kg)("editor.show_cameras_in_rooms_desc")}</div>

            ${this._renderCheckbox("camera-live-toggle",(0,Ne.kg)("editor.camera_live_toggle"),d,e=>this._toggleChanged("camera_live_toggle",e,!1))}
            <div class="description">${(0,Ne.kg)("editor.camera_live_toggle_desc")}</div>
            ${this._renderCheckbox("camera-pause-when-hidden",(0,Ne.kg)("editor.camera_pause_when_hidden"),!0===this._config.camera_pause_when_hidden,e=>this._toggleChanged("camera_pause_when_hidden",e,!1))}
            <div class="description">${(0,Ne.kg)("editor.camera_pause_when_hidden_desc")}</div>

            ${this._renderCheckbox("show-energy-in-rooms",(0,Ne.kg)("editor.show_energy_in_rooms"),u,e=>this._toggleChanged("show_energy_in_rooms",e,!0))}
            <div class="description">${(0,Ne.kg)("editor.show_energy_in_rooms_desc")}</div>

            ${this._renderCheckbox("show-ups-in-rooms",(0,Ne.kg)("editor.show_ups_in_rooms"),h,e=>this._toggleChanged("show_ups_in_rooms",e,!0))}
            <div class="description">${(0,Ne.kg)("editor.show_ups_in_rooms_desc")}</div>

            ${this._renderCheckbox("hide-grouped-climate-members",(0,Ne.kg)("editor.hide_grouped_climate_members"),p,e=>this._toggleChanged("hide_grouped_climate_members",e,!0))}
            <div class="description">${(0,Ne.kg)("editor.hide_grouped_climate_members_desc")}</div>

            ${this._renderCheckbox("show-window-contacts-in-rooms",(0,Ne.kg)("editor.show_window_contacts_in_rooms"),g,e=>this._toggleChanged("show_window_contacts_in_rooms",e,!1))}
            <div class="description">${(0,Ne.kg)("editor.show_window_contacts_in_rooms_desc")}</div>

            ${this._renderCheckbox("show-door-contacts-in-rooms",(0,Ne.kg)("editor.show_door_contacts_in_rooms"),m,e=>this._toggleChanged("show_door_contacts_in_rooms",e,!1))}
            <div class="description">${(0,Ne.kg)("editor.show_door_contacts_in_rooms_desc")}</div>
          </div>

          <div class="option-group">
            <div class="option-group-title">
              <ha-icon icon="mdi:sort-alphabetical-ascending"></ha-icon>
              <span>${(0,Ne.kg)("editor.area_management_options")}</span>
            </div>
            ${this._renderCheckbox("use-default-area-sort",(0,Ne.kg)("editor.use_default_area_sort"),f,e=>this._toggleChanged("use_default_area_sort",e,!1))}
            <div class="description">${(0,Ne.kg)("editor.use_default_area_sort_desc")}</div>
          </div>
        </div>
      </div>
    `}_renderViewsSection(){const e=!0===this._config.show_summary_views,t=!0===this._config.show_room_views,i=!0===this._config.show_cctv_view,a=!0===this._config.cctv_show_activity,r=this._config.show_camera_events??a,o=!0===this._config.show_cameras_in_security,s=!1!==this._config.show_maintenance_view,n=!1!==this._config.show_maintenance_activity,c=!1!==this._config.show_video_tips,d=!0===this._config.show_energy_view;return Te.qy`${function(e){const t=(t,i,a,r=!1)=>Te.qy`
    ${e.checkbox(t,(0,Ne.kg)(`editor.${i}`),a,t=>e.change(i,t,r))}
    <div class="description">${(0,Ne.kg)(`editor.${i}_desc`)}</div>
  `;return Te.qy`<div class="section">
    <div class="section-title">${(0,Ne.kg)("editor.section_views")}</div>
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
  </div>`}({showSummaryViews:e,showRoomViews:t,showCctvView:i,cctvShowActivity:a,showCameraEvents:r,showCamerasInSecurity:o,showMaintenanceView:s,showMaintenanceActivity:n,showVideoTips:c,showEnergyView:d,checkbox:(e,t,i,a)=>this._renderCheckbox(e,t,i,a),change:(e,t,i=!1)=>{"show_camera_events"===e?this._setCctvOptions({show_camera_events:t}):"cctv_show_activity"===e&&void 0===this._config.show_camera_events?this._setCctvOptions({cctv_show_activity:t,show_camera_events:!1}):this._toggleChanged(e,t,i)}})}${l=this,l._hass?Te.qy`<div class="section">
    <div class="section-title">${(0,Ne.kg)("editor.room_visibility")}</div>
    <div class="description" style="margin-left: 0;">${(0,Ne.kg)("editor.room_visibility_desc")}</div>
    ${l._getSortedAreas().map(e=>{const t=l._config.room_visibility?.[e.area_id];return Te.qy`<div class="option-group">
        <div class="option-group-title">${e.name}</div>
        <div class="form-row">
          <ha-textfield
            label=${(0,Ne.kg)("editor.room_visibility_entity")}
            .value=${t?.entity||""}
            @change=${t=>Lt(l,e.area_id,"entity",t.target.value)}
          ></ha-textfield>
          <ha-textfield
            label=${(0,Ne.kg)("editor.room_visibility_state")}
            .value=${t?.state||""}
            @change=${t=>Lt(l,e.area_id,"state",t.target.value)}
          ></ha-textfield>
        </div>
      </div>`})}
  </div>`:Te.qy``}${function(e){if(!e._hass)return Te.qy``;const t=Object.entries(e._hass.states).filter(([e,t])=>e.startsWith("person.")&&"string"==typeof t.attributes.user_id).map(([e,t])=>({id:t.attributes.user_id,name:String(t.attributes.friendly_name||e)})).sort((e,t)=>e.name.localeCompare(t.name));if(0===t.length)return Te.qy``;const i=[["home",(0,Ne.kg)("views.overview")],...(0,Ye.v4)(e._config,"lights")?[["lights",(0,Ne.kg)("views.lights")]]:[],...(0,Ye.v4)(e._config,"covers")?[["covers",(0,Ne.kg)("views.covers")]]:[],...(0,Ye.v4)(e._config,"security")?[["security",(0,Ne.kg)("views.security")]]:[],...(0,Ye.v4)(e._config,"batteries")?[["batteries",(0,Ne.kg)("views.batteries")]]:[],...(0,Ye.v4)(e._config,"climate")?[["climate",(0,Ne.kg)("views.climate")]]:[],...!0===e._config.show_energy_view?[["energy",(0,Ne.kg)("views.energy")]]:[],...!0===e._config.show_cctv_view?[["cctv",(0,Ne.kg)("views.cctv")]]:[],...!0===e._config.show_maintenance_view?[["maintenance",(0,Ne.kg)("views.maintenance")]]:[],...Object.values(e._hass.areas).map(e=>[e.area_id,e.name]),...(e._config.custom_views||[]).filter(e=>(e.parsed_config||e.ref_dashboard&&e.ref_view)&&e.path&&e.title).map(e=>[e.path,e.title])],a=bt.OH.filter(t=>!(0,bt.PM)(t.key,e._config)).map(e=>[e.key,(0,Ne.kg)(e.labelKey)]);for(const t of e._config.custom_sections||[])t.id&&a.push([t.id,t.title||t.id]);const r=(i,a)=>a.map(([a,r])=>{const o="view"===i?e._config.view_visible_users:e._config.section_visible_users,s=Object.prototype.hasOwnProperty.call(o||{},a)?o?.[a]||[]:t.map(e=>e.id);return Te.qy`<div class="option-group">
        <div class="option-group-title">${r}</div>
        ${t.map(r=>e._renderCheckbox(`${i}-${a}-${r.id}`,r.name,s.includes(r.id),o=>function(e,t,i,a,r,o){const s={...("view"===t?e._config.view_visible_users:e._config.section_visible_users)||{}},n=new Set(Object.prototype.hasOwnProperty.call(s,i)?s[i]:r);o?n.add(a):n.delete(a),r.every(e=>n.has(e))&&[...n].every(e=>r.includes(e))?delete s[i]:s[i]=[...n];const c={...e._config};"view"===t?Object.keys(s).length?c.view_visible_users=s:delete c.view_visible_users:Object.keys(s).length?c.section_visible_users=s:delete c.section_visible_users,e._fireConfigChanged(c)}(e,i,a,r.id,t.map(e=>e.id),o)))}
      </div>`});return Te.qy`<div class="section">
    <div class="section-title">${(0,Ne.kg)("editor.user_visibility")}</div>
    <div class="description" style="margin-left: 0;">${(0,Ne.kg)("editor.user_visibility_warning")}</div>
    <div class="description" style="margin-left: 0; color: var(--warning-color, #ffa600);">
      ${(0,Ne.kg)("editor.user_visibility_no_person_warning")}
    </div>
    <div class="option-group-title">${(0,Ne.kg)("editor.user_visibility_views")}</div>
    ${r("view",i)}
    <div class="option-group-title">${(0,Ne.kg)("editor.user_visibility_sections")}</div>
    ${r("section",a)}
  </div>`}(this)}`;var l}_renderCustomContentSection(){return Te.qy`
      <div class="section">
        <div class="section-title">${(0,Ne.kg)("editor.section_custom_content")}</div>
        <div class="description" style="margin-left: 0; margin-bottom: 12px;">
          ${(0,Ne.kg)("editor.section_custom_content_desc")}
        </div>
        ${Te.qy`
              <div class="empty-state" style="margin-bottom: 12px;">
                ${(0,Ne.kg)("editor.custom_content_weather_start_hint")}
              </div>
            `}
        <div class="custom-content-grid">
          ${Te.s6}
          ${Te.s6} ${this._renderCustomBadgesSection(!0)}
          ${function(e,t=!1){const i=e._config.custom_views||[];return Te.qy`
    <div class=${t?"editor-subsection":"section"}>
      <div class=${t?"subsection-title":"section-title"} style="display: flex; align-items: center; gap: 8px;">
        ${(0,Ne.kg)("editor.section_custom_views")}
        <a
          href="https://github.com/Cyberhunter88/dashboard-strategy/blob/main/assets/Custom-View-hinzufugen.gif"
          target="_blank"
          rel="noopener"
          style="color: var(--primary-color); text-decoration: none; font-size: 18px;"
          title=${(0,Ne.kg)("editor.video_tutorial")}
          >&#x1F3AC;</a
        >
      </div>

      <div id="custom-views-list">
        ${0===i.length?Te.qy`<div class="empty-state">${(0,Ne.kg)("editor.no_custom_views")}</div>`:i.map((t,i)=>function(e,t,i){const a=void 0!==t.ref_dashboard,r=t._yaml_error?Te.qy`<span style="color: var(--error-color);">&#x274C; ${t._yaml_error}</span>`:t.yaml?Te.qy`<span style="color: var(--success-color, green);">&#x2705; ${(0,Ne.kg)("editor.yaml_valid")}</span>`:Te.s6;return Te.qy`
    <div class="custom-item" data-index=${i}>
      <div class="custom-item-header">
        <strong>${t.title||(0,Ne.kg)("editor.new_view")}</strong>
        <button class="btn-remove" @click=${()=>e._removeCustomView(i)}>&#x2715;</button>
      </div>
      <div class="custom-item-fields">
        <div class="custom-item-row">
          <input
            type="text"
            .value=${t.title||""}
            placeholder=${(0,Ne.kg)("editor.title_placeholder")}
            style="flex: 2;"
            @change=${t=>e._updateCustomViewField(i,"title",t.target.value)}
          />
          <input
            type="text"
            .value=${t.path||""}
            placeholder=${(0,Ne.kg)("editor.path_placeholder")}
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
        ${function(e,t,i){const a=function(e,t){if(!e._hass)return[];const i=[["home",(0,Ne.kg)("views.overview")]],a=(e,t,a)=>{e&&i.push([t,(0,Ne.kg)(a)])};a((0,Ye.v4)(e._config,"lights"),"lights","views.lights"),a((0,Ye.v4)(e._config,"covers"),"covers","views.covers"),a((0,Ye.v4)(e._config,"security"),"security","views.security"),a((0,Ye.v4)(e._config,"batteries"),"batteries","views.batteries"),a((0,Ye.v4)(e._config,"climate"),"climate","views.climate"),a(!0===e._config.show_cctv_view,"cctv","views.cctv"),a(!1!==e._config.show_maintenance_view,"maintenance","views.maintenance");const r=new Set(e._config.areas_display?.hidden||[]);for(const t of e._getSortedAreas()){if(r.has(t.area_id))continue;const a=e._config.room_visibility?.[t.area_id];a?.entity&&e._hass.states[a.entity]?.state!==a.state||i.push([t.area_id,t.name])}for(const[a,r]of(e._config.custom_views||[]).entries())a!==t&&(r.parsed_config||r.ref_dashboard&&r.ref_view)&&r.path&&r.title&&i.push([r.path,r.title]);return i}(e,i),r=!!t.after_view&&!a.some(([e])=>e===t.after_view);return Te.qy`
    <div class="custom-item-row">
      <select
        style="flex: 1;"
        @change=${t=>e._updateCustomViewAfterView(i,t.target.value)}
      >
        <option value="" ?selected=${!t.after_view}>${(0,Ne.kg)("editor.custom_view_position_end")}</option>
        ${r?Te.qy`<option value=${t.after_view||""} selected>
              &#x26A0; ${(0,Ne.kg)("editor.custom_view_position_after")} ${t.after_view}
            </option>`:Te.s6}
        ${a.map(([e,i])=>Te.qy`
            <option value=${e} ?selected=${t.after_view===e}>
              ${(0,Ne.kg)("editor.custom_view_position_after")} ${i}
            </option>
          `)}
      </select>
    </div>
  `}(e,t,i)}
        ${a?function(e,t,i){if(null===e._refDashboards)return e._loadRefDashboards(),Te.qy`<div class="description">${(0,Ne.kg)("editor.ref_loading")}</div>`;if(0===e._refDashboards.length)return Te.qy`<div class="custom-item-validation" style="color: var(--error-color);">
      ${(0,Ne.kg)("editor.ref_no_dashboards")}
    </div>`;const a=e._refDashboards.find(e=>e.url_path===t.ref_dashboard),r=!!t.ref_dashboard&&!a;return Te.qy` <div class="custom-item-row">
      <select
        style="flex: 1;"
        @change=${t=>e._refDashboardChanged(i,t.target.value)}
      >
        <option value="" ?selected=${!t.ref_dashboard} disabled>${(0,Ne.kg)("editor.ref_select_dashboard")}</option>
        ${r?Te.qy`<option value=${t.ref_dashboard||""} selected>${t.ref_dashboard}</option>`:Te.s6}
        ${e._refDashboards.map(e=>Te.qy` <option value=${e.url_path} ?selected=${e.url_path===t.ref_dashboard}>
              ${e.title}
            </option>`)}
      </select>
      <select
        style="flex: 1;"
        ?disabled=${!a}
        @change=${t=>e._refViewChanged(i,t.target.value)}
      >
        <option value="" ?selected=${!t.ref_view} disabled>${(0,Ne.kg)("editor.ref_select_view")}</option>
        ${(a?.views||[]).map(e=>{const i=e.path??String(e.index),a=`${e.title||`${(0,Ne.kg)("editor.ref_view_untitled")} ${e.index+1}`}${e.path?` (${e.path})`:""}`;return Te.qy`<option value=${i} ?selected=${i===t.ref_view}>${a}</option>`})}
      </select>
    </div>
    <div class="custom-item-validation">
      ${r?Te.qy`<span style="color: var(--error-color);">${(0,Ne.kg)("editor.ref_dashboard_missing")}</span>`:t.ref_dashboard&&t.ref_view?Te.qy`<span style="color: var(--success-color, green);">${(0,Ne.kg)("editor.ref_valid")}</span>`:(0,Ne.kg)("editor.ref_incomplete")}
    </div>`}(e,t,i):Te.qy`<textarea
                rows="8"
                placeholder=${(0,Ne.kg)("editor.yaml_placeholder")}
                .value=${t.yaml||""}
                style="width: 100%;"
                @change=${t=>e._updateCustomViewYaml(i,t.target.value)}
              ></textarea>
              <div class="custom-item-validation">${r}</div>`}
      </div>
    </div>
  `}(e,t,i))}
      </div>

      <div class="custom-item-row" style="margin-top: 8px;">
        <button class="btn-primary" @click=${e._addCustomView}>
          ${(0,Ne.kg)("editor.add_custom_view")} <ha-icon icon="mdi:code-braces"></ha-icon>
        </button>
        <button class="btn-primary" @click=${e._addCustomRefView}>
          ${(0,Ne.kg)("editor.add_custom_view_ref")} <ha-icon icon="mdi:link-variant"></ha-icon>
        </button>
      </div>
      <div class="description">${(0,Ne.kg)("editor.custom_views_help")}</div>
      <div class="description">${(0,Ne.kg)("editor.custom_views_ref_help")}</div>
    </div>
  `}(this._customViewsHost,!0)}
        </div>
      </div>
    `}_renderCustomCardsSection(e=!1){const t=this._config.custom_cards||[],i=this._config.custom_cards_heading||"",a=this._config.custom_cards_icon||"";return Te.qy`
      <div class=${e?"editor-subsection":"section"}>
        <div
          class=${e?"subsection-title":"section-title"}
          style="display: flex; align-items: center; gap: 8px;"
        >
          ${(0,Ne.kg)("editor.section_custom_cards")}
          <a
            href="https://github.com/Cyberhunter88/dashboard-strategy/blob/main/assets/Eigene-Karten-hinzufugen.gif"
            target="_blank"
            rel="noopener"
            style="color: var(--primary-color); text-decoration: none; font-size: 18px;"
            title=${(0,Ne.kg)("editor.video_tutorial")}
            >&#x1F3AC;</a
          >
        </div>
        <div class="custom-item-row" style="margin-bottom: 12px;">
          <input
            type="text"
            id="custom-cards-heading"
            .value=${i}
            placeholder=${(0,Ne.kg)("editor.custom_cards_heading_placeholder")}
            style="flex: 2;"
            @change=${this._customCardsHeadingChanged}
          />
          <input
            type="text"
            id="custom-cards-icon"
            .value=${a}
            placeholder="mdi:cards"
            style="flex: 1;"
            @change=${this._customCardsIconChanged}
          />
        </div>
        <div class="description" style="margin-bottom: 8px;">${(0,Ne.kg)("editor.custom_cards_desc")}</div>

        <div id="custom-cards-list">
          ${0===t.length?Te.qy`<div class="empty-state">${(0,Ne.kg)("editor.no_custom_cards")}</div>`:t.map((e,t)=>this._renderCustomCardItem(e,t))}
        </div>

        <button class="btn-primary" style="margin-top: 8px;" @click=${this._openCardPickerForCustomCard}>
          ${(0,Ne.kg)("editor.add_custom_card")}
        </button>
        <div class="description">${(0,Ne.kg)("editor.custom_cards_help")}</div>
      </div>
    `}_renderCustomSectionsSection(e=!1){const t=this._config.custom_sections||[];return Te.qy`
      <div class=${e?"editor-subsection":"section"}>
        <div class=${e?"subsection-title":"section-title"}>${(0,Ne.kg)("editor.section_custom_sections")}</div>
        <div class="description" style="margin-bottom: 8px;">${(0,Ne.kg)("editor.custom_sections_help")}</div>

        <div id="custom-sections-list">
          ${0===t.length?Te.qy`<div class="empty-state">${(0,Ne.kg)("editor.no_custom_sections")}</div>`:t.map((e,t)=>this._renderCustomSectionItem(e,t))}
        </div>

        <button class="btn-primary" style="margin-top: 8px;" @click=${this._addCustomSection}>
          ${(0,Ne.kg)("editor.add_custom_section")}
        </button>
      </div>
    `}_renderCustomBadgesSection(e=!1){const t=this._config.custom_badges||[];return Te.qy`
      <div class=${e?"editor-subsection":"section"}>
        <div
          class=${e?"subsection-title":"section-title"}
          style="display: flex; align-items: center; gap: 8px;"
        >
          ${(0,Ne.kg)("editor.section_custom_badges")}
          <a
            href="https://github.com/Cyberhunter88/dashboard-strategy/blob/main/assets/Custom-Badges-hinzufugen.gif"
            target="_blank"
            rel="noopener"
            style="color: var(--primary-color); text-decoration: none; font-size: 18px;"
            title=${(0,Ne.kg)("editor.video_tutorial")}
            >&#x1F3AC;</a
          >
        </div>

        <div id="custom-badges-list">
          ${0===t.length?Te.qy`<div class="empty-state">${(0,Ne.kg)("editor.no_custom_badges")}</div>`:t.map((e,t)=>this._renderCustomBadgeItem(e,t))}
        </div>

        <button class="btn-primary" style="margin-top: 8px;" @click=${this._addCustomBadge}>
          ${(0,Ne.kg)("editor.add_custom_badge")}
        </button>
        <div class="description">${(0,Ne.kg)("editor.custom_badges_help")}</div>
      </div>
    `}_renderCheckbox(e,t,i,a,r=!1){return Te.qy`
      <div class="form-row">
        <input
          type="checkbox"
          id=${e}
          ?checked=${i}
          ?disabled=${r}
          @change=${e=>a(e.target.checked)}
        />
        <label for=${e} class=${r?"disabled-label":""}>${t}</label>
      </div>
    `}_renderCustomCardItem(e,t){const i=e._yaml_error?Te.qy`<span style="color: var(--error-color);">&#x274C; ${e._yaml_error}</span>`:e.yaml?Te.qy`<span style="color: var(--success-color, green);">&#x2705; ${(0,Ne.kg)("editor.yaml_valid")}</span>`:Te.s6;return Te.qy`
      <div class="custom-item" data-index=${t}>
        <div class="custom-item-header">
          <strong>${this._getCustomCardEditorLabel(e,(0,Ne.kg)("editor.new_card"))}</strong>
          <button class="btn-remove" @click=${()=>this._removeCustomCard(t)}>&#x2715;</button>
        </div>
        <div class="custom-item-fields">
          <label>${(0,Ne.kg)("editor.card_editor_title_label")}</label>
          <input
            type="text"
            .value=${e.editor_title||""}
            placeholder=${(0,Ne.kg)("editor.card_editor_title_placeholder")}
            @change=${e=>this._updateCustomCardField(t,"editor_title",e.target.value)}
          />
          <div class="description" style="margin: 0 0 4px 0;">${(0,Ne.kg)("editor.card_editor_title_help")}</div>
          <label>${(0,Ne.kg)("editor.card_dashboard_title_label")}</label>
          <input
            type="text"
            .value=${e.title||""}
            placeholder=${(0,Ne.kg)("editor.card_title_placeholder")}
            @change=${e=>this._updateCustomCardField(t,"title",e.target.value)}
          />
          <div class="custom-card-target">
            <label>${(0,Ne.kg)("editor.target_section")}:</label>
            <select
              @change=${e=>this._updateCustomCardField(t,"target_section",e.target.value)}
            >
              ${["custom_cards","overview","areas","weather","energy"].map(t=>Te.qy`
                  <option value=${t} ?selected=${(e.target_section||"custom_cards")===t}>
                    ${(0,Ne.kg)(Kt._sectionMeta.get(t).labelKey)}
                  </option>
                `)}
            </select>
          </div>
          <textarea
            rows="6"
            placeholder=${(0,Ne.kg)("editor.yaml_placeholder")}
            .value=${e.yaml||""}
            style="width: 100%;"
            @change=${e=>this._updateCustomCardYaml(t,e.target.value)}
          ></textarea>
          <button class="btn-primary" style="margin-top: 6px;" @click=${()=>this._openCardEditorForCustomCard(t)}>
            ${(0,Ne.kg)("editor.edit_card_with_ha_editor")}
          </button>
          <div class="custom-item-validation">${i}</div>
        </div>
      </div>
    `}_renderCustomSectionItem(e,t){const i=e.cards||[];return Te.qy`
      <div class="custom-item" data-index=${t} style="margin-bottom: 12px;">
        <div class="custom-item-header">
          <strong>${e.title||`${(0,Ne.kg)("editor.section_custom_sections")} ${t+1}`}</strong>
          <button class="btn-remove" @click=${()=>this._removeCustomSection(t)}>&#x2715;</button>
        </div>
        <div class="custom-item-fields">
          <textarea
            rows="8"
            placeholder="type: grid&#10;cards:&#10;  - type: tile&#10;    entity: light.example"
            .value=${e.yaml||""}
            style="width: 100%;"
            @change=${e=>this._updateCustomSectionYaml(t,e.target.value)}
          ></textarea>
          <div class="custom-item-validation">
            ${e._yaml_error?Te.qy`<span style="color: var(--error-color);">&#x274C; ${e._yaml_error}</span>`:e.yaml?Te.qy`<span style="color: var(--success-color, green);"
                    >&#x2705; ${(0,Ne.kg)("editor.yaml_valid")}</span
                  >`:Te.s6}
          </div>
          <div class="custom-item-row">
            <input
              type="text"
              .value=${e.title||""}
              placeholder=${(0,Ne.kg)("editor.custom_section_title_placeholder")}
              style="flex: 2;"
              @change=${e=>this._updateCustomSectionField(t,"title",e.target.value)}
            />
            <input
              type="text"
              .value=${e.icon||""}
              placeholder=${(0,Ne.kg)("editor.custom_section_icon_placeholder")}
              style="flex: 1;"
              @change=${e=>this._updateCustomSectionField(t,"icon",e.target.value)}
            />
          </div>
          <div style="margin-top: 8px; padding-left: 8px; border-left: 2px solid var(--divider-color, #e0e0e0);">
            ${i.map((e,i)=>{const a=e._yaml_error?Te.qy`<span style="color: var(--error-color);">&#x274C; ${e._yaml_error}</span>`:e.yaml?Te.qy`<span style="color: var(--success-color, green);"
                      >&#x2705; ${(0,Ne.kg)("editor.yaml_valid")}</span
                    >`:Te.s6;return Te.qy`
                <div class="custom-item" data-index=${i} style="margin-bottom: 8px;">
                  <div class="custom-item-header">
                    <strong
                      >${this._getCustomCardEditorLabel(e,`${(0,Ne.kg)("editor.new_card")} ${i+1}`)}</strong
                    >
                    <button class="btn-remove" @click=${()=>this._removeCardFromSection(t,i)}>
                      &#x2715;
                    </button>
                  </div>
                  <div class="custom-item-fields">
                    <label>${(0,Ne.kg)("editor.card_editor_title_label")}</label>
                    <input
                      type="text"
                      .value=${e.editor_title||""}
                      placeholder=${(0,Ne.kg)("editor.card_editor_title_placeholder")}
                      @change=${e=>this._updateSectionCardField(t,i,"editor_title",e.target.value)}
                    />
                    <div class="description" style="margin: 0 0 4px 0;">
                      ${(0,Ne.kg)("editor.card_editor_title_help")}
                    </div>
                    <label>${(0,Ne.kg)("editor.card_dashboard_title_label")}</label>
                    <input
                      type="text"
                      .value=${e.title||""}
                      placeholder=${(0,Ne.kg)("editor.card_title_placeholder")}
                      @change=${e=>this._updateSectionCardField(t,i,"title",e.target.value)}
                    />
                    <textarea
                      rows="5"
                      placeholder=${(0,Ne.kg)("editor.yaml_placeholder")}
                      .value=${e.yaml||""}
                      style="width: 100%;"
                      @change=${e=>this._updateSectionCardYaml(t,i,e.target.value)}
                    ></textarea>
                    <button
                      class="btn-primary"
                      style="margin-top: 6px;"
                      @click=${()=>this._openCardEditorForSectionCard(t,i)}
                    >
                      ${(0,Ne.kg)("editor.edit_card_with_ha_editor")}
                    </button>
                    <div class="custom-item-validation">${a}</div>
                  </div>
                </div>
              `})}
            <button
              class="btn-primary"
              style="margin-top: 4px;"
              @click=${()=>this._openCardPickerForSection(t)}
            >
              ${(0,Ne.kg)("editor.add_card_to_section")}
            </button>
          </div>
        </div>
      </div>
    `}_renderCustomBadgeItem(e,t){const i=e._yaml_error?Te.qy`<span style="color: var(--error-color);">&#x274C; ${e._yaml_error}</span>`:e.yaml?Te.qy`<span style="color: var(--success-color, green);">&#x2705; ${(0,Ne.kg)("editor.yaml_valid")}</span>`:Te.s6;return Te.qy`
      <div class="custom-item" data-index=${t}>
        <div class="custom-item-header">
          <strong>Badge ${t+1}</strong>
          <button class="btn-remove" @click=${()=>this._removeCustomBadge(t)}>&#x2715;</button>
        </div>
        <textarea
          rows="4"
          placeholder="type: entity&#10;entity: sun.sun"
          .value=${e.yaml||""}
          style="width: 100%;"
          @change=${e=>this._updateCustomBadgeYaml(t,e.target.value)}
        ></textarea>
        <div class="custom-item-validation">${i}</div>
      </div>
    `}_renderAreaItems(e,t,i,a){return function(e,t,i,a,r){if(0===t.length)return Te.qy`<div class="empty-state">${(0,Ne.kg)("editor.no_areas")}</div>`;const o=new Map(a.map((e,t)=>[e,t])),s=new Map(t.map((e,t)=>[e.area_id,t]));return[...t].sort((e,t)=>{const i=o.get(e.area_id),a=o.get(t.area_id);return(void 0!==i?i:9999+(s.get(e.area_id)??0))-(void 0!==a?a:9999+(s.get(t.area_id)??0))}).map(t=>{const a=i.includes(t.area_id),o=e._expandedAreas.has(t.area_id),s=e._areaEntitiesCache.get(t.area_id),n=r.includes(t.area_id);return Te.qy`
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
          ${e._config.areas_options?.[t.area_id]?.view_override?.yaml?Te.qy`<button
                type="button"
                title=${(0,Ne.kg)("editor.override_active_help")}
                @click=${()=>{e._openDiagnosticLocation(`areas_options.${t.area_id}.view_override`)}}
              >
                ${(0,Ne.kg)("editor.override_active")}
              </button>`:Te.s6}
          ${t.icon?Te.qy`<ha-icon class="area-icon" icon=${t.icon}></ha-icon>`:Te.s6}
          <button
            class="nav-pin-button ${n?"pinned":""}"
            title="${(0,Ne.kg)("editor.area_pin_nav")}"
            ?disabled=${a}
            @click=${i=>{i.stopPropagation(),e._areaNavPinChanged(t.area_id,!n)}}
          >
            <ha-icon icon="${n?"mdi:pin":"mdi:pin-outline"}"></ha-icon>
          </button>
          <button
            class="expand-button ${o?"expanded":""}"
            data-area-id=${t.area_id}
            @click=${i=>e._toggleAreaExpand(i,t.area_id)}
          >
            <span class="expand-icon">&#x25B6;</span>
          </button>
        </div>
        ${o?Te.qy`
              <div class="area-content" data-area-id=${t.area_id}>
                ${e._renderAreaDisplayTypeOverride(t)} ${e._renderAreaViewOverride(t.area_id)}
                ${s?e._renderAreaEntities(t.area_id,s):Te.qy`<div class="loading-placeholder">${(0,Ne.kg)("editor.loading_entities")}</div>`}
              </div>
            `:Te.s6}
      </div>
    `})}(this._roomOptionsHost,e,t,i,a)}_globalAreaDisplayTypeChanged(e){const t=function(e,t){const i={...e};return"compact"===t?delete i.area_display_type:i.area_display_type=t,i}(this._config,e);this._config=t,this._fireConfigChanged(t)}_renderAreaDisplayTypeOverride(e){return function(e,t){const i=e._config.areas_options?.[t.area_id]?.display_type??"";return Te.qy`
    <div class="form-row">
      <label for="area-display-type-${t.area_id}">${(0,Ne.kg)("editor.area_display_type_override")}</label>
      <select
        id="area-display-type-${t.area_id}"
        .value=${i}
        @change=${i=>e._areaDisplayTypeOverrideChanged(t.area_id,i.target.value)}
      >
        <option value="">${(0,Ne.kg)("editor.area_display_type_inherit")}</option>
        <option value="compact">${(0,Ne.kg)("editor.area_display_type_compact")}</option>
        <option value="picture">${(0,Ne.kg)("editor.area_display_type_picture")}</option>
      </select>
    </div>
    ${t.picture?Te.s6:Te.qy`<div class="description">${(0,Ne.kg)("editor.area_display_type_no_picture")}</div>`}
  `}(this._roomOptionsHost,e)}_areaDisplayTypeOverrideChanged(e,t){const i=function(e,t,i){const a={...Reflect.get(e.areas_options??{},t)??{}};i?a.display_type=i:delete a.display_type;const r={...e.areas_options};Reflect.set(r,t,a),0===Object.keys(a).length&&Reflect.deleteProperty(r,t);const o={...e};return 0===Object.keys(r).length?delete o.areas_options:o.areas_options=r,o}(this._config,e,t||void 0);this._config=i,this._fireConfigChanged(i)}_renderAreaViewOverride(e){return function(e,t){const i=e._config.areas_options?.[t]?.view_override,a=i?._yaml_error?Te.qy`<span style="color: var(--error-color);">&#x274C; ${i._yaml_error}</span>`:i?.parsed_config?Te.qy`<span style="color: var(--success-color, green);">&#x2705; ${(0,Ne.kg)("editor.yaml_valid")}</span>`:Te.s6;return Te.qy`
    <div class="custom-item" style="margin-bottom: 0;">
      <div class="custom-item-header">
        <strong>${(0,Ne.kg)("editor.area_view_override_title")}</strong>
        ${i?.yaml?Te.qy`
              <button
                class="btn-remove"
                title=${(0,Ne.kg)("editor.area_view_override_remove")}
                @click=${()=>e._updateAreaViewOverride(t,"")}
              >
                &#x2715;
              </button>
            `:Te.s6}
      </div>
      <div class="description" style="margin: 0 0 10px 0;">${(0,Ne.kg)("editor.area_view_override_help")}</div>
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
  `}(this._roomOptionsHost,e)}_updateAreaViewOverride(e,t){return function(e,t,i){const a={...e._config.areas_options?.[t]||{}};if(i.trim()){const e=je(i,(0,Ne.kg)("editor.area_view_override_object_error")),t=e.parsed_config,r=t&&!Array.isArray(t);a.view_override={yaml:i,parsed_config:r?t:void 0,_yaml_error:r?e._yaml_error:e._yaml_error||(0,Ne.kg)("editor.area_view_override_object_error")}}else delete a.view_override;const r={...e._config.areas_options};0===Object.keys(a).length?delete r[t]:r[t]=a;const o={...e._config};0===Object.keys(r).length?delete o.areas_options:o.areas_options=r,e._config=o,e._fireConfigChanged(o)}(this._roomOptionsHost,e,t)}_renderAreaEntities(e,t){return function(e,t,i){const{groupedEntities:a,hiddenEntities:r,badgeCandidates:o,additionalBadges:s,availableEntities:n,defaultShowNames:c,namesVisible:d,namesHidden:l}=i,_=e._hass,u=[{key:"ups",label:(0,Ne.kg)("stacks.ups"),icon:"mdi:power-plug-battery"},{key:"lights",label:(0,Ne.kg)("editor.domain_lights"),icon:"mdi:lightbulb"},{key:"climate",label:(0,Ne.kg)("editor.domain_climate"),icon:"mdi:thermostat"},{key:"covers",label:(0,Ne.kg)("editor.domain_covers"),icon:"mdi:window-shutter"},{key:"covers_curtain",label:(0,Ne.kg)("editor.domain_covers_curtain"),icon:"mdi:curtains"},{key:"covers_window",label:(0,Ne.kg)("editor.domain_covers_window"),icon:"mdi:window-open-variant"},{key:"media_player",label:(0,Ne.kg)("editor.domain_media_player"),icon:"mdi:speaker"},{key:"scenes",label:(0,Ne.kg)("editor.domain_scenes"),icon:"mdi:palette"},{key:"vacuum",label:(0,Ne.kg)("editor.domain_vacuum"),icon:"mdi:robot-vacuum"},{key:"fan",label:(0,Ne.kg)("editor.domain_fan"),icon:"mdi:fan"},{key:"switches",label:(0,Ne.kg)("editor.domain_switches"),icon:"mdi:light-switch"},{key:"locks",label:(0,Ne.kg)("editor.domain_locks"),icon:"mdi:lock"},{key:"energy",label:(0,Ne.kg)("stacks.energy"),icon:"mdi:lightning-bolt"}],h=u.some(e=>(a[e.key]?.length??0)>0),p=(o?.length??0)>0||(s?.length??0)>0,g=[],m=new Set,f=e=>{if(!e||m.has(e))return;m.add(e);const t=_.states[e],i=t?.attributes.friendly_name||e.split(".")[1]?.replace(/_/g," ")||e;g.push({entity_id:e,name:i})};for(const e of u)for(const t of a[e.key]||[])f(t);for(const e of o||[])f(e);for(const e of s||[])f(e);for(const e of n||[])f(e.entity_id);g.sort((e,t)=>e.name.localeCompare(t.name));const y=e._renderAreaCustomCardsSection(t,g);if(!h&&!p)return Te.qy`
      <div class="empty-state">${(0,Ne.kg)("editor.no_entities_in_area")}</div>
      ${e._renderStackOrderPanel(t,i)} ${y}
    `;const v=e._expandedGroups.get(t)||new Set;return Te.qy`
    <div class="entity-groups">
      ${u.map(i=>{const o=a[i.key];if(!o||0===o.length)return Te.s6;const s=r[i.key]||[],n=o.every(e=>s.includes(e)),c=o.some(e=>s.includes(e))&&!n,d=v.has(i.key);return Te.qy`
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
                @change=${a=>{a.stopPropagation();const r=a.target.checked;e._groupVisibilityChanged(t,i.key,r,o)}}
              />
              <ha-icon icon=${i.icon}></ha-icon>
              <span class="group-name">${i.label}</span>
              <span class="entity-count">(${o.length})</span>
              <button
                class="expand-button-small ${d?"expanded":""}"
                @click=${a=>{a.stopPropagation(),e._toggleGroupExpand(t,i.key)}}
              >
                <span class="expand-icon-small">&#x25B6;</span>
              </button>
            </div>
            ${d?Te.qy`
                  <div class="entity-list" data-area-id=${t} data-group=${i.key}>
                    ${o.map(a=>{const r=_.states[a],o=r?.attributes.friendly_name||a.split(".")[1].replace(/_/g," "),n=s.includes(a);return Te.qy`
                        <div class="entity-item">
                          <input
                            type="checkbox"
                            class="entity-checkbox"
                            ?checked=${!n}
                            @change=${r=>e._entityVisibilityChanged(t,i.key,a,r.target.checked)}
                          />
                          <span class="entity-name">${o}</span>
                          <span class="entity-id">${a}</span>
                        </div>
                      `})}
                  </div>
                `:Te.s6}
          </div>
        `})}
      ${p?e._renderBadgeGroup(t,o,s,n,r,c,d,l,v):Te.s6}
      ${e._renderStackOrderPanel(t,i)}
    </div>
    ${y}
  `}(this._roomOptionsHost,e,t)}_renderAreaCustomCardItem(e,t,i,a){return function(e,t,i,a,r){const o=i.mode||"yaml",s=i.position||"bottom",n=i._yaml_error?Te.qy`<span style="color: var(--error-color);">&#x274C; ${i._yaml_error}</span>`:i.yaml?Te.qy`<span style="color: var(--success-color, green);">&#x2705; ${(0,Ne.kg)("editor.yaml_valid")}</span>`:Te.s6;return Te.qy`
    <div class="custom-item" data-index=${a}>
      <div class="custom-item-header">
        <strong>${e._getCustomCardEditorLabel(i,(0,Ne.kg)("editor.area_custom_card_new"))}</strong>
        <button class="btn-remove" @click=${()=>e._removeAreaCustomCard(t,a)}>&#x2715;</button>
      </div>
      <div class="custom-item-fields">
        <label>${(0,Ne.kg)("editor.card_editor_title_label")}</label>
        <input
          type="text"
          .value=${i.editor_title||""}
          placeholder=${(0,Ne.kg)("editor.card_editor_title_placeholder")}
          @change=${i=>e._updateAreaCustomCardField(t,a,"editor_title",i.target.value)}
        />
        <div class="description" style="margin: 0 0 4px 0;">${(0,Ne.kg)("editor.card_editor_title_help")}</div>
        <label>${(0,Ne.kg)("editor.card_dashboard_title_label")}</label>
        <input
          type="text"
          .value=${i.title||""}
          placeholder=${(0,Ne.kg)("editor.card_title_placeholder")}
          @change=${i=>e._updateAreaCustomCardField(t,a,"title",i.target.value)}
        />
        <div class="custom-card-target">
          <label>${(0,Ne.kg)("editor.area_custom_card_position")}:</label>
          <select
            @change=${i=>e._updateAreaCustomCardField(t,a,"position",i.target.value)}
          >
            <option value="top" ?selected=${"top"===s}>
              ${(0,Ne.kg)("editor.area_custom_card_position_top")}
            </option>
            <option value="bottom" ?selected=${"bottom"===s}>
              ${(0,Ne.kg)("editor.area_custom_card_position_bottom")}
            </option>
          </select>
        </div>
        <div class="custom-card-target">
          <label>${(0,Ne.kg)("editor.area_custom_card_mode")}:</label>
          <select
            @change=${i=>e._updateAreaCustomCardField(t,a,"mode",i.target.value)}
          >
            <option value="yaml" ?selected=${"yaml"===o}>${(0,Ne.kg)("editor.area_custom_card_mode_yaml")}</option>
            <option value="tile" ?selected=${"tile"===o}>${(0,Ne.kg)("editor.area_custom_card_mode_tile")}</option>
            <option value="section" ?selected=${"section"===o}>
              ${(0,Ne.kg)("editor.area_custom_card_mode_section")}
            </option>
          </select>
        </div>
        ${"tile"===o?Te.qy`
              <div class="custom-card-target">
                <label>${(0,Ne.kg)("editor.area_custom_card_entity")}:</label>
                <select
                  @change=${i=>e._updateAreaCustomCardField(t,a,"entity",i.target.value)}
                >
                  <option value="">${(0,Ne.kg)("editor.area_custom_card_entity_select")}</option>
                  ${r.map(e=>Te.qy`
                      <option value=${e.entity_id} ?selected=${i.entity===e.entity_id}>
                        ${e.name} (${e.entity_id})
                      </option>
                    `)}
                </select>
              </div>
            `:Te.qy`
              <textarea
                rows="6"
                placeholder=${(0,Ne.kg)("editor.yaml_placeholder")}
                .value=${i.yaml||""}
                style="width: 100%;"
                @change=${i=>e._updateAreaCustomCardYaml(t,a,i.target.value)}
              ></textarea>
              <button
                class="btn-primary"
                style="margin-top: 6px;"
                @click=${()=>e._openCardEditorForAreaCustomCard(t,a)}
              >
                ${(0,Ne.kg)("editor.edit_card_with_ha_editor")}
              </button>
              <div class="custom-item-validation">${n}</div>
            `}
      </div>
    </div>
  `}(this._roomOptionsHost,e,t,i,a)}_renderAreaCustomCardsSection(e,t){return function(e,t,i){const a=e._getAreaCustomCards(t);return Te.qy`
    <div class="area-custom-cards">
      <div class="area-custom-cards-header">
        <ha-icon icon="mdi:card-plus-outline"></ha-icon>
        <span class="group-name">${(0,Ne.kg)("editor.area_custom_cards_title")}</span>
      </div>
      <div class="area-custom-cards-help">${(0,Ne.kg)("editor.area_custom_cards_help")}</div>
      ${0===a.length?Te.s6:a.map((a,r)=>e._renderAreaCustomCardItem(t,a,r,i))}
      <div class="area-custom-card-actions">
        <button class="btn-primary" @click=${()=>e._addAreaCustomCard(t)}>
          ${(0,Ne.kg)("editor.area_custom_card_add_yaml")}
        </button>
        <button class="btn-primary" @click=${()=>e._openCardPickerForAreaCustomCard(t)}>
          ${(0,Ne.kg)("editor.area_custom_card_add_picker")}
        </button>
      </div>
    </div>
  `}(this._roomOptionsHost,e,t)}_renderBadgeGroup(e,t,i,a,r,o,s,n,c){return function(e,t,i,a,r,o,s,n,c,d){const l=e._hass,_=i.length+a.length;if(0===_)return Te.qy``;const u=o.badges||[],h=i.length>0&&i.every(e=>u.includes(e)),p=i.some(e=>u.includes(e))&&!h,g=new Set(n||[]),m=new Set(c||[]),f=e=>(0,ze.LN)(e,s.has(e),g,m),y=d.has("badges");return Te.qy`
    <div class="entity-group" data-group="badges">
      <div class="entity-group-header" @click=${()=>e._toggleGroupExpand(t,"badges")}>
        <input
          type="checkbox"
          class="group-checkbox"
          data-area-id=${t}
          data-group="badges"
          ?checked=${!h}
          .indeterminate=${p}
          @click=${e=>e.stopPropagation()}
          @change=${a=>{a.stopPropagation();const r=a.target.checked;e._groupVisibilityChanged(t,"badges",r,i)}}
        />
        <ha-icon icon="mdi:checkbox-multiple-blank-circle"></ha-icon>
        <span class="group-name">${(0,Ne.kg)("editor.domain_badges")}</span>
        <span class="entity-count">(${_})</span>
        <button
          class="expand-button-small ${y?"expanded":""}"
          @click=${i=>{i.stopPropagation(),e._toggleGroupExpand(t,"badges")}}
        >
          <span class="expand-icon-small">&#x25B6;</span>
        </button>
      </div>
      ${y?Te.qy`
            <div class="entity-list" data-area-id=${t} data-group="badges">
              ${i.map(i=>{const a=l.states[i],r=a?.attributes.friendly_name||i.split(".")[1].replace(/_/g," "),o=u.includes(i),s=f(i);return Te.qy`
                  <div class="entity-item">
                    <input
                      type="checkbox"
                      class="entity-checkbox"
                      ?checked=${!o}
                      @change=${a=>e._entityVisibilityChanged(t,"badges",i,a.target.checked)}
                    />
                    <span class="entity-name">${r}</span>
                    <input
                      type="checkbox"
                      class="badge-name-checkbox"
                      ?checked=${s}
                      title=${(0,Ne.kg)("editor.badges_show_name")}
                      @change=${a=>e._badgeShowNameChanged(t,i,a.target.checked)}
                    />
                    <span class="badge-name-label">${(0,Ne.kg)("editor.badges_name_short")}</span>
                    <span class="entity-id">${i}</span>
                  </div>
                `})}
              ${a.length>0?Te.qy`
                    <div class="badge-separator">${(0,Ne.kg)("editor.badges_additional")}</div>
                    ${a.map(i=>{const a=l.states[i],r=a?.attributes.friendly_name||i.split(".")[1].replace(/_/g," "),o=f(i);return Te.qy`
                        <div class="entity-item badge-additional-item">
                          <span class="entity-name">${r}</span>
                          <input
                            type="checkbox"
                            class="badge-name-checkbox"
                            ?checked=${o}
                            title=${(0,Ne.kg)("editor.badges_show_name")}
                            @change=${a=>e._badgeShowNameChanged(t,i,a.target.checked)}
                          />
                          <span class="badge-name-label">${(0,Ne.kg)("editor.badges_name_short")}</span>
                          <span class="entity-id">${i}</span>
                          <button
                            class="badge-remove-btn"
                            title=${(0,Ne.kg)("editor.badges_remove")}
                            @click=${()=>e._badgeAdditionalChanged(t,i,!1)}
                          >
                            &#x2715;
                          </button>
                        </div>
                      `})}
                  `:Te.s6}
              ${r.length>0?Te.qy`
                    <div class="badge-add-section">
                      <select class="badge-entity-picker" data-area-id=${t}>
                        <option value="">${(0,Ne.kg)("editor.badges_select_entity")}</option>
                        ${r.map(e=>Te.qy` <option value=${e.entity_id}>${e.name} (${e.entity_id})</option> `)}
                      </select>
                      <button class="badge-add-button" @click=${i=>e._addBadgeFromPicker(i,t)}>
                        ${(0,Ne.kg)("editor.badges_add")}
                      </button>
                    </div>
                  `:Te.s6}
            </div>
          `:Te.s6}
    </div>
  `}(this._roomOptionsHost,e,t,i,a,r,o,s,n,c)}async _loadAreaEntities(e){if(!this._hass)return;const t=(0,at.NS)(e,this._hass,this._config),i=(0,at.vZ)(t,this._hass,(0,at.H2)(t,this._hass),{includeCameras:!1}),a=zt(e,this._config),r=Nt(e,this._config),o=(0,at.Rl)(t,this._hass),s=jt(e,this._config),n=(0,at.OT)(t,this._hass,[...o,...s]),c=Tt(o,this._hass),{namesVisible:d,namesHidden:l}=Mt(e,this._config);this._areaEntitiesCache.set(e,{groupedEntities:i,hiddenEntities:a,entityOrders:r,badgeCandidates:o,additionalBadges:s,availableEntities:n,defaultShowNames:c,namesVisible:d,namesHidden:l}),this.requestUpdate()}_refreshAreaCache(e){if(!this._hass||!this._areaEntitiesCache.has(e))return;const t=this._areaEntitiesCache.get(e).groupedEntities,i=zt(e,this._config),a=Nt(e,this._config),r=(0,at.NS)(e,this._hass,this._config),o=(0,at.Rl)(r,this._hass),s=jt(e,this._config),n=(0,at.OT)(r,this._hass,[...o,...s]),c=Tt(o,this._hass),{namesVisible:d,namesHidden:l}=Mt(e,this._config);this._areaEntitiesCache.set(e,{groupedEntities:t,hiddenEntities:i,entityOrders:a,badgeCandidates:o,additionalBadges:s,availableEntities:n,defaultShowNames:c,namesVisible:d,namesHidden:l})}_toggleChanged(e,t,i){if(!this._hass)return;const a={...this._config,[e]:t};t===Ge(e,this._config,i)&&delete a[e],this._config=a,this._fireConfigChanged(a)}_setCctvOptions(e){if(!this._hass)return;const t={...this._config,...e};this._config=t,this._fireConfigChanged(t)}_simpleOptionChanged(e,t,i){const a={...this._config};t===Ge(e,this._config,i)?delete a[e]:a[e]=t,this._config=a,this._fireConfigChanged(this._config)}_addCustomView(){const e=[...this._config.custom_views||[]];e.push({title:(0,Ne.kg)("editor.new_view"),path:`custom-view-${e.length+1}`,icon:"mdi:card-text-outline",yaml:"",parsed_config:void 0});const t={...this._config,custom_views:e};this._config=t,this._fireConfigChanged(t)}async _loadRefDashboards(){if(this._refDashboardsLoading||!this._hass)return;this._refDashboardsLoading=!0;const e=[];try{const t=await this._hass.callWS({type:"lovelace/dashboards/list"}),i=[{url_path:"lovelace",title:(0,Ne.kg)("editor.ref_default_dashboard")},...t.filter(e=>e.url_path&&"lovelace"!==e.url_path)];await Promise.all(i.map(async t=>{try{const i=await this._hass.callWS({type:"lovelace/config",url_path:"lovelace"===t.url_path?null:t.url_path});if(i.strategy)return;const a=(i.views||[]).map((e,t)=>({path:"string"==typeof e.path?e.path:void 0,title:"string"==typeof e.title?e.title:void 0,icon:"string"==typeof e.icon?e.icon:void 0,index:t}));a.length&&e.push({...t,views:a})}catch{}}))}catch{}e.sort((e,t)=>e.title.localeCompare(t.title)),this._refDashboards=e,this._refDashboardsLoading=!1,this.requestUpdate()}_refDashboardChanged(e,t){const i=[...this._config.custom_views||[]];if(!i[e])return;i[e]={...i[e],ref_dashboard:t,ref_view:""};const a={...this._config,custom_views:i};this._config=a,this._fireConfigChanged(a)}_refViewChanged(e,t){const i=[...this._config.custom_views||[]],a=i[e];if(!a)return;const r=this._refDashboards?.find(e=>e.url_path===a.ref_dashboard),o=r?.views.find(e=>(e.path??String(e.index))===t),s={...a,ref_view:t};s.title||(s.title=o?.title||(0,Ne.kg)("editor.new_view")),s.icon||(s.icon=o?.icon||"mdi:link-variant"),s.path||(s.path=this._uniqueCustomViewPath(o?.path||`custom-view-${e+1}`,e)),i[e]=s;const n={...this._config,custom_views:i};this._config=n,this._fireConfigChanged(n)}_uniqueCustomViewPath(e,t){const i=new Set(["home","lights","covers","security","batteries","climate","maintenance","cctv",...Object.keys(this._hass?.areas||{}),...(this._config.custom_views||[]).filter((e,i)=>i!==t).map(e=>e.path).filter(e=>!!e)]);if(!i.has(e))return e;let a=1,r=`${e}-ref`;for(;i.has(r);)r=`${e}-ref${++a}`;return r}_removeCustomView(e){const t=[...this._config.custom_views||[]];t.splice(e,1);const i={...this._config};0===t.length?delete i.custom_views:i.custom_views=t,this._config=i,this._fireConfigChanged(i)}_updateCustomViewField(e,t,i){const a=[...this._config.custom_views||[]];if(!a[e])return;a[e]={...a[e],[t]:i};const r={...this._config,custom_views:a};this._config=r,this._fireConfigChanged(r)}_updateCustomViewAfterView(e,t){const i=[...this._config.custom_views||[]],a=i[e];if(!a)return;const r={...a};t?r.after_view=t:delete r.after_view,i[e]=r;const o={...this._config,custom_views:i};this._config=o,this._fireConfigChanged(o)}_updateCustomViewYaml(e,t){const i=[...this._config.custom_views||[]];if(!i[e])return;const a={...i[e],yaml:t};delete a._yaml_error;const r=je(t,"YAML muss ein Objekt ergeben");a.parsed_config=r.parsed_config,a._yaml_error=r._yaml_error,i[e]=a;const o={...this._config,custom_views:i};this._config=o,this._fireConfigChanged(o)}_customCardsHeadingChanged(e){const t=e.target.value.trim(),i={...this._config};t?i.custom_cards_heading=t:delete i.custom_cards_heading,this._config=i,this._fireConfigChanged(i)}_customCardsIconChanged(e){const t=e.target.value.trim(),i={...this._config};t?i.custom_cards_icon=t:delete i.custom_cards_icon,this._config=i,this._fireConfigChanged(i)}_removeCustomCard(e){const t=[...this._config.custom_cards||[]];t.splice(e,1);const i={...this._config};0===t.length?delete i.custom_cards:i.custom_cards=t,this._config=i,this._fireConfigChanged(i)}_updateCustomCardField(e,t,i){const a=[...this._config.custom_cards||[]];if(!a[e])return;a[e]={...a[e],[t]:i};const r={...this._config,custom_cards:a};this._config=r,this._fireConfigChanged(r)}_updateCustomCardYaml(e,t){const i=[...this._config.custom_cards||[]];if(!i[e])return;const a={...i[e],yaml:t};delete a._yaml_error;const r=je(t,"YAML muss ein Objekt oder Array ergeben");a.parsed_config=r.parsed_config,a._yaml_error=r._yaml_error,i[e]=a;const o={...this._config,custom_cards:i};if(a._yaml_error)return this._config=o,void this.requestUpdate();this._config=o,this._fireConfigChanged(o)}_addCustomSection(){const e=[...this._config.custom_sections||[]];e.push({title:"",icon:"",cards:[]});const t={...this._config,custom_sections:e};this._config=t,this._fireConfigChanged(t)}_removeCustomSection(e){const t=[...this._config.custom_sections||[]];t.splice(e,1);const i={...this._config};0===t.length?delete i.custom_sections:i.custom_sections=t,this._config=i,this._fireConfigChanged(i)}_updateCustomSectionField(e,t,i){const a=[...this._config.custom_sections||[]];if(!a[e])return;a[e]={...a[e],[t]:i};const r={...this._config,custom_sections:a};this._config=r,this._fireConfigChanged(r)}_updateCustomSectionYaml(e,t){const i=[...this._config.custom_sections||[]];if(!i[e])return;const a={...i[e],yaml:t},r=je(t,(0,Ne.kg)("editor.custom_section_yaml_invalid"));a.parsed_config=r.parsed_config,a._yaml_error=r._yaml_error,i[e]=a;const o={...this._config,custom_sections:i};this._config=o,a._yaml_error?this.requestUpdate():this._fireConfigChanged(o)}_removeCardFromSection(e,t){const i=[...this._config.custom_sections||[]];if(!i[e])return;const a={...i[e]},r=[...a.cards||[]];r.splice(t,1),a.cards=r,i[e]=a;const o={...this._config,custom_sections:i};this._config=o,this._fireConfigChanged(o)}_updateSectionCardField(e,t,i,a){const r=[...this._config.custom_sections||[]];if(!r[e])return;const o={...r[e]},s=[...o.cards||[]];if(!s[t])return;s[t]={...s[t],[i]:a},o.cards=s,r[e]=o;const n={...this._config,custom_sections:r};this._config=n,this._fireConfigChanged(n)}_updateSectionCardYaml(e,t,i){const a=[...this._config.custom_sections||[]];if(!a[e])return;const r={...a[e]},o=[...r.cards||[]];if(!o[t])return;const s={...o[t],yaml:i};delete s._yaml_error;const n=je(i,"YAML muss ein Objekt oder Array ergeben");s.parsed_config=n.parsed_config,s._yaml_error=n._yaml_error,o[t]=s,r.cards=o,a[e]=r;const c={...this._config,custom_sections:a};if(s._yaml_error)return this._config=c,void this.requestUpdate();this._config=c,this._fireConfigChanged(c)}_getAreaCustomCards(e){return[...this._config.areas_options?.[e]?.custom_cards||[]]}_writeAreaCustomCards(e,t){const i={...this._config.areas_options?.[e]||{}};0===t.length?delete i.custom_cards:i.custom_cards=t;const a={...this._config.areas_options,[e]:i};0===Object.keys(a[e]).length&&delete a[e];const r={...this._config,areas_options:a};r.areas_options&&0===Object.keys(r.areas_options).length&&delete r.areas_options,this._config=r,this._fireConfigChanged(r)}_addAreaCustomCard(e){const t=this._getAreaCustomCards(e);t.push({mode:"yaml",position:"bottom",editor_title:"",yaml:"",parsed_config:void 0}),this._writeAreaCustomCards(e,t)}_removeAreaCustomCard(e,t){const i=this._getAreaCustomCards(e);t<0||t>=i.length||(i.splice(t,1),this._writeAreaCustomCards(e,i))}_updateAreaCustomCardField(e,t,i,a){const r=this._getAreaCustomCards(e);if(!r[t])return;const o={...r[t],[i]:a};"mode"===i&&"tile"!==a&&this._parseAreaCustomCardYamlConfig(o,o.yaml||""),"mode"===i&&"tile"===a&&delete o._yaml_error,r[t]=o,this._writeAreaCustomCards(e,r)}_parseAreaCustomCardYamlConfig(e,t){if(e.yaml=t,delete e._yaml_error,t.trim())try{const i=xe.load(t);if(i&&"object"==typeof i){if("section"===e.mode){if(!(Array.isArray(i)?i:[i]).every(e=>e&&"object"==typeof e&&Array.isArray(e.cards)))return e._yaml_error="Section-YAML muss ein Objekt oder Array mit cards enthalten",void(e.parsed_config=void 0)}e.parsed_config=i}else e._yaml_error="YAML muss ein Objekt oder Array ergeben",e.parsed_config=void 0}catch(t){const i=t instanceof Error?t.message.split("\n")[0]:"Ungültiges YAML";e._yaml_error=i||"Ungültiges YAML",e.parsed_config=void 0}else e.parsed_config=void 0}_updateAreaCustomCardYaml(e,t,i){const a=this._getAreaCustomCards(e);if(!a[t])return;const r={...a[t]};this._parseAreaCustomCardYamlConfig(r,i),a[t]=r,this._writeAreaCustomCards(e,a)}_addCustomBadge(){const e=[...this._config.custom_badges||[]];e.push({yaml:"",parsed_config:void 0});const t={...this._config,custom_badges:e};this._config=t,this._fireConfigChanged(t)}_removeCustomBadge(e){const t=[...this._config.custom_badges||[]];t.splice(e,1);const i={...this._config};0===t.length?delete i.custom_badges:i.custom_badges=t,this._config=i,this._fireConfigChanged(i)}_updateCustomBadgeYaml(e,t){const i=[...this._config.custom_badges||[]];if(!i[e])return;const a={...i[e],yaml:t};delete a._yaml_error;const r=je(t,"YAML muss ein Objekt ergeben");a.parsed_config=r.parsed_config,a._yaml_error=r._yaml_error,i[e]=a;const o={...this._config,custom_badges:i};this._config=o,this._fireConfigChanged(o)}_areaVisibilityChanged(e,t){if(!this._hass)return;let i=[...this._config.areas_display?.hidden||[]];t?i=i.filter(t=>t!==e):(i.includes(e)||i.push(e),this._expandedAreas.delete(e),this._expandedGroups.delete(e),this._areaEntitiesCache.delete(e));const a={...this._config,areas_display:{...this._config.areas_display,hidden:i}};0===a.areas_display?.hidden?.length&&delete a.areas_display.hidden,a.areas_display&&0===Object.keys(a.areas_display).length&&delete a.areas_display,this._invalidateWeatherStartOptionsCaches(),this._config=a,this._fireConfigChanged(a)}_areaNavPinChanged(e,t){let i=[...this._config.areas_display?.nav_items||[]];t?i.includes(e)||i.push(e):i=i.filter(t=>t!==e);const a={...this._config,areas_display:{...this._config.areas_display,nav_items:i}};0===a.areas_display?.nav_items?.length&&delete a.areas_display.nav_items,a.areas_display&&0===Object.keys(a.areas_display).length&&delete a.areas_display,this._config=a,this._fireConfigChanged(a)}_toggleAreaExpand(e,t){e.stopPropagation();const i=new Set(this._expandedAreas);if(i.has(t)){i.delete(t);const e=new Map(this._expandedGroups);e.delete(t),this._expandedGroups=e}else i.add(t),this._areaEntitiesCache.has(t)||this._loadAreaEntities(t);this._expandedAreas=i}_toggleGroupExpand(e,t){const i=new Map(this._expandedGroups),a=new Set(i.get(e)||[]);a.has(t)?a.delete(t):a.add(t),a.size>0?i.set(e,a):i.delete(e),this._expandedGroups=i}_groupVisibilityChanged(e,t,i,a){if(!this._hass)return;const r=((this._config.areas_options?.[e]||{}).groups_options||{})[t];let o=[...r?.hidden||[]];o=i?o.filter(e=>!a.includes(e)):[...new Set([...o,...a])],this._updateEntityConfig(e,t,o)}_entityVisibilityChanged(e,t,i,a){if(!this._hass)return;if("badges_additional"===t)return void this._badgeAdditionalChanged(e,i,a);if("badges_show_name"===t)return void this._badgeShowNameChanged(e,i,a);const r=((this._config.areas_options?.[e]||{}).groups_options||{})[t];let o=[...r?.hidden||[]];a?o=o.filter(e=>e!==i):o.includes(i)||o.push(i),this._updateEntityConfig(e,t,o)}_updateEntityConfig(e,t,i){const a=this._config.areas_options?.[e]||{},r=a.groups_options||{},o={...r[t],hidden:i};0===o.hidden.length&&delete o.hidden;const s={...r,[t]:o};0===Object.keys(s[t]).length&&delete s[t];const n={...a,groups_options:s};0===Object.keys(n.groups_options).length&&delete n.groups_options;const c={...this._config.areas_options,[e]:n};0===Object.keys(c[e]).length&&delete c[e];const d={...this._config,areas_options:c};d.areas_options&&0===Object.keys(d.areas_options).length&&delete d.areas_options,this._config=d,this._fireConfigChanged(d),this._refreshAreaCache(e)}_badgeAdditionalChanged(e,t,i){if(!this._config)return;const a=this._config.areas_options?.[e]||{},r=a.groups_options||{},o=r.badges||{};let s=[...o.additional||[]];i?s.includes(t)||s.push(t):s=s.filter(e=>e!==t);const n={...o};s.length>0?n.additional=s:delete n.additional;const c={...r,badges:n};0===Object.keys(c.badges).length&&delete c.badges;const d={...a,groups_options:c};0===Object.keys(d.groups_options).length&&delete d.groups_options;const l={...this._config.areas_options,[e]:d};0===Object.keys(l[e]).length&&delete l[e];const _={...this._config,areas_options:l};_.areas_options&&0===Object.keys(_.areas_options).length&&delete _.areas_options,this._config=_,this._fireConfigChanged(_),this._refreshAreaCache(e)}_badgeShowNameChanged(e,t,i){if(!this._config||!this._hass)return;const a=this._config.areas_options?.[e]||{},r=a.groups_options||{},o=r.badges||{};let s=[...o.names_visible||[]],n=[...o.names_hidden||[]];const c=this._hass.states[t],d=c?.attributes?.device_class;i===(0,ze.g7)(d)?(s=s.filter(e=>e!==t),n=n.filter(e=>e!==t)):i?(s.includes(t)||s.push(t),n=n.filter(e=>e!==t)):(s=s.filter(e=>e!==t),n.includes(t)||n.push(t));const l={...o};s.length>0?l.names_visible=s:delete l.names_visible,n.length>0?l.names_hidden=n:delete l.names_hidden;const _={...r,badges:l};0===Object.keys(_.badges).length&&delete _.badges;const u={...a,groups_options:_};0===Object.keys(u.groups_options).length&&delete u.groups_options;const h={...this._config.areas_options,[e]:u};0===Object.keys(h[e]).length&&delete h[e];const p={...this._config,areas_options:h};p.areas_options&&0===Object.keys(p.areas_options).length&&delete p.areas_options,this._config=p,this._fireConfigChanged(p),this._refreshAreaCache(e)}_addBadgeFromPicker(e,t){e.stopPropagation();const i=this.shadowRoot.querySelector(`.badge-entity-picker[data-area-id="${t}"]`);if(!i||!i.value)return;const a=i.value;this._badgeAdditionalChanged(t,a,!0),i.value=""}_getAreaOrder(){if(!this._hass)return[];const e=this._getNormalizedAreasDisplay()?.order;return e&&e.length>0?[...e]:Object.keys(this._hass.areas||{})}_updateAreaOrder(e){const t={...this._config,areas_display:{...this._config.areas_display,order:e}};this._invalidateWeatherStartOptionsCaches(),this._config=t,this._fireConfigChanged(t)}_fireConfigChanged(e){this._isUpdatingConfig=!0;const t=function(e){const t={...e};return delete t.overview_layout,delete t.sections_order,t}(e);delete t.inline_editor,t.custom_views&&(t.custom_views=t.custom_views.map(e=>{const t={...e};return delete t._yaml_error,t})),t.custom_cards&&(t.custom_cards=t.custom_cards.map(e=>{const t={...e};return delete t._yaml_error,t})),t.custom_badges&&(t.custom_badges=t.custom_badges.map(e=>{const t={...e};return delete t._yaml_error,t})),t.custom_sections&&(t.custom_sections=t.custom_sections.map(e=>{const t={...e};return delete t._yaml_error,t.cards=(e.cards||[]).map(e=>{const t={...e};return delete t._yaml_error,t}),t})),t.weather_start_layout_items&&(t.weather_start_layout_items=t.weather_start_layout_items.map(e=>{const t={...e};return delete t._yaml_error,t}));const i=this._getNormalizedAreasDisplay(t);i?t.areas_display=i:delete t.areas_display;const a=this._hass?new Set(Object.keys(this._hass.areas||{})):null;if(t.areas_options){const e=function(e){if(!e)return;const t={};for(const[i,a]of Object.entries(e)){const e={...a};delete e.webrtc_cameras,Object.keys(e).length>0&&(t[i]=e)}return Object.keys(t).length>0?t:void 0}(t.areas_options),i={};for(const[t,r]of Object.entries(e||{})){if(a&&!a.has(t))continue;const e={...r};if(r.custom_cards&&(e.custom_cards=r.custom_cards.map(e=>{const t={...e};return delete t._yaml_error,t})),r.view_override){const t={...r.view_override};delete t._yaml_error,e.view_override=t}Object.keys(e).length>0&&(i[t]=e)}Object.keys(i).length>0?t.areas_options=i:delete t.areas_options}this._config=e,function(e,t){e.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}(this,t),setTimeout(()=>{this._isUpdatingConfig=!1},0)}_openCardPickerForSection(e){this._openCardPicker(t=>{const i=xe.dump(t).trim(),a=[...this._config.custom_sections||[]];if(!a[e])return;const r={...a[e]};r.cards=[...r.cards||[],{editor_title:"",yaml:i,parsed_config:t}],a[e]=r;const o={...this._config,custom_sections:a};this._config=o,this._fireConfigChanged(o)})}_openCardPickerForAreaCustomCard(e){this._openCardPicker(t=>{const i=xe.dump(t).trim(),a=this._getAreaCustomCards(e);a.push({mode:"yaml",position:"bottom",editor_title:"",yaml:i,parsed_config:t}),this._writeAreaCustomCards(e,a)})}_openCardEditorForCustomCard(e){const t=this._config.custom_cards?.[e],i=this._getEditableYamlCardConfig(t);i&&this._openCardPicker(t=>{this._updateCustomCardYaml(e,xe.dump(t).trim())},i)}_openCardEditorForSectionCard(e,t){const i=this._config.custom_sections?.[e]?.cards?.[t],a=this._getEditableYamlCardConfig(i);a&&this._openCardPicker(i=>{this._updateSectionCardYaml(e,t,xe.dump(i).trim())},a)}_openCardEditorForAreaCustomCard(e,t){const i=this._getAreaCustomCards(e)[t],a=this._getEditableAreaCardConfig(i);a&&this._openCardPicker(i=>{const a=this._getAreaCustomCards(e);if(!a[t])return;const r={...a[t],mode:"yaml",yaml:xe.dump(i).trim(),parsed_config:i};delete r._yaml_error,a[t]=r,this._writeAreaCustomCards(e,a)},a)}_getEditableAreaCardConfig(e){return function(e,t){return t?"tile"===(t.mode||"yaml")&&t.entity?{type:"tile",entity:t.entity}:e._getEditableYamlCardConfig(t):null}(this._cardPickerHost,e)}_getEditableYamlCardConfig(e){return function(e,t){if(t?.parsed_config&&"object"==typeof t.parsed_config&&!Array.isArray(t.parsed_config))return t.parsed_config;if(!t?.yaml?.trim())return null;try{const e=xe.load(t.yaml);return e&&"object"==typeof e&&!Array.isArray(e)?e:null}catch{return null}}(this._cardPickerHost,e)}_openCardPicker(e,t){return function(e,t,i){e._cardPickerCallback=t,e._cardPickerConfig=i||null,e._cardPickerOpen=!0,e._cardPickerStep=i?"editor":"type",e._cardPickerSearch="",e._cardPickerSelectedType="string"==typeof i?.type?i.type:"",e._cardPickerYaml=i?xe.dump(i).trim():"",e._cardPickerHasVisualEditor=!1}(this._cardPickerHost,e,t)}_closeCardPicker(){return function(e){e._cardPickerOpen=!1,e._cardPickerCallback=null,e._cardPickerConfig=null;const t=e.shadowRoot?.querySelector(".card-editor-visual-host");t?.replaceChildren()}(this._cardPickerHost)}_selectCardType(e){return function(e,t){e._cardPickerSelectedType=t,e._cardPickerStep="editor";const i=Me.find(e=>e.type===t);if(i){e._cardPickerYaml=i.template;try{const t=xe.load(i.template);t&&"object"==typeof t&&!Array.isArray(t)&&(e._cardPickerConfig=t)}catch{}}else e._cardPickerYaml=`type: ${t}\n`,e._cardPickerConfig={type:t};e._cardPickerHasVisualEditor=!1}(this._cardPickerHost,e)}_cardPickerYamlChanged(e){return function(e,t){const i=t.target.value;e._cardPickerYaml=i;try{const t=xe.load(i);t&&"object"==typeof t&&!Array.isArray(t)&&(e._cardPickerConfig=t)}catch{}}(this._cardPickerHost,e)}_confirmCardPicker(){var e;(e=this._cardPickerHost)._cardPickerConfig&&e._cardPickerCallback&&(e._cardPickerCallback(e._cardPickerConfig),e._closeCardPicker())}updated(e){super.updated(e),this._openingMeasured||((0,Je.PZ)("editor-open"),this._openingMeasured=!0),this._cardPickerOpen&&"editor"===this._cardPickerStep&&!this._cardPickerHasVisualEditor&&this._tryMountVisualCardEditor()}_tryMountVisualCardEditor(){return function(e){const t=e.shadowRoot?.querySelector(".card-editor-visual-host");if(t&&!t.firstChild&&customElements.get("hui-card-element-editor"))try{const i=document.createElement("hui-card-element-editor");i.hass=e._hass,i.value=e._cardPickerConfig||{type:e._cardPickerSelectedType},i.addEventListener("config-changed",t=>{const i=t.detail?.config;i&&"object"==typeof i&&(e._cardPickerConfig=i,e._cardPickerYaml=xe.dump(i).trim(),e.requestUpdate("_cardPickerYaml"))}),t.appendChild(i),e._cardPickerHasVisualEditor=!0}catch{}}(this._cardPickerHost)}_renderCardPickerOverlay(){return"type"===(e=this._cardPickerHost)._cardPickerStep?e._renderCardTypePicker():e._renderCardEditor();var e}_renderCardTypePicker(){return function(e){const t=e._cardPickerSearch.toLowerCase(),i=Me.filter(e=>!t||e.type.includes(t)||e.name.toLowerCase().includes(t)),a=(window.customCards||[]).filter(e=>{const i=(e.type||"").toLowerCase(),a=(e.name||"").toLowerCase();return"webrtc-camera"!==i&&"custom:webrtc-camera"!==i&&!a.includes("webrtc")&&(!t||i.includes(t)||a.includes(t))});return Te.qy`
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
          ${i.map(t=>Te.qy`
              <button class="card-type-btn" @click=${()=>e._selectCardType(t.type)}>
                <ha-icon icon=${t.icon}></ha-icon>
                <span>${t.name}</span>
              </button>
            `)}
          ${a.map(t=>Te.qy`
              <button class="card-type-btn" @click=${()=>e._selectCardType(t.type)}>
                <ha-icon icon="mdi:puzzle"></ha-icon>
                <span>${t.name||t.type}</span>
              </button>
            `)}
        </div>
      </div>
    </div>
  `}(this._cardPickerHost)}_renderCardEditor(){return function(e){const t=Me.find(t=>t.type===e._cardPickerSelectedType)?.name||e._cardPickerSelectedType;return Te.qy`
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
          ${e._cardPickerHasVisualEditor?Te.s6:Te.qy`
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
  `}(this._cardPickerHost)}createWeatherLayoutHost(){const e=this;return{_addWeatherStartArea:this._addWeatherStartArea.bind(this),_addWeatherStartFloor:this._addWeatherStartFloor.bind(this),_addWeatherStartSection:this._addWeatherStartSection.bind(this),_addWeatherStartSummaries:this._addWeatherStartSummaries.bind(this),get _config(){return e._config},set _config(t){e._config=t},_countNestedFixedGrids:this._countNestedFixedGrids.bind(this),get _expandedWeatherBlocks(){return e._expandedWeatherBlocks},set _expandedWeatherBlocks(t){e._expandedWeatherBlocks=t},_getCustomCardEditorLabel:this._getCustomCardEditorLabel.bind(this),_getWeatherStartAreaOptions:this._getWeatherStartAreaOptions.bind(this),_getWeatherStartCustomCardIndex:this._getWeatherStartCustomCardIndex.bind(this),_getWeatherStartCustomSectionIndex:this._getWeatherStartCustomSectionIndex.bind(this),_getWeatherStartFloorOptions:this._getWeatherStartFloorOptions.bind(this),_getWeatherStartItemMeta:this._getWeatherStartItemMeta.bind(this),_getWeatherStartLayoutItems:this._getWeatherStartLayoutItems.bind(this),_handleWeatherStartDragEnd:this._handleWeatherStartDragEnd.bind(this),_handleWeatherStartDragLeave:this._handleWeatherStartDragLeave.bind(this),_handleWeatherStartDragOver:this._handleWeatherStartDragOver.bind(this),_handleWeatherStartDragStart:this._handleWeatherStartDragStart.bind(this),_handleWeatherStartDrop:this._handleWeatherStartDrop.bind(this),_isWeatherStartItemDisabled:this._isWeatherStartItemDisabled.bind(this),_openCardEditorForCustomCard:this._openCardEditorForCustomCard.bind(this),_openCardEditorForSectionCard:this._openCardEditorForSectionCard.bind(this),_openCardPickerForSection:this._openCardPickerForSection.bind(this),_openCardPickerForWeatherStartCard:this._openCardPickerForWeatherStartCard.bind(this),_removeCardFromSection:this._removeCardFromSection.bind(this),_removeWeatherStartItem:this._removeWeatherStartItem.bind(this),_renderWeatherStartCustomCardEditor:this._renderWeatherStartCustomCardEditor.bind(this),_renderWeatherStartCustomSectionEditor:this._renderWeatherStartCustomSectionEditor.bind(this),_resetWeatherStartItemYaml:this._resetWeatherStartItemYaml.bind(this),_toggleWeatherBlockExpanded:this._toggleWeatherBlockExpanded.bind(this),_toggleWeatherStartItemStack:this._toggleWeatherStartItemStack.bind(this),_updateCustomCardField:this._updateCustomCardField.bind(this),_updateCustomCardYaml:this._updateCustomCardYaml.bind(this),_updateCustomSectionField:this._updateCustomSectionField.bind(this),_updateSectionCardField:this._updateSectionCardField.bind(this),_updateSectionCardYaml:this._updateSectionCardYaml.bind(this),_updateWeatherStartItemYaml:this._updateWeatherStartItemYaml.bind(this),_weatherStartSummarySizeChanged:this._weatherStartSummarySizeChanged.bind(this),_parseWeatherStartItemYaml:this._parseWeatherStartItemYaml.bind(this),requestUpdate:this.requestUpdate.bind(this),_saveWeatherStartLayoutItems:this._saveWeatherStartLayoutItems.bind(this),_normalizeWeatherStartLayoutItems:this._normalizeWeatherStartLayoutItems.bind(this),_fireConfigChanged:this._fireConfigChanged.bind(this)}}createOptionPanelHost(){const e=this;return{get hass(){return e._hass},get config(){return e._config},editor:e,entityListState:this._entityListState,checkbox:this._renderCheckbox.bind(this),toggle:this._toggleChanged.bind(this),setOption:this._simpleOptionChanged.bind(this),update:t=>{const i={...e._config};t(i),e._config=i,e._fireConfigChanged(i)},requestUpdate:this.requestUpdate.bind(this),entityOptions:this._getAllEntitiesForSelect.bind(this),filterEntities:this._getFilteredEntities.bind(this),sortedAreas:this._getSortedAreas.bind(this)}}createRoomOptionsHost(){const e=this;return{_addAreaCustomCard:this._addAreaCustomCard.bind(this),_addBadgeFromPicker:this._addBadgeFromPicker.bind(this),_areaDisplayTypeOverrideChanged:this._areaDisplayTypeOverrideChanged.bind(this),get _areaEntitiesCache(){return e._areaEntitiesCache},set _areaEntitiesCache(t){e._areaEntitiesCache=t},_areaNavPinChanged:this._areaNavPinChanged.bind(this),_areaVisibilityChanged:this._areaVisibilityChanged.bind(this),_badgeAdditionalChanged:this._badgeAdditionalChanged.bind(this),_badgeShowNameChanged:this._badgeShowNameChanged.bind(this),get _config(){return e._config},set _config(t){e._config=t},_entityVisibilityChanged:this._entityVisibilityChanged.bind(this),get _expandedAreas(){return e._expandedAreas},set _expandedAreas(t){e._expandedAreas=t},get _expandedGroups(){return e._expandedGroups},set _expandedGroups(t){e._expandedGroups=t},_getAreaCustomCards:this._getAreaCustomCards.bind(this),_getCustomCardEditorLabel:this._getCustomCardEditorLabel.bind(this),_groupVisibilityChanged:this._groupVisibilityChanged.bind(this),_handleDragEnd:this._handleDragEnd.bind(this),_handleDragLeave:this._handleDragLeave.bind(this),_handleDragOver:this._handleDragOver.bind(this),_handleDragStart:this._handleDragStart.bind(this),_handleDrop:this._handleDrop.bind(this),get _hass(){return e._hass},set _hass(t){e._hass=t},_openCardEditorForAreaCustomCard:this._openCardEditorForAreaCustomCard.bind(this),_openCardPickerForAreaCustomCard:this._openCardPickerForAreaCustomCard.bind(this),_openDiagnosticLocation:this._openDiagnosticLocation.bind(this),_removeAreaCustomCard:this._removeAreaCustomCard.bind(this),_renderAreaCustomCardItem:this._renderAreaCustomCardItem.bind(this),_renderAreaCustomCardsSection:this._renderAreaCustomCardsSection.bind(this),_renderAreaDisplayTypeOverride:this._renderAreaDisplayTypeOverride.bind(this),_renderAreaEntities:this._renderAreaEntities.bind(this),_renderAreaViewOverride:this._renderAreaViewOverride.bind(this),_renderBadgeGroup:this._renderBadgeGroup.bind(this),_renderStackOrderPanel:this._renderStackOrderPanel.bind(this),_toggleAreaExpand:this._toggleAreaExpand.bind(this),_toggleGroupExpand:this._toggleGroupExpand.bind(this),_updateAreaCustomCardField:this._updateAreaCustomCardField.bind(this),_updateAreaCustomCardYaml:this._updateAreaCustomCardYaml.bind(this),_updateAreaViewOverride:this._updateAreaViewOverride.bind(this),_fireConfigChanged:this._fireConfigChanged.bind(this)}}createCustomViewsHost(){const e=this;return{get _config(){return e._config},get _hass(){return e._hass},get _refDashboards(){return e._refDashboards},_getSortedAreas:e._getSortedAreas.bind(e),_addCustomView:e._addCustomView.bind(e),_addCustomRefView:e._addCustomRefView,_loadRefDashboards:e._loadRefDashboards.bind(e),_refDashboardChanged:e._refDashboardChanged.bind(e),_refViewChanged:e._refViewChanged.bind(e),_removeCustomView:e._removeCustomView.bind(e),_updateCustomViewField:e._updateCustomViewField.bind(e),_updateCustomViewAfterView:e._updateCustomViewAfterView.bind(e),_updateCustomViewYaml:e._updateCustomViewYaml.bind(e)}}createCardPickerHost(){const e=this;return{get _cardPickerHasVisualEditor(){return e._cardPickerHasVisualEditor},set _cardPickerHasVisualEditor(t){e._cardPickerHasVisualEditor=t},get _cardPickerSearch(){return e._cardPickerSearch},set _cardPickerSearch(t){e._cardPickerSearch=t},get _cardPickerSelectedType(){return e._cardPickerSelectedType},set _cardPickerSelectedType(t){e._cardPickerSelectedType=t},get _cardPickerStep(){return e._cardPickerStep},set _cardPickerStep(t){e._cardPickerStep=t},get _cardPickerYaml(){return e._cardPickerYaml},set _cardPickerYaml(t){e._cardPickerYaml=t},_cardPickerYamlChanged:this._cardPickerYamlChanged.bind(this),_closeCardPicker:this._closeCardPicker.bind(this),_confirmCardPicker:this._confirmCardPicker.bind(this),_handlePickerOverlayClick:this._handlePickerOverlayClick.bind(this),_renderCardEditor:this._renderCardEditor.bind(this),_renderCardTypePicker:this._renderCardTypePicker.bind(this),_selectCardType:this._selectCardType.bind(this),requestUpdate:this.requestUpdate.bind(this),get shadowRoot(){return e.shadowRoot},get _cardPickerCallback(){return e._cardPickerCallback},set _cardPickerCallback(t){e._cardPickerCallback=t},get _cardPickerConfig(){return e._cardPickerConfig},set _cardPickerConfig(t){e._cardPickerConfig=t},get _cardPickerOpen(){return e._cardPickerOpen},set _cardPickerOpen(t){e._cardPickerOpen=t},get _hass(){return e._hass},set _hass(t){e._hass=t},_getEditableYamlCardConfig:this._getEditableYamlCardConfig.bind(this)}}}function jt(e,t){return t.areas_options?.[e]?.groups_options?.badges?.additional||[]}function Tt(e,t){const i=new Set;for(const a of e){const e=t.states[a];if(!e)continue;const r=e.attributes?.device_class;(0,ze.g7)(r)&&i.add(a)}return i}function Mt(e,t){const i=t.areas_options?.[e]?.groups_options?.badges;return{namesVisible:i?.names_visible||[],namesHidden:i?.names_hidden||[]}}function zt(e,t){const i=t.areas_options?.[e];if(!i||!i.groups_options)return{};const a={};for(const[e,t]of Object.entries(i.groups_options))t.hidden&&(a[e]=t.hidden);return a}function Nt(e,t){const i=t.areas_options?.[e];if(!i||!i.groups_options)return{};const a={};for(const[e,t]of Object.entries(i.groups_options))t.order&&(a[e]=t.order);return a}Kt.properties={_config:{state:!0},_expandedAreas:{state:!0},_expandedGroups:{state:!0},_expandedWeatherBlocks:{state:!0},_cardPickerOpen:{state:!0},_cardPickerStep:{state:!0},_cardPickerSearch:{state:!0},_cardPickerSelectedType:{state:!0},_cardPickerYaml:{state:!0},_cardPickerHasVisualEditor:{state:!0}},Kt.styles=lt,Kt._weatherStartBlockMeta=new Map(Object.entries({clock:{icon:"mdi:clock-outline",labelKey:"weather_start_blocks.clock"},date:{icon:"mdi:calendar-today",labelKey:"weather_start_blocks.date"},summaries:{icon:"mdi:view-dashboard-outline",labelKey:"weather_start_blocks.summaries"},favorites:{icon:"mdi:star",labelKey:"weather_start_blocks.favorites"},light_favorites:{icon:"mdi:lightbulb-star-outline",labelKey:"weather_start_blocks.light_favorites"},alarm:{icon:"mdi:shield-home",labelKey:"weather_start_blocks.alarm"},house_mode:{icon:"mdi:home-switch-outline",labelKey:"weather_start_blocks.house_mode"},search:{icon:"mdi:magnify",labelKey:"weather_start_blocks.search"},overview:{icon:"mdi:overscan",labelKey:"weather_start_blocks.overview"},weather_current:{icon:"mdi:weather-partly-cloudy",labelKey:"weather_start_blocks.weather_current"},weather_hourly:{icon:"mdi:clock-time-four-outline",labelKey:"weather_start_blocks.weather_hourly"},weather_daily:{icon:"mdi:calendar-week",labelKey:"weather_start_blocks.weather_daily"},weather_details:{icon:"mdi:gauge",labelKey:"weather_start_blocks.weather_details"},energy:{icon:"mdi:lightning-bolt",labelKey:"weather_start_blocks.energy"},plants:{icon:"mdi:flower",labelKey:"weather_start_blocks.plants"},agenda:{icon:"mdi:calendar",labelKey:"weather_start_blocks.agenda"},todos:{icon:"mdi:check-circle-outline",labelKey:"weather_start_blocks.todos"},persons:{icon:"mdi:account-group",labelKey:"weather_start_blocks.persons"},vacuums:{icon:"mdi:robot-vacuum",labelKey:"weather_start_blocks.vacuums"},maintenance:{icon:"mdi:wrench-clock",labelKey:"weather_start_blocks.maintenance"},quick_actions:{icon:"mdi:gesture-tap-button",labelKey:"weather_start_blocks.quick_actions"},media:{icon:"mdi:play-circle-outline",labelKey:"weather_start_blocks.media"},activity:{icon:"mdi:history",labelKey:"weather_start_blocks.activity"},areas:{icon:"mdi:floor-plan",labelKey:"weather_start_blocks.areas"},custom_cards:{icon:"mdi:cards",labelKey:"weather_start_blocks.custom_cards"},custom_sections:{icon:"mdi:view-grid-plus-outline",labelKey:"weather_start_blocks.custom_sections"}})),Kt._sectionMeta=new Map([["overview",{icon:"mdi:home-outline",labelKey:"sections.overview"}],["custom_cards",{icon:"mdi:cards",labelKey:"sections.custom_cards"}],["areas",{icon:"mdi:floor-plan",labelKey:"sections.areas"}],["weather",{icon:"mdi:weather-partly-cloudy",labelKey:"sections.weather"}],["energy",{icon:"mdi:lightning-bolt",labelKey:"sections.energy"}]]),customElements.define("dashboard-strategy-editor",Kt)}}]);