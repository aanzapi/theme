// ChartBlock.tsx
import React from 'react';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';

interface ChartBlockProps {
    title: string;
    legend?: React.ReactNode;
    children: React.ReactNode;
}

const Card = styled.div`
    background: rgba(24, 24, 27, 0.82);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 22px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
    overflow: hidden;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
        transform: translateY(-3px);
        border-color: rgba(220, 38, 38, 0.3);
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
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

const TitleIcon = styled(FontAwesomeIcon)`
    color: #DC2626;
    font-size: 16px;
`;

const Title = styled.h3`
    font-size: 0.85rem;
    font-weight: 600;
    color: #A1A1AA;
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
                    <TitleIcon icon={faChartLine} />
                    <Title>{title}</Title>
                </TitleWrapper>
                {legend && <LegendWrapper>{legend}</LegendWrapper>}
            </Header>
            <ChartWrapper>{children}</ChartWrapper>
        </Card>
    );
};