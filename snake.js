var drawSnake = function(snakeToDraw) {
    var drawableSnake = { color: "green", pixels: snakeToDraw };
    var drawableObjects = [drawableSnake];
    CHUNK.draw(drawableObjects);
}

var draw = function(snakeToDraw, apple) {
    var drawableSnake = { color: "green", pixels: snakeToDraw};
    var drawableApple = { color: "red", pixels: [apple]};
    var drawableObject = [drawableSnake, drawableApple];
    CHUNK.draw(drawableObject);
}

var moveSegment = function(segment) {
    if (segment.direction === "down") {
        return { top: segment.top + 1, left: segment.left }
    } else if (segment.direction === "up") {
        return { top: segment.top - 1, left: segment.left }
    } else if (segment.direction === "right") {
        return { top: segment.top, left: segment.left + 1 }
    } else if (segment.direction === "left") {
        return { top: segment.top, left: segment.left - 1 }
    }
    return segment;
}
var segmentFurtherForwardThan = function(index, snake) {
    if (snake[index - 1] === undefined) {
        return snake[index];
    } else {
        return snake[index -1];
    }
}
var moveSnake = function(snake) {
    return snake.map(function (oldSegment, segmentIndex) {
        var newSegment = moveSegment(oldSegment);
        newSegment.direction = segmentFurtherForwardThan(segmentIndex, snake).direction;
        return newSegment;
    });
}

var growSnake = function(snake) {
    var indexOfLastSegment = snake.length - 1;
    var lastSegment = snake[indexOfLastSegment];
    snake.push({top: lastSegment.top, left: lastSegment.left});
    return snake;
}

var ate = function(snake, otherThing) {
    var head = snake[0];
    return CHUNK.detectCollisionBetween([head], otherThing);
}

var advanceGame = function() {
    var newSnake = moveSnake(snake);

    if (ate(newSnake, snake)) {
    CHUNK.endGame();
    CHUNK.flashMessage("Whoops! You ate yourself!");
    }
    if (ate(newSnake, [apple])) {
        newSnake = growSnake(newSnake);
        apple = CHUNK.randomLocation();
    }
    if (ate(newSnake, CHUNK.gameBoundaries())) {
        CHUNK.endGame();
        CHUNK.flashMessage("Whoops! you hit a wall!");
    }
    snake = newSnake;
    draw(snake, apple);
}
var changeDirection = function(direction){
    snake[0].direction = direction;
}

var apple = { top: 8, left: 10};
var snake = [{ top: 1, left: 0, direction: "down" }, { top: 0, left: 0, direction: "down"}];

segmentFurtherForwardThan(0, snake);

CHUNK.executeNTimesPerSecond(advanceGame, 3);
CHUNK.onArrowKey(changeDirection);