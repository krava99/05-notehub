export interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteTag {
  id: string;
  name: string;
  color: string;
}
