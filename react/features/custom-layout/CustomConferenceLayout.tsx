import React from 'react';
import FaceMaskIndicator from '../face-masking/FaceMaskIndicator';
import Filmstrip from '../filmstrip/components/web/Filmstrip';
import QuestionPanel from '../question-panel/QuestionPanel';
import Toolbox from '../toolbox/components/web/Toolbox';
import CustomRaiseHandButton from './CustomRaiseHandButton';
import RecordingTimer from './RecordingTimer';

/**
 * Component that renders the custom conference layout.
 *
 * @returns {JSX.Element}
 */
const CustomConferenceLayout: React.FC = () => {
    // For the purpose of this example, we're hardcoding the time
    const time = '9:41';

    return (
        <div className="custom-conference-container">
            <div className="custom-conference-header">
                <span className="conference-time">{time}</span>
                <div className="conference-title">
                    Advancing Health Research
                    <RecordingTimer initialTimeInSeconds={134} />
                </div>
                <div className="video-settings-toggle"></div>
            </div>
            
            <div className="conference-content">
                {/* <div className="main-video-container">
                    <LargeVideo />
                </div> */}
                
                <div className="filmstrip-container">
                    <Filmstrip />
                    <FaceMaskIndicator participantId="local" />
                </div>
                
                <button className="chat-button">
                    <span className="chat-icon">◆</span>
                    Tap to open chat
                </button>
                
                <QuestionPanel />
                
                <div className="conference-controls">
                    <Toolbox />
                    <CustomRaiseHandButton />
                </div>
            </div>
        </div>
    );
};

export default CustomConferenceLayout;
