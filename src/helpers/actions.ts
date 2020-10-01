/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
import html2canvas from 'html2canvas';
import axios from 'axios';
import { api, lineupUrl } from 'constants/constants';
import { IPlayer, ITactic, IPosition } from '../constants/model';

function getPlayerPositions(): IPosition[] {
    const players = document.getElementsByClassName('player');
    const positions = [];

    for (let i = 0; i < players.length; i += 1) {
        try {
            const player = players[i] as HTMLElement;
            const styleStr = player.style.transform;
            const position = styleStr.split('(')[1].split(')')[0].split(',');
            positions.push({
                x: parseInt(position[0], 10),
                y: parseInt(position[1], 10),
            });
        } catch (error) {
            console.log(error);
        }
    }
    return positions;
}

export function capture(element: HTMLElement): Promise<void | HTMLCanvasElement> {
    window.scrollTo(0, 0);
    const vp = document.getElementById('viewportMeta')?.getAttribute('content');
    document.getElementById('viewportMeta')?.setAttribute('content', 'width=800');
    return html2canvas(element).then((canvas: HTMLCanvasElement) => {
        const link = document.createElement('a');
        link.download = 'tactic.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).then(() => {
        document.getElementById('viewportMeta')?.setAttribute('content', vp || 'width=device-width, initial-scale=1.0');
    });
}

function encodeData(name = 'default', mainColor: string, secondaryColor: string, numberColor: string, players: IPlayer[]) {
    const positions = getPlayerPositions();

    const data: ITactic = {
        name,
        date: new Date(),
        main_color: mainColor,
        secondary_color: secondaryColor,
        number_color: numberColor,
        players: players.map((player, index) => {
            player.position = positions[index];
            return player;
        }),
        user_id: '0',
    };

    const encodedData = btoa(JSON.stringify(data));
    return encodedData;
}

export function save(name = 'default', mainColor: string, secondaryColor: string, numberColor: string, players: IPlayer[]): void {
    const encodedData = encodeData(name, mainColor, secondaryColor, numberColor, players);
    const link = document.createElement('a');
    link.download = `voety_${name}.tac`;
    link.href = `data:text/plain;charset=utf-8,${encodedData}`;
    link.click();
}

export function load(
    setName: (name: string) => void,
    setMainColor: (color: string) => void,
    setSecondaryColor: (color: string) => void,
    setNumberColor: (color: string) => void,
    setPlayers: (players: IPlayer[]) => void,
): void {
    const input = document.createElement('input');
    input.onchange = () => {
        try {
            if (input?.files?.length) {
                const file = input.files[0];
                const reader = new FileReader();

                reader.onload = () => {
                    if (reader?.result) {
                        const data = JSON.parse(atob(reader.result.toString()));
                        setName(data.name);
                        setMainColor(data.main_color);
                        setSecondaryColor(data.secondary_color);
                        setNumberColor(data.number_color);
                        setPlayers(data.players);
                    }
                };

                reader.readAsText(file);
            }
        } catch (e) {
            console.log(e);
        }
    };
    input.type = 'file';
    input.click();
}

export async function share(
    name = 'default',
    mainColor: string,
    secondaryColor: string,
    numberColor: string,
    players: IPlayer[],
    setSpinner: (status: boolean) => void = () => { console.log('context error'); },
): Promise<string> {
    setSpinner(true);
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    try {
        const positions = getPlayerPositions();
        // const xhr = new XMLHttpRequest();
        // xhr.open('POST', `${api}/lineups`, true);
        // xhr.setRequestHeader('Content-Type', 'application/json');
        // xhr.onreadystatechange = function () { // Call a function when the state changes.
        //     if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        //         // Request finished. Do processing here.
        //         console.log('donduuu', this);
        //     }
        // };
        // xhr.send(JSON.stringify({
        //     name,
        //     date: `${new Date()}`,
        //     main_color: mainColor,
        //     secondary_color: secondaryColor,
        //     number_color: numberColor,
        //     players: JSON.stringify(players.map((player, index) => {
        //         player.position = positions[index];
        //         return player;
        //     })),
        //     user_id: '0',
        //     version: '2',
        // }));
        const res = await axios.post(`${api}/lineups`, {
            name,
            date: `${new Date()}`,
            main_color: mainColor,
            secondary_color: secondaryColor,
            number_color: numberColor,
            players: JSON.stringify(players.map((player, index) => {
                player.position = positions[index];
                return player;
            })),
            user_id: '0',
            version: '2',
        });
        setSpinner(false);
        if (res.status === 201) {
            return `${lineupUrl}/${res.data?.id}`;
        }
        return 'error';
    } catch (e) {
        console.log(e);
        setSpinner(false);
        return 'error';
    }
}

export async function loadSharedLineup(
    id: string,
    setName: (name: string) => void,
    setMainColor: (color: string) => void,
    setSecondaryColor: (color: string) => void,
    setNumberColor: (color: string) => void,
    setPlayers: (players: IPlayer[]) => void,
    setSpinner: (status: boolean) => void = () => { console.log('context error'); },
): Promise<any> {
    setSpinner(true);
    try {
        const res = await axios.get(`${api}/lineups/${id}`);
        setName(res.data.name);
        setMainColor(res.data.main_color);
        setSecondaryColor(res.data.secondary_color);
        setNumberColor(res.data.number_color);
        setPlayers(JSON.parse(res.data.players));
        setSpinner(false);
    } catch (e) {
        console.log(e);
        setSpinner(false);
    }
}
