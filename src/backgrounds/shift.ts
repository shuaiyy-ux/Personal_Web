// @ts-nocheck
/*
 * Shift background effect from Codrops AmbientCanvasBackgrounds (index3)
 * Source: https://github.com/crnacura/AmbientCanvasBackgrounds
 * Integrated for static background use in this site.
 */

const { PI, cos, sin, abs, sqrt, pow, random, floor } = Math;
const TAU = 2 * PI;
const rand = (n: number) => n * random();
const fadeInOut = (t: number, m: number) => {
  const hm = 0.5 * m;
  return abs(((t + hm) % m) - hm) / hm;
};

// SimplexNoise (from noise.min.js)
class SimplexNoise {
  constructor(r?: number | (() => number)) {
    const n = 0.5 * (sqrt(3) - 1);
    const e = (3 - sqrt(3)) / 6;
    const a = 1 / 6;
    const o = (sqrt(5) - 1) / 4;
    const i = (5 - sqrt(5)) / 20;
    const s = typeof r === 'function' ? r : r ? (() => {
      let r1 = 0, e1 = 0, t1 = 0, a1 = 1;
      const o1 = function (r2: any) {
        let e2 = 0;
        let t2 = 0;
        let a2 = 0;
        let i2 = 1;
        const n2 = function (r3: any) {
          r3 = r3.toString();
          for (let e3 = 0; e3 < r3.length; e3++) {
            let t3 = 0.02519603282416938 * (i2 += r3.charCodeAt(e3));
            t3 -= i2 = i2 >>> 0;
            i2 = (t3 *= i2) >>> 0;
            i2 += 4294967296 * (t3 -= i2);
          }
          return 2.3283064365386963e-10 * (i2 >>> 0);
        };
        for (let n3 = 0; n3 < arguments.length; n3++)
          (r1 -= n2(arguments[n3])) < 0 && (r1 += 1),
            (e1 -= n2(arguments[n3])) < 0 && (e1 += 1),
            (t1 -= n2(arguments[n3])) < 0 && (t1 += 1);
        return n2(null), () => {
          const o2 = 2091639 * r1 + 2.3283064365386963e-10 * a1;
          return (r1 = e1), (e1 = t1), (t1 = o2 - (a1 = floor(o2)));
        };
      };
      return (n: number) => o1(n);
    })(r) : random;
    this.p = SimplexNoise.buildPermutationTable(s);
    this.perm = new Uint8Array(512);
    this.permMod12 = new Uint8Array(512);
    for (let n3 = 0; n3 < 512; n3++) {
      this.perm[n3] = this.p[255 & n3];
      this.permMod12[n3] = this.perm[n3] % 12;
    }
  }

  static buildPermutationTable(r: () => number) {
    const e = new Uint8Array(256);
    for (let t = 0; t < 256; t++) e[t] = t;
    for (let t = 0; t < 255; t++) {
      const a = t + ~~(r() * (256 - t));
      const o = e[t];
      e[t] = e[a];
      e[a] = o;
    }
    return e;
  }

  grad3 = new Float32Array([
    1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0,
    -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1,
  ]);

  noise3D(xin: number, yin: number, zin: number) {
    const perm = this.perm;
    const permMod12 = this.permMod12;
    const grad3 = this.grad3;

    let n0, n1, n2, n3;

    const F3 = 1 / 3;
    const G3 = 1 / 6;
    const s = (xin + yin + zin) * F3;
    const i = floor(xin + s);
    const j = floor(yin + s);
    const k = floor(zin + s);
    const t = (i + j + k) * G3;
    const X0 = i - t;
    const Y0 = j - t;
    const Z0 = k - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;
    const z0 = zin - Z0;

    let i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0) {
        i1 = 1;
        j1 = 0;
        k1 = 0;
        i2 = 1;
        j2 = 1;
        k2 = 0;
      } else if (x0 >= z0) {
        i1 = 1;
        j1 = 0;
        k1 = 0;
        i2 = 1;
        j2 = 0;
        k2 = 1;
      } else {
        i1 = 0;
        j1 = 0;
        k1 = 1;
        i2 = 1;
        j2 = 0;
        k2 = 1;
      }
    } else if (y0 < z0) {
      i1 = 0;
      j1 = 0;
      k1 = 1;
      i2 = 0;
      j2 = 1;
      k2 = 1;
    } else if (x0 < z0) {
      i1 = 0;
      j1 = 1;
      k1 = 0;
      i2 = 0;
      j2 = 1;
      k2 = 1;
    } else {
      i1 = 0;
      j1 = 1;
      k1 = 0;
      i2 = 1;
      j2 = 1;
      k2 = 0;
    }

    const x1 = x0 - i1 + G3;
    const y1 = y0 - j1 + G3;
    const z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2 * G3;
    const y2 = y0 - j2 + 2 * G3;
    const z2 = z0 - k2 + 2 * G3;
    const x3 = x0 - 1 + 3 * G3;
    const y3 = y0 - 1 + 3 * G3;
    const z3 = z0 - 1 + 3 * G3;

    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;

    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 < 0) n0 = 0;
    else {
      t0 *= t0;
      const gi0 = permMod12[ii + perm[jj + perm[kk]]] * 3;
      n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0 + grad3[gi0 + 2] * z0);
    }

    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 < 0) n1 = 0;
    else {
      t1 *= t1;
      const gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
      n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1 + grad3[gi1 + 2] * z1);
    }

    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 < 0) n2 = 0;
    else {
      t2 *= t2;
      const gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
      n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2 + grad3[gi2 + 2] * z2);
    }

    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 < 0) n3 = 0;
    else {
      t3 *= t3;
      const gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;
      n3 = t3 * t3 * (grad3[gi3] * x3 + grad3[gi3 + 1] * y3 + grad3[gi3 + 2] * z3);
    }

    return 32 * (n0 + n1 + n2 + n3);
  }
}

