export const postJSON = async (url: RequestInfo, object: any) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(object),
    })
    if (!res.ok) {
        throw new Error(`Failed to post ${res.status}: ${res.statusText}`)
    }
}
export const putJSON = async (url: RequestInfo, object: any) => {
    const res = await fetch(url, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(object),
    })
    if (!res.ok) {
        throw new Error(`Failed to post ${res.status}: ${res.statusText}`)
    }
}

export const fetchJSON = (url: string) => {
    return async () => {
        const res = await fetch(url)
        const data = await res.json()
        return data
    }
}

export const logoutUser = async () => {
    const res = await fetch('/api/login', { method: 'DELETE' })
    if (!res.ok) {
        throw new Error(`Failed ${res.status}: ${res.statusText}`)
    }
}
export const loginUser = async (provider: any, login: any) => {
    console.log(login)
    return await postJSON(`/api/login/${provider}`, login)
}

export const postArticle = async (article: any) => {
    return await postJSON('/api/articles', article)
}
