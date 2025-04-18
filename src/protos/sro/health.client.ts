// @generated by protobuf-ts 2.9.4 with parameter long_type_number
// @generated from protobuf file "sro/health.proto" (package "sro", syntax proto3)
// tslint:disable
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { HealthService } from "./health";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { HealthMessage } from "./health";
import type { Empty } from "../google/protobuf/empty";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service sro.HealthService
 */
export interface IHealthServiceClient {
    /**
     * @generated from protobuf rpc: Health(google.protobuf.Empty) returns (sro.HealthMessage);
     */
    health(input: Empty, options?: RpcOptions): UnaryCall<Empty, HealthMessage>;
}
/**
 * @generated from protobuf service sro.HealthService
 */
export class HealthServiceClient implements IHealthServiceClient, ServiceInfo {
    typeName = HealthService.typeName;
    methods = HealthService.methods;
    options = HealthService.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: Health(google.protobuf.Empty) returns (sro.HealthMessage);
     */
    health(input: Empty, options?: RpcOptions): UnaryCall<Empty, HealthMessage> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<Empty, HealthMessage>("unary", this._transport, method, opt, input);
    }
}
