import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

async function getEmbeddings(texts: string[]) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
    {
      headers: {
        Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs: texts }),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      const userId = formData.get('userId') as string;

      if (!file || !userId) {
        return NextResponse.json({ error: 'File and userId are required' }, { status: 400 });
      }

      const text = await file.text();

      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 25,
        separators: ["\n\n", "\n", "(?<=\. )", " ", ""]
      });

      const chunks = await textSplitter.createDocuments([text]);

      const chunkTexts = chunks.map(chunk => chunk.pageContent);
      const embeddings = await getEmbeddings(chunkTexts);

      const embeddedChunks = chunks.map((chunk, index) => ({
        content: chunk.pageContent,
        embedding: embeddings[index],
      }));

      const { db } = await connectToDatabase();

      await db.collection('documents').insertOne({
        fileName: file.name,
        userId: userId,
        chunks: embeddedChunks,
        createdAt: new Date(),
      });

      return NextResponse.json({ message: 'File uploaded and processed successfully' });
    } catch (error) {
      console.error('Error processing file:', error);
      return NextResponse.json({ error: 'Error processing file' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
}