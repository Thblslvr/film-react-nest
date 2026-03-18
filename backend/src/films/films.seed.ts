import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from './schemas/film.schema';

@Injectable()
export class FilmsSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(FilmsSeedService.name);

  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<FilmDocument>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const count = await this.filmModel.countDocuments().exec();
    if (count > 0) return;

    await this.filmModel.create([
      {
        id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        rating: 2.9,
        director: 'Итан Райт',
        tags: ['Документальный'],
        title: 'Архитекторы общества',
        about:
          'Документальный фильм, исследующий влияние искусственного интеллекта на общество и этические, философские и социальные последствия технологии.',
        description:
          'Документальный фильм Итана Райта исследует влияние технологий на современное общество, уделяя особое внимание роли искусственного интеллекта в формировании нашего будущего.',
        image: '/content/afisha/',
        cover: '/content/afisha/',
        schedule: [
          {
            id: '95ab4a20-9555-4a06-bfac-184b8c53fe70',
            daytime: new Date(Date.now() + 60 * 60 * 1000),
            hall: '2',
            rows: 5,
            seats: 10,
            price: 350,
            taken: [],
          },
        ],
      },
    ]);

    this.logger.log('Seeded films collection with default data.');
  }
}

