import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { Film, FilmSchema } from './schemas/film.schema';
import { FILMS_REPOSITORY } from '../repository/films.repository';
import { MongoFilmsRepository } from '../repository/mongo-films.repository';
import { FilmsSeedService } from './films.seed';
import { MemoryFilmsRepository } from '../repository/memory-films.repository';

@Module({})
export class FilmsModule {
  static forRoot(): DynamicModule {
    const driver = (process.env.DATABASE_DRIVER ?? 'memory').toLowerCase();

    const isMongo = driver === 'mongodb';

    return {
      module: FilmsModule,
      imports: isMongo
        ? [MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }])]
        : [],
      controllers: [FilmsController],
      providers: [
        FilmsService,
        ...(isMongo ? [FilmsSeedService, MongoFilmsRepository] : []),
        ...(!isMongo ? [MemoryFilmsRepository] : []),
        {
          provide: FILMS_REPOSITORY,
          useExisting: isMongo ? MongoFilmsRepository : MemoryFilmsRepository,
        },
      ],
      exports: [FILMS_REPOSITORY],
    };
  }
}
