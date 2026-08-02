// StatBlock.tsx
import React from 'react';
import Icon from '@/components/elements/Icon';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components/macro';
import CopyOnClick from '@/components/elements/CopyOnClick';

interface StatBlockProps {
    title: string;
    copyOnClick?: string;
    color?: string | undefined;
    icon: IconDefinition;
    children: React.ReactNode;
    className?: string;
}

const Card = styled.div<{ $color?: string }>`
    background: rgba(24, 24, 27, 0.72);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border-radius: 22px;
    padding: 1.25rem;
    border: 1px solid rgba(255, 255, 255, 0.06);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    &:hover {
        transform: translateY(-3px);
        border-color: rgba(220, 38, 38, 0.3);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
    }
`;

const StatusBar = styled.div<{ $color?: string }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    border-radius: 0 4px 4px 0;
    background: ${props => props.$color || '#DC2626'};
`;

const IconWrapper = styled.div<{ $color?: string }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: ${props => props.$color || 'rgba(220, 38, 38, 0.12)'};
    color: ${props => props.$color || '#DC2626'};
    flex-shrink: 0;

    svg {
        width: 20px;
        height: 20px;
    }
`;

const Title = styled.p`
    font-size: 0.7rem;
    font-weight: 500;
    color: #A1A1AA;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.02em;
`;

const Value = styled.div`
    font-size: 1.25rem;
    font-weight: 700;
    color: #FFFFFF;
    line-height: 1.3;
`;

const Limit = styled.span`
    font-size: 0.8rem;
    color: #6B7280;
    font-weight: 400;
`;

const ProgressWrapper = styled.div`
    margin-top: 0.25rem;
`;

const ProgressBar = styled.div<{ color: string }>`
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 999px;
    overflow: hidden;
`;

const ProgressFill = styled.div<{ value: number; color: string }>`
    width: ${props => Math.min(props.value, 100)}%;
    height: 100%;
    background: ${props => props.color};
    border-radius: 999px;
    transition: width 0.6s ease;
`;

export default ({ title, copyOnClick, icon, color, className, children }: StatBlockProps) => {
    const iconColor = color || 'rgba(220, 38, 38, 0.12)';
    const barColor = color || '#DC2626';

    return (
        <CopyOnClick text={copyOnClick}>
            <Card className={className}>
                <StatusBar $color={barColor} />
                <IconWrapper $color={iconColor}>
                    <Icon icon={icon} />
                </IconWrapper>
                <Title>{title}</Title>
                <Value>{children}</Value>
            </Card>
        </CopyOnClick>
    );
};