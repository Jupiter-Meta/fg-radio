import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { IReduxState } from '../app/types';

interface IProps {
    initialTimeInSeconds?: number;
}

/**
 * Component for displaying recording time remaining.
 *
 * @param {IProps} props - The props of the component.
 * @returns {JSX.Element}
 */
const RecordingTimer: React.FC<IProps> = ({ initialTimeInSeconds = 134 }: IProps) => {
    const [timeLeft, setTimeLeft] = useState<number>(initialTimeInSeconds);
    
    // The "|| true" fallback will always make isRecording true if the Redux state value is falsy
    // This likely isn't what you want, so let's separate the demo mode from production
    const isRecording = useSelector((state: IReduxState) => {
        // For production: Use actual recording state from Redux
        const recordingState = state['features/recording']?.isRecording;
        
        // For demo/development: Default to true if the feature is not available in state
        return typeof recordingState !== 'undefined' ? recordingState : true;
    });

    useEffect(() => {
        if (!isRecording) {
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [isRecording]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const secondsFormatted = seconds < 10 ? `0${seconds}` : seconds;

    if (!isRecording) {
        return null;
    }

    return (
        <div className="recording-timer">
            <span className="recording-icon">REC</span>
            <span className="recording-time-left">{`${minutes}:${secondsFormatted} left`}</span>
        </div>
    );
};

export default RecordingTimer;
