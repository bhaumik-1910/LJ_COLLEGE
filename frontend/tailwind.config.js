/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                brand: '#5b8cff',
                brand2: '#7bffbd',
                bgdeep: '#0b1020',
                panel: '#111733',
                muted: '#9aa4bf',
                accent: '#ffc857',
            },
            boxShadow: {
                ring: '0 16px 40px -16px rgba(91,140,255,.3)'
            },
            container: {
                center: true,
                padding: '1rem',
                screens: {
                    lg: '1024px',
                    xl: '1200px',
                },
            },
        },
    },
    plugins: [],
}
