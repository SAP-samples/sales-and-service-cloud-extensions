/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'Error' schema.
 */
export type Error = {
  error?: {
    code?: string;
    details?: ({
      message?: string;
      code?: string;
      target?: string;
    } & Record<string, any>)[];
    message?: string;
    target?: string;
  } & Record<string, any>;
} & Record<string, any>;
