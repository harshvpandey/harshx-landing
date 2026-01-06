import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useScroll, useTransform, useSpring, motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows } from '@react-three/drei';
import { PhoneModel } from './PhoneModel3D';
import './PhoneScroll.css';

// Section data for snap points and content
const SECTIONS = [
    { id: 0, title: 'Intro', align: 'center' },
    { id: 1, title: 'Engineering', align: 'left' },
    { id: 2, title: 'Display', align: 'right' },
    { id: 3, title: 'Neural', align: 'left' },
    { id: 4, title: 'Outro', align: 'center' },
];

// Scene Component to handle rotation logic inside Canvas
function Scene({ scrollProgress }) {
    const phoneRef = useRef();

    // Rotate phone based on scroll
    useFrame(() => {
        if (phoneRef.current) {
            const progress = scrollProgress.get();
            const targetRotationY = progress * Math.PI * 3;
            const targetRotationX = Math.sin(progress * Math.PI * 2) * 0.2;
            phoneRef.current.rotation.y = targetRotationY;
            phoneRef.current.rotation.x = targetRotationX;
        }
    });

    return (
        <group ref={phoneRef}>
            <Float
                speed={2}
                rotationIntensity={0.2}
                floatIntensity={0.5}
                floatingRange={[-0.1, 0.1]}
            >
                <PhoneModel />
            </Float>
        </group>
    );
}

// Navigation dots component
function NavDots({ activeSection, onDotClick }) {
    return (
        <div className="nav-dots">
            {SECTIONS.map((section) => (
                <button
                    key={section.id}
                    className={`nav-dot ${activeSection === section.id ? 'active' : ''}`}
                    onClick={() => onDotClick(section.id)}
                    aria-label={`Go to ${section.title}`}
                >
                    <span className="dot-inner" />
                    <span className="dot-label">{section.title}</span>
                </button>
            ))}
        </div>
    );
}

