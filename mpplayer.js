var motion_data;
var canvas;
var timestep = 0;
var ratio = {};
var trails = [];

function rad(deg) {
  return deg * Math.PI/180.0;
}

function runAnim() {
  timestep = 0;
  trails = [];
  //Query('#ms_word_filtered_html' ).val( motion_data["0"]);
  if (motion_data["motion"]) {
    var desired_width = 800;
    var desired_height = 600;
    canvas.resize(desired_width, desired_height);
    ratio.x = desired_width / motion_data["grid"]["width"]
    ratio.y = desired_height / motion_data["grid"]["height"];
    loop();
  }
}
function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object
  // use the 1st file from the list
  f = files[0];

  var reader = new FileReader();

  // Closure to capture the file information.
  reader.onload = (function(theFile) {
    return function(e) {

      motion_data = JSON.parse(e.target.result);

      runAnim();
    };
  })(f);

  // Read in the image file as a data URL.
  reader.readAsText(f);
}



function setup() {
  canvas = createCanvas(100, 100);
  background(204);

  noLoop();
};

function draw_agent(x, y, velx, vely) {
  push();

  strokeWeight(1);
  translate(x, y);
  //translate(0.5 * grid.len, 0.5 * grid.len);
  var sx = 0;
  var sy = 0;
  var len = 10;
  //rotate(x);
  fill('#FF0000');
  var vel = createVector(velx, vely);
  rotate(vel.heading() - PI/2.0);

  //translate(-2 *sx , -2 * sy + 0.5 * grid.len);

  var tx = sx + len * Math.cos(rad(60));
  var ty = sy + len * Math.sin(rad(60));
  translate(-(sx + tx + sx + len) / 3, -(sy + ty + sy) / 3);
  triangle(sx, sy, tx, ty, sx + len, sy);
  ellipse(tx, ty, len * 0.3, len * 0.3);

  // noFill();
  // stroke('#FF0000');
  // ellipse((sx + tx + sx + len) / 3, (sy + ty + sy) / 3, radius, radius);

  pop();
}

function draw_trail(x, y, x2, y2) {
  //ellipse(x, y, 5, 5);
  if (x2) {
    strokeWeight(3);
    line(x, y, x2, y2)
  }
}



function draw() {
  background(204);
  if (motion_data && motion_data["motion"]) {
    var steps = motion_data["motion"].length;
    var timesteps = motion_data["motion"];

    var agents = timesteps[timestep];
    if (agents) {
      for (var t = 1; t < trails.length; ++t) {
        var a_t_last = trails[t-1];
        var a_t = trails[t];
        for (var a in Object.keys(a_t)) {
          if (a_t_last[a]) { 
            //for (var a = 0; a < a_t.length; ++a) {
            draw_trail(a_t[a].pos.x * ratio.x, a_t[a].pos.y * ratio.y, a_t_last[a].pos.x * ratio.x, a_t_last[a].pos.y * ratio.y);
          }
        }
      }

      for (var a in Object.keys(agents))
      //for (var a = 0; ba < agents.length; ++a) {
        var agent = agents[a];
        //ellipse(agent.pos.x * ratio.x, agent.pos.y * ratio.y, 10, 10);
        draw_agent(agent.pos.x * ratio.x, agent.pos.y * ratio.y, agent.vel.x, agent.vel.y);
        //ellipse(timestep, timestep, 10, 10);
      }
      if (timestep < timesteps.length - 1) {

        if (timestep % 5 == 0) {
          if (trails.length > 50) {
            trails.shift();
          }
          trails.push(agents);
        }
        timestep += 1;
      }

    }

  }

};

function mousePressed() {

  redraw();
};
