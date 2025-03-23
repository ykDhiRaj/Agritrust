import { create } from 'zustand'


const useFarmerstore = create((set) => ({
    farmer: null,
    loanhistory: [],
    addfarmer: (farmerdata) => set((state) => ({ farmer: farmerdata })),
    loanhistory: (loandata) => set(() => ({ loanhistory: loandata }))
}))


export default useFarmerstore