import { db } from '../config/firebase.config';
import { docToObject, serverTimestamp } from '../utils/firestore.utils';
import { NotFoundError, ForbiddenError } from '../types/errors';
import { Note, CreateNoteInput, UpdateNoteInput, NotesSummary } from '../types';

const COLLECTION = 'notes';

/**
 * Count words in a string
 */
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Notes service - handles note CRUD operations
 */
export const notesService = {
  /**
   * Get all notes for a user (optionally filtered by domain)
   */
  async getUserNotes(userId: string, domainId?: number): Promise<Note[]> {
    let query: FirebaseFirestore.Query = db
      .collection(COLLECTION)
      .where('userId', '==', userId)
      .orderBy('updatedAt', 'desc');

    if (domainId) {
      query = query.where('domainId', '==', domainId);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => docToObject<Note>(doc));
  },

  /**
   * Get note by ID
   */
  async getNoteById(userId: string, noteId: string): Promise<Note> {
    const doc = await db.collection(COLLECTION).doc(noteId).get();

    if (!doc.exists) {
      throw new NotFoundError('Note');
    }

    const note = docToObject<Note>(doc);

    if (note.userId !== userId) {
      throw new ForbiddenError('Not authorized to access this note');
    }

    return note;
  },

  /**
   * Get notes for a specific topic
   */
  async getTopicNotes(
    userId: string,
    domainId: number,
    topicIndex: number
  ): Promise<Note[]> {
    const snapshot = await db
      .collection(COLLECTION)
      .where('userId', '==', userId)
      .where('domainId', '==', domainId)
      .where('topicIndex', '==', topicIndex)
      .orderBy('updatedAt', 'desc')
      .get();

    return snapshot.docs.map((doc) => docToObject<Note>(doc));
  },

  /**
   * Create a new note
   */
  async createNote(userId: string, input: CreateNoteInput): Promise<Note> {
    const noteRef = db.collection(COLLECTION).doc();

    const noteData = {
      userId,
      domainId: input.domainId,
      topicIndex: input.topicIndex,
      title: input.title,
      content: input.content,
      tags: input.tags || [],
      wordCount: countWords(input.content),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await noteRef.set(noteData);

    const doc = await noteRef.get();
    return docToObject<Note>(doc);
  },

  /**
   * Update a note
   */
  async updateNote(
    userId: string,
    noteId: string,
    input: UpdateNoteInput
  ): Promise<Note> {
    const noteRef = db.collection(COLLECTION).doc(noteId);
    const doc = await noteRef.get();

    if (!doc.exists) {
      throw new NotFoundError('Note');
    }

    const note = docToObject<Note>(doc);

    if (note.userId !== userId) {
      throw new ForbiddenError('Not authorized to update this note');
    }

    const updateData: Record<string, unknown> = {
      updatedAt: serverTimestamp(),
    };

    if (input.title !== undefined) {
      updateData.title = input.title;
    }

    if (input.content !== undefined) {
      updateData.content = input.content;
      updateData.wordCount = countWords(input.content);
    }

    if (input.tags !== undefined) {
      updateData.tags = input.tags;
    }

    await noteRef.update(updateData);

    const updatedDoc = await noteRef.get();
    return docToObject<Note>(updatedDoc);
  },

  /**
   * Delete a note
   */
  async deleteNote(userId: string, noteId: string): Promise<void> {
    const noteRef = db.collection(COLLECTION).doc(noteId);
    const doc = await noteRef.get();

    if (!doc.exists) {
      throw new NotFoundError('Note');
    }

    const note = docToObject<Note>(doc);

    if (note.userId !== userId) {
      throw new ForbiddenError('Not authorized to delete this note');
    }

    await noteRef.delete();
  },

  /**
   * Get notes summary for user
   */
  async getNotesSummary(userId: string): Promise<NotesSummary> {
    const snapshot = await db
      .collection(COLLECTION)
      .where('userId', '==', userId)
      .get();

    const notes = snapshot.docs.map((doc) => docToObject<Note>(doc));

    const notesByDomain: Record<number, number> = {};
    let totalWords = 0;

    notes.forEach((note) => {
      notesByDomain[note.domainId] = (notesByDomain[note.domainId] || 0) + 1;
      totalWords += note.wordCount;
    });

    // Get recent notes sorted by updatedAt
    const recentNotes = [...notes]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 5);

    return {
      totalNotes: notes.length,
      totalWords,
      notesByDomain,
      recentNotes,
    };
  },

  /**
   * Search notes by query string
   * Note: Firestore doesn't support full-text search natively.
   * For production, consider Algolia or Elasticsearch.
   */
  async searchNotes(userId: string, query: string): Promise<Note[]> {
    const snapshot = await db
      .collection(COLLECTION)
      .where('userId', '==', userId)
      .get();

    const notes = snapshot.docs.map((doc) => docToObject<Note>(doc));
    const queryLower = query.toLowerCase();

    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(queryLower) ||
        note.content.toLowerCase().includes(queryLower) ||
        note.tags.some((tag) => tag.toLowerCase().includes(queryLower))
    );
  },
};
