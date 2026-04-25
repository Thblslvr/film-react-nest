import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const parseJsonOutput = (spy: jest.SpyInstance) => {
    expect(spy).toHaveBeenCalledTimes(1);
    const output = spy.mock.calls[0][0];
    expect(() => JSON.parse(output)).not.toThrow();
    return JSON.parse(output);
  };

  describe('log', () => {
    it('should output JSON with level "log" and message', () => {
      const message = 'Test log message';
      logger.log(message);

      const parsed = parseJsonOutput(consoleLogSpy);
      expect(parsed.level).toBe('log');
      expect(parsed.message).toBe(message);
      expect(parsed.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
    });

    it('should include optional parameters as context field', () => {
      logger.log('Message with context', 'context1', 'context2');
      const parsed = parseJsonOutput(consoleLogSpy);
      expect(parsed.context).toEqual(['context1', 'context2']);
    });

    it('should handle multiple calls', () => {
      logger.log('First');
      logger.log('Second');
      expect(consoleLogSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('error', () => {
    it('should output JSON with level "error"', () => {
      const message = 'Test error message';
      logger.error(message);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const output = consoleErrorSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);
      expect(parsed.level).toBe('error');
      expect(parsed.message).toBe(message);
    });

    it('should include optional parameters', () => {
      logger.error('Error occurred', 'stack trace');
      const output = consoleErrorSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);
      expect(parsed.context).toEqual(['stack trace']);
    });
  });

  describe('warn', () => {
    it('should output JSON with level "warn"', () => {
      logger.warn('Warning!');
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      const parsed = JSON.parse(consoleWarnSpy.mock.calls[0][0]);
      expect(parsed.level).toBe('warn');
    });
  });

  describe('debug', () => {
    it('should output JSON with level "debug" when called', () => {
      logger.debug?.('Debug info');
      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
      const parsed = JSON.parse(consoleDebugSpy.mock.calls[0][0]);
      expect(parsed.level).toBe('debug');
    });
  });

  describe('verbose', () => {
    it('should output JSON with level "verbose"', () => {
      logger.verbose?.('Verbose output');
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const parsed = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(parsed.level).toBe('verbose');
    });
  });
});
