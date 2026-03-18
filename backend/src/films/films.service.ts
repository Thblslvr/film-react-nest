import { Inject, Injectable } from '@nestjs/common';
import { FilmDto } from './dto/film.dto';
import { ScheduleDto } from './dto/schedule.dto';
import {
  FILMS_REPOSITORY,
  FilmsRepository,
} from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FILMS_REPOSITORY) private readonly filmsRepo: FilmsRepository,
  ) {}

  async getFilms(): Promise<FilmDto[]> {
    return this.filmsRepo.findAll();
  }

  async getFilmSchedule(id: string): Promise<ScheduleDto[]> {
    return this.filmsRepo.findScheduleByFilmId(id);
  }
}
