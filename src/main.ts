import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TimingInterceptor } from './common/interceptors/timing.interceptor';
import * as fs from 'fs';
import * as hbs from 'hbs';
import { section } from './common/helpers/hbs.helpers';
import * as methodOverride from 'method-override';
import * as express from 'express';
import * as session from 'express-session';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Internships aggregator API')
    .setDescription('The internships aggregator API description')
    .setVersion('1.0')
    .addTag('internships')
    .addTag('requests')
    .addTag('users')
    .addTag('categories')
    .addTag('tags')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalInterceptors(new TimingInterceptor());

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');


  hbs.registerHelper('section', section);

  const partialsPath = join(__dirname, '..', 'views', 'partials');
  console.log('Registering partials from:', partialsPath);

  if (fs.existsSync(partialsPath)) {
    const files = fs.readdirSync(partialsPath);
    console.log('Found partials files:', files);

    files.forEach((file) => {
      if (file.endsWith('.hbs')) {
        const partialName = file.replace('.hbs', '');
        const partialPath = join(partialsPath, file);
        const partialContent = fs.readFileSync(partialPath, 'utf8');
        hbs.registerPartial(partialName, partialContent);
        console.log(`Registered partial: ${partialName}`);
      }
    });
  } else {
    console.error('Partials directory not found:', partialsPath);
  }

  app.use(express.urlencoded({ extended: true }));
  app.use(
    methodOverride((req, res) => {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        const m = req.body._method;
        delete req.body._method;
        return m;
      }
    }),
  );

  app.use(
    session({
      secret: 'test_secret',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 60000 * 60 },
    }),
  );

  app.set('view options', {
    layout: 'layouts/main',
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
