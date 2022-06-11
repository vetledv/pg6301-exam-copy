import { MutableRefObject, useState } from 'react'
import { useUser } from '../hooks/reactQueryHooks'
import { useMutateArticle } from './../hooks/reactQueryHooks'
import { useEffect } from 'react'

export const NewArticleButton = ({
    socket,
}: {
    socket: MutableRefObject<WebSocket | null>
}) => {
    const user = useUser()

    const [isExpanded, setIsExpanded] = useState(false)
    const [headlineError, setHeadlineError] = useState(false)
    const [headline, setHeadline] = useState('')
    const [body, setBody] = useState('')
    const [topic, setTopic] = useState('')
    const [date, setDate] = useState('')
    const postMutate = useMutateArticle()

    const inputStyles =
        'w-full p-2 border border-secondary bg-secondary rounded-lg focus:outline-cyan-500 focus:outline focus:outline-2 '

    const handleOpen = () => {
        if (!isExpanded) {
            setIsExpanded(true)
            setDate(new Date().toISOString().slice(0, 10))
            setHeadline('')
            setBody('')
            setTopic('')
        }
    }
    const checkIfValid = () => {
        if (headline === '' || body === '' || topic === '' || date === '') {
            return false
        } else return true
    }

    const handleSubmit = () => {
        console.log(checkIfValid())
        if (!checkIfValid()) return
        if (!user.data?.user.microsoft) return
        const article = {
            headline,
            body,
            topic,
            author: user.data.user.microsoft.name,
            date,
            sub: user.data.user.microsoft.sub,
        }
        postMutate.mutate(article)
    }
    useEffect(() => {
        if (postMutate.isError) {
            setHeadlineError(true)
            setIsExpanded(true)
            window.scrollTo(0, 0)
        }
        if (postMutate.isSuccess) {
            socket?.current?.send('new article')
            setIsExpanded(false)
            setDate('')
            setHeadline('')
            setBody('')
            setTopic('')
            window.scrollTo(0, 0)
        }
    }, [postMutate.isSuccess, postMutate.isError])
    return (
        <div
            onClick={() => handleOpen()}
            className={
                'px-4 py-2 flex flex-col justify-center items-center rounded-lg ' +
                (isExpanded
                    ? 'bg-secondary'
                    : 'hover:bg-cyan-700 bg-cyan-600 transition-colors cursor-pointer')
            }>
            <div
                className={
                    !isExpanded ? 'text-contrast dark:text-primary' : ''
                }>
                New article
            </div>
            {isExpanded && (
                <div className='px-2 flex flex-col gap-2 w-full'>
                    <div
                        onClick={() => setIsExpanded(false)}
                        className='bg-pink-500 flex justify-center rounded-md py-2 cursor-pointer text-contrast dark:text-primary'>
                        Cancel
                    </div>
                    {headlineError && (
                        <div className='text-red-500'>
                            Article headline already exists, please choose
                            another headline
                        </div>
                    )}
                    <div className='text-sm font-bold'>Headline</div>
                    <input
                        data-testid='new-article-headline'
                        type='text'
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        className={inputStyles}
                    />
                    <div className='text-sm font-bold'>Body</div>
                    <textarea
                        data-testid='new-article-body'
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className={inputStyles}
                        rows={10}
                    />
                    <div className='text-sm font-bold'>Date</div>
                    <input
                        data-testid='new-article-date'
                        type='date'
                        value={date}
                        onChange={(e) => {
                            console.log(e.target.value)
                            setDate(e.target.value)
                        }}
                        className={inputStyles}
                    />
                    <div className='text-sm font-bold'>Topic</div>
                    <select
                        data-testid='new-article-topic'
                        className={inputStyles}
                        defaultValue={'Select'}
                        onChange={(e) => setTopic(e.target.value)}>
                        <option
                            value='Select'
                            disabled
                            className='disabled:hidden'>
                            Select topic
                        </option>
                        <option value='News'>News</option>
                        <option value='Sports'>Sports</option>
                        <option value='Technology'>Technology</option>
                        <option value='Entertainment'>Entertainment</option>
                        <option value='Other'>Other</option>
                    </select>
                    <div
                        onClick={() => handleSubmit()}
                        className={
                            'bg-pink-500 p-2 cursor-pointer flex justify-center ' +
                            (headline === '' ||
                            body === '' ||
                            topic === '' ||
                            date === ''
                                ? 'opacity-50 cursor-default'
                                : '')
                        }>
                        Submit
                    </div>
                </div>
            )}
        </div>
    )
}
