import { useState } from 'react';
import { Text, Input, Button, MarkdownEditor } from '../atoms';
import { Card, FormField } from '../molecules';
import { useCreateNoteMutation, useUpdateNoteMutation } from '../../store/api';
import type { Note } from '../../types';

export interface NoteEditorProps {
  note?: Note;
  domainId: number;
  topicIndex: number;
  topicName: string;
  onSave: () => void;
  onCancel: () => void;
}

export const NoteEditor = ({
  note,
  domainId,
  topicIndex,
  topicName,
  onSave,
  onCancel,
}: NoteEditorProps) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState(note?.tags.join(', ') || '');

  const [createNote, { isLoading: creating }] = useCreateNoteMutation();
  const [updateNote, { isLoading: updating }] = useUpdateNoteMutation();

  const isLoading = creating || updating;

  const handleSave = async () => {
    const tagArray = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (note) {
        await updateNote({
          noteId: note.id,
          input: { title, content, tags: tagArray },
        }).unwrap();
      } else {
        await createNote({
          domainId,
          topicIndex,
          title,
          content,
          tags: tagArray,
        }).unwrap();
      }

      onSave();
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const isValid = title.trim().length > 0 && content.trim().length > 0;

  return (
    <Card>
      <Text variant="label" className="mb-4">
        {note ? 'EDIT NOTE' : 'NEW NOTE'} - {topicName}
      </Text>

      <div className="space-y-4">
        <FormField label="Title" required>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
          />
        </FormField>

        <div>
          <label className="block text-sm font-mono text-cyber-muted mb-2">
            Content<span className="text-accent-pink ml-1">*</span>
          </label>
          <MarkdownEditor value={content} onChange={setContent} />
        </div>

        <FormField label="Tags (comma-separated)">
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="bedrock, rag, concepts..."
          />
        </FormField>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isValid || isLoading}
          >
            {isLoading ? 'Saving...' : note ? 'Update Note' : 'Save Note'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
