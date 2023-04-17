interface Block{
    id: number;
    form: number[][];
}

interface LayoutResult{
    blockId: number;
    position: number;
    isRotated: boolean;
}

// const blocks = [
//     {
//         "id": 738,
//         "form": [
//             [1, 0],
//             [1, 1]
//         ]
//     },
//     {
//         "id": 841,
//         "form": [
//             [1, 1],
//             [0, 1]
//         ]
    
//     }];

// const blocks = [
//     {
//         "id": 443,
//         "form": [
//             [1, 0, 1],
//             [1, 1, 1]
//         ]
//     },
//     {
//         "id": 327,
//         "form": [
//             [0, 1, 0],
//             [1, 1, 1],
//             [1, 1, 1],
//             [1, 1, 0],
//             [0, 1, 0]
//         ]
    
//     },
//     {
//         "id": 891,
//         "form": [
//             [0, 0, 1],
//             [1, 0, 1],
//             [1, 1, 1],
//         ]
    
//     }];

// const blocks = [
//     {
//         "id": 4892,
//         "form": [
//             [0, 0, 1],
//             [1, 0, 1],
//             [1, 1, 1],
//             [1, 1, 1],
//             [1, 1, 1],
//             [1, 1, 1],
//             [1, 1, 1],
//             [1, 1, 1],
//         ]
//     },
//     {
//         "id": 1839,
//         "form": [
//             [1, 1, 1],
//             [1, 1, 1],
//             [1, 1, 1],
//             [1, 1, 1],
//             [1, 1, 1],
//             [1, 0, 0]
//         ]

//     },
//     {
//         "id": 8183,
//         "form": [
//             [0, 1, 1],
//             [1, 1, 1],
//             [1, 1, 1],
//             [1, 1, 0],
//             [0, 1, 0],
//         ]
// }];

const blocks = [
    {
        "id": 1,
        "form": [
            [1, 0, 1],
            [1, 1, 1],
            [1, 1, 1],
        ]
    },
    {
        "id": 2,
        "form": [
            [0, 0, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
        ]
    
    },
    {
        "id": 3,
        "form": [
            [0, 1, 1],
            [1, 1, 1],
            [0, 1, 0],
        ]
    
    }];




function layout(blocks: Block[]): LayoutResult[]{
    //MAKE GRID
    const gridWidth = blocks[0].form[0].length;

    let gridHeight: number = 0;
    for(const block of blocks){
        gridHeight += block.form.length
    }
    gridHeight -= blocks.length - 1;

    const grid: number[][] = Array.from({length: gridHeight}, () => Array(gridWidth).fill(0));
    console.log(grid);

    //CONSTS
    let result: LayoutResult[] = [];
    let row = grid.length - 1;
    let position = 1;
    let currBlocks = blocks;

    
//FUNCTIONS ------------------------------------------------------------------------------------------------------------------//
    const canPlaceBlock = (row: number, form: number[][]): boolean => {

        let blockZone = 0;
            for(let j = form.length - 1; j >= 0; j--){
                if(form[j].some(elem => elem == 0)){
                    blockZone++;
                }
                else break;
            }
    
        let gridZone = 0;
        for(let i = 0; i < form.length - 1; i++){
            if(form[i].some(elem => elem == 0)){
                gridZone++;
            }
            else break;
        }
    
        (blockZone > gridZone) ? gridZone = blockZone : gridZone = gridZone;
    
        let sumBlockRow = [];
        (gridZone == 0) ? gridZone = gridZone : gridZone = 1;
        if(gridZone !=0 ){
            for(let i = 0; i < gridZone; i++){
                let sumRow = [];
                for(let j = 0; j < gridWidth; j++){
                    sumRow.push(form[form.length - 1 - i][j] + grid[row - i][j]);
                }
                sumBlockRow.push(sumRow);
            }
        }
        else{
            let i = 0;
                let sumRow = [];
                for(let j = 0; j < gridWidth; j++){
                    sumRow.push(form[form.length - 1 - i][j] + grid[row - i][j]);
                }
                sumBlockRow.push(sumRow);
        
        }
    
        let result: boolean;
        sumBlockRow.every(elem => elem.every(elem => elem == 1)) ? result = true : result = false;
        return result;
        
    };
    
    const placeBlock = (row: number, form: number[][]): void => {
        for (let i = form.length - 1; i >= 0; i--) {
            for (let j = gridWidth - 1; j >= 0; j--) {
                if (form[i][j] == 1) {
                    grid[row - form.length + i + 1][j] = 1;
                }
            }
        }
    };
    
    function rotateBlock(block: Block): Block {
        const numRows = block.form.length;
        const numCols = block.form[0].length;
        let form: number[][] = [];
    
        for (let i = numRows - 1; i >= 0; i--) {
            form.push([]);
            for (let j = numCols - 1; j >= 0; j--) {
                form[numRows - 1 - i].push(block.form[i][j]);
            }
        }
    
        const rotatedBlock: Block = {
            id: block.id,
            form: form,
            }
        return rotatedBlock;
    };
//----------------------------------------------------------------------------------------------------------------------------//

    while(currBlocks.length > 0){
        for (let i = 0; i < currBlocks.length; i++){

            let gridZone = 0;
            for(let j = 0; j < currBlocks[i].form.length - 1; j++){
                if(currBlocks[i].form[j].some(elem => elem == 0)){
                    gridZone++;
                }
                else break;
            }
            let blockZone = 0;
            for(let j = currBlocks[i].form.length - 1; j >= 0; j--){
                if(currBlocks[i].form[j].some(elem => elem == 0)){
                    blockZone++;
                }
                else break;
            }   

            if(canPlaceBlock(row, currBlocks[i].form)){ 
                result.push({
                    blockId: currBlocks[i].id,
                    position: position,
                    isRotated: false,
                });

                placeBlock(row, currBlocks[i].form);
                row += gridZone - currBlocks[i].form.length; 
                position += 1;
                currBlocks.splice(i, 1);
                
            }
            else{
                let rotBlock = rotateBlock(currBlocks[i]);
                gridZone = 0; 
                for(let j = currBlocks[i].form.length - 1; j > 0; j--){
                    if(currBlocks[i].form[j].some(elem => elem == 0)){
                        gridZone++;
                    }
                    else break;
                }
                if(canPlaceBlock(row, rotBlock.form)){
                    result.push({
                        blockId: currBlocks[i].id,
                        position: position,
                        isRotated: true,
                    });
                    placeBlock(row, rotBlock.form);
                    row += gridZone - currBlocks[i].form.length;  
                    position += 1;
                    currBlocks.splice(i, 1);  
                }
                else {
                    let current = currBlocks[i];
                    currBlocks.splice(i, 1);
                    currBlocks.push(current);
                    break;
                }
            }
            break;  
        }
        continue;
    }
    return result;
}
console.log(layout(blocks));