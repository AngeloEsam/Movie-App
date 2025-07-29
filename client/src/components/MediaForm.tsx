// Updated MediaForm.tsx with full form fields and UI polish
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import api from '../lib/api';
import { MediaItem } from '../types/media';

type Props = {
  item?: MediaItem;
  onSubmit: (item: MediaItem) => void;
};

export default function MediaForm({ item, onSubmit }: Props) {
  const [form, setForm] = useState({
    title: '',
    type: 'Movie',
    director: '',
    budget: 0,
    location: '',
    duration: 0,
    year: 2024,
  });

  useEffect(() => {
    if (item) setForm(item);
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: ['budget', 'duration', 'year'].includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = item
      ? await api.put(`/media/${item.id}`, form)
      : await api.post('/media', form);
    onSubmit(res.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-white rounded shadow">
      <Input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="w-full border rounded p-2"
      >
        <option value="Movie">Movie</option>
        <option value="TV Show">TV Show</option>
      </select>
      <Input name="director" placeholder="Director" value={form.director} onChange={handleChange} required />
      <Input type="number" name="budget" placeholder="Budget" value={form.budget} onChange={handleChange} required />
      <Input name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
      <Input type="number" name="duration" placeholder="Duration (minutes)" value={form.duration} onChange={handleChange} required />
      <Input type="number" name="year" placeholder="Year" value={form.year} onChange={handleChange} required />
      <Button type="submit" className="w-full">
        {item ? 'Update' : 'Add'} Media
      </Button>
    </form>
  );
}
