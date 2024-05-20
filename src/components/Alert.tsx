import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Button } from '@/components/ui/button';
import { Message } from 'ai';
import { useToast } from './ui/use-toast';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/api-response';

type AlertCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export const AlertCard: React.FC<AlertCardProps> = ({
  message,
  onMessageDelete,
}) => {
  const { toast } = useToast();
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/messages/${message.id}`);
      if (response.data.success) {
        onMessageDelete(message.id);
        toast({
          title: 'Success',
          description: response.data.message,
          duration: 3000,
        });
      } else {
        toast({
          title: 'Error',
          description: response.data.message,
          duration: 3000,
          variant: 'destructive',
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: 'Error',
        description: errorMessage,
        duration: 3000,
        variant: 'destructive',
      });
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive"></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
