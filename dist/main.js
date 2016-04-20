(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20160421/src/script/glcat.js":[function(require,module,exports){
'use strict';

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

(function () {

	'use strict';

	var GLCat = function () {
		function GLCat(_gl) {
			_classCallCheck(this, GLCat);

			this.gl = _gl;
			var it = this;
			var gl = it.gl;

			gl.enable(gl.DEPTH_TEST);
			gl.depthFunc(gl.LEQUAL);
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

			gl.getExtension('OES_texture_float');
			gl.getExtension('OES_float_linear');
			gl.getExtension('OES_half_float_linear');

			it.program = null;
		}

		_createClass(GLCat, [{
			key: 'createProgram',
			value: function createProgram(_vert, _frag, _onError) {

				var it = this;
				var gl = it.gl;

				var error = void 0;
				if (typeof _onError === 'function') {
					error = _onError;
				} else {
					error = function error(_str) {
						console.error(_str);
					};
				}

				var vert = gl.createShader(gl.VERTEX_SHADER);
				gl.shaderSource(vert, _vert);
				gl.compileShader(vert);
				if (!gl.getShaderParameter(vert, gl.COMPILE_STATUS)) {
					error(gl.getShaderInfoLog(vert));
					return null;
				}

				var frag = gl.createShader(gl.FRAGMENT_SHADER);
				gl.shaderSource(frag, _frag);
				gl.compileShader(frag);
				if (!gl.getShaderParameter(frag, gl.COMPILE_STATUS)) {
					error(gl.getShaderInfoLog(frag));
					return null;
				}

				var program = gl.createProgram();
				gl.attachShader(program, vert);
				gl.attachShader(program, frag);
				gl.linkProgram(program);
				if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
					program.locations = {};
					return program;
				} else {
					error(gl.getProgramInfoLog(program));
					return null;
				}
			}
		}, {
			key: 'useProgram',
			value: function useProgram(_program) {

				var it = this;
				var gl = it.gl;

				gl.useProgram(_program);
				it.program = _program;
			}
		}, {
			key: 'createVertexbuffer',
			value: function createVertexbuffer(_array) {

				var it = this;
				var gl = it.gl;

				var buffer = gl.createBuffer();

				gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_array), gl.STATIC_DRAW);
				gl.bindBuffer(gl.ARRAY_BUFFER, null);

				buffer.length = _array.length;
				return buffer;
			}
		}, {
			key: 'createIndexbuffer',
			value: function createIndexbuffer(_array) {

				var it = this;
				var gl = it.gl;

				var buffer = gl.createBuffer();

				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(_array), gl.STATIC_DRAW);
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

				buffer.length = _array.length;
				return buffer;
			}
		}, {
			key: 'attribute',
			value: function attribute(_name, _buffer, _stride) {

				var it = this;
				var gl = it.gl;

				var location = void 0;
				if (it.program.locations[_name]) {
					location = it.program.locations[_name];
				} else {
					location = gl.getAttribLocation(it.program, _name);
					it.program.locations[_name] = location;
				}

				gl.bindBuffer(gl.ARRAY_BUFFER, _buffer);
				gl.enableVertexAttribArray(location);
				gl.vertexAttribPointer(location, _stride, gl.FLOAT, false, 0, 0);

				gl.bindBuffer(gl.ARRAY_BUFFER, null);
			}
		}, {
			key: 'getUniformLocation',
			value: function getUniformLocation(_name) {

				var it = this;
				var gl = it.gl;

				var location = void 0;

				if (it.program.locations[_name]) {
					location = it.program.locations[_name];
				} else {
					location = gl.getUniformLocation(it.program, _name);
					it.program.locations[_name] = location;
				}

				return location;
			}
		}, {
			key: 'uniform1i',
			value: function uniform1i(_name, _value) {

				var it = this;
				var gl = it.gl;

				var location = it.getUniformLocation(_name);
				gl.uniform1i(location, _value);
			}
		}, {
			key: 'uniform1f',
			value: function uniform1f(_name, _value) {

				var it = this;
				var gl = it.gl;

				var location = it.getUniformLocation(_name);
				gl.uniform1f(location, _value);
			}
		}, {
			key: 'uniform2fv',
			value: function uniform2fv(_name, _value) {

				var it = this;
				var gl = it.gl;

				var location = it.getUniformLocation(_name);
				gl.uniform2fv(location, _value);
			}
		}, {
			key: 'uniform3fv',
			value: function uniform3fv(_name, _value) {

				var it = this;
				var gl = it.gl;

				var location = it.getUniformLocation(_name);
				gl.uniform3fv(location, _value);
			}
		}, {
			key: 'uniformCubemap',
			value: function uniformCubemap(_name, _texture, _number) {

				var it = this;
				var gl = it.gl;

				var location = it.getUniformLocation(_name);
				gl.activeTexture(gl.TEXTURE0 + _number);
				gl.bindTexture(gl.TEXTURE_CUBE_MAP, _texture);
				gl.uniform1i(location, _number);
			}
		}, {
			key: 'uniformTexture',
			value: function uniformTexture(_name, _texture, _number) {

				var it = this;
				var gl = it.gl;

				var location = it.getUniformLocation(_name);
				gl.activeTexture(gl.TEXTURE0 + _number);
				gl.bindTexture(gl.TEXTURE_2D, _texture);
				gl.uniform1i(location, _number);
			}
		}, {
			key: 'createTexture',
			value: function createTexture() {

				var it = this;
				var gl = it.gl;

				var texture = gl.createTexture();
				gl.bindTexture(gl.TEXTURE_2D, texture);
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.bindTexture(gl.TEXTURE_2D, null);

				return texture;
			}
		}, {
			key: 'textureFilter',
			value: function textureFilter(_texture, _filter) {

				var it = this;
				var gl = it.gl;

				gl.bindTexture(gl.TEXTURE_2D, _texture);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, _filter);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, _filter);
				gl.bindTexture(gl.TEXTURE_2D, null);
			}
		}, {
			key: 'textureWrap',
			value: function textureWrap(_texture, _wrap) {

				var it = this;
				var gl = it.gl;

				gl.bindTexture(gl.TEXTURE_2D, _texture);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, _wrap);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, _wrap);
				gl.bindTexture(gl.TEXTURE_2D, null);
			}
		}, {
			key: 'setTexture',
			value: function setTexture(_texture, _image) {

				var it = this;
				var gl = it.gl;

				gl.bindTexture(gl.TEXTURE_2D, _texture);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, _image);
				gl.bindTexture(gl.TEXTURE_2D, null);
			}
		}, {
			key: 'setTextureFromArray',
			value: function setTextureFromArray(_texture, _width, _height, _array) {

				var it = this;
				var gl = it.gl;

				gl.bindTexture(gl.TEXTURE_2D, _texture);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(_array));
				gl.bindTexture(gl.TEXTURE_2D, null);
			}
		}, {
			key: 'setTextureFromFloatArray',
			value: function setTextureFromFloatArray(_texture, _width, _height, _array) {

				var it = this;
				var gl = it.gl;

				gl.bindTexture(gl.TEXTURE_2D, _texture);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.FLOAT, new Float32Array(_array));
				gl.bindTexture(gl.TEXTURE_2D, null);
			}
		}, {
			key: 'copyTexture',
			value: function copyTexture(_texture, _width, _height) {

				var it = this;
				var gl = it.gl;

				gl.bindTexture(gl.TEXTURE_2D, _texture);
				gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, _width, _height, 0);
				gl.bindTexture(gl.TEXTURE_2D, null);
			}
		}, {
			key: 'createCubemap',
			value: function createCubemap(_arrayOfImage) {

				var it = this;
				var gl = it.gl;

				// order : X+, X-, Y+, Y-, Z+, Z-
				var texture = gl.createTexture();

				gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
				for (var i = 0; i < 6; i++) {
					gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, _arrayOfImage[i]);
				}
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
				gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

				return texture;
			}
		}, {
			key: 'createFramebuffer',
			value: function createFramebuffer(_width, _height) {

				var it = this;
				var gl = it.gl;

				var framebuffer = gl.createFramebuffer();
				gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

				framebuffer.depth = gl.createRenderbuffer();
				gl.bindRenderbuffer(gl.RENDERBUFFER, framebuffer.depth);
				gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _width, _height);
				gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, framebuffer.depth);

				framebuffer.texture = it.createTexture();
				gl.bindTexture(gl.TEXTURE_2D, framebuffer.texture);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
				gl.bindTexture(gl.TEXTURE_2D, null);

				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, framebuffer.texture, 0);
				gl.bindFramebuffer(gl.FRAMEBUFFER, null);

				return framebuffer;
			}
		}, {
			key: 'createFloatFramebuffer',
			value: function createFloatFramebuffer(_width, _height) {

				var it = this;
				var gl = it.gl;

				var framebuffer = gl.createFramebuffer();
				gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

				framebuffer.depth = gl.createRenderbuffer();
				gl.bindRenderbuffer(gl.RENDERBUFFER, framebuffer.depth);
				gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _width, _height);
				gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, framebuffer.depth);

				framebuffer.texture = it.createTexture();
				gl.bindTexture(gl.TEXTURE_2D, framebuffer.texture);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.FLOAT, null);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
				gl.bindTexture(gl.TEXTURE_2D, null);

				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, framebuffer.texture, 0);
				gl.bindFramebuffer(gl.FRAMEBUFFER, null);

				return framebuffer;
			}
		}, {
			key: 'clear',
			value: function clear(_r, _g, _b, _a, _d) {

				var it = this;
				var gl = it.gl;

				var r = _r || 0.0;
				var g = _g || 0.0;
				var b = _b || 0.0;
				var a = typeof _a === 'number' ? _a : 1.0;
				var d = typeof _d === 'number' ? _d : 1.0;

				gl.clearColor(r, g, b, a);
				gl.clearDepth(d);
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			}
		}]);

		return GLCat;
	}();

	if (typeof window !== 'undefined') {
		window.GLCat = GLCat;
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = GLCat;
	}
})();

},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20160421/src/script/main.js":[function(require,module,exports){
'use strict';

