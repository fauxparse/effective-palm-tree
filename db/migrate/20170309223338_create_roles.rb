# frozen_string_literal: true

class CreateRoles < ActiveRecord::Migration[5.1]
  def change
    create_table :roles do |t|
      t.belongs_to :group
      t.string :name, limit: 32, required: true
      t.string :plural, limit: 32
      t.string :slug, limit: 48, required: true

      t.index %i[group_id slug], unique: true
    end
  end
end
