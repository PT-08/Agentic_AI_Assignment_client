
/** @type {import('tailwindcss').Config} */
import PrimeUI from 'tailwindcss-primeui';

module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {},
  },
  plugins: [PrimeUI],
  // tailwind.config.js
  corePlugins: {
    preflight: false,
  }
};
