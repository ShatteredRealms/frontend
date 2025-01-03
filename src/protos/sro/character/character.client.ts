// @generated by protobuf-ts 2.9.4 with parameter long_type_number
// @generated from protobuf file "sro/character/character.proto" (package "sro.character", syntax proto3)
// tslint:disable
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { CharacterService } from "./character";
import type { PlayTimeResponse } from "./character";
import type { AddPlayTimeRequest } from "./character";
import type { EditCharacterRequest } from "./character";
import type { CreateCharacterRequest } from "./character";
import type { CharactersDetails } from "./character";
import type { Empty } from "../../google/protobuf/empty";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { CharacterDetails } from "./character";
import type { TargetId } from "../globals";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service sro.character.CharacterService
 */
export interface ICharacterServiceClient {
    /**
     * @generated from protobuf rpc: GetCharacter(sro.TargetId) returns (sro.character.CharacterDetails);
     */
    getCharacter(input: TargetId, options?: RpcOptions): UnaryCall<TargetId, CharacterDetails>;
    /**
     * @generated from protobuf rpc: GetCharacters(google.protobuf.Empty) returns (sro.character.CharactersDetails);
     */
    getCharacters(input: Empty, options?: RpcOptions): UnaryCall<Empty, CharactersDetails>;
    /**
     * @generated from protobuf rpc: GetCharactersForUser(sro.TargetId) returns (sro.character.CharactersDetails);
     */
    getCharactersForUser(input: TargetId, options?: RpcOptions): UnaryCall<TargetId, CharactersDetails>;
    /**
     * @generated from protobuf rpc: CreateCharacter(sro.character.CreateCharacterRequest) returns (sro.character.CharacterDetails);
     */
    createCharacter(input: CreateCharacterRequest, options?: RpcOptions): UnaryCall<CreateCharacterRequest, CharacterDetails>;
    /**
     * @generated from protobuf rpc: DeleteCharacter(sro.TargetId) returns (google.protobuf.Empty);
     */
    deleteCharacter(input: TargetId, options?: RpcOptions): UnaryCall<TargetId, Empty>;
    /**
     * @generated from protobuf rpc: EditCharacter(sro.character.EditCharacterRequest) returns (sro.character.CharacterDetails);
     */
    editCharacter(input: EditCharacterRequest, options?: RpcOptions): UnaryCall<EditCharacterRequest, CharacterDetails>;
    /**
     * Adds the given amount of playtime to the character and returns the total
     * playtime
     *
     * @generated from protobuf rpc: AddCharacterPlayTime(sro.character.AddPlayTimeRequest) returns (sro.character.PlayTimeResponse);
     */
    addCharacterPlayTime(input: AddPlayTimeRequest, options?: RpcOptions): UnaryCall<AddPlayTimeRequest, PlayTimeResponse>;
}
/**
 * @generated from protobuf service sro.character.CharacterService
 */
export class CharacterServiceClient implements ICharacterServiceClient, ServiceInfo {
    typeName = CharacterService.typeName;
    methods = CharacterService.methods;
    options = CharacterService.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: GetCharacter(sro.TargetId) returns (sro.character.CharacterDetails);
     */
    getCharacter(input: TargetId, options?: RpcOptions): UnaryCall<TargetId, CharacterDetails> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<TargetId, CharacterDetails>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: GetCharacters(google.protobuf.Empty) returns (sro.character.CharactersDetails);
     */
    getCharacters(input: Empty, options?: RpcOptions): UnaryCall<Empty, CharactersDetails> {
        const method = this.methods[1], opt = this._transport.mergeOptions(options);
        return stackIntercept<Empty, CharactersDetails>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: GetCharactersForUser(sro.TargetId) returns (sro.character.CharactersDetails);
     */
    getCharactersForUser(input: TargetId, options?: RpcOptions): UnaryCall<TargetId, CharactersDetails> {
        const method = this.methods[2], opt = this._transport.mergeOptions(options);
        return stackIntercept<TargetId, CharactersDetails>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: CreateCharacter(sro.character.CreateCharacterRequest) returns (sro.character.CharacterDetails);
     */
    createCharacter(input: CreateCharacterRequest, options?: RpcOptions): UnaryCall<CreateCharacterRequest, CharacterDetails> {
        const method = this.methods[3], opt = this._transport.mergeOptions(options);
        return stackIntercept<CreateCharacterRequest, CharacterDetails>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: DeleteCharacter(sro.TargetId) returns (google.protobuf.Empty);
     */
    deleteCharacter(input: TargetId, options?: RpcOptions): UnaryCall<TargetId, Empty> {
        const method = this.methods[4], opt = this._transport.mergeOptions(options);
        return stackIntercept<TargetId, Empty>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: EditCharacter(sro.character.EditCharacterRequest) returns (sro.character.CharacterDetails);
     */
    editCharacter(input: EditCharacterRequest, options?: RpcOptions): UnaryCall<EditCharacterRequest, CharacterDetails> {
        const method = this.methods[5], opt = this._transport.mergeOptions(options);
        return stackIntercept<EditCharacterRequest, CharacterDetails>("unary", this._transport, method, opt, input);
    }
    /**
     * Adds the given amount of playtime to the character and returns the total
     * playtime
     *
     * @generated from protobuf rpc: AddCharacterPlayTime(sro.character.AddPlayTimeRequest) returns (sro.character.PlayTimeResponse);
     */
    addCharacterPlayTime(input: AddPlayTimeRequest, options?: RpcOptions): UnaryCall<AddPlayTimeRequest, PlayTimeResponse> {
        const method = this.methods[6], opt = this._transport.mergeOptions(options);
        return stackIntercept<AddPlayTimeRequest, PlayTimeResponse>("unary", this._transport, method, opt, input);
    }
}
