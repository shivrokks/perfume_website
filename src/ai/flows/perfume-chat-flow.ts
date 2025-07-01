'use server';
/**
 * @fileOverview A chatbot flow for the LORVÉ perfume store.
 * - perfumeChat - A function that handles the chatbot conversation.
 * - PerfumeChatInput - The input type for the perfumeChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type {Message} from 'genkit/ai';

// Manually defining the schema for Message content part for Zod validation
const PartSchema = z.object({
  text: z.string(),
});

const MessageSchema = z.object({
  role: z.enum(['user', 'model', 'system', 'tool']),
  content: z.array(PartSchema),
});

export const PerfumeChatInputSchema = z.object({
  history: z.array(MessageSchema),
  message: z.string().describe('The latest message from the user.'),
  productContext: z.string().describe('A summary of all available products in the store.'),
});
export type PerfumeChatInput = z.infer<typeof PerfumeChatInputSchema>;

export async function perfumeChat(input: PerfumeChatInput): Promise<string> {
  return perfumeChatFlow(input);
}

const perfumeChatFlow = ai.defineFlow(
  {
    name: 'perfumeChatFlow',
    inputSchema: PerfumeChatInputSchema,
    outputSchema: z.string(),
  },
  async ({ history, message, productContext }) => {
    const response = await ai.generate({
      model: 'gemini-1.5-flash',
      system: `You are a helpful and witty AI assistant for LORVÉ, a luxury perfume store. Your name is 'Lorv'.
      Your goal is to answer customer questions about perfumes and the brand.
      Be friendly, knowledgeable, and slightly sophisticated in your tone.
      Use the following product information to answer questions about the store's offerings. If you don't know the answer, say so politely.

      AVAILABLE PRODUCTS:
      ${productContext}`,
      history: history as Message[],
      prompt: message,
    });
    return response.text;
  }
);
