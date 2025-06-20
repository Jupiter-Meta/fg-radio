import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IReduxState } from '../app/types';
import { setFaceMaskingEnabled, setParticipantFaceMasked } from './actions';

/**
 * Component that renders a button to toggle face masking.
 *
 * @returns {JSX.Element}
 */
const MaskButton: React.FC = () => {
    const dispatch = useDispatch();
    
    const localParticipantId = 'local'; // In a real implementation, get this from state
    const enabled = useSelector((state: IReduxState) => 
        state['features/face-masking']?.enabled || false
    );
    const isMasked = useSelector((state: IReduxState) => 
        state['features/face-masking']?.maskedParticipants?.[localParticipantId] || false
    );

    const toggleFaceMask = useCallback(() => {
        dispatch(setFaceMaskingEnabled(!enabled));
        dispatch(setParticipantFaceMasked(localParticipantId, !isMasked));
    }, [dispatch, enabled, isMasked, localParticipantId]);

    return (
        <div className="toolbox-button" onClick={toggleFaceMask}>
            <div className="toolbox-icon">
                <span className="icon-mask"></span>
            </div>
            <span>Mask</span>
        </div>
    );
};

export default MaskButton;
