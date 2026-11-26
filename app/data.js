// NusaStat data: published national statistics for Indonesia.
// Every figure below comes from Statistics Indonesia (BPS) unless a
// different source is named in its note, and every series carries its
// year range. Figures marked "approx." are rounded published estimates;
// nothing here is invented. See the Sources page (#/sources) for the
// full list of publications.

export const META = {
  country: 'Indonesia',
  updated: '26 November 2026',
  currency: 'Indonesian rupiah (Rp)',
};

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

// Mid-year population, millions. BPS, "Population by Province" estimates;
// 2020 is the Population Census count.
export const POPULATION = {
  label: 'Population (millions)',
  source: 'BPS, mid-year population estimates; 2020 Population Census',
  values: [255.6, 258.7, 261.9, 265.0, 268.1, 270.2, 273.9, 275.8, 278.7, 281.6],
};

// Real GDP growth, % year on year. BPS, national accounts.
export const GDP_GROWTH = {
  label: 'Real GDP growth (% yoy)',
  source: 'BPS, Gross Domestic Product',
  values: [4.88, 5.03, 5.07, 5.17, 5.02, -2.07, 3.7, 5.31, 5.05, 5.03],
};

// Nominal GDP, Rp trillion. BPS, national accounts.
export const GDP_NOMINAL = {
  label: 'Nominal GDP (Rp trillion)',
  source: 'BPS, Gross Domestic Product',
  values: [11526, 12407, 13590, 14838, 15833, 15443, 16977, 19588, 20931, 22140],
};

// Consumer price inflation, December year on year, %. BPS.
export const INFLATION = {
  label: 'Inflation, December yoy (%)',
  source: 'BPS, Consumer Price Index',
  values: [3.35, 3.02, 3.61, 3.13, 2.72, 1.68, 1.87, 5.51, 2.61, 1.57],
};

// Monthly inflation through 2024, % yoy. BPS, Consumer Price Index.
export const INFLATION_2024_MONTHLY = {
  label: 'Inflation by month, 2024 (% yoy)',
  source: 'BPS, Consumer Price Index',
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  values: [2.57, 2.75, 3.05, 3.0, 2.84, 2.51, 2.13, 2.12, 1.84, 1.71, 1.55, 1.57],
};

// Open unemployment rate, August survey, %. BPS, Sakernas.
export const UNEMPLOYMENT = {
  label: 'Open unemployment rate, August (%)',
  source: 'BPS, National Labour Force Survey (Sakernas)',
  values: [6.18, 5.61, 5.5, 5.34, 5.28, 7.07, 6.49, 5.86, 5.32, 4.91],
};

// Age structure, 2024, % of population. BPS (approx., shares rounded).
export const AGE_STRUCTURE = {
  label: 'Age structure, 2024 (% of population)',
  source: 'BPS, population estimates (shares rounded)',
  groups: [
    { name: '0–14 years', value: 24.4 },
    { name: '15–64 years', value: 68.7 },
    { name: '65+ years', value: 6.9 },
  ],
};

// GDP by industry, 2024, % of GDP. BPS (shares rounded).
export const GDP_SECTORS = {
  label: 'GDP by industry, 2024 (% of GDP)',
  source: 'BPS, Gross Domestic Product (shares rounded)',
  sectors: [
    { name: 'Manufacturing', value: 18.7 },
    { name: 'Wholesale & retail trade', value: 12.8 },
    { name: 'Agriculture, forestry & fishing', value: 12.5 },
    { name: 'Construction', value: 9.9 },
    { name: 'Mining & quarrying', value: 8.9 },
    { name: 'Information & communication', value: 7.2 },
    { name: 'Transportation & storage', value: 6.1 },
    { name: 'Financial services', value: 4.3 },
    { name: 'Other services', value: 19.6 },
  ],
};

// Employment by sector, February 2025, % of the employed. BPS, Sakernas.
export const EMPLOYMENT_SECTORS = {
  label: 'Employment by sector, Feb 2025 (% of employed)',
  source: 'BPS, National Labour Force Survey (Sakernas)',
  sectors: [
    { name: 'Agriculture', value: 28.5 },
    { name: 'Trade', value: 19.3 },
    { name: 'Manufacturing', value: 13.5 },
    { name: 'Construction', value: 7.0 },
    { name: 'Accommodation & food', value: 6.4 },
    { name: 'Other services', value: 25.3 },
  ],
};

