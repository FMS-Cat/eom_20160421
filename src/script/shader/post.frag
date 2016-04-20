#define PI 3.14159265

precision highp float;

uniform vec2 resolution;
uniform sampler2D texture;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  float tex = texture2D( texture, uv ).x;


  tex = pow( tex, 4.0 );
  tex *= 1.0 - length( uv - 0.5 ) * 0.2;

  gl_FragColor = vec4( mix(
    vec3(
      pow( tex, 1.0 ),
      pow( tex, 0.5 ),
      pow( tex, 0.25 )
    ),
    vec3(
      pow( tex, 0.5 ),
      pow( tex, 1.0 ),
      pow( tex, 2.0 )
    ),
    tex
  ), 1.0 );
}
