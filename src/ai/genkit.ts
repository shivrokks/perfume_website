/**
 * @fileoverview This file initializes a singleton Genkit AI instance.
 *
 * It should be imported by any file that needs to interact with Genkit.
 */
import {genkit} from 'genkit';
import {googleAI} from '@google/generative-ai/genkit';

export const ai = genkit({
  plugins: [googleAI()],
  logSinks: [],
  enableTracing: process.env.NODE_ENV !== 'production',
});
