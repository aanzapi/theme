// SubNavigation.tsx
import React from 'react';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTerminal,
    faFolder,
    faDatabase,
    faClock,
    faUsers,
    faArchive,
    faGlobe,
    faRocket,
    faCog,
    faHistory,
} from '@fortawesome/free-solid-svg-icons';

interface SubNavigationProps {
    children: React.ReactNode;
}

const Container = styled.div`
    max-width: 1600px;
    margin: 0 auto;
    padding: 0 32px;

    @media (max-width: 1024px) {
        padding: 0 24px;
    }

    @media (max-width: 768px) {
        padding: 0 20px;
    }

    @media (max-width: 480px) {
        padding: 0 16px;
    }
`;

const NavWrapper = styled.nav`
    background: rgba(24, 24, 27, 0.82);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
    padding: 8px;
    margin-top: 20px;
    margin-bottom: 28px;
    overflow-x: auto;
    position: relative;

    /* Custom scrollbar for horizontal scroll */
    &::-webkit-scrollbar {
        height: 4px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 999px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    /* Firefox scrollbar */
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
`;

const NavList = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: max-content;
    padding: 0 4px;

    @media (max-width: 768px) {
        gap: 2px;
    }
`;

const NavItem = styled.a`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 46px;
    padding: 0 18px;
    border-radius: 14px;
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 0.2px;
    color: #A1A1AA;
    text-decoration: none;
    white-space: nowrap;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    cursor: pointer;
    position: relative;
    background: transparent;
    border: 1px solid transparent;

    &:not(:first-of-type) {
        margin-left: 0;
    }

    svg {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
        transition: all 0.25s ease;
    }

    &:hover {
        background: rgba(255, 255, 255, 0.05);
        color: #FFFFFF;
        transform: translateY(-2px);
    }

    &:active {
        transform: translateY(0);
    }

    &.active {
        background: #DC2626;
        color: #FFFFFF;
        box-shadow: 0 10px 30px rgba(220, 38, 38, 0.25);
        border-color: rgba(255, 255, 255, 0.08);
        transform: scale(1.02);

        svg {
            color: #FFFFFF;
        }

        &:hover {
            background: #EF4444;
            box-shadow: 0 14px 40px rgba(220, 38, 38, 0.35);
            transform: scale(1.02) translateY(-2px);
        }

        &:active {
            transform: scale(1.02);
        }
    }

    /* Disabled state if needed */
    &.disabled {
        opacity: 0.4;
        cursor: not-allowed;
        pointer-events: none;
    }

    @media (max-width: 768px) {
        height: 42px;
        padding: 0 14px;
        font-size: 13px;
        gap: 6px;

        svg {
            width: 14px;
            height: 14px;
        }
    }

    @media (max-width: 480px) {
        height: 38px;
        padding: 0 12px;
        font-size: 12px;
        gap: 5px;

        svg {
            width: 13px;
            height: 13px;
        }
    }
`;

// Map route paths to icons
const getIconForPath = (path: string): any => {
    if (path.includes('console')) return faTerminal;
    if (path.includes('files')) return faFolder;
    if (path.includes('databases')) return faDatabase;
    if (path.includes('schedules')) return faClock;
    if (path.includes('users')) return faUsers;
    if (path.includes('backups')) return faArchive;
    if (path.includes('network')) return faGlobe;
    if (path.includes('startup')) return faRocket;
    if (path.includes('settings')) return faCog;
    if (path.includes('activity')) return faHistory;
    return faTerminal; // default fallback
};

// Wrapper component that adds icons to children
const SubNavigation: React.FC<SubNavigationProps> = ({ children }) => {
    // Clone children and inject icons
    const enhancedChildren = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            // Check if it's a NavLink or a element
            const childProps = child.props as any;
            const to = childProps.to || childProps.href || '';
            const icon = getIconForPath(to);

            return React.cloneElement(child, {
                ...childProps,
                children: (
                    <>
                        <FontAwesomeIcon icon={icon} />
                        {childProps.children}
                    </>
                ),
            });
        }
        return child;
    });

    return (
        <Container>
            <NavWrapper>
                <NavList>
                    {enhancedChildren}
                </NavList>
            </NavWrapper>
        </Container>
    );
};

// Also export the styled components for direct usage if needed
export { NavWrapper, NavList, NavItem, Container };

export default SubNavigation;