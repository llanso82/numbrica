
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Configurar CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Numbrica API')
    .setDescription('API de Astrología y Numerología - Plataforma Numbrica')
    .setVersion('1.0')
    .addTag('Cálculos', 'Endpoints para generar cartas natales y numerología')
    .addTag('Informes', 'Endpoints para consultar informes generados')
    .addTag('Utilidades', 'Endpoints auxiliares y de salud')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: 'Numbrica API',
    customfavIcon: 'https://img.icons8.com/color/48/000000/tarot-cards.png',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info .title { color: #1a2332; font-size: 2.5em; }
      .swagger-ui .info .description { color: #444; font-size: 1.1em; line-height: 1.6; }
      .swagger-ui .info { background: linear-gradient(135deg, #1a2332 0%, #2a3f5f 100%); 
                         color: #d4af37; padding: 2em; border-radius: 8px; margin-bottom: 2em; }
      .swagger-ui .scheme-container { background: #f8f9fa; padding: 1em; border-radius: 4px; }
      .swagger-ui .opblock-tag { color: #1a2332; font-size: 1.5em; border-bottom: 2px solid #d4af37; }
      .swagger-ui .opblock { border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 1em; }
      .swagger-ui .opblock.opblock-post { border-color: #d4af37; }
      .swagger-ui .opblock.opblock-get { border-color: #1a2332; }
      .swagger-ui .btn.execute { background-color: #d4af37; color: #1a2332; font-weight: bold; }
      .swagger-ui .btn.execute:hover { background-color: #b8962e; }
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    `,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  logger.log(`🌟 Numbrica API corriendo en puerto ${port}`);
  logger.log(`📚 Documentación Swagger: http://localhost:${port}/api-docs`);
  logger.log(`🔮 Astrología y Numerología lista para servir`);
}

bootstrap();
