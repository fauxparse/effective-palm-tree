class CreateGroups < ActiveRecord::Migration[5.1]
  def change
    create_table :groups do |t|
      t.string :name, required: true, limit: 128
      t.string :slug, required: true, limit: 160
      t.integer :members_count, required: true, default: 0
      t.timestamps

      t.index :slug, unique: true
    end

    change_table :events do |t|
      t.belongs_to :group, required: true, foreign_key: { on_delete: :cascade }
      t.index [:group_id, :slug], unique: true
      t.index [:group_id, :starts_at, :ends_at]
    end
  end
end
