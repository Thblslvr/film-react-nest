import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { ListResponseDto } from './dto/films.dto';
import { FilmDto } from './dto/film.dto';
import { ScheduleDto } from './dto/schedule.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getFilms(): Promise<ListResponseDto<FilmDto>> {
    const items = await this.filmsService.getFilms();
    return { total: items.length, items };
  }

  @Get(':id/schedule')
  async getFilmSchedule(
    @Param('id') id: string,
  ): Promise<ListResponseDto<ScheduleDto>> {
    const items = await this.filmsService.getFilmSchedule(id);
    return { total: items.length, items };
  }
}
