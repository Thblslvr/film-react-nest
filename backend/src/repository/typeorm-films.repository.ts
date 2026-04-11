import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from '../entities/film.entity';
import { Schedule } from '../entities/schedule.entity';
import { FilmsRepository } from './films.repository';
import { FilmDto } from '../films/dto/film.dto';
import { ScheduleDto } from '../films/dto/schedule.dto';

@Injectable()
export class TypeormFilmsRepository implements FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepo: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly scheduleRepo: Repository<Schedule>,
  ) {}

  private static normalizeAssetPath(p: string): string {
    if (!p) return p;
    if (p.startsWith('/content/afisha/')) return p;
    if (p.startsWith('/')) return `/content/afisha${p}`;
    return p;
  }

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmRepo.find();
    return films.map((film) => ({
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: TypeormFilmsRepository.normalizeAssetPath(film.image),
      cover: TypeormFilmsRepository.normalizeAssetPath(film.cover),
    }));
  }

  async findScheduleByFilmId(filmId: string): Promise<ScheduleDto[]> {
    const film = await this.filmRepo.findOne({
      where: { id: filmId },
      relations: ['schedule'],
    });
    if (!film) {
      throw new NotFoundException({ error: 'Film not found' });
    }
    return film.schedule.map((s) => ({
      id: s.id,
      daytime: s.daytime.toISOString(),
      hall: s.hall,
      rows: s.rows,
      seats: s.seats,
      price: s.price,
      taken: s.taken,
    }));
  }

  async takeSeat(params: {
    filmId: string;
    sessionId: string;
    seatKey: string;
  }): Promise<void> {
    const film = await this.filmRepo.findOne({
      where: { id: params.filmId },
      relations: ['schedule'],
    });
    if (!film) {
      throw new NotFoundException({ error: 'Film not found' });
    }
    const session = film.schedule.find((s) => s.id === params.sessionId);
    if (!session) {
      throw new NotFoundException({ error: 'Session not found' });
    }
    session.taken = session.taken || [];
    if (session.taken.includes(params.seatKey)) {
      throw new BadRequestException({ error: 'Seat already taken' });
    }
    session.taken.push(params.seatKey);
    await this.scheduleRepo.save(session);
  }
}
