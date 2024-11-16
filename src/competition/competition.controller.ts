import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { CompetitionService } from './competition.service';
import { Competition } from './competition.entity';

@Controller('competition')
export class CompetitionController {
  constructor(private readonly competitionService: CompetitionService) {}

  /**
   * Retrieve all competitions.
   * GET /competition
   */
  @Get()
  async findAll(): Promise<Competition[]> {
    return this.competitionService.findAll();
  }

  /**
   * Retrieve a single competition by ID.
   * GET /competition/:id
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Competition> {
    const competition = await this.competitionService.findOne(id);
    if (!competition) {
      throw new NotFoundException(`Competition with ID ${id} not found`);
    }
    return competition;
  }

  /**
   * Create a new competition.
   * POST /competition
   */
  @Post()
  async create(
    @Body() competitionData: Partial<Competition>,
  ): Promise<Competition> {
    return this.competitionService.create(competitionData);
  }

  /**
   * Update an existing competition by ID.
   * PUT /competition/:id
   */
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() competitionData: Partial<Competition>,
  ): Promise<Competition> {
    try {
      return await this.competitionService.update(id, competitionData);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Delete a competition by ID.
   * DELETE /competition/:id
   */
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.competitionService.remove(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
