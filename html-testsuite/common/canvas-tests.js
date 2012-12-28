function _valToString(val)
{
    if (val === undefined || val === null)
        return '[' + typeof(val) + ']';
    return val.toString() + '[' + typeof(val) + ']';
}

var _failed = false;
var _asserted = false;

function _warn(text)
{
    document.getElementById('d').appendChild(document.createElement('li')).appendChild(document.createTextNode(text));
}

function _fail(text)
{
    _warn(text);
    _failed = true;
}

function _assert(cond, text)
{
    _asserted = true;
    if (! cond)
        _fail('Failed assertion: ' + text);
}

function _assertSame(a, b, text_a, text_b)
{
    _asserted = true;
    if (a !== b)
        _fail('Failed assertion ' + text_a + ' === ' + text_b +
                ' (got ' + _valToString(a) + ', expected ' + _valToString(b) + ')');
}

function _assertDifferent(a, b, text_a, text_b)
{
    _asserted = true;
    if (a === b)
        _fail('Failed assertion ' + text_a + ' !== ' + text_b +
                ' (got ' + _valToString(a) + ', expected not ' + _valToString(b) + ')');
}

function _assertEqual(a, b, text_a, text_b)
{
    _asserted = true;
    if (a != b)
        _fail('Failed assertion ' + text_a + ' == ' + text_b +
                ' (got ' + _valToString(a) + ', expected ' + _valToString(b) + ')');
}

function _assertMatch(a, b, text_a, text_b)
{
    _asserted = true;
    if (! a.match(b))
        _fail('Failed assertion ' + text_a + ' matches ' + text_b +
                ' (got ' + _valToString(a) + ')');
}


var _manual_check = false;

function _requireManualCheck()
{
    _manual_check = true;
}

function _crash()
{
    _fail('Aborted due to predicted crash');
}

function _getPixel(canvas, x,y)
{
    try
    {
        var ctx = canvas.getContext('2d');
        var imgdata = ctx.getImageData(x, y, 1, 1);
        return [ imgdata.data[0], imgdata.data[1], imgdata.data[2], imgdata.data[3] ];
    }
    catch (e)
    {
        // probably a security exception caused by having drawn
        // data: URLs onto the canvas
        _manual_check = true;
        return undefined;
    }
}

function _assertPixel(canvas, x,y, r,g,b,a, pos, colour)
{
    _asserted = true;
    var c = _getPixel(canvas, x,y);
    if (c && ! (c[0] == r && c[1] == g && c[2] == b && c[3] == a))
        _fail('Failed assertion: got pixel [' + c + '] at ('+x+','+y+'), expected ['+r+','+g+','+b+','+a+']');
}

function _assertPixelApprox(canvas, x,y, r,g,b,a, pos, colour, tolerance)
{
    _asserted = true;
    var c = _getPixel(canvas, x,y);
    if (c)
    {
        var diff = Math.max(Math.abs(c[0]-r), Math.abs(c[1]-g), Math.abs(c[2]-b), Math.abs(c[3]-a));
        if (diff > tolerance)
            _fail('Failed assertion: got pixel [' + c + '] at ('+x+','+y+'), expected ['+r+','+g+','+b+','+a+'] +/- '+tolerance);
    }
}

function _addTest(test)
{
    var deferred = false;
    window.deferTest = function () { deferred = true; };
    function endTest()
    {
        if (_failed) // test failed
        {
            document.documentElement.className += ' fail';
            window._testStatus = ['fail', document.getElementById('d').innerHTML];
        }
        else if (_manual_check || !_asserted)
        { // test case explicitly asked for a manual check, or no automatic assertions were performed
            document.getElementById('d').innerHTML += '<li>Cannot automatically verify result';
            document.documentElement.className += ' needs_check';
            window._testStatus = ['check', document.getElementById('d').innerHTML];
        }
        else // test succeeded
        {
            document.getElementById('d').innerHTML += '<li>Passed';
            document.documentElement.className += ' pass';
            window._testStatus = ['pass', document.getElementById('d').innerHTML];
        }
    };
    window.endTest = endTest;
    window.wrapFunction = function (f)
    {
        return function()
        {
            try
            {
                f.apply(null, arguments);
            }
            catch (e)
            {
                _fail('Aborted with exception: ' + e.message);
            }
            endTest();
        };
    };

    window.onload = function ()
    {
        try
        {
            var canvas = document.getElementById('c');
            var ctx = canvas.getContext('2d');
            test(canvas, ctx);
        }
        catch (e)
        {
            _fail('Aborted with exception: ' + e.message);
            deferred = false; // cancel any deference
        }

        if (! deferred)
            endTest();
    };
}

