class ListsController < ApplicationController
    before_action :set_list

    def new
        @list = List.create(title: 'New list', description: 'description')
        
        redirect_to root_path
    end

    def show
        redirect_to root_path
    end

    def destroy
        @list = List.find(params[:id])
        @list.destroy
    
        respond_to do |format|
          format.html { redirect_to root_path, notice: 'Lista excluída com sucesso.' }
          format.json { head :no_content }
        end
    end

    def update
        @list = List.find(params[:id])
        if @list.update(list_params)
          render json: { success: true, message: 'List updated successfully' }
            else
          render json: { success: false, message: 'Error updating list' }
        end
    end

    def list_params
        params.require(:list).permit(:title, :description)
    end 
    private
    def set_list
        @lists = List.includes(:tasks).all
    end
end
