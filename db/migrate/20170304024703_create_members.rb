# frozen_string_literal: true

class CreateMembers < ActiveRecord::Migration[5.1]
  def change
    create_table :members do |t|
      t.belongs_to :group, required: true, foreign_key: { on_delete: :cascade }
      t.string :name, required: true, limit: 128
      t.string :slug, required: true, limit: 160
      t.boolean :admin, required: true, default: false
      t.timestamps

      t.index %i[group_id slug], unique: true
    end
  end
end
