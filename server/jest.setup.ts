import { TextEncoder, TextDecoder } from 'util'

const encoder = new TextEncoder()
global.TextEncoder = TextEncoder
//@ts-ignore
global.TextDecoder = TextDecoder
