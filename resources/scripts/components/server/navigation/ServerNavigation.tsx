// resources/scripts/components/server/navigation/ServerNavigation.tsx
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
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface NavigationItem {
    path: string;
    name: string;
    icon: IconDefinition;
    permission?: string;
    exact?: boolean;
}

const navItems: NavigationItem[] = [
    { path: '/', name: 'Console', icon: faTerminal, exact: true },
    { path: '/files', name: 'Files', icon: faFolder },
    { path: '/databases', name: 'Databases', icon: faDatabase },
    { path: '/schedules', name: 'Schedules', icon: faClock },
    { path: '/users', name: 'Users', icon: faUsers },
    { path: '/backups', name: 'Backups', icon: faArchive },
    { path: '/network', name: 'Network', icon: faGlobe },
    { path: '/startup', name: 'Startup', icon: faRocket },
    { path: '/settings', name: 'Settings', icon: faCog },
    { path: '/activity', name: 'Activity', icon: faHistory },
];

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

const StyledNavLink = styled(NavLink)`
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

interface ServerNavigationProps {
    rootAdmin: boolean;
    serverId?: number;
    to: (path: string, url?: boolean) => string;
}

const ServerNavigation: React.FC<ServerNavigationProps> = ({ rootAdmin, serverId, to }) => {
    return (
        <Container>
            <NavWrapper>
                <NavList>
                    {navItems.map((item) => (
                        <StyledNavLink
                            key={item.path}
                            to={to(item.path, true)}
                            exact={item.exact}
                        >
                            <FontAwesomeIcon icon={item.icon} />
                            {item.name}
                        </StyledNavLink>
                    ))}
                    {rootAdmin && serverId && (
                        <AdminLink
                            href={`/admin/servers/view/${serverId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FontAwesomeIcon icon={faExternalLinkAlt} />
                        </AdminLink>
                    )}
                </NavList>
            </NavWrapper>
        </Container>
    );
};

export default ServerNavigation;