import React from 'react';
import styles from './copytrading.module.scss';

const CopyTradingPage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.scrollContainer}>
                <div className={styles.content}>
                    <div className={styles.illustration}>
                        <div className={styles.rocket}></div>
                        <div className={styles.stars}>
                            {[...Array(20)].map((_, i) => (
                                <div key={i} className={styles.star} style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 2}s`
                                }}></div>
                            ))}
                        </div>
                    </div>
                    <h1 className={styles.title}>CopyTrading is Coming Soon!</h1>
                    <p className={styles.subtitle}>
                        We're building something amazing for you. Get ready to copy the trades of top performers
                        and maximize your trading potential.
                    </p>

                    {/* Additional content to demonstrate scrolling */}
                    <div className={styles.features}>
                        <h2>Exciting Features Coming Your Way</h2>
                        <div className={styles.featureGrid}>
                            {[
                                'Real-time trade copying',
                                'Performance analytics',
                                'Risk management tools',
                                'Top trader leaderboard',
                                'Customizable copy settings',
                                'Multi-platform support'
                            ].map((feature, index) => (
                                <div key={index} className={styles.featureCard}>
                                    <div className={styles.featureIcon}>{index + 1}</div>
                                    <p>{feature}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.countdown}>
                        <div className={styles.countdownItem}>
                            <span className={styles.countdownNumber}>00</span>
                            <span className={styles.countdownLabel}>Days</span>
                        </div>
                        <div className={styles.countdownItem}>
                            <span className={styles.countdownNumber}>00</span>
                            <span className={styles.countdownLabel}>Hours</span>
                        </div>
                        <div className={styles.countdownItem}>
                            <span className={styles.countdownNumber}>00</span>
                            <span className={styles.countdownLabel}>Minutes</span>
                        </div>
                    </div>
                    <form className={styles.notifyForm}>
                        <input
                            type="email"
                            placeholder="Enter your email to get notified"
                            className={styles.emailInput}
                        />
                        <button type="submit" className={styles.notifyButton}>
                            Notify Me
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CopyTradingPage;