(function () {

  'use strict';

  var xorshift = require('./xorshift');
  xorshift(5000007);

  
  var GLCat = require('./glcat');

  // ---

  var clamp = function clamp(_value, _min, _max) {
    return Math.min(Math.max(_value, _min), _max);
  };

  var saturate = function saturate(_value) {
    return clamp(_value, 0.0, 1.0);
  };

  // ---

  var wordSpriteCanvas = require('./word-sprite');

  // ---

  var width = canvas.width = 300;
  var height = canvas.height = 300;
  var gl = canvas.getContext('webgl');
  var glCat = new GLCat(gl);

  var vboQuad = glCat.createVertexbuffer([-1, -1, 1, -1, -1, 1, 1, 1]);

  var vertQuad = "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n";
  var fragReturn = "precision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\nuniform sampler2D texture;\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  gl_FragColor = texture2D( texture, uv );\n}\n";
  var programReturn = glCat.createProgram(vertQuad, fragReturn);
  var framebufferRender = glCat.createFloatFramebuffer(width, height);

  var particleCountSqrt = 48;
  var particleCount = particleCountSqrt * particleCountSqrt;
  var framebufferParticleCompute = glCat.createFloatFramebuffer(particleCountSqrt * 4.0, particleCountSqrt);
  var framebufferParticleComputeReturn = glCat.createFloatFramebuffer(particleCountSqrt * 4.0, particleCountSqrt);
  var fragParticleCompute = "#define PI 3.14159265\n#define V vec2(0.,1.)\n#define saturate(i) clamp(i,0.,1.)\n\n// ---\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform float time;\nuniform float particleCountSqrt;\nuniform bool frameZero;\nuniform float deltaTime;\n\nuniform sampler2D textureParticle;\nuniform sampler2D textureRandom;\n\n// ---\n\nmat2 rotate2D( float _t ) {\n  return mat2( cos( _t ), sin( _t ), -sin( _t ), cos( _t ) );\n}\n\nvec3 rotateEuler( vec3 _p, vec3 _r ) {\n  vec3 p = _p;\n  p.yz = rotate2D( _r.x ) * p.yz;\n  p.zx = rotate2D( _r.y ) * p.zx;\n  p.xy = rotate2D( _r.z ) * p.xy;\n  return p;\n}\n\n// ---\n\nvoid main() {\n  vec2 reso = vec2( 4.0, 1.0 ) * particleCountSqrt;\n\n  float type = mod( floor( gl_FragCoord.x ), 4.0 );\n\n  vec3 pos = texture2D( textureParticle, ( gl_FragCoord.xy + vec2( 0.0 - type, 0.0 ) ) / reso ).xyz;\n  vec3 vel = texture2D( textureParticle, ( gl_FragCoord.xy + vec2( 1.0 - type, 0.0 ) ) / reso ).xyz;\n  vec3 rot = texture2D( textureParticle, ( gl_FragCoord.xy + vec2( 2.0 - type, 0.0 ) ) / reso ).xyz;\n  vec3 life = texture2D( textureParticle, ( gl_FragCoord.xy + vec2( 3.0 - type, 0.0 ) ) / reso ).xyz;\n\n  vec3 posI = texture2D( textureRandom, ( gl_FragCoord.xy + vec2( 0.0 - type, 0.0 ) ) / reso ).xyz;\n  vec3 velI = texture2D( textureRandom, ( gl_FragCoord.xy + vec2( 1.0 - type, 0.0 ) ) / reso ).xyz;\n  vec3 rotI = texture2D( textureRandom, ( gl_FragCoord.xy + vec2( 2.0 - type, 0.0 ) ) / reso ).xyz;\n  vec3 lifeI = texture2D( textureRandom, ( gl_FragCoord.xy + vec2( 3.0 - type, 0.0 ) ) / reso ).xyz;\n\n  vec3 colDef = vec3( 0.3, 0.6, 1.0 );\n\n  if ( frameZero || 0.99 < life.x ) {\n    pos = ( posI - 0.5 ) * 0.0;\n    pos.y = 1.5;\n\n    vel = ( velI - 0.5 ) * 1.7;\n\n    rot = rotI - 0.5;\n    rotI.x *= 0.1;\n\n    life = lifeI;\n  }\n\n  vel *= exp( -deltaTime * 1.0 );\n\n  vel.y -= 1.3 * deltaTime;\n  pos += vel * deltaTime;\n\n  pos.zx = rotate2D( -deltaTime * 0.7 ) * pos.zx;\n  vel.zx = rotate2D( -deltaTime * 0.7 ) * vel.zx;\n\n  rot.x += 0.1 * rot.y * deltaTime;\n\n  life.x = mod( lifeI.x - time * 1.0 + 1.0, 1.0 );\n\n  vec3 ret;\n  if ( type == 0.0 ) {\n    ret = pos;\n  } else if ( type == 1.0 ) {\n    ret = vel;\n  } else if ( type == 2.0 ) {\n    ret = rot;\n  } else if ( type == 3.0 ) {\n    ret = life;\n  }\n\n  gl_FragColor = vec4( ret, 1.0 );\n}\n";
  var programParticleCompute = glCat.createProgram(vertQuad, fragParticleCompute);

  var framebufferMotionblur = glCat.createFloatFramebuffer(width, height);
  var framebufferMotionblurReturn = glCat.createFloatFramebuffer(width, height);
  var fragMotionblur = "precision highp float;\n#define GLSLIFY 1\n\nuniform bool init;\nuniform float add;\nuniform vec2 resolution;\nuniform sampler2D renderTexture;\nuniform sampler2D blurTexture;\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  vec3 ret = texture2D( renderTexture, uv ).xyz * add;\n  if ( !init ) {\n    ret += texture2D( blurTexture, uv ).xyz;\n  }\n  gl_FragColor = vec4( ret, 1.0 );\n}\n";
  var programMotionblur = glCat.createProgram(vertQuad, fragMotionblur);

  var fragPost = "#define PI 3.14159265\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\nuniform sampler2D texture;\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  float tex = texture2D( texture, uv ).x;\n\n  tex = pow( tex, 4.0 );\n  tex *= 1.0 - length( uv - 0.5 ) * 0.2;\n\n  gl_FragColor = vec4( mix(\n    vec3(\n      pow( tex, 1.0 ),\n      pow( tex, 0.5 ),\n      pow( tex, 0.25 )\n    ),\n    vec3(\n      pow( tex, 0.5 ),\n      pow( tex, 1.0 ),\n      pow( tex, 2.0 )\n    ),\n    tex\n  ), 1.0 );\n}\n";
  var programPost = glCat.createProgram(vertQuad, fragPost);

  var vboParticle = glCat.createVertexbuffer(function () {
    var a = [];
    for (var iy = 0; iy < particleCountSqrt; iy++) {
      for (var ix = 0; ix < particleCountSqrt; ix++) {
        a.push(ix);
        a.push(iy);
      }
    }
    return a;
  }());
  var framebufferParticleRender = glCat.createFloatFramebuffer(width, height);
  var vertParticleRender = "#define GLSLIFY 1\n#define PI 3.14159265\n#define V vec2(0.,1.)\n\n// ---\n\nattribute vec2 uv;\n\nvarying float vRot;\nvarying float vLen;\nvarying vec2 vChar;\n\nuniform float time;\nuniform vec2 resolution;\nuniform float particleCountSqrt;\nuniform vec3 u_cameraPos;\n\nuniform sampler2D textureParticle;\n\n// ---\n\nmat4 lookAt( vec3 _pos, vec3 _tar, vec3 _air ) {\n  vec3 dir = normalize( _tar - _pos );\n  vec3 sid = normalize( cross( dir, _air ) );\n  vec3 top = normalize( cross( sid, dir ) );\n  return mat4(\n    sid.x, top.x, dir.x, 0.0,\n    sid.y, top.y, dir.y, 0.0,\n    sid.z, top.z, dir.z, 0.0,\n    - sid.x * _pos.x - sid.y * _pos.y - sid.z * _pos.z,\n    - top.x * _pos.x - top.y * _pos.y - top.z * _pos.z,\n    - dir.x * _pos.x - dir.y * _pos.y - dir.z * _pos.z,\n    1.0\n  );\n}\n\nmat4 perspective( float _fov, float _aspect, float _near, float _far ) {\n  float p = 1.0 / tan( _fov * PI / 180.0 / 2.0 );\n  float d = _far / ( _far - _near );\n  return mat4(\n    p / _aspect, 0.0, 0.0, 0.0,\n    0.0, p, 0.0, 0.0,\n    0.0, 0.0, d, 1.0,\n    0.0, 0.0, -_near * d, 0.0\n  );\n}\n\nmat2 rotate( float _theta ) {\n  return mat2( cos( _theta ), sin( _theta ), -sin( _theta ), cos( _theta ) );\n}\n\n// ---\n\nvoid main() {\n  vec3 pos = texture2D( textureParticle, ( uv.xy * vec2( 4.0, 1.0 ) + vec2( 0.5, 0.5 ) ) / vec2( 4.0, 1.0 ) / particleCountSqrt ).xyz;\n  vec3 vel = texture2D( textureParticle, ( uv.xy * vec2( 4.0, 1.0 ) + vec2( 1.5, 0.5 ) ) / vec2( 4.0, 1.0 ) / particleCountSqrt ).xyz;\n  vec3 rot = texture2D( textureParticle, ( uv.xy * vec2( 4.0, 1.0 ) + vec2( 2.5, 0.5 ) ) / vec2( 4.0, 1.0 ) / particleCountSqrt ).xyz;\n  vec3 life = texture2D( textureParticle, ( uv.xy * vec2( 4.0, 1.0 ) + vec2( 3.5, 0.5 ) ) / vec2( 4.0, 1.0 ) / particleCountSqrt ).xyz;\n\n  mat4 matP = perspective( 90.0, resolution.x / resolution.y, 0.01, 100.0 );\n\n  vec3 cameraPos = u_cameraPos;\n  mat4 matV = lookAt( cameraPos, vec3( 0.0, 0.0, 0.0 ), vec3( 0.0, 1.0, 0.0 ) );\n\n  gl_Position = matP * matV * vec4( pos, 1.0 );\n  gl_PointSize = 32.0 / gl_Position.z;\n\n  vRot = rot.x;\n  vLen = length( cameraPos - pos );\n  vChar = life.yz;\n}\n";
  var fragParticleRender = "#define PI 3.14159265\n#define saturate(i) clamp(i,0.,1.)\n\n// ---\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\nvarying float vRot;\nvarying float vLen;\nvarying vec2 vChar;\n\nuniform sampler2D textureWord;\n\n// ---\n\nmat2 rotate2D( float _t ) {\n  return mat2( cos( _t ), sin( _t ), -sin( _t ), cos( _t ) );\n}\n\nvec3 catColor( float _theta ) {\n  return vec3(\n    sin( _theta ),\n    sin( _theta + 2.0 ),\n    sin( _theta + 4.0 )\n  ) * 0.5 + 0.5;\n}\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  vec2 cuv = floor( vChar * 16.0 ) / 16.0;\n  vec2 puv = rotate2D( vRot ) * ( gl_PointCoord - 0.5 );\n  puv = ( puv + 0.5 ) / 16.0;\n  float shape = texture2D( textureWord, ( cuv + puv ) * vec2( 1.0, -1.0 ) + vec2( 0.0, 1.0 ) ).x;\n  if ( shape < 0.5 ) {\n    discard;\n  } else {\n    float decay = exp( -vLen * 2.0 );\n    gl_FragColor = vec4( mix(\n      vec3( 1.0 ),\n      vec3( 0.0 ),\n      decay\n    ), 1.0 );\n  }\n}\n";
  var programParticleRender = glCat.createProgram(vertParticleRender, fragParticleRender);

  var textureRandomSize = 2048;
  var textureRandom = glCat.createTexture();
  glCat.textureWrap(textureRandom, gl.REPEAT);
  glCat.setTextureFromFloatArray(textureRandom, 2048, 2048, function () {
    var len = 2048 * 2048 * 4;
    var ret = new Float32Array(len);
    for (var i = 0; i < len; i++) {
      ret[i] = xorshift();
    }
    return ret;
  }());

  var textureWord = glCat.createTexture();
  glCat.setTexture(textureWord, wordSpriteCanvas);

  // ---

  var frame = 0;
  var frames = 130;
  var blurSample = 40;
  var time = 0.0;

  // ---

  var cameraPos = [0.0, 0.0, 1.0];

  // ---

  var computeParticle = function computeParticle(_target, _deltaTime) {

    gl.viewport(0, 0, particleCountSqrt * 4.0, particleCountSqrt);
    glCat.useProgram(programParticleCompute);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebufferParticleComputeReturn);
    glCat.clear(0.0, 0.0, 0.0, 0.0);

    glCat.attribute('p', vboQuad, 2);

    glCat.uniform1f('time', time);
    glCat.uniform1f('particleCountSqrt', particleCountSqrt);
    glCat.uniform1i('frameZero', frame === 0);
    glCat.uniform1f('deltaTime', _deltaTime);

    glCat.uniformTexture('textureRandom', textureRandom, 0);
    glCat.uniformTexture('textureParticle', framebufferParticleCompute.texture, 1);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // ---

    gl.viewport(0, 0, particleCountSqrt * 4.0, particleCountSqrt);
    glCat.useProgram(programReturn);
    gl.bindFramebuffer(gl.FRAMEBUFFER, _target);
    glCat.clear(0.0, 0.0, 0.0, 0.0);

    glCat.attribute('p', vboQuad, 2);

    glCat.uniform2fv('resolution', [particleCountSqrt * 4.0, particleCountSqrt]);

    glCat.uniformTexture('texture', framebufferParticleComputeReturn.texture, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  // ---

  var renderParticle = function renderParticle(_compute, _target) {

    gl.viewport(0, 0, width, height);
    glCat.useProgram(programParticleRender);
    gl.bindFramebuffer(gl.FRAMEBUFFER, _target);
    glCat.clear(1.0, 1.0, 1.0);

    glCat.attribute('uv', vboParticle, 2);

    glCat.uniform1f('time', time);
    glCat.uniform1f('particleCountSqrt', particleCountSqrt);
    glCat.uniform2fv('resolution', [width, height]);
    glCat.uniform3fv('u_cameraPos', cameraPos);

    glCat.uniformTexture('textureParticle', _compute, 0);
    glCat.uniformTexture('textureWord', textureWord, 1);

    gl.drawArrays(gl.POINTS, 0, particleCount);
  };

  // ---

  var render = function render(_target, _deltaTime) {

    computeParticle(framebufferParticleCompute, _deltaTime);
    renderParticle(framebufferParticleCompute.texture, _target);

    gl.flush();
  };

  // ---

  var motionblur = function motionblur(_texture, _target, _blurCount) {

    gl.viewport(0, 0, width, height);
    glCat.useProgram(programMotionblur);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebufferMotionblurReturn);
    glCat.clear();

    glCat.attribute('p', vboQuad, 2);
    glCat.uniform1f('add', 1.0 / blurSample);
    glCat.uniform1i('init', _blurCount === 0);
    glCat.uniform2fv('resolution', [width, height]);
    glCat.uniformTexture('renderTexture', _texture, 0);
    glCat.uniformTexture('blurTexture', framebufferMotionblur.texture, 1);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // ------

    gl.viewport(0, 0, width, height);
    glCat.useProgram(programReturn);
    gl.bindFramebuffer(gl.FRAMEBUFFER, _target);
    glCat.clear();

    glCat.attribute('p', vboQuad, 2);
    glCat.uniform2fv('resolution', [width, height]);
    glCat.uniformTexture('texture', framebufferMotionblurReturn.texture, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  // ---

  var post = function post(_input, _target) {

    gl.viewport(0, 0, width, height);
    glCat.useProgram(programPost);
    gl.bindFramebuffer(gl.FRAMEBUFFER, _target);
    glCat.clear();

    glCat.attribute('p', vboQuad, 2);

    glCat.uniform1f('time', time);
    glCat.uniform2fv('resolution', [width, height]);

    glCat.uniformTexture('texture', _input, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  // ---

  var renderA = document.createElement('a');

  var saveFrame = function saveFrame() {
    renderA.href = canvas.toDataURL();
    renderA.download = ('0000' + frame).slice(-5) + '.png';
    renderA.click();
  };

  // ---

  var update = function update() {

    if (checkboxBlur.checked) {
      for (var i = 0; i < blurSample; i++) {
        var timePrev = time;
        time += 1.0 / blurSample / frames * (1.0 + 0.9 * Math.sin(frame / frames * Math.PI * 4.0));
        var deltaTime = time - timePrev;

        render(framebufferRender, deltaTime * 4.0);
        motionblur(framebufferRender.texture, framebufferMotionblur, i);
      }
      post(framebufferMotionblur.texture, null);
    } else {
      var _timePrev = time;
      time += 1.0 / frames * (1.0 + 0.9 * Math.sin(frame / frames * Math.PI * 4.0));
      var _deltaTime2 = time - _timePrev;

      render(framebufferRender, _deltaTime2 * 4.0);
      post(framebufferRender.texture, null);
    }

    if (checkboxSave.checked && frames <= frame) {
      saveFrame();
    }

    frame++;
    if (frame % frames === 0) {}

    requestAnimationFrame(update);
  };
  update();

  button.onclick = function () {
    update();
  };
})();

},{"./glcat":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20160421/src/script/glcat.js","./word-sprite":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20160421/src/script/word-sprite.js","./xorshift":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20160421/src/script/xorshift.js"}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20160421/src/script/word-sprite.js":[function(require,module,exports){
'use strict';

(function () {

  var canvas = document.createElement('canvas');
  var canvasSize = 2048;
  canvas.width = canvasSize;
  canvas.height = canvasSize;

  var context = canvas.getContext('2d');
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = '900 ' + canvasSize / 24.0 + 'px Times New Roman';

  context.fillStyle = '#000';
  context.fillRect(0, 0, canvasSize, canvasSize);

  for (var iy = 0; iy < 16; iy++) {
    for (var ix = 0; ix < 16; ix++) {
      var code = ix + iy * 16;
      var char = String.fromCharCode(code);
      context.fillStyle = '#fff';
      context.fillText(char, (ix + 0.5) * canvasSize / 16, (iy + 0.5) * canvasSize / 16);
    }
  }

  module.exports = canvas;
})();

},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20160421/src/script/xorshift.js":[function(require,module,exports){
"use strict";

(function () {

  var seed = void 0;
  var xorshift = function xorshift(_seed) {
    seed = _seed || seed || 1;
    seed = seed ^ seed << 13;
    seed = seed ^ seed >>> 17;
    seed = seed ^ seed << 5;
    return seed / Math.pow(2, 32) + 0.5;
  };

  module.exports = xorshift;
})();

},{}]},{},["/Users/Yutaka/Dropbox/pro/_Projects/_eom/20160421/src/script/main.js"]);
