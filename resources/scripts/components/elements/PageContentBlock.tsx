// PageContentBlock.tsx
import React, { useEffect } from 'react';
import ContentContainer from '@/components/elements/ContentContainer';
import { CSSTransition } from 'react-transition-group';
import tw from 'twin.macro';
import FlashMessageRender from '@/components/FlashMessageRender';
import styled from 'styled-components/macro';

export interface PageContentBlockProps {
    title?: string;
    className?: string;
    showFlashKey?: string;
}

const PageWrapper = styled.div`
    background: #09090B;
    min-height: 100vh;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: 
            linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
        background-size: 40px 40px;
        pointer-events: none;
        z-index: 0;
    }

    &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(
            ellipse at 50% 0%,
            rgba(220, 38, 38, 0.08) 0%,
            transparent 70%
        );
        pointer-events: none;
        z-index: 0;
    }
`;

const ContentWrapper = styled.div`
    position: relative;
    z-index: 1;
    max-width: 1600px;
    margin: 0 auto;
    padding: 32px;

    @media (max-width: 1024px) {
        padding: 24px;
    }

    @media (max-width: 768px) {
        padding: 20px;
    }

    @media (max-width: 480px) {
        padding: 16px;
    }
`;

const FooterWrapper = styled.div`
    position: relative;
    z-index: 1;
    max-width: 1600px;
    margin: 0 auto;
    padding: 0 32px 24px;

    @media (max-width: 768px) {
        padding: 0 20px 20px;
    }

    @media (max-width: 480px) {
        padding: 0 16px 16px;
    }
`;

const FooterText = styled.p`
    text-align: center;
    font-size: 0.75rem;
    color: #6B7280;
    margin: 0;
    letter-spacing: 0.02em;
    line-height: 1.6;

    span {
        color: #9CA3AF;
    }

    a {
        color: #6B7280;
        text-decoration: none;
        transition: color 0.2s ease;

        &:hover {
            color: #9CA3AF;
        }
    }
`;

const PageContentBlock: React.FC<PageContentBlockProps> = ({ title, showFlashKey, className, children }) => {
    useEffect(() => {
        if (title) {
            document.title = title;
        }
    }, [title]);

    return (
        <PageWrapper>
            <CSSTransition timeout={150} classNames={'fade'} appear in>
                <>
                    <ContentWrapper className={className}>
                        {showFlashKey && <FlashMessageRender byKey={showFlashKey} css={tw`mb-4`} />}
                        {children}
                    </ContentWrapper>
                    <FooterWrapper>
                        <FooterText>
                            © {new Date().getFullYear()} <span>AZX Panel</span>
                            <br />
                            <a href="#" rel="noopener nofollow noreferrer" target="_blank">
                                Powered by AZX Team
                            </a>
                        </FooterText>
                    </FooterWrapper>
                </>
            </CSSTransition>
        </PageWrapper>
    );
};

export default PageContentBlock;