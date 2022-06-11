import { ThemeProps } from '../../hooks/useTheme'

export const ThemeButton = ({ colorTheme, setTheme }: ThemeProps) => {
    return (
        <span className='cursor-pointer' onClick={() => setTheme(colorTheme)}>
            <Circle />
        </span>
    )
}

const Circle = () => {
    return (
        <svg viewBox='0 0 50 50' className='h-6 w-6'>
            <circle cx={25} cy={25} r={24} fill='currentColor' />
        </svg>
    )
}
