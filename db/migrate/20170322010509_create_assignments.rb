# frozen_string_literal: true

class CreateAssignments < ActiveRecord::Migration[5.1]
  def change
    create_table :assignments do |t|
      t.belongs_to :member, foreign_key: { on_delete: :cascade }
      t.belongs_to :occurrence, foreign_key: { on_delete: :cascade }
      t.belongs_to :allocation, foreign_key: { on_delete: :cascade }
      t.timestamps
      t.timestamp :confirmed_at

      t.index %i[occurrence_id allocation_id member_id],
        unique: true,
        name: :index_assignments_per_occurrence
      t.index %i[member_id occurrence_id]
    end
  end
end
