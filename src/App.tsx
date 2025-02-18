import React, { useState, useEffect } from 'react';
import {Container, Stage, useTick} from "@pixi/react";
import { StarField } from "./starfield";
import { Enemies } from "./enemies";
import { Spaceship } from "./starship";

export interface Bullet {
    x: number;
    y: number;
    vx: number;
    vy: number;
    damage: number;
    radius: number;
    collided?: boolean;
    rotation: number;
}


export interface Enemy {
    x: number;
    y: number;
    speed: number;
    health: number;
    maxHealth: number; // 🔥 Ezt hozzáadjuk, hogy tudjuk az eredeti életerőt
    radius: number;
}

const Game: React.FC = () => {
    const canvasWidth = 400;
    const canvasHeight = 800;
    const spaceshipWidth = 25;
    const minX = spaceshipWidth / 2;
    const maxX = canvasWidth - spaceshipWidth / 2;
    const spaceshipInitialX = canvasWidth / 2;
    const spaceshipY = canvasHeight - 80;

    const [bullets, setBullets] = useState<Bullet[]>([]);
    const [enemies, setEnemies] = useState<Enemy[]>([]);

    const handleCollisions = (bullets: Bullet[], enemies: Enemy[]) => {
        let bulletsToRemove = new Set<number>(); // 🔥 A lövedék indexe alapján tároljuk, amit törölni kell
        let updatedEnemies = enemies.map((enemy) => {
            let updatedHealth = enemy.health;
            let hit = false;

            bullets.forEach((bullet, bulletIndex) => {
                const dx = bullet.x - enemy.x;
                const dy = bullet.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (!hit && distance < enemy.radius + bullet.radius) {
                    updatedHealth -= bullet.damage;
                    hit = true; // 🔥 Az ellenség csak egyszer sebződik
                    bulletsToRemove.add(bulletIndex); // 🔥 Jelöljük a lövedéket törlésre
                }
            });

            return updatedHealth > 0 ? { ...enemy, health: updatedHealth } : null; // Halott ellenség törlése
        }).filter(Boolean) as Enemy[];

        // 🔥 Csak azok a lövedékek maradnak meg, amik nincsenek a `bulletsToRemove` setben
        let updatedBullets = bullets.filter((_, index) => !bulletsToRemove.has(index));

        return { updatedBullets, updatedEnemies };
    };



    useTick((delta) => {
        setBullets((prevBullets) => {
            return prevBullets
                .map((bullet) => ({
                    ...bullet,
                    x: bullet.x + bullet.vx * delta,
                    y: bullet.y + bullet.vy * delta,
                }))
                .filter(
                    (bullet) =>
                        bullet.x >= 0 &&
                        bullet.x <= canvasWidth &&
                        bullet.y >= 0 &&
                        bullet.y <= canvasHeight
                );
        });

        setEnemies((prevEnemies) => {
            return prevEnemies
                .map((enemy) => ({
                    ...enemy,
                    y: enemy.y + enemy.speed * delta,
                }))
                .filter((enemy) => enemy.y < canvasHeight + enemy.radius);
        });

        // 🔥 Ütközések kezelése külön hívásban
        setBullets((prevBullets) => {
            setEnemies((prevEnemies) => {
                const { updatedBullets, updatedEnemies } = handleCollisions(prevBullets, prevEnemies);
                setBullets(updatedBullets); // 🔥 Frissített lövedékek
                return updatedEnemies; // 🔥 Frissített ellenségek
            });
            return prevBullets; // 🔥 Az aktuális állapotot tartjuk meg, amíg az `Enemies` nem frissült
        });
    });


    return (
        <Container>
                <StarField width={canvasWidth} height={canvasHeight} count={50} />
                <Enemies setEnemies={setEnemies} width={canvasWidth} height={canvasHeight} enemiesArr={enemies} />
                <Spaceship
                    minX={minX}
                    maxX={maxX}
                    initialX={spaceshipInitialX}
                    y={spaceshipY}
                    image={'/images/spaceship.png'}
                    moveSpeed={5}
                    bulletsArray={bullets}
                 setBullets={setBullets}/>
        </Container>
    );
};

export default Game;
