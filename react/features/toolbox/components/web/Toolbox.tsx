import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';

import { IReduxState } from '../../../app/types';
import { isMobileBrowser } from '../../../base/environment/utils';
import { getLocalParticipant, isLocalParticipantModerator } from '../../../base/participants/functions';
import ContextMenu from '../../../base/ui/components/web/ContextMenu';
import { isReactionsButtonEnabled, shouldDisplayReactionsButtons } from '../../../reactions/functions.web';
import { isCCTabEnabled } from '../../../subtitles/functions.any';
import { isTranscribing } from '../../../transcribing/functions';
import {
    setHangupMenuVisible,
    setOverflowMenuVisible,
    setToolbarHovered,
    setToolboxVisible
} from '../../actions.web';
import {
    getJwtDisabledButtons,
    getVisibleButtons,
    isButtonEnabled,
    isToolboxVisible
} from '../../functions.web';
import { useKeyboardShortcuts, useToolboxButtons } from '../../hooks.web';
import { IToolboxButton } from '../../types';
import HangupButton from '../HangupButton';

import { EndConferenceButton } from './EndConferenceButton';
import HangupMenuButton from './HangupMenuButton';
import { LeaveConferenceButton } from './LeaveConferenceButton';
import OverflowMenuButton from './OverflowMenuButton';
import Separator from './Separator';

/**
 * The type of the React {@code Component} props of {@link Toolbox}.
 */
interface IProps {
    /**
     * Explicitly passed array with the buttons which this Toolbox should display.
     */
    toolbarButtons?: Array<string>;
}

const useStyles = makeStyles()(() => {
    return {
        container: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            padding: '16px',
            boxSizing: 'border-box'
        },
        // Chat button row (1st row)
        chatButton: {
            width: '100%',
            padding: '14px 16px',
            marginBottom: '16px',
            backgroundColor: '#333',
            borderRadius: '8px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px'
        },
        chatIcon: {
            marginRight: '10px'
        },
        // Current question row (2nd row)
        questionContainer: {
            width: '100%',
            padding: '12px 16px',
            marginBottom: '16px',
            backgroundColor: '#222',
            borderRadius: '8px'
        },
        questionTitle: {
            color: '#9966FF',
            fontWeight: 'bold',
            fontSize: '12px',
            textTransform: 'uppercase',
            marginBottom: '4px'
        },
        questionText: {
            color: 'white',
            fontSize: '14px'
        },
        // Main toolbar row (3rd row)
        toolbarContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '16px',
            width: '100%'
        },
        roundButton: {
            borderRadius: '50%',
            width: '56px',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            margin: 0,
            backgroundColor: '#333',
            border: 'none'
        },
        exitButton: {
            backgroundColor: '#FF3B30',
        },
        // Raise hand row (4th row)
        raiseHandButton: {
            width: '100%',
            padding: '12px',
            backgroundColor: '#9966FF',
            color: 'white',
            borderRadius: '26px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            gap: '8px'
        },
        handIcon: {
            fontSize: '20px',
            transform: 'rotate(-45deg)'
        },
        hiddenButtons: {
            display: 'none'
        }
    };
});

