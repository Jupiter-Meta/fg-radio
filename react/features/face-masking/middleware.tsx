import { AnyAction } from 'redux';

import { SET_FACE_MASKING_ENABLED, SET_PARTICIPANT_FACE_MASKED } from './actionTypes';
import { APP_WILL_MOUNT, APP_WILL_UNMOUNT } from '../base/app/actionTypes';
import { IStore } from '../app/types';

/**
 * Middleware that captures face masking actions and applies video filters.
 *
 * @param {IStore} store - The redux store.
 * @returns {Function}
 */
export const faceMaskingMiddleware = ({ getState, dispatch }: IStore) => (next: Function) => (action: AnyAction) => {
    const result = next(action);

    switch (action.type) {
    case SET_PARTICIPANT_FACE_MASKED:
        if (action.isMasked) {
            // Here we would apply actual video masking/pixelation
            // This is simplified for this example
            console.log(`Masking video for participant: ${action.participantId}`);
            applyVideoMask(action.participantId);
        } else {
            console.log(`Unmasking video for participant: ${action.participantId}`);
            removeVideoMask(action.participantId);
        }
        break;
    }

    return result;
};

/**
 * Applies a pixelation mask to a participant's video.
 * 
 * @param {string} participantId - The participant ID.
 */
function applyVideoMask(participantId: string): void {
    // In a real implementation, this would apply a CSS filter
    // or canvas-based pixelation to the video element
    const videoElement = document.querySelector(`[data-participant-id="${participantId}"] video`);
    if (videoElement) {
        (videoElement as HTMLElement).style.filter = 'blur(10px)';
    }
}

/**
 * Removes the pixelation mask from a participant's video.
 * 
 * @param {string} participantId - The participant ID.
 */
function removeVideoMask(participantId: string): void {
    const videoElement = document.querySelector(`[data-participant-id="${participantId}"] video`);
    if (videoElement) {
        (videoElement as HTMLElement).style.filter = 'none';
    }
}
