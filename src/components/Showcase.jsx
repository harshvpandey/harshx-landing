import React from 'react';
import { motion } from 'framer-motion';
import './Showcase.css';

export default function Showcase() {
    return (
        <section className="showcase-section">
            <div className="showcase-content">
                <motion.div
                    className="showcase-text"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <h2>Retina XDR</h2>
                    <p>The most advanced display ever in a smartphone. ProMotion 120Hz.</p>
                </motion.div>
                <div className="showcase-visual">
                    {/* Abstract visual representation using CSS gradients */}
                    <div className="screen-glow"></div>
                </div>
            </div>
        </section>
    );
}
