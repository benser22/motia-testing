import type { Database } from "sqlite";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import type { Order, Pet } from "./types";

type Db = Database<sqlite3.Database, sqlite3.Statement>;
let dbPromise: Promise<Db> | null = null;

const DB_FILE = "./petstore.sqlite";

async function getDb(): Promise<Db> {
  if (!dbPromise) {
    dbPromise = open({
      filename: DB_FILE,
      driver: sqlite3.Database,
    });
  }
  const db = await dbPromise;
  await db.exec(
    "CREATE TABLE IF NOT EXISTS pets (id TEXT PRIMARY KEY, name TEXT NOT NULL, photoUrl TEXT NOT NULL)",
  );
  await db.exec(
    "CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, quantity INTEGER NOT NULL, petId TEXT NOT NULL, shipDate TEXT NOT NULL, status TEXT NOT NULL, complete INTEGER NOT NULL)",
  );
  return db;
}

function newId() {
  try {
    // Node 18+ or browsers
    // @ts-ignore
    return (
      (globalThis.crypto && (globalThis.crypto as any).randomUUID()) ||
      `${Date.now()}-${Math.random().toString(36).slice(2)}`
    );
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

export const petStoreService = {
  createPet: async (pet: Omit<Pet, "id">): Promise<Pet> => {
    const db = await getDb();
    const id = newId();
    const created: Pet = {
      id,
      name: pet?.name ?? "",
      photoUrl: pet?.photoUrl ?? "",
    };
    await db.run(
      "INSERT INTO pets (id, name, photoUrl) VALUES (?, ?, ?)",
      created.id,
      created.name,
      created.photoUrl,
    );
    return created;
  },
  createOrder: async (
    order: Omit<Order, "id" | "complete">,
  ): Promise<Order> => {
    const db = await getDb();
    const id = newId();
    const created: Order = {
      id,
      quantity: order.quantity ?? 1,
      petId: order.petId ?? "",
      shipDate: order.shipDate ?? new Date().toISOString(),
      status: (order as any).status ?? "placed",
      complete: false,
    } as Order;
    await db.run(
      "INSERT INTO orders (id, quantity, petId, shipDate, status, complete) VALUES (?, ?, ?, ?, ?, ?)",
      created.id,
      created.quantity,
      created.petId,
      created.shipDate,
      created.status,
      created.complete ? 1 : 0,
    );
    return created;
  },
  getPetById: async (id: string): Promise<Pet | null> => {
    const db = await getDb();
    const row = await db.get<Pet>(
      "SELECT id, name, photoUrl FROM pets WHERE id = ?",
      id,
    );
    return row ?? null;
  },
  updatePet: async (
    id: string,
    data: Partial<Omit<Pet, "id">>,
  ): Promise<Pet | null> => {
    const db = await getDb();
    const existing = await db.get<Pet>(
      "SELECT id, name, photoUrl FROM pets WHERE id = ?",
      id,
    );
    if (!existing) {
      return null;
    }
    const updated: Pet = {
      id,
      name: data.name ?? existing.name,
      photoUrl: data.photoUrl ?? existing.photoUrl,
    };
    await db.run(
      "UPDATE pets SET name = ?, photoUrl = ? WHERE id = ?",
      updated.name,
      updated.photoUrl,
      id,
    );
    return updated;
  },
  deletePet: async (id: string): Promise<{ message?: string } | any> => {
    const db = await getDb();
    const result = await db.run("DELETE FROM pets WHERE id = ?", id);
    if (result.changes && result.changes > 0) {
      return { message: "deleted" };
    }
    return { message: "not found" };
  },
  deleteAllPets: async (): Promise<{ message?: string } | any> => {
    const db = await getDb();
    const result = await db.run("DELETE FROM pets");
    return { message: `deleted ${result.changes} pets` };
  },
  findPetsByStatus: async (status: string = "available"): Promise<Pet[]> => {
    const db = await getDb();
    const rows = await db.all<Pet[]>("SELECT id, name, photoUrl FROM pets");
    return rows ?? [];
  },
};
