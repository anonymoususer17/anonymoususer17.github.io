import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';

const canvas = document.createElement('canvas');
canvas.id = 'webgl-stage';
canvas.setAttribute('aria-hidden', 'true');
document.body.prepend(canvas);

const page = location.pathname.split('/').pop()?.replace('.html', '') || 'index';
const palettes = {
  index:      { bg: 0xfbfaf4, a: 0xff3c17, b: 0xdfff32, c: 0x11110d },
  about:      { bg: 0x11110d, a: 0xff3c17, b: 0xdfff32, c: 0x5137ff },
  experience: { bg: 0xdfff32, a: 0x11110d, b: 0xff3c17, c: 0x5137ff },
  projects:   { bg: 0x5137ff, a: 0xff3c17, b: 0xdfff32, c: 0xfbfaf4 },
  skills:     { bg: 0xff3c17, a: 0x11110d, b: 0xdfff32, c: 0x5137ff }
};
const colors = palettes[page] || palettes.index;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(colors.bg, 0.055);
const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
camera.position.set(0, 0, 14);

const world = new THREE.Group();
scene.add(world);

scene.add(new THREE.HemisphereLight(0xffffff, colors.a, 2.1));
const key = new THREE.DirectionalLight(0xffffff, 5);
key.position.set(4, 7, 8);
scene.add(key);
const rim = new THREE.PointLight(colors.b, 35, 28);
rim.position.set(-6, -2, 6);
scene.add(rim);

const solid = (color, roughness = .38, metalness = .08) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
const wire = color => new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: .7 });
const mats = [solid(colors.a), solid(colors.b), solid(colors.c, .28, .18), solid(0xfbfaf4)];

function mesh(geometry, material, position, rotation = [0, 0, 0], scale = [1, 1, 1]) {
  const item = new THREE.Mesh(geometry, material);
  item.position.set(...position);
  item.rotation.set(...rotation);
  item.scale.set(...scale);
  world.add(item);
  return item;
}

const movers = [];
function add(item, speed = .15, amplitude = .18) {
  movers.push({ item, speed, amplitude, y: item.position.y, phase: Math.random() * Math.PI * 2 });
  return item;
}

function buildIndex() {
  add(mesh(new THREE.TorusKnotGeometry(1.45, .42, 140, 18, 2, 3), mats[0], [2.9, .7, -1], [.25, -.45, .2]), .17, .25);
  add(mesh(new THREE.BoxGeometry(1.7, 4.9, 1.2), mats[2], [-1.2, .1, -1.8], [0, 0, -.13]), .1, .12);
  add(mesh(new THREE.IcosahedronGeometry(1.25, 1), mats[1], [-3.25, -1.55, .4], [.2, .1, .15]), .22, .34);
  mesh(new THREE.TorusGeometry(2.7, .035, 8, 120), wire(colors.c), [.3, .1, -2], [1.15, .3, 0]);
}

function buildAbout() {
  add(mesh(new THREE.SphereGeometry(2.25, 48, 32), mats[3], [2.5, -.1, -1], [0, 0, 0], [1, 1.25, 1]), .1, .12);
  add(mesh(new THREE.TorusGeometry(2.8, .32, 14, 100), mats[0], [1.2, .1, -1.2], [1.2, .1, -.2]), .14, .2);
  add(mesh(new THREE.ConeGeometry(1.35, 3.6, 4), mats[1], [-3, -.7, -.4], [.2, .2, -.3]), .2, .3);
}

function buildExperience() {
  [-3.2, 0, 3.2].forEach((x, i) => {
    const h = 2.8 + i * .8;
    add(mesh(new THREE.BoxGeometry(1.4, h, 1.4), mats[i], [x, -1 + i * .35, -i * .65], [.08 * i, -.12 * i, .08 * (i - 1)]), .11 + i * .03, .12);
    mesh(new THREE.TorusGeometry(1.15, .05, 6, 80), wire(i === 1 ? colors.a : colors.c), [x, 1.3 + i * .25, -i * .65], [1.2, 0, 0]);
  });
}

