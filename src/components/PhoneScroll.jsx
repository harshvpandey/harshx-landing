import React, { useRef, Suspense } from 'react';
import { useScroll, useTransform, useSpring, motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows } from '@react-three/drei';
import { PhoneModel } from './PhoneModel3D';
import './PhoneScroll.css';

// Scene Component to handle rotation logic inside Canvas
function Scene({ scrollProgress }) {
    const phoneRef = useRef();

    // Rotate phone based on scroll
    useFrame(() => {
        if (phoneRef.current) {
            // Get current scroll value (0 to 1)
            const progress = scrollProgress.get();

            // Rotation Logic:
            // Y-axis: 1.5 revolutions (enough to showcase all sides)
            // X-axis: Gentle tilt
            const targetRotationY = progress * Math.PI * 3; // 540 degrees total
            const targetRotationX = Math.sin(progress * Math.PI * 2) * 0.2; // Reduced tilt

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

export default function PhoneScroll() {
    const containerRef = useRef(null);

    // Scroll progress for the container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Extremely smooth spring physics
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 40,
        damping: 15,
        restDelta: 0.0001
    });

    // --- Text Opacity Transforms (Repacked for 5 sections) ---
    // Total Scroll Range: 0 to 1

    // Section 1: Intro (0% - 15%)
    const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.15], [1, 1, 0]);
    const y1 = useTransform(scrollYProgress, [0, 0.15], [0, -50]);

    // Section 2: Engineering (20% - 35%)
    const opacity2 = useTransform(scrollYProgress, [0.2, 0.25, 0.3, 0.35], [0, 1, 1, 0]);
    const y2 = useTransform(scrollYProgress, [0.2, 0.35], [50, -50]);

    // Section 3: Display (40% - 55%)
    const opacity3 = useTransform(scrollYProgress, [0.4, 0.45, 0.5, 0.55], [0, 1, 1, 0]);
    const y3 = useTransform(scrollYProgress, [0.4, 0.55], [50, -50]);

    // Section 4: Neural Engine (60% - 75%)
    const opacity4 = useTransform(scrollYProgress, [0.6, 0.65, 0.7, 0.75], [0, 1, 1, 0]);
    const y4 = useTransform(scrollYProgress, [0.6, 0.75], [50, -50]);

    // Section 5: Outro (80% - 100%)
    const opacity5 = useTransform(scrollYProgress, [0.8, 0.85, 1], [0, 1, 1]);
    const y5 = useTransform(scrollYProgress, [0.8, 1], [50, 0]);


    return (
        <div className="scroll-container" ref={containerRef}>
            <div className="sticky-wrapper">

                {/* 3D Canvas Layer */}
                <div className="canvas-layer">
                    <Canvas camera={{ position: [0, 0, 12], fov: 30 }}>
                        {/* Background color to match page */}
                        <color attach="background" args={['#050505']} />

                        <Suspense fallback={null}>
                            {/* === ENHANCED LIGHTING FOR EDGE DEFINITION === */}

                            {/* Ambient Base (subtle fill) */}
                            <ambientLight intensity={0.8} />

                            {/* Main Key Light (top-right, strong) */}
                            <directionalLight position={[8, 12, 6]} intensity={5} color="#ffffff" />

                            {/* Rim Lights (define edges against black background) */}
                            <directionalLight position={[-8, 8, -6]} intensity={6} color="#3b82f6" />
                            <directionalLight position={[8, -5, -8]} intensity={4} color="#8b5cf6" />

                            {/* Fill Light (bottom, prevents pure black shadows) */}
                            <pointLight position={[0, -12, 8]} intensity={2.5} color="#ffffff" />

                            {/* Back Rim (separates phone from background) */}
                            <spotLight
                                position={[0, 0, -15]}
                                intensity={8}
                                color="#60a5fa"
                                angle={0.5}
                                penumbra={0.5}
                            />

                            <Scene scrollProgress={smoothProgress} />

                            <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2.5} far={4.5} />
                        </Suspense>
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

                {/* Text Overlays */}

                {/* 1. Intro */}
                <motion.div style={{ opacity: opacity1, y: y1 }} className="text-section align-center">
                    <div className="text-content">
                        <h2>Harsh <span style={{ color: '#3b82f6' }}>X</span>.</h2>
                        <p>Pure Performance.</p>
                        <p className="scroll-hint">Scroll to Explore ↓</p>
                    </div>
                </motion.div>

                {/* 2. Engineering (Left) */}
                <motion.div style={{ opacity: opacity2, y: y2 }} className="text-section align-left">
                    <div className="text-content">
                        <h2>Precision Engineering.</h2>
                        <p>Crafted to perfection using Aerospace Grade Titanium.</p>
                    </div>
                </motion.div>

                {/* 3. Display (Right) */}
                <motion.div style={{ opacity: opacity3, y: y3 }} className="text-section align-right">
                    <div className="text-content">
                        <h2>Infinite Display.</h2>
                        <p>Pixels so sharp, reality looks dull.</p>
                    </div>
                </motion.div>

                {/* 4. Neural Engine (Left) */}
                <motion.div style={{ opacity: opacity4, y: y4 }} className="text-section align-left">
                    <div className="text-content">
                        <h2>Neural Engine.</h2>
                        <p>16-core architecture. Powering the impossible.</p>
                    </div>
                </motion.div>

                {/* 5. Outro (Center) */}
                <motion.div style={{ opacity: opacity5, y: y5 }} className="text-section align-center">
                    <div className="text-content">
                        <h2>See. Hear. Feel.</h2>
                        <p>Experience the future of connection.</p>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
