
let DOMAIN = 'shatteredrealmsonline.com'
let BASE_URL = `https://${DOMAIN}`;

const CHAT_BASE_URL = `${BASE_URL}:8180`;
const CHAT_VERSION = 'v1';
const CHAT_URL = `${CHAT_BASE_URL}/${CHAT_VERSION}`;
const CHAT_GRPC_URL = `${CHAT_BASE_URL}`;

const CHARACTER_BASE_URL = `${BASE_URL}:8081`;
const CHARACTER_VERSION = 'v1';
const CHARACTER_URL = `${CHARACTER_BASE_URL}/${CHARACTER_VERSION}`;
const CHARACTER_GRPC_URL = `${CHARACTER_BASE_URL}`;

const GSS_BASE_URL = `${BASE_URL}:8082`;
const GSS_VERSION = 'v1';
const GSS_URL = `${GSS_BASE_URL}/${GSS_VERSION}`;
const GSS_GRPC_URL = `${GSS_BASE_URL}`;

const KEYCLOAK_URL = `https://sso.${DOMAIN}`;
const KEYCLOAK_REALM = 'default';
const KEYCLOAK_CLIENT_ID = 'sro-web';

export const environment = {
  KEYCLOAK_URL,
  KEYCLOAK_REALM,
  KEYCLOAK_CLIENT_ID,
  CHAT_URL,
  CHAT_GRPC_URL,
  CHARACTER_URL,
  CHARACTER_GRPC_URL,
  GSS_URL,
  GSS_GRPC_URL,
}
