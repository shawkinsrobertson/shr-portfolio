import './Footer.css'

export interface FooterProps {
    date: number
    name: string
    socials: string[]
}

export function Footer({date, name, socials}: FooterProps) {
    return (
        <footer className='footer'>
            <p>`copyright ${date} ${name}`</p>
            <ul>
                <li></li> //map socials here once gathered
            </ul>
        </footer>
    )
}