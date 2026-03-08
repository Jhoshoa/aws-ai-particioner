export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                // Dark theme background colors
                cyber: {
                    bg: '#050A14',
                    card: '#0A1525',
                    border: '#1A2F45',
                    text: '#E8EDF5',
                    muted: '#8AACCA',
                },
                // Accent colors
                accent: {
                    cyan: '#00D4FF',
                    orange: '#FF6B35',
                    gold: '#FFD700',
                    green: '#00FF88',
                    pink: '#FF4D8D',
                    purple: '#A78BFA',
                },
            },
            fontFamily: {
                mono: ['DM Mono', 'Courier New', 'monospace'],
                display: ['Bebas Neue', 'sans-serif'],
                sans: ['DM Sans', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.4s ease forwards',
                pulse: 'pulse 2s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    from: { opacity: '0', transform: 'translateY(8px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
};
