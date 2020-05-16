import React from 'react';
import Draggable from 'react-draggable';
import './Player.scss';

interface IProps {
    name: string;
    num: number;
    x: number;
    y: number;
    mainColor: string;
    secondaryColor: string;
    numberColor?: string;
    id: string;
    handleDrop: (event: any) => void;
}

function Player({ name, num, x, y, mainColor, secondaryColor, numberColor, id, handleDrop }: IProps) {
    return (
        <Draggable
            bounds={{
                left: 0,
                top: 0,
                right: 320,
                bottom: 470,
            }}
            defaultPosition={{x, y}}
            onStop={handleDrop}
        >
            <div
                className="player"
                style={{
                    backgroundColor: mainColor,
                    border: `2px solid ${secondaryColor}`,
                }}
                id={id}
            >
                <div
                    className="player__num"
                    style={{
                        color: numberColor,
                    }}
                >
                    <span>{num}</span>
                </div>
                <div className="player__name">
                    <span>{name}</span>
                </div>
            </div>
        </Draggable>
    );
}

export default Player;
