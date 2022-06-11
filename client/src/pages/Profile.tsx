import { useMutateUser, useUser } from '../hooks/reactQueryHooks'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../lib/fetch'

export const Profile = () => {
    const navigate = useNavigate()
    const user = useUser()
    const logout = useMutateUser(logoutUser)

    const handleLogout = async () => {
        logout.mutate(null)
    }

    if (user.isLoading) {
        return <div className='text-2xl font-bold py-2'>Loading...</div>
    }
    if (user.isError) {
        return (
            <div className='text-2xl font-bold py-2'>
                Error: {user.error.message}
            </div>
        )
    }
    const gUser = user.data?.user.google
    const mUser = user.data?.user.microsoft
    if (!gUser && !mUser) {
        return (
            <>
                <div className=''>Not logged in, can't access profile</div>
                <div
                    className='underline cursor-pointer py-2'
                    onClick={() => navigate('/login')}>
                    Log in here
                </div>
            </>
        )
    }

    return (
        <div className='flex items-center'>
            {gUser ? (
                <img
                    src={gUser ? gUser.picture : mUser?.picture}
                    alt={gUser ? gUser.picture : mUser?.picture}
                    className='rounded-full'></img>
            ) : (
                <CircleImage letter={mUser!.name.charAt(0)}></CircleImage>
            )}
            <div className='px-4'>
                <div>{gUser ? gUser.locale : mUser?.name}</div>
                <div>{gUser ? gUser.email : mUser?.email}</div>
            </div>
            <button onClick={handleLogout}>Log out</button>
        </div>
    )
}
const CircleImage = ({ letter }: { letter: string }) => {
    return (
        <div className='w-24 h-24 bg-blue-500 rounded-full flex justify-center items-center text-contrast dark:text-primary'>
            <div className='text-2xl'>{letter}</div>
        </div>
    )
}
