// react/features/custom-layout/reducer.ts
import { SET_CUSTOM_LAYOUT_ENABLED } from './actionTypes';
import ReducerRegistry from '../base/redux/ReducerRegistry';

const DEFAULT_STATE = {
    enabled: false
};

ReducerRegistry.register('features/custom-layout', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case SET_CUSTOM_LAYOUT_ENABLED:
            return {
                ...state as object,
                enabled: action.enabled
            };
        default:
            return state;
    }
});
