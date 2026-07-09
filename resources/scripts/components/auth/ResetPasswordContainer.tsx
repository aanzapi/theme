// ResetPasswordContainer.tsx
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import performPasswordReset from '@/api/auth/performPasswordReset';
import { httpErrorToHuman } from '@/api/http';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import { Actions, useStoreActions } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { Formik, FormikHelpers } from 'formik';
import { object, ref, string } from 'yup';
import Field from '@/components/elements/Field';
import Input from '@/components/elements/Input';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';

interface Values {
    password: string;
    passwordConfirmation: string;
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

const BackLink = styled(Link)`
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

const EmailLabel = styled.label`
    display: block;
    font-size: 0.8rem;
    font-weight: 500;
    color: #9CA3AF;
    margin-bottom: 0.4rem;
    letter-spacing: 0.02em;
`;

const EmailInput = styled(Input)`
    && {
        height: 56px;
        width: 100%;
        border-radius: 14px;
        background: #111827 !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        color: #FFFFFF !important;
        font-size: 0.95rem;
        padding: 0 18px !important;
        cursor: not-allowed;
        opacity: 0.6;

        &:focus {
            border-color: rgba(255, 255, 255, 0.08) !important;
            box-shadow: none !important;
        }
    }
`;

export default ({ match, location }: RouteComponentProps<{ token: string }>) => {
    const [email, setEmail] = useState('');

    const { clearFlashes, addFlash } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    const parsed = new URLSearchParams(location.search);
    if (email.length === 0 && parsed.get('email')) {
        setEmail(parsed.get('email') || '');
    }

    const submit = ({ password, passwordConfirmation }: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes();
        performPasswordReset(email, { token: match.params.token, password, passwordConfirmation })
            .then(() => {
                window.location = '/';
            })
            .catch((error) => {
                console.error(error);
                setSubmitting(false);
                addFlash({ type: 'error', title: 'Error', message: httpErrorToHuman(error) });
            });
    };

    return (
        <Formik
            onSubmit={submit}
            initialValues={{
                password: '',
                passwordConfirmation: '',
            }}
            validationSchema={object().shape({
                password: string()
                    .required('Password baru wajib diisi.')
                    .min(8, 'Password baru minimal 8 karakter.'),
                passwordConfirmation: string()
                    .required('Konfirmasi password wajib diisi.')
                    .oneOf([ref('password'), null], 'Konfirmasi password tidak sesuai.'),
            })}
        >
            {({ isSubmitting }) => (
                <LoginFormContainer subtitle="Buat password baru untuk akun Anda">
                    <EmailLabel>Alamat Email</EmailLabel>
                    <EmailInput value={email} isLight disabled />
                    <StyledField
                        light
                        label="Password Baru"
                        name="password"
                        type="password"
                        placeholder="Minimal 8 karakter"
                        description="Password harus terdiri dari minimal 8 karakter."
                    />
                    <StyledField
                        light
                        label="Konfirmasi Password Baru"
                        name="passwordConfirmation"
                        type="password"
                        placeholder="Masukkan ulang password"
                    />
                    <StyledButton type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
                        Reset Password
                    </StyledButton>
                    <LinksContainer>
                        <BackLink to="/auth/login">
                            Kembali ke Halaman Login
                        </BackLink>
                    </LinksContainer>
                </LoginFormContainer>
            )}
        </Formik>
    );
};
