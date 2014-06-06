var spark = require('sparknode');

var core = new spark.Core(
  process.env.SPARK_ACCESS_TOKEN,
  process.env.SPARK_CORE_ID,
  {}
);

core.on('find-user', function(data){
  console.log(data);
});

core.on('error', function(err){
  console.log(err);
});
