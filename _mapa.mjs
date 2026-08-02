// Captura del mapa de la portada.
//
// `clip` va en coordenadas de PÁGINA y getBoundingClientRect las da de
// viewport: sin sumar el scroll el recorte apunta a otro lado y sale en blanco.
// Ese error me hizo creer una vez que el mapa no cargaba.
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { setTimeout as dormir } from 'node:timers/promises';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const P = 9266;
const nav = spawn(EDGE, [
  `--remote-debugging-port=${P}`,
  `--user-data-dir=${process.env.TEMP}\\perfil-mapa3`,
  '--headless=new', '--no-first-run', '--hide-scrollbars', 'about:blank',
], { stdio: 'ignore' });

let u;
for (let i = 0; i < 60; i++) {
  try { u = (await (await fetch(`http://127.0.0.1:${P}/json/version`)).json()).webSocketDebuggerUrl; break; }
  catch { await dormir(250); }
}
const ws = new WebSocket(u);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0; const pend = new Map(); const oy = [];
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id !== undefined) { const q = pend.get(m.id); pend.delete(m.id); q.res(m.result); }
  else oy.forEach((o) => o(m));
});
const env = (me, pa = {}, s) => { const n = ++id; ws.send(JSON.stringify({ id: n, method: me, params: pa, sessionId: s })); return new Promise((res) => pend.set(n, { res })); };

const { targetId } = await env('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await env('Target.attachToTarget', { targetId, flatten: true });
const S = (m, p) => env(m, p, sessionId);
await S('Page.enable'); await S('Runtime.enable');
await S('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
const car = new Promise((r) => oy.push((m) => m.sessionId === sessionId && m.method === 'Page.loadEventFired' && r()));
await S('Page.navigate', { url: 'http://localhost:4321/' });
await Promise.race([car, dormir(15000)]);

await S('Runtime.evaluate', { expression: `document.querySelector('iframe')?.scrollIntoView({ block: 'center' })` });
await dormir(7000);

const caja = JSON.parse((await S('Runtime.evaluate', {
  expression: `(() => {
    const r = document.querySelector('iframe').getBoundingClientRect();
    return JSON.stringify({
      x: Math.round(r.left + window.scrollX),
      y: Math.round(r.top + window.scrollY),
      width: Math.round(r.width),
      height: Math.round(r.height),
    });
  })()`,
  returnByValue: true,
})).result.value);

const shot = await S('Page.captureScreenshot', { format: 'png', clip: { ...caja, scale: 1 } });
writeFileSync('_mapa.png', Buffer.from(shot.data, 'base64'));
console.log('captura →  _mapa.png', caja);

nav.kill(); ws.close(); process.exit(0);
