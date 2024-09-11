export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Float64, 'err' : IDL.Text });
  const CalculationResult = IDL.Record({
    'result' : IDL.Float64,
    'operation' : IDL.Text,
  });
  return IDL.Service({
    'calculate' : IDL.Func([IDL.Text, IDL.Float64, IDL.Float64], [Result], []),
    'getHistory' : IDL.Func([], [IDL.Vec(CalculationResult)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
