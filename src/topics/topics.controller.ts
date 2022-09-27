import { Controller, Get, Query } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { FilterTopicDto } from './dtos/filter-topic.dto';

@Controller('topics')
export class TopicsController {
  constructor(private topicsService: TopicsService) {}

  @Get('/trending-topic')
  async getTopTrendTopic(@Query() query: FilterTopicDto) {
    const topics = await this.topicsService.find(query);
    return topics;
  }
}
