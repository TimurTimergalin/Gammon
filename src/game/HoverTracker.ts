export class HoverTracker {
    hoveredIndex: number | null = null;
    hoverTriggerRects: Map<number, DOMRect> = new Map()

    private inBounds(x: number, y: number, box: DOMRect): boolean {
        return box.left <= x && x <= box.right && box.top <= y && y <= box.bottom
    }

    changeHoverIndex(x: number, y: number) {
        for (const [index, box] of this.hoverTriggerRects) {
            if (this.inBounds(x, y, box)) {
                this.hoveredIndex = index
                return
            }
        }
        this.hoveredIndex = null
    }
}

