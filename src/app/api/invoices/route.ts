import { NextRequest, NextResponse } from 'next/server';

// Mock data generator for demonstration
const generateMockInvoices = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `INV-${String(index + 1).padStart(4, '0')}`,
    riskScore: Math.floor(Math.random() * 40) + 60, // 60-100
    status: Math.random() > 0.3 ? 'Approved' : 'Pending',
    amount: Math.floor(Math.random() * 50000) + 1000, // $1,000 - $51,000
  }));
};

// Generate 10,000 mock invoices
const ALL_INVOICES = generateMockInvoices(10000);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Parse pagination parameters
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  
  // Validate parameters
  const validPage = Math.max(1, page);
  const validLimit = Math.min(100, Math.max(1, limit)); // Max 100 items per page
  
  // Calculate pagination
  const offset = (validPage - 1) * validLimit;
  const totalItems = ALL_INVOICES.length;
  const totalPages = Math.ceil(totalItems / validLimit);
  
  // Get paginated data
  const invoices = ALL_INVOICES.slice(offset, offset + validLimit);
  
  // Return paginated response
  return NextResponse.json({
    data: invoices,
    pagination: {
      currentPage: validPage,
      totalPages,
      totalItems,
      itemsPerPage: validLimit,
      hasNextPage: validPage < totalPages,
      hasPreviousPage: validPage > 1,
    },
  });
}
