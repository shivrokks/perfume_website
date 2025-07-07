
"use server";

import { z } from "zod";
import { firestore, auth } from "@/lib/firebase";
import cloudinary from "@/lib/cloudinary";
import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import type { Address } from "@/lib/types";
import { sendPasswordResetEmail } from "firebase/auth";

// Schema for validating form fields
const ProductFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  gender: z.enum(["Men", "Women", "Unisex"]),
  category: z.enum(['Perfume', 'Oils']),
  size: z.string().optional(),
  notes: z.string().min(1, "Notes are required"),
  description: z.string().min(1, "Description is required"),
  ingredients: z.string().min(1, "Ingredients are required"),
}).superRefine((data, ctx) => {
  if (data.category === 'Perfume' && (!data.size || data.size.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['size'],
      message: 'Size is required for perfumes (e.g., 50ml).',
    });
  }
});

async function uploadImage(file: File): Promise<string> {
  // Explicitly check for environment variables
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary API credentials are not configured on the server. Please set them in your environment variables.");
  }

  if (!file || typeof file.arrayBuffer !== 'function') {
      console.error('UploadImage Error: Invalid file object received.', file);
      throw new Error('Invalid file was provided for upload.');
  }

  const fileBuffer = await file.arrayBuffer();
  const mime = file.type;
  const encoding = 'base64';
  const base64Data = Buffer.from(fileBuffer).toString('base64');
  const fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;

  try {
    const result = await cloudinary.uploader.upload(fileUri, {
      folder: 'lorve-products',
    });
    return result.secure_url;
  } catch (error: any) {
    console.error('Cloudinary Upload Error:', error);
    let errorMessage = 'Image upload failed due to a server error.';
    if (error.http_code === 401 || error.message?.includes('invalid signature')) {
      errorMessage = 'Could not authenticate with Cloudinary. Please check your API credentials in the .env file.';
    } else if (error.message) {
      errorMessage = `Upload Error: ${error.message}`;
    }
    throw new Error(errorMessage);
  }
}

export async function addProduct(formData: FormData) {
  const imageFile = formData.get('image') as File | null;
  
  const rawData = {
    name: formData.get('name'),
    brand: formData.get('brand'),
    price: formData.get('price'),
    gender: formData.get('gender'),
    category: formData.get('category'),
    size: formData.get('size'),
    notes: formData.get('notes'),
    description: formData.get('description'),
    ingredients: formData.get('ingredients'),
  };

  const parsed = ProductFormSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().fieldErrors,
    };
  }
  
  let imageUrl = "https://placehold.co/600x600.png";
  if (imageFile && imageFile.size > 0) {
    try {
      imageUrl = await uploadImage(imageFile);
    } catch (uploadError: any) {
      return {
        success: false,
        error: { _global: [uploadError.message] },
      };
    }
  }

  const productData = {
    ...parsed.data,
    image: imageUrl,
  };

  try {
    await addDoc(collection(firestore, "products"), {
      ...productData,
      notes: productData.notes.split(',').map(note => note.trim()),
      ingredients: productData.ingredients.split(',').map(ing => ing.trim()),
      createdAt: serverTimestamp(),
    });

    revalidatePath('/products');
    revalidatePath('/admin');
    
    return { success: true };
  } catch (error: any) {
    console.error("Error adding document: ", error);
    const errorMessage = error.message || "An unexpected error occurred while adding the product.";
    return {
      success: false,
      error: { _global: [errorMessage] },
    };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  const imageFile = formData.get('image') as File | null;
  const existingImageUrl = formData.get('image_url') as string | null;

  const rawData = {
    name: formData.get('name'),
    brand: formData.get('brand'),
    price: formData.get('price'),
    gender: formData.get('gender'),
    category: formData.get('category'),
    size: formData.get('size'),
    notes: formData.get('notes'),
    description: formData.get('description'),
    ingredients: formData.get('ingredients'),
  };

  const parsed = ProductFormSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().fieldErrors,
    };
  }
  
  let finalImageUrl = existingImageUrl || "";
  if (imageFile && imageFile.size > 0) {
    try {
      finalImageUrl = await uploadImage(imageFile);
    } catch (uploadError: any) {
       return {
        success: false,
        error: { _global: [uploadError.message] },
      };
    }
  }

  const productData = {
    ...parsed.data,
    image: finalImageUrl,
  };

  try {
    const productRef = doc(firestore, "products", id);
    await updateDoc(productRef, {
      ...productData,
      notes: productData.notes.split(',').map(note => note.trim()),
      ingredients: productData.ingredients.split(',').map(ing => ing.trim()),
      updatedAt: serverTimestamp(),
    });

    revalidatePath(`/products/${id}`);
    revalidatePath('/products');
    revalidatePath('/admin');
    
    return { success: true };
  } catch (error: any) {
    console.error("Error updating document: ", error);
    const errorMessage = error.message || "An unexpected error occurred while updating the product.";
    return {
      success: false,
      error: { _global: [errorMessage] },
    };
  }
}

export async function deleteProduct(id: string) {
  if (!id) {
    return { success: false, error: { _global: ["Product ID is required."] } };
  }

  try {
    await deleteDoc(doc(firestore, "products", id));
    revalidatePath('/products');
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting document: ", error);
    const errorMessage = error.message || "An unexpected error occurred while deleting the product.";
    return {
      success: false,
      error: { _global: [errorMessage] },
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
  } catch (error: any) {
    console.error("Error saving address:", error);
    const errorMessage = error.message || "Failed to save address.";
    return {
      success: false,
      error: errorMessage
    };
  }
}

// Admin Management Actions

export async function getAdminEmails(): Promise<{ emails?: string[], error?: string }> {
  try {
    const adminDocRef = doc(firestore, 'settings', 'admin_users');
    const adminDoc = await getDoc(adminDocRef);
    if (adminDoc.exists()) {
      return { emails: adminDoc.data().emails || [] };
    }
    // If doc doesn't exist, return empty array
    return { emails: [] };
  } catch (error: any) {
    return { error: "Could not fetch admin users." };
  }
}

export async function addAdminEmail(email: string): Promise<{ success: boolean; error?: string }> {
  if (!email || !z.string().email().safeParse(email).success) {
    return { success: false, error: 'A valid email is required.' };
  }
  const adminDocRef = doc(firestore, 'settings', 'admin_users');
  try {
    // Using set with merge to create the document if it doesn't exist
    await setDoc(adminDocRef, { emails: arrayUnion(email.toLowerCase()) }, { merge: true });
    revalidatePath('/admin/settings');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Failed to add new admin." };
  }
}

export async function removeAdminEmail(email: string): Promise<{ success: boolean; error?: string }> {
  if (!email) {
    return { success: false, error: 'Email is required.' };
  }
  const adminDocRef = doc(firestore, 'settings', 'admin_users');
  try {
    await updateDoc(adminDocRef, { emails: arrayRemove(email.toLowerCase()) });
    revalidatePath('/admin/settings');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Failed to remove admin." };
  }
}

export async function sendPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  if (!email) {
    return { success: false, error: "Email is required to send a password reset." };
  }
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
