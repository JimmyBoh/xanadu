/* eslint-disable */

"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PerlinGrid = function () {
	function PerlinGrid(rng, gradientSize) {
		var _this = this;

		_classCallCheck(this, PerlinGrid);

		this.GX = gradientSize;
		this.GY = gradientSize;
		this.gradientGrid = new Array(this.GX);
		this.rng = rng;

		for(var i = 0; i < _this.GX; i ++){
			_this.gradientGrid[i] = new Array(_this.GY);
			for(var j = 0; j < _this.GY; j ++){
				_this.gradientGrid[i][j] = _this.generateRandomNormal();
			}
		}
		
	}

	_createClass(PerlinGrid, [{
		key: "generateRandomNormal",
		value: function generateRandomNormal() {
			//var theta = rng.floatBetween(0, 2 * Math.PI);
			var rand = Math.floor(rng.floatBetween(0,16));
			
			var theta = rand / 8 * Math.PI;
			
			return { x: Math.cos(theta), y: Math.sin(theta) };
		}
	}, {
		key: "dotProduct",
		value: function dotProduct(pa, pb) {
			return pa.x * pb.x + pa.y * pb.y;
		}
	}, {
		key: "getValueForPoint",
		value: function getValueForPoint(p) {
			var i = Math.floor(p.x);
			var j = Math.floor(p.y);
			var u = p.x - i;
			var v = p.y - j;
			var g00 = this.gradientGrid[i][j];
			var g01 = this.gradientGrid[i][j + 1];
			var g10 = this.gradientGrid[i + 1][j];
			var g11 = this.gradientGrid[i + 1][j + 1];

			var n00 = this.dotProduct(g00, { x: u, y: v });
			var n10 = this.dotProduct(g10, { x: u - 1, y: v });
			var n01 = this.dotProduct(g01, { x: u, y: v - 1 });
			var n11 = this.dotProduct(g11, { x: u - 1, y: v - 1 });

			var f = function f(t) {
				return 6 * Math.pow(t, 5) - 15 * Math.pow(t, 4) + 10 * Math.pow(t, 3);
			};

			var nx0 = n00 * (1 - f(u)) + n10 * f(u);
			var nx1 = n01 * (1 - f(u)) + n11 * f(u);

			return nx0 * (1 - f(v)) + nx1 * f(v);
		}
	}]);

	return PerlinGrid;
}();
