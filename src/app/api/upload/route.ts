import { NextRequest, NextResponse } from 'next/server';
import pinataSDK from '@pinata/sdk';

const pinata = pinataSDK(
  process.env.PINATA_API_KEY || '',
  process.env.PINATA_SECRET_API_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Pinata
    const result = await pinata.pinFileToIPFS(buffer, {
      pinataMetadata: {
        name: file.name,
        keyvalues: {
          type: 'invoice',
          uploadedAt: new Date().toISOString()
        }
      },
      pinataOptions: {
        cidVersion: 1
      }
    });

    // Return the IPFS hash
    return NextResponse.json({
      success: true,
      ipfsHash: result.IpfsHash,
      fileUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
    });

  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    return NextResponse.json(
      { error: 'Failed to upload file to IPFS' },
      { status: 500 }
    );
  }
}
