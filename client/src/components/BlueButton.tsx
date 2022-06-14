import { FC, ReactNode } from 'react'

interface Props {
    children: ReactNode
    onClick?: () => void
    disabled?: boolean
}

export const BlueButton: FC<Props> = ({
    onClick,
    children,
    disabled = false,
}) => {
    console.log('BlueButton')
    return (
        <button
            disabled={disabled}
            className={
                (disabled
                    ? 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed '
                    : '') +
                ' px-6 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors w-fit text-contrast dark:text-primary col-span-1 lg:col-span-3 '
            }
            onClick={onClick}>
            {children}
        </button>
    )
}
