// PowerButtons.tsx
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/elements/button/index';
import Can from '@/components/elements/Can';
import { ServerContext } from '@/state/server';
import { PowerAction } from '@/components/server/console/ServerConsoleContainer';
import { Dialog } from '@/components/elements/dialog';
import styled from 'styled-components/macro';
import { Play, RotateCw, Square, AlertTriangle } from 'lucide-react';

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
    height: 40px;
    padding: 0 1.25rem;
    border-radius: 14px;
    font-weight: 600;
    font-size: 0.8rem;
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
                    }
                `;
            case 'restart':
                return `
                    background: linear-gradient(135deg, #3B82F6, #2563EB);
                    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.25);

                    &:hover:not(:disabled) {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 24px rgba(59, 130, 246, 0.35);
                    }
                `;
            case 'stop':
                return `
                    background: linear-gradient(135deg, #EF4444, #DC2626);
                    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.25);

                    &:hover:not(:disabled) {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 24px rgba(239, 68, 68, 0.35);
                    }
                `;
            case 'kill':
                return `
                    background: linear-gradient(135deg, #DC2626, #991B1B);
                    box-shadow: 0 4px 16px rgba(220, 38, 38, 0.25);

                    &:hover:not(:disabled) {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 24px rgba(220, 38, 38, 0.35);
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
    }
`;

const KillButton = styled(StyledButton)`
    background: linear-gradient(135deg, #DC2626, #991B1B) !important;
    box-shadow: 0 4px 16px rgba(220, 38, 38, 0.25) !important;

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(220, 38, 38, 0.35) !important;
    }
`;

const DialogOverlay = styled.div`
    .dialog-content {
        background: #1E293B;
        border-radius: 22px;
        border: 1px solid rgba(255, 255, 255, 0.06);
        padding: 2rem;
        max-width: 420px;
    }

    .dialog-title {
        color: #FFFFFF;
        font-size: 1.25rem;
        font-weight: 600;
    }

    .dialog-description {
        color: #94A3B8;
        font-size: 0.9rem;
        margin-top: 0.5rem;
    }

    .dialog-actions {
        display: flex;
        gap: 0.75rem;
        margin-top: 1.5rem;
        justify-content: flex-end;
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
                <DialogOverlay>
                    <div className="dialog-content">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <AlertTriangle style={{ color: '#EF4444', width: '24px', height: '24px' }} />
                            <h3 className="dialog-title">Forcibly Stop Process</h3>
                        </div>
                        <p className="dialog-description">
                            Forcibly stopping a server can lead to data corruption. Are you sure you want to continue?
                        </p>
                        <div className="dialog-actions">
                            <Button.Text onClick={() => setOpen(false)}>Cancel</Button.Text>
                            <Button.Danger onClick={onButtonClick.bind(this, 'kill-confirmed')}>
                                Continue
                            </Button.Danger>
                        </div>
                    </div>
                </DialogOverlay>
            </Dialog.Confirm>

            <ButtonGroup>
                <Can action={'control.start'}>
                    <StyledButton
                        $variant="start"
                        disabled={!isOffline}
                        onClick={onButtonClick.bind(this, 'start')}
                    >
                        <Play />
                        Start
                    </StyledButton>
                </Can>

                <Can action={'control.restart'}>
                    <StyledButton
                        $variant="restart"
                        disabled={!status || isOffline}
                        onClick={onButtonClick.bind(this, 'restart')}
                    >
                        <RotateCw />
                        Restart
                    </StyledButton>
                </Can>

                <Can action={'control.stop'}>
                    {killable ? (
                        <KillButton
                            $variant="kill"
                            disabled={isOffline}
                            onClick={onButtonClick.bind(this, 'kill')}
                        >
                            <Square />
                            Kill
                        </KillButton>
                    ) : (
                        <StyledButton
                            $variant="stop"
                            disabled={isOffline || !isRunning}
                            onClick={onButtonClick.bind(this, 'stop')}
                        >
                            <Square />
                            Stop
                        </StyledButton>
                    )}
                </Can>
            </ButtonGroup>
        </div>
    );
};