import {NN_ConnectionData,NN_Data} from "./NNInterfaces"
export function NNRunConvolutional(Input : number[],ND : NN_Data) : number[] {

    let CD : NN_ConnectionData = ND.CD;

    let LastActivation : number[] = Input;
    let CurrentActivation : number[] = [];

    for (let l : number = 0; l < ND.layerCount-1;l++) {
        CurrentActivation = [];
        for (let i : number = 0;i < ND.sizes[l+1];i++) {
            let sum : number = 0;
            for (let j : number = 0;j < ND.sizes[l];j++) {
                sum += LastActivation[j] * CD.w[l][j][i];
            }
            // TODO: Maybe add some more activation functions other than just the sigmoid
            CurrentActivation[i] = 1/(1+Math.exp(-sum-CD.b[l][i]));
        }
        LastActivation = CurrentActivation;
    }

    return CurrentActivation;

}