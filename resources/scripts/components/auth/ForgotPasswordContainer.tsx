// ForgotPasswordContainer.tsx
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import requestPasswordResetEmail from '@/api/auth/requestPasswordResetEmail';
import { httpErrorToHuman } from '@/api/http';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import { useStoreState } from 'easy-peasy';
import Field from '@/components/elements/Field';
import { Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import Reaptcha from 'reaptcha';
import useFlash from '@/plugins/useFlash';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

interface Values {
    email: string;
}

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
    margin-top: 1.5rem;
`;

export default () => {
    const ref = useRef<Reaptcha>(null);
    const [token, setToken] = useState('');

    const { clearFlashes, addFlash } = useFlash();
    const { enabled: recaptchaEnabled, siteKey } = useStoreState((state) => state.settings.data!.recaptcha);

    useEffect(() => {
        clearFlashes();
    }, []);

    const handleSubmission = ({ email }: Values, { setSubmitting, resetForm }: FormikHelpers<Values>) => {
        clearFlashes();

        if (recaptchaEnabled && !token) {
            ref.current!.execute().catch((error) => {
                console.error(error);
                setSubmitting(false);
                addFlash({ type: 'error', title: 'Error', message: httpErrorToHuman(error) });
            });
            return;
        }

        requestPasswordResetEmail(email, token)
            .then((response) => {
                resetForm();
                addFlash({ type: 'success', title: 'Success', message: response });
            })
            .catch((error) => {
                console.error(error);
                addFlash({ type: 'error', title: 'Error', message: httpErrorToHuman(error) });
            })
            .then(() => {
                setToken('');
                if (ref.current) ref.current.reset();
                setSubmitting(false);
            });
    };

    return (
        <Formik
            onSubmit={handleSubmission}
            initialValues={{ email: '' }}
            validationSchema={object().shape({
                email: string()
                    .email('Masukkan alamat email yang valid.')
                    .required('Alamat email wajib diisi.'),
            })}
        >
            {({ isSubmitting, setSubmitting, submitForm }) => (
                <LoginFormContainer subtitle="Reset password akun Anda">
                    <InputWrapper>
                        <IconWrapper><EnvelopeIcon /></IconWrapper>
                        <StyledField
                            light
                            label="Alamat Email"
                            name="email"
                            type="email"
                            placeholder="Masukkan email Anda"
                            description="Masukkan alamat email akun Anda untuk menerima panduan reset password."
                        />
                    </InputWrapper>
                    <StyledButton
                        type="submit"
                        disabled={isSubmitting}
                        isLoading={isSubmitting}
                    >
                        Kirim Email
                    </StyledButton>
                    <LinksContainer>
                        <BackLink to="/auth/login">
                            Kembali ke Halaman Login
                        </BackLink>
                    </LinksContainer>
                    {recaptchaEnabled && (
                        <Reaptcha
                            ref={ref}
                            size="invisible"
                            sitekey={siteKey || '_invalid_key'}
                            onVerify={(response) => {
                                setToken(response);
                                submitForm();
                            }}
                            onExpire={() => {
                                setSubmitting(false);
                                setToken('');
                            }}
                        />
                    )}
                </LoginFormContainer>
            )}
        </Formik>
    );
};