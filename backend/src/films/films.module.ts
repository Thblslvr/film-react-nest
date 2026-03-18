import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { Film, FilmSchema } from './schemas/film.schema';
import { FILMS_REPOSITORY } from '../repository/films.repository';
import { MongoFilmsRepository } from '../repository/mongo-films.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  controllers: [FilmsController],
  providers: [
    FilmsService,
    MongoFilmsRepository,
    {
      provide: FILMS_REPOSITORY,
      useExisting: MongoFilmsRepository,
    },
  ],
  exports: [FILMS_REPOSITORY],
})
export class FilmsModule {}
