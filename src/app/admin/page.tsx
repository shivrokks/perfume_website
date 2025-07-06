
// @ts-nocheck
"use client";

import React, { useState, useEffect } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { addProduct, updateProduct, deleteProduct } from '@/app/actions';
import { getProducts } from '@/lib/products';
import type { Perfume } from '@/lib/types';

import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Terminal, ShieldAlert } from 'lucide-react';

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  gender: z.enum(["Men", "Women", "Unisex"]),
  category: z.enum(['Perfume', 'Oils']),
  size: z.string().optional(),
  notes: z.string().min(1, "Provide comma-separated notes"),
  description: z.string().min(1, "Description is required"),
  ingredients: z.string().min(1, "Provide comma-separated ingredients"),
  image: z.any().optional(), // Allow file or string
}).superRefine((data, ctx) => {
  if (data.category === 'Perfume' && (!data.size || data.size.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['size'],
      message: 'Size is required for perfumes (e.g., 50ml).',
    });
  }
});

const defaultFormValues = {
  name: '',
  brand: 'LORVÉ',
  price: 100,
  gender: 'Unisex' as const,
  category: 'Perfume' as const,
  size: '50ml',
  notes: '',
  description: '',
  ingredients: '',
  image: null,
};

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [products, setProducts] = useState<Perfume[]>([]);
  const [isFetchingProducts, setIsFetchingProducts] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Perfume | null>(null);
  const [productToDelete, setProductToDelete] = useState<Perfume | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: defaultFormValues,
  });
  
  const category = form.watch('category');

  const { isSubmitting } = useFormState({ control: form.control });

  useEffect(() => {
    if (!loading && !isAdmin) {
      toast({
        variant: 'destructive',
        title: 'Unauthorized',
        description: 'You do not have permission to access this page.',
      });
      router.push('/');
    }
  }, [user, isAdmin, loading, router, toast]);

  const fetchProducts = async () => {
    setIsFetchingProducts(true);
    const fetchedProducts = await getProducts();
    setProducts(fetchedProducts);
    setIsFetchingProducts(false);
  };

  useEffect(() => {
    if(isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);

  const handleEditClick = (product: Perfume) => {
    setEditingProduct(product);
    setFormError(null);
    setImagePreview(product.image); // Set current image for preview
    form.reset({
      ...product,
      category: product.category || 'Perfume',
      notes: product.notes.join(', '),
      ingredients: product.ingredients.join(', '),
      image: product.image, // Pass existing URL to form state
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setImagePreview(null);
    setFormError(null);
    form.reset(defaultFormValues);
  };
  
  const handleDelete = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    const result = await deleteProduct(productToDelete.id);

    if (result.success) {
      toast({
        title: 'Product Deleted',
        description: `${productToDelete.name} has been successfully deleted.`,
      });
      fetchProducts(); // Refresh the list
    } else {
      const errorMsg = result.error?._global?.[0] || 'Failed to delete product.';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMsg,
      });
    }
    
    setIsDeleting(false);
    setProductToDelete(null); // Close the dialog
  };

  async function onSubmit(values: z.infer<typeof ProductSchema>) {
    setFormError(null); // Reset error on new submission

    const formData = new FormData();

    // Handle image separately
    if (values.image instanceof File) {
      formData.append('image', values.image);
    } else if (typeof values.image === 'string') {
      // For updates, pass the existing URL if no new file is chosen
      formData.append('image_url', values.image);
    }
    
    // Append other values
    for (const key in values) {
      if (key !== 'image' && values[key] !== undefined && values[key] !== null) {
        formData.append(key, values[key]);
      }
    }

    const result = editingProduct 
      ? await updateProduct(editingProduct.id, formData)
      : await addProduct(formData);

    if (result.success) {
      toast({
        title: editingProduct ? 'Product Updated' : 'Product Added',
        description: `${values.name} has been successfully ${editingProduct ? 'updated' : 'added'}.`,
      });
      form.reset(defaultFormValues);
      setEditingProduct(null);
      setImagePreview(null);
      fetchProducts(); // Refresh the list
    } else {
        const errorMsg = result.error?._global?.[0] || "An unknown error occurred.";
        setFormError(errorMsg);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: errorMsg,
        });
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <>
    <div className="container mx-auto py-12 space-y-12">
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Admin Status Debug</AlertTitle>
        <AlertDescription>
          <p>Logged in as: <span className="font-semibold">{user?.email}</span></p>
          <p>Required Admin Email: <span className="font-semibold">shivansh121shukla@gmail.com</span></p>
          <p>Is Admin? <span className="font-semibold">{isAdmin ? 'Yes' : 'No'}</span></p>
          <p className="mt-2">If "Is Admin?" is No, there is a mismatch. If Yes, and you still see permission errors, the issue is with the server environment's authentication.</p>
        </AlertDescription>
      </Alert>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
        </CardHeader>
        <CardContent>
          {formError && (
            <Alert variant="destructive" className="mb-6">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Action Failed</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Elysian Bloom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input placeholder="LORVÉ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Perfume">Perfume</SelectItem>
                          <SelectItem value="Oils">Oils</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{category === 'Oils' ? 'Price per 100ml' : 'Price'}</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="180" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Men">Men</SelectItem>
                          <SelectItem value="Women">Women</SelectItem>
                          <SelectItem value="Unisex">Unisex</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 {category === 'Perfume' && (
                   <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size</FormLabel>
                        <FormControl>
                          <Input placeholder="50ml" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 )}
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="A captivating floral fragrance..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fragrance Notes</FormLabel>
                    <FormControl>
                      <Input placeholder="Jasmine, Tuberose, Sandalwood" {...field} />
                    </FormControl>
                    <FormDescription>Comma-separated values.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ingredients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ingredients</FormLabel>
                    <FormControl>
                      <Input placeholder="Alcohol Denat., Parfum, Aqua" {...field} />
                    </FormControl>
                    <FormDescription>Comma-separated values.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Image</FormLabel>
                    {imagePreview && (
                      <div className="relative w-40 h-40 mb-4">
                        <Image src={imagePreview} alt="Product preview" layout="fill" objectFit="cover" className="rounded-md" />
                      </div>
                    )}
                    <FormControl>
                      <Input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            field.onChange(file);
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>Upload a new image. This will replace the current one.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingProduct ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    editingProduct ? 'Update Product' : 'Add Product'
                  )}
                </Button>
                {editingProduct && (
                  <Button type="button" variant="outline" onClick={handleCancelEdit}>
                    Cancel Edit
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Existing Products</CardTitle>
        </CardHeader>
        <CardContent>
          {isFetchingProducts ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.category === 'Oils' ? '-' : product.size}</TableCell>
                    <TableCell>${product.price.toFixed(2)}{product.category === 'Oils' ? '/100ml' : ''}</TableCell>
                    <TableCell>{product.gender}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(product)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => setProductToDelete(product)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
    <AlertDialog open={!!productToDelete} onOpenChange={(isOpen) => !isOpen && setProductToDelete(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the product
            <span className="font-bold"> {productToDelete?.name}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setProductToDelete(null)} disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            disabled={isDeleting} 
            className={buttonVariants({ variant: "destructive" })}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
