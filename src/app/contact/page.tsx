import { Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function ContactPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-headline text-base font-semibold uppercase tracking-wider text-primary">Contact Us</h2>
          <p className="mt-2 text-4xl font-extrabold tracking-tight font-headline sm:text-5xl">We're Here to Help</p>
          <p className="mt-5 max-w-prose mx-auto text-xl text-muted-foreground">
            Have questions about our fragrances, your order, or just want to say hello? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground">
                  <Mail className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium font-headline">Email Us</h3>
                <p className="mt-1 text-muted-foreground">Our team is here to respond to your inquiries.</p>
                <a href="mailto:support@lorve.com" className="mt-2 text-primary hover:underline">
                  support@lorve.com
                </a>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground">
                  <Phone className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium font-headline">Call Us</h3>
                <p className="mt-1 text-muted-foreground">Mon - Fri, 9am - 5pm CET</p>
                <a href="tel:+1234567890" className="mt-2 text-primary hover:underline">
                  +1 (234) 567-890
                </a>
              </div>
            </div>
             <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground">
                  <MapPin className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium font-headline">Visit Us</h3>
                <p className="mt-1 text-muted-foreground">
                  123 Perfume Avenue,
                  <br />
                  Paris, 75001, France
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Send a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form action="#" method="POST" className="space-y-6">
                  <div>
                    <label htmlFor="full-name" className="sr-only">Full Name</label>
                    <Input id="full-name" name="full-name" type="text" autoComplete="name" placeholder="Full Name" />
                  </div>
                  <div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <Input id="email" name="email" type="email" autoComplete="email" placeholder="Email Address" />
                  </div>
                  <div>
                     <label htmlFor="phone" className="sr-only">Phone</label>
                    <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="Phone Number (Optional)" />
                  </div>
                  <div>
                    <label htmlFor="message" className="sr-only">Message</label>
                    <Textarea id="message" name="message" rows={4} placeholder="Your Message" />
                  </div>
                  <div>
                    <Button type="submit" className="w-full">
                      Submit
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Map Section */}
        <div className="mt-20">
           <div className="text-center mb-8">
             <h3 className="text-3xl font-headline font-extrabold tracking-tight">Our Flagship Boutique</h3>
             <p className="mt-2 max-w-prose mx-auto text-lg text-muted-foreground">
                Step into the world of LORVÉ in the heart of Paris.
            </p>
           </div>
           <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-xl">
               <Image
                src="https://placehold.co/1200x600.png"
                alt="Map to LORVÉ boutique"
                layout="fill"
                objectFit="cover"
                data-ai-hint="city map"
              />
            </div>
        </div>

      </div>
    </div>
  );
}
