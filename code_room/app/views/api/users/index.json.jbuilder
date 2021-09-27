json.array! @users do |user|
  json.id user.id
  json.email user.email
  json.username user.username
  json.documents user.documents
  json.editable_documents user.editable_documents
end