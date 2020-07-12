/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Lambda as RealLambda } from 'aws-sdk';
enum Methods {
  invoke = 'invoke',
}

type LAMBDAMOCKS = Partial<Record<Methods, (props: any) => any>>;

let lambdaMocks = {} as LAMBDAMOCKS;

type Dispatch = (
  response: Promise<any>,
  callback?: Function
) => { promise: () => Promise<any> } | any;

const dispatch: Dispatch = (response, callback?: Function) => {
  if (!callback) {
    return {
      promise: () => response,
    };
  }
  return response
    .then((result) => callback(null, result))
    .catch((err: Error) => callback(err, null));
};

const baseHandler = async <T>(
  method: Methods,
  props: T
): Promise<Record<string, any>> => {
  if (method in lambdaMocks) {
    const handler = lambdaMocks[method];
    return handler && handler(props);
  } else {
    return {};
  }
};

export const constructorMock = jest.fn();
export default class Lambda {
  static __setResponseForMethods(mock: LAMBDAMOCKS) {
    lambdaMocks = { ...lambdaMocks, ...mock };
  }

  static __showMockedPayloads() {
    return { ...lambdaMocks };
  }

  constructor(props: RealLambda.Types.ClientConfiguration) {
    constructorMock(props);
  }
  invoke(props: RealLambda.InvokeAsyncRequest, callback?: Function) {
    const promise = baseHandler(Methods.invoke, props);

    return dispatch(promise, callback);
  }
}
