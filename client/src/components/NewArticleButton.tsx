import { MutableRefObject, useState } from 'react'
import { useUser } from '../hooks/reactQueryHooks'
import { useMutateArticle } from './../hooks/reactQueryHooks'
import { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

interface Inputs {
    headline: string
    body: string
    date: string
    topic: string
}

export const NewArticleButton = ({
    socket,
}: {
    socket: MutableRefObject<WebSocket | null>
}) => {
    const user = useUser()
    const form = useForm<Inputs>({
        defaultValues: {
            topic: 'Select',
            date: new Date().toISOString().slice(0, 10),
        },
    })
    const postMutate = useMutateArticle()
    const [isExpanded, setIsExpanded] = useState(false)
    const inputStyles =
        'w-full p-2 border border-secondary bg-secondary rounded-lg focus:outline-cyan-500 focus:outline focus:outline-2 '

    const handleOpen = () => {
        if (!isExpanded) setIsExpanded(true)
    }

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        if (!user.data?.user.microsoft) return
        const article = {
            author: user.data.user.microsoft.name,
            sub: user.data.user.microsoft.sub,
            ...data,
        }
        postMutate.mutate(article)
    }

    useEffect(() => {
        if (postMutate.isError) {
            setIsExpanded(true)
            window.scrollTo(0, 0)
        }
        if (postMutate.isSuccess) {
            socket?.current?.send('new article')
            setIsExpanded(false)
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
                    <form
                        className='flex flex-col gap-2'
                        onSubmit={form.handleSubmit(onSubmit)}>
                        <input
                            data-testid='new-article-headline'
                            className={inputStyles}
                            {...form.register('headline', {
                                required: true,
                            })}
                        />
                        {form.formState.errors.headline && (
                            <span>This field is required</span>
                        )}
                        <textarea
                            data-testid='new-article-body'
                            className={inputStyles}
                            rows={8}
                            {...form.register('body', {
                                required: true,
                            })}
                        />
                        {form.formState.errors.body && (
                            <span>This field is required</span>
                        )}
                        <input
                            data-testid='new-article-date'
                            type='date'
                            {...form.register('date', {
                                required: true,
                            })}
                            className={inputStyles}
                        />
                        <select
                            data-testid='new-article-topic'
                            className={inputStyles}
                            {...form.register('topic', {
                                required: true,
                                validate: (value) =>
                                    value !== 'Select'
                                        ? true
                                        : 'Select a topic',
                            })}>
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
                        {form.formState.errors.topic && (
                            <span>This field is required</span>
                        )}
                        <input data-testid='new-article-submit' type='submit' />
                    </form>
                </div>
            )}
        </div>
    )
}
