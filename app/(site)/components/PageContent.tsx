'use client';

import { Song } from '@/types';
import SongItem from '@/components/SongItem';
import useOnPlay from '@/hooks/useOnPlay';

interface PageContentProps {
  songs: Song[];
}

const PageContent: React.FC<PageContentProps> = ({ songs }) => {
  const onPlay = useOnPlay(songs);

  if (!songs.length) {
    return (
      <div className="flex justify-center items-center h-96">
        <h1 className="text-white text-2xl font-semibold">No Songs Found</h1>
      </div>
    );
  }
  return (
    <div
      className="
        grid 
        grid-cols-2
        sm:grid-cols-3
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
        2xl:grid-cols-8
        gap-4
        mt-4
      "
    >
      {songs.map((song) => (
        <SongItem
          key={song.id}
          onClick={(id: string) => {
            onPlay(id); 
          }}
          data={song}
        />
      ))}
    </div>
  );
};

export default PageContent;
