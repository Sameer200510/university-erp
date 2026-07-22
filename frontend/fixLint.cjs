const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Replace "const name = async () => {" with "async function name() {"
            const regex = /const\s+([a-zA-Z0-9_]+)\s*=\s*async\s*\(\)\s*=>\s*\{/g;
            if (regex.test(content)) {
                content = content.replace(regex, "async function $1() {");
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Fixed:', fullPath);
            }
        }
    });
}

processDirectory(path.join(__dirname, 'src'));
console.log('Done!');
