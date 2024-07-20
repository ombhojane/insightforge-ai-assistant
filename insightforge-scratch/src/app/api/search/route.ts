import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

async function getEmbedding(text: string) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
    {
      headers: {
        Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs: text }),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return result[0];  // The API returns an array with one embedding
}

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      const { query } = await req.json();

      if (!query) {
        return NextResponse.json({ error: 'Query is required' }, { status: 400 });
      }

      const queryEmbedding = await getEmbedding(query);

      const { db } = await connectToDatabase();

      const results = await db.collection('documents').aggregate([
        {
          $search: {
            index: "default",
            knnBeta: {
              vector: queryEmbedding,
              path: "chunks.embedding",
              k: 5
            }
          }
        },
        {
          $project: {
            fileName: 1,
            chunks: {
              $slice: ["$chunks", 5]
            },
            score: { $meta: "searchScore" }
          }
        }
      ]).toArray();

      return NextResponse.json({ results });
    } catch (error) {
      console.error('Error searching documents:', error);
      return NextResponse.json({ error: 'Error searching documents' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
}