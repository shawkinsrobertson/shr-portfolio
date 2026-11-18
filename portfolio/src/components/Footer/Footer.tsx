import './Footer.css'

export interface FooterProps {
    date: number
    name: string
    socials: string[]
}

export function Footer({date, name, socials}: FooterProps) {
    return (
        <footer className='footer'>
            <p>Copyright {date} {name}</p>
            <ul>
                {socials.map((social) => (
                    <li key={social}>{social}</li>
                ))}
            </ul>
        </footer>
    )
}