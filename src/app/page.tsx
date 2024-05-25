'use client';

import Autoplay from 'embla-carousel-autoplay';
import messages from '@/lib/data/messages.json';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <>
      <main className="h-screen w-screen flex-grow flex flex-col items-center justify-center bg-gray-800 text-white px-6 md:px-0">
        <section className="text-center">
          <h1 className="text-2xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:my-4 text-base md:text-lg">
            Mystery Messenger - Where your identity remains a secret.
          </p>
        </section>

        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-lg md:max-w-xl my-8"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <Card className="">
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">
                      {message.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <div>
                      <div className="flex items-start gap-3">
                        <Mail />
                        <p>{message.content}</p>
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground mt-2">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="flex flex-col items-center gap-4 md:gap-8 mt-6">
          <h1>Send anonymous message</h1>
          <Link href={'/sign-up'}>
            <Button>Start Here</Button>
          </Link>
        </div>
      </main>
      <footer className=" fixed bottom-0 left-0 right-0 text-center p-4 md:p-6 bg-gray-900 text-white">
        © 2024 Mystery Messenger. All rights reserved.
      </footer>
    </>
  );
}
