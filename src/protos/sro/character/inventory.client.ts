// @generated by protobuf-ts 2.9.4 with parameter long_type_number
// @generated from protobuf file "sro/character/inventory.proto" (package "sro.character", syntax proto3)
// tslint:disable
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { InventoryService } from "./inventory";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { GetInventoryResponse } from "./inventory";
import type { GetInventoryRequest } from "./inventory";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service sro.character.InventoryService
 */
export interface IInventoryServiceClient {
    /**
     * @generated from protobuf rpc: GetInventory(sro.character.GetInventoryRequest) returns (sro.character.GetInventoryResponse);
     */
    getInventory(input: GetInventoryRequest, options?: RpcOptions): UnaryCall<GetInventoryRequest, GetInventoryResponse>;
}
/**
 * @generated from protobuf service sro.character.InventoryService
 */
export class InventoryServiceClient implements IInventoryServiceClient, ServiceInfo {
    typeName = InventoryService.typeName;
    methods = InventoryService.methods;
    options = InventoryService.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: GetInventory(sro.character.GetInventoryRequest) returns (sro.character.GetInventoryResponse);
     */
    getInventory(input: GetInventoryRequest, options?: RpcOptions): UnaryCall<GetInventoryRequest, GetInventoryResponse> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<GetInventoryRequest, GetInventoryResponse>("unary", this._transport, method, opt, input);
    }
}
