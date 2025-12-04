const MAL_CLIENT_ID = import.meta.env.VITE_MAL_CLIENT_ID;

function generateCodeVerifier() {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  
  return btoa(String.fromCharCode.apply(null, randomBytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function initiateMALLogin() {
  const codeVerifier = generateCodeVerifier();
  // MAL requires PLAIN PKCE - code challenge equals code verifier (no SHA256 hashing)
  const codeChallenge = codeVerifier;
  const state = crypto.randomUUID();

  sessionStorage.setItem('mal_code_verifier', codeVerifier);
  sessionStorage.setItem('mal_state', state);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: MAL_CLIENT_ID,
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: 'plain',
  });

  window.location.href = `https://myanimelist.net/v1/oauth2/authorize?${params.toString()}`;
}