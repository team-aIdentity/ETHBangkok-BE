import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Competition } from './competition.entity';

@Injectable()
export class CompetitionService {
  constructor(
    @InjectRepository(Competition)
    private competitionsRepository: Repository<Competition>,
  ) {}

  findAll(): Promise<Competition[]> {
    return this.competitionsRepository.find();
  }

  findOne(id: number): Promise<Competition> {
    return this.competitionsRepository.findOneBy({ id });
  }

  async create(competition: Partial<Competition>): Promise<Competition> {
    const newCompetition = this.competitionsRepository.create(competition);
    return this.competitionsRepository.save(newCompetition);
  }

  async update(
    id: number,
    competition: Partial<Competition>,
  ): Promise<Competition> {
    const existingCompetition = await this.competitionsRepository.preload({
      id: id,
      ...competition,
    });

    if (!existingCompetition) {
      throw new Error(`Compeition with ID ${id} not found`);
    }

    return this.competitionsRepository.save(existingCompetition);
  }

  async remove(id: number): Promise<void> {
    const result = await this.competitionsRepository.delete(id);
    if (result.affected == 0) {
      throw new Error(`Compeptition with ID ${id} not found`);
    }
  }
}
