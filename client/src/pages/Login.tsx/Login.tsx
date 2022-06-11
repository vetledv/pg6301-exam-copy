import { CgMicrosoft } from 'react-icons/cg'
import { FcGoogle } from 'react-icons/fc'
import { useNavigate } from 'react-router-dom'
import { LoginButton } from '../../components/LoginButton'
import { useUser } from '../../hooks/reactQueryHooks'

export const Login = () => {
    const user = useUser()
    const navigate = useNavigate()

    if (user.isLoading || !user.data) {
        return <div>Loading...</div>
    }
    if (user.isError) {
        return <div>Error: {user.error.message}</div>
    }

    return (
        <div className='flex justify-center p-6 w-full sm:w-2/3 sm:max-w-md m-auto rounded-md sm:shadow-md'>
            <div className='flex flex-col w-full gap-4'>
                <h1 className='text-lg'>Log in with:</h1>
                <div className='flex flex-col gap-2'>
                    <LoginButton
                        classname=' bg-gray-100 text-black hover:bg-gray-200 transition-colors shadow'
                        config={user.data.config}
                        label={'Google'}
                        provider={'google'}
                        icon={<FcGoogle className='h-6 w-6' />}
                    />
                    <LoginButton
                        classname='bg-[#0078D4] hover:bg-[#0062cc] transition-colors shadow'
                        config={user.data.config}
                        label={'Microsoft'}
                        provider={'microsoft'}
                        icon={<CgMicrosoft className='h-6 w-6' />}
                    />
                </div>
                <div
                    onClick={() => {
                        navigate(-1 || '/')
                    }}
                    className=' w-fit self-end cursor-pointer'>
                    Go back
                </div>
            </div>
        </div>
    )
}
