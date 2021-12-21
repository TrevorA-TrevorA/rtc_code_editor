class CollaborationsController < ApplicationController
  def index
    @collaborations = Collaboration.where(editor_id: request.path_parameters[:user_id])
    render json: @collaborations
  end

  def update
    @collaboration = Collaboration.find(params[:id])
    @collaboration.update(accepted: true)
    @document = Document.find(@collaboration.document_id)
    render json: { collaboration: @collaboration, document: @document }
  end
  
  def create
    editor_id = params[:user_id]
    document_id = params[:collaboration][:document_id];
    @collaboration = Collaboration.new(editor_id: editor_id, document_id: document_id, accepted: false);

    if @collaboration.save!
      render status: 201, json: @collaboration
    else
      render status: 400
    end
  end

  def destroy_by_document
    user_id = request.path_parameters[:user_id]
    doc_id = request.path_parameters[:document_id]
    @collaboration = Collaboration.find_by(editor_id: user_id, document_id: doc_id)
    collab_id = @collaboration.id
    
    if @collaboration
      @collaboration.destroy
      render status: 200, json: { status: 200, collaboration_id: collab_id }
    else
      render status: 404, json: { status: 404 }
    end
  end
  
  
  def destroy
    collab_id = request.path_parameters[:id]
    @collaboration = Collaboration.find(collab_id)

    if @collaboration
      @collaboration.destroy
      render status: 200, json: { status: 200, collaboration_id: collab_id }
    else
      render status: 404, json: { status: 404 }
    end
  end


  def collaboration_params
    params.require(:collaboration).permit(:editor_id, :document_id, :accepted)
  end
end
