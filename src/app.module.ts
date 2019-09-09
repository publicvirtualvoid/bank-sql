import { Module, Logger } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportService } from './services/import-service';
import { Connection } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot()
  ],
  controllers: [AppController],
  providers: [
    ImportService,
    Logger
  ]
})
export class AppModule {
  constructor(
    private readonly db: Connection,
    private readonly importService: ImportService
  ) {
    this.db.synchronize();
    this.importService.import();
  }
}