// NusaStat views: one renderer per section of the site. Each view
// returns its HTML; the canvases it names are drawn by drawFor() once
// the HTML is on the page, so charts and tables are never placeholders.

import {
  YEARS, POPULATION, GDP_GROWTH, GDP_NOMINAL, INFLATION, INFLATION_2024_MONTHLY,
  UNEMPLOYMENT, AGE_STRUCTURE, GDP_SECTORS, EMPLOYMENT_SECTORS, PROVINCES,
  HEADLINES, TRADE_2024, WELLBEING_2024, LABOUR_2025, RELEASES, SOURCES,
} from './data.js';
import { drawLine, drawBars, drawDonut, drawHbars } from './charts.js';

export const NAV = [
  ['#/', 'Overview'],
  ['#/population', 'Population'],
  ['#/economy', 'Economy'],
  ['#/labour', 'Labour'],
  ['#/prices', 'Prices'],
  ['#/regions', 'Regions'],
  ['#/sources', 'Sources'],
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

function kpiCards() {
  return `<div class="kpis">${HEADLINES.map(
    (h) => `<div class="kpi"><div class="kpi-value">${h.value}</div><div class="kpi-label">${h.label}</div><div class="kpi-note">${h.note}</div></div>`,
  ).join('')}</div>`;
}

function rangeToggle(state, key) {
  const cur = state[key] || 10;
  return `<div class="toggle" role="group" aria-label="Time range">
    <button data-range="5" data-key="${key}" class="${cur === 5 ? 'on' : ''}">5 years</button>
    <button data-range="10" data-key="${key}" class="${cur === 10 ? 'on' : ''}">10 years</button>
  </div>`;
}

function slice(series, n) {
  return { labels: YEARS.slice(-n), values: series.values.slice(-n) };
}

function sourceLine(text) {
  return `<p class="source">Source: ${esc(text)}</p>`;
}

function chartCard(id, title, subtitle, extra = '') {
  return `<section class="card chart-card"><h2>${title}</h2><p class="card-sub">${subtitle}</p>${extra}<canvas id="${id}" aria-label="${esc(title)}"></canvas></section>`;
}

export function viewOverview(state) {
  const pop = slice(POPULATION, state.overviewPop || 10);
  const gdp = slice(GDP_GROWTH, state.overviewGdp || 10);
  return `
  <section class="hero">
    <p class="eyebrow">Statistics Indonesia · Updated 26 November 2026</p>
    <h1>Indonesia in numbers</h1>
    <p class="lede">The population, economy, jobs, prices and regions of the world's fourth most populous country — every figure sourced, every chart drawn from the published data.</p>
  </section>
  ${kpiCards()}
  <div class="grid-2">
    ${chartCard('ov-pop', 'Population keeps growing', 'Mid-year population, millions · 2015–2024', rangeToggle(state, 'overviewPop'))}
    ${chartCard('ov-gdp', 'Growth stayed near 5%', 'Real GDP growth, % year on year · 2015–2024', rangeToggle(state, 'overviewGdp'))}
  </div>
  <div class="grid-2">
    <section class="card">
      <h2>Latest releases</h2>
      ${RELEASES.map((r) => `<article class="release"><p class="release-date">${r.date}</p><h3>${r.title}</h3><p>${r.body}</p></article>`).join('')}
    </section>
    <section class="card">
      <h2>At a glance: wellbeing, 2024</h2>
      <dl class="facts">${WELLBEING_2024.map((w) => `<div><dt>${w.label}</dt><dd>${w.value}</dd><dd class="fact-note">${w.note}</dd></div>`).join('')}</dl>
      <p class="card-link"><a href="#/population">Explore the population →</a></p>
    </section>
  </div>`;
}

export function viewPopulation(state) {
  const pop = slice(POPULATION, state.pop || 10);
  const total = PROVINCES.reduce((s, p) => s + p.pop, 0);
  return `
  <section class="page-head"><h1>Population</h1>
  <p class="lede">281.6 million people at mid-2024 — the fourth largest population in the world, spread across 38 provinces and more than 17,000 islands.</p></section>
  <div class="grid-2">
    ${chartCard('pop-line', 'Population, 2015–2024', 'Mid-year population, millions', rangeToggle(state, 'pop'))}
    ${chartCard('pop-age', 'A young population', 'Age structure, 2024 · % of population')}
  </div>
  ${sourceLine(POPULATION.source + '. Age shares: ' + AGE_STRUCTURE.source + '.')}
  <section class="card">
    <h2>The six largest provinces hold over half the country</h2>
    <p class="card-sub">Population, millions · 2024 mid-year estimates (BPS)</p>
    <table class="data-table"><thead><tr><th>Province</th><th>Population</th><th>Share of Indonesia</th></tr></thead><tbody>
    ${PROVINCES.slice(0, 6).map((p) => `<tr><td>${p.name}</td><td>${p.pop.toFixed(2)}m</td><td>${((p.pop / total) * 100).toFixed(1)}%</td></tr>`).join('')}
    </tbody></table>
    <p class="card-link"><a href="#/regions">See all provinces with density →</a></p>
  </section>
  <section class="card">
    <h2>What the age structure means</h2>
    <p>Two in three Indonesians are of working age (15–64), and the median age is about 30. The working-age share is still rising, so the population keeps adding workers faster than dependants — the demographic window the 2024 figures describe. The total fertility rate is 2.18 children per woman (BPS, 2024), close to replacement level.</p>
  </section>`;
}

export function viewEconomy(state) {
  const gdp = slice(GDP_GROWTH, state.econGdp || 10);
  const nom = slice(GDP_NOMINAL, state.econNom || 10);
  return `
  <section class="page-head"><h1>Economy</h1>
  <p class="lede">A US$1.4 trillion economy that grew 5.03% in 2024 — the fifth straight year of growth at or above 5% outside the pandemic year.</p></section>
  ${kpiCards()}
  <div class="grid-2">
    ${chartCard('ec-growth', 'Real GDP growth', 'Real GDP growth, % year on year · 2015–2024', rangeToggle(state, 'econGdp'))}
    ${chartCard('ec-nominal', 'Nominal GDP more than doubled in a decade', 'Nominal GDP, Rp trillion · 2015–2024', rangeToggle(state, 'econNom'))}
  </div>
  <div class="grid-2">
    <section class="card chart-card"><h2>What the economy makes</h2>
      <p class="card-sub">GDP by industry, 2024 · % of GDP</p>
      <canvas id="ec-sectors" aria-label="GDP by industry, 2024"></canvas>
      <ul class="legend">${GDP_SECTORS.sectors.map((s, i) => `<li><span class="swatch" style="background:${['#0e7c6b', '#e8a13a', '#2f6fb2', '#7a5aa8', '#3d9e8f', '#c2503c', '#8a6d3b', '#5b7d8a', '#a8b24a'][i]}"></span>${s.name} — ${s.value}%</li>`).join('')}</ul>
      ${sourceLine(GDP_SECTORS.source)}
    </section>
    <section class="card">
      <h2>Trade, 2024</h2>
      <dl class="facts">
        <div><dt>Exports</dt><dd>US$${TRADE_2024.exports}bn</dd></div>
        <div><dt>Imports</dt><dd>US$${TRADE_2024.imports}bn</dd></div>
        <div><dt>Trade surplus</dt><dd>US$${TRADE_2024.surplus}bn</dd></div>
      </dl>
      <p class="card-sub">Exports by destination, % of total (approx.)</p>
      <canvas id="ec-trade" aria-label="Exports by destination"></canvas>
      ${sourceLine(TRADE_2024.source + '. Destination shares rounded.')}
    </section>
  </div>`;
}

export function viewLabour(state) {
  const un = slice(UNEMPLOYMENT, state.labour || 10);
  return `
  <section class="page-head"><h1>Labour</h1>
  <p class="lede">153.05 million people in the labour force in February 2025, 145.77 million of them working. Unemployment is at its lowest in a decade.</p></section>
  <div class="grid-2">
    ${chartCard('lb-unemp', 'Unemployment, 2015–2024', 'Open unemployment rate, August survey, %', rangeToggle(state, 'labour'))}
    <section class="card chart-card"><h2>Where people work</h2>
      <p class="card-sub">Employment by sector, February 2025 · % of the employed</p>
      <canvas id="lb-sectors" aria-label="Employment by sector"></canvas>
      ${sourceLine(EMPLOYMENT_SECTORS.source)}
    </section>
  </div>
  <section class="card">
    <h2>Labour force, February 2025</h2>
    <dl class="facts">
      <div><dt>Labour force</dt><dd>${LABOUR_2025.labourForce}</dd></div>
      <div><dt>Employed</dt><dd>${LABOUR_2025.employed}</dd></div>
      <div><dt>Unemployed</dt><dd>${LABOUR_2025.unemployed}</dd></div>
      <div><dt>Informal employment</dt><dd>${LABOUR_2025.informalShare} of workers</dd></div>
    </dl>
    ${sourceLine(LABOUR_2025.note + '. Informal share is a rounded estimate.')}
    <p>Unemployment spiked to 7.07% in August 2020, the pandemic year, then fell every year after. Agriculture still employs the largest single share of workers (28.5%), even as its share of GDP has shrunk — a gap that explains much of the productivity debate in Indonesian economics.</p>
  </section>`;
}

export function viewPrices(state) {
  const inf = slice(INFLATION, state.prices || 10);
  return `
  <section class="page-head"><h1>Prices</h1>
  <p class="lede">Inflation ended 2024 at 1.57% — the lowest annual rate in the current CPI series — after the 2022 spike to 5.51%.</p></section>
  <div class="grid-2">
    ${chartCard('pr-annual', 'Annual inflation, 2015–2024', 'Consumer prices, December year on year, %', rangeToggle(state, 'prices'))}
    ${chartCard('pr-monthly', 'How 2024 unfolded', 'Consumer prices by month, 2024, % year on year')}
  </div>
  ${sourceLine(INFLATION.source + '. Monthly 2024: ' + INFLATION_2024_MONTHLY.source + '.')}
  <section class="card">
    <h2>Reading the series</h2>
    <p>Inflation ran between 2.7% and 3.6% from 2015 to 2019, fell below 2% in the pandemic years, then jumped to 5.51% in December 2022 when subsidised fuel prices were raised. It has fallen every year since: 2.61% in 2023 and 1.57% in 2024. Through 2024 the monthly rate eased from 3.05% in March to 1.55% in November before ticking up to 1.57% in December.</p>
  </section>`;
}

export function viewRegions(state) {
  const q = (state.regionQuery || '').toLowerCase();
  const rows = PROVINCES.filter((p) => p.name.toLowerCase().includes(q));
  const sorted = [...rows].sort((a, b) => {
    const k = state.regionSort || 'pop';
    return k === 'name' ? a.name.localeCompare(b.name) : k === 'density' ? b.density - a.density : b.pop - a.pop;
  });
  const total = PROVINCES.reduce((s, p) => s + p.pop, 0);
  return `
  <section class="page-head"><h1>Regions</h1>
  <p class="lede">Sixteen of Indonesia's 38 provinces, home to ${total.toFixed(1)} million people — 2024 mid-year estimates. Search the table or sort it by clicking a column heading.</p></section>
  <section class="card">
    <div class="table-tools">
      <label>Search provinces <input id="region-search" type="search" placeholder="e.g. Java" value="${esc(state.regionQuery || '')}"></label>
      <p class="table-count">${sorted.length} province${sorted.length === 1 ? '' : 's'} shown</p>
    </div>
    <div class="table-wrap"><table class="data-table sortable"><thead><tr>
      <th><button data-sort="name">Province ${state.regionSort === 'name' ? '▲' : ''}</button></th>
      <th><button data-sort="pop">Population (m) ${state.regionSort !== 'name' && state.regionSort !== 'density' ? '▼' : ''}</button></th>
      <th><button data-sort="density">Density (/km²) ${state.regionSort === 'density' ? '▼' : ''}</button></th>
      <th>Share</th>
    </tr></thead><tbody>
    ${sorted.map((p) => `<tr><td>${p.name}</td><td>${p.pop.toFixed(2)}</td><td>${p.density.toLocaleString('en-US')}</td><td>${((p.pop / 281.6) * 100).toFixed(1)}%</td></tr>`).join('') || '<tr><td colspan="4">No province matches that search.</td></tr>'}
    </tbody></table></div>
    ${sourceLine('BPS, 2024 mid-year population estimates; densities are rounded published estimates. Shares are of the 2024 national population of 281.6 million.')}
  </section>
  <section class="card">
    <h2>Java is where the people are</h2>
    <p>Java — about 7% of the country's land — holds roughly 55% of its people. Jakarta packs about 14,500 people into each square kilometre; East Kalimantan, home of the new capital Nusantara, has about 31. That imbalance shapes everything from infrastructure spending to where new universities open.</p>
  </section>`;
}

export function viewSources() {
  return `
  <section class="page-head"><h1>Sources &amp; methods</h1>
  <p class="lede">Every figure on this site names its source and year on the page where it appears. This page lists the publications behind them.</p></section>
  <section class="card">
    <h2>Publications</h2>
    <table class="data-table"><thead><tr><th>Publication</th><th>Publisher</th><th>What it covers</th></tr></thead><tbody>
    ${SOURCES.map((s) => `<tr><td>${s.pub}</td><td>${s.org}</td><td>${s.detail}</td></tr>`).join('')}
    </tbody></table>
  </section>
  <section class="card">
    <h2>Methods &amp; notes</h2>
    <ul class="notes">
      <li>Population figures are BPS mid-year estimates; 2020 is the Population Census count.</li>
      <li>GDP growth is real (constant-price) growth, year on year. Nominal GDP is at current prices.</li>
      <li>Inflation is the consumer price index, December year on year unless a month is named.</li>
      <li>Unemployment is the open unemployment rate from the National Labour Force Survey (Sakernas), August round unless February is named.</li>
      <li>Shares marked "rounded" or "approx." are published estimates rounded for display; they sum to 100% within rounding.</li>
      <li>NusaStat is an independent site. It is not affiliated with Statistics Indonesia (BPS) or any government body, and it reproduces published figures with attribution — it does not republish BPS text or branding.</li>
    </ul>
  </section>`;
}

export function viewMissing() {
  return `<section class="page-head"><h1>Page not found</h1>
  <p class="lede">That section does not exist. Use the navigation above to explore the site.</p>
  <p class="card-link"><a href="#/">Back to the overview →</a></p></section>`;
}

// Draw every canvas on the current view. Called after the view's HTML
// is inserted into the page.
export function drawFor(route, state) {
  const byId = (id) => document.getElementById(id);
  if (route === '#/') {
    const pop = slice(POPULATION, state.overviewPop || 10);
    const gdp = slice(GDP_GROWTH, state.overviewGdp || 10);
    drawLine(byId('ov-pop'), pop.labels, pop.values, { yLabel: 'millions' });
    drawLine(byId('ov-gdp'), gdp.labels, gdp.values, { yLabel: '% yoy', color: '#2f6fb2' });
  } else if (route === '#/population') {
    const pop = slice(POPULATION, state.pop || 10);
    drawLine(byId('pop-line'), pop.labels, pop.values, { yLabel: 'millions' });
    drawHbars(byId('pop-age'), AGE_STRUCTURE.groups);
  } else if (route === '#/economy') {
    const gdp = slice(GDP_GROWTH, state.econGdp || 10);
    const nom = slice(GDP_NOMINAL, state.econNom || 10);
    drawLine(byId('ec-growth'), gdp.labels, gdp.values, { yLabel: '% yoy', color: '#2f6fb2' });
    drawBars(byId('ec-nominal'), nom.labels, nom.values, { yLabel: 'Rp trillion' });
    drawDonut(byId('ec-sectors'), GDP_SECTORS.sectors, { centre: '18.7%', centreNote: 'manufacturing' });
    drawHbars(byId('ec-trade'), TRADE_2024.destinations);
  } else if (route === '#/labour') {
    const un = slice(UNEMPLOYMENT, state.labour || 10);
    drawLine(byId('lb-unemp'), un.labels, un.values, { yLabel: '%', color: '#c2503c' });
    drawHbars(byId('lb-sectors'), EMPLOYMENT_SECTORS.sectors);
  } else if (route === '#/prices') {
    const inf = slice(INFLATION, state.prices || 10);
    drawLine(byId('pr-annual'), inf.labels, inf.values, { yLabel: '% yoy', color: '#e8a13a' });
    drawLine(byId('pr-monthly'), INFLATION_2024_MONTHLY.months, INFLATION_2024_MONTHLY.values, { yLabel: '% yoy', color: '#e8a13a' });
  }
}
