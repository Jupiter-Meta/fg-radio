import {
    SET_FACE_MASKING_ENABLED,
    SET_PARTICIPANT_FACE_MASKED
} from './actionTypes';

/**
 * Sets whether face masking is enabled.
 *
 * @param {boolean} enabled - True if face masking should be enabled.
 * @returns {{
 *     type: SET_FACE_MASKING_ENABLED,
 *     enabled: boolean
 * }}
 */
export function setFaceMaskingEnabled(enabled: boolean) {
    return {
        type: SET_FACE_MASKING_ENABLED,
        enabled
    };
}

/**
 * Sets participant face masking status.
 *
 * @param {string} participantId - The ID of the participant.
 * @param {boolean} isMasked - Whether the participant's face is masked.
 * @returns {{
 *     type: SET_PARTICIPANT_FACE_MASKED,
 *     participantId: string,
 *     isMasked: boolean
 * }}
 */
export function setParticipantFaceMasked(participantId: string, isMasked: boolean) {
    return {
        type: SET_PARTICIPANT_FACE_MASKED,
        participantId,
        isMasked
    };
}
