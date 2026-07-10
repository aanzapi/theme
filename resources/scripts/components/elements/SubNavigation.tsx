// resources/scripts/components/elements/SubNavigation.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components/macro';
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
    faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';

// Container utama dengan padding responsif
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

// Wrapper navigasi dengan glassmorphism
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
    overflow-y: hidden;
    position: relative;
    -webkit-overflow-scrolling: touch;

    /* Hide scrollbar but keep functionality */
    &::-webkit-scrollbar {
        height: 0;
        width: 0;
        background: transparent;
    }

    /* For Firefox */
    scrollbar-width: none;

    /* For IE/Edge */
    -ms-overflow-style: none;
`;

// List navigasi - horizontal flex dengan no wrap
const NavList = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: max-content;
    padding: 0 4px;

    @media (max-width: 768px) {
        gap: 3px;
    }

    @media (max-width: 480px) {
        gap: 2px;
    }
`;

// Styled NavLink dengan semua styling modern
const NavItem = styled(NavLink)`
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
    background: transparent;
    border: 1px solid transparent;
    flex-shrink: 0;

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

    /* Tablet */
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

    /* Mobile */
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

// Admin link khusus untuk root admin
const AdminLink = styled.a`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 46px;
    width: 46px;
    border-radius: 14px;
    color: #A1A1AA;
    text-decoration: none;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    background: transparent;
    border: 1px solid transparent;
    flex-shrink: 0;

    svg {
        width: 16px;
        height: 16px;
        transition: all 0.25s ease;
    }

    &:hover {
        background: rgba(255, 255, 255, 0.05);
        color: #FFFFFF;
        transform: translateY(-2px);
    }

    @media (max-width: 768px) {
        height: 42px;
        width: 42px;

        svg {
            width: 14px;
            height: 14px;
        }
    }

    @media (max-width: 480px) {
        height: 38px;
        width: 38px;

        svg {
            width: 13px;
            height: 13px;
        }
    }
`;

// Mapping path ke icon
const getIconForPath = (path: string): IconDefinition => {
    if (path.includes('console') || path === '/' || path === '') return faTerminal;
    if (path.includes('files')) return faFolder;
    if (path.includes('databases')) return faDatabase;
    if (path.includes('schedules')) return faClock;
    if (path.includes('users')) return faUsers;
    if (path.includes('backups')) return faArchive;
    if (path.includes('network')) return faGlobe;
    if (path.includes('startup')) return faRocket;
    if (path.includes('settings')) return faCog;
    if (path.includes('activity')) return faHistory;
    return faTerminal;
};

// Props untuk SubNavigation
interface SubNavigationProps {
    children: React.ReactNode;
}

// Komponen utama
const SubNavigation: React.FC<SubNavigationProps> = ({ children }) => {
    // Ekstrak children dari div wrapper
    const childrenArray = React.Children.toArray(children);
    const navChildren = childrenArray.flatMap((child) => {
        if (React.isValidElement(child) && child.type === 'div') {
            return React.Children.toArray(child.props.children);
        }
        return child;
    });

    // Render ulang dengan styling yang benar
    const renderedItems = navChildren.map((child, index) => {
        if (React.isValidElement(child) && child.type === NavLink) {
            const childProps = child.props as any;
            const to = childProps.to || '';
            const icon = getIconForPath(typeof to === 'string' ? to : '');
            const isAdminLink = childProps.href?.includes('/admin');

            if (isAdminLink) {
                return (
                    <AdminLink
                        key={index}
                        href={childProps.href}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </AdminLink>
                );
            }

            return (
                <NavItem
                    key={index}
                    to={to}
                    exact={childProps.exact}
                    activeClassName="active"
                >
                    <FontAwesomeIcon icon={icon} />
                    {childProps.children}
                </NavItem>
            );
        }
        return child;
    });

    return (
        <Container>
            <NavWrapper>
                <NavList>
                    {renderedItems}
                </NavList>
            </NavWrapper>
        </Container>
    );
};

export default SubNavigation;
