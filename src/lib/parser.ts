/**
 * XDR Parsing and Serialization Utilities.
 * Handles conversion between Stellar's External Data Representation (XDR) 
 * and native JavaScript objects for the TradeFlow smart contracts.
 */

import { xdr, scValToNative } from "soroban-client";

/**
 * Structured data representation of a TradeFlow Invoice.
 */
export interface Invoice {
  /** Unique numeric identifier for the invoice */
  id: number;
  /** Public Stellar address of the invoice owner/creator */
  owner: string;
  /** The total amount of the invoice (raw units) */
  amount: number;
}

/**
 * Parses a Base64-encoded XDR string returned by a Soroban smart contract call 
 * (specifically the 'get_invoice' method) and converts it into a structured Invoice object.
 *
 * @param {string} xdrBase64 - The Base64-encoded ScVal XDR string from the network.
 * @returns {Invoice} The parsed and validated Invoice object.
 * @throws {Error} If the XDR is malformed or the data structure is invalid.
 */
export function parseInvoiceFromXdr(xdrBase64: string): Invoice {
  // 1. Basic validation of input string
  if (!xdrBase64 || typeof xdrBase64 !== 'string') {
    throw new Error("Invalid input: xdrBase64 must be a non-empty string.");
  }

  try {
    // 2. Decode the XDR string to a Soroban ScVal (Smart Contract Value)
    const value = xdr.ScVal.fromXDR(xdrBase64, 'base64');

    // 3. Convert ScVal to a native JavaScript object
    // scValToNative handles basic types and recursively converts complex types (Maps, Structs, Vecs)
    const nativeValue = scValToNative(value);

    if (!nativeValue || typeof nativeValue !== 'object') {
      throw new Error(`Parsed XDR result is not an object or Map. Got: ${typeof nativeValue}`);
    }

    // 4. Normalize the native value (handle different SDK return formats)
    let invoiceData: Record<string, any> = {};

    // In some SDK versions, ScMap/Struct returns a native Map
    if (nativeValue instanceof Map) {
         nativeValue.forEach((val: any, key: any) => {
             invoiceData[String(key)] = val;
         });
    } else {
         invoiceData = nativeValue as Record<string, any>;
    }

    // 5. Transform and strictly validate fields
    const result: Invoice = {
      id: 0,
      owner: '',
      amount: 0
    };

    /**
     * Safely converts various numeric types (number, bigint, string) to a standard number.
     */
    const safelyConvertToNumber = (val: any, fieldName: string): number => {
      if (typeof val === 'number') {
        return val;
      }
      if (typeof val === 'bigint') {
        // Log warning if bigint exceeds JavaScript's safe integer range
        if (val > BigInt(Number.MAX_SAFE_INTEGER) || val < BigInt(Number.MIN_SAFE_INTEGER)) {
           console.warn(`[TradeFlow] Precision warning: Value for '${fieldName}' (${val}) exceeds Number.MAX_SAFE_INTEGER.`);
        }
        return Number(val);
      }
      if (typeof val === 'string') {
        const num = Number(val);
        if (isNaN(num)) {
             throw new Error(`Invalid number format for field '${fieldName}': ${val}`);
        }
        return num;
      }
      throw new Error(`Invalid type for field '${fieldName}': expected number or bigint, got ${typeof val}`);
    };

    /**
     * Ensures a value is treated as a string, handling Address objects if necessary.
     */
    const safelyConvertToString = (val: any, fieldName: string): string => {
        if (typeof val === 'string') {
            return val;
        }
        // Soroban Address types might return an object with a toString() method
        if (val && typeof val.toString === 'function') {
            return val.toString();
        }
        throw new Error(`Invalid type for field '${fieldName}': expected string, got ${typeof val}`);
    };

    // Verify presence of all required struct fields
    if (!('id' in invoiceData)) throw new Error("Missing required field: 'id'");
    if (!('owner' in invoiceData)) throw new Error("Missing required field: 'owner'");
    if (!('amount' in invoiceData)) throw new Error("Missing required field: 'amount'");

    // Perform final assignments with type safety
    result.id = safelyConvertToNumber(invoiceData.id, 'id');
    result.owner = safelyConvertToString(invoiceData.owner, 'owner');
    result.amount = safelyConvertToNumber(invoiceData.amount, 'amount');

    return result;

  } catch (error: any) {
    // Propagate validation errors directly, wrap others with context
    if (error.message && (error.message.startsWith('Invalid input') || error.message.startsWith('Missing required'))) {
      throw error;
    }
    
    throw new Error(`Failed to parse Invoice from XDR: ${error.message}`);
  }
}

/**
 * A safe alternative to JSON.stringify that handles BigInt values.
 * BigInt is commonly used in Stellar SDKs for large numeric values.
 * 
 * @param {any} obj - The object to stringify.
 * @returns {string} The JSON string representation.
 */
export function safeJsonStringify(obj: any): string {
  return JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint'
      ? value.toString()
      : value
  );
}

