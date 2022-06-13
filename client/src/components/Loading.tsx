import { AiOutlineLoading3Quarters } from 'react-icons/ai'

export const Loading = () => {
    return (
        <div
            data-testid='loading-spinner'
            className='w-full grid grid-cols-1 lg:grid-cols-4'>
            <div className='w-full p-4 flex justify-center col-span-1 lg:col-span-3'>
                <AiOutlineLoading3Quarters className='h-6 w-6 animate-spin' />
            </div>
        </div>
    )
}
