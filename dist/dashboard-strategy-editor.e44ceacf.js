"use strict";(self.webpackChunkdashboard_strategy=self.webpackChunkdashboard_strategy||[]).push([[8],{580(e,t,i){var r=i(684),a=i(534),o=Object.create,s=Object.defineProperty,n=Object.getOwnPropertyDescriptor,c=Object.getOwnPropertyNames,l=Object.getPrototypeOf,d=Object.prototype.hasOwnProperty,p=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),h=(e,t,i)=>(i=null!=e?o(l(e)):{},((e,t,i,r)=>{if(t&&"object"==typeof t||"function"==typeof t)for(var a,o=c(t),l=0,p=o.length;l<p;l++)a=o[l],d.call(e,a)||void 0===a||s(e,a,{get:(e=>t[e]).bind(null,a),enumerable:!(r=n(t,a))||r.enumerable});return e})(!t&&e&&e.__esModule?i:s(i,"default",{value:e,enumerable:!0}),e)),_=p((e,t)=>{function i(e){return null==e}t.exports.isNothing=i,t.exports.isObject=function(e){return"object"==typeof e&&null!==e},t.exports.toArray=function(e){return Array.isArray(e)?e:i(e)?[]:[e]},t.exports.repeat=function(e,t){let i="";for(let r=0;r<t;r+=1)i+=e;return i},t.exports.isNegativeZero=function(e){return 0===e&&Number.NEGATIVE_INFINITY===1/e},t.exports.extend=function(e,t){if(t){const i=Object.keys(t);for(let r=0,a=i.length;r<a;r+=1){const a=i[r];e[a]=t[a]}}return e}}),u=p((e,t)=>{function i(e,t){let i="";const r=e.reason||"(unknown reason)";return e.mark?(e.mark.name&&(i+='in "'+e.mark.name+'" '),i+="("+(e.mark.line+1)+":"+(e.mark.column+1)+")",!t&&e.mark.snippet&&(i+="\n\n"+e.mark.snippet),r+" "+i):r}function r(e,t){Error.call(this),this.name="YAMLException",this.reason=e,this.mark=t,this.message=i(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=(new Error).stack||""}r.prototype=Object.create(Error.prototype),r.prototype.constructor=r,r.prototype.toString=function(e){return this.name+": "+i(this,e)},t.exports=r}),m=p((e,t)=>{var i=_();function r(e,t,i,r,a){let o="",s="";const n=Math.floor(a/2)-1;return r-t>n&&(o=" ... ",t=r-n+o.length),i-r>n&&(s=" ...",i=r+n-s.length),{str:o+e.slice(t,i).replace(/\t/g,"→")+s,pos:r-t+o.length}}function a(e,t){return i.repeat(" ",t-e.length)+e}t.exports=function(e,t){if(t=Object.create(t||null),!e.buffer)return null;t.maxLength||(t.maxLength=79),"number"!=typeof t.indent&&(t.indent=1),"number"!=typeof t.linesBefore&&(t.linesBefore=3),"number"!=typeof t.linesAfter&&(t.linesAfter=2);const o=/\r?\n|\r|\0/g,s=[0],n=[];let c,l=-1;for(;c=o.exec(e.buffer);)n.push(c.index),s.push(c.index+c[0].length),e.position<=c.index&&l<0&&(l=s.length-2);l<0&&(l=s.length-1);let d="";const p=Math.min(e.line+t.linesAfter,n.length).toString().length,h=t.maxLength-(t.indent+p+3);for(let o=1;o<=t.linesBefore&&!(l-o<0);o++){const c=r(e.buffer,s[l-o],n[l-o],e.position-(s[l]-s[l-o]),h);d=i.repeat(" ",t.indent)+a((e.line-o+1).toString(),p)+" | "+c.str+"\n"+d}const _=r(e.buffer,s[l],n[l],e.position,h);d+=i.repeat(" ",t.indent)+a((e.line+1).toString(),p)+" | "+_.str+"\n",d+=i.repeat("-",t.indent+p+3+_.pos)+"^\n";for(let o=1;o<=t.linesAfter&&!(l+o>=n.length);o++){const c=r(e.buffer,s[l+o],n[l+o],e.position-(s[l]-s[l+o]),h);d+=i.repeat(" ",t.indent)+a((e.line+o+1).toString(),p)+" | "+c.str+"\n"}return d.replace(/\n$/,"")}}),g=p((e,t)=>{var i=u(),r=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],a=["scalar","sequence","mapping"];t.exports=function(e,t){if(t=t||{},Object.keys(t).forEach(function(t){if(-1===r.indexOf(t))throw new i('Unknown option "'+t+'" is met in definition of "'+e+'" YAML type.')}),this.options=t,this.tag=e,this.kind=t.kind||null,this.resolve=t.resolve||function(){return!0},this.construct=t.construct||function(e){return e},this.instanceOf=t.instanceOf||null,this.predicate=t.predicate||null,this.represent=t.represent||null,this.representName=t.representName||null,this.defaultStyle=t.defaultStyle||null,this.multi=t.multi||!1,this.styleAliases=function(e){const t={};return null!==e&&Object.keys(e).forEach(function(i){e[i].forEach(function(e){t[String(e)]=i})}),t}(t.styleAliases||null),-1===a.indexOf(this.kind))throw new i('Unknown kind "'+this.kind+'" is specified for "'+e+'" YAML type.')}}),f=p((e,t)=>{var i=u(),r=g();function a(e,t){const i=[];return e[t].forEach(function(e){let t=i.length;i.forEach(function(i,r){i.tag===e.tag&&i.kind===e.kind&&i.multi===e.multi&&(t=r)}),i[t]=e}),i}function o(e){return this.extend(e)}o.prototype.extend=function(e){let t=[],s=[];if(e instanceof r)s.push(e);else if(Array.isArray(e))s=s.concat(e);else{if(!e||!Array.isArray(e.implicit)&&!Array.isArray(e.explicit))throw new i("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");e.implicit&&(t=t.concat(e.implicit)),e.explicit&&(s=s.concat(e.explicit))}t.forEach(function(e){if(!(e instanceof r))throw new i("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(e.loadKind&&"scalar"!==e.loadKind)throw new i("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(e.multi)throw new i("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),s.forEach(function(e){if(!(e instanceof r))throw new i("Specified list of YAML types (or a single Type object) contains a non-Type object.")});const n=Object.create(o.prototype);return n.implicit=(this.implicit||[]).concat(t),n.explicit=(this.explicit||[]).concat(s),n.compiledImplicit=a(n,"implicit"),n.compiledExplicit=a(n,"explicit"),n.compiledTypeMap=function(){const e={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}};function t(t){t.multi?(e.multi[t.kind].push(t),e.multi.fallback.push(t)):e[t.kind][t.tag]=e.fallback[t.tag]=t}for(let e=0,i=arguments.length;e<i;e+=1)arguments[e].forEach(t);return e}(n.compiledImplicit,n.compiledExplicit),n},t.exports=o}),y=p((e,t)=>{t.exports=new(g())("tag:yaml.org,2002:str",{kind:"scalar",construct:function(e){return null!==e?e:""}})}),v=p((e,t)=>{t.exports=new(g())("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(e){return null!==e?e:[]}})}),b=p((e,t)=>{t.exports=new(g())("tag:yaml.org,2002:map",{kind:"mapping",construct:function(e){return null!==e?e:{}}})}),x=p((e,t)=>{t.exports=new(f())({explicit:[y(),v(),b()]})}),w=p((e,t)=>{var i=g();t.exports=new i("tag:yaml.org,2002:null",{kind:"scalar",resolve:function(e){if(null===e)return!0;const t=e.length;return 1===t&&"~"===e||4===t&&("null"===e||"Null"===e||"NULL"===e)},construct:function(){return null},predicate:function(e){return null===e},represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"})}),C=p((e,t)=>{var i=g();t.exports=new i("tag:yaml.org,2002:bool",{kind:"scalar",resolve:function(e){if(null===e)return!1;const t=e.length;return 4===t&&("true"===e||"True"===e||"TRUE"===e)||5===t&&("false"===e||"False"===e||"FALSE"===e)},construct:function(e){return"true"===e||"True"===e||"TRUE"===e},predicate:function(e){return"[object Boolean]"===Object.prototype.toString.call(e)},represent:{lowercase:function(e){return e?"true":"false"},uppercase:function(e){return e?"TRUE":"FALSE"},camelcase:function(e){return e?"True":"False"}},defaultStyle:"lowercase"})}),$=p((e,t)=>{var i=_(),r=g();function a(e){return e>=48&&e<=57||e>=65&&e<=70||e>=97&&e<=102}function o(e){return e>=48&&e<=55}function s(e){return e>=48&&e<=57}function n(e){let t=e,i=1,r=t[0];if("-"!==r&&"+"!==r||("-"===r&&(i=-1),t=t.slice(1),r=t[0]),"0"===t)return 0;if("0"===r){if("b"===t[1])return i*parseInt(t.slice(2),2);if("x"===t[1])return i*parseInt(t.slice(2),16);if("o"===t[1])return i*parseInt(t.slice(2),8)}return i*parseInt(t,10)}t.exports=new r("tag:yaml.org,2002:int",{kind:"scalar",resolve:function(e){if(null===e)return!1;const t=e.length;let i=0,r=!1;if(!t)return!1;let c=e[i];if("-"!==c&&"+"!==c||(c=e[++i]),"0"===c){if(i+1===t)return!0;if(c=e[++i],"b"===c){for(i++;i<t;i++){if(c=e[i],"0"!==c&&"1"!==c)return!1;r=!0}return r&&Number.isFinite(n(e))}if("x"===c){for(i++;i<t;i++){if(!a(e.charCodeAt(i)))return!1;r=!0}return r&&Number.isFinite(n(e))}if("o"===c){for(i++;i<t;i++){if(!o(e.charCodeAt(i)))return!1;r=!0}return r&&Number.isFinite(n(e))}}for(;i<t;i++){if(!s(e.charCodeAt(i)))return!1;r=!0}return!!r&&Number.isFinite(n(e))},construct:function(e){return n(e)},predicate:function(e){return"[object Number]"===Object.prototype.toString.call(e)&&e%1==0&&!i.isNegativeZero(e)},represent:{binary:function(e){return e>=0?"0b"+e.toString(2):"-0b"+e.toString(2).slice(1)},octal:function(e){return e>=0?"0o"+e.toString(8):"-0o"+e.toString(8).slice(1)},decimal:function(e){return e.toString(10)},hexadecimal:function(e){return e>=0?"0x"+e.toString(16).toUpperCase():"-0x"+e.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}})}),k=p((e,t)=>{var i=_(),r=g(),a=new RegExp("^(?:[-+]?(?:[0-9]+)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),o=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),s=/^[-+]?[0-9]+e/;t.exports=new r("tag:yaml.org,2002:float",{kind:"scalar",resolve:function(e){return null!==e&&!!a.test(e)&&(!!Number.isFinite(parseFloat(e,10))||o.test(e))},construct:function(e){let t=e.toLowerCase();const i="-"===t[0]?-1:1;return"+-".indexOf(t[0])>=0&&(t=t.slice(1)),".inf"===t?1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:".nan"===t?NaN:i*parseFloat(t,10)},predicate:function(e){return"[object Number]"===Object.prototype.toString.call(e)&&(e%1!=0||i.isNegativeZero(e))},represent:function(e,t){if(isNaN(e))switch(t){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===e)switch(t){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===e)switch(t){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(i.isNegativeZero(e))return"-0.0";const r=e.toString(10);return s.test(r)?r.replace("e",".e"):r},defaultStyle:"lowercase"})}),S=p((e,t)=>{t.exports=x().extend({implicit:[w(),C(),$(),k()]})}),z=p((e,t)=>{t.exports=S()}),A=p((e,t)=>{var i=g(),r=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),a=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");t.exports=new i("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:function(e){return null!==e&&(null!==r.exec(e)||null!==a.exec(e))},construct:function(e){let t=0,i=null,o=r.exec(e);if(null===o&&(o=a.exec(e)),null===o)throw new Error("Date resolve error");const s=+o[1],n=+o[2]-1,c=+o[3];if(!o[4])return new Date(Date.UTC(s,n,c));const l=+o[4],d=+o[5],p=+o[6];if(o[7]){for(t=o[7].slice(0,3);t.length<3;)t+="0";t=+t}o[9]&&(i=6e4*(60*+o[10]+ +(o[11]||0)),"-"===o[9]&&(i=-i));const h=new Date(Date.UTC(s,n,c,l,d,p,t));return i&&h.setTime(h.getTime()-i),h},instanceOf:Date,represent:function(e){return e.toISOString()}})}),E=p((e,t)=>{var i=g();t.exports=new i("tag:yaml.org,2002:merge",{kind:"scalar",resolve:function(e){return"<<"===e||null===e}})}),O=p((e,t)=>{var i=g(),r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";t.exports=new i("tag:yaml.org,2002:binary",{kind:"scalar",resolve:function(e){if(null===e)return!1;let t=0;const i=e.length,a=r;for(let r=0;r<i;r++){const i=a.indexOf(e.charAt(r));if(!(i>64)){if(i<0)return!1;t+=6}}return t%8==0},construct:function(e){const t=e.replace(/[\r\n=]/g,""),i=t.length,a=r;let o=0;const s=[];for(let e=0;e<i;e++)e%4==0&&e&&(s.push(o>>16&255),s.push(o>>8&255),s.push(255&o)),o=o<<6|a.indexOf(t.charAt(e));const n=i%4*6;return 0===n?(s.push(o>>16&255),s.push(o>>8&255),s.push(255&o)):18===n?(s.push(o>>10&255),s.push(o>>2&255)):12===n&&s.push(o>>4&255),new Uint8Array(s)},predicate:function(e){return"[object Uint8Array]"===Object.prototype.toString.call(e)},represent:function(e){let t="",i=0;const a=e.length,o=r;for(let r=0;r<a;r++)r%3==0&&r&&(t+=o[i>>18&63],t+=o[i>>12&63],t+=o[i>>6&63],t+=o[63&i]),i=(i<<8)+e[r];const s=a%3;return 0===s?(t+=o[i>>18&63],t+=o[i>>12&63],t+=o[i>>6&63],t+=o[63&i]):2===s?(t+=o[i>>10&63],t+=o[i>>4&63],t+=o[i<<2&63],t+=o[64]):1===s&&(t+=o[i>>2&63],t+=o[i<<4&63],t+=o[64],t+=o[64]),t}})}),I=p((e,t)=>{var i=g(),r=Object.prototype.hasOwnProperty,a=Object.prototype.toString;t.exports=new i("tag:yaml.org,2002:omap",{kind:"sequence",resolve:function(e){if(null===e)return!0;const t=[],i=e;for(let e=0,o=i.length;e<o;e+=1){const o=i[e];let s,n=!1;if("[object Object]"!==a.call(o))return!1;for(s in o)if(r.call(o,s)){if(n)return!1;n=!0}if(!n)return!1;if(-1!==t.indexOf(s))return!1;t.push(s)}return!0},construct:function(e){return null!==e?e:[]}})}),W=p((e,t)=>{var i=g(),r=Object.prototype.toString;t.exports=new i("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:function(e){if(null===e)return!0;const t=e,i=new Array(t.length);for(let e=0,a=t.length;e<a;e+=1){const a=t[e];if("[object Object]"!==r.call(a))return!1;const o=Object.keys(a);if(1!==o.length)return!1;i[e]=[o[0],a[o[0]]]}return!0},construct:function(e){if(null===e)return[];const t=e,i=new Array(t.length);for(let e=0,r=t.length;e<r;e+=1){const r=t[e],a=Object.keys(r);i[e]=[a[0],r[a[0]]]}return i}})}),q=p((e,t)=>{var i=g(),r=Object.prototype.hasOwnProperty;t.exports=new i("tag:yaml.org,2002:set",{kind:"mapping",resolve:function(e){if(null===e)return!0;const t=e;for(const e in t)if(r.call(t,e)&&null!==t[e])return!1;return!0},construct:function(e){return null!==e?e:{}}})}),L=p((e,t)=>{t.exports=z().extend({implicit:[A(),E()],explicit:[O(),I(),W(),q()]})}),D=p((e,t)=>{var i=_(),r=u(),a=m(),o=L(),s=Object.prototype.hasOwnProperty,n=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,c=/[\x85\u2028\u2029]/,l=/[,\[\]{}]/,d=/^(?:!|!!|![0-9A-Za-z-]+!)$/,p=/^(?:!|[^,\[\]{}])(?:%[0-9a-f]{2}|[0-9a-z\-#;/?:@&=+$,_.!~*'()\[\]])*$/i;function h(e){return Object.prototype.toString.call(e)}function g(e){return 10===e||13===e}function f(e){return 9===e||32===e}function y(e){return 9===e||32===e||10===e||13===e}function v(e){return 44===e||91===e||93===e||123===e||125===e}function b(e){if(e>=48&&e<=57)return e-48;const t=32|e;return t>=97&&t<=102?t-97+10:-1}function x(e){return 120===e?2:117===e?4:85===e?8:0}function w(e){return e>=48&&e<=57?e-48:-1}function C(e){switch(e){case 48:return"\0";case 97:return"";case 98:return"\b";case 116:case 9:return"\t";case 110:return"\n";case 118:return"\v";case 102:return"\f";case 114:return"\r";case 101:return"";case 32:return" ";case 34:return'"';case 47:return"/";case 92:return"\\";case 78:return"";case 95:return" ";case 76:return"\u2028";case 80:return"\u2029";default:return""}}function $(e){return e<=65535?String.fromCharCode(e):String.fromCharCode(55296+(e-65536>>10),56320+(e-65536&1023))}function k(e,t,i){"__proto__"===t?Object.defineProperty(e,t,{configurable:!0,enumerable:!0,writable:!0,value:i}):e[t]=i}var S=new Array(256),z=new Array(256);for(let e=0;e<256;e++)S[e]=C(e)?1:0,z[e]=C(e);function A(e,t){this.input=e,this.filename=t.filename||null,this.schema=t.schema||o,this.onWarning=t.onWarning||null,this.legacy=t.legacy||!1,this.json=t.json||!1,this.listener=t.listener||null,this.maxDepth="number"==typeof t.maxDepth?t.maxDepth:100,this.maxMergeSeqLength="number"==typeof t.maxMergeSeqLength?t.maxMergeSeqLength:20,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.depth=0,this.firstTabInLine=-1,this.documents=[],this.anchorMapTransactions=[]}function E(e,t){const i={name:e.filename,buffer:e.input.slice(0,-1),position:e.position,line:e.line,column:e.position-e.lineStart};return i.snippet=a(i),new r(t,i)}function O(e,t){throw E(e,t)}function I(e,t){e.onWarning&&e.onWarning.call(null,E(e,t))}function W(e,t,i){const r=e.anchorMapTransactions;if(0!==r.length){const i=r[r.length-1];s.call(i,t)||(i[t]={existed:s.call(e.anchorMap,t),value:e.anchorMap[t]})}e.anchorMap[t]=i}function q(e){return{position:e.position,line:e.line,lineStart:e.lineStart,lineIndent:e.lineIndent,firstTabInLine:e.firstTabInLine,tag:e.tag,anchor:e.anchor,kind:e.kind,result:e.result}}function D(e,t){e.position=t.position,e.line=t.line,e.lineStart=t.lineStart,e.lineIndent=t.lineIndent,e.firstTabInLine=t.firstTabInLine,e.tag=t.tag,e.anchor=t.anchor,e.kind=t.kind,e.result=t.result}var j={YAML:function(e,t,i){null!==e.version&&O(e,"duplication of %YAML directive"),1!==i.length&&O(e,"YAML directive accepts exactly one argument");const r=/^([0-9]+)\.([0-9]+)$/.exec(i[0]);null===r&&O(e,"ill-formed argument of the YAML directive");const a=parseInt(r[1],10),o=parseInt(r[2],10);1!==a&&O(e,"unacceptable YAML version of the document"),e.version=i[0],e.checkLineBreaks=o<2,1!==o&&2!==o&&I(e,"unsupported YAML version of the document")},TAG:function(e,t,i){let r;2!==i.length&&O(e,"TAG directive accepts exactly two arguments");const a=i[0];r=i[1],d.test(a)||O(e,"ill-formed tag handle (first argument) of the TAG directive"),s.call(e.tagMap,a)&&O(e,'there is a previously declared suffix for "'+a+'" tag handle'),p.test(r)||O(e,"ill-formed tag prefix (second argument) of the TAG directive");try{r=decodeURIComponent(r)}catch(t){O(e,"tag prefix is malformed: "+r)}e.tagMap[a]=r}};function P(e,t,i,r){if(t<i){const a=e.input.slice(t,i);if(r)for(let t=0,i=a.length;t<i;t+=1){const i=a.charCodeAt(t);9===i||i>=32&&i<=1114111||O(e,"expected valid JSON character")}else n.test(a)&&O(e,"the stream contains non-printable characters");e.result+=a}}function F(e,t,r,a){i.isObject(r)||O(e,"cannot merge mappings; the provided source object is unacceptable");const o=Object.keys(r);for(let e=0,i=o.length;e<i;e+=1){const i=o[e];s.call(t,i)||(k(t,i,r[i]),a[i]=!0)}}function T(e,t,i,r,a,o,n,c,l){if(Array.isArray(a))for(let t=0,i=(a=Array.prototype.slice.call(a)).length;t<i;t+=1)Array.isArray(a[t])&&O(e,"nested arrays are not supported inside keys"),"object"==typeof a&&"[object Object]"===h(a[t])&&(a[t]="[object Object]");if("object"==typeof a&&"[object Object]"===h(a)&&(a="[object Object]"),a=String(a),null===t&&(t={}),"tag:yaml.org,2002:merge"===r)if(Array.isArray(o)){o.length>e.maxMergeSeqLength&&O(e,"merge sequence length exceeded maxMergeSeqLength ("+e.maxMergeSeqLength+")");const r=new Set;for(let a=0,s=o.length;a<s;a+=1){const s=o[a];r.has(s)||(r.add(s),F(e,t,s,i))}}else F(e,t,o,i);else e.json||s.call(i,a)||!s.call(t,a)||(e.line=n||e.line,e.lineStart=c||e.lineStart,e.position=l||e.position,O(e,"duplicated mapping key")),k(t,a,o),delete i[a];return t}function M(e){const t=e.input.charCodeAt(e.position);10===t?e.position++:13===t?(e.position++,10===e.input.charCodeAt(e.position)&&e.position++):O(e,"a line break is expected"),e.line+=1,e.lineStart=e.position,e.firstTabInLine=-1}function N(e,t,i){let r=0,a=e.input.charCodeAt(e.position);for(;0!==a;){for(;f(a);)9===a&&-1===e.firstTabInLine&&(e.firstTabInLine=e.position),a=e.input.charCodeAt(++e.position);if(t&&35===a)do{a=e.input.charCodeAt(++e.position)}while(10!==a&&13!==a&&0!==a);if(!g(a))break;for(M(e),a=e.input.charCodeAt(e.position),r++,e.lineIndent=0;32===a;)e.lineIndent++,a=e.input.charCodeAt(++e.position)}return-1!==i&&0!==r&&e.lineIndent<i&&I(e,"deficient indentation"),r}function Y(e){let t=e.position,i=e.input.charCodeAt(t);return!(45!==i&&46!==i||i!==e.input.charCodeAt(t+1)||i!==e.input.charCodeAt(t+2)||(t+=3,i=e.input.charCodeAt(t),0!==i&&!y(i)))}function K(e,t){1===t?e.result+=" ":t>1&&(e.result+=i.repeat("\n",t-1))}function B(e,t){const i=e.tag,r=e.anchor,a=[];let o=!1;if(-1!==e.firstTabInLine)return!1;null!==e.anchor&&W(e,e.anchor,a);let s=e.input.charCodeAt(e.position);for(;0!==s&&(-1!==e.firstTabInLine&&(e.position=e.firstTabInLine,O(e,"tab characters must not be used in indentation")),45===s)&&y(e.input.charCodeAt(e.position+1));){if(o=!0,e.position++,N(e,!0,-1)&&e.lineIndent<=t){a.push(null),s=e.input.charCodeAt(e.position);continue}const i=e.line;if(H(e,t,3,!1,!0),a.push(e.result),N(e,!0,-1),s=e.input.charCodeAt(e.position),(e.line===i||e.lineIndent>t)&&0!==s)O(e,"bad indentation of a sequence entry");else if(e.lineIndent<t)break}return!!o&&(e.tag=i,e.anchor=r,e.kind="sequence",e.result=a,!0)}function R(e,t,i){let r,a,o,s;const n=e.tag,c=e.anchor,l={},d=Object.create(null);let p=null,h=null,_=null,u=!1,m=!1;if(-1!==e.firstTabInLine)return!1;null!==e.anchor&&W(e,e.anchor,l);let g=e.input.charCodeAt(e.position);for(;0!==g;){u||-1===e.firstTabInLine||(e.position=e.firstTabInLine,O(e,"tab characters must not be used in indentation"));const v=e.input.charCodeAt(e.position+1),b=e.line;if(63!==g&&58!==g||!y(v)){if(a=e.line,o=e.lineStart,s=e.position,!H(e,i,2,!1,!0))break;if(e.line===b){for(g=e.input.charCodeAt(e.position);f(g);)g=e.input.charCodeAt(++e.position);if(58===g)g=e.input.charCodeAt(++e.position),y(g)||O(e,"a whitespace character is expected after the key-value separator within a block mapping"),u&&(T(e,l,d,p,h,null,a,o,s),p=h=_=null),m=!0,u=!1,r=!1,p=e.tag,h=e.result;else{if(!m)return e.tag=n,e.anchor=c,!0;O(e,"can not read an implicit mapping pair; a colon is missed")}}else{if(!m)return e.tag=n,e.anchor=c,!0;O(e,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else 63===g?(u&&(T(e,l,d,p,h,null,a,o,s),p=h=_=null),m=!0,u=!0,r=!0):u?(u=!1,r=!0):O(e,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),e.position+=1,g=v;if((e.line===b||e.lineIndent>t)&&(u&&(a=e.line,o=e.lineStart,s=e.position),H(e,t,4,!0,r)&&(u?h=e.result:_=e.result),u||(T(e,l,d,p,h,_,a,o,s),p=h=_=null),N(e,!0,-1),g=e.input.charCodeAt(e.position)),(e.line===b||e.lineIndent>t)&&0!==g)O(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return u&&T(e,l,d,p,h,null,a,o,s),m&&(e.tag=n,e.anchor=c,e.kind="mapping",e.result=l),m}function U(e){let t,i,r=!1,a=!1,o=e.input.charCodeAt(e.position);if(33!==o)return!1;null!==e.tag&&O(e,"duplication of a tag property"),o=e.input.charCodeAt(++e.position),60===o?(r=!0,o=e.input.charCodeAt(++e.position)):33===o?(a=!0,t="!!",o=e.input.charCodeAt(++e.position)):t="!";let n=e.position;if(r){do{o=e.input.charCodeAt(++e.position)}while(0!==o&&62!==o);e.position<e.length?(i=e.input.slice(n,e.position),o=e.input.charCodeAt(++e.position)):O(e,"unexpected end of the stream within a verbatim tag")}else{for(;0!==o&&!y(o);)33===o&&(a?O(e,"tag suffix cannot contain exclamation marks"):(t=e.input.slice(n-1,e.position+1),d.test(t)||O(e,"named tag handle cannot contain such characters"),a=!0,n=e.position+1)),o=e.input.charCodeAt(++e.position);i=e.input.slice(n,e.position),l.test(i)&&O(e,"tag suffix cannot contain flow indicator characters")}i&&!p.test(i)&&O(e,"tag name cannot contain such characters: "+i);try{i=decodeURIComponent(i)}catch(t){O(e,"tag name is malformed: "+i)}return r?e.tag=i:s.call(e.tagMap,t)?e.tag=e.tagMap[t]+i:"!"===t?e.tag="!"+i:"!!"===t?e.tag="tag:yaml.org,2002:"+i:O(e,'undeclared tag handle "'+t+'"'),!0}function V(e){let t=e.input.charCodeAt(e.position);if(38!==t)return!1;null!==e.anchor&&O(e,"duplication of an anchor property"),t=e.input.charCodeAt(++e.position);const i=e.position;for(;0!==t&&!y(t)&&!v(t);)t=e.input.charCodeAt(++e.position);return e.position===i&&O(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(i,e.position),!0}function H(e,t,r,a,o){let n,c,l,d,p,h=1,_=!1,u=!1,m=null;e.depth>=e.maxDepth&&O(e,"nesting exceeded maxDepth ("+e.maxDepth+")"),e.depth+=1,null!==e.listener&&e.listener("open",e),e.tag=null,e.anchor=null,e.kind=null,e.result=null;const C=n=c=4===r||3===r;if(a&&N(e,!0,-1)&&(_=!0,e.lineIndent>t?h=1:e.lineIndent===t?h=0:e.lineIndent<t&&(h=-1)),1===h)for(;;){const i=e.input.charCodeAt(e.position),r=q(e);if(_&&(33===i&&null!==e.tag||38===i&&null!==e.anchor))break;if(!U(e)&&!V(e))break;null===m&&(m=r),N(e,!0,-1)?(_=!0,c=C,e.lineIndent>t?h=1:e.lineIndent===t?h=0:e.lineIndent<t&&(h=-1)):c=!1}if(c&&(c=_||o),1===h||4===r)if(d=1===r||2===r?t:t+1,p=e.position-e.lineStart,1===h)if(c&&(B(e,p)||R(e,p,d))||function(e,t){let i,r,a,o=!0;const s=e.tag;let n;const c=e.anchor;let l,d,p,h;const _=Object.create(null);let u,m,g,f=e.input.charCodeAt(e.position);if(91===f)l=93,h=!1,n=[];else{if(123!==f)return!1;l=125,h=!0,n={}}for(null!==e.anchor&&W(e,e.anchor,n),f=e.input.charCodeAt(++e.position);0!==f;){if(N(e,!0,t),f=e.input.charCodeAt(e.position),f===l)return e.position++,e.tag=s,e.anchor=c,e.kind=h?"mapping":"sequence",e.result=n,!0;o?44===f&&O(e,"expected the node content, but found ','"):O(e,"missed comma between flow collection entries"),m=u=g=null,d=p=!1,63===f&&y(e.input.charCodeAt(e.position+1))&&(d=p=!0,e.position++,N(e,!0,t)),i=e.line,r=e.lineStart,a=e.position,H(e,t,1,!1,!0),m=e.tag,u=e.result,N(e,!0,t),f=e.input.charCodeAt(e.position),!p&&e.line!==i||58!==f||(d=!0,f=e.input.charCodeAt(++e.position),N(e,!0,t),H(e,t,1,!1,!0),g=e.result),h?T(e,n,_,m,u,g,i,r,a):d?n.push(T(e,null,_,m,u,g,i,r,a)):n.push(u),N(e,!0,t),f=e.input.charCodeAt(e.position),44===f?(o=!0,f=e.input.charCodeAt(++e.position)):o=!1}O(e,"unexpected end of the stream within a flow collection")}(e,d))u=!0;else{const t=e.input.charCodeAt(e.position);null!==m&&C&&!c&&124!==t&&62!==t&&function(e,t,i,r){const a=q(e);return function(e){e.anchorMapTransactions.push(Object.create(null))}(e),D(e,t),e.tag=null,e.anchor=null,e.kind=null,e.result=null,R(e,i,r)&&"mapping"===e.kind?(function(e){const t=e.anchorMapTransactions.pop(),i=e.anchorMapTransactions;if(0===i.length)return;const r=i[i.length-1],a=Object.keys(t);for(let e=0,i=a.length;e<i;e+=1){const i=a[e];s.call(r,i)||(r[i]=t[i])}}(e),!0):(function(e){const t=e.anchorMapTransactions.pop(),i=Object.keys(t);for(let r=i.length-1;r>=0;r-=1){const a=t[i[r]];a.existed?e.anchorMap[i[r]]=a.value:delete e.anchorMap[i[r]]}}(e),D(e,a),!1)}(e,m,m.position-m.lineStart,d)||n&&function(e,t){let r,a,o=1,s=!1,n=!1,c=t,l=0,d=!1,p=e.input.charCodeAt(e.position);if(124===p)r=!1;else{if(62!==p)return!1;r=!0}for(e.kind="scalar",e.result="";0!==p;)if(p=e.input.charCodeAt(++e.position),43===p||45===p)1===o?o=43===p?3:2:O(e,"repeat of a chomping mode identifier");else{if(!((a=w(p))>=0))break;0===a?O(e,"bad explicit indentation width of a block scalar; it cannot be less than one"):n?O(e,"repeat of an indentation width identifier"):(c=t+a-1,n=!0)}if(f(p)){do{p=e.input.charCodeAt(++e.position)}while(f(p));if(35===p)do{p=e.input.charCodeAt(++e.position)}while(!g(p)&&0!==p)}for(;0!==p;){for(M(e),e.lineIndent=0,p=e.input.charCodeAt(e.position);(!n||e.lineIndent<c)&&32===p;)e.lineIndent++,p=e.input.charCodeAt(++e.position);if(!n&&e.lineIndent>c&&(c=e.lineIndent),g(p)){l++;continue}if(n||0!==c||O(e,"missing indentation for block scalar"),e.lineIndent<c){3===o?e.result+=i.repeat("\n",s?1+l:l):1===o&&s&&(e.result+="\n");break}r?f(p)?(d=!0,e.result+=i.repeat("\n",s?1+l:l)):d?(d=!1,e.result+=i.repeat("\n",l+1)):0===l?s&&(e.result+=" "):e.result+=i.repeat("\n",l):e.result+=i.repeat("\n",s?1+l:l),s=!0,n=!0,l=0;const t=e.position;for(;!g(p)&&0!==p;)p=e.input.charCodeAt(++e.position);P(e,t,e.position,!1)}return!0}(e,d)||function(e,t){let i,r,a=e.input.charCodeAt(e.position);if(39!==a)return!1;for(e.kind="scalar",e.result="",e.position++,i=r=e.position;0!==(a=e.input.charCodeAt(e.position));)if(39===a){if(P(e,i,e.position,!0),a=e.input.charCodeAt(++e.position),39!==a)return!0;i=e.position,e.position++,r=e.position}else g(a)?(P(e,i,r,!0),K(e,N(e,!1,t)),i=r=e.position):e.position===e.lineStart&&Y(e)?O(e,"unexpected end of the document within a single quoted scalar"):(e.position++,f(a)||(r=e.position));O(e,"unexpected end of the stream within a single quoted scalar")}(e,d)||function(e,t){let i,r,a,o=e.input.charCodeAt(e.position);if(34!==o)return!1;for(e.kind="scalar",e.result="",e.position++,i=r=e.position;0!==(o=e.input.charCodeAt(e.position));){if(34===o)return P(e,i,e.position,!0),e.position++,!0;if(92===o){if(P(e,i,e.position,!0),o=e.input.charCodeAt(++e.position),g(o))N(e,!1,t);else if(o<256&&S[o])e.result+=z[o],e.position++;else if((a=x(o))>0){let t=a,i=0;for(;t>0;t--)o=e.input.charCodeAt(++e.position),(a=b(o))>=0?i=(i<<4)+a:O(e,"expected hexadecimal character");e.result+=$(i),e.position++}else O(e,"unknown escape sequence");i=r=e.position}else g(o)?(P(e,i,r,!0),K(e,N(e,!1,t)),i=r=e.position):e.position===e.lineStart&&Y(e)?O(e,"unexpected end of the document within a double quoted scalar"):(e.position++,f(o)||(r=e.position))}O(e,"unexpected end of the stream within a double quoted scalar")}(e,d)?u=!0:function(e){let t=e.input.charCodeAt(e.position);if(42!==t)return!1;t=e.input.charCodeAt(++e.position);const i=e.position;for(;0!==t&&!y(t)&&!v(t);)t=e.input.charCodeAt(++e.position);e.position===i&&O(e,"name of an alias node must contain at least one character");const r=e.input.slice(i,e.position);return s.call(e.anchorMap,r)||O(e,'unidentified alias "'+r+'"'),e.result=e.anchorMap[r],N(e,!0,-1),!0}(e)?(u=!0,null===e.tag&&null===e.anchor||O(e,"alias node should not have any properties")):function(e,t,i){let r,a,o,s,n,c;const l=e.kind,d=e.result;let p=e.input.charCodeAt(e.position);if(y(p)||v(p)||35===p||38===p||42===p||33===p||124===p||62===p||39===p||34===p||37===p||64===p||96===p)return!1;if(63===p||45===p){const t=e.input.charCodeAt(e.position+1);if(y(t)||i&&v(t))return!1}for(e.kind="scalar",e.result="",r=a=e.position,o=!1;0!==p;){if(58===p){const t=e.input.charCodeAt(e.position+1);if(y(t)||i&&v(t))break}else if(35===p){if(y(e.input.charCodeAt(e.position-1)))break}else{if(e.position===e.lineStart&&Y(e)||i&&v(p))break;if(g(p)){if(s=e.line,n=e.lineStart,c=e.lineIndent,N(e,!1,-1),e.lineIndent>=t){o=!0,p=e.input.charCodeAt(e.position);continue}e.position=a,e.line=s,e.lineStart=n,e.lineIndent=c;break}}o&&(P(e,r,a,!1),K(e,e.line-s),r=a=e.position,o=!1),f(p)||(a=e.position+1),p=e.input.charCodeAt(++e.position)}return P(e,r,a,!1),!!e.result||(e.kind=l,e.result=d,!1)}(e,d,1===r)&&(u=!0,null===e.tag&&(e.tag="?")),null!==e.anchor&&W(e,e.anchor,e.result)}else 0===h&&(u=c&&B(e,p));if(null===e.tag)null!==e.anchor&&W(e,e.anchor,e.result);else if("?"===e.tag){null!==e.result&&"scalar"!==e.kind&&O(e,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+e.kind+'"');for(let t=0,i=e.implicitTypes.length;t<i;t+=1)if(l=e.implicitTypes[t],l.resolve(e.result)){e.result=l.construct(e.result),e.tag=l.tag,null!==e.anchor&&W(e,e.anchor,e.result);break}}else if("!"!==e.tag){if(s.call(e.typeMap[e.kind||"fallback"],e.tag))l=e.typeMap[e.kind||"fallback"][e.tag];else{l=null;const t=e.typeMap.multi[e.kind||"fallback"];for(let i=0,r=t.length;i<r;i+=1)if(e.tag.slice(0,t[i].tag.length)===t[i].tag){l=t[i];break}}l||O(e,"unknown tag !<"+e.tag+">"),null!==e.result&&l.kind!==e.kind&&O(e,"unacceptable node kind for !<"+e.tag+'> tag; it should be "'+l.kind+'", not "'+e.kind+'"'),l.resolve(e.result,e.tag)?(e.result=l.construct(e.result,e.tag),null!==e.anchor&&W(e,e.anchor,e.result)):O(e,"cannot resolve a node with !<"+e.tag+"> explicit tag")}return null!==e.listener&&e.listener("close",e),e.depth-=1,null!==e.tag||null!==e.anchor||u}function G(e){const t=e.position;let i,r=!1;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap=Object.create(null),e.anchorMap=Object.create(null);0!==(i=e.input.charCodeAt(e.position))&&(N(e,!0,-1),i=e.input.charCodeAt(e.position),!(e.lineIndent>0||37!==i));){r=!0,i=e.input.charCodeAt(++e.position);let t=e.position;for(;0!==i&&!y(i);)i=e.input.charCodeAt(++e.position);const a=e.input.slice(t,e.position),o=[];for(a.length<1&&O(e,"directive name must not be less than one character in length");0!==i;){for(;f(i);)i=e.input.charCodeAt(++e.position);if(35===i){do{i=e.input.charCodeAt(++e.position)}while(0!==i&&!g(i));break}if(g(i))break;for(t=e.position;0!==i&&!y(i);)i=e.input.charCodeAt(++e.position);o.push(e.input.slice(t,e.position))}0!==i&&M(e),s.call(j,a)?j[a](e,a,o):I(e,'unknown document directive "'+a+'"')}N(e,!0,-1),0===e.lineIndent&&45===e.input.charCodeAt(e.position)&&45===e.input.charCodeAt(e.position+1)&&45===e.input.charCodeAt(e.position+2)?(e.position+=3,N(e,!0,-1)):r&&O(e,"directives end mark is expected"),H(e,e.lineIndent-1,4,!1,!0),N(e,!0,-1),e.checkLineBreaks&&c.test(e.input.slice(t,e.position))&&I(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&Y(e)?46===e.input.charCodeAt(e.position)&&(e.position+=3,N(e,!0,-1)):e.position<e.length-1&&O(e,"end of the stream or a document separator is expected")}function Z(e,t){t=t||{},0!==(e=String(e)).length&&(10!==e.charCodeAt(e.length-1)&&13!==e.charCodeAt(e.length-1)&&(e+="\n"),65279===e.charCodeAt(0)&&(e=e.slice(1)));const i=new A(e,t),r=e.indexOf("\0");for(-1!==r&&(i.position=r,O(i,"null byte is not allowed in input")),i.input+="\0";32===i.input.charCodeAt(i.position);)i.lineIndent+=1,i.position+=1;for(;i.position<i.length-1;)G(i);return i.documents}t.exports.loadAll=function(e,t,i){null!==t&&"object"==typeof t&&void 0===i&&(i=t,t=null);const r=Z(e,i);if("function"!=typeof t)return r;for(let e=0,i=r.length;e<i;e+=1)t(r[e])},t.exports.load=function(e,t){const i=Z(e,t);if(0!==i.length){if(1===i.length)return i[0];throw new r("expected a single document in the stream, but found more")}}}),j=p((e,t)=>{var i=_(),r=u(),a=L(),o=Object.prototype.toString,s=Object.prototype.hasOwnProperty,n=65279,c={0:"\\0",7:"\\a",8:"\\b",9:"\\t",10:"\\n",11:"\\v",12:"\\f",13:"\\r",27:"\\e",34:'\\"',92:"\\\\",133:"\\N",160:"\\_",8232:"\\L",8233:"\\P"},l=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],d=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function p(e){let t,a;const o=e.toString(16).toUpperCase();if(e<=255)t="x",a=2;else if(e<=65535)t="u",a=4;else{if(!(e<=4294967295))throw new r("code point within a string may not be greater than 0xFFFFFFFF");t="U",a=8}return"\\"+t+i.repeat("0",a-o.length)+o}function h(e){this.schema=e.schema||a,this.indent=Math.max(1,e.indent||2),this.noArrayIndent=e.noArrayIndent||!1,this.skipInvalid=e.skipInvalid||!1,this.flowLevel=i.isNothing(e.flowLevel)?-1:e.flowLevel,this.styleMap=function(e,t){if(null===t)return{};const i={},r=Object.keys(t);for(let a=0,o=r.length;a<o;a+=1){let o=r[a],n=String(t[o]);"!!"===o.slice(0,2)&&(o="tag:yaml.org,2002:"+o.slice(2));const c=e.compiledTypeMap.fallback[o];c&&s.call(c.styleAliases,n)&&(n=c.styleAliases[n]),i[o]=n}return i}(this.schema,e.styles||null),this.sortKeys=e.sortKeys||!1,this.lineWidth=e.lineWidth||80,this.noRefs=e.noRefs||!1,this.noCompatMode=e.noCompatMode||!1,this.condenseFlow=e.condenseFlow||!1,this.quotingType='"'===e.quotingType?2:1,this.forceQuotes=e.forceQuotes||!1,this.replacer="function"==typeof e.replacer?e.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function m(e,t){const r=i.repeat(" ",t);let a=0,o="";const s=e.length;for(;a<s;){let t;const i=e.indexOf("\n",a);-1===i?(t=e.slice(a),a=s):(t=e.slice(a,i+1),a=i+1),t.length&&"\n"!==t&&(o+=r),o+=t}return o}function g(e,t){return"\n"+i.repeat(" ",e.indent*t)}function f(e){return 32===e||9===e}function y(e){return e>=32&&e<=126||e>=161&&e<=55295&&8232!==e&&8233!==e||e>=57344&&e<=65533&&e!==n||e>=65536&&e<=1114111}function v(e){return y(e)&&e!==n&&13!==e&&10!==e}function b(e,t,i){const r=v(e),a=r&&!f(e);return(i?r:r&&44!==e&&91!==e&&93!==e&&123!==e&&125!==e)&&35!==e&&!(58===t&&!a)||v(t)&&!f(t)&&35===e||58===t&&a}function x(e,t){const i=e.charCodeAt(t);let r;return i>=55296&&i<=56319&&t+1<e.length&&(r=e.charCodeAt(t+1),r>=56320&&r<=57343)?1024*(i-55296)+r-56320+65536:i}function w(e){return/^\n* /.test(e)}function C(e,t,i,a,o){e.dump=function(){if(0===t.length)return 2===e.quotingType?'""':"''";if(!e.noCompatMode&&(-1!==l.indexOf(t)||d.test(t)))return 2===e.quotingType?'"'+t+'"':"'"+t+"'";const s=e.indent*Math.max(1,i),h=-1===e.lineWidth?-1:Math.max(Math.min(e.lineWidth,40),e.lineWidth-s),_=a||e.flowLevel>-1&&i>=e.flowLevel;switch(function(e,t,i,r,a,o,s,c){let l,d=0,p=null,h=!1,_=!1;const u=-1!==r;let m=-1,g=y(v=x(e,0))&&v!==n&&!f(v)&&45!==v&&63!==v&&58!==v&&44!==v&&91!==v&&93!==v&&123!==v&&125!==v&&35!==v&&38!==v&&42!==v&&33!==v&&124!==v&&61!==v&&62!==v&&39!==v&&34!==v&&37!==v&&64!==v&&96!==v&&function(e){return!f(e)&&58!==e}(x(e,e.length-1));var v;if(t||s)for(l=0;l<e.length;d>=65536?l+=2:l++){if(d=x(e,l),!y(d))return 5;g=g&&b(d,p,c),p=d}else{for(l=0;l<e.length;d>=65536?l+=2:l++){if(d=x(e,l),10===d)h=!0,u&&(_=_||l-m-1>r&&" "!==e[m+1],m=l);else if(!y(d))return 5;g=g&&b(d,p,c),p=d}_=_||u&&l-m-1>r&&" "!==e[m+1]}return h||_?i>9&&w(e)?5:s?2===o?5:2:_?4:3:!g||s||a(e)?2===o?5:2:1}(t,_,e.indent,h,function(t){return function(e,t){for(let i=0,r=e.implicitTypes.length;i<r;i+=1)if(e.implicitTypes[i].resolve(t))return!0;return!1}(e,t)},e.quotingType,e.forceQuotes&&!a,o)){case 1:return t;case 2:return"'"+t.replace(/'/g,"''")+"'";case 3:return"|"+$(t,e.indent)+k(m(t,s));case 4:return">"+$(t,e.indent)+k(m(function(e,t){const i=/(\n+)([^\n]*)/g;let r,a,o=function(){let r=e.indexOf("\n");return r=-1!==r?r:e.length,i.lastIndex=r,S(e.slice(0,r),t)}(),s="\n"===e[0]||" "===e[0];for(;a=i.exec(e);){const e=a[1],i=a[2];r=" "===i[0],o+=e+(s||r||""===i?"":"\n")+S(i,t),s=r}return o}(t,h),s));case 5:return'"'+function(e){let t="",i=0;for(let r=0;r<e.length;i>=65536?r+=2:r++){i=x(e,r);const a=c[i];!a&&y(i)?(t+=e[r],i>=65536&&(t+=e[r+1])):t+=a||p(i)}return t}(t)+'"';default:throw new r("impossible error: invalid scalar style")}}()}function $(e,t){const i=w(e)?String(t):"",r="\n"===e[e.length-1];return i+(!r||"\n"!==e[e.length-2]&&"\n"!==e?r?"":"-":"+")+"\n"}function k(e){return"\n"===e[e.length-1]?e.slice(0,-1):e}function S(e,t){if(""===e||" "===e[0])return e;const i=/ [^ ]/g;let r,a,o=0,s=0,n=0,c="";for(;r=i.exec(e);)n=r.index,n-o>t&&(a=s>o?s:n,c+="\n"+e.slice(o,a),o=a+1),s=n;return c+="\n",e.length-o>t&&s>o?c+=e.slice(o,s)+"\n"+e.slice(s+1):c+=e.slice(o),c.slice(1)}function z(e,t,i,r){let a="";const o=e.tag;for(let o=0,s=i.length;o<s;o+=1){let s=i[o];e.replacer&&(s=e.replacer.call(i,String(o),s)),(E(e,t+1,s,!0,!0,!1,!0)||void 0===s&&E(e,t+1,null,!0,!0,!1,!0))&&(r&&""===a||(a+=g(e,t)),e.dump&&10===e.dump.charCodeAt(0)?a+="-":a+="- ",a+=e.dump)}e.tag=o,e.dump=a||"[]"}function A(e,t,i){const a=i?e.explicitTypes:e.implicitTypes;for(let n=0,c=a.length;n<c;n+=1){const c=a[n];if((c.instanceOf||c.predicate)&&(!c.instanceOf||"object"==typeof t&&t instanceof c.instanceOf)&&(!c.predicate||c.predicate(t))){if(i?c.multi&&c.representName?e.tag=c.representName(t):e.tag=c.tag:e.tag="?",c.represent){const i=e.styleMap[c.tag]||c.defaultStyle;let a;if("[object Function]"===o.call(c.represent))a=c.represent(t,i);else{if(!s.call(c.represent,i))throw new r("!<"+c.tag+'> tag resolver accepts not "'+i+'" style');a=c.represent[i](t,i)}e.dump=a}return!0}}return!1}function E(e,t,i,a,s,n,c){e.tag=null,e.dump=i,A(e,i,!1)||A(e,i,!0);const l=o.call(e.dump),d=a;a&&(a=e.flowLevel<0||e.flowLevel>t);const p="[object Object]"===l||"[object Array]"===l;let h,_;if(p&&(h=e.duplicates.indexOf(i),_=-1!==h),(null!==e.tag&&"?"!==e.tag||_||2!==e.indent&&t>0)&&(s=!1),_&&e.usedDuplicates[h])e.dump="*ref_"+h;else{if(p&&_&&!e.usedDuplicates[h]&&(e.usedDuplicates[h]=!0),"[object Object]"===l)a&&0!==Object.keys(e.dump).length?(function(e,t,i,a){let o="";const s=e.tag,n=Object.keys(i);if(!0===e.sortKeys)n.sort();else if("function"==typeof e.sortKeys)n.sort(e.sortKeys);else if(e.sortKeys)throw new r("sortKeys must be a boolean or a function");for(let r=0,s=n.length;r<s;r+=1){let s="";a&&""===o||(s+=g(e,t));const c=n[r];let l=i[c];if(e.replacer&&(l=e.replacer.call(i,c,l)),!E(e,t+1,c,!0,!0,!0))continue;const d=null!==e.tag&&"?"!==e.tag||e.dump&&e.dump.length>1024;d&&(e.dump&&10===e.dump.charCodeAt(0)?s+="?":s+="? "),s+=e.dump,d&&(s+=g(e,t)),E(e,t+1,l,!0,d)&&(e.dump&&10===e.dump.charCodeAt(0)?s+=":":s+=": ",s+=e.dump,o+=s)}e.tag=s,e.dump=o||"{}"}(e,t,e.dump,s),_&&(e.dump="&ref_"+h+e.dump)):(function(e,t,i){let r="";const a=e.tag,o=Object.keys(i);for(let a=0,s=o.length;a<s;a+=1){let s="";""!==r&&(s+=", "),e.condenseFlow&&(s+='"');const n=o[a];let c=i[n];e.replacer&&(c=e.replacer.call(i,n,c)),E(e,t,n,!1,!1)&&(e.dump.length>1024&&(s+="? "),s+=e.dump+(e.condenseFlow?'"':"")+":"+(e.condenseFlow?"":" "),E(e,t,c,!1,!1)&&(s+=e.dump,r+=s))}e.tag=a,e.dump="{"+r+"}"}(e,t,e.dump),_&&(e.dump="&ref_"+h+" "+e.dump));else if("[object Array]"===l)a&&0!==e.dump.length?(e.noArrayIndent&&!c&&t>0?z(e,t-1,e.dump,s):z(e,t,e.dump,s),_&&(e.dump="&ref_"+h+e.dump)):(function(e,t,i){let r="";const a=e.tag;for(let a=0,o=i.length;a<o;a+=1){let o=i[a];e.replacer&&(o=e.replacer.call(i,String(a),o)),(E(e,t,o,!1,!1)||void 0===o&&E(e,t,null,!1,!1))&&(""!==r&&(r+=","+(e.condenseFlow?"":" ")),r+=e.dump)}e.tag=a,e.dump="["+r+"]"}(e,t,e.dump),_&&(e.dump="&ref_"+h+" "+e.dump));else{if("[object String]"!==l){if("[object Undefined]"===l)return!1;if(e.skipInvalid)return!1;throw new r("unacceptable kind of an object to dump "+l)}"?"!==e.tag&&C(e,e.dump,t,n,d)}if(null!==e.tag&&"?"!==e.tag){let t=encodeURI("!"===e.tag[0]?e.tag.slice(1):e.tag).replace(/!/g,"%21");t="!"===e.tag[0]?"!"+t:"tag:yaml.org,2002:"===t.slice(0,18)?"!!"+t.slice(18):"!<"+t+">",e.dump=t+" "+e.dump}}return!0}function O(e,t){const i=[],r=[];I(e,i,r);const a=r.length;for(let e=0;e<a;e+=1)t.duplicates.push(i[r[e]]);t.usedDuplicates=new Array(a)}function I(e,t,i){if(null!==e&&"object"==typeof e){const r=t.indexOf(e);if(-1!==r)-1===i.indexOf(r)&&i.push(r);else if(t.push(e),Array.isArray(e))for(let r=0,a=e.length;r<a;r+=1)I(e[r],t,i);else{const r=Object.keys(e);for(let a=0,o=r.length;a<o;a+=1)I(e[r[a]],t,i)}}}t.exports.dump=function(e,t){const i=new h(t=t||{});i.noRefs||O(e,i);let r=e;return i.replacer&&(r=i.replacer.call({"":r},"",r)),E(i,0,r,!0,!0)?i.dump+"\n":""}}),P=h(p((e,t)=>{var i=D(),r=j();function a(e,t){return function(){throw new Error("Function yaml."+e+" is removed in js-yaml 4. Use yaml."+t+" instead, which is now safe by default.")}}t.exports.Type=g(),t.exports.Schema=f(),t.exports.FAILSAFE_SCHEMA=x(),t.exports.JSON_SCHEMA=S(),t.exports.CORE_SCHEMA=z(),t.exports.DEFAULT_SCHEMA=L(),t.exports.load=i.load,t.exports.loadAll=i.loadAll,t.exports.dump=r.dump,t.exports.YAMLException=u(),t.exports.types={binary:O(),float:k(),map:b(),null:w(),pairs:W(),set:q(),timestamp:A(),bool:C(),int:$(),merge:E(),omap:I(),seq:v(),str:y()},t.exports.safeLoad=a("safeLoad","load"),t.exports.safeLoadAll=a("safeLoadAll","loadAll"),t.exports.safeDump=a("safeDump","dump")})(),1),{Type:F,Schema:T,FAILSAFE_SCHEMA:M,JSON_SCHEMA:N,CORE_SCHEMA:Y,DEFAULT_SCHEMA:K,load:B,loadAll:R,dump:U,YAMLException:V,types:H,safeLoad:G,safeLoadAll:Z,safeDump:J}=P.default,Q=P.default,X=i(217),ee=i(587),te=i(475),ie=i(113),re=i(563);function ae(e){return(e instanceof Error?e.message.split("\n")[0]:"UngÃ¼ltiges YAML")||"UngÃ¼ltiges YAML"}function oe(e,t){if(!e.trim())return{parsed_config:void 0};try{const i=Q.load(e);return i&&"object"==typeof i?{parsed_config:i}:{parsed_config:void 0,_yaml_error:t}}catch(e){return{parsed_config:void 0,_yaml_error:ae(e)}}}const se=[{type:"tile",name:"Kachel",icon:"mdi:square-rounded",template:'type: tile\nentity: ""\n'},{type:"entities",name:"Entitätsliste",icon:"mdi:format-list-bulleted",template:'type: entities\nentities:\n  - entity: ""\n'},{type:"glance",name:"Glance",icon:"mdi:eye",template:'type: glance\nentities:\n  - entity: ""\n'},{type:"button",name:"Button",icon:"mdi:gesture-tap-button",template:'type: button\nentity: ""\ntap_action:\n  action: toggle\n'},{type:"markdown",name:"Text / Markdown",icon:"mdi:language-markdown",template:'type: markdown\ncontent: "**Text**"\n'},{type:"heading",name:"Überschrift",icon:"mdi:format-header-1",template:'type: heading\nheading: "Überschrift"\nheading_style: title\nicon: mdi:home\n'},{type:"weather-forecast",name:"Wettervorhersage",icon:"mdi:weather-partly-cloudy",template:'type: weather-forecast\nentity: ""\nshow_current: true\nshow_forecast: true\nforecast_type: daily\n'},{type:"gauge",name:"Messanzeige",icon:"mdi:gauge",template:'type: gauge\nentity: ""\nmin: 0\nmax: 100\n'},{type:"thermostat",name:"Thermostat",icon:"mdi:thermostat",template:'type: thermostat\nentity: ""\n'},{type:"media-control",name:"Mediensteuerung",icon:"mdi:play-circle",template:'type: media-control\nentity: ""\n'},{type:"history-graph",name:"Verlaufsgraph",icon:"mdi:chart-line",template:'type: history-graph\nentities:\n  - entity: ""\nhours_to_show: 24\n'},{type:"statistics-graph",name:"Statistikgraph",icon:"mdi:chart-bar",template:'type: statistics-graph\nentities:\n  - entity: ""\nstat_types:\n  - mean\nchart_type: line\nperiod: 5minute\n'},{type:"picture",name:"Bild",icon:"mdi:image",template:'type: picture\nimage: ""\n'},{type:"picture-entity",name:"Entity-Bild",icon:"mdi:image-outline",template:'type: picture-entity\nentity: ""\n'},{type:"dashboard-strategy-webrtc-camera-card",name:"WebRTC Kamera",icon:"mdi:cctv",template:"type: custom:dashboard-strategy-webrtc-camera-card\npreload: near_viewport\npreload_margin: 800\ncard:\n  type: custom:webrtc-camera\n  entity: camera.example\n  mode: webrtc,mse\n  media: video\n  muted: true\n  intersection: 0.5\n"},{type:"map",name:"Karte",icon:"mdi:map",template:'type: map\nentities:\n  - entity: ""\n'},{type:"todo-list",name:"Aufgabenliste",icon:"mdi:checkbox-marked-circle",template:'type: todo-list\nentity: ""\n'},{type:"logbook",name:"Logbuch",icon:"mdi:history",template:'type: logbook\nentity: ""\nhours_to_show: 24\n'},{type:"alarm-panel",name:"Alarmanlage",icon:"mdi:shield-home",template:'type: alarm-panel\nentity: ""\n'},{type:"energy-distribution",name:"Energieverteilung",icon:"mdi:lightning-bolt",template:"type: energy-distribution\n"},{type:"grid",name:"Raster",icon:"mdi:grid",template:"type: grid\ncards: []\n"}];class ne extends r.WF{constructor(){super(...arguments),this._hass=null,this._isUpdatingConfig=!1,this._config={},this._expandedAreas=new Set,this._expandedGroups=new Map,this._expandedWeatherBlocks=new Set,this._favoriteSearch="",this._roomPinSearch="",this._cameraWebrtcStreamsYaml=null,this._cameraWebrtcStreamsError=null,this._cameraWebrtcDefaultsYaml=null,this._cameraWebrtcDefaultsError=null,this._areaCameraWebrtcStreamsYaml=new Map,this._areaCameraWebrtcStreamsError=new Map,this._areaCameraWebrtcDefaultsYaml=new Map,this._areaCameraWebrtcDefaultsError=new Map,this._areaEntitiesCache=new Map,this._entitySelectOptionsCache=null,this._weatherStartAreaOptionsCache=null,this._weatherStartFloorOptionsCache=null,this._draggedElement=null,this._sectionDraggedElement=null,this._stackDraggedElement=null,this._weatherStartDraggedElement=null,this._cardPickerOpen=!1,this._cardPickerStep="type",this._cardPickerSearch="",this._cardPickerSelectedType="",this._cardPickerYaml="",this._cardPickerHasVisualEditor=!1,this._cardPickerCallback=null,this._cardPickerConfig=null,this._openCardPickerForWeatherStartCard=()=>{this._openCardPicker(e=>{const t=this._createWeatherStartItemId("card"),i=Q.dump(e).trim(),r=[...this._config.custom_cards||[],{id:t,editor_title:"",yaml:i,parsed_config:e}],a=[...this._getWeatherStartLayoutItems(),{id:`custom-card-${t}`,type:"custom_card",custom_card_id:t}],o={...this._config,custom_cards:r,weather_start_layout_items:a};this._config=o,this._fireConfigChanged(o),this._expandedWeatherBlocks=new Set([...this._expandedWeatherBlocks,`custom-card-${t}`])})},this._handleWeatherStartDragStart=e=>{if(!e.target.closest(".drag-handle"))return void e.preventDefault();const t=e.target.closest(".section-order-item");t?(t.classList.add("dragging"),e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t.dataset.wsId||"")),this._weatherStartDraggedElement=t):e.preventDefault()},this._handleWeatherStartDragEnd=e=>{const t=e.target.closest(".section-order-item");t&&t.classList.remove("dragging");const i=this.shadowRoot?.querySelector("#weather-start-order-list");i&&i.querySelectorAll(".section-order-item").forEach(e=>{e.classList.remove("drag-over")}),this._weatherStartDraggedElement=null},this._handleWeatherStartDragOver=e=>{e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move");const t=e.currentTarget;t!==this._weatherStartDraggedElement&&t.classList.add("drag-over")},this._handleWeatherStartDragLeave=e=>{e.currentTarget.classList.remove("drag-over")},this._handleWeatherStartDrop=e=>{e.stopPropagation(),e.preventDefault();const t=e.currentTarget;if(t.classList.remove("drag-over"),!this._weatherStartDraggedElement||this._weatherStartDraggedElement===t)return;const i=this._weatherStartDraggedElement.dataset.wsId,r=t.dataset.wsId;if(!i||!r)return;const a=this._getWeatherStartLayoutItems(),o=a.findIndex(e=>e.id===i),s=a.findIndex(e=>e.id===r);if(-1===o||-1===s)return;const n=[...a];n.splice(o,1),n.splice(s,0,a[o]),this._saveWeatherStartLayoutItems(n)},this._handleSectionDragStart=e=>{if(!e.target.closest(".drag-handle"))return void e.preventDefault();const t=e.target.closest(".section-order-item");t?(t.classList.add("dragging"),e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t.dataset.sectionKey||"")),this._sectionDraggedElement=t):e.preventDefault()},this._handleSectionDragEnd=e=>{const t=e.target.closest(".section-order-item");t&&t.classList.remove("dragging");const i=this.shadowRoot?.querySelector("#section-order-list");i&&i.querySelectorAll(".section-order-item").forEach(e=>{e.classList.remove("drag-over")}),this._sectionDraggedElement=null},this._handleSectionDragOver=e=>{e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move");const t=e.currentTarget;t!==this._sectionDraggedElement&&t.classList.add("drag-over")},this._handleSectionDragLeave=e=>{e.currentTarget.classList.remove("drag-over")},this._handleSectionDrop=e=>{e.stopPropagation(),e.preventDefault();const t=e.currentTarget;if(t.classList.remove("drag-over"),!this._sectionDraggedElement||this._sectionDraggedElement===t)return;const i=this._sectionDraggedElement.dataset.sectionKey,r=t.dataset.sectionKey;if(!i||!r)return;const a=this._getSectionsOrder(),o=a.indexOf(i),s=a.indexOf(r);if(-1===o||-1===s)return;const n=[...a];n.splice(o,1),n.splice(s,0,i),this._updateSectionsOrder(n)},this._handleStackDragStart=e=>{if(!e.target.closest(".drag-handle"))return void e.preventDefault();const t=e.target.closest(".section-order-item");t?(t.classList.add("dragging"),e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t.dataset.stackKey||"")),this._stackDraggedElement=t):e.preventDefault()},this._handleStackDragEnd=e=>{const t=e.target.closest(".section-order-item");t&&t.classList.remove("dragging"),this.shadowRoot?.querySelectorAll(".section-order-item.drag-over").forEach(e=>e.classList.remove("drag-over")),this._stackDraggedElement=null},this._handleStackDragOver=e=>{e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move");const t=e.currentTarget;t!==this._stackDraggedElement&&t.classList.add("drag-over")},this._handleStackDragLeave=e=>{e.currentTarget.classList.remove("drag-over")},this._handleStackDrop=e=>{e.stopPropagation(),e.preventDefault();const t=e.currentTarget;if(t.classList.remove("drag-over"),!this._stackDraggedElement||this._stackDraggedElement===t)return;const i=this._stackDraggedElement.dataset.stackKey,r=t.dataset.stackKey,a=t.dataset.areaId;if(!i||!r||!a)return;const o=this._getStacksOrder(a),s=o.indexOf(i),n=o.indexOf(r);if(-1===s||-1===n)return;const c=[...o];c.splice(s,1),c.splice(n,0,i),this._updateStacksOrder(a,c)},this._cameraStreamModeChanged=e=>{const t=e.target.value,i={...this._config};"on_demand"===t?delete i.camera_stream_mode:i.camera_stream_mode=t,this._config=i,this._fireConfigChanged(i)},this._cameraRendererChanged=e=>{const t=e.target.value,i={...this._config};"native"===t?delete i.camera_renderer:i.camera_renderer=t,this._config=i,this._cameraWebrtcStreamsError=null,this._cameraWebrtcDefaultsError=null,this._fireConfigChanged(i)},this._cameraWebrtcPreloadChanged=e=>{const t=e.target.value,i={...this._config};"off"===t?(delete i.camera_webrtc_preload,delete i.camera_webrtc_preload_margin):(i.camera_webrtc_preload=t,"near_viewport"===t&&"number"!=typeof i.camera_webrtc_preload_margin&&(i.camera_webrtc_preload_margin=800),"always"===t&&delete i.camera_webrtc_preload_margin),this._config=i,this._fireConfigChanged(i)},this._cameraWebrtcPreloadMarginChanged=e=>{const t=parseInt(e.target.value,10);if(isNaN(t)||t<0)return;const i={...this._config};800===t?delete i.camera_webrtc_preload_margin:i.camera_webrtc_preload_margin=t,this._config=i,this._fireConfigChanged(i)},this._cameraWebrtcStreamsChanged=e=>{const t=e.target.value;this._cameraWebrtcStreamsYaml=t;const i={...this._config},r=t.trim();if(!r)return delete i.camera_webrtc_streams,this._cameraWebrtcStreamsError=null,this._config=i,void this._fireConfigChanged(i);try{const e=Q.load(r);if(!e||"object"!=typeof e||Array.isArray(e))return this._cameraWebrtcStreamsError=(0,te.localize)("editor.camera_webrtc_streams_invalid"),void this.requestUpdate();const t=e;if(!Object.entries(t).every(([e,t])=>!!e.trim()&&("string"==typeof t||!!t&&"object"==typeof t&&!Array.isArray(t))))return this._cameraWebrtcStreamsError=(0,te.localize)("editor.camera_webrtc_streams_invalid"),void this.requestUpdate();i.camera_webrtc_streams=t,this._cameraWebrtcStreamsError=null,this._config=i,this._fireConfigChanged(i)}catch(e){this._cameraWebrtcStreamsError=ae(e),this.requestUpdate()}},this._cameraWebrtcDefaultsChanged=e=>{const t=e.target.value;this._cameraWebrtcDefaultsYaml=t;const i={...this._config},r=t.trim();if(!r)return delete i.camera_webrtc_defaults,this._cameraWebrtcDefaultsError=null,this._config=i,void this._fireConfigChanged(i);try{const e=Q.load(r);if(!e||"object"!=typeof e||Array.isArray(e))return this._cameraWebrtcDefaultsError=(0,te.localize)("editor.camera_webrtc_defaults_invalid"),void this.requestUpdate();i.camera_webrtc_defaults=e,this._cameraWebrtcDefaultsError=null,this._config=i,this._fireConfigChanged(i)}catch(e){this._cameraWebrtcDefaultsError=ae(e),this.requestUpdate()}},this._themeChanged=e=>{if(!this._hass)return;const t=e.target.value.trim(),i={...this._config};t?i.theme=t:delete i.theme,this._config=i,this._fireConfigChanged(i)},this._overviewLayoutChanged=e=>{if(!this._hass)return;const t=e.target.value,i={...this._config};"weather_start"===t?i.overview_layout=t:delete i.overview_layout,this._config=i,this._fireConfigChanged(i)},this._handleDragStart=e=>{if(!e.target.closest(".drag-handle"))return void e.preventDefault();const t=e.target.closest(".area-item");t?(t.classList.add("dragging"),e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t.dataset.areaId||"")),this._draggedElement=t):e.preventDefault()},this._handleDragEnd=e=>{const t=e.target.closest(".area-item");t&&t.classList.remove("dragging");const i=this.shadowRoot.querySelector("#area-list");i&&i.querySelectorAll(".area-item").forEach(e=>{e.classList.remove("drag-over")})},this._handleDragOver=e=>{e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move");const t=e.currentTarget;t!==this._draggedElement&&t.classList.add("drag-over")},this._handleDragLeave=e=>{e.currentTarget.classList.remove("drag-over")},this._handleDrop=e=>{e.stopPropagation(),e.preventDefault();const t=e.currentTarget;if(t.classList.remove("drag-over"),!this._draggedElement||this._draggedElement===t)return;const i=this._draggedElement.dataset.areaId,r=t.dataset.areaId;if(!i||!r)return;const a=this._getAreaOrder(),o=a.indexOf(i),s=a.indexOf(r);if(-1===o||-1===s)return;const n=[...a];n.splice(o,1),n.splice(s,0,i),this._updateAreaOrder(n)},this._entityDraggedId=null,this._handleEntityDragStart=(e,t)=>{const i=e.target.closest(".entity-list-item");i?(i.classList.add("dragging"),this._entityDraggedId=i.dataset.entityId||null,e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",this._entityDraggedId||""))):e.preventDefault()},this._handleEntityDragEnd=e=>{const t=e.target.closest(".entity-list-item");t&&t.classList.remove("dragging"),this._entityDraggedId=null},this._handleEntityDragOver=e=>{e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move");const t=e.currentTarget;t.dataset.entityId!==this._entityDraggedId&&t.classList.add("drag-over")},this._handleEntityDragLeave=e=>{e.currentTarget.classList.remove("drag-over")},this._handleEntityDrop=(e,t)=>{e.stopPropagation(),e.preventDefault();const i=e.currentTarget;i.classList.remove("drag-over");const r=this._entityDraggedId,a=i.dataset.entityId;if(!r||!a||r===a)return;const o="favorites"===t?[...this._config.favorite_entities||[]]:[...this._config.room_pin_entities||[]],s=o.indexOf(r),n=o.indexOf(a);if(-1===s||-1===n)return;o.splice(s,1),o.splice(n,0,r);const c="favorites"===t?"favorite_entities":"room_pin_entities",l={...this._config,[c]:o};this._config=l,this._fireConfigChanged(l)},this._openCardPickerForCustomCard=()=>{this._openCardPicker(e=>{const t=Q.dump(e).trim(),i=[...this._config.custom_cards||[]];i.push({editor_title:"",yaml:t,parsed_config:e});const r={...this._config,custom_cards:i};this._config=r,this._fireConfigChanged(r)})},this._handlePickerOverlayClick=e=>{e.target===e.currentTarget&&this._closeCardPicker()}}set hass(e){const t=this._hass;this._hass=e,!t||t.entities===e.entities&&t.devices===e.devices&&t.states===e.states||(this._entitySelectOptionsCache=null),!t||t.areas===e.areas&&t.floors===e.floors||(this._weatherStartAreaOptionsCache=null,this._weatherStartFloorOptionsCache=null),t||this.requestUpdate()}setConfig(e){this._isUpdatingConfig||(this._config.areas_display?.hidden===e.areas_display?.hidden&&this._config.areas_display?.order===e.areas_display?.order&&this._config.areas_display?.nav_items===e.areas_display?.nav_items||this._invalidateWeatherStartOptionsCaches(),this._config=e)}_invalidateWeatherStartOptionsCaches(){this._weatherStartAreaOptionsCache=null,this._weatherStartFloorOptionsCache=null}_checkSearchCardDependencies(){const e=void 0!==customElements.get("search-card"),t=void 0!==customElements.get("card-tools");return e&&t}_getAllEntitiesForSelect(){if(!this._hass)return[];if(this._entitySelectOptionsCache&&this._entitySelectOptionsCache.entities===this._hass.entities&&this._entitySelectOptionsCache.devices===this._hass.devices&&this._entitySelectOptionsCache.states===this._hass.states)return this._entitySelectOptionsCache.options;const e=this._hass.entities||{},t=Object.values(this._hass.devices||{}),i=new Map;t.forEach(e=>{e.area_id&&i.set(e.id,e.area_id)});const r=this._hass,a=Object.keys(r.states).map(t=>{const a=r.states[t],o=e[t];let s=o?.area_id;return!s&&o?.device_id&&(s=i.get(o.device_id)??null),{entity_id:t,name:a.attributes?.friendly_name||t.split(".")[1].replace(/_/g," "),area_id:s,device_area_id:s}}).sort((e,t)=>e.name.localeCompare(t.name));return this._entitySelectOptionsCache={entities:this._hass.entities,devices:this._hass.devices,states:this._hass.states,options:a},a}_getAlarmEntities(){return this._hass?Object.keys(this._hass.states).filter(e=>e.startsWith("alarm_control_panel.")).map(e=>{const t=this._hass.states[e];return{entity_id:e,name:t.attributes?.friendly_name||e.split(".")[1].replace(/_/g," ")}}).sort((e,t)=>e.name.localeCompare(t.name)):[]}_getWeatherEntities(){return this._hass?Object.keys(this._hass.states).filter(e=>e.startsWith("weather.")).map(e=>{const t=this._hass.states[e];return{entity_id:e,name:t.attributes?.friendly_name||e.split(".")[1].replace(/_/g," ")}}).sort((e,t)=>e.name.localeCompare(t.name)):[]}_getThemeNames(){return this._hass?.themes?.themes?Object.keys(this._hass.themes.themes).sort((e,t)=>e.localeCompare(t)):[]}_getFilteredEntities(e,t=!1){if(!this._hass||e.length<2)return[];const i=e.toLowerCase(),r=this._getAllEntitiesForSelect().filter(e=>!(t&&!e.area_id&&!e.device_area_id)&&(e.name.toLowerCase().includes(i)||e.entity_id.toLowerCase().includes(i)));return r.sort((e,t)=>{const r=e.name.toLowerCase(),a=t.name.toLowerCase(),o=e.entity_id.toLowerCase(),s=t.entity_id.toLowerCase(),n=r===i||o===i;if(n!==(a===i||s===i))return n?-1:1;const c=r.startsWith(i)||o.startsWith(i)||o.split(".")[1]?.startsWith(i);return c!==(a.startsWith(i)||s.startsWith(i)||s.split(".")[1]?.startsWith(i))?c?-1:1:r.localeCompare(a)}),r.slice(0,21)}render(){return this._hass?r.qy`
      <div class="card-config">
        ${this._renderOverviewSection()}
        ${this._renderSummariesSection()}
        ${this._renderFavoritesSection()}

        <div class="section-divider">
          <div class="section-divider-title">
            ${(0,te.localize)("editor.section_areas_rooms")}
          </div>
        </div>

        ${this._renderAreasSection()}
        ${this._renderRoomPinsSection()}
        ${this._renderViewsSection()}

        <div class="section-divider">
          <div class="section-divider-title">
            ${(0,te.localize)("editor.section_advanced")}
          </div>
        </div>

        ${this._renderAdvancedOptionsSection()}
        ${this._renderSectionOrderPanel()}
        ${this._renderCustomContentSection()}
      </div>
      ${this._cardPickerOpen?this._renderCardPickerOverlay():r.s6}
    `:r.s6}_renderAdvancedOptionsSection(){const e=!0===this._config.hide_unavailable_entities;return r.qy`
      <div class="section">
        <div class="section-title">${(0,te.localize)("editor.section_advanced_options")}</div>

        ${this._renderCheckbox("hide-unavailable-entities",(0,te.localize)("editor.hide_unavailable_entities"),e,e=>this._toggleChanged("hide_unavailable_entities",e,!1))}
        <div class="description">${(0,te.localize)("editor.hide_unavailable_entities_desc")}</div>
      </div>
    `}_getSectionsOrder(){return this._config.sections_order||[...X.GC]}_updateSectionsOrder(e){const t={...this._config,sections_order:e};this._config=t,this._fireConfigChanged(t)}_isSectionDisabled(e){switch(e){case"custom_cards":return 0===(this._config.custom_cards||[]).length;case"custom_sections":return 0===(this._config.custom_sections||[]).length;case"weather":return!1===this._config.show_weather;case"energy":return!1===this._config.show_energy;default:return!1}}_isSectionToggleable(e){return"weather"===e||"energy"===e}_toggleSectionVisibility(e,t){"weather"===e?this._toggleChanged("show_weather",t,!0):"energy"===e&&this._toggleChanged("show_energy",t,!0)}_renderSectionOrderPanel(){const e=this._getSectionsOrder(),t=!1!==this._config.energy_link_dashboard,i=!1!==this._config.show_energy;return r.qy`
      <div class="section">
        <div class="section-title">${(0,te.localize)("editor.section_order")}</div>
        <div class="description" style="margin-left: 0; margin-bottom: 12px;">
          ${(0,te.localize)("editor.section_order_desc")}
        </div>
        <div class="section-order-list" id="section-order-list">
          ${e.map(e=>{const a=ne._sectionMeta.get(e);if(!a)return r.s6;const o=this._isSectionDisabled(e),s=this._isSectionToggleable(e);return r.qy`
              <div class="section-order-item ${o?"disabled":""}"
                data-section-key=${e}
                draggable="true"
                @dragstart=${this._handleSectionDragStart}
                @dragend=${this._handleSectionDragEnd}
                @dragover=${this._handleSectionDragOver}
                @dragleave=${this._handleSectionDragLeave}
                @drop=${this._handleSectionDrop}>
                <span class="drag-handle" draggable="true">&#x2630;</span>
                <ha-icon class="section-icon" icon=${a.icon}></ha-icon>
                <span class="section-label">${(0,te.localize)(a.labelKey)}</span>
                ${o&&!s?r.qy`<span class="section-hidden-tag">(${(0,te.localize)("editor.section_hidden")})</span>`:r.s6}
                ${s?r.qy`
                  <label class="section-toggle" @mousedown=${e=>{e.stopPropagation()}}>
                    <input type="checkbox"
                      ?checked=${!o}
                      @change=${t=>{this._toggleSectionVisibility(e,t.target.checked)}}
                      @dragstart=${e=>{e.stopPropagation()}} />
                  </label>
                `:r.s6}
              </div>
              ${"energy"===e&&i?r.qy`
                <div class="section-order-sub">
                  <input type="checkbox" id="energy-link-dashboard"
                    ?checked=${t}
                    @change=${e=>{this._toggleChanged("energy_link_dashboard",e.target.checked,!0)}} />
                  <label for="energy-link-dashboard">${(0,te.localize)("editor.energy_link_dashboard")}</label>
                </div>
              `:r.s6}
            `})}
        </div>
      </div>
    `}_getWeatherStartOrder(){return this._config.weather_start_order||[...X.lg]}_isWeatherStartBlockDisabled(e){switch(e){case"weather_current":case"weather_hourly":case"weather_daily":default:return!1;case"custom_cards":return 0===(this._config.custom_cards||[]).length;case"custom_sections":return 0===(this._config.custom_sections||[]).length;case"summaries":return!1===this._config.show_light_summary&&!1===this._config.show_covers_summary&&!1===this._config.show_security_summary&&!1===this._config.show_battery_summary&&!0!==this._config.show_climate_summary}}_createWeatherStartItemId(e){return`${e}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}_getWeatherStartAreaOptions(){if(!this._hass)return[];const e=this._config.areas_display?.hidden||[],t=this._config.areas_display?.order||[],i=e.join("\0"),r=t.join("\0");if(this._weatherStartAreaOptionsCache&&this._weatherStartAreaOptionsCache.areas===this._hass.areas&&this._weatherStartAreaOptionsCache.hiddenKey===i&&this._weatherStartAreaOptionsCache.orderKey===r)return this._weatherStartAreaOptionsCache.options;const a=new Set(e),o=new Map(t.map((e,t)=>[e,t])),s=Object.values(this._hass.areas||{}).filter(e=>!a.has(e.area_id)).sort((e,t)=>{const i=o.get(e.area_id)??-1,r=o.get(t.area_id)??-1;return(i>=0?i:9999)-(r>=0?r:9999)||e.name.localeCompare(t.name)});return this._weatherStartAreaOptionsCache={areas:this._hass.areas,hiddenKey:i,orderKey:r,options:s},s}_getWeatherStartFloorOptions(){if(!this._hass)return[];const e=this._getWeatherStartAreaOptions();if(this._weatherStartFloorOptionsCache&&this._weatherStartFloorOptionsCache.floors===this._hass.floors&&this._weatherStartFloorOptionsCache.areas===e)return this._weatherStartFloorOptionsCache.options;const t=new Set;let i=!1;for(const r of e)r.floor_id?t.add(r.floor_id):i=!0;const r=Object.values(this._hass.floors||{}).filter(e=>t.has(e.floor_id)).sort((e,t)=>(e.level??9999)-(t.level??9999)||e.name.localeCompare(t.name)).map(e=>({floor_id:e.floor_id,name:e.name,icon:e.icon}));return i&&r.push({floor_id:null,name:(0,te.localize)("sections.areas_other"),icon:"mdi:home-outline"}),this._weatherStartFloorOptionsCache={floors:this._hass.floors,areas:e,options:r},r}_getCustomCardRef(e,t){return e.id||`legacy-custom-card-${t}`}_getCustomSectionRef(e,t){return e.id||`legacy-custom-section-${t}`}_getCustomCardEditorLabel(e,t){return e?.editor_title||e?.title||t}_getLegacyWeatherStartLayoutItems(){const e=this._getWeatherStartOrder(),t=[];for(const i of e){const e=this._config.weather_start_blocks_config?.[i];if("areas"===i)if(!0===this._config.group_by_floors)for(const e of this._getWeatherStartFloorOptions())t.push({id:`floor-${e.floor_id||"none"}`,type:"floor",floor_id:e.floor_id,title:e.name});else for(const e of this._getWeatherStartAreaOptions())t.push({id:`area-${e.area_id}`,type:"area",area_id:e.area_id});else"custom_cards"===i?(this._config.custom_cards||[]).forEach((e,i)=>{t.push({id:`custom-card-${this._getCustomCardRef(e,i)}`,type:"custom_card",custom_card_id:this._getCustomCardRef(e,i)})}):"custom_sections"===i?(this._config.custom_sections||[]).forEach((e,i)=>{t.push({id:`custom-section-${this._getCustomSectionRef(e,i)}`,type:"custom_section",custom_section_id:this._getCustomSectionRef(e,i)})}):t.push({id:i,type:i,...e?.yaml?{yaml:e.yaml,parsed_config:e.parsed_config,_yaml_error:e._yaml_error}:{}})}return t}_normalizeWeatherStartLayoutItems(e){const t=this._getWeatherStartAreaOptions(),i=new Set(t.map(e=>e.area_id)),r=new Set,a=[],o=(e,t)=>{i.has(e)&&!r.has(e)&&(r.add(e),a.push({...t||{},id:t?.id||`area-${e}`,type:"area",area_id:e}))},s=e=>{const i=t.filter(t=>e.floor_id?t.floor_id===e.floor_id:!t.floor_id);if(0!==i.length){for(const e of i)r.add(e.area_id);a.push({...e})}};for(const i of e)if("area"!==i.type)if("floor"!==i.type)if("areas"!==i.type)a.push({...i});else if(!0===this._config.group_by_floors)for(const e of this._getWeatherStartFloorOptions())s({id:`floor-${e.floor_id||"none"}`,type:"floor",floor_id:e.floor_id,title:e.name});else for(const e of t)o(e.area_id);else s(i);else i.area_id&&o(i.area_id,i);for(const e of t)o(e.area_id);return a}_getWeatherStartLayoutItems(){const e=this._config.weather_start_layout_items?.length?this._config.weather_start_layout_items.map(e=>({...e})):this._getLegacyWeatherStartLayoutItems();return this._normalizeWeatherStartLayoutItems(e)}_saveWeatherStartLayoutItems(e){const t=this._normalizeWeatherStartLayoutItems(e),i={...this._config,weather_start_layout_items:t};this._config=i,this._fireConfigChanged(i)}_toggleWeatherBlockExpanded(e){const t=new Set(this._expandedWeatherBlocks);t.has(e)?t.delete(e):t.add(e),this._expandedWeatherBlocks=t}_parseWeatherStartItemYaml(e){const t=e.trim();if(!t)return{parsed_config:void 0,_yaml_error:void 0};try{const e=Q.load(t);return Array.isArray(e)||e&&"object"==typeof e?{parsed_config:e}:{parsed_config:void 0,_yaml_error:"YAML must be a card, section, view with sections, or list of cards"}}catch(e){return{parsed_config:void 0,_yaml_error:(e instanceof Error?e.message.split("\n")[0]:"Invalid YAML")||"Invalid YAML"}}}_updateWeatherStartItemYaml(e,t){const i=this._getWeatherStartLayoutItems().map(i=>{if(i.id!==e)return i;const r={...i,yaml:t},a=this._parseWeatherStartItemYaml(t);return r.parsed_config=a.parsed_config,r._yaml_error=a._yaml_error,t.trim()||(delete r.yaml,delete r.parsed_config,delete r._yaml_error),r});if(i.find(t=>t.id===e&&t._yaml_error))return this._config={...this._config,weather_start_layout_items:i},void this.requestUpdate();this._saveWeatherStartLayoutItems(i)}_resetWeatherStartItemYaml(e){const t=this._getWeatherStartLayoutItems().map(t=>{if(t.id!==e)return t;const i={...t};return delete i.yaml,delete i.parsed_config,delete i._yaml_error,i});this._saveWeatherStartLayoutItems(t)}_getWeatherStartCustomCardIndex(e,t=this._config.custom_cards||[]){return"custom_card"!==e.type?-1:t.findIndex((t,i)=>this._getCustomCardRef(t,i)===e.custom_card_id)}_getWeatherStartCustomSectionIndex(e,t=this._config.custom_sections||[]){return"custom_section"!==e.type?-1:t.findIndex((t,i)=>this._getCustomSectionRef(t,i)===e.custom_section_id)}_renderWeatherStartCustomCardEditor(e,t){const i=e._yaml_error?r.qy`<div style="color: var(--error-color); font-size: 12px; margin-top: 4px;">&#x274C; ${e._yaml_error}</div>`:e.yaml?r.qy`<div style="color: var(--success-color, green); font-size: 12px; margin-top: 4px;">&#x2705; ${(0,te.localize)("editor.yaml_valid")}</div>`:r.s6;return r.qy`
      <label class="form-row" style="margin: 0 0 8px 0;">
        <span style="min-width: 150px;">${(0,te.localize)("editor.card_editor_title_label")}</span>
        <input type="text"
          style="flex: 1;"
          .value=${e.editor_title||""}
          placeholder=${(0,te.localize)("editor.card_editor_title_placeholder")}
          @change=${e=>this._updateCustomCardField(t,"editor_title",e.target.value)} />
      </label>
      <div class="description" style="margin: 0 0 8px 0;">${(0,te.localize)("editor.card_editor_title_help")}</div>
      <label class="form-row" style="margin: 0 0 8px 0;">
        <span style="min-width: 150px;">${(0,te.localize)("editor.card_dashboard_title_label")}</span>
        <input type="text"
          style="flex: 1;"
          .value=${e.title||""}
          placeholder=${(0,te.localize)("editor.card_title_placeholder")}
          @change=${e=>this._updateCustomCardField(t,"title",e.target.value)} />
      </label>
      <div class="description" style="margin: 0 0 6px 0;">${(0,te.localize)("editor.weather_start_card_yaml_desc")}</div>
      <textarea
        rows="8"
        style="width:100%;box-sizing:border-box;font-family:monospace;font-size:12px;resize:vertical;"
        placeholder=${(0,te.localize)("editor.yaml_placeholder")}
        .value=${e.yaml||""}
        @change=${e=>this._updateCustomCardYaml(t,e.target.value)}
      ></textarea>
      <button class="btn-primary" style="margin-top: 6px;" @click=${()=>this._openCardEditorForCustomCard(t)}>
        ${(0,te.localize)("editor.edit_card_with_ha_editor")}
      </button>
      ${i}
    `}_renderWeatherStartCustomSectionEditor(e,t){const i=e.cards||[];return r.qy`
      <div class="custom-item-row" style="margin-bottom: 8px;">
        <input type="text"
          .value=${e.title||""}
          placeholder=${(0,te.localize)("editor.custom_section_title_placeholder")}
          style="flex: 2;"
          @change=${e=>this._updateCustomSectionField(t,"title",e.target.value)} />
        <input type="text"
          .value=${e.icon||""}
          placeholder=${(0,te.localize)("editor.custom_section_icon_placeholder")}
          style="flex: 1;"
          @change=${e=>this._updateCustomSectionField(t,"icon",e.target.value)} />
      </div>
      <div class="description" style="margin: 0 0 8px 0;">${(0,te.localize)("editor.weather_start_section_cards_desc")}</div>
      ${0===i.length?r.qy`<div class="empty-state">${(0,te.localize)("editor.no_custom_cards")}</div>`:i.map((e,i)=>{const a=e._yaml_error?r.qy`<span style="color: var(--error-color);">&#x274C; ${e._yaml_error}</span>`:e.yaml?r.qy`<span style="color: var(--success-color, green);">&#x2705; ${(0,te.localize)("editor.yaml_valid")}</span>`:r.s6;return r.qy`
            <div class="custom-item" style="margin-bottom: 8px;">
              <div class="custom-item-header">
                <strong>${this._getCustomCardEditorLabel(e,`${(0,te.localize)("editor.new_card")} ${i+1}`)}</strong>
                <button class="btn-remove" @click=${()=>this._removeCardFromSection(t,i)}>&#x2715;</button>
              </div>
              <div class="custom-item-fields">
                <label>${(0,te.localize)("editor.card_editor_title_label")}</label>
                <input type="text" .value=${e.editor_title||""} placeholder=${(0,te.localize)("editor.card_editor_title_placeholder")}
                  @change=${e=>this._updateSectionCardField(t,i,"editor_title",e.target.value)} />
                <div class="description" style="margin: 0 0 4px 0;">${(0,te.localize)("editor.card_editor_title_help")}</div>
                <label>${(0,te.localize)("editor.card_dashboard_title_label")}</label>
                <input type="text" .value=${e.title||""} placeholder=${(0,te.localize)("editor.card_title_placeholder")}
                  @change=${e=>this._updateSectionCardField(t,i,"title",e.target.value)} />
                <textarea rows="5" placeholder=${(0,te.localize)("editor.yaml_placeholder")}
                  .value=${e.yaml||""}
                  style="width: 100%;"
                  @change=${e=>this._updateSectionCardYaml(t,i,e.target.value)}></textarea>
                <button class="btn-primary" style="margin-top: 6px;"
                  @click=${()=>this._openCardEditorForSectionCard(t,i)}>
                  ${(0,te.localize)("editor.edit_card_with_ha_editor")}
                </button>
                <div class="custom-item-validation">${a}</div>
              </div>
            </div>
          `})}
      <button class="btn-primary" style="margin-top: 4px;" @click=${()=>this._openCardPickerForSection(t)}>
        ${(0,te.localize)("editor.add_card_to_section")}
      </button>
    `}_removeWeatherStartItem(e){const t=this._getWeatherStartLayoutItems(),i=t.find(t=>t.id===e),r=t.filter(t=>t.id!==e);if(i){if("custom_card"===i.type){const e=[...this._config.custom_cards||[]],t=this._getWeatherStartCustomCardIndex(i,e);t>=0&&e.splice(t,1);const a={...this._config,weather_start_layout_items:r};return e.length>0?a.custom_cards=e:delete a.custom_cards,this._config=a,void this._fireConfigChanged(a)}if("custom_section"===i.type){const e=[...this._config.custom_sections||[]],t=this._getWeatherStartCustomSectionIndex(i,e);t>=0&&e.splice(t,1);const a={...this._config,weather_start_layout_items:r};return e.length>0?a.custom_sections=e:delete a.custom_sections,this._config=a,void this._fireConfigChanged(a)}this._saveWeatherStartLayoutItems(r)}else this._saveWeatherStartLayoutItems(r)}_addWeatherStartSummaries(){const e=this._getWeatherStartLayoutItems();e.some(e=>"summaries"===e.type)||(e.push({id:this._createWeatherStartItemId("summaries"),type:"summaries",summary_size:"mini"}),this._saveWeatherStartLayoutItems(e),this._expandedWeatherBlocks=new Set([...this._expandedWeatherBlocks,e[e.length-1].id]))}_addWeatherStartArea(e){const t=e.target.value;if(!t)return;const i=this._getWeatherStartLayoutItems();i.push({id:this._createWeatherStartItemId(`area-${t}`),type:"area",area_id:t}),this._saveWeatherStartLayoutItems(i),e.target.value=""}_addWeatherStartFloor(e){const t=e.target.value;if(!t)return;const i="__none__"===t?null:t,r=this._getWeatherStartFloorOptions().find(e=>e.floor_id===i),a=this._getWeatherStartLayoutItems();a.push({id:this._createWeatherStartItemId(`floor-${i||"none"}`),type:"floor",floor_id:i,title:r?.name}),this._saveWeatherStartLayoutItems(a),e.target.value=""}_toggleWeatherStartItemStack(e,t){const i=this._getWeatherStartLayoutItems().map(i=>{if(i.id!==e)return i;const r={...i};return t?r.stack_with_previous=!0:delete r.stack_with_previous,r});this._saveWeatherStartLayoutItems(i)}_weatherStartSummarySizeChanged(e,t){const i=this._getWeatherStartLayoutItems().map(i=>i.id!==e?i:{...i,summary_size:t});this._saveWeatherStartLayoutItems(i)}_addWeatherStartSection(){const e=this._createWeatherStartItemId("section"),t=[...this._config.custom_sections||[],{id:e,title:"",icon:"",cards:[]}],i=[...this._getWeatherStartLayoutItems(),{id:`custom-section-${e}`,type:"custom_section",custom_section_id:e}],r={...this._config,custom_sections:t,weather_start_layout_items:i};this._config=r,this._fireConfigChanged(r),this._expandedWeatherBlocks=new Set([...this._expandedWeatherBlocks,`custom-section-${e}`])}_getWeatherStartItemMeta(e,t,i,r){if("area"===e.type){const i=t.find(t=>t.area_id===e.area_id);return{icon:i?.icon||"mdi:home-outline",label:i?.name||e.area_id||(0,te.localize)("sections.areas")}}if("floor"===e.type){const t=this._getWeatherStartFloorOptions().find(t=>t.floor_id===(e.floor_id??null));return{icon:t?.icon||"mdi:floor-plan",label:e.title||t?.name||(0,te.localize)("sections.areas")}}if("custom_card"===e.type){const t=i.find((t,i)=>this._getCustomCardRef(t,i)===e.custom_card_id);return{icon:"mdi:cards",label:this._getCustomCardEditorLabel(t,(0,te.localize)("editor.new_card"))}}if("custom_section"===e.type){const t=r.find((t,i)=>this._getCustomSectionRef(t,i)===e.custom_section_id);return{icon:t?.icon||"mdi:view-grid-plus-outline",label:t?.title||(0,te.localize)("editor.section_custom_sections")}}const a=ne._weatherStartBlockMeta.get(e.type);return{icon:a?.icon||"mdi:view-dashboard-outline",label:a?(0,te.localize)(a.labelKey):e.type}}_isWeatherStartItemDisabled(e,t,i){return!e.parsed_config&&(!!e._yaml_error||("custom_card"===e.type?!t.some((t,i)=>this._getCustomCardRef(t,i)===e.custom_card_id&&t.parsed_config):"custom_section"===e.type?!i.some((t,i)=>this._getCustomSectionRef(t,i)===e.custom_section_id&&(t.cards||[]).some(e=>e.parsed_config)):"floor"===e.type?!this._getWeatherStartAreaOptions().some(t=>e.floor_id?t.floor_id===e.floor_id:!t.floor_id):"summaries"===e.type&&this._isWeatherStartBlockDisabled("summaries")))}_renderWeatherStartOrderPanel(){const e=this._getWeatherStartLayoutItems(),t=this._getWeatherStartAreaOptions(),i=this._getWeatherStartFloorOptions(),a=this._config.custom_cards||[],o=this._config.custom_sections||[],s=e.some(e=>"summaries"===e.type),n=new Set(e.filter(e=>"area"===e.type&&e.area_id).map(e=>e.area_id));for(const i of e)if("floor"===i.type)for(const e of t)(i.floor_id?e.floor_id!==i.floor_id:e.floor_id)||n.add(e.area_id);const c=t.filter(e=>!n.has(e.area_id));return r.qy`
      <div class="section">
        <div class="section-title">${(0,te.localize)("editor.weather_start_order")}</div>
        <div class="description" style="margin-left: 0; margin-bottom: 12px;">
          ${(0,te.localize)("editor.weather_start_order_desc")}
        </div>
        <div class="section-order-list" id="weather-start-order-list">
          ${e.map(e=>{const i=this._getWeatherStartItemMeta(e,t,a,o),s=this._isWeatherStartItemDisabled(e,a,o),n=this._expandedWeatherBlocks.has(e.id),c=!!e.yaml,l="area"!==e.type&&"floor"!==e.type,d=this._getWeatherStartCustomCardIndex(e,a),p=d>=0?a[d]:void 0,h=this._getWeatherStartCustomSectionIndex(e,o),_=h>=0?o[h]:void 0;return r.qy`
              <div>
                <div class="section-order-item ${s?"disabled":""}"
                  data-ws-id=${e.id}
                  draggable="true"
                  @dragstart=${this._handleWeatherStartDragStart}
                  @dragend=${this._handleWeatherStartDragEnd}
                  @dragover=${this._handleWeatherStartDragOver}
                  @dragleave=${this._handleWeatherStartDragLeave}
                  @drop=${this._handleWeatherStartDrop}>
                  <span class="drag-handle" draggable="true">&#x2630;</span>
                  <ha-icon class="section-icon" icon=${i.icon}></ha-icon>
                  <span class="section-label">${i.label}</span>
                  ${s?r.qy`<span class="section-hidden-tag">(${(0,te.localize)("editor.section_hidden")})</span>`:r.s6}
                  ${c?r.qy`<span class="section-hidden-tag" style="background:var(--primary-color);color:#fff;margin-left:4px;">✎</span>`:r.s6}
                  <button class="icon-btn" style="margin-left:auto;"
                    title=${(0,te.localize)("editor.weather_start_block_expand")}
                    @click=${t=>{t.stopPropagation(),this._toggleWeatherBlockExpanded(e.id)}}>
                    <ha-icon icon=${n?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
                  </button>
                  ${l?r.qy`
                    <button class="icon-btn"
                      title=${(0,te.localize)("editor.remove")}
                      @click=${t=>{t.stopPropagation(),this._removeWeatherStartItem(e.id)}}>
                      <ha-icon icon="mdi:delete-outline"></ha-icon>
                    </button>
                  `:r.s6}
                </div>
                ${n?r.qy`
                  <div style="padding: 8px 12px 12px 12px; background: var(--secondary-background-color); border-radius: 0 0 8px 8px; margin-bottom: 4px;">
                    ${p?this._renderWeatherStartCustomCardEditor(p,d):r.s6}
                    ${_?this._renderWeatherStartCustomSectionEditor(_,h):r.s6}
                    ${p||_||"summaries"!==e.type?r.s6:r.qy`
                      <label class="form-row" style="margin: 0 0 8px 0;">
                        <span style="min-width: 120px;">${(0,te.localize)("editor.weather_start_summary_size")}</span>
                        <select
                          style="flex:1;"
                          .value=${e.summary_size||"mini"}
                          @change=${t=>this._weatherStartSummarySizeChanged(e.id,t.target.value)}>
                          <option value="mini">${(0,te.localize)("editor.weather_start_summary_size_mini")}</option>
                          <option value="normal">${(0,te.localize)("editor.weather_start_summary_size_normal")}</option>
                        </select>
                      </label>
                    `}
                    ${p||_?r.s6:r.qy`
                      <label class="form-row" style="margin: 0 0 8px 0;">
                      <input type="checkbox"
                        ?checked=${!0===e.stack_with_previous}
                        @change=${t=>this._toggleWeatherStartItemStack(e.id,t.target.checked)} />
                      <span>${(0,te.localize)("editor.weather_start_stack_with_previous")}</span>
                      </label>
                      <div class="description" style="margin: 0 0 6px 0;">${(0,te.localize)("editor.weather_start_block_yaml_desc")}</div>
                      <textarea
                        rows="6"
                        style="width:100%;box-sizing:border-box;font-family:monospace;font-size:12px;resize:vertical;"
                        placeholder=${(0,te.localize)("editor.yaml_placeholder")}
                        .value=${e.yaml||""}
                        @change=${t=>this._updateWeatherStartItemYaml(e.id,t.target.value)}
                      ></textarea>
                      ${e._yaml_error?r.qy`<div style="color:var(--error-color);font-size:12px;margin-top:4px;">${e._yaml_error}</div>`:r.s6}
                      ${e.parsed_config?r.qy`<div style="color:var(--success-color,green);font-size:12px;margin-top:4px;">${(0,te.localize)("editor.yaml_valid")}</div>`:r.s6}
                      ${c?r.qy`
                        <button class="text-btn" style="margin-top:8px;"
                          @click=${()=>this._resetWeatherStartItemYaml(e.id)}>
                          ${(0,te.localize)("editor.weather_start_block_reset")}
                        </button>
                      `:r.s6}
                    `}
                  </div>
                `:r.s6}
              </div>
            `})}
        </div>
        <div class="description" style="margin: 12px 0 6px 0;">${(0,te.localize)("editor.weather_start_add_content_desc")}</div>
        <div class="custom-item-row weather-start-add-row">
          <button class="btn-primary" @click=${this._openCardPickerForWeatherStartCard}>
            ${(0,te.localize)("editor.weather_start_add_card")}
          </button>
          ${s?r.s6:r.qy`
            <button class="btn-primary" @click=${this._addWeatherStartSummaries}>
              ${(0,te.localize)("editor.weather_start_add_summaries")}
            </button>
          `}
          <button class="btn-primary" @click=${this._addWeatherStartSection}>
            ${(0,te.localize)("editor.weather_start_add_section")}
          </button>
          <select @change=${this._addWeatherStartArea}>
            <option value="">${(0,te.localize)("editor.weather_start_add_area")}</option>
            ${c.map(e=>r.qy`<option value=${e.area_id}>${e.name}</option>`)}
          </select>
          <select @change=${this._addWeatherStartFloor}>
            <option value="">${(0,te.localize)("editor.weather_start_add_floor")}</option>
            ${i.map(e=>r.qy`<option value=${e.floor_id||"__none__"}>${e.name}</option>`)}
          </select>
        </div>
      </div>
    `}_getStacksOrder(e){return(0,re.WZ)(this._config.areas_options?.[e]?.stacks_order)}_updateStacksOrder(e,t){const i={...this._config.areas_options?.[e]||{}};t.join("|")===X.xo.join("|")?delete i.stacks_order:i.stacks_order=t;const r={...this._config.areas_options,[e]:i};0===Object.keys(r[e]).length&&delete r[e];const a={...this._config};0===Object.keys(r).length?delete a.areas_options:a.areas_options=r,this._config=a,this._fireConfigChanged(a)}_writeAreaOptions(e,t){const i={...this._config.areas_options,[e]:t};0===Object.keys(i[e]).length&&delete i[e];const r={...this._config};0===Object.keys(i).length?delete r.areas_options:r.areas_options=i,this._config=r,this._fireConfigChanged(r)}_updateAreaCameraOption(e,t){const i={...this._config.areas_options?.[e]||{}};t(i),this._writeAreaOptions(e,i)}_presentStackKeys(e){const t=e.groupedEntities,i=new Set,r=e=>(t[e]?.length??0)>0;return r("lights")&&i.add("lights"),r("locks")&&i.add("locks"),(r("climate")||r("fan"))&&i.add("climate"),(r("covers")||r("covers_curtain"))&&i.add("covers"),r("covers_window")&&i.add("covers_window"),r("media_player")&&i.add("media"),(r("scenes")||r("automations")||r("scripts"))&&i.add("scenes"),(r("vacuum")||r("switches"))&&i.add("misc"),r("energy")&&i.add("energy"),i.add("cameras"),i.add("room_pins"),i}_renderStackOrderPanel(e,t){const i=this._getStacksOrder(e),a=this._presentStackKeys(t),o=i.filter(e=>a.has(e)),s=i.filter(e=>!a.has(e));return r.qy`
      <div class="entity-group" data-group="stack_order">
        <div class="entity-group-header">
          <ha-icon icon="mdi:sort"></ha-icon>
          <span class="group-name">${(0,te.localize)("editor.stack_order")}</span>
        </div>
        <div class="entity-list">
          <div class="description" style="margin-left: 0; margin-bottom: 8px;">
            ${(0,te.localize)("editor.stack_order_desc")}
          </div>
          <div class="section-order-list" data-area-id=${e}>
            ${o.map(t=>{const i=ne._stackMeta.get(t);return i?r.qy`
                <div class="section-order-item"
                  data-area-id=${e}
                  data-stack-key=${t}
                  draggable="true"
                  @dragstart=${this._handleStackDragStart}
                  @dragend=${this._handleStackDragEnd}
                  @dragover=${this._handleStackDragOver}
                  @dragleave=${this._handleStackDragLeave}
                  @drop=${this._handleStackDrop}>
                  <span class="drag-handle" draggable="true">&#x2630;</span>
                  <ha-icon class="section-icon" icon=${i.icon}></ha-icon>
                  <span class="section-label">${(0,te.localize)(i.labelKey)}</span>
                </div>
              `:r.s6})}
          </div>
          ${s.length>0?r.qy`
              <div class="section-order-compact">
                <div class="compact-title">${(0,te.localize)("editor.stack_order_inactive")}</div>
                <div class="compact-chip-list">
                  ${s.map(e=>{const t=ne._stackMeta.get(e);return t?r.qy`
                      <span class="compact-chip">
                        <ha-icon icon=${t.icon}></ha-icon>
                        ${(0,te.localize)(t.labelKey)}
                      </span>
                    `:r.s6})}
                </div>
              </div>
            `:r.s6}
        </div>
      </div>
    `}_renderOverviewSection(){const e=!1!==this._config.show_clock_card,t=!0===this._config.show_search_card,i=this._checkSearchCardDependencies(),o=this._config.alarm_entity||"",s=this._getAlarmEntities(),n=this._config.weather_entity||"",c=this._getWeatherEntities(),l=this._config.theme||"",d=this._getThemeNames(),p=this._config.overview_layout||"default";return r.qy`
      <div class="section">
        <div class="section-title">${(0,te.localize)("editor.section_overview")}</div>

        <div class="form-row">
          <label for="dashboard-theme" style="margin-right: 8px; min-width: 120px;">${(0,te.localize)("editor.theme")}</label>
          <select id="dashboard-theme"
            style="flex: 1;"
            @change=${this._themeChanged}>
            <option value="" ?selected=${!l}>${(0,te.localize)("editor.theme_default")}</option>
            ${d.map(e=>r.qy`
              <option value=${e} ?selected=${e===l}>${e}</option>
            `)}
          </select>
        </div>
        <div class="description">${(0,te.localize)("editor.theme_desc")}</div>

        <div class="form-row">
          <label for="overview-layout" style="margin-right: 8px; min-width: 120px;">${(0,te.localize)("editor.overview_layout")}</label>
          <select id="overview-layout"
            style="flex: 1;"
            @change=${this._overviewLayoutChanged}>
            <option value="default" ?selected=${"default"===p}>${(0,te.localize)("editor.overview_layout_default")}</option>
            <option value="weather_start" ?selected=${"weather_start"===p}>${(0,te.localize)("editor.overview_layout_weather_start")}</option>
          </select>
        </div>
        <div class="description">${(0,te.localize)("editor.overview_layout_desc")}</div>

        <div class="form-row">
          <label for="weather-entity" style="margin-right: 8px; min-width: 120px;">${(0,te.localize)("editor.weather_entity")}</label>
          <select id="weather-entity"
            style="flex: 1;"
            @change=${this._weatherEntityChanged}>
            <option value="" ?selected=${!n}>${(0,te.localize)("editor.weather_entity_auto")}</option>
            ${c.map(e=>r.qy`
              <option value=${e.entity_id} ?selected=${e.entity_id===n}>
                ${e.name}
              </option>
            `)}
          </select>
        </div>
        <div class="description">${(0,te.localize)("editor.weather_entity_desc")}</div>

        ${"weather_start"===p?this._renderWeatherStartOrderPanel():r.s6}

        ${"weather_start"!==p?r.qy`
          ${this._renderCheckbox("show-clock-card",(0,te.localize)("editor.show_clock_card"),e,e=>this._toggleChanged("show_clock_card",e,!0))}
          <div class="description">${(0,te.localize)("editor.show_clock_card_desc")}</div>

          <div class="form-row">
            <label for="alarm-entity" style="margin-right: 8px; min-width: 120px;">${(0,te.localize)("editor.alarm_entity")}</label>
            <select id="alarm-entity"
              style="flex: 1;"
              @change=${this._alarmEntityChanged}>
              <option value="" ?selected=${!o}>${(0,te.localize)("editor.alarm_none")}</option>
              ${s.map(e=>r.qy`
                <option value=${e.entity_id} ?selected=${e.entity_id===o}>
                  ${e.name}
                </option>
              `)}
            </select>
          </div>
          <div class="description">${(0,te.localize)("editor.alarm_desc")}</div>

          ${this._renderCheckbox("show-search-card",(0,te.localize)("editor.show_search_card"),t,e=>this._toggleChanged("show_search_card",e,!1),!i)}
          <div class="description">
            ${i?(0,te.localize)("editor.show_search_card_desc"):r.qy`<span>&#x26A0;&#xFE0F; ${(0,a._)((0,te.localize)("editor.show_search_card_missing"))}</span>`}
          </div>
        `:r.s6}
      </div>
    `}_renderSummariesSection(){const e=this._config.summaries_columns||2,t=!1!==this._config.show_light_summary,i=!0===this._config.group_lights_by_floors,a=!0===this._config.nested_light_groups,o=!1!==this._config.show_covers_summary,s=!0===this._config.show_partially_open_covers,n=!1!==this._config.show_security_summary,c=!0===this._config.show_climate_summary,l=!1!==this._config.show_battery_summary,d=!0===this._config.hide_mobile_app_batteries,p=this._config.battery_critical_threshold??20,h=this._config.battery_low_threshold??50;return r.qy`
      <div class="section">
        <div class="section-title">${(0,te.localize)("editor.section_summaries")}</div>

        <div class="form-row">
          <input type="radio" id="summaries-2-columns" name="summaries-columns" value="2"
            ?checked=${2===e}
            @change=${()=>this._summariesColumnsChanged(2)} />
          <label for="summaries-2-columns">${(0,te.localize)("editor.columns_2")}</label>
        </div>
        <div class="form-row">
          <input type="radio" id="summaries-4-columns" name="summaries-columns" value="4"
            ?checked=${4===e}
            @change=${()=>this._summariesColumnsChanged(4)} />
          <label for="summaries-4-columns">${(0,te.localize)("editor.columns_4")}</label>
        </div>
        <div class="description">${(0,te.localize)("editor.columns_desc")}</div>

        ${this._renderCheckbox("show-light-summary",(0,te.localize)("editor.show_light_summary"),t,e=>this._toggleChanged("show_light_summary",e,!0))}

        ${this._renderCheckbox("group-lights-by-floors",(0,te.localize)("editor.group_lights_by_floors"),i,e=>this._toggleChanged("group_lights_by_floors",e,!1))}
        <div class="description">${(0,te.localize)("editor.group_lights_by_floors_desc")}</div>

        ${this._renderCheckbox("nested-light-groups",(0,te.localize)("editor.nested_light_groups"),a,e=>this._toggleChanged("nested_light_groups",e,!1))}
        <div class="description">${(0,te.localize)("editor.nested_light_groups_desc")}</div>

        ${this._renderCheckbox("show-covers-summary",(0,te.localize)("editor.show_covers_summary"),o,e=>this._toggleChanged("show_covers_summary",e,!0))}

        <div style="margin-left: 26px; margin-bottom: 8px;">
          ${this._renderCheckbox("show-partially-open-covers",(0,te.localize)("editor.show_partially_open_covers"),s,e=>this._toggleChanged("show_partially_open_covers",e,!1))}
          <div class="description">${(0,te.localize)("editor.show_partially_open_covers_desc")}</div>
        </div>

        ${this._renderCheckbox("show-security-summary",(0,te.localize)("editor.show_security_summary"),n,e=>this._toggleChanged("show_security_summary",e,!0))}

        ${this._renderCheckbox("show-climate-summary",(0,te.localize)("editor.show_climate_summary"),c,e=>this._toggleChanged("show_climate_summary",e,!1))}
        <div class="description">${(0,te.localize)("editor.show_climate_summary_desc")}</div>

        ${this._renderCheckbox("show-battery-summary",(0,te.localize)("editor.show_battery_summary"),l,e=>this._toggleChanged("show_battery_summary",e,!0))}

        <div style="margin-left: 26px; margin-bottom: 8px;">
          ${this._renderCheckbox("hide-mobile-app-batteries",(0,te.localize)("editor.hide_mobile_app_batteries"),d,e=>this._toggleChanged("hide_mobile_app_batteries",e,!1))}
          <div class="description">${(0,te.localize)("editor.hide_mobile_app_batteries_desc")}</div>

          <div style="font-size: 13px; font-weight: 500; color: var(--primary-text-color); margin-top: 12px; margin-bottom: 4px;">
            ${(0,te.localize)("editor.battery_thresholds")}
          </div>
          <div class="form-row">
            <label for="battery-critical-threshold" style="min-width: 140px;">${(0,te.localize)("editor.battery_critical_below")}</label>
            <input type="number" id="battery-critical-threshold" min="1" max="99"
              .value=${String(p)}
              style="width: 70px;"
              @change=${this._batteryCriticalChanged} /> %
          </div>
          <div class="form-row">
            <label for="battery-low-threshold" style="min-width: 140px;">${(0,te.localize)("editor.battery_low_below")}</label>
            <input type="number" id="battery-low-threshold" min="1" max="99"
              .value=${String(h)}
              style="width: 70px;"
              @change=${this._batteryLowChanged} /> %
          </div>
          <div class="description">${(0,te.localize)("editor.battery_thresholds_desc")}</div>
        </div>
      </div>
    `}_renderFavoritesSection(){const e=this._config.favorite_entities||[],t=this._getAllEntitiesForSelect(),i=!0===this._config.favorites_show_state,a=!0===this._config.favorites_hide_last_changed,o=new Map(t.map(e=>[e.entity_id,e.name])),s=this._getFilteredEntities(this._favoriteSearch);return r.qy`
      <div class="section">
        <div class="section-title">${(0,te.localize)("editor.section_favorites")}</div>

        <div id="favorites-list" style="margin-bottom: 12px;">
          ${0===e.length?r.qy`<div class="empty-state">${(0,te.localize)("editor.no_favorites")}</div>`:r.qy`
              <div class="entity-list-container">
                ${e.map(e=>{const t=o.get(e)||e;return r.qy`
                    <div class="entity-list-item" data-entity-id=${e}
                      draggable="true"
                      @dragstart=${e=>this._handleEntityDragStart(e,"favorites")}
                      @dragend=${this._handleEntityDragEnd}
                      @dragover=${this._handleEntityDragOver}
                      @dragleave=${this._handleEntityDragLeave}
                      @drop=${e=>this._handleEntityDrop(e,"favorites")}>
                      <span class="drag-icon">&#x2630;</span>
                      <span class="item-info">
                        <span class="item-name">${t}</span>
                        <span class="item-entity-id">${e}</span>
                      </span>
                      <button class="btn-remove" @click=${()=>this._removeFavoriteEntity(e)}>&#x2715;</button>
                    </div>
                  `})}
              </div>
            `}
        </div>

        <div class="entity-search-picker">
          <input type="text" class="entity-search-input"
            placeholder=${(0,te.localize)("editor.select_entity")+"..."}
            .value=${this._favoriteSearch}
            @input=${e=>{this._favoriteSearch=e.target.value,this.requestUpdate()}}
            @blur=${()=>{setTimeout(()=>{this._favoriteSearch="",this.requestUpdate()},200)}}
          />
          ${this._favoriteSearch.length>=2?r.qy`
            <div class="entity-search-results">
              ${s.length>0?s.map(e=>r.qy`
                  <div class="entity-search-result" @mousedown=${t=>{t.preventDefault(),this._addFavoriteEntity(e.entity_id),this._favoriteSearch="",this.requestUpdate()}}>
                    <span class="entity-search-name">${e.name}</span>
                    <span class="entity-search-id">${e.entity_id}</span>
                  </div>
                `):r.qy`<div class="entity-search-no-results">${(0,te.localize)("editor.no_results")}</div>`}
            </div>
          `:r.s6}
        </div>
        <div class="description">${(0,te.localize)("editor.favorites_desc")}</div>

        ${this._renderCheckbox("favorites-show-state",(0,te.localize)("editor.show_state"),i,e=>this._toggleChanged("favorites_show_state",e,!1))}

        ${this._renderCheckbox("favorites-hide-last-changed",(0,te.localize)("editor.hide_last_changed"),a,e=>this._toggleChanged("favorites_hide_last_changed",e,!1))}
      </div>
    `}_renderAreasSection(){const e=!0===this._config.group_by_floors,t=!0===this._config.show_switches_on_areas,i=!0===this._config.show_alerts_on_areas,a=!0===this._config.show_locks_in_rooms,o=!0===this._config.show_automations_in_rooms,s=!0===this._config.show_scripts_in_rooms,n=!1!==this._config.show_ups_in_rooms,c=!0===this._config.show_window_contacts_in_rooms,l=!0===this._config.show_door_contacts_in_rooms,d=!0===this._config.use_default_area_sort,p=Object.values(this._hass.areas).sort((e,t)=>e.name.localeCompare(t.name)),h=this._config.areas_display?.hidden||[],_=this._config.areas_display?.order||[],u=this._config.areas_display?.nav_items||[];return r.qy`
      <div class="section">
        <div class="section-title">${(0,te.localize)("editor.section_areas")}</div>

        <div class="option-groups">
          <div class="option-group">
            <div class="option-group-title">
              <ha-icon icon="mdi:view-dashboard-outline"></ha-icon>
              <span>${(0,te.localize)("editor.area_overview_options")}</span>
            </div>
            ${this._renderCheckbox("group-by-floors",(0,te.localize)("editor.group_by_floors"),e,e=>this._toggleChanged("group_by_floors",e,!1))}
            <div class="description">${(0,te.localize)("editor.group_by_floors_desc")}</div>

            ${this._renderCheckbox("show-switches-on-areas",(0,te.localize)("editor.show_switches_on_areas"),t,e=>this._toggleChanged("show_switches_on_areas",e,!1))}
            <div class="description">${(0,te.localize)("editor.show_switches_on_areas_desc")}</div>

            ${this._renderCheckbox("show-alerts-on-areas",(0,te.localize)("editor.show_alerts_on_areas"),i,e=>this._toggleChanged("show_alerts_on_areas",e,!1))}
            <div class="description">${(0,te.localize)("editor.show_alerts_on_areas_desc")}</div>
          </div>

          <div class="option-group">
            <div class="option-group-title">
              <ha-icon icon="mdi:door-open"></ha-icon>
              <span>${(0,te.localize)("editor.room_view_options")}</span>
            </div>
            ${this._renderCheckbox("show-locks-in-rooms",(0,te.localize)("editor.show_locks_in_rooms"),a,e=>this._toggleChanged("show_locks_in_rooms",e,!1))}
            <div class="description">${(0,te.localize)("editor.show_locks_in_rooms_desc")}</div>

            ${this._renderCheckbox("show-automations-in-rooms",(0,te.localize)("editor.show_automations_in_rooms"),o,e=>this._toggleChanged("show_automations_in_rooms",e,!1))}
            <div class="description">${(0,te.localize)("editor.show_automations_in_rooms_desc")}</div>

            ${this._renderCheckbox("show-scripts-in-rooms",(0,te.localize)("editor.show_scripts_in_rooms"),s,e=>this._toggleChanged("show_scripts_in_rooms",e,!1))}
            <div class="description">${(0,te.localize)("editor.show_scripts_in_rooms_desc")}</div>

            ${this._renderCheckbox("show-ups-in-rooms",(0,te.localize)("editor.show_ups_in_rooms"),n,e=>this._toggleChanged("show_ups_in_rooms",e,!0))}
            <div class="description">${(0,te.localize)("editor.show_ups_in_rooms_desc")}</div>

            ${this._renderCheckbox("show-window-contacts-in-rooms",(0,te.localize)("editor.show_window_contacts_in_rooms"),c,e=>this._toggleChanged("show_window_contacts_in_rooms",e,!1))}
            <div class="description">${(0,te.localize)("editor.show_window_contacts_in_rooms_desc")}</div>

            ${this._renderCheckbox("show-door-contacts-in-rooms",(0,te.localize)("editor.show_door_contacts_in_rooms"),l,e=>this._toggleChanged("show_door_contacts_in_rooms",e,!1))}
            <div class="description">${(0,te.localize)("editor.show_door_contacts_in_rooms_desc")}</div>
          </div>

          <div class="option-group">
            <div class="option-group-title">
              <ha-icon icon="mdi:sort-alphabetical-ascending"></ha-icon>
              <span>${(0,te.localize)("editor.area_management_options")}</span>
            </div>
            ${this._renderCheckbox("use-default-area-sort",(0,te.localize)("editor.use_default_area_sort"),d,e=>this._toggleChanged("use_default_area_sort",e,!1))}
            <div class="description">${(0,te.localize)("editor.use_default_area_sort_desc")}</div>
          </div>
        </div>

        <div class="description" style="margin-left: 0; margin-top: 16px; margin-bottom: 12px;">
          ${(0,te.localize)("editor.areas_manage_desc")}
        </div>

        <div class="area-list" id="area-list">
          ${this._renderAreaItems(p,h,_,u)}
        </div>
      </div>
    `}_renderRoomPinsSection(){const e=this._config.room_pin_entities||[],t=this._getAllEntitiesForSelect(),i=Object.values(this._hass.areas).sort((e,t)=>e.name.localeCompare(t.name)),o=!0===this._config.room_pins_show_state,s=!0===this._config.room_pins_hide_last_changed,n=new Map(t.map(e=>[e.entity_id,e])),c=new Map(i.map(e=>[e.area_id,e.name])),l=this._getFilteredEntities(this._roomPinSearch,!0);return r.qy`
      <div class="section">
        <div class="section-title">${(0,te.localize)("editor.section_room_pins")}</div>

        <div id="room-pins-list" style="margin-bottom: 12px;">
          ${0===e.length?r.qy`<div class="empty-state">${(0,te.localize)("editor.no_room_pins")}</div>`:r.qy`
              <div class="entity-list-container">
                ${e.map(e=>{const t=n.get(e),i=t?.name||e,a=t?.area_id||t?.device_area_id,o=a?c.get(a)||a:(0,te.localize)("editor.no_room");return r.qy`
                    <div class="entity-list-item" data-entity-id=${e}
                      draggable="true"
                      @dragstart=${e=>this._handleEntityDragStart(e,"room_pins")}
                      @dragend=${this._handleEntityDragEnd}
                      @dragover=${this._handleEntityDragOver}
                      @dragleave=${this._handleEntityDragLeave}
                      @drop=${e=>this._handleEntityDrop(e,"room_pins")}>
                      <span class="drag-icon">&#x2630;</span>
                      <span class="item-info">
                        <span class="item-name">${i}</span>
                        <span class="item-entity-id">${e}</span>
                        <span class="item-area">&#x1F4CD; ${o}</span>
                      </span>
                      <button class="btn-remove" @click=${()=>this._removeRoomPinEntity(e)}>&#x2715;</button>
                    </div>
                  `})}
              </div>
            `}
        </div>

        <div class="entity-search-picker">
          <input type="text" class="entity-search-input"
            placeholder=${(0,te.localize)("editor.select_entity")+"..."}
            .value=${this._roomPinSearch}
            @input=${e=>{this._roomPinSearch=e.target.value,this.requestUpdate()}}
            @blur=${()=>{setTimeout(()=>{this._roomPinSearch="",this.requestUpdate()},200)}}
          />
          ${this._roomPinSearch.length>=2?r.qy`
            <div class="entity-search-results">
              ${l.length>0?l.map(e=>r.qy`
                  <div class="entity-search-result" @mousedown=${t=>{t.preventDefault(),this._addRoomPinEntity(e.entity_id),this._roomPinSearch="",this.requestUpdate()}}>
                    <span class="entity-search-name">${e.name}</span>
                    <span class="entity-search-id">${e.entity_id}</span>
                  </div>
                `):r.qy`<div class="entity-search-no-results">${(0,te.localize)("editor.no_results")}</div>`}
            </div>
          `:r.s6}
        </div>
        <div class="description">${(0,a._)((0,te.localize)("editor.room_pins_desc"))}</div>

        ${this._renderCheckbox("room-pins-show-state",(0,te.localize)("editor.show_state"),o,e=>this._toggleChanged("room_pins_show_state",e,!1))}

        ${this._renderCheckbox("room-pins-hide-last-changed",(0,te.localize)("editor.hide_last_changed"),s,e=>this._toggleChanged("room_pins_hide_last_changed",e,!1))}
      </div>
    `}_renderViewsSection(){const e=!0===this._config.show_summary_views,t=!0===this._config.show_room_views;return r.qy`
      <div class="section">
        <div class="section-title">${(0,te.localize)("editor.section_views")}</div>

        ${this._renderCheckbox("show-summary-views",(0,te.localize)("editor.show_summary_views"),e,e=>this._toggleChanged("show_summary_views",e,!1))}
        <div class="description">${(0,te.localize)("editor.show_summary_views_desc")}</div>

        ${this._renderCheckbox("show-room-views",(0,te.localize)("editor.show_room_views"),t,e=>this._toggleChanged("show_room_views",e,!1))}
        <div class="description">${(0,te.localize)("editor.show_room_views_desc")}</div>
      </div>
    `}_renderCustomContentSection(){const e="weather_start"===(this._config.overview_layout||"default");return r.qy`
      <div class="section">
        <div class="section-title">${(0,te.localize)("editor.section_custom_content")}</div>
        <div class="description" style="margin-left: 0; margin-bottom: 12px;">
          ${(0,te.localize)("editor.section_custom_content_desc")}
        </div>
        ${e?r.qy`
          <div class="empty-state" style="margin-bottom: 12px;">
            ${(0,te.localize)("editor.custom_content_weather_start_hint")}
          </div>
        `:r.s6}
        <div class="custom-content-grid">
          ${e?r.s6:this._renderCustomCardsSection(!0)}
          ${e?r.s6:this._renderCustomSectionsSection(!0)}
          ${this._renderCustomBadgesSection(!0)}
          ${this._renderCustomViewsSection(!0)}
        </div>
      </div>
    `}_renderCustomCardsSection(e=!1){const t=this._config.custom_cards||[],i=this._config.custom_cards_heading||"",a=this._config.custom_cards_icon||"";return r.qy`
      <div class=${e?"editor-subsection":"section"}>
        <div class=${e?"subsection-title":"section-title"} style="display: flex; align-items: center; gap: 8px;">
          ${(0,te.localize)("editor.section_custom_cards")}
          <a href="https://github.com/Cyberhunter88/dashboard-strategy/blob/main/assets/Eigene-Karten-hinzufugen.gif"
            target="_blank" rel="noopener"
            style="color: var(--primary-color); text-decoration: none; font-size: 18px;"
            title=${(0,te.localize)("editor.video_tutorial")}>&#x1F3AC;</a>
        </div>
        <div class="custom-item-row" style="margin-bottom: 12px;">
          <input type="text" id="custom-cards-heading"
            .value=${i}
            placeholder=${(0,te.localize)("editor.custom_cards_heading_placeholder")}
            style="flex: 2;"
            @change=${this._customCardsHeadingChanged} />
          <input type="text" id="custom-cards-icon"
            .value=${a}
            placeholder="mdi:cards"
            style="flex: 1;"
            @change=${this._customCardsIconChanged} />
        </div>
        <div class="description" style="margin-bottom: 8px;">${(0,te.localize)("editor.custom_cards_desc")}</div>

        <div id="custom-cards-list">
          ${0===t.length?r.qy`<div class="empty-state">${(0,te.localize)("editor.no_custom_cards")}</div>`:t.map((e,t)=>this._renderCustomCardItem(e,t))}
        </div>

        <button class="btn-primary" style="margin-top: 8px;" @click=${this._openCardPickerForCustomCard}>
          ${(0,te.localize)("editor.add_custom_card")}
        </button>
        <div class="description">${(0,te.localize)("editor.custom_cards_help")}</div>
      </div>
    `}_renderCustomSectionsSection(e=!1){const t=this._config.custom_sections||[];return r.qy`
      <div class=${e?"editor-subsection":"section"}>
        <div class=${e?"subsection-title":"section-title"}>${(0,te.localize)("editor.section_custom_sections")}</div>
        <div class="description" style="margin-bottom: 8px;">${(0,te.localize)("editor.custom_sections_help")}</div>

        <div id="custom-sections-list">
          ${0===t.length?r.qy`<div class="empty-state">${(0,te.localize)("editor.no_custom_sections")}</div>`:t.map((e,t)=>this._renderCustomSectionItem(e,t))}
        </div>

        <button class="btn-primary" style="margin-top: 8px;" @click=${this._addCustomSection}>
          ${(0,te.localize)("editor.add_custom_section")}
        </button>
      </div>
    `}_renderCustomBadgesSection(e=!1){const t=this._config.custom_badges||[];return r.qy`
      <div class=${e?"editor-subsection":"section"}>
        <div class=${e?"subsection-title":"section-title"} style="display: flex; align-items: center; gap: 8px;">
          ${(0,te.localize)("editor.section_custom_badges")}
          <a href="https://github.com/Cyberhunter88/dashboard-strategy/blob/main/assets/Custom-Badges-hinzufugen.gif"
            target="_blank" rel="noopener"
            style="color: var(--primary-color); text-decoration: none; font-size: 18px;"
            title=${(0,te.localize)("editor.video_tutorial")}>&#x1F3AC;</a>
        </div>

        <div id="custom-badges-list">
          ${0===t.length?r.qy`<div class="empty-state">${(0,te.localize)("editor.no_custom_badges")}</div>`:t.map((e,t)=>this._renderCustomBadgeItem(e,t))}
        </div>

        <button class="btn-primary" style="margin-top: 8px;" @click=${this._addCustomBadge}>
          ${(0,te.localize)("editor.add_custom_badge")}
        </button>
        <div class="description">${(0,te.localize)("editor.custom_badges_help")}</div>
      </div>
    `}_renderCustomViewsSection(e=!1){const t=this._config.custom_views||[];return r.qy`
      <div class=${e?"editor-subsection":"section"}>
        <div class=${e?"subsection-title":"section-title"} style="display: flex; align-items: center; gap: 8px;">
          ${(0,te.localize)("editor.section_custom_views")}
          <a href="https://github.com/Cyberhunter88/dashboard-strategy/blob/main/assets/Custom-View-hinzufugen.gif"
            target="_blank" rel="noopener"
            style="color: var(--primary-color); text-decoration: none; font-size: 18px;"
            title=${(0,te.localize)("editor.video_tutorial")}>&#x1F3AC;</a>
        </div>

        <div id="custom-views-list">
          ${0===t.length?r.qy`<div class="empty-state">${(0,te.localize)("editor.no_custom_views")}</div>`:t.map((e,t)=>this._renderCustomViewItem(e,t))}
        </div>

        <button class="btn-primary" style="margin-top: 8px;" @click=${this._addCustomView}>
          ${(0,te.localize)("editor.add_custom_view")}
        </button>
        <div class="description">${(0,te.localize)("editor.custom_views_help")}</div>
      </div>
    `}_renderCheckbox(e,t,i,a,o=!1){return r.qy`
      <div class="form-row">
        <input type="checkbox" id=${e}
          ?checked=${i}
          ?disabled=${o}
          @change=${e=>a(e.target.checked)} />
        <label for=${e} class=${o?"disabled-label":""}>${t}</label>
      </div>
    `}_renderCustomViewItem(e,t){const i=e._yaml_error?r.qy`<span style="color: var(--error-color);">&#x274C; ${e._yaml_error}</span>`:e.yaml?r.qy`<span style="color: var(--success-color, green);">&#x2705; ${(0,te.localize)("editor.yaml_valid")}</span>`:r.s6;return r.qy`
      <div class="custom-item" data-index=${t}>
        <div class="custom-item-header">
          <strong>${e.title||(0,te.localize)("editor.new_view")}</strong>
          <button class="btn-remove" @click=${()=>this._removeCustomView(t)}>&#x2715;</button>
        </div>
        <div class="custom-item-fields">
          <div class="custom-item-row">
            <input type="text" .value=${e.title||""} placeholder=${(0,te.localize)("editor.title_placeholder")}
              style="flex: 2;"
              @change=${e=>this._updateCustomViewField(t,"title",e.target.value)} />
            <input type="text" .value=${e.path||""} placeholder=${(0,te.localize)("editor.path_placeholder")}
              style="flex: 2;"
              @change=${e=>this._updateCustomViewField(t,"path",e.target.value)} />
            <input type="text" .value=${e.icon||""} placeholder="mdi:star"
              style="flex: 1;"
              @change=${e=>this._updateCustomViewField(t,"icon",e.target.value)} />
          </div>
          <textarea rows="8" placeholder=${(0,te.localize)("editor.yaml_placeholder")}
            .value=${e.yaml||""}
            style="width: 100%;"
            @change=${e=>this._updateCustomViewYaml(t,e.target.value)}></textarea>
          <div class="custom-item-validation">
            ${i}
          </div>
        </div>
      </div>
    `}_renderCustomCardItem(e,t){const i=e._yaml_error?r.qy`<span style="color: var(--error-color);">&#x274C; ${e._yaml_error}</span>`:e.yaml?r.qy`<span style="color: var(--success-color, green);">&#x2705; ${(0,te.localize)("editor.yaml_valid")}</span>`:r.s6;return r.qy`
      <div class="custom-item" data-index=${t}>
        <div class="custom-item-header">
          <strong>${this._getCustomCardEditorLabel(e,(0,te.localize)("editor.new_card"))}</strong>
          <button class="btn-remove" @click=${()=>this._removeCustomCard(t)}>&#x2715;</button>
        </div>
        <div class="custom-item-fields">
          <label>${(0,te.localize)("editor.card_editor_title_label")}</label>
          <input type="text" .value=${e.editor_title||""} placeholder=${(0,te.localize)("editor.card_editor_title_placeholder")}
            @change=${e=>this._updateCustomCardField(t,"editor_title",e.target.value)} />
          <div class="description" style="margin: 0 0 4px 0;">${(0,te.localize)("editor.card_editor_title_help")}</div>
          <label>${(0,te.localize)("editor.card_dashboard_title_label")}</label>
          <input type="text" .value=${e.title||""} placeholder=${(0,te.localize)("editor.card_title_placeholder")}
            @change=${e=>this._updateCustomCardField(t,"title",e.target.value)} />
          <div class="custom-card-target">
            <label>${(0,te.localize)("editor.target_section")}:</label>
            <select
              @change=${e=>this._updateCustomCardField(t,"target_section",e.target.value)}>
              ${["custom_cards","overview","areas","weather","energy"].map(t=>r.qy`
                <option value=${t} ?selected=${(e.target_section||"custom_cards")===t}>
                  ${(0,te.localize)(ne._sectionMeta.get(t).labelKey)}
                </option>
              `)}
            </select>
          </div>
          <textarea rows="6" placeholder=${(0,te.localize)("editor.yaml_placeholder")}
            .value=${e.yaml||""}
            style="width: 100%;"
            @change=${e=>this._updateCustomCardYaml(t,e.target.value)}></textarea>
          <button class="btn-primary" style="margin-top: 6px;" @click=${()=>this._openCardEditorForCustomCard(t)}>
            ${(0,te.localize)("editor.edit_card_with_ha_editor")}
          </button>
          <div class="custom-item-validation">
            ${i}
          </div>
        </div>
      </div>
    `}_renderCustomSectionItem(e,t){const i=e.cards||[];return r.qy`
      <div class="custom-item" data-index=${t} style="margin-bottom: 12px;">
        <div class="custom-item-header">
          <strong>${e.title||`${(0,te.localize)("editor.section_custom_sections")} ${t+1}`}</strong>
          <button class="btn-remove" @click=${()=>this._removeCustomSection(t)}>&#x2715;</button>
        </div>
        <div class="custom-item-fields">
          <div class="custom-item-row">
            <input type="text" .value=${e.title||""} placeholder=${(0,te.localize)("editor.custom_section_title_placeholder")}
              style="flex: 2;"
              @change=${e=>this._updateCustomSectionField(t,"title",e.target.value)} />
            <input type="text" .value=${e.icon||""} placeholder=${(0,te.localize)("editor.custom_section_icon_placeholder")}
              style="flex: 1;"
              @change=${e=>this._updateCustomSectionField(t,"icon",e.target.value)} />
          </div>
          <div style="margin-top: 8px; padding-left: 8px; border-left: 2px solid var(--divider-color, #e0e0e0);">
            ${i.map((e,i)=>{const a=e._yaml_error?r.qy`<span style="color: var(--error-color);">&#x274C; ${e._yaml_error}</span>`:e.yaml?r.qy`<span style="color: var(--success-color, green);">&#x2705; ${(0,te.localize)("editor.yaml_valid")}</span>`:r.s6;return r.qy`
                <div class="custom-item" data-index=${i} style="margin-bottom: 8px;">
                  <div class="custom-item-header">
                    <strong>${this._getCustomCardEditorLabel(e,`${(0,te.localize)("editor.new_card")} ${i+1}`)}</strong>
                    <button class="btn-remove" @click=${()=>this._removeCardFromSection(t,i)}>&#x2715;</button>
                  </div>
                  <div class="custom-item-fields">
                    <label>${(0,te.localize)("editor.card_editor_title_label")}</label>
                    <input type="text" .value=${e.editor_title||""} placeholder=${(0,te.localize)("editor.card_editor_title_placeholder")}
                      @change=${e=>this._updateSectionCardField(t,i,"editor_title",e.target.value)} />
                    <div class="description" style="margin: 0 0 4px 0;">${(0,te.localize)("editor.card_editor_title_help")}</div>
                    <label>${(0,te.localize)("editor.card_dashboard_title_label")}</label>
                    <input type="text" .value=${e.title||""} placeholder=${(0,te.localize)("editor.card_title_placeholder")}
                      @change=${e=>this._updateSectionCardField(t,i,"title",e.target.value)} />
                    <textarea rows="5" placeholder=${(0,te.localize)("editor.yaml_placeholder")}
                      .value=${e.yaml||""}
                      style="width: 100%;"
                      @change=${e=>this._updateSectionCardYaml(t,i,e.target.value)}></textarea>
                    <button class="btn-primary" style="margin-top: 6px;"
                      @click=${()=>this._openCardEditorForSectionCard(t,i)}>
                      ${(0,te.localize)("editor.edit_card_with_ha_editor")}
                    </button>
                    <div class="custom-item-validation">${a}</div>
                  </div>
                </div>
              `})}
            <button class="btn-primary" style="margin-top: 4px;" @click=${()=>this._openCardPickerForSection(t)}>
              ${(0,te.localize)("editor.add_card_to_section")}
            </button>
          </div>
        </div>
      </div>
    `}_renderCustomBadgeItem(e,t){const i=e._yaml_error?r.qy`<span style="color: var(--error-color);">&#x274C; ${e._yaml_error}</span>`:e.yaml?r.qy`<span style="color: var(--success-color, green);">&#x2705; ${(0,te.localize)("editor.yaml_valid")}</span>`:r.s6;return r.qy`
      <div class="custom-item" data-index=${t}>
        <div class="custom-item-header">
          <strong>Badge ${t+1}</strong>
          <button class="btn-remove" @click=${()=>this._removeCustomBadge(t)}>&#x2715;</button>
        </div>
        <textarea rows="4" placeholder="type: entity&#10;entity: sun.sun"
          .value=${e.yaml||""}
          style="width: 100%;"
          @change=${e=>this._updateCustomBadgeYaml(t,e.target.value)}></textarea>
        <div class="custom-item-validation">
          ${i}
        </div>
      </div>
    `}_renderAreaItems(e,t,i,a){if(0===e.length)return r.qy`<div class="empty-state">${(0,te.localize)("editor.no_areas")}</div>`;const o=new Map(i.map((e,t)=>[e,t])),s=new Map(e.map((e,t)=>[e.area_id,t]));return[...e].sort((e,t)=>{const i=o.get(e.area_id),r=o.get(t.area_id);return(void 0!==i?i:9999+(s.get(e.area_id)??0))-(void 0!==r?r:9999+(s.get(t.area_id)??0))}).map(e=>{const i=t.includes(e.area_id),o=this._expandedAreas.has(e.area_id),s=this._areaEntitiesCache.get(e.area_id),n=a.includes(e.area_id);return r.qy`
        <div class="area-item"
          data-area-id=${e.area_id}
          draggable="true"
          @dragstart=${this._handleDragStart}
          @dragend=${this._handleDragEnd}
          @dragover=${this._handleDragOver}
          @dragleave=${this._handleDragLeave}
          @drop=${this._handleDrop}>
          <div class="area-header">
            <span class="drag-handle" draggable="true">&#x2630;</span>
            <input type="checkbox" class="area-checkbox"
              data-area-id=${e.area_id}
              ?checked=${!i}
              @change=${t=>this._areaVisibilityChanged(e.area_id,t.target.checked)} />
            <span class="area-name">${e.name}</span>
            ${e.icon?r.qy`<ha-icon class="area-icon" icon=${e.icon}></ha-icon>`:r.s6}
            <button class="nav-pin-button ${n?"pinned":""}"
              title="${(0,te.localize)("editor.area_pin_nav")}"
              ?disabled=${i}
              @click=${t=>{t.stopPropagation(),this._areaNavPinChanged(e.area_id,!n)}}>
              <ha-icon icon="${n?"mdi:pin":"mdi:pin-outline"}"></ha-icon>
            </button>
            <button class="expand-button ${o?"expanded":""}"
              data-area-id=${e.area_id}
              ?disabled=${i}
              @click=${t=>this._toggleAreaExpand(t,e.area_id)}>
              <span class="expand-icon">&#x25B6;</span>
            </button>
          </div>
          ${o?r.qy`
              <div class="area-content" data-area-id=${e.area_id}>
                ${s?this._renderAreaEntities(e.area_id,s):r.qy`<div class="loading-placeholder">${(0,te.localize)("editor.loading_entities")}</div>`}
              </div>
            `:r.s6}
        </div>
      `})}_renderAreaCameraOptions(e){const t=this._config.areas_options?.[e]||{},i=t.camera_renderer??this._config.camera_renderer??"native",a=t.camera_stream_mode??this._config.camera_stream_mode??"on_demand",o=this._getAreaCameraWebrtcStreamsYaml(e,t),s=t.camera_webrtc_preload??this._config.camera_webrtc_preload??"off",n=t.camera_webrtc_preload_margin??this._config.camera_webrtc_preload_margin??800,c=this._getAreaCameraWebrtcDefaultsYaml(e,t),l=t.camera_columns,d="number"==typeof l&&l>=1&&l<=4?String(l):"",p=this._areaCameraWebrtcStreamsError.get(e),h=this._areaCameraWebrtcDefaultsError.get(e);return r.qy`
      <div class="entity-group" data-group="camera_options">
        <div class="entity-group-header">
          <ha-icon icon="mdi:cctv"></ha-icon>
          <span class="group-name">${(0,te.localize)("editor.area_camera_options")}</span>
        </div>
        <div class="entity-list">
          <label for=${`camera-renderer-${e}`}>${(0,te.localize)("editor.camera_renderer")}</label>
          <select id=${`camera-renderer-${e}`} .value=${i}
            @change=${t=>this._areaCameraRendererChanged(e,t)}>
            <option value="native">${(0,te.localize)("editor.camera_renderer_native")}</option>
            <option value="webrtc">${(0,te.localize)("editor.camera_renderer_webrtc")}</option>
          </select>
          <div class="description" style="margin-left: 0;">${(0,te.localize)("editor.area_camera_options_desc")}</div>

          <label for=${`camera-columns-${e}`}>${(0,te.localize)("editor.camera_columns")}</label>
          <select id=${`camera-columns-${e}`} .value=${d}
            @change=${t=>this._areaCameraColumnsChanged(e,t)}>
            <option value="">${(0,te.localize)("editor.camera_columns_auto")}</option>
            <option value="1">${(0,te.localize)("editor.camera_columns_1")}</option>
            <option value="2">${(0,te.localize)("editor.camera_columns_2")}</option>
            <option value="3">${(0,te.localize)("editor.camera_columns_3")}</option>
            <option value="4">${(0,te.localize)("editor.camera_columns_4")}</option>
          </select>
          <div class="description" style="margin-left: 0;">${(0,te.localize)("editor.camera_columns_desc")}</div>

          ${"native"===i?r.qy`
                <label for=${`camera-stream-mode-${e}`}>${(0,te.localize)("editor.camera_stream_mode")}</label>
                <select id=${`camera-stream-mode-${e}`} .value=${a}
                  @change=${t=>this._areaCameraStreamModeChanged(e,t)}>
                  <option value="snapshot">${(0,te.localize)("editor.camera_stream_snapshot")}</option>
                  <option value="on_demand">${(0,te.localize)("editor.camera_stream_on_demand")}</option>
                  <option value="live">${(0,te.localize)("editor.camera_stream_live")}</option>
                </select>
                <div class="description" style="margin-left: 0;">${(0,te.localize)("editor.camera_stream_mode_desc")}</div>
              `:r.qy`
                <label for=${`camera-webrtc-streams-${e}`}>${(0,te.localize)("editor.camera_webrtc_streams")}</label>
                <textarea
                  id=${`camera-webrtc-streams-${e}`}
                  style="width: 100%; min-height: 110px;"
                  placeholder=${(0,te.localize)("editor.camera_webrtc_streams_placeholder")}
                  .value=${o}
                  @input=${t=>this._areaCameraWebrtcStreamsChanged(e,t)}
                ></textarea>
                ${p?r.qy`<div style="color: var(--error-color); font-size: 12px; margin-top: 4px;">${p}</div>`:r.s6}
                <div class="description" style="margin-left: 0;">${(0,te.localize)("editor.camera_webrtc_streams_desc")}</div>

                <label for=${`camera-webrtc-preload-${e}`}>${(0,te.localize)("editor.camera_webrtc_preload")}</label>
                <select id=${`camera-webrtc-preload-${e}`} .value=${s}
                  @change=${t=>this._areaCameraWebrtcPreloadChanged(e,t)}>
                  <option value="off">${(0,te.localize)("editor.camera_webrtc_preload_off")}</option>
                  <option value="near_viewport">${(0,te.localize)("editor.camera_webrtc_preload_near_viewport")}</option>
                  <option value="always">${(0,te.localize)("editor.camera_webrtc_preload_always")}</option>
                </select>
                <div class="description" style="margin-left: 0;">${(0,te.localize)("editor.camera_webrtc_preload_desc")}</div>

                ${"near_viewport"===s?r.qy`
                      <label for=${`camera-webrtc-preload-margin-${e}`}>${(0,te.localize)("editor.camera_webrtc_preload_margin")}</label>
                      <input
                        id=${`camera-webrtc-preload-margin-${e}`}
                        type="number"
                        min="0"
                        step="100"
                        .value=${String(n)}
                        @change=${t=>this._areaCameraWebrtcPreloadMarginChanged(e,t)}
                      />
                      <div class="description" style="margin-left: 0;">${(0,te.localize)("editor.camera_webrtc_preload_margin_desc")}</div>
                    `:r.s6}

                <label for=${`camera-webrtc-defaults-${e}`}>${(0,te.localize)("editor.camera_webrtc_defaults")}</label>
                <textarea
                  id=${`camera-webrtc-defaults-${e}`}
                  style="width: 100%; min-height: 120px;"
                  placeholder=${(0,te.localize)("editor.camera_webrtc_defaults_placeholder")}
                  .value=${c}
                  @input=${t=>this._areaCameraWebrtcDefaultsChanged(e,t)}
                ></textarea>
                ${h?r.qy`<div style="color: var(--error-color); font-size: 12px; margin-top: 4px;">${h}</div>`:r.s6}
                <div class="description" style="margin-left: 0;">${(0,te.localize)("editor.camera_webrtc_defaults_desc")}</div>
              `}
        </div>
      </div>
    `}_renderAreaEntities(e,t){const{groupedEntities:i,hiddenEntities:a,badgeCandidates:o,additionalBadges:s,availableEntities:n,defaultShowNames:c,namesVisible:l,namesHidden:d}=t,p=this._hass,h=[{key:"ups",label:(0,te.localize)("stacks.ups"),icon:"mdi:power-plug-battery"},{key:"lights",label:(0,te.localize)("editor.domain_lights"),icon:"mdi:lightbulb"},{key:"climate",label:(0,te.localize)("editor.domain_climate"),icon:"mdi:thermostat"},{key:"covers",label:(0,te.localize)("editor.domain_covers"),icon:"mdi:window-shutter"},{key:"covers_curtain",label:(0,te.localize)("editor.domain_covers_curtain"),icon:"mdi:curtains"},{key:"covers_window",label:(0,te.localize)("editor.domain_covers_window"),icon:"mdi:window-open-variant"},{key:"media_player",label:(0,te.localize)("editor.domain_media_player"),icon:"mdi:speaker"},{key:"scenes",label:(0,te.localize)("editor.domain_scenes"),icon:"mdi:palette"},{key:"vacuum",label:(0,te.localize)("editor.domain_vacuum"),icon:"mdi:robot-vacuum"},{key:"fan",label:(0,te.localize)("editor.domain_fan"),icon:"mdi:fan"},{key:"switches",label:(0,te.localize)("editor.domain_switches"),icon:"mdi:light-switch"},{key:"locks",label:(0,te.localize)("editor.domain_locks"),icon:"mdi:lock"},{key:"energy",label:(0,te.localize)("stacks.energy"),icon:"mdi:lightning-bolt"}],_=h.some(e=>(i[e.key]?.length??0)>0),u=(o?.length??0)>0||(s?.length??0)>0,m=[],g=new Set,f=e=>{if(!e||g.has(e))return;g.add(e);const t=p.states[e],i=t?.attributes.friendly_name||e.split(".")[1]?.replace(/_/g," ")||e;m.push({entity_id:e,name:i})};for(const e of h)for(const t of i[e.key]||[])f(t);for(const e of o||[])f(e);for(const e of s||[])f(e);for(const e of n||[])f(e.entity_id);m.sort((e,t)=>e.name.localeCompare(t.name));const y=this._renderAreaCustomCardsSection(e,m);if(!_&&!u)return r.qy`
        <div class="empty-state">${(0,te.localize)("editor.no_entities_in_area")}</div>
        ${this._renderAreaCameraOptions(e)}
        ${this._renderStackOrderPanel(e,t)}
        ${y}
      `;const v=this._expandedGroups.get(e)||new Set;return r.qy`
      <div class="entity-groups">
        ${this._renderAreaCameraOptions(e)}
        ${h.map(t=>{const o=i[t.key];if(!o||0===o.length)return r.s6;const s=a[t.key]||[],n=o.every(e=>s.includes(e)),c=o.some(e=>s.includes(e))&&!n,l=v.has(t.key);return r.qy`
            <div class="entity-group" data-group=${t.key}>
              <div class="entity-group-header"
                @click=${()=>this._toggleGroupExpand(e,t.key)}>
                <input type="checkbox" class="group-checkbox"
                  data-area-id=${e}
                  data-group=${t.key}
                  ?checked=${!n}
                  .indeterminate=${c}
                  @click=${e=>e.stopPropagation()}
                  @change=${i=>{i.stopPropagation();const r=i.target.checked;this._groupVisibilityChanged(e,t.key,r,o)}} />
                <ha-icon icon=${t.icon}></ha-icon>
                <span class="group-name">${t.label}</span>
                <span class="entity-count">(${o.length})</span>
                <button class="expand-button-small ${l?"expanded":""}"
                  @click=${i=>{i.stopPropagation(),this._toggleGroupExpand(e,t.key)}}>
                  <span class="expand-icon-small">&#x25B6;</span>
                </button>
              </div>
              ${l?r.qy`
                  <div class="entity-list" data-area-id=${e} data-group=${t.key}>
                    ${o.map(i=>{const a=p.states[i],o=a?.attributes.friendly_name||i.split(".")[1].replace(/_/g," "),n=s.includes(i);return r.qy`
                        <div class="entity-item">
                          <input type="checkbox" class="entity-checkbox"
                            ?checked=${!n}
                            @change=${r=>this._entityVisibilityChanged(e,t.key,i,r.target.checked)} />
                          <span class="entity-name">${o}</span>
                          <span class="entity-id">${i}</span>
                        </div>
                      `})}
                  </div>
                `:r.s6}
            </div>
          `})}
        ${u?this._renderBadgeGroup(e,o,s,n,a,c,l,d,v):r.s6}
        ${this._renderStackOrderPanel(e,t)}
      </div>
      ${y}
    `}_renderAreaCustomCardItem(e,t,i,a){const o=t.mode||"yaml",s=t.position||"bottom",n=t._yaml_error?r.qy`<span style="color: var(--error-color);">&#x274C; ${t._yaml_error}</span>`:t.yaml?r.qy`<span style="color: var(--success-color, green);">&#x2705; ${(0,te.localize)("editor.yaml_valid")}</span>`:r.s6;return r.qy`
      <div class="custom-item" data-index=${i}>
        <div class="custom-item-header">
          <strong>${this._getCustomCardEditorLabel(t,(0,te.localize)("editor.area_custom_card_new"))}</strong>
          <button class="btn-remove" @click=${()=>this._removeAreaCustomCard(e,i)}>&#x2715;</button>
        </div>
        <div class="custom-item-fields">
          <label>${(0,te.localize)("editor.card_editor_title_label")}</label>
          <input type="text" .value=${t.editor_title||""} placeholder=${(0,te.localize)("editor.card_editor_title_placeholder")}
            @change=${t=>this._updateAreaCustomCardField(e,i,"editor_title",t.target.value)} />
          <div class="description" style="margin: 0 0 4px 0;">${(0,te.localize)("editor.card_editor_title_help")}</div>
          <label>${(0,te.localize)("editor.card_dashboard_title_label")}</label>
          <input type="text" .value=${t.title||""} placeholder=${(0,te.localize)("editor.card_title_placeholder")}
            @change=${t=>this._updateAreaCustomCardField(e,i,"title",t.target.value)} />
          <div class="custom-card-target">
            <label>${(0,te.localize)("editor.area_custom_card_position")}:</label>
            <select
              @change=${t=>this._updateAreaCustomCardField(e,i,"position",t.target.value)}>
              <option value="top" ?selected=${"top"===s}>${(0,te.localize)("editor.area_custom_card_position_top")}</option>
              <option value="bottom" ?selected=${"bottom"===s}>${(0,te.localize)("editor.area_custom_card_position_bottom")}</option>
            </select>
          </div>
          <div class="custom-card-target">
            <label>${(0,te.localize)("editor.area_custom_card_mode")}:</label>
            <select
              @change=${t=>this._updateAreaCustomCardField(e,i,"mode",t.target.value)}>
              <option value="yaml" ?selected=${"yaml"===o}>${(0,te.localize)("editor.area_custom_card_mode_yaml")}</option>
              <option value="tile" ?selected=${"tile"===o}>${(0,te.localize)("editor.area_custom_card_mode_tile")}</option>
              <option value="webrtc" ?selected=${"webrtc"===o}>${(0,te.localize)("editor.area_custom_card_mode_webrtc")}</option>
              <option value="section" ?selected=${"section"===o}>${(0,te.localize)("editor.area_custom_card_mode_section")}</option>
            </select>
          </div>
          ${"tile"===o?r.qy`
              <div class="custom-card-target">
                <label>${(0,te.localize)("editor.area_custom_card_entity")}:</label>
                <select
                  @change=${t=>this._updateAreaCustomCardField(e,i,"entity",t.target.value)}>
                  <option value="">${(0,te.localize)("editor.area_custom_card_entity_select")}</option>
                  ${a.map(e=>r.qy`
                    <option value=${e.entity_id} ?selected=${t.entity===e.entity_id}>${e.name} (${e.entity_id})</option>
                  `)}
                </select>
              </div>
            `:"webrtc"===o?r.qy`
                <div class="custom-card-target">
                  <label>${(0,te.localize)("editor.area_custom_card_webrtc_url")}:</label>
                  <input type="text"
                    .value=${t.webrtc_url||""}
                    placeholder=${(0,te.localize)("editor.area_custom_card_webrtc_url_placeholder")}
                    @change=${t=>this._updateAreaCustomCardField(e,i,"webrtc_url",t.target.value)} />
                </div>
                <div class="description" style="margin-left: 0;">
                  ${(0,te.localize)("editor.area_custom_card_webrtc_url_desc")}
                </div>
              `:r.qy`
              <textarea rows="6" placeholder=${(0,te.localize)("editor.yaml_placeholder")}
                .value=${t.yaml||""}
                style="width: 100%;"
                @change=${t=>this._updateAreaCustomCardYaml(e,i,t.target.value)}></textarea>
              <button class="btn-primary" style="margin-top: 6px;"
                @click=${()=>this._openCardEditorForAreaCustomCard(e,i)}>
                ${(0,te.localize)("editor.edit_card_with_ha_editor")}
              </button>
              <div class="custom-item-validation">
                ${n}
              </div>
            `}
        </div>
      </div>
    `}_renderAreaCustomCardsSection(e,t){const i=this._getAreaCustomCards(e);return r.qy`
      <div class="area-custom-cards">
        <div class="area-custom-cards-header">
          <ha-icon icon="mdi:card-plus-outline"></ha-icon>
          <span class="group-name">${(0,te.localize)("editor.area_custom_cards_title")}</span>
        </div>
        <div class="area-custom-cards-help">${(0,te.localize)("editor.area_custom_cards_help")}</div>
        ${0===i.length?r.s6:i.map((i,r)=>this._renderAreaCustomCardItem(e,i,r,t))}
        <div class="area-custom-card-actions">
          <button class="btn-primary" @click=${()=>this._addAreaCustomCard(e)}>
            ${(0,te.localize)("editor.area_custom_card_add_yaml")}
          </button>
          <button class="btn-primary" @click=${()=>this._addAreaWebrtcCard(e)}>
            ${(0,te.localize)("editor.area_custom_card_add_webrtc")}
          </button>
          <button class="btn-primary" @click=${()=>this._openCardPickerForAreaCustomCard(e)}>
            ${(0,te.localize)("editor.area_custom_card_add_picker")}
          </button>
        </div>
      </div>
    `}_renderBadgeGroup(e,t,i,a,o,s,n,c,l){const d=this._hass,p=t.length+i.length;if(0===p)return r.qy``;const h=o.badges||[],_=t.length>0&&t.every(e=>h.includes(e)),u=t.some(e=>h.includes(e))&&!_,m=new Set(n||[]),g=new Set(c||[]),f=e=>(0,ie.LN)(e,s.has(e),m,g),y=l.has("badges");return r.qy`
      <div class="entity-group" data-group="badges">
        <div class="entity-group-header"
          @click=${()=>this._toggleGroupExpand(e,"badges")}>
          <input type="checkbox" class="group-checkbox"
            data-area-id=${e}
            data-group="badges"
            ?checked=${!_}
            .indeterminate=${u}
            @click=${e=>e.stopPropagation()}
            @change=${i=>{i.stopPropagation();const r=i.target.checked;this._groupVisibilityChanged(e,"badges",r,t)}} />
          <ha-icon icon="mdi:checkbox-multiple-blank-circle"></ha-icon>
          <span class="group-name">${(0,te.localize)("editor.domain_badges")}</span>
          <span class="entity-count">(${p})</span>
          <button class="expand-button-small ${y?"expanded":""}"
            @click=${t=>{t.stopPropagation(),this._toggleGroupExpand(e,"badges")}}>
            <span class="expand-icon-small">&#x25B6;</span>
          </button>
        </div>
        ${y?r.qy`
            <div class="entity-list" data-area-id=${e} data-group="badges">
              ${t.map(t=>{const i=d.states[t],a=i?.attributes.friendly_name||t.split(".")[1].replace(/_/g," "),o=h.includes(t),s=f(t);return r.qy`
                  <div class="entity-item">
                    <input type="checkbox" class="entity-checkbox"
                      ?checked=${!o}
                      @change=${i=>this._entityVisibilityChanged(e,"badges",t,i.target.checked)} />
                    <span class="entity-name">${a}</span>
                    <input type="checkbox" class="badge-name-checkbox"
                      ?checked=${s}
                      title=${(0,te.localize)("editor.badges_show_name")}
                      @change=${i=>this._badgeShowNameChanged(e,t,i.target.checked)} />
                    <span class="badge-name-label">${(0,te.localize)("editor.badges_name_short")}</span>
                    <span class="entity-id">${t}</span>
                  </div>
                `})}

              ${i.length>0?r.qy`
                  <div class="badge-separator">${(0,te.localize)("editor.badges_additional")}</div>
                  ${i.map(t=>{const i=d.states[t],a=i?.attributes.friendly_name||t.split(".")[1].replace(/_/g," "),o=f(t);return r.qy`
                      <div class="entity-item badge-additional-item">
                        <span class="entity-name">${a}</span>
                        <input type="checkbox" class="badge-name-checkbox"
                          ?checked=${o}
                          title=${(0,te.localize)("editor.badges_show_name")}
                          @change=${i=>this._badgeShowNameChanged(e,t,i.target.checked)} />
                        <span class="badge-name-label">${(0,te.localize)("editor.badges_name_short")}</span>
                        <span class="entity-id">${t}</span>
                        <button class="badge-remove-btn"
                          title=${(0,te.localize)("editor.badges_remove")}
                          @click=${()=>this._badgeAdditionalChanged(e,t,!1)}>&#x2715;</button>
                      </div>
                    `})}
                `:r.s6}

              ${a.length>0?r.qy`
                  <div class="badge-add-section">
                    <select class="badge-entity-picker" data-area-id=${e}>
                      <option value="">${(0,te.localize)("editor.badges_select_entity")}</option>
                      ${a.map(e=>r.qy`
                        <option value=${e.entity_id}>${e.name} (${e.entity_id})</option>
                      `)}
                    </select>
                    <button class="badge-add-button"
                      @click=${t=>this._addBadgeFromPicker(t,e)}>
                      ${(0,te.localize)("editor.badges_add")}
                    </button>
                  </div>
                `:r.s6}
            </div>
          `:r.s6}
      </div>
    `}async _loadAreaEntities(e){if(!this._hass)return;const t=await async function(e,t){const i=Object.values(t.devices||{}),r=Object.values(t.entities||{}),a=new Set;for(const t of i)t.area_id===e&&a.add(t.id);const o={lights:[],covers:[],covers_curtain:[],covers_window:[],scenes:[],climate:[],media_player:[],vacuum:[],fan:[],switches:[],locks:[],automations:[],scripts:[],cameras:[],ups:[],energy:[]},s=r.filter(e=>e.labels?.includes("no_dboard")).map(e=>e.entity_id),n=new Map;for(const e of r){if(!e.device_id)continue;const t=n.get(e.device_id);t?t.push(e):n.set(e.device_id,[e])}const c=new Set(["duration","apparent_power","power","voltage"]),l=/load|runtime|time_left|input_voltage|status/,d=new Set;for(const i of n.values()){const r=i.filter(i=>{let r=!1;return i.area_id?r=i.area_id===e:i.device_id&&a.has(i.device_id)&&(r=!0),r&&!s.includes(i.entity_id)&&!!t.states[i.entity_id]&&!(0,ee.z)(i)});if(0===r.length)continue;let n,p=!1,h=!1;for(const e of r){"nut"===e.platform&&(h=!0);const i=t.states[e.entity_id];if(!i)continue;const r=i.attributes?.device_class,a=i.attributes?.unit_of_measurement;n||!e.entity_id.startsWith("sensor.")||"battery"!==r||"%"!==a?(r&&c.has(r)||l.test(e.entity_id))&&(p=!0):n=e.entity_id}if(!n)continue;if(!h&&!p)continue;const _=r.map(e=>e.entity_id);o.ups.push(..._);for(const e of _)d.add(e)}for(const i of r){let r=!1;if(i.area_id?r=i.area_id===e:i.device_id&&a.has(i.device_id)&&(r=!0),!r)continue;if(d.has(i.entity_id))continue;if(s.includes(i.entity_id))continue;if(!t.states[i.entity_id])continue;if((0,ee.z)(i))continue;const n=t.entities?.[i.entity_id];if((0,ee.z)(n))continue;const c=i.entity_id.split(".")[0],l=t.states[i.entity_id],p=l.attributes?.device_class;"light"===c?o.lights.push(i.entity_id):"cover"===c?"curtain"===p?o.covers_curtain.push(i.entity_id):"window"===p||"door"===p||"gate"===p||"garage"===p?o.covers_window.push(i.entity_id):o.covers.push(i.entity_id):"scene"===c?o.scenes.push(i.entity_id):"climate"===c?o.climate.push(i.entity_id):"media_player"===c?o.media_player.push(i.entity_id):"vacuum"===c?o.vacuum.push(i.entity_id):"fan"===c?o.fan.push(i.entity_id):"switch"===c?o.switches.push(i.entity_id):"lock"===c?o.locks.push(i.entity_id):"automation"===c?o.automations.push(i.entity_id):"script"===c?o.scripts.push(i.entity_id):"sensor"===c&&["power","energy","water","gas"].includes(p)&&o.energy.push(i.entity_id)}return o}(e,this._hass),i=_e(e,this._config),r=ue(e,this._config),a=ce(e,this._hass),o=le(e,this._config),s=de(e,this._hass,a,o),n=pe(a,this._hass),{namesVisible:c,namesHidden:l}=he(e,this._config);this._areaEntitiesCache.set(e,{groupedEntities:t,hiddenEntities:i,entityOrders:r,badgeCandidates:a,additionalBadges:o,availableEntities:s,defaultShowNames:n,namesVisible:c,namesHidden:l}),this.requestUpdate()}_refreshAreaCache(e){if(!this._hass||!this._areaEntitiesCache.has(e))return;const t=this._areaEntitiesCache.get(e).groupedEntities,i=_e(e,this._config),r=ue(e,this._config),a=ce(e,this._hass),o=le(e,this._config),s=de(e,this._hass,a,o),n=pe(a,this._hass),{namesVisible:c,namesHidden:l}=he(e,this._config);this._areaEntitiesCache.set(e,{groupedEntities:t,hiddenEntities:i,entityOrders:r,badgeCandidates:a,additionalBadges:o,availableEntities:s,defaultShowNames:n,namesVisible:c,namesHidden:l})}_toggleChanged(e,t,i){if(!this._hass)return;const r={...this._config,[e]:t};t===i&&delete r[e],this._config=r,this._fireConfigChanged(r)}_summariesColumnsChanged(e){if(!this._hass)return;const t={...this._config,summaries_columns:e};2===e&&delete t.summaries_columns,this._config=t,this._fireConfigChanged(t)}_alarmEntityChanged(e){if(!this._hass)return;const t=e.target.value,i={...this._config,alarm_entity:t};t&&""!==t||delete i.alarm_entity,this._config=i,this._fireConfigChanged(i)}_weatherEntityChanged(e){if(!this._hass)return;const t=e.target.value,i={...this._config,weather_entity:t};t&&""!==t||delete i.weather_entity,this._config=i,this._fireConfigChanged(i)}_areaCameraRendererChanged(e,t){const i=t.target.value;this._updateAreaCameraOption(e,e=>{"native"!==i||this._config.camera_renderer?e.camera_renderer=i:delete e.camera_renderer}),this._areaCameraWebrtcStreamsError.delete(e),this._areaCameraWebrtcDefaultsError.delete(e)}_areaCameraStreamModeChanged(e,t){const i=t.target.value;this._updateAreaCameraOption(e,e=>{"on_demand"!==i||this._config.camera_stream_mode?e.camera_stream_mode=i:delete e.camera_stream_mode})}_areaCameraColumnsChanged(e,t){const i=t.target.value,r=parseInt(i,10);this._updateAreaCameraOption(e,e=>{!i||isNaN(r)||r<1||r>4?delete e.camera_columns:e.camera_columns=r})}_areaCameraWebrtcPreloadChanged(e,t){const i=t.target.value;this._updateAreaCameraOption(e,e=>{"off"!==i||this._config.camera_webrtc_preload?(e.camera_webrtc_preload=i,"near_viewport"===i&&"number"!=typeof e.camera_webrtc_preload_margin&&(e.camera_webrtc_preload_margin=800),"always"===i&&delete e.camera_webrtc_preload_margin):(delete e.camera_webrtc_preload,delete e.camera_webrtc_preload_margin)})}_areaCameraWebrtcPreloadMarginChanged(e,t){const i=parseInt(t.target.value,10);isNaN(i)||i<0||this._updateAreaCameraOption(e,e=>{800!==i||this._config.camera_webrtc_preload_margin?e.camera_webrtc_preload_margin=i:delete e.camera_webrtc_preload_margin})}_getAreaCameraWebrtcStreamsYaml(e,t){const i=this._areaCameraWebrtcStreamsYaml.get(e);if(void 0!==i)return i;const r=t.camera_webrtc_streams??this._config.camera_webrtc_streams;return r&&0!==Object.keys(r).length?Q.dump(r).trim():""}_getAreaCameraWebrtcDefaultsYaml(e,t){const i=this._areaCameraWebrtcDefaultsYaml.get(e);if(void 0!==i)return i;const r=t.camera_webrtc_defaults??this._config.camera_webrtc_defaults;return r&&0!==Object.keys(r).length?Q.dump(r).trim():""}_areaCameraWebrtcStreamsChanged(e,t){const i=t.target.value;this._areaCameraWebrtcStreamsYaml.set(e,i);const r=i.trim();if(!r)return this._areaCameraWebrtcStreamsError.delete(e),void this._updateAreaCameraOption(e,e=>{delete e.camera_webrtc_streams});try{const t=Q.load(r);if(!t||"object"!=typeof t||Array.isArray(t))return this._areaCameraWebrtcStreamsError.set(e,(0,te.localize)("editor.camera_webrtc_streams_invalid")),void this.requestUpdate();const i=t;if(!Object.entries(i).every(([e,t])=>!!e.trim()&&("string"==typeof t||!!t&&"object"==typeof t&&!Array.isArray(t))))return this._areaCameraWebrtcStreamsError.set(e,(0,te.localize)("editor.camera_webrtc_streams_invalid")),void this.requestUpdate();this._areaCameraWebrtcStreamsError.delete(e),this._updateAreaCameraOption(e,e=>{e.camera_webrtc_streams=i})}catch(t){this._areaCameraWebrtcStreamsError.set(e,ae(t)),this.requestUpdate()}}_areaCameraWebrtcDefaultsChanged(e,t){const i=t.target.value;this._areaCameraWebrtcDefaultsYaml.set(e,i);const r=i.trim();if(!r)return this._areaCameraWebrtcDefaultsError.delete(e),void this._updateAreaCameraOption(e,e=>{delete e.camera_webrtc_defaults});try{const t=Q.load(r);if(!t||"object"!=typeof t||Array.isArray(t))return this._areaCameraWebrtcDefaultsError.set(e,(0,te.localize)("editor.camera_webrtc_defaults_invalid")),void this.requestUpdate();this._areaCameraWebrtcDefaultsError.delete(e),this._updateAreaCameraOption(e,e=>{e.camera_webrtc_defaults=t})}catch(t){this._areaCameraWebrtcDefaultsError.set(e,ae(t)),this.requestUpdate()}}_getCameraWebrtcStreamsYaml(){if(null!==this._cameraWebrtcStreamsYaml)return this._cameraWebrtcStreamsYaml;const e=this._config.camera_webrtc_streams;return e&&0!==Object.keys(e).length?Q.dump(e).trim():""}_getCameraWebrtcDefaultsYaml(){if(null!==this._cameraWebrtcDefaultsYaml)return this._cameraWebrtcDefaultsYaml;const e=this._config.camera_webrtc_defaults;return e&&0!==Object.keys(e).length?Q.dump(e).trim():""}_batteryCriticalChanged(e){const t=parseInt(e.target.value,10);if(isNaN(t)||t<1||t>99)return;const i={...this._config,battery_critical_threshold:t};20===t&&delete i.battery_critical_threshold,this._config=i,this._fireConfigChanged(i)}_batteryLowChanged(e){const t=parseInt(e.target.value,10);if(isNaN(t)||t<1||t>99)return;const i={...this._config,battery_low_threshold:t};50===t&&delete i.battery_low_threshold,this._config=i,this._fireConfigChanged(i)}_addFavoriteEntity(e){if(!this._hass)return;const t=this._config.favorite_entities||[];if(t.includes(e))return;const i={...this._config,favorite_entities:[...t,e]};this._config=i,this._fireConfigChanged(i)}_removeFavoriteEntity(e){if(!this._hass)return;const t=(this._config.favorite_entities||[]).filter(t=>t!==e),i={...this._config,favorite_entities:t.length>0?t:void 0};0===t.length&&delete i.favorite_entities,this._config=i,this._fireConfigChanged(i)}_addRoomPinEntity(e){if(!this._hass)return;const t=this._config.room_pin_entities||[];if(t.includes(e))return;const i={...this._config,room_pin_entities:[...t,e]};this._config=i,this._fireConfigChanged(i)}_removeRoomPinEntity(e){if(!this._hass)return;const t=(this._config.room_pin_entities||[]).filter(t=>t!==e),i={...this._config,room_pin_entities:t.length>0?t:void 0};0===t.length&&delete i.room_pin_entities,this._config=i,this._fireConfigChanged(i)}_addCustomView(){const e=[...this._config.custom_views||[]];e.push({title:(0,te.localize)("editor.new_view"),path:`custom-view-${e.length+1}`,icon:"mdi:card-text-outline",yaml:"",parsed_config:void 0});const t={...this._config,custom_views:e};this._config=t,this._fireConfigChanged(t)}_removeCustomView(e){const t=[...this._config.custom_views||[]];t.splice(e,1);const i={...this._config};0===t.length?delete i.custom_views:i.custom_views=t,this._config=i,this._fireConfigChanged(i)}_updateCustomViewField(e,t,i){const r=[...this._config.custom_views||[]];if(!r[e])return;r[e]={...r[e],[t]:i};const a={...this._config,custom_views:r};this._config=a,this._fireConfigChanged(a)}_updateCustomViewYaml(e,t){const i=[...this._config.custom_views||[]];if(!i[e])return;const r={...i[e],yaml:t};delete r._yaml_error;const a=oe(t,"YAML muss ein Objekt ergeben");r.parsed_config=a.parsed_config,r._yaml_error=a._yaml_error,i[e]=r;const o={...this._config,custom_views:i};this._config=o,this._fireConfigChanged(o)}_customCardsHeadingChanged(e){const t=e.target.value.trim(),i={...this._config};t?i.custom_cards_heading=t:delete i.custom_cards_heading,this._config=i,this._fireConfigChanged(i)}_customCardsIconChanged(e){const t=e.target.value.trim(),i={...this._config};t?i.custom_cards_icon=t:delete i.custom_cards_icon,this._config=i,this._fireConfigChanged(i)}_removeCustomCard(e){const t=[...this._config.custom_cards||[]];t.splice(e,1);const i={...this._config};0===t.length?delete i.custom_cards:i.custom_cards=t,this._config=i,this._fireConfigChanged(i)}_updateCustomCardField(e,t,i){const r=[...this._config.custom_cards||[]];if(!r[e])return;r[e]={...r[e],[t]:i};const a={...this._config,custom_cards:r};this._config=a,this._fireConfigChanged(a)}_updateCustomCardYaml(e,t){const i=[...this._config.custom_cards||[]];if(!i[e])return;const r={...i[e],yaml:t};delete r._yaml_error;const a=oe(t,"YAML muss ein Objekt oder Array ergeben");r.parsed_config=a.parsed_config,r._yaml_error=a._yaml_error,i[e]=r;const o={...this._config,custom_cards:i};if(r._yaml_error)return this._config=o,void this.requestUpdate();this._config=o,this._fireConfigChanged(o)}_addCustomSection(){const e=[...this._config.custom_sections||[]];e.push({title:"",icon:"",cards:[]});const t={...this._config,custom_sections:e};this._config=t,this._fireConfigChanged(t)}_removeCustomSection(e){const t=[...this._config.custom_sections||[]];t.splice(e,1);const i={...this._config};0===t.length?delete i.custom_sections:i.custom_sections=t,this._config=i,this._fireConfigChanged(i)}_updateCustomSectionField(e,t,i){const r=[...this._config.custom_sections||[]];if(!r[e])return;r[e]={...r[e],[t]:i};const a={...this._config,custom_sections:r};this._config=a,this._fireConfigChanged(a)}_removeCardFromSection(e,t){const i=[...this._config.custom_sections||[]];if(!i[e])return;const r={...i[e]},a=[...r.cards||[]];a.splice(t,1),r.cards=a,i[e]=r;const o={...this._config,custom_sections:i};this._config=o,this._fireConfigChanged(o)}_updateSectionCardField(e,t,i,r){const a=[...this._config.custom_sections||[]];if(!a[e])return;const o={...a[e]},s=[...o.cards||[]];if(!s[t])return;s[t]={...s[t],[i]:r},o.cards=s,a[e]=o;const n={...this._config,custom_sections:a};this._config=n,this._fireConfigChanged(n)}_updateSectionCardYaml(e,t,i){const r=[...this._config.custom_sections||[]];if(!r[e])return;const a={...r[e]},o=[...a.cards||[]];if(!o[t])return;const s={...o[t],yaml:i};delete s._yaml_error;const n=oe(i,"YAML muss ein Objekt oder Array ergeben");s.parsed_config=n.parsed_config,s._yaml_error=n._yaml_error,o[t]=s,a.cards=o,r[e]=a;const c={...this._config,custom_sections:r};if(s._yaml_error)return this._config=c,void this.requestUpdate();this._config=c,this._fireConfigChanged(c)}_getAreaCustomCards(e){return[...this._config.areas_options?.[e]?.custom_cards||[]]}_writeAreaCustomCards(e,t){const i={...this._config.areas_options?.[e]||{}};0===t.length?delete i.custom_cards:i.custom_cards=t;const r={...this._config.areas_options,[e]:i};0===Object.keys(r[e]).length&&delete r[e];const a={...this._config,areas_options:r};a.areas_options&&0===Object.keys(a.areas_options).length&&delete a.areas_options,this._config=a,this._fireConfigChanged(a)}_addAreaCustomCard(e){const t=this._getAreaCustomCards(e);t.push({mode:"yaml",position:"bottom",editor_title:"",yaml:"",parsed_config:void 0}),this._writeAreaCustomCards(e,t)}_addAreaWebrtcCard(e){const t=this._getAreaCustomCards(e);t.push({mode:"webrtc",position:"bottom",editor_title:"",title:"",webrtc_url:""}),this._writeAreaCustomCards(e,t)}_removeAreaCustomCard(e,t){const i=this._getAreaCustomCards(e);t<0||t>=i.length||(i.splice(t,1),this._writeAreaCustomCards(e,i))}_updateAreaCustomCardField(e,t,i,r){const a=this._getAreaCustomCards(e);if(!a[t])return;const o={...a[t],[i]:r};"mode"!==i||"yaml"!==r&&"section"!==r||this._parseAreaCustomCardYamlConfig(o,o.yaml||""),"mode"!==i||"tile"!==r&&"webrtc"!==r||(delete o._yaml_error,o.parsed_config=void 0),a[t]=o,this._writeAreaCustomCards(e,a)}_parseAreaCustomCardYamlConfig(e,t){if(e.yaml=t,delete e._yaml_error,t.trim())try{const i=Q.load(t);if(i&&"object"==typeof i){if("section"===e.mode){if(!(Array.isArray(i)?i:[i]).every(e=>e&&"object"==typeof e&&Array.isArray(e.cards)))return e._yaml_error="Section-YAML muss ein Objekt oder Array mit cards enthalten",void(e.parsed_config=void 0)}e.parsed_config=i}else e._yaml_error="YAML muss ein Objekt oder Array ergeben",e.parsed_config=void 0}catch(t){const i=t instanceof Error?t.message.split("\n")[0]:"Ungültiges YAML";e._yaml_error=i||"Ungültiges YAML",e.parsed_config=void 0}else e.parsed_config=void 0}_updateAreaCustomCardYaml(e,t,i){const r=this._getAreaCustomCards(e);if(!r[t])return;const a={...r[t]};this._parseAreaCustomCardYamlConfig(a,i),r[t]=a,this._writeAreaCustomCards(e,r)}_addCustomBadge(){const e=[...this._config.custom_badges||[]];e.push({yaml:"",parsed_config:void 0});const t={...this._config,custom_badges:e};this._config=t,this._fireConfigChanged(t)}_removeCustomBadge(e){const t=[...this._config.custom_badges||[]];t.splice(e,1);const i={...this._config};0===t.length?delete i.custom_badges:i.custom_badges=t,this._config=i,this._fireConfigChanged(i)}_updateCustomBadgeYaml(e,t){const i=[...this._config.custom_badges||[]];if(!i[e])return;const r={...i[e],yaml:t};delete r._yaml_error;const a=oe(t,"YAML muss ein Objekt ergeben");r.parsed_config=a.parsed_config,r._yaml_error=a._yaml_error,i[e]=r;const o={...this._config,custom_badges:i};this._config=o,this._fireConfigChanged(o)}_areaVisibilityChanged(e,t){if(!this._hass)return;let i=[...this._config.areas_display?.hidden||[]];t?i=i.filter(t=>t!==e):(i.includes(e)||i.push(e),this._expandedAreas.delete(e),this._expandedGroups.delete(e),this._areaEntitiesCache.delete(e));const r={...this._config,areas_display:{...this._config.areas_display,hidden:i}};0===r.areas_display?.hidden?.length&&delete r.areas_display.hidden,r.areas_display&&0===Object.keys(r.areas_display).length&&delete r.areas_display,this._invalidateWeatherStartOptionsCaches(),this._config=r,this._fireConfigChanged(r)}_areaNavPinChanged(e,t){let i=[...this._config.areas_display?.nav_items||[]];t?i.includes(e)||i.push(e):i=i.filter(t=>t!==e);const r={...this._config,areas_display:{...this._config.areas_display,nav_items:i}};0===r.areas_display?.nav_items?.length&&delete r.areas_display.nav_items,r.areas_display&&0===Object.keys(r.areas_display).length&&delete r.areas_display,this._config=r,this._fireConfigChanged(r)}_toggleAreaExpand(e,t){e.stopPropagation();const i=new Set(this._expandedAreas);if(i.has(t)){i.delete(t);const e=new Map(this._expandedGroups);e.delete(t),this._expandedGroups=e}else i.add(t),this._areaEntitiesCache.has(t)||this._loadAreaEntities(t);this._expandedAreas=i}_toggleGroupExpand(e,t){const i=new Map(this._expandedGroups),r=new Set(i.get(e)||[]);r.has(t)?r.delete(t):r.add(t),r.size>0?i.set(e,r):i.delete(e),this._expandedGroups=i}_groupVisibilityChanged(e,t,i,r){if(!this._hass)return;const a=((this._config.areas_options?.[e]||{}).groups_options||{})[t];let o=[...a?.hidden||[]];o=i?o.filter(e=>!r.includes(e)):[...new Set([...o,...r])],this._updateEntityConfig(e,t,o)}_entityVisibilityChanged(e,t,i,r){if(!this._hass)return;if("badges_additional"===t)return void this._badgeAdditionalChanged(e,i,r);if("badges_show_name"===t)return void this._badgeShowNameChanged(e,i,r);const a=((this._config.areas_options?.[e]||{}).groups_options||{})[t];let o=[...a?.hidden||[]];r?o=o.filter(e=>e!==i):o.includes(i)||o.push(i),this._updateEntityConfig(e,t,o)}_updateEntityConfig(e,t,i){const r=this._config.areas_options?.[e]||{},a=r.groups_options||{},o={...a[t],hidden:i};0===o.hidden.length&&delete o.hidden;const s={...a,[t]:o};0===Object.keys(s[t]).length&&delete s[t];const n={...r,groups_options:s};0===Object.keys(n.groups_options).length&&delete n.groups_options;const c={...this._config.areas_options,[e]:n};0===Object.keys(c[e]).length&&delete c[e];const l={...this._config,areas_options:c};l.areas_options&&0===Object.keys(l.areas_options).length&&delete l.areas_options,this._config=l,this._fireConfigChanged(l),this._refreshAreaCache(e)}_badgeAdditionalChanged(e,t,i){if(!this._config)return;const r=this._config.areas_options?.[e]||{},a=r.groups_options||{},o=a.badges||{};let s=[...o.additional||[]];i?s.includes(t)||s.push(t):s=s.filter(e=>e!==t);const n={...o};s.length>0?n.additional=s:delete n.additional;const c={...a,badges:n};0===Object.keys(c.badges).length&&delete c.badges;const l={...r,groups_options:c};0===Object.keys(l.groups_options).length&&delete l.groups_options;const d={...this._config.areas_options,[e]:l};0===Object.keys(d[e]).length&&delete d[e];const p={...this._config,areas_options:d};p.areas_options&&0===Object.keys(p.areas_options).length&&delete p.areas_options,this._config=p,this._fireConfigChanged(p),this._refreshAreaCache(e)}_badgeShowNameChanged(e,t,i){if(!this._config||!this._hass)return;const r=this._config.areas_options?.[e]||{},a=r.groups_options||{},o=a.badges||{};let s=[...o.names_visible||[]],n=[...o.names_hidden||[]];const c=this._hass.states[t],l=c?.attributes?.device_class;i===(0,ie.g7)(l)?(s=s.filter(e=>e!==t),n=n.filter(e=>e!==t)):i?(s.includes(t)||s.push(t),n=n.filter(e=>e!==t)):(s=s.filter(e=>e!==t),n.includes(t)||n.push(t));const d={...o};s.length>0?d.names_visible=s:delete d.names_visible,n.length>0?d.names_hidden=n:delete d.names_hidden;const p={...a,badges:d};0===Object.keys(p.badges).length&&delete p.badges;const h={...r,groups_options:p};0===Object.keys(h.groups_options).length&&delete h.groups_options;const _={...this._config.areas_options,[e]:h};0===Object.keys(_[e]).length&&delete _[e];const u={...this._config,areas_options:_};u.areas_options&&0===Object.keys(u.areas_options).length&&delete u.areas_options,this._config=u,this._fireConfigChanged(u),this._refreshAreaCache(e)}_addBadgeFromPicker(e,t){e.stopPropagation();const i=this.shadowRoot.querySelector(`.badge-entity-picker[data-area-id="${t}"]`);if(!i||!i.value)return;const r=i.value;this._badgeAdditionalChanged(t,r,!0),i.value=""}_getAreaOrder(){if(!this._hass)return[];const e=this._config.areas_display?.order;return e&&e.length>0?[...e]:Object.keys(this._hass.areas||{})}_updateAreaOrder(e){const t={...this._config,areas_display:{...this._config.areas_display,order:e}};this._invalidateWeatherStartOptionsCaches(),this._config=t,this._fireConfigChanged(t)}_fireConfigChanged(e){this._isUpdatingConfig=!0;const t={...e};delete t.inline_editor,t.custom_views&&(t.custom_views=t.custom_views.map(e=>{const t={...e};return delete t._yaml_error,t})),t.custom_cards&&(t.custom_cards=t.custom_cards.map(e=>{const t={...e};return delete t._yaml_error,t})),t.custom_badges&&(t.custom_badges=t.custom_badges.map(e=>{const t={...e};return delete t._yaml_error,t})),t.custom_sections&&(t.custom_sections=t.custom_sections.map(e=>({...e,cards:(e.cards||[]).map(e=>{const t={...e};return delete t._yaml_error,t})}))),t.weather_start_layout_items&&(t.weather_start_layout_items=t.weather_start_layout_items.map(e=>{const t={...e};return delete t._yaml_error,t})),t.areas_options&&(t.areas_options=Object.fromEntries(Object.entries(t.areas_options).map(([e,t])=>[e,{...t,...t.custom_cards?{custom_cards:t.custom_cards.map(e=>{const t={...e};return delete t._yaml_error,t})}:{}}]))),this._config=t;const i=new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0});this.dispatchEvent(i),setTimeout(()=>{this._isUpdatingConfig=!1},0)}_openCardPickerForSection(e){this._openCardPicker(t=>{const i=Q.dump(t).trim(),r=[...this._config.custom_sections||[]];if(!r[e])return;const a={...r[e]};a.cards=[...a.cards||[],{editor_title:"",yaml:i,parsed_config:t}],r[e]=a;const o={...this._config,custom_sections:r};this._config=o,this._fireConfigChanged(o)})}_openCardPickerForAreaCustomCard(e){this._openCardPicker(t=>{const i=Q.dump(t).trim(),r=this._getAreaCustomCards(e);r.push({mode:"yaml",position:"bottom",editor_title:"",yaml:i,parsed_config:t}),this._writeAreaCustomCards(e,r)})}_openCardEditorForCustomCard(e){const t=this._config.custom_cards?.[e],i=this._getEditableYamlCardConfig(t);i&&this._openCardPicker(t=>{this._updateCustomCardYaml(e,Q.dump(t).trim())},i)}_openCardEditorForSectionCard(e,t){const i=this._config.custom_sections?.[e]?.cards?.[t],r=this._getEditableYamlCardConfig(i);r&&this._openCardPicker(i=>{this._updateSectionCardYaml(e,t,Q.dump(i).trim())},r)}_openCardEditorForAreaCustomCard(e,t){const i=this._getAreaCustomCards(e)[t],r=this._getEditableAreaCardConfig(i);r&&this._openCardPicker(i=>{const r=this._getAreaCustomCards(e);if(!r[t])return;const a={...r[t],mode:"yaml",yaml:Q.dump(i).trim(),parsed_config:i};delete a._yaml_error,r[t]=a,this._writeAreaCustomCards(e,r)},r)}_getEditableAreaCardConfig(e){return e?"tile"===(e.mode||"yaml")&&e.entity?{type:"tile",entity:e.entity}:this._getEditableYamlCardConfig(e):null}_getEditableYamlCardConfig(e){if(e?.parsed_config&&"object"==typeof e.parsed_config&&!Array.isArray(e.parsed_config))return e.parsed_config;if(!e?.yaml?.trim())return null;try{const t=Q.load(e.yaml);return t&&"object"==typeof t&&!Array.isArray(t)?t:null}catch{return null}}_openCardPicker(e,t){this._cardPickerCallback=e,this._cardPickerConfig=t||null,this._cardPickerOpen=!0,this._cardPickerStep=t?"editor":"type",this._cardPickerSearch="",this._cardPickerSelectedType="string"==typeof t?.type?t.type:"",this._cardPickerYaml=t?Q.dump(t).trim():"",this._cardPickerHasVisualEditor=!1}_closeCardPicker(){this._cardPickerOpen=!1,this._cardPickerCallback=null,this._cardPickerConfig=null;const e=this.shadowRoot?.querySelector(".card-editor-visual-host");e&&(e.innerHTML="")}_selectCardType(e){this._cardPickerSelectedType=e,this._cardPickerStep="editor";const t=se.find(t=>t.type===e);if(t){this._cardPickerYaml=t.template;try{const e=Q.load(t.template);e&&"object"==typeof e&&!Array.isArray(e)&&(this._cardPickerConfig=e)}catch{}}else this._cardPickerYaml=`type: ${e}\n`,this._cardPickerConfig={type:e};this._cardPickerHasVisualEditor=!1}_cardPickerYamlChanged(e){const t=e.target.value;this._cardPickerYaml=t;try{const e=Q.load(t);e&&"object"==typeof e&&!Array.isArray(e)&&(this._cardPickerConfig=e)}catch{}}_confirmCardPicker(){this._cardPickerConfig&&this._cardPickerCallback&&(this._cardPickerCallback(this._cardPickerConfig),this._closeCardPicker())}updated(e){super.updated(e),this._cardPickerOpen&&"editor"===this._cardPickerStep&&!this._cardPickerHasVisualEditor&&this._tryMountVisualCardEditor()}_tryMountVisualCardEditor(){const e=this.shadowRoot?.querySelector(".card-editor-visual-host");if(e&&!e.firstChild&&customElements.get("hui-card-element-editor"))try{const t=document.createElement("hui-card-element-editor");t.hass=this._hass,t.value=this._cardPickerConfig||{type:this._cardPickerSelectedType},t.addEventListener("config-changed",e=>{const t=e.detail?.config;t&&"object"==typeof t&&(this._cardPickerConfig=t,this._cardPickerYaml=Q.dump(t).trim(),this.requestUpdate("_cardPickerYaml"))}),e.appendChild(t),this._cardPickerHasVisualEditor=!0}catch{}}_renderCardPickerOverlay(){return"type"===this._cardPickerStep?this._renderCardTypePicker():this._renderCardEditor()}_renderCardTypePicker(){const e=this._cardPickerSearch.toLowerCase(),t=se.filter(t=>!e||t.type.includes(e)||t.name.toLowerCase().includes(e)),i=new Set(se.map(e=>e.type)),a=(window.customCards||[]).filter(t=>!i.has(t.type)&&(!e||t.type.includes(e)||(t.name||"").toLowerCase().includes(e)));return r.qy`
      <div class="card-picker-overlay" @click=${this._handlePickerOverlayClick}>
        <div class="card-picker-dialog" @click=${e=>e.stopPropagation()}>
          <div class="card-picker-header">
            <span class="card-picker-header-title">Karte hinzufügen</span>
            <button class="card-picker-icon-btn" @click=${this._closeCardPicker} title="Schließen">
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          <div class="card-picker-search-row">
            <input type="text" placeholder="Kartentyp suchen…"
              .value=${this._cardPickerSearch}
              @input=${e=>{this._cardPickerSearch=e.target.value,this.requestUpdate()}} />
          </div>
          <div class="card-type-grid">
            ${t.map(e=>r.qy`
              <button class="card-type-btn" @click=${()=>this._selectCardType(e.type)}>
                <ha-icon icon=${e.icon}></ha-icon>
                <span>${e.name}</span>
              </button>
            `)}
            ${a.map(e=>r.qy`
              <button class="card-type-btn" @click=${()=>this._selectCardType(e.type)}>
                <ha-icon icon="mdi:puzzle"></ha-icon>
                <span>${e.name||e.type}</span>
              </button>
            `)}
          </div>
        </div>
      </div>
    `}_renderCardEditor(){const e=se.find(e=>e.type===this._cardPickerSelectedType)?.name||this._cardPickerSelectedType;return r.qy`
      <div class="card-picker-overlay" @click=${this._handlePickerOverlayClick}>
        <div class="card-picker-dialog" @click=${e=>e.stopPropagation()}>
          <div class="card-picker-header">
            <button class="card-picker-icon-btn"
              @click=${()=>{this._cardPickerStep="type";const e=this.shadowRoot?.querySelector(".card-editor-visual-host");e&&(e.innerHTML=""),this._cardPickerHasVisualEditor=!1}}
              title="Zurück">
              <ha-icon icon="mdi:arrow-left"></ha-icon>
            </button>
            <span class="card-picker-header-title">${e}</span>
            <button class="card-picker-icon-btn" @click=${this._closeCardPicker} title="Schließen">
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          <div class="card-editor-content">
            <div class="card-editor-visual-host"></div>
            ${this._cardPickerHasVisualEditor?r.s6:r.qy`
              <div class="card-editor-yaml-label">YAML-Konfiguration:</div>
              <textarea class="card-editor-yaml-area"
                .value=${this._cardPickerYaml}
                @input=${this._cardPickerYamlChanged}
                spellcheck="false"></textarea>
            `}
          </div>
          <div class="card-picker-footer">
            <button class="btn-secondary" @click=${this._closeCardPicker}>Abbrechen</button>
            <button class="btn-primary" @click=${this._confirmCardPicker}>Speichern</button>
          </div>
        </div>
      </div>
    `}}function ce(e,t){const i=Object.values(t.devices||{}),r=Object.values(t.entities||{}),a=new Set;for(const t of i)t.area_id===e&&a.add(t.id);const o=[];for(const i of r){let r=!1;if(i.area_id?r=i.area_id===e:i.device_id&&a.has(i.device_id)&&(r=!0),!r)continue;if((0,ee.z)(i))continue;if(i.labels?.includes("no_dboard"))continue;if(!t.states[i.entity_id])continue;const s=i.entity_id.split(".")[0],n=t.states[i.entity_id],c=n.attributes?.device_class,l=n.attributes?.unit_of_measurement;if((0,ie.fF)(s,c,l,i.entity_id)){if("sensor"===s&&("battery"===c||i.entity_id.includes("battery"))){const e=parseFloat(n.state);!isNaN(e)&&e<20&&o.push(i.entity_id);continue}o.push(i.entity_id)}}return o}function le(e,t){return t.areas_options?.[e]?.groups_options?.badges?.additional||[]}function de(e,t,i,r){const a=Object.values(t.devices||{}),o=Object.values(t.entities||{}),s=new Set([...i,...r]),n=new Set;for(const t of a)t.area_id===e&&n.add(t.id);const c=[];for(const i of o){let r=!1;if(i.area_id?r=i.area_id===e:i.device_id&&n.has(i.device_id)&&(r=!0),!r)continue;if((0,ee.z)(i))continue;if(!t.states[i.entity_id])continue;const a=i.entity_id.split(".")[0];if("sensor"!==a&&"binary_sensor"!==a)continue;if(s.has(i.entity_id))continue;const o=t.states[i.entity_id],l=o.attributes?.friendly_name||i.entity_id.split(".")[1].replace(/_/g," ");c.push({entity_id:i.entity_id,name:l})}return c.sort((e,t)=>e.name.localeCompare(t.name)),c}function pe(e,t){const i=new Set;for(const r of e){const e=t.states[r];if(!e)continue;const a=e.attributes?.device_class;(0,ie.g7)(a)&&i.add(r)}return i}function he(e,t){const i=t.areas_options?.[e]?.groups_options?.badges;return{namesVisible:i?.names_visible||[],namesHidden:i?.names_hidden||[]}}function _e(e,t){const i=t.areas_options?.[e];if(!i||!i.groups_options)return{};const r={};for(const[e,t]of Object.entries(i.groups_options))t.hidden&&(r[e]=t.hidden);return r}function ue(e,t){const i=t.areas_options?.[e];if(!i||!i.groups_options)return{};const r={};for(const[e,t]of Object.entries(i.groups_options))t.order&&(r[e]=t.order);return r}ne.properties={_config:{state:!0},_expandedAreas:{state:!0},_expandedGroups:{state:!0},_expandedWeatherBlocks:{state:!0},_cardPickerOpen:{state:!0},_cardPickerStep:{state:!0},_cardPickerSearch:{state:!0},_cardPickerSelectedType:{state:!0},_cardPickerYaml:{state:!0},_cardPickerHasVisualEditor:{state:!0}},ne.styles=r.AH`
    /* -- Base layout --------------------------------------------------- */
    .card-config {
      padding: 16px;
      font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
      font-size: var(--mdc-typography-body1-font-size, 14px);
      color: var(--primary-text-color);
    }
    .section {
      margin-bottom: 16px;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #e8e8e8);
      border-radius: var(--ha-card-border-radius, 12px);
      padding: 16px;
      transition: box-shadow 0.2s ease;
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
    .form-row input[type="checkbox"],
    .form-row input[type="radio"] {
      margin-right: 8px;
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: var(--primary-color);
    }
    .form-row input[type="checkbox"]:disabled,
    .form-row input[type="radio"]:disabled {
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
    input[type="text"],
    input[type="number"] {
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
    input[type="text"]:focus,
    input[type="number"]:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 1px var(--primary-color);
    }
    input[type="text"]:hover,
    input[type="number"]:hover {
      border-color: var(--primary-color);
    }
    input[type="text"]::placeholder {
      color: var(--secondary-text-color);
      opacity: 0.7;
    }

    /* -- Native <textarea> — YAML editors ------------------------------ */
    textarea {
      font-family: "Roboto Mono", "SFMono-Regular", "Consolas", "Liberation Mono", monospace;
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
      transition: opacity 0.2s ease, box-shadow 0.2s ease;
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
      transition: color 0.2s ease, border-color 0.2s ease;
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
      transition: color 0.15s ease, border-color 0.15s ease;
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
      transition: opacity 0.15s, color 0.15s;
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
    .section-order-item .section-hidden-tag {
      font-size: 12px;
      color: var(--secondary-text-color);
      font-style: italic;
      margin-left: 8px;
    }
    .section-order-item .section-toggle {
      margin-left: auto;
      cursor: pointer;
    }
    .section-order-item .section-toggle input {
      cursor: pointer;
      width: 16px;
      height: 16px;
    }
    .section-order-sub {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px 8px 56px;
      border-bottom: 1px solid var(--divider-color);
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .section-order-sub input {
      cursor: pointer;
    }
    .section-order-sub label {
      cursor: pointer;
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
    .group-checkbox[data-indeterminate="true"] {
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
      font-family: "Roboto Mono", monospace;
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
      font-family: "Roboto Mono", monospace;
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
      font-family: "Roboto Mono", monospace;
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
      input[type="text"],
      input[type="number"] {
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
      transition: border-color 0.15s ease, background 0.15s ease;
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
  `,ne._sectionMeta=new Map([["overview",{icon:"mdi:home-outline",labelKey:"sections.overview"}],["custom_cards",{icon:"mdi:cards",labelKey:"sections.custom_cards"}],["custom_sections",{icon:"mdi:view-grid-plus-outline",labelKey:"sections.custom_sections"}],["areas",{icon:"mdi:floor-plan",labelKey:"sections.areas"}],["weather",{icon:"mdi:weather-partly-cloudy",labelKey:"sections.weather"}],["energy",{icon:"mdi:lightning-bolt",labelKey:"sections.energy"}]]),ne._weatherStartBlockMeta=new Map([["clock",{icon:"mdi:clock-outline",labelKey:"weather_start_blocks.clock"}],["date",{icon:"mdi:calendar-today",labelKey:"weather_start_blocks.date"}],["summaries",{icon:"mdi:view-dashboard-outline",labelKey:"weather_start_blocks.summaries"}],["weather_current",{icon:"mdi:weather-partly-cloudy",labelKey:"weather_start_blocks.weather_current"}],["weather_hourly",{icon:"mdi:clock-time-four-outline",labelKey:"weather_start_blocks.weather_hourly"}],["weather_daily",{icon:"mdi:calendar-week",labelKey:"weather_start_blocks.weather_daily"}],["areas",{icon:"mdi:floor-plan",labelKey:"weather_start_blocks.areas"}],["custom_cards",{icon:"mdi:cards",labelKey:"weather_start_blocks.custom_cards"}],["custom_sections",{icon:"mdi:view-grid-plus-outline",labelKey:"weather_start_blocks.custom_sections"}]]),ne._stackMeta=new Map([["energy",{icon:"mdi:lightning-bolt",labelKey:"stacks.energy"}],["cameras",{icon:"mdi:cctv",labelKey:"stacks.cameras"}],["lights",{icon:"mdi:lightbulb",labelKey:"stacks.lights"}],["locks",{icon:"mdi:lock",labelKey:"stacks.locks"}],["climate",{icon:"mdi:thermostat",labelKey:"stacks.climate"}],["covers",{icon:"mdi:window-shutter",labelKey:"stacks.covers"}],["covers_window",{icon:"mdi:window-open-variant",labelKey:"stacks.covers_window"}],["media",{icon:"mdi:speaker",labelKey:"stacks.media"}],["scenes",{icon:"mdi:palette",labelKey:"stacks.scenes"}],["misc",{icon:"mdi:light-switch",labelKey:"stacks.misc"}],["room_pins",{icon:"mdi:pin",labelKey:"stacks.room_pins"}]]),customElements.define("dashboard-strategy-editor",ne)}}]);