export default function Toolbox({
    toolbarButtons
}: IProps) {
    const { classes, cx } = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const _toolboxRef = useRef<HTMLDivElement>(null);

    // Keep all existing hooks and state from the original component
    const conference = useSelector((state: IReduxState) => state['features/base/conference'].conference);
    const isNarrowLayout = useSelector((state: IReduxState) => state['features/base/responsive-ui'].isNarrowLayout);
    const clientWidth = useSelector((state: IReduxState) => state['features/base/responsive-ui'].clientWidth);
    const isModerator = useSelector(isLocalParticipantModerator);
    const customToolbarButtons = useSelector(
        (state: IReduxState) => state['features/base/config'].customToolbarButtons);
    const iAmRecorder = useSelector((state: IReduxState) => state['features/base/config'].iAmRecorder);
    const iAmSipGateway = useSelector((state: IReduxState) => state['features/base/config'].iAmSipGateway);
    const overflowDrawer = useSelector((state: IReduxState) => state['features/toolbox'].overflowDrawer);
    const shiftUp = useSelector((state: IReduxState) => state['features/toolbox'].shiftUp);
    const overflowMenuVisible = useSelector((state: IReduxState) => state['features/toolbox'].overflowMenuVisible);
    const hangupMenuVisible = useSelector((state: IReduxState) => state['features/toolbox'].hangupMenuVisible);
    const buttonsWithNotifyClick = useSelector((state: IReduxState) => state['features/toolbox'].buttonsWithNotifyClick);
    const reduxToolbarButtons = useSelector((state: IReduxState) => state['features/toolbox'].toolbarButtons);
    const toolbarButtonsToUse = toolbarButtons || reduxToolbarButtons;
    const chatOpen = useSelector((state: IReduxState) => state['features/chat'].isOpen);
    const isDialogVisible = useSelector((state: IReduxState) => Boolean(state['features/base/dialog'].component));
    const localParticipant = useSelector(getLocalParticipant);
    const transcribing = useSelector(isTranscribing);
    const _isCCTabEnabled = useSelector(isCCTabEnabled);
    const jwtDisabledButtons = getJwtDisabledButtons(transcribing, _isCCTabEnabled, localParticipant?.features);
    const reactionsButtonEnabled = useSelector(isReactionsButtonEnabled);
    const _shouldDisplayReactionsButtons = useSelector(shouldDisplayReactionsButtons);
    const toolbarVisible = useSelector(isToolboxVisible);
    const mainToolbarButtonsThresholds = useSelector((state: IReduxState) => state['features/toolbox'].mainToolbarButtonsThresholds);
    const allButtons = useToolboxButtons(customToolbarButtons);
    const isMobile = isMobileBrowser();
    const endConferenceSupported = Boolean(conference?.isEndConferenceSupported() && isModerator);

    useKeyboardShortcuts(toolbarButtonsToUse);

    // Keep all the existing event handlers and effects
    const onSetHangupVisible = useCallback((visible: boolean) => {
        dispatch(setHangupMenuVisible(visible));
        dispatch(setToolbarHovered(visible));
    }, [dispatch]);

    const onSetOverflowVisible = useCallback((visible: boolean) => {
        dispatch(setOverflowMenuVisible(visible));
        dispatch(setToolbarHovered(visible));
    }, [dispatch]);

    const onEscKey = useCallback((e?: React.KeyboardEvent) => {
        if (e?.key === 'Escape') {
            e?.stopPropagation();
            hangupMenuVisible && dispatch(setHangupMenuVisible(false));
            overflowMenuVisible && dispatch(setOverflowMenuVisible(false));
        }
    }, [dispatch, hangupMenuVisible, overflowMenuVisible]);

    const onMouseOut = useCallback(() => {
        !overflowMenuVisible && dispatch(setToolbarHovered(false));
    }, [dispatch, overflowMenuVisible]);

    const onMouseOver = useCallback(() => {
        dispatch(setToolbarHovered(true));
    }, [dispatch]);

    const handleFocus = useCallback(() => {
        dispatch(setToolboxVisible(true));
    }, [dispatch]);

    const handleBlur = useCallback(() => {
        dispatch(setToolboxVisible(false));
    }, [dispatch]);

    useEffect(() => {
        if (!toolbarVisible) {
            if (document.activeElement instanceof HTMLElement
                && _toolboxRef.current?.contains(document.activeElement)) {
                document.activeElement.blur();
            }
        }
    }, [toolbarVisible]);

    useEffect(() => {
        if (endConferenceSupported && isMobile) {
            hangupMenuVisible && dispatch(setToolboxVisible(true));
        } else if (hangupMenuVisible && !toolbarVisible) {
            onSetHangupVisible(false);
            dispatch(setToolbarHovered(false));
        }
    }, [dispatch, hangupMenuVisible, toolbarVisible, onSetHangupVisible, endConferenceSupported, isMobile]);

    useEffect(() => {
        if (overflowMenuVisible && isDialogVisible) {
            onSetOverflowVisible(false);
            dispatch(setToolbarHovered(false));
        }
    }, [dispatch, overflowMenuVisible, isDialogVisible, onSetOverflowVisible]);

    if (iAmRecorder || iAmSipGateway) {
        return null;
    }

    const rootClassNames = `new-toolbox ${toolbarVisible ? 'visible' : ''} ${
        toolbarButtonsToUse.length ? '' : 'no-buttons'} ${chatOpen ? 'shift-right' : ''}`;

    const { mainMenuButtons } = getVisibleButtons({
        allButtons,
        buttonsWithNotifyClick,
        toolbarButtons: toolbarButtonsToUse,
        clientWidth,
        jwtDisabledButtons,
        mainToolbarButtonsThresholds
    });

    // Extract buttons for our custom layout
    const chatButton = mainMenuButtons.find(button => button.key === 'chat');
    const muteButton = mainMenuButtons.find(button => button.key === 'microphone');
    const videoButton = mainMenuButtons.find(button => button.key === 'camera');
    const maskButton = mainMenuButtons.find(button => button.key === 'mask');
    const raiseHandButton = mainMenuButtons.find(button => button.key === 'raisehand');
    
    // Hide these buttons from original rendering
    const filteredMainMenuButtons = mainMenuButtons.filter(button => 
        !['chat', 'microphone', 'camera', 'mask', 'raisehand', 'hangup'].includes(button.key)
    );

    return (
        <div
            className={cx(rootClassNames, shiftUp && 'shift-up')}
            id='new-toolbox'
            ref={_toolboxRef}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={onEscKey}>
            
            <div className={classes.container}>
                {/* Row 1: Chat Button */}
                <button className={classes.chatButton} onClick={() => {
                    if (chatButton && chatButton.Content) {
                        // This will simulate a click on the original chat button
                        const button = document.querySelector(`[data-button="chat"]`) as HTMLElement;
                        button?.click();
                    }
                }}>
                    <span className={classes.chatIcon}>♦</span>
                    Tap to open chat
                </button>
                
                {/* Row 2: Current Question */}
                <div className={classes.questionContainer}>
                    <div className={classes.questionTitle}>CURRENT QUESTION</div>
                    <div className={classes.questionText}>
                        What health technologies are you most excited about?
                    </div>
                </div>
                
                {/* Row 3: Main Toolbar with Round Buttons */}
                <div className={classes.toolbarContainer}>
                    {/* Mute Button */}
                    {muteButton && (
                        <button className={classes.roundButton}>
                            <muteButton.Content
                                {...muteButton}
                                buttonKey={muteButton.key}
                                key={muteButton.key} />
                        </button>
                    )}
                    
                    {/* Video Button */}
                    {videoButton && (
                        <button className={classes.roundButton}>
                            <videoButton.Content
                                {...videoButton}
                                buttonKey={videoButton.key}
                                key={videoButton.key} />
                        </button>
                    )}
                    
                    {/* Mask Button */}
                    {maskButton && (
                        <button className={classes.roundButton}>
                            <maskButton.Content
                                {...maskButton}
                                buttonKey={maskButton.key}
                                key={maskButton.key} />
                        </button>
                    )}
                    {isButtonEnabled('hangup', toolbarButtonsToUse) && (
                        <button className={cx(classes.roundButton, classes.exitButton)}>
                            <HangupButton
                                buttonKey='hangup'
                                customClass='jitsi-button-fill-transparent'
                                key='hangup-button'
                                notifyMode={buttonsWithNotifyClick?.get('hangup')}
                                visible={true} />
                        </button>
                    )}
                </div>
                
                {/* Row 4: Raise Hand Button */}
                <button className={classes.raiseHandButton} onClick={() => {
                    if (raiseHandButton && raiseHandButton.Content) {
                        // This will simulate a click on the original raise hand button
                        const button = document.querySelector(`[data-button="raisehand"]`) as HTMLElement;
                        button?.click();
                    }
                }}>
                    <span className={classes.handIcon}>✋</span>
                    Raise Hand
                </button>
            </div>
            
            {/* Hidden buttons to ensure functionality */}
            <div className={classes.hiddenButtons}>
                {chatButton && (
                    <chatButton.Content
                        {...chatButton}
                        buttonKey={chatButton.key}
                        key={chatButton.key} />
                )}
                
                {raiseHandButton && (
                    <raiseHandButton.Content
                        {...raiseHandButton}
                        buttonKey={raiseHandButton.key}
                        key={raiseHandButton.key} />
                )}
                
                {filteredMainMenuButtons.map(({ Content, key, ...rest }) => Content !== Separator && (
                    <Content
                        {...rest}
                        buttonKey={key}
                        key={key} />
                ))}
            </div>
        </div>
    );
}
