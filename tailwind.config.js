module.exports = {
  content: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        teams: {
          liverpool: {
            primary: '#c8102E',
            secondary: '#F6EB61'
          },
          forest: {
            primary: '#DD0000',
            secondary: '#FFFFFF'
          },
          arsenal: {
            primary: '#EF0107',
            secondary: '#FFFFFF'
          },
          chelsea: {
            primary: '#034694',
            secondary: '#d1d3d4'
          },
          newcastle: {
            primary: '#241F20',
            secondary: '#FFFFFF'
          },
          mancity: {
            primary: '#6CABDD',
            secondary: '#1C2C5B'
          },
          bournemouth: {
            primary: '#DA291C',
            secondary: '#000000'
          },
          fulham: {
            primary: '#FFFFFF',
            secondary: '#000000'
          },
          astonvilla: {
            primary: '#95bfe5',
            secondary: '#670e36'
          },
          brighton: {
            primary: '#0057B8',
            secondary: '#FFFFFF'
          },
          spurs: {
            primary: '#132257',
            secondary: '#FFFFFF'
          },
          brentford: {
            primary: '#D20000',
            secondary: '#FFFFFF'
          },
          westham: {
            primary: '#7A263A',
            secondary: '#F3D459'
          },
          manutd: {
            primary: '#DA291C',
            secondary: '#FBE122'
          },
          palace: {
            primary: '#1B458F',
            secondary: '#a7a5a6'
          },
          everton: {
            primary: '#003399',
            secondary: '#FFFFFF'
          },
          wolves: {
            primary: '#FDB913',
            secondary: '#231F20'
          },
          ipswich: {
            primary: '#3a64a3',
            secondary: '#fefefe'
          },
          leicester: {
            primary: '#003090',
            secondary: '#fdbe11'
          },
          southampton: {
            primary: '#d71920',
            secondary: '#FFFFFF'
          },
        }
      }
    }
  },
  plugins: [
    require('daisyui'),
  ],
}
