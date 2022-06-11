import randomstring from 'randomstring'
import { sha256 } from '../lib/sha256'

interface Params {
    [key: string]: string
}

export const LoginButton = ({
    config,
    label,
    provider,
    icon,
    classname,
}: {
    config: any
    label: any
    provider: 'microsoft' | 'google'
    icon?: JSX.Element
    classname?: string
}) => {
    const handleLogin = async () => {
        const {
            authorization_endpoint,
            response_type,
            scope,
            client_id,
            code_challenge_method,
        } = config[provider]

        const state = randomstring.generate({
            length: 50,
            charset: 'alphanumeric',
        })
        window.sessionStorage.setItem('expected_state', state)

        const parameters = {
            response_type,
            response_mode: 'fragment',
            client_id,
            state,
            scope,
            redirect_uri: `${window.location.origin}/login/${provider}/callback`,
        } as Params

        if (code_challenge_method) {
            const code_verifier = randomstring.generate({
                length: 50,
                charset: 'alphanumeric',
            })
            window.sessionStorage.setItem('code_verifier', code_verifier)
            parameters.domain_hint = 'egms.no'
            parameters.code_challenge_method = code_challenge_method
            parameters.code_challenge = await sha256(code_verifier)
        }

        window.location.href =
            authorization_endpoint + '?' + new URLSearchParams(parameters)
    }

    return (
        <button
            className={
                ' py-3 px-16 rounded-md bg-slate-500 text-white flex justify-center gap-2 ' +
                classname
            }
            onClick={handleLogin}>
            {icon}
            {label}
        </button>
    )
}
