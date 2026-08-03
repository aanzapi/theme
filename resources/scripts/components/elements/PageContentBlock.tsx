// PageContentBlock.tsx
import React, { useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import FlashMessageRender from '@/components/FlashMessageRender';

export interface PageContentBlockProps {
    title?: string;
    className?: string;
    showFlashKey?: string;
}

const PageContentBlock: React.FC<PageContentBlockProps> = ({ title, showFlashKey, className, children }) => {
    useEffect(() => {
        if (title) {
            document.title = title;
        }
    }, [title]);

    return (
        <CSSTransition timeout={150} classNames={'fade'} appear in>
            <div className={`w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8 ${className || ''}`}>
                <div className="relative">
                    <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
                    <div className="relative">
                        {showFlashKey && <FlashMessageRender byKey={showFlashKey} className="mb-4" />}
                        {children}
                    </div>
                </div>
                
                <div className="mt-8 text-center">
                    <p className="text-xs text-blue-200/30">
                        <a
                            rel="noopener nofollow noreferrer"
                            href="https://pterodactyl.io"
                            target="_blank"
                            className="no-underline text-blue-200/30 hover:text-blue-200/60 transition-colors duration-200"
                        >
                            Pterodactyl&reg;
                        </a>
                        &nbsp;&copy; 2015 - {new Date().getFullYear()}
                    </p>
                </div>
            </div>

            <style>{`
                .bg-grid-pattern {
                    background-image: 
                        linear-gradient(rgba(37,99,235,0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(37,99,235,0.05) 1px, transparent 1px);
                    background-size: 40px 40px;
                }
                .fade-enter {
                    opacity: 0;
                }
                .fade-enter-active {
                    opacity: 1;
                    transition: opacity 150ms;
                }
                .fade-exit {
                    opacity: 1;
                }
                .fade-exit-active {
                    opacity: 0;
                    transition: opacity 150ms;
                }
            `}</style>
        </CSSTransition>
    );
};

export default PageContentBlock;