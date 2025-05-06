/**
 * The face masking state.
 */
export interface IFaceMaskingState {
    /**
     * Whether face masking is enabled.
     */
    enabled: boolean;

    /**
     * A map of participant IDs to whether their faces are masked.
     */
    maskedParticipants: {
        [participantId: string]: boolean;
    };
}
