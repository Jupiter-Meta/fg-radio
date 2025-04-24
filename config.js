var config = {
    // App name
    appName: 'Focus Group Radio 📻',
    
    // Background and branding
    defaultLogoUrl: '',
    disableVirtualBackground: true,
    brandingDataUrl: '',
    hideJitsiWatermark: true,
    hideBrandWatermark: true,
    
    // Welcome page settings
    welcomePage: {
        disabled: true,
        hideFooter: true,
        hideContent: true,
        hideAdditionalCard: true,
        hideToolbarAdditionalContent: true,
        generateRoomnames: false
    },
    
    // Video settings
    videoQuality: {
        disableIndicator: true
    },
    maxFullResolutionParticipants: -1,
    filmstrip: {
        maxHeight: 120,
        vertical: true
    },
    localThumbnailRatio: 16/9,
    remoteThumbnailRatio: 1,
    videoLayoutFit: 'both',
    
    // Toolbar and notifications
    toolbarConfig: {
        initialTimeout: 20000,
        timeout: 4000,
        alwaysVisible: false
    },
    notifications: {
        enableJoinLeaveNotifications: false
    },
    hideInviteMoreHeader: true,
    enablePresenceStatus: false,
    
    // Audio
    audioLevelsBackgroundColor: 'rgba(255,255,255,0.4)',
    audioLevelsPrimaryColor: 'rgba(255,255,255,0.2)',
    
    // Features
    dialOutEnabled: false,
    disableFocusIndicator: false,
    enableLanguageDetection: true,
    enableDominantSpeakerIndicator: true,
    disableTranscriptionSubtitles: false,
    
    // Screen sharing
    autoPinLatestScreenShare: 'remote-only',
    maxZoomingCoefficient: 1.3,
    
    // Mobile
    mobileAppPromo: false,
    
    // Other
    optimizedBrowsers: ['chrome', 'chromium', 'firefox', 'electron', 'safari', 'webkit'],
    unsupportedBrowsers: [],
    recentListEnabled: false,
    closePage: {
        enabled: true,
        hideGuestHint: true,
        showPromotional: false
    },
    providerName: '',
    supportUrl: '',
    
    // Settings displayed in the settings menu
    settingsSections: ['devices', 'language', 'moderator', 'profile'],
    
    // Background color
    backgroundColor: '#040404',
    
    // Default display names
    defaultLocalDisplayName: 'me',
    defaultRemoteDisplayName: 'Fellow Participant',
    
    // Advanced
    testing: {
        p2pTestMode: false
    },
    
    // Chrome extension banner
    chromeExtensionBanner: {
        enabled: false
    }
};