function buildProjects() {
  const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  for (let i = 0; i < 12; i++) {
    const x = (i % 4 - 1.5) * 2.15;
    const y = (Math.floor(i / 4) - 1) * 2.05;
    const item = mesh(geometry, mats[i % mats.length], [x, y, -Math.random() * 3], [i * .11, i * .17, i * .07], [.72, .72, .72]);
    add(item, .12 + (i % 4) * .025, .12 + (i % 3) * .05);
  }
}

function buildSkills() {
  const knot = add(mesh(new THREE.TorusKnotGeometry(2.1, .58, 180, 24, 3, 5), mats[2], [1.4, 0, -1], [.5, .1, 0]), .12, .2);
  knot.material = solid(colors.c, .18, .48);
  add(mesh(new THREE.OctahedronGeometry(1.6, 0), mats[1], [-3.2, .8, -.2], [.1, .2, .2]), .18, .28);
  mesh(new THREE.TorusGeometry(3.7, .055, 8, 140), wire(0xffffff), [0, 0, -2], [.8, .4, -.3]);
}

({ index: buildIndex, about: buildAbout, experience: buildExperience, projects: buildProjects, skills: buildSkills }[page] || buildIndex)();

const particleCount = innerWidth < 700 ? 70 : 150;
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
  positions[i * 3] = (Math.random() - .5) * 18;
  positions[i * 3 + 1] = (Math.random() - .5) * 12;
  positions[i * 3 + 2] = -2 - Math.random() * 8;
}
const dotsGeo = new THREE.BufferGeometry();
dotsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const dots = new THREE.Points(dotsGeo, new THREE.PointsMaterial({ color: colors.c, size: .045, transparent: true, opacity: .7 }));
scene.add(dots);

let pointerX = 0, pointerY = 0, scrollY = 0, frame = 0;
addEventListener('pointermove', event => {
  pointerX = event.clientX / innerWidth * 2 - 1;
  pointerY = event.clientY / innerHeight * 2 - 1;
}, { passive: true });
addEventListener('scroll', () => { scrollY = scrollY * .7 + scrollY * 0 + window.scrollY * .001; }, { passive: true });

function resize() {
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  const mobile = innerWidth < 700;
  world.scale.setScalar(mobile ? .72 : 1);
  world.position.x = page === 'index' && !mobile ? -1.25 : 0;
}
addEventListener('resize', resize, { passive: true });
resize();

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clock = new THREE.Clock();
function render() {
  const t = clock.getElapsedTime();
  const ease = reduceMotion ? 0 : .035;
  world.rotation.y += ((pointerX * .18) - world.rotation.y) * ease;
  world.rotation.x += ((-pointerY * .1) - world.rotation.x) * ease;
  world.rotation.z = Math.sin(t * .08) * .025;
  movers.forEach(({ item, speed, amplitude, y, phase }, i) => {
    if (!reduceMotion) {
      item.rotation.y += .0025 + i * .00012;
      item.rotation.x += .001;
      item.position.y = y + Math.sin(t * speed * 3 + phase) * amplitude;
    }
  });
  dots.rotation.z = t * .006;
  camera.position.y += ((-scrollY * .2) - camera.position.y) * .04;
  renderer.render(scene, camera);
  frame = requestAnimationFrame(render);
}
render();

document.addEventListener('visibilitychange', () => {
  if (document.hidden) cancelAnimationFrame(frame);
  else render();
});

const nav = document.createElement('nav');
nav.className = 'scene-nav';
nav.setAttribute('aria-label', 'Portfolio navigation');
nav.innerHTML = [
  ['index.html', 'Home', 'index'],
  ['about.html', 'About', 'about'],
  ['experience.html', 'Experience', 'experience'],
  ['projects.html', 'Projects', 'projects'],
  ['skills.html', 'Skills', 'skills']
].map(([href, label, id], i) => `<a href="${href}" ${page === id ? 'aria-current="page"' : ''}><b>0${i}</b>${label}</a>`).join('');
document.body.append(nav);

requestAnimationFrame(() => document.documentElement.classList.add('scene-ready'));
