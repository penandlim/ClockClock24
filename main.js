/**
 * Created by John LIm on 9/11/2017.
 */
SE = {
    LEFT_TOP : 1,
    RIGHT_TOP : 2,
    RIGHT_BOT : 3,
    LEFT_BOT : 4,
    STRAIGHT : 0,
    BOTTOM_ONLY : 5,
    TOP_ONLY : 6,
    RIGHT_ONLY : 8,
    LEFT_ONLY : 7,
    SIDEWAYS : 9,
    DIAG : 10,
    NONE : -1
};

var numStatusArray = [
    [SE.RIGHT_BOT, SE.LEFT_BOT, SE.STRAIGHT, SE.STRAIGHT, SE.RIGHT_TOP, SE.LEFT_TOP],
    [SE.NONE, SE.BOTTOM_ONLY, SE.NONE, SE.STRAIGHT, SE.NONE, SE.TOP_ONLY ],
    [SE.RIGHT_ONLY, SE.LEFT_BOT, SE.RIGHT_BOT, SE.LEFT_TOP, SE.RIGHT_TOP, SE.LEFT_ONLY],
    [SE.RIGHT_ONLY, SE.LEFT_BOT, SE.RIGHT_ONLY, SE.STRAIGHT, SE.RIGHT_ONLY, SE.LEFT_TOP],
    [SE.BOTTOM_ONLY, SE.BOTTOM_ONLY, SE.RIGHT_TOP, SE.STRAIGHT, SE.NONE, SE.TOP_ONLY],
    [SE.RIGHT_BOT, SE.LEFT_ONLY, SE.RIGHT_TOP, SE.LEFT_BOT, SE.RIGHT_ONLY, SE.LEFT_TOP],
    [SE.RIGHT_BOT, SE.LEFT_ONLY, SE.STRAIGHT, SE.LEFT_BOT, SE.RIGHT_TOP, SE.LEFT_TOP],
    [SE.RIGHT_ONLY, SE.LEFT_BOT, SE.NONE, SE.STRAIGHT, SE.NONE, SE.TOP_ONLY],
    [SE.RIGHT_BOT, SE.LEFT_BOT, SE.RIGHT_TOP, SE.LEFT_BOT, SE.RIGHT_TOP, SE.LEFT_TOP],
    [SE.RIGHT_BOT, SE.LEFT_BOT, SE.RIGHT_TOP, SE.STRAIGHT, SE.RIGHT_ONLY, SE.LEFT_TOP]
];

var customStatusArray = [
    [SE.DIAG, SE.DIAG ,SE.DIAG],
    [SE.STRAIGHT, SE.STRAIGHT ,SE.STRAIGHT],
    [SE.SIDEWAYS, SE.SIDEWAYS ,SE.SIDEWAYS]
];


for (var i = 1; i < 24; i++) {
    $("._" + (i + 1)).append($("._1").children().clone());
}


$.fn.rotationDegrees = function () {
    var matrix = this.css("-webkit-transform") ||
        this.css("-moz-transform")    ||
        this.css("-ms-transform")     ||
        this.css("-o-transform")      ||
        this.css("transform");
    if(typeof matrix === 'string' && matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    } else { var angle = 0; }
    return angle;
};

$.fn.animateRotate = function(startAngle, endAngle, duration, easing, complete){
    return this.each(function(){
        var elem = $(this);

        $({deg: startAngle}).animate({deg: endAngle}, {
            duration: duration,
            easing: easing,
            step: function(now){
                elem.css({
                    '-moz-transform':'rotate('+now+'deg)',
                    '-webkit-transform':'rotate('+now+'deg)',
                    '-o-transform':'rotate('+now+'deg)',
                    '-ms-transform':'rotate('+now+'deg)',
                    'transform':'rotate('+now+'deg)'
                });
            },
            complete: complete || $.noop
        });
    });
};

$(window).on('resize', function(){
    //resetClockSize();
});

function resetClockSize() {
    var w_width = $(window).width();
    var w_height = $(window).height();
    var clockWidth = w_width;
    clockWidth = clockWidth / 10;
    var gridCol = "";
    for (var i = 0; i < 8; i ++) {
        gridCol = gridCol + clockWidth + "px ";
    }


    $(".clock").css("width", clockWidth + "px");
    $(".clock").css("height", clockWidth + "px");
    $(".grid-wrapper").css("grid-template-columns",
        gridCol
    );
}

function calcSpinTo(dir, cur, to, numOfSpins) {
    var a;
    if (dir > 0) {
        a = cur + 360 * numOfSpins;

    } else {
        a = cur - 360 * numOfSpins;
    }

    if (to != (a % 360)) {
        a += to - (a % 360);
    }

    return a;
}

function setAngleAttr(obj, toAngle){
    obj.attr("data-angle", toAngle + "");
}

