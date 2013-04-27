;
(function(window, $) {
    'use strict';

    // build a uniq id which is 4 chars long
    var uniqId = function(prefix) {
        prefix = prefix || '';

        return prefix + ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).substr(-4);
    };

    // Build query parameters from a geoname object
    var RequestDataBuilder = function(geo, datas) {
        this.datas = datas || {};

        if (!geo instanceof GeotoCompleter) {
           throw 'You must provide an instance of Geotocompleter';
        }

        if (geo.getOption('sort'))
            this.datas.sort = geo.getOption('sort');
        if (geo.getOption('sortParams'))
            this.datas.sortParams = geo.getOption('sortParams');
        if (geo.getOption('order'))
            this.datas.order = geo.getOption('order');
        if (geo.getOption('country'))
            this.datas.country = geo.getOption('country');
        if (geo.getOption('name'))
            this.datas.name = geo.getOption('name');
        if (geo.getOption('limit'))
            this.datas.limit = geo.getOption('limit');
    };

    RequestDataBuilder.prototype.getRequestDatas = function() {
        return this.datas;
    };

    // Handles request to the remote geoname server
    var RequestManager = function(server) {
        var _request = false;
        var _endpoint = server;

        this.search = function(datas, errorCallback, callback) {
            _request = $.ajax({
                type: "GET",
                dataType: "jsonp",
                jsonpCallback: "callback",
                url: _endpoint + 'city',
                beforeSend: function() {
                    if (_request && typeof _request.abort === 'function') {
                        _request.abort();
                    }
                },
                error: errorCallback,
                data: datas
            })
            .done(callback)
            .always(function() {
                _request = false;
            });
        };
    };

    var GeotoCompleter = function(el, serverEndpoint, options) {
        if (typeof $.ui === 'undefined') {
            throw 'jQuery UI must be loaded';
        }

        if($(el).data('geocompleter')) {
            return $(el).data('geocompleter');
        }

        var _serverEndpoint = serverEndpoint.substr(serverEndpoint.length - 1) === '/' ? serverEndpoint : serverEndpoint + '/';

        this._requestManager = new RequestManager(_serverEndpoint);

        this.$el = $(el);

        this._opts = $.extend({
            name: null,
            sort: null,
            sortParams: null,
            order: null,
            country: null,
            limit: null
        }, options);

        this.$input = null;

        this.$el.data('geocompleter', this);
    };

    GeotoCompleter.prototype.getOption = function(name) {
        if (!name in this._opts)
            return null;

        return this._opts[name];
    };

    GeotoCompleter.prototype.setOption = function(name, value) {
        if (!name in this._opts)
            return this;

        this._opts[name] = value;

        return this;
    };

    GeotoCompleter.prototype.getAutocompleter = function() {
        return this.$input;
    };

    GeotoCompleter.prototype.destroy = function() {
        if (this.$input) {
            this.$input.remove();
            this.$el.show();
            this.$el.data('geocompleter', null);
        }
    };

    GeotoCompleter.prototype.init = function() {
        if (null !== this.$input) {
            return;
        }

        var self = this;

        var updateGeonameField = function(value) {
            self.$el.val(value);
        };

        var updateCityField = function(value) {
            self.$input.val(value);
        };

        var resetGeonameField = function() {
            self.$el.val('');
        };

        var resetCityField = function() {
            self.$input.val('');
        };

        var isGeonameFieldSetted = function() {
            return self.$el.val() !== '';
        };

        var highlight = function (s, t) {
            var matcher = new RegExp("("+$.ui.autocomplete.escapeRegex(t)+")", "ig" );
            return s.replace(matcher, "<span class='highlight'>$1</span>");
        };

        // Create city input
        this.$input = $('<input />')
                .attr('name', uniqId(this.$el.attr('name')))
                .attr('id', uniqId(this.$el.attr('id')))
                .attr('type', 'text');

        // Prevent form submission when pressing ENTER
        this.$input.keypress(function(event) {
            var code = (event.keyCode ? event.keyCode : event.which);
            if(code === $.ui.keyCode.ENTER ) {
                event.preventDefault();
                return false;
            }
        });

        // On any keyup except (esc,up,down, enter) fields are desynchronised, reset geonames field
        this.$input.keyup(function(event) {
            var code = (event.keyCode ? event.keyCode : event.which);
            var unBindKeys = [
                $.ui.keyCode.ESCAPE,
                $.ui.keyCode.UP,
                $.ui.keyCode.DOWN,
                $.ui.keyCode.ENTER
            ];

            if (-1 === $.inArray(code, unBindKeys)){
                resetGeonameField();
            }
        });

        this.$el.hide();
        this.$el.after(this.$input);

        // Override prototype to render values without autoescape, usefull to highlight values
        $.ui.autocomplete.prototype["_renderItem"] = function( ul, item) {
            return $( "<li></li>" )
              .data( "item.autocomplete", item )
              .append( $( "<a></a>" ).html( item.label ) )
              .appendTo( ul );
        };

        // Save response content
        var responseContent;

        // Build a jquery autocompleter
        this.$input.autocomplete({
            source: function(request, response) {
                var name, country, terms;

                terms = request.term.split(',');

                if (terms.length === 2) {
                    country = terms.pop();
                }

                name = terms.pop();

                self.setOption('name', $.trim(name));

                if (country) {
                    self.setOption('country', $.trim(country));
                }

                var requestDataBuilder = new RequestDataBuilder(self);

                self._requestManager.search(
                    requestDataBuilder.getRequestDatas(),
                    function(jqXhr, status, error) {}, function(data) {
                        response($.map(data.geonames.geoname || {}, function(item) {
                            var country = country ? country : name;
                            return {
                                label: highlight(item.title, name) + ", " + highlight(item.country || '', country) + "<span class='region'>" + highlight(item.region || '', name) + "</span>",
                                value: item.title +  (item.country ? ", " + item.country : ''),
                                geonameid: item.geonameid
                            };
                        }));
                    }
                );
            },
            messages: {
                noResults: '',
                results: function() {}
            },
            response: function (event, ui) {
                responseContent = [];

                if (ui.content) {
                    responseContent = ui.content;
                    // Set geoname id if value are re synchronized
                    if (ui.content.length > 0 && ui.content[0].value === self.$input.val()) {
                        updateGeonameField(ui.content[0].geonameid);
                    }
                }
            },
            select: function(event, ui) {
                if (ui.item) {
                    updateGeonameField(ui.item.geonameid);
                }
            },
            focus: function (event, ui) {
                var code = (event.keyCode ? event.keyCode : event.which);
                // Update geoname ID only if key up and key down are pressed
                if (ui.item && -1 !== $.inArray(code, [$.ui.keyCode.DOWN, $.ui.keyCode.UP])) {
                    updateGeonameField(ui.item.geonameid);
                }
            },
            close : function (event, ui) {
                var ev = event.originalEvent;
                var code = (ev.keyCode ? ev.keyCode : ev.which);
                // If esc key is pressed or user leaves the input
                if ((ev.type === "keydown" && code === $.ui.keyCode.ESCAPE) || ev.type === "blur") {
                    if (isGeonameFieldSetted() && responseContent.length > 0) {
                        var geonameId = self.$el.val();
                        // Update city input according to the setted geonameId
                        var responseValue = $.grep(responseContent, function(item) {
                            return item.geonameid == geonameId ? item : null;
                        });

                        if (responseValue) {
                            self.$input.val(responseValue['0'].value);
                        }

                        return false;
                    }

                    // Reset both field as nothing is no more sychronized
                    resetGeonameField();
                    resetCityField();
                }
            }
        });
    };

    var methods = {
        init: function(options) {
            var settings = $.extend({
                server: ''
            }, options);

            if ('' === settings.server) {
                throw '"server" mus be set'
            }

            return this.each(function() {
                var geocompleter = new GeotoCompleter(this, settings.server, settings);
                geocompleter.init();
            });
        },
        destroy: function() {
            return this.each(function() {
                var geocompleter = $(this).data('geocompleter');
                if (geocompleter) {
                    geocompleter.destroy();
                }
            });
        },
        autocompleter: function() {
            return this.each(function() {
                var geocompleter = $(this).data('geocompleter');
                geocompleter.getAutocompleter().autocomplete.apply(this, arguments);
            });
        }
    };

    $.fn.geocompleter = function(method) {

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.geocompleter');
        }
    };
})(window, jQuery);
