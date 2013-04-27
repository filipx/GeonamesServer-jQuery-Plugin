# Geonames Server jQuery Plugin

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
        "server": "http://geonames-server.tld/"
    });
</script>
```

## License

This project is licensed under the [MIT license](http://opensource.org/licenses/MIT).

