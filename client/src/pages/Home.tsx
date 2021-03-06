import { useContext, useEffect, useRef } from 'react'
import { useInfiniteQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { ArticleLayoutHome } from '../components/ArticleLayouts'
import { LoadingB } from '../components/Loading'
import { NewArticleButton } from '../components/NewArticleButton'
import { InfArticles } from '../hooks/reactQueryHooks'
import { fetchJSON } from '../lib/fetch'
import SkeletonArticle from '../SkeletonArticle'
import { UserContext, UserContextState } from '../UserContext'

export const Home = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const socket = useRef<WebSocket | null>(null)
    const fetchPage = async ({ pageParam = 1 }) => {
        const res = await fetch(`/api/articles?page=${pageParam}`)
        const data = await res.json()
        return data
    }

    const query = useInfiniteQuery<InfArticles, Error>(
        ['articles.infinite'],
        fetchPage,
        {
            getNextPageParam: (lastPage, pages) => lastPage.next,
        }
    )
    const { userType } = useContext(UserContext) as UserContextState

    const onHover = (id: string) => {
        queryClient.prefetchQuery(['article', id], {
            queryFn: fetchJSON('/api/articles/' + id),
            staleTime: 1000 * 60 * 1,
        })
    }

    useEffect(() => {
        socket.current = new WebSocket(
            window.location.origin.replace(/^http/, 'ws')
        )
        socket.current.onopen = () => {
            console.log('socket opened')
        }
        socket.current.onmessage = () => {
            query.refetch()
        }
        socket.current.onclose = () => {
            console.log('socket closed')
        }
        const currSocket = socket.current
        return () => {
            currSocket.close()
        }
    }, [])

    if (query.isLoading || !query.data) {
        return (
            <div
                data-testid='loading-home'
                className='flex flex-col gap-2 w-full lg:full xl:w-3/4'>
                <SkeletonArticle />
                <SkeletonArticle />
                <SkeletonArticle />
                <SkeletonArticle />
                <SkeletonArticle />
            </div>
        )
    }

    if (query.isError) {
        return <div className=' py-2'>Error: {query.error.message}</div>
    }

    return (
        <div
            ref={null}
            className='gap-2 w-full grid grid-cols-1 lg:grid-cols-4'>
            {userType === 'editor' && (
                <div className='  col-span-1 lg:col-span-3 '>
                    <NewArticleButton socket={socket} />
                </div>
            )}
            {userType === 'anon' && (
                <div className='col-span-1 lg:col-span-3'>
                    <div
                        data-testid='login-button-home'
                        className=' w-fit px-4 py-2 rounded-lg bg-secondary cursor-pointer'
                        onClick={() => navigate('/login')}>
                        Log in to see more
                    </div>
                </div>
            )}
            {query.data.pages.map((page) =>
                page.articles.map((article, i) => (
                    <div
                        key={i}
                        className='col-span-1 lg:col-span-3'
                        onMouseEnter={() => {
                            onHover(article._id)
                        }}>
                        <ArticleLayoutHome article={article} />
                    </div>
                ))
            )}
            <div className='col-span-1 lg:col-span-3'>
                {!query.isFetchingNextPage && query.hasNextPage ? (
                    <button
                        className='w-full px-4 py-2 rounded-lg bg-secondary cursor-pointer'
                        onClick={() => {
                            if (query.hasNextPage) {
                                query.fetchNextPage()
                            }
                        }}>
                        Load more
                    </button>
                ) : null}
                {query.isFetchingNextPage && <LoadingB />}
            </div>
        </div>
    )
}
