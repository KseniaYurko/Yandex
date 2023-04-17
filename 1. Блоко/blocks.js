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
var blocks = [
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
    }
];
function layout(blocks) {
    //MAKE GRID
    var gridWidth = blocks[0].form[0].length;
    var gridHeight = 0;
    for (var _i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
        var block = blocks_1[_i];
        gridHeight += block.form.length;
    }
    gridHeight -= blocks.length - 1;
    var grid = Array.from({ length: gridHeight }, function () { return Array(gridWidth).fill(0); });
    console.log(grid);
    //CONSTS
    var result = [];
    var row = grid.length - 1;
    var position = 1;
    var currBlocks = blocks;
    //FUNCTIONS ------------------------------------------------------------------------------------------------------------------//
    var canPlaceBlock = function (row, form) {
        var blockZone = 0;
        for (var j = form.length - 1; j >= 0; j--) {
            if (form[j].some(function (elem) { return elem == 0; })) {
                blockZone++;
            }
            else
                break;
        }
        var gridZone = 0;
        for (var i = 0; i < form.length - 1; i++) {
            if (form[i].some(function (elem) { return elem == 0; })) {
                gridZone++;
            }
            else
                break;
        }
        (blockZone > gridZone) ? gridZone = blockZone : gridZone = gridZone;
        var sumBlockRow = [];
        if (gridZone != 0) {
            for (var i = 0; i < gridZone; i++) {
                var sumRow = [];
                for (var j = 0; j < gridWidth; j++) {
                    sumRow.push(form[form.length - 1 - i][j] + grid[row - i][j]);
                }
                sumBlockRow.push(sumRow);
            }
        }
        else {
            var i = 0;
            var sumRow = [];
            for (var j = 0; j < gridWidth; j++) {
                sumRow.push(form[form.length - 1 - i][j] + grid[row - i][j]);
            }
            sumBlockRow.push(sumRow);
        }
        var result;
        sumBlockRow.every(function (elem) { return elem.every(function (elem) { return elem == 1; }); }) ? result = true : result = false;
        return result;
    };
    var placeBlock = function (row, form) {
        for (var i = form.length - 1; i >= 0; i--) {
            for (var j = gridWidth - 1; j >= 0; j--) {
                if (form[i][j] == 1) {
                    grid[row - form.length + i + 1][j] = 1;
                }
            }
        }
    };
    function rotateBlock(block) {
        var numRows = block.form.length;
        var numCols = block.form[0].length;
        var form = [];
        for (var i = numRows - 1; i >= 0; i--) {
            form.push([]);
            for (var j = numCols - 1; j >= 0; j--) {
                form[numRows - 1 - i].push(block.form[i][j]);
            }
        }
        var rotatedBlock = {
            id: block.id,
            form: form,
        };
        return rotatedBlock;
    }
    ;
    //----------------------------------------------------------------------------------------------------------------------------//
    while (currBlocks.length > 0) {
        for (var i = 0; i < currBlocks.length; i++) {
            var gridZone = 0;
            for (var j = 0; j < currBlocks[i].form.length - 1; j++) {
                if (currBlocks[i].form[j].some(function (elem) { return elem == 0; })) {
                    gridZone++;
                }
                else
                    break;
            }
            var blockZone = 0;
            for (var j = currBlocks[i].form.length - 1; j >= 0; j--) {
                if (currBlocks[i].form[j].some(function (elem) { return elem == 0; })) {
                    blockZone++;
                }
                else
                    break;
            }
            if (canPlaceBlock(row, currBlocks[i].form)) {
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
            else {
                var rotBlock = rotateBlock(currBlocks[i]);
                gridZone = 0;
                for (var j = currBlocks[i].form.length - 1; j > 0; j--) {
                    if (currBlocks[i].form[j].some(function (elem) { return elem == 0; })) {
                        gridZone++;
                    }
                    else
                        break;
                }
                if (canPlaceBlock(row, rotBlock.form)) {
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
                    var current = currBlocks[i];
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
