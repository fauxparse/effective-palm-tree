# frozen_string_literal: true

class AddAvatarUrlToMembers < ActiveRecord::Migration[5.1]
  def change
    change_table :members do |t|
      t.string :avatar_url, limit: 256
    end
  end
end
