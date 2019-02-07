import {Client, expect} from '@loopback/testlab';
import {setupExpressApplication} from './test-helper';
import * as http from 'http';

describe('PingController', () => {
  let client: Client;
  let server: http.Server;

  before('setupApplication', async () => {
    ({server, client} = await setupExpressApplication());
  });

  after('closes application', async () => {
    server.close();
  });

  it('invokes GET /ping', async () => {
    const res = await client.get('/api/ping?msg=world').expect(200);
    expect(res.body).to.containEql({greeting: 'Hello from LoopBack'});
  });
});
