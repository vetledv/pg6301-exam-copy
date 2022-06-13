require('../src/mocks/matchMedia.mock')
import '@testing-library/jest-dom'
import ReactRouterDom from 'react-router-dom'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { MemoryRouter, Route, Router } from 'react-router-dom'
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

const mockUseParam = jest.fn()
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => mockUseParam,
}))

const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
            mutations: {
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
        const loading = await screen.findByTestId('loading-home')
        expect(loading).toBeInTheDocument()
        await waitFor(() => {
            expect(screen.getByText(/Log in to see more/i)).toBeInTheDocument()
        })
    })

    test('Article page edit article', async () => {
        jest.spyOn(ReactRouterDom, 'useParams').mockReturnValue({
            id: '69',
        })
        renderWithClient(
            <RenderWithUserContext userType='editor'>
                <Article />
            </RenderWithUserContext>
        )
        const loading = await screen.findByTestId('loading-spinner')
        expect(loading).toBeInTheDocument()
        await waitFor(() => {
            const article = screen.getByText(/Vetle Brandth/i)
            const editBtn = screen.getByText(/Edit/i)
            expect(article && editBtn).toBeInTheDocument()
            act(() => {
                fireEvent.click(editBtn)
            })
            expect(screen.getByText(/Cancel/i)).toBeInTheDocument()
            const headlineInput = screen.getByTestId('edit-headline')
            const bodyInput = screen.getByTestId('edit-body')
            const submitBtn = screen.getByText(/Submit/i)
            act(() => {
                fireEvent.change(headlineInput, {
                    target: { value: 'New headline' },
                })
            })
            expect(headlineInput).toHaveValue('New headline')
            act(() => {
                fireEvent.change(bodyInput, {
                    target: { value: 'New body' },
                })
            })
            expect(bodyInput).toHaveValue('New body')
            act(() => {
                fireEvent.click(submitBtn)
            })
            expect(
                screen.queryByTestId('edit-headline')
            ).not.toBeInTheDocument()
        })
    })

    test('Article page error', async () => {
        jest.spyOn(ReactRouterDom, 'useParams').mockReturnValue({
            id: '123',
        })
        renderWithClient(
            <RenderWithUserContext userType='editor'>
                <Article />
            </RenderWithUserContext>
        )
        const loading = await screen.findByTestId('loading-spinner')
        expect(loading).toBeInTheDocument()
        await waitFor(() => {
            const error = screen.getByText(/Error/i)
            expect(error).toBeInTheDocument()
        })
    })

    test('NewArticleButton error', async () => {
        renderWithClient(
            <RenderWithUserContext userType='editor'>
                <Home />
            </RenderWithUserContext>
        )

        await waitFor(() => {
            const newArticleBtn = screen.getByText(/New article/i)
            act(() => {
                fireEvent.click(newArticleBtn)
            })
            expect(screen.getByText(/Cancel/i)).toBeInTheDocument()
            const submit = screen.getByTestId('new-article-submit')
            act(() => {
                fireEvent.click(submit)
            })
            const errorSpans = screen.getAllByText(/This field is required/i)
            expect(errorSpans[0]).toBeInTheDocument()
        })
    })
    test('NewArticleButton click cancel', async () => {
        renderWithClient(
            <RenderWithUserContext userType='editor'>
                <Home />
            </RenderWithUserContext>
        )

        await waitFor(() => {
            const newArticleBtn = screen.getByText(/New article/i)
            act(() => {
                fireEvent.click(newArticleBtn)
            })
            expect(screen.getByText(/Cancel/i)).toBeInTheDocument()
            act(() => {
                fireEvent.click(screen.getByText(/Cancel/i))
            })
            expect(screen.queryByText(/Cancel/i)).not.toBeInTheDocument()
        })
    })
    // test('NewArticleButton submit', async () => {
    //     renderWithClient(
    //         <RenderWithUserContext userType='editor'>
    //             <Home />
    //         </RenderWithUserContext>
    //     )
    //     await waitFor(() => {
    //         const newArticleBtn = screen.getByText(/New article/i)
    //         fireEvent.click(newArticleBtn)
    //         expect(screen.getByText(/Cancel/i)).toBeInTheDocument()
    //         const submit = screen.getByTestId('new-article-submit')
    //         fireEvent.click(submit)
    //         const errorSpans = screen.getAllByText(/This field is required/i)
    //         expect(errorSpans[0]).toBeInTheDocument()
    //     })
    //         const newArticleBtn = screen.getByText(/New article/i)
    //         fireEvent.click(newArticleBtn)
    //         expect(screen.getByText(/Cancel/i)).toBeInTheDocument()
    //         fireEvent.change(screen.getByTestId('new-article-headline'), {
    //             target: { value: 'new headline' },
    //         })
    //         fireEvent.change(screen.getByTestId('new-article-body'), {
    //             target: { value: 'new body' },
    //         })
    //         fireEvent.change(screen.getByTestId('new-article-topic'), {
    //             target: { value: 'News' },
    //         })
    //         fireEvent.change(screen.getByTestId('new-article-date'), {
    //             target: { value: '2020-01-01' },
    //         })
    //         const submit = screen.getByTestId('new-article-submit')
    //         fireEvent.click(submit)
    // })
    test('Login and click login with google', async () => {
        renderWithClient(
            <RenderWithUserContext userType='anon'>
                <Login />
            </RenderWithUserContext>
        )
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
        jest.spyOn(ReactRouterDom, 'useParams').mockReturnValue({
            topic: 'news',
        })
        renderWithClient(
            <RenderWithUserContext userType='reader'>
                <ArticleTopic />
            </RenderWithUserContext>
        )
        await waitFor(() => {
            const newsDivs = screen.getAllByText(/News/i)
            expect(newsDivs[0]).toBeInTheDocument()
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
            expect(screen.getByText(/Log out/i)).toBeInTheDocument()
        })
    })
})
