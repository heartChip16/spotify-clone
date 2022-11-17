/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'spotifygreen': '#1DB954',
        'spotifyblack': '#191414',
        'black-base'  : '#121212',
        'black-secondary': '#171818',
        'primary'     : '#FFFFFF',
        'secondary'   : "#b3b3b3",
        'light-black' : '#282828',
        'gray'        : "#535353",
        'spotifywhite': '#FFFFFF',
      },
      gridTemplateColumns: {
        'auto-fill-cards': 'repeat(auto-fill, minmax(200px, 1fr))'
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp')
  ],
}
