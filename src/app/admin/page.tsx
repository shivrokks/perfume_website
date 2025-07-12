
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

const productCategories = ['Floral Water', 'Essential Oil', 'Flavored Oils', 'Body Perfume', 'Fragrance Oil', 'Arabic Attar'] as const;

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  gender: z.enum(["Men", "Women", "Unisex"]),
  category: z.enum(productCategories),
  size: z.string().optional(),
  notes: z.string().min(1, "Provide comma-separated notes"),
  description: z.string().min(1, "Description is required"),
  ingredients: z.string().min(1, "Provide comma-separated ingredients"),
  image: z.any().optional(),
}).superRefine((data, ctx) => {
  if (data.category === 'Body Perfume' && (!data.size || data.size.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['size'],
      message: 'Size is required for Body Perfumes (e.g., 50ml).',
    });
  }
});

const defaultFormValues = {
  name: '',
  brand: 'LORVÉ',
  price: 100,
  gender: 'Unisex' as const,
  category: 'Body Perfume' as const,
  size: '50ml',
  notes: '',
  description: '',
  ingredients: '',
  image: undefined,
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
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: defaultFormValues,
  });
  
  const category = form.watch('category');
  const isOilTypeCategory = ['Essential Oil', 'Flavored Oils', 'Fragrance Oil', 'Arabic Attar'].includes(category);

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
    form.reset({
      ...product,
      category: product.category || 'Body Perfume',
      notes: product.notes.join(', '),
      ingredients: product.ingredients.join(', '),
      image: undefined, // Reset image field
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
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
    setFormError(null);

    const formData = new FormData();
    
    // Append all form values, but handle image separately
    for (const key in values) {
      if (key !== 'image' && values[key] !== undefined && values[key] !== null) {
        formData.append(key, values[key]);
      }
    }

    const imageFileList = form.getValues('image');
    if (imageFileList && imageFileList.length > 0) {
      formData.append('image', imageFileList[0]);
    }
    
    if (editingProduct) {
      formData.append('image_url', editingProduct.image);
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
      fetchProducts(); // Refresh the list
    } else {
        const fieldErrors = result.error;
        let errorMsg = "An unknown error occurred.";
        if (fieldErrors?._global) {
          errorMsg = fieldErrors._global[0];
        } else if (fieldErrors) {
          // If there are field-specific errors, construct a message.
          const firstErrorField = Object.keys(fieldErrors)[0];
          errorMsg = fieldErrors[firstErrorField]?.[0] || 'Please check the form for errors.';
          form.setError(firstErrorField, { type: 'manual', message: errorMsg });
        }
        setFormError(errorMsg);
        toast({
            variant: 'destructive',
            title: 'Action Failed',
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
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
        </CardHeader>
        <CardContent>
          {formError && (
            <Alert variant="destructive" className="mb-6">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
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
                          {productCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
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
                      <FormLabel>{isOilTypeCategory ? 'Price per 100ml' : 'Price'}</FormLabel>
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
                 {category === 'Body Perfume' && (
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

              {editingProduct && editingProduct.image && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Current Image</p>
                  <Image src={editingProduct.image} alt="Current product image" width={100} height={100} className="rounded-md border object-cover" />
                </div>
              )}

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Image</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => field.onChange(e.target.files)}
                      />
                    </FormControl>
                    <FormDescription>
                      {editingProduct ? 'Leave blank to keep current image.' : 'Image is required.'} Max 5MB.
                    </FormDescription>
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
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const isProductOil = ['Essential Oil', 'Flavored Oils', 'Fragrance Oil', 'Arabic Attar'].includes(product.category);
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Image src={product.image} alt={product.name} width={48} height={48} className="rounded-md border object-cover" />
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.category === 'Body Perfume' ? product.size : '-'}</TableCell>
                      <TableCell>${product.price.toFixed(2)}{isProductOil ? '/100ml' : ''}</TableCell>
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
                  );
                })}
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
