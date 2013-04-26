# Geonames Server Jquery Plugin

## How it works

This jquery plugin binds a **geoname-id** field to a geonames server.

It will create an additional input that will list all data from the
[Geonames Server](https://github.com/alchemy-fr/GeonamesServer)
 according to the user query and fill the origin input with the proper
geoname-id.

## Dependencies

This plugins depends on the [jQuery Autocomplete widget](http://api.jqueryui.com/autocomplete/)
which requires :

 - [UI core] (http://api.jqueryui.com/category/ui-core/)
 - [Widget Factory] (http://api.jqueryui.com/jQuery.widget/)
 - [Position] (http://api.jqueryui.com/position/)
 - [Menu](http://api.jqueryui.com/menu/)

*note* : This widget requires some functional CSS, otherwise it won't work.
If you build a custom theme, use the widget's specific CSS file as a starting point.

## Example

```html
<input id="geoname-id" value="" />

<script type="text/javascript">
    $("#geoname-id").geocompleter({
        "targetUrl": "http://geonames-server.url/"
    });
</script>
```

