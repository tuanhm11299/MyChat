import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CheckHealthController } from './features/check-health/check-health.controller';
import { CheckHealthHandler } from './features/check-health/check-health.handler';

@Module({
  imports: [CqrsModule],
  controllers: [CheckHealthController],
  providers: [CheckHealthHandler],
})
export class HealthModule {}
