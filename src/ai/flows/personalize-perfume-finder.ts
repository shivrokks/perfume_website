'use server';
/**
 * @fileOverview This file defines a Genkit flow for personalizing perfume recommendations based on user viewing history.
 *
 * - personalizePerfumeFinder - A function that suggests perfumes based on viewing history.
 * - PersonalizePerfumeFinderInput - The input type for the personalizePerfumeFinder function.
 * - PersonalizePerfumeFinderOutput - The return type for the personalizePerfumeFinder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizePerfumeFinderInputSchema = z.object({
  viewingHistory: z
    .string()
    .describe(
      'A string containing the user viewing history, listing the names of the perfumes viewed, separated by commas.'
    ),
});
export type PersonalizePerfumeFinderInput = z.infer<typeof PersonalizePerfumeFinderInputSchema>;

const PersonalizePerfumeFinderOutputSchema = z.object({
  recommendations: z
    .string()
    .describe(
      'A comma-separated list of perfume recommendations based on the user viewing history.'
    ),
});
export type PersonalizePerfumeFinderOutput = z.infer<typeof PersonalizePerfumeFinderOutputSchema>;

export async function personalizePerfumeFinder(input: PersonalizePerfumeFinderInput): Promise<PersonalizePerfumeFinderOutput> {
  return personalizePerfumeFinderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizePerfumeFinderPrompt',
  input: {schema: PersonalizePerfumeFinderInputSchema},
  output: {schema: PersonalizePerfumeFinderOutputSchema},
  prompt: `Based on the user's viewing history, suggest perfumes that they might like.

Viewing History: {{{viewingHistory}}}

Recommendations:`, // Handlebars syntax here is correct.
});

const personalizePerfumeFinderFlow = ai.defineFlow(
  {
    name: 'personalizePerfumeFinderFlow',
    inputSchema: PersonalizePerfumeFinderInputSchema,
    outputSchema: PersonalizePerfumeFinderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
