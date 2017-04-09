'use strict';

describe('BattleController', function () {
    beforeEach(module('seabattle'));

    var $controller;

    beforeEach(inject(function (_$controller_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));

    describe('Initial params', function () {
        var $scope, controller;

        beforeEach(function () {
            $scope = {};
            controller = $controller('BattleController', {$scope: $scope});
        });

        it('count to win should be 26', function () {
            expect($scope.countToWin).toEqual(26);
        });

        it('Arena size should be 20', function () {
            $scope.initGrid();
            expect($scope.grid.length).toEqual($scope.size);
        });

        it('findPlaceOnBoard for ship size', function () {
            var shipPlacement = $scope.findPlaceOnBoard(10);
            expect(shipPlacement.start_x).toEqual(jasmine.any(Number));
            expect(shipPlacement.start_x).toBeGreaterThanOrEqual(0);
            expect(shipPlacement.start_y).toEqual(jasmine.any(Number));
            expect(shipPlacement.start_y).toBeGreaterThanOrEqual(0);
            expect(shipPlacement.orientation).toEqual(jasmine.any(Boolean));

            shipPlacement = $scope.findPlaceOnBoard(5);
            expect(shipPlacement.start_x).toEqual(jasmine.any(Number));
            expect(shipPlacement.start_x).toBeGreaterThanOrEqual(0);
            expect(shipPlacement.start_y).toEqual(jasmine.any(Number));
            expect(shipPlacement.start_y).toBeGreaterThanOrEqual(0);
            expect(shipPlacement.orientation).toEqual(jasmine.any(Boolean));

            expect(function () {
                $scope.findPlaceOnBoard(100)
            }).toThrow(new Error("shipSize cannot be greater that board size"));
        });

        it('should init grid', function () {
            $scope.initGrid();
            expect($scope.grid.length).toEqual($scope.size);
        });

        it('AI should kill whole ship', function () {
            $scope.initGrid();
            $scope.grid[0][15] = 'U';
            $scope.grid[0][16] = 'U';
            //$scope.grid[9][6] = 'U';
            //$scope.grid[9][7] = 'U';
            //$scope.grid[9][8] = 'U';
            //$scope.grid[9][9] = 'U';
            //$scope.grid[9][10] = 'U';
            //$scope.grid[9][11] = 'U';
            //$scope.grid[9][12] = 'U';
            //$scope.grid[9][13] = 'U';
            var x = 0, y = 15;
            if ($scope.grid[x] && $scope.grid[x][y] && $scope.grid[x][y] == 'U') {
                $scope.grid[x][y] = 'X';
                var run = true;
                for (let i = 1, j = -1; run; i++, j--) {
                    let id = null;
                    if ($scope.grid[x + i] && $scope.grid[x + i][y] == 'U') {
                        $scope.grid[x + i][y] = 'X';
                    }
                    if ($scope.grid[x + j] && $scope.grid[x + j][y] == 'U') {
                        id = (x + j) + 'x' + y;
                        $scope.grid[x + j][y] = 'X';
                    }
                    if(!id) {
                        run = false; break;
                    }
                }
                run = true;
                for (let i = 1, j = -1; run; i++, j--) {
                    let id = null;
                    console.log($scope.grid[x][y + i], 'x + i', x, y + i);
                    if ($scope.grid[x][y + i] && $scope.grid[x][y + i] == 'U') {
                        id = x + 'x' + (y + i);
                        $scope.grid[x][y + i] = 'X';
                    }
                    if ($scope.grid[x][y + j] && $scope.grid[x][y + j] == 'U') {
                        id = x + 'x' + (y + j);
                        $scope.grid[x][y + j] = 'X';
                    }
                    if(!id) {
                        run = false; break;
                    }
                }
            }
            expect($scope.grid[0][15]).toEqual('X');
            expect($scope.grid[0][15]).toEqual('X');
            //expect($scope.grid[9][5]).toEqual('X');
            //expect($scope.grid[9][6]).toEqual('X');
            //expect($scope.grid[9][7]).toEqual('X');
            //expect($scope.grid[9][8]).toEqual('X');
            //expect($scope.grid[9][9]).toEqual('X');
            //expect($scope.grid[9][10]).toEqual('X');
            //expect($scope.grid[9][11]).toEqual('X');
            //expect($scope.grid[9][12]).toEqual('X');
            //expect($scope.grid[9][13]).toEqual('X');
            //expect($scope.grid[9][14]).toEqual('O');
            console.table($scope.grid);
        });

        it('should User placeShips', function () {
            placeShips('U');
            expect($scope.playerShipsCoords.length).toEqual(26);
        });

        it('should User placeShips', function () {
            placeShips('U');
            expect($scope.playerShipsCoords.length).toEqual(26);
        });

        it('should AI placeShips', function () {
            placeShips('A');
            expect($scope.AIShipsCoords.length).toEqual(26);
        });

        it('Can AI fire', function () {
            $scope.gameStarted = true;
            $scope.AIShipsCoords.push('0x1', '2x1');
            $scope.allShoots.push('1x1', '2x3');
            expect($scope.isAICanFire(0, 1)).toBeFalsy();
            expect($scope.isAICanFire(2, 1)).toBeFalsy();
            expect($scope.isAICanFire(2, 2)).toBeTruthy();
            expect($scope.isAICanFire(1, 1)).toBeFalsy();
            expect($scope.isAICanFire(2, 3)).toBeFalsy();
            expect($scope.isAICanFire(4, 4)).toBeTruthy();
            $scope.gameStarted = false;
            expect($scope.isAICanFire(4, 5)).toBeFalsy();
        });

        it('Can Player fire', function () {
            $scope.gameStarted = true;
            $scope.playerShipsCoords.push('0x1', '2x1');
            $scope.allShoots.push('1x1', '2x3');
            expect($scope.isPlayerCanFire(0, 1)).toBeFalsy();
            expect($scope.isPlayerCanFire(2, 1)).toBeFalsy();
            expect($scope.isPlayerCanFire(2, 2)).toBeTruthy();
            expect($scope.isPlayerCanFire(1, 1)).toBeFalsy();
            expect($scope.isPlayerCanFire(2, 3)).toBeFalsy();
            expect($scope.isPlayerCanFire(4, 4)).toBeTruthy();
        });

        it('should checkForSafePlacement', function () {
            $scope.grid[0][0] = 'U';
            $scope.grid[0][1] = 'U';
            $scope.grid[0][2] = 'U';
            expect($scope.checkForSafePlacement(3, 0, 0, false)).toBeFalsy();
            expect($scope.checkForSafePlacement(3, 0, 0, true)).toBeFalsy();
            expect($scope.checkForSafePlacement(3, 1, 1, true)).toBeFalsy();
            expect($scope.checkForSafePlacement(3, 2, 1, true)).toBeTruthy();
            expect($scope.checkForSafePlacement(3, 0, 1, false)).toBeFalsy();
            expect($scope.checkForSafePlacement(3, 0, 2, false)).toBeFalsy();
            expect($scope.checkForSafePlacement(3, 0, 4, false)).toBeTruthy();
        });

        var placeShips = function(player) {
            for (var i = 0; i < $scope.ships.length; i++) {
                for (var j = 0; j < $scope.ships[i][1]; j++) {
                    var shipSize = $scope.ships[i][0];
                    var shipPlacement = $scope.findPlaceOnBoard(shipSize);
                    while (!$scope.checkForSafePlacement(shipSize, shipPlacement.start_x, shipPlacement.start_y, shipPlacement.orientation)) {
                        shipPlacement = $scope.findPlaceOnBoard(shipSize);
                    }

                    var orientation = shipPlacement.orientation;
                    var startY = shipPlacement.start_y;
                    var startX = shipPlacement.start_x;

                    for (var k = 0; k < shipSize; k++) {
                        let id = '';
                        if (!orientation) {
                            $scope.grid[startY][startX + k] = player;
                            id = startY + 'x' + (startX + k);
                        } else {
                            id = (startY + k) + 'x' + startX;
                            $scope.grid[startY + k][startX] = player;
                        }
                        if (player == 'U') {
                            $scope.playerShipsCoords.push(id);
                        } else {
                            $scope.AIShipsCoords.push(id);
                        }
                    }
                }
            }
        }
    });
});