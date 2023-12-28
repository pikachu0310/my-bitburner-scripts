export function Delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** @param {NS} ns
 * @param {string} targetServer
 */
export function IsSecurity0(ns, targetServer) {
  return (ns.getServerSecurityLevel(targetServer) - ns.getServerMinSecurityLevel(targetServer) === 0)
}

/** @param {NS} ns
 * @param {string} targetServer
 */
export function Hack(ns, targetServer) {
  return ns.hack(targetServer);
}

/** @param {NS} ns
 * @param {string} targetServer
 */
export function Grow(ns, targetServer) {
  return ns.grow(targetServer);
}

/** @param {NS} ns
 * @param {string} targetServer
 */
export function Weak(ns, targetServer) {
  return ns.weaken(targetServer);
}
