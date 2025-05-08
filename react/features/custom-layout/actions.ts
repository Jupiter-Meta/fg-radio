// react/features/custom-layout/actions.ts
import { SET_CUSTOM_LAYOUT_ENABLED } from './actionTypes';

export function setCustomLayout(enabled: boolean) {
    return {
        type: SET_CUSTOM_LAYOUT_ENABLED,
        enabled
    };
}
