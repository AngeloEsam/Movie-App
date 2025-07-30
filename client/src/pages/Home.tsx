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
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  const loadMediaFromPage = async (targetPage: number) => {
    if (loadingRef.current || !hasMoreRef.current) return;

    setLoading(true);
    loadingRef.current = true;

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
      hasMoreRef.current = res.data.hasMore;

      pageRef.current = targetPage + 1;
    } catch (err) {
      console.error('Error loading media:', err);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    loadMediaFromPage(1);

    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100;

      if (
        nearBottom &&
        !loadingRef.current &&
        hasMoreRef.current
      ) {
        loadMediaFromPage(pageRef.current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        document.documentElement.scrollHeight <= window.innerHeight &&
        !loadingRef.current &&
        hasMoreRef.current
      ) {
        loadMediaFromPage(pageRef.current);
      }
    }, 500);
    return () => clearInterval(interval);
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
              <th className="p-2 text-center">Title</th>
              <th className="p-2 text-center">Type</th>
              <th className="p-2 text-center">Director</th>
              <th className="p-2 text-center">Budget</th>
              <th className="p-2 text-center">Location</th>
              <th className="p-2 text-center">Duration</th>
              <th className="p-2 text-center">Year</th>
              <th className="p-2 text-center">Actions</th>
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
        {!hasMore && !loading && (
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
