import { _, $, BaseObject } from '../common';

import distance from '../utils/math/distance';
import drawCircle from '../utils/canvas/draw_circle';

export default Object.assign( Object.create( BaseObject ), {


    ctx : null,

    width: 0,
    height: 0,


    setup: function (options) {

        this.ctx = options.config.canvas.getContext( '2d' );
    },

    draw: function () {

        // this.ctx.fillStyle = "rgb(0, 0, 0)";
        // this.ctx.fillRect( 0, 0, this.ctx.canvas.width, this.ctx.canvas.height );

        this.ctx.globalCompositeOperation = 'multiply';
        this.ctx.globalAlpha = 0.3;

        var colours = [
            'rgb(51, 255, 214)',
            'rgb(51, 255, 227)',
            'rgb(51, 232, 255)',
            'rgb(51, 181, 255)'
        ];

        const SEEDS = colours.length;
        var seed = 0;

        var halfWidth = parseInt( this.width * 0.5, 10 );
        var halfHeight = parseInt( this.height * 0.5, 10 );

        for ( seed; seed < SEEDS; seed++ ) {

            this.ctx.fillStyle = colours[ seed ];

            let pX = halfWidth;
            let pY = halfHeight;

            for ( let i = 0; i < 30000; i++ ) {

                let r = Math.random() * 0.1 + 0.25;

                let iteration = this.iterate( pX, pY );

                while ( iteration[ 0 ] === pX || iteration[ 1 ] === pY ) {

                    console.log('extra iteration');
                    iteration = this.iterate( pX, pY );
                }

                pX = iteration[ 0 ];
                pY = iteration[ 1 ];

                // constrain to circle
                let d = distance( halfWidth, halfHeight, iteration[ 0 ], iteration[ 1 ] );
                if ( d > ( this.width - 16 ) * 0.5 ) { continue; }

                drawCircle( this.ctx, iteration[ 0 ], iteration[ 1 ], r );
                this.ctx.fill();
            }

        }
    },

    iterate: function (pX, pY) {

        let spread = 1;
        let boundingMarginX = 1;
        let boundingMarginY = 6;

        let dX = Math.random() > 0.5 ? 1 : -1;
        let dY = Math.random() > 0.5 ? 1 : -1;

        let x = parseInt( Math.min( Math.max( pX + dX * spread, boundingMarginX ), this.width - boundingMarginX ), 10 );
        let y = parseInt( Math.min( Math.max( pY + dY * spread, boundingMarginY ), this.height - boundingMarginY ), 10 );

        return [ x, y ];
    }

});