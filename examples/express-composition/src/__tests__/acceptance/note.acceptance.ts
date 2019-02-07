import {Client, expect} from '@loopback/testlab';
import {setupExpressApplication, givenNote} from './test-helper';
import * as http from 'http';
import {NoteApplication} from '../../note-application';
import {NoteRepository} from '../../repositories';

describe('NoteApplication', () => {
  let lbApp: NoteApplication;
  let client: Client;
  let server: http.Server;
  let noteRepo: NoteRepository;

  before('setupApplication', async () => {
    ({server, client, lbApp} = await setupExpressApplication());
    await givenNoteRepository();
  });

  beforeEach(async () => {
    await noteRepo.deleteAll();
  });

  after('closes application', async () => {
    server.close();
  });

  it('creates a note', async function() {
    const note = givenNote();
    const response = await client
      .post('/api/notes')
      .send(note)
      .expect(200);
    expect(response.body).to.containDeep(note);
    const result = await noteRepo.findById(response.body.id);
    expect(result).to.containDeep(note);
  });

  it('gets notes', async () => {
    const note = givenNote();
    let response = await client.get('/api/notes').expect(200);
    expect(response.body).to.be.empty();
    await client
      .post('/api/notes')
      .send(note)
      .expect(200);
    response = await client.get('/api/notes').expect(200);
    expect(response.body).to.not.be.empty();
  });

  it('does not display static front page from Note app', async () => {
    await client.get('/api/').expect(404);
  });

  async function givenNoteRepository() {
    noteRepo = await lbApp.getRepository(NoteRepository);
  }
});
