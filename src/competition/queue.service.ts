import { Injectable } from '@nestjs/common';
import { CompetitionService } from './competition.service';

@Injectable()
export class QueueService {
  private queue: number[] = [];

  constructor(private readonly competitionService: CompetitionService) {
    this.initializeTestUsers();
  }

  private initializeTestUsers(): void {
    const testUserIds = [9, 10, 11]; // 테스트용 사용자 ID
    testUserIds.forEach((id) => this.addToQueue(id));
  }

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
