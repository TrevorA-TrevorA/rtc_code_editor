class CollaborationsController < ApplicationController
  def index
    @collaborations = Collaboration.where(editor_id: request.path_parameters[:user_id])
    render json: @collaborations
  end

  def update
    @collaboration = Collaboration.find(params[:id])
    @collaboration.update(accepted: true)
    render json: @collaboration
  end
  
  def create
    @collaboration = Collaboration.new(collaboration_params)

    if @collaboration.save
      render status: 201
    else
      render status: 400
    end
  end
  
  
  def destroy
    @collaboration = Collaboration.find(params[:id])

    if @collaboration
      @collaboration.destroy
      render status: 200
    else
      render status: 404
    end
  end
end
