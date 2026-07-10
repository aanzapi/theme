// NavigationBar.tsx
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
import Tooltip from '@/components/elements/tooltip/Tooltip';
import Avatar from '@/components/Avatar';
import { 
    Search, 
    LayoutDashboard, 
    Settings, 
    LogOut, 
    Bell,
    User,
    ChevronDown
} from 'lucide-react';

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

const SearchIcon = styled(Search)`
    position: absolute;
    left: 14px;
    color: #6B7280;
    width: 18px;
    height: 18px;
    pointer-events: none;
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
                    <SearchIcon />
                    <SearchInput placeholder="Search server..." />
                </SearchWrapper>

                <RightSection>
                    <NavLinkStyled to="/" exact>
                        <LayoutDashboard />
                    </NavLinkStyled>
                    
                    {rootAdmin && (
                        <NavLinkStyled to="/admin" as="a" href="/admin">
                            <Settings />
                        </NavLinkStyled>
                    )}

                    <NavButton>
                        <Bell />
                    </NavButton>

                    <UserSection>
                        <UserAvatar>
                            <User />
                        </UserAvatar>
                        <Username>{username}</Username>
                        <LogoutButton onClick={onTriggerLogout}>
                            <LogOut />
                        </LogoutButton>
                    </UserSection>
                </RightSection>
            </NavContent>
        </NavContainer>
    );
};