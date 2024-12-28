import { MethodInfo, NextUnaryFn, RpcInterceptor, RpcOptions, UnaryCall } from "@protobuf-ts/runtime-rpc";
import { KeycloakService } from "../../auth/keycloak.service";
import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";

function injectionAuth(keycloak: KeycloakService, options: RpcOptions) {
  if (!options.meta)
    options.meta = {};

  if (keycloak.instance.authenticated)
    options.meta['authorization'] = `Bearer ${keycloak.instance.token}`;
}

const createGrpcWebTransport = (baseUrl: string, keycloak: KeycloakService, interceptors: RpcInterceptor[] = []) => {
  return new GrpcWebFetchTransport({
    interceptors: [{
      // interceptUnary: keycloakAuthInterceptor(keycloak),
      interceptUnary(next, method, input, options) {
        injectionAuth(keycloak, options);
        return next(method, input, options);
      },
      interceptServerStreaming(next, method, input, options) {
        injectionAuth(keycloak, options);
        return next(method, input, options);
      },
    },
    ...interceptors
    ],
    baseUrl,
  })
};

export { createGrpcWebTransport };
