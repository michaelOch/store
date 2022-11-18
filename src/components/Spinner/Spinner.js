import React from 'react';
import theme from '../../utils/theme';

function Spinner() {
    return (
        <div className="d-flex align-items-center justify-content-center p-5">
            <div className="spinner-border" role="status" style={{color: theme.colors.dark}}>
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
}

export default Spinner;
