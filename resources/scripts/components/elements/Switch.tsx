// Switch.tsx
import React, { useMemo } from 'react';
import styled from 'styled-components/macro';
import { v4 } from 'uuid';
import tw from 'twin.macro';
import Label from '@/components/elements/Label';
import Input from '@/components/elements/Input';

const ToggleContainer = styled.div`
    ${tw`relative select-none w-12 leading-normal`};

    & > input[type='checkbox'] {
        ${tw`hidden`};

        &:checked + label {
            background: linear-gradient(135deg, #2563EB, #3B82F6);
            border-color: #2563EB;
            box-shadow: 0 0 20px rgba(37,99,235,0.3);
        }

        &:checked + label:before {
            right: 0.125rem;
            box-shadow: 0 2px 8px rgba(37,99,235,0.4);
        }
    }

    & > label {
        ${tw`mb-0 block overflow-hidden cursor-pointer border rounded-full h-6 shadow-inner transition-all duration-300`};
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.1);

        &::before {
            ${tw`absolute block bg-white border h-5 w-5 rounded-full transition-all duration-300`};
            top: 0.125rem;
            right: calc(50% + 0.125rem);
            content: '';
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
    }
`;

export interface SwitchProps {
    name: string;
    label?: string;
    description?: string;
    defaultChecked?: boolean;
    readOnly?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    children?: React.ReactNode;
}

const Switch = ({ name, label, description, defaultChecked, readOnly, onChange, children }: SwitchProps) => {
    const uuid = useMemo(() => v4(), []);

    return (
        <div className="flex items-center">
            <ToggleContainer className="flex-none">
                {children || (
                    <Input
                        id={uuid}
                        name={name}
                        type={'checkbox'}
                        onChange={(e) => onChange && onChange(e)}
                        defaultChecked={defaultChecked}
                        disabled={readOnly}
                    />
                )}
                <Label htmlFor={uuid} />
            </ToggleContainer>
            {(label || description) && (
                <div className="ml-4 w-full">
                    {label && (
                        <Label className={`cursor-pointer ${!!description && 'mb-0'}`} htmlFor={uuid}>
                            {label}
                        </Label>
                    )}
                    {description && <p className="text-blue-200/60 text-sm mt-2">{description}</p>}
                </div>
            )}
        </div>
    );
};

export default Switch;