import { Role } from "@/db/(inv)/schema"
import { createStore } from "zustand/vanilla"

export type StoreState = {
  role: Role
}

export type Actions = {
  setRole: (role: Role) => void
}

export type Store = StoreState & Actions

export const defaultInitState: StoreState = {
  role: "ADMIN",
}

export const createAppStore = (initState: StoreState = defaultInitState) => {
  return createStore<Store>()((set) => ({
    ...initState,
    setRole: (id: Role) => set({ role: id }),
  }))
}
