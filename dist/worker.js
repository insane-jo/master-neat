/*! For license information please see worker.js.LICENSE.txt */
!function (t, e) {
  "object" == typeof exports && "object" == typeof module ? module.exports = e(require("child_process")) : "function" == typeof define && define.amd ? define(["child_process"], e) : "object" == typeof exports ? exports.MasterNeat = e(require("child_process")) : t.MasterNeat = e(t.child_process)
}(self, (t => (() => {
  "use strict";
  var e = {
    975: t => {
      function e(t) {
        if ("string" != typeof t) throw new TypeError("Path must be a string. Received " + JSON.stringify(t))
      }

      function n(t, e) {
        for (var n, o = "", i = 0, r = -1, a = 0, s = 0; s <= t.length; ++s) {
          if (s < t.length) n = t.charCodeAt(s); else {
            if (47 === n) break;
            n = 47
          }
          if (47 === n) {
            if (r === s - 1 || 1 === a) ; else if (r !== s - 1 && 2 === a) {
              if (o.length < 2 || 2 !== i || 46 !== o.charCodeAt(o.length - 1) || 46 !== o.charCodeAt(o.length - 2)) if (o.length > 2) {
                var l = o.lastIndexOf("/");
                if (l !== o.length - 1) {
                  -1 === l ? (o = "", i = 0) : i = (o = o.slice(0, l)).length - 1 - o.lastIndexOf("/"), r = s, a = 0;
                  continue
                }
              } else if (2 === o.length || 1 === o.length) {
                o = "", i = 0, r = s, a = 0;
                continue
              }
              e && (o.length > 0 ? o += "/.." : o = "..", i = 2)
            } else o.length > 0 ? o += "/" + t.slice(r + 1, s) : o = t.slice(r + 1, s), i = s - r - 1;
            r = s, a = 0
          } else 46 === n && -1 !== a ? ++a : a = -1
        }
        return o
      }

      var o = {
        resolve: function () {
          for (var t, o = "", i = !1, r = arguments.length - 1; r >= -1 && !i; r--) {
            var a;
            r >= 0 ? a = arguments[r] : (void 0 === t && (t = process.cwd()), a = t), e(a), 0 !== a.length && (o = a + "/" + o, i = 47 === a.charCodeAt(0))
          }
          return o = n(o, !i), i ? o.length > 0 ? "/" + o : "/" : o.length > 0 ? o : "."
        }, normalize: function (t) {
          if (e(t), 0 === t.length) return ".";
          var o = 47 === t.charCodeAt(0), i = 47 === t.charCodeAt(t.length - 1);
          return 0 !== (t = n(t, !o)).length || o || (t = "."), t.length > 0 && i && (t += "/"), o ? "/" + t : t
        }, isAbsolute: function (t) {
          return e(t), t.length > 0 && 47 === t.charCodeAt(0)
        }, join: function () {
          if (0 === arguments.length) return ".";
          for (var t, n = 0; n < arguments.length; ++n) {
            var i = arguments[n];
            e(i), i.length > 0 && (void 0 === t ? t = i : t += "/" + i)
          }
          return void 0 === t ? "." : o.normalize(t)
        }, relative: function (t, n) {
          if (e(t), e(n), t === n) return "";
          if ((t = o.resolve(t)) === (n = o.resolve(n))) return "";
          for (var i = 1; i < t.length && 47 === t.charCodeAt(i); ++i) ;
          for (var r = t.length, a = r - i, s = 1; s < n.length && 47 === n.charCodeAt(s); ++s) ;
          for (var l = n.length - s, u = a < l ? a : l, c = -1, h = 0; h <= u; ++h) {
            if (h === u) {
              if (l > u) {
                if (47 === n.charCodeAt(s + h)) return n.slice(s + h + 1);
                if (0 === h) return n.slice(s + h)
              } else a > u && (47 === t.charCodeAt(i + h) ? c = h : 0 === h && (c = 0));
              break
            }
            var f = t.charCodeAt(i + h);
            if (f !== n.charCodeAt(s + h)) break;
            47 === f && (c = h)
          }
          var d = "";
          for (h = i + c + 1; h <= r; ++h) h !== r && 47 !== t.charCodeAt(h) || (0 === d.length ? d += ".." : d += "/..");
          return d.length > 0 ? d + n.slice(s + c) : (s += c, 47 === n.charCodeAt(s) && ++s, n.slice(s))
        }, _makeLong: function (t) {
          return t
        }, dirname: function (t) {
          if (e(t), 0 === t.length) return ".";
          for (var n = t.charCodeAt(0), o = 47 === n, i = -1, r = !0, a = t.length - 1; a >= 1; --a) if (47 === (n = t.charCodeAt(a))) {
            if (!r) {
              i = a;
              break
            }
          } else r = !1;
          return -1 === i ? o ? "/" : "." : o && 1 === i ? "//" : t.slice(0, i)
        }, basename: function (t, n) {
          if (void 0 !== n && "string" != typeof n) throw new TypeError('"ext" argument must be a string');
          e(t);
          var o, i = 0, r = -1, a = !0;
          if (void 0 !== n && n.length > 0 && n.length <= t.length) {
            if (n.length === t.length && n === t) return "";
            var s = n.length - 1, l = -1;
            for (o = t.length - 1; o >= 0; --o) {
              var u = t.charCodeAt(o);
              if (47 === u) {
                if (!a) {
                  i = o + 1;
                  break
                }
              } else -1 === l && (a = !1, l = o + 1), s >= 0 && (u === n.charCodeAt(s) ? -1 == --s && (r = o) : (s = -1, r = l))
            }
            return i === r ? r = l : -1 === r && (r = t.length), t.slice(i, r)
          }
          for (o = t.length - 1; o >= 0; --o) if (47 === t.charCodeAt(o)) {
            if (!a) {
              i = o + 1;
              break
            }
          } else -1 === r && (a = !1, r = o + 1);
          return -1 === r ? "" : t.slice(i, r)
        }, extname: function (t) {
          e(t);
          for (var n = -1, o = 0, i = -1, r = !0, a = 0, s = t.length - 1; s >= 0; --s) {
            var l = t.charCodeAt(s);
            if (47 !== l) -1 === i && (r = !1, i = s + 1), 46 === l ? -1 === n ? n = s : 1 !== a && (a = 1) : -1 !== n && (a = -1); else if (!r) {
              o = s + 1;
              break
            }
          }
          return -1 === n || -1 === i || 0 === a || 1 === a && n === i - 1 && n === o + 1 ? "" : t.slice(n, i)
        }, format: function (t) {
          if (null === t || "object" != typeof t) throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof t);
          return function (t, e) {
            var n = e.dir || e.root, o = e.base || (e.name || "") + (e.ext || "");
            return n ? n === e.root ? n + o : n + "/" + o : o
          }(0, t)
        }, parse: function (t) {
          e(t);
          var n = {root: "", dir: "", base: "", ext: "", name: ""};
          if (0 === t.length) return n;
          var o, i = t.charCodeAt(0), r = 47 === i;
          r ? (n.root = "/", o = 1) : o = 0;
          for (var a = -1, s = 0, l = -1, u = !0, c = t.length - 1, h = 0; c >= o; --c) if (47 !== (i = t.charCodeAt(c))) -1 === l && (u = !1, l = c + 1), 46 === i ? -1 === a ? a = c : 1 !== h && (h = 1) : -1 !== a && (h = -1); else if (!u) {
            s = c + 1;
            break
          }
          return -1 === a || -1 === l || 0 === h || 1 === h && a === l - 1 && a === s + 1 ? -1 !== l && (n.base = n.name = 0 === s && r ? t.slice(1, l) : t.slice(s, l)) : (0 === s && r ? (n.name = t.slice(1, a), n.base = t.slice(1, l)) : (n.name = t.slice(s, a), n.base = t.slice(s, l)), n.ext = t.slice(a, l)), s > 0 ? n.dir = t.slice(0, s - 1) : r && (n.dir = "/"), n
        }, sep: "/", delimiter: ":", win32: null, posix: null
      };
      o.posix = o, t.exports = o
    }, 292: (t, e) => {
      Object.defineProperty(e, "__esModule", {value: !0}), e.default = class {
        constructor(t, e, n) {
          this.gain = 1, this.elegibility = 0, this.previousDeltaWeight = 0, this.totalDeltaWeight = 0, this.gater = null, this.xtrace = {
            nodes: [],
            values: []
          }, this.from = t, this.to = e, this.weight = void 0 === n ? .2 * Math.random() - .1 : n
        }

        toJSON() {
          return {weight: this.weight}
        }

        static innovationID(t, e) {
          return .5 * (t + e) * (t + e + 1) + e
        }
      }
    }, 712: function (t, e, n) {
      var o = this && this.__importDefault || function (t) {
        return t && t.__esModule ? t : {default: t}
      };
      Object.defineProperty(e, "__esModule", {value: !0});
      const i = o(n(292)), r = o(n(799)), a = o(n(28)), s = n(483);

      class l {
        constructor(t) {
          this.activation = 0, this.derivative = 0, this.state = 0, this.old = 0, this.mask = 1, this.previousDeltaBias = 0, this.totalDeltaBias = 0, this.error = {
            responsibility: 0,
            projected: 0,
            gated: 0
          }, this.bias = t === s.NodeTypeEnum.input ? 0 : .2 * Math.random() - .1, this.squash = r.default.activation.LOGISTIC, this.type = t || s.NodeTypeEnum.hidden, this.connections = {
            in: [],
            out: [],
            gated: [],
            self: new i.default(this, this, 0)
          }
        }

        activate(t) {
          if (void 0 !== t) return this.activation = t, this.activation;
          this.old = this.state, this.state = this.connections.self.gain * this.connections.self.weight * this.state + this.bias;
          for (let t = 0; t < this.connections.in.length; t++) {
            var e = this.connections.in[t];
            this.state += e.from.activation * e.weight * e.gain
          }
          this.activation = this.squash(this.state) * this.mask, this.derivative = this.squash(this.state, !0);
          var n = [], o = [];
          for (let t = 0; t < this.connections.gated.length; t++) {
            let e = this.connections.gated[t], i = e.to, r = n.indexOf(i);
            r > -1 ? o[r] += e.weight * e.from.activation : (n.push(i), o.push(e.weight * e.from.activation + (i.connections.self.gater === this ? i.old : 0))), e.gain = this.activation
          }
          for (let t = 0; t < this.connections.in.length; t++) {
            let e = this.connections.in[t];
            e.elegibility = this.connections.self.gain * this.connections.self.weight * e.elegibility + e.from.activation * e.gain;
            for (var i = 0; i < n.length; i++) {
              let t = n[i], r = o[i], a = e.xtrace.nodes.indexOf(t);
              a > -1 ? e.xtrace.values[a] = t.connections.self.gain * t.connections.self.weight * e.xtrace.values[a] + this.derivative * e.elegibility * r : (e.xtrace.nodes.push(t), e.xtrace.values.push(this.derivative * e.elegibility * r))
            }
          }
          return this.activation
        }

        noTraceActivate(t) {
          if (void 0 !== t) return this.activation = t, this.activation;
          var e;
          for (this.state = this.connections.self.gain * this.connections.self.weight * this.state + this.bias, e = 0; e < this.connections.in.length; e++) {
            var n = this.connections.in[e];
            this.state += n.from.activation * n.weight * n.gain
          }
          for (this.activation = this.squash(this.state), e = 0; e < this.connections.gated.length; e++) this.connections.gated[e].gain = this.activation;
          return this.activation
        }

        propagate(t = .3, e = 0, n, o) {
          let i = 0;
          if (this.type === s.NodeTypeEnum.output) this.error.responsibility = this.error.projected = (o || 0) - this.activation; else {
            for (let t = 0; t < this.connections.out.length; t++) {
              let e = this.connections.out[t];
              i += e.to.error.responsibility * e.weight * e.gain
            }
            this.error.projected = this.derivative * i, i = 0;
            for (let t = 0; t < this.connections.gated.length; t++) {
              let e = this.connections.gated[t], n = e.to, o = n.connections.self.gater === this ? n.old : 0;
              o += e.weight * e.from.activation, i += n.error.responsibility * o
            }
            this.error.gated = this.derivative * i, this.error.responsibility = this.error.projected + this.error.gated
          }
          if (this.type === s.NodeTypeEnum.constant) return;
          for (let o = 0; o < this.connections.in.length; o++) {
            let i = this.connections.in[o], a = this.error.projected * i.elegibility;
            for (var r = 0; r < i.xtrace.nodes.length; r++) {
              let t = i.xtrace.nodes[r], e = i.xtrace.values[r];
              a += t.error.responsibility * e
            }
            let s = t * a * this.mask;
            i.totalDeltaWeight += s, n && (i.totalDeltaWeight += e * i.previousDeltaWeight, i.weight += i.totalDeltaWeight, i.previousDeltaWeight = i.totalDeltaWeight, i.totalDeltaWeight = 0)
          }
          const a = t * this.error.responsibility;
          this.totalDeltaBias += a, n && (this.totalDeltaBias += e * this.previousDeltaBias, this.bias += this.totalDeltaBias, this.previousDeltaBias = this.totalDeltaBias, this.totalDeltaBias = 0)
        }

        connect(t, e) {
          const n = [];
          if (void 0 !== t.bias) if (t === this) 0 !== this.connections.self.weight ? a.default.warnings && console.warn("This connection already exists!") : this.connections.self.weight = e || 1, n.push(this.connections.self); else {
            if (this.isProjectingTo(t)) throw new Error("Already projecting a connection to this node!");
            {
              let o = new i.default(this, t, e);
              t.connections.in.push(o), this.connections.out.push(o), n.push(o)
            }
          } else for (var o = 0; o < t.nodes.length; o++) {
            let r = new i.default(this, t.nodes[o], e);
            t.nodes[o].connections.in.push(r), this.connections.out.push(r), t.connections.in.push(r), n.push(r)
          }
          return n
        }

        disconnect(t, e) {
          if (this !== t) {
            for (let e = 0; e < this.connections.out.length; e++) {
              let n = this.connections.out[e];
              if (n.to === t) {
                this.connections.out.splice(e, 1);
                let t = n.to.connections.in.indexOf(n);
                n.to.connections.in.splice(t, 1), null !== n.gater && n.gater.ungate(n);
                break
              }
            }
            e && t.disconnect(this)
          } else this.connections.self.weight = 0
        }

        gate(t) {
          Array.isArray(t) || (t = [t]);
          for (let e = 0; e < t.length; e++) {
            let n = t[e];
            this.connections.gated.push(n), n.gater = this
          }
        }

        ungate(t) {
          Array.isArray(t) || (t = [t]);
          for (var e = t.length - 1; e >= 0; e--) {
            var n = t[e], o = this.connections.gated.indexOf(n);
            this.connections.gated.splice(o, 1), n.gater = null, n.gain = 1
          }
        }

        clear() {
          for (var t = 0; t < this.connections.in.length; t++) {
            var e = this.connections.in[t];
            e.elegibility = 0, e.xtrace = {nodes: [], values: []}
          }
          for (t = 0; t < this.connections.gated.length; t++) this.connections.gated[t].gain = 0;
          this.error.responsibility = this.error.projected = this.error.gated = 0, this.old = this.state = this.activation = 0
        }

        isProjectingTo(t) {
          if (t === this && 0 !== this.connections.self.weight) return !0;
          for (var e = 0; e < this.connections.out.length; e++) if (this.connections.out[e].to === t) return !0;
          return !1
        }

        isProjectedBy(t) {
          if (t === this && 0 !== this.connections.self.weight) return !0;
          for (var e = 0; e < this.connections.in.length; e++) if (this.connections.in[e].from === t) return !0;
          return !1
        }

        toJSON() {
          return {bias: this.bias, type: this.type, squash: this.squash.name, mask: this.mask}
        }

        static fromJSON(t) {
          var e = new l;
          return e.bias = t.bias, e.type = t.type, e.mask = t.mask, e.squash = r.default.activation[t.squash], e
        }
      }

      e.default = l
    }, 28: (t, e) => {
      Object.defineProperty(e, "__esModule", {value: !0}), e.default = {warnings: !1}
    }, 297: (t, e) => {
      Object.defineProperty(e, "__esModule", {value: !0});
      const n = {
        LOGISTIC: (t, e) => {
          const n = 1 / (1 + Math.exp(-t));
          return e ? n * (1 - n) : n
        }, TANH: function (t, e) {
          return e ? 1 - Math.pow(Math.tanh(t), 2) : Math.tanh(t)
        }, IDENTITY: function (t, e) {
          return e ? 1 : t
        }, STEP: function (t, e) {
          return e ? 0 : t > 0 ? 1 : 0
        }, RELU: function (t, e) {
          return e ? t > 0 ? 1 : 0 : t > 0 ? t : 0
        }, SOFTSIGN: function (t, e) {
          const n = 1 + Math.abs(t);
          return e ? t / Math.pow(n, 2) : t / n
        }, SINUSOID: function (t, e) {
          return e ? Math.cos(t) : Math.sin(t)
        }, GAUSSIAN: function (t, e) {
          const n = Math.exp(-Math.pow(t, 2));
          return e ? -2 * t * n : n
        }, BENT_IDENTITY: function (t, e) {
          const n = Math.sqrt(Math.pow(t, 2) + 1);
          return e ? t / (2 * n) + 1 : (n - 1) / 2 + t
        }, BIPOLAR: function (t, e) {
          return e ? 0 : t > 0 ? 1 : -1
        }, BIPOLAR_SIGMOID: function (t, e) {
          const n = 2 / (1 + Math.exp(-t)) - 1;
          return e ? .5 * (1 + n) * (1 - n) : n
        }, HARD_TANH: function (t, e) {
          return e ? t > -1 && t < 1 ? 1 : 0 : Math.max(-1, Math.min(1, t))
        }, ABSOLUTE: function (t, e) {
          return e ? t < 0 ? -1 : 1 : Math.abs(t)
        }, INVERSE: function (t, e) {
          return e ? -1 : 1 - t
        }, SELU: function (t, e) {
          const n = 1.6732632423543772, o = 1.0507009873554805, i = t > 0 ? t : n * Math.exp(t) - n;
          return e ? t > 0 ? o : (i + n) * o : i * o
        }
      };
      e.default = n
    }, 497: (t, e) => {
      Object.defineProperty(e, "__esModule", {value: !0}), e.default = {
        ALL_TO_ALL: {name: "OUTPUT"},
        ALL_TO_ELSE: {name: "INPUT"},
        ONE_TO_ONE: {name: "SELF"}
      }
    }, 756: (t, e) => {
      Object.defineProperty(e, "__esModule", {value: !0});
      const n = {
        CROSS_ENTROPY: function (t, e) {
          let n = 0;
          for (let o = 0; o < e.length; o++) n -= t[o] * Math.log(Math.max(e[o], 1e-15)) + (1 - t[o]) * Math.log(1 - Math.max(e[o], 1e-15));
          return n / e.length
        }, MSE: function (t, e) {
          let n = 0;
          for (let o = 0; o < e.length; o++) n += Math.pow(t[o] - e[o], 2);
          return n / e.length
        }, BINARY: function (t, e) {
          let n = 0;
          for (let o = 0; o < e.length; o++) n += Number(Math.round(2 * t[o]) !== Math.round(2 * e[o]));
          return n
        }, MAE: function (t, e) {
          for (var n = 0, o = 0; o < e.length; o++) n += Math.abs(t[o] - e[o]);
          return n / e.length
        }, MAPE: function (t, e) {
          for (var n = 0, o = 0; o < e.length; o++) n += Math.abs((e[o] - t[o]) / Math.max(t[o], 1e-15));
          return n / e.length
        }, MSLE: function (t, e) {
          for (var n = 0, o = 0; o < e.length; o++) n += Math.log(Math.max(t[o], 1e-15)) - Math.log(Math.max(e[o], 1e-15));
          return n
        }, HINGE: function (t, e) {
          for (var n = 0, o = 0; o < e.length; o++) n += Math.max(0, 1 - t[o] * e[o]);
          return n
        }
      };
      e.default = n
    }, 843: (t, e) => {
      Object.defineProperty(e, "__esModule", {value: !0}), e.default = {
        SINGLE_POINT: {
          name: "SINGLE_POINT",
          config: [.4]
        }, TWO_POINT: {name: "TWO_POINT", config: [.4, .9]}, UNIFORM: {name: "UNIFORM"}, AVERAGE: {name: "AVERAGE"}
      }
    }, 353: (t, e) => {
      Object.defineProperty(e, "__esModule", {value: !0}), e.default = {
        OUTPUT: {name: "OUTPUT"},
        INPUT: {name: "INPUT"},
        SELF: {name: "SELF"}
      }
    }, 799: function (t, e, n) {
      var o = this && this.__importDefault || function (t) {
        return t && t.__esModule ? t : {default: t}
      };
      Object.defineProperty(e, "__esModule", {value: !0});
      const i = o(n(297)), r = o(n(525)), a = o(n(959)), s = o(n(843)), l = o(n(756)), u = o(n(353)), c = o(n(497)),
        h = o(n(171));
      e.default = {
        activation: i.default,
        mutation: r.default,
        selection: a.default,
        crossover: s.default,
        cost: l.default,
        gating: u.default,
        connection: c.default,
        rate: h.default
      }
    }, 827: function (t, e, n) {
      var o = this && this.__importDefault || function (t) {
        return t && t.__esModule ? t : {default: t}
      };
      Object.defineProperty(e, "__esModule", {value: !0});
      const i = o(n(28)), r = {
        name: "ADD_BACK_CONN", callback(t) {
          let e = [];
          for (let n = t.input; n < t.nodes.length; n++) {
            let o = t.nodes[n];
            for (let i = t.input; i < n; i++) {
              let n = t.nodes[i];
              o.isProjectingTo(n) || e.push([o, n])
            }
          }
          if (0 === e.length) return void (i.default.warnings && console.warn("No more connections to be made!"));
          let n = e[Math.floor(Math.random() * e.length)];
          t.connect(n[0], n[1])
        }
      };
      e.default = r
    }, 57: function (t, e, n) {
      var o = this && this.__importDefault || function (t) {
        return t && t.__esModule ? t : {default: t}
      };
      Object.defineProperty(e, "__esModule", {value: !0});
      const i = o(n(28)), r = {
        name: "ADD_CONN", callback(t) {
          let e = [];
          for (let n = 0; n < t.nodes.length - t.output; n++) {
            let o = t.nodes[n];
            for (let i = Math.max(n + 1, t.input); i < t.nodes.length; i++) {
              let n = t.nodes[i];
              o.isProjectingTo(n) || e.push([o, n])
            }
          }
          if (0 === e.length) return void (i.default.warnings && console.warn("No more connections to be made!"));
          let n = e[Math.floor(Math.random() * e.length)];
          t.connect(n[0], n[1])
        }
      };
      e.default = r
    }, 684: function (t, e, n) {
      var o = this && this.__importDefault || function (t) {
        return t && t.__esModule ? t : {default: t}
      };
      Object.defineProperty(e, "__esModule", {value: !0});
      const i = o(n(28)), r = {
        name: "ADD_GATE", callback(t) {
          let e = t.connections.concat(t.selfconns), n = [];
          for (let t = 0; t < e.length; t++) {
            let o = e[t];
            null === o.gater && n.push(o)
          }
          if (0 === n.length) return void (i.default.warnings && console.warn("No more connections to gate!"));
          let o = Math.floor(Math.random() * (t.nodes.length - t.input) + t.input);
          const r = t.nodes[o];
          let a = n[Math.floor(Math.random() * n.length)];
          t.gate(r, a)
        }
      };
      e.default = r
    }, 183: function (t, e, n) {
      var o = this && this.__importDefault || function (t) {
        return t && t.__esModule ? t : {default: t}
      };
      Object.defineProperty(e, "__esModule", {value: !0});
      const i = o(n(712)), r = n(483), a = o(n(402)), s = {
        name: "ADD_NODE", callback(t) {
          let e = t.connections[Math.floor(Math.random() * t.connections.length)], n = e.gater;
          t.disconnect(e.from, e.to);
          let o = t.nodes.indexOf(e.to), s = new i.default(r.NodeTypeEnum.hidden);
          a.default.mutateNode(s);
          let l = Math.min(o, t.nodes.length - t.output);
          t.nodes.splice(l, 0, s);
          let u = t.connect(e.from, s)[0], c = t.connect(s, e.to)[0];
          null != n && t.gate(n, Math.random() >= .5 ? u : c)
        }
      };
      e.default = s
    }, 308: function (t, e, n) {
      var o = this && this.__importDefault || function (t) {
        return t && t.__esModule ? t : {default: t}
      };
      Object.defineProperty(e, "__esModule", {value: !0});
      const i = o(n(28)), r = {
        name: "ADD_SELF_CONN", callback(t) {
          let e = [];
          for (let n = t.input; n < t.nodes.length; n++) {
            let o = t.nodes[n];
            0 === o.connections.self.weight && e.push(o)
          }
          if (0 === e.length) return void (i.default.warnings && console.warn("No more self-connections to add!"));
          const n = e[Math.floor(Math.random() * e.length)];
          t.connect(n, n)
        }
      };
      e.default = r
    }, 525: function (t, e, n) {
      var o = this && this.__importDefault || function (t) {
        return t && t.__esModule ? t : {default: t}
      };
      Object.defineProperty(e, "__esModule", {value: !0});
      const i = o(n(183)), r = o(n(492)), a = o(n(57)), s = o(n(166)), l = o(n(798)), u = o(n(107)), c = o(n(402)),
        h = o(n(684)), f = o(n(571)), d = o(n(308)), g = o(n(293)), p = o(n(827)), v = o(n(406)), _ = o(n(214)), m = {
          ALL: [i.default, r.default, a.default, s.default, l.default, u.default, c.default, h.default, f.default, d.default, g.default, p.default, v.default, _.default],
          FFW: [i.default, r.default, a.default, s.default, l.default, u.default, c.default, _.default]
        };
      e.default = m
    }, 402: function (t, e, n) {
      var o = this && this.__importDefault || function (t) {
        return t && t.__esModule ? t : {default: t}
      };
      Object.defineProperty(e, "__esModule", {value: !0});
      const i = o(n(297)), r = o(n(28)), a = {
        name: "MOD_ACTIVATION",
        callback(t) {
          if (!this.mutateOutput && t.input + t.output === t.nodes.length) return void (r.default.warnings && console.warn("No nodes that allow mutation of activation function"));
          let e = Math.floor(Math.random() * (t.nodes.length - (this.mutateOutput ? 0 : t.output) - t.input) + t.input);
          const n = t.nodes[e];
          this.mutateNode(n)
        },
        mutateNode(t) {
          t.squash = this.allowed[(this.allowed.indexOf(t.squash) + Math.floor(Math.random() * (this.allowed.length - 1)) + 1) % this.allowed.length]
        },
        mutateOutput: !0,
        allowed: [i.default.LOGISTIC, i.default.TANH, i.default.RELU, i.default.IDENTITY, i.default.STEP, i.default.SOFTSIGN, i.default.SINUSOID, i.default.GAUSSIAN, i.default.BENT_IDENTITY, i.default.BIPOLAR, i.default.BIPOLAR_SIGMOID, i.default.HARD_TANH, i.default.ABSOLUTE, i.default.INVERSE, i.default.SELU]
      };
      e.default = a
    }, 107: (t, e) => {
      Object.defineProperty(e, "__esModule", {value: !0});
      const n = {
        name: "MOD_BIAS", callback(t) {
          let e = Math.floor(Math.random() * (t.nodes.length - t.input) + t.input);
          const n = t.nodes[e];
          this.mutateNode(n)
        }, mutateNode(t) {
          let e = Math.random() * (this.max - this.min) + this.min;
          t.bias += e
        }, min: -1, max: 1
      };
      e.default = n
    }, 798: (t, e) => {
      Object.defineProperty(e, "__esModule", {value: !0});
      const n = {
        name: "MOD_WEIGHT", callback(t) {
          let e = t.connections.concat(t.selfconns), n = e[Math.floor(Math.random() * e.length)],
            o = Math.random() * (this.max - this.min) + this.min;
          n.weight += o
        }, min: -1, max: 1
      };
      e.default = n
    }, 406: function (t, e, n) {
      var o = this && this.__importDefault || function (t) {
        return t && t.__esModule ? t : {default: t}
      };
      Object.defineProperty(e, "__esModule", {value: !0});
      const i = o(n(28)), r = {
        name: "SUB_BACK_CONN", callback(t) {
          let e = [];
          for (let n = 0; n < t.connections.length; n++) {
            let o = t.connections[n];
            o.from.connections.out.length > 1 && o.to.connections.in.length > 1 && t.nodes.indexOf(o.from) > t.nodes.indexOf(o.to) && e.push(o)
          }
          if (0 === e.length) return void (i.default.warnings && console.warn("No connections to remove!"));
          let n = e[Math.floor(Math.random() * e.length)];
          t.disconnect(n.from, n.to)
        }
      };
      e.default = r
    }, 166: function (t, e, n) {
      var o = this && this.__importDefault || function (t) {
        return t && t.__esModule ? t : {default: t}
      };
      Object.defineProperty(e, "__esModule", {value: !0});
      const i = o(n(28)), r = {
        name: "SUB_CONN", callback(t) {
          let e = [];
          for (let n = 0; n < t.connections.length; n++) {
            let o = t.connections[n];
            o.from.connections.out.length > 1 && o.to.connections.in.length > 1 && t.nodes.indexOf(o.to) > t.nodes.indexOf(o.from) && e.push(o)
          }
          if (0 === e.length) return void (i.default.warnings && console.warn("No connections to remove!"));
          let n = e[Math.floor(Math.random() * e.length)];
          t.disconnect(n.from, n.to)
        }
      };
      e.default = r
    }, 571: function (t, e, n) {
      var o = this && this.__importDefault || function (t) {
        return t && t.__esModule ? t : {default: t}
      };
      Object.defineProperty(e, "__esModule", {value: !0});
      const i = o(n(28)), r = {
        name: "SUB_GATE", callback(t) {
          if (0 === t.gates.length) return void (i.default.warnings && console.warn("No more connections to ungate!"));
          let e = Math.floor(Math.random() * t.gates.length), n = t.gates[e];
          t.ungate(n)
        }
      };
      e.default = r
    }, 492: function (t, e, n) {
      var o = this && this.__importDefault || function (t) {
        return t && t.__esModule ? t : {default: t}
      };
      Object.defineProperty(e, "__esModule", {value: !0});
      const i = o(n(28)), r = {
        name: "SUB_NODE", callback(t) {
          if (t.nodes.length === t.input + t.output) return void (i.default.warnings && console.warn("No more nodes left to remove!"));
          let e = Math.floor(Math.random() * (t.nodes.length - t.output - t.input) + t.input);
          t.remove(t.nodes[e])
        }, keep_gates: !0
      };
      e.default = r
    }, 293: function (t, e, n) {
      var o = this && this.__importDefault || function (t) {
        return t && t.__esModule ? t : {default: t}
      };
      Object.defineProperty(e, "__esModule", {value: !0});
      const i = o(n(28)), r = {
        name: "SUB_SELF_CONN", callback(t) {
          if (0 === t.selfconns.length) return void (i.default.warnings && console.warn("No more self-connections to remove!"));
          const e = t.selfconns[Math.floor(Math.random() * t.selfconns.length)];
          t.disconnect(e.from, e.to)
        }
      };
      e.default = r
    }, 214: function (t, e, n) {
      var o = this && this.__importDefault || function (t) {
        return t && t.__esModule ? t : {default: t}
      };
      Object.defineProperty(e, "__esModule", {value: !0});
      const i = o(n(28)), r = {
        name: "SWAP_NODES", callback(t) {
          if (this.mutateOutput && t.nodes.length - t.input < 2 || !this.mutateOutput && t.nodes.length - t.input - t.output < 2) return void (i.default.warnings && console.warn("No nodes that allow swapping of bias and activation function"));
          let e = Math.floor(Math.random() * (t.nodes.length - (this.mutateOutput ? 0 : t.output) - t.input) + t.input),
            n = t.nodes[e];
          e = Math.floor(Math.random() * (t.nodes.length - (this.mutateOutput ? 0 : t.output) - t.input) + t.input);
          let o = t.nodes[e], r = n.bias, a = n.squash;
          n.bias = o.bias, n.squash = o.squash, o.bias = r, o.squash = a
        }, mutateOutput: !0
      };
      e.default = r
    }, 171: (t, e) => {
      Object.defineProperty(e, "__esModule", {value: !0});
      const n = {
        FIXED: () => function (t) {
          return t
        },
        STEP: (t = .9, e = 100) => (n, o) => n * Math.pow(t, Math.floor(o / e)),
        EXP: (t = .999) => (e, n) => e * Math.pow(t, n),
        INV: (t = .001, e = 2) => function (n, o) {
          return n * Math.pow(1 + t * o, -e)
        }
      };
      e.default = n
    }, 959: (t, e) => {
      Object.defineProperty(e, "__esModule", {value: !0}), e.default = {
        FITNESS_PROPORTIONATE: {name: "FITNESS_PROPORTIONATE"},
        POWER: {name: "POWER", power: 4},
        TOURNAMENT: {name: "TOURNAMENT", size: 5, probability: .5}
      }
    }, 224: function (t, e, n) {
      var o = this && this.__importDefault || function (t) {
        return t && t.__esModule ? t : {default: t}
      };
      Object.defineProperty(e, "__esModule", {value: !0}), e.activations = e.workers = void 0, e.serializeDataSet = function (t) {
        for (var e = [t[0].input.length, t[0].output.length], n = 0; n < t.length; n++) {
          var o;
          for (o = 0; o < e[0]; o++) e.push(t[n].input[o]);
          for (o = 0; o < e[1]; o++) e.push(t[n].output[o])
        }
        return e
      }, e.activateSerializedNetwork = r, e.deserializeDataSet = function (t) {
        for (var e = [], n = t[0] + t[1], o = 0; o < (t.length - 2) / n; o++) {
          let r = [];
          for (var i = 2 + o * n; i < 2 + o * n + t[0]; i++) r.push(t[i]);
          let a = [];
          for (i = 2 + o * n + t[0]; i < 2 + o * n + n; i++) a.push(t[i]);
          e.push(r), e.push(a)
        }
        return e
      }, e.testSerializedSet = function (t, e, n, o, i, a) {
        for (var s = 0, l = 0; l < t.length; l += 2) {
          let u = r(t[l], n, o, i, a);
          s += e(t[l + 1], u)
        }
        return s / (t.length / 2)
      };
      const i = o(n(801));

      function r(t, e, n, o, i) {
        for (var r = 0; r < o[0]; r++) e[r] = t[r];
        for (r = 2; r < o.length; r++) {
          let t = o[r++], a = o[r++], s = o[r++], l = o[r++], u = o[r++];
          for (n[t] = (-1 === u ? 1 : e[u]) * l * n[t] + a; -2 !== o[r];) n[t] += e[o[r++]] * o[r++] * (-1 === o[r++] ? 1 : e[o[r - 1]]);
          e[t] = i[s](n[t])
        }
        var a = [];
        for (r = e.length - o[1]; r < e.length; r++) a.push(e[r]);
        return a
      }

      e.workers = i.default, e.activations = [function (t) {
        return 1 / (1 + Math.exp(-t))
      }, function (t) {
        return Math.tanh(t)
      }, function (t) {
        return t
      }, function (t) {
        return t > 0 ? 1 : 0
      }, function (t) {
        return t > 0 ? t : 0
      }, function (t) {
        return t / (1 + Math.abs(t))
      }, function (t) {
        return Math.sin(t)
      }, function (t) {
        return Math.exp(-Math.pow(t, 2))
      }, function (t) {
        return (Math.sqrt(Math.pow(t, 2) + 1) - 1) / 2 + t
      }, function (t) {
        return t > 0 ? 1 : -1
      }, function (t) {
        return 2 / (1 + Math.exp(-t)) - 1
      }, function (t) {
        return Math.max(-1, Math.min(1, t))
      }, function (t) {
        return Math.abs(t)
      }, function (t) {
        return 1 - t
      }, function (t) {
        var e = 1.6732632423543772;
        return 1.0507009873554805 * (t > 0 ? t : e * Math.exp(t) - e)
      }]
    }, 319: function (t, e, n) {
      var o, i = this && this.__createBinding || (Object.create ? function (t, e, n, o) {
        void 0 === o && (o = n);
        var i = Object.getOwnPropertyDescriptor(e, n);
        i && !("get" in i ? !e.__esModule : i.writable || i.configurable) || (i = {
          enumerable: !0, get: function () {
            return e[n]
          }
        }), Object.defineProperty(t, o, i)
      } : function (t, e, n, o) {
        void 0 === o && (o = n), t[o] = e[n]
      }), r = this && this.__setModuleDefault || (Object.create ? function (t, e) {
        Object.defineProperty(t, "default", {enumerable: !0, value: e})
      } : function (t, e) {
        t.default = e
      }), a = this && this.__importStar || (o = function (t) {
        return o = Object.getOwnPropertyNames || function (t) {
          var e = [];
          for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[e.length] = n);
          return e
        }, o(t)
      }, function (t) {
        if (t && t.__esModule) return t;
        var e = {};
        if (null != t) for (var n = o(t), a = 0; a < n.length; a++) "default" !== n[a] && i(e, t, n[a]);
        return r(e, t), e
      });
      Object.defineProperty(e, "__esModule", {value: !0});
      const s = a(n(224));
      e.default = class {
        constructor(t, e) {
          var n = new Blob([this._createBlobString(e)]);
          this.url = window.URL.createObjectURL(n), this.worker = new Worker(this.url);
          var o = {set: new Float64Array(t).buffer};
          this.worker.postMessage(o, [o.set])
        }

        evaluate(t) {
          return new Promise((e => {
            var n = t.serialize(), o = {
              activations: new Float64Array(n[0]).buffer,
              states: new Float64Array(n[1]).buffer,
              conns: new Float64Array(n[2]).buffer
            };
            this.worker.onmessage = function (t) {
              var n = new Float64Array(t.data.buffer)[0];
              e(n)
            }, this.worker.postMessage(o, [o.activations, o.states, o.conns])
          }))
        }

        terminate() {
          this.worker.terminate(), window.URL.revokeObjectURL(this.url)
        }

        _createBlobString(t) {
          return `\n      var F = [${s.activations.toString()}];\n      var cost = ${t.toString()};\n      var multi = {\n        deserializeDataSet: ${s.deserializeDataSet.toString()},\n        testSerializedSet: ${s.testSerializedSet.toString()},\n        activateSerializedNetwork: ${s.activateSerializedNetwork.toString()}\n      };\n\n      this.onmessage = function (e) {\n        if(typeof e.data.set === 'undefined'){\n          var A = new Float64Array(e.data.activations);\n          var S = new Float64Array(e.data.states);\n          var data = new Float64Array(e.data.conns);\n\n          var error = multi.testSerializedSet(set, cost, A, S, data, F);\n\n          var answer = { buffer: new Float64Array([error ]).buffer };\n          postMessage(answer, [answer.buffer]);\n        } else {\n          set = multi.deserializeDataSet(new Float64Array(e.data.set));\n        }\n      };`
        }
      }
    }, 445: function (t, e, n) {
      var o = this && this.__importDefault || function (t) {
        return t && t.__esModule ? t : {default: t}
      };
      Object.defineProperty(e, "__esModule", {value: !0});
      const i = o(n(660)), r = o(n(975));
      e.default = class {
        constructor(t, e) {
          this.worker = i.default.fork(r.default.join(__dirname, "/worker")), this.worker.send({set: t, cost: e.name})
        }

        evaluate(t) {
          return new Promise((e => {
            var n = t.serialize(), o = {activations: n[0], states: n[1], conns: n[2]}, i = this.worker;
            this.worker.on("message", (function t(n) {
              i.removeListener("message", t), e(n)
            })), this.worker.send(o)
          }))
        }

        terminate() {
          this.worker.kill()
        }
      }
    }, 725: function (t, e, n) {
      var o, i = this && this.__createBinding || (Object.create ? function (t, e, n, o) {
        void 0 === o && (o = n);
        var i = Object.getOwnPropertyDescriptor(e, n);
        i && !("get" in i ? !e.__esModule : i.writable || i.configurable) || (i = {
          enumerable: !0, get: function () {
            return e[n]
          }
        }), Object.defineProperty(t, o, i)
      } : function (t, e, n, o) {
        void 0 === o && (o = n), t[o] = e[n]
      }), r = this && this.__setModuleDefault || (Object.create ? function (t, e) {
        Object.defineProperty(t, "default", {enumerable: !0, value: e})
      } : function (t, e) {
        t.default = e
      }), a = this && this.__importStar || (o = function (t) {
        return o = Object.getOwnPropertyNames || function (t) {
          var e = [];
          for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[e.length] = n);
          return e
        }, o(t)
      }, function (t) {
        if (t && t.__esModule) return t;
        var e = {};
        if (null != t) for (var n = o(t), a = 0; a < n.length; a++) "default" !== n[a] && i(e, t, n[a]);
        return r(e, t), e
      }), s = this && this.__importDefault || function (t) {
        return t && t.__esModule ? t : {default: t}
      };
      Object.defineProperty(e, "__esModule", {value: !0});
      const l = s(n(799)), u = a(n(224));
      var c, h = [], f = u.activations;
      process.on("message", (t => {
        if (void 0 === t.set) {
          var e = t.activations, n = t.states, o = t.conns, i = u.testSerializedSet(h, c, e, n, o, f);
          process.send(i)
        } else c = l.default.cost[t.cost], h = u.deserializeDataSet(t.set)
      }))
    }, 801: function (t, e, n) {
      var o = this && this.__importDefault || function (t) {
        return t && t.__esModule ? t : {default: t}
      };
      Object.defineProperty(e, "__esModule", {value: !0});
      const i = o(n(445)), r = o(n(319));
      var a = {node: {TestWorker: i.default}, browser: {TestWorker: r.default}};
      e.default = a
    }, 483: (t, e) => {
      var n;
      Object.defineProperty(e, "__esModule", {value: !0}), e.NodeTypeEnum = void 0, function (t) {
        t.input = "input", t.hidden = "hidden", t.output = "output", t.constant = "constant"
      }(n || (e.NodeTypeEnum = n = {}))
    }, 660: e => {
      e.exports = t
    }
  }, n = {};
  return function t(o) {
    var i = n[o];
    if (void 0 !== i) return i.exports;
    var r = n[o] = {exports: {}};
    return e[o].call(r.exports, r, r.exports, t), r.exports
  }(725)
})()));
