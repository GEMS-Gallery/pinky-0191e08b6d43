import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface CalculationResult { 'result' : number, 'operation' : string }
export type Result = { 'ok' : string } |
  { 'err' : string };
export type Result_1 = { 'ok' : number } |
  { 'err' : string };
export interface _SERVICE {
  'calculate' : ActorMethod<[string, number, number], Result_1>,
  'getHistory' : ActorMethod<[], Array<CalculationResult>>,
  'sendEmail' : ActorMethod<[string, string, string], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
