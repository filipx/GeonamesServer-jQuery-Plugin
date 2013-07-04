# Geonames Server jQuery Plugin

[![Build Status](https://travis-ci.org/alchemy-fr/GeonamesServer-jQuery-Plugin.png?branch=master)](https://travis-ci.org/alchemy-fr/GeonamesServer-jQuery-Plugin)

This jQuery plugin allows auto-completion for locations in an `<input>` HTML tag.

It requires an acces to a working [Geonames Server](https://github.com/alchemy-fr/GeonamesServer).

## Dependencies

This plugins depends on the [jQuery Autocomplete widget](http://api.jqueryui.com/autocomplete/)
which requires :

 - [UI core] (http://api.jqueryui.com/category/ui-core/)
 - [Widget Factory] (http://api.jqueryui.com/jQuery.widget/)
 - [Position] (http://api.jqueryui.com/position/)
 - [Menu](http://api.jqueryui.com/menu/)

*note* : This widget requires some functional CSS, otherwise it would not work.
If you build a custom theme, use the widget's specific CSS file as a starting point.

## Usage

```html
<input id="geoname-id" value="" />

<script type="text/javascript">
    $("#geoname-id").geocompleter({
        "server": "http://geonames-server.tld/",
        "limit" : 30,
        "sort" : "population"
    });
</script>
```

## Options

- **sort** (optional, string, default value : population) available values :

  - population : The results will be sorted by population.
  - closeness : The results will be sorted by closeness to the place the request was sent from.

- **name** (optional, string) : Filters city whose begins with a given name.

- **country** (optional, string) : Only cities located in countries whose name begins with this parameter will be returned.

- **limit** (optional, string) : The number of results.

- **client-ip** (optional, string) : This parameter is used within the *closeness* sort parameter to provide a custom remote IP. `/city?sort=closeness&client-ip=80.12.81.19`

- **init-input** (optional, boolean) : option to initialize the autocompleter with a geoname-id

- **onInit** (optional, function) : callback triggered after plugin initialization, it takes original input and autocomplete input as arguments

## Advanced usage

```html
<input id="geoname-id" value="" />

<script type="text/javascript">
    var geocompleter = $("#geoname-id").geocompleter({
        "server": "http://geonames-server.tld/",
    });

    // You can override any option of the jquery ui autocomplete widget
    // see available options http://api.jqueryui.com/autocomplete/

    // setter
    geocompleter.geocompleter("autocompleter", "option", "disabled", true);
    //getter
    geocompleter.geocompleter("autocompleter", "option", "disabled");

    // You can bind your own callback to the jquery ui autocomplete events
    geotocompleter("autocompleter", "on", "autocompletechange", function(event, ui) {});

    // This plugin defines a custom event when ajax request to the geonames server fails
    geocompleter.geocompleter("autocompleter", "on", "geotocompleter.request.error", function(jqXhr, status, error) {});
</script>
```

## Run tests

This plugin is testable. You need [PhantomJS](http://phantomjs.org/) to run the test suite.
Install developer dependencies before running the test suite.

```
npm install
make test
```

## License

This project is licensed under the [MIT license](http://opensource.org/licenses/MIT).

