// resources/scripts/components/elements/SubNavigation.tsx
import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
    faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';

// ============================================
// STYLED COMPONENTS
// ============================================

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

const NavWrapper = styled.div`
    margin-top: 20px;
    margin-bottom: 28px;
    position: relative;
`;

// ============================================
// TRIGGER BUTTON
// ============================================

const TriggerButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 10px;
    height: 46px;
    padding: 0 16px;
    background: #000000;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 18px;
    color: #FFFFFF;
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 0.2px;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    user-select: none;
    position: relative;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);

    svg {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
    }

    .chevron {
        transition: transform 0.3s ease;
        margin-left: 2px;
    }

    .chevron.open {
        transform: rotate(180deg);
    }

    &:hover {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.12);
    }

    &:active {
        transform: scale(0.98);
    }

    @media (max-width: 768px) {
        height: 42px;
        padding: 0 14px;
        font-size: 13px;
        border-radius: 16px;

        svg {
            width: 14px;
            height: 14px;
        }
    }

    @media (max-width: 480px) {
        height: 38px;
        padding: 0 12px;
        font-size: 12px;
        border-radius: 14px;

        svg {
            width: 14px;
            height: 14px;
        }
    }
`;

const TriggerIcon = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    color: #DC2626;
`;

const TriggerLabel = styled.span`
    color: #FFFFFF;
    font-weight: 600;
`;

const TriggerChevron = styled(FontAwesomeIcon)`
    color: #A1A1AA;
    font-size: 12px;
    transition: transform 0.3s ease;

    &.open {
        transform: rotate(180deg);
    }
`;

// ============================================
// DROPDOWN MENU
// ============================================

const DropdownOverlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 999;
    background: transparent;
    display: ${(props: { isOpen: boolean }) => (props.isOpen ? 'block' : 'none')};
`;

const DropdownContainer = styled.div<{ isOpen: boolean }>`
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    min-width: 280px;
    max-width: 340px;
    width: 100%;
    background: #09090B;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 20px;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.03) inset;
    padding: 8px;
    z-index: 1000;
    max-height: 400px;
    overflow-y: auto;
    transform-origin: top center;
    opacity: ${(props) => (props.isOpen ? 1 : 0)};
    transform: ${(props) => (props.isOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-8px)')};
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: ${(props) => (props.isOpen ? 'auto' : 'none')};

    /* Custom scrollbar */
    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 999px;
    }

    /* Mobile full width */
    @media (max-width: 640px) {
        min-width: unset;
        max-width: 100%;
        left: 0;
        right: 0;
        border-radius: 16px;
        padding: 6px;
        max-height: 60vh;
    }
`;

const DropdownList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const DropdownItem = styled(NavLink)`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-radius: 14px;
    color: #A1A1AA;
    text-decoration: none;
    font-weight: 500;
    font-size: 14px;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    cursor: pointer;
    border: 1px solid transparent;

    svg {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        color: #6B7280;
        transition: all 0.2s ease;
    }

    &:hover {
        background: rgba(255, 255, 255, 0.05);
        color: #FFFFFF;
        transform: translateX(4px);

        svg {
            color: #FFFFFF;
        }
    }

    &:active {
        transform: scale(0.98);
    }

    &.active {
        background: #DC2626;
        color: #FFFFFF;
        border-color: rgba(255, 255, 255, 0.08);
        box-shadow: 0 4px 16px rgba(220, 38, 38, 0.25);

        svg {
            color: #FFFFFF;
        }

        &:hover {
            background: #EF4444;
            box-shadow: 0 6px 24px rgba(220, 38, 38, 0.35);
            transform: translateX(4px);
        }
    }

    @media (max-width: 640px) {
        padding: 12px 14px;
        font-size: 13px;
        border-radius: 12px;

        svg {
            width: 16px;
            height: 16px;
        }
    }
`;

const AdminDropdownItem = styled.a`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-radius: 14px;
    color: #A1A1AA;
    text-decoration: none;
    font-weight: 500;
    font-size: 14px;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    cursor: pointer;
    border: 1px solid transparent;

    svg {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        color: #6B7280;
        transition: all 0.2s ease;
    }

    &:hover {
        background: rgba(255, 255, 255, 0.05);
        color: #FFFFFF;
        transform: translateX(4px);

        svg {
            color: #FFFFFF;
        }
    }

    &:active {
        transform: scale(0.98);
    }

    @media (max-width: 640px) {
        padding: 12px 14px;
        font-size: 13px;
        border-radius: 12px;

        svg {
            width: 16px;
            height: 16px;
        }
    }
