import React, { useRef } from "react";
import { Container, Graphics, Sprite, useTick } from "@pixi/react";
import {Enemy} from "./App";

interface EnemiesProps {
    enemiesArr: Enemy[];
    setEnemies: React.Dispatch<React.SetStateAction<Enemy[]>>; // 🔥 setter átadva!
    width: number;
    height: number;
    spawnInterval?: number;
}

export const Enemies: React.FC<EnemiesProps> = ({ enemiesArr, setEnemies, width, height, spawnInterval = 100 }) => {
    const spawnCooldownRef = useRef<number>(spawnInterval);

    useTick((delta) => {
        // 🔥 Új ellenség hozzáadása a `Game` állapotába
        spawnCooldownRef.current -= delta;
        if (spawnCooldownRef.current <= 0) {
            const newEnemy: Enemy = {
                x: Math.random() * width,
                y: -50,
                speed: 2 + Math.random() * 3,
                health: 30, // 🔥 Kezdeti életerő
                maxHealth: 30, // 🔥 Eredeti életerő
                radius: 10, // 🔥 Sugár az ütközéshez
            };
            setEnemies((prev) => [...prev, newEnemy]);
            spawnCooldownRef.current = spawnInterval + Math.random() * 50;
        }

        // 🔥 Az ellenségek mozgatása
        setEnemies((prev) =>
            prev
                .map((enemy) => ({ ...enemy, y: enemy.y + enemy.speed * delta }))
                .filter((enemy) => enemy.y < height + 50)
        );
    });

    return (
        <Container>
            {enemiesArr.map((enemy, index) => {
                // 🔥 Életsáv kiszámítása az aktuális és a max életerő alapján
                const healthBarWidth = 30; // Teljes sáv szélessége
                const healthBarHeight = 5; // Sáv magassága
                const healthRatio = enemy.health / enemy.maxHealth; // Életerő aránya
                const barX = enemy.x - healthBarWidth / 2;
                const barY = enemy.y - 30; // Ellenség fölött

                return (
                    <Container key={index}>
                        {/* Életsáv */}
                        <Graphics
                            draw={(g) => {
                                g.clear();
                                g.beginFill(0xff0000); // 🔴 Piros háttér (teljes sáv)
                                g.drawRect(barX, barY, healthBarWidth, healthBarHeight);
                                g.endFill();

                                g.beginFill(0x00ff00); // 🟢 Zöld sáv (aktuális életerő)
                                g.drawRect(barX, barY, healthBarWidth * healthRatio, healthBarHeight);
                                g.endFill();
                            }}
                        />
                        {/* Ellenség sprite */}
                        <Sprite
                            image="/images/enemy.png"
                            anchor={{ x: 0.5, y: 0.5 }}
                            x={enemy.x}
                            y={enemy.y}
                            scale={{ x: 0.2, y: 0.2 }}
                        />
                    </Container>
                );
            })}
        </Container>
    );
};
