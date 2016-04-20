#define PI 3.14159265
#define V vec2(0.,1.)
#define saturate(i) clamp(i,0.,1.)

// ---

precision highp float;

uniform float time;
uniform float particleCountSqrt;
uniform bool frameZero;
uniform float deltaTime;

uniform sampler2D textureParticle;
uniform sampler2D textureRandom;

// ---

mat2 rotate2D( float _t ) {
  return mat2( cos( _t ), sin( _t ), -sin( _t ), cos( _t ) );
}

vec3 rotateEuler( vec3 _p, vec3 _r ) {
  vec3 p = _p;
  p.yz = rotate2D( _r.x ) * p.yz;
  p.zx = rotate2D( _r.y ) * p.zx;
  p.xy = rotate2D( _r.z ) * p.xy;
  return p;
}

// ---

void main() {
  vec2 reso = vec2( 4.0, 1.0 ) * particleCountSqrt;

  float type = mod( floor( gl_FragCoord.x ), 4.0 );

  vec3 pos = texture2D( textureParticle, ( gl_FragCoord.xy + vec2( 0.0 - type, 0.0 ) ) / reso ).xyz;
  vec3 vel = texture2D( textureParticle, ( gl_FragCoord.xy + vec2( 1.0 - type, 0.0 ) ) / reso ).xyz;
  vec3 rot = texture2D( textureParticle, ( gl_FragCoord.xy + vec2( 2.0 - type, 0.0 ) ) / reso ).xyz;
  vec3 life = texture2D( textureParticle, ( gl_FragCoord.xy + vec2( 3.0 - type, 0.0 ) ) / reso ).xyz;

  vec3 posI = texture2D( textureRandom, ( gl_FragCoord.xy + vec2( 0.0 - type, 0.0 ) ) / reso ).xyz;
  vec3 velI = texture2D( textureRandom, ( gl_FragCoord.xy + vec2( 1.0 - type, 0.0 ) ) / reso ).xyz;
  vec3 rotI = texture2D( textureRandom, ( gl_FragCoord.xy + vec2( 2.0 - type, 0.0 ) ) / reso ).xyz;
  vec3 lifeI = texture2D( textureRandom, ( gl_FragCoord.xy + vec2( 3.0 - type, 0.0 ) ) / reso ).xyz;

  vec3 colDef = vec3( 0.3, 0.6, 1.0 );

  if ( frameZero || 0.99 < life.x ) {
    pos = ( posI - 0.5 ) * 0.0;
    pos.y = 1.5;

    vel = ( velI - 0.5 ) * 1.7;

    rot = rotI - 0.5;
    rotI.x *= 0.1;

    life = lifeI;
  }

  vel *= exp( -deltaTime * 1.0 );

  vel.y -= 1.3 * deltaTime;
  pos += vel * deltaTime;

  pos.zx = rotate2D( -deltaTime * 0.7 ) * pos.zx;
  vel.zx = rotate2D( -deltaTime * 0.7 ) * vel.zx;

  rot.x += 0.1 * rot.y * deltaTime;

  life.x = mod( lifeI.x - time * 1.0 + 1.0, 1.0 );

  vec3 ret;
  if ( type == 0.0 ) {
    ret = pos;
  } else if ( type == 1.0 ) {
    ret = vel;
  } else if ( type == 2.0 ) {
    ret = rot;
  } else if ( type == 3.0 ) {
    ret = life;
  }

  gl_FragColor = vec4( ret, 1.0 );
}
