// LoginContainer.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import login from '@/api/auth/login';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import { useStoreState } from 'easy-peasy';
import { Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import Field from '@/components/elements/Field';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import Reaptcha from 'reaptcha';
import useFlash from '@/plugins/useFlash';

interface Values {
    username: string;
    password: string;
}

const StyledField = styled(Field)`
    && {
        margin-bottom: 1.25rem;

        label {
            display: block;
            font-size: 0.8rem;
            font-weight: 500;
            color: #9CA3AF;
            margin-bottom: 0.4rem;
            letter-spacing: 0.02em;
        }

        input {
            height: 56px;
            width: 100%;
            border-radius: 14px;
            background: #111827 !important;
            border: 1px solid rgba(255, 255, 255, 0.08) !important;
            color: #FFFFFF !important;
            font-size: 0.95rem;
            padding: 0 18px !important;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
            outline: none !important;

            &::placeholder {
                color: #6B7280 !important;
            }

            &:focus {
                border-color: #DC2626 !important;
                box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.12) !important;
                outline: none !important;
            }

            &:hover:not(:focus) {
                border-color: rgba(255, 255, 255, 0.15) !important;
            }

            &:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
        }

        .error-message {
            font-size: 0.75rem;
            color: #EF4444;
            margin-top: 0.3rem;
            padding-left: 4px;
        }
    }
`;

const StyledButton = styled(Button)`
    && {
        width: 100%;
        height: 56px;
        border-radius: 14px;
        background: #DC2626 !important;
        font-weight: 600;
        font-size: 1rem;
        letter-spacing: 0.3px;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
        border: none !important;
        color: #FFFFFF !important;
        box-shadow: 0 4px 16px rgba(220, 38, 38, 0.25);

        &:hover:not(:disabled) {
            background: #EF4444 !important;
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(220, 38, 38, 0.35);
        }

        &:active:not(:disabled) {
            background: #B91C1C !important;
            transform: translateY(0);
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
        }

        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
    }
`;

const ForgotLink = styled(Link)`
    color: #9CA3AF;
    text-decoration: none;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    transition: color 0.2s ease;

    &:hover {
        color: #EF4444;
    }
`;

const LinksContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 1.5rem;
`;

const LoginContainer = ({ history }: RouteComponentProps) => {
    const ref = useRef<Reaptcha>(null);
    const [token, setToken] = useState('');

    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { enabled: recaptchaEnabled, siteKey } = useStoreState((state) => state.settings.data!.recaptcha);

    useEffect(() => {
        clearFlashes();
    }, []);

    const onSubmit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes();

        if (recaptchaEnabled && !token) {
            ref.current!.execute().catch((error) => {
                console.error(error);
                setSubmitting(false);
                clearAndAddHttpError({ error });
            });
            return;
        }

        login({ ...values, recaptchaData: token })
            .then((response) => {
                if (response.complete) {
                    window.location = response.intended || '/';
                    return;
                }
                history.replace('/auth/login/checkpoint', { token: response.confirmationToken });
            })
            .catch((error) => {
                console.error(error);
                setToken('');
                if (ref.current) ref.current.reset();
                setSubmitting(false);
                clearAndAddHttpError({ error });
            });
    };

    return (
        <Formik
            onSubmit={onSubmit}
            initialValues={{ username: '', password: '' }}
            validationSchema={object().shape({
                username: string().required('Username wajib diisi.'),
                password: string().required('Password wajib diisi.'),
            })}
        >
            {({ isSubmitting, setSubmitting, submitForm }) => (
                <LoginFormContainer subtitle="Modern Server Management Platform">
                    <StyledField
                        light
                        type="text"
                        label="Username"
                        name="username"
                        placeholder="Masukkan username"
                        disabled={isSubmitting}
                    />
                    <StyledField
                        light
                        type="password"
                        label="Password"
                        name="password"
                        placeholder="Masukkan password"
                        disabled={isSubmitting}
                    />
                    <StyledButton
                        type="submit"
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                    >
                        Masuk
                    </StyledButton>
                    <LinksContainer>
                        <ForgotLink to="/auth/password">
                            Lupa Password?
                        </ForgotLink>
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

export default LoginContainer;
