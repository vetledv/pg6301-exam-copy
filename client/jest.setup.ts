import { setLogger } from 'react-query'
import { server } from './src/mocks/server'

beforeAll(() => {
    server.listen({
        onUnhandledRequest({ method, url }) {
            if (!url.pathname.startsWith('/api')) {
                throw new Error(`Unhandled ${method} request to ${url}`)
            }
        },
    })
})
afterEach(async () => {
    server.resetHandlers()
})
afterAll(() => {
    server.close()
})

// suppress network errors being logged to the console for react-query
setLogger({
    log: console.log,
    warn: console.warn,
    error: () => {},
})

export const testArticle = {
    _id: '69',
    author: 'Vetle Brandth',
    body: 'Hello World',
    date: new Date('2022-05-06'),
    headline: 'Hello World',
    sub: 'dsrftygjuhrfty',
    topic: 'News',
}
export const { _id, author, body, topic } = testArticle

export const testUser = {
    config: {
        google: {
            response_type: 'token',
            authorization_endpoint:
                'https://accounts.google.com/o/oauth2/v2/auth',
            scope: 'email profile',
            userinfo_endpoint:
                'https://openidconnect.googleapis.com/v1/userinfo',
            client_id: process.env.GOOGLE_CLIENT_ID,
        },
        microsoft: {
            response_type: 'code',
            response_mode: 'fragment',
            client_id: process.env.AZURE_CLIENT_ID,
            code_challenge_method: 'S256',
            scope: 'openid User.Read',
            authorization_endpoint:
                'https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize',
            token_endpoint:
                'https://login.microsoftonline.com/organizations/oauth2/v2.0/token',
            userinfo_endpoint: 'https://graph.microsoft.com/oidc/userinfo',
        },
    },
    user: {},
}
