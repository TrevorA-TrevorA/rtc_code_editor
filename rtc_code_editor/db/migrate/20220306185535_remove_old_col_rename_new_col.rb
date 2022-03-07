require 'zlib'

class RemoveOldColRenameNewCol < ActiveRecord::Migration[6.1]
  Document.all.each do |doc|
    compressed = Zlib::Deflate.deflate(doc.content)
    doc.update(compress_content: compressed)
  end

  def change
    remove_column :documents, :content
    rename_column :documents, :compress_content, :content
  end
end
