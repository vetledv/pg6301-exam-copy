import { useLayoutEffect } from 'react'
import { useQueryClient } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { ArticleLayoutSingle } from '../components/ArticleLayouts'
import { BlueButton } from '../components/BlueButton'
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
            <BlueButton onClick={() => navigate(-1)}>Back</BlueButton>
            <ArticleLayoutSingle article={article.data} />
        </div>
    )
}
