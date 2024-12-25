"use server"

import { db } from "@/db/(inv)/instance"
import { party } from "@/orm/(inv)/schema"
import { eq } from "drizzle-orm"

const deleteParty = async (id: string) => {
  try {
    await db.delete(party).where(eq(party.id, id))
  } catch (error) {
    console.error(error)
    throw error
  }
}

export { deleteParty }
