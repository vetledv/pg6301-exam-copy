import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export type themeState = 'dark' | 'light'
export type setThemeState = Dispatch<SetStateAction<themeState>>
export interface ThemeProps {
    colorTheme: themeState
    setTheme: setThemeState
}

//default to user system pref
const mq = window.matchMedia('(prefers-color-scheme: dark)')
const userPref = mq.matches ? 'dark' : 'light'

export const useTheme = () => {
    const [theme, setTheme] = useState<themeState>(
        localStorage.theme || userPref
    )
    const colorTheme = theme === 'dark' ? 'light' : 'dark'

    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove(colorTheme)
        root.classList.add(theme)
        localStorage.setItem('theme', theme)
    }, [theme, colorTheme])
    return [colorTheme, setTheme] as const
}
