var logging = require("./logging");
var node_redis = require("redis");
var config = require("./config");
var url = require("url");
var fs = require("fs");

var redis = null;

// sets up redis connection
// flushes redis when running on heroku (files aren't kept between pushes)
function connect_redis() {
  logging.log("connecting to redis...");
  // parse redis env
  var redis_env = (process.env.REDISCLOUD_URL || process.env.REDIS_URL);
  var redis_url = redis_env ? url.parse(redis_env) : {};
  redis_url.port = redis_url.port || 6379;
  redis_url.hostname = redis_url.hostname || "localhost";
  // connect to redis
  redis = node_redis.createClient(redis_url.port, redis_url.hostname);
  if (redis_url.auth) {
    redis.auth(redis_url.auth.split(":")[1]);
  }
  redis.on("ready", function() {
    logging.log("Redis connection established.");
    if(process.env.HEROKU) {
      logging.log("Running on heroku, flushing redis");
      redis.flushall();
    }
  });
  redis.on("error", function (err) {
    logging.error(err);
  });
  redis.on("end", function () {
    logging.warn("Redis connection lost!");
  });
}

// sets the date of the face file belonging to +hash+ to now
// the helms file is ignored because we only need 1 file to read/write from
function update_file_date(hash, uuid) {
  if (hash) {
    var path = config.faces_dir + hash + ".png";
    fs.exists(path, function(exists) {
      if (exists) {
        var date = new Date();
        fs.utimes(path, date, date, function(err){
          if (err) {
            logging.error(uuid + " Error: " + err);
          }
        });
      } else {
        logging.error(uuid + " tried to update " + path + " date, but it does not exist");
      }
    });
  }
}

var exp = {};

// returns the redis instance
exp.get_redis = function() {
  return redis;
};


// updates the redis instance's server_info object
// callback contains error, info object
exp.info = function(callback) {
  redis.info(function (err, res) {

    // parse the info command and store it in redis.server_info

    // this code block was taken from mranney/node_redis#on_info_cmd
    // http://git.io/LBUNbg
    var lines = res.toString().split("\r\n");
    var obj = {};
    lines.forEach(function (line) {
      var parts = line.split(":");
      if (parts[1]) {
        obj[parts[0]] = parts[1];
      }
    });
    obj.versions = [];
    if( obj.redis_version ){
      obj.redis_version.split(".").forEach(function(num) {
        obj.versions.push(+num);
      });
    }
    redis.server_info = obj;

    callback(err, redis.server_info);
  });
};

// sets the timestamp for +uuid+ and its face file's date to now
exp.update_timestamp = function(uuid, hash) {
  logging.log(uuid + " cache: updating timestamp");
  var time = new Date().getTime();
  // store uuid in lower case if not null
  uuid = uuid && uuid.toLowerCase();
  redis.hmset(uuid, "t", time);
  update_file_date(hash, uuid);
};

// create the key +uuid+, store +hash+ and time
exp.save_hash = function(uuid, skin, cape) {
  logging.log(uuid + " cache: saving hash");
  logging.log("skin:" + skin + " cape:" + cape);
  var time = new Date().getTime();
  // store shorter null byte instead of "null"
  skin = skin || ".";
  cape = cape || ".";
  // store uuid in lower case if not null
  uuid = uuid && uuid.toLowerCase();
  redis.hmset(uuid, "s", skin, "c", cape, "t", time);
};

exp.remove_hash = function(uuid) {
  logging.log(uuid + " cache: deleting hash");
  redis.del(uuid.toLowerCase(), "h", "t");
};

// get a details object for +uuid+
// {skin: "0123456789abcdef", cape: "gs1gds1g5d1g5ds1", time: 1414881524512}
// null when uuid unkown
exp.get_details = function(uuid, callback) {
  // get uuid in lower case if not null
  uuid = uuid && uuid.toLowerCase();
  redis.hgetall(uuid, function(err, data) {
    var details = null;
    if (data) {
      details = {
        skin: (data.s === "." ? null : data.s),
        cape: (data.c === "." ? null : data.c),
        time: Number(data.t)
      };
    }
    callback(err, details);
  });
};

connect_redis();
module.exports = exp;
