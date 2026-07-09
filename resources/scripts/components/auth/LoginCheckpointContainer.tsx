// LoginCheckpointContainer.tsx
import React, { useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import loginCheckpoint from '@/api/auth/loginCheckpoint';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import { ActionCreator } from 'easy-peasy';
import { StaticContext } from 'react-router';
import { useFormikContext, withFormik } from 'formik';
import useFlash from '@/plugins/useFlash';
import { FlashStore } from '@/state/flashes';
import Field from '@/components/elements/Field';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';

interface Values {
    code: string;
    recoveryCode: '';
}

type OwnProps = RouteComponentProps<Record<string, string | undefined>, StaticContext, { token?: string }>;

type Props = OwnProps & {
    clearAndAddHttpError: ActionCreator<FlashStore['clearAndAddHttpError']['payload']>;
};

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
);

const KeyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
    </svg>
);

const StyledField = styled(Field)`
    && {
        input {
            height: 54px;
            border-radius: 14px;
            background: #0F172A !important;
            border: 1px solid #374151 !important;
            color: #FFFFFF !important;
            font-size: 0.95rem;
            padding-left: 44px !important;
            transition: all 0.25s ease !important;

            &:focus {
                border-color: #DC2626 !important;
                box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15) !important;
                outline: none !important;
            }

            &::placeholder {
                color: #6B7280 !important;
            }
        }
    }
`;

const InputWrapper = styled.div`
    position: relative;
    margin-bottom: 1.25rem;
`;

const IconWrapper = styled.div`
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    color: #6B7280;
    pointer-events: none;
    width: 20px;
    height: 20px;

    svg {
        width: 20px;
        height: 20px;
    }
`;

const StyledButton = styled(Button)`
    && {
        width: 100%;
        height: 54px;
        border-radius: 14px;
        background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%) !important;
        font-weight: 600;
        font-size: 1rem;
        letter-spacing: 0.01em;
        transition: all 0.25s ease !important;
        border: none !important;
        box-shadow: 0 4px 14px rgba(220, 38, 38, 0.25);

        &:hover:not(:disabled) {
            background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%) !important;
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(220, 38, 38, 0.35);
        }

        &:active:not(:disabled) {
            transform: translateY(0);
        }

        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    }
`;

const ToggleLink = styled.span`
    color: #9CA3AF;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    transition: color 0.2s ease;
    text-transform: uppercase;

    &:hover {
        color: #EF4444;
    }
`;

const BackLink = styled(Link)`
    color: #9CA3AF;
    text-decoration: none;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    transition: color 0.2s ease;
    text-transform: uppercase;

    &:hover {
        color: #EF4444;
    }
`;

const LinksContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    margin-top: 1.5rem;
`;

const LoginCheckpointContainer = () => {
    const { isSubmitting, setFieldValue } = useFormikContext<Values>();
    const [isMissingDevice, setIsMissingDevice] = useState(false);

    return (
        <LoginFormContainer subtitle="Verifikasi keamanan akun Anda">
            <InputWrapper>
                <IconWrapper>
                    {isMissingDevice ? <KeyIcon /> : <ShieldIcon />}
                </IconWrapper>
                <StyledField
                    light
                    name={isMissingDevice ? 'recoveryCode' : 'code'}
                    title={isMissingDevice ? 'Kode Pemulihan' : 'Kode Autentikasi'}
                    description={
                        isMissingDevice
                            ? 'Masukkan salah satu kode pemulihan yang dibuat saat Anda mengatur autentikasi dua faktor untuk akun ini.'
                            : 'Masukkan kode dua faktor yang dihasilkan oleh perangkat Anda.'
                    }
                    type="text"
                    placeholder={isMissingDevice ? 'Masukkan kode pemulihan' : 'Masukkan kode 6 digit'}
                    autoComplete="one-time-code"
                    autoFocus
                />
            </InputWrapper>
            <StyledButton type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
                Lanjutkan
            </StyledButton>
            <LinksContainer>
                <ToggleLink
                    onClick={() => {
                        setFieldValue('code', '');
                        setFieldValue('recoveryCode', '');
                        setIsMissingDevice((s) => !s);
                    }}
                >
                    {!isMissingDevice ? 'Perangkat Saya Hilang' : 'Saya Punya Perangkat Saya'}
                </ToggleLink>
                <BackLink to="/auth/login">
                    Kembali ke Halaman Login
                </BackLink>
            </LinksContainer>
        </LoginFormContainer>
    );
};

const EnhancedForm = withFormik<Props, Values>({
    handleSubmit: ({ code, recoveryCode }, { setSubmitting, props: { clearAndAddHttpError, location } }) => {
        loginCheckpoint(location.state?.token || '', code, recoveryCode)
            .then((response) => {
                if (response.complete) {
                    window.location = response.intended || '/';
                    return;
                }
                setSubmitting(false);
            })
            .catch((error) => {
                console.error(error);
                setSubmitting(false);
                clearAndAddHttpError({ error });
            });
    },
    mapPropsToValues: () => ({
        code: '',
        recoveryCode: '',
    }),
})(LoginCheckpointContainer);

export default ({ history, location, ...props }: OwnProps) => {
    const { clearAndAddHttpError } = useFlash();

    if (!location.state?.token) {
        history.replace('/auth/login');
        return null;
    }

    return (
        <EnhancedForm clearAndAddHttpError={clearAndAddHttpError} history={history} location={location} {...props} />
    );
};