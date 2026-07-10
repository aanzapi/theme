import tw from 'twin.macro';
import { createGlobalStyle } from 'styled-components/macro';
// @ts-expect-error untyped font file
import font from '@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2';

export default createGlobalStyle`
@font-face {
font-family: 'IBM Plex Sans';
font-style: normal;
font-display: swap;
font-weight: 100 700;
src: url(${font}) format('woff2-variations');
unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
}

*,  
*::before,  
*::after {  
    box-sizing: border-box;  
}  

html {  
    height: 100%;  
    scroll-behavior: smooth;  
}  

body {  
    ${tw`font-sans text-white`};  

    margin: 0;  
    min-height: 100vh;  
    color: #FFFFFF;  
    letter-spacing: .015em;  

    background: #09090B;  

    background-image:  
        linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),  
        linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px);  

    background-size:  
        48px 48px,  
        48px 48px;  

    background-attachment: fixed;  

    transition:  
        background .25s ease,  
        color .25s ease;  
}  

#app,  
#root {  
    min-height: 100vh;  
}  

::selection {  
    background: rgba(220,38,38,.35);  
    color: #FFFFFF;  
}  

h1,  
h2,  
h3,  
h4,  
h5,  
h6 {  
    ${tw`font-medium tracking-normal font-header`};  
    color: #FFFFFF;  
    margin: 0;  
}  

p {  
    color: #A1A1AA;  
    line-height: 1.7;  
}  

a {  
    color: inherit;  
    text-decoration: none;  
    transition: .25s ease;  
}  

form {  
    margin: 0;  
}  

textarea,  
select,  
input,  
button,  
button:focus,  
button:focus-visible {  
    outline: none;  
    font-family: inherit;  
}  

input,  
textarea,  
select {  
    color: #FFFFFF;  
    background: #111827;  
}  

input::placeholder,  
textarea::placeholder {  
    color: #6B7280;  
}  

input[type=number]::-webkit-inner-spin-button,  
input[type=number]::-webkit-outer-spin-button {  
    -webkit-appearance: none;  
    margin: 0;  
}  

input[type=number] {  
    -moz-appearance: textfield;  
}  

/* Scrollbar */  

::-webkit-scrollbar {  
    width: 12px;  
    height: 12px;  
}  

::-webkit-scrollbar-track {  
    background: transparent;  
}  

::-webkit-scrollbar-thumb {  
    background: rgba(220,38,38,.30);  
    border-radius: 999px;  
    border: 3px solid transparent;  
    background-clip: padding-box;  
    transition: background .25s ease;  
}  

::-webkit-scrollbar-thumb:hover {  
    background: rgba(239,68,68,.75);  
    background-clip: padding-box;  
}  

::-webkit-scrollbar-corner {  
    background: transparent;  
}  

code,  
pre {  
    font-family: "JetBrains Mono", "Fira Code", monospace;  
}

/* Fade animation for transitions */
.fade-enter {
    opacity: 0;
}

.fade-enter-active {
    opacity: 1;
    transition: opacity 150ms ease-in;
}

.fade-exit {
    opacity: 1;
}

.fade-exit-active {
    opacity: 0;
    transition: opacity 150ms ease-out;
}

/* Fade slide up animation for content */
@keyframes fadeSlideUp {
    from {
        opacity: 0;
        transform: translateY(12px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-slide-up {
    animation: fadeSlideUp 0.35s ease-out;
}
`;