// Provinces, 2024 mid-year population in millions and density per km2.
// BPS population estimates; densities are rounded published estimates.
export const PROVINCES = [
  { name: 'West Java', pop: 50.35, density: 1430 },
  { name: 'East Java', pop: 41.81, density: 870 },
  { name: 'Central Java', pop: 37.89, density: 1100 },
  { name: 'North Sumatra', pop: 15.59, density: 210 },
  { name: 'Banten', pop: 12.43, density: 1290 },
  { name: 'Jakarta', pop: 10.68, density: 14500 },
  { name: 'South Sulawesi', pop: 9.36, density: 200 },
  { name: 'Lampung', pop: 9.22, density: 270 },
  { name: 'South Sumatra', pop: 8.84, density: 96 },
  { name: 'Riau', pop: 6.86, density: 76 },
  { name: 'West Sumatra', pop: 5.76, density: 137 },
  { name: 'East Kalimantan', pop: 4.05, density: 31 },
  { name: 'West Kalimantan', pop: 5.8, density: 39 },
  { name: 'South Kalimantan', pop: 4.35, density: 112 },
  { name: 'Yogyakarta', pop: 3.76, density: 1200 },
  { name: 'Bali', pop: 4.34, density: 760 },
];

// Headline indicators shown on the overview page.
export const HEADLINES = [
  { label: 'Population, 2024', value: '281.6m', note: 'BPS mid-year estimate' },
  { label: 'Real GDP growth, 2024', value: '5.03%', note: 'BPS national accounts' },
  { label: 'Inflation, Dec 2024', value: '1.57%', note: 'BPS, CPI yoy' },
  { label: 'Unemployment, Feb 2025', value: '4.76%', note: 'BPS, Sakernas' },
  { label: 'Poverty rate, Mar 2025', value: '8.47%', note: 'BPS' },
  { label: 'Exports, 2024', value: 'US$264.7bn', note: 'BPS foreign trade' },
];

export const TRADE_2024 = {
  exports: 264.7,
  imports: 233.66,
  surplus: 31.04,
  unit: 'US$ billion',
  source: 'BPS, Foreign Trade Statistics 2024',
  destinations: [
    { name: 'China', value: 25.4 },
    { name: 'United States', value: 10.1 },
    { name: 'Japan', value: 7.9 },
    { name: 'India', value: 6.9 },
    { name: 'Singapore', value: 4.8 },
  ],
};

export const WELLBEING_2024 = [
  { label: 'Human Development Index', value: '75.02', note: 'BPS, 2024' },
  { label: 'Life expectancy at birth', value: '74.15 years', note: 'BPS, 2024' },
  { label: 'Mean years of schooling', value: '9.05 years', note: 'BPS, 2024' },
  { label: 'Gini ratio, Mar 2025', value: '0.375', note: 'BPS' },
  { label: 'Total fertility rate', value: '2.18', note: 'BPS, 2024' },
  { label: 'Internet users', value: '221.6m (79.5%)', note: 'APJII survey, 2024' },
];

export const LABOUR_2025 = {
  labourForce: '153.05m',
  employed: '145.77m',
  unemployed: '7.28m',
  informalShare: '≈59%',
  note: 'BPS, National Labour Force Survey, February 2025',
};

export const RELEASES = [
  { date: 'Nov 2025', title: 'GDP grows 5.04% in Q3 2025', body: 'Real GDP rose 5.04% year on year in the third quarter of 2025, with household consumption up 4.82% and investment up 5.24%.' },
  { date: 'May 2025', title: 'Unemployment falls to 4.76%', body: 'The February 2025 labour force survey puts open unemployment at 4.76%, down from 4.82% a year earlier, with 153.05 million people in the labour force.' },
  { date: 'Apr 2025', title: 'Poverty rate at 8.47%', body: 'The March 2025 poverty rate is 8.47%, the lowest on record, with 24.06 million people below the poverty line.' },
  { date: 'Jan 2025', title: '2024 inflation ends at 1.57%', body: 'December 2024 consumer prices rose 1.57% year on year, the lowest annual inflation since the current CPI series began.' },
];

export const SOURCES = [
  { pub: 'Population estimates and census', org: 'Statistics Indonesia (BPS)', detail: 'Mid-year population estimates 2015–2024; Population Census 2020.' },
  { pub: 'Gross Domestic Product', org: 'Statistics Indonesia (BPS)', detail: 'National accounts, current and constant prices, 2015–2024.' },
  { pub: 'Consumer Price Index', org: 'Statistics Indonesia (BPS)', detail: 'Monthly CPI and December year-on-year inflation, 2015–2024.' },
  { pub: 'National Labour Force Survey (Sakernas)', org: 'Statistics Indonesia (BPS)', detail: 'August unemployment series 2015–2024; February 2025 labour force.' },
  { pub: 'Foreign Trade Statistics', org: 'Statistics Indonesia (BPS)', detail: 'Exports, imports and trade balance, 2024.' },
  { pub: 'Human Development Index and poverty', org: 'Statistics Indonesia (BPS)', detail: 'HDI, life expectancy, schooling, Gini ratio and poverty rate.' },
  { pub: 'Indonesia Internet Penetration Survey', org: 'APJII', detail: 'Internet users and penetration, 2024.' },
];
