import tailwindcss from './tailwind.config.js';

export default {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {
      ...tailwindcss,
    },
    autoprefixer: {},
  },
};
