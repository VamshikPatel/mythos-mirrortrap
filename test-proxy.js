async function test() {
  const res = await fetch('http://localhost:3001/api/forge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      profile: {
        name: "Suresh Kumar",
        role: "CS Student",
        organization: "NMIT Bengaluru",
        recentActivity: "TechFusion hackathon",
        connection: "Prof Sharma"
      }
    })
  });

  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
test();