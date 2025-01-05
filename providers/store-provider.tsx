// "use client"

// export type StoreApi = ReturnType<typeof createAppStore>

// export const StoreContext = createContext<StoreApi | undefined>(undefined)

// export interface StoreProviderProps {
//   children: ReactNode
//   initState?: StoreState
// }

// export const StoreProvider = ({ children, initState }: StoreProviderProps) => {
//   const storeRef = useRef<StoreApi>()
//   if (!storeRef.current) {
//     storeRef.current = createAppStore(initState)
//   }

//   return (
//     <StoreContext.Provider value={storeRef.current}>
//       {children}
//     </StoreContext.Provider>
//   )
// }

// export const useAppStore = <T,>(selector: (store: Store) => T): T => {
//   const storeContext = useContext(StoreContext)

//   if (!storeContext) {
//     throw new Error(`useAppStore must be used within CounterStoreProvider`)
//   }

//   return useStore(storeContext, selector)
// }
