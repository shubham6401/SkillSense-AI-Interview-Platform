import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

export default function GoogleLoginButton({ onGoogleSuccess, role = "candidate" }) {
    const googleButtonRef = useRef(null);
    const [loading, setLoading] = useState(false);

    // Default Client ID or environment variable
    const GOOGLE_CLIENT_ID =
        import.meta.env.VITE_GOOGLE_CLIENT_ID ||
        "1084885817294-devinterviewplatform.apps.googleusercontent.com";

    useEffect(() => {
        const handleCredentialResponse = async (response) => {
            try {
                setLoading(true);
                if (response.credential) {
                    // Decode Google JWT ID token
                    const base64Url = response.credential.split(".")[1];
                    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                    const jsonPayload = decodeURIComponent(
                        atob(base64)
                            .split("")
                            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                            .join("")
                    );
                    const googlePayload = JSON.parse(jsonPayload);

                    await onGoogleSuccess({
                        email: googlePayload.email,
                        name: googlePayload.name,
                        avatar: googlePayload.picture,
                        provider: "google",
                        role,
                    });
                }
            } catch (err) {
                console.error("Google sign-in decode error:", err);
            } finally {
                setLoading(false);
            }
        };

        const initializeGSI = () => {
            if (window.google?.accounts?.id && googleButtonRef.current) {
                try {
                    window.google.accounts.id.initialize({
                        client_id: GOOGLE_CLIENT_ID,
                        callback: handleCredentialResponse,
                        auto_select: false,
                        cancel_on_tap_outside: true,
                    });

                    // Render official Google button
                    window.google.accounts.id.renderButton(googleButtonRef.current, {
                        theme: "filled_blue",
                        size: "large",
                        text: "continue_with",
                        shape: "rectangular",
                        logo_alignment: "left",
                        width: "100%",
                    });
                } catch (e) {
                    console.warn("GSI initialization:", e.message);
                }
            }
        };

        if (window.google?.accounts?.id) {
            initializeGSI();
        } else {
            const interval = setInterval(() => {
                if (window.google?.accounts?.id) {
                    clearInterval(interval);
                    initializeGSI();
                }
            }, 300);
            return () => clearInterval(interval);
        }
    }, [GOOGLE_CLIENT_ID, onGoogleSuccess, role]);

    return (
        <div className="w-full flex justify-center">
            {loading ? (
                <div className="py-2 flex items-center justify-center gap-2 text-xs font-bold text-slate-300">
                    <Loader2 size={16} className="animate-spin text-blue-400" />
                    <span>Connecting with Google...</span>
                </div>
            ) : (
                <div ref={googleButtonRef} className="w-full min-h-[40px] flex justify-center" />
            )}
        </div>
    );
}
