import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaItem } from '../types/media';

type Props = {
  item: MediaItem;
  onEdit: (item: MediaItem) => void;
  onDelete: (id: number) => void;
};

export default function MediaCard({ item, onEdit, onDelete }: Props) {
  return (
    <tr className="border-b hover:bg-gray-50 transition">
      <td className="p-2">{item.title}</td>
      <td className="p-2">{item.type}</td>
      <td className="p-2">{item.director}</td>
      <td className="p-2">${item.budget.toLocaleString()}</td>
      <td className="p-2">{item.location}</td>
      <td className="p-2">{item.duration} mins</td>
      <td className="p-2">{item.year}</td>
      <td className="p-2 flex gap-2">
        <Button size="sm" variant="outline" onClick={() => onEdit(item)}>
          <Pencil className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="destructive" onClick={() => onDelete(item.id)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </td>
    </tr>
  );
}
