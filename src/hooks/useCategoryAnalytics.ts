import { useState } from 'react';
import { Tag } from '@/types/tags';

export type SortOption = 'amount-asc' | 'amount-desc' | 'name-asc' | 'name-desc' | 'count-asc' | 'count-desc';

export interface CategoryFilters {
  search: string;
  minAmount: number | null;
  maxAmount: number | null;
  tags: Tag[];
}

export const useCategoryAnalytics = () => {
  const [sortOption, setSortOption] = useState<SortOption | null>(null);
  const [filters, setFilters] = useState<CategoryFilters>({
    search: '',
    minAmount: null,
    maxAmount: null,
    tags: [],
  });

  const updateFilter = (key: keyof CategoryFilters, value: string | number | null | Tag[]) => {
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
      tags: [],
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