const fs = require('fs');
const file = 'app/globals.css';
let content = fs.readFileSync(file, 'utf8');

const typographyTokens = `
  /* ── Fluid Typography (Clamp) ────────────────────────────── */
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.8125rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.3vw, 0.9375rem);
  --text-base: clamp(1rem, 0.9rem + 0.4vw, 1.125rem);
  --text-lg: clamp(1.125rem, 1rem + 0.5vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.3rem + 1vw, 1.875rem);
  --text-3xl: clamp(1.875rem, 1.6rem + 1.25vw, 2.25rem);
  --text-4xl: clamp(2.25rem, 1.9rem + 1.5vw, 3rem);
  
  --spacing-sms-xs: clamp(0.25rem, 0.2rem + 0.25vw, 0.5rem);
  --spacing-sms-sm: clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem);
  --spacing-sms-md: clamp(1rem, 0.8rem + 1vw, 1.5rem);
  --spacing-sms-lg: clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem);
  --spacing-sms-xl: clamp(2rem, 1.6rem + 2vw, 3rem);
`;

// Insert after @theme inline {
content = content.replace('@theme inline {', '@theme inline {' + typographyTokens);

fs.writeFileSync(file, content);
console.log('Typography tokens injected.');
