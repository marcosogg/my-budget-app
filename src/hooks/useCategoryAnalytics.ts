import { useState } from 'react';

export type SortOption = 'amount-asc' | 'amount-desc' | 'name-asc' | 'name-desc' | 'count-asc' | 'count-desc';

export interface CategoryFilters {
  search: string;
  minAmount: number | null;
  maxAmount: number | null;
}

export const useCategoryAnalytics = () => {
  const [sortOption, setSortOption] = useState<SortOption | null>(null);
  const [filters, setFilters] = useState<CategoryFilters>({
    search: '',
    minAmount: null,
    maxAmount: null,
  });

  const updateFilter = (key: keyof CategoryFilters, value: string | number | null) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      minAmount: null,
      maxAmount: null,
    });
    setSortOption(null);
  };

  return {
    sortOption,
    setSortOption,
    filters,
    updateFilter,
    clearFilters,
  };
};