'use server';

import { perfumeChat, PerfumeChatInputSchema } from '@/ai/flows/perfume-chat-flow';
import { getProducts } from '@/lib/products';
import { Message } from 'genkit/ai';

export async function askPerfumeChatbot(history: Message[], newMessage: string): Promise<string> {
    // 1. Fetch product context
    const products = await getProducts();
    const productContext = products.map(p => `- ${p.name}: ${p.description.substring(0, 100)}...`).join('\n');

    // 2. Validate input (server-side validation is good practice)
    const input = {
        history,
        message: newMessage,
        productContext,
    };
    
    const parsed = PerfumeChatInputSchema.safeParse(input);
    if (!parsed.success) {
        console.error("Invalid input to chatbot flow:", parsed.error);
        return "I'm sorry, there was a technical glitch. Please try asking again.";
    }

    // 3. Call the Genkit flow
    try {
        const response = await perfumeChat(parsed.data);
        return response;
    } catch (error) {
        console.error("Error in chatbot flow:", error);
        return "I'm having a bit of trouble connecting at the moment. Please try again shortly.";
    }
}
