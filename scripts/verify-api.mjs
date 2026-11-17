async function runVerification() {
  const baseUrl = "http://localhost:3001";
  console.log("Waiting for Next.js server to be ready on " + baseUrl + "...");

  // Wait for server to become responsive
  let ready = false;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`${baseUrl}/feed`);
      if (res.ok) {
        ready = true;
        break;
      }
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  if (!ready) {
    console.error("Server did not become ready in 30 seconds");
    process.exit(1);
  }

  console.log("✓ Server is ready!\n");

  // Step 1: POST /reset
  console.log("1. Testing POST /reset...");
  const resetRes = await fetch(`${baseUrl}/reset`, { method: "POST" });
  const resetData = await resetRes.json();
  console.log("Reset response:", resetData);

  // Step 2: GET /feed
  console.log("\n2. Testing GET /feed...");
  const feedRes = await fetch(`${baseUrl}/feed`);
  const feedData = await feedRes.json();
  console.log(`Feed count: ${feedData.count}`);

  if (!feedData.success || feedData.count < 30) {
    throw new Error(`Expected at least 30 profiles, got ${feedData.count}`);
  }

  // Step 3: Privacy check
  console.log("\n3. Verifying Coy Double-Blind Privacy Promise...");
  for (const p of feedData.profiles) {
    if (p.hasLikedUser !== undefined) {
      throw new Error(`CRITICAL PRIVACY BREACH: hasLikedUser exposed on profile ${p.id}!`);
    }
  }
  console.log("✓ PASSED: hasLikedUser is 100% hidden from the client feed.");

  // Step 4: POST /swipe (pass)
  console.log("\n4. Testing POST /swipe (pass on prof-3)...");
  const passRes = await fetch(`${baseUrl}/swipe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profileId: "prof-3", action: "pass" }),
  });
  const passData = await passRes.json();
  console.log("Pass result:", passData);
  if (passData.matched !== false) {
    throw new Error("Pass action should not trigger a match!");
  }

  // Step 5: POST /swipe (like on seeded like)
  console.log("\n5. Testing POST /swipe (like on prof-1: Ananya Sharma)...");
  const likeRes = await fetch(`${baseUrl}/swipe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profileId: "prof-1", action: "like" }),
  });
  const likeData = await likeRes.json();
  console.log("Like result:", likeData);
  if (!likeData.matched || !likeData.profile) {
    throw new Error("Expected mutual match for prof-1!");
  }
  console.log(`✓ Confirmed Mutual Match: ${likeData.profile.name}`);

  // Step 6: GET /matches
  console.log("\n6. Testing GET /matches...");
  const matchRes = await fetch(`${baseUrl}/matches`);
  const matchData = await matchRes.json();
  console.log(`Matches count: ${matchData.count}`);
  if (matchData.count !== 1 || matchData.matches[0].profile.name !== "Ananya Sharma") {
    throw new Error("Matches endpoint failed to return mutual match!");
  }
  console.log("✓ Matches correctly listed:", matchData.matches[0].profile.name);

  // Step 7: Check feed exclusion
  console.log("\n7. Checking updated feed (swiped profiles excluded)...");
  const newFeedRes = await fetch(`${baseUrl}/feed`);
  const newFeedData = await newFeedRes.json();
  console.log(`Updated feed count: ${newFeedData.count} (was ${feedData.count})`);
  const containsSwiped = newFeedData.profiles.some(
    (p) => p.id === "prof-1" || p.id === "prof-3"
  );
  if (containsSwiped) {
    throw new Error("Swiped profiles reappeared in feed!");
  }
  console.log("✓ Swiped profiles never appear again in feed.");

  // Step 8: Clean reset
  console.log("\n8. Final reset for clean demo state...");
  await fetch(`${baseUrl}/reset`, { method: "POST" });
  console.log("✓ Demo reset to initial state.\n");

  console.log("==========================================");
  console.log("🎉 ALL TESTS & REQUIREMENTS PASSED 100%!");
  console.log("==========================================");
}

runVerification().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
