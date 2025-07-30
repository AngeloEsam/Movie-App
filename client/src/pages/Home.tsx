import { useEffect, useRef, useState } from 'react';
import api from '../lib/api';
import { MediaItem } from '../types/media';
import MediaCard from '../components/MediaCard';
import MediaForm from '../components/MediaForm';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [selected, setSelected] = useState<MediaItem | undefined>();
  const [openModal, setOpenModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const pageRef = useRef(1);

  const loadMediaFromPage = async (targetPage: number) => {
    setLoading(true);
    try {
      const res = await api.get(`/media?page=${targetPage}`);
      const newItems = res.data.media.map((item: any) => ({
        ...item,
        id: Number(item.id),
      }));

      setMediaList(prev =>
        targetPage === 1 ? newItems : [...prev, ...newItems]
      );
      setHasMore(res.data.hasMore);
      pageRef.current = targetPage + 1;
    } catch (err) {
      console.error('Error loading media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMediaFromPage(1);

    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100;
      console.log(nearBottom)
      if (nearBottom && !loading && hasMore) {
        loadMediaFromPage(pageRef.current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (selected) setOpenModal(true);
  }, [selected]);

  const handleSubmit = (item: MediaItem) => {
    const exists = mediaList.find(m => m.id === item.id);

    if (exists) {
      setMediaList(prev =>
        prev.map(m => (m.id === item.id ? item : m))
      );
    } else {
      setMediaList(prev => [item, ...prev]);
    }

    setSelected(undefined);
    setOpenModal(false);
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      try {
        await api.delete(`/media/${deleteId}`);
        setMediaList(prev => prev.filter(i => i.id !== deleteId));
      } catch (err) {
        console.error('Error deleting media:', err);
      } finally {
        setDeleteId(null);
        setShowConfirm(false);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-center">Favorite Movies & TV Shows</h1>
        <Button
          onClick={() => {
            setSelected(undefined);
            setOpenModal(true);
          }}
        >
          Add Media
        </Button>
      </div>

      <div className="overflow-x-auto mt-6">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Director</th>
              <th className="p-2 text-left">Budget</th>
              <th className="p-2 text-left">Location</th>
              <th className="p-2 text-left">Duration</th>
              <th className="p-2 text-left">Year</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mediaList.map(item => (
              <MediaCard
                key={item.id}
                item={item}
                onEdit={setSelected}
                onDelete={id => {
                  setDeleteId(id);
                  setShowConfirm(true);
                }}
              />
            ))}
          </tbody>
        </table>
        {loading && <p className="text-center text-gray-500 mt-4">Loading...</p>}
        {!hasMore && (
          <p className="text-center text-gray-400 mt-4">No more items.</p>
        )}
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected ? 'Edit Media' : 'Add Media'}</DialogTitle>
          </DialogHeader>
          <MediaForm item={selected} onSubmit={handleSubmit} />
        </DialogContent>
      </Dialog>

      <ConfirmDeleteModal
        open={showConfirm}
        setOpen={setShowConfirm}
        onConfirm={handleDelete}
      />
    </div>
  );
}
