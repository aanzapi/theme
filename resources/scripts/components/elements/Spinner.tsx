// Spinner.tsx
import React, { Suspense } from 'react';
import styled, { keyframes } from 'styled-components/macro';
import tw from 'twin.macro';
import ErrorBoundary from '@/components/elements/ErrorBoundary';

export type SpinnerSize = 'small' | 'base' | 'large';

interface Props {
    size?: SpinnerSize;
    centered?: boolean;
    isBlue?: boolean;
}

interface Spinner extends React.FC<Props> {
    Size: Record<'SMALL' | 'BASE' | 'LARGE', SpinnerSize>;
    Suspense: React.FC<Props>;
}

const spin = keyframes`
    to { transform: rotate(360deg); }
`;

const SpinnerComponent = styled.div<Props>`
    ${tw`relative`};
    
    &::before {
        content: '';
        ${tw`absolute inset-0 rounded-full blur-xl`};
        background: rgba(37, 99, 235, 0.2);
        animation: pulse 2s ease-in-out infinite;
    }
    
    &::after {
        content: '';
        ${tw`relative block rounded-full`};
        border-width: 3px;
        border-radius: 50%;
        animation: ${spin} 1s cubic-bezier(0.55, 0.25, 0.25, 0.7) infinite;
        
        ${(props) =>
            props.size === 'small'
                ? tw`w-4 h-4 border-2`
                : props.size === 'large'
                ? tw`w-16 h-16 border-[6px]`
                : tw`w-8 h-8 border-[3px]`};
        
        border-color: ${(props) => (!props.isBlue ? 'rgba(255, 255, 255, 0.1)' : 'hsla(212, 92%, 43%, 0.2)')};
        border-top-color: ${(props) => (!props.isBlue ? 'rgb(37, 99, 235)' : 'hsl(212, 92%, 43%)')};
        box-shadow: 0 0 30px rgba(37, 99, 235, 0.1);
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 0.5; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.1); }
    }
`;

const Spinner: Spinner = ({ centered, ...props }) =>
    centered ? (
        <div className={`flex items-center justify-center ${props.size === 'large' ? 'my-20' : 'my-6'}`}>
            <SpinnerComponent {...props} />
        </div>
    ) : (
        <SpinnerComponent {...props} />
    );
Spinner.displayName = 'Spinner';

Spinner.Size = {
    SMALL: 'small',
    BASE: 'base',
    LARGE: 'large',
};

Spinner.Suspense = ({ children, centered = true, size = Spinner.Size.LARGE, ...props }) => (
    <Suspense fallback={<Spinner centered={centered} size={size} {...props} />}>
        <ErrorBoundary>{children}</ErrorBoundary>
    </Suspense>
);
Spinner.Suspense.displayName = 'Spinner.Suspense';

export default Spinner;