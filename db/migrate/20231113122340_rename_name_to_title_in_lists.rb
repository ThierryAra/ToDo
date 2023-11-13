class RenameNameToTitleInLists < ActiveRecord::Migration[7.1]
  def change
    rename_column :lists, :name, :title
  end
end
