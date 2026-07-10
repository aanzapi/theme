// Input.tsx
import styled, { css } from 'styled-components/macro';
import tw from 'twin.macro';

export interface Props {
    isLight?: boolean;
    hasError?: boolean;
}

const light = css<Props>`
    background: #FFFFFF;
    border-color: #E5E7EB;
    color: #111827;

    &::placeholder {
        color: #9CA3AF;
    }

    &:focus {
        border-color: #DC2626;
        box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.15);
    }

    &:disabled {
        background: #F3F4F6;
        border-color: #E5E7EB;
        opacity: 0.6;
    }
`;

const checkboxStyle = css<Props>`
    appearance: none;
    cursor: pointer;
    display: inline-block;
    vertical-align: middle;
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    border-radius: 6px;
    background: #1F2937;
    border: 2px solid rgba(255, 255, 255, 0.1);
    transition: all 0.2s ease;
    color-adjust: exact;
    background-origin: border-box;

    &:checked {
        background: #DC2626;
        border-color: #DC2626;
        background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
    }

    &:focus {
        outline: none;
        border-color: #DC2626;
        box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.15);
    }

    &:hover:not(:checked) {
        border-color: rgba(255, 255, 255, 0.2);
    }

    &[type='radio'] {
        border-radius: 50%;
    }
`;

const inputStyle = css<Props>`
    height: 54px;
    width: 100%;
    border-radius: 14px;
    background: #111827;
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #FFFFFF;
    font-size: 0.95rem;
    padding: 0 18px;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    outline: none;
    resize: none;

    &::placeholder {
        color: #6B7280;
    }

    &:focus {
        border-color: #DC2626;
        box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.15);
        outline: none;
    }

    &:hover:not(:focus):not(:disabled) {
        border-color: rgba(255, 255, 255, 0.15);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    & + .input-help {
        margin-top: 0.3rem;
        font-size: 0.75rem;
        ${(props) => (props.hasError ? 'color: #EF4444;' : 'color: #6B7280;')}
    }

    ${(props) => props.isLight && light};
    ${(props) => props.hasError && `
        border-color: #EF4444;
        box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15);
        
        &:focus {
            border-color: #EF4444;
            box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15);
        }
    `};
`;

const Input = styled.input<Props>`
    &:not([type='checkbox']):not([type='radio']) {
        ${inputStyle};
    }

    &[type='checkbox'],
    &[type='radio'] {
        ${checkboxStyle};
    }
`;

const Textarea = styled.textarea<Props>`
    ${inputStyle};
    min-height: 120px;
    padding: 18px;
    resize: vertical;
`;

export { Textarea };
export default Input;