// NusaStat charts: small canvas chart helpers, written for this site.
// No library, no network. Every chart draws from the data passed in,
// scales to the canvas's CSS size times the device pixel ratio, and
// labels its axes so the figure is readable without hovering.

const INK = '#17323a';
const GRID = '#dfe7e4';
const MUTED = '#5c7076';
const TEAL = '#0e7c6b';
const AMBER = '#e8a13a';
const RED = '#c2503c';
const BLUE = '#2f6fb2';
const PALETTE = [TEAL, AMBER, BLUE, '#7a5aa8', '#3d9e8f', '#c2503c', '#8a6d3b', '#5b7d8a', '#a8b24a', '#946b2d'];

function setup(canvas, height) {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || canvas.parentElement.clientWidth || 600;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.font = '12px system-ui, -apple-system, "Segoe UI", sans-serif';
  return { ctx, width, height };
}

function niceMax(values) {
  const max = Math.max(...values.map(Math.abs));
  if (max <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(max)));
  const norm = max / pow;
  const step = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  return step * pow;
}

function axes(ctx, box, min, max, yLabel) {
  const { x, y, w, h } = box;
  ctx.strokeStyle = GRID;
  ctx.fillStyle = MUTED;
  ctx.lineWidth = 1;
  const steps = 4;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let i = 0; i <= steps; i++) {
    const v = min + ((max - min) * i) / steps;
    const py = y + h - (h * i) / steps;
    ctx.beginPath();
    ctx.moveTo(x, py);
    ctx.lineTo(x + w, py);
    ctx.stroke();
    ctx.fillText(formatTick(v), x - 8, py);
  }
  if (yLabel) {
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(yLabel, x, y - 18);
  }
  ctx.strokeStyle = INK;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x + w, y + h);
  ctx.stroke();
}

function formatTick(v) {
  const a = Math.abs(v);
  if (a >= 1000) return String(Math.round(v));
  if (a >= 100) return v.toFixed(0);
  if (a >= 10) return v.toFixed(0);
  return v.toFixed(1);
}

// Line chart with a zero line when the series crosses zero.
export function drawLine(canvas, labels, values, options = {}) {
  const height = options.height || 240;
  const { ctx, width } = setup(canvas, height);
  const padL = 52;
  const padR = 14;
  const padT = 26;
  const padB = 30;
  const box = { x: padL, y: padT, w: width - padL - padR, h: height - padT - padB };
  const lo = Math.min(0, ...values);
  const hi = Math.max(...values);
  const max = niceMax([hi, Math.abs(lo)]);
  const min = lo < 0 ? -max : 0;
  axes(ctx, box, min, max, options.yLabel || '');
  const px = (i) => box.x + (box.w * i) / (labels.length - 1);
  const py = (v) => box.y + box.h - ((v - min) / (max - min)) * box.h;
  if (lo < 0) {
    ctx.strokeStyle = '#9aa9ad';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(box.x, py(0));
    ctx.lineTo(box.x + box.w, py(0));
    ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.strokeStyle = options.color || TEAL;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  values.forEach((v, i) => (i === 0 ? ctx.moveTo(px(i), py(v)) : ctx.lineTo(px(i), py(v))));
  ctx.stroke();
  ctx.fillStyle = options.color || TEAL;
  values.forEach((v, i) => {
    ctx.beginPath();
    ctx.arc(px(i), py(v), 3.5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = INK;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  labels.forEach((lab, i) => {
    if (i % 2 === 0 || i === labels.length - 1) ctx.fillText(String(lab).slice(2), px(i), box.y + box.h + 8);
  });
  const last = values[values.length - 1];
  ctx.fillStyle = options.color || TEAL;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 13px system-ui, -apple-system, "Segoe UI", sans-serif';
  ctx.fillText(String(last), Math.min(px(values.length - 1) - 34, width - 60), py(last) - 14);
  ctx.font = '12px system-ui, -apple-system, "Segoe UI", sans-serif';
}

// Vertical bar chart with value labels on top of each bar.
export function drawBars(canvas, labels, values, options = {}) {
  const height = options.height || 240;
  const { ctx, width } = setup(canvas, height);
  const padL = 52;
  const padR = 14;
  const padT = 26;
  const padB = 30;
  const box = { x: padL, y: padT, w: width - padL - padR, h: height - padT - padB };
  const max = niceMax(values);
  axes(ctx, box, 0, max, options.yLabel || '');
  const slot = box.w / labels.length;
  const barW = Math.min(34, slot * 0.62);
  values.forEach((v, i) => {
    const bx = box.x + slot * i + (slot - barW) / 2;
    const bh = (box.h * v) / max;
    ctx.fillStyle = v < 0 ? RED : options.color || TEAL;
    ctx.fillRect(bx, box.y + box.h - bh, barW, bh);
    ctx.fillStyle = INK;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(String(v), bx + barW / 2, box.y + box.h - bh - 4);
  });
  ctx.fillStyle = INK;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  labels.forEach((lab, i) => {
    ctx.fillText(String(lab).slice(2), box.x + slot * i + slot / 2, box.y + box.h + 8);
  });
}

// Donut chart with a legend drawn beside it in HTML; the canvas keeps
// the slices and the percentage of the largest slice.
export function drawDonut(canvas, items, options = {}) {
  const height = options.height || 240;
  const { ctx, width } = setup(canvas, height);
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) / 2 - 14;
  const inner = r * 0.58;
  const total = items.reduce((s, it) => s + it.value, 0);
  let angle = -Math.PI / 2;
  items.forEach((it, i) => {
    const sweep = (it.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, angle, angle + sweep);
    ctx.closePath();
    ctx.fillStyle = PALETTE[i % PALETTE.length];
    ctx.fill();
    angle += sweep;
  });
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = INK;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 15px system-ui, -apple-system, "Segoe UI", sans-serif';
  ctx.fillText(options.centre || '', cx, cy - 8);
  ctx.font = '12px system-ui, -apple-system, "Segoe UI", sans-serif';
  ctx.fillStyle = MUTED;
  ctx.fillText(options.centreNote || '', cx, cy + 12);
}

// Horizontal bars, one row per item, with the value at the end.
export function drawHbars(canvas, items, options = {}) {
  const rowH = 30;
  const height = items.length * rowH + 14;
  const { ctx, width } = setup(canvas, height);
  const padL = 150;
  const padR = 56;
  const max = niceMax(items.map((it) => it.value));
  ctx.font = '12px system-ui, -apple-system, "Segoe UI", sans-serif';
  items.forEach((it, i) => {
    const y = 7 + i * rowH;
    ctx.fillStyle = INK;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(it.name, padL - 8, y + 11);
    const bw = ((width - padL - padR) * it.value) / max;
    ctx.fillStyle = PALETTE[i % PALETTE.length];
    ctx.fillRect(padL, y, bw, 20);
    ctx.fillStyle = INK;
    ctx.textAlign = 'left';
    ctx.fillText(`${it.value}%`, padL + bw + 6, y + 11);
  });
}
