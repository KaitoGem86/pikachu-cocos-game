import { _decorator, Component, Node, sp, Vec3, tween, Button } from 'cc';
import { BUILD } from 'cc/env';
import { GameManager } from './GameManager';
import { MainPanelSetUp } from './MainPanelSetUp';
import { StartGameManager } from './StartGameManager';
const { ccclass, property } = _decorator;

@ccclass('LevelButtonGroupController')
export class LevelButtonGroupController extends Component {

    @property(Node) title: Node = new Node();
    @property(Button) levelButton1: Button = new Button();
    @property(Button) levelButton2: Button = new Button();
    @property(Button) levelButton3: Button = new Button();

    onLoad() {
        this.levelButton1.node.on('click', this.onSelectLevelSheet, this);
        this.levelButton2.node.on('click', this.onSelectLevelSheet, this);
        this.levelButton3.node.on('click', this.onSelectLevelSheet, this);
    }

    onEnable() {
        this.levelButton1.node.scale = Vec3.ZERO;
        this.levelButton2.node.scale = Vec3.ZERO;
        this.levelButton3.node.scale = Vec3.ZERO;

        tween(this.title.scale)
            .to(0.6, Vec3.ONE, {
                easing: "backOut",
                onUpdate: (target: Vec3) => {
                    this.title.scale = target;
                }
            })
            .start();

        tween(this.levelButton1.node.scale)
            .delay(0.6)
            .to(0.6, Vec3.ONE, {
                easing: "backOut",
                onUpdate: (target: Vec3) => {
                    this.levelButton1.node.scale = target;
                }
            })
            .start();

        tween(this.levelButton2.node.scale)
            .delay(0.9)
            .to(0.6, Vec3.ONE, {
                easing: "backOut",
                onUpdate: (target: Vec3) => {
                    this.levelButton2.node.scale = target;
                }
            })
            .start();

        tween(this.levelButton3.node.scale)
            .delay(1.2)
            .to(0.6, Vec3.ONE, {
                easing: "backOut",
                onUpdate: (target: Vec3) => {
                    this.levelButton3.node.scale = target;
                }
            })
            .start();
    }


    onSelectLevelSheet(event) {
        if (event.target === this.levelButton1.node) {
            GameManager.Instance.MainPanel.row = 6;
            GameManager.Instance.MainPanel.column = 10;
            GameManager.Instance.MainPanel.offSetX = 256;
            GameManager.Instance.MainPanel.levelCount = 8;
            this.onDisableWithAnim(event.target);        }
        if (event.target === this.levelButton2.node) {
            console.log("2");
            GameManager.Instance.MainPanel.row = 8;
            GameManager.Instance.MainPanel.column = 14;
            GameManager.Instance.MainPanel.offSetX = 384;
            GameManager.Instance.MainPanel.levelCount = 18;
            this.onDisableWithAnim(event.target);
        }
        if (event.target === this.levelButton3.node) {
            GameManager.Instance.MainPanel.row = 10;
            GameManager.Instance.MainPanel.column = 18;
            GameManager.Instance.MainPanel.offSetX = 512;
            GameManager.Instance.MainPanel.levelCount = 32;
            this.onDisableWithAnim(event.target);
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
        tween(StartGameManager.Instance.title.scale)
            .to(0.6, Vec3.ZERO, {
                easing: "backIn",
                onUpdate: (target: Vec3) => {
                    StartGameManager.Instance.title.scale = target;
                }
            })
            .start();
        switch (seletedNode) {
            case this.levelButton1.node:
                tween(this.levelButton2.node.scale)
                    .delay(0.1)
                    .to(0.6, Vec3.ZERO, {
                        easing: "backIn",
                        onUpdate: (target: Vec3) => {
                            this.levelButton2.node.scale = target;
                        }
                    })
                    .start();

                tween(this.levelButton3.node.scale)
                    .delay(0.1)
                    .to(0.6, Vec3.ZERO, {
                        easing: "backIn",
                        onUpdate: (target: Vec3) => {
                            this.levelButton3.node.scale = target;
                        }
                    })
                    .start();
                break;
            case this.levelButton2.node:
                tween(this.levelButton1.node.scale)
                    .delay(0.1)
                    .to(0.6, Vec3.ZERO, {
                        easing: "backIn",
                        onUpdate: (target: Vec3) => {
                            this.levelButton1.node.scale = target;
                        }
                    })
                    .start();

                tween(this.levelButton3.node.scale)
                    .delay(0.1)
                    .to(0.6, Vec3.ZERO, {
                        easing: "backIn",
                        onUpdate: (target: Vec3) => {
                            this.levelButton3.node.scale = target;
                        }
                    })
                    .start();
                break;
            case this.levelButton3.node:
                tween(this.levelButton2.node.scale)
                    .delay(0.1)
                    .to(0.6, Vec3.ZERO, {
                        easing: "backIn",
                        onUpdate: (target: Vec3) => {
                            this.levelButton2.node.scale = target;
                        }
                    })
                    .start();

                tween(this.levelButton1.node.scale)
                    .delay(0.1)
                    .to(0.6, Vec3.ZERO, {
                        easing: "backIn",
                        onUpdate: (target: Vec3) => {
                            this.levelButton1.node.scale = target;
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
                    StartGameManager.Instance.node.active = false;
                    StartGameManager.Instance.gameNode.active = true;
                }
            })
            .start();
    }
}


