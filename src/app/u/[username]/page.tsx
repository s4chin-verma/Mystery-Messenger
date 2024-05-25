'use client';

import * as z from 'zod';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { anonymousMessageSchema } from '@/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import type { ApiResponse } from '@/types/api-response';
import { Separator } from '@/components/ui/separator';

export default function Page() {
  const [isAcceptingMessage, setIsAcceptingMessage] = useState<boolean | null>(
    null
  );
  const [messages, setMessages] = useState<string[]>([]);
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  const username = params.username;

  const form = useForm<z.infer<typeof anonymousMessageSchema>>({
    resolver: zodResolver(anonymousMessageSchema),
    defaultValues: { content: '' },
  });

  const { setValue } = form;

  const onSubmit = useCallback(
    async (data: z.infer<typeof anonymousMessageSchema>) => {
      try {
        const response = await axios.post<ApiResponse>(`/api/send-messages`, {
          username,
          content: data.content,
        });
        toast({
          title: 'Message sent successfully!',
          duration: 3000,
          variant: 'success',
        });
        form.reset();
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        const errorMessage =
          axiosError.response?.data.message || 'An error occurred';
        toast({
          title: errorMessage,
          duration: 3000,
          variant: 'destructive',
        });
      }
    },
    [username, form, toast]
  );

  const suggestMessages = useCallback(async () => {
    try {
      toast({ title: 'Suggesting messages...' });
      const response = await axios.post<string>(`/api/suggest-messages`);
      const data = response.data;
      const cleanData = data.replace(/["0:]/g, '');
      const messageArray = cleanData.split('||').map(message => message.trim());
      setMessages(messageArray);
      toast({ title: 'New message fetched by Gemini' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message || 'An error occurred';
      toast({
        title: errorMessage,
        variant: 'destructive',
      });
    }
  }, [toast]);

  const getIsUserAcceptingMessage = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponse>(
        `/api/accept-messages/${username}`
      );
      setIsAcceptingMessage(response.data.isAcceptingMessage as boolean);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message || 'An error occurred';
      toast({
        title: errorMessage,
        variant: 'destructive',
      });
    }
  }, [username, toast]);

  useEffect(() => {
    getIsUserAcceptingMessage();
  }, [getIsUserAcceptingMessage]);

  return (
    <main className="max-w-screen-xl mx-auto py-24 md:py-28 px-6 md:px-0">
      <h1 className="text-2xl md:text-4xl font-semibold">
        Public Profile Link
      </h1>
      {isAcceptingMessage ? (
        <h5 className="text-base my-2">
          Send anonymous message to @{username}
        </h5>
      ) : (
        <h5 className="text-red-600 text-base my-2">
          You can&apos;t send a message. The user @{username} is not accepting
          messages.
        </h5>
      )}
      <div className="mb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Textarea
                    {...field}
                    name="content"
                    placeholder="Write your anonymous message here..."
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isAcceptingMessage === false}
              className=""
              type="submit"
            >
              Send Message
            </Button>
          </form>
        </Form>
        <Separator className="my-6" />
        <Button className="" onClick={suggestMessages}>
          {messages.length === 0 ? ' Suggest Messages' : 'Suggest More'}
        </Button>
        {messages.length > 0 && (
          <>
            <h5 className="text-base md:text-xl my-2 text-center">
              Click on any message below to select it
            </h5>
            <div className="border-2 border-gray-100 rounded-xl p-2 md:p-5">
              <h1 className="text-base text-center md:text-lg font-bold mt-2 mb-4">
                Message generated By Gemini Ai
              </h1>
              {messages.map((message, index) => (
                <div
                  className="border-2 border-gray-200 rounded-xl py-1 px-4 md:py-2 md:px-6 mb-4"
                  key={index}
                >
                  <p
                    className="text-sm md:text-lg cursor-pointer"
                    onClick={() => setValue('content', message)}
                  >
                    {message}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col justify-center items-center gap-2 md:gap-5">
        <h1 className="text-base md:text-xl font-bold">
          Get Your Message Board ?
        </h1>
        <Link href={'/sign-up'}>
          <Button>Create an account</Button>
        </Link>
      </div>
    </main>
  );
}
