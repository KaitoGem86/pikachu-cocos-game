import { _decorator, Component, Node, Sprite, Color, tween, Vec2, Vec3, easing } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('DisconnectNotifyPanelComponent')
export class DisconnectNotifyPanelComponent extends Component {

    @property(Sprite) panel = new Sprite();

    onEnable() {
        tween(this.panel.node.scale)
            .delay(0.3)
            .to(0.5, Vec3.ONE, {
                easing: "backOut",
                onUpdate: (target: Vec3) => {
                    this.panel.node.scale = target;
                }
            })
            .start();

        tween(this.panel.node.scale)
            .delay(1.5)
            .to(0.5, Vec3.ZERO, {
                easing: "backIn",
                onUpdate: (target: Vec3) => {
                    this.panel.node.scale = target;
                },
                onComplete: () => {
                    this.node.active = false;
                    if (GameManager.Instance.rearrange.can_rearrange()) {
                        GameManager.Instance.rearrange.rearrange();
                    }
                    else {
                        GameManager.Instance.game_over();
                    }
                }
            })
            .start();

    }
}


