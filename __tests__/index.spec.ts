import AWS from 'aws-sdk/global';
import { main, Props, Credentials, ExtraOptions } from '../src';
import { setFailed, getInput, setOutput } from '../__mocks__/@actions/core';
import Lambda, { constructorMock } from '../__mocks__/aws-sdk/clients/lambda';

describe('use-herald', () => {
  const mockedInput = {
    [Props.FunctionName]: 'SomeFunction',
    [Props.LogType]: 'None',
    [Props.Payload]: '{"input": {value: "1"}',
    [Props.Qualifier]: 'production',
    [ExtraOptions.HTTP_TIMEOUT]: '220000',
    [ExtraOptions.MAX_RETRIES]: '3',
    [ExtraOptions.SUCCEED_ON_FUNCTION_FAILURE]: 'false',
    [Credentials.AWS_ACCESS_KEY_ID]: 'someAccessKey',
    [Credentials.AWS_SECRET_ACCESS_KEY]: 'someSecretKey',
    REGION: 'us-west-2',
  };

  beforeAll(() => {
    getInput.mockImplementation(
      (key: Partial<Props & Credentials & 'REGION'>) => {
        return mockedInput[key];
      }
    );
  });

  afterEach(() => {
    getInput.mockClear();
    setFailed.mockClear();
    setOutput.mockClear();
  });

  it('runs when provided the correct input', async () => {
    const handler = jest.fn(() => ({ response: 'ok' }));

    Lambda.__setResponseForMethods({ invoke: handler });

    await main();
    expect(getInput).toHaveBeenCalledTimes(13);
    expect(setFailed).not.toHaveBeenCalled();
    expect(AWS.config.httpOptions).toMatchInlineSnapshot(`
      Object {
        "timeout": 220000,
      }
    `);
    expect(constructorMock.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "apiVersion": "2015-03-31",
            "region": "us-west-2",
          },
        ],
      ]
    `);
    expect(handler.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "FunctionName": "SomeFunction",
            "LogType": "None",
            "Payload": "{\\"input\\": {value: \\"1\\"}",
            "Qualifier": "production",
          },
        ],
      ]
    `);
    expect(setOutput.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "response",
          Object {
            "response": "ok",
          },
        ],
      ]
    `);
  });

  it('fails when lambda invocation throws an error', async () => {
    const handler = jest.fn(() => {
      throw new Error('something went horribly wrong');
    });

    Lambda.__setResponseForMethods({ invoke: handler });

    await main();

    expect(getInput).toHaveBeenCalledTimes(12);
    expect(AWS.config.httpOptions).toMatchInlineSnapshot(`
      Object {
        "timeout": 220000,
      }
    `);
    expect(setFailed).toHaveBeenCalled();
    expect(setOutput).not.toHaveBeenCalled();
  });

  describe('when the function returns an error', () => {
    beforeEach(() => {
      const handler = jest.fn().mockReturnValue({
        FunctionError: 'Unhandled',
      });

      Lambda.__setResponseForMethods({ invoke: handler });
    });

    it('should fail the action when SUCCEED_ON_FUNCTION_FAILURE is undefined', async () => {
      const overriddenMockedInput = {
        ...mockedInput,
        [ExtraOptions.SUCCEED_ON_FUNCTION_FAILURE]: undefined,
      };

      getInput.mockImplementation(
        (key: Partial<Props & Credentials & 'REGION'>) => {
          return overriddenMockedInput[key];
        }
      );

      await main();

      expect(setOutput).toHaveBeenCalled();
      expect(setFailed).toHaveBeenCalled();
    });

    it('should fail the action when SUCCEED_ON_FUNCTION_FAILURE is false', async () => {
      const overriddenMockedInput = {
        ...mockedInput,
        [ExtraOptions.SUCCEED_ON_FUNCTION_FAILURE]: 'false',
      };

      getInput.mockImplementation(
        (key: Partial<Props & Credentials & 'REGION'>) => {
          return overriddenMockedInput[key];
        }
      );

      await main();

      expect(setOutput).toHaveBeenCalled();
      expect(setFailed).toHaveBeenCalled();
    });

    it('should succeed the action when SUCCEED_ON_FUNCTION_FAILURE is true', async () => {
      const overriddenMockedInput = {
        ...mockedInput,
        [ExtraOptions.SUCCEED_ON_FUNCTION_FAILURE]: 'true',
      };

      getInput.mockImplementation(
        (key: Partial<Props & Credentials & 'REGION'>) => {
          return overriddenMockedInput[key];
        }
      );

      await main();

      expect(setOutput).toHaveBeenCalled();
      expect(setFailed).not.toHaveBeenCalled();
    });
  });
});
