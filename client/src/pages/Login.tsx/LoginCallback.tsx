import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loading } from '../../components/Loading'
import { useMutateUser, useUser } from '../../hooks/reactQueryHooks'
import { loginUser } from '../../lib/fetch'

export const LoginCallback = () => {
    const user = useUser()
    const { provider } = useParams()
    const [error, setError] = useState<string | null>(null)
    const userMutate = useMutateUser(loginUser, provider)

    useEffect(() => {
        const handleLogin = async () => {
            const { access_token, error, error_description, state, code } =
                Object.fromEntries(
                    new URLSearchParams(window.location.hash.substring(1))
                )
            const expected_state =
                window.sessionStorage.getItem('expected_state')

            if (!state || expected_state !== state) {
                setError('Invalid state')
            }
            if (error || error_description) {
                setError(`Error: ${error} (${error_description})`)
            }
            if (
                code &&
                user.data?.config &&
                provider === ('microsoft' || 'google')
            ) {
                const { client_id, token_endpoint } = user.data.config[provider]
                const code_verifier = window.sessionStorage.getItem(
                    'code_verifier'
                ) as string
                const parameters = {
                    client_id,
                    grant_type: 'authorization_code',
                    code,
                    code_verifier,
                    redirect_uri: `${window.location.origin}/login/${provider}/callback`,
                }
                const res = await fetch(token_endpoint, {
                    method: 'POST',
                    body: new URLSearchParams(parameters),
                })
                if (!res.ok) {
                    setError(`Fetch token failed ${res.status}: ${res.text()}`)
                    return
                }
                const { access_token } = await res.json()
                userMutate.mutate({ access_token })
                return
            }

            if (!access_token) {
                setError('Missing access_token')
                return
            }
            userMutate.mutate({ access_token })
        }
        handleLogin()
    }, [])

    if (error) {
        return <div>{error.toString()}</div>
    } else {
        return <Loading />
    }
}
