# frozen_string_literal: true

class CreateAvailabilities < ActiveRecord::Migration[5.1]
  def change
    create_table :availabilities do |t|
      t.belongs_to :member, foreign_key: { on_delete: :cascade }
      t.belongs_to :occurrence, foreign_key: { on_delete: :cascade }
      t.boolean :available, required: true, default: true
      t.timestamps

      t.index %i[member_id occurrence_id], unique: true
      t.index %i[occurrence_id member_id], unique: true
    end
  end
end
