"use strict";(self.webpackChunkdashboard_strategy=self.webpackChunkdashboard_strategy||[]).push([[8],{3085(e,t,i){var r=i(6684),o=i(3534),s=Object.create,a=Object.defineProperty,n=Object.getOwnPropertyDescriptor,c=Object.getOwnPropertyNames,d=Object.getPrototypeOf,l=Object.prototype.hasOwnProperty,h=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),_=(e,t,i)=>(i=null!=e?s(d(e)):{},((e,t,i,r)=>{if(t&&"object"==typeof t||"function"==typeof t)for(var o,s=c(t),d=0,h=s.length;d<h;d++)o=s[d],l.call(e,o)||void 0===o||a(e,o,{get:(e=>t[e]).bind(null,o),enumerable:!(r=n(t,o))||r.enumerable});return e})(!t&&e&&e.__esModule?i:a(i,"default",{value:e,enumerable:!0}),e)),p=h((e,t)=>{function i(e){return null==e}t.exports.isNothing=i,t.exports.isObject=function(e){return"object"==typeof e&&null!==e},t.exports.toArray=function(e){return Array.isArray(e)?e:i(e)?[]:[e]},t.exports.repeat=function(e,t){let i="";for(let r=0;r<t;r+=1)i+=e;return i},t.exports.isNegativeZero=function(e){return 0===e&&Number.NEGATIVE_INFINITY===1/e},t.exports.extend=function(e,t){if(t){const i=Object.keys(t);for(let r=0,o=i.length;r<o;r+=1){const o=i[r];e[o]=t[o]}}return e}}),u=h((e,t)=>{function i(e,t){let i="";const r=e.reason||"(unknown reason)";return e.mark?(e.mark.name&&(i+='in "'+e.mark.name+'" '),i+="("+(e.mark.line+1)+":"+(e.mark.column+1)+")",!t&&e.mark.snippet&&(i+="\n\n"+e.mark.snippet),r+" "+i):r}function r(e,t){Error.call(this),this.name="YAMLException",this.reason=e,this.mark=t,this.message=i(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=(new Error).stack||""}r.prototype=Object.create(Error.prototype),r.prototype.constructor=r,r.prototype.toString=function(e){return this.name+": "+i(this,e)},t.exports=r}),g=h((e,t)=>{var i=p();function r(e,t,i,r,o){let s="",a="";const n=Math.floor(o/2)-1;return r-t>n&&(s=" ... ",t=r-n+s.length),i-r>n&&(a=" ...",i=r+n-a.length),{str:s+e.slice(t,i).replace(/\t/g,"→")+a,pos:r-t+s.length}}function o(e,t){return i.repeat(" ",t-e.length)+e}t.exports=function(e,t){if(t=Object.create(t||null),!e.buffer)return null;t.maxLength||(t.maxLength=79),"number"!=typeof t.indent&&(t.indent=1),"number"!=typeof t.linesBefore&&(t.linesBefore=3),"number"!=typeof t.linesAfter&&(t.linesAfter=2);const s=/\r?\n|\r|\0/g,a=[0],n=[];let c,d=-1;for(;c=s.exec(e.buffer);)n.push(c.index),a.push(c.index+c[0].length),e.position<=c.index&&d<0&&(d=a.length-2);d<0&&(d=a.length-1);let l="";const h=Math.min(e.line+t.linesAfter,n.length).toString().length,_=t.maxLength-(t.indent+h+3);for(let s=1;s<=t.linesBefore&&!(d-s<0);s++){const c=r(e.buffer,a[d-s],n[d-s],e.position-(a[d]-a[d-s]),_);l=i.repeat(" ",t.indent)+o((e.line-s+1).toString(),h)+" | "+c.str+"\n"+l}const p=r(e.buffer,a[d],n[d],e.position,_);l+=i.repeat(" ",t.indent)+o((e.line+1).toString(),h)+" | "+p.str+"\n",l+=i.repeat("-",t.indent+h+3+p.pos)+"^\n";for(let s=1;s<=t.linesAfter&&!(d+s>=n.length);s++){const c=r(e.buffer,a[d+s],n[d+s],e.position-(a[d]-a[d+s]),_);l+=i.repeat(" ",t.indent)+o((e.line+s+1).toString(),h)+" | "+c.str+"\n"}return l.replace(/\n$/,"")}}),m=h((e,t)=>{var i=u(),r=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],o=["scalar","sequence","mapping"];t.exports=function(e,t){if(t=t||{},Object.keys(t).forEach(function(t){if(-1===r.indexOf(t))throw new i('Unknown option "'+t+'" is met in definition of "'+e+'" YAML type.')}),this.options=t,this.tag=e,this.kind=t.kind||null,this.resolve=t.resolve||function(){return!0},this.construct=t.construct||function(e){return e},this.instanceOf=t.instanceOf||null,this.predicate=t.predicate||null,this.represent=t.represent||null,this.representName=t.representName||null,this.defaultStyle=t.defaultStyle||null,this.multi=t.multi||!1,this.styleAliases=function(e){const t={};return null!==e&&Object.keys(e).forEach(function(i){e[i].forEach(function(e){t[String(e)]=i})}),t}(t.styleAliases||null),-1===o.indexOf(this.kind))throw new i('Unknown kind "'+this.kind+'" is specified for "'+e+'" YAML type.')}}),f=h((e,t)=>{var i=u(),r=m();function o(e,t){const i=[];return e[t].forEach(function(e){let t=i.length;i.forEach(function(i,r){i.tag===e.tag&&i.kind===e.kind&&i.multi===e.multi&&(t=r)}),i[t]=e}),i}function s(e){return this.extend(e)}s.prototype.extend=function(e){let t=[],a=[];if(e instanceof r)a.push(e);else if(Array.isArray(e))a=a.concat(e);else{if(!e||!Array.isArray(e.implicit)&&!Array.isArray(e.explicit))throw new i("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");e.implicit&&(t=t.concat(e.implicit)),e.explicit&&(a=a.concat(e.explicit))}t.forEach(function(e){if(!(e instanceof r))throw new i("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(e.loadKind&&"scalar"!==e.loadKind)throw new i("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(e.multi)throw new i("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),a.forEach(function(e){if(!(e instanceof r))throw new i("Specified list of YAML types (or a single Type object) contains a non-Type object.")});const n=Object.create(s.prototype);return n.implicit=(this.implicit||[]).concat(t),n.explicit=(this.explicit||[]).concat(a),n.compiledImplicit=o(n,"implicit"),n.compiledExplicit=o(n,"explicit"),n.compiledTypeMap=function(){const e={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}};function t(t){t.multi?(e.multi[t.kind].push(t),e.multi.fallback.push(t)):e[t.kind][t.tag]=e.fallback[t.tag]=t}for(let e=0,i=arguments.length;e<i;e+=1)arguments[e].forEach(t);return e}(n.compiledImplicit,n.compiledExplicit),n},t.exports=s}),y=h((e,t)=>{t.exports=new(m())("tag:yaml.org,2002:str",{kind:"scalar",construct:function(e){return null!==e?e:""}})}),v=h((e,t)=>{t.exports=new(m())("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(e){return null!==e?e:[]}})}),b=h((e,t)=>{t.exports=new(m())("tag:yaml.org,2002:map",{kind:"mapping",construct:function(e){return null!==e?e:{}}})}),w=h((e,t)=>{t.exports=new(f())({explicit:[y(),v(),b()]})}),k=h((e,t)=>{var i=m();t.exports=new i("tag:yaml.org,2002:null",{kind:"scalar",resolve:function(e){if(null===e)return!0;const t=e.length;return 1===t&&"~"===e||4===t&&("null"===e||"Null"===e||"NULL"===e)},construct:function(){return null},predicate:function(e){return null===e},represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"})}),x=h((e,t)=>{var i=m();t.exports=new i("tag:yaml.org,2002:bool",{kind:"scalar",resolve:function(e){if(null===e)return!1;const t=e.length;return 4===t&&("true"===e||"True"===e||"TRUE"===e)||5===t&&("false"===e||"False"===e||"FALSE"===e)},construct:function(e){return"true"===e||"True"===e||"TRUE"===e},predicate:function(e){return"[object Boolean]"===Object.prototype.toString.call(e)},represent:{lowercase:function(e){return e?"true":"false"},uppercase:function(e){return e?"TRUE":"FALSE"},camelcase:function(e){return e?"True":"False"}},defaultStyle:"lowercase"})}),$=h((e,t)=>{var i=p(),r=m();function o(e){return e>=48&&e<=57||e>=65&&e<=70||e>=97&&e<=102}function s(e){return e>=48&&e<=55}function a(e){return e>=48&&e<=57}function n(e){let t=e,i=1,r=t[0];if("-"!==r&&"+"!==r||("-"===r&&(i=-1),t=t.slice(1),r=t[0]),"0"===t)return 0;if("0"===r){if("b"===t[1])return i*parseInt(t.slice(2),2);if("x"===t[1])return i*parseInt(t.slice(2),16);if("o"===t[1])return i*parseInt(t.slice(2),8)}return i*parseInt(t,10)}t.exports=new r("tag:yaml.org,2002:int",{kind:"scalar",resolve:function(e){if(null===e)return!1;const t=e.length;let i=0,r=!1;if(!t)return!1;let c=e[i];if("-"!==c&&"+"!==c||(c=e[++i]),"0"===c){if(i+1===t)return!0;if(c=e[++i],"b"===c){for(i++;i<t;i++){if(c=e[i],"0"!==c&&"1"!==c)return!1;r=!0}return r&&Number.isFinite(n(e))}if("x"===c){for(i++;i<t;i++){if(!o(e.charCodeAt(i)))return!1;r=!0}return r&&Number.isFinite(n(e))}if("o"===c){for(i++;i<t;i++){if(!s(e.charCodeAt(i)))return!1;r=!0}return r&&Number.isFinite(n(e))}}for(;i<t;i++){if(!a(e.charCodeAt(i)))return!1;r=!0}return!!r&&Number.isFinite(n(e))},construct:function(e){return n(e)},predicate:function(e){return"[object Number]"===Object.prototype.toString.call(e)&&e%1==0&&!i.isNegativeZero(e)},represent:{binary:function(e){return e>=0?"0b"+e.toString(2):"-0b"+e.toString(2).slice(1)},octal:function(e){return e>=0?"0o"+e.toString(8):"-0o"+e.toString(8).slice(1)},decimal:function(e){return e.toString(10)},hexadecimal:function(e){return e>=0?"0x"+e.toString(16).toUpperCase():"-0x"+e.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}})}),C=h((e,t)=>{var i=p(),r=m(),o=new RegExp("^(?:[-+]?(?:[0-9]+)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),s=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),a=/^[-+]?[0-9]+e/;t.exports=new r("tag:yaml.org,2002:float",{kind:"scalar",resolve:function(e){return null!==e&&!!o.test(e)&&(!!Number.isFinite(parseFloat(e,10))||s.test(e))},construct:function(e){let t=e.toLowerCase();const i="-"===t[0]?-1:1;return"+-".indexOf(t[0])>=0&&(t=t.slice(1)),".inf"===t?1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:".nan"===t?NaN:i*parseFloat(t,10)},predicate:function(e){return"[object Number]"===Object.prototype.toString.call(e)&&(e%1!=0||i.isNegativeZero(e))},represent:function(e,t){if(isNaN(e))switch(t){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===e)switch(t){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===e)switch(t){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(i.isNegativeZero(e))return"-0.0";const r=e.toString(10);return a.test(r)?r.replace("e",".e"):r},defaultStyle:"lowercase"})}),S=h((e,t)=>{t.exports=w().extend({implicit:[k(),x(),$(),C()]})}),A=h((e,t)=>{t.exports=S()}),O=h((e,t)=>{var i=m(),r=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),o=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");t.exports=new i("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:function(e){return null!==e&&(null!==r.exec(e)||null!==o.exec(e))},construct:function(e){let t=0,i=null,s=r.exec(e);if(null===s&&(s=o.exec(e)),null===s)throw new Error("Date resolve error");const a=+s[1],n=+s[2]-1,c=+s[3];if(!s[4])return new Date(Date.UTC(a,n,c));const d=+s[4],l=+s[5],h=+s[6];if(s[7]){for(t=s[7].slice(0,3);t.length<3;)t+="0";t=+t}s[9]&&(i=6e4*(60*+s[10]+ +(s[11]||0)),"-"===s[9]&&(i=-i));const _=new Date(Date.UTC(a,n,c,d,l,h,t));return i&&_.setTime(_.getTime()-i),_},instanceOf:Date,represent:function(e){return e.toISOString()}})}),E=h((e,t)=>{var i=m();t.exports=new i("tag:yaml.org,2002:merge",{kind:"scalar",resolve:function(e){return"<<"===e||null===e}})}),q=h((e,t)=>{var i=m(),r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";t.exports=new i("tag:yaml.org,2002:binary",{kind:"scalar",resolve:function(e){if(null===e)return!1;let t=0;const i=e.length,o=r;for(let r=0;r<i;r++){const i=o.indexOf(e.charAt(r));if(!(i>64)){if(i<0)return!1;t+=6}}return t%8==0},construct:function(e){const t=e.replace(/[\r\n=]/g,""),i=t.length,o=r;let s=0;const a=[];for(let e=0;e<i;e++)e%4==0&&e&&(a.push(s>>16&255),a.push(s>>8&255),a.push(255&s)),s=s<<6|o.indexOf(t.charAt(e));const n=i%4*6;return 0===n?(a.push(s>>16&255),a.push(s>>8&255),a.push(255&s)):18===n?(a.push(s>>10&255),a.push(s>>2&255)):12===n&&a.push(s>>4&255),new Uint8Array(a)},predicate:function(e){return"[object Uint8Array]"===Object.prototype.toString.call(e)},represent:function(e){let t="",i=0;const o=e.length,s=r;for(let r=0;r<o;r++)r%3==0&&r&&(t+=s[i>>18&63],t+=s[i>>12&63],t+=s[i>>6&63],t+=s[63&i]),i=(i<<8)+e[r];const a=o%3;return 0===a?(t+=s[i>>18&63],t+=s[i>>12&63],t+=s[i>>6&63],t+=s[63&i]):2===a?(t+=s[i>>10&63],t+=s[i>>4&63],t+=s[i<<2&63],t+=s[64]):1===a&&(t+=s[i>>2&63],t+=s[i<<4&63],t+=s[64],t+=s[64]),t}})}),I=h((e,t)=>{var i=m(),r=Object.prototype.hasOwnProperty,o=Object.prototype.toString;t.exports=new i("tag:yaml.org,2002:omap",{kind:"sequence",resolve:function(e){if(null===e)return!0;const t=[],i=e;for(let e=0,s=i.length;e<s;e+=1){const s=i[e];let a,n=!1;if("[object Object]"!==o.call(s))return!1;for(a in s)if(r.call(s,a)){if(n)return!1;n=!0}if(!n)return!1;if(-1!==t.indexOf(a))return!1;t.push(a)}return!0},construct:function(e){return null!==e?e:[]}})}),L=h((e,t)=>{var i=m(),r=Object.prototype.toString;t.exports=new i("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:function(e){if(null===e)return!0;const t=e,i=new Array(t.length);for(let e=0,o=t.length;e<o;e+=1){const o=t[e];if("[object Object]"!==r.call(o))return!1;const s=Object.keys(o);if(1!==s.length)return!1;i[e]=[s[0],o[s[0]]]}return!0},construct:function(e){if(null===e)return[];const t=e,i=new Array(t.length);for(let e=0,r=t.length;e<r;e+=1){const r=t[e],o=Object.keys(r);i[e]=[o[0],r[o[0]]]}return i}})}),D=h((e,t)=>{var i=m(),r=Object.prototype.hasOwnProperty;t.exports=new i("tag:yaml.org,2002:set",{kind:"mapping",resolve:function(e){if(null===e)return!0;const t=e;for(const e in t)if(r.call(t,e)&&null!==t[e])return!1;return!0},construct:function(e){return null!==e?e:{}}})}),j=h((e,t)=>{t.exports=A().extend({implicit:[O(),E()],explicit:[q(),I(),L(),D()]})}),P=h((e,t)=>{var i=p(),r=u(),o=g(),s=j(),a=Object.prototype.hasOwnProperty,n=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,c=/[\x85\u2028\u2029]/,d=/[,\[\]{}]/,l=/^(?:!|!!|![0-9A-Za-z-]+!)$/,h=/^(?:!|[^,\[\]{}])(?:%[0-9a-f]{2}|[0-9a-z\-#;/?:@&=+$,_.!~*'()\[\]])*$/i;function _(e){return Object.prototype.toString.call(e)}function m(e){return 10===e||13===e}function f(e){return 9===e||32===e}function y(e){return 9===e||32===e||10===e||13===e}function v(e){return 44===e||91===e||93===e||123===e||125===e}function b(e){if(e>=48&&e<=57)return e-48;const t=32|e;return t>=97&&t<=102?t-97+10:-1}function w(e){return 120===e?2:117===e?4:85===e?8:0}function k(e){return e>=48&&e<=57?e-48:-1}function x(e){switch(e){case 48:return"\0";case 97:return"";case 98:return"\b";case 116:case 9:return"\t";case 110:return"\n";case 118:return"\v";case 102:return"\f";case 114:return"\r";case 101:return"";case 32:return" ";case 34:return'"';case 47:return"/";case 92:return"\\";case 78:return"";case 95:return" ";case 76:return"\u2028";case 80:return"\u2029";default:return""}}function $(e){return e<=65535?String.fromCharCode(e):String.fromCharCode(55296+(e-65536>>10),56320+(e-65536&1023))}function C(e,t,i){"__proto__"===t?Object.defineProperty(e,t,{configurable:!0,enumerable:!0,writable:!0,value:i}):e[t]=i}var S=new Array(256),A=new Array(256);for(let e=0;e<256;e++)S[e]=x(e)?1:0,A[e]=x(e);function O(e,t){this.input=e,this.filename=t.filename||null,this.schema=t.schema||s,this.onWarning=t.onWarning||null,this.legacy=t.legacy||!1,this.json=t.json||!1,this.listener=t.listener||null,this.maxDepth="number"==typeof t.maxDepth?t.maxDepth:100,this.maxMergeSeqLength="number"==typeof t.maxMergeSeqLength?t.maxMergeSeqLength:20,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.depth=0,this.firstTabInLine=-1,this.documents=[],this.anchorMapTransactions=[]}function E(e,t){const i={name:e.filename,buffer:e.input.slice(0,-1),position:e.position,line:e.line,column:e.position-e.lineStart};return i.snippet=o(i),new r(t,i)}function q(e,t){throw E(e,t)}function I(e,t){e.onWarning&&e.onWarning.call(null,E(e,t))}function L(e,t,i){const r=e.anchorMapTransactions;if(0!==r.length){const i=r[r.length-1];a.call(i,t)||(i[t]={existed:a.call(e.anchorMap,t),value:e.anchorMap[t]})}e.anchorMap[t]=i}function D(e){return{position:e.position,line:e.line,lineStart:e.lineStart,lineIndent:e.lineIndent,firstTabInLine:e.firstTabInLine,tag:e.tag,anchor:e.anchor,kind:e.kind,result:e.result}}function P(e,t){e.position=t.position,e.line=t.line,e.lineStart=t.lineStart,e.lineIndent=t.lineIndent,e.firstTabInLine=t.firstTabInLine,e.tag=t.tag,e.anchor=t.anchor,e.kind=t.kind,e.result=t.result}var F={YAML:function(e,t,i){null!==e.version&&q(e,"duplication of %YAML directive"),1!==i.length&&q(e,"YAML directive accepts exactly one argument");const r=/^([0-9]+)\.([0-9]+)$/.exec(i[0]);null===r&&q(e,"ill-formed argument of the YAML directive");const o=parseInt(r[1],10),s=parseInt(r[2],10);1!==o&&q(e,"unacceptable YAML version of the document"),e.version=i[0],e.checkLineBreaks=s<2,1!==s&&2!==s&&I(e,"unsupported YAML version of the document")},TAG:function(e,t,i){let r;2!==i.length&&q(e,"TAG directive accepts exactly two arguments");const o=i[0];r=i[1],l.test(o)||q(e,"ill-formed tag handle (first argument) of the TAG directive"),a.call(e.tagMap,o)&&q(e,'there is a previously declared suffix for "'+o+'" tag handle'),h.test(r)||q(e,"ill-formed tag prefix (second argument) of the TAG directive");try{r=decodeURIComponent(r)}catch(t){q(e,"tag prefix is malformed: "+r)}e.tagMap[o]=r}};function T(e,t,i,r){if(t<i){const o=e.input.slice(t,i);if(r)for(let t=0,i=o.length;t<i;t+=1){const i=o.charCodeAt(t);9===i||i>=32&&i<=1114111||q(e,"expected valid JSON character")}else n.test(o)&&q(e,"the stream contains non-printable characters");e.result+=o}}function W(e,t,r,o){i.isObject(r)||q(e,"cannot merge mappings; the provided source object is unacceptable");const s=Object.keys(r);for(let e=0,i=s.length;e<i;e+=1){const i=s[e];a.call(t,i)||(C(t,i,r[i]),o[i]=!0)}}function M(e,t,i,r,o,s,n,c,d){if(Array.isArray(o))for(let t=0,i=(o=Array.prototype.slice.call(o)).length;t<i;t+=1)Array.isArray(o[t])&&q(e,"nested arrays are not supported inside keys"),"object"==typeof o&&"[object Object]"===_(o[t])&&(o[t]="[object Object]");if("object"==typeof o&&"[object Object]"===_(o)&&(o="[object Object]"),o=String(o),null===t&&(t={}),"tag:yaml.org,2002:merge"===r)if(Array.isArray(s)){s.length>e.maxMergeSeqLength&&q(e,"merge sequence length exceeded maxMergeSeqLength ("+e.maxMergeSeqLength+")");const r=new Set;for(let o=0,a=s.length;o<a;o+=1){const a=s[o];r.has(a)||(r.add(a),W(e,t,a,i))}}else W(e,t,s,i);else e.json||a.call(i,o)||!a.call(t,o)||(e.line=n||e.line,e.lineStart=c||e.lineStart,e.position=d||e.position,q(e,"duplicated mapping key")),C(t,o,s),delete i[o];return t}function z(e){const t=e.input.charCodeAt(e.position);10===t?e.position++:13===t?(e.position++,10===e.input.charCodeAt(e.position)&&e.position++):q(e,"a line break is expected"),e.line+=1,e.lineStart=e.position,e.firstTabInLine=-1}function N(e,t,i){let r=0,o=e.input.charCodeAt(e.position);for(;0!==o;){for(;f(o);)9===o&&-1===e.firstTabInLine&&(e.firstTabInLine=e.position),o=e.input.charCodeAt(++e.position);if(t&&35===o)do{o=e.input.charCodeAt(++e.position)}while(10!==o&&13!==o&&0!==o);if(!m(o))break;for(z(e),o=e.input.charCodeAt(e.position),r++,e.lineIndent=0;32===o;)e.lineIndent++,o=e.input.charCodeAt(++e.position)}return-1!==i&&0!==r&&e.lineIndent<i&&I(e,"deficient indentation"),r}function K(e){let t=e.position,i=e.input.charCodeAt(t);return!(45!==i&&46!==i||i!==e.input.charCodeAt(t+1)||i!==e.input.charCodeAt(t+2)||(t+=3,i=e.input.charCodeAt(t),0!==i&&!y(i)))}function V(e,t){1===t?e.result+=" ":t>1&&(e.result+=i.repeat("\n",t-1))}function B(e,t){const i=e.tag,r=e.anchor,o=[];let s=!1;if(-1!==e.firstTabInLine)return!1;null!==e.anchor&&L(e,e.anchor,o);let a=e.input.charCodeAt(e.position);for(;0!==a&&(-1!==e.firstTabInLine&&(e.position=e.firstTabInLine,q(e,"tab characters must not be used in indentation")),45===a)&&y(e.input.charCodeAt(e.position+1));){if(s=!0,e.position++,N(e,!0,-1)&&e.lineIndent<=t){o.push(null),a=e.input.charCodeAt(e.position);continue}const i=e.line;if(H(e,t,3,!1,!0),o.push(e.result),N(e,!0,-1),a=e.input.charCodeAt(e.position),(e.line===i||e.lineIndent>t)&&0!==a)q(e,"bad indentation of a sequence entry");else if(e.lineIndent<t)break}return!!s&&(e.tag=i,e.anchor=r,e.kind="sequence",e.result=o,!0)}function Y(e,t,i){let r,o,s,a;const n=e.tag,c=e.anchor,d={},l=Object.create(null);let h=null,_=null,p=null,u=!1,g=!1;if(-1!==e.firstTabInLine)return!1;null!==e.anchor&&L(e,e.anchor,d);let m=e.input.charCodeAt(e.position);for(;0!==m;){u||-1===e.firstTabInLine||(e.position=e.firstTabInLine,q(e,"tab characters must not be used in indentation"));const v=e.input.charCodeAt(e.position+1),b=e.line;if(63!==m&&58!==m||!y(v)){if(o=e.line,s=e.lineStart,a=e.position,!H(e,i,2,!1,!0))break;if(e.line===b){for(m=e.input.charCodeAt(e.position);f(m);)m=e.input.charCodeAt(++e.position);if(58===m)m=e.input.charCodeAt(++e.position),y(m)||q(e,"a whitespace character is expected after the key-value separator within a block mapping"),u&&(M(e,d,l,h,_,null,o,s,a),h=_=p=null),g=!0,u=!1,r=!1,h=e.tag,_=e.result;else{if(!g)return e.tag=n,e.anchor=c,!0;q(e,"can not read an implicit mapping pair; a colon is missed")}}else{if(!g)return e.tag=n,e.anchor=c,!0;q(e,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else 63===m?(u&&(M(e,d,l,h,_,null,o,s,a),h=_=p=null),g=!0,u=!0,r=!0):u?(u=!1,r=!0):q(e,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),e.position+=1,m=v;if((e.line===b||e.lineIndent>t)&&(u&&(o=e.line,s=e.lineStart,a=e.position),H(e,t,4,!0,r)&&(u?_=e.result:p=e.result),u||(M(e,d,l,h,_,p,o,s,a),h=_=p=null),N(e,!0,-1),m=e.input.charCodeAt(e.position)),(e.line===b||e.lineIndent>t)&&0!==m)q(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return u&&M(e,d,l,h,_,null,o,s,a),g&&(e.tag=n,e.anchor=c,e.kind="mapping",e.result=d),g}function R(e){let t,i,r=!1,o=!1,s=e.input.charCodeAt(e.position);if(33!==s)return!1;null!==e.tag&&q(e,"duplication of a tag property"),s=e.input.charCodeAt(++e.position),60===s?(r=!0,s=e.input.charCodeAt(++e.position)):33===s?(o=!0,t="!!",s=e.input.charCodeAt(++e.position)):t="!";let n=e.position;if(r){do{s=e.input.charCodeAt(++e.position)}while(0!==s&&62!==s);e.position<e.length?(i=e.input.slice(n,e.position),s=e.input.charCodeAt(++e.position)):q(e,"unexpected end of the stream within a verbatim tag")}else{for(;0!==s&&!y(s);)33===s&&(o?q(e,"tag suffix cannot contain exclamation marks"):(t=e.input.slice(n-1,e.position+1),l.test(t)||q(e,"named tag handle cannot contain such characters"),o=!0,n=e.position+1)),s=e.input.charCodeAt(++e.position);i=e.input.slice(n,e.position),d.test(i)&&q(e,"tag suffix cannot contain flow indicator characters")}i&&!h.test(i)&&q(e,"tag name cannot contain such characters: "+i);try{i=decodeURIComponent(i)}catch(t){q(e,"tag name is malformed: "+i)}return r?e.tag=i:a.call(e.tagMap,t)?e.tag=e.tagMap[t]+i:"!"===t?e.tag="!"+i:"!!"===t?e.tag="tag:yaml.org,2002:"+i:q(e,'undeclared tag handle "'+t+'"'),!0}function U(e){let t=e.input.charCodeAt(e.position);if(38!==t)return!1;null!==e.anchor&&q(e,"duplication of an anchor property"),t=e.input.charCodeAt(++e.position);const i=e.position;for(;0!==t&&!y(t)&&!v(t);)t=e.input.charCodeAt(++e.position);return e.position===i&&q(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(i,e.position),!0}function H(e,t,r,o,s){let n,c,d,l,h,_=1,p=!1,u=!1,g=null;e.depth>=e.maxDepth&&q(e,"nesting exceeded maxDepth ("+e.maxDepth+")"),e.depth+=1,null!==e.listener&&e.listener("open",e),e.tag=null,e.anchor=null,e.kind=null,e.result=null;const x=n=c=4===r||3===r;if(o&&N(e,!0,-1)&&(p=!0,e.lineIndent>t?_=1:e.lineIndent===t?_=0:e.lineIndent<t&&(_=-1)),1===_)for(;;){const i=e.input.charCodeAt(e.position),r=D(e);if(p&&(33===i&&null!==e.tag||38===i&&null!==e.anchor))break;if(!R(e)&&!U(e))break;null===g&&(g=r),N(e,!0,-1)?(p=!0,c=x,e.lineIndent>t?_=1:e.lineIndent===t?_=0:e.lineIndent<t&&(_=-1)):c=!1}if(c&&(c=p||s),1===_||4===r)if(l=1===r||2===r?t:t+1,h=e.position-e.lineStart,1===_)if(c&&(B(e,h)||Y(e,h,l))||function(e,t){let i,r,o,s=!0;const a=e.tag;let n;const c=e.anchor;let d,l,h,_;const p=Object.create(null);let u,g,m,f=e.input.charCodeAt(e.position);if(91===f)d=93,_=!1,n=[];else{if(123!==f)return!1;d=125,_=!0,n={}}for(null!==e.anchor&&L(e,e.anchor,n),f=e.input.charCodeAt(++e.position);0!==f;){if(N(e,!0,t),f=e.input.charCodeAt(e.position),f===d)return e.position++,e.tag=a,e.anchor=c,e.kind=_?"mapping":"sequence",e.result=n,!0;s?44===f&&q(e,"expected the node content, but found ','"):q(e,"missed comma between flow collection entries"),g=u=m=null,l=h=!1,63===f&&y(e.input.charCodeAt(e.position+1))&&(l=h=!0,e.position++,N(e,!0,t)),i=e.line,r=e.lineStart,o=e.position,H(e,t,1,!1,!0),g=e.tag,u=e.result,N(e,!0,t),f=e.input.charCodeAt(e.position),!h&&e.line!==i||58!==f||(l=!0,f=e.input.charCodeAt(++e.position),N(e,!0,t),H(e,t,1,!1,!0),m=e.result),_?M(e,n,p,g,u,m,i,r,o):l?n.push(M(e,null,p,g,u,m,i,r,o)):n.push(u),N(e,!0,t),f=e.input.charCodeAt(e.position),44===f?(s=!0,f=e.input.charCodeAt(++e.position)):s=!1}q(e,"unexpected end of the stream within a flow collection")}(e,l))u=!0;else{const t=e.input.charCodeAt(e.position);null!==g&&x&&!c&&124!==t&&62!==t&&function(e,t,i,r){const o=D(e);return function(e){e.anchorMapTransactions.push(Object.create(null))}(e),P(e,t),e.tag=null,e.anchor=null,e.kind=null,e.result=null,Y(e,i,r)&&"mapping"===e.kind?(function(e){const t=e.anchorMapTransactions.pop(),i=e.anchorMapTransactions;if(0===i.length)return;const r=i[i.length-1],o=Object.keys(t);for(let e=0,i=o.length;e<i;e+=1){const i=o[e];a.call(r,i)||(r[i]=t[i])}}(e),!0):(function(e){const t=e.anchorMapTransactions.pop(),i=Object.keys(t);for(let r=i.length-1;r>=0;r-=1){const o=t[i[r]];o.existed?e.anchorMap[i[r]]=o.value:delete e.anchorMap[i[r]]}}(e),P(e,o),!1)}(e,g,g.position-g.lineStart,l)||n&&function(e,t){let r,o,s=1,a=!1,n=!1,c=t,d=0,l=!1,h=e.input.charCodeAt(e.position);if(124===h)r=!1;else{if(62!==h)return!1;r=!0}for(e.kind="scalar",e.result="";0!==h;)if(h=e.input.charCodeAt(++e.position),43===h||45===h)1===s?s=43===h?3:2:q(e,"repeat of a chomping mode identifier");else{if(!((o=k(h))>=0))break;0===o?q(e,"bad explicit indentation width of a block scalar; it cannot be less than one"):n?q(e,"repeat of an indentation width identifier"):(c=t+o-1,n=!0)}if(f(h)){do{h=e.input.charCodeAt(++e.position)}while(f(h));if(35===h)do{h=e.input.charCodeAt(++e.position)}while(!m(h)&&0!==h)}for(;0!==h;){for(z(e),e.lineIndent=0,h=e.input.charCodeAt(e.position);(!n||e.lineIndent<c)&&32===h;)e.lineIndent++,h=e.input.charCodeAt(++e.position);if(!n&&e.lineIndent>c&&(c=e.lineIndent),m(h)){d++;continue}if(n||0!==c||q(e,"missing indentation for block scalar"),e.lineIndent<c){3===s?e.result+=i.repeat("\n",a?1+d:d):1===s&&a&&(e.result+="\n");break}r?f(h)?(l=!0,e.result+=i.repeat("\n",a?1+d:d)):l?(l=!1,e.result+=i.repeat("\n",d+1)):0===d?a&&(e.result+=" "):e.result+=i.repeat("\n",d):e.result+=i.repeat("\n",a?1+d:d),a=!0,n=!0,d=0;const t=e.position;for(;!m(h)&&0!==h;)h=e.input.charCodeAt(++e.position);T(e,t,e.position,!1)}return!0}(e,l)||function(e,t){let i,r,o=e.input.charCodeAt(e.position);if(39!==o)return!1;for(e.kind="scalar",e.result="",e.position++,i=r=e.position;0!==(o=e.input.charCodeAt(e.position));)if(39===o){if(T(e,i,e.position,!0),o=e.input.charCodeAt(++e.position),39!==o)return!0;i=e.position,e.position++,r=e.position}else m(o)?(T(e,i,r,!0),V(e,N(e,!1,t)),i=r=e.position):e.position===e.lineStart&&K(e)?q(e,"unexpected end of the document within a single quoted scalar"):(e.position++,f(o)||(r=e.position));q(e,"unexpected end of the stream within a single quoted scalar")}(e,l)||function(e,t){let i,r,o,s=e.input.charCodeAt(e.position);if(34!==s)return!1;for(e.kind="scalar",e.result="",e.position++,i=r=e.position;0!==(s=e.input.charCodeAt(e.position));){if(34===s)return T(e,i,e.position,!0),e.position++,!0;if(92===s){if(T(e,i,e.position,!0),s=e.input.charCodeAt(++e.position),m(s))N(e,!1,t);else if(s<256&&S[s])e.result+=A[s],e.position++;else if((o=w(s))>0){let t=o,i=0;for(;t>0;t--)s=e.input.charCodeAt(++e.position),(o=b(s))>=0?i=(i<<4)+o:q(e,"expected hexadecimal character");e.result+=$(i),e.position++}else q(e,"unknown escape sequence");i=r=e.position}else m(s)?(T(e,i,r,!0),V(e,N(e,!1,t)),i=r=e.position):e.position===e.lineStart&&K(e)?q(e,"unexpected end of the document within a double quoted scalar"):(e.position++,f(s)||(r=e.position))}q(e,"unexpected end of the stream within a double quoted scalar")}(e,l)?u=!0:function(e){let t=e.input.charCodeAt(e.position);if(42!==t)return!1;t=e.input.charCodeAt(++e.position);const i=e.position;for(;0!==t&&!y(t)&&!v(t);)t=e.input.charCodeAt(++e.position);e.position===i&&q(e,"name of an alias node must contain at least one character");const r=e.input.slice(i,e.position);return a.call(e.anchorMap,r)||q(e,'unidentified alias "'+r+'"'),e.result=e.anchorMap[r],N(e,!0,-1),!0}(e)?(u=!0,null===e.tag&&null===e.anchor||q(e,"alias node should not have any properties")):function(e,t,i){let r,o,s,a,n,c;const d=e.kind,l=e.result;let h=e.input.charCodeAt(e.position);if(y(h)||v(h)||35===h||38===h||42===h||33===h||124===h||62===h||39===h||34===h||37===h||64===h||96===h)return!1;if(63===h||45===h){const t=e.input.charCodeAt(e.position+1);if(y(t)||i&&v(t))return!1}for(e.kind="scalar",e.result="",r=o=e.position,s=!1;0!==h;){if(58===h){const t=e.input.charCodeAt(e.position+1);if(y(t)||i&&v(t))break}else if(35===h){if(y(e.input.charCodeAt(e.position-1)))break}else{if(e.position===e.lineStart&&K(e)||i&&v(h))break;if(m(h)){if(a=e.line,n=e.lineStart,c=e.lineIndent,N(e,!1,-1),e.lineIndent>=t){s=!0,h=e.input.charCodeAt(e.position);continue}e.position=o,e.line=a,e.lineStart=n,e.lineIndent=c;break}}s&&(T(e,r,o,!1),V(e,e.line-a),r=o=e.position,s=!1),f(h)||(o=e.position+1),h=e.input.charCodeAt(++e.position)}return T(e,r,o,!1),!!e.result||(e.kind=d,e.result=l,!1)}(e,l,1===r)&&(u=!0,null===e.tag&&(e.tag="?")),null!==e.anchor&&L(e,e.anchor,e.result)}else 0===_&&(u=c&&B(e,h));if(null===e.tag)null!==e.anchor&&L(e,e.anchor,e.result);else if("?"===e.tag){null!==e.result&&"scalar"!==e.kind&&q(e,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+e.kind+'"');for(let t=0,i=e.implicitTypes.length;t<i;t+=1)if(d=e.implicitTypes[t],d.resolve(e.result)){e.result=d.construct(e.result),e.tag=d.tag,null!==e.anchor&&L(e,e.anchor,e.result);break}}else if("!"!==e.tag){if(a.call(e.typeMap[e.kind||"fallback"],e.tag))d=e.typeMap[e.kind||"fallback"][e.tag];else{d=null;const t=e.typeMap.multi[e.kind||"fallback"];for(let i=0,r=t.length;i<r;i+=1)if(e.tag.slice(0,t[i].tag.length)===t[i].tag){d=t[i];break}}d||q(e,"unknown tag !<"+e.tag+">"),null!==e.result&&d.kind!==e.kind&&q(e,"unacceptable node kind for !<"+e.tag+'> tag; it should be "'+d.kind+'", not "'+e.kind+'"'),d.resolve(e.result,e.tag)?(e.result=d.construct(e.result,e.tag),null!==e.anchor&&L(e,e.anchor,e.result)):q(e,"cannot resolve a node with !<"+e.tag+"> explicit tag")}return null!==e.listener&&e.listener("close",e),e.depth-=1,null!==e.tag||null!==e.anchor||u}function G(e){const t=e.position;let i,r=!1;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap=Object.create(null),e.anchorMap=Object.create(null);0!==(i=e.input.charCodeAt(e.position))&&(N(e,!0,-1),i=e.input.charCodeAt(e.position),!(e.lineIndent>0||37!==i));){r=!0,i=e.input.charCodeAt(++e.position);let t=e.position;for(;0!==i&&!y(i);)i=e.input.charCodeAt(++e.position);const o=e.input.slice(t,e.position),s=[];for(o.length<1&&q(e,"directive name must not be less than one character in length");0!==i;){for(;f(i);)i=e.input.charCodeAt(++e.position);if(35===i){do{i=e.input.charCodeAt(++e.position)}while(0!==i&&!m(i));break}if(m(i))break;for(t=e.position;0!==i&&!y(i);)i=e.input.charCodeAt(++e.position);s.push(e.input.slice(t,e.position))}0!==i&&z(e),a.call(F,o)?F[o](e,o,s):I(e,'unknown document directive "'+o+'"')}N(e,!0,-1),0===e.lineIndent&&45===e.input.charCodeAt(e.position)&&45===e.input.charCodeAt(e.position+1)&&45===e.input.charCodeAt(e.position+2)?(e.position+=3,N(e,!0,-1)):r&&q(e,"directives end mark is expected"),H(e,e.lineIndent-1,4,!1,!0),N(e,!0,-1),e.checkLineBreaks&&c.test(e.input.slice(t,e.position))&&I(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&K(e)?46===e.input.charCodeAt(e.position)&&(e.position+=3,N(e,!0,-1)):e.position<e.length-1&&q(e,"end of the stream or a document separator is expected")}function Z(e,t){t=t||{},0!==(e=String(e)).length&&(10!==e.charCodeAt(e.length-1)&&13!==e.charCodeAt(e.length-1)&&(e+="\n"),65279===e.charCodeAt(0)&&(e=e.slice(1)));const i=new O(e,t),r=e.indexOf("\0");for(-1!==r&&(i.position=r,q(i,"null byte is not allowed in input")),i.input+="\0";32===i.input.charCodeAt(i.position);)i.lineIndent+=1,i.position+=1;for(;i.position<i.length-1;)G(i);return i.documents}t.exports.loadAll=function(e,t,i){null!==t&&"object"==typeof t&&void 0===i&&(i=t,t=null);const r=Z(e,i);if("function"!=typeof t)return r;for(let e=0,i=r.length;e<i;e+=1)t(r[e])},t.exports.load=function(e,t){const i=Z(e,t);if(0!==i.length){if(1===i.length)return i[0];throw new r("expected a single document in the stream, but found more")}}}),F=h((e,t)=>{var i=p(),r=u(),o=j(),s=Object.prototype.toString,a=Object.prototype.hasOwnProperty,n=65279,c={0:"\\0",7:"\\a",8:"\\b",9:"\\t",10:"\\n",11:"\\v",12:"\\f",13:"\\r",27:"\\e",34:'\\"',92:"\\\\",133:"\\N",160:"\\_",8232:"\\L",8233:"\\P"},d=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],l=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function h(e){let t,o;const s=e.toString(16).toUpperCase();if(e<=255)t="x",o=2;else if(e<=65535)t="u",o=4;else{if(!(e<=4294967295))throw new r("code point within a string may not be greater than 0xFFFFFFFF");t="U",o=8}return"\\"+t+i.repeat("0",o-s.length)+s}function _(e){this.schema=e.schema||o,this.indent=Math.max(1,e.indent||2),this.noArrayIndent=e.noArrayIndent||!1,this.skipInvalid=e.skipInvalid||!1,this.flowLevel=i.isNothing(e.flowLevel)?-1:e.flowLevel,this.styleMap=function(e,t){if(null===t)return{};const i={},r=Object.keys(t);for(let o=0,s=r.length;o<s;o+=1){let s=r[o],n=String(t[s]);"!!"===s.slice(0,2)&&(s="tag:yaml.org,2002:"+s.slice(2));const c=e.compiledTypeMap.fallback[s];c&&a.call(c.styleAliases,n)&&(n=c.styleAliases[n]),i[s]=n}return i}(this.schema,e.styles||null),this.sortKeys=e.sortKeys||!1,this.lineWidth=e.lineWidth||80,this.noRefs=e.noRefs||!1,this.noCompatMode=e.noCompatMode||!1,this.condenseFlow=e.condenseFlow||!1,this.quotingType='"'===e.quotingType?2:1,this.forceQuotes=e.forceQuotes||!1,this.replacer="function"==typeof e.replacer?e.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function g(e,t){const r=i.repeat(" ",t);let o=0,s="";const a=e.length;for(;o<a;){let t;const i=e.indexOf("\n",o);-1===i?(t=e.slice(o),o=a):(t=e.slice(o,i+1),o=i+1),t.length&&"\n"!==t&&(s+=r),s+=t}return s}function m(e,t){return"\n"+i.repeat(" ",e.indent*t)}function f(e){return 32===e||9===e}function y(e){return e>=32&&e<=126||e>=161&&e<=55295&&8232!==e&&8233!==e||e>=57344&&e<=65533&&e!==n||e>=65536&&e<=1114111}function v(e){return y(e)&&e!==n&&13!==e&&10!==e}function b(e,t,i){const r=v(e),o=r&&!f(e);return(i?r:r&&44!==e&&91!==e&&93!==e&&123!==e&&125!==e)&&35!==e&&!(58===t&&!o)||v(t)&&!f(t)&&35===e||58===t&&o}function w(e,t){const i=e.charCodeAt(t);let r;return i>=55296&&i<=56319&&t+1<e.length&&(r=e.charCodeAt(t+1),r>=56320&&r<=57343)?1024*(i-55296)+r-56320+65536:i}function k(e){return/^\n* /.test(e)}function x(e,t,i,o,s){e.dump=function(){if(0===t.length)return 2===e.quotingType?'""':"''";if(!e.noCompatMode&&(-1!==d.indexOf(t)||l.test(t)))return 2===e.quotingType?'"'+t+'"':"'"+t+"'";const a=e.indent*Math.max(1,i),_=-1===e.lineWidth?-1:Math.max(Math.min(e.lineWidth,40),e.lineWidth-a),p=o||e.flowLevel>-1&&i>=e.flowLevel;switch(function(e,t,i,r,o,s,a,c){let d,l=0,h=null,_=!1,p=!1;const u=-1!==r;let g=-1,m=y(v=w(e,0))&&v!==n&&!f(v)&&45!==v&&63!==v&&58!==v&&44!==v&&91!==v&&93!==v&&123!==v&&125!==v&&35!==v&&38!==v&&42!==v&&33!==v&&124!==v&&61!==v&&62!==v&&39!==v&&34!==v&&37!==v&&64!==v&&96!==v&&function(e){return!f(e)&&58!==e}(w(e,e.length-1));var v;if(t||a)for(d=0;d<e.length;l>=65536?d+=2:d++){if(l=w(e,d),!y(l))return 5;m=m&&b(l,h,c),h=l}else{for(d=0;d<e.length;l>=65536?d+=2:d++){if(l=w(e,d),10===l)_=!0,u&&(p=p||d-g-1>r&&" "!==e[g+1],g=d);else if(!y(l))return 5;m=m&&b(l,h,c),h=l}p=p||u&&d-g-1>r&&" "!==e[g+1]}return _||p?i>9&&k(e)?5:a?2===s?5:2:p?4:3:!m||a||o(e)?2===s?5:2:1}(t,p,e.indent,_,function(t){return function(e,t){for(let i=0,r=e.implicitTypes.length;i<r;i+=1)if(e.implicitTypes[i].resolve(t))return!0;return!1}(e,t)},e.quotingType,e.forceQuotes&&!o,s)){case 1:return t;case 2:return"'"+t.replace(/'/g,"''")+"'";case 3:return"|"+$(t,e.indent)+C(g(t,a));case 4:return">"+$(t,e.indent)+C(g(function(e,t){const i=/(\n+)([^\n]*)/g;let r,o,s=function(){let r=e.indexOf("\n");return r=-1!==r?r:e.length,i.lastIndex=r,S(e.slice(0,r),t)}(),a="\n"===e[0]||" "===e[0];for(;o=i.exec(e);){const e=o[1],i=o[2];r=" "===i[0],s+=e+(a||r||""===i?"":"\n")+S(i,t),a=r}return s}(t,_),a));case 5:return'"'+function(e){let t="",i=0;for(let r=0;r<e.length;i>=65536?r+=2:r++){i=w(e,r);const o=c[i];!o&&y(i)?(t+=e[r],i>=65536&&(t+=e[r+1])):t+=o||h(i)}return t}(t)+'"';default:throw new r("impossible error: invalid scalar style")}}()}function $(e,t){const i=k(e)?String(t):"",r="\n"===e[e.length-1];return i+(!r||"\n"!==e[e.length-2]&&"\n"!==e?r?"":"-":"+")+"\n"}function C(e){return"\n"===e[e.length-1]?e.slice(0,-1):e}function S(e,t){if(""===e||" "===e[0])return e;const i=/ [^ ]/g;let r,o,s=0,a=0,n=0,c="";for(;r=i.exec(e);)n=r.index,n-s>t&&(o=a>s?a:n,c+="\n"+e.slice(s,o),s=o+1),a=n;return c+="\n",e.length-s>t&&a>s?c+=e.slice(s,a)+"\n"+e.slice(a+1):c+=e.slice(s),c.slice(1)}function A(e,t,i,r){let o="";const s=e.tag;for(let s=0,a=i.length;s<a;s+=1){let a=i[s];e.replacer&&(a=e.replacer.call(i,String(s),a)),(E(e,t+1,a,!0,!0,!1,!0)||void 0===a&&E(e,t+1,null,!0,!0,!1,!0))&&(r&&""===o||(o+=m(e,t)),e.dump&&10===e.dump.charCodeAt(0)?o+="-":o+="- ",o+=e.dump)}e.tag=s,e.dump=o||"[]"}function O(e,t,i){const o=i?e.explicitTypes:e.implicitTypes;for(let n=0,c=o.length;n<c;n+=1){const c=o[n];if((c.instanceOf||c.predicate)&&(!c.instanceOf||"object"==typeof t&&t instanceof c.instanceOf)&&(!c.predicate||c.predicate(t))){if(i?c.multi&&c.representName?e.tag=c.representName(t):e.tag=c.tag:e.tag="?",c.represent){const i=e.styleMap[c.tag]||c.defaultStyle;let o;if("[object Function]"===s.call(c.represent))o=c.represent(t,i);else{if(!a.call(c.represent,i))throw new r("!<"+c.tag+'> tag resolver accepts not "'+i+'" style');o=c.represent[i](t,i)}e.dump=o}return!0}}return!1}function E(e,t,i,o,a,n,c){e.tag=null,e.dump=i,O(e,i,!1)||O(e,i,!0);const d=s.call(e.dump),l=o;o&&(o=e.flowLevel<0||e.flowLevel>t);const h="[object Object]"===d||"[object Array]"===d;let _,p;if(h&&(_=e.duplicates.indexOf(i),p=-1!==_),(null!==e.tag&&"?"!==e.tag||p||2!==e.indent&&t>0)&&(a=!1),p&&e.usedDuplicates[_])e.dump="*ref_"+_;else{if(h&&p&&!e.usedDuplicates[_]&&(e.usedDuplicates[_]=!0),"[object Object]"===d)o&&0!==Object.keys(e.dump).length?(function(e,t,i,o){let s="";const a=e.tag,n=Object.keys(i);if(!0===e.sortKeys)n.sort();else if("function"==typeof e.sortKeys)n.sort(e.sortKeys);else if(e.sortKeys)throw new r("sortKeys must be a boolean or a function");for(let r=0,a=n.length;r<a;r+=1){let a="";o&&""===s||(a+=m(e,t));const c=n[r];let d=i[c];if(e.replacer&&(d=e.replacer.call(i,c,d)),!E(e,t+1,c,!0,!0,!0))continue;const l=null!==e.tag&&"?"!==e.tag||e.dump&&e.dump.length>1024;l&&(e.dump&&10===e.dump.charCodeAt(0)?a+="?":a+="? "),a+=e.dump,l&&(a+=m(e,t)),E(e,t+1,d,!0,l)&&(e.dump&&10===e.dump.charCodeAt(0)?a+=":":a+=": ",a+=e.dump,s+=a)}e.tag=a,e.dump=s||"{}"}(e,t,e.dump,a),p&&(e.dump="&ref_"+_+e.dump)):(function(e,t,i){let r="";const o=e.tag,s=Object.keys(i);for(let o=0,a=s.length;o<a;o+=1){let a="";""!==r&&(a+=", "),e.condenseFlow&&(a+='"');const n=s[o];let c=i[n];e.replacer&&(c=e.replacer.call(i,n,c)),E(e,t,n,!1,!1)&&(e.dump.length>1024&&(a+="? "),a+=e.dump+(e.condenseFlow?'"':"")+":"+(e.condenseFlow?"":" "),E(e,t,c,!1,!1)&&(a+=e.dump,r+=a))}e.tag=o,e.dump="{"+r+"}"}(e,t,e.dump),p&&(e.dump="&ref_"+_+" "+e.dump));else if("[object Array]"===d)o&&0!==e.dump.length?(e.noArrayIndent&&!c&&t>0?A(e,t-1,e.dump,a):A(e,t,e.dump,a),p&&(e.dump="&ref_"+_+e.dump)):(function(e,t,i){let r="";const o=e.tag;for(let o=0,s=i.length;o<s;o+=1){let s=i[o];e.replacer&&(s=e.replacer.call(i,String(o),s)),(E(e,t,s,!1,!1)||void 0===s&&E(e,t,null,!1,!1))&&(""!==r&&(r+=","+(e.condenseFlow?"":" ")),r+=e.dump)}e.tag=o,e.dump="["+r+"]"}(e,t,e.dump),p&&(e.dump="&ref_"+_+" "+e.dump));else{if("[object String]"!==d){if("[object Undefined]"===d)return!1;if(e.skipInvalid)return!1;throw new r("unacceptable kind of an object to dump "+d)}"?"!==e.tag&&x(e,e.dump,t,n,l)}if(null!==e.tag&&"?"!==e.tag){let t=encodeURI("!"===e.tag[0]?e.tag.slice(1):e.tag).replace(/!/g,"%21");t="!"===e.tag[0]?"!"+t:"tag:yaml.org,2002:"===t.slice(0,18)?"!!"+t.slice(18):"!<"+t+">",e.dump=t+" "+e.dump}}return!0}function q(e,t){const i=[],r=[];I(e,i,r);const o=r.length;for(let e=0;e<o;e+=1)t.duplicates.push(i[r[e]]);t.usedDuplicates=new Array(o)}function I(e,t,i){if(null!==e&&"object"==typeof e){const r=t.indexOf(e);if(-1!==r)-1===i.indexOf(r)&&i.push(r);else if(t.push(e),Array.isArray(e))for(let r=0,o=e.length;r<o;r+=1)I(e[r],t,i);else{const r=Object.keys(e);for(let o=0,s=r.length;o<s;o+=1)I(e[r[o]],t,i)}}}t.exports.dump=function(e,t){const i=new _(t=t||{});i.noRefs||q(e,i);let r=e;return i.replacer&&(r=i.replacer.call({"":r},"",r)),E(i,0,r,!0,!0)?i.dump+"\n":""}}),T=_(h((e,t)=>{var i=P(),r=F();function o(e,t){return function(){throw new Error("Function yaml."+e+" is removed in js-yaml 4. Use yaml."+t+" instead, which is now safe by default.")}}t.exports.Type=m(),t.exports.Schema=f(),t.exports.FAILSAFE_SCHEMA=w(),t.exports.JSON_SCHEMA=S(),t.exports.CORE_SCHEMA=A(),t.exports.DEFAULT_SCHEMA=j(),t.exports.load=i.load,t.exports.loadAll=i.loadAll,t.exports.dump=r.dump,t.exports.YAMLException=u(),t.exports.types={binary:q(),float:C(),map:b(),null:k(),pairs:L(),set:D(),timestamp:O(),bool:x(),int:$(),merge:E(),omap:I(),seq:v(),str:y()},t.exports.safeLoad=o("safeLoad","load"),t.exports.safeLoadAll=o("safeLoadAll","loadAll"),t.exports.safeDump=o("safeDump","dump")})(),1),{Type:W,Schema:M,FAILSAFE_SCHEMA:z,JSON_SCHEMA:N,CORE_SCHEMA:K,DEFAULT_SCHEMA:V,load:B,loadAll:Y,dump:R,YAMLException:U,types:H,safeLoad:G,safeLoadAll:Z,safeDump:J}=T.default,Q=T.default,X=i(6217),ee=i(4953),te=i(1113),ie=i(2563);const re=r.AH`
  :host { display: block; }
`;var oe=i(6256),se=i(5374);function ae(e,t,i,r){const o={...e._config.room_visibility||{}},s={entity:o[t]?.entity||"",state:o[t]?.state||"",[i]:r.trim()};s.entity||s.state?o[t]=s:delete o[t];const a={...e._config};Object.keys(o).length>0?a.room_visibility=o:delete a.room_visibility,e._fireConfigChanged(a)}const ne=[{name:"image",selector:{media:{accept:["image/*"],clearable:!0,image_upload:!0,hide_content_type:!0}}}];function ce(e,t){const i={...e._config};("string"==typeof t?""!==t:t)?i.background={...i.background||{},image:t}:delete i.background,e._fireConfigChanged(i)}function de(e,t,i){if(!e._config.background?.image)return;const r={...e._config.background};"opacity"===t?"number"==typeof i&&i<100?r.opacity=i:delete r.opacity:"fixed"===i?r.attachment="fixed":delete r.attachment,e._fireConfigChanged({...e._config,background:r})}const le="dashboard-strategy-editor-expanded-panels";function he(e,t,i){const o=e._expandedPanels.has(t.key);return r.qy`
    <div class="section panel${o?"":" collapsed"}">
      <button
        type="button"
        class="panel-header"
        aria-expanded=${o?"true":"false"}
        @click=${()=>function(e,t){e._expandedPanels.has(t)?e._expandedPanels.delete(t):e._expandedPanels.add(t),function(e){try{window.localStorage.setItem(le,JSON.stringify([...e]))}catch{}}(e._expandedPanels),e.requestUpdate()}(e,t.key)}
      >
        <ha-icon class="panel-icon" icon=${t.icon}></ha-icon>
        <span class="panel-title">${t.label}</span>
        <ha-icon class="panel-chevron" icon="mdi:chevron-down"></ha-icon>
      </button>
      ${o?r.qy`<div class="panel-body">${i()}</div>`:r.s6}
    </div>
  `}const _e={overview:{key:"overview",icon:"mdi:view-dashboard-outline",labelKey:"editor.section_overview"},summaries:{key:"summaries",icon:"mdi:counter",labelKey:"editor.section_summaries"},favorites:{key:"favorites",icon:"mdi:star-outline",labelKey:"editor.section_favorites"},areas:{key:"areas",icon:"mdi:floor-plan",labelKey:"editor.section_areas_rooms"},appearance:{key:"appearance",icon:"mdi:palette-outline",labelKey:"editor.section_overview"},details:{key:"details",icon:"mdi:tune-variant",labelKey:"editor.section_summaries"},areaOptions:{key:"area-options",icon:"mdi:home-cog-outline",labelKey:"editor.section_areas"},roomPins:{key:"room-pins",icon:"mdi:pin-outline",labelKey:"editor.section_room_pins"},views:{key:"views",icon:"mdi:tab",labelKey:"editor.section_views"},advanced:{key:"advanced-options",icon:"mdi:cog-outline",labelKey:"editor.section_advanced_options"},sectionOrder:{key:"section-order",icon:"mdi:sort",labelKey:"editor.section_order"},customContent:{key:"custom-content",icon:"mdi:view-grid-plus-outline",labelKey:"editor.section_custom_content"}};function pe(e){const t=_e[e];return{key:t.key,icon:t.icon,label:(0,ee.k)(t.labelKey)}}var ue=i(245),ge=i(880);function me(e){return(e instanceof Error?e.message.split("\n")[0]:"UngÃ¼ltiges YAML")||"UngÃ¼ltiges YAML"}function fe(e,t){if(!e.trim())return{parsed_config:void 0};try{const i=Q.load(e);return i&&"object"==typeof i?{parsed_config:i}:{parsed_config:void 0,_yaml_error:t}}catch(e){return{parsed_config:void 0,_yaml_error:me(e)}}}const ye=[{type:"tile",name:"Kachel",icon:"mdi:square-rounded",template:'type: tile\nentity: ""\n'},{type:"entities",name:"Entitätsliste",icon:"mdi:format-list-bulleted",template:'type: entities\nentities:\n  - entity: ""\n'},{type:"glance",name:"Glance",icon:"mdi:eye",template:'type: glance\nentities:\n  - entity: ""\n'},{type:"button",name:"Button",icon:"mdi:gesture-tap-button",template:'type: button\nentity: ""\ntap_action:\n  action: toggle\n'},{type:"markdown",name:"Text / Markdown",icon:"mdi:language-markdown",template:'type: markdown\ncontent: "**Text**"\n'},{type:"heading",name:"Überschrift",icon:"mdi:format-header-1",template:'type: heading\nheading: "Überschrift"\nheading_style: title\nicon: mdi:home\n'},{type:"weather-forecast",name:"Wettervorhersage",icon:"mdi:weather-partly-cloudy",template:'type: weather-forecast\nentity: ""\nshow_current: true\nshow_forecast: true\nforecast_type: daily\n'},{type:"gauge",name:"Messanzeige",icon:"mdi:gauge",template:'type: gauge\nentity: ""\nmin: 0\nmax: 100\n'},{type:"thermostat",name:"Thermostat",icon:"mdi:thermostat",template:'type: thermostat\nentity: ""\n'},{type:"media-control",name:"Mediensteuerung",icon:"mdi:play-circle",template:'type: media-control\nentity: ""\n'},{type:"history-graph",name:"Verlaufsgraph",icon:"mdi:chart-line",template:'type: history-graph\nentities:\n  - entity: ""\nhours_to_show: 24\n'},{type:"statistics-graph",name:"Statistikgraph",icon:"mdi:chart-bar",template:'type: statistics-graph\nentities:\n  - entity: ""\nstat_types:\n  - mean\nchart_type: line\nperiod: 5minute\n'},{type:"picture",name:"Bild",icon:"mdi:image",template:'type: picture\nimage: ""\n'},{type:"picture-entity",name:"Entity-Bild",icon:"mdi:image-outline",template:'type: picture-entity\nentity: ""\n'},{type:"map",name:"Karte",icon:"mdi:map",template:'type: map\nentities:\n  - entity: ""\n'},{type:"todo-list",name:"Aufgabenliste",icon:"mdi:checkbox-marked-circle",template:'type: todo-list\nentity: ""\n'},{type:"logbook",name:"Logbuch",icon:"mdi:history",template:'type: logbook\nentity: ""\nhours_to_show: 24\n'},{type:"alarm-panel",name:"Alarmanlage",icon:"mdi:shield-home",template:'type: alarm-panel\nentity: ""\n'},{type:"energy-distribution",name:"Energieverteilung",icon:"mdi:lightning-bolt",template:"type: energy-distribution\n"},{type:"grid",name:"Raster",icon:"mdi:grid",template:"type: grid\ncards: []\n"}];class ve extends r.WF{constructor(){super(...arguments),this._hass=null,this._isUpdatingConfig=!1,this._config={},this._expandedAreas=new Set,this._expandedGroups=new Map,this._expandedWeatherBlocks=new Set,this._favoriteSearch="",this._roomPinSearch="",this._expandedPanels=function(){try{const e=window.localStorage.getItem(le);if(!e)return new Set;const t=JSON.parse(e);if(Array.isArray(t))return new Set(t.filter(e=>"string"==typeof e))}catch{}return new Set}(),this._areaEntitiesCache=new Map,this._entitySelectOptionsCache=null,this._weatherStartAreaOptionsCache=null,this._weatherStartFloorOptionsCache=null,this._sortedAreasCache=null,this._refDashboards=null,this._refDashboardsLoading=!1,this._draggedElement=null,this._sectionDraggedElement=null,this._stackDraggedElement=null,this._weatherStartDraggedElement=null,this._cardPickerOpen=!1,this._cardPickerStep="type",this._cardPickerSearch="",this._cardPickerSelectedType="",this._cardPickerYaml="",this._cardPickerHasVisualEditor=!1,this._cardPickerCallback=null,this._cardPickerConfig=null,this._openCardPickerForWeatherStartCard=()=>{this._openCardPicker(e=>{const t=this._createWeatherStartItemId("card"),i=Q.dump(e).trim(),r=[...this._config.custom_cards||[],{id:t,editor_title:"",yaml:i,parsed_config:e}],o=[...this._getWeatherStartLayoutItems(),{id:`custom-card-${t}`,type:"custom_card",custom_card_id:t}],s={...this._config,custom_cards:r,weather_start_layout_items:o};this._config=s,this._fireConfigChanged(s),this._expandedWeatherBlocks=new Set([...this._expandedWeatherBlocks,`custom-card-${t}`])})},this._handleWeatherStartDragStart=e=>{if(!e.target.closest(".drag-handle"))return void e.preventDefault();const t=e.target.closest(".section-order-item");t?(t.classList.add("dragging"),e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t.dataset.wsId||"")),this._weatherStartDraggedElement=t):e.preventDefault()},this._handleWeatherStartDragEnd=e=>{const t=e.target.closest(".section-order-item");t&&t.classList.remove("dragging");const i=this.shadowRoot?.querySelector("#weather-start-order-list");i&&i.querySelectorAll(".section-order-item").forEach(e=>{e.classList.remove("drag-over")}),this._weatherStartDraggedElement=null},this._handleWeatherStartDragOver=e=>{e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move");const t=e.currentTarget;t!==this._weatherStartDraggedElement&&t.classList.add("drag-over")},this._handleWeatherStartDragLeave=e=>{e.currentTarget.classList.remove("drag-over")},this._handleWeatherStartDrop=e=>{e.stopPropagation(),e.preventDefault();const t=e.currentTarget;if(t.classList.remove("drag-over"),!this._weatherStartDraggedElement||this._weatherStartDraggedElement===t)return;const i=this._weatherStartDraggedElement.dataset.wsId,r=t.dataset.wsId;if(!i||!r)return;const o=this._getWeatherStartLayoutItems(),s=o.findIndex(e=>e.id===i),a=o.findIndex(e=>e.id===r);if(-1===s||-1===a)return;const n=[...o];n.splice(s,1),n.splice(a,0,o[s]),this._saveWeatherStartLayoutItems(n)},this._handleSectionDragStart=e=>{if(!e.target.closest(".drag-handle"))return void e.preventDefault();const t=e.target.closest(".section-order-item");t?(t.classList.add("dragging"),e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t.dataset.sectionKey||"")),this._sectionDraggedElement=t):e.preventDefault()},this._handleSectionDragEnd=e=>{const t=e.target.closest(".section-order-item");t&&t.classList.remove("dragging");const i=this.shadowRoot?.querySelector("#section-order-list");i&&i.querySelectorAll(".section-order-item").forEach(e=>{e.classList.remove("drag-over")}),this._sectionDraggedElement=null},this._handleSectionDragOver=e=>{e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move");const t=e.currentTarget;t!==this._sectionDraggedElement&&t.classList.add("drag-over")},this._handleSectionDragLeave=e=>{e.currentTarget.classList.remove("drag-over")},this._handleSectionDrop=e=>{e.stopPropagation(),e.preventDefault();const t=e.currentTarget;if(t.classList.remove("drag-over"),!this._sectionDraggedElement||this._sectionDraggedElement===t)return;const i=this._sectionDraggedElement.dataset.sectionKey,r=t.dataset.sectionKey;if(!i||!r)return;const o=this._getSectionsOrder(),s=o.indexOf(i),a=o.indexOf(r);if(-1===s||-1===a)return;const n=[...o];n.splice(s,1),n.splice(a,0,i),this._updateSectionsOrder(n)},this._handleStackDragStart=e=>{if(!e.target.closest(".drag-handle"))return void e.preventDefault();const t=e.target.closest(".section-order-item");t?(t.classList.add("dragging"),e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t.dataset.stackKey||"")),this._stackDraggedElement=t):e.preventDefault()},this._handleStackDragEnd=e=>{const t=e.target.closest(".section-order-item");t&&t.classList.remove("dragging"),this.shadowRoot?.querySelectorAll(".section-order-item.drag-over").forEach(e=>e.classList.remove("drag-over")),this._stackDraggedElement=null},this._handleStackDragOver=e=>{e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move");const t=e.currentTarget;t!==this._stackDraggedElement&&t.classList.add("drag-over")},this._handleStackDragLeave=e=>{e.currentTarget.classList.remove("drag-over")},this._handleStackDrop=e=>{e.stopPropagation(),e.preventDefault();const t=e.currentTarget;if(t.classList.remove("drag-over"),!this._stackDraggedElement||this._stackDraggedElement===t)return;const i=this._stackDraggedElement.dataset.stackKey,r=t.dataset.stackKey,o=t.dataset.areaId;if(!i||!r||!o)return;const s=this._getStacksOrder(o),a=s.indexOf(i),n=s.indexOf(r);if(-1===a||-1===n)return;const c=[...s];c.splice(a,1),c.splice(n,0,i),this._updateStacksOrder(o,c)},this._personBadgeLayoutChanged=e=>{const t=e.target.value,i={...this._config};"with_state"===t?delete i.person_badge_layout:i.person_badge_layout=t,this._config=i,this._fireConfigChanged(i)},this._weatherPresentationChanged=e=>{const t=e.target.value,i={...this._config};"forecast_daily"===t?delete i.weather_presentation:i.weather_presentation=t,this._config=i,this._fireConfigChanged(i)},this._powerBadgeEntityChanged=e=>{const t=e.target.value.trim(),i={...this._config};t?i.power_badge_entity=t:delete i.power_badge_entity,this._config=i,this._fireConfigChanged(i)},this._agendaCalendarEntitiesChanged=e=>{const t=this._parseEntityList(e.target.value),i={...this._config};0===t.length?delete i.agenda_calendar_entities:i.agenda_calendar_entities=t,this._config=i,this._fireConfigChanged(i)},this._todosEntitiesChanged=e=>{const t=this._parseEntityList(e.target.value),i={...this._config};0===t.length?delete i.todos_entities:i.todos_entities=t,this._config=i,this._fireConfigChanged(i)},this._weatherSensorsChanged=e=>{const t=this._parseWeatherSensors(e.target.value),i={...this._config};0===t.length?delete i.weather_sensors:i.weather_sensors=t,this._config=i,this._fireConfigChanged(i)},this._addCustomRefView=()=>{const e=[...this._config.custom_views||[]];e.push({title:"",path:"",icon:"",ref_dashboard:"",ref_view:""});const t={...this._config,custom_views:e};this._config=t,this._fireConfigChanged(t),this._loadRefDashboards()},this._handleDragStart=e=>{if(!e.target.closest(".drag-handle"))return void e.preventDefault();const t=e.target.closest(".area-item");t?(t.classList.add("dragging"),e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t.dataset.areaId||"")),this._draggedElement=t):e.preventDefault()},this._handleDragEnd=e=>{const t=e.target.closest(".area-item");t&&t.classList.remove("dragging");const i=this.shadowRoot.querySelector("#area-list");i&&i.querySelectorAll(".area-item").forEach(e=>{e.classList.remove("drag-over")})},this._handleDragOver=e=>{e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move");const t=e.currentTarget;t!==this._draggedElement&&t.classList.add("drag-over")},this._handleDragLeave=e=>{e.currentTarget.classList.remove("drag-over")},this._handleDrop=e=>{e.stopPropagation(),e.preventDefault();const t=e.currentTarget;if(t.classList.remove("drag-over"),!this._draggedElement||this._draggedElement===t)return;const i=this._draggedElement.dataset.areaId,r=t.dataset.areaId;if(!i||!r)return;const o=this._getAreaOrder(),s=o.indexOf(i),a=o.indexOf(r);if(-1===s||-1===a)return;const n=[...o];n.splice(s,1),n.splice(a,0,i),this._updateAreaOrder(n)},this._entityDraggedId=null,this._handleEntityDragStart=(e,t)=>{const i=e.target.closest(".entity-list-item");i?(i.classList.add("dragging"),this._entityDraggedId=i.dataset.entityId||null,e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",this._entityDraggedId||""))):e.preventDefault()},this._handleEntityDragEnd=e=>{const t=e.target.closest(".entity-list-item");t&&t.classList.remove("dragging"),this._entityDraggedId=null},this._handleEntityDragOver=e=>{e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move");const t=e.currentTarget;t.dataset.entityId!==this._entityDraggedId&&t.classList.add("drag-over")},this._handleEntityDragLeave=e=>{e.currentTarget.classList.remove("drag-over")},this._handleEntityDrop=(e,t)=>{e.stopPropagation(),e.preventDefault();const i=e.currentTarget;i.classList.remove("drag-over");const r=this._entityDraggedId,o=i.dataset.entityId;if(!r||!o||r===o)return;const s="favorites"===t?[...this._config.favorite_entities||[]]:[...this._config.room_pin_entities||[]],a=s.indexOf(r),n=s.indexOf(o);if(-1===a||-1===n)return;s.splice(a,1),s.splice(n,0,r);const c="favorites"===t?"favorite_entities":"room_pin_entities",d={...this._config,[c]:s};this._config=d,this._fireConfigChanged(d)},this._openCardPickerForCustomCard=()=>{this._openCardPicker(e=>{const t=Q.dump(e).trim(),i=[...this._config.custom_cards||[]];i.push({editor_title:"",yaml:t,parsed_config:e});const r={...this._config,custom_cards:i};this._config=r,this._fireConfigChanged(r)})},this._handlePickerOverlayClick=e=>{e.target===e.currentTarget&&this._closeCardPicker()}}set hass(e){const t=this._hass;this._hass=e,!t||t.entities===e.entities&&t.devices===e.devices&&t.states===e.states||(this._entitySelectOptionsCache=null),!t||t.areas===e.areas&&t.floors===e.floors||(this._weatherStartAreaOptionsCache=null,this._weatherStartFloorOptionsCache=null,this._sortedAreasCache=null),t||this.requestUpdate()}setConfig(e){this._isUpdatingConfig||(e=(0,ge.l)(e),this._config.areas_display?.hidden===e.areas_display?.hidden&&this._config.areas_display?.order===e.areas_display?.order&&this._config.areas_display?.nav_items===e.areas_display?.nav_items||this._invalidateWeatherStartOptionsCaches(),this._config=e)}_invalidateWeatherStartOptionsCaches(){this._weatherStartAreaOptionsCache=null,this._weatherStartFloorOptionsCache=null}_checkSearchCardDependencies(){const e=void 0!==customElements.get("search-card"),t=void 0!==customElements.get("card-tools");return e&&t}_getAllEntitiesForSelect(){if(!this._hass)return[];if(this._entitySelectOptionsCache&&this._entitySelectOptionsCache.entities===this._hass.entities&&this._entitySelectOptionsCache.devices===this._hass.devices&&this._entitySelectOptionsCache.states===this._hass.states)return this._entitySelectOptionsCache.options;const e=this._hass.entities||{},t=Object.values(this._hass.devices||{}),i=new Map;t.forEach(e=>{e.area_id&&i.set(e.id,e.area_id)});const r=this._hass,o=Object.keys(r.states).map(t=>{const o=r.states[t],s=e[t];let a=s?.area_id;return!a&&s?.device_id&&(a=i.get(s.device_id)??null),{entity_id:t,name:o.attributes?.friendly_name||t.split(".")[1].replace(/_/g," "),area_id:a,device_area_id:a}}).sort((e,t)=>e.name.localeCompare(t.name));return this._entitySelectOptionsCache={entities:this._hass.entities,devices:this._hass.devices,states:this._hass.states,options:o},o}_getAlarmEntities(){return this._hass?Object.keys(this._hass.states).filter(e=>e.startsWith("alarm_control_panel.")).map(e=>{const t=this._hass.states[e];return{entity_id:e,name:t.attributes?.friendly_name||e.split(".")[1].replace(/_/g," ")}}).sort((e,t)=>e.name.localeCompare(t.name)):[]}_getHouseModeEntities(){return this._hass?Object.keys(this._hass.states).filter(e=>e.startsWith("input_select.")||e.startsWith("select.")).filter(e=>{const t=this._hass?.entities[e]?.entity_category;return"config"!==t&&"diagnostic"!==t}).map(e=>({entity_id:e,name:this._hass.states[e].attributes?.friendly_name||e.split(".")[1].replace(/_/g," ")})).sort((e,t)=>e.name.localeCompare(t.name)):[]}_getWeatherEntities(){return this._hass?Object.keys(this._hass.states).filter(e=>e.startsWith("weather.")).map(e=>{const t=this._hass.states[e];return{entity_id:e,name:t.attributes?.friendly_name||e.split(".")[1].replace(/_/g," ")}}).sort((e,t)=>e.name.localeCompare(t.name)):[]}_getEntitiesByDomains(e){if(!this._hass)return[];const t=new Set(e);return Object.keys(this._hass.states).filter(e=>t.has(e.split(".")[0])).map(e=>{const t=this._hass.states[e];return{entity_id:e,name:t.attributes?.friendly_name||e}}).sort((e,t)=>e.name.localeCompare(t.name))}_formatEntityList(e){return(e||[]).join(", ")}_formatWeatherSensors(e){return(e||[]).map(e=>[e.entity,e.icon||"",e.unit||"",e.round??""].join("|")).join("\n")}_parseEntityList(e){return e.split(",").map(e=>e.trim()).filter(Boolean)}_parseWeatherSensors(e){return e.split(/\r?\n/).map(e=>e.trim()).filter(Boolean).map(e=>{const[t,i,r,o]=e.split("|").map(e=>e.trim()),s=void 0===o||""===o?void 0:Number.parseInt(o,10);return{entity:t,...i?{icon:i}:{},...r?{unit:r}:{},...Number.isInteger(s)?{round:s}:{}}}).filter(e=>e.entity.includes("."))}_getThemeNames(){return this._hass?.themes?.themes?Object.keys(this._hass.themes.themes).sort((e,t)=>e.localeCompare(t)):[]}_getSortedAreas(){if(!this._hass)return[];if(this._sortedAreasCache?.areas===this._hass.areas)return this._sortedAreasCache.options;const e=Object.values(this._hass.areas).sort((e,t)=>e.name.localeCompare(t.name));return this._sortedAreasCache={areas:this._hass.areas,options:e},e}_getNormalizedAreasDisplay(e=this._config){return this._hass?(0,ie.KA)(Object.values(this._hass.areas),e.areas_display):e.areas_display}_getFilteredEntities(e,t=!1){if(!this._hass||e.length<2)return[];const i=e.toLowerCase(),r=this._getAllEntitiesForSelect().filter(e=>!(t&&!e.area_id&&!e.device_area_id)&&(e.name.toLowerCase().includes(i)||e.entity_id.toLowerCase().includes(i)));return r.sort((e,t)=>{const r=e.name.toLowerCase(),o=t.name.toLowerCase(),s=e.entity_id.toLowerCase(),a=t.entity_id.toLowerCase(),n=r===i||s===i;if(n!==(o===i||a===i))return n?-1:1;const c=r.startsWith(i)||s.startsWith(i)||s.split(".")[1]?.startsWith(i);return c!==(o.startsWith(i)||a.startsWith(i)||a.split(".")[1]?.startsWith(i))?c?-1:1:r.localeCompare(o)}),r.slice(0,21)}render(){return this._hass?r.qy`
      <div class="card-config">
        ${he(this,pe("overview"),()=>this._renderBasicOverviewSection())}
        ${he(this,pe("summaries"),()=>this._renderBasicSummariesSection())}
        ${he(this,pe("favorites"),()=>this._renderFavoritesSection())}

        <div class="section-divider">
          <div class="section-divider-title">${(0,ee.k)("editor.section_areas_rooms")}</div>
        </div>

        ${he(this,pe("areas"),()=>this._renderAreasListSection())}
        ${he(this,pe("areaOptions"),()=>this._renderAreasSection())}
        ${he(this,pe("roomPins"),()=>this._renderRoomPinsSection())}
        ${he(this,pe("views"),()=>this._renderViewsSection())}

        <div class="section-divider"><div class="section-divider-title">${(0,ee.k)("editor.section_advanced")}</div></div>
        ${he(this,pe("appearance"),()=>this._renderOverviewSection())}
        ${he(this,pe("details"),()=>this._renderSummariesSection())}
        ${he(this,pe("sectionOrder"),()=>this._renderWeatherStartOrderPanel())}
        ${he(this,pe("advanced"),()=>this._renderAdvancedOptionsSection())}
        ${he(this,pe("customContent"),()=>this._renderCustomContentSection())}
      </div>
      ${this._cardPickerOpen?this._renderCardPickerOverlay():r.s6}
    `:r.s6}_renderAdvancedOptionsSection(){const e=!0===this._config.hide_unavailable_entities,t=!0===this._config.dense_section_placement;return r.qy`
      <div class="section">
        <div class="section-title">${(0,ee.k)("editor.section_advanced_options")}</div>

        ${this._renderCheckbox("hide-unavailable-entities",(0,ee.k)("editor.hide_unavailable_entities"),e,e=>this._toggleChanged("hide_unavailable_entities",e,!1))}
        <div class="description">${(0,ee.k)("editor.hide_unavailable_entities_desc")}</div>

        ${this._renderCheckbox("dense-section-placement",(0,ee.k)("editor.dense_section_placement"),t,e=>this._toggleChanged("dense_section_placement",e,!1))}
        <div class="description">${(0,ee.k)("editor.dense_section_placement_desc")}</div>
      </div>
    `}_getSectionsOrder(){return this._config.sections_order||[...X.GC]}_updateSectionsOrder(e){const t={...this._config,sections_order:e};this._config=t,this._fireConfigChanged(t)}_isSectionDisabled(e){switch(e){case"custom_cards":return 0===(this._config.custom_cards||[]).length;case"custom_sections":return 0===(this._config.custom_sections||[]).length;case"weather":return!1===this._config.show_weather;case"energy":return!1===this._config.show_energy;case"plants":return!0!==this._config.show_plants_section;case"agenda":return!0!==this._config.show_agenda_section;case"todos":return!0!==this._config.show_todos_section;case"persons":return!0!==this._config.show_persons_section;case"vacuums":return!0!==this._config.show_vacuums_section;case"maintenance":return!0!==this._config.show_maintenance_section;default:return!1}}_isSectionToggleable(e){return["weather","energy","plants","agenda","todos","persons","vacuums","maintenance"].includes(e)}_toggleSectionVisibility(e,t){"weather"===e?this._toggleChanged("show_weather",t,!0):"energy"===e?this._toggleChanged("show_energy",t,!0):"plants"===e?this._toggleChanged("show_plants_section",t,!1):"agenda"===e?this._toggleChanged("show_agenda_section",t,!1):"todos"===e?this._toggleChanged("show_todos_section",t,!1):"persons"===e?this._toggleChanged("show_persons_section",t,!1):"vacuums"===e?this._toggleChanged("show_vacuums_section",t,!1):"maintenance"===e&&this._toggleChanged("show_maintenance_section",t,!1)}_toggleHiddenHeading(e,t){const i=new Set(this._config.hidden_section_headings||[]);t?i.add(e):i.delete(e);const r={...this._config};0===i.size?delete r.hidden_section_headings:r.hidden_section_headings=[...i],this._config=r,this._fireConfigChanged(r)}_sectionVisibilityChanged(e,t,i){const r={...this._config},o={...r.section_visibility||{}},s={...o[e]||{entity:"",state:""}};s[t]=i.trim(),s.entity||s.state?o[e]=s:delete o[e],0===Object.keys(o).length?delete r.section_visibility:r.section_visibility=o,this._config=r,this._fireConfigChanged(r)}_renderSectionOrderPanel(){const e=this._getSectionsOrder(),t=!1!==this._config.energy_link_dashboard,i=!1!==this._config.show_energy,o=this._config.weather_presentation||"forecast_daily",s=!1!==this._config.show_energy_distribution_card,a=this._config.power_badge_entity||"",n=this._getEntitiesByDomains(["sensor","binary_sensor","number","input_number"]),c=new Set(this._config.hidden_section_headings||[]);return r.qy`
      <div class="section">
        <div class="section-title">${(0,ee.k)("editor.section_order")}</div>
        <div class="description" style="margin-left: 0; margin-bottom: 12px;">
          ${(0,ee.k)("editor.section_order_desc")}
        </div>
        <div class="section-order-list" id="section-order-list">
          ${e.map(e=>{const c=ve._sectionMeta.get(e);if(!c)return r.s6;const d=this._isSectionDisabled(e),l=this._isSectionToggleable(e);return r.qy`
              <div
                class="section-order-item ${d?"disabled":""}"
                data-section-key=${e}
                draggable="true"
                @dragstart=${this._handleSectionDragStart}
                @dragend=${this._handleSectionDragEnd}
                @dragover=${this._handleSectionDragOver}
                @dragleave=${this._handleSectionDragLeave}
                @drop=${this._handleSectionDrop}
              >
                <span class="drag-handle" draggable="true">&#x2630;</span>
                <ha-icon class="section-icon" icon=${c.icon}></ha-icon>
                <span class="section-label">${(0,ee.k)(c.labelKey)}</span>
                ${d&&!l?r.qy`<span class="section-hidden-tag">(${(0,ee.k)("editor.section_hidden")})</span>`:r.s6}
                ${l?r.qy`
                      <label
                        class="section-toggle"
                        @mousedown=${e=>{e.stopPropagation()}}
                      >
                        <input
                          type="checkbox"
                          ?checked=${!d}
                          @change=${t=>{this._toggleSectionVisibility(e,t.target.checked)}}
                          @dragstart=${e=>{e.stopPropagation()}}
                        />
                      </label>
                    `:r.s6}
              </div>
              ${"energy"===e&&i?r.qy`
                    <div class="section-order-sub">
                      <input
                        type="checkbox"
                        id="energy-link-dashboard"
                        ?checked=${t}
                        @change=${e=>{this._toggleChanged("energy_link_dashboard",e.target.checked,!0)}}
                      />
                      <label for="energy-link-dashboard">${(0,ee.k)("editor.energy_link_dashboard")}</label>
                    </div>
                    <div class="section-order-sub">
                      <input
                        type="checkbox"
                        id="show-energy-distribution-card"
                        ?checked=${s}
                        @change=${e=>{this._toggleChanged("show_energy_distribution_card",e.target.checked,!0)}}
                      />
                      <label for="show-energy-distribution-card"
                        >${(0,ee.k)("editor.show_energy_distribution_card")}</label
                      >
                    </div>
                    <div class="section-order-sub">
                      <label for="power-badge-entity" style="min-width: 140px;"
                        >${(0,ee.k)("editor.power_badge_entity")}</label
                      >
                      <select id="power-badge-entity" style="flex: 1;" @change=${this._powerBadgeEntityChanged}>
                        <option value="" ?selected=${!a}>${(0,ee.k)("editor.power_badge_none")}</option>
                        ${n.map(e=>r.qy`
                            <option value=${e.entity_id} ?selected=${e.entity_id===a}>
                              ${e.name}
                            </option>
                          `)}
                      </select>
                    </div>
                    <div class="description">${(0,ee.k)("editor.power_badge_entity_desc")}</div>
                  `:r.s6}
              ${"weather"!==e||d?r.s6:r.qy`
                    <div class="section-order-sub">
                      <label for="weather-presentation" style="min-width: 140px;"
                        >${(0,ee.k)("editor.weather_presentation")}</label
                      >
                      <select id="weather-presentation" style="flex: 1;" @change=${this._weatherPresentationChanged}>
                        <option value="forecast_daily" ?selected=${"forecast_daily"===o}>
                          ${(0,ee.k)("editor.weather_presentation_forecast_daily")}
                        </option>
                        <option value="forecast_hourly" ?selected=${"forecast_hourly"===o}>
                          ${(0,ee.k)("editor.weather_presentation_forecast_hourly")}
                        </option>
                        <option
                          value="forecast_twice_daily"
                          ?selected=${"forecast_twice_daily"===o}
                        >
                          ${(0,ee.k)("editor.weather_presentation_forecast_twice_daily")}
                        </option>
                        <option value="tile" ?selected=${"tile"===o}>
                          ${(0,ee.k)("editor.weather_presentation_tile")}
                        </option>
                        <option value="none" ?selected=${"none"===o}>
                          ${(0,ee.k)("editor.weather_presentation_none")}
                        </option>
                      </select>
                    </div>
                    ${this._renderCheckbox("show-weather-forecast-card",(0,ee.k)("editor.show_weather_forecast_card"),!1!==this._config.show_weather_forecast_card,e=>this._toggleChanged("show_weather_forecast_card",e,!0))}
                    <div class="description">${(0,ee.k)("editor.show_weather_forecast_card_desc")}</div>
                    <div class="form-row" style="align-items: flex-start;">
                      <label for="weather-sensors" style="min-width: 140px; margin-top: 6px;"
                        >${(0,ee.k)("editor.section_weather_sensors")}</label
                      >
                      <textarea
                        id="weather-sensors"
                        rows="4"
                        style="flex: 1;"
                        placeholder="sensor.outside_temperature|mdi:thermometer|°C|1"
                        @change=${this._weatherSensorsChanged}
                      >
${this._formatWeatherSensors(this._config.weather_sensors)}</textarea
                      >
                    </div>
                    <div class="description">${(0,ee.k)("editor.weather_sensors_desc")}</div>
                  `}
              ${"agenda"!==e||d?r.s6:r.qy`
                    <div class="form-row" style="align-items: flex-start;">
                      <label for="agenda-calendar-entities" style="min-width: 140px; margin-top: 6px;"
                        >${(0,ee.k)("editor.agenda_calendar_entities")}</label
                      >
                      <textarea
                        id="agenda-calendar-entities"
                        rows="3"
                        style="flex: 1;"
                        placeholder="calendar.family, calendar.work"
                        @change=${this._agendaCalendarEntitiesChanged}
                      >
${this._formatEntityList(this._config.agenda_calendar_entities)}</textarea
                      >
                    </div>
                    <div class="description">${(0,ee.k)("editor.agenda_calendar_entities_desc")}</div>
                  `}
              ${"todos"!==e||d?r.s6:r.qy`
                    <div class="form-row" style="align-items: flex-start;">
                      <label for="todos-entities" style="min-width: 140px; margin-top: 6px;"
                        >${(0,ee.k)("editor.todos_entities")}</label
                      >
                      <textarea
                        id="todos-entities"
                        rows="3"
                        style="flex: 1;"
                        placeholder="todo.home, todo.shopping"
                        @change=${this._todosEntitiesChanged}
                      >
${this._formatEntityList(this._config.todos_entities)}</textarea
                      >
                    </div>
                    <div class="description">${(0,ee.k)("editor.todos_entities_desc")}</div>
                  `}
            `})}
        </div>
        <details style="margin-top: 12px;">
          <summary style="cursor: pointer; font-weight: 500;">${(0,ee.k)("editor.hidden_section_headings")}</summary>
          <div style="margin-left: 14px; margin-top: 6px;">
            <div class="description" style="margin-left: 0; margin-bottom: 8px;">
              ${(0,ee.k)("editor.hidden_section_headings_desc")}
            </div>
            ${X.WV.map(e=>r.qy`
                <div class="form-row">
                  <input
                    type="checkbox"
                    id=${`hide-heading-${e}`}
                    ?checked=${c.has(e)}
                    @change=${t=>this._toggleHiddenHeading(e,t.target.checked)}
                  />
                  <label for=${`hide-heading-${e}`}>${(0,ee.k)(`sections.${e}`)}</label>
                </div>
              `)}
          </div>
        </details>
        <details style="margin-top: 12px;">
          <summary style="cursor: pointer; font-weight: 500;">${(0,ee.k)("editor.section_visibility")}</summary>
          <div style="margin-left: 14px; margin-top: 6px;">
            <div class="description" style="margin-left: 0; margin-bottom: 8px;">
              ${(0,ee.k)("editor.section_visibility_desc")}
            </div>
            ${e.map(e=>{const t=ve._sectionMeta.get(e);if(!t)return r.s6;const i=this._config.section_visibility?.[e];return r.qy`
                <div
                  style="border: 1px solid var(--divider-color); border-radius: 6px; padding: 8px; margin-bottom: 8px;"
                >
                  <div style="font-weight: 500; margin-bottom: 6px;">${(0,ee.k)(t.labelKey)}</div>
                  <div class="form-row">
                    <label for=${`visibility-entity-${e}`} style="min-width: 80px; font-size: 12px;"
                      >${(0,ee.k)("editor.section_visibility_entity")}</label
                    >
                    <input
                      type="text"
                      id=${`visibility-entity-${e}`}
                      style="flex: 1;"
                      placeholder="input_boolean.guest_mode"
                      .value=${i?.entity||""}
                      @change=${t=>this._sectionVisibilityChanged(e,"entity",t.target.value)}
                    />
                  </div>
                  <div class="form-row">
                    <label for=${`visibility-state-${e}`} style="min-width: 80px; font-size: 12px;"
                      >${(0,ee.k)("editor.section_visibility_state")}</label
                    >
                    <input
                      type="text"
                      id=${`visibility-state-${e}`}
                      style="flex: 1;"
                      placeholder="on"
                      .value=${i?.state||""}
                      @change=${t=>this._sectionVisibilityChanged(e,"state",t.target.value)}
                    />
                  </div>
                </div>
              `})}
          </div>
        </details>
      </div>
    `}_getWeatherStartOrder(){return this._config.weather_start_order||[...X.lg]}_isWeatherStartBlockDisabled(e){switch(e){case"clock":return!1===this._config.show_clock_card;case"weather_current":case"weather_daily":return!1===this._config.show_weather;case"weather_hourly":return!1===this._config.show_weather||"compact_hourly"===this._config.weather_start_weather_mode;case"weather_details":return 0===(this._config.weather_sensors||[]).length&&0===(this._config.pollen_entities||[]).length;case"favorites":return 0===(this._config.favorite_entities||[]).length;case"light_favorites":return 0===(this._config.light_favorite_entities||[]).length;case"alarm":return!this._config.alarm_entity;case"search":return!0!==this._config.show_search_card;case"overview":return!(this._config.custom_cards||[]).some(e=>"overview"===(e.target_section||"custom_cards"));case"energy":return!1===this._config.show_energy;case"plants":return!0!==this._config.show_plants_section;case"agenda":return!0!==this._config.show_agenda_section;case"todos":return!0!==this._config.show_todos_section;case"persons":return!0!==this._config.show_persons_section;case"vacuums":return!0!==this._config.show_vacuums_section;case"maintenance":return!0!==this._config.show_maintenance_section;case"custom_cards":return 0===(this._config.custom_cards||[]).length;case"custom_sections":return 0===(this._config.custom_sections||[]).length;case"summaries":return!1===this._config.show_light_summary&&!1===this._config.show_covers_summary&&!1===this._config.show_security_summary&&!1===this._config.show_battery_summary&&!0!==this._config.show_climate_summary;default:return!1}}_createWeatherStartItemId(e){return`${e}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}_getWeatherStartAreaOptions(){if(!this._hass)return[];const e=this._getNormalizedAreasDisplay(),t=e?.hidden||[],i=e?.order||[],r=t.join("\0"),o=i.join("\0");if(this._weatherStartAreaOptionsCache&&this._weatherStartAreaOptionsCache.areas===this._hass.areas&&this._weatherStartAreaOptionsCache.hiddenKey===r&&this._weatherStartAreaOptionsCache.orderKey===o)return this._weatherStartAreaOptionsCache.options;const s=new Set(t),a=new Map(i.map((e,t)=>[e,t])),n=Object.values(this._hass.areas||{}).filter(e=>!s.has(e.area_id)).sort((e,t)=>{const i=a.get(e.area_id)??-1,r=a.get(t.area_id)??-1;return(i>=0?i:9999)-(r>=0?r:9999)||e.name.localeCompare(t.name)});return this._weatherStartAreaOptionsCache={areas:this._hass.areas,hiddenKey:r,orderKey:o,options:n},n}_getWeatherStartFloorOptions(){if(!this._hass)return[];const e=this._getWeatherStartAreaOptions();if(this._weatherStartFloorOptionsCache&&this._weatherStartFloorOptionsCache.floors===this._hass.floors&&this._weatherStartFloorOptionsCache.areas===e)return this._weatherStartFloorOptionsCache.options;const t=new Set;let i=!1;for(const r of e)r.floor_id?t.add(r.floor_id):i=!0;const r=Object.values(this._hass.floors||{}).filter(e=>t.has(e.floor_id)).sort((e,t)=>(e.level??9999)-(t.level??9999)||e.name.localeCompare(t.name)).map(e=>({floor_id:e.floor_id,name:e.name,icon:e.icon}));return i&&r.push({floor_id:null,name:(0,ee.k)("sections.areas_other"),icon:"mdi:home-outline"}),this._weatherStartFloorOptionsCache={floors:this._hass.floors,areas:e,options:r},r}_getCustomCardRef(e,t){return e.id||`legacy-custom-card-${t}`}_getCustomSectionRef(e,t){return e.id||`legacy-custom-section-${t}`}_getCustomCardEditorLabel(e,t){return e?.editor_title||e?.title||t}_getLegacyWeatherStartLayoutItems(){const e=this._getWeatherStartOrder(),t=[];for(const i of e){const e=this._config.weather_start_blocks_config?.[i];if("areas"===i)if(!0===this._config.group_by_floors)for(const e of this._getWeatherStartFloorOptions())t.push({id:`floor-${e.floor_id||"none"}`,type:"floor",floor_id:e.floor_id,title:e.name});else for(const e of this._getWeatherStartAreaOptions())t.push({id:`area-${e.area_id}`,type:"area",area_id:e.area_id});else"custom_cards"===i?(this._config.custom_cards||[]).forEach((e,i)=>{t.push({id:`custom-card-${this._getCustomCardRef(e,i)}`,type:"custom_card",custom_card_id:this._getCustomCardRef(e,i)})}):"custom_sections"===i?(this._config.custom_sections||[]).forEach((e,i)=>{t.push({id:`custom-section-${this._getCustomSectionRef(e,i)}`,type:"custom_section",custom_section_id:this._getCustomSectionRef(e,i)})}):t.push({id:i,type:i,...e?.yaml?{yaml:e.yaml,parsed_config:e.parsed_config,_yaml_error:e._yaml_error}:{}})}return t}_normalizeWeatherStartLayoutItems(e){const t=this._getWeatherStartAreaOptions(),i=new Set(t.map(e=>e.area_id)),r=new Set,o=[],s=(e,t)=>{i.has(e)&&!r.has(e)&&(r.add(e),o.push({...t||{},id:t?.id||`area-${e}`,type:"area",area_id:e}))},a=e=>{const i=t.filter(t=>e.floor_id?t.floor_id===e.floor_id:!t.floor_id);if(0!==i.length){for(const e of i)r.add(e.area_id);o.push({...e})}};for(const i of e)if("area"!==i.type)if("floor"!==i.type)if("areas"!==i.type)o.push({...i});else if(!0===this._config.group_by_floors)for(const e of this._getWeatherStartFloorOptions())a({id:`floor-${e.floor_id||"none"}`,type:"floor",floor_id:e.floor_id,title:e.name});else for(const e of t)s(e.area_id);else a(i);else i.area_id&&s(i.area_id,i);for(const e of t)s(e.area_id);return o}_getWeatherStartLayoutItems(){const e=this._config.weather_start_layout_items?.length?this._config.weather_start_layout_items.map(e=>({...e})):this._getLegacyWeatherStartLayoutItems();return this._normalizeWeatherStartLayoutItems(e)}_saveWeatherStartLayoutItems(e){const t=this._normalizeWeatherStartLayoutItems(e),i={...this._config,weather_start_layout_items:t};this._config=i,this._fireConfigChanged(i)}_toggleWeatherBlockExpanded(e){const t=new Set(this._expandedWeatherBlocks);t.has(e)?t.delete(e):t.add(e),this._expandedWeatherBlocks=t}_parseWeatherStartItemYaml(e){const t=e.trim();if(!t)return{parsed_config:void 0,_yaml_error:void 0};try{const e=Q.load(t);return Array.isArray(e)||e&&"object"==typeof e?{parsed_config:e}:{parsed_config:void 0,_yaml_error:"YAML must be a card, section, view with sections, or list of cards"}}catch(e){return{parsed_config:void 0,_yaml_error:(e instanceof Error?e.message.split("\n")[0]:"Invalid YAML")||"Invalid YAML"}}}_updateWeatherStartItemYaml(e,t){const i=this._getWeatherStartLayoutItems().map(i=>{if(i.id!==e)return i;const r={...i,yaml:t},o=this._parseWeatherStartItemYaml(t);return r.parsed_config=o.parsed_config,r._yaml_error=o._yaml_error,t.trim()||(delete r.yaml,delete r.parsed_config,delete r._yaml_error),r});if(i.find(t=>t.id===e&&t._yaml_error))return this._config={...this._config,weather_start_layout_items:i},void this.requestUpdate();this._saveWeatherStartLayoutItems(i)}_resetWeatherStartItemYaml(e){const t=this._getWeatherStartLayoutItems().map(t=>{if(t.id!==e)return t;const i={...t};return delete i.yaml,delete i.parsed_config,delete i._yaml_error,i});this._saveWeatherStartLayoutItems(t)}_getWeatherStartCustomCardIndex(e,t=this._config.custom_cards||[]){return"custom_card"!==e.type?-1:t.findIndex((t,i)=>this._getCustomCardRef(t,i)===e.custom_card_id)}_getWeatherStartCustomSectionIndex(e,t=this._config.custom_sections||[]){return"custom_section"!==e.type?-1:t.findIndex((t,i)=>this._getCustomSectionRef(t,i)===e.custom_section_id)}_renderWeatherStartCustomCardEditor(e,t){const i=e._yaml_error?r.qy`<div style="color: var(--error-color); font-size: 12px; margin-top: 4px;">
          &#x274C; ${e._yaml_error}
        </div>`:e.yaml?r.qy`<div style="color: var(--success-color, green); font-size: 12px; margin-top: 4px;">
            &#x2705; ${(0,ee.k)("editor.yaml_valid")}
          </div>`:r.s6;return r.qy`
      <label class="form-row" style="margin: 0 0 8px 0;">
        <span style="min-width: 150px;">${(0,ee.k)("editor.card_editor_title_label")}</span>
        <input
          type="text"
          style="flex: 1;"
          .value=${e.editor_title||""}
          placeholder=${(0,ee.k)("editor.card_editor_title_placeholder")}
          @change=${e=>this._updateCustomCardField(t,"editor_title",e.target.value)}
        />
      </label>
      <div class="description" style="margin: 0 0 8px 0;">${(0,ee.k)("editor.card_editor_title_help")}</div>
      <label class="form-row" style="margin: 0 0 8px 0;">
        <span style="min-width: 150px;">${(0,ee.k)("editor.card_dashboard_title_label")}</span>
        <input
          type="text"
          style="flex: 1;"
          .value=${e.title||""}
          placeholder=${(0,ee.k)("editor.card_title_placeholder")}
          @change=${e=>this._updateCustomCardField(t,"title",e.target.value)}
        />
      </label>
      <div class="description" style="margin: 0 0 6px 0;">${(0,ee.k)("editor.weather_start_card_yaml_desc")}</div>
      <textarea
        rows="8"
        style="width:100%;box-sizing:border-box;font-family:monospace;font-size:12px;resize:vertical;"
        placeholder=${(0,ee.k)("editor.yaml_placeholder")}
        .value=${e.yaml||""}
        @change=${e=>this._updateCustomCardYaml(t,e.target.value)}
      ></textarea>
      <button class="btn-primary" style="margin-top: 6px;" @click=${()=>this._openCardEditorForCustomCard(t)}>
        ${(0,ee.k)("editor.edit_card_with_ha_editor")}
      </button>
      ${i}
    `}_renderWeatherStartCustomSectionEditor(e,t){const i=e.cards||[];return r.qy`
      <div class="custom-item-row" style="margin-bottom: 8px;">
        <input
          type="text"
          .value=${e.title||""}
          placeholder=${(0,ee.k)("editor.custom_section_title_placeholder")}
          style="flex: 2;"
          @change=${e=>this._updateCustomSectionField(t,"title",e.target.value)}
        />
        <input
          type="text"
          .value=${e.icon||""}
          placeholder=${(0,ee.k)("editor.custom_section_icon_placeholder")}
          style="flex: 1;"
          @change=${e=>this._updateCustomSectionField(t,"icon",e.target.value)}
        />
      </div>
      <div class="description" style="margin: 0 0 8px 0;">${(0,ee.k)("editor.weather_start_section_cards_desc")}</div>
      ${0===i.length?r.qy`<div class="empty-state">${(0,ee.k)("editor.no_custom_cards")}</div>`:i.map((e,i)=>{const o=e._yaml_error?r.qy`<span style="color: var(--error-color);">&#x274C; ${e._yaml_error}</span>`:e.yaml?r.qy`<span style="color: var(--success-color, green);"
                    >&#x2705; ${(0,ee.k)("editor.yaml_valid")}</span
                  >`:r.s6;return r.qy`
              <div class="custom-item" style="margin-bottom: 8px;">
                <div class="custom-item-header">
                  <strong
                    >${this._getCustomCardEditorLabel(e,`${(0,ee.k)("editor.new_card")} ${i+1}`)}</strong
                  >
                  <button class="btn-remove" @click=${()=>this._removeCardFromSection(t,i)}>
                    &#x2715;
                  </button>
                </div>
                <div class="custom-item-fields">
                  <label>${(0,ee.k)("editor.card_editor_title_label")}</label>
                  <input
                    type="text"
                    .value=${e.editor_title||""}
                    placeholder=${(0,ee.k)("editor.card_editor_title_placeholder")}
                    @change=${e=>this._updateSectionCardField(t,i,"editor_title",e.target.value)}
                  />
                  <div class="description" style="margin: 0 0 4px 0;">${(0,ee.k)("editor.card_editor_title_help")}</div>
                  <label>${(0,ee.k)("editor.card_dashboard_title_label")}</label>
                  <input
                    type="text"
                    .value=${e.title||""}
                    placeholder=${(0,ee.k)("editor.card_title_placeholder")}
                    @change=${e=>this._updateSectionCardField(t,i,"title",e.target.value)}
                  />
                  <textarea
                    rows="5"
                    placeholder=${(0,ee.k)("editor.yaml_placeholder")}
                    .value=${e.yaml||""}
                    style="width: 100%;"
                    @change=${e=>this._updateSectionCardYaml(t,i,e.target.value)}
                  ></textarea>
                  <button
                    class="btn-primary"
                    style="margin-top: 6px;"
                    @click=${()=>this._openCardEditorForSectionCard(t,i)}
                  >
                    ${(0,ee.k)("editor.edit_card_with_ha_editor")}
                  </button>
                  <div class="custom-item-validation">${o}</div>
                </div>
              </div>
            `})}
      <button class="btn-primary" style="margin-top: 4px;" @click=${()=>this._openCardPickerForSection(t)}>
        ${(0,ee.k)("editor.add_card_to_section")}
      </button>
    `}_removeWeatherStartItem(e){const t=this._getWeatherStartLayoutItems(),i=t.find(t=>t.id===e),r=t.filter(t=>t.id!==e);if(i){if("custom_card"===i.type){const e=[...this._config.custom_cards||[]],t=this._getWeatherStartCustomCardIndex(i,e);t>=0&&e.splice(t,1);const o={...this._config,weather_start_layout_items:r};return e.length>0?o.custom_cards=e:delete o.custom_cards,this._config=o,void this._fireConfigChanged(o)}if("custom_section"===i.type){const e=[...this._config.custom_sections||[]],t=this._getWeatherStartCustomSectionIndex(i,e);t>=0&&e.splice(t,1);const o={...this._config,weather_start_layout_items:r};return e.length>0?o.custom_sections=e:delete o.custom_sections,this._config=o,void this._fireConfigChanged(o)}this._saveWeatherStartLayoutItems(r)}else this._saveWeatherStartLayoutItems(r)}_addWeatherStartSummaries(){const e=this._getWeatherStartLayoutItems();e.some(e=>"summaries"===e.type)||(e.push({id:this._createWeatherStartItemId("summaries"),type:"summaries",summary_size:"mini"}),this._saveWeatherStartLayoutItems(e),this._expandedWeatherBlocks=new Set([...this._expandedWeatherBlocks,e[e.length-1].id]))}_addWeatherStartArea(e){const t=e.target.value;if(!t)return;const i=this._getWeatherStartLayoutItems();i.push({id:this._createWeatherStartItemId(`area-${t}`),type:"area",area_id:t}),this._saveWeatherStartLayoutItems(i),e.target.value=""}_addWeatherStartFloor(e){const t=e.target.value;if(!t)return;const i="__none__"===t?null:t,r=this._getWeatherStartFloorOptions().find(e=>e.floor_id===i),o=this._getWeatherStartLayoutItems();o.push({id:this._createWeatherStartItemId(`floor-${i||"none"}`),type:"floor",floor_id:i,title:r?.name}),this._saveWeatherStartLayoutItems(o),e.target.value=""}_toggleWeatherStartItemStack(e,t){const i=this._getWeatherStartLayoutItems().map(i=>{if(i.id!==e)return i;const r={...i};return t?r.stack_with_previous=!0:delete r.stack_with_previous,r});this._saveWeatherStartLayoutItems(i)}_weatherStartSummarySizeChanged(e,t){const i=this._getWeatherStartLayoutItems().map(i=>i.id!==e?i:{...i,summary_size:t});this._saveWeatherStartLayoutItems(i)}_addWeatherStartSection(){const e=this._createWeatherStartItemId("section"),t=[...this._config.custom_sections||[],{id:e,title:"",icon:"",cards:[]}],i=[...this._getWeatherStartLayoutItems(),{id:`custom-section-${e}`,type:"custom_section",custom_section_id:e}],r={...this._config,custom_sections:t,weather_start_layout_items:i};this._config=r,this._fireConfigChanged(r),this._expandedWeatherBlocks=new Set([...this._expandedWeatherBlocks,`custom-section-${e}`])}_getWeatherStartItemMeta(e,t,i,r){if("area"===e.type){const i=t.find(t=>t.area_id===e.area_id);return{icon:i?.icon||"mdi:home-outline",label:i?.name||e.area_id||(0,ee.k)("sections.areas")}}if("floor"===e.type){const t=this._getWeatherStartFloorOptions().find(t=>t.floor_id===(e.floor_id??null));return{icon:t?.icon||"mdi:floor-plan",label:e.title||t?.name||(0,ee.k)("sections.areas")}}if("custom_card"===e.type){const t=i.find((t,i)=>this._getCustomCardRef(t,i)===e.custom_card_id);return{icon:"mdi:cards",label:this._getCustomCardEditorLabel(t,(0,ee.k)("editor.new_card"))}}if("custom_section"===e.type){const t=r.find((t,i)=>this._getCustomSectionRef(t,i)===e.custom_section_id);return{icon:t?.icon||"mdi:view-grid-plus-outline",label:t?.title||(0,ee.k)("editor.section_custom_sections")}}const o=ve._weatherStartBlockMeta.get(e.type);return{icon:o?.icon||"mdi:view-dashboard-outline",label:o?(0,ee.k)(o.labelKey):e.type}}_isWeatherStartItemDisabled(e,t,i){return!e.parsed_config&&(!!e._yaml_error||("custom_card"===e.type?!t.some((t,i)=>this._getCustomCardRef(t,i)===e.custom_card_id&&t.parsed_config):"custom_section"===e.type?!i.some((t,i)=>this._getCustomSectionRef(t,i)===e.custom_section_id&&(t.cards||[]).some(e=>e.parsed_config)):"floor"===e.type?!this._getWeatherStartAreaOptions().some(t=>e.floor_id?t.floor_id===e.floor_id:!t.floor_id):"summaries"===e.type?this._isWeatherStartBlockDisabled("summaries"):!!ve._weatherStartBlockMeta.has(e.type)&&this._isWeatherStartBlockDisabled(e.type)))}_countNestedFixedGrids(e,t=0){if(!e||"object"!=typeof e)return 0;if(Array.isArray(e))return e.reduce((e,i)=>e+this._countNestedFixedGrids(i,t),0);const i=e;return(t>0&&"grid"===i.type&&"number"==typeof i.columns?1:0)+Object.values(i).reduce((e,i)=>e+this._countNestedFixedGrids(i,t+1),0)}_renderWeatherStartOrderPanel(){const e=this._getWeatherStartLayoutItems(),t=this._getWeatherStartAreaOptions(),i=this._getWeatherStartFloorOptions(),o=this._config.custom_cards||[],s=this._config.custom_sections||[],a=e.some(e=>"summaries"===e.type),n=new Set(e.filter(e=>"area"===e.type&&e.area_id).map(e=>e.area_id));for(const i of e)if("floor"===i.type)for(const e of t)(i.floor_id?e.floor_id!==i.floor_id:e.floor_id)||n.add(e.area_id);const c=t.filter(e=>!n.has(e.area_id));let d=0;const l=e.some(e=>(d=e.stack_with_previous?d+1:0,d>=2));return r.qy`
      <div class="section">
        <div class="section-title">${(0,ee.k)("editor.weather_start_order")}</div>
        <div class="description" style="margin-left: 0; margin-bottom: 12px;">
          ${(0,ee.k)("editor.weather_start_order_desc")}
        </div>
        ${l?r.qy`
              <div style="color:var(--warning-color,#f0a000);font-size:12px;margin:0 0 10px 0;">
                ${(0,ee.k)("editor.weather_start_stack_warning")}
              </div>
            `:r.s6}
        <div class="section-order-list" id="weather-start-order-list">
          ${e.map(e=>{const i=this._getWeatherStartItemMeta(e,t,o,s),a=this._isWeatherStartItemDisabled(e,o,s),n=this._expandedWeatherBlocks.has(e.id),c=!!e.yaml,d="area"!==e.type&&"floor"!==e.type,l=this._getWeatherStartCustomCardIndex(e,o),h=l>=0?o[l]:void 0,_=this._getWeatherStartCustomSectionIndex(e,s),p=_>=0?s[_]:void 0,u=this._countNestedFixedGrids(e.parsed_config);return r.qy`
              <div>
                <div
                  class="section-order-item ${a?"disabled":""}"
                  data-ws-id=${e.id}
                  draggable="true"
                  @dragstart=${this._handleWeatherStartDragStart}
                  @dragend=${this._handleWeatherStartDragEnd}
                  @dragover=${this._handleWeatherStartDragOver}
                  @dragleave=${this._handleWeatherStartDragLeave}
                  @drop=${this._handleWeatherStartDrop}
                >
                  <span class="drag-handle" draggable="true">&#x2630;</span>
                  <ha-icon class="section-icon" icon=${i.icon}></ha-icon>
                  <span class="section-label">${i.label}</span>
                  ${a?r.qy`<span class="section-hidden-tag">(${(0,ee.k)("editor.section_hidden")})</span>`:r.s6}
                  ${c?r.qy`<span
                        class="section-hidden-tag"
                        style="background:var(--primary-color);color:#fff;margin-left:4px;"
                        >✎</span
                      >`:r.s6}
                  <button
                    class="icon-btn"
                    style="margin-left:auto;"
                    title=${(0,ee.k)("editor.weather_start_block_expand")}
                    @click=${t=>{t.stopPropagation(),this._toggleWeatherBlockExpanded(e.id)}}
                  >
                    <ha-icon icon=${n?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
                  </button>
                  ${d?r.qy`
                        <button
                          class="icon-btn"
                          title=${(0,ee.k)("editor.remove")}
                          @click=${t=>{t.stopPropagation(),this._removeWeatherStartItem(e.id)}}
                        >
                          <ha-icon icon="mdi:delete-outline"></ha-icon>
                        </button>
                      `:r.s6}
                </div>
                ${n?r.qy`
                      <div
                        style="padding: 8px 12px 12px 12px; background: var(--secondary-background-color); border-radius: 0 0 8px 8px; margin-bottom: 4px;"
                      >
                        ${h?this._renderWeatherStartCustomCardEditor(h,l):r.s6}
                        ${p?this._renderWeatherStartCustomSectionEditor(p,_):r.s6}
                        ${h||p||"summaries"!==e.type?r.s6:r.qy`
                              <label class="form-row" style="margin: 0 0 8px 0;">
                                <span style="min-width: 120px;">${(0,ee.k)("editor.weather_start_summary_size")}</span>
                                <select
                                  style="flex:1;"
                                  .value=${e.summary_size||"mini"}
                                  @change=${t=>this._weatherStartSummarySizeChanged(e.id,t.target.value)}
                                >
                                  <option value="mini">${(0,ee.k)("editor.weather_start_summary_size_mini")}</option>
                                  <option value="normal">
                                    ${(0,ee.k)("editor.weather_start_summary_size_normal")}
                                  </option>
                                </select>
                              </label>
                            `}
                        ${h||p?r.s6:r.qy`
                              <label class="form-row" style="margin: 0 0 8px 0;">
                                <input
                                  type="checkbox"
                                  ?checked=${!0===e.stack_with_previous}
                                  @change=${t=>this._toggleWeatherStartItemStack(e.id,t.target.checked)}
                                />
                                <span>${(0,ee.k)("editor.weather_start_stack_with_previous")}</span>
                              </label>
                              <div class="description" style="margin: 0 0 6px 0;">
                                ${(0,ee.k)("editor.weather_start_block_yaml_desc")}
                              </div>
                              <textarea
                                rows="6"
                                style="width:100%;box-sizing:border-box;font-family:monospace;font-size:12px;resize:vertical;"
                                placeholder=${(0,ee.k)("editor.yaml_placeholder")}
                                .value=${e.yaml||""}
                                @change=${t=>this._updateWeatherStartItemYaml(e.id,t.target.value)}
                              ></textarea>
                              ${e._yaml_error?r.qy`<div style="color:var(--error-color);font-size:12px;margin-top:4px;">
                                    ${e._yaml_error}
                                  </div>`:r.s6}
                              ${u>0?r.qy`<div style="color:var(--warning-color,#f0a000);font-size:12px;margin-top:4px;">
                                    ${(0,ee.k)("editor.weather_start_responsive_warning").replace("{count}",String(u))}
                                  </div>`:r.s6}
                              ${e.parsed_config?r.qy`<div style="color:var(--success-color,green);font-size:12px;margin-top:4px;">
                                    ${(0,ee.k)("editor.yaml_valid")}
                                  </div>`:r.s6}
                              ${c?r.qy`
                                    <button
                                      class="text-btn"
                                      style="margin-top:8px;"
                                      @click=${()=>this._resetWeatherStartItemYaml(e.id)}
                                    >
                                      ${(0,ee.k)("editor.weather_start_block_reset")}
                                    </button>
                                  `:r.s6}
                            `}
                      </div>
                    `:r.s6}
              </div>
            `})}
        </div>
        <div class="description" style="margin: 12px 0 6px 0;">
          ${(0,ee.k)("editor.weather_start_add_content_desc")}
        </div>
        <div class="custom-item-row weather-start-add-row">
          <button class="btn-primary" @click=${this._openCardPickerForWeatherStartCard}>
            ${(0,ee.k)("editor.weather_start_add_card")}
          </button>
          ${a?r.s6:r.qy`
                <button class="btn-primary" @click=${this._addWeatherStartSummaries}>
                  ${(0,ee.k)("editor.weather_start_add_summaries")}
                </button>
              `}
          <button class="btn-primary" @click=${this._addWeatherStartSection}>
            ${(0,ee.k)("editor.weather_start_add_section")}
          </button>
          <select @change=${this._addWeatherStartArea}>
            <option value="">${(0,ee.k)("editor.weather_start_add_area")}</option>
            ${c.map(e=>r.qy`<option value=${e.area_id}>${e.name}</option>`)}
          </select>
          <select @change=${this._addWeatherStartFloor}>
            <option value="">${(0,ee.k)("editor.weather_start_add_floor")}</option>
            ${i.map(e=>r.qy`<option value=${e.floor_id||"__none__"}>${e.name}</option>`)}
          </select>
        </div>
      </div>
    `}_getStacksOrder(e){return(0,ie.WZ)(this._config.areas_options?.[e]?.stacks_order)}_updateStacksOrder(e,t){const i={...this._config.areas_options?.[e]||{}};t.join("|")===X.xo.join("|")?delete i.stacks_order:i.stacks_order=t;const r={...this._config.areas_options,[e]:i};0===Object.keys(r[e]).length&&delete r[e];const o={...this._config};0===Object.keys(r).length?delete o.areas_options:o.areas_options=r,this._config=o,this._fireConfigChanged(o)}_presentStackKeys(e){const t=e.groupedEntities,i=new Set,r=e=>(t[e]?.length??0)>0;return r("lights")&&i.add("lights"),r("locks")&&i.add("locks"),(r("climate")||r("fan"))&&i.add("climate"),(r("covers")||r("covers_curtain"))&&i.add("covers"),r("covers_window")&&i.add("covers_window"),r("media_player")&&i.add("media"),(r("scenes")||r("automations")||r("scripts"))&&i.add("scenes"),r("switches")&&!0===this._config.show_switches_section_in_rooms&&i.add("switches"),(r("vacuum")||r("switches")&&!0!==this._config.show_switches_section_in_rooms)&&i.add("misc"),r("energy")&&i.add("energy"),i.add("cameras"),i.add("room_pins"),i}_renderStackOrderPanel(e,t){const i=this._getStacksOrder(e),o=this._presentStackKeys(t),s=i.filter(e=>o.has(e)),a=i.filter(e=>!o.has(e));return r.qy`
      <div class="entity-group" data-group="stack_order">
        <div class="entity-group-header">
          <ha-icon icon="mdi:sort"></ha-icon>
          <span class="group-name">${(0,ee.k)("editor.stack_order")}</span>
        </div>
        <div class="entity-list">
          <div class="description" style="margin-left: 0; margin-bottom: 8px;">
            ${(0,ee.k)("editor.stack_order_desc")}
          </div>
          <div class="section-order-list" data-area-id=${e}>
            ${s.map(t=>{const i=ve._stackMeta.get(t);return i?r.qy`
                <div
                  class="section-order-item"
                  data-area-id=${e}
                  data-stack-key=${t}
                  draggable="true"
                  @dragstart=${this._handleStackDragStart}
                  @dragend=${this._handleStackDragEnd}
                  @dragover=${this._handleStackDragOver}
                  @dragleave=${this._handleStackDragLeave}
                  @drop=${this._handleStackDrop}
                >
                  <span class="drag-handle" draggable="true">&#x2630;</span>
                  <ha-icon class="section-icon" icon=${i.icon}></ha-icon>
                  <span class="section-label">${(0,ee.k)(i.labelKey)}</span>
                </div>
              `:r.s6})}
          </div>
          ${a.length>0?r.qy`
                <div class="section-order-compact">
                  <div class="compact-title">${(0,ee.k)("editor.stack_order_inactive")}</div>
                  <div class="compact-chip-list">
                    ${a.map(e=>{const t=ve._stackMeta.get(e);return t?r.qy`
                        <span class="compact-chip">
                          <ha-icon icon=${t.icon}></ha-icon>
                          ${(0,ee.k)(t.labelKey)}
                        </span>
                      `:r.s6})}
                  </div>
                </div>
              `:r.s6}
        </div>
      </div>
    `}_renderBasicOverviewSection(){const e=this._config.weather_entity||"",t=this._getWeatherEntities(),i=this._config.overview_max_columns??3,o=this._config.overview_area_card_columns??"full",s=this._config.weather_start_weather_mode??"full",a=this._config.weather_start_date_card??"button-card";return r.qy`
      <div class="section">
        <div class="section-title">${(0,ee.k)("editor.section_overview")}</div>
        ${function(e){const t=e._config.theme||"",i=e._config.background||{},o=i.image,s="number"==typeof i.opacity?i.opacity:100,a=Object.keys(e._hass?.themes.themes||{}).sort((e,t)=>e.localeCompare(t));return r.qy`
    <div class="form-row">
      <label style="margin-right: 8px; min-width: 120px;">${(0,ee.k)("editor.theme")}</label>
      <select style="flex: 1;" @change=${t=>function(e,t){const i={...e._config};t?i.theme=t:delete i.theme,e._fireConfigChanged(i)}(e,t.target.value.trim())}>
        <option value="" ?selected=${!t}>${(0,ee.k)("editor.theme_default")}</option>
        ${a.map(e=>r.qy`<option value=${e} ?selected=${e===t}>${e}</option>`)}
      </select>
    </div>
    <div class="form-row" style="display: block;">
      ${customElements.get("ha-form")?r.qy`<ha-form
            .hass=${e._hass}
            .data=${{image:o}}
            .schema=${ne}
            .computeLabel=${()=>(0,ee.k)("editor.background_image")}
            @value-changed=${t=>ce(e,t.detail.value.image)}
          ></ha-form>`:r.qy`<label>${(0,ee.k)("editor.background_image")}</label>
            <input type="text" .value=${"string"==typeof o?o:""}
              placeholder="/local/background.jpg"
              @change=${t=>ce(e,t.target.value.trim())} />`}
      <div class="description">${(0,ee.k)("editor.background_image_desc")}</div>
    </div>
    ${o?r.qy`<div class="form-row">
          <label style="margin-right: 8px; min-width: 120px;">${(0,ee.k)("editor.background_opacity")}</label>
          <input type="range" min="10" max="100" step="5" style="flex: 1;" .value=${String(s)}
            @change=${t=>de(e,"opacity",Number(t.target.value))} />
          <span>${s}%</span>
        </div>
        ${e._renderCheckbox("dashboard-background-fixed",(0,ee.k)("editor.background_fixed"),"fixed"===i.attachment,t=>de(e,"attachment",t?"fixed":void 0))}`:r.s6}
  `}(this)}
        <div class="form-row">
          <label for="basic-weather-entity" style="margin-right: 8px; min-width: 120px;"
            >${(0,ee.k)("editor.weather_entity")}</label
          >
          <select id="basic-weather-entity" style="flex: 1;" @change=${this._weatherEntityChanged}>
            <option value="" ?selected=${!e}>${(0,ee.k)("editor.weather_entity_auto")}</option>
            ${t.map(t=>r.qy`
                <option value=${t.entity_id} ?selected=${t.entity_id===e}>
                  ${t.name}
                </option>
              `)}
          </select>
        </div>
        <div class="form-row">
          <label style="margin-right: 8px; min-width: 120px;">${(0,ee.k)("editor.overview_max_columns")}</label>
          <select
            style="flex: 1;"
            @change=${e=>this._simpleOptionChanged("overview_max_columns",Number(e.target.value),3)}
          >
            ${[1,2,3,4].map(e=>r.qy`<option value=${e} ?selected=${i===e}>${e}</option>`)}
          </select>
        </div>
        <div class="form-row">
          <label style="margin-right: 8px; min-width: 120px;">${(0,ee.k)("editor.overview_area_card_columns")}</label>
          <select
            style="flex: 1;"
            @change=${e=>this._simpleOptionChanged("overview_area_card_columns","full"===e.target.value?"full":Number(e.target.value),"full")}
          >
            <option value="full" ?selected=${"full"===o}>${(0,ee.k)("editor.columns_full")}</option>
            <option value="6" ?selected=${6===o}>2</option>
            <option value="4" ?selected=${4===o}>3</option>
          </select>
        </div>
        <div class="form-row">
          <label style="margin-right: 8px; min-width: 120px;">${(0,ee.k)("editor.weather_start_weather_mode")}</label>
          <select
            style="flex: 1;"
            @change=${e=>this._simpleOptionChanged("weather_start_weather_mode",e.target.value,"full")}
          >
            <option value="full" ?selected=${"full"===s}>${(0,ee.k)("editor.weather_mode_full")}</option>
            <option value="compact_hourly" ?selected=${"compact_hourly"===s}>
              ${(0,ee.k)("editor.weather_mode_compact_hourly")}
            </option>
          </select>
        </div>
        <div class="form-row">
          <label style="margin-right: 8px; min-width: 120px;">${(0,ee.k)("editor.weather_start_date_card")}</label>
          <select
            style="flex: 1;"
            @change=${e=>this._simpleOptionChanged("weather_start_date_card",e.target.value,"button-card")}
          >
            <option value="button-card" ?selected=${"button-card"===a}>button-card</option>
            <option value="markdown" ?selected=${"markdown"===a}>
              ${(0,ee.k)("editor.date_card_markdown")}
            </option>
          </select>
        </div>
      </div>
    `}_renderBasicSummariesSection(){return r.qy`
      <div class="section">
        <div class="section-title">${(0,ee.k)("editor.section_summaries")}</div>
        ${this._renderCheckbox("basic-show-light-summary",(0,ee.k)("editor.show_light_summary"),!1!==this._config.show_light_summary,e=>this._toggleChanged("show_light_summary",e,!0))}
        ${this._renderCheckbox("basic-show-covers-summary",(0,ee.k)("editor.show_covers_summary"),!1!==this._config.show_covers_summary,e=>this._toggleChanged("show_covers_summary",e,!0))}
        ${this._renderCheckbox("basic-show-security-summary",(0,ee.k)("editor.show_security_summary"),!1!==this._config.show_security_summary,e=>this._toggleChanged("show_security_summary",e,!0))}
        ${this._renderCheckbox("basic-show-climate-summary",(0,ee.k)("editor.show_climate_summary"),!0===this._config.show_climate_summary,e=>this._toggleChanged("show_climate_summary",e,!1))}
        ${this._renderCheckbox("basic-show-battery-summary",(0,ee.k)("editor.show_battery_summary"),!1!==this._config.show_battery_summary,e=>this._toggleChanged("show_battery_summary",e,!0))}
      </div>
    `}_renderAreasListSection(){const e=this._getSortedAreas(),t=this._getNormalizedAreasDisplay(),i=t?.hidden||[],o=t?.order||[],s=t?.nav_items||[];return r.qy`
      <div class="section">
        <div class="section-title">${(0,ee.k)("editor.section_area_views")}</div>
        <div class="description" style="margin-left: 0;">${(0,ee.k)("editor.area_view_override_intro")}</div>
        <div class="description" style="margin-left: 0;">${(0,ee.k)("editor.area_entity_settings_desc")}</div>
        <div class="area-list" id="area-list">${this._renderAreaItems(e,i,o,s)}</div>
      </div>
    `}_renderOverviewSection(){const e=!1!==this._config.show_clock_card,t=!0===this._config.show_search_card,i=!1!==this._config.show_person_badges,s=this._config.person_badge_layout||"with_state",a=this._checkSearchCardDependencies(),n=this._config.alarm_entity||"",c=this._getAlarmEntities(),d=this._config.house_mode_entity||"",l=this._getHouseModeEntities();return r.qy`
      <div class="section">
        <div class="section-title">${(0,ee.k)("editor.section_overview_details")}</div>

        ${this._renderCheckbox("show-person-badges",(0,ee.k)("editor.show_person_badges"),i,e=>this._toggleChanged("show_person_badges",e,!0))}
        <div class="description">${(0,ee.k)("editor.show_person_badges_desc")}</div>

        <div class="form-row">
          <label for="person-badge-layout" style="margin-right: 8px; min-width: 120px;"
            >${(0,ee.k)("editor.person_badge_layout")}</label
          >
          <select id="person-badge-layout" style="flex: 1;" @change=${this._personBadgeLayoutChanged}>
            <option value="minimal" ?selected=${"minimal"===s}>
              ${(0,ee.k)("editor.person_badge_layout_minimal")}
            </option>
            <option value="with_state" ?selected=${"with_state"===s}>
              ${(0,ee.k)("editor.person_badge_layout_with_state")}
            </option>
            <option value="with_state_and_time" ?selected=${"with_state_and_time"===s}>
              ${(0,ee.k)("editor.person_badge_layout_with_state_and_time")}
            </option>
          </select>
        </div>
        <div class="description">${(0,ee.k)("editor.person_badge_layout_desc")}</div>

        ${this._renderCheckbox("show-unavailable-alert-badge",(0,ee.k)("editor.show_unavailable_alert_badge"),!0===this._config.show_unavailable_alert_badge,e=>this._toggleChanged("show_unavailable_alert_badge",e,!1))}
        <div class="description">${(0,ee.k)("editor.show_unavailable_alert_badge_desc")}</div>

        ${this._renderCheckbox("show-now-playing-badge",(0,ee.k)("editor.show_now_playing_badge"),!0===this._config.show_now_playing_badge,e=>this._toggleChanged("show_now_playing_badge",e,!1))}
        <div class="description">${(0,ee.k)("editor.show_now_playing_badge_desc")}</div>

        ${this._renderCheckbox("show-sun-badge",(0,ee.k)("editor.show_sun_badge"),!0===this._config.show_sun_badge,e=>this._toggleChanged("show_sun_badge",e,!1))}
        <div class="description">${(0,ee.k)("editor.show_sun_badge_desc")}</div>

        ${this._renderCheckbox("show-updates-badge",(0,ee.k)("editor.show_updates_badge"),!0===this._config.show_updates_badge,e=>this._toggleChanged("show_updates_badge",e,!1))}
        <div class="description">${(0,ee.k)("editor.show_updates_badge_desc")}</div>

        ${r.qy`
          ${this._renderCheckbox("show-clock-card",(0,ee.k)("editor.show_clock_card"),e,e=>this._toggleChanged("show_clock_card",e,!0))}
          <div class="description">${(0,ee.k)("editor.show_clock_card_desc")}</div>

          <div class="form-row">
            <label for="alarm-entity" style="margin-right: 8px; min-width: 120px;"
              >${(0,ee.k)("editor.alarm_entity")}</label
            >
            <select id="alarm-entity" style="flex: 1;" @change=${this._alarmEntityChanged}>
              <option value="" ?selected=${!n}>${(0,ee.k)("editor.alarm_none")}</option>
              ${c.map(e=>r.qy`
                  <option value=${e.entity_id} ?selected=${e.entity_id===n}>
                    ${e.name}
                  </option>
                `)}
            </select>
          </div>
          <div class="description">${(0,ee.k)("editor.alarm_desc")}</div>

          <div class="form-row">
            <label for="house-mode-entity" style="margin-right: 8px; min-width: 120px;">
              ${(0,ee.k)("editor.house_mode_entity")}
            </label>
            <select id="house-mode-entity" style="flex: 1;" @change=${this._houseModeEntityChanged}>
              <option value="" ?selected=${!d}>${(0,ee.k)("editor.house_mode_none")}</option>
              ${l.map(e=>r.qy`<option value=${e.entity_id} ?selected=${e.entity_id===d}>
                  ${e.name}
                </option>`)}
            </select>
          </div>
          <div class="description">${(0,ee.k)("editor.house_mode_desc")}</div>

          ${this._renderCheckbox("show-search-card",(0,ee.k)("editor.show_search_card"),t,e=>this._toggleChanged("show_search_card",e,!1),"tip"!==this._config.search_card_variant&&!a)}
          <div class="description">
            ${"tip"===this._config.search_card_variant||a?(0,ee.k)("editor.show_search_card_desc"):r.qy`<span>&#x26A0;&#xFE0F; ${(0,o._)((0,ee.k)("editor.show_search_card_missing"))}</span>`}
          </div>
          ${t?r.qy`
            <div class="form-row">
              <label>${(0,ee.k)("editor.search_card_variant")}</label>
              <select @change=${e=>this._searchCardVariantChanged(e.target.value)}>
                <option value="custom" ?selected=${"tip"!==this._config.search_card_variant}>${(0,ee.k)("editor.search_card_variant_custom")}</option>
                <option value="tip" ?selected=${"tip"===this._config.search_card_variant}>${(0,ee.k)("editor.search_card_variant_tip")}</option>
              </select>
            </div>
          `:r.s6}
        `}
      </div>
    `}_renderSummariesSection(){const e=this._config.summaries_columns||2,t=!0===this._config.group_lights_by_floors,i=!0===this._config.group_covers_by_floors,o=!0===this._config.nested_light_groups,s="name"===this._config.lights_sort_by,a=!0===this._config.show_partially_open_covers,n=!0===this._config.hide_mobile_app_batteries,c=!0===this._config.hide_battery_notes_entities,d=!0===this._config.show_battery_view,l=!0===this._config.show_area_in_battery_view,h=this._config.battery_critical_threshold??20,_=this._config.battery_low_threshold??50,p="critical"===this._config.unavailable_batteries_bucket?"critical":"good",u=this._config.security_extra_entities||[],g=!1!==this._config.show_light_summary,m=!1!==this._config.show_covers_summary,f=!1!==this._config.show_security_summary,y=!1!==this._config.show_battery_summary,v=!0===this._config.show_climate_summary;return r.qy`
      <div class="section">
        <div class="section-title">${(0,ee.k)("editor.section_summary_details")}</div>

        <div class="form-row">
          <input
            type="radio"
            id="summaries-2-columns"
            name="summaries-columns"
            value="2"
            ?checked=${2===e}
            @change=${()=>this._summariesColumnsChanged(2)}
          />
          <label for="summaries-2-columns">${(0,ee.k)("editor.columns_2")}</label>
        </div>
        <div class="form-row">
          <input
            type="radio"
            id="summaries-4-columns"
            name="summaries-columns"
            value="4"
            ?checked=${4===e}
            @change=${()=>this._summariesColumnsChanged(4)}
          />
          <label for="summaries-4-columns">${(0,ee.k)("editor.columns_4")}</label>
        </div>
        <div class="description">${(0,ee.k)("editor.columns_desc")}</div>

        <div class="subsection-title">${(0,ee.k)("editor.security_options")}</div>
        ${f?r.s6:r.qy`${this._renderCheckbox("show-security-view",(0,ee.k)("editor.show_security_view"),!0===this._config.show_security_view,e=>this._toggleChanged("show_security_view",e,!1))}<div class="description">${(0,ee.k)("editor.show_security_view_desc")}</div>`}
        ${this._renderCheckbox("group-security-by-areas",(0,ee.k)("editor.group_security_by_areas"),!0===this._config.group_security_by_areas,e=>this._toggleChanged("group_security_by_areas",e,!1))}
        <div class="description">${(0,ee.k)("editor.group_security_by_areas_desc")}</div>
        ${this._renderCheckbox("hide-hidden-areas-in-security",(0,ee.k)("editor.hide_hidden_areas_in_security"),!0===this._config.hide_hidden_areas_in_security,e=>this._toggleChanged("hide_hidden_areas_in_security",e,!1))}
        <div class="description">${(0,ee.k)("editor.hide_hidden_areas_in_security_desc")}</div>
        ${this._renderCheckbox("show-security-activity",(0,ee.k)("editor.show_security_activity"),!0===this._config.show_security_activity,e=>this._toggleChanged("show_security_activity",e,!1))}
        <div class="description">${(0,ee.k)("editor.show_security_activity_desc")}</div>
        <div class="form-row">
          <label>${(0,ee.k)("editor.security_activity_position")}</label>
          <select @change=${e=>this._securityActivityPositionChanged(e.target.value)}>
            <option value="start" ?selected=${"end"!==this._config.security_activity_position}>${(0,ee.k)("editor.position_start")}</option>
            <option value="end" ?selected=${"end"===this._config.security_activity_position}>${(0,ee.k)("editor.position_end")}</option>
          </select>
        </div>
        <ha-textfield
          .value=${u.join(", ")}
          label=${(0,ee.k)("editor.security_extra_entities")}
          @change=${e=>this._securityExtraEntitiesChanged(e.target.value)}
        ></ha-textfield>

        ${g?r.s6:r.qy`${this._renderCheckbox("show-light-view",(0,ee.k)("editor.show_light_view"),!0===this._config.show_light_view,e=>this._toggleChanged("show_light_view",e,!1))}<div class="description">${(0,ee.k)("editor.show_light_view_desc")}</div>`}

        ${this._renderCheckbox("group-lights-by-floors",(0,ee.k)("editor.group_lights_by_floors"),t,e=>this._toggleChanged("group_lights_by_floors",e,!1))}
        <div class="description">${(0,ee.k)("editor.group_lights_by_floors_desc")}</div>
        ${this._renderCheckbox("group-lights-by-areas",(0,ee.k)("editor.group_lights_by_areas"),!0===this._config.group_lights_by_areas,e=>this._toggleChanged("group_lights_by_areas",e,!1))}
        <div class="description">${(0,ee.k)("editor.group_lights_by_areas_desc")}</div>

        ${m?r.s6:r.qy`${this._renderCheckbox("show-covers-view",(0,ee.k)("editor.show_covers_view"),!0===this._config.show_covers_view,e=>this._toggleChanged("show_covers_view",e,!1))}<div class="description">${(0,ee.k)("editor.show_covers_view_desc")}</div>`}

        ${this._renderCheckbox("group-covers-by-floors",(0,ee.k)("editor.group_covers_by_floors"),i,e=>this._toggleChanged("group_covers_by_floors",e,!1))}
        <div class="description">${(0,ee.k)("editor.group_covers_by_floors_desc")}</div>
        ${this._renderCheckbox("group-covers-by-areas",(0,ee.k)("editor.group_covers_by_areas"),!0===this._config.group_covers_by_areas,e=>this._toggleChanged("group_covers_by_areas",e,!1))}
        <div class="description">${(0,ee.k)("editor.group_covers_by_areas_desc")}</div>

        ${v?r.s6:r.qy`${this._renderCheckbox("show-climate-view",(0,ee.k)("editor.show_climate_view"),!0===this._config.show_climate_view,e=>this._toggleChanged("show_climate_view",e,!1))}<div class="description">${(0,ee.k)("editor.show_climate_view_desc")}</div>`}

        ${this._renderCheckbox("nested-light-groups",(0,ee.k)("editor.nested_light_groups"),o,e=>this._toggleChanged("nested_light_groups",e,!1))}
        <div class="description">${(0,ee.k)("editor.nested_light_groups_desc")}</div>

        ${this._renderCheckbox("lights-sort-by-name",(0,ee.k)("editor.lights_sort_by_name"),s,e=>this._lightsSortByNameChanged(e))}
        <div class="description">${(0,ee.k)("editor.lights_sort_by_name_desc")}</div>

        <div style="margin-left: 26px; margin-bottom: 8px;">
          ${this._renderCheckbox("show-partially-open-covers",(0,ee.k)("editor.show_partially_open_covers"),a,e=>this._toggleChanged("show_partially_open_covers",e,!1))}
          <div class="description">${(0,ee.k)("editor.show_partially_open_covers_desc")}</div>
        </div>

        <div style="margin-left: 26px; margin-bottom: 8px;">
          ${this._renderCheckbox("hide-mobile-app-batteries",(0,ee.k)("editor.hide_mobile_app_batteries"),n,e=>this._toggleChanged("hide_mobile_app_batteries",e,!1))}
          <div class="description">${(0,ee.k)("editor.hide_mobile_app_batteries_desc")}</div>

          ${this._renderCheckbox("hide-battery-notes-entities",(0,ee.k)("editor.hide_battery_notes_entities"),c,e=>this._toggleChanged("hide_battery_notes_entities",e,!1))}
          <div class="description">${(0,ee.k)("editor.hide_battery_notes_entities_desc")}</div>

          ${y?r.s6:r.qy`${this._renderCheckbox("show-battery-view",(0,ee.k)("editor.show_battery_view"),d,e=>this._toggleChanged("show_battery_view",e,!1))}<div class="description">${(0,ee.k)("editor.show_battery_view_desc")}</div>`}

          ${this._renderCheckbox("show-area-in-battery-view",(0,ee.k)("editor.show_area_in_battery_view"),l,e=>this._toggleChanged("show_area_in_battery_view",e,!1))}
          <div class="description">${(0,ee.k)("editor.show_area_in_battery_view_desc")}</div>
          ${this._renderCheckbox("group-batteries-by-areas",(0,ee.k)("editor.group_batteries_by_areas"),!0===this._config.group_batteries_by_areas,e=>this._toggleChanged("group_batteries_by_areas",e,!1))}
          <div class="description">${(0,ee.k)("editor.group_batteries_by_areas_desc")}</div>

          <div
            style="font-size: 13px; font-weight: 500; color: var(--primary-text-color); margin-top: 12px; margin-bottom: 4px;"
          >
            ${(0,ee.k)("editor.battery_thresholds")}
          </div>
          <div class="form-row">
            <label for="battery-critical-threshold" style="min-width: 140px;"
              >${(0,ee.k)("editor.battery_critical_below")}</label
            >
            <input
              type="number"
              id="battery-critical-threshold"
              min="1"
              max="99"
              .value=${String(h)}
              style="width: 70px;"
              @change=${this._batteryCriticalChanged}
            />
            %
          </div>
          <div class="form-row">
            <label for="battery-low-threshold" style="min-width: 140px;">${(0,ee.k)("editor.battery_low_below")}</label>
            <input
              type="number"
              id="battery-low-threshold"
              min="1"
              max="99"
              .value=${String(_)}
              style="width: 70px;"
              @change=${this._batteryLowChanged}
            />
            %
          </div>
          <div class="description">${(0,ee.k)("editor.battery_thresholds_desc")}</div>

          <div
            style="font-size: 13px; font-weight: 500; color: var(--primary-text-color); margin-top: 12px; margin-bottom: 4px;"
          >
            ${(0,ee.k)("editor.unavailable_batteries_bucket")}
          </div>
          <div class="form-row">
            <input
              type="radio"
              id="battery-unavailable-good"
              name="battery-unavailable-bucket"
              value="good"
              ?checked=${"good"===p}
              @change=${()=>this._unavailableBatteriesBucketChanged("good")}
            />
            <label for="battery-unavailable-good">${(0,ee.k)("batteries.good")}</label>
          </div>
          <div class="form-row">
            <input
              type="radio"
              id="battery-unavailable-critical"
              name="battery-unavailable-bucket"
              value="critical"
              ?checked=${"critical"===p}
              @change=${()=>this._unavailableBatteriesBucketChanged("critical")}
            />
            <label for="battery-unavailable-critical">${(0,ee.k)("batteries.critical")}</label>
          </div>
          <div class="description">${(0,ee.k)("editor.unavailable_batteries_bucket_desc")}</div>
        </div>
      </div>
    `}_renderFavoritesSection(){const e=this._config.favorite_entities||[],t=this._getAllEntitiesForSelect(),i=!0===this._config.favorites_show_state,o=!0===this._config.favorites_hide_last_changed,s=new Map(t.map(e=>[e.entity_id,e.name])),a=this._getFilteredEntities(this._favoriteSearch),n=this._config.light_favorite_entities||[];return r.qy`
      <div class="section">
        <div class="section-title">${(0,ee.k)("editor.section_favorites")}</div>

        <div id="favorites-list" style="margin-bottom: 12px;">
          ${0===e.length?r.qy`<div class="empty-state">${(0,ee.k)("editor.no_favorites")}</div>`:r.qy`
                <div class="entity-list-container">
                  ${e.map(e=>{const t=s.get(e)||e;return r.qy`
                      <div
                        class="entity-list-item"
                        data-entity-id=${e}
                        draggable="true"
                        @dragstart=${e=>this._handleEntityDragStart(e,"favorites")}
                        @dragend=${this._handleEntityDragEnd}
                        @dragover=${this._handleEntityDragOver}
                        @dragleave=${this._handleEntityDragLeave}
                        @drop=${e=>this._handleEntityDrop(e,"favorites")}
                      >
                        <span class="drag-icon">&#x2630;</span>
                        <span class="item-info">
                          <span class="item-name">${t}</span>
                          <span class="item-entity-id">${e}</span>
                        </span>
                        <button class="btn-remove" @click=${()=>this._removeFavoriteEntity(e)}>
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
            placeholder=${(0,ee.k)("editor.select_entity")+"..."}
            .value=${this._favoriteSearch}
            @input=${e=>{this._favoriteSearch=e.target.value,this.requestUpdate()}}
            @blur=${()=>{setTimeout(()=>{this._favoriteSearch="",this.requestUpdate()},200)}}
          />
          ${this._favoriteSearch.length>=2?r.qy`
                <div class="entity-search-results">
                  ${a.length>0?a.map(e=>r.qy`
                          <div
                            class="entity-search-result"
                            @mousedown=${t=>{t.preventDefault(),this._addFavoriteEntity(e.entity_id),this._favoriteSearch="",this.requestUpdate()}}
                          >
                            <span class="entity-search-name">${e.name}</span>
                            <span class="entity-search-id">${e.entity_id}</span>
                          </div>
                        `):r.qy`<div class="entity-search-no-results">${(0,ee.k)("editor.no_results")}</div>`}
                </div>
              `:r.s6}
        </div>
        <div class="description">${(0,ee.k)("editor.favorites_desc")}</div>

        ${this._renderCheckbox("favorites-show-state",(0,ee.k)("editor.show_state"),i,e=>this._toggleChanged("favorites_show_state",e,!1))}
        ${this._renderCheckbox("favorites-hide-last-changed",(0,ee.k)("editor.hide_last_changed"),o,e=>this._toggleChanged("favorites_hide_last_changed",e,!1))}
        <div class="subsection-title">${(0,ee.k)("editor.light_favorites")}</div>
        <ha-textfield
          .value=${n.join(", ")}
          label=${(0,ee.k)("editor.light_favorites_entities")}
          helper=${(0,ee.k)("editor.light_favorites_desc")}
          @change=${e=>this._lightFavoritesChanged(e.target.value)}
        ></ha-textfield>
      </div>
    `}_renderAreasSection(){const e=!0===this._config.group_by_floors,t=this._config.area_display_type??"compact",i=!0===this._config.show_switches_on_areas,o=!0===this._config.show_alerts_on_areas,s=!0===this._config.show_locks_in_rooms,a=!0===this._config.show_automations_in_rooms,n=!0===this._config.show_scripts_in_rooms,c=!0===this._config.show_vacuums_section_in_rooms,d=!0===this._config.show_switches_section_in_rooms,l=!0===this._config.camera_live_toggle,h=!0===this._config.show_cover_controls_in_rooms,_=!1!==this._config.show_energy_in_rooms,p=!1!==this._config.show_ups_in_rooms,u=!0===this._config.show_window_contacts_in_rooms,g=!0===this._config.show_door_contacts_in_rooms,m=!0===this._config.use_default_area_sort;return r.qy`
      <div class="section">
        <div class="section-title">${(0,ee.k)("editor.section_areas")}</div>

        <div class="option-groups">
          <div class="option-group">
            <div class="option-group-title">
              <ha-icon icon="mdi:view-dashboard-outline"></ha-icon>
              <span>${(0,ee.k)("editor.area_overview_options")}</span>
            </div>
            ${this._renderCheckbox("group-by-floors",(0,ee.k)("editor.group_by_floors"),e,e=>this._toggleChanged("group_by_floors",e,!1))}
            <div class="description">${(0,ee.k)("editor.group_by_floors_desc")}</div>

            <div class="form-row">
              <label for="area-display-type">${(0,ee.k)("editor.area_display_type")}</label>
              <select
                id="area-display-type"
                .value=${t}
                @change=${e=>this._globalAreaDisplayTypeChanged(e.target.value)}
              >
                <option value="compact">${(0,ee.k)("editor.area_display_type_compact")}</option>
                <option value="picture">${(0,ee.k)("editor.area_display_type_picture")}</option>
              </select>
            </div>
            <div class="description">${(0,ee.k)("editor.area_display_type_desc")}</div>

            ${this._renderCheckbox("show-switches-on-areas",(0,ee.k)("editor.show_switches_on_areas"),i,e=>this._toggleChanged("show_switches_on_areas",e,!1))}
            <div class="description">${(0,ee.k)("editor.show_switches_on_areas_desc")}</div>

            ${this._renderCheckbox("show-alerts-on-areas",(0,ee.k)("editor.show_alerts_on_areas"),o,e=>this._toggleChanged("show_alerts_on_areas",e,!1))}
            <div class="description">${(0,ee.k)("editor.show_alerts_on_areas_desc")}</div>
          </div>

          <div class="option-group">
            <div class="option-group-title">
              <ha-icon icon="mdi:door-open"></ha-icon>
              <span>${(0,ee.k)("editor.room_view_options")}</span>
            </div>
            ${this._renderCheckbox("show-locks-in-rooms",(0,ee.k)("editor.show_locks_in_rooms"),s,e=>this._toggleChanged("show_locks_in_rooms",e,!1))}
            <div class="description">${(0,ee.k)("editor.show_locks_in_rooms_desc")}</div>

            ${this._renderCheckbox("show-automations-in-rooms",(0,ee.k)("editor.show_automations_in_rooms"),a,e=>this._toggleChanged("show_automations_in_rooms",e,!1))}
            <div class="description">${(0,ee.k)("editor.show_automations_in_rooms_desc")}</div>

            ${this._renderCheckbox("show-scripts-in-rooms",(0,ee.k)("editor.show_scripts_in_rooms"),n,e=>this._toggleChanged("show_scripts_in_rooms",e,!1))}
            <div class="description">${(0,ee.k)("editor.show_scripts_in_rooms_desc")}</div>

            ${this._renderCheckbox("show-vacuums-section-in-rooms",(0,ee.k)("editor.show_vacuums_section_in_rooms"),c,e=>this._toggleChanged("show_vacuums_section_in_rooms",e,!1))}
            <div class="description">${(0,ee.k)("editor.show_vacuums_section_in_rooms_desc")}</div>

            ${this._renderCheckbox("show-switches-section-in-rooms",(0,ee.k)("editor.show_switches_section_in_rooms"),d,e=>this._toggleChanged("show_switches_section_in_rooms",e,!1))}
            <div class="description">${(0,ee.k)("editor.show_switches_section_in_rooms_desc")}</div>

            ${this._renderCheckbox("show-cover-controls-in-rooms",(0,ee.k)("editor.show_cover_controls_in_rooms"),h,e=>this._toggleChanged("show_cover_controls_in_rooms",e,!1))}
            <div class="description">${(0,ee.k)("editor.show_cover_controls_in_rooms_desc")}</div>

            ${this._renderCheckbox("camera-live-toggle",(0,ee.k)("editor.camera_live_toggle"),l,e=>this._toggleChanged("camera_live_toggle",e,!1))}
            <div class="description">${(0,ee.k)("editor.camera_live_toggle_desc")}</div>

            ${this._renderCheckbox("show-energy-in-rooms",(0,ee.k)("editor.show_energy_in_rooms"),_,e=>this._toggleChanged("show_energy_in_rooms",e,!0))}
            <div class="description">${(0,ee.k)("editor.show_energy_in_rooms_desc")}</div>

            ${this._renderCheckbox("show-ups-in-rooms",(0,ee.k)("editor.show_ups_in_rooms"),p,e=>this._toggleChanged("show_ups_in_rooms",e,!0))}
            <div class="description">${(0,ee.k)("editor.show_ups_in_rooms_desc")}</div>

            ${this._renderCheckbox("show-window-contacts-in-rooms",(0,ee.k)("editor.show_window_contacts_in_rooms"),u,e=>this._toggleChanged("show_window_contacts_in_rooms",e,!1))}
            <div class="description">${(0,ee.k)("editor.show_window_contacts_in_rooms_desc")}</div>

            ${this._renderCheckbox("show-door-contacts-in-rooms",(0,ee.k)("editor.show_door_contacts_in_rooms"),g,e=>this._toggleChanged("show_door_contacts_in_rooms",e,!1))}
            <div class="description">${(0,ee.k)("editor.show_door_contacts_in_rooms_desc")}</div>
          </div>

          <div class="option-group">
            <div class="option-group-title">
              <ha-icon icon="mdi:sort-alphabetical-ascending"></ha-icon>
              <span>${(0,ee.k)("editor.area_management_options")}</span>
            </div>
            ${this._renderCheckbox("use-default-area-sort",(0,ee.k)("editor.use_default_area_sort"),m,e=>this._toggleChanged("use_default_area_sort",e,!1))}
            <div class="description">${(0,ee.k)("editor.use_default_area_sort_desc")}</div>
          </div>
        </div>
      </div>
    `}_renderRoomPinsSection(){const e=this._config.room_pin_entities||[],t=this._getAllEntitiesForSelect(),i=this._getSortedAreas(),s=!0===this._config.room_pins_show_state,a=!0===this._config.room_pins_hide_last_changed,n=new Map(t.map(e=>[e.entity_id,e])),c=new Map(i.map(e=>[e.area_id,e.name])),d=this._getFilteredEntities(this._roomPinSearch,!0);return r.qy`
      <div class="section">
        <div class="section-title">${(0,ee.k)("editor.section_room_pins")}</div>

        <div id="room-pins-list" style="margin-bottom: 12px;">
          ${0===e.length?r.qy`<div class="empty-state">${(0,ee.k)("editor.no_room_pins")}</div>`:r.qy`
                <div class="entity-list-container">
                  ${e.map(e=>{const t=n.get(e),i=t?.name||e,o=t?.area_id||t?.device_area_id,s=o?c.get(o)||o:(0,ee.k)("editor.no_room");return r.qy`
                      <div
                        class="entity-list-item"
                        data-entity-id=${e}
                        draggable="true"
                        @dragstart=${e=>this._handleEntityDragStart(e,"room_pins")}
                        @dragend=${this._handleEntityDragEnd}
                        @dragover=${this._handleEntityDragOver}
                        @dragleave=${this._handleEntityDragLeave}
                        @drop=${e=>this._handleEntityDrop(e,"room_pins")}
                      >
                        <span class="drag-icon">&#x2630;</span>
                        <span class="item-info">
                          <span class="item-name">${i}</span>
                          <span class="item-entity-id">${e}</span>
                          <span class="item-area">&#x1F4CD; ${s}</span>
                        </span>
                        <button class="btn-remove" @click=${()=>this._removeRoomPinEntity(e)}>&#x2715;</button>
                      </div>
                    `})}
                </div>
              `}
        </div>

        <div class="entity-search-picker">
          <input
            type="text"
            class="entity-search-input"
            placeholder=${(0,ee.k)("editor.select_entity")+"..."}
            .value=${this._roomPinSearch}
            @input=${e=>{this._roomPinSearch=e.target.value,this.requestUpdate()}}
            @blur=${()=>{setTimeout(()=>{this._roomPinSearch="",this.requestUpdate()},200)}}
          />
          ${this._roomPinSearch.length>=2?r.qy`
                <div class="entity-search-results">
                  ${d.length>0?d.map(e=>r.qy`
                          <div
                            class="entity-search-result"
                            @mousedown=${t=>{t.preventDefault(),this._addRoomPinEntity(e.entity_id),this._roomPinSearch="",this.requestUpdate()}}
                          >
                            <span class="entity-search-name">${e.name}</span>
                            <span class="entity-search-id">${e.entity_id}</span>
                          </div>
                        `):r.qy`<div class="entity-search-no-results">${(0,ee.k)("editor.no_results")}</div>`}
                </div>
              `:r.s6}
        </div>
        <div class="description">${(0,o._)((0,ee.k)("editor.room_pins_desc"))}</div>

        ${this._renderCheckbox("room-pins-show-state",(0,ee.k)("editor.show_state"),s,e=>this._toggleChanged("room_pins_show_state",e,!1))}
        ${this._renderCheckbox("room-pins-hide-last-changed",(0,ee.k)("editor.hide_last_changed"),a,e=>this._toggleChanged("room_pins_hide_last_changed",e,!1))}
      </div>
    `}_renderViewsSection(){const e=!0===this._config.show_summary_views,t=!0===this._config.show_room_views,i=!0===this._config.show_cctv_view,o=!0===this._config.cctv_show_activity,s=!0===this._config.show_cameras_in_security,a=!0===this._config.show_maintenance_view,n=!1!==this._config.show_maintenance_activity,c=!1!==this._config.show_video_tips;return r.qy`${function(e){const t=(t,i,o,s=!1)=>r.qy`
    ${e.checkbox(t,(0,ee.k)(`editor.${i}`),o,t=>e.change(i,t,s))}
    <div class="description">${(0,ee.k)(`editor.${i}_desc`)}</div>
  `;return r.qy`<div class="section">
    <div class="section-title">${(0,ee.k)("editor.section_views")}</div>
    ${t("show-summary-views","show_summary_views",e.showSummaryViews)}
    ${t("show-room-views","show_room_views",e.showRoomViews)}
    ${t("show-cctv-view","show_cctv_view",e.showCctvView)}
    ${t("cctv-show-activity","cctv_show_activity",e.cctvShowActivity)}
    ${t("show-cameras-in-security","show_cameras_in_security",e.showCamerasInSecurity)}
    ${t("show-maintenance-view","show_maintenance_view",e.showMaintenanceView)}
    ${t("show-maintenance-activity","show_maintenance_activity",e.showMaintenanceActivity,!0)}
    ${t("show-video-tips","show_video_tips",e.showVideoTips,!0)}
  </div>`}({showSummaryViews:e,showRoomViews:t,showCctvView:i,cctvShowActivity:o,showCamerasInSecurity:s,showMaintenanceView:a,showMaintenanceActivity:n,showVideoTips:c,checkbox:(e,t,i,r)=>this._renderCheckbox(e,t,i,r),change:(e,t,i=!1)=>this._toggleChanged(e,t,i)})}${d=this,d._hass?r.qy`<div class="section">
    <div class="section-title">${(0,ee.k)("editor.room_visibility")}</div>
    <div class="description" style="margin-left: 0;">${(0,ee.k)("editor.room_visibility_desc")}</div>
    ${d._getSortedAreas().map(e=>{const t=d._config.room_visibility?.[e.area_id];return r.qy`<div class="option-group">
        <div class="option-group-title">${e.name}</div>
        <div class="form-row">
          <ha-textfield label=${(0,ee.k)("editor.room_visibility_entity")} .value=${t?.entity||""}
            @change=${t=>ae(d,e.area_id,"entity",t.target.value)}></ha-textfield>
          <ha-textfield label=${(0,ee.k)("editor.room_visibility_state")} .value=${t?.state||""}
            @change=${t=>ae(d,e.area_id,"state",t.target.value)}></ha-textfield>
        </div>
      </div>`})}
  </div>`:r.qy``}${function(e){if(!e._hass)return r.qy``;const t=Object.entries(e._hass.states).filter(([e,t])=>e.startsWith("person.")&&"string"==typeof t.attributes.user_id).map(([e,t])=>({id:t.attributes.user_id,name:String(t.attributes.friendly_name||e)})).sort((e,t)=>e.name.localeCompare(t.name));if(0===t.length)return r.qy``;const i=[["home",(0,ee.k)("views.overview")],...(0,se.v)(e._config,"lights")?[["lights",(0,ee.k)("views.lights")]]:[],...(0,se.v)(e._config,"covers")?[["covers",(0,ee.k)("views.covers")]]:[],...(0,se.v)(e._config,"security")?[["security",(0,ee.k)("views.security")]]:[],...(0,se.v)(e._config,"batteries")?[["batteries",(0,ee.k)("views.batteries")]]:[],...(0,se.v)(e._config,"climate")?[["climate",(0,ee.k)("views.climate")]]:[],...!0===e._config.show_cctv_view?[["cctv",(0,ee.k)("views.cctv")]]:[],...!0===e._config.show_maintenance_view?[["maintenance",(0,ee.k)("views.maintenance")]]:[],...Object.values(e._hass.areas).map(e=>[e.area_id,e.name]),...(e._config.custom_views||[]).filter(e=>(e.parsed_config||e.ref_dashboard&&e.ref_view)&&e.path&&e.title).map(e=>[e.path,e.title])],o=oe.OH.filter(t=>!(0,oe.PM)(t.key,e._config)).map(e=>[e.key,(0,ee.k)(e.labelKey)]);for(const t of e._config.custom_sections||[])t.id&&o.push([t.id,t.title||t.id]);const s=(i,o)=>o.map(([o,s])=>{const a="view"===i?e._config.view_visible_users:e._config.section_visible_users,n=Object.prototype.hasOwnProperty.call(a||{},o)?a?.[o]||[]:t.map(e=>e.id);return r.qy`<div class="option-group"><div class="option-group-title">${s}</div>${t.map(r=>e._renderCheckbox(`${i}-${o}-${r.id}`,r.name,n.includes(r.id),s=>function(e,t,i,r,o,s){const a={...("view"===t?e._config.view_visible_users:e._config.section_visible_users)||{}},n=new Set(Object.prototype.hasOwnProperty.call(a,i)?a[i]:o);s?n.add(r):n.delete(r),o.every(e=>n.has(e))&&[...n].every(e=>o.includes(e))?delete a[i]:a[i]=[...n];const c={...e._config};"view"===t?Object.keys(a).length?c.view_visible_users=a:delete c.view_visible_users:Object.keys(a).length?c.section_visible_users=a:delete c.section_visible_users,e._fireConfigChanged(c)}(e,i,o,r.id,t.map(e=>e.id),s)))}</div>`});return r.qy`<div class="section"><div class="section-title">${(0,ee.k)("editor.user_visibility")}</div>
    <div class="description" style="margin-left: 0;">${(0,ee.k)("editor.user_visibility_warning")}</div>
    <div class="description" style="margin-left: 0; color: var(--warning-color, #ffa600);">
      ${(0,ee.k)("editor.user_visibility_no_person_warning")}
    </div>
    <div class="option-group-title">${(0,ee.k)("editor.user_visibility_views")}</div>${s("view",i)}
    <div class="option-group-title">${(0,ee.k)("editor.user_visibility_sections")}</div>${s("section",o)}
  </div>`}(this)}`;var d}_renderRoomVisibilityRules(){return this._hass?r.qy`<div class="section">
      <div class="section-title">${(0,ee.k)("editor.room_visibility")}</div>
      <div class="description" style="margin-left: 0;">${(0,ee.k)("editor.room_visibility_desc")}</div>
      ${this._getSortedAreas().map(e=>{const t=this._config.room_visibility?.[e.area_id];return r.qy`<div class="option-group">
          <div class="option-group-title">${e.name}</div>
          <div class="form-row">
            <ha-textfield label=${(0,ee.k)("editor.room_visibility_entity")} .value=${t?.entity||""}
              @change=${t=>this._roomVisibilityChanged(e.area_id,"entity",t.target.value)}></ha-textfield>
            <ha-textfield label=${(0,ee.k)("editor.room_visibility_state")} .value=${t?.state||""}
              @change=${t=>this._roomVisibilityChanged(e.area_id,"state",t.target.value)}></ha-textfield>
          </div>
        </div>`})}
    </div>`:r.qy``}_roomVisibilityChanged(e,t,i){const r={...this._config.room_visibility||{}},o={entity:r[e]?.entity||"",state:r[e]?.state||"",[t]:i.trim()};o.entity||o.state?r[e]=o:delete r[e];const s={...this._config};Object.keys(r).length>0?s.room_visibility=r:delete s.room_visibility,this._fireConfigChanged(s)}_renderUserVisibilityRules(){if(!this._hass)return r.qy``;const e=Object.entries(this._hass.states).filter(([e,t])=>e.startsWith("person.")&&"string"==typeof t.attributes.user_id).map(([e,t])=>({id:t.attributes.user_id,name:String(t.attributes.friendly_name||e)})).sort((e,t)=>e.name.localeCompare(t.name));if(0===e.length)return r.qy``;const t=[["home",(0,ee.k)("views.overview")],["lights",(0,ee.k)("views.lights")],["covers",(0,ee.k)("views.covers")],["security",(0,ee.k)("views.security")],["batteries",(0,ee.k)("views.batteries")],["climate",(0,ee.k)("views.climate")],["cctv",(0,ee.k)("views.cctv")],["maintenance",(0,ee.k)("views.maintenance")],...Object.values(this._hass.areas).map(e=>[e.area_id,e.name]),...(this._config.custom_views||[]).filter(e=>e.path&&e.title).map(e=>[e.path,e.title])],i=X.lg.map(e=>[e,(0,ee.k)(`weather_start_blocks.${e}`)]),o=(t,i)=>i.map(([i,o])=>{const s="view"===t?this._config.view_visible_users:this._config.section_visible_users,a=Object.prototype.hasOwnProperty.call(s||{},i)?s?.[i]||[]:e.map(e=>e.id);return r.qy`<div class="option-group"><div class="option-group-title">${o}</div>${e.map(r=>this._renderCheckbox(`${t}-${i}-${r.id}`,r.name,a.includes(r.id),o=>this._userVisibilityChanged(t,i,r.id,e.map(e=>e.id),o)))}</div>`});return r.qy`<div class="section"><div class="section-title">${(0,ee.k)("editor.user_visibility")}</div>
      <div class="description" style="margin-left: 0;">${(0,ee.k)("editor.user_visibility_warning")}</div>
      <div class="option-group-title">${(0,ee.k)("editor.user_visibility_views")}</div>${o("view",t)}
      <div class="option-group-title">${(0,ee.k)("editor.user_visibility_sections")}</div>${o("section",i)}
    </div>`}_userVisibilityChanged(e,t,i,r,o){const s={...("view"===e?this._config.view_visible_users:this._config.section_visible_users)||{}},a=new Set(Object.prototype.hasOwnProperty.call(s,t)?s[t]:r);o?a.add(i):a.delete(i),r.every(e=>a.has(e))&&[...a].every(e=>r.includes(e))?delete s[t]:s[t]=[...a];const n={...this._config};"view"===e?Object.keys(s).length?n.view_visible_users=s:delete n.view_visible_users:Object.keys(s).length?n.section_visible_users=s:delete n.section_visible_users,this._fireConfigChanged(n)}_renderCustomContentSection(){return r.qy`
      <div class="section">
        <div class="section-title">${(0,ee.k)("editor.section_custom_content")}</div>
        <div class="description" style="margin-left: 0; margin-bottom: 12px;">
          ${(0,ee.k)("editor.section_custom_content_desc")}
        </div>
        ${r.qy`
              <div class="empty-state" style="margin-bottom: 12px;">
                ${(0,ee.k)("editor.custom_content_weather_start_hint")}
              </div>
            `}
        <div class="custom-content-grid">
          ${r.s6}
          ${r.s6} ${this._renderCustomBadgesSection(!0)}
          ${this._renderCustomViewsSection(!0)}
        </div>
      </div>
    `}_renderCustomCardsSection(e=!1){const t=this._config.custom_cards||[],i=this._config.custom_cards_heading||"",o=this._config.custom_cards_icon||"";return r.qy`
      <div class=${e?"editor-subsection":"section"}>
        <div
          class=${e?"subsection-title":"section-title"}
          style="display: flex; align-items: center; gap: 8px;"
        >
          ${(0,ee.k)("editor.section_custom_cards")}
          <a
            href="https://github.com/Cyberhunter88/dashboard-strategy/blob/main/assets/Eigene-Karten-hinzufugen.gif"
            target="_blank"
            rel="noopener"
            style="color: var(--primary-color); text-decoration: none; font-size: 18px;"
            title=${(0,ee.k)("editor.video_tutorial")}
            >&#x1F3AC;</a
          >
        </div>
        <div class="custom-item-row" style="margin-bottom: 12px;">
          <input
            type="text"
            id="custom-cards-heading"
            .value=${i}
            placeholder=${(0,ee.k)("editor.custom_cards_heading_placeholder")}
            style="flex: 2;"
            @change=${this._customCardsHeadingChanged}
          />
          <input
            type="text"
            id="custom-cards-icon"
            .value=${o}
            placeholder="mdi:cards"
            style="flex: 1;"
            @change=${this._customCardsIconChanged}
          />
        </div>
        <div class="description" style="margin-bottom: 8px;">${(0,ee.k)("editor.custom_cards_desc")}</div>

        <div id="custom-cards-list">
          ${0===t.length?r.qy`<div class="empty-state">${(0,ee.k)("editor.no_custom_cards")}</div>`:t.map((e,t)=>this._renderCustomCardItem(e,t))}
        </div>

        <button class="btn-primary" style="margin-top: 8px;" @click=${this._openCardPickerForCustomCard}>
          ${(0,ee.k)("editor.add_custom_card")}
        </button>
        <div class="description">${(0,ee.k)("editor.custom_cards_help")}</div>
      </div>
    `}_renderCustomSectionsSection(e=!1){const t=this._config.custom_sections||[];return r.qy`
      <div class=${e?"editor-subsection":"section"}>
        <div class=${e?"subsection-title":"section-title"}>${(0,ee.k)("editor.section_custom_sections")}</div>
        <div class="description" style="margin-bottom: 8px;">${(0,ee.k)("editor.custom_sections_help")}</div>

        <div id="custom-sections-list">
          ${0===t.length?r.qy`<div class="empty-state">${(0,ee.k)("editor.no_custom_sections")}</div>`:t.map((e,t)=>this._renderCustomSectionItem(e,t))}
        </div>

        <button class="btn-primary" style="margin-top: 8px;" @click=${this._addCustomSection}>
          ${(0,ee.k)("editor.add_custom_section")}
        </button>
      </div>
    `}_renderCustomBadgesSection(e=!1){const t=this._config.custom_badges||[];return r.qy`
      <div class=${e?"editor-subsection":"section"}>
        <div
          class=${e?"subsection-title":"section-title"}
          style="display: flex; align-items: center; gap: 8px;"
        >
          ${(0,ee.k)("editor.section_custom_badges")}
          <a
            href="https://github.com/Cyberhunter88/dashboard-strategy/blob/main/assets/Custom-Badges-hinzufugen.gif"
            target="_blank"
            rel="noopener"
            style="color: var(--primary-color); text-decoration: none; font-size: 18px;"
            title=${(0,ee.k)("editor.video_tutorial")}
            >&#x1F3AC;</a
          >
        </div>

        <div id="custom-badges-list">
          ${0===t.length?r.qy`<div class="empty-state">${(0,ee.k)("editor.no_custom_badges")}</div>`:t.map((e,t)=>this._renderCustomBadgeItem(e,t))}
        </div>

        <button class="btn-primary" style="margin-top: 8px;" @click=${this._addCustomBadge}>
          ${(0,ee.k)("editor.add_custom_badge")}
        </button>
        <div class="description">${(0,ee.k)("editor.custom_badges_help")}</div>
      </div>
    `}_renderCustomViewsSection(e=!1){const t=this._config.custom_views||[];return r.qy`
      <div class=${e?"editor-subsection":"section"}>
        <div
          class=${e?"subsection-title":"section-title"}
          style="display: flex; align-items: center; gap: 8px;"
        >
          ${(0,ee.k)("editor.section_custom_views")}
          <a
            href="https://github.com/Cyberhunter88/dashboard-strategy/blob/main/assets/Custom-View-hinzufugen.gif"
            target="_blank"
            rel="noopener"
            style="color: var(--primary-color); text-decoration: none; font-size: 18px;"
            title=${(0,ee.k)("editor.video_tutorial")}
            >&#x1F3AC;</a
          >
        </div>

        <div id="custom-views-list">
          ${0===t.length?r.qy`<div class="empty-state">${(0,ee.k)("editor.no_custom_views")}</div>`:t.map((e,t)=>this._renderCustomViewItem(e,t))}
        </div>

        <div class="custom-item-row" style="margin-top: 8px;">
          <button class="btn-primary" @click=${this._addCustomView}>
            ${(0,ee.k)("editor.add_custom_view")} <ha-icon icon="mdi:code-braces"></ha-icon>
          </button>
          <button class="btn-primary" @click=${this._addCustomRefView}>
            ${(0,ee.k)("editor.add_custom_view_ref")} <ha-icon icon="mdi:link-variant"></ha-icon>
          </button>
        </div>
        <div class="description">${(0,ee.k)("editor.custom_views_help")}</div>
        <div class="description">${(0,ee.k)("editor.custom_views_ref_help")}</div>
      </div>
    `}_renderCheckbox(e,t,i,o,s=!1){return r.qy`
      <div class="form-row">
        <input
          type="checkbox"
          id=${e}
          ?checked=${i}
          ?disabled=${s}
          @change=${e=>o(e.target.checked)}
        />
        <label for=${e} class=${s?"disabled-label":""}>${t}</label>
      </div>
    `}_renderCustomViewItem(e,t){const i=void 0!==e.ref_dashboard,o=e._yaml_error?r.qy`<span style="color: var(--error-color);">&#x274C; ${e._yaml_error}</span>`:e.yaml?r.qy`<span style="color: var(--success-color, green);">&#x2705; ${(0,ee.k)("editor.yaml_valid")}</span>`:r.s6;return r.qy`
      <div class="custom-item" data-index=${t}>
        <div class="custom-item-header">
          <strong>${e.title||(0,ee.k)("editor.new_view")}</strong>
          <button class="btn-remove" @click=${()=>this._removeCustomView(t)}>&#x2715;</button>
        </div>
        <div class="custom-item-fields">
          <div class="custom-item-row">
            <input
              type="text"
              .value=${e.title||""}
              placeholder=${(0,ee.k)("editor.title_placeholder")}
              style="flex: 2;"
              @change=${e=>this._updateCustomViewField(t,"title",e.target.value)}
            />
            <input
              type="text"
              .value=${e.path||""}
              placeholder=${(0,ee.k)("editor.path_placeholder")}
              style="flex: 2;"
              @change=${e=>this._updateCustomViewField(t,"path",e.target.value)}
            />
            <input
              type="text"
              .value=${e.icon||""}
              placeholder="mdi:star"
              style="flex: 1;"
              @change=${e=>this._updateCustomViewField(t,"icon",e.target.value)}
            />
          </div>
          ${this._renderCustomViewPosition(e,t)}
          ${i?this._renderCustomViewRefFields(e,t):r.qy`<textarea
                rows="8"
                placeholder=${(0,ee.k)("editor.yaml_placeholder")}
                .value=${e.yaml||""}
                style="width: 100%;"
                @change=${e=>this._updateCustomViewYaml(t,e.target.value)}
              ></textarea>
              <div class="custom-item-validation">${o}</div>`}
        </div>
      </div>
    `}_renderCustomViewPosition(e,t){const i=this._getGeneratedViewOptions(t),o=!!e.after_view&&!i.some(([t])=>t===e.after_view);return r.qy`
      <div class="custom-item-row">
        <select
          style="flex: 1;"
          @change=${e=>this._updateCustomViewAfterView(t,e.target.value)}
        >
          <option value="" ?selected=${!e.after_view}>${(0,ee.k)("editor.custom_view_position_end")}</option>
          ${o?r.qy`<option value=${e.after_view||""} selected>
                &#x26A0; ${(0,ee.k)("editor.custom_view_position_after")} ${e.after_view}
              </option>`:r.s6}
          ${i.map(([t,i])=>r.qy`
            <option value=${t} ?selected=${e.after_view===t}>
              ${(0,ee.k)("editor.custom_view_position_after")} ${i}
            </option>
          `)}
        </select>
      </div>
    `}_getGeneratedViewOptions(e){if(!this._hass)return[];const t=[["home",(0,ee.k)("views.overview")]],i=(e,i,r)=>{e&&t.push([i,(0,ee.k)(r)])};i((0,se.v)(this._config,"lights"),"lights","views.lights"),i((0,se.v)(this._config,"covers"),"covers","views.covers"),i((0,se.v)(this._config,"security"),"security","views.security"),i((0,se.v)(this._config,"batteries"),"batteries","views.batteries"),i((0,se.v)(this._config,"climate"),"climate","views.climate"),i(!0===this._config.show_cctv_view,"cctv","views.cctv"),i(!0===this._config.show_maintenance_view,"maintenance","views.maintenance");const r=new Set(this._config.areas_display?.hidden||[]);for(const e of this._getSortedAreas()){if(r.has(e.area_id))continue;const i=this._config.room_visibility?.[e.area_id];i?.entity&&this._hass.states[i.entity]?.state!==i.state||t.push([e.area_id,e.name])}for(const[i,r]of(this._config.custom_views||[]).entries())i!==e&&(r.parsed_config||r.ref_dashboard&&r.ref_view)&&r.path&&r.title&&t.push([r.path,r.title]);return t}_renderCustomViewRefFields(e,t){if(null===this._refDashboards)return this._loadRefDashboards(),r.qy`<div class="description">${(0,ee.k)("editor.ref_loading")}</div>`;if(0===this._refDashboards.length)return r.qy`<div class="custom-item-validation" style="color: var(--error-color);">
        ${(0,ee.k)("editor.ref_no_dashboards")}
      </div>`;const i=this._refDashboards.find(t=>t.url_path===e.ref_dashboard),o=!!e.ref_dashboard&&!i;return r.qy`
      <div class="custom-item-row">
        <select style="flex: 1;" @change=${e=>this._refDashboardChanged(t,e.target.value)}>
          <option value="" ?selected=${!e.ref_dashboard} disabled>${(0,ee.k)("editor.ref_select_dashboard")}</option>
          ${o?r.qy`<option value=${e.ref_dashboard||""} selected>${e.ref_dashboard}</option>`:r.s6}
          ${this._refDashboards.map(t=>r.qy`
            <option value=${t.url_path} ?selected=${t.url_path===e.ref_dashboard}>
              ${t.title}
            </option>`)}
        </select>
        <select style="flex: 1;" ?disabled=${!i} @change=${e=>this._refViewChanged(t,e.target.value)}>
          <option value="" ?selected=${!e.ref_view} disabled>${(0,ee.k)("editor.ref_select_view")}</option>
          ${(i?.views||[]).map(t=>{const i=t.path??String(t.index),o=`${t.title||`${(0,ee.k)("editor.ref_view_untitled")} ${t.index+1}`}${t.path?` (${t.path})`:""}`;return r.qy`<option value=${i} ?selected=${i===e.ref_view}>${o}</option>`})}
        </select>
      </div>
      <div class="custom-item-validation">
        ${o?r.qy`<span style="color: var(--error-color);">${(0,ee.k)("editor.ref_dashboard_missing")}</span>`:e.ref_dashboard&&e.ref_view?r.qy`<span style="color: var(--success-color, green);">${(0,ee.k)("editor.ref_valid")}</span>`:(0,ee.k)("editor.ref_incomplete")}
      </div>`}_renderCustomCardItem(e,t){const i=e._yaml_error?r.qy`<span style="color: var(--error-color);">&#x274C; ${e._yaml_error}</span>`:e.yaml?r.qy`<span style="color: var(--success-color, green);">&#x2705; ${(0,ee.k)("editor.yaml_valid")}</span>`:r.s6;return r.qy`
      <div class="custom-item" data-index=${t}>
        <div class="custom-item-header">
          <strong>${this._getCustomCardEditorLabel(e,(0,ee.k)("editor.new_card"))}</strong>
          <button class="btn-remove" @click=${()=>this._removeCustomCard(t)}>&#x2715;</button>
        </div>
        <div class="custom-item-fields">
          <label>${(0,ee.k)("editor.card_editor_title_label")}</label>
          <input
            type="text"
            .value=${e.editor_title||""}
            placeholder=${(0,ee.k)("editor.card_editor_title_placeholder")}
            @change=${e=>this._updateCustomCardField(t,"editor_title",e.target.value)}
          />
          <div class="description" style="margin: 0 0 4px 0;">${(0,ee.k)("editor.card_editor_title_help")}</div>
          <label>${(0,ee.k)("editor.card_dashboard_title_label")}</label>
          <input
            type="text"
            .value=${e.title||""}
            placeholder=${(0,ee.k)("editor.card_title_placeholder")}
            @change=${e=>this._updateCustomCardField(t,"title",e.target.value)}
          />
          <div class="custom-card-target">
            <label>${(0,ee.k)("editor.target_section")}:</label>
            <select
              @change=${e=>this._updateCustomCardField(t,"target_section",e.target.value)}
            >
              ${["custom_cards","overview","areas","weather","energy"].map(t=>r.qy`
                  <option value=${t} ?selected=${(e.target_section||"custom_cards")===t}>
                    ${(0,ee.k)(ve._sectionMeta.get(t).labelKey)}
                  </option>
                `)}
            </select>
          </div>
          <textarea
            rows="6"
            placeholder=${(0,ee.k)("editor.yaml_placeholder")}
            .value=${e.yaml||""}
            style="width: 100%;"
            @change=${e=>this._updateCustomCardYaml(t,e.target.value)}
          ></textarea>
          <button class="btn-primary" style="margin-top: 6px;" @click=${()=>this._openCardEditorForCustomCard(t)}>
            ${(0,ee.k)("editor.edit_card_with_ha_editor")}
          </button>
          <div class="custom-item-validation">${i}</div>
        </div>
      </div>
    `}_renderCustomSectionItem(e,t){const i=e.cards||[];return r.qy`
      <div class="custom-item" data-index=${t} style="margin-bottom: 12px;">
        <div class="custom-item-header">
          <strong>${e.title||`${(0,ee.k)("editor.section_custom_sections")} ${t+1}`}</strong>
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
            ${e._yaml_error?r.qy`<span style="color: var(--error-color);">&#x274C; ${e._yaml_error}</span>`:e.yaml?r.qy`<span style="color: var(--success-color, green);"
                    >&#x2705; ${(0,ee.k)("editor.yaml_valid")}</span
                  >`:r.s6}
          </div>
          <div class="custom-item-row">
            <input
              type="text"
              .value=${e.title||""}
              placeholder=${(0,ee.k)("editor.custom_section_title_placeholder")}
              style="flex: 2;"
              @change=${e=>this._updateCustomSectionField(t,"title",e.target.value)}
            />
            <input
              type="text"
              .value=${e.icon||""}
              placeholder=${(0,ee.k)("editor.custom_section_icon_placeholder")}
              style="flex: 1;"
              @change=${e=>this._updateCustomSectionField(t,"icon",e.target.value)}
            />
          </div>
          <div style="margin-top: 8px; padding-left: 8px; border-left: 2px solid var(--divider-color, #e0e0e0);">
            ${i.map((e,i)=>{const o=e._yaml_error?r.qy`<span style="color: var(--error-color);">&#x274C; ${e._yaml_error}</span>`:e.yaml?r.qy`<span style="color: var(--success-color, green);"
                      >&#x2705; ${(0,ee.k)("editor.yaml_valid")}</span
                    >`:r.s6;return r.qy`
                <div class="custom-item" data-index=${i} style="margin-bottom: 8px;">
                  <div class="custom-item-header">
                    <strong
                      >${this._getCustomCardEditorLabel(e,`${(0,ee.k)("editor.new_card")} ${i+1}`)}</strong
                    >
                    <button class="btn-remove" @click=${()=>this._removeCardFromSection(t,i)}>
                      &#x2715;
                    </button>
                  </div>
                  <div class="custom-item-fields">
                    <label>${(0,ee.k)("editor.card_editor_title_label")}</label>
                    <input
                      type="text"
                      .value=${e.editor_title||""}
                      placeholder=${(0,ee.k)("editor.card_editor_title_placeholder")}
                      @change=${e=>this._updateSectionCardField(t,i,"editor_title",e.target.value)}
                    />
                    <div class="description" style="margin: 0 0 4px 0;">
                      ${(0,ee.k)("editor.card_editor_title_help")}
                    </div>
                    <label>${(0,ee.k)("editor.card_dashboard_title_label")}</label>
                    <input
                      type="text"
                      .value=${e.title||""}
                      placeholder=${(0,ee.k)("editor.card_title_placeholder")}
                      @change=${e=>this._updateSectionCardField(t,i,"title",e.target.value)}
                    />
                    <textarea
                      rows="5"
                      placeholder=${(0,ee.k)("editor.yaml_placeholder")}
                      .value=${e.yaml||""}
                      style="width: 100%;"
                      @change=${e=>this._updateSectionCardYaml(t,i,e.target.value)}
                    ></textarea>
                    <button
                      class="btn-primary"
                      style="margin-top: 6px;"
                      @click=${()=>this._openCardEditorForSectionCard(t,i)}
                    >
                      ${(0,ee.k)("editor.edit_card_with_ha_editor")}
                    </button>
                    <div class="custom-item-validation">${o}</div>
                  </div>
                </div>
              `})}
            <button
              class="btn-primary"
              style="margin-top: 4px;"
              @click=${()=>this._openCardPickerForSection(t)}
            >
              ${(0,ee.k)("editor.add_card_to_section")}
            </button>
          </div>
        </div>
      </div>
    `}_renderCustomBadgeItem(e,t){const i=e._yaml_error?r.qy`<span style="color: var(--error-color);">&#x274C; ${e._yaml_error}</span>`:e.yaml?r.qy`<span style="color: var(--success-color, green);">&#x2705; ${(0,ee.k)("editor.yaml_valid")}</span>`:r.s6;return r.qy`
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
    `}_renderAreaItems(e,t,i,o){if(0===e.length)return r.qy`<div class="empty-state">${(0,ee.k)("editor.no_areas")}</div>`;const s=new Map(i.map((e,t)=>[e,t])),a=new Map(e.map((e,t)=>[e.area_id,t]));return[...e].sort((e,t)=>{const i=s.get(e.area_id),r=s.get(t.area_id);return(void 0!==i?i:9999+(a.get(e.area_id)??0))-(void 0!==r?r:9999+(a.get(t.area_id)??0))}).map(e=>{const i=t.includes(e.area_id),s=this._expandedAreas.has(e.area_id),a=this._areaEntitiesCache.get(e.area_id),n=o.includes(e.area_id);return r.qy`
        <div
          class="area-item"
          data-area-id=${e.area_id}
          draggable="true"
          @dragstart=${this._handleDragStart}
          @dragend=${this._handleDragEnd}
          @dragover=${this._handleDragOver}
          @dragleave=${this._handleDragLeave}
          @drop=${this._handleDrop}
        >
          <div class="area-header">
            <span class="drag-handle" draggable="true">&#x2630;</span>
            <input
              type="checkbox"
              class="area-checkbox"
              data-area-id=${e.area_id}
              ?checked=${!i}
              @change=${t=>this._areaVisibilityChanged(e.area_id,t.target.checked)}
            />
            <span class="area-name">${e.name}</span>
            ${e.icon?r.qy`<ha-icon class="area-icon" icon=${e.icon}></ha-icon>`:r.s6}
            <button
              class="nav-pin-button ${n?"pinned":""}"
              title="${(0,ee.k)("editor.area_pin_nav")}"
              ?disabled=${i}
              @click=${t=>{t.stopPropagation(),this._areaNavPinChanged(e.area_id,!n)}}
            >
              <ha-icon icon="${n?"mdi:pin":"mdi:pin-outline"}"></ha-icon>
            </button>
            <button
              class="expand-button ${s?"expanded":""}"
              data-area-id=${e.area_id}
              @click=${t=>this._toggleAreaExpand(t,e.area_id)}
            >
              <span class="expand-icon">&#x25B6;</span>
            </button>
          </div>
          ${s?r.qy`
                <div class="area-content" data-area-id=${e.area_id}>
                  ${this._renderAreaDisplayTypeOverride(e)}
                  ${this._renderAreaViewOverride(e.area_id)}
                  ${a?this._renderAreaEntities(e.area_id,a):r.qy`<div class="loading-placeholder">${(0,ee.k)("editor.loading_entities")}</div>`}
                </div>
              `:r.s6}
        </div>
      `})}_globalAreaDisplayTypeChanged(e){const t=function(e,t){const i={...e};return"compact"===t?delete i.area_display_type:i.area_display_type=t,i}(this._config,e);this._config=t,this._fireConfigChanged(t)}_renderAreaDisplayTypeOverride(e){const t=this._config.areas_options?.[e.area_id]?.display_type??"";return r.qy`
      <div class="form-row">
        <label for="area-display-type-${e.area_id}">${(0,ee.k)("editor.area_display_type_override")}</label>
        <select
          id="area-display-type-${e.area_id}"
          .value=${t}
          @change=${t=>this._areaDisplayTypeOverrideChanged(e.area_id,t.target.value)}
        >
          <option value="">${(0,ee.k)("editor.area_display_type_inherit")}</option>
          <option value="compact">${(0,ee.k)("editor.area_display_type_compact")}</option>
          <option value="picture">${(0,ee.k)("editor.area_display_type_picture")}</option>
        </select>
      </div>
      ${e.picture?r.s6:r.qy`<div class="description">${(0,ee.k)("editor.area_display_type_no_picture")}</div>`}
    `}_areaDisplayTypeOverrideChanged(e,t){const i=function(e,t,i){const r={...Reflect.get(e.areas_options??{},t)??{}};i?r.display_type=i:delete r.display_type;const o={...e.areas_options};Reflect.set(o,t,r),0===Object.keys(r).length&&Reflect.deleteProperty(o,t);const s={...e};return 0===Object.keys(o).length?delete s.areas_options:s.areas_options=o,s}(this._config,e,t||void 0);this._config=i,this._fireConfigChanged(i)}_renderAreaViewOverride(e){const t=this._config.areas_options?.[e]?.view_override,i=t?._yaml_error?r.qy`<span style="color: var(--error-color);">&#x274C; ${t._yaml_error}</span>`:t?.parsed_config?r.qy`<span style="color: var(--success-color, green);">&#x2705; ${(0,ee.k)("editor.yaml_valid")}</span>`:r.s6;return r.qy`
      <div class="custom-item" style="margin-bottom: 0;">
        <div class="custom-item-header">
          <strong>${(0,ee.k)("editor.area_view_override_title")}</strong>
          ${t?.yaml?r.qy`
                <button
                  class="btn-remove"
                  title=${(0,ee.k)("editor.area_view_override_remove")}
                  @click=${()=>this._updateAreaViewOverride(e,"")}
                >
                  &#x2715;
                </button>
              `:r.s6}
        </div>
        <div class="description" style="margin: 0 0 10px 0;">${(0,ee.k)("editor.area_view_override_help")}</div>
        <textarea
          rows="12"
          placeholder="type: sections&#10;sections:&#10;  - type: grid&#10;    cards: []"
          .value=${t?.yaml||""}
          style="width: 100%;"
          @change=${t=>this._updateAreaViewOverride(e,t.target.value)}
        >
        </textarea>
        <div class="custom-item-validation">${i}</div>
      </div>
    `}_updateAreaViewOverride(e,t){const i={...this._config.areas_options?.[e]||{}};if(t.trim()){const e=fe(t,(0,ee.k)("editor.area_view_override_object_error")),r=e.parsed_config,o=r&&!Array.isArray(r);i.view_override={yaml:t,parsed_config:o?r:void 0,_yaml_error:o?e._yaml_error:e._yaml_error||(0,ee.k)("editor.area_view_override_object_error")}}else delete i.view_override;const r={...this._config.areas_options};0===Object.keys(i).length?delete r[e]:r[e]=i;const o={...this._config};0===Object.keys(r).length?delete o.areas_options:o.areas_options=r,this._config=o,this._fireConfigChanged(o)}_renderAreaEntities(e,t){const{groupedEntities:i,hiddenEntities:o,badgeCandidates:s,additionalBadges:a,availableEntities:n,defaultShowNames:c,namesVisible:d,namesHidden:l}=t,h=this._hass,_=[{key:"ups",label:(0,ee.k)("stacks.ups"),icon:"mdi:power-plug-battery"},{key:"lights",label:(0,ee.k)("editor.domain_lights"),icon:"mdi:lightbulb"},{key:"climate",label:(0,ee.k)("editor.domain_climate"),icon:"mdi:thermostat"},{key:"covers",label:(0,ee.k)("editor.domain_covers"),icon:"mdi:window-shutter"},{key:"covers_curtain",label:(0,ee.k)("editor.domain_covers_curtain"),icon:"mdi:curtains"},{key:"covers_window",label:(0,ee.k)("editor.domain_covers_window"),icon:"mdi:window-open-variant"},{key:"media_player",label:(0,ee.k)("editor.domain_media_player"),icon:"mdi:speaker"},{key:"scenes",label:(0,ee.k)("editor.domain_scenes"),icon:"mdi:palette"},{key:"vacuum",label:(0,ee.k)("editor.domain_vacuum"),icon:"mdi:robot-vacuum"},{key:"fan",label:(0,ee.k)("editor.domain_fan"),icon:"mdi:fan"},{key:"switches",label:(0,ee.k)("editor.domain_switches"),icon:"mdi:light-switch"},{key:"locks",label:(0,ee.k)("editor.domain_locks"),icon:"mdi:lock"},{key:"energy",label:(0,ee.k)("stacks.energy"),icon:"mdi:lightning-bolt"}],p=_.some(e=>(i[e.key]?.length??0)>0),u=(s?.length??0)>0||(a?.length??0)>0,g=[],m=new Set,f=e=>{if(!e||m.has(e))return;m.add(e);const t=h.states[e],i=t?.attributes.friendly_name||e.split(".")[1]?.replace(/_/g," ")||e;g.push({entity_id:e,name:i})};for(const e of _)for(const t of i[e.key]||[])f(t);for(const e of s||[])f(e);for(const e of a||[])f(e);for(const e of n||[])f(e.entity_id);g.sort((e,t)=>e.name.localeCompare(t.name));const y=this._renderAreaCustomCardsSection(e,g);if(!p&&!u)return r.qy`
        <div class="empty-state">${(0,ee.k)("editor.no_entities_in_area")}</div>
        ${this._renderStackOrderPanel(e,t)} ${y}
      `;const v=this._expandedGroups.get(e)||new Set;return r.qy`
      <div class="entity-groups">
        ${_.map(t=>{const s=i[t.key];if(!s||0===s.length)return r.s6;const a=o[t.key]||[],n=s.every(e=>a.includes(e)),c=s.some(e=>a.includes(e))&&!n,d=v.has(t.key);return r.qy`
            <div class="entity-group" data-group=${t.key}>
              <div class="entity-group-header" @click=${()=>this._toggleGroupExpand(e,t.key)}>
                <input
                  type="checkbox"
                  class="group-checkbox"
                  data-area-id=${e}
                  data-group=${t.key}
                  ?checked=${!n}
                  .indeterminate=${c}
                  @click=${e=>e.stopPropagation()}
                  @change=${i=>{i.stopPropagation();const r=i.target.checked;this._groupVisibilityChanged(e,t.key,r,s)}}
                />
                <ha-icon icon=${t.icon}></ha-icon>
                <span class="group-name">${t.label}</span>
                <span class="entity-count">(${s.length})</span>
                <button
                  class="expand-button-small ${d?"expanded":""}"
                  @click=${i=>{i.stopPropagation(),this._toggleGroupExpand(e,t.key)}}
                >
                  <span class="expand-icon-small">&#x25B6;</span>
                </button>
              </div>
              ${d?r.qy`
                    <div class="entity-list" data-area-id=${e} data-group=${t.key}>
                      ${s.map(i=>{const o=h.states[i],s=o?.attributes.friendly_name||i.split(".")[1].replace(/_/g," "),n=a.includes(i);return r.qy`
                          <div class="entity-item">
                            <input
                              type="checkbox"
                              class="entity-checkbox"
                              ?checked=${!n}
                              @change=${r=>this._entityVisibilityChanged(e,t.key,i,r.target.checked)}
                            />
                            <span class="entity-name">${s}</span>
                            <span class="entity-id">${i}</span>
                          </div>
                        `})}
                    </div>
                  `:r.s6}
            </div>
          `})}
        ${u?this._renderBadgeGroup(e,s,a,n,o,c,d,l,v):r.s6}
        ${this._renderStackOrderPanel(e,t)}
      </div>
      ${y}
    `}_renderAreaCustomCardItem(e,t,i,o){const s=t.mode||"yaml",a=t.position||"bottom",n=t._yaml_error?r.qy`<span style="color: var(--error-color);">&#x274C; ${t._yaml_error}</span>`:t.yaml?r.qy`<span style="color: var(--success-color, green);">&#x2705; ${(0,ee.k)("editor.yaml_valid")}</span>`:r.s6;return r.qy`
      <div class="custom-item" data-index=${i}>
        <div class="custom-item-header">
          <strong>${this._getCustomCardEditorLabel(t,(0,ee.k)("editor.area_custom_card_new"))}</strong>
          <button class="btn-remove" @click=${()=>this._removeAreaCustomCard(e,i)}>&#x2715;</button>
        </div>
        <div class="custom-item-fields">
          <label>${(0,ee.k)("editor.card_editor_title_label")}</label>
          <input
            type="text"
            .value=${t.editor_title||""}
            placeholder=${(0,ee.k)("editor.card_editor_title_placeholder")}
            @change=${t=>this._updateAreaCustomCardField(e,i,"editor_title",t.target.value)}
          />
          <div class="description" style="margin: 0 0 4px 0;">${(0,ee.k)("editor.card_editor_title_help")}</div>
          <label>${(0,ee.k)("editor.card_dashboard_title_label")}</label>
          <input
            type="text"
            .value=${t.title||""}
            placeholder=${(0,ee.k)("editor.card_title_placeholder")}
            @change=${t=>this._updateAreaCustomCardField(e,i,"title",t.target.value)}
          />
          <div class="custom-card-target">
            <label>${(0,ee.k)("editor.area_custom_card_position")}:</label>
            <select
              @change=${t=>this._updateAreaCustomCardField(e,i,"position",t.target.value)}
            >
              <option value="top" ?selected=${"top"===a}>
                ${(0,ee.k)("editor.area_custom_card_position_top")}
              </option>
              <option value="bottom" ?selected=${"bottom"===a}>
                ${(0,ee.k)("editor.area_custom_card_position_bottom")}
              </option>
            </select>
          </div>
          <div class="custom-card-target">
            <label>${(0,ee.k)("editor.area_custom_card_mode")}:</label>
            <select
              @change=${t=>this._updateAreaCustomCardField(e,i,"mode",t.target.value)}
            >
              <option value="yaml" ?selected=${"yaml"===s}>
                ${(0,ee.k)("editor.area_custom_card_mode_yaml")}
              </option>
              <option value="tile" ?selected=${"tile"===s}>
                ${(0,ee.k)("editor.area_custom_card_mode_tile")}
              </option>
              <option value="section" ?selected=${"section"===s}>
                ${(0,ee.k)("editor.area_custom_card_mode_section")}
              </option>
            </select>
          </div>
          ${"tile"===s?r.qy`
                <div class="custom-card-target">
                  <label>${(0,ee.k)("editor.area_custom_card_entity")}:</label>
                  <select
                    @change=${t=>this._updateAreaCustomCardField(e,i,"entity",t.target.value)}
                  >
                    <option value="">${(0,ee.k)("editor.area_custom_card_entity_select")}</option>
                    ${o.map(e=>r.qy`
                        <option value=${e.entity_id} ?selected=${t.entity===e.entity_id}>
                          ${e.name} (${e.entity_id})
                        </option>
                      `)}
                  </select>
                </div>
              `:r.qy`
                <textarea
                  rows="6"
                  placeholder=${(0,ee.k)("editor.yaml_placeholder")}
                  .value=${t.yaml||""}
                  style="width: 100%;"
                  @change=${t=>this._updateAreaCustomCardYaml(e,i,t.target.value)}
                ></textarea>
                <button
                  class="btn-primary"
                  style="margin-top: 6px;"
                  @click=${()=>this._openCardEditorForAreaCustomCard(e,i)}
                >
                  ${(0,ee.k)("editor.edit_card_with_ha_editor")}
                </button>
                <div class="custom-item-validation">${n}</div>
              `}
        </div>
      </div>
    `}_renderAreaCustomCardsSection(e,t){const i=this._getAreaCustomCards(e);return r.qy`
      <div class="area-custom-cards">
        <div class="area-custom-cards-header">
          <ha-icon icon="mdi:card-plus-outline"></ha-icon>
          <span class="group-name">${(0,ee.k)("editor.area_custom_cards_title")}</span>
        </div>
        <div class="area-custom-cards-help">${(0,ee.k)("editor.area_custom_cards_help")}</div>
        ${0===i.length?r.s6:i.map((i,r)=>this._renderAreaCustomCardItem(e,i,r,t))}
        <div class="area-custom-card-actions">
          <button class="btn-primary" @click=${()=>this._addAreaCustomCard(e)}>
            ${(0,ee.k)("editor.area_custom_card_add_yaml")}
          </button>
          <button class="btn-primary" @click=${()=>this._openCardPickerForAreaCustomCard(e)}>
            ${(0,ee.k)("editor.area_custom_card_add_picker")}
          </button>
        </div>
      </div>
    `}_renderBadgeGroup(e,t,i,o,s,a,n,c,d){const l=this._hass,h=t.length+i.length;if(0===h)return r.qy``;const _=s.badges||[],p=t.length>0&&t.every(e=>_.includes(e)),u=t.some(e=>_.includes(e))&&!p,g=new Set(n||[]),m=new Set(c||[]),f=e=>(0,te.LN)(e,a.has(e),g,m),y=d.has("badges");return r.qy`
      <div class="entity-group" data-group="badges">
        <div class="entity-group-header" @click=${()=>this._toggleGroupExpand(e,"badges")}>
          <input
            type="checkbox"
            class="group-checkbox"
            data-area-id=${e}
            data-group="badges"
            ?checked=${!p}
            .indeterminate=${u}
            @click=${e=>e.stopPropagation()}
            @change=${i=>{i.stopPropagation();const r=i.target.checked;this._groupVisibilityChanged(e,"badges",r,t)}}
          />
          <ha-icon icon="mdi:checkbox-multiple-blank-circle"></ha-icon>
          <span class="group-name">${(0,ee.k)("editor.domain_badges")}</span>
          <span class="entity-count">(${h})</span>
          <button
            class="expand-button-small ${y?"expanded":""}"
            @click=${t=>{t.stopPropagation(),this._toggleGroupExpand(e,"badges")}}
          >
            <span class="expand-icon-small">&#x25B6;</span>
          </button>
        </div>
        ${y?r.qy`
              <div class="entity-list" data-area-id=${e} data-group="badges">
                ${t.map(t=>{const i=l.states[t],o=i?.attributes.friendly_name||t.split(".")[1].replace(/_/g," "),s=_.includes(t),a=f(t);return r.qy`
                    <div class="entity-item">
                      <input
                        type="checkbox"
                        class="entity-checkbox"
                        ?checked=${!s}
                        @change=${i=>this._entityVisibilityChanged(e,"badges",t,i.target.checked)}
                      />
                      <span class="entity-name">${o}</span>
                      <input
                        type="checkbox"
                        class="badge-name-checkbox"
                        ?checked=${a}
                        title=${(0,ee.k)("editor.badges_show_name")}
                        @change=${i=>this._badgeShowNameChanged(e,t,i.target.checked)}
                      />
                      <span class="badge-name-label">${(0,ee.k)("editor.badges_name_short")}</span>
                      <span class="entity-id">${t}</span>
                    </div>
                  `})}
                ${i.length>0?r.qy`
                      <div class="badge-separator">${(0,ee.k)("editor.badges_additional")}</div>
                      ${i.map(t=>{const i=l.states[t],o=i?.attributes.friendly_name||t.split(".")[1].replace(/_/g," "),s=f(t);return r.qy`
                          <div class="entity-item badge-additional-item">
                            <span class="entity-name">${o}</span>
                            <input
                              type="checkbox"
                              class="badge-name-checkbox"
                              ?checked=${s}
                              title=${(0,ee.k)("editor.badges_show_name")}
                              @change=${i=>this._badgeShowNameChanged(e,t,i.target.checked)}
                            />
                            <span class="badge-name-label">${(0,ee.k)("editor.badges_name_short")}</span>
                            <span class="entity-id">${t}</span>
                            <button
                              class="badge-remove-btn"
                              title=${(0,ee.k)("editor.badges_remove")}
                              @click=${()=>this._badgeAdditionalChanged(e,t,!1)}
                            >
                              &#x2715;
                            </button>
                          </div>
                        `})}
                    `:r.s6}
                ${o.length>0?r.qy`
                      <div class="badge-add-section">
                        <select class="badge-entity-picker" data-area-id=${e}>
                          <option value="">${(0,ee.k)("editor.badges_select_entity")}</option>
                          ${o.map(e=>r.qy` <option value=${e.entity_id}>${e.name} (${e.entity_id})</option> `)}
                        </select>
                        <button class="badge-add-button" @click=${t=>this._addBadgeFromPicker(t,e)}>
                          ${(0,ee.k)("editor.badges_add")}
                        </button>
                      </div>
                    `:r.s6}
              </div>
            `:r.s6}
      </div>
    `}async _loadAreaEntities(e){if(!this._hass)return;const t=(0,ue.NS)(e,this._hass,this._config),i=(0,ue.vZ)(t,this._hass,(0,ue.H2)(t,this._hass),{includeCameras:!1}),r=xe(e,this._config),o=$e(e,this._config),s=(0,ue.Rl)(t,this._hass),a=be(e,this._config),n=(0,ue.OT)(t,this._hass,[...s,...a]),c=we(s,this._hass),{namesVisible:d,namesHidden:l}=ke(e,this._config);this._areaEntitiesCache.set(e,{groupedEntities:i,hiddenEntities:r,entityOrders:o,badgeCandidates:s,additionalBadges:a,availableEntities:n,defaultShowNames:c,namesVisible:d,namesHidden:l}),this.requestUpdate()}_refreshAreaCache(e){if(!this._hass||!this._areaEntitiesCache.has(e))return;const t=this._areaEntitiesCache.get(e).groupedEntities,i=xe(e,this._config),r=$e(e,this._config),o=(0,ue.NS)(e,this._hass,this._config),s=(0,ue.Rl)(o,this._hass),a=be(e,this._config),n=(0,ue.OT)(o,this._hass,[...s,...a]),c=we(s,this._hass),{namesVisible:d,namesHidden:l}=ke(e,this._config);this._areaEntitiesCache.set(e,{groupedEntities:t,hiddenEntities:i,entityOrders:r,badgeCandidates:s,additionalBadges:a,availableEntities:n,defaultShowNames:c,namesVisible:d,namesHidden:l})}_toggleChanged(e,t,i){if(!this._hass)return;const r={...this._config,[e]:t};t===i&&delete r[e],this._config=r,this._fireConfigChanged(r)}_searchCardVariantChanged(e){const t={...this._config};"tip"===e?t.search_card_variant="tip":delete t.search_card_variant,this._fireConfigChanged(t)}_lightFavoritesChanged(e){const t=e.split(",").map(e=>e.trim()).filter(e=>e.startsWith("light.")),i={...this._config};t.length>0?i.light_favorite_entities=[...new Set(t)]:delete i.light_favorite_entities,this._fireConfigChanged(i)}_securityActivityPositionChanged(e){const t={...this._config};"end"===e?t.security_activity_position="end":delete t.security_activity_position,this._fireConfigChanged(t)}_securityExtraEntitiesChanged(e){const t=e.split(",").map(e=>e.trim()).filter(e=>e.includes(".")),i={...this._config};t.length>0?i.security_extra_entities=[...new Set(t)]:delete i.security_extra_entities,this._fireConfigChanged(i)}_simpleOptionChanged(e,t,i){const r={...this._config};t===i?delete r[e]:r[e]=t,this._config=r,this._fireConfigChanged(this._config)}_summariesColumnsChanged(e){if(!this._hass)return;const t={...this._config,summaries_columns:e};2===e&&delete t.summaries_columns,this._config=t,this._fireConfigChanged(t)}_lightsSortByNameChanged(e){if(!this._hass)return;const t={...this._config,lights_sort_by:e?"name":"last_changed"};e||delete t.lights_sort_by,this._config=t,this._fireConfigChanged(t)}_alarmEntityChanged(e){if(!this._hass)return;const t=e.target.value,i={...this._config,alarm_entity:t};t&&""!==t||delete i.alarm_entity,this._config=i,this._fireConfigChanged(i)}_houseModeEntityChanged(e){const t=e.target.value,i={...this._config};t?i.house_mode_entity=t:delete i.house_mode_entity,this._config=i,this._fireConfigChanged(i)}_weatherEntityChanged(e){if(!this._hass)return;const t=e.target.value,i={...this._config,weather_entity:t};t&&""!==t||delete i.weather_entity,this._config=i,this._fireConfigChanged(i)}_batteryCriticalChanged(e){const t=parseInt(e.target.value,10);if(isNaN(t)||t<1||t>99)return;const i={...this._config,battery_critical_threshold:t};20===t&&delete i.battery_critical_threshold,this._config=i,this._fireConfigChanged(i)}_batteryLowChanged(e){const t=parseInt(e.target.value,10);if(isNaN(t)||t<1||t>99)return;const i={...this._config,battery_low_threshold:t};50===t&&delete i.battery_low_threshold,this._config=i,this._fireConfigChanged(i)}_unavailableBatteriesBucketChanged(e){const t={...this._config};"good"===e?delete t.unavailable_batteries_bucket:t.unavailable_batteries_bucket=e,this._config=t,this._fireConfigChanged(t)}_addFavoriteEntity(e){if(!this._hass)return;const t=this._config.favorite_entities||[];if(t.includes(e))return;const i={...this._config,favorite_entities:[...t,e]};this._config=i,this._fireConfigChanged(i)}_removeFavoriteEntity(e){if(!this._hass)return;const t=(this._config.favorite_entities||[]).filter(t=>t!==e),i={...this._config,favorite_entities:t.length>0?t:void 0};0===t.length&&delete i.favorite_entities,this._config=i,this._fireConfigChanged(i)}_addRoomPinEntity(e){if(!this._hass)return;const t=this._config.room_pin_entities||[];if(t.includes(e))return;const i={...this._config,room_pin_entities:[...t,e]};this._config=i,this._fireConfigChanged(i)}_removeRoomPinEntity(e){if(!this._hass)return;const t=(this._config.room_pin_entities||[]).filter(t=>t!==e),i={...this._config,room_pin_entities:t.length>0?t:void 0};0===t.length&&delete i.room_pin_entities,this._config=i,this._fireConfigChanged(i)}_addCustomView(){const e=[...this._config.custom_views||[]];e.push({title:(0,ee.k)("editor.new_view"),path:`custom-view-${e.length+1}`,icon:"mdi:card-text-outline",yaml:"",parsed_config:void 0});const t={...this._config,custom_views:e};this._config=t,this._fireConfigChanged(t)}async _loadRefDashboards(){if(this._refDashboardsLoading||!this._hass)return;this._refDashboardsLoading=!0;const e=[];try{const t=await this._hass.callWS({type:"lovelace/dashboards/list"}),i=[{url_path:"lovelace",title:(0,ee.k)("editor.ref_default_dashboard")},...t.filter(e=>e.url_path&&"lovelace"!==e.url_path)];await Promise.all(i.map(async t=>{try{const i=await this._hass.callWS({type:"lovelace/config",url_path:"lovelace"===t.url_path?null:t.url_path});if(i.strategy)return;const r=(i.views||[]).map((e,t)=>({path:"string"==typeof e.path?e.path:void 0,title:"string"==typeof e.title?e.title:void 0,icon:"string"==typeof e.icon?e.icon:void 0,index:t}));r.length&&e.push({...t,views:r})}catch{}}))}catch{}e.sort((e,t)=>e.title.localeCompare(t.title)),this._refDashboards=e,this._refDashboardsLoading=!1,this.requestUpdate()}_refDashboardChanged(e,t){const i=[...this._config.custom_views||[]];if(!i[e])return;i[e]={...i[e],ref_dashboard:t,ref_view:""};const r={...this._config,custom_views:i};this._config=r,this._fireConfigChanged(r)}_refViewChanged(e,t){const i=[...this._config.custom_views||[]],r=i[e];if(!r)return;const o=this._refDashboards?.find(e=>e.url_path===r.ref_dashboard),s=o?.views.find(e=>(e.path??String(e.index))===t),a={...r,ref_view:t};a.title||(a.title=s?.title||(0,ee.k)("editor.new_view")),a.icon||(a.icon=s?.icon||"mdi:link-variant"),a.path||(a.path=this._uniqueCustomViewPath(s?.path||`custom-view-${e+1}`,e)),i[e]=a;const n={...this._config,custom_views:i};this._config=n,this._fireConfigChanged(n)}_uniqueCustomViewPath(e,t){const i=new Set(["home","lights","covers","security","batteries","climate","maintenance","cctv",...Object.keys(this._hass?.areas||{}),...(this._config.custom_views||[]).filter((e,i)=>i!==t).map(e=>e.path).filter(e=>!!e)]);if(!i.has(e))return e;let r=1,o=`${e}-ref`;for(;i.has(o);)o=`${e}-ref${++r}`;return o}_removeCustomView(e){const t=[...this._config.custom_views||[]];t.splice(e,1);const i={...this._config};0===t.length?delete i.custom_views:i.custom_views=t,this._config=i,this._fireConfigChanged(i)}_updateCustomViewField(e,t,i){const r=[...this._config.custom_views||[]];if(!r[e])return;r[e]={...r[e],[t]:i};const o={...this._config,custom_views:r};this._config=o,this._fireConfigChanged(o)}_updateCustomViewAfterView(e,t){const i=[...this._config.custom_views||[]],r=i[e];if(!r)return;const o={...r};t?o.after_view=t:delete o.after_view,i[e]=o;const s={...this._config,custom_views:i};this._config=s,this._fireConfigChanged(s)}_updateCustomViewYaml(e,t){const i=[...this._config.custom_views||[]];if(!i[e])return;const r={...i[e],yaml:t};delete r._yaml_error;const o=fe(t,"YAML muss ein Objekt ergeben");r.parsed_config=o.parsed_config,r._yaml_error=o._yaml_error,i[e]=r;const s={...this._config,custom_views:i};this._config=s,this._fireConfigChanged(s)}_customCardsHeadingChanged(e){const t=e.target.value.trim(),i={...this._config};t?i.custom_cards_heading=t:delete i.custom_cards_heading,this._config=i,this._fireConfigChanged(i)}_customCardsIconChanged(e){const t=e.target.value.trim(),i={...this._config};t?i.custom_cards_icon=t:delete i.custom_cards_icon,this._config=i,this._fireConfigChanged(i)}_removeCustomCard(e){const t=[...this._config.custom_cards||[]];t.splice(e,1);const i={...this._config};0===t.length?delete i.custom_cards:i.custom_cards=t,this._config=i,this._fireConfigChanged(i)}_updateCustomCardField(e,t,i){const r=[...this._config.custom_cards||[]];if(!r[e])return;r[e]={...r[e],[t]:i};const o={...this._config,custom_cards:r};this._config=o,this._fireConfigChanged(o)}_updateCustomCardYaml(e,t){const i=[...this._config.custom_cards||[]];if(!i[e])return;const r={...i[e],yaml:t};delete r._yaml_error;const o=fe(t,"YAML muss ein Objekt oder Array ergeben");r.parsed_config=o.parsed_config,r._yaml_error=o._yaml_error,i[e]=r;const s={...this._config,custom_cards:i};if(r._yaml_error)return this._config=s,void this.requestUpdate();this._config=s,this._fireConfigChanged(s)}_addCustomSection(){const e=[...this._config.custom_sections||[]];e.push({title:"",icon:"",cards:[]});const t={...this._config,custom_sections:e};this._config=t,this._fireConfigChanged(t)}_removeCustomSection(e){const t=[...this._config.custom_sections||[]];t.splice(e,1);const i={...this._config};0===t.length?delete i.custom_sections:i.custom_sections=t,this._config=i,this._fireConfigChanged(i)}_updateCustomSectionField(e,t,i){const r=[...this._config.custom_sections||[]];if(!r[e])return;r[e]={...r[e],[t]:i};const o={...this._config,custom_sections:r};this._config=o,this._fireConfigChanged(o)}_updateCustomSectionYaml(e,t){const i=[...this._config.custom_sections||[]];if(!i[e])return;const r={...i[e],yaml:t},o=fe(t,(0,ee.k)("editor.custom_section_yaml_invalid"));r.parsed_config=o.parsed_config,r._yaml_error=o._yaml_error,i[e]=r;const s={...this._config,custom_sections:i};this._config=s,r._yaml_error?this.requestUpdate():this._fireConfigChanged(s)}_removeCardFromSection(e,t){const i=[...this._config.custom_sections||[]];if(!i[e])return;const r={...i[e]},o=[...r.cards||[]];o.splice(t,1),r.cards=o,i[e]=r;const s={...this._config,custom_sections:i};this._config=s,this._fireConfigChanged(s)}_updateSectionCardField(e,t,i,r){const o=[...this._config.custom_sections||[]];if(!o[e])return;const s={...o[e]},a=[...s.cards||[]];if(!a[t])return;a[t]={...a[t],[i]:r},s.cards=a,o[e]=s;const n={...this._config,custom_sections:o};this._config=n,this._fireConfigChanged(n)}_updateSectionCardYaml(e,t,i){const r=[...this._config.custom_sections||[]];if(!r[e])return;const o={...r[e]},s=[...o.cards||[]];if(!s[t])return;const a={...s[t],yaml:i};delete a._yaml_error;const n=fe(i,"YAML muss ein Objekt oder Array ergeben");a.parsed_config=n.parsed_config,a._yaml_error=n._yaml_error,s[t]=a,o.cards=s,r[e]=o;const c={...this._config,custom_sections:r};if(a._yaml_error)return this._config=c,void this.requestUpdate();this._config=c,this._fireConfigChanged(c)}_getAreaCustomCards(e){return[...this._config.areas_options?.[e]?.custom_cards||[]]}_writeAreaCustomCards(e,t){const i={...this._config.areas_options?.[e]||{}};0===t.length?delete i.custom_cards:i.custom_cards=t;const r={...this._config.areas_options,[e]:i};0===Object.keys(r[e]).length&&delete r[e];const o={...this._config,areas_options:r};o.areas_options&&0===Object.keys(o.areas_options).length&&delete o.areas_options,this._config=o,this._fireConfigChanged(o)}_addAreaCustomCard(e){const t=this._getAreaCustomCards(e);t.push({mode:"yaml",position:"bottom",editor_title:"",yaml:"",parsed_config:void 0}),this._writeAreaCustomCards(e,t)}_removeAreaCustomCard(e,t){const i=this._getAreaCustomCards(e);t<0||t>=i.length||(i.splice(t,1),this._writeAreaCustomCards(e,i))}_updateAreaCustomCardField(e,t,i,r){const o=this._getAreaCustomCards(e);if(!o[t])return;const s={...o[t],[i]:r};"mode"===i&&"tile"!==r&&this._parseAreaCustomCardYamlConfig(s,s.yaml||""),"mode"===i&&"tile"===r&&delete s._yaml_error,o[t]=s,this._writeAreaCustomCards(e,o)}_parseAreaCustomCardYamlConfig(e,t){if(e.yaml=t,delete e._yaml_error,t.trim())try{const i=Q.load(t);if(i&&"object"==typeof i){if("section"===e.mode){if(!(Array.isArray(i)?i:[i]).every(e=>e&&"object"==typeof e&&Array.isArray(e.cards)))return e._yaml_error="Section-YAML muss ein Objekt oder Array mit cards enthalten",void(e.parsed_config=void 0)}e.parsed_config=i}else e._yaml_error="YAML muss ein Objekt oder Array ergeben",e.parsed_config=void 0}catch(t){const i=t instanceof Error?t.message.split("\n")[0]:"Ungültiges YAML";e._yaml_error=i||"Ungültiges YAML",e.parsed_config=void 0}else e.parsed_config=void 0}_updateAreaCustomCardYaml(e,t,i){const r=this._getAreaCustomCards(e);if(!r[t])return;const o={...r[t]};this._parseAreaCustomCardYamlConfig(o,i),r[t]=o,this._writeAreaCustomCards(e,r)}_addCustomBadge(){const e=[...this._config.custom_badges||[]];e.push({yaml:"",parsed_config:void 0});const t={...this._config,custom_badges:e};this._config=t,this._fireConfigChanged(t)}_removeCustomBadge(e){const t=[...this._config.custom_badges||[]];t.splice(e,1);const i={...this._config};0===t.length?delete i.custom_badges:i.custom_badges=t,this._config=i,this._fireConfigChanged(i)}_updateCustomBadgeYaml(e,t){const i=[...this._config.custom_badges||[]];if(!i[e])return;const r={...i[e],yaml:t};delete r._yaml_error;const o=fe(t,"YAML muss ein Objekt ergeben");r.parsed_config=o.parsed_config,r._yaml_error=o._yaml_error,i[e]=r;const s={...this._config,custom_badges:i};this._config=s,this._fireConfigChanged(s)}_areaVisibilityChanged(e,t){if(!this._hass)return;let i=[...this._config.areas_display?.hidden||[]];t?i=i.filter(t=>t!==e):(i.includes(e)||i.push(e),this._expandedAreas.delete(e),this._expandedGroups.delete(e),this._areaEntitiesCache.delete(e));const r={...this._config,areas_display:{...this._config.areas_display,hidden:i}};0===r.areas_display?.hidden?.length&&delete r.areas_display.hidden,r.areas_display&&0===Object.keys(r.areas_display).length&&delete r.areas_display,this._invalidateWeatherStartOptionsCaches(),this._config=r,this._fireConfigChanged(r)}_areaNavPinChanged(e,t){let i=[...this._config.areas_display?.nav_items||[]];t?i.includes(e)||i.push(e):i=i.filter(t=>t!==e);const r={...this._config,areas_display:{...this._config.areas_display,nav_items:i}};0===r.areas_display?.nav_items?.length&&delete r.areas_display.nav_items,r.areas_display&&0===Object.keys(r.areas_display).length&&delete r.areas_display,this._config=r,this._fireConfigChanged(r)}_toggleAreaExpand(e,t){e.stopPropagation();const i=new Set(this._expandedAreas);if(i.has(t)){i.delete(t);const e=new Map(this._expandedGroups);e.delete(t),this._expandedGroups=e}else i.add(t),this._areaEntitiesCache.has(t)||this._loadAreaEntities(t);this._expandedAreas=i}_toggleGroupExpand(e,t){const i=new Map(this._expandedGroups),r=new Set(i.get(e)||[]);r.has(t)?r.delete(t):r.add(t),r.size>0?i.set(e,r):i.delete(e),this._expandedGroups=i}_groupVisibilityChanged(e,t,i,r){if(!this._hass)return;const o=((this._config.areas_options?.[e]||{}).groups_options||{})[t];let s=[...o?.hidden||[]];s=i?s.filter(e=>!r.includes(e)):[...new Set([...s,...r])],this._updateEntityConfig(e,t,s)}_entityVisibilityChanged(e,t,i,r){if(!this._hass)return;if("badges_additional"===t)return void this._badgeAdditionalChanged(e,i,r);if("badges_show_name"===t)return void this._badgeShowNameChanged(e,i,r);const o=((this._config.areas_options?.[e]||{}).groups_options||{})[t];let s=[...o?.hidden||[]];r?s=s.filter(e=>e!==i):s.includes(i)||s.push(i),this._updateEntityConfig(e,t,s)}_updateEntityConfig(e,t,i){const r=this._config.areas_options?.[e]||{},o=r.groups_options||{},s={...o[t],hidden:i};0===s.hidden.length&&delete s.hidden;const a={...o,[t]:s};0===Object.keys(a[t]).length&&delete a[t];const n={...r,groups_options:a};0===Object.keys(n.groups_options).length&&delete n.groups_options;const c={...this._config.areas_options,[e]:n};0===Object.keys(c[e]).length&&delete c[e];const d={...this._config,areas_options:c};d.areas_options&&0===Object.keys(d.areas_options).length&&delete d.areas_options,this._config=d,this._fireConfigChanged(d),this._refreshAreaCache(e)}_badgeAdditionalChanged(e,t,i){if(!this._config)return;const r=this._config.areas_options?.[e]||{},o=r.groups_options||{},s=o.badges||{};let a=[...s.additional||[]];i?a.includes(t)||a.push(t):a=a.filter(e=>e!==t);const n={...s};a.length>0?n.additional=a:delete n.additional;const c={...o,badges:n};0===Object.keys(c.badges).length&&delete c.badges;const d={...r,groups_options:c};0===Object.keys(d.groups_options).length&&delete d.groups_options;const l={...this._config.areas_options,[e]:d};0===Object.keys(l[e]).length&&delete l[e];const h={...this._config,areas_options:l};h.areas_options&&0===Object.keys(h.areas_options).length&&delete h.areas_options,this._config=h,this._fireConfigChanged(h),this._refreshAreaCache(e)}_badgeShowNameChanged(e,t,i){if(!this._config||!this._hass)return;const r=this._config.areas_options?.[e]||{},o=r.groups_options||{},s=o.badges||{};let a=[...s.names_visible||[]],n=[...s.names_hidden||[]];const c=this._hass.states[t],d=c?.attributes?.device_class;i===(0,te.g7)(d)?(a=a.filter(e=>e!==t),n=n.filter(e=>e!==t)):i?(a.includes(t)||a.push(t),n=n.filter(e=>e!==t)):(a=a.filter(e=>e!==t),n.includes(t)||n.push(t));const l={...s};a.length>0?l.names_visible=a:delete l.names_visible,n.length>0?l.names_hidden=n:delete l.names_hidden;const h={...o,badges:l};0===Object.keys(h.badges).length&&delete h.badges;const _={...r,groups_options:h};0===Object.keys(_.groups_options).length&&delete _.groups_options;const p={...this._config.areas_options,[e]:_};0===Object.keys(p[e]).length&&delete p[e];const u={...this._config,areas_options:p};u.areas_options&&0===Object.keys(u.areas_options).length&&delete u.areas_options,this._config=u,this._fireConfigChanged(u),this._refreshAreaCache(e)}_addBadgeFromPicker(e,t){e.stopPropagation();const i=this.shadowRoot.querySelector(`.badge-entity-picker[data-area-id="${t}"]`);if(!i||!i.value)return;const r=i.value;this._badgeAdditionalChanged(t,r,!0),i.value=""}_getAreaOrder(){if(!this._hass)return[];const e=this._getNormalizedAreasDisplay()?.order;return e&&e.length>0?[...e]:Object.keys(this._hass.areas||{})}_updateAreaOrder(e){const t={...this._config,areas_display:{...this._config.areas_display,order:e}};this._invalidateWeatherStartOptionsCaches(),this._config=t,this._fireConfigChanged(t)}_fireConfigChanged(e){this._isUpdatingConfig=!0;const t=function(e){const t={...e};return delete t.overview_layout,delete t.sections_order,t}(e);delete t.inline_editor,t.custom_views&&(t.custom_views=t.custom_views.map(e=>{const t={...e};return delete t._yaml_error,t})),t.custom_cards&&(t.custom_cards=t.custom_cards.map(e=>{const t={...e};return delete t._yaml_error,t})),t.custom_badges&&(t.custom_badges=t.custom_badges.map(e=>{const t={...e};return delete t._yaml_error,t})),t.custom_sections&&(t.custom_sections=t.custom_sections.map(e=>{const t={...e};return delete t._yaml_error,t.cards=(e.cards||[]).map(e=>{const t={...e};return delete t._yaml_error,t}),t})),t.weather_start_layout_items&&(t.weather_start_layout_items=t.weather_start_layout_items.map(e=>{const t={...e};return delete t._yaml_error,t}));const i=this._getNormalizedAreasDisplay(t);i?t.areas_display=i:delete t.areas_display;const r=this._hass?new Set(Object.keys(this._hass.areas||{})):null;if(t.areas_options){const e=function(e){if(!e)return;const t={};for(const[i,r]of Object.entries(e)){const e={...r};delete e.webrtc_cameras,Object.keys(e).length>0&&(t[i]=e)}return Object.keys(t).length>0?t:void 0}(t.areas_options),i={};for(const[t,o]of Object.entries(e||{})){if(r&&!r.has(t))continue;const e={...o};if(o.custom_cards&&(e.custom_cards=o.custom_cards.map(e=>{const t={...e};return delete t._yaml_error,t})),o.view_override){const t={...o.view_override};delete t._yaml_error,e.view_override=t}Object.keys(e).length>0&&(i[t]=e)}Object.keys(i).length>0?t.areas_options=i:delete t.areas_options}this._config=e,function(e,t){e.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}(this,t),setTimeout(()=>{this._isUpdatingConfig=!1},0)}_openCardPickerForSection(e){this._openCardPicker(t=>{const i=Q.dump(t).trim(),r=[...this._config.custom_sections||[]];if(!r[e])return;const o={...r[e]};o.cards=[...o.cards||[],{editor_title:"",yaml:i,parsed_config:t}],r[e]=o;const s={...this._config,custom_sections:r};this._config=s,this._fireConfigChanged(s)})}_openCardPickerForAreaCustomCard(e){this._openCardPicker(t=>{const i=Q.dump(t).trim(),r=this._getAreaCustomCards(e);r.push({mode:"yaml",position:"bottom",editor_title:"",yaml:i,parsed_config:t}),this._writeAreaCustomCards(e,r)})}_openCardEditorForCustomCard(e){const t=this._config.custom_cards?.[e],i=this._getEditableYamlCardConfig(t);i&&this._openCardPicker(t=>{this._updateCustomCardYaml(e,Q.dump(t).trim())},i)}_openCardEditorForSectionCard(e,t){const i=this._config.custom_sections?.[e]?.cards?.[t],r=this._getEditableYamlCardConfig(i);r&&this._openCardPicker(i=>{this._updateSectionCardYaml(e,t,Q.dump(i).trim())},r)}_openCardEditorForAreaCustomCard(e,t){const i=this._getAreaCustomCards(e)[t],r=this._getEditableAreaCardConfig(i);r&&this._openCardPicker(i=>{const r=this._getAreaCustomCards(e);if(!r[t])return;const o={...r[t],mode:"yaml",yaml:Q.dump(i).trim(),parsed_config:i};delete o._yaml_error,r[t]=o,this._writeAreaCustomCards(e,r)},r)}_getEditableAreaCardConfig(e){return e?"tile"===(e.mode||"yaml")&&e.entity?{type:"tile",entity:e.entity}:this._getEditableYamlCardConfig(e):null}_getEditableYamlCardConfig(e){if(e?.parsed_config&&"object"==typeof e.parsed_config&&!Array.isArray(e.parsed_config))return e.parsed_config;if(!e?.yaml?.trim())return null;try{const t=Q.load(e.yaml);return t&&"object"==typeof t&&!Array.isArray(t)?t:null}catch{return null}}_openCardPicker(e,t){this._cardPickerCallback=e,this._cardPickerConfig=t||null,this._cardPickerOpen=!0,this._cardPickerStep=t?"editor":"type",this._cardPickerSearch="",this._cardPickerSelectedType="string"==typeof t?.type?t.type:"",this._cardPickerYaml=t?Q.dump(t).trim():"",this._cardPickerHasVisualEditor=!1}_closeCardPicker(){this._cardPickerOpen=!1,this._cardPickerCallback=null,this._cardPickerConfig=null;const e=this.shadowRoot?.querySelector(".card-editor-visual-host");e&&(e.innerHTML="")}_selectCardType(e){this._cardPickerSelectedType=e,this._cardPickerStep="editor";const t=ye.find(t=>t.type===e);if(t){this._cardPickerYaml=t.template;try{const e=Q.load(t.template);e&&"object"==typeof e&&!Array.isArray(e)&&(this._cardPickerConfig=e)}catch{}}else this._cardPickerYaml=`type: ${e}\n`,this._cardPickerConfig={type:e};this._cardPickerHasVisualEditor=!1}_cardPickerYamlChanged(e){const t=e.target.value;this._cardPickerYaml=t;try{const e=Q.load(t);e&&"object"==typeof e&&!Array.isArray(e)&&(this._cardPickerConfig=e)}catch{}}_confirmCardPicker(){this._cardPickerConfig&&this._cardPickerCallback&&(this._cardPickerCallback(this._cardPickerConfig),this._closeCardPicker())}updated(e){super.updated(e),this._cardPickerOpen&&"editor"===this._cardPickerStep&&!this._cardPickerHasVisualEditor&&this._tryMountVisualCardEditor()}_tryMountVisualCardEditor(){const e=this.shadowRoot?.querySelector(".card-editor-visual-host");if(e&&!e.firstChild&&customElements.get("hui-card-element-editor"))try{const t=document.createElement("hui-card-element-editor");t.hass=this._hass,t.value=this._cardPickerConfig||{type:this._cardPickerSelectedType},t.addEventListener("config-changed",e=>{const t=e.detail?.config;t&&"object"==typeof t&&(this._cardPickerConfig=t,this._cardPickerYaml=Q.dump(t).trim(),this.requestUpdate("_cardPickerYaml"))}),e.appendChild(t),this._cardPickerHasVisualEditor=!0}catch{}}_renderCardPickerOverlay(){return"type"===this._cardPickerStep?this._renderCardTypePicker():this._renderCardEditor()}_renderCardTypePicker(){const e=this._cardPickerSearch.toLowerCase(),t=ye.filter(t=>!e||t.type.includes(e)||t.name.toLowerCase().includes(e)),i=(window.customCards||[]).filter(t=>{const i=(t.type||"").toLowerCase(),r=(t.name||"").toLowerCase();return"webrtc-camera"!==i&&"custom:webrtc-camera"!==i&&!r.includes("webrtc")&&(!e||i.includes(e)||r.includes(e))});return r.qy`
      <div class="card-picker-overlay" @click=${this._handlePickerOverlayClick}>
        <div class="card-picker-dialog" @click=${e=>e.stopPropagation()}>
          <div class="card-picker-header">
            <span class="card-picker-header-title">Karte hinzufügen</span>
            <button class="card-picker-icon-btn" @click=${this._closeCardPicker} title="Schließen">
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          <div class="card-picker-search-row">
            <input
              type="text"
              placeholder="Kartentyp suchen…"
              .value=${this._cardPickerSearch}
              @input=${e=>{this._cardPickerSearch=e.target.value,this.requestUpdate()}}
            />
          </div>
          <div class="card-type-grid">
            ${t.map(e=>r.qy`
                <button class="card-type-btn" @click=${()=>this._selectCardType(e.type)}>
                  <ha-icon icon=${e.icon}></ha-icon>
                  <span>${e.name}</span>
                </button>
              `)}
            ${i.map(e=>r.qy`
                <button class="card-type-btn" @click=${()=>this._selectCardType(e.type)}>
                  <ha-icon icon="mdi:puzzle"></ha-icon>
                  <span>${e.name||e.type}</span>
                </button>
              `)}
          </div>
        </div>
      </div>
    `}_renderCardEditor(){const e=ye.find(e=>e.type===this._cardPickerSelectedType)?.name||this._cardPickerSelectedType;return r.qy`
      <div class="card-picker-overlay" @click=${this._handlePickerOverlayClick}>
        <div class="card-picker-dialog" @click=${e=>e.stopPropagation()}>
          <div class="card-picker-header">
            <button
              class="card-picker-icon-btn"
              @click=${()=>{this._cardPickerStep="type";const e=this.shadowRoot?.querySelector(".card-editor-visual-host");e&&(e.innerHTML=""),this._cardPickerHasVisualEditor=!1}}
              title="Zurück"
            >
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
                  <textarea
                    class="card-editor-yaml-area"
                    .value=${this._cardPickerYaml}
                    @input=${this._cardPickerYamlChanged}
                    spellcheck="false"
                  ></textarea>
                `}
          </div>
          <div class="card-picker-footer">
            <button class="btn-secondary" @click=${this._closeCardPicker}>Abbrechen</button>
            <button class="btn-primary" @click=${this._confirmCardPicker}>Speichern</button>
          </div>
        </div>
      </div>
    `}}function be(e,t){return t.areas_options?.[e]?.groups_options?.badges?.additional||[]}function we(e,t){const i=new Set;for(const r of e){const e=t.states[r];if(!e)continue;const o=e.attributes?.device_class;(0,te.g7)(o)&&i.add(r)}return i}function ke(e,t){const i=t.areas_options?.[e]?.groups_options?.badges;return{namesVisible:i?.names_visible||[],namesHidden:i?.names_hidden||[]}}function xe(e,t){const i=t.areas_options?.[e];if(!i||!i.groups_options)return{};const r={};for(const[e,t]of Object.entries(i.groups_options))t.hidden&&(r[e]=t.hidden);return r}function $e(e,t){const i=t.areas_options?.[e];if(!i||!i.groups_options)return{};const r={};for(const[e,t]of Object.entries(i.groups_options))t.order&&(r[e]=t.order);return r}ve.properties={_config:{state:!0},_expandedAreas:{state:!0},_expandedGroups:{state:!0},_expandedWeatherBlocks:{state:!0},_cardPickerOpen:{state:!0},_cardPickerStep:{state:!0},_cardPickerSearch:{state:!0},_cardPickerSelectedType:{state:!0},_cardPickerYaml:{state:!0},_cardPickerHasVisualEditor:{state:!0}},ve.styles=[re,r.AH`
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
      .advanced-content {
        margin-top: 16px;
        padding-left: 12px;
        border-left: 3px solid var(--divider-color);
      }
    `],ve._sectionMeta=new Map([["overview",{icon:"mdi:home-outline",labelKey:"sections.overview"}],["custom_cards",{icon:"mdi:cards",labelKey:"sections.custom_cards"}],["custom_sections",{icon:"mdi:view-grid-plus-outline",labelKey:"sections.custom_sections"}],["areas",{icon:"mdi:floor-plan",labelKey:"sections.areas"}],["weather",{icon:"mdi:weather-partly-cloudy",labelKey:"sections.weather"}],["energy",{icon:"mdi:lightning-bolt",labelKey:"sections.energy"}],["plants",{icon:"mdi:flower-outline",labelKey:"sections.plants"}],["agenda",{icon:"mdi:calendar-outline",labelKey:"sections.agenda"}],["todos",{icon:"mdi:checkbox-marked-circle-outline",labelKey:"sections.todos"}],["persons",{icon:"mdi:account-group-outline",labelKey:"sections.persons"}],["vacuums",{icon:"mdi:robot-vacuum",labelKey:"sections.vacuums"}],["maintenance",{icon:"mdi:wrench-outline",labelKey:"sections.maintenance"}]]),ve._weatherStartBlockMeta=new Map(Object.entries({clock:{icon:"mdi:clock-outline",labelKey:"weather_start_blocks.clock"},date:{icon:"mdi:calendar-today",labelKey:"weather_start_blocks.date"},summaries:{icon:"mdi:view-dashboard-outline",labelKey:"weather_start_blocks.summaries"},favorites:{icon:"mdi:star",labelKey:"weather_start_blocks.favorites"},light_favorites:{icon:"mdi:lightbulb-star-outline",labelKey:"weather_start_blocks.light_favorites"},alarm:{icon:"mdi:shield-home",labelKey:"weather_start_blocks.alarm"},house_mode:{icon:"mdi:home-switch-outline",labelKey:"weather_start_blocks.house_mode"},search:{icon:"mdi:magnify",labelKey:"weather_start_blocks.search"},overview:{icon:"mdi:overscan",labelKey:"weather_start_blocks.overview"},weather_current:{icon:"mdi:weather-partly-cloudy",labelKey:"weather_start_blocks.weather_current"},weather_hourly:{icon:"mdi:clock-time-four-outline",labelKey:"weather_start_blocks.weather_hourly"},weather_daily:{icon:"mdi:calendar-week",labelKey:"weather_start_blocks.weather_daily"},weather_details:{icon:"mdi:gauge",labelKey:"weather_start_blocks.weather_details"},energy:{icon:"mdi:lightning-bolt",labelKey:"weather_start_blocks.energy"},plants:{icon:"mdi:flower",labelKey:"weather_start_blocks.plants"},agenda:{icon:"mdi:calendar",labelKey:"weather_start_blocks.agenda"},todos:{icon:"mdi:check-circle-outline",labelKey:"weather_start_blocks.todos"},persons:{icon:"mdi:account-group",labelKey:"weather_start_blocks.persons"},vacuums:{icon:"mdi:robot-vacuum",labelKey:"weather_start_blocks.vacuums"},maintenance:{icon:"mdi:wrench-clock",labelKey:"weather_start_blocks.maintenance"},areas:{icon:"mdi:floor-plan",labelKey:"weather_start_blocks.areas"},custom_cards:{icon:"mdi:cards",labelKey:"weather_start_blocks.custom_cards"},custom_sections:{icon:"mdi:view-grid-plus-outline",labelKey:"weather_start_blocks.custom_sections"}})),ve._stackMeta=new Map([["energy",{icon:"mdi:lightning-bolt",labelKey:"stacks.energy"}],["cameras",{icon:"mdi:cctv",labelKey:"stacks.cameras"}],["lights",{icon:"mdi:lightbulb",labelKey:"stacks.lights"}],["locks",{icon:"mdi:lock",labelKey:"stacks.locks"}],["climate",{icon:"mdi:thermostat",labelKey:"stacks.climate"}],["covers",{icon:"mdi:window-shutter",labelKey:"stacks.covers"}],["covers_window",{icon:"mdi:window-open-variant",labelKey:"stacks.covers_window"}],["media",{icon:"mdi:speaker",labelKey:"stacks.media"}],["scenes",{icon:"mdi:palette",labelKey:"stacks.scenes"}],["switches",{icon:"mdi:toggle-switch",labelKey:"stacks.switches"}],["misc",{icon:"mdi:light-switch",labelKey:"stacks.misc"}],["room_pins",{icon:"mdi:pin",labelKey:"stacks.room_pins"}]]),customElements.define("dashboard-strategy-editor",ve)}}]);