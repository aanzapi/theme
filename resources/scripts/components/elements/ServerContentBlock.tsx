// ServerContentBlock.tsx
import PageContentBlock, { PageContentBlockProps } from '@/components/elements/PageContentBlock';
import React from 'react';
import { ServerContext } from '@/state/server';
import styled from 'styled-components/macro';

interface Props extends PageContentBlockProps {
    title: string;
}

const ContentWrapper = styled.div`
    animation: fadeSlideUp 0.35s ease-out;

    @keyframes fadeSlideUp {
        from {
            opacity: 0;
            transform: translateY(12px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const ServerContentBlock: React.FC<Props> = ({ title, children, ...props }) => {
    const name = ServerContext.useStoreState((state) => state.server.data!.name);

    return (
        <PageContentBlock title={`${name} | ${title}`} {...props}>
            <ContentWrapper>
                {children}
            </ContentWrapper>
        </PageContentBlock>
    );
};

export default ServerContentBlock;