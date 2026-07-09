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
import { ShieldCheckIcon, KeyIcon } from '@heroicons/react/24/outline';

interface Values {
    code: string;
    recoveryCode: '';
}

type OwnProps = RouteComponentProps<Record<string, string | undefined>, StaticContext, { token?: string }>;

type Props = OwnProps & {
    clearAndAddHttpError: ActionCreator<FlashStore['clearAndAddHttpError']['payload']>;
};

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
                    {isMissingDevice ? <KeyIcon /> : <ShieldCheckIcon />}
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