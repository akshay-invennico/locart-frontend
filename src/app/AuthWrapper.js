"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthWrapper({ children }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        let accessToken = null;
        try {
            const raw = localStorage.getItem("auth");
            if (raw) {
                const parsed = JSON.parse(raw);
                accessToken = parsed?.tokens?.accessToken || null;
            }
        } catch (_) { }

        const isAuthRoute = pathname?.startsWith("/auth");

        if (!accessToken && !isAuthRoute) {
            router.replace("/auth");
            return;
        }

        if (accessToken && isAuthRoute) {
            router.replace("/");
        }
    }, [pathname, router]);

    return <>{children}</>;
}
