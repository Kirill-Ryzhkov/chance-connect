/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    screens: {
      'sm': '320px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1440px',
      '2xl': '2560px'
    },
    borderRadius: {
      'none': '0',
      DEFAULT: '10px',
    },
    extend: {},
  },
  plugins: [],
}

