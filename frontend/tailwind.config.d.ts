declare const _default: {
    content: string[];
    theme: {
        extend: {
            colors: {
                cyber: {
                    bg: string;
                    card: string;
                    border: string;
                    text: string;
                    muted: string;
                };
                accent: {
                    cyan: string;
                    orange: string;
                    gold: string;
                    green: string;
                    pink: string;
                    purple: string;
                };
            };
            fontFamily: {
                mono: [string, string, string];
                display: [string, string];
                sans: [string, string];
            };
            animation: {
                'fade-in': string;
                pulse: string;
            };
            keyframes: {
                fadeIn: {
                    from: {
                        opacity: string;
                        transform: string;
                    };
                    to: {
                        opacity: string;
                        transform: string;
                    };
                };
            };
        };
    };
    plugins: never[];
};
export default _default;
