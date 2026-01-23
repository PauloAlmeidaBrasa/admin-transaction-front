import { useQuery,useMutation, useQueryClient } from '@tanstack/react-query';
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
    queryFn: () => adminAPITransaction.getAll(),
  });
};

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminAPITransaction.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['transaction-list']);
    },
  })
}
export const useUpdateTransaction = (options = {}) => {
  const queryClient = useQueryClient();


  return useMutation({
    mutationFn: ({ id, payload }) => adminAPITransaction.update(id, payload),
    onSuccess: (...args) => {
      if (options.onSuccess) {
        options.onSuccess(...args);
      }
      queryClient.invalidateQueries(['news-list']);
    },
  });
}
export const useTransactionById = (id) => {
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: () => adminAPITransaction.getById(id),
    enabled: !!id,
  });
};
