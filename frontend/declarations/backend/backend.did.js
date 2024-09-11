export const idlFactory = ({ IDL }) => {
  const Result_1 = IDL.Variant({ 'ok' : IDL.Float64, 'err' : IDL.Text });
  const CalculationResult = IDL.Record({
    'result' : IDL.Float64,
    'operation' : IDL.Text,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  return IDL.Service({
    'calculate' : IDL.Func(
        [IDL.Text, IDL.Float64, IDL.Float64],
        [Result_1],
        [],
      ),
    'getHistory' : IDL.Func([], [IDL.Vec(CalculationResult)], ['query']),
    'sendEmail' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
