"use server";

import { personalizePerfumeFinder } from "@/ai/flows/personalize-perfume-finder";

export async function getRecommendations(viewingHistory: string) {
    try {
        const historyArray = JSON.parse(viewingHistory);
        const historyString = historyArray.join(', ');

        if (!historyString) {
            return "";
        }

        const result = await personalizePerfumeFinder({ viewingHistory: historyString });
        return result.recommendations;
    } catch (error) {
        console.error("Error in getRecommendations action:", error);
        throw new Error("Failed to get recommendations.");
    }
}
