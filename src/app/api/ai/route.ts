import { NextResponse } from 'next/server';
import { getAIProvider } from '@/lib/ai/provider';
import { verifyRequestUser } from '@/lib/firebase/require-auth';

export async function POST(req: Request) {
  try {
    const user = await verifyRequestUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { prompt, context, system } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const provider = getAIProvider();
    const response = await provider.generateText({ prompt, context, system });

    if (response.error) {
      return NextResponse.json({ error: response.error }, { status: 500 });
    }

    return NextResponse.json({ result: response.result });
  } catch (error) {
    console.error("[AI Route Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
