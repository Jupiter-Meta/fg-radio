import {
    SET_CURRENT_QUESTION,
    TOGGLE_QUESTION_PANEL
} from './actionTypes';

/**
 * Sets the current question.
 *
 * @param {string} question - The question to set.
 * @returns {{
 *     type: SET_CURRENT_QUESTION,
 *     question: string
 * }}
 */
export function setCurrentQuestion(question: string) {
    return {
        type: SET_CURRENT_QUESTION,
        question
    };
}

/**
 * Toggles the question panel visibility.
 *
 * @param {boolean} visible - Whether the panel should be visible.
 * @returns {{
 *     type: TOGGLE_QUESTION_PANEL,
 *     visible: boolean
 * }}
 */
export function toggleQuestionPanel(visible: boolean) {
    return {
        type: TOGGLE_QUESTION_PANEL,
        visible
    };
}
