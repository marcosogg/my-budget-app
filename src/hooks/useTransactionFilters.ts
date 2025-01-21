import { useSearchParams } from 'react-router-dom';

interface TransactionFilters {
  type?: string;
  product?: string;
  description?: string;
}

export const useTransactionFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: TransactionFilters = {
    type: searchParams.get('type') || undefined,
    product: searchParams.get('product') || undefined,
    description: searchParams.get('description') || undefined,
  };

  const setFilter = (key: keyof TransactionFilters, value: string | undefined) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return {
    filters,
    setFilter,
    clearFilters,
  };
};