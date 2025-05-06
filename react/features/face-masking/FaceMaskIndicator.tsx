import React from 'react';
import { useSelector } from 'react-redux';
import { IReduxState } from '../app/types';

interface IProps {
    /**
     * The ID of the participant.
     */
    participantId: string;
}

/**
 * Component that renders the face mask indicator.
 *
 * @param {IProps} props - The props of the component.
 * @returns {JSX.Element | null}
 */
const FaceMaskIndicator: React.FC<IProps> = ({ participantId }: IProps) => {
    const isMasked = useSelector((state: IReduxState) => 
        state['features/face-masking']?.maskedParticipants?.[participantId] || false
    );

    if (!isMasked) {
        return null;
    }

    return (
        <div className="face-masked-indicator">
            Face Masked
        </div>
    );
};

export default FaceMaskIndicator;