export default function PhoneScroll() {
    const containerRef = useRef(null);
    const sectionRefs = useRef([]);
    const [activeSection, setActiveSection] = useState(0);
    const [isSnapping, setIsSnapping] = useState(false);
    const lastScrollTime = useRef(0);
    const scrollTimeout = useRef(null);

    // Scroll progress for the container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Extremely smooth spring physics
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 50,
        damping: 20,
        restDelta: 0.0001
    });

    // Calculate which section is active based on scroll progress
    useEffect(() => {
        const unsubscribe = scrollYProgress.on('change', (value) => {
            const sectionIndex = Math.round(value * (SECTIONS.length - 1));
            if (sectionIndex !== activeSection && sectionIndex >= 0 && sectionIndex < SECTIONS.length) {
                setActiveSection(sectionIndex);
            }
        });
        return () => unsubscribe();
    }, [scrollYProgress, activeSection]);

    // Smooth scroll to section with easing
    const scrollToSection = useCallback((sectionIndex) => {
        if (!containerRef.current || isSnapping) return;

        setIsSnapping(true);
        const containerHeight = containerRef.current.scrollHeight - window.innerHeight;
        const targetScroll = (sectionIndex / (SECTIONS.length - 1)) * containerHeight;

        // Use smooth scroll behavior
        window.scrollTo({
            top: containerRef.current.offsetTop + targetScroll,
            behavior: 'smooth'
        });

        setTimeout(() => setIsSnapping(false), 800);
    }, [isSnapping]);

    // Handle wheel events for snap scrolling
    useEffect(() => {
        const handleWheel = (e) => {
            const now = Date.now();

            // Debounce wheel events
            if (now - lastScrollTime.current < 100) return;
            lastScrollTime.current = now;

            // Clear existing timeout
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }

            // Set a timeout to snap after scrolling stops
            scrollTimeout.current = setTimeout(() => {
                const progress = scrollYProgress.get();
                const sectionIndex = Math.round(progress * (SECTIONS.length - 1));

                // Only snap if we're not already at a section boundary
                const expectedProgress = sectionIndex / (SECTIONS.length - 1);
                const diff = Math.abs(progress - expectedProgress);

                if (diff > 0.02 && diff < 0.15) {
                    scrollToSection(sectionIndex);
                }
            }, 150);
        };

        window.addEventListener('wheel', handleWheel, { passive: true });
        return () => {
            window.removeEventListener('wheel', handleWheel);
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        };
    }, [scrollYProgress, scrollToSection]);

    // --- Text Opacity Transforms with improved timing ---
    // Each section takes 20% of total scroll

    // Section 1: Intro (0% - 20%)
    const opacity1 = useTransform(scrollYProgress, [0, 0.08, 0.12, 0.2], [1, 1, 0.8, 0]);
    const y1 = useTransform(scrollYProgress, [0, 0.2], [0, -80]);
    const scale1 = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    // Section 2: Engineering (20% - 40%)
    const opacity2 = useTransform(scrollYProgress, [0.15, 0.25, 0.35, 0.4], [0, 1, 1, 0]);
    const y2 = useTransform(scrollYProgress, [0.2, 0.4], [60, -60]);
    const scale2 = useTransform(scrollYProgress, [0.2, 0.3, 0.35, 0.4], [0.95, 1, 1, 0.95]);

    // Section 3: Display (40% - 60%)
    const opacity3 = useTransform(scrollYProgress, [0.35, 0.45, 0.55, 0.6], [0, 1, 1, 0]);
    const y3 = useTransform(scrollYProgress, [0.4, 0.6], [60, -60]);
    const scale3 = useTransform(scrollYProgress, [0.4, 0.5, 0.55, 0.6], [0.95, 1, 1, 0.95]);

    // Section 4: Neural Engine (60% - 80%)
    const opacity4 = useTransform(scrollYProgress, [0.55, 0.65, 0.75, 0.8], [0, 1, 1, 0]);
    const y4 = useTransform(scrollYProgress, [0.6, 0.8], [60, -60]);
    const scale4 = useTransform(scrollYProgress, [0.6, 0.7, 0.75, 0.8], [0.95, 1, 1, 0.95]);

    // Section 5: Outro (80% - 100%)
    const opacity5 = useTransform(scrollYProgress, [0.75, 0.85, 1], [0, 1, 1]);
    const y5 = useTransform(scrollYProgress, [0.8, 1], [60, 0]);
    const scale5 = useTransform(scrollYProgress, [0.8, 0.9, 1], [0.95, 1, 1]);

    return (
        <div className="scroll-container" ref={containerRef}>
            {/* Navigation Dots */}
            <NavDots activeSection={activeSection} onDotClick={scrollToSection} />

            <div className="sticky-wrapper">

                {/* Progress indicator */}
                <motion.div
                    className="progress-bar"
                    style={{ scaleX: scrollYProgress }}
                />

                {/* 3D Canvas Layer */}
                <div className="canvas-layer">
                    <Canvas camera={{ position: [0, 0, 12], fov: 30 }}>
                        <color attach="background" args={['#050505']} />
                        <React.Suspense fallback={null}>
                            <ambientLight intensity={0.8} />
                            <directionalLight position={[8, 12, 6]} intensity={5} color="#ffffff" />
                            <directionalLight position={[-8, 8, -6]} intensity={6} color="#3b82f6" />
                            <directionalLight position={[8, -5, -8]} intensity={4} color="#8b5cf6" />
                            <pointLight position={[0, -12, 8]} intensity={2.5} color="#ffffff" />
                            <spotLight
                                position={[0, 0, -15]}
                                intensity={8}
                                color="#60a5fa"
                                angle={0.5}
                                penumbra={0.5}
                            />
                            <Scene scrollProgress={smoothProgress} />
                            <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2.5} far={4.5} />
                        </React.Suspense>
                    </Canvas>
                </div>

                {/* Parallax Background Text Layer */}
                <div className="parallax-bg-layer">
                    <motion.h1
                        style={{ x: useTransform(scrollYProgress, [0, 1], ["100%", "-100%"]), opacity: 0.1 }}
                        className="bg-text-big top-row"
                    >
                        TITANIUM
                    </motion.h1>
                    <motion.h1
                        style={{ x: useTransform(scrollYProgress, [0, 1], ["-100%", "100%"]), opacity: 0.1 }}
                        className="bg-text-big middle-row"
                    >
                        PERFORMANCE
                    </motion.h1>
                    <motion.h1
                        style={{ x: useTransform(scrollYProgress, [0, 1], ["50%", "-50%"]), opacity: 0.05 }}
                        className="bg-text-big bottom-row"
                    >
                        UNSTOPPABLE
                    </motion.h1>
                </div>

                {/* Text Overlays with enhanced animations */}

                {/* 1. Intro */}
                <motion.div
                    style={{ opacity: opacity1, y: y1, scale: scale1 }}
                    className="text-section align-center"
                >
                    <div className="text-content">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Harsh <span className="accent-text">X</span>.
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            Pure Performance.
                        </motion.p>
                        <motion.p
                            className="scroll-hint"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                        >
                            <span className="scroll-icon">↓</span>
                            Scroll to Explore
                        </motion.p>
                    </div>
                </motion.div>

                {/* 2. Engineering (Left) */}
                <motion.div style={{ opacity: opacity2, y: y2, scale: scale2 }} className="text-section align-left">
                    <div className="text-content">
                        <h2>Precision <span className="accent-text">Engineering</span>.</h2>
                        <p>Crafted to perfection using Aerospace Grade Titanium.</p>
                        <div className="feature-tag">
                            <span className="tag-icon">◆</span>
                            Grade 5 Titanium Alloy
                        </div>
                    </div>
                </motion.div>

                {/* 3. Display (Right) */}
                <motion.div style={{ opacity: opacity3, y: y3, scale: scale3 }} className="text-section align-right">
                    <div className="text-content">
                        <h2>Infinite <span className="accent-text">Display</span>.</h2>
                        <p>Pixels so sharp, reality looks dull.</p>
                        <div className="feature-tag">
                            <span className="tag-icon">◆</span>
                            ProMotion 120Hz OLED
                        </div>
                    </div>
                </motion.div>

                {/* 4. Neural Engine (Left) */}
                <motion.div style={{ opacity: opacity4, y: y4, scale: scale4 }} className="text-section align-left">
                    <div className="text-content">
                        <h2><span className="accent-text">Neural</span> Engine.</h2>
                        <p>16-core architecture. Powering the impossible.</p>
                        <div className="feature-tag">
                            <span className="tag-icon">◆</span>
                            35 Trillion Operations/sec
                        </div>
                    </div>
                </motion.div>

                {/* 5. Outro (Center) */}
                <motion.div style={{ opacity: opacity5, y: y5, scale: scale5 }} className="text-section align-center">
                    <div className="text-content">
                        <h2>See. Hear. <span className="accent-text">Feel</span>.</h2>
                        <p>Experience the future of connection.</p>
                        <motion.button
                            className="cta-button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Learn More
                            <span className="button-arrow">→</span>
                        </motion.button>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
