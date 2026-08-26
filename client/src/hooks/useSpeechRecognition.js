import { useState, useEffect, useRef, useCallback } from "react";

export function useSpeechRecognition() {
    const [isListening, setIsListening] = useState(false);
    const [finalTranscript, setFinalTranscript] = useState("");
    const [interimTranscript, setInterimTranscript] = useState("");
    const [isSupported, setIsSupported] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            setIsSupported(true);
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = "en-US";

            recognition.onresult = (event) => {
                let interim = "";
                let final = "";

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    const trans = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        final += trans + " ";
                    } else {
                        interim += trans;
                    }
                }

                if (final) {
                    setFinalTranscript((prev) => (prev ? `${prev} ${final.trim()}` : final.trim()));
                }
                setInterimTranscript(interim);
            };

            recognition.onerror = (event) => {
                console.warn("Speech recognition error:", event.error);
                if (event.error !== "no-speech") {
                    setIsListening(false);
                }
            };

            recognition.onend = () => {
                setIsListening(false);
                setInterimTranscript("");
            };

            recognitionRef.current = recognition;
        } else {
            setIsSupported(false);
        }

        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch {
                    // Cleanup
                }
            }
        };
    }, []);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            try {
                setFinalTranscript("");
                setInterimTranscript("");
                recognitionRef.current.start();
                setIsListening(true);
            } catch (err) {
                console.error("Failed to start speech recognition:", err);
            }
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            try {
                recognitionRef.current.stop();
                setIsListening(false);
            } catch (err) {
                console.error("Failed to stop speech recognition:", err);
            }
        }
    }, [isListening]);

    const resetTranscript = useCallback(() => {
        setFinalTranscript("");
        setInterimTranscript("");
    }, []);

    return {
        isListening,
        finalTranscript,
        interimTranscript,
        isSupported,
        startListening,
        stopListening,
        resetTranscript,
    };
}
