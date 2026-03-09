import { formatDistanceToNow } from 'date-fns';
import { FileText, Trash2, Edit2 } from 'lucide-react';
import { Text, Badge, Button } from '../atoms';
import { Card } from './Card';
import type { Note } from '../../types';

export interface NoteCardProps {
  note: Note;
  domainColor?: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const NoteCard = ({
  note,
  domainColor = '#00D4FF',
  onEdit,
  onDelete,
}: NoteCardProps) => {
  const preview =
    note.content.slice(0, 150) + (note.content.length > 150 ? '...' : '');

  return (
    <Card
      accentColor={domainColor}
      className="hover:scale-[1.01] transition-transform"
    >
      <div className="flex items-start gap-3">
        <div
          className="p-2 rounded-lg flex-shrink-0"
          style={{ backgroundColor: `${domainColor}22` }}
        >
          <FileText className="w-5 h-5" style={{ color: domainColor }} />
        </div>

        <div className="flex-1 min-w-0">
          <Text variant="body" className="font-semibold truncate">
            {note.title}
          </Text>
          <Text variant="small" className="text-cyber-muted line-clamp-2 mt-1">
            {preview}
          </Text>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge
              size="sm"
              style={{ backgroundColor: `${domainColor}22`, color: domainColor }}
            >
              Domain {note.domainId}
            </Badge>
            {note.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} size="sm" variant="cyan">
                {tag}
              </Badge>
            ))}
            <span className="text-xs text-cyber-muted ml-auto">
              {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
            </span>
          </div>
        </div>

        <div className="flex gap-1 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 className="w-4 h-4 text-accent-pink" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
