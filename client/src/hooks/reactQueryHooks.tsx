import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { fetchJSON, postArticle, putJSON } from '../lib/fetch'

interface GoogleConfig {
    response_type: string
    authorization_endpoint: string
    scope: string
    userinfo_endpoint: string
    client_id: string
}

interface MicrosoftConfig extends GoogleConfig {
    response_mode: string
    code_challenge_method: string
    token_endpoint: string
}

interface MicrosoftUser {
    sub: string
    name: string
    family_name: string
    given_name: string
    picture: string
    email: string
}

interface GoogleUser extends MicrosoftUser {
    email_verified: boolean
    locale: string
}

export interface UseUser {
    config: {
        microsoft: MicrosoftConfig
        google: GoogleConfig
    }
    user: {
        google?: GoogleUser
        microsoft?: MicrosoftUser
    }
}

export interface UserNoConfig {
    google?: GoogleUser
    microsoft?: MicrosoftUser
}

export interface Article {
    _id?: string
    author: string
    body: string
    date: Date
    headline: string
    sub: string
    topic: string
}

export interface InfArticles {
    articles: Article[]
    next: number | null
}

export const useAllArticles = () => {
    return useQuery<Article[], Error>('articles', fetchJSON('/api/articles'))
}

export const useAllArticlesByTopic = (topic: string) => {
    return useQuery<Article[], Error>(
        ['articles', topic],
        fetchJSON('/api/articles/topic/' + topic)
    )
}

export const useArticle = (param: string) => {
    return useQuery<Article, Error>(
        ['article', param],
        fetchJSON('/api/articles/' + param)
    )
}

export const useMutateArticle = () => {
    const queryClient = useQueryClient()
    return useMutation((object: any) => postArticle(object), {
        onSuccess: () => {
            console.log('success')
            queryClient.refetchQueries('articles')
        },
    })
}

export const useEditArticle = (param: string) => {
    const queryClient = useQueryClient()
    return useMutation(
        (object: any) => putJSON(`/api/articles/${param}`, object),
        {
            onSuccess: () => {
                queryClient.refetchQueries('articles')
                queryClient.refetchQueries(['article', param])
            },
        }
    )
}

export const useUser = () => {
    return useQuery<UseUser, Error>('user', fetchJSON('/api/login'), {
        keepPreviousData: false,
        refetchOnReconnect: true,
    })
}

export const useMutateUser = (
    func: (provider?: string, object?: any) => Promise<void>,
    provider?: any
) => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    return useMutation((object?: any) => func(provider, object), {
        onSuccess: () => {
            queryClient.refetchQueries('user')
            navigate('/')
        },
    })
}

//combined to one function useMutateUser, might need to be separate later

/*export const useLoginUser = (provider: any) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    return useMutation((object: any) => loginUser(provider, object), {
        onSettled: (data, variables) => {
            queryClient.refetchQueries('user')
            navigate('/')
        },
    })
}
export const useDeleteUser = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    return useMutation((object) => logoutUser(), {
        onSettled: (data, variables) => {
            queryClient.refetchQueries('user')
            navigate('/')
        },
    })
}*/
