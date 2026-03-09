import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, FileText, Plus } from 'lucide-react';
import { MainLayout } from '../templates';
import { Text, Input, Badge, Spinner } from '../atoms';
import { Card, NoteCard } from '../molecules';
import { NoteEditor } from '../organisms';
import {
  useGetNotesQuery,
  useGetNotesSummaryQuery,
  useGetDomainsQuery,
  useDeleteNoteMutation,
} from '../../store/api';
import type { Note } from '../../types';

type EditorState =
  | { mode: 'closed' }
  | { mode: 'create'; domainId: number; topicIndex: number; topicName: string }
  | { mode: 'edit'; note: Note; topicName: string };

export function NotesPage() {
  const [selectedDomain, setSelectedDomain] = useState<number | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [editorState, setEditorState] = useState<EditorState>({ mode: 'closed' });

  const { data: notes, isLoading } = useGetNotesQuery(selectedDomain);
  const { data: summary } = useGetNotesSummaryQuery();
  const { data: domains } = useGetDomainsQuery();
  const [deleteNote] = useDeleteNoteMutation();

  const filteredNotes = notes?.filter(
    (note) =>
      !searchQuery ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (noteId: string) => {
    if (window.confirm('Delete this note?')) {
      await deleteNote(noteId);
    }
  };

  const handleEdit = (note: Note) => {
    const domain = domains?.find((d) => d.domainNumber === note.domainId);
    const topicName = domain?.topics[note.topicIndex] || `Topic ${note.topicIndex + 1}`;
    setEditorState({ mode: 'edit', note, topicName });
  };

  const handleCreateNew = () => {
    // Default to first domain, first topic
    const domain = domains?.[0];
    if (domain) {
      setEditorState({
        mode: 'create',
        domainId: domain.domainNumber,
        topicIndex: 0,
        topicName: domain.topics[0] || 'Topic 1',
      });
    }
  };

  const handleEditorClose = () => {
    setEditorState({ mode: 'closed' });
  };

  const getDomainColor = (domainId: number): string => {
    const domain = domains?.find((d) => d.domainNumber === domainId);
    return domain?.color || '#00D4FF';
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Helmet>
        <title>My Notes | AWS AI Practitioner</title>
      </Helmet>

      <div className="py-10 px-4 max-w-6xl mx-auto">
        {/* Editor Modal */}
        {editorState.mode !== 'closed' && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <NoteEditor
                note={editorState.mode === 'edit' ? editorState.note : undefined}
                domainId={
                  editorState.mode === 'edit'
                    ? editorState.note.domainId
                    : editorState.domainId
                }
                topicIndex={
                  editorState.mode === 'edit'
                    ? editorState.note.topicIndex
                    : editorState.topicIndex
                }
                topicName={editorState.topicName}
                onSave={handleEditorClose}
                onCancel={handleEditorClose}
              />
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <Text variant="h1">My Notes</Text>
            <Text variant="body" className="text-cyber-muted">
              {summary?.totalNotes || 0} notes, {summary?.totalWords || 0} words
            </Text>
          </div>
          <button
            type="button"
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-accent-cyan text-cyber-bg rounded-lg hover:bg-accent-cyan/90 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            New Note
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cyber-muted" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <Badge
              variant={!selectedDomain ? 'cyan' : 'default'}
              className="cursor-pointer"
              onClick={() => setSelectedDomain(undefined)}
            >
              All
            </Badge>
            {domains?.map((domain) => (
              <Badge
                key={domain.id}
                className="cursor-pointer"
                onClick={() => setSelectedDomain(domain.domainNumber)}
                style={
                  selectedDomain === domain.domainNumber
                    ? { backgroundColor: `${domain.color}22`, color: domain.color }
                    : undefined
                }
              >
                D{domain.domainNumber}
              </Badge>
            ))}
          </div>
        </div>

        {/* Notes List */}
        {filteredNotes && filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                domainColor={getDomainColor(note.domainId)}
                onEdit={() => handleEdit(note)}
                onDelete={() => handleDelete(note.id)}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <FileText className="w-12 h-12 text-cyber-muted mx-auto mb-4" />
            <Text variant="h3" className="mb-2">
              No notes yet
            </Text>
            <Text variant="body" className="text-cyber-muted">
              {searchQuery
                ? 'No notes match your search.'
                : 'Create notes while studying topics to review later.'}
            </Text>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
