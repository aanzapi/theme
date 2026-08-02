// LoginContainer.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import login from '@/api/auth/login';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import { useStoreState } from 'easy-peasy';
import { Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import Button from '@/components/elements/Button';
import Reaptcha from 'reaptcha';
import useFlash from '@/plugins/useFlash';
import { 
  User, 
  Lock, 
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Cloud,
  AlertCircle
} from 'lucide-react';

interface Values {
    username: string;
    password: string;
}

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
                <div className="absolute inset-0 bg-noise opacity-5"></div>
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            </div>

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[90vh]">
                    {/* Left Hero Section */}
                    <div className="hidden lg:flex flex-col space-y-8 text-white animate-fadeInLeft">
                        <div className="inline-flex items-center space-x-2 bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-full px-4 py-2 w-fit animate-pulse-slow">
                            <Sparkles className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-medium text-blue-400">Next Generation Hosting Platform</span>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-6xl font-bold leading-tight">
                                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                                    Pterodactyl
                                </span>
                                <br />
                                <span className="text-white">V2</span>
                            </h1>
                            <p className="text-xl text-blue-200/80 font-light leading-relaxed">
                                Experience the fastest, safest and most modern
                                <br />
                                game server management platform.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-6 pt-4">
                            {[
                                { icon: Zap, title: 'High Performance', desc: 'Optimized for speed' },
                                { icon: Shield, title: 'Enterprise Security', desc: 'Bank-grade protection' },
                                { icon: Cloud, title: 'Cloud Infrastructure', desc: 'Global availability' }
                            ].map((feature, index) => (
                                <div 
                                    key={index}
                                    className="group relative overflow-hidden rounded-2xl p-6 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-500/40 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-blue-600/10 transition-all duration-500"></div>
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                            <feature.icon className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-white mb-1">{feature.title}</h3>
                                        <p className="text-xs text-blue-200/60">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center space-x-12 pt-6 border-t border-white/10">
                            {[
                                { value: '99.9%', label: 'Uptime Guarantee' },
                                { value: '24/7', label: 'Premium Support' },
                                { value: '10K+', label: 'Servers Deployed' }
                            ].map((stat, index) => (
                                <div key={index} className="group">
                                    <p className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">{stat.value}</p>
                                    <p className="text-xs text-blue-200/60">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Login Card */}
                    <div className="flex justify-center items-center animate-fadeInRight">
                        <Formik
                            onSubmit={onSubmit}
                            initialValues={{ username: '', password: '' }}
                            validationSchema={object().shape({
                                username: string().required('Username wajib diisi.'),
                                password: string().required('Password wajib diisi.'),
                            })}
                        >
                            {({ isSubmitting, setSubmitting, submitForm, values, handleChange, errors, touched }) => (
                                <LoginFormContainer>
                                    <div className="flex justify-center mb-6">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-30 animate-pulse-slow"></div>
                                            <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                                            <img 
                                                src={'/assets/images/azx-logo.png'} 
                                                alt="Logo" 
                                                className="w-20 h-20 relative"
                                            />
                                        </div>
                                    </div>

                                    <div className="text-center mb-8">
                                        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                                        <p className="text-blue-200/60 text-sm">Sign in to continue managing your servers.</p>
                                    </div>

                                    <div className="relative mb-5 group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400/60 group-focus-within:text-blue-400 transition-colors duration-300">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="text"
                                            name="username"
                                            value={values.username}
                                            onChange={handleChange}
                                            placeholder="Username"
                                            className={`w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-sm border rounded-xl text-white placeholder-blue-200/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                                                errors.username && touched.username 
                                                    ? 'border-red-500/50 focus:ring-red-500' 
                                                    : 'border-white/10 hover:border-white/20'
                                            }`}
                                            disabled={isSubmitting}
                                        />
                                        {errors.username && touched.username && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <AlertCircle className="w-5 h-5 text-red-400" />
                                            </div>
                                        )}
                                        {errors.username && touched.username && (
                                            <p className="mt-1 text-xs text-red-400">{errors.username}</p>
                                        )}
                                    </div>

                                    <div className="relative mb-5 group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400/60 group-focus-within:text-blue-400 transition-colors duration-300">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="password"
                                            name="password"
                                            value={values.password}
                                            onChange={handleChange}
                                            placeholder="Password"
                                            className={`w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-sm border rounded-xl text-white placeholder-blue-200/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                                                errors.password && touched.password 
                                                    ? 'border-red-500/50 focus:ring-red-500' 
                                                    : 'border-white/10 hover:border-white/20'
                                            }`}
                                            disabled={isSubmitting}
                                        />
                                        {errors.password && touched.password && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <AlertCircle className="w-5 h-5 text-red-400" />
                                            </div>
                                        )}
                                        {errors.password && touched.password && (
                                            <p className="mt-1 text-xs text-red-400">{errors.password}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between mb-6">
                                        <label className="flex items-center space-x-2 text-sm text-blue-200/60 cursor-pointer group">
                                            <input 
                                                type="checkbox" 
                                                className="w-4 h-4 bg-white/5 border border-white/10 rounded text-blue-500 focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                                            />
                                            <span className="group-hover:text-blue-200 transition-colors duration-200">Remember Me</span>
                                        </label>
                                        <Link 
                                            to={'/auth/password'}
                                            className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 hover:underline"
                                        >
                                            Forgot Password?
                                        </Link>
                                    </div>

                                    <Button 
                                        type={'submit'} 
                                        size={'xlarge'} 
                                        isLoading={isSubmitting} 
                                        disabled={isSubmitting}
                                        className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-0.5 transition-all duration-300 group"
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            {isSubmitting ? 'Signing In...' : 'Sign In'}
                                            {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />}
                                        </span>
                                    </Button>

                                    <div className="mt-8 text-center space-y-2">
                                        <p className="text-xs text-blue-200/40">
                                            &copy; 2015 - {new Date().getFullYear()} Azx Panel
                                        </p>
                                        <div className="flex justify-center space-x-4 text-[10px] text-blue-200/30">
                                            <span>Privacy Policy</span>
                                            <span>&bull;</span>
                                            <span>Terms of Service</span>
                                            <span>&bull;</span>
                                            <span>Security</span>
                                        </div>
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
                                                setSubmitting(false);
                                                setToken('');
                                            }}
                                        />
                                    )}
                                </LoginFormContainer>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -30px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                @keyframes fadeInLeft {
                    from { opacity: 0; transform: translateX(-30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeInRight {
                    from { opacity: 0; transform: translateX(30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                .animate-float {
                    animation: float 8s ease-in-out infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animate-fadeInLeft {
                    animation: fadeInLeft 0.8s ease-out forwards;
                }
                .animate-fadeInRight {
                    animation: fadeInRight 0.8s ease-out forwards;
                }
                .animate-pulse-slow {
                    animation: pulse-slow 3s ease-in-out infinite;
                }
                .bg-noise {
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
                }
                .bg-grid-pattern {
                    background-image: linear-gradient(rgba(37,99,235,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.03) 1px, transparent 1px);
                    background-size: 60px 60px;
                }
            `}</style>
        </div>
    );
};

export default LoginContainer;
