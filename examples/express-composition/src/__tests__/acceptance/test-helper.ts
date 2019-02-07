import {givenHttpServerConfig, Client, supertest} from '@loopback/testlab';
import {Request, Response} from 'express';
import {NoteApplication} from '../../note-application';
import {ExpressApplication} from '../../application';
import {Note} from '../../models/note.model';
import * as path from 'path';
import * as http from 'http';
import * as pEvent from 'p-event';

export async function setupExpressApplication(): Promise<AppWithClient> {
  const lbApp = new NoteApplication({
    rest: givenHttpServerConfig(),
  });
  const express = new ExpressApplication();
  let app = express.app;

  await lbApp.boot();
  lbApp.basePath('/api');

  app.use(lbApp.requestHandler);

  app.get('/', function(_req: Request, res: Response) {
    res.sendFile(path.resolve('public/index.html'));
  });

  app.get('/hello', function(_req: Request, res: Response) {
    res.send('Hello world!');
  });
  app.get('/notes', function(_req: Request, res: Response) {
    res.sendFile(path.resolve('public/notes.html'));
  });

  const client = supertest('http://127.0.0.1:3000');

  const server = app.listen(3000);
  await pEvent(server, 'listening');

  return {server, client, lbApp};
}

export interface AppWithClient {
  server: http.Server;
  client: Client;
  lbApp: NoteApplication;
}

/**
 * Generate a complete Note object for use with tests.
 * @param  A partial (or complete) Note object.
 */
export function givenNote(note?: Partial<Note>) {
  const data = Object.assign(
    {
      title: 'start essay',
      content: 'write thesis',
    },
    note,
  );
  return new Note(data);
}
