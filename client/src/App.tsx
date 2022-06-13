import { useContext, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools/development'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { useUser } from './hooks/reactQueryHooks'
import { Article } from './pages/Article'
import { ArticleTopic } from './pages/ArticleTopic'
import { Home } from './pages/Home'
import { Login } from './pages/Login.tsx/Login'
import { LoginCallback } from './pages/Login.tsx/LoginCallback'
import { Profile } from './pages/Profile'
import SkeletonArticle from './SkeletonArticle'
import {
    UserContext,
    UserContextProvider,
    UserContextState,
} from './UserContext'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            keepPreviousData: true,
        },
    },
})
export const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <UserContextProvider>
                <AppRouter />
                <ReactQueryDevtools initialIsOpen={false} />
            </UserContextProvider>
        </QueryClientProvider>
    )
}

const AppRouter = () => {
    const query = useUser()
    const { setUserType } = useContext(UserContext) as UserContextState

    useEffect(() => {
        if (!query.data) {
            setUserType('anon')
        }
        if (query.data?.user.microsoft) {
            setUserType('editor')
        }
        if (query.data?.user.google) {
            setUserType('reader')
        }
    }, [query])

    if (query.isLoading || query.isFetching || query.isRefetching) {
        return (
            <BrowserRouter>
                <Layout>
                    <div className='flex flex-col gap-2 w-full lg:full xl:w-3/4'>
                        <SkeletonArticle />
                        <SkeletonArticle />
                        <SkeletonArticle />
                        <SkeletonArticle />
                        <SkeletonArticle />
                    </div>
                </Layout>
            </BrowserRouter>
        )
    }

    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path={'/'} element={<Home />}></Route>
                    <Route path={'/login/'} element={<Login />} />
                    <Route
                        path={'/login/:provider/callback'}
                        element={<LoginCallback />}
                    />
                    <Route path={'/login/*'} element={<Login />} />
                    <Route path={'/article/:id'} element={<Article />} />
                    <Route
                        path={'/articles/topic/:topic'}
                        element={<ArticleTopic />}
                    />
                    <Route path={'/profile'} element={<Profile />} />
                    <Route path='*' element={<div>404 not found</div>} />
                </Routes>
            </Layout>
        </BrowserRouter>
    )
}
