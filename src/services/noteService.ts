import axios from "axios";
import type { Note } from "../types/note";

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
  total: number;
  page: number;
  totalPages: number;
  perPage?: number;
}

export const fetchNotes = async ({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await instance.get("/notes", {
    params: { page, perPage, search },
  });
  return response.data;
};

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: string;
}

export const createNote = async (newNote: CreateNotePayload): Promise<Note> => {
  const response = await instance.post<Note>("/notes", newNote);
  return response.data;
};

export const deleteNote = async (id: string): Promise<{ id: string }> => {
  const response = await instance.delete<{ id: string }>(`/notes/${id}`);
  return response.data;
};
