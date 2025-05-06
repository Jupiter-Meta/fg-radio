import { AnyAction } from 'redux';

import { SET_FACE_MASKING_ENABLED, SET_PARTICIPANT_FACE_MASKED } from './actionTypes';
import { IFaceMaskingState } from './types';

const DEFAULT_STATE = {
    enabled: false,
    maskedParticipants: {
        // Pre-set the local user as masked for the example
        'local': true
    }
};

/**
 * Reduces the Redux actions related to face masking.
 *
 * @param {IFaceMaskingState} state - The current Redux state.
 * @param {AnyAction} action - The Redux action to reduce.
 * @returns {IFaceMaskingState} The updated Redux state.
 */
export default function reducer(state: IFaceMaskingState = DEFAULT_STATE, action: AnyAction): IFaceMaskingState {
    switch (action.type) {
    case SET_FACE_MASKING_ENABLED:
        return {
            ...state,
            enabled: action.enabled
        };

    case SET_PARTICIPANT_FACE_MASKED: {
        return {
            ...state,
            maskedParticipants: {
                ...state.maskedParticipants,
                [action.participantId]: action.isMasked
            }
        };
    }

    default:
        return state;
    }
}
