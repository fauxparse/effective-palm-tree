# frozen_string_literal: true
class CreateAllocations < ActiveRecord::Migration[5.1]
  def change
    create_table :allocations do |t|
      t.belongs_to :event, foreign_key: { on_delete: :cascade }
      t.belongs_to :role, foreign_key: { on_delete: :cascade }
      t.integer :min, required: true, default: 0
      t.integer :max, required: false
      t.integer :position, required: true
      t.timestamps

      t.index [:event_id, :role_id]
    end
  end
end
