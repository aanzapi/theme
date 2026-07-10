// resources/scripts/components/elements/SubNavigation.tsx
import React, { useEffect, useRef, useState } from 'react';
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

const NavWrapper = styled.nav`
    background: rgba(24, 24, 27, 0.72);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
    padding: 8px;
    margin-top: 20px;
    margin-bottom: 28px;
    position: relative;
    overflow: visible;
`;

// Fade gradient indicator for scrollable content
const FadeLeft = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 40px;
    background: linear-gradient(to right, rgba(24, 24, 27, 0.8), transparent);
    pointer-events: none;
    z-index: 2;
    border-radius: 20px 0 0 20px;
    opacity: 0;
    transition: opacity 0.3s ease;

    &.visible {
        opacity: 1;
    }

    @media (max-width: 768px) {
        width: 30px;
    }
`;

const FadeRight = styled.div`
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 40px;
    background: linear-gradient(to left, rgba(24, 24, 27, 0.8), transparent);
    pointer-events: none;
    z-index: 2;
    border-radius: 0 20px 20px 0;
    opacity: 0;
    transition: opacity 0.3s ease;

    &.visible {
        opacity: 1;
    }

    @media (max-width: 768px) {
        width: 30px;
    }
`;

const NavScroller = styled.div`
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x proximity;
    scroll-behavior: smooth;
    position: relative;

    /* Hide scrollbar completely */
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

const NavList = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 4px;
    min-width: max-content;

    @media (max-width: 480px) {
        gap: 4px;
        padding: 0 2px;
    }
`;

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
    width: fit-content;
    scroll-snap-align: start;

    svg {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
        transition: all 0.25s ease;
    }

    &:hover {
        background: rgba(255, 255, 255, 0.05);
        color: #FFFFFF;
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }

    &.active {
        background: #DC2626;
        color: #FFFFFF;
        box-shadow: 0 10px 30px rgba(220, 38, 38, 0.25);
        border-color: rgba(255, 255, 255, 0.08);

        svg {
            color: #FFFFFF;
        }

        &:hover {
            background: #EF4444;
            box-shadow: 0 14px 40px rgba(220, 38, 38, 0.35);
            transform: translateY(-1px);
        }

        &:active {
            transform: translateY(0);
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
            width: 14px;
            height: 14px;
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
    flex-shrink: 0;
    scroll-snap-align: start;

    svg {
        width: 16px;
        height: 16px;
        transition: all 0.25s ease;
    }

    &:hover {
        background: rgba(255, 255, 255, 0.05);
        color: #FFFFFF;
        transform: translateY(-1px);
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
            width: 14px;
            height: 14px;
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

// ============================================
// MAIN COMPONENT
// ============================================

interface SubNavigationProps {
    children: React.ReactNode;
}

const SubNavigation: React.FC<SubNavigationProps> = ({ children }) => {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const [showLeftFade, setShowLeftFade] = useState(false);
    const [showRightFade, setShowRightFade] = useState(false);
    const [activeItemId, setActiveItemId] = useState<string | null>(null);

    // Check scroll position to show/hide fade indicators
    const checkScroll = () => {
        if (!scrollerRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = scrollerRef.current;
        setShowLeftFade(scrollLeft > 10);
        setShowRightFade(scrollLeft < scrollWidth - clientWidth - 10);
    };

    // Scroll to active item on mount and when active changes
    useEffect(() => {
        if (!scrollerRef.current || !activeItemId) return;

        const activeElement = scrollerRef.current.querySelector(`.active`);
        if (activeElement) {
            const scroller = scrollerRef.current;
            const elementRect = activeElement.getBoundingClientRect();
            const scrollerRect = scroller.getBoundingClientRect();

            // Calculate scroll position to center the active item
            const scrollOffset = 
                activeElement.scrollLeft ||
                (activeElement as any).offsetLeft ||
                0;
            
            const targetScroll = 
                scrollOffset - (scrollerRect.width / 2) + (elementRect.width / 2);

            scroller.scrollTo({
                left: Math.max(0, targetScroll),
                behavior: 'smooth',
            });
        }
    }, [activeItemId]);

    // Debounced scroll check
    useEffect(() => {
        const handleScroll = () => {
            requestAnimationFrame(checkScroll);
        };

        const scroller = scrollerRef.current;
        if (scroller) {
            scroller.addEventListener('scroll', handleScroll);
            // Initial check
            setTimeout(checkScroll, 100);
        }

        return () => {
            if (scroller) {
                scroller.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            checkScroll();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Extract children from the wrapper div
    const childrenArray = React.Children.toArray(children);
    const navChildren = childrenArray.flatMap((child) => {
        if (React.isValidElement(child) && child.type === 'div') {
            return React.Children.toArray(child.props.children);
        }
        return child;
    });

    // Render items with proper styling
    const renderedItems = navChildren.map((child, index) => {
        if (React.isValidElement(child) && child.type === NavLink) {
            const childProps = child.props as any;
            const to = childProps.to || '';
            const icon = getIconForPath(typeof to === 'string' ? to : '');
            const isActive = childProps.isActive || false;

            // Track active item for scrolling
            const itemId = `nav-item-${index}`;
            const isActiveItem = childProps.className?.includes('active') || false;
            if (isActiveItem && activeItemId !== itemId) {
                setActiveItemId(itemId);
            }

            return (
                <NavItem
                    key={index}
                    to={to}
                    exact={childProps.exact}
                    activeClassName="active"
                    id={itemId}
                >
                    <FontAwesomeIcon icon={icon} />
                    {childProps.children}
                </NavItem>
            );
        }

        // Handle admin link
        if (React.isValidElement(child)) {
            const childProps = child.props as any;
            if (childProps.href?.includes('/admin')) {
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
        }

        return child;
    });

    return (
        <Container>
            <NavWrapper>
                <FadeLeft className={showLeftFade ? 'visible' : ''} />
                <FadeRight className={showRightFade ? 'visible' : ''} />
                <NavScroller ref={scrollerRef}>
                    <NavList>
                        {renderedItems}
                    </NavList>
                </NavScroller>
            </NavWrapper>
        </Container>
    );
};

export default SubNavigation;
