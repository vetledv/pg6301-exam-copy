import express, { Router } from 'express'
//node-fetch v2, v3 didn't work
const fetch = require('node-fetch')

interface ObjectAny {
    [key: string]: any
}
interface AuthInfo {
    token_endpoint: string
    authorization_endpoint: string
    userinfo_endpoint: string
}

const googleConfig = async () => {
    const client_id = process.env.GOOGLE_CLIENT_ID
    const discovery_endpoint =
        'https://accounts.google.com/.well-known/openid-configuration'
    const { userinfo_endpoint, authorization_endpoint } = (await fetchJSON(
        discovery_endpoint
    )) as AuthInfo
    return {
        response_type: 'token',
        authorization_endpoint,
        scope: 'email profile',
        userinfo_endpoint,
        client_id,
    }
}

const azureConfig = async () => {
    const client_id = process.env.AZURE_CLIENT_ID
    const discovery_endpoint =
        'https://login.microsoftonline.com/organizations/v2.0/.well-known/openid-configuration'
    const { userinfo_endpoint, authorization_endpoint, token_endpoint } =
        (await fetchJSON(discovery_endpoint)) as AuthInfo
    return {
        response_type: 'code',
        response_mode: 'fragment',
        client_id,
        code_challenge_method: 'S256',
        scope: 'openid User.Read',
        authorization_endpoint,
        token_endpoint,
        userinfo_endpoint,
    }
}

const fetchJSON = async (url: string) => {
    const res = await fetch(url)
    const data = await res.json()
    if (!res.ok) throw new Error(`Failed ${res.status}`)
    return data
}

const fetchUser = async (access_token: string, config: ObjectAny) => {
    const userinfo = await fetch(config.userinfo_endpoint, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    })
    if (userinfo.ok) {
        return await userinfo.json()
    } else {
        console.log(`Failed to fetch token: ${userinfo.status}`)
        return undefined
    }
}

export const LoginRouter = express.Router()
LoginRouter.get('/', async (req, res) => {
    const config = {
        google: await googleConfig(),
        microsoft: await azureConfig(),
    }
    const response = { config, user: {} as ObjectAny }
    const { google_access_token, microsoft_access_token } = req.signedCookies
    if (google_access_token) {
        response.user.google = await fetchUser(
            google_access_token,
            config.google
        )
    }
    if (microsoft_access_token) {
        response.user.microsoft = await fetchUser(
            microsoft_access_token,
            config.microsoft
        )
    }
    res.json(response)
})

LoginRouter.post('/:provider', (req, res) => {
    const { provider } = req.params
    const { access_token } = req.body
    res.cookie(`${provider}_access_token`, access_token, { signed: true })
    res.sendStatus(200)
})

LoginRouter.post('/:provider/callback', async (req, res) => {
    const { provider } = req.params
    const { access_token, error, error_description, state, code } =
        req.body as {
            access_token: string
            error: string
            error_description: string
            state: string
            code: string
        }
    const expected_state = req.signedCookies[`${provider}_state`]

    if (!state || state !== expected_state) {
        console.log(`State mismatch: ${state} !== ${expected_state}`)
        res.sendStatus(400)
        return
    }

    if (error || error_description) {
        console.log(error, error_description)
        res.sendStatus(400)
        return
    }
    if (provider === 'microsoft') {
        const config = await azureConfig()
        const token = await fetch(config.token_endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: 'http://localhost:3000/login/callback',
                client_id: config.client_id as string,
                code_verifier: '12345678901234567890123456789012',
            }),
        })
        const { access_token } = await token.json()
        res.cookie('microsoft_access_token', access_token, {
            signed: true,
        })
        res.sendStatus(200)
    } else if (provider === 'google') {
        res.cookie('google_access_token', access_token, {
            signed: true,
        })
        res.sendStatus(200)
    }
})

LoginRouter.delete('/', (req, res) => {
    res.clearCookie('google_access_token')
    res.clearCookie('microsoft_access_token')
    res.sendStatus(200)
})
