# frozen_string_literal: true
class AddUserIdToMembers < ActiveRecord::Migration[5.1]
  def change
    change_table :members do |t|
      t.belongs_to :user, required: false, foreign_key: { on_delete: :nullify }
      t.index [:user_id, :group_id], unique: true
    end
  end
end
