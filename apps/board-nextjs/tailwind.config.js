const { join } = require('path');

const nodeModulesPath = join(__dirname, '..', '..', 'node_modules');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'app/**/*.{js,jsx,ts,tsx}'),
    join(__dirname, 'pages/**/*.{js,jsx,ts,tsx}'),
    join(__dirname, 'components/**/*.{js,jsx,ts,tsx}'),
    join(nodeModulesPath, '/@tremor/**/*.{js,jsx}'),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
