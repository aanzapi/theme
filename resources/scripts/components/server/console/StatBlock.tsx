// StatBlock.tsx
import React from 'react';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    background: rgba(255, 255, 255, 0.02);
    border-radius: 16px;
    padding: 1.25rem;
    border: 1px solid rgba(255, 255, 255, 0.04);
    transition: all 0.25s ease;
    position: relative;
    overflow: hidden;

    &:hover {
        background: rgba(255, 255, 255, 0.04);
        transform: translateY(-2px);
    }
`;

const StatusBar = styled.div<{ $color?: string }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    border-radius: 0 4px 4px 0;
    background: ${props => props.$color || '#3B82F6'};
`;

const IconWrapper = styled.div<{ $color?: string }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: ${props => props.$color || 'rgba(59, 130, 246, 0.12)'};
    margin-bottom: 0.75rem;
    color: ${props => props.$color || '#3B82F6'};

    svg {
        width: 20px;
        height: 20px;
    }
`;

const Title = styled.p`
    font-size: 0.7rem;
    font-weight: 500;
    color: #94A3B8;
    margin: 0 0 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.02em;
`;

const Value = styled.div`
    font-size: 1.25rem;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 1.3;
`;

export default ({ title, copyOnClick, icon, color, className, children }: StatBlockProps) => {
    const iconColor = color || 'rgba(59, 130, 246, 0.12)';
    const barColor = color || '#3B82F6';

    return (
        <CopyOnClick text={copyOnClick}>
            <Card className={className}>
                <StatusBar $color={barColor} />
                <IconWrapper $color={iconColor}>
                    <FontAwesomeIcon icon={icon} />
                </IconWrapper>
                <Title>{title}</Title>
                <Value>{children}</Value>
            </Card>
        </CopyOnClick>
    );
};