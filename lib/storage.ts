import fs from "fs";
import path from "path";
import { SEED_PROFILES } from "./seedData";
import type { Profile } from "./seedData";

export interface SwipeRecord {
  userId: string;
  profileId: string;
  action: "like" | "pass";
  timestamp: string;
}

export type PublicProfile = Omit<Profile, "hasLikedUser">;

export interface MatchRecord {
  id: string;
  userId: string;
  profileId: string;
  profile: PublicProfile;
  matchedAt: string;
}

interface DatabaseSchema {
  profiles: Profile[];
  swipes: SwipeRecord[];
  matches: MatchRecord[];
}

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");
const CURRENT_USER_ID = "user_me";

// Ensure database directory and file exist
function getDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initialData: DatabaseSchema = {
        profiles: SEED_PROFILES,
        swipes: [],
        matches: [],
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
      return initialData;
    }
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading database:", error);
    return {
      profiles: SEED_PROFILES,
      swipes: [],
      matches: [],
    };
  }
}

function saveDb(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving database:", error);
  }
}

/**
 * Returns profiles that the current user has NOT yet swiped on.
 * PRIVACY GUARANTEE: `hasLikedUser` is stripped from every profile returned to client!
 */
export async function getFeed(userId: string = CURRENT_USER_ID): Promise<PublicProfile[]> {
  const db = getDb();
  const swipedProfileIds = new Set(
    db.swipes.filter((s) => s.userId === userId).map((s) => s.profileId)
  );

  return db.profiles
    .filter((p) => !swipedProfileIds.has(p.id))
    .map((p) => {
      // Strip hasLikedUser for privacy
      const { hasLikedUser, ...publicProfile } = p;
      return publicProfile;
    });
}

/**
 * Records a swipe (like or pass).
 * Returns whether it was a mutual match.
 */
export async function recordSwipe(
  profileId: string,
  action: "like" | "pass",
  userId: string = CURRENT_USER_ID
): Promise<{ matched: boolean; profile?: PublicProfile }> {
  const db = getDb();
  const profile = db.profiles.find((p) => p.id === profileId);

  if (!profile) {
    throw new Error(`Profile with ID ${profileId} not found`);
  }

  // Check if already swiped to avoid duplicate swipes
  const alreadySwiped = db.swipes.some(
    (s) => s.userId === userId && s.profileId === profileId
  );

  if (!alreadySwiped) {
    db.swipes.push({
      userId,
      profileId,
      action,
      timestamp: new Date().toISOString(),
    });
  }

  let isMatch = false;
  let publicProfile: PublicProfile | undefined;

  // Mutual match condition: User liked + Profile has already liked user
  if (action === "like" && profile.hasLikedUser) {
    isMatch = true;
    const { hasLikedUser, ...safeProfile } = profile;
    publicProfile = safeProfile;

    // Check if match record already exists
    const existingMatch = db.matches.find(
      (m) => m.userId === userId && m.profileId === profileId
    );

    if (!existingMatch) {
      db.matches.push({
        id: `match_${profileId}_${Date.now()}`,
        userId,
        profileId,
        profile: safeProfile,
        matchedAt: new Date().toISOString(),
      });
    }
  }

  saveDb(db);

  return {
    matched: isMatch,
    profile: isMatch ? publicProfile : undefined,
  };
}

/**
 * Returns all mutual matches for the current user.
 */
export async function getMatches(userId: string = CURRENT_USER_ID): Promise<MatchRecord[]> {
  const db = getDb();
  return db.matches
    .filter((m) => m.userId === userId)
    .sort((a, b) => new Date(b.matchedAt).getTime() - new Date(a.matchedAt).getTime());
}

/**
 * Resets swipes and matches for testing / demonstration purposes.
 */
export async function resetDemo(userId: string = CURRENT_USER_ID): Promise<void> {
  const db = getDb();
  db.swipes = db.swipes.filter((s) => s.userId !== userId);
  db.matches = db.matches.filter((m) => m.userId !== userId);
  saveDb(db);
}
