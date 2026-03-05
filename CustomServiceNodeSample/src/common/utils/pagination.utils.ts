/**
 * Pagination utility class for consistent pagination across all APIs
 */
export class PaginationUtils {
  private static readonly DEFAULT_LIMIT = 50;
  private static readonly MAX_LIMIT = 1000;

  /**
   * Apply pagination defaults and limits
   * @param top - Requested top/limit parameter
   * @param skip - Requested skip/offset parameter  
   * @returns Validated pagination parameters
   */
  static validatePagination(top?: number, skip?: number): { top: number; skip: number } {
    // Set default limit if not provided
    if (!top || top <= 0) {
      top = this.DEFAULT_LIMIT;
    }
    
    // Enforce maximum limit
    if (top > this.MAX_LIMIT) {
      top = this.MAX_LIMIT;
    }
    
    // Set default skip if not provided
    if (!skip || skip < 0) {
      skip = 0;
    }
    
    return { top, skip };
  }

  /**
   * Get pagination defaults
   */
  static get defaults() {
    return {
      DEFAULT_LIMIT: this.DEFAULT_LIMIT,
      MAX_LIMIT: this.MAX_LIMIT
    };
  }
}