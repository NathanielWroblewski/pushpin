get '/comments' do
  content_type :json
  comments = Comment.all.each_with_object({}) do |comment, memo|
    memo[comment.county_id] = { text: comment.text, author: comment.author }
  end
  comments.to_json
end

post '/comments' do
  content_type :json
  comment = Comment.new(params[:comment])
  { success: comment.save }.to_json
end
