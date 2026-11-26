// NusaStat router: hash routes, one view per section, no network.
// State (chart ranges, table sort and search) lives in memory and is
// re-applied on every render, so every control keeps working after
// navigation. window.__shotReady is false while a page renders and true
// once it is on screen, so a screenshot script knows when to capture.

import { NAV, viewOverview, viewPopulation, viewEconomy, viewLabour, viewPrices, viewRegions, viewSources, viewMissing, drawFor } from './views.js';

const app = document.getElementById('app');
const nav = document.getElementById('nav');

const state = {
  overviewPop: 10,
  overviewGdp: 10,
  pop: 10,
  econGdp: 10,
  econNom: 10,
  labour: 10,
  prices: 10,
  regionSort: 'pop',
  regionQuery: '',
};

const ROUTES = {
  '#/': { title: 'Indonesia in numbers', view: viewOverview },
  '#/population': { title: 'Population', view: viewPopulation },
  '#/economy': { title: 'Economy', view: viewEconomy },
  '#/labour': { title: 'Labour', view: viewLabour },
  '#/prices': { title: 'Prices', view: viewPrices },
  '#/regions': { title: 'Regions', view: viewRegions },
  '#/sources': { title: 'Sources & methods', view: viewSources },
};

nav.innerHTML = NAV.map(([href, label]) => `<a href="${href}" data-route="${href}">${label}</a>`).join('');

function currentRoute() {
  const hash = location.hash || '#/';
  return ROUTES[hash] ? hash : '#/missing';
}

function render() {
  window.__shotReady = false;
  const route = currentRoute();
  const entry = ROUTES[route];
  document.title = entry ? `${entry.title} · NusaStat` : 'Page not found · NusaStat';
  nav.querySelectorAll('a').forEach((a) => {
    a.classList.toggle('active', a.dataset.route === route);
  });
  app.innerHTML = entry ? entry.view(state) : viewMissing();
  drawFor(route, state);
  wireControls();
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function wireControls() {
  app.querySelectorAll('[data-range]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state[btn.dataset.key] = Number(btn.dataset.range);
      render();
    });
  });
  app.querySelectorAll('[data-sort]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.regionSort = btn.dataset.sort;
      render();
    });
  });
  const search = document.getElementById('region-search');
  if (search) {
    search.addEventListener('input', () => {
      state.regionQuery = search.value;
      const pos = search.selectionStart;
      render();
      const next = document.getElementById('region-search');
      if (next) {
        next.focus();
        next.setSelectionRange(pos, pos);
      }
    });
  }
}

window.addEventListener('hashchange', render);
render();
