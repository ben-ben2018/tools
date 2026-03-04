const fs = require('fs');
const path = require('path');

const SOURCE_ENCODE_DIR = path.join(__dirname, 'sourceEncode');
const TARGET_DIR = path.join(__dirname, 'source');
const PASSWORD = '0217';

function encode(text, key) {
  if (!key) return text;

  let result = '';
  const keyLength = key.length;

  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const keyChar = key[i % keyLength];
    const shift = keyChar.charCodeAt(0) + i;
    const encryptedCode = charCode + shift;
    result += String.fromCharCode(encryptedCode);
  }
  return result;
}

if (!fs.existsSync(SOURCE_ENCODE_DIR)) {
  console.error('sourceEncode 目录不存在');
  process.exit(1);
}

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

const files = fs.readdirSync(SOURCE_ENCODE_DIR);

for (const filename of files) {
  const srcPath = path.join(SOURCE_ENCODE_DIR, filename);
  if (!fs.statSync(srcPath).isFile()) continue;

  const content = fs.readFileSync(srcPath, 'utf8');
  const encrypted = encode(content, PASSWORD);
  const destPath = path.join(TARGET_DIR, filename);
  fs.writeFileSync(destPath, encrypted, 'utf8');
  console.log('已加密: ' + filename + ' -> source/' + filename);
}

console.log('完成，共处理 ' + files.filter(f => fs.statSync(path.join(SOURCE_ENCODE_DIR, f)).isFile()).length + ' 个文件。');
