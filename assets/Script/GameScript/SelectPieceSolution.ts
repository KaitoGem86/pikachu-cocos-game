import { _decorator, Component, Node, SpriteFrame, Sprite, ccenum, Vec3, Color } from 'cc';
import { GameManager } from './GameManager';
import { PieceController } from './PieceController';
const { ccclass, property } = _decorator;

enum LevelType {
    normal,
    toBottom,
    toAbove,
    toLeftside,
    toRightside
}

@ccclass('SelectPieceSolution')
export class SelectPieceSolution extends Component {
    private static instance: SelectPieceSolution;

    public static get Instance(): SelectPieceSolution {
        if (!this.instance) {
            this.instance = new SelectPieceSolution();
        }
        return this.instance;
    }

    public select: PieceController[] = [];

    public levelType: LevelType;

    //public matrix: { x: number, y: number, z: PieceController, t: boolean }[][] = [];
    public canMoveThroughMatrix: boolean[][] = [];
    public piecesPool: PieceController[][] = [];

    public onload() {
        SelectPieceSolution.instance = this;
    }

    start() {
        SelectPieceSolution.Instance.levelType = LevelType.normal;
    }

    public check_path_DFS(toPos: { x: number, y: number }, fromPos: { x: number, y: number }): boolean {

        return true;
    }


    //có thể sử dụng gridlayoutgroup phù hợp cho từng loại chế độ chơi, nhưng tạm thời sẽ tự code xem sao.
    //mỗi piece controller đã lưu được dữ liệu địa chỉ của nó trong ma trận cũng như địa chỉ của các neighbors
    // dựa vào dữ liệu đó sẽ dịch chuyển các neighbor theo hướng thích hợp.
    public update_pool(piece1: PieceController, piece2: PieceController): void {

        switch (SelectPieceSolution.Instance.levelType) {
            case LevelType.toAbove:
                if (piece1.pos.y < piece2.pos.y)
                    this.update_pool_toAbove(piece1, piece2);
                else
                    this.update_pool_toAbove(piece2, piece1);
                break;
            case LevelType.toBottom:
                if (piece1.pos.y > piece2.pos.y)
                    this.update_pool_toBottom(piece1, piece2);
                else
                    this.update_pool_toBottom(piece2, piece1);
                break;
            case LevelType.toLeftside:
                if (piece1.pos.x > piece2.pos.x)
                    this.update_pool_toLeftside(piece1, piece2);
                else
                    this.update_pool_toLeftside(piece2, piece1);
                break;
            case LevelType.toRightside:
                if (piece1.pos.x < piece2.pos.x)
                    this.update_pool_toRightside(piece1, piece2);
                else
                    this.update_pool_toRightside(piece2, piece1);
                break;
            default:
                this.update_pool_normal(piece1, piece2);
                //console.log("Normal");
                break;
        }
        piece1.node.getComponent(Sprite).color = new Color(191, 216, 114, 255);
        piece2.node.getComponent(Sprite).color = new Color(191, 216, 114, 255);
    }

    public update_levelType(): void {
        switch (this.levelType) {
            case LevelType.normal:
                this.levelType = LevelType.toBottom;
                break;
            case LevelType.toBottom:
                this.levelType = LevelType.toAbove;
                break;
            case LevelType.toAbove:
                this.levelType = LevelType.toLeftside;
                break;
            case LevelType.toLeftside:
                this.levelType = LevelType.toRightside;
                break;
            case LevelType.toRightside:
                this.levelType = LevelType.normal;
                break;
        }
    }

    public reset_leveltype() {
        SelectPieceSolution.Instance.levelType = LevelType.normal;
    }

    //#region : các hàm update_pool ứng với từng trường hợp
    public update_pool_normal(piece1: PieceController, piece2: PieceController): void {
        SelectPieceSolution.Instance.canMoveThroughMatrix[piece1.pos.x][piece1.pos.y] = true;
        SelectPieceSolution.Instance.canMoveThroughMatrix[piece2.pos.x][piece2.pos.y] = true;

        piece1.piece.isChecked = false;
        piece2.piece.isChecked = false;

        SelectPieceSolution.Instance.piecesPool[piece1.pos.x][piece1.pos.y].node.active = false;
        SelectPieceSolution.Instance.piecesPool[piece2.pos.x][piece2.pos.y].node.active = false;
    }

