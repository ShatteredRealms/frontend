import { MethodInfo, NextUnaryFn, RpcInterceptor, RpcOptions, UnaryCall } from "@protobuf-ts/runtime-rpc";
import { KeycloakService } from "../../auth/keycloak.service";
import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";

const keycloakAuthInterceptor = (keycloak: KeycloakService) => (next: NextUnaryFn, method: MethodInfo, input: object, options: RpcOptions): UnaryCall => {
  if (!options.meta)
    options.meta = {};

  if (keycloak.instance.authenticated)
    options.meta['Authorization'] = `Bearer ${keycloak.instance.token}`;

  return next(method, input, options);
};

const createGrpcWebTransport = (baseUrl: string, keycloak: KeycloakService, interceptors: RpcInterceptor[] = []) => {
  return new GrpcWebFetchTransport({
    interceptors: [{
      interceptUnary: keycloakAuthInterceptor(keycloak)
    },
    ...interceptors
    ],
    baseUrl,
  })
};

export { createGrpcWebTransport };
