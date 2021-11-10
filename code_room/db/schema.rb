# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_11_10_032702) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "hstore"
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "collaborations", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "editor_id", null: false
    t.uuid "document_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "accepted", default: false, null: false
    t.index ["document_id"], name: "index_collaborations_on_document_id"
    t.index ["editor_id"], name: "index_collaborations_on_editor_id"
  end

  create_table "document_connections", force: :cascade do |t|
    t.uuid "editor_id", null: false
    t.uuid "document_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["document_id"], name: "index_document_connections_on_document_id"
    t.index ["editor_id"], name: "index_document_connections_on_editor_id"
  end

  create_table "documents", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "file_name", null: false
    t.text "content"
    t.uuid "admin_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.float "size", null: false
    t.text "pending_revisions"
    t.index ["admin_id"], name: "index_documents_on_admin_id"
  end

  create_table "notifications", force: :cascade do |t|
    t.boolean "read", default: false, null: false
    t.string "notification_type", null: false
    t.uuid "recipient_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.hstore "details"
    t.index ["recipient_id"], name: "index_notifications_on_recipient_id"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "username", null: false
    t.string "password_digest", null: false
    t.string "email", null: false
    t.integer "friends", default: [], array: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "session_token", null: false
    t.string "avatar_url"
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "collaborations", "documents"
  add_foreign_key "collaborations", "users", column: "editor_id"
  add_foreign_key "document_connections", "users", column: "editor_id"
  add_foreign_key "documents", "users", column: "admin_id"
  add_foreign_key "notifications", "users", column: "recipient_id"
end
