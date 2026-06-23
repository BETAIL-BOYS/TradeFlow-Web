# API Contract

This document defines the exact JSON contract between frontend and backend APIs. **NO KEY NAMES SHOULD BE CHANGED WITHOUT PRIOR NOTIFICATION TO FRONTEND TEAM**.

## Version

v1.0.0

---

## Endpoints

### 1. GET /invoices

Returns paginated list of invoice summaries.

#### Query Parameters

| Name   | Type   | Required | Default | Description                          |
| ------ | ------ | -------- | ------- | ------------------------------------ |
| page   | number | No       | 1       | Current page number (1-based)        |
| limit  | number | No       | 20      | Items per page (max 100)             |
| minApy | number | No       | 0       | Minimum APY filter                   |
| maxApy | number | No       | 100     | Maximum APY filter                   |
| tiers  | string | No       | -       | Comma-separated risk tiers (A,B,C,D) |

#### Response Shape

```json
{
  "data": [
    {
      "id": "string",
      "riskScore": "number",
      "status": "string",
      "amount": "number | string",
      "apy": "number (optional)",
      "riskTier": "string (optional: 'A'|'B'|'C'|'D')"
    }
  ],
  "pagination": {
    "currentPage": "number",
    "totalPages": "number",
    "totalItems": "number",
    "itemsPerPage": "number",
    "hasNextPage": "boolean",
    "hasPreviousPage": "boolean"
  }
}
```

#### TypeScript Interface (frontend)

`InvoicesResponse` in `types/api.ts`

---

### 2. GET /v1/risk

Returns risk assessment for a specific invoice.

#### Query Parameters

| Name      | Type   | Required | Description        |
| --------- | ------ | -------- | ------------------ |
| invoiceId | string | Yes      | Invoice identifier |

#### Response Shape (200 OK)

```json
{
  "invoiceId": "string",
  "riskScore": "number",
  "scoreRange": {
    "min": "number (optional)",
    "max": "number (optional)"
  },
  "grade": "string (optional)",
  "factors": {
    "string": "number"
  } (optional),
  "updatedAt": "string (ISO 8601, optional)"
}
```

#### TypeScript Interface (frontend)

`RiskScoreResponse` in `types/api.ts`

---

## Error Response Standard

All error responses follow this shape:

```json
{
  "error": {
    "message": "string (human-readable UI-safe message)",
    "code": "string (machine-readable, optional)",
    "details": "unknown (optional, for debugging only)"
  }
}
```

#### TypeScript Interface (frontend)

`ApiErrorResponse` in `types/api.ts`

---

## Future Enhancements

- Integrate Orval or RTK Query code-gen to auto-generate TypeScript types from OpenAPI spec
- Add Swagger/OpenAPI UI for interactive documentation
