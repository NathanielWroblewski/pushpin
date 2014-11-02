class CreatePins < ActiveRecord::Migration
  def change
    create_table :pins do |t|
      t.string :county_id
      t.integer :visitor_count
    end
  end
end
