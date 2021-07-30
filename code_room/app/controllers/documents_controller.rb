# frozen_string_literal: true

class DocumentsController < ApplicationController
  def create
    @document = Document.new(document_params)
    @document.admin_id = request.path_parameters[:user_id]
    if @document.save
      render status: 201, json: @document
    else
      render status: 400
    end
  end

  def delete
    @document = Document.find_by(id: params[:id])

    if @document
      @document.destroy
    else
      render status: 404
    end
  end

  def index
    @documents = Document.where(admin_id: request.path_parameters[:user_id])

    render json: @documents
  end

  def show
    @document = Document.find_by(id: params[:id])

    if @document
      render json: @document
    else
      render status: 404
    end
  end

  def update
    @document = Document.find_by(id: params[:id])

    if @document.update(document_params)
      render json: @document
    else
      render status: 400
      flash.now[:errors] = @document.errors.full_messages
    end
  end
end

private

def document_params
  params.require(:document).permit(:file_name, :content)
end