import { xdr, scValToNative } from "soroban-client";

export interface Invoice {
  id: number;
  owner: string;
  amount: number;
}

/**
 * Parses a Base64-encoded XDR string returned by a Soroban smart contract call (e.g., get_invoice)
 * and converts it into a structured Invoice object.
 *
 * @param xdrBase64 - The Base64-encoded XDR string.
 * @returns The parsed Invoice object.
 * @throws Error if the XDR is invalid or the data structure does not match the expected Invoice schema.
 */
export function parseInvoiceFromXdr(xdrBase64: string): Invoice {
  if (!xdrBase64 || typeof xdrBase64 !== 'string') {
    throw new Error("Invalid input: xdrBase64 must be a non-empty string.");
  }

  try {
    // 1. Decode the XDR string to an ScVal
    // Note: We use 'base64' encoding as standard for Soroban return values
    const value = xdr.ScVal.fromXDR(xdrBase64, 'base64');

    // 2. Convert ScVal to a native JavaScript object
    // scValToNative handles BigInt conversion automatically (returns bigint for u64/i64/u128/i128)
    const nativeValue = scValToNative(value);

    if (!nativeValue || typeof nativeValue !== 'object') {
      throw new Error(`Parsed XDR result is not an object or Map. Got: ${typeof nativeValue}`);
    }

    // 3. Normalize the native value to a plain object (handle Map vs Object)
    let invoiceData: Record<string, any> = {};

    // Check if it's a Map (common in newer SDKs for ScMap)
    // We check for .get method to be safe, or just check instanceof Map if environment supports it
    // But usually scValToNative returns plain objects for Structs in some versions, or objects with properties.
    // However, if it returns an array of entries or a Map, we need to handle it.
    // Let's assume it returns an object with keys matching struct fields.
    // If it is a Map, we convert it.
    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (nativeValue instanceof Map) {
         nativeValue.forEach((val: any, key: any) => {
             invoiceData[String(key)] = val;
         });
    } else {
         invoiceData = nativeValue as Record<string, any>;
    }

    // 4. Validate and transform into strictly-typed Invoice
    const result: Invoice = {
      id: 0,
      owner: '',
      amount: 0
    };

    // Helper to safely convert to Number
    const safelyConvertToNumber = (val: any, fieldName: string): number => {
      if (typeof val === 'number') {
        return val;
      }
      if (typeof val === 'bigint') {
        if (val > BigInt(Number.MAX_SAFE_INTEGER) || val < BigInt(Number.MIN_SAFE_INTEGER)) {
           console.warn(`[TradeFlow] Warning: Value for '${fieldName}' (${val}) exceeds Number.MAX_SAFE_INTEGER. Precision lost.`);
        }
        return Number(val);
      }
      if (typeof val === 'string') {
        // Try parsing string to number
        const num = Number(val);
        if (isNaN(num)) {
             throw new Error(`Invalid number format for field '${fieldName}': ${val}`);
        }
        return num;
      }
      throw new Error(`Invalid type for field '${fieldName}': expected number or bigint, got ${typeof val}`);
    };

    // Helper to safely convert to String
    const safelyConvertToString = (val: any, fieldName: string): string => {
        if (typeof val === 'string') {
            return val;
        }
        // Handle Address object if scValToNative returns an Address class
        if (val && typeof val.toString === 'function') {
            return val.toString();
        }
        throw new Error(`Invalid type for field '${fieldName}': expected string, got ${typeof val}`);
    };

    // Validate fields
    if (!('id' in invoiceData)) throw new Error("Missing required field: 'id'");
    if (!('owner' in invoiceData)) throw new Error("Missing required field: 'owner'");
    if (!('amount' in invoiceData)) throw new Error("Missing required field: 'amount'");

    result.id = safelyConvertToNumber(invoiceData.id, 'id');
    result.owner = safelyConvertToString(invoiceData.owner, 'owner');
    result.amount = safelyConvertToNumber(invoiceData.amount, 'amount');

    return result;

  } catch (error: any) {
    // Wrap error with context
    // Check if it's our own error or from library
    if (error.message && error.message.startsWith('Invalid input')) throw error;
    if (error.message && error.message.startsWith('Missing required')) throw error;
    
    throw new Error(`Failed to parse Invoice from XDR: ${error.message}`);
  }
}

/**
 * Helper to safely stringify objects containing BigInts for logging or API responses.
 * JSON.stringify throws on BigInt by default.
 */
export function safeJsonStringify(obj: any): string {
  return JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint'
      ? value.toString()
      : value
  );
}