function rotateClock(status, clockNum, dur, easing, numOfSpins, sameDir) {
    var hand, curAngle, toAngle, direction;

    var offset1 = 0, offset2 = 0;

    switch(status) {
        case SE.STRAIGHT:
            offset2 = 180;
            break;
        case SE.LEFT_TOP:
            offset1 = 270;
            break;
        case SE.RIGHT_TOP:
            offset1 = 90;
            offset2 = 0;
            break;
        case SE.RIGHT_BOT:
            offset1 = 90;
            offset2 = 180;
            break;
        case SE.LEFT_BOT:
            offset1 = 270;
            offset2 = 180;
            break;
        case SE.RIGHT_ONLY:
            offset1 = 90;
            offset2 = 90;
            break;
        case SE.LEFT_ONLY:
            offset1 = 270;
            offset2 = 270;
            break;
        case SE.TOP_ONLY:
            offset1 = 0;
            offset2 = 0;
            break;
        case SE.BOTTOM_ONLY:
            offset1 = 180;
            offset2 = 180;
            break;
        case SE.NONE:
            offset1 = 225;
            offset2 = 225;
            break;
        case SE.DIAG:
            offset1 = 45;
            offset2 = -135;
            break;
        case SE.SIDEWAYS:
            offset1 = 270;
            offset2 = 90;
            break;
        default:
            break;
    }

    hand = $("._" + clockNum + " > .smallhand");
    curAngle = parseInt(hand.attr("data-angle"));
    toAngle = calcSpinTo(1, curAngle, offset1, numOfSpins);
    hand.animateRotate(curAngle, toAngle, dur, easing, setAngleAttr(hand, toAngle));

    if (sameDir) {
        direction = 1;
    } else {
        direction = -1;
    }

    hand = $("._" + clockNum + " > .bighand");
    curAngle = parseInt(hand.attr("data-angle"));
    toAngle = calcSpinTo(direction, curAngle, offset2, numOfSpins);
    hand.animateRotate(curAngle, toAngle, dur, easing, setAngleAttr(hand, toAngle));
}

function turnTo(place, number, dur, easing, numOfSpins) {
    var arr = numStatusArray[number];
    var clockNum = 2 * (place - 1) + 1;

    for (var i = 0; i < 6; i++) {
        var pass = numOfSpins;
        if (numOfSpins < 0) {
            pass = Math.floor(Math.random() * 10 + Math.abs(numOfSpins))
        }
        rotateClock(arr[i], clockNum, dur, easing, pass);
        if (clockNum % 2 > 0)
            clockNum += 1;
        else
            clockNum += 7;
    }
}

function customTransition() {
    var d = new Date();
    var hour = addZero(d.getHours()) + "";
    var minute = addZero(d.getMinutes()) + "";

    var clockNum, delay, delayIncrement = 200;
    delay = 0;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 3; j++) {
            clockNum = 8 * j + (i + 1);
            setTimeout(function(clockNum) {
                rotateClock(SE.DIAG, clockNum, 7000, "easeInOutSine", 0);
            }, delay, clockNum);
            setTimeout(function(clockNum) {
                rotateClock(SE.DIAG, clockNum, 41000, "easeInOutSine", 2, true);
            }, (delayIncrement * 8 - delay) + 8000, clockNum);
        }
        delay += delayIncrement;
    }
    setTimeout(function() {
        showCurTime(hour, minute);
    }, 50000, hour, minute );
}

$(document).ready(function(){
    $(".smallhand").attr("data-angle", "0");
    $(".bighand").attr("data-angle", "0");
    anime({
        targets: "#container",
        left: '0%', // Animate all divs left position to 80%
        opacity: 1, // Animate all divs opacity to .8
        duration: 1000,
        delay: 500,
        easing: 'easeOutSine',
        complete: function() {
            anime({
                targets: ".title",
                opacity: [
                    { value: 1, duration: 1000, delay: 500, elasticity: 0 },
                    { value: 0, duration: 1000, delay: 4500, elasticity: 0 }
                    ], // Animate all divs opacity to .8
                easing: 'easeOutSine'
            });
            anime({
                targets: ".clock",
                opacity: 1, // Animate all divs opacity to .8
                duration: 2000,
                delay: 7000,
                easing: 'easeOutSine'
            });
        }
    });

    transitionShowCurTime();
});

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function showCurTime(hour, minute) {
    console.log(hour+minute);
    turnTo(1, parseInt(hour.charAt(0)), 10000, "easeInOutSine", 2);
    setTimeout(function() {
        turnTo(2, parseInt(hour.charAt(1)), 10000, "easeInOutSine", 2);
    }, 500);
    setTimeout(function() {
        turnTo(3, parseInt(minute.charAt(0)), 10000, "easeInOutSine", 2);
    }, 1000);
    setTimeout(function() {
        turnTo(4, parseInt(minute.charAt(1)), 10000, "easeInOutSine", 2);
    }, 1500);
    setTimeout(function() {
        transitionShowCurTime();
    }, 15000);
}

function transitionShowCurTime() {
    var d = new Date();
    var hour = addZero(d.getHours()) + "";
    var minute = addZero(d.getMinutes()) + "";
    console.log(hour+minute);
    turnTo(1, parseInt(hour.charAt(0)), 55000, "easeInOutSine", -11);
    setTimeout(function() {
        turnTo(2, parseInt(hour.charAt(1)), 55000, "easeInOutSine", -11);
    }, 500);
    setTimeout(function() {
        turnTo(3, parseInt(minute.charAt(0)), 55000, "easeInOutSine", -11);
    }, 1000);
    setTimeout(function() {
        turnTo(4, parseInt(minute.charAt(1)), 55000, "easeInOutSine", -11);
    }, 1500);
    setTimeout(function() {
        customTransition();
    }, 60001);
}

