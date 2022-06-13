import { useLayoutEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArticleLayoutSingle } from '../components/ArticleLayouts'
import { Loading } from '../components/Loading'
import { useArticle } from '../hooks/reactQueryHooks'

export const Article = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const article = useArticle(id as string)

    useLayoutEffect(() => {
        window.scrollTo(0, 0)
    }, [article])

    if (article.isError) {
        return <div>Error: {article.error.message}</div>
    }

    if (article.isLoading || !article.data) {
        return <Loading />
    }

    return (
        <div className='w-full grid grid-cols-1 lg:grid-cols-4 gap-2'>
            <button
                className='px-6 py-2 rounded-lg bg-cyan-600 w-fit text-contrast dark:text-primary col-span-1 lg:col-span-3'
                onClick={() => navigate(-1)}>
                Back
            </button>
            <ArticleLayoutSingle article={article.data} />
        </div>
    )
}
