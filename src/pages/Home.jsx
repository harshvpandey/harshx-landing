import React from 'react';
import PhoneScroll from '../components/PhoneScroll';
import Features from '../components/Features';
import Showcase from '../components/Showcase';
import TechSpecs from '../components/TechSpecs';
import './Home.css';

export default function Home() {
    return (
        <main className="home-page">
            <PhoneScroll />
            <Showcase />
            <Features />
            <TechSpecs />
            <section className="footer-section">
                <p className="footer-text">© 2025 HarshX. Redefining Reality.</p>
            </section>
        </main>
    );
}
