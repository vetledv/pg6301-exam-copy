const SkeletonArticle = () => {
    return (
        <div
            data-testid='loading'
            className='py-5 px-4 flex flex-col gap-3 bg-secondary rounded-lg '>
            <div className='p-3 bg-slate-50 dark:bg-slate-600 rounded-md animate-pulse'></div>
            <div className='p-3 bg-slate-50 dark:bg-slate-600 rounded-md animate-pulse'></div>
        </div>
    )
}

export default SkeletonArticle
