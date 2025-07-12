
"use server";

import { z } from "zod";
import { firestore } from "@/lib/firebase";
import cloudinary from "@/lib/cloudinary";
import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import type { Address } from "@/lib/types";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const ProductFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  gender: z.enum(["Men", "Women", "Unisex"]),
  category: z.enum(['Floral Water', 'Essential Oil', 'Flavored Oils', 'Body Perfume', 'Fragrance Oil', 'Arabic Attar']),
  size: z.string().optional(),
  notes: z.string().min(1, "Notes are required"),
  description: z.string().min(1, "Description is required"),
  ingredients: z.string().min(1, "Ingredients are required"),
  image: z
    .instanceof(File)
    .optional()
    .refine(file => !file || file.size <= MAX_FILE_SIZE, 'Image must be less than 5MB')
    .refine(file => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), 'Only .jpg, .jpeg, .png and .webp formats are supported.'),
}).superRefine((data, ctx) => {
  if (['Body Perfume', 'Floral Water', 'Arabic Attar'].includes(data.category) && (!data.size || data.size.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['size'],
      message: 'Size is required for this product category (e.g., 50ml).',
    });
  }
});

const uploadStream = (buffer: Buffer, options: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    stream.end(buffer);
  });
};

export async function addProduct(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  
  const parsed = ProductFormSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().fieldErrors,
    };
  }

  const { image: imageFile, ...productDataFields } = parsed.data;

  try {
    let imageUrl: string;

    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await uploadStream(buffer, {
        folder: 'lorve-products',
        resource_type: 'image'
      });
      imageUrl = uploadResult.secure_url;
    } else {
       return {
            success: false,
            error: { image: ["Product image is required."] }
       };
    }

    const productData = {
      ...productDataFields,
      image: imageUrl,
    };

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
  const existingImageUrl = formData.get('image_url') as string | null;
  const rawData = Object.fromEntries(formData.entries());

  const parsed = ProductFormSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().fieldErrors,
    };
  }
  
  const { image: imageFile, ...productDataFields } = parsed.data;
  let imageUrl = existingImageUrl || "https://placehold.co/600x600.png";

  try {
    if (imageFile && imageFile.size > 0) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadResult = await uploadStream(buffer, {
            folder: 'lorve-products',
            resource_type: 'image'
        });
        imageUrl = uploadResult.secure_url;
    }

    const productData = {
        ...productDataFields,
        image: imageUrl
    };

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
    revalidatePath('/profile');

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
