export const sha256 = async (string: string) => {
    const utf8 = new TextEncoder().encode(string)
    const binaryHash = await crypto.subtle.digest('SHA-256', utf8)
    const hash = Array.from(new Uint8Array(binaryHash))
    return btoa(String.fromCharCode.apply(null, hash))
        .split('=')[0]
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
}
