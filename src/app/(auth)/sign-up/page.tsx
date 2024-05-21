'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDebounceCallback } from 'usehooks-ts';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/validators';
import { z } from 'zod';
import { ApiResponse } from '@/types/api-response';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EyeIcon, EyeOff, Loader2 } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const Page: React.FC = () => {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const Icon = showPassword ? EyeIcon : EyeOff;

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const debounced = useDebounceCallback(setUsername, 300);

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) setIsCheckingUsername(true);

      try {
        const response = await axios.get<ApiResponse>(
          `/api/check-username-unique?username=${username}`
        );
        setUsernameMessage(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(axiosError.response?.data.message ?? 'Error');
      } finally {
        setIsCheckingUsername(false);
      }
    };

    if (username.length > 2) checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    setShowPassword(false);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      toast({
        title: 'Success',
        description: response.data.message,
        duration: 3000,
      });
      router.replace(`/verify/${username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: 'SignUp Failed',
        description: errorMessage,
        duration: 3000,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    {...field}
                    onChange={e => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                  />
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === 'Username is available'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} name="email" />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Password</FormLabel>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    {...field}
                    name="password"
                  />
                  <Icon
                    className="absolute space-y-3 right-3 top-8 text-black-900 z-20 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Confirm Password</FormLabel>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    {...field}
                    name="confirmPassword"
                  />
                  <Icon
                    className="absolute space-y-3 right-3 top-8 text-black-900 z-20 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Page;
