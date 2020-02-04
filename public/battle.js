var app = angular.module('seabattle', ['ngRoute']);

app.controller('BattleController', function($scope) {
    $scope.size = 20;
    $scope.grid = [];
    $scope.ships = [[10, 1], [5, 2], [2, 3]];
    $scope.playerShipsCoords = [];
    $scope.playerShoots = [];
    $scope.AIShipsCoords = [];
    $scope.AIFired = false;
    $scope.AIShoots = [];
    $scope.allShoots = [];
    $scope.gameStarted = false;
    $scope.countToWin = 0;
    $scope.ships.map(function(sh) {
        $scope.countToWin += sh[0] * sh[1];
    });
    $scope.loader = angular.element(document.getElementById('loader'));
    $scope.endgame = angular.element(document.getElementById('endgame'));

    $scope.clearGrid = function() {
        $scope.grid = [];
        $scope.allShoots = [];
        $scope.AIShoots = [];
        $scope.playerShoots = [];
        $scope.playerShipsCoords = [];
        $scope.AIShipsCoords = [];
        $scope.gameStarted = false;
        angular.element(document).find('td').html('').attr('class', '');
        $scope.endgame.addClass('hide');
    };

    /**
     * Init board
     */
    $scope.initGrid = function() {
        for (let i = 0; i < $scope.size; i++) {
            $scope.grid[i] = Array($scope.size).fill('O');
        }
    };

    $scope.initGrid();

    /**
     * Player fires
     * @param x
     * @param y
     * @param [isUser]
     */
    $scope.fire = function(x, y, isUser) {
        isUser = isUser || false;
        var currentId = x + 'x' + y;
        // if ships was not placed or user or AI wants to fire an own ship
        if (isUser && !$scope.isPlayerCanFire(x, y)) {
            return;
        }

        $scope.allShoots.push(currentId);
        var currentCell = document.getElementById(currentId);
        var currentMarker = isUser ? 'A' : 'U';
        if ($scope.grid[x] && $scope.grid[x][y] && $scope.grid[x][y] == currentMarker) {
            makeShipFired(currentId, isUser);
            var run = true;
            // search top and bottom ship pieces
            for (let i = 1, j = -1; run; i++, j--) {
                let id = null;
                if ($scope.grid[x + i] && $scope.grid[x + i][y] == currentMarker) {
                    id = (x + i) + 'x' + y;
                    makeShipFired(id, isUser);
                }
                if ($scope.grid[x + j] && $scope.grid[x + j][y] == currentMarker) {
                    id = (x + j) + 'x' + y;
                    makeShipFired(id, isUser);
                }
                if(!id) {
                    run = false; break;
                }
            }

            run = true;
            // search ships back and forward pieces
            for (let i = 1, j = -1; run; i++, j--) {
                let id = null;
                if ($scope.grid[x][y + i] && $scope.grid[x][y + i] == currentMarker) {
                    id = x + 'x' + (y + i);
                    makeShipFired(id, isUser);
                }
                if ($scope.grid[x][y + j] && $scope.grid[x][y + j] == currentMarker) {
                    id = x + 'x' + (y + j);
                    makeShipFired(id, isUser);
                }
                if(!id) {
                    run = false; break;
                }
            }
            angular.element(currentCell).addClass(isUser ? 'fired' : 'ai_fired');
        } else {
            angular.element(currentCell).addClass(isUser ? 'act' : 'ai_act');
        }

        if ($scope.playerShoots.length == $scope.countToWin) {
            $scope.endgame.html('Badass. You has won :D');
            $scope.endgame.removeClass('hide');
            $scope.gameStarted = false;
            return
        }
        if ($scope.AIShoots.length == $scope.countToWin) {
            $scope.endgame.html('Maybe next time. You are looser. AI has won!');
            $scope.endgame.removeClass('hide');
            $scope.gameStarted = false;
            return
        }

        if (isUser) {
            $scope.loader.removeClass('hide');
            setTimeout(function () {
                $scope.shootAI();
                $scope.loader.addClass('hide');
                console.log('$scope.AIShoots', $scope.AIShoots);
            }, 800);
        }
    };

    /**
     * Marks ship fired and saves player and AI fire history
     * @param id ship id (x + 'x' + y = 10x9)
     * @param isUser
     */
    function makeShipFired(id, isUser) {
        isUser = isUser || false;
        var cell = document.getElementById(id);
        if (cell) {
            cell.innerHTML = isUser ? 'X' : 'U';
            angular.element(cell).addClass(isUser ? 'fired' : 'ai_fired');
            if (isUser) {
                if($scope.playerShoots.indexOf(id) == -1) {$scope.playerShoots.push(id)}
            } else {
                if($scope.AIShoots.indexOf(id) == -1) {$scope.AIShoots.push(id)}
            }
        }
    }

    /**
     * Randomly AI fire. Already fired cells and own ships should be ignored.
     */
    $scope.shootAI = function() {
        $scope.AIFired = true;
        var x = rand(0, $scope.size);
        var y = rand(0, $scope.size);
        while (!$scope.isAICanFire(x, y)) {
            x = rand(0, $scope.size);
            y = rand(0, $scope.size);
        }
        $scope.fire(x, y);
        $scope.AIFired = false;
    };

    /**
     * Checks if AI can fire on selected cell
     * @param x
     * @param y
     * @returns {boolean}
     */
    $scope.isAICanFire = function(x, y) {
        return $scope.gameStarted && !($scope.AIShipsCoords.indexOf(x + 'x' + y) > -1
                || $scope.allShoots.indexOf(x + 'x' + y) > -1)
    };

    /**
     * Checks if player can fire on selected cell
     * @param x
     * @param y
     * @returns {boolean}
     */
    $scope.isPlayerCanFire = function(x, y) {
        var id = x + 'x' + y;
        return $scope.gameStarted && !($scope.allShoots.indexOf(id) > -1
            || $scope.playerShoots.indexOf(id) > -1
            || $scope.playerShipsCoords.indexOf(id) > -1
        )
    };

    /**
     * Randomly place Player and AI ships at a grid arena
     */
    $scope.startGame = function() {
        $scope.clearGrid();
        $scope.initGrid();
        $scope.randomPlaceShips('U');
        $scope.randomPlaceShips('A', false);
        $scope.gameStarted = true;
        // console.table($scope.grid);
    };

    /**
     * Place player or AI ships
     *
     * @param player A (AI) or U (User)
     * @param showOnBoard use to show ships on a board
     */
    $scope.randomPlaceShips = function(player, showOnBoard = true) {
        for (let i = 0; i < $scope.ships.length; i++) {
            for (let j = 0; j < $scope.ships[i][1]; j++) {
                var shipSize = $scope.ships[i][0];
                var shipPlacement = $scope.findPlaceOnBoard(shipSize);
                while (!$scope.checkForSafePlacement(shipSize, shipPlacement.start_x, shipPlacement.start_y, shipPlacement.orientation)) {
                    shipPlacement = $scope.findPlaceOnBoard(shipSize);
                }

                var orientation = shipPlacement.orientation;
                var startY = shipPlacement.start_y;
                var startX = shipPlacement.start_x;

                for (let k = 0; k < shipSize; k++) {
                    if (!orientation) {
                        $scope.grid[startX][startY + k] = player;
                        let id = startX + 'x' + (startY + k);
                        if (showOnBoard) {
                            $scope.playerShipsCoords.push(id);
                            document.getElementById(id).innerHTML = player;
                        } else {
                            $scope.AIShipsCoords.push(id);
                        }
                    } else {
                        $scope.grid[startX + k][startY] = player;
                        let id = (startX + k) + 'x' + startY;
                        if (showOnBoard) {
                            $scope.playerShipsCoords.push(id);
                            document.getElementById(id).innerHTML = player;
                        } else {
                            $scope.AIShipsCoords.push(id);
                        }
                    }
                }
            }
        }
    };

    /**
     * Randomly generates x, y and orientation to place a ship shipSize size
     *
     * @param shipSize
     * @returns {{start_x: number, start_y: number, orientation: boolean}}
     */
    $scope.findPlaceOnBoard = function(shipSize) {
        if (shipSize > $scope.size) {
            throw new Error('shipSize cannot be greater that board size');
        }
        var orientation = Math.round($scope.size * Math.random()) % 2 === 0;
        var startX = 0;
        var startY = 0;
        var maxStartCoord = ($scope.grid[0].length) - shipSize;

        if (!orientation) {
            // Horizontal
            startX = rand(0, maxStartCoord);
            startY = rand(0, $scope.size - 1);
        } else {
            // Vertical
            startX = rand(0, $scope.grid[0].length - 1);
            startY = rand(0, maxStartCoord);
        }

        return {start_x: startX, start_y: startY, orientation};
    };

    /**
     * Check if the current ship size can be placed on such coordinates and orientation.
     * Margin between ships should be 1 cell
     *
     * @param shipSize
     * @param startX
     * @param startY
     * @param orientation horizontal = false, vertical = true
     * @returns {boolean}
     */
    $scope.checkForSafePlacement = function (shipSize, startX, startY, orientation) {
        for (let i = 0; i < shipSize; i++) {
            // make sure that there are no nearest ships
            if ($scope.grid[startX][startY] !== 'O') {
                return false;
            }
            if (!orientation) {
                if ($scope.grid[startX][startY + i] != 'O'
                    || ($scope.grid[startX + 1] && $scope.grid[startX + 1][startY + i] != 'O')
                    || ($scope.grid[startX - 1] && $scope.grid[startX - 1][startY + i] != 'O')
                    || ($scope.grid[startX][startY + i + 1] && $scope.grid[startX][startY + i + 1] != 'O')
                    || ($scope.grid[startX][startY + i - 1] && $scope.grid[startX][startY + i - 1] != 'O')

                ) {
                    return false;
                }
            } else {
                if (!$scope.grid[startX + i]
                    || $scope.grid[startX + i][startY] !== 'O'
                    || ($scope.grid[startX + i][startY + 1] && $scope.grid[startX + i][startY + 1] != 'O')
                    || ($scope.grid[startX + i][startY - 1] && $scope.grid[startX + i][startY - 1] != 'O')
                    || ($scope.grid[startX + i + 1] && $scope.grid[startX + i + 1][startY] != 'O')
                    || ($scope.grid[startX + i - 1] && $scope.grid[startX + i - 1][startY] != 'O')
                ) {
                    return false;
                }
            }
        }

        return true;
    };

    /**
     * Randomly generates number in range of min and max
     *
     * @param min
     * @param max
     * @returns {*}
     */
    function rand(min, max) {
        if (min === 0) {
            return Math.floor((Math.random() * max));
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
});
