// Verifica que todo href/src local do index.html existe e que há title, lang e viewport.
import { readFileSync, existsSync } from 'node:fs';
const html = readFileSync('index.html', 'utf8');
const errs = [];
for (const m of html.matchAll(/\b(?:href|src)="(?!https?:|#|mailto:)([^"#]+)"/g)) if (!existsSync(m[1])) errs.push('arquivo ausente: ' + m[1]);
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
for (const m of html.matchAll(/href="#([^"]+)"/g)) if (!ids.has(m[1])) errs.push('âncora sem alvo: #' + m[1]);
if (!/<html lang=/.test(html)) errs.push('sem lang');
if (!/<title>.+<\/title>/.test(html)) errs.push('sem title');
if (!/name="viewport"/.test(html)) errs.push('sem viewport');
if (errs.length) { console.error(errs.join('\n')); process.exit(1); }
console.log('ok: links, âncoras, lang, title e viewport');
