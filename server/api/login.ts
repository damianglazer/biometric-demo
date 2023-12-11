import { server } from '@passwordless-id/webauthn';
import { createClient } from '@supabase/supabase-js'


export default defineEventHandler(async (event) => {

  const body = await readBody(event);

  const expected = {
    challenge: body.challenge,
    origin:
      process.env.CREDENTIAL_URL ?? '',
    userVerified: true,
  };

  const supabase = createClient(
    process.env.SUPABASE_URL ?? '',
    process.env.SUPABASE_ANON_KEY ?? ''
  )

const { data, error } = await supabase
  .from('users')
  .select()
  .eq('credential_id', body.credentialId)
  .limit(1)
  .single()

  const {email, ...credential} = JSON.parse(data.credential)

  const authenticationParsed = await server.verifyAuthentication(
    body,
    credential,
    expected
  );

  return {...authenticationParsed, email };
});
