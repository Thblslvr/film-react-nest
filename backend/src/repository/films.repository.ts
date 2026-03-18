import { FilmDto } from '../films/dto/film.dto';
import { ScheduleDto } from '../films/dto/schedule.dto';

export interface FilmsRepository {
  findAll(): Promise<FilmDto[]>;
  findScheduleByFilmId(filmId: string): Promise<ScheduleDto[]>;
  takeSeat(params: {
    filmId: string;
    sessionId: string;
    seatKey: string; // `${row}:${seat}`
  }): Promise<void>;
}

export const FILMS_REPOSITORY = Symbol('FILMS_REPOSITORY');
