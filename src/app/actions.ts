"use server";

import { z } from "zod";
import { firestore } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { revalidatePath } from "next/cache";

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  gender: z.enum(["Men", "Women", "Unisex"]),
  notes: z.string().min(1, "Notes are required"),
  description: z.string().min(1, "Description is required"),
  ingredients: z.string().min(1, "Ingredients are required"),
  image: z.string().url("Must be a valid placeholder URL").optional(),
  featured: z.boolean().optional(),
  newArrival: z.boolean().optional(),
});

export async function addProduct(formData: FormData) {
  const values = Object.fromEntries(formData.entries());

  const parsed = ProductSchema.safeParse({
    ...values,
    price: Number(values.price),
    featured: values.featured === 'on',
    newArrival: values.newArrival === 'on',
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().fieldErrors,
    };
  }
  
  const productData = parsed.data;

  try {
    await addDoc(collection(firestore, "products"), {
      ...productData,
      notes: productData.notes.split(',').map(note => note.trim()),
      ingredients: productData.ingredients.split(',').map(ing => ing.trim()),
      image: productData.image || "https://placehold.co/600x600.png",
      createdAt: serverTimestamp(),
    });

    revalidatePath('/products');
    revalidatePath('/admin');
    
    return { success: true };
  } catch (error) {
    console.error("Error adding document: ", error);
    return {
      success: false,
      error: { _global: ["Failed to add product to the database."] },
    };
  }
}
