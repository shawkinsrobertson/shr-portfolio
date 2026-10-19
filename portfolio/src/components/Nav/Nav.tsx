import './Nav.css'




export function Nav(links: { label: string; href:
    string }[]) {
    return (
        <header>
            <nav>
                <ul>
                    <a href={href}><li>{label}</li></a> //map links once finished
                </ul>
            </nav>
        </header>
    )
}