const { presetUno } = require('unocss');

module.exports = {
    presets: [presetUno()],
    variants: [
        (matcher) => matcher.startsWith('actived:') ? {
            matcher: matcher.slice(8),
            selector: (s) => `${s}.actived`,
        } : undefined,
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