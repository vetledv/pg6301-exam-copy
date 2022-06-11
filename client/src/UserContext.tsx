import { createContext, useState } from 'react'

export type userContextType = 'anon' | 'reader' | 'editor'

export interface UserContextState {
    userType: userContextType
    setUserType: (user: userContextType) => void
}

// This context could've been done with the useUser custom hook
// to check for user object microsoft, google or {},
// but I wanted to showcase using context as well
export const UserContext = createContext<UserContextState | null>(null)

export const UserContextProvider = ({ children }: any) => {
    const [userType, setUserType] = useState<userContextType>('anon')
    return (
        <UserContext.Provider value={{ userType, setUserType }}>
            {children}
        </UserContext.Provider>
    )
}
