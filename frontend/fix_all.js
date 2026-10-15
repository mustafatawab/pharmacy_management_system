const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            if(!file.includes('node_modules') && !file.includes('.next')) {
                results = results.concat(walk(file));
            }
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = [...walk('app'), ...walk('components')];

const replacements = [
    // Text Colors
    { regex: /text-gray-900\s+dark:text-white/g, replacement: "text-card-foreground" },
    { regex: /text-gray-900\s+dark:text-gray-100/g, replacement: "text-card-foreground" },
    { regex: /text-gray-900/g, replacement: "text-card-foreground" },
    { regex: /text-gray-800/g, replacement: "text-card-foreground" },
    { regex: /text-gray-700\s+dark:text-gray-100/g, replacement: "text-card-foreground" },
    { regex: /text-gray-700\s+dark:text-gray-200/g, replacement: "text-card-foreground" },
    { regex: /text-gray-700/g, replacement: "text-card-foreground" },
    
    { regex: /text-gray-600\s+dark:text-gray-300/g, replacement: "text-muted-foreground" },
    { regex: /text-gray-600\s+dark:text-gray-400/g, replacement: "text-muted-foreground" },
    { regex: /text-gray-600/g, replacement: "text-muted-foreground" },
    
    { regex: /text-gray-500\s+dark:text-gray-400/g, replacement: "text-muted-foreground" },
    { regex: /text-gray-500/g, replacement: "text-muted-foreground" },
    
    { regex: /text-gray-400/g, replacement: "text-muted-foreground" },
    { regex: /text-gray-300/g, replacement: "text-muted-foreground" },

    { regex: /text-zinc-900\s+dark:text-zinc-100/g, replacement: "text-card-foreground" },
    { regex: /text-zinc-800/g, replacement: "text-card-foreground" },
    { regex: /text-zinc-700/g, replacement: "text-card-foreground" },
    { regex: /text-zinc-600/g, replacement: "text-muted-foreground" },
    { regex: /text-zinc-500/g, replacement: "text-muted-foreground" },
    { regex: /text-zinc-400/g, replacement: "text-muted-foreground" },
    
    { regex: /dark:text-white/g, replacement: "" }, // Clean up leftovers

    // Background Colors
    { regex: /bg-gray-50\s+dark:bg-\[\#212121\]/g, replacement: "bg-neutral-50 dark:bg-neutral-900" },
    { regex: /bg-gray-50\s+dark:bg-\[\#3F3F3F\]/g, replacement: "bg-neutral-100 dark:bg-neutral-800" },
    { regex: /bg-gray-50\s+dark:bg-zinc-800\/50/g, replacement: "bg-neutral-50 dark:bg-neutral-900" },
    { regex: /bg-gray-50\s+dark:bg-zinc-800/g, replacement: "bg-neutral-50 dark:bg-neutral-900" },
    { regex: /bg-gray-50/g, replacement: "bg-neutral-50" },
    
    { regex: /bg-gray-100\s+dark:bg-gray-800/g, replacement: "bg-neutral-100 dark:bg-neutral-800" },
    { regex: /bg-gray-100/g, replacement: "bg-neutral-100" },
    
    { regex: /bg-white\s+dark:bg-\[\#212121\]/g, replacement: "bg-card" },
    { regex: /bg-white\s+dark:bg-\[\#2F2F2F\]/g, replacement: "bg-card" },
    
    { regex: /dark:bg-\[\#212121\]/g, replacement: "dark:bg-neutral-900" },
    { regex: /dark:bg-\[\#2F2F2F\]/g, replacement: "dark:bg-neutral-800" },
    { regex: /dark:bg-\[\#3F3F3F\]/g, replacement: "dark:bg-neutral-700" },

    { regex: /bg-zinc-50\s+dark:bg-zinc-900/g, replacement: "bg-neutral-50 dark:bg-neutral-900" },
    { regex: /bg-zinc-100\s+dark:bg-zinc-800/g, replacement: "bg-neutral-100 dark:bg-neutral-800" },
    { regex: /bg-zinc-800\/50/g, replacement: "bg-neutral-800/50" },
    { regex: /bg-zinc-800/g, replacement: "bg-neutral-800" },

    { regex: /hover:bg-gray-50\s+dark:hover:bg-\[\#212121\]/g, replacement: "hover:bg-neutral-50 dark:hover:bg-neutral-900" },
    { regex: /hover:bg-gray-50\s+dark:hover:bg-\[\#2F2F2F\]/g, replacement: "hover:bg-neutral-50 dark:hover:bg-neutral-800" },
    { regex: /hover:bg-gray-50\s+dark:hover:bg-\[\#3F3F3F\]/g, replacement: "hover:bg-neutral-50 dark:hover:bg-neutral-700" },
    { regex: /hover:bg-gray-50/g, replacement: "hover:bg-neutral-50" },
    
    { regex: /hover:bg-zinc-100\s+dark:hover:bg-zinc-800/g, replacement: "hover:bg-neutral-100 dark:hover:bg-neutral-800" },
    { regex: /hover:bg-zinc-50/g, replacement: "hover:bg-neutral-50" },
    
    // Border Colors
    { regex: /border-gray-100\s+dark:border-\[\#2F2F2F\]/g, replacement: "border-border" },
    { regex: /border-gray-200\s+dark:border-\[\#2F2F2F\]/g, replacement: "border-border" },
    { regex: /border-gray-300\s+dark:border-\[\#3F3F3F\]/g, replacement: "border-border" },
    { regex: /border-gray-100/g, replacement: "border-border" },
    { regex: /border-gray-200/g, replacement: "border-border" },
    { regex: /border-gray-300/g, replacement: "border-border" },
    
    { regex: /border-zinc-100/g, replacement: "border-border" },
    { regex: /border-zinc-200/g, replacement: "border-border" },
    { regex: /border-zinc-300/g, replacement: "border-border" },
    { regex: /border-zinc-800/g, replacement: "border-border" },
    
    { regex: /dark:border-\[\#2F2F2F\]/g, replacement: "" },
    { regex: /dark:border-\[\#3F3F3F\]/g, replacement: "" },
    { regex: /dark:border-gray-600/g, replacement: "" },

    // Typography enforcement for standard heading elements
    { regex: /<h1 className="([^"]*)"/g, replacement: (match, p1) => {
        if (!p1.includes("h1") && !p1.includes("font-serif")) return `<h1 className="h1 ${p1}"`;
        return match;
    }},
    { regex: /<h2 className="([^"]*)"/g, replacement: (match, p1) => {
        if (!p1.includes("h2") && !p1.includes("font-serif")) return `<h2 className="h2 ${p1}"`;
        return match;
    }},
    { regex: /<h3 className="([^"]*)"/g, replacement: (match, p1) => {
        if (!p1.includes("h3") && !p1.includes("font-serif")) return `<h3 className="h3 ${p1}"`;
        return match;
    }}
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    replacements.forEach(({regex, replacement}) => {
        if (typeof replacement === 'function') {
            content = content.replace(regex, replacement);
        } else {
            content = content.replace(regex, replacement);
        }
    });
    
    // Clean up multiple spaces that might have been created
    content = content.replace(/className=" /g, 'className="');
    content = content.replace(/  +/g, ' ');
    
    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    }
});
