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

    * {
        box-sizing: border-box;
    }

    html,
    body {
        margin: 0;
        padding: 0;
        scroll-behavior: smooth;
    }

    body {
        ${tw`font-sans text-white`};

        background-color: #09090B;

        background-image:
            radial-gradient(circle at top, rgba(220,38,38,.12), transparent 45%),
            linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px);

        background-size:
            auto,
            40px 40px,
            40px 40px;

        background-attachment: fixed;

        color: #FFFFFF;
        letter-spacing: .015em;
        transition: background .25s ease;
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
    }

    p {
        line-height: 1.7;
        color: #A1A1AA;
    }

    a {
        color: inherit;
        text-decoration: none;
        transition: .25s;
    }

    form {
        ${tw`m-0`};
    }

    textarea,
    select,
    input,
    button,
    button:focus,
    button:focus-visible {
        ${tw`outline-none`};
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
        -webkit-appearance: none !important;
        margin: 0;
    }

    input[type=number] {
        -moz-appearance: textfield !important;
    }

    /* Scrollbar */

    ::-webkit-scrollbar {
        width: 12px;
        height: 12px;
        background: transparent;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background: rgba(220,38,38,.35);
        border-radius: 999px;
        border: 3px solid transparent;
        background-clip: padding-box;
        transition: .25s;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: rgba(239,68,68,.75);
        background-clip: padding-box;
    }

    ::-webkit-scrollbar-corner {
        background: transparent;
    }
`;
