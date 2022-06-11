import request from 'supertest'
import dotenv from 'dotenv'
import { app } from '../src/app'

dotenv.config()

describe('LoginRouter', () => {
    test('get', async () => {
        const res = await request(app).get('/api/login').expect(200)
        expect(res.body).toEqual({
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
                    userinfo_endpoint:
                        'https://graph.microsoft.com/oidc/userinfo',
                },
            },
            user: {},
        })
    })
})
