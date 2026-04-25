import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const parseTskvOutput = (output: string): Record<string, string> => {
    // Формат: tskv\tkey=value\tkey=value...
    const parts = output.split('\t');
    const result: Record<string, string> = {};
    // Пропускаем первый элемент 'tskv'
    for (let i = 1; i < parts.length; i++) {
      const [key, value] = parts[i].split('=');
      result[key] = value;
    }
    return result;
  };

  describe('log', () => {
    it('should output TSKV formatted log with required fields', () => {
      const message = 'Test log message';
      logger.log(message);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const output = consoleLogSpy.mock.calls[0][0];
      expect(output).toMatch(/^tskv\t/);

      const parsed = parseTskvOutput(output);
      expect(parsed.level).toBe('log');
      expect(parsed.message).toBe(message);
      expect(parsed.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
    });

    it('should include context when optional parameters provided', () => {
      logger.log('Message with context', 'ctx1', 'ctx2');
      const output = consoleLogSpy.mock.calls[0][0];
      const parsed = parseTskvOutput(output);
      expect(parsed.context).toBe('ctx1, ctx2');
    });

    it('should not include context field when no optional parameters', () => {
      logger.log('Just message');
      const output = consoleLogSpy.mock.calls[0][0];
      const parsed = parseTskvOutput(output);
      expect(parsed.context).toBeUndefined();
    });
  });

  describe('error', () => {
    it('should output TSKV with level "error"', () => {
      logger.error('Something failed');
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const output = consoleErrorSpy.mock.calls[0][0];
      const parsed = parseTskvOutput(output);
      expect(parsed.level).toBe('error');
      expect(parsed.message).toBe('Something failed');
    });
  });

  describe('warn', () => {
    it('should output TSKV with level "warn"', () => {
      logger.warn('Deprecation warning');
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      const output = consoleWarnSpy.mock.calls[0][0];
      const parsed = parseTskvOutput(output);
      expect(parsed.level).toBe('warn');
    });
  });

  describe('debug', () => {
    it('should output TSKV with level "debug"', () => {
      logger.debug?.('Debug details');
      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
      const output = consoleDebugSpy.mock.calls[0][0];
      const parsed = parseTskvOutput(output);
      expect(parsed.level).toBe('debug');
    });
  });

  describe('verbose', () => {
    it('should output TSKV with level "verbose"', () => {
      logger.verbose?.('Verbose logging');
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const output = consoleLogSpy.mock.calls[0][0];
      const parsed = parseTskvOutput(output);
      expect(parsed.level).toBe('verbose');
    });
  });
});
