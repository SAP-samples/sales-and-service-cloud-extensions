import { PaginationUtils } from './pagination.utils';

describe('PaginationUtils', () => {
  describe('validatePagination', () => {
    it('should return default values when no parameters provided', () => {
      const result = PaginationUtils.validatePagination();

      expect(result.top).toBe(50);
      expect(result.skip).toBe(0);
    });

    it('should return default limit when top is 0', () => {
      const result = PaginationUtils.validatePagination(0, 10);

      expect(result.top).toBe(50);
      expect(result.skip).toBe(10);
    });

    it('should return default limit when top is negative', () => {
      const result = PaginationUtils.validatePagination(-10, 5);

      expect(result.top).toBe(50);
      expect(result.skip).toBe(5);
    });

    it('should return default skip when skip is negative', () => {
      const result = PaginationUtils.validatePagination(20, -5);

      expect(result.top).toBe(20);
      expect(result.skip).toBe(0);
    });

    it('should enforce maximum limit of 1000', () => {
      const result = PaginationUtils.validatePagination(2000, 0);

      expect(result.top).toBe(1000);
      expect(result.skip).toBe(0);
    });

    it('should accept valid pagination parameters', () => {
      const result = PaginationUtils.validatePagination(100, 50);

      expect(result.top).toBe(100);
      expect(result.skip).toBe(50);
    });

    it('should handle edge case of exactly max limit', () => {
      const result = PaginationUtils.validatePagination(1000, 0);

      expect(result.top).toBe(1000);
      expect(result.skip).toBe(0);
    });

    it('should handle edge case of skip=0', () => {
      const result = PaginationUtils.validatePagination(25, 0);

      expect(result.top).toBe(25);
      expect(result.skip).toBe(0);
    });
  });

  describe('defaults', () => {
    it('should return correct default values', () => {
      const defaults = PaginationUtils.defaults;

      expect(defaults.DEFAULT_LIMIT).toBe(50);
      expect(defaults.MAX_LIMIT).toBe(1000);
    });
  });
});
