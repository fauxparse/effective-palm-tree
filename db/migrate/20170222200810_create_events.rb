class CreateEvents < ActiveRecord::Migration[5.1]
  def change
    create_table :events do |t|
      t.string :name, limit: 128, required: true
      t.text :description
      t.string :slug, limit: 128, required: true
      t.datetime :starts_at, required: true
      t.datetime :ends_at, required: false
      t.integer :duration, required: true, default: 1.hour
      t.text :recurrence_options, required: true, default: {}.to_json
      t.string :timezone, required: true, default: Time.zone.name
      t.timestamps

      t.index :slug
      t.index [:starts_at, :ends_at]
    end
  end
end
