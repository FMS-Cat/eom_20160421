#define PI 3.14159265
#define saturate(i) clamp(i,0.,1.)

// ---

precision highp float;

uniform vec2 resolution;
varying float vRot;
varying float vLen;
varying vec2 vChar;

uniform sampler2D textureWord;

// ---

mat2 rotate2D( float _t ) {
  return mat2( cos( _t ), sin( _t ), -sin( _t ), cos( _t ) );
}

vec3 catColor( float _theta ) {
  return vec3(
    sin( _theta ),
    sin( _theta + 2.0 ),
    sin( _theta + 4.0 )
  ) * 0.5 + 0.5;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 cuv = floor( vChar * 16.0 ) / 16.0;
  vec2 puv = rotate2D( vRot ) * ( gl_PointCoord - 0.5 );
  puv = ( puv + 0.5 ) / 16.0;
  float shape = texture2D( textureWord, ( cuv + puv ) * vec2( 1.0, -1.0 ) + vec2( 0.0, 1.0 ) ).x;
  if ( shape < 0.5 ) {
    discard;
  } else {
    float decay = exp( -vLen * 2.0 );
    gl_FragColor = vec4( mix(
      vec3( 1.0 ),
      vec3( 0.0 ),
      decay
    ), 1.0 );
  }
}
