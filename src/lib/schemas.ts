import { z } from 'zod';

export const AddressSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State/Province is required"),
  postalCode: z.string().min(4, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  phone: z.string().min(10, "A valid phone number is required"),
});