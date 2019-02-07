import {ExpressApplication} from './application';
import {NoteApplication} from './note-application';
import {ApplicationConfig} from '@loopback/core';
import {Request, Response} from 'express';
import * as path from 'path';
import * as pEvent from 'p-event';

export {ExpressApplication};

export async function main(options: ApplicationConfig = {}) {
  const express = new ExpressApplication();
  const lbApp = new NoteApplication(options);

  let app = express.app;

  await lbApp.boot();
  lbApp.basePath('/api');

  // Expose the front-end assets via Express, not as LB4 route
  app.use(lbApp.requestHandler);

  // Custom Express routes
  app.get('/', function(_req: Request, res: Response) {
    res.sendFile(path.resolve('public/index.html'));
  });
  app.get('/hello', function(_req: Request, res: Response) {
    res.send('Hello world!');
  });
  app.get('/notes', function(_req: Request, res: Response) {
    res.sendFile(path.resolve('public/notes.html'));
  });

  // Start the Express application
  const server = app.listen(3000);
  await pEvent(server, 'listening');
  console.log('Server is running at http://127.0.0.1:3000');

  return app;
}
