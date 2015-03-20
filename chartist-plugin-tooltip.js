(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function () {
            return (root.returnExportsGlobal = factory());
        });
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        root['Chartist.plugins.tooltip'] = factory();
    }
}(this, function () {

    /**
     * This Chartist tooltip plugin is a modified version of
     * https://github.com/Globegitter/chartist-plugin-tooltip.
     *
     */
    (function (window, document, Chartist, $) {
        'use strict';

        var defaultOptions = {
            currency: '', // Prepend value with something (like: € or $)
            seriesName: true // Show name of series in tooltip.
        };

        Chartist.plugins = Chartist.plugins || {};

        Chartist.plugins.tooltip = function (options) {

            options = Chartist.extend({}, defaultOptions, options);

            return function tooltip(chart) {

                var tooltipSelector = '.ct-point';
                if (chart instanceof Chartist.Bar) {
                    tooltipSelector = '.ct-bar';
                } else if (chart instanceof Chartist.Pie) {
                    tooltipSelector = '.ct-slice';
                }

                var $chart = $(chart.container),
                    $toolTip = $chart
                    .append('<div class="ct-tooltip"></div>')
                    .find('.ct-tooltip')
                    .hide();

                $chart.on('mouseenter', tooltipSelector, function() {
                    var $point = $(this),
                        seriesName = $point.parent().attr('ct:series-name'),
                        tooltipText = '';

                    if (options.seriesName && seriesName) {
                        tooltipText += seriesName + '<br>';
                    }

                    if ($point.attr('ct:meta')) {
                        tooltipText += $point.attr('ct:meta') + '<br>';
                    }

                    var value = $point.attr('ct:value');

                    if (options.currency) {
                        value = options.currency + value.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
                    }
                    tooltipText += value;

                    $toolTip.html(tooltipText).show();
                });

                $chart.on('mouseleave', tooltipSelector, function() {
                    $toolTip.hide();
                });

                $chart.on('mousemove', function(event) {
                    $toolTip.css({
                        left: (event.offsetX || event.originalEvent.layerX) - $toolTip.width() / 2 - 10,
                        top: (event.offsetY || event.originalEvent.layerY) - $toolTip.height() - 40
                    });
                });

            };

        };

    }(window, document, Chartist, $));

    return Chartist.plugins.tooltip;

}));
