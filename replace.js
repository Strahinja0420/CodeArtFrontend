import fs from 'fs';
import path from 'path';

const srcDir = './src';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        let filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(filePath));
        } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
            results.push(filePath);
        }
    });
    return results;
}

const files = walk(srcDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const initial = content;

    content = content.replace(/\btext-white(\/[0-9]+)?\b/g, 'text-fg$1');
    content = content.replace(/\bborder-white(\/[0-9]+)?\b/g, 'border-fg$1');
    content = content.replace(/\bbg-white(\/[0-9]+)?\b/g, 'bg-fg$1');
    content = content.replace(/\bring-white(\/[0-9]+)?\b/g, 'ring-fg$1');
    content = content.replace(/\bshadow-white(\/[0-9]+)?\b/g, 'shadow-fg$1');

    // Quick fix: revert text-fg to text-white if adjacent to bg-accent
    // We can just rely on the fact that people use text-white inside buttons which typically have bg-accent
    content = content.replace(/bg-accent([^"']*)text-fg/g, 'bg-accent$1text-white');

    // also what about "text-white" in hover states? hover:text-fg is fine.
    if (initial !== content) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated', file);
    }
});

console.log('Done replacing white with fg');
