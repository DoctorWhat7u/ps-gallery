/**
 * @fileoverview Configuration object for the stencil compile process.
 * @see https://stenciljs.com/docs/config
 */

import { Config } from '@stencil/core';
//import { sass } from '@stencil/sass';

// TODO: sass issues with the javascript sass implementation
// causes ionic's scss to error.
// https://www.npmjs.com/package/@stencil/sass

export const config: Config = {
  outputTargets: [{ type: 'www' }],
  globalScript: 'src/global/app.ts',
  globalStyle: 'src/global/app.css',
  /* plugins: [
    sass()
  ] */
};
