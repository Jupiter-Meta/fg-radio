import React from 'react';
import { useSelector } from 'react-redux';

import { IReduxState } from '../app/types';

/**
 * Component that renders the question panel.
 *
 * @returns {JSX.Element | null}
 */
const QuestionPanel: React.FC = () => {
    const currentQuestion = useSelector((state: IReduxState) => 
        state['features/question-panel']?.currentQuestion || 
        'What health technologies are you most excited about?'
    );
    
    const isVisible = useSelector((state: IReduxState) => 
        state['features/question-panel']?.isVisible || true
    );

    if (!isVisible) {
        return null;
    }

    return (
        <div className="question-panel">
            <div className="question-label">CURRENT QUESTION</div>
            <div className="question-text">{currentQuestion}</div>
        </div>
    );
};

export default QuestionPanel;
