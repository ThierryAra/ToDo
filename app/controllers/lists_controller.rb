class ListsController < ApplicationController
    before_action :set_list
    after_action :set_session

    def new
        @list = List.create(title: 'New list', description: 'description')

        if @list.save
            flash[:success] = 'List created successfully!'
            session[:reload_root] = true
            session[:flash_message] = flash.to_hash
        else
            flash[:error]  = 'Failed to create list.'
        end
    
        redirect_to root_path
    end

    def destroy
        @list = List.find(params[:id])
        @list.destroy

        if @list.destroy
            flash[:success] = 'List deleted successfully!'
        else
            flash[:error]  = 'Failed to delete list.'
        end
        
        session[:reload_root] = true
        session[:flash_message] = flash.to_hash
        redirect_to root_path
    end

    def update
        @list = List.find(params[:id])
        if @list.update(list_params)
            render json: { success: true, message: 'List updated successfully' }
        else
            render json: { success: false, message: 'Error updating list' }
        end
    end
    
    private
    def list_params
        params.require(:list).permit(:title, :description)
    end 

    def set_list
        @lists = List.includes(:tasks).all
    end

    def set_session
        session[:reload_root] = true
        session[:flash_message] = flash.to_hash
    end
end
