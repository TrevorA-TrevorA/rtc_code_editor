class CollaborationsController < ApplicationController
  def create
    @collaboration = Collaboration.new(collaboration_params)

    if @collaboration.save
      render status: 201
    else
      render status: 400
    end
  end
  
  
  def delete
    @collaboration = Collaboration.find(params[:id])

    if @collaboration
      @collaboration.destroy
      render status: 200
    else
      render status: 404
    end
  end
  
  
  def index
    @collaborations = Collaboration.where(editor_id: request.path_parameters[:user_id])
    render json: @collaborations
  end
end
