( function() {

  'use strict';

  let xorshift = require( './xorshift' );
  xorshift( 5000007 );

  let glslify = require( 'glslify' );
  let GLCat = require( './glcat' );

  // ---

  let clamp = function( _value, _min, _max ) {
    return Math.min( Math.max( _value, _min ), _max );
  };

  let saturate = function( _value ) {
    return clamp( _value, 0.0, 1.0 );
  };

  // ---

  let wordSpriteCanvas = require( './word-sprite' );

  // ---

  let width = canvas.width = 300;
  let height = canvas.height = 300;
  let gl = canvas.getContext( 'webgl' );
  let glCat = new GLCat( gl );

  let vboQuad = glCat.createVertexbuffer( [ -1, -1, 1, -1, -1, 1, 1, 1 ] );

  let vertQuad = glslify( './shader/quad.vert' );
  let fragReturn = glslify( './shader/return.frag' );
  let programReturn = glCat.createProgram( vertQuad, fragReturn );
  let framebufferRender = glCat.createFloatFramebuffer( width, height );

  let particleCountSqrt = 48;
  let particleCount = particleCountSqrt * particleCountSqrt;
  let framebufferParticleCompute = glCat.createFloatFramebuffer( particleCountSqrt * 4.0, particleCountSqrt );
  let framebufferParticleComputeReturn = glCat.createFloatFramebuffer( particleCountSqrt * 4.0, particleCountSqrt );
  let fragParticleCompute = glslify( './shader/particle-compute.frag' );
  let programParticleCompute = glCat.createProgram( vertQuad, fragParticleCompute );

  let framebufferMotionblur = glCat.createFloatFramebuffer( width, height );
  let framebufferMotionblurReturn = glCat.createFloatFramebuffer( width, height );
  let fragMotionblur = glslify( './shader/motionblur.frag' );
  let programMotionblur = glCat.createProgram( vertQuad, fragMotionblur );

  let fragPost = glslify( './shader/post.frag' );
  let programPost = glCat.createProgram( vertQuad, fragPost );

  let vboParticle = glCat.createVertexbuffer( ( function() {
    let a = [];
		for ( let iy = 0; iy < particleCountSqrt; iy ++ ) {
			for ( let ix = 0; ix < particleCountSqrt; ix ++ ) {
				a.push( ix );
				a.push( iy );
			}
		}
		return a;
  } )() );
  let framebufferParticleRender = glCat.createFloatFramebuffer( width, height );
  let vertParticleRender = glslify( './shader/particle-render.vert' );
  let fragParticleRender = glslify( './shader/particle-render.frag' );
  let programParticleRender = glCat.createProgram( vertParticleRender, fragParticleRender );

  let textureRandomSize = 2048;
  let textureRandom = glCat.createTexture();
  glCat.textureWrap( textureRandom, gl.REPEAT );
  glCat.setTextureFromFloatArray( textureRandom, 2048, 2048, ( function() {
    let len = 2048 * 2048 * 4;
    let ret = new Float32Array( len );
    for ( let i = 0; i < len; i ++ ) {
      ret[ i ] = xorshift();
    }
    return ret;
  } )() );

  let textureWord = glCat.createTexture();
  glCat.setTexture( textureWord, wordSpriteCanvas );

  // ---

  let frame = 0;
  let frames = 130;
  let blurSample = 40;
  let time = 0.0;

  // ---

  let cameraPos = [ 0.0, 0.0, 1.0 ];

  // ---

  let computeParticle = function( _target, _deltaTime ) {

    gl.viewport( 0, 0, particleCountSqrt * 4.0, particleCountSqrt );
    glCat.useProgram( programParticleCompute );
    gl.bindFramebuffer( gl.FRAMEBUFFER, framebufferParticleComputeReturn );
    glCat.clear( 0.0, 0.0, 0.0, 0.0 );

    glCat.attribute( 'p', vboQuad, 2 );

    glCat.uniform1f( 'time', time );
    glCat.uniform1f( 'particleCountSqrt', particleCountSqrt );
    glCat.uniform1i( 'frameZero', frame === 0 );
    glCat.uniform1f( 'deltaTime', _deltaTime );

    glCat.uniformTexture( 'textureRandom', textureRandom, 0 );
    glCat.uniformTexture( 'textureParticle', framebufferParticleCompute.texture, 1 );

    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

    // ---

    gl.viewport( 0, 0, particleCountSqrt * 4.0, particleCountSqrt );
    glCat.useProgram( programReturn );
    gl.bindFramebuffer( gl.FRAMEBUFFER, _target );
    glCat.clear( 0.0, 0.0, 0.0, 0.0 );

    glCat.attribute( 'p', vboQuad, 2 );

    glCat.uniform2fv( 'resolution', [ particleCountSqrt * 4.0, particleCountSqrt ] );

    glCat.uniformTexture( 'texture', framebufferParticleComputeReturn.texture, 0 );

    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

  };

  // ---

  let renderParticle = function( _compute, _target ) {

    gl.viewport( 0, 0, width, height );
    glCat.useProgram( programParticleRender );
    gl.bindFramebuffer( gl.FRAMEBUFFER, _target );
    glCat.clear( 1.0, 1.0, 1.0 );

    glCat.attribute( 'uv', vboParticle, 2 );

    glCat.uniform1f( 'time', time );
    glCat.uniform1f( 'particleCountSqrt', particleCountSqrt );
    glCat.uniform2fv( 'resolution', [ width, height ] );
    glCat.uniform3fv( 'u_cameraPos', cameraPos );

    glCat.uniformTexture( 'textureParticle', _compute, 0 );
    glCat.uniformTexture( 'textureWord', textureWord, 1 );

    gl.drawArrays( gl.POINTS, 0, particleCount );

  };

  // ---

  let render = function( _target, _deltaTime ) {

    computeParticle( framebufferParticleCompute, _deltaTime );
    renderParticle( framebufferParticleCompute.texture, _target );

    gl.flush();

  };

  // ---

  let motionblur = function( _texture, _target, _blurCount ) {

    gl.viewport( 0, 0, width, height );
    glCat.useProgram( programMotionblur );
    gl.bindFramebuffer( gl.FRAMEBUFFER, framebufferMotionblurReturn );
    glCat.clear();

    glCat.attribute( 'p', vboQuad, 2 );
    glCat.uniform1f( 'add', 1.0 / blurSample );
    glCat.uniform1i( 'init', _blurCount === 0 );
    glCat.uniform2fv( 'resolution', [ width, height ] );
    glCat.uniformTexture( 'renderTexture', _texture, 0 );
    glCat.uniformTexture( 'blurTexture', framebufferMotionblur.texture, 1 );

    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

    // ------

    gl.viewport( 0, 0, width, height );
    glCat.useProgram( programReturn );
    gl.bindFramebuffer( gl.FRAMEBUFFER, _target );
    glCat.clear();

    glCat.attribute( 'p', vboQuad, 2 );
    glCat.uniform2fv( 'resolution', [ width, height ] );
    glCat.uniformTexture( 'texture', framebufferMotionblurReturn.texture, 0 );

    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

  };

  // ---

  let post = function( _input, _target ) {

    gl.viewport( 0, 0, width, height );
    glCat.useProgram( programPost );
    gl.bindFramebuffer( gl.FRAMEBUFFER, _target );
    glCat.clear();

    glCat.attribute( 'p', vboQuad, 2 );

    glCat.uniform1f( 'time', time );
    glCat.uniform2fv( 'resolution', [ width, height ] );

    glCat.uniformTexture( 'texture', _input, 0 );

    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

  };

  // ---

  let renderA = document.createElement( 'a' );

  let saveFrame = function() {
    renderA.href = canvas.toDataURL();
    renderA.download = ( '0000' + frame ).slice( -5 ) + '.png';
    renderA.click();
  };

  // ---

  let update = function() {

    if ( checkboxBlur.checked ) {
      for ( let i = 0; i < blurSample; i ++ ) {
        let timePrev = time;
        time += 1.0 / blurSample / frames * ( 1.0 + 0.9 * Math.sin( frame / frames * Math.PI * 4.0 ) );
        let deltaTime = ( time - timePrev );

        render( framebufferRender, deltaTime * 4.0 );
        motionblur(
          framebufferRender.texture,
          framebufferMotionblur,
          i
        );
      }
      post( framebufferMotionblur.texture, null );
    } else {
      let timePrev = time;
      time += 1.0 / frames * ( 1.0 + 0.9 * Math.sin( frame / frames * Math.PI * 4.0 ) );
      let deltaTime = ( time - timePrev );

      render( framebufferRender, deltaTime * 4.0 );
      post( framebufferRender.texture, null );
    }

    if ( checkboxSave.checked && frames <= frame ) {
      saveFrame();
    }

    frame ++;
    if ( frame % frames === 0 ) {
    }

    requestAnimationFrame( update );

  };
  update();

  button.onclick = function() {
    update();
  }

} )();
