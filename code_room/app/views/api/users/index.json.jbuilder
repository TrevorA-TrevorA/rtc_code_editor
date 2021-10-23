json.array! @users do |user|
  json.id user.id
  json.email user.email
  json.username user.username
  json.documents user.documents
  json.collaborations user.collaborations
  json.collab_documents user.collab_documents
  json.accepted_collab_documents user.accepted_collab_documents
  json.pending_collab_documents user.pending_collab_documents
  json.avatar_url user.avatar_url
end