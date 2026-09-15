(function() {
	//#region \0rolldown/runtime.js
	var __create = Object.create;
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __getProtoOf = Object.getPrototypeOf;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __esmMin = (fn, res, err) => () => {
		if (err) throw err[0];
		try {
			return fn && (res = fn(fn = 0)), res;
		} catch (e) {
			throw err = [e], e;
		}
	};
	var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
	var __exportAll = (all, no_symbols) => {
		let target = {};
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
		if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
		return target;
	};
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: ((k) => from[k]).bind(null, key),
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
		value: mod,
		enumerable: true
	}) : target, mod));
	var __toCommonJS = (mod) => __hasOwnProp.call(mod, "module.exports") ? mod["module.exports"] : __copyProps(__defProp({}, "__esModule", { value: true }), mod);
	//#endregion
	//#region node_modules/.pnpm/base64-js@1.5.1/node_modules/base64-js/index.js
	var require_base64_js = /* @__PURE__ */ __commonJSMin(((exports) => {
		exports.byteLength = byteLength;
		exports.toByteArray = toByteArray;
		exports.fromByteArray = fromByteArray;
		var lookup = [];
		var revLookup = [];
		var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
		var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		for (var i = 0, len = code.length; i < len; ++i) {
			lookup[i] = code[i];
			revLookup[code.charCodeAt(i)] = i;
		}
		revLookup["-".charCodeAt(0)] = 62;
		revLookup["_".charCodeAt(0)] = 63;
		function getLens(b64) {
			var len = b64.length;
			if (len % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
			var validLen = b64.indexOf("=");
			if (validLen === -1) validLen = len;
			var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
			return [validLen, placeHoldersLen];
		}
		function byteLength(b64) {
			var lens = getLens(b64);
			var validLen = lens[0];
			var placeHoldersLen = lens[1];
			return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
		}
		function _byteLength(b64, validLen, placeHoldersLen) {
			return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
		}
		function toByteArray(b64) {
			var tmp;
			var lens = getLens(b64);
			var validLen = lens[0];
			var placeHoldersLen = lens[1];
			var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
			var curByte = 0;
			var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
			var i = 0;
			for (; i < len; i += 4) {
				tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
				arr[curByte++] = tmp >> 16 & 255;
				arr[curByte++] = tmp >> 8 & 255;
				arr[curByte++] = tmp & 255;
			}
			if (placeHoldersLen === 2) {
				tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
				arr[curByte++] = tmp & 255;
			}
			if (placeHoldersLen === 1) {
				tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
				arr[curByte++] = tmp >> 8 & 255;
				arr[curByte++] = tmp & 255;
			}
			return arr;
		}
		function tripletToBase64(num) {
			return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
		}
		function encodeChunk(uint8, start, end) {
			var tmp;
			var output = [];
			for (var i = start; i < end; i += 3) {
				tmp = (uint8[i] << 16 & 16711680) + (uint8[i + 1] << 8 & 65280) + (uint8[i + 2] & 255);
				output.push(tripletToBase64(tmp));
			}
			return output.join("");
		}
		function fromByteArray(uint8) {
			var tmp;
			var len = uint8.length;
			var extraBytes = len % 3;
			var parts = [];
			var maxChunkLength = 16383;
			for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
			if (extraBytes === 1) {
				tmp = uint8[len - 1];
				parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "==");
			} else if (extraBytes === 2) {
				tmp = (uint8[len - 2] << 8) + uint8[len - 1];
				parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "=");
			}
			return parts.join("");
		}
	}));
	//#endregion
	//#region node_modules/.pnpm/ieee754@1.2.1/node_modules/ieee754/index.js
	var require_ieee754 = /* @__PURE__ */ __commonJSMin(((exports) => {
		/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
		exports.read = function(buffer, offset, isLE, mLen, nBytes) {
			var e, m;
			var eLen = nBytes * 8 - mLen - 1;
			var eMax = (1 << eLen) - 1;
			var eBias = eMax >> 1;
			var nBits = -7;
			var i = isLE ? nBytes - 1 : 0;
			var d = isLE ? -1 : 1;
			var s = buffer[offset + i];
			i += d;
			e = s & (1 << -nBits) - 1;
			s >>= -nBits;
			nBits += eLen;
			for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);
			m = e & (1 << -nBits) - 1;
			e >>= -nBits;
			nBits += mLen;
			for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);
			if (e === 0) e = 1 - eBias;
			else if (e === eMax) return m ? NaN : (s ? -1 : 1) * Infinity;
			else {
				m = m + Math.pow(2, mLen);
				e = e - eBias;
			}
			return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
		};
		exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
			var e, m, c;
			var eLen = nBytes * 8 - mLen - 1;
			var eMax = (1 << eLen) - 1;
			var eBias = eMax >> 1;
			var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
			var i = isLE ? 0 : nBytes - 1;
			var d = isLE ? 1 : -1;
			var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
			value = Math.abs(value);
			if (isNaN(value) || value === Infinity) {
				m = isNaN(value) ? 1 : 0;
				e = eMax;
			} else {
				e = Math.floor(Math.log(value) / Math.LN2);
				if (value * (c = Math.pow(2, -e)) < 1) {
					e--;
					c *= 2;
				}
				if (e + eBias >= 1) value += rt / c;
				else value += rt * Math.pow(2, 1 - eBias);
				if (value * c >= 2) {
					e++;
					c /= 2;
				}
				if (e + eBias >= eMax) {
					m = 0;
					e = eMax;
				} else if (e + eBias >= 1) {
					m = (value * c - 1) * Math.pow(2, mLen);
					e = e + eBias;
				} else {
					m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
					e = 0;
				}
			}
			for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8);
			e = e << mLen | m;
			eLen += mLen;
			for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8);
			buffer[offset + i - d] |= s * 128;
		};
	}));
	//#endregion
	//#region node_modules/.pnpm/buffer@6.0.3/node_modules/buffer/index.js
	/*!
	* The buffer module from node.js, for the browser.
	*
	* @author   Feross Aboukhadijeh <https://feross.org>
	* @license  MIT
	*/
	var require_buffer = /* @__PURE__ */ __commonJSMin(((exports) => {
		var base64 = require_base64_js();
		var ieee754 = require_ieee754();
		var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
		exports.Buffer = Buffer;
		exports.SlowBuffer = SlowBuffer;
		exports.INSPECT_MAX_BYTES = 50;
		var K_MAX_LENGTH = 2147483647;
		exports.kMaxLength = K_MAX_LENGTH;
		/**
		* If `Buffer.TYPED_ARRAY_SUPPORT`:
		*   === true    Use Uint8Array implementation (fastest)
		*   === false   Print warning and recommend using `buffer` v4.x which has an Object
		*               implementation (most compatible, even IE6)
		*
		* Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
		* Opera 11.6+, iOS 4.2+.
		*
		* We report that the browser does not support typed arrays if the are not subclassable
		* using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
		* (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
		* for __proto__ and has a buggy typed array implementation.
		*/
		Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();
		if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
		function typedArraySupport() {
			try {
				const arr = /* @__PURE__ */ new Uint8Array(1);
				const proto = { foo: function() {
					return 42;
				} };
				Object.setPrototypeOf(proto, Uint8Array.prototype);
				Object.setPrototypeOf(arr, proto);
				return arr.foo() === 42;
			} catch (e) {
				return false;
			}
		}
		Object.defineProperty(Buffer.prototype, "parent", {
			enumerable: true,
			get: function() {
				if (!Buffer.isBuffer(this)) return void 0;
				return this.buffer;
			}
		});
		Object.defineProperty(Buffer.prototype, "offset", {
			enumerable: true,
			get: function() {
				if (!Buffer.isBuffer(this)) return void 0;
				return this.byteOffset;
			}
		});
		function createBuffer(length) {
			if (length > K_MAX_LENGTH) throw new RangeError("The value \"" + length + "\" is invalid for option \"size\"");
			const buf = new Uint8Array(length);
			Object.setPrototypeOf(buf, Buffer.prototype);
			return buf;
		}
		/**
		* The Buffer constructor returns instances of `Uint8Array` that have their
		* prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
		* `Uint8Array`, so the returned instances will have all the node `Buffer` methods
		* and the `Uint8Array` methods. Square bracket notation works as expected -- it
		* returns a single octet.
		*
		* The `Uint8Array` prototype remains unmodified.
		*/
		function Buffer(arg, encodingOrOffset, length) {
			if (typeof arg === "number") {
				if (typeof encodingOrOffset === "string") throw new TypeError("The \"string\" argument must be of type string. Received type number");
				return allocUnsafe(arg);
			}
			return from(arg, encodingOrOffset, length);
		}
		Buffer.poolSize = 8192;
		function from(value, encodingOrOffset, length) {
			if (typeof value === "string") return fromString(value, encodingOrOffset);
			if (ArrayBuffer.isView(value)) return fromArrayView(value);
			if (value == null) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
			if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) return fromArrayBuffer(value, encodingOrOffset, length);
			if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) return fromArrayBuffer(value, encodingOrOffset, length);
			if (typeof value === "number") throw new TypeError("The \"value\" argument must not be of type number. Received type number");
			const valueOf = value.valueOf && value.valueOf();
			if (valueOf != null && valueOf !== value) return Buffer.from(valueOf, encodingOrOffset, length);
			const b = fromObject(value);
			if (b) return b;
			if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") return Buffer.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
			throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
		}
		/**
		* Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
		* if value is a number.
		* Buffer.from(str[, encoding])
		* Buffer.from(array)
		* Buffer.from(buffer)
		* Buffer.from(arrayBuffer[, byteOffset[, length]])
		**/
		Buffer.from = function(value, encodingOrOffset, length) {
			return from(value, encodingOrOffset, length);
		};
		Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
		Object.setPrototypeOf(Buffer, Uint8Array);
		function assertSize(size) {
			if (typeof size !== "number") throw new TypeError("\"size\" argument must be of type number");
			else if (size < 0) throw new RangeError("The value \"" + size + "\" is invalid for option \"size\"");
		}
		function alloc(size, fill, encoding) {
			assertSize(size);
			if (size <= 0) return createBuffer(size);
			if (fill !== void 0) return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
			return createBuffer(size);
		}
		/**
		* Creates a new filled Buffer instance.
		* alloc(size[, fill[, encoding]])
		**/
		Buffer.alloc = function(size, fill, encoding) {
			return alloc(size, fill, encoding);
		};
		function allocUnsafe(size) {
			assertSize(size);
			return createBuffer(size < 0 ? 0 : checked(size) | 0);
		}
		/**
		* Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
		* */
		Buffer.allocUnsafe = function(size) {
			return allocUnsafe(size);
		};
		/**
		* Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
		*/
		Buffer.allocUnsafeSlow = function(size) {
			return allocUnsafe(size);
		};
		function fromString(string, encoding) {
			if (typeof encoding !== "string" || encoding === "") encoding = "utf8";
			if (!Buffer.isEncoding(encoding)) throw new TypeError("Unknown encoding: " + encoding);
			const length = byteLength(string, encoding) | 0;
			let buf = createBuffer(length);
			const actual = buf.write(string, encoding);
			if (actual !== length) buf = buf.slice(0, actual);
			return buf;
		}
		function fromArrayLike(array) {
			const length = array.length < 0 ? 0 : checked(array.length) | 0;
			const buf = createBuffer(length);
			for (let i = 0; i < length; i += 1) buf[i] = array[i] & 255;
			return buf;
		}
		function fromArrayView(arrayView) {
			if (isInstance(arrayView, Uint8Array)) {
				const copy = new Uint8Array(arrayView);
				return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
			}
			return fromArrayLike(arrayView);
		}
		function fromArrayBuffer(array, byteOffset, length) {
			if (byteOffset < 0 || array.byteLength < byteOffset) throw new RangeError("\"offset\" is outside of buffer bounds");
			if (array.byteLength < byteOffset + (length || 0)) throw new RangeError("\"length\" is outside of buffer bounds");
			let buf;
			if (byteOffset === void 0 && length === void 0) buf = new Uint8Array(array);
			else if (length === void 0) buf = new Uint8Array(array, byteOffset);
			else buf = new Uint8Array(array, byteOffset, length);
			Object.setPrototypeOf(buf, Buffer.prototype);
			return buf;
		}
		function fromObject(obj) {
			if (Buffer.isBuffer(obj)) {
				const len = checked(obj.length) | 0;
				const buf = createBuffer(len);
				if (buf.length === 0) return buf;
				obj.copy(buf, 0, 0, len);
				return buf;
			}
			if (obj.length !== void 0) {
				if (typeof obj.length !== "number" || numberIsNaN(obj.length)) return createBuffer(0);
				return fromArrayLike(obj);
			}
			if (obj.type === "Buffer" && Array.isArray(obj.data)) return fromArrayLike(obj.data);
		}
		function checked(length) {
			if (length >= K_MAX_LENGTH) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
			return length | 0;
		}
		function SlowBuffer(length) {
			if (+length != length) length = 0;
			return Buffer.alloc(+length);
		}
		Buffer.isBuffer = function isBuffer(b) {
			return b != null && b._isBuffer === true && b !== Buffer.prototype;
		};
		Buffer.compare = function compare(a, b) {
			if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength);
			if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength);
			if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) throw new TypeError("The \"buf1\", \"buf2\" arguments must be one of type Buffer or Uint8Array");
			if (a === b) return 0;
			let x = a.length;
			let y = b.length;
			for (let i = 0, len = Math.min(x, y); i < len; ++i) if (a[i] !== b[i]) {
				x = a[i];
				y = b[i];
				break;
			}
			if (x < y) return -1;
			if (y < x) return 1;
			return 0;
		};
		Buffer.isEncoding = function isEncoding(encoding) {
			switch (String(encoding).toLowerCase()) {
				case "hex":
				case "utf8":
				case "utf-8":
				case "ascii":
				case "latin1":
				case "binary":
				case "base64":
				case "ucs2":
				case "ucs-2":
				case "utf16le":
				case "utf-16le": return true;
				default: return false;
			}
		};
		Buffer.concat = function concat(list, length) {
			if (!Array.isArray(list)) throw new TypeError("\"list\" argument must be an Array of Buffers");
			if (list.length === 0) return Buffer.alloc(0);
			let i;
			if (length === void 0) {
				length = 0;
				for (i = 0; i < list.length; ++i) length += list[i].length;
			}
			const buffer = Buffer.allocUnsafe(length);
			let pos = 0;
			for (i = 0; i < list.length; ++i) {
				let buf = list[i];
				if (isInstance(buf, Uint8Array)) {
					if (pos + buf.length > buffer.length) {
						if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf);
						buf.copy(buffer, pos);
					} else Uint8Array.prototype.set.call(buffer, buf, pos);
				} else if (!Buffer.isBuffer(buf)) throw new TypeError("\"list\" argument must be an Array of Buffers");
				else buf.copy(buffer, pos);
				pos += buf.length;
			}
			return buffer;
		};
		function byteLength(string, encoding) {
			if (Buffer.isBuffer(string)) return string.length;
			if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) return string.byteLength;
			if (typeof string !== "string") throw new TypeError("The \"string\" argument must be one of type string, Buffer, or ArrayBuffer. Received type " + typeof string);
			const len = string.length;
			const mustMatch = arguments.length > 2 && arguments[2] === true;
			if (!mustMatch && len === 0) return 0;
			let loweredCase = false;
			for (;;) switch (encoding) {
				case "ascii":
				case "latin1":
				case "binary": return len;
				case "utf8":
				case "utf-8": return utf8ToBytes(string).length;
				case "ucs2":
				case "ucs-2":
				case "utf16le":
				case "utf-16le": return len * 2;
				case "hex": return len >>> 1;
				case "base64": return base64ToBytes(string).length;
				default:
					if (loweredCase) return mustMatch ? -1 : utf8ToBytes(string).length;
					encoding = ("" + encoding).toLowerCase();
					loweredCase = true;
			}
		}
		Buffer.byteLength = byteLength;
		function slowToString(encoding, start, end) {
			let loweredCase = false;
			if (start === void 0 || start < 0) start = 0;
			if (start > this.length) return "";
			if (end === void 0 || end > this.length) end = this.length;
			if (end <= 0) return "";
			end >>>= 0;
			start >>>= 0;
			if (end <= start) return "";
			if (!encoding) encoding = "utf8";
			while (true) switch (encoding) {
				case "hex": return hexSlice(this, start, end);
				case "utf8":
				case "utf-8": return utf8Slice(this, start, end);
				case "ascii": return asciiSlice(this, start, end);
				case "latin1":
				case "binary": return latin1Slice(this, start, end);
				case "base64": return base64Slice(this, start, end);
				case "ucs2":
				case "ucs-2":
				case "utf16le":
				case "utf-16le": return utf16leSlice(this, start, end);
				default:
					if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
					encoding = (encoding + "").toLowerCase();
					loweredCase = true;
			}
		}
		Buffer.prototype._isBuffer = true;
		function swap(b, n, m) {
			const i = b[n];
			b[n] = b[m];
			b[m] = i;
		}
		Buffer.prototype.swap16 = function swap16() {
			const len = this.length;
			if (len % 2 !== 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
			for (let i = 0; i < len; i += 2) swap(this, i, i + 1);
			return this;
		};
		Buffer.prototype.swap32 = function swap32() {
			const len = this.length;
			if (len % 4 !== 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
			for (let i = 0; i < len; i += 4) {
				swap(this, i, i + 3);
				swap(this, i + 1, i + 2);
			}
			return this;
		};
		Buffer.prototype.swap64 = function swap64() {
			const len = this.length;
			if (len % 8 !== 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
			for (let i = 0; i < len; i += 8) {
				swap(this, i, i + 7);
				swap(this, i + 1, i + 6);
				swap(this, i + 2, i + 5);
				swap(this, i + 3, i + 4);
			}
			return this;
		};
		Buffer.prototype.toString = function toString() {
			const length = this.length;
			if (length === 0) return "";
			if (arguments.length === 0) return utf8Slice(this, 0, length);
			return slowToString.apply(this, arguments);
		};
		Buffer.prototype.toLocaleString = Buffer.prototype.toString;
		Buffer.prototype.equals = function equals(b) {
			if (!Buffer.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
			if (this === b) return true;
			return Buffer.compare(this, b) === 0;
		};
		Buffer.prototype.inspect = function inspect() {
			let str = "";
			const max = exports.INSPECT_MAX_BYTES;
			str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
			if (this.length > max) str += " ... ";
			return "<Buffer " + str + ">";
		};
		if (customInspectSymbol) Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect;
		Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
			if (isInstance(target, Uint8Array)) target = Buffer.from(target, target.offset, target.byteLength);
			if (!Buffer.isBuffer(target)) throw new TypeError("The \"target\" argument must be one of type Buffer or Uint8Array. Received type " + typeof target);
			if (start === void 0) start = 0;
			if (end === void 0) end = target ? target.length : 0;
			if (thisStart === void 0) thisStart = 0;
			if (thisEnd === void 0) thisEnd = this.length;
			if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) throw new RangeError("out of range index");
			if (thisStart >= thisEnd && start >= end) return 0;
			if (thisStart >= thisEnd) return -1;
			if (start >= end) return 1;
			start >>>= 0;
			end >>>= 0;
			thisStart >>>= 0;
			thisEnd >>>= 0;
			if (this === target) return 0;
			let x = thisEnd - thisStart;
			let y = end - start;
			const len = Math.min(x, y);
			const thisCopy = this.slice(thisStart, thisEnd);
			const targetCopy = target.slice(start, end);
			for (let i = 0; i < len; ++i) if (thisCopy[i] !== targetCopy[i]) {
				x = thisCopy[i];
				y = targetCopy[i];
				break;
			}
			if (x < y) return -1;
			if (y < x) return 1;
			return 0;
		};
		function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
			if (buffer.length === 0) return -1;
			if (typeof byteOffset === "string") {
				encoding = byteOffset;
				byteOffset = 0;
			} else if (byteOffset > 2147483647) byteOffset = 2147483647;
			else if (byteOffset < -2147483648) byteOffset = -2147483648;
			byteOffset = +byteOffset;
			if (numberIsNaN(byteOffset)) byteOffset = dir ? 0 : buffer.length - 1;
			if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
			if (byteOffset >= buffer.length) {
				if (dir) return -1;
				else byteOffset = buffer.length - 1;
			} else if (byteOffset < 0) {
				if (dir) byteOffset = 0;
				else return -1;
			}
			if (typeof val === "string") val = Buffer.from(val, encoding);
			if (Buffer.isBuffer(val)) {
				if (val.length === 0) return -1;
				return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
			} else if (typeof val === "number") {
				val = val & 255;
				if (typeof Uint8Array.prototype.indexOf === "function") {
					if (dir) return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
					else return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
				}
				return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
			}
			throw new TypeError("val must be string, number or Buffer");
		}
		function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
			let indexSize = 1;
			let arrLength = arr.length;
			let valLength = val.length;
			if (encoding !== void 0) {
				encoding = String(encoding).toLowerCase();
				if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
					if (arr.length < 2 || val.length < 2) return -1;
					indexSize = 2;
					arrLength /= 2;
					valLength /= 2;
					byteOffset /= 2;
				}
			}
			function read(buf, i) {
				if (indexSize === 1) return buf[i];
				else return buf.readUInt16BE(i * indexSize);
			}
			let i;
			if (dir) {
				let foundIndex = -1;
				for (i = byteOffset; i < arrLength; i++) if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
					if (foundIndex === -1) foundIndex = i;
					if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
				} else {
					if (foundIndex !== -1) i -= i - foundIndex;
					foundIndex = -1;
				}
			} else {
				if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
				for (i = byteOffset; i >= 0; i--) {
					let found = true;
					for (let j = 0; j < valLength; j++) if (read(arr, i + j) !== read(val, j)) {
						found = false;
						break;
					}
					if (found) return i;
				}
			}
			return -1;
		}
		Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
			return this.indexOf(val, byteOffset, encoding) !== -1;
		};
		Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
			return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
		};
		Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
			return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
		};
		function hexWrite(buf, string, offset, length) {
			offset = Number(offset) || 0;
			const remaining = buf.length - offset;
			if (!length) length = remaining;
			else {
				length = Number(length);
				if (length > remaining) length = remaining;
			}
			const strLen = string.length;
			if (length > strLen / 2) length = strLen / 2;
			let i = 0;
			for (; i < length; ++i) {
				const parsed = parseInt(string.substr(i * 2, 2), 16);
				if (numberIsNaN(parsed)) return i;
				buf[offset + i] = parsed;
			}
			return i;
		}
		function utf8Write(buf, string, offset, length) {
			return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
		}
		function asciiWrite(buf, string, offset, length) {
			return blitBuffer(asciiToBytes(string), buf, offset, length);
		}
		function base64Write(buf, string, offset, length) {
			return blitBuffer(base64ToBytes(string), buf, offset, length);
		}
		function ucs2Write(buf, string, offset, length) {
			return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
		}
		Buffer.prototype.write = function write(string, offset, length, encoding) {
			if (offset === void 0) {
				encoding = "utf8";
				length = this.length;
				offset = 0;
			} else if (length === void 0 && typeof offset === "string") {
				encoding = offset;
				length = this.length;
				offset = 0;
			} else if (isFinite(offset)) {
				offset = offset >>> 0;
				if (isFinite(length)) {
					length = length >>> 0;
					if (encoding === void 0) encoding = "utf8";
				} else {
					encoding = length;
					length = void 0;
				}
			} else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
			const remaining = this.length - offset;
			if (length === void 0 || length > remaining) length = remaining;
			if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) throw new RangeError("Attempt to write outside buffer bounds");
			if (!encoding) encoding = "utf8";
			let loweredCase = false;
			for (;;) switch (encoding) {
				case "hex": return hexWrite(this, string, offset, length);
				case "utf8":
				case "utf-8": return utf8Write(this, string, offset, length);
				case "ascii":
				case "latin1":
				case "binary": return asciiWrite(this, string, offset, length);
				case "base64": return base64Write(this, string, offset, length);
				case "ucs2":
				case "ucs-2":
				case "utf16le":
				case "utf-16le": return ucs2Write(this, string, offset, length);
				default:
					if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
					encoding = ("" + encoding).toLowerCase();
					loweredCase = true;
			}
		};
		Buffer.prototype.toJSON = function toJSON() {
			return {
				type: "Buffer",
				data: Array.prototype.slice.call(this._arr || this, 0)
			};
		};
		function base64Slice(buf, start, end) {
			if (start === 0 && end === buf.length) return base64.fromByteArray(buf);
			else return base64.fromByteArray(buf.slice(start, end));
		}
		function utf8Slice(buf, start, end) {
			end = Math.min(buf.length, end);
			const res = [];
			let i = start;
			while (i < end) {
				const firstByte = buf[i];
				let codePoint = null;
				let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
				if (i + bytesPerSequence <= end) {
					let secondByte, thirdByte, fourthByte, tempCodePoint;
					switch (bytesPerSequence) {
						case 1:
							if (firstByte < 128) codePoint = firstByte;
							break;
						case 2:
							secondByte = buf[i + 1];
							if ((secondByte & 192) === 128) {
								tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
								if (tempCodePoint > 127) codePoint = tempCodePoint;
							}
							break;
						case 3:
							secondByte = buf[i + 1];
							thirdByte = buf[i + 2];
							if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
								tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
								if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) codePoint = tempCodePoint;
							}
							break;
						case 4:
							secondByte = buf[i + 1];
							thirdByte = buf[i + 2];
							fourthByte = buf[i + 3];
							if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
								tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
								if (tempCodePoint > 65535 && tempCodePoint < 1114112) codePoint = tempCodePoint;
							}
					}
				}
				if (codePoint === null) {
					codePoint = 65533;
					bytesPerSequence = 1;
				} else if (codePoint > 65535) {
					codePoint -= 65536;
					res.push(codePoint >>> 10 & 1023 | 55296);
					codePoint = 56320 | codePoint & 1023;
				}
				res.push(codePoint);
				i += bytesPerSequence;
			}
			return decodeCodePointsArray(res);
		}
		var MAX_ARGUMENTS_LENGTH = 4096;
		function decodeCodePointsArray(codePoints) {
			const len = codePoints.length;
			if (len <= MAX_ARGUMENTS_LENGTH) return String.fromCharCode.apply(String, codePoints);
			let res = "";
			let i = 0;
			while (i < len) res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
			return res;
		}
		function asciiSlice(buf, start, end) {
			let ret = "";
			end = Math.min(buf.length, end);
			for (let i = start; i < end; ++i) ret += String.fromCharCode(buf[i] & 127);
			return ret;
		}
		function latin1Slice(buf, start, end) {
			let ret = "";
			end = Math.min(buf.length, end);
			for (let i = start; i < end; ++i) ret += String.fromCharCode(buf[i]);
			return ret;
		}
		function hexSlice(buf, start, end) {
			const len = buf.length;
			if (!start || start < 0) start = 0;
			if (!end || end < 0 || end > len) end = len;
			let out = "";
			for (let i = start; i < end; ++i) out += hexSliceLookupTable[buf[i]];
			return out;
		}
		function utf16leSlice(buf, start, end) {
			const bytes = buf.slice(start, end);
			let res = "";
			for (let i = 0; i < bytes.length - 1; i += 2) res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
			return res;
		}
		Buffer.prototype.slice = function slice(start, end) {
			const len = this.length;
			start = ~~start;
			end = end === void 0 ? len : ~~end;
			if (start < 0) {
				start += len;
				if (start < 0) start = 0;
			} else if (start > len) start = len;
			if (end < 0) {
				end += len;
				if (end < 0) end = 0;
			} else if (end > len) end = len;
			if (end < start) end = start;
			const newBuf = this.subarray(start, end);
			Object.setPrototypeOf(newBuf, Buffer.prototype);
			return newBuf;
		};
		function checkOffset(offset, ext, length) {
			if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
			if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
		}
		Buffer.prototype.readUintLE = Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
			offset = offset >>> 0;
			byteLength = byteLength >>> 0;
			if (!noAssert) checkOffset(offset, byteLength, this.length);
			let val = this[offset];
			let mul = 1;
			let i = 0;
			while (++i < byteLength && (mul *= 256)) val += this[offset + i] * mul;
			return val;
		};
		Buffer.prototype.readUintBE = Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
			offset = offset >>> 0;
			byteLength = byteLength >>> 0;
			if (!noAssert) checkOffset(offset, byteLength, this.length);
			let val = this[offset + --byteLength];
			let mul = 1;
			while (byteLength > 0 && (mul *= 256)) val += this[offset + --byteLength] * mul;
			return val;
		};
		Buffer.prototype.readUint8 = Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
			offset = offset >>> 0;
			if (!noAssert) checkOffset(offset, 1, this.length);
			return this[offset];
		};
		Buffer.prototype.readUint16LE = Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
			offset = offset >>> 0;
			if (!noAssert) checkOffset(offset, 2, this.length);
			return this[offset] | this[offset + 1] << 8;
		};
		Buffer.prototype.readUint16BE = Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
			offset = offset >>> 0;
			if (!noAssert) checkOffset(offset, 2, this.length);
			return this[offset] << 8 | this[offset + 1];
		};
		Buffer.prototype.readUint32LE = Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
			offset = offset >>> 0;
			if (!noAssert) checkOffset(offset, 4, this.length);
			return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
		};
		Buffer.prototype.readUint32BE = Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
			offset = offset >>> 0;
			if (!noAssert) checkOffset(offset, 4, this.length);
			return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
		};
		Buffer.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
			offset = offset >>> 0;
			validateNumber(offset, "offset");
			const first = this[offset];
			const last = this[offset + 7];
			if (first === void 0 || last === void 0) boundsError(offset, this.length - 8);
			const lo = first + this[++offset] * 256 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
			const hi = this[++offset] + this[++offset] * 256 + this[++offset] * 2 ** 16 + last * 2 ** 24;
			return BigInt(lo) + (BigInt(hi) << BigInt(32));
		});
		Buffer.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
			offset = offset >>> 0;
			validateNumber(offset, "offset");
			const first = this[offset];
			const last = this[offset + 7];
			if (first === void 0 || last === void 0) boundsError(offset, this.length - 8);
			const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 256 + this[++offset];
			const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 256 + last;
			return (BigInt(hi) << BigInt(32)) + BigInt(lo);
		});
		Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
			offset = offset >>> 0;
			byteLength = byteLength >>> 0;
			if (!noAssert) checkOffset(offset, byteLength, this.length);
			let val = this[offset];
			let mul = 1;
			let i = 0;
			while (++i < byteLength && (mul *= 256)) val += this[offset + i] * mul;
			mul *= 128;
			if (val >= mul) val -= Math.pow(2, 8 * byteLength);
			return val;
		};
		Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
			offset = offset >>> 0;
			byteLength = byteLength >>> 0;
			if (!noAssert) checkOffset(offset, byteLength, this.length);
			let i = byteLength;
			let mul = 1;
			let val = this[offset + --i];
			while (i > 0 && (mul *= 256)) val += this[offset + --i] * mul;
			mul *= 128;
			if (val >= mul) val -= Math.pow(2, 8 * byteLength);
			return val;
		};
		Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
			offset = offset >>> 0;
			if (!noAssert) checkOffset(offset, 1, this.length);
			if (!(this[offset] & 128)) return this[offset];
			return (255 - this[offset] + 1) * -1;
		};
		Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
			offset = offset >>> 0;
			if (!noAssert) checkOffset(offset, 2, this.length);
			const val = this[offset] | this[offset + 1] << 8;
			return val & 32768 ? val | 4294901760 : val;
		};
		Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
			offset = offset >>> 0;
			if (!noAssert) checkOffset(offset, 2, this.length);
			const val = this[offset + 1] | this[offset] << 8;
			return val & 32768 ? val | 4294901760 : val;
		};
		Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
			offset = offset >>> 0;
			if (!noAssert) checkOffset(offset, 4, this.length);
			return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
		};
		Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
			offset = offset >>> 0;
			if (!noAssert) checkOffset(offset, 4, this.length);
			return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
		};
		Buffer.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
			offset = offset >>> 0;
			validateNumber(offset, "offset");
			const first = this[offset];
			const last = this[offset + 7];
			if (first === void 0 || last === void 0) boundsError(offset, this.length - 8);
			const val = this[offset + 4] + this[offset + 5] * 256 + this[offset + 6] * 2 ** 16 + (last << 24);
			return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 256 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
		});
		Buffer.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
			offset = offset >>> 0;
			validateNumber(offset, "offset");
			const first = this[offset];
			const last = this[offset + 7];
			if (first === void 0 || last === void 0) boundsError(offset, this.length - 8);
			const val = (first << 24) + this[++offset] * 2 ** 16 + this[++offset] * 256 + this[++offset];
			return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 256 + last);
		});
		Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
			offset = offset >>> 0;
			if (!noAssert) checkOffset(offset, 4, this.length);
			return ieee754.read(this, offset, true, 23, 4);
		};
		Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
			offset = offset >>> 0;
			if (!noAssert) checkOffset(offset, 4, this.length);
			return ieee754.read(this, offset, false, 23, 4);
		};
		Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
			offset = offset >>> 0;
			if (!noAssert) checkOffset(offset, 8, this.length);
			return ieee754.read(this, offset, true, 52, 8);
		};
		Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
			offset = offset >>> 0;
			if (!noAssert) checkOffset(offset, 8, this.length);
			return ieee754.read(this, offset, false, 52, 8);
		};
		function checkInt(buf, value, offset, ext, max, min) {
			if (!Buffer.isBuffer(buf)) throw new TypeError("\"buffer\" argument must be a Buffer instance");
			if (value > max || value < min) throw new RangeError("\"value\" argument is out of bounds");
			if (offset + ext > buf.length) throw new RangeError("Index out of range");
		}
		Buffer.prototype.writeUintLE = Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
			value = +value;
			offset = offset >>> 0;
			byteLength = byteLength >>> 0;
			if (!noAssert) {
				const maxBytes = Math.pow(2, 8 * byteLength) - 1;
				checkInt(this, value, offset, byteLength, maxBytes, 0);
			}
			let mul = 1;
			let i = 0;
			this[offset] = value & 255;
			while (++i < byteLength && (mul *= 256)) this[offset + i] = value / mul & 255;
			return offset + byteLength;
		};
		Buffer.prototype.writeUintBE = Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
			value = +value;
			offset = offset >>> 0;
			byteLength = byteLength >>> 0;
			if (!noAssert) {
				const maxBytes = Math.pow(2, 8 * byteLength) - 1;
				checkInt(this, value, offset, byteLength, maxBytes, 0);
			}
			let i = byteLength - 1;
			let mul = 1;
			this[offset + i] = value & 255;
			while (--i >= 0 && (mul *= 256)) this[offset + i] = value / mul & 255;
			return offset + byteLength;
		};
		Buffer.prototype.writeUint8 = Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
			value = +value;
			offset = offset >>> 0;
			if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
			this[offset] = value & 255;
			return offset + 1;
		};
		Buffer.prototype.writeUint16LE = Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
			value = +value;
			offset = offset >>> 0;
			if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
			this[offset] = value & 255;
			this[offset + 1] = value >>> 8;
			return offset + 2;
		};
		Buffer.prototype.writeUint16BE = Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
			value = +value;
			offset = offset >>> 0;
			if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
			this[offset] = value >>> 8;
			this[offset + 1] = value & 255;
			return offset + 2;
		};
		Buffer.prototype.writeUint32LE = Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
			value = +value;
			offset = offset >>> 0;
			if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
			this[offset + 3] = value >>> 24;
			this[offset + 2] = value >>> 16;
			this[offset + 1] = value >>> 8;
			this[offset] = value & 255;
			return offset + 4;
		};
		Buffer.prototype.writeUint32BE = Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
			value = +value;
			offset = offset >>> 0;
			if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
			this[offset] = value >>> 24;
			this[offset + 1] = value >>> 16;
			this[offset + 2] = value >>> 8;
			this[offset + 3] = value & 255;
			return offset + 4;
		};
		function wrtBigUInt64LE(buf, value, offset, min, max) {
			checkIntBI(value, min, max, buf, offset, 7);
			let lo = Number(value & BigInt(4294967295));
			buf[offset++] = lo;
			lo = lo >> 8;
			buf[offset++] = lo;
			lo = lo >> 8;
			buf[offset++] = lo;
			lo = lo >> 8;
			buf[offset++] = lo;
			let hi = Number(value >> BigInt(32) & BigInt(4294967295));
			buf[offset++] = hi;
			hi = hi >> 8;
			buf[offset++] = hi;
			hi = hi >> 8;
			buf[offset++] = hi;
			hi = hi >> 8;
			buf[offset++] = hi;
			return offset;
		}
		function wrtBigUInt64BE(buf, value, offset, min, max) {
			checkIntBI(value, min, max, buf, offset, 7);
			let lo = Number(value & BigInt(4294967295));
			buf[offset + 7] = lo;
			lo = lo >> 8;
			buf[offset + 6] = lo;
			lo = lo >> 8;
			buf[offset + 5] = lo;
			lo = lo >> 8;
			buf[offset + 4] = lo;
			let hi = Number(value >> BigInt(32) & BigInt(4294967295));
			buf[offset + 3] = hi;
			hi = hi >> 8;
			buf[offset + 2] = hi;
			hi = hi >> 8;
			buf[offset + 1] = hi;
			hi = hi >> 8;
			buf[offset] = hi;
			return offset + 8;
		}
		Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
			return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
		});
		Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
			return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
		});
		Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
			value = +value;
			offset = offset >>> 0;
			if (!noAssert) {
				const limit = Math.pow(2, 8 * byteLength - 1);
				checkInt(this, value, offset, byteLength, limit - 1, -limit);
			}
			let i = 0;
			let mul = 1;
			let sub = 0;
			this[offset] = value & 255;
			while (++i < byteLength && (mul *= 256)) {
				if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) sub = 1;
				this[offset + i] = (value / mul >> 0) - sub & 255;
			}
			return offset + byteLength;
		};
		Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
			value = +value;
			offset = offset >>> 0;
			if (!noAssert) {
				const limit = Math.pow(2, 8 * byteLength - 1);
				checkInt(this, value, offset, byteLength, limit - 1, -limit);
			}
			let i = byteLength - 1;
			let mul = 1;
			let sub = 0;
			this[offset + i] = value & 255;
			while (--i >= 0 && (mul *= 256)) {
				if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) sub = 1;
				this[offset + i] = (value / mul >> 0) - sub & 255;
			}
			return offset + byteLength;
		};
		Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
			value = +value;
			offset = offset >>> 0;
			if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
			if (value < 0) value = 255 + value + 1;
			this[offset] = value & 255;
			return offset + 1;
		};
		Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
			value = +value;
			offset = offset >>> 0;
			if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
			this[offset] = value & 255;
			this[offset + 1] = value >>> 8;
			return offset + 2;
		};
		Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
			value = +value;
			offset = offset >>> 0;
			if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
			this[offset] = value >>> 8;
			this[offset + 1] = value & 255;
			return offset + 2;
		};
		Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
			value = +value;
			offset = offset >>> 0;
			if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
			this[offset] = value & 255;
			this[offset + 1] = value >>> 8;
			this[offset + 2] = value >>> 16;
			this[offset + 3] = value >>> 24;
			return offset + 4;
		};
		Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
			value = +value;
			offset = offset >>> 0;
			if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
			if (value < 0) value = 4294967295 + value + 1;
			this[offset] = value >>> 24;
			this[offset + 1] = value >>> 16;
			this[offset + 2] = value >>> 8;
			this[offset + 3] = value & 255;
			return offset + 4;
		};
		Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
			return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
		});
		Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
			return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
		});
		function checkIEEE754(buf, value, offset, ext, max, min) {
			if (offset + ext > buf.length) throw new RangeError("Index out of range");
			if (offset < 0) throw new RangeError("Index out of range");
		}
		function writeFloat(buf, value, offset, littleEndian, noAssert) {
			value = +value;
			offset = offset >>> 0;
			if (!noAssert) checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
			ieee754.write(buf, value, offset, littleEndian, 23, 4);
			return offset + 4;
		}
		Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
			return writeFloat(this, value, offset, true, noAssert);
		};
		Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
			return writeFloat(this, value, offset, false, noAssert);
		};
		function writeDouble(buf, value, offset, littleEndian, noAssert) {
			value = +value;
			offset = offset >>> 0;
			if (!noAssert) checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
			ieee754.write(buf, value, offset, littleEndian, 52, 8);
			return offset + 8;
		}
		Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
			return writeDouble(this, value, offset, true, noAssert);
		};
		Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
			return writeDouble(this, value, offset, false, noAssert);
		};
		Buffer.prototype.copy = function copy(target, targetStart, start, end) {
			if (!Buffer.isBuffer(target)) throw new TypeError("argument should be a Buffer");
			if (!start) start = 0;
			if (!end && end !== 0) end = this.length;
			if (targetStart >= target.length) targetStart = target.length;
			if (!targetStart) targetStart = 0;
			if (end > 0 && end < start) end = start;
			if (end === start) return 0;
			if (target.length === 0 || this.length === 0) return 0;
			if (targetStart < 0) throw new RangeError("targetStart out of bounds");
			if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
			if (end < 0) throw new RangeError("sourceEnd out of bounds");
			if (end > this.length) end = this.length;
			if (target.length - targetStart < end - start) end = target.length - targetStart + start;
			const len = end - start;
			if (this === target && typeof Uint8Array.prototype.copyWithin === "function") this.copyWithin(targetStart, start, end);
			else Uint8Array.prototype.set.call(target, this.subarray(start, end), targetStart);
			return len;
		};
		Buffer.prototype.fill = function fill(val, start, end, encoding) {
			if (typeof val === "string") {
				if (typeof start === "string") {
					encoding = start;
					start = 0;
					end = this.length;
				} else if (typeof end === "string") {
					encoding = end;
					end = this.length;
				}
				if (encoding !== void 0 && typeof encoding !== "string") throw new TypeError("encoding must be a string");
				if (typeof encoding === "string" && !Buffer.isEncoding(encoding)) throw new TypeError("Unknown encoding: " + encoding);
				if (val.length === 1) {
					const code = val.charCodeAt(0);
					if (encoding === "utf8" && code < 128 || encoding === "latin1") val = code;
				}
			} else if (typeof val === "number") val = val & 255;
			else if (typeof val === "boolean") val = Number(val);
			if (start < 0 || this.length < start || this.length < end) throw new RangeError("Out of range index");
			if (end <= start) return this;
			start = start >>> 0;
			end = end === void 0 ? this.length : end >>> 0;
			if (!val) val = 0;
			let i;
			if (typeof val === "number") for (i = start; i < end; ++i) this[i] = val;
			else {
				const bytes = Buffer.isBuffer(val) ? val : Buffer.from(val, encoding);
				const len = bytes.length;
				if (len === 0) throw new TypeError("The value \"" + val + "\" is invalid for argument \"value\"");
				for (i = 0; i < end - start; ++i) this[i + start] = bytes[i % len];
			}
			return this;
		};
		var errors = {};
		function E(sym, getMessage, Base) {
			errors[sym] = class NodeError extends Base {
				constructor() {
					super();
					Object.defineProperty(this, "message", {
						value: getMessage.apply(this, arguments),
						writable: true,
						configurable: true
					});
					this.name = `${this.name} [${sym}]`;
					this.stack;
					delete this.name;
				}
				get code() {
					return sym;
				}
				set code(value) {
					Object.defineProperty(this, "code", {
						configurable: true,
						enumerable: true,
						value,
						writable: true
					});
				}
				toString() {
					return `${this.name} [${sym}]: ${this.message}`;
				}
			};
		}
		E("ERR_BUFFER_OUT_OF_BOUNDS", function(name) {
			if (name) return `${name} is outside of buffer bounds`;
			return "Attempt to access memory outside buffer bounds";
		}, RangeError);
		E("ERR_INVALID_ARG_TYPE", function(name, actual) {
			return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
		}, TypeError);
		E("ERR_OUT_OF_RANGE", function(str, range, input) {
			let msg = `The value of "${str}" is out of range.`;
			let received = input;
			if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) received = addNumericalSeparator(String(input));
			else if (typeof input === "bigint") {
				received = String(input);
				if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) received = addNumericalSeparator(received);
				received += "n";
			}
			msg += ` It must be ${range}. Received ${received}`;
			return msg;
		}, RangeError);
		function addNumericalSeparator(val) {
			let res = "";
			let i = val.length;
			const start = val[0] === "-" ? 1 : 0;
			for (; i >= start + 4; i -= 3) res = `_${val.slice(i - 3, i)}${res}`;
			return `${val.slice(0, i)}${res}`;
		}
		function checkBounds(buf, offset, byteLength) {
			validateNumber(offset, "offset");
			if (buf[offset] === void 0 || buf[offset + byteLength] === void 0) boundsError(offset, buf.length - (byteLength + 1));
		}
		function checkIntBI(value, min, max, buf, offset, byteLength) {
			if (value > max || value < min) {
				const n = typeof min === "bigint" ? "n" : "";
				let range;
				if (byteLength > 3) {
					if (min === 0 || min === BigInt(0)) range = `>= 0${n} and < 2${n} ** ${(byteLength + 1) * 8}${n}`;
					else range = `>= -(2${n} ** ${(byteLength + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength + 1) * 8 - 1}${n}`;
				} else range = `>= ${min}${n} and <= ${max}${n}`;
				throw new errors.ERR_OUT_OF_RANGE("value", range, value);
			}
			checkBounds(buf, offset, byteLength);
		}
		function validateNumber(value, name) {
			if (typeof value !== "number") throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
		}
		function boundsError(value, length, type) {
			if (Math.floor(value) !== value) {
				validateNumber(value, type);
				throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
			}
			if (length < 0) throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
			throw new errors.ERR_OUT_OF_RANGE(type || "offset", `>= ${type ? 1 : 0} and <= ${length}`, value);
		}
		var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
		function base64clean(str) {
			str = str.split("=")[0];
			str = str.trim().replace(INVALID_BASE64_RE, "");
			if (str.length < 2) return "";
			while (str.length % 4 !== 0) str = str + "=";
			return str;
		}
		function utf8ToBytes(string, units) {
			units = units || Infinity;
			let codePoint;
			const length = string.length;
			let leadSurrogate = null;
			const bytes = [];
			for (let i = 0; i < length; ++i) {
				codePoint = string.charCodeAt(i);
				if (codePoint > 55295 && codePoint < 57344) {
					if (!leadSurrogate) {
						if (codePoint > 56319) {
							if ((units -= 3) > -1) bytes.push(239, 191, 189);
							continue;
						} else if (i + 1 === length) {
							if ((units -= 3) > -1) bytes.push(239, 191, 189);
							continue;
						}
						leadSurrogate = codePoint;
						continue;
					}
					if (codePoint < 56320) {
						if ((units -= 3) > -1) bytes.push(239, 191, 189);
						leadSurrogate = codePoint;
						continue;
					}
					codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
				} else if (leadSurrogate) {
					if ((units -= 3) > -1) bytes.push(239, 191, 189);
				}
				leadSurrogate = null;
				if (codePoint < 128) {
					if ((units -= 1) < 0) break;
					bytes.push(codePoint);
				} else if (codePoint < 2048) {
					if ((units -= 2) < 0) break;
					bytes.push(codePoint >> 6 | 192, codePoint & 63 | 128);
				} else if (codePoint < 65536) {
					if ((units -= 3) < 0) break;
					bytes.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
				} else if (codePoint < 1114112) {
					if ((units -= 4) < 0) break;
					bytes.push(codePoint >> 18 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
				} else throw new Error("Invalid code point");
			}
			return bytes;
		}
		function asciiToBytes(str) {
			const byteArray = [];
			for (let i = 0; i < str.length; ++i) byteArray.push(str.charCodeAt(i) & 255);
			return byteArray;
		}
		function utf16leToBytes(str, units) {
			let c, hi, lo;
			const byteArray = [];
			for (let i = 0; i < str.length; ++i) {
				if ((units -= 2) < 0) break;
				c = str.charCodeAt(i);
				hi = c >> 8;
				lo = c % 256;
				byteArray.push(lo);
				byteArray.push(hi);
			}
			return byteArray;
		}
		function base64ToBytes(str) {
			return base64.toByteArray(base64clean(str));
		}
		function blitBuffer(src, dst, offset, length) {
			let i = 0;
			for (; i < length; ++i) {
				if (i + offset >= dst.length || i >= src.length) break;
				dst[i + offset] = src[i];
			}
			return i;
		}
		function isInstance(obj, type) {
			return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
		}
		function numberIsNaN(obj) {
			return obj !== obj;
		}
		var hexSliceLookupTable = (function() {
			const alphabet = "0123456789abcdef";
			const table = new Array(256);
			for (let i = 0; i < 16; ++i) {
				const i16 = i * 16;
				for (let j = 0; j < 16; ++j) table[i16 + j] = alphabet[i] + alphabet[j];
			}
			return table;
		})();
		function defineBigIntMethod(fn) {
			return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
		}
		function BufferBigIntNotDefined() {
			throw new Error("BigInt not supported");
		}
	}));
	//#endregion
	//#region backend/init.ts
	var import_buffer$1 = require_buffer();
	Object.assign(globalThis, { Buffer: import_buffer$1.Buffer });
	//#endregion
	//#region backend/request.ts
	function httpFetch$1(url, options = {}) {
		let cancelled = false;
		return {
			promise: Promise.resolve().then(() => {
				if (cancelled) throw new Error("请求已取消");
				const nativeOptions = {
					...options,
					headers: { ...options.headers }
				};
				if (options.json !== void 0) {
					nativeOptions.body = JSON.stringify(options.json);
					delete nativeOptions.json;
					nativeOptions.headers["Content-Type"] = "application/json";
				} else if (options.body && typeof options.body === "object") {
					var _nativeOptions$header;
					nativeOptions.body = JSON.stringify(options.body);
					(_nativeOptions$header = nativeOptions.headers)["Content-Type"] || (_nativeOptions$header["Content-Type"] = "application/json");
				}
				const result = JSON.parse(globalThis.__http(url, JSON.stringify(nativeOptions)));
				if (result.error) throw new Error(result.error);
				return result;
			}),
			cancelHttp: () => {
				cancelled = true;
			}
		};
	}
	//#endregion
	//#region backend/musicSdk/kw/tipSearch.js
	var tipSearch_default = {
		regExps: { relWord: /RELWORD=(.+)/ },
		requestObj: null,
		async tipSearchBySong(str) {
			this.cancelTipSearch();
			this.requestObj = httpFetch$1(`https://tips.kuwo.cn/t.s?corp=kuwo&newver=3&p2p=1&notrace=0&c=mbox&w=${encodeURIComponent(str)}&encoding=utf8&rformat=json`, { Referer: "http://www.kuwo.cn/" });
			return this.requestObj.promise.then(({ body, statusCode }) => {
				if (statusCode != 200 || !body.WORDITEMS) return Promise.reject(/* @__PURE__ */ new Error("请求失败"));
				return body.WORDITEMS;
			});
		},
		handleResult(rawData) {
			return rawData.map((item) => item.RELWORD);
		},
		cancelTipSearch() {
			if (this.requestObj && this.requestObj.cancelHttp) this.requestObj.cancelHttp();
		},
		async search(str) {
			return this.tipSearchBySong(str).then((result) => this.handleResult(result));
		}
	};
	//#endregion
	//#region src/common/utils/common.ts
	var sizeFormate = (size) => {
		if (!size) return "0 B";
		let units = [
			"B",
			"KB",
			"MB",
			"GB",
			"TB"
		];
		let number = Math.floor(Math.log(size) / Math.log(1024));
		return `${(size / Math.pow(1024, Math.floor(number))).toFixed(2)} ${units[number]}`;
	};
	/**
	* 将字符串、时间戳等格式转成时间对象
	* @param date 时间
	* @returns 时间对象或空字符串
	*/
	var toDateObj = (date) => {
		if (!date) return "";
		switch (typeof date) {
			case "string":
				if (!date.includes("T")) date = date.split(".")[0].replace(/-/g, "/");
				return new Date(date);
			case "number": return new Date(date);
			case "object": return date;
			default: return "";
		}
	};
	var numFix = (n) => n < 10 ? `0${n}` : n.toString();
	/**
	* 时间格式化
	* @param _date 时间
	* @param format Y-M-D h:m:s Y年 M月 D日 h时 m分 s秒
	*/
	var dateFormat = (_date, format = "Y-M-D h:m:s") => {
		const date = toDateObj(_date);
		if (!date) return "";
		return format.replace("Y", date.getFullYear().toString()).replace("M", numFix(date.getMonth() + 1)).replace("D", numFix(date.getDate())).replace("h", numFix(date.getHours())).replace("m", numFix(date.getMinutes())).replace("s", numFix(date.getSeconds()));
	};
	var formatPlayTime = (time) => {
		let m = Math.trunc(time / 60);
		let s = Math.trunc(time % 60);
		return m == 0 && s == 0 ? "--/--" : numFix(m) + ":" + numFix(s);
	};
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/core.js
	var require_core = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory) {
			if (typeof exports === "object") module.exports = exports = factory();
			else if (typeof define === "function" && define.amd) define([], factory);
			else root.CryptoJS = factory();
		})(exports, function() {
			/**
			* CryptoJS core components.
			*/
			var CryptoJS = CryptoJS || function(Math, undefined) {
				var crypto;
				if (typeof window !== "undefined" && window.crypto) crypto = window.crypto;
				if (typeof self !== "undefined" && self.crypto) crypto = self.crypto;
				if (typeof globalThis !== "undefined" && globalThis.crypto) crypto = globalThis.crypto;
				if (!crypto && typeof window !== "undefined" && window.msCrypto) crypto = window.msCrypto;
				if (!crypto && typeof global !== "undefined" && global.crypto) crypto = global.crypto;
				if (!crypto && typeof require === "function") try {
					crypto = (init_crypto(), __toCommonJS(crypto_exports));
				} catch (err) {}
				var cryptoSecureRandomInt = function() {
					if (crypto) {
						if (typeof crypto.getRandomValues === "function") try {
							return crypto.getRandomValues(/* @__PURE__ */ new Uint32Array(1))[0];
						} catch (err) {}
						if (typeof crypto.randomBytes === "function") try {
							return crypto.randomBytes(4).readInt32LE();
						} catch (err) {}
					}
					throw new Error("Native crypto module could not be used to get secure random number.");
				};
				var create = Object.create || function() {
					function F() {}
					return function(obj) {
						var subtype;
						F.prototype = obj;
						subtype = new F();
						F.prototype = null;
						return subtype;
					};
				}();
				/**
				* CryptoJS namespace.
				*/
				var C = {};
				/**
				* Library namespace.
				*/
				var C_lib = C.lib = {};
				/**
				* Base object for prototypal inheritance.
				*/
				var Base = C_lib.Base = function() {
					return {
						/**
						* Creates a new object that inherits from this object.
						*
						* @param {Object} overrides Properties to copy into the new object.
						*
						* @return {Object} The new object.
						*
						* @static
						*
						* @example
						*
						*     var MyType = CryptoJS.lib.Base.extend({
						*         field: 'value',
						*
						*         method: function () {
						*         }
						*     });
						*/
						extend: function(overrides) {
							var subtype = create(this);
							if (overrides) subtype.mixIn(overrides);
							if (!subtype.hasOwnProperty("init") || this.init === subtype.init) subtype.init = function() {
								subtype.$super.init.apply(this, arguments);
							};
							subtype.init.prototype = subtype;
							subtype.$super = this;
							return subtype;
						},
						/**
						* Extends this object and runs the init method.
						* Arguments to create() will be passed to init().
						*
						* @return {Object} The new object.
						*
						* @static
						*
						* @example
						*
						*     var instance = MyType.create();
						*/
						create: function() {
							var instance = this.extend();
							instance.init.apply(instance, arguments);
							return instance;
						},
						/**
						* Initializes a newly created object.
						* Override this method to add some logic when your objects are created.
						*
						* @example
						*
						*     var MyType = CryptoJS.lib.Base.extend({
						*         init: function () {
						*             // ...
						*         }
						*     });
						*/
						init: function() {},
						/**
						* Copies properties into this object.
						*
						* @param {Object} properties The properties to mix in.
						*
						* @example
						*
						*     MyType.mixIn({
						*         field: 'value'
						*     });
						*/
						mixIn: function(properties) {
							for (var propertyName in properties) if (properties.hasOwnProperty(propertyName)) this[propertyName] = properties[propertyName];
							if (properties.hasOwnProperty("toString")) this.toString = properties.toString;
						},
						/**
						* Creates a copy of this object.
						*
						* @return {Object} The clone.
						*
						* @example
						*
						*     var clone = instance.clone();
						*/
						clone: function() {
							return this.init.prototype.extend(this);
						}
					};
				}();
				/**
				* An array of 32-bit words.
				*
				* @property {Array} words The array of 32-bit words.
				* @property {number} sigBytes The number of significant bytes in this word array.
				*/
				var WordArray = C_lib.WordArray = Base.extend({
					/**
					* Initializes a newly created word array.
					*
					* @param {Array} words (Optional) An array of 32-bit words.
					* @param {number} sigBytes (Optional) The number of significant bytes in the words.
					*
					* @example
					*
					*     var wordArray = CryptoJS.lib.WordArray.create();
					*     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
					*     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
					*/
					init: function(words, sigBytes) {
						words = this.words = words || [];
						if (sigBytes != undefined) this.sigBytes = sigBytes;
						else this.sigBytes = words.length * 4;
					},
					/**
					* Converts this word array to a string.
					*
					* @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
					*
					* @return {string} The stringified word array.
					*
					* @example
					*
					*     var string = wordArray + '';
					*     var string = wordArray.toString();
					*     var string = wordArray.toString(CryptoJS.enc.Utf8);
					*/
					toString: function(encoder) {
						return (encoder || Hex).stringify(this);
					},
					/**
					* Concatenates a word array to this word array.
					*
					* @param {WordArray} wordArray The word array to append.
					*
					* @return {WordArray} This word array.
					*
					* @example
					*
					*     wordArray1.concat(wordArray2);
					*/
					concat: function(wordArray) {
						var thisWords = this.words;
						var thatWords = wordArray.words;
						var thisSigBytes = this.sigBytes;
						var thatSigBytes = wordArray.sigBytes;
						this.clamp();
						if (thisSigBytes % 4) for (var i = 0; i < thatSigBytes; i++) {
							var thatByte = thatWords[i >>> 2] >>> 24 - i % 4 * 8 & 255;
							thisWords[thisSigBytes + i >>> 2] |= thatByte << 24 - (thisSigBytes + i) % 4 * 8;
						}
						else for (var j = 0; j < thatSigBytes; j += 4) thisWords[thisSigBytes + j >>> 2] = thatWords[j >>> 2];
						this.sigBytes += thatSigBytes;
						return this;
					},
					/**
					* Removes insignificant bits.
					*
					* @example
					*
					*     wordArray.clamp();
					*/
					clamp: function() {
						var words = this.words;
						var sigBytes = this.sigBytes;
						words[sigBytes >>> 2] &= 4294967295 << 32 - sigBytes % 4 * 8;
						words.length = Math.ceil(sigBytes / 4);
					},
					/**
					* Creates a copy of this word array.
					*
					* @return {WordArray} The clone.
					*
					* @example
					*
					*     var clone = wordArray.clone();
					*/
					clone: function() {
						var clone = Base.clone.call(this);
						clone.words = this.words.slice(0);
						return clone;
					},
					/**
					* Creates a word array filled with random bytes.
					*
					* @param {number} nBytes The number of random bytes to generate.
					*
					* @return {WordArray} The random word array.
					*
					* @static
					*
					* @example
					*
					*     var wordArray = CryptoJS.lib.WordArray.random(16);
					*/
					random: function(nBytes) {
						var words = [];
						for (var i = 0; i < nBytes; i += 4) words.push(cryptoSecureRandomInt());
						return new WordArray.init(words, nBytes);
					}
				});
				/**
				* Encoder namespace.
				*/
				var C_enc = C.enc = {};
				/**
				* Hex encoding strategy.
				*/
				var Hex = C_enc.Hex = {
					/**
					* Converts a word array to a hex string.
					*
					* @param {WordArray} wordArray The word array.
					*
					* @return {string} The hex string.
					*
					* @static
					*
					* @example
					*
					*     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
					*/
					stringify: function(wordArray) {
						var words = wordArray.words;
						var sigBytes = wordArray.sigBytes;
						var hexChars = [];
						for (var i = 0; i < sigBytes; i++) {
							var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
							hexChars.push((bite >>> 4).toString(16));
							hexChars.push((bite & 15).toString(16));
						}
						return hexChars.join("");
					},
					/**
					* Converts a hex string to a word array.
					*
					* @param {string} hexStr The hex string.
					*
					* @return {WordArray} The word array.
					*
					* @static
					*
					* @example
					*
					*     var wordArray = CryptoJS.enc.Hex.parse(hexString);
					*/
					parse: function(hexStr) {
						var hexStrLength = hexStr.length;
						var words = [];
						for (var i = 0; i < hexStrLength; i += 2) words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << 24 - i % 8 * 4;
						return new WordArray.init(words, hexStrLength / 2);
					}
				};
				/**
				* Latin1 encoding strategy.
				*/
				var Latin1 = C_enc.Latin1 = {
					/**
					* Converts a word array to a Latin1 string.
					*
					* @param {WordArray} wordArray The word array.
					*
					* @return {string} The Latin1 string.
					*
					* @static
					*
					* @example
					*
					*     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
					*/
					stringify: function(wordArray) {
						var words = wordArray.words;
						var sigBytes = wordArray.sigBytes;
						var latin1Chars = [];
						for (var i = 0; i < sigBytes; i++) {
							var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
							latin1Chars.push(String.fromCharCode(bite));
						}
						return latin1Chars.join("");
					},
					/**
					* Converts a Latin1 string to a word array.
					*
					* @param {string} latin1Str The Latin1 string.
					*
					* @return {WordArray} The word array.
					*
					* @static
					*
					* @example
					*
					*     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
					*/
					parse: function(latin1Str) {
						var latin1StrLength = latin1Str.length;
						var words = [];
						for (var i = 0; i < latin1StrLength; i++) words[i >>> 2] |= (latin1Str.charCodeAt(i) & 255) << 24 - i % 4 * 8;
						return new WordArray.init(words, latin1StrLength);
					}
				};
				/**
				* UTF-8 encoding strategy.
				*/
				var Utf8 = C_enc.Utf8 = {
					/**
					* Converts a word array to a UTF-8 string.
					*
					* @param {WordArray} wordArray The word array.
					*
					* @return {string} The UTF-8 string.
					*
					* @static
					*
					* @example
					*
					*     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
					*/
					stringify: function(wordArray) {
						try {
							return decodeURIComponent(escape(Latin1.stringify(wordArray)));
						} catch (e) {
							throw new Error("Malformed UTF-8 data");
						}
					},
					/**
					* Converts a UTF-8 string to a word array.
					*
					* @param {string} utf8Str The UTF-8 string.
					*
					* @return {WordArray} The word array.
					*
					* @static
					*
					* @example
					*
					*     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
					*/
					parse: function(utf8Str) {
						return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
					}
				};
				/**
				* Abstract buffered block algorithm template.
				*
				* The property blockSize must be implemented in a concrete subtype.
				*
				* @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
				*/
				var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
					/**
					* Resets this block algorithm's data buffer to its initial state.
					*
					* @example
					*
					*     bufferedBlockAlgorithm.reset();
					*/
					reset: function() {
						this._data = new WordArray.init();
						this._nDataBytes = 0;
					},
					/**
					* Adds new data to this block algorithm's buffer.
					*
					* @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
					*
					* @example
					*
					*     bufferedBlockAlgorithm._append('data');
					*     bufferedBlockAlgorithm._append(wordArray);
					*/
					_append: function(data) {
						if (typeof data == "string") data = Utf8.parse(data);
						this._data.concat(data);
						this._nDataBytes += data.sigBytes;
					},
					/**
					* Processes available data blocks.
					*
					* This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
					*
					* @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
					*
					* @return {WordArray} The processed data.
					*
					* @example
					*
					*     var processedData = bufferedBlockAlgorithm._process();
					*     var processedData = bufferedBlockAlgorithm._process(!!'flush');
					*/
					_process: function(doFlush) {
						var processedWords;
						var data = this._data;
						var dataWords = data.words;
						var dataSigBytes = data.sigBytes;
						var blockSize = this.blockSize;
						var nBlocksReady = dataSigBytes / (blockSize * 4);
						if (doFlush) nBlocksReady = Math.ceil(nBlocksReady);
						else nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
						var nWordsReady = nBlocksReady * blockSize;
						var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);
						if (nWordsReady) {
							for (var offset = 0; offset < nWordsReady; offset += blockSize) this._doProcessBlock(dataWords, offset);
							processedWords = dataWords.splice(0, nWordsReady);
							data.sigBytes -= nBytesReady;
						}
						return new WordArray.init(processedWords, nBytesReady);
					},
					/**
					* Creates a copy of this object.
					*
					* @return {Object} The clone.
					*
					* @example
					*
					*     var clone = bufferedBlockAlgorithm.clone();
					*/
					clone: function() {
						var clone = Base.clone.call(this);
						clone._data = this._data.clone();
						return clone;
					},
					_minBufferSize: 0
				});
				C_lib.Hasher = BufferedBlockAlgorithm.extend({
					/**
					* Configuration options.
					*/
					cfg: Base.extend(),
					/**
					* Initializes a newly created hasher.
					*
					* @param {Object} cfg (Optional) The configuration options to use for this hash computation.
					*
					* @example
					*
					*     var hasher = CryptoJS.algo.SHA256.create();
					*/
					init: function(cfg) {
						this.cfg = this.cfg.extend(cfg);
						this.reset();
					},
					/**
					* Resets this hasher to its initial state.
					*
					* @example
					*
					*     hasher.reset();
					*/
					reset: function() {
						BufferedBlockAlgorithm.reset.call(this);
						this._doReset();
					},
					/**
					* Updates this hasher with a message.
					*
					* @param {WordArray|string} messageUpdate The message to append.
					*
					* @return {Hasher} This hasher.
					*
					* @example
					*
					*     hasher.update('message');
					*     hasher.update(wordArray);
					*/
					update: function(messageUpdate) {
						this._append(messageUpdate);
						this._process();
						return this;
					},
					/**
					* Finalizes the hash computation.
					* Note that the finalize operation is effectively a destructive, read-once operation.
					*
					* @param {WordArray|string} messageUpdate (Optional) A final message update.
					*
					* @return {WordArray} The hash.
					*
					* @example
					*
					*     var hash = hasher.finalize();
					*     var hash = hasher.finalize('message');
					*     var hash = hasher.finalize(wordArray);
					*/
					finalize: function(messageUpdate) {
						if (messageUpdate) this._append(messageUpdate);
						return this._doFinalize();
					},
					blockSize: 16,
					/**
					* Creates a shortcut function to a hasher's object interface.
					*
					* @param {Hasher} hasher The hasher to create a helper for.
					*
					* @return {Function} The shortcut function.
					*
					* @static
					*
					* @example
					*
					*     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
					*/
					_createHelper: function(hasher) {
						return function(message, cfg) {
							return new hasher.init(cfg).finalize(message);
						};
					},
					/**
					* Creates a shortcut function to the HMAC's object interface.
					*
					* @param {Hasher} hasher The hasher to use in this HMAC helper.
					*
					* @return {Function} The shortcut function.
					*
					* @static
					*
					* @example
					*
					*     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
					*/
					_createHmacHelper: function(hasher) {
						return function(message, key) {
							return new C_algo.HMAC.init(hasher, key).finalize(message);
						};
					}
				});
				/**
				* Algorithm namespace.
				*/
				var C_algo = C.algo = {};
				return C;
			}(Math);
			return CryptoJS;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/md5.js
	var require_md5 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory) {
			if (typeof exports === "object") module.exports = exports = factory(require_core());
			else if (typeof define === "function" && define.amd) define(["./core"], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			(function(Math) {
				var C = CryptoJS;
				var C_lib = C.lib;
				var WordArray = C_lib.WordArray;
				var Hasher = C_lib.Hasher;
				var C_algo = C.algo;
				var T = [];
				(function() {
					for (var i = 0; i < 64; i++) T[i] = Math.abs(Math.sin(i + 1)) * 4294967296 | 0;
				})();
				/**
				* MD5 hash algorithm.
				*/
				var MD5 = C_algo.MD5 = Hasher.extend({
					_doReset: function() {
						this._hash = new WordArray.init([
							1732584193,
							4023233417,
							2562383102,
							271733878
						]);
					},
					_doProcessBlock: function(M, offset) {
						for (var i = 0; i < 16; i++) {
							var offset_i = offset + i;
							var M_offset_i = M[offset_i];
							M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 16711935 | (M_offset_i << 24 | M_offset_i >>> 8) & 4278255360;
						}
						var H = this._hash.words;
						var M_offset_0 = M[offset + 0];
						var M_offset_1 = M[offset + 1];
						var M_offset_2 = M[offset + 2];
						var M_offset_3 = M[offset + 3];
						var M_offset_4 = M[offset + 4];
						var M_offset_5 = M[offset + 5];
						var M_offset_6 = M[offset + 6];
						var M_offset_7 = M[offset + 7];
						var M_offset_8 = M[offset + 8];
						var M_offset_9 = M[offset + 9];
						var M_offset_10 = M[offset + 10];
						var M_offset_11 = M[offset + 11];
						var M_offset_12 = M[offset + 12];
						var M_offset_13 = M[offset + 13];
						var M_offset_14 = M[offset + 14];
						var M_offset_15 = M[offset + 15];
						var a = H[0];
						var b = H[1];
						var c = H[2];
						var d = H[3];
						a = FF(a, b, c, d, M_offset_0, 7, T[0]);
						d = FF(d, a, b, c, M_offset_1, 12, T[1]);
						c = FF(c, d, a, b, M_offset_2, 17, T[2]);
						b = FF(b, c, d, a, M_offset_3, 22, T[3]);
						a = FF(a, b, c, d, M_offset_4, 7, T[4]);
						d = FF(d, a, b, c, M_offset_5, 12, T[5]);
						c = FF(c, d, a, b, M_offset_6, 17, T[6]);
						b = FF(b, c, d, a, M_offset_7, 22, T[7]);
						a = FF(a, b, c, d, M_offset_8, 7, T[8]);
						d = FF(d, a, b, c, M_offset_9, 12, T[9]);
						c = FF(c, d, a, b, M_offset_10, 17, T[10]);
						b = FF(b, c, d, a, M_offset_11, 22, T[11]);
						a = FF(a, b, c, d, M_offset_12, 7, T[12]);
						d = FF(d, a, b, c, M_offset_13, 12, T[13]);
						c = FF(c, d, a, b, M_offset_14, 17, T[14]);
						b = FF(b, c, d, a, M_offset_15, 22, T[15]);
						a = GG(a, b, c, d, M_offset_1, 5, T[16]);
						d = GG(d, a, b, c, M_offset_6, 9, T[17]);
						c = GG(c, d, a, b, M_offset_11, 14, T[18]);
						b = GG(b, c, d, a, M_offset_0, 20, T[19]);
						a = GG(a, b, c, d, M_offset_5, 5, T[20]);
						d = GG(d, a, b, c, M_offset_10, 9, T[21]);
						c = GG(c, d, a, b, M_offset_15, 14, T[22]);
						b = GG(b, c, d, a, M_offset_4, 20, T[23]);
						a = GG(a, b, c, d, M_offset_9, 5, T[24]);
						d = GG(d, a, b, c, M_offset_14, 9, T[25]);
						c = GG(c, d, a, b, M_offset_3, 14, T[26]);
						b = GG(b, c, d, a, M_offset_8, 20, T[27]);
						a = GG(a, b, c, d, M_offset_13, 5, T[28]);
						d = GG(d, a, b, c, M_offset_2, 9, T[29]);
						c = GG(c, d, a, b, M_offset_7, 14, T[30]);
						b = GG(b, c, d, a, M_offset_12, 20, T[31]);
						a = HH(a, b, c, d, M_offset_5, 4, T[32]);
						d = HH(d, a, b, c, M_offset_8, 11, T[33]);
						c = HH(c, d, a, b, M_offset_11, 16, T[34]);
						b = HH(b, c, d, a, M_offset_14, 23, T[35]);
						a = HH(a, b, c, d, M_offset_1, 4, T[36]);
						d = HH(d, a, b, c, M_offset_4, 11, T[37]);
						c = HH(c, d, a, b, M_offset_7, 16, T[38]);
						b = HH(b, c, d, a, M_offset_10, 23, T[39]);
						a = HH(a, b, c, d, M_offset_13, 4, T[40]);
						d = HH(d, a, b, c, M_offset_0, 11, T[41]);
						c = HH(c, d, a, b, M_offset_3, 16, T[42]);
						b = HH(b, c, d, a, M_offset_6, 23, T[43]);
						a = HH(a, b, c, d, M_offset_9, 4, T[44]);
						d = HH(d, a, b, c, M_offset_12, 11, T[45]);
						c = HH(c, d, a, b, M_offset_15, 16, T[46]);
						b = HH(b, c, d, a, M_offset_2, 23, T[47]);
						a = II(a, b, c, d, M_offset_0, 6, T[48]);
						d = II(d, a, b, c, M_offset_7, 10, T[49]);
						c = II(c, d, a, b, M_offset_14, 15, T[50]);
						b = II(b, c, d, a, M_offset_5, 21, T[51]);
						a = II(a, b, c, d, M_offset_12, 6, T[52]);
						d = II(d, a, b, c, M_offset_3, 10, T[53]);
						c = II(c, d, a, b, M_offset_10, 15, T[54]);
						b = II(b, c, d, a, M_offset_1, 21, T[55]);
						a = II(a, b, c, d, M_offset_8, 6, T[56]);
						d = II(d, a, b, c, M_offset_15, 10, T[57]);
						c = II(c, d, a, b, M_offset_6, 15, T[58]);
						b = II(b, c, d, a, M_offset_13, 21, T[59]);
						a = II(a, b, c, d, M_offset_4, 6, T[60]);
						d = II(d, a, b, c, M_offset_11, 10, T[61]);
						c = II(c, d, a, b, M_offset_2, 15, T[62]);
						b = II(b, c, d, a, M_offset_9, 21, T[63]);
						H[0] = H[0] + a | 0;
						H[1] = H[1] + b | 0;
						H[2] = H[2] + c | 0;
						H[3] = H[3] + d | 0;
					},
					_doFinalize: function() {
						var data = this._data;
						var dataWords = data.words;
						var nBitsTotal = this._nDataBytes * 8;
						var nBitsLeft = data.sigBytes * 8;
						dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
						var nBitsTotalH = Math.floor(nBitsTotal / 4294967296);
						var nBitsTotalL = nBitsTotal;
						dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = (nBitsTotalH << 8 | nBitsTotalH >>> 24) & 16711935 | (nBitsTotalH << 24 | nBitsTotalH >>> 8) & 4278255360;
						dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotalL << 8 | nBitsTotalL >>> 24) & 16711935 | (nBitsTotalL << 24 | nBitsTotalL >>> 8) & 4278255360;
						data.sigBytes = (dataWords.length + 1) * 4;
						this._process();
						var hash = this._hash;
						var H = hash.words;
						for (var i = 0; i < 4; i++) {
							var H_i = H[i];
							H[i] = (H_i << 8 | H_i >>> 24) & 16711935 | (H_i << 24 | H_i >>> 8) & 4278255360;
						}
						return hash;
					},
					clone: function() {
						var clone = Hasher.clone.call(this);
						clone._hash = this._hash.clone();
						return clone;
					}
				});
				function FF(a, b, c, d, x, s, t) {
					var n = a + (b & c | ~b & d) + x + t;
					return (n << s | n >>> 32 - s) + b;
				}
				function GG(a, b, c, d, x, s, t) {
					var n = a + (b & d | c & ~d) + x + t;
					return (n << s | n >>> 32 - s) + b;
				}
				function HH(a, b, c, d, x, s, t) {
					var n = a + (b ^ c ^ d) + x + t;
					return (n << s | n >>> 32 - s) + b;
				}
				function II(a, b, c, d, x, s, t) {
					var n = a + (c ^ (b | ~d)) + x + t;
					return (n << s | n >>> 32 - s) + b;
				}
				/**
				* Shortcut function to the hasher's object interface.
				*
				* @param {WordArray|string} message The message to hash.
				*
				* @return {WordArray} The hash.
				*
				* @static
				*
				* @example
				*
				*     var hash = CryptoJS.MD5('message');
				*     var hash = CryptoJS.MD5(wordArray);
				*/
				C.MD5 = Hasher._createHelper(MD5);
				/**
				* Shortcut function to the HMAC's object interface.
				*
				* @param {WordArray|string} message The message to hash.
				* @param {WordArray|string} key The secret key.
				*
				* @return {WordArray} The HMAC.
				*
				* @static
				*
				* @example
				*
				*     var hmac = CryptoJS.HmacMD5(message, key);
				*/
				C.HmacMD5 = Hasher._createHmacHelper(MD5);
			})(Math);
			return CryptoJS.MD5;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/sha1.js
	var require_sha1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory) {
			if (typeof exports === "object") module.exports = exports = factory(require_core());
			else if (typeof define === "function" && define.amd) define(["./core"], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			(function() {
				var C = CryptoJS;
				var C_lib = C.lib;
				var WordArray = C_lib.WordArray;
				var Hasher = C_lib.Hasher;
				var C_algo = C.algo;
				var W = [];
				/**
				* SHA-1 hash algorithm.
				*/
				var SHA1 = C_algo.SHA1 = Hasher.extend({
					_doReset: function() {
						this._hash = new WordArray.init([
							1732584193,
							4023233417,
							2562383102,
							271733878,
							3285377520
						]);
					},
					_doProcessBlock: function(M, offset) {
						var H = this._hash.words;
						var a = H[0];
						var b = H[1];
						var c = H[2];
						var d = H[3];
						var e = H[4];
						for (var i = 0; i < 80; i++) {
							if (i < 16) W[i] = M[offset + i] | 0;
							else {
								var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
								W[i] = n << 1 | n >>> 31;
							}
							var t = (a << 5 | a >>> 27) + e + W[i];
							if (i < 20) t += (b & c | ~b & d) + 1518500249;
							else if (i < 40) t += (b ^ c ^ d) + 1859775393;
							else if (i < 60) t += (b & c | b & d | c & d) - 1894007588;
							else t += (b ^ c ^ d) - 899497514;
							e = d;
							d = c;
							c = b << 30 | b >>> 2;
							b = a;
							a = t;
						}
						H[0] = H[0] + a | 0;
						H[1] = H[1] + b | 0;
						H[2] = H[2] + c | 0;
						H[3] = H[3] + d | 0;
						H[4] = H[4] + e | 0;
					},
					_doFinalize: function() {
						var data = this._data;
						var dataWords = data.words;
						var nBitsTotal = this._nDataBytes * 8;
						var nBitsLeft = data.sigBytes * 8;
						dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
						dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(nBitsTotal / 4294967296);
						dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
						data.sigBytes = dataWords.length * 4;
						this._process();
						return this._hash;
					},
					clone: function() {
						var clone = Hasher.clone.call(this);
						clone._hash = this._hash.clone();
						return clone;
					}
				});
				/**
				* Shortcut function to the hasher's object interface.
				*
				* @param {WordArray|string} message The message to hash.
				*
				* @return {WordArray} The hash.
				*
				* @static
				*
				* @example
				*
				*     var hash = CryptoJS.SHA1('message');
				*     var hash = CryptoJS.SHA1(wordArray);
				*/
				C.SHA1 = Hasher._createHelper(SHA1);
				/**
				* Shortcut function to the HMAC's object interface.
				*
				* @param {WordArray|string} message The message to hash.
				* @param {WordArray|string} key The secret key.
				*
				* @return {WordArray} The HMAC.
				*
				* @static
				*
				* @example
				*
				*     var hmac = CryptoJS.HmacSHA1(message, key);
				*/
				C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
			})();
			return CryptoJS.SHA1;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/enc-base64.js
	var require_enc_base64 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory) {
			if (typeof exports === "object") module.exports = exports = factory(require_core());
			else if (typeof define === "function" && define.amd) define(["./core"], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			(function() {
				var C = CryptoJS;
				var WordArray = C.lib.WordArray;
				var C_enc = C.enc;
				C_enc.Base64 = {
					/**
					* Converts a word array to a Base64 string.
					*
					* @param {WordArray} wordArray The word array.
					*
					* @return {string} The Base64 string.
					*
					* @static
					*
					* @example
					*
					*     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
					*/
					stringify: function(wordArray) {
						var words = wordArray.words;
						var sigBytes = wordArray.sigBytes;
						var map = this._map;
						wordArray.clamp();
						var base64Chars = [];
						for (var i = 0; i < sigBytes; i += 3) {
							var byte1 = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
							var byte2 = words[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 255;
							var byte3 = words[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 255;
							var triplet = byte1 << 16 | byte2 << 8 | byte3;
							for (var j = 0; j < 4 && i + j * .75 < sigBytes; j++) base64Chars.push(map.charAt(triplet >>> 6 * (3 - j) & 63));
						}
						var paddingChar = map.charAt(64);
						if (paddingChar) while (base64Chars.length % 4) base64Chars.push(paddingChar);
						return base64Chars.join("");
					},
					/**
					* Converts a Base64 string to a word array.
					*
					* @param {string} base64Str The Base64 string.
					*
					* @return {WordArray} The word array.
					*
					* @static
					*
					* @example
					*
					*     var wordArray = CryptoJS.enc.Base64.parse(base64String);
					*/
					parse: function(base64Str) {
						var base64StrLength = base64Str.length;
						var map = this._map;
						var reverseMap = this._reverseMap;
						if (!reverseMap) {
							reverseMap = this._reverseMap = [];
							for (var j = 0; j < map.length; j++) reverseMap[map.charCodeAt(j)] = j;
						}
						var paddingChar = map.charAt(64);
						if (paddingChar) {
							var paddingIndex = base64Str.indexOf(paddingChar);
							if (paddingIndex !== -1) base64StrLength = paddingIndex;
						}
						return parseLoop(base64Str, base64StrLength, reverseMap);
					},
					_map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
				};
				function parseLoop(base64Str, base64StrLength, reverseMap) {
					var words = [];
					var nBytes = 0;
					for (var i = 0; i < base64StrLength; i++) if (i % 4) {
						var bitsCombined = reverseMap[base64Str.charCodeAt(i - 1)] << i % 4 * 2 | reverseMap[base64Str.charCodeAt(i)] >>> 6 - i % 4 * 2;
						words[nBytes >>> 2] |= bitsCombined << 24 - nBytes % 4 * 8;
						nBytes++;
					}
					return WordArray.create(words, nBytes);
				}
			})();
			return CryptoJS.enc.Base64;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/hmac.js
	var require_hmac = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory) {
			if (typeof exports === "object") module.exports = exports = factory(require_core());
			else if (typeof define === "function" && define.amd) define(["./core"], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			(function() {
				var C = CryptoJS;
				var Base = C.lib.Base;
				var Utf8 = C.enc.Utf8;
				var C_algo = C.algo;
				C_algo.HMAC = Base.extend({
					/**
					* Initializes a newly created HMAC.
					*
					* @param {Hasher} hasher The hash algorithm to use.
					* @param {WordArray|string} key The secret key.
					*
					* @example
					*
					*     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
					*/
					init: function(hasher, key) {
						hasher = this._hasher = new hasher.init();
						if (typeof key == "string") key = Utf8.parse(key);
						var hasherBlockSize = hasher.blockSize;
						var hasherBlockSizeBytes = hasherBlockSize * 4;
						if (key.sigBytes > hasherBlockSizeBytes) key = hasher.finalize(key);
						key.clamp();
						var oKey = this._oKey = key.clone();
						var iKey = this._iKey = key.clone();
						var oKeyWords = oKey.words;
						var iKeyWords = iKey.words;
						for (var i = 0; i < hasherBlockSize; i++) {
							oKeyWords[i] ^= 1549556828;
							iKeyWords[i] ^= 909522486;
						}
						oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;
						this.reset();
					},
					/**
					* Resets this HMAC to its initial state.
					*
					* @example
					*
					*     hmacHasher.reset();
					*/
					reset: function() {
						var hasher = this._hasher;
						hasher.reset();
						hasher.update(this._iKey);
					},
					/**
					* Updates this HMAC with a message.
					*
					* @param {WordArray|string} messageUpdate The message to append.
					*
					* @return {HMAC} This HMAC instance.
					*
					* @example
					*
					*     hmacHasher.update('message');
					*     hmacHasher.update(wordArray);
					*/
					update: function(messageUpdate) {
						this._hasher.update(messageUpdate);
						return this;
					},
					/**
					* Finalizes the HMAC computation.
					* Note that the finalize operation is effectively a destructive, read-once operation.
					*
					* @param {WordArray|string} messageUpdate (Optional) A final message update.
					*
					* @return {WordArray} The HMAC.
					*
					* @example
					*
					*     var hmac = hmacHasher.finalize();
					*     var hmac = hmacHasher.finalize('message');
					*     var hmac = hmacHasher.finalize(wordArray);
					*/
					finalize: function(messageUpdate) {
						var hasher = this._hasher;
						var innerHash = hasher.finalize(messageUpdate);
						hasher.reset();
						return hasher.finalize(this._oKey.clone().concat(innerHash));
					}
				});
			})();
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/evpkdf.js
	var require_evpkdf = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory, undef) {
			if (typeof exports === "object") module.exports = exports = factory(require_core(), require_sha1(), require_hmac());
			else if (typeof define === "function" && define.amd) define([
				"./core",
				"./sha1",
				"./hmac"
			], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			(function() {
				var C = CryptoJS;
				var C_lib = C.lib;
				var Base = C_lib.Base;
				var WordArray = C_lib.WordArray;
				var C_algo = C.algo;
				var MD5 = C_algo.MD5;
				/**
				* This key derivation function is meant to conform with EVP_BytesToKey.
				* www.openssl.org/docs/crypto/EVP_BytesToKey.html
				*/
				var EvpKDF = C_algo.EvpKDF = Base.extend({
					/**
					* Configuration options.
					*
					* @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
					* @property {Hasher} hasher The hash algorithm to use. Default: MD5
					* @property {number} iterations The number of iterations to perform. Default: 1
					*/
					cfg: Base.extend({
						keySize: 4,
						hasher: MD5,
						iterations: 1
					}),
					/**
					* Initializes a newly created key derivation function.
					*
					* @param {Object} cfg (Optional) The configuration options to use for the derivation.
					*
					* @example
					*
					*     var kdf = CryptoJS.algo.EvpKDF.create();
					*     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
					*     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
					*/
					init: function(cfg) {
						this.cfg = this.cfg.extend(cfg);
					},
					/**
					* Derives a key from a password.
					*
					* @param {WordArray|string} password The password.
					* @param {WordArray|string} salt A salt.
					*
					* @return {WordArray} The derived key.
					*
					* @example
					*
					*     var key = kdf.compute(password, salt);
					*/
					compute: function(password, salt) {
						var block;
						var cfg = this.cfg;
						var hasher = cfg.hasher.create();
						var derivedKey = WordArray.create();
						var derivedKeyWords = derivedKey.words;
						var keySize = cfg.keySize;
						var iterations = cfg.iterations;
						while (derivedKeyWords.length < keySize) {
							if (block) hasher.update(block);
							block = hasher.update(password).finalize(salt);
							hasher.reset();
							for (var i = 1; i < iterations; i++) {
								block = hasher.finalize(block);
								hasher.reset();
							}
							derivedKey.concat(block);
						}
						derivedKey.sigBytes = keySize * 4;
						return derivedKey;
					}
				});
				/**
				* Derives a key from a password.
				*
				* @param {WordArray|string} password The password.
				* @param {WordArray|string} salt A salt.
				* @param {Object} cfg (Optional) The configuration options to use for this computation.
				*
				* @return {WordArray} The derived key.
				*
				* @static
				*
				* @example
				*
				*     var key = CryptoJS.EvpKDF(password, salt);
				*     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8 });
				*     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8, iterations: 1000 });
				*/
				C.EvpKDF = function(password, salt, cfg) {
					return EvpKDF.create(cfg).compute(password, salt);
				};
			})();
			return CryptoJS.EvpKDF;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/cipher-core.js
	var require_cipher_core = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory, undef) {
			if (typeof exports === "object") module.exports = exports = factory(require_core(), require_evpkdf());
			else if (typeof define === "function" && define.amd) define(["./core", "./evpkdf"], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			/**
			* Cipher core components.
			*/
			CryptoJS.lib.Cipher || function(undefined) {
				var C = CryptoJS;
				var C_lib = C.lib;
				var Base = C_lib.Base;
				var WordArray = C_lib.WordArray;
				var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
				var C_enc = C.enc;
				C_enc.Utf8;
				var Base64 = C_enc.Base64;
				var EvpKDF = C.algo.EvpKDF;
				/**
				* Abstract base cipher template.
				*
				* @property {number} keySize This cipher's key size. Default: 4 (128 bits)
				* @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
				* @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
				* @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
				*/
				var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
					/**
					* Configuration options.
					*
					* @property {WordArray} iv The IV to use for this operation.
					*/
					cfg: Base.extend(),
					/**
					* Creates this cipher in encryption mode.
					*
					* @param {WordArray} key The key.
					* @param {Object} cfg (Optional) The configuration options to use for this operation.
					*
					* @return {Cipher} A cipher instance.
					*
					* @static
					*
					* @example
					*
					*     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
					*/
					createEncryptor: function(key, cfg) {
						return this.create(this._ENC_XFORM_MODE, key, cfg);
					},
					/**
					* Creates this cipher in decryption mode.
					*
					* @param {WordArray} key The key.
					* @param {Object} cfg (Optional) The configuration options to use for this operation.
					*
					* @return {Cipher} A cipher instance.
					*
					* @static
					*
					* @example
					*
					*     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
					*/
					createDecryptor: function(key, cfg) {
						return this.create(this._DEC_XFORM_MODE, key, cfg);
					},
					/**
					* Initializes a newly created cipher.
					*
					* @param {number} xformMode Either the encryption or decryption transormation mode constant.
					* @param {WordArray} key The key.
					* @param {Object} cfg (Optional) The configuration options to use for this operation.
					*
					* @example
					*
					*     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
					*/
					init: function(xformMode, key, cfg) {
						this.cfg = this.cfg.extend(cfg);
						this._xformMode = xformMode;
						this._key = key;
						this.reset();
					},
					/**
					* Resets this cipher to its initial state.
					*
					* @example
					*
					*     cipher.reset();
					*/
					reset: function() {
						BufferedBlockAlgorithm.reset.call(this);
						this._doReset();
					},
					/**
					* Adds data to be encrypted or decrypted.
					*
					* @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
					*
					* @return {WordArray} The data after processing.
					*
					* @example
					*
					*     var encrypted = cipher.process('data');
					*     var encrypted = cipher.process(wordArray);
					*/
					process: function(dataUpdate) {
						this._append(dataUpdate);
						return this._process();
					},
					/**
					* Finalizes the encryption or decryption process.
					* Note that the finalize operation is effectively a destructive, read-once operation.
					*
					* @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
					*
					* @return {WordArray} The data after final processing.
					*
					* @example
					*
					*     var encrypted = cipher.finalize();
					*     var encrypted = cipher.finalize('data');
					*     var encrypted = cipher.finalize(wordArray);
					*/
					finalize: function(dataUpdate) {
						if (dataUpdate) this._append(dataUpdate);
						return this._doFinalize();
					},
					keySize: 4,
					ivSize: 4,
					_ENC_XFORM_MODE: 1,
					_DEC_XFORM_MODE: 2,
					/**
					* Creates shortcut functions to a cipher's object interface.
					*
					* @param {Cipher} cipher The cipher to create a helper for.
					*
					* @return {Object} An object with encrypt and decrypt shortcut functions.
					*
					* @static
					*
					* @example
					*
					*     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
					*/
					_createHelper: function() {
						function selectCipherStrategy(key) {
							if (typeof key == "string") return PasswordBasedCipher;
							else return SerializableCipher;
						}
						return function(cipher) {
							return {
								encrypt: function(message, key, cfg) {
									return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
								},
								decrypt: function(ciphertext, key, cfg) {
									return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
								}
							};
						};
					}()
				});
				C_lib.StreamCipher = Cipher.extend({
					_doFinalize: function() {
						return this._process(true);
					},
					blockSize: 1
				});
				/**
				* Mode namespace.
				*/
				var C_mode = C.mode = {};
				/**
				* Abstract base block cipher mode template.
				*/
				var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
					/**
					* Creates this mode for encryption.
					*
					* @param {Cipher} cipher A block cipher instance.
					* @param {Array} iv The IV words.
					*
					* @static
					*
					* @example
					*
					*     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
					*/
					createEncryptor: function(cipher, iv) {
						return this.Encryptor.create(cipher, iv);
					},
					/**
					* Creates this mode for decryption.
					*
					* @param {Cipher} cipher A block cipher instance.
					* @param {Array} iv The IV words.
					*
					* @static
					*
					* @example
					*
					*     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
					*/
					createDecryptor: function(cipher, iv) {
						return this.Decryptor.create(cipher, iv);
					},
					/**
					* Initializes a newly created mode.
					*
					* @param {Cipher} cipher A block cipher instance.
					* @param {Array} iv The IV words.
					*
					* @example
					*
					*     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
					*/
					init: function(cipher, iv) {
						this._cipher = cipher;
						this._iv = iv;
					}
				});
				/**
				* Cipher Block Chaining mode.
				*/
				var CBC = C_mode.CBC = function() {
					/**
					* Abstract base CBC mode.
					*/
					var CBC = BlockCipherMode.extend();
					/**
					* CBC encryptor.
					*/
					CBC.Encryptor = CBC.extend({ 
					/**
					* Processes the data block at offset.
					*
					* @param {Array} words The data words to operate on.
					* @param {number} offset The offset where the block starts.
					*
					* @example
					*
					*     mode.processBlock(data.words, offset);
					*/
processBlock: function(words, offset) {
						var cipher = this._cipher;
						var blockSize = cipher.blockSize;
						xorBlock.call(this, words, offset, blockSize);
						cipher.encryptBlock(words, offset);
						this._prevBlock = words.slice(offset, offset + blockSize);
					} });
					/**
					* CBC decryptor.
					*/
					CBC.Decryptor = CBC.extend({ 
					/**
					* Processes the data block at offset.
					*
					* @param {Array} words The data words to operate on.
					* @param {number} offset The offset where the block starts.
					*
					* @example
					*
					*     mode.processBlock(data.words, offset);
					*/
processBlock: function(words, offset) {
						var cipher = this._cipher;
						var blockSize = cipher.blockSize;
						var thisBlock = words.slice(offset, offset + blockSize);
						cipher.decryptBlock(words, offset);
						xorBlock.call(this, words, offset, blockSize);
						this._prevBlock = thisBlock;
					} });
					function xorBlock(words, offset, blockSize) {
						var block;
						var iv = this._iv;
						if (iv) {
							block = iv;
							this._iv = undefined;
						} else block = this._prevBlock;
						for (var i = 0; i < blockSize; i++) words[offset + i] ^= block[i];
					}
					return CBC;
				}();
				/**
				* Padding namespace.
				*/
				var C_pad = C.pad = {};
				/**
				* PKCS #5/7 padding strategy.
				*/
				var Pkcs7 = C_pad.Pkcs7 = {
					/**
					* Pads data using the algorithm defined in PKCS #5/7.
					*
					* @param {WordArray} data The data to pad.
					* @param {number} blockSize The multiple that the data should be padded to.
					*
					* @static
					*
					* @example
					*
					*     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
					*/
					pad: function(data, blockSize) {
						var blockSizeBytes = blockSize * 4;
						var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
						var paddingWord = nPaddingBytes << 24 | nPaddingBytes << 16 | nPaddingBytes << 8 | nPaddingBytes;
						var paddingWords = [];
						for (var i = 0; i < nPaddingBytes; i += 4) paddingWords.push(paddingWord);
						var padding = WordArray.create(paddingWords, nPaddingBytes);
						data.concat(padding);
					},
					/**
					* Unpads data that had been padded using the algorithm defined in PKCS #5/7.
					*
					* @param {WordArray} data The data to unpad.
					*
					* @static
					*
					* @example
					*
					*     CryptoJS.pad.Pkcs7.unpad(wordArray);
					*/
					unpad: function(data) {
						var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
						data.sigBytes -= nPaddingBytes;
					}
				};
				C_lib.BlockCipher = Cipher.extend({
					/**
					* Configuration options.
					*
					* @property {Mode} mode The block mode to use. Default: CBC
					* @property {Padding} padding The padding strategy to use. Default: Pkcs7
					*/
					cfg: Cipher.cfg.extend({
						mode: CBC,
						padding: Pkcs7
					}),
					reset: function() {
						var modeCreator;
						Cipher.reset.call(this);
						var cfg = this.cfg;
						var iv = cfg.iv;
						var mode = cfg.mode;
						if (this._xformMode == this._ENC_XFORM_MODE) modeCreator = mode.createEncryptor;
						else {
							modeCreator = mode.createDecryptor;
							this._minBufferSize = 1;
						}
						if (this._mode && this._mode.__creator == modeCreator) this._mode.init(this, iv && iv.words);
						else {
							this._mode = modeCreator.call(mode, this, iv && iv.words);
							this._mode.__creator = modeCreator;
						}
					},
					_doProcessBlock: function(words, offset) {
						this._mode.processBlock(words, offset);
					},
					_doFinalize: function() {
						var finalProcessedBlocks;
						var padding = this.cfg.padding;
						if (this._xformMode == this._ENC_XFORM_MODE) {
							padding.pad(this._data, this.blockSize);
							finalProcessedBlocks = this._process(true);
						} else {
							finalProcessedBlocks = this._process(true);
							padding.unpad(finalProcessedBlocks);
						}
						return finalProcessedBlocks;
					},
					blockSize: 4
				});
				/**
				* A collection of cipher parameters.
				*
				* @property {WordArray} ciphertext The raw ciphertext.
				* @property {WordArray} key The key to this ciphertext.
				* @property {WordArray} iv The IV used in the ciphering operation.
				* @property {WordArray} salt The salt used with a key derivation function.
				* @property {Cipher} algorithm The cipher algorithm.
				* @property {Mode} mode The block mode used in the ciphering operation.
				* @property {Padding} padding The padding scheme used in the ciphering operation.
				* @property {number} blockSize The block size of the cipher.
				* @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
				*/
				var CipherParams = C_lib.CipherParams = Base.extend({
					/**
					* Initializes a newly created cipher params object.
					*
					* @param {Object} cipherParams An object with any of the possible cipher parameters.
					*
					* @example
					*
					*     var cipherParams = CryptoJS.lib.CipherParams.create({
					*         ciphertext: ciphertextWordArray,
					*         key: keyWordArray,
					*         iv: ivWordArray,
					*         salt: saltWordArray,
					*         algorithm: CryptoJS.algo.AES,
					*         mode: CryptoJS.mode.CBC,
					*         padding: CryptoJS.pad.PKCS7,
					*         blockSize: 4,
					*         formatter: CryptoJS.format.OpenSSL
					*     });
					*/
					init: function(cipherParams) {
						this.mixIn(cipherParams);
					},
					/**
					* Converts this cipher params object to a string.
					*
					* @param {Format} formatter (Optional) The formatting strategy to use.
					*
					* @return {string} The stringified cipher params.
					*
					* @throws Error If neither the formatter nor the default formatter is set.
					*
					* @example
					*
					*     var string = cipherParams + '';
					*     var string = cipherParams.toString();
					*     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
					*/
					toString: function(formatter) {
						return (formatter || this.formatter).stringify(this);
					}
				});
				/**
				* Format namespace.
				*/
				var C_format = C.format = {};
				/**
				* OpenSSL formatting strategy.
				*/
				var OpenSSLFormatter = C_format.OpenSSL = {
					/**
					* Converts a cipher params object to an OpenSSL-compatible string.
					*
					* @param {CipherParams} cipherParams The cipher params object.
					*
					* @return {string} The OpenSSL-compatible string.
					*
					* @static
					*
					* @example
					*
					*     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
					*/
					stringify: function(cipherParams) {
						var wordArray;
						var ciphertext = cipherParams.ciphertext;
						var salt = cipherParams.salt;
						if (salt) wordArray = WordArray.create([1398893684, 1701076831]).concat(salt).concat(ciphertext);
						else wordArray = ciphertext;
						return wordArray.toString(Base64);
					},
					/**
					* Converts an OpenSSL-compatible string to a cipher params object.
					*
					* @param {string} openSSLStr The OpenSSL-compatible string.
					*
					* @return {CipherParams} The cipher params object.
					*
					* @static
					*
					* @example
					*
					*     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
					*/
					parse: function(openSSLStr) {
						var salt;
						var ciphertext = Base64.parse(openSSLStr);
						var ciphertextWords = ciphertext.words;
						if (ciphertextWords[0] == 1398893684 && ciphertextWords[1] == 1701076831) {
							salt = WordArray.create(ciphertextWords.slice(2, 4));
							ciphertextWords.splice(0, 4);
							ciphertext.sigBytes -= 16;
						}
						return CipherParams.create({
							ciphertext,
							salt
						});
					}
				};
				/**
				* A cipher wrapper that returns ciphertext as a serializable cipher params object.
				*/
				var SerializableCipher = C_lib.SerializableCipher = Base.extend({
					/**
					* Configuration options.
					*
					* @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
					*/
					cfg: Base.extend({ format: OpenSSLFormatter }),
					/**
					* Encrypts a message.
					*
					* @param {Cipher} cipher The cipher algorithm to use.
					* @param {WordArray|string} message The message to encrypt.
					* @param {WordArray} key The key.
					* @param {Object} cfg (Optional) The configuration options to use for this operation.
					*
					* @return {CipherParams} A cipher params object.
					*
					* @static
					*
					* @example
					*
					*     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
					*     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
					*     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
					*/
					encrypt: function(cipher, message, key, cfg) {
						cfg = this.cfg.extend(cfg);
						var encryptor = cipher.createEncryptor(key, cfg);
						var ciphertext = encryptor.finalize(message);
						var cipherCfg = encryptor.cfg;
						return CipherParams.create({
							ciphertext,
							key,
							iv: cipherCfg.iv,
							algorithm: cipher,
							mode: cipherCfg.mode,
							padding: cipherCfg.padding,
							blockSize: cipher.blockSize,
							formatter: cfg.format
						});
					},
					/**
					* Decrypts serialized ciphertext.
					*
					* @param {Cipher} cipher The cipher algorithm to use.
					* @param {CipherParams|string} ciphertext The ciphertext to decrypt.
					* @param {WordArray} key The key.
					* @param {Object} cfg (Optional) The configuration options to use for this operation.
					*
					* @return {WordArray} The plaintext.
					*
					* @static
					*
					* @example
					*
					*     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
					*     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
					*/
					decrypt: function(cipher, ciphertext, key, cfg) {
						cfg = this.cfg.extend(cfg);
						ciphertext = this._parse(ciphertext, cfg.format);
						return cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);
					},
					/**
					* Converts serialized ciphertext to CipherParams,
					* else assumed CipherParams already and returns ciphertext unchanged.
					*
					* @param {CipherParams|string} ciphertext The ciphertext.
					* @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
					*
					* @return {CipherParams} The unserialized ciphertext.
					*
					* @static
					*
					* @example
					*
					*     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
					*/
					_parse: function(ciphertext, format) {
						if (typeof ciphertext == "string") return format.parse(ciphertext, this);
						else return ciphertext;
					}
				});
				/**
				* Key derivation function namespace.
				*/
				var C_kdf = C.kdf = {};
				/**
				* OpenSSL key derivation function.
				*/
				var OpenSSLKdf = C_kdf.OpenSSL = { 
				/**
				* Derives a key and IV from a password.
				*
				* @param {string} password The password to derive from.
				* @param {number} keySize The size in words of the key to generate.
				* @param {number} ivSize The size in words of the IV to generate.
				* @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
				*
				* @return {CipherParams} A cipher params object with the key, IV, and salt.
				*
				* @static
				*
				* @example
				*
				*     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
				*     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
				*/
execute: function(password, keySize, ivSize, salt, hasher) {
					if (!salt) salt = WordArray.random(8);
					if (!hasher) var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);
					else var key = EvpKDF.create({
						keySize: keySize + ivSize,
						hasher
					}).compute(password, salt);
					var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
					key.sigBytes = keySize * 4;
					return CipherParams.create({
						key,
						iv,
						salt
					});
				} };
				/**
				* A serializable cipher wrapper that derives the key from a password,
				* and returns ciphertext as a serializable cipher params object.
				*/
				var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
					/**
					* Configuration options.
					*
					* @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
					*/
					cfg: SerializableCipher.cfg.extend({ kdf: OpenSSLKdf }),
					/**
					* Encrypts a message using a password.
					*
					* @param {Cipher} cipher The cipher algorithm to use.
					* @param {WordArray|string} message The message to encrypt.
					* @param {string} password The password.
					* @param {Object} cfg (Optional) The configuration options to use for this operation.
					*
					* @return {CipherParams} A cipher params object.
					*
					* @static
					*
					* @example
					*
					*     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
					*     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
					*/
					encrypt: function(cipher, message, password, cfg) {
						cfg = this.cfg.extend(cfg);
						var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, cfg.salt, cfg.hasher);
						cfg.iv = derivedParams.iv;
						var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);
						ciphertext.mixIn(derivedParams);
						return ciphertext;
					},
					/**
					* Decrypts serialized ciphertext using a password.
					*
					* @param {Cipher} cipher The cipher algorithm to use.
					* @param {CipherParams|string} ciphertext The ciphertext to decrypt.
					* @param {string} password The password.
					* @param {Object} cfg (Optional) The configuration options to use for this operation.
					*
					* @return {WordArray} The plaintext.
					*
					* @static
					*
					* @example
					*
					*     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
					*     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
					*/
					decrypt: function(cipher, ciphertext, password, cfg) {
						cfg = this.cfg.extend(cfg);
						ciphertext = this._parse(ciphertext, cfg.format);
						var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt, cfg.hasher);
						cfg.iv = derivedParams.iv;
						return SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);
					}
				});
			}();
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/aes.js
	var require_aes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory, undef) {
			if (typeof exports === "object") module.exports = exports = factory(require_core(), require_enc_base64(), require_md5(), require_evpkdf(), require_cipher_core());
			else if (typeof define === "function" && define.amd) define([
				"./core",
				"./enc-base64",
				"./md5",
				"./evpkdf",
				"./cipher-core"
			], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			(function() {
				var C = CryptoJS;
				var BlockCipher = C.lib.BlockCipher;
				var C_algo = C.algo;
				var SBOX = [];
				var INV_SBOX = [];
				var SUB_MIX_0 = [];
				var SUB_MIX_1 = [];
				var SUB_MIX_2 = [];
				var SUB_MIX_3 = [];
				var INV_SUB_MIX_0 = [];
				var INV_SUB_MIX_1 = [];
				var INV_SUB_MIX_2 = [];
				var INV_SUB_MIX_3 = [];
				(function() {
					var d = [];
					for (var i = 0; i < 256; i++) if (i < 128) d[i] = i << 1;
					else d[i] = i << 1 ^ 283;
					var x = 0;
					var xi = 0;
					for (var i = 0; i < 256; i++) {
						var sx = xi ^ xi << 1 ^ xi << 2 ^ xi << 3 ^ xi << 4;
						sx = sx >>> 8 ^ sx & 255 ^ 99;
						SBOX[x] = sx;
						INV_SBOX[sx] = x;
						var x2 = d[x];
						var x4 = d[x2];
						var x8 = d[x4];
						var t = d[sx] * 257 ^ sx * 16843008;
						SUB_MIX_0[x] = t << 24 | t >>> 8;
						SUB_MIX_1[x] = t << 16 | t >>> 16;
						SUB_MIX_2[x] = t << 8 | t >>> 24;
						SUB_MIX_3[x] = t;
						var t = x8 * 16843009 ^ x4 * 65537 ^ x2 * 257 ^ x * 16843008;
						INV_SUB_MIX_0[sx] = t << 24 | t >>> 8;
						INV_SUB_MIX_1[sx] = t << 16 | t >>> 16;
						INV_SUB_MIX_2[sx] = t << 8 | t >>> 24;
						INV_SUB_MIX_3[sx] = t;
						if (!x) x = xi = 1;
						else {
							x = x2 ^ d[d[d[x8 ^ x2]]];
							xi ^= d[d[xi]];
						}
					}
				})();
				var RCON = [
					0,
					1,
					2,
					4,
					8,
					16,
					32,
					64,
					128,
					27,
					54
				];
				/**
				* AES block cipher algorithm.
				*/
				var AES = C_algo.AES = BlockCipher.extend({
					_doReset: function() {
						var t;
						if (this._nRounds && this._keyPriorReset === this._key) return;
						var key = this._keyPriorReset = this._key;
						var keyWords = key.words;
						var keySize = key.sigBytes / 4;
						var ksRows = ((this._nRounds = keySize + 6) + 1) * 4;
						var keySchedule = this._keySchedule = [];
						for (var ksRow = 0; ksRow < ksRows; ksRow++) if (ksRow < keySize) keySchedule[ksRow] = keyWords[ksRow];
						else {
							t = keySchedule[ksRow - 1];
							if (!(ksRow % keySize)) {
								t = t << 8 | t >>> 24;
								t = SBOX[t >>> 24] << 24 | SBOX[t >>> 16 & 255] << 16 | SBOX[t >>> 8 & 255] << 8 | SBOX[t & 255];
								t ^= RCON[ksRow / keySize | 0] << 24;
							} else if (keySize > 6 && ksRow % keySize == 4) t = SBOX[t >>> 24] << 24 | SBOX[t >>> 16 & 255] << 16 | SBOX[t >>> 8 & 255] << 8 | SBOX[t & 255];
							keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
						}
						var invKeySchedule = this._invKeySchedule = [];
						for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
							var ksRow = ksRows - invKsRow;
							if (invKsRow % 4) var t = keySchedule[ksRow];
							else var t = keySchedule[ksRow - 4];
							if (invKsRow < 4 || ksRow <= 4) invKeySchedule[invKsRow] = t;
							else invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[t >>> 16 & 255]] ^ INV_SUB_MIX_2[SBOX[t >>> 8 & 255]] ^ INV_SUB_MIX_3[SBOX[t & 255]];
						}
					},
					encryptBlock: function(M, offset) {
						this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
					},
					decryptBlock: function(M, offset) {
						var t = M[offset + 1];
						M[offset + 1] = M[offset + 3];
						M[offset + 3] = t;
						this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);
						var t = M[offset + 1];
						M[offset + 1] = M[offset + 3];
						M[offset + 3] = t;
					},
					_doCryptBlock: function(M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
						var nRounds = this._nRounds;
						var s0 = M[offset] ^ keySchedule[0];
						var s1 = M[offset + 1] ^ keySchedule[1];
						var s2 = M[offset + 2] ^ keySchedule[2];
						var s3 = M[offset + 3] ^ keySchedule[3];
						var ksRow = 4;
						for (var round = 1; round < nRounds; round++) {
							var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[s1 >>> 16 & 255] ^ SUB_MIX_2[s2 >>> 8 & 255] ^ SUB_MIX_3[s3 & 255] ^ keySchedule[ksRow++];
							var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[s2 >>> 16 & 255] ^ SUB_MIX_2[s3 >>> 8 & 255] ^ SUB_MIX_3[s0 & 255] ^ keySchedule[ksRow++];
							var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[s3 >>> 16 & 255] ^ SUB_MIX_2[s0 >>> 8 & 255] ^ SUB_MIX_3[s1 & 255] ^ keySchedule[ksRow++];
							var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[s0 >>> 16 & 255] ^ SUB_MIX_2[s1 >>> 8 & 255] ^ SUB_MIX_3[s2 & 255] ^ keySchedule[ksRow++];
							s0 = t0;
							s1 = t1;
							s2 = t2;
							s3 = t3;
						}
						var t0 = (SBOX[s0 >>> 24] << 24 | SBOX[s1 >>> 16 & 255] << 16 | SBOX[s2 >>> 8 & 255] << 8 | SBOX[s3 & 255]) ^ keySchedule[ksRow++];
						var t1 = (SBOX[s1 >>> 24] << 24 | SBOX[s2 >>> 16 & 255] << 16 | SBOX[s3 >>> 8 & 255] << 8 | SBOX[s0 & 255]) ^ keySchedule[ksRow++];
						var t2 = (SBOX[s2 >>> 24] << 24 | SBOX[s3 >>> 16 & 255] << 16 | SBOX[s0 >>> 8 & 255] << 8 | SBOX[s1 & 255]) ^ keySchedule[ksRow++];
						var t3 = (SBOX[s3 >>> 24] << 24 | SBOX[s0 >>> 16 & 255] << 16 | SBOX[s1 >>> 8 & 255] << 8 | SBOX[s2 & 255]) ^ keySchedule[ksRow++];
						M[offset] = t0;
						M[offset + 1] = t1;
						M[offset + 2] = t2;
						M[offset + 3] = t3;
					},
					keySize: 8
				});
				/**
				* Shortcut functions to the cipher's object interface.
				*
				* @example
				*
				*     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
				*     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
				*/
				C.AES = BlockCipher._createHelper(AES);
			})();
			return CryptoJS.AES;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/enc-hex.js
	var require_enc_hex = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory) {
			if (typeof exports === "object") module.exports = exports = factory(require_core());
			else if (typeof define === "function" && define.amd) define(["./core"], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			return CryptoJS.enc.Hex;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/mode-ecb.js
	var require_mode_ecb = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory, undef) {
			if (typeof exports === "object") module.exports = exports = factory(require_core(), require_cipher_core());
			else if (typeof define === "function" && define.amd) define(["./core", "./cipher-core"], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			/**
			* Electronic Codebook block mode.
			*/
			CryptoJS.mode.ECB = function() {
				var ECB = CryptoJS.lib.BlockCipherMode.extend();
				ECB.Encryptor = ECB.extend({ processBlock: function(words, offset) {
					this._cipher.encryptBlock(words, offset);
				} });
				ECB.Decryptor = ECB.extend({ processBlock: function(words, offset) {
					this._cipher.decryptBlock(words, offset);
				} });
				return ECB;
			}();
			return CryptoJS.mode.ECB;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/pad-pkcs7.js
	var require_pad_pkcs7 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory, undef) {
			if (typeof exports === "object") module.exports = exports = factory(require_core(), require_cipher_core());
			else if (typeof define === "function" && define.amd) define(["./core", "./cipher-core"], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			return CryptoJS.pad.Pkcs7;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/lib-typedarrays.js
	var require_lib_typedarrays = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory) {
			if (typeof exports === "object") module.exports = exports = factory(require_core());
			else if (typeof define === "function" && define.amd) define(["./core"], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			(function() {
				if (typeof ArrayBuffer != "function") return;
				var WordArray = CryptoJS.lib.WordArray;
				var superInit = WordArray.init;
				var subInit = WordArray.init = function(typedArray) {
					if (typedArray instanceof ArrayBuffer) typedArray = new Uint8Array(typedArray);
					if (typedArray instanceof Int8Array || typeof Uint8ClampedArray !== "undefined" && typedArray instanceof Uint8ClampedArray || typedArray instanceof Int16Array || typedArray instanceof Uint16Array || typedArray instanceof Int32Array || typedArray instanceof Uint32Array || typedArray instanceof Float32Array || typedArray instanceof Float64Array) typedArray = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
					if (typedArray instanceof Uint8Array) {
						var typedArrayByteLength = typedArray.byteLength;
						var words = [];
						for (var i = 0; i < typedArrayByteLength; i++) words[i >>> 2] |= typedArray[i] << 24 - i % 4 * 8;
						superInit.call(this, words, typedArrayByteLength);
					} else superInit.apply(this, arguments);
				};
				subInit.prototype = WordArray;
			})();
			return CryptoJS.lib.WordArray;
		});
	}));
	//#endregion
	//#region backend/shims/crypto.ts
	var crypto_exports = /* @__PURE__ */ __exportAll({
		constants: () => constants,
		createCipheriv: () => createCipheriv,
		createDecipheriv: () => createDecipheriv,
		createHash: () => createHash,
		default: () => crypto_default,
		publicEncrypt: () => publicEncrypt,
		randomBytes: () => randomBytes
	});
	var import_md5, import_sha1, import_aes, import_core, import_enc_hex, import_mode_ecb, import_pad_pkcs7, import_lib_typedarrays, import_buffer, bufferToWordArray, wordArrayToBuffer, createHash, aesOptions, createCipheriv, createDecipheriv, randomBytes, constants, RSA_E, publicEncrypt, crypto_default;
	var init_crypto = __esmMin((() => {
		import_md5 = /* @__PURE__ */ __toESM(require_md5(), 1);
		import_sha1 = /* @__PURE__ */ __toESM(require_sha1(), 1);
		import_aes = /* @__PURE__ */ __toESM(require_aes(), 1);
		import_core = /* @__PURE__ */ __toESM(require_core(), 1);
		import_enc_hex = /* @__PURE__ */ __toESM(require_enc_hex(), 1);
		import_mode_ecb = /* @__PURE__ */ __toESM(require_mode_ecb(), 1);
		import_pad_pkcs7 = /* @__PURE__ */ __toESM(require_pad_pkcs7(), 1);
		import_lib_typedarrays = /* @__PURE__ */ __toESM(require_lib_typedarrays(), 1);
		import_buffer = require_buffer();
		bufferToWordArray = (buffer) => import_lib_typedarrays.default.create(new Uint8Array(buffer));
		wordArrayToBuffer = (wordArray) => import_buffer.Buffer.from(wordArray.toString(import_enc_hex.default), "hex");
		createHash = (algorithm) => {
			const chunks = [];
			return {
				update(input) {
					chunks.push(typeof input === "string" ? import_buffer.Buffer.from(input) : import_buffer.Buffer.from(input));
					return this;
				},
				digest(_encoding = "hex") {
					if (algorithm.toLowerCase() === "md5") return (0, import_md5.default)(bufferToWordArray(import_buffer.Buffer.concat(chunks))).toString();
					if (algorithm.toLowerCase() === "sha1") return (0, import_sha1.default)(bufferToWordArray(import_buffer.Buffer.concat(chunks))).toString();
					throw new Error(`crypto.createHash(${algorithm}) is not implemented`);
				}
			};
		};
		aesOptions = (algorithm, iv) => ({
			mode: algorithm.includes("ecb") ? import_mode_ecb.default : import_core.default.mode.CBC,
			padding: import_pad_pkcs7.default,
			iv: typeof iv === "string" ? void 0 : bufferToWordArray(typeof iv === "string" ? import_buffer.Buffer.from(iv) : iv)
		});
		createCipheriv = (algorithm, key, iv) => {
			const chunks = [];
			return {
				update(input) {
					chunks.push(import_buffer.Buffer.from(input));
					return import_buffer.Buffer.alloc(0);
				},
				final() {
					const data = import_buffer.Buffer.concat(chunks);
					const keyBuf = typeof key === "string" ? import_buffer.Buffer.from(key) : key;
					const encrypted = import_aes.default.encrypt(bufferToWordArray(data), bufferToWordArray(keyBuf), aesOptions(algorithm, iv));
					return wordArrayToBuffer(encrypted.ciphertext);
				}
			};
		};
		createDecipheriv = (algorithm, key, iv) => {
			const chunks = [];
			return {
				update(input) {
					chunks.push(import_buffer.Buffer.from(input));
					return import_buffer.Buffer.alloc(0);
				},
				final() {
					const data = import_buffer.Buffer.concat(chunks);
					const keyBuf = typeof key === "string" ? import_buffer.Buffer.from(key) : key;
					const decrypted = import_aes.default.decrypt({ ciphertext: bufferToWordArray(data) }, bufferToWordArray(keyBuf), aesOptions(algorithm, iv));
					return wordArrayToBuffer(decrypted);
				}
			};
		};
		randomBytes = (size) => {
			const data = new Uint8Array(size);
			globalThis.crypto?.getRandomValues(data);
			return import_buffer.Buffer.from(data);
		};
		constants = { RSA_NO_PADDING: 3 };
		RSA_E = 65537n;
		publicEncrypt = ({ key: _key, padding: _padding }, buffer) => {
			const n = BigInt("0xe0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7");
			const e = RSA_E;
			const padded = import_buffer.Buffer.alloc(128);
			buffer.copy(padded, 128 - buffer.length);
			let base = BigInt("0x" + padded.toString("hex")) % n, power = e, c = 1n;
			while (power > 0n) {
				if (power & 1n) c = c * base % n;
				base = base * base % n;
				power >>= 1n;
			}
			const cHex = c.toString(16).padStart(256, "0");
			return import_buffer.Buffer.from(cHex, "hex");
		};
		crypto_default = {
			createHash,
			createCipheriv,
			createDecipheriv,
			randomBytes,
			publicEncrypt,
			constants
		};
	}));
	//#endregion
	//#region backend/musicSdk/utils.js
	init_crypto();
	var decodeName$2 = (str = "") => {
		if (!str) return "";
		try {
			return new window.DOMParser().parseFromString(str, "text/html").body.textContent || "";
		} catch {
			return str;
		}
	};
	var toMD5 = (str) => crypto_default.createHash("md5").update(str).digest("hex");
	/**
	* 格式化歌手
	* @param singers 歌手数组
	* @param nameKey 歌手名键值
	* @param join 歌手分割字符
	*/
	var formatSingerName = (singers, nameKey = "name", join = "、") => {
		if (Array.isArray(singers)) {
			const singer = [];
			singers.forEach((item) => {
				let name = item[nameKey];
				if (!name) return;
				singer.push(name);
			});
			return decodeName$2(singer.join(join));
		}
		return decodeName$2(String(singers ?? ""));
	};
	//#endregion
	//#region backend/index.ts
	var decodeName$1 = (str = "") => {
		if (!str) return "";
		try {
			return new window.DOMParser().parseFromString(str, "text/html").body.textContent || "";
		} catch (_) {
			return str;
		}
	};
	var formatPlayCount = (num) => {
		if (num > 1e8) return `${Math.trunc(num / 1e7) / 10}亿`;
		if (num > 1e4) return `${Math.trunc(num / 1e3) / 10}万`;
		return String(num);
	};
	var dateFormat2 = (time) => {
		const differ = Math.trunc((Date.now() - time) / 1e3);
		if (differ < 60) return `${differ} 秒前`;
		if (differ < 3600) return `${Math.trunc(differ / 60)} 分钟前`;
		if (differ < 86400) return `${Math.trunc(differ / 3600)} 小时前`;
		return new Date(time).toLocaleDateString();
	};
	//#endregion
	//#region backend/musicSdk/kw/util.js
	init_crypto();
	var objStr2JSON = (str) => {
		return JSON.parse(str.replace(/('(?=(,\s*')))|('(?=:))|((?<=([:,]\s*))')|((?<={)')|('(?=}))/g, "\""));
	};
	var formatSinger = (rawData) => rawData.replace(/&/g, "、");
	var decodeLyric$2 = (base64Data) => rendererInvoke(WIN_MAIN_RENDERER_EVENT_NAME.handle_kw_decode_lyric, base64Data);
	var lrcTools = {
		rxps: {
			wordLine: /^(\[\d{1,2}:.*\d{1,4}\])\s*(\S+(?:\s+\S+)*)?\s*/,
			tagLine: /\[(ver|ti|ar|al|offset|by|kuwo):\s*(\S+(?:\s+\S+)*)\s*\]/,
			wordTimeAll: /<(-?\d+),(-?\d+)(?:,-?\d+)?>/g,
			wordTime: /<(-?\d+),(-?\d+)(?:,-?\d+)?>/
		},
		offset: 1,
		offset2: 1,
		isOK: false,
		lines: [],
		tags: [],
		getWordInfo(str, str2, prevWord) {
			const offset = parseInt(str);
			const offset2 = parseInt(str2);
			let startTime = Math.abs((offset + offset2) / (this.offset * 2));
			let endTime = Math.abs((offset - offset2) / (this.offset2 * 2)) + startTime;
			if (prevWord) {
				if (startTime < prevWord.endTime) {
					prevWord.endTime = startTime;
					if (prevWord.startTime > prevWord.endTime) prevWord.startTime = prevWord.endTime;
					prevWord.newTimeStr = `<${prevWord.startTime},${prevWord.endTime - prevWord.startTime}>`;
				}
			}
			return {
				startTime,
				endTime,
				timeStr: `<${startTime},${endTime - startTime}>`
			};
		},
		parseLine(line) {
			if (line.length < 6) return;
			let result = this.rxps.wordLine.exec(line);
			if (result) {
				const time = result[1];
				let words = result[2];
				if (words == null) words = "";
				const wordTimes = words.match(this.rxps.wordTimeAll);
				if (!wordTimes) return;
				let preTimeInfo;
				for (const timeStr of wordTimes) {
					const result = this.rxps.wordTime.exec(timeStr);
					const wordInfo = this.getWordInfo(result[1], result[2], preTimeInfo);
					words = words.replace(timeStr, wordInfo.timeStr);
					if (preTimeInfo?.newTimeStr) words = words.replace(preTimeInfo.timeStr, preTimeInfo.newTimeStr);
					preTimeInfo = wordInfo;
				}
				this.lines.push(time + words);
				return;
			}
			result = this.rxps.tagLine.exec(line);
			if (!result) return;
			if (result[1] == "kuwo") {
				let content = result[2];
				if (content != null && content.includes("][")) content = content.substring(0, content.indexOf("]["));
				const valueOf = parseInt(content, 8);
				this.offset = Math.trunc(valueOf / 10);
				this.offset2 = Math.trunc(valueOf % 10);
				if (this.offset == 0 || Number.isNaN(this.offset) || this.offset2 == 0 || Number.isNaN(this.offset2)) this.isOK = false;
			} else this.tags.push(line);
		},
		parse(lrc) {
			const lines = lrc.split(/\r\n|\r|\n/);
			const tools = Object.create(this);
			tools.isOK = true;
			tools.offset = 1;
			tools.offset2 = 1;
			tools.lines = [];
			tools.tags = [];
			for (const line of lines) {
				if (!tools.isOK) throw new Error("failed");
				tools.parseLine(line);
			}
			if (!tools.lines.length) return "";
			let lrcs = tools.lines.join("\n");
			if (tools.tags.length) lrcs = `${tools.tags.join("\n")}\n${lrcs}`;
			return lrcs;
		}
	};
	var createAesEncrypt = (buffer, mode, key, iv) => {
		const cipher = createCipheriv(mode, key, iv);
		return import_buffer$1.Buffer.concat([cipher.update(buffer), cipher.final()]);
	};
	var createAesDecrypt = (buffer, mode, key, iv) => {
		const cipher = createDecipheriv(mode, key, iv);
		return import_buffer$1.Buffer.concat([cipher.update(buffer), cipher.final()]);
	};
	var wbdCrypto = {
		aesMode: "aes-128-ecb",
		aesKey: import_buffer$1.Buffer.from([
			112,
			87,
			39,
			61,
			199,
			250,
			41,
			191,
			57,
			68,
			45,
			114,
			221,
			94,
			140,
			228
		], "binary"),
		aesIv: "",
		appId: "y67sprxhhpws",
		decodeData(base64Result) {
			const data = import_buffer$1.Buffer.from(decodeURIComponent(base64Result), "base64");
			return JSON.parse(createAesDecrypt(data, this.aesMode, this.aesKey, this.aesIv).toString());
		},
		createSign(data, time) {
			return toMD5(`${this.appId}${data}${time}`).toUpperCase();
		},
		buildParam(jsonData) {
			const data = import_buffer$1.Buffer.from(JSON.stringify(jsonData));
			const time = Date.now();
			const encodeData = createAesEncrypt(data, this.aesMode, this.aesKey, this.aesIv).toString("base64");
			const sign = this.createSign(encodeData, time);
			return `data=${encodeURIComponent(encodeData)}&time=${time}&appId=${this.appId}&sign=${sign}`;
		}
	};
	//#endregion
	//#region backend/musicSdk/kw/musicSearch.js
	var musicSearch_default$5 = {
		regExps: { mInfo: /level:(\w+),bitrate:(\d+),format:(\w+),size:([\w.]+)/ },
		limit: 30,
		total: 0,
		page: 0,
		allPage: 1,
		musicSearch(str, page, limit) {
			return httpFetch$1(`http://search.kuwo.cn/r.s?client=kt&all=${encodeURIComponent(str)}&pn=${page - 1}&rn=${limit}&uid=794762570&ver=kwplayer_ar_9.2.2.1&vipver=1&show_copyright_off=1&newver=1&ft=music&cluster=0&strategy=2012&encoding=utf8&rformat=json&vermerge=1&mobi=1&issubtitle=1`).promise;
		},
		handleResult(rawData) {
			const result = [];
			if (!rawData) return result;
			for (let i = 0; i < rawData.length; i++) {
				const info = rawData[i];
				let songId = info.MUSICRID.replace("MUSIC_", "");
				if (!info.N_MINFO) {
					console.log("N_MINFO is undefined");
					return null;
				}
				const types = [];
				const _types = {};
				let infoArr = info.N_MINFO.split(";");
				for (let info of infoArr) {
					info = info.match(this.regExps.mInfo);
					if (info) switch (info[2]) {
						case "4000":
							types.push({
								type: "flac24bit",
								size: info[4]
							});
							_types.flac24bit = { size: info[4].toLocaleUpperCase() };
							break;
						case "2000":
							types.push({
								type: "flac",
								size: info[4]
							});
							_types.flac = { size: info[4].toLocaleUpperCase() };
							break;
						case "320":
							types.push({
								type: "320k",
								size: info[4]
							});
							_types["320k"] = { size: info[4].toLocaleUpperCase() };
							break;
						case "128":
							types.push({
								type: "128k",
								size: info[4]
							});
							_types["128k"] = { size: info[4].toLocaleUpperCase() };
					}
				}
				types.reverse();
				let interval = parseInt(info.DURATION);
				result.push({
					name: decodeName$1(info.SONGNAME),
					singer: formatSinger(decodeName$1(info.ARTIST)),
					source: "kw",
					songmid: songId,
					albumId: decodeName$1(info.ALBUMID || ""),
					interval: Number.isNaN(interval) ? 0 : formatPlayTime(interval),
					albumName: info.ALBUM ? decodeName$1(info.ALBUM) : "",
					lrc: null,
					img: null,
					otherSource: null,
					types,
					_types,
					typeUrl: {}
				});
			}
			return result;
		},
		search(str, page = 1, limit, retryNum = 0) {
			if (retryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
			if (limit == null) limit = this.limit;
			return this.musicSearch(str, page, limit).then(({ body: result }) => {
				if (!result || result.TOTAL !== "0" && result.SHOW === "0") return this.search(str, page, limit, ++retryNum);
				let list = this.handleResult(result.abslist);
				if (list == null) return this.search(str, page, limit, ++retryNum);
				this.total = parseInt(result.TOTAL);
				this.page = page;
				this.allPage = Math.ceil(this.total / limit);
				return Promise.resolve({
					list,
					allPage: this.allPage,
					total: this.total,
					limit,
					source: "kw"
				});
			});
		}
	};
	//#endregion
	//#region backend/musicSdk/kw/leaderboard.js
	var boardList$4 = [
		{
			id: "kw__93",
			name: "飙升榜",
			bangid: "93"
		},
		{
			id: "kw__17",
			name: "新歌榜",
			bangid: "17"
		},
		{
			id: "kw__16",
			name: "热歌榜",
			bangid: "16"
		},
		{
			id: "kw__158",
			name: "抖音热歌榜",
			bangid: "158"
		},
		{
			id: "kw__292",
			name: "铃声榜",
			bangid: "292"
		},
		{
			id: "kw__284",
			name: "热评榜",
			bangid: "284"
		},
		{
			id: "kw__290",
			name: "ACG新歌榜",
			bangid: "290"
		},
		{
			id: "kw__286",
			name: "台湾KKBOX榜",
			bangid: "286"
		},
		{
			id: "kw__279",
			name: "冬日暖心榜",
			bangid: "279"
		},
		{
			id: "kw__281",
			name: "巴士随身听榜",
			bangid: "281"
		},
		{
			id: "kw__255",
			name: "KTV点唱榜",
			bangid: "255"
		},
		{
			id: "kw__280",
			name: "家务进行曲榜",
			bangid: "280"
		},
		{
			id: "kw__282",
			name: "熬夜修仙榜",
			bangid: "282"
		},
		{
			id: "kw__283",
			name: "枕边轻音乐榜",
			bangid: "283"
		},
		{
			id: "kw__278",
			name: "古风音乐榜",
			bangid: "278"
		},
		{
			id: "kw__264",
			name: "Vlog音乐榜",
			bangid: "264"
		},
		{
			id: "kw__242",
			name: "电音榜",
			bangid: "242"
		},
		{
			id: "kw__187",
			name: "流行趋势榜",
			bangid: "187"
		},
		{
			id: "kw__204",
			name: "现场音乐榜",
			bangid: "204"
		},
		{
			id: "kw__186",
			name: "ACG神曲榜",
			bangid: "186"
		},
		{
			id: "kw__185",
			name: "最强翻唱榜",
			bangid: "185"
		},
		{
			id: "kw__26",
			name: "经典怀旧榜",
			bangid: "26"
		},
		{
			id: "kw__104",
			name: "华语榜",
			bangid: "104"
		},
		{
			id: "kw__182",
			name: "粤语榜",
			bangid: "182"
		},
		{
			id: "kw__22",
			name: "欧美榜",
			bangid: "22"
		},
		{
			id: "kw__184",
			name: "韩语榜",
			bangid: "184"
		},
		{
			id: "kw__183",
			name: "日语榜",
			bangid: "183"
		},
		{
			id: "kw__145",
			name: "会员畅听榜",
			bangid: "145"
		},
		{
			id: "kw__153",
			name: "网红新歌榜",
			bangid: "153"
		},
		{
			id: "kw__64",
			name: "影视金曲榜",
			bangid: "64"
		},
		{
			id: "kw__176",
			name: "DJ嗨歌榜",
			bangid: "176"
		},
		{
			id: "kw__106",
			name: "真声音",
			bangid: "106"
		},
		{
			id: "kw__12",
			name: "Billboard榜",
			bangid: "12"
		},
		{
			id: "kw__49",
			name: "iTunes音乐榜",
			bangid: "49"
		},
		{
			id: "kw__180",
			name: "beatport电音榜",
			bangid: "180"
		},
		{
			id: "kw__13",
			name: "英国UK榜",
			bangid: "13"
		},
		{
			id: "kw__164",
			name: "百大DJ榜",
			bangid: "164"
		},
		{
			id: "kw__246",
			name: "YouTube音乐排行榜",
			bangid: "246"
		},
		{
			id: "kw__265",
			name: "韩国Genie榜",
			bangid: "265"
		},
		{
			id: "kw__14",
			name: "韩国M-net榜",
			bangid: "14"
		},
		{
			id: "kw__8",
			name: "香港电台榜",
			bangid: "8"
		},
		{
			id: "kw__15",
			name: "日本公信榜",
			bangid: "15"
		},
		{
			id: "kw__151",
			name: "腾讯音乐人原创榜",
			bangid: "151"
		}
	];
	var sortQualityArray = (array) => {
		const qualityMap = {
			flac24bit: 4,
			flac: 3,
			"320k": 2,
			"128k": 1
		};
		const rawQualityArray = [];
		const newQualityArray = [];
		array.forEach((item, index) => {
			const type = qualityMap[item.type];
			if (!type) return;
			rawQualityArray.push({
				type,
				index
			});
		});
		rawQualityArray.sort((a, b) => a.type - b.type);
		rawQualityArray.forEach((item) => {
			newQualityArray.push(array[item.index]);
		});
		return newQualityArray;
	};
	var leaderboard_default$5 = {
		list: [
			{
				id: "kwbiaosb",
				name: "飙升榜",
				bangid: 93
			},
			{
				id: "kwregb",
				name: "热歌榜",
				bangid: 16
			},
			{
				id: "kwhuiyb",
				name: "会员榜",
				bangid: 145
			},
			{
				id: "kwdouyb",
				name: "抖音榜",
				bangid: 158
			},
			{
				id: "kwqsb",
				name: "趋势榜",
				bangid: 187
			},
			{
				id: "kwhuaijb",
				name: "怀旧榜",
				bangid: 26
			},
			{
				id: "kwhuayb",
				name: "华语榜",
				bangid: 104
			},
			{
				id: "kwyueyb",
				name: "粤语榜",
				bangid: 182
			},
			{
				id: "kwoumb",
				name: "欧美榜",
				bangid: 22
			},
			{
				id: "kwhanyb",
				name: "韩语榜",
				bangid: 184
			},
			{
				id: "kwriyb",
				name: "日语榜",
				bangid: 183
			}
		],
		regExps: { mInfo: /level:(\w+),bitrate:(\d+),format:(\w+),size:([\w.]+)/ },
		limit: 100,
		_requestBoardsObj: null,
		getBoardsData() {
			if (this._requestBoardsObj) this._requestBoardsObj.cancelHttp();
			this._requestBoardsObj = httpFetch$1("http://qukudata.kuwo.cn/q.k?op=query&cont=tree&node=2&pn=0&rn=1000&fmt=json&level=2");
			return this._requestBoardsObj.promise;
		},
		getData(url) {
			return httpFetch$1(url).promise;
		},
		filterData(rawList) {
			return rawList.map((item) => {
				let types = [];
				const _types = {};
				const qualitys = /* @__PURE__ */ new Set();
				item.n_minfo.split(";").forEach((i) => {
					const info = i.match(this.regExps.mInfo);
					if (!info) return;
					const quality = info[2];
					const size = info[4].toLocaleUpperCase();
					if (qualitys.has(quality)) return;
					qualitys.add(quality);
					switch (quality) {
						case "4000":
							types.push({
								type: "flac24bit",
								size
							});
							_types.flac24bit = { size };
							break;
						case "2000":
							types.push({
								type: "flac",
								size
							});
							_types.flac = { size };
							break;
						case "320":
							types.push({
								type: "320k",
								size
							});
							_types["320k"] = { size };
							break;
						case "128":
							types.push({
								type: "128k",
								size
							});
							_types["128k"] = { size };
					}
				});
				types = sortQualityArray(types);
				return {
					singer: formatSinger(decodeName$1(item.artist)),
					name: decodeName$1(item.name),
					albumName: decodeName$1(item.album),
					albumId: item.albumId,
					songmid: item.id,
					source: "kw",
					interval: formatPlayTime(parseInt(item.duration)),
					img: item.pic,
					lrc: null,
					otherSource: null,
					types,
					_types,
					typeUrl: {}
				};
			});
		},
		filterBoardsData(rawList) {
			let list = [];
			for (const board of rawList) {
				if (board.source != "1") continue;
				list.push({
					id: "kw__" + board.sourceid,
					name: board.name,
					bangid: String(board.sourceid)
				});
			}
			return list;
		},
		async getBoards(retryNum = 0) {
			this.list = boardList$4;
			return {
				list: boardList$4,
				source: "kw"
			};
		},
		getList(id, page, retryNum = 0) {
			if (++retryNum > 3) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
			const requestBody = {
				uid: "",
				devId: "",
				sFrom: "kuwo_sdk",
				user_type: "AP",
				carSource: "kwplayercar_ar_6.0.1.0_apk_keluze.apk",
				id,
				pn: page - 1,
				rn: this.limit
			};
			return httpFetch$1(`https://wbd.kuwo.cn/api/bd/bang/bang_info?${wbdCrypto.buildParam(requestBody)}`).promise.then(({ statusCode, body }) => {
				const rawData = wbdCrypto.decodeData(body);
				const data = rawData.data;
				if (statusCode !== 200 || rawData.code != 200 || !data.musiclist) return this.getList(id, page, retryNum);
				return {
					total: parseInt(data.total),
					list: this.filterData(data.musiclist),
					limit: this.limit,
					page,
					source: "kw"
				};
			});
		}
	};
	//#endregion
	//#region backend/musicSdk/kw/lyric.js
	var buf_key = import_buffer$1.Buffer.from("yeelion");
	var buf_key_len = buf_key.length;
	var buildParams = (id, isGetLyricx) => {
		let params = `user=12345,web,web,web&requester=localhost&req=1&rid=MUSIC_${id}`;
		if (isGetLyricx) params += "&lrcx=1";
		const buf_str = import_buffer$1.Buffer.from(params);
		const buf_str_len = buf_str.length;
		const output = new Uint16Array(buf_str_len);
		let i = 0;
		while (i < buf_str_len) {
			let j = 0;
			while (j < buf_key_len && i < buf_str_len) {
				output[i] = buf_key[j] ^ buf_str[i];
				i++;
				j++;
			}
		}
		return import_buffer$1.Buffer.from(output).toString("base64");
	};
	var timeExp = /^\[([\d:.]*)\]{1}/g;
	var existTimeExp = /\[\d{1,2}:.*\d{1,4}\]/;
	var lyricxTag = /^<-?\d+,-?\d+>/;
	var lyric_default$4 = {
		sortLrcArr(arr) {
			const lrcSet = /* @__PURE__ */ new Set();
			let lrc = [];
			let lrcT = [];
			let isLyricx = false;
			for (const item of arr) {
				if (lrcSet.has(item.time)) {
					if (lrc.length < 2) continue;
					const tItem = lrc.pop();
					tItem.time = lrc[lrc.length - 1].time;
					lrcT.push(tItem);
					lrc.push(item);
				} else {
					lrc.push(item);
					lrcSet.add(item.time);
				}
				if (!isLyricx && lyricxTag.test(item.text)) isLyricx = true;
			}
			if (!isLyricx && lrcT.length > lrc.length * .3 && lrc.length - lrcT.length > 6) throw new Error("failed");
			return {
				lrc,
				lrcT
			};
		},
		transformLrc(tags, lrclist) {
			return `${tags.join("\n")}\n${lrclist ? lrclist.map((l) => `[${l.time}]${l.text}\n`).join("") : "暂无歌词"}`;
		},
		parseLrc(lrc) {
			const lines = lrc.split(/\r\n|\r|\n/);
			let tags = [];
			let lrcArr = [];
			for (let i = 0; i < lines.length; i++) {
				const line = lines[i].trim();
				if (timeExp.exec(line)) {
					const text = line.replace(timeExp, "").trim();
					let time = RegExp.$1;
					if (/\.\d\d$/.test(time)) time += "0";
					lrcArr.push({
						time,
						text
					});
				} else if (lrcTools.rxps.tagLine.test(line)) tags.push(line);
			}
			const lrcInfo = this.sortLrcArr(lrcArr);
			return {
				lyric: decodeName$1(this.transformLrc(tags, lrcInfo.lrc)),
				tlyric: lrcInfo.lrcT.length ? decodeName$1(this.transformLrc(tags, lrcInfo.lrcT)) : ""
			};
		},
		getLyric(musicInfo, isGetLyricx = true) {
			const requestObj = httpFetch$1(`http://newlyric.kuwo.cn/newlyric.lrc?${buildParams(musicInfo.songmid, isGetLyricx)}`);
			requestObj.promise = requestObj.promise.then(({ statusCode, body, raw }) => {
				if (statusCode != 200) return Promise.reject(new Error(JSON.stringify(body)));
				return decodeLyric$2({
					lrcBase64: raw.toString("base64"),
					isGetLyricx
				}).then((base64Data) => {
					let lrcInfo;
					try {
						lrcInfo = this.parseLrc(import_buffer$1.Buffer.from(base64Data, "base64").toString());
					} catch (err) {
						return Promise.reject(/* @__PURE__ */ new Error("Get lyric failed"));
					}
					if (lrcInfo.tlyric) lrcInfo.tlyric = lrcInfo.tlyric.replace(lrcTools.rxps.wordTimeAll, "");
					try {
						lrcInfo.lxlyric = lrcTools.parse(lrcInfo.lyric);
					} catch {
						lrcInfo.lxlyric = "";
					}
					lrcInfo.lyric = lrcInfo.lyric.replace(lrcTools.rxps.wordTimeAll, "");
					if (!existTimeExp.test(lrcInfo.lyric)) return Promise.reject(/* @__PURE__ */ new Error("Get lyric failed"));
					return lrcInfo;
				});
			});
			return requestObj;
		}
	};
	//#endregion
	//#region backend/musicSdk/kw/pic.js
	var pic_default$2 = { getPic({ songmid }) {
		const requestObj = httpFetch$1(`http://artistpicserver.kuwo.cn/pic.web?corp=kuwo&type=rid_pic&pictype=500&size=500&rid=${songmid}`);
		requestObj.promise = requestObj.promise.then(({ body }) => /^http/.test(body) ? body : null);
		return requestObj.promise;
	} };
	//#endregion
	//#region backend/musicSdk/api-source-info.ts
	var sources$1 = [];
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/x64-core.js
	var require_x64_core = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory) {
			if (typeof exports === "object") module.exports = exports = factory(require_core());
			else if (typeof define === "function" && define.amd) define(["./core"], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			(function(undefined) {
				var C = CryptoJS;
				var C_lib = C.lib;
				var Base = C_lib.Base;
				var X32WordArray = C_lib.WordArray;
				/**
				* x64 namespace.
				*/
				var C_x64 = C.x64 = {};
				C_x64.Word = Base.extend({ 
				/**
				* Initializes a newly created 64-bit word.
				*
				* @param {number} high The high 32 bits.
				* @param {number} low The low 32 bits.
				*
				* @example
				*
				*     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
				*/
init: function(high, low) {
					this.high = high;
					this.low = low;
				} });
				C_x64.WordArray = Base.extend({
					/**
					* Initializes a newly created word array.
					*
					* @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
					* @param {number} sigBytes (Optional) The number of significant bytes in the words.
					*
					* @example
					*
					*     var wordArray = CryptoJS.x64.WordArray.create();
					*
					*     var wordArray = CryptoJS.x64.WordArray.create([
					*         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
					*         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
					*     ]);
					*
					*     var wordArray = CryptoJS.x64.WordArray.create([
					*         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
					*         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
					*     ], 10);
					*/
					init: function(words, sigBytes) {
						words = this.words = words || [];
						if (sigBytes != undefined) this.sigBytes = sigBytes;
						else this.sigBytes = words.length * 8;
					},
					/**
					* Converts this 64-bit word array to a 32-bit word array.
					*
					* @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
					*
					* @example
					*
					*     var x32WordArray = x64WordArray.toX32();
					*/
					toX32: function() {
						var x64Words = this.words;
						var x64WordsLength = x64Words.length;
						var x32Words = [];
						for (var i = 0; i < x64WordsLength; i++) {
							var x64Word = x64Words[i];
							x32Words.push(x64Word.high);
							x32Words.push(x64Word.low);
						}
						return X32WordArray.create(x32Words, this.sigBytes);
					},
					/**
					* Creates a copy of this word array.
					*
					* @return {X64WordArray} The clone.
					*
					* @example
					*
					*     var clone = x64WordArray.clone();
					*/
					clone: function() {
						var clone = Base.clone.call(this);
						var words = clone.words = this.words.slice(0);
						var wordsLength = words.length;
						for (var i = 0; i < wordsLength; i++) words[i] = words[i].clone();
						return clone;
					}
				});
			})();
			return CryptoJS;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/enc-utf16.js
	var require_enc_utf16 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory) {
			if (typeof exports === "object") module.exports = exports = factory(require_core());
			else if (typeof define === "function" && define.amd) define(["./core"], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			(function() {
				var C = CryptoJS;
				var WordArray = C.lib.WordArray;
				var C_enc = C.enc;
				C_enc.Utf16 = C_enc.Utf16BE = {
					/**
					* Converts a word array to a UTF-16 BE string.
					*
					* @param {WordArray} wordArray The word array.
					*
					* @return {string} The UTF-16 BE string.
					*
					* @static
					*
					* @example
					*
					*     var utf16String = CryptoJS.enc.Utf16.stringify(wordArray);
					*/
					stringify: function(wordArray) {
						var words = wordArray.words;
						var sigBytes = wordArray.sigBytes;
						var utf16Chars = [];
						for (var i = 0; i < sigBytes; i += 2) {
							var codePoint = words[i >>> 2] >>> 16 - i % 4 * 8 & 65535;
							utf16Chars.push(String.fromCharCode(codePoint));
						}
						return utf16Chars.join("");
					},
					/**
					* Converts a UTF-16 BE string to a word array.
					*
					* @param {string} utf16Str The UTF-16 BE string.
					*
					* @return {WordArray} The word array.
					*
					* @static
					*
					* @example
					*
					*     var wordArray = CryptoJS.enc.Utf16.parse(utf16String);
					*/
					parse: function(utf16Str) {
						var utf16StrLength = utf16Str.length;
						var words = [];
						for (var i = 0; i < utf16StrLength; i++) words[i >>> 1] |= utf16Str.charCodeAt(i) << 16 - i % 2 * 16;
						return WordArray.create(words, utf16StrLength * 2);
					}
				};
				/**
				* UTF-16 LE encoding strategy.
				*/
				C_enc.Utf16LE = {
					/**
					* Converts a word array to a UTF-16 LE string.
					*
					* @param {WordArray} wordArray The word array.
					*
					* @return {string} The UTF-16 LE string.
					*
					* @static
					*
					* @example
					*
					*     var utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
					*/
					stringify: function(wordArray) {
						var words = wordArray.words;
						var sigBytes = wordArray.sigBytes;
						var utf16Chars = [];
						for (var i = 0; i < sigBytes; i += 2) {
							var codePoint = swapEndian(words[i >>> 2] >>> 16 - i % 4 * 8 & 65535);
							utf16Chars.push(String.fromCharCode(codePoint));
						}
						return utf16Chars.join("");
					},
					/**
					* Converts a UTF-16 LE string to a word array.
					*
					* @param {string} utf16Str The UTF-16 LE string.
					*
					* @return {WordArray} The word array.
					*
					* @static
					*
					* @example
					*
					*     var wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
					*/
					parse: function(utf16Str) {
						var utf16StrLength = utf16Str.length;
						var words = [];
						for (var i = 0; i < utf16StrLength; i++) words[i >>> 1] |= swapEndian(utf16Str.charCodeAt(i) << 16 - i % 2 * 16);
						return WordArray.create(words, utf16StrLength * 2);
					}
				};
				function swapEndian(word) {
					return word << 8 & 4278255360 | word >>> 8 & 16711935;
				}
			})();
			return CryptoJS.enc.Utf16;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/enc-base64url.js
	var require_enc_base64url = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory) {
			if (typeof exports === "object") module.exports = exports = factory(require_core());
			else if (typeof define === "function" && define.amd) define(["./core"], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			(function() {
				var C = CryptoJS;
				var WordArray = C.lib.WordArray;
				var C_enc = C.enc;
				C_enc.Base64url = {
					/**
					* Converts a word array to a Base64url string.
					*
					* @param {WordArray} wordArray The word array.
					*
					* @param {boolean} urlSafe Whether to use url safe
					*
					* @return {string} The Base64url string.
					*
					* @static
					*
					* @example
					*
					*     var base64String = CryptoJS.enc.Base64url.stringify(wordArray);
					*/
					stringify: function(wordArray, urlSafe) {
						if (urlSafe === void 0) urlSafe = true;
						var words = wordArray.words;
						var sigBytes = wordArray.sigBytes;
						var map = urlSafe ? this._safe_map : this._map;
						wordArray.clamp();
						var base64Chars = [];
						for (var i = 0; i < sigBytes; i += 3) {
							var byte1 = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
							var byte2 = words[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 255;
							var byte3 = words[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 255;
							var triplet = byte1 << 16 | byte2 << 8 | byte3;
							for (var j = 0; j < 4 && i + j * .75 < sigBytes; j++) base64Chars.push(map.charAt(triplet >>> 6 * (3 - j) & 63));
						}
						var paddingChar = map.charAt(64);
						if (paddingChar) while (base64Chars.length % 4) base64Chars.push(paddingChar);
						return base64Chars.join("");
					},
					/**
					* Converts a Base64url string to a word array.
					*
					* @param {string} base64Str The Base64url string.
					*
					* @param {boolean} urlSafe Whether to use url safe
					*
					* @return {WordArray} The word array.
					*
					* @static
					*
					* @example
					*
					*     var wordArray = CryptoJS.enc.Base64url.parse(base64String);
					*/
					parse: function(base64Str, urlSafe) {
						if (urlSafe === void 0) urlSafe = true;
						var base64StrLength = base64Str.length;
						var map = urlSafe ? this._safe_map : this._map;
						var reverseMap = this._reverseMap;
						if (!reverseMap) {
							reverseMap = this._reverseMap = [];
							for (var j = 0; j < map.length; j++) reverseMap[map.charCodeAt(j)] = j;
						}
						var paddingChar = map.charAt(64);
						if (paddingChar) {
							var paddingIndex = base64Str.indexOf(paddingChar);
							if (paddingIndex !== -1) base64StrLength = paddingIndex;
						}
						return parseLoop(base64Str, base64StrLength, reverseMap);
					},
					_map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
					_safe_map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
				};
				function parseLoop(base64Str, base64StrLength, reverseMap) {
					var words = [];
					var nBytes = 0;
					for (var i = 0; i < base64StrLength; i++) if (i % 4) {
						var bitsCombined = reverseMap[base64Str.charCodeAt(i - 1)] << i % 4 * 2 | reverseMap[base64Str.charCodeAt(i)] >>> 6 - i % 4 * 2;
						words[nBytes >>> 2] |= bitsCombined << 24 - nBytes % 4 * 8;
						nBytes++;
					}
					return WordArray.create(words, nBytes);
				}
			})();
			return CryptoJS.enc.Base64url;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/sha256.js
	var require_sha256 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory) {
			if (typeof exports === "object") module.exports = exports = factory(require_core());
			else if (typeof define === "function" && define.amd) define(["./core"], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			(function(Math) {
				var C = CryptoJS;
				var C_lib = C.lib;
				var WordArray = C_lib.WordArray;
				var Hasher = C_lib.Hasher;
				var C_algo = C.algo;
				var H = [];
				var K = [];
				(function() {
					function isPrime(n) {
						var sqrtN = Math.sqrt(n);
						for (var factor = 2; factor <= sqrtN; factor++) if (!(n % factor)) return false;
						return true;
					}
					function getFractionalBits(n) {
						return (n - (n | 0)) * 4294967296 | 0;
					}
					var n = 2;
					var nPrime = 0;
					while (nPrime < 64) {
						if (isPrime(n)) {
							if (nPrime < 8) H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
							K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));
							nPrime++;
						}
						n++;
					}
				})();
				var W = [];
				/**
				* SHA-256 hash algorithm.
				*/
				var SHA256 = C_algo.SHA256 = Hasher.extend({
					_doReset: function() {
						this._hash = new WordArray.init(H.slice(0));
					},
					_doProcessBlock: function(M, offset) {
						var H = this._hash.words;
						var a = H[0];
						var b = H[1];
						var c = H[2];
						var d = H[3];
						var e = H[4];
						var f = H[5];
						var g = H[6];
						var h = H[7];
						for (var i = 0; i < 64; i++) {
							if (i < 16) W[i] = M[offset + i] | 0;
							else {
								var gamma0x = W[i - 15];
								var gamma0 = (gamma0x << 25 | gamma0x >>> 7) ^ (gamma0x << 14 | gamma0x >>> 18) ^ gamma0x >>> 3;
								var gamma1x = W[i - 2];
								var gamma1 = (gamma1x << 15 | gamma1x >>> 17) ^ (gamma1x << 13 | gamma1x >>> 19) ^ gamma1x >>> 10;
								W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
							}
							var ch = e & f ^ ~e & g;
							var maj = a & b ^ a & c ^ b & c;
							var sigma0 = (a << 30 | a >>> 2) ^ (a << 19 | a >>> 13) ^ (a << 10 | a >>> 22);
							var sigma1 = (e << 26 | e >>> 6) ^ (e << 21 | e >>> 11) ^ (e << 7 | e >>> 25);
							var t1 = h + sigma1 + ch + K[i] + W[i];
							var t2 = sigma0 + maj;
							h = g;
							g = f;
							f = e;
							e = d + t1 | 0;
							d = c;
							c = b;
							b = a;
							a = t1 + t2 | 0;
						}
						H[0] = H[0] + a | 0;
						H[1] = H[1] + b | 0;
						H[2] = H[2] + c | 0;
						H[3] = H[3] + d | 0;
						H[4] = H[4] + e | 0;
						H[5] = H[5] + f | 0;
						H[6] = H[6] + g | 0;
						H[7] = H[7] + h | 0;
					},
					_doFinalize: function() {
						var data = this._data;
						var dataWords = data.words;
						var nBitsTotal = this._nDataBytes * 8;
						var nBitsLeft = data.sigBytes * 8;
						dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
						dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(nBitsTotal / 4294967296);
						dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
						data.sigBytes = dataWords.length * 4;
						this._process();
						return this._hash;
					},
					clone: function() {
						var clone = Hasher.clone.call(this);
						clone._hash = this._hash.clone();
						return clone;
					}
				});
				/**
				* Shortcut function to the hasher's object interface.
				*
				* @param {WordArray|string} message The message to hash.
				*
				* @return {WordArray} The hash.
				*
				* @static
				*
				* @example
				*
				*     var hash = CryptoJS.SHA256('message');
				*     var hash = CryptoJS.SHA256(wordArray);
				*/
				C.SHA256 = Hasher._createHelper(SHA256);
				/**
				* Shortcut function to the HMAC's object interface.
				*
				* @param {WordArray|string} message The message to hash.
				* @param {WordArray|string} key The secret key.
				*
				* @return {WordArray} The HMAC.
				*
				* @static
				*
				* @example
				*
				*     var hmac = CryptoJS.HmacSHA256(message, key);
				*/
				C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
			})(Math);
			return CryptoJS.SHA256;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/sha224.js
	var require_sha224 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory, undef) {
			if (typeof exports === "object") module.exports = exports = factory(require_core(), require_sha256());
			else if (typeof define === "function" && define.amd) define(["./core", "./sha256"], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			(function() {
				var C = CryptoJS;
				var WordArray = C.lib.WordArray;
				var C_algo = C.algo;
				var SHA256 = C_algo.SHA256;
				/**
				* SHA-224 hash algorithm.
				*/
				var SHA224 = C_algo.SHA224 = SHA256.extend({
					_doReset: function() {
						this._hash = new WordArray.init([
							3238371032,
							914150663,
							812702999,
							4144912697,
							4290775857,
							1750603025,
							1694076839,
							3204075428
						]);
					},
					_doFinalize: function() {
						var hash = SHA256._doFinalize.call(this);
						hash.sigBytes -= 4;
						return hash;
					}
				});
				/**
				* Shortcut function to the hasher's object interface.
				*
				* @param {WordArray|string} message The message to hash.
				*
				* @return {WordArray} The hash.
				*
				* @static
				*
				* @example
				*
				*     var hash = CryptoJS.SHA224('message');
				*     var hash = CryptoJS.SHA224(wordArray);
				*/
				C.SHA224 = SHA256._createHelper(SHA224);
				/**
				* Shortcut function to the HMAC's object interface.
				*
				* @param {WordArray|string} message The message to hash.
				* @param {WordArray|string} key The secret key.
				*
				* @return {WordArray} The HMAC.
				*
				* @static
				*
				* @example
				*
				*     var hmac = CryptoJS.HmacSHA224(message, key);
				*/
				C.HmacSHA224 = SHA256._createHmacHelper(SHA224);
			})();
			return CryptoJS.SHA224;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/sha512.js
	var require_sha512 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory, undef) {
			if (typeof exports === "object") module.exports = exports = factory(require_core(), require_x64_core());
			else if (typeof define === "function" && define.amd) define(["./core", "./x64-core"], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			(function() {
				var C = CryptoJS;
				var Hasher = C.lib.Hasher;
				var C_x64 = C.x64;
				var X64Word = C_x64.Word;
				var X64WordArray = C_x64.WordArray;
				var C_algo = C.algo;
				function X64Word_create() {
					return X64Word.create.apply(X64Word, arguments);
				}
				var K = [
					X64Word_create(1116352408, 3609767458),
					X64Word_create(1899447441, 602891725),
					X64Word_create(3049323471, 3964484399),
					X64Word_create(3921009573, 2173295548),
					X64Word_create(961987163, 4081628472),
					X64Word_create(1508970993, 3053834265),
					X64Word_create(2453635748, 2937671579),
					X64Word_create(2870763221, 3664609560),
					X64Word_create(3624381080, 2734883394),
					X64Word_create(310598401, 1164996542),
					X64Word_create(607225278, 1323610764),
					X64Word_create(1426881987, 3590304994),
					X64Word_create(1925078388, 4068182383),
					X64Word_create(2162078206, 991336113),
					X64Word_create(2614888103, 633803317),
					X64Word_create(3248222580, 3479774868),
					X64Word_create(3835390401, 2666613458),
					X64Word_create(4022224774, 944711139),
					X64Word_create(264347078, 2341262773),
					X64Word_create(604807628, 2007800933),
					X64Word_create(770255983, 1495990901),
					X64Word_create(1249150122, 1856431235),
					X64Word_create(1555081692, 3175218132),
					X64Word_create(1996064986, 2198950837),
					X64Word_create(2554220882, 3999719339),
					X64Word_create(2821834349, 766784016),
					X64Word_create(2952996808, 2566594879),
					X64Word_create(3210313671, 3203337956),
					X64Word_create(3336571891, 1034457026),
					X64Word_create(3584528711, 2466948901),
					X64Word_create(113926993, 3758326383),
					X64Word_create(338241895, 168717936),
					X64Word_create(666307205, 1188179964),
					X64Word_create(773529912, 1546045734),
					X64Word_create(1294757372, 1522805485),
					X64Word_create(1396182291, 2643833823),
					X64Word_create(1695183700, 2343527390),
					X64Word_create(1986661051, 1014477480),
					X64Word_create(2177026350, 1206759142),
					X64Word_create(2456956037, 344077627),
					X64Word_create(2730485921, 1290863460),
					X64Word_create(2820302411, 3158454273),
					X64Word_create(3259730800, 3505952657),
					X64Word_create(3345764771, 106217008),
					X64Word_create(3516065817, 3606008344),
					X64Word_create(3600352804, 1432725776),
					X64Word_create(4094571909, 1467031594),
					X64Word_create(275423344, 851169720),
					X64Word_create(430227734, 3100823752),
					X64Word_create(506948616, 1363258195),
					X64Word_create(659060556, 3750685593),
					X64Word_create(883997877, 3785050280),
					X64Word_create(958139571, 3318307427),
					X64Word_create(1322822218, 3812723403),
					X64Word_create(1537002063, 2003034995),
					X64Word_create(1747873779, 3602036899),
					X64Word_create(1955562222, 1575990012),
					X64Word_create(2024104815, 1125592928),
					X64Word_create(2227730452, 2716904306),
					X64Word_create(2361852424, 442776044),
					X64Word_create(2428436474, 593698344),
					X64Word_create(2756734187, 3733110249),
					X64Word_create(3204031479, 2999351573),
					X64Word_create(3329325298, 3815920427),
					X64Word_create(3391569614, 3928383900),
					X64Word_create(3515267271, 566280711),
					X64Word_create(3940187606, 3454069534),
					X64Word_create(4118630271, 4000239992),
					X64Word_create(116418474, 1914138554),
					X64Word_create(174292421, 2731055270),
					X64Word_create(289380356, 3203993006),
					X64Word_create(460393269, 320620315),
					X64Word_create(685471733, 587496836),
					X64Word_create(852142971, 1086792851),
					X64Word_create(1017036298, 365543100),
					X64Word_create(1126000580, 2618297676),
					X64Word_create(1288033470, 3409855158),
					X64Word_create(1501505948, 4234509866),
					X64Word_create(1607167915, 987167468),
					X64Word_create(1816402316, 1246189591)
				];
				var W = [];
				(function() {
					for (var i = 0; i < 80; i++) W[i] = X64Word_create();
				})();
				/**
				* SHA-512 hash algorithm.
				*/
				var SHA512 = C_algo.SHA512 = Hasher.extend({
					_doReset: function() {
						this._hash = new X64WordArray.init([
							new X64Word.init(1779033703, 4089235720),
							new X64Word.init(3144134277, 2227873595),
							new X64Word.init(1013904242, 4271175723),
							new X64Word.init(2773480762, 1595750129),
							new X64Word.init(1359893119, 2917565137),
							new X64Word.init(2600822924, 725511199),
							new X64Word.init(528734635, 4215389547),
							new X64Word.init(1541459225, 327033209)
						]);
					},
					_doProcessBlock: function(M, offset) {
						var H = this._hash.words;
						var H0 = H[0];
						var H1 = H[1];
						var H2 = H[2];
						var H3 = H[3];
						var H4 = H[4];
						var H5 = H[5];
						var H6 = H[6];
						var H7 = H[7];
						var H0h = H0.high;
						var H0l = H0.low;
						var H1h = H1.high;
						var H1l = H1.low;
						var H2h = H2.high;
						var H2l = H2.low;
						var H3h = H3.high;
						var H3l = H3.low;
						var H4h = H4.high;
						var H4l = H4.low;
						var H5h = H5.high;
						var H5l = H5.low;
						var H6h = H6.high;
						var H6l = H6.low;
						var H7h = H7.high;
						var H7l = H7.low;
						var ah = H0h;
						var al = H0l;
						var bh = H1h;
						var bl = H1l;
						var ch = H2h;
						var cl = H2l;
						var dh = H3h;
						var dl = H3l;
						var eh = H4h;
						var el = H4l;
						var fh = H5h;
						var fl = H5l;
						var gh = H6h;
						var gl = H6l;
						var hh = H7h;
						var hl = H7l;
						for (var i = 0; i < 80; i++) {
							var Wil;
							var Wih;
							var Wi = W[i];
							if (i < 16) {
								Wih = Wi.high = M[offset + i * 2] | 0;
								Wil = Wi.low = M[offset + i * 2 + 1] | 0;
							} else {
								var gamma0x = W[i - 15];
								var gamma0xh = gamma0x.high;
								var gamma0xl = gamma0x.low;
								var gamma0h = (gamma0xh >>> 1 | gamma0xl << 31) ^ (gamma0xh >>> 8 | gamma0xl << 24) ^ gamma0xh >>> 7;
								var gamma0l = (gamma0xl >>> 1 | gamma0xh << 31) ^ (gamma0xl >>> 8 | gamma0xh << 24) ^ (gamma0xl >>> 7 | gamma0xh << 25);
								var gamma1x = W[i - 2];
								var gamma1xh = gamma1x.high;
								var gamma1xl = gamma1x.low;
								var gamma1h = (gamma1xh >>> 19 | gamma1xl << 13) ^ (gamma1xh << 3 | gamma1xl >>> 29) ^ gamma1xh >>> 6;
								var gamma1l = (gamma1xl >>> 19 | gamma1xh << 13) ^ (gamma1xl << 3 | gamma1xh >>> 29) ^ (gamma1xl >>> 6 | gamma1xh << 26);
								var Wi7 = W[i - 7];
								var Wi7h = Wi7.high;
								var Wi7l = Wi7.low;
								var Wi16 = W[i - 16];
								var Wi16h = Wi16.high;
								var Wi16l = Wi16.low;
								Wil = gamma0l + Wi7l;
								Wih = gamma0h + Wi7h + (Wil >>> 0 < gamma0l >>> 0 ? 1 : 0);
								Wil = Wil + gamma1l;
								Wih = Wih + gamma1h + (Wil >>> 0 < gamma1l >>> 0 ? 1 : 0);
								Wil = Wil + Wi16l;
								Wih = Wih + Wi16h + (Wil >>> 0 < Wi16l >>> 0 ? 1 : 0);
								Wi.high = Wih;
								Wi.low = Wil;
							}
							var chh = eh & fh ^ ~eh & gh;
							var chl = el & fl ^ ~el & gl;
							var majh = ah & bh ^ ah & ch ^ bh & ch;
							var majl = al & bl ^ al & cl ^ bl & cl;
							var sigma0h = (ah >>> 28 | al << 4) ^ (ah << 30 | al >>> 2) ^ (ah << 25 | al >>> 7);
							var sigma0l = (al >>> 28 | ah << 4) ^ (al << 30 | ah >>> 2) ^ (al << 25 | ah >>> 7);
							var sigma1h = (eh >>> 14 | el << 18) ^ (eh >>> 18 | el << 14) ^ (eh << 23 | el >>> 9);
							var sigma1l = (el >>> 14 | eh << 18) ^ (el >>> 18 | eh << 14) ^ (el << 23 | eh >>> 9);
							var Ki = K[i];
							var Kih = Ki.high;
							var Kil = Ki.low;
							var t1l = hl + sigma1l;
							var t1h = hh + sigma1h + (t1l >>> 0 < hl >>> 0 ? 1 : 0);
							var t1l = t1l + chl;
							var t1h = t1h + chh + (t1l >>> 0 < chl >>> 0 ? 1 : 0);
							var t1l = t1l + Kil;
							var t1h = t1h + Kih + (t1l >>> 0 < Kil >>> 0 ? 1 : 0);
							var t1l = t1l + Wil;
							var t1h = t1h + Wih + (t1l >>> 0 < Wil >>> 0 ? 1 : 0);
							var t2l = sigma0l + majl;
							var t2h = sigma0h + majh + (t2l >>> 0 < sigma0l >>> 0 ? 1 : 0);
							hh = gh;
							hl = gl;
							gh = fh;
							gl = fl;
							fh = eh;
							fl = el;
							el = dl + t1l | 0;
							eh = dh + t1h + (el >>> 0 < dl >>> 0 ? 1 : 0) | 0;
							dh = ch;
							dl = cl;
							ch = bh;
							cl = bl;
							bh = ah;
							bl = al;
							al = t1l + t2l | 0;
							ah = t1h + t2h + (al >>> 0 < t1l >>> 0 ? 1 : 0) | 0;
						}
						H0l = H0.low = H0l + al;
						H0.high = H0h + ah + (H0l >>> 0 < al >>> 0 ? 1 : 0);
						H1l = H1.low = H1l + bl;
						H1.high = H1h + bh + (H1l >>> 0 < bl >>> 0 ? 1 : 0);
						H2l = H2.low = H2l + cl;
						H2.high = H2h + ch + (H2l >>> 0 < cl >>> 0 ? 1 : 0);
						H3l = H3.low = H3l + dl;
						H3.high = H3h + dh + (H3l >>> 0 < dl >>> 0 ? 1 : 0);
						H4l = H4.low = H4l + el;
						H4.high = H4h + eh + (H4l >>> 0 < el >>> 0 ? 1 : 0);
						H5l = H5.low = H5l + fl;
						H5.high = H5h + fh + (H5l >>> 0 < fl >>> 0 ? 1 : 0);
						H6l = H6.low = H6l + gl;
						H6.high = H6h + gh + (H6l >>> 0 < gl >>> 0 ? 1 : 0);
						H7l = H7.low = H7l + hl;
						H7.high = H7h + hh + (H7l >>> 0 < hl >>> 0 ? 1 : 0);
					},
					_doFinalize: function() {
						var data = this._data;
						var dataWords = data.words;
						var nBitsTotal = this._nDataBytes * 8;
						var nBitsLeft = data.sigBytes * 8;
						dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
						dataWords[(nBitsLeft + 128 >>> 10 << 5) + 30] = Math.floor(nBitsTotal / 4294967296);
						dataWords[(nBitsLeft + 128 >>> 10 << 5) + 31] = nBitsTotal;
						data.sigBytes = dataWords.length * 4;
						this._process();
						return this._hash.toX32();
					},
					clone: function() {
						var clone = Hasher.clone.call(this);
						clone._hash = this._hash.clone();
						return clone;
					},
					blockSize: 32
				});
				/**
				* Shortcut function to the hasher's object interface.
				*
				* @param {WordArray|string} message The message to hash.
				*
				* @return {WordArray} The hash.
				*
				* @static
				*
				* @example
				*
				*     var hash = CryptoJS.SHA512('message');
				*     var hash = CryptoJS.SHA512(wordArray);
				*/
				C.SHA512 = Hasher._createHelper(SHA512);
				/**
				* Shortcut function to the HMAC's object interface.
				*
				* @param {WordArray|string} message The message to hash.
				* @param {WordArray|string} key The secret key.
				*
				* @return {WordArray} The HMAC.
				*
				* @static
				*
				* @example
				*
				*     var hmac = CryptoJS.HmacSHA512(message, key);
				*/
				C.HmacSHA512 = Hasher._createHmacHelper(SHA512);
			})();
			return CryptoJS.SHA512;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/sha384.js
	var require_sha384 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory, undef) {
			if (typeof exports === "object") module.exports = exports = factory(require_core(), require_x64_core(), require_sha512());
			else if (typeof define === "function" && define.amd) define([
				"./core",
				"./x64-core",
				"./sha512"
			], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			(function() {
				var C = CryptoJS;
				var C_x64 = C.x64;
				var X64Word = C_x64.Word;
				var X64WordArray = C_x64.WordArray;
				var C_algo = C.algo;
				var SHA512 = C_algo.SHA512;
				/**
				* SHA-384 hash algorithm.
				*/
				var SHA384 = C_algo.SHA384 = SHA512.extend({
					_doReset: function() {
						this._hash = new X64WordArray.init([
							new X64Word.init(3418070365, 3238371032),
							new X64Word.init(1654270250, 914150663),
							new X64Word.init(2438529370, 812702999),
							new X64Word.init(355462360, 4144912697),
							new X64Word.init(1731405415, 4290775857),
							new X64Word.init(2394180231, 1750603025),
							new X64Word.init(3675008525, 1694076839),
							new X64Word.init(1203062813, 3204075428)
						]);
					},
					_doFinalize: function() {
						var hash = SHA512._doFinalize.call(this);
						hash.sigBytes -= 16;
						return hash;
					}
				});
				/**
				* Shortcut function to the hasher's object interface.
				*
				* @param {WordArray|string} message The message to hash.
				*
				* @return {WordArray} The hash.
				*
				* @static
				*
				* @example
				*
				*     var hash = CryptoJS.SHA384('message');
				*     var hash = CryptoJS.SHA384(wordArray);
				*/
				C.SHA384 = SHA512._createHelper(SHA384);
				/**
				* Shortcut function to the HMAC's object interface.
				*
				* @param {WordArray|string} message The message to hash.
				* @param {WordArray|string} key The secret key.
				*
				* @return {WordArray} The HMAC.
				*
				* @static
				*
				* @example
				*
				*     var hmac = CryptoJS.HmacSHA384(message, key);
				*/
				C.HmacSHA384 = SHA512._createHmacHelper(SHA384);
			})();
			return CryptoJS.SHA384;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/sha3.js
	var require_sha3 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory, undef) {
			if (typeof exports === "object") module.exports = exports = factory(require_core(), require_x64_core());
			else if (typeof define === "function" && define.amd) define(["./core", "./x64-core"], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			(function(Math) {
				var C = CryptoJS;
				var C_lib = C.lib;
				var WordArray = C_lib.WordArray;
				var Hasher = C_lib.Hasher;
				var X64Word = C.x64.Word;
				var C_algo = C.algo;
				var RHO_OFFSETS = [];
				var PI_INDEXES = [];
				var ROUND_CONSTANTS = [];
				(function() {
					var x = 1, y = 0;
					for (var t = 0; t < 24; t++) {
						RHO_OFFSETS[x + 5 * y] = (t + 1) * (t + 2) / 2 % 64;
						var newX = y % 5;
						var newY = (2 * x + 3 * y) % 5;
						x = newX;
						y = newY;
					}
					for (var x = 0; x < 5; x++) for (var y = 0; y < 5; y++) PI_INDEXES[x + 5 * y] = y + (2 * x + 3 * y) % 5 * 5;
					var LFSR = 1;
					for (var i = 0; i < 24; i++) {
						var roundConstantMsw = 0;
						var roundConstantLsw = 0;
						for (var j = 0; j < 7; j++) {
							if (LFSR & 1) {
								var bitPosition = (1 << j) - 1;
								if (bitPosition < 32) roundConstantLsw ^= 1 << bitPosition;
								else roundConstantMsw ^= 1 << bitPosition - 32;
							}
							if (LFSR & 128) LFSR = LFSR << 1 ^ 113;
							else LFSR <<= 1;
						}
						ROUND_CONSTANTS[i] = X64Word.create(roundConstantMsw, roundConstantLsw);
					}
				})();
				var T = [];
				(function() {
					for (var i = 0; i < 25; i++) T[i] = X64Word.create();
				})();
				/**
				* SHA-3 hash algorithm.
				*/
				var SHA3 = C_algo.SHA3 = Hasher.extend({
					/**
					* Configuration options.
					*
					* @property {number} outputLength
					*   The desired number of bits in the output hash.
					*   Only values permitted are: 224, 256, 384, 512.
					*   Default: 512
					*/
					cfg: Hasher.cfg.extend({ outputLength: 512 }),
					_doReset: function() {
						var state = this._state = [];
						for (var i = 0; i < 25; i++) state[i] = new X64Word.init();
						this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
					},
					_doProcessBlock: function(M, offset) {
						var state = this._state;
						var nBlockSizeLanes = this.blockSize / 2;
						for (var i = 0; i < nBlockSizeLanes; i++) {
							var M2i = M[offset + 2 * i];
							var M2i1 = M[offset + 2 * i + 1];
							M2i = (M2i << 8 | M2i >>> 24) & 16711935 | (M2i << 24 | M2i >>> 8) & 4278255360;
							M2i1 = (M2i1 << 8 | M2i1 >>> 24) & 16711935 | (M2i1 << 24 | M2i1 >>> 8) & 4278255360;
							var lane = state[i];
							lane.high ^= M2i1;
							lane.low ^= M2i;
						}
						for (var round = 0; round < 24; round++) {
							for (var x = 0; x < 5; x++) {
								var tMsw = 0, tLsw = 0;
								for (var y = 0; y < 5; y++) {
									var lane = state[x + 5 * y];
									tMsw ^= lane.high;
									tLsw ^= lane.low;
								}
								var Tx = T[x];
								Tx.high = tMsw;
								Tx.low = tLsw;
							}
							for (var x = 0; x < 5; x++) {
								var Tx4 = T[(x + 4) % 5];
								var Tx1 = T[(x + 1) % 5];
								var Tx1Msw = Tx1.high;
								var Tx1Lsw = Tx1.low;
								var tMsw = Tx4.high ^ (Tx1Msw << 1 | Tx1Lsw >>> 31);
								var tLsw = Tx4.low ^ (Tx1Lsw << 1 | Tx1Msw >>> 31);
								for (var y = 0; y < 5; y++) {
									var lane = state[x + 5 * y];
									lane.high ^= tMsw;
									lane.low ^= tLsw;
								}
							}
							for (var laneIndex = 1; laneIndex < 25; laneIndex++) {
								var tMsw;
								var tLsw;
								var lane = state[laneIndex];
								var laneMsw = lane.high;
								var laneLsw = lane.low;
								var rhoOffset = RHO_OFFSETS[laneIndex];
								if (rhoOffset < 32) {
									tMsw = laneMsw << rhoOffset | laneLsw >>> 32 - rhoOffset;
									tLsw = laneLsw << rhoOffset | laneMsw >>> 32 - rhoOffset;
								} else {
									tMsw = laneLsw << rhoOffset - 32 | laneMsw >>> 64 - rhoOffset;
									tLsw = laneMsw << rhoOffset - 32 | laneLsw >>> 64 - rhoOffset;
								}
								var TPiLane = T[PI_INDEXES[laneIndex]];
								TPiLane.high = tMsw;
								TPiLane.low = tLsw;
							}
							var T0 = T[0];
							var state0 = state[0];
							T0.high = state0.high;
							T0.low = state0.low;
							for (var x = 0; x < 5; x++) for (var y = 0; y < 5; y++) {
								var laneIndex = x + 5 * y;
								var lane = state[laneIndex];
								var TLane = T[laneIndex];
								var Tx1Lane = T[(x + 1) % 5 + 5 * y];
								var Tx2Lane = T[(x + 2) % 5 + 5 * y];
								lane.high = TLane.high ^ ~Tx1Lane.high & Tx2Lane.high;
								lane.low = TLane.low ^ ~Tx1Lane.low & Tx2Lane.low;
							}
							var lane = state[0];
							var roundConstant = ROUND_CONSTANTS[round];
							lane.high ^= roundConstant.high;
							lane.low ^= roundConstant.low;
						}
					},
					_doFinalize: function() {
						var data = this._data;
						var dataWords = data.words;
						this._nDataBytes * 8;
						var nBitsLeft = data.sigBytes * 8;
						var blockSizeBits = this.blockSize * 32;
						dataWords[nBitsLeft >>> 5] |= 1 << 24 - nBitsLeft % 32;
						dataWords[(Math.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits >>> 5) - 1] |= 128;
						data.sigBytes = dataWords.length * 4;
						this._process();
						var state = this._state;
						var outputLengthBytes = this.cfg.outputLength / 8;
						var outputLengthLanes = outputLengthBytes / 8;
						var hashWords = [];
						for (var i = 0; i < outputLengthLanes; i++) {
							var lane = state[i];
							var laneMsw = lane.high;
							var laneLsw = lane.low;
							laneMsw = (laneMsw << 8 | laneMsw >>> 24) & 16711935 | (laneMsw << 24 | laneMsw >>> 8) & 4278255360;
							laneLsw = (laneLsw << 8 | laneLsw >>> 24) & 16711935 | (laneLsw << 24 | laneLsw >>> 8) & 4278255360;
							hashWords.push(laneLsw);
							hashWords.push(laneMsw);
						}
						return new WordArray.init(hashWords, outputLengthBytes);
					},
					clone: function() {
						var clone = Hasher.clone.call(this);
						var state = clone._state = this._state.slice(0);
						for (var i = 0; i < 25; i++) state[i] = state[i].clone();
						return clone;
					}
				});
				/**
				* Shortcut function to the hasher's object interface.
				*
				* @param {WordArray|string} message The message to hash.
				*
				* @return {WordArray} The hash.
				*
				* @static
				*
				* @example
				*
				*     var hash = CryptoJS.SHA3('message');
				*     var hash = CryptoJS.SHA3(wordArray);
				*/
				C.SHA3 = Hasher._createHelper(SHA3);
				/**
				* Shortcut function to the HMAC's object interface.
				*
				* @param {WordArray|string} message The message to hash.
				* @param {WordArray|string} key The secret key.
				*
				* @return {WordArray} The HMAC.
				*
				* @static
				*
				* @example
				*
				*     var hmac = CryptoJS.HmacSHA3(message, key);
				*/
				C.HmacSHA3 = Hasher._createHmacHelper(SHA3);
			})(Math);
			return CryptoJS.SHA3;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/ripemd160.js
	var require_ripemd160 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory) {
			if (typeof exports === "object") module.exports = exports = factory(require_core());
			else if (typeof define === "function" && define.amd) define(["./core"], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			/** @preserve
			(c) 2012 by Cédric Mesnil. All rights reserved.
			
			Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
			
			- Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
			- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
			
			THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
			*/
			(function(Math) {
				var C = CryptoJS;
				var C_lib = C.lib;
				var WordArray = C_lib.WordArray;
				var Hasher = C_lib.Hasher;
				var C_algo = C.algo;
				var _zl = WordArray.create([
					0,
					1,
					2,
					3,
					4,
					5,
					6,
					7,
					8,
					9,
					10,
					11,
					12,
					13,
					14,
					15,
					7,
					4,
					13,
					1,
					10,
					6,
					15,
					3,
					12,
					0,
					9,
					5,
					2,
					14,
					11,
					8,
					3,
					10,
					14,
					4,
					9,
					15,
					8,
					1,
					2,
					7,
					0,
					6,
					13,
					11,
					5,
					12,
					1,
					9,
					11,
					10,
					0,
					8,
					12,
					4,
					13,
					3,
					7,
					15,
					14,
					5,
					6,
					2,
					4,
					0,
					5,
					9,
					7,
					12,
					2,
					10,
					14,
					1,
					3,
					8,
					11,
					6,
					15,
					13
				]);
				var _zr = WordArray.create([
					5,
					14,
					7,
					0,
					9,
					2,
					11,
					4,
					13,
					6,
					15,
					8,
					1,
					10,
					3,
					12,
					6,
					11,
					3,
					7,
					0,
					13,
					5,
					10,
					14,
					15,
					8,
					12,
					4,
					9,
					1,
					2,
					15,
					5,
					1,
					3,
					7,
					14,
					6,
					9,
					11,
					8,
					12,
					2,
					10,
					0,
					4,
					13,
					8,
					6,
					4,
					1,
					3,
					11,
					15,
					0,
					5,
					12,
					2,
					13,
					9,
					7,
					10,
					14,
					12,
					15,
					10,
					4,
					1,
					5,
					8,
					7,
					6,
					2,
					13,
					14,
					0,
					3,
					9,
					11
				]);
				var _sl = WordArray.create([
					11,
					14,
					15,
					12,
					5,
					8,
					7,
					9,
					11,
					13,
					14,
					15,
					6,
					7,
					9,
					8,
					7,
					6,
					8,
					13,
					11,
					9,
					7,
					15,
					7,
					12,
					15,
					9,
					11,
					7,
					13,
					12,
					11,
					13,
					6,
					7,
					14,
					9,
					13,
					15,
					14,
					8,
					13,
					6,
					5,
					12,
					7,
					5,
					11,
					12,
					14,
					15,
					14,
					15,
					9,
					8,
					9,
					14,
					5,
					6,
					8,
					6,
					5,
					12,
					9,
					15,
					5,
					11,
					6,
					8,
					13,
					12,
					5,
					12,
					13,
					14,
					11,
					8,
					5,
					6
				]);
				var _sr = WordArray.create([
					8,
					9,
					9,
					11,
					13,
					15,
					15,
					5,
					7,
					7,
					8,
					11,
					14,
					14,
					12,
					6,
					9,
					13,
					15,
					7,
					12,
					8,
					9,
					11,
					7,
					7,
					12,
					7,
					6,
					15,
					13,
					11,
					9,
					7,
					15,
					11,
					8,
					6,
					6,
					14,
					12,
					13,
					5,
					14,
					13,
					13,
					7,
					5,
					15,
					5,
					8,
					11,
					14,
					14,
					6,
					14,
					6,
					9,
					12,
					9,
					12,
					5,
					15,
					8,
					8,
					5,
					12,
					9,
					12,
					5,
					14,
					6,
					8,
					13,
					6,
					5,
					15,
					13,
					11,
					11
				]);
				var _hl = WordArray.create([
					0,
					1518500249,
					1859775393,
					2400959708,
					2840853838
				]);
				var _hr = WordArray.create([
					1352829926,
					1548603684,
					1836072691,
					2053994217,
					0
				]);
				/**
				* RIPEMD160 hash algorithm.
				*/
				var RIPEMD160 = C_algo.RIPEMD160 = Hasher.extend({
					_doReset: function() {
						this._hash = WordArray.create([
							1732584193,
							4023233417,
							2562383102,
							271733878,
							3285377520
						]);
					},
					_doProcessBlock: function(M, offset) {
						for (var i = 0; i < 16; i++) {
							var offset_i = offset + i;
							var M_offset_i = M[offset_i];
							M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 16711935 | (M_offset_i << 24 | M_offset_i >>> 8) & 4278255360;
						}
						var H = this._hash.words;
						var hl = _hl.words;
						var hr = _hr.words;
						var zl = _zl.words;
						var zr = _zr.words;
						var sl = _sl.words;
						var sr = _sr.words;
						var al, bl, cl, dl, el;
						var ar = al = H[0], br = bl = H[1], cr = cl = H[2], dr = dl = H[3], er = el = H[4];
						var t;
						for (var i = 0; i < 80; i += 1) {
							t = al + M[offset + zl[i]] | 0;
							if (i < 16) t += f1(bl, cl, dl) + hl[0];
							else if (i < 32) t += f2(bl, cl, dl) + hl[1];
							else if (i < 48) t += f3(bl, cl, dl) + hl[2];
							else if (i < 64) t += f4(bl, cl, dl) + hl[3];
							else t += f5(bl, cl, dl) + hl[4];
							t = t | 0;
							t = rotl(t, sl[i]);
							t = t + el | 0;
							al = el;
							el = dl;
							dl = rotl(cl, 10);
							cl = bl;
							bl = t;
							t = ar + M[offset + zr[i]] | 0;
							if (i < 16) t += f5(br, cr, dr) + hr[0];
							else if (i < 32) t += f4(br, cr, dr) + hr[1];
							else if (i < 48) t += f3(br, cr, dr) + hr[2];
							else if (i < 64) t += f2(br, cr, dr) + hr[3];
							else t += f1(br, cr, dr) + hr[4];
							t = t | 0;
							t = rotl(t, sr[i]);
							t = t + er | 0;
							ar = er;
							er = dr;
							dr = rotl(cr, 10);
							cr = br;
							br = t;
						}
						t = H[1] + cl + dr | 0;
						H[1] = H[2] + dl + er | 0;
						H[2] = H[3] + el + ar | 0;
						H[3] = H[4] + al + br | 0;
						H[4] = H[0] + bl + cr | 0;
						H[0] = t;
					},
					_doFinalize: function() {
						var data = this._data;
						var dataWords = data.words;
						var nBitsTotal = this._nDataBytes * 8;
						var nBitsLeft = data.sigBytes * 8;
						dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
						dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotal << 8 | nBitsTotal >>> 24) & 16711935 | (nBitsTotal << 24 | nBitsTotal >>> 8) & 4278255360;
						data.sigBytes = (dataWords.length + 1) * 4;
						this._process();
						var hash = this._hash;
						var H = hash.words;
						for (var i = 0; i < 5; i++) {
							var H_i = H[i];
							H[i] = (H_i << 8 | H_i >>> 24) & 16711935 | (H_i << 24 | H_i >>> 8) & 4278255360;
						}
						return hash;
					},
					clone: function() {
						var clone = Hasher.clone.call(this);
						clone._hash = this._hash.clone();
						return clone;
					}
				});
				function f1(x, y, z) {
					return x ^ y ^ z;
				}
				function f2(x, y, z) {
					return x & y | ~x & z;
				}
				function f3(x, y, z) {
					return (x | ~y) ^ z;
				}
				function f4(x, y, z) {
					return x & z | y & ~z;
				}
				function f5(x, y, z) {
					return x ^ (y | ~z);
				}
				function rotl(x, n) {
					return x << n | x >>> 32 - n;
				}
				/**
				* Shortcut function to the hasher's object interface.
				*
				* @param {WordArray|string} message The message to hash.
				*
				* @return {WordArray} The hash.
				*
				* @static
				*
				* @example
				*
				*     var hash = CryptoJS.RIPEMD160('message');
				*     var hash = CryptoJS.RIPEMD160(wordArray);
				*/
				C.RIPEMD160 = Hasher._createHelper(RIPEMD160);
				/**
				* Shortcut function to the HMAC's object interface.
				*
				* @param {WordArray|string} message The message to hash.
				* @param {WordArray|string} key The secret key.
				*
				* @return {WordArray} The HMAC.
				*
				* @static
				*
				* @example
				*
				*     var hmac = CryptoJS.HmacRIPEMD160(message, key);
				*/
				C.HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160);
			})(Math);
			return CryptoJS.RIPEMD160;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/pbkdf2.js
	var require_pbkdf2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory, undef) {
			if (typeof exports === "object") module.exports = exports = factory(require_core(), require_sha256(), require_hmac());
			else if (typeof define === "function" && define.amd) define([
				"./core",
				"./sha256",
				"./hmac"
			], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			(function() {
				var C = CryptoJS;
				var C_lib = C.lib;
				var Base = C_lib.Base;
				var WordArray = C_lib.WordArray;
				var C_algo = C.algo;
				var SHA256 = C_algo.SHA256;
				var HMAC = C_algo.HMAC;
				/**
				* Password-Based Key Derivation Function 2 algorithm.
				*/
				var PBKDF2 = C_algo.PBKDF2 = Base.extend({
					/**
					* Configuration options.
					*
					* @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
					* @property {Hasher} hasher The hasher to use. Default: SHA256
					* @property {number} iterations The number of iterations to perform. Default: 250000
					*/
					cfg: Base.extend({
						keySize: 4,
						hasher: SHA256,
						iterations: 25e4
					}),
					/**
					* Initializes a newly created key derivation function.
					*
					* @param {Object} cfg (Optional) The configuration options to use for the derivation.
					*
					* @example
					*
					*     var kdf = CryptoJS.algo.PBKDF2.create();
					*     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
					*     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
					*/
					init: function(cfg) {
						this.cfg = this.cfg.extend(cfg);
					},
					/**
					* Computes the Password-Based Key Derivation Function 2.
					*
					* @param {WordArray|string} password The password.
					* @param {WordArray|string} salt A salt.
					*
					* @return {WordArray} The derived key.
					*
					* @example
					*
					*     var key = kdf.compute(password, salt);
					*/
					compute: function(password, salt) {
						var cfg = this.cfg;
						var hmac = HMAC.create(cfg.hasher, password);
						var derivedKey = WordArray.create();
						var blockIndex = WordArray.create([1]);
						var derivedKeyWords = derivedKey.words;
						var blockIndexWords = blockIndex.words;
						var keySize = cfg.keySize;
						var iterations = cfg.iterations;
						while (derivedKeyWords.length < keySize) {
							var block = hmac.update(salt).finalize(blockIndex);
							hmac.reset();
							var blockWords = block.words;
							var blockWordsLength = blockWords.length;
							var intermediate = block;
							for (var i = 1; i < iterations; i++) {
								intermediate = hmac.finalize(intermediate);
								hmac.reset();
								var intermediateWords = intermediate.words;
								for (var j = 0; j < blockWordsLength; j++) blockWords[j] ^= intermediateWords[j];
							}
							derivedKey.concat(block);
							blockIndexWords[0]++;
						}
						derivedKey.sigBytes = keySize * 4;
						return derivedKey;
					}
				});
				/**
				* Computes the Password-Based Key Derivation Function 2.
				*
				* @param {WordArray|string} password The password.
				* @param {WordArray|string} salt A salt.
				* @param {Object} cfg (Optional) The configuration options to use for this computation.
				*
				* @return {WordArray} The derived key.
				*
				* @static
				*
				* @example
				*
				*     var key = CryptoJS.PBKDF2(password, salt);
				*     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8 });
				*     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8, iterations: 1000 });
				*/
				C.PBKDF2 = function(password, salt, cfg) {
					return PBKDF2.create(cfg).compute(password, salt);
				};
			})();
			return CryptoJS.PBKDF2;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/mode-cfb.js
	var require_mode_cfb = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory, undef) {
			if (typeof exports === "object") module.exports = exports = factory(require_core(), require_cipher_core());
			else if (typeof define === "function" && define.amd) define(["./core", "./cipher-core"], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			/**
			* Cipher Feedback block mode.
			*/
			CryptoJS.mode.CFB = function() {
				var CFB = CryptoJS.lib.BlockCipherMode.extend();
				CFB.Encryptor = CFB.extend({ processBlock: function(words, offset) {
					var cipher = this._cipher;
					var blockSize = cipher.blockSize;
					generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);
					this._prevBlock = words.slice(offset, offset + blockSize);
				} });
				CFB.Decryptor = CFB.extend({ processBlock: function(words, offset) {
					var cipher = this._cipher;
					var blockSize = cipher.blockSize;
					var thisBlock = words.slice(offset, offset + blockSize);
					generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);
					this._prevBlock = thisBlock;
				} });
				function generateKeystreamAndEncrypt(words, offset, blockSize, cipher) {
					var keystream;
					var iv = this._iv;
					if (iv) {
						keystream = iv.slice(0);
						this._iv = void 0;
					} else keystream = this._prevBlock;
					cipher.encryptBlock(keystream, 0);
					for (var i = 0; i < blockSize; i++) words[offset + i] ^= keystream[i];
				}
				return CFB;
			}();
			return CryptoJS.mode.CFB;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/mode-ctr.js
	var require_mode_ctr = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory, undef) {
			if (typeof exports === "object") module.exports = exports = factory(require_core(), require_cipher_core());
			else if (typeof define === "function" && define.amd) define(["./core", "./cipher-core"], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			/**
			* Counter block mode.
			*/
			CryptoJS.mode.CTR = function() {
				var CTR = CryptoJS.lib.BlockCipherMode.extend();
				CTR.Decryptor = CTR.Encryptor = CTR.extend({ processBlock: function(words, offset) {
					var cipher = this._cipher;
					var blockSize = cipher.blockSize;
					var iv = this._iv;
					var counter = this._counter;
					if (iv) {
						counter = this._counter = iv.slice(0);
						this._iv = void 0;
					}
					var keystream = counter.slice(0);
					cipher.encryptBlock(keystream, 0);
					counter[blockSize - 1] = counter[blockSize - 1] + 1 | 0;
					for (var i = 0; i < blockSize; i++) words[offset + i] ^= keystream[i];
				} });
				return CTR;
			}();
			return CryptoJS.mode.CTR;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/mode-ctr-gladman.js
	var require_mode_ctr_gladman = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory, undef) {
			if (typeof exports === "object") module.exports = exports = factory(require_core(), require_cipher_core());
			else if (typeof define === "function" && define.amd) define(["./core", "./cipher-core"], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			/** @preserve
			* Counter block mode compatible with  Dr Brian Gladman fileenc.c
			* derived from CryptoJS.mode.CTR
			* Jan Hruby jhruby.web@gmail.com
			*/
			CryptoJS.mode.CTRGladman = function() {
				var CTRGladman = CryptoJS.lib.BlockCipherMode.extend();
				function incWord(word) {
					if ((word >> 24 & 255) === 255) {
						var b1 = word >> 16 & 255;
						var b2 = word >> 8 & 255;
						var b3 = word & 255;
						if (b1 === 255) {
							b1 = 0;
							if (b2 === 255) {
								b2 = 0;
								if (b3 === 255) b3 = 0;
								else ++b3;
							} else ++b2;
						} else ++b1;
						word = 0;
						word += b1 << 16;
						word += b2 << 8;
						word += b3;
					} else word += 1 << 24;
					return word;
				}
				function incCounter(counter) {
					if ((counter[0] = incWord(counter[0])) === 0) counter[1] = incWord(counter[1]);
					return counter;
				}
				CTRGladman.Decryptor = CTRGladman.Encryptor = CTRGladman.extend({ processBlock: function(words, offset) {
					var cipher = this._cipher;
					var blockSize = cipher.blockSize;
					var iv = this._iv;
					var counter = this._counter;
					if (iv) {
						counter = this._counter = iv.slice(0);
						this._iv = void 0;
					}
					incCounter(counter);
					var keystream = counter.slice(0);
					cipher.encryptBlock(keystream, 0);
					for (var i = 0; i < blockSize; i++) words[offset + i] ^= keystream[i];
				} });
				return CTRGladman;
			}();
			return CryptoJS.mode.CTRGladman;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/mode-ofb.js
	var require_mode_ofb = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory, undef) {
			if (typeof exports === "object") module.exports = exports = factory(require_core(), require_cipher_core());
			else if (typeof define === "function" && define.amd) define(["./core", "./cipher-core"], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			/**
			* Output Feedback block mode.
			*/
			CryptoJS.mode.OFB = function() {
				var OFB = CryptoJS.lib.BlockCipherMode.extend();
				OFB.Decryptor = OFB.Encryptor = OFB.extend({ processBlock: function(words, offset) {
					var cipher = this._cipher;
					var blockSize = cipher.blockSize;
					var iv = this._iv;
					var keystream = this._keystream;
					if (iv) {
						keystream = this._keystream = iv.slice(0);
						this._iv = void 0;
					}
					cipher.encryptBlock(keystream, 0);
					for (var i = 0; i < blockSize; i++) words[offset + i] ^= keystream[i];
				} });
				return OFB;
			}();
			return CryptoJS.mode.OFB;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/pad-ansix923.js
	var require_pad_ansix923 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory, undef) {
			if (typeof exports === "object") module.exports = exports = factory(require_core(), require_cipher_core());
			else if (typeof define === "function" && define.amd) define(["./core", "./cipher-core"], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			/**
			* ANSI X.923 padding strategy.
			*/
			CryptoJS.pad.AnsiX923 = {
				pad: function(data, blockSize) {
					var dataSigBytes = data.sigBytes;
					var blockSizeBytes = blockSize * 4;
					var nPaddingBytes = blockSizeBytes - dataSigBytes % blockSizeBytes;
					var lastBytePos = dataSigBytes + nPaddingBytes - 1;
					data.clamp();
					data.words[lastBytePos >>> 2] |= nPaddingBytes << 24 - lastBytePos % 4 * 8;
					data.sigBytes += nPaddingBytes;
				},
				unpad: function(data) {
					var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
					data.sigBytes -= nPaddingBytes;
				}
			};
			return CryptoJS.pad.Ansix923;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/pad-iso10126.js
	var require_pad_iso10126 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory, undef) {
			if (typeof exports === "object") module.exports = exports = factory(require_core(), require_cipher_core());
			else if (typeof define === "function" && define.amd) define(["./core", "./cipher-core"], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			/**
			* ISO 10126 padding strategy.
			*/
			CryptoJS.pad.Iso10126 = {
				pad: function(data, blockSize) {
					var blockSizeBytes = blockSize * 4;
					var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
					data.concat(CryptoJS.lib.WordArray.random(nPaddingBytes - 1)).concat(CryptoJS.lib.WordArray.create([nPaddingBytes << 24], 1));
				},
				unpad: function(data) {
					var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
					data.sigBytes -= nPaddingBytes;
				}
			};
			return CryptoJS.pad.Iso10126;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/pad-iso97971.js
	var require_pad_iso97971 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory, undef) {
			if (typeof exports === "object") module.exports = exports = factory(require_core(), require_cipher_core());
			else if (typeof define === "function" && define.amd) define(["./core", "./cipher-core"], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			/**
			* ISO/IEC 9797-1 Padding Method 2.
			*/
			CryptoJS.pad.Iso97971 = {
				pad: function(data, blockSize) {
					data.concat(CryptoJS.lib.WordArray.create([2147483648], 1));
					CryptoJS.pad.ZeroPadding.pad(data, blockSize);
				},
				unpad: function(data) {
					CryptoJS.pad.ZeroPadding.unpad(data);
					data.sigBytes--;
				}
			};
			return CryptoJS.pad.Iso97971;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/pad-zeropadding.js
	var require_pad_zeropadding = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory, undef) {
			if (typeof exports === "object") module.exports = exports = factory(require_core(), require_cipher_core());
			else if (typeof define === "function" && define.amd) define(["./core", "./cipher-core"], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			/**
			* Zero padding strategy.
			*/
			CryptoJS.pad.ZeroPadding = {
				pad: function(data, blockSize) {
					var blockSizeBytes = blockSize * 4;
					data.clamp();
					data.sigBytes += blockSizeBytes - (data.sigBytes % blockSizeBytes || blockSizeBytes);
				},
				unpad: function(data) {
					var dataWords = data.words;
					var i = data.sigBytes - 1;
					for (var i = data.sigBytes - 1; i >= 0; i--) if (dataWords[i >>> 2] >>> 24 - i % 4 * 8 & 255) {
						data.sigBytes = i + 1;
						break;
					}
				}
			};
			return CryptoJS.pad.ZeroPadding;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/pad-nopadding.js
	var require_pad_nopadding = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory, undef) {
			if (typeof exports === "object") module.exports = exports = factory(require_core(), require_cipher_core());
			else if (typeof define === "function" && define.amd) define(["./core", "./cipher-core"], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			/**
			* A noop padding strategy.
			*/
			CryptoJS.pad.NoPadding = {
				pad: function() {},
				unpad: function() {}
			};
			return CryptoJS.pad.NoPadding;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/format-hex.js
	var require_format_hex = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory, undef) {
			if (typeof exports === "object") module.exports = exports = factory(require_core(), require_cipher_core());
			else if (typeof define === "function" && define.amd) define(["./core", "./cipher-core"], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			(function(undefined) {
				var C = CryptoJS;
				var CipherParams = C.lib.CipherParams;
				var Hex = C.enc.Hex;
				var C_format = C.format;
				C_format.Hex = {
					/**
					* Converts the ciphertext of a cipher params object to a hexadecimally encoded string.
					*
					* @param {CipherParams} cipherParams The cipher params object.
					*
					* @return {string} The hexadecimally encoded string.
					*
					* @static
					*
					* @example
					*
					*     var hexString = CryptoJS.format.Hex.stringify(cipherParams);
					*/
					stringify: function(cipherParams) {
						return cipherParams.ciphertext.toString(Hex);
					},
					/**
					* Converts a hexadecimally encoded ciphertext string to a cipher params object.
					*
					* @param {string} input The hexadecimally encoded string.
					*
					* @return {CipherParams} The cipher params object.
					*
					* @static
					*
					* @example
					*
					*     var cipherParams = CryptoJS.format.Hex.parse(hexString);
					*/
					parse: function(input) {
						var ciphertext = Hex.parse(input);
						return CipherParams.create({ ciphertext });
					}
				};
			})();
			return CryptoJS.format.Hex;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/tripledes.js
	var require_tripledes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory, undef) {
			if (typeof exports === "object") module.exports = exports = factory(require_core(), require_enc_base64(), require_md5(), require_evpkdf(), require_cipher_core());
			else if (typeof define === "function" && define.amd) define([
				"./core",
				"./enc-base64",
				"./md5",
				"./evpkdf",
				"./cipher-core"
			], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			(function() {
				var C = CryptoJS;
				var C_lib = C.lib;
				var WordArray = C_lib.WordArray;
				var BlockCipher = C_lib.BlockCipher;
				var C_algo = C.algo;
				var PC1 = [
					57,
					49,
					41,
					33,
					25,
					17,
					9,
					1,
					58,
					50,
					42,
					34,
					26,
					18,
					10,
					2,
					59,
					51,
					43,
					35,
					27,
					19,
					11,
					3,
					60,
					52,
					44,
					36,
					63,
					55,
					47,
					39,
					31,
					23,
					15,
					7,
					62,
					54,
					46,
					38,
					30,
					22,
					14,
					6,
					61,
					53,
					45,
					37,
					29,
					21,
					13,
					5,
					28,
					20,
					12,
					4
				];
				var PC2 = [
					14,
					17,
					11,
					24,
					1,
					5,
					3,
					28,
					15,
					6,
					21,
					10,
					23,
					19,
					12,
					4,
					26,
					8,
					16,
					7,
					27,
					20,
					13,
					2,
					41,
					52,
					31,
					37,
					47,
					55,
					30,
					40,
					51,
					45,
					33,
					48,
					44,
					49,
					39,
					56,
					34,
					53,
					46,
					42,
					50,
					36,
					29,
					32
				];
				var BIT_SHIFTS = [
					1,
					2,
					4,
					6,
					8,
					10,
					12,
					14,
					15,
					17,
					19,
					21,
					23,
					25,
					27,
					28
				];
				var SBOX_P = [
					{
						0: 8421888,
						268435456: 32768,
						536870912: 8421378,
						805306368: 2,
						1073741824: 512,
						1342177280: 8421890,
						1610612736: 8389122,
						1879048192: 8388608,
						2147483648: 514,
						2415919104: 8389120,
						2684354560: 33280,
						2952790016: 8421376,
						3221225472: 32770,
						3489660928: 8388610,
						3758096384: 0,
						4026531840: 33282,
						134217728: 0,
						402653184: 8421890,
						671088640: 33282,
						939524096: 32768,
						1207959552: 8421888,
						1476395008: 512,
						1744830464: 8421378,
						2013265920: 2,
						2281701376: 8389120,
						2550136832: 33280,
						2818572288: 8421376,
						3087007744: 8389122,
						3355443200: 8388610,
						3623878656: 32770,
						3892314112: 514,
						4160749568: 8388608,
						1: 32768,
						268435457: 2,
						536870913: 8421888,
						805306369: 8388608,
						1073741825: 8421378,
						1342177281: 33280,
						1610612737: 512,
						1879048193: 8389122,
						2147483649: 8421890,
						2415919105: 8421376,
						2684354561: 8388610,
						2952790017: 33282,
						3221225473: 514,
						3489660929: 8389120,
						3758096385: 32770,
						4026531841: 0,
						134217729: 8421890,
						402653185: 8421376,
						671088641: 8388608,
						939524097: 512,
						1207959553: 32768,
						1476395009: 8388610,
						1744830465: 2,
						2013265921: 33282,
						2281701377: 32770,
						2550136833: 8389122,
						2818572289: 514,
						3087007745: 8421888,
						3355443201: 8389120,
						3623878657: 0,
						3892314113: 33280,
						4160749569: 8421378
					},
					{
						0: 1074282512,
						16777216: 16384,
						33554432: 524288,
						50331648: 1074266128,
						67108864: 1073741840,
						83886080: 1074282496,
						100663296: 1073758208,
						117440512: 16,
						134217728: 540672,
						150994944: 1073758224,
						167772160: 1073741824,
						184549376: 540688,
						201326592: 524304,
						218103808: 0,
						234881024: 16400,
						251658240: 1074266112,
						8388608: 1073758208,
						25165824: 540688,
						41943040: 16,
						58720256: 1073758224,
						75497472: 1074282512,
						92274688: 1073741824,
						109051904: 524288,
						125829120: 1074266128,
						142606336: 524304,
						159383552: 0,
						176160768: 16384,
						192937984: 1074266112,
						209715200: 1073741840,
						226492416: 540672,
						243269632: 1074282496,
						260046848: 16400,
						268435456: 0,
						285212672: 1074266128,
						301989888: 1073758224,
						318767104: 1074282496,
						335544320: 1074266112,
						352321536: 16,
						369098752: 540688,
						385875968: 16384,
						402653184: 16400,
						419430400: 524288,
						436207616: 524304,
						452984832: 1073741840,
						469762048: 540672,
						486539264: 1073758208,
						503316480: 1073741824,
						520093696: 1074282512,
						276824064: 540688,
						293601280: 524288,
						310378496: 1074266112,
						327155712: 16384,
						343932928: 1073758208,
						360710144: 1074282512,
						377487360: 16,
						394264576: 1073741824,
						411041792: 1074282496,
						427819008: 1073741840,
						444596224: 1073758224,
						461373440: 524304,
						478150656: 0,
						494927872: 16400,
						511705088: 1074266128,
						528482304: 540672
					},
					{
						0: 260,
						1048576: 0,
						2097152: 67109120,
						3145728: 65796,
						4194304: 65540,
						5242880: 67108868,
						6291456: 67174660,
						7340032: 67174400,
						8388608: 67108864,
						9437184: 67174656,
						10485760: 65792,
						11534336: 67174404,
						12582912: 67109124,
						13631488: 65536,
						14680064: 4,
						15728640: 256,
						524288: 67174656,
						1572864: 67174404,
						2621440: 0,
						3670016: 67109120,
						4718592: 67108868,
						5767168: 65536,
						6815744: 65540,
						7864320: 260,
						8912896: 4,
						9961472: 256,
						11010048: 67174400,
						12058624: 65796,
						13107200: 65792,
						14155776: 67109124,
						15204352: 67174660,
						16252928: 67108864,
						16777216: 67174656,
						17825792: 65540,
						18874368: 65536,
						19922944: 67109120,
						20971520: 256,
						22020096: 67174660,
						23068672: 67108868,
						24117248: 0,
						25165824: 67109124,
						26214400: 67108864,
						27262976: 4,
						28311552: 65792,
						29360128: 67174400,
						30408704: 260,
						31457280: 65796,
						32505856: 67174404,
						17301504: 67108864,
						18350080: 260,
						19398656: 67174656,
						20447232: 0,
						21495808: 65540,
						22544384: 67109120,
						23592960: 256,
						24641536: 67174404,
						25690112: 65536,
						26738688: 67174660,
						27787264: 65796,
						28835840: 67108868,
						29884416: 67109124,
						30932992: 67174400,
						31981568: 4,
						33030144: 65792
					},
					{
						0: 2151682048,
						65536: 2147487808,
						131072: 4198464,
						196608: 2151677952,
						262144: 0,
						327680: 4198400,
						393216: 2147483712,
						458752: 4194368,
						524288: 2147483648,
						589824: 4194304,
						655360: 64,
						720896: 2147487744,
						786432: 2151678016,
						851968: 4160,
						917504: 4096,
						983040: 2151682112,
						32768: 2147487808,
						98304: 64,
						163840: 2151678016,
						229376: 2147487744,
						294912: 4198400,
						360448: 2151682112,
						425984: 0,
						491520: 2151677952,
						557056: 4096,
						622592: 2151682048,
						688128: 4194304,
						753664: 4160,
						819200: 2147483648,
						884736: 4194368,
						950272: 4198464,
						1015808: 2147483712,
						1048576: 4194368,
						1114112: 4198400,
						1179648: 2147483712,
						1245184: 0,
						1310720: 4160,
						1376256: 2151678016,
						1441792: 2151682048,
						1507328: 2147487808,
						1572864: 2151682112,
						1638400: 2147483648,
						1703936: 2151677952,
						1769472: 4198464,
						1835008: 2147487744,
						1900544: 4194304,
						1966080: 64,
						2031616: 4096,
						1081344: 2151677952,
						1146880: 2151682112,
						1212416: 0,
						1277952: 4198400,
						1343488: 4194368,
						1409024: 2147483648,
						1474560: 2147487808,
						1540096: 64,
						1605632: 2147483712,
						1671168: 4096,
						1736704: 2147487744,
						1802240: 2151678016,
						1867776: 4160,
						1933312: 2151682048,
						1998848: 4194304,
						2064384: 4198464
					},
					{
						0: 128,
						4096: 17039360,
						8192: 262144,
						12288: 536870912,
						16384: 537133184,
						20480: 16777344,
						24576: 553648256,
						28672: 262272,
						32768: 16777216,
						36864: 537133056,
						40960: 536871040,
						45056: 553910400,
						49152: 553910272,
						53248: 0,
						57344: 17039488,
						61440: 553648128,
						2048: 17039488,
						6144: 553648256,
						10240: 128,
						14336: 17039360,
						18432: 262144,
						22528: 537133184,
						26624: 553910272,
						30720: 536870912,
						34816: 537133056,
						38912: 0,
						43008: 553910400,
						47104: 16777344,
						51200: 536871040,
						55296: 553648128,
						59392: 16777216,
						63488: 262272,
						65536: 262144,
						69632: 128,
						73728: 536870912,
						77824: 553648256,
						81920: 16777344,
						86016: 553910272,
						90112: 537133184,
						94208: 16777216,
						98304: 553910400,
						102400: 553648128,
						106496: 17039360,
						110592: 537133056,
						114688: 262272,
						118784: 536871040,
						122880: 0,
						126976: 17039488,
						67584: 553648256,
						71680: 16777216,
						75776: 17039360,
						79872: 537133184,
						83968: 536870912,
						88064: 17039488,
						92160: 128,
						96256: 553910272,
						100352: 262272,
						104448: 553910400,
						108544: 0,
						112640: 553648128,
						116736: 16777344,
						120832: 262144,
						124928: 537133056,
						129024: 536871040
					},
					{
						0: 268435464,
						256: 8192,
						512: 270532608,
						768: 270540808,
						1024: 268443648,
						1280: 2097152,
						1536: 2097160,
						1792: 268435456,
						2048: 0,
						2304: 268443656,
						2560: 2105344,
						2816: 8,
						3072: 270532616,
						3328: 2105352,
						3584: 8200,
						3840: 270540800,
						128: 270532608,
						384: 270540808,
						640: 8,
						896: 2097152,
						1152: 2105352,
						1408: 268435464,
						1664: 268443648,
						1920: 8200,
						2176: 2097160,
						2432: 8192,
						2688: 268443656,
						2944: 270532616,
						3200: 0,
						3456: 270540800,
						3712: 2105344,
						3968: 268435456,
						4096: 268443648,
						4352: 270532616,
						4608: 270540808,
						4864: 8200,
						5120: 2097152,
						5376: 268435456,
						5632: 268435464,
						5888: 2105344,
						6144: 2105352,
						6400: 0,
						6656: 8,
						6912: 270532608,
						7168: 8192,
						7424: 268443656,
						7680: 270540800,
						7936: 2097160,
						4224: 8,
						4480: 2105344,
						4736: 2097152,
						4992: 268435464,
						5248: 268443648,
						5504: 8200,
						5760: 270540808,
						6016: 270532608,
						6272: 270540800,
						6528: 270532616,
						6784: 8192,
						7040: 2105352,
						7296: 2097160,
						7552: 0,
						7808: 268435456,
						8064: 268443656
					},
					{
						0: 1048576,
						16: 33555457,
						32: 1024,
						48: 1049601,
						64: 34604033,
						80: 0,
						96: 1,
						112: 34603009,
						128: 33555456,
						144: 1048577,
						160: 33554433,
						176: 34604032,
						192: 34603008,
						208: 1025,
						224: 1049600,
						240: 33554432,
						8: 34603009,
						24: 0,
						40: 33555457,
						56: 34604032,
						72: 1048576,
						88: 33554433,
						104: 33554432,
						120: 1025,
						136: 1049601,
						152: 33555456,
						168: 34603008,
						184: 1048577,
						200: 1024,
						216: 34604033,
						232: 1,
						248: 1049600,
						256: 33554432,
						272: 1048576,
						288: 33555457,
						304: 34603009,
						320: 1048577,
						336: 33555456,
						352: 34604032,
						368: 1049601,
						384: 1025,
						400: 34604033,
						416: 1049600,
						432: 1,
						448: 0,
						464: 34603008,
						480: 33554433,
						496: 1024,
						264: 1049600,
						280: 33555457,
						296: 34603009,
						312: 1,
						328: 33554432,
						344: 1048576,
						360: 1025,
						376: 34604032,
						392: 33554433,
						408: 34603008,
						424: 0,
						440: 34604033,
						456: 1049601,
						472: 1024,
						488: 33555456,
						504: 1048577
					},
					{
						0: 134219808,
						1: 131072,
						2: 134217728,
						3: 32,
						4: 131104,
						5: 134350880,
						6: 134350848,
						7: 2048,
						8: 134348800,
						9: 134219776,
						10: 133120,
						11: 134348832,
						12: 2080,
						13: 0,
						14: 134217760,
						15: 133152,
						2147483648: 2048,
						2147483649: 134350880,
						2147483650: 134219808,
						2147483651: 134217728,
						2147483652: 134348800,
						2147483653: 133120,
						2147483654: 133152,
						2147483655: 32,
						2147483656: 134217760,
						2147483657: 2080,
						2147483658: 131104,
						2147483659: 134350848,
						2147483660: 0,
						2147483661: 134348832,
						2147483662: 134219776,
						2147483663: 131072,
						16: 133152,
						17: 134350848,
						18: 32,
						19: 2048,
						20: 134219776,
						21: 134217760,
						22: 134348832,
						23: 131072,
						24: 0,
						25: 131104,
						26: 134348800,
						27: 134219808,
						28: 134350880,
						29: 133120,
						30: 2080,
						31: 134217728,
						2147483664: 131072,
						2147483665: 2048,
						2147483666: 134348832,
						2147483667: 133152,
						2147483668: 32,
						2147483669: 134348800,
						2147483670: 134217728,
						2147483671: 134219808,
						2147483672: 134350880,
						2147483673: 134217760,
						2147483674: 134219776,
						2147483675: 0,
						2147483676: 133120,
						2147483677: 2080,
						2147483678: 131104,
						2147483679: 134350848
					}
				];
				var SBOX_MASK = [
					4160749569,
					528482304,
					33030144,
					2064384,
					129024,
					8064,
					504,
					2147483679
				];
				/**
				* DES block cipher algorithm.
				*/
				var DES = C_algo.DES = BlockCipher.extend({
					_doReset: function() {
						var keyWords = this._key.words;
						var keyBits = [];
						for (var i = 0; i < 56; i++) {
							var keyBitPos = PC1[i] - 1;
							keyBits[i] = keyWords[keyBitPos >>> 5] >>> 31 - keyBitPos % 32 & 1;
						}
						var subKeys = this._subKeys = [];
						for (var nSubKey = 0; nSubKey < 16; nSubKey++) {
							var subKey = subKeys[nSubKey] = [];
							var bitShift = BIT_SHIFTS[nSubKey];
							for (var i = 0; i < 24; i++) {
								subKey[i / 6 | 0] |= keyBits[(PC2[i] - 1 + bitShift) % 28] << 31 - i % 6;
								subKey[4 + (i / 6 | 0)] |= keyBits[28 + (PC2[i + 24] - 1 + bitShift) % 28] << 31 - i % 6;
							}
							subKey[0] = subKey[0] << 1 | subKey[0] >>> 31;
							for (var i = 1; i < 7; i++) subKey[i] = subKey[i] >>> (i - 1) * 4 + 3;
							subKey[7] = subKey[7] << 5 | subKey[7] >>> 27;
						}
						var invSubKeys = this._invSubKeys = [];
						for (var i = 0; i < 16; i++) invSubKeys[i] = subKeys[15 - i];
					},
					encryptBlock: function(M, offset) {
						this._doCryptBlock(M, offset, this._subKeys);
					},
					decryptBlock: function(M, offset) {
						this._doCryptBlock(M, offset, this._invSubKeys);
					},
					_doCryptBlock: function(M, offset, subKeys) {
						this._lBlock = M[offset];
						this._rBlock = M[offset + 1];
						exchangeLR.call(this, 4, 252645135);
						exchangeLR.call(this, 16, 65535);
						exchangeRL.call(this, 2, 858993459);
						exchangeRL.call(this, 8, 16711935);
						exchangeLR.call(this, 1, 1431655765);
						for (var round = 0; round < 16; round++) {
							var subKey = subKeys[round];
							var lBlock = this._lBlock;
							var rBlock = this._rBlock;
							var f = 0;
							for (var i = 0; i < 8; i++) f |= SBOX_P[i][((rBlock ^ subKey[i]) & SBOX_MASK[i]) >>> 0];
							this._lBlock = rBlock;
							this._rBlock = lBlock ^ f;
						}
						var t = this._lBlock;
						this._lBlock = this._rBlock;
						this._rBlock = t;
						exchangeLR.call(this, 1, 1431655765);
						exchangeRL.call(this, 8, 16711935);
						exchangeRL.call(this, 2, 858993459);
						exchangeLR.call(this, 16, 65535);
						exchangeLR.call(this, 4, 252645135);
						M[offset] = this._lBlock;
						M[offset + 1] = this._rBlock;
					},
					keySize: 2,
					ivSize: 2,
					blockSize: 2
				});
				function exchangeLR(offset, mask) {
					var t = (this._lBlock >>> offset ^ this._rBlock) & mask;
					this._rBlock ^= t;
					this._lBlock ^= t << offset;
				}
				function exchangeRL(offset, mask) {
					var t = (this._rBlock >>> offset ^ this._lBlock) & mask;
					this._lBlock ^= t;
					this._rBlock ^= t << offset;
				}
				/**
				* Shortcut functions to the cipher's object interface.
				*
				* @example
				*
				*     var ciphertext = CryptoJS.DES.encrypt(message, key, cfg);
				*     var plaintext  = CryptoJS.DES.decrypt(ciphertext, key, cfg);
				*/
				C.DES = BlockCipher._createHelper(DES);
				/**
				* Triple-DES block cipher algorithm.
				*/
				var TripleDES = C_algo.TripleDES = BlockCipher.extend({
					_doReset: function() {
						var keyWords = this._key.words;
						if (keyWords.length !== 2 && keyWords.length !== 4 && keyWords.length < 6) throw new Error("Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.");
						var key1 = keyWords.slice(0, 2);
						var key2 = keyWords.length < 4 ? keyWords.slice(0, 2) : keyWords.slice(2, 4);
						var key3 = keyWords.length < 6 ? keyWords.slice(0, 2) : keyWords.slice(4, 6);
						this._des1 = DES.createEncryptor(WordArray.create(key1));
						this._des2 = DES.createEncryptor(WordArray.create(key2));
						this._des3 = DES.createEncryptor(WordArray.create(key3));
					},
					encryptBlock: function(M, offset) {
						this._des1.encryptBlock(M, offset);
						this._des2.decryptBlock(M, offset);
						this._des3.encryptBlock(M, offset);
					},
					decryptBlock: function(M, offset) {
						this._des3.decryptBlock(M, offset);
						this._des2.encryptBlock(M, offset);
						this._des1.decryptBlock(M, offset);
					},
					keySize: 6,
					ivSize: 2,
					blockSize: 2
				});
				/**
				* Shortcut functions to the cipher's object interface.
				*
				* @example
				*
				*     var ciphertext = CryptoJS.TripleDES.encrypt(message, key, cfg);
				*     var plaintext  = CryptoJS.TripleDES.decrypt(ciphertext, key, cfg);
				*/
				C.TripleDES = BlockCipher._createHelper(TripleDES);
			})();
			return CryptoJS.TripleDES;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/rc4.js
	var require_rc4 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory, undef) {
			if (typeof exports === "object") module.exports = exports = factory(require_core(), require_enc_base64(), require_md5(), require_evpkdf(), require_cipher_core());
			else if (typeof define === "function" && define.amd) define([
				"./core",
				"./enc-base64",
				"./md5",
				"./evpkdf",
				"./cipher-core"
			], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			(function() {
				var C = CryptoJS;
				var StreamCipher = C.lib.StreamCipher;
				var C_algo = C.algo;
				/**
				* RC4 stream cipher algorithm.
				*/
				var RC4 = C_algo.RC4 = StreamCipher.extend({
					_doReset: function() {
						var key = this._key;
						var keyWords = key.words;
						var keySigBytes = key.sigBytes;
						var S = this._S = [];
						for (var i = 0; i < 256; i++) S[i] = i;
						for (var i = 0, j = 0; i < 256; i++) {
							var keyByteIndex = i % keySigBytes;
							var keyByte = keyWords[keyByteIndex >>> 2] >>> 24 - keyByteIndex % 4 * 8 & 255;
							j = (j + S[i] + keyByte) % 256;
							var t = S[i];
							S[i] = S[j];
							S[j] = t;
						}
						this._i = this._j = 0;
					},
					_doProcessBlock: function(M, offset) {
						M[offset] ^= generateKeystreamWord.call(this);
					},
					keySize: 8,
					ivSize: 0
				});
				function generateKeystreamWord() {
					var S = this._S;
					var i = this._i;
					var j = this._j;
					var keystreamWord = 0;
					for (var n = 0; n < 4; n++) {
						i = (i + 1) % 256;
						j = (j + S[i]) % 256;
						var t = S[i];
						S[i] = S[j];
						S[j] = t;
						keystreamWord |= S[(S[i] + S[j]) % 256] << 24 - n * 8;
					}
					this._i = i;
					this._j = j;
					return keystreamWord;
				}
				/**
				* Shortcut functions to the cipher's object interface.
				*
				* @example
				*
				*     var ciphertext = CryptoJS.RC4.encrypt(message, key, cfg);
				*     var plaintext  = CryptoJS.RC4.decrypt(ciphertext, key, cfg);
				*/
				C.RC4 = StreamCipher._createHelper(RC4);
				/**
				* Modified RC4 stream cipher algorithm.
				*/
				var RC4Drop = C_algo.RC4Drop = RC4.extend({
					/**
					* Configuration options.
					*
					* @property {number} drop The number of keystream words to drop. Default 192
					*/
					cfg: RC4.cfg.extend({ drop: 192 }),
					_doReset: function() {
						RC4._doReset.call(this);
						for (var i = this.cfg.drop; i > 0; i--) generateKeystreamWord.call(this);
					}
				});
				/**
				* Shortcut functions to the cipher's object interface.
				*
				* @example
				*
				*     var ciphertext = CryptoJS.RC4Drop.encrypt(message, key, cfg);
				*     var plaintext  = CryptoJS.RC4Drop.decrypt(ciphertext, key, cfg);
				*/
				C.RC4Drop = StreamCipher._createHelper(RC4Drop);
			})();
			return CryptoJS.RC4;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/rabbit.js
	var require_rabbit = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory, undef) {
			if (typeof exports === "object") module.exports = exports = factory(require_core(), require_enc_base64(), require_md5(), require_evpkdf(), require_cipher_core());
			else if (typeof define === "function" && define.amd) define([
				"./core",
				"./enc-base64",
				"./md5",
				"./evpkdf",
				"./cipher-core"
			], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			(function() {
				var C = CryptoJS;
				var StreamCipher = C.lib.StreamCipher;
				var C_algo = C.algo;
				var S = [];
				var C_ = [];
				var G = [];
				/**
				* Rabbit stream cipher algorithm
				*/
				var Rabbit = C_algo.Rabbit = StreamCipher.extend({
					_doReset: function() {
						var K = this._key.words;
						var iv = this.cfg.iv;
						for (var i = 0; i < 4; i++) K[i] = (K[i] << 8 | K[i] >>> 24) & 16711935 | (K[i] << 24 | K[i] >>> 8) & 4278255360;
						var X = this._X = [
							K[0],
							K[3] << 16 | K[2] >>> 16,
							K[1],
							K[0] << 16 | K[3] >>> 16,
							K[2],
							K[1] << 16 | K[0] >>> 16,
							K[3],
							K[2] << 16 | K[1] >>> 16
						];
						var C = this._C = [
							K[2] << 16 | K[2] >>> 16,
							K[0] & 4294901760 | K[1] & 65535,
							K[3] << 16 | K[3] >>> 16,
							K[1] & 4294901760 | K[2] & 65535,
							K[0] << 16 | K[0] >>> 16,
							K[2] & 4294901760 | K[3] & 65535,
							K[1] << 16 | K[1] >>> 16,
							K[3] & 4294901760 | K[0] & 65535
						];
						this._b = 0;
						for (var i = 0; i < 4; i++) nextState.call(this);
						for (var i = 0; i < 8; i++) C[i] ^= X[i + 4 & 7];
						if (iv) {
							var IV = iv.words;
							var IV_0 = IV[0];
							var IV_1 = IV[1];
							var i0 = (IV_0 << 8 | IV_0 >>> 24) & 16711935 | (IV_0 << 24 | IV_0 >>> 8) & 4278255360;
							var i2 = (IV_1 << 8 | IV_1 >>> 24) & 16711935 | (IV_1 << 24 | IV_1 >>> 8) & 4278255360;
							var i1 = i0 >>> 16 | i2 & 4294901760;
							var i3 = i2 << 16 | i0 & 65535;
							C[0] ^= i0;
							C[1] ^= i1;
							C[2] ^= i2;
							C[3] ^= i3;
							C[4] ^= i0;
							C[5] ^= i1;
							C[6] ^= i2;
							C[7] ^= i3;
							for (var i = 0; i < 4; i++) nextState.call(this);
						}
					},
					_doProcessBlock: function(M, offset) {
						var X = this._X;
						nextState.call(this);
						S[0] = X[0] ^ X[5] >>> 16 ^ X[3] << 16;
						S[1] = X[2] ^ X[7] >>> 16 ^ X[5] << 16;
						S[2] = X[4] ^ X[1] >>> 16 ^ X[7] << 16;
						S[3] = X[6] ^ X[3] >>> 16 ^ X[1] << 16;
						for (var i = 0; i < 4; i++) {
							S[i] = (S[i] << 8 | S[i] >>> 24) & 16711935 | (S[i] << 24 | S[i] >>> 8) & 4278255360;
							M[offset + i] ^= S[i];
						}
					},
					blockSize: 4,
					ivSize: 2
				});
				function nextState() {
					var X = this._X;
					var C = this._C;
					for (var i = 0; i < 8; i++) C_[i] = C[i];
					C[0] = C[0] + 1295307597 + this._b | 0;
					C[1] = C[1] + 3545052371 + (C[0] >>> 0 < C_[0] >>> 0 ? 1 : 0) | 0;
					C[2] = C[2] + 886263092 + (C[1] >>> 0 < C_[1] >>> 0 ? 1 : 0) | 0;
					C[3] = C[3] + 1295307597 + (C[2] >>> 0 < C_[2] >>> 0 ? 1 : 0) | 0;
					C[4] = C[4] + 3545052371 + (C[3] >>> 0 < C_[3] >>> 0 ? 1 : 0) | 0;
					C[5] = C[5] + 886263092 + (C[4] >>> 0 < C_[4] >>> 0 ? 1 : 0) | 0;
					C[6] = C[6] + 1295307597 + (C[5] >>> 0 < C_[5] >>> 0 ? 1 : 0) | 0;
					C[7] = C[7] + 3545052371 + (C[6] >>> 0 < C_[6] >>> 0 ? 1 : 0) | 0;
					this._b = C[7] >>> 0 < C_[7] >>> 0 ? 1 : 0;
					for (var i = 0; i < 8; i++) {
						var gx = X[i] + C[i];
						var ga = gx & 65535;
						var gb = gx >>> 16;
						var gh = ((ga * ga >>> 17) + ga * gb >>> 15) + gb * gb;
						var gl = ((gx & 4294901760) * gx | 0) + ((gx & 65535) * gx | 0);
						G[i] = gh ^ gl;
					}
					X[0] = G[0] + (G[7] << 16 | G[7] >>> 16) + (G[6] << 16 | G[6] >>> 16) | 0;
					X[1] = G[1] + (G[0] << 8 | G[0] >>> 24) + G[7] | 0;
					X[2] = G[2] + (G[1] << 16 | G[1] >>> 16) + (G[0] << 16 | G[0] >>> 16) | 0;
					X[3] = G[3] + (G[2] << 8 | G[2] >>> 24) + G[1] | 0;
					X[4] = G[4] + (G[3] << 16 | G[3] >>> 16) + (G[2] << 16 | G[2] >>> 16) | 0;
					X[5] = G[5] + (G[4] << 8 | G[4] >>> 24) + G[3] | 0;
					X[6] = G[6] + (G[5] << 16 | G[5] >>> 16) + (G[4] << 16 | G[4] >>> 16) | 0;
					X[7] = G[7] + (G[6] << 8 | G[6] >>> 24) + G[5] | 0;
				}
				/**
				* Shortcut functions to the cipher's object interface.
				*
				* @example
				*
				*     var ciphertext = CryptoJS.Rabbit.encrypt(message, key, cfg);
				*     var plaintext  = CryptoJS.Rabbit.decrypt(ciphertext, key, cfg);
				*/
				C.Rabbit = StreamCipher._createHelper(Rabbit);
			})();
			return CryptoJS.Rabbit;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/rabbit-legacy.js
	var require_rabbit_legacy = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory, undef) {
			if (typeof exports === "object") module.exports = exports = factory(require_core(), require_enc_base64(), require_md5(), require_evpkdf(), require_cipher_core());
			else if (typeof define === "function" && define.amd) define([
				"./core",
				"./enc-base64",
				"./md5",
				"./evpkdf",
				"./cipher-core"
			], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			(function() {
				var C = CryptoJS;
				var StreamCipher = C.lib.StreamCipher;
				var C_algo = C.algo;
				var S = [];
				var C_ = [];
				var G = [];
				/**
				* Rabbit stream cipher algorithm.
				*
				* This is a legacy version that neglected to convert the key to little-endian.
				* This error doesn't affect the cipher's security,
				* but it does affect its compatibility with other implementations.
				*/
				var RabbitLegacy = C_algo.RabbitLegacy = StreamCipher.extend({
					_doReset: function() {
						var K = this._key.words;
						var iv = this.cfg.iv;
						var X = this._X = [
							K[0],
							K[3] << 16 | K[2] >>> 16,
							K[1],
							K[0] << 16 | K[3] >>> 16,
							K[2],
							K[1] << 16 | K[0] >>> 16,
							K[3],
							K[2] << 16 | K[1] >>> 16
						];
						var C = this._C = [
							K[2] << 16 | K[2] >>> 16,
							K[0] & 4294901760 | K[1] & 65535,
							K[3] << 16 | K[3] >>> 16,
							K[1] & 4294901760 | K[2] & 65535,
							K[0] << 16 | K[0] >>> 16,
							K[2] & 4294901760 | K[3] & 65535,
							K[1] << 16 | K[1] >>> 16,
							K[3] & 4294901760 | K[0] & 65535
						];
						this._b = 0;
						for (var i = 0; i < 4; i++) nextState.call(this);
						for (var i = 0; i < 8; i++) C[i] ^= X[i + 4 & 7];
						if (iv) {
							var IV = iv.words;
							var IV_0 = IV[0];
							var IV_1 = IV[1];
							var i0 = (IV_0 << 8 | IV_0 >>> 24) & 16711935 | (IV_0 << 24 | IV_0 >>> 8) & 4278255360;
							var i2 = (IV_1 << 8 | IV_1 >>> 24) & 16711935 | (IV_1 << 24 | IV_1 >>> 8) & 4278255360;
							var i1 = i0 >>> 16 | i2 & 4294901760;
							var i3 = i2 << 16 | i0 & 65535;
							C[0] ^= i0;
							C[1] ^= i1;
							C[2] ^= i2;
							C[3] ^= i3;
							C[4] ^= i0;
							C[5] ^= i1;
							C[6] ^= i2;
							C[7] ^= i3;
							for (var i = 0; i < 4; i++) nextState.call(this);
						}
					},
					_doProcessBlock: function(M, offset) {
						var X = this._X;
						nextState.call(this);
						S[0] = X[0] ^ X[5] >>> 16 ^ X[3] << 16;
						S[1] = X[2] ^ X[7] >>> 16 ^ X[5] << 16;
						S[2] = X[4] ^ X[1] >>> 16 ^ X[7] << 16;
						S[3] = X[6] ^ X[3] >>> 16 ^ X[1] << 16;
						for (var i = 0; i < 4; i++) {
							S[i] = (S[i] << 8 | S[i] >>> 24) & 16711935 | (S[i] << 24 | S[i] >>> 8) & 4278255360;
							M[offset + i] ^= S[i];
						}
					},
					blockSize: 4,
					ivSize: 2
				});
				function nextState() {
					var X = this._X;
					var C = this._C;
					for (var i = 0; i < 8; i++) C_[i] = C[i];
					C[0] = C[0] + 1295307597 + this._b | 0;
					C[1] = C[1] + 3545052371 + (C[0] >>> 0 < C_[0] >>> 0 ? 1 : 0) | 0;
					C[2] = C[2] + 886263092 + (C[1] >>> 0 < C_[1] >>> 0 ? 1 : 0) | 0;
					C[3] = C[3] + 1295307597 + (C[2] >>> 0 < C_[2] >>> 0 ? 1 : 0) | 0;
					C[4] = C[4] + 3545052371 + (C[3] >>> 0 < C_[3] >>> 0 ? 1 : 0) | 0;
					C[5] = C[5] + 886263092 + (C[4] >>> 0 < C_[4] >>> 0 ? 1 : 0) | 0;
					C[6] = C[6] + 1295307597 + (C[5] >>> 0 < C_[5] >>> 0 ? 1 : 0) | 0;
					C[7] = C[7] + 3545052371 + (C[6] >>> 0 < C_[6] >>> 0 ? 1 : 0) | 0;
					this._b = C[7] >>> 0 < C_[7] >>> 0 ? 1 : 0;
					for (var i = 0; i < 8; i++) {
						var gx = X[i] + C[i];
						var ga = gx & 65535;
						var gb = gx >>> 16;
						var gh = ((ga * ga >>> 17) + ga * gb >>> 15) + gb * gb;
						var gl = ((gx & 4294901760) * gx | 0) + ((gx & 65535) * gx | 0);
						G[i] = gh ^ gl;
					}
					X[0] = G[0] + (G[7] << 16 | G[7] >>> 16) + (G[6] << 16 | G[6] >>> 16) | 0;
					X[1] = G[1] + (G[0] << 8 | G[0] >>> 24) + G[7] | 0;
					X[2] = G[2] + (G[1] << 16 | G[1] >>> 16) + (G[0] << 16 | G[0] >>> 16) | 0;
					X[3] = G[3] + (G[2] << 8 | G[2] >>> 24) + G[1] | 0;
					X[4] = G[4] + (G[3] << 16 | G[3] >>> 16) + (G[2] << 16 | G[2] >>> 16) | 0;
					X[5] = G[5] + (G[4] << 8 | G[4] >>> 24) + G[3] | 0;
					X[6] = G[6] + (G[5] << 16 | G[5] >>> 16) + (G[4] << 16 | G[4] >>> 16) | 0;
					X[7] = G[7] + (G[6] << 8 | G[6] >>> 24) + G[5] | 0;
				}
				/**
				* Shortcut functions to the cipher's object interface.
				*
				* @example
				*
				*     var ciphertext = CryptoJS.RabbitLegacy.encrypt(message, key, cfg);
				*     var plaintext  = CryptoJS.RabbitLegacy.decrypt(ciphertext, key, cfg);
				*/
				C.RabbitLegacy = StreamCipher._createHelper(RabbitLegacy);
			})();
			return CryptoJS.RabbitLegacy;
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/blowfish.js
	var require_blowfish = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory, undef) {
			if (typeof exports === "object") module.exports = exports = factory(require_core(), require_enc_base64(), require_md5(), require_evpkdf(), require_cipher_core());
			else if (typeof define === "function" && define.amd) define([
				"./core",
				"./enc-base64",
				"./md5",
				"./evpkdf",
				"./cipher-core"
			], factory);
			else factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			(function() {
				var C = CryptoJS;
				var BlockCipher = C.lib.BlockCipher;
				var C_algo = C.algo;
				const N = 16;
				const ORIG_P = [
					608135816,
					2242054355,
					320440878,
					57701188,
					2752067618,
					698298832,
					137296536,
					3964562569,
					1160258022,
					953160567,
					3193202383,
					887688300,
					3232508343,
					3380367581,
					1065670069,
					3041331479,
					2450970073,
					2306472731
				];
				const ORIG_S = [
					[
						3509652390,
						2564797868,
						805139163,
						3491422135,
						3101798381,
						1780907670,
						3128725573,
						4046225305,
						614570311,
						3012652279,
						134345442,
						2240740374,
						1667834072,
						1901547113,
						2757295779,
						4103290238,
						227898511,
						1921955416,
						1904987480,
						2182433518,
						2069144605,
						3260701109,
						2620446009,
						720527379,
						3318853667,
						677414384,
						3393288472,
						3101374703,
						2390351024,
						1614419982,
						1822297739,
						2954791486,
						3608508353,
						3174124327,
						2024746970,
						1432378464,
						3864339955,
						2857741204,
						1464375394,
						1676153920,
						1439316330,
						715854006,
						3033291828,
						289532110,
						2706671279,
						2087905683,
						3018724369,
						1668267050,
						732546397,
						1947742710,
						3462151702,
						2609353502,
						2950085171,
						1814351708,
						2050118529,
						680887927,
						999245976,
						1800124847,
						3300911131,
						1713906067,
						1641548236,
						4213287313,
						1216130144,
						1575780402,
						4018429277,
						3917837745,
						3693486850,
						3949271944,
						596196993,
						3549867205,
						258830323,
						2213823033,
						772490370,
						2760122372,
						1774776394,
						2652871518,
						566650946,
						4142492826,
						1728879713,
						2882767088,
						1783734482,
						3629395816,
						2517608232,
						2874225571,
						1861159788,
						326777828,
						3124490320,
						2130389656,
						2716951837,
						967770486,
						1724537150,
						2185432712,
						2364442137,
						1164943284,
						2105845187,
						998989502,
						3765401048,
						2244026483,
						1075463327,
						1455516326,
						1322494562,
						910128902,
						469688178,
						1117454909,
						936433444,
						3490320968,
						3675253459,
						1240580251,
						122909385,
						2157517691,
						634681816,
						4142456567,
						3825094682,
						3061402683,
						2540495037,
						79693498,
						3249098678,
						1084186820,
						1583128258,
						426386531,
						1761308591,
						1047286709,
						322548459,
						995290223,
						1845252383,
						2603652396,
						3431023940,
						2942221577,
						3202600964,
						3727903485,
						1712269319,
						422464435,
						3234572375,
						1170764815,
						3523960633,
						3117677531,
						1434042557,
						442511882,
						3600875718,
						1076654713,
						1738483198,
						4213154764,
						2393238008,
						3677496056,
						1014306527,
						4251020053,
						793779912,
						2902807211,
						842905082,
						4246964064,
						1395751752,
						1040244610,
						2656851899,
						3396308128,
						445077038,
						3742853595,
						3577915638,
						679411651,
						2892444358,
						2354009459,
						1767581616,
						3150600392,
						3791627101,
						3102740896,
						284835224,
						4246832056,
						1258075500,
						768725851,
						2589189241,
						3069724005,
						3532540348,
						1274779536,
						3789419226,
						2764799539,
						1660621633,
						3471099624,
						4011903706,
						913787905,
						3497959166,
						737222580,
						2514213453,
						2928710040,
						3937242737,
						1804850592,
						3499020752,
						2949064160,
						2386320175,
						2390070455,
						2415321851,
						4061277028,
						2290661394,
						2416832540,
						1336762016,
						1754252060,
						3520065937,
						3014181293,
						791618072,
						3188594551,
						3933548030,
						2332172193,
						3852520463,
						3043980520,
						413987798,
						3465142937,
						3030929376,
						4245938359,
						2093235073,
						3534596313,
						375366246,
						2157278981,
						2479649556,
						555357303,
						3870105701,
						2008414854,
						3344188149,
						4221384143,
						3956125452,
						2067696032,
						3594591187,
						2921233993,
						2428461,
						544322398,
						577241275,
						1471733935,
						610547355,
						4027169054,
						1432588573,
						1507829418,
						2025931657,
						3646575487,
						545086370,
						48609733,
						2200306550,
						1653985193,
						298326376,
						1316178497,
						3007786442,
						2064951626,
						458293330,
						2589141269,
						3591329599,
						3164325604,
						727753846,
						2179363840,
						146436021,
						1461446943,
						4069977195,
						705550613,
						3059967265,
						3887724982,
						4281599278,
						3313849956,
						1404054877,
						2845806497,
						146425753,
						1854211946
					],
					[
						1266315497,
						3048417604,
						3681880366,
						3289982499,
						290971e4,
						1235738493,
						2632868024,
						2414719590,
						3970600049,
						1771706367,
						1449415276,
						3266420449,
						422970021,
						1963543593,
						2690192192,
						3826793022,
						1062508698,
						1531092325,
						1804592342,
						2583117782,
						2714934279,
						4024971509,
						1294809318,
						4028980673,
						1289560198,
						2221992742,
						1669523910,
						35572830,
						157838143,
						1052438473,
						1016535060,
						1802137761,
						1753167236,
						1386275462,
						3080475397,
						2857371447,
						1040679964,
						2145300060,
						2390574316,
						1461121720,
						2956646967,
						4031777805,
						4028374788,
						33600511,
						2920084762,
						1018524850,
						629373528,
						3691585981,
						3515945977,
						2091462646,
						2486323059,
						586499841,
						988145025,
						935516892,
						3367335476,
						2599673255,
						2839830854,
						265290510,
						3972581182,
						2759138881,
						3795373465,
						1005194799,
						847297441,
						406762289,
						1314163512,
						1332590856,
						1866599683,
						4127851711,
						750260880,
						613907577,
						1450815602,
						3165620655,
						3734664991,
						3650291728,
						3012275730,
						3704569646,
						1427272223,
						778793252,
						1343938022,
						2676280711,
						2052605720,
						1946737175,
						3164576444,
						3914038668,
						3967478842,
						3682934266,
						1661551462,
						3294938066,
						4011595847,
						840292616,
						3712170807,
						616741398,
						312560963,
						711312465,
						1351876610,
						322626781,
						1910503582,
						271666773,
						2175563734,
						1594956187,
						70604529,
						3617834859,
						1007753275,
						1495573769,
						4069517037,
						2549218298,
						2663038764,
						504708206,
						2263041392,
						3941167025,
						2249088522,
						1514023603,
						1998579484,
						1312622330,
						694541497,
						2582060303,
						2151582166,
						1382467621,
						776784248,
						2618340202,
						3323268794,
						2497899128,
						2784771155,
						503983604,
						4076293799,
						907881277,
						423175695,
						432175456,
						1378068232,
						4145222326,
						3954048622,
						3938656102,
						3820766613,
						2793130115,
						2977904593,
						26017576,
						3274890735,
						3194772133,
						1700274565,
						1756076034,
						4006520079,
						3677328699,
						720338349,
						1533947780,
						354530856,
						688349552,
						3973924725,
						1637815568,
						332179504,
						3949051286,
						53804574,
						2852348879,
						3044236432,
						1282449977,
						3583942155,
						3416972820,
						4006381244,
						1617046695,
						2628476075,
						3002303598,
						1686838959,
						431878346,
						2686675385,
						1700445008,
						1080580658,
						1009431731,
						832498133,
						3223435511,
						2605976345,
						2271191193,
						2516031870,
						1648197032,
						4164389018,
						2548247927,
						300782431,
						375919233,
						238389289,
						3353747414,
						2531188641,
						2019080857,
						1475708069,
						455242339,
						2609103871,
						448939670,
						3451063019,
						1395535956,
						2413381860,
						1841049896,
						1491858159,
						885456874,
						4264095073,
						4001119347,
						1565136089,
						3898914787,
						1108368660,
						540939232,
						1173283510,
						2745871338,
						3681308437,
						4207628240,
						3343053890,
						4016749493,
						1699691293,
						1103962373,
						3625875870,
						2256883143,
						3830138730,
						1031889488,
						3479347698,
						1535977030,
						4236805024,
						3251091107,
						2132092099,
						1774941330,
						1199868427,
						1452454533,
						157007616,
						2904115357,
						342012276,
						595725824,
						1480756522,
						206960106,
						497939518,
						591360097,
						863170706,
						2375253569,
						3596610801,
						1814182875,
						2094937945,
						3421402208,
						1082520231,
						3463918190,
						2785509508,
						435703966,
						3908032597,
						1641649973,
						2842273706,
						3305899714,
						1510255612,
						2148256476,
						2655287854,
						3276092548,
						4258621189,
						236887753,
						3681803219,
						274041037,
						1734335097,
						3815195456,
						3317970021,
						1899903192,
						1026095262,
						4050517792,
						356393447,
						2410691914,
						3873677099,
						3682840055
					],
					[
						3913112168,
						2491498743,
						4132185628,
						2489919796,
						1091903735,
						1979897079,
						3170134830,
						3567386728,
						3557303409,
						857797738,
						1136121015,
						1342202287,
						507115054,
						2535736646,
						337727348,
						3213592640,
						1301675037,
						2528481711,
						1895095763,
						1721773893,
						3216771564,
						62756741,
						2142006736,
						835421444,
						2531993523,
						1442658625,
						3659876326,
						2882144922,
						676362277,
						1392781812,
						170690266,
						3921047035,
						1759253602,
						3611846912,
						1745797284,
						664899054,
						1329594018,
						3901205900,
						3045908486,
						2062866102,
						2865634940,
						3543621612,
						3464012697,
						1080764994,
						553557557,
						3656615353,
						3996768171,
						991055499,
						499776247,
						1265440854,
						648242737,
						3940784050,
						980351604,
						3713745714,
						1749149687,
						3396870395,
						4211799374,
						3640570775,
						1161844396,
						3125318951,
						1431517754,
						545492359,
						4268468663,
						3499529547,
						1437099964,
						2702547544,
						3433638243,
						2581715763,
						2787789398,
						1060185593,
						1593081372,
						2418618748,
						4260947970,
						69676912,
						2159744348,
						86519011,
						2512459080,
						3838209314,
						1220612927,
						3339683548,
						133810670,
						1090789135,
						1078426020,
						1569222167,
						845107691,
						3583754449,
						4072456591,
						1091646820,
						628848692,
						1613405280,
						3757631651,
						526609435,
						236106946,
						48312990,
						2942717905,
						3402727701,
						1797494240,
						859738849,
						992217954,
						4005476642,
						2243076622,
						3870952857,
						3732016268,
						765654824,
						3490871365,
						2511836413,
						1685915746,
						3888969200,
						1414112111,
						2273134842,
						3281911079,
						4080962846,
						172450625,
						2569994100,
						980381355,
						4109958455,
						2819808352,
						2716589560,
						2568741196,
						3681446669,
						3329971472,
						1835478071,
						660984891,
						3704678404,
						4045999559,
						3422617507,
						3040415634,
						1762651403,
						1719377915,
						3470491036,
						2693910283,
						3642056355,
						3138596744,
						1364962596,
						2073328063,
						1983633131,
						926494387,
						3423689081,
						2150032023,
						4096667949,
						1749200295,
						3328846651,
						309677260,
						2016342300,
						1779581495,
						3079819751,
						111262694,
						1274766160,
						443224088,
						298511866,
						1025883608,
						3806446537,
						1145181785,
						168956806,
						3641502830,
						3584813610,
						1689216846,
						3666258015,
						3200248200,
						1692713982,
						2646376535,
						4042768518,
						1618508792,
						1610833997,
						3523052358,
						4130873264,
						2001055236,
						3610705100,
						2202168115,
						4028541809,
						2961195399,
						1006657119,
						2006996926,
						3186142756,
						1430667929,
						3210227297,
						1314452623,
						4074634658,
						4101304120,
						2273951170,
						1399257539,
						3367210612,
						3027628629,
						1190975929,
						2062231137,
						2333990788,
						2221543033,
						2438960610,
						1181637006,
						548689776,
						2362791313,
						3372408396,
						3104550113,
						3145860560,
						296247880,
						1970579870,
						3078560182,
						3769228297,
						1714227617,
						3291629107,
						3898220290,
						166772364,
						1251581989,
						493813264,
						448347421,
						195405023,
						2709975567,
						677966185,
						3703036547,
						1463355134,
						2715995803,
						1338867538,
						1343315457,
						2802222074,
						2684532164,
						233230375,
						2599980071,
						2000651841,
						3277868038,
						1638401717,
						4028070440,
						3237316320,
						6314154,
						819756386,
						300326615,
						590932579,
						1405279636,
						3267499572,
						3150704214,
						2428286686,
						3959192993,
						3461946742,
						1862657033,
						1266418056,
						963775037,
						2089974820,
						2263052895,
						1917689273,
						448879540,
						3550394620,
						3981727096,
						150775221,
						3627908307,
						1303187396,
						508620638,
						2975983352,
						2726630617,
						1817252668,
						1876281319,
						1457606340,
						908771278,
						3720792119,
						3617206836,
						2455994898,
						1729034894,
						1080033504
					],
					[
						976866871,
						3556439503,
						2881648439,
						1522871579,
						1555064734,
						1336096578,
						3548522304,
						2579274686,
						3574697629,
						3205460757,
						3593280638,
						3338716283,
						3079412587,
						564236357,
						2993598910,
						1781952180,
						1464380207,
						3163844217,
						3332601554,
						1699332808,
						1393555694,
						1183702653,
						3581086237,
						1288719814,
						691649499,
						2847557200,
						2895455976,
						3193889540,
						2717570544,
						1781354906,
						1676643554,
						2592534050,
						3230253752,
						1126444790,
						2770207658,
						2633158820,
						2210423226,
						2615765581,
						2414155088,
						3127139286,
						673620729,
						2805611233,
						1269405062,
						4015350505,
						3341807571,
						4149409754,
						1057255273,
						2012875353,
						2162469141,
						2276492801,
						2601117357,
						993977747,
						3918593370,
						2654263191,
						753973209,
						36408145,
						2530585658,
						25011837,
						3520020182,
						2088578344,
						530523599,
						2918365339,
						1524020338,
						1518925132,
						3760827505,
						3759777254,
						1202760957,
						3985898139,
						3906192525,
						674977740,
						4174734889,
						2031300136,
						2019492241,
						3983892565,
						4153806404,
						3822280332,
						352677332,
						2297720250,
						60907813,
						90501309,
						3286998549,
						1016092578,
						2535922412,
						2839152426,
						457141659,
						509813237,
						4120667899,
						652014361,
						1966332200,
						2975202805,
						55981186,
						2327461051,
						676427537,
						3255491064,
						2882294119,
						3433927263,
						1307055953,
						942726286,
						933058658,
						2468411793,
						3933900994,
						4215176142,
						1361170020,
						2001714738,
						2830558078,
						3274259782,
						1222529897,
						1679025792,
						2729314320,
						3714953764,
						1770335741,
						151462246,
						3013232138,
						1682292957,
						1483529935,
						471910574,
						1539241949,
						458788160,
						3436315007,
						1807016891,
						3718408830,
						978976581,
						1043663428,
						3165965781,
						1927990952,
						4200891579,
						2372276910,
						3208408903,
						3533431907,
						1412390302,
						2931980059,
						4132332400,
						1947078029,
						3881505623,
						4168226417,
						2941484381,
						1077988104,
						1320477388,
						886195818,
						18198404,
						3786409e3,
						2509781533,
						112762804,
						3463356488,
						1866414978,
						891333506,
						18488651,
						661792760,
						1628790961,
						3885187036,
						3141171499,
						876946877,
						2693282273,
						1372485963,
						791857591,
						2686433993,
						3759982718,
						3167212022,
						3472953795,
						2716379847,
						445679433,
						3561995674,
						3504004811,
						3574258232,
						54117162,
						3331405415,
						2381918588,
						3769707343,
						4154350007,
						1140177722,
						4074052095,
						668550556,
						3214352940,
						367459370,
						261225585,
						2610173221,
						4209349473,
						3468074219,
						3265815641,
						314222801,
						3066103646,
						3808782860,
						282218597,
						3406013506,
						3773591054,
						379116347,
						1285071038,
						846784868,
						2669647154,
						3771962079,
						3550491691,
						2305946142,
						453669953,
						1268987020,
						3317592352,
						3279303384,
						3744833421,
						2610507566,
						3859509063,
						266596637,
						3847019092,
						517658769,
						3462560207,
						3443424879,
						370717030,
						4247526661,
						2224018117,
						4143653529,
						4112773975,
						2788324899,
						2477274417,
						1456262402,
						2901442914,
						1517677493,
						1846949527,
						2295493580,
						3734397586,
						2176403920,
						1280348187,
						1908823572,
						3871786941,
						846861322,
						1172426758,
						3287448474,
						3383383037,
						1655181056,
						3139813346,
						901632758,
						1897031941,
						2986607138,
						3066810236,
						3447102507,
						1393639104,
						373351379,
						950779232,
						625454576,
						3124240540,
						4148612726,
						2007998917,
						544563296,
						2244738638,
						2330496472,
						2058025392,
						1291430526,
						424198748,
						50039436,
						29584100,
						3605783033,
						2429876329,
						2791104160,
						1057563949,
						3255363231,
						3075367218,
						3463963227,
						1469046755,
						985887462
					]
				];
				var BLOWFISH_CTX = {
					pbox: [],
					sbox: []
				};
				function F(ctx, x) {
					let a = x >> 24 & 255;
					let b = x >> 16 & 255;
					let c = x >> 8 & 255;
					let d = x & 255;
					let y = ctx.sbox[0][a] + ctx.sbox[1][b];
					y = y ^ ctx.sbox[2][c];
					y = y + ctx.sbox[3][d];
					return y;
				}
				function BlowFish_Encrypt(ctx, left, right) {
					let Xl = left;
					let Xr = right;
					let temp;
					for (let i = 0; i < N; ++i) {
						Xl = Xl ^ ctx.pbox[i];
						Xr = F(ctx, Xl) ^ Xr;
						temp = Xl;
						Xl = Xr;
						Xr = temp;
					}
					temp = Xl;
					Xl = Xr;
					Xr = temp;
					Xr = Xr ^ ctx.pbox[N];
					Xl = Xl ^ ctx.pbox[17];
					return {
						left: Xl,
						right: Xr
					};
				}
				function BlowFish_Decrypt(ctx, left, right) {
					let Xl = left;
					let Xr = right;
					let temp;
					for (let i = 17; i > 1; --i) {
						Xl = Xl ^ ctx.pbox[i];
						Xr = F(ctx, Xl) ^ Xr;
						temp = Xl;
						Xl = Xr;
						Xr = temp;
					}
					temp = Xl;
					Xl = Xr;
					Xr = temp;
					Xr = Xr ^ ctx.pbox[1];
					Xl = Xl ^ ctx.pbox[0];
					return {
						left: Xl,
						right: Xr
					};
				}
				/**
				* Initialization ctx's pbox and sbox.
				*
				* @param {Object} ctx The object has pbox and sbox.
				* @param {Array} key An array of 32-bit words.
				* @param {int} keysize The length of the key.
				*
				* @example
				*
				*     BlowFishInit(BLOWFISH_CTX, key, 128/32);
				*/
				function BlowFishInit(ctx, key, keysize) {
					for (let Row = 0; Row < 4; Row++) {
						ctx.sbox[Row] = [];
						for (let Col = 0; Col < 256; Col++) ctx.sbox[Row][Col] = ORIG_S[Row][Col];
					}
					let keyIndex = 0;
					for (let index = 0; index < 18; index++) {
						ctx.pbox[index] = ORIG_P[index] ^ key[keyIndex];
						keyIndex++;
						if (keyIndex >= keysize) keyIndex = 0;
					}
					let Data1 = 0;
					let Data2 = 0;
					let res = 0;
					for (let i = 0; i < 18; i += 2) {
						res = BlowFish_Encrypt(ctx, Data1, Data2);
						Data1 = res.left;
						Data2 = res.right;
						ctx.pbox[i] = Data1;
						ctx.pbox[i + 1] = Data2;
					}
					for (let i = 0; i < 4; i++) for (let j = 0; j < 256; j += 2) {
						res = BlowFish_Encrypt(ctx, Data1, Data2);
						Data1 = res.left;
						Data2 = res.right;
						ctx.sbox[i][j] = Data1;
						ctx.sbox[i][j + 1] = Data2;
					}
					return true;
				}
				/**
				* Blowfish block cipher algorithm.
				*/
				var Blowfish = C_algo.Blowfish = BlockCipher.extend({
					_doReset: function() {
						if (this._keyPriorReset === this._key) return;
						var key = this._keyPriorReset = this._key;
						var keyWords = key.words;
						BlowFishInit(BLOWFISH_CTX, keyWords, key.sigBytes / 4);
					},
					encryptBlock: function(M, offset) {
						var res = BlowFish_Encrypt(BLOWFISH_CTX, M[offset], M[offset + 1]);
						M[offset] = res.left;
						M[offset + 1] = res.right;
					},
					decryptBlock: function(M, offset) {
						var res = BlowFish_Decrypt(BLOWFISH_CTX, M[offset], M[offset + 1]);
						M[offset] = res.left;
						M[offset + 1] = res.right;
					},
					blockSize: 2,
					keySize: 4,
					ivSize: 2
				});
				/**
				* Shortcut functions to the cipher's object interface.
				*
				* @example
				*
				*     var ciphertext = CryptoJS.Blowfish.encrypt(message, key, cfg);
				*     var plaintext  = CryptoJS.Blowfish.decrypt(ciphertext, key, cfg);
				*/
				C.Blowfish = BlockCipher._createHelper(Blowfish);
			})();
			return CryptoJS.Blowfish;
		});
	}));
	//#endregion
	//#region backend/request.ts
	var import_crypto_js = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(root, factory, undef) {
			if (typeof exports === "object") module.exports = exports = factory(require_core(), require_x64_core(), require_lib_typedarrays(), require_enc_utf16(), require_enc_base64(), require_enc_base64url(), require_md5(), require_sha1(), require_sha256(), require_sha224(), require_sha512(), require_sha384(), require_sha3(), require_ripemd160(), require_hmac(), require_pbkdf2(), require_evpkdf(), require_cipher_core(), require_mode_cfb(), require_mode_ctr(), require_mode_ctr_gladman(), require_mode_ofb(), require_mode_ecb(), require_pad_ansix923(), require_pad_iso10126(), require_pad_iso97971(), require_pad_zeropadding(), require_pad_nopadding(), require_format_hex(), require_aes(), require_tripledes(), require_rc4(), require_rabbit(), require_rabbit_legacy(), require_blowfish());
			else if (typeof define === "function" && define.amd) define([
				"./core",
				"./x64-core",
				"./lib-typedarrays",
				"./enc-utf16",
				"./enc-base64",
				"./enc-base64url",
				"./md5",
				"./sha1",
				"./sha256",
				"./sha224",
				"./sha512",
				"./sha384",
				"./sha3",
				"./ripemd160",
				"./hmac",
				"./pbkdf2",
				"./evpkdf",
				"./cipher-core",
				"./mode-cfb",
				"./mode-ctr",
				"./mode-ctr-gladman",
				"./mode-ofb",
				"./mode-ecb",
				"./pad-ansix923",
				"./pad-iso10126",
				"./pad-iso97971",
				"./pad-zeropadding",
				"./pad-nopadding",
				"./format-hex",
				"./aes",
				"./tripledes",
				"./rc4",
				"./rabbit",
				"./rabbit-legacy",
				"./blowfish"
			], factory);
			else root.CryptoJS = factory(root.CryptoJS);
		})(exports, function(CryptoJS) {
			return CryptoJS;
		});
	})))(), 1);
	function httpFetch(url, options = {}) {
		let cancelled = false;
		return {
			promise: Promise.resolve().then(() => {
				if (cancelled) throw new Error("请求已取消");
				const nativeOptions = {
					...options,
					headers: { ...options.headers }
				};
				if (options.json !== void 0) {
					nativeOptions.body = JSON.stringify(options.json);
					delete nativeOptions.json;
					nativeOptions.headers["Content-Type"] = "application/json";
				} else if (options.body && typeof options.body === "object") {
					var _nativeOptions$header;
					nativeOptions.body = JSON.stringify(options.body);
					(_nativeOptions$header = nativeOptions.headers)["Content-Type"] || (_nativeOptions$header["Content-Type"] = "application/json");
				}
				const result = JSON.parse(globalThis.__http(url, JSON.stringify(nativeOptions)));
				if (result.error) throw new Error(result.error);
				return result;
			}),
			cancelHttp: () => {
				cancelled = true;
			}
		};
	}
	//#endregion
	//#region backend/shims/zlib.ts
	function inflate(data, callback) {
		try {
			const result = JSON.parse(globalThis.__inflate(JSON.stringify(Array.from(data))));
			if (result.error) throw new Error(result.error);
			callback(null, import_buffer$1.Buffer.from(result.bytes));
		} catch (e) {
			callback(e instanceof Error ? e : new Error(String(e)));
		}
	}
	//#endregion
	//#region backend/userApi.ts
	init_crypto();
	var handlers = /* @__PURE__ */ new Map();
	var initialized = null;
	var userApiManager = {
		nativeRequest: (url, options = {}) => httpFetch(url, options).promise,
		async loadScript(rawCode) {
			handlers.clear();
			initialized = null;
			const lx = {
				EVENT_NAMES: {
					request: "request",
					inited: "inited",
					updateAlert: "updateAlert"
				},
				env: "desktop",
				version: "2.0.0",
				currentScriptInfo: {
					name: "UserAPI",
					rawScript: rawCode
				},
				on(event, handler) {
					handlers.set(event, handler);
					return Promise.resolve();
				},
				send(event, data) {
					if (event === "inited") initialized = data;
					return Promise.resolve();
				},
				request(url, options, callback) {
					if (typeof options === "function") {
						callback = options;
						options = {};
					}
					const req = httpFetch(url, options);
					req.promise.then((res) => callback?.(null, res, res.body), (err) => callback?.(err, null, null));
					return req.cancelHttp;
				},
				utils: {
					zlib: { inflate: (buf) => new Promise((resolve, reject) => inflate(buf, (err, data) => err ? reject(err) : resolve(data))) },
					buffer: {
						from: (...args) => import_buffer$1.Buffer.from(...args),
						bufToString: (b, f) => import_buffer$1.Buffer.from(b).toString(f)
					},
					crypto: {
						md5: (s) => import_crypto_js.default.MD5(typeof s === "string" ? s : import_crypto_js.default.lib.WordArray.create(s)).toString(),
						randomBytes: (n) => import_buffer$1.Buffer.from(JSON.parse(globalThis.__random(n))),
						aesEncrypt(data, mode, key, iv) {
							const cipher = createCipheriv(mode, key, iv);
							return import_buffer$1.Buffer.concat([cipher.update(import_buffer$1.Buffer.from(data)), cipher.final()]);
						},
						rsaEncrypt(data, key) {
							const result = JSON.parse(globalThis.__rsa(JSON.stringify(Array.from(import_buffer$1.Buffer.from(data))), key));
							if (result.error) throw new Error(result.error);
							return import_buffer$1.Buffer.from(result.bytes);
						}
					}
				}
			};
			Object.assign(globalThis, {
				lx,
				Buffer: import_buffer$1.Buffer
			});
			new Function("lx", "Buffer", rawCode)(lx, import_buffer$1.Buffer);
			for (let i = 0; i < 10 && initialized === null; i++) await Promise.resolve();
			if (initialized?.status === false) throw new Error(initialized.message || "音源初始化失败");
			if (!handlers.has("request")) throw new Error("音源未注册 request 处理器");
			return true;
		},
		async invokeSource(action, data) {
			const handler = handlers.get("request");
			if (!handler) return null;
			return handler({
				source: data.source || "wy",
				action,
				info: {
					...data,
					type: data.type || "128k",
					musicInfo: data.songInfo || data.musicInfo || data
				}
			});
		}
	};
	//#endregion
	//#region backend/musicSdk/api-source.js
	var allApi = {};
	var apiList = {};
	var supportQuality = {};
	for (const api of sources$1) {
		supportQuality[api.id] = api.supportQualitys;
		for (const source of Object.keys(api.supportQualitys)) apiList[`${api.id}_api_${source}`] = allApi[`${api.id}_${source}`];
	}
	var apis = (source) => {
		return { async getMusicUrl(songInfo, type) {
			const res = await userApiManager.invokeSource("musicUrl", {
				source,
				songInfo,
				type
			});
			if (res && res.url) return res;
			return { url: "" };
		} };
	};
	//#endregion
	//#region backend/musicSdk/kw/album.js
	var album_default = {
		limit_list: 36,
		limit_song: 1e3,
		filterListDetail(rawList, albumName, albumId) {
			return rawList.map((item, inedx) => {
				let formats = item.formats.split("|");
				let types = [];
				let _types = {};
				if (formats.includes("MP3128")) {
					types.push({
						type: "128k",
						size: null
					});
					_types["128k"] = { size: null };
				}
				if (formats.includes("MP3H")) {
					types.push({
						type: "320k",
						size: null
					});
					_types["320k"] = { size: null };
				}
				if (formats.includes("ALFLAC")) {
					types.push({
						type: "flac",
						size: null
					});
					_types.flac = { size: null };
				}
				if (formats.includes("HIRFLAC")) {
					types.push({
						type: "flac24bit",
						size: null
					});
					_types.flac24bit = { size: null };
				}
				return {
					singer: formatSinger(decodeName$1(item.artist)),
					name: decodeName$1(item.name),
					albumName,
					albumId,
					songmid: item.id,
					source: "kw",
					interval: null,
					img: item.pic,
					lrc: null,
					otherSource: null,
					types,
					_types,
					typeUrl: {}
				};
			});
		},
		/**
		* 格式化播放数量
		* @param {*} num
		*/
		formatPlayCount(num) {
			if (num > 1e8) return parseInt(num / 1e7) / 10 + "亿";
			if (num > 1e4) return parseInt(num / 1e3) / 10 + "万";
			return num;
		},
		getAlbumListDetail(id, page, retryNum = 0) {
			if (retryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
			return httpFetch$1(`http://search.kuwo.cn/r.s?pn=${page - 1}&rn=${this.limit_song}&stype=albuminfo&albumid=${id}&show_copyright_off=0&encoding=utf&vipver=MUSIC_9.1.0`).promise.then(({ statusCode, body }) => {
				if (statusCode !== 200) return this.getAlbumListDetail(id, page, ++retryNum);
				body = objStr2JSON(body);
				if (!body.musiclist) return this.getAlbumListDetail(id, page, ++retryNum);
				body.name = decodeName$1(body.name);
				return {
					list: this.filterListDetail(body.musiclist, body.name, body.albumid),
					page,
					limit: this.limit_song,
					total: parseInt(body.songnum),
					source: "kw",
					info: {
						name: body.name,
						img: body.img || body.hts_img,
						desc: decodeName$1(body.info),
						author: decodeName$1(body.artist)
					}
				};
			});
		}
	};
	//#endregion
	//#region backend/musicSdk/kw/index.js
	var kw = {
		_musicInfoRequestObj: null,
		_musicInfoPromiseCancelFn: null,
		_musicPicRequestObj: null,
		_musicPicPromiseCancelFn: null,
		tipSearch: tipSearch_default,
		musicSearch: musicSearch_default$5,
		leaderboard: leaderboard_default$5,
		songList: {
			_requestObj_tags: null,
			_requestObj_hotTags: null,
			_requestObj_list: null,
			limit_list: 36,
			limit_song: 1e3,
			successCode: 200,
			sortList: [{
				name: "最新",
				id: "new"
			}, {
				name: "最热",
				id: "hot"
			}],
			regExps: {
				mInfo: /level:(\w+),bitrate:(\d+),format:(\w+),size:([\w.]+)/,
				listDetailLink: /^.+\/playlist(?:_detail)?\/(\d+)(?:\?.*|&.*$|#.*$|$)/
			},
			tagsUrl: "http://wapi.kuwo.cn/api/pc/classify/playlist/getTagList?cmd=rcm_keyword_playlist&user=0&prod=kwplayer_pc_9.0.5.0&vipver=9.0.5.0&source=kwplayer_pc_9.0.5.0&loginUid=0&loginSid=0&appUid=76039576",
			hotTagUrl: "http://wapi.kuwo.cn/api/pc/classify/playlist/getRcmTagList?loginUid=0&loginSid=0&appUid=76039576",
			getListUrl({ sortId, id, type, page }) {
				if (!id) return `http://wapi.kuwo.cn/api/pc/classify/playlist/getRcmPlayList?loginUid=0&loginSid=0&appUid=76039576&&pn=${page}&rn=${this.limit_list}&order=${sortId}`;
				switch (type) {
					case "10000": return `http://wapi.kuwo.cn/api/pc/classify/playlist/getTagPlayList?loginUid=0&loginSid=0&appUid=76039576&pn=${page}&id=${id}&rn=${this.limit_list}`;
					case "43": return `http://mobileinterfaces.kuwo.cn/er.s?type=get_pc_qz_data&f=web&id=${id}&prod=pc`;
				}
			},
			getListDetailUrl(id, page) {
				return `http://nplserver.kuwo.cn/pl.svc?op=getlistinfo&pid=${id}&pn=${page - 1}&rn=${this.limit_song}&encode=utf8&keyset=pl2012&identity=kuwo&pcmp4=1&vipver=MUSIC_9.0.5.0_W1&newver=1`;
			},
			getTag(tryNum = 0) {
				if (this._requestObj_tags) this._requestObj_tags.cancelHttp();
				if (tryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
				this._requestObj_tags = httpFetch$1(this.tagsUrl);
				return this._requestObj_tags.promise.then(({ body }) => {
					if (body.code !== this.successCode) return this.getTag(++tryNum);
					return this.filterTagInfo(body.data);
				});
			},
			getHotTag(tryNum = 0) {
				if (this._requestObj_hotTags) this._requestObj_hotTags.cancelHttp();
				if (tryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
				this._requestObj_hotTags = httpFetch$1(this.hotTagUrl);
				return this._requestObj_hotTags.promise.then(({ body }) => {
					if (body.code !== this.successCode) return this.getHotTag(++tryNum);
					return this.filterInfoHotTag(body.data[0].data);
				});
			},
			filterInfoHotTag(rawList) {
				return rawList.map((item) => ({
					id: `${item.id}-${item.digest}`,
					name: item.name,
					source: "kw"
				}));
			},
			filterTagInfo(rawList) {
				return rawList.map((type) => ({
					name: type.name,
					list: type.data.map((item) => ({
						parent_id: type.id,
						parent_name: type.name,
						id: `${item.id}-${item.digest}`,
						name: item.name,
						source: "kw"
					}))
				}));
			},
			getList(sortId, tagId, page, tryNum = 0) {
				if (this._requestObj_list) this._requestObj_list.cancelHttp();
				if (tryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
				let id;
				let type;
				if (tagId) {
					let arr = tagId.split("-");
					id = arr[0];
					type = arr[1];
				} else id = null;
				this._requestObj_list = httpFetch$1(this.getListUrl({
					sortId,
					id,
					type,
					page
				}));
				return this._requestObj_list.promise.then(({ body }) => {
					if (!id || type == "10000") {
						if (body.code !== this.successCode) return this.getList(sortId, tagId, page, ++tryNum);
						return {
							list: this.filterList(body.data.data),
							total: body.data.total,
							page: body.data.pn,
							limit: body.data.rn,
							source: "kw"
						};
					} else if (!body.length) return this.getList(sortId, tagId, page, ++tryNum);
					return {
						list: this.filterList2(body),
						total: 1e3,
						page,
						limit: 1e3,
						source: "kw"
					};
				});
			},
			/**
			* 格式化播放数量
			* @param {*} num
			*/
			formatPlayCount(num) {
				if (num > 1e8) return parseInt(num / 1e7) / 10 + "亿";
				if (num > 1e4) return parseInt(num / 1e3) / 10 + "万";
				return num;
			},
			filterList(rawData) {
				return rawData.map((item) => ({
					play_count: this.formatPlayCount(item.listencnt),
					id: `digest-${item.digest}__${item.id}`,
					author: item.uname,
					name: item.name,
					total: item.total,
					img: item.img,
					grade: item.favorcnt / 10,
					desc: item.desc,
					source: "kw"
				}));
			},
			filterList2(rawData) {
				const list = [];
				rawData.forEach((item) => {
					if (!item.label) return;
					list.push(...item.list.map((item) => ({
						play_count: item.play_count && this.formatPlayCount(item.listencnt),
						id: `digest-${item.digest}__${item.id}`,
						author: item.uname,
						name: item.name,
						total: item.total,
						img: item.img,
						grade: item.favorcnt && item.favorcnt / 10,
						desc: item.desc,
						source: "kw"
					})));
				});
				return list;
			},
			getListDetailDigest8(id, page, tryNum = 0) {
				if (tryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
				return httpFetch$1(this.getListDetailUrl(id, page)).promise.then(({ body }) => {
					if (body.result !== "ok") return this.getListDetail(id, page, ++tryNum);
					return {
						list: this.filterListDetail(body.musiclist),
						page,
						limit: body.rn,
						total: body.total,
						source: "kw",
						info: {
							name: body.title,
							img: body.pic,
							desc: body.info,
							author: body.uname,
							play_count: this.formatPlayCount(body.playnum)
						}
					};
				});
			},
			getListDetailDigest5Info(id, tryNum = 0) {
				if (tryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
				return httpFetch$1(`http://qukudata.kuwo.cn/q.k?op=query&cont=ninfo&node=${id}&pn=0&rn=1&fmt=json&src=mbox&level=2`).promise.then(({ statusCode, body }) => {
					if (statusCode != 200 || !body.child) return this.getListDetail(id, ++tryNum);
					return body.child.length ? body.child[0].sourceid : null;
				});
			},
			getListDetailDigest5Music(id, page, tryNum = 0) {
				if (tryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
				return httpFetch$1(`http://nplserver.kuwo.cn/pl.svc?op=getlistinfo&pid=${id}&pn=${page - 1}}&rn=${this.limit_song}&encode=utf-8&keyset=pl2012&identity=kuwo&pcmp4=1`).promise.then(({ body }) => {
					if (body.result !== "ok") return this.getListDetail(id, page, ++tryNum);
					return {
						list: this.filterListDetail(body.musiclist),
						page,
						limit: body.rn,
						total: body.total,
						source: "kw",
						info: {
							name: body.title,
							img: body.pic,
							desc: body.info,
							author: body.uname,
							play_count: this.formatPlayCount(body.playnum)
						}
					};
				});
			},
			async getListDetailDigest5(id, page, retryNum) {
				const detailId = await this.getListDetailDigest5Info(id, retryNum);
				return this.getListDetailDigest5Music(detailId, page, retryNum);
			},
			filterBDListDetail(rawList) {
				return rawList.map((item) => {
					let types = [];
					let _types = {};
					for (let info of item.audios) {
						info.size = info.size?.toLocaleUpperCase();
						switch (info.bitrate) {
							case "4000":
								types.push({
									type: "flac24bit",
									size: info.size
								});
								_types.flac24bit = { size: info.size };
								break;
							case "2000":
								types.push({
									type: "flac",
									size: info.size
								});
								_types.flac = { size: info.size };
								break;
							case "320":
								types.push({
									type: "320k",
									size: info.size
								});
								_types["320k"] = { size: info.size };
								break;
							case "128":
								types.push({
									type: "128k",
									size: info.size
								});
								_types["128k"] = { size: info.size };
						}
					}
					types.reverse();
					return {
						singer: item.artists.map((s) => s.name).join("、"),
						name: item.name,
						albumName: item.album,
						albumId: item.albumId,
						songmid: item.id,
						source: "kw",
						interval: formatPlayTime(item.duration),
						img: item.albumPic,
						releaseDate: item.releaseDate,
						lrc: null,
						otherSource: null,
						types,
						_types,
						typeUrl: {}
					};
				});
			},
			getReqId() {
				function t() {
					return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
				}
				return t() + t() + t() + t() + t() + t() + t() + t();
			},
			async getListDetailMusicListByBDListInfo(id, source) {
				const { body: infoData } = await httpFetch$1(`https://bd-api.kuwo.cn/api/service/playlist/info/${id}?reqId=${this.getReqId()}&source=${source}`, { headers: {
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",
					plat: "h5"
				} }).promise.catch(() => ({ code: 0 }));
				if (infoData.code != 200) return null;
				return {
					name: infoData.data.name,
					img: infoData.data.pic,
					desc: infoData.data.description,
					author: infoData.data.creatorName,
					play_count: infoData.data.playNum
				};
			},
			async getListDetailMusicListByBDUserPub(id) {
				const { body: infoData } = await httpFetch$1(`https://bd-api.kuwo.cn/api/ucenter/users/pub/${id}?reqId=${this.getReqId()}`, { headers: {
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",
					plat: "h5"
				} }).promise.catch(() => ({ code: 0 }));
				if (infoData.code != 200) return null;
				return {
					name: infoData.data.userInfo.nickname + "喜欢的音乐",
					img: infoData.data.userInfo.headImg,
					desc: "",
					author: infoData.data.userInfo.nickname,
					play_count: ""
				};
			},
			async getListDetailMusicListByBDList(id, source, page, tryNum = 0) {
				const { body: listData } = await httpFetch$1(`https://bd-api.kuwo.cn/api/service/playlist/${id}/musicList?reqId=${this.getReqId()}&source=${source}&pn=${page}&rn=${this.limit_song}`, { headers: {
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",
					plat: "h5"
				} }).promise.catch(() => {
					if (tryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
					return this.getListDetailMusicListByBDList(id, source, page, ++tryNum);
				});
				if (listData.code !== 200) return Promise.reject(/* @__PURE__ */ new Error("failed"));
				return {
					list: this.filterBDListDetail(listData.data.list),
					page,
					limit: listData.data.pageSize,
					total: listData.data.total,
					source: "kw"
				};
			},
			async getListDetailMusicListByBD(id, page) {
				const uid = /uid=(\d+)/.exec(id)?.[1];
				const listId = /playlistId=(\d+)/.exec(id)?.[1];
				const source = /source=(\d+)/.exec(id)?.[1];
				if (!listId) return Promise.reject(/* @__PURE__ */ new Error("failed"));
				const task = [this.getListDetailMusicListByBDList(listId, source, page)];
				switch (source) {
					case "4":
						task.push(this.getListDetailMusicListByBDListInfo(listId, source));
						break;
					case "5": task.push(this.getListDetailMusicListByBDUserPub(uid ?? listId));
				}
				const [listData, info] = await Promise.all(task);
				listData.info = info ?? {
					name: "",
					img: "",
					desc: "",
					author: "",
					play_count: ""
				};
				return listData;
			},
			getListDetail(id, page, retryNum = 0) {
				if (/\/bodian\//.test(id)) return this.getListDetailMusicListByBD(id, page);
				if (/[?&:/]/.test(id)) id = id.replace(this.regExps.listDetailLink, "$1");
				else if (/^digest-/.test(id)) {
					let [digest, _id] = id.split("__");
					digest = digest.replace("digest-", "");
					id = _id;
					switch (digest) {
						case "8": break;
						case "13": return album_default.getAlbumListDetail(id, page, retryNum);
						default: return this.getListDetailDigest5(id, page, retryNum);
					}
				}
				return this.getListDetailDigest8(id, page, retryNum);
			},
			filterListDetail(rawData) {
				return rawData.map((item) => {
					let infoArr = item.N_MINFO.split(";");
					let types = [];
					let _types = {};
					for (let info of infoArr) {
						info = info.match(this.regExps.mInfo);
						if (info) switch (info[2]) {
							case "4000":
								types.push({
									type: "flac24bit",
									size: info[4]
								});
								_types.flac24bit = { size: info[4].toLocaleUpperCase() };
								break;
							case "2000":
								types.push({
									type: "flac",
									size: info[4]
								});
								_types.flac = { size: info[4].toLocaleUpperCase() };
								break;
							case "320":
								types.push({
									type: "320k",
									size: info[4]
								});
								_types["320k"] = { size: info[4].toLocaleUpperCase() };
								break;
							case "128":
								types.push({
									type: "128k",
									size: info[4]
								});
								_types["128k"] = { size: info[4].toLocaleUpperCase() };
						}
					}
					types.reverse();
					return {
						singer: formatSinger(decodeName$1(item.artist)),
						name: decodeName$1(item.name),
						albumName: decodeName$1(item.album),
						albumId: item.albumid,
						songmid: item.id,
						source: "kw",
						interval: formatPlayTime(parseInt(item.duration)),
						img: null,
						lrc: null,
						otherSource: null,
						types,
						_types,
						typeUrl: {}
					};
				});
			},
			getTags() {
				return Promise.all([this.getTag(), this.getHotTag()]).then(([tags, hotTag]) => ({
					tags,
					hotTag,
					source: "kw"
				}));
			},
			getDetailPageUrl(id) {
				if (/[?&:/]/.test(id)) id = id.replace(this.regExps.listDetailLink, "$1");
				else if (/^digest-/.test(id)) id = id.split("__")[1];
				return `http://www.kuwo.cn/playlist_detail/${id}`;
			},
			search(text, page, limit = 20) {
				return httpFetch$1(`http://search.kuwo.cn/r.s?all=${encodeURIComponent(text)}&pn=${page - 1}&rn=${limit}&rformat=json&encoding=utf8&ver=mbox&vipver=MUSIC_8.7.7.0_BCS37&plat=pc&devid=28156413&ft=playlist&pay=0&needliveshow=0`).promise.then(({ body }) => {
					body = objStr2JSON(body);
					return {
						list: body.abslist.map((item) => {
							return {
								play_count: this.formatPlayCount(item.playcnt),
								id: String(item.playlistid),
								author: decodeName$1(item.nickname),
								name: decodeName$1(item.name),
								total: item.songnum,
								img: item.pic,
								desc: decodeName$1(item.intro),
								source: "kw"
							};
						}),
						limit,
						total: parseInt(body.TOTAL),
						source: "kw"
					};
				});
			}
		},
		hotSearch: {
			_requestObj: null,
			async getList(retryNum = 0) {
				if (this._requestObj) this._requestObj.cancelHttp();
				if (retryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
				const { body, statusCode } = await httpFetch$1("http://hotword.kuwo.cn/hotword.s?prod=kwplayer_ar_9.3.0.1&corp=kuwo&newver=2&vipver=9.3.0.1&source=kwplayer_ar_9.3.0.1_40.apk&p2p=1&notrace=0&uid=0&plat=kwplayer_ar&rformat=json&encoding=utf8&tabid=1", { headers: { "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 9;)" } }).promise;
				if (statusCode != 200 || body.status !== "ok") throw new Error("获取热搜词失败");
				return {
					source: "kw",
					list: this.filterList(body.tagvalue)
				};
			},
			filterList(rawList) {
				return rawList.map((item) => item.key);
			}
		},
		comment: {
			_requestObj: null,
			_requestObj2: null,
			async getComment({ songmid }, page = 1, limit = 20) {
				if (this._requestObj) this._requestObj.cancelHttp();
				const { body, statusCode } = await httpFetch$1(`http://ncomment.kuwo.cn/com.s?f=web&type=get_comment&aapiver=1&prod=kwplayer_ar_10.5.2.0&digest=15&sid=${songmid}&start=${limit * (page - 1)}&msgflag=1&count=${limit}&newver=3&uid=0`, { headers: { "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 9;)" } }).promise;
				if (statusCode != 200 || body.code != "200") throw new Error("获取评论失败");
				const total = body.comments_counts;
				return {
					source: "kw",
					comments: this.filterComment(body.comments),
					total,
					page,
					limit,
					maxPage: Math.ceil(total / limit) || 1
				};
			},
			async getHotComment({ songmid }, page = 1, limit = 100) {
				if (this._requestObj2) this._requestObj2.cancelHttp();
				const { body, statusCode } = await httpFetch$1(`http://ncomment.kuwo.cn/com.s?f=web&type=get_rec_comment&aapiver=1&prod=kwplayer_ar_10.5.2.0&digest=15&sid=${songmid}&start=${limit * (page - 1)}&msgflag=1&count=${limit}&newver=3&uid=0`, { headers: { "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 9;)" } }).promise;
				if (statusCode != 200 || body.code != "200") throw new Error("获取热门评论失败");
				const total = body.hot_comments_counts;
				return {
					source: "kw",
					comments: this.filterComment(body.hot_comments),
					total,
					page,
					limit,
					maxPage: Math.ceil(total / limit) || 1
				};
			},
			filterComment(rawList) {
				if (!rawList) return [];
				return rawList.map((item) => {
					return {
						id: item.id,
						text: item.msg,
						time: item.time,
						timeStr: dateFormat2(Number(item.time) * 1e3),
						userName: item.u_name,
						avatar: item.u_pic,
						userId: item.u_id,
						likedCount: item.like_num,
						images: item.mpic ? [decodeURIComponent(item.mpic)] : [],
						reply: item.child_comments ? item.child_comments.map((i) => {
							return {
								id: i.id,
								text: i.msg,
								time: i.time,
								timeStr: dateFormat2(Number(i.time) * 1e3),
								userName: i.u_name,
								avatar: i.u_pic,
								userId: i.u_id,
								likedCount: i.like_num,
								images: i.mpic ? [i.mpic] : []
							};
						}) : []
					};
				});
			}
		},
		getLyric(songInfo, isGetLyricx) {
			return lyric_default$4.getLyric(songInfo, isGetLyricx);
		},
		handleMusicInfo(songInfo) {
			return this.getMusicInfo(songInfo).then((info) => {
				songInfo.name = info.name;
				songInfo.singer = formatSinger(info.artist);
				songInfo.img = info.pic;
				songInfo.albumName = info.album;
				return songInfo;
			});
		},
		getMusicUrl(songInfo, type) {
			return apis("kw").getMusicUrl(songInfo, type);
		},
		getMusicInfo(songInfo) {
			if (this._musicInfoRequestObj) this._musicInfoRequestObj.cancelHttp();
			this._musicInfoRequestObj = httpFetch$1(`http://www.kuwo.cn/api/www/music/musicInfo?mid=${songInfo.songmid}`);
			return this._musicInfoRequestObj.promise.then(({ body }) => {
				return body.code === 200 ? body.data : Promise.reject(new Error(body.msg));
			});
		},
		getMusicUrls(musicInfo, cb) {
			let tasks = [];
			let songId = musicInfo.songmid;
			musicInfo.types.forEach((type) => {
				tasks.push(kw.getMusicUrl(songId, type.type).promise);
			});
			Promise.all(tasks).then((urlInfo) => {
				let typeUrl = {};
				urlInfo.forEach((info) => {
					typeUrl[info.type] = info.url;
				});
				cb(typeUrl);
			});
		},
		getPic(songInfo) {
			return pic_default$2.getPic(songInfo);
		},
		getMusicDetailPageUrl(songInfo) {
			return `http://www.kuwo.cn/play_detail/${songInfo.songmid}`;
		}
	};
	//#endregion
	//#region backend/musicSdk/kg/leaderboard.js
	var boardList$3 = [
		{
			id: "kg__8888",
			name: "TOP500",
			bangid: "8888"
		},
		{
			id: "kg__6666",
			name: "飙升榜",
			bangid: "6666"
		},
		{
			id: "kg__59703",
			name: "蜂鸟流行音乐榜",
			bangid: "59703"
		},
		{
			id: "kg__52144",
			name: "抖音热歌榜",
			bangid: "52144"
		},
		{
			id: "kg__52767",
			name: "快手热歌榜",
			bangid: "52767"
		},
		{
			id: "kg__24971",
			name: "DJ热歌榜",
			bangid: "24971"
		},
		{
			id: "kg__23784",
			name: "网络红歌榜",
			bangid: "23784"
		},
		{
			id: "kg__44412",
			name: "说唱先锋榜",
			bangid: "44412"
		},
		{
			id: "kg__31308",
			name: "内地榜",
			bangid: "31308"
		},
		{
			id: "kg__33160",
			name: "电音榜",
			bangid: "33160"
		},
		{
			id: "kg__31313",
			name: "香港地区榜",
			bangid: "31313"
		},
		{
			id: "kg__51341",
			name: "民谣榜",
			bangid: "51341"
		},
		{
			id: "kg__54848",
			name: "台湾地区榜",
			bangid: "54848"
		},
		{
			id: "kg__31310",
			name: "欧美榜",
			bangid: "31310"
		},
		{
			id: "kg__33162",
			name: "ACG新歌榜",
			bangid: "33162"
		},
		{
			id: "kg__31311",
			name: "韩国榜",
			bangid: "31311"
		},
		{
			id: "kg__31312",
			name: "日本榜",
			bangid: "31312"
		},
		{
			id: "kg__49225",
			name: "80后热歌榜",
			bangid: "49225"
		},
		{
			id: "kg__49223",
			name: "90后热歌榜",
			bangid: "49223"
		},
		{
			id: "kg__49224",
			name: "00后热歌榜",
			bangid: "49224"
		},
		{
			id: "kg__33165",
			name: "粤语金曲榜",
			bangid: "33165"
		},
		{
			id: "kg__33166",
			name: "欧美金曲榜",
			bangid: "33166"
		},
		{
			id: "kg__33163",
			name: "影视金曲榜",
			bangid: "33163"
		},
		{
			id: "kg__51340",
			name: "伤感榜",
			bangid: "51340"
		},
		{
			id: "kg__35811",
			name: "会员专享榜",
			bangid: "35811"
		},
		{
			id: "kg__37361",
			name: "雷达榜",
			bangid: "37361"
		},
		{
			id: "kg__21101",
			name: "分享榜",
			bangid: "21101"
		},
		{
			id: "kg__46910",
			name: "综艺新歌榜",
			bangid: "46910"
		},
		{
			id: "kg__30972",
			name: "酷狗音乐人原创榜",
			bangid: "30972"
		},
		{
			id: "kg__60170",
			name: "闽南语榜",
			bangid: "60170"
		},
		{
			id: "kg__65234",
			name: "儿歌榜",
			bangid: "65234"
		},
		{
			id: "kg__4681",
			name: "美国BillBoard榜",
			bangid: "4681"
		},
		{
			id: "kg__25028",
			name: "Beatport电子舞曲榜",
			bangid: "25028"
		},
		{
			id: "kg__4680",
			name: "英国单曲榜",
			bangid: "4680"
		},
		{
			id: "kg__38623",
			name: "韩国Melon音乐榜",
			bangid: "38623"
		},
		{
			id: "kg__42807",
			name: "joox本地热歌榜",
			bangid: "42807"
		},
		{
			id: "kg__36107",
			name: "小语种热歌榜",
			bangid: "36107"
		},
		{
			id: "kg__4673",
			name: "日本公信榜",
			bangid: "4673"
		},
		{
			id: "kg__46868",
			name: "日本SPACE SHOWER榜",
			bangid: "46868"
		},
		{
			id: "kg__42808",
			name: "KKBOX风云榜",
			bangid: "42808"
		},
		{
			id: "kg__60171",
			name: "越南语榜",
			bangid: "60171"
		},
		{
			id: "kg__60172",
			name: "泰语榜",
			bangid: "60172"
		},
		{
			id: "kg__59895",
			name: "R&B榜",
			bangid: "59895"
		},
		{
			id: "kg__59896",
			name: "摇滚榜",
			bangid: "59896"
		},
		{
			id: "kg__59897",
			name: "爵士榜",
			bangid: "59897"
		},
		{
			id: "kg__59898",
			name: "乡村音乐榜",
			bangid: "59898"
		},
		{
			id: "kg__59900",
			name: "纯音乐榜",
			bangid: "59900"
		},
		{
			id: "kg__59899",
			name: "古典榜",
			bangid: "59899"
		},
		{
			id: "kg__22603",
			name: "5sing音乐榜",
			bangid: "22603"
		},
		{
			id: "kg__21335",
			name: "繁星音乐榜",
			bangid: "21335"
		},
		{
			id: "kg__33161",
			name: "古风新歌榜",
			bangid: "33161"
		}
	];
	var leaderboard_default$4 = {
		listDetailLimit: 100,
		list: [
			{
				id: "kgtop500",
				name: "TOP500",
				bangid: "8888"
			},
			{
				id: "kgwlhgb",
				name: "网络榜",
				bangid: "23784"
			},
			{
				id: "kgbsb",
				name: "飙升榜",
				bangid: "6666"
			},
			{
				id: "kgfxb",
				name: "分享榜",
				bangid: "21101"
			},
			{
				id: "kgcyyb",
				name: "纯音乐榜",
				bangid: "33164"
			},
			{
				id: "kggfjqb",
				name: "古风榜",
				bangid: "33161"
			},
			{
				id: "kgyyjqb",
				name: "粤语榜",
				bangid: "33165"
			},
			{
				id: "kgomjqb",
				name: "欧美榜",
				bangid: "33166"
			},
			{
				id: "kgdyrgb",
				name: "电音榜",
				bangid: "33160"
			},
			{
				id: "kgjdrgb",
				name: "DJ热歌榜",
				bangid: "24971"
			},
			{
				id: "kghyxgb",
				name: "华语新歌榜",
				bangid: "31308"
			}
		],
		getUrl(p, id, limit) {
			return `http://mobilecdnbj.kugou.com/api/v3/rank/song?version=9108&ranktype=1&plat=0&pagesize=${limit}&area_code=1&page=${p}&rankid=${id}&with_res_tag=0&show_portrait_mv=1`;
		},
		regExps: {
			total: /total: '(\d+)',/,
			page: /page: '(\d+)',/,
			limit: /pagesize: '(\d+)',/,
			listData: /global\.features = (\[.+\]);/
		},
		_requestBoardsObj: null,
		getBoardsData() {
			if (this._requestBoardsObj) this._requestBoardsObj.cancelHttp();
			this._requestBoardsObj = httpFetch$1("http://mobilecdnbj.kugou.com/api/v5/rank/list?version=9108&plat=0&showtype=2&parentid=0&apiver=6&area_code=1&withsong=1");
			return this._requestBoardsObj.promise;
		},
		getData(url) {
			return httpFetch$1(url).promise;
		},
		getSinger(singers) {
			let arr = [];
			singers.forEach((singer) => {
				arr.push(singer.author_name);
			});
			return arr.join("、");
		},
		filterData(rawList) {
			return rawList.map((item) => {
				const types = [];
				const _types = {};
				if (item.filesize !== 0) {
					let size = sizeFormate(item.filesize);
					types.push({
						type: "128k",
						size,
						hash: item.hash
					});
					_types["128k"] = {
						size,
						hash: item.hash
					};
				}
				if (item["320filesize"] !== 0) {
					let size = sizeFormate(item["320filesize"]);
					types.push({
						type: "320k",
						size,
						hash: item["320hash"]
					});
					_types["320k"] = {
						size,
						hash: item["320hash"]
					};
				}
				if (item.sqfilesize !== 0) {
					let size = sizeFormate(item.sqfilesize);
					types.push({
						type: "flac",
						size,
						hash: item.sqhash
					});
					_types.flac = {
						size,
						hash: item.sqhash
					};
				}
				if (item.filesize_high !== 0) {
					let size = sizeFormate(item.filesize_high);
					types.push({
						type: "flac24bit",
						size,
						hash: item.hash_high
					});
					_types.flac24bit = {
						size,
						hash: item.hash_high
					};
				}
				return {
					singer: formatSingerName(item.authors, "author_name"),
					name: decodeName$1(item.songname),
					albumName: decodeName$1(item.remark),
					albumId: item.album_id,
					songmid: item.audio_id,
					source: "kg",
					interval: formatPlayTime(item.duration),
					img: null,
					lrc: null,
					hash: item.hash,
					otherSource: null,
					types,
					_types,
					typeUrl: {}
				};
			});
		},
		filterBoardsData(rawList) {
			let list = [];
			for (const board of rawList) {
				if (board.isvol != 1) continue;
				list.push({
					id: "kg__" + board.rankid,
					name: board.rankname,
					bangid: String(board.rankid)
				});
			}
			return list;
		},
		async getBoards(retryNum = 0) {
			this.list = boardList$3;
			return {
				list: boardList$3,
				source: "kg"
			};
		},
		async getList(bangid, page, retryNum = 0) {
			if (++retryNum > 3) throw new Error("try max num");
			const { body } = await this.getData(this.getUrl(page, bangid, this.listDetailLimit));
			if (body.errcode != 0) return this.getList(bangid, page, retryNum);
			return {
				total: body.data.total,
				list: this.filterData(body.data.info),
				limit: 100,
				page,
				source: "kg"
			};
		},
		getDetailPageUrl(id) {
			if (typeof id == "string") id = id.replace("kg__", "");
			return `https://www.kugou.com/yy/rank/home/1-${id}.html`;
		}
	};
	//#endregion
	//#region backend/musicSdk/kg/vendors/infSign.min.js
	var infSign;
	(function(t, n) {
		infSign = n();
		if (typeof self !== "undefined") self.infSign = infSign;
		if (typeof window !== "undefined") window.infSign = infSign;
	})(void 0, function() {
		"use strict";
		function t(t, n, r) {
			return n in t ? Object.defineProperty(t, n, {
				value: r,
				enumerable: !0,
				configurable: !0,
				writable: !0
			}) : t[n] = r, t;
		}
		function n(t, n) {
			var r = Object.keys(t);
			if (Object.getOwnPropertySymbols) {
				var e = Object.getOwnPropertySymbols(t);
				n && (e = e.filter(function(n) {
					return Object.getOwnPropertyDescriptor(t, n).enumerable;
				})), r.push.apply(r, e);
			}
			return r;
		}
		function r(r) {
			for (var e = 1; e < arguments.length; e++) {
				var o = null != arguments[e] ? arguments[e] : {};
				e % 2 ? n(o, !0).forEach(function(n) {
					t(r, n, o[n]);
				}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(r, Object.getOwnPropertyDescriptors(o)) : n(o).forEach(function(t) {
					Object.defineProperty(r, t, Object.getOwnPropertyDescriptor(o, t));
				});
			}
			return r;
		}
		function e(t, n) {
			return n = { exports: {} }, t(n, n.exports), n.exports;
		}
		function o(t) {
			return !!t.constructor && "function" == typeof t.constructor.isBuffer && t.constructor.isBuffer(t);
		}
		function i(t) {
			return "function" == typeof t.readFloatLE && "function" == typeof t.slice && o(t.slice(0, 0));
		}
		function c() {
			var t, n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "", o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}, i = !1, c = !1, a = "json", l = r({}, n), u = s.isInClient();
			"function" == typeof o ? t = o : (t = o.callback, i = o.useH5 || !1, a = o.postType || "json", c = o.isCDN || !1), e && ("[object Object]" != Object.prototype.toString.call(e) ? u = !1 : "urlencoded" == a && (u = !1));
			var f = function() {
				var n = (/* @__PURE__ */ new Date()).getTime(), i = [], s = [], u = "NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt", f = {
					srcappid: "2919",
					clientver: "20000",
					clienttime: n,
					mid: n,
					uuid: n,
					dfid: "-"
				};
				c && (delete f.clienttime, delete f.mid, delete f.uuid, delete f.dfid), l = r({}, f, {}, l);
				for (var g in l) i.push(g);
				if (i.sort(), i.forEach(function(t) {
					s.push(t + "=" + l[t]);
				}), e) if ("[object Object]" == Object.prototype.toString.call(e)) if ("json" == a) s.push(JSON.stringify(e));
				else {
					var b = [];
					for (var g in e) b.push(g + "=" + e[g]);
					s.push(b.join("&"));
				}
				else s.push(e);
				s.unshift(u), s.push(u), l.signature = d(s.join("")), o.log && (console.log("H5签名前参数", s), console.log("H5签名后返回", l)), e ? t && t(l, "[object Object]" == Object.prototype.toString.call(e) && "json" == a ? JSON.stringify(e) : e) : t && t(l);
			};
			if (u && !i) {
				var g = !1;
				s.mobileCall(764, {
					get: l,
					post: e
				}, function(n) {
					return !g && (g = !0, n && n.status ? (delete n.status, o.log && (console.log("客户端签名前参数", {
						get: l,
						post: e
					}), console.log("客户端签名后返回", r({}, l, {}, n))), l = r({}, l, {}, n), e ? t && t(l, "[object Object]" == Object.prototype.toString.call(e) && "json" == a ? JSON.stringify(e) : e) : t && t(l), !1) : (u = !1, void f()));
				});
			} else u = !1, f();
		}
		var s = e(function(t, n) {
			(function(n, r) {
				t.exports = function() {
					var t = {
						str2Json: function(t) {
							var n = {};
							if ("[object String]" === Object.prototype.toString.call(t)) try {
								n = JSON.parse(t);
							} catch (t) {
								n = {};
							}
							return n;
						},
						json2Str: function(t) {
							var n = t;
							if ("string" != typeof t) try {
								n = JSON.stringify(t);
							} catch (t) {
								n = "";
							}
							return n;
						},
						_extend: function(t, n) {
							if (n) for (var r in t) n.hasOwnProperty(r) || (n[r] = t[r]);
							return n;
						},
						formatURL: {
							browser: "",
							url: ""
						},
						formatSong: {
							filename: "",
							filesize: "",
							hash: "",
							bitrate: "",
							extname: "",
							duration: "",
							mvhash: "",
							m4afilesize: "",
							"320hash": "",
							"320filesize": "",
							sqhash: "",
							sqfilesize: 0,
							feetype: 0,
							isfirst: 0
						},
						formatMV: {
							filename: "",
							singername: "",
							hash: "",
							imgurl: ""
						},
						formatShare: {
							shareName: "",
							topicName: "",
							hash: "",
							listID: "",
							type: "",
							suid: "",
							slid: "",
							imgUrl: "",
							filename: "",
							duration: "",
							shareData: {
								linkUrl: "",
								picUrl: "",
								content: "",
								title: ""
							}
						},
						cbNum: 0,
						isIOS: !!navigator.userAgent.match(/KGBrowser/gi),
						isKugouAndroid: !!navigator.userAgent.match(/kugouandroid/gi),
						isAndroid: "undefined" != typeof external && void 0 !== external.superCall,
						loadUrl: function(t) {
							var n = document.createElement("iframe");
							n.setAttribute("src", t), n.setAttribute("style", "display:none;"), n.setAttribute("height", "0px"), n.setAttribute("width", "0px"), n.setAttribute("frameborder", "0"), document.body.appendChild(n), n.parentNode.removeChild(n), n = null;
						},
						callCmd: function(n) {
							var r = t;
							if (r.isKugouAndroid) {
								var e = {}, o = "";
								if (n.cmd && (e.cmd = n.cmd), n.jsonStr && (e.jsonStr = n.jsonStr), n.callback && (o = "kgandroidmobilecall" + ++r.cbNum + Math.random().toString().substr(2, 9), e.callback = o, window[o] = function(t, e) {
									void 0 !== t && ("[object String]" === Object.prototype.toString.call(t) ? (t = "#" === e ? decodeURIComponent(t) : decodeURIComponent(decodeURIComponent(t)), n.callback(r.str2Json(t))) : n.callback(t));
								}), n.AndroidCallback) {
									var i = r.str2Json(n.jsonStr);
									i.AndroidCallback = o, n.jsonStr = r.json2Str(i), n.jsonStr && (e.jsonStr = n.jsonStr);
								}
								var c = encodeURIComponent(JSON.stringify(e)), s = "kugoujsbridge://start.kugou_jsbridge/?".concat(c);
								r.loadUrl(s);
							} else if (r.isAndroid) {
								var a = "", l = "";
								if (n.jsonStr) {
									if (n.callback && "" !== n.callback && !0 === n.AndroidCallback) {
										l = "kgmobilecall" + ++r.cbNum + Math.random().toString().substr(2, 9), window[l] = function(t, e) {
											void 0 !== t && ("[object String]" === Object.prototype.toString.call(t) ? (t = "#" === e ? decodeURIComponent(t) : decodeURIComponent(decodeURIComponent(t)), n.callback(r.str2Json(t))) : n.callback(t));
										};
										var u = r.str2Json(n.jsonStr);
										u.AndroidCallback = l, n.jsonStr = r.json2Str(u);
									}
									try {
										a = external.superCall(n.cmd, n.jsonStr);
									} catch (t) {}
								} else try {
									a = external.superCall(n.cmd);
								} catch (t) {}
								n.callback && "" !== n.callback && "AndroidCallback" != a && (a = r.str2Json(a), n.callback(a));
							} else {
								var f = "", d = "";
								n.callback && (d = "kgmobilecall" + ++r.cbNum + Math.random().toString().substr(2, 9), window[d] = function(t) {
									void 0 !== t && n.callback && ("[object String]" === Object.prototype.toString.call(t) ? n.callback(r.str2Json(t)) : n.callback(t));
								}), d && "" != d && n.jsonStr && (f = "kugouurl://start.music/?{\"cmd\":" + n.cmd + ", \"jsonStr\":" + n.jsonStr + ", \"callback\":\"" + d + "\"}"), d && "" != d && !n.jsonStr && (f = "kugouurl://start.music/?{\"cmd\":" + n.cmd + ", \"callback\":\"" + d + "\"}"), "" == d && n.jsonStr && (f = "kugouurl://start.music/?{\"cmd\":" + n.cmd + ", \"jsonStr\":" + n.jsonStr + "}"), "" != d || n.jsonStr || (f = "kugouurl://start.music/?{\"cmd\":" + n.cmd + "}"), r.loadUrl(f);
							}
						},
						formartData: function(n, r) {
							n && 123 == n && r && (r = t._extend(t.formatURL, r)), n && 123 == n && r && (r = t._extend(t.formatURL, r));
						}
					};
					return {
						isIOS: t.isIOS,
						isKugouAndroid: t.isKugouAndroid,
						isAndroid: t.isAndroid,
						isInClient: function() {
							return !(!t.isAndroid && !t.isKugouAndroid && !t.isIOS);
						},
						mobileCall: function(n, r, e) {
							var o = "";
							if (r && (o = t.json2Str(r)), !n) return console.error("请输入命令号！"), !1;
							var i = {};
							n && (i.cmd = n), "" != o && (i.jsonStr = o), e && (i.callback = e), n && 186 == n && e && (i.AndroidCallback = !0), t.callCmd(i);
						},
						KgWebMobileCall: function(t, n) {
							if (t) try {
								var r = t.split(".");
								r.reduce(function(e, o) {
									if (e[o]) {
										if (o === r[r.length - 1]) {
											var i = e[o];
											return "function" == typeof i ? (e[o] = function(t) {
												i && i(t), n && n(t);
											}, e[o]) : (console.error("请检查，当前环境变量已注册了对象：" + t + "，且该对象不是方法"), null);
										}
										return e[o];
									}
									return o === r[r.length - 1] ? e[o] = function(t) {
										n && n(t);
									} : e[o] = /* @__PURE__ */ new Object(), e[o];
								}, window);
							} catch (t) {}
						}
					};
				}();
			})();
		}), a = e(function(t) {
			(function() {
				var n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", r = {
					rotl: function(t, n) {
						return t << n | t >>> 32 - n;
					},
					rotr: function(t, n) {
						return t << 32 - n | t >>> n;
					},
					endian: function(t) {
						if (t.constructor == Number) return 16711935 & r.rotl(t, 8) | 4278255360 & r.rotl(t, 24);
						for (var n = 0; n < t.length; n++) t[n] = r.endian(t[n]);
						return t;
					},
					randomBytes: function(t) {
						for (var n = []; t > 0; t--) n.push(Math.floor(256 * Math.random()));
						return n;
					},
					bytesToWords: function(t) {
						for (var n = [], r = 0, e = 0; r < t.length; r++, e += 8) n[e >>> 5] |= t[r] << 24 - e % 32;
						return n;
					},
					wordsToBytes: function(t) {
						for (var n = [], r = 0; r < 32 * t.length; r += 8) n.push(t[r >>> 5] >>> 24 - r % 32 & 255);
						return n;
					},
					bytesToHex: function(t) {
						for (var n = [], r = 0; r < t.length; r++) n.push((t[r] >>> 4).toString(16)), n.push((15 & t[r]).toString(16));
						return n.join("");
					},
					hexToBytes: function(t) {
						for (var n = [], r = 0; r < t.length; r += 2) n.push(parseInt(t.substr(r, 2), 16));
						return n;
					},
					bytesToBase64: function(t) {
						for (var r = [], e = 0; e < t.length; e += 3) for (var o = t[e] << 16 | t[e + 1] << 8 | t[e + 2], i = 0; i < 4; i++) 8 * e + 6 * i <= 8 * t.length ? r.push(n.charAt(o >>> 6 * (3 - i) & 63)) : r.push("=");
						return r.join("");
					},
					base64ToBytes: function(t) {
						t = t.replace(/[^A-Z0-9+\/]/gi, "");
						for (var r = [], e = 0, o = 0; e < t.length; o = ++e % 4) 0 != o && r.push((n.indexOf(t.charAt(e - 1)) & Math.pow(2, -2 * o + 8) - 1) << 2 * o | n.indexOf(t.charAt(e)) >>> 6 - 2 * o);
						return r;
					}
				};
				t.exports = r;
			})();
		}), l = {
			utf8: {
				stringToBytes: function(t) {
					return l.bin.stringToBytes(unescape(encodeURIComponent(t)));
				},
				bytesToString: function(t) {
					return decodeURIComponent(escape(l.bin.bytesToString(t)));
				}
			},
			bin: {
				stringToBytes: function(t) {
					for (var n = [], r = 0; r < t.length; r++) n.push(255 & t.charCodeAt(r));
					return n;
				},
				bytesToString: function(t) {
					for (var n = [], r = 0; r < t.length; r++) n.push(String.fromCharCode(t[r]));
					return n.join("");
				}
			}
		}, u = l, f = function(t) {
			return null != t && (o(t) || i(t) || !!t._isBuffer);
		}, d = e(function(t) {
			(function() {
				var n = a, r = u.utf8, e = f, o = u.bin, i = function(t, c) {
					t.constructor == String ? t = c && "binary" === c.encoding ? o.stringToBytes(t) : r.stringToBytes(t) : e(t) ? t = Array.prototype.slice.call(t, 0) : Array.isArray(t) || (t = t.toString());
					for (var s = n.bytesToWords(t), a = 8 * t.length, l = 1732584193, u = -271733879, f = -1732584194, d = 271733878, g = 0; g < s.length; g++) s[g] = 16711935 & (s[g] << 8 | s[g] >>> 24) | 4278255360 & (s[g] << 24 | s[g] >>> 8);
					s[a >>> 5] |= 128 << a % 32, s[14 + (a + 64 >>> 9 << 4)] = a;
					for (var b = i._ff, p = i._gg, h = i._hh, m = i._ii, g = 0; g < s.length; g += 16) {
						var y = l, j = u, S = f, v = d;
						u = m(u = m(u = m(u = m(u = h(u = h(u = h(u = h(u = p(u = p(u = p(u = p(u = b(u = b(u = b(u = b(u, f = b(f, d = b(d, l = b(l, u, f, d, s[g + 0], 7, -680876936), u, f, s[g + 1], 12, -389564586), l, u, s[g + 2], 17, 606105819), d, l, s[g + 3], 22, -1044525330), f = b(f, d = b(d, l = b(l, u, f, d, s[g + 4], 7, -176418897), u, f, s[g + 5], 12, 1200080426), l, u, s[g + 6], 17, -1473231341), d, l, s[g + 7], 22, -45705983), f = b(f, d = b(d, l = b(l, u, f, d, s[g + 8], 7, 1770035416), u, f, s[g + 9], 12, -1958414417), l, u, s[g + 10], 17, -42063), d, l, s[g + 11], 22, -1990404162), f = b(f, d = b(d, l = b(l, u, f, d, s[g + 12], 7, 1804603682), u, f, s[g + 13], 12, -40341101), l, u, s[g + 14], 17, -1502002290), d, l, s[g + 15], 22, 1236535329), f = p(f, d = p(d, l = p(l, u, f, d, s[g + 1], 5, -165796510), u, f, s[g + 6], 9, -1069501632), l, u, s[g + 11], 14, 643717713), d, l, s[g + 0], 20, -373897302), f = p(f, d = p(d, l = p(l, u, f, d, s[g + 5], 5, -701558691), u, f, s[g + 10], 9, 38016083), l, u, s[g + 15], 14, -660478335), d, l, s[g + 4], 20, -405537848), f = p(f, d = p(d, l = p(l, u, f, d, s[g + 9], 5, 568446438), u, f, s[g + 14], 9, -1019803690), l, u, s[g + 3], 14, -187363961), d, l, s[g + 8], 20, 1163531501), f = p(f, d = p(d, l = p(l, u, f, d, s[g + 13], 5, -1444681467), u, f, s[g + 2], 9, -51403784), l, u, s[g + 7], 14, 1735328473), d, l, s[g + 12], 20, -1926607734), f = h(f, d = h(d, l = h(l, u, f, d, s[g + 5], 4, -378558), u, f, s[g + 8], 11, -2022574463), l, u, s[g + 11], 16, 1839030562), d, l, s[g + 14], 23, -35309556), f = h(f, d = h(d, l = h(l, u, f, d, s[g + 1], 4, -1530992060), u, f, s[g + 4], 11, 1272893353), l, u, s[g + 7], 16, -155497632), d, l, s[g + 10], 23, -1094730640), f = h(f, d = h(d, l = h(l, u, f, d, s[g + 13], 4, 681279174), u, f, s[g + 0], 11, -358537222), l, u, s[g + 3], 16, -722521979), d, l, s[g + 6], 23, 76029189), f = h(f, d = h(d, l = h(l, u, f, d, s[g + 9], 4, -640364487), u, f, s[g + 12], 11, -421815835), l, u, s[g + 15], 16, 530742520), d, l, s[g + 2], 23, -995338651), f = m(f, d = m(d, l = m(l, u, f, d, s[g + 0], 6, -198630844), u, f, s[g + 7], 10, 1126891415), l, u, s[g + 14], 15, -1416354905), d, l, s[g + 5], 21, -57434055), f = m(f, d = m(d, l = m(l, u, f, d, s[g + 12], 6, 1700485571), u, f, s[g + 3], 10, -1894986606), l, u, s[g + 10], 15, -1051523), d, l, s[g + 1], 21, -2054922799), f = m(f, d = m(d, l = m(l, u, f, d, s[g + 8], 6, 1873313359), u, f, s[g + 15], 10, -30611744), l, u, s[g + 6], 15, -1560198380), d, l, s[g + 13], 21, 1309151649), f = m(f, d = m(d, l = m(l, u, f, d, s[g + 4], 6, -145523070), u, f, s[g + 11], 10, -1120210379), l, u, s[g + 2], 15, 718787259), d, l, s[g + 9], 21, -343485551), l = l + y >>> 0, u = u + j >>> 0, f = f + S >>> 0, d = d + v >>> 0;
					}
					return n.endian([
						l,
						u,
						f,
						d
					]);
				};
				i._ff = function(t, n, r, e, o, i, c) {
					var s = t + (n & r | ~n & e) + (o >>> 0) + c;
					return (s << i | s >>> 32 - i) + n;
				}, i._gg = function(t, n, r, e, o, i, c) {
					var s = t + (n & e | r & ~e) + (o >>> 0) + c;
					return (s << i | s >>> 32 - i) + n;
				}, i._hh = function(t, n, r, e, o, i, c) {
					var s = t + (n ^ r ^ e) + (o >>> 0) + c;
					return (s << i | s >>> 32 - i) + n;
				}, i._ii = function(t, n, r, e, o, i, c) {
					var s = t + (r ^ (n | ~e)) + (o >>> 0) + c;
					return (s << i | s >>> 32 - i) + n;
				}, i._blocksize = 16, i._digestsize = 16, t.exports = function(t, r) {
					if (void 0 === t || null === t) throw new Error("Illegal argument " + t);
					var e = n.wordsToBytes(i(t, r));
					return r && r.asBytes ? e : r && r.asString ? o.bytesToString(e) : n.bytesToHex(e);
				};
			})();
		});
		return c;
	});
	var infSign_min_default = infSign;
	//#endregion
	//#region backend/musicSdk/kg/util.js
	/**
	* 签名
	* @param {*} params
	* @param {*} apiver
	*/
	var signatureParams = (params, platform = "android", body = "") => {
		let keyparam = "OIlwieks28dk2k092lksi2UIkp";
		if (platform === "web") keyparam = "NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt";
		let param_list = params.split("&");
		param_list.sort();
		return toMD5(`${keyparam}${param_list.join("")}${body}${keyparam}`);
	};
	//#endregion
	//#region backend/musicSdk/kg/songList.js
	var handleSignature = (id, page, limit) => new Promise((resolve, reject) => {
		infSign_min_default({
			appid: 1058,
			type: 0,
			module: "playlist",
			page,
			pagesize: limit,
			specialid: id
		}, null, {
			useH5: !0,
			isCDN: !0,
			callback(i) {
				resolve(i.signature);
			}
		});
	});
	var songList_default$4 = {
		_requestObj_tags: null,
		_requestObj_listInfo: null,
		_requestObj_list: null,
		_requestObj_listRecommend: null,
		listDetailLimit: 1e4,
		currentTagInfo: {
			id: void 0,
			info: void 0
		},
		sortList: [
			{
				name: "推荐",
				id: "5"
			},
			{
				name: "最热",
				id: "6"
			},
			{
				name: "最新",
				id: "7"
			},
			{
				name: "热藏",
				id: "3"
			},
			{
				name: "飙升",
				id: "8"
			}
		],
		cache: /* @__PURE__ */ new Map(),
		regExps: {
			listData: /global\.data = (\[.+\]);/,
			listInfo: /global = {[\s\S]+?name: "(.+)"[\s\S]+?pic: "(.+)"[\s\S]+?};/,
			listDetailLink: /^.+\/(\d+)\.html(?:\?.*|&.*$|#.*$|$)/
		},
		parseHtmlDesc(html) {
			let index = html.indexOf("<div class=\"pc_specail_text pc_singer_tab_content\" id=\"specailIntroduceWrap\">");
			if (index < 0) return null;
			const afterStr = html.substring(index + 77);
			index = afterStr.indexOf("</div>");
			if (index < 0) return null;
			return decodeName$1(afterStr.substring(0, index));
		},
		async getListDetailBySpecialId(id, page, tryNum = 0) {
			if (tryNum > 2) throw new Error("try max num");
			const { body } = await httpFetch$1(this.getSongListDetailUrl(id)).promise;
			let listData = body.match(this.regExps.listData);
			let listInfo = body.match(this.regExps.listInfo);
			if (!listData) return this.getListDetailBySpecialId(id, page, ++tryNum);
			let list = await this.getMusicInfos(JSON.parse(listData[1]));
			let name;
			let pic;
			if (listInfo) {
				name = listInfo[1];
				pic = listInfo[2];
			}
			let desc = this.parseHtmlDesc(body);
			return {
				list,
				page: 1,
				limit: 1e4,
				total: list.length,
				source: "kg",
				info: {
					name,
					img: pic,
					desc
				}
			};
		},
		getInfoUrl(tagId) {
			return tagId ? `http://www2.kugou.kugou.com/yueku/v9/special/getSpecial?is_smarty=1&cdn=cdn&t=5&c=${tagId}` : "http://www2.kugou.kugou.com/yueku/v9/special/getSpecial?is_smarty=1&";
		},
		getSongListUrl(sortId, tagId, page) {
			if (tagId == null) tagId = "";
			return `http://www2.kugou.kugou.com/yueku/v9/special/getSpecial?is_ajax=1&cdn=cdn&t=${sortId}&c=${tagId}&p=${page}`;
		},
		getSongListDetailUrl(id) {
			return `http://www2.kugou.kugou.com/yueku/v9/special/single/${id}-5-9999.html`;
		},
		filterInfoHotTag(rawData) {
			const result = [];
			if (rawData.status !== 1) return result;
			for (const key of Object.keys(rawData.data)) {
				let tag = rawData.data[key];
				result.push({
					id: tag.special_id,
					name: tag.special_name,
					source: "kg"
				});
			}
			return result;
		},
		filterTagInfo(rawData) {
			const result = [];
			for (const name of Object.keys(rawData)) result.push({
				name,
				list: rawData[name].data.map((tag) => ({
					parent_id: tag.parent_id,
					parent_name: tag.pname,
					id: tag.id,
					name: tag.name,
					source: "kg"
				}))
			});
			return result;
		},
		getSongList(sortId, tagId, page, tryNum = 0) {
			if (this._requestObj_list) this._requestObj_list.cancelHttp();
			if (tryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
			this._requestObj_list = httpFetch$1(this.getSongListUrl(sortId, tagId, page));
			return this._requestObj_list.promise.then(({ body }) => {
				if (!body || body.status !== 1) return this.getSongList(sortId, tagId, page, ++tryNum);
				return this.filterList(body.special_db);
			});
		},
		getSongListRecommend(tryNum = 0) {
			if (this._requestObj_listRecommend) this._requestObj_listRecommend.cancelHttp();
			if (tryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
			this._requestObj_listRecommend = httpFetch$1("http://everydayrec.service.kugou.com/guess_special_recommend", {
				method: "post",
				headers: { "User-Agent": "KuGou2012-8275-web_browser_event_handler" },
				body: {
					appid: 1001,
					clienttime: 1566798337219,
					clientver: 8275,
					key: "f1f93580115bb106680d2375f8032d96",
					mid: "21511157a05844bd085308bc76ef3343",
					platform: "pc",
					userid: "262643156",
					return_min: 6,
					return_max: 15
				}
			});
			return this._requestObj_listRecommend.promise.then(({ body }) => {
				if (body.status !== 1) return this.getSongListRecommend(++tryNum);
				return this.filterList(body.data.special_list);
			});
		},
		filterList(rawData) {
			return rawData.map((item) => ({
				play_count: item.total_play_count || formatPlayCount(item.play_count),
				id: "id_" + item.specialid,
				author: item.nickname,
				name: item.specialname,
				time: dateFormat(item.publish_time || item.publishtime, "Y-M-D"),
				img: item.img || item.imgurl,
				total: item.songcount,
				grade: item.grade,
				desc: item.intro,
				source: "kg"
			}));
		},
		async createHttp(url, options, retryNum = 0) {
			if (retryNum > 2) throw new Error("try max num");
			let result;
			try {
				result = await httpFetch$1(url, options).promise;
			} catch (err) {
				console.log(err);
				return this.createHttp(url, options, ++retryNum);
			}
			if (result.statusCode !== 200 || (result.body.error_code !== void 0 ? result.body.error_code : result.body.errcode !== void 0 ? result.body.errcode : result.body.err_code) !== 0) return this.createHttp(url, options, ++retryNum);
			if (result.body.data) return result.body.data;
			if (Array.isArray(result.body.info)) return result.body;
			return result.body.info;
		},
		createTask(hashs) {
			let data = {
				area_code: "1",
				show_privilege: 1,
				show_album_info: "1",
				is_publish: "",
				appid: 1005,
				clientver: 11451,
				mid: "1",
				dfid: "-",
				clienttime: Date.now(),
				key: "OIlwieks28dk2k092lksi2UIkp",
				fields: "album_info,author_name,audio_info,ori_audio_name,base,songname"
			};
			let list = hashs;
			let tasks = [];
			while (list.length) {
				tasks.push(Object.assign({ data: list.slice(0, 100) }, data));
				if (list.length < 100) break;
				list = list.slice(100);
			}
			let url = "http://gateway.kugou.com/v2/album_audio/audio";
			return tasks.map((task) => this.createHttp(url, {
				method: "POST",
				body: task,
				headers: {
					"KG-THash": "13a3164",
					"KG-RC": "1",
					"KG-Fake": "0",
					"KG-RF": "00869891",
					"User-Agent": "Android712-AndroidPhone-11451-376-0-FeeCacheUpdate-wifi",
					"x-router": "kmr.service.kugou.com"
				}
			}).then((data) => data.map((s) => s[0])));
		},
		async getMusicInfos(list) {
			return this.filterData2(await Promise.all(this.createTask(this.deDuplication(list).map((item) => ({ hash: item.hash })))).then(([ ...datas]) => datas.flat()));
		},
		async getUserListDetailByCode(id) {
			const songInfo = await this.createHttp("http://t.kugou.com/command/", {
				method: "POST",
				headers: {
					"KG-RC": 1,
					"KG-THash": "network_super_call.cpp:3676261689:379",
					"User-Agent": ""
				},
				body: {
					appid: 1001,
					clientver: 9020,
					mid: "21511157a05844bd085308bc76ef3343",
					clienttime: 640612895,
					key: "36164c4015e704673c588ee202b9ecb8",
					data: id
				}
			});
			let songList;
			let info = songInfo.info;
			switch (info.type) {
				case 2: if (!info.global_collection_id) return this.getListDetailBySpecialId(info.id);
			}
			if (info.global_collection_id) return this.getUserListDetail2(info.global_collection_id);
			if (info.userid != null) songList = await this.createHttp("http://www2.kugou.kugou.com/apps/kucodeAndShare/app/", {
				method: "POST",
				headers: {
					"KG-RC": 1,
					"KG-THash": "network_super_call.cpp:3676261689:379",
					"User-Agent": ""
				},
				body: {
					appid: 1001,
					clientver: 9020,
					mid: "21511157a05844bd085308bc76ef3343",
					clienttime: 640612895,
					key: "36164c4015e704673c588ee202b9ecb8",
					data: {
						id: info.id,
						type: 3,
						userid: info.userid,
						collect_type: 0,
						page: 1,
						pagesize: info.count
					}
				}
			});
			let list = await this.getMusicInfos(songList || songInfo.list);
			return {
				list,
				page: 1,
				limit: info.count,
				total: list.length,
				source: "kg",
				info: {
					name: info.name,
					img: info.img_size && info.img_size.replace("{size}", 240) || info.img,
					author: info.username
				}
			};
		},
		async getUserListDetail3(chain, page) {
			const songInfo = await this.createHttp(`http://m.kugou.com/schain/transfer?pagesize=${this.listDetailLimit}&chain=${chain}&su=1&page=${page}&n=0.7928855356604456`, { headers: { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1" } });
			if (!songInfo.list) {
				if (songInfo.global_collection_id) return this.getUserListDetail2(songInfo.global_collection_id);
				else return this.getUserListDetail4(songInfo, chain, page).catch(() => this.getUserListDetail5(chain));
			}
			let list = await this.getMusicInfos(songInfo.list);
			return {
				list,
				page: 1,
				limit: this.listDetailLimit,
				total: list.length,
				source: "kg",
				info: {
					name: songInfo.info.name,
					img: songInfo.info.img,
					author: songInfo.info.username
				}
			};
		},
		deDuplication(datas) {
			let ids = /* @__PURE__ */ new Set();
			return datas.filter(({ hash }) => {
				if (ids.has(hash)) return false;
				ids.add(hash);
				return true;
			});
		},
		async decodeGcid(gcid) {
			const params = "dfid=-&appid=1005&mid=0&clientver=20109&clienttime=640612895&uuid=-";
			const body = {
				ret_info: 1,
				data: [{
					id: gcid,
					id_type: 2
				}]
			};
			return (await this.createHttp(`https://t.kugou.com/v1/songlist/batch_decode?${params}&signature=${signatureParams(params, "android", JSON.stringify(body))}`, {
				method: "POST",
				headers: {
					"User-Agent": "Mozilla/5.0 (Linux; Android 10; HUAWEI HMA-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36",
					Referer: "https://m.kugou.com/"
				},
				body
			})).list[0].global_collection_id;
		},
		async getUserListDetailByLink({ info }, link) {
			let listInfo = info["0"];
			let total = listInfo.count;
			let tasks = [];
			let page = 0;
			while (total) {
				const limit = total > 90 ? 90 : total;
				total -= limit;
				page += 1;
				tasks.push(this.createHttp(link.replace(/pagesize=\d+/, "pagesize=" + limit).replace(/page=\d+/, "page=" + page), { headers: {
					"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
					Referer: link
				} }).then((data) => data.list.info));
			}
			let result = await Promise.all(tasks).then(([ ...datas]) => datas.flat());
			result = await this.getMusicInfos(result);
			return {
				list: result,
				page,
				limit: this.listDetailLimit,
				total: result.length,
				source: "kg",
				info: {
					name: listInfo.name,
					img: listInfo.pic && listInfo.pic.replace("{size}", 240),
					author: listInfo.list_create_username
				}
			};
		},
		createGetListDetail2Task(id, total) {
			let tasks = [];
			let page = 0;
			while (total) {
				const limit = total > 300 ? 300 : total;
				total -= limit;
				page += 1;
				const params = "appid=1058&global_specialid=" + id + "&specialid=0&plat=0&version=8000&page=" + page + "&pagesize=" + limit + "&srcappid=2919&clientver=20000&clienttime=1586163263991&mid=1586163263991&uuid=1586163263991&dfid=-";
				tasks.push(this.createHttp(`https://mobiles.kugou.com/api/v5/special/song_v2?${params}&signature=${signatureParams(params, "web")}`, { headers: {
					mid: "1586163263991",
					Referer: "https://m3ws.kugou.com/share/index.php",
					"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1",
					dfid: "-",
					clienttime: "1586163263991"
				} }).then((data) => data.info));
			}
			return Promise.all(tasks).then(([ ...datas]) => datas.flat());
		},
		async getUserListDetail2(global_collection_id) {
			let id = global_collection_id;
			if (id.length > 1e3) throw new Error("get list error");
			const params = "appid=1058&specialid=0&global_specialid=" + id + "&format=jsonp&srcappid=2919&clientver=20000&clienttime=1586163242519&mid=1586163242519&uuid=1586163242519&dfid=-";
			let info = await this.createHttp(`https://mobiles.kugou.com/api/v5/special/info_v2?${params}&signature=${signatureParams(params, "web")}`, { headers: {
				mid: "1586163242519",
				Referer: "https://m3ws.kugou.com/share/index.php",
				"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1",
				dfid: "-",
				clienttime: "1586163242519"
			} });
			const songInfo = await this.createGetListDetail2Task(id, info.songcount);
			let list = await this.getMusicInfos(songInfo);
			return {
				list,
				page: 1,
				limit: this.listDetailLimit,
				total: list.length,
				source: "kg",
				info: {
					name: info.specialname,
					img: info.imgurl && info.imgurl.replace("{size}", 240),
					desc: info.intro,
					author: info.nickname,
					play_count: formatPlayCount(info.playcount)
				}
			};
		},
		async getListInfoByChain(chain) {
			if (this.cache.has(chain)) return this.cache.get(chain);
			const { body } = await httpFetch$1(`https://m.kugou.com/share/?chain=${chain}&id=${chain}`, { headers: { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1" } }).promise;
			let result = body.match(/var\sphpParam\s=\s({.+?});/);
			if (result) result = JSON.parse(result[1]);
			this.cache.set(chain, result);
			return result;
		},
		async getUserListDetailByPcChain(chain) {
			let key = `${chain}_pc_list`;
			if (this.cache.has(key)) return this.cache.get(key);
			const { body } = await httpFetch$1(`http://www.kugou.com/share/${chain}.html`, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36" } }).promise;
			let result = body.match(/var\sdataFromSmarty\s=\s(\[.+?\])/);
			if (result) result = JSON.parse(result[1]);
			this.cache.set(chain, result);
			result = await this.getMusicInfos(result);
			return result;
		},
		async getUserListDetail4(songInfo, chain, page) {
			const limit = 100;
			const [listInfo, list] = await Promise.all([this.getListInfoByChain(chain), this.getUserListDetailById(songInfo.id, page, limit)]);
			return {
				list: list || [],
				page,
				limit,
				total: list.length ?? 0,
				source: "kg",
				info: {
					name: listInfo.specialname,
					img: listInfo.imgurl && listInfo.imgurl.replace("{size}", 240),
					author: listInfo.nickname
				}
			};
		},
		async getUserListDetail5(chain) {
			const [listInfo, list] = await Promise.all([this.getListInfoByChain(chain), this.getUserListDetailByPcChain(chain)]);
			return {
				list: list || [],
				page: 1,
				limit: this.listDetailLimit,
				total: list.length ?? 0,
				source: "kg",
				info: {
					name: listInfo.specialname,
					img: listInfo.imgurl && listInfo.imgurl.replace("{size}", 240),
					author: listInfo.nickname
				}
			};
		},
		async getUserListDetailById(id, page, limit) {
			const signature = await handleSignature(id, page, limit);
			let info = await this.createHttp(`https://pubsongscdn.kugou.com/v2/get_other_list_file?srcappid=2919&clientver=20000&appid=1058&type=0&module=playlist&page=${page}&pagesize=${limit}&specialid=${id}&signature=${signature}`, { headers: {
				Referer: "https://m3ws.kugou.com/share/index.php",
				"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1",
				dfid: "-"
			} });
			return await this.getMusicInfos(info.info);
		},
		async getUserListDetail(link, page, retryNum = 0) {
			if (retryNum > 3) return Promise.reject(/* @__PURE__ */ new Error("link try max num"));
			if (link.includes("#")) link = link.replace(/#.*$/, "");
			if (link.includes("global_collection_id")) return this.getUserListDetail2(link.replace(/^.*?global_collection_id=(\w+)(?:&.*$|#.*$|$)/, "$1"));
			if (link.includes("gcid_")) {
				let gcid = link.match(/gcid_\w+/)?.[0];
				if (gcid) {
					const global_collection_id = await this.decodeGcid(gcid);
					if (global_collection_id) return this.getUserListDetail2(global_collection_id);
				}
			}
			if (link.includes("chain=")) return this.getUserListDetail3(link.replace(/^.*?chain=(\w+)(?:&.*$|#.*$|$)/, "$1"), page);
			if (link.includes(".html")) {
				if (link.includes("zlist.html")) {
					link = link.replace(/^(.*)zlist\.html/, "https://m3ws.kugou.com/zlist/list");
					if (link.includes("pagesize")) link = link.replace("pagesize=30", "pagesize=" + this.listDetailLimit).replace("page=1", "page=" + page);
					else link += `&pagesize=${this.listDetailLimit}&page=${page}`;
				} else if (!link.includes("song.html")) return this.getUserListDetail3(link.replace(/.+\/(\w+).html(?:\?.*|&.*$|#.*$|$)/, "$1"), page);
			}
			const { headers: { location }, statusCode, body } = await httpFetch$1(link, { headers: {
				"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
				Referer: link
			} }).promise;
			if (statusCode > 400) return this.getUserListDetail(link, page, ++retryNum);
			if (location) {
				if (location.includes("global_collection_id")) return this.getUserListDetail2(location.replace(/^.*?global_collection_id=(\w+)(?:&.*$|#.*$|$)/, "$1"));
				if (location.includes("gcid_")) {
					let gcid = link.match(/gcid_\w+/)?.[0];
					if (gcid) {
						const global_collection_id = await this.decodeGcid(gcid);
						if (global_collection_id) return this.getUserListDetail2(global_collection_id);
					}
				}
				if (location.includes("chain=")) return this.getUserListDetail3(location.replace(/^.*?chain=(\w+)(?:&.*$|#.*$|$)/, "$1"), page);
				if (location.includes(".html")) {
					if (location.includes("zlist.html")) {
						let link = location.replace(/^(.*)zlist\.html/, "https://m3ws.kugou.com/zlist/list");
						if (link.includes("pagesize")) link = link.replace("pagesize=30", "pagesize=" + this.listDetailLimit).replace("page=1", "page=" + page);
						else link += `&pagesize=${this.listDetailLimit}&page=${page}`;
						return this.getUserListDetail(link, page, ++retryNum);
					} else return this.getUserListDetail3(location.replace(/.+\/(\w+).html(?:\?.*|&.*$|#.*$|$)/, "$1"), page);
				}
				return this.getUserListDetail(location, page, ++retryNum);
			}
			if (typeof body == "string") {
				let global_collection_id = body.match(/"global_collection_id":"(\w+)"/)?.[1];
				if (!global_collection_id) {
					let gcid = body.match(/"encode_gic":"(\w+)"/)?.[1];
					if (!gcid) gcid = body.match(/"encode_src_gid":"(\w+)"/)?.[1];
					if (gcid) global_collection_id = await this.decodeGcid(gcid);
				}
				if (!global_collection_id) throw new Error("get list error");
				return this.getUserListDetail2(global_collection_id);
			}
			if (body.errcode !== 0) return this.getUserListDetail(link, page, ++retryNum);
			return this.getUserListDetailByLink(body, link);
		},
		async getListDetail(id, page) {
			id = id.toString();
			if (id.includes("special/single/")) id = id.replace(this.regExps.listDetailLink, "$1");
			else if (/https?:/.test(id)) return this.getUserListDetail(id.replace(/^.*?http/, "http"), page);
			else if (/^\d+$/.test(id)) return this.getUserListDetailByCode(id);
			else if (id.startsWith("id_")) id = id.replace("id_", "");
			return this.getListDetailBySpecialId(id, page);
		},
		filterData(rawList) {
			return rawList.map((item) => {
				const types = [];
				const _types = {};
				if (item.filesize !== 0) {
					let size = sizeFormate(item.filesize);
					types.push({
						type: "128k",
						size,
						hash: item.hash
					});
					_types["128k"] = {
						size,
						hash: item.hash
					};
				}
				if (item.filesize_320 !== 0) {
					let size = sizeFormate(item.filesize_320);
					types.push({
						type: "320k",
						size,
						hash: item.hash_320
					});
					_types["320k"] = {
						size,
						hash: item.hash_320
					};
				}
				if (item.filesize_ape !== 0) {
					let size = sizeFormate(item.filesize_ape);
					types.push({
						type: "ape",
						size,
						hash: item.hash_ape
					});
					_types.ape = {
						size,
						hash: item.hash_ape
					};
				}
				if (item.filesize_flac !== 0) {
					let size = sizeFormate(item.filesize_flac);
					types.push({
						type: "flac",
						size,
						hash: item.hash_flac
					});
					_types.flac = {
						size,
						hash: item.hash_flac
					};
				}
				return {
					singer: decodeName$1(item.singername),
					name: decodeName$1(item.songname),
					albumName: decodeName$1(item.album_name),
					albumId: item.album_id,
					songmid: item.audio_id,
					source: "kg",
					interval: formatPlayTime(item.duration / 1e3),
					img: null,
					lrc: null,
					hash: item.hash,
					types,
					_types,
					typeUrl: {}
				};
			});
		},
		filterData2(rawList) {
			let ids = /* @__PURE__ */ new Set();
			let list = [];
			rawList.forEach((item) => {
				if (!item) return;
				if (ids.has(item.audio_info.audio_id)) return;
				ids.add(item.audio_info.audio_id);
				const types = [];
				const _types = {};
				if (item.audio_info.filesize !== "0") {
					let size = sizeFormate(parseInt(item.audio_info.filesize));
					types.push({
						type: "128k",
						size,
						hash: item.audio_info.hash
					});
					_types["128k"] = {
						size,
						hash: item.audio_info.hash
					};
				}
				if (item.audio_info.filesize_320 !== "0") {
					let size = sizeFormate(parseInt(item.audio_info.filesize_320));
					types.push({
						type: "320k",
						size,
						hash: item.audio_info.hash_320
					});
					_types["320k"] = {
						size,
						hash: item.audio_info.hash_320
					};
				}
				if (item.audio_info.filesize_flac !== "0") {
					let size = sizeFormate(parseInt(item.audio_info.filesize_flac));
					types.push({
						type: "flac",
						size,
						hash: item.audio_info.hash_flac
					});
					_types.flac = {
						size,
						hash: item.audio_info.hash_flac
					};
				}
				if (item.audio_info.filesize_high !== "0") {
					let size = sizeFormate(parseInt(item.audio_info.filesize_high));
					types.push({
						type: "flac24bit",
						size,
						hash: item.audio_info.hash_high
					});
					_types.flac24bit = {
						size,
						hash: item.audio_info.hash_high
					};
				}
				list.push({
					singer: decodeName$1(item.author_name),
					name: decodeName$1(item.songname),
					albumName: decodeName$1(item.album_info.album_name),
					albumId: item.album_info.album_id,
					songmid: item.audio_info.audio_id,
					source: "kg",
					interval: formatPlayTime(parseInt(item.audio_info.timelength) / 1e3),
					img: null,
					lrc: null,
					hash: item.audio_info.hash,
					otherSource: null,
					types,
					_types,
					typeUrl: {}
				});
			});
			return list;
		},
		getListInfo(tagId, tryNum = 0) {
			if (this._requestObj_listInfo) this._requestObj_listInfo.cancelHttp();
			if (tryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
			this._requestObj_listInfo = httpFetch$1(this.getInfoUrl(tagId));
			return this._requestObj_listInfo.promise.then(({ body }) => {
				if (body.status !== 1) return this.getListInfo(tagId, ++tryNum);
				return {
					limit: body.data.params.pagesize,
					page: body.data.params.p,
					total: body.data.params.total,
					source: "kg"
				};
			});
		},
		getList(sortId, tagId, page) {
			let tasks = [this.getSongList(sortId, tagId, page)];
			tasks.push(this.currentTagInfo.id === tagId ? Promise.resolve(this.currentTagInfo.info) : this.getListInfo(tagId).then((info) => {
				this.currentTagInfo.id = tagId;
				this.currentTagInfo.info = Object.assign({}, info);
				return info;
			}));
			if (!tagId && page === 1 && sortId === this.sortList[0].id) tasks.push(this.getSongListRecommend());
			return Promise.all(tasks).then(([list, info, recommendList]) => {
				if (recommendList) list.unshift(...recommendList);
				return {
					list,
					...info
				};
			});
		},
		getTags(tryNum = 0) {
			if (this._requestObj_tags) this._requestObj_tags.cancelHttp();
			if (tryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
			this._requestObj_tags = httpFetch$1(this.getInfoUrl());
			return this._requestObj_tags.promise.then(({ body }) => {
				if (body.status !== 1) return this.getTags(++tryNum);
				return {
					hotTag: this.filterInfoHotTag(body.data.hotTag),
					tags: this.filterTagInfo(body.data.tagids),
					source: "kg"
				};
			});
		},
		getDetailPageUrl(id) {
			if (typeof id == "string") {
				if (/^https?:\/\//.test(id)) return id;
				id = id.replace("id_", "");
			}
			return `https://www.kugou.com/yy/special/single/${id}.html`;
		},
		search(text, page, limit = 20) {
			return httpFetch$1(`http://msearchretry.kugou.com/api/v3/search/special?keyword=${encodeURIComponent(text)}&page=${page}&pagesize=${limit}&showtype=10&filter=0&version=7910&sver=2`).promise.then(({ body }) => {
				if (body.errcode != 0) throw new Error("filed");
				return {
					list: body.data.info.map((item) => {
						return {
							play_count: formatPlayCount(item.playcount),
							id: "id_" + item.specialid,
							author: item.nickname,
							name: item.specialname,
							time: dateFormat(item.publishtime, "Y-M-D"),
							img: item.imgurl,
							grade: item.grade,
							desc: item.intro,
							total: item.songcount,
							source: "kg"
						};
					}),
					limit,
					total: body.data.total,
					source: "kg"
				};
			});
		}
	};
	//#endregion
	//#region backend/musicSdk/kg/musicSearch.js
	var musicSearch_default$4 = {
		limit: 30,
		total: 0,
		page: 0,
		allPage: 1,
		musicSearch(str, page, limit) {
			return httpFetch$1(`https://songsearch.kugou.com/song_search_v2?keyword=${encodeURIComponent(str)}&page=${page}&pagesize=${limit}&userid=0&clientver=&platform=WebFilter&filter=2&iscorrection=1&privilege_filter=0&area_code=1`).promise.then(({ body }) => body);
		},
		filterData(rawData) {
			const types = [];
			const _types = {};
			if (rawData.FileSize !== 0) {
				let size = sizeFormate(rawData.FileSize);
				types.push({
					type: "128k",
					size,
					hash: rawData.FileHash
				});
				_types["128k"] = {
					size,
					hash: rawData.FileHash
				};
			}
			if (rawData.HQFileSize !== 0) {
				let size = sizeFormate(rawData.HQFileSize);
				types.push({
					type: "320k",
					size,
					hash: rawData.HQFileHash
				});
				_types["320k"] = {
					size,
					hash: rawData.HQFileHash
				};
			}
			if (rawData.SQFileSize !== 0) {
				let size = sizeFormate(rawData.SQFileSize);
				types.push({
					type: "flac",
					size,
					hash: rawData.SQFileHash
				});
				_types.flac = {
					size,
					hash: rawData.SQFileHash
				};
			}
			if (rawData.ResFileSize !== 0) {
				let size = sizeFormate(rawData.ResFileSize);
				types.push({
					type: "flac24bit",
					size,
					hash: rawData.ResFileHash
				});
				_types.flac24bit = {
					size,
					hash: rawData.ResFileHash
				};
			}
			return {
				singer: decodeName$1(formatSingerName(rawData.Singers, "name")),
				name: decodeName$1(rawData.SongName),
				albumName: decodeName$1(rawData.AlbumName),
				albumId: rawData.AlbumID,
				songmid: rawData.Audioid,
				source: "kg",
				interval: formatPlayTime(rawData.Duration),
				_interval: rawData.Duration,
				img: null,
				lrc: null,
				otherSource: null,
				hash: rawData.FileHash,
				types,
				_types,
				typeUrl: {}
			};
		},
		handleResult(rawData) {
			let ids = /* @__PURE__ */ new Set();
			const list = [];
			rawData.forEach((item) => {
				const key = item.Audioid + item.FileHash;
				if (ids.has(key)) return;
				ids.add(key);
				list.push(this.filterData(item));
				for (const childItem of item.Grp) {
					const key = item.Audioid + item.FileHash;
					if (ids.has(key)) continue;
					ids.add(key);
					list.push(this.filterData(childItem));
				}
			});
			return list;
		},
		search(str, page = 1, limit, retryNum = 0) {
			if (++retryNum > 3) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
			if (limit == null) limit = this.limit;
			return this.musicSearch(str, page, limit).then((result) => {
				if (!result || result.error_code !== 0) return this.search(str, page, limit, retryNum);
				let list = this.handleResult(result.data.lists);
				if (list == null) return this.search(str, page, limit, retryNum);
				this.total = result.data.total;
				this.page = page;
				this.allPage = Math.ceil(this.total / limit);
				return Promise.resolve({
					list,
					allPage: this.allPage,
					limit,
					total: this.total,
					source: "kg"
				});
			});
		}
	};
	//#endregion
	//#region backend/musicSdk/kg/pic.js
	var pic_default$1 = { getPic(songInfo) {
		return httpFetch$1("http://media.store.kugou.com/v1/get_res_privilege", {
			method: "POST",
			headers: {
				"KG-RC": 1,
				"KG-THash": "expand_search_manager.cpp:852736169:451",
				"User-Agent": "KuGou2012-9020-ExpandSearchManager"
			},
			body: {
				appid: 1001,
				area_code: "1",
				behavior: "play",
				clientver: "9020",
				need_hash_offset: 1,
				relate: 1,
				resource: [{
					album_audio_id: songInfo.songmid.length == 32 ? songInfo.audioId.split("_")[0] : songInfo.songmid,
					album_id: songInfo.albumId,
					hash: songInfo.hash,
					id: 0,
					name: `${songInfo.singer} - ${songInfo.name}.mp3`,
					type: "audio"
				}],
				token: "",
				userid: 2626431536,
				vip: 1
			}
		}).promise.then(({ body }) => {
			if (body.error_code !== 0) return Promise.reject(/* @__PURE__ */ new Error("图片获取失败"));
			let info = body.data[0].info;
			const img = info.imgsize ? info.image.replace("{size}", info.imgsize[0]) : info.image;
			if (!img) return Promise.reject(/* @__PURE__ */ new Error("Pic get failed"));
			return img;
		});
	} };
	//#endregion
	//#region src/common/utils/lyricUtils/util.ts
	var encodeNames = {
		"&nbsp;": " ",
		"&amp;": "&",
		"&lt;": "<",
		"&gt;": ">",
		"&quot;": "\"",
		"&apos;": "'",
		"&#039;": "'"
	};
	var decodeName = (str = "") => {
		return str?.replace(/(?:&amp;|&lt;|&gt;|&quot;|&apos;|&#039;|&nbsp;)/gm, (s) => encodeNames[s]) ?? "";
	};
	//#endregion
	//#region src/common/utils/lyricUtils/kg.js
	var enc_key = Buffer.from([
		64,
		71,
		97,
		119,
		94,
		50,
		116,
		71,
		81,
		54,
		49,
		45,
		206,
		210,
		110,
		105
	], "binary");
	var decodeLyric$1 = (str) => new Promise((resolve, reject) => {
		if (!str.length) return;
		const buf_str = Buffer.from(str, "base64").subarray(4);
		for (let i = 0, len = buf_str.length; i < len; i++) buf_str[i] = buf_str[i] ^ enc_key[i % 16];
		inflate(buf_str, (err, result) => {
			if (err) return reject(err);
			resolve(result.toString());
		});
	});
	var headExp = /^.*\[id:\$\w+\]\n/;
	var parseLyric = (str) => {
		str = str.replace(/\r/g, "");
		if (headExp.test(str)) str = str.replace(headExp, "");
		let trans = str.match(/\[language:([\w=\\/+]+)\]/);
		let lyric;
		let rlyric;
		let tlyric;
		if (trans) {
			str = str.replace(/\[language:[\w=\\/+]+\]\n/, "");
			let json = JSON.parse(Buffer.from(trans[1], "base64").toString());
			for (const item of json.content) switch (item.type) {
				case 0:
					rlyric = item.lyricContent;
					break;
				case 1: tlyric = item.lyricContent;
			}
		}
		let i = 0;
		let lxlyric = str.replace(/\[((\d+),\d+)\].*/g, (str) => {
			let result = str.match(/\[((\d+),\d+)\].*/);
			let time = parseInt(result[2]);
			let ms = time % 1e3;
			time /= 1e3;
			let m = parseInt(time / 60).toString().padStart(2, "0");
			time %= 60;
			time = `${m}:${parseInt(time).toString().padStart(2, "0")}.${ms}`;
			if (rlyric) rlyric[i] = `[${time}]${rlyric[i]?.join("") ?? ""}`;
			if (tlyric) tlyric[i] = `[${time}]${tlyric[i]?.join("") ?? ""}`;
			i++;
			return str.replace(result[1], time);
		});
		rlyric = rlyric ? rlyric.join("\n") : "";
		tlyric = tlyric ? tlyric.join("\n") : "";
		lxlyric = lxlyric.replace(/<(\d+,\d+),\d+>/g, "<$1>");
		lxlyric = decodeName(lxlyric);
		lyric = lxlyric.replace(/<\d+,\d+>/g, "");
		rlyric = decodeName(rlyric);
		tlyric = decodeName(tlyric);
		return {
			lyric,
			tlyric,
			rlyric,
			lxlyric
		};
	};
	var decodeKrc = async (data) => {
		return decodeLyric$1(data).then(parseLyric);
	};
	//#endregion
	//#region backend/musicSdk/kg/lyric.js
	var lyric_default$3 = {
		getIntv(interval) {
			if (!interval) return 0;
			let intvArr = interval.split(":");
			let intv = 0;
			let unit = 1;
			while (intvArr.length) {
				intv += intvArr.pop() * unit;
				unit *= 60;
			}
			return parseInt(intv);
		},
		searchLyric(name, hash, time, tryNum = 0) {
			let requestObj = httpFetch$1(`http://lyrics.kugou.com/search?ver=1&man=yes&client=pc&keyword=${encodeURIComponent(name)}&hash=${hash}&timelength=${time}&lrctxt=1`, { headers: {
				"KG-RC": 1,
				"KG-THash": "expand_search_manager.cpp:852736169:451",
				"User-Agent": "KuGou2012-9020-ExpandSearchManager"
			} });
			requestObj.promise = requestObj.promise.then(({ body, statusCode }) => {
				if (statusCode !== 200) {
					if (tryNum > 5) return Promise.reject(/* @__PURE__ */ new Error("歌词获取失败"));
					let tryRequestObj = this.searchLyric(name, hash, time, ++tryNum);
					requestObj.cancelHttp = tryRequestObj.cancelHttp.bind(tryRequestObj);
					return tryRequestObj.promise;
				}
				if (body.candidates.length) {
					let info = body.candidates[0];
					return {
						id: info.id,
						accessKey: info.accesskey,
						fmt: info.krctype == 1 && info.contenttype != 1 ? "krc" : "lrc"
					};
				}
				return null;
			});
			return requestObj;
		},
		getLyricDownload(id, accessKey, fmt, tryNum = 0) {
			let requestObj = httpFetch$1(`http://lyrics.kugou.com/download?ver=1&client=pc&id=${id}&accesskey=${accessKey}&fmt=${fmt}&charset=utf8`, { headers: {
				"KG-RC": 1,
				"KG-THash": "expand_search_manager.cpp:852736169:451",
				"User-Agent": "KuGou2012-9020-ExpandSearchManager"
			} });
			requestObj.promise = requestObj.promise.then(({ body, statusCode }) => {
				if (statusCode !== 200) {
					if (tryNum > 5) return Promise.reject(/* @__PURE__ */ new Error("歌词获取失败"));
					let tryRequestObj = this.getLyric(id, accessKey, fmt, ++tryNum);
					requestObj.cancelHttp = tryRequestObj.cancelHttp.bind(tryRequestObj);
					return tryRequestObj.promise;
				}
				switch (body.fmt) {
					case "krc": return decodeKrc(body.content);
					case "lrc": return {
						lyric: import_buffer$1.Buffer.from(body.content, "base64").toString("utf-8"),
						tlyric: "",
						rlyric: "",
						lxlyric: ""
					};
					default: return Promise.reject(/* @__PURE__ */ new Error(`未知歌词格式: ${body.fmt}`));
				}
			});
			return requestObj;
		},
		getLyric(songInfo, tryNum = 0) {
			let requestObj = this.searchLyric(songInfo.name, songInfo.hash, songInfo._interval || this.getIntv(songInfo.interval));
			requestObj.promise = requestObj.promise.then((result) => {
				if (!result) return Promise.reject(/* @__PURE__ */ new Error("Get lyric failed"));
				let requestObj2 = this.getLyricDownload(result.id, result.accessKey, result.fmt);
				requestObj.cancelHttp = requestObj2.cancelHttp.bind(requestObj2);
				return requestObj2.promise;
			});
			return requestObj;
		}
	};
	//#endregion
	//#region backend/musicSdk/kg/index.js
	var kg = {
		leaderboard: leaderboard_default$4,
		songList: songList_default$4,
		musicSearch: musicSearch_default$4,
		hotSearch: {
			_requestObj: null,
			async getList(retryNum = 0) {
				if (this._requestObj) this._requestObj.cancelHttp();
				if (retryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
				const { body, statusCode } = await httpFetch$1("http://gateway.kugou.com/api/v3/search/hot_tab?signature=ee44edb9d7155821412d220bcaf509dd&appid=1005&clientver=10026&plat=0", {
					method: "get",
					headers: {
						dfid: "1ssiv93oVqMp27cirf2CvoF1",
						mid: "156798703528610303473757548878786007104",
						clienttime: 1584257267,
						"x-router": "msearch.kugou.com",
						"user-agent": "Android9-AndroidPhone-10020-130-0-searchrecommendprotocol-wifi",
						"kg-rc": 1
					}
				}).promise;
				if (statusCode != 200 || body.errcode !== 0) throw new Error("获取热搜词失败");
				return {
					source: "kg",
					list: this.filterList(body.data.list)
				};
			},
			filterList(rawList) {
				const list = [];
				rawList.forEach((item) => {
					item.keywords.map((k) => list.push(decodeName$1(k.keyword)));
				});
				return list;
			}
		},
		comment: {
			_requestObj: null,
			_requestObj2: null,
			async getComment({ hash }, page = 1, limit = 20) {
				if (this._requestObj) this._requestObj.cancelHttp();
				const params = `dfid=0&mid=16249512204336365674023395779019&clienttime=${Date.now()}&uuid=0&extdata=${hash}&appid=1005&code=fc4be23b4e972707f36b8a828a93ba8a&schash=${hash}&clientver=11409&p=${page}&clienttoken=&pagesize=${limit}&ver=10&kugouid=0`;
				const { body, statusCode } = await httpFetch$1(`http://m.comment.service.kugou.com/r/v1/rank/newest?${params}&signature=${signatureParams(params)}`, { headers: { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.24" } }).promise;
				if (statusCode != 200 || body.err_code !== 0) throw new Error("获取评论失败");
				const total = body.count ?? 0;
				return {
					source: "kg",
					comments: this.filterComment(body.list || []),
					total,
					page,
					limit,
					maxPage: Math.ceil(total / limit) || 1
				};
			},
			async getHotComment({ hash }, page = 1, limit = 20) {
				if (this._requestObj2) this._requestObj2.cancelHttp();
				const params = `dfid=0&mid=16249512204336365674023395779019&clienttime=${Date.now()}&uuid=0&extdata=${hash}&appid=1005&code=fc4be23b4e972707f36b8a828a93ba8a&schash=${hash}&clientver=11409&p=${page}&clienttoken=&pagesize=${limit}&ver=10&kugouid=0`;
				const { body, statusCode } = await httpFetch$1(`http://m.comment.service.kugou.com/r/v1/rank/topliked?${params}&signature=${signatureParams(params)}`, { headers: { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.24" } }).promise;
				if (statusCode != 200 || body.err_code !== 0) throw new Error("获取热门评论失败");
				const total = body.count ?? 0;
				return {
					source: "kg",
					comments: this.filterComment(body.list || []),
					total,
					page,
					limit,
					maxPage: Math.ceil(total / limit) || 1
				};
			},
			async getReplyComment({ songmid, audioId }, replyId, page = 1, limit = 100) {
				if (this._requestObj2) this._requestObj2.cancelHttp();
				songmid = songmid.length == 32 ? audioId.split("_")[0] : songmid;
				const { body, statusCode } = await httpFetch$1(`http://comment.service.kugou.com/index.php?r=commentsv2/getReplyWithLike&code=fc4be23b4e972707f36b8a828a93ba8a&p=${page}&pagesize=${limit}&ver=1.01&clientver=8373&kugouid=687373022&need_show_image=1&appid=1001&childrenid=${songmid}&tid=${replyId}`, { headers: { "User-Agent": "Android712-AndroidPhone-8983-18-0-COMMENT-wifi" } }).promise;
				if (statusCode != 200 || body.err_code !== 0) throw new Error("获取回复评论失败");
				return {
					source: "kg",
					comments: this.filterComment(body.list || [])
				};
			},
			replaceAt(raw, atList) {
				atList.forEach((atobj) => {
					raw = raw.replaceAll(`[at=${atobj.id}]`, `@${atobj.name} `);
				});
				return raw;
			},
			filterComment(rawList) {
				return rawList.map((item) => {
					let data = {
						id: item.id,
						text: decodeName$1((item.atlist ? this.replaceAt(item.content, item.atlist) : item.content) || ""),
						images: item.images ? item.images.map((i) => i.url) : [],
						location: item.location,
						time: item.addtime,
						timeStr: dateFormat2(new Date(item.addtime).getTime()),
						userName: item.user_name,
						avatar: item.user_pic,
						userId: item.user_id,
						likedCount: item.like.likenum,
						replyNum: item.reply_num,
						reply: []
					};
					return item.pcontent ? {
						id: item.id,
						text: decodeName$1(item.pcontent),
						time: null,
						userName: item.puser,
						avatar: null,
						userId: item.puser_id,
						likedCount: null,
						replyNum: null,
						reply: [data]
					} : data;
				});
			}
		},
		getMusicUrl(songInfo, type) {
			return apis("kg").getMusicUrl(songInfo, type);
		},
		getLyric(songInfo) {
			return lyric_default$3.getLyric(songInfo);
		},
		getPic(songInfo) {
			return pic_default$1.getPic(songInfo);
		},
		getMusicDetailPageUrl(songInfo) {
			return `https://www.kugou.com/song/#hash=${songInfo.hash}&album_id=${songInfo.albumId}`;
		}
	};
	//#endregion
	//#region backend/musicSdk/tx/leaderboard.js
	var boardList$2 = [
		{
			id: "tx__4",
			name: "流行指数榜",
			bangid: "4"
		},
		{
			id: "tx__26",
			name: "热歌榜",
			bangid: "26"
		},
		{
			id: "tx__27",
			name: "新歌榜",
			bangid: "27"
		},
		{
			id: "tx__62",
			name: "飙升榜",
			bangid: "62"
		},
		{
			id: "tx__58",
			name: "说唱榜",
			bangid: "58"
		},
		{
			id: "tx__57",
			name: "喜力电音榜",
			bangid: "57"
		},
		{
			id: "tx__28",
			name: "网络歌曲榜",
			bangid: "28"
		},
		{
			id: "tx__5",
			name: "内地榜",
			bangid: "5"
		},
		{
			id: "tx__3",
			name: "欧美榜",
			bangid: "3"
		},
		{
			id: "tx__59",
			name: "香港地区榜",
			bangid: "59"
		},
		{
			id: "tx__16",
			name: "韩国榜",
			bangid: "16"
		},
		{
			id: "tx__60",
			name: "抖快榜",
			bangid: "60"
		},
		{
			id: "tx__29",
			name: "影视金曲榜",
			bangid: "29"
		},
		{
			id: "tx__17",
			name: "日本榜",
			bangid: "17"
		},
		{
			id: "tx__52",
			name: "腾讯音乐人原创榜",
			bangid: "52"
		},
		{
			id: "tx__36",
			name: "K歌金曲榜",
			bangid: "36"
		},
		{
			id: "tx__61",
			name: "台湾地区榜",
			bangid: "61"
		},
		{
			id: "tx__63",
			name: "DJ舞曲榜",
			bangid: "63"
		},
		{
			id: "tx__64",
			name: "综艺新歌榜",
			bangid: "64"
		},
		{
			id: "tx__65",
			name: "国风热歌榜",
			bangid: "65"
		},
		{
			id: "tx__67",
			name: "听歌识曲榜",
			bangid: "67"
		},
		{
			id: "tx__72",
			name: "动漫音乐榜",
			bangid: "72"
		},
		{
			id: "tx__73",
			name: "游戏音乐榜",
			bangid: "73"
		},
		{
			id: "tx__75",
			name: "有声榜",
			bangid: "75"
		},
		{
			id: "tx__131",
			name: "校园音乐人排行榜",
			bangid: "131"
		}
	];
	var leaderboard_default$3 = {
		limit: 300,
		list: [
			{
				id: "txlxzsb",
				name: "流行榜",
				bangid: 4
			},
			{
				id: "txrgb",
				name: "热歌榜",
				bangid: 26
			},
			{
				id: "txwlhgb",
				name: "网络榜",
				bangid: 28
			},
			{
				id: "txdyb",
				name: "抖音榜",
				bangid: 60
			},
			{
				id: "txndb",
				name: "内地榜",
				bangid: 5
			},
			{
				id: "txxgb",
				name: "香港榜",
				bangid: 59
			},
			{
				id: "txtwb",
				name: "台湾榜",
				bangid: 61
			},
			{
				id: "txoumb",
				name: "欧美榜",
				bangid: 3
			},
			{
				id: "txhgb",
				name: "韩国榜",
				bangid: 16
			},
			{
				id: "txrbb",
				name: "日本榜",
				bangid: 17
			},
			{
				id: "txtybb",
				name: "YouTube榜",
				bangid: 128
			}
		],
		listDetailRequest(id, period, limit) {
			return httpFetch$1("https://u.y.qq.com/cgi-bin/musicu.fcg", {
				method: "post",
				headers: { "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)" },
				body: {
					toplist: {
						module: "musicToplist.ToplistInfoServer",
						method: "GetDetail",
						param: {
							topid: id,
							num: limit,
							period
						}
					},
					comm: {
						uin: 0,
						format: "json",
						ct: 20,
						cv: 1859
					}
				}
			}).promise;
		},
		regExps: {
			periodList: /<i class="play_cover__btn c_tx_link js_icon_play" data-listkey=".+?" data-listname=".+?" data-tid=".+?" data-date=".+?" .+?<\/i>/g,
			period: /data-listname="(.+?)" data-tid=".*?\/(.+?)" data-date="(.+?)" .+?<\/i>/
		},
		periods: {},
		periodUrl: "https://c.y.qq.com/node/pc/wk_v15/top.html",
		_requestBoardsObj: null,
		getBoardsData() {
			if (this._requestBoardsObj) this._requestBoardsObj.cancelHttp();
			this._requestBoardsObj = httpFetch$1("https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&uin=0&needNewCode=1&platform=h5");
			return this._requestBoardsObj.promise;
		},
		getData(url) {
			return httpFetch$1(url).promise;
		},
		filterData(rawList) {
			return rawList.map((item) => {
				let types = [];
				let _types = {};
				if (item.file.size_128mp3 !== 0) {
					let size = sizeFormate(item.file.size_128mp3);
					types.push({
						type: "128k",
						size
					});
					_types["128k"] = { size };
				}
				if (item.file.size_320mp3 !== 0) {
					let size = sizeFormate(item.file.size_320mp3);
					types.push({
						type: "320k",
						size
					});
					_types["320k"] = { size };
				}
				if (item.file.size_flac !== 0) {
					let size = sizeFormate(item.file.size_flac);
					types.push({
						type: "flac",
						size
					});
					_types.flac = { size };
				}
				if (item.file.size_hires !== 0) {
					let size = sizeFormate(item.file.size_hires);
					types.push({
						type: "flac24bit",
						size
					});
					_types.flac24bit = { size };
				}
				return {
					singer: formatSingerName(item.singer, "name"),
					name: item.title,
					albumName: item.album.name,
					albumId: item.album.mid,
					source: "tx",
					interval: formatPlayTime(item.interval),
					songId: item.id,
					albumMid: item.album.mid,
					strMediaMid: item.file.media_mid,
					songmid: item.mid,
					img: item.album.name === "" || item.album.name === "空" ? item.singer?.length ? `https://y.gtimg.cn/music/photo_new/T001R500x500M000${item.singer[0].mid}.jpg` : "" : `https://y.gtimg.cn/music/photo_new/T002R500x500M000${item.album.mid}.jpg`,
					lrc: null,
					otherSource: null,
					types,
					_types,
					typeUrl: {}
				};
			});
		},
		getPeriods(bangid) {
			return this.getData(this.periodUrl).then(({ body: html }) => {
				let result = html.match(this.regExps.periodList);
				if (!result) return Promise.reject(/* @__PURE__ */ new Error("get data failed"));
				result.forEach((item) => {
					let result = item.match(this.regExps.period);
					if (!result) return;
					this.periods[result[2]] = {
						name: result[1],
						bangid: result[2],
						period: result[3]
					};
				});
				const info = this.periods[bangid];
				return info && info.period;
			});
		},
		filterBoardsData(rawList) {
			let list = [];
			for (const board of rawList) {
				if (board.id == 201) continue;
				if (board.topTitle.startsWith("巅峰榜·")) board.topTitle = board.topTitle.substring(4, board.topTitle.length);
				if (!board.topTitle.endsWith("榜")) board.topTitle += "榜";
				list.push({
					id: "tx__" + board.id,
					name: board.topTitle,
					bangid: String(board.id)
				});
			}
			return list;
		},
		async getBoards(retryNum = 0) {
			this.list = boardList$2;
			return {
				list: boardList$2,
				source: "tx"
			};
		},
		getList(bangid, page, retryNum = 0) {
			if (++retryNum > 3) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
			bangid = parseInt(bangid);
			let info = this.periods[bangid];
			return (info ? Promise.resolve(info.period) : this.getPeriods(bangid)).then((period) => {
				return this.listDetailRequest(bangid, period, this.limit).then((resp) => {
					if (resp.body.code !== 0) return this.getList(bangid, page, retryNum);
					return {
						total: resp.body.toplist.data.songInfoList.length,
						list: this.filterData(resp.body.toplist.data.songInfoList),
						limit: this.limit,
						page: 1,
						source: "tx"
					};
				});
			});
		},
		getDetailPageUrl(id) {
			if (typeof id == "string") id = id.replace("tx__", "");
			return `https://y.qq.com/n/ryqq/toplist/${id}`;
		}
	};
	//#endregion
	//#region backend/musicSdk/tx/musicInfo.js
	var getSinger = (singers) => {
		let arr = [];
		singers.forEach((singer) => {
			arr.push(singer.name);
		});
		return arr.join("、");
	};
	var musicInfo_default$2 = (songmid) => {
		return httpFetch$1("https://u.y.qq.com/cgi-bin/musicu.fcg", {
			method: "post",
			headers: { "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)" },
			body: {
				comm: {
					ct: "19",
					cv: "1859",
					uin: "0"
				},
				req: {
					module: "music.pf_song_detail_svr",
					method: "get_song_detail_yqq",
					param: {
						song_type: 0,
						song_mid: songmid
					}
				}
			}
		}).promise.then(({ body }) => {
			if (body.code != 0 || body.req.code != 0) return Promise.reject(/* @__PURE__ */ new Error("获取歌曲信息失败"));
			const item = body.req.data.track_info;
			if (!item.file?.media_mid) return null;
			let types = [];
			let _types = {};
			const file = item.file;
			if (file.size_128mp3 != 0) {
				let size = sizeFormate(file.size_128mp3);
				types.push({
					type: "128k",
					size
				});
				_types["128k"] = { size };
			}
			if (file.size_320mp3 !== 0) {
				let size = sizeFormate(file.size_320mp3);
				types.push({
					type: "320k",
					size
				});
				_types["320k"] = { size };
			}
			if (file.size_flac !== 0) {
				let size = sizeFormate(file.size_flac);
				types.push({
					type: "flac",
					size
				});
				_types.flac = { size };
			}
			if (file.size_hires !== 0) {
				let size = sizeFormate(file.size_hires);
				types.push({
					type: "flac24bit",
					size
				});
				_types.flac24bit = { size };
			}
			let albumId = "";
			let albumName = "";
			if (item.album) {
				albumName = item.album.name;
				albumId = item.album.mid;
			}
			return {
				singer: getSinger(item.singer),
				name: item.title,
				albumName,
				albumId,
				source: "tx",
				interval: formatPlayTime(item.interval),
				songId: item.id,
				albumMid: item.album?.mid ?? "",
				strMediaMid: item.file.media_mid,
				songmid: item.mid,
				img: albumId === "" || albumId === "空" ? item.singer?.length ? `https://y.gtimg.cn/music/photo_new/T001R500x500M000${item.singer[0].mid}.jpg` : "" : `https://y.gtimg.cn/music/photo_new/T002R500x500M000${albumId}.jpg`,
				types,
				_types,
				typeUrl: {}
			};
		});
	};
	//#endregion
	//#region backend/musicSdk/tx/lyric.js
	var songIdMap$1 = /* @__PURE__ */ new Map();
	var promises$1 = /* @__PURE__ */ new Map();
	var decodeLyric = async (lrc, tlrc, rlrc) => ({
		lyric: "",
		tlyric: "",
		rlyric: ""
	});
	var parseTools$1 = {
		rxps: {
			info: /^{"/,
			lineTime: /^\[(\d+),\d+\]/,
			lineTime2: /^\[([\d:.]+)\]/,
			wordTime: /\(\d+,\d+\)/,
			wordTimeAll: /(\(\d+,\d+\))/g,
			timeLabelFixRxp: /(?:\.0+|0+)$/
		},
		msFormat(timeMs) {
			if (Number.isNaN(timeMs)) return "";
			let ms = timeMs % 1e3;
			timeMs /= 1e3;
			let m = parseInt(timeMs / 60).toString().padStart(2, "0");
			timeMs %= 60;
			return `[${m}:${parseInt(timeMs).toString().padStart(2, "0")}.${String(ms).padStart(3, "0")}]`;
		},
		parseLyric(lrc) {
			lrc = lrc.trim();
			lrc = lrc.replace(/\r/g, "");
			if (!lrc) return {
				lyric: "",
				lxlyric: ""
			};
			const lines = lrc.split("\n");
			const lxlrcLines = [];
			const lrcLines = [];
			for (let line of lines) {
				line = line.trim();
				let result = this.rxps.lineTime.exec(line);
				if (!result) {
					if (line.startsWith("[offset")) {
						lxlrcLines.push(line);
						lrcLines.push(line);
					}
					if (this.rxps.lineTime2.test(line)) lrcLines.push(line);
					continue;
				}
				const startMsTime = parseInt(result[1]);
				const startTimeStr = this.msFormat(startMsTime);
				if (!startTimeStr) continue;
				let words = line.replace(this.rxps.lineTime, "");
				lrcLines.push(`${startTimeStr}${words.replace(this.rxps.wordTimeAll, "")}`);
				let times = words.match(this.rxps.wordTimeAll);
				if (!times) continue;
				times = times.map((time) => {
					const result = /\((\d+),(\d+)\)/.exec(time);
					return `<${Math.max(parseInt(result[1]) - startMsTime, 0)},${result[2]}>`;
				});
				const wordArr = words.split(this.rxps.wordTime);
				const newWords = times.map((time, index) => `${time}${wordArr[index]}`).join("");
				lxlrcLines.push(`${startTimeStr}${newWords}`);
			}
			return {
				lyric: lrcLines.join("\n"),
				lxlyric: lxlrcLines.join("\n")
			};
		},
		parseRlyric(lrc) {
			lrc = lrc.trim();
			lrc = lrc.replace(/\r/g, "");
			if (!lrc) return {
				lyric: "",
				lxlyric: ""
			};
			const lines = lrc.split("\n");
			const lrcLines = [];
			for (let line of lines) {
				line = line.trim();
				let result = this.rxps.lineTime.exec(line);
				if (!result) continue;
				const startMsTime = parseInt(result[1]);
				const startTimeStr = this.msFormat(startMsTime);
				if (!startTimeStr) continue;
				let words = line.replace(this.rxps.lineTime, "");
				lrcLines.push(`${startTimeStr}${words.replace(this.rxps.wordTimeAll, "")}`);
			}
			return lrcLines.join("\n");
		},
		removeTag(str) {
			return str.replace(/^[\S\s]*?LyricContent="/, "").replace(/"\/>[\S\s]*?$/, "");
		},
		getIntv(interval) {
			if (!interval) return 0;
			if (!interval.includes(".")) interval += ".0";
			let arr = interval.split(/:|\./);
			while (arr.length < 3) arr.unshift("0");
			const [m, s, ms] = arr;
			return parseInt(m) * 36e5 + parseInt(s) * 1e3 + parseInt(ms);
		},
		fixRlrcTimeTag(rlrc, lrc) {
			const rlrcLines = rlrc.split("\n");
			let lrcLines = lrc.split("\n");
			let newLrc = [];
			rlrcLines.forEach((line) => {
				const result = this.rxps.lineTime2.exec(line);
				if (!result) return;
				if (!line.replace(this.rxps.lineTime2, "").trim()) return;
				const t1 = this.getIntv(result[1]);
				while (lrcLines.length) {
					const lrcLine = lrcLines.shift();
					const lrcLineResult = this.rxps.lineTime2.exec(lrcLine);
					if (!lrcLineResult) continue;
					const t2 = this.getIntv(lrcLineResult[1]);
					if (Math.abs(t1 - t2) < 100) {
						newLrc.push(line.replace(this.rxps.lineTime2, lrcLineResult[0]));
						break;
					}
				}
			});
			return newLrc.join("\n");
		},
		fixTlrcTimeTag(tlrc, lrc) {
			const tlrcLines = tlrc.split("\n");
			let lrcLines = lrc.split("\n");
			let newLrc = [];
			tlrcLines.forEach((line) => {
				const result = this.rxps.lineTime2.exec(line);
				if (!result) return;
				if (!line.replace(this.rxps.lineTime2, "").trim()) return;
				let time = result[1];
				if (time.includes(".")) time += "".padStart(3 - time.split(".")[1].length, "0");
				const t1 = this.getIntv(time);
				while (lrcLines.length) {
					const lrcLine = lrcLines.shift();
					const lrcLineResult = this.rxps.lineTime2.exec(lrcLine);
					if (!lrcLineResult) continue;
					const t2 = this.getIntv(lrcLineResult[1]);
					if (Math.abs(t1 - t2) < 100) {
						newLrc.push(line.replace(this.rxps.lineTime2, lrcLineResult[0]));
						break;
					}
				}
			});
			return newLrc.join("\n");
		},
		parse(lrc, tlrc, rlrc) {
			const info = {
				lyric: "",
				tlyric: "",
				rlyric: "",
				lxlyric: ""
			};
			if (lrc) {
				let { lyric, lxlyric } = this.parseLyric(this.removeTag(lrc));
				info.lyric = lyric;
				info.lxlyric = lxlyric;
			}
			if (rlrc) info.rlyric = this.fixRlrcTimeTag(this.parseRlyric(this.removeTag(rlrc)), info.lyric);
			if (tlrc) info.tlyric = this.fixTlrcTimeTag(tlrc, info.lyric);
			return info;
		}
	};
	var lyric_default$2 = {
		successCode: 0,
		async getSongId({ songId, songmid }) {
			if (songId) return songId;
			if (songIdMap$1.has(songmid)) return songIdMap$1.get(songmid);
			if (promises$1.has(songmid)) return (await promises$1.get(songmid)).songId;
			const promise = musicInfo_default$2(songmid);
			promises$1.set(promise);
			const info = await promise;
			songIdMap$1.set(songmid, info.songId);
			promises$1.delete(songmid);
			return info.songId;
		},
		async parseLyric(lrc, tlrc, rlrc) {
			const { lyric, tlyric, rlyric } = await decodeLyric(lrc, tlrc, rlrc);
			return parseTools$1.parse(lyric, tlyric, rlyric);
		},
		getLyric(mInfo, retryNum = 0) {
			if (retryNum > 3) return Promise.reject(/* @__PURE__ */ new Error("Get lyric failed"));
			return {
				cancelHttp() {},
				promise: this.getSongId(mInfo).then((songId) => {
					return httpFetch$1("https://u.y.qq.com/cgi-bin/musicu.fcg", {
						method: "post",
						headers: {
							referer: "https://y.qq.com",
							"user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36"
						},
						body: {
							comm: {
								ct: "19",
								cv: "1859",
								uin: "0"
							},
							req: {
								method: "GetPlayLyricInfo",
								module: "music.musichallSong.PlayLyricInfo",
								param: {
									format: "json",
									crypt: 1,
									ct: 19,
									cv: 1873,
									interval: 0,
									lrc_t: 0,
									qrc: 1,
									qrc_t: 0,
									roma: 1,
									roma_t: 0,
									songID: songId,
									trans: 1,
									trans_t: 0,
									type: -1
								}
							}
						}
					}).promise.then(({ body }) => {
						if (body.code != this.successCode || body.req.code != this.successCode) return this.getLyric(songId, ++retryNum);
						const data = body.req.data;
						return this.parseLyric(data.lyric, data.trans, data.roma);
					});
				})
			};
		}
	};
	//#endregion
	//#region backend/musicSdk/tx/songList.js
	var songList_default$3 = {
		_requestObj_tags: null,
		_requestObj_hotTags: null,
		_requestObj_list: null,
		limit_list: 36,
		limit_song: 1e5,
		successCode: 0,
		sortList: [{
			name: "最热",
			id: 5
		}, {
			name: "最新",
			id: 2
		}],
		regExps: {
			hotTagHtml: /class="c_bg_link js_tag_item" data-id="\w+">.+?<\/a>/g,
			hotTag: /data-id="(\w+)">(.+?)<\/a>/,
			listDetailLink: /\/playlist\/(\d+)/,
			listDetailLink2: /id=(\d+)/
		},
		tagsUrl: "https://u.y.qq.com/cgi-bin/musicu.fcg?loginUin=0&hostUin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=wk_v15.json&needNewCode=0&data=%7B%22tags%22%3A%7B%22method%22%3A%22get_all_categories%22%2C%22param%22%3A%7B%22qq%22%3A%22%22%7D%2C%22module%22%3A%22playlist.PlaylistAllCategoriesServer%22%7D%7D",
		hotTagUrl: "https://c.y.qq.com/node/pc/wk_v15/category_playlist.html",
		getListUrl(sortId, id, page) {
			if (id) {
				id = parseInt(id);
				return `https://u.y.qq.com/cgi-bin/musicu.fcg?loginUin=0&hostUin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=wk_v15.json&needNewCode=0&data=${encodeURIComponent(JSON.stringify({
					comm: {
						cv: 1602,
						ct: 20
					},
					playlist: {
						method: "get_category_content",
						param: {
							titleid: id,
							caller: "0",
							category_id: id,
							size: this.limit_list,
							page: page - 1,
							use_page: 1
						},
						module: "playlist.PlayListCategoryServer"
					}
				}))}`;
			}
			return `https://u.y.qq.com/cgi-bin/musicu.fcg?loginUin=0&hostUin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=wk_v15.json&needNewCode=0&data=${encodeURIComponent(JSON.stringify({
				comm: {
					cv: 1602,
					ct: 20
				},
				playlist: {
					method: "get_playlist_by_tag",
					param: {
						id: 1e7,
						sin: this.limit_list * (page - 1),
						size: this.limit_list,
						order: sortId,
						cur_page: page
					},
					module: "playlist.PlayListPlazaServer"
				}
			}))}`;
		},
		getListDetailUrl(id) {
			return `https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?type=1&json=1&utf8=1&onlysong=0&new_format=1&disstid=${id}&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0`;
		},
		getTag(tryNum = 0) {
			if (this._requestObj_tags) this._requestObj_tags.cancelHttp();
			if (tryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
			this._requestObj_tags = httpFetch$1(this.tagsUrl);
			return this._requestObj_tags.promise.then(({ body }) => {
				if (body.code !== this.successCode) return this.getTag(++tryNum);
				return this.filterTagInfo(body.tags.data.v_group);
			});
		},
		getHotTag(tryNum = 0) {
			if (this._requestObj_hotTags) this._requestObj_hotTags.cancelHttp();
			if (tryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
			this._requestObj_hotTags = httpFetch$1(this.hotTagUrl);
			return this._requestObj_hotTags.promise.then(({ statusCode, body }) => {
				if (statusCode !== 200) return this.getHotTag(++tryNum);
				return this.filterInfoHotTag(body);
			});
		},
		filterInfoHotTag(html) {
			let hotTag = html.match(this.regExps.hotTagHtml);
			const hotTags = [];
			if (!hotTag) return hotTags;
			hotTag.forEach((tagHtml) => {
				let result = tagHtml.match(this.regExps.hotTag);
				if (!result) return;
				hotTags.push({
					id: parseInt(result[1]),
					name: result[2],
					source: "tx"
				});
			});
			return hotTags;
		},
		filterTagInfo(rawList) {
			return rawList.map((type) => ({
				name: type.group_name,
				list: type.v_item.map((item) => ({
					parent_id: type.group_id,
					parent_name: type.group_name,
					id: item.id,
					name: item.name,
					source: "tx"
				}))
			}));
		},
		getList(sortId, tagId, page, tryNum = 0) {
			if (this._requestObj_list) this._requestObj_list.cancelHttp();
			if (tryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
			this._requestObj_list = httpFetch$1(this.getListUrl(sortId, tagId, page));
			return this._requestObj_list.promise.then(({ body }) => {
				if (body.code !== this.successCode) return this.getList(sortId, tagId, page, ++tryNum);
				return tagId ? this.filterList2(body.playlist.data, page) : this.filterList(body.playlist.data, page);
			});
		},
		filterList(data, page) {
			return {
				list: data.v_playlist.map((item) => ({
					play_count: formatPlayCount(item.access_num),
					id: String(item.tid),
					author: item.creator_info.nick,
					name: item.title,
					time: item.modify_time ? dateFormat(item.modify_time * 1e3, "Y-M-D") : "",
					img: item.cover_url_medium,
					total: item.song_ids?.length,
					desc: decodeName$1(item.desc).replace(/<br>/g, "\n"),
					source: "tx"
				})),
				total: data.total,
				page,
				limit: this.limit_list,
				source: "tx"
			};
		},
		filterList2({ content }, page) {
			return {
				list: content.v_item.map(({ basic }) => ({
					play_count: formatPlayCount(basic.play_cnt),
					id: String(basic.tid),
					author: basic.creator.nick,
					name: basic.title,
					img: basic.cover.medium_url || basic.cover.default_url,
					desc: decodeName$1(basic.desc).replace(/<br>/g, "\n"),
					source: "tx"
				})),
				total: content.total_cnt,
				page,
				limit: this.limit_list,
				source: "tx"
			};
		},
		async handleParseId(link, retryNum = 0) {
			if (retryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("link try max num"));
			const { headers: { location }, statusCode } = await httpFetch$1(link).promise;
			if (statusCode > 400) return this.handleParseId(link, ++retryNum);
			return location == null ? link : location;
		},
		async getListId(id) {
			if (/[?&:/]/.test(id)) {
				if (!this.regExps.listDetailLink.test(id)) id = await this.handleParseId(id);
				let result = this.regExps.listDetailLink.exec(id);
				if (!result) {
					result = this.regExps.listDetailLink2.exec(id);
					if (!result) throw new Error("failed");
				}
				id = result[1];
			}
			return id;
		},
		async getListDetail(id, tryNum = 0) {
			if (tryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
			id = await this.getListId(id);
			const { body } = await httpFetch$1(this.getListDetailUrl(id), { headers: {
				Origin: "https://y.qq.com",
				Referer: `https://y.qq.com/n/yqq/playsquare/${id}.html`
			} }).promise;
			if (body.code !== this.successCode) return this.getListDetail(id, ++tryNum);
			const cdlist = body.cdlist[0];
			return {
				list: this.filterListDetail(cdlist.songlist),
				page: 1,
				limit: cdlist.songlist.length + 1,
				total: cdlist.songlist.length,
				source: "tx",
				info: {
					name: cdlist.dissname,
					img: cdlist.logo,
					desc: decodeName$1(cdlist.desc).replace(/<br>/g, "\n"),
					author: cdlist.nickname,
					play_count: formatPlayCount(cdlist.visitnum)
				}
			};
		},
		filterListDetail(rawList) {
			return rawList.map((item) => {
				let types = [];
				let _types = {};
				if (item.file.size_128mp3 !== 0) {
					let size = sizeFormate(item.file.size_128mp3);
					types.push({
						type: "128k",
						size
					});
					_types["128k"] = { size };
				}
				if (item.file.size_320mp3 !== 0) {
					let size = sizeFormate(item.file.size_320mp3);
					types.push({
						type: "320k",
						size
					});
					_types["320k"] = { size };
				}
				if (item.file.size_flac !== 0) {
					let size = sizeFormate(item.file.size_flac);
					types.push({
						type: "flac",
						size
					});
					_types.flac = { size };
				}
				if (item.file.size_hires !== 0) {
					let size = sizeFormate(item.file.size_hires);
					types.push({
						type: "flac24bit",
						size
					});
					_types.flac24bit = { size };
				}
				return {
					singer: formatSingerName(item.singer, "name"),
					name: item.title,
					albumName: item.album.name,
					albumId: item.album.mid,
					source: "tx",
					interval: formatPlayTime(item.interval),
					songId: item.id,
					albumMid: item.album.mid,
					strMediaMid: item.file.media_mid,
					songmid: item.mid,
					img: item.album.name === "" || item.album.name === "空" ? item.singer?.length ? `https://y.gtimg.cn/music/photo_new/T001R500x500M000${item.singer[0].mid}.jpg` : "" : `https://y.gtimg.cn/music/photo_new/T002R500x500M000${item.album.mid}.jpg`,
					lrc: null,
					otherSource: null,
					types,
					_types,
					typeUrl: {}
				};
			});
		},
		getTags() {
			return Promise.all([this.getTag(), this.getHotTag()]).then(([tags, hotTag]) => ({
				tags,
				hotTag,
				source: "tx"
			}));
		},
		async getDetailPageUrl(id) {
			id = await this.getListId(id);
			return `https://y.qq.com/n/ryqq/playlist/${id}`;
		},
		search(text, page, limit = 20, retryNum = 0) {
			if (retryNum > 5) throw new Error("max retry");
			return httpFetch$1(`http://c.y.qq.com/soso/fcgi-bin/client_music_search_songlist?page_no=${page - 1}&num_per_page=${limit}&format=json&query=${encodeURIComponent(text)}&remoteplace=txt.yqq.playlist&inCharset=utf8&outCharset=utf-8`, { headers: {
				"User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)",
				Referer: "http://y.qq.com/portal/search.html"
			} }).promise.then(({ body }) => {
				if (body.code != 0) return this.search(text, page, limit, ++retryNum);
				return {
					list: body.data.list.map((item) => {
						return {
							play_count: formatPlayCount(item.listennum),
							id: String(item.dissid),
							author: decodeName$1(item.creator.name),
							name: decodeName$1(item.dissname),
							time: dateFormat(item.createtime, "Y-M-D"),
							img: item.imgurl,
							total: item.song_count,
							desc: decodeName$1(decodeName$1(item.introduction)).replace(/<br>/g, "\n"),
							source: "tx"
						};
					}),
					limit,
					total: body.data.sum,
					source: "tx"
				};
			});
		}
	};
	//#endregion
	//#region backend/musicSdk/tx/utils/crypto.js
	init_crypto();
	var PART_1_INDEXES = [
		23,
		14,
		6,
		36,
		16,
		40,
		7,
		19
	];
	var PART_2_INDEXES = [
		16,
		1,
		32,
		12,
		19,
		27,
		8,
		5
	];
	var SCRAMBLE_VALUES = [
		89,
		39,
		179,
		150,
		218,
		82,
		58,
		252,
		177,
		52,
		186,
		123,
		120,
		64,
		242,
		133,
		143,
		161,
		121,
		179
	];
	async function hashSHA1(data) {
		return crypto_default.createHash("sha1").update(data).digest("hex");
	}
	function pickHashByIdx(hash, indexes) {
		return indexes.map((idx) => hash[idx]).join("");
	}
	function base64Encode(data) {
		return import_buffer$1.Buffer.from(data).toString("base64").replace(/[\\/+=]/g, "");
	}
	async function zzcSign(text) {
		const hash = await hashSHA1(text);
		const part1 = pickHashByIdx(hash, PART_1_INDEXES);
		const part2 = pickHashByIdx(hash, PART_2_INDEXES);
		return `zzc${part1}${base64Encode(SCRAMBLE_VALUES.map((value, i) => value ^ parseInt(hash.slice(i * 2, i * 2 + 2), 16))).replace(/[\\/+=]/g, "")}${part2}`.toLowerCase();
	}
	//#endregion
	//#region backend/musicSdk/tx/utils/index.js
	var signRequest = async (data) => {
		return httpFetch$1(`https://u.y.qq.com/cgi-bin/musics.fcg?sign=${await zzcSign(JSON.stringify(data))}`, {
			method: "post",
			headers: { "User-Agent": "QQMusic 14090508(android 12)" },
			body: data
		}).promise;
	};
	//#endregion
	//#region backend/musicSdk/tx/musicSearch.js
	var musicSearch_default$3 = {
		limit: 50,
		total: 0,
		page: 0,
		allPage: 1,
		successCode: 0,
		musicSearch(str, page, limit, retryNum = 0) {
			if (retryNum > 5) return Promise.reject(/* @__PURE__ */ new Error("搜索失败"));
			return signRequest({
				comm: {
					ct: "11",
					cv: "14090508",
					v: "14090508",
					tmeAppID: "qqmusic",
					phonetype: "EBG-AN10",
					deviceScore: "553.47",
					devicelevel: "50",
					newdevicelevel: "20",
					rom: "HuaWei/EMOTION/EmotionUI_14.2.0",
					os_ver: "12",
					OpenUDID: "0",
					OpenUDID2: "0",
					QIMEI36: "0",
					udid: "0",
					chid: "0",
					aid: "0",
					oaid: "0",
					taid: "0",
					tid: "0",
					wid: "0",
					uid: "0",
					sid: "0",
					modeSwitch: "6",
					teenMode: "0",
					ui_mode: "2",
					nettype: "1020",
					v4ip: ""
				},
				req: {
					module: "music.search.SearchCgiService",
					method: "DoSearchForQQMusicMobile",
					param: {
						search_type: 0,
						searchid: Math.random().toString().slice(2),
						query: str,
						page_num: page,
						num_per_page: limit,
						highlight: 0,
						nqc_flag: 0,
						multi_zhida: 0,
						cat: 2,
						grp: 1,
						sin: 0,
						sem: 0
					}
				}
			}).then(({ body }) => {
				if (!body || !body.req || body.code != this.successCode || body.req.code != this.successCode) return this.musicSearch(str, page, limit, ++retryNum);
				return body.req.data;
			});
		},
		handleResult(rawList) {
			if (!rawList || !Array.isArray(rawList)) return [];
			const list = [];
			rawList.forEach((item) => {
				if (!item.file?.media_mid) return;
				let types = [];
				let _types = {};
				const file = item.file;
				if (file.size_128mp3 != 0) {
					let size = sizeFormate(file.size_128mp3);
					types.push({
						type: "128k",
						size
					});
					_types["128k"] = { size };
				}
				if (file.size_320mp3 !== 0) {
					let size = sizeFormate(file.size_320mp3);
					types.push({
						type: "320k",
						size
					});
					_types["320k"] = { size };
				}
				if (file.size_flac !== 0) {
					let size = sizeFormate(file.size_flac);
					types.push({
						type: "flac",
						size
					});
					_types.flac = { size };
				}
				if (file.size_hires !== 0) {
					let size = sizeFormate(file.size_hires);
					types.push({
						type: "flac24bit",
						size
					});
					_types.flac24bit = { size };
				}
				let albumId = "";
				let albumName = "";
				if (item.album) {
					albumName = item.album.name;
					albumId = item.album.mid;
				}
				list.push({
					singer: formatSingerName(item.singer, "name"),
					name: item.title,
					albumName,
					albumId,
					source: "tx",
					interval: formatPlayTime(item.interval),
					songId: item.id,
					albumMid: item.album?.mid ?? "",
					strMediaMid: item.file.media_mid,
					songmid: item.mid,
					img: albumId === "" || albumId === "空" ? item.singer?.length ? `https://y.gtimg.cn/music/photo_new/T001R500x500M000${item.singer[0].mid}.jpg` : "" : `https://y.gtimg.cn/music/photo_new/T002R500x500M000${albumId}.jpg`,
					types,
					_types,
					typeUrl: {}
				});
			});
			return list;
		},
		search(str, page = 1, limit) {
			if (limit == null) limit = this.limit;
			return this.musicSearch(str, page, limit).then(({ body, meta }) => {
				let list = this.handleResult(body.item_song);
				this.total = meta.estimate_sum;
				this.page = page;
				this.allPage = Math.ceil(this.total / limit);
				return Promise.resolve({
					list,
					allPage: this.allPage,
					limit,
					total: this.total,
					source: "tx"
				});
			});
		}
	};
	//#endregion
	//#region backend/musicSdk/tx/hotSearch.js
	var hotSearch_default$3 = {
		_requestObj: null,
		async getList(retryNum = 0) {
			if (this._requestObj) this._requestObj.cancelHttp();
			if (retryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
			const { body, statusCode } = await httpFetch$1("https://u.y.qq.com/cgi-bin/musicu.fcg", {
				method: "post",
				body: {
					comm: {
						ct: "19",
						cv: "1803",
						guid: "0",
						patch: "118",
						psrf_access_token_expiresAt: 0,
						psrf_qqaccess_token: "",
						psrf_qqopenid: "",
						psrf_qqunionid: "",
						tmeAppID: "qqmusic",
						tmeLoginType: 0,
						uin: "0",
						wid: "0"
					},
					hotkey: {
						method: "GetHotkeyForQQMusicPC",
						module: "tencent_musicsoso_hotkey.HotkeyService",
						param: {
							search_id: "",
							uin: 0
						}
					}
				},
				headers: { Referer: "https://y.qq.com/portal/player.html" }
			}).promise;
			if (statusCode != 200 || body.code !== 0) throw new Error("获取热搜词失败");
			return {
				source: "tx",
				list: this.filterList(body.hotkey.data.vec_hotkey)
			};
		},
		filterList(rawList) {
			return rawList.map((item) => item.query);
		}
	};
	//#endregion
	//#region backend/musicSdk/tx/comment.js
	var emojis$1 = {
		e400846: "😘",
		e400874: "😴",
		e400825: "😃",
		e400847: "😙",
		e400835: "😍",
		e400873: "😳",
		e400836: "😎",
		e400867: "😭",
		e400832: "😊",
		e400837: "😏",
		e400875: "😫",
		e400831: "😉",
		e400855: "😡",
		e400823: "😄",
		e400862: "😨",
		e400844: "😖",
		e400841: "😓",
		e400830: "😈",
		e400828: "😆",
		e400833: "😋",
		e400822: "😀",
		e400843: "😕",
		e400829: "😇",
		e400824: "😂",
		e400834: "😌",
		e400877: "😷",
		e400132: "🍉",
		e400181: "🍺",
		e401067: "☕️",
		e400186: "🥧",
		e400343: "🐷",
		e400116: "🌹",
		e400126: "🍃",
		e400613: "💋",
		e401236: "❤️",
		e400622: "💔",
		e400637: "💣",
		e400643: "💩",
		e400773: "🔪",
		e400102: "🌛",
		e401328: "🌞",
		e400420: "👏",
		e400914: "🙌",
		e400408: "👍",
		e400414: "👎",
		e401121: "✋",
		e400396: "👋",
		e400384: "👉",
		e401115: "✊",
		e400402: "👌",
		e400905: "🙈",
		e400906: "🙉",
		e400907: "🙊",
		e400562: "👻",
		e400932: "🙏",
		e400644: "💪",
		e400611: "💉",
		e400185: "🎁",
		e400655: "💰",
		e400325: "🐥",
		e400612: "💊",
		e400198: "🎉",
		e401685: "⚡️",
		e400631: "💝",
		e400768: "🔥",
		e400432: "👑"
	};
	var songIdMap = /* @__PURE__ */ new Map();
	var promises = /* @__PURE__ */ new Map();
	//#endregion
	//#region backend/musicSdk/tx/index.js
	var tx = {
		leaderboard: leaderboard_default$3,
		songList: songList_default$3,
		musicSearch: musicSearch_default$3,
		hotSearch: hotSearch_default$3,
		comment: {
			_requestObj: null,
			_requestObj2: null,
			async getSongId({ songId, songmid }) {
				if (songId) return songId;
				if (songIdMap.has(songmid)) return songIdMap.get(songmid);
				if (promises.has(songmid)) return (await promises.get(songmid)).songId;
				const promise = musicInfo_default$2(songmid);
				promises.set(promise);
				const info = await promise;
				songIdMap.set(songmid, info.songId);
				promises.delete(songmid);
				return info.songId;
			},
			async getComment(mInfo, page = 1, limit = 20) {
				if (this._requestObj) this._requestObj.cancelHttp();
				const { body, statusCode } = await httpFetch$1("http://c.y.qq.com/base/fcgi-bin/fcg_global_comment_h5.fcg", {
					method: "POST",
					headers: { "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)" },
					form: {
						uin: "0",
						format: "json",
						cid: "205360772",
						reqtype: "2",
						biztype: "1",
						topid: await this.getSongId(mInfo),
						cmd: "8",
						needmusiccrit: "1",
						pagenum: page - 1,
						pagesize: limit
					}
				}).promise;
				if (statusCode != 200 || body.code !== 0) throw new Error("获取评论失败");
				const comment = body.comment;
				return {
					source: "tx",
					comments: this.filterNewComment(comment.commentlist),
					total: comment.commenttotal,
					page,
					limit,
					maxPage: Math.ceil(comment.commenttotal / limit) || 1
				};
			},
			async getHotComment(mInfo, page = 1, limit = 20) {
				if (this._requestObj2) this._requestObj2.cancelHttp();
				const songId = await this.getSongId(mInfo);
				const { body, statusCode } = await httpFetch$1("https://u.y.qq.com/cgi-bin/musicu.fcg", {
					method: "POST",
					body: {
						comm: {
							cv: 4747474,
							ct: 24,
							format: "json",
							inCharset: "utf-8",
							outCharset: "utf-8",
							notice: 0,
							platform: "yqq.json",
							needNewCode: 1,
							uin: 0
						},
						req: {
							module: "music.globalComment.CommentRead",
							method: "GetHotCommentList",
							param: {
								BizType: 1,
								BizId: String(songId),
								LastCommentSeqNo: "",
								PageSize: limit,
								PageNum: page - 1,
								HotType: 1,
								WithAirborne: 0,
								PicEnable: 1
							}
						}
					},
					headers: {
						"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.0.0",
						referer: "https://y.qq.com/",
						origin: "https://y.qq.com"
					}
				}).promise;
				if (statusCode != 200 || body.code !== 0 || body.req.code !== 0) throw new Error("获取热门评论失败");
				const comment = body.req.data.CommentList;
				return {
					source: "tx",
					comments: this.filterHotComment(comment.Comments),
					total: comment.Total,
					page,
					limit,
					maxPage: Math.ceil(comment.Total / limit) || 1
				};
			},
			filterNewComment(rawList) {
				return rawList.map((item) => {
					let time = this.formatTime(item.time);
					let timeStr = time ? dateFormat2(time) : null;
					if (item.middlecommentcontent) {
						let firstItem = item.middlecommentcontent[0];
						firstItem.avatarurl = item.avatarurl;
						firstItem.praisenum = item.praisenum;
						item.avatarurl = null;
						item.praisenum = null;
						item.middlecommentcontent.reverse();
					}
					return {
						id: `${item.rootcommentid}_${item.commentid}`,
						rootId: item.rootcommentid,
						text: item.rootcommentcontent ? this.replaceEmoji(item.rootcommentcontent).replace(/\\n/g, "\n") : "",
						time: item.rootcommentid == item.commentid ? time : null,
						timeStr: item.rootcommentid == item.commentid ? timeStr : null,
						userName: item.rootcommentnick ? item.rootcommentnick.substring(1) : "",
						avatar: item.avatarurl,
						userId: item.encrypt_rootcommentuin,
						likedCount: item.praisenum,
						reply: item.middlecommentcontent ? item.middlecommentcontent.map((c) => {
							return {
								id: `sub_${item.rootcommentid}_${c.subcommentid}`,
								text: this.replaceEmoji(c.subcommentcontent).replace(/\\n/g, "\n"),
								time: c.subcommentid == item.commentid ? time : null,
								timeStr: c.subcommentid == item.commentid ? timeStr : null,
								userName: c.replynick.substring(1),
								avatar: c.avatarurl,
								userId: c.encrypt_replyuin,
								likedCount: c.praisenum
							};
						}) : []
					};
				});
			},
			filterHotComment(rawList) {
				return rawList.map((item) => {
					return {
						id: `${item.SeqNo}_${item.CmId}`,
						rootId: item.SeqNo,
						text: item.Content ? this.replaceEmoji(item.Content).replace(/\\n/g, "\n") : "",
						time: item.PubTime ? this.formatTime(item.PubTime) : null,
						timeStr: item.PubTime ? dateFormat2(this.formatTime(item.PubTime)) : null,
						userName: item.Nick ?? "",
						images: item.Pic ? [item.Pic] : [],
						avatar: item.Avatar,
						location: item.Location ? item.Location : "",
						userId: item.EncryptUin,
						likedCount: item.PraiseNum,
						reply: item.SubComments ? item.SubComments.map((c) => {
							return {
								id: `sub_${c.SeqNo}_${c.CmId}`,
								text: this.replaceEmoji(c.Content).replace(/\\n/g, "\n"),
								time: c.PubTime ? this.formatTime(c.PubTime) : null,
								timeStr: c.PubTime ? dateFormat2(this.formatTime(c.PubTime)) : null,
								userName: c.Nick ?? "",
								avatar: c.Avatar,
								images: c.Pic ? [c.Pic] : [],
								userId: c.EncryptUin,
								likedCount: c.PraiseNum
							};
						}) : []
					};
				});
			},
			replaceEmoji(msg) {
				let rxp = /^\[em\](e\d+)\[\/em\]$/;
				let result = msg.match(/\[em\]e\d+\[\/em\]/g);
				if (!result) return msg;
				result = Array.from(new Set(result));
				for (let item of result) {
					let code = item.replace(rxp, "$1");
					msg = msg.replace(new RegExp(item.replace("[em]", "\\[em\\]").replace("[/em]", "\\[\\/em\\]"), "g"), emojis$1[code] || "");
				}
				return msg;
			},
			formatTime(time) {
				return String(time).length < 10 ? null : parseInt(time + "000");
			}
		},
		getMusicUrl(songInfo, type) {
			return apis("tx").getMusicUrl(songInfo, type);
		},
		getLyric(songInfo) {
			return lyric_default$2.getLyric(songInfo);
		},
		async getPic(songInfo) {
			return `https://y.gtimg.cn/music/photo_new/T002R500x500M000${songInfo.albumId}.jpg`;
		},
		getMusicDetailPageUrl(songInfo) {
			return `https://y.qq.com/n/yqq/song/${songInfo.songmid}.html`;
		}
	};
	//#endregion
	//#region backend/musicSdk/wy/utils/crypto.js
	init_crypto();
	var iv = import_buffer$1.Buffer.from("0102030405060708");
	var presetKey = import_buffer$1.Buffer.from("0CoJUm6Qyw8W8jud");
	var linuxapiKey = import_buffer$1.Buffer.from("rFgB&h#%2?^eDg:Q");
	var base62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	var publicKey = "-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgtQn2JZ34ZC28NWYpAUd98iZ37BUrX/aKzmFbt7clFSs6sXqHauqKWqdtLkF2KexO40H1YTX8z2lSgBBOAxLsvaklV8k4cBFK9snQXE9/DDaFt6Rr7iVZMldczhC0JNgTz+SHXT6CBHuX3e9SdB1Ua44oncaTWz7OBGLbCiK45wIDAQAB\n-----END PUBLIC KEY-----";
	var eapiKey = "e82ckenh8dichen8";
	var aesEncrypt = (buffer, mode, key, iv) => {
		const cipher = createCipheriv(mode, key, iv);
		return import_buffer$1.Buffer.concat([cipher.update(buffer), cipher.final()]);
	};
	var rsaEncrypt = (buffer, key) => {
		buffer = import_buffer$1.Buffer.concat([import_buffer$1.Buffer.alloc(128 - buffer.length), buffer]);
		return publicEncrypt({
			key,
			padding: constants.RSA_NO_PADDING
		}, buffer);
	};
	var weapi = (object) => {
		const text = JSON.stringify(object);
		const secretKey = randomBytes(16).map((n) => base62.charAt(n % 62).charCodeAt());
		return {
			params: aesEncrypt(import_buffer$1.Buffer.from(aesEncrypt(import_buffer$1.Buffer.from(text), "aes-128-cbc", presetKey, iv).toString("base64")), "aes-128-cbc", secretKey, iv).toString("base64"),
			encSecKey: rsaEncrypt(secretKey.reverse(), publicKey).toString("hex")
		};
	};
	var linuxapi = (object) => {
		const text = JSON.stringify(object);
		return { eparams: aesEncrypt(import_buffer$1.Buffer.from(text), "aes-128-ecb", linuxapiKey, "").toString("hex").toUpperCase() };
	};
	var eapi = (url, object) => {
		const text = typeof object === "object" ? JSON.stringify(object) : object;
		const message = `nobody${url}use${text}md5forencrypt`;
		const data = `${url}-36cd479b6b5-${text}-36cd479b6b5-${createHash("md5").update(message).digest("hex")}`;
		return { params: aesEncrypt(import_buffer$1.Buffer.from(data), "aes-128-ecb", eapiKey, "").toString("hex").toUpperCase() };
	};
	//#endregion
	//#region backend/musicSdk/wy/musicDetail.js
	var musicDetail_default = {
		getSinger(singers) {
			let arr = [];
			singers?.forEach((singer) => {
				arr.push(singer.name);
			});
			return arr.join("、");
		},
		filterList({ songs, privileges }) {
			const list = [];
			songs.forEach((item, index) => {
				const types = [];
				const _types = {};
				let size;
				let privilege = privileges[index];
				if (privilege.id !== item.id) privilege = privileges.find((p) => p.id === item.id);
				if (!privilege) return;
				if (privilege.maxBrLevel == "hires") {
					size = item.hr ? sizeFormate(item.hr.size) : null;
					types.push({
						type: "flac24bit",
						size
					});
					_types.flac24bit = { size };
				}
				switch (privilege.maxbr) {
					case 999e3:
						size = item.sq ? sizeFormate(item.sq.size) : null;
						types.push({
							type: "flac",
							size
						});
						_types.flac = { size };
					case 32e4:
						size = item.h ? sizeFormate(item.h.size) : null;
						types.push({
							type: "320k",
							size
						});
						_types["320k"] = { size };
					case 192e3:
					case 128e3:
						size = item.l ? sizeFormate(item.l.size) : null;
						types.push({
							type: "128k",
							size
						});
						_types["128k"] = { size };
				}
				types.reverse();
				if (item.pc) list.push({
					singer: item.pc.ar ?? "",
					name: item.pc.sn ?? "",
					albumName: item.pc.alb ?? "",
					albumId: item.al?.id,
					source: "wy",
					interval: formatPlayTime(item.dt / 1e3),
					songmid: item.id,
					img: item.al?.picUrl ?? "",
					lrc: null,
					otherSource: null,
					types,
					_types,
					typeUrl: {}
				});
				else list.push({
					singer: this.getSinger(item.ar),
					name: item.name ?? "",
					albumName: item.al?.name,
					albumId: item.al?.id,
					source: "wy",
					interval: formatPlayTime(item.dt / 1e3),
					songmid: item.id,
					img: item.al?.picUrl,
					lrc: null,
					otherSource: null,
					types,
					_types,
					typeUrl: {}
				});
			});
			return list;
		},
		async getList(ids = [], retryNum = 0) {
			if (retryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
			const { body, statusCode } = await httpFetch$1("https://music.163.com/weapi/v3/song/detail", {
				method: "post",
				headers: {
					"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36",
					origin: "https://music.163.com"
				},
				form: weapi({
					c: "[" + ids.map((id) => "{\"id\":" + id + "}").join(",") + "]",
					ids: "[" + ids.join(",") + "]"
				})
			}).promise;
			if (statusCode != 200 || body.code !== 200) throw new Error("获取歌曲详情失败");
			return {
				source: "wy",
				list: this.filterList(body)
			};
		}
	};
	//#endregion
	//#region backend/musicSdk/wy/leaderboard.js
	var topList = [
		{
			id: "wy__19723756",
			name: "飙升榜",
			bangid: "19723756"
		},
		{
			id: "wy__3779629",
			name: "新歌榜",
			bangid: "3779629"
		},
		{
			id: "wy__2884035",
			name: "原创榜",
			bangid: "2884035"
		},
		{
			id: "wy__3778678",
			name: "热歌榜",
			bangid: "3778678"
		},
		{
			id: "wy__991319590",
			name: "说唱榜",
			bangid: "991319590"
		},
		{
			id: "wy__71384707",
			name: "古典榜",
			bangid: "71384707"
		},
		{
			id: "wy__1978921795",
			name: "电音榜",
			bangid: "1978921795"
		},
		{
			id: "wy__5453912201",
			name: "黑胶VIP爱听榜",
			bangid: "5453912201"
		},
		{
			id: "wy__71385702",
			name: "ACG榜",
			bangid: "71385702"
		},
		{
			id: "wy__745956260",
			name: "韩语榜",
			bangid: "745956260"
		},
		{
			id: "wy__10520166",
			name: "国电榜",
			bangid: "10520166"
		},
		{
			id: "wy__180106",
			name: "UK排行榜周榜",
			bangid: "180106"
		},
		{
			id: "wy__60198",
			name: "美国Billboard榜",
			bangid: "60198"
		},
		{
			id: "wy__3812895",
			name: "Beatport全球电子舞曲榜",
			bangid: "3812895"
		},
		{
			id: "wy__21845217",
			name: "KTV唛榜",
			bangid: "21845217"
		},
		{
			id: "wy__60131",
			name: "日本Oricon榜",
			bangid: "60131"
		},
		{
			id: "wy__2809513713",
			name: "欧美热歌榜",
			bangid: "2809513713"
		},
		{
			id: "wy__2809577409",
			name: "欧美新歌榜",
			bangid: "2809577409"
		},
		{
			id: "wy__27135204",
			name: "法国 NRJ Vos Hits 周榜",
			bangid: "27135204"
		},
		{
			id: "wy__3001835560",
			name: "ACG动画榜",
			bangid: "3001835560"
		},
		{
			id: "wy__3001795926",
			name: "ACG游戏榜",
			bangid: "3001795926"
		},
		{
			id: "wy__3001890046",
			name: "ACG VOCALOID榜",
			bangid: "3001890046"
		},
		{
			id: "wy__3112516681",
			name: "中国新乡村音乐排行榜",
			bangid: "3112516681"
		},
		{
			id: "wy__5059644681",
			name: "日语榜",
			bangid: "5059644681"
		},
		{
			id: "wy__5059633707",
			name: "摇滚榜",
			bangid: "5059633707"
		},
		{
			id: "wy__5059642708",
			name: "国风榜",
			bangid: "5059642708"
		},
		{
			id: "wy__5338990334",
			name: "潜力爆款榜",
			bangid: "5338990334"
		},
		{
			id: "wy__5059661515",
			name: "民谣榜",
			bangid: "5059661515"
		},
		{
			id: "wy__6688069460",
			name: "听歌识曲榜",
			bangid: "6688069460"
		},
		{
			id: "wy__6723173524",
			name: "网络热歌榜",
			bangid: "6723173524"
		},
		{
			id: "wy__6732051320",
			name: "俄语榜",
			bangid: "6732051320"
		},
		{
			id: "wy__6732014811",
			name: "越南语榜",
			bangid: "6732014811"
		},
		{
			id: "wy__6886768100",
			name: "中文DJ榜",
			bangid: "6886768100"
		},
		{
			id: "wy__6939992364",
			name: "俄罗斯top hit流行音乐榜",
			bangid: "6939992364"
		},
		{
			id: "wy__7095271308",
			name: "泰语榜",
			bangid: "7095271308"
		},
		{
			id: "wy__7356827205",
			name: "BEAT排行榜",
			bangid: "7356827205"
		},
		{
			id: "wy__7325478166",
			name: "编辑推荐榜VOL.44 天才女子摇滚乐队boygenius剖白卑微心迹",
			bangid: "7325478166"
		},
		{
			id: "wy__7603212484",
			name: "LOOK直播歌曲榜",
			bangid: "7603212484"
		},
		{
			id: "wy__7775163417",
			name: "赏音榜",
			bangid: "7775163417"
		},
		{
			id: "wy__7785123708",
			name: "黑胶VIP新歌榜",
			bangid: "7785123708"
		},
		{
			id: "wy__7785066739",
			name: "黑胶VIP热歌榜",
			bangid: "7785066739"
		},
		{
			id: "wy__7785091694",
			name: "黑胶VIP爱搜榜",
			bangid: "7785091694"
		}
	];
	var leaderboard_default$2 = {
		limit: 1e5,
		list: [
			{
				id: "wybsb",
				name: "飙升榜",
				bangid: "19723756"
			},
			{
				id: "wyrgb",
				name: "热歌榜",
				bangid: "3778678"
			},
			{
				id: "wyxgb",
				name: "新歌榜",
				bangid: "3779629"
			},
			{
				id: "wyycb",
				name: "原创榜",
				bangid: "2884035"
			},
			{
				id: "wygdb",
				name: "古典榜",
				bangid: "71384707"
			},
			{
				id: "wydouyb",
				name: "抖音榜",
				bangid: "2250011882"
			},
			{
				id: "wyhyb",
				name: "韩语榜",
				bangid: "745956260"
			},
			{
				id: "wydianyb",
				name: "电音榜",
				bangid: "1978921795"
			},
			{
				id: "wydjb",
				name: "电竞榜",
				bangid: "2006508653"
			},
			{
				id: "wyktvbb",
				name: "KTV唛榜",
				bangid: "21845217"
			}
		],
		getUrl(id) {
			return `https://music.163.com/discover/toplist?id=${id}`;
		},
		regExps: { list: /<textarea id="song-list-pre-data" style="display:none;">(.+?)<\/textarea>/ },
		_requestBoardsObj: null,
		getBoardsData() {
			if (this._requestBoardsObj) this._requestBoardsObj.cancelHttp();
			this._requestBoardsObj = httpFetch$1("https://music.163.com/weapi/toplist", {
				method: "post",
				form: weapi({})
			});
			return this._requestBoardsObj.promise;
		},
		getData(id) {
			return httpFetch$1("https://music.163.com/weapi/v3/playlist/detail", {
				method: "post",
				form: weapi({
					id,
					n: 1e5,
					p: 1
				})
			}).promise;
		},
		filterBoardsData(rawList) {
			let list = [];
			for (const board of rawList) list.push({
				id: "wy__" + board.id,
				name: board.name,
				bangid: String(board.id)
			});
			return list;
		},
		async getBoards(retryNum = 0) {
			this.list = topList;
			return {
				list: topList,
				source: "wy"
			};
		},
		async getList(bangid, page, retryNum = 0) {
			if (++retryNum > 6) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
			let resp;
			try {
				resp = await this.getData(bangid);
			} catch (err) {
				if (err.message == "try max num") throw err;
				else return this.getList(bangid, page, retryNum);
			}
			if (resp.statusCode !== 200 || resp.body.code !== 200) return this.getList(bangid, page, retryNum);
			let musicDetail;
			try {
				musicDetail = await musicDetail_default.getList(resp.body.playlist.trackIds.map((trackId) => trackId.id));
			} catch (err) {
				console.log(err);
				if (err.message == "try max num") throw err;
				else return this.getList(bangid, page, retryNum);
			}
			return {
				total: musicDetail.list.length,
				list: musicDetail.list,
				limit: this.limit,
				page,
				source: "wy"
			};
		},
		getDetailPageUrl(id) {
			if (typeof id == "string") id = id.replace("wy__", "");
			return `https://music.163.com/#/discover/toplist?id=${id}`;
		}
	};
	//#endregion
	//#region backend/musicSdk/wy/lyric.js
	var eapiRequest$1 = (url, data) => {
		return httpFetch$1("https://interface3.music.163.com/eapi/song/lyric/v1", {
			method: "post",
			headers: {
				"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36",
				origin: "https://music.163.com"
			},
			form: eapi(url, data)
		});
	};
	var parseTools = {
		rxps: {
			info: /^{"/,
			lineTime: /^\[(\d+),\d+\]/,
			wordTime: /\(\d+,\d+,\d+\)/,
			wordTimeAll: /(\(\d+,\d+,\d+\))/g
		},
		msFormat(timeMs) {
			if (Number.isNaN(timeMs)) return "";
			let ms = timeMs % 1e3;
			timeMs /= 1e3;
			let m = parseInt(timeMs / 60).toString().padStart(2, "0");
			timeMs %= 60;
			return `[${m}:${parseInt(timeMs).toString().padStart(2, "0")}.${ms}]`;
		},
		parseLyric(lines) {
			const lxlrcLines = [];
			const lrcLines = [];
			for (let line of lines) {
				line = line.trim();
				let result = this.rxps.lineTime.exec(line);
				if (!result) {
					if (line.startsWith("[offset")) {
						lxlrcLines.push(line);
						lrcLines.push(line);
					}
					continue;
				}
				const startMsTime = parseInt(result[1]);
				const startTimeStr = this.msFormat(startMsTime);
				if (!startTimeStr) continue;
				let words = line.replace(this.rxps.lineTime, "");
				lrcLines.push(`${startTimeStr}${words.replace(this.rxps.wordTimeAll, "")}`);
				let times = words.match(this.rxps.wordTimeAll);
				if (!times) continue;
				times = times.map((time) => {
					const result = /\((\d+),(\d+),\d+\)/.exec(time);
					return `<${Math.max(parseInt(result[1]) - startMsTime, 0)},${result[2]}>`;
				});
				const wordArr = words.split(this.rxps.wordTime);
				wordArr.shift();
				const newWords = times.map((time, index) => `${time}${wordArr[index]}`).join("");
				lxlrcLines.push(`${startTimeStr}${newWords}`);
			}
			return {
				lyric: lrcLines.join("\n"),
				lxlyric: lxlrcLines.join("\n")
			};
		},
		parseHeaderInfo(str) {
			str = str.trim();
			str = str.replace(/\r/g, "");
			if (!str) return null;
			return str.split("\n").map((line) => {
				if (!this.rxps.info.test(line)) return line;
				try {
					const info = JSON.parse(line);
					const timeTag = this.msFormat(info.t);
					return timeTag ? `${timeTag}${info.c.map((t) => t.tx).join("")}` : "";
				} catch {
					return "";
				}
			});
		},
		getIntv(interval) {
			if (!interval) return 0;
			if (!interval.includes(".")) interval += ".0";
			let arr = interval.split(/:|\./);
			while (arr.length < 3) arr.unshift("0");
			const [m, s, ms] = arr;
			return parseInt(m) * 36e5 + parseInt(s) * 1e3 + parseInt(ms);
		},
		fixTimeTag(lrc, targetlrc) {
			let lrcLines = lrc.split("\n");
			const targetlrcLines = targetlrc.split("\n");
			const timeRxp = /^\[([\d:.]+)\]/;
			let temp = [];
			let newLrc = [];
			targetlrcLines.forEach((line) => {
				const result = timeRxp.exec(line);
				if (!result) return;
				if (!line.replace(timeRxp, "").trim()) return;
				const t1 = this.getIntv(result[1]);
				while (lrcLines.length) {
					const lrcLine = lrcLines.shift();
					const lrcLineResult = timeRxp.exec(lrcLine);
					if (!lrcLineResult) continue;
					const t2 = this.getIntv(lrcLineResult[1]);
					if (Math.abs(t1 - t2) < 100) {
						const lrc = line.replace(timeRxp, lrcLineResult[0]).trim();
						if (!lrc) continue;
						newLrc.push(lrc);
						break;
					}
					temp.push(lrcLine);
				}
				lrcLines = [...temp, ...lrcLines];
				temp = [];
			});
			return newLrc.join("\n");
		},
		parse(ylrc, ytlrc, yrlrc, lrc, tlrc, rlrc) {
			const info = {
				lyric: "",
				tlyric: "",
				rlyric: "",
				lxlyric: ""
			};
			if (ylrc) {
				let lines = this.parseHeaderInfo(ylrc);
				if (lines) {
					const result = this.parseLyric(lines);
					if (ytlrc) {
						const lines = this.parseHeaderInfo(ytlrc);
						if (lines) info.tlyric = this.fixTimeTag(result.lyric, lines.join("\n"));
					}
					if (yrlrc) {
						const lines = this.parseHeaderInfo(yrlrc);
						if (lines) info.rlyric = this.fixTimeTag(result.lyric, lines.join("\n"));
					}
					const timeRxp = /^\[[\d:.]+\]/;
					info.lyric = `${lines.filter((l) => timeRxp.test(l)).join("\n")}\n${result.lyric}`;
					info.lxlyric = result.lxlyric;
					return info;
				}
			}
			if (lrc) {
				const lines = this.parseHeaderInfo(lrc);
				if (lines) info.lyric = lines.join("\n");
			}
			if (tlrc) {
				const lines = this.parseHeaderInfo(tlrc);
				if (lines) info.tlyric = lines.join("\n");
			}
			if (rlrc) {
				const lines = this.parseHeaderInfo(rlrc);
				if (lines) info.rlyric = lines.join("\n");
			}
			return info;
		}
	};
	var fixTimeLabel = (lrc, tlrc, romalrc) => {
		if (lrc) {
			let newLrc = lrc.replace(/\[(\d{2}:\d{2}):(\d{2})]/g, "[$1.$2]");
			let newTlrc = tlrc?.replace(/\[(\d{2}:\d{2}):(\d{2})]/g, "[$1.$2]") ?? tlrc;
			if (newLrc != lrc || newTlrc != tlrc) {
				lrc = newLrc;
				tlrc = newTlrc;
				if (romalrc) romalrc = romalrc.replace(/\[(\d{2}:\d{2}):(\d{2,3})]/g, "[$1.$2]").replace(/\[(\d{2}:\d{2}\.\d{2})0]/g, "[$1]");
			}
		}
		return {
			lrc,
			tlrc,
			romalrc
		};
	};
	var lyric_default$1 = (songmid) => {
		const requestObj = eapiRequest$1("/api/song/lyric/v1", {
			id: songmid,
			cp: false,
			tv: 0,
			lv: 0,
			rv: 0,
			kv: 0,
			yv: 0,
			ytv: 0,
			yrv: 0
		});
		requestObj.promise = requestObj.promise.then(({ body }) => {
			if (body.code !== 200 || !body?.lrc?.lyric) return Promise.reject(/* @__PURE__ */ new Error("Get lyric failed"));
			const fixTimeLabelLrc = fixTimeLabel(body.lrc.lyric, body.tlyric?.lyric, body.romalrc?.lyric);
			const info = parseTools.parse(body.yrc?.lyric, body.ytlrc?.lyric, body.yromalrc?.lyric, fixTimeLabelLrc.lrc, fixTimeLabelLrc.tlrc, fixTimeLabelLrc.romalrc);
			if (!info.lyric) return Promise.reject(/* @__PURE__ */ new Error("Get lyric failed"));
			return info;
		});
		return requestObj;
	};
	//#endregion
	//#region backend/musicSdk/wy/musicInfo.js
	var musicInfo_default$1 = (songmid) => {
		const requestObj = httpFetch$1("https://music.163.com/weapi/v3/song/detail", {
			method: "post",
			headers: {
				"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36",
				Referer: "https://music.163.com/song?id=" + songmid,
				origin: "https://music.163.com"
			},
			form: weapi({
				c: `[{"id":${songmid}}]`,
				ids: `[${songmid}]`
			})
		});
		requestObj.promise = requestObj.promise.then(({ body }) => {
			if (body.code !== 200 || !body.songs.length) return Promise.reject(/* @__PURE__ */ new Error("获取歌曲信息失败"));
			return body.songs[0];
		});
		return requestObj;
	};
	//#endregion
	//#region backend/musicSdk/wy/utils/index.js
	var eapiRequest = (url, data) => {
		return httpFetch$1("http://interface.music.163.com/eapi/batch", {
			method: "post",
			headers: {
				"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36",
				origin: "https://music.163.com"
			},
			form: eapi(url, data)
		});
	};
	//#endregion
	//#region backend/musicSdk/wy/musicSearch.js
	var musicSearch_default$2 = {
		limit: 30,
		total: 0,
		page: 0,
		allPage: 1,
		musicSearch(str, page, limit) {
			return eapiRequest("/api/search/song/list/page", {
				keyword: str,
				needCorrect: "1",
				channel: "typing",
				offset: limit * (page - 1),
				scene: "normal",
				total: page == 1,
				limit
			}).promise.then(({ body }) => body);
		},
		getSinger(singers) {
			let arr = [];
			singers.forEach((singer) => {
				arr.push(singer.name);
			});
			return arr.join("、");
		},
		handleResult(rawList) {
			if (!rawList) return [];
			return rawList.map((item) => {
				item = item.baseInfo.simpleSongData;
				const types = [];
				const _types = {};
				let size;
				if (item.privilege.maxBrLevel == "hires") {
					size = item.hr ? sizeFormate(item.hr.size) : null;
					types.push({
						type: "flac24bit",
						size
					});
					_types.flac24bit = { size };
				}
				switch (item.privilege.maxbr) {
					case 999e3:
						size = item.sq ? sizeFormate(item.sq.size) : null;
						types.push({
							type: "flac",
							size
						});
						_types.flac = { size };
					case 32e4:
						size = item.h ? sizeFormate(item.h.size) : null;
						types.push({
							type: "320k",
							size
						});
						_types["320k"] = { size };
					case 192e3:
					case 128e3:
						size = item.l ? sizeFormate(item.l.size) : null;
						types.push({
							type: "128k",
							size
						});
						_types["128k"] = { size };
				}
				types.reverse();
				return {
					singer: this.getSinger(item.ar),
					name: item.name,
					albumName: item.al.name,
					albumId: item.al.id,
					source: "wy",
					interval: formatPlayTime(item.dt / 1e3),
					songmid: item.id,
					img: item.al.picUrl,
					lrc: null,
					types,
					_types,
					typeUrl: {}
				};
			});
		},
		search(str, page = 1, limit, retryNum = 0) {
			if (++retryNum > 3) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
			if (limit == null) limit = this.limit;
			return this.musicSearch(str, page, limit).then((result) => {
				if (!result || result.code !== 200) return this.search(str, page, limit, retryNum);
				let list = this.handleResult(result.data.resources || []);
				if (list == null) return this.search(str, page, limit, retryNum);
				this.total = result.data.totalCount || 0;
				this.page = page;
				this.allPage = Math.ceil(this.total / this.limit);
				return {
					list,
					allPage: this.allPage,
					limit: this.limit,
					total: this.total,
					source: "wy"
				};
			});
		}
	};
	//#endregion
	//#region backend/musicSdk/wy/songList.js
	var songList_default$2 = {
		_requestObj_tags: null,
		_requestObj_hotTags: null,
		_requestObj_list: null,
		limit_list: 30,
		limit_song: 1e5,
		successCode: 200,
		cookie: "MUSIC_U=",
		sortList: [{
			name: "最热",
			id: "hot"
		}],
		regExps: {
			listDetailLink: /^.+(?:\?|&)id=(\d+)(?:&.*$|#.*$|$)/,
			listDetailLink2: /^.+\/playlist\/(\d+)\/\d+\/.+$/
		},
		async handleParseId(link, retryNum = 0) {
			if (retryNum > 2) throw new Error("link try max num");
			const { headers: { location }, statusCode } = await httpFetch$1(link).promise;
			if (statusCode > 400) return this.handleParseId(link, ++retryNum);
			const url = location == null ? link : location;
			return this.regExps.listDetailLink.test(url) ? url.replace(this.regExps.listDetailLink, "$1") : url.replace(this.regExps.listDetailLink2, "$1");
		},
		async getListId(id) {
			let cookie;
			if (/###/.test(id)) {
				const [url, token] = id.split("###");
				id = url;
				cookie = `MUSIC_U=${token}`;
			}
			if (/[?&:/]/.test(id)) {
				if (this.regExps.listDetailLink.test(id)) id = id.replace(this.regExps.listDetailLink, "$1");
				else if (this.regExps.listDetailLink2.test(id)) id = id.replace(this.regExps.listDetailLink2, "$1");
				else id = await this.handleParseId(id);
			}
			return {
				id,
				cookie
			};
		},
		async getListDetail(rawId, page, tryNum = 0) {
			if (tryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
			const { id, cookie } = await this.getListId(rawId);
			if (cookie) this.cookie = cookie;
			const { statusCode, body } = await httpFetch$1("https://music.163.com/api/linux/forward", {
				method: "post",
				headers: {
					"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36",
					Cookie: this.cookie
				},
				form: linuxapi({
					method: "POST",
					url: "https://music.163.com/api/v3/playlist/detail",
					params: {
						id,
						n: this.limit_song,
						s: 8
					}
				})
			}).promise;
			if (statusCode !== 200 || body.code !== this.successCode) return this.getListDetail(id, page, ++tryNum);
			let limit = 1e3;
			let rangeStart = (page - 1) * limit;
			let list;
			if (body.playlist.trackIds.length == body.privileges.length) list = this.filterListDetail(body);
			else try {
				list = (await musicDetail_default.getList(body.playlist.trackIds.slice(rangeStart, limit * page).map((trackId) => trackId.id))).list;
			} catch (err) {
				console.log(err);
				if (err.message == "try max num") throw err;
				else return this.getListDetail(id, page, ++tryNum);
			}
			return {
				list,
				page,
				limit,
				total: body.playlist.trackIds.length,
				source: "wy",
				info: {
					play_count: formatPlayCount(body.playlist.playCount),
					name: body.playlist.name,
					img: body.playlist.coverImgUrl,
					desc: body.playlist.description,
					author: body.playlist.creator.nickname
				}
			};
		},
		filterListDetail({ playlist: { tracks }, privileges }) {
			const list = [];
			tracks.forEach((item, index) => {
				const types = [];
				const _types = {};
				let size;
				let privilege = privileges[index];
				if (privilege.id !== item.id) privilege = privileges.find((p) => p.id === item.id);
				if (!privilege) return;
				if (privilege.maxBrLevel == "hires") {
					size = item.hr ? sizeFormate(item.hr.size) : null;
					types.push({
						type: "flac24bit",
						size
					});
					_types.flac24bit = { size };
				}
				switch (privilege.maxbr) {
					case 999e3:
						size = null;
						types.push({
							type: "flac",
							size
						});
						_types.flac = { size };
					case 32e4:
						size = item.h ? sizeFormate(item.h.size) : null;
						types.push({
							type: "320k",
							size
						});
						_types["320k"] = { size };
					case 192e3:
					case 128e3:
						size = item.l ? sizeFormate(item.l.size) : null;
						types.push({
							type: "128k",
							size
						});
						_types["128k"] = { size };
				}
				types.reverse();
				if (item.pc) list.push({
					singer: item.pc.ar ?? "",
					name: item.pc.sn ?? "",
					albumName: item.pc.alb ?? "",
					albumId: item.al?.id,
					source: "wy",
					interval: formatPlayTime(item.dt / 1e3),
					songmid: item.id,
					img: item.al?.picUrl ?? "",
					lrc: null,
					otherSource: null,
					types,
					_types,
					typeUrl: {}
				});
				else list.push({
					singer: formatSingerName(item.ar, "name"),
					name: item.name ?? "",
					albumName: item.al?.name,
					albumId: item.al?.id,
					source: "wy",
					interval: formatPlayTime(item.dt / 1e3),
					songmid: item.id,
					img: item.al?.picUrl,
					lrc: null,
					otherSource: null,
					types,
					_types,
					typeUrl: {}
				});
			});
			return list;
		},
		getList(sortId, tagId, page, tryNum = 0) {
			if (tryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
			if (this._requestObj_list) this._requestObj_list.cancelHttp();
			this._requestObj_list = httpFetch$1("https://music.163.com/weapi/playlist/list", {
				method: "post",
				form: weapi({
					cat: tagId || "全部",
					order: sortId,
					limit: this.limit_list,
					offset: this.limit_list * (page - 1),
					total: true
				})
			});
			return this._requestObj_list.promise.then(({ body }) => {
				if (body.code !== this.successCode) return this.getList(sortId, tagId, page, ++tryNum);
				return {
					list: this.filterList(body.playlists),
					total: parseInt(body.total),
					page,
					limit: this.limit_list,
					source: "wy"
				};
			});
		},
		filterList(rawData) {
			return rawData.map((item) => ({
				play_count: formatPlayCount(item.playCount),
				id: String(item.id),
				author: item.creator.nickname,
				name: item.name,
				time: item.createTime ? dateFormat(item.createTime, "Y-M-D") : "",
				img: item.coverImgUrl,
				grade: item.grade,
				total: item.trackCount,
				desc: item.description,
				source: "wy"
			}));
		},
		getTag(tryNum = 0) {
			if (this._requestObj_tags) this._requestObj_tags.cancelHttp();
			if (tryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
			this._requestObj_tags = httpFetch$1("https://music.163.com/weapi/playlist/catalogue", {
				method: "post",
				form: weapi({})
			});
			return this._requestObj_tags.promise.then(({ body }) => {
				if (body.code !== this.successCode) return this.getTag(++tryNum);
				return this.filterTagInfo(body);
			});
		},
		filterTagInfo({ sub, categories }) {
			const subList = {};
			for (const item of sub) {
				if (!subList[item.category]) subList[item.category] = [];
				subList[item.category].push({
					parent_id: categories[item.category],
					parent_name: categories[item.category],
					id: item.name,
					name: item.name,
					source: "wy"
				});
			}
			const list = [];
			for (const key of Object.keys(categories)) list.push({
				name: categories[key],
				list: subList[key],
				source: "wy"
			});
			return list;
		},
		getHotTag(tryNum = 0) {
			if (this._requestObj_hotTags) this._requestObj_hotTags.cancelHttp();
			if (tryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
			this._requestObj_hotTags = httpFetch$1("https://music.163.com/weapi/playlist/hottags", {
				method: "post",
				form: weapi({})
			});
			return this._requestObj_hotTags.promise.then(({ body }) => {
				if (body.code !== this.successCode) return this.getTag(++tryNum);
				return this.filterHotTagInfo(body.tags);
			});
		},
		filterHotTagInfo(rawList) {
			return rawList.map((item) => ({
				id: item.playlistTag.name,
				name: item.playlistTag.name,
				source: "wy"
			}));
		},
		getTags() {
			return Promise.all([this.getTag(), this.getHotTag()]).then(([tags, hotTag]) => ({
				tags,
				hotTag,
				source: "wy"
			}));
		},
		async getDetailPageUrl(rawId) {
			const { id } = await this.getListId(rawId);
			return `https://music.163.com/#/playlist?id=${id}`;
		},
		search(text, page, limit = 20) {
			return eapiRequest("/api/cloudsearch/pc", {
				s: text,
				type: 1e3,
				limit,
				total: page == 1,
				offset: limit * (page - 1)
			}).promise.then(({ body }) => {
				if (body.code != this.successCode) throw new Error("filed");
				return {
					list: this.filterList(body.result.playlists),
					limit,
					total: body.result.playlistCount,
					source: "wy"
				};
			});
		}
	};
	//#endregion
	//#region backend/musicSdk/wy/hotSearch.js
	var hotSearch_default$2 = {
		_requestObj: null,
		async getList(retryNum = 0) {
			if (this._requestObj) this._requestObj.cancelHttp();
			if (retryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
			const { body, statusCode } = await eapiRequest("/api/search/chart/detail", { id: "HOT_SEARCH_SONG#@#" }).promise;
			if (statusCode != 200 || body.code !== 200) throw new Error("获取热搜词失败");
			return {
				source: "wy",
				list: this.filterList(body.data.itemList)
			};
		},
		filterList(rawList) {
			return rawList.map((item) => item.searchWord);
		}
	};
	//#endregion
	//#region backend/musicSdk/wy/comment.js
	var emojis = [
		["大笑", "😃"],
		["可爱", "😊"],
		["憨笑", "☺️"],
		["色", "😍"],
		["亲亲", "😙"],
		["惊恐", "😱"],
		["流泪", "😭"],
		["亲", "😚"],
		["呆", "😳"],
		["哀伤", "😔"],
		["呲牙", "😁"],
		["吐舌", "😝"],
		["撇嘴", "😒"],
		["怒", "😡"],
		["奸笑", "😏"],
		["汗", "😓"],
		["痛苦", "😖"],
		["惶恐", "😰"],
		["生病", "😨"],
		["口罩", "😷"],
		["大哭", "😂"],
		["晕", "😵"],
		["发怒", "👿"],
		["开心", "😄"],
		["鬼脸", "😜"],
		["皱眉", "😞"],
		["流感", "😢"],
		["爱心", "❤️"],
		["心碎", "💔"],
		["钟情", "💘"],
		["星星", "⭐️"],
		["生气", "💢"],
		["便便", "💩"],
		["强", "👍"],
		["弱", "👎"],
		["拜", "🙏"],
		["牵手", "👫"],
		["跳舞", "👯‍♀️"],
		["禁止", "🙅‍♀️"],
		["这边", "💁‍♀️"],
		["爱意", "💏"],
		["示爱", "👩‍❤️‍👨"],
		["嘴唇", "👄"],
		["狗", "🐶"],
		["猫", "🐱"],
		["猪", "🐷"],
		["兔子", "🐰"],
		["小鸡", "🐤"],
		["公鸡", "🐔"],
		["幽灵", "👻"],
		["圣诞", "🎅"],
		["外星", "👽"],
		["钻石", "💎"],
		["礼物", "🎁"],
		["男孩", "👦"],
		["女孩", "👧"],
		["蛋糕", "🎂"],
		["18", "🔞"],
		["圈", "⭕"],
		["叉", "❌"]
	];
	var applyEmoji = (text) => {
		for (const e of emojis) text = text.replaceAll(`[${e[0]}]`, e[1]);
		return text;
	};
	var cursorTools = {
		cache: {},
		getCursor(id, page, limit) {
			let cacheData = this.cache[id];
			if (!cacheData) cacheData = this.cache[id] = {};
			let orderType;
			let cursor;
			let offset;
			if (page == 1) {
				cacheData.page = 1;
				cursor = cacheData.cursor = cacheData.prevCursor = Date.now();
				orderType = 1;
				offset = 0;
			} else if (cacheData.page) {
				cursor = cacheData.cursor;
				if (page > cacheData.page) {
					orderType = 1;
					offset = (page - cacheData.page - 1) * limit;
				} else if (page < cacheData.page) {
					orderType = 0;
					offset = (cacheData.page - page - 1) * limit;
				} else {
					cursor = cacheData.cursor = cacheData.prevCursor;
					offset = cacheData.offset;
					orderType = cacheData.orderType;
				}
			}
			return {
				orderType,
				cursor,
				offset
			};
		},
		setCursor(id, cursor, orderType, offset, page) {
			let cacheData = this.cache[id];
			if (!cacheData) cacheData = this.cache[id] = {};
			cacheData.prevCursor = cacheData.cursor;
			cacheData.cursor = cursor;
			cacheData.orderType = orderType;
			cacheData.offset = offset;
			cacheData.page = page;
		}
	};
	//#endregion
	//#region backend/musicSdk/wy/index.js
	var wy = {
		leaderboard: leaderboard_default$2,
		musicSearch: musicSearch_default$2,
		songList: songList_default$2,
		hotSearch: hotSearch_default$2,
		comment: {
			_requestObj: null,
			_requestObj2: null,
			async getComment({ songmid }, page = 1, limit = 20) {
				if (this._requestObj) this._requestObj.cancelHttp();
				const id = "R_SO_4_" + songmid;
				const cursorInfo = cursorTools.getCursor(songmid, page, limit);
				const { body, statusCode } = await httpFetch$1("https://music.163.com/weapi/comment/resource/comments/get", {
					method: "post",
					headers: {
						"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36",
						origin: "https://music.163.com",
						Refere: "http://music.163.com/"
					},
					form: weapi({
						cursor: cursorInfo.cursor,
						offset: cursorInfo.offset,
						orderType: cursorInfo.orderType,
						pageNo: page,
						pageSize: limit,
						rid: id,
						threadId: id
					})
				}).promise;
				if (statusCode != 200 || body.code !== 200) throw new Error("获取评论失败");
				cursorTools.setCursor(songmid, body.data.cursor, cursorInfo.orderType, cursorInfo.offset, page);
				return {
					source: "wy",
					comments: this.filterComment(body.data.comments),
					total: body.data.totalCount,
					page,
					limit,
					maxPage: Math.ceil(body.data.totalCount / limit) || 1
				};
			},
			async getHotComment({ songmid }, page = 1, limit = 100) {
				if (this._requestObj2) this._requestObj2.cancelHttp();
				const id = "R_SO_4_" + songmid;
				page = page - 1;
				const { body, statusCode } = await httpFetch$1(`https://music.163.com/weapi/v1/resource/hotcomments/${id}`, {
					method: "post",
					headers: {
						"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36",
						origin: "https://music.163.com",
						Refere: "http://music.163.com/"
					},
					form: weapi({
						rid: id,
						limit,
						offset: limit * page,
						beforeTime: Date.now().toString()
					})
				}).promise;
				if (statusCode != 200 || body.code !== 200) throw new Error("获取热门评论失败");
				const total = body.total ?? 0;
				return {
					source: "wy",
					comments: this.filterComment(body.hotComments),
					total,
					page,
					limit,
					maxPage: Math.ceil(total / limit) || 1
				};
			},
			filterComment(rawList) {
				return rawList.map((item) => {
					let data = {
						id: item.commentId,
						text: item.content ? applyEmoji(item.content) : "",
						time: item.time ? item.time : "",
						timeStr: item.time ? dateFormat2(item.time) : "",
						location: item.ipLocation?.location,
						userName: item.user.nickname,
						avatar: item.user.avatarUrl,
						userId: item.user.userId,
						likedCount: item.likedCount,
						reply: []
					};
					let replyData = item.beReplied && item.beReplied[0];
					return replyData ? {
						id: item.commentId,
						rootId: replyData.beRepliedCommentId,
						text: replyData.content ? applyEmoji(replyData.content) : "",
						time: item.time,
						timeStr: null,
						location: replyData.ipLocation?.location,
						userName: replyData.user.nickname,
						avatar: replyData.user.avatarUrl,
						userId: replyData.user.userId,
						likedCount: null,
						reply: [data]
					} : data;
				});
			}
		},
		getMusicUrl(songInfo, type) {
			return apis("wy").getMusicUrl(songInfo, type);
		},
		getLyric(songInfo) {
			return lyric_default$1(songInfo.songmid);
		},
		getPic(songInfo) {
			return musicInfo_default$1(songInfo.songmid).promise.then((info) => info.al.picUrl);
		},
		getMusicDetailPageUrl(songInfo) {
			return `https://music.163.com/#/song?id=${songInfo.songmid}`;
		}
	};
	//#endregion
	//#region backend/musicSdk/mg/utils/index.js
	/**
	* 创建一个适用于MG的Http请求
	* @param {*} url
	* @param {*} options
	* @param {*} retryNum
	*/
	var createHttpFetch = async (url, options, retryNum = 0) => {
		if (retryNum > 2) throw new Error("try max num");
		let result;
		try {
			result = await httpFetch$1(url, options).promise;
		} catch (err) {
			console.log(err);
			return createHttpFetch(url, options, ++retryNum);
		}
		if (result.statusCode !== 200 || (result.body.code !== void 0 ? result.body.code : result.body.returnCode !== void 0 ? result.body.returnCode : result.body.code) !== "000000") return createHttpFetch(url, options, ++retryNum);
		if (result.body.data) return result.body.data;
		return result.body;
	};
	//#endregion
	//#region backend/musicSdk/mg/musicInfo.js
	var createGetMusicInfosTask = (ids) => {
		let list = ids;
		let tasks = [];
		while (list.length) {
			tasks.push(list.slice(0, 100));
			if (list.length < 100) break;
			list = list.slice(100);
		}
		let url = "https://c.musicapp.migu.cn/MIGUM2.0/v1.0/content/resourceinfo.do?resourceType=2";
		return Promise.all(tasks.map((task) => createHttpFetch(url, {
			method: "POST",
			form: { resourceId: task.join("|") }
		}).then((data) => data.resource)));
	};
	var filterMusicInfoList = (rawList) => {
		let ids = /* @__PURE__ */ new Set();
		const list = [];
		rawList.forEach((item) => {
			if (!item.songId || ids.has(item.songId)) return;
			ids.add(item.songId);
			const types = [];
			const _types = {};
			item.newRateFormats?.forEach((type) => {
				let size;
				switch (type.formatType) {
					case "PQ":
						size = sizeFormate(type.size ?? type.androidSize);
						types.push({
							type: "128k",
							size
						});
						_types["128k"] = { size };
						break;
					case "HQ":
						size = sizeFormate(type.size ?? type.androidSize);
						types.push({
							type: "320k",
							size
						});
						_types["320k"] = { size };
						break;
					case "SQ":
						size = sizeFormate(type.size ?? type.androidSize);
						types.push({
							type: "flac",
							size
						});
						_types.flac = { size };
						break;
					case "ZQ":
						size = sizeFormate(type.size ?? type.androidSize);
						types.push({
							type: "flac24bit",
							size
						});
						_types.flac24bit = { size };
				}
			});
			const intervalTest = /(\d\d:\d\d)$/.test(item.length);
			list.push({
				singer: formatSingerName(item.artists, "name"),
				name: item.songName,
				albumName: item.album,
				albumId: item.albumId,
				songmid: item.songId,
				copyrightId: item.copyrightId,
				source: "mg",
				interval: intervalTest ? RegExp.$1 : null,
				img: item.albumImgs?.length ? item.albumImgs[0].img : null,
				lrc: null,
				lrcUrl: item.lrcUrl,
				mrcUrl: item.mrcUrl,
				trcUrl: item.trcUrl,
				otherSource: null,
				types,
				_types,
				typeUrl: {}
			});
		});
		return list;
	};
	var filterMusicInfoListV5 = (rawList) => {
		let ids = /* @__PURE__ */ new Set();
		const list = [];
		rawList.forEach((item) => {
			if (!item.songId || ids.has(item.songId)) return;
			ids.add(item.songId);
			const types = [];
			const _types = {};
			item.audioFormats?.forEach((type) => {
				let size;
				switch (type.formatType) {
					case "PQ":
						size = sizeFormate(type.size ?? type.androidSize);
						types.push({
							type: "128k",
							size
						});
						_types["128k"] = { size };
						break;
					case "HQ":
						size = sizeFormate(type.size ?? type.androidSize);
						types.push({
							type: "320k",
							size
						});
						_types["320k"] = { size };
						break;
					case "SQ":
						size = sizeFormate(type.size ?? type.androidSize);
						types.push({
							type: "flac",
							size
						});
						_types.flac = { size };
						break;
					case "ZQ":
						size = sizeFormate(type.size ?? type.androidSize);
						types.push({
							type: "flac24bit",
							size
						});
						_types.flac24bit = { size };
				}
			});
			list.push({
				singer: formatSingerName(item.singerList, "name"),
				name: item.songName,
				albumName: item.album,
				albumId: item.albumId,
				songmid: item.songId,
				copyrightId: item.copyrightId,
				source: "mg",
				interval: formatPlayTime(item.duration),
				img: item.img3 || item.img2 || item.img1 || null,
				lrc: null,
				lrcUrl: item.lrcUrl,
				mrcUrl: item.mrcUrl,
				trcUrl: item.trcUrl,
				otherSource: null,
				types,
				_types,
				typeUrl: {}
			});
		});
		return list;
	};
	var getMusicInfo = async (copyrightId) => {
		return getMusicInfos([copyrightId]).then((data) => data[0]);
	};
	var getMusicInfos = async (copyrightIds) => {
		return filterMusicInfoList(await Promise.all(createGetMusicInfosTask(copyrightIds)).then((data) => data.flat()));
	};
	//#endregion
	//#region backend/musicSdk/mg/leaderboard.js
	var boardList$1 = [
		{
			id: "mg__27553319",
			name: "新歌榜",
			bangid: "27553319",
			source: "mg"
		},
		{
			id: "mg__27186466",
			name: "热歌榜",
			bangid: "27186466",
			source: "mg"
		},
		{
			id: "mg__27553408",
			name: "原创榜",
			bangid: "27553408",
			source: "mg"
		},
		{
			id: "mg__75959118",
			name: "音乐风向榜",
			bangid: "75959118",
			source: "mg"
		},
		{
			id: "mg__76557036",
			name: "彩铃分贝榜",
			bangid: "76557036",
			source: "mg"
		},
		{
			id: "mg__76557745",
			name: "会员臻爱榜",
			bangid: "76557745",
			source: "mg"
		},
		{
			id: "mg__23189800",
			name: "港台榜",
			bangid: "23189800",
			source: "mg"
		},
		{
			id: "mg__23189399",
			name: "内地榜",
			bangid: "23189399",
			source: "mg"
		},
		{
			id: "mg__19190036",
			name: "欧美榜",
			bangid: "19190036",
			source: "mg"
		},
		{
			id: "mg__83176390",
			name: "国风金曲榜",
			bangid: "83176390",
			source: "mg"
		}
	];
	var leaderboard_default$1 = {
		limit: 200,
		list: [
			{
				id: "mgyyb",
				name: "音乐榜",
				bangid: "27553319"
			},
			{
				id: "mgysb",
				name: "影视榜",
				bangid: "23603721"
			},
			{
				id: "mghybnd",
				name: "华语内地榜",
				bangid: "23603926"
			},
			{
				id: "mghyjqbgt",
				name: "华语港台榜",
				bangid: "23603954"
			},
			{
				id: "mgomb",
				name: "欧美榜",
				bangid: "23603974"
			},
			{
				id: "mgrhb",
				name: "日韩榜",
				bangid: "23603982"
			},
			{
				id: "mgwlb",
				name: "网络榜",
				bangid: "23604058"
			},
			{
				id: "mgclb",
				name: "彩铃榜",
				bangid: "23604023"
			},
			{
				id: "mgktvb",
				name: "KTV榜",
				bangid: "23604040"
			},
			{
				id: "mgrcb",
				name: "原创榜",
				bangid: "23604032"
			}
		],
		getUrl(id, page) {
			return `https://app.c.nf.migu.cn/MIGUM2.0/v1.0/content/querycontentbyId.do?columnId=${id}&needAll=0`;
		},
		successCode: "000000",
		requestBoardsObj: null,
		getBoardsData() {
			if (this.requestBoardsObj) this._requestBoardsObj.cancelHttp();
			this.requestBoardsObj = httpFetch$1("https://app.c.nf.migu.cn/pc/bmw/rank/rank-index/v1.0", { headers: {
				Referer: "https://app.c.nf.migu.cn/",
				"User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36",
				channel: "0146921"
			} });
			return this.requestBoardsObj.promise;
		},
		getData(url) {
			return httpFetch$1(url).promise;
		},
		async getBoards(retryNum = 0) {
			this.list = boardList$1;
			return {
				list: boardList$1,
				source: "mg"
			};
		},
		getList(bangid, page, retryNum = 0) {
			if (++retryNum > 3) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
			return this.getData(this.getUrl(bangid, page)).then(({ statusCode, body }) => {
				if (statusCode !== 200 || body.code !== this.successCode) return this.getList(bangid, page, retryNum);
				const list = filterMusicInfoList(body.columnInfo.contents.map((m) => m.objectInfo));
				return {
					total: list.length,
					list,
					limit: this.limit,
					page,
					source: "mg"
				};
			});
		},
		getDetailPageUrl(id) {
			if (typeof id == "string") id = id.replace("mg__", "");
			for (const item of boardList$1) if (item.bangid == id) return `https://music.migu.cn/v3/music/top/${item.webId}`;
			return null;
		}
	};
	//#endregion
	//#region backend/musicSdk/mg/musicSearch.js
	var createSignature = (time, str) => {
		const deviceId = "963B7AA0D21511ED807EE5846EC87D20";
		return {
			sign: toMD5(`${str}6cdc72a439cef99a3418d2a78aa28c73yyapp2d16148780a1dcc7408e06336b98cfd50${deviceId}${time}`),
			deviceId
		};
	};
	var musicSearch_default$1 = {
		limit: 20,
		total: 0,
		page: 0,
		allPage: 1,
		musicSearch(str, page, limit) {
			const time = Date.now().toString();
			const signData = createSignature(time, str);
			return httpFetch$1(`https://jadeite.migu.cn/music_search/v3/search/searchAll?isCorrect=0&isCopyright=1&searchSwitch=%7B%22song%22%3A1%2C%22album%22%3A0%2C%22singer%22%3A0%2C%22tagSong%22%3A1%2C%22mvSong%22%3A0%2C%22bestShow%22%3A1%2C%22songlist%22%3A0%2C%22lyricSong%22%3A0%7D&pageSize=${limit}&text=${encodeURIComponent(str)}&pageNo=${page}&sort=0&sid=USS`, { headers: {
				uiVersion: "A_music_3.6.1",
				deviceId: signData.deviceId,
				timestamp: time,
				sign: signData.sign,
				channel: "0146921",
				"User-Agent": "Mozilla/5.0 (Linux; U; Android 11.0.0; zh-cn; MI 11 Build/OPR1.170623.032) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30"
			} }).promise.then(({ body }) => body);
		},
		filterData(rawData) {
			const list = [];
			const ids = /* @__PURE__ */ new Set();
			rawData.forEach((item) => {
				item.forEach((data) => {
					if (!data.songId || !data.copyrightId || ids.has(data.copyrightId)) return;
					ids.add(data.copyrightId);
					const types = [];
					const _types = {};
					data.audioFormats && data.audioFormats.forEach((type) => {
						let size;
						switch (type.formatType) {
							case "PQ":
								size = sizeFormate(type.asize ?? type.isize);
								types.push({
									type: "128k",
									size
								});
								_types["128k"] = { size };
								break;
							case "HQ":
								size = sizeFormate(type.asize ?? type.isize);
								types.push({
									type: "320k",
									size
								});
								_types["320k"] = { size };
								break;
							case "SQ":
								size = sizeFormate(type.asize ?? type.isize);
								types.push({
									type: "flac",
									size
								});
								_types.flac = { size };
								break;
							case "ZQ24":
								size = sizeFormate(type.asize ?? type.isize);
								types.push({
									type: "flac24bit",
									size
								});
								_types.flac24bit = { size };
						}
					});
					let img = data.img3 || data.img2 || data.img1 || null;
					if (img && !/https?:/.test(data.img3)) img = "http://d.musicapp.migu.cn" + img;
					list.push({
						singer: formatSingerName(data.singerList),
						name: data.name,
						albumName: data.album,
						albumId: data.albumId,
						songmid: data.songId,
						copyrightId: data.copyrightId,
						source: "mg",
						interval: formatPlayTime(data.duration),
						img,
						lrc: null,
						lrcUrl: data.lrcUrl,
						mrcUrl: data.mrcurl,
						trcUrl: data.trcUrl,
						types,
						_types,
						typeUrl: {}
					});
				});
			});
			return list;
		},
		search(str, page = 1, limit, retryNum = 0) {
			if (++retryNum > 3) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
			if (limit == null) limit = this.limit;
			return this.musicSearch(str, page, limit).then((result) => {
				if (!result || result.code !== "000000") return Promise.reject(new Error(result ? result.info : "搜索失败"));
				const songResultData = result.songResultData || {
					resultList: [],
					totalCount: 0
				};
				let list = this.filterData(songResultData.resultList);
				if (list == null) return this.search(str, page, limit, retryNum);
				this.total = parseInt(songResultData.totalCount);
				this.page = page;
				this.allPage = Math.ceil(this.total / limit);
				return {
					list,
					allPage: this.allPage,
					limit,
					total: this.total,
					source: "mg"
				};
			});
		}
	};
	//#endregion
	//#region backend/musicSdk/mg/songList.js
	var songList_default$1 = {
		_requestObj_tags: null,
		_requestObj_list: null,
		limit_list: 30,
		limit_song: 50,
		successCode: "000000",
		cachedDetailInfo: {},
		cachedUrl: {},
		sortList: [{
			name: "推荐",
			id: "15127315"
		}],
		regExps: {
			list: /<li><div class="thumb">.+?<\/li>/g,
			listInfo: /.+data-original="(.+?)".*data-id="(\d+)".*<div class="song-list-name"><a\s.*?>(.+?)<\/a>.+<i class="iconfont cf-bofangliang"><\/i>(.+?)<\/div>/,
			listDetailLink: /^.+\/playlist\/(\d+)(?:\?.*|&.*$|#.*$|$)/
		},
		tagsUrl: "https://app.c.nf.migu.cn/pc/v1.0/template/musiclistplaza-taglist/release",
		getSongListUrl(sortId, tagId, page) {
			if (!tagId) return `https://app.c.nf.migu.cn/pc/bmw/page-data/playlist-square-recommend/v1.0?templateVersion=2&pageNo=${page}`;
			return `https://app.c.nf.migu.cn/pc/v1.0/template/musiclistplaza-listbytag/release?pageNumber=${page}&templateVersion=2&tagId=${tagId}`;
		},
		getSongListDetailUrl(id, page) {
			return `https://app.c.nf.migu.cn/MIGUM3.0/resource/playlist/song/v2.0?pageNo=${page}&pageSize=${this.limit_song}&playlistId=${id}`;
		},
		defaultHeaders: {
			"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
			Referer: "https://m.music.migu.cn/"
		},
		getListDetailList(id, page, tryNum = 0) {
			if (tryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
			return httpFetch$1(this.getSongListDetailUrl(id, page), { headers: this.defaultHeaders }).promise.then(({ body }) => {
				if (body.code !== this.successCode) return this.getListDetailList(id, page, ++tryNum);
				return {
					list: filterMusicInfoListV5(body.data.songList),
					page,
					limit: this.limit_song,
					total: body.data.totalCount,
					source: "mg"
				};
			});
		},
		getListDetailInfo(id, tryNum = 0) {
			if (tryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
			if (this.cachedDetailInfo[id]) return Promise.resolve(this.cachedDetailInfo[id]);
			return httpFetch$1(`https://c.musicapp.migu.cn/MIGUM3.0/resource/playlist/v2.0?playlistId=${id}`, { headers: this.defaultHeaders }).promise.then(({ body }) => {
				if (body.code !== this.successCode) return this.getListDetail(id, ++tryNum);
				return this.cachedDetailInfo[id] = {
					name: body.data.title,
					img: body.data.imgItem.img,
					desc: body.data.summary,
					author: body.data.ownerName,
					play_count: formatPlayCount(body.data.opNumItem.playNum)
				};
			});
		},
		async getDetailUrl(link, page, retryNum = 0) {
			if (retryNum > 3) return Promise.reject(/* @__PURE__ */ new Error("link try max num"));
			const { headers: { location }, statusCode } = await httpFetch$1(link, { headers: {
				"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
				Referer: link
			} }).promise;
			if (statusCode > 400) return this.getDetailUrl(link, page, ++retryNum);
			if (location) {
				this.cachedUrl[link] = location;
				return this.getListDetail(location, page);
			}
			return Promise.reject(/* @__PURE__ */ new Error("link get failed"));
		},
		getListDetail(id, page, retryNum = 0) {
			if (/\/playlist[/?]/.test(id)) {
				id = /(?:playlistId|id)=(\d+)/.exec(id)?.[1];
				if (!id) throw new Error("list detail id parse failed");
			} else if (this.regExps.listDetailLink.test(id)) id = id.replace(this.regExps.listDetailLink, "$1");
			else if (/[?&:/]/.test(id)) {
				const url = this.cachedUrl[id];
				return url ? this.getListDetail(url, page) : this.getDetailUrl(id, page);
			}
			return Promise.all([this.getListDetailList(id, page, retryNum), this.getListDetailInfo(id, retryNum)]).then(([listData, info]) => {
				listData.info = info;
				return listData;
			});
		},
		getList(sortId, tagId, page, tryNum = 0) {
			if (this._requestObj_list) this._requestObj_list.cancelHttp();
			if (tryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
			this._requestObj_list = httpFetch$1(this.getSongListUrl(sortId, tagId, page), { headers: this.defaultHeaders });
			return this._requestObj_list.promise.then(({ body }) => {
				if (body.code !== "000000") return this.getList(sortId, tagId, page, ++tryNum);
				return {
					list: body.data.contents ? this.filterList2(body.data.contents) : this.filterList(body.data.contentItemList[1].itemList),
					total: 99999,
					page,
					limit: this.limit_list,
					source: "mg"
				};
			});
		},
		filterList2(listData, list = [], ids = /* @__PURE__ */ new Set()) {
			for (const item of listData) if (item.contents) this.filterList2(item.contents, list, ids);
			else if (item.resType == "2021" && !ids.has(item.resId)) {
				ids.add(item.resId);
				list.push({
					id: String(item.resId),
					author: "",
					name: item.txt,
					img: item.img,
					desc: item.txt2,
					source: "mg"
				});
			}
			return list;
		},
		filterList(rawData) {
			return rawData.map((item) => ({
				play_count: item.barList[0]?.title,
				id: String(item.logEvent.contentId),
				author: "",
				name: item.title,
				img: item.imageUrl,
				desc: "",
				source: "mg"
			}));
		},
		getTag(tryNum = 0) {
			if (this._requestObj_tags) this._requestObj_tags.cancelHttp();
			if (tryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
			this._requestObj_tags = httpFetch$1(this.tagsUrl, { headers: this.defaultHeaders });
			return this._requestObj_tags.promise.then(({ body }) => {
				if (body.code !== this.successCode) return this.getTag(++tryNum);
				return this.filterTagInfo(body.data);
			});
		},
		filterTagInfo(rawList) {
			return {
				hotTag: rawList[0].content.map(({ texts: [name, id] }) => ({
					id,
					name,
					source: "mg"
				})),
				tags: rawList.slice(1).map(({ header, content }) => ({
					name: header.title,
					list: content.map(({ texts: [name, id] }) => ({
						id,
						name,
						source: "mg"
					}))
				})),
				source: "mg"
			};
		},
		getTags() {
			return this.getTag();
		},
		getDetailPageUrl(id) {
			if (/playlist\/index\.html\?/.test(id)) id = id.replace(/.*(?:\?|&)id=(\d+)(?:&.*|$)/, "$1");
			else if (this.regExps.listDetailLink.test(id)) id = id.replace(this.regExps.listDetailLink, "$1");
			return `https://music.migu.cn/v3/music/playlist/${id}`;
		},
		filterSongListResult(raw) {
			const list = [];
			raw.forEach((item) => {
				if (!item.id) return;
				const playCount = parseInt(item.playNum);
				list.push({
					play_count: isNaN(playCount) ? 0 : formatPlayCount(playCount),
					id: item.id,
					author: item.userName,
					name: item.name,
					img: item.musicListPicUrl,
					total: item.musicNum,
					source: "mg"
				});
			});
			return list;
		},
		search(text, page, limit = 20) {
			const timeStr = Date.now().toString();
			const signResult = createSignature(timeStr, text);
			return createHttpFetch(`https://jadeite.migu.cn/music_search/v3/search/searchAll?isCorrect=1&isCopyright=1&searchSwitch=%7B%22song%22%3A0%2C%22album%22%3A0%2C%22singer%22%3A0%2C%22tagSong%22%3A0%2C%22mvSong%22%3A0%2C%22bestShow%22%3A0%2C%22songlist%22%3A1%2C%22lyricSong%22%3A0%7D&pageSize=${limit}&text=${encodeURIComponent(text)}&pageNo=${page}&sort=0&sid=USS`, { headers: {
				uiVersion: "A_music_3.6.1",
				deviceId: signResult.deviceId,
				timestamp: timeStr,
				sign: signResult.sign,
				channel: "0146921",
				"User-Agent": "Mozilla/5.0 (Linux; U; Android 11.0.0; zh-cn; MI 11 Build/OPR1.170623.032) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30"
			} }).then((body) => {
				if (!body.songListResultData) throw new Error("get song list faild.");
				return {
					list: this.filterSongListResult(body.songListResultData.result),
					limit,
					total: parseInt(body.songListResultData.totalCount),
					source: "mg"
				};
			});
		}
	};
	//#endregion
	//#region backend/musicSdk/mg/songId.js
	var getSongId = async (mInfo) => {
		if (mInfo.songmid != mInfo.copyrightId) return mInfo.songmid;
		return (await getMusicInfo(mInfo.copyrightId)).songmid;
	};
	//#endregion
	//#region backend/musicSdk/mg/pic.js
	var pic_default = {
		async getPicUrl(songId, tryNum = 0) {
			let requestObj = httpFetch$1(`http://music.migu.cn/v3/api/music/audioPlayer/getSongPic?songId=${songId}`, { headers: { Referer: "http://music.migu.cn/v3/music/player/audio?from=migu" } });
			requestObj.promise.then(({ body }) => {
				if (body.returnCode !== "000000") {
					if (tryNum > 5) return Promise.reject(/* @__PURE__ */ new Error("图片获取失败"));
					let tryRequestObj = this.getPic(songId, ++tryNum);
					requestObj.cancelHttp = tryRequestObj.cancelHttp.bind(tryRequestObj);
					return tryRequestObj.promise;
				}
				let url = body.largePic || body.mediumPic || body.smallPic;
				if (!/https?:/.test(url)) url = "http:" + url;
				return url;
			});
			return requestObj;
		},
		async getPic(songInfo) {
			const songId = await getSongId(songInfo);
			return this.getPicUrl(songId);
		}
	};
	//#endregion
	//#region backend/musicSdk/mg/utils/mrc.js
	var DELTA = 2654435769n;
	var MIN_LENGTH = 32;
	var keyArr = [
		27303562373562475n,
		18014862372307051n,
		22799692160172081n,
		34058940340699235n,
		30962724186095721n,
		27303523720101991n,
		27303523720101998n,
		31244139033526382n,
		28992395054481524n
	];
	var teaDecrypt = (data, key) => {
		const length = data.length;
		const lengthBitint = BigInt(length);
		if (length >= 1) {
			let j2 = data[0];
			let j3 = toLong((6n + 52n / lengthBitint) * DELTA);
			while (true) {
				let j4 = j3;
				if (j4 == 0n) break;
				let j5 = toLong(3n & toLong(j4 >> 2n));
				let j6 = lengthBitint;
				while (true) {
					j6--;
					if (j6 > 0n) {
						let j7 = data[j6 - 1n];
						let i = j6;
						j2 = toLong(data[i] - (toLong(toLong(j2 ^ j4) + toLong(j7 ^ key[toLong(toLong(3n & j6) ^ j5)])) ^ toLong(toLong(toLong(j7 >> 5n) ^ toLong(j2 << 2n)) + toLong(toLong(j2 >> 3n) ^ toLong(j7 << 4n)))));
						data[i] = j2;
					} else break;
				}
				let j8 = data[lengthBitint - 1n];
				j2 = toLong(data[0n] - toLong(toLong(toLong(key[toLong(toLong(j6 & 3n) ^ j5)] ^ j8) + toLong(j2 ^ j4)) ^ toLong(toLong(toLong(j8 >> 5n) ^ toLong(j2 << 2n)) + toLong(toLong(j2 >> 3n) ^ toLong(j8 << 4n)))));
				data[0] = j2;
				j3 = toLong(j4 - DELTA);
			}
		}
		return data;
	};
	var longArrToString = (data) => {
		const arrayList = [];
		for (const j of data) arrayList.push(longToBytes(j).toString("utf16le"));
		return arrayList.join("");
	};
	var longToBytes = (l) => {
		const result = import_buffer$1.Buffer.alloc(8);
		for (let i = 0; i < 8; i++) {
			result[i] = parseInt(l & 255n);
			l >>= 8n;
		}
		return result;
	};
	var toBigintArray = (data) => {
		const length = Math.floor(data.length / 16);
		const jArr = Array(length);
		for (let i = 0; i < length; i++) jArr[i] = toLong(data.substring(i * 16, i * 16 + 16));
		return jArr;
	};
	var MAX = 9223372036854775807n;
	var MIN = -9223372036854775808n;
	var toLong = (str) => {
		const num = typeof str == "string" ? BigInt("0x" + str) : str;
		if (num > MAX) return toLong(num - (1n << 64n));
		else if (num < MIN) return toLong(num + (1n << 64n));
		return num;
	};
	var decrypt = (data) => {
		return data == null || data.length < MIN_LENGTH ? data : longArrToString(teaDecrypt(toBigintArray(data), keyArr));
	};
	//#endregion
	//#region backend/musicSdk/mg/lyric.js
	var mrcTools = {
		rxps: {
			lineTime: /^\s*\[(\d+),\d+\]/,
			wordTime: /\(\d+,\d+\)/,
			wordTimeAll: /(\(\d+,\d+\))/g
		},
		parseLyric(str) {
			str = str.replace(/\r/g, "");
			const lines = str.split("\n");
			const lxlrcLines = [];
			const lrcLines = [];
			for (const line of lines) {
				if (line.length < 6) continue;
				let result = this.rxps.lineTime.exec(line);
				if (!result) continue;
				const startTime = parseInt(result[1]);
				let time = startTime;
				let ms = time % 1e3;
				time /= 1e3;
				let m = parseInt(time / 60).toString().padStart(2, "0");
				time %= 60;
				time = `${m}:${parseInt(time).toString().padStart(2, "0")}.${ms}`;
				let words = line.replace(this.rxps.lineTime, "");
				lrcLines.push(`[${time}]${words.replace(this.rxps.wordTimeAll, "")}`);
				let times = words.match(this.rxps.wordTimeAll);
				if (!times) continue;
				times = times.map((time) => {
					const result = /\((\d+),(\d+)\)/.exec(time);
					return `<${parseInt(result[1]) - startTime},${result[2]}>`;
				});
				const wordArr = words.split(this.rxps.wordTime);
				const newWords = times.map((time, index) => `${time}${wordArr[index]}`).join("");
				lxlrcLines.push(`[${time}]${newWords}`);
			}
			return {
				lyric: lrcLines.join("\n"),
				lxlyric: lxlrcLines.join("\n")
			};
		},
		getText(url, tryNum = 0) {
			return httpFetch$1(url, { headers: {
				Referer: "https://app.c.nf.migu.cn/",
				"User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36",
				channel: "0146921"
			} }).promise.then(({ statusCode, body }) => {
				if (statusCode == 200) return body;
				if (tryNum > 5 || statusCode == 404) return Promise.reject(/* @__PURE__ */ new Error("歌词获取失败"));
				return this.getText(url, ++tryNum);
			});
		},
		getMrc(url) {
			return this.getText(url).then((text) => {
				return this.parseLyric(decrypt(text));
			});
		},
		getLrc(url) {
			return this.getText(url).then((text) => ({
				lxlyric: "",
				lyric: text
			}));
		},
		getTrc(url) {
			if (!url) return Promise.resolve("");
			return this.getText(url);
		},
		async getMusicInfo(songInfo) {
			return songInfo.mrcUrl == null ? getMusicInfo(songInfo.copyrightId) : songInfo;
		},
		getLyric(songInfo) {
			return {
				promise: this.getMusicInfo(songInfo).then((info) => {
					let p;
					if (info.mrcUrl) p = this.getMrc(info.mrcUrl);
					else if (info.lrcUrl) p = this.getLrc(info.lrcUrl);
					if (p == null) return Promise.reject(/* @__PURE__ */ new Error("获取歌词失败"));
					return Promise.all([p, this.getTrc(info.trcUrl)]).then(([lrcInfo, tlyric]) => {
						lrcInfo.tlyric = tlyric;
						return lrcInfo;
					});
				}),
				cancelHttp() {}
			};
		}
	};
	var lyric_default = { getLyric(songInfo) {
		return mrcTools.getLyric(songInfo);
	} };
	//#endregion
	//#region backend/musicSdk/mg/index.js
	var mg = {
		songList: songList_default$1,
		musicSearch: musicSearch_default$1,
		leaderboard: leaderboard_default$1,
		hotSearch: {
			_requestObj: null,
			async getList(retryNum = 0) {
				if (this._requestObj) this._requestObj.cancelHttp();
				if (retryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
				const { body, statusCode } = await httpFetch$1("http://jadeite.migu.cn:7090/music_search/v3/search/hotword").promise;
				if (statusCode != 200 || body.code !== "000000") throw new Error("获取热搜词失败");
				return {
					source: "mg",
					list: this.filterList(body.data.hotwords[0].hotwordList)
				};
			},
			filterList(rawList) {
				return rawList.filter((item) => item.resourceType == "song").map((item) => item.word);
			}
		},
		comment: {
			_requestObj: null,
			_requestObj2: null,
			_requestObj3: null,
			lastCommentIds: /* @__PURE__ */ new Map(),
			async getComment(musicInfo, page = 1, limit = 20) {
				if (this._requestObj) this._requestObj.cancelHttp();
				if (!musicInfo.songId) {
					let id = await getSongId(musicInfo);
					if (!id) throw new Error("获取评论失败");
					musicInfo.songId = id;
				}
				if (page === 1) this.lastCommentIds.clear();
				const lastCommentId = this.lastCommentIds.get(String(page)) || "";
				if (!lastCommentId && page > 1) throw new Error("获取评论失败");
				const { body, statusCode } = await httpFetch$1(`https://app.c.nf.migu.cn/MIGUM3.0/user/comment/stack/v1.0?pageSize=${limit}&queryType=1&resourceId=${musicInfo.songId}&resourceType=2&commentId=${lastCommentId}`, { headers: { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1" } }).promise;
				if (statusCode != 200 || body.code !== "000000") throw new Error("获取评论失败");
				const total = parseInt(body.data.commentNums);
				const list = this.filterComment(body.data.comments);
				this.lastCommentIds.set(String(page + 1), list.length ? list[list.length - 1].id : "");
				return {
					source: "mg",
					comments: list,
					total,
					page,
					limit,
					maxPage: Math.ceil(total / limit) || 1
				};
			},
			async getHotComment(musicInfo, page = 1, limit = 20) {
				if (this._requestObj2) this._requestObj2.cancelHttp();
				if (!musicInfo.songId) {
					let id = await getSongId(musicInfo);
					if (!id) throw new Error("获取评论失败");
					musicInfo.songId = id;
				}
				const { body, statusCode } = await httpFetch$1(`https://app.c.nf.migu.cn/MIGUM3.0/user/comment/stack/v1.0?pageSize=${limit}&queryType=2&resourceId=${musicInfo.songId}&resourceType=2&hotCommentStart=${(page - 1) * limit}`, { headers: { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1" } }).promise;
				if (statusCode != 200 || body.code !== "000000") throw new Error("获取热门评论失败");
				const total = parseInt(body.data.cfgHotCount);
				return {
					source: "mg",
					comments: this.filterComment(body.data.hotComments),
					total,
					page,
					limit,
					maxPage: Math.ceil(total / limit) || 1
				};
			},
			async getReplyComment(musicInfo, replyId, page = 1, limit = 10) {
				if (this._requestObj2) this._requestObj2.cancelHttp();
				const { body, statusCode } = await httpFetch$1(`https://app.c.nf.migu.cn/MIGUM3.0/user/comment/stack/${replyId}/v1.0?pageSize=${limit}&queryType=2&resourceId=${musicInfo.songId}&resourceType=2&start=${(page - 1) * limit}`, { headers: { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1" } }).promise;
				if (statusCode != 200 || body.code !== "000000") throw new Error("获取回复评论失败");
				const total = parseInt(body.data.replyTotalCount);
				return {
					source: "mg",
					comments: this.filterComment(body.data.mainCommentItem.replyComments),
					total,
					page,
					limit,
					maxPage: Math.ceil(total / limit) || 1
				};
			},
			filterComment(rawList) {
				return rawList.map((item) => ({
					id: item.commentId,
					text: item.commentInfo,
					time: item.commentTime,
					timeStr: dateFormat2(new Date(item.commentTime).getTime()),
					userName: item.user.nickName,
					avatar: item.user.middleIcon || item.user.bigIcon || item.user.smallIcon,
					userId: item.user.userId,
					likedCount: item.opNumItem.thumbNum,
					replyNum: item.replyTotalCount,
					reply: item.replyComments.map((c) => ({
						id: c.replyId,
						text: c.replyInfo,
						time: c.replyTime,
						timeStr: dateFormat2(new Date(c.replyTime).getTime()),
						userName: c.user.nickName,
						avatar: c.user.middleIcon || c.user.bigIcon || c.user.smallIcon,
						userId: c.user.userId,
						likedCount: null,
						replyNum: null
					}))
				}));
			}
		},
		getMusicUrl(songInfo, type) {
			return apis("mg").getMusicUrl(songInfo, type);
		},
		getLyric(songInfo) {
			return lyric_default.getLyric(songInfo);
		},
		getPic(songInfo) {
			return pic_default.getPic(songInfo);
		},
		getMusicDetailPageUrl(songInfo) {
			return `http://music.migu.cn/v3/music/song/${songInfo.copyrightId}`;
		}
	};
	//#endregion
	//#region backend/musicSdk/bd/leaderboard.js
	var boardList = [
		{
			id: "bd__2",
			name: "热歌榜",
			bangid: "2"
		},
		{
			id: "bd__20",
			name: "华语金曲榜",
			bangid: "20"
		},
		{
			id: "bd__25",
			name: "网络歌曲榜",
			bangid: "25"
		},
		{
			id: "bd__1",
			name: "新歌榜",
			bangid: "1"
		},
		{
			id: "bd__21",
			name: "欧美金曲榜",
			bangid: "21"
		},
		{
			id: "bd__200",
			name: "原创音乐榜",
			bangid: "200"
		},
		{
			id: "bd__22",
			name: "经典老歌榜",
			bangid: "22"
		},
		{
			id: "bd__24",
			name: "影视金曲榜",
			bangid: "24"
		},
		{
			id: "bd__23",
			name: "情歌对唱榜",
			bangid: "23"
		},
		{
			id: "bd__11",
			name: "摇滚榜",
			bangid: "11"
		},
		{
			id: "bd__105",
			name: "好童星榜",
			bangid: "105"
		},
		{
			id: "bd__106",
			name: "雅克•藏羌彝原创音乐榜",
			bangid: "106"
		}
	];
	var leaderboard_default = {
		limit: 20,
		list: [
			{
				id: "bdrgb",
				name: "热歌榜",
				bangid: "2"
			},
			{
				id: "bdxgb",
				name: "新歌榜",
				bangid: "1"
			},
			{
				id: "bdycb",
				name: "原创榜",
				bangid: "200"
			},
			{
				id: "bdhyjqb",
				name: "华语榜",
				bangid: "20"
			},
			{
				id: "bdomjqb",
				name: "欧美榜",
				bangid: "21"
			},
			{
				id: "bdwugqb",
				name: "网络榜",
				bangid: "25"
			},
			{
				id: "bdjdlgb",
				name: "老歌榜",
				bangid: "22"
			},
			{
				id: "bdysjqb",
				name: "影视金曲榜",
				bangid: "24"
			},
			{
				id: "bdqgdcb",
				name: "情歌对唱榜",
				bangid: "23"
			},
			{
				id: "bdygb",
				name: "摇滚榜",
				bangid: "11"
			}
		],
		getUrl(id, p) {
			return `http://musicmini.qianqian.com/2018/static/bangdan/bangdanList_${id}_${p}.html`;
		},
		regExps: {
			item: /data-song="({.+?})"/g,
			info: /{total[\s:]+"(\d+)", size[\s:]+"(\d+)", page[\s:]+"(\d+)"}/
		},
		getData(url) {
			return httpFetch$1(url).promise;
		},
		filterData(rawList) {
			return rawList.map((item) => {
				const types = [];
				const _types = {};
				let size = null;
				types.push({
					type: "128k",
					size
				});
				_types["128k"] = { size };
				if (item.biaoshi) {
					types.push({
						type: "320k",
						size
					});
					_types["320k"] = { size };
					types.push({
						type: "flac",
						size
					});
					_types.flac = { size };
				}
				return {
					singer: item.song_artist.replace(",", "、"),
					name: item.song_title,
					albumName: item.album_title,
					albumId: item.album_id,
					source: "bd",
					interval: "",
					songmid: item.song_id,
					img: null,
					lrc: null,
					types,
					_types,
					typeUrl: {}
				};
			});
		},
		parseData(rawData) {
			return rawData.map((item) => JSON.parse(item.replace(this.regExps.item, "$1").replace(/&quot;/g, "\"").replace(/\\\//g, "/")));
		},
		async getBoards(retryNum = 0) {
			this.list = boardList;
			return {
				list: boardList,
				source: "bd"
			};
		},
		getList(bangid, page, retryNum = 0) {
			if (++retryNum > 3) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
			return this.getData(this.getUrl(bangid, page)).then(({ body }) => {
				let result = body.match(this.regExps.item);
				if (!result) return this.getList(bangid, page, retryNum);
				let info = body.match(this.regExps.info);
				if (!info) return this.getList(bangid, page, retryNum);
				const list = this.filterData(this.parseData(result));
				this.limit = parseInt(info[2]);
				return {
					total: parseInt(info[1]),
					list,
					limit: this.limit,
					page: parseInt(info[3]),
					source: "bd"
				};
			});
		}
	};
	//#endregion
	//#region backend/musicSdk/bd/musicInfo.js
	var musicInfo_default = {
		cache: {},
		getMusicInfo(songmid) {
			if (this.cache[songmid]) return { promise: Promise.resolve(this.cache[songmid]) };
			const requestObj = httpFetch$1(`https://musicapi.qianqian.com/v1/restserver/ting?method=baidu.ting.song.getSongLink&format=json&from=bmpc&version=1.0.0&version_d=11.1.6.0&songid=${songmid}&type=1&res=1&s_protocol=1&aac=2&project=tpass`);
			requestObj.promise = requestObj.promise.then(({ body }) => {
				if (body.error_code == 22e3) {
					this.cache[songmid] = body.result.songinfo;
					return body.result.songinfo;
				}
				return Promise.reject(/* @__PURE__ */ new Error("获取音乐信息失败"));
			});
			return requestObj;
		}
	};
	//#endregion
	//#region backend/musicSdk/index.js
	var sources = {
		sources: [
			{
				name: "酷我音乐",
				id: "kw"
			},
			{
				name: "酷狗音乐",
				id: "kg"
			},
			{
				name: "QQ音乐",
				id: "tx"
			},
			{
				name: "网易音乐",
				id: "wy"
			},
			{
				name: "咪咕音乐",
				id: "mg"
			},
			{
				name: "虾米音乐",
				id: "xm"
			}
		],
		kw,
		kg,
		tx,
		wy,
		mg,
		bd: {
			leaderboard: leaderboard_default,
			songList: {
				_requestObj_tags: null,
				_requestObj_list: null,
				_requestObj_listRecommend: null,
				limit_list: 30,
				limit_song: 1e4,
				successCode: 22e3,
				sortList: [{
					name: "最热",
					id: "1"
				}, {
					name: "最新",
					id: "0"
				}],
				regExps: { listDetailLink: /^.+\/songlist\/(\d+)(?:\?.*|&.*$|#.*$|$)/ },
				aesPassEncod(jsonData) {
					let timestamp = Math.floor(Date.now() / 1e3);
					let privateKey = toMD5("baidu_taihe_music_secret_key" + timestamp).substr(8, 16);
					let key = import_crypto_js.default.enc.Utf8.parse(privateKey);
					let iv = import_crypto_js.default.enc.Utf8.parse(privateKey);
					let arrData = [];
					let strData = "";
					for (let key in jsonData) arrData.push(key);
					arrData.sort();
					for (let i = 0; i < arrData.length; i++) {
						let key = arrData[i];
						strData += (i === 0 ? "" : "&") + key + "=" + encodeURIComponent(jsonData[key]);
					}
					let ciphertext = import_crypto_js.default.AES.encrypt(strData, key, {
						iv,
						blockSize: 16,
						mode: import_crypto_js.default.mode.CBC,
						format: {
							stringify(cipherParams) {
								let jsonObj = { ct: cipherParams.ciphertext.toString(import_crypto_js.default.enc.Base64) };
								if (cipherParams.iv) jsonObj.iv = cipherParams.iv.toString();
								if (cipherParams.salt) jsonObj.s = cipherParams.salt.toString();
								return jsonObj;
							},
							parse(jsonStr) {
								let jsonObj = JSON.parse(jsonStr);
								let cipherParams = import_crypto_js.default.lib.CipherParams.create({ ciphertext: import_crypto_js.default.enc.Base64.parse(jsonObj.ct) });
								if (jsonObj.iv) cipherParams.iv = import_crypto_js.default.enc.Hex.parse(jsonObj.iv);
								if (jsonObj.s) cipherParams.salt = import_crypto_js.default.enc.Hex.parse(jsonObj.s);
								return cipherParams;
							}
						}
					}).toString().ct;
					return {
						timestamp,
						param: ciphertext,
						sign: toMD5("baidu_taihe_music" + ciphertext + timestamp)
					};
				},
				createUrl(param, method) {
					let data = this.aesPassEncod(param);
					return `http://musicmini.qianqian.com/v1/restserver/ting?method=${method}&time=${Date.now()}&timestamp=${data.timestamp}&param=${data.param}&sign=${data.sign}`;
				},
				getTagsUrl() {
					return this.createUrl({
						from: "qianqianmini",
						type: "diy",
						version: "10.1.8"
					}, "baidu.ting.ugcdiy.getChannels");
				},
				getListUrl(sortType, tagName, page) {
					return this.createUrl({
						channelname: tagName || "全部",
						from: "qianqianmini",
						offset: (page - 1) * this.limit_list,
						order_type: sortType,
						size: this.limit_list,
						version: "10.1.8"
					}, "baidu.ting.ugcdiy.getChanneldiy");
				},
				getListDetailUrl(list_id, page) {
					return this.createUrl({
						list_id,
						offset: (page - 1) * this.limit_song,
						size: this.limit_song,
						withcount: "1",
						withsong: "1"
					}, "baidu.ting.ugcdiy.getBaseInfo");
				},
				getTags(tryNum = 0) {
					if (this._requestObj_tags) this._requestObj_tags.cancelHttp();
					if (tryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
					this._requestObj_tags = httpFetch$1(this.getTagsUrl());
					return this._requestObj_tags.promise.then(({ body }) => {
						if (body.error_code !== this.successCode) return this.getTags(++tryNum);
						return {
							hotTag: this.filterInfoHotTag(body.result.hot),
							tags: this.filterTagInfo(body.result.tags),
							source: "bd"
						};
					});
				},
				filterInfoHotTag(rawList) {
					return rawList.map((item) => ({
						name: item,
						id: item,
						source: "bd"
					}));
				},
				filterTagInfo(rawList) {
					return rawList.map((type) => ({
						name: type.first,
						list: type.second.map((item) => ({
							parent_id: type.first,
							parent_name: type.first,
							id: item,
							name: item,
							source: "bd"
						}))
					}));
				},
				getList(sortId, tagId, page, tryNum = 0) {
					if (this._requestObj_list) this._requestObj_list.cancelHttp();
					if (tryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
					this._requestObj_list = httpFetch$1(this.getListUrl(sortId, tagId, page));
					return this._requestObj_list.promise.then(({ body }) => {
						if (body.error_code !== this.successCode) return this.getList(sortId, tagId, page, ++tryNum);
						return {
							list: this.filterList(body.diyInfo),
							total: body.nums,
							page,
							limit: this.limit_list,
							source: "bd"
						};
					});
				},
				/**
				* 格式化播放数量
				* @param {*} num
				*/
				formatPlayCount(num) {
					if (num > 1e8) return parseInt(num / 1e7) / 10 + "亿";
					if (num > 1e4) return parseInt(num / 1e3) / 10 + "万";
					return num;
				},
				filterList(rawData) {
					return rawData.map((item) => ({
						play_count: this.formatPlayCount(item.listen_num),
						id: String(item.list_id),
						author: item.username,
						name: item.title,
						img: item.list_pic_large || item.list_pic,
						grade: item.grade,
						desc: item.desc || item.tag,
						source: "bd"
					}));
				},
				getListDetail(id, page, tryNum = 0) {
					if (tryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
					if (/[?&:/]/.test(id)) id = id.replace(this.regExps.listDetailLink, "$1");
					return httpFetch$1(this.getListDetailUrl(id, page)).promise.then(({ body }) => {
						if (body.error_code !== this.successCode) return this.getListDetail(id, page, ++tryNum);
						return {
							list: this.filterData(body.result.songlist),
							page,
							limit: this.limit_song,
							total: body.result.song_num,
							source: "bd",
							info: {
								name: body.result.info.list_title,
								img: body.result.info.list_pic,
								desc: body.result.info.list_desc,
								author: body.result.info.userinfo.username,
								play_count: this.formatPlayCount(body.result.listen_num)
							}
						};
					});
				},
				filterData(rawList) {
					return rawList.map((item) => {
						const types = [];
						const _types = {};
						let size = null;
						let itemTypes = item.all_rate.split(",");
						if (itemTypes.includes("128")) {
							types.push({
								type: "128k",
								size
							});
							_types["128k"] = { size };
						}
						if (itemTypes.includes("320")) {
							types.push({
								type: "320k",
								size
							});
							_types["320k"] = { size };
						}
						if (itemTypes.includes("flac")) {
							types.push({
								type: "flac",
								size
							});
							_types.flac = { size };
						}
						return {
							singer: item.author.replace(",", "、"),
							name: item.title,
							albumName: item.album_title,
							albumId: item.album_id,
							source: "bd",
							interval: formatPlayTime(parseInt(item.file_duration)),
							songmid: item.song_id,
							img: item.pic_s500,
							lrc: null,
							types,
							_types,
							typeUrl: {}
						};
					});
				}
			},
			musicSearch: {
				limit: 30,
				total: 0,
				page: 0,
				allPage: 1,
				musicSearch(str, page, limit) {
					return httpFetch$1(`http://tingapi.ting.baidu.com/v1/restserver/ting?from=android&version=5.6.5.6&method=baidu.ting.search.merge&format=json&query=${encodeURIComponent(str)}&page_no=${page}&page_size=${limit}&type=0&data_source=0&use_cluster=1`).promise.then(({ body }) => body);
				},
				handleResult(rawData) {
					let ids = /* @__PURE__ */ new Set();
					const list = [];
					if (!rawData) return list;
					rawData.forEach((item) => {
						if (ids.has(item.song_id)) return;
						ids.add(item.song_id);
						const types = [];
						const _types = {};
						let size = null;
						let itemTypes = item.all_rate.split(",");
						if (itemTypes.includes("128")) {
							types.push({
								type: "128k",
								size
							});
							_types["128k"] = { size };
						}
						if (itemTypes.includes("320")) {
							types.push({
								type: "320k",
								size
							});
							_types["320k"] = { size };
						}
						if (itemTypes.includes("flac")) {
							types.push({
								type: "flac",
								size
							});
							_types.flac = { size };
						}
						list.push({
							singer: item.author.replace(",", "、"),
							name: item.title,
							albumName: item.album_title,
							albumId: item.album_id,
							source: "bd",
							interval: formatPlayTime(parseInt(item.file_duration)),
							songmid: item.song_id,
							img: null,
							lrc: null,
							types,
							_types,
							typeUrl: {}
						});
					});
					return list;
				},
				search(str, page = 1, limit, retryNum = 0) {
					if (++retryNum > 3) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
					if (limit == null) limit = this.limit;
					return this.musicSearch(str, page, limit).then((result) => {
						if (!result || result.error_code !== 22e3) return this.search(str, page, limit, retryNum);
						let list = this.handleResult(result.result.song_info.song_list);
						if (list == null) return this.search(str, page, limit, retryNum);
						this.total = result.result.song_info.total;
						this.page = page;
						this.allPage = Math.ceil(this.total / limit);
						return Promise.resolve({
							list,
							allPage: this.allPage,
							limit,
							total: this.total,
							source: "bd"
						});
					});
				}
			},
			hotSearch: {
				_requestObj: null,
				async getList(retryNum = 0) {
					if (this._requestObj) this._requestObj.cancelHttp();
					if (retryNum > 2) return Promise.reject(/* @__PURE__ */ new Error("try max num"));
					const { body, statusCode } = await httpFetch$1("http://musicapi.qianqian.com/v1/restserver/ting?from=android&version=7.0.2.0&channel=ppzs&operator=0&method=baidu.ting.search.hot", {
						method: "get",
						headers: { "User-Agent": "android_7.0.2.0;baiduyinyue" }
					}).promise;
					if (statusCode != 200 || body.error_code !== 22e3) throw new Error("获取热搜词失败");
					return {
						source: "bd",
						list: this.filterList(body.result)
					};
				},
				filterList(rawList) {
					return rawList.map((item) => item.word);
				}
			},
			getMusicUrl(songInfo, type) {
				return apis("bd").getMusicUrl(songInfo, type);
			},
			getPic(songInfo) {
				return this.getMusicInfo(songInfo).promise.then((info) => info.pic_premium);
			},
			getLyric(songInfo) {
				const requestObj = this.getMusicInfo(songInfo);
				requestObj.promise = requestObj.promise.then((info) => httpFetch$1(info.lrclink).promise.then((resp) => ({
					lyric: resp.body,
					tlyric: ""
				})));
				return requestObj;
			},
			getMusicInfo(songInfo) {
				return musicInfo_default.getMusicInfo(songInfo.songmid);
			},
			getMusicDetailPageUrl(songInfo) {
				return `http://music.taihe.com/song/${songInfo.songmid}`;
			}
		},
		xm: {
			comment: {
				getComment() {
					return Promise.reject(/* @__PURE__ */ new Error("fail"));
				},
				getHotComment() {
					return Promise.reject(/* @__PURE__ */ new Error("fail"));
				}
			},
			getMusicUrl(songInfo, type) {
				return { promise: Promise.reject(/* @__PURE__ */ new Error("fail")) };
			},
			getLyric(songInfo) {
				return { promise: Promise.reject(/* @__PURE__ */ new Error("fail")) };
			},
			getPic(songInfo) {
				return Promise.reject(/* @__PURE__ */ new Error("fail"));
			}
		}
	};
	var musicSdk_default = {
		...sources,
		init() {
			const tasks = [];
			for (let source of sources.sources) {
				let sm = sources[source.id];
				sm && sm.init && tasks.push(sm.init());
			}
			return Promise.all(tasks);
		},
		supportQuality,
		async searchMusic({ name, singer, source: s, limit = 25 }) {
			const trimStr = (str) => typeof str == "string" ? str.trim() : str;
			const musicName = trimStr(name);
			const tasks = [];
			const excludeSource = ["xm"];
			for (const source of sources.sources) {
				if (!sources[source.id].musicSearch || source.id == s || excludeSource.includes(source.id)) continue;
				tasks.push(sources[source.id].musicSearch.search(`${musicName} ${singer || ""}`.trim(), 1, limit).catch((_) => null));
			}
			return (await Promise.all(tasks)).filter((s) => s);
		},
		async findMusic({ name, singer, albumName, interval, source: s }) {
			const lists = await this.searchMusic({
				name,
				singer,
				source: s,
				limit: 25
			});
			const singersRxp = /、|&|;|；|\/|,|，|\|/;
			const sortSingle = (singer) => singersRxp.test(singer) ? singer.split(singersRxp).sort((a, b) => a.localeCompare(b)).join("、") : singer || "";
			const sortMusic = (arr, callback) => {
				const tempResult = [];
				for (let i = arr.length - 1; i > -1; i--) {
					const item = arr[i];
					if (callback(item)) {
						delete item.fSinger;
						delete item.fMusicName;
						delete item.fAlbumName;
						delete item.fInterval;
						tempResult.push(item);
						arr.splice(i, 1);
					}
				}
				tempResult.reverse();
				return tempResult;
			};
			const getIntv = (interval) => {
				if (!interval) return 0;
				let intvArr = interval.split(":");
				let intv = 0;
				let unit = 1;
				while (intvArr.length) {
					intv += parseInt(intvArr.pop()) * unit;
					unit *= 60;
				}
				return intv;
			};
			const trimStr = (str) => typeof str == "string" ? str.trim() : str || "";
			const filterStr = (str) => typeof str == "string" ? str.replace(/\s|'|\.|,|，|&|"|、|\(|\)|（|）|`|~|-|<|>|\||\/|\]|\[|!|！/g, "") : String(str || "");
			const fMusicName = filterStr(name).toLowerCase();
			const fSinger = filterStr(sortSingle(singer)).toLowerCase();
			const fAlbumName = filterStr(albumName).toLowerCase();
			const fInterval = getIntv(interval);
			const isEqualsInterval = (intv) => Math.abs((fInterval || intv) - (intv || fInterval)) < 5;
			const isIncludesName = (name) => fMusicName.includes(name) || name.includes(fMusicName);
			const isIncludesSinger = (singer) => fSinger ? fSinger.includes(singer) || singer.includes(fSinger) : true;
			const isEqualsAlbum = (album) => fAlbumName ? fAlbumName == album : true;
			const result = lists.map((source) => {
				for (const item of source.list) {
					item.name = trimStr(item.name);
					item.singer = trimStr(item.singer);
					item.fSinger = filterStr(sortSingle(item.singer).toLowerCase());
					item.fMusicName = filterStr(String(item.name ?? "").toLowerCase());
					item.fAlbumName = filterStr(String(item.albumName ?? "").toLowerCase());
					item.fInterval = getIntv(item.interval);
					if (!isEqualsInterval(item.fInterval)) {
						item.name = null;
						continue;
					}
					if (item.fMusicName == fMusicName && isIncludesSinger(item.fSinger)) return item;
				}
				for (const item of source.list) {
					if (item.name == null) continue;
					if (item.fSinger == fSinger && isIncludesName(item.fMusicName)) return item;
				}
				for (const item of source.list) {
					if (item.name == null) continue;
					if (isEqualsAlbum(item.fAlbumName) && isIncludesSinger(item.fSinger) && isIncludesName(item.fMusicName)) return item;
				}
				return null;
			}).filter((s) => s);
			const newResult = [];
			if (result.length) {
				newResult.push(...sortMusic(result, (item) => item.fSinger == fSinger && item.fMusicName == fMusicName && item.interval == interval));
				newResult.push(...sortMusic(result, (item) => item.fMusicName == fMusicName && item.fSinger == fSinger && item.fAlbumName == fAlbumName));
				newResult.push(...sortMusic(result, (item) => item.fSinger == fSinger && item.fMusicName == fMusicName));
				newResult.push(...sortMusic(result, (item) => item.fMusicName == fMusicName && item.interval == interval));
				newResult.push(...sortMusic(result, (item) => item.fSinger == fSinger && item.interval == interval));
				newResult.push(...sortMusic(result, (item) => item.interval == interval));
				newResult.push(...sortMusic(result, (item) => item.fMusicName == fMusicName));
				newResult.push(...sortMusic(result, (item) => item.fSinger == fSinger));
				newResult.push(...sortMusic(result, (item) => item.fAlbumName == fAlbumName));
				for (const item of result) {
					delete item.fSinger;
					delete item.fMusicName;
					delete item.fAlbumName;
					delete item.fInterval;
				}
				newResult.push(...result);
			}
			return newResult;
		}
	};
	//#endregion
	//#region backend/onlineMusic.ts
	/**
	* 在线聚合搜索
	*/
	async function searchOnlineMusic(keyword, source = "wy", page = 1, limit = 30) {
		if (!keyword.trim()) return {
			list: [],
			total: 0
		};
		if (source === "custom") {
			try {
				const customRes = await userApiManager.invokeSource("search", {
					keyword,
					page,
					limit
				});
				if (customRes && Array.isArray(customRes.list)) return {
					list: customRes.list.map((s) => ({
						id: s.id || `custom_${Date.now()}_${Math.random()}`,
						name: s.name,
						singer: s.singer || "群星",
						album: s.album || "单曲",
						interval: s.interval || "03:30",
						pic: s.pic || s.img,
						url: s.url,
						source: "custom"
					})),
					total: customRes.total || customRes.list.length
				};
			} catch (err) {
				throw new Error(`自定义音源搜索失败: ${err}`);
			}
			throw new Error("当前自定义音源不支持搜索，请选择平台搜索");
		}
		const sdk = musicSdk_default[source];
		if (!sdk || !sdk.musicSearch) throw new Error(`暂不支持音源: ${source}`);
		try {
			const res = await sdk.musicSearch.search(keyword, page, limit);
			const list = (res.list || []).map((item) => {
				let defaultUrl = "";
				if (item.songmid) {
					if (source === "wy") defaultUrl = `https://music.163.com/song/media/outer/url?id=${item.songmid}.mp3`;
				}
				return {
					id: `${source}_${item.songmid || item.hash || item.id}`,
					name: item.name || "未知曲目",
					singer: item.singer || "未知歌手",
					album: item.albumName || item.album || "精选单曲",
					interval: item.interval || "04:00",
					pic: item.img || item.pic || "",
					url: defaultUrl,
					source,
					raw: item
				};
			});
			return {
				list,
				total: res.total || list.length
			};
		} catch (err) {
			console.error(`Search error on source [${source}]:`, err);
			throw err;
		}
	}
	/**
	* 获取官方推荐排行榜榜单列表
	*/
	async function getOnlineLeaderboards(source = "wy") {
		const sdk = musicSdk_default[source];
		if (!sdk || !sdk.leaderboard) return [];
		try {
			const list = await sdk.leaderboard.getBoards();
			return Array.isArray(list) ? list : list?.list || [];
		} catch (err) {
			console.warn("Get boards failed:", err);
			throw err;
		}
	}
	/**
	* 获取排行榜歌曲列表 (直连真实官方热榜，获取 100 首实时排行榜曲目)
	*/
	async function getLeaderboardSongs(bangId, source = "wy", page = 1) {
		const cleanId = bangId.replace(/^[a-z]+__/, "");
		if (source === "wy") try {
			const resp = await userApiManager.nativeRequest(`https://music.163.com/api/playlist/detail?id=${cleanId}`, { method: "GET" });
			const data = resp.body || resp;
			const tracks = data?.result?.tracks || data?.playlist?.tracks || [];
			if (Array.isArray(tracks) && tracks.length > 0) return tracks.slice(0, 100).map((t) => {
				const singer = (t.artists || t.ar || []).map((a) => a.name).join(" / ") || "未知歌手";
				const album = t.album?.name || t.al?.name || "热门精选";
				const pic = t.album?.picUrl || t.al?.picUrl || "";
				const durationSec = Math.floor((t.duration || t.dt || 24e4) / 1e3);
				const m = Math.floor(durationSec / 60);
				const s = durationSec % 60;
				const interval = `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
				return {
					id: `wy_${t.id}`,
					name: t.name,
					singer,
					album,
					interval,
					pic,
					url: `https://music.163.com/song/media/outer/url?id=${t.id}.mp3`,
					source: "wy",
					raw: t
				};
			});
		} catch (e) {
			console.warn("Direct NetEase board fetch failed, fallback to sdk:", e);
		}
		const sdk = musicSdk_default[source];
		if (!sdk || !sdk.leaderboard) return [];
		try {
			return ((await sdk.leaderboard.getList(cleanId, page)).list || []).map((item) => ({
				id: `${source}_${item.songmid || item.hash || item.id}`,
				name: item.name,
				singer: item.singer,
				album: item.albumName || item.album || "热歌榜",
				interval: item.interval || "03:45",
				pic: item.img || item.pic || "",
				url: source === "wy" && item.songmid ? `https://music.163.com/song/media/outer/url?id=${item.songmid}.mp3` : "",
				source,
				raw: item
			}));
		} catch (err) {
			console.error("Failed to get board list:", err);
			throw err;
		}
	}
	/**
	* 智能获取单曲歌词 (支持五大主流平台 SDK 自动调度)
	*/
	async function getSongLyric(item) {
		if (item.lrc) return {
			lyric: item.lrc,
			tlrc: item.tlrc || ""
		};
		const sdk = musicSdk_default[item.source || "wy"];
		if (sdk && sdk.getLyric) try {
			const songInfo = {
				...item.raw,
				songmid: item.raw?.songmid || item.raw?.id || item.id.replace(/^[a-z]+_/, ""),
				...!item.raw ? {
					songmid: item.id.replace(/^[a-z]+_/, ""),
					name: item.name,
					singer: item.singer
				} : {}
			};
			const res = await sdk.getLyric(songInfo);
			const data = res?.promise ? await res.promise : await res;
			if (data && data.lyric) return {
				lyric: data.lyric,
				tlrc: data.tlyric || data.tlrc || ""
			};
		} catch (e) {
			console.warn("Get lyric error:", e);
		}
		return "";
	}
	/**
	* 智能获取单曲播放直链 (自定义源 UserAPI 优先，内置备选直链回退)
	*/
	async function getSongPlayUrl(item) {
		try {
			const customRes = await userApiManager.invokeSource("musicUrl", {
				source: item.source || "wy",
				songInfo: item.raw || item,
				type: "128k"
			});
			if (customRes && typeof customRes === "string" && customRes.startsWith("http")) return customRes;
			if (customRes && customRes.url && typeof customRes.url === "string") return customRes.url;
		} catch (err) {
			console.warn("UserApi invoke failed:", err);
		}
		if (item.url && /^https?:\/\//.test(item.url)) return item.url;
		const rawId = item.id.replace(/^[a-z]+_/, "");
		if (item.source === "wy" || !item.source) {
			if (/^\d+$/.test(rawId)) return `https://music.163.com/song/media/outer/url?id=${rawId}.mp3`;
		}
		if (item.name) try {
			const matchRes = await searchOnlineMusic(`${item.name} ${item.singer || ""}`.trim(), "wy", 1, 3);
			if (matchRes.list && matchRes.list.length > 0) {
				const best = matchRes.list[0];
				if (!item.pic && best.pic) item.pic = best.pic;
				if (!item.lrc && best.lrc) item.lrc = best.lrc;
				if (best.url) return best.url;
			}
		} catch (e) {
			console.warn("Cross-platform fallback search failed:", e);
		}
		return "";
	}
	/**
	* 解析并抓取第三方在线平台（网易云、QQ音乐等）歌单详情与歌曲列表
	*/
	async function fetchOnlinePlaylistDetail(input) {
		const trimmed = input.trim();
		if (!trimmed) throw new Error("请输入有效的歌单链接或 ID");
		let source = "wy";
		let targetId = trimmed;
		if (/qq\.com|y\.qq/.test(trimmed)) source = "tx";
		else if (/163\.com/.test(trimmed)) source = "wy";
		else if (/kugou\.com/.test(trimmed)) source = "kg";
		const sdk = musicSdk_default[source];
		if (!sdk || !sdk.songList || !sdk.songList.getListDetail) throw new Error(`暂不支持解析该平台歌单: ${source}`);
		let res = await sdk.songList.getListDetail(targetId, 1);
		const detail = res?.promise ? await res.promise : res;
		if (!detail) throw new Error("获取歌单详情失败，可能为私密歌单或链接无效");
		const songs = (Array.isArray(detail.list) ? detail.list : []).map((item) => {
			let pic = item.img || item.pic;
			if (!pic && item.album && typeof item.album === "object") pic = item.album.picUrl;
			return {
				id: `${source}_${item.songmid || item.id || Math.random().toString(36).slice(2)}`,
				name: item.name || "未知曲目",
				singer: item.singer || "群星",
				album: item.albumName || (typeof item.album === "string" ? item.album : item.album?.name) || "单曲",
				interval: item.interval || item.songTime || "03:30",
				pic: pic || "",
				source,
				raw: item
			};
		});
		return {
			id: `${source}_${detail.info?.id || targetId}`,
			name: detail.info?.name || "外部导入歌单",
			source,
			cover: detail.info?.img || songs[0]?.pic || "",
			description: detail.info?.desc || "",
			author: detail.info?.author || "",
			total: detail.total || songs.length,
			songs
		};
	}
	//#endregion
	//#region backend/entry.ts
	Object.assign(globalThis, { async backendCall(action, data, script) {
		if (script) await userApiManager.loadScript(script);
		switch (action) {
			case "validate": return true;
			case "search": return searchOnlineMusic(data.keyword, data.source, data.page, data.limit);
			case "boards": return getOnlineLeaderboards(data.source);
			case "boardSongs": return getLeaderboardSongs(data.bangId, data.source, data.page);
			case "url": return getSongPlayUrl(data);
			case "lyric": return getSongLyric(data);
			case "playlistDetail": return fetchOnlinePlaylistDetail(data.input);
			default: throw new Error(`未知音源操作: ${action}`);
		}
	} });
	//#endregion
})();
