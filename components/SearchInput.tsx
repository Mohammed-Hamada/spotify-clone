'use client';

import { useEffect, useState } from 'react';
import queryString from 'query-string';
import { useRouter } from 'next/navigation';

import useDebounce from '@/hooks/useDebounce';
import Input from './Input';

const SearchInput = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const query = {
      title: debouncedSearchTerm,
    };

    const url = queryString.stringifyUrl({
      url: '/search',
      query,
    });

    router.push(url);
  }, [debouncedSearchTerm, router]);

  return (
    <Input
      placeholder="What do you want to listen to?"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
};

export default SearchInput;
