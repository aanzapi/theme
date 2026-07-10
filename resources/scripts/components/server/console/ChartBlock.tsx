// ChartBlock.tsx
import React from 'react';
import styled from 'styled-components/macro';
import { Activity } from 'lucide-react';

interface ChartBlockProps {
    title: string;
    legend?: React.ReactNode;
    children: React.ReactNode;
}

const Card = styled.div`
    background: rgba(17, 24, 39, 0.85);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border-radius: 22px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    box-shadow: 0 18px 45px rgba(0, 0, 0, 0.45);
    overflow: hidden;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
        transform: translateY(-3px);
        border-color: rgba(255, 255, 255, 0.1);
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
    }
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem 0.75rem;
`;

const TitleWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const TitleIcon = styled(Activity)`
    width: 18px;
    height: 18px;
    color: #3B82F6;
`;

const Title = styled.h3`
    font-size: 0.85rem;
    font-weight: 600;
    color: #94A3B8;
    margin: 0;
    letter-spacing: 0.02em;
    text-transform: uppercase;
`;

const LegendWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const ChartWrapper = styled.div`
    padding: 0 1rem 1.25rem;
    min-height: 200px;
    position: relative;

    canvas {
        border-radius: 8px;
    }
`;

export default ({ title, legend, children }: ChartBlockProps) => {
    return (
        <Card>
            <Header>
                <TitleWrapper>
                    <TitleIcon />
                    <Title>{title}</Title>
                </TitleWrapper>
                {legend && <LegendWrapper>{legend}</LegendWrapper>}
            </Header>
            <ChartWrapper>{children}</ChartWrapper>
        </Card>
    );
};