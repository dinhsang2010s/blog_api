import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, SchemaOptions } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { ArticleModule } from './modules/article/article.module';
import { CommentModule } from './modules/comment/comment.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './utils/all-exception.filter';
import config from './config';

const options: SchemaOptions = {
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
    },
  },
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        uri: config().database.url,
        dbName: config().database.name,
        connectionFactory: (connection) => {
          connection.plugin((schema) => {
            schema.options.toJSON = {
              virtuals: true,
              versionKey: false,
              transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
              },
            };
          });
          return connection;
        },
      }),
    }),
    // ThrottlerModule.forRoot([
    //   {
    //     ttl: 60000,
    //     limit: 10,
    //   },
    // ]),
    AuthModule,
    UserModule,
    CategoryModule,
    ArticleModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
