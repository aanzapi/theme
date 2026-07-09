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
import { LockClosedIcon, KeyIcon } from '@heroicons/react/24/outline';

interface Values {
    password: string;
    passwordConfirmation: string;
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

const EmailLabel = styled.label`
    display: block;
    font-size: 0.8rem;
    font-weight: 500;
    color: #9CA3AF;
    margin-bottom: 0.35rem;
    letter-spacing: 0.02em;
`;

const EmailInput = styled(Input)`
    && {
        height: 54px;
        border-radius: 14px;
        background: #0F172A !important;
        border: 1px solid #374151 !important;
        color: #FFFFFF !important;
        font-size: 0.95rem;
        padding: 0 1rem !important;
        cursor: not-allowed;
        opacity: 0.6;

        &:focus {
            border-color: #374151 !important;
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
                    <InputWrapper>
                        <EmailLabel>Alamat Email</EmailLabel>
                        <EmailInput value={email} isLight disabled />
                    </InputWrapper>
                    <InputWrapper>
                        <IconWrapper><LockClosedIcon /></IconWrapper>
                        <StyledField
                            light
                            label="Password Baru"
                            name="password"
                            type="password"
                            placeholder="Minimal 8 karakter"
                            description="Password harus terdiri dari minimal 8 karakter."
                        />
                    </InputWrapper>
                    <InputWrapper>
                        <IconWrapper><KeyIcon /></IconWrapper>
                        <StyledField
                            light
                            label="Konfirmasi Password Baru"
                            name="passwordConfirmation"
                            type="password"
                            placeholder="Masukkan ulang password"
                        />
                    </InputWrapper>
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