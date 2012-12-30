
function _assertCanvasImage(rendered_canvas, expected_image) {

// The test simply compares the rendered canvas image with the 
// expected PNG image.  Since the canvas->PNG->canvas->PNG conversion
// process (used for the expected result) can introduce some minor
// image differences (e.g. aliasing on the edges) we apply that same
// conversion to the actual rendered canvas before comparison.

    var actual_canvas = document.createElement("canvas");
    var actual_img = document.createElement("img");
    actual_img.src = rendered_canvas.toDataURL("image/png");
    actual_canvas.width = rendered_canvas.width;
    actual_canvas.height = rendered_canvas.height;
    actual_canvas.getContext("2d").drawImage(actual_img, 0, 0);
    var expected_canvas = document.createElement("canvas");
    expected_canvas.width = rendered_canvas.width;
    expected_canvas.height = rendered_canvas.height;
    expected_canvas.getContext("2d").drawImage(expected_image, 0, 0);
    var actual_data = actual_canvas.toDataURL("image/png");
    var expected_data = expected_canvas.toDataURL("image/png");
    _assertEqual(actual_data, expected_data, "actual_data", "expected_data");
}

function _assertRadialPoints(ctx, origstate, fillRule) {

// Look at some important points and assert they are filled or not as
// necessary.

    var center_points = [
      [95, 75, "star"], // Center of star
      [227, 71, "circle"], // Center of middle circle
      [359, 71, "contra_circle"] // Center of right circle
    ];
    var radiuss = [
      [55, "outside"], // Always outside the shape
      [25, "points"], // In the points of the star, alternating fill in star and always filled in the circles
      [10, "middle"] // In the middle, fill depends on the fillRule
    ];

    function should_be_filled(fillRule, shape, orbit, k) {
      if (!(fillRule === "nonzero" || fillRule === "evenodd")) {
        throw new Error("Unknown fillRule: " + fillRule);
      }
      if (orbit === "outside") {
        return false;
      }
      if (orbit === "middle") {
        if (shape === "contra_circle") {
          return false;
        }
        if (fillRule === "evenodd") {
          return false;
        }
        return true;
      }
      if (orbit === "points") {
        if (shape === "star") {
          return (k % 2 === 0);
        }
        return true;
      }
      throw new Error("Don't know, sorry");
    }

    function circle_point(x, y) {
      ctx.restore(origstate);
      ctx.beginPath();
      ctx.strokeStyle = "green";
      ctx.arc(x, y, 3, 0, Math.PI*2, true);
      ctx.closePath();
      ctx.stroke();
    }

    function test_point(x, y, expected_fill) {
      var x = Math.floor(x);
      var y = Math.floor(y);
      var expected_fill_color = [255, 0, 0, 255];
      var red_index = 4 * x + 4 * img_width * y;
      if (expected_fill) {
        var actual = [];
        for (var i = 0; i < 4; i++) {
          actual.push(data[red_index + i]);
        }
        _assertEqual(JSON.stringify(actual), JSON.stringify(expected_fill_color), "actual", "expected_fill_color");
      } else {
        var actual_alpha = data[red_index + 3];
        _assertEqual(actual_alpha, 0, "actual_alpha", "0");
      }
    }

    var img_width = 1200;
    var img_height = 800;
    var data = ctx.getImageData(0, 0, img_width, img_height).data;
    for (var i = 0; i < center_points.length; i++) {
      var center_x = center_points[i][0];
      var center_y = center_points[i][1];
      var shape = center_points[i][2];
      circle_point(center_x, center_y);
      
      for (var j = 0; j < radiuss.length; j++) {
        var radius = radiuss[j][0];
        var orbit = radiuss[j][1];
        var count = 10;
        for (var k = 0; k < count; k++) {
          var angle = k * ((2*Math.PI) / count);
          var x = center_x + (Math.sin(angle - Math.PI) * radius);
          var y = center_y + (Math.cos(angle - Math.PI) * radius);
          circle_point(x, y);
          // console.log(fillRule, shape, orbit, k, should_be_filled(fillRule, shape, orbit, k));
          test_point(x, y, should_be_filled(fillRule, shape, orbit, k));
        }
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
