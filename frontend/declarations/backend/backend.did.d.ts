import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface CalculationResult { 'result' : number, 'operation' : string }
export type Result = { 'ok' : number } |
  { 'err' : string };
export interface _SERVICE {
  'calculate' : ActorMethod<[string, number, number], Result>,
  'getHistory' : ActorMethod<[], Array<CalculationResult>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
