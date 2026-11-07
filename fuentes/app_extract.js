(() => {
'use strict';

const T = 16;                               // tamaño de casilla en el lienzo interno
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ===================================================== sprites 8x8 */
function sprite(rows, pal) {
  const c = document.createElement('canvas');
  c.width = 8; c.height = 8;
  const g = c.getContext('2d');
  rows.forEach((row, y) => [...row].forEach((ch, x) => {
    if (pal[ch]) { g.fillStyle = pal[ch]; g.fillRect(x, y, 1, 1); }
  }));
  return c;
}
const SPR = {
  player: sprite([
    '..cccc..', '.cccccc.', '.ffffff.', '.fkffkf.', '.ffffff.', 'fbbbbbbf', '.bbwwbb.', '..l..l..',
  ], { c: '#ef7d57', f: '#ffd4a8', k: '#1a1c2c', b: '#a7f070', w: '#f4f4f4', l: '#333c57' }),
  bug: sprite([
    'r..rr..r', '.r.rr.r.', '..rrrr..', '.rerrer.', 'rrrrrrrr', '.rrrrrr.', 'r.r..r.r', 'r......r',
  ], { r: '#e8475f', e: '#f4f4f4' }),
  boss: sprite([
    'm......m', 'mm.mm.mm', 'mmmmmmmm', 'mymmmmym', 'mmmmmmmm', 'mmwmwmwm', '.mmmmmm.', '..m..m..',
  ], { m: '#d62e8a', y: '#ffcd75', w: '#f4f4f4' }),
  termPend: sprite([
    'gggggggg', 'gddddddg', 'gdaaaadg', 'gdaaaadg', 'gdaaaadg', 'gddddddg', '.gggggg.', 'gggggggg',
  ], { g: '#94b0c2', d: '#1a1c2c', a: '#29366f' }),
  termDone: sprite([
    'gggggggg', 'gddddddg', 'gdaaasdg', 'gdsasadg', 'gdasaadg', 'gddddddg', '.gggggg.', 'gggggggg',
  ], { g: '#94b0c2', d: '#1a1c2c', a: '#1d7f43', s: '#a7f070' }),
  termFail: sprite([
    'gggggggg', 'gddddddg', 'gdsaasdg', 'gdasasdg', 'gdsaasdg', 'gddddddg', '.gggggg.', 'gggggggg',
  ], { g: '#94b0c2', d: '#1a1c2c', a: '#5d1f35', s: '#e8475f' }),
  doorShut: sprite([
    'dddddddd', 'dbbbbbbd', 'dbbbbbbd', 'dbbyybbd', 'dbbyybbd', 'dbbbbbbd', 'dbbbbbbd', 'dddddddd',
  ], { d: '#5d275d', b: '#b13e53', y: '#ffcd75' }),
  doorOpen: sprite([
    'gggggggg', 'g000000g', 'g000000g', 'g000e00g', 'g00eee0g', 'g000e00g', 'g000000g', 'gggggggg',
  ], { g: '#38b764', '0': '#05060d', e: '#a7f070' }),
  bugWhite: sprite([
    'r..rr..r', '.r.rr.r.', '..rrrr..', '.rrrrrr.', 'rrrrrrrr', '.rrrrrr.', 'r.r..r.r', 'r......r',
  ], { r: '#f4f4f4' }),
  heart: sprite([
    '........', '.rr..rr.', 'rwrrrrrr', 'rrrrrrrr', 'rrrrrrrr', '.rrrrrr.', '..rrrr..', '...rr...',
  ], { r: '#ef476f', w: '#ffd4de' }),
  heartOff: sprite([
    '........', '.rr..rr.', 'rrrrrrrr', 'rrrrrrrr', 'rrrrrrrr', '.rrrrrr.', '..rrrr..', '...rr...',
  ], { r: '#333c57' }),
};
const url = (c) => c.toDataURL();
$('#logo').src = url(SPR.boss);
$('#logo2').src = url(SPR.boss);

/* temas de color por sala */
const THEMES = [
  { f1: '#1b2145', f2: '#1f2650', spk: '#2c3a78', wall: '#3b5dc9', mortar: '#29366f', light: '#41a6f6' },
  { f1: '#12301f', f2: '#163a25', spk: '#1f5a3a', wall: '#257179', mortar: '#134c4c', light: '#38b764' },
  { f1: '#241636', f2: '#2a1a40', spk: '#47245f', wall: '#7b4a9e', mortar: '#41214f', light: '#a56dc6' },
  { f1: '#3a2418', f2: '#432a1b', spk: '#6a4026', wall: '#b2603a', mortar: '#6e3a24', light: '#ef7d57' },
  { f1: '#2f1424', f2: '#381829', spk: '#5d275d', wall: '#b13e53', mortar: '#5d1f35', light: '#ef7d57' },
];

function drawWall(g, px, py, th) {
  g.fillStyle = th.wall; g.fillRect(px, py, T, T);
  g.fillStyle = th.light; g.fillRect(px, py + 1, T, 1);
  g.fillStyle = th.mortar;
  g.fillRect(px, py, T, 1); g.fillRect(px, py + 8, T, 1);
  g.fillRect(px + 8, py, 1, 8); g.fillRect(px, py + 9, 1, 7);
  g.fillRect(px, py + 15, T, 1);
  g.fillStyle = th.light; g.fillRect(px, py + 9, T, 1);
}
function drawFloor(g, x, y, th) {
  g.fillStyle = (x + y) % 2 ? th.f1 : th.f2;
  g.fillRect(x * T, y * T, T, T);
  const h = ((x * 73856093) ^ (y * 19349663)) >>> 0;
  g.fillStyle = th.spk;
  if (h % 3 === 0) g.fillRect(x * T + 2 + (h >> 3) % 11, y * T + 2 + (h >> 7) % 11, 2, 1);
  if (h % 4 === 0) g.fillRect(x * T + 2 + (h >> 5) % 11, y * T + 2 + (h >> 9) % 11, 1, 1);
}
function buildBackground(s) {
  const th = THEMES[(s.sala - 1) % THEMES.length];
  const c = document.createElement('canvas');
  c.width = s.mapa.ancho * T; c.height = s.mapa.alto * T;
  const g = c.getContext('2d');
  const muros = new Set(s.mapa.muros.map((m) => m[0] + ',' + m[1]));
  for (let y = 0; y < s.mapa.alto; y++) {
    for (let x = 0; x < s.mapa.ancho; x++) {
      if (muros.has(x + ',' + y)) drawWall(g, x * T, y * T, th); else drawFloor(g, x, y, th);
    }
  }
  return c;
}

/* ===================================================== estado de la app */
let apiFn = null, S = null, bg = null, bgUid = -1, lastBannerSala = 0;
const cv = $('#cv'), ctx = cv.getContext('2d');
ctx.imageSmoothingEnabled = false;

function call(accion, ...args) {
  if (!apiFn) return;
  const r = JSON.parse(apiFn(accion, ...args));
  const prev = S;
  S = r.estado;
  if (accion !== 'consultar') enqueueTrace(accion, args, r.traza);
  onState(prev, S);
}

/* ===================================================== efectos de golpe */
// Python avisa con un evento "golpe"; aquí solo se anima: embestida, destello y explosión de píxeles
const hits = [];
let lunge = null;
const SPARK = ['#f4f4f4', '#ffcd75', '#ef7d57', '#e8475f', '#e8475f'];
function addHit(ev) {
  const t0 = performance.now();
  lunge = { dx: ev.dx, dy: ev.dy, t0 };
  const parts = [];
  for (let i = 0; i < 16; i++) {
    parts.push({ a: Math.random() * Math.PI * 2, s: 35 + Math.random() * 80, c: SPARK[i % SPARK.length], z: Math.random() < .4 ? 2 : 1 });
  }
  hits.push({ x: ev.x, y: ev.y, t0, parts });
  cv.classList.remove('tap'); void cv.offsetWidth; cv.classList.add('tap');
}
function drawHits(t) {
  for (let i = hits.length - 1; i >= 0; i--) {
    const h = hits[i], e = t - h.t0;
    if (e > 800) { hits.splice(i, 1); continue; }
    const bx = h.x * T, by = h.y * T;
    // bug aturdido: parpadea blanco, tiembla y se aplasta
    if (e < 150) {
      const sq = 1 - .35 * (e / 150), shake = Math.round(Math.sin(e / 18) * 2);
      ctx.drawImage(Math.floor(e / 50) % 2 ? SPR.bug : SPR.bugWhite, bx + shake, by + Math.round(T * (1 - sq)), T, Math.round(T * sq));
    }
    // tajo diagonal
    if (e < 140) {
      const len = Math.ceil(11 * Math.min(1, e / 60));
      for (let n = 0; n < 3; n++) {
        ctx.fillStyle = n === 1 ? '#ffcd75' : '#f4f4f4';
        for (let j = 0; j < len; j++) ctx.fillRect(bx + j + n * 3 - 1, by + 2 + j, 1, 1);
      }
    }
    // explosión: anillo de chispas, partículas con gravedad y texto flotante
    if (e >= 110) {
      const dt = (e - 110) / 1000, cx = bx + 8, cy = by + 8;
      if (dt < .25) {
        const r = 3 + dt * 60;
        ctx.fillStyle = '#ffcd75';
        for (let k = 0; k < 8; k++) ctx.fillRect(Math.round(cx + Math.cos(k * Math.PI / 4) * r) - 1, Math.round(cy + Math.sin(k * Math.PI / 4) * r) - 1, 2, 2);
      }
      h.parts.forEach((p) => {
        ctx.globalAlpha = Math.max(0, 1 - dt / .68);
        ctx.fillStyle = p.c;
        ctx.fillRect(Math.round(cx + Math.cos(p.a) * p.s * dt), Math.round(cy + Math.sin(p.a) * p.s * dt + 130 * dt * dt), p.z, p.z);
      });
      ctx.globalAlpha = Math.max(0, 1 - dt / .6);
      ctx.font = '6px "Press Start 2P", monospace'; ctx.textBaseline = 'alphabetic';
      const tx = Math.max(2, Math.min(cv.width - 40, bx - 12)), ty = Math.max(8, Math.round(by - 2 - dt * 22));
      ctx.fillStyle = '#5d275d'; ctx.fillText('SPLAT!', tx + 1, ty + 1);
      ctx.fillStyle = '#ffcd75'; ctx.fillText('SPLAT!', tx, ty);
      ctx.globalAlpha = 1;
    }
  }
}

// Corazón recogido: un corazón sube, chispas verdes y rosas, y "+1 VIDA"
const heals = [];
const HEAL_C = ['#a7f070', '#f4f4f4', '#ff6fae', '#ffcd75'];
function addHeal(ev) {
  const parts = [];
  for (let i = 0; i < 12; i++) parts.push({ a: -Math.PI / 2 + (Math.random() - .5) * 2.4, s: 25 + Math.random() * 45, c: HEAL_C[i % HEAL_C.length] });
  heals.push({ x: ev.x, y: ev.y, t0: performance.now(), parts });
}
function drawHeals(t) {
  for (let i = heals.length - 1; i >= 0; i--) {
    const h = heals[i], e = t - h.t0;
    if (e > 1000) { heals.splice(i, 1); continue; }
    const k = e / 1000, cx = h.x * T + 8, cy = h.y * T + 8;
    ctx.globalAlpha = Math.max(0, 1 - Math.max(0, k - .45) / .55);
    ctx.drawImage(SPR.heart, h.x * T, Math.round(h.y * T - 4 - k * 22), T, T);
    h.parts.forEach((p) => {
      ctx.fillStyle = p.c;
      ctx.fillRect(Math.round(cx + Math.cos(p.a) * p.s * k), Math.round(cy + Math.sin(p.a) * p.s * k), 2, 2);
    });
    ctx.font = '6px "Press Start 2P", monospace'; ctx.textBaseline = 'alphabetic';
    const tx = Math.max(2, Math.min(cv.width - 46, h.x * T - 14)), ty = Math.max(8, Math.round(h.y * T - 6 - k * 26));
    ctx.fillStyle = '#134c4c'; ctx.fillText('+1 VIDA', tx + 1, ty + 1);
    ctx.fillStyle = '#a7f070'; ctx.fillText('+1 VIDA', tx, ty);
    ctx.globalAlpha = 1;
  }
}

/* ===================================================== dibujo */
function frame(t) {
  requestAnimationFrame(frame);
  ctx.clearRect(0, 0, cv.width, cv.height);
  if (!S || !S.mapa || !bg) return;
  ctx.drawImage(bg, 0, 0);

  const blink = Math.floor(t / 450) % 2;
  const bob = Math.floor(t / 380) % 2;

  // puerta
  const d = S.puerta;
  ctx.drawImage(S.puerta.abierta ? SPR.doorOpen : SPR.doorShut, d.x * T, d.y * T, T, T);
  if (S.puerta.abierta) {
    ctx.fillStyle = blink ? 'rgba(167,240,112,.25)' : 'rgba(167,240,112,.1)';
    ctx.fillRect((d.x - 1) * T, d.y * T, T, T);
  }
  if (S.jefe) {
    const wob = Math.floor(t / 220) % 2;
    ctx.drawImage(SPR.boss, d.x * T, d.y * T - 1 + wob, T, T);
  }

  // nodos
  const [px, py] = S.jugador;
  S.terminales.forEach((n, i) => {
    const near = Math.abs(n.x - px) + Math.abs(n.y - py) === 1;
    const spr = n.hecha ? (n.acierto ? SPR.termDone : SPR.termFail) : SPR.termPend;
    ctx.drawImage(spr, n.x * T, n.y * T, T, T);
    if (!n.hecha) {
      ctx.fillStyle = blink ? '#73eff7' : '#f4f4f4';
      ctx.font = '7px "Press Start 2P", monospace';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(String(i + 1), n.x * T + 5, n.y * T + 11);
      if (near) {
        ctx.fillStyle = '#ffcd75';
        ctx.fillRect(n.x * T + 7, n.y * T - 6 - bob, 2, 4);
        ctx.fillRect(n.x * T + 7, n.y * T - 1 - bob, 2, 2);
      }
    }
  });

  // corazones (recuperan una vida)
  S.corazones.forEach((c, i) => {
    const o = Math.floor(t / 320 + i) % 2;
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(c[0] * T + 4, c[1] * T + 14, 8, 2);
    ctx.drawImage(SPR.heart, c[0] * T, c[1] * T - 1 - o, T, T);
    if (Math.floor(t / 260 + i * 3) % 4 === 0) { ctx.fillStyle = '#f4f4f4'; ctx.fillRect(c[0] * T + 11, c[1] * T + 2 - o, 1, 3); ctx.fillRect(c[0] * T + 10, c[1] * T + 3 - o, 3, 1); }
  });

  // bugs
  S.bugs.forEach((b, i) => {
    const o = Math.floor(t / 300 + i) % 2;
    ctx.drawImage(SPR.bug, b[0] * T, b[1] * T + o, T, T);
  });

  // jugador
  ctx.fillStyle = 'rgba(0,0,0,.38)';
  ctx.fillRect(px * T + 3, py * T + 14, 10, 2);
  let ox = 0, oy = 0;
  if (lunge && t - lunge.t0 < 180) {
    const o = Math.round(Math.sin(Math.PI * (t - lunge.t0) / 180) * 5);
    ox = lunge.dx * o; oy = lunge.dy * o;
  }
  ctx.save();
  if (S.direccion < 0) { ctx.translate((px + 1) * T + ox, 0); ctx.scale(-1, 1); ctx.drawImage(SPR.player, 0, py * T - bob + oy, T, T); }
  else ctx.drawImage(SPR.player, px * T + ox, py * T - bob + oy, T, T);
  ctx.restore();
  drawHits(t);
  drawHeals(t);
}
requestAnimationFrame(frame);

/* ===================================================== resaltado de sintaxis */
const KW = 'def|return|if|elif|else|for|while|in|not|and|or|import|from|as|global|True|False|None|break|continue|pass|is|with';
const BI = 'print|range|len|type|input|int|str|float|bool|list|append|strip|lower|sum';
const HL = new RegExp(`(#.*$)|("(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*')|\\b(${KW})\\b|\\b(${BI})\\b|\\b(\\d+(?:\\.\\d+)?)\\b`, 'g');
function hl(code) {
  let out = '', last = 0, m;
  HL.lastIndex = 0;
  while ((m = HL.exec(code))) {
    out += esc(code.slice(last, m.index));
    const cls = m[1] ? 'tc' : m[2] ? 'ts' : m[3] ? 'tk' : m[4] ? 'tb' : 'tn';
    out += `<span class="${cls}">${esc(m[0])}</span>`;
    last = HL.lastIndex;
  }
  return out + esc(code.slice(last));
}

/* ===================================================== panel de traza */
const trEl = $('#trace');
const queue = [];
let timer = null, paused = false, speedIdx = 1, total = 0, lastRow = null;
const SPEEDS = [0.5, 1, 2, 4];

function enqueueTrace(accion, args, eventos) {
  const argTxt = args.map((a) => typeof a === 'string' ? JSON.stringify(a) : a).join(', ');
  queue.push(['c', 'cmd', '>>>', `api("${accion}"${argTxt !== '' ? ', ' + argTxt : ''})`]);
  eventos.forEach((e) => queue.push(e));
  kick();
}
function kick() { if (!timer && !paused && queue.length) timer = setTimeout(drain, 10); }
function drain() {
  timer = null;
  if (paused || !queue.length) return;
  const n = queue.length > 200 ? 5 : queue.length > 90 ? 3 : queue.length > 40 ? 2 : 1;
  for (let i = 0; i < n && queue.length; i++) addRow(queue.shift());
  timer = setTimeout(drain, 30 / SPEEDS[speedIdx]);
}
function addRow(ev) {
  const [o, k, n, txt] = ev;
  const stick = trEl.scrollTop + trEl.clientHeight >= trEl.scrollHeight - 40;
  const row = document.createElement('div');
  row.className = `r ${o} ${k}`;
  let no = n ? String(n) : '', src;
  if (k === 'cmd') src = esc(txt);
  else if (k === 'call') src = `<i class="ar">▶</i>${esc(txt)}`;
  else if (k === 'line') src = hl(txt);
  else if (k === 'ret') src = `<i class="ar">↩</i>return ${hl(txt)}`;
  else if (k === 'out') { no = '»'; src = esc(txt); }
  else if (k === 'rep') { no = '…'; src = esc(txt); }
  else { no = '!'; src = esc(txt); }
  row.innerHTML = `<span class="no">${no}</span><span class="src">${src}</span>`;
  if (lastRow) lastRow.classList.remove('now');
  row.classList.add('now'); lastRow = row;
  trEl.appendChild(row);
  while (trEl.childElementCount > 600) trEl.firstElementChild.remove();
  if (k !== 'cmd' && k !== 'rep') { total++; $('#t-cnt').textContent = total + ' líneas'; }
  if (stick) trEl.scrollTop = trEl.scrollHeight;
}
$('#t-pausa').addEventListener('click', () => {
  paused = !paused;
  $('#t-pausa').textContent = paused ? 'SEGUIR' : 'PAUSA';
  $('#th').classList.toggle('paused', paused);
  $('#live').textContent = paused ? 'EN PAUSA' : 'EJECUTANDO';
  if (!paused) kick();
});
$('#t-vel').addEventListener('click', () => {
  speedIdx = (speedIdx + 1) % SPEEDS.length;
  $('#t-vel').textContent = 'VEL x' + SPEEDS[speedIdx];
});
$('#t-limpiar').addEventListener('click', () => { queue.length = 0; trEl.innerHTML = ''; lastRow = null; total = 0; $('#t-cnt').textContent = '0 líneas'; });

/* ===================================================== interfaz según el estado */
const OVERLAYS = ['intro', 'pregunta', 'resultado', 'fin'];
function showOverlay(name) {
  OVERLAYS.forEach((o) => $('#ov-' + o).classList.toggle('hidden', o !== name));
}
let shownQ = null;

function onState(prev, s) {
  (s.eventos || []).forEach((ev) => {
    if (ev.tipo === 'golpe') addHit(ev);
    else if (ev.tipo === 'vida') { addHeal(ev); fx('flash'); }
  });
  // HUD
  const hv = $('#h-vidas');
  hv.innerHTML = '';
  for (let i = 0; i < s.vidas_max; i++) {
    const im = new Image(); im.src = url(i < s.vidas ? SPR.heart : SPR.heartOff); im.alt = i < s.vidas ? 'vida' : 'sin vida';
    if (prev && s.vidas > prev.vidas && i === s.vidas - 1) im.className = 'pop';
    hv.appendChild(im);
  }
  $('#h-puntos').textContent = String(s.puntos).padStart(3, '0') + '/' + s.maximo;
  $('#h-sala').textContent = s.sala ? `${s.sala}/${s.total_salas}` : '-/' + s.total_salas;
  $('#h-nivel').textContent = s.sala ? s.nivel.toUpperCase() : '-';

  // mapa nuevo
  if (s.mapa && s.mapa.uid !== bgUid) {
    bg = buildBackground(s); bgUid = s.mapa.uid;
    banner(`SALA ${s.sala}/${s.total_salas}<br>${esc(s.tema.toUpperCase())}`);
  }

  // registro de mensajes
  $('#log').innerHTML = s.mensajes.map((m) => `<div class="${m[0]}">${m[0] === 'sala' ? '▸ ' : '› '}${esc(m[1])}</div>`).join('');

  // capas
  const stage = $('#stage');
  if (s.fase === 'titulo') { showOverlay('intro'); }
  else if (s.fase === 'mapa') { showOverlay(null); shownQ = null; }
  else if (s.fase === 'pregunta') {
    showOverlay('pregunta');
    const key = s.sala + ':' + s.pregunta.numero;
    if (shownQ !== key) { buildPregunta(s); shownQ = key; $('#ans').value = ''; }
    updatePregunta(s);
    setTimeout(() => $('#ans').focus({ preventScroll: true }), 30);
  } else if (s.fase === 'resultado') {
    showOverlay('resultado'); buildResultado(s); shownQ = null;
    if (!prev || prev.fase !== 'resultado') fx(s.resultado.correcto ? 'flash' : 'hurt');
    setTimeout(() => { const b = $('#btn-cont'); if (b) b.focus({ preventScroll: true }); }, 60);
  } else if (s.fase === 'fin') {
    showOverlay('fin'); buildFin(s); shownQ = null;
    setTimeout(() => { const b = $('#btn-otra'); if (b) b.focus({ preventScroll: true }); }, 60);
  }
}

function fx(kind) {
  const st = $('#stage');
  st.classList.remove('flash', 'hurt', 'shake');
  void st.offsetWidth;
  st.classList.add(kind);
  if (kind === 'hurt') st.classList.add('shake');
  setTimeout(() => st.classList.remove('flash', 'hurt', 'shake'), 600);
}
function banner(html) {
  const b = $('#banner');
  b.innerHTML = html;
  b.classList.remove('on'); void b.offsetWidth; b.classList.add('on');
}

function buildPregunta(s) {
  $('#q-titulo').textContent = `NODO ${s.pregunta.numero} DE ${s.pregunta.total}`;
  $('#q-sub').textContent = `SALA ${s.sala} · ${s.tema.toUpperCase()}`;
  $('#q-codigo').innerHTML = hl(s.pregunta.codigo);
  $('#q-enun').textContent = s.pregunta.enunciado;
}
function updatePregunta(s) {
  const p = $('#q-pista');
  p.classList.toggle('hidden', !s.pregunta.pista_usada);
  p.textContent = s.pregunta.pista_usada ? 'Pista: ' + s.pregunta.pista : '';
  $('#q-aviso').textContent = s.aviso || '';
}
function buildResultado(s) {
  const r = s.resultado;
  const parts = [];
  parts.push(r.correcto
    ? `<h2 class="ok">¡CORRECTO!</h2><p class="big" style="color:var(--green)">+${r.puntos} puntos</p>`
    : `<h2 class="mal">INCORRECTO</h2><p class="big" style="color:var(--red)">−1 vida</p>`);
  if (!r.correcto) parts.push(`<p>Tu respuesta: <b style="color:var(--orange);font-weight:normal">${esc(r.dada)}</b></p><p>La respuesta era: <b style="color:var(--green);font-weight:normal">${esc(r.esperada)}</b></p>`);
  parts.push(`<p>${esc(r.explicacion)}</p>`);
  r.extra.forEach((x) => parts.push(`<p class="extra">★ ${esc(x)}</p>`));
  if (s.vidas <= 0) parts.push('<p class="mal" style="color:var(--red)">Te quedaste sin vidas...</p>');
  parts.push('<div class="btns"><button class="btn" id="btn-cont" type="button">CONTINUAR</button></div>');
  $('#res-box').innerHTML = parts.join('');
  $('#btn-cont').addEventListener('click', () => call('continuar'));
}
function buildFin(s) {
  const f = s.fin;
  const pct = Math.round((f.puntos / f.maximo) * 100);
  $('#fin-box').innerHTML = `
    <h2 class="${f.victoria ? 'ok' : 'mal'}">${f.victoria ? '¡VICTORIA!' : 'DERROTA'}</h2>
    ${f.lineas.map((l) => `<p>${esc(l)}</p>`).join('')}
    <p class="big">${f.puntos} <span style="font-size:12px;color:var(--dim)">/ ${f.maximo} PUNTOS</span></p>
    <div class="bar"><i style="width:${pct}%"></i></div>
    <p>Nivel alcanzado: <b style="color:var(--yellow);font-weight:normal">${esc(f.nivel)}</b></p>
    <div class="btns"><button class="btn" id="btn-otra" type="button">JUGAR DE NUEVO</button></div>`;
  $('#btn-otra').addEventListener('click', () => call('nueva_partida', S.nombre));
}

/* ===================================================== entradas */
const MOVES = {
  ArrowUp: [0, -1], w: [0, -1], W: [0, -1], ArrowDown: [0, 1], s: [0, 1], S: [0, 1],
  ArrowLeft: [-1, 0], a: [-1, 0], A: [-1, 0], ArrowRight: [1, 0], d: [1, 0], D: [1, 0],
};
window.addEventListener('keydown', (e) => {
  if (!S || e.ctrlKey || e.metaKey || e.altKey) return;
  if (S.fase === 'mapa' && MOVES[e.key]) {
    e.preventDefault(); call('mover', ...MOVES[e.key]);
  } else if (S.fase === 'pregunta' && e.key === 'Escape') {
    call('cerrar');
  } else if ((S.fase === 'resultado' || S.fase === 'fin') && (e.key === 'Enter' || e.key === ' ') && e.target.tagName !== 'BUTTON') {
    e.preventDefault();
    call(S.fase === 'resultado' ? 'continuar' : 'nueva_partida', ...(S.fase === 'fin' ? [S.nombre] : []));
  }
});
document.querySelectorAll('.dpad button').forEach((b) =>
  b.addEventListener('click', () => { if (S && S.fase === 'mapa') call('mover', +b.dataset.dx, +b.dataset.dy); }));

$('#q-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const v = $('#ans').value;
  $('#ans').value = '';
  call('responder', v);
});
$('#btn-pista').addEventListener('click', () => { call('pista'); $('#ans').focus(); });
$('#btn-salir').addEventListener('click', () => call('cerrar'));

function empezar() {
  if (!apiFn) return;
  call('nueva_partida', $('#nombre').value);
}
$('#btn-jugar').addEventListener('click', empezar);
$('#nombre').addEventListener('keydown', (e) => { if (e.key === 'Enter') empezar(); });

/* ===================================================== arranque de Python */
async function boot() {
  const status = $('#status');
  try {
    if (typeof loadPyodide !== 'function') throw new Error('pyodide.js no se pudo descargar');
    status.textContent = 'Descargando Python (Pyodide)… la primera vez tarda unos segundos.';
    const py = await loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/' });
    status.textContent = 'Cargando las reglas del juego en Python…';
    const src = $('#game-py').textContent.replace(/^\n/, '');
    py.globals.set('SRC_JUEGO', src);
    apiFn = py.runPython('juego = {"SRC_JUEGO": SRC_JUEGO}\nexec(compile(SRC_JUEGO, "<juego>", "exec"), juego)\njuego["api"]');
    $('#pyver').textContent = 'Python ' + py.runPython('import sys\nsys.version.split()[0]');
    call('consultar');
    $('#loadbar').classList.add('done');
    status.textContent = '¡Listo! Escribe tu nombre y pulsa JUGAR.';
    $('#btn-jugar').disabled = false;
    $('#nombre').focus({ preventScroll: true });
  } catch (err) {
    console.error(err);
    status.classList.add('err');
    status.textContent = 'No se pudo cargar Python. Este juego necesita internet para descargar Pyodide. (' + err.message + ')';
    $('#loadbar').classList.add('hidden');
  }
}
boot();

/* ===================================================== animación de inicio (8 bits) */
(() => {
  const ov = $('#ov-splash'), c = $('#cv-splash'), g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  const W = 240, H = 176;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FONT = (px) => `${px}px "Press Start 2P", "Courier New", monospace`;
  let t0 = 0, raf = 0, done = false;

  const txt = (s, x, y, color, px = 8, shadow) => {
    g.font = FONT(px); g.textBaseline = 'top';
    if (shadow) { g.fillStyle = shadow; g.fillText(s, x + 1, y + 1); }
    g.fillStyle = color; g.fillText(s, x, y);
  };
  const center = (s, y, color, px, shadow) => txt(s, Math.round((W - s.length * px) / 2), y, color, px, shadow);
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const ease = (v) => { v = clamp01(v); return v * v * (3 - 2 * v); };

  /* --- fase 1: arranque del "BIOS" --- */
  const dots = (a, b) => a + ' ' + '.'.repeat(Math.max(2, 22 - a.length - b.length)) + ' ' + b;
  const BIOS = [
    ['CUNTRON BIOS V20.45', '#f4f4f4', 0],
    [dots('MEMORIA 64K', 'OK'), '#a7f070', 260],
    [dots('VIDEO 8-BIT', 'OK'), '#a7f070', 520],
    [dots('PYTHON 3', 'OK'), '#a7f070', 780],
    [dots('SERVIDOR CUN', 'ERROR'), '#e8475f', 1040],
    ['VIRUS BUG MAYOR DETECTADO', '#e8475f', 1300],
    ['> CARGANDO MISION', '#ffcd75', 1560],
  ];
  function drawBios(t) {
    g.fillStyle = '#05060d'; g.fillRect(0, 0, W, H);
    BIOS.forEach(([s, color, start], i) => {
      if (t < start) return;
      const n = Math.min(s.length, Math.floor((t - start) / 16));
      txt(s.slice(0, n), 8, 10 + i * 13, color, 8);
      if (i === BIOS.length - 1 && n === s.length && Math.floor(t / 250) % 2 === 0) { g.fillStyle = '#ffcd75'; g.fillRect(8 + s.length * 8, 10 + i * 13, 8, 8); }
    });
  }
  function drawGlitch(t) {
    drawBios(2000);
    for (let k = 0; k < 6; k++) {
      const y = Math.floor(Math.random() * H), h = 3 + Math.floor(Math.random() * 16), dx = Math.floor((Math.random() - .5) * 40);
      g.drawImage(c, 0, y, W, h, dx, y, W, h);
    }
    for (let k = 0; k < 5; k++) {
      g.fillStyle = ['rgba(115,239,247,.5)', 'rgba(255,111,174,.5)', 'rgba(244,244,244,.6)'][k % 3];
      g.fillRect(0, Math.floor(Math.random() * H), W, 1 + Math.floor(Math.random() * 3));
    }
  }

  /* --- fase 2: título --- */
  const T0 = THEMES[0];
  function letters(str, x, y, px, start, u, colorFor) {
    for (let i = 0; i < str.length; i++) {
      const ti = start + i * 70;
      if (u < ti || str[i] === ' ') continue;
      const k = clamp01((u - ti) / 200);
      const dy = Math.round(-(1 - k) * (1 - k) * 34);
      txt(str[i], x + i * px, y + dy, colorFor(u - ti), px, '#5d275d');
    }
  }
  function drawTitle(u) {
    g.fillStyle = '#05060d'; g.fillRect(0, 0, W, H);
    // lluvia de bits (el servidor infectado)
    for (let i = 0; i < 24; i++) {
      const sp = 22 + (i * 37) % 30, off = (i * 53) % H;
      const y = ((u / 1000) * sp + off) % (H + 40) - 20;
      for (let k = 0; k < 6; k++) {
        const yy = Math.round(y - k * 7);
        if (yy < 0 || yy > 118) continue;
        g.fillStyle = k === 0 ? '#38b764' : k < 3 ? '#1d7f43' : '#143d2a';
        g.fillRect(i * 10 + 3, yy, 3, 4);
      }
    }
    // marcador arcade
    txt('1UP 000', 6, 2, '#73eff7', 8);
    txt('MAX 175', W - 6 - 7 * 8, 2, '#ffcd75', 8);
    // suelo de ladrillos
    g.fillStyle = T0.wall; g.fillRect(0, 122, W, 8);
    g.fillStyle = T0.light; g.fillRect(0, 123, W, 1);
    g.fillStyle = T0.mortar; g.fillRect(0, 122, W, 1); g.fillRect(0, 129, W, 1);
    for (let x = 0; x < W; x += 16) g.fillRect(x + ((x / 16) % 2 ? 8 : 0), 124, 1, 5);
    g.fillStyle = '#0b0e22'; g.fillRect(0, 130, W, H - 130);

    // título letra por letra
    const flash = (age) => age < 160 ? '#f4f4f4' : '#ffcd75';
    const flash2 = (age) => age < 160 ? '#f4f4f4' : '#ef7d57';
    letters('MISION:', 78, 16, 12, 100, u, flash2);
    if (u > 100 + 4 * 70 + 200) { g.fillStyle = '#ef7d57'; g.fillRect(78 + 4 * 12 + 6, 13, 2, 1); g.fillRect(78 + 4 * 12 + 5, 14, 2, 1); g.fillRect(78 + 4 * 12 + 4, 15, 2, 1); } // tilde de la Ó
    letters('RESCATAR', 56, 36, 16, 650, u, flash);
    letters('LA CUN', 72, 58, 16, 1250, u, flash);

    // frase
    const tag = 'APRENDE PYTHON JUGANDO';
    if (u > 1900) txt(tag.slice(0, Math.floor((u - 1900) / 28)), Math.round((W - tag.length * 8) / 2), 88, '#73eff7', 8);

    // héroe vs BUG MAYOR
    const walking = u > 700 && u < 2500;
    const px = Math.round(-18 + 72 * ease((u - 700) / 1800));
    const bob = walking ? Math.floor(u / 140) % 2 : Math.floor(u / 380) % 2;
    g.drawImage(SPR.player, px, 106 - bob, 16, 16);
    const bx = Math.round(256 - 96 * ease((u - 1100) / 1500));
    const wob = Math.floor(u / 200) % 2;
    if (u > 1100) {
      if (u < 2600 && Math.random() < .25) g.drawImage(SPR.boss, bx + (Math.random() < .5 ? -2 : 2), 106 - wob, 16, 16);
      else g.drawImage(SPR.boss, bx, 106 - wob, 16, 16);
    }
    g.drawImage(SPR.bug, Math.round(W - ((u / 28) % (W + 40))), 114, 8, 8);
    if (u > 2600) center('VS', 104, Math.floor(u / 220) % 2 ? '#e8475f' : '#ffcd75', 16, '#5d275d');

    // pulsa una tecla
    const on = reduced || Math.floor(u / 500) % 2 === 0;
    if (u > 2800) {
      if (on) center('PRESIONA UNA TECLA', 140, '#ffcd75', 8);
      center('O TOCA LA PANTALLA', 156, '#566c86', 8);
    }
  }

  function frame(now) {
    if (done) return;
    raf = requestAnimationFrame(frame);
    const t = now - t0;
    if (t < 2000) drawBios(t); else if (t < 2300) drawGlitch(t); else drawTitle(t - 2300);
  }
  function start() { t0 = performance.now() - (reduced ? 6000 : 0); raf = requestAnimationFrame(frame); }
  Promise.race([
    document.fonts ? document.fonts.load(FONT(16), 'MISION RESCATAR LA CUN') : Promise.resolve(),
    new Promise((r) => setTimeout(r, 1200)),
  ]).then(start, start);

  function finish() {
    if (done) return;
    done = true; cancelAnimationFrame(raf);
    window.removeEventListener('keydown', onKey, true);
    ov.classList.add('out');
    setTimeout(() => {
      ov.classList.add('hidden');
      const n = $('#nombre');
      if (n && !$('#btn-jugar').disabled) n.focus({ preventScroll: true });
    }, reduced ? 20 : 350);
  }
  function onKey(e) {
    if (['Shift', 'Control', 'Alt', 'Meta', 'Tab'].includes(e.key)) return;
    e.preventDefault(); e.stopPropagation(); finish();
  }
  window.addEventListener('keydown', onKey, true);
  ov.addEventListener('click', finish);
})();

/* perilla CRT: activa o desactiva las líneas de barrido (se recuerda en el navegador) */
(() => {
  const tv = $('#tv'), knob = $('#knob-crt');
  const apply = (on) => { tv.classList.toggle('nofx', !on); knob.setAttribute('aria-pressed', String(on)); };
  let on = true;
  try { on = localStorage.getItem('cun-crt') !== 'off'; } catch (e) { /* sin almacenamiento */ }
  apply(on);
  knob.addEventListener('click', () => {
    on = !on; apply(on);
    try { localStorage.setItem('cun-crt', on ? 'on' : 'off'); } catch (e) { /* sin almacenamiento */ }
    knob.blur();
  });
})();

/* leyenda */
$('#legend').innerHTML = [
  [SPR.player, 'Tú'], [SPR.termPend, 'Nodo (pregunta)'], [SPR.termDone, 'Resuelto'],
  [SPR.heart, 'Corazón (+1 vida)'], [SPR.bug, 'Bug (aplástalo)'], [SPR.doorShut, 'Puerta'], [SPR.doorOpen, 'Abierta'], [SPR.boss, 'BUG MAYOR'],
].map(([s, t]) => `<span><img src="${url(s)}" alt="">${t}</span>`).join('');
})();
