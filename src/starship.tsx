import React, { useEffect, useRef } from "react";
import { Container, Sprite, useTick } from "@pixi/react";
import {Bullet} from "./App";

interface SpaceshipProps {
    minX: number;
    maxX: number;
    initialX: number;
    y: number;
    image: string;
    moveSpeed?: number;
    bulletsArray: Bullet[];
    setBullets: React.Dispatch<React.SetStateAction<Bullet[]>>; // 🔥 Setter prop!
}

export const Spaceship: React.FC<SpaceshipProps> = ({ bulletsArray, setBullets, minX, maxX, initialX, y, image, moveSpeed = 5 }) => {
    const [x, setX] = React.useState(initialX);
    const [rotation, setRotation] = React.useState(0);

    const spaceshipXRef = useRef(initialX);
    const rotationRef = useRef(0);
    const keys = useRef({ left: false, right: false });
    const isShootingRef = useRef(false);
    const bulletCooldownRef = useRef(0);
    const fireRate = 20;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') keys.current.left = true;
            if (e.key === 'ArrowRight') keys.current.right = true;
            if (e.code === 'Space') isShootingRef.current = true;
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') keys.current.left = false;
            if (e.key === 'ArrowRight') keys.current.right = false;
            if (e.code === 'Space') {
                isShootingRef.current = false;
                bulletCooldownRef.current = 0;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useTick((delta) => {
        let newX = x;
        let newRotation = 0;
        if (keys.current.left && !keys.current.right) {
            newX = Math.max(minX, newX - moveSpeed * delta);
            newRotation = -0.1;
        } else if (keys.current.right && !keys.current.left) {
            newX = Math.min(maxX, newX + moveSpeed * delta);
            newRotation = 0.1;
        }
        if (newX !== x) {
            setX(newX);
            spaceshipXRef.current = newX;
        }
        if (newRotation !== rotation) {
            setRotation(newRotation);
            rotationRef.current = newRotation;
        }

        if (isShootingRef.current) {
            bulletCooldownRef.current -= delta;
            if (bulletCooldownRef.current <= 0) {
                const bulletSpeed = 10;
                const bulletOffset = 50;
                const currentX = spaceshipXRef.current;
                const currentRotation = rotationRef.current;
                const bulletStartX = currentX + bulletOffset * Math.sin(currentRotation);
                const bulletStartY = y - bulletOffset * Math.cos(currentRotation);
                const bulletVx = bulletSpeed * Math.sin(currentRotation);
                const bulletVy = -bulletSpeed * Math.cos(currentRotation);

                setBullets(prev => [
                    ...prev,
                    {
                        x: bulletStartX,
                        y: bulletStartY,
                        vx: bulletVx,
                        vy: bulletVy,
                        rotation: currentRotation,
                        damage: 10,
                        radius: 50
                    },
                ]);
                bulletCooldownRef.current = fireRate;
            }
        }
    });

    return (
        <Container>
            {bulletsArray.map((bullet, index) => (
                <Sprite
                    key={index}
                    image="/images/bullet.png"
                    anchor={{ x: 0.5, y: 0.5 }}
                    x={bullet.x}
                    y={bullet.y}
                    rotation={bullet.rotation}
                    scale={{ x: 0.1, y: 0.1 }}
                />
            ))}
            <Sprite
                image={image}
                scale={.4}
                anchor={{ x: 0.5, y: 0.5 }}
                x={x}
                y={y}
                rotation={rotation}
            />
        </Container>
    );
};
