import React from 'react';
import Player from '../Player/Player';
import { IPlayer } from '../../constants/model';
import './Field.scss';

interface IProps {
    width: number;
    height: number;
    players: IPlayer[];
    mainColor: string;
    secondaryColor: string;
    numberColor: string;
    handleDrop: (event: any) => void;
}

const Field: React.FC<IProps> = ({ width, height, players, mainColor, secondaryColor, numberColor, handleDrop }: IProps) => {
    return (
        <div
            className="field"
            style={{
                maxHeight: `${height}px`,
                maxWidth: `${width}px`,
            }}
        >
            <div className="field__field-lines">
                <div className="field__grass-texture" />
                <div
                    className="field__goal-line"
                    style={{
                        top: '-2px',
                    }}
                />
                <div
                    className="field__goal-line"
                    style={{
                        bottom: '-2px'
                    }}
                />
                <div
                    className="field__penalty-line"
                    style={{
                        borderTop: 'none',
                        top: 0,
                    }}
                />
                <div
                    className="field__penalty-line"
                    style={{
                        borderBottom: 'none',
                        bottom: 0,
                    }}
                />
                <div className="field__middle-line" />
                <div className="field__middle-circle" />
            </div>
            <div className="field__drag-layer">
                {players.map(player => (
                    <Player
                        key={player.id}
                        id={player.id}
                        name={player.name}
                        num={player.num}
                        x={player.position.x}
                        y={player.position.y}
                        mainColor={mainColor}
                        secondaryColor={secondaryColor}
                        numberColor={numberColor}
                        handleDrop={handleDrop}
                    />
                ))}
            </div>
        </div>
    );
};

export default Field;
