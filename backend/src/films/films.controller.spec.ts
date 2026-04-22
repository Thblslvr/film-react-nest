import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmDto } from './dto/film.dto';
import { ScheduleDto } from './dto/schedule.dto';
import { NotFoundException } from '@nestjs/common';

describe('FilmsController', () => {
  let controller: FilmsController;
  let filmsService: FilmsService;

  const mockFilmsService = {
    getFilms: jest.fn(),
    getFilmSchedule: jest.fn(),
  };

  const mockFilm: FilmDto = {
    id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    rating: 2.9,
    director: 'Итан Райт',
    tags: ['Документальный'],
    title: 'Архитекторы общества',
    about: 'Документальный фильм...',
    description: 'Документальный фильм Итана Райта...',
    image: '/images/bg1s.jpg',
    cover: '/images/bg1c.jpg',
  };

  const mockSchedule: ScheduleDto = {
    id: '95ab4a20-9555-4a06-bfac-184b8c53fe70',
    daytime: '2023-05-29T10:30:00.001Z',
    hall: 2,
    rows: 5,
    seats: 10,
    price: 350,
    taken: ['1:2'],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    filmsService = module.get<FilmsService>(FilmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getFilms', () => {
    it('should return list of films with total count', async () => {
      const films = [mockFilm];
      mockFilmsService.getFilms.mockResolvedValue(films);

      const result = await controller.getFilms();
      expect(result).toEqual({ total: films.length, items: films });
      expect(filmsService.getFilms).toHaveBeenCalledTimes(1);
    });

    it('should return empty array if no films exist', async () => {
      mockFilmsService.getFilms.mockResolvedValue([]);

      const result = await controller.getFilms();
      expect(result).toEqual({ total: 0, items: [] });
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Database error');
      mockFilmsService.getFilms.mockRejectedValue(error);

      await expect(controller.getFilms()).rejects.toThrow(error);
    });
  });

  describe('getFilmSchedule', () => {
    const filmId = 'd290f1ee-6c54-4b01-90e6-d701748f0851';

    it('should return schedule list for a valid film id', async () => {
      const schedules = [mockSchedule];
      mockFilmsService.getFilmSchedule.mockResolvedValue(schedules);

      const result = await controller.getFilmSchedule(filmId);
      expect(result).toEqual({ total: schedules.length, items: schedules });
      expect(filmsService.getFilmSchedule).toHaveBeenCalledWith(filmId);
    });

    it('should throw NotFoundException if film not found', async () => {
      mockFilmsService.getFilmSchedule.mockRejectedValue(
        new NotFoundException({ error: 'Film not found' }),
      );

      await expect(controller.getFilmSchedule('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(filmsService.getFilmSchedule).toHaveBeenCalledWith('invalid-id');
    });

    it('should return empty schedule list if film has no sessions', async () => {
      mockFilmsService.getFilmSchedule.mockResolvedValue([]);

      const result = await controller.getFilmSchedule(filmId);
      expect(result).toEqual({ total: 0, items: [] });
    });
  });

  // Дополнительная проверка обработки endpoint с опечаткой "shedule"
  describe('getFilmShedule (typo alias)', () => {
    it('should call the same service method as getFilmSchedule', async () => {
      const filmId = 'test-id';
      const schedules = [mockSchedule];
      mockFilmsService.getFilmSchedule.mockResolvedValue(schedules);

      const result = await controller.getFilmShedule(filmId);
      expect(result).toEqual({ total: schedules.length, items: schedules });
      expect(filmsService.getFilmSchedule).toHaveBeenCalledWith(filmId);
    });
  });
});