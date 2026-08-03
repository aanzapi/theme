// LoginFormContainer.tsx
import React, { forwardRef } from 'react';
import { Form } from 'formik';
import FlashMessageRender from '@/components/FlashMessageRender';

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
};

export default forwardRef<HTMLFormElement, Props>(({ title, children, ...props }, ref) => (
    <div className="w-full">
        <div className="relative w-full">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-blue-400/10 to-blue-600/20 rounded-2xl blur"></div>
            <div className="relative w-full bg-[#0A1628] backdrop-blur-xl rounded-2xl p-5 sm:p-8 border border-white/10 shadow-2xl shadow-blue-500/10">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none"></div>
                
                {title && (
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-white">{title}</h2>
                    </div>
                )}
                
                <FlashMessageRender className="mb-4 px-1" />
                
                <Form {...props} ref={ref} className="relative w-full">
                    {children}
                </Form>
            </div>
        </div>
    </div>
));