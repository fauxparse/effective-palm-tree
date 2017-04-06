# frozen_string_literal: true

class RenameAvailabilitiesToAvailability < ActiveRecord::Migration[5.1]
  def change
    rename_table :availabilities, :availability
  end
end
