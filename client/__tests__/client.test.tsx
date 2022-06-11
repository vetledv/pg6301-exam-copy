import '../src/mocks/matchMedia.mock'
import * as index from '../src/index'
import { QueryClient, QueryClientProvider } from 'react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Home } from '../src/pages/Home'
import { UserContext, userContextType } from '../src/UserContext'
import '@testing-library/jest-dom'
import { Article } from '../src/pages/Article'
import { server } from '../src/mocks/server'
import { rest } from 'msw'
import { testArticle } from './../jest.setup'
import {
    ArticleLayoutHome,
    ArticleLayoutSingle,
} from '../src/components/ArticleLayouts'
import { SideNav } from '../src/components/SideNav'
import { Login } from '../src/pages/Login.tsx/Login'
import { ReactNode } from 'react'
require('whatwg-fetch')

const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    })

//wrap custom hook in wrapper
export const createWrapper = () => {
    const testQueryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    })
    return ({ children }: { children: React.ReactElement }) => (
        <QueryClientProvider client={testQueryClient}>
            {children}
        </QueryClientProvider>
    )
}
//internal function used from react-query
//https://github.com/tannerlinsley/react-query/blob/ead2e5dd5237f3d004b66316b5f36af718286d2d/src/react/tests/utils.tsx#L6-L17
export const renderWithClient = (ui: React.ReactElement) => {
    const testQueryClient = createTestQueryClient()
    const { rerender, ...result } = render(
        <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
    )
    return {
        ...result,
        rerender: (rerenderUi: React.ReactElement) =>
            rerender(
                <QueryClientProvider client={testQueryClient}>
                    {rerenderUi}
                </QueryClientProvider>
            ),
    }
}

const RenderWithUserContext = ({
    children,
    userType,
}: {
    children: ReactNode
    userType?: userContextType
}) => {
    userType = userType || 'anon'
    const setUserType = jest.fn()
    return (
        <UserContext.Provider value={{ userType, setUserType }}>
            <MemoryRouter>{children}</MemoryRouter>
        </UserContext.Provider>
    )
}

describe('Test render', () => {
    //creds: https://stackoverflow.com/questions/71779034/jest-test-create-react-app-index-js-with-new-version-18/71798229#71798229
    test('Render without crashing', () => {
        expect(
            JSON.stringify(
                Object.assign({}, index, { _reactInternalInstance: 'censored' })
            )
        ).toMatchSnapshot()
    })

    test('render Home', async () => {
        renderWithClient(
            <RenderWithUserContext>
                <Home />
            </RenderWithUserContext>
        )
        const loading = await screen.findByTestId('loading')
        expect(loading).toBeInTheDocument()
    })
    test('render Article loading', async () => {
        renderWithClient(
            <RenderWithUserContext>
                <Article />
            </RenderWithUserContext>
        )
        const loading = await screen.findByText(/Loading.../i)
        expect(loading).toBeInTheDocument()
    })

    test('render Article', async () => {
        renderWithClient(
            <RenderWithUserContext>
                <Home />
            </RenderWithUserContext>
        )
        await waitFor(() => {
            expect(screen.getByText(/Log in to see more/i)).toBeInTheDocument()
        })
    })
    test('render ArticleLayoutHome', async () => {
        renderWithClient(
            <RenderWithUserContext>
                <ArticleLayoutHome article={testArticle} />
            </RenderWithUserContext>
        )
        await waitFor(() => {
            expect(screen.getByText(/Hello World/i)).toBeInTheDocument()
        })
    })
    test('render ArticleLayoutSingle', async () => {
        renderWithClient(
            <RenderWithUserContext>
                <ArticleLayoutSingle article={testArticle} />
            </RenderWithUserContext>
        )
        await waitFor(() => {
            expect(screen.getByText(/Hello World/i)).toBeInTheDocument()
        })
    })
    test('render SideNav', async () => {
        renderWithClient(
            <RenderWithUserContext>
                <SideNav />
            </RenderWithUserContext>
        )
        await waitFor(() => {
            expect(screen.getByText(/Topics/i)).toBeInTheDocument()
        })
    })
    test('render Login', async () => {
        renderWithClient(
            <RenderWithUserContext>
                <Login />
            </RenderWithUserContext>
        )
        await waitFor(() => {
            expect(screen.getByText(/Google/i)).toBeInTheDocument()
        })
    })

    test('render NewArticleButton', async () => {
        renderWithClient(
            <RenderWithUserContext userType='editor'>
                <Home />
            </RenderWithUserContext>
        )
        await waitFor(() => {
            fireEvent.click(screen.getByText(/New Article/i))
            fireEvent.change(screen.getByTestId('new-article-headline'), {
                target: { value: 'Hello World' },
            })
            fireEvent.change(screen.getByTestId('new-article-body'), {
                target: { value: 'Hello World' },
            })
            fireEvent.change(screen.getByTestId('new-article-date'), {
                target: { value: '2020-01-01' },
            })
            fireEvent.change(screen.getByTestId('new-article-topic'), {
                target: { value: 'News' },
            })

            expect(screen.getByTestId('new-article-headline')).toHaveValue(
                'Hello World'
            )
            expect(screen.getByTestId('new-article-body')).toHaveValue(
                'Hello World'
            )
            expect(screen.getByTestId('new-article-date')).toHaveValue(
                '2020-01-01'
            )
            expect(screen.getByTestId('new-article-topic')).toHaveValue('News')
        })
    })
})
