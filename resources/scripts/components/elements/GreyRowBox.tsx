// GreyRowBox.tsx
import styled from 'styled-components/macro';
import tw from 'twin.macro';

export default styled.div<{ $hoverable?: boolean }>`
    background: rgba(24, 24, 27, 0.82);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 22px;
    padding: 22px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    text-decoration: none;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    overflow: hidden;

    ${(props) => props.$hoverable !== false && `
        &:hover {
            transform: translateY(-3px);
            border-color: rgba(220, 38, 38, 0.3);
            box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
        }
    `}

    & .icon {
        border-radius: 12px;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.05);
        padding: 0;
        flex-shrink: 0;
        margin-right: 1rem;
    }
`;