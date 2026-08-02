// LoginCheckpointContainer.tsx
import React, { useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import loginCheckpoint from '@/api/auth/loginCheckpoint';
import { ActionCreator } from 'easy-peasy';
import { StaticContext } from 'react-router';
import { useFormikContext, withFormik } from 'formik';
import useFlash from '@/plugins/useFlash';
import { FlashStore } from '@/state/flashes';
import Button from '@/components/elements/Button';
import { Shield, Key, ArrowLeft, AlertCircle } from 'lucide-react';

interface Values {
    code: string;
    recoveryCode: '';
}

type OwnProps = RouteComponentProps<Record<string, string | undefined>, StaticContext, { token?: string }>;

type Props = OwnProps & {
    clearAndAddHttpError: ActionCreator<FlashStore['clearAndAddHttpError']['payload']>;
};

const LoginCheckpointContainer = () => {
    const { isSubmitting, setFieldValue, values, handleChange, errors, touched } = useFormikContext<Values>();
    const [isMissingDevice, setIsMissingDevice] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 relative overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
                <div className="absolute inset-0 bg-noise opacity-5"></div>
            </div>

            <div className="w-full max-w-md mx-auto px-4 relative z-10">
                <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl shadow-blue-500/10">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-30 animate-pulse-slow"></div>
                            <img 
                                src={'/assets/images/azx-logo.png'} 
                                alt="Logo" 
                                className="w-16 h-16 relative"
                            />
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/20 mb-4">
                            <Shield className="w-8 h-8 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Two-Factor Authentication</h2>
                        <p className="text-blue-200/60 text-sm">
                            {isMissingDevice 
                                ? 'Enter a recovery code to regain access' 
                                : 'Enter the verification code from your authenticator app'
                            }
                        </p>
                    </div>

                    <div className="relative mb-6 group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400/60 group-focus-within:text-blue-400 transition-colors duration-300">
                            <Key className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            name={isMissingDevice ? 'recoveryCode' : 'code'}
                            value={isMissingDevice ? values.recoveryCode : values.code}
                            onChange={handleChange}
                            placeholder={isMissingDevice ? 'Recovery Code' : 'Authentication Code'}
                            className={`w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-sm border rounded-xl text-white placeholder-blue-200/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                                ((isMissingDevice && errors.recoveryCode && touched.recoveryCode) || 
                                (!isMissingDevice && errors.code && touched.code))
                                    ? 'border-red-500/50 focus:ring-red-500' 
                                    : 'border-white/10 hover:border-white/20'
                            }`}
                            autoComplete={'one-time-code'}
                            autoFocus
                            disabled={isSubmitting}
                        />
                        {((isMissingDevice && errors.recoveryCode && touched.recoveryCode) || 
                          (!isMissingDevice && errors.code && touched.code)) && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <AlertCircle className="w-5 h-5 text-red-400" />
                            </div>
                        )}
                    </div>

                    <Button 
                        type={'submit'} 
                        size={'xlarge'} 
                        isLoading={isSubmitting} 
                        disabled={isSubmitting}
                        className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                        {isSubmitting ? 'Verifying...' : 'Verify & Continue'}
                    </Button>

                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => {
                                setFieldValue('code', '');
                                setFieldValue('recoveryCode', '');
                                setIsMissingDevice((s) => !s);
                            }}
                            className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 hover:underline"
                        >
                            {!isMissingDevice ? 'I Lost My Device' : 'I Have My Device'}
                        </button>
                    </div>

                    <div className="mt-4 text-center">
                        <Link
                            to={'/auth/login'}
                            className="inline-flex items-center gap-2 text-sm text-blue-400/60 hover:text-blue-300 transition-colors duration-200 group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                            Back to Login
                        </Link>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-[10px] text-blue-200/30">
                            &copy; 2015 - {new Date().getFullYear()} Azx Panel
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 3s ease-in-out infinite;
                }
                .bg-noise {
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
                }
            `}</style>
        </div>
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