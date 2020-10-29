export interface NN_ConnectionData {
    w ,b
}

export interface NN_Data {
    CD : NN_ConnectionData,
    layerCount : number,
    sizes : number[]
}