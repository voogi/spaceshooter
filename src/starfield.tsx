import React from "react";
import * as PIXI from "pixi.js";
import {Container, Graphics, useTick} from "@pixi/react";

interface Star {
    x: number;
    y: number;
    speed: number;
    radius: number;
    color: number;
}

export const StarField: React.FC<{ width: number; height: number; count: number }> = ({ width, height, count }) => {
    // Előre definiált színek: fehér, halvány sárga, halvány kék
    const starColors = [0xFFFFFF, 0xFFFFE0, 0xADD8E6];

    // Csillagok generálása véletlenszerű mérettel és színnel
    const stars = React.useRef<Star[]>(
        Array.from({ length: count }, () => {
            const radius = Math.random() * 2 + 1; // méret 1-3 px között
            const color = starColors[Math.floor(Math.random() * starColors.length)];
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                speed: 1 + Math.random() * 3, // sebesség 1-4 px/frame
                radius,
                color,
            };
        })
    );

    const containerRef = React.useRef<PIXI.Container>(null);

    useTick((delta) => {
        if (!containerRef.current) return;
        containerRef.current.children.forEach((child, index) => {
            const star = stars.current[index];
            star.y += star.speed * delta;
            if (star.y > height) {
                star.y = 0;
                star.x = Math.random() * width;
            }
            child.position.set(star.x, star.y);
        });
    });

    return (
        <Container ref={containerRef}>
            {stars.current.map((star, index) => (
                <Graphics
                    key={index}
                    draw={(g) => {
                        g.clear();
                        g.beginFill(star.color);
                        g.drawCircle(0, 0, star.radius);
                        g.endFill();
                    }}
                    x={star.x}
                    y={star.y}
                />
            ))}
        </Container>
    );
};
