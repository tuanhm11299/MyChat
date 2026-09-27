import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import { CheckHealthQuery, HealthStatus } from './check-health.query';

/** The smallest possible slice: no domain, just a query that pings the database. */
@QueryHandler(CheckHealthQuery)
export class CheckHealthHandler implements IQueryHandler<CheckHealthQuery, HealthStatus> {
  constructor(private readonly dataSource: DataSource) {}

  async execute(): Promise<HealthStatus> {
    // Throws (and the request fails with 500) if the database is unreachable.
    await this.dataSource.query('SELECT 1');
    return { status: 'ok', database: 'up' };
  }
}