function _assertGreen(ctx, canvasWidth, canvasHeight)
{
    var testColor = function(d, idx, expected) {
        _assertEqual(d[idx], expected, "d[" + idx + "]", String(expected));
    };
    var imagedata = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    var w = imagedata.width, h = imagedata.height, d = imagedata.data;
    for (var i = 0; i < h; ++i) {
        for (var j = 0; j < w; ++j) {
            testColor(d, 4 * (w * i + j) + 0, 0);
            testColor(d, 4 * (w * i + j) + 1, 255);
            testColor(d, 4 * (w * i + j) + 2, 0);
            testColor(d, 4 * (w * i + j) + 3, 255);
        }
    }
}

function _render_fillRule_example_shapes(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(453.54330708661416,0);
    ctx.lineTo(453.54330708661416,151.1811023622047);
    ctx.lineTo(0,151.1811023622047);
    ctx.closePath();
    ctx.clip();
    ctx.translate(0,0);
    ctx.translate(0,0);
    ctx.scale(0.3779527559055118,0.3779527559055118);
    ctx.translate(0,0);
    ctx.strokeStyle = 'rgba(0,0,0,0)';
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';
    ctx.miterLimit = 4;
    ctx.save();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.strokeStyle = "#0000ff";
    ctx.beginPath();
    ctx.moveTo(1,1);
    ctx.lineTo(1199,1);
    ctx.quadraticCurveTo(1199,1,1199,1);
    ctx.lineTo(1199,399);
    ctx.quadraticCurveTo(1199,399,1199,399);
    ctx.lineTo(1,399);
    ctx.quadraticCurveTo(1,399,1,399);
    ctx.lineTo(1,1);
    ctx.quadraticCurveTo(1,1,1,1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#ff0000";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(250,75);
    ctx.lineTo(323,301);
    ctx.lineTo(131,161);
    ctx.lineTo(369,161);
    ctx.lineTo(177,301);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.translate(306.21,249);
    ctx.translate(0,0);
    ctx.rotate(1.2566370614359172);
    ctx.translate(0,0);
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    ctx.beginPath();
    ctx.moveTo(16,0);
    ctx.lineTo(-8,9);
    ctx.lineTo(-8,-9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.restore();
    ctx.save();
    ctx.translate(175.16,193.2);
    ctx.translate(0,0);
    ctx.rotate(3.7699111843077517);
    ctx.translate(0,0);
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    ctx.beginPath();
    ctx.moveTo(16,0);
    ctx.lineTo(-8,9);
    ctx.lineTo(-8,-9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.restore();
    ctx.save();
    ctx.translate(314.26,161);
    ctx.translate(0,0);
    ctx.rotate(0);
    ctx.translate(0,0);
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    ctx.beginPath();
    ctx.moveTo(16,0);
    ctx.lineTo(-8,9);
    ctx.lineTo(-8,-9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.restore();
    ctx.save();
    ctx.translate(221.16,268.8);
    ctx.translate(0,0);
    ctx.rotate(2.5132741228718345);
    ctx.translate(0,0);
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    ctx.beginPath();
    ctx.moveTo(16,0);
    ctx.lineTo(-8,9);
    ctx.lineTo(-8,-9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.restore();
    ctx.save();
    ctx.translate(233.21,126.98);
    ctx.translate(0,0);
    ctx.rotate(5.026548245743669);
    ctx.translate(0,0);
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    ctx.beginPath();
    ctx.moveTo(16,0);
    ctx.lineTo(-8,9);
    ctx.lineTo(-8,-9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(600,81);
    ctx.translate(600,188);
    ctx.rotate(0);
    ctx.scale(1,1);
    ctx.arc(0,0,107,-1.5707963267948966,1.5707963267948966,0);
    ctx.scale(1,1);
    ctx.rotate(0);
    ctx.translate(-600,-188);
    ctx.translate(600,188);
    ctx.rotate(0);
    ctx.scale(1,1);
    ctx.arc(0,0,107,1.5707963267948966,4.71238898038469,0);
    ctx.scale(1,1);
    ctx.rotate(0);
    ctx.translate(-600,-188);
    ctx.closePath();
    ctx.moveTo(600,139);
    ctx.translate(600,188);
    ctx.rotate(0);
    ctx.scale(1,1);
    ctx.arc(0,0,49,-1.5707963267948966,1.5707963267948966,0);
    ctx.scale(1,1);
    ctx.rotate(0);
    ctx.translate(-600,-188);
    ctx.translate(600,188);
    ctx.rotate(0);
    ctx.scale(1,1);
    ctx.arc(0,0,49,1.5707963267948966,4.71238898038469,0);
    ctx.scale(1,1);
    ctx.rotate(0);
    ctx.translate(-600,-188);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.translate(600,188);
    ctx.translate(0,0);
    ctx.rotate(0);
    ctx.translate(0,0);
    ctx.translate(107,0);
    ctx.translate(0,0);
    ctx.rotate(1.5707963267948966);
    ctx.translate(0,0);
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    ctx.beginPath();
    ctx.moveTo(16,0);
    ctx.lineTo(-8,9);
    ctx.lineTo(-8,-9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.restore();
    ctx.save();
    ctx.translate(600,188);
    ctx.translate(0,0);
    ctx.rotate(2.0943951023931953);
    ctx.translate(0,0);
    ctx.translate(107,0);
    ctx.translate(0,0);
    ctx.rotate(1.5707963267948966);
    ctx.translate(0,0);
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    ctx.beginPath();
    ctx.moveTo(16,0);
    ctx.lineTo(-8,9);
    ctx.lineTo(-8,-9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.restore();
    ctx.save();
    ctx.translate(600,188);
    ctx.translate(0,0);
    ctx.rotate(4.1887902047863905);
    ctx.translate(0,0);
    ctx.translate(107,0);
    ctx.translate(0,0);
    ctx.rotate(1.5707963267948966);
    ctx.translate(0,0);
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    ctx.beginPath();
    ctx.moveTo(16,0);
    ctx.lineTo(-8,9);
    ctx.lineTo(-8,-9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.restore();
    ctx.save();
    ctx.translate(600,188);
    ctx.translate(0,0);
    ctx.rotate(1.0471975511965976);
    ctx.translate(0,0);
    ctx.translate(49,0);
    ctx.translate(0,0);
    ctx.rotate(1.5707963267948966);
    ctx.translate(0,0);
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    ctx.beginPath();
    ctx.moveTo(16,0);
    ctx.lineTo(-8,9);
    ctx.lineTo(-8,-9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.restore();
    ctx.save();
    ctx.translate(600,188);
    ctx.translate(0,0);
    ctx.rotate(3.141592653589793);
    ctx.translate(0,0);
    ctx.translate(49,0);
    ctx.translate(0,0);
    ctx.rotate(1.5707963267948966);
    ctx.translate(0,0);
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    ctx.beginPath();
    ctx.moveTo(16,0);
    ctx.lineTo(-8,9);
    ctx.lineTo(-8,-9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.restore();
    ctx.save();
    ctx.translate(600,188);
    ctx.translate(0,0);
    ctx.rotate(5.235987755982989);
    ctx.translate(0,0);
    ctx.translate(49,0);
    ctx.translate(0,0);
    ctx.rotate(1.5707963267948966);
    ctx.translate(0,0);
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    ctx.beginPath();
    ctx.moveTo(16,0);
    ctx.lineTo(-8,9);
    ctx.lineTo(-8,-9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(950,81);
    ctx.translate(950,188);
    ctx.rotate(0);
    ctx.scale(1,1);
    ctx.arc(0,0,107,-1.5707963267948966,1.5707963267948966,0);
    ctx.scale(1,1);
    ctx.rotate(0);
    ctx.translate(-950,-188);
    ctx.translate(950,188);
    ctx.rotate(0);
    ctx.scale(1,1);
    ctx.arc(0,0,107,1.5707963267948966,4.71238898038469,0);
    ctx.scale(1,1);
    ctx.rotate(0);
    ctx.translate(-950,-188);
    ctx.closePath();
    ctx.moveTo(950,139);
    ctx.translate(950,188);
    ctx.rotate(0);
    ctx.scale(1,1);
    ctx.arc(0,0,49,-1.5707963267948966,-4.71238898038469,1);
    ctx.scale(1,1);
    ctx.rotate(0);
    ctx.translate(-950,-188);
    ctx.translate(950,188);
    ctx.rotate(0);
    ctx.scale(1,1);
    ctx.arc(0,0,49,1.5707963267948966,-1.5707963267948966,1);
    ctx.scale(1,1);
    ctx.rotate(0);
    ctx.translate(-950,-188);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.translate(950,188);
    ctx.translate(0,0);
    ctx.rotate(0);
    ctx.translate(0,0);
    ctx.translate(107,0);
    ctx.translate(0,0);
    ctx.rotate(1.5707963267948966);
    ctx.translate(0,0);
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    ctx.beginPath();
    ctx.moveTo(16,0);
    ctx.lineTo(-8,9);
    ctx.lineTo(-8,-9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.restore();
    ctx.save();
    ctx.translate(950,188);
    ctx.translate(0,0);
    ctx.rotate(2.0943951023931953);
    ctx.translate(0,0);
    ctx.translate(107,0);
    ctx.translate(0,0);
    ctx.rotate(1.5707963267948966);
    ctx.translate(0,0);
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    ctx.beginPath();
    ctx.moveTo(16,0);
    ctx.lineTo(-8,9);
    ctx.lineTo(-8,-9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.restore();
    ctx.save();
    ctx.translate(950,188);
    ctx.translate(0,0);
    ctx.rotate(4.1887902047863905);
    ctx.translate(0,0);
    ctx.translate(107,0);
    ctx.translate(0,0);
    ctx.rotate(1.5707963267948966);
    ctx.translate(0,0);
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    ctx.beginPath();
    ctx.moveTo(16,0);
    ctx.lineTo(-8,9);
    ctx.lineTo(-8,-9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.restore();
    ctx.save();
    ctx.translate(950,188);
    ctx.translate(0,0);
    ctx.rotate(1.0471975511965976);
    ctx.translate(0,0);
    ctx.translate(49,0);
    ctx.translate(0,0);
    ctx.rotate(-1.5707963267948966);
    ctx.translate(0,0);
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    ctx.beginPath();
    ctx.moveTo(16,0);
    ctx.lineTo(-8,9);
    ctx.lineTo(-8,-9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.restore();
    ctx.save();
    ctx.translate(950,188);
    ctx.translate(0,0);
    ctx.rotate(3.141592653589793);
    ctx.translate(0,0);
    ctx.translate(49,0);
    ctx.translate(0,0);
    ctx.rotate(-1.5707963267948966);
    ctx.translate(0,0);
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    ctx.beginPath();
    ctx.moveTo(16,0);
    ctx.lineTo(-8,9);
    ctx.lineTo(-8,-9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.restore();
    ctx.save();
    ctx.translate(950,188);
    ctx.translate(0,0);
    ctx.rotate(5.235987755982989);
    ctx.translate(0,0);
    ctx.translate(49,0);
    ctx.translate(0,0);
    ctx.rotate(-1.5707963267948966);
    ctx.translate(0,0);
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    ctx.beginPath();
    ctx.moveTo(16,0);
    ctx.lineTo(-8,9);
    ctx.lineTo(-8,-9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.restore();
    ctx.restore();
    ctx.restore();
}
