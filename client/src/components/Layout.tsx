import { FC, ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Nav } from './nav/Nav'
import { SideNav } from './SideNav'

type Props = {
    children: ReactNode
}

export const Layout: FC<Props> = ({ children }) => {
    const location = useLocation()
    return (
        <>
            {location.pathname !== '/login' ? (
                <>
                    <Nav />
                    <SideNav />
                    <main className='p-6 flex lg:ml-80 mt-20'>{children}</main>
                </>
            ) : (
                <>
                    <Nav />
                    <div className='flex h-screen p-4'>{children}</div>
                </>
            )}
        </>
    )
}
