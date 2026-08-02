// NavigationBar.tsx (Updated - tanpa Lucide React)
import * as React from 'react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Avatar from '@/components/Avatar';

// SVG Icons inline
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
);

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
);

const NavContainer = styled.nav`
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(24, 24, 27, 0.70);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    height: 72px;
    display: flex;
    align-items: center;
`;

const NavContent = styled.div`
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;

    @media (max-width: 768px) {
        padding: 0 1rem;
        gap: 1rem;
    }
`;

const LogoSection = styled(Link)`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    flex-shrink: 0;
`;

const Logo = styled.img`
    width: 40px;
    height: 40px;
    object-fit: contain;
`;

const BrandName = styled.span`
    font-size: 22px;
    font-weight: 700;
    color: #FFFFFF;
    letter-spacing: -0.02em;

    @media (max-width: 480px) {
        font-size: 18px;
    }
`;

const SearchWrapper = styled.div`
    flex: 1;
    max-width: 350px;
    position: relative;
    display: flex;
    align-items: center;

    @media (max-width: 768px) {
        max-width: 200px;
    }

    @media (max-width: 480px) {
        max-width: 140px;
    }
`;

const SearchIconWrapper = styled.div`
    position: absolute;
    left: 14px;
    color: #6B7280;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const SearchInput = styled.input`
    width: 100%;
    height: 44px;
    border-radius: 14px;
    background: #111827;
    border: 1px solid rgba(255, 255, 255, 0.05);
    color: #FFFFFF;
    font-size: 0.9rem;
    padding: 0 18px 0 44px;
    transition: all 0.25s ease;
    outline: none;

    &::placeholder {
        color: #6B7280;
    }

    &:focus {
        border-color: #DC2626;
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.12);
    }
`;

const RightSection = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
`;

const NavButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: transparent;
    border: none;
    color: #A1A1AA;
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
        background: rgba(220, 38, 38, 0.08);
        color: #FFFFFF;
    }

    svg {
        width: 20px;
        height: 20px;
    }
`;

const NavLinkStyled = styled(NavLink)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: transparent;
    border: none;
    color: #A1A1AA;
    transition: all 0.2s ease;
    cursor: pointer;
    text-decoration: none;

    &:hover {
        background: rgba(220, 38, 38, 0.08);
        color: #FFFFFF;
    }

    &.active {
        background: rgba(220, 38, 38, 0.12);
        color: #DC2626;
    }

    svg {
        width: 20px;
        height: 20px;
    }
`;

const UserSection = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.5rem 0.25rem 0.25rem;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
`;

const UserAvatar = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 8px;
    overflow: hidden;
    background: rgba(220, 38, 38, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #DC2626;

    svg {
        width: 18px;
        height: 18px;
    }
`;

const Username = styled.span`
    font-size: 0.85rem;
    font-weight: 500;
    color: #FFFFFF;
    margin: 0 0.25rem;

    @media (max-width: 480px) {
        display: none;
    }
`;

const LogoutButton = styled(NavButton)`
    &:hover {
        background: rgba(220, 38, 38, 0.15);
        color: #EF4444;
    }
`;

export default () => {
    const name = useStoreState((state: ApplicationStore) => state.settings.data!.name);
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
    const username = useStoreState((state: ApplicationStore) => state.user.data!.username);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            window.location = '/';
        });
    };

    return (
        <NavContainer>
            <SpinnerOverlay visible={isLoggingOut} />
            <NavContent>
                <LogoSection to="/">
                    <Logo src="https://cdn.yupra.my.id/yp/pmhfjqw0.png" alt="AZX Panel" />
                    <BrandName>AZX Panel</BrandName>
                </LogoSection>

                <SearchWrapper>
                    <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
                    <SearchInput placeholder="Search server..." />
                </SearchWrapper>

                <RightSection>
                    <NavLinkStyled to="/" exact>
                        <DashboardIcon />
                    </NavLinkStyled>
                    
                    {rootAdmin && (
                        <NavLinkStyled to="/admin" as="a" href="/admin">
                            <SettingsIcon />
                        </NavLinkStyled>
                    )}

                    <NavButton>
                        <BellIcon />
                    </NavButton>

                    <UserSection>
                        <UserAvatar>
                            <UserIcon />
                        </UserAvatar>
                        <Username>{username}</Username>
                        <LogoutButton onClick={onTriggerLogout}>
                            <LogoutIcon />
                        </LogoutButton>
                    </UserSection>
                </RightSection>
            </NavContent>
        </NavContainer>
    );
};