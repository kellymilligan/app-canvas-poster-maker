define([

    'lodash',
    'jquery',
    '_baseObject',

    './artwork'

], function(

    _,
    $,
    BaseObject,

    Artwork

) { 'use strict';

    return _.assign( _.create( BaseObject ), {


        WORKBOARD_MARGIN: 50,

        workboardWidth: 0,

        previewWidth: 0,
        previewHeight: 0,

        artworkWidth: 0,
        artworkHeight: 0,

        paperCtx: null,
        artworkCtx: null,

        artwork: null,

        drawConfig: null,

        $paper: null,


        setup: function (options) {

            this.$paper = this.$node.find('.js-workboard__paper');

            var paperCanvas = document.createElement( 'canvas' );
            this.paperCtx = paperCanvas.getContext('2d');
            this.$paper.append( paperCanvas );

            var artworkCanvas = document.createElement( 'canvas' );
            this.artworkCtx = artworkCanvas.getContext('2d');

            this.artwork = this.createChild( Artwork, null, { ctx: this.artworkCtx } );

            this.resize();
        },

        resize: function () {

            // Prep for artwork creation
            var artworkWidth = this.appConfig.selectedPrintConfig.paperSize.WIDTH - this.appConfig.selectedPrintConfig.paperMarginLeft - this.appConfig.selectedPrintConfig.paperMarginRight;
            var artworkHeight = this.appConfig.selectedPrintConfig.paperSize.HEIGHT - this.appConfig.selectedPrintConfig.paperMarginTop - this.appConfig.selectedPrintConfig.paperMarginBottom;

            this.artwork.width = artworkWidth;
            this.artwork.height = artworkHeight;

            // Resize preivew
            this.workboardWidth = this.windowData.width - this.appConfig.CONTROLS_WIDTH;

            this.previewWidth = this.workboardWidth - this.WORKBOARD_MARGIN * 2;
            this.previewHeight = this.previewWidth / 0.707; // TEMP

            this.$paper[0].style.width = this.previewWidth + 'px';
            this.$paper[0].style.height = this.previewHeight + 'px';

            this.$paper[0].style.marginLeft = this.WORKBOARD_MARGIN + 'px';
            this.$paper[0].style.marginRight = this.WORKBOARD_MARGIN + 'px';

            this.$node[0].style.paddingTop = this.WORKBOARD_MARGIN - 6 + 'px';
            this.$node[0].style.paddingBottom = this.WORKBOARD_MARGIN + 'px';

            // Resize paper canvas
            var paperWidth = this.appConfig.selectedPrintConfig.paperSize.WIDTH * this.appConfig.PRINT_RESOLUTION;
            var paperHeight = this.appConfig.selectedPrintConfig.paperSize.HEIGHT * this.appConfig.PRINT_RESOLUTION;

            this.paperCtx.canvas.width = paperWidth;
            this.paperCtx.canvas.height = paperHeight;

            var paperMargins = {
                top: this.appConfig.selectedPrintConfig.paperMarginTop * this.appConfig.PRINT_RESOLUTION,
                bottom: this.appConfig.selectedPrintConfig.paperMarginBottom * this.appConfig.PRINT_RESOLUTION,
                left: this.appConfig.selectedPrintConfig.paperMarginLeft * this.appConfig.PRINT_RESOLUTION,
                right: this.appConfig.selectedPrintConfig.paperMarginRight * this.appConfig.PRINT_RESOLUTION
            };

            // Resize artwork canvas
            var artworkPaperWidth = paperWidth - paperMargins.left - paperMargins.right;
            var artworkPaperHeight = paperHeight - paperMargins.top - paperMargins.bottom;

            this.artworkCtx.canvas.width = artworkPaperWidth;
            this.artworkCtx.canvas.height = artworkPaperHeight;
            this.artworkCtx.scale( this.appConfig.PRINT_RESOLUTION, this.appConfig.PRINT_RESOLUTION );

            // Store draw config
            this.drawConfig = {

                paperWidth: paperWidth,
                paperHeight: paperHeight,
                paperMargins: paperMargins,
                artworkPaperWidth: artworkPaperWidth,
                artworkPaperHeight: artworkPaperHeight
            };
        },

        mouseMove: function () {

        },

        onAnimFrame: function () {

        },

        drawArtwork: function () {

            this.artwork.draw();

            this.paperCtx.fillStyle = '#fff';
            this.paperCtx.fillRect( 0, 0, this.paperCtx.canvas.width, this.paperCtx.canvas.height );

            this.paperCtx.drawImage(
                this.artworkCtx.canvas,
                this.drawConfig.paperMargins.left,
                this.drawConfig.paperMargins.top,
                this.drawConfig.artworkPaperWidth,
                this.drawConfig.artworkPaperHeight
            );
        }

    });

});