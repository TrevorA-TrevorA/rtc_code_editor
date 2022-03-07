# frozen_string_literal: true
require 'base64'

class DocumentsController < ApplicationController
  before_action :confirm_logged_in
  
  def create
    @document = Document.new(document_params)
    @document.admin_id = request.path_parameters[:user_id]
    if @document.save
      @document.decompress!
      render status: 201, json: @document
    else
      render status: 400, json: { error: @document.errors.full_messages }
    end
  end

  def destroy
    @document = Document.find_by(id: params[:id])
    if @document.admin != current_user
      render status: 401, json: { error: "unauthorized" }
      return
    end

    if @document
      @collaborations = Collaboration.where(document_id: params[:id])
      destroy_collaborations(@collaborations)
      @document.destroy
      render status: 200, json: { document_id: @document.id }
    else
      render status: 404
    end
  end

  def index
    if current_user.id != params[:user_id]
      render status: 401, json: {error: "unauthorized"}
      return
    end

    @documents = Document.where(admin_id: request.path_parameters[:user_id]).map do |doc|
      doc.decompress!
    end

    render json: @documents
  end

  def show
    @document = Document.find_by(id: params[:id])
    if !authorized_user?(@document)
      render status: 401, json: { error: "unauthorized" }
      return
    end

    if @document
      @document.decompress!
      render json: @document
    else
      render status: 404
    end
  end

  def update
    @document = Document.find_by(id: params[:id])

    if !authorized_user?(@document)
      render status: 401, json: { error: "unauthorized" }
      return
    end

    if @document.update(document_params)
      @document.decompress!
      render json: @document
      data = { saved_state: @document, admin_id: @document.admin_id }
      ActionCable.server.broadcast("doc_channel_#{params[:id]}", data)
    else
      render status: 400, json: { error: @document.errors.full_messages }
    end
  end

  private

  def document_params
    params.require(:document).permit(:file_name, :size, :content)
  end

  def authorized_user?(document)
    is_editor = document.editors.pluck(:id).include?(current_user.id)
    is_admin = document.admin_id == current_user.id
    is_editor || is_admin
  end

end
