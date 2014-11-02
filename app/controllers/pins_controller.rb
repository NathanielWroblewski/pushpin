get '/' do
  @comments = Comment.order(created_at: :desc).limit(1)
  erb :index
end

get '/pins' do
  content_type :json
  pins = Pin.pluck(:county_id, :visitor_count)
  max  = Pin.order(visitor_count: :desc).limit(1).first.visitor_count
  { pins: pins, max: max }.to_json
end

post '/pins/:county_id' do
  content_type :json
  pin = Pin.find_by(county_id: params[:county_id])
  { success: pin.update(visitor_count: pin.visitor_count + 1) }.to_json
end
