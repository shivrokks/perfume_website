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
                <p className="mt-1 text-muted-foreground">Mon - Sun, 9am - 5pm </p>
                <a href="tel:+1234567890" className="mt-2 text-primary hover:underline">
                  +91 99363 07794 
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
                  Makrand Nagar,
                  <br />
                  Kannauj, 209727, Uttar Pradesh
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
