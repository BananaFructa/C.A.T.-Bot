import { rejects } from "assert";
import {ChildProcess, spawn} from "child_process"

let AIProcess = spawn("py",["AI/AIRunner.py"]);

export function RunAIWithID(ID,Callback) {
    AIProcess.stdin.write("0\n");
    new Promise((resolve,reject) => {
        AIProcess.stdout.on('data',data => {
            resolve();
        });
        setTimeout(()=>{
            reject();
        },2000);
    }).then(() => {
        Callback(true);
    }).catch(() => {
        Callback(false);
    });
}