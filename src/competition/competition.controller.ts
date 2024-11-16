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
  Patch,
} from '@nestjs/common';
import { CompetitionService } from './competition.service';
import { Competition } from './competition.entity';
import { QueueService } from './queue.service';

@Controller('competition')
export class CompetitionController {
  constructor(
    private readonly competitionService: CompetitionService,
    private readonly queueService: QueueService,
  ) {}

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

  /**
   * Add a user to the competition queue.
   * POST /competition/join-queue
   */
  @Post('join-queue')
  async joinQueue(
    @Body('userId') userId: number,
  ): Promise<{ message: string }> {
    this.queueService.addToQueue(userId);
    return { message: 'User added to the queue' };
  }

  /**
   * End a competition by ID.
   * PATCH /competition/:id/end
   */
  @Patch(':id/end')
  async endCompetition(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Competition> {
    return this.competitionService.endCompetition(id);
  }
}
