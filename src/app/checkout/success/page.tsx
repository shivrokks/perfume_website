import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center text-center py-20">
      <CheckCircle className="h-24 w-24 text-green-500 mb-6" />
      <h1 className="text-4xl font-headline font-bold mb-4">Thank You for Your Order!</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
        We've received your order and are getting it ready for you. You will receive an email confirmation shortly.
      </p>
      <Button asChild size="lg">
        <Link href="/products">Continue Shopping</Link>
      </Button>
    </div>
  );
}
