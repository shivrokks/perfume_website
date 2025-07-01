import { getProducts } from "@/lib/products";
import ProductGrid from "@/components/product-grid";

export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <div className="container mx-auto py-12">
            <div className="text-center mb-12">
                <h1 className="font-headline text-4xl md:text-5xl font-bold">Our Collection</h1>
                <p className="text-muted-foreground mt-2 text-lg">Explore our curated selection of fine fragrances.</p>
            </div>
            <ProductGrid allProducts={products} />
        </div>
    );
}
