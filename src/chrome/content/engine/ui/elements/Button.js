/***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Tilt: A WebGL-based 3D visualization of a webpage.
 *
 * The Initial Developer of the Original Code is Victor Porof.
 * Portions created by the Initial Developer are Copyright (C) 2011
 * the Initial Developer. All Rights Reserved.
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the LGPL or the GPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 ***** END LICENSE BLOCK *****/
"use strict";

var Tilt = Tilt || {};
var EXPORTED_SYMBOLS = ["Tilt.Button"];

/**
 * Button constructor.
 *
 * @param {Tilt.Sprite} sprite: the sprite to be drawn as background
 * @param {Object} properties: additional properties for this object
 *  @param {Boolean} hidden: specifies if this object shouldn't be drawn
 *  @param {Boolean} disabled: specifies if this shouldn't receive events
 *  @param {Number} x: the x position of the object
 *  @param {Number} y: the y position of the object
 *  @param {Number} width: the width of the object
 *  @param {Number} height: the height of the object
 */
Tilt.Button = function(sprite, properties) {

  // intercept this object using a profiler when building in debug mode
  Tilt.Profiler.intercept("Tilt.Button", this);  

  // make sure the properties parameter is a valid object
  properties = properties || {};

  /**
   * Variable specifying if this object shouldn't be drawn.
   */
  this.hidden = properties.hidden || false;

  /**
   * Variable specifying if this object shouldn't be responsive to events.
   */
  this.disabled = properties.disabled || false;

  /**
   * A sprite used as a background for this object.
   */
  this.$sprite = sprite || { $x: -1, $y: -1, $width: -1, $height: -1 };
  this.$sprite.$x = properties.x || this.$sprite.$x;
  this.$sprite.$y = properties.y || this.$sprite.$y;
  this.$sprite.$width = properties.width || this.$sprite.$width;
  this.$sprite.$height = properties.height || this.$sprite.$height;

  /**
   * The bounds of this object (used for clicking and intersections).
   */
  this.$bounds = [
    this.$sprite.$x, this.$sprite.$y,
    this.$sprite.$width, this.$sprite.$height];
};

Tilt.Button.prototype = {

  /**
   * Sets this object's position.
   *
   * @param {Number} x: the x position of the object
   * @param {Number} y: the y position of the object
   */
  setPosition: function(x, y) {
    if ("function" === typeof this.$sprite.setPosition) {
      this.$sprite.setPosition(x, y);
    }
    else {
      this.$sprite.$x = x;
      this.$sprite.$y = y;
    }
    this.$bounds[0] = x;
    this.$bounds[1] = y;
  },

  /**
   * Sets this object's dimensions.
   *
   * @param {Number} width: the width of the object
   * @param {Number} height: the height of the object
   */
  setSize: function(width, height) {
    if ("function" === typeof this.$sprite.setSize) {
      this.$sprite.setSize(width, height);
    }
    else {
      this.$sprite.$width = width;
      this.$sprite.$height = height;
    }
    this.$bounds[2] = width;
    this.$bounds[3] = height;
  },

  /**
   * Updates this object's internal params.
   *
   * @param {Number} frameDelta: the delta time elapsed between frames
   * @param {Tilt.Renderer} tilt: optional, a reference to a Tilt.Renderer
   */
  update: function(frameDelta, tilt) {
  },

  /**
   * Draws this object using the specified internal params.
   *
   * @param {Number} frameDelta: the delta time elapsed between frames
   * @param {Tilt.Renderer} tilt: optional, a reference to a Tilt.Renderer
   */
  draw: function(frameDelta, tilt) {
    tilt = tilt || Tilt.$renderer;

    if ("undefined" !== typeof this.$sprite.$texture) {
      this.$sprite.draw(tilt);
    }
  },

  /**
   * Destroys this object and deletes all members.
   */
  destroy: function() {
    Tilt.destroyObject(this);
  }
};