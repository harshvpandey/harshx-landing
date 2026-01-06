import React from 'react';
import './TechSpecs.css';

const specs = [
    { label: "Display", value: "6.9” Super Retina XDR" },
    { label: "Processor", value: "HarshX A17 Pro Chip" },
    { label: "Material", value: "Grade 5 Titanium" },
    { label: "Camera", value: "48MP Fusion | 5x Telephoto" },
    { label: "Colors", value: "Black Titanium, White Titanium" }
];

export default function TechSpecs() {
    return (
        <section className="tech-specs-section">
            <div className="specs-container">
                <h2>Technical Specifications</h2>
                <div className="specs-list">
                    {specs.map((spec, i) => (
                        <div key={i} className="spec-item">
                            <span className="spec-label">{spec.label}</span>
                            <span className="spec-value">{spec.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
