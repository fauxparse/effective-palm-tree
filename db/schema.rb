# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170307224225) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "availabilities", force: :cascade do |t|
    t.bigint "member_id"
    t.bigint "occurrence_id"
    t.boolean "available", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["member_id", "occurrence_id"], name: "index_availabilities_on_member_id_and_occurrence_id", unique: true
    t.index ["member_id"], name: "index_availabilities_on_member_id"
    t.index ["occurrence_id", "member_id"], name: "index_availabilities_on_occurrence_id_and_member_id", unique: true
    t.index ["occurrence_id"], name: "index_availabilities_on_occurrence_id"
  end

  create_table "events", force: :cascade do |t|
    t.string "name", limit: 128
    t.text "description"
    t.string "slug", limit: 128
    t.datetime "starts_at"
    t.datetime "ends_at"
    t.text "schedule_options", default: "{}"
    t.string "timezone", default: "Wellington"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "group_id"
    t.index ["group_id", "slug"], name: "index_events_on_group_id_and_slug", unique: true
    t.index ["group_id", "starts_at", "ends_at"], name: "index_events_on_group_id_and_starts_at_and_ends_at"
    t.index ["group_id"], name: "index_events_on_group_id"
    t.index ["slug"], name: "index_events_on_slug"
    t.index ["starts_at", "ends_at"], name: "index_events_on_starts_at_and_ends_at"
  end

  create_table "groups", force: :cascade do |t|
    t.string "name", limit: 128
    t.string "slug", limit: 160
    t.integer "members_count", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_groups_on_slug", unique: true
  end

  create_table "members", force: :cascade do |t|
    t.bigint "group_id"
    t.string "name", limit: 128
    t.string "slug", limit: 160
    t.boolean "admin", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.index ["group_id", "slug"], name: "index_members_on_group_id_and_slug", unique: true
    t.index ["group_id"], name: "index_members_on_group_id"
    t.index ["user_id", "group_id"], name: "index_members_on_user_id_and_group_id", unique: true
    t.index ["user_id"], name: "index_members_on_user_id"
  end

  create_table "occurrences", force: :cascade do |t|
    t.bigint "event_id"
    t.datetime "starts_at"
    t.datetime "ends_at"
    t.boolean "deleted", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["event_id", "starts_at", "ends_at"], name: "index_occurrences_on_event_id_and_starts_at_and_ends_at", unique: true
    t.index ["event_id"], name: "index_occurrences_on_event_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "email", null: false
    t.string "encrypted_password", limit: 128, null: false
    t.string "confirmation_token", limit: 128
    t.string "remember_token", limit: 128, null: false
    t.index ["email"], name: "index_users_on_email"
    t.index ["remember_token"], name: "index_users_on_remember_token"
  end

  add_foreign_key "availabilities", "members", on_delete: :cascade
  add_foreign_key "availabilities", "occurrences", on_delete: :cascade
  add_foreign_key "events", "groups", on_delete: :cascade
  add_foreign_key "members", "groups", on_delete: :cascade
  add_foreign_key "members", "users", on_delete: :nullify
  add_foreign_key "occurrences", "events", on_delete: :cascade
end
