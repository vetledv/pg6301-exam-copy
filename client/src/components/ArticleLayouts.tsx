import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Article, useEditArticle, useUser } from '../hooks/reactQueryHooks'
import { UserContext, UserContextState } from '../UserContext'

export const ArticleLayoutHome = ({ article }: { article: Article }) => {
    const navigate = useNavigate()
    const { userType } = useContext(UserContext) as UserContextState
    const user = useUser()

    const handleClick = () => {
        if (userType === 'anon') {
            return
        } else {
            navigate(`/article/${article._id}`)
        }
    }
    const authorName = () => {
        if (user.data?.user.microsoft) {
            return user.data?.user.microsoft.name
        }
        if (user.data?.user.google) {
            return user.data?.user.google.name
        }
        return 'Anonymous'
    }

    return (
        <div
            onClick={() => handleClick()}
            className={
                'p-4 bg-secondary rounded-lg ' +
                (userType !== 'anon' ? 'cursor-pointer' : '')
            }>
            <div className='text-xl'>{article.headline}</div>
            {userType === 'anon' ? null : (
                <>
                    <div className='flex font-thin text-secondary opacity-75 justify-between'>
                        <div>{article.topic}</div>
                        <div className='flex'>
                            {authorName() === article.author
                                ? 'You'
                                : article.author}
                            <div className='px-2'> · </div>
                            {new Date(article.date).toLocaleDateString()}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export const ArticleLayoutSingle = ({ article }: { article: Article }) => {
    const { id } = useParams() as { id: string }
    const user = useUser()
    const { userType } = useContext(UserContext) as UserContextState
    const editArticle = useEditArticle(id)
    const [isEditing, setIsEditing] = useState(false)

    const [headline, setHeadline] = useState(article.headline)
    const [body, setBody] = useState(article.body)
    const [ws, setWs] = useState<WebSocket>()

    useEffect(() => {
        const socket = new WebSocket(
            window.location.origin.replace(/^http/, 'ws')
        )
        setWs(socket)
    }, [])

    const handleSubmit = () => {
        const author = article.author
        const date = article.date
        const sub = article.sub
        const topic = article.topic
        const editedArticle = {
            author,
            date,
            sub,
            headline,
            body,
            topic,
        }
        editArticle.mutate(editedArticle)
        ws!.send('new article')
        setIsEditing(false)
    }

    return (
        <div className='p-4 bg-secondary rounded-lg col-span-1 lg:col-span-3 '>
            {isEditing ? (
                <>
                    <input
                        data-testid='edit-headline'
                        onChange={(e) => setHeadline(e.target.value)}
                        value={headline}
                        className='bg-primary w-full p-2 rounded-lg'></input>
                    <div className='pt-2 flex flex-col gap-2'>
                        <textarea
                            data-testid='edit-body'
                            onChange={(e) => setBody(e.target.value)}
                            value={body}
                            className='bg-primary w-full p-2 rounded-lg'
                            rows={10}
                        />
                        {userType === 'editor' &&
                            user.data?.user.microsoft?.sub === article.sub && (
                                <div className='flex gap-2'>
                                    <button
                                        className='px-4 py-2 rounded-lg bg-cyan-600 w-fit'
                                        onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </button>
                                    <button
                                        className='px-4 py-2 rounded-lg bg-cyan-600 w-fit'
                                        onClick={() => handleSubmit()}>
                                        Submit
                                    </button>
                                </div>
                            )}
                        <div className='flex font-thin text-secondary opacity-75 justify-end'>
                            {article.author}
                            <div className='px-2'> · </div>
                            {new Date(article.date).toLocaleDateString()}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className='flex gap-2 justify-between'>
                        <div className='text-xl'>{article.headline}</div>
                        {userType === 'editor' &&
                            user.data?.user.microsoft?.sub === article.sub && (
                                <button
                                    className='px-4 py-2 rounded-lg bg-cyan-600 w-fit text-contrast dark:text-primary'
                                    onClick={() => setIsEditing(true)}>
                                    Edit
                                </button>
                            )}
                    </div>
                    {userType === 'anon' ? null : (
                        <div className='px-4 pt-2 flex flex-col gap-2'>
                            <div>{article.body}</div>
                            <div className='flex font-thin text-secondary opacity-75 justify-between'>
                                <div>{article.topic}</div>
                                <div className='flex'>
                                    {article.author}
                                    <div className='px-2'> · </div>
                                    {new Date(
                                        article.date
                                    ).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
