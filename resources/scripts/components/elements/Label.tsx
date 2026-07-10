// Label.tsx
import styled from 'styled-components/macro';
import tw from 'twin.macro';

const Label = styled.label<{ isLight?: boolean }>`
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #E4E4E7;
    letter-spacing: 0.3px;
    margin-bottom: 8px;
    line-height: 1.4;

    ${(props) => props.isLight && `
        color: #6B7280;
        font-weight: 500;
    `}
`;

export default Label;