import { _decorator, Component, Node, sp, Vec3, tween, Button, SpriteFrame } from 'cc';
import { GameManager } from './GameManager';
import { StartGameManager } from './StartGameManager';
const { ccclass, property } = _decorator;

@ccclass('SpriteButtonGroupController')
export class SpriteButtonGroupController extends Component {

    @property(Node) title: Node = new Node();
    @property(Button) spriteButton1: Button = new Button();
    @property(Button) spriteButton2: Button = new Button();
    @property(Button) spriteButton3: Button = new Button();
    @property([SpriteFrame]) pokemonSpriteSheet: SpriteFrame[] = [];
    @property([SpriteFrame]) candySpriteSheet: SpriteFrame[] = [];
    @property([SpriteFrame]) animalSpriteSheet: SpriteFrame[] = [];

    onLoad() {
        this.spriteButton1.node.on('click', this.onSelectSpriteSheet, this);
        this.spriteButton2.node.on('click', this.onSelectSpriteSheet, this);
        this.spriteButton3.node.on('click', this.onSelectSpriteSheet, this);
    }

    onEnable() {
        this.spriteButton1.node.scale = Vec3.ZERO;
        this.spriteButton2.node.scale = Vec3.ZERO;
        this.spriteButton3.node.scale = Vec3.ZERO;

        tween(this.title.scale)
            .to(0.6, Vec3.ONE, {
                easing: "backOut",
                onUpdate: (target: Vec3) => {
                    this.title.scale = target;
                }
            })
            .start();

        tween(this.spriteButton1.node.scale)
            .delay(0.6)
            .to(0.6, Vec3.ONE, {
                easing: "backOut",
                onUpdate: (target: Vec3) => {
                    this.spriteButton1.node.scale = target;
                }
            })
            .start();

        tween(this.spriteButton2.node.scale)
            .delay(0.9)
            .to(0.6, Vec3.ONE, {
                easing: "backOut",
                onUpdate: (target: Vec3) => {
                    this.spriteButton2.node.scale = target;
                }
            })
            .start();

        tween(this.spriteButton3.node.scale)
            .delay(1.2)
            .to(0.6, Vec3.ONE, {
                easing: "backOut",
                onUpdate: (target: Vec3) => {
                    this.spriteButton3.node.scale = target;
                }
            })
            .start();
    }


    onSelectSpriteSheet(event) {
        if (event.target === this.spriteButton1.node) {
            GameManager.Instance.MainPanel.data.data = this.pokemonSpriteSheet;
            this.onDisableWithAnim(event.target);
        }
        if (event.target === this.spriteButton2.node) {
            GameManager.Instance.MainPanel.data.data = this.animalSpriteSheet;
            this.onDisableWithAnim(event.target);
            console.log("Select Sprite Sheet 2");
        }
        if (event.target === this.spriteButton3.node) {
            GameManager.Instance.MainPanel.data.data = this.candySpriteSheet;
            this.onDisableWithAnim(event.target);
            console.log("Select Sprite Sheet 3");
        }
    }

    onDisableWithAnim(seletedNode: Node) {
        tween(this.title.scale)
            .to(0.6, Vec3.ZERO, {
                easing: "backIn",
                onUpdate: (target: Vec3) => {
                    this.title.scale = target;
                }
            })
            .start();
        switch (seletedNode) {
            case this.spriteButton1.node:
                tween(this.spriteButton2.node.scale)
                    .delay(0.1)
                    .to(0.6, Vec3.ZERO, {
                        easing: "backIn",
                        onUpdate: (target: Vec3) => {
                            this.spriteButton2.node.scale = target;
                        }
                    })
                    .start();

                tween(this.spriteButton3.node.scale)
                    .delay(0.1)
                    .to(0.6, Vec3.ZERO, {
                        easing: "backIn",
                        onUpdate: (target: Vec3) => {
                            this.spriteButton3.node.scale = target;
                        }
                    })
                    .start();
                break;
            case this.spriteButton2.node:
                tween(this.spriteButton1.node.scale)
                    .delay(0.1)
                    .to(0.6, Vec3.ZERO, {
                        easing: "backIn",
                        onUpdate: (target: Vec3) => {
                            this.spriteButton1.node.scale = target;
                        }
                    })
                    .start();

                tween(this.spriteButton3.node.scale)
                    .delay(0.1)
                    .to(0.6, Vec3.ZERO, {
                        easing: "backIn",
                        onUpdate: (target: Vec3) => {
                            this.spriteButton3.node.scale = target;
                        }
                    })
                    .start();
                break;
            case this.spriteButton3.node:
                tween(this.spriteButton2.node.scale)
                    .delay(0.1)
                    .to(0.6, Vec3.ZERO, {
                        easing: "backIn",
                        onUpdate: (target: Vec3) => {
                            this.spriteButton2.node.scale = target;
                        }
                    })
                    .start();

                tween(this.spriteButton1.node.scale)
                    .delay(0.1)
                    .to(0.6, Vec3.ZERO, {
                        easing: "backIn",
                        onUpdate: (target: Vec3) => {
                            this.spriteButton1.node.scale = target;
                        }
                    })
                    .start();
                break;
        }
        tween(seletedNode.scale)
            .delay(0.6)
            .to(0.6, Vec3.ZERO, {
                easing: "backIn",
                onUpdate: (target: Vec3) => {
                    seletedNode.scale = target;
                },
                onComplete: () => {
                    this.node.active = false;
                    StartGameManager.Instance.levelButtonGroup.active = true;
                }
            })
            .start();
    }
}


