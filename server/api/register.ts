import fs from 'node:fs';
import { createResolver } from '@nuxt/kit';
import { server } from '@passwordless-id/webauthn';

export default defineEventHandler(async (event) => {
  const resolver = createResolver(import.meta.url);
  const body = await readBody(event);

  // 1. Valid time for challenge token

  const expected = {
    challenge: body.challenge,
    origin:
      'http://localhost:3000',
  };

  // 2. verify

  const registrationParsed = await server.verifyRegistration(body, expected);

  // *** 3. Save credential for db ***

  const db = JSON.parse(
    fs.readFileSync(resolver.resolve('../../db/static.json'), 'utf8')
  );

  db[body.credential.id] = {credential: registrationParsed.credential, email: body.email};

  fs.writeFile(
    resolver.resolve('../../db/static.json'),
    JSON.stringify(db),
    'utf8',
    () => {}
  );
  // ***

  return registrationParsed;
});
