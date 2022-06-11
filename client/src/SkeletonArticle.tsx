import React from 'react'

const SkeletonArticle = () => {
    return (
        <div
            data-testid='loading'
            className='py-5 px-4 flex flex-col gap-3 bg-secondary rounded-lg '>
            <div className='p-3 bg-slate-50 rounded-md'></div>
            <div className='p-3 bg-slate-50 rounded-md'></div>
        </div>
    )
}

export default SkeletonArticle
