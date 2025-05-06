import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IReduxState } from '../app/types';
import { raiseHand } from '../base/participants/actions';

/**
 * Component that renders a custom raise hand button.
 *
 * @returns {JSX.Element}
 */
const CustomRaiseHandButton: React.FC = () => {
    const dispatch = useDispatch();
    
    const isHandRaised = useSelector((state: IReduxState) => {
        const localParticipant = state['features/base/participants']?.local;
        return localParticipant?.raisedHand || false;
    });

    const toggleRaiseHand = useCallback(() => {
        dispatch(raiseHand(!isHandRaised));
    }, [dispatch, isHandRaised]);

    return (
        <button 
            className="raise-hand-button" 
            onClick={toggleRaiseHand}
            aria-label="Raise Hand"
        >
            <span className="raise-hand-icon"></span>
            Raise Hand
        </button>
    );
};

export default CustomRaiseHandButton;
