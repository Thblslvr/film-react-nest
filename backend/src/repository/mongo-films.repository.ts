import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from '../films/schemas/film.schema';
import { FilmsRepository } from './films.repository';
import { FilmDto } from '../films/dto/film.dto';
import { ScheduleDto } from '../films/dto/schedule.dto';

function toFilmDto(doc: Film): FilmDto {
  return {
    id: doc.id,
    rating: doc.rating,
    director: doc.director,
    tags: doc.tags,
    title: doc.title,
    about: doc.about,
    description: doc.description,
    image: doc.image,
    cover: doc.cover,
  };
}

function toScheduleDto(session: Film['schedule'][number]): ScheduleDto {
  const daytime =
    session.daytime instanceof Date
      ? session.daytime
      : new Date(session.daytime as unknown as string);

  return {
    id: session.id,
    daytime: daytime.toISOString(),
    hall: session.hall,
    rows: session.rows,
    seats: session.seats,
    price: session.price,
    taken: session.taken,
  };
}

@Injectable()
export class MongoFilmsRepository implements FilmsRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<FilmDocument>,
  ) {}

  async findAll(): Promise<FilmDto[]> {
    const docs = await this.filmModel.find().lean<Film[]>().exec();
    return docs.map((d) => toFilmDto(d));
  }

  async findScheduleByFilmId(filmId: string): Promise<ScheduleDto[]> {
    const doc = await this.filmModel
      .findOne({ id: filmId })
      .lean<Film>()
      .exec();
    if (!doc) throw new NotFoundException({ error: 'Film not found' });
    return (doc.schedule ?? []).map((s) => toScheduleDto(s));
  }

  async takeSeat(params: {
    filmId: string;
    sessionId: string;
    seatKey: string;
  }): Promise<void> {
    const film = await this.filmModel.findOne({ id: params.filmId }).exec();
    if (!film) throw new NotFoundException({ error: 'Film not found' });

    const session = film.schedule?.find((s) => s.id === params.sessionId);
    if (!session) throw new NotFoundException({ error: 'Session not found' });

    session.taken = session.taken ?? [];
    if (session.taken.includes(params.seatKey)) {
      throw new BadRequestException({ error: 'Seat already taken' });
    }
    session.taken.push(params.seatKey);

    await film.save();
  }
}
