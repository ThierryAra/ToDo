class PagesController < ApplicationController
    def home
        @lists = List.includes(:tasks).all
    end
end
