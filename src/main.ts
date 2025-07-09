import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Booking Schedule API')
    .setDescription(
      'API para gestión de reservas con arquitectura hexagonal usando NestJS y Prisma',
    )
    .setVersion('1.0')
    .addTag('bookings', 'Operaciones relacionadas con reservas')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(`🚀 Servidor iniciado en http://localhost:${port}`);
  console.log(
    `📚 Documentación Swagger disponible en http://localhost:${port}/api`,
  );
  console.log(
    `🔐 OAuth Google Calendar en http://localhost:${port}/auth/google`,
  );
}
void bootstrap();
