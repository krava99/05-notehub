import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export interface FetchNotesParams {
  page: number;
  search?: string;
  perPage: number;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export const fetchNotes = async ({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const { data } = await instance.get<FetchNotesResponse>("/notes", {
    params: { page, perPage, search },
  });
  return data;
};

export const createNote = async (newNote: CreateNotePayload): Promise<Note> => {
  const { data } = await instance.post<Note>("/notes", newNote);
  return data;
};

export const deleteNote = async (id: string): Promise<{ id: string }> => {
  const { data } = await instance.delete<{ id: string }>(`/notes/${id}`);
  return data;
};
