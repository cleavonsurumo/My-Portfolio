const fs = require('fs');
const s = fs.readFileSync('components/sections/Contact2.tsx','utf8');
let stack=[];const pairs={'{':'}','(':')','[':']'};for(let i=0;i<s.length;i++){const ch=s[i];if(ch==='{"'.includes){} }
let brace=0;for(let i=0;i<s.length;i++){const ch=s[i];if(ch==='{') brace++; if(ch==='}') brace--; if(brace<0){console.log('Extra } at index',i); break;}}
console.log('brace balance',brace);
