class ListsController < ApplicationController
    before_action :set_list

    def new
        @list = List.create(title: 'New list', description: 'description')
        
        redirect_back(fallback_location: root_path)
    end

    def show
        redirect_back(fallback_location: root_path)
    end

    def destroy
        @list = List.find(params[:id])
        @list.destroy
    
        respond_to do |format|
          format.html { redirect_to root_path, notice: 'Lista excluída com sucesso.' }
          format.json { head :no_content }
        end
    end

    private
    def set_list
        @lists = List.includes(:tasks).all
    end
end
