import { Injectable } from '@nestjs/common';
import { CompetitionService } from './competition.service';

@Injectable()
export class QueueService {
  private queue: number[] = [];

  constructor(private readonly competitionService: CompetitionService) {}

  addToQueue(userId: number): void {
    if (!this.queue.includes(userId)) {
      this.queue.push(userId);
      if (this.queue.length >= 4) {
        this.createCompetition();
      }
    }
  }

  removeFromQueue(userId: number): void {
    this.queue = this.queue.filter((id) => id !== userId);
  }

  private async createCompetition(): Promise<void> {
    const userIds = this.queue.splice(0, 4);
    await this.competitionService.createCompetitionFromQueue(userIds);
  }
}
