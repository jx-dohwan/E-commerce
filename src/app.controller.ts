import { Controller, ForbiddenException, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('boom') 
  boom() {
    throw new Error('폭발!');
  }
  
  @Get('forbidden') 
  forbidden() {
    throw new ForbiddenException('접근 불가!');
  }

}
