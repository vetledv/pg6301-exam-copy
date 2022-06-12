require('../src/mocks/matchMedia.mock')
import '@testing-library/jest-dom'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { MemoryRouter } from 'react-router-dom'
import { TextDecoder, TextEncoder } from 'util'
import * as index from '../src/index'
import { Article } from '../src/pages/Article'
import { ArticleTopic } from '../src/pages/ArticleTopic'
import { Home } from '../src/pages/Home'
import { Login } from '../src/pages/Login.tsx/Login'
import { LoginCallback } from '../src/pages/Login.tsx/LoginCallback'
import { Profile } from '../src/pages/Profile'
import { UserContext, userContextType } from '../src/UserContext'
require('whatwg-fetch')
global.TextEncoder = TextEncoder
//@ts-ignore
global.TextDecoder = TextDecoder

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

export const RenderWithUserContext = ({
    children,
    userType,
    initialEntries,
}: {
    children: ReactNode
    userType?: userContextType
    initialEntries?: string[]
}) => {
    userType = userType || 'anon'
    const setUserType = jest.fn()
    return (
        <UserContext.Provider value={{ userType, setUserType }}>
            <MemoryRouter initialEntries={initialEntries}>
                {children}
            </MemoryRouter>
        </UserContext.Provider>
    )
}

describe('Client tests', () => {
    //creds: https://stackoverflow.com/questions/71779034/jest-test-create-react-app-index-js-with-new-version-18/71798229#71798229
    test('Render without crashing', () => {
        expect(
            JSON.stringify(
                Object.assign({}, index, { _reactInternalInstance: 'censored' })
            )
        ).toMatchSnapshot()
    })

    test('Home loading', async () => {
        renderWithClient(
            <RenderWithUserContext>
                <Home />
            </RenderWithUserContext>
        )
        const loading = await screen.findByTestId('loading')
        expect(loading).toBeInTheDocument()
        await waitFor(() => {
            expect(screen.getByText(/Log in to see more/i)).toBeInTheDocument()
        })
    })

    test('Article page', async () => {
        renderWithClient(
            <RenderWithUserContext initialEntries={['/69']} userType='editor'>
                <Article />
            </RenderWithUserContext>
        )
        const loading = await screen.findByText(/Loading.../i)
        expect(loading).toBeInTheDocument()
        await waitFor(() => {
            const article = screen.getByText(/Vetle Brandth/i)
            expect(article).toBeInTheDocument()
        })
        await waitFor(() => {
            const editBtn = screen.getByText(/Edit/i)
            expect(editBtn).toBeInTheDocument()
            fireEvent.click(editBtn)
            expect(screen.getByText(/Cancel/i)).toBeInTheDocument()
        })
        await waitFor(() => {
            const headlineInput = screen.getByTestId('edit-headline')
            fireEvent.change(headlineInput, {
                target: { value: 'New headline' },
            })
            expect(headlineInput).toHaveValue('New headline')
            const bodyInput = screen.getByTestId('edit-body')
            fireEvent.change(bodyInput, {
                target: { value: 'New body' },
            })
            expect(bodyInput).toHaveValue('New body')
        })
    })

    test('NewArticleButton', async () => {
        renderWithClient(
            <RenderWithUserContext userType='editor'>
                <Home />
            </RenderWithUserContext>
        )
        await waitFor(() => {
            const newArticleBtn = screen.getByText(/New article/i)
            fireEvent.click(newArticleBtn)
            expect(screen.getByText(/Cancel/i)).toBeInTheDocument()
            const submit = screen.getByTestId('new-article-submit')
            fireEvent.click(submit)
            const errorSpans = screen.getAllByText(/This field is required/i)
            expect(errorSpans[0]).toBeInTheDocument()
        })
        await waitFor(() => {
            const newArticleBtn = screen.getByText(/New article/i)
            fireEvent.click(newArticleBtn)
            expect(screen.getByText(/Cancel/i)).toBeInTheDocument()
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
            const submit = screen.getByTestId('new-article-submit')
            fireEvent.click(submit)
            expect(screen.getByText(/Cancel/i)).toBeInTheDocument()
        })
    })

    test('Login and click login with google', async () => {
        renderWithClient(
            <RenderWithUserContext userType='anon'>
                <Login />
            </RenderWithUserContext>
        )
        //mock  window.location.href to make sure it's not redirected
        window.location.href = 'http://localhost:3000/'
        await waitFor(() => {
            fireEvent.click(screen.getByText(/Google/i))
            expect(sessionStorage.getItem('expected_state')).toBeTruthy()
        })
    })
    test('LoginCallback missing access token', async () => {
        renderWithClient(
            <RenderWithUserContext userType='anon'>
                <LoginCallback />
            </RenderWithUserContext>
        )
        await waitFor(() => {
            expect(
                screen.getByText(/Missing access_token/i)
            ).toBeInTheDocument()
        })
    })

    test('ArticleTopic page', async () => {
        // set url to /topics/News

        renderWithClient(
            <RenderWithUserContext
                initialEntries={['/topic/news']}
                userType='reader'>
                <ArticleTopic />
            </RenderWithUserContext>
        )
        //wait for loading
        await waitFor(() => {
            expect(screen.getByText(/News/i)).toBeInTheDocument()
        })
    })

    test('Profile page', async () => {
        renderWithClient(
            <RenderWithUserContext userType='editor'>
                <Profile />
            </RenderWithUserContext>
        )
        await waitFor(() => {
            expect(screen.getByText(/Vetle Brandth/i)).toBeInTheDocument()
        })
    })
})
