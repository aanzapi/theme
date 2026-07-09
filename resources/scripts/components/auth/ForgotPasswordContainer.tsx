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

interface Values {
    email: string;
}

const EmailIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={2} 
        stroke="currentColor"
        width="20"
        height="20"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);

const InputWrapper = styled.div`
    position: relative;
    margin-bottom: 1.25rem;
`;

const IconWrapper = styled.div`
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    color: #9CA3AF;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;

    svg {
        width: 20px;
        height: 20px;
    }
`;

const StyledField = styled(Field)`
    && {
        margin-bottom: 0;

        label {
            display: none;
        }

        input {
            height: 54px;
            width: 100%;
            border-radius: 14px;
            background: #111827 !important;
            border: 1px solid #2A2F3A !important;
            color: #FFFFFF !important;
            font-size: 0.95rem;
            padding: 0 16px 0 52px !important;
            transition: all 0.25s ease !important;
            outline: none !important;

            &::placeholder {
                color: #6B7280 !important;
            }

            &:focus {
                border-color: #EF4444 !important;
                box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15) !important;
                outline: none !important;
            }

            &:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
        }

        .error-message {
            font-size: 0.75rem;
            color: #EF4444;
            margin-top: 4px;
            padding-left: 4px;
        }
    }
`;

const StyledButton = styled(Button)`
    && {
        width: 100%;
        height: 54px;
        border-radius: 14px;
        background: #DC2626 !important;
        font-weight: 600;
        font-size: 1rem;
        letter-spacing: 0.01em;
        transition: all 0.25s ease !important;
        border: none !important;
        color: #FFFFFF !important;
        box-shadow: 0 4px 14px rgba(220, 38, 38, 0.25);

        &:hover:not(:disabled) {
            background: #EF4444 !important;
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(220, 38, 38, 0.35);
        }

        &:active:not(:disabled) {
            transform: translateY(0);
        }

        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
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
                        <IconWrapper><EmailIcon /></IconWrapper>
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