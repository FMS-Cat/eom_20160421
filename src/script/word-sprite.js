( function() {

  let canvas = document.createElement( 'canvas' );
  let canvasSize = 2048;
  canvas.width = canvasSize;
  canvas.height = canvasSize;

  let context = canvas.getContext( '2d' );
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = '900 ' + canvasSize / 24.0 + 'px Times New Roman';

  context.fillStyle = '#000';
  context.fillRect( 0, 0, canvasSize, canvasSize );

  for ( let iy = 0; iy < 16; iy ++ ) {
    for ( let ix = 0; ix < 16; ix ++ ) {
      let code = ix + iy * 16;
      let char = String.fromCharCode( code );
      context.fillStyle = '#fff';
      context.fillText(
        char,
        ( ix + 0.5 ) * canvasSize / 16,
        ( iy + 0.5 ) * canvasSize / 16
      );
    }
  }

  module.exports = canvas;

} )();
