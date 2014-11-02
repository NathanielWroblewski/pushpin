raw_counties = File.readlines(APP_ROOT.join('public', 'counties.json')).join
counties = JSON.parse(raw_counties).to_hash

counties.each do |state, values|
  values.each do |county, id|
    Pin.create(county_id: id, visitor_count: 0)
  end
end
