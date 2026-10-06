const { presetUno } = require('unocss');

module.exports = {
  presets: [presetUno()],
  shortcuts: {
    'movie-section': 'bg-[#03233c] min-h-screen text-white p-3',
  },
  variants: [
    (matcher) =>
      matcher.startsWith('actived:')
        ? {
            matcher: matcher.slice(8),
            selector: (s) => `${s}.actived`,
          }
        : undefined,
  ],
  rules: [],
  theme: {
    breakpoints: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
    },
  },
};
