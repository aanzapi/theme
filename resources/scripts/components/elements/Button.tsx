// Button.tsx
import React from 'react';
import styled, { css } from 'styled-components/macro';
import tw from 'twin.macro';
import Spinner from '@/components/elements/Spinner';

interface Props {
    isLoading?: boolean;
    size?: 'xsmall' | 'small' | 'large' | 'xlarge';
    color?: 'green' | 'red' | 'primary' | 'grey';
    isSecondary?: boolean;
}

const ButtonStyle = styled.button<Omit<Props, 'isLoading'>>`
    height: 48px;
    border-radius: 14px;
    padding: 0 24px;
    font-weight: 600;
    font-size: 0.9rem;
    letter-spacing: 0.3px;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    border: 1px solid transparent;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;

    ${(props) =>
        ((!props.isSecondary && !props.color) || props.color === 'primary') &&
        css<Props>`
            background: #DC2626;
            color: #FFFFFF;
            box-shadow: 0 10px 30px rgba(220, 38, 38, 0.25);

            &:hover:not(:disabled) {
                background: #EF4444;
                transform: translateY(-2px);
                box-shadow: 0 14px 40px rgba(220, 38, 38, 0.35);
            }

            &:active:not(:disabled) {
                background: #B91C1C;
                transform: translateY(0);
                box-shadow: 0 8px 20px rgba(220, 38, 38, 0.2);
            }
        `};

    ${(props) =>
        props.color === 'grey' &&
        css`
            background: #6B7280;
            color: #FFFFFF;
            box-shadow: 0 10px 30px rgba(107, 114, 128, 0.25);

            &:hover:not(:disabled) {
                background: #9CA3AF;
                transform: translateY(-2px);
                box-shadow: 0 14px 40px rgba(107, 114, 128, 0.35);
            }

            &:active:not(:disabled) {
                background: #4B5563;
                transform: translateY(0);
            }
        `};

    ${(props) =>
        props.color === 'green' &&
        css<Props>`
            background: #22C55E;
            color: #FFFFFF;
            box-shadow: 0 10px 30px rgba(34, 197, 94, 0.25);

            &:hover:not(:disabled) {
                background: #16A34A;
                transform: translateY(-2px);
                box-shadow: 0 14px 40px rgba(34, 197, 94, 0.35);
            }

            &:active:not(:disabled) {
                background: #15803D;
                transform: translateY(0);
            }
        `};

    ${(props) =>
        props.color === 'red' &&
        css<Props>`
            background: #DC2626;
            color: #FFFFFF;
            box-shadow: 0 10px 30px rgba(220, 38, 38, 0.25);

            &:hover:not(:disabled) {
                background: #EF4444;
                transform: translateY(-2px);
                box-shadow: 0 14px 40px rgba(220, 38, 38, 0.35);
            }

            &:active:not(:disabled) {
                background: #B91C1C;
                transform: translateY(0);
            }
        `};

    ${(props) =>
        props.isSecondary &&
        css<Props>`
            background: transparent;
            color: #A1A1AA;
            border-color: rgba(255, 255, 255, 0.08);
            box-shadow: none;

            &:hover:not(:disabled) {
                background: rgba(255, 255, 255, 0.04);
                color: #FFFFFF;
                transform: translateY(-2px);
                border-color: rgba(255, 255, 255, 0.12);

                ${(props) => props.color === 'red' && `
                    background: rgba(220, 38, 38, 0.12);
                    border-color: rgba(220, 38, 38, 0.2);
                    color: #EF4444;
                `};
                ${(props) => props.color === 'primary' && `
                    background: rgba(220, 38, 38, 0.12);
                    border-color: rgba(220, 38, 38, 0.2);
                    color: #EF4444;
                `};
                ${(props) => props.color === 'green' && `
                    background: rgba(34, 197, 94, 0.12);
                    border-color: rgba(34, 197, 94, 0.2);
                    color: #22C55E;
                `};
            }

            &:active:not(:disabled) {
                transform: translateY(0);
            }
        `};

    ${(props) => props.size === 'xsmall' && `
        height: 32px;
        padding: 0 12px;
        font-size: 0.7rem;
        border-radius: 8px;
    `};
    
    ${(props) => (!props.size || props.size === 'small') && `
        height: 40px;
        padding: 0 20px;
        font-size: 0.8rem;
    `};
    
    ${(props) => props.size === 'large' && `
        height: 52px;
        padding: 0 32px;
        font-size: 1rem;
    `};
    
    ${(props) => props.size === 'xlarge' && `
        height: 56px;
        padding: 0 40px;
        font-size: 1rem;
        width: 100%;
    `};

    &:disabled {
        opacity: 0.55;
        cursor: not-allowed;
        transform: none !important;
    }
`;

type ComponentProps = Omit<JSX.IntrinsicElements['button'], 'ref' | keyof Props> & Props;

const Button: React.FC<ComponentProps> = ({ children, isLoading, ...props }) => (
    <ButtonStyle {...props}>
        {isLoading && (
            <div css={tw`flex absolute justify-center items-center w-full h-full left-0 top-0`}>
                <Spinner size={'small'} />
            </div>
        )}
        <span css={isLoading ? tw`text-transparent` : undefined}>{children}</span>
    </ButtonStyle>
);

type LinkProps = Omit<JSX.IntrinsicElements['a'], 'ref' | keyof Props> & Props;

const LinkButton: React.FC<LinkProps> = (props) => <ButtonStyle as={'a'} {...props} />;

export { LinkButton, ButtonStyle };
export default Button;