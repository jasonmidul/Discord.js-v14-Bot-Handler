const { ClusterManager, ReClusterManager } = require("discord-hybrid-sharding");
const { botToken } = require("./config");
const manager = new ClusterManager("./bot.js", {
  token: botToken,
  totalShards: "auto",
  shardsPerClusters: 2,
  totalClusters: "auto",
  mode: "process",
});

console.clear();
manager.on("clusterCreate", (cluster) =>
  console.log(`Cluster launched : ${cluster.id}`)
);
manager.on("clusterDestroy", (cluster) =>
  console.log(`Cluster destroyed : ${cluster.id}`)
);
manager.spawn();
