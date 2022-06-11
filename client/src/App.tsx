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
        if (query.data?.user.microsoft) {
            setUserType('editor')
        } else if (query.data?.user.google) {
            setUserType('reader')
        } else {
            setUserType('anon')
        }
    }, [query.data?.user.microsoft, query.data?.user.google])

    if (query.isLoading || query.isFetching || query.isRefetching) {
        return (
            <BrowserRouter>
                <Layout>
                    <div className='py-2 flex justify-center lg:full xl:w-3/4'>
                        <div>Loading...</div>
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
