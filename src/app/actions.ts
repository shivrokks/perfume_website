"use server";

import { z } from "zod";
import { firestore } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import type { Address } from "@/lib/types";

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  gender: z.enum(["Men", "Women", "Unisex"]),
  notes: z.string().min(1, "Notes are required"),
  description: z.string().min(1, "Description is required"),
  ingredients: z.string().min(1, "Ingredients are required"),
  image: z.string().url("Must be a valid placeholder URL").optional(),
});

export async function addProduct(formData: FormData) {
  const values = Object.fromEntries(formData.entries());

  const parsed = ProductSchema.safeParse({
    ...values,
    price: Number(values.price),
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

export async function updateProduct(id: string, formData: FormData) {
  const values = Object.fromEntries(formData.entries());

  const parsed = ProductSchema.safeParse({
    ...values,
    price: Number(values.price),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().fieldErrors,
    };
  }
  
  const productData = parsed.data;

  try {
    const productRef = doc(firestore, "products", id);
    await updateDoc(productRef, {
      ...productData,
      notes: productData.notes.split(',').map(note => note.trim()),
      ingredients: productData.ingredients.split(',').map(ing => ing.trim()),
      image: productData.image || "https://placehold.co/600x600.png",
      updatedAt: serverTimestamp(),
    });

    revalidatePath(`/products/${id}`);
    revalidatePath('/products');
    revalidatePath('/admin');
    
    return { success: true };
  } catch (error) {
    console.error("Error updating document: ", error);
    return {
      success: false,
      error: { _global: ["Failed to update product in the database."] },
    };
  }
}

export async function deleteProduct(id: string) {
  if (!id) {
    return { success: false, error: "Product ID is required." };
  }

  try {
    await deleteDoc(doc(firestore, "products", id));
    revalidatePath('/products');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error("Error deleting document: ", error);
    return {
      success: false,
      error: "Failed to delete product from the database.",
    };
  }
}


export async function getUserAddress(userId: string): Promise<Address | null> {
  if (!userId) return null;
  try {
    const userDocRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists() && userDoc.data()?.address) {
      return userDoc.data()?.address as Address;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user address:", error);
    return null;
  }
}

export async function upsertUserAddress(userId: string, address: Address) {
  if (!userId) {
    throw new Error("User ID is required to save an address.");
  }
  try {
    const userDocRef = doc(firestore, 'users', userId);
    await setDoc(userDocRef, { address }, { merge: true });
    
    revalidatePath('/checkout');
    revalidatePath('/billing');

    return { success: true };
  } catch (error) {
    console.error("Error saving address:", error);
    return {
      success: false,
      error: "Failed to save address."
    };
  }
}
