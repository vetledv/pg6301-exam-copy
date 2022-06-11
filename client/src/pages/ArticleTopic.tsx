import { useParams } from 'react-router-dom'
import { ArticleLayoutHome } from '../components/ArticleLayouts'
import { useAllArticlesByTopic } from '../hooks/reactQueryHooks'

export const ArticleTopic = () => {
    const { topic } = useParams() as { topic: string }
    const uTopic = topic?.charAt(0).toUpperCase() + topic?.slice(1)
    const articles = useAllArticlesByTopic(topic)
    if (articles.isLoading) {
        return <div>Loading...</div>
    }
    if (articles.isError) {
        return <div>Error: {articles.error.message}</div>
    }
    if (articles.data?.length === 0) {
        return <div>No articles found</div>
    }
    return (
        <div className='flex flex-col gap-2 w-full lg:full xl:w-3/4'>
            <div className='text-xl'>{uTopic}</div>
            {articles.data &&
                articles.isSuccess &&
                articles.data
                    .slice()
                    .reverse()
                    .map((article, i) => (
                        <ArticleLayoutHome key={i} article={article} />
                    ))}
        </div>
    )
}
