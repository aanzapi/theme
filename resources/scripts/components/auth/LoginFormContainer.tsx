import React, { forwardRef } from 'react';
import { Form } from 'formik';
import styled from 'styled-components/macro';
import FlashMessageRender from '@/components/FlashMessageRender';
import tw from 'twin.macro';

interface Props extends React.FormHTMLAttributes<HTMLFormElement> {
    title?: string;
    subtitle?: string;
}

const Container = styled.div`
    width: 100%;
    max-width: 440px;
    margin: 0 auto;
    padding: 1.5rem;
`;

const Card = styled.div`
    background: #18181B;
    border-radius: 22px;
    padding: 2.5rem 2.5rem 2rem;
    border: 1px solid rgba(255, 255, 255, 0.06);
    box-shadow: 
        0 25px 50px -12px rgba(0, 0, 0, 0.8),
        0 0 0 1px rgba(255, 255, 255, 0.03) inset;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    transition: box-shadow 0.3s ease;

    &:hover {
        box-shadow: 
            0 30px 60px -12px rgba(0, 0, 0, 0.9),
            0 0 0 1px rgba(255, 255, 255, 0.05) inset;
    }
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 2rem;
`;

const Logo = styled.img`
    width: 80px;
    height: 80px;
    margin: 0 auto 1.25rem;
    display: block;
`;

const Title = styled.h1`
    font-size: 1.75rem;
    font-weight: 600;
    color: #FFFFFF;
    letter-spacing: -0.02em;
    margin: 0;
    line-height: 1.2;
`;

const Subtitle = styled.p`
    font-size: 0.875rem;
    color: #9CA3AF;
    margin: 0.35rem 0 0;
    font-weight: 400;
    letter-spacing: 0.01em;
`;

const Footer = styled.div`
    text-align: center;
    margin-top: 1.5rem;
    padding-top: 1.25rem;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const FooterText = styled.p`
    font-size: 0.7rem;
    color: #6B7280;
    margin: 0;
    letter-spacing: 0.02em;
    line-height: 1.6;

    span {
        color: #9CA3AF;
    }

    a {
        color: #9CA3AF;
        text-decoration: none;
        transition: color 0.2s ease;

        &:hover {
            color: #EF4444;
        }
    }
`;

export default forwardRef<HTMLFormElement, Props>(({ title, subtitle, children, ...props }, ref) => (
    <Container>
        <Card>
            <Header>
                <Logo src="/assets/svgs/azx-logo.svg" alt="AZX Panel" />
                <Title>{title || 'AZX Panel'}</Title>
                <Subtitle>{subtitle || 'Modern Server Management Platform'}</Subtitle>
            </Header>
            <FlashMessageRender css={tw`mb-4`} />
            <Form {...props} ref={ref}>
                {children}
            </Form>
        </Card>
        <Footer>
            <FooterText>
                © {new Date().getFullYear()} <span>AZX Panel</span>
                <br />
                <a href="#" rel="noopener nofollow noreferrer" target="_blank">
                    Powered by AZX Team
                </a>
            </FooterText>
        </Footer>
    </Container>
));