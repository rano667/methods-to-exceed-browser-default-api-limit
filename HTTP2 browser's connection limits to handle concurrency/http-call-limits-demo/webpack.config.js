const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      https: require.resolve('https-browserify'),
    },
  },
};