    public update_pool_toAbove(piece1: PieceController, piece2: PieceController): void {
        piece1.piece.isChecked = false;
        piece2.piece.isChecked = false;

        let tmp: SpriteFrame;
        let i = piece1.pos.y;
        console.log(i);
        while (i - 1 > 0) {
            if (!SelectPieceSolution.Instance.piecesPool[piece1.pos.x][i - 1].node.active) {
                console.log("Break " + piece1.pos.x + " " + i);
                break;
            }

            tmp = piece1.sprite.spriteFrame;
            SelectPieceSolution.Instance.piecesPool[piece1.pos.x][i].sprite.spriteFrame = SelectPieceSolution.Instance.piecesPool[piece1.pos.x][i - 1].sprite.spriteFrame;
            i--;
        }
        SelectPieceSolution.Instance.piecesPool[piece1.pos.x][i].sprite.spriteFrame = tmp;
        SelectPieceSolution.Instance.piecesPool[piece1.pos.x][i].node.active = false;
        SelectPieceSolution.Instance.canMoveThroughMatrix[piece1.pos.x][i] = true;

        i = piece2.pos.y;
        while (i - 1 > 0) {
            if (!SelectPieceSolution.Instance.piecesPool[piece2.pos.x][i - 1].node.active) {
                console.log("Break " + piece2.pos.x + " " + i);
                break;
            }
            tmp = piece2.sprite.spriteFrame;
            SelectPieceSolution.Instance.piecesPool[piece2.pos.x][i].sprite.spriteFrame = SelectPieceSolution.Instance.piecesPool[piece2.pos.x][i - 1].sprite.spriteFrame;
            i--;
        }
        console.log(piece1.name + ' 2 ' + piece2.name);
        SelectPieceSolution.Instance.piecesPool[piece2.pos.x][i].sprite.spriteFrame = tmp;
        //piece2.onDisableWithAnim(true);
        SelectPieceSolution.Instance.piecesPool[piece2.pos.x][i].node.active = false;
        SelectPieceSolution.Instance.canMoveThroughMatrix[piece2.pos.x][i] = true;
    }

    public update_pool_toBottom(piece1: PieceController, piece2: PieceController): void {
        //piece1.node.active = false;
        piece1.piece.isChecked = false;
        piece2.piece.isChecked = false;

        let tmp: SpriteFrame;
        let i = piece1.pos.y;
        console.log(i);
        while (i + 2 < SelectPieceSolution.Instance.piecesPool[1].length) {
            if (!SelectPieceSolution.Instance.piecesPool[piece1.pos.x][i + 1].node.active) {
                console.log("Break " + piece1.pos.x + " " + i);
                break;
            }

            tmp = piece1.sprite.spriteFrame;
            SelectPieceSolution.Instance.piecesPool[piece1.pos.x][i].sprite.spriteFrame = SelectPieceSolution.Instance.piecesPool[piece1.pos.x][i + 1].sprite.spriteFrame;
            i++;
        }
        SelectPieceSolution.Instance.piecesPool[piece1.pos.x][i].sprite.spriteFrame = tmp;
        SelectPieceSolution.Instance.piecesPool[piece1.pos.x][i].node.active = false;
        SelectPieceSolution.Instance.canMoveThroughMatrix[piece1.pos.x][i] = true;

        i = piece2.pos.y;
        while (i + 2 < SelectPieceSolution.Instance.piecesPool[2].length) {
            if (!SelectPieceSolution.Instance.piecesPool[piece2.pos.x][i + 1].node.active) {
                console.log("Break " + piece2.pos.x + " " + i);
                break;
            }
            tmp = piece2.sprite.spriteFrame;
            SelectPieceSolution.Instance.piecesPool[piece2.pos.x][i].sprite.spriteFrame = SelectPieceSolution.Instance.piecesPool[piece2.pos.x][i + 1].sprite.spriteFrame;
            i++;
        }
        console.log(piece1.name + ' 2 ' + piece2.name);
        SelectPieceSolution.Instance.piecesPool[piece2.pos.x][i].sprite.spriteFrame = tmp;
        SelectPieceSolution.Instance.piecesPool[piece2.pos.x][i].node.active = false;
        SelectPieceSolution.Instance.canMoveThroughMatrix[piece2.pos.x][i] = true;
    }

