import { useNavigate } from 'react-router-dom'
import { useMutateUser, useUser } from '../../hooks/reactQueryHooks'
import { useTheme } from '../../hooks/useTheme'
import { logoutUser } from '../../lib/fetch'
import { NavItem } from './NavItem'
import { ThemeButton } from './ThemeButton'

export const Nav = () => {
    const navigate = useNavigate()
    const [colorTheme, setTheme] = useTheme()
    const { data } = useUser()

    return (
        <nav className='fixed top-0 w-full flex justify-center px-4 h-20 z-[9999]'>
            <div className='flex items-center h-full w-full gap-4 z-[9999]'>
                <NavItem handleClick={() => navigate('/')}>Home</NavItem>
                <div className='flex justify-end items-center h-full w-full gap-4'>
                    {!data?.user || Object.keys(data?.user).length === 0 ? (
                        <NavItem handleClick={() => navigate('/login')}>
                            Login
                        </NavItem>
                    ) : (
                        <NavItem handleClick={() => navigate('/profile')}>
                            {data.user.google
                                ? `${data.user?.google?.name}`
                                : `${data.user?.microsoft?.name}`}
                        </NavItem>
                    )}
                    <div className='md:pl-20'>
                        <ThemeButton
                            colorTheme={colorTheme}
                            setTheme={setTheme}></ThemeButton>
                    </div>
                </div>
            </div>
            <div className='absolute bg-secondary w-full z-[-1000] h-full'></div>
        </nav>
    )
}
