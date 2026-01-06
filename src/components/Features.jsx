import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './Features.css';

const features = [
    {
        title: "A17 Pro",
        subtitle: "Game-changing chip.",
        desc: "The fastest chip ever in a smartphone. Unrivaled performance for gaming and pro workflows."
    },
    {
        title: "Titanium",
        subtitle: "So strong. So light.",
        desc: "Aerospace-grade titanium design. The lightest Pro model ever."
    },
    {
        title: "48MP Main",
        subtitle: "Capture reality.",
        desc: "A pro-class camera system. Next-generation portraits and 4K ProRes video."
    }
];

export default function Features() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    return (
        <section className="features-section" ref={ref}>
            <div className="features-container">
                {features.map((f, i) => (
                    <motion.div
                        key={i}
                        className="feature-card"
                        initial={{ opacity: 0, y: 50 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: i * 0.2, ease: "easeOut" }}
                    >
                        <h3>{f.title}</h3>
                        <h4>{f.subtitle}</h4>
                        <p>{f.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
