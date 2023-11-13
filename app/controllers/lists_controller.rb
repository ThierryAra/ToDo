class ListsController < ApplicationController
    before_action :set_list

    def new
        @list = List.create(title: 'New list', description: 'description')
        
        redirect_back(fallback_location: root_path)
    end

    def show
        redirect_back(fallback_location: root_path)
    end

    private
    def set_list
        @lists = List.includes(:tasks).all
    end
end
