import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { extractedData, processingTime, accuracy } = body

        if (!id) {
            return NextResponse.json({ error: 'Document ID required' }, { status: 400 })
        }

        if (!extractedData) {
            return NextResponse.json({ error: 'Extracted data required' }, { status: 400 })
        }

        // Save processing result
        const result = await db.processingResult.create({
            data: {
                documentId: id,
                extractedData: JSON.stringify(extractedData),
                processingTime: processingTime || 0,
                accuracyMetrics: accuracy ? JSON.stringify({ accuracy }) : null
            }
        })

        // Update document status to completed
        const document = await db.document.update({
            where: { id },
            data: {
                processingStatus: 'completed'
            }
        })

        return NextResponse.json({
            success: true,
            result
        })

    } catch (error) {
        console.error('Save results error:', error)
        return NextResponse.json(
            { error: 'Failed to save processing results' },
            { status: 500 }
        )
    }
}
