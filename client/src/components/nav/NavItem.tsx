export const NavItem = ({
    children,
    handleClick,
}: {
    children: string
    handleClick: () => void
}) => {
    return (
        <div
            className='navitem cursor-pointer select-none '
            onClick={handleClick}>
            {children}
        </div>
    )
}
