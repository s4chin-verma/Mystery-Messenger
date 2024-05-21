'use client';

import * as z from 'zod';
import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import { anonymousMessageSchema } from '@/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useState } from 'react';
import { ApiResponse } from '@/types/api-response';
import { useToast } from '@/components/ui/use-toast';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export default function Page() {
  const params = useParams<{ username: string }>();
  const [isAcceptingMessage, setIsAcceptingMessage] = useState();
  const [messages, setMessages] = useState();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof anonymousMessageSchema>>({
    resolver: zodResolver(anonymousMessageSchema),
    defaultValues: { content: '' },
  });

  const onSubmit = async () => {
    try {
      const response = await axios.post<ApiResponse>(`/api/send-messages`, {
        username: params.username,
        content: form.getValues().content,
      });
      console.log(response);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: errorMessage,
        duration: 3000,
        variant: 'destructive',
      });
    }
  };

  const suggestMessages = async () => {
    try {
      const response = await axios.post<ApiResponse>(`/api/suggest-messages`);
      console.log(response);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: errorMessage,
        duration: 3000,
        variant: 'destructive',
      });
    }
  };

  const { setValue } = form;

  return (
    <>
      <section className="mt-10">
        <h1 className="text-4xl text-center font-bold mb-4">
          Public Profile Link
        </h1>
        <div className="mb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="content"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      Send anonymous message to @{params.username}
                    </FormLabel>
                    <Textarea
                      {...field}
                      name="content"
                      placeholder="Write your anonymous message here..."
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button>Send Message</Button>
            </form>
          </Form>
          <Button onClick={suggestMessages}>Suggest Messages</Button>
          <div>{messages}</div>
        </div>
      </section>
    </>
  );
}
