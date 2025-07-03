import React, { useState, useEffect } from 'react';
import styles from './trader.module.scss';

const TraderPage = () => {
    const [iframeFailed, setIframeFailed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check if iframe loaded successfully
    const handleIframeLoad = () => {
        setIsLoading(false);
    };

    const handleIframeError = () => {
        setIframeFailed(true);
        setIsLoading(false);
    };

    // Manual redirect function
    const handleManualRedirect = () => {
        window.open("https://finest-derivapp.vercel.app/dtrader", "_blank");
    };

    return (
        <div>
            <div className={styles.container}>
                {!iframeFailed ? (
                    <>
                        {isLoading && <div className={styles.loading}>Loading trader platform...</div>}
                        <iframe
                            src="https://finest-derivapp.vercel.app/dtrader"
                            title="Finest Analysis"
                            className={styles.iframe}
                            allowFullScreen
                            onLoad={handleIframeLoad}
                            onError={handleIframeError}
                        />
                    </>
                ) : (
                    <div className={styles.fallback}>
                        <p>The trading platform couldn't be loaded due to browser restrictions.</p>
                        <button
                            onClick={handleManualRedirect}
                            className={styles.redirectButton}
                        >
                            Open Trading Platform in New Tab
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TraderPage;