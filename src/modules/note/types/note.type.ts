import { CreateNoteDto } from '../dtos';

export type NoteType = {
  [key in keyof CreateNoteDto]: string;
} & {
  id: string;
};
