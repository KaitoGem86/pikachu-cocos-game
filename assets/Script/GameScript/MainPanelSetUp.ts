import { _decorator, Component, Node, Sprite, SpriteFrame, Prefab, instantiate, Vec3, Vec2, random, randomRangeInt, CCInteger, tween } from 'cc';
import { GameManager } from './GameManager';
import { PieceController } from './PieceController';
import { SelectPieceSolution } from './SelectPieceSolution';
import { SpriteData } from './SpriteData';
const { ccclass, property } = _decorator;

@ccclass('MainPanelSetUp')
export class MainPanelSetUp extends Component {

    @property({
        type: CCInteger,
    })
    public row: number;

    @property({
        type: CCInteger,
    })
    public column: number;

    // @property({
    //     type: [SpriteFrame]
    // })
    // public sprites: SpriteFrame[] = [];

    @property({
        type: SpriteData,
        serializable: true
    })
    public data: SpriteData = new SpriteData();

    @property({
        type: Prefab
    })
    public toggleObject: Prefab;

    private objects: Node[] = [];

    public offSetX: number = 0;
    public levelCount: number = 0;

    start() {
        this.initialize_nodes_pool();
        this.initialize_sprite_data();
    }

    public set_Data(row: number, column: number, offSetX: number){
        this.row = row;
        this.column = column;
        this.offSetX = offSetX;
    }

    public initialize_nodes_pool(): void {
        let mainTween = tween(this.node);
        let arr_bool: boolean[][] = new Array(this.column);
        let pieces: PieceController[][] = new Array(this.column);
        for (let i = 0; i < this.column; i++) {
            arr_bool[i] = new Array(this.row);
            pieces[i] = new Array(this.row);
            for (let j = 0; j < this.row; j++) {
                if (i == 0 || j == 0 || i == this.column - 1 || j == this.row - 1) {
                    arr_bool[i][j] = true;
                    pieces[i][j] = new PieceController();
                    pieces[i][j].set_neighbor({ x: i, y: j });
                    continue;
                }
                arr_bool[i][j] = false;
                let t = instantiate(this.toggleObject);
                t.name = 'Piece[' + i + '][' + j + ']';
                t.setParent(this.node);
                console.log("offset + " + this.offSetX);
                t.setPosition(new Vec3(i * 64 - this.offSetX + i - 1, j * 64 - this.offSetX / 2 + j - 1, 0));
                t.getComponent(PieceController).onEnableWithAnim(((i - 1) * (this.row - 2) + j - 1) / 50);
                t.getComponent(PieceController).set_neighbor({ x: i, y: j });
                pieces[i][j] = t.getComponent(PieceController);
                this.objects.push(t);
            }
        }
        GameManager.Instance.count_pool = this.objects.length;
        SelectPieceSolution.Instance.canMoveThroughMatrix = arr_bool;
        SelectPieceSolution.Instance.piecesPool = pieces;
    }

    public reinitialize_nodes_pool(): void {
        for (let i = 0; i < this.column; i++) {
            for (let j = 0; j < this.row; j++) {
                if (i == 0 || j == 0 || i == this.column - 1 || j == this.row - 1) {
                    SelectPieceSolution.Instance.canMoveThroughMatrix[i][j] = true;
                    continue;
                }

                SelectPieceSolution.Instance.piecesPool[i][j].piece.isChecked = false;
                SelectPieceSolution.Instance.piecesPool[i][j].node.active = true;
                SelectPieceSolution.Instance.piecesPool[i][j].onEnableWithAnim(((i - 1) * (this.row - 2) + j - 1) / 50);
                SelectPieceSolution.Instance.canMoveThroughMatrix[i][j] = false;
                this.objects.push(SelectPieceSolution.Instance.piecesPool[i][j].node);
            }
            GameManager.Instance.count_pool = this.objects.length;
        }
    }

    public initialize_sprite_data(): void {
        let count = 4;
        let data: SpriteFrame[] = [];
        data = this.data.data;
        for (let k = 0; k < this.levelCount; k++) {
            for (let i = 0; i < count; i++) {
                let j = randomRangeInt(0, this.objects.length);
                let t = this.objects[j];
                t.getComponent(PieceController).setSpriteFrame(data[k]);
                this.objects.splice(j, 1);
            }
        }
    }
}


