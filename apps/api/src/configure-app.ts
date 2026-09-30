import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DomainErrorFilter } from './shared/infrastructure/domain-error.filter';

/**
 * Global HTTP setup, shared by main.ts and the e2e tests so that tests run
 * against exactly the same pipeline as production.
 */
export function configureApp(app: INestApplication, options: { webOrigin: string }): void {
  app.enableCors({ origin: options.webOrigin });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip properties that have no decorator in the DTO
      forbidNonWhitelisted: true, // ...and reject the request if any were sent
    }),
  );
  app.useGlobalFilters(new DomainErrorFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('MyChat API')
    .setDescription(
      'REST API of MyChat. WebSocket events are documented in docs/architecture/realtime.md.',
    )
    .setVersion('0.1')
    .build();
  SwaggerModule.setup('docs', app, () => SwaggerModule.createDocument(app, swaggerConfig));
}
