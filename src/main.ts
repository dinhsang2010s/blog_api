import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/all-exception.filter';

declare const module: any;

async function bootstrap() {
  // Create NestJS application
  const app = await NestFactory.create(AppModule);

  // Security middleware
  setupSecurityMiddleware(app);

  // Global pipes and filters
  setupGlobalPipes(app);
  setupGlobalFilters(app);

  // API configuration
  app.setGlobalPrefix('api');

  // Swagger documentation setup
  setupSwagger(app);

  // Start the application
  const port = process.env.port || 8080;
  await app.listen(port);

  // Hot module replacement for development
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

function setupSecurityMiddleware(app: any) {
  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        'default-src': ["'self'"],
        'connect-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:'],
        'style-src-elem': ["'self'", 'data:', "'unsafe-inline'"],
        'script-src': ["'unsafe-inline'", "'self'"],
        'object-src': ["'none'"],
      },
    }),
  );
  app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
  app.enableCors();
}

function setupGlobalPipes(app: any) {
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: error.constraints[Object.keys(error.constraints)[0]],
        }));
        return new BadRequestException(result);
      },
      stopAtFirstError: true,
    }),
  );
}

function setupGlobalFilters(app: any) {
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
}

function setupSwagger(app: any) {
  const config = new DocumentBuilder()
    .setTitle('Blog-tech')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {});

  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Blog API Documentation',
    customCss: `
      .swagger-ui .topbar {
        background-color: rgb(137 191 4) !important;
      }
    `,
    swaggerOptions: {
      theme: 'dark',
      persistAuthorization: true,
    },
  });
}

bootstrap();
