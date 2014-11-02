var GOOGLE_GEOCODER_API = 'https://maps.googleapis.com/maps/api/geocode/json'

var latitude
  , longitude
  , county
  , state
  , countyId
  , counties = {}
  , us
  , comments

var width = 960
  , height = 600
  , map = d3.map()

var quantize = d3.scale.quantize()
    .domain([0, 100])
    .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

var projection = d3.geo.albersUsa()
    .scale(1280)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select(".map").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.select(self.frameElement).style("height", height + "px");

$.when(getVisitorCounty(), fetchAllCounties(), fetchComments()).then(function() {
  incrementVisitors()
  queue()
    .defer(d3.json, '/us.json')
    .defer(d3.json, '/pins')
    .await(ready);
})

function ready(error, us, countyData) {
  for (index in countyData.pins) {
    var id    = countyData.pins[index][0]
      , count = countyData.pins[index][1]

    if (Number(countyData.max) === 0) {
      var max = 1
    } else {
      var max = Number(countyData.max)
    }
    map.set(id, Math.floor((Number(count) / max) * 100))
  }

  $('.spinner').hide()
  $('.hidden-content').fadeIn()

  $('form').on('submit', function(e) {
    e.preventDefault()
    $.post('/comments', $(this).serialize(), function(response) {
      if (response.success) {
        $('form').fadeOut()
        $('.success').fadeIn()
      } else {
        $('.errors').show()
      }
    })
  })

  svg.append("g")
      .attr("class", "counties")
    .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
      .attr("class", function(d) { return quantize(map.get(d.id)); })
      .attr("tooltip", function(d) {
        comment = comments[d.id]
        if (comment) {
          return '<span class="text">' + comment.text +
            '</span><br /><span class="author">' + comment.author + '</span>'
        } else {
          return "No comment!  Leave a comment!"
        }
      })
      .attr("d", path);

  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("class", "states")
      .attr("d", path);

  $('svg').on('mouseenter', 'path[class*="q"]', showTooltip)
  $('svg').on('mouseleave', 'path[class*="q"]', hideTooltip)
}

function showTooltip(e) {
  var val = $(e.target).attr('tooltip');
  $('.tooltip').html(val);
  $('.tooltip').css({
    left: ((e.pageX - 25) + "px"),
    top: ((e.pageY - 75) + "px")
  })
  $('.tooltip').show()
}

function hideTooltip() {
  $('.tooltip').hide()
}

function getVisitorCounty() {
  var deferred = new $.Deferred()

  getVisitorLatLong(getCountyFromLatLong, deferred)

  return deferred.promise()
}

function incrementVisitors() {
  setCountyId()
  increment()
}

function setCountyId() {
  if (counties[state][county]) {
    countyId = counties[state][county]
  } else if (counties[state][county + ' county']) {
    countyId = counties[state][county + ' county']
  } else {
    countyId = null
  }
  return $('input[type=hidden]').val(countyId)
}

function increment() {
  $.post('/pins/' + countyId)
}

function fetchAllCounties() {
  var deferred = new $.Deferred()

  d3.json('/counties.json', function(response) {
    counties = response;
    deferred.resolve(counties);
  })

  return deferred.promise()
}

function fetchComments() {
  var deferred = new $.Deferred()

  $.get('/comments', function(response) {
    comments = response
    deferred.resolve(comments)
  })

  return deferred.promise()
}

function getCountyFromLatLong(latitude, longitude, deferred) {
  $.get(GOOGLE_GEOCODER_API +
    '?latlng=' + latitude + ',' + longitude + '&sensor=false',
    function(response) {
      var address = response.results[0].address_components
      county = address[3].long_name.toLowerCase();
      state = address[5].short_name.toLowerCase();
      deferred.resolve();
    }
  )
}

function getVisitorLatLong(callback, deferred) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(geoposition) {
      latitude  = geoposition.coords.latitude;
      longitude = geoposition.coords.longitude;
      return callback(latitude, longitude, deferred);
    })
  } else {
    return
  }
}
