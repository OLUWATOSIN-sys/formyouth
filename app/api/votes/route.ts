import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { headers } from "next/headers";

// POST - Submit votes
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { votes, deviceId } = body;

    if (!deviceId) {
      return NextResponse.json(
        { error: "Device identification required" },
        { status: 400 }
      );
    }

    // Get additional info from headers for logging
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const forwarded = headersList.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : headersList.get("x-real-ip") || "unknown";

    const client = await clientPromise;
    const db = client.db("youthgala");

    // Get the categories being voted on
    const votedCategories = Object.keys(votes);

    // Check if this device has already voted on any of these specific categories
    const existingVotes = await db.collection("votes").find({
      deviceId
    }).toArray();

    // Check for overlapping categories
    for (const existingVote of existingVotes) {
      const existingCategories = Object.keys(existingVote.votes);
      const overlap = votedCategories.some(cat => existingCategories.includes(cat));
      
      if (overlap) {
        return NextResponse.json(
          { error: "You have already voted on some of these categories from this device." },
          { status: 429 }
        );
      }
    }

    // Save the votes
    const voteRecord = {
      votes,
      deviceId,
      ip,
      userAgent,
      timestamp: new Date()
    };

    await db.collection("votes").insertOne(voteRecord);

    return NextResponse.json({ success: true, message: "Votes submitted successfully" });
  } catch (error) {
    console.error("Error submitting votes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit votes" },
      { status: 500 }
    );
  }
}

// GET - Retrieve voting results
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("youthgala");
    
    // Get all votes
    const allVotes = await db.collection("votes").find({}).toArray();

    // Categories
    const categories = [
      "lifetime_achievement",
      "hand_of_service",
      "most_committed",
      "most_supportive",
      "most_outspoken",
      "reserved"
    ];

    // Count votes for each category
    const results: Record<string, Record<string, number>> = {};

    categories.forEach(category => {
      results[category] = {};
    });

    allVotes.forEach(voteRecord => {
      const votes = voteRecord.votes;
      Object.keys(votes).forEach(category => {
        const nominee = votes[category];
        if (!results[category][nominee]) {
          results[category][nominee] = 0;
        }
        results[category][nominee]++;
      });
    });

    // Calculate highest voted for each category
    const highestVoted: Record<string, { nominee: string; votes: number }> = {};
    
    categories.forEach(category => {
      const categoryResults = results[category];
      let maxVotes = 0;
      let topNominee = "";
      
      Object.keys(categoryResults).forEach(nominee => {
        if (categoryResults[nominee] > maxVotes) {
          maxVotes = categoryResults[nominee];
          topNominee = nominee;
        }
      });
      
      highestVoted[category] = {
        nominee: topNominee,
        votes: maxVotes
      };
    });

    return NextResponse.json({ 
      results,
      highestVoted,
      totalVotes: allVotes.length
    });
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json(
      { results: {}, highestVoted: {}, totalVotes: 0 },
      { status: 500 }
    );
  }
}
