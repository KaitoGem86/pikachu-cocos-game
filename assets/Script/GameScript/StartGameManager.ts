import { _decorator, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StartGameManager')
export class StartGameManager extends Component {

    private static instance: StartGameManager;
    public static get Instance() : StartGameManager{
        if(!this.instance){
            this.instance = new StartGameManager();
        }
        return this.instance;
    }

    @property(Node) title: Node = new Node();
    @property(Node) spriteButtonGroup: Node = new Node();
    @property(Node) levelButtonGroup: Node = new Node();
    @property(Node) gameNode: Node = new Node();

    public onLoad(){
        StartGameManager.instance = this;
    }

    onEnable() {
        tween(this.title.scale)
        .to(0.6, Vec3.ONE, {
            easing: "backOut",
            onUpdate: (target: Vec3) => {
                this.title.scale = target;
            },
            onComplete: () => {
                this.spriteButtonGroup.active = true;
            }
        })
        .start();
    }
}


