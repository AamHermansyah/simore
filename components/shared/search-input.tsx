'use client'

import React, { ChangeEvent, useEffect, useMemo } from 'react'
import _ from 'lodash'
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';

interface IProps {
  placeholder: string;
  onChange?: (value: string) => void;
  className?: string;
  defaultValue?: string;
}

function SearchInput({ placeholder, onChange, className, defaultValue }: IProps) {
  const debouncedResults = useMemo(() => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(event.target.value);
    };

    return _.debounce(handleChange, 500);
  }, [onChange]);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  }, [debouncedResults]);

  return (
    <div className={cn('relative flex-1 max-w-xs', className)}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
      <Input
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={debouncedResults}
        className="pl-10"
      />
    </div>
  )
}

export default SearchInput