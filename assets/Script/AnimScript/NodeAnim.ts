import { _decorator, Component, Node, tween, Vec3, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NodeAnim')
export class NodeAnim extends Component {
    // onEnable() {
    //     this.node.scale = new Vec3(0,0,0);
    //     let tweenDuration: number = 1;                            // Duration of the tween
    //     let t = tween(this.node.scale)
    //         .to(tweenDuration, new Vec3(1, 1, 0), {                        // The interface 'to' represents the absolute value of the node
    //             easing: "backOut",
    //             onUpdate: (target: Vec3, ratio: number) => {                        // Implement ITweenOption's onUpdate callback to accept the current tweening progress
    //                 this.node.scale = target;                                 // Assign the position of the node to the result calculated by the tween system        
    //             },
    //             onComplete: ()=>{
    //                 this.node.scale = new Vec3(1,1,0);
    //                 t.stop();
    //             }
    //         }).start();
    // }

    onDisable(){
        console.log("Disable");
        let tweenDuration: number = 1;                            // Duration of the tween
        tween(this.node.scale)
            .to(tweenDuration, new Vec3(0, 0, 0), {                        // The interface 'to' represents the absolute value of the node
                easing: "backIn",
                onUpdate: (target: Vec3, ratio: number) => {                        // Implement ITweenOption's onUpdate callback to accept the current tweening progress
                    this.node.scale = target;                                 // Assign the position of the node to the result calculated by the tween system        
                },
                onComplete: () => {
                    this.node.active = false;
                }
            }).start();
    }

    private timer: number = 4;
    private check: boolean = false;

    update(deltaTime: number) {
        // if(this.timer < 0){
        //     if(!this.check){
        //         this.onDisable();
        //         this.check = true;
        //     }
        // }
        // else {
        //     this.timer -= deltaTime;
        // }
    }
}


