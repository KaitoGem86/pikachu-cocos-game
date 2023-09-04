import { _decorator, Component, Node, tween, Sprite, RichText, Color, Vec3, input, Event, EventMouse } from 'cc';
import { GameManager } from './GameManager';
import { StartGameManager } from './StartGameManager';
const { ccclass, property } = _decorator;

@ccclass('GameOverPanelController')
export class GameOverPanelController extends Component {

    @property(Sprite) panel: Sprite = new Sprite();
    @property(RichText) notiText: RichText = new RichText();
    @property(RichText) scoreText: RichText = new RichText();

    check: boolean = false

    onEnable() {
        if (this.node.active) {
            this.check = false;
            console.log("enable");
            this.notiText.node.scale = Vec3.ZERO;
            this.scoreText.node.scale = Vec3.ZERO;
            let c = this.panel.color;
            c = new Color(c.r, c.g, c.b, 200);
            console.log(c);
            tween(this.panel.color)
                .delay(0.1)
                .to(0.3, c, {
                    onUpdate: (target: Color) => {
                        console.log("first");
                        this.panel.color = target;
                    }
                })
                .start();
            tween(this.notiText.node.scale)
                .delay(0.3)
                .to(0.3, Vec3.ONE, {
                    easing: "backOut",
                    onUpdate: (target: Vec3) => {
                        this.notiText.node.scale = target;
                    }
                })
                .start();
            tween(this.scoreText.node.scale)
                .delay(0.6)
                .to(0.3, Vec3.ONE, {
                    easing: "backOut",
                    onUpdate: (target: Vec3) => {
                        this.scoreText.node.scale = target;
                    }
                })
                .start();
        }
    }

    start() {

    }

    update(deltaTime: number) {
        this.node.on(Node.EventType.MOUSE_DOWN, function (event) {
            if (event.getButton() === EventMouse.BUTTON_LEFT && !this.check) {
                this.onDisableWithAnim();
                this.check = true;
            }
        }, this)
    }

    onDisableWithAnim() {
        tween(this.notiText.node.scale)
            .to(0.3, Vec3.ZERO, {
                easing: "backIn",
                onUpdate: (target: Vec3) => {
                    this.notiText.node.scale = target;
                }
            })
            .start();

        tween(this.scoreText.node.scale)
            .delay(0.3)
            .to(0.3, Vec3.ZERO, {
                easing: "backIn",
                onUpdate: (target: Vec3) => {
                    this.scoreText.node.scale = target;
                }
            })
            .start();

        let c = this.panel.color;
        c = new Color(c.r, c.g, c.b, 0);
        //console.log(c);
        tween(this.panel.color)
            .delay(0.6)
            .to(0.3, c, {
                onUpdate: (target: Color) => {
                    console.log("first");
                    this.panel.color = target;
                },
                onComplete: () => {
                    //GameManager.Instance.replay_game();
                    this.node.active = false;
                    this.panel.color = new Color(c.r, c.g, c.b, 200);
                    StartGameManager.Instance.gameNode.active = false;
                    StartGameManager.Instance.node.active = true;
                }
            })
            .start();
    }

}


