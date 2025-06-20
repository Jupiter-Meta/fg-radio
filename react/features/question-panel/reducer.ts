import { AnyAction } from 'redux';

import { SET_CURRENT_QUESTION, TOGGLE_QUESTION_PANEL } from './actionTypes';
import { IQuestionPanelState } from './types';

const DEFAULT_STATE = {
    currentQuestion: 'What health technologies are you most excited about?',
    isVisible: true
};

/**
 * Reduces the Redux actions related to the question panel.
 *
 * @param {IQuestionPanelState} state - The current Redux state.
 * @param {AnyAction} action - The Redux action to reduce.
 * @returns {IQuestionPanelState} The updated Redux state.
 */
export default function reducer(state: IQuestionPanelState = DEFAULT_STATE, action: AnyAction): IQuestionPanelState {
    switch (action.type) {
    case SET_CURRENT_QUESTION:
        return {
            ...state,
            currentQuestion: action.question
        };

    case TOGGLE_QUESTION_PANEL:
        return {
            ...state,
            isVisible: action.visible
        };

    default:
        return state;
    }
}
