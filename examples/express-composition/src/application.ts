import * as express from 'express';

export class ExpressApplication {
  app: express.Application;
  constructor() {
    this.app = express();
  }
}
