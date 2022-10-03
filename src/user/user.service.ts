import { Injectable } from '@nestjs/common';
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import * as AWS from 'aws-sdk';

@Injectable()
export class UserService {
  getHello(): string {
    return 'Organization service is working!';
  }
}

