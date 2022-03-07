class AddCompressedContentColumnToDocuments < ActiveRecord::Migration[6.1]
  def change
    add_column :documents, :compress_content, :binary
  end
end
