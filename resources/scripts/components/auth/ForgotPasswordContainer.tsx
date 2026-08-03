// ForgotPasswordContainer.tsx
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import requestPasswordResetEmail from '@/api/auth/requestPasswordResetEmail';
import { httpErrorToHuman } from '@/api/http';
import { useStoreState } from 'easy-peasy';
import { Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import Button from '@/components/elements/Button';
import Reaptcha from 'reaptcha';
import useFlash from '@/plugins/useFlash';
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';

interface Values {
    email: string;
}

export default () => {
    const ref = useRef<Reaptcha>(null);
    const [token, setToken] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const { clearFlashes, addFlash } = useFlash();
    const { enabled: recaptchaEnabled, siteKey } = useStoreState((state) => state.settings.data!.recaptcha);

    useEffect(() => {
        clearFlashes();
    }, []);

    const handleSubmission = ({ email }: Values, { setSubmitting, resetForm }: FormikHelpers<Values>) => {
        clearFlashes();
        setIsSuccess(false);

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
                setIsSuccess(true);
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
        <div className="min-h-screen min-h-[100dvh] w-full flex items-center justify-center bg-[#030712] relative overflow-x-hidden overflow-y-auto">
            <div className="fixed inset-0 w-full h-full">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.1)_0%,transparent_50%)]"></div>
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
                <div className="absolute inset-0 bg-grid-pattern"></div>
                <div className="absolute inset-0 bg-noise opacity-30"></div>
            </div>

            <div className="w-full max-w-md mx-auto px-4 sm:px-6 relative z-10 py-8">
                <div className="w-full bg-white/[0.04] backdrop-blur-xl rounded-2xl p-5 sm:p-8 border border-white/10 shadow-2xl shadow-blue-500/10">
                    <FlashMessageRender className="mb-4" />

                    <Formik
                        onSubmit={handleSubmission}
                        initialValues={{ email: '' }}
                        validationSchema={object().shape({
                            email: string()
                                .email('Masukkan alamat email yang valid.')
                                .required('Alamat email wajib diisi.'),
                        })}
                    >
                        {({ isSubmitting, submitForm, values, handleChange, errors, touched }) => (
                            <div className="w-full">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
                                    <p className="text-blue-200/60 text-sm">
                                        Enter your email to receive reset instructions
                                    </p>
                                </div>

                                {isSuccess && (
                                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start space-x-3 animate-fadeIn">
                                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-green-400 font-medium">Email Sent!</p>
                                            <p className="text-xs text-green-400/60">Check your inbox for reset instructions</p>
                                        </div>
                                    </div>
                                )}

                                <div className="relative mb-6 group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400/60 group-focus-within:text-blue-400 transition-colors duration-300">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        placeholder="Email Address"
                                        className={`w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-sm border rounded-xl text-white placeholder-blue-200/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                                            errors.email && touched.email 
                                                ? 'border-red-500/50 focus:ring-red-500' 
                                                : 'border-white/10 hover:border-white/20'
                                        }`}
                                        disabled={isSubmitting || isSuccess}
                                    />
                                    {errors.email && touched.email && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <AlertCircle className="w-5 h-5 text-red-400" />
                                        </div>
                                    )}
                                    {errors.email && touched.email && (
                                        <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                                    )}
                                </div>

                                <Button 
                                    type={'submit'} 
                                    size={'xlarge'} 
                                    isLoading={isSubmitting} 
                                    disabled={isSubmitting || isSuccess}
                                    className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-0.5 transition-all duration-300 group"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <Send className="w-5 h-5" />
                                        {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                                    </span>
                                </Button>

                                <div className="mt-6 text-center">
                                    <Link
                                        to={'/auth/login'}
                                        className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 group"
                                    >
                                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                                        Back to Login
                                    </Link>
                                </div>

                                <div className="mt-6 text-center">
                                    <p className="text-[10px] text-blue-200/30">
                                        &copy; 2015 - {new Date().getFullYear()} Pterodactyl V2
                                    </p>
                                </div>

                                {recaptchaEnabled && (
                                    <Reaptcha
                                        ref={ref}
                                        size={'invisible'}
                                        sitekey={siteKey || '_invalid_key'}
                                        onVerify={(response) => {
                                            setToken(response);
                                            submitForm();
                                        }}
                                        onExpire={() => {
                                            setToken('');
                                        }}
                                    />
                                )}
                            </div>
                        )}
                    </Formik>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                .bg-grid-pattern {
                    background-image: 
                        linear-gradient(rgba(37,99,235,0.08) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(37,99,235,0.08) 1px, transparent 1px),
                        linear-gradient(rgba(37,99,235,0.04) 2px, transparent 2px),
                        linear-gradient(90deg, rgba(37,99,235,0.04) 2px, transparent 2px);
                    background-size: 60px 60px, 60px 60px, 30px 30px, 30px 30px;
                    background-position: 0 0, 0 0, 2px 2px, 2px 2px;
                }
                .bg-noise {
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
                    background-size: cover;
                }
                @media (max-width: 768px) {
                    .bg-grid-pattern {
                        background-size: 30px 30px, 30px 30px, 15px 15px, 15px 15px;
                        background-position: 0 0, 0 0, 1px 1px, 1px 1px;
                    }
                }
            `}</style>
        </div>
    );
};