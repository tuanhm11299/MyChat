import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { CheckHealthQuery, HealthStatus } from './check-health.query';

@ApiTags('health')
@Controller('health')
export class CheckHealthController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async check(): Promise<HealthStatus> {
    return this.queryBus.execute(new CheckHealthQuery());
  }
}
