/*
 * TiltChromeUI.js - UI implementation for the visualization
 * version 0.1
 *
 * Copyright (c) 2011 Victor Porof
 *
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 *    1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 *
 *    2. Altered source versions must be plainly marked as such, and must not
 *    be misrepresented as being the original software.
 *
 *    3. This notice may not be removed or altered from any source
 *    distribution.
 */
"use strict";

var TiltChrome = TiltChrome || {};
var EXPORTED_SYMBOLS = ["TiltChrome.UI"];

/**
 * UI implementation.
 */
TiltChrome.UI = function() {

  /**
   * Handler for all the user interface elements.
   */
  var ui = null,

  /**
   * The texture containing all the interface elements.
   */
  texture = null,

  /**
   * The background gradient.
   */
  background = null,

  /**
   * The controls information.
   */
  helpPopup = null,

  /**
   * The top-right menu buttons.
   */
  optionsButton = null,
  exportButton = null,
  helpButton = null,
  exitButton = null,

  /**
   * Top-left control items.
   */
  arcballSprite = null,
  eyeButton = null,
  resetButton = null,
  zoomInButton = null,
  zoomOutButton = null,

  /**
   * Middle-left control items.
   */
  viewModeNormalButton = null,
  viewModeWireframeButton = null,
  colorAdjustButton = null,
  colorAdjustPopup = null,

  /**
   * Sliders.
   */
  hueSlider = null,
  saturationSlider = null,
  brightnessSlider = null;

  /**
   * Function called automatically by the visualization at the setup().
   * @param {HTMLCanvasElement} canvas: the canvas element
   */
  this.init = function(canvas) {
    ui = new Tilt.UI();

    texture = new Tilt.Texture("chrome://tilt/skin/tilt-ui.png", {
      minFilter: "nearest",
      magFilter: "nearest"
    });

    texture.onload = function() {
      this.visualization.redraw();
    }.bind(this);

    background = new Tilt.Sprite(texture, [0, 1024 - 256, 256, 256], {
      width: canvas.width,
      height: canvas.height,
      depthTest: true
    });

    var helpPopupSprite = new Tilt.Sprite(texture, [210, 180, 610, 510]);
    helpPopup = new Tilt.Container(helpPopupSprite, {
      background: "#0107",
      hidden: true
    });

    optionsButton = new Tilt.Button(canvas.width - 290, 0,
      new Tilt.Sprite(texture, [942, 0, 77, 38]));

    exportButton = new Tilt.Button(canvas.width - 220, 0,
      new Tilt.Sprite(texture, [942, 40, 70, 38]));

    helpButton = new Tilt.Button(canvas.width - 150, 0,
      new Tilt.Sprite(texture, [942, 80, 55, 38]));

    helpButton.onclick = function(x, y) {
      var helpX = canvas.width / 2 - 305,
        helpY = canvas.height / 2 - 305,
        exitX = canvas.width / 2 + 197,
        exitY = canvas.height / 2 - 218;

      helpPopup.elements[0].x = helpX;
      helpPopup.elements[0].y = helpY;

      var exitButton = new Tilt.Button(exitX, exitY, {
        width: 32,
        height: 32
      }, function() {
        helpPopup.elements[1].destroy();
        helpPopup.elements.pop();
        helpPopup.hidden = true;
      });

      helpPopup.elements[1] = exitButton;
      helpPopup.hidden = false;
    }.bind(this);

    exitButton = new Tilt.Button(canvas.width - 50, 0,
      new Tilt.Sprite(texture, [942, 120, 50, 38]));

    exitButton.onclick = function(x, y) {
      TiltChrome.BrowserOverlay.destroy(true, true);
      TiltChrome.BrowserOverlay.href = null;
    }.bind(this);

    arcballSprite = new Tilt.Sprite(texture, [0, 0, 145, 145], {
      x: 10,
      y: 10
    });

    eyeButton = new Tilt.Button(0, 0,
      new Tilt.Sprite(texture, [0, 147, 42, 42]));

    eyeButton.onclick = function(x, y) {
      if (ui.elements.length === alwaysVisibleElements.length) {
        ui.push(hideableElements);
      }
      else {
        ui.remove(hideableElements);
      }
    }.bind(this);

    resetButton = new Tilt.Button(60, 150,
      new Tilt.Sprite(texture, [0, 190, 42, 42]));

    resetButton.onclick = function(x, y) {
      this.controller.arcball.reset(0.95);
    }.bind(this);

    resetButton.ondblclick = function(x, y) {
      this.controller.arcball.reset(0);
    }.bind(this);

    zoomInButton = new Tilt.Button(100, 150,
      new Tilt.Sprite(texture, [0, 234, 42, 42]));

    zoomInButton.onclick = function(x, y) {
      this.controller.arcball.zoom(200);
    }.bind(this);

    zoomOutButton = new Tilt.Button(20, 150,
      new Tilt.Sprite(texture, [0, 278, 42, 42]));

    zoomOutButton.onclick = function(x, y) {
      this.controller.arcball.zoom(-200);
    }.bind(this);

    viewModeNormalButton = new Tilt.Button(50, 200,
      new Tilt.Sprite(texture, [438, 0, 66, 66]));

    viewModeWireframeButton = new Tilt.Button(50, 200,
      new Tilt.Sprite(texture, [438, 67, 66, 66]));

    colorAdjustButton = new Tilt.Button(50, 260,
      new Tilt.Sprite(texture, [505, 0, 66, 66]));

    var colorAdjustPopupSprite = new Tilt.Sprite(texture, [572, 0, 231, 93], {
      x: 88,
      y: 258
    });
    colorAdjustPopup = new Tilt.Container([colorAdjustPopupSprite], {
      hidden: false
    });

    var sliderSprite = new Tilt.Sprite(texture, [574, 96, 29, 29]);
    hueSlider = new Tilt.Slider(152, 271, 120, sliderSprite);
    saturationSlider = new Tilt.Slider(152, 290, 120, sliderSprite);
    brightnessSlider = new Tilt.Slider(152, 308, 120, sliderSprite);

    var alwaysVisibleElements = [
      background, eyeButton, exitButton
    ];

    var hideableElements = [
      helpPopup, colorAdjustPopup,
      hueSlider, saturationSlider, brightnessSlider,
      arcballSprite, resetButton, zoomInButton, zoomOutButton,
      viewModeNormalButton, colorAdjustButton,
      optionsButton, exportButton, helpButton
    ];

    ui.push(alwaysVisibleElements, hideableElements);
  };

  /**
   * Called automatically by the visualization after each frame in draw().
   * @param {Number} frameDelta: the delta time elapsed between frames
   */
  this.draw = function(frameDelta) {
    ui.draw(frameDelta);
  };

  /**
   * Delegate mouse down method, handled by the controller.
   *
   * @param {Number} x: the current horizontal coordinate
   * @param {Number} y: the current vertical coordinate
   * @param {Number} button: which mouse button was pressed
   */
  this.mouseDown = function(x, y, button) {
    ui.mouseDown(x, y, button);
  };

  /**
   * Delegate mouse up method, handled by the controller.
   *
   * @param {Number} x: the current horizontal coordinate
   * @param {Number} y: the current vertical coordinate
   * @param {Number} button: which mouse button was released
   */
  this.mouseUp = function(x, y, button) {
    ui.mouseUp(x, y, button);
  };

  /**
   * Delegate click method, handled by the controller.
   *
   * @param {Number} x: the current horizontal coordinate
   * @param {Number} y: the current vertical coordinate
   */
  this.click = function(x, y) {
    ui.click(x, y);
  };

  /**
   * Delegate double click method, handled by the controller.
   *
   * @param {Number} x: the current horizontal coordinate
   * @param {Number} y: the current vertical coordinate
   */
  this.doubleClick = function(x, y) {
    ui.doubleClick(x, y);
  };

  /**
   * Delegate mouse move method, handled by the controller.
   *
   * @param {Number} x: the current horizontal coordinate
   * @param {Number} y: the current vertical coordinate
   */
  this.mouseMove = function(x, y) {
    ui.mouseMove(x, y);
  };

  /**
   * Delegate method, called when the user interface needs to be resized.
   *
   * @param width: the new width of the visualization
   * @param height: the new height of the visualization
   */
  this.resize = function(width, height) {
    background.width = width;
    background.height = height;

    optionsButton.x = width - 320;
    exportButton.x = width - 240;
    helpButton.x = width - 160;
    exitButton.x = width - 50;
  };

  /**
   * Destroys this object and sets all members to null.
   */
  this.destroy = function(canvas) {
    try {
      ui.destroy();
      ui = null;
    }
    catch(e) {}

    texture = null;
    background = null;

    helpPopup = null;
    optionsButton = null;
    exportButton = null;
    helpButton = null;
    exitButton = null;

    arcballSprite = null;
    eyeButton = null;
    resetButton = null;
    zoomInButton = null;
    zoomOutButton = null;

    viewModeNormalButton = null;
    viewModeWireframeButton = null;
    colorAdjustButton = null;
    colorAdjustPopup = null;

    Tilt.destroyObject(this);
  };
};
