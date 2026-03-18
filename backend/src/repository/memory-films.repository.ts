import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { readFileSync } from 'node:fs';
import * as path from 'node:path';
import { FilmDto } from '../films/dto/film.dto';
import { ScheduleDto } from '../films/dto/schedule.dto';
import { FilmsRepository } from './films.repository';

type StubSession = {
  id: string;
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
};

type StubFilm = FilmDto & { schedule: StubSession[] };

function loadStubFilms(): StubFilm[] {
  // Located at `backend/test/mongodb_initial_stub.json`
  const filePath = path.join(
    process.cwd(),
    'test',
    'mongodb_initial_stub.json',
  );
  const raw = readFileSync(filePath, 'utf8');
  return JSON.parse(raw) as StubFilm[];
}

@Injectable()
export class MemoryFilmsRepository implements FilmsRepository {
  private readonly films: StubFilm[] = loadStubFilms();

  private static normalizeAssetPath(p: string): string {
    if (!p) return p;
    if (p.startsWith('/content/afisha/')) return p;
    if (p.startsWith('/')) return `/content/afisha${p}`;
    return p;
  }

  async findAll(): Promise<FilmDto[]> {
    return this.films.map((f) => ({
      id: f.id,
      rating: f.rating,
      director: f.director,
      tags: f.tags,
      title: f.title,
      about: f.about,
      description: f.description,
      image: MemoryFilmsRepository.normalizeAssetPath(f.image),
      cover: MemoryFilmsRepository.normalizeAssetPath(f.cover),
    }));
  }

  async findScheduleByFilmId(filmId: string): Promise<ScheduleDto[]> {
    const film = this.films.find((f) => f.id === filmId);
    if (!film) throw new NotFoundException({ error: 'Film not found' });
    return film.schedule.map((s) => ({
      id: s.id,
      daytime: new Date(s.daytime).toISOString(),
      hall: Number(s.hall),
      rows: s.rows,
      seats: s.seats,
      price: s.price,
      taken: s.taken ?? [],
    }));
  }

  async takeSeat(params: {
    filmId: string;
    sessionId: string;
    seatKey: string;
  }): Promise<void> {
    const film = this.films.find((f) => f.id === params.filmId);
    if (!film) throw new NotFoundException({ error: 'Film not found' });

    const session = film.schedule.find((s) => s.id === params.sessionId);
    if (!session) throw new NotFoundException({ error: 'Session not found' });

    session.taken = session.taken ?? [];
    if (session.taken.includes(params.seatKey)) {
      throw new BadRequestException({ error: 'Seat already taken' });
    }
    session.taken.push(params.seatKey);
  }
}
