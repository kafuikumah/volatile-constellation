"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            const currentScroll = window.scrollY;
            setWidth((currentScroll / totalScroll) * 100);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-[60] h-[2px]">
            <div
                className="h-full bg-accent-green transition-all duration-100 linear"
                style={{ width: `${width}%` }}
            ></div>
        </div>
    );
}
