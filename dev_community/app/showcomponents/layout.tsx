import LayoutComponents from './components/LayoutComponents';
import './style.css'



export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {



    return <>
        <LayoutComponents>
            {children}
        </LayoutComponents>


    </>


}