`;

// ============================================
// HELPERS
// ============================================

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

const getRouteName = (path: string): string => {
    if (path.includes('console') || path === '/' || path === '') return 'Console';
    if (path.includes('files')) return 'Files';
    if (path.includes('databases')) return 'Databases';
    if (path.includes('schedules')) return 'Schedules';
    if (path.includes('users')) return 'Users';
    if (path.includes('backups')) return 'Backups';
    if (path.includes('network')) return 'Network';
    if (path.includes('startup')) return 'Startup';
    if (path.includes('settings')) return 'Settings';
    if (path.includes('activity')) return 'Activity';
    return 'Console';
};

// ============================================
// MAIN COMPONENT
// ============================================

interface SubNavigationProps {
    children: React.ReactNode;
}

const SubNavigation: React.FC<SubNavigationProps> = ({ children }) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [activeLabel, setActiveLabel] = useState('Console');
    const [activeIcon, setActiveIcon] = useState<IconDefinition>(faTerminal);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    // Extract children from the wrapper div
    const childrenArray = React.Children.toArray(children);
    const navChildren = childrenArray.flatMap((child) => {
        if (React.isValidElement(child) && child.type === 'div') {
            return React.Children.toArray(child.props.children);
        }
        return child;
    });

    // Find active route and update label
    useEffect(() => {
        let foundActive = false;
        navChildren.forEach((child) => {
            if (React.isValidElement(child) && child.type === NavLink) {
                const childProps = child.props as any;
                const to = childProps.to || '';
                const path = typeof to === 'string' ? to : '';
                
                // Check if current path matches
                const isActive = location.pathname.includes(path) && path !== '';
                if (isActive || (path === '' && location.pathname.match(/\/server\/[^\/]+$/))) {
                    const name = getRouteName(path);
                    setActiveLabel(name);
                    setActiveIcon(getIconForPath(path));
                    foundActive = true;
                }
            }
        });
        
        if (!foundActive) {
            setActiveLabel('Console');
            setActiveIcon(faTerminal);
        }
    }, [location.pathname, navChildren]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    // Toggle dropdown
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Close dropdown and scroll to active item
    const handleItemClick = () => {
        setIsOpen(false);
    };

    // Render dropdown items
    const renderedItems = navChildren.map((child, index) => {
        if (React.isValidElement(child) && child.type === NavLink) {
            const childProps = child.props as any;
            const to = childProps.to || '';
            const icon = getIconForPath(typeof to === 'string' ? to : '');
            const label = getRouteName(typeof to === 'string' ? to : '');

            return (
                <DropdownItem
                    key={index}
                    to={to}
                    exact={childProps.exact}
                    activeClassName="active"
                    onClick={handleItemClick}
                >
                    <FontAwesomeIcon icon={icon} />
                    {label}
                </DropdownItem>
            );
        }

        // Handle admin link
        if (React.isValidElement(child)) {
            const childProps = child.props as any;
            if (childProps.href?.includes('/admin')) {
                return (
                    <AdminDropdownItem
                        key={index}
                        href={childProps.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleItemClick}
                    >
                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                        Admin Panel
                    </AdminDropdownItem>
                );
            }
        }

        return child;
    });

    return (
        <Container>
            <NavWrapper>
                <TriggerButton
                    ref={triggerRef}
                    onClick={toggleDropdown}
                    aria-label="Server navigation menu"
                >
                    <TriggerIcon>
                        <FontAwesomeIcon icon={activeIcon} />
                    </TriggerIcon>
                    <TriggerLabel>{activeLabel}</TriggerLabel>
                    <TriggerChevron 
                        icon={faChevronDown} 
                        className={isOpen ? 'open' : ''}
                    />
                </TriggerButton>

                <DropdownOverlay isOpen={isOpen} onClick={() => setIsOpen(false)} />

                <DropdownContainer 
                    ref={dropdownRef} 
                    isOpen={isOpen}
                >
                    <DropdownList>
                        {renderedItems}
                    </DropdownList>
                </DropdownContainer>
            </NavWrapper>
        </Container>
    );
};

export default SubNavigation;
