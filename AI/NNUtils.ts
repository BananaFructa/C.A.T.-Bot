import * as fs from "fs"
import {NN_ConnectionData,NN_Data} from "./NNInterfaces"
import * as Jimp from "jimp";
export function GetNNData(Path : string) : NN_Data {

    let CD : NN_ConnectionData;
    let ND : NN_Data;

    let AllText : string[] = fs.readFileSync(Path).toString().split("\n");
    let w = [];
    let b = [];
    let sizes = [];
    let layerCount : number = Number(AllText[0]);
    let I :  number = 1;

    for (let i : number = 0;i < layerCount;i++) {
        let ArrLenght : number = Number(AllText[I]);
        sizes[i+1] = ArrLenght;
        b[i] = [];
        I++;
        for (let j : number = 0;j < ArrLenght;j++) {
            b[i][j] = Number(AllText[I+j]);
        }
        I += ArrLenght;
    }
    for (let i : number = 0;i < layerCount;i++) {
        let L1 : number = Number(AllText[I]);
        if (i === 0) {
            sizes[0] = L1;
        }
        I++;
        let L2 : number = Number(AllText[I]);
        I++;
        w[i] = [];
        for (let j : number = 0;j < L1;j++) {
            w[i][j] = [];
            for (let l : number = 0;l < L2;l++) {
                w[i][j][l] = Number(AllText[I+j*L2+l]);
            }
        }
        I += L1*L2;
    }

    CD = {w,b};
    layerCount++;
    ND = {CD,layerCount,sizes};

    return ND;

}

export async function LoadPixelArrayFromUrl(Url : string,w : number,h : number,CallBack) {
    let PixelArray : number[] = [];
    Jimp.read(Url)
        .then(image => {
            image.resize(w,h);
            for (let i : number = 0;i < h;i++) {
                for (let j : number = 0;j < w;j++) {
                    let Color : number = image.getPixelColor(j,i);
                    PixelArray.push(((Color >> 24) & 0xff) / 255);
                    PixelArray.push(((Color >> 16) & 0xff) / 255);
                    PixelArray.push(((Color >> 8) & 0xff) / 255);
                }
            }
            CallBack(PixelArray);
        });  
}