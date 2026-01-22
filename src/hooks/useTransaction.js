import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminAPITransaction } from '../services/api/api-admin';


export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
};


export const useTransactionList = () => {
  return useQuery({
    queryKey: ['transaction-list'],
    queryFn: () => adminAPITransaction.getAll(), // GET /news
  });
};

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminAPITransaction.delete(id),
    onSuccess: () => {
      // Refresh the table after deletion
      queryClient.invalidateQueries(['transaction-list']);
    },
  })
}