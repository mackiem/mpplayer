var fs = require('fs');
var parse = require('csv-parse/lib/sync');
P = {};

function readData(err, data) {
    P.data = data;
    P.data = parse(data, {'auto_parse' : true});
}

function convert_csv_to_json(csv) {
    // need x, y, orientation (x, y)
    // min, max to determine grid width and length
    var min_x = Number.POSITIVE_INFINITY;
    var max_x = Number.NEGATIVE_INFINITY;
    var min_y = Number.POSITIVE_INFINITY;
    var max_y = Number.NEGATIVE_INFINITY;

    for (var i = 0; i < csv.length; ++i) {
        var row = csv[i];
        min_x = Math.min(row[1], min_x);
        max_x = Math.max(row[1], max_x);
        min_y = Math.min(row[3], min_y);
        max_y = Math.max(row[3], max_y);
    }
    console.log(min_x, max_x);
    var add_x = (min_x < 0) ? -min_x : 0;
    var add_y = (min_y < 0) ? -min_y : 0;

    var grid = {};
    grid.width = max_x + add_x;
    grid.height = max_y + add_y;
    grid.length = 1;

    var motion_arr = [];
    for (var i = 0; i < csv.length; ++i) {
        var row = csv[i];
        var agentobj = {};
        var pos = {};
        pos["x"] = row[1] + add_x;
        pos["y"] = row[3] + add_y;
        pos["z"] = 0;
        // calculate correct vel (orientation) later
        var vel = {};
        vel["x"] = 0;
        vel["y"] = 0;
        vel["z"] = 0;

        agentobj["0"] = {};
        agentobj["0"]["pos"] = pos;
        agentobj["0"]["vel"] = vel;
        motion_arr.push(agentobj);
    }
    var output_obj = {};
    output_obj["grid"] = grid;
    output_obj["motion"] = motion_arr;

    return output_obj;
}

P.data = fs.readFileSync('holo-lens-full.csv', 'utf8');
P.csv = parse(P.data, {'auto_parse' : true});
P.json = convert_csv_to_json(P.csv);
console.log(P.json.motion[0]["0"]);
fs.writeFileSync('holo-lens-motion.json', JSON.stringify(P.json, null, '\t'));
//var data = $.csv.toObjects(csv);
