// Simple page interactions used by index.html

function changeHeading() {
  const title = document.querySelector('.hero h2') || document.getElementById('heading');
  if (!title) return;
  title.textContent = 'Heading updated — thanks for trying!';
  title.style.transition = 'all .3s ease';
  title.style.transform = 'translateY(-3px)';
  setTimeout(() => title.style.transform = '', 300);
}

function greetuser() {
  const input = document.getElementById('name');
  const msg = document.getElementById('message');
  const name = (input && input.value.trim()) || 'friend';
  if (msg) {
    msg.textContent = `Hello, ${name}! Nice to meet you.`;
    // clear after 4s
    setTimeout(() => { if (msg) msg.textContent = ''; }, 4000);
  } else {
    alert(`Hello, ${name}!`);
  }
}

function calculateTip() {
  const bill = parseFloat(document.getElementById('bill')?.value || 0);
  const tipPct = parseFloat(document.getElementById('tip')?.value || 0);
  const out = document.getElementById('tipResult');
  if (isNaN(bill) || bill <= 0) {
    out.textContent = 'Enter a valid bill amount.';
    return;
  }
  const tip = Math.round((bill * (tipPct/100)) * 100) / 100;
  const total = Math.round((bill + tip) * 100) / 100;
  out.textContent = `Tip: $${tip.toFixed(2)} · Total: $${total.toFixed(2)}`;
}

function rollDice() {
  const n = Math.floor(Math.random() * 6) + 1;
  const el = document.getElementById('diceResult');
  if (el) {
    el.textContent = `🎲 ${n}`;
    el.style.fontSize = '1.1rem';
  }
}

// footer year
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // run pop-in entrance animation after small delay
  setTimeout(() => runEntrancePop(), 120);
});

function randRange(min, max) {
  return Math.random() * (max - min) + min;
}

function runEntrancePop() {
  // selectors to animate (order defines rough visual stacking)
  const groups = [
    'header.site-header .brand',
    'header.site-header .main-nav',
    '.hero',
    '#about',
    '#services',
    '.grid-3 .card',
    '.panel',
    '.site-footer .footer-inner'
  ];

  // collect nodes, preserving group order
  const nodes = [];
  groups.forEach(sel => {
    document.querySelectorAll(sel).forEach(n => nodes.push(n));
  });

  // also animate individual nav items for nicer effect
  document.querySelectorAll('header.site-header .main-nav ul li').forEach((li, i) => {
    if (!nodes.includes(li)) nodes.splice(1 + i, 0, li); // insert near nav position
  });

  // apply pop-wrap and per-element random offsets + staggered delays
  nodes.forEach((el, i) => {
    // avoid animating hidden or empty containers
    if (!(el instanceof HTMLElement)) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;

    // add wrapper class that sets initial transform/opacity
    el.classList.add('pop-wrap');

    // determine random direction: left/right/top/bottom bias
    const dir = Math.floor(randRange(0,4)); // 0..3
    let tx = 0, ty = 0;
    const magnitude = Math.round(randRange(14, 36)); // px
    switch (dir) {
      case 0: tx = -magnitude; ty = randRange(-8,8); break; // from left
      case 1: tx = magnitude;  ty = randRange(-8,8); break; // from right
      case 2: tx = randRange(-8,8); ty = -magnitude; break; // from top
      case 3: tx = randRange(-8,8); ty = magnitude; break; // from bottom
    }

    // set CSS vars for initial offset
    el.style.setProperty('--tx', `${tx}px`);
    el.style.setProperty('--ty', `${ty}px`);

    // small additional random delay per element, stagger by index
    const baseDelay = i * 80; // ms
    const jitter = Math.round(randRange(0, 140));
    const totalDelay = baseDelay + jitter;

    // ensure inline transition-delay applied (helps some browsers)
    el.style.transitionDelay = `${totalDelay}ms`;

    // toggle final class after delay to trigger transition
    setTimeout(() => {
      el.classList.add('pop-in');
      // add tiny bump for some elements
      if (Math.random() > 0.7) el.classList.add('bump');
      // clear inline transitionDelay after animation completes (clean up)
      setTimeout(() => { el.style.transitionDelay = ''; }, 1200);
    }, totalDelay + 40);
  });
}