// @generated by protobuf-ts 2.9.4 with parameter long_type_number
// @generated from protobuf file "sro/gameserver/connection.proto" (package "sro.gameserver", syntax proto3)
// tslint:disable
import { TargetId } from "../globals";
import { ServiceType } from "@protobuf-ts/runtime-rpc";
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { Location } from "../globals";
/**
 * @generated from protobuf message sro.gameserver.ConnectGameServerResponse
 */
export interface ConnectGameServerResponse {
    /**
     * @generated from protobuf field: string address = 1;
     */
    address: string;
    /**
     * @generated from protobuf field: uint32 port = 2;
     */
    port: number;
    /**
     * @generated from protobuf field: string connection_id = 3;
     */
    connectionId: string;
}
/**
 * @generated from protobuf message sro.gameserver.VerifyConnectRequest
 */
export interface VerifyConnectRequest {
    /**
     * Connection id provided to the server by a pending connecting target
     *
     * @generated from protobuf field: string connection_id = 1;
     */
    connectionId: string;
    /**
     * Name of server verifying the connection request
     *
     * @generated from protobuf field: string server_name = 2;
     */
    serverName: string;
}
/**
 * @generated from protobuf message sro.gameserver.ConnectionStatus
 */
export interface ConnectionStatus {
    /**
     * @generated from protobuf field: bool online = 1;
     */
    online: boolean;
}
/**
 * @generated from protobuf message sro.gameserver.TransferPlayerRequest
 */
export interface TransferPlayerRequest {
    /**
     * @generated from protobuf field: string character = 1;
     */
    character: string;
    /**
     * @generated from protobuf field: sro.Location location = 2;
     */
    location?: Location;
}
// @generated message type with reflection information, may provide speed optimized methods
class ConnectGameServerResponse$Type extends MessageType<ConnectGameServerResponse> {
    constructor() {
        super("sro.gameserver.ConnectGameServerResponse", [
            { no: 1, name: "address", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "port", kind: "scalar", T: 13 /*ScalarType.UINT32*/ },
            { no: 3, name: "connection_id", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<ConnectGameServerResponse>): ConnectGameServerResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.address = "";
        message.port = 0;
        message.connectionId = "";
        if (value !== undefined)
            reflectionMergePartial<ConnectGameServerResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ConnectGameServerResponse): ConnectGameServerResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string address */ 1:
                    message.address = reader.string();
                    break;
                case /* uint32 port */ 2:
                    message.port = reader.uint32();
                    break;
                case /* string connection_id */ 3:
                    message.connectionId = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: ConnectGameServerResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string address = 1; */
        if (message.address !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.address);
        /* uint32 port = 2; */
        if (message.port !== 0)
            writer.tag(2, WireType.Varint).uint32(message.port);
        /* string connection_id = 3; */
        if (message.connectionId !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.connectionId);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message sro.gameserver.ConnectGameServerResponse
 */
export const ConnectGameServerResponse = new ConnectGameServerResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class VerifyConnectRequest$Type extends MessageType<VerifyConnectRequest> {
    constructor() {
        super("sro.gameserver.VerifyConnectRequest", [
            { no: 1, name: "connection_id", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "server_name", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<VerifyConnectRequest>): VerifyConnectRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.connectionId = "";
        message.serverName = "";
        if (value !== undefined)
            reflectionMergePartial<VerifyConnectRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: VerifyConnectRequest): VerifyConnectRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string connection_id */ 1:
                    message.connectionId = reader.string();
                    break;
                case /* string server_name */ 2:
                    message.serverName = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: VerifyConnectRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string connection_id = 1; */
        if (message.connectionId !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.connectionId);
        /* string server_name = 2; */
        if (message.serverName !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.serverName);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message sro.gameserver.VerifyConnectRequest
 */
export const VerifyConnectRequest = new VerifyConnectRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ConnectionStatus$Type extends MessageType<ConnectionStatus> {
    constructor() {
        super("sro.gameserver.ConnectionStatus", [
            { no: 1, name: "online", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
    create(value?: PartialMessage<ConnectionStatus>): ConnectionStatus {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.online = false;
        if (value !== undefined)
            reflectionMergePartial<ConnectionStatus>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ConnectionStatus): ConnectionStatus {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bool online */ 1:
                    message.online = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: ConnectionStatus, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* bool online = 1; */
        if (message.online !== false)
            writer.tag(1, WireType.Varint).bool(message.online);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message sro.gameserver.ConnectionStatus
 */
export const ConnectionStatus = new ConnectionStatus$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TransferPlayerRequest$Type extends MessageType<TransferPlayerRequest> {
    constructor() {
        super("sro.gameserver.TransferPlayerRequest", [
            { no: 1, name: "character", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "location", kind: "message", T: () => Location }
        ]);
    }
    create(value?: PartialMessage<TransferPlayerRequest>): TransferPlayerRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.character = "";
        if (value !== undefined)
            reflectionMergePartial<TransferPlayerRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TransferPlayerRequest): TransferPlayerRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string character */ 1:
                    message.character = reader.string();
                    break;
                case /* sro.Location location */ 2:
                    message.location = Location.internalBinaryRead(reader, reader.uint32(), options, message.location);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: TransferPlayerRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string character = 1; */
        if (message.character !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.character);
        /* sro.Location location = 2; */
        if (message.location)
            Location.internalBinaryWrite(message.location, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message sro.gameserver.TransferPlayerRequest
 */
export const TransferPlayerRequest = new TransferPlayerRequest$Type();
/**
 * @generated ServiceType for protobuf service sro.gameserver.ConnectionService
 */
export const ConnectionService = new ServiceType("sro.gameserver.ConnectionService", [
    { name: "ConnectGameServer", options: { "google.api.http": { get: "/v1/connect/character/id/{id}" } }, I: TargetId, O: ConnectGameServerResponse },
    { name: "VerifyConnect", options: { "google.api.http": { post: "/v1/connect/verify", body: "*" } }, I: VerifyConnectRequest, O: TargetId },
    { name: "TransferPlayer", options: { "google.api.http": { post: "/v1/transfer", body: "*" } }, I: TransferPlayerRequest, O: ConnectGameServerResponse },
    { name: "IsCharacterPlaying", options: { "google.api.http": { get: "/v1/status/character/id/{id}" } }, I: TargetId, O: ConnectionStatus },
    { name: "IsUserPlaying", options: { "google.api.http": { get: "/v1/status/user/id/{id}" } }, I: TargetId, O: ConnectionStatus }
]);
