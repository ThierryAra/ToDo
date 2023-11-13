class CreateTasks < ActiveRecord::Migration[7.1]
  def change
    create_table :tasks do |t|
      t.string :title, null: false
      t.text :note
      t.boolean :completed, null: false
      t.references :list, null: false, foreign_key: true

      t.timestamps
    end
  end
end