    public update_pool_toLeftside(piece1: PieceController, piece2: PieceController): void {
        piece1.piece.isChecked = false;
        piece2.piece.isChecked = false;

        let tmp: SpriteFrame;
        let i = piece1.pos.x;
        console.log(i);
        while (i + 2 < SelectPieceSolution.Instance.piecesPool.length) {
            if (!SelectPieceSolution.Instance.piecesPool[i + 1][piece1.pos.y].node.active) {
                console.log("Break " + piece1.pos.x + " " + i);
                break;
            }

            tmp = piece1.sprite.spriteFrame;
            SelectPieceSolution.Instance.piecesPool[i][piece1.pos.y].sprite.spriteFrame = SelectPieceSolution.Instance.piecesPool[i + 1][piece1.pos.y].sprite.spriteFrame;
            i++;
        }
        SelectPieceSolution.Instance.piecesPool[i][piece1.pos.y].sprite.spriteFrame = tmp;
        SelectPieceSolution.Instance.piecesPool[i][piece1.pos.y].node.active = false;
        SelectPieceSolution.Instance.canMoveThroughMatrix[i][piece1.pos.y] = true;
        i = piece2.pos.x;
        while (i + 2 < SelectPieceSolution.Instance.piecesPool.length) {
            if (!SelectPieceSolution.Instance.piecesPool[i + 1][piece2.pos.y].node.active) {
                console.log("Break " + piece2.pos.x + " " + i);
                break;
            }
            tmp = piece2.sprite.spriteFrame;
            SelectPieceSolution.Instance.piecesPool[i][piece2.pos.y].sprite.spriteFrame = SelectPieceSolution.Instance.piecesPool[i + 1][piece2.pos.y].sprite.spriteFrame;
            i++;
        }
        console.log(piece1.name + ' 2 ' + piece2.name);
        SelectPieceSolution.Instance.piecesPool[i][piece2.pos.y].sprite.spriteFrame = tmp;
        SelectPieceSolution.Instance.piecesPool[i][piece2.pos.y].node.active = false;
        SelectPieceSolution.Instance.canMoveThroughMatrix[i][piece2.pos.y] = true;
    }

    public update_pool_toRightside(piece1: PieceController, piece2: PieceController): void {
        piece1.piece.isChecked = false;
        piece2.piece.isChecked = false;

        let tmp: SpriteFrame;
        let i = piece1.pos.x;
        console.log(i);
        while (i - 1 > 0) {
            if (!SelectPieceSolution.Instance.piecesPool[i - 1][piece1.pos.y].node.active) {
                console.log("Break " + piece1.pos.x + " " + i);
                break;
            }

            tmp = piece1.sprite.spriteFrame;
            SelectPieceSolution.Instance.piecesPool[i][piece1.pos.y].sprite.spriteFrame = SelectPieceSolution.Instance.piecesPool[i - 1][piece1.pos.y].sprite.spriteFrame;
            i--;
        }
        SelectPieceSolution.Instance.piecesPool[i][piece1.pos.y].sprite.spriteFrame = tmp;
        SelectPieceSolution.Instance.piecesPool[i][piece1.pos.y].node.active = false;
        SelectPieceSolution.Instance.canMoveThroughMatrix[i][piece1.pos.y] = true;

        i = piece2.pos.x;
        while (i - 1 > 0) {
            if (!SelectPieceSolution.Instance.piecesPool[i - 1][piece2.pos.y].node.active) {
                console.log("Break " + piece2.pos.x + " " + i);
                break;
            }
            tmp = piece2.sprite.spriteFrame;
            SelectPieceSolution.Instance.piecesPool[i][piece2.pos.y].sprite.spriteFrame = SelectPieceSolution.Instance.piecesPool[i - 1][piece2.pos.y].sprite.spriteFrame;
            i--;
        }
        console.log(piece1.name + ' 2 ' + piece2.name);
        SelectPieceSolution.Instance.piecesPool[i][piece2.pos.y].sprite.spriteFrame = tmp;
        SelectPieceSolution.Instance.piecesPool[i][piece2.pos.y].node.active = false;
        SelectPieceSolution.Instance.canMoveThroughMatrix[i][piece2.pos.y] = true;
    }
    //#endregion
}


