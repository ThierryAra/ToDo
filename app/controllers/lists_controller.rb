class ListsController < ApplicationController
    def new
        @list = List.new
    end

    def show
        @lists = List.includes(:tasks).all
        redirect_back(fallback_location: root_path)
    end
end
