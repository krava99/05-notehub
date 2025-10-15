import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  fetchNotes,
  createNote,
  deleteNote,
  type FetchNotesResponse,
} from "../../services/noteService";
import { NoteList } from "../NoteList/NoteList";
import { Pagination } from "../Pagination/Pagination";
import { Modal } from "../Modal/Modal";
import { NoteForm } from "../NoteForm/NoteForm";
import { SearchBox } from "../SearchBox/SearchBox";
import { useDebounce } from "use-debounce";
import css from "./App.module.css";

export const App = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 300);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedSearch }),
    placeholderData: {
      notes: [],
      total: 0,
      page: 1,
      totalPages: 1,
      perPage: 12,
    },
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCreateNote = (values: {
    title: string;
    content: string;
    tag: string;
  }) => {
    createMutation.mutate(values);
  };

  if (isLoading) return <p>Loading notes...</p>;
  if (isError) return <p>Error loading notes</p>;

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />

        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}

        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {notes.length ? (
        <NoteList notes={notes} onDelete={(id) => deleteMutation.mutate(id)} />
      ) : (
        <p>No notes found</p>
      )}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} onSubmit={handleCreateNote} />
        </Modal>
      )}
    </div>
  );
};

export default App;
