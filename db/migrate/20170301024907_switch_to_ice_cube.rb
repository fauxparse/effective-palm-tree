class SwitchToIceCube < ActiveRecord::Migration[5.1]
  def up
    remove_column :events, :duration
    rename_column :events, :recurrence_options, :schedule_options
  end

  def down
    change_table :events do |t|
      t.integer :duration, required: true, default: 1.hour
    end

    rename_column :events, :schedule_options, :recurrence_options
  end
end
