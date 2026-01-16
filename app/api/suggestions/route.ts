import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "suggestions.json");

interface Suggestion {
  id: string;
  name: string;
  email: string;
  category: string;
  suggestion: string;
  anonymous: boolean;
  createdAt: string;
  status: "new" | "reviewed" | "implemented";
}

async function getSuggestions(): Promise<Suggestion[]> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveSuggestions(suggestions: Suggestion[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(suggestions, null, 2));
}

export async function GET() {
  const suggestions = await getSuggestions();
  return NextResponse.json(suggestions);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const suggestions = await getSuggestions();

    const newSuggestion: Suggestion = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: body.anonymous ? "Anonymous" : body.name,
      email: body.anonymous ? "" : body.email,
      category: body.category,
      suggestion: body.suggestion,
      anonymous: body.anonymous,
      createdAt: new Date().toISOString(),
      status: "new",
    };

    suggestions.unshift(newSuggestion);
    await saveSuggestions(suggestions);

    return NextResponse.json({ success: true, id: newSuggestion.id });
  } catch (error) {
    console.error("Error saving suggestion:", error);
    return NextResponse.json({ error: "Failed to save suggestion" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    const suggestions = await getSuggestions();
    
    const index = suggestions.findIndex((s) => s.id === id);
    if (index !== -1) {
      suggestions[index].status = status;
      await saveSuggestions(suggestions);
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: "Suggestion not found" }, { status: 404 });
  } catch (error) {
    console.error("Error updating suggestion:", error);
    return NextResponse.json({ error: "Failed to update suggestion" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    const suggestions = await getSuggestions();
    
    const filtered = suggestions.filter((s) => s.id !== id);
    await saveSuggestions(filtered);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting suggestion:", error);
    return NextResponse.json({ error: "Failed to delete suggestion" }, { status: 500 });
  }
}
