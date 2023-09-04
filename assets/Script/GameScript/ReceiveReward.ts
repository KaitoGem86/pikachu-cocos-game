import { _decorator, Component, Node, Vec3, tween, Animation, SpriteFrame, Sprite } from 'cc';
import { GameManager } from './GameManager';
import { RewardManager } from './RewardManager';
const { ccclass, property } = _decorator;

@ccclass('ReceiveReward')
export class ReceiveReward extends Component {

    openAnim: Animation;
    check: boolean = false; 

    @property({type: Sprite, serializable: true})
    public defaultFrame: Sprite = new Sprite();

    onEnable() {
        this.openAnim = this.getComponent(Animation);
        this.node.scale = new Vec3(0, 0, 0);
        let tweenDuration: number = 1;                            // Duration of the tween
        tween(this.node.scale)
            .delay(0.3)
            .to(tweenDuration, new Vec3(1, 1, 1), {                        // The interface 'to' represents the absolute value of the node
                easing: "backOut",
                onUpdate: (target: Vec3, ratio: number) => {                        // Implement ITweenOption's onUpdate callback to accept the current tweening progress
                    this.node.scale = target;                                 // Assign the position of the node to the result calculated by the tween system        
                },
            })
            .start();
    }

    public receive_reward(){
        if(!this.check){
            this.openAnim.play();
            this.check = true;
            tween(this)
            .delay(0.7)
            .to(0, null, {
                onComplete: ()=>{
                    RewardManager.Instance.receive_reward(RewardManager.Instance.define_reward());
                    this.node.active = false;
                    this.getComponent(Sprite).spriteFrame = this.defaultFrame.spriteFrame;
                    GameManager.Instance.win_game();
                    this.check = false;
                }
            })
            .start();
        }
    }
}


