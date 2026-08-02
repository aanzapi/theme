// PowerButtons.tsx
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/elements/button/index';
import Can from '@/components/elements/Can';
import { ServerContext } from '@/state/server';
import { PowerAction } from '@/components/server/console/ServerConsoleContainer';
import { Dialog } from '@/components/elements/dialog';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faRotateRight, faStop, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

interface PowerButtonProps {
    className?: string;
}

const ButtonGroup = styled.div`
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;

    @media (max-width: 480px) {
        width: 100%;
    }
`;

const StyledButton = styled(Button)<{ $variant?: 'start' | 'restart' | 'stop' | 'kill' }>`
    height: 48px;
    padding: 0 1.5rem;
    border-radius: 14px;
    font-weight: 600;
    font-size: 0.85rem;
    letter-spacing: 0.3px;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #FFFFFF;

    svg {
        width: 16px;
        height: 16px;
    }

    ${({ $variant }) => {
        switch ($variant) {
            case 'start':
                return `
                    background: linear-gradient(135deg, #22C55E, #16A34A);
                    box-shadow: 0 4px 16px rgba(34, 197, 94, 0.25);

                    &:hover:not(:disabled) {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 24px rgba(34, 197, 94, 0.35);
                        background: linear-gradient(135deg, #2DD4BF, #16A34A);
                    }
                `;
            case 'restart':
                return `
                    background: linear-gradient(135deg, #DC2626, #B91C1C);
                    box-shadow: 0 4px 16px rgba(220, 38, 38, 0.25);

                    &:hover:not(:disabled) {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 24px rgba(220, 38, 38, 0.35);
                        background: linear-gradient(135deg, #EF4444, #DC2626);
                    }
                `;
            case 'stop':
                return `
                    background: linear-gradient(135deg, #EF4444, #DC2626);
                    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.25);

                    &:hover:not(:disabled) {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 24px rgba(239, 68, 68, 0.35);
                        background: linear-gradient(135deg, #F87171, #EF4444);
                    }
                `;
            case 'kill':
                return `
                    background: linear-gradient(135deg, #DC2626, #991B1B);
                    box-shadow: 0 4px 16px rgba(220, 38, 38, 0.25);

                    &:hover:not(:disabled) {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 24px rgba(220, 38, 38, 0.35);
                        background: linear-gradient(135deg, #EF4444, #DC2626);
                    }
                `;
            default:
                return `
                    background: #6B7280;
                    box-shadow: 0 4px 16px rgba(107, 114, 128, 0.25);

                    &:hover:not(:disabled) {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 24px rgba(107, 114, 128, 0.35);
                    }
                `;
        }
    }}

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: none !important;
    }

    @media (max-width: 480px) {
        flex: 1;
        justify-content: center;
        padding: 0 1rem;
        font-size: 0.75rem;
    }
`;

export default ({ className }: PowerButtonProps) => {
    const [open, setOpen] = useState(false);
    const status = ServerContext.useStoreState((state) => state.status.value);
    const instance = ServerContext.useStoreState((state) => state.socket.instance);

    const killable = status === 'stopping';
    const isOffline = status === 'offline';
    const isRunning = status === 'running';

    const onButtonClick = (
        action: PowerAction | 'kill-confirmed',
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ): void => {
        e.preventDefault();
        if (action === 'kill') {
            return setOpen(true);
        }

        if (instance) {
            setOpen(false);
            instance.send('set state', action === 'kill-confirmed' ? 'kill' : action);
        }
    };

    useEffect(() => {
        if (status === 'offline') {
            setOpen(false);
        }
    }, [status]);

    return (
        <div className={className}>
            <Dialog.Confirm
                open={open}
                hideCloseIcon
                onClose={() => setOpen(false)}
                title={'Forcibly Stop Process'}
                confirm={'Continue'}
                onConfirmed={onButtonClick.bind(this, 'kill-confirmed')}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <FontAwesomeIcon icon={faTriangleExclamation} style={{ color: '#EF4444', fontSize: '24px' }} />
                    <h3 style={{ color: '#FFFFFF', fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
                        Forcibly Stop Process
                    </h3>
                </div>
                <p style={{ color: '#A1A1AA', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    Forcibly stopping a server can lead to data corruption. Are you sure you want to continue?
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                    <Button.Text onClick={() => setOpen(false)}>Cancel</Button.Text>
                    <Button.Danger onClick={onButtonClick.bind(this, 'kill-confirmed')}>
                        Continue
                    </Button.Danger>
                </div>
            </Dialog.Confirm>

            <ButtonGroup>
                <Can action={'control.start'}>
                    <StyledButton
                        $variant="start"
                        disabled={!isOffline}
                        onClick={onButtonClick.bind(this, 'start')}
                    >
                        <FontAwesomeIcon icon={faPlay} />
                        Start
                    </StyledButton>
                </Can>

                <Can action={'control.restart'}>
                    <StyledButton
                        $variant="restart"
                        disabled={!status || isOffline}
                        onClick={onButtonClick.bind(this, 'restart')}
                    >
                        <FontAwesomeIcon icon={faRotateRight} />
                        Restart
                    </StyledButton>
                </Can>

                <Can action={'control.stop'}>
                    {killable ? (
                        <StyledButton
                            $variant="kill"
                            disabled={isOffline}
                            onClick={onButtonClick.bind(this, 'kill')}
                        >
                            <FontAwesomeIcon icon={faStop} />
                            Kill
                        </StyledButton>
                    ) : (
                        <StyledButton
                            $variant="stop"
                            disabled={isOffline || !isRunning}
                            onClick={onButtonClick.bind(this, 'stop')}
                        >
                            <FontAwesomeIcon icon={faStop} />
                            Stop
                        </StyledButton>
                    )}
                </Can>
            </ButtonGroup>
        </div>
    );
};