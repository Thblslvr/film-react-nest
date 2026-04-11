import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { Film } from '../entities/film.entity';
import { Schedule } from '../entities/schedule.entity';
import { FILMS_REPOSITORY } from '../repository/films.repository';
import { TypeormFilmsRepository } from '../repository/typeorm-films.repository';

@Module({})
export class FilmsModule {
  static forRoot(): DynamicModule {
    const driver = process.env.DATABASE_DRIVER?.toLowerCase();
    const isPostgres = driver === 'postgres';

    return {
      module: FilmsModule,
      imports: isPostgres ? [TypeOrmModule.forFeature([Film, Schedule])] : [],
      controllers: [FilmsController],
      providers: [
        FilmsService,
        ...(isPostgres ? [TypeormFilmsRepository] : []),
        {
          provide: FILMS_REPOSITORY,
          useExisting: isPostgres ? TypeormFilmsRepository : undefined,
        },
      ],
      exports: [FILMS_REPOSITORY],
    };
  }
}
