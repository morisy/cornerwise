define(["backbone", "config"],
       function(B, config) {
           return B.View.extend({
               initialize: function(options) {
                   var linked = options.linkedMap;

                   if (!linked) return;

                   var map = L.map(this.el,
                                   {attributionControl: false,
                                    dragging: false,
                                    touchZoom: false,
                                    scrollWheelZoom: false,
                                    boxZoom: false,
                                    zoomControl: false,
                                    minZoom: 11,
                                    maxZoom: 11,
                                    layers: [
                                        L.tileLayer(config.tilesURL)
                                    ]}),
                       rectLayer = L.rectangle(linked.getBounds(),
                                               config.minimapRectStyle);
                   map.addLayer(rectLayer)
                       .setZoom(11)
                       .setView(linked.getCenter());

                   this.rect = rectLayer;

                   linked.on("drag moveend resize zoomend",
                             function(e) {
                                 rectLayer.setBounds(linked.getBounds());
                             });
                   map.on("click",
                          function(e) {
                              linked.setView(e.latlng);
                          });

                   $.getJSON("/static/scripts/src/layerdata/somerville.geojson")
                       .done(function(features) {
                           map.addLayer(
                               L.geoJson(features,
                                         {style: {
                                             stroke: true,
                                             weight: 2,
                                             fill: false
                                         }}));
                       });
               }
           });
       });