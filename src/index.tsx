import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Game from "./App";
import {Stage} from "@pixi/react";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const canvasWidth = 400;
const canvasHeight = 800;

root.render(
    <React.StrictMode>
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <Stage width={canvasWidth} height={canvasHeight} options={{backgroundColor: 0x000000}}>
                <Game/>
            </Stage>
            </div>
    </React.StrictMode>
);
