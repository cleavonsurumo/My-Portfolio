const fs = require('fs');
const lines = fs.readFileSync('components/sections/Contact2.tsx','utf8').split(/\r?\n/);
for(let i=0;i<lines.length;i++){console.log((i+1).toString().padStart(3,' ')+': '+lines[i]);}
