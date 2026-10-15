const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = [...walk('app'), ...walk('components')];

const replacements = [
    // Backgrounds
    { regex: /bg-white\s+dark:bg-zinc-9\d0/g, replacement: "bg-card" },
    { regex: /bg-white/g, replacement: "bg-card" }, // Aggressive but usually correct for cards
    { regex: /bg-zinc-50\s+dark:bg-zinc-900\/50/g, replacement: "bg-neutral-100 dark:bg-neutral-800" },
    { regex: /bg-zinc-50\s+dark:bg-zinc-900/g, replacement: "bg-neutral-100 dark:bg-neutral-800" },
    { regex: /bg-zinc-100\s+dark:bg-zinc-800/g, replacement: "bg-neutral-100 dark:bg-neutral-800" },
    { regex: /bg-gray-50\s+dark:bg-zinc-800/g, replacement: "bg-neutral-100 dark:bg-neutral-800" },
    { regex: /bg-zinc-950/g, replacement: "bg-neutral-900" },
    { regex: /bg-zinc-50\/50/g, replacement: "bg-neutral-50/50" },
    { regex: /bg-zinc-50/g, replacement: "bg-neutral-50" },
    
    // Text
    { regex: /text-zinc-500\s+dark:text-zinc-400/g, replacement: "text-muted-foreground" },
    { regex: /text-zinc-600\s+dark:text-zinc-400/g, replacement: "text-muted-foreground" },
    { regex: /text-gray-500\s+dark:text-gray-400/g, replacement: "text-muted-foreground" },
    { regex: /text-zinc-900\s+dark:text-zinc-100/g, replacement: "text-card-foreground" },
    { regex: /text-zinc-900/g, replacement: "text-card-foreground" },
    { regex: /text-zinc-500/g, replacement: "text-muted-foreground" },
    { regex: /text-zinc-600/g, replacement: "text-muted-foreground" },
    { regex: /text-zinc-400/g, replacement: "text-muted-foreground" },
    { regex: /text-gray-500/g, replacement: "text-muted-foreground" },
    
    // Borders
    { regex: /border-zinc-200\s+dark:border-zinc-800/g, replacement: "border-border" },
    { regex: /border-zinc-100\s+dark:border-zinc-800/g, replacement: "border-border" },
    { regex: /border-gray-200\s+dark:border-zinc-800/g, replacement: "border-border" },
    { regex: /border-zinc-100/g, replacement: "border-border" },
    { regex: /border-zinc-200/g, replacement: "border-border" },
    { regex: /border-zinc-800/g, replacement: "border-border" },
    { regex: /border-gray-200/g, replacement: "border-border" },
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    replacements.forEach(({regex, replacement}) => {
        content = content.replace(regex, replacement);
    });
    
    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    }
});
