'use client';

import { SyncLoader } from 'react-spinners';

import Box from '@/components/Box';

const Loading = () => {
  return (
    <Box className="flex h-full items-center justify-center">
      <SyncLoader color="#22c55e" size={20} />
    </Box>
  );
};

export default Loading;
