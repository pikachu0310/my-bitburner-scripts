import { Hack } from './util.js';

/** @param {NS} ns */
export async function main(ns) {
  if (ns.args.length < 1) {
    console.error(`usage: hack.js [target]`);
    ns.exit();
  }

  if (ns.args.length >= 2) {
    await ns.sleep(parseInt(ns.args[1]));
  }

  const target = ns.args[0];
  await Hack(ns, target);
}
