class AddCountyIdToComments < ActiveRecord::Migration
  def change
    add_column :comments, :county_id, :string
  end
end
