import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

describe('AppController', () => {
  let appController: UserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, UserRepository],
    }).compile();

    appController = app.get<UserController>(UserController);
  });

  describe('root', () => {
    it('should return "Organization service is working!"', () => {
      expect(appController.getHello()).toBe('Organization service is working!');
    });
  });
});
