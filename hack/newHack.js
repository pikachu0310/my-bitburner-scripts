import { IsSecurity0, Delay } from './util.js';

/** @param {NS} ns */
export async function main(ns) {
  const hackMoneyRate = 0.9
  const delayTime = 100;
  const batchDelayTime = 500;

  // const targetServer = "n00dles"
  const targetServer = "computek"
  // const targetServer = "summit-uni"
  // const targetServer = "millenium-fitness"
  let runServers = []
  for (let i = 1; i <= 8; i++) {
    runServers.push(`max${i}`)
  }

  for (const runServer of runServers) {
    ns.killall(runServer);
    ns.scp("util.js", runServer);
    ns.scp("grow.js", runServer);
    ns.scp("weak.js", runServer);
    ns.scp("hack.js", runServer);
  }

  const growTime = ns.getGrowTime(targetServer);
  const weakTime = ns.getWeakenTime(targetServer);
  const hackTime = ns.getHackTime(targetServer);
  const growDelay = (weakTime - delayTime) - growTime;
  const weakFirstDelay = 0;
  const hackDelay = (weakTime + delayTime) - hackTime;
  const weakSecondDelay = (weakTime + delayTime * 2) - weakTime;

  if (!IsSecurity0(ns, targetServer)) {
    ns.tprint(`targetServerのSecurityを0にしてから`)
    ns.exit()
  }

  const runServerTemp = runServers[0]
  const runServerServer = ns.getServer(runServerTemp)
  const growThreadNum = Math.ceil(ns.growthAnalyze(targetServer, 10 + (1 / (1 - hackMoneyRate)), runServerServer.cpuCores))
  const growSecurityUp = Math.ceil(ns.growthAnalyzeSecurity(growThreadNum, targetServer, runServerServer.cpuCores))
  const hackThreadNum = Math.ceil(ns.hackAnalyzeThreads(targetServer, ns.getServerMoneyAvailable(targetServer) * hackMoneyRate))
  const hackSecurityUp = Math.ceil(ns.hackAnalyzeSecurity(hackThreadNum, targetServer))
  // const weak1ThreadNum = Math.ceil(1 + (growSecurityUp * 2) / ns.weakenAnalyze(1, runServerServer.cpuCores))
  // const weak2ThreadNum = Math.ceil(1 + (hackSecurityUp * 2) / ns.weakenAnalyze(1, runServerServer.cpuCores))
  const weak1ThreadNum = Math.ceil(100 / ns.weakenAnalyze(1, runServerServer.cpuCores))
  const weak2ThreadNum = Math.ceil(100 / ns.weakenAnalyze(1, runServerServer.cpuCores))

  const oneTimeThreadsNum = growThreadNum + weak1ThreadNum + hackThreadNum + weak2ThreadNum
  const oneTimeRam = 1.6 * oneTimeThreadsNum

  let sum = 0
  while (true) {
    for (const runServer of runServers) {
      let i = 0
      while ((ns.getServerMaxRam(runServer) - ns.getServerUsedRam(runServer)) > oneTimeRam) {
        // for (let j = 1; j <= 30; j++) {
        const growPromise = growServer(ns, runServer, targetServer, growDelay, growThreadNum, sum);
        const weak1Promise = weakServer(ns, runServer, targetServer, weakFirstDelay, weak1ThreadNum, sum);
        const hackPromise = hackServer(ns, runServer, targetServer, hackDelay, hackThreadNum, sum);
        const weak2Promise = weakServer(ns, runServer, targetServer, weakSecondDelay, weak2ThreadNum, sum);
        // if (sum % 10 === 0) {
        //   ns.tprint(`start on ${runServer}:${i} (${sum})`);
        // }
        await Delay(batchDelayTime)
        i += 1
        sum += 1
      }
    }
    await Delay(batchDelayTime)
  }
}

/** @param {NS} ns
 * @param {string} runServer
 * @param {string} targetServer
 * @param {number} delayTime
 * @param {number} threadNum
 * @param {number} i
 */
async function growServer(ns, runServer, targetServer, delayTime, threadNum, i) {
  const pID = ns.exec("grow.js", runServer, threadNum, targetServer, delayTime)
  // while (ns.isRunning(pID, runServer)) {
  //   await Delay(3)
  // }
  // const now = Math.round((ns.getServerMoneyAvailable(targetServer) * 100 / ns.getServerMaxMoney(targetServer)) * 10000) / 10000;
  // ns.tprint(`grow完了${i}: now:${now}%\n`);
}

/** @param {NS} ns
 * @param {string} runServer
 * @param {string} targetServer
 * @param {number} delayTime
 * @param {number} threadNum
 * @param {number} i
 */
async function weakServer(ns, runServer, targetServer, delayTime, threadNum, i) {
  const pID = ns.exec("weak.js", runServer, threadNum, targetServer, delayTime)
  // while (ns.isRunning(pID, runServer)) {
  //   await Delay(3)
  // }
  // const now = ns.getServerSecurityLevel(targetServer) - ns.getServerMinSecurityLevel(targetServer)
  // ns.tprint(`weak完了${i}: now:${now}\n`);
}

/** @param {NS} ns
 * @param {string} runServer
 * @param {string} targetServer
 * @param {number} delayTime
 * @param {number} threadNum
 * @param {number} i
 */
async function hackServer(ns, runServer, targetServer, delayTime, threadNum, i) {
  const pID = ns.exec("hack.js", runServer, threadNum, targetServer, delayTime)
  // while (ns.isRunning(pID, runServer)) {
  //   await Delay(3)
  // }
  // const now = Math.round((ns.getServerMoneyAvailable(targetServer) * 100 / ns.getServerMaxMoney(targetServer)) * 10000) / 10000;
  // ns.tprint(`hack完了${i}: now:${now}%\n`);
}
