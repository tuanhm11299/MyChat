import { Query } from '@nestjs/cqrs';

export interface HealthStatus {
  status: 'ok';
  database: 'up';
}

export class CheckHealthQuery extends Query<HealthStatus> {}
