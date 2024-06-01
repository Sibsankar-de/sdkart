import { useEffect, useState } from "react"

const useScreenWidth = () => {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleScreen = () => {
            setScreenWidth(window.innerWidth);
        }

        window.addEventListener('resize', handleScreen)
        return () => window.removeEventListener('resize', handleScreen)
    }, [])

    return screenWidth;
}

export { useScreenWidth }