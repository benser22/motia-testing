const API_URL = process.env.API_URL || "http://localhost:3000";

async function createPet(name, photoUrl) {
  const res = await fetch(`${API_URL}/pets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      photoUrl,
    }),
  });

  const text = await res.text();

  console.log("STATUS:", res.status);
  console.log("RAW RESPONSE:", text || "<empty>");

  if (!text) {
    console.log(
      "No body returned from",
      `${API_URL}/pets`,
      "status",
      res.status,
    );
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Failed parsing response JSON:", err.message);
    return null;
  }
}

async function run() {
  console.log("Running seeder against", API_URL);
  const pets = [
    {
      name: "Fido",
      photoUrl:
        "https://unsplash.com/es/fotos/perro-de-pelo-corto-marron-con-sudadera-con-capucha-naranja-oU6KZTXhuvk",
    },
    {
      name: "Mittens",
      photoUrl:
        "https://unsplash.com/es/fotos/un-gato-gris-con-ojos-amarillos-mirando-a-lo-lejos-85BCnVwgYLY",
    },
    {
      name: "Rex",
      photoUrl:
        "https://unsplash.com/es/fotos/perro-de-pelo-corto-marron-y-blanco-9TiLF6KfadI",
    },
  ];

  for (const p of pets) {
    try {
      const created = await createPet(p.name, p.photoUrl);
      console.log("Created pet:", created.id || created.name || created);
    } catch (err) {
      console.error("Error creating pet", err);
    }
  }
  console.log("Seeder finished");
}

run();
