// @ts-check
/** @type {import('@yarnpkg/types')} */
const { defineConfig } = require('@yarnpkg/types');

module.exports = defineConfig({
  constraints: async ({ Yarn }) => {
    for (const dep of Yarn.dependencies({ ident: 'react' })) {
      dep.update('19.2.3');
    }
    for (const dep of Yarn.dependencies({ ident: 'react-dom' })) {
      dep.update('19.2.3');
    }
    for (const dep of Yarn.dependencies({ ident: '@emotion/react' })) {
      dep.update('11.11.4');
    }
    for (const dep of Yarn.dependencies({ ident: 'jotai' })) {
      dep.update('2.7.1');
    }
  },
});