const circleCount = 150;
const circlePropCount = 8;
const circlePropsLength = circleCount * circlePropCount;
const baseSpeed = 0.05;
const rangeSpeed = 0.4;
const baseTTL = 150;
const rangeTTL = 200;
const baseRadius = 100;
const rangeRadius = 200;
const rangeHue = 60;
const xOff = 0.0015;
const yOff = 0.0015;
const zOff = 0.0015;
const backgroundColor = 'hsla(0,0%,5%,1)';

let container: Element | null;
let canvas: { a: HTMLCanvasElement; b: HTMLCanvasElement };
let ctx: { a: CanvasRenderingContext2D; b: CanvasRenderingContext2D };
let circleProps: Float32Array;
let simplex: SimplexNoise;
let baseHue: number;

export function initShiftBackground(selector = '.content--canvas') {
  container = document.querySelector(selector);
  if (!container) return;
  setup();
}

function setup() {
  createCanvas();
  resize();
  initCircles();
  draw();
  window.addEventListener('resize', resize);
}

function initCircles() {
  circleProps = new Float32Array(circlePropsLength);
  simplex = new SimplexNoise();
  baseHue = 220;

  for (let i = 0; i < circlePropsLength; i += circlePropCount) {
    initCircle(i);
  }
}

function initCircle(i: number) {
  let x, y, n, t, speed, vx, vy, life, ttl, radius, hue;

  x = rand(canvas.a.width);
  y = rand(canvas.a.height);
  n = simplex.noise3D(x * xOff, y * yOff, baseHue * zOff);
  t = rand(TAU);
  speed = baseSpeed + rand(rangeSpeed);

  vx = speed * cos(t);
  vy = speed * sin(t);
  life = 0;
  ttl = baseTTL + rand(rangeTTL);
  radius = baseRadius + rand(rangeRadius);
  hue = baseHue + n * rangeHue;

  circleProps.set([x, y, vx, vy, life, ttl, radius, hue], i);
}

function updateCircles() {
  baseHue += 0.2;
  for (let i = 0; i < circlePropsLength; i += circlePropCount) {
    updateCircle(i);
  }
}

function updateCircle(i: number) {
  const i2 = 1 + i;
  const i3 = 2 + i;
  const i4 = 3 + i;
  const i5 = 4 + i;
  const i6 = 5 + i;
  const i7 = 6 + i;
  const i8 = 7 + i;

  let x = circleProps[i];
  let y = circleProps[i2];
  const vx = circleProps[i3];
  const vy = circleProps[i4];
  let life = circleProps[i5];
  const ttl = circleProps[i6];
  const radius = circleProps[i7];
  const hue = circleProps[i8];

  drawCircle(x, y, life, ttl, radius, hue);

  life++;
  x += vx;
  y += vy;

  circleProps[i] = x;
  circleProps[i2] = y;
  circleProps[i5] = life;

  if (checkBounds(x, y, radius) || life > ttl) {
    initCircle(i);
  }
}

function drawCircle(x: number, y: number, life: number, ttl: number, radius: number, hue: number) {
  ctx.a.save();
  ctx.a.fillStyle = `hsla(${hue},60%,30%,${fadeInOut(life, ttl)})`;
  ctx.a.beginPath();
  ctx.a.arc(x, y, radius, 0, TAU);
  ctx.a.fill();
  ctx.a.closePath();
  ctx.a.restore();
}

function checkBounds(x: number, y: number, radius: number) {
  return x < -radius || x > canvas.a.width + radius || y < -radius || y > canvas.a.height + radius;
}

function createCanvas() {
  canvas = {
    a: document.createElement('canvas'),
    b: document.createElement('canvas'),
  };
  canvas.b.className = 'shift-canvas-layer';
  canvas.b.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:var(--z-background, -1);`;
  container?.appendChild(canvas.b);
  ctx = {
    a: canvas.a.getContext('2d') as CanvasRenderingContext2D,
    b: canvas.b.getContext('2d') as CanvasRenderingContext2D,
  };
}

function resize() {
  const { innerWidth, innerHeight } = window;

  canvas.a.width = innerWidth;
  canvas.a.height = innerHeight;
  ctx.a.drawImage(canvas.b, 0, 0);

  canvas.b.width = innerWidth;
  canvas.b.height = innerHeight;
  ctx.b.drawImage(canvas.a, 0, 0);
}

function renderLayer() {
  ctx.b.save();
  ctx.b.filter = 'blur(50px)';
  ctx.b.drawImage(canvas.a, 0, 0);
  ctx.b.restore();
}

function draw() {
  ctx.a.clearRect(0, 0, canvas.a.width, canvas.a.height);
  ctx.b.fillStyle = backgroundColor;
  ctx.b.fillRect(0, 0, canvas.b.width, canvas.b.height);
  updateCircles();
  renderLayer();
  window.requestAnimationFrame(draw);
}

export default initShiftBackground;
